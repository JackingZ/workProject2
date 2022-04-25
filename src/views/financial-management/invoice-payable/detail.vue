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
          应付款
        </el-col>
        <el-col
          :span="20"
          style="text-align: right;"
        >
          <el-button
            v-if="!isView"
            type="primary"
            size="mini"
            :disabled="!form.exRate"
            @click="handleSave"
          >
            {{ isOnce ? '提交' : '重新提交' }}
          </el-button>
        </el-col>
      </el-row>
      <el-row
        v-if="form.code || form.status"
        style="background-color: #f2f2f2;padding: 10px 20px;"
      >
        <el-col
          v-if="form.code"
          :span="6"
        >
          编号：{{ form.code }}
        </el-col>
        <el-col
          v-if="form.status"
          :span="6"
        >
          状态：{{ (statusList.find(e => e.id === form.status) || {}).name }}
        </el-col>
        <el-col
          v-if="isView"
          :span="6"
        >
          核销状态：{{ form.ifVerify === 1 ? '已核销' : '未核销' }}
        </el-col>
      </el-row>
      <el-form
        ref="editForm"
        :model="form"
        :rules="formRules"
        label-width="110px"
        style="padding-top: 20px;"
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
          label="原单号"
          prop="orderCode"
        >
          <el-input
            v-if="!isView"
            v-model="form.orderCode"
            size="small"
            placeholder="请输入"
            disabled
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handleCode"
            />
          </el-input>
          <span
            v-else
            class="number-text"
          >
            {{ form.orderCode }}
          </span>
        </el-form-item>
        <el-form-item
          label="发票日期"
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
          label="发票类型"
          prop="invoiceType"
        >
          <el-select
            v-if="!isView"
            v-model="form.invoiceType"
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
          <span v-else>
            {{ (invoiceTypeList.find(e => e.value === form.invoiceType) || {}).label }}
          </span>
        </el-form-item>
        <el-form-item
          label="发票货币"
          prop="currencyId"
        >
          <el-select
            v-if="!isView"
            v-model="form.currencyId"
            placeholder="请选择"
            size="small"
            style="width:100%;"
            :loading="selectLoading"
            filterable
            @change="onCurrency"
          >
            <el-option
              v-for="item in currencyList"
              :key="item.id"
              :label="`${item.name}-${item.sign}`"
              :value="item.id"
            />
          </el-select>
          <span v-else>
            {{ form.currencyId }}
          </span>
        </el-form-item>
        <el-form-item
          label="汇率"
          prop="exRate"
        >
          <el-input-number
            v-if="!isView"
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
          v-if="isView && ['02', '06'].includes(form.serviceTypeId)"
          label="SO号"
        >
          <span class="number-text">{{ (form.soNoList || []).join(',') }}</span>
        </el-form-item>
        <el-form-item
          v-if="isView && form.serviceTypeId === '02'"
          label="提单号"
        >
          <span class="number-text">{{ (form.billNoList || []).join(',') }}</span>
        </el-form-item>
        <el-form-item
          v-if="isView && form.serviceTypeId === '02'"
          label="航空单号"
        >
          <span class="number-text">{{ (form.airNoList || []).join(',') }}</span>
        </el-form-item>
        <el-form-item
          v-if="isView && form.serviceTypeId === '02'"
          label="柜号"
        >
          <span class="number-text">{{ (form.containerNoList || []).join(',') }}</span>
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
          label="截止付款时间"
        >
          {{ form.cutoffTime || '--' }}
        </el-form-item>
        <el-form-item
          label="付款时间"
        >
          {{ form.payTime || '--' }}
        </el-form-item>
        <el-form-item
          label="逾期天数"
        >
          {{ form.day || '--' }}
        </el-form-item>
        <el-form-item
          v-if="!isView"
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
          v-if="isView"
          label="备注"
          style="width: 100%;"
        >
          <span>
            {{ form.remark }}
          </span>
        </el-form-item>
      </el-form>
      <div>
        <div style="border-top: 1px solid #e8e8e8;line-height: 50px;">
          明细行
        </div>
        <el-row>
          <el-col :span="20">
            <span style="font-weight: 700;padding-left: 20px;">总计：</span>
            <span>开票总金额：</span>
            <span>{{ amountText }}</span>
            <span>{{ (form.currencyName || '--') + '/' + (form.currencyId || '') }}</span>
            <span>， 账单本币总金额：</span>
            <span>{{ selfAmountText }}</span>
            <span>{{ (selfCurrency.currencyName || '--') + '/' + (selfCurrency.currencyId || '') }}</span>
          </el-col>
          <el-col :span="4">
            <div style="text-align: right;padding-right: 10px;">
              <!-- <el-button
                type="primary"
                size="mini"
                @click="handleBill"
              >
                账单明细
              </el-button> -->
              <el-button
                v-if="!isView"
                type="primary"
                size="mini"
                @click="handleAddBill"
              >
                添加明细行
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-table
          :data="tableData"
          style="width: 100%;margin: 10px 0;"
          header-align="center"
          align="center"
          border
        >
          <el-table-column
            label="行号"
            width="80px"
          >
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="costitemName"
            label="项目"
          >
            <template slot-scope="scope">
              <el-input
                v-if="!isView"
                v-model="scope.row.costitemName"
                size="small"
                placeholder="请输入"
                clearable
                disabled
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="handleProject(scope.$index)"
                />
              </el-input>
              <span v-else>
                {{ scope.row.costitemName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="itemDesc"
            label="说明"
          >
            <template slot-scope="scope">
              <el-input
                v-if="!isView"
                v-model="scope.row.itemDesc"
                size="small"
                placeholder="请输入"
                clearable
              />
              <span v-else>
                {{ scope.row.itemDesc }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="quantity"
            label="数量"
            width="100px"
          >
            <template slot-scope="scope">
              <el-input-number
                v-if="!isView"
                v-model="scope.row.quantity"
                class="input-number-valiate"
                :controls="false"
                placeholder="请输入"
                size="small"
                :min="-99999999"
                :max="99999999"
                @change="handlerChange(scope.row)"
              />
              <span v-else>
                {{ scope.row.quantity }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="price"
            label="单价"
            width="100px"
          >
            <template slot-scope="scope">
              <el-input-number
                v-if="!isView"
                v-model="scope.row.price"
                class="input-number-valiate"
                :controls="false"
                placeholder="请输入"
                size="small"
                :min="-999999"
                :max="999999"
                :precision="4"
                @change="handlerChange(scope.row)"
              />
              <span v-else>
                {{ scope.row.price }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="amount"
            label="金额"
            width="120"
          />
          <el-table-column
            prop="selfAmount"
            label="账单本币金额"
            width="120"
          />
          <!--<el-table-column
            prop="confirm"
            label="客户确认"
            width="120px"
          >
            <template slot-scope="scope">
              <span v-show="!scope.row.confirm">未确认</span>
              <span v-show="scope.row.confirm">已确认</span>
            </template>
          </el-table-column>-->
          <el-table-column
            fixed="right"
            width="100px"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                v-if="!isView"
                type="text"
                style="color: #f56c6c;"
                @click="handleDelete(scope.$index)"
              >
                删除
              </el-button>
              <!-- <el-button
                v-if="!isEdit && !scope.row.confirm"
                type="text"
                style="color: #f56c6c;"
                @click="handleAffirm(scope.row)"
              >
                确认
              </el-button> -->
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
              filterable
              size="small"
              style="width:130px;margin-right: 5px;"
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
              v-if="form.clientType === '3'"
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

        <el-dialog
          title="选择订单号"
          :visible.sync="isNumber"
          :close-on-click-modal="false"
          width="1200px"
          @closed="cancelNumber"
        >
          <div v-loading="dialogLoading">
            <div style="text-align: right;">
              <el-select
                v-model="searchForm.type"
                style="width: 130px;margin-right:5px;"
                placeholder="订单类别"
                size="small"
                filterable
                @change="handleNumber"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-date-picker
                v-model="searchForm.orderTime"
                :clearable="false"
                unlink-panels
                type="daterange"
                align="right"
                size="small"
                value-format="yyyy-MM-dd"
                range-separator="~"
                style="width:240px;margin-right:5px;"
                start-placeholder="下单起始时间"
                end-placeholder="下单截止时间"
              />
              <el-input
                v-model="searchForm.number"
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
                    v-show="!['02','06'].includes(form.serviceTypeId)"
                    label="原单号"
                    value="1"
                  />
                  <el-option
                    v-show="['02'].includes(form.serviceTypeId)"
                    label="航空单号"
                    value="3"
                  />
                  <el-option
                    v-show="['02'].includes(form.serviceTypeId)"
                    label="提单号"
                    value="4"
                  />
                  <el-option
                    v-show="['02', '06'].includes(form.serviceTypeId)"
                    label="SO号"
                    value="5"
                  />
                  <el-option
                    v-show="['02'].includes(form.serviceTypeId)"
                    label="柜号"
                    value="6"
                  />
                </el-select>
              </el-input>
              <el-button
                type="primary"
                size="small"
                @click="handleNumber"
              >
                查询
              </el-button>
            </div>
            <el-table
              v-if="form.serviceTypeId !== '02'"
              :data="numberData"
              border
              max-height="300"
              style="width: 100%;margin: 10px 0;"
              @row-click="(row) => onTableRowClick(row, 'order')"
            >
              <el-table-column
                width="200"
              >
                <template slot="header">
                  <span v-if="form.serviceTypeId !== '06'">原单号</span>
                  <span v-if="form.serviceTypeId === '06'">SO号</span>
                </template>
                <template slot-scope="scope">
                  <span v-if="form.serviceTypeId !== '06'">{{ scope.row.code }}</span>
                  <span v-if="form.serviceTypeId === '06'">{{ (scope.row.soCodes || []).join(',') }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :formatter="formmatType"
                label="业务类型"
                width="100"
              />
              <el-table-column
                prop="createTime"
                label="下单时间"
                width="180"
              />
              <el-table-column
                label="下单客户"
                show-overflow-tooltip
                prop="buyerName"
              />
              <el-table-column
                label="下单仓库"
                width="180"
                prop="warehouseName"
                show-overflow-tooltip
              />
              <el-table-column
                prop="packages"
                label="箱数"
                width="120"
              />
              <el-table-column
                prop="volumes"
                label="体积"
                width="120"
              />
            </el-table>
            <el-table
              v-if="form.serviceTypeId === '02' && searchForm.type && bookingData.length > 0"
              v-loading="dialogLoading"
              :data="bookingData"
              border
              max-height="300"
              style="width: 100%;margin: 10px 0;"
              @row-click="(row) => onTableRowClick(row, 'order')"
            >
              <el-table-column
                fixed="left"
                prop="code"
                label="原单号"
                min-width="180"
                show-overflow-tooltip
              />
              <el-table-column
                v-if="searchForm.type === '1'"
                prop="soCode"
                label="SO号"
                min-width="150"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.soCode || '-' }}
                </template>
              </el-table-column>
              <el-table-column
                v-if="searchForm.type === '0'"
                prop="billNo"
                label="提单号"
                min-width="150"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.billNo || '-' }}
                </template>
              </el-table-column>
              <el-table-column
                v-if="searchForm.type === '0'"
                prop="airNo"
                label="航空单号"
                min-width="150"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.airNo || '-' }}
                </template>
              </el-table-column>
              <el-table-column
                prop=""
                :formatter="formatStatus"
                label="订单状态"
                width="120"
              />
              <el-table-column
                prop="audit"
                label="审核状态"
                width="120"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.audit === '0'">待审核</span>
                  <span v-else-if="scope.row.audit === '1'">审核通过</span>
                  <span v-else-if="scope.row.audit === '2'">审核拒绝</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="businessType"
                label="业务类型"
                width="120"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.businessType === '0'">空运</span>
                  <span v-else-if="scope.row.businessType === '1'">海运</span>
                  <span v-else-if="scope.row.businessType === '2'">铁路</span>
                  <span v-else-if="scope.row.businessType === '4'">卡航</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="bsServiceName"
                label="服务"
                min-width="150"
                show-overflow-tooltip
              />
              <el-table-column
                prop="portsFromName"
                label="起运港"
                width="180"
              />
              <el-table-column
                prop="portsToName"
                label="目的港"
                width="180"
              />
              <el-table-column
                prop="supplierName"
                label="供应商名称"
                width="180"
                show-overflow-tooltip
              />
              <el-table-column
                prop="custName"
                label="下单客户"
                width="180"
                show-overflow-tooltip
              />
              <el-table-column
                v-if="searchForm.type === '1'"
                label="起运港提柜"
                width="120"
              >
                <template slot-scope="scope">
                  {{ formatContain(scope.row, '251') }}
                </template>
              </el-table-column>
              <el-table-column
                v-if="searchForm.type === '1'"
                label="起运港已装柜"
                width="120"
              >
                <template slot-scope="scope">
                  {{ formatContain(scope.row, '252') }}
                </template>
              </el-table-column>
              <el-table-column
                v-if="searchForm.type === '1'"
                label="起运港已还柜"
                width="120"
              >
                <template slot-scope="scope">
                  {{ formatContain(scope.row, '255') }}
                </template>
              </el-table-column>
              <el-table-column
                v-if="searchForm.type === '1'"
                label="目的港已提柜"
                width="120"
              >
                <template slot-scope="scope">
                  {{ formatContain(scope.row, '256') }}
                </template>
              </el-table-column>
              <el-table-column
                v-if="searchForm.type === '1'"
                label="目的港已还柜"
                width="120"
              >
                <template slot-scope="scope">
                  {{ formatContain(scope.row, '257') }}
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="下单时间"
                width="180"
              />
            </el-table>
            <el-pagination
              :current-page.sync="pagination.page"
              :page-size="pagination.size"
              layout="total, prev, pager, next"
              :total="pagination.total"
              style="text-align: right;margin-top: 10px;"
              @current-change="(current) => handleCurrentChange(current, 'order')"
            />
          </div>
        </el-dialog>

        <el-dialog
          title="选择项目"
          :visible.sync="isProject"
          :close-on-click-modal="false"
          width="1200px"
          @closed="isProject = false"
        >
          <div style="text-align: right;">
            <el-input
              v-model="searchForm.projectName"
              placeholder="项目名称"
              style="width: 200px;margin-right:10px;"
              size="small"
              clearable
            />
            <el-button
              type="primary"
              size="small"
              @click="getProjectList"
            >
              查询
            </el-button>
          </div>
          <el-table
            v-loading="dialogLoading"
            :data="projectData"
            border
            height="300px"
            style="width: 100%;margin: 10px 0;"
            @row-click="(row) => onTableRowClick(row, 'project')"
          >
            <el-table-column
              prop="name"
              label="项目中文名称"
            />
            <el-table-column
              prop="alias"
              label="项目英文名称"
            />
            <el-table-column
              label="项目类型"
            >
              <template slot-scope="scope">
                {{ (scope.row.types || []).map(item => item.typeName).join(',') || '--' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="settlement"
              label="结算单位"
            >
              <template slot-scope="scope">
                {{ (settlementList.find(item => item.id === scope.row.settlement) || {}).name || "--" }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="最低收费"
            />
            <el-table-column
              prop="remark"
              label="备注"
              width="200"
              show-overflow-tooltip
            />
          </el-table>
          <el-pagination
            :current-page.sync="pagination.page"
            :page-size="pagination.size"
            layout="total, prev, pager, next"
            :total="pagination.total"
            style="text-align: right;"
            @current-change="(current) => handleCurrentChange(current, 'project')"
          />
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
  getUsingServiceType,
  getCurrencyList,
  getInvoiceById,
  saveInvoice,
  updateInvoice,
  getwarehouseOrderList,
  getCostitemList,
  getExRateValue,
  getFullOrderList,
  getDeclareOrderList,
  getCarOrderList,
  getTrailerOrderList,
  getCustomerList,
  getExpressOrderList,
  getUnFinanceAgentList,
  getSupplierList,
  getAgentList
} from '@/api/financial-at-invoice-order'
import { getServiceSubtypeConfigList } from '@/api/operation-of-service-genara'
import { getOrderList as getBookOrderList, getStatusList } from '@/api/orderlist-at-booking'
import dayjs from 'dayjs'

function formParams() {
  return {
    serviceSubtypeId: undefined,
    currencyId: 'RMB', // 所选货币
    currencyName: '人民币',
    selfId: undefined, // 本币
    selfName: undefined,
    selfAmount: 0,
    exRate: undefined,
    id: undefined,
    amount: 0,
    custTag: undefined,
    agentId: undefined,
    agentName: undefined,
    clientId: undefined,
    clientName: undefined,
    clientType: undefined,
    serviceTypeId: undefined,
    serviceTypeName: undefined,
    invoiceType: undefined,
    orderId: undefined,
    orderCode: undefined,
    invDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    remark: undefined
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
  private searchForm: any = {
    name: '',
    type: '',
    number: '',
    projectName: '',
    orderTime: []
  }
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  private formRules: any = {
    agentId: [{ required: true, message: '请选择所属公司', trigger: 'change' }],
    invoiceType: [{ required: true, message: '发票类型不能为空', trigger: 'change' }],
    serviceTypeId: [{ required: true, message: '请选择服务类型', trigger: 'change' }],
    currencyId: [{ required: true, message: '请选择发票货币', trigger: 'change' }],
    exRate: [{ required: true, message: '汇率不能为空(根据发票货币确定)', trigger: 'blur' }],
    clientName: [{ required: true, message: '客户不能为空', trigger: 'change' }],
    invDate: [{ required: true, message: '请选择日期', trigger: 'change' }],
    orderCode: [{ required: true, message: '原单号不能为空', trigger: 'blur' }]
  }
  private selfCurrency: any = {
    currencyId: 'RMB',
    currencyName: '人民币'
  }
  private selectType: any = ''
  private detailLoading: boolean = false
  private dialogLoading: boolean = false
  private selectLoading: boolean = false
  private isCustomer: boolean = false // 显示客户弹窗
  private isNumber: boolean = false // 显示订单弹窗
  private isProject: boolean = false // 显示项目弹窗
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
  private serviceTypeList: any[] = []
  private currencyList: any[] = []
  private tableData: any[] = []
  private customerData: any[] = []
  private numberData: any[] = []
  private bookingData: any[] = []
  private projectData: any[] = []
  private companyList: any[] = []
  private custTypeList: any[] = []
  private settlementList: any[] = [
    {
      id: '0',
      name: '按重量'
    },
    {
      id: '1',
      name: '按体积'
    },
    {
      id: '2',
      name: '按金额'
    },
    {
      id: '3',
      name: '按票'
    },
    {
      id: '4',
      name: '按箱'
    },
    {
      id: '5',
      name: '按车'
    },
    {
      id: '6',
      name: '按柜'
    },
    {
      id: '7',
      name: '按里程'
    },
    {
      id: '8',
      name: '按时间'
    },
    {
      id: '9',
      name: '按托'
    },
    {
      id: 'A',
      name: '按个数'
    }
  ]
  private orderStatusList: any[] = []
  private typeList: any[] = []
  private projectIndex: number = 0
  private bookOrderStatusList: any[] = []

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
  get userCountryId(): string {
    const info = UserModule.info || {}
    return (info as any).countryId
  }
  get amountText() {
    let num: number = 0
    this.tableData.map((it: any) => {
      num += it.amount
    })
    return parseFloat(num.toFixed(2))
  }
  get selfAmountText() {
    let num: number = 0
    this.tableData.map((it: any) => {
      num += it.selfAmount
    })
    return parseFloat(num.toFixed(2))
  }
  /* 方法 */
  private formatterCutoffTime(row: any) {
    const cutoffTime = row.cutoffTime
    if (!cutoffTime) return '--'
    if (dayjs(cutoffTime).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')) return '--'
    const num = dayjs().diff(cutoffTime, 'day') + 1
    if (num > 0) {
      return num
    }
    return '--'
  }
  private formatStatus(row: any) {
    let name = ''
    this.bookOrderStatusList.map((it: any) => {
      if (it.key === row.orderStatus) {
        name = it.value
      }
    })
    return name
  }
  private async getStatusData() {
    if (!this.searchForm.type) return
    this.dialogLoading = true
    const params: any = {
      businessType: this.searchForm.type
    }
    await getStatusList(params).then((res: any) => {
      this.bookOrderStatusList = res.data || []
    }).catch(() => {
      this.bookOrderStatusList = []
      this.dialogLoading = false
    })
  }
  private formatContain(row: any, val: string) {
    const arr = (row || {}).containerStatus || []
    const brr = arr.filter((it: any) => it === val)
    return brr.length + '/' + arr.length
  }
  private handleBack() {
    this.resetDetail()
    this.$emit('back')
  }
  private resetDetail() {
    this.form = formParams()
    this.searchForm = {
      name: '',
      type: '',
      number: '',
      projectName: '',
      orderTime: []
    }
    this.tableData = []
    this.customerData = []
    this.typeList = []
    this.serviceTypeList = []
  }
  private validateData(callback: any) {
    let flag = true
    const editForm: any = this.$refs.editForm
    editForm.validate((valid: any) => {
      flag = valid
    })
    if (this.tableData.length === 0) {
      this.$message.error('明细行不能为空')
      flag = false
    }
    if (flag) {
      for (let i = 0; i < this.tableData.length; i++) {
        const data = this.tableData[i]
        if (!data.costitemId) {
          this.$message.error(`行号${i + 1}项目不能为空`)
          flag = false
          break
        }
        if (!data.itemDesc) {
          this.$message.error(`行号${i + 1}说明不能为空`)
          flag = false
          break
        }
        if (data.itemDesc.length > 200) {
          this.$message.error(`行号${i + 1}说明不能超过200个字符`)
          flag = false
          break
        }
        if (!data.quantity && data.quantity !== 0) {
          this.$message.error(`行号${i + 1}数量不能为空`)
          flag = false
          break
        }
        if (!data.price && data.price !== 0) {
          this.$message.error(`行号${i + 1}单价不能为空`)
          flag = false
          break
        }
        flag = true
      }
    }
    callback(flag)
  }
  private handleSave() {
    this.validateData((valid: any) => {
      if (valid) {
        const { agentId, agentName, clientId, clientName, clientProperty, ...obj } = this.form
        const params: any = {
          ...obj,
          clientId: agentId,
          clientName: agentName,
          agentId: clientId,
          agentName: clientName,
          amount: (this as any).amountText,
          selfAmount: (this as any).selfAmountText,
          selfName: this.selfCurrency.currencyName,
          selfId: this.selfCurrency.currencyId,
          invDate: dayjs(this.form.invDate).format('YYYY-MM-DD'),
          status: '0',
          clientType: undefined,
          clientProperty: undefined,
          agentType: undefined,
          custTag: undefined,
          items: this.tableData.map((e: any) => {
            e.price = parseFloat(e.price)
            e.amount = e.amount || 0
            e.selfAmount = e.selfAmount || 0
            return e
          })
        }
        this.detailLoading = true
        const ifOnce = (this as any).isOnce
        if (ifOnce) {
          saveInvoice(params).then(() => {
            this.detailLoading = false
            this.handleBack()
            this.$emit('getTableData')
          }).catch(() => {
            this.detailLoading = false
          })
        } else {
          updateInvoice(params).then(() => {
            this.detailLoading = false
            this.handleBack()
            this.$emit('getTableData')
          }).catch(() => {
            this.detailLoading = false
          })
        }
      }
    })
  }
  private onComType() {
    this.form.agentId = ''
    this.form.agentName = ''
    this.form.agentType = ''
    this.form.clientName = ''
    this.form.clientId = ''
    this.form.clientType = ''
    this.form.clientProperty = ''
    this.form.orderCode = ''
    this.form.orderId = ''
    this.form.serviceTypeId = ''
    this.form.serviceTypeName = ''
    this.form.billNoList = []
    this.form.airNoList = []
    this.form.soNoList = []
    this.form.containerNoList = []
    this.numberData = []
    this.typeList = []
    this.customerData = []
    this.setCustomerType()
    if (this.form.custTag !== '2') {
      this.form.agentId = (this as any).custId
      this.form.agentName = (this as any).custName
      this.form.agentType = (this as any).custType
    }
  }
  private onCompany() {
    this.form.agentName = ''
    this.form.agentType = ''
    this.form.clientName = ''
    this.form.clientId = ''
    this.form.clientType = ''
    this.form.clientProperty = ''
    this.form.orderCode = ''
    this.form.orderId = ''
    this.form.serviceTypeId = ''
    this.form.serviceTypeName = ''
    this.form.billNoList = []
    this.form.airNoList = []
    this.form.soNoList = []
    this.form.containerNoList = []
    this.numberData = []
    this.typeList = []
    this.customerData = []
    const item = this.companyList.find((it: any) => it.id === this.form.agentId)
    if (item) {
      this.form.agentName = item.name
      this.form.agentType = '2'
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
  private async onClientType() {
    this.form.clientName = ''
    this.form.clientId = ''
    this.form.clientProperty = ''
    this.form.orderCode = ''
    this.form.orderId = ''
    this.form.serviceTypeId = ''
    this.form.serviceTypeName = ''
    this.form.billNoList = []
    this.form.airNoList = []
    this.form.soNoList = []
    this.form.containerNoList = []
    this.numberData = []
    this.typeList = []
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
    if (this.form.clientType === '3') {
      // 代理
      params.cas = 'S'
    }
    this.selectLoading = true
    await getUsingServiceType(params).then((res: any) => {
      this.selectLoading = false
      const data = res.data || []
      this.serviceTypeList = JSON.parse(
        JSON.stringify(data)
          .replace(/typeName/g, 'name')
          .replace(/typeId/g, 'id')
          .replace(/children/g, 'list')
      )
    }).catch(() => {
      this.serviceTypeList = []
      this.selectLoading = false
    })
  }
  private handleCustomer() {
    this.resetDialog()
    this.isCustomer = true
  }
  private async onCustomer() {
    const type = (this as any).custType
    const subType = (this as any).custSubtype
    if (!this.form.clientType) {
      this.$message.error('请选择客户类型')
      return false
    } else if (type === '0') {
      await this.getSupplierList()
    } else if (type === '2' && subType === '1' && this.form.custTag === '1' && this.form.clientType === '0') {
      this.customerData = [{
        id: '0',
        name: '聚货通',
        type: '0',
        subtype: '',
        countryId: 'CN',
        parentName: ''
      }]
      this.pagination.total = this.customerData.length
    } else if (type === '2' && subType === '1' && this.form.custTag === '1' && this.form.clientType === '3') {
      await this.getSupplierList()
    } else if (type === '2' && subType === '1' && this.form.custTag === '2') {
      this.customerData = [{
        id: (this as any).custId,
        name: (this as any).custName,
        type: '2',
        subtype: '1',
        countryId: (this as any).countryId,
        parentName: '聚货通'
      }]
      this.pagination.total = this.customerData.length
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
  private async getCustomerData() {
    this.dialogLoading = true
    const params: any = {
      custIds: [this.form.agentId],
      name: this.searchForm.name
    }
    await getCustomerList(params).then((res:any) => {
      const data = res.data || []
      const customerList = data
      this.customerData = customerList
      this.pagination.total = this.customerData.length
      this.dialogLoading = false
    }).catch((err:any) => {
      this.dialogLoading = false
      return err
    })
  }
  private async getSupplierList() {
    this.dialogLoading = true
    const params: any = {
      page: this.pagination.page,
      size: 9999,
      name: this.searchForm.name
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
  private async getAgentList() {
    this.dialogLoading = true
    const params: any = {
      page: this.pagination.page,
      size: 9999,
      name: this.searchForm.name,
      parentId: '0'
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

  private async handleCode() {
    if (!this.form.serviceTypeId) {
      this.$message.error('请选择服务类型')
      return
    }
    this.numberData = []
    this.bookingData = []
    this.resetDialog()
    this.isNumber = true
    this.searchForm.orderTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    await this.handleNumber()
  }
  private cancelNumber() {
    this.isNumber = false
    this.numberData = []
    this.bookingData = []
    this.searchForm.type = ''
    this.selectType = ''
  }

  private async handleNumber() {
    if (this.form.serviceTypeId === '00') {
      // 快递
      this.getExpressList()
    }
    if (this.form.serviceTypeId === '01') {
      // 卡车
      this.getCarOrderList()
    }
    if (this.form.serviceTypeId === '02') {
      // 订舱
      this.bookingData = []
      await this.getStatusData()
      this.getBookOrderList()
    }
    if (this.form.serviceTypeId === '03') {
      // 报关
      this.getDeclareOrderList()
    }
    if (this.form.serviceTypeId === '04') {
      // 仓储
      this.getWarehouseList()
    }
    if (this.form.serviceTypeId === '05') {
      // 专线
      this.getFullOrderList()
    }
    if (this.form.serviceTypeId === '06') {
      // 拖车
      this.getTrailerOrderList()
    }
  }
  private getBookOrderList() {
    if (!this.searchForm.type) return
    this.dialogLoading = true
    const params = {
      model: {
        businessType: this.searchForm.type,
        custId: this.form.agentId,
        custType: this.form.agentType,
        endTime: this.searchForm.orderTime[1],
        airNo: this.selectType === '3' ? this.searchForm.number : undefined,
        billNo: this.selectType === '4' ? this.searchForm.number : undefined,
        so: this.selectType === '5' ? this.searchForm.number : undefined,
        containerNo: this.selectType === '6' ? this.searchForm.number : undefined,
        orderType: '1',
        startTime: this.searchForm.orderTime[0],
        targetId: this.form.clientId
      },
      page: this.pagination.page,
      size: this.pagination.size
    }
    getBookOrderList(params).then((res: any) => {
      this.dialogLoading = false
      const data = res.data || {}
      this.bookingData = (data.result || []).map((e: any) => {
        e.code = e.markNo
        return e
      })
      this.pagination.total = data.total || 0
    }).catch((err: any) => {
      this.dialogLoading = false
      this.bookingData = []
      this.pagination.total = 0
      return err
    })
  }
  private getTrailerOrderList() {
    const params = {
      model: {
        customerId: this.form.agentId,
        type: this.searchForm.type,
        soCodes: this.searchForm.number,
        orderType: 1,
        sellerId: this.form.clientId,
        endDate: this.searchForm.orderTime[1] + ' 23:59:59',
        startDate: this.searchForm.orderTime[0] + ' 00:00:00'
      },
      page: this.pagination.page,
      size: this.pagination.size
    }
    this.dialogLoading = true
    getTrailerOrderList(params).then((res: any) => {
      this.dialogLoading = false
      const data = res.data || {}
      this.numberData = (data.result || []).map((item: any) => {
        return {
          id: item.id,
          code: item.number || '--',
          type: item.type,
          createTime: item.createTime,
          buyerName: item.customerName || '--',
          warehouseName: item.wareHouse || '--',
          soCodes: item.soCodes || [],
          packages: item.total || '--',
          volumes: ((this as any).$volumeConversion(item.volume, item.umVolume, 'CBM') || '--') + 'm³'
        }
      })
      this.pagination.total = data.total || 0
    }).catch((err: any) => {
      this.dialogLoading = false
      this.numberData = []
      this.pagination.total = 0
      return err
    })
  }
  private getCarOrderList() {
    const params = {
      model: {
        sellerId: this.form.clientId,
        isTask: '1',
        type: this.searchForm.type,
        number: this.searchForm.number,
        orderType: 1,
        customerId: this.form.agentId,
        endDate: this.searchForm.orderTime[1] + ' 23:59:59',
        startDate: this.searchForm.orderTime[0] + ' 00:00:00'
      },
      page: this.pagination.page,
      size: this.pagination.size
    }
    this.dialogLoading = true
    getCarOrderList(params).then((res: any) => {
      this.dialogLoading = false
      const data = res.data || {}
      this.numberData = (data.result || []).map((item: any) => {
        return {
          id: item.id,
          code: item.number || '--',
          type: item.goodsId,
          createTime: item.createTime,
          buyerName: item.customerName || '--',
          warehouseName: item.warehouseName || '--',
          packages: item.total || '--',
          volumes: ((this as any).$volumeConversion(item.volume, item.umVolume, 'CBM') || '--') + 'm³'
        }
      })
      this.pagination.total = data.total || 0
    }).catch((err: any) => {
      this.dialogLoading = false
      this.numberData = []
      this.pagination.total = 0
      return err
    })
  }
  private getDeclareOrderList() {
    const params = {
      model: {
        sellerId: this.form.clientId,
        declare: this.searchForm.type,
        number: this.searchForm.number,
        orderType: 1,
        customerId: this.form.agentId,
        endDate: this.searchForm.orderTime[1] + ' 23:59:59',
        startDate: this.searchForm.orderTime[0] + ' 00:00:00'
      },
      page: this.pagination.page,
      size: this.pagination.size
    }
    this.dialogLoading = true
    getDeclareOrderList(params).then((res: any) => {
      this.dialogLoading = false
      const data = res.data || {}
      this.numberData = (data.result || []).map((item: any) => {
        // TODO 报关订单列表接口返回不满足
        return {
          id: item.id,
          code: item.number,
          type: item.type,
          createTime: item.createTime,
          buyerName: item.customerName || '--',
          warehouseName: '--',
          packages: item.total || '--',
          volumes: ((this as any).$volumeConversion(item.volume, (this as any).$getVolumeUnitByLengthUnit((item.um || {}).umLength), 'CBM') || '--') + 'm³'
        }
      })
      this.pagination.total = data.total || 0
    }).catch((err: any) => {
      this.dialogLoading = false
      this.numberData = []
      this.pagination.total = 0
      return err
    })
  }
  private getFullOrderList() {
    const cType = (this as any).custType
    const params = {
      model: {
        buyerId: this.form.agentId,
        type: this.searchForm.type,
        code: this.searchForm.number,
        sellerId: this.form.clientId,
        endDate: this.searchForm.orderTime[1] + ' 23:59:59',
        startDate: this.searchForm.orderTime[0] + ' 00:00:00',
        salesmanStatusTag: true
      },
      page: this.pagination.page,
      size: this.pagination.size
    }
    this.dialogLoading = true
    getFullOrderList(params).then((res: any) => {
      this.dialogLoading = false
      const data = res.data || {}
      this.numberData = (data.result || []).map((item: any) => {
        return {
          id: item.id,
          code: item.code,
          type: item.type,
          createTime: item.createTime,
          buyerName: (item.buyer || {}).name || '--',
          warehouseName: (item.warehouse || {}).name || '--',
          packages: item.packages || '--',
          volumes: ((this as any).$volumeConversion(item.volumes, (this as any).$getVolumeUnitByLengthUnit((item.um || {}).umLength), 'CBM') || '--') + 'm³'
        }
      })
      this.pagination.total = data.total || 0
    }).catch((err: any) => {
      this.dialogLoading = false
      this.numberData = []
      this.pagination.total = 0
      return err
    })
  }
  private getWarehouseList() {
    const params = {
      model: {
        type: this.searchForm.type,
        code: this.searchForm.number,
        seller: {
          id: this.form.clientId
        },
        buyer: {
          id: this.form.agentId
        },
        orderType: 1,
        flag: 1,
        endDate: this.searchForm.orderTime[1] + ' 23:59:59',
        startDate: this.searchForm.orderTime[0] + ' 00:00:00'
      },
      page: this.pagination.page,
      size: this.pagination.size
    }
    this.dialogLoading = true
    getwarehouseOrderList(params).then((res: any) => {
      this.dialogLoading = false
      const data = res.data || {}
      this.numberData = (data.result || []).map((item: any) => {
        return {
          id: item.id,
          code: item.code,
          type: item.type,
          createTime: item.createTime,
          buyerName: (item.buyer || {}).name || '--',
          warehouseName: (item.warehouse || {}).name || '--',
          packages: item.packages || '--',
          volumes: ((this as any).$volumeConversion(item.volumes, (this as any).$getVolumeUnitByLengthUnit((item.um || {}).umLength), 'CBM') || '--') + 'm³'
        }
      })
      this.pagination.total = data.total || 0
    }).catch(() => {
      this.numberData = []
      this.pagination.total = 0
      this.dialogLoading = false
    })
  }

  private getExpressList() {
    this.dialogLoading = true
    const params: any = {
      current: this.pagination.page,
      size: this.pagination.size,
      data: {
        type: this.searchForm.type,
        custId: this.form.agentId,
        custType: this.form.agentType,
        orderNo: this.searchForm.number,
        start: this.searchForm.orderTime[0],
        end: this.searchForm.orderTime[1]
      }
    }
    getExpressOrderList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.numberData = (data.records || []).map((item: any) => {
          return {
            id: item.id,
            code: item.orderNo,
            type: item.type || '--',
            createTime: item.createTime,
            buyerName: item.custName || '--',
            warehouseName: '--',
            packages: item.packageNum || '--',
            volumes: ((this as any).$volumeConversion(item.totalVolume, (this as any).$getVolumeUnitByLengthUnit(item.unitMeasure), 'CBM') || '--') + 'm³'
          }
        })
        this.pagination.total = data.total
        this.dialogLoading = false
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }
  private onServiceType(val: any) {
    const serviceType = this.serviceTypeList.find((e: any) => e.id === val) || {}
    this.form.serviceTypeName = serviceType.name
    this.form.orderCode = ''
    this.form.orderId = ''
    this.numberData = []
    this.typeList = serviceType.list || []
  }

  private handleAddBill() {
    this.tableData.push({
      costitemId: '',
      costitemName: '',
      itemDesc: '',
      quantity: 0,
      price: 0,
      amount: 0,
      selfAmount: 0,
      confirm: 0
    })
  }
  private handleDelete(index: number) {
    const row = this.tableData[index]
    this.tableData.splice(index, 1)
  }
  private handlerChange(row: any) {
    if (row.quantity && row.price) {
      const num = row.quantity * row.price
      row.amount = parseFloat(num.toFixed(2))
    } else {
      row.amount = 0
    }
    this.calculateTotalPrice()
  }
  private calculateTotalPrice() {
    this.tableData = this.tableData.map((item: any) => {
      if (String(this.form.exRate)) {
        item.selfAmount = parseFloat((item.amount * this.form.exRate).toFixed(2))
      } else {
        item.selfAmount = item.amount
      }
      return item
    })
  }

  private handleProject(index: number) {
    if (!this.form.serviceTypeId) {
      this.$message.error('请选择服务类型')
      return
    }
    this.projectIndex = index
    this.resetDialog()
    this.isProject = true
    this.getProjectList()
  }
  private onTableRowClick(row: any, type: string) {
    if (type === 'customer') {
      const ctype = row.type
      const stype = row.subtype
      this.form.clientName = row.name
      this.form.clientId = row.id
      this.form.clientProperty = ctype + (stype ? `-${stype}` : '')
      this.form.orderCode = ''
      this.form.orderId = ''
      this.form.serviceTypeId = ''
      this.form.serviceTypeName = ''
      this.isCustomer = false
    }
    if (type === 'order') {
      this.isNumber = false
      this.form.orderId = row.id
      this.form.orderCode = row.code
      this.form.billNoList = row.billNo ? [row.billNo] : []
      this.form.airNoList = row.airNo ? [row.airNo] : []
      this.form.soNoList = this.form.serviceTypeId === '06' ? row.soCodes : row.soCode ? [row.soCode] : []
      this.form.containerNoList = row.containerNo ? row.containerNo.split(',') : []
      this.form.serviceSubtypeId = this.form.serviceTypeId !== '02' ? row.type : row.businessType
    }
    if (type === 'project') {
      this.tableData[this.projectIndex].costitemName = row.name
      this.tableData[this.projectIndex].costitemId = row.id
      this.isProject = false
    }
  }
  private resetDialog() {
    this.pagination = {
      page: 1,
      size: 10,
      total: 0
    }
    this.searchForm = {
      name: '',
      type: '',
      number: '',
      projectName: '',
      orderTime: []
    }
    this.selectType = ''
  }
  private async handleCurrentChange(current: any, type: string) {
    this.pagination.page = current
    if (type === 'order') {
      await this.handleNumber()
    }
    if (type === 'project') {
      this.getProjectList()
    }
  }
  private getProjectList() {
    const params = {
      name: this.searchForm.projectName,
      serviceTypeId: this.form.serviceTypeId,
      page: this.pagination.page,
      size: this.pagination.size
    }
    this.dialogLoading = true
    getCostitemList(params).then((res: any) => {
      this.dialogLoading = false
      const data = res.data || {}
      this.projectData = data.result || []
      this.pagination.total = data.total || 0
    }).catch(() => {
      this.dialogLoading = false
    })
  }
  private getDetailsById(id: string) {
    // getById
    const params = {
      id
    }
    getInvoiceById(params).then(async(res: any) => {
      const { items, clientProperty, agentId, agentName, clientId, clientName, ...form } = res.data
      this.selfCurrency = {
        currencyId: form.selfId,
        currencyName: form.selfName
      }
      try {
        this.form = {
          ...form,
          clientId: agentId,
          clientName: agentName,
          agentId: clientId,
          agentName: clientName,
          agentType: (this as any).custType,
          clientType: undefined,
          clientProperty: undefined
        }
        this.setCustomerType()
        await this.getServiceType()
        const item: any = this.serviceTypeList.find((it: any) => it.id === this.form.serviceTypeId)
        if (item) {
          this.typeList = item.list
        }
        this.tableData = items
        this.detailLoading = false
      } catch (error) {
        this.detailLoading = false
      }
    }).catch(_ => {
      this.detailLoading = false
    })
  }
  private onAmount() {
    this.calculateTotalPrice()
  }
  // 获取汇率
  private onCurrency() {
    const currency = this.currencyList.find((item: any) => item.id === this.form.currencyId)
    if (!currency) {
      this.form.currencyName = ''
      this.form.exRate = ''
      this.calculateTotalPrice()
      return
    }
    this.form.currencyName = currency.name
    if (this.selfCurrency.currencyId === this.form.currencyId) {
      this.form.exRate = 1
      this.calculateTotalPrice()
      return
    }
    this.form.exRate = ''
    const params: any = {
      c1: this.selfCurrency.currencyId,
      c2: this.form.currencyId
    }
    getExRateValue(params).then((res: any) => {
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
        return
      }
      this.calculateTotalPrice()
    }).catch((err: any) => {
      return err
    })
  }
  private async getCurrencyList() {
    this.selectLoading = true
    await getCurrencyList().then((res:any) => {
      this.selectLoading = false
      const data = res.data || {}
      this.currencyList = data.result || []
    }).catch((err:any) => {
      this.selectLoading = false
      this.currencyList = []
      return err
    })
  }

  private async show(id?: string) {
    this.detailLoading = true
    await this.getCurrencyList()
    this.currencyList.map((it: any) => {
      if (it.countries.some((c: any) => c.id === (this as any).userCountryId)) {
        this.selfCurrency = {
          currencyId: it.id,
          currencyName: it.name
        }
      }
    })
    const editForm: any = this.$refs.editForm
    this.$nextTick(() => {
      editForm.clearValidate()
    })
    if (id) {
      this.getDetailsById(id)
    } else {
      this.form = formParams()
      this.form.agentId = (this as any).custId
      this.form.agentName = (this as any).custName
      this.form.agentType = (this as any).custType
      this.onCurrency()
      this.tableData = []
      this.resetDialog()
      this.setCustomerType()
      this.detailLoading = false
    }
  }
  private setCustomerType() {
    // agentid 付款方   --> custid 收款方
    const type = (this as any).custType
    const subType = (this as any).custSubtype
    if (type === '0') {
      // 聚货通
      this.custTypeList = [{ id: '3', name: '供应商' }]
    } else if (type === '2' && subType === '1' && this.form.custTag === '1') {
      // 一级代理商
      this.custTypeList = [
        { id: '0', name: '聚货通' },
        { id: '3', name: '供应商' }
      ]
    } else if (type === '2' && subType === '1' && this.form.custTag === '2') {
      // 一级代理商操作二级代理商
      this.custTypeList = [
        { id: '2', name: '一级代理商' }
      ]
    } else if (type === '2' && subType === '2') {
      // 二级代理商
      this.custTypeList = [
        { id: '2', name: '一级代理商' }
      ]
    } else {
      this.custTypeList = []
      this.form.clientType = undefined
    }
  }
  private formmatStatus(row: any) {
    const item: any = this.orderStatusList.find((it: any) => it.id === row.status.WS_IN) || {}
    return item.name || '--'
  }
  private formmatType(row: any) {
    const item: any = this.typeList.find((it: any) => Number(it.id) === Number(row.type)) || {}
    return item.name || '--'
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
