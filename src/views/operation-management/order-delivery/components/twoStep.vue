<template>
  <div class="two-step">
    <div class="form-wrap">
      <div class="title">
        选择供应商
      </div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="120px"
      >
        <el-row :style="{'margin-bottom': formType === 'view' ? '0' : '18px','padding': '0 15px'}">
          <el-col
            v-if="formType !== 'add'"
            :span="5"
          >
            <el-form-item
              label="是否下单："
            >
              {{ ifOrder === 1 ? '是' : '否' }}
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              label="提货仓库："
            >
              {{ firstForm.warehouseName }}
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              :label="formType === 'view' ? '指定供应商：' : '指定供应商'"
              :prop="formType === 'view' ? '' : 'supplierId'"
            >
              <el-select
                v-if="formType !== 'view'"
                v-model="form.supplierId"
                :loading="selectLoading"
                placeholder="请选择"
                clearable
                :disabled="formType === 'view' || (ifOrder === 1 && formType === 'edit')"
                filterable
                style="width: 100%"
                @focus="getSupplierList"
              >
                <el-option
                  v-for="item in supplierList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <div
                v-else
                style="width: 100%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
                :title="(supplierList.find(e => e.id === form.supplierId) || {}).name"
              >
                {{ (supplierList.find(e => e.id === form.supplierId) || {}).name }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              :label="formType === 'view' ? '提货时间：' : '提货时间'"
              prop="time"
            >
              <el-date-picker
                v-if="formType !== 'view'"
                v-model="form.time"
                type="datetime"
                :disabled="formType === 'view'"
                style="width: 100%"
                placeholder="请选择"
                default-time="12:00:00"
              />
              <div v-else>
                {{ form.time }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item
              :label="formType === 'view' ? '车型选择：' : '车型选择'"
              prop="carType"
            >
              <el-select
                v-if="formType !== 'view'"
                v-model="form.carType"
                :loading="selectLoading"
                placeholder="请选择"
                clearable
                :disabled="formType === 'view'"
                filterable
                style="width: 100%"
                @focus="getVehicleTypeList"
              >
                <el-option
                  v-for="item in vehicleTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <div v-else>
                {{ (vehicleTypeList.find(e => e.id === form.carType) || {}).name }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="padding: 0 15px;">
          <el-col
            v-if="formType !== 'add'"
            :span="5"
          >
            <el-form-item
              :label="formType === 'view' ? '状态：' : '状态'"
              prop="status"
            >
              <el-select
                v-if="formType !== 'view'"
                v-model="form.status"
                placeholder="请选择"
                clearable
                filterable
                :disabled="formType === 'view'"
                style="width: 100%"
              >
                <el-option
                  v-for="item in carStatusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <div v-else>
                {{ (carStatusList.find(e => e.id === form.status) || {}).name }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              label="总票数："
            >
              {{ selectInfo.num }}
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              label="总件数："
            >
              {{ selectInfo.packages }}
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              label="总重量："
            >
              {{ selectInfo.allWeightNum }} KGS
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item
              label="总体积："
            >
              {{ selectInfo.allVolumeNum }} CBM
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :style="{'margin-top': formType === 'view' ? '0' : '18px','padding': '0 15px'}">
          <el-col
            :span="24"
            style="border-bottom: 1px solid rgb(220, 224, 229);padding-bottom: 10px"
          >
            <el-form-item
              :label="formType === 'view' ? '备注：' : '备注'"
            >
              <el-input
                v-if="formType !== 'view'"
                v-model="form.remark"
                type="textarea"
                :disabled="formType === 'view'"
                :rows="2"
                placeholder="请输入"
              />
              <div v-else>
                {{ form.remark }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="select-info">
          <span class="title">
            已筛选订单
          </span>
          <div
            v-if="formType !== 'view' && ifOrder !== 1"
            style="display: flex"
          >
            <el-form-item
              label="手动添加订单："
              label-width="120px"
            >
              <el-input
                v-model="searchCode"
                type="text"
                style="width: 250px"
                placeholder="请输入"
              />
            </el-form-item>
            <el-button
              type="primary"
              style="margin-left: 10px"
              size="small"
              @click="searchOrder"
            >
              添加
            </el-button>
          </div>
        </div>
      </el-form>
      <div
        v-loading="loading"
        class="order-list-wrap"
      >
        <el-collapse
          v-if="orderList.length"
          accordion
        >
          <el-collapse-item
            v-for="item in orderList"
            :key="item.key"
            class="collapse-position"
          >
            <template slot="title">
              <el-row style="background-color: #ededed;">
                <el-col
                  :span="24"
                  style="padding-left: 30px;"
                >
                  <span style="padding-left: 5px;">
                    {{ item.addressType === '0' ? 'FBA仓库 ' + '[' + item.code + ']' : '私人地址' }}
                  </span>
                  <span style="padding: 0 20px">总票数：{{ item.orderList.length }}</span>
                  <span style="padding: 0 20px">总重量：{{ item.allWeightNum }} KGS</span>
                  <span style="padding: 0 20px">总体积：{{ item.allVolumeNum }} CBM</span>
                  <span style="padding: 0 20px">总件数：{{ item.packages }}</span>
                </el-col>
              </el-row>
            </template>
            <div
              v-for="order in item.orderList"
              :key="order.id"
              class="order-info"
            >
              <div class="order-info-item">
                <div class="info-item code">
                  <div class="label">
                    原单号：
                  </div>
                  <div class="value">
                    <span
                      v-copy="order.code"
                      class="copy-icon"
                    />
                    <span>{{ order.code }}</span>
                  </div>
                  <div>
                    <span
                      v-if="order.ifFrozen"
                      class="btn-tip-red"
                    >
                      冻结
                    </span>
                    <span
                      v-if="order.ifLocked"
                      class="btn-tip-blue"
                    >
                      锁舱
                    </span>
                    <span
                      v-if="item.payMethod !== '1' && formatPay(order)"
                      class="btn-tip-red"
                    >
                      {{ item.ifPayment ? '逾期已付款' : '逾期未付款' }}
                    </span>
                    <span
                      v-if="item.payMethod === '1'"
                      class="btn-tip-red"
                    >
                      {{ item.ifPayment ? '已付款' : '未付款' }}
                    </span>
                    <span
                      v-if="formatInsuf(order)"
                      class="btn-tip-red"
                    >
                      信用不足
                    </span>
                  </div>
                </div>
                <div class="info-item w150">
                  <div class="label">
                    柜号：
                  </div>
                  <div class="value">
                    {{ order.containerNo }}
                  </div>
                </div>
                <div class="info-item w150">
                  <div class="label">
                    目的城市：
                  </div>
                  <div class="value">
                    {{ (order.consignee || {}).city }}
                  </div>
                </div>
                <div class="info-item w200">
                  <div class="label">
                    服务：
                  </div>
                  <div class="value">
                    {{ (order.lsc || {}).value }}
                  </div>
                </div>
                <div class="info-item w200">
                  <div class="label">
                    拆柜仓库：
                  </div>
                  <div class="value">
                    {{ (order.takeWarehouse || {}).name }}
                  </div>
                </div>
                <div class="info-item w150">
                  <div class="label">
                    总体积：
                  </div>
                  <div class="value">
                    {{ order.allVolumeNum }} CBM
                  </div>
                </div>
                <div class="info-item w150">
                  <div class="label">
                    总重量：
                  </div>
                  <div class="value">
                    {{ order.allWeightNum }} KGS
                  </div>
                </div>
                <div class="info-item w150">
                  <div class="label">
                    总件数：
                  </div>
                  <div class="value">
                    {{ order.packages }}
                  </div>
                </div>
                <div class="info-item w150">
                  <div class="label">
                    预计到港时间：
                  </div>
                  <div class="value">
                    {{ order.arrivalTime }}
                  </div>
                </div>
                <div class="info-item w150">
                  <div class="label">
                    货物状态：
                  </div>
                  <div class="value">
                    {{ order.statusName }}
                  </div>
                </div>
              </div>
              <div
                class="info-item"
                style="width: 100px"
              >
                <el-button
                  v-if="formType !== 'view' && ifOrder !== 1"
                  type="text"
                  size="small"
                  style="color: #CB1D1D"
                  @click="deleteOrder(item, order)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div
          v-else
          class="order-none"
        >
          <div class="none-icon" />
          <span>暂无数据</span>
        </div>
      </div>
    </div>
    <div
      class="bottom-btn"
    >
      <div>
        <el-button
          v-if="formType === 'add'"
          size="small"
          @click="reset"
        >
          清空
        </el-button>
        <el-button
          v-if="formType === 'add'"
          size="small"
          @click="prevStep"
        >
          上一步
        </el-button>
      </div>
      <div>
        <el-checkbox
          v-if="formType === 'add' || (formType === 'edit' && ifOrder !== 1)"
          v-model="checkAll"
        >
          下单给供应商
        </el-checkbox>
        <el-button
          v-if="formType !== 'view'"
          type="primary"
          size="small"
          @click="save"
        >
          保存
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  getSupplierList,
  getVehicleTypeList,
  searchOrderData
} from '@/api/order-delivery'
import dayjs from 'dayjs'

@Component({
  name: 'twoStep',
  components: {},
  props: {
    firstForm: {
      type: Object,
      default: () => ({})
    },
    selectList: {
      type: Array,
      default: () => ([])
    },
    orderStatusList: {
      type: Array,
      default: () => ([])
    },
    formType: {
      type: String,
      default: 'add'
    }
  }
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private selectLoading: boolean = false
  private searchCode: any = ''
  private checkAll: boolean = false
  private ifOrder: any = ''
  private form: any = {
    status: '',
    remark: '',
    supplierId: '',
    time: '',
    carType: ''
  }
  private rules: any = {
    supplierId: { required: true, message: '请选择供应商', trigger: 'change' }
  }
  private orderList: any[] = []
  private supplierList: any[] = []
  private vehicleTypeList: any[] = []
  /* computed */
  get carStatusList(): any[] {
    return (this as any).orderStatusList.filter((e: any) => e.type === 'TRUCK')
  }
  get selectInfo() {
    return this.orderList.reduce((selectInfo: any, e: any) => {
      e.orderList.forEach((order: any) => {
        selectInfo.allVolumeNum = parseFloat((selectInfo.allVolumeNum + order.allVolumeNum).toFixed(2))
        selectInfo.allWeightNum = parseFloat((selectInfo.allWeightNum + order.allWeightNum).toFixed(2))
        selectInfo.packages = selectInfo.packages + order.packages
      })
      selectInfo.num = selectInfo.num + e.orderList.length
      return selectInfo
    }, {
      allVolumeNum: 0,
      allWeightNum: 0,
      num: 0,
      packages: 0
    })
  }
  @Watch('selectList', { immediate: true, deep: true })
  private selectListChange(val: any[]) {
    const orderList: any[] = []
    val.forEach((e: any) => {
      if (e.orderList.length) {
        orderList.push(e)
      }
    })
    this.orderList = orderList
    this.computedOrderInfo()
  }
  /* methods */
  private setData(data: any) {
    this.ifOrder = data.ifOrder
    this.checkAll = data.ifOrder === 1
    this.form = {
      ...data.form
    }
    this.getSupplierList()
    this.getVehicleTypeList()
  }
  private prevStep() {
    this.$emit('prevStep', this.orderList)
  }
  private computedOrderInfo() {
    this.orderList.forEach((e: any) => {
      const data = e.orderList.reduce((info: any, order: any) => {
        info.allVolumeNum = parseFloat((info.allVolumeNum + order.allVolumeNum).toFixed(2))
        info.allWeightNum = parseFloat((info.allWeightNum + order.allWeightNum).toFixed(2))
        info.packages = info.packages + order.packages
        return info
      }, {
        allVolumeNum: 0,
        allWeightNum: 0,
        packages: 0
      })
      e.allVolumeNum = data.allVolumeNum
      e.allWeightNum = data.allWeightNum
      e.packages = data.packages
    })
  }
  private deleteOrder(item: any, order: any) {
    this.$confirm(`您确认要删除吗？`, '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.orderList = this.orderList.map((e: any) => {
        if (e.key === item.key) {
          e.orderList = e.orderList.filter((o: any) => o.code !== order.code)
        }
        return e
      }).filter((e: any) => e.orderList.length)
    }).catch(() => {
      return false
    })
  }
  private reset() {
    this.checkAll = false
    this.ifOrder = ''
    this.form = {
      status: '',
      remark: '',
      supplierId: '',
      time: '',
      carType: ''
    }
    this.searchCode = ''
    this.$nextTick(() => {
      const formRef: any = this.$refs.form
      formRef.clearValidate()
    })
  }
  private save() {
    const editForm: any = this.$refs.form
    editForm.validate((valid: any) => {
      if (!valid) return false
      if (this.orderList.length === 0) {
        this.$message.error('订单不能为空')
        return
      }
      if (this.orderList.length > 1) {
        this.$message.warning('订单目的仓或目的城市不一致')
        return
      }
      const selected: any = (this.orderList[0] || { orderList: [] })
      if (selected.addressType === '1' && selected.orderList.length !== 1) {
        // 私人地址
        this.$message.warning('私人地址仅能选择一个')
        return
      }
      const { supplierId, carType, status, ...obj } = this.form
      const itemS = this.supplierList.find((it: any) => it.id === supplierId) || {}
      const itemC = this.vehicleTypeList.find((it: any) => it.id === carType) || {}
      const arrCod: any[] = []
      const arrCon: any[] = []
      const bills: any[] = []
      this.orderList.map((it: any) => {
        it && it.orderList && it.orderList.map((o: any) => {
          arrCod.push(o.code)
          arrCon.push(o.containerNo)
          bills.push(o.billNo)
        })
      })
      const params: any = {
        ifOrder: this.checkAll ? 1 : 0,
        flag: selected.addressType,
        consignee: selected.addressType === '1' ? selected.address : {},
        fbastore: selected.addressType === '0' ? selected.address : {},
        ...obj,
        car: {
          key: itemC.id,
          value: itemC.name
        },
        codeList: arrCod,
        containers: arrCon,
        bills,
        count: (this as any).selectInfo.num,
        country: {
          key: (this as any).firstForm.targetCountry,
          value: (this as any).firstForm.targetCountryName
        },
        supply: {
          id: itemS.id,
          name: itemS.name
        },
        deliveryQuery: (this as any).firstForm,
        total: (this as any).selectInfo.packages,
        transport: (this as any).firstForm.transport,
        volume: (this as any).selectInfo.allVolumeNum,
        volumeUnit: 'CBM',
        warehouse: (this as any).firstForm.warehouse,
        weight: (this as any).selectInfo.allWeightNum,
        weightUnit: 'KGS'
      }
      if ((this as any).formType === 'edit') {
        params.status = this.form.status
      }
      this.$emit('save', params)
    })
  }
  private formatPay(row: any) {
    const pay = row.payTime ? dayjs(row.payTime).unix() : ''
    const now = dayjs().unix()
    const time = pay || now
    const cut = row.cutoffTime ? dayjs(row.cutoffTime).unix() : ''
    return !!cut && (cut && cut < time)
  }
  private formatInsuf(row: any) {
    return !!row.insufficient
  }
  private boolOrder(row: any) {
    // 可发货条件
    const risk = row.fullorderInsufficient || {}
    if (row.beShip) {
      return true
    } else if (row.audit === '1' && (row.status || {}).MEASURE === '7' && (row.status || {}).EXAMINE === '10' && !row.ifFrozen && (risk.insufficientStatus === 1 || (row.payMethod === '1' && row.ifPayment) || (row.payMethod !== '1' && !row.insufficient))) {
      return true
    } else {
      return false
    }
  }
  private searchOrder() {
    if (!this.searchCode) {
      this.$message.warning('请输入原单号')
      return
    }
    this.loading = true
    searchOrderData(Object.assign((this as any).firstForm, { code: this.searchCode })).then((res: any) => {
      this.loading = false
      const data = res.data || {}
      const takeWarehouse = data.takeWarehouse || {}
      if (takeWarehouse.id !== (this as any).firstForm.warehouseId) {
        this.$message.warning('拆柜仓库不一致')
        return
      }
      if (!data.beShip && (data.status || {}).MEASURE !== '7') {
        this.$message.warning('订单暂无计量信息')
        return
      }
      if (!data.beShip && (data.status || {}).EXAMINE !== '10') {
        this.$message.warning('订单未验货')
        return
      }
      if (!data.beShip && data.audit !== '1') {
        this.$message.warning('订单未审核')
        return
      }
      if (!data.beShip && data.ifFrozen) {
        this.$message.warning('订单已冻结')
        return
      }
      const risk = data.fullorderInsufficient || {}
      if (!data.beShip && !(risk.insufficientStatus === 1 || (data.payMethod === '1' && data.ifPayment) || (data.payMethod !== '1' && !data.insufficient))) {
        this.$message.warning('用户有欠款或信用不足')
        return
      }
      if (!this.boolOrder(data)) {
        this.$message.warning('该订单不满足可发货条件(装货仓库、验货完成、计量完成、审核通过、无欠款、信用良好和快递订单号已出)')
        return
      }
      const measure = data.measure || {}
      data.statusName = this.formatStatus(data)
      data.disabled = this.boolOrder(data)
      data.allVolumeNum = parseFloat((this as any).$volumeConversion(measure.totalVolume || 0, 'CBCM', 'CBM', 2))
      data.allWeightNum = parseFloat((this as any).$volumeConversion(measure.totalWeight || 0, 'KGS', 'KGS', 2))
      data.manual = true
      const key = data.addressType === '0' ? (data.fbastore || {}).code : (data.consignee || {}).cityCode
      const temp: any = this.orderList.find((e: any) => e.key === key)
      if (temp) {
        if (temp.orderList && temp.orderList.length && !temp.orderList.find((d: any) => d.code === data.code)) {
          temp.orderList.push(data)
        }
      } else {
        this.orderList.push(data.addressType === '0' ? {
          allVolumeNum: data.allVolumeNum,
          allWeightNum: data.allWeightNum,
          packages: data.packages,
          key: (data.fbastore || {}).code,
          addressType: data.addressType,
          code: (data.fbastore || {}).code,
          orderList: [data]
        } : {
          allVolumeNum: data.allVolumeNum,
          allWeightNum: data.allWeightNum,
          packages: data.packages,
          key: (data.consignee || {}).cityCode,
          addressType: data.addressType,
          cityCode: (data.consignee || {}).cityCode,
          cityName: (data.consignee || {}).city,
          orderList: [data]
        })
      }
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
  private getSupplierList() {
    const params = {
      types: '01',
      countryId: (this as any).firstForm.targetCountry,
      page: 1,
      size: 999
    }
    this.selectLoading = true
    getSupplierList(params).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      this.supplierList = data.result || []
    }).catch(() => {
      this.selectLoading = false
      this.supplierList = []
    })
  }
  private getVehicleTypeList() {
    const params = {
      countryId: (this as any).firstForm.targetCountry,
      page: 1,
      size: 999
    }
    this.selectLoading = true
    getVehicleTypeList(params).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      this.vehicleTypeList = data.result || []
    }).catch(() => {
      this.selectLoading = false
      this.vehicleTypeList = []
    })
  }
}
</script>

<style lang="scss" scoped>
  .two-step{
    height: 100%;
    background-color: #fff;
    .title{
      padding: 20px 30px;
      font-size: 18px;
      font-weight: 600;
      color: #323232;
      position: relative;
      &:before{
        position: absolute;
        top: 50%;
        left: 15px;
        transform: translateY(-50%);
        width: 4px;
        height: 20px;
        background: #409EFF;
        content: '';
      }
    }
    .form-wrap{
      height: calc(100vh - 210px);
      overflow-y: auto;
      .select-info{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 15px;
      }
      .order-list-wrap{
        height: calc(100vh - 540px);
        overflow-y: auto;
        padding: 0 15px;
        .order-info{
          padding-left: 30px;
          display: flex;
          border-bottom: 1px solid #dfe6ec;
          margin-bottom: 5px;
          &:last-child{
            border-bottom: none;
          }
          .order-info-item{
            display: flex;
            flex-wrap: wrap;
          }
          .info-item{
            padding: 5px 5px 0px;
            .label{
              font-size: 12px;
              color: #909399;
            }
            .value{
              font-size: 13px;
              color: #333333;
            }
            &.code{
              width: 200px;
            }
            &.w150{
              width: 150px;
            }
            &.w200{
              width: 200px;
            }
            &.flex1{
              flex: 1;
            }
          }
        }
        .order-none{
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          font-size: 14px;
          font-weight: 400;
          color: #303133;
          .none-icon{
            width: 234px;
            height: 145px;
            background: url("../icon/none.png") center center no-repeat;
            background-size: 100%;
          }
        }
      }
    }
    .bottom-btn{
      display: flex;
      justify-content: space-between;
      padding: 10px 15px;
      border-top: 1px solid #e8e8e8;
    }
  }
  .copy-icon{
    cursor: pointer;
    width: 12px;
    height: 12px;
    display: inline-block;
    margin-right: 5px;
    background: url("../../../../assets/imgs/copy.png") center center no-repeat;
    background-size: 100%;
    &:hover{
      background: url("../../../../assets/imgs/copy-hover.png") center center no-repeat;
      background-size: 100%;
    }
  }
  .btn-tip-red {
    color: #E12E2E;
    background-color: rgba(245, 108, 108, 0.2);
    display: inline-block;
    height: 18px;
    line-height: 18px;
    font-size: 12px;
    padding: 0 2px;
    margin: 0 1px;
    border-radius: 2px;
  }
  .btn-tip-blue {
    color: #2291E6;
    background-color: rgb(34, 145, 230, 0.2);
    display: inline-block;
    height: 18px;
    line-height: 18px;
    font-size: 12px;
    padding: 0 2px;
    margin: 0 1px;
    border-radius: 2px;
  }
  ::v-deep{
    .el-form-item{
      margin-bottom: 0 !important;
    }
    .el-form-item__label{
      padding-left: 5px;
    }
    textarea{
      resize: none;
    }
  }
  .el-collapse{
    border-top: none;
    border-bottom: none;
    ::v-deep .el-collapse-item__content{
      padding-bottom: 0;
    }
  }

  // ::v-deep .el-collapse-item__header {
  //   border-bottom: none;
  // }
  .collapse-position{
    display: flex;
    flex-flow: column;
    ::v-deep .el-collapse-item__header{
      position: relative;
      border-bottom: none;
      display: block;
      height: 32px;
      line-height: 32px;
    }
    ::v-deep .el-collapse-item__arrow{
      position: absolute;
      top: 11px;
      left: 5px;
    }
    ::v-deep .el-collapse-item__content{
      padding-bottom: 0;
      max-height: 300px;
      overflow: auto;
    }
  }
</style>
