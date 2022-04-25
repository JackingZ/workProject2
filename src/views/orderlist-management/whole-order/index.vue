<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      v-show="!showAudit"
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        v-show="!detailShow && !measureShow && !expressShow && !orderTrackingShow && !orderUpdateShow"
        class="app-container"
      >
        <head-info
          info=""
          title="全程订单"
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
              :disabled="excelLoading"
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
            <el-select
              v-if="custType === '0'"
              v-model="searchForm.agentId"
              :loading="selectLoading"
              size="small"
              style="width:130px;margin-right:5px;"
              placeholder="一级代理商"
              filterable
              clearable
              @change="onAgent"
              @focus="getAgentList"
            >
              <el-option
                v-for="item in agentList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
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
              clearable
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
              v-if="custType === '2' && searchForm.orderType === '0'"
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
              style="width:130px;margin-right:5px;"
              size="small"
              @focus="getCountryList"
              @change=";(searchForm.lscId = undefined, searchForm.fbastoreId = undefined)"
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
              style="width: 130px;margin-right: 5px;"
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
              :disabled="!searchForm.type || !searchForm.countryId"
              :loading="selectLoading"
              size="small"
              style="width: 130px;margin-right: 5px;"
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
              style="width:280px;margin-right: 10px;"
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
                <el-option
                  label="快递单号"
                  value="3"
                />
              </el-select>
              <div
                slot="append"
                class="vague-icon"
              >
                <el-tooltip
                  content="精准匹配"
                  placement="top"
                  effect="light"
                >
                  <span
                    class="vague-img"
                    :class="searchForm.isVague ? 'vague-img-active' : ''"
                    @click.stop="handleVague"
                  />
                </el-tooltip>
              </div>
            </el-input>
            <el-button
              v-permission="['checkingProcessOrder']"
              type="primary"
              size="small"
              @click="getTableData(1)"
            >
              查询
            </el-button>
          </div>

          <div
            class="freeze-box"
            @mousemove="handleMouseMove"
          >
            <el-table
              v-loading="loading"
              :data="tableData"
              :row-class-name="rowClassName"
              height="calc(100vh - 313px)"
              style="width: 100%;margin: 10px 0;"
              border
              @cell-mouse-enter="handleMouseEnter"
              @cell-mouse-leave="handleMouseLeave"
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
                fixed="left"
                label="当前状态"
                min-width="230"
              >
                <div
                  slot-scope="scope"
                  class="order-info"
                >
                  <div>
                    <el-button
                      v-if="scope.row.orderStatus_name"
                      type="text"
                      @click="showOrderTracking(scope.row)"
                    >
                      {{ scope.row.orderStatus_name }}
                    </el-button>
                    <!--<el-button
                      v-if="scope.row.orderStatus_index === '501'"
                      type="text"
                      @click="showOrderSoInfo(scope.row)"
                    >
                      查看详情
                    </el-button>-->
                  </div>
                  <div
                    class="code"
                    :title="scope.row.orderStatus_describe"
                  >
                    <span>
                      {{ scope.row.orderStatus_describe }}
                    </span>
                  </div>
                  <div>
                    {{ scope.row.orderStatus_updateAt }}
                  </div>
                </div>
              </el-table-column>
              <el-table-column
                label="客户名称"
                min-width="120"
              >
                <template slot-scope="scope">
                  <span>{{ (scope.row.orderCustomer || {}).name || scope.row.updateBy }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="下单客户"
                min-width="120"
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
              />
              <el-table-column
                prop=""
                label="下单仓库"
                width="160"
              >
                <template slot-scope="scope">
                  {{ (scope.row.warehouse || {}).name || '--' }}
                </template>
              </el-table-column>
              <el-table-column
                prop=""
                label="货物所在仓"
                width="160"
              >
                <template slot-scope="scope">
                  {{ (scope.row.warehouse1 || {}).name || '--' }}
                </template>
              </el-table-column>
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
                  <span v-if="scope.row.deliveryWay === '4'">到仓</span>
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
                prop="ifLoading"
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
              >
                <template slot-scope="scope">
                  {{ formmatAudit(scope.row) }}
                </template>
              </el-table-column>
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
                  <el-button
                    v-if="scope.row.status['EXAMINE'] === '10' || scope.row.status['EXAMINE'] === '11'"
                    type="text"
                    @click="measureAudit(scope.row, 'EXAMINE')"
                  >
                    {{ (statusList.find(e => e.id === scope.row.status['EXAMINE']) || {name: '--'}).name }}
                  </el-button>
                  <span v-else>
                    {{ (statusList.find(e => e.id === scope.row.status['EXAMINE']) || {name: '--'}).name }}
                  </span>
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
                      :disabled="!$checkPermission(['wholeUploadFile']) || scope.row.ifFrozen"
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
              <!-- <el-table-column
                label="账单"
                min-width="100"
              >
                --
              </el-table-column> -->
              <el-table-column
                label="预估运费"
                min-width="120"
              >
                <template slot-scope="scope">
                  {{ (scope.row.price || {}).totalPrice }} {{ (scope.row.price || {}).currencyId }}
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
                    v-permission="['checkProcessStatus']"
                    type="text"
                    @click="viewData(scope.row)"
                  >
                    查看
                  </el-button>
                  <!-- <el-button
                    v-permission="['orderTracking']"
                    type="text"
                    @click="showOrderTracking(scope.row)"
                  >
                    状态追踪
                  </el-button> -->
                  <el-button
                    v-if="$checkPermission(['wholeCommodityAudit']) && scope.row.enabled"
                    type="text"
                    @click="wholeCommodityAudit(scope.row)"
                  >
                    订单审核
                  </el-button>
                  <el-dropdown
                    v-if="$checkPermission(['processPermissions'])"
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
                        command="0"
                      >
                        商品导出
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="$checkPermission(['wholePrint'])"
                        command="1"
                      >
                        打印唛头10*15
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="$checkPermission(['wholePrint'])"
                        command="2"
                      >
                        打印唛头10*10
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="$checkPermission(['wholePrint'])"
                        command="1015new"
                      >
                        打印唛头10*15(新版)
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="$checkPermission(['wholePrint'])"
                        command="1010new"
                      >
                        打印唛头10*10(新版)
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="$checkPermission(['wholePrint'])"
                        command="9"
                      >
                        打印唛头A4-4
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="$checkPermission(['wholePrint'])"
                        command="3"
                      >
                        打印入仓单
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="scope.row.audit === '1' && scope.row.express && scope.row.express.trackingNos"
                        command="5"
                      >
                        下载快递标签ZIP
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="scope.row.audit === '1' && scope.row.express && scope.row.express.trackingNos"
                        command="10"
                      >
                        下载快递标签PDF
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="scope.row.audit === '1' && scope.row.express && scope.row.express.trackingNos"
                        command="12"
                      >
                        下载快递标签PDF(马赛克)
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="scope.row.audit === '1' && scope.row.express && scope.row.express.trackingNos"
                        command="down"
                      >
                        下载指定快递标签
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="$checkPermission(['measure2label']) && scope.row.status['MEASURE'] === '7' && scope.row.deliveryWay === '0' && scope.row.enabled"
                        command="measure2label"
                      >
                        生成快递单
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="scope.row.audit === '1' && scope.row.enabled && !scope.row.ifFrozen"
                        command="6"
                      >
                        冻结订单
                      </el-dropdown-item>
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
                        v-if="scope.row.insufficient && scope.row.enabled"
                        command="11"
                      >
                        申请出库
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="$checkPermission(['orderUpdate']) && scope.row.enabled"
                        command="update"
                      >
                        订单修改
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="scope.row.scanTag2"
                        command="return"
                      >
                        申请退货
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="$checkPermission(['wholeDel']) && custType === '0' && !scope.row.scanTag2 && !scope.row.enabled && scope.row.status['WS_IN'] !== '15'"
                        command="4"
                      >
                        删除订单
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="$checkPermission(['orderCancel']) && scope.row.enabled && scope.row.isDelivery !== 1 && !scope.row.scanTag2"
                        command="cancel"
                      >
                        取消订单
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
            <div
              id="freezeTip"
              style="display: none;"
              class="freeze-tip"
            />
          </div>

          <el-pagination
            :current-page.sync="page"
            :page-sizes="[10, 20, 30]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
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
      <div
        v-show="orderTrackingShow"
        class="app-container"
      >
        <order-tracking
          ref="orderTracking"
          @back="orderTrackingShow = false"
        />
      </div>
      <order-update
        v-show="orderUpdateShow"
        ref="orderUpdate"
        @back="orderUpdateGoBack"
      />
    </div>
    <commodity-audit
      v-show="showAudit"
      ref="commodityAudit"
      @goBack="goBack"
    />
    <print
      ref="print"
      @printing="(val) => loading = val"
    />

    <el-dialog
      title="申请出库"
      width="600px"
      :close-on-click-modal="false"
      :visible.sync="dialogOut"
      @close="cancelOut"
    >
      <div v-loading="dialogLoading">
        <el-form
          ref="outForm"
          :model="outForm"
          label-width="90px"
          label-position="right"
          size="small"
        >
          <div
            v-if="![0, 1, 2].includes(outForm.audit)"
            style="padding: 0 0 10px 24px;"
          >
            欠费或信用额度不足，只能申请一票出库，请问是否继续？
          </div>
          <el-form-item
            v-if="[0, 1, 2].includes(outForm.audit)"
            label="状态"
            prop="audit"
          >
            <span v-if="outForm.audit === 0">
              待审核
            </span>
            <span v-else-if="outForm.audit === 1">
              审核通过
            </span>
            <span v-else-if="outForm.audit === 2">
              审核拒绝
            </span>
          </el-form-item>
          <el-form-item
            v-if="outForm.audit === 2"
            label="拒绝原因"
            prop="reason"
          >
            {{ outForm.reason }}
          </el-form-item>
          <el-form-item
            label="备注"
            prop="remark"
          >
            <el-input
              v-if="outForm.audit !== 1 && outForm.audit !== 0"
              v-model="outForm.remark"
              :autosize="{minRows: 2, maxRows: 4}"
              type="textarea"
              :maxlength="100"
              placeholder="请输入"
            />
            <span v-else>{{ outForm.remark }}</span>
          </el-form-item>
        </el-form>
        <div
          v-if="outForm.audit !== 1 && outForm.audit !== 0"
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
      :title="title"
      width="1000px"
      :close-on-click-modal="false"
      :visible.sync="isWarehouseVisible"
      @close="cancel"
    >
      <div>弹框</div>
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
          ref="theForm"
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
    <order-so-info
      ref="orderSoInfo"
    />
    <express-export
      ref="expressExport"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getOrderList,
  getFbastoreList,
  getLscComplicatedList,
  getAgentList,
  getCustomerList,
  deleteOrder,
  cancelOrder,
  getWarehouseExportFile,
  auditOrder,
  getExpressOrdersZipFile,
  getExpressOrdersPdfFile,
  getExpressOrdersPdfMosaic,
  getOrdersGoodFile,
  addFrost,
  removeFrost,
  applyFrost,
  getOrderExcel,
  measure2label,
  auditOutOrder,
  getStatusList,
  returnOrder
} from '@/api/orderlist-at-whole'
import { getCountryByCustSerice } from '@/api/public'
import { getFileData, saveFile } from '@/api/orderlist-at-customs'

