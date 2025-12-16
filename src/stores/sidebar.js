import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  // Default to expanded (false = not collapsed)
  const isCollapsed = ref(false)

  function toggle() {
    isCollapsed.value = !isCollapsed.value
  }

  function collapse() {
    isCollapsed.value = true
  }

  function expand() {
    isCollapsed.value = false
  }

  return {
    isCollapsed,
    toggle,
    collapse,
    expand
  }
})

