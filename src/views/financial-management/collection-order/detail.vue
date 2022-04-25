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
          收款单
        </el-col>
        <el-col
          :span="20"
          style="text-align: right;"
        >
          <el-checkbox
            v-model="ifOut"
            :disabled="!isEdit"
          >
            开票
          </el-checkbox>
          <el-button
            v-if="isEdit"
            type="primary"
            size="mini"
            style="margin-left: 10px;"
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
          label="收款单号"
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
          label="收款流水号"
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
          label="账号"
          prop="payAccount"
        >
          <el-input
            v-if="isEdit"
            v-model="form.payAccount"
            size="small"
            placeholder="请输入"
            disabled
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handleNumber"
            />
          </el-input>
          <span
            v-else
            class="number-text"
          >
            {{ form.payAccount }}
          </span>
        </el-form-item>
        <el-form-item
          label="收款方式"
          prop="payMethod"
        >
          <el-select
            v-if="isEdit"
            v-model="form.payMethod"
            disabled
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
          v-if="false"
          label="收款类型"
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
              v-for="(item, index) in sourceOption"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <span v-else>
            {{ (sourceOption.find((it) => it.id === form.payType) || {}).name }}
          </span>
        </el-form-item>
        <el-form-item
          label="回款日期"
          prop="payDate"
        >
          <el-date-picker
            v-if="isEdit"
            v-model="form.payDate"
            type="datetime"
            style="width: 100%;"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择"
          />
          <span v-else>
            {{ form.payDate }}
          </span>
        </el-form-item>
        <el-form-item
          label="货币"
          prop="currencyId"
        >
          <el-select
            v-if="isEdit"
            v-model="form.currencyId"
            :disabled="!form.custId"
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
          label="回款金额"
          prop="amount"
        >
          <el-input-number
            v-if="isEdit"
            v-model="form.amount"
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
            {{ form.amount }}
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
          关联回款
        </div>
        <el-row>
          <el-col :span="4">
            <span style="font-weight: 700;padding-left: 20px;">总计：</span>
            <span>回款金额：</span>
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
                选择回款
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-table
          :data="relationTable"
          style="width: 100%;margin: 10px 0 20px 0;"
          header-align="center"
          align="center"
          border
        >
          <el-table-column
            prop="id"
            label="回款单号"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="payDate"
            label="回款日期"
            width="160"
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
          />
          <el-table-column
            prop="surplus"
            label="回款本币结余"
          />
          <el-table-column
            fixed="right"
            width="120"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                v-if="isEdit"
                type="text"
                style="color: #f56c6c;"
                @click="handleDelete(scope.row.id, '1')"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div style="border-top: 1px solid #e8e8e8;line-height: 50px;">
          核销发票
        </div>
        <el-row>
          <el-col :span="16">
            <span style="font-weight: 700;padding-left: 20px;">总计：</span>
            <span>发票总金额：</span>
            <span
              v-for="(item) in amountList"
              :key="item.key"
            >
              <span style="font-size: 12px;">{{ item.label }}：</span>
              <span style="">{{ item.value }}&nbsp;&nbsp;</span>
            </span>
            <span>， 账单本币总金额：</span>
            <span>{{ selfAmountFilter }}</span>
          </el-col>
          <el-col :span="8">
            <div style="text-align: right;padding-right: 10px;">
              <el-button
                v-if="isEdit"
                type="primary"
                size="mini"
                @click="handleOut"
              >
                选择开票
              </el-button>
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
          :data="writeoffsTable"
          style="width: 100%;margin: 10px 0;"
          header-align="center"
          align="center"
          border
        >
          <el-table-column
            prop="code"
            label="发票编号"
          />
          <el-table-column
            prop="invDate"
            label="发票日期"
            width="160"
          />
          <el-table-column
            prop="auditTime"
            label="审核时间"
            width="160"
          />
          <el-table-column
            prop="orderCode"
            label="原单号"
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
          />
          <el-table-column
            prop="amount"
            label="金额"
          />
          <el-table-column
            prop="selfAmount"
            label="本币金额"
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
                @click="handleDelete(scope.row.id, '2')"
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
            @current-change="handlePageChange"
          />
        </el-dialog>

        <el-dialog
          title="选择账号"
          :visible.sync="isNumber"
          :close-on-click-modal="false"
          width="1200px"
          @closed="isNumber = false; number = ''"
        >
          <div style="text-align: right;">
            <el-input
              v-model="number"
              placeholder="账号"
              style="width: 200px;margin-right:10px;"
              size="small"
              clearable
            />
            <el-button
              type="primary"
              size="small"
              @click="getNumberList"
            >
              查询
            </el-button>
          </div>
          <el-table
            v-loading="dialogLoading"
            :data="numberData"
            border
            height="300px"
            style="width: 100%;margin: 10px 0;"
            @row-click="onNumberRow"
          >
            <el-table-column
              prop="acctName"
              label="账户名称"
            />
            <el-table-column
              prop="type"
              label="收款方式"
            >
              <template slot-scope="scope">
                {{ (sourceData.find((it) => it.id === scope.row.type) || {}).name }}
              </template>
            </el-table-column>
            <el-table-column
              prop="acctNo"
              label="收款账号"
            />
            <el-table-column
              prop="currencyName"
              label="币种"
            />
            <el-table-column
              prop="countryName"
              label="国家/地区"
            />
          </el-table>
        </el-dialog>

        <el-dialog
          title="选择回款"
          :visible.sync="isAccount"
          :close-on-click-modal="false"
          width="1200px"
          @closed="cancelAccount"
        >
          <div style="text-align: right;">
            <el-input
              v-model="account"
              placeholder="回款单号"
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
              label="回款单号"
              min-width="150"
              show-overflow-tooltip
            />
            <el-table-column
              prop="payDate"
              label="回款日期"
              width="160"
            />
            <el-table-column
              prop="custName"
              label="客户名称"
              min-width="150"
              show-overflow-tooltip
            />
            <el-table-column
              prop="payAccount"
              label="结算账户"
              min-width="150"
              show-overflow-tooltip
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
              prop="surplus"
              label="回款本币结余"
              width="140"
            />
          </el-table>
          <div style="text-align: right; padding-top: 20px;">
            <el-button @click="cancelAccount">
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
                width="100"
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

        <el-dialog
          title="选择开票"
          :visible.sync="isOut"
          :close-on-click-modal="false"
          width="1000px"
          @closed="cancelOut"
        >
          <div style="text-align: right;">
            <el-select
              v-model="serviceTypeId"
              :loading="selectLoading"
              placeholder="服务大类"
              size="small"
              filterable
              clearable
              style="width:130px;margin-right: 10px;"
              @focus="getServiceType"
              @change=";(outData = [])"
            >
              <el-option
                v-for="item in serviceTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-button
              type="primary"
              size="small"
              @click="getOutList"
            >
              查询
            </el-button>
          </div>
          <el-table
            v-loading="dialogLoading"
            :data="outData"
            border
            height="400px"
            style="width: 100%;margin: 10px 0;"
            @selection-change="onOutSelection"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              prop="clientName"
              label="客户名称"
              min-width="200"
            />
            <el-table-column
              prop="invDate"
              label="开票日期"
              width="160"
            />
            <el-table-column
              prop="status"
              label="审核状态"
              width="120"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.status === '0'">待审核</span>
                <span v-else-if="scope.row.status === '1'">已通过</span>
                <span v-else-if="scope.row.status === '2'">已拒绝</span>
              </template>
            </el-table-column>
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
          </el-table>
          <div style="text-align: right; padding-top: 20px;">
            <el-button @click="cancelOut">
              取 消
            </el-button>
            <el-button
              type="primary"
              @click="outSelectionConfirm"
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
  getBankList,
  getRecInvoice,
  getRecAccount,
  getReceiveById,
  addReceive,
  editReceive,
  getAgentList,
  getCustomerList,
  getOutInvoiceOption,
  getUnInvoiceOption,
  getUnFinanceAgentList,
  getUsingServiceType
} from '@/api/financial-at-invoice-order'
import dayjs from 'dayjs'

