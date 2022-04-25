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
        <head-info
          info=""
          title="付款单"
        />
        <div class="app-panel">
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-button
                v-permission="['receiptsAdd']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="float: left;"
                @click="handleAdd"
              >
                新增付款单
              </el-button>
              <el-select
                v-if="custType === '2' && custSubtype === '1'"
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
                v-if="custType === '2' && custSubtype === '1' && searchForm.comType === '2'"
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
                v-model="searchForm.payType"
                placeholder="付款类型"
                size="small"
                clearable
                style="width:120px;margin-right:5px;"
              >
                <el-option
                  v-for="(item, index) in categoryList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="searchForm.payMethod"
                placeholder="付款方式"
                size="small"
                clearable
                style="width:120px;margin-right:5px;"
              >
                <el-option
                  v-for="(item, index) in sourceList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
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
                    label="客户名称"
                    value="2"
                  />
                  <el-option
                    label="付款单号"
                    value="3"
                  />
                </el-select>
              </el-input>
              <el-button
                v-permission="['receiptsQuery']"
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
            <el-table-column
              fixed="left"
              prop="id"
              label="付款单号"
              width="150"
            />
            <el-table-column
              prop=""
              label="状态"
              width="100"
            >
              <template slot-scope="scope">
                {{ (statusList.find((it) => it.id === scope.row.status) || {}).name }}
              </template>
            </el-table-column>
            <el-table-column
              prop="payTime"
              label="付款日期"
              width="170"
            />
            <el-table-column
              prop="custName"
              label="客户名称"
              width="150"
            />
            <el-table-column
              prop=""
              label="客户类型"
              width="120"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.custType === '0'">聚货通</span>
                <span v-else-if="scope.row.custType === '3'">供应商</span>
                <span v-else-if="scope.row.custType === '2-1'">一级代理</span>
                <span v-else-if="scope.row.custType === '2-2'">二级代理</span>
                <span v-else-if="scope.row.custType === '1-0'">直客</span>
                <span v-else-if="scope.row.custType === '1-1'">同行</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="付款类型"
              width="100"
            >
              <template slot-scope="scope">
                {{ (categoryList.find((it) => it.id === scope.row.payType) || {}).name }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="付款方式"
              width="110"
            >
              <template slot-scope="scope">
                {{ (sourceList.find((it) => it.id === scope.row.payMethod) || {}).name }}
              </template>
            </el-table-column>
            <el-table-column
              prop="currencyName"
              label="货币"
              width="120"
            />
            <el-table-column
              prop="payAmount"
              label="金额"
              min-width="120"
            />
            <el-table-column
              prop="exRate"
              label="汇率"
              width="100"
            />
            <el-table-column
              prop="selfAmount"
              label="本币金额"
              min-width="120"
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="200"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.status !== 3 && scope.row.status !== 1 && $checkPermission(['receiptsUpdate'])"
                  type="text"
                  @click="handleEdit(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-if="scope.row.status !== 1 && $checkPermission(['receiptsDel'])"
                  type="text"
                  @click="handleDelete(scope.row.id)"
                >
                  删除
                </el-button>
                <el-button
                  v-permission="['receiptsDetail']"
                  type="text"
                  @click="handleDetail(scope.row.id)"
                >
                  查看详情
                </el-button>
                <el-button
                  v-if="scope.row.status !== 1 && $checkPermission(['paymentAudit'])"
                  type="text"
                  @click="handleAudit(scope.row, scope.$index)"
                >
                  审核
                </el-button>
                <!-- <el-button
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
                </el-button>
                <el-button
                  type="text"
                  @click="handleResubmit(scope.row)"
                >
                  重新提交
                </el-button> -->
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
          :is-edit="isEdit"
          :is-once="isOnce"
          :status-list="statusList"
          :source-list="sourceList"
          :category-list="categoryList"
          @back="detailShow = false"
          @getTableData="handleSearch"
        />
      </div>
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
                <el-radio :label="1">
                  通过
                </el-radio>
                <el-radio :label="2">
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
import detail from '@/views/financial-management/payment-order/detail.vue'
import {
  getPaymentList,
  deletePayment,
  getUnFinanceAgentList,
  auditPayment
} from '@/api/financial-at-invoice-order'
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
    comType: undefined,
    comId: undefined,
    id: undefined,
    custName: undefined,
    end: undefined,
    start: undefined,
    status: undefined,
    payMethod: undefined,
    payType: undefined
  }
  private auditForm: any = {
    id: '',
    status: 1,
    note: ''
  }
  private auditFormRules: any = {
    status: [{ required: true, message: '请选择审核状态', trigger: 'change' }],
    note: [{ required: true, message: '请填写拒绝原因', trigger: 'change' }]
  }
  private time: any[] = []
  private type: string = 'P'
  private tableData: any = []
  private companyList: any = []
  private total = 0
  private page = 1
  private size = 10
  private selectType: any = '2'
  private keyWord: any = ''
  private loading: boolean = false
  private dialogLoading: boolean = false
  private selectLoading: boolean = false
  private dialogAudit: boolean = false
  private isEdit: boolean = false
  private isOnce: boolean = false
  private detailShow: boolean = false
  private statusList: any[] = [
    { name: '未审核', id: 0 },
    { name: '已通过', id: 1 },
    { name: '已拒绝', id: 2 },
    { name: '审核中', id: 3 }
  ]
  private categoryList: any[] = [
    { name: '采购付款', id: '0' },
    { name: '赔付', id: '1' },
    { name: '抵扣', id: '2' }
  ]
  private sourceList: any[] = [
    { name: '银行汇款', id: '0' },
    { name: '微信', id: '1' },
    { name: '支付宝', id: '2' },
    { name: 'PayPal', id: '3' },
    { name: '其它', id: '4' }
  ]
  private companyTypeList: any[] = [
    { id: '1', name: '本公司' },
    { id: '2', name: '分公司' }
  ]

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
  private handleAdd(): void {
    // 新增
    this.detailShow = true
    this.isEdit = true
    this.isOnce = true
    const root: any = this.$refs.detailForm
    root.setData()
  }
  private handleEdit(row: any): void {
    // 编辑
    this.detailShow = true
    this.isEdit = true
    this.isOnce = false
    const root: any = this.$refs.detailForm
    root.setData(row.id)
  }
  private handleDetail(id: string): void {
    // 查看详情
    this.detailShow = true
    this.isEdit = false
    this.isOnce = false
    const root: any = this.$refs.detailForm
    root.setData(id)
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
        deletePayment(params)
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
  private cancelAudit() {
    this.auditForm = {
      id: '',
      status: 1,
      note: ''
    }
    const root: any = this.$refs.auditForm
    this.$nextTick(() => {
      root.clearValidate()
    })
    this.dialogAudit = false
  }
  private handleAudit(row: any, index: number) {
    if (row.status === 0) {
      const params: any = {
        id: row.id,
        status: 3,
        note: ''
      }
      auditPayment(params).then(() => {
        this.tableData[index].status = 3
      }).catch((err: any) => err)
    }
    this.dialogAudit = true
    this.auditForm = {
      id: row.id,
      status: 1,
      note: ''
    }
  }
  private confirmAudit() {
    const params = {
      ...this.auditForm
    }
    this.dialogLoading = true
    auditPayment(params).then(() => {
      this.$message.success('操作成功')
      this.dialogLoading = false
      this.cancelAudit()
      this.handleSearch()
    }).catch(() => {
      this.dialogLoading = false
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
    getUnFinanceAgentList().then((res:any) => {
      const data = res.data || []
      this.companyList = data
      this.selectLoading = false
    }).catch((err:any) => {
      this.selectLoading = false
      return err
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
        custName: this.selectType === '2' ? this.keyWord : undefined,
        id: this.selectType === '3' ? this.keyWord : undefined,
        custTag: comType,
        agentId: comType === '1' ? [cid] : comId ? [comId] : []
      },
      size: this.size,
      page: this.page
    }
    // if (params.model.agentId.length <= 0) {
    //   this.$message.error('请选择分公司')
    //   return
    // }
    if (Array.isArray(this.time) && this.time.length > 0) {
      params.model.start = this.time[0]
      params.model.end = this.time[1]
    }
    this.loading = true
    getPaymentList(params)
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
  private created() {
    this.time = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    const type = (this as any).custType
    const stype = (this as any).custSubtype
    this.searchForm.comType = '1'
    if (type === '2' && stype === '1') {
      this.searchForm.comType = '2'
    }
    this.handleSearch()
  }
}
</script>

<style lang="scss" scoped>
</style>
