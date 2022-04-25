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
        <el-row style="border-bottom: 1px solid #DCE0E5;padding: 0 15px">
          <el-col :span="5">
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
          <el-col :span="5">
            <el-form-item
              label="时间范围"
              prop="times"
            >
              <el-date-picker
                v-model="form.times"
                :clearable="false"
                unlink-panels
                type="daterange"
                align="left"
                size="small"
                value-format="yyyy-MM-dd"
                range-separator="~"
                style="width: 100%;"
                start-placeholder="起始时间"
                end-placeholder="截止时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
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
          <el-col :span="5">
            <el-form-item
              label="服务"
              prop="lscId"
            >
              <el-select
                v-model="form.lscId"
                :loading="selectLoading"
                placeholder="请选择"
                clearable
                :disabled="!form.countryId || !form.subtypeId"
                filterable
                style="width: 100%"
                @focus="getPrivatelineList"
                @change="lscChange"
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
          <el-col
            :span="4"
            style="text-align: right"
          >
            <el-button
              type="primary"
              size="small"
              @click="loadOrder"
            >
              查询
            </el-button>
            <el-button
              size="small"
              @click="resetForm"
            >
              重置
            </el-button>
          </el-col>
        </el-row>
        <div style="margin-top: 20px;display: flex;justify-content: space-between;align-items: center">
          <div style="display: flex;align-items: center;flex: 1">
            <span
              class="title"
              style="padding: 0 30px"
            >
              已筛选订单
            </span>
            <el-radio-group
              v-model="orderType"
              size="small"
            >
              <el-radio-button
                label="all"
              >
                全部
              </el-radio-button>
              <el-radio-button
                label="selected"
              >
                已选择
              </el-radio-button>
            </el-radio-group>
            <span style="margin:0 10px">
              <span class="label">已选择：</span>
              <span class="value">{{ selectOrderListInfo.num }} 票，{{ selectOrderListInfo.volume }} CBM，{{ selectOrderListInfo.weight }} KGS</span>
            </span>
            <span>
              <el-form-item
                style="display: inline-block;margin-bottom: 0"
                label="装货仓库"
                prop="warehouseId"
              >
                <el-select
                  v-model="form.warehouseId"
                  :loading="selectLoading"
                  placeholder="请选择"
                  clearable
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
            </span>
          </div>
          <div style="text-align: right;padding-right: 15px">
            <el-form-item
              label="手动添加订单"
              label-width="120px"
              style="display: inline-block;margin-bottom: 0"
            >
              <el-input
                v-model="searchCode"
                placeholder="请输入"
                :disabled="!form.warehouseId"
                style="width: 200px;margin-right: 10px"
              />
              <el-button
                type="primary"
                :disabled="!form.warehouseId"
                @click="searchOrderByCode"
              >
                添加
              </el-button>
            </el-form-item>
          </div>
        </div>
        <div
          v-loading="loading"
          class="order-list-wrap"
        >
          <div
            v-if="showList.length"
            class="order-list"
            :style="{height: '100%'}"
          >
            <div
              v-for="item in showList"
              :key="item.code"
              class="order-item"
            >
              <div
                class="header-recommend"
              >
                <span class="recommend-item">
                  <span>供应商：</span>
                  <span
                    v-if="(item.selectSupplier || {}).supplierId === item.supplierId"
                    class="recommend-supplier"
                  >
                    推荐
                  </span>
                  <span>{{ (item.selectSupplier || {}).supplierName || '--' }}</span>
                  <span
                    v-if="item.supplierList.length"
                    style="cursor: pointer;color: #409EFF;margin-right: 15px"
                    @click="showDialog(item)"
                  >
                    切换
                  </span>
                </span>
                <span class="recommend-item">
                  <span>单价：</span>
                  <span v-if="item.supplierList.length">
                    {{ (item.um || {}).currencyId }} {{ (item.selectSupplier || {}).outPrice }}
                    <span v-if="item.xtype === '0'"> / {{ (item.um || {}).umWeight }}</span>
                    <span v-if="item.xtype === '1'"> / {{ (item.um || {}).umVolume }}</span>
                    <span v-if="item.xtype === '2'"> 柜型</span>
                  </span>
                  <span v-else>--</span>
                </span>
                <span class="recommend-item">
                  <span>总价：</span>
                  <span
                    v-if="item.supplierList.length"
                    class="recommend-price"
                  >
                    {{ (item.selectSupplier || {}).totalOutPrice }} {{ (item.um || {}).currencyId }}
                  </span>
                  <span v-else>--</span>
                </span>
              </div>
              <div class="order-info">
                <el-checkbox
                  v-if="orderType === 'all' && form.warehouseId && render"
                  :checked="selectOrderCodes.includes(item.code)"
                  :disabled="!item.isShipment || (item.warehouse1 || {}).id !== form.warehouseId || item.supplierList.length === 0"
                  style="width: 23px;text-align: right;padding-right: 5px;margin-right: 0;padding-top: 5px"
                  @change="(val) => selectOrder(val, item)"
                />
                <div style="display: flex;flex-flow: row wrap;">
                  <div style="width: 150px;padding: 5px 5px 0 5px;">
                    <div class="text-tip">
                      原单号：
                    </div>
                    <div
                      class="text-info"
                      :title="item.code"
                    >
                      <span
                        v-copy="item.code"
                        class="copy-icon"
                      />
                      <span>{{ item.code }}</span>
                    </div>
                    <div>
                      <span
                        v-if="item.beShip"
                        class="btn-tip-red"
                      >
                        特批发货
                      </span>
                      <span
                        v-if="item.ifFrozen"
                        class="btn-tip-red"
                      >
                        冻结
                      </span>
                      <span
                        v-if="item.ifLocked"
                        class="btn-tip-blue"
                      >
                        锁舱
                      </span>
                      <span
                        v-if="item.payMethod !== '1' && formatPay(item)"
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
                        v-if="formatInsuf(item)"
                        class="btn-tip-red"
                      >
                        信用不足
                      </span>
                    </div>
                  </div>

                  <div
                    v-if="item.addressType === '1'"
                    style="width: 120px;padding: 5px 5px 0 5px;"
                  >
                    <div class="text-tip">
                      目的城市：
                    </div>
                    <div class="text-info">
                      {{ (item.consignee || {}).city || '--' }}
                    </div>
                  </div>
                  <div
                    v-if="item.addressType === '0'"
                    style="width: 120px;padding: 5px 5px 0 5px;"
                  >
                    <div class="text-tip">
                      目的仓：
                    </div>
                    <div class="text-info">
                      {{ (item.fbastore || {}).code }}
                    </div>
                  </div>

                  <div style="width: 150px;padding: 5px 5px 0 5px;">
                    <div class="text-tip">
                      服务：
                    </div>
                    <div class="text-info">
                      {{ (item.lsc || {}).value || '--' }}
                    </div>
                  </div>

                  <div style="width: 150px;padding: 5px 5px 0 5px;">
                    <div class="text-tip">
                      下单仓库：
                    </div>
                    <div class="text-info">
                      {{ (item.warehouse || {}).name || '--' }}
                    </div>
                  </div>

                  <div style="width: 150px;padding: 5px 5px 0 5px;">
                    <div class="text-tip">
                      货物所在仓：
                    </div>
                    <div class="text-info">
                      {{ (item.warehouse1 || {}).name || '--' }}
                    </div>
                  </div>

                  <div style="width: 100px;padding: 5px 5px 0 5px;">
                    <div class="text-tip">
                      总体积：
                    </div>
                    <div class="text-info">
                      {{ item.allVolumeNum }} CBM
                    </div>
                  </div>

                  <div style="width: 100px;padding: 5px 5px 0 5px;">
                    <div class="text-tip">
                      总重量：
                    </div>
                    <div class="text-info">
                      {{ item.allWeightNum }} KGS
                    </div>
                  </div>

                  <div style="width: 100px;padding: 5px 5px 0 5px;">
                    <div class="text-tip">
                      最大重量：
                    </div>
                    <div class="text-info">
                      {{ item.maxWei }} KGS
                    </div>
                  </div>

                  <div style="width: 100px;padding: 5px 5px 0 5px;">
                    <div class="text-tip">
                      最大体积：
                    </div>
                    <div class="text-info">
                      {{ item.maxVol }} CBM
                    </div>
                  </div>

                  <div style="width: 100px;padding: 5px 5px 0 5px;">
                    <div class="text-tip">
                      件数：
                    </div>
                    <div class="text-info">
                      {{ item.packages }}
                    </div>
                  </div>

                  <div style="width: 100px;padding: 5px 5px 0 5px;">
                    <div class="text-tip">
                      计量状态：
                    </div>
                    <div class="text-info">
                      {{ (statusList.find(e => e.id === item.status['MEASURE']) || {name: '--'}).name }}
                    </div>
                  </div>

                  <div style="width: 100px;padding: 5px 5px 0 5px;">
                    <div class="text-tip">
                      验货状态：
                    </div>
                    <div class="text-info">
                      {{ (statusList.find(e => e.id === item.status['EXAMINE']) || {name: '--'}).name }}
                    </div>
                  </div>

                  <div style="width: 100px;padding: 5px 5px 0 5px;">
                    <div class="text-tip">
                      报关状态：
                    </div>
                    <div class="text-info">
                      {{ (statusList.find(e => e.id === item.status['CUSTOM_DECLARATION']) || {name: '--'}).name }}
                    </div>
                  </div>

                  <div style="width: 100px;padding: 5px 5px 0 5px;">
                    <div class="text-tip">
                      快递单号：
                    </div>
                    <div class="text-info">
                      <div v-if="item.deliveryWay === '0'">
                        <el-popover
                          v-if="item.express && item.express.trackingNos"
                          title="快递单号"
                        >
                          <p
                            v-for="e in item.express.trackingNos.split(',')"
                            :key="e"
                          >
                            {{ e }}
                          </p>
                          <span
                            slot="reference"
                            style="color: #2291E6;cursor: pointer;"
                          >
                            已出
                          </span>
                        </el-popover>
                        <span v-else>
                          未出
                        </span>
                      </div>
                      <div v-else>
                        --
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-else
            class="order-none"
            :style="{height: '100%'}"
          >
            暂无订单
          </div>
        </div>
      </el-form>
    </div>
    <div style="height: 32px;text-align: right">
      <el-pagination
        v-show="orderType === 'all'"
        :current-page.sync="pagination.page"
        :page-size="pagination.size"
        layout="total, prev, pager, next"
        :total="pagination.total"
        style="text-align: right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
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
    <el-dialog
      title="选择供应商"
      :visible="visible"
      :close-on-click-modal="false"
      width="500px"
      @close="cancelSupperier"
    >
      <el-table
        :data="orderSupplierList"
        height="500px"
        border
      >
        <el-table-column
          prop="fromCustName"
          label="供应商"
        >
          <template slot-scope="scope">
            <el-radio
              v-model="selectSupplier.supplierId"
              :disabled="!scope.row.totalPrice"
              :label="scope.row.fromCustId"
              @change="selectRowChange"
            >
              <span
                v-if="scope.row.fromCustId === showDialogRow.supplierId"
                class="recommend-supplier"
              >
                推荐
              </span>
              {{ scope.row.fromCustName }}
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          label="单价"
          width="180"
        >
          <template slot-scope="scope">
            {{ scope.row.currencyId + ' ' + scope.row.unitPrice }}
            <span v-if="scope.row.xtype === '0'"> / {{ scope.row.umWeight }}</span>
            <span v-if="scope.row.xtype === '1'"> / {{ scope.row.umVolume }}</span>
            <span v-if="scope.row.xtype === '2'"> / {{ '柜型' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="总价"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.totalPrice + ' ' + scope.row.currencyId }}
          </template>
        </el-table-column>
      </el-table>
      <div
        slot="footer"
        style="text-align: right;"
      >
        <el-button
          size="small"
          @click="cancelSupperier"
        >
          取 消
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="confirmSupperier"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getCountryList,
  getServiceSubtypeList,
  getLscComplicatedList,
  getOrderList,
  getWarehouseList,
  getOrderData
} from '@/api/outsourc-shipment'
import dayjs from 'dayjs'

