<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        v-show="!detailShow"
        class="app-container"
      >
        <head-info
          info=""
          title="卡派订单"
        />
        <div class="app-panel">
          <el-row :gutter="20">
            <el-col :span="3">
              <!--<el-button
                v-if="custId === '0'"
                type="text"
                @click="toAllocationCat"
              >
                调度任务
              </el-button>-->
            </el-col>
            <el-col :span="custId === '0' ? 24 : 24">
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
                  placeholder="订单状态"
                  style="width: 100px;margin-right: 5px;"
                  size="small"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in statusList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                <el-select
                  v-model="searchForm.type"
                  placeholder="业务类型"
                  style="width: 100px;margin-right: 5px;"
                  size="small"
                  clearable
                  filterable
                  :loading="serviceLoading"
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                <el-select
                  v-model="searchForm.objective"
                  placeholder="目的地"
                  style="width: 100px;margin-right: 5px;"
                  size="small"
                  clearable
                  filterable
                  :loading="countryLoading"
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
                  v-model="searchForm.kscId"
                  placeholder="服务"
                  style="width: 100px;margin-right: 5px;"
                  size="small"
                  clearable
                  filterable
                  :loading="serviceLoading"
                  @focus="getSubtypeList"
                >
                  <el-option
                    v-for="item in kscList"
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
                  placeholder="原单号"
                  class="input-with-select"
                  style="width:200px;margin-right: 10px;"
                  size="small"
                  clearable
                />
                <el-button
                  v-permission="['kapieOrderQuery']"
                  type="primary"
                  size="small"
                  @click="loadData(1)"
                >
                  查询
                </el-button>
              </div>
            </el-col>
          </el-row>
          <div class="table-wrap">
            <el-table
              v-loading="loading"
              :data="tableData"
              height="calc(100vh - 313px)"
              style="width: 100%;margin: 10px 0;"
              border
            >
              <el-table-column
                fixed="left"
                prop="number"
                label="原单号"
                min-width="200"
                show-overflow-tooltip
              />
              <el-table-column
                fixed="left"
                prop="status"
                label="订单状态"
                min-width="80"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.status === '0'">待分配</span>
                  <span v-if="scope.row.status === '1'">已分配</span>
                  <span v-if="scope.row.status === '3'">司机已取消/已拒绝</span>
                  <span v-if="scope.row.status === '10'">已完成</span>
                  <span v-if="scope.row.status === '20'">已到场</span>
                  <span v-if="scope.row.status === '30'">已提货</span>
                  <span v-if="scope.row.status === '40'">已装车</span>
                  <span v-if="scope.row.status === '50'">完成装车</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="下单时间"
                width="160"
              />
              <el-table-column
                prop="goodsName"
                label="业务类型"
                width="120"
              />
              <el-table-column
                prop="kscName"
                label="服务"
                min-width="120"
                show-overflow-tooltip
              />
              <el-table-column
                prop="customerName"
                label="下单客户"
                min-width="150"
                show-overflow-tooltip
              />
              <el-table-column
                v-if="custType === '0'"
                prop="orderCustomerName"
                label="客户名称"
                width="150"
                show-overflow-tooltip
              />
              <el-table-column
                v-if="custType === '0'"
                prop="sellerName"
                label="供应商"
                width="150"
                show-overflow-tooltip
              />
              <el-table-column
                v-if="custType === '2'"
                prop="sellerName"
                label="服务提供商"
                width="150"
                show-overflow-tooltip
              />
              <el-table-column
                prop="delivery"
                label="提货方式"
                width="120"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.delivery === '0'">自主送货</span>
                  <span v-else-if="scope.row.delivery === '1'">上门提货</span>
                  <span v-else-if="scope.row.delivery === '2'">快递发货</span>
                  <span v-else-if="scope.row.delivery === '3'">整柜直装</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="planTime"
                label="提货日期"
                width="160"
              />
              <el-table-column
                prop="destinationCountry"
                label="目的地"
                min-width="150"
                show-overflow-tooltip
              />
              <el-table-column
                prop="pickTime"
                label="送货日期"
                width="160"
              />
              <el-table-column
                prop="remake"
                label="备注"
                min-width="150"
                show-overflow-tooltip
              />
              <el-table-column
                fixed="right"
                label="操作"
                width="150"
              >
                <template slot-scope="scope">
                  <!--<el-button
                    v-if="(scope.row.status === '0' || scope.row.status === '3') && custId === '0' && $checkPermission(['assignVehicles'])"
                    type="text"
                    size="small"
                    @click="showModal(scope.row)"
                  >
                    分配车辆
                  </el-button>-->
                  <el-button
                    v-permission="['kapieOrderGet']"
                    type="text"
                    size="small"
                    @click="showDetail(scope.row)"
                  >
                    查看
                  </el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="showVehiclesInfo(scope.row)"
                  >
                    司机信息
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
      </div>
      <div
        v-show="detailShow"
        class="app-container"
      >
        <detail
          ref="detailForm"
          :form="detailData"
          :pick-list="pickList"
          @back="detailShow = false"
        />
      </div>
      <el-dialog
        title="司机信息"
        width="1200px"
        :visible.sync="visible"
        :close-on-click-modal="false"
        @close="visible = false"
      >
        <div>
          <span>原单号：</span>
          <span>{{ vehiclesInfo.code }}</span>
        </div>
        <el-table
          :data="vehiclesInfo.list"
          style="width: 100%;margin: 10px 0;"
          border
        >
          <el-table-column
            prop="driverName"
            label="司机"
            min-width="180"
          />
          <el-table-column
            prop="cardId"
            label="车牌号"
            min-width="180"
          />
          <el-table-column
            prop="driverPhone"
            label="联系电话"
            min-width="180"
          />
          <el-table-column
            prop="createTime"
            label="接单时间"
            min-width="180"
          />
          <el-table-column
            prop="orderStatus"
            label="订单状态"
            min-width="180"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.orderStatus === '0'">待处理</span>
              <span v-if="scope.row.orderStatus === '1'">已完成</span>
              <span v-if="scope.row.orderStatus === '2'">已取消</span>
              <span v-if="scope.row.orderStatus === '3'">
                <span v-if="scope.row.presentStatus === '0' && scope.row.completeStatus === '0' && scope.row.deliveryStatus === '0'">进行中(司机未到场)</span>
                <span v-if="scope.row.presentStatus === '1' && scope.row.completeStatus === '0' && scope.row.deliveryStatus === '0'">进行中(司机已到场)</span>
                <span v-if="scope.row.presentStatus === '1' && scope.row.completeStatus === '1' && scope.row.deliveryStatus === '0'">进行中(已装车)</span>
                <span v-if="scope.row.presentStatus === '1' && scope.row.completeStatus === '1' && scope.row.deliveryStatus === '1'">进行中(运输中)</span>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getCarOrderList,
  getKscList,
  getOrderDetails,
  getVehicles
} from '@/api/orderlist-at-car'
import { getAgentList, getCustomerList } from '@/api/orderlist-at-customs'
import { UserModule } from '@/store/modules/user'
import detail from '@/views/orderlist-management/car-order/detail.vue'
import dayjs from 'dayjs'
import { getServiceSubtypeList } from '@/api/price-to-car'
import { getCountryByCustSerice } from '@/api/public'

