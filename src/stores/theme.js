import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(localStorage.getItem('theme') === 'dark' || false)

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  function setTheme(theme) {
    isDark.value = theme === 'dark'
  }

  function updateThemeClass() {
    if (isDark.value) {
      document.documentElement.setAttribute('data-theme', 'dark')
      document.body.classList.add('dark-theme')
      document.body.classList.remove('light-theme')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
      document.body.classList.add('light-theme')
      document.body.classList.remove('dark-theme')
    }
  }

  // Watch for theme changes and update localStorage and DOM
  watch(isDark, (newValue) => {
    localStorage.setItem('theme', newValue ? 'dark' : 'light')
    updateThemeClass()
  }, { immediate: true })

  return {
    isDark,
    toggleTheme,
    setTheme,
    updateThemeClass
  }
})

