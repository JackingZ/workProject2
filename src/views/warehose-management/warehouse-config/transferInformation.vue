<template>
  <div>
    <el-button
      v-permission="['warehouseTransferInfmtAdd']"
      type="text"
      icon="el-icon-circle-plus-outline"
      @click="handleAdd"
    >
      新增转仓信息
    </el-button>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      height="calc(100vh - 340px)"
      style="width: 100%;margin: 10px 0;"
    >
      <el-table-column
        prop="targetName"
        label="目的仓"
      />
      <el-table-column
        prop="transitTime"
        label="转仓时间(小时)"
      />
      <el-table-column
        :formatter="formatUmW"
        prop="priceWeight"
        label="重量单价"
      />
      <el-table-column
        :formatter="formatUmV"
        prop="priceVolume"
        label="体积单价"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['warehouseTransferInfmtEdit']"
            type="text"
            size="small"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          &nbsp;
          <el-button
            v-permission="['warehouseTransferInfmtDel']"
            type="text"
            size="small"
            @click="handleDelete(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pageNumber"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="totalCount"
      style="text-align: right;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <transferInfoForm
      ref="transferInfoForm"
      :is-edit="isEdit"
      :ws-id="wsId"
      @getTableList="getTableList"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import dayjs from 'dayjs'
import {
  getTransitPage,
  deleteTransit
} from '@/api/warehose-by-config'
import transferInfoForm from '@/views/warehose-management/warehouse-config/transferInfoForm.vue'
@Component({
  name: 'TransferInformation',
  components: {
    transferInfoForm
  },
  props: {
    wsId: {
      type: String,
      default: ''
    }
  }
})
export default class TransferInformation extends Vue {
  private loading: boolean = false
  private isEdit: boolean = false
  private tableData: any[] = []
  private pageNumber: number = 1
  private pageSize: number = 10
  private totalCount: number = 0
  // -- methods --
  private formatUmW(val: any) {
    const pw = val.priceWeight || ''
    const uw = val.umWeight ? ' RMB/' + val.umWeight : ''
    return pw + uw
  }
  private formatUmV(val: any) {
    const pv = val.priceVolume || ''
    const uv = val.umVolume ? ' RMB/' + val.umVolume : ''
    return pv + uv
  }
  private handleAdd(): void {
    // zzz
    this.isEdit = false
    const root: any = this.$refs.transferInfoForm
    this.$nextTick(() => {
      root.init()
    })
  }
  private handleEdit(row: any): void {
    // zzz
    this.isEdit = true
    const root: any = this.$refs.transferInfoForm
    this.$nextTick(() => {
      root.init(row)
    })
  }
  private handleDelete(id: string): void {
    this.$confirm('此操作将永久删除该数据, 是否继续?', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        const params: any = { id }
        deleteTransit(params)
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getTableList()
          })
          .catch(err => {
            return [err, null]
          })
      })
      .catch(err => {
        return [err, null]
      })
  }
  private getTableList(): void {
    const params: any = {
      model: (this as any).wsId,
      page: this.pageNumber,
      size: this.pageSize
    }
    this.loading = true
    getTransitPage(params)
      .then((res: any) => {
        this.loading = false
        const { data } = res
        this.totalCount = data.total
        this.tableData = data.result || []
      })
      .catch(() => {
        this.loading = false
      })
  }
  private handleSizeChange(val: number) {
    this.pageSize = val
    this.getTableList()
  }
  private handleCurrentChange(val: number) {
    this.pageNumber = val
    this.getTableList()
  }
  private created(): void {
    this.getTableList()
  }
}
</script>

<style lang="scss" scoped>
</style>
