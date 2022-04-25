<template>
  <div
    class="output-form"
    style="display: flex;flex-flow: row nowrap;min-height: inherit;"
  >
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        v-show="!detailShow"
        class="app-container"
      >
        <head-info
          info=""
          title="出库申请单"
        />
        <div class="app-panel">
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-select
                v-if="custType === '0' || custType === '2'"
                v-model="searchForm.orderType"
                placeholder="订单类型"
                style="width:130px;margin-right:5px;"
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
                v-if="custType === '0' || (custType === '2' && searchForm.orderType === '0')"
                v-model="searchForm.custId"
                :loading="selectLoading"
                placeholder="申请公司"
                size="small"
                clearable
                filterable
                style="width:130px;margin-right:5px;"
                @change="onCompany"
                @focus="getCompanyList"
              >
                <el-option
                  v-for="(item, index) in companyList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-input
                v-model="searchForm.code"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
                placeholder="原单号"
              />
              <el-select
                v-model="searchForm.warehouseId"
                :loading="selectLoading"
                placeholder="仓库名称"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
                @focus="getWarehouseList"
              >
                <el-option
                  v-for="(item, index) in warehouseList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="searchForm.audit"
                placeholder="审核状态"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
              >
                <el-option
                  label="待审核"
                  value="0"
                />
                <el-option
                  label="审核通过"
                  value="1"
                />
                <el-option
                  label="审核拒绝"
                  value="2"
                />
              </el-select>
              <el-select
                v-model="searchForm.status"
                placeholder="订单状态"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="searchForm.type"
                placeholder="出库类型"
                size="small"
                style="width:130px;margin-right:5px;"
                @change="handleSearch(1)"
              >
                <el-option
                  label="发货出库"
                  value="0"
                />
                <el-option
                  label="调拨出库"
                  value="1"
                />
                <el-option
                  label="退件出库"
                  value="2"
                />
              </el-select>
              <el-select
                v-model="searchForm.sourceType"
                placeholder="服务类型"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
              >
                <el-option
                  label="一件代发"
                  value="0"
                />
                <el-option
                  label="仓储"
                  value="1"
                />
                <el-option
                  label="散收拼货"
                  value="2"
                />
                <el-option
                  label="拆柜打托"
                  value="3"
                />
              </el-select>
              <el-date-picker
                v-model="searchForm.applyTime"
                :clearable="false"
                unlink-panels
                type="daterange"
                align="right"
                size="small"
                value-format="yyyy-MM-dd"
                range-separator="~"
                style="width:240px;margin-right:10px;"
                start-placeholder="申请起始时间"
                end-placeholder="申请截止时间"
              />

              <el-button
                v-permission="['warehouseInspectionQuery']"
                type="primary"
                size="small"
                @click="handleSearch(1)"
              >
                查询
              </el-button>
            </el-col>
          </el-row>

          <el-table
            ref="table"
            v-loading="loading"
            :data="tableData"
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              fixed="left"
              prop="id"
              label="出库申请单/订单号"
              min-width="140px"
              show-overflow-tooltip
            />
            <el-table-column
              fixed="left"
              prop="audit"
              label="审核状态"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.audit === '0'">待审核</span>
                <span v-else-if="scope.row.audit === '1'">审核通过</span>
                <span v-else-if="scope.row.audit === '2'">审核拒绝</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              label="订单状态"
            >
              <template slot-scope="scope">
                <span>{{ formatDict(scope.row.status, statusList) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="type"
              label="出库类型"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.type === '0'">发货出库</span>
                <span v-else-if="scope.row.type === '1'">调拨出库</span>
                <span v-else-if="scope.row.type === '2'">退件出库</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="sourceType"
              label="服务类型"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.sourceType === '0'">一件代发</span>
                <span v-else-if="scope.row.sourceType === '1'">仓储</span>
                <span v-else-if="scope.row.sourceType === '2'">散收拼货</span>
                <span v-else-if="scope.row.sourceType === '3'">拆柜打托</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="packages"
              label="总箱数"
            />
            <el-table-column
              prop="volumes"
              label="总体积"
              min-width="140"
            >
              <template slot-scope="scope">
                <span>{{ maxVolWeiFormat(scope.row, 'CBM') }}</span>&nbsp;
                <span>CBM</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="weights"
              label="总重量"
              min-width="140"
            >
              <template slot-scope="scope">
                <span>{{ maxVolWeiFormat(scope.row, 'KGS') }}</span>&nbsp;
                <span>KGS</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="deliveryDesc"
              label="车/柜型"
              min-width="130"
            />
            <el-table-column
              prop="executorName"
              label="操作人"
              width="150"
            />
            <el-table-column
              prop="applicationName"
              label="申请人"
              width="150"
            />
            <el-table-column
              prop="loadTime"
              label="装载时间"
              width="170"
            />
            <el-table-column
              prop="createTime"
              label="创建时间"
              width="170"
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="220"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['warehouseOutOrderView']"
                  type="text"
                  @click="handleDetail(scope.row)"
                >
                  查看
                </el-button>
                <el-button
                  v-if="scope.row.audit === '0' && searchForm.orderType === '0' && $checkPermission(['warehouseOutOrderAudit'])"
                  type="text"
                  @click="handleAudit(scope.row)"
                >
                  审核
                </el-button>
                <el-button
                  v-if="scope.row.audit === '2' && searchForm.orderType === '1' && $checkPermission(['warehouseOutOrderReset'])"
                  type="text"
                  @click="handleReset(scope.row)"
                >
                  重新提交
                </el-button>
                <!-- <el-button
                  v-if="scope.row.audit === '1' && searchForm.orderType === '0' && custType !== '3' && !scope.row.transfered && $checkPermission(['warehouseOutOrderUpLevel'])"
                  type="text"
                  @click="handleUpLevel(scope.row)"
                >
                  流转订单
                </el-button> -->
                <el-button
                  v-if="scope.row.status !== '2' && scope.row.status !== '9' && custType === '3' && $checkPermission(['warehouseOutOrderComplete'])"
                  type="text"
                  @click="handleStatus(scope.row)"
                >
                  完成出库
                </el-button>
                <!-- <el-button
                  v-if="scope.row.audit === '1' && searchForm.type === '1' && ['0', '3'].includes(custType)"
                  type="text"
                  @click="handleExport(scope.row)"
                >
                  导出
                </el-button> -->
                <el-button
                  v-if="['0', '3'].includes(custType)"
                  type="text"
                  @click="handleOutport(scope.row)"
                >
                  导出
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
        </div>
      </div>
      <div
        v-show="detailShow"
        class="app-container"
      >
        <detail
          ref="detailForm"
          @back="goBack"
        />
      </div>
      <el-dialog
        title="审核订单"
        :visible.sync="dialogAudit"
        width="600px"
        @closed="handleCancel"
      >
        <div
          v-loading="dialogLoading"
        >
          <el-form
            ref="theForm"
            :model="auditForm"
            :rules="formRules"
            label-width="90px"
            label-position="right"
            size="small"
          >
            <el-form-item
              label="审核结果"
              prop="audit"
            >
              <el-radio-group v-model="auditForm.audit">
                <el-radio
                  label="1"
                >
                  通过
                </el-radio>
                <el-radio
                  label="2"
                >
                  拒绝
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="auditForm.audit === '2'"
              label="拒绝原因"
              prop="reason"
            >
              <el-input
                v-model="auditForm.reason"
                :autosize="{minRows: 2, maxRows: 4}"
                type="textarea"
                :maxlength="100"
                placeholder="请输入"
              />
            </el-form-item>
          </el-form>
          <div
            style="text-align: right;padding-top: 10px;"
          >
            <el-button
              type="primary"
              size="small"
              @click="handleSubmit"
            >
              提交
            </el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import detail from './detail.vue'
import {
  getOutputList,
  setOutputAudit,
  setOutputOrder,
  changeOutputStatus,
  getCustomerList,
  getAgentList,
  getSupplierList,
  getWHList,
  allocationExport,
  allocationOutport
} from '@/api/warehose-by-config'
import dayjs from 'dayjs'
import { getStatusList } from '@/api/public'

@Component({
  name: 'Output',
  components: {
    detail
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private searchForm: any = {
    orderType: '0',
    sourceType: '',
    code: '', // 原单号
    warehouseId: '', // 仓库
    buyerId: '', // 申请公司
    sellerId: '', // 申请公司
    audit: '', // 状态
    applyTime: '', // 申请时间
    startDate: '',
    endDate: '',
    type: '0'
  }
  private auditForm: any = {
    audit: '',
    reason: ''
  }
  private auditObj: any = {}
  private formRules = {
    audit: { required: true, message: '请选择审核结果', trigger: 'change' }
  }
  private orderTypeList: any[] = [
    { name: '销售订单', id: '0' },
    { name: '采购订单', id: '1' }
  ]
  private companyList: any[] = []
  private warehouseList: any[] = []
  private statusList: any[] = []
  private startOptions: any = []
  private purposeOptions: any = []
  private tableData: any = []
  private total = 0
  private page = 1
  private size = 10
  private loading = false
  private detailShow: boolean = false
  private dialogAudit: boolean = false
  private dialogLoading: boolean = false
  private selectLoading: boolean = false

  // computed
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
  private downXsl(name: string, res: any) {
    const a = document.createElement('a')
    document.body.appendChild(a)
    const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    const objUrl = URL.createObjectURL(blob)
    a.href = objUrl
    a.download = name + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.xls'
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(objUrl)
  }
  private handleExport(row: any) {
    if (!row.taskId) return
    this.loading = true
    allocationExport({ id: row.taskId }).then((res: any) => {
      const name = row.taskId + '调拨申请单'
      this.loading = false
      this.downXsl(name, res)
    }).catch((err: any) => {
      this.loading = false
      err.data.text().then((text: any) => {
        try {
          const resData = JSON.parse(text)
          if (resData.code !== 200) {
            this.$message.error(resData.msg || '文件下载失败')
          }
        } catch (e) {
          return e
        }
      })
    })
  }
  private handleOutport(row: any) {
    const str = this.searchForm.type === '0' ? '发货申请单' : this.searchForm.type === '1' ? '调拨申请单' : '退件申请单'
    this.loading = true
    allocationOutport({ id: row.id }).then((res: any) => {
      const name = row.id + str
      this.loading = false
      this.downXsl(name, res)
    }).catch((err: any) => {
      this.loading = false
      err.data.text().then((text: any) => {
        try {
          const resData = JSON.parse(text)
          if (resData.code !== 200) {
            this.$message.error(resData.msg || '文件下载失败')
          }
        } catch (e) {
          return e
        }
      })
    })
  }
  private maxVolWeiFormat(row: any, unit: string) {
    const um = row.um || {}
    const umVolume = um.umVolume ? um.umVolume : (this as any).$getVolumeUnitByLengthUnit(um.umLength)
    if (unit === 'CBM') {
      return (this as any).$volumeConversion((row.volumes || 0), umVolume, 'CBM', 3)
    } else if (unit === 'KGS') {
      return (this as any).$volumeConversion((row.weights || 0), um.umWeight, 'KGS', 3)
    }
  }
  private async getStatusList() {
    await getStatusList().then((res: any) => {
      this.statusList = (res.data || []).map((e: any) => {
        return {
          label: e.name,
          id: e.key,
          type: e.type
        }
      }).filter((s: any) => s.type === 'WS_OUT')
    }).catch(() => {
      this.statusList = []
    })
  }
  private formatDict(val: any, list: any[]) {
    const tamp = list.find(e => e.id === val)
    return tamp ? tamp.label : '--'
  }

  private goBack() {
    this.detailShow = false
    this.tableData = []
    this.handleSearch()
  }
  private setTable() {
    this.$nextTick(() => {
      const root: any = this.$refs.table
      root.doLayout() // 解决表格错位
    })
  }
  private onOrderType() {
    this.tableData = []
    this.searchForm.custId = ''
    this.handleSearch(1)
  }
  private onCompany() {
    this.handleSearch(1)
  }
  private getCompanyList() {
    const params:any = {
      page: 1,
      size: 99999
    }
    const params2:any = {
      page: 1,
      size: 99999
    }
    let func:any = null
    let func2: any = null
    const ctype = (this as any).custType
    const cstype = (this as any).custSubtype
    if (ctype === '0' && this.searchForm.orderType === '0') { // 聚货通卖
      params.parentId = this.custId
      params.subtype = '1'
      func = getAgentList
    } else if (ctype === '0' && this.searchForm.orderType === '1') { // 聚货通买
      func = getSupplierList
    } else if (ctype === '2' && cstype === '1' && this.searchForm.orderType === '0') { // 一级代理商卖
      params.parentId = this.custId
      params.subtype = '2'
      params2.custIds = [(this as any).custId]
      func = getAgentList
      func2 = getCustomerList
    } else if (ctype === '2' && cstype === '2' && this.searchForm.orderType === '0') { // 二级代理商卖
      params.custIds = [(this as any).custId]
      func = getCustomerList
    } else {
      this.companyList = []
      return
    }
    this.selectLoading = true
    Promise.all([
      func(params).then((res: any) => res.data.result || res.data),
      func2 ? func2(params2).then((res: any) => res.data.result || res.data) : null
    ]).then((res:any) => {
      const data = res || []
      if (Array.isArray(data[1])) {
        this.companyList = [...data[0], ...data[1]]
      } else {
        this.companyList = data[0] || []
      }
      this.selectLoading = false
    }).catch((err:any) => {
      this.selectLoading = false
      return err
    })
  }
  private getWarehouseList() {
    this.selectLoading = true
    const params = {
      model: {
        custId: (this as any).custId
      },
      page: 1,
      size: 9999
    }
    getWHList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.warehouseList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private handleSearch(val?: any): void {
    // 查询
    this.loading = true
    const { applyTime, orderType, custId, ...obj } = this.searchForm
    if (Array.isArray(applyTime) && applyTime.length > 0) {
      obj.startDate = applyTime[0]
      obj.endDate = applyTime[1]
    }
    if (val) {
      this.page = val
    }
    const params: any = {
      model: obj,
      size: this.size,
      page: this.page
    }
    const ctype = (this as any).custType
    const cId = (this as any).custId
    const cstype = (this as any).custSubtype
    const pId = (this as any).parentId
    if (this.searchForm.orderType === '1') { // 买
      params.model.sellerId = ctype === '2' && cstype === '1' ? '0' : ctype === '2' && cstype === '2' ? pId : custId
      params.model.buyerId = cId
    } else if (this.searchForm.orderType === '0') { // 卖
      params.model.sellerId = cId // 当前账号
      params.model.buyerId = ctype === '3' ? '0' : custId // 申请公司
    }

    getOutputList(params)
      .then((res: any) => {
        const data = res.data || {}
        const arr = data.result || []
        arr.map((it: any) => {
          const arrC = it.custList || []
          arrC.map((c: any) => {
            if (this.searchForm.orderType === '1' && cId === c.custId) {
              it.audit = c.audit
            } else if (this.searchForm.orderType === '0' && cId === c.parentId) {
              it.audit = c.audit
            }
          })
        })
        this.tableData = arr
        this.total = data.total
        this.setTable()
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return [null, err]
      })
  }
  private handleAudit(row: any): void {
    // 审核
    this.dialogAudit = true
    const { audit, reason, id, buyerType } = row
    this.auditForm = {
      audit: null, orderId: id, reason, buyerType
    }
  }
  private async handleStatus(row: any) {
    const [cancel, confirm] = await this.$confirm(
      `此操作将完成该出库订单，是否继续？`,
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
    if (cancel) return
    this.loading = true
    const { id, status } = row
    changeOutputStatus({
      id, status: '2'
    })
      .then((res: any) => {
        this.loading = false
        this.$message({
          type: 'success',
          message: '提交成功'
        })
        this.handleSearch()
      }).catch((err: any) => {
        this.loading = false
        return [err, null]
      })
  }
  private handleReset(row: any) {
    this.loading = true
    this.auditForm = {
      audit: '0', orderId: row.id, buyerType: row.buyerType
    }
    setOutputAudit(this.auditForm)
      .then((res: any) => {
        this.loading = false
        this.$message({
          type: 'success',
          message: '提交成功'
        })
        this.handleSearch()
      }).catch((err: any) => {
        this.loading = false
        return [err, null]
      })
  }
  private handleCancel() {
    this.dialogAudit = false
    this.dialogLoading = false
    this.auditObj = {}
    this.auditForm = {
      audit: '',
      reason: ''
    }
    const root: any = this.$refs.theForm
    this.$nextTick(() => {
      root.clearValidate()
    })
  }
  private handleSubmit() {
    // 提交
    const theForm: any = this.$refs.theForm
    theForm.validate((valid: any) => {
      if (!valid) return false
      this.dialogLoading = true
      if (this.auditForm.audit === '1') {
        this.auditForm.reason = ''
      }
      const params = {
        ...this.auditForm,
        sellerType: this.custType
      }
      // sellerType后台做了校验，暂且取当前登录账号的企业类型
      setOutputAudit(params)
        .then((res: any) => {
          this.dialogLoading = false
          this.$message({
            type: 'success',
            message: '提交成功'
          })
          this.handleCancel()
          this.handleSearch()
        }).catch((err: any) => {
          this.dialogLoading = false
          return [err, null]
        })
    })
  }
  private async handleUpLevel(row: any) {
    const [cancel, confirm] = await this.$confirm(
      `此操作将流转该出库订单，是否继续？`,
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
    if (cancel) return
    this.loading = true
    const type = (this as any).custType
    const stype = (this as any).custSubtype
    let buyerType
    if (type === '0') {
      buyerType = '3' // 聚货通
    } else if (type === '1') {
      buyerType = '0' // 客户
    } if (type === '2' && stype === '1') {
      buyerType = '1' // 一级代理
    } else if (type === '2' && stype === '2') {
      buyerType = '2' // 二级代理
    }
    let sellerId
    let sellerName
    if (type === '0') {
      this.warehouseList.map((it: any) => {
        if (row.warehouseId === it.id) {
          sellerId = it.custId
          sellerName = it.custName
        }
      })
    } else {
      sellerId = (this as any).parentId
      sellerName = (this as any).parentName
    }
    const { id } = row
    const params = {
      buyerType, orderId: id, sellerId, sellerName
    }
    // 审核通过流转到上级
    setOutputOrder(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '订单流转成功'
        })
        this.handleSearch()
      }).catch((err: any) => {
        this.loading = false
        return [err, null]
      })
  }
  private handleDetail(row: any): void {
    // 查看详情
    this.detailShow = true
    const root: any = this.$refs.detailForm
    root.setData(row)
  }
  private handleSizeChange(size: any): void {
    // 页码
    this.size = size
    this.handleSearch()
  }
  private handleCurrentChange(page: any): void {
    // 页数
    this.page = page
    this.handleSearch()
  }
  private async created() {
    this.searchForm.applyTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    await this.getStatusList()
    this.handleSearch()
    this.getWarehouseList()
  }
}
</script>

<style lang="scss" scoped>
</style>
