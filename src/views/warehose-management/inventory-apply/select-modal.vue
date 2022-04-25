<template>
  <el-dialog
    :title="inventoryType === 0 ? '请选择订单' : '请选择库位'"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    top="10vh"
    :width="inventoryType === 0 ? '80%' : '500px'"
    @close="reset"
  >
    <div v-if="inventoryType === 0">
      <el-row style="text-align: right">
        <el-col :span="24">
          <div style="text-align:right;">
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
              v-model="searchForm.custName"
              placeholder="客户名称"
              class="input-with-select"
              style="width:240px;margin-right: 10px;"
              size="small"
              clearable
            />
            <el-input
              v-model="searchForm.code"
              placeholder="原单号"
              class="input-with-select"
              style="width:240px;margin-right: 10px;"
              size="small"
              clearable
            />
            <el-button
              type="primary"
              size="small"
              @click="getTableData(1)"
            >
              查询
            </el-button>
          </div>
        </el-col>
      </el-row>
      <el-table
        v-if="show"
        ref="inventoryOrderTable"
        v-loading="orderListLoading"
        :data="tableList"
        height="500px"
        :row-key="rowKey"
        style="width: 100%;margin: 10px 0;"
        border
      >
        <el-table-column
          fixed="left"
          width="55"
        >
          <template slot="header">
            <el-checkbox
              :checked="checked"
              :indeterminate="indeterminate"
              @change="selectAllOrder"
            />
          </template>
          <template slot-scope="scope">
            <el-checkbox
              :checked="selectOrderList.some(e => e.code === scope.row.code)"
              @change="(val) => selectOrder(val, scope.row)"
            />
          </template>
        </el-table-column>
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
          <template>
            <span>
              {{ searchForm.warehouseName }}
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
      </el-table>
      <el-pagination
        :current-page.sync="pagination.page"
        :page-size="pagination.size"
        layout="total, prev, pager, next"
        :total="pagination.total"
        style="text-align: right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <div
      v-if="inventoryType === 1"
      style="height: calc(100vh - 360px);overflow-y: auto"
    >
      <el-tree
        ref="tree"
        v-loading="orderListLoading"
        :data="tableList"
        node-key="code"
        show-checkbox
      >
        <span
          slot-scope="scope"
          style="width: 100%;display: flex;justify-content: space-between;padding-right: 5px"
        >
          <span>{{ scope.data.code }}</span>
          <span>
            <span>
              {{ (slTypeList.find(e => e.id === scope.data.type) || {}).name }}
            </span>
            <span v-if="scope.data.level === 1">
              ({{ (binTypeList.find((it) => it.id === scope.data.binType) || {}).name }})
            </span>
          </span>
        </span>
      </el-tree>
    </div>
    <div
      slot="footer"
      style="text-align: right;"
    >
      <el-button
        size="small"
        @click="cancelSelectOrder"
      >
        取 消
      </el-button>
      <el-button
        type="primary"
        size="small"
        @click="saveSelectOrder"
      >
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getStatusList } from '@/api/public'
import dayjs from 'dayjs'
import {
  getSLTree,
  queryUnloadOrder
} from '@/api/warehose-by-config'

@Component({
  name: 'select-modal'
})
export default class extends Vue {
  /* data */
  private indeterminate: boolean = false
  private show: boolean = true
  private checked: boolean = false
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  private orderListLoading: boolean = false
  private selectLoading: boolean = false
  private visible: boolean = false
  private companyList: any[] = []
  private tableList: any[] = []
  private statusList: any[] = []
  private selectOrderList: any[] = []
  private typeList: any[] = [
    { name: '仓储', id: '1' },
    { name: '散收拼货', id: '2' }
  ]
  private slTypeList: any[] = [
    { name: '库区', id: '1' },
    { name: '巷道', id: '2' },
    { name: '货架', id: '3' },
    { name: '层', id: '4' },
    { name: '格子', id: '5' }
  ]
  private loadList = [
    { name: '托盘', id: '0' },
    { name: '箱子', id: '1' },
    { name: '家具等超大件', id: '2' }
  ]
  private searchForm: any = {
    warehouseId: '',
    warehouseName: '',
    orderTime: [],
    code: '',
    custName: ''
  }
  private binTypeList: any[] = [
    { name: '计量区', id: 1 },
    { name: '问题件区', id: 2 },
    { name: '验货区', id: 3 },
    { name: '待出库区', id: 4 },
    { name: '补货区', id: 5 },
    { name: '存储区', id: 20 }
  ]
  private inventoryType: any = ''

  /* 方法 */
  private reset() {
    this.checked = false
    this.indeterminate = false
    this.inventoryType = ''
    this.visible = false
    this.pagination = {
      page: 1,
      size: 10,
      total: 0
    }
    this.tableList = []
    this.selectOrderList = []
    this.searchForm = {
      warehouseId: '',
      warehouseName: '',
      orderTime: [],
      code: '',
      custName: ''
    }
  }
  private getParents(children: any) {
    const tableList = this.tableList
    const parents: any[] = []
    function getParents(obj: any[], id: any) {
      if (obj.length) {
        obj.forEach((item: any) => {
          if (item.children && item.children.length) {
            if (item.children.some((row: any) => row.id === id)) {
              parents.unshift(item)
              getParents(tableList, item.id)
            } else {
              getParents(item.children, id)
            }
          }
        })
      }
    }
    getParents(tableList, children.id)
    return parents
  }

