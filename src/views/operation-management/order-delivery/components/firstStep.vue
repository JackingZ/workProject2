<template>
  <div class="first-step">
    <div class="form-wrap">
      <div class="title">
        订单筛选
      </div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="90px"
      >
        <div class="search-form">
          <el-row
            :style="{'border-bottom': expand ? 'none' : '1px solid #DCE0E5'}"
          >
            <el-col :span="6">
              <el-form-item
                label="业务类型"
                prop="subtypeId"
              >
                <el-radio-group
                  v-model="form.subtypeId"
                  @change="subtypeChange"
                >
                  <el-radio-button
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.id"
                  >
                    {{ item.name }}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="目的国"
                prop="countryId"
              >
                <el-select
                  v-model="form.countryId"
                  :loading="selectLoading"
                  placeholder="请选择"
                  clearable
                  filterable
                  :disabled="!form.subtypeId"
                  style="width: 100%"
                  @focus="getCountryList"
                  @change="countryChange"
                >
                  <el-option
                    v-for="item in countryList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="省份"
                prop="provinceId"
              >
                <el-select
                  v-model="form.provinceId"
                  :loading="selectLoading"
                  placeholder="请选择"
                  clearable
                  :disabled="!form.countryId"
                  filterable
                  style="width: 100%"
                  @focus="getStateByCountry"
                  @change="provinceChange"
                >
                  <el-option
                    v-for="item in stateList"
                    :key="item.id"
                    :label="`${item.name}-${item.alias}`"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              v-show="expand"
              :span="6"
            >
              <el-form-item
                label="城市"
                prop="cityId"
              >
                <el-select
                  v-model="form.cityId"
                  :loading="selectLoading"
                  placeholder="请选择"
                  clearable
                  :disabled="!form.provinceId"
                  filterable
                  style="width: 100%"
                  @focus="getCityList"
                  @change="cityChange"
                >
                  <el-option
                    v-for="item in cityList"
                    :key="item.id"
                    :label="`${item.name}-${item.alias}`"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              v-show="!expand"
              :span="6"
              style="text-align: right"
            >
              <el-button
                type="primary"
                size="small"
                @click="loadData(1)"
              >
                查询
              </el-button>
              <el-button
                size="small"
                @click="resetForm"
              >
                重置
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="expand = !expand"
              >
                展开
                <i class="el-icon-arrow-up el-icon--right" />
              </el-button>
            </el-col>
          </el-row>
          <el-row
            v-show="expand"
          >
            <el-col :span="6">
              <el-form-item
                label="目的港"
                prop="targetPort"
              >
                <el-select
                  v-model="form.targetPort"
                  placeholder="请选择"
                  clearable
                  :disabled="!form.countryId"
                  filterable
                  multiple
                  collapse-tags
                  style="width: 100%"
                  @change="portChange"
                >
                  <el-option
                    v-for="item in portList"
                    :key="item.id"
                    :label="`${item.name}-${item.alias}`"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="服务"
                prop="lscId"
              >
                <el-select
                  v-model="form.lscId"
                  placeholder="请选择"
                  clearable
                  :disabled="!form.countryId || !form.subtypeId"
                  filterable
                  multiple
                  collapse-tags
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in lscList"
                    :key="item.id"
                    :label="`${item.name}-${item.abbr}`"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="目的仓"
                prop="fbaId"
              >
                <el-select
                  v-model="form.fbaId"
                  placeholder="请选择"
                  clearable
                  filterable
                  multiple
                  collapse-tags
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in fbaList"
                    :key="item.id"
                    :label="item.code"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="预计到港时间"
                label-width="120px"
                prop="time"
              >
                <el-date-picker
                  v-model="form.time"
                  :clearable="false"
                  unlink-panels
                  type="datetimerange"
                  align="right"
                  size="small"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  range-separator="~"
                  :default-time="['00:00:00', '23:59:59']"
                  style="width: 100%"
                  start-placeholder="起始时间"
                  end-placeholder="截止时间"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            v-show="expand"
            style="border-bottom: 1px solid #DCE0E5"
          >
            <el-col :span="6">
              <el-form-item
                label="柜号"
                prop="containerNo"
              >
                <el-input
                  v-model="form.containerNo"
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="货物状态"
                prop="status"
              >
                <el-checkbox-group v-model="form.status">
                  <el-checkbox
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.value"
                  >
                    {{ item.name }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
              style="text-align: right;padding-bottom: 18px"
            >
              <el-button
                type="primary"
                size="small"
                @click="loadData(1)"
              >
                查询
              </el-button>
              <el-button
                size="small"
                @click="resetForm"
              >
                重置
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="expand = !expand"
              >
                收起
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
            </el-col>
          </el-row>
        </div>
        <div class="select-info">
          <div>
            <span class="title">
              已筛选订单
            </span>
            <el-radio-group
              v-model="orderType"
              size="small"
            >
              <el-radio-button label="all">
                全部
              </el-radio-button>
              <el-radio-button label="selected">
                已选择
              </el-radio-button>
            </el-radio-group>
            <span
              style="margin: 0 10px"
            >
              {{ `已选择：${selectInfo.num}票，${selectInfo.allVolumeNum} CBM，${selectInfo.allWeightNum} KGS` }}
            </span>
            <el-form-item
              label="提货仓库"
              prop="warehouseId"
              style="display: inline-block;margin-left: 30px"
            >
              <el-select
                v-model="form.warehouseId"
                :loading="selectLoading"
                placeholder="请选择"
                clearable
                :disabled="!form.countryId"
                filterable
                style="width: 250px"
                @focus="getWarehouseList"
                @change="warehouseChange"
              >
                <el-option
                  v-for="item in warehouseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <div
            v-if="orderType === 'selected'"
            style="padding-right: 15px"
          >
            <el-form-item
              label="手动添加订单："
              label-width="120px"
              style="display: inline-block"
            >
              <el-input
                v-model="searchCode"
                :disabled="!form.warehouseId"
                type="text"
                style="width: 250px"
                placeholder="请输入"
              />
            </el-form-item>
            <el-button
              type="primary"
              :disabled="!form.warehouseId"
              style="margin-left: 10px"
              size="small"
              @click="loadData(2)"
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
          v-if="showList.length"
          accordion
        >
          <el-collapse-item
            v-for="item in showList"
            :key="item.key"
            class="collapse-position"
          >
            <template slot="title">
              <el-row style="background-color: #ededed;">
                <el-col
                  :span="24"
                  style="padding-left: 30px;"
                >
                  <el-checkbox
                    v-if="orderType === 'all' && form.warehouseId"
                    v-model="item.checkAll"
                    :indeterminate="item.indeterminate"
                    style="margin-right: 0;"
                    @change="(val) => selectGroup(val, item)"
                  />
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
              <div
                v-if="orderType === 'all' && form.warehouseId && form.warehouseId === (order.takeWarehouse || {}).id"
                style="width: 24px"
              >
                <el-checkbox
                  v-model="order.checkAll"
                  :disabled="!order.disabled"
                  style="margin-right: 0;"
                  @change="(val) => selectOrder(val, item, order)"
                />
              </div>
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
                v-if="orderType === 'selected'"
                class="info-item"
                style="width: 100px"
              >
                <el-button
                  type="text"
                  size="small"
                  style="color: #CB1D1D"
                  @click="delSelectOrder(item, order)"
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
    <div class="bottom-btn">
      <el-button
        size="small"
        @click="reset"
      >
        清空
      </el-button>
      <el-button
        type="primary"
        size="small"
        @click="nextStep"
      >
        下一步
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getServiceSubtypeList,
  getCountryList,
  getPortList,
  getLscComplicatedList,
  getStateByCountry,
  getCityByState,
  getFbastoreList,
  getWarehouseList,
  getOrderList,
  searchOrderData
} from '@/api/order-delivery'
import dayjs from 'dayjs'

