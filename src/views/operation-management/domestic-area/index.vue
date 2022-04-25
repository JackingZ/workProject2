<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="区域配置"
        />
        <div class="app-panel">
          <el-tabs
            v-model="activeName"
            @tab-click="handleClick"
          >
            <el-tab-pane
              label="国内区域"
              name="first"
            >
              <internalData v-if="activeName === 'first'" />
            </el-tab-pane>
            <el-tab-pane
              label="城市分区"
              name="second"
            >
              <citiesData v-if="activeName === 'second'" />
            </el-tab-pane>
            <el-tab-pane
              label="国家分区"
              name="third"
            >
              <countriesData v-if="activeName === 'third'" />
            </el-tab-pane>
            <el-tab-pane
              label="仓库分区"
              name="fourth"
            >
              <warehousesData v-if="activeName === 'fourth'" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import internalData from '@/views/operation-management/domestic-area/internal.vue'
import citiesData from '@/views/operation-management/domestic-area/cities.vue'
import countriesData from '@/views/operation-management/domestic-area/countries.vue'
import warehousesData from '@/views/operation-management/domestic-area/warehouses.vue'

@Component({
  name: '',
  components: {
    internalData,
    citiesData,
    countriesData,
    warehousesData
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private activeName: string = 'first'
  /* computed */

  get labelPosition() {
    const lang = AppModule.language
    if (!lang) {
      return 'left'
    }
    return lang === 'en' ? 'top' : 'left'
  }

  get lang() {
    const lang = AppModule.language
    if (!lang) {
      return 'en'
    }
    return lang
  }

  /* methods */
  private handleClick(tab: any, event: any): void {
    // console.log(tab, event)
  }
}
</script>

<style lang="scss" scoped>

</style>
