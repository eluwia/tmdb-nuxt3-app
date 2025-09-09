import { ref } from 'vue'

export function usePageTitle() {
  const pageTitle = ref('TMDB Website')

  const setPageTitle = (title) => {
    pageTitle.value = title
    document.title = title
  }

  return {
    pageTitle,
    setPageTitle
  }
}
