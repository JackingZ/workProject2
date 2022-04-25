<template>
  <div v-loading="loading">
    <el-row>
      <el-col
        :span="24"
        style="text-align:right;"
      >
        <el-input
          v-model="searchForm.code"
          size="small"
          style="width:130px;margin-right:5px;"
          placeholder="发票编号"
        />
        <!-- <el-select
          v-model="searchForm.status"
          placeholder="状态"
          size="small"
          clearable
          style="width:130px;margin-right:5px;"
        >
          <el-option
            v-for="(item, index) in statusList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select> -->
        <el-select
          v-model="searchForm.ifVerify"
          placeholder="核销状态"
          size="small"
          clearable
          style="width:130px;margin-right:5px;"
        >
          <el-option
            label="已核销"
            value="1"
          />
          <el-option
            label="未核销"
            value="0"
          />
        </el-select>
        <el-date-picker
          v-model="time"
          type="daterange"
          unlink-panels
          align="right"
          size="small"
          range-separator="~"
          value-format="yyyy-MM-dd"
          style="width: 240px;margin-right:5px;"
          start-placeholder="起始日期"
          end-placeholder="结束日期"
        />
        <el-input
          v-model="searchForm.orderCode"
          size="small"
          style="width:130px;margin-right:10px;"
          placeholder="原单号"
        />
        <el-button
          type="primary"
          size="small"
          @click="handleSearch"
        >
          查询
        </el-button>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      style="width: 100%;margin: 10px 0;"
      height="400px"
      border
    >
      <el-table-column
        fixed="left"
        prop="orderCode"
        label="原单号"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        fixed="left"
        prop="code"
        label="发票编号"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="status"
        label="状态"
        width="120"
      >
        <template slot-scope="scope">
          {{ (statusList.find(e => e.id === scope.row.status) || {}).name }}
        </template>
      </el-table-column>
      <el-table-column
        prop="ifVerify"
        label="核销状态"
        width="120"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.ifVerify === 1">已核销</span>
          <span v-if="scope.row.ifVerify === 0">未核销</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="invDate"
        label="发票日期"
        width="160"
      />
      <el-table-column
        prop="currencyName"
        label="货币"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ `${scope.row.currencyName || ''}${scope.row.currencyId || ''}` }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        min-width="100"
        label="金额"
      />
      <el-table-column
        prop="createTime"
        width="160"
        label="创建时间"
      />
      <el-table-column
        prop="auditTime"
        label="审核时间"
        width="160"
      />
      <el-table-column
        prop="cutoffTime"
        width="160"
        label="截止付款时间"
      />
      <el-table-column
        prop=""
        width="100"
        :formatter="formatterCutoffTime"
        label="逾期天数"
      />
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
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  getInvoice1List
} from '@/api/financial-at-company-credit'
import dayjs from 'dayjs'

@Component({
  name: '',
  components: {
  },
  props: {}
})

export default class extends Vue {
  private page: number = 1
  private size: number = 10
  private total: number = 0
  private tableData: any[] = []
  private loading: boolean = false
  private currentId = ''
  private row: any = {}
  private time: any[] = []
  private searchForm: any = {
    code: undefined,
    endDate: undefined,
    orderCode: undefined,
    startDate: undefined,
    ifVerify: undefined
  }
  private statusList: any[] = [
    { name: '未审核', id: '0' },
    { name: '已通过', id: '1' },
    { name: '已拒绝', id: '2' }
  ]
  /** computed */
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }

  /** method */
  private formatterCutoffTime(row: any) {
    const cutoffTime = row.cutoffTime
    if (!cutoffTime) return '--'
    if (dayjs(cutoffTime).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')) return '--'
    const num = dayjs().diff(cutoffTime, 'day') + 1
    if (num > 0 && row.ifVerify === 0) {
      return num
    }
    return '--'
  }
  private setData(row: any) {
    const { id, custTag } = row
    this.row = row
    this.currentId = id
    this.time = []
    const type = (this as any).custType
    this.searchForm = {
      custTag: type === '3' ? '34' : custTag,
      code: undefined,
      endDate: undefined,
      orderCode: undefined,
      startDate: undefined,
      ifVerify: undefined
    }
    this.getTableData()
  }
  private handleSearch() {
    this.getTableData(1)
  }
  private getTableData(val?: number) {
    this.loading = true
    if (val) {
      this.page = val
    }
    const params: any = {
      ...this.searchForm,
      enterpriseId: [this.currentId],
      request: '0',
      page: this.page,
      size: this.size,
      type: 'P'
    }
    if (Array.isArray(this.time) && this.time.length > 0) {
      params.startDate = this.time[0]
      params.endDate = this.time[1]
    }
    getInvoice1List(params)
      .then((res: any) => {
        const data = res.data || {}
        this.tableData = data.result || []
        this.total = data.total
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return [null, err]
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
}
</script>

<style lang="scss" scoped>

</style>
