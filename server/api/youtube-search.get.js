/**
 * /api/youtube-search  →  cari videoId YouTube GRATIS tanpa API key.
 *
 * Pakai instance publik Piped + Invidious (proxy open-source untuk YouTube),
 * dicoba berurutan sampai dapat satu videoId. Hasil di-cache 30 hari di server
 * (hanya kalau ketemu — kegagalan tidak di-cache, biar bisa dicoba lagi nanti).
 *
 * Dipakai oleh stores/player.js saat memutar track yang belum punya field youtubeId.
 *
 * Response: { videoId: string | null, source: 'piped' | 'invidious' | null, instance: string }
 */

// Instance Piped (urutan = prioritas). Public instance sering naik-turun,
// makanya dicoba semua sampai ada yang merespons.
const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://pipedapi.adminforge.de',
  'https://api.piped.private.coffee',
  'https://pipedapi.leptons.xyz',
  'https://pipedapi.r4fo.com',
  'https://pipedapi.reallyaweso.me',
  'https://pipedapi.nosebs.ru'
]

// Instance Invidious sebagai fallback bila semua Piped gagal.
const INVIDIOUS_INSTANCES = [
  'https://invidious.fdn.fr',
  'https://yewtu.be',
  'https://invidious.nerdvpn.de',
  'https://inv.nadeko.net',
  'https://invidious.perennialte.ch',
  'https://invidious.einfachzocken.eu'
]

// Ambil 11-karakter videoId dari berbagai bentuk URL YouTube.
const extractId = (url) => {
  if (!url) return null
  const m = String(url).match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/)
  return m ? m[1] : null
}

export default defineCachedEventHandler(async (event) => {
  const q = getQuery(event).q
  if (!q || !String(q).trim()) return { videoId: null, source: null, instance: null }

  const query = String(q).trim()

  /* 1) Piped — response: { items: [{ url: "/watch?v=...", title, duration, ... }] } */
  for (const base of PIPED_INSTANCES) {
    try {
      const res = await $fetch(`${base}/search`, {
        query: { q: query, filter: 'videos' },
        timeout: 7000,
        retry: 0
      })
      const items = (res?.items || []).filter((i) => extractId(i?.url))
      // hindari live stream (Piped kasih duration === -1 untuk LIVE) & shorts
      const pick = items.find((i) => (i.duration ?? -1) > 0 && !i.isShort) || items[0]
      if (pick) {
        return { videoId: extractId(pick.url), source: 'piped', instance: base }
      }
    } catch (e) { /* coba instance berikutnya */ }
  }

  /* 2) Invidious — response: [{ videoId, title, lengthSeconds, ... }] */
  for (const base of INVIDIOUS_INSTANCES) {
    try {
      const res = await $fetch(`${base}/api/v1/search`, {
        query: { q: query, type: 'video', sort_by: 'relevance' },
        timeout: 7000,
        retry: 0
      })
      const items = (Array.isArray(res) ? res : res?.items || []).filter((i) => i?.videoId)
      // hindari live (lengthSeconds <= 0) & shorts
      const pick = items.find((i) => (i.lengthSeconds ?? -1) > 0 && !i.liveNow) || items[0]
      if (pick) {
        return { videoId: pick.videoId, source: 'invidious', instance: base }
      }
    } catch (e) { /* coba instance berikutnya */ }
  }

  return { videoId: null, source: null, instance: null }
}, {
  name: 'youtube-search',
  maxAge: 60 * 60 * 24 * 30,             // cache 30 hari (videoId stabil)
  shouldBypassCache: (event) => false,
  shouldCache: (event, res) => res?.videoId != null  // hanya cache kalau ketemu → kegagalan bisa dicoba ulang
})