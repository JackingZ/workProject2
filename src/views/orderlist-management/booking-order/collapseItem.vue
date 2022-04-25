<template>
  <div
    v-loading="loading"
    class="item-form"
  >
    <div class="item-back">
      <span style="float: left;">原单号：{{ orderCode }}</span>
      <span
        style="cursor: pointer;"
        @click="goBack"
      >
        <i class="el-icon-back" />
        <span>返回</span>
      </span>
    </div>
    <div>
      <el-select
        v-model="formStatus"
        :loading="selectLoading"
        :disabled="orderType !== '0'"
        size="small"
        style="width: 200px;margin: 10px 0 0 20px;"
        placeholder="订单状态"
        filterable
        @change="onStatus"
      >
        <el-option
          v-for="item in statusList"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <el-button
        v-show="isSave"
        :disabled="orderType !== '0'"
        :loading="btnLoading"
        type="primary"
        size="small"
        style="margin-left: 10px;"
        @click="saveStatus"
      >
        保存
      </el-button>
    </div>
    <div style="padding: 5px 20px 20px;background-color: #fff;">
      <el-collapse
        v-model="activeName"
        @change="handleChange"
      >
        <el-collapse-item
          v-show="!!isEffect || !!formStatus"
          name="1"
        >
          <template slot="title">
            <span style="font-size: 16px;font-weight: bold;">舱单信息</span>
          </template>
          <oneForm
            v-show="isType === '1' || isType === '2'"
            ref="oneForm"
            :is-status="formStatus"
            :is-effect="isEffect"
            :is-order="isOrder"
            :order-type="orderType"
            @refresh="onRefresh('1')"
            @btnLoad="setBtn"
          />
          <fourForm
            v-show="isType === '0'"
            ref="fourForm"
            :is-status="formStatus"
            :is-effect="isEffect"
            :is-order="isOrder"
            :order-type="orderType"
            @refresh="onRefresh('4')"
          />
        </el-collapse-item>
        <el-collapse-item
          v-show="!!isEffect && (isType === '1' || isType === '2')"
          name="4"
        >
          <template slot="title">
            <span style="font-size: 16px;font-weight: bold;">提单信息</span>
          </template>
          <fiveForm
            ref="fiveForm"
            :is-status="formStatus"
            :is-effect="isEffect"
            :is-order="isOrder"
            :order-type="orderType"
            @refresh="onRefresh('5')"
          />
        </el-collapse-item>
        <el-collapse-item
          v-show="!!isEffect && (isType === '1' || isType === '2')"
          name="2"
        >
          <template slot="title">
            <span style="font-size: 16px;font-weight: bold;">货柜信息</span>
          </template>
          <twoForm
            ref="twoForm"
            :is-status="formStatus"
            :is-effect="isEffect"
            :is-order="isOrder"
            :order-type="orderType"
            @refresh="onRefresh('2')"
          />
        </el-collapse-item>
        <el-collapse-item
          v-show="(isType === '1' || isType === '2') && formStatus && formStatus !== '202' && formStatus !== '207' && formStatus !== '208' && (formStatus === '204' || isThrow)"
          name="3"
        >
          <template slot="title">
            <span style="font-size: 16px;font-weight: bold;">甩柜信息</span>
          </template>
          <threeForm
            ref="threeForm"
            :is-status="formStatus"
            :is-effect="isEffect"
            :is-order="isOrder"
            :order-type="orderType"
            @refresh="onRefresh('3')"
          />
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script  lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import oneForm from '@/views/orderlist-management/booking-order/oneForm.vue'
import twoForm from '@/views/orderlist-management/booking-order/twoForm.vue'
import threeForm from '@/views/orderlist-management/booking-order/threeForm.vue'
import fourForm from '@/views/orderlist-management/booking-order/fourForm.vue'
import fiveForm from '@/views/orderlist-management/booking-order/fiveForm.vue'
import {
  getOrderStep,
  getAirStep,
  getSo,
  getAir,
  getContain,
  getThrow,
  getPut
} from '@/api/orderlist-at-booking'

@Component({
  name: '',
  components: {
    oneForm,
    twoForm,
    threeForm,
    fourForm,
    fiveForm
  },
  props: {
    orderType: {
      type: String,
      default: ''
    },
    orderCode: {
      type: String,
      default: ''
    }
  }
})

export default class TabsData extends Vue {
  private activeName: string = '1'
  private formStatus: any = ''
  private selectLoading: boolean = false
  private btnLoading: boolean = false
  private loading: boolean = false
  private statusList: any[] = []
  private isOrder: any = {}
  private orderId: any = ''
  private isEffect: any = ''
  private isType: any = ''
  private isThrow: boolean = false
  private statusData: any[] = [
    // { key: '201', value: '待处理', keys: ['201'] },
    { key: '202', value: '已放SO', keys: ['202'] },
    { key: '207', value: '补料确认', keys: ['202', '207', '208'] },
    { key: '208', value: '已放单', keys: ['202', '207', '208'] },
    { key: '203', value: '已上船', keys: ['203', '204', '207', '208'] },
    { key: '204', value: '已甩柜', keys: ['203', '204'] },
    { key: '205', value: '已开船', keys: ['203', '205'] },
    { key: '206', value: '已抵达', keys: ['205', '206'] },
    { key: '209', value: '已完成', keys: ['206', '209'] }
  ]
  private statusAir: any[] = [
    { key: '211', value: '已放仓', keys: ['211'] },
    { key: '212', value: '航司已收货', keys: ['211', '212'] },
    { key: '213', value: '已排仓', keys: ['213', '212'] },
    { key: '214', value: '已起飞', keys: ['214', '213'] },
    { key: '216', value: '已抵达', keys: ['216', '215', '214'] },
    { key: '217', value: '二程已抵达', keys: ['217', '214'] },
    { key: '215', value: '二程已起飞', keys: ['215', '217'] },
    { key: '218', value: '可提货', keys: ['218', '216'] },
    { key: '219', value: '已提货', keys: ['218', '219'] }
  ]

