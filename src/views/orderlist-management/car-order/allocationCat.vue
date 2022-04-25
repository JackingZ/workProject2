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
          title="调度任务"
        />
        <div class="app-panel">
          <el-row :gutter="20">
            <!--<el-col :span="3">
              <el-button
                v-permission="['allocationAdd']"
                type="text"
              >
                新建调度任务单
              </el-button>
            </el-col>-->
            <el-col :span="24">
              <div style="text-align:right;">
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
                  clearable
                  placeholder="原单号"
                  class="input-with-select"
                  style="width:200px;margin-right: 10px;"
                  size="small"
                />
                <el-button
                  v-permission="['allocationQuery']"
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
              ref="multipleTable"
              v-loading="loading"
              :data="tableData"
              height="calc(100vh - 313px)"
              style="width: 100%;margin: 10px 0;"
              border
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                fixed="left"
                type="selection"
                width="55"
              />
              <el-table-column
                fixed="left"
                prop="number"
                label="原单号"
                min-width="210"
              />
              <el-table-column
                fixed="left"
                prop="status"
                label="订单状态"
                min-width="120"
              >
                <template slot-scope="scope">
                  <span>
                    {{ (statusList.find(e => e.id === scope.row.status) || {}).name }}
                  </span>
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
                width="180"
              >
                <template slot-scope="scope">
                  <el-button
                    v-permission="['getTask']"
                    type="text"
                    size="small"
                    @click="showDetail(scope.row)"
                  >
                    查看
                  </el-button>
                  <el-button
                    v-if="custId === '0' && $checkPermission(['distributionTask'])"
                    type="text"
                    size="small"
                    @click="showModal(scope.row)"
                  >
                    分配车辆
                  </el-button>
                  <el-button
                    v-if="custId === '0' && $checkPermission(['distributionComplete'])"
                    type="text"
                    size="small"
                    @click="taskComplete(scope.row)"
                  >
                    完成
                  </el-button>
                  <!--<el-button
                    v-if="custId === '0' && $checkPermission(['thirdparty'])"
                    type="text"
                    size="small"
                    @click="thirdparty(scope.row)"
                  >
                    第三方车辆
                  </el-button>-->
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
        v-show="showPage === 'd'"
        class="app-container"
      >
        <detail
          ref="detailForm"
          :form="detailData"
          :pick-list="pickList"
          @back="showPage = 'i'"
        />
      </div>
      <div
        v-show="showPage === 'c'"
        class="app-container"
      >
        <car-order-modal
          ref="carOrderModal"
          @load="loadData"
          @back="showPage = 'i'"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getCarOrderList,
  getCountryList,
  getOrderDetails,
  taskComplete
} from '@/api/orderlist-at-car'
import { UserModule } from '@/store/modules/user'
import detail from '@/views/orderlist-management/car-order/detail.vue'
import CarOrderModal from '@/views/orderlist-management/car-order/carOrderModal.vue'
import dayjs from 'dayjs'

  @Component({
    name: 'carOrder',
    components: {
      detail,
      CarOrderModal
    }
  })
export default class extends Vue {
    /* data */
    private detailData: any = {}
    private showPage: string = 'i'
    private loading: boolean = false
    private countryLoading: boolean = false
    private serviceLoading: boolean = false
    private lscLoading: boolean = false
    private selectLoading: boolean = false
    private statusList: any[] = [
      { name: '待分配', id: '0' },
      // { name: '已分配', id: 1 },
      { name: '司机取消订单', id: '3' },
      { name: '完成调度', id: '60' }
      // { name: '已装车', id: 40 },
      // { name: '已提货', id: 30 },
      // { name: '已签收', id: 10 }
      // { name: '已完成待审核', id: 50 }
    ]
    private countryList: any[] = []
    private selectRows: any[] = []
    private tableData: any[] = []
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
      lscId: undefined, // 专线服务
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
    private taskComplete(row: any) {
      this.$confirm('您确认该任务单已完成调度吗?', '温馨提示', {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            id: row.id,
            status: '60'
          }
          this.loading = true
          taskComplete(params).then(() => {
            this.loading = false
            this.$message.success('操作成功')
            this.loadData(1)
          }).catch(() => {
            this.loading = false
          })
        })
        .catch(() => {
          return false
        })
    }
    private thirdparty(row: any) {
      // 第三方车辆
    }
    private handleSelectionChange(val: any) {
      // this.$refs.multipleTable.clearSelection()
      this.selectRows = val
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
          this.showPage = 'c'
          const data = res.data || {}
          carOrderModal.show(data)
        }
      }).catch(err => {
        this.loading = false
        return err
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
          this.showPage = 'd'
        }
      }).catch(err => {
        this.loading = false
        return err
      })
    }

    // 获取国家列表
    private getCountryList() {
      this.countryLoading = true
      getCountryList()
        .then((res: any) => {
          const data = res.data || {}
          this.countryList = data.result || []
          this.countryLoading = false
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
      const orderTime = this.searchForm.orderTime
      const model = {
        isTask: '0',
        lscId: this.searchForm.lscId, // 渠道
        customerId: '', // 买方id
        objective: this.searchForm.objective, // 目的地
        sellerId: '', // 卖方id
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
    private created(): void {
      if (this.custId !== '0') {
        this.$router.replace('404')
      }
      this.searchForm.orderTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
      this.loadData()
    }
}
</script>

<style lang="scss" scoped>
</style>
