import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref([
    {
      id: 1,
      title: 'طلب جديد',
      message: 'تم استلام طلب جديد من أحمد محمد',
      time: 'منذ 5 دقائق',
      read: false,
      type: 'info'
    },
    {
      id: 2,
      title: 'تحديث حالة',
      message: 'تم تحديث حالة الطلب ORD-001',
      time: 'منذ 15 دقيقة',
      read: false,
      type: 'success'
    },
    {
      id: 3,
      title: 'تنبيه',
      message: 'يوجد 3 طلبات قيد الانتظار',
      time: 'منذ ساعة',
      read: true,
      type: 'warning'
    }
  ])

  const unreadCount = ref(notifications.value.filter(n => !n.read).length)

  function markAsRead(id) {
    const notification = notifications.value.find(n => n.id === id)
    if (notification && !notification.read) {
      notification.read = true
      unreadCount.value = notifications.value.filter(n => !n.read).length
    }
  }

  function markAllAsRead() {
    notifications.value.forEach(n => {
      n.read = true
    })
    unreadCount.value = 0
  }

  function addNotification(notification) {
    notifications.value.unshift({
      id: Date.now(),
      read: false,
      ...notification
    })
    unreadCount.value = notifications.value.filter(n => !n.read).length
  }

  function removeNotification(id) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
      unreadCount.value = notifications.value.filter(n => !n.read).length
    }
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification
  }
})

