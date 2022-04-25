<template>
  <div
    class="picking-form"
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
          title="上架任务单"
        />
        <div class="app-panel">
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-input
                v-model="searchForm.putawayNo"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
                placeholder="任务单号"
              />
              <el-select
                v-model="searchForm.putawayType"
                placeholder="上架类型"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
              >
                <el-option
                  v-for="(item, index) in typeList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
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
                v-model="searchForm.createTime"
                :clearable="false"
                unlink-panels
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="~"
                align="right"
                size="small"
                style="width:240px;margin-right:5px;"
                start-placeholder="创建起始时间"
                end-placeholder="创建截止时间"
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
              prop="putawayNo"
              label="上架任务单号"
              min-width="140px"
            />
            <el-table-column
              prop="status"
              label="状态"
            >
              <template slot-scope="scope">
                {{ (statusList[scope.row.status] || {}).name }}
              </template>
            </el-table-column>
            <el-table-column
              prop="putawayType"
              label="上架类型"
            >
              <template slot-scope="scope">
                {{ (typeList[scope.row.putawayType] || {}).name }}
              </template>
            </el-table-column>
            <el-table-column
              prop="putawayMode"
              label="上架模式"
            >
              <template slot-scope="scope">
                {{ (modeList[scope.row.putawayMode] || {}).name }}
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
            />
            <el-table-column
              prop="expectedFinishTime"
              label="要求完成时间"
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="100px"
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
          ref="detailForm"
          :type-list="typeList"
          :status-list="statusList"
          :mode-list="modeList"
          @back="detailShow = false"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import detail from './detail.vue'
import { getPutawayList } from '@/api/warehose-by-config'
import dayjs from 'dayjs'
@Component({
  name: 'putaway',
  components: {
    detail
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private searchForm: any = {
    putawayNo: undefined, // 任务单号
    status: undefined, // 状态
    putawayType: undefined, // 任务类型
    timeStart: undefined, // 起期
    timeEnd: undefined, // 止期
    createTime: [] // 时间集合
  }
  private tableData: any = []
  private statusList: any[] = [
    { id: 1, name: '待执行' },
    { id: 2, name: '执行中' },
    { id: 3, name: '已完成' }
  ]
  private typeList: any[] = [
    { id: 1, name: '收获上架' },
    { id: 2, name: '销售退货' },
    { id: 3, name: '补货上架' },
    { id: 4, name: '归为上架' },
    { id: 5, name: '移库上架' },
    { id: 6, name: '其他' }
  ]
  private modeList: any[] = [
    { id: 1, name: '整托上架' },
    { id: 2, name: '整箱上架' },
    { id: 3, name: '散件上架' }
  ]
  private total = 0
  private page = 1
  private size = 10
  private loading = false
  private detailShow: boolean = false

  /* methods */
  private handleSearch(val?: any): void {
    // 查询
    this.loading = true
    const { createTime, ...model } = this.searchForm
    if (Array.isArray(createTime) && createTime.length > 0) {
      model.timeStart = createTime[0]
      model.timeEnd = createTime[1]
    }
    if (val) {
      this.page = val
    }
    const params = {
      model,
      page: this.page,
      size: this.size
    }
    getPutawayList(params)
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
  private handleDetail(row: any): void {
    // 查看详情
    this.detailShow = true
    const root: any = this.$refs.detailForm
    root.setData(row)
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
    this.searchForm.createTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    this.handleSearch()
  }
}
</script>

<style lang="scss" scoped>
</style>
