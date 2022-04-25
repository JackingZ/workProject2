<template>
  <div
    v-loading="loading"
    class="invoice-order-info"
  >
    <div
      class="top-option"
      style="overflow: hidden"
    >
      <el-link
        v-permission="['bookingOrderFinancialAdd']"
        :underline="false"
        style="float: left"
        type="primary"
        @click="addInvoice"
      >
        {{ custType === '3' ? '新增应收款' : '新增应付款' }}
      </el-link>
      <el-link
        :underline="false"
        type="primary"
        style="float: right"
        @click="goBack"
      >
        返回
      </el-link>
    </div>
    <div
      class="my-scrollbar"
      style="height: calc(100vh - 180px);overflow-y: auto"
    >
      <div
        v-for="(itemV, i) in invoiceList"
        :key="itemV.code"
        class="invoice-item"
        :style="{'margin-top': i === 0 ? 0 : '16px'}"
      >
        <el-row
          class="invoice-title"
          @click.native="showDetails(itemV)"
        >
          <el-col :span="16">
            <span
              v-if="itemV.status === '0'"
              class="invoice-audit"
              style="background: #2291E6;"
            />
            <span
              v-if="itemV.status === '1'"
              class="invoice-audit"
              style="background: #189800;"
            />
            <span
              v-if="itemV.status === '2'"
              class="invoice-audit"
              style="background: #E12E2E;"
            />
            <span
              v-if="itemV.status === '3'"
              class="invoice-audit"
              style="background: #FF7D19;"
            />
            <span style="font-size: 14px;">
              发票号：{{ itemV.code }}
            </span>
            <span
              v-if="itemV.ifVerify === 1"
              class="invoice-type"
            >
              已核销
            </span>
            <span
              v-if="formatterCutoffTime(itemV)"
              class="invoice-day"
            >
              逾期{{ formatterCutoffTime(itemV) }}天
            </span>
          </el-col>
          <el-col
            v-if="itemV.isOpen"
            :span="8"
            style="text-align: right;"
          >
            <el-button
              v-if="itemV.status !== '1' && !itemV.isEdit && $checkPermission(['bookingOrderFinancialAudit'])"
              type="text"
              @click.stop="auditInvoice(itemV)"
            >
              审核
            </el-button>
            <el-button
              v-if="!itemV.isEdit && !itemV.isAdd && itemV.ifVerify === 0 && itemV.status !== '3' && $checkPermission(['bookingOrderFinancialEdit'])"
              type="text"
              @click.stop="editRowClick(itemV)"
            >
              编辑
            </el-button>
            <el-button
              v-if="itemV.isEdit || itemV.isAdd"
              type="primary"
              size="mini"
              @click.stop="cancelInvoice(itemV)"
            >
              取消
            </el-button>
            <el-button
              v-if="itemV.isEdit || itemV.isAdd"
              type="primary"
              size="mini"
              @click.stop="saveInvoice(itemV)"
            >
              保存
            </el-button>
          </el-col>
        </el-row>
        <el-row
          class="img-flex"
        >
          <el-col :span="4">
            <div class="img-word">
              <span style="color: #909399;">账单金额:</span>
              <br>
              <span class="img-number">{{ itemV.amount }}</span>
              <span class="img-unit">{{ `${itemV.currencyName || ''}${itemV.currencyId || ''}` }}</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="img-word">
              <span style="color: #909399;">本币金额：</span>
              <br>
              <span class="img-number">{{ itemV.selfAmount }}</span>
              <span class="img-unit">{{ `${itemV.selfName || ''}${itemV.selfId || ''}` }}</span>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="img-word">
              <span style="color: #909399;">创建时间：</span>
              <br>
              <span class="img-unit">{{ itemV.createTime }}</span>
              <span class="img-number">&nbsp;</span>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="img-word">
              <span style="color: #909399;">审核时间：</span>
              <br>
              <span class="img-unit">{{ itemV.auditTime || '--' }}</span>
              <span class="img-number">&nbsp;</span>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="img-word">
              <span style="color: #909399;">截止付款：</span>
              <br>
              <span class="img-unit">{{ itemV.cutoffTime || '--' }}</span>
              <span class="img-number">&nbsp;</span>
            </div>
          </el-col>
        </el-row>
        <el-collapse-transition>
          <div v-show="itemV.isOpen">
            <el-form
              label-width="85px"
              size="small"
              style="padding: 16px 16px 0;"
            >
              <el-row v-if="itemV.isEdit">
                <el-col :span="12">
                  <el-form-item
                    label="发票日期"
                    prop="invDate"
                  >
                    <el-date-picker
                      v-model="itemV.invDate"
                      type="datetime"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="请选择"
                    />
                  </el-form-item>
                  <el-form-item
                    label="发票类型"
                    prop="invoiceType"
                  >
                    <el-select
                      v-model="itemV.invoiceType"
                      placeholder="请选择"
                      size="small"
                      style="width:100%;"
                      filterable
                    >
                      <el-option
                        v-for="item in invoiceTypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="发票货币"
                    prop="currencyId"
                  >
                    <el-select
                      v-model="itemV.currencyId"
                      placeholder="请选择"
                      size="small"
                      style="width:100%;"
                      filterable
                      @focus="getCurrencyList"
                      @change="(val) => currencyChange(val, itemV)"
                    >
                      <el-option
                        v-for="item in currencyList"
                        :key="item.id"
                        :label="`${item.name}-${item.sign}`"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="汇率"
                    prop="exRate"
                  >
                    <el-input-number
                      v-model="itemV.exRate"
                      class="input-number-valiate"
                      :controls="false"
                      placeholder="请输入"
                      size="small"
                      :min="0"
                      :max="9999"
                      @change="calculateTotalPrice(itemV)"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="备注"
                    style="width: 100%;"
                  >
                    <el-input
                      v-model="itemV.remark"
                      type="textarea"
                      :rows="2"
                      size="small"
                      placeholder="请输入"
                      clearable
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row
                v-else
                style="font-size: 12px;padding-bottom: 16px"
              >
                <el-col :span="12">
                  <el-row
                    style="font-size: 12px"
                  >
                    <el-col :span="12">
                      <span style="color: #909399">发票日期：</span>
                      <span>{{ itemV.invDate }}</span>
                    </el-col>
                    <el-col :span="12">
                      <span style="color: #909399">发票类型：</span>
                      <span>{{ (invoiceTypeList.find(e => e.value === itemV.invoiceType) || {}).label }}</span>
                    </el-col>
                    <el-col
                      :span="12"
                      style="padding-top: 10px;"
                    >
                      <span style="color: #909399">发票货币：</span>
                      <span>{{ itemV.currencyId }}</span>
                    </el-col>
                    <el-col
                      :span="12"
                      style="padding-top: 10px;"
                    >
                      <span style="color: #909399">汇率：</span>
                      <span>{{ itemV.exRate }}</span>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row
                    style="font-size: 12px"
                  >
                    <el-col :span="24">
                      <span style="color: #909399">备注：</span>
                      <span>{{ itemV.remark }}</span>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-form>
            <div style="border-top: 1px solid #e8e8e8;padding: 0 16px;">
              <div style="line-height: 44px;font-size: 14px;font-weight: 600;">
                明细行
              </div>
              <div style="font-size: 14px;">
                <span style="color: #324770;">开票总金额：</span>
                <span>{{ itemV.amount }}</span>
                <span>{{ `${itemV.currencyName || ''}${itemV.currencyId || ''}` }}</span>
                <span style="color: #324770;margin-left: 72px">账单本币总金额：</span>
                <span>{{ itemV.selfAmount }}</span>
                <span>{{ `${itemV.selfName || ''}${itemV.selfId || ''}` }}</span>
              </div>
            </div>
            <div
              v-if="itemV.isEdit"
              style="width: 100%;padding: 10px 16px;"
            >
              <div style="display: flex;flex-flow: row nowrap;">
                <div style="flex: 1;">
                  <el-row
                    :gutter="10"
                    class="details-table-header details-row"
                  >
                    <el-col :span="12">
                      成本项目
                    </el-col>
                    <el-col :span="3">
                      数量
                    </el-col>
                    <el-col :span="3">
                      单价
                    </el-col>
                    <el-col :span="3">
                      金额
                    </el-col>
                    <el-col :span="3">
                      本币金额
                    </el-col>
                  </el-row>
                </div>
                <div style="width: 60px;">
                  <div class="details-table-header">
                    操作
                  </div>
                </div>
              </div>
              <div>
                <div
                  v-for="(itemD, index) in itemV.items"
                  :key="itemD.id"
                  class="details-table-body"
                >
                  <div style="flex: 1;">
                    <el-row
                      :gutter="10"
                      class="details-row"
                    >
                      <el-col :span="12">
                        <el-select
                          v-model="itemD.costitemId"
                          placeholder="请选择"
                          size="small"
                          style="width:100%;"
                          filterable
                          @focus="getCostitemList"
                          @change="(val) => costitemChange(val, itemD)"
                        >
                          <el-option
                            v-for="item in projectData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                          />
                        </el-select>
                      </el-col>
                      <el-col :span="3">
                        <el-input-number
                          v-model="itemD.quantity"
                          class="input-number-valiate"
                          :controls="false"
                          placeholder="请输入"
                          size="small"
                          :min="-99999999"
                          :max="99999999"
                          @change="handleChange(itemV, itemD, index)"
                        />
                      </el-col>
                      <el-col :span="3">
                        <el-input-number
                          v-model="itemD.price"
                          class="input-number-valiate"
                          :controls="false"
                          placeholder="请输入"
                          size="small"
                          :min="-99999999"
                          :max="99999999"
                          @change="handleChange(itemV, itemD, index)"
                        />
                      </el-col>
                      <el-col :span="3">
                        <span>
                          {{ itemD.amount || '--' }}
                        </span>
                      </el-col>
                      <el-col :span="3">
                        <span>
                          {{ itemD.selfAmount || '--' }}
                        </span>
                      </el-col>
                    </el-row>
                    <el-row
                      :gutter="10"
                      class="details-row"
                    >
                      <el-col
                        :span="18"
                        style="padding-top: 4px"
                      >
                        <el-input
                          v-model="itemD.itemDesc"
                          type="textarea"
                          :rows="2"
                          size="small"
                          placeholder="说明"
                          clearable
                        />
                      </el-col>
                    </el-row>
                  </div>
                  <div style="width: 60px;">
                    <el-button
                      v-if="itemV.isEdit"
                      type="text"
                      style="color: #f56c6c;"
                      @click="handleDelete(itemV, itemD)"
                    >
                      删除
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-else
              style="width: 100%;padding: 10px 16px;"
            >
              <div style="display: flex;flex-flow: row nowrap;">
                <div style="flex: 1;">
                  <el-row
                    :gutter="10"
                    class="details-table-header details-row"
                  >
                    <el-col :span="6">
                      成本项目
                    </el-col>
                    <el-col :span="6">
                      说明
                    </el-col>
                    <el-col :span="3">
                      数量
                    </el-col>
                    <el-col :span="3">
                      单价
                    </el-col>
                    <el-col :span="3">
                      金额
                    </el-col>
                    <el-col :span="3">
                      本币金额
                    </el-col>
                  </el-row>
                </div>
                <div style="width: 60px;">
                  <div class="details-table-header">
                    操作
                  </div>
                </div>
              </div>
              <div>
                <div
                  v-for="itemD in itemV.items"
                  :key="itemD.id"
                  class="details-table-body"
                >
                  <div style="flex: 1;">
                    <el-row
                      :gutter="10"
                      class="details-row"
                    >
                      <el-col :span="6">
                        <span>
                          {{ itemD.costitemName }}
                        </span>
                      </el-col>
                      <el-col :span="6">
                        <div style="font-size: 12px;color: #303133;overflow: hidden;text-overflow: ellipsis;white-space: nowrap">
                          {{ itemD.itemDesc }}
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <span>
                          {{ itemD.quantity }}
                        </span>
                      </el-col>
                      <el-col :span="3">
                        <span>
                          {{ itemD.price }}
                        </span>
                      </el-col>
                      <el-col :span="3">
                        <span>
                          {{ itemD.amount }}
                        </span>
                      </el-col>
                      <el-col :span="3">
                        <span>
                          {{ itemD.selfAmount }}
                        </span>
                      </el-col>
                    </el-row>
                  </div>
                  <div style="width: 60px;">
                    <el-button
                      v-if="itemV.isEdit"
                      type="text"
                      style="color: #f56c6c;"
                      @click="handleDelete(itemV, itemD)"
                    >
                      删除
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
            <el-button
              v-if="itemV.isEdit"
              icon="el-icon-circle-plus-outline"
              type="primary"
              size="small"
              style="margin-left: 16px;"
              @click="addCostitem(itemV)"
            >
              新增明细行
            </el-button>
          </div>
        </el-collapse-transition>
      </div>
      <div
        v-if="invoiceList.length === 0"
        style="font-size: 14px;color: #5e6d82;text-align: center;padding: 10px"
      >
        暂无数据
      </div>
    </div>
    <el-dialog
      title="发票审核"
      :visible.sync="visible"
      :close-on-click-modal="false"
      width="500px"
    >
      <div v-loading="dialogLoading">
        <el-form
          ref="auditForm"
          :model="auditForm"
          label-width="50px"
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
            :disabled="dialogLoading"
            @click="cancelAudit"
          >
            取 消
          </el-button>
          <el-button
            type="primary"
            size="small"
            :disabled="dialogLoading"
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
import {
  getInvoiceListByOrder,
  getInvoiceById,
  getCurrencyList,
  getCostitemList,
  auditInvoice,
  getExRateValue,
  saveInvoice,
  updateInvoice,
  getCustType
} from '@/api/financial-at-invoice-order'
import dayjs from 'dayjs'

