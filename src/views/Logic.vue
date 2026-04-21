<template>
  <ion-page>
    <Header />

    <ion-content :fullscreen="true">
      <div class="split-layout">
        <section class="pane left-pane">
          <h2>{{ subtitle }}</h2>
          <strong>{{ message }}</strong>
        </section>

        <section class="pane right-pane">
          <p>
            Start with Ionic
            <a
              target="_blank"
              rel="noopener noreferrer"
              :href="link.url"
            >
              {{ link.text }}
            </a>
          </p>
        </section>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue'
import { Logic } from '@/composables/Logic'
import Header from '@/components/Header.vue'

const { subtitle, message, link } = Logic()
</script>

<style scoped>
.split-layout {
  display: flex;
  min-height: 100%;
}

.pane {
  padding: 24px;
  box-sizing: border-box;
  min-width: 0;
}

/* Mobile + Tablet default: 70 / 30 */
.left-pane {
  flex: 0 0 70%;
  border-right: 1px solid #dcdcdc;
}

.right-pane {
  flex: 0 0 30%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.right-pane p {
  margin: 0;
}

.right-pane a {
  text-decoration: none;
}

/* Desktop und größer: 60 / 40 */
@media (min-width: 1024px) {
  .left-pane {
    flex-basis: 60%;
  }

  .right-pane {
    flex-basis: 40%;
  }
}
</style>