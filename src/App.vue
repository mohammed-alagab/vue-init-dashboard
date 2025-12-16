<template>
  <div id="app" dir="rtl">
    <Navbar />
    <Sidebar />
    <main :class="['main-content', { 'sidebar-collapsed': isSidebarCollapsed }]">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import { useSidebarStore } from '@/stores/sidebar'
import { useThemeStore } from '@/stores/theme'

const sidebarStore = useSidebarStore()
const themeStore = useThemeStore()
const isSidebarCollapsed = computed(() => sidebarStore.isCollapsed)

onMounted(() => {
  // Initialize theme on mount
  themeStore.updateThemeClass()
})
</script>

<style>
#app {
  min-height: 100vh;
  background-color: var(--bg-color);
  transition: background-color 0.3s ease;
}

.main-content {
  margin-right: 220px;
  padding: 1rem;
  transition: margin-right 0.3s ease, background-color 0.3s ease;
  background-color: var(--bg-color);
}

.main-content.sidebar-collapsed {
  margin-right: 0;
}

@media (max-width: 991px) {
  .main-content {
    margin-right: 0;
  }
}
</style>