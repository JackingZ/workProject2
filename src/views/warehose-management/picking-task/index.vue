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
          title="拣货任务单"
        />
        <div class="app-panel">
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-input
                v-model="searchForm.rwdh"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
                placeholder="任务单号"
              />
              <el-select
                v-model="searchForm.rwlx"
                placeholder="任务类型"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
              >
                <el-option
                  label="入库"
                  value="0"
                />
                <el-option
                  label="出库"
                  value="1"
                />
                <el-option
                  label="移库"
                  value="2"
                />
                <el-option
                  label="计量拖托"
                  value="3"
                />
              </el-select>
              <el-select
                v-model="searchForm.zt"
                placeholder="状态"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
              >
                <el-option
                  label="待执行"
                  value="0"
                />
                <el-option
                  label="执行中"
                  value="1"
                />
                <el-option
                  label="已完成"
                  value="2"
                />
              </el-select>
              <el-date-picker
                v-model="searchForm.time"
                type="daterange"
                unlink-panels
                align="right"
                size="small"
                range-separator="~"
                value-format="yyyy-MM-dd"
                style="width: 240px;margin-right:15px;"
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
              prop="jhrwdh"
              label="拣货任务单号"
              min-width="140px"
            />
            <el-table-column
              prop="zt"
              label="状态"
            />
            <el-table-column
              prop="rwlx"
              label="任务类型"
            />
            <el-table-column
              prop="rwlx"
              label="子类型"
            />
            <el-table-column
              prop="cjsj"
              label="创建时间"
            />
            <el-table-column
              prop="yqwcsj"
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
          @back="detailShow = false"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import detail from './detail.vue'
import { getPickList } from '@/api/warehose-by-config'
@Component({
  name: 'picking',
  components: {
    detail
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private searchForm = {
    rwdh: undefined, // 任务单号
    jhr: undefined, // 拣货人
    zt: undefined, // 状态
    rwlx: undefined, // 任务类型
    kssj: undefined, // 起期
    jssj: undefined, // 止期
    time: undefined
  }
  private tableData: any = []
  private total = 0
  private page = 1
  private size = 10
  private loading = false
  private detailShow: boolean = false

  /* methods */
  private handleSearch(val?: any): void {
    // 查询
    this.loading = true
    if (val) {
      this.page = val
    }
    const params: any = {
      ...this.searchForm,
      page: this.page,
      size: this.size
    }
    getPickList(params)
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
}
</script>

<style lang="scss" scoped>
</style>
