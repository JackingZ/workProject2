<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        v-if="showPageName === 'index'"
        v-loading="noticeLoading"
        class="app-container"
      >
        <head-info
          info=""
          title="分单发货"
        >
          <template v-slot:option>
            <el-button
              type="primary"
              size="small"
              @click="handleViewBoard"
            >
              货量看板
            </el-button>
          </template>
        </head-info>
        <div class="app-panel">
          <el-row>
            <el-col :span="3">
              <el-button
                v-permission="['separateDeliveryAdd']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin: 0 10px;"
                @click="addRow"
              >
                新增
              </el-button>
              <el-dropdown
                trigger="click"
                @command="handleCommandInvoice"
              >
                <span
                  class="el-dropdown-link"
                >
                  导出
                  <i class="el-icon-arrow-down" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    command="2"
                  >
                    目的港箱单发票
                  </el-dropdown-item>
                  <el-dropdown-item
                    command="3"
                  >
                    起运港箱单发票
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
            <el-col
              :span="21"
              style="text-align:right;"
            >
              <el-select
                v-model="searchForm.type"
                size="small"
                style="width: 100px;margin-right: 5px;"
                placeholder="业务类型"
                filterable
                @focus="getSubtypeList"
                @change="onType"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="searchForm.originCountryId"
                :loading="selectLoading"
                placeholder="起运国"
                size="small"
                filterable
                clearable
                style="width:130px;margin-right:5px;"
                @focus="getCountryList"
                @change="onOriginCountry"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="searchForm.originPortId"
                :disabled="!searchForm.type || !searchForm.originCountryId"
                :loading="selectLoading"
                placeholder="起运港"
                size="small"
                clearable
                filterable
                style="width:130px;margin-right:5px;"
                @focus="getStartPortData"
              >
                <el-option
                  v-for="item in startPortList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="searchForm.targetCountryId"
                :loading="selectLoading"
                placeholder="目的国"
                clearable
                filterable
                style="width:130px;margin-right:5px;"
                size="small"
                @focus="getCountryList"
                @change="onTargetCountry"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="searchForm.targetPortId"
                :disabled="!searchForm.type || !searchForm.targetCountryId"
                :loading="selectLoading"
                placeholder="目的港"
                size="small"
                clearable
                filterable
                style="width:130px;margin-right:5px;"
                @focus="getEndPortData"
              >
                <el-option
                  v-for="item in endPortList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="searchForm.orgId"
                :disabled="!searchForm.type || (!searchForm.targetCountryId && !searchForm.originCountryId)"
                :loading="selectLoading"
                style="width:100px;margin-right:5px;"
                size="small"
                placeholder="服务机构"
                clearable
                filterable
                @focus="getSeviceOrganList"
              >
                <el-option
                  v-for="item in organList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
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
                v-model="searchForm.code"
                placeholder="请输入"
                class="input-with-select"
                style="width:240px;margin-right:10px;"
                size="small"
                clearable
              >
                <el-select
                  slot="prepend"
                  v-model="searchForm.codeType"
                  size="small"
                  style="width:100px;"
                  placeholder="请选择"
                >
                  <el-option
                    label="原单号"
                    value="1"
                  />
                  <el-option
                    label="备注"
                    value="2"
                  />
                  <el-option
                    v-show="searchForm.type === '1' || searchForm.type === '2'"
                    label="SO号"
                    value="3"
                  />
                  <el-option
                    v-show="searchForm.type === '1' || searchForm.type === '2'"
                    label="柜号"
                    value="5"
                  />
                  <el-option
                    v-show="searchForm.type === '0'"
                    label="提单号"
                    value="4"
                  />
                </el-select>
              </el-input>
              <el-button
                v-permission="['separateDeliveryQuery']"
                type="primary"
                size="small"
                @click="getShipTable(1)"
              >
                查询
              </el-button>
              <el-button
                v-permission="['separateDeliveryQuery']"
                type="text"
                size="small"
                @click="handleMoreSearch"
              >
                更多筛选
              </el-button>
            </el-col>
          </el-row>

          <el-table
            ref="table"
            :data="noticeData"
            border
            height="calc(100vh - 300px)"
            style="width: 100%;margin: 10px 0;"
          >
            <el-table-column
              :formatter="formatType"
              prop=""
              label="业务类型"
              width="100"
            />
            <el-table-column
              :formatter="formatTrans"
              prop=""
              label="服务类型"
              width="100"
            />
            <el-table-column
              prop=""
              label="订舱服务"
              width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.bsc || {}).name }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="数量"
              width="100"
            >
              <template slot-scope="scope">
                {{ (scope.row.containers || []).length }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="柜号/提单号"
              width="150"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.type === '0'">{{ scope.row.billNo || '--' }}</span>
                <span v-else-if="scope.row.type === '1' || scope.row.type === '2'">
                  {{ ((scope.row.containers[0] || {}).containerInfo || {}).containerNo || '--' }}
                </span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              label="运输类型"
              width="120"
            >
              <template slot-scope="scope">
                {{ scope.row.type === '0' ? '航空版' : '' }}
                {{ scope.row.type === '1' ? '柜型' : '' }}
                {{ scope.row.type === '2' ? '柜型' : '' }}
                {{ scope.row.type === '3' ? '车型' : '' }}
                &nbsp;
                {{ (((scope.row.containers || [])[0] || {}).containerInfo || {}).containerName }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="服务机构"
              width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.org || {}).value }}
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop=""
              label="服务编码"
              width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.bsc || {}).serviceCode }}
              </template>
            </el-table-column> -->
            <el-table-column
              prop=""
              label="起运港"
              min-width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.originPort || {}).value }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="目的港"
              min-width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.targetPort || {}).value }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="起运国"
              min-width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.originCountry || {}).value }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="目的国"
              min-width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.targetCountry || {}).value }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="安排出库"
              width="100"
            >
              <template slot-scope="scope">
                {{ scope.row.ifWareHouseOut === 1 ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="装柜/车确认"
              width="100"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="medium"
                  @click="cabinetConfirmClick(scope.row)"
                >
                  <span v-if="scope.row.ifConfirm === 0">待装载</span>
                  <span v-if="scope.row.ifConfirm === 1">待确认</span>
                  <span v-if="scope.row.ifConfirm === 2">已确认</span>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="起运港报关"
              width="120"
            >
              <template slot-scope="scope">
                {{ scope.row.ifOutDeclare === 1 ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="目的港报关"
              width="120"
            >
              <template slot-scope="scope">
                {{ scope.row.ifEnterDeclare === 1 ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="searchForm.type === '1' || searchForm.type === '2'"
              prop=""
              label="起运港拖车"
              width="120"
            >
              <template slot-scope="scope">
                {{ scope.row.ifOutTrailer === 1 ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="searchForm.type === '1' || searchForm.type === '2'"
              prop=""
              label="目的港拖车"
              width="120"
            >
              <template slot-scope="scope">
                {{ scope.row.ifEnterTrailer === 1 ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="searchForm.type === '0'"
              prop=""
              label="起运港卡车"
              width="120"
            >
              <template slot-scope="scope">
                {{ scope.row.ifOutCar === 1 ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="searchForm.type === '0'"
              prop=""
              label="目的港卡车"
              width="120"
            >
              <template slot-scope="scope">
                {{ scope.row.ifEnterCar === 1 ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="searchForm.type === '1' || searchForm.type === '2'"
              prop=""
              label="拆柜打托"
              width="100"
            >
              <template slot-scope="scope">
                {{ scope.row.openTank === 1 ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column
              :formatter="dispatchFormat"
              prop=""
              label="派送方式"
              width="120"
            />
            <el-table-column
              prop="shippingDate"
              label="起运日期"
              width="160"
            />
            <el-table-column
              prop="cutoffDate"
              label="截单日期"
              width="160"
            />
            <el-table-column
              prop="transitTime"
              label="运输时间"
              width="100"
            />
            <el-table-column
              prop=""
              label="目的仓代码"
              min-width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.fbastore || {}).value }}
              </template>
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注"
              width="200"
              show-overflow-tooltip
            />
            <el-table-column
              label="操作"
              fixed="right"
              width="220"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['separateDeliveryView']"
                  type="text"
                  size="medium"
                  @click="viewRow(scope.row)"
                >
                  查看
                </el-button>
                <el-button
                  v-if="$checkPermission(['separateDeliveryUpdate']) && scope.row.ifLoadingComplete !== 1"
                  type="text"
                  size="medium"
                  @click="editRow(scope.row)"
                >
                  编辑
                </el-button>
                <el-dropdown
                  v-if="$checkPermission(['separateDeliveryOrderDetail', 'separateDeliveryPortToOrderInvoice', 'separateDeliveryPortFromOrderInvoice', 'separateDeliveryInsurance'])"
                  trigger="click"
                  @command="handleCommandExport"
                >
                  <span
                    class="el-dropdown-link"
                    @click="handleExport(scope.row)"
                  >
                    导出
                    <i class="el-icon-arrow-down" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-permission="['separateDeliveryOrderDetail']"
                      command="1"
                    >
                      订单明细
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-permission="['separateDeliveryPortToInvoice']"
                      command="2"
                    >
                      目的港箱单发票(柜号)
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-permission="['separateDeliveryPFInvoice']"
                      command="3"
                    >
                      起运港箱单发票(柜号)
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-permission="['separateDeliveryPortToInvoice']"
                      command="4"
                    >
                      目的港箱单发票(箱号)
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-permission="['separateDeliveryPFInvoice']"
                      command="5"
                    >
                      起运港箱单发票(箱号)
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-permission="['separateDeliveryInsurance']"
                      command="6"
                    >
                      保险单
                    </el-dropdown-item>
                    <el-dropdown-item
                      command="7"
                    >
                      快递单
                    </el-dropdown-item>
                    <el-dropdown-item
                      command="8"
                    >
                      拆柜清单标准版
                    </el-dropdown-item>
                    <el-dropdown-item
                      command="9"
                    >
                      拆柜清单ROY版
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown
                  v-if="$checkPermission(['separateDeliveryOutWarehouse', 'separateDeliveryReplenishWarehouse', 'separateDeliveryPFCustoms', 'separateDeliveryPTCustoms', 'separateDeliveryPFTrailer', 'separateDeliveryPTTrailer', 'separateDeliveryPortFromCar', 'separateDeliveryPortToCar', 'separateDeliveryStripping'])"
                  trigger="click"
                  @command="handleCommandCustoms"
                >
                  <span
                    class="el-dropdown-link"
                    @click="handleCustoms(scope.row)"
                  >
                    更多
                    <i class="el-icon-arrow-down" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-if="$checkPermission(['separateDeliveryOutWarehouse']) && scope.row.ifWareHouseOut !== 1"
                      command="0"
                    >
                      安排出库
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="$checkPermission(['separateDeliveryReplenishWarehouse'])&& scope.row.ifWareHouseOut === 1"
                      command="8"
                    >
                      补单出库
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="$checkPermission(['separateDeliveryPFCustoms']) && scope.row.ifOutDeclare !== 1"
                      command="1"
                    >
                      起运港报关
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="$checkPermission(['separateDeliveryPTCustoms']) && scope.row.ifEnterDeclare !== 1"
                      command="2"
                    >
                      目的港报关
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="$checkPermission(['separateDeliveryPFTrailer']) && (scope.row.type === '1' || scope.row.type === '2') && scope.row.ifOutTrailer !== 1"
                      command="3"
                    >
                      起运港拖车
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="$checkPermission(['separateDeliveryPTTrailer']) && (scope.row.type === '1' || scope.row.type === '2') && scope.row.ifEnterTrailer !== 1"
                      command="4"
                    >
                      目的港拖车
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="$checkPermission(['separateDeliveryPortFromCar']) && scope.row.type === '0' && scope.row.ifOutCar !== 1"
                      command="5"
                    >
                      起运港卡车
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="$checkPermission(['separateDeliveryPortToCar']) && scope.row.type === '0' && scope.row.ifEnterCar !== 1"
                      command="6"
                    >
                      目的港卡车
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="$checkPermission(['separateDeliveryStripping']) && (scope.row.type === '1' || scope.row.type === '2') && scope.row.openTank !== 1"
                      command="7"
                    >
                      拆柜打托
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
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

      <step-data
        v-if="showPageName === 'form'"
        ref="stepData"
        :single-id="singleId"
        :is-str="isEditViewAdd"
        @back="handleBack"
      />
      <drawer
        :is-show="moreShow"
        :mask-closable="false"
        drawer-title="更多筛选"
        drawer-style="width: 400px;"
        cancel-text="重置"
        confirm-text="查询"
        @drawerClose="handleMoreCancle"
        @drawerConfirm="handleMoreConfirm"
      >
        <searchMore
          ref="searchMore"
        />
      </drawer>
      <cabinet-confirm
        v-if="showPageName === 'confirm'"
        ref="cabinetConfirm"
        @back="handleBack"
      />
    </div>

    <el-dialog
      title="指定供应商"
      width="600px"
      :close-on-click-modal="false"
      :visible.sync="isSupperierVisible"
      @close="cancelSupperier"
    >
      <div v-loading="formLoading">
        <el-form
          ref="supperierForm"
          :model="supperierForm"
          :rules="rules"
          label-width="100px"
          size="small"
          style="padding-right: 20px;"
        >
          <el-form-item
            label="供应商"
            prop="supplyId"
          >
            <el-select
              v-model="supperierForm.supplyId"
              :loading="selectLoading"
              placeholder="请选择"
              style="width:100%;"
              size="small"
              filterable
              clearable
              @focus="getCustList"
              @change=";(supperierForm.warehouseId = undefined)"
            >
              <el-option
                v-for="item in supplierList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="commandVal && commandVal !== '1' && commandVal !== '2'"
            label="仓库"
            prop="warehouseId"
          >
            <el-select
              v-model="supperierForm.warehouseId"
              :disabled="!supperierForm.supplyId"
              :loading="selectLoading"
              size="small"
              clearable
              filterable
              placeholder="仓库"
              style="width:100%;"
              @focus="getWarehouseList"
            >
              <el-option
                v-for="item in warehouseList"
                :key="item.warehouseId"
                :label="item.name"
                :value="item.warehouseId"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="commandVal === '7'"
            label="入库时间"
            prop="warehouseTime"
          >
            <el-date-picker
              v-model="supperierForm.warehouseTime"
              :picker-options="pickerOptions"
              type="date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              size="small"
              style="width:100%;"
            />
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          style="text-align: right;padding-top: 20px;"
        >
          <el-button
            size="small"
            @click="cancelSupperier"
          >
            取 消
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="confirmSupperier"
          >
            确 定
          </el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="400px"
      class="tip-dialog"
      :close-on-click-modal="false"
      @close="cancelCode"
    >
      <span>请将原单号放在excel表第一列导入</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="small"
          @click="cancelCode"
        >
          取消
        </el-button>
        <el-upload
          action
          :multiple="false"
          :limit="1"
          :show-file-list="false"
          accept=".xlsx,.xls"
          :http-request="uploadFile"
          :file-list="fileList"
          style="display: inline-block;margin-left: 10px;"
        >
          <el-button
            :loading="fileLoading"
            size="small"
            type="primary"
          >
            导入
          </el-button>
        </el-upload>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogOut"
      width="400px"
      class="tip-dialog"
      :close-on-click-modal="false"
      @close=";(dialogOut = false, wareName = '')"
    >
      <h3 style="margin: 0 0 5px;">
        装货仓库：{{ wareName }}
      </h3>
      <div>请问是否确认安排出库，此操作会给仓库下出库申请单?</div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="small"
          @click=";(dialogOut = false, wareName = '')"
        >
          取消
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="saveOut"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="调拨/出库申请单"
      width="1200px"
      :close-on-click-modal="false"
      :visible.sync="dialogReplenish"
      @close="cancelReplenish"
    >
      <div v-loading="formLoading">
        <el-table
          ref="tables"
          :data="replenishData"
          border
          row-key="id"
          height="400px"
          style="width: 100%;"
          @select="handleSelected"
          @select-all="handleSelectAll"
        >
          <el-table-column
            fixed="left"
            type="selection"
            width="55"
            :selectable="handleSelectable"
          />
          <el-table-column
            label="原单号"
            width="150"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div class="text-info">
                <span
                  v-copy="scope.row.code"
                  class="copy-icon"
                />
                <span>
                  {{ scope.row.code }}
                </span>
              </div>
              <div>
                <span
                  v-if="scope.row.beShip"
                  class="btn-tip-red"
                >
                  特批发货
                </span>
                <span
                  v-if="scope.row.ifFrozen"
                  class="btn-tip-red"
                >
                  冻结
                </span>
                <span
                  v-if="scope.row.ifLocked"
                  class="btn-tip-blue"
                >
                  锁舱
                </span>
                <span
                  v-if="scope.row.payMethod !== '1' && formatPay(scope.row)"
                  class="btn-tip-red"
                >
                  {{ scope.row.ifPayment ? '逾期已付款' : '逾期未付款' }}
                </span>
                <span
                  v-if="scope.row.payMethod === '1'"
                  class="btn-tip-red"
                >
                  {{ scope.row.ifPayment ? '已付款' : '未付款' }}
                </span>
                <span
                  v-if="scope.row.insufficient"
                  class="btn-tip-red"
                >
                  信用不足
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="目的城市"
            width="120"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ (scope.row.consignee || {}).city || '--' }}
            </template>
          </el-table-column>
          <el-table-column
            label="服务"
            width="150"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ (scope.row.lsc || {}).value || '--' }}
            </template>
          </el-table-column>
          <el-table-column
            label="下单仓库"
            width="150"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ (scope.row.warehouse || {}).name || '--' }}
            </template>
          </el-table-column>
          <el-table-column
            label="货物所在仓"
            width="150"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ (scope.row.warehouse1 || {}).name || '--' }}
            </template>
          </el-table-column>
          <el-table-column
            label="总体积"
            min-width="100"
          >
            <template slot-scope="scope">
              {{ maxVolWeiFormat(scope.row, 'vol', 'CBM') }}
            </template>
          </el-table-column>
          <el-table-column
            label="总重量"
            min-width="100"
          >
            <template slot-scope="scope">
              {{ maxVolWeiFormat(scope.row, 'wei', 'KGS') }}
            </template>
          </el-table-column>
          <el-table-column
            label="最大重量"
            min-width="100"
          >
            <template slot-scope="scope">
              {{ maxVolWeiFormat(scope.row, 'maxWei', 'KGS') }}
            </template>
          </el-table-column>
          <el-table-column
            label="最大体积"
            min-width="100"
          >
            <template slot-scope="scope">
              {{ maxVolWeiFormat(scope.row, 'maxVol', 'CBM') }}
            </template>
          </el-table-column>
          <el-table-column
            label="件数"
            width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.packages }}
            </template>
          </el-table-column>
          <el-table-column
            label="计量状态"
            width="100"
          >
            <template slot-scope="scope">
              {{ (statusList.find(e => e.id === scope.row.status['MEASURE']) || {name: '--'}).name }}
            </template>
          </el-table-column>
          <el-table-column
            label="验货状态"
            width="100"
          >
            <template slot-scope="scope">
              {{ (statusList.find(e => e.id === scope.row.status['EXAMINE']) || {name: '--'}).name }}
            </template>
          </el-table-column>
          <el-table-column
            label="报关状态"
            width="100"
          >
            <template slot-scope="scope">
              {{ (statusList.find(e => e.id === scope.row.status['CUSTOM_DECLARATION']) || {name: '--'}).name }}
            </template>
          </el-table-column>
          <el-table-column
            label="快递单号"
            width="100"
          >
            <template slot-scope="scope">
              <el-popover
                v-if="scope.row.express && scope.row.express.trackingNos"
                title="快递单号"
              >
                <div>
                  <p
                    v-for="e in scope.row.express.trackingNos.split(',')"
                    :key="e"
                  >
                    {{ e }}
                  </p>
                </div>
                <el-button
                  slot="reference"
                  type="text"
                  size="small"
                  style="padding: 0;"
                >
                  已出
                </el-button>
              </el-popover>
              <div v-else>
                未出
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div
          slot="footer"
          style="text-align: right;padding: 10px 0;"
        >
          <el-button
            size="small"
            @click="cancelReplenish"
          >
            取消
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click="saveReplenish"
          >
            确定
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getShipDetail,
  getServiceSubtypeList,
  exportOrderInfo,
  exportPortFile,
  exportInsuranceList,
  exportTrackingNumber,
  exportLoadPlan,
  exportArkExpress,
  exportPortStartCode,
  exportPortEndCode,
  getOutDeclare,
  getInDeclare,
  getInTrailer,
  getOutTrailer,
  getInCar,
  getOutCar,
  savePalletLine,
  getCustList,
  getWarehouseList,
  getServiceCountry,
  getPortList,
  getSeviceOrganList,
  getOutOrder,
  getReplenishById,
  saveReplenishOrder,
  getStatusList
} from '@/api/operation-of-single-shipment'
import stepData from '@/views/operation-management/single-shipment/stepData.vue'
import drawer from '@/components/Drawer/drawer.vue'
import searchMore from '@/views/operation-management/single-shipment/searchMore.vue'
import CabinetConfirm from '@/views/operation-management/single-shipment/cabinetConfirm.vue'
import dayjs from 'dayjs'
import XLSX from 'xlsx'

@Component({
  name: '',
  components: {
    stepData,
    searchMore,
    drawer,
    CabinetConfirm
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private noticeLoading: boolean = false
  private selectLoading: boolean = false
  private formLoading: boolean = false
  private fileLoading: boolean = false
  private showPageName: string = 'index'
  private moreShow: boolean = false
  private dialogVisible: boolean = false
  private dialogOut: boolean = false
  private dialogReplenish: boolean = false
  private isSupperierVisible: boolean = false
  private isEditViewAdd: string = ''
  private wareName: any = ''
  private noticeData: any[] = []
  private replenishData: any[] = []
  private selectedData: any[] = []
  private statusList: any[] = []
  private typeList: any[] = []
  private fileList: any[] = []
  private supplierList: any[] = []
  private warehouseList: any[] = []
  private startPortList: any = []
  private endPortList: any = []
  private countryList: any[] = []
  private searchForm: any = {
    type: '1',
    orderTime: [],
    codeType: '1',
    code: undefined,
    ifEnterDeclare: undefined,
    ifOutDeclare: undefined,
    ifOutTrailer: undefined,
    ifEnterTrailer: undefined,
    ifEnterCar: undefined,
    ifOutCar: undefined,
    orgId: undefined,
    originCountryId: undefined,
    originPortId: undefined,
    targetCountryId: undefined,
    targetPortId: undefined,
    remark: undefined
  }
  private moreObj: any = {}
  private singleId: any = ''
  private originCountryId: any = ''
  private targetCountryId: any = ''
  private orderType: any = ''
  private serviceType: any = ''
  private warehouseType: any = ''
  private warehouseSubtype: any = ''
  private commandVal: any = ''
  private page: number = 1
  private size: number = 10
  private total: any = 0
  private organList: any[] = []
  private supperierForm: any = {
    supplyId: undefined,
    warehouseId: undefined,
    warehouseTime: undefined
  }
  private rules: any = {
    supplyId: { required: true, message: '请选择供应商', trigger: 'change' },
    warehouseId: { required: true, message: '请选择仓库', trigger: 'change' },
    warehouseTime: { required: true, message: '入库时间不能为空', trigger: 'change' }
  }
  /* computed */
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }
  get pickerOptions() {
    return {
      disabledDate(time: any) {
        return time.getTime() < Date.now()
      }
    }
  }

  /* methods */
  private cabinetConfirmClick(row: any) {
    this.showPageName = 'confirm'
    this.$nextTick(() => {
      const cabinetConfirmRef: any = this.$refs.cabinetConfirm
      cabinetConfirmRef.init(row)
    })
  }
  private formatPay(row: any) {
    const pay = row.payTime ? dayjs(row.payTime).unix() : ''
    const now = dayjs().unix()
    const time = pay || now
    const cut = row.cutoffTime ? dayjs(row.cutoffTime).unix() : ''
    return !!cut && (cut && cut < time)
  }

  private formatCutoffDay(row: any) {
    const pay = row.payTime ? dayjs(row.payTime).unix() : ''
    const now = dayjs().unix()
    const time = pay || now
    const cut = row.cutoffTime ? dayjs(row.cutoffTime).unix() : ''
    const old = time ? dayjs(time).unix() : undefined
    if (cut && cut < time) {
      return Math.ceil((time - cut) / 86400) + '天'
    } else {
      return '--'
    }
  }
  private dispatchFormat(row: any) {
    const obj: any = { '0': '快递', '1': '卡派', '2': '自提', '3': '整柜直送' }
    const arrD = (`${row.deliveryWay}` || '').split(',')
    const arrN: any[] = []
    arrD.map((it: any) => {
      arrN.push(obj[it])
    })
    return arrN.join(',')
  }
  private formatType(row: any) {
    if (row.type === '0') {
      return '空运'
    } else if (row.type === '1') {
      return '海运'
    } else if (row.type === '2') {
      return '铁路'
    } else if (row.type === '4') {
      return '卡航'
    }
  }
  private formatTrans(row: any) {
    const type = row.type
    const cType = row.transType
    let name: any = ''
    if (type === '0') {
      name = cType === '0' ? '包板' : cType === '1' ? '散货' : ''
    } else if (type === '1' || type === '2') {
      name = cType === '0' ? '拼箱' : cType === '1' ? '整柜' : ''
    } else if (type === '4') {
      name = cType === '0' ? '整车' : cType === '1' ? '散货' : ''
    }
    return name
  }
  // 体积重量动态计算
  private maxVolWeiFormat(row: any, str: string, unit: string) {
    const umVolume = (this as any).$getVolumeUnitByLengthUnit((row.um || {}).umLength)
    const umWeight = (row.um || {}).umWeight
    const maxVolume = (row.measure || {}).maxVolume
    const totalVolume = (row.measure || {}).totalVolume
    const maxWeight = (row.measure || {}).maxWeight
    const totalWeight = (row.measure || {}).totalWeight
    let numVW: number = 0
    if (str === 'vol' && umVolume && totalVolume) {
      numVW = (this as any).$volumeConversion(totalVolume, umVolume, 'CBM', 3)
    } else if (str === 'maxVol' && umVolume && maxVolume) {
      numVW = (this as any).$volumeConversion(maxVolume, umVolume, 'CBM', 3)
    } else if (str === 'wei' && umWeight && totalWeight) {
      numVW = (this as any).$volumeConversion(totalWeight, umWeight, 'KGS', 3)
    } else if (str === 'maxWei' && umWeight && maxWeight) {
      numVW = (this as any).$volumeConversion(maxWeight, umWeight, 'KGS', 3)
    }
    return (numVW || '--') + ' ' + unit
  }

  // 获取国家列表
  private getCountryList() {
    this.selectLoading = true
    getServiceCountry()
      .then((res: any) => {
        const data = res.data || {}
        this.countryList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private onOriginCountry() {
    this.searchForm.originPortId = undefined
    this.searchForm.orgId = undefined
    this.startPortList = []
    this.organList = []
  }
  private onTargetCountry() {
    this.searchForm.targetPortId = undefined
    this.searchForm.orgId = undefined
    this.endPortList = []
    this.organList = []
  }
  private getStartPortData() {
    this.selectLoading = true
    const params:any = {
      page: 1,
      size: 99999,
      countryId: this.searchForm.originCountryId,
      type: this.searchForm.type
    }
    getPortList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.startPortList = data.result || []
        this.selectLoading = false
      }).catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private getEndPortData() {
    this.selectLoading = true
    const params:any = {
      page: 1,
      size: 99999,
      countryId: this.searchForm.targetCountryId,
      type: this.searchForm.type
    }
    getPortList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.endPortList = data.result || []
        this.selectLoading = false
      }).catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private getSeviceOrganList() {
    this.selectLoading = true
    const { type } = this.searchForm
    // 运输工具：0-空， 1-海，2-铁
    // 机构：0-海关,1-船东,2-空运公司,3-铁路公司，4-快递公司,5-卡派公司
    const params = {
      type: type === '0' ? '2' : type === '1' ? '1' : type === '2' ? '3' : '',
      countryId: this.searchForm.originCountryId,
      serviceCountry: this.searchForm.targetCountryId,
      page: 1,
      size: 9999
    }
    getSeviceOrganList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.organList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private handleBack() {
    this.showPageName = 'index'
    this.isEditViewAdd = ''
    this.singleId = ''
    this.getShipTable()
  }
  private viewRow(row: any) {
    this.showPageName = 'form'
    this.isEditViewAdd = 'v'
    const { id } = row
    this.singleId = id
    this.$nextTick(() => {
      const root: any = this.$refs.stepData
      root.setRow(row)
    })
  }
  private editRow(row: any) {
    this.showPageName = 'form'
    this.isEditViewAdd = 'e'
    const { id } = row
    this.singleId = id
    this.$nextTick(() => {
      const root: any = this.$refs.stepData
      root.setRow(row)
    })
  }
  private addRow() {
    this.showPageName = 'form'
  }
  private handleViewBoard() {
    const { href } = this.$router.resolve({
      path: `/data-monitor`
    })
    window.open(href, '_blank')
  }
  private saveOut() {
    this.dialogOut = false
    this.outRow(this.moreObj)
  }
  private outRow(row: any) {
    const params = {
      fillId: row.id,
      warehouse: {}
    }
    getOutOrder(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '提交成功'
        })
        this.getShipTable()
      })
      .catch((err: any) => {
        return err
      })
  }

  private getReplenish() {
    this.noticeLoading = true
    const params = {
      fillId: this.moreObj.id,
      type: this.moreObj.type,
      countryId: (this.moreObj.targetCountry || {}).key
    }
    getReplenishById(params)
      .then((res: any) => {
        const data = res.data || []
        // const arr = data.filter((it: any) => this.boolOrder(it))
        // console.log(arr)
        this.noticeLoading = false
        if (data.length <= 0) {
          this.$message.error('暂无需要补单的订单')
        } else {
          this.replenishData = data
          this.dialogReplenish = true
        }
      })
      .catch((err: any) => {
        this.noticeLoading = false
        return err
      })
  }
  // 补单出库条件
  private handleSelectable(row: any, index: any) {
    return this.boolOrder(row)
  }
  private boolOrder(row: any) {
    // 可发货条件
    const item = {
      ...row,
      fullorderInsufficient: row.fullorderInsufficient || {},
      express: row.express || {}
    }
    const {
      audit,
      status: { MEASURE, EXAMINE },
      deliveryWay,
      express: { trackingNos },
      fullorderInsufficient: { insufficientStatus },
      payMethod,
      ifPayment,
      insufficient,
      ifFrozen,
      beShip
    } = item
    const now = dayjs().unix()
    const cut = row.cutoffTime ? dayjs(row.cutoffTime).unix() : ''
    if (((row.ifLoading === 2 && row.ifConfirm === 2) || row.ifLoading !== 2) && audit === '1' && MEASURE === '7' && EXAMINE === '10' && ((deliveryWay === '0' && trackingNos) || deliveryWay !== '0') && !ifFrozen) {
      return beShip || (insufficient && insufficientStatus === 1) || (!insufficient && ifPayment) || (!insufficient && !ifPayment && payMethod !== '1')
    } else {
      return false
    }
  }
  private handleSelected(selection: any, row: any) {
    const addDelete = selection.find((it: any) => it.id === row.id)
    if (addDelete) {
      this.selectedData.push(row)
    } else {
      this.selectedData = this.selectedData.filter((it: any) => it.id !== row.id)
    }
  }
  private handleSelectAll(selection: any) {
    if (selection.length) {
      // 全选中
      this.selectedData = [...this.selectedData, ...selection].reduce((list: any[], next: any) => {
        if (!list.find((e: any) => e.id === next.id)) {
          list.push(next)
        }
        return list
      }, [])
    } else {
      // 取消这页的全选
      this.selectedData = this.selectedData.filter((e: any) => !this.replenishData.find((t: any) => t.id === e.id))
    }
  }
  private cancelReplenish() {
    this.dialogReplenish = false
    this.replenishData = []
    this.selectedData = []
  }
  private saveReplenish() {
    const params: any = {
      fillId: this.moreObj.id,
      codeList: this.selectedData,
      warehouse: {}
    }
    saveReplenishOrder(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '提交成功'
        })
        this.formLoading = false
        this.cancelReplenish()
        this.getShipTable()
      }).catch((err: any) => {
        this.formLoading = false
        return err
      })
  }

  // 更多
  private handleCustoms(row: any) {
    this.moreObj = row
    this.singleId = row.id
    this.originCountryId = (row.originCountry || {}).key
    this.targetCountryId = (row.targetCountry || {}).key
  }

  private handleCommandCustoms(command: any) {
    this.isSupperierVisible = true
    this.serviceType = ''
    this.warehouseSubtype = ''
    this.commandVal = command
    switch (command) {
      case '0':
        this.isSupperierVisible = false
        if ((this.moreObj.warehouses || []).length <= 0) {
          this.$message.error('暂无装货仓库数据，无法安排出库')
          return
        }
        this.wareName = this.moreObj.warehouses.map((it: any) => it.name).join(',')
        this.dialogOut = true
        break
      case '1':
        this.orderType = '03'
        this.warehouseType = '03'
        break
      case '2':
        this.orderType = '03'
        this.warehouseType = '03'
        break
      case '3':
        this.orderType = '06'
        this.serviceType = '1'
        this.warehouseType = ''
        this.warehouseSubtype = ''
        break
      case '4':
        this.orderType = '06'
        this.serviceType = '0'
        this.warehouseType = '04'
        this.warehouseSubtype = '3'
        break
      case '5':
        this.orderType = '01'
        this.warehouseType = ''
        break
      case '6':
        this.orderType = '01'
        this.warehouseType = '04'
        this.warehouseSubtype = '3'
        break
      case '7':
        this.orderType = '04'
        this.serviceType = '3'
        break
      case '8':
        this.isSupperierVisible = false
        this.getReplenish()
        break
      default:
        break
    }
  }

  // 导入原单号-导出
  private handleCommandInvoice(command: any) {
    this.dialogVisible = true
    this.commandVal = command
  }

  private uploadFile(data: any) {
    const fileSize = Math.round(data.file.size / 1024 / 1024 * 100) / 100
    if (fileSize > 10) {
      this.$message.warning('文件大小超出最大上传限制！')
      return
    }
    const file = data.file
    const that = this
    const reader = new FileReader()
    FileReader.prototype.readAsBinaryString = (f) => {
      let binary = ''
      let wb
      let outdata
      const reader1 = new FileReader()
      reader1.onload = (e) => {
        const readerResult: any = reader1.result
        const bytes = new Uint8Array(readerResult)
        const length = bytes.byteLength
        for (let i = 0; i < length; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        wb = XLSX.read(binary, {
          type: 'binary'
        })
        outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: '' })
        const importBoxs: any = []
        outdata.map((outData: any) => {
          importBoxs.push(...outData)
        })
        const arrCode = importBoxs.filter((it: any) => it)
        that.downloadInvoiceExcel(that.commandVal, arrCode)
      }
      reader1.onerror = () => {
        that.$message.error('文件错误,请检查文件重新导入')
      }
      reader1.readAsArrayBuffer(f)
    }
    reader.readAsBinaryString(file)
  }
  private downloadInvoiceExcel(val: any, arr: any[]) {
    this.dialogVisible = false
    if (arr.length <= 0) return
    this.noticeLoading = true
    let name:any = ''
    let func: any = null
    if (val === '2') {
      name = '目的港箱单发票'
      func = exportPortEndCode
    } else if (val === '3') {
      name = '起运港箱单发票'
      func = exportPortStartCode
    } else {
      return
    }
    func(arr).then((res:any) => {
      this.noticeLoading = false
      const a = document.createElement('a')
      document.body.appendChild(a)
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      const objUrl = URL.createObjectURL(blob)
      a.href = objUrl
      a.download = name + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.xls'
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(objUrl)
      this.cancelCode()
    }).catch((err:any) => {
      this.noticeLoading = false
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
  private cancelCode() {
    this.dialogVisible = false
    this.fileList = []
    this.commandVal = ''
  }

  // 导出
  private handleExport(row: any) {
    this.moreObj = row
  }
  private handleCommandExport(command: any) {
    this.downloadExcel(command, this.moreObj)
  }
  private downloadExcel(val: any, row: any) {
    this.noticeLoading = true
    let name:any = ''
    let func: any = null
    const params: any = {
      id: row.id
    }
    if (val === '1') {
      name = '订单明细'
      func = exportOrderInfo
    } else if (val === '2') {
      name = '目的港箱单发票(柜号)'
      params.type = '1'
      params.method = '0'
      func = exportPortFile
    } else if (val === '3') {
      name = '起运港箱单发票(柜号)'
      params.type = '0'
      params.method = '0'
      func = exportPortFile
    } else if (val === '4') {
      name = '目的港箱单发票(箱号)'
      params.type = '1'
      params.method = '1'
      func = exportPortFile
    } else if (val === '5') {
      name = '起运港箱单发票(箱号)'
      params.type = '0'
      params.method = '1'
      func = exportPortFile
    } else if (val === '6') {
      name = '保险单'
      func = exportInsuranceList
    } else if (val === '7') {
      // 快递单
      name = '快递单'
      func = exportTrackingNumber
    } else if (val === '8') {
      name = '拆柜清单标准版'
      func = exportLoadPlan
    } else if (val === '9') {
      name = '拆柜清单ROY版'
      func = exportArkExpress
    } else {
      return
    }
    func(params).then((res:any) => {
      this.noticeLoading = false
      const a = document.createElement('a')
      document.body.appendChild(a)
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      const objUrl = URL.createObjectURL(blob)
      a.href = objUrl
      a.download = name + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.xls'
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(objUrl)
    }).catch((err:any) => {
      this.noticeLoading = false
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
  private confirmSupperier(): void {
    const form: any = this.$refs.supperierForm
    form.validate((valid: any) => {
      if (!valid) return false
      this.formLoading = true
      const params: any = {
        fillId: this.singleId,
        ...this.supperierForm
      }
      this.supplierList.map((it: any) => {
        if (params.supplyId === it.id) {
          params.supplyName = it.name
        }
      })
      this.warehouseList.map((it: any) => {
        if (it.warehouseId === params.warehouseId) {
          params.warehouseName = it.name
          params.address = it.address
          params.cityId = it.cityId
          params.cityName = it.cityName
          params.contact = it.contact
          params.countryId = it.countryId
          params.countryName = it.countryName
          params.countyId = it.countyId
          params.countyName = it.countyName
          params.stateId = it.stateId
          params.stateName = it.stateName
          params.tel = it.phoneNo
        }
      })
      let func: any = null
      if (this.commandVal === '1') {
        func = getOutDeclare(params)
      } else if (this.commandVal === '2') {
        func = getInDeclare(params)
      } else if (this.commandVal === '3') {
        func = getOutTrailer(params)
      } else if (this.commandVal === '4') {
        func = getInTrailer(params)
      } else if (this.commandVal === '5') {
        func = getOutCar(params)
      } else if (this.commandVal === '6') {
        func = getInCar(params)
      } else if (this.commandVal === '7') {
        const formObj: any = {
          value: params.supplyName,
          key: params.supplyId,
          wareHouseId: params.warehouseId,
          id: this.singleId,
          warehouseTime: params.warehouseTime
        }
        func = savePalletLine(formObj)
      } else {
        return
      }
      func
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.formLoading = false
          this.cancelSupperier()
          this.getShipTable()
        }).catch((err: any) => {
          this.formLoading = false
          return err
        })
    })
  }
  private cancelSupperier() {
    this.isSupperierVisible = false
    this.resetSupperierForm()
    this.commandVal = ''
    this.orderType = ''
    this.serviceType = ''
    this.warehouseType = ''
    this.warehouseSubtype = ''
    this.originCountryId = ''
    this.targetCountryId = ''
    this.supplierList = []
    this.warehouseList = []
  }

  private resetSupperierForm() {
    this.supperierForm = {
      supplyId: undefined,
      warehouseId: undefined,
      warehouseTime: undefined
    }
    const root: any = this.$refs.supperierForm
    root.clearValidate()
  }
  private getCustList() {
    this.selectLoading = true
    const params = {
      cas: 'S',
      types: this.orderType,
      subtypes: this.serviceType,
      countries: this.commandVal === '1' ||
        this.commandVal === '3' ||
        this.commandVal === '5' ? [this.originCountryId] : [this.targetCountryId]
    }
    getCustList(params).then((res: any) => {
      const data = res.data || []
      const result = data
      this.supplierList = JSON.parse(
        JSON.stringify(result)
          .replace(/custName/g, 'name')
          .replace(/custId/g, 'id')
      )
      this.selectLoading = false
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }
  private getWarehouseList() {
    this.selectLoading = true
    getWarehouseList({
      typeId: this.warehouseType,
      subtypeId: this.warehouseSubtype,
      custId: this.commandVal === '7' ? this.supperierForm.supplyId : undefined,
      countryId: this.commandVal === '3' || this.commandVal === '5' ? this.originCountryId : this.targetCountryId
    })
      .then((res: any) => {
        const data = res.data || []
        this.warehouseList = data
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private onType() {
    this.searchForm.codeType = '1'
    this.searchForm.ifOutTrailer = undefined
    this.searchForm.ifEnterTrailer = undefined
    this.searchForm.ifEnterCar = undefined
    this.searchForm.ifOutCar = undefined
    this.searchForm.openTank = undefined
    this.searchForm.orgId = undefined
    this.organList = []
    this.getShipTable(1)
  }
  private async getSubtypeList() {
    this.selectLoading = true
    const params:any = {
      typeId: '05'
    }
    await getServiceSubtypeList(params)
      .then((res: any) => {
        const data = res.data || []
        this.typeList = data
        this.selectLoading = false
      }).catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private getStatusData() {
    getStatusList().then((res: any) => {
      this.statusList = (res.data || []).map((e: any) => {
        return {
          name: e.name,
          id: e.key,
          type: e.type
        }
      })
    }).catch(() => {
      this.statusList = []
    })
  }

  private handleMoreSearch(): void {
    // 更多查询
    this.moreShow = true
    const root: any = this.$refs.searchMore
    root.searchMore = { ...this.searchForm }
  }
  private handleMoreCancle(): void {
    // 取消
    this.moreShow = false
    const root: any = this.$refs.searchMore
    const {
      ifWareHouseOut,
      ifOutDeclare,
      ifEnterDeclare,
      ifOutTrailer,
      ifEnterTrailer,
      ifOutCar,
      ifEnterCar,
      openTank,
      ...form
    } = root.searchMore
    this.searchForm = { ...form }
    this.getShipTable(1)
  }
  private handleMoreConfirm(): void {
    // 确定
    this.moreShow = false
    const root: any = this.$refs.searchMore
    this.searchForm = root.searchMore
    this.getShipTable(1)
  }
  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.getShipTable()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.getShipTable()
  }

  private getShipTable(val?: any) {
    const { orderTime, codeType, code, ...form } = this.searchForm
    this.noticeLoading = true
    if (val) {
      this.page = val
    }
    const params: any = {
      model: {
        ...form,
        code: codeType === '1' ? code : undefined,
        remark: codeType === '2' ? code : undefined,
        so: codeType === '3' ? code : undefined,
        billNo: codeType === '4' ? code : undefined,
        containerNo: codeType === '5' ? code : undefined,
        mode: '1',
        startTime: '',
        endTime: ''
      },
      page: this.page,
      size: this.size
    }
    if (Array.isArray(orderTime) && orderTime.length > 0) {
      params.model.startTime = orderTime[0] + ' 00:00:00'
      params.model.endTime = orderTime[1] + ' 23:59:59'
    }
    getShipDetail(params)
      .then((res: any) => {
        this.noticeLoading = false
        const data = res.data || {}
        this.noticeData = data.result || []
        this.$nextTick(() => {
          const root: any = this.$refs.table
          root && root.doLayout() // 解决表格错位
        })
        this.total = data.total
      })
      .catch((err: any) => {
        this.noticeLoading = false
        return err
      })
  }
  private async created() {
    this.noticeLoading = true
    this.searchForm.orderTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    try {
      await this.getSubtypeList()
      this.getShipTable()
      this.getStatusData()
    } catch (error) {
      this.noticeLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.header-title {
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  h3 {
    color: #909399;
    font-weight: 400;
    font-size: 16px;
  }
}
.el-dropdown-link {
  margin-left: 10px;
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.tip-dialog {
  ::v-deep .el-dialog__body {
    padding: 10px 20px;
  }
}
.text-info {
  .copy-icon {
    color: #999;
    cursor: pointer;
    width: 12px;
    height: 12px;
    display: inline-block;
    margin-right: 5px;
    background: url("../../../assets/imgs/copy.png") center center no-repeat;
    background-size: 100%;
    &:hover {
      background: url("../../../assets/imgs/copy-hover.png") center center no-repeat;
      background-size: 100%;
    }
  }
}
.btn-tip-red {
  color: #E12E2E;
  background-color: rgba(245, 108, 108, 0.2);
  display: inline-block;
  height: 18px;
  line-height: 18px;
  font-size: 12px;
  padding: 0 2px;
  margin: 0 1px;
  border-radius: 2px;
}
.btn-tip-blue {
  color: #2291E6;
  background-color: rgb(34, 145, 230, 0.2);
  display: inline-block;
  height: 18px;
  line-height: 18px;
  font-size: 12px;
  padding: 0 2px;
  margin: 0 1px;
  border-radius: 2px;
}
</style>
