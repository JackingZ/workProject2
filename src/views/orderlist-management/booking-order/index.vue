<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        v-show="showPage === 'index'"
        class="app-container"
      >
        <head-info
          info=""
          title="订舱订单"
        />
        <div class="app-panel">
          <div style="text-align:right;">
            <el-select
              v-if="custType === '0' || custType === '2'"
              v-model="searchForm.orderType"
              placeholder="订单类型"
              style="width:100px;margin-right:5px;"
              size="small"
              @change="onOrderType"
            >
              <el-option
                v-for="item in orderTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-select
              v-if="custType === '2' && custSubtype === '1' && searchForm.orderType === '0'"
              v-model="searchForm.comType"
              size="small"
              style="width:100px;margin-right:5px;"
              placeholder="公司类型"
              clearable
              @change="onComType"
            >
              <el-option
                v-for="(item, index) in companyTypeList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-select
              v-if="(custType === '0' || custType === '2') && searchForm.orderType === '0'"
              v-model="searchForm.comId"
              :loading="selectLoading"
              size="small"
              style="width:130px;margin-right:5px;"
              placeholder="所属公司"
              filterable
              clearable
              @change="onCompany"
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
              v-model="searchForm.businessType"
              :loading="selectLoading"
              size="small"
              style="width: 100px;margin-right: 5px;"
              placeholder="业务类型"
              filterable
              clearable
              @change="onBusiness"
              @focus="getSubtypeData"
            >
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-select
              v-model="searchForm.orderStatus"
              :disabled="!searchForm.businessType"
              :loading="selectLoading"
              placeholder="订单状态"
              style="width: 100px;margin-right: 5px;"
              size="small"
              clearable
              filterable
              @focus="getStatusData"
            >
              <el-option
                v-for="item in statusList"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
            <el-select
              v-model="searchForm.portsToId"
              :loading="selectLoading"
              clearable
              filterable
              placeholder="目的港"
              style="width:130px;margin-right:5px;"
              size="small"
              @focus="getPortList"
            >
              <el-option
                v-for="item in portList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-select
              v-model="searchForm.serverTerms"
              :loading="selectLoading"
              clearable
              filterable
              placeholder="服务条款"
              style="width:100px;margin-right:5px;"
              size="small"
              @focus="getWordsList"
            >
              <el-option
                v-for="item in serveceList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select
              v-model="searchForm.goodsClause"
              :loading="selectLoading"
              clearable
              filterable
              placeholder="放货条款"
              style="width:100px;margin-right:5px;"
              size="small"
            >
              <el-option
                v-for="item in goodsList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-select
              v-model="searchForm.serviceId"
              :disabled="!searchForm.businessType"
              :loading="selectLoading"
              clearable
              filterable
              placeholder="服务"
              style="width:130px;margin-right:5px;"
              size="small"
              @focus="getBsService"
              @change=";(searchForm.orgId = undefined, bsTransList = [])"
            >
              <el-option
                v-for="item in serviceList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-select
              v-model="searchForm.orgId"
              :loading="selectLoading"
              :disabled="!searchForm.serviceId"
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
                :value="item.orgId"
              />
            </el-select>
            <el-date-picker
              v-model="searchForm.orderTime"
              clearable
              unlink-panels
              type="daterange"
              align="right"
              size="small"
              value-format="yyyy-MM-dd"
              range-separator="~"
              style="width:240px;margin-right:5px;"
              start-placeholder="订舱起始时间"
              end-placeholder="订舱截止时间"
            />
            <el-input
              v-model="keyword"
              placeholder="请输入内容"
              class="input-with-select"
              style="width:240px;margin-right: 10px;"
              size="small"
              clearable
            >
              <el-select
                slot="prepend"
                v-model="selectType"
                size="small"
                style="width:100px;"
                placeholder="请选择"
              >
                <el-option
                  label="原单号"
                  value="1"
                />
                <el-option
                  v-show="searchForm.businessType === '1' || searchForm.businessType === '2'"
                  label="SO号"
                  value="2"
                />
                <el-option
                  v-show="searchForm.businessType === '1' || searchForm.businessType === '2'"
                  label="柜号"
                  value="3"
                />
                <el-option
                  v-show="searchForm.businessType === '0'"
                  label="提单号"
                  value="4"
                />
                <el-option
                  v-show="searchForm.businessType === '0'"
                  label="航空单号"
                  value="5"
                />
              </el-select>
            </el-input>
            <el-button
              v-permission="['bookingOrderQuery']"
              type="primary"
              size="small"
              @click="getTableData(1)"
            >
              查询
            </el-button>
          </div>
          <div
            v-loading="loading"
            style="height: calc(100vh - 250px);"
          >
            <el-table
              v-if="tableData.length > 0"
              :data="tableData"
              height="calc(100vh - 300px)"
              style="width: 100%;margin: 10px 0;"
              border
            >
              <el-table-column
                fixed="left"
                prop="markNo"
                label="原单号"
                min-width="180"
                show-overflow-tooltip
              />
              <el-table-column
                v-if="searchForm.businessType === '1'"
                fixed="left"
                prop="soCode"
                label="SO号"
                min-width="150"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.soCode || '-' }}
                </template>
              </el-table-column>
              <el-table-column
                v-if="searchForm.businessType === '0'"
                fixed="left"
                prop="billNo"
                label="提单号"
                min-width="150"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.billNo || '-' }}
                </template>
              </el-table-column>
              <el-table-column
                v-if="searchForm.businessType === '0'"
                fixed="left"
                prop="airNo"
                label="航空单号"
                min-width="150"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.airNo || '-' }}
                </template>
              </el-table-column>
              <el-table-column
                fixed="left"
                prop=""
                :formatter="formatStatus"
                label="订单状态"
                width="120"
              />
              <el-table-column
                prop="audit"
                label="审核状态"
                width="120"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.audit === '0'">待审核</span>
                  <span v-else-if="scope.row.audit === '1'">审核通过</span>
                  <span v-else-if="scope.row.audit === '2'">审核拒绝</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="businessType"
                label="业务类型"
                width="120"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.businessType === '0'">空运</span>
                  <span v-else-if="scope.row.businessType === '1'">海运</span>
                  <span v-else-if="scope.row.businessType === '2'">铁路</span>
                  <span v-else-if="scope.row.businessType === '4'">卡航</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="bsServiceName"
                label="服务"
                min-width="150"
                show-overflow-tooltip
              />
              <el-table-column
                prop="portsFromName"
                label="起运港"
                width="180"
              />
              <el-table-column
                prop="portsToName"
                label="目的港"
                width="180"
              />
              <el-table-column
                prop="supplierName"
                label="供应商名称"
                width="180"
                show-overflow-tooltip
              />
              <el-table-column
                prop="custName"
                label="下单客户"
                width="180"
                show-overflow-tooltip
              />
              <el-table-column
                v-if="searchForm.businessType === '1'"
                label="起运港提柜"
                width="120"
              >
                <template slot-scope="scope">
                  {{ formatContain(scope.row, '251') }}
                </template>
              </el-table-column>
              <el-table-column
                v-if="searchForm.businessType === '1'"
                label="起运港已装柜"
                width="120"
              >
                <template slot-scope="scope">
                  {{ formatContain(scope.row, '252') }}
                </template>
              </el-table-column>
              <el-table-column
                v-if="searchForm.businessType === '1'"
                label="起运港已还柜"
                width="120"
              >
                <template slot-scope="scope">
                  {{ formatContain(scope.row, '255') }}
                </template>
              </el-table-column>
              <el-table-column
                v-if="searchForm.businessType === '1'"
                label="目的港已提柜"
                width="120"
              >
                <template slot-scope="scope">
                  {{ formatContain(scope.row, '256') }}
                </template>
              </el-table-column>
              <el-table-column
                v-if="searchForm.businessType === '1'"
                label="目的港已还柜"
                width="120"
              >
                <template slot-scope="scope">
                  {{ formatContain(scope.row, '257') }}
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="下单时间"
                width="180"
              />
              <el-table-column
                label="操作"
                fixed="right"
                width="250"
              >
                <template slot-scope="scope">
                  <el-button
                    v-permission="['bookingOrderView']"
                    type="text"
                    @click="viewData(scope.row)"
                  >
                    查看
                  </el-button>
                  <el-button
                    v-show="custType === '3' && scope.row.audit !== '1'"
                    type="text"
                    @click="auditData(scope.row)"
                  >
                    审核
                  </el-button>
                  <el-button
                    v-show="(custType === '3' || custType === '0') && scope.row.businessType !== '4'"
                    type="text"
                    @click="editData(scope.row)"
                  >
                    订单进度
                  </el-button>
                  <el-button
                    v-if="custType === '0' && !scope.row.supplierId"
                    type="text"
                    @click="viewSupperier(scope.row)"
                  >
                    指定供应商
                  </el-button>
                  <el-button
                    v-show="scope.row.status === '1' && $checkPermission(['bookingOrderCancel'])"
                    type="text"
                    @click="cancelData(scope.row)"
                  >
                    取消
                  </el-button>
                  <el-button
                    v-show="scope.row.status === '2' && $checkPermission(['bookingOrderDelete'])"
                    type="text"
                    @click="deleteData(scope.row)"
                  >
                    删除
                  </el-button>
                  <el-button
                    v-permission="['bookingOrderFinancial']"
                    type="text"
                    @click="showFinancial(scope.row)"
                  >
                    账单信息
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              v-if="tableData.length > 0"
              :current-page.sync="page"
              :page-size="size"
              layout="total, prev, pager, next"
              :total="total"
              style="text-align: right;"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
      <div
        v-show="showPage === 'financial'"
        class="app-container"
      >
        <order-financial
          ref="financial"
          @back="showPage = 'index'"
        />
      </div>
      <div
        v-show="showPage === 'detail'"
        class="app-container"
      >
        <detail
          ref="detailForm"
          :line-list="serviceList"
          @back="showPage = 'index'"
        />
      </div>
      <div
        v-show="showPage === 'collapse'"
        class="app-container"
      >
        <collapseItem
          ref="itemForm"
          :order-type="searchForm.orderType"
          :order-code="orderCode"
          @back="showPage = 'index'"
          @search="getTableData"
        />
      </div>
    </div>

    <el-dialog
      title="指定供应商"
      width="600px"
      :close-on-click-modal="false"
      :visible.sync="isSupperierVisible"
      @close="cancelSupperier"
    >
      <div v-loading="formLoading">
        <el-form
          ref="supperierForm"
          :model="supperierForm"
          :rules="rules"
          label-width="100px"
          size="small"
          style="padding-right: 20px;"
        >
          <el-form-item
            label="指派方式"
            prop="isDefault"
          >
            <el-select
              v-model="supperierForm.isDefault"
              placeholder="请选择"
              style="width:100%;"
              size="small"
              @change="onSupperType"
            >
              <el-option
                label="默认供应商"
                :value="1"
              />
              <el-option
                label="指定供应商"
                :value="0"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="供应商"
            prop="supplierId"
          >
            <el-input
              v-if="supperierForm.isDefault === 1"
              v-model="supperierForm.supplierName"
              placeholder="请输入"
              readonly
            />
            <el-select
              v-else-if="supperierForm.isDefault === 0"
              v-model="supperierForm.supplierId"
              placeholder="请选择"
              style="width:100%;"
              size="small"
              :loading="selectLoading"
              @focus="getCustTypeList"
            >
              <el-option
                v-for="item in supplierList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          style="text-align: right;padding-top: 20px;"
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
      </div>
    </el-dialog>

    <el-dialog
      title="审核状态"
      width="600px"
      :close-on-click-modal="false"
      :visible.sync="isAuditVisible"
      @close="cancelAudit"
    >
      <div v-loading="formLoading">
        <el-form
          ref="checkForm"
          :model="checkForm"
          :rules="checkRules"
          label-width="100px"
          size="small"
          style="padding-right: 20px;"
        >
          <el-form-item
            label="审核状态"
            prop="audit"
          >
            <el-radio-group
              v-model="checkForm.audit"
              @change="checkForm.reason = ''"
            >
              <el-radio :label="'1'">
                审核通过
              </el-radio>
              <el-radio :label="'2'">
                审核拒绝
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="checkForm.audit === '2'"
            label="拒绝原因"
          >
            <el-input
              v-model="checkForm.reason"
              type="textarea"
              :autosize="{minRows: 2, maxRows: 4}"
              placeholder="请输入"
            />
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          style="text-align: right;padding-top: 20px;"
        >
          <el-button
            size="small"
            @click="cancelAudit"
          >
            取 消
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="confirmAudit"
          >
            确 定
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'

