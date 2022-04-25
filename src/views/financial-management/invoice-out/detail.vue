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
          开票信息
        </el-col>
        <el-col
          :span="20"
          style="text-align: right;"
        >
          <el-button
            v-if="!isView"
            type="primary"
            size="mini"
            @click="handleSave"
          >
            {{ isOnce ? '提交' : '重新提交' }}
          </el-button>
          <el-button
            v-else
            type="primary"
            size="mini"
            @click="handleExport"
          >
            导出
          </el-button>
        </el-col>
      </el-row>
      <el-form
        ref="editForm"
        :model="form"
        :rules="formRules"
        label-width="120px"
        size="small"
        :class="isView ? 'view-item' : ''"
      >
        <el-form-item
          label="客户"
          prop="clientName"
        >
          <el-input
            v-if="!isView"
            v-model="form.clientName"
            size="small"
            placeholder="请输入"
            disabled
          >
            <el-button
              v-if="isOnce"
              slot="append"
              icon="el-icon-search"
              @click="handleCustomer"
            />
          </el-input>
          <span v-else>
            {{ form.clientName }}
          </span>
        </el-form-item>
        <el-form-item
          label="服务类型"
          prop="serviceTypeId"
        >
          <el-select
            v-if="!isView"
            v-model="form.serviceTypeId"
            :disabled="!form.clientId"
            style="width:100%;"
            :loading="selectLoading"
            placeholder="请选择"
            clearable
            filterable
            @change="onServiceType"
            @focus="getServiceType"
          >
            <el-option
              v-for="item in serviceTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <span v-else>
            {{ form.serviceTypeName }}
          </span>
        </el-form-item>
        <el-form-item
          label="开票日期"
          prop="invDate"
        >
          <el-date-picker
            v-if="!isView"
            v-model="form.invDate"
            type="datetime"
            style="width: 100%;"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择"
          />
          <span v-else>
            {{ form.invDate }}
          </span>
        </el-form-item>
        <el-form-item
          v-if="isView"
          label="审核时间"
        >
          <span>
            {{ form.auditTime }}
          </span>
        </el-form-item>
        <el-form-item
          label="是否税务开票"
          prop="ifBill"
        >
          <el-radio-group
            v-if="!isView"
            v-model="form.ifBill"
            size="small"
          >
            <el-radio :label="0">
              否
            </el-radio>
            <el-radio :label="1">
              是
            </el-radio>
          </el-radio-group>
          <span v-else>
            {{ form.ifBill === 1 ? '是' : '否' }}
          </span>
        </el-form-item>
        <el-form-item
          label="备注"
          style="width: 100%;"
        >
          <el-input
            v-if="!isView"
            v-model="form.remark"
            type="textarea"
            :rows="3"
            size="small"
            placeholder="请输入"
            clearable
          />
          <span v-else>
            {{ form.remark }}
          </span>
        </el-form-item>
      </el-form>
      <div>
        <span style="font-size: 16px;color: #303133;line-height: 32px;padding-right: 20px;">明细行</span>
        <el-radio-group
          v-if="!isView"
          v-model="selectVal"
          size="small"
          @change="onSelected"
        >
          <el-radio-button
            label="all"
          >
            全部
          </el-radio-button>
          <el-radio-button
            label="selected"
          >
            已选择
          </el-radio-button>
        </el-radio-group>
      </div>
      <div
        v-if="selectVal === 'all' && tableData.length"
        v-loading="loading"
      >
        <vxe-table
          ref="tables"
          :data="tableData"
          :auto-resize="true"
          style="width: 100%;margin: 10px 0;"
          height="450"
          header-align="center"
          align="center"
          border
          resizable
          size="small"
          @checkbox-change="handleSelected"
          @checkbox-all="handleSelectAll"
        >
          <vxe-table-column
            :visible="!isView"
            fixed="left"
            type="checkbox"
            width="55"
          />
          <vxe-table-column
            :visible="form.serviceTypeId !== '02' && form.serviceTypeId !== '06'"
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
            :visible="form.serviceTypeId === '02' || form.serviceTypeId === '06'"
            width="160"
            title="SO号"
          >
            <template slot-scope="scope">
              <span>{{ (scope.row.soNoList || []).join(',') }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            :visible="form.serviceTypeId === '02'"
            width="160"
            title="提单号"
          >
            <template slot-scope="scope">
              <span>{{ (scope.row.billNoList || []).join(',') }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            :visible="form.serviceTypeId === '02'"
            width="160"
            title="航空单号"
          >
            <template slot-scope="scope">
              <span>{{ (scope.row.airNoList || []).join(',') }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            :visible="form.serviceTypeId === '02'"
            width="160"
            title="柜号"
          >
            <template slot-scope="scope">
              <span>{{ (scope.row.containerNoList || []).join(',') }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            title="状态"
            width="120"
          >
            <template slot-scope="scope">
              <span>{{ (statusList.find(e => e.id === scope.row.status) || {}).name }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            title="核销状态"
            width="120"
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
            title="客户名称"
            min-width="200"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.clientName }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            title="客户属性"
            width="100"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.clientProperty === '0'">聚货通</span>
              <span v-else-if="scope.row.clientProperty === '2-1'">一级代理</span>
              <span v-else-if="scope.row.clientProperty === '2-2'">二级代理</span>
              <span v-else-if="scope.row.clientProperty === '1-0'">直客</span>
              <span v-else-if="scope.row.clientProperty === '1-1'">同行</span>
              <span v-else>--</span>
            </template>
          </vxe-table-column>
          <vxe-table-column
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
            min-width="100"
            title="本币金额"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.selfAmount }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            width="180"
            title="创建时间"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            width="180"
            title="审核时间"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.auditTime }}</span>
            </template>
          </vxe-table-column>
        </vxe-table>
        <el-pagination
          :current-page.sync="page"
          :page-size="size"
          layout="total, prev, pager, next"
          :total="total"
          style="text-align: right;"
          @current-change="(current) => handleCurrentChange(current, 'project')"
        />
      </div>
      <div v-if="selectVal === 'selected' && selectedData.length">
        <div
          style="padding: 10px 10px 0 0;text-align: right;"
        >
          <span style="font-size: 12px;">本币总金额：</span>
          <span>{{ selfAmount }}&nbsp;&nbsp;</span>
          <span
            v-for="(item) in amountList"
            :key="item.key"
          >
            <span style="font-size: 12px;">{{ item.label }}：</span>
            <span style="">{{ item.value }}&nbsp;&nbsp;</span>
          </span>
        </div>
        <vxe-table
          :data="selectedData"
          :auto-resize="true"
          style="width: 100%;margin: 10px 0;"
          height="450"
          header-align="center"
          align="center"
          border
          size="small"
        >
          <vxe-table-column
            :visible="form.serviceTypeId !== '02' && form.serviceTypeId !== '06'"
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
            :visible="form.serviceTypeId === '02' || form.serviceTypeId === '06'"
            width="160"
            title="SO号"
          >
            <template slot-scope="scope">
              <span>{{ (scope.row.soNoList || []).join(',') }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            :visible="form.serviceTypeId === '02'"
            width="160"
            title="提单号"
          >
            <template slot-scope="scope">
              <span>{{ (scope.row.billNoList || []).join(',') }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            :visible="form.serviceTypeId === '02'"
            width="160"
            title="航空单号"
          >
            <template slot-scope="scope">
              <span>{{ (scope.row.airNoList || []).join(',') }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            :visible="form.serviceTypeId === '02'"
            width="160"
            title="柜号"
          >
            <template slot-scope="scope">
              <span>{{ (scope.row.containerNoList || []).join(',') }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            prop="status"
            title="状态"
            width="120"
          >
            <template slot-scope="scope">
              <span>{{ (statusList.find(e => e.id === scope.row.status) || {}).name }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            title="核销状态"
            width="120"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.ifVerify === 1">已核销</span>
              <span v-if="scope.row.ifVerify === 0">未核销</span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            title="发票日期"
            width="180"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.invDate }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            title="客户名称"
            min-width="200"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.clientName }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            prop=""
            title="客户属性"
            width="100"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.clientProperty === '0'">聚货通</span>
              <span v-else-if="scope.row.clientProperty === '2-1'">一级代理</span>
              <span v-else-if="scope.row.clientProperty === '2-2'">二级代理</span>
              <span v-else-if="scope.row.clientProperty === '1-0'">直客</span>
              <span v-else-if="scope.row.clientProperty === '1-1'">同行</span>
              <span v-else>--</span>
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
            min-width="100"
            title="本币金额"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.selfAmount }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            width="180"
            title="创建时间"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            prop="auditTime"
            width="180"
            title="审核时间"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.auditTime }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            title="操作"
            fixed="right"
            width="100"
          >
            <template slot-scope="scope">
              <el-button
                v-if="!isView"
                type="text"
                size="medium"
                @click="deleteRow(scope.$index)"
              >
                删除
              </el-button>
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>

      <el-dialog
        title="选择客户"
        :visible.sync="isCustomer"
        :close-on-click-modal="false"
        width="1000px"
        @closed="isCustomer = false"
      >
        <div style="text-align: right;">
          <el-select
            v-if="custType === '2' && custSubtype === '1'"
            v-model="form.custTag"
            size="small"
            style="width:130px;margin-right: 5px;"
            filterable
            clearable
            placeholder="公司类型"
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
          <el-select
            v-if="custType === '2' && custSubtype === '1' && form.custTag === '2'"
            v-model="form.agentId"
            :loading="selectLoading"
            size="small"
            style="width:130px;margin-right: 5px;"
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
            v-model="form.clientType"
            placeholder="客户类型"
            size="small"
            style="width:130px;margin-right: 5px;"
            filterable
            @change="onClientType"
          >
            <el-option
              v-for="(item, index) in custTypeList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-input
            v-if="!(custType === '3' && form.clientType === '0')"
            v-model="searchForm.name"
            placeholder="客户"
            style="width: 200px;margin-right:10px;"
            size="small"
            clearable
          />
          <el-button
            type="primary"
            size="small"
            @click="onCustomer"
          >
            查询
          </el-button>
        </div>
        <el-table
          v-loading="dialogLoading"
          :data="customerList"
          border
          height="375px"
          style="width: 100%;margin: 10px 0;"
          @row-click="(row) => onTableRowClick(row, 'customer')"
        >
          <el-table-column
            prop="name"
            label="客户名称"
          />
          <el-table-column
            prop=""
            label="客户属性"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.type === '0'">聚货通</span>
              <span v-else-if="scope.row.type === '3'">供应商</span>
              <span v-else-if="scope.row.type === '2' && scope.row.subtype === '1'">一级代理</span>
              <span v-else-if="scope.row.type === '2' && scope.row.subtype === '2'">二级代理</span>
              <span v-else-if="scope.row.type === '1' && scope.row.subtype === '0'">直客</span>
              <span v-else-if="scope.row.type === '1' && scope.row.subtype === '1'">同行</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="parentName"
            label="所属上级"
          />
        </el-table>
        <el-pagination
          :current-page.sync="pagination.page"
          :page-size="pagination.size"
          layout="total, prev, pager, next"
          :total="pagination.total"
          style="text-align: right;"
          @current-change="handlePageChange"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getUsingServiceType,
  getOutInvoiceById,
  addOutInvoice,
  editOutInvoice,
  getCustomerList,
  getCurrencyList,
  exportOutInvoice,
  getInvoiceList,
  getAgentList,
  getUnFinanceAgentList
} from '@/api/financial-at-collection-order'
import dayjs from 'dayjs'

function formParams() {
  return {
    ifBill: 0,
    clientId: undefined,
    clientName: undefined,
    clientType: undefined,
    custTag: undefined,
    agentId: undefined,
    agentName: undefined,
    invDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    serviceTypeId: undefined,
    serviceTypeName: undefined,
    remark: undefined,
    amount: undefined,
    currencyMap: undefined,
    currencyId: undefined
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
    statusList: {
      type: Array,
      default: () => ([])
    }
  }
})

