<template>
  <div>
    <div
      v-show="!expressShow && !orderTrackingShow"
      v-loading="loading"
      class="app-container"
    >
      <div class="manager-order-flex">
        <div style="width: 200px;border-right: solid 1px #e6e6e6;">
          <div
            class="title-self"
            style="height: 50px;line-height: 50px;border-bottom: 1px solid #DCE0E5;padding: 0 10px;"
          >
            <div style="flex: 1;">
              全部订单
            </div>
            <div style="flex: 1;text-align: right;">
              xxx
            </div>
          </div>
          <el-menu @select="handleSelect">
            <div
              v-for="item in menuList"
              :key="item.id"
            >
              <div v-if="item.children && item.children.length > 0">
                <el-submenu :index="item.id">
                  <template slot="title">
                    <div class="title-self">
                      <div style="flex: 1;">
                        {{ item.name }}
                      </div>
                      <div style="flex: 1;text-align: right;">
                        {{ item.number }}
                      </div>
                    </div>
                  </template>
                  <div
                    v-for="jtem in item.children"
                    :key="jtem.id"
                  >
                    <el-menu-item :index="jtem.id">
                      <div class="title-self">
                        <div style="flex: 1;">
                          {{ jtem.name }}
                        </div>
                        <div style="flex: 1;text-align: right;">
                          {{ jtem.number }}
                        </div>
                      </div>
                    </el-menu-item>
                  </div>
                </el-submenu>
              </div>
              <div v-else>
                <el-menu-item :index="item.id">
                  <div class="title-self">
                    <div style="flex: 1;">
                      {{ item.name }}
                    </div>
                    <div style="flex: 1;text-align: right;">
                      {{ item.number }}
                    </div>
                  </div>
                </el-menu-item>
              </div>
            </div>
          </el-menu>
        </div>
        <div style="flex: 1;padding: 15px;overflow-x: auto;">
          <div style="display: flex;flex-flow: row nowrap;">
            <div class="total-width">
              <div class="total-number">
                {{ statisForm.orderCount }}
              </div>
              <div class="total-text">
                订单数量
              </div>
            </div>
            <div style="flex: 1;padding: 4px 0 0 28px;">
              <el-row
                type="flex"
              >
                <el-col :span="3">
                  <img
                    src="@/assets/imgs/yifukuan.png"
                    class="yifukuan"
                  >
                  <div class="img-word">
                    <span class="img-number">{{ statisForm.paymentCount }}</span>
                    <br>
                    <span class="img-text">总件数</span>
                  </div>
                </el-col>
                <el-col :span="3">
                  <img
                    src="@/assets/imgs/weifukuan.png"
                    class="weifukuan"
                  >
                  <div class="img-word">
                    <span class="img-number">{{ statisForm.unpaymentCount }}</span>
                    <br>
                    <span class="img-text">总重量</span>
                  </div>
                </el-col>
                <el-col :span="3">
                  <img
                    src="@/assets/imgs/yuqi.png"
                    class="yuqi"
                  >
                  <div class="img-word">
                    <span class="img-number">{{ statisForm.overDueCount }}</span>
                    <br>
                    <span class="img-text">总体积</span>
                  </div>
                </el-col>
                <el-col :span="3">
                  <img
                    src="@/assets/imgs/yifahuo.png"
                    class="yifahuo"
                  >
                  <div class="img-word">
                    <span class="img-number">{{ statisForm.shippedCount }}</span>
                    <br>
                    <span class="img-text">应收款</span>
                  </div>
                </el-col>
                <el-col :span="3">
                  <img
                    src="@/assets/imgs/paisongzhong.png"
                    class="paisongzhong"
                  >
                  <div class="img-word">
                    <span class="img-number">{{ statisForm.deliveringCount }}</span>
                    <br>
                    <span class="img-text">实收款</span>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div style="width: 100px;padding-top: 10px;">
              <el-button
                :disabled="excelLoading"
                :loading="excelLoading"
                type="text"
                size="small"
                @click="handleExport"
              >
                导出当前数据
              </el-button>
            </div>
          </div>
          <div style="height: 5px;background: #F2F3F5;margin: 16px 0 24px;" />
          <div style="text-align:right;">
            <el-select
              v-if="custType === '0'"
              v-model="searchForm.agentId"
              :loading="selectLoading"
              size="small"
              style="width:130px;margin-right:5px;"
              placeholder="代理商"
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
              v-if="custType === '2'"
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
              @change=";(searchForm.deliveryWay = undefined, searchForm.lscId = undefined)"
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
              @change=";(searchForm.fbastoreId = undefined, searchForm.lscId = undefined)"
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
              :disabled="!searchForm.countryId"
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
                  label="柜号"
                  value="2"
                />
                <el-option
                  label="快递单号"
                  value="3"
                />
                <el-option
                  label="提单号"
                  value="4"
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
              type="primary"
              size="small"
              @click="getTableData(true, 1)"
            >
              查询
            </el-button>
            <el-button
              size="small"
              @click="handleReset"
            >
              重置
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="handleMoreSearch"
            >
              更多筛选
            </el-button>
          </div>

          <el-table
            :data="tableData"
            height="calc(100vh - 355px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              label="客户名称"
              min-width="150"
            >
              <template slot-scope="scope">
                {{ (scope.row.custName || {}).name }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="客户类型"
              width="100"
            >
              <template slot-scope="scope">
                {{ scope.row.custType === '0' ? '直客' : scope.row.custType === '1' ? '同行' : '' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="code"
              label="原单号"
              min-width="150"
            />
            <el-table-column
              label="当前状态"
              min-width="200"
            >
              <div
                slot-scope="scope"
                class="order-info"
              >
                <el-link
                  v-if="scope.row.orderStatus_name"
                  type="primary"
                  :underline="false"
                  @click="showOrderTracking(scope.row)"
                >
                  {{ scope.row.orderStatus_name }}
                </el-link>
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
              prop="createTime"
              label="下单日期"
              width="170"
            />
            <el-table-column
              prop="wsInTime"
              label="入库日期"
              width="170"
            />
            <el-table-column
              prop="wareHouseAt"
              label="货物所在仓"
              width="170"
            />
            <el-table-column
              prop=""
              label="所属公司"
              min-width="150"
            >
              <template slot-scope="scope">
                <span v-if="custType !== '0'">{{ (scope.row.buyer || {}).name }}</span>
                <span v-else>{{ (scope.row.seller || {}).name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="salesman"
              label="所属业务员"
              width="170"
            />
            <el-table-column
              prop="finances"
              label="财务人员"
              width="170"
            />
            <el-table-column
              prop="customers"
              label="客服人员"
              width="170"
            />
            <el-table-column
              prop=""
              label="地址类型"
              width="120"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.addressType === '0'">FBA仓库</span>
                <span v-else-if="scope.row.addressType === '1'">私人地址</span>
                <span v-else-if="scope.row.addressType === '2'">自有海外仓</span>
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="目的国"
              width="170"
            >
              <template slot-scope="scope">
                {{ (scope.row.consignee || {}).country }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="目的省份"
              width="170"
            >
              <template slot-scope="scope">
                {{ (scope.row.consignee || {}).province }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="目的城市"
              width="170"
            >
              <template slot-scope="scope">
                {{ (scope.row.consignee || {}).city }}
              </template>
            </el-table-column>
            <el-table-column
              prop="warehouse"
              label="目的仓"
              width="120"
            />
            <el-table-column
              prop=""
              label="专线服务"
              width="170"
            >
              <template slot-scope="scope">
                {{ (scope.row.lsc || {}).value }}
              </template>
            </el-table-column>
            <el-table-column
              label="业务类型"
              width="100"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.type === '0'">空运</span>
                <span v-else-if="scope.row.type === '1'">海运</span>
                <span v-else-if="scope.row.type === '2'">铁路</span>
                <span v-else-if="scope.row.type === '4'">卡航</span>
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
              label="关税方式"
              width="100"
            >
              <template slot-scope="scope">
                {{ scope.row.includeTax ? '包税' : '不包税' }}
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
              prop="expressCompany"
              label="快递公司"
              min-width="150"
            >
              <template slot-scope="scope">
                {{ (scope.row.express || {}).expressName }}
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
              prop=""
              label="柜号/提单号"
              width="160"
            >
              <template slot-scope="scope">
                <div>
                  {{ scope.row.containerNo || '--' }}
                </div>
                <div>
                  {{ scope.row.billNo || '--' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="batch"
              label="发货批次"
              width="120"
            />
            <el-table-column
              prop="packages"
              label="总件数"
              width="100"
            />
            <el-table-column
              prop=""
              label="实际总体积"
              min-width="120"
            >
              <template slot-scope="scope">
                {{ $volumeConversion((scope.row.measure || {}).totalVolume, $getVolumeUnitByLengthUnit((scope.row.um || {}).umLength), 'CBM') || 0 }} m³
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="实际总重量"
              min-width="120"
            >
              <template slot-scope="scope">
                {{ $volumeConversion((scope.row.measure || {}).totalWight, (scope.row.um || {}).umWeight, 'KGS') || 0 }} kg
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="收费体积"
              width="120"
            >
              <template slot-scope="scope">
                {{ (scope.row.measure || {}).priceVolume || '--' }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="收费重量"
              width="120"
            >
              <template slot-scope="scope">
                {{ (scope.row.measure || {}).priceWight || '--' }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="计费单位"
              width="100"
            >
              <template slot-scope="scope">
                {{ (scope.row.measure || {}).priceUnit === '2' ? '重量计费' : (scope.row.measure || {}).priceUnit === '3' ? '体积计费' : '--' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="bulky"
              label="分泡比"
              width="100"
            />
            <el-table-column
              prop="method"
              label="结算方式"
              width="110"
            >
              <template slot-scope="scope">
                {{ (payList.find((it) => it.value === scope.row.method) || {}).label }}
              </template>
            </el-table-column>
            <el-table-column
              prop="credit"
              label="公司信用"
              width="150"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.credit }}</div>
                <div>{{ (scope.row.creditRating || '') + '-' + ((creditList.find((it) => it.code === scope.row.creditRating) || {}).name || '') }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="账单"
              width="100"
            >
              <template slot-scope="scope">
                {{ scope.row.cutoffTime ? '已出' : '未出' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="invoiceTime"
              label="开票日期"
              width="170"
            />
            <el-table-column
              prop=""
              label="应收金额"
              min-width="150"
            >
              <template slot-scope="scope">
                <div>
                  账单：{{ scope.row.amount || '--' }} {{ scope.row.amountUnit }}
                </div>
                <div>
                  本币：{{ scope.row.selfAmount || '--' }} {{ scope.row.selfAmountUnit }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="payTime"
              label="结算日期"
              width="170"
            />
            <el-table-column
              prop=""
              label="是否付款"
              width="100"
            >
              <template slot-scope="scope">
                {{ scope.row.isPayment ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="overDay"
              label="逾期天数"
              width="100"
            />
            <el-table-column
              prop="remarks"
              label="备注"
              min-width="120"
              show-overflow-tooltip
            />
          </el-table>

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
      </div>
      <drawer
        :is-show="moreShow"
        :mask-closable="false"
        drawer-title="更多筛选"
        drawer-style="width: 400px;"
        cancel-text="重置"
        confirm-text="查询"
        @drawerClose="handleMoreCancel"
        @drawerConfirm="handleMoreConfirm"
      >
        <searchMore
          ref="searchMore"
          :status-list="statusList"
        />
      </drawer>
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getCustomerOrderList,
  getCustomerOrderStatistics,
  getFbastoreList,
  getLscSimpleList,
  getAgentList,
  getAllAgentList,
  getCustomerList,
  getCustomerOrderExcel,
  getStatusList,
  getWordsList,
  getCustRatingList
} from '@/api/orderlist-at-whole'
import dayjs from 'dayjs'
import { getCountryByCustSerice } from '@/api/public'
import drawer from '@/components/Drawer/drawer.vue'
import searchMore from '@/views/sales-management/orders-statistics/searchMore.vue'
import orderTracking from '@/views/orderlist-management/whole-order/order-tracking.vue'
import express from '@/views/orderlist-management/whole-order/express.vue'

function paramsForm() {
  return {
    addressType: undefined,
    includeCust: undefined,
    includeFinance: undefined,
    includeService: undefined,
    payStatus: [],
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
    isVague: false,
    comType: '',
    orderTime: []
  }
}

@Component({
  name: '',
  components: {
    drawer,
    searchMore,
    orderTracking,
    express
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private menuList: any[] = [
    { id: '1', name: '未入库', number: '111' },
    { id: '2', name: '未完成审核', number: undefined },
    { id: '3', name: '收货异常', number: undefined },
    { id: '4', name: '已收货', number: undefined },
    { id: '5', name: '已订舱', number: undefined },
    { id: '6', name: '已签收', number: undefined },
    { id: '7',
      name: '未付款',
      number: '777',
      children: [
        { id: '8', name: '票结未付', number: undefined },
        { id: '9', name: '逾期未付', number: undefined },
        { id: '10', name: '账单未付', number: undefined }
      ]
    },
    { id: '11', name: '信用不足', number: undefined },
    { id: '12', name: '已付款', number: undefined }
  ]
  private moreShow: boolean = false
  private expressShow: boolean = false
  private orderTrackingShow: boolean = false
  private loading: boolean = false
  private selectLoading: boolean = false
  private excelLoading: boolean = false
  private selectType = '1'
  private keyWord: any = ''
  private tableData: any = []
  private searchForm: any = paramsForm()
  private statisForm: any = {
    deliveringCount: undefined,
    orderCount: undefined,
    overDueCount: undefined,
    paymentCount: undefined,
    receiverCount: undefined,
    shippedCount: undefined,
    unpaymentCount: undefined
  }
  private page: number = 1
  private size: number = 10
  private total: any = 0
  private companyTypeList: any[] = [
    { id: '1', name: '客户' },
    { id: '2', name: '二级代理商' }
  ]
  private typeList = [
    { name: '空运', id: '0' },
    { name: '海运', id: '1' },
    { name: '铁路', id: '2' },
    // { name: '快递', id: '3' },
    { name: '卡航', id: '4' }
  ]
  private statusList = []
  private payList = []
  private creditList = []
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
  private comObj: any = {}

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

  /* methods */
  private handleSelect(key: any, keyPath: any) {
    //
  }

  private showExpress(row: any) {
    this.expressShow = true
    const expressRef: any = this.$refs.expressList
    expressRef.show(row)
  }
  private showOrderTracking(row: any) {
    this.orderTrackingShow = true
    const orderTrackingRef: any = this.$refs.orderTracking
    orderTrackingRef.show(row)
  }
  private onComType() {
    // 仅一级代理商/juhuotong可操作
    this.searchForm.comId = ''
    this.companyList = []
    this.tableData = []
  }
  private async onAgent(val: any) {
    const item = this.agentList.find((it: any) => it.id === val)
    this.comObj = item || {}
    this.tableData = []
    await this.getTableData(true, 1)
  }
  private getAgentList() {
    this.selectLoading = true
    getAllAgentList().then((res:any) => {
      const data = res.data || []
      this.agentList = data
      this.selectLoading = false
    }).catch((err:any) => {
      this.selectLoading = false
      return err
    })
  }
  private async onCompany(val: any) {
    const item = this.companyList.find((it: any) => it.id === val)
    this.comObj = item || {}
    this.tableData = []
    await this.getTableData(true, 1)
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
      params.parentId = (this as any).custId
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
      custId: (this as any).custId || '',
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

  // 专线渠道
  private getPrivatelineList() {
    this.selectLoading = true
    const params: any = {
      subtypeId: this.searchForm.subtypeId,
      countryId: this.searchForm.countryId
    }
    getLscSimpleList(params)
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

  private handleExport() {
    this.excelLoading = true
    const {
      comId,
      agentId,
      comType,
      custId,
      orderTime,
      payStatus,
      includeCust,
      includeFinance,
      includeService,
      ...form
    }: any = this.searchForm
    const arr = [includeCust, includeFinance, includeService].filter((it: any) => !!it)
    const params: any = {
      ...form,
      include: arr.join(','),
      payStatus: payStatus.length > 0 ? payStatus.join(',') : undefined,
      code: this.selectType === '1' && this.keyWord ? this.keyWord : undefined,
      containerNo: this.selectType === '2' && this.keyWord ? this.keyWord : undefined,
      trackingNo: this.selectType === '3' && this.keyWord ? this.keyWord : undefined,
      billNo: this.selectType === '4' && this.keyWord ? this.keyWord : undefined,
      salesmanStatusTag: true
    }
    if (Array.isArray(orderTime) && orderTime.length > 0) {
      params.startDate = orderTime[0]
      params.endDate = orderTime[1]
    }
    params.sellerId = (this as any).custType === '0' ? agentId : custId
    params.buyerId = comId
    getCustomerOrderExcel({ ...params }).then((res:any) => {
      const a = document.createElement('a')
      document.body.appendChild(a)
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      const objUrl = URL.createObjectURL(blob)
      a.href = objUrl
      a.download = '订单统计' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.xls'
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
    root.searchMore = {
      ...this.searchForm
    }
    this.$nextTick(() => {
      root.setData(this.comObj, this.searchForm.comType)
    })
  }
  private async handleReset() {
    this.searchForm = paramsForm()
    this.searchForm.custId = (this as any).custId
    this.searchForm.orderTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    await this.getTableData(true, 1)
  }
  private async handleMoreCancel() {
    // 取消
    this.moreShow = false
    const root: any = this.$refs.searchMore
    const {
      addressType,
      includeCust,
      includeFinance,
      includeService,
      payStatus,
      declartionStatus,
      expressNo,
      examineStatus,
      measureStatus,
      inventoryStatus,
      ifLoading,
      deliveryWay,
      customs0,
      includeTax,
      ...form
    } = root.searchMore
    this.searchForm = { ...form, payStatus: [] }
    await this.getTableData(true, 1)
  }
  private async handleMoreConfirm() {
    // 确定
    this.moreShow = false
    const root: any = this.$refs.searchMore
    this.searchForm = root.searchMore
    await this.getTableData(true, 1)
  }
  private handleVague() {
    this.searchForm.isVague = !this.searchForm.isVague
  }

  // 列表查询
  private async getTableData(bool: boolean, val?: any) {
    this.loading = true
    const {
      comId,
      agentId,
      comType,
      custId,
      orderTime,
      payStatus,
      includeCust,
      includeFinance,
      includeService,
      isVague,
      ...form
    }: any = this.searchForm
    if (val) {
      this.page = val
    }
    const arr = [includeCust, includeFinance, includeService].filter((it: any) => !!it)
    const params: any = {
      ...form,
      include: arr.join(','),
      payStatus: payStatus.length > 0 ? payStatus.join(',') : undefined,
      code: this.selectType === '1' && this.keyWord ? this.keyWord : undefined,
      containerNo: this.selectType === '2' && this.keyWord ? this.keyWord : undefined,
      trackingNo: this.selectType === '3' && this.keyWord ? this.keyWord : undefined,
      billNo: this.selectType === '4' && this.keyWord ? this.keyWord : undefined,
      isVague: isVague ? '2' : undefined,
      salesmanStatusTag: true
    }
    if (Array.isArray(orderTime) && orderTime.length > 0) {
      params.startDate = orderTime[0]
      params.endDate = orderTime[1]
    }
    params.sellerId = (this as any).custType === '0' ? agentId : custId
    params.buyerId = comId
    const model = {
      page: this.page,
      size: this.size,
      model: {
        ...params
      }
    }
    try {
      if (bool) {
        const resC = await getCustomerOrderStatistics(params)
        this.statisForm = resC.data || {}
      }
      const resT = await getCustomerOrderList(model)
      const data = resT.data || {}
      this.tableData = (data.result || []).map((o: any) => {
        const orderStatusLine = o.orderStatusLine || {}
        const statusList = orderStatusLine.status || []
        const orderStatus = statusList[0] || {}
        return {
          ...o,
          orderStatus_name: orderStatus.statusName,
          orderStatus_updateAt: orderStatus.updateAt,
          orderStatus_describe: orderStatus.describe
        }
      })
      this.total = data.total
      this.loading = false
    } catch (error) {
      this.loading = false
      return error
    }
  }
  // 分页
  private async handleSizeChange(val: string) {
    this.size = Number(val)
    await this.getTableData(false)
  }

  private async handleCurrentChange(val: string) {
    this.page = Number(val)
    await this.getTableData(false)
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
      this.loading = false
      this.statusList = []
    })
  }
  private async getPaytypeList() {
    await getWordsList({
      type: 'CUST_PAY_METHOD'
    })
      .then((res: any) => {
        const data = res.data || []
        this.payList = data
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private async getCustRatingList() {
    await getCustRatingList({
      page: 1,
      size: 999
    })
      .then((res: any) => {
        const data = res.data || {}
        const arr = data.result || []
        this.creditList = arr
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private async created() {
    this.searchForm.custId = (this as any).custId
    this.searchForm.orderTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    this.loading = true
    await this.getStatusList()
    await this.getPaytypeList()
    await this.getCustRatingList()
    await this.getTableData(true)
  }
}
</script>

<style lang="scss" scoped>
.manager-order-flex {
  background-color: #fff;
  height: calc(100vh - 115px);
  display: flex;
  flex-flow: row nowrap;
  .title-self {
    display: flex;
    position: relative;
    top: 0;
  }
}
::v-deep .el-submenu__icon-arrow {
  left: 4px;
  right: unset;
  margin-top: -5px;
}
::v-deep .el-submenu.is-active > .el-submenu__title {
  color: #303133 !important;
}
::v-deep .el-submenu__title {
  height: 30px;
  line-height: 30px;
}

.el-submenu .el-menu-item {
  padding: 0 20px;
  height: 30px;
  line-height: 30px;
}
.el-menu-item {
  height: 30px;
  line-height: 30px;
}
.el-menu {
  border-right: none;
}

.total-width {
  width: 120px;
  padding-left: 8px;
  border-right: 1px solid #DCE0E5;
}

.total-number {
  font-size: 24px;
  line-height: 29px;
  font-weight: bold;
}
.total-text {
  font-size: 13px;
  line-height: 17px;
  color: #909399;
}
.img-word {
  display: inline-block;
  vertical-align: top;
  margin-left: 8px;
}
.img-number {
  font-size: 18px;
  font-weight: 600;
}
.img-text {
  font-size: 13px;
  color: #909399;
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

.yiqianshou {
  display: inline-block;
  width: 38px;
  height: 38px;
  background-size: 100%;
}
.yifukuan {
  display: inline-block;
  width: 38px;
  height: 38px;
  background-size: 100%;
}
.weifukuan {
  display: inline-block;
  width: 38px;
  height: 38px;
  background-size: 100%;
}
.yuqi {
  display: inline-block;
  width: 38px;
  height: 38px;
  background-size: 100%;
}
.yifahuo {
  display: inline-block;
  width: 38px;
  height: 38px;
  background-size: 100%;
}
.paisongzhong {
  display: inline-block;
  width: 38px;
  height: 38px;
  background-size: 100%;
}
</style>
