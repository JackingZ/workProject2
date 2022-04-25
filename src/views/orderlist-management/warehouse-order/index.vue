<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        v-show="detailShow === 'i'"
        class="app-container"
      >
        <head-info
          info=""
          title="仓库订单"
        >
          <template v-slot:option>
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
          <el-row>
            <el-col :span="4">
              <el-button
                size="small"
                type="text"
                @click="showPrint('1')"
              >
                打印入仓单
              </el-button>
              <el-button
                size="small"
                type="text"
                @click="showPrint('2')"
              >
                打印唛头
              </el-button>
            </el-col>
            <el-col :span="20">
              <div style="text-align:right;">
                <el-select
                  v-if="custType === '0' || custType === '2'"
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
                </el-select>
                <el-select
                  v-if="custType === '2' && custSubtype === '1' && searchForm.orderType === '0'"
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
                  v-if="(custType === '0' || custType === '2') && searchForm.orderType === '0'"
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
                  v-model="searchForm.status"
                  :loading="selectLoading"
                  placeholder="订单状态"
                  style="width: 100px;margin-right: 5px;"
                  size="small"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in (searchForm.type === '3' ? orderStatusList2 : statusList)"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                <el-select
                  v-model="searchForm.type"
                  size="small"
                  style="width: 100px;margin-right: 5px;"
                  placeholder="业务类型"
                  filterable
                  @change="typeChange"
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                <el-select
                  v-if="searchForm.type === '2'"
                  v-model="searchForm.from"
                  size="small"
                  style="width: 100px;margin-right: 5px;"
                  placeholder="订单来源"
                  clearable
                  filterable
                >
                  <el-option
                    label="客户端"
                    value="web"
                  />
                  <el-option
                    label="专线"
                    value="line"
                  />
                </el-select>
                <!-- <el-select
                  v-model="searchForm.loading"
                  size="small"
                  style="width: 130px;margin-right: 5px;"
                  placeholder="装货方式"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in loadList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select> -->

                <el-select
                  v-model="searchForm.warehouseId"
                  :loading="selectLoading"
                  size="small"
                  style="width: 130px;margin-right: 5px;"
                  placeholder="仓库"
                  clearable
                  filterable
                  @focus="getWarehouseList"
                >
                  <el-option
                    v-for="item in warehouseList"
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
                  v-model="searchForm.code"
                  placeholder="请输入内容"
                  class="input-with-select"
                  style="width:240px;margin-right: 10px;"
                  size="small"
                  clearable
                >
                  <template
                    v-if="searchForm.type !== '3'"
                    slot="prepend"
                  >
                    原单号
                  </template>
                  <template
                    v-else
                    slot="prepend"
                  >
                    <el-select
                      v-model="selectType"
                      size="small"
                      style="width:100px;"
                      placeholder="请选择"
                    >
                      <el-option
                        label="订单号"
                        value="1"
                      />
                      <el-option
                        label="柜号"
                        value="2"
                      />
                      <!-- <el-option
                        label="备注"
                        value="3"
                      /> -->
                    </el-select>
                  </template>
                </el-input>
                <el-button
                  v-permission="['warehouseOrderQuery']"
                  type="primary"
                  size="small"
                  @click="getTableData(1)"
                >
                  查询
                </el-button>
              </div>
            </el-col>
          </el-row>
          <div v-show="searchForm.type !== '3'">
            <el-table
              v-loading="loading"
              :data="tableData"
              height="calc(100vh - 313px)"
              style="width: 100%;margin: 10px 0;"
              border
            >
              <el-table-column
                fixed="left"
                prop="code"
                label="原单号"
                width="160"
              />
              <el-table-column
                :formatter="formmatStatus"
                label="订单状态"
                width="100"
              />
              <el-table-column
                :formatter="formmatType"
                label="业务类型"
                width="100"
              />
              <el-table-column
                v-show="searchForm.type === '2'"
                label="订单来源"
                width="100"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.from === 'web'">客户端</span>
                  <span v-else-if="scope.row.from === 'line'">专线</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column
                v-show="searchForm.type === '2'"
                label="渠道"
                min-width="150"
              >
                <template slot-scope="scope">
                  <span>
                    {{ (scope.row.service || {}).value || '--' }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="下单时间"
                width="180"
              />
              <el-table-column
                label="下单客户"
                min-width="160"
              >
                <template slot-scope="scope">
                  <span>
                    {{ (scope.row.buyer || {}).name }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="客户名称"
                min-width="160"
              >
                <template slot-scope="scope">
                  <span>
                    {{ (scope.row.orderCustomer || {}).name }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="下单仓库"
                min-width="160"
              >
                <template slot-scope="scope">
                  <span>
                    {{ (scope.row.warehouse || {}).name }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                :formatter="formmatLoading"
                label="装货方式"
                width="150"
              />
              <el-table-column
                prop=""
                label="箱数"
                min-width="120"
              >
                <template slot-scope="scope">
                  <div>理论：{{ scope.row.packages }}</div>
                  <div>实际：{{ (scope.row.measure || {}).packages }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop=""
                label="体积"
                min-width="150"
              >
                <template slot-scope="scope">
                  <div>理论：{{ $volumeConversion(scope.row.volumes, $getVolumeUnitByLengthUnit((scope.row.um || {}).umLength), 'CBM') }} CBM</div>
                  <div>实际：{{ $volumeConversion((scope.row.measure || {}).totalVolume, 'CBCM', 'CBM') }} CBM</div>
                </template>
              </el-table-column>
              <el-table-column
                prop=""
                label="重量"
                min-width="150"
              >
                <template slot-scope="scope">
                  <div>理论：{{ $volumeConversion(scope.row.weights, $getVolumeUnitByLengthUnit((scope.row.um || {}).umWeight), 'KGS') }} KGS</div>
                  <div>实际：{{ (scope.row.measure || {}).totalWeight }} KGS</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="remark"
                label="备注"
                min-width="120"
                show-overflow-tooltip
              />
              <el-table-column
                fixed="right"
                label="操作"
                width="180"
              >
                <template slot-scope="scope">
                  <el-button
                    v-permission="['warehouseOrderGet']"
                    type="text"
                    @click="viewData(scope.row)"
                  >
                    查看
                  </el-button>
                  <!--express.trackingNos 在仓库订单中仅作下载快递标签按钮显示，值不可用，后台随便返回的一个值-->
                  <el-button
                    v-if="scope.row.status === '0' && searchForm.orderType === '1' && $checkPermission(['warehouseOrderDel'])"
                    type="text"
                    @click="deleteData(scope.row)"
                  >
                    删除
                  </el-button>
                  <el-button
                    v-permission="['warehouseOrderFinancial']"
                    type="text"
                    @click="showFinancial(scope.row)"
                  >
                    账单信息
                  </el-button>
                  <el-dropdown
                    v-if="(custType === '0' || custType === '3') && scope.row.express && scope.row.express.trackingNos"
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
                        v-if="(custType === '0' || custType === '3') && scope.row.express && scope.row.express.trackingNos"
                        command="1"
                      >
                        下载快递标签ZIP
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="(custType === '0' || custType === '3') && scope.row.express && scope.row.express.trackingNos"
                        command="2"
                      >
                        下载快递标签PDF
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="(custType === '0' || custType === '3') && scope.row.express && scope.row.express.trackingNos"
                        command="6"
                      >
                        下载快递标签PDF(马赛克)
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="(custType === '0' || custType === '3') && scope.row.express && scope.row.express.trackingNos"
                        command="3"
                      >
                        下载指定快递标签
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <!-- <el-button
                    v-if="!scope.row.transfered && searchForm.orderType === '0' && custType !== '3'"
                    type="text"
                    @click="moveOrder(scope.row)"
                  >
                    流转订单
                  </el-button> -->
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-show="searchForm.type === '3'">
            <el-table
              v-loading="loading"
              :data="tableList"
              height="calc(100vh - 313px)"
              style="width: 100%;margin: 10px 0;"
              border
            >
              <el-table-column
                fixed="left"
                prop="code"
                label="订单号"
                width="160"
              />
              <el-table-column
                fixed="left"
                label="原单号"
                width="160"
                :formatter="formmatCode"
              />
              <el-table-column
                :formatter="formmatStatus2"
                label="订单状态"
                width="100"
              />
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
                min-width="160"
              >
                <template slot-scope="scope">
                  <span>
                    {{ scope.row.orderCustomer }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="客户名称"
                min-width="160"
              >
                <template slot-scope="scope">
                  <span>
                    {{ scope.row.custName }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="下单仓库"
                min-width="160"
              >
                <template slot-scope="scope">
                  <span>
                    {{ (scope.row.warehouse || {}).name }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="装货方式"
                width="150"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.loadingType +'' === '1'">
                    托盘
                  </span>
                  <span v-else-if="scope.row.loadingType + '' === '0'">
                    箱子
                  </span>
                  <span v-else-if="scope.row.loadingType + '' === '2'">
                    家具等超大件
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="totalBox"
                label="箱数"
                width="120"
              />
              <el-table-column
                prop=""
                label="体积"
                min-width="120"
              >
                <template slot-scope="scope">
                  {{ scope.row.totalVolume }} {{ (scope.row.um || {}).umVolume }}
                </template>
              </el-table-column>
              <el-table-column
                prop=""
                label="重量"
                min-width="120"
              >
                <template slot-scope="scope">
                  {{ scope.row.totalWeight }} {{ (scope.row.um || {}).umWeight }}
                </template>
              </el-table-column>
              <el-table-column
                prop="remarks"
                label="备注"
                min-width="120"
                show-overflow-tooltip
              />
              <el-table-column
                fixed="right"
                label="操作"
                width="200"
              >
                <template slot-scope="scope">
                  <el-button
                    v-permission="['warehouseOrderGet']"
                    type="text"
                    @click="viewData(scope.row)"
                  >
                    查看
                  </el-button>
                  <el-button
                    v-if="scope.row.openTankTask !== 1 && $checkPermission(['addRemoval'])"
                    type="text"
                    @click="addRemoval(scope.row)"
                  >
                    生成拆柜
                  </el-button>
                  <el-button
                    v-permission="['warehouseOrderFinancial']"
                    type="text"
                    @click="showFinancial(scope.row)"
                  >
                    账单信息
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

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
      <div
        v-show="detailShow === 'd'"
        class="app-container"
      >
        <detail
          v-if="searchForm.type !== '3'"
          ref="detailForm"
          @back="detailShow = 'i'"
        />
        <detail2
          v-if="searchForm.type === '3'"
          ref="detailForm"
          @back="detailShow = 'i'"
        />
      </div>
      <div
        v-show="detailShow === 'f'"
        class="app-container"
      >
        <order-financial
          ref="financial"
          @back="detailShow = 'i'"
        />
      </div>
    </div>

    <el-dialog
      title="客户信息"
      width="600px"
      :close-on-click-modal="false"
      :visible.sync="isCustomerVisible"
      @close="cancel"
    >
      <div>弹框</div>
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
      :title="printType === '1' ? '打印入仓单' : '打印唛头'"
      width="500px"
      :close-on-click-modal="false"
      :visible.sync="printShow"
    >
      <div style="display: flex;align-items: center">
        <span>原单号：</span>
        <el-input
          v-model="printCode"
          size="small"
          style="flex: 1"
          placeholder="请输入原单号"
        />
      </div>
      <div
        slot="footer"
        style="text-align: right;"
      >
        <el-button
          size="small"
          @click="printShow = false"
        >
          取 消
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="printClick"
        >
          打 印
        </el-button>
        <el-button
          v-if="printType !== '1'"
          type="primary"
          size="small"
          @click="printClickNew"
        >
          打印新版
        </el-button>
      </div>
    </el-dialog>
    <print
      ref="print"
    />
    <import-order
      ref="ImportOrder"
      @load="getTableData(1)"
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
  getCountryList,
  getWarehouseAllList,
  getWHList,
  moveOrder,
  getSupplierList,
  getAgentList,
  getCustomerList,
  deleteOrder,
  deletePallet,
  getExpressOrdersZipFile,
  getExpressOrdersPdfFile,
  getExpressOrdersPdfMosaic,
  getPalletOrderList,
  getOrderExcel
} from '@/api/orderlist-at-warehouse'
import detail from '@/views/orderlist-management/warehouse-order/detail.vue'
import detail2 from '@/views/orderlist-management/warehouse-order/detail2.vue'
import orderFinancial from '@/views/orderlist-management/warehouse-order/orderFinancial.vue'
import ImportOrder from '@/views/orderlist-management/warehouse-order/ImportOrder.vue'
import expressExport from '@/views/orderlist-management/express-order/express-export.vue'
import dayjs from 'dayjs'
import { getStatusList } from '@/api/public'
import { addRemoval } from '@/api/warehose-by-cabinet-removal'
import print from '@/views/orderlist-management/whole-order/print/print.vue'

@Component({
  name: '',
  components: {
    detail,
    ImportOrder,
    detail2,
    expressExport,
    print,
    orderFinancial
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private detailShow: string = 'i'
  private loading: boolean = false
  private isCustomerVisible: boolean = false
  private isWarehouseVisible: boolean = false
  private isLogVisible: boolean = false
  private selectLoading: boolean = false
  private excelLoading: boolean = false
  private isEdit: boolean = false
  private printShow: boolean = false
  private selectType: string = '1'
  private printCode: string = ''
  private printType: string = ''
  private moreObj: any = {}
  private companyTypeList: any[] = [
    { id: '1', name: '客户' },
    { id: '2', name: '二级代理商' }
  ]
  private orderTypeList: any[] = [
    { name: '销售订单', id: '0' },
    { name: '采购订单', id: '1' }
  ]
  private tableData: any = []
  private tableList: any[] = []
  private orderStatusList2: any = [
    {
      name: '未拆柜',
      id: '0'
    },
    {
      name: '拆柜中',
      id: '1'
    },
    {
      name: '继续拆柜',
      id: '2'
    },
    {
      name: '已完成',
      id: '3'
    }
  ]
  private searchForm: any = {
    status: undefined,
    from: undefined,
    type: '2',
    loading: undefined,
    custId: undefined,
    code: undefined,
    countryId: undefined,
    warehouseId: undefined,
    comId: undefined,
    comType: '',
    orderType: '0',
    orderTime: []
  }
  private title = '仓库信息'
  private selectForm: any = {}
  private page: number = 1
  private size: number = 10
  private total: any = 0

  private typeList = [
    // { name: '一件代发', id: '0' },
    { name: '仓储', id: '1' },
    { name: '散收拼货', id: '2' },
    { name: '拆柜打托', id: '3' }
  ]
  private statusList = []
  private loadList = [
    { name: '托盘', id: '0' },
    { name: '箱子', id: '1' },
    { name: '家具等超大件', id: '2' }
  ]
  private warehouseList: any[] = []
  private customerList: any[] = []
  private supplierList: any[] = []
  private agentList: any[] = []
  private companyList: any[] = []
  private countryList: any[] = []

  /* computed */
  // 所属公司id
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

  /* methods */
  private showFinancial(row: any) {
    this.detailShow = 'f'
    const root: any = this.$refs.financial
    root.show(row, this.searchForm.orderType)
  }
  private showPrint(type: any) {
    this.printType = type
    this.printShow = true
    this.printCode = ''
  }
  private printClickNew() {
    if (!this.printCode.trim()) {
      this.$message.warning('请输入原单号')
      return
    }
    const printEl: any = this.$refs.print
    printEl.printInit(this.printCode, 'm1015')
  }
  private printClick() {
    if (!this.printCode.trim()) {
      this.$message.warning('请输入原单号')
      return
    }
    this.printShow = false
    if (this.printType === '1') {
      const { href } = this.$router.resolve({
        path: `/order-file`,
        query: { code: this.printCode.trim() }
      })
      window.open(href, '_blank')
      // window.open('http://120.24.86.36:6868/demo/reportJsp/showReport.jsp?rpx=report/%E5%85%A5%E4%BB%93%E5%8D%95.rpx&ikey=' + this.printCode.trim())
    } else {
      window.open('http://120.24.86.36:6868/demo/reportJsp/showReport.jsp?rpx=report/%E9%80%81%E8%B4%A7%E5%94%9B%E5%A4%B410-15.rpx&ikey=' + this.printCode.trim())
    }
  }
  private addRemoval(row: any) {
    this.$confirm('您确认要生成拆柜任务单吗', '提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const params = {
        code: row.id
      }
      this.loading = true
      addRemoval(params).then(() => {
        this.loading = false
        this.$message.success('拆柜任务单生成成功')
        this.getTableData(1)
      }).catch(() => {
        this.loading = false
      })
    }).catch(() => {
      return false
    })
  }
  private typeChange() {
    this.tableData = []
    this.tableList = []
    this.searchForm.from = undefined
    this.$nextTick(() => {
      this.getTableData(1)
    })
  }
  private showDownDialog() {
    const express: any = this.moreObj.express || {}
    const expressExportRef: any = this.$refs.expressExport
    expressExportRef.show(express.trackingNos || '')
  }
  private handleMore(row: any) {
    this.moreObj = row
  }
  private handleCommand(command: any) {
    switch (command) {
      case '1':
        this.downZipData(this.moreObj)
        break
      case '2':
        this.downPdfData(this.moreObj, '2')
        break
      case '6':
        this.downPdfData(this.moreObj, '6')
        break
      case '3':
        // 下载指定快递标签
        this.showDownDialog()
        break
      default:
        break
    }
  }
  private downZipData(row: any) {
    if (!row.code) {
      this.$message.error('原单号不存在')
      return
    }
    getExpressOrdersZipFile({
      orderNo: row.code
    }).then((res:any) => {
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
    if (str === '2') {
      func = getExpressOrdersPdfFile
    } else if (str === '6') {
      func = getExpressOrdersPdfMosaic
    } else {
      return
    }
    func({
      orderNo: row.code
    }).then((res:any) => {
      const url = window.URL.createObjectURL(res)
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.href = url
      a.download = '快递订单' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.pdf'
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }).catch((err:any) => {
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
  private showImportOrder() {
    (this.$refs.ImportOrder as any).show()
  }
  private handleExport() {
    if (this.searchForm.type !== '2') {
      this.$message.error('仅支持散收拼货')
      return
    }
    this.excelLoading = true
    const type = (this as any).custType
    if (type === '1') { // 客户
      this.searchForm.orderType = '1'
    } else if (type === '3') { // 供应商
      this.searchForm.orderType = '0'
    }
    const { comType, orderTime, ...form }: any = this.searchForm
    const params: any = {
      ...form
    }
    if (Array.isArray(orderTime) && orderTime.length > 0) {
      params.startTime = orderTime[0]
      params.endTime = orderTime[1]
    }
    if (this.selectType === '2') {
      params.so = params.code
      delete params.code
    }
    getOrderExcel({ ...params }).then((res:any) => {
      this.excelLoading = false
      const a = document.createElement('a')
      document.body.appendChild(a)
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      const objUrl = URL.createObjectURL(blob)
      a.href = objUrl
      a.download = '仓库订单' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.xls'
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
  private async getStatusList() {
    await getStatusList().then((res: any) => {
      this.statusList = (res.data || []).map((e: any) => {
        return {
          name: e.name,
          id: e.key,
          type: e.type
        }
      }).filter((e: any) => e.type === 'WS_IN')
    }).catch(() => {
      this.statusList = []
    })
  }
  private volumesFilter(vol: any, umv: any) {
    if (umv === 'CBCM') {
      return (vol * 0.000001).toFixed(3)
    } else if (umv === 'CBM') {
      return (vol).toFixed(3)
    } else if (umv === 'CUIN') {
      return (vol * 0.0000164).toFixed(3)
    } else if (umv === 'CUFT') {
      return (vol * 0.0283168).toFixed(3)
    }
  }
  private onOrderType() {
    this.tableData = []
    this.tableList = []
    if (this.searchForm.orderType === '1') {
      this.searchForm.comType = ''
      this.searchForm.comId = ''
      this.companyList = []
    }
    if ((this as any).custType === '0') {
      this.getTableData(1)
    }
  }
  private onComType() {
    // 仅一级代理商可操作
    this.searchForm.comId = ''
    this.companyList = []
    this.tableData = []
    this.tableList = []
  }
  private onCompany() {
    this.tableData = []
    this.tableList = []
    this.getTableData(1)
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
      params.types = '04'
      func = getAgentList
    } else if (type === '0') {
      params.parentId = this.custId
      params.subtype = '1'
      params.types = '04'
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

  // 查询仓库
  private async getWarehouseList() {
    this.selectLoading = true
    const type = (this as any).custType
    if (type === '3') {
      const params = {
        model: {
          custId: (this as any).custId
        },
        page: 1,
        size: 9999
      }
      await getWHList(params)
        .then((res: any) => {
          const data = res.data || {}
          this.warehouseList = data.result || []
          this.selectLoading = false
        })
        .catch((err: any) => {
          this.selectLoading = false
          return err
        })
    } else {
      getWarehouseAllList()
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
  }

  private formmatStatus(row: any) {
    const item: any = this.statusList.find((it: any) => it.id === row.status.WS_IN) || {}
    return item.name || '--'
  }
  private formmatStatus2(row: any) {
    const item: any = this.orderStatusList2.find((it: any) => Number(it.id) === Number(row.status)) || {}
    return item.name || '--'
  }
  private formmatCode(row: any) {
    const batchBox = row.batchBox || {}
    const batchNumber = batchBox.batchNumber || []
    return batchNumber.map((e: any) => e.code).filter((e: any) => e).join(',')
  }
  private formmatType(row: any) {
    const item: any = this.typeList.find((it: any) => Number(it.id) === Number(row.type)) || {}
    return item.name || '--'
  }
  private formmatLoading(row: any) {
    const loading = row.loading || row.loadingType
    const item: any = this.loadList.find((it: any) => Number(it.id) === Number(loading)) || {}
    return item.name || '--'
  }

  private async moveOrder(row: any) {
    const [cancel, confirm] = await this.$confirm(
      `此操作将流转该订单，是否继续？`,
      '提示',
      {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(res => {
        return [null, res]
      })
      .catch(err => {
        return [err, null]
      })
    if (cancel) return
    this.loading = true
    const type = (this as any).custType
    const stype = (this as any).custSubtype
    let buyerType
    if (type === '0') {
      buyerType = '3' // 聚货通
    } else if (type === '1') {
      buyerType = '0' // 客户
    } if (type === '2' && stype === '1') {
      buyerType = '1' // 一级代理
    } else if (type === '2' && stype === '2') {
      buyerType = '2' // 二级代理
    }
    let sellerId
    let sellerName
    if (type === '0') {
      this.warehouseList.map((it: any) => {
        if (row.warehouseId === it.id) {
          sellerId = it.custId
          sellerName = it.custName
        }
      })
    } else {
      sellerId = (this as any).parentId
      sellerName = (this as any).parentName
    }
    const { id } = row
    const params: any = {
      buyerType, orderId: id, sellerId, sellerName
    }
    moveOrder(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '流转订单成功'
        })
        this.getTableData()
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
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
    this.isCustomerVisible = false
    this.isWarehouseVisible = false
    this.isLogVisible = false
    this.resetForm()
  }
  private onCustomer(row: any): void {
    this.isCustomerVisible = true
  }
  private onWarehouse(row: any): void {
    this.isWarehouseVisible = true
  }

  private viewData(row: any) {
    // 查看
    this.detailShow = 'd'
    const root: any = this.$refs.detailForm
    root.setData(row)
  }
  private deleteData(row: any) {
    const params = {
      id: row.id
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        let func = null
        if (row.type === '3') {
          func = deletePallet // 拆柜打托
        } else {
          func = deleteOrder
        }
        if (!func) return
        func(params)
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
  // 列表查询
  private getTableData(val?: any): void {
    this.loading = true
    const type = (this as any).custType
    if (type === '1') { // 客户
      this.searchForm.orderType = '1'
    } else if (type === '3') { // 供应商
      this.searchForm.orderType = '0'
    }
    const { comType, orderTime, ...form }: any = this.searchForm
    if (val) {
      this.page = val
    }
    const params: any = {
      page: this.page,
      size: this.size,
      model: {
        ...form
      }
    }
    if (Array.isArray(orderTime) && orderTime.length > 0) {
      params.model.startDate = orderTime[0]
      params.model.endDate = orderTime[1]
    }
    this.$nextTick(() => {
      if (this.searchForm.type === '3') {
        params.model.loadingType = params.model.loading
        params.model.startTime = orderTime[0]
        params.model.endTime = orderTime[1]
        if (this.selectType === '2') {
          params.model.so = params.model.code
          delete params.model.code
        }
        getPalletOrderList(params)
          .then((res: any) => {
            this.loading = false
            const data = res.data || {}
            this.tableList = data.result || []
            this.total = data.total
          })
          .catch((err: any) => {
            this.loading = false
            return err
          })
      } else {
        getOrderList(params)
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
  private async created() {
    const type = (this as any).custType
    const subType = (this as any).custSubtype
    this.searchForm.orderTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    this.loading = true
    await this.getStatusList()
    await this.getWarehouseList()
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
</style>
