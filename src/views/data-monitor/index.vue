<template>
  <el-scrollbar
    v-loading="loading"
    class="monitor"
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
              v-model="locked"
              @change="loadData(1)"
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
      <div class="contain-main monitor-scrollbar">
        <div class="main-box">
          <div class="country-options">
            <div style="display: flex;flex-flow: row nowrap;align-items: center;">
              <div style="flex: 1;">
                <el-button
                  v-for="(item) in countryList"
                  :key="item.id"
                  size="medium"
                  round
                  class="country-btn"
                  :class="searchForm.countryId === item.id ? 'active' : ''"
                  @click="handleCountry(item.id)"
                >
                  {{ item.name }}
                </el-button>
              </div>
              <div style="width: 200px;text-align: right;">
                <div
                  v-if="false"
                  class="update-time"
                >
                  更新时间：{{ updateTime }}
                </div>
              </div>
            </div>
          </div>
          <div class="total-number">
            <div class="total-col">
              <img
                src="@/assets/kanban/package-icon.png"
                class="img-icon"
              >
              <div class="img-word">
                <span class="img-text">总票数</span>
                <br>
                <span class="img-number">{{ summary.bills || 0 }}</span>
                <span class="img-text">&nbsp;票</span>
              </div>
            </div>
            <div class="total-dashed" />
            <div class="total-col">
              <img
                src="@/assets/kanban/num-icon.png"
                class="img-icon"
              >
              <div class="img-word">
                <span class="img-text">总件数</span>
                <br>
                <span class="img-number">{{ summary.packages || 0 }}</span>
                <span class="img-text">&nbsp;件</span>
              </div>
            </div>
            <div class="total-dashed" />
            <div class="total-col">
              <img
                src="@/assets/kanban/kg-icon.png"
                class="img-icon"
              >
              <div class="img-word">
                <span class="img-text">总重量</span>
                <br>
                <span class="img-number">{{ filterCount(summary.weights || 0) }}</span>
                <span class="img-text">&nbsp;kg</span>
              </div>
            </div>
            <div class="total-dashed" />
            <div class="total-col">
              <img
                src="@/assets/kanban/cm-icon.png"
                class="img-icon"
              >
              <div class="img-word">
                <span class="img-text">总体积</span>
                <br>
                <span class="img-number">{{ filterCount(summary.volumes || 0) }}</span>
                <span class="img-text">&nbsp;m³</span>
              </div>
            </div>
          </div>
          <div class="total-warehouse">
            <div class="total-item">
              <div class="item-word">
                货柜量
              </div>
              <div class="item-number">
                {{ summary.totalContainer || 0 }}
              </div>
              <div class="item-unit">
                &nbsp;条
              </div>
            </div>
            <div class="total-space" />
            <div class="total-item">
              <div class="item-word">
                已装载
              </div>
              <div class="item-number">
                {{ filterCount(summary.confirm || 0) }}
              </div>
              <div class="item-unit">
                &nbsp;m³
              </div>
            </div>
            <div class="total-space" />
            <div class="total-item">
              <div class="item-word">
                未装载
              </div>
              <div class="item-number">
                {{ filterCount(summary.notLoad || 0) }}
              </div>
              <div class="item-unit">
                &nbsp;m³
              </div>
            </div>
            <div class="total-space" />
            <div class="total-item">
              <div class="item-word">
                锁仓在途
              </div>
              <div class="item-number">
                {{ filterCount(summary.locked || 0) }}
              </div>
              <div class="item-unit">
                &nbsp;m³
              </div>
            </div>
          </div>
          <div class="echart-warehouse">
            <div style="display: flex;flex-flow: row nowrap;align-items: center;">
              <div style="flex: 1;">
                <el-radio-group
                  v-model="searchForm.loadType"
                  size="mini"
                  class="echart-radio-group"
                  @change="handleDelivery"
                >
                  <el-radio-button
                    v-for="item in typeOption"
                    :key="item.id"
                    :label="item.id"
                    class="echart-radio"
                  >
                    {{ item.name }}
                  </el-radio-button>
                </el-radio-group>
              </div>
              <div
                style="width: 50px;text-align: right;"
              >
                <span
                  class="detail-icon"
                  style="cursor: pointer;"
                  @click="($event) => open()"
                />
              </div>
            </div>
            <ve-histogram
              ref="myChart"
              :data="chartData"
              :data-zoom="chartDataZoom"
              :settings="chartSettings"
              :extend="chartExtend"
              :grid="chartGrid"
              :tooltip="chartTooltip"
              :mark-line="chartMarkLine"
              :events="chartEvents"
              height="420px"
            />
          </div>
          <div class="loading-detail">
            <div class="loading-subject">
              装载详情
            </div>
            <div class="echart-container">
              <ve-histogram
                ref="yourChart"
                :data="chart2Data"
                :settings="chart2Settings"
                :data-zoom="chart2DataZoom"
                :extend="chart2Extend"
                :grid="chart2Grid"
                :tooltip="chart2Tooltip"
                :mark-line="chart2MarkLine"
                height="420px"
              />
            </div>
            <div
              v-if="loadList.length"
              class="loading-contain"
            >
              <div
                v-for="item in loadList"
                :key="item.id"
                class="loading-item"
              >
                <div class="item-title">
                  <div class="item-text">
                    <span class="cabinet">
                      {{ item.containerName }}
                    </span>
                    <span class="flight">
                      {{ item.portsFromName }} — {{ item.portsToName }}
                    </span>
                  </div>
                  <div
                    class="item-bill-so"
                    @click.stop="handleOpen(item)"
                  >
                    <span class="item-color">{{ item.transport === '0' ? '提单号：' : 'SO：' }}</span>
                    <span>{{ item.so }}</span>
                    <span class="item-icon">
                      <i
                        class="el-icon-arrow-up"
                        :style="{
                          transform: openList.includes(item.id) ? 'rotate(0deg)' : 'rotate(180deg)',
                          transition: 'all .3s',
                          cursor: 'pointer'
                        }"
                      />
                    </span>
                  </div>
                </div>
                <el-row class="item-warehouse">
                  <el-col :span="8">
                    <div class="item-value">
                      <span class="item-color">装货仓库：</span>
                      <span>{{ item.warehouseName }}</span>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="item-value">
                      <span class="item-color">货柜属性：</span>
                      <span v-if="item.loadType === '1'">整柜直送-{{ item.fbaCode }}</span>
                      <span v-else-if="item.loadType === '0'">快递柜</span>
                      <span v-else-if="item.loadType === '2'">混装柜</span>
                      <span v-else>未装载</span>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="item-value">
                      <span class="item-color">服务组：</span>
                      <span>{{ item.groupName }}</span>
                    </div>
                  </el-col>
                </el-row>
                <!-- <div class="item-warehouse">
                  <div class="item-value">
                    <span class="item-color">装货仓库：</span>
                    <span>{{ item.warehouseName }}</span>
                  </div>
                  <div class="item-value">
                    <span class="item-color">货柜属性：</span>
                    <span v-if="item.loadType === '1'">整柜直送-{{ item.fbaCode }}</span>
                    <span v-else-if="item.loadType === '0'">快递柜</span>
                    <span v-else-if="item.loadType === '2'">混装柜</span>
                    <span v-else>未装载</span>
                  </div>
                  <div class="item-value">
                    <span class="item-color">服务组：</span>
                    <span>{{ item.groupName }}</span>
                  </div>
                </div> -->
                <div class="item-total">
                  <div class="total-word">
                    <span class="total-text">总票数</span>
                    <span class="total-num">{{ item.bills || 0 }}</span>
                  </div>
                  <div class="total-word">
                    <span class="total-text">总件数</span>
                    <span class="total-num">{{ item.packages || 0 }}</span>
                  </div>
                  <div class="total-word">
                    <span class="total-text">总重量(kg)</span>
                    <span class="total-num">{{ item.weights || 0 }}</span>
                  </div>
                  <div class="total-word">
                    <span class="total-text">总体积(m³)</span>
                    <span class="total-num">{{ item.volumes || 0 }}</span>
                  </div>
                </div>
                <div
                  v-if="openList.includes(item.id)"
                  class="item-info"
                >
                  <el-row v-if="item.transport === '0'">
                    <el-col
                      :xs="12"
                      :sm="12"
                      :md="12"
                      :lg="12"
                      :xl="8"
                    >
                      <div class="info-word">
                        <span class="item-color">服务机构：</span>
                        <span>{{ item.orgName }}</span>
                      </div>
                    </el-col>
                    <el-col
                      :xs="12"
                      :sm="12"
                      :md="12"
                      :lg="12"
                      :xl="8"
                    >
                      <div class="info-word">
                        <span class="item-color">截关时间：</span>
                        <span>{{ item.deadlineCustoms }}</span>
                      </div>
                    </el-col>
                    <el-col
                      :xs="12"
                      :sm="12"
                      :md="12"
                      :lg="12"
                      :xl="8"
                    >
                      <div class="info-word">
                        <span class="item-color">起运港：</span>
                        <span>{{ item.portsFromName }}</span>
                      </div>
                    </el-col>
                    <el-col
                      :xs="12"
                      :sm="12"
                      :md="12"
                      :lg="12"
                      :xl="8"
                    >
                      <div class="info-word">
                        <span class="item-color">目的港：</span>
                        <span>{{ item.portsToName }}</span>
                      </div>
                    </el-col>
                    <el-col
                      :xs="12"
                      :sm="12"
                      :md="12"
                      :lg="12"
                      :xl="8"
                    >
                      <div class="info-word">
                        <span class="item-color">起飞时间：</span>
                        <span>{{ item.departureTime }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row v-else>
                    <el-col
                      :xs="12"
                      :sm="12"
                      :md="12"
                      :lg="12"
                      :xl="8"
                    >
                      <div class="info-word">
                        <span class="item-color">服务机构：</span>
                        <span>{{ item.orgName }}</span>
                      </div>
                    </el-col>
                    <el-col
                      :xs="12"
                      :sm="12"
                      :md="12"
                      :lg="12"
                      :xl="8"
                    >
                      <div class="info-word">
                        <span class="item-color">截关时间：</span>
                        <span>{{ item.deadlineCustoms }}</span>
                      </div>
                    </el-col>
                    <el-col
                      :xs="12"
                      :sm="12"
                      :md="12"
                      :lg="12"
                      :xl="8"
                    >
                      <div class="info-word">
                        <span class="item-color">ETD：</span>
                        <span>{{ item.etd }}</span>
                      </div>
                    </el-col>
                    <el-col
                      :xs="12"
                      :sm="12"
                      :md="12"
                      :lg="12"
                      :xl="8"
                    >
                      <div class="info-word">
                        <span class="item-color">船次：</span>
                        <span>{{ item.shipNo }}</span>
                      </div>
                    </el-col>
                    <el-col
                      :xs="12"
                      :sm="12"
                      :md="12"
                      :lg="12"
                      :xl="8"
                    >
                      <div class="info-word">
                        <span class="item-color">截重时间：</span>
                        <span>{{ item.deadlineWeight }}</span>
                      </div>
                    </el-col>
                    <el-col
                      :xs="12"
                      :sm="12"
                      :md="12"
                      :lg="12"
                      :xl="8"
                    >
                      <div class="info-word">
                        <span class="item-color">ETA：</span>
                        <span>{{ item.eta }}</span>
                      </div>
                    </el-col>
                    <el-col
                      :xs="12"
                      :sm="12"
                      :md="12"
                      :lg="12"
                      :xl="24"
                    >
                      <div class="info-word">
                        <span class="item-color">船名：</span>
                        <span>{{ item.shipName }}</span>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
            <div
              v-else
              class="loading-empty"
            >
              暂无数据
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-backtop
      target=".monitor"
      style="color: #283042"
    />
    <LockedDetail
      ref="lockedDetail"
      :locked="locked"
      :country-id="searchForm.countryId"
    />
  </el-scrollbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import dayjs from 'dayjs'
import {
  getDashboardCountry,
  getDashboardContain,
  getDashboardGroup,
  getDashboardCabinetList
} from '@/api/jht-monitor'
import LockedDetail from '@/views/data-monitor/locked-detail.vue'
import screenfull from 'screenfull'

@Component({
  name: 'Monitor',
  components: {
    LockedDetail
  }
})
export default class extends Vue {
  /* data */
  private locked: boolean = true
  private loading: boolean = false
  private fullscreen: boolean = false
  private updateTime: any = ''
  private timer: any = ''
  private timer2: any = ''
  private today: any = {
    day: '',
    week: '',
    time: ''
  }
  private summary: any = {
    bills: '',
    packages: '',
    weights: '',
    volumes: '',
    confirm: '',
    loaded: '',
    locked: '',
    notLoad: '',
    totalContainer: ''
  }
  private searchForm: any = {
    countryId: undefined,
    loadType: '1' // 默认整柜直送
  }
  private loadList: any[] = []
  private openList: any[] = []
  private countryList: any[] = []
  private typeOption: any[] = [
    { name: '整柜直送', id: '1' },
    { name: '快递柜', id: '0' },
    { name: '混装柜', id: '2' }
    // { name: '未装载', id: '3' }
  ]
  private tableData: any[] = []
  private tableSort: any[] = []
  private tableOption: any[] = []
  private summaryData: any[] = []
  private summary2Data: any[] = []
  private containData: any[] = []
  private fbaList: any[] = []
  private bscList: any[] = []
  private warehouseList: any[] = []
  private warehouse2List: any[] = []
  private fbaOption: any[] = []
  private warehouseOption: any[] = []
  private groupList: any[] = [] // 集合值
  private group2List: any[] = [] // 集合值
  private groupOption: any[] = [] // 选中值
  private groupAll: any[] = [] // 全部
  private chart2DataZoom: any = []
  private chart2Data: any = {}
  private chart2Settings: any = {}
  private chart2Extend: any = {}
  private chart2Grid: any = {}
  private chart2Tooltip: any = {}
  private chart2MarkLine: any = {}

  private chartData: any = {}
  private chartSettings: any = {}
  private chartExtend: any = {}
  private chartGrid: any = {}
  private chartTooltip: any = {}
  private chartMarkLine: any = {}
  private chartDataZoom: any = []
  private legendselected: any = {}
  private labelMap: any = {}
  private chartEvents: any = {
    click: (e: any) => {
      this.chartClick(e)
    },
    legendselectchanged: (e: any) => {
      this.legendselectchange(e)
    }
  }

  /* computed */

  /* methods */
  private filterCount(val: number) {
    return parseFloat(val.toFixed(2))
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
  private funcReduceArray(array: any[], key: any) {
    const obj: any = {}
    return array.reduce((cur: any, next: any) => {
      if (!obj[next[key]]) {
        obj[next[key]] = true
        cur.push(next)
      }
      return cur
    }, [])
  }
  private funcReducePlus(array: any[], property: any) {
    return array.reduce((tax: number, item: any) => {
      tax += (item[property] || 0)
      return tax
    }, 0)
  }

  // 第一charts
  private legendselectchange(e: any) {
    this.legendselected = e.selected
    this.warehouseOption = this.warehouseList.filter((it: any) => {
      return this.legendselected[it.warehouseName]
    })
    this.getOriginData()
  }
  private chartClick(e: any) {
    this.open(e)
  }
  private open(event?: any) {
    if (event) {
      if (this.searchForm.loadType === '1') {
        this.fbaOption = [event.name]
        this.groupOption = []
        const groupName = this.tableSort[event.dataIndex].tooltipName
        this.groupList.map((it: any) => {
          if (it.groupName === groupName) {
            this.groupOption.push(it.groupId)
          }
        })
      } else {
        this.groupOption = []
        this.groupList.map((it: any) => {
          if (it.groupName === event.name) {
            this.groupOption.push(it.groupId)
          }
        })
      }
    } else {
      this.groupOption = this.groupList.map((it: any) => it.groupId)
      this.fbaOption = this.fbaList
    }
    this.fbaOption = this.fbaOption.filter((it: any) => it)
    this.groupOption = this.groupOption.filter((it: any) => it)
    const now = dayjs().valueOf().toString()
    const obj: any = {
      ...this.searchForm,
      includeLock: this.locked,
      fbaSelected: this.fbaOption.length > 0 ? this.fbaOption : this.fbaList,
      warehouseSelected: this.warehouseOption.length > 0 ? this.warehouseOption.map((it: any) => it.warehouseId) : this.warehouseList.map((it: any) => it.warehouseId),
      groupSelected: this.groupOption.length > 0 ? this.groupOption : this.groupList.map((it: any) => it.groupId)
    }
    const json = JSON.stringify(obj)
    sessionStorage.setItem(now, json)
    const { href } = this.$router.resolve({
      path: `/monitor-detail?tag=${now}`
    })
    window.open(href, '_blank')
  }

  // 数据处理
  private setFbaWarehouseGroup() {
    const arrFba = this.funcReduceArray(this.summaryData, 'fbaCode')
    const arrWare = this.funcReduceArray(this.summaryData, 'warehouseId')
    const arrGroup = this.funcReduceArray(this.summaryData, 'groupId')
    this.fbaList = arrFba.map((it: any) => it.fbaCode)
    this.warehouseList = arrWare.map((it: any) => {
      const { warehouseId, warehouseName } = it
      return {
        warehouseId,
        warehouseName
      }
    })
    this.groupList = arrGroup.map((it: any) => {
      const { groupId, groupName } = it
      return {
        groupId,
        groupName
      }
    })
  }

  private setFbaCodeChart() {
    const arr: any[] = []
    this.fbaList.map((f: any) => {
      this.groupList.map((g: any) => {
        const brr: any = this.summaryData.filter((s: any) => f === s.fbaCode && g.groupId === s.groupId)
        if (brr.length > 0) {
          const obj: any = {}
          this.warehouseList.map((w: any) => {
            const warehouseName = w.warehouseName
            let volumePlus: number = 0
            const crr: any = brr.filter((b: any) => b.warehouseId === w.warehouseId)
            if (crr.length > 0) {
              volumePlus = this.funcReducePlus(crr, 'volumes')
            }
            obj[warehouseName] = parseFloat(volumePlus.toFixed(2))
          })
          const volumnTotal = this.funcReducePlus(brr, 'volumes')
          arr.push({
            xAxisName: f,
            tooltipName: g.groupName,
            totalVolumes: parseFloat(volumnTotal.toFixed(2)),
            ...obj
          })
        }
      })
    })
    this.tableData = arr
  }
  private setGroupChart() {
    const arr: any[] = []
    this.groupList.map((g: any) => {
      const brr: any = this.summaryData.filter((s: any) => g.groupId === s.groupId)
      if (brr.length > 0) {
        const obj: any = {}
        this.warehouseList.map((w: any) => {
          const warehouseName = w.warehouseName
          let volumePlus: number = 0
          const crr: any = brr.filter((b: any) => b.warehouseId === w.warehouseId)
          if (crr.length > 0) {
            volumePlus = this.funcReducePlus(crr, 'volumes')
          }
          obj[warehouseName] = parseFloat(volumePlus.toFixed(2))
        })
        const volumeTotal = this.funcReducePlus(brr, 'volumes')
        arr.push({
          xAxisName: g.groupName,
          tooltipName: g.groupName,
          totalVolumes: parseFloat(volumeTotal.toFixed(2)),
          ...obj
        })
      }
    })
    this.tableData = arr
  }
  private getOriginData() {
    const arrW = this.warehouseList.map((it: any) => it.warehouseName)
    const arrT = this.tableData.map((it: any) => {
      it.totalVolumes = 0
      if (this.warehouseOption.length) {
        arrW.map((key: any) => {
          if (this.legendselected[key]) {
            it.totalVolumes = parseFloat((it.totalVolumes + it[key]).toFixed(2))
          }
        })
      } else {
        arrW.map((key: any) => {
          it.totalVolumes = parseFloat((it.totalVolumes + it[key]).toFixed(2))
        })
      }
      return {
        ...it
      }
    })
    this.tableSort = arrT.sort((a: any, b: any) => b.totalVolumes - a.totalVolumes)
    const len: number = this.tableSort.length
    const zoomNum: number = this.searchForm.loadType === '1' && len > 10 ? Math.floor(1000 / len) : 100
    const markLineData :any[] = []
    for (let i = 1; i < 1000; i++) {
      markLineData.push({
        yAxis: i * 70
      })
    }
    this.chartData = {
      columns: ['xAxisName', ...arrW, 'totalVolumes'],
      rows: this.tableSort
    }
    this.chartSettings = {
      stack: { 'volumns': arrW }
    }
    this.chartDataZoom = [
      { type: 'slider', start: 0, end: zoomNum }
    ]
    this.chartTooltip = {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          type: 'dashed',
          color: '#fff'
        }
      },
      backgroundColor: '#fff',
      padding: 12,
      textStyle: {
        color: '#303133',
        fontSize: 12
      },
      formatter: (params: any) => {
        const index = params[0].dataIndex
        const name = this.tableSort[index].tooltipName
        let str = ''
        str += name + '<br/>'
        params.map((it:any) => {
          it.marker = `<span style="display: inline-block;border-radius:3px;width:6px;height:6px;margin-right: 5px;background-color: ${it.color}"></span>`
          str += `<div style="display: flex;flex-flow: row nowrap;align-items: center;padding: 4px 0;"><div style="flex: 1;">${it.seriesName !== 'totalVolumes' ? it.marker : ''}<span>${it.seriesName !== 'totalVolumes' ? it.seriesName : '总体积'}：</span></div><div style="flex: 1;text-align: right;">${it.data} m³</div></div>`
        })
        return str
      }
    }
    this.chartMarkLine = {
      symbol: ['none', 'none'],
      label: {
        position: 'insideEndTop',
        color: '#FF0000',
        formatter: '{c} m³',
        padding: [0, 3, 0, 0]
      },
      lineStyle: {
        color: '#FF0000',
        type: 'dashed'
      },
      data: markLineData
    }
    this.chartGrid = {
      top: 60,
      left: 5,
      bottom: 60,
      right: 5
    }
    const legend: any = {
      top: 10,
      left: 0,
      orient: 'horizontal',
      padding: [0, 0, 5, 0],
      itemGap: 20,
      itemWidth: 16,
      itemHeight: 12,
      icon: 'roundRect',
      textStyle: {
        color: '#fff'
      },
      formatter(item: any) {
        if (item !== 'totalVolumes') {
          return item
        }
      }
    }
    if (this.warehouseOption.length) {
      legend.selected = this.legendselected
    }
    this.chartExtend = {
      legend,
      xAxis: {
        axisLabel: {
          rotate: this.searchForm.loadType === '1' ? 0 : -45,
          textStyle: {
            color: '#fff'
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#D9D9D9'
          }
        },
        axisTick: {
          show: true,
          alignWithLabel: true,
          lineStyle: {
            color: '#D9D9D9'
          }
        }
      },
      yAxis: {
        axisLabel: {
          formatter: '{value} m³',
          textStyle: {
            color: 'rgba(255, 255, 255, 0.65)'
          }
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: 'rgba(255, 255, 255, 0.25)'
          }
        }
      },
      series: (v: any) => {
        v.map((it: any, index: any) => {
          // it.barGap = '-100%'
          it.barWidth = '20px'
          it.smooth = false
          it.itemStyle = {
            normal: {
              lineStyle: {
                color: 'rgba(64, 158, 255, 1)'
              }
            }
          }
          if (it.name === 'totalVolumes') {
            it.barGap = '-100%'
            it.itemStyle = {
              color: 'rgba(128, 128, 128, 0)'
            }
            it.label = {
              show: true,
              color: '#fff',
              position: 'top',
              formatter: '{c} m³'
            }
          }
          return it
        })
        return v
      }
    }
  }

  // 第二charts
  private setBscWarehouseGroup() {
    const arrBsc = this.funcReduceArray(this.containData, 'bscId')
    const arrWare = this.funcReduceArray(this.summary2Data, 'warehouseId')
    const arr1 = this.summary2Data.map((it: any) => {
      const { groupId, groupName } = it
      return {
        groupId,
        groupName
      }
    }).filter((it: any) => it && it.groupId)
    const arr2 = this.containData.map((it: any) => {
      const { groupId, groupName } = it
      return {
        groupId,
        groupName
      }
    }).filter((it: any) => it && it.groupId)
    const arr = [...arr1, ...arr2]
    const arrGroup = this.funcReduceArray(arr, 'groupId')
    this.bscList = arrBsc.map((it: any) => {
      const { bscId, bscName } = it
      return {
        bscId,
        bscName
      }
    })
    this.warehouse2List = arrWare.map((it: any) => {
      const { warehouseId, warehouseName } = it
      return {
        warehouseId,
        warehouseName
      }
    })
    this.group2List = arrGroup
  }
  private setGroupBscWarehouseChart() {
    const arr = this.group2List.map((it: any) => {
      // 过滤服务组的订舱服务
      const brr: any[] = this.containData.filter((c: any) => c.groupId === it.groupId)
      const obj: any = {}
      this.bscList.map((bsc: any) => {
        const bscName = bsc.bscName
        let containerVolume: number = 0
        let actualvolumes: number = 0
        const crr: any[] = brr.filter((b: any) => b.bscId === bsc.bscId)
        containerVolume = this.funcReducePlus(crr, 'containerVolume')
        actualvolumes = this.funcReducePlus(crr, 'actualvolumes')
        obj[bscName] = parseFloat(containerVolume.toFixed(2))
        obj[`bscId-${bsc.bscId}`] = crr.length + '-' + parseFloat(actualvolumes.toFixed(2))
      })
      const bscPlus: number = this.funcReducePlus(brr, 'actualvolumes')
      obj.bscvolumes = parseFloat(bscPlus.toFixed(2))
      obj.containerZero = 0
      const containerPlus: number = this.funcReducePlus(brr, 'containerVolume')
      obj.containerVolumes = parseFloat(containerPlus.toFixed(2))
      // 处理服务组的所在仓库
      const wrr = this.summary2Data.filter((s: any) => s.groupId === it.groupId)
      this.warehouse2List.map((ware: any) => {
        const warehouseName = ware.warehouseName
        let volumePlus: number = 0
        const drr: any = wrr.filter((b: any) => b.warehouseId === ware.warehouseId)
        volumePlus = this.funcReducePlus(drr, 'volumes')
        obj[warehouseName] = parseFloat(volumePlus.toFixed(2))
      })
      obj.wareZero = 0
      const warePlus: number = this.funcReducePlus(wrr, 'volumes')
      obj.wareVolumes = parseFloat(warePlus.toFixed(2))

      return {
        ...it,
        ...obj
      }
    })
    this.tableOption = arr.sort((a: any, b: any) => b.wareVolumes - a.wareVolumes)
  }

  private getContainerData() {
    const arrW = this.warehouse2List.map((it: any) => it.warehouseName)
    const arrB = this.bscList.map((it: any) => it.bscName)
    const len: number = this.tableOption.length
    const zoomNum: number = len > 10 ? Math.floor(1000 / len) : 100
    const markLineData :any[] = []
    for (let i = 1; i < 1000; i++) {
      markLineData.push({
        yAxis: i * 70
      })
    }
    this.chart2Data = {
      columns: ['groupName', ...arrB, ...arrW, 'bscvolumes', 'containerZero', 'wareZero'],
      rows: this.tableOption
    }
    this.chart2Settings = {
      showLine: ['bscvolumes'],
      stack: { 'bscId': [...arrB, 'containerZero'], 'warehouseId': [...arrW, 'wareZero'] }
    }
    this.chart2DataZoom = [
      { type: 'slider', start: 0, end: zoomNum }
    ]
    this.chart2Tooltip = {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          type: 'dashed',
          color: '#fff'
        }
      },
      backgroundColor: '#fff',
      padding: 12,
      textStyle: {
        color: '#303133',
        fontSize: 12
      },
      formatter: (params: any) => {
        const index: number = params[0].dataIndex
        const name: string = this.tableOption[index].groupName
        let str: any = ''
        str += `<div style="font-size: 16px;font-weight: 600;">${name}</div>`
        params.map((it:any) => {
          it.marker = `<span style="display: inline-block;border-radius:3px;width:6px;height:6px;margin-right: 5px;background-color: ${it.color}"></span>`
          if (arrB.includes(it.seriesName)) {
            const item: any = this.bscList.find((b: any) => b.bscName === it.seriesName) || {}
            const word: string = this.tableOption[index][`bscId-${item.bscId}`]
            const firstVal: string = word.split('-')[0] || ''
            if (firstVal && firstVal !== '0') {
              str += `<div style="display: flex;flex-flow: row nowrap;align-items: center;padding: 4px 0;"><div style="flex: 1;">${it.marker}<span>${it.seriesName}：</span></div><div style="width: 50px;text-align: right;">${firstVal} 条</div><div style="width: 100px;text-align: right;">${word.split('-')[1] || 0} m³</div></div>`
            }
          }
        })
        str += '<div style="height: 5px;background-color: #EBEEF5;margin: 15px 0;"></div>'
        params.map((it:any) => {
          it.marker = `<span style="display: inline-block;border-radius:3px;width:6px;height:6px;margin-right: 5px;background-color: ${it.color}"></span>`
          if (arrW.includes(it.seriesName)) {
            str += `<div style="display: flex;flex-flow: row nowrap;align-items: center;padding: 4px 0;"><div style="flex: 1;">${it.marker}<span>${it.seriesName}：</span></div><div style="width: 150px;text-align: right;">${it.data} m³</div></div>`
          }
        })
        return str
      }
    }
    this.chart2MarkLine = {
      symbol: ['none', 'none'],
      label: {
        position: 'insideEndTop',
        color: '#FF0000',
        formatter: '{c} m³',
        padding: [0, 3, 0, 0]
      },
      lineStyle: {
        color: '#FF0000',
        type: 'dashed'
      },
      data: markLineData
    }
    this.chart2Grid = {
      top: 30,
      left: 5,
      bottom: 60,
      right: 5
    }
    this.chart2Extend = {
      legend: {
        show: false
      },
      xAxis: {
        axisLabel: {
          rotate: -45,
          textStyle: {
            color: '#fff'
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#D9D9D9'
          }
        },
        axisTick: {
          show: true,
          alignWithLabel: true,
          lineStyle: {
            color: '#D9D9D9'
          }
        }
      },
      yAxis: {
        axisLabel: {
          formatter: '{value} m³',
          textStyle: {
            color: 'rgba(255, 255, 255, 0.65)'
          }
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: 'rgba(255, 255, 255, 0.25)'
          }
        }
      },
      series: (v: any) => {
        v.map((it: any, index: any) => {
          // it.barGap = '-100%'
          it.barWidth = '20px'
          it.smooth = false
          it.itemStyle = {
            normal: {
              lineStyle: {
                color: 'rgba(64, 158, 255, 1)'
              }
            }
          }
          if (it.name === 'bscvolumes') {
            it.symbol = 'circle'
            it.symbolSize = 10
            it.itemStyle = {
              normal: {
                color: '#FF4753',
                lineStyle: {
                  color: '#fff',
                  width: 1
                }
              }
            }
          }
          if (it.name === 'containerZero') {
            // it.barGap = '-100%'
            it.itemStyle = {
              color: 'rgba(128, 128, 128, 0)'
            }
            it.label = {
              show: true,
              align: 'right',
              rotate: -45,
              color: '#fff',
              position: 'top',
              formatter: (params: any) => {
                const num = this.tableOption[params.dataIndex].containerVolumes
                return `${num} m³`
              }
            }
          }
          if (it.name === 'wareZero') {
            // it.barGap = '100%'
            it.itemStyle = {
              color: 'rgba(128, 128, 128, 0)'
            }
            it.label = {
              show: true,
              align: 'left',
              rotate: 45,
              color: '#fff',
              position: 'top',
              formatter: (params: any) => {
                const num = this.tableOption[params.dataIndex].wareVolumes
                return `${num} m³`
              }
            }
          }
          return it
        })
        return v
      }
    }
  }

  private handleOpen(item: any) {
    if (this.openList.includes(item.id)) {
      this.openList = this.openList.filter((e: any) => e !== item.id)
    } else {
      this.openList.push(item.id)
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
  private async handleCountry(val: string) {
    this.searchForm.countryId = val
    // await this.getDashboardGroup()
    await this.loadData(1)
  }
  private async handleDelivery(val: string) {
    await this.loadData(1)
  }
  private showOrderList(data: any, type: string) {
    const orderListEl: any = this.$refs.lockedDetail
    if ((type === 'so' && data.so) || (type === 'fba' && data.codes && data.codes.length) || type === 'transit') {
      orderListEl.show(data, type)
    } else {
      this.$message.warning('暂无订单')
    }
  }

  private async loadData(type?: number) {
    clearTimeout(this.timer2)
    if (!this.searchForm.countryId) return
    try {
      // this.timer2 = setTimeout(async() => {
      await this.getDashboardData(type)
      await this.getContainerChart()
      // }, 1000 * 60 * 10)
    } catch (error) {
      // this.timer2 = setTimeout(async() => {
      await this.loadData()
      // }, 1000 * 60 * 10)
      return error
    }
  }

  private async getDashboardData(type?: number) {
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
      'countryId': this.searchForm.countryId,
      'loadType': this.searchForm.loadType,
      'fbaCodes': [],
      'includeLock': this.locked,
      'warehouseIds': []
    }
    getDashboardContain(params)
      .then(res => {
        const data = res.data || {}
        const { containers, summaries, runStartTime, runEndTime, ...form } = data
        this.summaryData = data.summaries || []
        this.updateTime = dayjs(runEndTime).format('YYYY/MM/DD HH:mm:ss')
        this.summary = {
          ...form
        }
        this.setFbaWarehouseGroup()
        if (this.searchForm.loadType === '1') {
          this.setFbaCodeChart()
        } else {
          this.setGroupChart()
        }
        this.getOriginData()
        loading && loading.close()
      })
      .catch(err => {
        loading && loading.close()
        return err
      })
  }
  private async getContainerChart() {
    const params1 = {
      'countryId': this.searchForm.countryId,
      'loadType': '2',
      'fbaCodes': [],
      'includeLock': this.locked,
      'warehouseIds': []
    }
    const params2: any = {
      countryId: this.searchForm.countryId,
      groupIds: []
    }
    try {
      const res1 = await getDashboardContain(params1)
      const data = res1.data || {}
      const { containers, summaries } = data
      this.summary2Data = summaries || []
      const res2 = await getDashboardCabinetList(params2)
      const result = res2.data || []
      this.loadList = result
      this.containData = result.map((it: any) => {
        return {
          groupId: it.groupId,
          groupName: it.groupName,
          bscId: it.bscId,
          bscName: it.bscName,
          actualvolumes: it.volumes,
          containerVolume: it.volume
        }
      })
      this.setBscWarehouseGroup()
      this.setGroupBscWarehouseChart()
      this.getContainerData()
    } catch (error) {
      return error
    }
  }

  private windowKeydown(e: any) {
    if (e && e.keyCode === 122) {
      e.preventDefault()
    }
  }

  private async getDashboardGroup() {
    return getDashboardGroup({
      countryId: this.searchForm.countryId
    })
      .then((res: any) => {
        const data = res.data || []
        this.groupAll = data.filter((it: any) => it && it.id && it.name)
      }).catch((err: any) => {
        this.groupAll = []
        return err
      })
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

  private async created() {
    const screen: any = screenfull
    screen.on('change', this.changeFullScreen)
    this.getToday()
    await this.getDashboardCountry()
    if (this.countryList.length === 0) return
    this.searchForm.countryId = this.countryList[0].id
    // await this.getDashboardGroup()
    await this.loadData(1)
    window.addEventListener('keydown', this.windowKeydown)
    this.$once('hook:beforeDestroy', () => {
      clearTimeout(this.timer)
      clearTimeout(this.timer2)
      screen.off('change', this.changeFullScreen)
      window.removeEventListener('keydown', this.windowKeydown)
    })
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
    .country-options {
      padding: 16px 0;
      .country-btn {
        background-color: rgba(255, 255, 255, .06);
        border: none;
        color: #fff;
        font-size: 16px;
        width: 88px;
        padding: 8px 20px;
        &.active {
          color: #29FFE6;
          background-color: rgba(255, 255, 255, .17);
        }
      }
      .update-time {
        font-size: 12px;
        color: #fff;
      }
    }
    .total-number {
      height: 88px;
      color: #fff;
      background-color: #283042;
      box-shadow: 0px 2px 4px 1px rgba(0,0,0,0.16);
      padding: 10px 12px;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      .total-col {
        flex: 1;
        padding: 10px 5px;
        &:hover{
          background-color: #333D54;
        }
        .img-word {
          display: inline-block;
          vertical-align: bottom;
          margin-left: 8px;
        }
        .img-number {
          font-size: 20px;
          font-weight: 600;
          line-height: 27px;
        }
        .img-text {
          font-size: 16px;
          font-weight: 500;
        }
        .img-icon {
          display: inline-block;
          width: 40px;
          height: 40px;
          background-size: 100%;
        }
      }
      .total-dashed {
        height: 48px;
        width: 1px;
        border-right: 1px dashed rgba(255, 255, 255, 0.25);
        margin: 0 11px;
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
    .echart-warehouse {
      margin: 16px 0;
      padding: 20px 24px;
      background-color: #283042;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.16);
      .echart-radio-group {
        background-color: rgba(255, 255, 255, .06);
        padding: 4px;
        border-radius: 4px;
      }
      .detail-icon {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url("../../assets/kanban/full-screen-gray.png") center center no-repeat;
        background-size: 100%;
        }
    }
    .echart-container {
      padding: 10px 24px 0;
    }
    .loading-detail {
      color: #fff;
      background-color: #283042;
      box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.16);
      .loading-subject {
        height: 48px;
        line-height: 48px;
        padding-left: 24px;
        font-size: 20px;
        font-weight: 600;
        border-bottom: 1px solid #545F75;
      }
      .loading-contain {
        margin-top: 20px;
        padding: 0 20px;
      }
      .loading-item {
        padding: 20px;
        transition: background-color .3s;
        cursor: pointer;
        background-color: #21283B;
        margin-bottom: 10px;
        .item-title {
          display: flex;
          align-items: center;
          .item-text {
            flex: 1;
            .cabinet {
              font-size: 16px;
              padding-right: 16px;
            }
            .flight {
              font-size: 16px;
            }
          }
          .item-bill-so {
            flex: 1;
            font-size: 13px;
            text-align: right;
            .item-icon {
              padding-left: 30px;
            }
          }
        }
        .item-warehouse {
          margin: 12px 0;
          .item-value {
            line-height: 20px;
            font-size: 13px;
          }
        }
        .item-total {
          padding: 9px 38px;
          background-color: #2F3A4D;
          border-radius: 4px;
          display: flex;
          align-items: center;
          .total-word {
            flex: 1;
          }
          .total-text {
            font-size: 14px;
            color: #A0A5B3;
            margin-right: 8px;
          }
          .total-num {
            font-size: 16px;
          }
        }
        .item-info {
          margin-top: 16px;
          .info-word {
            font-size: 13px;
            line-height: 20px;
          }
        }
        .item-color {
          color: #9DA1AC;
        }
      }
      .loading-empty {
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: 500;
        color: #fff;
      }
    }
  }

  /* 设置滚动条的样式 */
  .monitor-scrollbar {
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
    }
    .el-checkbox__label {
      font-size: 14px;
    }
    .el-checkbox__input.is-checked+.el-checkbox__label{
      color: #fff;
    }
    .el-radio-button__inner {
      background-color: transparent;
      border: none !important;
      color: #fff;
      font-size: 14px;
      padding: 8px 12px;
    }
    .echart-radio.is-active {
      .el-radio-button__inner {
        color: #29FFE6;
        background-color: rgba(255, 255, 255, .17);
        border-radius: 1px !important;
        box-shadow: none !important;
      }
    }
  }
</style>
