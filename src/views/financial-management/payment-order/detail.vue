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
      <el-row style="background-color: #f2f2f2;padding: 10px;">
        <el-col
          :span="4"
          style="font-weight: 700;font-size: 18px;line-height: 30px;"
        >
          付款单
        </el-col>
        <el-col
          :span="20"
          style="text-align: right;"
        >
          <el-button
            v-if="isEdit"
            type="primary"
            size="mini"
            @click="handleSave"
          >
            {{ isOnce ? '提交' : '重新提交' }}
          </el-button>
        </el-col>
      </el-row>

      <el-form
        ref="editForm"
        :model="form"
        :rules="formRules"
        label-width="110px"
        style="padding-top: 20px;"
        size="small"
        :class="!isEdit ? 'view-item' : ''"
      >
        <el-form-item
          v-if="!isOnce"
          label="付款单号"
          prop="id"
        >
          <el-input
            v-if="isEdit"
            v-model="form.id"
            :maxlength="30"
            size="small"
            placeholder="请输入"
            show-word-limit
            disabled
          />
          <span
            v-else
            class="number-text"
          >
            {{ form.id }}
          </span>
        </el-form-item>
        <el-form-item
          v-if="!isOnce"
          label="状态"
          prop="status"
        >
          <el-select
            v-if="isEdit"
            v-model="form.status"
            placeholder="请选择"
            size="small"
            style="width:100%;"
            disabled
          >
            <el-option
              v-for="(item, index) in statusData"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <span v-else>
            {{ (statusData.find((it) => it.id === form.status) || {}).name }}
          </span>
        </el-form-item>
        <el-form-item
          label="客户"
          prop="custId"
        >
          <el-input
            v-if="isEdit"
            v-model="form.custName"
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
            {{ form.custName }}
          </span>
        </el-form-item>
        <el-form-item
          label="付款流水号"
        >
          <el-input
            v-if="isEdit"
            v-model="form.serialNumber"
            :maxlength="50"
            size="small"
            placeholder="请输入"
          />
          <span
            v-else
            class="number-text"
          >
            {{ form.serialNumber }}
          </span>
        </el-form-item>
        <el-form-item
          label="付款类型"
          prop="payType"
        >
          <el-select
            v-if="isEdit"
            v-model="form.payType"
            placeholder="请选择"
            size="small"
            style="width:100%;"
          >
            <el-option
              v-for="(item, index) in categoryData"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <span v-else>
            {{ (categoryData.find((it) => it.id === form.payType) || {}).name }}
          </span>
        </el-form-item>
        <el-form-item
          label="付款方式"
          prop="payMethod"
        >
          <el-select
            v-if="isEdit"
            v-model="form.payMethod"
            placeholder="请选择"
            size="small"
            style="width:100%;"
          >
            <el-option
              v-for="(item, index) in sourceData"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <span v-else>
            {{ (sourceData.find((it) => it.id === form.payMethod) || {}).name }}
          </span>
        </el-form-item>
        <el-form-item
          label="付款日期"
          prop="payTime"
        >
          <el-date-picker
            v-if="isEdit"
            v-model="form.payTime"
            type="datetime"
            style="width: 100%;"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择"
          />
          <span v-else>
            {{ form.payTime }}
          </span>
        </el-form-item>
        <el-form-item
          label="货币"
          prop="currencyId"
        >
          <el-select
            v-if="isEdit"
            v-model="form.currencyId"
            placeholder="请选择"
            size="small"
            style="width:100%;"
            filterable
            @change="onExRate"
          >
            <el-option
              v-for="(item, index) in currencyList"
              :key="index"
              :label="`${item.name}-${item.sign}`"
              :value="item.id"
            />
          </el-select>
          <span v-else>
            {{ form.currencyName }}
          </span>
        </el-form-item>
        <el-form-item
          label="汇率"
          prop="exRate"
        >
          <el-input-number
            v-if="isEdit"
            v-model="form.exRate"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            size="small"
            :min="0"
            :max="9999"
            @change="onAmount"
          />
          <span v-else>
            {{ form.exRate }}
          </span>
        </el-form-item>
        <el-form-item
          label="付款金额"
          prop="payAmount"
        >
          <el-input-number
            v-if="isEdit"
            v-model="form.payAmount"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            size="small"
            :min="-99999999"
            :max="99999999"
            :precision="2"
            @blur="onAmount"
            @change="onAmount"
          />
          <span v-else>
            {{ form.payAmount }}
          </span>
        </el-form-item>
        <el-form-item
          label="本币金额"
          prop="selfAmount"
        >
          <el-input-number
            v-if="isEdit"
            v-model="form.selfAmount"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            size="small"
            :min="-99999999"
            :max="99999999"
            :precision="2"
            disabled
          />
          <span v-else>
            {{ form.selfAmount }}
          </span>
        </el-form-item>
        <el-form-item
          v-if="isEdit"
          label="备注"
        >
          <el-input
            v-model="form.remark"
            size="small"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item
          v-if="!isEdit"
          style="width: 100%;"
          label="备注"
        >
          {{ form.remark ? form.remark : '' }}
        </el-form-item>
      </el-form>
      <div>
        <div style="border-top: 1px solid #e8e8e8;line-height: 50px;">
          冲销明细
        </div>
        <el-row>
          <el-col :span="4">
            <span style="font-weight: 700;padding-left: 20px;">总计请款金额：</span>
            <span>{{ amountFilter }}</span>
          </el-col>
          <el-col :span="20">
            <div style="text-align: right;padding-right: 10px;">
              <el-button
                v-if="isEdit"
                type="primary"
                size="mini"
                @click="handleAccount"
              >
                选择请款申请单
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-table
          :data="table"
          style="width: 100%;margin: 10px 0 20px 0;"
          header-align="center"
          align="center"
          border
        >
          <el-table-column
            prop="id"
            label="请款申请单号"
          />
          <el-table-column
            prop="applyTime"
            label="请款日期"
            width="170"
          />
          <el-table-column
            prop="remark"
            label="备注"
            width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="currencyName"
            label="货币"
          />
          <el-table-column
            prop="exRate"
            label="汇率"
            width="80"
          />
          <el-table-column
            prop="payAmount"
            label="金额"
            min-width="100"
          />
          <el-table-column
            prop="selfAmount"
            label="本币金额"
            min-width="100"
          />
          <el-table-column
            fixed="right"
            width="100"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                v-if="isEdit"
                type="text"
                style="color: #f56c6c;"
                @click="handleDelete(scope.$index, '1')"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="border-top: 1px solid #e8e8e8;line-height: 50px;">
          关联发票
        </div>
        <el-row>
          <el-col :span="4">
            <span style="font-weight: 700;padding-left: 20px;">总计发票金额：</span>
            <span>{{ invoiceFilter }}</span>
          </el-col>
          <el-col :span="20">
            <div style="text-align: right;padding-right: 10px;">
              <el-button
                v-if="isEdit"
                type="primary"
                size="mini"
                @click="handleInvoice"
              >
                选择发票
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-table
          :data="invoicesTable"
          style="width: 100%;margin: 10px 0 20px 0;"
          header-align="center"
          align="center"
          border
        >
          <el-table-column
            prop="code"
            label="发票编号"
          />
          <el-table-column
            prop="orderCode"
            label="原单号"
          />
          <el-table-column
            prop="invDate"
            label="发票日期"
            width="170"
          />
          <el-table-column
            prop="auditTime"
            label="审核时间"
            width="170"
          />
          <el-table-column
            prop="remark"
            label="备注"
            width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="currencyName"
            label="货币"
          />
          <el-table-column
            prop="exRate"
            label="汇率"
            width="80"
          />
          <el-table-column
            prop="amount"
            label="金额"
            min-width="100"
          />
          <el-table-column
            prop="selfAmount"
            label="本币金额"
            min-width="100"
          />
          <el-table-column
            fixed="right"
            width="100"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                v-if="isEdit"
                type="text"
                style="color: #f56c6c;"
                @click="handleDelete(scope.$index, '2')"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog
          title="选择客户"
          :visible.sync="isCustomer"
          :close-on-click-modal="false"
          width="1000px"
          @closed="isCustomer = false; name = ''"
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
              v-model="form.custType"
              placeholder="客户类型"
              size="small"
              style="width:130px;margin-right: 5px;"
              filterable
              @change="handleCustType"
            >
              <el-option
                v-for="(item, index) in custTypeList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-input
              v-if="form.custType === '3'"
              v-model="name"
              placeholder="客户"
              style="width: 200px;margin-right:10px;"
              size="small"
              clearable
            />
            <el-button
              type="primary"
              size="small"
              @click="getCustomerType"
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
            @row-click="onCustomerRow"
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
            @current-change="handleCustomerChange"
          />
        </el-dialog>

        <el-dialog
          title="选择请款申请单"
          :visible.sync="isAccount"
          :close-on-click-modal="false"
          width="1200px"
          @closed="isAccount = false; account = ''; accountArr = []"
        >
          <div style="text-align: right;">
            <el-input
              v-model="account"
              placeholder="请款申请单号"
              style="width: 200px;margin-right:10px;"
              size="small"
              clearable
            />
            <el-button
              type="primary"
              size="small"
              @click="getAccountList"
            >
              查询
            </el-button>
          </div>
          <el-table
            ref="accountTable"
            v-loading="dialogLoading"
            :data="accountData"
            border
            height="400px"
            style="width: 100%;margin: 10px 0;"
            @selection-change="onAccountSelection"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              prop="id"
              label="请款申请单号"
              min-width="150"
              show-overflow-tooltip
            />
            <el-table-column
              prop="applyTime"
              label="请款日期"
              width="160"
            />
            <el-table-column
              prop="custName"
              label="客户名称"
            />
            <el-table-column
              prop=""
              label="结算账户"
            />
            <el-table-column
              prop="payMethod"
              label="来源"
              width="100"
            >
              <template slot-scope="scope">
                {{ (sourceData.find((it) => it.id === scope.row.payMethod) || {}).name }}
              </template>
            </el-table-column>
            <el-table-column
              prop="currencyName"
              label="货币"
              width="100"
            />
            <el-table-column
              prop="exRate"
              label="汇率"
              width="100"
            />
            <el-table-column
              prop="payAmount"
              label="金额"
            />
            <el-table-column
              prop="selfAmount"
              label="本币金额"
            />
          </el-table>
          <el-pagination
            :current-page.sync="page"
            :page-size="size"
            layout="total, prev, pager, next"
            :total="total"
            style="text-align: right;"
            @current-change="handleAccountChange"
          />
          <div style="text-align: right; padding-top: 20px;">
            <el-button @click="isAccount = false; account = ''; accountArr = []">
              取 消
            </el-button>
            <el-button
              type="primary"
              @click="accountSelectionConfirm"
            >
              确 定
            </el-button>
          </div>
        </el-dialog>

        <el-dialog
          title="选择发票"
          :visible.sync="isInvoice"
          :close-on-click-modal="false"
          width="1200px"
          @closed="cancelInvoice"
        >
          <div style="text-align: right;">
            <el-select
              v-model="serviceTypeId"
              :loading="selectLoading"
              placeholder="服务大类"
              size="small"
              filterable
              clearable
              style="width:130px;margin-right: 5px;"
              @focus="getServiceType"
              @change="onService"
            >
              <el-option
                v-for="item in serviceTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
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
                  v-show="!['02','06'].includes(serviceTypeId)"
                  label="原单号"
                  value="1"
                />
                <el-option
                  v-show="['02'].includes(serviceTypeId)"
                  label="提单号"
                  value="4"
                />
                <el-option
                  v-show="['02', '06'].includes(serviceTypeId)"
                  label="SO号"
                  value="5"
                />
                <el-option
                  v-show="['02'].includes(serviceTypeId)"
                  label="柜号"
                  value="6"
                />
              </el-select>
            </el-input>
            <el-button
              type="primary"
              size="small"
              @click="getInvoiceList"
            >
              查询
            </el-button>
          </div>
          <div v-loading="dialogLoading">
            <vxe-table
              v-if="invoiceData.length"
              ref="invoiceTable"
              :data="invoiceData"
              :auto-resize="true"
              border
              resizable
              size="small"
              height="400"
              style="width: 100%;margin: 10px 0;"
              @checkbox-change="onInvoiceSelection"
              @checkbox-all="onInvoiceAll"
            >
              <vxe-table-column
                fixed="left"
                type="checkbox"
                width="55"
              />
              <vxe-table-column
                :visible="serviceTypeId !== '02' && serviceTypeId !== '06'"
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
                :visible="serviceTypeId === '02' || serviceTypeId === '06'"
                width="160"
                title="SO号"
              >
                <template slot-scope="scope">
                  <span>{{ (scope.row.soNoList || []).join(',') }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column
                :visible="serviceTypeId === '02'"
                width="160"
                title="提单号"
              >
                <template slot-scope="scope">
                  <span>{{ (scope.row.billNoList || []).join(',') }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column
                :visible="serviceTypeId === '02'"
                width="160"
                title="航空单号"
              >
                <template slot-scope="scope">
                  <span>{{ (scope.row.airNoList || []).join(',') }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column
                :visible="serviceTypeId === '02'"
                width="160"
                title="柜号"
              >
                <template slot-scope="scope">
                  <span>{{ (scope.row.containerNoList || []).join(',') }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column
                title="开票日期"
                width="170"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.invDate }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column
                title="审核时间"
                width="170"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.auditTime }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column
                title="货币"
                width="100"
              >
                <template slot-scope="scope">
                  <span>{{ `${scope.row.currencyName || ''}${scope.row.currencyId || ''}` }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column
                title="汇率"
                width="80"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.exRate }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column
                title="金额"
                min-width="120"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.amount }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column
                title="本币金额"
                min-width="120"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.selfAmount }}</span>
                </template>
              </vxe-table-column>
            </vxe-table>
          </div>
          <el-pagination
            :current-page.sync="page"
            :page-size="size"
            layout="total, prev, pager, next"
            :total="total"
            style="text-align: right;"
            @current-change="handleInvoiceChange"
          />
          <div style="text-align: right; padding-top: 20px;">
            <el-button @click="cancelInvoice">
              取 消
            </el-button>
            <el-button
              type="primary"
              @click="invoiceSelectionConfirm"
            >
              确 定
            </el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getCurrencyList,
  getExRateValue,
  getRequestList,
  getPaymentById,
  addPayment,
  editPayment,
  getSupplierList,
  getAgentList,
  getUnFinanceAgentList,
  getReqInvoice,
  getUsingServiceType
} from '@/api/financial-at-invoice-order'
import dayjs from 'dayjs'

