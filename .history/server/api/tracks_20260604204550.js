// server/api/tracks.js
export default defineEventHandler((event) => {
  return {
    status: 'success',
    results: [
      {
        id: '1',
        name: 'Ricky Montgomery - Line Without a Hook',
        artist_name: 'Ricky Montgomery',
        album_name: 'Montgomery Ricky',
        // Kita simpan ID video YouTube-nya saja
        youtube_id: 'SQtO_PvY2G0', 
        cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60'
      },
      {
        id: '2',
        name: 'Lofi Hip Hop Radio - Beats to Relax/Study',
        artist_name: 'Lofi Girl',
        album_name: 'Live Stream',
        youtube_id: 'jfKfPfyJRdk', 
        cover: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=60'
      }
    ]
  }
})