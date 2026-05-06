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
          <ClassicSocket
            :emit="emit"
            :socket="input.socket"
            side="input"
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
          <ClassicSocket
            :emit="emit"
            :socket="output.socket"
            side="output"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Presets } from 'rete-vue-plugin'
import { colors } from '@/theme/colors'

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

// const inputs = Object.entries(props.data.inputs).map(([key, input]) => ({
//   key,
//   ...(input as any)
// }))

// const outputs = Object.entries(props.data.outputs).map(([key, output]) => ({
//   key,
//   ...(output as any)
// }))
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
  border-left: 6px solid v-bind('colors.repeat');
}

.custom-node.Conditions {
  border-left: 6px solid v-bind('colors.condition');
}

.custom-node.Events {
  border-left: 6px solid v-bind('colors.events');
}

.custom-node.Movement {
  border-left: 6px solid v-bind('colors.move');
}
</style>