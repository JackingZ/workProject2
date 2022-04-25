<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        v-show="showPage === 'i'"
        class="app-container"
      >
        <head-info
          info=""
          title="代客下单"
        />
        <div class="app-panel">
          <div style="text-align:right;">
            <el-select
              v-model="searchForm.comId"
              :loading="selectLoading"
              size="small"
              style="width:130px;margin-right:5px;"
              placeholder="所属客户"
              filterable
              clearable
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
                v-for="item in lineStatusList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-select
              v-model="searchForm.salesmanStatus"
              placeholder="录单状态"
              size="small"
              clearable
              style="width:100px;margin-right:5px;"
            >
              <el-option
                label="未录单"
                value="0"
              />
              <el-option
                label="已录单"
                value="1"
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
              @change=";(searchForm.lscId = undefined)"
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
              <el-select
                slot="prepend"
                v-model="selectType"
                size="small"
                style="width:90px;"
                placeholder="请选择"
              >
                <el-option
                  label="原单号"
                  value="1"
                />
                <!-- <el-option
                  label="业务编码"
                  value="2"
                />
                <el-option
                  label="备注"
                  value="3"
                /> -->
              </el-select>
            </el-input>
            <el-button
              v-permission="['salesmanOrderQuery']"
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
                  原单号：{{ scope.row.code }}
                </div>
              </div>
            </el-table-column>
            <el-table-column
              label="录单状态"
              width="120"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.salesmanStatus === '0'">未录单</span>
                <span v-else-if="scope.row.salesmanStatus === '1'">已录单</span>
              </template>
            </el-table-column>
            <el-table-column
              label="报关方式"
              width="120"
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
              width="120"
            >
              <template slot-scope="scope">
                {{ (pickList[(scope.row.supplement || {}).pickType] || {}).name }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="custType === '0'"
              label="客户名称"
              min-width="180"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span
                  style="color: #1890ff;"
                >
                  {{ (scope.row.orderCustomer || {}).name }}
                </span>
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
                {{ scope.row.value + ' ' + (scope.row.currency || {}).key }}
              </template>
            </el-table-column>
            <el-table-column
              label="审核状态"
              width="120"
            >
              <template slot-scope="scope">
                <div class="audit-wrap">
                  <span
                    v-if="scope.row.audit === '2'"
                    class="audit"
                    :title="scope.row.reason"
                  />
                  {{ formmatAudit(scope.row) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="订单状态"
              width="120"
            >
              <template slot-scope="scope">
                {{ (statusList.find(e => e.id === scope.row.status['LINE']) || {name: '--'}).name }}
              </template>
            </el-table-column>
            <el-table-column
              label="入库状态"
              width="120"
            >
              <template slot-scope="scope">
                {{ (statusList.find(e => e.id === scope.row.status['WS_IN']) || {name: '--'}).name }}
              </template>
            </el-table-column>
            <el-table-column
              label="出库状态"
              width="120"
            >
              <template slot-scope="scope">
                {{ (statusList.find(e => e.id === scope.row.status['WS_OUT']) || {name: '--'}).name }}
              </template>
            </el-table-column>
            <el-table-column
              label="计量状态"
              width="120"
            >
              <template slot-scope="scope">
                {{ (statusList.find(e => e.id === scope.row.status['MEASURE']) || {name: '--'}).name }}
              </template>
            </el-table-column>
            <el-table-column
              label="验货状态"
              width="120"
            >
              <template slot-scope="scope">
                {{ (statusList.find(e => e.id === scope.row.status['EXAMINE']) || {name: '--'}).name }}
              </template>
            </el-table-column>
            <el-table-column
              label="报关状态"
              width="120"
            >
              <template slot-scope="scope">
                <span>
                  {{ (statusList.find(e => e.id === scope.row.status['CUSTOM_DECLARATION']) || {name: '--'}).name }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="快递单号"
              width="120"
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
                  >
                    已出
                  </el-button>
                </el-popover>
                <span v-else>未出</span>
              </template>
            </el-table-column>
            <el-table-column
              label="账单"
              min-width="100"
            >
              --
            </el-table-column>
            <el-table-column
              label="付款"
              min-width="100"
            >
              --
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="250"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="viewData(scope.row)"
                >
                  查看
                </el-button>
                <el-button
                  v-if="scope.row.salesmanStatus === '0'"
                  v-permission="['salesmanOrderInput']"
                  type="text"
                  @click="salesmanOrder(scope.row)"
                >
                  录单
                </el-button>
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
      <div
        v-show="showPage === 'd'"
        class="app-container"
      >
        <detail
          ref="detailForm"
          :line-list="privatelineList"
          :pick-list="pickList"
          :type-list="typeList"
          :ware-list="warehouseList"
          @back="showPage = 'i'"
        />
      </div>
      <div
        v-show="showPage === 's'"
        class="app-container"
      >
        <salesman
          ref="salesman"
          @back="showPage = 'i'"
          @load="getTableData"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getOrderList,
  getCustomerList,
  getFbastoreList,
  getLscComplicatedList
} from '@/api/orderlist-at-whole'
import dayjs from 'dayjs'
import { getStatusList, getCountryByCustSerice } from '@/api/public'
import detail from '@/views/orderlist-management/salesman-order/detail.vue'
import salesman from '@/views/orderlist-management/salesman-order/salesman.vue'

@Component({
  name: 'salesmanOrder',
  components: {
    detail,
    salesman
  },
  props: {}
})
export default class extends Vue {
  private searchForm: any = {
    salesmanStatus: undefined,
    status: undefined,
    audit: undefined,
    type: undefined,
    lscId: undefined,
    custId: undefined,
    code: undefined,
    countryId: undefined,
    fbastoreId: undefined,
    comId: undefined,
    agentId: undefined,
    comType: '',
    orderType: '0',
    orderTime: []
  }
  private selectLoading: boolean = false
  private loading: boolean = false
  private showPage: any = 'i'
  private pickList: any[] = [
    { name: '自主送货', id: '0' },
    { name: '上门提货', id: '1' },
    { name: '快递发货', id: '2' },
    { name: '整柜直装', id: '3' }
  ]
  private companyList: any[] = []
  private statusList: any[] = []
  private countryList: any[] = []
  private warehouseList: any[] = []
  private privatelineList: any[] = []
  private tableData: any[] = []
  private selectType: any = '1'
  private typeList = [
    { name: '空运', id: '0' },
    { name: '海运', id: '1' },
    { name: '铁路', id: '2' },
    { name: '快递', id: '3' },
    { name: '卡航', id: '4' }
  ]
  private page = 1
  private size = 10
  private total = 10

  get lineStatusList(): any[] {
    return this.statusList.filter((e: any) => e.type === 'LINE')
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

  private viewData(row: any) {
    // 查看
    this.showPage = 'd'
    const root: any = this.$refs.detailForm
    root.setData(row)
  }
  private salesmanOrder(row: any) {
    // 录单
    this.showPage = 's'
    const root: any = this.$refs.salesman
    root.show(row)
  }
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
  private getCompanyList() {
    const params: any = {
      custIds: [(this as any).custId]
    }
    this.selectLoading = true
    getCustomerList(params).then((res:any) => {
      const data = res.data || []
      this.companyList = data
      this.selectLoading = false
    }).catch((err:any) => {
      this.selectLoading = false
      return err
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
      })
    }).catch(() => {
      this.statusList = []
    })
  }
  private getTableData(val?: any): void {
    this.loading = true
    const type = (this as any).custType
    if (type === '1') { // 客户
      this.searchForm.orderType = '1'
    }
    const { comId, agentId, comType, orderType, custId, orderTime, ...form }: any = this.searchForm
    if (val) {
      this.page = val
    }
    const params: any = {
      ...form,
      salesman: true
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
      model: params
    }
    getOrderList(model)
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
  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.getTableData()
  }
  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.getTableData()
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
    }
  }
  .audit-wrap{
    display: flex;
    align-items: center;
    .audit{
      width: 6px;
      height: 6px;
      background: #E12E2E;
      border-radius: 50%;
      margin-right: 5px;
    }
  }
</style>
