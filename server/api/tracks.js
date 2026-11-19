/**
 * /api/tracks.js — Universal Music Search API
 *
 * Urutan Strategi:
 *   1. YouTube Data API v3  (filter videoCategoryId=10 = Music)
 *   2. Spotify Web API      (search type=track, konversi ke struktur YouTube-compatible)
 *   3. Fallback Mock Data   (agar UI tidak pernah kosong)
 */

export default defineEventHandler(async (event) => {
  const { q = 'top hits', pageToken = '', maxResults = 12 } = getQuery(event)
  const YT_KEY = process.env.YOUTUBE_API_KEY
  const SP_ID  = process.env.SPOTIFY_CLIENT_ID
  const SP_SEC = process.env.SPOTIFY_CLIENT_SECRET

  // ───────────────────────────────────────────
  // STRATEGY 1: YouTube Data API v3
  // ───────────────────────────────────────────
  if (YT_KEY) {
    try {
      const response = await $fetch('https://www.googleapis.com/youtube/v3/search', {
        query: {
          part: 'snippet',
          q: `${q} music`,
          type: 'video',
          videoCategoryId: '10',   // kategori Music saja
          videoEmbeddable: 'true',
          maxResults: Number(maxResults) || 12,
          pageToken: pageToken || undefined,
          regionCode: 'ID',
          relevanceLanguage: 'id',
          key: YT_KEY.trim()
        }
      })

      if (response?.items?.length) {
        return {
          source: 'youtube',
          nextPageToken: response.nextPageToken || '',
          items: response.items
        }
      }
    } catch (ytErr) {
      console.warn('[tracks] YouTube API error:', ytErr?.statusCode, ytErr?.message)
      // lanjut ke Strategy 2
    }
  }

  // ───────────────────────────────────────────
  // STRATEGY 2: Spotify Web API → konversi ke format YouTube-compatible
  //  Spotify tidak menyimpan stream video, tapi kita pakai metadata-nya
  //  (judul, artis, gambar album) lalu cari videoId-nya via YouTube
  //  Jika YouTube key sudah expired, kita buat videoId dari spotify trackId-nya
  //  sebagai fallback agar tetap bisa diputar saat YT key valid nanti.
  // ───────────────────────────────────────────
  if (SP_ID && SP_SEC) {
    try {
      // 1. Dapatkan access token Spotify
      const tokenRes = await $fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: SP_ID.trim(),
          client_secret: SP_SEC.trim()
        })
      })

      const accessToken = tokenRes.access_token
      if (!accessToken) throw new Error('Spotify token kosong')

      // 2. Cari track di Spotify
      const spSearch = await $fetch('https://api.spotify.com/v1/search', {
        headers: { Authorization: `Bearer ${accessToken}` },
        query: {
          q: q,
          type: 'track',
          limit: Number(maxResults) || 12,
          market: 'ID'
        }
      })

      const spTracks = spSearch?.tracks?.items || []
      if (!spTracks.length) throw new Error('Tidak ada hasil Spotify')

      // 3. Untuk setiap track Spotify, coba cari videoId YouTube
      //    Jika YouTube quota habis, gunakan track.id Spotify sebagai pseudo-videoId
      //    sehingga struktur data tetap konsisten
      const items = await Promise.all(
        spTracks.map(async (track) => {
          let videoId = track.id  // default: Spotify track ID (pseudo)

          if (YT_KEY) {
            try {
              const ytRes = await $fetch('https://www.googleapis.com/youtube/v3/search', {
                query: {
                  part: 'snippet',
                  q: `${track.artists[0]?.name} ${track.name} official audio`,
                  type: 'video',
                  videoCategoryId: '10',
                  videoEmbeddable: 'true',
                  maxResults: 1,
                  key: YT_KEY.trim()
                }
              })
              const hit = ytRes?.items?.[0]
              if (hit?.id?.videoId) videoId = hit.id.videoId
            } catch (_) {
              // YouTube quota habis, pakai Spotify ID sebagai videoId
            }
          }

          return {
            kind: 'youtube#searchResult',
            id: { kind: 'youtube#video', videoId },
            snippet: {
              title: `${track.name}`,
              channelTitle: track.artists?.map(a => a.name).join(', ') || 'Unknown Artist',
              description: `${track.album?.name || ''} · ${track.album?.release_date?.slice(0, 4) || ''}`,
              publishTime: track.album?.release_date || '',
              thumbnails: {
                default: { url: track.album?.images?.[2]?.url || track.album?.images?.[0]?.url || '' },
                medium: { url: track.album?.images?.[1]?.url || track.album?.images?.[0]?.url || '' },
                high: { url: track.album?.images?.[0]?.url || '' }
              }
            }
          }
        })
      )

      return {
        source: 'spotify',
        nextPageToken: '',
        items
      }

    } catch (spErr) {
      console.warn('[tracks] Spotify API error:', spErr?.message)
      // lanjut ke Strategy 3
    }
  }

  // ───────────────────────────────────────────
  // STRATEGY 3: Fallback Mock (query-aware)
  // ───────────────────────────────────────────
  console.warn('[tracks] Semua API gagal, menggunakan mock data.')

  const mockBank = [
    {
      id: { videoId: 'm7b9E8O_A7E' },
      snippet: {
        title: 'Rex Orange County - Best Friend',
        channelTitle: 'Rex Orange County',
        thumbnails: {
          default: { url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200' },
          medium: { url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400' },
          high: { url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800' }
        }
      }
    },
    {
      id: { videoId: 'h_Tco7Zl9vI' },
      snippet: {
        title: 'Angga Dermawan - DOLA',
        channelTitle: 'Angga Dermawan',
        thumbnails: {
          default: { url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200' },
          medium: { url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400' },
          high: { url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800' }
        }
      }
    },
    {
      id: { videoId: 'X2S979Zk3nc' },
      snippet: {
        title: 'Mahalini - Fabula',
        channelTitle: 'Mahalini',
        thumbnails: {
          default: { url: 'https://images.unsplash.com/photo-1487180142328-0c4e37023af5?q=80&w=200' },
          medium: { url: 'https://images.unsplash.com/photo-1487180142328-0c4e37023af5?q=80&w=400' },
          high: { url: 'https://images.unsplash.com/photo-1487180142328-0c4e37023af5?q=80&w=800' }
        }
      }
    },
    {
      id: { videoId: '5tTUL8T_P8o' },
      snippet: {
        title: 'Hindia - Menari Dengan Bayangan',
        channelTitle: 'Hindia',
        thumbnails: {
          default: { url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=200' },
          medium: { url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=400' },
          high: { url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800' }
        }
      }
    },
    {
      id: { videoId: 'RBumgq5yVrA' },
      snippet: {
        title: 'Pelangi Di Matamu - Jamrud',
        channelTitle: 'Jamrud Official',
        thumbnails: {
          default: { url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200' },
          medium: { url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400' },
          high: { url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800' }
        }
      }
    },
    {
      id: { videoId: 'Op7zKNnlqEM' },
      snippet: {
        title: 'Nadin Amizah - Bertaut',
        channelTitle: 'Nadin Amizah',
        thumbnails: {
          default: { url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=200' },
          medium: { url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400' },
          high: { url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800' }
        }
      }
    },
    {
      id: { videoId: 'kFVMoXvQ8_4' },
      snippet: {
        title: 'Tulus - Monokrom',
        channelTitle: 'Tulus',
        thumbnails: {
          default: { url: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=200' },
          medium: { url: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=400' },
          high: { url: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=800' }
        }
      }
    },
    {
      id: { videoId: 'FLGCGc7sB-Y' },
      snippet: {
        title: 'Rizky Febian - Kesempurnaan Cinta',
        channelTitle: 'Rizky Febian',
        thumbnails: {
          default: { url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=200' },
          medium: { url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400' },
          high: { url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800' }
        }
      }
    }
  ]

  // Filter mock berdasarkan query (case-insensitive substring match)
  const qLower = (q || '').toLowerCase()
  const filtered = qLower
    ? mockBank.filter(item =>
        item.snippet.title.toLowerCase().includes(qLower) ||
        item.snippet.channelTitle.toLowerCase().includes(qLower)
      )
    : mockBank

  return {
    source: 'mock',
    nextPageToken: '',
    items: filtered.length ? filtered : mockBank
  }
})
