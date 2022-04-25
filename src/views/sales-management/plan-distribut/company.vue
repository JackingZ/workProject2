<template>
  <div>
    <div v-show="!detailShow">
      <el-row>
        <el-col :span="6">
          <el-button
            type="text"
            icon="el-icon-circle-plus-outline"
            style="margin-left: 10px"
            @click="addPlan"
          >
            新增计划
          </el-button>
        </el-col>
        <el-col
          :span="18"
          style="text-align:right;padding-right: 10px;"
        >
          <el-select
            v-if="custType === '0'"
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
          <el-date-picker
            v-model="searchForm.year"
            type="year"
            placeholder="年度"
            style="width:130px;margin-right: 5px;"
            value-format="yyyy"
            size="small"
            clearable
            @change="onYear('1')"
          />
          <el-select
            v-model="searchForm.period"
            :loading="selectLoading"
            :disabled="!searchForm.year || !firstId"
            placeholder="期间"
            size="small"
            clearable
            filterable
            style="width: 130px;margin-right:10px;"
            @focus="getFiscalList('1')"
          >
            <el-option
              v-for="(item, index) in fiscalList1"
              :key="index"
              :label="item.fiscalPeriod"
              :value="item.id"
            />
          </el-select>
          <el-button
            v-permission="['salesCompanySearch']"
            type="primary"
            size="small"
            @click="queryAll(1)"
          >
            查询
          </el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="loading"
        :data="tableData"
        height="calc(100vh - 355px)"
        style="width: 100%;margin: 10px 0;"
        border
      >
        <el-table-column
          label="年度"
          width="120"
          prop="year"
        />
        <el-table-column
          :formatter="formatMonth"
          label="期间"
          min-width="150"
        />
        <el-table-column
          label="公司名称"
          min-width="150"
          prop="companyName"
        />
        <el-table-column
          label="业务类型-任务量"
          min-width="200"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>空运：{{ (scope.row.airNum || '--') + 'KG, ' }}</span>
            <span>海运：{{ (scope.row.seaNum || '--') + 'CBM, ' }}</span>
            <span>铁路：{{ (scope.row.trainNum || '--') + 'CBM, ' }}</span>
            <span>卡航：{{ (scope.row.carNum || '--') + 'KG ' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="180"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="medium"
              @click="editRow(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="medium"
              @click="distributRow(scope.row)"
            >
              分配
            </el-button>
            <el-button
              type="text"
              size="medium"
              @click="viewRow(scope.row)"
            >
              查看
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
        @current-change="handleCurrentChange"
      />
    </div>
    <distributInfo
      v-show="detailShow"
      ref="distribut"
      :is-edit="isEdit"
      @close="closed"
    />

    <el-dialog
      :title="isEdit ? '编辑计划' : '新增计划'"
      :close-on-click-modal="false"
      width="600px"
      :visible.sync="dialogShow"
      @closed="cancel"
    >
      <div v-loading="dialogLoading">
        <el-form
          ref="editForm"
          :model="form"
          label-width="100px"
          style="padding-right: 20px;"
          size="small"
          :rules="formRules"
        >
          <el-form-item
            v-if="custType === '0'"
            label="所属公司"
            prop="companyId"
          >
            <el-select
              v-model="form.companyId"
              :loading="selectLoading"
              size="small"
              style="width: 100%;"
              placeholder="请选择"
              filterable
              clearable
              @change="onCompanyChange"
              @focus="getCompanyList"
            >
              <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="年度"
            prop="year"
          >
            <el-date-picker
              v-model="form.year"
              type="year"
              placeholder="请选择"
              style="width: 100%;"
              value-format="yyyy"
              size="small"
              clearable
              @change="onYear('2')"
            />
          </el-form-item>
          <el-form-item
            label="期间"
            prop="period"
          >
            <el-select
              v-model="form.period"
              :loading="selectLoading"
              :disabled="isEdit || !form.year || !form.companyId"
              placeholder="请选择"
              size="small"
              clearable
              filterable
              style="width: 100%;"
              @focus="getFiscalList('2')"
              @change="onFiscal"
            >
              <el-option
                v-for="(item, index) in fiscalList2"
                :key="index"
                :label="item.fiscalPeriod"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="空运业务量"
            prop="airNum"
          >
            <div class="input-content">
              <div style="flex: 1;">
                <el-input-number
                  v-model="form.airNum"
                  class="input-number-valiate input-border"
                  :controls="false"
                  placeholder="请输入"
                  :min="0"
                  :max="999999"
                  :step="1"
                  step-strictly
                />
              </div>
              <div class="input-unit">
                KG
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="海运业务量"
            prop="seaNum"
          >
            <div class="input-content">
              <div style="flex: 1;">
                <el-input-number
                  v-model="form.seaNum"
                  class="input-number-valiate input-border"
                  :controls="false"
                  placeholder="请输入"
                  :min="0"
                  :max="999999"
                  :step="1"
                  step-strictly
                />
              </div>
              <div class="input-unit">
                CBM
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="铁路业务量"
            prop="trainNum"
          >
            <div class="input-content">
              <div style="flex: 1;">
                <el-input-number
                  v-model="form.trainNum"
                  class="input-number-valiate input-border"
                  :controls="false"
                  placeholder="请输入"
                  :min="0"
                  :max="999999"
                  :step="1"
                  step-strictly
                />
              </div>
              <div class="input-unit">
                CBM
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="卡航业务量"
            prop="carNum"
          >
            <div class="input-content">
              <div style="flex: 1;">
                <el-input-number
                  v-model="form.carNum"
                  class="input-number-valiate input-border"
                  :controls="false"
                  placeholder="请输入"
                  :min="0"
                  :max="999999"
                  :step="1"
                  step-strictly
                />
              </div>
              <div class="input-unit">
                KG
              </div>
            </div>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          style="padding: 10px 0;text-align:right;"
        >
          <el-button
            size="small"
            @click="cancel"
          >
            取 消
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="confirm"
          >
            确 定
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import distributInfo from '@/views/sales-management/plan-distribut/distribut.vue'
import {
  getFiscalList,
  getCompanyPlanList,
  savePlan,
  getAgentList
} from '@/api/sales-of-plan-distribut'
import dayjs from 'dayjs'
function paramsForm() {
  return {
    year: undefined,
    period: undefined,
    month: undefined,
    companyId: undefined,
    monthStart: undefined,
    monthEnd: undefined,
    airNum: 0,
    seaNum: 0,
    trainNum: 0,
    carNum: 0
  }
}

@Component({
  name: 'Company',
  components: {
    distributInfo
  },
  props: {
    wsId: {
      type: String,
      default: ''
    }
  }
})

export default class extends Vue {
  /** data */
  private loading: boolean = false
  private dialogShow: boolean = false
  private detailShow: boolean = false
  private dialogLoading: boolean = false
  private selectLoading: boolean = false
  private isEdit: boolean = false
  private tableData: any = []
  private companyList: any = []
  private fiscalList1: any = []
  private fiscalList2: any = []
  private firstId: any = ''
  private firstName: any = ''
  private searchForm: any = {
    year: undefined,
    comId: undefined,
    period: undefined
  }
  private form: any = paramsForm()
  private page: number = 1
  private size: number = 10
  private total: any = 0
  private formRules = {
    companyId: { required: true, message: '请选择所属公司', trigger: 'change' },
    year: { required: true, message: '请选择年度', trigger: 'change' },
    period: { required: true, message: '请选择期间', trigger: 'change' },
    airNum: { required: true, message: '空运业务量不能为空', trigger: 'blur' },
    seaNum: { required: true, message: '海运业务量不能为空', trigger: 'blur' },
    trainNum: { required: true, message: '铁路业务量不能为空', trigger: 'blur' },
    carNum: { required: true, message: '卡航业务量不能为空', trigger: 'blur' }
  }
  /** computed */
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
  get ifCustomer(): boolean {
    const info = UserModule.info || {}
    const ifCustomer = (info as any).ifCustomer === 1
    return ifCustomer
  }

  /** method */
  private closed() {
    this.detailShow = false
    this.queryAll()
  }
  private onCompany(val: any) {
    this.firstId = ''
    this.firstName = ''
    const item = this.companyList.find((it: any) => it.id === val)
    if (item) {
      this.firstId = val
      this.firstName = item.name
    }
    this.tableData = []
    this.queryAll(1)
  }
  private onCompanyChange(val: any) {
    this.form.companyName = ''
    const item = this.companyList.find((it: any) => it.id === val)
    if (item) {
      this.form.companyId = item.id
      this.form.companyName = item.name
    }
  }
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
  private onYear(str: string) {
    if (str === '1') {
      this.searchForm.period = undefined
      this.fiscalList1 = []
    } else {
      this.form.period = undefined
      this.fiscalList2 = []
    }
  }
  private formatMonth(row: any) {
    return row.month + '(' + dayjs(row.monthStart).format('YYYY-MM-DD') + '~' + dayjs(row.monthEnd).format('YYYY-MM-DD') + ')'
  }
  private getFiscalList(str: string) {
    this.selectLoading = true
    const type = (this as any).custType
    const params = {
      page: 1,
      size: 9999,
      year: str === '1' ? this.searchForm.year : this.form.year,
      custTag: '1',
      custId: str === '1' ? [this.firstId] : [this.form.companyId]
    }
    getFiscalList(params)
      .then((res: any) => {
        const data = res.data || {}
        const arr = data.result || []
        if (str === '1') {
          this.fiscalList1 = arr
        } else {
          this.fiscalList2 = arr.filter((it: any) => it.typePlan === '0')
        }
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private onFiscal(val: any) {
    this.form.month = undefined
    this.form.monthStart = undefined
    this.form.monthEnd = undefined
    const item = this.fiscalList2.find((it: any) => it.id === val)
    if (item) {
      this.form.month = item.fiscalPeriod
      this.form.monthStart = item.startTime
      this.form.monthEnd = item.endTime
    }
  }
  private queryAll(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const { comId, ...form } = this.searchForm
    const params = {
      page: this.page,
      size: this.size,
      model: {
        ...form,
        companyId: comId
      }
    }
    getCompanyPlanList(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        this.tableData = data.result || []
        this.total = res.data.total
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

  // 保存
  private confirm(): void {
    const editForm: any = this.$refs.editForm
    editForm.validate((valid: any) => {
      if (valid) {
        this.dialogLoading = true
        const { monthStart, monthEnd, ...obj } = this.form
        const params: any = {
          ...obj,
          monthStart: dayjs(monthStart).format('YYYY-MM-DD') + ' 00:00:00',
          monthEnd: dayjs(monthEnd).format('YYYY-MM-DD') + ' 23:59:59'
        }
        savePlan(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.dialogShow = false
            this.dialogLoading = false
            this.queryAll()
            this.resetForm()
            this.clearValidate()
          })
          .catch((err: any) => {
            this.dialogLoading = false
            return err
          })
      } else {
        return false
      }
    })
  }

  private addPlan() {
    this.form.companyId = this.firstId
    this.form.companyName = this.firstName
    this.isEdit = false
    this.dialogShow = true
  }
  private editRow(row: any) {
    this.isEdit = true
    this.dialogShow = true
    this.form = { ...row }
    this.getFiscalList('2')
  }
  private distributRow(row: any) {
    this.isEdit = true
    this.detailShow = true
    const root: any = this.$refs.distribut
    this.$nextTick(() => {
      root.setData(row, 'company')
    })
  }
  private viewRow(row: any) {
    this.isEdit = false
    this.detailShow = true
    const root: any = this.$refs.distribut
    this.$nextTick(() => {
      root.setData(row, 'company')
    })
  }
  // 取消
  private cancel() {
    this.dialogShow = false
    this.resetForm()
    this.clearValidate()
  }
  private clearValidate() {
    this.$nextTick(() => {
      const editForm: any = this.$refs.editForm
      editForm.clearValidate()
    })
  }
  private resetForm(): void {
    this.form = paramsForm()
    this.fiscalList2 = []
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.queryAll()
  }

  private created() {
    const cid = (this as any).custId
    const cnm = (this as any).custName
    const type = (this as any).custType
    const stype = (this as any).custSubtype
    const iftc = (this as any).ifCustomer
    const pid = (this as any).parentId
    const pnm = (this as any).parentName
    if (type === '2' && stype === '2' && iftc) {
      this.firstId = pid
      this.firstName = pnm
    } else if (type !== '0') {
      this.firstId = cid
      this.firstName = cnm
    } else {
      this.firstId = ''
      this.firstName = ''
    }
    this.queryAll()
  }
}
</script>

<style lang="scss" scoped>
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
.input-content {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.input-unit {
  width: 60px;
  height: 32px;
  background-color: #f5f7fa;
  color: #909399;
  padding: 0 10px;
  border: 1px solid #dcdfe6;
  border-left: 0;
  border-radius: 0 4px 4px 0;
  margin-left: -1px;
}
.input-border {
  ::v-deep .el-input__inner {
    border-radius: 4px 0 0 4px;
  }
}
</style>
