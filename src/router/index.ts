import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

import Login from '../views/Login.vue'
import Maps from '../views/Maps.vue'
import Level from '../views/Level.vue'
import Editor from '../views/Editor.vue'
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
    path: '/level/:id',
    name: 'Level',
    component: Level
  },
  {
    path: '/editor/:id',
    name: 'Editor',
    component: Editor
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
