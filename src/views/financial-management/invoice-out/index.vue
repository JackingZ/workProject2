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
            开票
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
        </div>
        <div class="app-panel">
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-button
                v-permission="['invoiceOutAdd']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="float: left;"
                @click="handleAdd"
              >
                新增开票
              </el-button>
              <el-select
                v-if="(custType === '2' && custSubtype === '1') || custType === '3'"
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
                v-if="searchForm.comType === '2' || searchForm.comType === '4'"
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
                placeholder="审核状态"
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
                v-model="searchForm.ifBill"
                placeholder="是否税务开票"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
              >
                <el-option
                  label="否"
                  :value="0"
                />
                <el-option
                  label="是"
                  :value="1"
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
                start-placeholder="起始日期"
                end-placeholder="结束日期"
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
                    label="原单号"
                    value="1"
                  />
                  <el-option
                    label="客户名称"
                    value="2"
                  />
                </el-select>
              </el-input>
              <el-button
                v-permission="['invoiceOutSearch']"
                type="primary"
                size="small"
                @click="handleSearch(1)"
              >
                查询
              </el-button>
            </el-col>
          </el-row>

          <el-table
            v-loading="loading"
            :data="tableData"
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <!-- <el-table-column
              prop="code"
              min-width="160"
              label="发票编号"
              show-overflow-tooltip
            /> -->
            <el-table-column
              prop="clientName"
              label="客户名称"
              min-width="200"
            />
            <el-table-column
              prop="invDate"
              label="开票日期"
              width="180"
            />
            <el-table-column
              prop=""
              label="审核状态"
              width="120"
            >
              <template slot-scope="scope">
                {{ (statusList.find((it) => it.id === scope.row.status) || {}).name }}
              </template>
            </el-table-column>
            <el-table-column
              prop="auditTime"
              label="审核时间"
              width="180"
            />
            <el-table-column
              prop="amount"
              width="180"
              label="本币总金额"
            />
            <el-table-column
              width="140"
              label="是否税务开票"
            >
              <template slot-scope="scope">
                {{ scope.row.ifBill === 1 ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="200"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.status !== '3' && $checkPermission(['invoiceOutEdit'])"
                  type="text"
                  @click="handleEdit(scope.row)"
                >
                  编辑
                </el-button>
                <!-- <el-button
                  type="text"
                  @click="handleDelete(scope.row.id)"
                >
                  删除
                </el-button> -->
                <el-button
                  v-permission="['invoiceOutView']"
                  type="text"
                  @click="handleDetail(scope.row)"
                >
                  查看
                </el-button>
                <el-button
                  v-if="scope.row.status !== '1' && $checkPermission(['invoiceOutAudit'])"
                  type="text"
                  @click="handleAudit(scope.row, scope.$index)"
                >
                  审核
                </el-button>
                <el-button
                  v-if="searchForm.serviceTypeId === '05' && $checkPermission(['invoiceOutExport'])"
                  type="text"
                  @click="handleExport(scope.row)"
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
        title="开票审核"
        :visible.sync="visible"
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
import detail from '@/views/financial-management/invoice-out/detail.vue'
import {
  getOutInvoiceList,
  deleteOutInvoice,
  auditOutInvoice,
  getUnFinanceAgentList,
  exportOutInvoice,
  getCustomerList,
  getAllServiceType
} from '@/api/financial-at-collection-order'
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
  private searchForm: any = {
    serviceTypeId: '02',
    comType: undefined,
    comId: undefined,
    code: undefined,
    clientName: undefined,
    endDate: undefined,
    orderCode: undefined,
    startDate: undefined,
    status: undefined,
    ifVerify: undefined
  }
  private auditForm: any = {
    id: '',
    status: '1'
  }
  private auditFormRules: any = {
    status: [{ required: true, message: '请选择审核状态', trigger: 'change' }],
    note: [{ required: true, message: '请填写拒绝原因', trigger: 'change' }]
  }
  private time: any[] = []
  private tableData: any = []
  private companyList: any = []
  private serviceList: any = []
  private total = 0
  private page = 1
  private size = 10
  private selectType: any = '1'
  private keyWord: any = ''
  private loading: boolean = false
  private dialogLoading: boolean = false
  private selectLoading: boolean = false
  private visible: boolean = false
  private isEdit: boolean = false
  private isAdd: boolean = false
  private isView: boolean = false
  private isOnce: boolean = false
  private moreShow: boolean = false
  private detailShow: boolean = false
  private dialogAdjust: boolean = false
  private dialogDeduct: boolean = false
  private statusList: any[] = [
    { name: '待审核', id: '0' },
    { name: '已通过', id: '1' },
    { name: '已拒绝', id: '2' },
    { name: '审核中', id: '3' }
  ]
  private companyTypeList: any[] = []
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

  /* methods */
  private onComType() {
    // 仅一级代理商可操作
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
    } else if (this.searchForm.comType === '4') {
      const params: any = {
        custIds: [(this as any).custId]
      }
      getCustomerList(params).then((res:any) => {
        const data = res.data || []
        this.companyList = data
        this.selectLoading = false
      }).catch((err:any) => {
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
    this.handleSearch(1)
  }

  private cancelAudit() {
    this.visible = false
    this.auditForm = {
      id: '',
      status: '1'
    }
  }
  private handleAudit(row: any, index: number) {
    if (row.status === '0') {
      const params: any = {
        id: row.id,
        status: '3'
      }
      auditOutInvoice(params).then(() => {
        this.tableData[index].status = '3'
      }).catch((err: any) => err)
    }
    this.visible = true
    this.auditForm = {
      id: row.id,
      status: '1'
    }
  }
  private confirmAudit() {
    const params = {
      ...this.auditForm
    }
    this.dialogLoading = true
    auditOutInvoice(params).then(() => {
      this.$message.success('操作成功')
      this.dialogLoading = false
      this.cancelAudit()
      this.handleSearch()
    }).catch(() => {
      this.dialogLoading = false
    })
  }
  private handleAdd(): void {
    // 新增
    this.detailShow = true
    this.isEdit = false
    this.isAdd = true
    this.isView = false
    this.isOnce = true
    const root: any = this.$refs.detailForm
    this.$nextTick(() => {
      root.show()
    })
  }
  private handleEdit(row: any): void {
    // 编辑
    this.detailShow = true
    this.isEdit = true
    this.isAdd = false
    this.isView = false
    this.isOnce = false
    const root: any = this.$refs.detailForm
    this.$nextTick(() => {
      root.show(row)
    })
  }
  private handleDetail(row: any): void {
    // 查看详情
    this.detailShow = true
    this.isEdit = false
    this.isAdd = false
    this.isView = true
    this.isOnce = false
    const root: any = this.$refs.detailForm
    this.$nextTick(() => {
      root.show(row)
    })
  }
  private handleExport(row: any) {
    this.loading = true
    const params: any = {
      billingId: row.id
    }
    exportOutInvoice(params).then((res:any) => {
      this.loading = false
      const a = document.createElement('a')
      document.body.appendChild(a)
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      const objUrl = URL.createObjectURL(blob)
      a.href = objUrl
      a.download = row.clientName + '开票数据' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.xls'
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(objUrl)
    }).catch((err:any) => {
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
        deleteOutInvoice(params)
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

  private handleSearch(val?: number): void {
    // 查询
    if (val) {
      this.page = val
    }
    const { comType, comId, ...form } = this.searchForm
    const cid = (this as any).custId
    const params: any = {
      model: {
        ...form,
        custTag: comType,
        orderCode: this.selectType === '1' ? this.keyWord : undefined,
        clientName: this.selectType === '2' ? this.keyWord : undefined,
        agentId: (comType === '1' || comType === '3') ? [cid] : comId ? [comId] : []
      },
      size: this.size,
      page: this.page
    }
    if (Array.isArray(this.time) && this.time.length > 0) {
      params.model.start = this.time[0]
      params.model.end = this.time[1]
    }
    this.loading = true
    getOutInvoiceList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.tableData = data.result || []
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
    } else if (type === '3') {
      this.companyTypeList = [
        { id: '3', name: '聚货通' },
        { id: '4', name: '客户' },
        { id: '5', name: '代理商' }
      ]
      this.searchForm.comType = '3'
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
</style>
