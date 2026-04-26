<template>
  <ion-page>

    <!-- HEADER COMPONENT -->
    <Header />

    <ion-content class="map-page"
                 :style="{ '--background': colors.background }">

      <h1 class="title">World Map</h1>

      <!-- MAP -->
      <div class="map-scroll">
        <div class="map-container">

          <!-- WORLD ORIGIN -->
          <div class="world">

            <!-- LINES -->
            <svg class="lines" viewBox="0 0 800 800">

              <line
                v-for="(conn, index) in connections"
                :key="index"
                :x1="getNode(conn[0]).x"
                :y1="getNode(conn[0]).y"
                :x2="getNode(conn[1]).x"
                :y2="getNode(conn[1]).y"
              />

            </svg>

            <!-- NODES COMPONENT -->
            <MapNode
              v-for="node in nodes"
              :key="node.id"
              :title="node.title"
              :status="node.status"
              :x="node.x"
              :y="node.y"
              @click="openLevel(node.id)"
            />

          </div>

        </div>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { IonContent, IonPage } from '@ionic/vue'

import Header from '@/components/Header.vue'
import MapNode from '@/components/MapNode.vue'

import { colors } from '@/theme/colors'

import { Maps } from '@/composables/Maps'

const { nodes, connections, getNode } = Maps()
const router = useRouter()


const openLevel = (id: number) => {
  const node = nodes.find(n => n.id === id)

  if (!node || node.status === 'locked') {
    return
  }

  router.push({
    name: 'Level',
    params: {
      id
    }
  })
}

</script>

<style scoped>

/* MAP */
.map-scroll {
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
}

.map-container {
  position: relative;
  width: 100%;
  height: 900px;
  overflow: visible;
}

/* TITLE (bleibt fix oben sichtbar im Scrollbereich) */
.title {
  position: sticky;
  top: 0;
  z-index: 10;

  margin-left: 40px;
  padding: 12px 0;

  font-size: 28px;
  background: transparent;

  color: v-bind('colors.text');
}

/* WORLD CENTER */
.world {
  position: absolute;
  top: 35%;
  left: 50%;

  width: 800px;
  height: 800px;
}

/* LINES */
.lines {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}

.lines line {
  stroke: v-bind('colors.line');
  stroke-width: 2.5;
}

</style>