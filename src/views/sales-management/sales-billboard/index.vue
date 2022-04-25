<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        v-show="!detailShow"
        v-loading="loading"
        class="app-container"
      >
        <head-info
          info=""
          title="销售看板"
        >
          <template v-slot:option>
            <el-radio-group
              v-model="viewType"
              size="small"
              @change="onView"
            >
              <el-radio-button
                v-if="$checkPermission(['salesCompanyBillboard'])"
                label="1"
              >
                公司看板
              </el-radio-button>
              <el-radio-button
                v-if="$checkPermission(['salesDepartBillboard'])"
                label="2"
              >
                部门看板
              </el-radio-button>
              <el-radio-button
                v-if="$checkPermission(['salesMenBillboard'])"
                label="3"
              >
                员工看板
              </el-radio-button>
            </el-radio-group>
          </template>
        </head-info>
        <div
          v-show="viewType"
          class="app-panel"
        >
          <div style="text-align: right;padding-bottom: 10px;">
            <el-select
              v-if="custType === '0'"
              v-model="searchForm.parentId"
              :loading="selectLoading"
              size="small"
              style="width:150px;margin-right:5px;"
              placeholder="所属公司"
              filterable
              clearable
              @change="onCompany1"
              @focus="getCompanyList"
            >
              <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-select
              v-if="viewType !== '1' && (custType === '0' || (custType === '2' && custSubtype === '1'))"
              v-model="searchForm.comId"
              :disabled="custType === '0' && !searchForm.parentId"
              :loading="selectLoading"
              size="small"
              style="width:150px;margin-right:5px;"
              placeholder="分公司"
              filterable
              clearable
              @change="onUnCompany1"
              @focus="getUnFinanceCompanyList('1')"
            >
              <el-option
                v-for="item in unCompanyList1"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-tree-select
              v-if="viewType === '3'"
              v-model="searchForm.departId"
              :disabled="!searchForm.comId"
              :data="departmentList1"
              :default-expand-all="false"
              style="display:inline-block;width:140px;margin-right:5px;"
              clearable
              filterable
              size="small"
              placeholder="部门"
              @change="onDepart1"
            />
            <el-date-picker
              v-model="searchForm.year"
              type="year"
              placeholder="年度"
              style="width:120px;margin-right: 5px;"
              value-format="yyyy"
              size="small"
              clearable
              @change="onYear1"
            />
            <el-select
              v-model="searchForm.period"
              :loading="selectLoading"
              :disabled="!searchForm.year || !firstId"
              placeholder="期间"
              size="small"
              clearable
              filterable
              style="width: 150px;margin-right:5px;"
              @focus="getFiscalList('1')"
              @change="onFiscal1"
            >
              <el-option
                v-for="(item, index) in fiscalList1"
                :key="index"
                :label="item.fiscalPeriod"
                :value="item.id"
              />
            </el-select>
            <el-select
              v-model="searchForm.week"
              size="small"
              style="width: 150px;margin-right:10px;"
              placeholder="周期"
              clearable
              filterable
              @change="onWeek1"
            >
              <el-option
                v-for="itemW in weekList1"
                :key="itemW.id"
                :label="`第${itemW.id}周(${itemW.start}~${itemW.end})`"
                :value="itemW.id"
              />
            </el-select>
          </div>
          <el-row
            :gutter="20"
          >
            <el-col :span="6">
              <el-card shadow="hover">
                <el-row>
                  <el-col :span="8">
                    <svg-icon
                      name="air"
                    />
                    空运
                  </el-col>
                  <el-col
                    :span="16"
                    style="text-align: right;font-size: 14px;"
                  >
                    {{ taskObj.planAir >= 0 ? ( '计划 ' + taskObj.planAir + 'KG') : '暂无计划' }}
                  </el-col>
                </el-row>
                <div style="height: 10px;" />
                <el-row>
                  <el-col
                    :span="18"
                    style="font-size: 14px;"
                  >
                    完成 <span style="font-size: 24px;font-weight: bold;">
                      {{ taskObj.actualAir >= 0 ? taskObj.actualAir : '--' }}
                    </span> KG
                  </el-col>
                  <el-col
                    :span="6"
                    style="text-align: right;line-height: 27px;font-size: 14px;"
                  >
                    <span
                      v-if="taskObj.actualAir >= 0"
                      :class="taskObj.actualAir < taskObj.planAir ? 'num-min' : 'num-max'"
                    >
                      {{ taskObj.air + '%' }}
                    </span>
                    <span v-else>--</span>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="hover">
                <el-row>
                  <el-col :span="8">
                    <svg-icon
                      name="boat"
                    />
                    海运
                  </el-col>
                  <el-col
                    :span="16"
                    style="text-align: right;font-size: 14px;"
                  >
                    {{ taskObj.planSea >= 0 ? ( '计划 ' + taskObj.planSea + 'CBM') : '暂无计划' }}
                  </el-col>
                </el-row>
                <div style="height: 10px;" />
                <el-row>
                  <el-col
                    :span="18"
                    style="font-size: 14px;"
                  >
                    完成 <span style="font-size: 24px;font-weight: bold;">
                      {{ taskObj.actualSea >= 0 ? taskObj.actualSea : '--' }}
                    </span> CBM
                  </el-col>
                  <el-col
                    :span="6"
                    style="text-align: right;line-height: 27px;font-size: 14px;"
                  >
                    <span
                      v-if="taskObj.actualSea >= 0"
                      :class="taskObj.actualSea < taskObj.planSea ? 'num-min' : 'num-max'"
                    >
                      {{ taskObj.sea + '%' }}
                    </span>
                    <span v-else>--</span>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="hover">
                <el-row>
                  <el-col :span="8">
                    <svg-icon
                      name="train"
                    />
                    铁路
                  </el-col>
                  <el-col
                    :span="16"
                    style="text-align: right;font-size: 14px;"
                  >
                    {{ taskObj.planTrain >= 0 ? ( '计划 ' + taskObj.planTrain + 'CBM') : '暂无计划' }}
                  </el-col>
                </el-row>
                <div style="height: 10px;" />
                <el-row>
                  <el-col
                    :span="18"
                    style="font-size: 14px;"
                  >
                    完成 <span style="font-size: 24px;font-weight: bold;">
                      {{ taskObj.actualTrain >= 0 ? taskObj.actualTrain : '--' }}
                    </span> CBM
                  </el-col>
                  <el-col
                    :span="6"
                    style="text-align: right;line-height: 27px;font-size: 14px;"
                  >
                    <span
                      v-if="taskObj.actualTrain >= 0"
                      :class="taskObj.actualTrain < taskObj.planTrain ? 'num-min' : 'num-max'"
                    >
                      {{ taskObj.train + '%' }}
                    </span>
                    <span v-else>--</span>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="hover">
                <el-row>
                  <el-col :span="8">
                    <svg-icon
                      name="car"
                    />
                    卡航
                  </el-col>
                  <el-col
                    :span="16"
                    style="text-align: right;font-size: 14px;"
                  >
                    {{ taskObj.planCar >= 0 ? ( '计划 ' + taskObj.planCar + 'KG') : '暂无计划' }}
                  </el-col>
                </el-row>
                <div style="height: 10px;" />
                <el-row>
                  <el-col
                    :span="18"
                    style="font-size: 14px;"
                  >
                    完成 <span style="font-size: 24px;font-weight: bold;">
                      {{ taskObj.actualCar >= 0 ? taskObj.actualCar : '--' }}
                    </span> KG
                  </el-col>
                  <el-col
                    :span="6"
                    style="text-align: right;line-height: 27px;font-size: 14px;"
                  >
                    <span
                      v-if="taskObj.actualCar >= 0"
                      :class="taskObj.actualCar < taskObj.planCar ? 'num-min' : 'num-max'"
                    >
                      {{ taskObj.car + '%' }}
                    </span>
                    <span v-else>--</span>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
          </el-row>
          <el-row style="padding-top: 20px;border-bottom: 2px solid #dfe4ed;">
            <el-col :span="7">
              <el-tabs
                v-model="activeName"
                class="tabs-set"
                @tab-click="handleClick"
              >
                <el-tab-pane
                  label="空运"
                  name="0"
                />
                <el-tab-pane
                  label="海运"
                  name="1"
                />
                <el-tab-pane
                  label="铁路"
                  name="2"
                />
                <el-tab-pane
                  label="卡航"
                  name="4"
                />
              </el-tabs>
            </el-col>
            <el-col :span="17">
              <div
                v-if="false"
                style="text-align: right;"
              >
                <el-select
                  v-if="custType === '0'"
                  v-model="selectForm.parentId"
                  :loading="selectLoading"
                  size="small"
                  style="width:150px;margin-right:5px;"
                  placeholder="所属公司"
                  filterable
                  clearable
                  @change="onCompany2"
                  @focus="getCompanyList"
                >
                  <el-option
                    v-for="item in companyList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                <el-select
                  v-if="viewType !== '1' && (custType === '0' || (custType === '2' && custSubtype === '1'))"
                  v-model="selectForm.comId"
                  :disabled="custType === '0' && !selectForm.parentId"
                  :loading="selectLoading"
                  size="small"
                  style="width:150px;margin-right:5px;"
                  placeholder="分公司"
                  filterable
                  clearable
                  @change="onUnCompany2"
                  @focus="getUnFinanceCompanyList('2')"
                >
                  <el-option
                    v-for="item in unCompanyList2"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                <el-tree-select
                  v-if="viewType === '3'"
                  v-model="selectForm.departId"
                  :disabled="!selectForm.comId"
                  :data="departmentList2"
                  :default-expand-all="false"
                  style="display:inline-block;width:140px;margin-right:5px;"
                  clearable
                  filterable
                  size="small"
                  placeholder="部门"
                  @change="onDepart2"
                />
                <el-date-picker
                  v-model="selectForm.year"
                  type="year"
                  placeholder="年度"
                  style="width:120px;margin-right: 5px;"
                  value-format="yyyy"
                  size="small"
                  clearable
                  @change="onYear2"
                />
                <el-select
                  v-model="selectForm.period"
                  :loading="selectLoading"
                  :disabled="!selectForm.year || !secondId"
                  placeholder="期间"
                  size="small"
                  clearable
                  filterable
                  style="width: 150px;margin-right:10px;"
                  @focus="getFiscalList('2')"
                  @change="onFiscal2"
                >
                  <el-option
                    v-for="(item, index) in fiscalList2"
                    :key="index"
                    :label="item.fiscalPeriod"
                    :value="item.id"
                  />
                </el-select>
                <el-select
                  v-model="selectForm.week"
                  size="small"
                  style="width: 150px;margin-right:10px;"
                  placeholder="周期"
                  clearable
                  filterable
                  @change="onWeek2"
                >
                  <el-option
                    v-for="itemW in weekList2"
                    :key="itemW.id"
                    :label="`第${itemW.id}周(${itemW.start}~${itemW.end})`"
                    :value="itemW.id"
                  />
                </el-select>
              </div>
            </el-col>
          </el-row>
          <div
            v-if="tableData2.length"
            style="display: flex;flex-flow: row nowrap;"
          >
            <div style="flex: 1;">
              <ve-histogram
                :data="chartData2"
                :settings="chartSettings2"
                :extend="chartExtend2"
                :grid="chartGrid2"
                :tooltip="chartTooltip2"
                :events="chartEvents"
                height="500px"
              />
            </div>
            <div style="width: 400px;height: 500px;overflow-y: auto;padding: 0;">
              <div style="height: 40px;line-height: 40px;font-size: 14px;">
                <span v-show="viewType === '1'">公司排名</span>
                <span v-show="viewType === '2'">部门排名</span>
                <span v-show="viewType === '3'">员工排名</span>
              </div>
              <div
                v-for="(item, index) in tableOption2"
                :key="index"
                style="padding: 6px 2px;font-size: 14px;"
              >
                <el-row>
                  <el-col :span="16">
                    <i
                      class="tips-index"
                      :class="[0, 1, 2].includes(index) ? 'tips-top' : ''"
                    >
                      <span style="margin-left: -3px;">{{ index + 1 }}</span>
                    </i>
                    <span v-show="viewType === '1'"> {{ item.companyName }}</span>
                    <span v-show="viewType === '2'"> {{ item.deptName }}</span>
                    <span v-show="viewType === '3'"> {{ item.userName }}</span>
                  </el-col>
                  <el-col
                    :span="8"
                    style="text-align: right;"
                  >
                    {{ item.actualNum }}
                    {{ activeName === '1' || activeName === '2' ? 'CBM' : 'KG' }}
                    {{ item.percent + '%' }}
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div
            v-else
            class="empty-data"
          >
            <img
              src="@/assets/imgs/empty.png"
              alt
            >
            <span class="empty-text">暂无数据</span>
          </div>
          <el-row style="padding-top: 20px;border-bottom: 2px solid #dfe4ed;">
            <el-col :span="7">
              <el-tabs
                v-model="activeName"
                class="tabs-set"
                @tab-click="handleClick"
              >
                <el-tab-pane
                  label="空运"
                  name="0"
                />
                <el-tab-pane
                  label="海运"
                  name="1"
                />
                <el-tab-pane
                  label="铁路"
                  name="2"
                />
                <el-tab-pane
                  label="卡航"
                  name="4"
                />
              </el-tabs>
            </el-col>
            <el-col :span="17">
              <div
                v-if="false"
                style="text-align: right;"
              >
                <el-select
                  v-if="custType === '0'"
                  v-model="serviceForm.parentId"
                  :loading="selectLoading"
                  size="small"
                  style="width:150px;margin-right:5px;"
                  placeholder="所属公司"
                  filterable
                  clearable
                  @change="onCompany3"
                  @focus="getCompanyList"
                >
                  <el-option
                    v-for="item in companyList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                <el-select
                  v-if="viewType !== '1' && (custType === '0' || (custType === '2' && custSubtype === '1'))"
                  v-model="serviceForm.comId"
                  :disabled="custType === '0' && !serviceForm.parentId"
                  :loading="selectLoading"
                  size="small"
                  style="width:150px;margin-right:5px;"
                  placeholder="分公司"
                  filterable
                  clearable
                  @change="onUnCompany3"
                  @focus="getUnFinanceCompanyList('3')"
                >
                  <el-option
                    v-for="item in unCompanyList3"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                <el-tree-select
                  v-if="viewType === '3'"
                  v-model="serviceForm.departId"
                  :disabled="!serviceForm.comId"
                  :data="departmentList3"
                  :default-expand-all="false"
                  style="display:inline-block;width:140px;margin-right:5px;"
                  clearable
                  filterable
                  size="small"
                  placeholder="部门"
                  @change="onDepart3"
                />
                <el-date-picker
                  v-model="serviceForm.year"
                  type="year"
                  placeholder="年度"
                  style="width:120px;margin-right: 5px;"
                  value-format="yyyy"
                  size="small"
                  clearable
                  @change="onYear3"
                />
                <el-select
                  v-model="serviceForm.period"
                  :loading="selectLoading"
                  :disabled="!serviceForm.year || !thirdId"
                  placeholder="期间"
                  size="small"
                  clearable
                  filterable
                  style="width: 150px;margin-right:10px;"
                  @focus="getFiscalList('3')"
                  @change="onFiscal3"
                >
                  <el-option
                    v-for="(item, index) in fiscalList3"
                    :key="index"
                    :label="item.fiscalPeriod"
                    :value="item.id"
                  />
                </el-select>
                <el-select
                  v-model="serviceForm.week"
                  size="small"
                  style="width: 150px;margin-right:10px;"
                  placeholder="周期"
                  clearable
                  filterable
                  @change="onWeek3"
                >
                  <el-option
                    v-for="itemW in weekList3"
                    :key="itemW.id"
                    :label="`第${itemW.id}周(${itemW.start}~${itemW.end})`"
                    :value="itemW.id"
                  />
                </el-select>
              </div>
            </el-col>
          </el-row>
          <div
            v-if="tableData3.length"
            style="display: flex;flex-flow: row nowrap;"
          >
            <div style="flex: 1;">
              <ve-histogram
                :data="chartData3"
                :settings="chartSettings3"
                :extend="chartExtend3"
                :grid="chartGrid3"
                :tooltip="chartTooltip3"
                :events="chartEvents"
                height="500px"
              />
            </div>
            <div style="width: 400px;height: 500px;overflow-y: auto;padding: 0;">
              <div style="height: 40px;line-height: 40px;font-size: 14px;">
                <span>服务组排名</span>
              </div>
              <div
                v-for="(item, index) in tableOption3"
                :key="index"
                style="padding: 6px 2px;font-size: 14px;"
              >
                <el-row>
                  <el-col :span="16">
                    <i
                      class="tips-index"
                      :class="[0, 1, 2].includes(index) ? 'tips-top' : ''"
                    >
                      <span style="margin-left: -3px;">{{ index + 1 }}</span>
                    </i>
                    <span> {{ item.groupName }}</span>
                  </el-col>
                  <el-col
                    :span="8"
                    style="text-align: right;"
                  >
                    {{ item.actualNum }}
                    {{ activeName === '1' || activeName === '2' ? 'CBM' : 'KG' }}
                    {{ item.percent + '%' }}
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div
            v-else
            class="empty-data"
          >
            <img
              src="@/assets/imgs/empty.png"
              alt
            >
            <span class="empty-text">暂无数据</span>
          </div>
        </div>
      </div>
      <detail
        v-show="detailShow"
        ref="detail"
        @close="detailShow = false"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import detail from '@/views/sales-management/sales-billboard/detail.vue'
