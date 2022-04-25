<template>
  <el-dialog
    :title="`操作日志【${logRow.airlineCompany}】`"
    width="800px"
    :visible="visible"
    @close="visible = false"
  >
    <div v-loading="loading">
      <el-table
        :data="tableData"
        border
        style="width: 100%;"
      >
        <el-table-column
          prop="operationName"
          width="200"
          label="操作人"
        />
        <el-table-column
          prop="describeA"
          label="操作描述"
        />
        <el-table-column
          prop="operationTime"
          width="180"
          label="操作时间"
        />
      </el-table>
      <el-pagination
        :current-page="pagination.page"
        :page-size="pagination.size"
        layout="total, prev, pager, next"
        :total="pagination.total"
        style="text-align: right;"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getLogList } from '@/api/system-in-air-them-roughly'

@Component({
  name: 'OperationLog'
})
export default class OperationLog extends Vue {
  /* data */
  private visible: boolean = false
  private loading: boolean = false
  private tableData: any[] = []
  private logRow: any = {}
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }

  /* methods */
  private show(row: any) {
    this.logRow = row
    this.tableData = []
    this.pagination = {
      page: 1,
      size: 10,
      total: 0
    }
    this.visible = true
    this.getLogList()
  }

  private getLogList() {
    const params = {
      model: this.logRow.airlineId,
      page: this.pagination.page,
      size: this.pagination.size
    }
    this.loading = true
    getLogList(params).then((res: any) => {
      this.loading = false
      if (res.success) {
        const data = res.data || {}
        this.tableData = data.result || []
        this.pagination.total = data.total || 0
        if (this.tableData.length === 0) {
          this.$message.info('暂无操作日志')
        }
      }
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }

  private handleCurrentChange(page: any) {
    this.pagination.page = page
    this.getLogList()
  }
}
</script>

<style lang="scss" scoped>
</style>