import {
  getOrderList,
  getPortList,
  getSupplierList,
  getStatusList,
  getCustTypeList,
  getAgentList,
  getCustomerList,
  deleteOrder,
  cancelOrder,
  saveSupperier,
  saveAudit,
  getWordsList,
  getBSCList,
  getSubtypeByCustAndType,
  getSupperier
} from '@/api/orderlist-at-booking'
import { getBsTransList } from '@/api/service-with-booking-service'
import detail from '@/views/orderlist-management/booking-order/detail.vue'
import collapseItem from '@/views/orderlist-management/booking-order/collapseItem.vue'
import orderFinancial from '@/views/orderlist-management/booking-order/orderFinancial.vue'
import dayjs from 'dayjs'

@Component({
  name: '',
  components: {
    detail,
    collapseItem,
    orderFinancial
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private showPage: string = 'index'
  private isAuditVisible: boolean = false
  private loading: boolean = false
  private formLoading: boolean = false
  private isSupperierVisible: boolean = false
  private selectLoading: boolean = false
  private isEdit: boolean = false
  private companyTypeList: any[] = [
    { id: '1', name: '客户' },
    { id: '2', name: '二级代理商' }
  ]
  private orderTypeList: any[] = [
    { name: '销售订单', id: '0' },
    { name: '采购订单', id: '1' }
  ]

  private typeList = []
  private auditList = [
    { name: '待审核', id: '0' },
    { name: '审核通过', id: '1' },
    { name: '审核拒绝', id: '2' }
  ]

  private portList: any[] = []
  private serveceList: any[] = []
  private goodsList: any[] = [
    { name: '放货条款', id: '0' },
    { name: 'MBL电放', id: '1' },
    { name: 'MBL正本', id: '2' },
    { name: '货运单(SWB/AWB)', id: '3' },
    { name: 'MBL目的地放单', id: '4' }
  ]
  private serviceList: any[] = []
  private bsTransList: any[] = []
  private companyList: any[] = []
  private tableData: any[] = []
  private statusList: any[] = []
  private searchForm: any = {
    orderStatus: undefined,
    businessType: undefined,
    custId: undefined,
    portsToId: undefined,
    serverTerms: undefined,
    goodsClause: undefined,
    serviceId: undefined,
    orgId: undefined,
    comId: undefined,
    comType: '',
    orderType: '0',
    orderTime: []
  }
  private title = ''
  private customsId = ''
  private page: number = 1
  private size: number = 10
  private total: any = 0
  private orderCode: any = ''
  private keyword: any = ''
  private selectType: any = '1'
  private supperierForm: any = {
    supplierId: undefined,
    supplierName: undefined,
    isDefault: 1
  }
  private defaultObj: any = {}
  private rules: any = {
    isDefault: { required: true, message: '请选择指派方式', trigger: 'change' },
    supplierId: { required: true, message: '请选择供应商', trigger: 'change' }
  }
  private supplierList: any[] = []
  private checkForm: any = {
    audit: undefined,
    reason: undefined
  }
  private checkRules = {
    audit: [{ required: true, message: '请选择审核状态', trigger: 'change' }],
    reason: [{ required: true, message: '拒绝原因不能为空', trigger: 'blur' }]
  }

  /* computed */
  // 所属公司id
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
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
  get parentName(): string {
    const info = UserModule.info || {}
    const parentName = (info as any).parentName
    return parentName
  }

  /* methods */
  private showFinancial(row: any) {
    let code = ''
    if (row.businessType === '1') {
      code = row.soCode
    }
    if (row.businessType === '0') {
      code = row.billNo
    }
    if (!code) {
      this.$message.warning('暂无SO/提单号')
      return
    }
    this.showPage = 'financial'
    const root: any = this.$refs.financial
    root.show(row)
  }
  private formatStatus(row: any) {
    let name = ''
    this.statusList.map((it: any) => {
      if (it.key === row.orderStatus) {
        name = it.value
      }
    })
    return name
  }
  private formatContain(row: any, val: string) {
    const arr = (row || {}).containerStatus || []
    const brr = arr.filter((it: any) => it === val)
    return brr.length + '/' + arr.length
  }
  private getWordsList() {
    this.selectLoading = true
    const params:any = {
      type: 'server_terms'
    }
    getWordsList(params)
      .then((res: any) => {
        const data = res.data || []
        this.serveceList = data
        this.selectLoading = false
      }).catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private getStatusData() {
    this.selectLoading = true
    const params: any = {
      businessType: this.searchForm.businessType
    }
    getStatusList(params).then((res: any) => {
      this.statusList = res.data || []
      this.selectLoading = false
    }).catch(() => {
      this.statusList = []
      this.selectLoading = false
    })
  }
  private getBsService(): void {
    this.selectLoading = true
    const params: any = {
      model: {
        conveyance: this.searchForm.businessType
      },
      page: 1,
      size: 9999
    }
    getBSCList(params)
      .then((res: any) => {
        this.selectLoading = false
        const data = res.data || {}
        this.serviceList = data.result || []
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private getBsTransList() {
    const params = {
      page: 1,
      size: 999,
      model: {
        id: this.searchForm.serviceId
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

  private onOrderType() {
    this.tableData = []
    if (this.searchForm.orderType === '1') {
      this.searchForm.comType = ''
      this.searchForm.comId = ''
      this.companyList = []
    }
    if (!this.searchForm.businessType) return
    this.getTableData(1)
  }
  private onComType() {
    // 仅一级代理商可操作
    this.searchForm.comId = ''
    this.companyList = []
    this.tableData = []
  }
  private onCompany() {
    this.tableData = []
    if (!this.searchForm.businessType) return
    this.getTableData(1)
  }
  private getCompanyList() {
    const params:any = {
      page: 1,
      size: 9999
    }
    const type = (this as any).custType
    const subType = (this as any).custSubtype
    let func:any = null
    if (type === '2' && (this.searchForm.comType === '1' || subType === '2')) {
      params.custIds = [(this as any).custId]
      func = getCustomerList
    } else if (type === '2' && this.searchForm.comType === '2') {
      params.parentId = this.custId
      params.subtype = '2'
      params.types = '02'
      func = getAgentList
    } else if (type === '0') {
      params.parentId = this.custId
      params.subtype = '1'
      params.types = '02'
      func = getAgentList
    } else {
      this.companyList = []
      return
    }
    this.selectLoading = true
    func(params).then((res:any) => {
      if (type === '2' && (this.searchForm.comType === '1' || subType === '2')) {
        const data = res.data || []
        this.companyList = data
      } else {
        const data = res.data || {}
        this.companyList = data.result || []
      }
      this.selectLoading = false
    }).catch((err:any) => {
      this.selectLoading = false
      return err
    })
  }
  private getSubtypeData() {
    this.selectLoading = true
    const cId = (this as any).custId
    const params = {
      custId: cId,
      typeId: '02'
    }
    getSubtypeByCustAndType(params).then((res: any) => {
      if (res.success) {
        this.typeList = res.data || []
      }
      this.selectLoading = false
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }

  // 获取港口列表
  private getPortList() {
    this.selectLoading = true
    const params: any = {
      page: 1,
      size: 9999,
      type: this.searchForm.businessType
    }
    getPortList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.portList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private onBusiness() {
    this.searchForm.serviceId = undefined
    this.searchForm.orderStatus = undefined
    this.selectType = '1'
    this.statusList = []
    this.serviceList = []
    this.tableData = []
    if (!this.searchForm.businessType) return
    this.getStatusData()
    this.getTableData(1)
  }
  private onSupperType() {
    this.supperierForm.supplierId = undefined
    this.supperierForm.supplierName = undefined
    if (this.supperierForm.isDefault === 1) {
      const { id, name } = this.defaultObj
      this.supperierForm.supplierId = id
      this.supperierForm.supplierName = name
    }
  }
  private getCustTypeList() {
    const params = {
      page: 1,
      size: 9999,
      cas: 'S',
      typeId: '06',
      subtypeId: this.supperierForm.subtypeId
    }
    return getCustTypeList(params).then((res: any) => {
      const data = res.data || {}
      const result = data.result || []
      this.supplierList = JSON.parse(
        JSON.stringify(result)
          .replace(/custName/g, 'name')
          .replace(/custId/g, 'id')
      )
    }).catch((err: any) => {
      return err
    })
  }

  private viewSupperier(row: any) {
    this.isSupperierVisible = true
    this.supperierForm.id = row.id
    this.supperierForm.subtypeId = row.businessType
    this.formLoading = true
    getSupperier({
      id: row.bsId
    }).then((res: any) => {
      const data = res.data || {}
      this.defaultObj = {
        id: data.custId,
        name: data.custName
      }
      const { id, name } = this.defaultObj
      this.supperierForm.supplierId = id
      this.supperierForm.supplierName = name
      this.formLoading = false
    }).catch((err: any) => {
      this.formLoading = false
      return err
    })
  }

  private confirmSupperier(row: any): void {
    const form: any = this.$refs.supperierForm
    form.validate((valid: any) => {
      if (!valid) return false
      this.formLoading = false
      if (this.supperierForm.isDefault === 0) {
        this.supplierList.map((it: any) => {
          if (this.supperierForm.supplierId === it.id) {
            this.supperierForm.supplierName = it.name
          }
        })
      }
      saveSupperier(this.supperierForm)
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.formLoading = false
          this.isSupperierVisible = false
          this.getTableData()
        }).catch((err: any) => {
          this.formLoading = false
          return err
        })
    })
  }

  private cancelSupperier() {
    this.isSupperierVisible = false
    this.resetSupperierForm()
  }

  // 重置表单
  private resetSupperierForm() {
    this.supperierForm = {
      supplierId: undefined,
      supplierName: undefined,
      isDefault: 1
    }
    const root: any = this.$refs.supperierForm
    root.clearValidate()
  }

  private viewData(row: any) {
    // 查看
    this.showPage = 'detail'
    const root: any = this.$refs.detailForm
    root.setData(row)
  }
  private auditData(row: any) {
    // 审核
    this.isAuditVisible = true
    this.checkForm.audit = row.audit || '0'
    this.checkForm.reason = row.reason
    this.checkForm.bookingId = row.id
  }
  private cancelAudit() {
    this.resetCheckForm()
  }
  private confirmAudit() {
    const formDom:any = this.$refs.checkForm
    formDom.validate((valid:any) => {
      if (!valid) return false
      this.formLoading = true
      saveAudit(this.checkForm)
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.formLoading = false
          this.resetCheckForm()
          this.getTableData()
        })
        .catch((err: any) => {
          this.formLoading = false
          return err
        })
    })
  }
  private resetCheckForm() {
    this.isAuditVisible = false
    this.checkForm = {
      audit: undefined,
      reason: undefined
    }
    const root: any = this.$refs.checkForm
    root.clearValidate()
  }
  private editData(row: any) {
    this.showPage = 'collapse'
    this.orderCode = row.markNo
    const root: any = this.$refs.itemForm
    root.setData(row)
  }
  private cancelData(row: any) {
    const params = {
      bookingId: row.id
    }
    this.$confirm('请确认是否取消该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        cancelOrder(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '取消成功'
            })
            this.getTableData()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }
  private deleteData(row: any) {
    const params = {
      bookingId: row.id
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteOrder(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getTableData()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }

  // 列表查询
  private getTableData(val?: any): void {
    this.loading = true
    const type = (this as any).custType
    if (type === '1') { // 客户
      this.searchForm.orderType = '1'
    } else if (type === '3') { // 供应商
      this.searchForm.orderType = '0'
    }

    const { comId, comType, custId, orderTime, orderType, businessType, ...form }: any = this.searchForm
    if (!businessType) {
      this.tableData = []
      this.$message.error('请选择业务类型')
      this.loading = false
      return
    }
    if (val) {
      this.page = val
    }
    const params: any = {
      page: this.page,
      size: this.size,
      model: {
        ...form,
        orderType,
        businessType,
        markNo: this.selectType === '1' && this.keyword ? this.keyword : undefined,
        so: this.selectType === '2' && this.keyword ? this.keyword : undefined,
        containerNo: this.selectType === '3' && this.keyword ? this.keyword : undefined,
        billNo: this.selectType === '4' && this.keyword ? this.keyword : undefined,
        airNo: this.selectType === '5' && this.keyword ? this.keyword : undefined,
        custId: (this as any).custId,
        custType: (this as any).custType,
        targetId: comId || undefined
      }
    }
    if (Array.isArray(orderTime) && orderTime.length > 0) {
      params.model.startTime = orderTime[0]
      params.model.endTime = orderTime[1]
    }
    getOrderList(params)
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

  // 分页
  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.getTableData()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.getTableData()
  }
  private async created() {
    this.searchForm.custId = (this as any).custId
    this.searchForm.orderTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    this.getSubtypeData()
  }
}
</script>

<style lang="scss" scoped>
</style>
