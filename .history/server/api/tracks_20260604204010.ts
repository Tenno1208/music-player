// server/api/tracks.ts
export default defineEventHandler((event) => {
  // Simulasi data dari API musik eksternal yang menyediakan direct stream link (.mp3)
  return {
    status: 'success',
    results: [
      {
        id: '1',
        name: 'Lo-Fi Chill Sunset',
        artist_name: 'Lofi Dreamer',
        album_name: 'Cozy Nights',
        audio: '[https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3](https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3)',
        cover: '[https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60)'
      },
      {
        id: '2',
        name: 'Ambient Deep Focus',
        artist_name: 'Synth Wave Tech',
        album_name: 'Digital Horizons',
        audio: '[https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3](https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3)',
        cover: '[https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=60](https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=60)'
      },
      {
        id: '3',
        name: 'Midnight Coding Beats',
        artist_name: 'Byte Dancer',
        album_name: 'Syntax Error Echoes',
        audio: '[https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3](https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3)',
        cover: '[https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=150&auto=format&fit=crop&q=60](https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=150&auto=format&fit=crop&q=60)'
      }
    ]
  }
})