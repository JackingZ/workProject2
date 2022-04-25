<template>
  <div>
    <el-scrollbar
      v-loading="loading"
      class="monitor-detail"
      style="background-color: #1d2331;"
    >
      <div
        class="container"
        style="max-width: 1440px;margin: 0 auto;"
      >
        <div class="contain-header">
          <div class="header-box">
            <div class="header-left">
              <div class="line border" />
              <div class="line" />
              <div class="time">
                <span>{{ today.day }}</span>
                <span>{{ ' ' + today.week + ' ' }}</span>
                <span>{{ today.time }}</span>
              </div>
            </div>
            <div class="header-subject">
              <div class="subject-cn">
                聚货通物流快递监测系统
              </div>
              <div class="subject-en">
                JHT LOGISTICS EXPRESS MONITORING SYSTEM
              </div>
            </div>
            <div class="header-right">
              <div class="line border" />
              <div class="line" />
              <div
                class="full-screen"
                @click="handleFullScreen"
              >
                <span
                  :class="{
                    'full-screen-icon': true,
                    'reset': fullscreen
                  }"
                />
                <span>{{ fullscreen ? '还原' : '全屏' }}</span>
              </div>
              <el-checkbox
                v-model="includeLock"
                @change="changeLock"
              >
                锁舱在途
              </el-checkbox>
              <el-button
                type="primary"
                size="mini"
                class="transit-btn"
                @click="showOrderList({}, 'transit')"
              >
                查看在途
              </el-button>
            </div>
          </div>
        </div>
        <div class="contain-main details-scrollbar">
          <div class="detail-box">
            <div class="detail-subject">
              <div style="display: flex;flex-flow: row nowrap;align-items: center;">
                <div style="width: 200px;">
                  <span class="subject-text">整柜直送详情</span>
                </div>
                <div style="flex: 1;text-align: right;">
                  <el-button
                    size="medium"
                    class="unfold-btn"
                    :icon=" unfold? 'el-icon-top' : 'el-icon-bottom'"
                    :class="unfold ? 'active' : ''"
                    @click="unfold = !unfold"
                  >
                    {{ unfold ? '收起筛选' : '展开筛选' }}
                  </el-button>
                </div>
              </div>
            </div>
            <div
              v-show="unfold"
              class="search-option"
            >
              <el-form
                ref="searchForm"
                :model="searchForm"
                label-width="100px"
                size="small"
                class="search-form"
              >
                <el-form-item
                  label="目的国："
                >
                  <el-button
                    v-for="(item) in countryList"
                    :key="item.id"
                    size="medium"
                    round
                    class="item-contain-btn"
                    :class="searchForm.countryId === item.id ? 'active' : ''"
                    @click="handleCountry(item.id)"
                  >
                    {{ item.name }}
                  </el-button>
                </el-form-item>
                <el-form-item
                  label="货柜属性："
                >
                  <el-button
                    v-for="(item) in cabinetOption"
                    :key="item.id"
                    size="medium"
                    round
                    class="item-contain-btn"
                    :class="searchForm.loadType === item.id ? 'active' : ''"
                    @click="handleType(item.id)"
                  >
                    {{ item.name }}
                  </el-button>
                </el-form-item>
                <el-form-item
                  label="装货仓库："
                >
                  <el-checkbox
                    v-model="searchForm.whAll"
                    :indeterminate="searchForm.whInd"
                    @change="handleWareAllChange"
                  >
                    全选
                  </el-checkbox>
                  <el-checkbox-group
                    v-model="searchForm.warehouseIds"
                    @change="handleWarehouseChecked"
                  >
                    <el-checkbox
                      v-for="item in warehouseList"
                      :key="item.id"
                      :label="item.id"
                    >
                      {{ item.name }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item
                  v-if="searchForm.loadType === '1'"
                  label="目的仓代码："
                >
                  <el-checkbox
                    v-model="searchForm.fbaAll"
                    :indeterminate="searchForm.fbaInd"
                    @change="handleFbaAllChange"
                  >
                    全选
                  </el-checkbox>
                  <el-checkbox-group
                    v-model="searchForm.fbaCodes"
                    @change="handleFbaChecked"
                  >
                    <el-checkbox
                      v-for="item in fbaCodeList"
                      :key="item"
                      :label="item"
                    >
                      {{ item }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item
                  v-if="searchForm.loadType === '0'"
                  label="快递公司："
                >
                  <el-checkbox
                    v-model="searchForm.exAll"
                    :indeterminate="searchForm.exInd"
                    @change="handleExpressAllChange"
                  >
                    全选
                  </el-checkbox>
                  <el-checkbox-group
                    v-model="searchForm.expressIds"
                    @change="handleExpressChecked"
                  >
                    <el-checkbox
                      v-for="item in expressList"
                      :key="item.id"
                      :label="item.id"
                    >
                      {{ item.name }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item
                  v-if="searchForm.loadType === '2' || searchForm.loadType === '3'"
                  label="派送方式："
                >
                  <el-checkbox
                    v-model="searchForm.deAll"
                    :indeterminate="searchForm.deInd"
                    @change="handleDeliveryAllChange"
                  >
                    全选
                  </el-checkbox>
                  <el-checkbox-group
                    v-model="searchForm.deliveryWays"
                    @change="handleDeliveryChecked"
                  >
                    <el-checkbox
                      v-for="item in deliveryOption"
                      :key="item.id"
                      :label="item.id"
                    >
                      {{ item.name }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item
                  label="服务组："
                >
                  <el-checkbox
                    v-model="searchForm.groAll"
                    :indeterminate="searchForm.groInd"
                    @change="handleGroupAllChange"
                  >
                    全选
                  </el-checkbox>
                  <el-checkbox-group
                    v-model="searchForm.groupIds"
                    @change="handleGroupChecked"
                  >
                    <el-checkbox
                      v-for="item in groupList"
                      :key="item.id"
                      :label="item.id"
                    >
                      {{ item.name }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-form>
            </div>
            <div class="total-warehouse">
              <div class="total-item">
                <div class="item-word">
                  总票数
                </div>
                <div class="item-number">
                  {{ summaryObj.bills || 0 }}
                </div>
                <div class="item-unit">
                  &nbsp;票
                </div>
              </div>
              <div class="total-space" />
              <div class="total-item">
                <div class="item-word">
                  总件数
                </div>
                <div class="item-number">
                  {{ summaryObj.packages || 0 }}
                </div>
                <div class="item-unit">
                  &nbsp;件
                </div>
              </div>
              <div class="total-space" />
              <div class="total-item">
                <div class="item-word">
                  总重量
                </div>
                <div class="item-number">
                  {{ filterCount(summaryObj.weights || 0) }}
                </div>
                <div class="item-unit">
                  &nbsp;kg
                </div>
              </div>
              <div class="total-space" />
              <div class="total-item">
                <div class="item-word">
                  总体积
                </div>
                <div class="item-number">
                  {{ filterCount(summaryObj.volumes || 0) }}
                </div>
                <div class="item-unit">
                  &nbsp;m³
                </div>
              </div>
            </div>
            <div class="select-detail">
              <div style="display: flex;flex-flow: row nowrap;align-items: center;">
                <div style="flex: 1;">
                  <el-row>
                    <el-col :span="3">
                      <span style="padding-left: 8px;">
                        已勾选(<span class="select-total">{{ selectObj.total || 0 }}</span>)
                      </span>
                    </el-col>
                    <el-col :span="3">
                      <span>总票数</span>
                      <span class="select-number">{{ selectObj.bills || 0 }}</span>
                    </el-col>
                    <el-col :span="3">
                      <span>总件数</span>
                      <span class="select-number">{{ selectObj.packages || 0 }}</span>
                    </el-col>
                    <el-col :span="4">
                      <span>总重量(kg)</span>
                      <span class="select-number">{{ filterCount(selectObj.weights || 0) }}</span>
                    </el-col>
                    <el-col :span="4">
                      <span>总体积(m³)</span>
                      <span class="select-number">{{ filterCount(selectObj.volumes || 0) }}</span>
                    </el-col>
                  </el-row>
                </div>
                <div style="width: 200px;text-align: right;">
                  <el-button
                    v-if="false"
                    type="primary"
                    size="medium"
                    class="select-btn"
                    @click="handleCollectAdd"
                  >
                    添加到货柜
                  </el-button>
                </div>
              </div>
              <div class="select-table">
                <el-table
                  ref="collectTable"
                  :data="collectList"
                  :header-cell-style="{
                    'background-color': 'rgba(216, 216, 216, 0.11)',
                    'font-size': '14px',
                    'color': '#fff',
                    'font-weight': '600'
                  }"
                  :cell-style="{'font-size': '13px', 'color': '#fff'}"
                  style="width: 100%"
                  @select="handleSelected1"
                  @select-all="handleSelectAll1"
                >
                  <el-table-column
                    type="selection"
                    width="35"
                  />
                  <el-table-column
                    label="货物所在仓"
                    prop="warehouseName"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    v-if="searchForm.loadType === '1'"
                    prop="fbaCode"
                    label="目的仓代码"
                    width="120"
                  />
                  <el-table-column
                    v-if="searchForm.loadType === '0'"
                    prop="expressName"
                    label="快递公司"
                    width="120"
                  />
                  <el-table-column
                    v-if="searchForm.loadType === '2'"
                    prop="deliveryWay"
                    :formatter="parseDeliveryWay"
                    label="派送方式"
                    width="120"
                  />
                  <el-table-column
                    prop="groupName"
                    label="服务组"
                  />
                  <el-table-column
                    prop="productName"
                    label="产品"
                  />
                  <el-table-column
                    prop="packages"
                    label="总件数"
                  />
                  <el-table-column
                    prop="weights"
                    label="总重量(kg)"
                  />
                  <el-table-column
                    prop="volumes"
                    label="总体积(m³)"
                  />
                </el-table>
              </div>
            </div>

            <div class="select-detail order-detail">
              <div style="display: flex;flex-flow: row nowrap;align-items: center;">
                <div style="width: 120px;">
                  <span class="order-text">订单明细</span>
                </div>
                <div style="flex: 1;">
                  <el-row>
                    <el-col
                      :span="3"
                      style="cursor: pointer;"
                    >
                      <div @click="handleViewOrder">
                        <span style="padding-left: 8px;">
                          已勾选(<span class="select-total">{{ orderObj.total }}</span>)
                        </span>
                      </div>
                    </el-col>
                    <el-col :span="3">
                      <span>总票数</span>
                      <span class="select-number">{{ orderObj.bills || 0 }}</span>
                    </el-col>
                    <el-col :span="3">
                      <span>总件数</span>
                      <span class="select-number">{{ orderObj.packages || 0 }}</span>
                    </el-col>
                    <el-col :span="4">
                      <span>总重量(kg)</span>
                      <span class="select-number">{{ filterCount(orderObj.weights || 0) }}</span>
                    </el-col>
                    <el-col :span="4">
                      <span>总体积(m³)</span>
                      <span class="select-number">{{ filterCount(orderObj.volumes || 0) }}</span>
                    </el-col>
                  </el-row>
                </div>
                <div style="width: 200px;text-align: right;">
                  <el-button
                    type="primary"
                    size="medium"
                    class="select-btn"
                    @click="handleOrderAdd"
                  >
                    添加到货柜
                  </el-button>
                </div>
              </div>
              <div class="select-table">
                <el-table
                  ref="orderTable"
                  :data="orderOption"
                  :header-cell-style="{
                    'background-color': 'rgba(216, 216, 216, 0.11)',
                    'font-size': '14px',
                    'color': '#fff',
                    'font-weight': '600'
                  }"
                  :cell-style="{'font-size': '13px', 'color': '#fff'}"
                  style="width: 100%"
                  @select="handleSelected2"
                  @select-all="handleSelectAll2"
                >
                  <el-table-column
                    type="selection"
                    width="35"
                  />
                  <el-table-column
                    label="订单信息"
                    min-width="280"
                  >
                    <template slot-scope="scope">
                      <div class="order-info">
                        <div
                          class="seriver-info"
                          :title="scope.row.lscName"
                        >
                          <div
                            v-if="scope.row.transport === '0'"
                            class="type"
                          >
                            空运
                          </div>
                          <div
                            v-if="scope.row.transport === '1'"
                            class="type"
                          >
                            海运
                          </div>
                          <div
                            v-if="scope.row.transport === '2'"
                            class="type"
                          >
                            铁路
                          </div>
                          <div
                            v-if="scope.row.transport === '3'"
                            class="type"
                          >
                            快递
                          </div>
                          <div
                            v-if="scope.row.transport === '4'"
                            class="type"
                          >
                            卡航
                          </div>
                          <div
                            class="lscName"
                          >
                            {{ scope.row.lscName }}
                          </div>
                        </div>
                        <div
                          class="code"
                          :title="scope.row.code"
                        >
                          <span
                            v-copy="scope.row.code"
                            class="copy-icon"
                          />
                          <span>
                            原单号：{{ scope.row.code }}
                          </span>
                        </div>
                        <div>
                          <span
                            v-if="scope.row.deliveryWay === '0'"
                            class="text-tip"
                          >
                            快递
                          </span>
                          <span
                            v-if="scope.row.deliveryWay === '1'"
                            class="text-tip"
                          >
                            卡派
                          </span>
                          <span
                            v-if="scope.row.deliveryWay === '2'"
                            class="text-tip"
                          >
                            自提
                          </span>
                          <span class="split-tip">|</span>
                          <span
                            v-if="scope.row.customs === '0'"
                            class="text-tip"
                          >
                            普通报关
                          </span>
                          <span
                            v-if="scope.row.customs === '1'"
                            class="text-tip"
                          >
                            出口退税
                          </span>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="custName"
                    label="客户名称"
                  />
                  <el-table-column
                    prop="so"
                    label="SO"
                  />
                  <el-table-column
                    prop=""
                    label="货物所在仓"
                    width="220"
                  >
                    <template slot-scope="scope">
                      <div>{{ scope.row.warehouseName }}</div>
                      <div class="text-tip">
                        入仓时间：{{ scope.row.warehouseTime }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop=""
                    label="装载情况"
                    width="90"
                  >
                    <template slot-scope="scope">
                      <div v-if="scope.row.source === '0'">
                        未装载
                      </div>
                      <div v-if="scope.row.source === '1' || scope.row.source === '2'">
                        <div>已装载</div>
                        <div class="text-tip">
                          {{ scope.row.source === '1' ? '虚拟装载' : scope.row.source === '2' ? '人工装载' : '' }}
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="packages"
                    label="总件数"
                  />
                  <el-table-column
                    prop="weights"
                    label="总重量(kg)"
                  />
                  <el-table-column
                    prop="volumes"
                    label="总体积(m³)"
                  />
                </el-table>
                <el-pagination
                  :current-page="page"
                  :page-sizes="[10, 20, 30, 50]"
                  :page-size="size"
                  layout="total, prev, pager, next, sizes, jumper"
                  :total="total"
                  class="order-page"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <el-backtop
        target=".monitor-detail"
        style="color: #283042"
      />
    </el-scrollbar>
    <el-dialog
      :visible.sync="dialogVisible"
      width="1200px"
      :show-close="false"
      :close-on-click-modal="false"
      class="dialog-detail"
    >
      <CabinetAdd
        v-if="isViewAdd === 'add'"
        ref="cabinet"
        @updateData="handleUpdataData"
        @close="handleSelectedClosed"
      />
      <SelectView
        v-if="isViewAdd === 'view'"
        ref="selected"
        @updateSelected="handleUpdateSelected"
        @closed="handleSelectedClosed"
      />
    </el-dialog>
    <LockedDetail
      ref="lockedDetail"
      :locked="includeLock"
      :country-id="searchForm.countryId"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import dayjs from 'dayjs'
import CabinetAdd from '@/views/data-monitor/cabinet-add.vue'
import SelectView from '@/views/data-monitor/select-view.vue'
import LockedDetail from '@/views/data-monitor/locked-detail.vue'
import screenfull from 'screenfull'
import {
  getDashboardCountry,
  getDashboardOrderList,
  getDashboardOrderDetail,
  getDashboardExpress,
  getDashboardGroup,
  getDashboardWarehouse,
  getDashboardFba
} from '@/api/jht-monitor'

@Component({
  name: 'MonitorDetails',
  components: {
    CabinetAdd,
    SelectView,
    LockedDetail
  }
})
export default class extends Vue {
  /* data */
  private includeLock: boolean = false
  private unfold: boolean = true
  private loading: boolean = false
  private fullscreen: boolean = false
  private dialogVisible: boolean = false
  private isViewAdd: string = ''
  private updateTime: any = ''
  private timer: any = ''
  private today: any = {
    day: '',
    week: '',
    time: ''
  }
  private summaryObj: any = {
    bills: 0,
    packages: 0,
    weights: 0,
    volumes: 0
  }

  private searchForm: any = {
    countryId: undefined,
    loadType: undefined,
    whAll: false,
    whInd: false,
    groAll: false,
    groInd: false,
    fbaAll: false,
    fbaInd: false,
    exAll: false,
    exInd: false,
    deAll: false,
    deInd: false,
    expressIds: [],
    deliveryWays: [],
    fbaCodes: [],
    warehouseIds: [],
    groupIds: []
  }
  private warehouseList: any[] = []
  private fbaCodeList: any[] = []
  private countryList: any[] = []
  private expressList: any[] = []
  private groupList: any[] = []
  private cabinetOption: any[] = [
    { name: '整柜直送', id: '1' },
    { name: '快递柜', id: '0' },
    { name: '混装柜', id: '2' }
    // { name: '未装载', id: '3' }
  ]
  private deliveryOption: any[] = [
    { name: '卡派', id: '1' },
    { name: '快递派', id: '0' },
    { name: '自提', id: '2' }
  ]
  private orderList: any[] = []
  private collectList: any[] = []
  private collectSelected: any[] = []
  private orderSelected: any[] = []
  private orderIds: any[] = []
  private page: number = 1
  private size: number = 10
  private total: number = 0
  /* computed */
  get selectObj() {
    let packages: number = 0
    let weights: number = 0
    let volumes: number = 0
    let bills: number = 0

    const arr = this.collectSelected || []
    bills = this.sumFromArr(arr, 'bills')
    packages = this.sumFromArr(arr, 'packages')
    weights = this.sumFromArr(arr, 'weights')
    volumes = this.sumFromArr(arr, 'volumes')

    const obj = {
      total: this.collectSelected.length,
      bills,
      packages,
      weights,
      volumes
    }
    return obj
  }
  get orderObj() {
    let packages: number = 0
    let weights: number = 0
    let volumes: number = 0
    this.orderSelected.map((it: any) => {
      packages += it.packages
      weights += it.weights
      volumes += it.volumes
    })
    const obj = {
      total: this.orderSelected.length,
      bills: this.orderSelected.length,
      packages,
      weights,
      volumes
    }
    return obj
  }

  get orderOption() {
    return this.orderList.slice((this.page - 1) * this.size, (this.page) * this.size)
  }

  /* methods */
  private filterCount(val: number) {
    return parseFloat(val.toFixed(2))
  }

  private sumFromArr(arr: any, key: any) {
    let n = 0
    arr.forEach((item: any) => {
      n += item[key]
    })
    return n
  }

  private parseDeliveryWay(row: any): string {
    const { deliveryOption } = this
    const result = deliveryOption.find((it: any) => it.id === row.deliveryWay) || {}
    return result.name || ''
  }

  private showOrderList(data: any, type: string) {
    const root: any = this.$refs.lockedDetail
    if ((type === 'so' && data.so) || (type === 'fba' && data.codes && data.codes.length) || type === 'transit') {
      root.show(data, type)
    } else {
      this.$message.warning('暂无订单')
    }
  }
  private getToday() {
    this.timer = setTimeout(() => {
      const day = dayjs().format('YYYY年MM月DD日')
      const time = dayjs().format('HH:mm:ss')
      let week = ''
      switch (dayjs().day()) {
        case 0:
          week = '星期天'
          break
        case 1:
          week = '星期一'
          break
        case 2:
          week = '星期二'
          break
        case 3:
          week = '星期三'
          break
        case 4:
          week = '星期四'
          break
        case 5:
          week = '星期五'
          break
        case 6:
          week = '星期六'
          break
        default:
          week = ''
      }
      this.today = {
        day,
        week,
        time
      }
      this.getToday()
    }, 1000)
  }
  private async getDashboardCountry() {
    return getDashboardCountry()
      .then((res: any) => {
        const data = res.data || []
        this.countryList = data.filter((it: any) => it && it.id && it.name)
      }).catch((err: any) => {
        this.countryList = []
        return err
      })
  }
  private getDashboardExpress() {
    getDashboardExpress()
      .then((res: any) => {
        const data = res.data || []
        this.expressList = data.filter((it: any) => it && it.id && it.name)
      }).catch((err: any) => {
        this.expressList = []
        return err
      })
  }
  private async getDashboardGroup() {
    return getDashboardGroup({
      countryId: this.searchForm.countryId
    })
      .then((res: any) => {
        const data = res.data || []
        this.groupList = data.filter((it: any) => it && it.id && it.name)
      }).catch((err: any) => {
        this.groupList = []
        return err
      })
  }
  private async getDashboardWarehouse() {
    return getDashboardWarehouse()
      .then((res: any) => {
        const data = res.data || []
        this.warehouseList = data.filter((it: any) => it && it.id && it.name)
      }).catch((err: any) => {
        this.warehouseList = []
        return err
      })
  }
  private async getDashboardFba() {
    return getDashboardFba({
      countryId: this.searchForm.countryId
    })
      .then((res: any) => {
        const data = res.data || []
        this.fbaCodeList = data.filter((it: any) => it)
      }).catch((err: any) => {
        this.fbaCodeList = []
        return err
      })
  }
  private async handleCountry(val: string) {
    this.searchForm.countryId = val
    this.searchForm.fbaAll = false
    this.searchForm.fbaInd = false
    this.searchForm.groAll = false
    this.searchForm.groInd = false
    this.searchForm.groupIds = []
    this.searchForm.fbaCodes = []
    this.fbaCodeList = []
    this.groupList = []
    let loading: any = null
    try {
      loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      await this.getDashboardGroup()
      await this.getDashboardFba()
      await this.getDetail('unload')
      loading && loading.close()
    } catch (error) {
      loading && loading.close()
    }
  }
  private async handleType(val: string) {
    this.searchForm.loadType = val
    this.searchForm.fbaAll = false
    this.searchForm.fbaInd = false
    this.searchForm.exAll = false
    this.searchForm.exInd = false
    this.searchForm.deAll = false
    this.searchForm.deInd = false
    this.searchForm.expressIds = []
    this.searchForm.fbaCodes = []
    this.searchForm.deliveryWays = []
    await this.getDetail()
  }
  private async handleWareAllChange(bool: boolean) {
    this.searchForm.whInd = false
    this.searchForm.warehouseIds = bool ? this.warehouseList.map((e: any) => e.id) : []
    await this.getDetail()
  }
  private async handleWarehouseChecked(arr: any[]) {
    const numC = (arr || []).length
    const numA = (this.warehouseList || []).length
    this.searchForm.whAll = numC === numA
    this.searchForm.whInd = numC > 0 && numC < numA
    await this.getDetail()
  }
  private async handleFbaAllChange(bool: boolean) {
    this.searchForm.fbaInd = false
    this.searchForm.fbaCodes = bool ? this.fbaCodeList.map((e: any) => e) : []
    await this.getDetail()
  }
  private async handleFbaChecked(arr: any[]) {
    const numC = (arr || []).length
    const numA = (this.fbaCodeList || []).length
    this.searchForm.fbaAll = numC === numA
    this.searchForm.fbaInd = numC > 0 && numC < numA
    await this.getDetail()
  }
  private async handleExpressAllChange(bool: boolean) {
    this.searchForm.exInd = false
    this.searchForm.expressIds = bool ? this.expressList.map((e: any) => e.id) : []
    await this.getDetail()
  }
  private async handleExpressChecked(arr: any[]) {
    const numC = (arr || []).length
    const numA = (this.expressList || []).length
    this.searchForm.exAll = numC === numA
    this.searchForm.exInd = numC > 0 && numC < numA
    await this.getDetail()
  }
  private async handleDeliveryAllChange(bool: boolean) {
    this.searchForm.deInd = false
    this.searchForm.deliveryWays = bool ? this.deliveryOption.map((e: any) => e.id) : []
    await this.getDetail()
  }
  private async handleDeliveryChecked(arr: any[]) {
    const numC = (arr || []).length
    const numA = (this.deliveryOption || []).length
    this.searchForm.deAll = numC === numA
    this.searchForm.deInd = numC > 0 && numC < numA
    await this.getDetail()
  }
  private async handleGroupAllChange(bool: boolean) {
    this.searchForm.groInd = false
    this.searchForm.groupIds = bool ? this.groupList.map((e: any) => e.id) : []
    await this.getDetail()
  }
  private async handleGroupChecked(arr: any[]) {
    const numC = (arr || []).length
    const numA = (this.groupList || []).length
    this.searchForm.groAll = numC === numA
    this.searchForm.groInd = numC > 0 && numC < numA
    await this.getDetail()
  }
  private handleCollectAdd() {
    if (this.collectSelected.length <= 0) {
      this.$message.error('请勾选列表数据')
      return
    }
    const arr: any[] = []
    this.collectSelected.map((it: any) => {
      const ids: any = (it.orderIds || '').split(',')
      arr.push(...ids)
    })
    this.orderSelected = arr
    this.dialogVisible = true
    this.isViewAdd = 'add'
    const params: any = {
      countryId: this.searchForm.countryId,
      loadType: this.searchForm.loadType,
      orderIds: arr,
      groupList: this.groupList
    }
    this.$nextTick(() => {
      const root: any = this.$refs.cabinet
      root.setData(params, 'collect')
    })
  }
  private handleOrderAdd() {
    if (this.orderSelected.length <= 0) {
      this.$message.error('请勾选列表数据')
      return
    }
    this.dialogVisible = true
    this.isViewAdd = 'add'
    const params: any = {
      countryId: this.searchForm.countryId,
      loadType: this.searchForm.loadType,
      orderIds: this.orderSelected.map((it: any) => it.id),
      groupList: this.groupList,
      groupIds: this.searchForm.groupIds
    }
    this.$nextTick(() => {
      const root: any = this.$refs.cabinet
      root.setData(params, 'order')
    })
  }
  private handleViewOrder() {
    this.dialogVisible = true
    this.isViewAdd = 'view'
    this.$nextTick(() => {
      const root: any = this.$refs.selected
      root.setData(this.orderSelected)
    })
  }
  private handleUpdateSelected(row: any) {
    this.orderSelected = this.orderSelected.filter((it: any) => it.id !== row.id)
    this.$nextTick(() => {
      const root: any = this.$refs.orderTable
      root.toggleRowSelection(row)
    })
  }
  private handleSelectedClosed() {
    this.dialogVisible = false
    this.isViewAdd = ''
  }
  private async handleUpdataData() {
    await this.getDetail()
  }
  private handleSelected1(selection: any, row: any) {
    this.collectSelected = selection
    const arr: any[] = []
    this.collectSelected.map((it: any) => {
      const ids: any = (it.orderIds || '').split(',')
      arr.push(...ids)
    })
    this.orderIds = arr.filter((it: any) => it)
    this.getOrderList()
  }
  private handleSelectAll1(selection: any) {
    this.collectSelected = selection
    const arr: any[] = []
    this.collectSelected.map((it: any) => {
      const ids: any = (it.orderIds || '').split(',')
      arr.push(...ids)
    })
    this.orderIds = arr.filter((it: any) => it)
    this.getOrderList()
  }
  private handleSelected2(selection: any, row: any) {
    this.orderSelected = selection
  }
  private handleSelectAll2(selection: any) {
    this.orderSelected = selection
  }
  private handleSizeChange(size: number) {
    this.size = size
    this.orderSelected.map((it: any) => {
      this.$nextTick(() => {
        const root: any = this.$refs.orderTable
        root.toggleRowSelection(it)
      })
    })
  }
  private handleCurrentChange(page: number) {
    this.page = page
    this.orderSelected.map((it: any) => {
      this.$nextTick(() => {
        const root: any = this.$refs.orderTable
        root.toggleRowSelection(it)
      })
    })
  }
  private async changeLock() {
    await this.getDetail()
  }

  private async getDetail(type?: string) {
    this.collectSelected = []
    this.orderSelected = []
    this.orderIds = []
    this.orderList = []
    this.page = 1
    this.size = 10
    let loading: any = null
    if (!type) {
      loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    }
    const {
      whAll,
      whInd,
      fbaAll,
      fbaInd,
      exAll,
      exInd,
      deAll,
      deInd,
      groAll,
      groInd,
      ...form
    } = this.searchForm
    const params = {
      ...form,
      includeLock: this.includeLock
    }
    try {
      const res1 = await getDashboardOrderDetail(params)
      const data = res1.data || {}
      const { containers, summaries, runStartTime, runEndTime, ...obj } = data
      this.collectList = data.summaries || []
      this.summaryObj = {
        ...obj
      }
      if (!type) loading && loading.close()
    } catch (error) {
      if (!type) loading && loading.close()
      return error
    }
  }
  private getOrderList() {
    this.orderList = []
    this.orderSelected = []
    if (this.orderIds.length <= 0) return
    let loading: any = null
    loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    getDashboardOrderList(this.orderIds)
      .then((res: any) => {
        const data = res.data || []
        this.orderList = data
        this.total = data.length
        loading && loading.close()
      }).catch((err: any) => {
        loading && loading.close()
        return err
      })
  }
  private windowKeydown(e: any) {
    if (e && e.keyCode === 122) {
      e.preventDefault()
    }
  }
  private handleFullScreen() {
    const screen: any = screenfull
    if (!screen.enabled) {
      this.$message.warning('不支持全屏')
      return
    }
    screen.toggle()
  }
  private changeFullScreen(e: any) {
    this.fullscreen = !this.fullscreen
  }
  private beforeDestroy() {
    this.timer = null
  }
  private async created() {
    this.getToday()
    this.getDashboardExpress()
    let loading: any = null
    try {
      loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      await this.getDashboardWarehouse()
      await this.getDashboardCountry()
      if (this.countryList.length === 0) {
        loading && loading.close()
        return
      }
      const countryVal = this.countryList[0].id
      const query = this.$route.query
      const time: any = query.tag
      const json = sessionStorage.getItem(time) || '{}'
      const data = JSON.parse(json)
      this.searchForm.countryId = data.countryId || countryVal
      this.searchForm.loadType = data.loadType || '1'
      this.includeLock = data.includeLock
      if (this.searchForm.loadType === '1') {
        await this.getDashboardFba()
      }
      await this.getDashboardGroup()
      const fbaArr = data.fbaSelected
      const groupArr = data.groupSelected
      const wareArr = data.warehouseSelected
      if (data.loadType === '1') {
        this.searchForm.fbaAll = fbaArr.length === this.fbaCodeList.length
        this.searchForm.fbaInd = fbaArr.length > 0 && fbaArr.length < this.fbaCodeList.length
        this.searchForm.fbaCodes = fbaArr
      }
      this.searchForm.groAll = groupArr.length === this.groupList.length
      this.searchForm.groInd = groupArr.length > 0 && groupArr.length < this.groupList.length
      this.searchForm.groupIds = groupArr
      this.searchForm.whAll = wareArr.length === this.warehouseList.length
      this.searchForm.whInd = wareArr.length > 0 && wareArr.length < this.warehouseList.length
      this.searchForm.warehouseIds = wareArr
      await this.getDetail('unload')
      loading && loading.close()
    } catch (error) {
      loading && loading.close()
      return error
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    min-width: 1200px;
    overflow-x: auto;
  }
  .contain-header {
    height: 80px;
    padding: 21px 20px 20px;
    background-color: #171C27;
    .header-box {
      display: flex;
      justify-content: center;
    }
    .header-left {
      position: relative;
      flex: 1;
      height: 39px;
      background: #283042;
      color: #fff;
      line-height: 39px;
      padding-left: 16px;
      &:before{
        position: absolute;
        top: 0;
        right: -39px;
        content: '';
        width: 0;
        height: 0;
        border-top: 39px solid #283042;
        border-right: 39px solid transparent;
      }
      .line{
        position: absolute;
        top: 0px;
        right: -49px;
        width: 2px;
        height: 53px;
        background-color: #4A5671;
        transform: rotate(45deg);
        transform-origin: 0 1px;
        border-radius: 1px;
        &.border{
          right: -39px;
          background-color: #2D3F59;
        }
      }
      .time {
        font-size: 14px;
        line-height: 39px;
      }
    }
    .header-subject {
      height: 26px;
      padding: 0 70px;
      text-align: center;
      transform: translateY(-4px);
      .subject-cn {
        background: linear-gradient(180deg, #00CFE8 0%, #257FE2 100%);
        font-size: 28px;
        background-clip: text;
        font-weight: bolder;
        color: transparent;
      }
      .subject-en {
        font-size: 12px;
        font-weight: normal;
        color: #2276D6;
        letter-spacing: 1px;
        padding-top: 2px;
      }
    }
    .header-right {
      position: relative;
      flex: 1;
      height: 39px;
      background: #283042;
      text-align: right;
      line-height: 39px;
      padding-right: 16px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      &:before{
        position: absolute;
        top: 0;
        left: -39px;
        content: '';
        width: 0;
        height: 0;
        border-top: 39px solid #283042;
        border-left: 39px solid transparent;
      }
      .line{
        position: absolute;
        top: 0px;
        left: -49px;
        width: 2px;
        height: 55px;
        background-color: #4A5671;
        transform: rotate(-45deg);
        transform-origin: 0 1px;
        border-radius: 1px;
        &.border{
          left: -39px;
          background-color: #2D3F59;
        }
      }
      .full-screen {
        display: flex;
        align-items: center;
        margin-right: 28px;
        cursor: pointer;
        span{
          display: inline-block;
          font-size: 14px;
          font-weight: 400;
          color: #FFFFFF;
        }
        .full-screen-icon {
          width: 16px;
          height: 16px;
          background: url("../../assets/kanban/full-screen.png") center center no-repeat;
          background-size: 100%;
          margin-right: 6px;
          &.reset{
            background: url("../../assets/kanban/full-screen-reset.png") center center no-repeat;
            background-size: 100%;
          }
        }
      }
      .transit-btn {
        padding: 4px 10px;
        font-size: 12px;
      }
    }
  }

  .contain-main {
    height: calc(100vh - 80px);
    overflow-y: auto;
    background-color: #1D2331;
    padding: 0 20px;
    .detail-subject {
      padding: 16px 0;
      .subject-text {
        font-size: 20px;
        font-weight: 600;
        color: #fff;
      }
      .unfold-btn {
        background-color: rgba(255, 255, 255, .06);
        border: none;
        color: #fff;
        font-size: 12px;
        padding: 8px 15px;
        &.active {
          color: #fff;
          background-color: rgba(255, 255, 255, .17);
        }
      }
    }
    .search-option {
      background-color: #283042;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.16);
      transition: background-color .3s;
      padding: 16px;
      .search-form {
        .el-form-item {
          margin-bottom: 0;
          padding: 8px 0;
          border-bottom: 1px dashed rgba(255, 255, 255, 0.15);
          &:last-of-type {
            border-bottom: 0;
            padding-bottom: 0;
          }
          &:first-of-type {
            padding-top: 0;
          }
        }
        .el-checkbox-group {
          display: inline-block;
        }
        .item-contain-btn {
          background-color: rgba(255, 255, 255, .06);
          border: none;
          color: #fff;
          font-size: 13px;
          width: 88px;
          padding: 7px 20px;
          &.active {
            color: #29FFE6;
            background-color: rgba(255, 255, 255, .17);
          }
        }
      }
    }
    .total-warehouse {
      margin: 16px 0;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      .total-item {
        flex: 1;
        height: 56px;
        padding: 0 16px;
        background-color: #283042;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.16);
        transition: background-color .3s;
        color: #fff;
        display: flex;
        align-items: center;
        &:hover{
          background-color: #333D54;
        }
        .item-word {
          width: 80px;
          font-size: 16px;
        }
        .item-number {
          flex: 1;
          font-size: 20px;
          font-weight: 600;
          text-align: right;
        }
        .item-unit {
          width: 25px;
          font-size: 14px;
        }
      }
      .total-space {
        height: 56px;
        width: 16px;
      }
    }
    .select-detail {
      background-color: #283042;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.16);
      transition: background-color .3s;
      color: #fff;
      font-size: 14px;
      padding: 16px;
      .order-text {
        font-size: 20px;
        font-weight: 600;
        color: #fff;
      }
      .select-total {
        color: #29FFE6;
      }
      .select-number {
        padding-left: 8px;
        font-size: 16px;
        font-weight: 600;
      }
      .select-btn {
        padding: 5px 9px;
      }
      .select-table {
        margin: 16px 0 8px 0;
        .el-table {
          background-color: transparent;
          &::before {
            height: 0;
          }
        }
      }
    }
    .order-detail {
      margin-top: 16px;
      .order-info {
        width: 100%;
        .seriver-info {
          display: flex;
          align-items: center;
          .type {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 18px;
            white-space: nowrap;
            border: 1px solid rgba(220, 223, 230, 0.3);
            border-radius: 2px;
            font-size: 12px;
            font-family: PingFang SC;
            color: #fff;
            margin-right: 5px;
          }
          .lscName {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 13px;
            font-family: PingFang SC;
            color: #fff;
          }
        }
        .code {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 12px;
          font-family: PingFang SC;
          color: rgba(255, 255, 255, 0.6);
          .copy-icon {
            cursor: pointer;
            width: 12px;
            height: 12px;
            display: inline-block;
            margin-right: 5px;
            background: url("../../assets/imgs/copy.png") center center no-repeat;
            background-size: 100%;
            &:hover{
              background: url("../../assets/imgs/copy-hover.png") center center no-repeat;
              background-size: 100%;
            }
          }
        }
        .split-tip {
          color: #A9ACB3;
          margin: 0 5px;
        }
        .text-tip {
          font-size: 12px;
          font-family: PingFang SC;
          color: rgba(255, 255, 255, 0.6);
        }
      }
      .order-page {
        text-align: right;
        color: rgba(255, 255, 255, 0.7);
        padding-top: 24px;
      }
    }
  }

  /* 设置滚动条的样式 */
  .details-scrollbar {
    &::-webkit-scrollbar{
      width: 4px;
    }
    /* 滚动槽 */
    &::-webkit-scrollbar-track{
      border-radius: 2px;
    }
    /* 滚动条滑块 */
    &::-webkit-scrollbar-thumb{
      border-radius: 2px;
      background: rgba(144, 147, 153, 0.3);
    }
  }

  ::v-deep{
    .el-checkbox {
      color: #fff;
      font-weight: 400;
    }
    .el-checkbox__label {
      font-size: 14px;
    }
    .el-checkbox__input.is-checked+.el-checkbox__label{
      color: #fff;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-disabled .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      border-color: #6AEBFF;
      background-color: #6AEBFF;
    }
    .el-checkbox__input.is-focus .el-checkbox__inner {
      border-color: #6AEBFF;
    }
    .el-checkbox__inner {
      background-color: transparent;
      border: 1px solid rgba(255, 255, 255, 0.4);
      &::after {
        border-color: #283042;
      }
      &:hover {
        border-color: #6AEBFF;
      }
    }
    .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
      background-color: #283042;
    }
    .search-form .el-form-item__label {
      font-size: 14px;
      color: #9DA1AC;
      line-height: 24px;
    }
    .search-form .el-form-item__content {
      line-height: 24px;
    }
    .el-table__header tr,
    .el-table__body tr {
      background-color: transparent;
    }
    .el-table__header th.is-leaf,
    .el-table__header td {
      border-bottom: none;
    }
    .el-table__body th.is-leaf,
    .el-table__body td {
      border-bottom: 1px solid #545F75;
    }
    .el-table__body tr:hover > td {
      background-color: rgba(216, 216, 216, 0.11);
    }
    .el-table-column--selection {
      vertical-align: top;
    }
    .el-table-column--selection .cell {
      padding-right: 0;
    }
    .el-table__empty-text {
      color: #fff;
    }
    .order-page {
      .el-pagination__total {
        color: rgba(255, 255, 255, 0.7);
      }
      .el-input__inner {
        background-color: transparent;
        color: rgba(255, 255, 255, 0.7);
        border-color: rgba(255, 255, 255, 0.3);
      }
      .btn-prev,
      .btn-next,
      button:disabled {
        color: rgba(255, 255, 255, 0.3);
        background-color: transparent;
      }
      .el-pager li {
        background-color: transparent;
        min-width: 29.5px;
      }
      .el-pager li.active {
        color: #fff;
        background-color: rgba(106, 235, 255, 0.3);
      }
      .el-pager li.btn-quicknext,
      .el-pager li.btn-quickprev {
        color: rgba(255, 255, 255, 0.7);
      }
      .el-pagination__jump {
        color: rgba(255, 255, 255, 0.7);
      }
    }
    .dialog-detail .el-dialog__header,
    .dialog-detail .el-dialog__body {
      padding: 0;
    }
  }
</style>
