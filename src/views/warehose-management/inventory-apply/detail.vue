<template>
  <div
    v-loading="saveing"
    class="app-container"
  >
    <div class="detail-header">
      <span>盘点内容</span>
      <el-button
        size="small"
        @click="goBack"
      >
        返回
      </el-button>
    </div>
    <div class="app-panel order-detail">
      <div style="padding-bottom: 12px;border-bottom: 5px solid #F2F3F5">
        <span style="font-size: 14px;color: #303133;margin-right: 10px">盘点方式</span>
        <el-radio-group
          v-model="inventoryType"
          size="small"
          @change="handeChange('type')"
        >
          <el-radio-button
            v-for="item in inventoryTypeList"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
        <span style="font-size: 14px;color: #303133;margin-left: 65px;margin-right: 10px">盘点仓库</span>
        <el-select
          v-model="searchForm.warehouseId"
          :loading="selectLoading"
          size="small"
          style="width: 130px;"
          placeholder="仓库"
          clearable
          filterable
          @change="handeChange('warehouse')"
        >
          <el-option
            v-for="item in warehouseList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <span
          v-if="[0, 1].includes(inventoryType)"
          style="font-size: 14px;color: #303133;margin-left: 65px;margin-right: 10px"
        >
          {{ inventoryType === 0 ? '选择订单' : '选择库位' }}
        </span>
        <el-button
          v-if="inventoryType === 0"
          type="text"
          size="small"
          @click="selectOrderClick(0)"
        >
          {{ selectOrderList.length ? `已选择(${selectOrderList.length})` : '请选择订单' }}
        </el-button>
        <el-button
          v-if="inventoryType === 1"
          type="text"
          size="small"
          @click="selectOrderClick(1)"
        >
          {{ selectOrderList.length ? `已选择(${selectOrderList.length})` : '请选择库位' }}
        </el-button>
        <el-button
          v-if="inventoryType === 2"
          type="primary"
          size="small"
          style="margin-left: 65px"
          @click="generateInventory"
        >
          生成盘点
        </el-button>
      </div>
      <el-row style="padding: 16px 0">
        <el-col :span="3">
          <span style="font-size: 14px;color: #909399">总票数：</span>
          <span style="font-size: 14px;color: #303133">{{ generateInventoryData.totalNumber }}</span>
        </el-col>
        <el-col :span="3">
          <span style="font-size: 14px;color: #909399">总件数：</span>
          <span style="font-size: 14px;color: #303133">{{ generateInventoryData.totalPackages }}</span>
        </el-col>
        <el-col :span="3">
          <span style="font-size: 14px;color: #909399">总托数：</span>
          <span style="font-size: 14px;color: #303133">{{ generateInventoryData.totalPallet }}</span>
        </el-col>
      </el-row>
      <el-table
        v-loading="loading"
        :data="tableData"
        height="calc(100vh - 400px)"
        style="width: 100%;margin-bottom: 10px"
        border
      >
        <el-table-column
          prop="originalNo"
          label="原单号"
          min-width="140px"
        />
        <el-table-column
          prop="palletNo"
          label="托盘ID"
          min-width="140px"
        />
        <el-table-column
          prop="binType"
          label="库位类型"
          min-width="140px"
        >
          <template slot-scope="scope">
            {{ (binTypeList1.find(e => e.value === scope.row.binType) || {}).label || '--' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="binNo"
          label="库位编码"
          min-width="140px"
        />
        <el-table-column
          prop="num"
          label="件数"
          min-width="140px"
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
      <div
        style="text-align: right;"
      >
        <el-button
          size="small"
          @click="goBack"
        >
          取 消
        </el-button>
        <el-button
          v-permission="['inventoryApplyEdit', 'inventoryApplyAdd']"
          type="primary"
          size="small"
          @click="saveInventory"
        >
          保 存
        </el-button>
      </div>
    </div>
    <select-modal
      ref="selectModal"
      @save="saveSelectOrder"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  generateInventory,
  saveInventory,
  getInventoryById,
  updateInventory
} from '@/api/warehose-by-config'
import selectModal from '@/views/warehose-management/inventory-apply/select-modal.vue'

@Component({
  name: 'detail',
  components: {
    selectModal
  },
  props: {
    inventoryTypeList: {
      type: Array,
      default: () => ([])
    },
    warehouseList: {
      type: Array,
      default: () => ([])
    }
  }
})
export default class extends Vue {
  /* data */
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  private row: any = {}
  private binTypeList1: any[] = [
    {
      value: 1,
      label: '库区'
    },
    {
      value: 2,
      label: '巷道'
    },
    {
      value: 3,
      label: '货架'
    },
    {
      value: 4,
      label: '层'
    },
    {
      value: 5,
      label: '格子'
    }
  ]
  private loading: boolean = false
  private saveing: boolean = false
  private selectLoading: boolean = false
  private generateInventoryData: any = {}
  private selectOrderList: any[] = []
  private searchForm: any = {
    warehouseId: '',
    warehouseName: ''
  }
  private inventoryType: any = ''

  get tableData() {
    const data: any[] = this.generateInventoryData.orderBoxDtos || []
    return data.slice((this.pagination.page - 1) * this.pagination.size, (this.pagination.page) * this.pagination.size)
  }
  /* 方法 */
  private handleSizeChange(val: string) {
    this.pagination.size = Number(val)
  }
  private handleCurrentChange(val: string) {
    this.pagination.page = Number(val)
  }
  private handeChange() {
    this.selectOrderList = []
    const warehouse = (this as any).warehouseList.find((e: any) => e.id === this.searchForm.warehouseId)
    this.searchForm = {
      orderType: '0',
      comId: '',
      type: '2',
      comType: '',
      status: '',
      from: '',
      warehouseId: this.searchForm.warehouseId,
      warehouseName: warehouse ? warehouse.name : '',
      orderTime: [],
      code: ''
    }
    this.generateInventoryData = {}
  }

  private goBack() {
    this.$emit('back', false)
  }

  private generateInventory() {
    if (this.inventoryType === '') {
      this.$message.error('请选择盘点方式')
      return
    }
    if (this.inventoryType === 0 && !this.selectOrderList.length) {
      this.$message.error('请选择订单')
      return
    }
    if (this.inventoryType === 1 && !this.selectOrderList.length) {
      this.$message.error('请选择库位')
      return
    }
    if (this.inventoryType === 2 && !this.searchForm.warehouseId) {
      this.$message.error('请选择仓库')
      return
    }
    const params: any = {
      inventoryType: this.inventoryType,
      codes: [],
      binNos: [],
      warehouseId: this.searchForm.warehouseId
    }
    if (this.inventoryType === 0) {
      params.codes = this.selectOrderList.map((e: any) => e.code)
    }
    if (this.inventoryType === 1) {
      params.binNos = this.selectOrderList.map((e: any) => e.cid)
      // params.binCid = this.selectOrderList.map((e: any) => e.cid)
    }
    // if (this.inventoryType === 2) {
    //   params.warehouseId = this.searchForm.warehouseId
    // }
    this.loading = true
    generateInventory(params).then((res: any) => {
      this.loading = false
      this.generateInventoryData = res.data || {}
      this.pagination.total = (this.generateInventoryData.orderBoxDtos || []).length
    }).catch(() => {
      this.loading = false
      this.generateInventoryData = {}
    })
  }

  private show(row?: any) {
    this.reset()
    if (row) {
      // 编辑
      this.row = row
      this.inventoryType = row.type
      this.searchForm.warehouseId = row.warehouseId
      this.searchForm.warehouseName = row.warehouseName
      this.getInventoryById()
    }
  }

  private getInventoryById() {
    this.loading = true
    getInventoryById({ model: { id: this.row.id, type: 1 }, page: 1, size: 99999 }).then((res: any) => {
      this.loading = false
      const result = res.data || {}
      this.selectOrderList = (result.result || []).reduce((list: any[], e: any) => {
        const data :any = {}
        if (this.inventoryType === 0) {
          data.code = e.orderCode
        }
        if (this.inventoryType === 1) {
          data.code = e.binNo
          data.cid = e.binCid
        }
        if (!list.find((l: any) => l.code === data.code)) {
          list.push(data)
        }
        return list
      }, [])
      this.generateInventory()
    }).catch(() => {
      this.loading = false
    })
  }

  private reset() {
    this.row = {}
    this.inventoryType = ''
    this.selectOrderList = []
    this.searchForm = {
      warehouseId: '',
      warehouseName: ''
    }
    this.generateInventoryData = {}
  }

  private saveSelectOrder(val: any[]) {
    this.selectOrderList = val
    if (this.inventoryType === 0 && !this.selectOrderList.length) {
      this.$message.error('请选择订单')
      return
    }
    if (this.inventoryType === 1 && !this.selectOrderList.length) {
      this.$message.error('请选择库位')
      return
    }
    this.generateInventory()
  }

  private saveInventory() {
    if ((this.generateInventoryData.orderBoxDtos || []).length === 0) {
      this.$message.warning('暂无盘点内容')
      return
    }
    this.saveing = true
    const queryOrder: any = {
      inventoryType: this.inventoryType,
      codes: [],
      binNos: [],
      warehouseId: ''
    }
    if (this.inventoryType === 0) {
      queryOrder.codes = this.selectOrderList.map((e: any) => e.code)
    }
    if (this.inventoryType === 1) {
      queryOrder.binNos = this.selectOrderList.map((e: any) => e.cid)
      // queryOrder.binCid = this.selectOrderList.map((e: any) => e.cid)
    }
    if (this.inventoryType === 2) {
      queryOrder.warehouseId = this.searchForm.warehouseId
    }
    const params: any = {
      queryOrder,
      resInventoryEntity: {
        inventoryInfoEntities: (this.generateInventoryData.orderBoxDtos || []).map((e: any) => {
          return {
            binNo: e.binNo,
            binType: e.binType,
            orderCode: e.originalNo,
            packages: e.num,
            towageId: e.palletNo,
            binCid: e.binCids
          }
        }),
        totalNumber: this.generateInventoryData.totalNumber,
        totalPackages: this.generateInventoryData.totalPackages,
        totalTowage: this.generateInventoryData.totalPallet,
        type: this.inventoryType,
        warehouseId: this.searchForm.warehouseId,
        warehouseName: this.searchForm.warehouseName
      }
    }
    if (this.row.id) {
      params.resInventoryEntity.id = this.row.id
      updateInventory(params).then(() => {
        this.saveing = false
        this.$message.success('编辑成功')
        this.$emit('back', true)
      }).catch(() => {
        this.saveing = false
      })
    } else {
      saveInventory(params).then(() => {
        this.saveing = false
        this.$message.success('新增成功')
        this.$emit('back', true)
      }).catch(() => {
        this.saveing = false
      })
    }
  }

  private async selectOrderClick(val: any) {
    if (!this.searchForm.warehouseId) {
      this.$message.warning('请选择盘点仓库')
      return
    }
    const el: any = this.$refs.selectModal
    await el.selectOrderClick(val, {
      id: this.searchForm.warehouseId,
      name: this.searchForm.warehouseName
    }, this.selectOrderList)
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
