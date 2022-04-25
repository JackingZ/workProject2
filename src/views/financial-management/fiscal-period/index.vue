<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="会计期间"
        />
        <div class="app-panel">
          <el-row type="flex">
            <el-col :span="6">
              <el-button
                v-permission="['fiscalPeriodAdd']"
                :disabled="custType === '2' && custSubtype === '2' && ifCustomer"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-left: 10px"
                @click="addPort"
              >
                新增
              </el-button>
            </el-col>
            <el-col
              :span="18"
              style="text-align:right;"
            >
              <!-- <el-select
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
              </el-select> -->
              <el-date-picker
                v-model="searchForm.year"
                type="year"
                placeholder="年度"
                value-format="yyyy"
                size="small"
                style="width: 200px;margin-right:10px;"
              />
              <el-button
                v-permission="['fiscalPeriodSearch']"
                type="primary"
                size="small"
                @click="getFiscalList(1)"
              >
                查询
              </el-button>
            </el-col>
          </el-row>

          <el-table
            v-loading="loading"
            :data="list"
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              label="年度"
              width="120"
              prop="year"
            />
            <el-table-column
              label="会计期间"
              prop="fiscalPeriod"
            />
            <el-table-column
              label="开始时间"
              width="180"
              prop="startTime"
            />
            <el-table-column
              label="结束时间"
              width="180"
              prop="endTime"
            />
            <el-table-column
              label="备注"
              prop="remarks"
              show-overflow-tooltip
            />

            <el-table-column
              label="操作"
              width="150"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['fiscalPeriodEdit']"
                  :disabled="scope.row.status === '1' || (custType === '2' && custSubtype === '2' && ifCustomer)"
                  type="text"
                  size="medium"
                  @click="editPort(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['fiscalPeriodDelete']"
                  :disabled="scope.row.status === '1' || (custType === '2' && custSubtype === '2' && ifCustomer)"
                  type="text"
                  size="medium"
                  @click="deleteData(scope.row)"
                >
                  删除
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
            title="会计期间"
            width="600px"
            :visible.sync="dialogShow"
            :close-on-click-modal="false"
            @closed="close"
          >
            <div v-loading="dialogLoading">
              <el-form
                ref="theForm"
                :rules="formRules"
                :model="form"
                label-width="100px"
                size="small"
                style="padding-right: 20px;"
              >
                <el-form-item
                  prop="year"
                  label="年度"
                >
                  <el-date-picker
                    v-model="form.year"
                    type="year"
                    value-format="yyyy"
                    placeholder="年度"
                    size="small"
                    style="width: 100%;"
                    @change="form.time = []"
                  />
                </el-form-item>
                <el-form-item
                  prop="fiscalPeriod"
                  label="会计期间"
                >
                  <el-input
                    v-model="form.fiscalPeriod"
                    autocomplete="off"
                    style="width: 100%;"
                    :maxlength="50"
                  />
                </el-form-item>
                <el-form-item
                  prop="time"
                  label="时间区间"
                >
                  <el-date-picker
                    v-model="form.time"
                    :disabled="!form.year"
                    :picker-options="pickerOptions"
                    unlink-panels
                    type="daterange"
                    align="right"
                    size="small"
                    value-format="yyyy-MM-dd"
                    range-separator="~"
                    style="width: 100%;"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                  />
                </el-form-item>
                <el-form-item
                  prop="remarks"
                  label="备注"
                >
                  <el-input
                    v-model="form.remarks"
                    type="textarea"
                    :autosize="{minRows: 2, maxRows: 4}"
                    :maxlength="100"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-form>
              <div
                slot="footer"
                style="text-align: right;padding: 10px 0 20px;"
              >
                <el-button @click="close">
                  取 消
                </el-button>
                <el-button
                  type="primary"
                  @click="saveFiscal"
                >
                  确 定
                </el-button>
              </div>
            </div>
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
import {
  getFiscalList,
  saveFiscal,
  deleteFiscal,
  getUnFinanceAgentList
} from '@/api/financial-at-collection-order'
import dayjs from 'dayjs'

