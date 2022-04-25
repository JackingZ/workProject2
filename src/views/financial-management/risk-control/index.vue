<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      v-show="!showAudit"
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        v-show="!detailShow && !measureShow && !expressShow"
        class="app-container"
      >
        <head-info
          info=""
          title="风险控制"
        >
          <template v-slot:option>
            <el-button
              type="text"
              size="small"
              @click="handleMoreSearch"
            >
              更多筛选
            </el-button>
            <el-button
              :loading="excelLoading"
              type="primary"
              size="small"
              @click="handleExport"
            >
              导出当前数据
            </el-button>
          </template>
        </head-info>
        <div class="app-panel">
          <div style="text-align:right;">
            <!--<el-select
              v-if="custType === '2' && custSubtype === '2'"
              v-model="searchForm.orderType"
              placeholder="订单类型"
              style="width:100px;margin-right:5px;"
              size="small"
              @change="onOrderType"
            >
              <el-option
                v-for="item in orderTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>-->
            <el-select
              v-if="custType === '2' && custSubtype === '1'"
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
              v-if="custType === '2' && custSubtype === '1' && searchForm.comType === '2'"
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

            <!-- <el-select
              v-model="searchForm.status"
              :loading="selectLoading"
              placeholder="订单状态"
              style="width: 100px;margin-right: 5px;"
              size="small"
              clearable
              filterable
            >
              <el-option
                v-for="item in lineStatusList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select> -->
            <el-select
              v-model="searchForm.keyIndex"
              :loading="selectLoading"
              placeholder="订单标签"
              style="width: 100px;margin-right: 5px;"
              size="small"
              clearable
              filterable
            >
              <el-option
                v-for="item in riskList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-select
              v-model="searchForm.audit"
              placeholder="审核状态"
              size="small"
              clearable
              style="width:100px;margin-right:5px;"
            >
              <el-option
                label="待审核"
                value="0"
              />
              <el-option
                label="审核中"
                value="3"
              />
              <el-option
                label="审核通过"
                value="1"
              />
              <el-option
                label="审核拒绝"
                value="2"
              />
            </el-select>
            <el-select
              v-model="searchForm.type"
              size="small"
              style="width: 100px;margin-right: 5px;"
              placeholder="业务类型"
              filterable
              clearable
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
              v-model="searchForm.countryId"
              :loading="selectLoading"
              clearable
              filterable
              placeholder="目的国家"
              style="width:100px;margin-right:5px;"
              size="small"
              @focus="getCountryList"
            >
              <el-option
                v-for="item in countryList"
                :key="item.id"
                :label="`${item.name}-${item.alias}`"
                :value="item.id"
              />
            </el-select>

            <el-select
              v-model="searchForm.fbastoreId"
              :loading="selectLoading"
              size="small"
              style="width: 100px;margin-right: 5px;"
              placeholder="FBA仓库"
              clearable
              filterable
              @focus="getWarehouseList"
            >
              <el-option
                v-for="item in warehouseList"
                :key="item.id"
                :label="item.code"
                :value="item.id"
              />
            </el-select>

            <el-select
              v-model="searchForm.lscId"
              size="small"
              style="width: 100px;margin-right: 5px;"
              placeholder="服务"
              clearable
              filterable
              @focus="getPrivatelineList"
            >
              <el-option
                v-for="item in privatelineList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-date-picker
              v-model="searchForm.orderTime"
              unlink-panels
              :clearable="false"
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
              v-model="keyWord"
              placeholder="请输入内容"
              class="input-with-select"
              style="width:240px;margin-right: 10px;"
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
                  label="原单号"
                  value="1"
                />
                <el-option
                  label="客户名称"
                  value="2"
                />
                <!-- <el-option
                  label="备注"
                  value="3"
                /> -->
              </el-select>
            </el-input>
            <el-button
              type="primary"
              size="small"
              @click="getTableData(1)"
            >
              查询
            </el-button>
          </div>

          <el-table
            v-loading="loading"
            :data="tableData"
            :row-class-name="rowClassName"
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              fixed="left"
              label="订单信息"
              min-width="230"
            >
              <div
                slot-scope="scope"
                class="order-info"
              >
                <div
                  class="seriver-info"
                  :title="scope.row.lsc.value"
                >
                  <div
                    v-if="scope.row.type === '0'"
                    class="type"
                  >
                    空运
                  </div>
                  <div
                    v-if="scope.row.type === '1'"
                    class="type"
                  >
                    海运
                  </div>
                  <div
                    v-if="scope.row.type === '2'"
                    class="type"
                  >
                    铁路
                  </div>
                  <div
                    v-if="scope.row.type === '3'"
                    class="type"
                  >
                    快递
                  </div>
                  <div
                    v-if="scope.row.type === '4'"
                    class="type"
                  >
                    卡航
                  </div>
                  <div
                    class="lscName"
                  >
                    {{ scope.row.lsc.value }}
                  </div>
                </div>
                <div
                  class="code"
                  :title="scope.row.code"
                >
                  <span
                    v-copy="scope.row.code"
                    class="copy-icon"
                  />
                  <span>
                    原单号：{{ scope.row.code }}
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
                  <span
                    v-if="!scope.row.enabled"
                    class="btn-tip-gray"
                  >
                    订单已取消
                  </span>
                </div>
              </div>
            </el-table-column>
            <el-table-column
              label="客户名称"
              fixed="left"
              width="120"
            >
              <template slot-scope="scope">
                <span>{{ (scope.row.orderCustomer || {}).name || scope.row.updateBy }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="下单客户"
              width="120"
            >
              <template slot-scope="scope">
                <span v-if="custType !== '0'">{{ (scope.row.buyer || {}).name }}</span>
                <span v-else>{{ (scope.row.seller || {}).name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="下单时间"
              width="160"
            >
              <template slot-scope="scope">
                {{ scope.row.createTime }}
              </template>
            </el-table-column>
            <el-table-column
              label="冻结原因"
              width="160"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.freeze || {}).remark }}
              </template>
            </el-table-column>
            <el-table-column
              prop="warehouse.name"
              label="提货仓库"
              width="160"
            />
            <el-table-column
              label="报关方式"
              width="100"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.customs0 === '0'">普通报关</span>
                <span v-else-if="scope.row.customs0 === '1'">出口退税</span>
                <!--<span v-else-if="scope.row.customs1 === '0'">自有进口商报关</span>-->
                <!--<span v-else-if="scope.row.customs1 === '1'">无进口商</span>-->
              </template>
            </el-table-column>
            <el-table-column
              label="提货方式"
              width="100"
            >
              <template slot-scope="scope">
                {{ (pickList[(scope.row.supplement || {}).pickType] || {}).name }}
              </template>
            </el-table-column>
            <el-table-column
              label="派送方式"
              width="100"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.deliveryWay === '0'">快递</span>
                <span v-if="scope.row.deliveryWay === '1'">卡派</span>
                <span v-if="scope.row.deliveryWay === '2'">自提</span>
                <span v-if="scope.row.deliveryWay === '3'">整柜直送</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="packages"
              label="件数"
              width="120"
            />
            <el-table-column
              prop="value"
              label="金额"
              min-width="120"
            >
              <template slot-scope="scope">
                {{ (scope.row.value ? (scope.row.value).toFixed(2) : '') + ' ' + (scope.row.currency || {}).key }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="是否发货"
              width="100"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.ifLoading === 0">未发货</span>
                <span v-if="scope.row.ifLoading === 1">已发货</span>
                <span v-if="scope.row.ifLoading === 2">部分发货</span>
              </template>
            </el-table-column>
            <el-table-column
              label="审核状态"
              width="100"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ formmatAudit(scope.row) }}
                <div v-if="scope.row.audit === '2'">
                  {{ scope.row.reason }}
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column
              label="订单状态"
              width="100"
            >
              <template slot-scope="scope">
                {{ (statusList.find(e => e.id === scope.row.status['LINE']) || {name: '--'}).name }}
              </template>
            </el-table-column> -->
            <el-table-column
              label="入库状态"
              width="100"
            >
              <template slot-scope="scope">
                {{ (statusList.find(e => e.id === scope.row.status['WS_IN']) || {name: '--'}).name }}
              </template>
            </el-table-column>
            <el-table-column
              label="出库状态"
              width="100"
            >
              <template slot-scope="scope">
                {{ (statusList.find(e => e.id === scope.row.status['WS_OUT']) || {name: '--'}).name }}
              </template>
            </el-table-column>
            <el-table-column
              label="计量状态"
              width="100"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.status['MEASURE'] === '7' && custType === '0'"
                  type="text"
                  @click="measureAudit(scope.row)"
                >
                  {{ (statusList.find(e => e.id === scope.row.status['MEASURE']) || {name: '--'}).name }}
                </el-button>
                <span v-else>
                  {{ (statusList.find(e => e.id === scope.row.status['MEASURE']) || {name: '--'}).name }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="custType === '2'"
              label="计量审核"
              width="100"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.status['MEASURE'] === '7'"
                  type="text"
                  @click="measureAudit(scope.row)"
                >
                  计量审核
                </el-button>
                <span v-else>--</span>
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
                <el-popover
                  v-if="scope.row.status['CUSTOM_DECLARATION'] === '418' || scope.row.status['CUSTOM_DECLARATION'] === '417' || scope.row.status['CUSTOM_DECLARATION'] === '419'"
                  placement="bottom"
                  title="报关文件"
                  trigger="click"
                  width="600"
                  @show="customFileListShow(scope.row)"
                  @hide="customFileListHide"
                >
                  <el-table
                    v-loading="loadFileList"
                    :data="customFileList"
                    height="400px"
                  >
                    <el-table-column
                      label="文件名称"
                      prop="fileName"
                    />
                    <!--<el-table-column
                      label="文件类型"
                      prop="fileType"
                    />-->
                    <el-table-column
                      label="文件状态"
                    >
                      <template slot-scope="custom">
                        <span
                          v-if="custom.row.fileStatus === 1 && custom.row.status === '0'"
                        >
                          待审核
                        </span>
                        <span
                          v-if="custom.row.fileStatus === 1 && custom.row.status === '1'"
                        >
                          审核通过
                        </span>
                        <span
                          v-if="custom.row.fileStatus === 1 && custom.row.status === '2'"
                        >
                          审核拒绝
                        </span>
                        <span
                          v-if="custom.row.fileStatus === 0 && custom.row.status === '0'"
                        >
                          未上传
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="审核人"
                      prop="auditName"
                    />
                    <el-table-column
                      label="审核时间"
                      prop="auditTime"
                    />
                    <el-table-column
                      label="操作"
                    >
                      <template slot-scope="custom">
                        <el-button
                          v-if="custom.row.fileStatus === 1 && custom.row.status === '1'"
                          type="text"
                          size="mini"
                          @click="downFile(custom.row)"
                        >
                          下载
                        </el-button>
                        <el-upload
                          v-else
                          action
                          :multiple="false"
                          :limit="1"
                          :show-file-list="false"
                          :http-request="(data) => uploadFile(data, custom.row)"
                          :file-list="fileList"
                          style="display: inline-block;margin: 0 10px;"
                        >
                          <el-button
                            size="small"
                            type="text"
                          >
                            <span v-if="custom.row.fileStatus === 0 && custom.row.status !== '1'">上传</span>
                            <span v-if="custom.row.fileStatus === 1 && custom.row.status !== '1'">重新上传</span>
                          </el-button>
                        </el-upload>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button
                    slot="reference"
                    :disabled="scope.row.ifFrozen"
                    type="text"
                    size="mini"
                  >
                    {{ (statusList.find(e => e.id === scope.row.status['CUSTOM_DECLARATION']) || {name: '--'}).name }}
                  </el-button>
                </el-popover>
                <span
                  v-else
                >
                  {{ (statusList.find(e => e.id === scope.row.status['CUSTOM_DECLARATION']) || {name: '--'}).name }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="快递单号"
              width="100"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.deliveryWay === '0'">
                  <el-popover
                    v-if="scope.row.express && scope.row.express.trackingNos"
                    title="快递单号"
                    trigger="hover"
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
                      @click="showExpress(scope.row)"
                    >
                      已出
                    </el-button>
                  </el-popover>
                  <span v-else>未出</span>
                </div>
                <div v-else>
                  --
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="预估运费"
              min-width="120"
            >
              <template slot-scope="scope">
                {{ (scope.row.price || {}).totalPrice }} {{ (scope.row.price || {}).currencyId }}
              </template>
            </el-table-column>
            <el-table-column
              label="账单"
              width="100"
            >
              <template slot-scope="scope">
                {{ scope.row.cutoffTime ? '已出' : '未出' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="cutoffTime"
              label="截止付款时间"
              width="160"
            />
            <el-table-column
              :formatter="formatCutoffDay"
              prop=""
              label="逾期天数"
              width="100"
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="200"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="viewData(scope.row)"
                >
                  查看
                </el-button>
                <el-button
                  type="text"
                  @click="downGoodFile(scope.row)"
                >
                  商品导出
                </el-button>
                <el-dropdown
                  trigger="click"
                  @command="handleCommand"
                >
                  <span
                    class="el-dropdown-link"
                    @click="handleMore(scope.row)"
                  >
                    更多
                    <i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-if="scope.row.audit === '1' && scope.row.enabled && scope.row.ifFrozen && !(scope.row.freeze || {}).applyTag"
                      command="7"
                    >
                      申请解冻
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="scope.row.audit === '1' && scope.row.enabled && scope.row.ifFrozen && (scope.row.freeze || {}).applyTag"
                      command="8"
                    >
                      解冻审核
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="scope.row.fullorderInsufficient && scope.row.enabled"
                      command="11"
                    >
                      出库审核
                    </el-dropdown-item>
                    <el-dropdown-item
                      command="12"
                      class="special-item"
                    >
                      特批发货
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
            :status-list="statusList"
            :is-type="'risk'"
          />
        </drawer>
      </div>
      <div
        v-show="detailShow"
        class="app-container"
      >
        <detail
          ref="detailForm"
          :line-list="privatelineList"
          :pick-list="pickList"
          :type-list="typeList"
          :ware-list="warehouseList"
          @back="getBack"
        />
      </div>
      <div
        v-show="measureShow"
        class="app-container"
      >
        <examineMeasureTab
          ref="measureForm"
          @back="measureShow = false"
        />
      </div>
      <div
        v-show="expressShow"
        class="app-container"
      >
        <express
          ref="expressList"
          @back="expressShow = false"
        />
      </div>
    </div>
    <commodity-audit
      v-show="showAudit"
      ref="commodityAudit"
      @goBack="goBack"
    />

    <el-dialog
      title="出库审核"
      width="600px"
      :close-on-click-modal="false"
      :visible.sync="dialogOut"
      @close="cancelOut"
    >
      <div v-loading="dialogLoading">
        <el-form
          ref="outForm"
          :model="outForm"
          :rules="outRules"
          label-width="90px"
          label-position="right"
          size="small"
        >
          <el-form-item
            label="审核结果"
            prop="audit"
          >
            <el-radio-group v-model="outForm.audit">
              <el-radio
                :label="1"
              >
                通过
              </el-radio>
              <el-radio
                :label="2"
              >
                拒绝
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="备注"
            prop="remark"
          >
            {{ outForm.remark }}
          </el-form-item>
          <el-form-item
            v-if="outForm.audit === 2"
            label="拒绝原因"
            prop="reason"
          >
            <el-input
              v-model="outForm.reason"
              :autosize="{minRows: 2, maxRows: 4}"
              type="textarea"
              :maxlength="100"
              placeholder="请输入"
            />
          </el-form-item>
        </el-form>
        <div
          style="text-align: right;padding-top: 10px;"
        >
          <el-button
            size="small"
            @click="cancelOut"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="saveOut"
          >
            确定
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="操作日志"
      width="600px"
      :close-on-click-modal="false"
      :visible.sync="isLogVisible"
      @close="cancel"
    >
      <div>弹框</div>
    </el-dialog>
    <el-dialog
      title="特批发货"
      width="600px"
      :close-on-click-modal="false"
      :visible.sync="specialDialog"
      @close="specialDialog = false, specialRemark = ''"
    >
      <div
        v-if="specialRemark"
        style="color: #E12E2E;padding-bottom: 10px;"
      >
        冻结原因：{{ specialRemark }}
      </div>
      <div>
        此操作可能会产生风险，确认发货吗？
      </div>
      <div
        style="text-align: right;padding-top: 10px;"
      >
        <el-button
          size="small"
          @click="specialDialog = false, specialRemark = ''"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="specialOrder"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="审核订单"
      :visible.sync="dialogAudit"
      :close-on-click-modal="false"
      width="600px"
      @closed="handleCancel"
    >
      <div
        v-loading="dialogLoading"
      >
        <el-form
          ref="auditForm"
          :model="auditForm"
          :rules="formRules"
          label-width="90px"
          label-position="right"
          size="small"
        >
          <el-form-item
            label="审核结果"
            prop="audit"
          >
            <el-radio-group v-model="auditForm.audit">
              <el-radio
                label="1"
              >
                通过
              </el-radio>
              <el-radio
                label="2"
              >
                拒绝
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="auditForm.audit === '2'"
            label="拒绝原因"
            prop="reason"
          >
            <el-input
              v-model="auditForm.reason"
              :autosize="{minRows: 2, maxRows: 4}"
              type="textarea"
              :maxlength="100"
              placeholder="请输入"
            />
          </el-form-item>
        </el-form>
        <div
          style="text-align: right;padding-top: 10px;"
        >
          <el-button
            type="primary"
            size="small"
            @click="handleSubmit"
          >
            提交
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :title="isFrost? '冻结订单' : '解冻审核'"
      width="600px"
      :close-on-click-modal="false"
      :visible.sync="isFrostVisible"
      @close="cancelFrost"
    >
      <div v-loading="dialogLoading">
        <el-form
          ref="frostForm"
          :model="frostForm"
          :rules="frostRules"
          label-width="100px"
          label-position="right"
          size="small"
        >
          <el-form-item
            label="冻结原因"
            prop="remark"
          >
            <el-input
              v-if="isFrost"
              v-model="frostForm.remark"
              :autosize="{minRows: 2, maxRows: 4}"
              type="textarea"
              :maxlength="100"
              placeholder="请输入"
            />
            <span v-else>{{ frostForm.remark }}</span>
          </el-form-item>
          <el-form-item
            v-if="!isFrost"
            label="申请人公司"
          >
            {{ frostForm.applyName }}
          </el-form-item>
          <el-form-item
            v-if="!isFrost"
            label="申请人账号"
          >
            {{ frostForm.applyAccount }}
          </el-form-item>
          <el-form-item
            v-if="!isFrost"
            label="备注"
          >
            <el-input
              v-model="frostForm.reason"
              :autosize="{minRows: 2, maxRows: 4}"
              type="textarea"
              :maxlength="100"
              placeholder="请输入"
            />
          </el-form-item>
        </el-form>
        <div
          style="text-align: right;padding-top: 10px;"
        >
          <el-button
            size="small"
            @click="cancelFrost"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="saveFrost"
          >
            提交
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
  getFreezesList,
  getUnFinanceAgentList,
  getFbastoreList,
  getLscComplicatedList,
  deleteOrder,
  getWarehouseExportFile,
  auditOrder,
  getExpressOrdersZipFile,
  getOrdersGoodFile,
  addFrost,
  removeFrost,
  applyFrost,
  getRiskOrderExcel,
  auditOutOrder,
  getSpecialOrderByCode
} from '@/api/orderlist-at-whole'
import { getStatusList, getCountryByCustSerice } from '@/api/public'
import { getFileData, saveFile } from '@/api/orderlist-at-customs'

import detail from '@/views/orderlist-management/whole-order/detail.vue'
import examineMeasureTab from '@/views/orderlist-management/whole-order/examine-measure-tab.vue'
import express from '@/views/orderlist-management/whole-order/express.vue'
import commodityAudit from '@/views/orderlist-management/commodity-audit/index.vue'
import drawer from '@/components/Drawer/drawer.vue'
import searchMore from '@/views/orderlist-management/whole-order/searchMore.vue'
import dayjs from 'dayjs'

@Component({
  name: 'whole',
  components: {
    detail,
    commodityAudit,
    examineMeasureTab,
    express,
    drawer,
    searchMore
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private detailShow: boolean = false
  private moreShow: boolean = false
  private measureShow: boolean = false
  private expressShow: boolean = false
  private showAudit: boolean = false
  private loading: boolean = false
  private dialogOut: boolean = false
  private specialDialog: boolean = false
  private isFrostVisible: boolean = false
  private loadFileList: boolean = false
  private dialogAudit: boolean = false
  private dialogLoading: boolean = false
  private isLogVisible: boolean = false
  private selectLoading: boolean = false
  private excelLoading: boolean = false
  private isEdit: boolean = false
  private showCustomRow: any = {}
  private customFileList: any[] = []
  private fileList: any[] = []
  private companyTypeList: any[] = [
    { id: '1', name: '本公司' },
    { id: '2', name: '分公司' }
  ]
  private orderTypeList: any[] = [
    { name: '销售订单', id: '0' },
    { name: '采购订单', id: '1' }
  ]
  private selectType = '1'
  private keyWord: any = ''
  private specialRemark: any = ''
  private scId: any = this.custId
  private scName: any = this.custName
  private tableData: any = []
  private outForm: any = {
    audit: undefined,
    remark: undefined,
    reason: undefined
  }
  private moreObj: any = {}
  private searchForm: any = {
    customs0: undefined,
    keyIndex: undefined,
    status: undefined,
    audit: undefined,
    type: undefined,
    lscId: undefined,
    custId: undefined,
    code: undefined,
    customerName: undefined,
    countryId: undefined,
    fbastoreId: undefined,
    comId: undefined,
    deliveryWay: undefined,
    declartionStatus: undefined,
    expressNo: undefined,
    examineStatus: undefined,
    measureStatus: undefined,
    inventoryStatus: undefined,
    includeTax: undefined,
    comType: undefined,
    orderType: '0',
    orderTime: []
  }
  private auditForm: any = {
    audit: '',
    reason: ''
  }
  private auditObj: any = {}
  private formRules = {
    audit: { required: true, message: '请选择审核结果', trigger: 'change' }
  }
  private outRules = {
    audit: { required: true, message: '请选择审核结果', trigger: 'change' }
  }
  private frostRules = {
    remark: { required: true, message: '冻结原因不能为空', trigger: 'blur' }
  }
  private frostForm: any = {
    code: undefined,
    remark: undefined,
    applyName: undefined,
    applyAccount: undefined,
    reason: undefined

  }
  private title = '仓库信息'
  private isFrost: boolean = false
  private selectForm: any = {}
  private page: number = 1
  private size: number = 10
  private total: any = 0

  private typeList = [
    { name: '空运', id: '0' },
    { name: '海运', id: '1' },
    { name: '铁路', id: '2' },
    { name: '快递', id: '3' },
    { name: '卡航', id: '4' }
  ]
  private statusList = []
  private pickList: any[] = [
    { name: '自主送货', id: '0' },
    { name: '上门提货', id: '1' },
    { name: '快递发货', id: '2' },
    { name: '整柜直装', id: '3' }
  ]
  private riskList: any[] = [
    { name: '逾期', id: '1' },
    { name: '信用不足', id: '2' },
    { name: '冻结', id: '3' }
  ]
  private privatelineList: any[] = []
  private countryList: any[] = []
  private warehouseList: any[] = []
  private companyList: any[] = []
  private agentList: any[] = []

  /* computed */
  // 所属公司id
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
  get lineStatusList(): any[] {
    return this.statusList.filter((e: any) => e.type === 'LINE' && e.id !== '501')
  }

  /* methods */
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
  private showExpress(row: any) {
    this.expressShow = true
    const expressRef: any = this.$refs.expressList
    expressRef.show(row)
  }
  private goBack() {
    this.showAudit = false
    this.getTableData()
  }
  private getBack() {
    this.detailShow = false
    this.getTableData()
  }
  private downGoodFile(row: any) {
    if (!row.code) {
      this.$message.error('原单号不存在')
      return
    }
    this.loading = true
    getOrdersGoodFile({ code: row.code }).then((res:any) => {
      this.loading = false
      const a = document.createElement('a')
      document.body.appendChild(a)
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      const objUrl = URL.createObjectURL(blob)
      a.href = objUrl
      a.download = row.code + '商品信息' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.xls'
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
  private downFile(row: any) {
    // 下载
    if (row.url) {
      const url = process.env.VUE_APP_OSS_PATH + row.url
      window.open(url)
    } else {
      this.$message.error('暂无文件可下载')
    }
  }
  private uploadFile(params: any, row: any) {
    const { file } = params
    this.loadFileList = true
    this.$upload(true, file, `jht-admin/customsOrder/${dayjs().valueOf() + '/' + file.name}`)
      .then((res: any) => {
        const { data } = res
        const obj: any = {
          ...row,
          url: data
        }
        if (row.fileStatus === 1) {
          obj.status = 0
        }
        this.saveFile(obj)
      })
      .catch((err:any) => {
        this.loadFileList = false
        return err
      })
  }
  private saveFile(params: any) {
    saveFile(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '上传成功'
        })
        this.loadFileList = false
        this.customFileListShow(this.showCustomRow)
      })
      .catch((err: any) => {
        this.loadFileList = false
        return err
      })
  }
  // 获取报关上传文件
  private customFileListShow(row: any) {
    this.showCustomRow = row
    const params = {
      number: row.code,
      type: row.customs0
    }
    this.loadFileList = true
    getFileData(params).then((res: any) => {
      this.loadFileList = false
      this.customFileList = res.data || []
    }).catch((err: any) => {
      this.loadFileList = false
      return err
    })
  }
  private customFileListHide() {
    this.showCustomRow = {}
    this.customFileList = []
  }
  private volumesFilter(vol: any, len: any) {
    if (len === 'CM') {
      return (vol * 0.000001).toFixed(3)
    } else if (len === 'M') {
      return (vol).toFixed(3)
    } else if (len === 'INCH') {
      return (vol * 0.0000164).toFixed(3)
    } else if (len === 'FT') {
      return (vol * 0.0283168).toFixed(3)
    }
  }
  private onOrderType() {
    this.tableData = []
    if (this.searchForm.orderType === '1') {
      this.searchForm.comType = ''
      this.searchForm.comId = ''
      this.companyList = []
    } else if (this.searchForm.orderType === '0') {
      this.searchForm.comType = '1'
    }
  }
  private onComType() {
    // 仅一级代理商/juhuotong可操作
    this.searchForm.comId = ''
    this.companyList = []
    this.tableData = []
    this.scId = ''
    this.scName = ''
    if (this.searchForm.comType === '1') {
      this.scId = (this as any).custId
      this.scName = (this as any).custName
    }
    this.getTableData(1)
  }
  private onType() {
    this.searchForm.deliveryWay = undefined
    this.searchForm.coverTank = undefined
    this.tableData = []
    this.getTableData(1)
  }
  private onCompany() {
    const item = this.companyList.find((it: any) => it.id === this.searchForm.comId)
    this.scId = (item || {}).id
    this.scName = (item || {}).name
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

  // 获取国家列表
  private getCountryList() {
    const params = {
      custId: this.custId || '',
      typeId: '05'
    }
    this.selectLoading = true
    getCountryByCustSerice(params)
      .then((res: any) => {
        this.countryList = res.data || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  // 专线渠道
  private getPrivatelineList() {
    this.selectLoading = true
    const params: any = {}
    getLscComplicatedList(params)
      .then((res: any) => {
        const data = res.data || []
        this.privatelineList = data
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  // 查询仓库
  private getWarehouseList() {
    this.selectLoading = true
    const params = {
      countryId: this.searchForm.countryId,
      codeSort: 'A',
      page: 1,
      size: 9999
    }
    getFbastoreList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.warehouseList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private formmatAudit(row: any) {
    if (row.audit === '0') {
      return '待审核'
    } else if (row.audit === '1') {
      return '审核通过'
    } else if (row.audit === '2') {
      return '审核拒绝'
    } else if (row.audit === '3') {
      return '审核中'
    }
  }

  // 重置表单
  private resetForm() {
    this.selectForm = {}
  }

  private viewLog(): void {
    this.isEdit = false
    this.isLogVisible = true
  }

  private cancel() {
    this.specialDialog = false
    this.isLogVisible = false
    this.resetForm()
  }
  private cancelOut() {
    this.dialogOut = false
    this.outForm = {
      audit: undefined,
      remark: undefined,
      reason: undefined
    }
    const root: any = this.$refs.outForm
    this.$nextTick(() => {
      root.clearValidate()
    })
  }
  private saveOut(): void {
    const theForm: any = this.$refs.outForm
    theForm.validate((valid: any) => {
      if (!valid) return false
      this.dialogLoading = true
      if (this.outForm.audit === 1) {
        this.outForm.reason = ''
      }
      const { audit, remark, ...obj } = this.outForm
      auditOutOrder({
        insufficientStatus: audit,
        insufficientRemark: remark,
        ...obj
      })
        .then((res: any) => {
          this.dialogLoading = false
          this.$message({
            type: 'success',
            message: '提交成功'
          })
          this.cancelOut()
          this.getTableData()
        }).catch((err: any) => {
          this.dialogLoading = false
          return [err, null]
        })
    })
  }

  private measureAudit(row: any) {
    this.measureShow = true
    const root: any = this.$refs.measureForm
    root.setData(row)
  }

  private handleAudit(row: any): void {
    // 审核
    if (row.audit === '0') {
      const { reason, id, buyer, seller } = row
      const params = {
        audit: '3',
        reason: '',
        orderId: id,
        buyerType: buyer.type,
        sellerType: seller.type
      }
      this.loading = true
      auditOrder(params).then((res: any) => {
        this.getTableData()
        this.showAudit = true
        const refDom: any = this.$refs.commodityAudit
        refDom.show(row.id)
      }).catch((err: any) => {
        this.loading = false
        return [err, null]
      })
    } else {
      this.dialogAudit = true
      const { audit, reason, id, buyer, seller } = row
      this.auditForm = {
        audit: null, orderId: id, reason, buyerType: buyer.type, sellerType: seller.type
      }
    }
  }
  private handleCancel() {
    this.dialogAudit = false
    this.dialogLoading = false
    this.auditObj = {}
    this.auditForm = {
      audit: '',
      reason: ''
    }
    const root: any = this.$refs.auditForm
    this.$nextTick(() => {
      root.clearValidate()
    })
  }
  private handleSubmit() {
    // 提交
    const theForm: any = this.$refs.auditForm
    theForm.validate((valid: any) => {
      if (!valid) return false
      this.dialogLoading = true
      if (this.auditForm.audit === '1') {
        this.auditForm.reason = ''
      }
      auditOrder(this.auditForm)
        .then((res: any) => {
          this.dialogLoading = false
          this.$message({
            type: 'success',
            message: '提交成功'
          })
          this.handleCancel()
          this.getTableData()
        }).catch((err: any) => {
          this.dialogLoading = false
          return [err, null]
        })
    })
  }

  private wholeCommodityAudit(row: any) {
    this.showAudit = true
    const refDom: any = this.$refs.commodityAudit
    refDom.show(row.id)
  }

  private viewData(row: any) {
    // 查看
    this.detailShow = true
    const root: any = this.$refs.detailForm
    root.setData(row)
  }
  private handleMore(row: any) {
    this.moreObj = row
  }
  private handleCommand(command: any) {
    switch (command) {
      case '1':
        this.handlePrintDetail('m1015')
        break
      case '2':
        this.handlePrintDetail('m1010')
        break
      case '3':
        this.handlePrintDetail('wr')
        break
      case '4':
        this.deleteData(this.moreObj)
        break
      case '5':
        this.downData(this.moreObj)
        break
      case '6':
        this.addFrost(this.moreObj)
        break
      case '7':
        this.applyFrost(this.moreObj)
        break
      case '8':
        this.auditFrost(this.moreObj)
        break
      case '11':
        this.dialogOut = true
        this.outForm = {
          code: this.moreObj.code,
          audit: (this.moreObj.fullorderInsufficient || {}).insufficientStatus,
          reason: (this.moreObj.fullorderInsufficient || {}).reason,
          remark: (this.moreObj.fullorderInsufficient || {}).insufficientRemark
        }
        break
      case '12':
        if (this.moreObj.ifFrozen) {
          this.specialRemark = (this.moreObj.freeze || {}).remark
        }
        this.specialDialog = true
        break
      default:
        break
    }
  }

  private handlePrintDetail(tag: any) {
    getWarehouseExportFile({
      tag
    }).then((res: any) => {
      const data = res.data || {}
      const url = data.ip + this.moreObj.code
      window.open(url)
    }).catch((err: any) => {
      return [err, null]
    })
  }

  private downData(row: any) {
    if (!row.code) {
      this.$message.error('原单号不存在')
      return
    }
    this.loading = true
    getExpressOrdersZipFile({
      orderNo: row.code
    }).then((res:any) => {
      this.loading = false
      if (res.type && res.type.indexOf('octet-stream') !== -1) {
        const url = window.URL.createObjectURL(res)
        const a = document.createElement('a')
        document.body.appendChild(a)
        a.href = url
        a.download = '快递订单.zip'
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        this.$message.error('暂无快递标签')
      }
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
  private specialOrder() {
    this.specialDialog = false
    this.specialRemark = ''
    const params = {
      code: this.moreObj.code
    }
    getSpecialOrderByCode(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '提交成功'
        })
        this.getTableData()
      })
      .catch((err: any) => {
        return err
      })
  }
  private rowClassName({ row, rowIndex }: any) {
    if (row.ifFrozen || row.audit === '2') {
      return 'frost-red'
    } else if (!row.enabled) {
      return 'cancel-gray'
    }
  }

  private addFrost(row: any) {
    this.isFrostVisible = true
    this.isFrost = true
    this.frostForm.code = row.code
  }
  private getFrost(val: any) {
    const params: any = {
      code: this.frostForm.code
    }
    let info = ''
    let func:any = null
    if (val === 'apply') {
      func = applyFrost
      info = '此操作将申请解冻订单'
    } else if (val === 'add') {
      params.remark = this.frostForm.remark
      func = addFrost
      info = '是否确认冻结此订单，冻结后将限制货物出库？'
    } else if (val === 'audit') {
      params.reason = this.frostForm.reason
      func = removeFrost
      info = '此操作将解冻订单，解冻后货物可以正常出库'
    }
    this.$confirm(info, '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.dialogLoading = true
        func(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '提交成功'
            })
            this.dialogLoading = false
            this.cancelFrost()
            this.getTableData()
          })
          .catch((err: any) => {
            this.dialogLoading = false
            return err
          })
      })
      .catch(() => {
        return false
      })
  }
  private applyFrost(row: any) {
    this.frostForm.code = row.code
    this.getFrost('apply')
  }
  private auditFrost(row: any) {
    this.isFrostVisible = true
    this.isFrost = false
    this.frostForm.code = row.code
    this.frostForm.remark = (row.freeze || {}).remark
    this.frostForm.applyAccount = (row.freeze || {}).userName
    this.frostForm.applyName = (row.freeze || {}).name
  }
  private cancelFrost() {
    this.isFrostVisible = false
    this.isFrost = false
    this.frostForm = {
      code: undefined,
      remark: undefined,
      applyName: undefined,
      applyAccount: undefined,
      reason: undefined
    }
  }
  private saveFrost() {
    if (this.isFrost) {
      const theForm: any = this.$refs.frostForm
      theForm.validate((valid: any) => {
        if (!valid) return false
        this.getFrost('add')
      })
    } else {
      this.getFrost('audit')
    }
  }

  private deleteData(row: any) {
    const params = {
      code: row.code
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteOrder(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getTableData()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }
  private handleExport() {
    this.excelLoading = true
    const { comId, comType, orderType, custId, orderTime, ...form }: any = this.searchForm
    const params: any = {
      ...form,
      custTag: comType,
      custId: this.scId ? [this.scId] : [],
      code: this.selectType === '1' && this.keyWord ? this.keyWord : undefined,
      customerName: this.selectType === '2' && this.keyWord ? this.keyWord : undefined,
      salesmanStatusTag: true
    }
    if (Array.isArray(orderTime) && orderTime.length > 0) {
      params.startDate = orderTime[0]
      params.endDate = orderTime[1]
    }
    getRiskOrderExcel({ ...params }).then((res:any) => {
      this.excelLoading = false
      const a = document.createElement('a')
      document.body.appendChild(a)
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      const objUrl = URL.createObjectURL(blob)
      a.href = objUrl
      a.download = '全程订单' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.xls'
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(objUrl)
    }).catch((err:any) => {
      this.excelLoading = false
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
      declartionStatus,
      expressNo,
      examineStatus,
      measureStatus,
      inventoryStatus,
      coverTank,
      ifLoading,
      deliveryWay,
      customs0,
      includeTax,
      ...form
    } = root.searchMore
    this.searchForm = { ...form }
    this.getTableData(1)
  }
  private handleMoreConfirm(): void {
    // 确定
    this.moreShow = false
    const root: any = this.$refs.searchMore
    this.searchForm = root.searchMore
    this.getTableData(1)
  }
  // 列表查询
  private getTableData(val?: any): void {
    this.loading = true
    const { comId, comType, orderType, custId, orderTime, ...form }: any = this.searchForm
    if (val) {
      this.page = val
    }
    const params: any = {
      ...form,
      custTag: comType,
      custId: this.scId ? [this.scId] : [],
      code: this.selectType === '1' && this.keyWord ? this.keyWord : undefined,
      customerName: this.selectType === '2' && this.keyWord ? this.keyWord : undefined,
      salesmanStatusTag: true
    }
    if (Array.isArray(orderTime) && orderTime.length > 0) {
      params.startDate = orderTime[0]
      params.endDate = orderTime[1]
    }
    // if (orderType === '0') { // 销售
    //   params.sellerId = this.scId
    //   params.buyerId = comId
    // } else if (orderType === '1') { // 采购
    //   params.buyerId = this.scId
    // }
    const model = {
      page: this.page,
      size: this.size,
      model: {
        ...params
      }
    }
    getFreezesList(model)
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
  // 分页
  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.getTableData()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.getTableData()
  }
  private async getStatusList() {
    await getStatusList().then((res: any) => {
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
  private async created() {
    this.searchForm.custId = (this as any).custId
    this.searchForm.orderTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    const type = (this as any).custType
    const stype = (this as any).custSubtype
    this.searchForm.comType = '1'
    if (type === '2' && stype === '1') {
      this.scId = ''
      this.scName = ''
      this.searchForm.comType = '2'
    }
    this.loading = true
    await this.getStatusList()
    this.getPrivatelineList()
    this.getWarehouseList()
    this.getTableData()
  }
}
</script>

<style lang="scss" scoped>
  .el-dropdown-link {
    margin-left: 10px;
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .order-info{
    width: 100%;
    .seriver-info{
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      .type{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 18px;
        white-space: nowrap;
        border: 1px solid #658DAC;
        border-radius: 2px;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #135180;
        margin-right: 5px;
      }
      .lscName{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #333333;
      }
    }
    .code{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #999999;
      .copy-icon{
        cursor: pointer;
        width: 12px;
        height: 12px;
        display: inline-block;
        margin-right: 5px;
        background: url("../../../assets/imgs/copy.png") center center no-repeat;
        background-size: 100%;
        &:hover{
          background: url("../../../assets/imgs/copy-hover.png") center center no-repeat;
          background-size: 100%;
        }
      }
    }
  }
  ::v-deep .frost-red {
    color: #E12E2E !important;
    .order-info {
      .type {
        color: #E12E2E;
        border-color: #E12E2E;
      }
      .lscName {
        color: #E12E2E;
      }
    }
    .code {
      color: #E12E2E;
    }
    // .el-button--text {
    //   color: #E12E2E;
    // }
    // .el-dropdown-link {
    //   color: #E12E2E;
    // }
  }
  ::v-deep .cancel-gray {
    color: #ccc !important;
    .order-info {
      .type {
        color: #ccc;
        border-color: #ccc;
      }
      .lscName {
        color: #ccc;
      }
    }
    .code {
      color: #ccc;
    }
    // .el-button--text {
    //   color: #ccc;
    // }
    // .el-dropdown-link {
    //   color: #ccc;
    // }
  }
  .special-item {
    color: #E12E2E;
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
  .btn-tip-gray {
    color: rgb(170, 170, 170);
    background-color: rgb(170,170,170, 0.2);
    display: inline-block;
    height: 18px;
    line-height: 18px;
    font-size: 12px;
    padding: 0 2px;
    border-radius: 2px;
    margin: 0 1px;
  }
</style>
