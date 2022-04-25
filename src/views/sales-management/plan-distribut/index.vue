<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="销售计划"
        />
        <div class="app-panel">
          <el-tabs
            v-model="activeName"
            @tab-click="handleClick"
          >
            <el-tab-pane
              v-if="$checkPermission(['salesCompanyPlan'])"
              label="公司计划"
              name="first"
            >
              <CompanyPlan v-if="activeName === 'first'" />
            </el-tab-pane>
            <el-tab-pane
              v-if="$checkPermission(['salesDepartPlan'])"
              label="部门计划"
              name="second"
            >
              <DepartPlan v-if="activeName === 'second'" />
            </el-tab-pane>
            <el-tab-pane
              v-if="$checkPermission(['salesMenPlan'])"
              label="业务员计划"
              name="third"
            >
              <PersonPlan v-if="activeName === 'third'" />
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
import CompanyPlan from '@/views/sales-management/plan-distribut/company.vue'
import DepartPlan from '@/views/sales-management/plan-distribut/department.vue'
import PersonPlan from '@/views/sales-management/plan-distribut/salesman.vue'

@Component({
  name: '',
  components: {
    CompanyPlan,
    DepartPlan,
    PersonPlan
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private activeName: string = ''
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
  private created() {
    if ((this as any).$checkPermission(['salesCompanyPlan'])) {
      this.activeName = 'first'
    } else if ((this as any).$checkPermission(['salesDepartPlan']) && !(this as any).$checkPermission(['salesCompanyPlan'])) {
      this.activeName = 'second'
    } else if ((this as any).$checkPermission(['salesMenPlan']) && !(this as any).$checkPermission(['salesCompanyPlan', 'salesDepartPlan'])) {
      this.activeName = 'third'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
