<template>
  <div>
    <el-button
      v-permission="['warehouseDischargingHatchAdd']"
      type="text"
      icon="el-icon-circle-plus-outline"
      @click="handleAdd"
    >
      新增分拣口
    </el-button>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      height="calc(100vh - 310px)"
      style="width: 100%;margin: 10px 0;"
    >
      <el-table-column
        prop="discharge"
        label="分拣口名称"
      />
      <el-table-column
        prop="code"
        label="分拣口编码"
      />
      <el-table-column
        prop="remarks"
        label="备注信息"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['warehouseDischargingHatchEdit']"
            type="text"
            size="small"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          &nbsp;
          <el-button
            v-permission="['warehouseDischargingHatchDel']"
            type="text"
            size="small"
            @click="handleDelete(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination
      :current-page="pageNumber"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="totalCount"
      style="text-align: right;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    /> -->
    <dischargeForm
      ref="dischargeForm"
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
  getDischargeTable,
  deleteDischarge
} from '@/api/warehose-by-config'
import dischargeForm from '@/views/warehose-management/warehouse-config/dischargeForm.vue'
@Component({
  name: 'DischargingHatch',
  components: {
    dischargeForm
  },
  props: {
    wsId: {
      type: String,
      default: ''
    }
  }
})
export default class DischargingHatch extends Vue {
  private loading: boolean = false
  private isEdit: boolean = false
  private tableData: any[] = []
  private pageNumber: number = 1
  private pageSize: number = 10
  private totalCount: number = 0

  // -- methods --
  private handleAdd(): void {
    // zzz
    this.isEdit = false
    const root: any = this.$refs.dischargeForm
    this.$nextTick(() => {
      root.init()
    })
  }
  private handleEdit(row: any): void {
    // zzz
    this.isEdit = true
    const root: any = this.$refs.dischargeForm
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
        const params: any = {
          id,
          warehouseId: (this as any).wsId
        }
        deleteDischarge(params)
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
      warehouseId: (this as any).wsId
    }
    this.loading = true
    getDischargeTable(params)
      .then((res: any) => {
        this.loading = false
        const { data } = res
        this.tableData = data || []
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
