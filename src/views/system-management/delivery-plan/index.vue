<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          :title="pageType === 'product-page' ? '发货计划' : pageType === 'product-detail' ? '计划详情' : '发货计划 -- 任务模板'"
        >
          <div
            v-if="pageType !== 'product-page'"
            slot="option"
          >
            <el-button
              type="text"
              style="margin-left: 10px"
              @click="showProduct"
            >
              返回
            </el-button>
          </div>
        </head-info>
        <div
          v-show="pageType !== 'product-detail'"
          class="app-panel"
        >
          <el-row>
            <el-col
              :span="2"
            >
              <!--<el-button
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-left: 10px"
                @click="viewGroups"
              >
                查看团购
              </el-button>-->
              <!--<el-button
                v-if="pageType === 'product-page'"
                type="text"
                style="margin-left: 10px"
                @click="showProductTemplate"
              >
                任务模板
              </el-button>-->
              <el-button
                v-permission="['addPlan']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-left: 10px"
                @click="addProduct"
              >
                {{ pageType === 'product-page' ? '新增' : '新增模板' }}
              </el-button>
            </el-col>
            <el-col
              :span="22"
              style="text-align:right;"
            >
              <!-- <el-select
                v-model="selectValue.persionId"
                :loading="selectLoading"
                size="small"
                style="width:130px;margin-right:5px;"
                placeholder="发起人"
                filterable
                @focus="getPersionList"
              >
                <el-option
                  v-for="item in persionList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.frequency"
                size="small"
                style="width:130px;margin-right:5px;"
                placeholder="自动创建频率"
                clearable
              >
                <el-option
                  label="无"
                  value="0"
                />
                <el-option
                  label="有"
                  value="1"
                />
              </el-select> -->
              <el-select
                v-model="selectValue.type"
                :loading="selectLoading"
                placeholder="业务类型"
                size="small"
                style="width:130px;margin-right:5px;"
                clearable
                filterable
                @focus="getBusinessType"
                @change="onType"
              >
                <el-option
                  v-for="item in typelist"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select
                v-model="selectValue.countryId"
                :loading="selectLoading"
                size="small"
                clearable
                filterable
                placeholder="目的国"
                style="width:130px;margin-right:5px;"
                @focus="getCountryList"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.bscId"
                :loading="selectLoading"
                :disabled="!selectValue.type"
                clearable
                filterable
                size="small"
                style="width:130px;margin-right:5px;"
                placeholder="服务"
                @focus="getBscList"
                @change="onFlight"
              >
                <el-option
                  v-for="item in flightList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.bscTransId"
                :loading="selectLoading"
                :disabled="!selectValue.bscId"
                clearable
                filterable
                size="small"
                style="width:130px;margin-right:5px;"
                placeholder="服务商"
                @focus="getBsTransList"
              >
                <el-option
                  v-for="item in bsTransList"
                  :key="item.id"
                  :label="`${item.orgName + '/' + item.serviceCode}`"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-if="pageType === 'product-page'"
                v-model="selectValue.status"
                size="small"
                style="width:130px;margin-right:5px;"
                placeholder="计划状态"
                clearable
              >
                <el-option
                  label="已下达"
                  value="0"
                />
                <el-option
                  label="已装满"
                  value="1"
                />
                <el-option
                  label="已完成"
                  value="2"
                />
                <el-option
                  label="已过期"
                  value="4"
                />
                <el-option
                  label="已取消"
                  value="3"
                />
              </el-select>
              <el-date-picker
                v-model="selectValue.shipTime"
                :picker-options="pickerOptions"
                unlink-panels
                clearable
                type="daterange"
                align="right"
                size="small"
                value-format="yyyy-MM-dd"
                range-separator="~"
                style="width:240px;margin-right:5px;"
                start-placeholder="起运起始时间"
                end-placeholder="起运截止时间"
              />
              <el-date-picker
                v-model="selectValue.cutoffTime"
                :picker-options="pickerOptions"
                unlink-panels
                clearable
                type="daterange"
                align="right"
                size="small"
                value-format="yyyy-MM-dd"
                range-separator="~"
                style="width:240px;margin-right:5px;"
                start-placeholder="截单起始时间"
                end-placeholder="截单截止时间"
              />
              <el-input
                v-model="selectValue.bscName"
                placeholder="订舱服务名称"
                class="input-with-select"
                style="width: 200px;margin-right:10px;"
                size="small"
              />
              <el-button
                v-permission="['queryPlan']"
                type="primary"
                size="small"
                @click="queryAll(1)"
              >
                查询
              </el-button>
            </el-col>
          </el-row>

          <el-table
            v-show="pageType !== 'product-template-page'"
            ref="planTable"
            v-loading="loading"
            :data="tableData"
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              prop="bscName"
              fixed="left"
              min-width="180"
              label="订舱服务"
              show-overflow-tooltip
            />
            <el-table-column
              :formatter="dispatchFormat"
              width="130"
              fixed="left"
              label="派件方式"
            />
            <el-table-column
              min-width="160"
              fixed="left"
              label="装载容器"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span v-if="scope.row.type === '0'">
                  航空版 /
                </span>
                <span v-if="scope.row.type === '1' || scope.row.type === '2'">
                  柜型 /
                </span>
                <span v-if="scope.row.type === '3'">
                  车型 /
                </span>
                <span>
                  {{ scope.row.containerName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="quantity"
              width="120"
              label="数量"
            />
            <el-table-column
              prop="loadLimit"
              width="120"
              label="限重(kg)"
            />
            <el-table-column
              prop="loaded"
              width="120"
              label="已装载(m³)"
            />

            <el-table-column
              :formatter="formatShipDate"
              width="160"
              label="起运日期"
            />
            <el-table-column
              :formatter="formatCutoffDate"
              width="160"
              label="截单日期"
            />
            <el-table-column
              prop="transTime"
              width="100"
              label="运输天数"
            />
            <el-table-column
              width="100"
              label="计划状态"
            >
              <template
                slot-scope="scope"
              >
                <span v-if="scope.row.status === 0">已下达</span>
                <span v-else-if="scope.row.status === 1">已装满</span>
                <span v-else-if="scope.row.status === 2">已完成</span>
                <span v-else-if="scope.row.status === 3">已取消</span>
                <span v-else-if="scope.row.status === 4">已过期</span>
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              min-width="180"
              label="发起人"
              show-overflow-tooltip
            >
              <template
                slot-scope="scope"
              >
                <span>
                  {{ scope.row.createUser }}
                </span>
                <span>
                  {{ scope.row.createDept ? ' - ' + scope.row.createDept : '--' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              min-width="240"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="viewProduct(scope.row)"
                >
                  查看
                </el-button>
                <el-button
                  v-if="scope.row.enable !== 0 && $checkPermission(['editPlan'])"
                  type="text"
                  @click="editProduct(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-if="scope.row.status !== 4 && scope.row.enable === 0 && $checkPermission(['deletePlan'])"
                  type="text"
                  @click="cancelProduct(scope.row)"
                >
                  取消
                </el-button>
                <el-button
                  v-if="scope.row.enable !== 0 && $checkPermission(['deletePlan'])"
                  type="text"
                  @click="deleteProduct(scope.row)"
                >
                  删除
                </el-button>
                <el-button
                  v-if="scope.row.status !== 4 && scope.row.enable === 0 && scope.row.ifBooking === 0 "
                  type="text"
                  @click="makeBooking(scope.row)"
                >
                  生成Booking
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            v-show="pageType === 'product-template-page'"
            ref="planTable"
            v-loading="loading"
            :data="tableData"
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              prop="bscName"
              fixed="left"
              min-width="150"
              label="订舱服务"
            />
            <el-table-column
              :formatter="dispatchFormat"
              width="120"
              fixed="left"
              label="派件方式"
            />
            <el-table-column
              prop="containerName"
              min-width="120"
              fixed="left"
              label="柜型"
            />
            <el-table-column
              prop="quantity"
              width="120"
              label="数量"
            />
            <el-table-column
              prop="loadLimit"
              width="120"
              label="限重(kg)"
            />

            <el-table-column
              :formatter="formatShipDate"
              width="180"
              label="起运日期"
            />
            <el-table-column
              :formatter="formatCutoffDate"
              width="180"
              label="截单日期"
            />
            <el-table-column
              prop="transTime"
              width="120"
              label="运输天数"
            />
            <el-table-column
              width="120"
              label="频率"
            >
              <template
                slot-scope="scope"
              >
                <span>
                  {{ scope.row.frequency }}
                  {{ scope.row.unit === 1 ? '天' : '周' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              width="120"
              label="周期"
            >
              <template
                slot-scope="scope"
              >
                <span>
                  {{ scope.row.cycle }}
                  {{ scope.row.unit === 1 ? '天' : '周' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              min-width="160"
              label="操作"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.enable"
                  class="switchStyle"
                  active-text="启用"
                  inactive-text="禁用"
                  :active-value="0"
                  :inactive-value="1"
                  style="margin-right: 10px"
                  @input="(value) => onStatus(scope.row, value)"
                />
                <el-button
                  v-if="scope.row.enable !== 0"
                  type="text"
                  @click="editProduct(scope.row)"
                >
                  编辑
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            :current-page.sync="page"
            :page-size="size"
            layout="total, prev, pager, next"
            :total="total"
            style="text-align: right;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />

          <el-dialog
            :title="dialogTitle"
            width="1000px"
            :visible.sync="isAddEditVisible"
            :close-on-click-modal="false"
            @closed="cancel"
          >
            <addEditForm
              ref="addEditForm"
              :is-edit="isEdit"
              :is-book="isBook"
              :page-type="pageType"
              @cancel="cancel"
              @queryAll="queryAll"
            />
          </el-dialog>
          <hint-model
            ref="hintModel"
            @cancel="saveByCancel"
            @ok="saveByNow"
          />

          <!--<el-dialog
            title="团购信息"
            width="1200px"
            :visible.sync="isGroupsVisible"
            :close-on-click-modal="false"
            @closed="closeGroups"
          >
            <deliveryGroups
              ref="deliveryGroups"
              @edit="editPlan"
            />
          </el-dialog>-->

          <el-dialog
            title="生成Booking"
            width="400px"
            :visible.sync="isBookingVisible"
            :close-on-click-modal="false"
            @closed="cancelBooking"
          >
            <div v-loading="bookingLoading">
              <el-form
                ref="supplyForm"
                :model="supplyForm"
                :rules="rules"
                label-width="75px"
                label-position="right"
                size="small"
              >
                <el-form-item
                  label="供应商"
                  prop="supplyId"
                >
                  <el-select
                    v-model="supplyForm.supplyId"
                    :loading="selectLoading"
                    placeholder="请选择"
                    size="small"
                    style="width:100%;"
                    filterable
                    clearable
                    @focus="getSupplierList"
                  >
                    <el-option
                      v-for="item in supplierlist"
                      :key="item.custId"
                      :label="item.custName"
                      :value="item.custId"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="发货人"
                  prop="consignor"
                >
                  <el-select
                    v-model="supplyForm.consignor"
                    :loading="selectLoading"
                    placeholder="请选择"
                    size="small"
                    style="width:100%;"
                    filterable
                    clearable
                    @focus="getConsignorList"
                  >
                    <el-option
                      v-for="item in consignorList"
                      :key="item.id"
                      :label="`${item.company}-${item.countryName}-${item.contact}`"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="收货人"
                  prop="consignee"
                >
                  <el-select
                    v-model="supplyForm.consignee"
                    :loading="selectLoading"
                    placeholder="请选择"
                    size="small"
                    style="width:100%;"
                    filterable
                    clearable
                    @focus="getConsigneeList"
                  >
                    <el-option
                      v-for="item in consigneeList"
                      :key="item.id"
                      :label="`${item.company}-${item.countryName}-${item.contact}`"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="通知人"
                  prop="notifier"
                >
                  <el-select
                    v-model="supplyForm.notifier"
                    :loading="selectLoading"
                    placeholder="请选择"
                    size="small"
                    style="width:100%;"
                    filterable
                    clearable
                    @focus="getNotifierList"
                  >
                    <el-option
                      v-for="item in notifierList"
                      :key="item.id"
                      :label="`${item.company}-${item.countryName}-${item.contact}`"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-form>
              <div
                style="text-align: right;padding: 10px 0 0;"
              >
                <el-button
                  size="small"
                  @click="cancelBooking"
                >
                  取 消
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="saveBooking"
                >
                  确 定
                </el-button>
              </div>
            </div>
          </el-dialog>
        </div>
        <div
          v-show="pageType === 'product-detail'"
          class="app-panel"
        >
          <detail ref="detail" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getDeliveryList,
  deleteDelivery,
  getPersionList,
  getCountryList,
  getWordsList,
  getBscList,
  cancelDelivery,
  getSupplierList,
  saveBooking,
  getBookcList
} from '@/api/system-in-delivery-plan'
import { getBsTransList } from '@/api/service-with-booking-service'

import addEditForm from '@/views/system-management/delivery-plan/addEditForm.vue'
import deliveryGroups from '@/views/system-management/delivery-plan/deliveryGroups.vue'
import dayjs from 'dayjs'
import hintModel from '@/views/system-management/delivery-plan/hintModel.vue'
import detail from '@/views/system-management/delivery-plan/detail.vue'

@Component({
  name: '',
  components: {
    addEditForm,
    deliveryGroups,
    hintModel,
    detail
  },
  props: {}
})
export default class extends Vue {
  /* data */
  // product-page: 发货计划 product-template-page: 任务模板
  private pageType: string = 'product-page'
  private dialogTitle: string = ''
  private isAddEditVisible: boolean= false
  private isBookingVisible: boolean= false
  private isEdit: boolean = false
  private isBook: boolean = false
  private loading: boolean = false
  private bookingLoading: boolean = false
  private isGroupsVisible: boolean = false
  private tableData: any = []
  private selectValue: any = {
    persionId: undefined,
    countryId: undefined,
    frequency: undefined,
    status: undefined,
    bscId: undefined,
    bscTransId: undefined,
    type: undefined,
    bscName: undefined,
    shipTime: [],
    cutoffTime: []
  }
  private supplyForm: any = {
    planId: '',
    supplyName: '',
    type: '',
    supplyId: undefined,
    notifier: undefined,
    consignee: undefined,
    consignor: undefined
  }
  private rules: any = {
    supplyId: { required: true, message: '请选择供应商', trigger: 'change' },
    notifier: { required: true, message: '请选择通知人', trigger: 'change' },
    consignee: { required: true, message: '请选择收获人', trigger: 'change' },
    consignor: { required: true, message: '请选择发货人', trigger: 'change' }
  }
  private supplierlist: any[] = []
  private selectLoading: boolean = false
  private page: number = 1
  private size: number = 10
  private total: any = 0
  private persionList: any[] = []
  private countryList: any[] = []
  private typelist: any[] = []
  private flightList: any[] = []
  private bsTransList: any[] = []
  private notifierList: any[] = []
  private consigneeList: any[] = []
  private consignorList: any[] = []

  /* computed */
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
  get custId():string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }
  // 所属公司Name
  get custName(): string {
    const info = UserModule.info || {}
    const custName = (info as any).custName
    return custName
  }

  get pickerOptions() {
    return {
    }
  }

  /* methods */
  private dispatchFormat(row: any) {
    const obj: any = { '0': '快递', '1': '卡派', '2': '自提', '3': '整柜直送' }
    const arrD = (`${row.dispatch}` || '').split(',')
    const arrN: any[] = []
    arrD.map((it: any) => {
      arrN.push(obj[it])
    })
    return arrN.join(',')
  }
  private getConsignorList() {
    this.selectLoading = true
    getBookcList({
      type: 0,
      custId: (this as any).custId,
      page: 1,
      size: 999
    }).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      this.consignorList = data.result || []
    }).catch(() => {
      this.selectLoading = false
      this.consignorList = []
    })
  }
  private getConsigneeList() {
    this.selectLoading = true
    getBookcList({
      type: 1,
      custId: (this as any).custId,
      page: 1,
      size: 999
    }).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      this.consigneeList = data.result || []
    }).catch(() => {
      this.selectLoading = false
      this.consigneeList = []
    })
  }
  private getNotifierList() {
    this.selectLoading = true
    getBookcList({
      type: 2,
      custId: (this as any).custId,
      page: 1,
      size: 999
    }).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      this.notifierList = data.result || []
    }).catch(() => {
      this.selectLoading = false
      this.notifierList = []
    })
  }
  private showProduct() {
    this.pageType = 'product-page'
    this.queryAll(1)
  }
  private showProductTemplate() {
    this.pageType = 'product-template-page'
    this.selectValue.status = ''
    this.queryAll(1)
  }
  private formatShipDate(row: any) {
    if (row.shipDate) {
      return dayjs(row.shipDate).format('YYYY-MM-DD HH:mm')
    } else {
      return '--'
    }
  }
  private formatCutoffDate(row: any) {
    if (row.cutoffDate) {
      return dayjs(row.cutoffDate).format('YYYY-MM-DD HH:mm')
    } else {
      return '--'
    }
  }
  private async created() {
    this.selectValue.shipTime = [dayjs().startOf('month').format('YYYY-MM-DD'), dayjs().endOf('month').format('YYYY-MM-DD')]
    this.queryAll()
  }

  private getPersionList() {
    const params:any = {
      page: 1,
      size: 99999
    }
    this.selectLoading = true
    getPersionList(params).then((res:any) => {
      const data = res.data || {}
      this.persionList = data.result || []
      this.selectLoading = false
    }).catch((err:any) => {
      this.selectLoading = false
      return err
    })
  }
  private getBusinessType() {
    this.selectLoading = true
    const params = {
      type: 'BOOKING_BUSINESS_TYPE'
    }
    getWordsList(params).then((res: any) => {
      if (res.success) {
        this.typelist = res.data || []
        this.selectLoading = false
      }
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }
  private onType() {
    this.flightList = []
    this.bsTransList = []
    this.selectValue.bscId = undefined
    this.selectValue.bscTransId = undefined
  }
  private onFlight() {
    this.selectValue.bscTransId = undefined
    this.bsTransList = []
    this.getCountryList()
    this.flightList.map((it: any) => {
      if (this.selectValue.bscId === it.id) {
        this.selectValue.countryId = it.countryToId
      }
    })
  }
  private getCountryList() {
    this.selectLoading = true
    getCountryList().then((res: any) => {
      this.selectLoading = false
      if (res.success) {
        const data = res.data || {}
        this.countryList = data.result || []
      }
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }
  private getBscList() {
    this.selectLoading = true
    const params:any = {
      page: 1,
      size: 99999,
      conveyance: this.selectValue.type,
      countryToId: this.selectValue.countryId
    }
    getBscList(params)
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result
        this.flightList = result.map((item: any) => {
          item.id = item.id + ''
          return item
        })
        this.selectLoading = false
      }).catch((err: any) => {
        this.selectLoading = false
        return [err, null]
      })
  }
  private getBsTransList() {
    const params = {
      page: 1,
      size: 999,
      model: {
        id: this.selectValue.bscId
      }
    }
    this.selectLoading = true
    getBsTransList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.bsTransList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private queryAll(val?: any): void {
    this.loading = true
    const { shipTime, cutoffTime, ...form } = this.selectValue
    if (val) {
      this.page = val
    }
    const params:any = {
      page: this.page,
      size: this.size,
      model: {
        ...form,
        source: 1
      }
    }
    if (this.pageType === 'product-template-page') {
      params.model.source = 0
    }
    if (Array.isArray(shipTime) && shipTime.length > 0) {
      params.model.shipStart = shipTime[0]
      params.model.shipEnd = shipTime[1]
    }
    if (Array.isArray(cutoffTime) && cutoffTime.length > 0) {
      params.model.cutoffStart = cutoffTime[0]
      params.model.cutoffEnd = cutoffTime[1]
    }
    getDeliveryList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.tableData = data.result || []
        this.total = data.total
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

  // 添加
  private async addProduct() {
    this.isAddEditVisible = true
    if (this.pageType === 'product-template-page') {
      this.dialogTitle = '新增发货计划模板'
    } else {
      this.dialogTitle = '新增发货计划'
    }
    this.isEdit = false
    this.isBook = false
  }
  // 编辑
  private async editProduct(row: any) {
    this.isAddEditVisible = true
    if (this.pageType === 'product-template-page') {
      this.dialogTitle = '编辑发货计划模板'
    } else {
      this.dialogTitle = '编辑发货计划'
    }
    this.isEdit = true
    this.isBook = row.ifBooking === 1
    this.$nextTick(() => {
      const root: any = this.$refs.addEditForm
      root.setData(row)
    })
  }
  private viewProduct(row: any) {
    this.pageType = 'product-detail'
    this.$nextTick(() => {
      const root: any = this.$refs.detail
      root.show(row.id)
    })
  }
  private makeBooking(row: any) {
    this.isBookingVisible = true
    const { id, supplyId, supplyName, type } = row
    this.supplyForm = {
      planId: id,
      supplyId,
      supplyName,
      type,
      notifier: undefined,
      consignee: undefined,
      consignor: undefined
    }
    this.getSupplierList()
  }
  private cancelBooking() {
    this.isBookingVisible = false
    this.supplyForm = {
      planId: '',
      supplyName: '',
      type: '',
      supplyId: undefined,
      notifier: undefined,
      consignee: undefined,
      consignor: undefined
    }
    this.$nextTick(() => {
      const root:any = this.$refs.supplyForm
      root.clearValidate()
    })
  }
  private saveBooking() {
    const form: any = this.$refs.supplyForm
    form.validate((valid: any) => {
      if (!valid) return false
      this.bookingLoading = true
      const params: any = {
        planId: this.supplyForm.planId,
        supplyId: this.supplyForm.supplyId,
        notice: this.notifierList.find((e: any) => e.id === this.supplyForm.notifier) || {},
        receiving: this.consigneeList.find((e: any) => e.id === this.supplyForm.consignee) || {},
        sending: this.consignorList.find((e: any) => e.id === this.supplyForm.consignor) || {}
      }
      this.supplierlist.map((it: any) => {
        if (it.custId === params.supplyId) {
          params.supplyName = it.custName
        }
      })
      saveBooking(params).then((res:any) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.bookingLoading = false
        this.queryAll()
        this.cancelBooking()
      }).catch((err: any) => {
        this.bookingLoading = false
        return err
      })
    })
  }
  private close(): void {
    this.cancel()
  }
  private cancel() {
    this.isAddEditVisible = false
    this.clearValidate()
  }
  private clearValidate() {
    this.$nextTick(() => {
      const addEditDom:any = this.$refs.addEditForm
      const root:any = addEditDom.$refs.selectForm
      addEditDom.resetForm()
      root.clearValidate()
    })
  }
  private getSupplierList() {
    this.selectLoading = true
    const params: any = {
      typeId: '02',
      cas: 'S',
      subtypeId: this.supplyForm.type,
      page: 1,
      size: 9999
    }
    getSupplierList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.supplierlist = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private viewGroups(row: any) {
    this.isGroupsVisible = true
  }
  private closeGroups() {
    this.isGroupsVisible = false
  }
  private editPlan() {
    //
  }
  private saveByCancel(params: any) {
    // cancelDelivery({
    //   id: params.id,
    //   enable: params.enable,
    //   isNow: 0
    // }).then((res:any) => {
    //   this.$message({
    //     type: 'success',
    //     message: '操作成功'
    //   })
    //   this.queryAll()
    // }).catch((err: any) => {
    //   this.loading = false
    //   return err
    // })
    this.queryAll()
  }
  private saveByNow(params: any, radio: any) {
    const data: any = { ...params, isNow: 1 }
    if (radio === '2') {
      data.isNow = 0
    }
    cancelDelivery({
      id: data.id,
      enable: data.enable,
      isNow: data.isNow
    }).then((res:any) => {
      this.$message({
        type: 'success',
        message: '操作成功'
      })
      this.queryAll()
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }
  private async onStatus(row: any, value: any) {
    const olds = row.status.toString()
    const news = value.toString()
    if ((news * 1) !== 0) {
      if (!olds || olds === news) return
      const text = news === '1' ? '禁用' : '开启'
      const [cancel, confirm] = await this.$confirm(
        `此操作将${text}该发货计划，是否继续？`,
        '提示',
        {
          confirmButtonText: '确定',
          closeOnClickModal: false,
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(res => {
          return [null, res]
        })
        .catch(err => {
          return [err, null]
        })
      if (cancel) {
        this.queryAll()
        return
      }
      this.loading = true
      cancelDelivery({
        id: row.id,
        enable: value,
        isNow: 0
      }).then((res:any) => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.queryAll()
      }).catch((err: any) => {
        this.loading = false
        return err
      })
    } else {
      const params = {
        id: row.id,
        shipDate: row.shipDate,
        cutoffDate: row.cutoffDate,
        frequency: row.frequency,
        enable: value,
        isNow: 0
      }
      const hint: any = this.$refs.hintModel
      hint.show(params)
    }
  }

  private cancelProduct(row: any) {
    // cancel
    this.$confirm('请确认是否取消该计划?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.loading = true
        cancelDelivery({
          id: row.id,
          enable: 1,
          isNow: 0
        }).then((res:any) => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.queryAll()
        }).catch((err: any) => {
          this.loading = false
          return err
        })
      })
      .catch(() => {
        return false
      })
  }

  private deleteProduct(row: any) {
    this.$confirm('请确认是否删除该计划?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.loading = true
        deleteDelivery({
          id: row.id
        }).then((res:any) => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.queryAll()
        }).catch((err: any) => {
          this.loading = false
          return err
        })
      })
      .catch(() => {
        return false
      })
  }

  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.queryAll()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.queryAll()
  }
}
</script>
<style lang="scss" scoped>
  .el-table .cell{
      white-space:pre-line;
  }
</style>
