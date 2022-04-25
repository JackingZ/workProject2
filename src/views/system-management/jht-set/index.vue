<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info-with-back
          info=""
          title="设置"
        />
        <AttachInfo
          ref="attachInfo"
          :current-cust-id="currentCustId"
          :current-cust-type="currentCustType"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import AttachInfo from '@/views/organizers-management/common-setting/more/attachInfo.vue'
import HeadInfoWithBack from '@/components/head-info-with-back/index.vue'

@Component({
  name: 'JhtSet',
  components: {
    AttachInfo,
    HeadInfoWithBack
  },
  props: {}
})
export default class extends Vue {
  private currentCustId: any = '0'
  private currentCustType: any = 'jht'
  private created() {
    this.$nextTick(() => {
      const attchDom:any = this.$refs.attachInfo
      attchDom.init()
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
