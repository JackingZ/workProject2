<template>
  <div
    class="examine-form"
    style="display: flex;flex-flow: row nowrap;min-height: inherit;"
  >
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        v-show="!detailShow"
        class="app-container"
      >
        <head-info
          info=""
          title="拆柜任务单"
        />
        <div class="app-panel">
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-input
                v-model="searchForm.cabinetNo"
                style="width:130px;margin-right:5px;"
                size="small"
                placeholder="柜号"
              />
              <el-select
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
              </el-select>
              <el-date-picker
                v-model="searchForm.applyTime"
                :clearable="false"
                unlink-panels
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="~"
                align="right"
                size="small"
                style="width:240px;margin-right:10px;"
                start-placeholder="起始时间"
                end-placeholder="截止时间"
              />
              <el-button
                type="primary"
                size="small"
                @click="handleSearch(1)"
              >
                查询
              </el-button>
            </el-col>
          </el-row>
          <el-table
            v-loading="loading"
            :data="tableData"
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              prop="id"
              label="拆柜任务单ID"
              min-width="160"
            />
            <el-table-column
              prop="status"
              label="状态"
              width="100"
            >
              <template slot-scope="scope">
                {{ (statusList.find(e => scope.row.status === e.id) || {}).name }}
              </template>
            </el-table-column>
            <el-table-column
              prop="cabinetNo"
              label="柜号"
              min-width="150"
            />
            <el-table-column
              label="仓库名称"
              min-width="160"
            >
              <template slot-scope="scope">
                {{ (scope.row.warehouse || {}).name }}
              </template>
            </el-table-column>
            <el-table-column
              label="下单客户"
              min-width="160"
            >
              <template slot-scope="scope">
                {{ (scope.row.buyer || {}).name }}
              </template>
            </el-table-column>
            <el-table-column
              label="客户名称"
              min-width="160"
            >
              <template slot-scope="scope">
                {{ (scope.row.buyer || {}).name }}
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              width="170"
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="150"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleDetail(scope.row)"
                >
                  查看详情
                </el-button>
              </template>
            </el-table-column>
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
      </div>
      <div
        v-show="detailShow"
        class="app-container"
      >
        <detail
          ref="detail"
          @back="detailShow = false"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import dayjs from 'dayjs'
import { getTaskList } from '@/api/warehose-by-cabinet-removal'
import detail from '@/views/warehose-management/cabinet-removal/detail.vue'

@Component({
  name: 'cabinetRemovalTask',
  components: {
    detail
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private searchForm: any = {
    cabinetNo: '',
    status: '',
    applyTime: []
  }

  private tableData: any = []
  private total = 0
  private page = 1
  private size = 10
  private loading = false
  private detailShow = false
  private statusList: any[] = [
    { id: 0, name: '待拆柜' },
    { id: 1, name: '拆柜中' },
    { id: 2, name: '已完成' }
  ]

  // computed
  // 所属公司id
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }

  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }

  /* methods */
  private handleDetail(row: any) {
    const detailRef: any = this.$refs.detail
    this.detailShow = true
    detailRef.show(row)
  }
  private handleSearch(page?: number) {
    if (page === 1) {
      this.page = page
    }
    const params: any = {
      model: {
        ...this.searchForm
      },
      page: this.page,
      size: this.size
    }
    const applyTime = this.searchForm.applyTime
    if (Array.isArray(applyTime) && applyTime.length > 0) {
      params.model.start = applyTime[0] + ' 00:00:00'
      params.model.end = applyTime[1] + ' 23:59:59'
    }
    this.loading = true
    getTaskList(params).then((res: any) => {
      const data = res.data || {}
      this.tableData = data.result || []
      this.total = data.total
      this.loading = false
    }).catch((err: any) => {
      this.loading = false
      return [null, err]
    })
  }
  private handleSizeChange(size: any): void {
    // 页码
    this.size = size
    this.handleSearch()
  }
  private handleCurrentChange(page: any): void {
    // 页数
    this.page = page
    this.handleSearch()
  }
  private created() {
    this.searchForm.applyTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    this.handleSearch()
  }
}
</script>

<style lang="scss" scoped>
</style>
