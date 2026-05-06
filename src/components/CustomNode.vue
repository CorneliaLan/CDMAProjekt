<template>
  <div
    class="custom-node"
    :class="data.category"
    :style="{
      background: data.color,
      color: data.textColor
    }"
  >
    <!-- Header -->
    <div class="header">
      <span class="title">{{ data.label }}</span>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Inputs -->
      <div class="inputs">
        <div
          v-for="input in inputs"
          :key="input.key"
          class="socket-row"
        >
          <RefSocket
            name="input-socket"
            :emit="emit"
            :side="'input'"
            :socket-key="input.key"
            :payload="input.socket"
            :data="input"
          />
        </div>
      </div>

      <!-- Outputs -->
      <div class="outputs">
        <div
          v-for="output in outputs"
          :key="output.key"
          class="socket-row"
        >
          <RefSocket
            name="output-socket"
            :emit="emit"
            :side="'output'"
            :socket-key="output.key"
            :payload="output.socket"
            :data="output"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Presets } from 'rete-vue-plugin'

const ClassicSocket = Presets.classic.Socket
const ClassicInput = Presets.classic.Input
const ClassicOutput = Presets.classic.Output
const ClassicControl = Presets.classic.Control

/*defineProps<{
  data: any
  inputs: any[]
  outputs: any[]
}>()*/

const props = defineProps<{
  data: any
  emit: any
  inputs: any[]
  outputs: any[]
}>()
</script>

<style scoped>
.custom-node {
  width: 180px;
  min-height: 110px;
  border-radius: 16px;
  padding: 10px 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.15s ease;
}

.custom-node:hover {
  transform: scale(1.02);
}

/* Header */
.header {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 8px;
}

/* Content Layout */
.content {
  display: flex;
  justify-content: space-between;
}

/* Socket Columns */
.inputs,
.outputs {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Individual socket row */
.socket-row {
  display: flex;
  align-items: center;
}

/* Category Styles */

.custom-node.Loops {
  border-left: 6px solid #3e3fd3;
}

.custom-node.Conditions {
  border-left: 6px solid #4545d7;
}

.custom-node.Events {
  border-left: 6px solid #4a67a8;
}

.custom-node.Movement {
  border-left: 6px solid #535e72;
}
</style>