export default class extends Vue {
  /* data */
  private dayjs: any = dayjs
  private form: any = formParams()
  private selectVal: any = ''
  private searchForm: any = {
    name: ''
  }
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  private formRules: any = {
    agentId: [{ required: true, message: '请选择所属公司', trigger: 'change' }],
    serviceTypeId: [{ required: true, message: '请选择服务类型', trigger: 'change' }],
    ifBill: [{ required: true, message: '请选择是否开票', trigger: 'change' }],
    clientName: [{ required: true, message: '客户不能为空', trigger: 'change' }],
    invDate: [{ required: true, message: '请选择日期', trigger: 'change' }]
  }
  private detailLoading: boolean = false
  private dialogLoading: boolean = false
  private selectLoading: boolean = false
  private loading: boolean = false
  private isCustomer: boolean = false
  private serviceTypeList: any[] = []
  private tableData: any[] = []
  private selectedData: any[] = []
  private customerData: any[] = []
  private currencyList: any[] = []
  private companyList: any[] = []
  private custTypeList: any[] = []
  private total: number = 0
  private page: number = 1
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
  get customerList() {
    return this.customerData.slice((this.pagination.page - 1) * this.pagination.size, (this.pagination.page) * this.pagination.size)
  }
  get selfAmount(): number {
    let amount: number = 0
    amount = this.selectedData.reduce((amountFilter: number, item: any) => {
      const mathPV = item.selfAmount
      amountFilter += parseFloat(mathPV.toFixed(2))
      return amountFilter
    }, 0)
    return parseFloat(amount.toFixed(2))
  }
  get amountList() {
    const arr: any[] = []
    const obj: any = (this as any).amountObj
    Object.keys(obj).map((key: any) => {
      const item = this.currencyList.find((it: any) => it.id === key)
      if (item) {
        arr.push({
          label: (item || {}).name + '总金额',
          key,
          value: obj[key]
        })
      }
    })
    return arr
  }
  get amountObj() {
    const obj: any = {}
    this.currencyList.map((c: any) => {
      const arr = this.selectedData.filter((s: any) => s.currencyId === c.id)
      if (arr.length > 0) {
        obj[c.id] = arr.reduce((amountFilter: number, item: any) => {
          const mathPV = item.amount
          amountFilter += parseFloat(mathPV.toFixed(2))
          return amountFilter
        }, 0)
      }
    })
    return obj
  }
  /* 方法 */
  private handleBack() {
    this.tableData = []
    this.selectedData = []
    this.customerData = []
    this.searchForm.name = ''
    this.selectVal = ''
    this.$emit('back')
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
      if (this.selectedData.length <= 0) {
        this.$message.error('请选择明细行')
        return
      }
      const arrC = this.selectedData.filter((it: any) => it.currencyId)
      const arr: any[] = arrC.filter((s: any) => {
        return s.currencyId !== arrC[0].currencyId
      })
      if (this.form.ifBill === 1 && arr.length > 0) {
        this.$message.error('税务开票不能选择多个币种！')
        return
      }
      const brr: any[] = this.selectedData.map((it: any) => {
        return {
          invoiceId: (it || {}).id
        }
      })
      const params: any = {
        ...this.form,
        status: '0',
        amount: (this as any).selfAmount,
        currencyId: (this.selectedData[0] || {}).selfName,
        currencyMap: (this as any).amountObj,
        custType: this.form.clientProperty,
        clientProperty: undefined,
        clientType: undefined,
        custTag: undefined,
        operatorCustId: (this as any).custId,
        operatorCustName: (this as any).custName,
        itemList: brr
      }
      this.detailLoading = true
      if ((this as any).isEdit) {
        editOutInvoice(params).then(() => {
          this.detailLoading = false
          this.handleBack()
          this.$emit('getTableData')
        }).catch(() => {
          this.detailLoading = false
        })
      } else if ((this as any).isAdd) {
        addOutInvoice(params).then(() => {
          this.detailLoading = false
          this.handleBack()
          this.$emit('getTableData')
        }).catch(() => {
          this.detailLoading = false
        })
      }
    })
  }
  private handleExport() {
    this.loading = true
    const params: any = {
      billingId: this.form.id
    }
    exportOutInvoice(params).then((res:any) => {
      this.loading = false
      const a = document.createElement('a')
      document.body.appendChild(a)
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      const objUrl = URL.createObjectURL(blob)
      a.href = objUrl
      a.download = this.form.clientName + '开票数据' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.xls'
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

  private onSelected() {
    if (this.selectVal === 'all') {
      const list = this.tableData.filter((e: any) => this.selectedData.find((s: any) => s.id === e.id))
      this.$nextTick(() => {
        this.toggleSelection(list)
      })
    }
  }
  private deleteRow(index: number) {
    this.selectedData.splice(index, 1)
    const list = this.tableData.filter((e: any) => this.selectedData.find((s: any) => s.id === e.id))
    this.$nextTick(() => {
      this.toggleSelection(list)
    })
  }
  private onRowSelectable(row: any, index: any) {
    if ((this as any).isView) {
      return false
    } else {
      return true
    }
  }
  private handleSelected(checked: any) {
    if (checked.checked) {
      this.selectedData.push(checked.row)
    } else {
      this.selectedData = this.selectedData.filter((it: any) => it.id !== checked.row.id)
    }
  }
  private handleSelectAll(checked: any) {
    if ((this as any).isView) return
    if (checked.checked) {
      // 全选中
      this.selectedData = [...this.selectedData, ...this.tableData].reduce((list: any[], next: any) => {
        if (!list.find((e: any) => e.id === next.id)) {
          list.push(next)
        }
        return list
      }, [])
    } else {
      // 取消这页的全选
      this.selectedData = this.selectedData.filter((e: any) => !this.tableData.find((t: any) => t.id === e.id))
    }
  }
  private toggleSelection(arr: any) {
    const root: any = this.$refs.tables
    root.clearCheckboxRow()
    if (arr.length > 0) {
      arr.map((row: any) => {
        const api: any = this.$refs.tables
        api.toggleCheckboxRow(row)
      })
    }
  }

  private resetDialog() {
    this.pagination = {
      page: 1,
      size: 10,
      total: 0
    }
    this.searchForm = {
      name: ''
    }
  }
  private onComType() {
    this.form.agentId = ''
    this.form.agentName = ''
    this.form.clientName = ''
    this.form.clientId = ''
    this.form.clientType = ''
    this.form.clientProperty = ''
    this.form.serviceTypeId = ''
    this.form.serviceTypeName = ''
    this.tableData = []
    this.customerData = []
    this.setCustomerType()
    if (this.form.custTag !== '2') {
      this.form.agentId = (this as any).custId
      this.form.agentName = (this as any).custName
    }
  }
  private onCompany() {
    this.form.agentName = ''
    this.form.clientName = ''
    this.form.clientId = ''
    this.form.clientType = ''
    this.form.clientProperty = ''
    this.form.serviceTypeId = ''
    this.form.serviceTypeName = ''
    this.tableData = []
    this.customerData = []
    const item = this.companyList.find((it: any) => it.id === this.form.agentId)
    if (item) {
      this.form.agentName = item.name
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
  private onClientType() {
    this.form.clientName = ''
    this.form.clientId = ''
    this.form.clientProperty = ''
    this.form.serviceTypeId = ''
    this.form.serviceTypeName = ''
    this.tableData = []
    this.customerData = []
  }
  private async getServiceType() {
    const params = {
      cas: '',
      custId: this.form.clientId
    }
    if (this.form.clientType === '1') {
      // 客户
      params.cas = 'C'
    }
    if (this.form.clientType === '2') {
      // 代理
      params.cas = 'A'
    }
    this.selectLoading = true
    await getUsingServiceType(params).then((res: any) => {
      this.selectLoading = false
      const data = res.data || []
      this.serviceTypeList = data.map((e: any) => {
        return {
          id: e.typeId,
          name: e.typeName
        }
      })
    }).catch(() => {
      this.serviceTypeList = []
      this.selectLoading = false
    })
  }
  // 获取货币单位
  private getCurrencyList(): void {
    getCurrencyList()
      .then((res: any) => {
        const data = res.data || {}
        this.currencyList = data.result || []
      })
      .catch((err: any) => {
        return err
      })
  }
  private async handleCustomer() {
    this.resetDialog()
    this.isCustomer = true
  }
  private async onCustomer() {
    const type = (this as any).custType
    const subType = (this as any).custSubtype
    if (!this.form.clientType) {
      this.$message.error('请选择客户类型')
      return false
    } else if (type === '3' && this.form.clientType === '0') {
      this.customerData = [{
        id: '0',
        name: '聚货通',
        type: '0',
        subtype: '',
        countryId: 'CN',
        parentName: (this as any).custName
      }]
      this.pagination.total = this.customerData.length
    } else if (type === '3' && this.form.clientType === '2') {
      await this.getAgentList('0')
    } else if (type === '2' && subType === '1' && this.form.clientType === '2') {
      await this.getAgentList()
    } else {
      await this.getCustomerData()
    }
  }
  private async getCustomerData() {
    this.dialogLoading = true
    const params: any = {
      custIds: [this.form.agentId],
      name: this.searchForm.name
    }
    await getCustomerList(params).then((res: any) => {
      this.dialogLoading = false
      const data = res.data || []
      const customerList = data
      this.customerData = customerList
      this.pagination.total = this.customerData.length
    }).catch(() => {
      this.dialogLoading = false
    })
  }
  private async getAgentList(val?: any) {
    this.dialogLoading = true
    const params: any = {
      page: this.pagination.page,
      size: 9999,
      name: this.searchForm.name,
      parentId: val || this.form.agentId
    }
    await getAgentList(params)
      .then((res: any) => {
        const data = res.data || {}
        const arr = data.result || []
        this.customerData = arr.map((it: any) => {
          it.type = '2'
          return it
        })
        this.pagination.total = data.total
        this.dialogLoading = false
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }
  private handlePageChange(page: any): void {
    // 页数
    this.pagination.page = page
  }

  private async onServiceType(val: any) {
    const serviceType = this.serviceTypeList.find((e: any) => e.id === val) || {}
    this.form.serviceTypeName = serviceType.name
    this.selectedData = []
    this.tableData = []
    if (!this.form.serviceTypeId || !this.form.clientId) return
    await this.getOutInvoiceByCustomer()
  }

  private async onTableRowClick(row: any, type: string) {
    if (type === 'customer') {
      const ctype = row.type
      const stype = row.subtype
      this.form.clientName = row.name
      this.form.clientId = row.id
      this.form.serviceTypeId = ''
      this.form.serviceTypeName = ''
      this.form.clientProperty = ctype + (stype ? `-${stype}` : '')
      this.isCustomer = false
      this.selectedData = []
      this.tableData = []
      if (!this.form.serviceTypeId || !this.form.clientId) return
      await this.getOutInvoiceByCustomer()
    }
  }
  private async getOutInvoiceByCustomer() {
    this.loading = true
    const params: any = {
      clientIds: [this.form.clientId],
      enterpriseId: [this.form.agentId],
      serviceTypeId: this.form.serviceTypeId,
      type: 'R',
      ifVerify: 0,
      status: '1',
      page: this.page,
      size: this.size
    }
    const type = (this as any).custType
    if (type === '3') {
      params.custTag = this.form.clientType === '0' ? '3' : this.form.clientType === '1' ? '4' : ''
    } else {
      params.custTag = this.form.custTag
    }

    await getInvoiceList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.tableData = data.result || []
        const list = this.tableData.filter((e: any) => this.selectedData.find((s: any) => s.id === e.id))
        this.$nextTick(() => {
          this.toggleSelection(list)
        })
        this.total = data.total
        this.loading = false
      }).catch((err: any) => {
        this.loading = false
        this.detailLoading = false
        return err
      })
  }

  private async handleCurrentChange(current: any, type: string) {
    this.page = current
    await this.getOutInvoiceByCustomer()
  }

  private async getDetailsById() {
    const params = {
      model: this.form.id,
      page: 1,
      size: 999
    }
    await getOutInvoiceById(params)
      .then(async(res: any) => {
        const data = res.data
        const arr = data.result || []
        this.selectedData = arr
      }).catch(_ => {
        this.detailLoading = false
      })
  }

  private async show(row: any) {
    const isView = (this as any).isView
    this.selectVal = isView ? 'selected' : 'all'
    this.detailLoading = true
    this.getCurrencyList()
    const editForm: any = this.$refs.editForm
    this.$nextTick(() => {
      editForm.clearValidate()
    })
    if (row) {
      this.form = {
        ...row,
        custType: undefined,
        clientProperty: row.custType,
        clientType: row.custType ? row.custType.substring(0, 1) : '1'
      }
      this.setCustomerType()
      try {
        await this.getDetailsById()
        await this.getServiceType()
        const serviceType = this.serviceTypeList.find((e: any) => e.id === this.form.serviceTypeId) || {}
        this.form.serviceTypeName = serviceType.name
        !isView && await this.getOutInvoiceByCustomer()
      } catch (error) {
        this.detailLoading = false
      }
    } else {
      this.form = formParams()
      this.form.agentId = (this as any).custId
      this.form.agentName = (this as any).custName
      this.setCustomerType()
      this.tableData = []
      this.selectedData = []
      this.resetDialog()
    }
    this.detailLoading = false
  }
  private setCustomerType() {
    // agentid 收款方   --> custid 付款方
    const type = (this as any).custType
    const subType = (this as any).custSubtype
    if (type === '0') {
      // 聚货通
      this.custTypeList = [{ id: '2', name: '代理商' }]
    } else if (type === '2' && subType === '1' && this.form.custTag === '1') {
      // 一级代理商
      this.custTypeList = [
        { id: '2', name: '二级代理商' },
        { id: '1', name: '客户' }
      ]
    } else if (type === '2' && subType === '1' && this.form.custTag === '2') {
      // 一级代理商操作二级代理商
      this.custTypeList = [
        { id: '1', name: '客户' }
      ]
    } else if (type === '2' && subType === '2') {
      // 二级代理商
      this.custTypeList = [
        { id: '1', name: '客户' }
      ]
    } else if (type === '3') { // 供应商
      this.custTypeList = [
        { id: '0', name: '聚货通' },
        { id: '2', name: '代理商' },
        { id: '1', name: '客户' }
      ]
    } else {
      this.custTypeList = []
      this.form.clientType = undefined
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item__label {
  font-weight: 700 !important;
}
::v-deep .vxe-table--header .vxe-cell--title {
  color: #909399 !important;
}
.order-detail {
  height: calc(100vh - 170px);
  overflow-y: auto;
}
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
.el-form-item {
  vertical-align: top;
  display: inline-block;
  width: 24.9%;
}
.view-item .el-form-item {
  margin-bottom: 0;
}
.number-text {
  word-break: break-all;
}
</style>