@Component({
  name: 'Fiscal',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private dialogShow: boolean = false
  private dialogLoading: boolean = false
  private selectLoading: boolean = false
  private list: any[] = []
  private companyList: any = []
  private form: any = {
    year: '',
    fiscalPeriod: '',
    startTime: '',
    endTime: '',
    time: [],
    remarks: ''
  }
  private formRules = {
    year: [{ required: true, message: '请选择年度', trigger: 'change' }],
    fiscalPeriod: [{ required: true, message: '会计期间不能为空', trigger: 'blur' }],
    time: [{ required: true, message: '请选择时间区间' }]
  }
  private searchForm: any = {
    year: undefined,
    comType: '1',
    comId: undefined
  }
  private companyTypeList: any[] = [
    { id: '1', name: '本公司' },
    { id: '2', name: '分公司' }
  ]
  private scId: any = this.custId
  private scName: any = this.custName
  private firstId: any = ''
  private page: number = 1
  private size: number = 10
  private total: any = 0

  /* computed */
  get pickerOptions() {
    return {
      disabledDate: (time: any) => {
        if (this.form.year) {
          const start = `${this.form.year}-01-01`
          const end = `${this.form.year}-12-31`
          return dayjs(time).unix() < dayjs(start).unix() || dayjs(time).unix() > dayjs(end).unix()
        }
      }
    }
  }
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
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
    this.list = []
    this.searchForm.comId = ''
    this.companyList = []
    this.scId = ''
    this.scName = ''
    if (this.searchForm.comType !== '2') {
      this.scId = (this as any).custId
      this.scName = (this as any).custName
    }
    this.getFiscalList(1)
  }
  private onCompany() {
    const type = (this as any).custType
    if (type === '2') {
      const item = this.companyList.find((it: any) => it.id === this.searchForm.comId)
      this.scId = (item || {}).id
      this.scName = (item || {}).name
    }
    this.list = []
    this.getFiscalList(1)
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
    }
  }
  private clearValidate() {
    const theForm: any = this.$refs.theForm
    this.$nextTick(() => {
      theForm.clearValidate()
    })
  }

  // 新增
  private addPort(): void {
    this.dialogShow = true
  }

  // 编辑
  private editPort(row: any): void {
    this.dialogShow = true
    if (this.searchForm.comType === '2') {
      this.scId = row.custId
      this.scName = row.custName
    }
    const { startTime, endTime, ...obj } = row
    this.form = {
      ...obj,
      time: [startTime, endTime]
    }
  }

  private deleteData(row: any) {
    const params = {
      id: row.id
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteFiscal(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getFiscalList()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }

  // 关闭dialog重置表单
  private close(): void {
    this.dialogShow = false
    this.reset()
  }

  // 保存表单
  private saveFiscal(): void {
    (this.$refs.theForm as any).validate((valid: any) => {
      if (valid) {
        this.dialogLoading = true
        const { time, ...obj } = this.form
        const params: any = {
          ...obj,
          custId: this.scId,
          custName: this.scName,
          startTime: time[0],
          endTime: time[1]
        }
        saveFiscal(params)
          .then(res => {
            this.close()
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.getFiscalList()
            this.dialogLoading = false
          })
          .catch(err => {
            this.dialogLoading = false
            return err
          })
      } else {
        return false
      }
    })
  }

  // 查询列表
  private getFiscalList(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const { page, size } = this
    const { year } = this.searchForm
    const params = {
      custId: [this.firstId],
      page,
      size,
      year: year || undefined
    }
    getFiscalList(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        const { total, result } = data
        this.total = total
        this.list = result || []
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

  // 重置表单
  private reset(): void {
    this.form = {
      year: '',
      fiscalPeriod: '',
      startTime: '',
      endTime: '',
      time: [],
      remarks: ''
    }
    this.clearValidate()
  }

  private handleSizeChange(): any {
    return 123
  }

  private handleCurrentChange(): any {
    this.getFiscalList()
  }

  private created(): void {
    const cid = (this as any).custId
    const type = (this as any).custType
    const stype = (this as any).custSubtype
    const iftc = (this as any).ifCustomer
    const pid = (this as any).parentId
    this.firstId = type === '2' && stype === '2' && iftc ? pid : cid
    this.getFiscalList()
  }
}
</script>