@Component({
  name: 'carOrder',
  components: {
    detail
  }
})
export default class extends Vue {
  /* data */
  private detailData: any = {}
  private detailShow: boolean = false
  private loading: boolean = false
  private countryLoading: boolean = false
  private serviceLoading: boolean = false
  private lscLoading: boolean = false
  private selectLoading: boolean = false
  private statusList: any[] = [
    { name: '待分配', id: 0 },
    { name: '已分配', id: 1 },
    // { name: '司机已拒绝', id: 2 },
    { name: '司机已取消/已拒绝', id: 3 },
    { name: '已完成', id: 10 },
    { name: '已到场', id: 20 },
    { name: '已提货', id: 30 },
    { name: '已装车', id: 40 },
    { name: '完成装车', id: 50 }
  ]
  private countryList: any[] = []
  private typeList: any[] = []
  private kscList: any[] = []
  private tableData: any[] = []
  private companyList: any[] = []
  private orderTypeList: any[] = [
    { name: '销售订单', id: '0' },
    { name: '采购订单', id: '1' }
  ]
  private companyTypeList: any[] = [
    { id: '1', name: '客户' },
    { id: '2', name: '二级代理商' }
  ]
  private pickList: any[] = [
    { name: '自主送货', id: '0' },
    { name: '上门提货', id: '1' },
    { name: '快递发货', id: '2' },
    { name: '整柜直装', id: '3' }
  ]
  private page: number = 1
  private size: number = 10
  private total: any = 0
  private searchForm: any = {
    type: undefined,
    customerId: undefined, // 买方id
    objective: undefined, // 目的地
    sellerId: undefined, // 卖方id
    status: undefined, // 订单状态
    kscId: undefined, // 服务类型
    number: '',
    orderType: '0',
    comType: '',
    comId: '',
    orderTime: []
  }
  private visible: boolean = false
  private vehiclesInfo: any = {
    code: '',
    list: []
  }

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
  private async getSubtypeList() {
    this.selectLoading = true
    await getServiceSubtypeList({ typeId: '01' }).then((res: any) => {
      this.selectLoading = false
      if (res.success) {
        this.typeList = res.data || []
      }
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }
  private toAllocationCat() {
    this.$router.push({ name: 'allocationCat' })
  }
  private showModal(row: any) {
    const carOrderModal = this.$refs.carOrderModal as any
    const params = {
      id: row.id
    }
    this.loading = true
    getOrderDetails(params).then((res: any) => {
      this.loading = false
      if (res.success) {
        const data = res.data || {}
        carOrderModal.show(data)
      }
    }).catch(err => {
      this.loading = false
      return err
    })
  }
  private showVehiclesInfo(row: any) {
    const params = {
      cardId: row.id
    }
    this.loading = true
    getVehicles(params).then((res: any) => {
      this.loading = false
      this.vehiclesInfo = {
        code: row.number,
        list: res.data || []
      }
      this.visible = true
    }).catch(_ => {
      this.loading = false
    })
  }
  private showDetail(row: any) {
    const params = {
      id: row.id
    }
    this.loading = true
    getOrderDetails(params).then((res: any) => {
      this.loading = false
      if (res.success) {
        const data = res.data || {}
        const detailData = data.cardOrder
        const cardPackingList = data.cardPackingList || []
        this.detailData = {
          customerName: detailData.customerName,
          consignorAdd: detailData.consignorAdd,
          consignorAddPick: (cardPackingList[0] || {}).consignorAdd || detailData.warehouseAddress,
          consignorAddDetails: detailData.consignorCountry + detailData.consignorProvince + detailData.consignorCity + detailData.consignorAdd,
          warehouseAddress: detailData.warehouseAddress,
          pay: detailData.pay,
          planTime: detailData.planTime,
          remark: detailData.remark,
          consignor: detailData.consignor,
          consignorPhone: detailData.consignorPhone,
          consigneeCountry: detailData.consigneeCountry,
          consigneeProvince: detailData.consigneeProvince,
          consigneeCity: detailData.consigneeCity,
          consignorPostcode: detailData.consignorPostcode,
          harvestMan: detailData.harvestMan,
          harvestPhone: detailData.harvestPhone,
          harvestCountry: detailData.harvestCountry,
          harvestProvince: detailData.harvestProvince,
          harvestCity: detailData.harvestCity,
          harvestPostcode: detailData.harvestPostcode,
          harvestAdd: detailData.harvestAdd,
          containerType: detailData.cabinetType,
          total: detailData.total,
          cardValue: detailData.cardValue,
          currencyId: detailData.currencyId,
          weight: detailData.weight,
          volume: detailData.volume,
          umLength: detailData.umLength,
          umWeight: detailData.umWeight
        }
        this.detailShow = true
      }
    }).catch(err => {
      this.loading = false
      return err
    })
  }
  private onCompany() {
    this.tableData = []
    this.loadData(1)
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
      params.types = '01'
      func = getAgentList
    } else if (type === '0') {
      params.parentId = this.custId
      params.subtype = '1'
      params.types = '01'
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
  private onComType() {
    // 仅一级代理商可操作
    this.searchForm.comId = ''
    this.companyList = []
    this.tableData = []
  }
  private onOrderType() {
    this.tableData = []
    if (this.searchForm.orderType === '1') {
      this.searchForm.comType = ''
      this.searchForm.comId = ''
      this.companyList = []
    }
    if ((this as any).custType === '0') {
      this.loadData(1)
    }
  }
  // 获取服务类型列表
  private getKscList() {
    const params = {
      page: 1,
      size: 9999,
      model: {
        subtypeId: this.searchForm.type
      }
    }
    this.serviceLoading = true
    getKscList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.kscList = data.result || []
        this.kscList = this.kscList.filter((e: any) => {
          return e.status === '1'
        })
        this.serviceLoading = false
      })
      .catch((err: any) => {
        this.serviceLoading = false
        return err
      })
  }
  // 获取国家列表
  private getCountryList() {
    const params = {
      custId: this.custId || '',
      typeId: '01'
    }
    this.countryLoading = true
    getCountryByCustSerice(params)
      .then((res: any) => {
        this.countryList = res.data || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.countryLoading = false
        return err
      })
  }
  private loadData(arg?: number) {
    if (arg === 1) {
      this.page = 1
    }
    const type = (this as any).custType
    const orderTime = this.searchForm.orderTime
    if (type === '1') { // 客户
      this.searchForm.orderType = '1'
    } else if (type === '3') { // 供应商
      this.searchForm.orderType = '0'
    }
    if (this.searchForm.orderType === '0') { // 销售
      this.searchForm.sellerId = this.searchForm.custId
      this.searchForm.customerId = type === '3' ? '0' : this.searchForm.comId
    } else if (this.searchForm.orderType === '1') { // 采购
      this.searchForm.sellerId = ''
      this.searchForm.customerId = this.searchForm.custId
    }
    const model = {
      isTask: '1',
      type: this.searchForm.type, // 渠道
      customerId: this.searchForm.customerId, // 买方id
      objective: this.searchForm.objective, // 目的地
      sellerId: this.searchForm.sellerId, // 卖方id
      status: this.searchForm.status, // 订单状态
      kscId: this.searchForm.kscId, // 服务类型
      number: this.searchForm.number, // 原单号
      startDate: '', // 下单开始时间
      endDate: '' // 下单结束时间
    }
    if (Array.isArray(orderTime) && orderTime.length > 0) {
      model.startDate = orderTime[0] + ' 00:00:00'
      model.endDate = orderTime[1] + ' 23:59:59'
    }
    const params = {
      model,
      page: this.page,
      size: this.size
    }
    this.loading = true
    getCarOrderList(params).then((res: any) => {
      this.loading = false
      if (res.success) {
        const data = res.data || {}
        this.tableData = data.result || []
        this.total = data.total
      }
    }).catch(err => {
      this.loading = false
      return err
    })
  }
  // 分页
  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.loadData()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.loadData()
  }
  /* hooks */
  private async created() {
    const type = (this as any).custType
    const subType = (this as any).custSubtype
    this.searchForm.custId = (this as any).custId
    this.searchForm.orderTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    this.loading = true
    await this.getSubtypeList()
    this.loadData()
  }
}
</script>

<style lang="scss" scoped>
</style>
