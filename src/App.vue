<template>
  <div id="app">
    <router-view v-if="isRouterActive" />
    <service-worker-update-popup />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import ServiceWorkerUpdatePopup from '@/pwa/components/ServiceWorkerUpdatePopup.vue'

@Component({
  name: 'App',
  components: {
    ServiceWorkerUpdatePopup
  }
})
export default class extends Vue {
  @Provide() private reload = this.modify

  private isRouterActive = true

  private modify() {
    this.isRouterActive = false
    this.$nextTick(function() {
      this.isRouterActive = true
    })
  }
  private mounted() {
    this.$nextTick(() => {
      const navigator: any = window.navigator
      const lang = (navigator.language || navigator.browserLanguage).toLowerCase()
      const htmlEl = document.getElementsByTagName('html')[0]
      htmlEl.setAttribute('lang', lang)
    })
  }
}
</script>
