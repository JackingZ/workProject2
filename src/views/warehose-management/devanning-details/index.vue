<template>
  <div
    class="devanning-form"
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
          title="拆柜详情表"
        />
        <div class="app-panel">
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-input
                v-model="searchForm.warehousename"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
                placeholder="仓库名称"
              />
              <el-input
                v-model="searchForm.originalNumber"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
                placeholder="原单号"
              />
              <el-input
                v-model="searchForm.customerName"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
                placeholder="客户名称"
              />
              <el-select
                v-model="searchForm.status"
                placeholder="状态"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
              >
                <el-option
                  label="待拆柜"
                  value="0"
                />
                <el-option
                  label="拆柜中"
                  value="1"
                />
                <el-option
                  label="已完成"
                  value="2"
                />
              </el-select>
              <el-input
                v-model="searchForm.licencePlate"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
                placeholder="柜号"
              />
              <el-select
                v-model="searchForm.type"
                placeholder="卸货类型"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
              >
                <el-option
                  label="整车"
                  value="0"
                />
                <el-option
                  label="整柜"
                  value="1"
                />
              </el-select>
              <el-date-picker
                v-model="searchForm.applyTime"
                :clearable="false"
                unlink-panels
                value-format="yyyy-MM-dd"
                range-separator="~"
                type="daterange"
                align="right"
                size="small"
                style="width:240px;margin-right:5px;"
                start-placeholder="申请起期"
                end-placeholder="申请止期"
              />
              <el-button
                type="primary"
                size="small"
                @click="handleSearch(1)"
              >
                查询
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="handleMoreSearch"
              >
                更多查询
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
              prop="xhsqdid"
              label="卸货申请单ID"
              min-width="140px"
            />
            <el-table-column
              prop="gh"
              label="柜号"
              min-width="100px"
            />
            <el-table-column
              prop="zt"
              label="状态"
            />
            <el-table-column
              prop="ckmc"
              label="仓库名称"
            />
            <el-table-column
              prop="khmc"
              label="客户名称"
              min-width="140px"
            />
            <el-table-column
              prop="tgsj"
              label="提柜时间"
              width="160px"
            />
            <el-table-column
              prop="yjtgsj"
              label="预计提柜时间"
              width="160px"
            />
            <el-table-column
              prop="yjqgsj"
              label="预计清关时间"
              width="160px"
            />
            <el-table-column
              prop="yjrcsj"
              label="预计入仓时间"
              width="160px"
            />
            <el-table-column
              prop="sjrcsj"
              label="实际入仓时间"
              width="160px"
            />
            <el-table-column
              prop="wcsj"
              label="完成时间"
              width="160px"
            />
            <el-table-column
              prop="sqsj"
              label="申请时间"
              min-width="160px"
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="100px"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleDevanDetail(scope.row)"
                >
                  {{ scope.row.mc ? '开始拆柜' : '查看详情' }}
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
      <drawer
        :is-show="moreShow"
        :mask-closable="false"
        drawer-title="更多查询"
        drawer-style="width: 500px;"
        cancel-text="取消"
        confirm-text="确定"
        @drawerClose="handleMoreCancle"
        @drawerConfirm="handleMoreConfirm"
      >
        <searchMore ref="searchMore" />
      </drawer>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import searchMore from './searchMore.vue'
import drawer from '@/components/Drawer/drawer.vue'
import detail from './detail.vue'
import { getDevanningList } from '@/api/warehose-by-config'
import dayjs from 'dayjs'

@Component({
  name: 'devanning',
  components: {
    searchMore,
    drawer,
    detail
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private searchForm: any = {
    warehousename: undefined, // 仓库名称
    originalNumber: undefined, // 原单号
    customerName: undefined, // 客户名称
    status: undefined, // 状态
    licencePlate: undefined, // 柜号
    type: undefined, // 卸货类型
    applyTime: [], // 申请时间
    timeStart: undefined,
    timeEnd: undefined
  }
  private tableData: any = [
    {
      xhsqdid: 'D0982dfsdf',
      gh: 'GB123213',
      zt: '已完成',
      ckmc: '深圳A仓',
      khmc: '深圳XX电商公司',
      tgsj: '2018-10-22 16:35:24',
      yjtgsj: '2018-10-22 16:35:24',
      yjqgsj: '2018-10-22 16:35:24',
      yjrcsj: '2018-10-22 16:35:24',
      sjrcsj: '2018-10-22 16:35:24',
      wcsj: '2018-10-22 16:35:24',
      sqsj: '2018-10-22 16:35:24'
    }
  ]
  private total = 0
  private page = 1
  private size = 10
  private loading = false
  private moreShow: boolean = false
  private detailShow: boolean = false

  /* methods */
  private handleSearch(val?: any): void {
    // 查询
    this.loading = true
    const { applyTime, ...model } = this.searchForm
    if (Array.isArray(applyTime) && applyTime.length > 0) {
      model.timeStart = applyTime[0]
      model.timeEnd = applyTime[1]
    }
    if (val) {
      this.page = val
    }
    const params = {
      model,
      page: this.page,
      size: this.size
    }
    getDevanningList(params)
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
  private handleMoreSearch(): void {
    // 更多查询
    this.moreShow = true
  }
  private handleMoreCancle(): void {
    // 取消
    this.moreShow = false
  }
  private handleMoreConfirm(): void {
    // 确定
    this.moreShow = false
    const root: any = this.$refs.searchMore
    this.searchForm = { ...root.searchMore }
    this.handleSearch(1)
  }
  private handleDevanDetail(row: any): void {
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
    this.searchForm.applyTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    this.handleSearch()
  }
}
</script>

<style lang="scss" scoped></style>
