<template>
  <div style="padding: 5px 20px 20px;background-color: #fff;">
    <el-tabs
      v-model="activeName"
      tab-position="top"
      @tab-click="handleTabClick"
    >
      <el-tab-pane
        v-if="$checkPermission(['warehouseScheduling'])"
        label="班次信息"
        name="schedulingInformation"
      >
        <scheduling-information
          v-if="currentTabIndex === 0"
          :ws-id="wsId"
          :ct-id="ctId"
          :company-id="currentCompanyId"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="$checkPermission(['warehouseShiftPost'])"
        label="班次岗位分配"
        name="shiftPostAllocation"
      >
        <shift-post-allocation
          v-if="currentTabIndex === 6"
          :ws-id="wsId"
          :ct-id="ctId"
          :company-id="currentCompanyId"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="$checkPermission(['warehouseDischargingHatch'])"
        label="分拣口"
        name="dischargingHatch"
      >
        <discharging-hatch
          v-if="currentTabIndex === 7"
          :ws-id="wsId"
          :ct-id="ctId"
          :company-id="currentCompanyId"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="$checkPermission(['warehouseOperatingCenter'])"
        label="操作中心"
        name="operatingCenter"
      >
        <operating-center
          v-if="currentTabIndex === 2"
          :ws-id="wsId"
          :ct-id="ctId"
          :company-id="currentCompanyId"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="$checkPermission(['warehouseLocationManagement'])"
        label="库位信息"
        name="locationManagement"
      >
        <location-management
          v-if="currentTabIndex === 1"
          :ws-id="wsId"
          :ws-nm="wsNm"
          :ct-id="ctId"
          :company-id="currentCompanyId"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="$checkPermission(['warehouseTransferInfmt'])"
        label="转仓信息"
        name="transferInformation"
      >
        <transfer-information
          v-if="currentTabIndex === 3"
          :ws-id="wsId"
          :ct-id="ctId"
          :company-id="currentCompanyId"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="$checkPermission(['warehouseClause'])"
        label="入库条款"
        name="warehouseClause"
      >
        <warehouse-clause
          v-if="currentTabIndex === 8"
          :ws-id="wsId"
          :company-id="currentCompanyId"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="$checkPermission(['warehouseCustItemConfig'])"
        label="成本项目配置"
        name="custItemConfig"
      >
        <cust-item-config
          v-if="currentTabIndex === 9"
          :ws-id="wsId"
          :company-id="currentCompanyId"
        />
      </el-tab-pane>
      <!-- <el-tab-pane
        label="轮岗配置"
        name="postShiftConfiguration"
      >
        <post-shift-configuration
          v-if="currentTabIndex === 5"
          :ws-id="wsId"
          :company-id="currentCompanyId"
        />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script  lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
// 排班信息
import schedulingInformation from '@/views/warehose-management/warehouse-config/schedulingInformation.vue'
// 库位管理
import locationManagement from '@/views/warehose-management/warehouse-config/locationManagement.vue'
// 操作中心
import operatingCenter from '@/views/warehose-management/warehouse-config/operatingCenter.vue'
// 卸货口
import dischargingHatch from '@/views/warehose-management/warehouse-config/dischargingHatch.vue'
// 转岗配置
import postShiftConfiguration from '@/views/warehose-management/warehouse-config/postShiftConfiguration.vue'
// 转班配置
import workShiftConfiguration from '@/views/warehose-management/warehouse-config/workShiftConfiguration.vue'
// 班次岗位分配
import shiftPostAllocation from '@/views/warehose-management/warehouse-config/shiftPostAllocation.vue'
// 转仓信息
import transferInformation from '@/views/warehose-management/warehouse-config/transferInformation.vue'
// 入库条款
import warehouseClause from '@/views/warehose-management/warehouse-config/warehouseClause.vue'
// 成本项目配置
import custItemConfig from '@/views/warehose-management/warehouse-config/custItemConfig.vue'

@Component({
  name: 'TabsData',
  components: {
    locationManagement,
    dischargingHatch,
    operatingCenter,
    postShiftConfiguration,
    schedulingInformation,
    workShiftConfiguration,
    shiftPostAllocation,
    transferInformation,
    warehouseClause,
    custItemConfig
  },
  props: {
    wsId: {
      type: String,
      default: ''
    },
    wsNm: {
      type: String,
      default: ''
    },
    ctId: {
      type: String,
      default: ''
    }
  }
})

export default class TabsData extends Vue {
  private activeName: string = 'schedulingInformation'
  private currentTabIndex: number = 0
  private currentCompanyId: string = ''

  // -- computed --
  // -- methods --
  private handleTabClick(tab: any, event: any): void {
    switch (tab.name) {
      case 'schedulingInformation':
        this.currentTabIndex = 0
        break
      case 'locationManagement':
        this.currentTabIndex = 1
        break
      case 'operatingCenter':
        this.currentTabIndex = 2
        break
      case 'transferInformation':
        this.currentTabIndex = 3
        break
      case 'workShiftConfiguration':
        this.currentTabIndex = 4
        break
      case 'postShiftConfiguration':
        this.currentTabIndex = 5
        break
      case 'shiftPostAllocation':
        this.currentTabIndex = 6
        break
      case 'dischargingHatch':
        this.currentTabIndex = 7
        break
      case 'warehouseClause':
        this.currentTabIndex = 8
        break
      case 'custItemConfig':
        this.currentTabIndex = 9
        break
    }
  }
  private created(): void {
    // zzz
  }
}
</script>
