<template>
  <el-scrollbar
    v-loading="loading"
    class="scrollbar-wrap"
  >
    <div class="container">
      <div class="container-top-wrap">
        <div class="container-top">
          <div class="top-title-left">
            <div class="line border" />
            <div class="line" />
            <div style="display: flex;align-items: center;justify-content: space-between">
              <div>
                <span>{{ today.day }}</span>
                <span class="week">{{ today.week }}</span>
                <span>{{ today.time }}</span>
              </div>
              <span
                v-if="runEndTime"
                style="font-size: 14px;padding-right: 10px"
              >
                更新时间：{{ runEndTime }}
              </span>
            </div>
          </div>
          <div class="top-title">
            <div class="top-title-text">
              聚货通物流快递监测系统
            </div>
            <div class="subtitle-container">
              JHT LOGISTICS EXPRESS MONITORING SYSTEM
            </div>
          </div>
          <div class="top-title-right">
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
              v-model="locked"
              @change="loadData(1)"
            >
              锁舱在途
            </el-checkbox>
            <el-button
              type="primary"
              size="mini"
              @click="showOrderList({}, 'transit')"
            >
              查看在途
            </el-button>
          </div>
        </div>
      </div>
      <div class="content-warp">
        <div class="content-top">
          <el-row :gutter="10">
            <el-col
              :xs="12"
              :sm="12"
              :md="12"
              :lg="6"
              :xl="6"
            >
              <div class="info-item">
                <span class="icon package" />
                <div class="text">
                  <span>总票数</span>
                  <span class="num">{{ summary.bills || 0 }}</span>
                </div>
              </div>
            </el-col>
            <el-col
              :xs="12"
              :sm="12"
              :md="12"
              :lg="6"
              :xl="6"
            >
              <div class="info-item">
                <span class="icon num" />
                <div class="text">
                  <span>总件数</span>
                  <span class="num">{{ summary.packages || 0 }}</span>
                </div>
              </div>
            </el-col>
            <el-col
              :xs="12"
              :sm="12"
              :md="12"
              :lg="6"
              :xl="6"
            >
              <div class="info-item">
                <span class="icon kg" />
                <div class="text">
                  <span>总重量</span>
                  <span class="num">
                    {{ summary.weights || 0 }}
                    <span class="unit"> kg</span>
                  </span>
                </div>
              </div>
            </el-col>
            <el-col
              :xs="12"
              :sm="12"
              :md="12"
              :lg="6"
              :xl="6"
            >
              <div class="info-item">
                <span class="icon cm" />
                <div class="text">
                  <span>总体积</span>
                  <span class="num">
                    {{ summary.volumes || 0 }}
                    <span class="unit"> m³</span>
                  </span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="content-table-warp">
          <el-row :gutter="17">
            <el-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="12"
              :xl="10"
            >
              <div class="left-table">
                <div
                  class="left-table-header"
                >
                  <div class="left-title">
                    <span v-if="activeTab === '0'">提单数量&nbsp;</span>
                    <span v-if="activeTab === '1'">货柜数量&nbsp;</span>
                    <span class="num">{{ planSummary.total || 0 }}</span>
                    <!--<div class="right-text">
                      <span>已完成&nbsp;{{ planSummary.success || 0 }}</span>
                      <span>&nbsp;/&nbsp;</span>
                      <span>未完成&nbsp;{{ planSummary.error || 0 }}</span>
                    </div>-->
                  </div>
                  <div class="tabs-warp">
                    <div class="tabs-wrap">
                      <div
                        v-for="type in typeList"
                        :key="type.value"
                        :class="{
                          'tabs-item': true,
                          'active': type.value === activeTab
                        }"
                        @click="activePlanTabChange(type)"
                      >
                        {{ type.name }}
                      </div>
                    </div>
                    <div class="option-warp">
                      <div
                        class="option-btn"
                        @click="openAllList"
                      >
                        {{ openAll ? '全部收起' : '全部展开' }}
                      </div>
                      <el-dropdown
                        trigger="click"
                        @command="handleCommand"
                      >
                        <span
                          class="sort-text"
                        >
                          {{ sort.name }}
                          <i class="el-icon-arrow-down el-icon--right" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            v-for="s in sortList"
                            :key="s.value"
                            :command="s.value"
                          >
                            {{ s.name }}
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
                </div>
                <el-scrollbar
                  v-if="planGroupByCountryList.length"
                  class="left-table-content scrollbar-wrap"
                >
                  <div
                    v-for="plan in planGroupByCountryList"
                    :key="plan.key"
                    class="group-country-item"
                  >
                    <div class="country-title-info">
                      <div class="country-name">
                        <span class="country-icon" />
                        <span class="name">{{ (plan.country || {}).value }}</span>
                      </div>
                      <div class="country-info">
                        <span v-if="activeTab === '0'">
                          共 {{ plan.total }} 个提单
                        </span>
                        <span v-else-if="activeTab === '1'">
                          共 {{ plan.total }} 个货柜
                        </span>
                        <span v-else>
                          --
                        </span>
                      </div>
                    </div>
                    <div
                      v-for="item in plan.list"
                      :key="item.id"
                      class="cabinet-content"
                      @click="showOrderList(item, 'so')"
                    >
                      <div class="cabinet-name-warp">
                        <div class="cabinet-name">
                          <span>{{ (item.container || {}).name }}</span>
                          <span>{{ (item.startPort || {}).value }} — {{ (item.endPort || {}).value }}</span>
                        </div>
                        <div
                          class="option-icon"
                          @click.stop="switchOpen(item)"
                        >
                          <span class="label">{{ item.transport === '0' ? '提单号：' : 'SO：' }}</span>
                          <span class="value">{{ item.so }}</span>
                          <!--收起 展开-->
                          <i
                            class="el-icon-arrow-up"
                            :style="{
                              transform: openList.includes(item.id) ? 'rotate(0deg)' : 'rotate(180deg)',
                              transition: 'all .3s',
                              cursor: 'pointer'
                            }"
                          />
                        </div>
                      </div>
                      <div class="cabinet-num-info">
                        <div class="info-item">
                          <div class="text">
                            总票数
                          </div>
                          <div class="num">
                            {{ item.bills || 0 }}
                          </div>
                        </div>
                        <div class="info-item">
                          <div class="text">
                            总件数
                          </div>
                          <div class="num">
                            {{ item.packages || 0 }}
                          </div>
                        </div>
                        <div class="info-item">
                          <div class="text">
                            总重量(kg)
                          </div>
                          <div class="num">
                            {{ item.weights }}
                          </div>
                        </div>
                        <div class="info-item">
                          <div class="text">
                            总体积(m³)
                          </div>
                          <div class="num">
                            {{ item.volumes }}
                          </div>
                        </div>
                      </div>
                      <el-collapse-transition>
                        <div
                          v-if="openList.includes(item.id)"
                          class="cabinet-info"
                        >
                          <el-row v-if="item.transport === '0'">
                            <el-col
                              class="p-t-8"
                              :xs="12"
                              :sm="12"
                              :md="12"
                              :lg="12"
                              :xl="8"
                            >
                              <div class="item">
                                <div class="label">
                                  服务机构:
                                </div>
                                <div class="value">
                                  {{ (item.organization || {}).value }}
                                </div>
                              </div>
                            </el-col>
                            <el-col
                              class="p-t-8"
                              :xs="12"
                              :sm="12"
                              :md="12"
                              :lg="12"
                              :xl="8"
                            >
                              <div class="item">
                                <div class="label">
                                  截关时间:
                                </div>
                                <div class="value">
                                  {{ item.deadlineCustoms }}
                                </div>
                              </div>
                            </el-col>
                            <el-col
                              class="p-t-8"
                              :xs="12"
                              :sm="12"
                              :md="12"
                              :lg="12"
                              :xl="8"
                            >
                              <div class="item">
                                <div class="label">
                                  起运港:
                                </div>
                                <div class="value">
                                  {{ (item.startPort || {}).value }}
                                </div>
                              </div>
                            </el-col>
                            <el-col
                              class="p-t-8"
                              :xs="12"
                              :sm="12"
                              :md="12"
                              :lg="12"
                              :xl="8"
                            >
                              <div class="item">
                                <div class="label">
                                  目的港:
                                </div>
                                <div class="value">
                                  {{ (item.endPort || {}).value }}
                                </div>
                              </div>
                            </el-col>
                            <el-col
                              class="p-t-8"
                              :xs="12"
                              :sm="12"
                              :md="12"
                              :lg="12"
                              :xl="8"
                            >
                              <div class="item">
                                <div class="label">
                                  起飞时间:
                                </div>
                                <div class="value">
                                  {{ item.departureTime }}
                                </div>
                              </div>
                            </el-col>
                          </el-row>
                          <el-row v-else>
                            <el-col
                              class="p-t-8"
                              :xs="12"
                              :sm="12"
                              :md="12"
                              :lg="12"
                              :xl="8"
                            >
                              <div class="item">
                                <div class="label">
                                  服务机构:
                                </div>
                                <div class="value">
                                  {{ (item.organization || {}).value }}
                                </div>
                              </div>
                            </el-col>
                            <el-col
                              class="p-t-8"
                              :xs="12"
                              :sm="12"
                              :md="12"
                              :lg="12"
                              :xl="8"
                            >
                              <div class="item">
                                <div class="label">
                                  截关时间:
                                </div>
                                <div class="value">
                                  {{ item.deadlineCustoms }}
                                </div>
                              </div>
                            </el-col>
                            <el-col
                              class="p-t-8"
                              :xs="12"
                              :sm="12"
                              :md="12"
                              :lg="12"
                              :xl="8"
                            >
                              <div class="item">
                                <div class="label">
                                  ETD:
                                </div>
                                <div class="value">
                                  {{ item.etd }}
                                </div>
                              </div>
                            </el-col>
                            <el-col
                              class="p-t-8"
                              :xs="12"
                              :sm="12"
                              :md="12"
                              :lg="12"
                              :xl="8"
                            >
                              <div class="item">
                                <div class="label">
                                  船次:
                                </div>
                                <div class="value">
                                  {{ item.shipNo }}
                                </div>
                              </div>
                            </el-col>
                            <el-col
                              class="p-t-8"
                              :xs="12"
                              :sm="12"
                              :md="12"
                              :lg="12"
                              :xl="8"
                            >
                              <div class="item">
                                <div class="label">
                                  截重时间:
                                </div>
                                <div class="value">
                                  {{ item.deadlineWeight }}
                                </div>
                              </div>
                            </el-col>
                            <el-col
                              class="p-t-8"
                              :xs="12"
                              :sm="12"
                              :md="12"
                              :lg="12"
                              :xl="8"
                            >
                              <div class="item">
                                <span class="label">ETA:</span>
                                <span class="value">{{ item.eta }}</span>
                              </div>
                            </el-col>
                            <el-col
                              class="p-t-8"
                              :xs="12"
                              :sm="12"
                              :md="12"
                              :lg="12"
                              :xl="24"
                            >
                              <div class="item">
                                <div class="label">
                                  船名:
                                </div>
                                <div class="value">
                                  {{ item.shipName }}
                                </div>
                              </div>
                            </el-col>
                          </el-row>
                        </div>
                      </el-collapse-transition>
                    </div>
                  </div>
                </el-scrollbar>
                <div
                  v-else
                  class="left-table-content empty"
                >
                  暂无数据
                </div>
              </div>
            </el-col>
            <el-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="12"
              :xl="14"
            >
              <div class="right-table">
                <div class="right-table-header">
                  <div class="header-icon-warp">
                    <span class="icon" />
                    <span class="text">目的仓（海外）</span>
                  </div>
                  <div class="deliveryWay">
                    <el-dropdown
                      trigger="click"
                      @command="handleCommandDeliveryWay"
                    >
                      <span
                        class="sort-text"
                      >
                        {{ deliveryWay.name }}
                        <i class="el-icon-arrow-down el-icon--right" />
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          v-for="s in deliveryWayList"
                          :key="s.value"
                          :command="s.value"
                        >
                          {{ s.name }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                  <div class="tabs-wrap">
                    <div
                      v-for="type in typeList"
                      :key="type.value"
                      :class="{
                        'tabs-item': true,
                        'active': type.value === activeTab
                      }"
                      @click="activePlanTabChange(type)"
                    >
                      {{ type.name }}
                    </div>
                  </div>
                </div>
                <el-scrollbar
                  v-if="fbaListGroupList.length"
                  class="right-table-content scrollbar-wrap"
                >
                  <div
                    v-for="fba in fbaListGroupList"
                    :key="fba.key"
                    class="info-item"
                  >
                    <div class="header-info">
                      <div class="country-name">
                        <span class="country-icon" />
                        <span class="name">{{ (fba.country || {}).value }}</span>
                      </div>
                      <div class="right-info hidden-md-and-down">
                        <div class="right-info-item">
                          <div class="label">
                            总票数
                          </div>
                          <div class="value">
                            {{ fba.bills || 0 }}
                          </div>
                        </div>
                        <div class="right-info-item">
                          <div class="label">
                            总件数
                          </div>
                          <div class="value">
                            {{ fba.packages || 0 }}
                          </div>
                        </div>
                        <div class="right-info-item">
                          <div class="label">
                            总重量
                          </div>
                          <div class="value">
                            {{ fba.weights || 0 }} kg
                          </div>
                        </div>
                        <div class="right-info-item">
                          <div class="label">
                            总体积
                          </div>
                          <div class="value">
                            {{ fba.volumes || 0 }} m³
                          </div>
                        </div>
                      </div>
                    </div>
                    <el-row>
                      <div
                        :class="{
                          waterfall: true,
                          'waterfall-wrap': fba.list.length === 1
                        }"
                      >
                        <el-col
                          v-for="(item, i) in fba.list"
                          :key="item.key"
                          :xs="24"
                          :sm="24"
                          :md="24"
                          :lg="24"
                          :xl="24"
                          :style="'grid-row: auto / span ' + (5 + i)"
                        >
                          <div
                            class="state-info"
                          >
                            <div class="state-name">
                              {{ (item.state || {}).value }}
                            </div>
                            <div class="state-table">
                              <div class="state-table-header">
                                <span class="header-item w">仓库</span>
                                <span class="header-item">总票数</span>
                                <span class="header-item">总件数</span>
                                <span class="header-item">总重量(kg)</span>
                                <span class="header-item">总体积(m³)</span>
                              </div>
                              <div
                                v-for="k in item.list"
                                :key="k.id"
                                class="state-table-row"
                                @click="showOrderList(k, 'fba')"
                              >
                                <span class="state-table-col w">{{ k.ifFba ? k.fbaCode : '私人地址' }}</span>
                                <span class="state-table-col">{{ k.bills || 0 }}</span>
                                <span class="state-table-col">{{ k.packages || 0 }}</span>
                                <span class="state-table-col">{{ k.weights || 0 }}</span>
                                <span class="state-table-col">{{ k.volumes || 0 }}</span>
                              </div>
                            </div>
                          </div>
                        </el-col>
                      </div>
                    </el-row>
                  </div>
                </el-scrollbar>
                <div
                  v-else
                  class="right-table-content empty"
                >
                  暂无数据
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <el-backtop
      target=".scrollbar-wrap .el-scrollbar__wrap"
      style="color: #283042"
    />
    <order-list-dialog
      ref="orderListDialog"
      :locked="locked"
    />
  </el-scrollbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import dayjs from 'dayjs'
