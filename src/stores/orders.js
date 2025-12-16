import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useOrdersStore = defineStore('orders', () => {
  // State
  const orders = ref([
    {
      id: 1,
      orderNumber: 'ORD-001',
      customerName: 'أحمد محمد',
      product: 'منتج أ',
      quantity: 5,
      total: 1500,
      status: 'pending',
      date: '2024-01-15'
    },
    {
      id: 2,
      orderNumber: 'ORD-002',
      customerName: 'فاطمة علي',
      product: 'منتج ب',
      quantity: 3,
      total: 900,
      status: 'completed',
      date: '2024-01-14'
    },
    {
      id: 3,
      orderNumber: 'ORD-003',
      customerName: 'خالد حسن',
      product: 'منتج ج',
      quantity: 10,
      total: 3000,
      status: 'processing',
      date: '2024-01-13'
    },
    {
      id: 4,
      orderNumber: 'ORD-004',
      customerName: 'سارة أحمد',
      product: 'منتج د',
      quantity: 2,
      total: 600,
      status: 'cancelled',
      date: '2024-01-12'
    },
    {
      id: 5,
      orderNumber: 'ORD-005',
      customerName: 'محمد يوسف',
      product: 'منتج ه',
      quantity: 7,
      total: 2100,
      status: 'pending',
      date: '2024-01-11'
    }
  ])

  const searchQuery = ref('')
  const statusFilter = ref('all')

  // Getters
  const filteredOrders = computed(() => {
    let filtered = orders.value

    // Filter by status
    if (statusFilter.value !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter.value)
    }

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.product.toLowerCase().includes(query)
      )
    }

    return filtered
  })

  const ordersStats = computed(() => {
    return {
      total: orders.value.length,
      pending: orders.value.filter(o => o.status === 'pending').length,
      processing: orders.value.filter(o => o.status === 'processing').length,
      completed: orders.value.filter(o => o.status === 'completed').length,
      cancelled: orders.value.filter(o => o.status === 'cancelled').length
    }
  })

  // Actions
  function setSearchQuery(query) {
    searchQuery.value = query
  }

  function setStatusFilter(status) {
    statusFilter.value = status
  }

  function updateOrderStatus(orderId, newStatus) {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = newStatus
    }
  }

  function addOrder(order) {
    const maxId = orders.value.length > 0 
      ? Math.max(...orders.value.map(o => o.id))
      : 0
    orders.value.push({
      id: maxId + 1,
      ...order
    })
  }

  function deleteOrder(orderId) {
    const index = orders.value.findIndex(o => o.id === orderId)
    if (index > -1) {
      orders.value.splice(index, 1)
    }
  }

  return {
    orders,
    searchQuery,
    statusFilter,
    filteredOrders,
    ordersStats,
    setSearchQuery,
    setStatusFilter,
    updateOrderStatus,
    addOrder,
    deleteOrder
  }
})

