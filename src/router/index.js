import { createRouter, createWebHistory } from 'vue-router'
import OrdersDashboard from '@/pages/OrdersDashboard.vue'

const routes = [
  {
    path: '/',
    name: 'OrdersDashboard',
    component: OrdersDashboard
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