import { getDashboardData, getPlanSummary } from '@/api/kanban'
import OrderListDialog from '@/views/kanban/orderListDialog.vue'
import screenfull from 'screenfull'

@Component({
  name: 'Kanban',
  components: {
    OrderListDialog
  }
})
export default class extends Vue {
  /* data */
  private locked: boolean = true
  private loading: boolean = false
  private fullscreen: boolean = false
  private deliveryWay: any = {
    name: '全部',
    value: '-1'
  }
  private deliveryWayList: any[] = [
    {
      name: '全部',
      value: '-1'
    },
    {
      name: '快递',
      value: '0'
    },
    {
      name: '卡派',
      value: '1'
    }
  ]
  private sort: any = {
    name: '默认排序',
    value: 'sortIndex'
  }
  private sortList: any[] = [
    {
      name: '默认排序',
      value: 'sortIndex'
    },
    {
      name: '总票数',
      value: 'bills'
    },
    {
      name: '总件数',
      value: 'packages'
    },
    {
      name: '总重量',
      value: 'weights'
    },
    {
      name: '总体积',
      value: 'volumes'
    }
  ]
  private openAll: boolean = false
  private openList: any[] = []
  private runEndTime: any = ''
  private activePlanTab: any = ''
  private activeFbaTab: any = ''
  private activeTab: any = ''
  private timer: any = null
  private timer2: any = null
  private today: any = {
    day: '',
    week: '',
    time: ''
  }
  // 页面顶部信息
  private summary: any = {
    bills: '',
    packages: '',
    weights: '',
    volumes: ''
  }
  private typeList: any = []
  // 计划列表
  private planList: any[] = []
  private planTypeList: any[] = []
  private planSummaryList: any[] = []
  // fba列表
  private fbaList: any[] = []
  private fbaTypeList: any[] = []
  /* computed */
  // 计划汇总信息
  get planSummary() {
    return this.planSummaryList.filter((e: any) => e.transport === this.activePlanTab).reduce((summary: any, item: any) => {
      summary.total += item.total
      summary.success += item.completed
      summary.error += item.incomplete
      return summary
    }, { total: 0, success: 0, error: 0 })
  }
  get planGroupByCountryList() {
    return this.planList.reduce((list: any, item: any) => {
      if (item.transport === this.activeTab) {
        const tamp = list.find((e: any) => e.key === (item.country || {}).key)
        if (tamp) {
          tamp.planNum = tamp.planNum + (item.status === 2 ? 1 : 0)
          tamp.list.push(item)
        } else {
          list.push({
            planNum: item.status === 2 ? 1 : 0, // 计划完成数量
            country: item.country,
            key: (item.country || {}).key,
            list: [item]
          })
        }
      }
      return list
    }, []).map((item: any) => {
      const data = {
        total: 0,
        success: 0,
        error: 0
      }
      const planSummary = this.planSummaryList.filter((e: any) => e.transport === this.activePlanTab).find((e: any) => e.countryId === (item.country || {}).key)
      if (planSummary) {
        data.total = planSummary.total
        data.success = planSummary.completed
        data.error = planSummary.incomplete
      }
      return {
        ...item,
        ...data
      }
    })
  }
  get fbaListGroupList() {
    const fbaListGroupByCountryList: any[] = this.fbaList.reduce((list: any[], item: any) => {
      if (item.transport === this.activeTab) {
        const tamp = list.find((e: any) => e.key === (item.country || {}).key)
        if (tamp) {
          tamp.list.push(item)
        } else {
          list.push({
            country: item.country,
            key: (item.country || {}).key,
            list: [item]
          })
        }
      }
      return list
    }, [])
    return fbaListGroupByCountryList.map((item: any) => {
      const summaryInfo = item.list.reduce((summary: any, e: any) => {
        summary.bills += e.bills
        summary.packages += e.packages
        summary.weights = parseFloat((summary.weights + e.weights).toFixed(3))
        summary.volumes = parseFloat((summary.volumes + e.volumes).toFixed(3))
        return summary
      }, {
        bills: 0,
        packages: 0,
        weights: 0,
        volumes: 0
      })
      const fbaListGroupByStateList = item.list.reduce((list: any[], e: any) => {
        const tamp = list.find((l: any) => l.key === (e.state || {}).key)
        if (tamp) {
          tamp.list.push(e)
        } else {
          list.push({
            state: e.state,
            key: (e.state || {}).key,
            list: [e]
          })
        }
        return list
      }, [])
      fbaListGroupByStateList.forEach((e: any) => {
        e.list = e.list.sort((a: any, b: any) => (a.fbaCode || 'ZZZ9').localeCompare((b.fbaCode || 'ZZZ9')))
      })
      return {
        country: item.country,
        key: item.key,
        list: fbaListGroupByStateList,
        ...summaryInfo
      }
    })
  }
  /* methods */
  private showOrderList(data: any, type: string) {
    const orderListEl: any = this.$refs.orderListDialog
    if ((type === 'so' && data.so) || (type === 'fba' && data.codes && data.codes.length) || type === 'transit') {
      orderListEl.show(data, type)
    } else {
      this.$message.warning('暂无订单')
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
  private handleCommand(command: any) {
    this.sort = this.sortList.find((e: any) => e.value === command) || {}
    this.planList = this.planList.sort((a: any, b: any) => b[command] - a[command])
  }
  private handleCommandDeliveryWay(command: any) {
    this.deliveryWay = this.deliveryWayList.find((e: any) => e.value === command) || {}
    this.loadData()
  }
  private openAllList() {
    this.openAll = !this.openAll
    if (this.openAll) {
      this.openList = this.planList.map((e: any) => e.id)
    } else {
      this.openList = []
    }
  }
  private switchOpen(item: any) {
    if (this.openList.includes(item.id)) {
      this.openList = this.openList.filter((e: any) => e !== item.id)
    } else {
      this.openList.push(item.id)
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
  private loadData(type?: number) {
    clearTimeout(this.timer2)
    let loading: any = null
    if (type === 1) {
      loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    }
    const params = {
      ifLocked: this.locked,
      deliveryWay: this.deliveryWay.value === '-1' ? '' : this.deliveryWay.value
    }
    getDashboardData(params).then((res: any) => {
      loading && loading.close()
      const data = res.data || {}
      this.runEndTime = dayjs(data.runEndTime).format('YYYY/MM/DD HH:mm:ss')
      this.summary = {
        bills: data.bills,
        packages: data.packages,
        weights: data.weights,
        volumes: data.volumes
      }
      // 计划
      const plans = data.plans || []
      this.planList = plans.sort((a: any, b: any) => (a.country || { key: '' }).key.localeCompare((b.country || { key: '' }).key)).map((e: any, i: number) => {
        e.weights = parseFloat((e.weights || 0).toFixed(2))
        e.volumes = parseFloat((e.volumes || 0).toFixed(2))
        return {
          ...e,
          sortIndex: plans.length - i
        }
      }).sort((a: any, b: any) => b[this.sort.value] - a[this.sort.value])
      const planTypeList: any[] = (data.plans || []).map((e: any) => e.transport).filter((e: any) => e).sort()
      this.planTypeList = Array.from(new Set(planTypeList)).map((e: any) => {
        let name = ''
        switch (e) {
          case '0':
            name = '空运'
            break
          case '1':
            name = '海运'
            break
          case '2':
            name = '铁路'
            break
          case '3':
            name = '快递'
            break
          case '4':
            name = '卡航'
            break
          default:
            name = ''
        }
        return {
          name,
          value: e
        }
      })
      if (!this.activePlanTab) {
        this.activePlanTab = (this.planTypeList[0] || {}).value
      }
      // FBA
      this.fbaList = (data.fbas || []).map((e: any) => {
        e.weights = parseFloat((e.weights || 0).toFixed(2))
        e.volumes = parseFloat((e.volumes || 0).toFixed(2))
        return e
      }).sort((a: any, b: any) => (a.country || { key: '' }).key.localeCompare((b.country || { key: '' }).key))
      const fbaTypeList: any[] = (data.fbas || []).map((e: any) => e.transport).filter((e: any) => e).sort()
      this.fbaTypeList = Array.from(new Set(fbaTypeList)).map((e: any) => {
        let name = ''
        switch (e) {
          case '0':
            name = '空运'
            break
          case '1':
            name = '海运'
            break
          case '2':
            name = '铁路'
            break
          case '3':
            name = '快递'
            break
          case '4':
            name = '卡航'
            break
          default:
            name = ''
        }
        return {
          name,
          value: e
        }
      })
      if (!this.activeFbaTab) {
        this.activeFbaTab = (this.fbaTypeList[0] || {}).value
      }
      this.typeList = Array.from(new Set(planTypeList.concat(fbaTypeList))).map((e: any) => {
        let name = ''
        switch (e) {
          case '0':
            name = '空运'
            break
          case '1':
            name = '海运'
            break
          case '2':
            name = '铁路'
            break
          case '3':
            name = '快递'
            break
          case '4':
            name = '卡航'
            break
          default:
            name = ''
        }
        return {
          name,
          value: e
        }
      })
      if (!this.activeTab) {
        this.activeTab = (this.typeList[0] || {}).value
      }
      this.getPlanSummary()
      this.timer2 = setTimeout(() => {
        this.loadData()
      }, 1000 * 60 * 10)
    }).catch((err: any) => {
      loading && loading.close()
      this.timer2 = setTimeout(() => {
        this.loadData()
      }, 1000 * 60 * 10)
      return err
    })
  }
  private screenfullChange(e: any) {
    this.fullscreen = !this.fullscreen
  }
  private windowKeydown(e: any) {
    if (e && e.keyCode === 122) {
      e.preventDefault()
    }
  }
  private activePlanTabChange(type: any) {
    this.activeTab = type.value
    this.activePlanTab = type.value
    this.activeFbaTab = type.value
    this.getPlanSummary()
  }
  private getPlanSummary() {
    const params = {
      // transport: this.activeTab
      ifLocked: this.locked
    }
    getPlanSummary(params).then((res: any) => {
      this.planSummaryList = res.data || []
    }).catch((err: any) => {
      this.planSummaryList = []
      return err
    })
  }
  private created() {
    const screen: any = screenfull
    screen.on('change', this.screenfullChange)
    this.getToday()
    this.loadData(1)
    window.addEventListener('keydown', this.windowKeydown)
    this.$once('hook:beforeDestroy', () => {
      clearTimeout(this.timer)
      clearTimeout(this.timer2)
      screen.off('change', this.screenfullChange)
      window.removeEventListener('keydown', this.windowKeydown)
    })
  }
}
</script>

<style lang="scss" scoped>
  @import "~element-ui/lib/theme-chalk/display.css";
  @function vw($value){
    @return unquote(($value) + 'px')
    //@return unquote(($value / 19.2) + 'vw')
  }
  @function vh($value){
    //@return unquote(($value) + 'px')
    @return unquote(($value / 10.8) + 'vh')
  }
  .scrollbar-wrap{
    width: 100%;
    height: 100%;
    background-color: #1D2331;
  }
  .container{
    width: 100%;
    height: 100%;
    padding: vw(15) vw(26);
    background-color: #1D2331;
    .container-top-wrap{
      padding-bottom: vw(16);
      .container-top{
        display: flex;
        justify-content: center;
        .top-title-left{
          position: relative;
          flex: 1;
          height: vw(30);
          background: #283042;
          line-height: vw(30);
          padding-left: vw(20);
          &:before{
            position: absolute;
            top: 0;
            right: vw(-30);
            content: '';
            width: 0;
            height: 0;
            border-top: vw(30) solid #283042;
            border-right: vw(30) solid transparent;
          }
          .line{
            position: absolute;
            top: vw(0);
            right: vw(-40);
            width: vw(2);
            height: vw(44);
            background-color: #4A5671;
            transform: rotate(45deg);
            transform-origin: 0 vw(1);
            border-radius: vw(1);
            &.border{
              right: vw(-30);
              background-color: #2D3F59;
            }
          }
          span{
            display: inline-block;
            font-size: vw(16);
            font-weight: 400;
            color: #FFFFFF;
            &.week{
              margin: 0 vw(20);
            }
          }
        }
        .top-title{
          height: vw(30);
          padding: 0 vw(70);
          text-align: center;
          transform: translateY(vw(-8));
          .top-title-text{
            background: linear-gradient(180deg, #00CFE8 0%, #257FE2 100%);
            font-size: vw(32);
            background-clip: text;
            font-weight: bolder;
            color: transparent;
          }
          .subtitle-container{
            font-size: vw(12);
            font-weight: normal;
            /*color: #2276D6;*/
            color: rgba(34, 118, 214, .5);
            letter-spacing: vw(2);
            padding-top: 2px;
          }
        }
        .top-title-right{
          position: relative;
          flex: 1;
          height: vw(30);
          background: #283042;
          text-align: right;
          line-height: vw(30);
          padding-right: vw(26);
          display: flex;
          align-items: center;
          justify-content: flex-end;
          &:before{
            position: absolute;
            top: 0;
            left: vw(-30);
            content: '';
            width: 0;
            height: 0;
            border-top: vw(30) solid #283042;
            border-left: vw(30) solid transparent;
          }
          .line{
            position: absolute;
            top: vw(0);
            left: vw(-40);
            width: vw(2);
            height: vw(44);
            background-color: #4A5671;
            transform: rotate(-45deg);
            transform-origin: 0 vw(1);
            border-radius: vw(1);
            &.border{
              left: vw(-30);
              background-color: #2D3F59;
            }
          }
          .full-screen{
            display: flex;
            align-items: center;
            margin-right: vw(28);
            cursor: pointer;
            span{
              display: inline-block;
              font-size: vw(16);
              font-weight: 400;
              color: #FFFFFF;
            }
            .full-screen-icon{
              width: vw(16);
              height: vw(16);
              background: url("../../assets/kanban/full-screen.png") center center no-repeat;
              background-size: 100%;
              margin-right: vw(6);
              &.reset{
                background: url("../../assets/kanban/full-screen-reset.png") center center no-repeat;
                background-size: 100%;
              }
            }
          }
        }
      }
    }
    .content-warp{
      .content-top{
        /*display: flex;*/
        /*justify-content: space-between;*/
        .info-item{
          /*width: vw(453);*/
          padding: vw(15) 0;
          background-color: #283042;
          box-shadow: 0 vw(2) vw(5) rgba(0, 0, 0, 0.16);
          display: flex;
          align-items: center;
          margin-bottom: vw(13);
          transition: background-color .3s;
          .icon{
            margin-left: vw(22);
            width: vw(38);
            height: vw(38);
            display: inline-block;
            &.package{
              background: url("../../assets/kanban/package-icon.png") center center no-repeat;
              background-size: 100%;
            }
            &.num{
              background: url("../../assets/kanban/num-icon.png") center center no-repeat;
              background-size: 100%;
            }
            &.kg{
              background: url("../../assets/kanban/kg-icon.png") center center no-repeat;
              background-size: 100%;
            }
            &.cm{
              background: url("../../assets/kanban/cm-icon.png") center center no-repeat;
              background-size: 100%;
            }
          }
          .text{
            flex: 1;
            padding: 0 vw(30) 0 vw(16);
            display: flex;
            align-items: center;
            justify-content: space-between;
            span{
              font-size: vw(20);
              font-weight: 500;
              color: #FFFFFF;
              white-space: nowrap;
              &.num{
                flex: 1;
                font-size: vw(25);
                font-weight: bold;
                text-align: right;
                &.unit{
                  font-size: vw(20);
                  font-weight: 400;
                }
              }
              /*@media all and (min-width: 1500px){
                span{
                  font-size: vw(24);
                }
              }*/
            }
          }
          &:hover{
            background-color: #333D54;
          }
        }
      }
      .content-table-warp{
        /*display: flex;*/
        //height: vh(790);
        /*height: vw(700);*/
        .left-table{
          /*width: vw(693);*/
          height: 100%;
          border: vw(1) solid #636974;
          box-shadow: 0 vw(2) vw(5) rgba(0, 0, 0, 0.16);
          /*margin-right: vw(17);*/
          margin-bottom: vw(10);
          padding: 0 vw(16) vw(16);
          .left-table-header{
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: vw(1) solid #536A87;
            .left-title{
              height: 100%;
              display: flex;
              align-items: center;
              font-size: vw(16);
              color: #FFFFFF;
              padding: vw(13) 0;
              margin-right: vw(30);
              .num{
                font-weight: 800;
              }
              .right-text{
                flex: 1;
                margin: 0 0 0 vw(10);
                /*text-align: right;*/
                font-size: vw(12);
                color: rgba(255, 255, 255, .5);
              }
            }
            .tabs-warp{
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 vw(10) vw(0) 0;
              .tabs-wrap{
                margin-right: vw(48);
                .tabs-item{
                  transition: all .5s;
                  cursor: pointer;
                  display: inline-block;
                  padding: vw(6) vw(0);
                  font-size: vw(16);
                  font-weight: 800;
                  position: relative;
                  color: rgba(255, 255, 255, .5);
                  margin-right: vw(32);
                  &:last-child{
                    margin: 0;
                  }
                  &:before{
                    transition: all .5s;
                    width: 0;
                    content: '';
                    height: vw(2);
                    background-color: #29FFE6;
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                  }
                  &.active{
                    color: #29FFE6;
                    &:before{
                      width: 100%;
                    }
                  }
                }
              }
              .option-warp{
                text-align: right;
                flex: 1;
                .option-btn{
                  display: inline-block;
                  border: vw(1) solid #636974;
                  border-radius: vw(3);
                  font-size: vw(12);
                  font-weight: 400;
                  color: #FFFFFF;
                  margin: vw(5) vw(15) vw(5) vw(10);
                  padding: vw(5);
                  cursor: pointer;
                  transform: scale(0.916);
                }
                .sort-text{
                  cursor: pointer;
                  font-size: vw(13);
                  color: #FFFFFF;
                }
              }
            }
          }
          .left-table-content{
            /*height: vw(580);*/
            height: calc(100vh - 230px);
            .group-country-item{
              color: #FFFFFF;
              .country-title-info{
                padding: vw(10) vw(16);
                display: flex;
                align-items: center;
                justify-content: space-between;
                .country-name{
                  display: flex;
                  align-items: center;
                  .country-icon{
                    width: vw(15);
                    height: vw(20);
                    background: url("../../assets/kanban/c-icon.png") center center no-repeat;
                    background-size: 100%;
                    margin-right: vw(5);
                  }
                  .name{
                    font-size: vw(18);
                    font-weight: bold;
                  }
                }
                .country-info{
                  font-size: vw(12);
                }
              }
              .cabinet-content{
                padding: vw(10) vw(16) vw(12) vw(16);
                background-color: #283042;
                box-shadow: 0 vw(2) vw(5) rgba(0, 0, 0, 0.16);
                margin-bottom: vw(8);
                transition: background-color .3s;
                cursor: pointer;
                .cabinet-name-warp{
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding:0 vw(6) vw(10) vw(6);
                  .cabinet-name{
                    font-size: vw(14);
                    font-weight: 500;
                    span{
                      padding-right: vw(10);
                    }
                  }
                  .option-icon{
                    span{
                      font-size: vw(12);
                    }
                    .label{
                      color: #7E828D;
                    }
                    .value{
                      color: #FFFFFF;
                      margin-right: vw(10);
                    }
                    .el-icon-arrow-up{
                      opacity: 0;
                      transition: all .5s;
                    }
                  }
                }
                .cabinet-num-info{
                  background: #2F3A4D;
                  border-radius: vw(3);
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding-left: 10px;
                  .info-item{
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    padding: vw(10) 0;
                    font-size: vw(12);
                    color: #FFFFFF;
                    .text{
                      margin-right: vw(12);
                      color: #898D99;
                    }
                  }
                }
                .cabinet-info{
                  font-size: vw(12);
                  padding-left: vw(8);
                  .p-t-8{
                    padding-top: vw(8);
                  }
                  .item{
                    display: flex;
                  }
                  .label{
                    /*width: vw(55);*/
                    /*text-align: left;*/
                    color: #7E828D;
                    margin-right: vw(5);
                  }
                  .value{
                    flex: 1;
                    color: #FFFFFF;
                  }
                }
                &:last-child{
                  margin-bottom: 0;
                }
                &:hover{
                  background-color: #333D54;
                  .cabinet-name-warp{
                    .option-icon{
                      .el-icon-arrow-up{
                        opacity: 1;
                      }
                    }
                  }
                }
              }
              &:last-child{
                border: none;
              }
            }
            &.empty{
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: vw(20);
              font-weight: bold;
              color: #FFFFFF;
            }
          }
        }
        .right-table{
          /*flex: 1;*/
          padding: 0 vw(16) vw(16) vw(16);
          height: 100%;
          border: vw(1) solid #636974;
          box-shadow: 0 vw(2) vw(5) rgba(0, 0, 0, 0.16);
          .right-table-header{
            padding: 0 vw(20);
            display: flex;
            /*justify-content: space-between;*/
            align-items: center;
            .header-icon-warp{
              font-size: vw(16);
              font-weight: bold;
              color: #FFFFFF;
              line-height: vw(40);
              display: flex;
              align-items: center;
              .icon{
                width: vw(20);
                height: vw(20);
                background: url("../../assets/kanban/home-icon.png") center center no-repeat;
                background-size: 100%;
                margin-right: vw(10);
              }
            }
            .deliveryWay{
              margin-left: 10px;
              .sort-text{
                font-size: 13px;
                font-weight: 400;
                color: #6AEBFF;
                cursor: pointer;
                i{
                  color: #fff;
                }
              }
            }
            .tabs-wrap{
              flex: 1;
              text-align: right;
              .tabs-item{
                transition: all .5s;
                cursor: pointer;
                display: inline-block;
                padding: vw(6) vw(0);
                font-size: vw(16);
                font-weight: 800;
                position: relative;
                color: rgba(255, 255, 255, .5);
                margin-right: vw(32);
                &:last-child{
                  margin: 0;
                }
                &:before{
                  transition: all .5s;
                  width: 0;
                  content: '';
                  height: vw(2);
                  background-color: #29FFE6;
                  position: absolute;
                  bottom: 0;
                  left: 50%;
                  transform: translateX(-50%);
                }
                &.active{
                  color: #29FFE6;
                  &:before{
                    width: 100%;
                  }
                }
              }.tabs-item{
                 transition: all .5s;
                 cursor: pointer;
                 display: inline-block;
                 padding: vw(6) vw(0);
                 font-size: vw(16);
                 font-weight: 800;
                 position: relative;
                 color: rgba(255, 255, 255, .5);
                 margin-right: vw(32);
                 &:last-child{
                   margin: 0;
                 }
                 &:before{
                   transition: all .5s;
                   width: 0;
                   content: '';
                   height: vw(2);
                   background-color: #29FFE6;
                   position: absolute;
                   bottom: 0;
                   left: 50%;
                   transform: translateX(-50%);
                 }
                 &.active{
                   color: #29FFE6;
                   &:before{
                     width: 100%;
                   }
                 }
               }
            }
          }
          .right-table-content{
            height: calc(100vh - 235px);
            margin-top: vw(10);
            .info-item{
              padding: vw(13) vw(20);
              background: #283042;
              box-shadow: 0 vw(2) vw(5) rgba(0, 0, 0, 0.16);
              margin-bottom: vw(10);
              .header-info{
                display: flex;
                justify-content: space-between;
                border-bottom: vw(1) solid #404B60;
                color: #FFFFFF;
                padding-bottom: vw(13);
                .country-name{
                  display: flex;
                  align-items: center;
                  .country-icon{
                    width: vw(15);
                    height: vw(20);
                    background: url("../../assets/kanban/c-icon.png") center center no-repeat;
                    background-size: 100%;
                    margin-right: vw(5);
                  }
                  .name{
                    font-size: vw(18);
                    font-weight: bold;
                  }
                }
                .right-info{
                  display: flex;
                  align-items: center;
                  .right-info-item{
                    text-align: center;
                    font-size: vw(12);
                    padding: 0 vw(19);
                    .value{
                      margin-top: 5px;
                    }
                  }
                }
              }
              @media all and (min-width: 1500px){
                .waterfall{
                  display: grid;
                  grid-template-columns: repeat(2, 47.5%);
                  /*grid-auto-rows: 10px;*/
                  grid-column-gap: vw(50);
                  position: relative;
                  overflow: hidden;
                  &:before{
                    width: vw(1);
                    height: 100%;
                    content: '';
                    background: #404B60;
                    position: absolute;
                    top: vw(15);
                    left: 50%;
                    transform: translateX(-50%);
                  }
                  &.waterfall-wrap{
                    &:before{
                      width: vw(0);
                      height: 100%;
                      content: '';
                      background: #404B60;
                      position: absolute;
                      top: vw(15);
                      left: 50%;
                      transform: translateX(-50%);
                    }
                  }
                }
              }
              .waterfall{
                .state-info{
                  width: 100%;
                  padding-top: vw(13);
                  .state-name{
                    position: relative;
                    font-size: vw(16);
                    font-weight: 500;
                    line-height: vw(22);
                    color: #FFFFFF;
                    padding-left: vw(10);
                    &:before{
                      content: '';
                      width: vw(3);
                      height: vw(16);
                      background: #6AEBFF;
                      position: absolute;
                      top: 50%;
                      left: vw(0);
                      transform: translateY(-50%);
                    }
                  }
                  .state-table{
                    font-size: vw(12);
                    font-weight: 400;
                    line-height: 16px;
                    color: #FFFFFF;
                    text-align: center;
                    /*border-bottom: vw(1) solid #545F75;*/
                    .state-table-header{
                      border-bottom: vw(1) solid #545F75;
                      display: flex;
                      padding: vw(10) vw(0) vw(10) vw(10);
                      .header-item{
                        flex: 1;
                        color: rgba(255, 255, 255, .5);
                        &.w{
                          text-align: left;
                          width: vw(150);
                        }
                      }
                    }
                    .state-table-row{
                      display: flex;
                      padding: vw(7) 0;
                      transition: all .3s;
                      border: vw(1) solid transparent;
                      cursor: pointer;
                      .state-table-col{
                        flex: 1;
                        &.w{
                          padding-left: vw(10);
                          color: #6AEBFF;
                          text-align: left;
                          width: vw(150);
                        }
                      }
                      &:nth-child(2n){
                        background: #2F3A4D;
                      }
                      &:hover{
                        border-color: #2DC4F7;
                      }
                    }
                  }
                }
                &.waterfall-wrap{
                  display: block;
                  .state-info{
                    .state-table{
                      .state-table-header{
                        .header-item{
                          &.w{
                            flex: 1;
                          }
                        }
                      }
                      .state-table-row{
                        .state-table-col{
                          &.w{
                            flex: 1;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            &.empty{
              background: #283042;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: vw(20);
              font-weight: bold;
              color: #FFFFFF;
            }
          }
        }
      }
    }
  }
  ::v-deep{
    .el-button--mini{
      padding: vw(4) vw(10);
    }
    .el-checkbox{
      color: #FFFFFF;
    }
    .el-checkbox__input.is-checked+.el-checkbox__label{
      color: #FFFFFF;
    }
    .el-tabs__nav-wrap::after{
      content: '';
      height: 0;
    }
    .el-tabs__item{
      padding: 0 vw(16);
      font-size: vw(16);
      font-weight: 800;
      color: #FFFFFF;
    }
    .el-tabs__item.is-active{
      color: #29FFE6;
    }
    .el-tabs__active-bar{
      background-color: #29FFE6;
    }
    .el-scrollbar__wrap{
      overflow-x: hidden;
    }
  }
</style>
