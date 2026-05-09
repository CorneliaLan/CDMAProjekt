<template>
  <ion-page>
    <Header />

    <ion-content
      :fullscreen="true"
      :style="{ '--background': colors.background }"
    >
      <PreviewPanel
        :level="level"
        :game-state="gameState"
        :execution-result="executionResult"
        @play="runProgram"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonContent, IonPage } from '@ionic/vue'
import Header from '@/components/Header.vue'
import PreviewPanel from '@/components/PreviewPanel.vue'
import { colors } from '@/theme/colors'
import { useEditorFacade } from '@/composables/useEditorFacade'

const defaultLevelId = ref(1)
const { level, gameState, executionResult, runProgram } = useEditorFacade(defaultLevelId)
</script>
