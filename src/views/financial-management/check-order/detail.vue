<template>
  <div
    v-loading="detailLoading"
    style="background-color: #ffffff;"
  >
    <div style="padding: 0 20px;line-height: 50px;border-bottom: 1px solid #e8e8e8;">
      <div style="text-align: right;">
        <span
          style="cursor: pointer;"
          @click="handleBack"
        >
          <i class="el-icon-back" />
          <span>返回</span>
        </span>
      </div>
    </div>
    <div class="app-panel order-detail">
      <el-row style="padding: 10px;">
        <el-col
          :span="4"
          style="font-weight: 700;font-size: 18px;line-height: 30px;"
        >
          对账信息
        </el-col>
        <el-col
          :span="20"
          style="text-align: right;"
        >
          <el-button
            v-if="!form.id"
            type="primary"
            size="mini"
            @click="handleSave"
          >
            保存
          </el-button>
        </el-col>
      </el-row>
      <el-form
        ref="editForm"
        :model="form"
        :rules="formRules"
        label-width="100px"
        size="small"
      >
        <el-form-item
          v-if="custType === '2' && custSubtype === '1'"
          label="公司类型"
          prop="custTag"
        >
          <el-select
            v-if="!form.id"
            v-model="form.custTag"
            size="small"
            style="width:100%;"
            filterable
            clearable
            placeholder="请选择"
            @change="onComType"
          >
            <el-option
              label="本公司"
              value="1"
            />
            <el-option
              label="分公司"
              value="2"
            />
          </el-select>
          <span v-else>
            {{ form.custTag === '1' ? '本公司' : form.custTag === '2' ? '分公司' : '' }}
          </span>
        </el-form-item>
        <el-form-item
          v-if="custType === '2' && custSubtype === '1' && form.custTag === '2'"
          label="所属公司"
          prop="agentId"
        >
          <el-select
            v-if="!form.id"
            v-model="form.companyId"
            :loading="selectLoading"
            size="small"
            style="width:100%;"
            placeholder="请选择"
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
          <span v-else>
            {{ form.companyName }}
          </span>
        </el-form-item>
        <el-form-item
          label="年度"
          prop="year"
        >
          <el-date-picker
            v-if="!form.id"
            v-model="form.year"
            type="year"
            value-format="yyyy"
            placeholder="请选择"
            size="small"
            style="width: 100%;"
            @change="onYear"
          />
          <span v-else>
            {{ form.year }}
          </span>
        </el-form-item>
        <el-form-item
          label="类型"
          prop="type"
        >
          <el-select
            v-if="!form.id"
            v-model="form.type"
            style="width:100%;"
            placeholder="请选择"
            @change="onYear"
          >
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <span v-else>
            {{ (typeList.find((it) => it.id === form.type) || {}).name }}
          </span>
        </el-form-item>
        <el-form-item
          label="会计期间"
          prop="fisCalId"
        >
          <el-select
            v-if="!form.id"
            v-model="form.fisCalId"
            :loading="selectLoading"
            :disabled="!form.year || !form.type"
            placeholder="类型"
            size="small"
            clearable
            style="width:100%;"
            @focus="getFiscalList"
            @change="onFiscal"
          >
            <el-option
              v-for="(item, index) in fiscalList"
              :key="index"
              :label="item.fiscalPeriod"
              :value="item.id"
            />
          </el-select>
          <span v-else>
            {{ form.fisCalName }}
          </span>
        </el-form-item>
        <el-form-item
          label="备注"
          style="width: 100%;"
        >
          <el-input
            v-if="!form.id"
            v-model="form.remark"
            type="textarea"
            :autosize="{minRows: 2, maxRows: 4}"
            size="small"
            placeholder="请输入"
            clearable
          />
          <span v-else>
            {{ form.remark }}
          </span>
        </el-form-item>
      </el-form>
      <div v-show="!!form.id">
        <el-row style="padding: 0 10px;">
          <el-col
            :span="4"
            style="font-size: 18px;line-height: 30px;"
          >
            账单明细
          </el-col>
          <el-col
            v-if="!isView"
            :span="20"
            style="text-align: right;"
          >
            <el-button
              type="primary"
              size="mini"
              style="margin-left: 10px"
              @click="showExportModal"
            >
              导入账单
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="autoCheck"
            >
              自动对账
            </el-button>
          </el-col>
        </el-row>
        <div>
          <div
            style="width: 49.9%;display: inline-block;padding: 10px;"
          >
            <div style="font-size: 12px;">
              <span>账单总数：{{ totalNum }}</span>
              <span>&nbsp;(</span>
              <span
                v-for="(item, index) in totalOption"
                :key="index"
              >
                <span>{{ item.name + '：' }}</span>
                <span>{{ item.count + ' ' }}</span>
              </span>
              <span>)&nbsp;</span>
              <span>已对账：{{ checkNum }}</span>
              <span>&nbsp;(</span>
              <span
                v-for="(item, index) in checkOption"
                :key="index"
              >
                <span>{{ item.name + '：' }}</span>
                <span>{{ item.count + ' ' }}</span>
              </span>
              <span>)&nbsp;</span>
              <span>未对账：{{ unCheckNum }}</span>
              <span>&nbsp;(</span>
              <span
                v-for="(item, index) in ncheckOption"
                :key="index"
              >
                <span>{{ item.name + '：' }}</span>
                <span>{{ item.count + ' ' }}</span>
              </span>
              <span>)&nbsp;</span>
            </div>
            <div style="text-align: right;padding-top: 10px;">
              <el-select
                v-model="searchForm1.ifChecking"
                placeholder="对账"
                size="small"
                clearable
                style="width:100px;margin-right:5px;"
              >
                <el-option
                  label="未对账"
                  :value="0"
                />
                <el-option
                  label="已对账"
                  :value="1"
                />
              </el-select>
              <el-select
                v-model="searchForm1.payMethod"
                placeholder="收款方式"
                size="small"
                clearable
                style="width:100px;margin-right:5px;"
              >
                <el-option
                  v-for="(item, index) in sourceList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-date-picker
                v-model="searchForm1.time"
                :picker-options="pickerOptions"
                unlink-panels
                type="daterange"
                align="right"
                size="small"
                value-format="yyyy-MM-dd"
                range-separator="-"
                style="width: 220px;margin-right:5px;"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
              <el-input
                v-model="searchForm1.code"
                placeholder="请输入"
                class="input-with-select"
                style="width:250px;margin-right:10px;"
                size="small"
                clearable
              >
                <el-select
                  slot="prepend"
                  v-model="searchForm1.codeType"
                  size="small"
                  style="width:110px;"
                  placeholder="请选择"
                >
                  <el-option
                    label="客户名称"
                    value="1"
                  />
                  <el-option
                    label="回款金额"
                    value="2"
                  />
                  <el-option
                    label="付款凭证号"
                    value="3"
                  />
                </el-select>
              </el-input>
              <el-button
                type="primary"
                size="small"
                @click="getOrderList"
              >
                查询
              </el-button>
            </div>
            <el-table
              id="leftTable"
              :data="tableData"
              :row-class-name="rowClassName"
              style="width: 100%;margin: 10px 0;"
              height="450px"
              header-align="center"
              align="center"
              border
            >
              <el-table-column
                prop="payDate"
                width="160"
                label="回款日期"
              />
              <el-table-column
                prop="custName"
                min-width="130"
                label="客户名称"
              />
              <el-table-column
                prop=""
                label="收款方式/账号"
                min-width="130"
              >
                <template slot-scope="scope">
                  <div>{{ (sourceList.find(e => e.id === scope.row.payMethod) || {}).name }}</div>
                  <div>{{ scope.row.payAccount || '' }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop=""
                label="回款金额/货币"
                width="140"
              >
                <template slot-scope="scope">
                  <div>{{ scope.row.amount || '' }}</div>
                  <div>{{ (scope.row.currencyId || '') + '/' + (scope.row.currencyName || '') }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="serialNumber"
                label="付款凭证号"
                min-width="130"
              />
              <el-table-column
                prop=""
                label="对账状态"
                width="100"
                fixed="right"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.ifChecking === 1">
                    <el-button
                      :disabled="isView"
                      type="text"
                      size="small"
                      @click="updateStatus(scope.row)"
                    >
                      已对账
                    </el-button>
                  </span>
                  <span v-if="scope.row.ifChecking === 0">未对账</span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :current-page.sync="page1"
              :page-size="size"
              layout="total, prev, pager, next"
              :total="total1"
              style="text-align: right;"
              @current-change="(current) => handleLeftChange(current)"
            />
          </div>
          <div
            style="width: 49.9%;display: inline-block;padding: 10px;"
          >
            <div style="color: #909399;font-size: 12px;">
              拖拽表格到左侧进行对账
            </div>
            <div style="text-align: right;padding-top: 10px;">
              <el-select
                v-model="searchForm2.ifChecking"
                placeholder="对账"
                size="small"
                clearable
                style="width:100px;margin-right:5px;"
              >
                <el-option
                  label="未对账"
                  :value="0"
                />
                <el-option
                  label="已对账"
                  :value="1"
                />
              </el-select>
              <el-select
                v-model="searchForm2.backType"
                placeholder="收款方式"
                size="small"
                clearable
                style="width:100px;margin-right:5px;"
              >
                <el-option
                  v-for="(item, index) in sourceList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-date-picker
                v-model="searchForm2.time"
                unlink-panels
                type="daterange"
                align="right"
                size="small"
                value-format="yyyy-MM-dd"
                range-separator="-"
                style="width: 220px;margin-right:5px;"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
              <el-input
                v-model="searchForm2.code"
                placeholder="请输入"
                class="input-with-select"
                style="width:250px;margin-right:10px;"
                size="small"
                clearable
              >
                <el-select
                  slot="prepend"
                  v-model="searchForm2.codeType"
                  size="small"
                  style="width:110px;"
                  placeholder="请选择"
                >
                  <el-option
                    label="客户名称"
                    value="1"
                  />
                  <el-option
                    label="回款金额"
                    value="2"
                  />
                  <el-option
                    label="付款凭证号"
                    value="3"
                  />
                </el-select>
              </el-input>
              <el-button
                type="primary"
                size="small"
                @click="getBankList"
              >
                查询
              </el-button>
            </div>
            <el-table
              id="rightTable"
              :data="selectedData"
              style="width: 100%;margin: 10px 0;"
              height="450px"
              header-align="center"
              align="center"
              border
            >
              <el-table-column
                v-if="!isView"
                label=""
                width="50"
              >
                <div
                  class="sort-icon"
                  style="cursor: move"
                >
                  <i class="el-icon-sort" />
                </div>
              </el-table-column>
              <el-table-column
                prop="backTime"
                width="160"
                label="回款日期"
              />
              <el-table-column
                prop="customerName"
                min-width="130"
                label="客户名称"
              />
              <el-table-column
                prop=""
                label="收款方式/账号"
                min-width="130"
              >
                <template slot-scope="scope">
                  <div>{{ (sourceList.find(e => e.id === scope.row.backType) || {}).name }}</div>
                  <div>{{ scope.row.accountNumber || '' }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop=""
                label="回款金额/货币"
                width="140"
              >
                <template slot-scope="scope">
                  <div>{{ scope.row.money || '' }}</div>
                  <div>{{ (scope.row.currency || '') }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="serialNumber"
                label="付款凭证号"
                min-width="130"
              />
              <el-table-column
                prop=""
                label="对账状态"
                width="100"
                fixed="right"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.ifChecking === 1">已对账</span>
                  <span v-if="scope.row.ifChecking === 0">未对账</span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :current-page.sync="page2"
              :page-size="size"
              layout="total, prev, pager, next"
              :total="total2"
              style="text-align: right;"
              @current-change="(current) => handleRightChange(current)"
            />
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="导入"
      width="500px"
      :visible.sync="visibleFile"
      :close-on-click-modal="false"
      @closed="cancelExport"
    >
      <div v-loading="exportLoading">
        <p>下载模板导入账单信息</p>
        <div style="display: flex;justify-content: flex-end">
          <el-button
            size="small"
            style="margin-right: 10px"
            @click="downloadFile"
          >
            模板下载
          </el-button>
          <el-upload
            ref="uploadFile"
            action
            :multiple="false"
            :show-file-list="false"
            :file-list="fileList"
            accept=".xlsx,.xls"
            :limit="1"
            :auto-upload="true"
            :http-request="uploadFile"
          >
            <el-button
              size="small"
              type="primary"
            >
              导入excel
            </el-button>
          </el-upload>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import Sortablejs from 'sortablejs'
import {
  getFiscalList,
  getListCheck,
  getSingleCheck,
  getSingleStatus,
  setAutoCheck,
  exportCheck,
  saveCheck,
  getPaymentList,
  getReceiveList,
  getCheckCount,
  getUnFinanceAgentList
} from '@/api/financial-at-collection-order'
import dayjs from 'dayjs'

function formParams() {
  return {
    id: undefined,
    year: undefined,
    custTag: '1',
    companyId: undefined,
    companyName: undefined,
    fisCalId: undefined,
    fisCalName: undefined,
    startTime: undefined,
    endTime: undefined,
    remark: undefined,
    type: undefined
  }
}

@Component({
  name: 'detail',
  components: {},
  props: {
    isAdd: {
      type: Boolean,
      default: false
    },
    isView: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isOnce: {
      type: Boolean,
      default: false
    },
    typeList: {
      type: Array,
      default: () => ([])
    },
    firstId: {
      type: String,
      default: ''
    }
  }
})

export default class extends Vue {
  /* data */
  private form: any = formParams()
  private searchForm1: any = {
    ifChecking: undefined,
    time: [],
    payMethod: undefined,
    custName: undefined,
    code: undefined,
    codeType: '1'
  }
  private searchForm2: any = {
    ifChecking: undefined,
    time: [],
    code: undefined,
    codeType: '1',
    backType: undefined,
    start: undefined,
    end: undefined
  }
  private formRules: any = {
    custTag: [{ required: true, message: '请选择公司类型', trigger: 'change' }],
    companyId: [{ required: true, message: '请选择所属公司', trigger: 'change' }],
    year: [{ required: true, message: '请选择年度', trigger: 'change' }],
    fisCalId: [{ required: true, message: '请选择会计期间', trigger: 'change' }],
    type: [{ required: true, message: '请选择类型', trigger: 'change' }]
  }
  private sourceList: any[] = [
    { name: '银行汇款', id: '0' },
    { name: '微信', id: '1' },
    { name: '支付宝', id: '2' },
    { name: 'PayPal', id: '3' },
    { name: '其它', id: '4' }
  ]
  private checkOption: any[] = []
  private ncheckOption: any[] = []
  private totalOption: any[] = []
  private detailLoading: boolean = false
  private selectLoading: boolean = false
  private visibleFile: boolean = false
  private exportLoading: boolean = false
  private fiscalList: any[] = []
  private fileList: any[] = []
  private tableData: any[] = []
  private companyList: any[] = []
  private selectedData: any[] = []
  private selectObj: any = {}
  private total1: number = 0
  private page1: number = 1
  private total2: number = 0
  private page2: number = 1
  private size: number = 10

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
  get pickerOptions() {
    return {
      disabledDate: (time: any) => {
        const start = this.form.startTime
        const end = this.form.endTime
        return dayjs(time).unix() < dayjs(start).unix() || dayjs(time).unix() > dayjs(end).unix()
      }
    }
  }
  get totalNum() {
    return this.totalOption.reduce((tax: number, item: any) => {
      tax += (item.count || 0)
      return tax
    }, 0)
  }
  get checkNum() {
    return this.checkOption.reduce((tax: number, item: any) => {
      tax += (item.count || 0)
      return tax
    }, 0)
  }
  get unCheckNum() {
    return this.ncheckOption.reduce((tax: number, item: any) => {
      tax += (item.count || 0)
      return tax
    }, 0)
  }
  /* 方法 */
  private onComType() {
    this.form.companyId = ''
    this.form.companyName = ''
    if (this.form.custTag !== '2') {
      this.form.companyId = (this as any).custId
      this.form.companyName = (this as any).custName
    }
  }
  private onCompany() {
    this.form.companyName = ''
    const item = this.companyList.find((it: any) => it.id === this.form.companyId)
    if (item) {
      this.form.companyName = item.name
    }
  }
  private getCompanyList() {
    // 分公司
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
  private async getFiscalList() {
    this.selectLoading = true
    const params = {
      page: 1,
      size: 9999,
      year: this.form.year,
      custId: [(this as any).firstId]
    }
    await getFiscalList(params)
      .then((res: any) => {
        const data = res.data || {}
        const arr = data.result || []
        const pr = this.form.type === 'P' ? 'typeP' : this.form.type === 'R' ? 'typeR' : ''
        this.fiscalList = arr.filter((it: any) => pr && it[pr] !== '1')
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private onYear() {
    this.form.fisCalId = ''
    this.onFiscal(this.form.fisCalId)
  }
  private onFiscal(val: string) {
    const item = this.fiscalList.find((it: any) => it.id === val) || {}
    this.form.startTime = item.startTime
    this.form.endTime = item.endTime
    this.form.fisCalName = item.fiscalPeriod
  }
  private handleBack() {
    this.tableData = []
    this.selectedData = []
    this.checkOption = []
    this.ncheckOption = []
    this.totalOption = []
    this.form = formParams()
    this.$emit('back')
    this.$emit('getTableData')
  }
  private validateData(callback: any) {
    let flag = true
    const editForm: any = this.$refs.editForm
    editForm.validate((valid: any) => {
      flag = valid
    })
    callback(flag)
  }
  private handleSave() {
    this.validateData((valid: any) => {
      if (!valid) return false
      this.detailLoading = true
      const params: any = {
        ...this.form
      }
      saveCheck(params).then((res: any) => {
        const data = res.data || {}
        this.form.id = data.id
        this.$message.success('提交成功')
        this.detailLoading = false
      }).catch(() => {
        this.detailLoading = false
      })
    })
  }

  private showExportModal() {
    this.visibleFile = true
    this.fileList = []
  }
  private cancelExport() {
    this.visibleFile = false
  }
  private downloadFile() {
    const a = document.createElement('a')
    document.body.appendChild(a)
    // TODO 修改模板地址
    a.href = '/files/账单信息模板.xlsx'
    a.click()
    document.body.removeChild(a)
  }
  private uploadFile(params: any): void {
    this.visibleFile = false
    const { file } = params
    const form: FormData = new FormData()
    form.append('file', file)
    form.append('id', this.form.id)
    exportCheck(form)
      .then(async(res: any) => {
        this.$message.success('导入成功')
        await this.getBankList()
      })
      .catch((err: any) => {
        return err
      })
  }

  private autoCheck() {
    this.detailLoading = true
    const { startTime, endTime, type, id } = this.form
    const ctype = (this as any).custType
    const params: any = {
      agentId: [this.form.companyId],
      custTag: ctype === '3' ? '34' : this.form.custTag,
      start: startTime,
      end: endTime,
      type,
      rid: id
    }
    setAutoCheck(params).then(async(res: any) => {
      this.$message.success('提交成功')
      this.detailLoading = false
      const data = res.data || {}
      this.checkOption = data.check || []
      this.ncheckOption = data.ncheck || []
      this.totalOption = data.total || []
      await this.getOrderList()
      await this.getBankList()
    }).catch((err: any) => {
      this.detailLoading = false
      return err
    })
  }
  private updateStatus(row: any) {
    const { startTime, endTime, type } = this.form
    const ctype = (this as any).custType
    const params: any = {
      agentId: [this.form.companyId],
      custTag: ctype === '3' ? '34' : this.form.custTag,
      start: startTime,
      end: endTime,
      type,
      rid: row.id
    }
    this.$confirm('请确认是否变更已对账状态?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        getSingleStatus(params)
          .then(async(res: any) => {
            this.$message({
              type: 'success',
              message: '提交成功'
            })
            const data = res.data || {}
            this.checkOption = data.check || []
            this.ncheckOption = data.ncheck || []
            this.totalOption = data.total || []
            await this.getOrderList()
            await this.getBankList()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }
  // 拖动
  private rowClassName(data: any) {
    const { row } = data
    return 'left-row row_id-' + row.id
  }
  // sortable拖拽效果
  private initSortable() {
    const el: any = document.querySelector('#rightTable .el-table__body-wrapper > table > tbody')
    const that = this
    Sortablejs.create(el, {
      handle: '.sort-icon',
      group: 'el_table',
      animation: 300,
      onEnd: (evt: any) => {
        that.sortableOnEnd(evt)
      }
    })
    const el1: any = document.querySelector('#leftTable .el-table__body-wrapper > table > tbody')
    Sortablejs.create(el1, {
      disabled: true,
      group: 'el_table',
      animation: 300
    })
  }
  private sortableOnEnd(evt: any) {
    const { newIndex, oldIndex, originalEvent } = evt
    const target = originalEvent.target
    const currRow = this.selectedData[oldIndex] || {}
    this.selectObj.importId = currRow.id
    let targetClassName = target.className
    let parent = target
    while (targetClassName.indexOf('el-table__row') === -1) {
      parent = parent.parentElement
      targetClassName = parent.className
    }
    if (targetClassName.indexOf('left-row') === -1) {
      // 列表排序
    } else {
      // 移出到另一个列表
      const classList = targetClassName.split(' ')
      const classId = classList.find((e: any) => e.indexOf('row_id') !== -1)
      const id = classId.split('-')[1]
      const tamp = this.tableData.find((e: any) => e.id === id) || {}
      this.selectObj.rid = tamp.id
      this.getSingleCheck()
      // 松手后添加动画
      parent.className = targetClassName + ' pulse'
      // 动画结束后移除 防止下次再次移入时无法触发动画
      parent.onanimationend = () => {
        parent.className = parent.className.split(' ').filter((e: string) => e !== 'pulse').join(' ')
      }
    }
  }
  private getSingleCheck() {
    const { startTime, endTime, type } = this.form
    const itemS = this.selectedData.find((it: any) => it.id === this.selectObj.importId) || {}
    const itemT = this.tableData.find((it: any) => it.id === this.selectObj.rid) || {}
    if (itemS.ifChecking === 1 || itemT.ifChecking === 1) {
      this.$message.error('存在已对账状态，无法关联')
      return
    }
    const ctype = (this as any).custType
    const params: any = {
      agentId: [this.form.companyId],
      custTag: ctype === '3' ? '34' : this.form.custTag,
      start: startTime,
      end: endTime,
      type,
      ...this.selectObj
    }
    this.$confirm('请确认是否绑定该账单?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        getSingleCheck(params)
          .then(async(res: any) => {
            this.$message({
              type: 'success',
              message: '提交成功'
            })
            const data = res.data || {}
            this.checkOption = data.check || []
            this.ncheckOption = data.ncheck || []
            this.totalOption = data.total || []
            await this.getOrderList()
            await this.getBankList()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }

  private async getOrderList() {
    this.detailLoading = true
    const { startTime, endTime, type, fisCalId } = this.form
    const { code, codeType, time, ...form } = this.searchForm1
    const ctype = (this as any).custType
    const params: any = {
      model: {
        ...form,
        agentId: [this.form.companyId],
        custName: codeType === '1' ? code : undefined,
        money: codeType === '2' ? code : undefined,
        serialNumber: codeType === '3' ? code : undefined,
        custTag: ctype === '3' ? '34' : this.form.custTag,
        start: time && time.length > 0 ? time[0] : startTime,
        end: time && time.length > 0 ? time[1] : endTime
      },
      page: this.page1,
      size: this.size
    }
    let func: any = null
    if (type === 'P') {
      func = getPaymentList
    } else if (type === 'R') {
      func = getReceiveList
    } else {
      this.detailLoading = false
      this.tableData = []
      this.total1 = 0
      return
    }
    await func(params)
      .then((res: any) => {
        const data = res.data || {}
        this.tableData = data.result || []
        this.total1 = data.total
        this.detailLoading = false
      }).catch((err: any) => {
        this.detailLoading = false
        return err
      })
  }
  private async handleLeftChange(current: any) {
    this.page1 = current
    await this.getOrderList()
  }
  private async handleRightChange(current: any) {
    this.page2 = current
    await this.getBankList()
  }

  private async getBankList() {
    // 对账来源于银行数据
    this.detailLoading = true
    const { code, codeType, time, ...form } = this.searchForm2
    const { type, fisCalId } = this.form
    const params = {
      model: {
        ...form,
        customer: codeType === '1' ? code : undefined,
        money: codeType === '2' ? code : undefined,
        serialNumber: codeType === '3' ? code : undefined,
        fisCalId,
        type,
        start: time && time.length > 0 ? time[0] : undefined,
        end: time && time.length > 0 ? time[1] : undefined
      },
      page: this.page2,
      size: this.size
    }
    await getListCheck(params)
      .then(async(res: any) => {
        const data = res.data
        this.selectedData = data.result || []
        this.total2 = data.total
        this.detailLoading = false
      }).catch((err: any) => {
        this.detailLoading = false
        return err
      })
  }

  private async show(row: any) {
    this.detailLoading = true
    const editForm: any = this.$refs.editForm
    this.$nextTick(() => {
      editForm.clearValidate()
    })
    if (row) {
      this.form = { ...row }
      try {
        const params: any = {
          page: 1,
          size: 9999,
          year: this.form.year,
          custId: [(this as any).firstId]
        }
        const res = await getFiscalList(params)
        const data = res.data || {}
        const arr = data.result || []
        const item = arr.find((it: any) => it.id === this.form.fisCalId) || {}
        this.form.startTime = item.startTime
        this.form.endTime = item.endTime
        const ctype = (this as any).custType
        const paramsC: any = {
          agentId: [this.form.companyId],
          custTag: ctype === '3' ? '34' : this.form.custTag,
          start: this.form.startTime,
          end: this.form.endTime,
          type: this.form.type
        }
        const resC = await getCheckCount(paramsC)
        const dataC = resC.data || {}
        this.checkOption = dataC.check || []
        this.ncheckOption = dataC.ncheck || []
        this.totalOption = dataC.total || []
        await this.getOrderList()
        await this.getBankList()
      } catch (error) {
        this.detailLoading = false
      }
    } else {
      this.form = formParams()
      this.form.companyId = (this as any).custId
      this.form.companyName = (this as any).custName
      this.tableData = []
      this.selectedData = []
    }
    this.detailLoading = false
  }
  private async mounted() {
    this.initSortable()
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item__label {
  font-weight: 700 !important;
}
.order-detail {
  height: calc(100vh - 170px);
  overflow-y: auto;
}

.el-form-item {
  vertical-align: top;
  display: inline-block;
  width: 24.9%;
}
::v-deep .el-table .pulse{
  animation-name: pulse;
  animation-fill-mode: both;
  animation-duration: .5s;
}
@keyframes pulse{
  0%{
    transform: scale3d(1, 1, 1);
  }
  50%{
    transform: scale3d(1.1, 1.1, 1.1);
  }
  100%{
    transform: scale3d(1, 1, 1);
  }
}
</style>
