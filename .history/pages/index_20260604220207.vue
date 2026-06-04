<script setup>
import { ref, computed } from 'vue'
import { usePlayerStore } from '~/stores/player'

const player = usePlayerStore()

const search = ref('')

const { data: musicData, error } = await useFetch('/api/tracks')

const tracks = computed(() => musicData.value?.items || [])

const filteredTracks = computed(() => {
  if (!search.value) return tracks.value

  return tracks.value.filter(track =>
    track.snippet?.title
      ?.toLowerCase()
      .includes(search.value.toLowerCase()) ||

    track.snippet?.channelTitle
      ?.toLowerCase()
      .includes(search.value.toLowerCase())
  )
})
</script>