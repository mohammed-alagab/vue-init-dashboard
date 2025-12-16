<template>
  <nav class="navbar mx-1 navbar-expand-lg navbar-dark" :style="{ backgroundColor: isDark ? 'var(--navbar-bg)' : '#6597c9' }">
    <div class="container-fluid">
      <!-- Menu button to toggle sidebar on right -->
      <button
        class="btn btn-link text-white me-2 sidebar-menu-btn"
        type="button"
        @click="toggleSidebar"
        aria-label="Toggle sidebar"
      >
        <i class="bi bi-list fs-4"></i>
      </button>

      <!-- Search box in center - hidden on mobile -->
      <div class="collapse navbar-collapse justify-content-center d-none d-lg-flex" id="navbarContent">
        <div class="d-flex w-100 justify-content-center">
          <div class="input-group" style="max-width: 500px;">
            <span class="input-group-text bg-white border-end-0">
              <i class="bi bi-search"></i>
            </span>
            <input
              type="text"
              class="form-control border-start-0"
              placeholder="ابحث عن الطلبات..."
              v-model="searchQuery"
              @input="handleSearch"
            />
          </div>
        </div>
      </div>

      <!-- User info on left -->
      <div class="d-flex align-items-center ms-auto gap-2">
        <!-- Theme Toggle -->
        <button
          class="btn btn-link text-white text-decoration-none"
          type="button"
          @click="toggleTheme"
          :title="isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'"
        >
          <i :class="isDark ? 'bi bi-sun-fill fs-5' : 'bi bi-moon-fill fs-5'"></i>
        </button>

        <!-- Notifications -->
        <div class="dropdown">
          <button
            class="btn btn-link text-white text-decoration-none position-relative p-1"
            type="button"
            id="notificationsDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            title="الإشعارات"
          >
            <i class="bi bi-bell fs-5"></i>
            <span
              v-if="unreadCount > 0"
              class="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger"
              style="font-size: 0.6rem; padding: 0.2rem 0.4rem;"
            >
              {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end notifications-dropdown" aria-labelledby="notificationsDropdown">
            <li class="dropdown-header d-flex justify-content-between align-items-center">
              <span>الإشعارات</span>
              <button
                v-if="unreadCount > 0"
                class="btn btn-sm btn-link text-decoration-none p-0"
                @click="markAllAsRead"
              >
                قراءة الكل
              </button>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li v-if="notifications.length === 0">
              <div class="dropdown-item text-center text-muted py-3">
                لا توجد إشعارات
              </div>
            </li>
            <li v-for="notification in notifications" :key="notification.id">
              <a
                class="dropdown-item"
                :class="{ 'notification-unread': !notification.read }"
                href="#"
                @click.prevent="markAsRead(notification.id)"
              >
                <div class="d-flex justify-content-between align-items-start">
                  <div class="flex-grow-1">
                    <div class="fw-bold">{{ notification.title }}</div>
                    <small class="text-muted">{{ notification.message }}</small>
                    <div class="text-muted" style="font-size: 0.75rem;">{{ notification.time }}</div>
                  </div>
                  <button
                    class="btn btn-sm btn-link text-danger p-0 ms-2"
                    @click.stop="removeNotification(notification.id)"
                    title="حذف"
                  >
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </a>
            </li>
            <li v-if="notifications.length > 0"><hr class="dropdown-divider" /></li>
            <li>
              <a class="dropdown-item text-center" href="#">
                عرض جميع الإشعارات
              </a>
            </li>
          </ul>
        </div>

        <!-- User Dropdown -->
        <div class="dropdown">
          <button
            class="btn btn-link text-white text-decoration-none dropdown-toggle d-flex align-items-center"
            type="button"
            id="userDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-person-circle fs-4 me-2"></i>
            <span class="d-none d-md-inline">{{ userName }}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
            <li>
              <a class="dropdown-item" href="#">
                <i class="bi bi-person me-2"></i>الملف الشخصي
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="#">
                <i class="bi bi-gear me-2"></i>الإعدادات
              </a>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <a class="dropdown-item" href="#">
                <i class="bi bi-box-arrow-right me-2"></i>تسجيل الخروج
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useOrdersStore } from '@/stores/orders'
import { useSidebarStore } from '@/stores/sidebar'
import { useThemeStore } from '@/stores/theme'
import { useNotificationsStore } from '@/stores/notifications'

const ordersStore = useOrdersStore()
const sidebarStore = useSidebarStore()
const themeStore = useThemeStore()
const notificationsStore = useNotificationsStore()
const userName = ref('المستخدم')

const searchQuery = computed({
  get: () => ordersStore.searchQuery,
  set: (value) => ordersStore.setSearchQuery(value)
})

const isDark = computed(() => themeStore.isDark)
const notifications = computed(() => notificationsStore.notifications)
const unreadCount = computed(() => notificationsStore.unreadCount)

const handleSearch = () => {
  ordersStore.setSearchQuery(searchQuery.value)
}

const toggleSidebar = () => {
  sidebarStore.toggle()
}

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const markAsRead = (id) => {
  notificationsStore.markAsRead(id)
}

const markAllAsRead = () => {
  notificationsStore.markAllAsRead()
}

const removeNotification = (id) => {
  notificationsStore.removeNotification(id)
}
</script>

<style scoped>
.navbar {
  box-shadow: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color 0.3s ease;
  height: 50px !important;
}

.input-group-text {
  border-color: #dee2e6;
}

.form-control:focus {
  box-shadow: none;
  border-color: #6699cc;
}

.dropdown-menu {
  direction: rtl;
  text-align: right;
}

.dropdown-item {
  direction: rtl;
  text-align: right;
}

.dropdown-item i {
  margin-left: 0.5rem;
  margin-right: 0;
}

.sidebar-menu-btn {
  padding: 0.25rem 0.5rem !important;
  min-width: auto;
}

.sidebar-menu-btn:hover {
  opacity: 0.8;
  background-color: rgba(255, 255, 255, 0.1);
}

.notifications-dropdown {
  min-width: 320px;
  max-height: 400px;
  overflow-y: auto;
}

.notification-unread {
  background-color: rgba(102, 153, 204, 0.1);
}

.notification-unread:hover {
  background-color: rgba(102, 153, 204, 0.2);
}
.btn .badge {
    position: relative;
    top: 5px !important;
}
@media (max-width: 991px) {
  #navbarContent {
    display: none !important;
  }

  .notifications-dropdown {
    min-width: 280px;
  }
}
</style>

