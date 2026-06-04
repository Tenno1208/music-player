<script setup>
import { ref, watch, computed } from 'vue'
import { usePlayerStore } from '~/stores/player'

const player = usePlayerStore()

const { data: musicData, error } = await useFetch('/api/tracks')

const tracks = computed(() => musicData.value?.results || [])

const audioPlayer = ref(null)

watch(
  () => player.currentTrack,
  async () => {
    if (!audioPlayer.value || !player.currentTrack) return

    audioPlayer.value.load()

    if (player.isPlaying) {
      try {
        await audioPlayer.value.play()
      } catch (err) {
        console.error(err)
      }
    }
  }
)

watch(
  () => player.isPlaying,
  async (playing) => {
    if (!audioPlayer.value) return

    try {
      if (playing) {
        await audioPlayer.value.play()
      } else {
        audioPlayer.value.pause()
      }
    } catch (err) {
      console.error(err)
    }
  }
)
</script>