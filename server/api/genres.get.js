// Kategori genre live dari Deezer — gratis, TANPA API key
const DEEZER = 'https://api.deezer.com'

// id genre resmi Deezer + warna gradient chip
const CATEGORIES = [
  { id: 132, name: 'Pop',                colors: ['#fb7185', '#9f1239'] },
  { id: 116, name: 'Hip-Hop',            colors: ['#fb923c', '#7c2d12'] },
  { id: 152, name: 'Rock',               colors: ['#ef4444', '#27272a'] },
  { id: 106, name: 'Elektronik',         colors: ['#818cf8', '#312e81'] },
  { id: 113, name: 'Dance',              colors: ['#e879f9', '#701a75'] },
  { id: 165, name: 'R&B',                colors: ['#a78bfa', '#4c1d95'] },
  { id: 129, name: 'Jazz',               colors: ['#38bdf8', '#1e3a8a'] },
  { id: 466, name: 'Folk & Akustik',     colors: ['#34d399', '#134e4a'] },
  { id: 144, name: 'Reggae',             colors: ['#a3e635', '#3f6212'] },
  { id: 85,  name: 'Indie & Alternatif', colors: ['#22d3ee', '#0f172a'] },
  // kategori pencarian (tidak ada genre resmi di Deezer) → pakai query
  { name: 'Pop Indonesia', query: 'pop indonesia', colors: ['#fbbf24', '#92400e'] },
  { name: 'Dangdut',       query: 'dangdut',       colors: ['#facc15', '#854d0e'] },
  { name: 'K-Pop',         query: 'kpop',          colors: ['#f472b6', '#9d174d'] },
  { name: 'Lo-Fi',         query: 'lofi beats',    colors: ['#94a3b8', '#1c1917'] }
]

const slugify = (s) => String(s).replace(/\s+/g, '-')

export default defineCachedEventHandler(async () => {
  try {
    // 1. Ambil semua genre Deezer sekali → dapat picture resmi per id
    const genreList = await $fetch(`${DEEZER}/genre`)
    const pictureById = {}
    for (const g of genreList?.data || []) {
      pictureById[g.id] = g.picture_big || g.picture_medium || ''
    }

    // 2. Susun kategori final
    const result = []
    for (const cat of CATEGORIES) {
      if (cat.id) {
        result.push({
          id: String(cat.id),
          name: cat.name,
          type: 'deezer',
          image: pictureById[cat.id] || '',
          colors: cat.colors,
          href: `/genre/${cat.id}`
        })
      } else {
        // chip kategori cari: pakai foto artis teratas sebagai cover
        let image = ''
        try {
          const s = await $fetch(`${DEEZER}/search/artist`, { query: { q: cat.query, limit: 1 } })
          image = s?.data?.[0]?.picture_big || ''
        } catch (err) { /* biarkan kosong → gradient fallback */ }

        result.push({
          id: slugify(cat.query),
          name: cat.name,
          type: 'search',
          query: cat.query,
          image,
          colors: cat.colors,
          href: `/genre/${slugify(cat.query)}?name=${encodeURIComponent(cat.name)}`
        })
      }
    }
    return result
  } catch (error) {
    console.error('GENRES ERROR:', error?.message || error)
    // fallback: chips tetap tampil walau Deezer down
    return CATEGORIES.map((cat) => ({
      id: String(cat.id || slugify(cat.query)),
      name: cat.name,
      type: cat.id ? 'deezer' : 'search',
      image: '',
      colors: cat.colors,
      href: cat.id ? `/genre/${cat.id}` : `/genre/${slugify(cat.query)}?name=${encodeURIComponent(cat.name)}`
    }))
  }
}, { name: 'deezer-genres', maxAge: 60 * 60 * 24 }) // cache 24 jam (hemat rate limit)