@Component({
  name: 'firstStep',
  props: {
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
  private expand: boolean = false
  private loading: boolean = false
  private selectLoading: boolean = false
  private orderType: any = 'all'
  private searchCode: any = ''
  private form: any = {
    subtypeId: '', // 业务类型
    countryId: '', // 目的国
    countryName: '',
    targetPort: [], // 目的港多选
    lscId: [], // 服务多选
    provinceId: '', // 省份
    cityId: '', // 城市
    fbaId: [], // 目的仓多选
    time: [], // 预计到港时间
    containerNo: '', // 柜号
    status: [],
    warehouseId: '',
    warehouseName: '',
    warehouse: {}
  }
  private rules: any = {
    subtypeId: { required: true, message: '请选择业务类型', trigger: 'change' },
    countryId: { required: true, message: '请选择目的国', trigger: 'change' },
    warehouseId: { required: true, message: '请选择提货仓库', trigger: 'change' }
  }
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  private searchOrderParams: any = {}
  private typeList: any[] = []
  private countryList: any[] = []
  private portList: any[] = []
  private lscList: any[] = []
  private stateList: any[] = []
  private cityList: any[] = []
  private fbaList: any[] = []
  private warehouseList: any[] = []
  private orderList: any[] = []
  private statusList: any[] = [
    {
      name: '在途',
      value: '0',
      key: 'transit'
    },
    {
      name: '已到港',
      value: '1',
      key: 'arrival'
    },
    {
      name: '报关已放行',
      value: '2',
      key: 'declare'
    },
    {
      name: '已提柜',
      value: '3',
      key: 'carry'
    },
    {
      name: '已入仓',
      value: '4',
      key: 'win'
    },
    {
      name: '已拆柜',
      value: '5',
      key: 'open'
    }
  ]
  private selectList: any[] = []

  /* computed */
  get showList() {
    return this.orderType === 'all' ? this.orderList : this.selectList
  }

  get selectInfo() {
    return this.selectList.reduce((selectInfo: any, e: any) => {
      e.orderList.forEach((order: any) => {
        selectInfo.allVolumeNum = parseFloat((selectInfo.allVolumeNum + order.allVolumeNum).toFixed(2))
        selectInfo.allWeightNum = parseFloat((selectInfo.allWeightNum + order.allWeightNum).toFixed(2))
      })
      selectInfo.num = selectInfo.num + e.orderList.length
      return selectInfo
    }, {
      allVolumeNum: 0,
      allWeightNum: 0,
      num: 0
    })
  }

  /* methods */
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
  private initByPrevStep(list: any[]) {
    this.selectList = list
    this.orderList = this.orderList.map((item: any) => {
      item.checkAll = false
      item.indeterminate = false
      item.orderList = item.orderList.map((o: any) => {
        o.checkAll = false
        return o
      })
      const temp: any = this.selectList.find((s: any) => s.key === item.key)
      if (temp) {
        const orderList = (temp.orderList || []).filter((s: any) => !s.manual)
        if (orderList.length) {
          item.orderList = item.orderList.map((o: any) => {
            if (orderList.find((e: any) => e.id === o.id)) {
              o.checkAll = true
            }
            return o
          })
          if (item.orderList.length === item.orderList.filter((e: any) => e.checkAll).length) {
            item.checkAll = true
            item.indeterminate = false
          } else if (item.orderList.filter((e: any) => e.checkAll).length) {
            item.checkAll = false
            item.indeterminate = true
          } else {
            item.checkAll = false
            item.indeterminate = false
          }
        }
      }
      return item
    })
    this.computedOrderInfo()
  }
  private nextStep() {
    if (this.selectList.length === 0) {
      this.$message.warning('请选择订单')
      return
    }
    if (this.selectList.length > 1) {
      this.$message.warning('订单目的仓或目的城市不一致')
      return
    }
    const selected: any = (this.selectList[0] || { orderList: [] })
    if (selected.addressType === '1' && selected.orderList.length !== 1) {
      // 私人地址
      this.$message.warning('私人地址仅能选择一个')
      return
    }
    this.$emit('nextStep', {
      form: Object.assign(this.searchOrderParams, { warehouseId: this.form.warehouseId, warehouseName: this.form.warehouseName, warehouse: this.form.warehouse }),
      selectList: this.selectList
    })
  }

  private reset() {
    this.form.warehouseId = ''
    this.form.warehouseName = ''
    this.form.warehouse = {}
    this.searchCode = ''
    this.orderList = []
    this.selectList = []
    this.resetForm()
  }

  private searchOrder(params: any) {
    if (!this.searchCode) {
      this.$message.warning('请输入原单号')
      return
    }
    this.loading = true
    searchOrderData(Object.assign(params, { code: this.searchCode })).then((res: any) => {
      this.loading = false
      const data = res.data || {}
      const takeWarehouse = data.takeWarehouse || {}
      if (takeWarehouse.id !== this.form.warehouseId) {
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
      data.disabled = this.boolOrder(data)
      data.statusName = this.formatStatus(data)
      data.allVolumeNum = parseFloat((this as any).$volumeConversion(measure.totalVolume || 0, 'CBCM', 'CBM', 2))
      data.allWeightNum = parseFloat((this as any).$volumeConversion(measure.totalWeight || 0, 'KGS', 'KGS', 2))
      data.manual = true
      const key = data.addressType === '0' ? (data.fbastore || {}).code : (data.consignee || {}).cityCode
      const temp: any = this.selectList.find((e: any) => e.key === key)
      if (temp) {
        if (temp.orderList && temp.orderList.length && !temp.orderList.find((d: any) => d.code === data.code)) {
          temp.orderList.push(data)
        }
      } else {
        this.selectList.push(data.addressType === '0' ? {
          address: (data.fbastore || {}),
          allVolumeNum: data.allVolumeNum,
          allWeightNum: data.allWeightNum,
          packages: data.packages,
          key: (data.fbastore || {}).code,
          addressType: data.addressType,
          code: (data.fbastore || {}).code,
          orderList: [data]
        } : {
          address: (data.consignee || {}),
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
      this.computedOrderInfo()
    }).catch(() => {
      this.loading = false
    })
  }

  private warehouseChange() {
    const w = this.warehouseList.find((e: any) => e.id === this.form.warehouseId) || {}
    this.form.warehouseName = w.name
    this.form.warehouse = w
    this.selectList = []
    this.orderList = this.orderList.map((e: any) => {
      e.checkAll = false
      e.indeterminate = false
      e.orderList.forEach((o: any) => {
        o.checkAll = false
      })
      return e
    })
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

  private getWarehouseList() {
    const params = {
      model: {
        countryId: this.form.countryId,
        custId: '0'
      },
      page: 1,
      size: 999
    }
    this.selectLoading = true
    getWarehouseList(params).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      this.warehouseList = data.result || []
    }).catch(() => {
      this.selectLoading = false
      this.warehouseList = []
    })
  }

  private subtypeChange() {
    this.form.countryId = ''
    this.countryChange()
  }

  private countryChange() {
    this.form.countryName = ''
    const item = this.countryList.find((it: any) => it.id === this.form.countryId)
    if (item) {
      this.form.countryName = item.name
    }
    this.form.provinceId = ''
    this.form.warehouseName = ''
    this.form.warehouseId = ''
    this.form.warehouse = {}
    this.portChange()
    this.provinceChange()
    this.warehouseChange()
  }

  private provinceChange() {
    this.form.cityId = ''
    this.cityChange()
  }

  private cityChange() {
    this.form.fbaId = []
    this.form.targetPort = []
    this.orderList = []
    this.selectList = []
    this.getPortList()
    this.getFbastoreList()
  }

  private portChange() {
    this.orderList = []
    this.selectList = []
    this.form.lscId = []
    this.getPrivatelineList()
  }

  private getFbastoreList() {
    const params = {
      page: 1,
      size: 9999,
      codeSort: 'A',
      countryId: this.form.countryId,
      stateId: this.form.provinceId,
      cityId: this.form.cityId
    }
    this.fbaList = []
    getFbastoreList(params).then((res: any) => {
      const data = res.data || {}
      this.fbaList = data.result || []
    }).catch(() => {
      this.fbaList = []
    })
  }

  private getCityList() {
    const params = {
      stateId: this.form.provinceId
    }
    this.selectLoading = false
    getCityByState(params).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      this.cityList = data.result || []
    }).catch(() => {
      this.selectLoading = false
      this.cityList = []
    })
  }

  private getStateByCountry() {
    const params = {
      countryId: this.form.countryId
    }
    this.selectLoading = true
    getStateByCountry(params).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      this.stateList = data.result || []
    }).catch(() => {
      this.selectLoading = false
      this.stateList = []
    })
  }

  private delSelectOrder(item: any, order: any) {
    const temp: any = this.orderList.find((e: any) => e.key === item.key)
    temp.orderList.forEach((e: any) => {
      if (e.id === order.id) {
        e.checkAll = false
      }
    })
    this.selectList = this.selectList.reduce((list: any[], e: any) => {
      if (e.key === item.key) {
        e.orderList = e.orderList.filter((o: any) => o.code !== order.code)
        if (e.orderList.length) {
          temp.checkAll = false
          temp.indeterminate = true
          list.push(e)
        } else {
          temp.checkAll = false
          temp.indeterminate = false
        }
      } else {
        list.push(e)
      }
      return list
    }, [])
    this.computedOrderInfo()
  }

  private selectOrder(val: any, item: any, order: any) {
    const temp = this.selectList.find((e: any) => e.key === item.key)
    if (val) {
      if (temp) {
        if (!temp.orderList.find((e: any) => e.id === order.id)) {
          temp.orderList.push(JSON.parse(JSON.stringify(order)))
        }
        if (temp.orderList.length === item.orderList.length) {
          item.checkAll = true
          item.indeterminate = false
        } else {
          item.checkAll = false
          item.indeterminate = true
        }
      } else {
        const data = JSON.parse(JSON.stringify(item))
        const t: any = {
          ...data
        }
        t.orderList = [JSON.parse(JSON.stringify(order))]
        this.selectList.push(t)
        if (t.orderList.length === item.orderList.length) {
          item.checkAll = true
          item.indeterminate = false
        } else {
          item.checkAll = false
          item.indeterminate = true
        }
      }
    } else {
      this.selectList = this.selectList.reduce((list: any[], e: any) => {
        if (e.key === item.key) {
          e.orderList = e.orderList.filter((o: any) => o.code !== order.code)
          if (e.orderList.length) {
            item.checkAll = false
            item.indeterminate = true
            list.push(e)
          } else {
            item.checkAll = false
            item.indeterminate = false
          }
        } else {
          list.push(e)
        }
        return list
      }, [])
    }
    this.orderList = this.orderList.map((o: any) => {
      if (o.key === item.key) {
        o.orderList.forEach((e: any) => {
          if (e.id === order.id) {
            e.checkAll = val
          }
        })
      }
      return o
    })
    this.computedOrderInfo()
  }

  private selectGroup(val: any, item: any) {
    if (val) {
      const data: any = JSON.parse(JSON.stringify(item))
      data.orderList = item.orderList.filter((e: any) => (e.takeWarehouse || {}).id === this.form.warehouseId && e.disabled)
      if (data.orderList.length) {
        if (data.orderList.length === item.orderList.length) {
          item.checkAll = true
          item.indeterminate = false
        } else {
          item.checkAll = false
          item.indeterminate = true
        }
        const stemp: any = this.selectList.find((e: any) => e.key === item.key)
        if (stemp) {
          stemp.orderList = stemp.orderList.concat(data.orderList).reduce((list: any, next: any) => {
            if (!list.find((e: any) => e.code === next.code)) {
              list.push(next)
            }
            return list
          }, [])
        } else {
          this.selectList.push(data)
        }
      } else {
        item.checkAll = false
        item.indeterminate = false
      }
    } else {
      item.checkAll = false
      item.indeterminate = false
      this.selectList = this.selectList.reduce((arr: any[], e: any) => {
        if (e.key !== item.key) {
          arr.push(e)
        } else {
          e.orderList = e.orderList.filter((o: any) => o.manual)
          if (e.orderList.length) {
            arr.push(e)
          }
        }
        return arr
      }, [])
    }
    this.orderList = this.orderList.map((e: any) => {
      if (e.key === item.key) {
        e.orderList.forEach((o: any) => {
          o.checkAll = false
          if ((o.takeWarehouse || {}).id === this.form.warehouseId && o.disabled) {
            o.checkAll = val
          }
        })
      }
      return e
    })
    this.computedOrderInfo()
  }

  private computedOrderInfo() {
    this.selectList.forEach((e: any) => {
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

  private loadData(type: any) {
    const formRef: any = this.$refs.form
    const validateFields = ['subtypeId', 'countryId']
    const errList = []
    formRef.validateField(validateFields, (err: any) => {
      if (err) {
        errList.push(err)
      }
    })
    if (errList.length) return
    const params: any = {
      transport: this.form.subtypeId,
      targetCountry: this.form.countryId,
      targetCountryName: this.form.countryName,
      targetPort: this.form.targetPort,
      lscId: this.form.lscId,
      targetProvince: this.form.provinceId,
      targetCity: this.form.cityId,
      fbastoreId: this.form.fbaId,
      containerNo: this.form.containerNo
    }
    if (this.form.time && this.form.time.length) {
      params.startTime = dayjs(this.form.time[0]).format('YYYY-MM-DD HH:mm:ss')
      params.endTime = dayjs(this.form.time[1]).format('YYYY-MM-DD HH:mm:ss')
    }
    this.statusList.filter((e: any) => this.form.status.includes(e.value)).forEach((e: any) => {
      params[e.key] = true
    })
    if (type === 2) {
      this.searchOrder(params)
      return
    }
    this.selectList = []
    this.orderList = []
    this.form.warehouseId = ''
    this.form.warehouseName = ''
    this.form.warehouse = {}
    this.loading = true
    this.searchOrderParams = params
    getOrderList(params).then((res: any) => {
      this.loading = false
      const data = res.data || []
      this.orderList = data.reduce((list: any[], order: any) => {
        const measure = order.measure || {}
        order.checkAll = false
        order.disabled = this.boolOrder(order)
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
    }).catch(() => {
      this.orderList = []
      this.loading = false
    })
  }

  private resetForm() {
    this.searchOrderParams = {}
    this.form = Object.assign({
      subtypeId: '', // 业务类型
      countryId: '', // 目的国
      countryName: '',
      targetPort: [], // 目的港
      lscId: [], // 服务
      provinceId: '', // 省份
      cityId: '', // 城市
      fbaId: [], // 目的仓
      time: [], // 预计到港时间
      containerNo: '', // 柜号
      status: []
    }, { warehouseId: this.form.warehouseId, warehouseName: this.form.warehouseName, warehouse: this.form.warehouse })
    this.$nextTick(() => {
      const formRef: any = this.$refs.form
      formRef.clearValidate()
    })
  }

  private getPrivatelineList() {
    const params = {
      countryId: this.form.countryId,
      subtypeId: this.form.subtypeId,
      destinationId: this.form.targetPort.join(',')
    }
    this.lscList = []
    getLscComplicatedList(params).then((res: any) => {
      const data = res.data || []
      this.lscList = data
    }).catch(() => {
      this.lscList = []
    })
  }

  private getPortList() {
    const params: any = {
      page: 1,
      size: 9999,
      type: '',
      countryId: this.form.countryId,
      stateId: this.form.provinceId,
      cityId: this.form.cityId
    }
    this.portList = []
    switch (this.form.subtypeId) {
      case '0':
        params.type = 0
        break
      case '1':
        params.type = 1
        break
      case '2':
        params.type = 2
        break
      case '3':
        params.type = 4
        break
    }
    getPortList(params).then((res: any) => {
      const data = res.data || {}
      this.portList = data.result || []
    }).catch(() => {
      this.portList = []
    })
  }

  private getCountryList() {
    this.selectLoading = true
    getCountryList({ typeId: '05', subtypeId: this.form.subtypeId }).then((res: any) => {
      this.selectLoading = false
      this.countryList = res.data || []
    }).catch(() => {
      this.selectLoading = false
      this.countryList = []
    })
  }

  private getServiceSubtypeList() {
    const params = {
      typeId: '05'
    }
    getServiceSubtypeList(params).then((res: any) => {
      this.typeList = res.data || []
    }).catch(() => {
      this.typeList = []
    })
  }

  private created() {
    this.getServiceSubtypeList()
  }
}
</script>

<style lang="scss" scoped>
  .first-step{
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
      .search-form{
        padding: 0 15px;
      }
      .select-info{
        padding-top: 18px;
        display: flex;
        justify-content: space-between;
      }
      .order-list-wrap{
        height: calc(100vh - 395px);
        overflow-y: auto;
        padding: 0 15px;
        .order-info{
          padding-left: 32px;
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
    .el-select__tags-text{
      display: inline-block;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .el-tag__close{
      top: -6px !important;
    }
  }
</style>
