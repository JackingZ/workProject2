<template>
  <div
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
        <div class="finance-header">
          <div style="width: 100px;color: #909399;font-weight: 400;font-size: 16px;">
            应付款
          </div>
          <div style="width: 130px;">
            <el-select
              v-model="searchForm.serviceTypeId"
              :loading="selectLoading"
              placeholder="服务大类"
              size="small"
              filterable
              style="width:100%;"
              @change="handleService"
            >
              <el-option
                v-for="item in serviceList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
          <div style="flex: 1;text-align: right;">
            <el-button
              v-show="searchForm.serviceTypeId === '05'"
              :loading="excelLoading"
              type="primary"
              size="small"
              @click="handleExport"
            >
              导出当前数据
            </el-button>
            <el-button
              v-show="searchForm.serviceTypeId === '05'"
              :loading="exportLoading"
              type="primary"
              size="small"
              @click="handleExport2"
            >
              导出明细
            </el-button>
          </div>
        </div>
        <div
          v-loading="loading"
          class="app-panel"
        >
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-button
                v-if="custType !== '3' && $checkPermission(['finaPaymentAdd'])"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="float: left;"
                @click="handleAdd"
              >
                新增应付款
              </el-button>
              <el-select
                v-if="(custType === '2' && custSubtype === '1')"
                v-model="searchForm.comType"
                size="small"
                style="width:100px;margin-right:5px;"
                placeholder="公司类型"
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
                v-if="searchForm.comType === '2'"
                v-model="searchForm.comId"
                :loading="selectLoading"
                size="small"
                style="width:170px;margin-right:5px;"
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
                v-model="searchForm.status"
                placeholder="状态"
                size="small"
                clearable
                style="width:100px;margin-right:5px;"
              >
                <el-option
                  v-for="(item, index) in statusList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="searchForm.ifVerify"
                placeholder="核销状态"
                size="small"
                clearable
                style="width:100px;margin-right:5px;"
              >
                <el-option
                  label="已核销"
                  value="1"
                />
                <el-option
                  label="未核销"
                  value="0"
                />
              </el-select>
              <el-date-picker
                v-model="time"
                type="daterange"
                unlink-panels
                align="right"
                size="small"
                range-separator="~"
                value-format="yyyy-MM-dd"
                style="width: 240px;margin-right:5px;"
                start-placeholder="发票起期"
                end-placeholder="发票止期"
              />
              <el-input
                v-model="keyWord"
                placeholder="请输入内容"
                class="input-with-select"
                style="width:250px;margin-right: 10px;"
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
                    v-show="!['02','06'].includes(searchForm.serviceTypeId)"
                    label="原单号"
                    value="1"
                  />
                  <el-option
                    label="开票企业"
                    value="2"
                  />
                  <el-option
                    v-show="['02'].includes(searchForm.serviceTypeId)"
                    label="提单号"
                    value="4"
                  />
                  <el-option
                    v-show="['02', '06'].includes(searchForm.serviceTypeId)"
                    label="SO号"
                    value="5"
                  />
                  <el-option
                    v-show="['02'].includes(searchForm.serviceTypeId)"
                    label="柜号"
                    value="6"
                  />
                </el-select>
              </el-input>
              <el-button
                v-permission="['finaPaymentQuery']"
                type="primary"
                size="small"
                @click="handleSearch(1)"
              >
                查询
              </el-button>
            </el-col>
          </el-row>

          <div style="height: 680px;">
            <vxe-table
              v-if="tableData.length"
              :data="tableData"
              :auto-resize="true"
              height="640"
              style="width: 100%;margin: 10px 0;"
              border
              resizable
              size="small"
              @checkbox-change="rowSelectChange"
            >
              <vxe-table-column
                fixed="left"
                type="checkbox"
                width="55"
              />
              <vxe-table-column
                :visible="searchForm.serviceTypeId !== '02' && searchForm.serviceTypeId !== '06'"
                fixed="left"
                width="160"
                title="原单号"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.orderCode }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column
                fixed="left"
                :visible="searchForm.serviceTypeId === '02' || searchForm.serviceTypeId === '06'"
                width="160"
                title="SO号"
              >
                <template slot-scope="scope">
                  <span>{{ (scope.row.soNoList || []).join(',') }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column
                :visible="searchForm.serviceTypeId === '02'"
                width="160"
                title="提单号"
              >
                <template slot-scope="scope">
                  <span>{{ (scope.row.billNoList || []).join(',') }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column
                :visible="searchForm.serviceTypeId === '02'"
                width="160"
                title="航空单号"
              >
                <template slot-scope="scope">
                  <span>{{ (scope.row.airNoList || []).join(',') }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column
                :visible="searchForm.serviceTypeId === '02'"
                width="160"
                title="柜号"
              >
                <template slot-scope="scope">
                  <span>{{ (scope.row.containerNoList || []).join(',') }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column
                title="状态"
                width="100"
              >
                <template slot-scope="scope">
                  <span>{{ (statusList.find(e => e.id === scope.row.status) || {}).name }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column
                title="核销状态"
                width="100"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.ifVerify === 1">已核销</span>
                  <span v-if="scope.row.ifVerify === 0">未核销</span>
                </template>
              </vxe-table-column>
              <vxe-table-column
                title="发票日期"
                width="160"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.invDate }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column
                title="开票企业"
                min-width="200"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.agentName }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column
                prop="currencyName"
                title="货币"
                width="120"
              >
                <template slot-scope="scope">
                  <span>{{ `${scope.row.currencyName || ''}${scope.row.currencyId || ''}` }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column
                min-width="100"
                title="金额"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.amount }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column
                width="170"
                title="创建时间"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.createTime }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column
                width="170"
                title="截止付款时间"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.cutoffTime }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column
                width="110"
                title="逾期天数"
              >
                <template slot-scope="scope">
                  <span>{{ formatterCutoffTime(scope.row) }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column
                fixed="right"
                title="操作"
                width="200"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.ifVerify === 0 && scope.row.status !== '3' && $checkPermission(['finaPaymentUpdate'])"
                    type="text"
                    @click="handleEdit(scope.row)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    v-if="scope.row.ifVerify === 0 && $checkPermission(['finaPaymentDel'])"
                    type="text"
                    @click="handleDelete(scope.row.id)"
                  >
                    删除
                  </el-button>
                  <el-button
                    v-permission="['finaPaymentDetail']"
                    type="text"
                    @click="handleDetail(scope.row.id)"
                  >
                    查看详情
                  </el-button>
                  <el-button
                    v-if="scope.row.status !== '1' && $checkPermission(['finaPaymentAudit'])"
                    type="text"
                    @click="handleAudit(scope.row, scope.$index)"
                  >
                    审核
                  </el-button>
                <!-- <el-button
                  type="text"
                  @click="handleDeduct(scope.row)"
                >
                  申请抵扣
                </el-button>
                <el-button
                  type="text"
                  @click="handleAdjust(scope.row)"
                >
                  申请调校
                </el-button>
                <el-button
                  type="text"
                  @click="handlePass(scope.row)"
                >
                  通过
                </el-button>
                <el-button
                  type="text"
                  @click="handleRefuse(scope.row)"
                >
                  拒绝
                </el-button> -->
                <!-- <el-button
                  type="text"
                  @click="handleResubmit(scope.row)"
                >
                  重新提交
                </el-button> -->
                </template>
              </vxe-table-column>
            </vxe-table>
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
      </div>
      <div
        v-show="detailShow"
        class="app-container"
      >
        <detail
          ref="detailForm"
          :is-add="isAdd"
          :is-view="isView"
          :is-edit="isEdit"
          :is-once="isOnce"
          :status-list="statusList"
          @back="detailShow = false"
          @getTableData="handleSearch"
        />
      </div>

      <el-dialog
        title="订单详情"
        :visible.sync="moreShow"
        :close-on-click-modal="false"
        width="800px"
        @closed="moreShow = false;"
      >
        <orderInfo
          :order-form="orderForm"
          :status-list="statusList"
          :subtype-list="subtypeList"
          :loading="dialogLoading"
        />
      </el-dialog>
      <el-dialog
        title="申请调校"
        :visible.sync="dialogAdjust"
        :close-on-click-modal="false"
        width="600px"
        @closed="dialogAdjust = false;"
      >
        <adjust />
      </el-dialog>
      <el-dialog
        title="申请抵扣"
        :visible.sync="dialogDeduct"
        :close-on-click-modal="false"
        width="1000px"
        @closed="dialogDeduct = false;"
      >
        <deduct />
      </el-dialog>
      <el-dialog
        title="发票审核"
        :visible.sync="dialogAudit"
        :close-on-click-modal="false"
        width="700px"
      >
        <div v-loading="dialogLoading">
          <el-form
            ref="auditForm"
            :model="auditForm"
            :rules="auditFormRules"
            label-width="110px"
            style="padding-top: 20px;"
            size="small"
          >
            <el-form-item
              label="审核"
              prop="status"
            >
              <el-radio-group
                v-model="auditForm.status"
              >
                <el-radio label="1">
                  通过
                </el-radio>
                <el-radio label="2">
                  拒绝
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div
            style="text-align: right;padding-top: 10px;"
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import orderInfo from '@/views/financial-management/invoice-receivable/orderInfo.vue'
import drawer from '@/components/Drawer/drawer.vue'
import detail from '@/views/financial-management/invoice-payable/detail.vue'
import adjust from '@/views/financial-management/invoice-receivable/adjust.vue'
import deduct from '@/views/financial-management/invoice-receivable/deduct.vue'
import { getTypeTemplateList } from '@/api/operation-of-service-setup'
import {
  getInvoiceList,
  getInvoiceExcel,
  getInvoiceExport,
  deleteInvoice,
  auditInvoice,
  getUnFinanceAgentList,
  getInvoiceById,
  getSupplierList,
  getAllServiceType
} from '@/api/financial-at-invoice-order'
import dayjs from 'dayjs'

@Component({
  name: '',
  components: {
    orderInfo,
    drawer,
    detail,
    adjust,
    deduct
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private searchForm: any = {
    serviceTypeId: '02',
    comType: undefined,
    comId: undefined,
    code: undefined,
    agentName: undefined,
    endDate: undefined,
    orderId: undefined,
    startDate: undefined,
    status: undefined,
    tax: undefined
  }
  private auditForm: any = {
    id: '',
    status: '1',
    note: ''
  }
  private auditFormRules: any = {
    status: [{ required: true, message: '请选择审核状态', trigger: 'change' }],
    note: [{ required: true, message: '请填写拒绝原因', trigger: 'change' }]
  }
  private time: any[] = []
  private options: any[] = []
  private type: string = 'P'
  private tableData: any = []
  private companyList: any = []
  private total = 0
  private page = 1
  private size = 10
  private selectType: any = '2'
  private keyWord: any = ''
  private loading: boolean = false
  private excelLoading: boolean = false
  private exportLoading: boolean = false
  private selectLoading: boolean = false
  private dialogLoading: boolean = false
  private isEdit: boolean = false
  private isAdd: boolean = false
  private isView: boolean = false
  private isOnce: boolean = false
  private moreShow: boolean = false
  private detailShow: boolean = false
  private dialogAdjust: boolean = false
  private dialogDeduct: boolean = false
  private dialogAudit: boolean = false
  private statusList: any[] = [
    { name: '未审核', id: '0' },
    { name: '已通过', id: '1' },
    { name: '已拒绝', id: '2' },
    { name: '审核中', id: '3' }
  ]
  private companyTypeList: any[] = []
  private serviceList: any[] = []
  private typeList: any[] = []
  private orderForm: any = {}

  /** comoputed */
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }
  get custName(): string {
    const info = UserModule.info || {}
    const custName = (info as any).custName
    return custName
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
  get subtypeList() {
    const type = this.typeList.find((e: any) => e.id === this.orderForm.serviceTypeId)
    if (type) {
      return type.subtypeList
    }
    return []
  }

  /* methods */
  private formatterCutoffTime(row: any) {
    const cutoffTime = row.cutoffTime
    if (!cutoffTime) return '--'
    if (dayjs(cutoffTime).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')) return '--'
    const num = dayjs().diff(cutoffTime, 'day') + 1
    if (num > 0 && row.ifVerify === 0) {
      return num
    }
    return '--'
  }
  private async getTypeList() {
    await getTypeTemplateList().then((res: any) => {
      const data = res.data || []
      this.typeList = data.reduce((list: any[], type: any) => {
        const temp: any = list.find((e: any) => e.id === type.typeId)
        if (temp) {
          temp.subtypeList.push({
            id: type.subtypeId,
            name: type.subtypeName
          })
        } else {
          list.push({
            id: type.typeId,
            name: type.typeName,
            subtypeList: [ { id: type.subtypeId, name: type.subtypeName } ]
          })
        }
        return list
      }, [])
    }).catch(() => {
      this.typeList = []
    })
  }
  private handleAdd(): void {
    // 新增
    this.detailShow = true
    this.isAdd = true
    this.isEdit = false
    this.isOnce = true
    this.isView = false
    const root: any = this.$refs.detailForm
    root.show()
  }
  private handleEdit(row: any): void {
    // 编辑
    this.detailShow = true
    this.isEdit = true
    this.isAdd = false
    this.isOnce = false
    this.isView = false
    const root: any = this.$refs.detailForm
    root.show(row.id)
  }
  private handleDetail(id: string): void {
    // 查看详情
    this.detailShow = true
    this.isEdit = false
    this.isAdd = false
    this.isView = true
    this.isOnce = false
    const root: any = this.$refs.detailForm
    root.show(id)
  }
  private handleDelete(id: string): void {
    // 删除
    const params = {
      id
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteInvoice(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.handleSearch()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }

  private handleAudit(row: any, index: number) {
    if (row.status === '0') {
      const params: any = {
        id: row.id,
        status: '3',
        note: ''
      }
      auditInvoice(params).then(() => {
        this.tableData[index].status = '3'
      }).catch((err: any) => err)
    }
    this.dialogAudit = true
    this.auditForm = {
      id: row.id,
      status: '1',
      note: ''
    }
  }
  private cancelAudit() {
    this.auditForm = {
      id: '',
      status: '1',
      note: ''
    }
    const root: any = this.$refs.auditForm
    this.$nextTick(() => {
      root.clearValidate()
    })
    this.dialogAudit = false
  }
  private confirmAudit() {
    const params = {
      ...this.auditForm
    }
    this.dialogLoading = true
    auditInvoice(params).then(() => {
      this.$message.success('操作成功')
      this.dialogLoading = false
      this.cancelAudit()
      this.handleSearch()
    }).catch(() => {
      this.dialogLoading = false
    })
  }
  private handleExport() {
    const { comType, comId, ...form } = this.searchForm
    const cid = (this as any).custId
    const params: any = {
      ...form,
      orderCode: this.selectType === '1' ? this.keyWord : undefined,
      clientName: this.selectType === '2' ? this.keyWord : undefined,
      code: this.selectType === '3' ? this.keyWord : undefined,
      billNo: this.selectType === '4' ? this.keyWord : undefined,
      soNo: this.selectType === '5' ? this.keyWord : undefined,
      containerNo: this.selectType === '6' ? this.keyWord : undefined,
      custTag: comType,
      enterpriseId: (comType === '1' || comType === '3') ? [cid] : comId ? [comId] : [],
      request: '0',
      size: 9999,
      page: 1,
      type: this.type
    }
    if (Array.isArray(this.time) && this.time.length > 0) {
      params.startDate = this.time[0]
      params.endDate = this.time[1]
    }
    this.excelLoading = true
    getInvoiceExcel({ ...params }).then((res:any) => {
      this.excelLoading = false
      const a = document.createElement('a')
      document.body.appendChild(a)
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      const objUrl = URL.createObjectURL(blob)
      a.href = objUrl
      a.download = '应收款' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.xls'
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(objUrl)
    }).catch((err:any) => {
      this.excelLoading = false
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
  private rowSelectChange(checked: any) {
    if (checked.checked) {
      this.options.push(checked.row)
    } else {
      this.options = this.options.filter((it: any) => it.id !== checked.row.id)
    }
  }
  private handleExport2() {
    if (this.options.length <= 0) {
      this.$message.error('请勾选列表同一客户的应收款')
      return
    }
    this.exportLoading = true
    const params: any = {
      idList: this.options
    }
    getInvoiceExport(params).then((res:any) => {
      this.exportLoading = false
      const a = document.createElement('a')
      document.body.appendChild(a)
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      const objUrl = URL.createObjectURL(blob)
      a.href = objUrl
      a.download = '应收款' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.xls'
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(objUrl)
      this.options = []
      this.$nextTick(() => {
        const root: any = this.$refs.tableSelect
        root.clearCheckboxRow()
      })
    }).catch((err:any) => {
      this.exportLoading = false
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

  private async handleOrder(row: any) {
    // 订单信息
    const params = {
      id: row.id
    }
    this.loading = true
    await this.getTypeList()
    getInvoiceById(params).then((res: any) => {
      this.loading = false
      this.moreShow = true
      const data = res.data || {}
      const invoiceOrderEntity = data.invoiceOrderEntity || {}
      this.orderForm = {
        orderDate: invoiceOrderEntity.orderDate, // 下单时间
        channelName: invoiceOrderEntity.channelName, // 渠道
        wsCode: invoiceOrderEntity.wsCode, // 仓库代码
        packages: invoiceOrderEntity.packages, // 件数
        weights: invoiceOrderEntity.weights, // 重量KG
        serviceTypeName: row.serviceTypeName, // 服务大类
        serviceTypeId: row.serviceTypeId,
        serviceSubtypeId: row.serviceSubtypeId, // 服务小类
        code: row.code,
        clientProperty: row.clientProperty,
        orderCode: row.orderCode,
        status: row.status,
        clientName: row.clientName,
        agentName: row.agentName,
        currencyName: row.currencyName,
        invDate: row.invDate
      }
    }).catch(() => {
      this.loading = false
    })
  }
  private handlePass(row: any): void {
    // 通过
  }
  private handleRefuse(row: any): void {
    // 拒绝
  }
  private handleResubmit(row: any): void {
    // 重新提交
  }
  private handleDeduct(row: any): void {
    // 申请抵扣
    this.dialogDeduct = true
  }
  private handleAdjust(row: any): void {
    // 申请调校
    this.dialogAdjust = true
  }
  private onComType() {
    this.tableData = []
    this.searchForm.comId = ''
    this.companyList = []
    this.handleSearch(1)
  }
  private onCompany() {
    this.tableData = []
    this.handleSearch(1)
  }
  private getCompanyList() {
    this.selectLoading = true
    if (this.searchForm.comType === '2') {
      getUnFinanceAgentList().then((res:any) => {
        const data = res.data || []
        this.companyList = data
        this.selectLoading = false
      }).catch((err:any) => {
        this.selectLoading = false
        return err
      })
    } else if (this.searchForm.comType === '5') {
      const params: any = {
        page: 1,
        size: 9999
      }
      getSupplierList(params)
        .then((res: any) => {
          const data = res.data || {}
          const arr = data.result || []
          this.companyList = arr
          this.selectLoading = false
        })
        .catch((err: any) => {
          this.selectLoading = false
          return err
        })
    }
  }
  private async getServiceList() {
    this.selectLoading = true
    const params = {
      custType: '1'
    }
    await getAllServiceType(params)
      .then((res: any) => {
        this.serviceList = res.data || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private handleService() {
    this.tableData = []
    this.handleSearch(1)
  }

  private handleSearch(val?: number): void {
    // 查询
    this.loading = true
    if (val) {
      this.page = val
    }
    const { comType, comId, ...form } = this.searchForm
    const cid = (this as any).custId
    const params: any = {
      ...form,
      orderCode: this.selectType === '1' ? this.keyWord : undefined,
      agentName: this.selectType === '2' ? this.keyWord : undefined,
      code: this.selectType === '3' ? this.keyWord : undefined,
      billNo: this.selectType === '4' ? this.keyWord : undefined,
      soNo: this.selectType === '5' ? this.keyWord : undefined,
      containerNo: this.selectType === '6' ? this.keyWord : undefined,
      custTag: comType,
      enterpriseId: comType === '1' ? [cid] : comId ? [comId] : [],
      request: '0',
      size: this.size,
      page: this.page,
      type: this.type
    }
    // if (params.enterpriseId.length <= 0) {
    //   this.$message.error('请选择分公司')
    //   return
    // }
    if (Array.isArray(this.time) && this.time.length > 0) {
      params.startDate = this.time[0]
      params.endDate = this.time[1]
    }
    getInvoiceList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.tableData = (data.result || []).map((e: any) => {
          e.invDate = dayjs(e.invDate).format('YYYY-MM-DD')
          return e
        })
        if (this.options.length) {
          this.options.map((a: any) => {
            const item = this.tableData.find((it: any) => it.id === a || `${it.id}` === a)
            if (item) {
              this.$nextTick(() => {
                const root: any = this.$refs.tableSelect
                root.toggleCheckboxRow(item, true)
              })
            }
          })
        }
        this.total = data.total
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return [null, err]
      })
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
    this.time = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    const type = (this as any).custType
    const stype = (this as any).custSubtype
    this.searchForm.comType = '1'
    if (type === '2' && stype === '1') {
      this.companyTypeList = [
        { id: '1', name: '本公司' },
        { id: '2', name: '分公司' }
      ]
      this.searchForm.comType = '2'
    }
    await this.getServiceList()
    this.handleSearch()
  }
}
</script>

<style lang="scss" scoped>
.finance-header {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  height: 50px;
  padding: 0 20px;
  border-bottom: 1px solid #e8e8e8;
  background-color: #ffffff;
}
::v-deep .vxe-table--header .vxe-cell--title {
  color: #909399 !important;
}
</style>
