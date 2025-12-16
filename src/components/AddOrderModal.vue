<template>
  <div
    class="modal fade"
    id="addOrderModal"
    tabindex="-1"
    aria-labelledby="addOrderModalLabel"
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog direction-rtl modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addOrderModalLabel">إضافة طلب جديد</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <div class="mb-3">
              <label for="customerName" class="form-label">اسم العميل <span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control form-control"
                id="customerName"
                v-model="formData.customerName"
                required
                placeholder="أدخل اسم العميل"
              />
            </div>

            <div class="mb-3">
              <label for="product" class="form-label">المنتج <span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control"
                id="product"
                v-model="formData.product"
                required
                placeholder="أدخل اسم المنتج"
              />
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="quantity" class="form-label">الكمية <span class="text-danger">*</span></label>
                <input
                  type="number"
                  class="form-control"
                  id="quantity"
                  v-model.number="formData.quantity"
                  required
                  min="1"
                  placeholder="0"
                  @input="calculateTotal"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label for="unitPrice" class="form-label">سعر الوحدة <span class="text-danger">*</span></label>
                <input
                  type="number"
                  class="form-control"
                  id="unitPrice"
                  v-model.number="formData.unitPrice"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  @input="calculateTotal"
                />
              </div>
            </div>

            <div class="mb-3">
              <label for="total" class="form-label">المبلغ الإجمالي</label>
              <input
                type="number"
                class="form-control"
                id="total"
                v-model.number="formData.total"
                readonly
                :class="{ 'bg-light': !isDark, 'bg-dark': isDark }"
              />
            </div>

            <div class="mb-3">
              <label for="status" class="form-label">الحالة <span class="text-danger">*</span></label>
              <select class="form-select" id="status" v-model="formData.status" required>
                <option value="pending">قيد الانتظار</option>
                <option value="processing">قيد المعالجة</option>
                <option value="completed">مكتملة</option>
                <option value="cancelled">ملغاة</option>
              </select>
            </div>

            <div class="mb-3">
              <label for="date" class="form-label">التاريخ <span class="text-danger">*</span></label>
              <input
                type="date"
                class="form-control"
                id="date"
                v-model="formData.date"
                required
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              إلغاء
            </button>
            <button type="submit" class="btn text-white" style="background-color: #003b6d;">
              <i class="bi bi-check-circle me-2"></i>إضافة الطلب
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import { useOrdersStore } from '@/stores/orders'
import { useThemeStore } from '@/stores/theme'

const ordersStore = useOrdersStore()
const themeStore = useThemeStore()

const modalRef = ref(null)
let modal = null

const isDark = computed(() => themeStore.isDark)

const formData = ref({
  customerName: '',
  product: '',
  quantity: 1,
  unitPrice: 0,
  total: 0,
  status: 'pending',
  date: new Date().toISOString().split('T')[0]
})

const calculateTotal = () => {
  if (formData.value.quantity && formData.value.unitPrice) {
    formData.value.total = formData.value.quantity * formData.value.unitPrice
  } else {
    formData.value.total = 0
  }
}

const generateOrderNumber = () => {
  const lastOrder = ordersStore.orders[ordersStore.orders.length - 1]
  if (lastOrder) {
    const lastNumber = parseInt(lastOrder.orderNumber.split('-')[1])
    return `ORD-${String(lastNumber + 1).padStart(3, '0')}`
  }
  return 'ORD-001'
}

const resetForm = () => {
  formData.value = {
    customerName: '',
    product: '',
    quantity: 1,
    unitPrice: 0,
    total: 0,
    status: 'pending',
    date: new Date().toISOString().split('T')[0]
  }
}

const handleSubmit = () => {
  const newOrder = {
    orderNumber: generateOrderNumber(),
    customerName: formData.value.customerName,
    product: formData.value.product,
    quantity: formData.value.quantity,
    total: formData.value.total,
    status: formData.value.status,
    date: formData.value.date
  }

  ordersStore.addOrder(newOrder)
  resetForm()
  hide()
}

const show = () => {
  if (modal) {
    modal.show()
  }
}

const hide = () => {
  if (modal) {
    modal.hide()
  }
}

onMounted(() => {
  if (modalRef.value) {
    modal = new Modal(modalRef.value)
    
    // Reset form when modal is hidden
    modalRef.value.addEventListener('hidden.bs.modal', () => {
      resetForm()
    })
  }
})

// Watch for quantity and unitPrice changes
watch([() => formData.value.quantity, () => formData.value.unitPrice], () => {
  calculateTotal()
})

// Expose show method to parent
defineExpose({
  show
})
</script>

<style scoped>
.modal-content {
  border-radius: 5px;
}

.modal-header {
  border-bottom: 1px solid var(--border-color, #dee2e6);
}

.modal-footer {
  border-top: 1px solid var(--border-color, #dee2e6);
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.text-danger {
  color: #dc3545 !important;
}

.dark-theme .modal-content {
  background-color: var(--card-bg);
  color: var(--text-color);
}

.dark-theme .modal-header {
  border-bottom-color: var(--border-color);
}

.dark-theme .modal-footer {
  border-top-color: var(--border-color);
}

.dark-theme .btn-close {
  filter: invert(1);
}
</style>

