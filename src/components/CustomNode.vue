<template>
  <div
    class="custom-node"
    :class="[data.category, data.blockKind, data.scopeRole, { selected: data.selected }]"
    :style="nodeStyle"
  >
    <div class="header">
      <span class="title">{{ data.label }}</span>

      <select
        v-if="isRepeat"
        class="repeat-select"
        :value="selectedRepeatCount"
        @input="onRepeatChange"
        @change="onRepeatChange"
        @pointerdown.stop
        @mousedown.stop
        @click.stop
        @dblclick.stop
      >
        <option
          v-for="count in repeatOptions"
          :key="count"
          :value="count"
        >
          {{ count }}x
        </option>
      </select>
    </div>

    <input
      v-if="isIfWall"
      class="condition-input"
      :value="condition"
      placeholder="wallAhead"
      @input="onConditionInput"
      @pointerdown.stop
      @mousedown.stop
      @click.stop
      @dblclick.stop
    />

    <div class="content">
      <div class="inputs">
        <div
          v-for="[key, input] in sortedInputs"
          :key="key"
          class="socket-row input-row"
        >
          <Ref
            class="input-socket"
            :data="{ type: 'socket', side: 'input', key, nodeId: data.id, payload: input.socket }"
            :emit="emit"
          />
          <span
            v-if="input.label"
            class="socket-label"
          >
            {{ input.label }}
          </span>
        </div>
      </div>

      <div class="outputs">
        <div
          v-for="[key, output] in sortedOutputs"
          :key="key"
          class="socket-row output-row"
        >
          <span
            v-if="output.label"
            class="socket-label"
          >
            {{ output.label }}
          </span>
          <Ref
            class="output-socket"
            :data="{ type: 'socket', side: 'output', key, nodeId: data.id, payload: output.socket }"
            :emit="emit"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Ref } from 'rete-vue-plugin'

type IndexedEntry<T> = [string, T & { index?: number }]

const props = defineProps<{
  data: any
  emit: any
  seed?: number
}>()

const repeatOptions = Array.from({ length: 10 }, (_, index) => index + 1)

const sortEntries = <T extends { index?: number }>(entries: IndexedEntry<T>[]) => {
  return entries.sort((a, b) => (a[1].index ?? 0) - (b[1].index ?? 0))
}

const sortedInputs = computed(() => {
  return sortEntries(Object.entries(props.data.inputs ?? {}) as IndexedEntry<any>[])
})

const sortedOutputs = computed(() => {
  return sortEntries(Object.entries(props.data.outputs ?? {}) as IndexedEntry<any>[])
})

const isRepeat = computed(() => props.data.blockKind === 'repeat')
const isIfWall = computed(() => props.data.blockKind === 'ifwall')
const selectedRepeatCount = ref(props.data.repeatCount ?? 3)
const condition = computed(() => props.data.condition ?? 'wallAhead')

watch(
  () => [props.data.id, props.data.repeatCount],
  () => {
    selectedRepeatCount.value = props.data.repeatCount ?? 3
  }
)

const nodeStyle = computed(() => ({
  width: Number.isFinite(props.data.width) ? `${props.data.width}px` : undefined,
  height: Number.isFinite(props.data.height) ? `${props.data.height}px` : undefined,
  background: props.data.color,
  color: props.data.textColor
}))

const onRepeatChange = (event: Event) => {
  const value = Number((event.target as HTMLSelectElement).value)
  const repeatCount = Number.isInteger(value) && value > 0 ? value : 3

  selectedRepeatCount.value = repeatCount
  props.data.repeatCount = repeatCount
  props.data.onRepeatCountChange?.(repeatCount)
}

const onConditionInput = (event: Event) => {
  const condition = (event.target as HTMLInputElement).value

  props.data.condition = condition
  props.data.onConditionChange?.(condition)
}
</script>

<style scoped>
.custom-node {
  width: 180px;
  min-height: 110px;
  border: 2px solid rgba(39, 48, 62, 0.22);
  border-left-width: 6px;
  border-radius: 8px;
  padding: 10px 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
}

.custom-node.selected {
  outline: 3px solid rgba(118, 120, 238, 0.35);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 24px;
  font-size: 14px;
  font-weight: 700;
}

.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.repeat-select {
  width: 58px;
  height: 26px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.95);
  color: #27303e;
  font-size: 12px;
  font-weight: 700;
}

.condition-input {
  width: 100%;
  height: 28px;
  box-sizing: border-box;
  border: 1px solid rgba(69, 69, 215, 0.28);
  border-radius: 6px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.92);
  color: #27303e;
  font-size: 12px;
}

.content {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  min-height: 26px;
}

.inputs,
.outputs {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.socket-row {
  display: flex;
  align-items: center;
  min-height: 24px;
}

.input-socket,
.output-socket {
  display: inline-block;
}

.input-socket {
  margin-left: -22px;
}

.output-socket {
  margin-right: -22px;
}

.socket-label {
  font-size: 12px;
  font-weight: 600;
}

.custom-node.REPEAT {
  border-left-color: #5b5eeb;
}

.custom-node.CONTROL {
  border-left-color: #4545d7;
}

.custom-node.ACTION {
  border-left-color: #595971;
}

.custom-node.Events {
  border-left-color: #4e4f9d;
}

.custom-node.repeat,
.custom-node.ifwall,
.custom-node.branch {
  background-image: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.18),
    rgba(255, 255, 255, 0)
  );
}

.custom-node.branch {
  border-style: dashed;
  box-shadow: inset 0 0 0 1px rgba(69, 69, 215, 0.16);
}

.custom-node.if-true {
  background: #f1fff7 !important;
  color: #1d4f33 !important;
  border-left-color: #28a061;
}

.custom-node.if-else {
  background: #fff7ef !important;
  color: #704013 !important;
  border-left-color: #d6812a;
}
</style>
