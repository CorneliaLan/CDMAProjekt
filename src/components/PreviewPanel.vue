<template>
  <div class="preview-panel">
    <div class="preview-container">
      <div class="preview-scale">
        <div
            v-if="levelCompleted"
            class="execution-banner success-banner"
        >
          <ion-icon
              name="checkmark-circle"
              class="status-icon"
          />
          <div>
            <strong>Level completed</strong>
            <span>{{ completedSummary }}</span>
          </div>
        </div>

        <div
            v-else-if="runtimeError"
            class="execution-banner error-banner"
        >
          <ion-icon
              name="alert-circle"
              class="status-icon"
          />
          <div>
            <strong>Runtime error</strong>
            <span>{{ runtimeError.message }}</span>
            <dl class="error-details">
              <div>
                <dt>Code</dt>
                <dd>{{ runtimeError.code }}</dd>
              </div>
              <div>
                <dt>Steps</dt>
                <dd>{{ executionResult?.stepsExecuted ?? 0 }}</dd>
              </div>
              <div>
                <dt>Player</dt>
                <dd>{{ formatPosition(runtimeError.playerPosition) }}</dd>
              </div>
              <div>
                <dt>Move</dt>
                <dd>{{ formatMove(runtimeError.attemptedMove) }}</dd>
              </div>
              <div>
                <dt>Blocked</dt>
                <dd>{{ formatPosition(runtimeError.blockedPosition) }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <LevelPreview
            v-if="previewGrid.length"
            :grid="previewGrid"
            :player-x="playerX"
            :player-y="playerY"
        />
      </div>
    </div>

    <div class="control-wrapper">
      <ControlBar @play="emit('play')"
                  @reset="emit('reset')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonIcon } from '@ionic/vue'
import { addIcons } from 'ionicons'
import { alertCircle, checkmarkCircle } from 'ionicons/icons'
import LevelPreview from '@/components/LevelPreview.vue'
import ControlBar from '@/components/ControlBar.vue'
import type { GameState } from '@/core/engine/GameState'
import type { ExecutionResult } from '@/core/engine/ExecutionResult'
import type { LevelDefinition } from '@/core/levels/levelCatalog'

addIcons({
  alertCircle,
  checkmarkCircle
})

const props = defineProps<{
  level: LevelDefinition | null
  gameState: GameState | null
  executionResult?: ExecutionResult | null
}>()

const emit = defineEmits<{
  play: []
  reset: []
}>()

const previewGrid = computed(() => props.gameState?.grid ?? props.level?.grid ?? [])
const playerX = computed(() => props.gameState?.playerX ?? props.level?.startX)
const playerY = computed(() => props.gameState?.playerY ?? props.level?.startY)
const executionResult = computed(() => props.executionResult ?? null)
const runtimeError = computed(() => executionResult.value?.runtimeError ?? null)
const levelCompleted = computed(() => executionResult.value?.completed === true)
const completedSummary = computed(() => {
  const steps = executionResult.value?.stepsExecuted ?? 0
  return steps === 1 ? 'Solved in 1 step.' : `Solved in ${steps} steps.`
})

const formatPosition = (position: { x: number, y: number }) => `x ${position.x}, y ${position.y}`
const formatMove = (move: { dx: number, dy: number }) => `dx ${move.dx}, dy ${move.dy}`
</script>

<style scoped>
.preview-panel {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  overflow: hidden;
}

.preview-container {
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  min-height: 0;
  min-width: 0;

  gap: 18px;
  padding: 18px;
  box-sizing: border-box;
}

.preview-scale {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.preview-scale :deep(canvas),
.preview-scale :deep(svg),
.preview-scale :deep(.level-preview) {
  max-width: 100%;
  max-height: 100%;

  width: auto;
  height: auto;

  object-fit: contain;
}

.control-wrapper {
  flex-shrink: 0;

  display: flex;
  justify-content: center;

  padding: 16px;
}

.execution-banner {
  width: min(100%, 620px);
  display: flex;
  align-items: flex-start;
  gap: 14px;
  border-radius: 8px;
  padding: 16px 18px;
  box-shadow: 0 10px 26px rgba(0,0,0,0.08);
}

.execution-banner strong {
  display: block;
  font-size: 18px;
  line-height: 1.2;
  margin-bottom: 4px;
}

.execution-banner span {
  display: block;
  line-height: 1.35;
}

.success-banner {
  color: #064e2f;
  background: linear-gradient(135deg, #dcfce7 0%, #86efac 100%);
  border: 2px solid #22c55e;
}

.error-banner {
  color: #7f1d1d;
  background: #fef2f2;
  border: 2px solid #ef4444;
}

.status-icon {
  flex: 0 0 auto;
  font-size: 34px;
}

.error-details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 18px;
  margin: 12px 0 0;
}

.error-details div {
  min-width: 0;
}

.error-details dt {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.error-details dd {
  margin: 2px 0 0;
  overflow-wrap: anywhere;
}

@media (max-width: 640px) {
  .error-details {
    grid-template-columns: 1fr;
  }
}
</style>
