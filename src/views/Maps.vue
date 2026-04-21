<template>
  <ion-page>

    <!-- HEADER COMPONENT -->
    <Header />

    <ion-content class="map-page">

      <h1 class="title">World Map</h1>

      <!-- MAP -->
      <div class="map-scroll">
        <div class="map-container">

          <!-- WORLD ORIGIN -->
          <div class="world">

            <!-- LINES -->
            <svg class="lines">

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
            />

          </div>

        </div>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue'

import Header from '@/components/Header.vue'
import MapNode from '@/components/MapNode.vue'

import { colors } from '@/theme/colors'

/* TYPES */
type NodeStatus = 'complete' | 'active' | 'locked'

type NodeType = {
  id: number
  title: string
  status: NodeStatus
  x: number
  y: number
}

/* NODES */
const nodes: NodeType[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  title: `Level ${i + 1}`,
  status: i < 2 ? 'complete' : i === 2 ? 'active' : 'locked',
  x: i % 2 === 0 ? -150 : 150,
  y: -200 + i * 140
}))

const connections = [
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5]
]

const getNode = (id: number) => {
  return nodes.find(n => n.id === id) || { x: 0, y: 0 }
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
}

/* WORLD CENTER */
.world {
  position: absolute;
  top: 50%;
  left: 50%;
}

/* LINES */
.lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  overflow: visible;
}

.lines line {
  stroke: v-bind('colors.line');
  stroke-width: 3;
}

</style>