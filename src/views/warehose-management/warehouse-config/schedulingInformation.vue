<template>
  <div>
    <el-button
      v-permission="['warehouseSchedulingAdd']"
      type="text"
      icon="el-icon-circle-plus-outline"
      @click="handleAdd"
    >
      新增班次信息
    </el-button>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      height="calc(100vh - 340px)"
      style="width: 100%;margin: 10px 0;"
    >
      <el-table-column
        prop="name"
        label="班次名称"
      />
      <el-table-column
        prop="transitTime"
        :formatter="formatTime"
        label="班次时间"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['warehouseSchedulingEdit']"
            type="text"
            size="small"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          &nbsp;
          <el-button
            v-permission="['warehouseSchedulingDel']"
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
    <schedulingForm
      ref="schedulingForm"
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
  getSchedulTable,
  deleteSchedul
} from '@/api/warehose-by-config'
import schedulingForm from '@/views/warehose-management/warehouse-config/schedulingForm.vue'
@Component({
  name: 'SchedulingInformation',
  components: {
    schedulingForm
  },
  props: {
    wsId: {
      type: String,
      default: ''
    }
  }
})
export default class SchedulingInformation extends Vue {
  private loading: boolean = false
  private isEdit: boolean = false
  private tableData: any[] = []
  private pageNumber: number = 1
  private pageSize: number = 10
  private totalCount: number = 0
  // -- methods --
  private formatTime(val: any) {
    if (val.startTime && val.endTime) {
      const sh = dayjs(val.startTime).format('HH:mm')
      const dh = dayjs(val.endTime).format('HH:mm')
      return sh + '~' + dh
    }
  }
  private handleAdd(): void {
    // zzz
    this.isEdit = false
    const root: any = this.$refs.schedulingForm
    this.$nextTick(() => {
      root.init()
    })
  }
  private handleEdit(row: any): void {
    // zzz
    this.isEdit = true
    const root: any = this.$refs.schedulingForm
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
        deleteSchedul(params)
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
    getSchedulTable(params)
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
