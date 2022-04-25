<template>
  <div
    class="service-form"
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
          title="增值服务申请单"
        />
        <div class="app-panel">
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-button
                type="text"
                icon="el-icon-circle-plus-outline"
                style="float: left;"
                @click="handleAdd"
              >
                新增增值服务申请单
              </el-button>
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
                  v-for="(item, index) in statusOption"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select
                v-model="searchForm.type"
                placeholder="服务类型"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
              >
                <el-option
                  label="分箱"
                  value="0"
                />
                <el-option
                  label="合箱"
                  value="1"
                />
                <el-option
                  label="贴标"
                  value="2"
                />
                <el-option
                  label="贴唛"
                  value="3"
                />
              </el-select>
              <el-date-picker
                v-model="searchForm.applyTime"
                type="datetimerange"
                align="right"
                size="small"
                style="width:360px;margin-right:15px;"
                start-placeholder="申请起始时间"
                end-placeholder="申请截止时间"
                :default-time="['00:00:00', '23:59:59']"
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
              prop="zzfwsqdid"
              label="增值服务申请单ID"
              min-width="140px"
            />
            <el-table-column
              prop="zt"
              label="状态"
            />
            <el-table-column
              prop="ydh"
              label="原单号"
            />
            <el-table-column
              prop="ckmc"
              label="仓库名称"
              min-width="140px"
            />
            <el-table-column
              prop="khmc"
              label="客户名称"
              min-width="140px"
            />
            <el-table-column
              prop="fwlx"
              label="服务类型"
            />
            <el-table-column
              prop="bz"
              label="备注"
            />
            <el-table-column
              prop="sqr"
              label="申请人"
            />
            <el-table-column
              prop="sqsj"
              label="申请时间"
              width="160px"
            />
            <el-table-column
              prop="shr"
              label="审核人"
            />
            <el-table-column
              prop="shsj"
              label="审核时间"
              width="160px"
            />
            <el-table-column
              prop="shsj"
              label="审核结果"
            />
            <el-table-column
              prop="shr"
              label="仓库审核人"
            />
            <el-table-column
              prop="shsj"
              label="仓库审核时间"
              width="160px"
            />
            <el-table-column
              prop="shsj"
              label="仓库审核结果"
            />
            <el-table-column
              prop="shr"
              label="代理商审核人"
            />
            <el-table-column
              prop="shsj"
              label="代理商审核时间"
              width="160px"
            />
            <el-table-column
              prop="shsj"
              label="代理商审核结果"
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="200px"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleEdit(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  style="color: #f56c6c;"
                  @click="handleDelete(scope.row)"
                >
                  删除
                </el-button>
                <el-button
                  type="text"
                  @click="handleDetail(scope.row)"
                >
                  查看详情
                </el-button>
                <el-button
                  type="text"
                  @click="handlePass(scope.row)"
                >
                  通过
                </el-button>
                <el-button
                  type="text"
                  style="color: #f56c6c;"
                  @click="handleRefuse(scope.row)"
                >
                  拒绝
                </el-button>
                <el-button
                  type="text"
                  @click="handleResubmit(scope.row)"
                >
                  重新提交
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
          v-if="detailShow"
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
        <searchMore />
      </drawer>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import searchMore from './searchMore.vue'
import drawer from '@/components/Drawer/drawer.vue'
import detail from './detail.vue'
import { SearchParams, getServiceList } from '@/api/warehose-by-config'
@Component({
  name: 'service',
  components: {
    searchMore,
    drawer,
    detail
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private searchForm = {
    originalNumber: undefined, // 原单号
    customerName: undefined, // 客户名称
    type: undefined, // 增值服务类型
    status: undefined, // 状态
    applyTime: undefined
  }
  private startOptions: any = []
  private purposeOptions: any = []
  private tableData: any = []
  private statusOption = [
    { label: '待执行', value: 0 },
    { label: '执行中', value: 1 },
    { label: '已完成', value: 2 },
    { label: '待审核', value: 3 },
    { label: '被拒绝', value: 4 },
    { label: '已拒绝', value: 5 },
    { label: '待代理商审核', value: 6 },
    { label: '待仓库审核', value: 7 },
    { label: '代理商已拒绝', value: 8 },
    { label: '仓库已拒绝', value: 9 }
  ]
  private total = 0
  private page = 1
  private size = 10
  private loading = false
  private moreShow: boolean = false
  private detailShow: boolean = false

  /* methods */
  private handleAdd(): void {
    // 新增
    this.detailShow = true
    const root: any = this.$refs.detailForm
    root.setStatus('0')
  }
  private handleEdit(): void {
    // 编辑
    this.detailShow = true
  }
  private handleDelete(): void {
    // 删除
  }
  private handlePass(row: any): void {
    // 通过
  }
  private handleRefuse(row: any): void {
    // 拒绝
  }
  private handleResubmit(row: any): void {
    // 重新提交
  }
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
    getServiceList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.tableData = data.result
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
    const root: any = this.$refs.searchMore
    root.searchMore = { ...this.searchForm }
  }
  private handleMoreCancle(): void {
    // 取消
    this.moreShow = false
  }
  private handleMoreConfirm(): void {
    // 确定
    this.moreShow = false
    const root: any = this.$refs.searchMore
    this.searchForm = root.searchMore
    this.handleSearch(1)
  }
  private handleDetail(row: any): void {
    // 查看详情
    this.detailShow = true
    const root: any = this.$refs.detailForm
    root.setData(row)
    root.setStatus('1')
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
