import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

import Login from '../views/Login.vue'
import Maps from '../views/Maps.vue'
import Level from '../views/Level.vue'
import Logic from '../views/Logic.vue'
import Preview from '../views/Preview.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/map'
  },
  {
  path: '/map',
  name: 'Map',
  component: Maps
  },
  {
  path: '/login',
  name: 'Login',
  component: Login
  },
  {
  path: '/level',
  name: 'Level',
  component: Level
  },
  {
  path: '/logic',
  name: 'Logic',
  component: Logic
  },
  {
  path: '/preview',
  name: 'Preview',
  component: Preview
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