  private selectOrder(checked: any, row: any) {
    if (checked) {
      this.selectOrderList.push(row)
    } else {
      this.selectOrderList = this.selectOrderList.filter((e: any) => e.code !== row.code)
    }
    this.handleSelectionChange(this.selectOrderList)
  }

  private handleSelectionChange(val: any[]) {
    this.selectOrderList = val.reduce((list: any[], next: any) => {
      if (!list.find((e: any) => e.code === next.code)) {
        list.push(next)
      }
      return list
    }, [])
    if (this.inventoryType === 0) {
      this.checkAllFun()
    }
  }

  private checkAllFun() {
    this.show = false
    const list: any[] = this.selectOrderList.filter((e: any) => {
      return this.tableList.find((t: any) => t.code === e.code)
    })
    if (this.selectOrderList.length === 0) {
      this.checked = false
      this.indeterminate = false
    } else {
      if (list.length === this.tableList.length) {
        this.checked = true
        this.indeterminate = false
      } else {
        this.checked = false
        this.indeterminate = true
      }
    }
    this.$nextTick(() => {
      this.show = true
    })
  }

  private selectAllOrder(val: any) {
    if (val) {
      this.selectOrderList = [...this.selectOrderList, ...this.tableList]
    } else {
      this.selectOrderList = this.selectOrderList.filter((e: any) => {
        return !this.tableList.find((t: any) => t.code === e.code)
      })
    }
    this.handleSelectionChange(this.selectOrderList)
  }

  private saveSelectOrder() {
    if (this.inventoryType === 1) {
      const t: any = this.$refs.tree
      const keys: any[] = t.getCheckedNodes()
      // const arr: any[] = keys.reduce((list: any, next: any) => {
      //   if (!list.find((e: any) => e.parentId === next.parentId)) {
      //     list.push(next)
      //   }
      //   return list
      // }, [])
      // let parents: any[] = []
      // arr.forEach((e: any) => {
      //   parents = [...parents, ...this.getParents(e)]
      // })
      // this.handleSelectionChange([...keys, ...parents])
      this.handleSelectionChange(keys)
    }
    if (this.inventoryType === 0 && !this.selectOrderList.length) {
      this.$message.error('请选择订单')
      return
    }
    if (this.inventoryType === 1 && !this.selectOrderList.length) {
      this.$message.error('请选择库位')
      return
    }
    this.$emit('save', this.selectOrderList)
    this.reset()
  }

  private cancelSelectOrder() {
    this.visible = false
    this.reset()
  }

  private rowKey(row: any) {
    return row.code
  }

  private getTableData(val?: any): void {
    this.orderListLoading = true
    const { orderTime, ...form }: any = this.searchForm
    if (val) {
      this.pagination.page = val
    }
    const params: any = {
      page: this.pagination.page,
      size: this.pagination.size,
      model: {
        ...form
      }
    }
    if (Array.isArray(orderTime) && orderTime.length > 0) {
      params.model.startTime = orderTime[0]
      params.model.endTime = orderTime[1]
    }
    queryUnloadOrder(params)
      .then((res: any) => {
        this.orderListLoading = false
        const data = res.data || {}
        this.tableList = data.result || []
        this.pagination.total = data.total
        this.checkAllFun()
      })
      .catch((err: any) => {
        this.tableList = []
        this.pagination.total = 0
        this.orderListLoading = false
        return err
      })
  }

  private handleSizeChange(val: string) {
    this.pagination.size = Number(val)
    this.getTableData()
  }

  private handleCurrentChange(val: string) {
    this.pagination.page = Number(val)
    this.getTableData()
  }

  private formmatStatus(row: any) {
    const item: any = this.statusList.find((it: any) => it.id === (row.status || {}).WS_IN) || {}
    return item.name || '--'
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

  private async selectOrderClick(inventoryType: any, warehouse: any, selectOrderList: any) {
    this.inventoryType = inventoryType
    this.searchForm.warehouseId = warehouse.id
    this.searchForm.warehouseName = warehouse.name
    this.selectOrderList = selectOrderList
    if (!this.searchForm.warehouseId) {
      this.$message.warning('请选择盘点仓库')
      return
    }
    this.visible = true
    if (inventoryType === 0) {
      // 按订单，选择订单
      await this.getStatusList()
      this.$nextTick(() => {
        const t: any = this.$refs.inventoryOrderTable
        t && t.clearSelection && t.clearSelection()
        this.$nextTick(() => {
          setTimeout(() => {
            this.searchForm.orderTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
            this.getTableData()
          }, 200)
        })
      })
    }
    if (inventoryType === 1) {
      const list: any[] = this.selectOrderList
      this.getSLTree(list)
    }
  }

  private getSLTree(list: any[]) {
    this.orderListLoading = true
    const params: any = {
      warehouseId: this.searchForm.warehouseId,
      id: '0'
    }
    getSLTree(params)
      .then((res: any) => {
        const { data } = res
        this.tableList = data || []
        this.orderListLoading = false
        this.$nextTick(() => {
          const t: any = this.$refs.tree
          t && t.setCheckedNodes(list.filter((e: any) => e.children.length === 0))
        })
      })
      .catch((err: any) => {
        this.orderListLoading = false
        return [err, null]
      })
  }
}
</script>

<style lang="scss" scoped>
  .detail-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    padding: 20px 20px 0 20px;
    span{
      font-size: 20px;
      font-weight: bold;
      color: #323232;
    }
  }

  .order-detail{
    height: calc(100vh - 170px);
    overflow-y: auto;
  }
</style>