import detail from '@/views/orderlist-management/whole-order/detail.vue'
import examineMeasureTab from '@/views/orderlist-management/whole-order/examine-measure-tab.vue'
import express from '@/views/orderlist-management/whole-order/express.vue'
import orderTracking from '@/views/orderlist-management/whole-order/order-tracking.vue'
import dayjs from 'dayjs'
import commodityAudit from '@/views/orderlist-management/commodity-audit/index.vue'
import drawer from '@/components/Drawer/drawer.vue'
import searchMore from '@/views/orderlist-management/whole-order/searchMore.vue'
import orderUpdate from '@/views/orderlist-management/whole-order/order-update.vue'
import orderSoInfo from '@/views/orderlist-management/whole-order/order-so-info.vue'
import expressExport from '@/views/orderlist-management/express-order/express-export.vue'
import print from '@/views/orderlist-management/whole-order/print/print.vue'

@Component({
  name: 'whole',
  components: {
    print,
    detail,
    commodityAudit,
    examineMeasureTab,
    express,
    drawer,
    searchMore,
    expressExport,
    orderTracking,
    orderUpdate,
    orderSoInfo
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private detailShow: boolean = false
  private moreShow: boolean = false
  private measureShow: boolean = false
  private expressShow: boolean = false
  private orderTrackingShow: boolean = false
  private orderUpdateShow: boolean = false
  private showAudit: boolean = false
  private loading: boolean = false
  private dialogOut: boolean = false
  private isWarehouseVisible: boolean = false
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
    { id: '1', name: '客户' },
    { id: '2', name: '二级代理商' }
  ]
  private orderTypeList: any[] = [
    { name: '销售订单', id: '0' },
    { name: '采购订单', id: '1' }
  ]
  private selectType = '1'
  private keyWord: any = ''
  private freezeRemark: any = ''
  private tableData: any = []
  private outForm: any = {
    audit: undefined,
    remark: undefined
  }
  private moreObj: any = {}
  private searchForm: any = {
    coverTank: undefined,
    ifFrozen: undefined,
    customs0: undefined,
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
    agentId: undefined,
    deliveryWay: undefined,
    declartionStatus: undefined,
    expressNo: undefined,
    examineStatus: undefined,
    measureStatus: undefined,
    inventoryStatus: undefined,
    includeTax: undefined,
    comType: '',
    orderType: '0',
    isVague: false,
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
    // { name: '快递', id: '3' },
    { name: '卡航', id: '4' }
  ]
  private statusList = []
  private pickList: any[] = [
    { name: '自主送货', id: '0' },
    { name: '上门提货', id: '1' },
    { name: '快递发货', id: '2' },
    { name: '整柜直装', id: '3' }
  ]
  private privatelineList: any[] = []
  private countryList: any[] = []
  private warehouseList: any[] = []
  private companyList: any[] = []
  private agentList: any[] = []

  /* computed */
  // 所属公司id
  get adminId(): string {
    const info = UserModule.info || {}
    const id = (info as any).id
    return id
  }
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
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
  private handleMouseEnter(row: any, column: any, cell: any, event: any) {
    const remark = row.ifFrozen ? '冻结原因: ' + (row.freeze || {}).remark : ''
    const reason = row.audit === '2' ? '审核拒绝原因：' + (row.reason || '') : ''
    this.freezeRemark = remark + (remark && reason ? '<br/>' : '') + (reason || '')
  }
  private handleMouseLeave() {
    this.freezeRemark = ''
  }
  private handleMouseMove(event: any) {
    const el: any = document.getElementById('freezeTip')
    el.style.left = event.clientX + 25 + 'px'
    el.style.top = event.clientY + 'px'
    if (this.freezeRemark) {
      el.style.display = 'block'
      el.innerHTML = this.freezeRemark
    } else {
      el.style.display = 'none'
      el.innerHTML = ''
    }
  }
  private showExpress(row: any) {
    this.expressShow = true
    const expressRef: any = this.$refs.expressList
    expressRef.show(row)
  }
  private showOrderSoInfo(row: any) {
    const orderSoInfoRef: any = this.$refs.orderSoInfo
    orderSoInfoRef.show(row)
  }
  private showOrderTracking(row: any) {
    this.orderTrackingShow = true
    const orderTrackingRef: any = this.$refs.orderTracking
    orderTrackingRef.show(row)
  }
  private showOrderUpdate(row: any) {
    this.orderUpdateShow = true
    const orderUpdateRef: any = this.$refs.orderUpdate
    orderUpdateRef.show(row)
  }
  private goBack() {
    this.showAudit = false
    this.getTableData()
  }
  private orderUpdateGoBack() {
    this.orderUpdateShow = false
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
  }
  private onType() {
    this.searchForm.deliveryWay = undefined
    this.searchForm.coverTank = undefined
    this.searchForm.lscId = undefined
  }
  private onAgent() {
    this.searchForm.comId = undefined
    this.companyList = []
    this.tableData = []
    this.getTableData(1)
  }
  private onCompany() {
    this.tableData = []
    this.getTableData(1)
  }
  private getAgentList() {
    const params:any = {
      page: 1,
      size: 99999
    }
    params.parentId = this.custId
    params.subtype = '1'
    params.types = '05'
    this.selectLoading = true
    getAgentList(params).then((res:any) => {
      const data = res.data || {}
      this.agentList = data.result || []
      this.selectLoading = false
    }).catch((err:any) => {
      this.selectLoading = false
      return err
    })
  }
  private getCompanyList() {
    const params:any = {
      page: 1,
      size: 9999
    }
    const type = (this as any).custType
    const subType = (this as any).custSubtype
    let func:any = null
    if (type === '2' && (this.searchForm.comType === '1' || subType === '2')) {
      params.custIds = [(this as any).custId]
      func = getCustomerList
    } else if (type === '2' && this.searchForm.comType === '2') {
      params.parentId = this.custId
      params.subtype = '2'
      params.types = '05'
      func = getAgentList
    } else {
      this.companyList = []
      return
    }
    this.selectLoading = true
    func(params).then((res:any) => {
      if (type === '2' && (this.searchForm.comType === '1' || subType === '2')) {
        const data = res.data || []
        this.companyList = data
      } else {
        const data = res.data || {}
        this.companyList = data.result || []
      }
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
    const params: any = {
      countryId: this.searchForm.countryId,
      subtypeId: this.searchForm.type
    }
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
    this.isWarehouseVisible = false
    this.isLogVisible = false
    this.resetForm()
  }
  private cancelOut() {
    this.dialogOut = false
    this.outForm = {
      audit: undefined,
      remark: undefined
    }
  }
  private saveOut(): void {
    this.dialogLoading = true
    const params: any = {
      code: this.outForm.code,
      insufficientStatus: 0,
      insufficientRemark: this.outForm.remark
    }
    auditOutOrder(params)
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
  }

  private measureAudit(row: any, type?: string) {
    this.measureShow = true
    const root: any = this.$refs.measureForm
    root.setData(row, type)
  }

  private handleCancel() {
    this.dialogAudit = false
    this.dialogLoading = false
    this.auditObj = {}
    this.auditForm = {
      audit: '',
      reason: ''
    }
    const root: any = this.$refs.theForm
    this.$nextTick(() => {
      root.clearValidate()
    })
  }
  private handleSubmit() {
    // 提交
    const theForm: any = this.$refs.theForm
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
    // 审核
    if (row.audit === '0') {
      const { id, buyer, seller } = row
      const params = {
        audit: '3',
        reason: '',
        orderId: id,
        buyerType: buyer.type,
        sellerType: seller.type
      }
      auditOrder(params).then((res: any) => res).catch((err: any) => err)
    }
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
  private showDownDialog() {
    const expressObj: any = this.moreObj.express || {}
    const expressExportRef: any = this.$refs.expressExport
    expressExportRef.show(expressObj.trackingNos || '')
  }
  private handleCommand(command: any) {
    switch (command) {
      case '0':
        this.downGoodFile(this.moreObj)
        break
      case '1':
        this.handlePrintDetail('m1015')
        break
      case '2':
        this.handlePrintDetail('m1010')
        break
      case '1015new':
        this.handlePrintDetail('m1015', this.moreObj.code)
        break
      case '1010new':
        this.handlePrintDetail('m1010', this.moreObj.code)
        break
      case '9':
        this.handlePrintDetail('mA4-4')
        break
      case '3':
        this.handlePrintInfo()
        // this.handlePrintDetail('wr')
        break
      case '4':
        this.deleteData(this.moreObj)
        break
      case '5':
        this.downZipData(this.moreObj)
        break
      case '10':
        this.downPdfData(this.moreObj, '10')
        break
      case '12':
        this.downPdfData(this.moreObj, '12')
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
      case 'measure2label':
        this.measure2label(this.moreObj)
        break
      case 'down':
        // 下载指定快递标签
        this.showDownDialog()
        break
      case 'cancel':
        this.orderCancel(this.moreObj)
        break
      case 'update':
        this.showOrderUpdate(this.moreObj)
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
      case 'return':
        this.$confirm('此操作会给仓库下达出库申请单，请问是否继续？', '提示', {
          confirmButtonText: '确定',
          closeOnClickModal: false,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 退件出库
          this.loading = true
          returnOrder({ code: this.moreObj.code }).then(res => {
            this.loading = false
            this.$message.success('操作成功')
            this.getTableData()
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {
          return false
        })
        break
      default:
        break
    }
  }

  private measure2label(row: any) {
    this.loading = true
    const params = {
      // expressOrderId: null,
      orderNo: row.code
    }
    measure2label(params).then(() => {
      this.$message.success('操作成功')
      this.getTableData()
    }).catch(() => {
      this.loading = false
    })
  }

  private handlePrintDetail(tag: any, code?: any) {
    if (code) {
      const printEl: any = this.$refs.print
      printEl.printInit(code, tag)
      return
    }
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
  private handlePrintInfo() {
    const { href } = this.$router.resolve({
      path: `/order-file`,
      query: { code: this.moreObj.code }
    })
    window.open(href, '_blank')
  }

  private downZipData(row: any) {
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
        a.download = '快递订单' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.zip'
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
  private downPdfData(row: any, str: string) {
    if (!row.code) {
      this.$message.error('原单号不存在')
      return
    }
    let func: any = null
    if (str === '10') {
      func = getExpressOrdersPdfFile
    } else if (str === '12') {
      func = getExpressOrdersPdfMosaic
    } else {
      return
    }
    this.loading = true
    func({
      orderNo: row.code
    }).then((res:any) => {
      this.loading = false
      const url = window.URL.createObjectURL(res)
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.href = url
      a.download = '快递订单' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.pdf'
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
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
  private orderCancel(row: any) {
    const params = {
      code: row.code
    }
    this.$confirm('请确认是否取消该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        cancelOrder(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '取消成功'
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
    const type = (this as any).custType
    if (type === '1') { // 客户
      this.searchForm.orderType = '1'
    }
    const { comId, agentId, comType, orderType, custId, orderTime, ...form }: any = this.searchForm
    const params: any = {
      ...form,
      code: this.selectType === '1' && this.keyWord ? this.keyWord : undefined,
      customerName: this.selectType === '2' && this.keyWord ? this.keyWord : undefined,
      trackingNo: this.selectType === '3' && this.keyWord ? this.keyWord : undefined,
      salesmanStatusTag: true
    }
    if (Array.isArray(orderTime) && orderTime.length > 0) {
      params.startDate = orderTime[0]
      params.endDate = orderTime[1]
    }
    if (orderType === '0') { // 销售
      params.sellerId = type === '0' ? agentId : custId
      params.buyerId = comId
    } else if (orderType === '1') { // 采购
      params.buyerId = custId
    }
    getOrderExcel({ ...params }).then((res:any) => {
      const a = document.createElement('a')
      document.body.appendChild(a)
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      const objUrl = URL.createObjectURL(blob)
      a.href = objUrl
      a.download = '全程订单' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.xls'
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(objUrl)
      this.excelLoading = false
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
      ifFrozen,
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
  private handleVague() {
    this.searchForm.isVague = !this.searchForm.isVague
  }
  // 列表查询
  private getTableData(val?: any): void {
    this.loading = true
    const type = (this as any).custType
    if (type === '1') { // 客户
      this.searchForm.orderType = '1'
    }
    const { comId, agentId, comType, orderType, custId, orderTime, isVague, ...form }: any = this.searchForm
    if (val) {
      this.page = val
    }
    const params: any = {
      ...form,
      code: this.selectType === '1' && this.keyWord ? this.keyWord : undefined,
      customerName: this.selectType === '2' && this.keyWord ? this.keyWord : undefined,
      trackingNo: this.selectType === '3' && this.keyWord ? this.keyWord : undefined,
      isVague: isVague ? '2' : undefined,
      salesmanStatusTag: true
    }
    if (Array.isArray(orderTime) && orderTime.length > 0) {
      params.startDate = orderTime[0]
      params.endDate = orderTime[1]
    }
    if (orderType === '0') { // 销售
      params.sellerId = type === '0' ? agentId : custId
      params.buyerId = comId
    } else if (orderType === '1') { // 采购
      params.buyerId = custId
    }
    const model = {
      page: this.page,
      size: this.size,
      model: {
        ...params
      }
    }
    getOrderList(model)
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        this.tableData = (data.result || []).map((o: any) => {
          const orderStatusLine = o.orderStatusLine || {}
          const statusList = orderStatusLine.status || []
          const orderStatus = statusList[0] || {}
          const status = o.status || {}
          let scanTag = o.scanTag
          if (!scanTag) {
            const measureStatus = status.MEASURE || ''
            const wsin = status.WS_IN || ''
            if ((measureStatus && measureStatus !== '5') || (wsin && wsin === '15')) {
              scanTag = true
            }
          }
          return {
            ...o,
            orderStatus_name: orderStatus.statusName,
            orderStatus_updateAt: orderStatus.updateAt,
            orderStatus_describe: orderStatus.describe,
            orderStatus_index: orderStatus.statusIndex,
            scanTag2: scanTag
          }
        })
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
          name: e.statusName,
          id: e.statusCode,
          type: e.statusType
        }
      })
    }).catch(() => {
      this.statusList = []
    })
  }
  private async created() {
    this.searchForm.custId = (this as any).custId
    this.searchForm.orderTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
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
  .input-with-select ::v-deep .el-input-group__append {
    background-color: #fff;
    padding: 0;
  }
  .vague-icon {
    width: 30px;
    text-align: center;
  }
  .vague-img {
    cursor: pointer;
    width: 20px;
    height: 20px;
    display: inline-block;
    background: url("../../../assets/imgs/vague.png") center center no-repeat;
    background-size: 100%;
    &-active{
      background: url("../../../assets/imgs/vague-active.png") center center no-repeat;
      background-size: 100%;
    }
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
  .btn-tip-red {
    color: #E12E2E;
    background-color: rgba(245, 108, 108, 0.2);
    display: inline-block;
    height: 18px;
    line-height: 18px;
    font-size: 12px;
    padding: 0 2px;
    border-radius: 2px;
    margin: 0 1px;
  }
  .btn-tip-blue {
    color: #2291E6;
    background-color: rgb(34, 145, 230, 0.2);
    display: inline-block;
    height: 18px;
    line-height: 18px;
    font-size: 12px;
    padding: 0 2px;
    border-radius: 2px;
    margin: 0 1px;
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

  .freeze-tip {
    position: fixed;
    max-width: 400px;
    max-height: 100px;
    min-height: 30px;
    min-width: 50px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    background-color: #000;
    color: #fff;
    font-size: 12px;
    z-index: 3333;
  }
</style>