  // -- computed --
  get isSave() {
    if ((this.isType === '1' || this.isType === '2') && this.isEffect && this.formStatus !== '202' && this.formStatus !== '204') {
      return true
    } else {
      return false
    }
  }
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }

  // -- methods --
  private handleChange(val: any): void {
    //
  }
  private setBtn(bool: boolean) {
    this.btnLoading = bool
  }
  private onStatus(val: any) {
    if (this.isType === '0') {
      const root4: any = this.$refs.fourForm
      root4.set(this.formStatus, true)
    }
  }
  private setStatus(val: any) {
    if (val) {
      const arr: any[] = []
      this.statusData.map((it: any) => {
        const item = it.keys.some((k: any) => k === val)
        if (item) {
          arr.push({
            key: it.key,
            value: it.value
          })
        }
      })
      return arr
    } else {
      return [{
        key: this.statusData[0].key,
        value: this.statusData[0].value
      }]
    }
  }
  private setAirStatus(val: any) {
    if (val) {
      const arr: any[] = []
      this.statusAir.map((it: any) => {
        const item = it.keys.some((k: any) => k === val)
        if (item) {
          arr.push({
            key: it.key,
            value: it.value
          })
        }
      })
      return arr
    } else {
      return [{
        key: this.statusAir[0].key,
        value: this.statusAir[0].value
      }]
    }
  }
  private saveStatus() {
    if (this.isType === '1' || this.isType === '2') {
      this.$nextTick(() => {
        const root1: any = this.$refs.oneForm
        root1.saveForm()
      })
    }
  }
  private async onRefresh(val: any) {
    this.loading = true
    if (val === '1') {
      await this.getSoDetail()
    } else if (val === '2') {
      await this.getSoDetail()
      await this.getContainDetail()
    } else if (val === '3') {
      await this.getSoDetail()
      await this.getThrowDetail()
    } else if (val === '4') {
      await this.getAirDetail()
    } else if (val === '5') {
      await this.getPutDetail()
    }
    this.loading = false
  }
  private goBack() {
    this.$emit('back')
    this.$emit('search')
    this.statusList = []
    this.formStatus = ''
    this.isEffect = ''
    this.isOrder = {}
    this.orderId = ''
    this.isType = ''
    const root1: any = this.$refs.oneForm
    root1.reset()
    const root2: any = this.$refs.twoForm
    root2.reset()
    const root3: any = this.$refs.threeForm
    root3.reset()
    const root4: any = this.$refs.fourForm
    root4.reset()
  }
  private async setData(row: any) {
    this.isOrder = row
    this.orderId = row.id
    this.isType = row.businessType
    this.loading = true
    if (this.isType === '0') {
      await this.getAirDetail()
    } else if (this.isType === '1' || this.isType === '2') {
      await this.getSoDetail()
      await this.getContainDetail()
      await this.getThrowDetail()
      await this.getPutDetail()
    }
    this.loading = false
  }
  private async getStatus() {
    this.selectLoading = true
    await getAirStep()
      .then((res: any) => {
        this.selectLoading = false
        const data = res.data || []
        this.statusList = data
      })
      .catch((err: any) => {
        return err
      })
  }
  private async getSoDetail() {
    const params = {
      bookingId: this.orderId
    }
    await getSo(params)
      .then((res: any) => {
        const data = res.data || {}
        this.formStatus = data.status
        this.isEffect = data.status
        this.statusList = this.setStatus(this.isEffect)
        const root: any = this.$refs.oneForm
        root.init(data)
        const root2: any = this.$refs.twoForm
        root2.setSo(data)
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private async getAirDetail() {
    const params = {
      bookingId: this.orderId
    }
    await getAir(params)
      .then((res: any) => {
        const data = res.data || {}
        const root: any = this.$refs.fourForm
        root.init(data)
        this.formStatus = data.status
        this.isEffect = data.status
        root.set(this.formStatus, false)
        this.statusList = this.setAirStatus(this.isEffect)
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private async getContainDetail() {
    const params = {
      bookingId: this.orderId
    }
    await getContain(params)
      .then((res: any) => {
        const data = res.data || []
        const root: any = this.$refs.twoForm
        root.init(data)
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private async getThrowDetail() {
    const params = {
      bookingId: this.orderId
    }
    await getThrow(params)
      .then((res: any) => {
        const data = res.data || {}
        this.isThrow = !!data.id
        const root: any = this.$refs.threeForm
        root.init(data)
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private async getPutDetail() {
    const params = {
      bookingId: this.orderId
    }
    await getPut(params)
      .then((res: any) => {
        const data = res.data || {}
        const root: any = this.$refs.fiveForm
        root.init(data)
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private created(): void {
    // zzz
  }
}
</script>

<style lang="scss" scoped>
.item-form {
  height: calc(100vh - 115px);
  overflow-y: auto;
  background-color: #ffffff;
  .item-back {
    text-align: right;
    padding: 0 20px;
    line-height: 50px;
    border-bottom: 1px solid #e8e8e8;
  }
}
.el-collapse {
  border-top: none;
}
</style>
