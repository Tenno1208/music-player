import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface SearchStore {
  search: globalThis.Ref<string>
  clearSearch: () => void
}

export const useSearchStore = defineStore('search', () => {
  const search = ref('')

  const clearSearch = () => {
    search.value = ''
  }

  return {
    search,
    clearSearch
  }
})