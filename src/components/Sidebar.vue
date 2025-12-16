<template>
  <aside
    :class="['sidebar', { collapsed: isCollapsed }]"
    id="sidebar"
  >
    <div class="sidebar-header">
      <h5 v-if="!isCollapsed" class="sidebar-title">القائمة</h5>
      <button
        class="btn btn-link text-white p-0 sidebar-toggle"
        @click="toggleSidebar"
        title="إخفاء/إظهار القائمة"
      >
        <i :class="isCollapsed ? 'bi bi-chevron-left' : 'bi bi-chevron-right'"></i>
      </button>
    </div>
    <nav class="sidebar-nav">
      <router-link
        to="/"
        class="sidebar-item"
        active-class="active"
      >
        <i class="bi bi-list-ul"></i>
        <span v-if="!isCollapsed">إدارة الطلبات</span>
      </router-link>
      <a href="#" class="sidebar-item">
        <i class="bi bi-box-seam"></i>
        <span v-if="!isCollapsed">المنتجات</span>
      </a>
      <a href="#" class="sidebar-item">
        <i class="bi bi-people"></i>
        <span v-if="!isCollapsed">العملاء</span>
      </a>
      <a href="#" class="sidebar-item">
        <i class="bi bi-graph-up"></i>
        <span v-if="!isCollapsed">التقارير</span>
      </a>
      <a href="#" class="sidebar-item">
        <i class="bi bi-gear"></i>
        <span v-if="!isCollapsed">الإعدادات</span>
      </a>
    </nav>
  </aside>
  <div
    v-if="!isCollapsed && isMobile"
    class="sidebar-overlay"
    @click="collapseSidebar"
  ></div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useSidebarStore } from '@/stores/sidebar'

const sidebarStore = useSidebarStore()
const isCollapsed = computed(() => sidebarStore.isCollapsed)
const isMobile = ref(false)

const toggleSidebar = () => {
  sidebarStore.toggle()
}

const collapseSidebar = () => {
  sidebarStore.collapse()
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 992
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  // Collapse sidebar on mobile by default
  if (window.innerWidth < 992) {
    sidebarStore.collapse()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.sidebar {
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: 220px;
  /*padding-top: 56px;  reserve space for navbar */
  
  background-color: var(--sidebar-bg, #003b6d);
  color: white;
  transition: transform 0.3s ease, background-color 0.3s ease;
  z-index: 1000;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.sidebar.collapsed {
  transform: translateX(100%);
}

.sidebar-header {
  padding: .5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.sidebar-title {
  margin: 0;
  font-weight: 600;
}

.sidebar-toggle {
  color: white !important;
  font-size: 1.25rem;
  min-width: auto;
  padding: 0.25rem !important;
}

.sidebar-toggle:hover {
  opacity: 0.8;
}

.sidebar-nav {
  padding: 0.5rem 0;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s;
  border-right: 3px solid transparent;
}

.sidebar-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.sidebar-item.active {
  background-color: rgba(102, 153, 204, 0.3);
  color: white;
  border-right-color: #6699cc;
}

.sidebar-item i {
  font-size: 1.25rem;
  min-width: 24px;
  margin-left: 0.75rem;
}

.sidebar-item span {
  white-space: nowrap;
}

.sidebar-overlay {
  position: fixed;
  top: 56px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

@media (max-width: 991px) {
  .sidebar {
    transform: translateX(100%);
  }

  .sidebar:not(.collapsed) {
    transform: translateX(0) !important;
  }
}

@media (min-width: 992px) {
  .sidebar {
    transform: translateX(0);
  }

  .sidebar.collapsed {
    transform: translateX(100%);
  }
}

@media (min-width: 992px) {
  .sidebar-overlay {
    display: none !important;
  }
}
</style>

