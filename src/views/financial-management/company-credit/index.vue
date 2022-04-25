<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="公司信用"
        />
        <div class="app-panel">
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-button
                v-permission="['companySetemplate']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="float: left;"
                @click="handleDefaultTemplate"
              >
                设置模板
              </el-button>
              <el-select
                v-if="custType === '2' && custSubtype === '1'"
                v-model="selectValue.custTag"
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
                v-if="custType === '2' && custSubtype === '1' && selectValue.custTag === '2'"
                v-model="selectValue.comId"
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
                v-model="selectValue.creditRating"
                :loading="selectLoading"
                style="width:130px;margin-right:5px;"
                placeholder="信用等级"
                size="small"
                clearable
                filterable
                @focus="getCustRatingList"
              >
                <el-option
                  v-for="(item, index) in creditList"
                  :key="index"
                  :label="`${item.code}-${item.name}`"
                  :value="item.code"
                />
              </el-select>

              <el-input
                v-model="selectValue.name"
                size="small"
                style="width:250px;margin-right:10px;"
                :maxlength="50"
                placeholder="请输入"
                clearable
              >
                <template slot="prepend">
                  公司名称
                </template>
              </el-input>
              <el-button
                v-permission="['companyQuery']"
                type="primary"
                size="small"
                @click="getTableData(1)"
              >
                查询
              </el-button>
            </el-col>
          </el-row>

          <el-table
            ref="batchSelectTable"
            v-loading="loading"
            :data="tableData"
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            border
            @selection-change="handleSelection"
          >
            <!-- <el-table-column
              type="selection"
              width="55"
            /> -->
            <el-table-column
              prop="name"
              label="公司名称"
              min-width="180"
              show-overflow-tooltip
            />
            <el-table-column
              prop=""
              label="公司类型"
              width="100"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.type === '0'">聚货通</span>
                <span v-else-if="scope.row.type === '1'">
                  <span v-if="scope.row.subtype === '0'">
                    直客
                  </span>
                  <span v-if="scope.row.subtype === '1'">
                    同行
                  </span>
                </span>
                <span v-else-if="scope.row.type === '2'">
                  <span v-if="scope.row.subtype === '1'">
                    一级代理
                  </span>
                  <span v-if="scope.row.subtype === '2'">
                    二级代理
                  </span>
                </span>
                <span v-else-if="scope.row.type === '3'">供应商</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="estimatedCost"
              label="预估费用"
              width="120"
            />
            <el-table-column
              prop="debts"
              label="欠款金额"
              width="120"
            />
            <!-- <el-table-column
              prop="initialAmount"
              label="初始余额"
              width="120"
            /> -->
            <el-table-column
              prop="credits"
              label="信用额度"
              width="120"
            />
            <el-table-column
              prop=""
              :formatter="formatCredit"
              label="信用等级"
              width="120"
            />
            <el-table-column
              prop=""
              label="关联要素"
              width="100"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="!$checkPermission(['companyViewElements'])"
                  type="text"
                  @click="handleFactor(scope.row)"
                >
                  查看要素
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="发票付款"
              width="100"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="!$checkPermission(['companyViewInvoice'])"
                  type="text"
                  @click="handleInvoice(scope.row)"
                >
                  查看发票
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="付款方式"
              width="100"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="!$checkPermission(['companyPaymentMethod'])"
                  type="text"
                  @click="handlePaytype(scope.row)"
                >
                  付款方式
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="设置标识"
              width="100"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="!$checkPermission(['companySetLogo'])"
                  type="text"
                  @click="handleSetIcon(scope.row)"
                >
                  设置标识
                </el-button>
              </template>
            </el-table-column>
            <!--<el-table-column
              prop=""
              label="是否扣货"
              width="100"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleDetentCargo(scope.row)"
                >
                  是否扣货
                </el-button>
              </template>
            </el-table-column>-->
            <el-table-column
              prop="notes"
              label="备注"
              min-width="150"
              show-overflow-tooltip
            />
            <el-table-column
              fixed="right"
              width="180"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['companyEdit']"
                  :disabled="scope.row.signContract !== '1'"
                  type="text"
                  @click="handleEdit(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['companyApplyAdjustment']"
                  type="text"
                  @click="handleApplyCard(scope.row)"
                >
                  申请调额
                </el-button>
                <!-- <el-button
                  v-permission="['companyReview']"
                  type="text"
                  @click="handleCheck(scope.row)"
                >
                  审核
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

          <el-dialog
            :title="title1"
            :visible.sync="dialogTemplate"
            :close-on-click-modal="false"
            width="900px"
            @close="cancel1"
          >
            <TemplateCredit
              ref="templateCredit"
              :credit-list="creditList"
              :is-pay="isPay"
              @cancel="cancel1"
              @getAll="getTableData"
            />
          </el-dialog>

          <el-dialog
            title="选择扣货"
            :visible.sync="dialogDetentCargo"
            :close-on-click-modal="false"
            width="1200px"
            @close="cancel2"
          >
            <DetentCargo ref="detentCargo" />
          </el-dialog>

          <el-dialog
            :title="title3"
            :visible.sync="dialogFactor"
            :close-on-click-modal="false"
            width="900px"
            @close="cancel3"
          >
            <Factor
              ref="factor"
              :is-check="isCheck"
              :credit-list="creditList"
              @cancel="cancel3"
              @getAll="getTableData"
            />
          </el-dialog>

          <el-dialog
            title="发票付款"
            :visible.sync="dialogInvoice"
            :close-on-click-modal="false"
            width="1200px"
            @close="cancel4"
          >
            <Invoice ref="invoice" />
          </el-dialog>

          <el-dialog
            title="设置标识"
            :visible.sync="dialogSetIcon"
            :close-on-click-modal="false"
            width="600px"
            @close="cancel5"
          >
            <SetIcon
              ref="setIcon"
              @cancel="cancel5"
              @getAll="getTableData"
            />
          </el-dialog>

          <el-dialog
            title="编辑信用"
            :visible.sync="dialogEdit"
            :close-on-click-modal="false"
            width="600px"
            @close="cancel6"
          >
            <Edit
              ref="edit"
              :credit-list="creditList"
              @cancel="cancel6"
              @getAll="getTableData"
            />
          </el-dialog>

          <el-dialog
            title="申请调额"
            :visible.sync="dialogApplyCard"
            :close-on-click-modal="false"
            width="600px"
            @close="cancel7"
          >
            <ApplyCard
              ref="applyCard"
              @cancel="cancel7"
              @getAll="getTableData"
            />
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import TemplateCredit from '@/views/financial-management/company-credit/compontents/templateCredit.vue'
import DetentCargo from '@/views/financial-management/company-credit/compontents/detentCargo.vue'
import Factor from '@/views/financial-management/company-credit/compontents/factor.vue'
import Invoice from '@/views/financial-management/company-credit/compontents/invoice.vue'
import SetIcon from '@/views/financial-management/company-credit/compontents/setIcon.vue'
import Edit from '@/views/financial-management/company-credit/compontents/edit.vue'
import ApplyCard from '@/views/financial-management/company-credit/compontents/applyCard.vue'
import {
  getTableData,
  getCustRatingList,
  getUnFinanceAgentList,
  getAgentList
} from '@/api/financial-at-company-credit'
@Component({
  name: '',
  components: {
    TemplateCredit,
    DetentCargo,
    Factor,
    Invoice,
    SetIcon,
    Edit,
    ApplyCard
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private dialogTemplate: boolean = false
  private isPay: boolean = false
  private dialogDetentCargo: boolean = false
  private isCheck: boolean = false
  private dialogFactor: boolean = false
  private dialogInvoice: boolean = false
  private dialogSetIcon: boolean = false
  private dialogEdit: boolean = false
  private dialogApplyCard: boolean = false
  private selectLoading: boolean = false
  private creditList: any[] = []
  private agentList: any[] = []
  private companyList: any[] = []
  private tableData: any[] = []
  private selectValue: any = {
    creditRating: undefined,
    name: undefined,
    comId: undefined,
    custTag: undefined
  }
  private companyTypeList: any[] = [
    { id: '1', name: '本公司' },
    { id: '2', name: '分公司' }
  ]
  private title1 = ''
  private title3 = ''
  private page: number = 1
  private size: number = 10
  private total: any = 0

  /* computed */
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

  /* methods */
  private formatCredit(row: any) {
    const item = this.creditList.find((it: any) => it.code === row.creditRating) || {}
    return `${item.code || ''}-${item.name || ''}`
  }
  private onComType() {
    this.selectValue.comId = ''
    this.companyList = []
    this.tableData = []
    this.getTableData(1)
  }
  private onCompany() {
    this.tableData = []
    this.getTableData(1)
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
  private getCustRatingList() {
    this.selectLoading = true
    getCustRatingList({
      page: 1,
      size: 999
    })
      .then((res: any) => {
        const data = res.data || {}
        const arr = data.result || []
        this.creditList = arr.map((it: any) => {
          it.id = it.id + ''
          return it
        })
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  // 默认模板
  private handleDefaultTemplate(): void {
    this.dialogTemplate = true
    this.isPay = false
    this.title1 = '设置模板'
    this.$nextTick(() => {
      const root: any = this.$refs.templateCredit
      root.setInfo()
    })
  }

  // 审核
  private handleCheck(row: any): void {
    this.isCheck = true
    this.dialogFactor = true
    this.title3 = '审核'
    this.$nextTick(() => {
      const root: any = this.$refs.factor
      root.setData(row)
    })
  }

  private handleFactor(row: any): void {
    this.dialogFactor = true
    this.isCheck = false
    this.title3 = '查看要素'
    this.$nextTick(() => {
      const root: any = this.$refs.factor
      root.setData(row)
    })
  }

  private handleInvoice(row: any): void {
    this.dialogInvoice = true
    this.$nextTick(() => {
      const root: any = this.$refs.invoice
      root.setData({
        ...row,
        custTag: this.selectValue.custTag
      })
    })
  }

  private handlePaytype(row: any): void {
    this.dialogTemplate = true
    this.isPay = true
    this.title1 = '付款方式'
    this.$nextTick(() => {
      const root: any = this.$refs.templateCredit
      root.setData(row)
    })
  }

  private handleSetIcon(row: any): void {
    this.dialogSetIcon = true
    this.$nextTick(() => {
      const root: any = this.$refs.setIcon
      root.setData(row)
    })
  }

  private handleDetentCargo(row: any): void {
    this.dialogDetentCargo = true
  }

  private handleEdit(row: any): void {
    this.dialogEdit = true
    this.$nextTick(() => {
      const root: any = this.$refs.edit
      root.setData(row)
    })
  }

  private handleApplyCard(row: any): void {
    this.dialogApplyCard = true
    this.$nextTick(() => {
      const root: any = this.$refs.applyCard
      root.setData(row)
    })
  }

  // 关闭dialog重置表单
  private cancel1() {
    this.dialogTemplate = false
    this.isPay = false
    this.$nextTick(() => {
      const root: any = this.$refs.templateCredit
      root.reset()
    })
  }
  private cancel2() {
    this.dialogDetentCargo = false
  }
  private cancel3() {
    this.dialogFactor = false
    if (!this.isCheck) return
    this.$nextTick(() => {
      const root: any = this.$refs.factor
      root.reset()
    })
  }
  private cancel4() {
    this.dialogInvoice = false
  }
  private cancel5() {
    this.dialogSetIcon = false
    this.$nextTick(() => {
      const root: any = this.$refs.setIcon
      root.reset()
    })
  }
  private cancel6() {
    this.dialogEdit = false
    this.$nextTick(() => {
      const root: any = this.$refs.edit
      root.reset()
    })
  }
  private cancel7() {
    this.dialogApplyCard = false
    this.$nextTick(() => {
      const root: any = this.$refs.applyCard
      root.reset()
    })
  }

  private handleSelection(val: any) {
    // const rootS: any = this.$refs.batchSelectTable
    // rootS.clearSelection()
  }
  // 获取服务列表
  private getTableData(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const { custTag, comId, ...form } = this.selectValue
    const params: any = {
      model: {
        ...form,
        custTag,
        customerId: custTag === '2' && comId ? [comId] : []
      },
      page: this.page,
      size: this.size
    }
    getTableData(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        this.tableData = data.result || []
        this.total = data.total
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.getTableData()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.getTableData()
  }

  private created(): void {
    const type = (this as any).custType
    const stype = (this as any).custSubtype
    this.selectValue.custTag = '1'
    if (type === '2' && stype === '1') {
      this.selectValue.custTag = '2'
    }
    this.getCustRatingList()
    this.getTableData()
  }
}
</script>

<style lang="scss" scoped>

</style>
