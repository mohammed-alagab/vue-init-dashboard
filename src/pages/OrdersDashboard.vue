<template>
  <div class="orders-dashboard">
    <!-- Stats Cards -->
    <div class="d-flex flex-wrap gap-3 mb-4">
      <div class="flex-fill" style="min-width: 150px;">
        <div class="card border-0 h-100" style="background-color: #003b6d;">
          <div class="card-body text-white text-center">
            <i class="bi bi-list-ul fs-1 d-block mb-2"></i>
            <h5 class="mb-0">{{ ordersStats.total }}</h5>
            <small>إجمالي الطلبات</small>
          </div>
        </div>
      </div>
      <div class="flex-fill" style="min-width: 150px;">
        <div class="card border-0 h-100" style="background-color: #ebed3f;">
          <div class="card-body text-dark text-center">
            <i class="bi bi-clock-history fs-1 d-block mb-2"></i>
            <h5 class="mb-0">{{ ordersStats.pending }}</h5>
            <small>قيد الانتظار</small>
          </div>
        </div>
      </div>
      <div class="flex-fill" style="min-width: 150px;">
        <div class="card border-0 h-100" style="background-color: #6699cc;">
          <div class="card-body text-white text-center">
            <i class="bi bi-gear fs-1 d-block mb-2"></i>
            <h5 class="mb-0">{{ ordersStats.processing }}</h5>
            <small>قيد المعالجة</small>
          </div>
        </div>
      </div>
      <div class="flex-fill" style="min-width: 150px;">
        <div class="card border-0 h-100" style="background-color: #676767;">
          <div class="card-body text-white text-center">
            <i class="bi bi-check-circle fs-1 d-block mb-2"></i>
            <h5 class="mb-0">{{ ordersStats.completed }}</h5>
            <small>مكتملة</small>
          </div>
        </div>
      </div>
      <div class="flex-fill" style="min-width: 150px;">
        <div class="card border-0 h-100" style="background-color: #BDBDBD;">
          <div class="card-body text-dark text-center">
            <i class="bi bi-x-circle fs-1 d-block mb-2"></i>
            <h5 class="mb-0">{{ ordersStats.cancelled }}</h5>
            <small>ملغاة</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Actions -->
    <div class="card border-0 mb-4">
      <div class="card-body">
        <div class="d-flex flex-wrap align-items-end justify-content-between gap-3">
          
          <div class="flex-fill" style="min-width: 200px;">
            <label class="form-label mb-2">فلترة حسب الحالة:</label>
            <select
              class="form-select"
              v-model="selectedStatus"
              @change="handleStatusFilter"
            >
              <option value="all">جميع الطلبات</option>
              <option value="pending">قيد الانتظار</option>
              <option value="processing">قيد المعالجة</option>
              <option value="completed">مكتملة</option>
              <option value="cancelled">ملغاة</option>
            </select>
          </div>
          <div>
            <button
              class="btn text-white"
              style="background-color: #003b6d;"
              @click="showAddOrderModal"
            >
              <i class="bi bi-plus-circle me-2"></i>إضافة طلب جديد
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="card border-0">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead style="background-color: #003b6d; color: white;">
              <tr>
                <th>رقم الطلب</th>
                <th>اسم العميل</th>
                <th>المنتج</th>
                <th>الكمية</th>
                <th>المبلغ الإجمالي</th>
                <th>الحالة</th>
                <th>التاريخ</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredOrders.length === 0">
                <td colspan="8" class="text-center py-4">
                  <i class="bi bi-inbox fs-1 d-block text-muted mb-2"></i>
                  <span class="text-muted">لا توجد طلبات</span>
                </td>
              </tr>
              <tr v-for="order in filteredOrders" :key="order.id">
                <td>{{ order.orderNumber }}</td>
                <td>{{ order.customerName }}</td>
                <td>{{ order.product }}</td>
                <td>{{ order.quantity }}</td>
                <td>{{ formatCurrency(order.total) }}</td>
                <td>
                  <span :class="getStatusBadgeClass(order.status)" :style="order.status === 'processing' ? 'background-color: #6699cc !important;' : ''">
                    {{ getStatusText(order.status) }}
                  </span>
                </td>
                <td>{{ order.date }}</td>
                <td>
                  <div class="btn-group" role="group">
                    <button
                      class="btn btn-sm"
                      style="background-color: #6699cc; color: white;"
                      @click="editOrder(order)"
                      title="تعديل"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      class="btn btn-sm mx-2"
                      style="background-color: #676767; color: white;"
                      @click="viewOrder(order)"
                      title="عرض"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button
                      class="btn btn-sm"
                      style="background-color: #BDBDBD; color: #000;"
                      @click="deleteOrder(order.id)"
                      title="حذف"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add Order Modal -->
    <AddOrderModal ref="addOrderModalRef" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrdersStore } from '@/stores/orders'
import AddOrderModal from '@/components/AddOrderModal.vue'

const ordersStore = useOrdersStore()
const selectedStatus = ref('all')
const addOrderModalRef = ref(null)

const ordersStats = computed(() => ordersStore.ordersStats)
const filteredOrders = computed(() => ordersStore.filteredOrders)

const handleStatusFilter = () => {
  ordersStore.setStatusFilter(selectedStatus.value)
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(amount)
}

const getStatusBadgeClass = (status) => {
  const classes = {
    pending: 'badge bg-warning text-dark',
    processing: 'badge text-white',
    completed: 'badge bg-success',
    cancelled: 'badge bg-secondary'
  }
  if (status === 'processing') {
    return 'badge text-white'
  }
  return classes[status] || 'badge bg-secondary'
}

const getStatusText = (status) => {
  const texts = {
    pending: 'قيد الانتظار',
    processing: 'قيد المعالجة',
    completed: 'مكتملة',
    cancelled: 'ملغاة'
  }
  return texts[status] || status
}

const editOrder = (order) => {
  // Handle edit
  console.log('Edit order:', order)
}

const viewOrder = (order) => {
  // Handle view
  console.log('View order:', order)
}

const deleteOrder = (orderId) => {
  if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
    ordersStore.deleteOrder(orderId)
  }
}

const showAddOrderModal = () => {
  if (addOrderModalRef.value) {
    addOrderModalRef.value.show()
  }
}

onMounted(() => {
  // Initialize status filter
  ordersStore.setStatusFilter('all')
})
</script>

<style scoped>
.orders-dashboard {
  padding: 1.5rem;
}

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}

.table thead th {
  font-weight: 600;
  padding: 1rem;
  border: none;
}

.table tbody td {
  padding: 1rem;
  vertical-align: middle;
  border-color: #e9ecef;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.badge {
  padding: 0.5rem 0.75rem;
  font-weight: 500;
}

.btn-group .btn {
  border-radius: 0;
}

.btn-group .btn:first-child {
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
}

.btn-group .btn:last-child {
  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
}

@media (max-width: 768px) {
  .orders-dashboard {
    padding: 1rem;
  }

  .table {
    font-size: 0.875rem;
  }

  .table thead th,
  .table tbody td {
    padding: 0.5rem;
  }

  .btn-group {
    flex-direction: column;
  }

  .btn-group .btn {
    border-radius: 0.25rem !important;
    margin-bottom: 0.25rem;
  }
}

@media (max-width: 576px) {
  .card-body {
    padding: 0.75rem;
  }

  .table {
    font-size: 0.75rem;
  }
}
</style>