function formParams() {
  return {
    payAmount: undefined,
    selfAmount: undefined,
    custTag: undefined,
    agentId: undefined,
    agentName: undefined,
    currencyId: undefined,
    currencyName: undefined,
    serialNumber: undefined,
    custId: undefined,
    custName: undefined,
    custType: undefined,
    exRate: undefined,
    id: undefined,
    payTime: undefined,
    remark: undefined,
    status: undefined,
    payType: undefined,
    payMethod: undefined
  }
}

@Component({
  name: 'detail',
  components: {},
  props: {
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
      default: () => {
        return []
      }
    },
    sourceList: {
      type: Array,
      default: () => {
        return []
      }
    },
    categoryList: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
})
export default class extends Vue {
  /* data */
  private form: any = formParams()
  private formRules = {
    id: [{ required: true, message: '付款单号不能为空', trigger: 'blur' }],
    serialNumber: [
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (value && reg.test(value)) {
            callback(new Error('付款流水号不能是中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    agentId: [{ required: true, message: '请选择所属公司', trigger: 'change' }],
    currencyId: [{ required: true, message: '请选择货币', trigger: 'change' }],
    custId: [{ required: true, message: '客户不能为空', trigger: 'change' }],
    exRate: [{ required: true, message: '汇率不能为空(根据货币确定)', trigger: 'blur' }],
    payAmount: [{ required: true, message: '请款申请单金额不能为空', trigger: 'blur' }],
    selfAmount: [{ required: true, message: '本币金额不能为空', trigger: 'blur' }],
    payTime: [{ required: true, message: '请选择请款申请单日期', trigger: 'change' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }],
    payMethod: [{ required: true, message: '请选择付款方式', trigger: 'change' }],
    payType: [{ required: true, message: '请选择付款类型', trigger: 'change' }]
  }
  private name = ''
  private account = ''
  private keyWord: any = ''
  private selectType: any = ''
  private serviceTypeId: any = ''
  private isCustomer: boolean = false
  private isAccount: boolean = false
  private isInvoice: boolean = false
  private custTypeList: any[] = []
  private serviceTypeList: any[] = []
  private customerData: any[] = []
  private accountData: any[] = []
  private accountArr: any[] = []
  private invoiceData: any[] = []
  private invoiceArr: any[] = []
  private companyList: any[] = []
  private tableData1: any[] = []
  private tableData2 :any[] = []
  private detailLoading: boolean = false
  private dialogLoading: boolean = false
  private selectLoading: boolean = false
  private currencyList: any[] = []
  private currentId = '' // 当前付款单id
  private total = 0
  private page = 1
  private size = 10
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  private selfCurrency: any = {
    currencyId: 'RMB',
    currencyName: '人民币'
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
  get userCountryId(): string {
    const info = UserModule.info || {}
    const countryId = (info as any).countryId
    return countryId
  }
  get username(): string {
    const info = UserModule.info || {}
    const username = (info as any).username
    return username
  }
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
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

  get custSubtype(): string {
    const info = UserModule.info || {}
    const custSubtype = (info as any).custSubtype
    return custSubtype
  }
  get statusData() {
    const data = (this as any).statusList
    return data
  }
  get sourceData() {
    const data = (this as any).sourceList
    return data
  }
  get categoryData() {
    const data = (this as any).categoryList
    return data
  }

  get amountFilter() {
    const data = (this as any).tableData1.filter((it: any) => it.tag !== 'X')
    let num = 0
    data.map((it: any) => {
      if (it.payAmount && it.exRate > 0) {
        num += this.countNum(it.payAmount, it.exRate)
      }
    })
    return parseFloat(num.toFixed(2))
  }
  get table() {
    return this.tableData1.filter((it: any) => it.tag !== 'X')
  }
  get customerList() {
    return this.customerData.slice((this.pagination.page - 1) * this.pagination.size, (this.pagination.page) * this.pagination.size)
  }
  get invoiceFilter() {
    const data = (this as any).tableData2.filter((it: any) => it.tag !== 'X')
    let num = 0
    data.map((it: any) => {
      if (it.amount && it.exRate > 0) {
        num += this.countNum(it.amount, it.exRate)
      }
    })
    return parseFloat(num.toFixed(2))
  }
  get invoicesTable() {
    return this.tableData2.filter((it: any) => it.tag !== 'X')
  }

  /* 方法 */
  private countNum(num1: number, num2: number) {
    return parseFloat((num1 * num2).toFixed(2))
  }
  private setData(id?: string): void {
    this.getCurrencyList()
    if (id) {
      this.currentId = id
      this.getPaymentById(id)
    } else {
      this.form.agentId = (this as any).custId
      this.form.agentName = (this as any).custName
      this.setCustomerType()
    }
  }
  private setCustomerType() {
    // 付款单
    // 当前账号类型
    // agentid 付款方   --> custid 收款方
    // 聚货通          --> 供应商
    // 代理商（一级）   --> 聚货通
    // 代理商（二级）   --> 代理商（一级）
    // 客户            --> 代理商（一级）
    // 客户            --> 代理商（二级）
    // 设置客户类型
    const type = (this as any).custType
    const subType = (this as any).custSubtype
    if (type === '0') { // 聚货通
      this.custTypeList = [
        { id: '3', name: '供应商' }
      ]
    } else if (type === '2' && subType === '1' && this.form.custTag === '1') { // 一级代理商
      this.custTypeList = [
        { id: '0', name: '聚货通' },
        { id: '3', name: '供应商' }
      ]
    } else if (type === '2' && subType === '1' && this.form.custTag === '2') { // 一级代理商操作二级代理商
      this.custTypeList = [
        { id: '2', name: '代理商' }
      ]
    } else if (type === '2' && subType === '2') { // 二级代理商
      this.custTypeList = [
        { id: '2', name: '代理商' }
      ]
    } else {
      this.custTypeList = []
      this.form.custType = undefined
    }
  }

  private resetDialog() {
    this.pagination = {
      page: 1,
      size: 10,
      total: 0
    }
    this.name = ''
  }
  private onComType() {
    this.form.agentId = ''
    this.form.agentName = ''
    this.form.custName = ''
    this.form.custId = ''
    this.form.custType = ''
    this.form.clientType = ''
    this.tableData1 = []
    this.tableData2 = []
    this.customerData = []
    this.setCustomerType()
    if (this.form.custTag !== '2') {
      this.form.agentId = (this as any).custId
      this.form.agentName = (this as any).custName
    }
  }
  private onCompany() {
    this.form.agentName = ''
    this.form.custName = ''
    this.form.custId = ''
    this.form.custType = ''
    this.form.clientType = ''
    this.tableData1 = []
    this.tableData2 = []
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
  private handleCustType() {
    this.form.custName = ''
    this.form.custId = ''
    this.form.clientType = ''
    this.form.exRate = undefined
    this.tableData1 = []
    this.tableData2 = []
    this.customerData = []
  }
  private async handleCustomer() {
    // 客户
    this.resetDialog()
    this.isCustomer = true
  }
  private onCustomerRow(row: any) {
    // 客户行
    const ctype = row.type
    const stype = row.subtype
    this.isCustomer = false
    this.form.custId = row.id
    this.form.custName = row.name
    this.form.clientType = ctype + (stype ? `-${stype}` : '')
    this.accountData = []
    this.onExRate()
  }

  private handleCustomerChange(page: any): void {
    // 页数
    this.pagination.page = page
  }
  private async getCustomerType() {
    const type = (this as any).custType
    const subType = (this as any).custSubtype
    if (!this.form.custType) {
      this.$message.error('请选择客户类型')
      return false
    } else if (type === '2' && subType === '1' && this.form.custTag === '1' && this.form.custType === '0') {
      this.customerData = [{
        id: '0',
        name: '聚货通',
        type: '0',
        countryId: 'CN',
        subtype: '',
        parentName: ''
      }]
      this.pagination.total = this.customerData.length
    } else if (type === '2' && subType === '1' && this.form.custTag === '1' && this.form.custType === '3') {
      await this.getSupplierList()
    } else if (type === '2' && subType === '1' && this.form.custTag === '2') {
      this.customerData = [{
        id: (this as any).custId,
        name: (this as any).custName,
        type: '2',
        subtype: '1',
        countryId: (this as any).userCountryId,
        parentName: '聚货通'
      }]
      this.pagination.total = this.customerData.length
    } else if (type === '0') {
      await this.getSupplierList()
    } else if (type === '2' && subType === '2') {
      this.customerData = [{
        id: (this as any).parentId,
        name: (this as any).parentName,
        type: '2',
        subtype: '1',
        countryId: (this as any).userCountryId,
        parentName: '聚货通'
      }]
    }
  }
  // 获取供应商列表
  private async getSupplierList() {
    this.dialogLoading = true
    const params: any = {
      page: this.pagination.page,
      size: 9999,
      name: this.name
    }
    await getSupplierList(params)
      .then((res: any) => {
        const data = res.data || {}
        const arr = data.result || []
        this.customerData = arr.map((it: any) => {
          it.type = '3'
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
  // 获取代理商列表
  private async getAgentList() {
    this.dialogLoading = true
    const params: any = {
      parentId: '0',
      page: this.pagination.page,
      size: 9999,
      name: this.name
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

  // 获取货币单位
  private getCurrencyList(): void {
    getCurrencyList()
      .then((res: any) => {
        const data = res.data || {}
        this.currencyList = data.result || []
        this.currencyList.map((it: any) => {
          if (it.countries.some((c: any) => c.id === (this as any).userCountryId)) {
            this.selfCurrency = {
              currencyId: it.id,
              currencyName: it.name
            }
          }
        })
      })
      .catch((err: any) => {
        return err
      })
  }
  private onExRate() {
    this.form.exRate = undefined
    this.form.selfAmount = undefined
    this.form.payAmount = undefined
    if (!this.form.currencyId) return
    if (this.selfCurrency.currencyId === this.form.currencyId) {
      this.form.exRate = 1
      return
    }
    getExRateValue({
      c1: this.form.currencyId,
      c2: this.selfCurrency.currencyId
    }).then((res: any) => {
      const data = res.data || []
      if (data.length <= 0) {
        this.$message.error('暂无汇率，请配置')
        return
      }
      const arr = data.filter((it: any) => it.lcId === this.form.currencyId).map((it: any) => {
        it.time = dayjs(it.effective).unix()
        return it
      }).sort((a: any, b: any) => b.time - a.time)
      const objTime = arr[0] || {}
      if (objTime.lcId === this.form.currencyId) {
        this.form.exRate = objTime.rate
      }
      if (!this.form.exRate) {
        this.$message.error('暂无汇率，请配置')
      }
    }).catch((err: any) => {
      return err
    })
  }
  private onAmount() {
    if (this.form.exRate > 0) {
      this.form.selfAmount = this.countNum(this.form.payAmount || 0, this.form.exRate)
    }
  }
  private getPaymentById(id: string) {
    this.detailLoading = true
    getPaymentById({
      id
    })
      .then(async(res: any) => {
        const data = res.data || {}
        const { payApplyEntityList, invoiceEntityList, custType, ...form } = data
        this.form = {
          ...form,
          custType: custType ? custType.substring(0, 1) : '1',
          clientType: custType
        }
        if (this.form.exRate > 0) {
          this.form.selfAmount = this.countNum(this.form.payAmount || 0, this.form.exRate)
        }
        this.setCustomerType()
        this.tableData1 = payApplyEntityList || []
        this.tableData2 = invoiceEntityList || []
        this.detailLoading = false
      })
      .catch((err: any) => {
        this.detailLoading = false
        return err
      })
  }

  private handleSave(): void {
    // 提交
    const editForm: any = this.$refs.editForm
    editForm.validate((valid: any) => {
      if (!valid) return false
      if (this.tableData1.length <= 0 && this.tableData2.length <= 0) {
        this.$message.error('请至少选择一个请款申请单或发票')
        return
      }
      this.detailLoading = true
      const { clientType, custType, custTag, ...form } = this.form
      const params: any = {
        ...form,
        custType: clientType,
        operatorCustId: (this as any).custId,
        selfId: this.selfCurrency.currencyId,
        status: 0
      }
      this.currencyList.map((it: any) => {
        if (it.id === params.currencyId) {
          params.currencyName = it.name
        }
      })
      params.applyIdList = this.tableData1.filter((it: any) => it.tag !== 'X').map((it: any) => it.id)
      params.invoiceList = this.tableData2.filter((it: any) => it.tag !== 'X').map((it: any) => it.id)
      if ((this as any).isOnce) {
        addPayment(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            this.resetForm()
            this.detailLoading = false
            this.$emit('back')
            this.$emit('getTableData')
          })
          .catch((err: any) => {
            this.detailLoading = false
            return err
          })
      } else {
        editPayment(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '编辑成功'
            })
            this.resetForm()
            this.detailLoading = false
            this.$emit('back')
            this.$emit('getTableData')
          })
          .catch((err: any) => {
            this.detailLoading = false
            return err
          })
      }
    })
  }
  private handleBack() {
    this.$emit('back')
    this.resetForm()
  }
  private resetForm() {
    // 表单重置
    this.form = formParams()
    this.tableData1 = []
    this.tableData2 = []
    this.customerData = []
    this.page = 1
    this.size = 10
    const editForm: any = this.$refs.editForm
    this.$nextTick(() => {
      editForm.clearValidate()
    })
  }

  private handleAccountChange(page: any): void {
    // 页数
    this.page = page
    this.getAccountList()
  }
  private handleInvoiceChange(page: any): void {
    // 页数
    this.page = page
    this.getInvoiceList()
  }

  private handleAccount(): void {
    // 选择请款申请单
    this.isAccount = true
    this.page = 1
    this.accountArr = this.tableData1.filter((it: any) => it.tag !== 'X').map((it: any) => it.id)
    this.getAccountList()
  }
  // 请款单
  private getAccountList() {
    this.dialogLoading = true
    const params: any = {
      model: {
        id: this.account,
        agentId: [this.form.agentId],
        custId: this.form.custId,
        status: '1'
      },
      page: this.page,
      size: this.size
    }
    getRequestList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.accountData = data.result || []
        this.total = data.total
        if (this.accountArr.length) {
          this.accountArr.map((a: any) => {
            const item = this.accountData.find((it: any) => it.id === a || `${it.id}` === a)
            if (item) {
              this.$nextTick(() => {
                const root: any = this.$refs.accountTable
                root.toggleCheckboxRow(item, true)
              })
            }
          })
        }
        this.dialogLoading = false
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return [null, err]
      })
  }

  private onAccountSelection(val: any) {
    // 勾选请款申请单列表
    this.accountArr = (val || []).map((item: any) => {
      return {
        ...item,
        tag: '1'
      }
    })
  }
  private accountSelectionConfirm() {
    this.isAccount = false
    this.account = ''
    const oldArr = this.tableData1.filter((it: any) => it.tag !== 'X')
    const plusArr = [...this.accountArr, ...oldArr]
    const obj: any = {} // 有助于增加遍历效率
    const resArr = plusArr.reduce((cur: any, next: any) => {
      if (!obj[next.id]) {
        obj[next.id] = true
        cur.push(next)
      }
      return cur
    }, [])
    this.tableData1 = resArr
  }
  private handleDelete(index: any, str: string): void {
    // 删除
    if (str === '1') {
      this.tableData1[index].tag = 'X'
    } else if (str === '2') {
      this.invoiceData[index].tag = 'X'
    }
  }

  private getServiceType() {
    const params = {
      cas: '',
      custId: this.form.custId
    }
    const str = (this.form.clientType || '').split('-')[0] || ''
    if (str === '1') {
      // 客户
      params.cas = 'C'
    }
    if (str === '2') {
      // 代理
      params.cas = 'A'
    }
    if (str === '3') {
      // 供应商
      params.cas = 'S'
    }
    this.selectLoading = true
    getUsingServiceType(params).then((res: any) => {
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
  private onService() {
    this.invoiceData = []
  }

  private handleInvoice(): void {
    // 选择发票
    if (!this.form.custId) {
      this.$message.error('请选择客户')
      return
    }
    this.isInvoice = true
    this.page = 1
    this.invoiceArr = this.tableData2.filter((it: any) => it.tag !== 'X')
  }
  private getInvoiceList() {
    if (!this.serviceTypeId) {
      this.$message.error('请选择服务')
      return
    }
    this.dialogLoading = true
    const params: any = {
      model: {
        flag: '1',
        custId: this.form.custId,
        clientId: this.form.agentId,
        serviceTypeId: this.serviceTypeId,
        orderCode: this.selectType === '1' ? this.keyWord : undefined,
        code: this.selectType === '3' ? this.keyWord : undefined,
        billNo: this.selectType === '4' ? this.keyWord : undefined,
        soNo: this.selectType === '5' ? this.keyWord : undefined,
        containerNo: this.selectType === '6' ? this.keyWord : undefined
      },
      size: this.size,
      page: this.page
    }
    getReqInvoice(params)
      .then((res: any) => {
        const data = res.data || {}
        this.invoiceData = data.result
        this.total = data.total
        if (this.invoiceArr.length) {
          this.invoiceArr.map((a: any) => {
            const item = this.invoiceData.find((it: any) => it.id === a.id || `${it.id}` === a.id)
            if (item) {
              this.$nextTick(() => {
                const root: any = this.$refs.invoiceTable
                root.toggleCheckboxRow(item, true)
              })
            }
          })
        }
        this.dialogLoading = false
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return [null, err]
      })
  }
  private onInvoiceSelection(checked: any) {
    // 勾选发票列表
    if (checked.checked) {
      this.invoiceArr.push(checked.row)
    } else {
      this.invoiceArr = this.invoiceArr.filter((it: any) => it.id !== checked.row.id)
    }
    this.invoiceArr = this.invoiceArr.map((item: any) => {
      return {
        ...item,
        tag: '1'
      }
    })
  }
  private onInvoiceAll(checked: any) {
    if (checked.checked) {
      // 全选中
      this.invoiceArr = [...this.invoiceArr, ...this.invoiceData].reduce((list: any[], next: any) => {
        if (!list.find((e: any) => e.id === next.id)) {
          list.push(next)
        }
        return list
      }, [])
    } else {
      // 取消这页的全选
      this.invoiceArr = this.invoiceArr.filter((e: any) => !this.invoiceData.find((t: any) => t.id === e.id))
    }
  }
  private cancelInvoice() {
    this.isInvoice = false
    this.serviceTypeId = ''
    this.selectType = ''
    this.keyWord = ''
    this.invoiceArr = []
    this.invoiceData = []
  }
  private invoiceSelectionConfirm() {
    this.isInvoice = false
    this.serviceTypeId = ''
    this.selectType = ''
    this.keyWord = ''
    const oldArr = this.tableData2.filter((it: any) => it.tag !== 'X')
    const plusArr = [...this.invoiceArr, ...oldArr]
    const obj: any = {} // 有助于增加遍历效率
    const resArr = plusArr.reduce((cur: any, next: any) => {
      if (!obj[next.id]) {
        obj[next.id] = true
        cur.push(next)
      }
      return cur
    }, [])
    this.tableData2 = resArr
  }
}
</script>

<style lang="scss" scoped>
.order-detail {
  height: calc(100vh - 170px);
  overflow-y: auto;
}
.el-form-item {
  vertical-align: top;
  display: inline-block;
  width: 24.9%;
}
::v-deep .el-form-item__label {
  font-weight: 700 !important;
}
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
::v-deep .vxe-table--header .vxe-cell--title {
  color: #909399 !important;
}
.view-item .el-form-item {
  margin-bottom: 0;
}
.number-text {
  word-break: break-all;
}
</style>