@Component({
  name: 'order-financial',
  components: {}
})
export default class extends Vue {
  /* data */
  private service: any = {
    id: '02',
    name: '订舱'
  }
  private rowDetail: any = {}
  private orderCustomer: any = {}
  private loading: boolean = false
  private visible: boolean = false
  private dialogLoading: boolean = false
  private invoiceList: any[] = []
  private invoiceTypeList: any[] = [
    {
      label: '订单发票',
      value: '1'
    },
    {
      label: '冲红发票',
      value: '2'
    }
  ]
  private currencyList: any[] = []
  private projectData: any[] = []
  private whiteCountryList: any[] = [
    {
      countryId: 'CN',
      currencyId: 'RMB'
    }
  ]
  private editRow: any = {}
  private auditForm: any = {
    id: '',
    status: '',
    note: ''
  }
  private selfCurrency: any = {
    currencyId: '',
    currencyName: ''
  }
  /** computed */
  get userCountryId(): string {
    const info = UserModule.info || {}
    return (info as any).countryId
  }
  get custType(): string {
    const info = UserModule.info || {}
    return (info as any).custType
  }
  /* methods */
  private goBack() {
    this.orderCustomer = {}
    this.rowDetail = {}
    this.invoiceList = []
    this.currencyList = []
    this.projectData = []
    this.editRow = {}
    this.auditForm = {
      id: '',
      status: '',
      note: ''
    }
    this.selfCurrency = {
      currencyId: '',
      currencyName: ''
    }
    this.$emit('back')
  }
  private show(row: any) {
    this.rowDetail = row
    this.getInvoiceList()
    this.getCurrencyList()
    this.getCostitemList()
    this.getSelfCurrency()
    this.getCustType()
  }
  private getCustType() {
    getCustType([this.rowDetail.custId]).then((res: any) => {
      const data = res.data || []
      this.orderCustomer = data[0] || {}
    }).catch(() => {
      this.orderCustomer = {}
    })
  }
  // private mounted() {
  //   this.getInvoiceList()
  //   this.getCurrencyList()
  //   this.getCostitemList()
  //   this.getSelfCurrency()
  // }
  private cancelInvoice(row: any) {
    if (row.isAdd) {
      this.invoiceList = this.invoiceList.filter((e: any) => !e.isAdd)
    } else {
      this.invoiceList = this.invoiceList.filter((e: any) => !e.isAdd).map((e: any) => {
        let invoice: any = {
          ...e
        }
        invoice.isEdit = false
        invoice.isOpen = false
        invoice.items = []
        if (this.editRow.id === invoice.id) {
          invoice = {
            ...this.editRow
          }
          invoice.isEdit = false
          invoice.isOpen = true
        }
        return invoice
      })
    }
  }
  private addInvoice() {
    if (this.invoiceList.some((e: any) => e.isEdit)) {
      this.$confirm('您有修改未保存请问是否保存？', '提示', {
        cancelButtonText: '否',
        confirmButtonText: '是'
      }).then(() => {
        const data = this.invoiceList.find((e: any) => e.isEdit)
        if (data) {
          this.saveInvoice(data)
        } else {
          this.invoiceList = this.invoiceList.filter((e: any) => !e.isAdd).map((e: any) => {
            let invoice: any = {
              ...e
            }
            if (this.editRow.id === invoice.id) {
              invoice = {
                ...this.editRow
              }
            }
            invoice.isEdit = false
            invoice.isOpen = false
            invoice.items = []
            return invoice
          })
          this.editRow = {}
        }
      }).catch(() => {
        this.invoiceList = this.invoiceList.filter((e: any) => !e.isAdd).map((e: any) => {
          let invoice: any = {
            ...e
          }
          if (this.editRow.id === invoice.id) {
            invoice = {
              ...this.editRow
            }
          }
          invoice.isEdit = false
          invoice.isOpen = false
          invoice.items = []
          return invoice
        })
        this.editRow = {}
        const tamp: any = this.getInvoiceItem()
        this.invoiceList.push(tamp)
        this.currencyChange('RMB', tamp)
      })
    } else {
      this.invoiceList = this.invoiceList.filter((e: any) => !e.isAdd).map((invoice: any) => {
        invoice.isEdit = false
        invoice.isOpen = false
        invoice.items = []
        return invoice
      })
      const tamp: any = this.getInvoiceItem()
      this.invoiceList.push(tamp)
      this.currencyChange('RMB', tamp)
      this.editRow = {}
    }
  }
  private getUId() {
    const tempUrl = URL.createObjectURL(new Blob())
    const uuid = tempUrl.toString()
    URL.revokeObjectURL(tempUrl)
    return uuid.substr(uuid.lastIndexOf('/') + 1)
  }
  private validateData(invoice: any) {
    if (!invoice.invDate) {
      this.$message.error('发票日期不能为空')
      return false
    }
    if (!invoice.invoiceType) {
      this.$message.error('发票类型不能为空')
      return false
    }
    if (!invoice.currencyId) {
      this.$message.error('发票货币不能为空')
      return false
    }
    if (!invoice.exRate) {
      this.$message.error('汇率不能为空')
      return false
    }
    if (invoice.items.length === 0) {
      this.$message.error('发票明细行不能为空')
      return false
    }
    let flag = true
    for (let i = 0; i < invoice.items.length; i++) {
      const item: any = invoice.items[i]
      if (!item.costitemId) {
        this.$message.error(`第${i + 1}明细行项目不能为空`)
        flag = false
        break
      }
      if (!item.itemDesc) {
        this.$message.error(`第${i + 1}明细行说明不能为空`)
        flag = false
        break
      }
      if (!item.quantity && item.quantity !== 0) {
        this.$message.error(`第${i + 1}明细行数量不能为空`)
        flag = false
        break
      }
      if (!item.price && item.price !== 0) {
        this.$message.error(`第${i + 1}明细行单价不能为空`)
        flag = false
        break
      }
    }
    return flag
  }
  private saveInvoice(invoice: any) {
    if (this.validateData(invoice)) {
      const params: any = {
        ...invoice
      }
      delete params.isOpen
      delete params.isEdit
      delete params.isAdd
      if (!this.editRow.id) {
        delete params.id
      }
      params.items = params.items.map((e: any) => {
        if (!this.editRow.id) {
          delete e.id
          delete e.invoiceId
        }
        if (e.isAdd) {
          delete e.id
        }
        delete e.isAdd
        return e
      })
      this.loading = true
      if (this.editRow.id) {
        updateInvoice(params).then(() => {
          this.loading = false
          this.getInvoiceList(invoice.id)
          this.$message.success('添加成功')
          this.editRow = {}
        }).catch(() => {
          this.loading = false
        })
      } else {
        saveInvoice(params).then(() => {
          this.loading = false
          this.getInvoiceList(invoice.id)
          this.$message.success('添加成功')
          this.editRow = {}
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
  private addCostitem(invoice: any) {
    this.invoiceList = this.invoiceList.map((e: any) => {
      if (e.id === invoice.id) {
        e.items = [...e.items, this.getCostitem(invoice)]
      }
      return e
    })
  }
  private getCostitem(invoice: any) {
    return {
      id: this.getUId(),
      invoiceId: invoice.id,
      costitemId: '',
      costitemName: '',
      itemDesc: '',
      quantity: '',
      price: '',
      amount: '',
      selfAmount: '',
      isAdd: true
    }
  }
  private getInvoiceItem() {
    let code = ''
    if (this.rowDetail.businessType === '1') {
      code = this.rowDetail.soCode
    }
    if (this.rowDetail.businessType === '0') {
      code = this.rowDetail.billNo
    }
    const invoice: any = {
      serviceSubtypeId: this.rowDetail.businessType,
      currencyId: 'RMB', // 所选货币
      currencyName: '人民币',
      selfId: this.selfCurrency.currencyId,
      selfName: this.selfCurrency.currencyName,
      selfAmount: '',
      exRate: '',
      amount: '',
      agentId: this.rowDetail.parentId,
      agentName: this.rowDetail.parentName,
      clientId: this.rowDetail.custId,
      clientName: this.rowDetail.custName,
      serviceTypeId: this.service.id,
      serviceTypeName: this.service.name,
      invoiceType: '',
      orderId: this.rowDetail.id,
      orderCode: code,
      invDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      remark: '',
      clientProperty: this.orderCustomer.type + (this.orderCustomer.subtype ? '-' + this.orderCustomer.subtype : ''),
      status: '0',
      items: [],
      isOpen: true,
      isEdit: true,
      isAdd: true
    }
    invoice.items = [this.getCostitem(invoice)]
    return invoice
  }
  private handleDelete(invoice: any, costItem: any) {
    this.invoiceList = this.invoiceList.map((e: any) => {
      if (e.id === invoice.id) {
        e.items = e.items.filter((it: any) => it.id !== costItem.id)
        e.amount = e.items.reduce((total: any, item: any) => parseFloat((total + item.amount).toFixed(2)), 0)
        e.selfAmount = e.items.reduce((total: any, item: any) => parseFloat((total + item.selfAmount).toFixed(2)), 0)
      }
      return e
    })
  }
  private handleChange(invoice: any, costitem: any, itemIndex: any) {
    this.invoiceList = this.invoiceList.map((e: any) => {
      if (e.id === invoice.id) {
        e.items = e.items.map((d: any, i: any) => {
          if (i === itemIndex) {
            d.amount = parseFloat(((costitem.quantity || 0) * (costitem.price || 0)).toFixed(2))
            d.selfAmount = this.calculateSelfTotalPrice(invoice.currencyId, invoice.selfId, d.amount, invoice.exRate)
          }
          return d
        })
        e.amount = e.items.reduce((total: any, item: any) => parseFloat((total + item.amount).toFixed(2)), 0)
        e.selfAmount = e.items.reduce((total: any, item: any) => parseFloat((total + item.selfAmount).toFixed(2)), 0)
      }
      return e
    })
  }
  private costitemChange(val: any, item: any) {
    item.costitemName = ''
    const data = this.projectData.find((e: any) => e.id === val)
    if (data) {
      item.costitemName = data.name
    }
  }
  private calculateTotalPrice(row: any) {
    this.invoiceList = this.invoiceList.map((invoice: any) => {
      if (invoice.id === row.id) {
        invoice.items = invoice.items.map((d: any, i: any) => {
          d.selfAmount = this.calculateSelfTotalPrice(invoice.currencyId, invoice.selfId, d.amount, invoice.exRate)
          return d
        })
        invoice.selfAmount = this.calculateSelfTotalPrice(row.currencyId, row.selfId, row.amount, row.exRate)
      }
      return invoice
    })
  }

  /**
   * 计算本币
   * @param currencyId 货币
   * @param selfCurrencyId 本币
   * @param amount 金额
   * @param exRate 汇率
   */
  private calculateSelfTotalPrice(currencyId: string, selfCurrencyId: string, amount: number, exRate: number) {
    if (currencyId === selfCurrencyId) return amount
    if (!exRate) return amount
    return parseFloat((amount * exRate).toFixed(2))
  }
  private currencyChange(val: any, row: any) {
    const currency = this.currencyList.find((item: any) => item.id === val)
    if (currency) {
      row.currencyName = currency.name
      if (row.selfId === val) {
        row.exRate = 1
        this.calculateTotalPrice(row)
      } else {
        // 账单货币兑本币
        const params = {
          c1: row.selfId, // 本币
          c2: val // 账单货币
        }
        row.exRate = ''
        getExRateValue(params).then((res: any) => {
          const data = (res.data || []).filter((e: any) => e.lcId === val && e.fcId === row.selfId).sort((a: any, b: any) => dayjs(b.updateTime).diff(dayjs(a.updateTime), 'second'))
          if (!data.length) {
            this.$message.error('系统暂无汇率，请联系管理员或手动输入')
            return
          }
          for (const tamp of data) {
            if (dayjs().diff(dayjs(tamp.effective), 'second') > 0) {
              row.exRate = tamp.rate
              break
            }
          }
          if (!row.exRate) {
            this.$message.error('系统暂无汇率，请联系管理员或手动输入')
            return
          }
          this.calculateTotalPrice(row)
        }).catch((err: any) => {
          return err
        })
      }
    } else {
      row.currencyName = ''
      row.exRate = ''
      this.calculateTotalPrice(row)
    }
  }
  private getSelfCurrency() {
    // 本币人民币
    this.selfCurrency = {
      currencyId: 'RMB',
      currencyName: '人民币'
    }
    // this.selfCurrency = {
    //   currencyId: '',
    //   currencyName: ''
    // }
    // if (this.whiteCountryList.find((e: any) => e.countryId === this.userCountryId)) {
    //   this.selfCurrency = {
    //     currencyId: 'RMB',
    //     currencyName: '人民币'
    //   }
    // } else {
    //   const params = {
    //     countryId: this.userCountryId
    //   }
    //   getCurrencyList(params).then((res:any) => {
    //     const data = res.data || {}
    //     const result = data.result || []
    //     if (result.length) {
    //       this.selfCurrency = {
    //         currencyId: result[0].id,
    //         currencyName: result[0].name
    //       }
    //     }
    //   }).catch((err:any) => {
    //     return err
    //   })
    // }
  }
  private cancelAudit() {
    this.visible = false
    this.auditForm = {
      id: '',
      status: '',
      note: ''
    }
  }
  private confirmAudit() {
    const params = {
      ...this.auditForm
    }
    this.dialogLoading = true
    auditInvoice(params).then(() => {
      this.$message.success('操作成功')
      this.dialogLoading = false
      this.getInvoiceList(this.auditForm.id)
      this.cancelAudit()
    }).catch(() => {
      this.dialogLoading = false
    })
  }
  private auditInvoice(row: any) {
    if (row.status === '0') {
      const params: any = {
        id: row.id,
        status: '3',
        note: ''
      }
      this.loading = true
      auditInvoice(params).then(() => {
        this.loading = false
        row.status = '3'
        this.visible = true
        this.auditForm = {
          id: row.id,
          status: '1',
          note: ''
        }
      }).catch((err: any) => {
        this.loading = false
        return err
      })
    } else {
      this.visible = true
      this.auditForm = {
        id: row.id,
        status: '1',
        note: ''
      }
    }
  }
  private editRowClick(row: any) {
    this.editRow = JSON.parse(JSON.stringify(row))
    row.isEdit = true
  }
  private getCurrencyList() {
    if (this.currencyList.length) return
    getCurrencyList().then((res:any) => {
      const data = res.data || {}
      this.currencyList = data.result || []
    }).catch((err:any) => {
      this.currencyList = []
      return err
    })
  }
  private getCostitemList() {
    if (this.projectData.length) return
    const params = {
      name: '',
      serviceTypeId: this.service.id,
      typeId: this.rowDetail.businessType,
      page: 1,
      size: 9999
    }
    getCostitemList(params).then((res:any) => {
      const data = res.data || {}
      this.projectData = data.result || []
    }).catch((err:any) => {
      this.projectData = []
      return err
    })
  }
  private showDetails(row: any) {
    if (this.invoiceList.some((e: any) => e.isEdit)) {
      this.$confirm('您有修改未保存请问是否保存？', '提示', {
        cancelButtonText: '否',
        confirmButtonText: '是'
      }).then(() => {
        // 保存
        this.saveInvoice(row)
      }).catch(() => {
        this.getInvoiceById(row)
      })
    } else {
      this.getInvoiceById(row)
    }
  }
  private getInvoiceById(row: any) {
    const isOpen = row.isOpen
    if (isOpen) {
      this.invoiceList = this.invoiceList.filter((e: any) => !e.isAdd).map((e: any) => {
        let invoice: any = {
          ...e
        }
        if (this.editRow.id === invoice.id) {
          invoice = {
            ...this.editRow
          }
        }
        invoice.isEdit = false
        invoice.isOpen = false
        invoice.items = []
        return invoice
      })
      this.editRow = {}
      return
    }
    this.loading = true
    getInvoiceById({ id: row.id }).then((res: any) => {
      this.loading = false
      const data = res.data || {}
      this.invoiceList = this.invoiceList.filter((e: any) => !e.isAdd).map((e: any) => {
        let invoice: any = {
          ...e
        }
        if (this.editRow.id === invoice.id) {
          invoice = {
            ...this.editRow
          }
        }
        invoice.isEdit = false
        invoice.isOpen = false
        invoice.items = []
        if (invoice.id === row.id) {
          invoice.isOpen = true
          invoice.items = (data.items || []).map((i: any) => {
            return {
              ...i,
              isAdd: false
            }
          })
        }
        return invoice
      })
      this.editRow = {}
    }).catch(() => {
      this.loading = false
    })
  }
  private getInvoiceList(openId?: any) {
    const params: any = {
      orderId: this.rowDetail.id,
      enterpriseId: [
        this.rowDetail.parentId
      ],
      serviceTypeId: this.service.id
    }
    this.loading = true
    getInvoiceListByOrder(params).then((res: any) => {
      this.loading = false
      this.invoiceList = (res.data || []).map((e: any) => {
        const invoice: any = {
          items: [],
          ...e,
          isOpen: false,
          isEdit: false,
          isAdd: false
        }
        if (invoice.id === openId) {
          this.getInvoiceById(invoice)
        }
        return invoice
      })
    }).catch(() => {
      this.loading = false
    })
  }
  private formatterCutoffTime(row: any) {
    const cutoffTime = row.cutoffTime
    if (!cutoffTime) return 0
    if (dayjs(cutoffTime).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')) return 0
    const num = dayjs().diff(cutoffTime, 'day') + 1
    if (num > 0 && row.ifVerify === 0) {
      return num
    }
    return 0
  }
}
</script>

<style lang="scss" scoped>
.invoice-order-info {
  background-color: #fff;
  padding: 16px 20px 20px 20px;
}
.top-option{
  margin-bottom: 13px;
}
.invoice-item {
  background: #FFFFFF;
  border: 1px solid #DCDFE6;
  opacity: 1;
  border-radius: 4px;
  padding-bottom: 17px;
}
.invoice-title {
  height: 40px;
  line-height: 40px;
  padding: 0 16px;
  background: #F2F6FF;
}
.invoice-type {
  width: 48px;
  height: 20px;
  border: 1px solid rgba(64, 158, 255, 0.5);
  border-radius: 2px;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #409EFF;
  padding: 0 2px;
}

.invoice-day {
  display: inline-block;
  background: rgba(255, 71, 83, 0.12);
  border-radius: 2px;
  height: 20px;
  line-height: 20px;
  padding: 0 4px;
  font-size: 12px;
  font-weight: 400;
  padding: 0 2px;
  color: #FF4753;
}
.invoice-audit {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.img-flex {
  padding: 11px 16px 16px;
  border-bottom: 1px solid #EBEEF5;
  font-size: 12px;
}
.img-word {
  display: inline-block;
  vertical-align: top;
}
.img-number {
  font-size: 16px;
  font-weight: bold;
  color: #324770;
}
.img-unit {
  color: #324770;
}
.el-form-item {
  vertical-align: top;
  display: inline-block;
  width: 49.5%;
}
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
.details-table-header {
  height: 25px;
  line-height: 25px;
  font-size: 12px;
  color: #909399;
  background: #F2F3F5;
}
.details-table-body {
  display: flex;
  flex-flow: row nowrap;
  border: 1px solid #EBEEF5;
  border-top: 0;
  padding: 8px 0 6px 1px;
  align-items: center;
}
.details-row {
  margin-left: 0 !important;
  margin-right: 0 !important;
  display: flex;
  align-items: center;
  span{
    font-size: 12px;
    color: #303133;
  }
}
.project-dialog ::v-deep .el-dialog__body {
  padding: 10px 20px 20px;
}
/* 设置滚动条的样式 */
.my-scrollbar{
  &::-webkit-scrollbar{
    width: 4px;
  }
  /* 滚动槽 */
  &::-webkit-scrollbar-track{
    border-radius: 2px;
  }
  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb{
    border-radius: 2px;
    background: rgba(0, 0, 0, 0.1);
  }
}
</style>
