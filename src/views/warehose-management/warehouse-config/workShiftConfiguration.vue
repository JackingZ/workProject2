<template>
  <div>
    <el-button
      type="text"
      icon="el-icon-circle-plus-outline"
      @click="handleAdd"
    >
      新增轮班配置
    </el-button>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      height="calc(100vh - 315px)"
      style="width: 100%;margin: 10px 0;"
    >
      <el-table-column
        label="序号"
        width="100"
      >
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="nums"
        label="轮换时间"
      />
      <el-table-column
        prop="unit"
        label="轮换周期"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.unit === 1">周</span>
          <span v-else-if="scope.row.unit === 2">月</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="oldShiftName"
        label="原班次"
      />
      <el-table-column
        prop="newShiftName"
        label="新班次"
      />
      <el-table-column
        prop="startTime"
        label="执行日期"
      />
      <el-table-column
        prop="endTime"
        label="截止日期"
      />
      <el-table-column
        prop="notes"
        label="备注"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          &nbsp;
          <el-button
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
    <el-dialog
      :title="isEdit ? '编辑轮班配置' : '新增轮班配置'"
      :visible.sync="isShowUpdate"
      :close-on-click-modal="false"
      width="600px"
    >
      <workShiftForm
        ref="editForm"
        :is-edit="isEdit"
        :ws-id="wsId"
        @cancel="handleClose"
        @getTableList="getTableList"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import dayjs from 'dayjs'
import {
  getWorkShiftList,
  deleteWorkShift
} from '@/api/warehose-by-config'
import workShiftForm from '@/views/warehose-management/warehouse-config/workShiftForm.vue'

@Component({
  name: 'WorkShiftConfiguration',
  components: {
    workShiftForm
  },
  props: {
    wsId: {
      type: String,
      default: ''
    }
  }
})
export default class WorkShiftConfiguration extends Vue {
  private loading: boolean = false
  private isEdit: boolean = false
  private isShowUpdate: boolean = false
  private tableData: any[] = []
  private pageNumber: number = 1
  private pageSize: number = 10
  private totalCount: number = 0

  // methods
  private handleAdd() {
    this.isShowUpdate = true
    this.isEdit = false
    this.$nextTick(() => {
      const root: any = (this as any).$refs.editForm
      root.init()
    })
  }
  private handleEdit(row: any) {
    this.isShowUpdate = true
    this.isEdit = true
    this.$nextTick(() => {
      const root: any = (this as any).$refs.editForm
      root.init(row)
    })
  }
  private handleDelete(id: string) {
    this.$confirm('此操作将永久删除该数据, 是否继续?', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        const params: any = { id }
        deleteWorkShift(params)
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
  private handleClose() {
    this.isShowUpdate = false
  }
  private getTableList(): void {
    const params: any = {
      model: {
        warehouseId: (this as any).wsId
      },
      page: this.pageNumber,
      size: this.pageSize
    }
    this.loading = true
    getWorkShiftList(params)
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
