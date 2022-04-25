<template>
  <div>
    <el-button
      v-permission="['warehouseOperatingCenterAdd']"
      type="text"
      icon="el-icon-circle-plus-outline"
      @click="handleAdd"
    >
      新增操作中心
    </el-button>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      height="calc(100vh - 340px)"
      style="width: 100%;margin: 10px 0;"
    >
      <!-- <el-table-column
        prop="wcId"
        label="操作中心ID"
        min-width="150"
      /> -->
      <el-table-column
        prop="name"
        label="名称"
      />
      <el-table-column
        prop="sorted"
        label="排序"
      />
      <el-table-column
        prop="jobName"
        label="岗位"
      />
      <el-table-column
        :formatter="formatUm"
        label="效率数值"
      />
      <el-table-column
        :formatter="formatPer"
        label="效率单位"
      />
      <el-table-column
        label="是否参与排程"
        width="120"
      >
        <template slot-scope="scope">
          {{ scope.row.schedule ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="最后更新时间"
        width="180"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['warehouseOperatingCenterEdit']"
            type="text"
            size="small"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          &nbsp;
          <el-button
            v-permission="['warehouseOperatingCenterDel']"
            type="text"
            size="small"
            @click="handleDelete(scope.row.wcId)"
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
    <opeartingForm
      ref="opeartingForm"
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
  getWorkCenterList,
  deleteWorkCenter
} from '@/api/warehose-by-config'
import opeartingForm from '@/views/warehose-management/warehouse-config/opeartingForm.vue'
@Component({
  name: 'OperatingCenter',
  components: {
    opeartingForm
  },
  props: {
    wsId: {
      type: String,
      default: ''
    }
  }
})
export default class OperatingCenter extends Vue {
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
    const root: any = this.$refs.opeartingForm
    this.$nextTick(() => {
      root.init()
    })
  }
  private handleEdit(row: any): void {
    // zzz
    this.isEdit = true
    const root: any = this.$refs.opeartingForm
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
        deleteWorkCenter(params)
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
  private formatUm(val: any) {
    let name
    switch (val.um) {
      case '1':
        name = ' kg'
        break
      case '2':
        name = ' m³'
        break
      case '3':
        name = ' 件'
        break
      case '4':
        name = ' 箱'
        break
      default:
        name = ''
        break
    }
    return val.efficiency + name
  }
  private formatPer(val: any) {
    let name
    switch (val.per) {
      case '1':
        name = '天'
        break
      case '2':
        name = '小时'
        break
      case '3':
        name = '分钟'
        break
      default:
        break
    }
    return name
  }
  private getTableList(): void {
    const params: any = {
      model: (this as any).wsId,
      page: this.pageNumber,
      size: this.pageSize
    }
    this.loading = true
    getWorkCenterList(params)
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
