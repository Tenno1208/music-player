<script setup>
import { ref, watch } from 'vue'
import { usePlayerStore } from '../stores/player'

const player = usePlayerStore()

const { data: musicData, error } = await useFetch('/api/tracks')

const tracks = musicData.value?.results || []

const audioPlayer = ref(null)

watch(
  () => player.currentTrack,
  async () => {
    if (audioPlayer.value && player.currentTrack) {
      audioPlayer.value.load()

      if (player.isPlaying) {
        try {
          await audioPlayer.value.play()
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
)

watch(
  () => player.isPlaying,
  async (playing) => {
    if (!audioPlayer.value) return

    if (playing) {
      try {
        await audioPlayer.value.play()
      } catch (e) {
        console.log(e)
      }
    } else {
      audioPlayer.value.pause()
    }
  }
)
</script>