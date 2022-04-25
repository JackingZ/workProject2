<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        v-show="pageName === 'index'"
        v-loading="loading"
        class="app-container"
      >
        <head-info
          info=""
          title="订单派送"
        />
        <div class="app-panel">
          <el-row>
            <el-col :span="3">
              <el-button
                v-permission="['orderDeliveryAdd']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin: 0 10px;"
                @click="addRow"
              >
                新增
              </el-button>
            </el-col>
            <el-col
              :span="21"
              style="text-align:right;"
            >
              <el-select
                v-model="searchForm.transport"
                size="small"
                style="width: 100px;margin-right: 5px;"
                placeholder="业务类型"
                filterable
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
                :disabled="!searchForm.transport"
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
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="searchForm.warehouseId"
                :loading="selectLoading"
                :disabled="!searchForm.countryId"
                placeholder="提柜仓库"
                clearable
                filterable
                size="small"
                style="width: 130px;margin-right: 5px;"
                @focus="getWarehouseList"
              >
                <el-option
                  v-for="item in warehouseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="searchForm.ifOrder"
                size="small"
                style="width: 100px;margin-right: 5px;"
                placeholder="是否下单"
                filterable
                clearable
              >
                <el-option
                  label="是"
                  value="1"
                />
                <el-option
                  label="否"
                  value="0"
                />
              </el-select>
              <el-select
                v-model="searchForm.status"
                size="small"
                style="width: 100px;margin-right: 5px;"
                placeholder="状态"
                filterable
                clearable
              >
                <el-option
                  v-for="item in carStatusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-date-picker
                v-model="searchForm.orderTime"
                clearable
                unlink-panels
                type="daterange"
                align="right"
                size="small"
                value-format="yyyy-MM-dd"
                range-separator="~"
                style="width:240px;margin-right:5px;"
                start-placeholder="提货起始时间"
                end-placeholder="提货截止时间"
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
                    v-show="searchForm.transport === '1' || searchForm.transport === '2'"
                    label="柜号"
                    value="2"
                  />
                  <el-option
                    v-show="searchForm.transport === '0'"
                    label="提单号"
                    value="3"
                  />
                </el-select>
              </el-input>
              <el-button
                v-permission="['orderDeliveryQuery']"
                type="primary"
                size="small"
                @click="queryAll(1)"
              >
                查询
              </el-button>
            </el-col>
          </el-row>

          <el-table
            ref="table"
            :data="tableData"
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
              prop=""
              label="目的国"
              min-width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.country || {}).value }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="提货仓库"
              min-width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.warehouse || {}).name }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="车型"
              width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.car || {}).value }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="仓库供应商"
              width="160"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.warehouse || {}).custName }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="卡车供应商"
              width="160"
            >
              <template slot-scope="scope">
                {{ (scope.row.supply || {}).name }}
              </template>
            </el-table-column>
            <el-table-column
              prop="total"
              label="总票数"
              width="100"
            />
            <el-table-column
              prop="count"
              label="总件数"
              width="100"
            />
            <el-table-column
              prop=""
              label="总体积"
              min-width="120"
            >
              <template slot-scope="scope">
                {{ scope.row.volume + scope.row.volumeUnit }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="总重量"
              min-width="120"
            >
              <template slot-scope="scope">
                {{ scope.row.weight + scope.row.weightUnit }}
              </template>
            </el-table-column>
            <el-table-column
              prop="time"
              label="提货时间"
              width="180"
            />
            <el-table-column
              prop=""
              label="是否下单"
              min-width="120"
            >
              <template slot-scope="scope">
                {{ scope.row.ifOrder === 1 ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="状态"
              min-width="120"
            >
              <template slot-scope="scope">
                {{ (carStatusList.find(e => e.id === scope.row.status) || {}).name }}
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
              width="150"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['orderDeliveryDetails']"
                  type="text"
                  size="medium"
                  @click="viewRow(scope.row)"
                >
                  查看
                </el-button>
                <el-button
                  v-permission="['orderDeliveryEdit']"
                  type="text"
                  size="medium"
                  @click="editRow(scope.row)"
                >
                  编辑
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
      <add-form
        v-show="pageName === 'form'"
        ref="addForm"
        :order-status-list="orderStatusList"
        @goBack="goBack"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import addForm from '@/views/operation-management/order-delivery/components/addForm.vue'
import {
  getWarehouseList,
  getServiceSubtypeList,
  getCountryList,
  getDeliveryOrder
} from '@/api/order-delivery'
import { getStatusList } from '@/api/public'
import dayjs from 'dayjs'

@Component({
  name: 'index',
  components: {
    addForm
  }
})
export default class extends Vue {
  /* data */
  private pageName: string = 'index'
  private loading: boolean = false
  private selectLoading: boolean = false
  private searchForm: any = {
    ifOrder: '',
    status: '',
    transport: '0',
    orderTime: [],
    codeType: '1',
    code: undefined,
    countryId: undefined,
    warehouseId: undefined
  }
  private warehouseList: any[] = []
  private typeList: any[] = []
  private countryList: any[] = []
  private tableData: any[] = []
  private orderStatusList: any[] = []
  private page: number = 1
  private size: number = 10
  private total: any = 0
  /* computed */
  get userInfo(): any {
    return UserModule.info || {}
  }
  get carStatusList(): any[] {
    return this.orderStatusList.filter((e: any) => e.type === 'TRUCK')
  }
  /* methods */
  private getStatusList() {
    getStatusList().then((res: any) => {
      this.orderStatusList = (res.data || []).map((e: any) => {
        return {
          name: e.name,
          id: e.key,
          type: e.type
        }
      })
    }).catch(() => {
      this.orderStatusList = []
    })
  }
  private addRow() {
    this.pageName = 'form'
    this.$nextTick(() => {
      const root: any = this.$refs.addForm
      root.add()
    })
  }
  private viewRow(row: any) {
    this.pageName = 'form'
    this.$nextTick(() => {
      const root: any = this.$refs.addForm
      root.view(row)
    })
  }
  private editRow(row: any) {
    this.pageName = 'form'
    this.$nextTick(() => {
      const root: any = this.$refs.addForm
      root.edit(row)
    })
  }
  private goBack(type?: any) {
    this.pageName = 'index'
    if (type === 1) {
      this.queryAll()
    }
  }
  private queryAll(val?: any) {
    const { orderTime, codeType, code, ...form } = this.searchForm
    this.loading = true
    if (val) {
      this.page = val
    }
    const params: any = {
      model: {
        ...form,
        code: codeType === '1' ? code : undefined,
        billNo: codeType === '3' ? code : undefined,
        containerNo: codeType === '2' ? code : undefined,
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
    getDeliveryOrder(params)
      .then((res: any) => {
        const data = res.data || {}
        this.tableData = data.result || []
        this.$nextTick(() => {
          const root: any = this.$refs.table
          root.doLayout() // 解决表格错位
        })
        this.total = data.total
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.queryAll()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.queryAll()
  }

  private formatType(row: any) {
    if (row.transport === '0') {
      return '空运'
    } else if (row.transport === '1') {
      return '海运'
    } else if (row.transport === '2') {
      return '铁路'
    } else if (row.transport === '4') {
      return '卡航'
    }
  }
  private onType() {
    this.searchForm.countryId = undefined
    this.searchForm.warehouseId = undefined
  }
  private onTargetCountry() {
    this.searchForm.warehouseId = undefined
  }
  private async getSubtypeList() {
    const params = {
      typeId: '05'
    }
    await getServiceSubtypeList(params).then((res: any) => {
      this.typeList = res.data || []
      this.searchForm.transport = (this.typeList[0] || {}).id
    }).catch(() => {
      this.typeList = []
    })
  }
  private getCountryList() {
    this.selectLoading = true
    getCountryList({ typeId: '05', subtypeId: this.searchForm.transport }).then((res: any) => {
      this.countryList = res.data || []
      this.selectLoading = false
    }).catch(() => {
      this.selectLoading = false
      this.countryList = []
    })
  }
  private getWarehouseList() {
    const params = {
      model: {
        countryId: this.searchForm.countryId,
        custId: '0'
      },
      page: 1,
      size: 999
    }
    this.selectLoading = true
    getWarehouseList(params).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      this.warehouseList = data.result || []
    }).catch(() => {
      this.selectLoading = false
      this.warehouseList = []
    })
  }
  /* hooks */
  private async created() {
    this.loading = true
    // this.searchForm.orderTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    this.getStatusList()
    try {
      await this.getSubtypeList()
      this.queryAll()
    } catch (error) {
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