function formParams() {
  return {
    amount: undefined,
    selfAmount: undefined,
    id: undefined,
    custTag: undefined,
    agentId: undefined,
    agentName: undefined,
    serialNumber: undefined,
    currencyId: undefined,
    currencyName: undefined,
    custId: undefined,
    custName: undefined,
    custType: undefined,
    exRate: undefined,
    payDate: undefined,
    payType: undefined,
    payAccount: undefined,
    remark: undefined,
    status: undefined,
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
    sourceType: {
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
    id: [{ required: true, message: '收款单号不能为空', trigger: 'blur' }],
    serialNumber: [
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (value && reg.test(value)) {
            callback(new Error('收款流水号不能是中文'))
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
    amount: [{ required: true, message: '回款金额不能为空', trigger: 'blur' }],
    selfAmount: [{ required: true, message: '本币金额不能为空', trigger: 'blur' }],
    payDate: [{ required: true, message: '请选择回款日期', trigger: 'change' }],
    payAccount: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }],
    payMethod: [{ required: true, message: '请选择来源', trigger: 'change' }]
  }
  private name = ''
  private number = ''
  private keyWord: any = ''
  private selectType: any = ''
  private serviceTypeId: any = ''
  private account: any = ''
  private isCustomer: boolean = false
  private isNumber: boolean = false
  private isInvoice: boolean = false
  private isAccount: boolean = false
  private isOut: boolean = false
  private ifOut: boolean = false
  private custTypeList: any[] = []
  private customerData: any[] = []
  private invoiceData: any[] = []
  private serviceTypeList: any[] = []
  private outData: any[] = []
  private outArr: any[] = []
  private accountData: any[] = []
  private accountArr: any[] = []
  private invoiceArr: any[] = []
  private numberData: any[] = []
  private companyList: any[] = []
  private relationsData: any[] = []
  private writeoffsData: any[] = []
  private detailLoading: boolean = false
  private dialogLoading: boolean = false
  private selectLoading: boolean = false
  private currencyList: any[] = []
  private currentId = '' // 当前收款单id
  private total = 0
  private page = 1
  private size = 10
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  private searchForm: any = {
    name: ''
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

  get custSubtype(): string {
    const info = UserModule.info || {}
    const custSubtype = (info as any).custSubtype
    return custSubtype
  }
  get userCountryId(): string {
    const info = UserModule.info || {}
    return (info as any).countryId
  }

  get statusData() {
    const data = (this as any).statusList
    return data
  }
  get sourceData() {
    const data = (this as any).sourceList
    return data
  }
  get sourceOption() {
    const data = (this as any).sourceType
    return data
  }

  get amountFilter() {
    const data = (this as any).relationsData.filter((it: any) => it.tag !== 'X')
    let num = 0
    data.map((it: any) => {
      num += it.surplus
    })
    return parseFloat(num.toFixed(2))
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
    const data = (this as any).writeoffsData.filter((it: any) => it.tag !== 'X')
    this.currencyList.map((c: any) => {
      const arr = data.filter((s: any) => s.currencyId === c.id)
      if (arr.length > 0) {
        obj[c.id] = arr.reduce((amountFilter: number, item: any) => {
          const mathPV = item.amount
          amountFilter += mathPV
          return parseFloat(amountFilter.toFixed(2))
        }, 0)
      }
    })
    return obj
  }
  get selfAmountFilter() {
    const data = (this as any).writeoffsData.filter((it: any) => it.tag !== 'X')
    let num = 0
    data.map((it: any) => {
      num += it.selfAmount
    })
    return parseFloat(num.toFixed(2))
  }
  get relationTable() {
    return this.relationsData.filter((it: any) => it.tag !== 'X')
  }
  get writeoffsTable() {
    return this.writeoffsData.filter((it: any) => it.tag !== 'X')
  }
  get customerList() {
    return this.customerData.slice((this.pagination.page - 1) * this.pagination.size, (this.pagination.page) * this.pagination.size)
  }

  /* 方法 */
  private countNum(num1: number, num2: number) {
    return parseFloat((num1 * num2).toFixed(2))
  }
  private setData(id?: string): void {
    this.getCurrencyList()
    if (id) {
      this.currentId = id
      this.getReceiveById(id)
    } else {
      this.form.agentId = (this as any).custId
      this.form.agentName = (this as any).custName
      this.setCustomerType()
    }
  }
  private setCustomerType() {
    // 收款单
    // 当前账号类型
    // agentid 收款方  <-- custid 付款方
    // 供应商          <-- 聚货通
    // 聚货通          <-- 代理商（一级）
    // 代理商（一级）   <-- 代理商（二级）
    // 代理商（一级）   <-- 客户
    // 代理商（二级）   <-- 客户
    // 设置客户类型
    // 0-聚货通，1-客户，2-代理商，3-供应商
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
        { id: '2', name: '二级代理商' },
        { id: '1', name: '客户' }
      ]
    } else {
      this.custTypeList = []
      this.form.custType = undefined
    }
  }

  // 获取代理商列表
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
  // 获取客户列表
  private async getCustomerList() {
    this.dialogLoading = true
    const params: any = {
      name: this.searchForm.name,
      custIds: [this.form.agentId]
    }
    await getCustomerList(params)
      .then((res: any) => {
        const data = res.data || []
        this.customerData = data
        this.total = 0
        this.pagination.total = this.customerData.length
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
    this.form.amount = undefined
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
      this.form.selfAmount = this.countNum(this.form.amount || 0, this.form.exRate)
    }
  }
  private getReceiveById(id: string) {
    this.detailLoading = true
    getReceiveById({
      id
    })
      .then(async(res: any) => {
        const data = res.data || {}
        const { invoiceEntities, unionList, ifBill, custType, ...form } = data
        this.form = {
          ...form,
          custType: custType ? custType.substring(0, 1) : '1',
          clientType: custType
        }
        this.ifOut = ifBill === 1
        if (this.form.exRate > 0) {
          this.form.selfAmount = this.countNum(this.form.amount || 0, this.form.exRate)
        }
        this.setCustomerType()
        this.relationsData = unionList || []
        this.writeoffsData = invoiceEntities || []
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
      // if (this.writeoffsData.length <= 0) {
      //   this.$message.error('请选择发票')
      //   return
      // }
      // if (this.relationsData.length <= 0) {
      //   this.$message.error('请选择回款')
      //   return
      // }
      // const dataR = this.relationsData.filter((it: any) => it.tag !== 'X')
      // let numR = 0
      // dataR.map((it: any) => {
      //   if (it.amount > 0 && it.exRate > 0) {
      //     numR += it.amount * it.exRate
      //   }
      // })
      // const dataW = this.writeoffsData.filter((it: any) => it.tag !== 'X')
      // let numW = 0
      // dataW.map((it: any) => {
      //   if (it.amount > 0 && it.exRate > 0) {
      //     numW += it.amount * it.exRate
      //   }
      // })
      // if (numR < numW) {
      //   this.$message.error('发票总额不能大于回款总额')
      //   return
      // }
      this.detailLoading = true
      const { clientType, custType, custTag, ...form } = this.form
      const params: any = {
        ...form,
        custType: clientType,
        ifBill: this.ifOut ? 1 : 0,
        checked: 0
      }
      params.receiptIdList = this.relationsData.filter((it: any) => it.tag !== 'X').map((it: any) => it.id)
      params.invoiceIdList = this.writeoffsData.filter((it: any) => it.tag !== 'X').map((it: any) => it.id)
      this.currencyList.map((it: any) => {
        if (it.id === params.currencyId) {
          params.currencyName = it.name
        }
      })
      if ((this as any).isOnce) {
        addReceive(params)
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
        editReceive(params)
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
    this.relationsData = []
    this.writeoffsData = []
    this.customerData = []
    this.page = 1
    this.size = 10
    const editForm: any = this.$refs.editForm
    this.$nextTick(() => {
      editForm.clearValidate()
    })
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
    this.form.custName = ''
    this.form.custId = ''
    this.form.custType = ''
    this.form.clientType = ''
    this.relationsData = []
    this.writeoffsData = []
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
    this.relationsData = []
    this.writeoffsData = []
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
    this.relationsData = []
    this.writeoffsData = []
    this.customerData = []
  }
  private async handleCustomer() {
    this.resetDialog()
    this.isCustomer = true
  }
  private async onCustomer() {
    const type = (this as any).custType
    const subType = (this as any).custSubtype
    if (!this.form.custType) {
      this.$message.error('请选择客户类型')
      return false
    } else if (type === '3' && this.form.custType === '0') {
      this.customerData = [{
        id: '0',
        name: '聚货通',
        type: '0',
        subtype: '',
        countryId: 'CN',
        parentName: (this as any).custName
      }]
      this.pagination.total = this.customerData.length
    } else if (type === '3' && this.form.custType === '2') {
      await this.getAgentList('0')
    } else if (type === '2' && subType === '1' && this.form.custType === '2') {
      await this.getAgentList()
    } else {
      await this.getCustomerList()
    }
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
    this.invoiceData = []
    this.outData = []
    this.onExRate()
  }
  private handleNumber() {
    // 账号
    this.isNumber = true
    this.getNumberList()
  }
  private getNumberList() {
    // 账号
    this.dialogLoading = true
    const params: any = {
      custId: this.form.agentId,
      name: this.number
    }
    getBankList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.numberData = data.result || []
        this.total = data.total
        this.dialogLoading = false
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }
  private onNumberRow(row: any) {
    // 账号
    this.isNumber = false
    this.form.payAccount = row.acctNo
    this.form.payMethod = row.type
  }
  private handlePageChange(page: any): void {
    // 页数
    this.pagination.page = page
  }

  private handleAccount(): void {
    // 选择回款
    if (!this.form.custId) {
      this.$message.error('请选择客户')
      return
    }
    this.isAccount = true
    this.accountArr = this.relationsData.filter((it: any) => it.tag !== 'X').map((it: any) => it.id)
    this.getAccountList()
  }
  private getAccountList() {
    this.dialogLoading = true
    const params: any = {
      custId: this.form.custId,
      code: this.account
    }
    getRecAccount(params)
      .then((res: any) => {
        const data = res.data || []
        this.accountData = data
        if (this.accountArr.length) {
          this.accountArr.map((a: any) => {
            const item = this.accountData.find((it: any) => it.id === a || `${it.id}` === a)
            if (item) {
              this.$nextTick(() => {
                const root: any = this.$refs.accountTable
                root.toggleRowSelection(item, true)
              })
            }
          })
        }
        this.total = data.total
        this.dialogLoading = false
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return [null, err]
      })
  }
  private onAccountSelection(arr: any) {
    // 勾选回款列表
    this.accountArr = arr.map((it: any) => it.id)
  }
  private cancelAccount() {
    this.isAccount = false
    this.account = ''
    this.accountArr = []
    this.accountData = []
  }
  private accountSelectionConfirm() {
    this.isAccount = false
    this.account = ''
    const selectArr: any[] = []
    this.accountArr.map((a: any) => {
      const item = this.accountData.find((it: any) => it.id === a)
      if (item) {
        selectArr.push({
          ...item,
          tag: '1'
        })
      }
    })
    const useArr = this.relationsData.filter((it: any) => it.tag !== 'X')
    const plusArr = [...selectArr, ...useArr]
    const obj: any = {}
    const resArr = plusArr.reduce((cur: any, next: any) => {
      if (!obj[next.id]) {
        obj[next.id] = true
        cur.push(next)
      }
      return cur
    }, [])
    this.relationsData = resArr
  }
  private handleOut() {
    if (!this.form.custId) {
      this.$message.error('请选择客户')
      return
    }
    this.isOut = true
  }
  private getOutList() {
    if (!this.serviceTypeId) {
      this.$message.error('请选择服务')
      return
    }
    this.dialogLoading = true
    const params: any = {
      model: {
        serviceTypeId: this.serviceTypeId,
        custId: this.form.custId
      },
      page: 1,
      size: 9999
    }
    getOutInvoiceOption(params)
      .then((res: any) => {
        const data = res.data || {}
        this.outData = data.result || []
        this.dialogLoading = false
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return [null, err]
      })
  }
  private onOutSelection(val: any) {
    // 勾选开票列表
    this.outArr = (val || []).map((it: any) => it.id)
  }
  private cancelOut() {
    this.isOut = false
    this.serviceTypeId = ''
    this.outArr = []
    this.outData = []
  }
  private outSelectionConfirm() {
    this.isOut = false
    this.serviceTypeId = ''
    this.detailLoading = true
    const params: any = {
      idList: this.outArr
    }
    getUnInvoiceOption(this.outArr)
      .then((res: any) => {
        const data = res.data || []
        const oldArr = JSON.parse(JSON.stringify(this.writeoffsData))
        const plusArr = [...data, ...oldArr]
        const obj: any = {}
        const resArr = plusArr.reduce((cur: any, next: any) => {
          if (!obj[next.code]) {
            obj[next.code] = true
            cur.push(next)
          }
          return cur
        }, [])
        this.writeoffsData = resArr
        this.detailLoading = false
      })
      .catch((err: any) => {
        this.detailLoading = false
        return [null, err]
      })
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
      // 代理
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
    this.invoiceArr = []
  }

  private handleInvoice(): void {
    // 选择发票
    if (!this.form.custId) {
      this.$message.error('请选择客户')
      return
    }
    this.isInvoice = true
    this.invoiceArr = this.writeoffsData.filter((it: any) => it.tag !== 'X')
  }
  private getInvoiceList() {
    if (!this.serviceTypeId) {
      this.$message.error('请选择服务')
      return
    }
    this.dialogLoading = true
    const params: any = {
      custId: this.form.custId,
      serviceTypeId: this.serviceTypeId,
      orderCode: this.selectType === '1' ? this.keyWord : undefined,
      code: this.selectType === '3' ? this.keyWord : undefined,
      billNo: this.selectType === '4' ? this.keyWord : undefined,
      soNo: this.selectType === '5' ? this.keyWord : undefined,
      containerNo: this.selectType === '6' ? this.keyWord : undefined
    }
    getRecInvoice(params)
      .then((res: any) => {
        const data = res.data || []
        this.invoiceData = data
        if (this.invoiceArr.length) {
          this.invoiceArr.map((a: any) => {
            const item = this.invoiceData.find((it: any) => it.id === a.id || `${it.id}` === a.id)
            if (item) {
              this.$nextTick(() => {
                const root: any = this.$refs.invoiceTable
                root.toggleCheckboxRow(item)
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
    this.invoiceArr = this.invoiceArr.map((a: any) => {
      return {
        ...a,
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
    const useArr = this.writeoffsData.filter((it: any) => it.tag !== 'X')
    const plusArr = [...this.invoiceArr, ...useArr]
    const obj: any = {}
    const resArr = plusArr.reduce((cur: any, next: any) => {
      if (!obj[next.id]) {
        obj[next.id] = true
        cur.push(next)
      }
      return cur
    }, [])
    this.writeoffsData = resArr
  }
  private handleDelete(id: any, str: string): void {
    // 删除
    if (str === '1') {
      this.relationsData = this.relationsData.map((it: any) => {
        if (it.id === id) {
          it.tag = 'X'
        }
        return it
      })
    } else if (str === '2') {
      this.writeoffsData = this.writeoffsData.map((it: any) => {
        if (it.id === id) {
          it.tag = 'X'
        }
        return it
      })
    }
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