@Component({
  name: 'index',
  components: {},
  props: {
    formType: {
      type: String,
      default: 'add'
    },
    statusList: {
      type: Array,
      default: () => ([])
    }
  }
})
export default class extends Vue {
  /* data */
  private render: boolean = false
  private loading: boolean = false
  private visible: boolean = false
  private selectLoading: boolean = false
  private orderType: any = 'all'
  private searchCode: any = ''
  private form: any = {
    subtypeId: '',
    subtypeName: '',
    times: [],
    countryId: '',
    countryName: '',
    lscId: '',
    lscName: '',
    warehouseId: '',
    warehouseName: ''
  }
  private selectSupplier: any = {}
  private showDialogRow: any = {}
  private rules: any = {
    subtypeId: { required: true, message: '请选择业务类型', trigger: 'change' },
    // times: { required: true, message: '请选择时间范围', trigger: 'change' },
    countryId: { required: true, message: '请选择目的国', trigger: 'change' },
    lscId: { required: true, message: '请选择服务', trigger: 'change' },
    warehouseId: { required: true, message: '请选择装货仓库', trigger: 'change' }
  }
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  private countryList: any[] = []
  private lscList: any[] = []
  private typeList: any[] = []
  private orderList: any[] = []
  private selectOrderList: any[] = []
  private warehouseList: any[] = []
  private orderSupplierList: any[] = []
  /* computed */
  get selectOrderCodes() {
    return this.selectOrderList.map((e: any) => e.code)
  }
  get selectOrderListInfo() {
    return this.selectOrderList.reduce((info: any, next: any) => {
      info.volume = parseFloat((next.allVolumeNum + info.volume).toFixed(2))
      info.weight = parseFloat((next.allWeightNum + info.weight).toFixed(2))
      info.packages = next.packages + info.packages
      return info
    }, { num: this.selectOrderList.length, volume: 0, weight: 0, packages: 0 })
  }
  get showList() {
    return this.orderType === 'all' ? this.orderList : this.selectOrderList
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
  private cancelSupperier() {
    this.orderSupplierList = []
    this.selectSupplier = {}
    this.showDialogRow = {}
    this.visible = false
  }
  private confirmSupperier() {
    if (!this.selectSupplier.supplierId) {
      this.$message.warning('请选择供应商')
      return
    }
    // this.showDialogRow.selectSupplier = { ...this.selectSupplier }
    this.selectOrderList = this.selectOrderList.map((s: any) => {
      if (this.showDialogRow.code === s.code) {
        s.selectSupplier = { ...this.selectSupplier }
      }
      return s
    })
    this.orderList = this.orderList.map((s: any) => {
      if (this.showDialogRow.code === s.code) {
        s.selectSupplier = { ...this.selectSupplier }
      }
      return s
    })
    this.cancelSupperier()
  }
  private showDialog(row: any) {
    const selectSupplier = row.selectSupplier || {}
    this.orderSupplierList = row.supplierList || []
    this.selectSupplier = JSON.parse(JSON.stringify(selectSupplier))
    this.showDialogRow = row
    this.visible = true
  }
  private selectRowChange() {
    const selectSupplier = this.orderSupplierList.find((s: any) => s.fromCustId === this.selectSupplier.supplierId) || {}
    this.selectSupplier.supplierName = selectSupplier.fromCustName
    this.selectSupplier.outPrice = selectSupplier.unitPrice
    this.selectSupplier.totalOutPrice = selectSupplier.totalPrice
    this.selectSupplier.priceId = selectSupplier.priceId
  }
  private nextStep() {
    const formRef: any = this.$refs.form
    formRef.validate((valid: any) => {
      if (valid) {
        if (this.selectOrderList.length === 0) {
          this.$message.error('请选择订单')
          return
        }
        const selectSupplier = [...new Set(this.selectOrderList.map((r: any) => (r.selectSupplier || {}).supplierId).filter((s: any) => s))]
        if (selectSupplier.length !== 1) {
          this.$message.error('已选订单供应商不一致')
          return
        }
        this.$emit('nextStep', {
          form: this.form,
          selectOrderList: this.selectOrderList,
          selectOrderListInfo: this.selectOrderListInfo
        })
      }
    })
  }
  private subtypeChange() {
    this.form.subtypeName = (this.typeList.find((t: any) => t.id === this.form.subtypeId) || {}).name
    this.lscList = []
    this.form.lscId = ''
    this.form.lscName = ''
    this.selectOrderList = []
    this.orderList = []
  }
  private lscChange() {
    this.form.lscName = (this.lscList.find((t: any) => t.id === this.form.lscId) || {}).name
    this.selectOrderList = []
    this.orderList = []
  }
  private countryChange() {
    this.form.countryName = (this.countryList.find((t: any) => t.id === this.form.countryId) || {}).name
    this.lscList = []
    this.form.lscId = ''
    this.form.lscName = ''
    this.selectOrderList = []
    this.orderList = []
  }
  private warehouseChange() {
    this.form.warehouseName = (this.warehouseList.find((w: any) => w.id === this.form.warehouseId) || {}).name
    this.selectOrderList = []
    this.searchCode = ''
    this.render = false
    this.$nextTick(() => {
      this.render = true
    })
  }
  private searchOrderByCode() {
    if (!this.searchCode) {
      this.$message.warning('请输入原单号')
      return
    }
    const params = {
      code: this.searchCode
    }
    this.loading = true
    getOrderData(params).then((res: any) => {
      this.loading = false
      const data = res.data || {}
      if (data.ifLoading === 1) {
        this.$message.warning('订单已发货')
        return
      }
      if (this.form.lscId !== (data.transChannel || {}).id) {
        this.$message.warning('服务不一致')
        return
      }
      if ((data.warehouse1 || {}).id !== this.form.warehouseId) {
        this.$message.warning('货物所在不一致')
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
      if (!data.beShip && (data.supplierList || []).length === 0) {
        this.$message.warning('暂无报价')
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
      if (this.boolOrder(data) && (data.warehouse1 || {}).id === this.form.warehouseId) {
        let w = 0
        let v = 0
        let wUnit = ''
        let vUnit = ''
        const measure = data.measure
        if (measure) {
          w = measure.totalWeight
          v = measure.totalVolume
          wUnit = 'KGS'
          vUnit = 'CBCM'
          data.maxVol = parseFloat((this as any).$volumeConversion(measure.maxVolume, vUnit, 'CBM', 2))
          data.maxWei = parseFloat((this as any).$volumeConversion(measure.maxWeight, wUnit, 'KGS', 2))
        }
        data.allVolumeNum = parseFloat((this as any).$volumeConversion(v, vUnit, 'CBM', 2))
        data.allWeightNum = parseFloat((this as any).$volumeConversion(w, wUnit, 'KGS', 2))
        const price = (data.supplierList || []).find((d: any) => d.fromCustId === data.supplierId) || {}
        data.selectSupplier = {
          supplierId: price.fromCustId,
          supplierName: price.fromCustName,
          outPrice: price.unitPrice,
          totalOutPrice: price.totalPrice,
          priceId: price.priceId
        }
        if (!this.selectOrderList.find((e: any) => e.code === data.code)) {
          this.selectOrderList.push(data)
        }
      } else {
        this.$message.warning('该订单不满足可发货条件(装货仓库、验货完成、计量完成、审核通过、无欠款、信用良好和快递订单号已出)')
      }
    }).catch(() => {
      this.loading = false
    })
  }
  private selectOrder(val: any, row: any) {
    if (val) {
      this.selectOrderList.push(row)
    } else {
      this.selectOrderList = this.selectOrderList.filter((e: any) => e.code !== row.code)
    }
  }
  private getWarehouseList() {
    const params = {
      model: {
        countryId: 'CN',
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
  private reset() {
    this.form.warehouseId = ''
    this.form.warehouseName = ''
    this.selectOrderList = []
    this.orderList = []
    this.pagination = {
      page: 1,
      size: 10,
      total: 0
    }
    this.orderType = 'all'
    this.searchCode = ''
    this.resetForm()
  }
  private resetForm() {
    this.form.subtypeId = ''
    this.form.subtypeName = ''
    this.form.times = [dayjs().subtract(30, 'day').format('YYYY-MM-DD HH:mm:ss'), dayjs().format('YYYY-MM-DD HH:mm:ss')]
    this.form.countryId = ''
    this.form.countryName = ''
    this.form.lscId = ''
    this.form.lscName = ''
    this.$nextTick(() => {
      const formRef: any = this.$refs.form
      formRef.clearValidate()
    })
  }
  private handleSizeChange(val: string) {
    this.pagination.size = Number(val)
    this.loadOrder()
  }
  private handleCurrentChange(val: string) {
    this.pagination.page = Number(val)
    this.loadOrder()
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
  private loadOrder() {
    const formRef: any = this.$refs.form
    const list = ['subtypeId', 'times', 'countryId', 'lscId']
    const errList = []
    formRef.validateField(list, (err: any) => {
      if (err) {
        errList.push(err)
      }
    })
    if (this.selectOrderList.length) {
      this.selectOrderList = this.selectOrderList.filter((s: any) => {
        return (s.lsc || {}).key === this.form.lscId
      })
    }
    if (!errList.length) {
      const params: any = {
        model: {
          delivery: this.form.countryId,
          endTime: '',
          // sellerId: '',
          service: this.form.lscId,
          startTime: '',
          type: this.form.subtypeId
          // warehouse: ''
        },
        page: this.pagination.page,
        size: this.pagination.size
      }
      if (this.form.times.length) {
        params.model.endTime = dayjs(this.form.times[1]).format('YYYY-MM-DD') + ' 23:59:59'
        params.model.startTime = dayjs(this.form.times[0]).format('YYYY-MM-DD') + ' 00:00:00'
      }
      this.orderList = []
      this.loading = true
      getOrderList(params).then((res: any) => {
        this.loading = false
        const data = res.data || {}
        this.orderList = (data.result || []).map((e: any) => {
          let w = 0
          let v = 0
          let wUnit = ''
          let vUnit = ''
          const measure = e.measure
          if (measure) {
            w = measure.totalWeight
            v = measure.totalVolume
            wUnit = 'KGS'
            vUnit = 'CBCM'
            e.maxVol = parseFloat((this as any).$volumeConversion(measure.maxVolume, vUnit, 'CBM', 2))
            e.maxWei = parseFloat((this as any).$volumeConversion(measure.maxWeight, wUnit, 'KGS', 2))
          }
          e.allVolumeNum = parseFloat((this as any).$volumeConversion(v, vUnit, 'CBM', 2))
          e.allWeightNum = parseFloat((this as any).$volumeConversion(w, wUnit, 'KGS', 2))
          e.isShipment = this.boolOrder(e)
          const selectOrder = this.selectOrderList.find((s: any) => s.code === e.code) || {}
          const price = (e.supplierList || []).find((d: any) => d.fromCustId === e.supplierId) || {}
          e.selectSupplier = selectOrder.selectSupplier || {
            supplierId: price.fromCustId,
            supplierName: price.fromCustName,
            outPrice: price.unitPrice,
            totalOutPrice: price.totalPrice,
            priceId: price.priceId
          }
          return e
        })
        this.pagination.total = data.total || 0
      }).catch(() => {
        this.loading = false
        this.orderList = []
        this.pagination.total = 0
      })
    }
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
  private getPrivatelineList() {
    const params = {
      countryId: this.form.countryId,
      subtypeId: this.form.subtypeId,
      outsourcing: '1,2'
    }
    this.selectLoading = true
    getLscComplicatedList(params).then((res: any) => {
      this.selectLoading = false
      const data = res.data || []
      this.lscList = data
    }).catch(() => {
      this.selectLoading = false
      this.lscList = []
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
      height: calc(100vh - 240px);
      overflow-y: auto;
      .order-list-wrap{
        height: calc(100vh - 430px);
        padding: 0 15px;
        margin-top: 18px;
        .order-list{
          overflow-y: auto;
          .order-item{
            border-bottom: 1px solid #dfe6ec;
            margin-bottom: 16px;
            .header-recommend{
              border-top: 1px solid #DCE0E5;
              background-color: #EDEDED;
              padding: 4px 10px;
              font-size: 14px;
              font-family: PingFang SC;
              font-weight: 400;
              color: #606266;
              .recommend-item{
                margin-right: 70px;
                &:last-child{
                  margin-right: 0;
                }
                .recommend-price{
                  color: #FF6D00;
                }
              }
            }
            .order-info{
              padding-left: 7px;
              display: flex;
              .text-tip {
                font-size: 12px;
                color: #999;
                line-height: 14px;
              }
              .text-info {
                word-break: break-all;
                font-size: 13px;
                color: #303133;
                line-height: 1.7692307692;
              }
            }
          }
        }
        .order-none{
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: #5e6d82;
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
  .recommend-supplier{
    border: 1px solid #FF6D00;
    border-radius: 2px;
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #FF6D00;
    margin-right: 5px;
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
    .el-dialog__body {
      padding: 10px;
    }
    .el-button--primary {
      color: #FFFFFF !important;
      background-color: #1890ff !important;
      border-color: #1890ff !important;
    }
  }
</style>
