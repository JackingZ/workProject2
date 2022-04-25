<template>
  <div
    v-loading="loading"
    class="form-main"
  >
    <div class="form-header">
      <el-row class="header-title">
        <el-col :span="20">
          <el-steps
            simple
            :active="activeStep"
            finish-status="wait"
            process-status="finish"
          >
            <el-step title="选择订单" />
            <el-step title="确认订单" />
          </el-steps>
        </el-col>
        <el-col
          :span="4"
          style="text-align:right;padding: 6px;"
        >
          <el-button
            type="text"
            size="mini"
            style="font-size: 14px;"
            @click="goBack"
          >
            返 回
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="form-content">
      <first-step
        v-show="activeStep === 0"
        ref="firstStep"
        :order-status-list="orderStatusList"
        :form-type="formType"
        @nextStep="nextStep"
      />
      <two-step
        v-show="activeStep === 1"
        ref="twoStep"
        :first-form="firstForm"
        :form-type="formType"
        :order-status-list="orderStatusList"
        :select-list="selectList"
        @save="save"
        @prevStep="prevStep"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import firstStep from '@/views/operation-management/order-delivery/components/firstStep.vue'
import twoStep from '@/views/operation-management/order-delivery/components/twoStep.vue'
import {
  getDeliveryOrderById,
  saveDelivery
} from '@/api/order-delivery'
import dayjs from 'dayjs'

@Component({
  name: 'index',
  components: {
    firstStep,
    twoStep
  },
  props: {
    orderStatusList: {
      type: Array,
      default: () => ([])
    }
  }
})
export default class extends Vue {
  private loading: boolean = false
  private activeStep: number = 0
  private firstForm: any = {}
  private selectList: any[] = []
  private formType: string = 'add'
  private editRow: any = {}

  private prevStep(list: any[]) {
    this.activeStep = 0
    const firstStepRef: any = this.$refs.firstStep
    firstStepRef.initByPrevStep(list)
  }
  private goBack() {
    this.$emit('goBack')
  }
  private reset() {
    const firstStepRef: any = this.$refs.firstStep
    const twoStepvRef: any = this.$refs.twoStep
    this.firstForm = {}
    this.selectList = []
    this.editRow = {}
    firstStepRef.reset()
    twoStepvRef.reset()
  }
  private add() {
    this.reset()
    this.activeStep = 0
    this.formType = 'add'
    this.editRow = {}
  }
  private view(row: any) {
    this.reset()
    this.formType = 'view'
    this.editRow = {}
    this.activeStep = 1
    this.getDeliveryOrderById(row)
  }
  private edit(row: any) {
    this.reset()
    this.formType = 'edit'
    this.editRow = row
    this.activeStep = 1
    this.getDeliveryOrderById(row)
  }
  private getDeliveryOrderById(row: any) {
    const twoStepvRef: any = this.$refs.twoStep
    const params = {
      id: row.id
    }
    this.loading = true
    getDeliveryOrderById(params).then((res: any) => {
      this.loading = false
      const data = res.data || {}
      const deliveryQuery = data.deliveryQuery || {}
      this.firstForm = Object.assign({
        ...deliveryQuery,
        warehouseId: data.warehouse.id,
        warehouseName: data.warehouse.name,
        warehouse: data.warehouse
      }, {
        targetCountry: (data.country || {}).key,
        targetCountryName: (data.country || {}).value
      })
      this.selectList = (data.orders || []).reduce((list: any[], order: any) => {
        const measure = order.measure || {}
        order.checkAll = false
        order.statusName = this.formatStatus(order)
        order.allVolumeNum = parseFloat((this as any).$volumeConversion(measure.totalVolume || 0, 'CBCM', 'CBM', 2))
        order.allWeightNum = parseFloat((this as any).$volumeConversion(measure.totalWeight || 0, 'KGS', 'KGS', 2))
        if (order.addressType === '0') {
          // FBA
          const temp = list.find((e: any) => e.code === (order.fbastore || {}).code)
          if (temp) {
            temp.allVolumeNum = parseFloat((temp.allVolumeNum + order.allVolumeNum).toFixed(2))
            temp.allWeightNum = parseFloat((temp.allWeightNum + order.allWeightNum).toFixed(2))
            temp.packages = temp.packages + order.packages
            temp.orderList.push(order)
          } else {
            list.push({
              address: (order.fbastore || {}),
              allVolumeNum: order.allVolumeNum,
              allWeightNum: order.allWeightNum,
              packages: order.packages,
              key: (order.fbastore || {}).code,
              indeterminate: false,
              checkAll: false,
              addressType: order.addressType,
              code: (order.fbastore || {}).code,
              orderList: [order]
            })
          }
        }
        if (order.addressType === '1') {
          const temp = list.find((e: any) => e.cityCode === (order.consignee || {}).cityCode)
          if (temp) {
            temp.allVolumeNum = parseFloat((temp.allVolumeNum + order.allVolumeNum).toFixed(2))
            temp.allWeightNum = parseFloat((temp.allWeightNum + order.allWeightNum).toFixed(2))
            temp.packages = temp.packages + order.packages
            temp.orderList.push(order)
          } else {
            list.push({
              address: (order.consignee || {}),
              allVolumeNum: order.allVolumeNum,
              allWeightNum: order.allWeightNum,
              packages: order.packages,
              key: (order.consignee || {}).cityCode,
              indeterminate: false,
              checkAll: false,
              addressType: order.addressType,
              cityCode: (order.consignee || {}).cityCode,
              cityName: (order.consignee || {}).city,
              orderList: [order]
            })
          }
        }
        return list
      }, [])
      twoStepvRef.setData({
        ifOrder: data.ifOrder,
        form: {
          status: row.status,
          remark: data.remark,
          supplierId: (data.supply || {}).id,
          time: data.time,
          carType: (data.car || {}).key
        }
      })
    }).catch(() => {
      this.loading = false
    })
  }
  private formatStatus(row: any) {
    const statusList = (row.statusList || []).sort((a: any, b: any) => dayjs(b.time).diff(dayjs(a.time), 'second')).reduce((list: any[], s: any) => {
      if (!list.find((e: any) => e.orderType === s.orderType)) {
        list.push(s)
      }
      return list
    }, [])
    const status = statusList[0]
    if (status) {
      return ((this as any).orderStatusList.find((e: any) => e.type === status.orderType && e.id === status.status) || { name: '--' }).name
    } else {
      return '--'
    }
  }
  private save(params: any) {
    this.loading = true
    if (this.formType === 'edit') {
      params.id = this.editRow.id
    }
    saveDelivery(params).then(() => {
      this.loading = false
      this.$message.success('保存成功')
      this.$emit('goBack', 1)
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }
  private nextStep(data: any) {
    this.activeStep = 1
    this.firstForm = data.form || {}
    this.selectList = data.selectList || []
  }
}
</script>

<style lang="scss" scoped>
  .form-main{
    .form-header{
      .header-title {
        margin: 15px 15px 0;
        padding: 0 20px;
        background-color: #fff;
        border-bottom: 1px solid #e8e8e8;
      }
    }
    .form-content{
      padding: 0 15px;
      height: calc(100vh - 160px);
    }
  }
  .el-steps--simple {
    background-color: #fff;
  }
</style>