import { AppModule } from '@/store/modules/app'
import {
  getBillboardChart,
  getBillboardCard,
  getDetailChart,
  getAgentList,
  getUnFinanceAgentList,
  getUnFinanceAgentById,
  getFiscalList,
  getDepartList
} from '@/api/sales-of-billboard'
import dayjs from 'dayjs'

@Component({
  name: '',
  components: {
    detail
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private activeName: string = '0'
  private activeTab: string = '0'
  private loading: boolean = false
  private selectLoading: boolean = false
  private detailShow: boolean = false
  private tableData2: any[] = []
  private tableOption2: any[] = []
  private tableData3: any[] = []
  private tableOption3: any[] = []
  private viewType: string = ''
  private typeList: any[] = []
  private companyList: any = []
  private unCompanyList1: any = []
  private unCompanyList2: any = []
  private unCompanyList3: any = []
  private fiscalList1: any = []
  private fiscalList2: any = []
  private fiscalList3: any = []
  private departmentList1: any = []
  private departmentList2: any = []
  private departmentList3: any = []
  private weekList1: any = []
  private weekList2: any = []
  private weekList3: any = []
  private firstId: any = ''
  private secondId: any = ''
  private thirdId: any = ''
  private taskObj: any = {}
  private chartData3: any = {}
  private chartSettings3: any = {}
  private chartExtend3: any = {}
  private chartGrid3: any = {}
  private chartTooltip3: any = {}
  private chartData2: any = {}
  private chartSettings2: any = {}
  private chartExtend2: any = {}
  private chartGrid2: any = {}
  private chartTooltip2: any = {}
  private chartEvents: any = {
    click: (e: any) => {
      this.chartClick(e)
    }
  }
  private colorList: any[] = ['rgba(64, 158, 255, 1)', 'rgba(245, 108, 108, 1)']
  private searchForm: any = {
    comType: '1',
    parentId: '',
    comId: '',
    departId: '',
    year: '',
    period: '',
    week: ''
  }
  private selectForm: any = {
    comType: '1',
    comId: '',
    parentId: '',
    departId: '',
    year: '',
    period: '',
    week: ''
  }
  private serviceForm: any = {
    comType: '1',
    comId: '',
    parentId: '',
    departId: '',
    year: '',
    period: '',
    week: ''
  }
  /* computed */

  get labelPosition() {
    const lang = AppModule.language
    if (!lang) {
      return 'left'
    }
    return lang === 'en' ? 'top' : 'left'
  }

  get lang() {
    const lang = AppModule.language
    if (!lang) {
      return 'en'
    }
    return lang
  }
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }
  get deptId(): string {
    const info = UserModule.info || {}
    const deptId = (info as any).deptId
    return deptId
  }
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }
  get custSubtype(): string {
    const info = UserModule.info || {}
    const custSubtype = (info as any).custSubtype
    return custSubtype
  }
  get parentId(): string {
    const info = UserModule.info || {}
    const parentId = (info as any).parentId
    return parentId
  }
  get ifCustomer(): boolean {
    const info = UserModule.info || {}
    const ifCustomer = (info as any).ifCustomer === 1
    return ifCustomer
  }

  /* methods */
  private clearData2() {
    this.tableData2 = []
    this.tableOption2 = []
    this.chartSettings2 = {}
    this.chartTooltip2 = {}
    this.chartExtend2 = {}
    this.chartGrid2 = {}
    this.getOriginData2()
  }
  private clearData3() {
    this.tableData3 = []
    this.tableOption3 = []
    this.chartSettings3 = {}
    this.chartTooltip3 = {}
    this.chartExtend3 = {}
    this.chartGrid3 = {}
    this.getOriginData3()
  }
  private onView() {
    this.searchForm.departId = ''
    // this.selectForm.departId = ''
    // this.serviceForm.departId = ''
    this.onYear1()
    // this.onYear2()
    // this.onYear3()
  }
  private handleClick(tab: any, event: any): void {
    this.clearData2()
    this.clearData3()
    this.getPage()
  }
  // private handleTab(tab: any, event: any): void {
  //   this.clearData3()
  //   this.getTableData()
  // }
  private onCompany1(val: any) {
    this.searchForm.comId = ''
    this.unCompanyList1 = []
    this.searchForm.departId = ''
    this.departmentList1 = []
    this.onYear1()
    this.firstId = ''
    this.clearData2()
    this.clearData3()
    const item = this.companyList.find((it: any) => it.id === val)
    if (item) {
      this.firstId = val
    }
  }
  private onUnCompany1(val: any) {
    this.taskObj = {}
    this.clearData2()
    this.clearData3()
    this.searchForm.departId = ''
    this.departmentList1 = []
    this.getDepartment('1')
    this.getPage()
  }
  private onDepart1() {
    this.taskObj = {}
    this.clearData2()
    this.clearData3()
    this.getPage()
  }
  private onYear1() {
    this.taskObj = {}
    this.searchForm.period = undefined
    this.searchForm.monthStart = ''
    this.searchForm.monthEnd = ''
    this.fiscalList1 = []
    this.searchForm.week = ''
    this.searchForm.start = ''
    this.searchForm.end = ''
    this.weekList1 = []
    this.clearData2()
    this.clearData3()
  }
  // private onCompany2(val: any) {
  //   this.selectForm.comId = ''
  //   this.unCompanyList2 = []
  //   this.clearData2()
  //   this.selectForm.departId = ''
  //   this.departmentList2 = []
  //   this.onYear2()
  //   this.secondId = ''
  //   const item = this.companyList.find((it: any) => it.id === val)
  //   if (item) {
  //     this.secondId = val
  //   }
  // }
  // private onUnCompany2(val: any) {
  //   this.clearData2()
  //   this.selectForm.departId = ''
  //   this.departmentList2 = []
  //   this.getDepartment('2')
  //   this.queryAll()
  // }
  // private onDepart2() {
  //   this.clearData2()
  //   this.queryAll()
  // }
  // private onYear2() {
  //   this.clearData2()
  //   this.selectForm.period = undefined
  //   this.fiscalList2 = []
  //   this.selectForm.week = ''
  //   this.selectForm.start = ''
  //   this.selectForm.end = ''
  //   this.weekList2 = []
  // }
  // private onCompany3(val: any) {
  //   this.serviceForm.comId = ''
  //   this.unCompanyList3 = []
  //   this.clearData3()
  //   this.serviceForm.departId = ''
  //   this.departmentList3 = []
  //   this.onYear3()
  //   this.thirdId = ''
  //   const item = this.companyList.find((it: any) => it.id === val)
  //   if (item) {
  //     this.thirdId = val
  //   }
  // }
  // private onUnCompany3(val: any) {
  //   this.clearData3()
  //   this.serviceForm.departId = ''
  //   this.departmentList3 = []
  //   this.getDepartment('3')
  //   this.getTableData()
  // }
  // private onDepart3() {
  //   this.clearData2()
  //   this.getTableData()
  // }
  // private onYear3() {
  //   this.clearData3()
  //   this.serviceForm.period = undefined
  //   this.fiscalList3 = []
  //   this.serviceForm.week = ''
  //   this.serviceForm.start = ''
  //   this.serviceForm.end = ''
  //   this.weekList3 = []
  // }

  private getCompanyList() {
    this.selectLoading = true
    const params = {
      page: 1,
      size: 9999,
      parentId: (this as any).custId
    }
    getAgentList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.companyList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private getUnFinanceCompanyList(str: string) {
    const type = (this as any).custType
    this.selectLoading = true
    if (type === '0') {
      const params = {
        custId: str === '1' ? this.searchForm.parentId : str === '2' ? this.selectForm.parentId : this.serviceForm.parentId
      }
      getUnFinanceAgentById(params)
        .then((res: any) => {
          const data = res.data || []
          if (str === '1') {
            this.unCompanyList1 = data
          } else if (str === '2') {
            this.unCompanyList2 = data
          } else if (str === '3') {
            this.unCompanyList3 = data
          }
          this.selectLoading = false
        })
        .catch((err: any) => {
          this.selectLoading = false
          return err
        })
    } else {
      getUnFinanceAgentList().then((res:any) => {
        const data = res.data || []
        if (str === '1') {
          this.unCompanyList1 = data
        } else if (str === '2') {
          this.unCompanyList2 = data
        } else if (str === '3') {
          this.unCompanyList3 = data
        }
        this.selectLoading = false
      }).catch((err:any) => {
        this.selectLoading = false
        return err
      })
    }
  }
  private getFiscalList(str: string) {
    this.selectLoading = true
    const params = {
      page: 1,
      size: 9999,
      year: str === '1' ? this.searchForm.year : str === '2' ? this.selectForm.year : this.serviceForm.year,
      custTag: '1',
      custId: [str === '1' ? this.firstId : str === '2' ? this.secondId : this.thirdId]
    }
    getFiscalList(params)
      .then((res: any) => {
        const data = res.data || {}
        if (str === '1') {
          this.fiscalList1 = data.result || []
        } else if (str === '2') {
          this.fiscalList2 = data.result || []
        } else if (str === '3') {
          this.fiscalList3 = data.result || []
        }
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private onFiscal1(val: any) {
    this.searchForm.monthStart = ''
    this.searchForm.monthEnd = ''
    this.searchForm.week = ''
    this.searchForm.start = ''
    this.searchForm.end = ''
    this.weekList1 = []
    this.taskObj = {}
    this.clearData2()
    this.clearData3()
    const item = this.fiscalList1.find((it: any) => it.id === this.searchForm.period)
    if (item) {
      this.searchForm.monthStart = dayjs(item.startTime).format('YYYY-MM-DD') + ' 00:00:00'
      this.searchForm.monthEnd = dayjs(item.endTime).format('YYYY-MM-DD') + ' 23:59:59'
      this.setWeek('1')
      this.getPage()
    }
  }
  // private onFiscal2(val: any) {
  //   this.selectForm.monthStart = ''
  //   this.selectForm.monthEnd = ''
  //   this.selectForm.week = ''
  //   this.selectForm.start = ''
  //   this.selectForm.end = ''
  //   this.weekList2 = []
  //   this.clearData2()
  //   const item = this.fiscalList2.find((it: any) => it.id === this.selectForm.period)
  //   if (item) {
  //     this.selectForm.monthStart = dayjs(item.startTime).format('YYYY-MM-DD') + ' 00:00:00'
  //     this.selectForm.monthEnd = dayjs(item.endTime).format('YYYY-MM-DD') + ' 23:59:59'
  //     this.setWeek('2')
  //     this.queryAll()
  //   }
  // }
  // private onFiscal3(val: any) {
  //   this.serviceForm.monthStart = ''
  //   this.serviceForm.monthEnd = ''
  //   this.serviceForm.week = ''
  //   this.serviceForm.start = ''
  //   this.serviceForm.end = ''
  //   this.weekList3 = []
  //   this.clearData3()
  //   const item = this.fiscalList3.find((it: any) => it.id === this.serviceForm.period)
  //   if (item) {
  //     this.serviceForm.monthStart = dayjs(item.startTime).format('YYYY-MM-DD') + ' 00:00:00'
  //     this.serviceForm.monthEnd = dayjs(item.endTime).format('YYYY-MM-DD') + ' 23:59:59'
  //     this.setWeek('3')
  //     this.getTableData()
  //   }
  // }
  private setWeek(str: string) {
    let monthStart = ''
    let monthEnd = ''
    if (str === '1') {
      monthStart = this.searchForm.monthStart
      monthEnd = this.searchForm.monthEnd
    } else if (str === '2') {
      monthStart = this.selectForm.monthStart
      monthEnd = this.selectForm.monthEnd
    } else if (str === '3') {
      monthStart = this.serviceForm.monthStart
      monthEnd = this.serviceForm.monthEnd
    }
    const startDay = dayjs(monthStart).format('YYYY-MM-DD')
    const endDay = dayjs(monthEnd).format('YYYY-MM-DD')
    const week = dayjs(startDay).day()
    let weekDay = ''
    if (week > 0) {
      weekDay = dayjs(startDay).endOf('week').add(1, 'day').format('YYYY-MM-DD')
    } else {
      weekDay = startDay
    } // 第一天的周日
    const tw = dayjs(weekDay).unix()
    const te = dayjs(endDay).unix()
    let arr: any[] = []
    if (tw >= te) {
      arr = [{
        start: startDay,
        end: endDay,
        days: dayjs(endDay).diff(dayjs(startDay), 'day') + 1,
        id: '1'
      }]
    } else {
      const num = (te - tw) / (7 * 86400)
      const index = Math.ceil(num)
      for (let i = 0; i <= index; i++) {
        const wds = dayjs(weekDay).add((i - 1) * 7 + 1, 'day').format('YYYY-MM-DD')
        const wde = dayjs(weekDay).add(i * 7, 'day').format('YYYY-MM-DD')
        if (i === 0) {
          arr.push({
            start: startDay,
            end: weekDay,
            days: dayjs(weekDay).diff(dayjs(startDay), 'day') + 1,
            id: `${i + 1}`
          })
        } else if (i === index) {
          arr.push({
            start: wds,
            end: endDay,
            days: dayjs(endDay).diff(dayjs(wds), 'day') + 1,
            id: `${index + 1}`
          })
        } else {
          arr.push({
            start: wds,
            end: wde,
            days: 7,
            id: `${i + 1}`
          })
        }
      }
    }
    if (str === '1') {
      this.weekList1 = arr
    } else if (str === '2') {
      this.weekList2 = arr
    } else if (str === '3') {
      this.weekList3 = arr
    }
  }
  private onWeek1(val: any) {
    this.searchForm.start = ''
    this.searchForm.end = ''
    this.taskObj = {}
    this.clearData2()
    this.clearData3()
    const item = this.weekList1.find((it: any) => it.id === val)
    if (item) {
      this.searchForm.start = item.start + ' 00:00:00'
      this.searchForm.end = item.end + ' 23:59:59'
    }
    this.getPage()
  }
  // private onWeek2(val: any) {
  //   this.selectForm.start = ''
  //   this.selectForm.end = ''
  //   this.clearData2()
  //   const item = this.weekList2.find((it: any) => it.id === val)
  //   if (item) {
  //     this.selectForm.start = item.start + ' 00:00:00'
  //     this.selectForm.end = item.end + ' 23:59:59'
  //   }
  //   this.queryAll()
  // }
  // private onWeek3(val: any) {
  //   this.serviceForm.start = ''
  //   this.serviceForm.end = ''
  //   this.clearData3()
  //   const item = this.weekList3.find((it: any) => it.id === val)
  //   if (item) {
  //     this.serviceForm.start = item.start + ' 00:00:00'
  //     this.serviceForm.end = item.end + ' 23:59:59'
  //   }
  //   this.getTableData()
  // }
  private getDepartment(str?: string) {
    const params:any = {
      custId: str === '1' ? this.searchForm.comId : str === '2' ? this.selectForm.comId : this.serviceForm.comId,
      deptId: ''
    }
    getDepartList(params).then((res: any) => {
      const departmentList = res.data.result || []
      const json = JSON.parse(
        JSON.stringify(departmentList)
          .replace(/name/g, 'label')
          .replace(/id/g, 'value')
      )
      if (str === '1') {
        this.departmentList1 = json
      } else if (str === '2') {
        this.departmentList2 = json
      } else if (str === '3') {
        this.departmentList3 = json
      } else {
        this.departmentList1 = json
        this.departmentList2 = json
        this.departmentList3 = json
      }
    }).catch((err: any) => {
      return err
    })
  }

  private getPage() {
    const type = (this as any).custType
    const stype = (this as any).custSubtype
    if (type === '0' && this.viewType === '1' && !this.searchForm.parentId) {
      this.$message.error('请选择所属公司')
      return
    } else if ((type === '0' || (type === '2' && stype === '1')) && this.viewType === '2' && !this.searchForm.comId) {
      this.$message.error('请选择分公司')
      return
    } else if (this.viewType === '3' && !this.searchForm.departId) {
      this.$message.error('请选择部门')
      return
    } else if (!this.searchForm.period) {
      this.$message.error('请选择期间')
      return
    }
    this.handleSearch()
    this.queryAll()
    this.getTableData()
  }
  private handleSearch() {
    const type = (this as any).custType
    // const stype = (this as any).custSubtype
    // if (type === '0' && this.viewType === '1' && !this.searchForm.parentId) {
    //   this.$message.error('请选择所属公司')
    //   return
    // } else if ((type === '0' || (type === '2' && stype === '1')) && this.viewType === '2' && !this.searchForm.comId) {
    //   this.$message.error('请选择分公司')
    //   return
    // } else if (this.viewType === '3' && !this.searchForm.departId) {
    //   this.$message.error('请选择部门')
    //   return
    // } else if (!this.searchForm.period) {
    //   this.$message.error('请选择期间')
    //   return
    // }
    this.loading = true
    const { comType, comId, departId, parentId, week, ...form } = this.searchForm
    let currentId: any = ''
    if (this.viewType === '1') {
      currentId = type === '0' ? parentId : (this as any).custId
    } else {
      currentId = comId
    }
    const params: any = {
      ...form,
      type: this.viewType,
      companyId: currentId,
      deptId: departId
    }
    getBillboardCard(params)
      .then((res: any) => {
        const data = res.data || {}
        this.taskObj = data
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

  private queryAll(): void {
    const type = (this as any).custType
    // const stype = (this as any).custSubtype
    // if (type === '0' && this.viewType === '1' && !this.selectForm.parentId) {
    //   this.$message.error('请选择所属公司')
    //   return
    // } else if ((type === '0' || (type === '2' && stype === '1')) && this.viewType === '2' && !this.selectForm.comId) {
    //   this.$message.error('请选择分公司')
    //   return
    // } else if (this.viewType === '3' && !this.selectForm.departId) {
    //   this.$message.error('请选择部门')
    //   return
    // } else if (!this.selectForm.period) {
    //   this.$message.error('请选择期间')
    //   return
    // }
    // this.loading = true
    const { comType, comId, departId, parentId, week, ...form } = this.searchForm
    let currentId: any = ''
    if (this.viewType === '1') {
      currentId = type === '0' ? parentId : (this as any).custId
    } else {
      currentId = comId
    }
    const params: any = {
      ...form,
      type: this.viewType,
      business: this.activeName,
      companyId: currentId,
      deptId: departId
    }
    getBillboardChart(params)
      .then((res: any) => {
        const data = res.data || []
        const arr: any[] = []
        data.map((it: any, index: number) => {
          arr.push({
            '名称': this.viewType === '1' ? it.companyName : this.viewType === '2' ? it.deptName : it.userName,
            '计划量': it.planNum,
            '完成量': it.actualNum,
            percent: it.percent
          })
        })
        this.tableData2 = arr
        this.tableOption2 = data.sort((a: any, b: any) => b.actualNum - a.actualNum)
        this.getOriginData2()
        // this.loading = false
      })
      .catch((err: any) => {
        // this.loading = false
        return err
      })
  }
  private getOriginData2() {
    this.chartData2 = {
      columns: ['名称', '计划量', '完成量'],
      rows: this.tableData2
    }
    this.chartSettings2 = {
      showLine: ['计划量']
    }
    this.chartTooltip2 = {
      trigger: 'axis',
      axisPointer: {
        type: 'line'
      },
      formatter: (params: any) => {
        const index = params[0].dataIndex
        const name = params[0].axisValue
        const rate = this.tableData2[index].percent
        let str = ''
        str += name + '<br/>'
        params.map((it:any) => {
          str += `${it.marker} ${it.seriesName}：${it.data}` + (['0', '4'].includes(this.activeName) ? 'KG' : 'CBM') + '<br/>'
        })
        str += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;完成率：' + rate + '%'
        return str
      }
    }
    this.chartGrid2 = {
      top: 50,
      left: 30,
      bottom: 20,
      right: 60
    }
    this.chartExtend2 = {
      title: {
        text: '任务量',
        textStyle: {
          fontSize: 14,
          color: '#666',
          fontWeight: 'normal'
        },
        left: 60,
        top: 10
      },
      legend: {
        top: 10,
        right: '5%',
        orient: 'horizontal',
        padding: 10,
        itemGap: 10,
        itemWidth: 20,
        itemHeight: 10,
        icon: 'circle'
      },
      xAxis: {
        axisLabel: {
          // interval: 0,
          rotate: -45,
          margin: 12,
          fontWeight: 'normal',
          formatter: (v: any) => {
            let name = ''
            const max = 10
            const len = v.length
            const num = Math.ceil(len / max)
            if (num > 1) {
              const start = v.substring(0, max) + '\n'
              const end = num > 2 ? v.substring(max, max + 8) + '...' : v.substring(max)
              name = start + end
              // for (let i = 0; i < num; i++) {
              //   let tem = ''
              //   const start = i * max
              //   const end = start + max
              //   tem = v.substring(start, end) + '\n'
              //   name += tem
              // }
              // const rep = v.replace(/有限公司/g, '.').replace(/分公司/g, '.')
              // name = rep.substring(0, max) + '...'
            } else {
              name = v
            }
            return name
          }
        }
      },
      series: (v: any) => {
        v.map((it: any) => {
          // it.barGap = '-100%'
          it.barWidth = '20px'
          it.smooth = false
          it.itemStyle = {
            normal: {
              color: (params: any) => {
                return this.colorList[params.seriesIndex]
              },
              lineStyle: {
                color: 'rgba(64, 158, 255, 1)'
              }
            }
          }
          return it
        })
        return v
      }
    }
  }

  // 服务组
  private getTableData(): void {
    const type = (this as any).custType
    // const stype = (this as any).custSubtype
    // if (type === '0' && this.viewType === '1' && !this.serviceForm.parentId) {
    //   this.$message.error('请选择所属公司')
    //   return
    // } else if ((type === '0' || (type === '2' && stype === '1')) && this.viewType === '2' && !this.serviceForm.comId) {
    //   this.$message.error('请选择分公司')
    //   return
    // } else if (this.viewType === '3' && !this.serviceForm.departId) {
    //   this.$message.error('请选择部门')
    //   return
    // } else if (!this.serviceForm.period) {
    //   this.$message.error('请选择期间')
    //   return
    // }
    // this.loading = true
    const { comType, comId, departId, parentId, week, ...form } = this.searchForm
    let currentId: any = ''
    if (this.viewType === '1') {
      currentId = type === '0' ? parentId : (this as any).custId
    } else {
      currentId = comId
    }
    const params: any = {
      ...form,
      type: this.viewType,
      business: this.activeName,
      companyId: currentId,
      deptId: departId
    }
    getDetailChart(params)
      .then((res: any) => {
        const data = res.data || []
        const arr: any[] = []
        data.map((it: any, index: number) => {
          arr.push({
            '名称': it.groupName,
            '计划量': it.planNum,
            '完成量': it.actualNum,
            percent: it.percent
          })
        })
        this.tableData3 = arr
        this.tableOption3 = data.sort((a: any, b: any) => b.actualNum - a.actualNum)
        this.getOriginData3()
        // this.loading = false
      })
      .catch((err: any) => {
        // this.loading = false
        return err
      })
  }

  private getOriginData3() {
    this.chartData3 = {
      columns: ['名称', '计划量', '完成量'],
      rows: this.tableData3
    }
    this.chartSettings3 = {
      showLine: ['计划量']
    }
    this.chartTooltip3 = {
      trigger: 'axis',
      axisPointer: {
        type: 'line'
      },
      formatter: (params: any) => {
        const index = params[0].dataIndex
        const name = params[0].axisValue
        const rate = this.tableData3[index].percent
        let str = ''
        str += name + '<br/>'
        params.map((it:any) => {
          str += `${it.marker} ${it.seriesName}：${it.data}` + (['0', '4'].includes(this.activeName) ? 'KG' : 'CBM') + '<br/>'
        })
        str += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;完成率：' + rate + '%'
        return str
      }
    }
    this.chartGrid3 = {
      top: 50,
      left: 30,
      bottom: 20,
      right: 60
    }
    this.chartExtend3 = {
      title: {
        text: '任务量',
        textStyle: {
          fontSize: 14,
          color: '#666',
          fontWeight: 'normal'
        },
        left: 60,
        top: 10
      },
      legend: {
        top: 10,
        right: '5%',
        orient: 'horizontal',
        padding: 10,
        itemGap: 10,
        itemWidth: 20,
        itemHeight: 10,
        icon: 'circle'
      },
      xAxis: {
        axisLabel: {
          // interval: 0,
          rotate: -45,
          margin: 12,
          fontWeight: 'normal',
          formatter: (v: any) => {
            let name = ''
            const max = 10
            const len = v.length
            const num = Math.ceil(len / max)
            if (num > 1) {
              const start = v.substring(0, max) + '\n'
              const end = num > 2 ? v.substring(max, max + 8) + '...' : v.substring(max)
              name = start + end
              // for (let i = 0; i < num; i++) {
              //   let tem = ''
              //   const start = i * max
              //   const end = start + max
              //   tem = v.substring(start, end) + '\n'
              //   name += tem
              // }
              // const rep = v.replace(/有限公司/g, '.').replace(/分公司/g, '.')
              // name = rep.substring(0, max) + '...'
            } else {
              name = v
            }
            return name
          }
        }
      },
      series: (v: any) => {
        v.map((it: any) => {
          // it.barGap = '-100%'
          it.barWidth = '20px'
          it.smooth = false
          it.itemStyle = {
            normal: {
              color: (params: any) => {
                return this.colorList[params.seriesIndex]
              },
              lineStyle: {
                color: 'rgba(64, 158, 255, 1)'
              }
            }
          }
          return it
        })
        return v
      }
    }
  }
  private chartClick(e: any) {
    // this.detailShow = true
    // const root: any = this.$refs.detail
    // this.$nextTick(() => {
    //   root.setData(e)
    // })
  }
  private mounted() {
    this.getOriginData2()
    this.getOriginData3()
  }
  private created() {
    const type = (this as any).custType
    const stype = (this as any).custSubtype
    const cid = (this as any).custId
    const iftc = (this as any).ifCustomer
    const pid = (this as any).parentId
    if (type === '2' && stype === '2' && iftc) {
      this.firstId = pid
      this.secondId = pid
      this.thirdId = pid
    } else if (type !== '0') {
      this.firstId = cid
      this.secondId = cid
      this.thirdId = cid
    } else {
      this.firstId = ''
      this.secondId = ''
      this.thirdId = ''
    }
    if (type !== '0' && (type === '2' && stype !== '1')) {
      this.searchForm.comId = (this as any).custId
      this.selectForm.comId = (this as any).custId
      this.serviceForm.comId = (this as any).custId
      this.getDepartment()
    }
    if ((this as any).$checkPermission(['salesCompanyBillboard'])) {
      this.viewType = '1'
    } else if ((this as any).$checkPermission(['salesDepartBillboard']) && !(this as any).$checkPermission(['salesCompanyBillboard'])) {
      this.viewType = '2'
    } else if ((this as any).$checkPermission(['salesMenBillboard']) && !(this as any).$checkPermission(['salesCompanyBillboard', 'salesDepartBillboard'])) {
      this.viewType = '3'
    }
  }
}
</script>

<style lang="scss" scoped>
.tips-index {
  display: inline-block;
  width: 16px;
  height: 16px;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  border-radius: 50%;
  background-color: #F0F2F5;
  color: #000;
}
.tips-top {
  background-color: #314659;
  color: #fff;
}
.num-min {
  color: #409EFF;
}
.num-max {
  color: #FF9845;
}
.empty-data {
  text-align: center;
  padding: 100px 0;
  img {
    display: inline-block;
    width: 330px;
    height: 270px;
  }
  .empty-text {
    display: block;
    font-weight: bold;
    font-size: 20px;
  }
}
::v-deep .tabs-set {
  .el-tabs__nav-wrap::after {
    height: 0;
  }
  // .el-tabs__active-bar {
  //   height: 0;
  // }
  .el-tabs__header {
    margin: 0;
  }
}
</style>
