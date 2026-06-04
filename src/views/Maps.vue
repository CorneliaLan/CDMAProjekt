<template>
  <ion-page>

    <!-- HEADER COMPONENT -->
    <Header />

    <ion-content class="map-page"
                 :fullscreen="true"
                 :style="{ '--background': colors.background }">

      <!--<h1 class="title">World Map</h1>-->

      <div class="map-scroll">

        <!-- WORLD (full screen coordinate system) -->
        <div class="world">

          <!-- SVG LINES (same coordinate space as nodes) -->
          <svg
            class="lines"
            :viewBox="viewBox"
          >
            <line
              v-for="(conn, index) in connections"
              :key="index"
              :x1="getNode(conn[0]).x"
              :y1="getNode(conn[0]).y"
              :x2="getNode(conn[1]).x"
              :y2="getNode(conn[1]).y"
            />
          </svg>

          <!-- NODES -->
          <MapNode
            v-for="node in nodes"
            :key="node.id"
            :title="node.title"
            :status="node.status"
            :x="node.x"
            :y="node.y"
            @select="openLevel(node.id)"
          />

        </div>

      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { IonContent, IonPage } from '@ionic/vue'

import Header from '@/components/Header.vue'
import MapNode from '@/components/MapNode.vue'

import { colors } from '@/theme/colors'
import { Maps } from '@/composables/Maps'

const { nodes, connections, getNode, recalcNodes } = Maps()
const router = useRouter()

const viewBox = ref('0 0 0 0')

const updateLayout = async () => {
  await nextTick()

  const w = window.innerWidth
  const h = window.innerHeight

  viewBox.value = `0 0 ${w} ${h}`

  recalcNodes()
}

const openLevel = (id: number) => {
  const node = nodes.value.find(n => n.id === id)

  if (!node || node.status === 'locked') return

  router.push({
    name: 'Level',
    params: { id }
  })
}

onMounted(() => {
  updateLayout()
  window.addEventListener('resize', updateLayout)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateLayout)
})


</script>

<style scoped>

/* scroll container */
.map-scroll {
  width: 100%;
  min-height: 100%;

  overflow-y: auto; 
  overflow-x: hidden;
}

/* WORLD = full viewport coordinate space */
.world {
  position: relative;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  overflow: visible;
}

/* SVG OVERLAY */
.lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}

/* line style */
.lines line {
  stroke: v-bind('colors.line');
  stroke-width: 2.5;
}

</style>