<template>
  <div v-loading="loading">
    <el-row>
      <el-col
        :span="24"
        style="text-align:right;"
      >
        <el-date-picker
          v-model="searchForm.applyTime"
          unlink-panels
          type="daterange"
          align="right"
          size="small"
          clearable
          value-format="yyyy-MM-dd"
          range-separator="~"
          style="width:240px;margin-right:10px;"
          start-placeholder="起始时间"
          end-placeholder="截止时间"
        />
        <el-button
          type="primary"
          size="small"
          @click="getTableData"
        >
          查询
        </el-button>
      </el-col>
    </el-row>
    <div style="overflow-y: auto;height: 500px;margin: 10px 0;">
      <el-table
        :data="list"
        style="width: 100%;"
        border
      >
        <el-table-column
          prop="code"
          label="原单号"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="updateBy"
          label="客户名称"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          min-width="150"
          show-overflow-tooltip
        >
          <template slot="header">
            <span>商品名称(中文)</span>
            <br>
            <span>商品名称(英文)</span>
          </template>
          <template slot-scope="scope">
            <div class="word-limit">
              <span>{{ scope.row.cnName ? scope.row.cnName : '--' }}</span>
              <br>
              <span>{{ scope.row.enName ? scope.row.enName : '--' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="brand"
          min-width="120"
          label="品牌"
          show-overflow-tooltip
        />
        <el-table-column
          prop="size"
          min-width="120"
          label="规格"
          show-overflow-tooltip
        />
        <el-table-column
          min-width="150"
          show-overflow-tooltip
        >
          <template slot="header">
            <span>材质(中文)</span>
            <br>
            <span>材质(英文)</span>
          </template>
          <template slot-scope="scope">
            <div class="word-limit">
              <span>{{ scope.row.cnMaterial ? scope.row.cnMaterial : '--' }}</span>
              <br>
              <span>{{ scope.row.enMaterial ? scope.row.enMaterial : '--' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="150"
          show-overflow-tooltip
        >
          <template slot="header">
            <span>用途(中文)</span>
            <br>
            <span>用途(英文)</span>
          </template>
          <template slot-scope="scope">
            <div class="word-limit">
              <span>{{ scope.row.cnPurpose ? scope.row.cnPurpose : '--' }}</span>
              <br>
              <span>{{ scope.row.enPurpose ? scope.row.enPurpose : '--' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="审单时间"
          width="170"
        />
      </el-table>
    </div>

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
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getProductToCustomerList
} from '@/api/system-in-commodity-audit'

@Component({
  name: '',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */

  private loading: boolean = false
  private list: any[] = []
  private page: number = 1
  private size: number = 10
  private total: any = 0
  private searchForm: any = {
    applyTime: []
  }

  /* 方法 */

  private getTableData() {
    this.loading = true
    const { applyTime, libraryId } = this.searchForm
    const params:any = {
      model: {
        libraryId
      },
      page: this.page,
      size: this.size
    }
    if (Array.isArray(applyTime) && applyTime.length > 0) {
      params.model.startTime = applyTime[0] + ' 00:00:00'
      params.model.endTime = applyTime[1] + ' 23:59:59'
    }
    getProductToCustomerList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.list = data.result || []
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
    this.getTableData()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.getTableData()
  }

  private async cancel(row: any) {
    this.list = []
    this.searchForm = {
      applyTime: []
    }
  }
  private setData(row: any) {
    this.searchForm.libraryId = row.libraryId
    this.getTableData()
  }
}
</script>

<style lang="scss" scoped>
.word-limit {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
