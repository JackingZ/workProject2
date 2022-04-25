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
            size="small"
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
        :status-list="statusList"
        :form-type="formType"
        @nextStep="nextStep"
      />
      <two-step
        v-show="activeStep === 1"
        ref="twoStep"
        :first-form="firstForm"
        :form-type="formType"
        :select-order-list="selectOrderList"
        :status-list="statusList"
        @prevStep="prevStep"
        @save="save"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import firstStep from '@/views/operation-management/outsourc-shipment/components/firstStep.vue'
import twoStep from '@/views/operation-management/outsourc-shipment/components/twoStep.vue'
import { save, getOrderById, edit } from '@/api/outsourc-shipment'

@Component({
  name: 'index',
  components: {
    firstStep,
    twoStep
  },
  props: {
    statusList: {
      type: Array,
      default: () => ([])
    }
  }
})
export default class extends Vue {
  /* data */
  private formType: string = 'add'
  private loading: boolean = false
  private activeStep: any = 0
  private firstForm: any = {}
  private editRow: any = {}
  private selectOrderList: any[] = []
  /* computed */
  /* methods */
  private reset() {
    const firstStepRef: any = this.$refs.firstStep
    const twoStepRef: any = this.$refs.twoStep
    this.firstForm = {}
    this.editRow = {}
    this.selectOrderList = []
    this.activeStep = 0
    firstStepRef.reset()
    twoStepRef.reset()
  }
  private view(row: any) {
    this.reset()
    this.formType = 'view'
    this.activeStep = 1
    this.getOrderById(row)
    const twoStepRef: any = this.$refs.twoStep
    twoStepRef.form.remarks = row.remarks
  }
  private edit(row: any) {
    this.reset()
    this.formType = 'edit'
    this.activeStep = 1
    this.editRow = row
    this.getOrderById(row)
    const twoStepRef: any = this.$refs.twoStep
    twoStepRef.form.remarks = row.remarks
  }
  private getOrderById(row: any) {
    this.loading = true
    getOrderById({ id: row.id }).then((res: any) => {
      this.loading = false
      const data = res.data || []
      this.firstForm = {
        subtypeId: row.type,
        subtypeName: '',
        times: [],
        countryId: row.deliveryId,
        countryName: row.deliveryName,
        lscId: row.serviceId,
        lscName: row.serviceName,
        warehouseId: row.warehouseId,
        warehouseName: row.warehouseName
      }
      this.selectOrderList = data.map((e: any) => {
        const tamp = e.fullOrder || {}
        let w = 0
        let v = 0
        let wUnit = ''
        let vUnit = ''
        const measure = tamp.measure
        if (measure) {
          w = measure.totalWeight
          v = measure.totalVolume
          wUnit = 'KGS'
          vUnit = 'CBCM'
          tamp.maxVol = parseFloat((this as any).$volumeConversion(measure.maxVolume, vUnit, 'CBM'))
          tamp.maxWei = parseFloat((this as any).$volumeConversion(measure.maxWeight, wUnit, 'KGS'))
        }
        tamp.allVolumeNum = parseFloat((this as any).$volumeConversion(v, vUnit, 'CBM'))
        tamp.allWeightNum = parseFloat((this as any).$volumeConversion(w, wUnit, 'KGS'))
        return {
          xtype: e.xtype,
          ...tamp,
          selectSupplier: {
            supplierId: row.supplierId,
            supplierName: row.supplierName,
            outPrice: e.price,
            totalOutPrice: e.totalPrice,
            priceId: e.quotedId
          }
        }
      })
    }).catch(() => {
      this.loading = false
    })
  }
  private save(data: any) {
    if (this.formType === 'edit') {
      this.loading = true
      edit({ ...data, id: this.editRow.id, ifWareHouseOut: this.editRow.ifWareHouseOut }).then(() => {
        this.loading = false
        this.$message.success('保存成功')
        this.$emit('save')
      }).catch(() => {
        this.loading = false
      })
    } else {
      this.loading = true
      save(data).then(() => {
        this.loading = false
        this.$message.success('保存成功')
        this.$emit('save')
      }).catch(() => {
        this.loading = false
      })
    }
  }
  private prevStep(list: any[]) {
    const firstStepRef: any = this.$refs.firstStep
    firstStepRef.selectOrderList = [...list]
    firstStepRef.loadOrder()
    this.activeStep = 0
  }
  private nextStep(data: any) {
    this.firstForm = data.form
    this.selectOrderList = data.selectOrderList
    this.activeStep = 1
  }
  private goBack() {
    this.activeStep = 0
    this.$emit('goBack')
  }
  private add() {
    this.reset()
    this.formType = 'add'
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
