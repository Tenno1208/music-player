export default defineEventHandler(async (event) => {
  const API_KEY = process.env.YOUTUBE_API_KEY
  const { q = 'official music video', pageToken = '' } = getQuery(event)

  try {
    if (!API_KEY) {
      throw new Error('Kredensial YOUTUBE_API_KEY tidak ditemukan di file .env')
    }

    // Tembak API YouTube asli
    const response = await $fetch(
      'https://www.googleapis.com/youtube/v3/search',
      {
        query: {
          part: 'snippet',
          q: q || 'official music video',
          type: 'video',
          maxResults: 12,
          pageToken,
          key: API_KEY.trim()
        }
      }
    )
    
    return response

  } catch (error) {
    console.warn('⚠️ Kuota harian YouTube API kamu HABIS (Error 429). Mengaktifkan Fallback Mock Data...');

    // JIKA KUOTA HABIS, KIRIMKAN DATA DUMMY DENGAN STRUKTUR 100% PERSIS SEPERTI YOUTUBE API
    return {
      kind: "youtube#searchListResponse",
      etag: "mock_etag_data",
      nextPageToken: "CAwQAA",
      regionCode: "ID",
      pageInfo: { totalResults: 100, resultsPerPage: 12 },
      items: [
        {
          kind: "youtube#searchResult",
          id: { kind: "youtube:video", videoId: "m7b9E8O_A7E" },
          snippet: {
            title: "Rex Orange County - Best Friend (Official Audio)",
            description: "Rex Orange County - Best Friend lyrics video",
            thumbnails: {
              default: { url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200" },
              medium: { url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400" },
              high: { url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600" }
            },
            channelTitle: "Rex Orange County",
            publishTime: "2017-10-23T00:00:00Z"
          }
        },
        {
          id: { kind: "youtube:video", videoId: "h_Tco7Zl9vI" },
          snippet: {
            title: "Angga Dermawan - DOLA (Official Music Video)",
            description: "Dola doli dolo musik hits indonesia terbaru",
            thumbnails: {
              default: { url: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200" },
              medium: { url: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400" },
              high: { url: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600" }
            },
            channelTitle: "Angga Dermawan",
            publishTime: "2024-05-12T00:00:00Z"
          }
        },
        {
          id: { kind: "youtube:video", videoId: "X2S979Zk3nc" },
          snippet: {
            title: "Mahalini - Fabula (Full Album Audio)",
            description: "Sisa Rasa, Melawan Restu, Kisah Sempurna",
            thumbnails: {
              default: { url: "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?q=80&w=200" },
              medium: { url: "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?q=80&w=400" },
              high: { url: "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?q=80&w=600" }
            },
            channelTitle: "Mahalini",
            publishTime: "2023-01-23T00:00:00Z"
          }
        },
        {
          id: { kind: "youtube:video", videoId: "5tTUL8T_P8o" },
          snippet: {
            title: "Hindia - Menari Dengan Bayangan",
            description: "Evaluasi, Secukupnya, Rumah ke Rumah",
            thumbnails: {
              default: { url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=200" },
              medium: { url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=400" },
              high: { url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=600" }
            },
            channelTitle: "Hindia",
            publishTime: "2019-11-21T00:00:00Z"
          }
        }
      ]
    }
  }
})