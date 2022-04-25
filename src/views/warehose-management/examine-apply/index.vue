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
          title="验货申请单"
        />
        <div class="app-panel">
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-input
                v-model="searchForm.originalNo"
                style="width:130px;margin-right:5px;"
                size="small"
                placeholder="原单号"
              />
              <el-input
                v-model="searchForm.examiningNo"
                size="small"
                style="width:130px;margin-right:5px;"
                placeholder="验货申请单号"
              />
              <!-- <el-input
                v-model="searchForm.custName"
                size="small"
                style="width:130px;margin-right:5px;"
                placeholder="客户名称"
              /> -->
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
              <el-select
                v-model="searchForm.validated"
                placeholder="验货结果"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
              >
                <el-option
                  label="不通过"
                  :value="0"
                />
                <el-option
                  label="通过"
                  :value="1"
                />
              </el-select>
              <el-select
                v-model="searchForm.section"
                placeholder="验货环节"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
              >
                <el-option
                  label="退货入库"
                  value="2"
                />
                <el-option
                  label="入库检验"
                  value="1"
                />
              </el-select>
              <el-select
                v-model="searchForm.countryId"
                :loading="selectLoading"
                style="width:130px;margin-right:5px;"
                placeholder="国家/地区"
                size="small"
                filterable
                clearable
                @focus="getCountryList"
                @change="onCountry"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="searchForm.warehouseId"
                :loading="selectLoading"
                size="small"
                clearable
                filterable
                placeholder="仓库"
                style="width:130px;margin-right:5px;"
                @focus="getWarehouseList"
              >
                <el-option
                  v-for="item in warehouseList"
                  :key="item.id"
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
                start-placeholder="申请起始时间"
                end-placeholder="申请截止时间"
              />
              <el-button
                v-permission="['warehouseDragQuery']"
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
              fixed="left"
              prop="examiningNo"
              label="验货申请单ID"
              min-width="150"
              show-overflow-tooltip
            />
            <el-table-column
              fixed="left"
              prop="status"
              label="状态"
              width="100"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.delFlag === 1">
                  已取消
                </span>
                <span v-else>
                  {{ (statusList[scope.row.status - 1] || {}).name }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="left"
              prop="originalNo"
              label="原单号"
              min-width="180"
              show-overflow-tooltip
            />
            <el-table-column
              prop="warehouseName"
              label="仓库名称"
              min-width="180"
              show-overflow-tooltip
            />
            <!-- <el-table-column
              prop="custName"
              label="客户名称"
              min-width="180"
            /> -->
            <el-table-column
              prop="validated"
              label="验货结果"
              width="120"
            >
              <template slot-scope="scope">
                <span v-if="(scope.row.result || {}).validated === 0">
                  不通过
                </span>
                <span v-else-if="(scope.row.result || {}).validated === 1">
                  通过
                </span>
                <span v-else>
                  --
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="section"
              label="验货环节"
              width="120"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.section === 1">
                  入库检验
                </span>
                <span v-if="scope.row.section === 2">
                  退货入库
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="noted"
              label="验货要求"
              min-width="200"
              show-overflow-tooltip
            />
            <el-table-column
              prop="operatorName"
              label="操作人"
              width="150"
            />
            <el-table-column
              prop="applicantName"
              label="申请人"
              width="150"
            />
            <el-table-column
              prop="createTime"
              label="申请时间"
              width="170"
            />
            <el-table-column
              v-if="custType === '1' || custType === '0'"
              prop="reviewerName"
              label="审核人"
              width="150"
            />
            <el-table-column
              v-if="custType === '1' || custType === '0'"
              prop="reviewTime"
              label="审核时间"
              width="170"
            />
            <el-table-column
              v-if="custType === '1' || custType === '0'"
              prop="auditResults"
              label="审核结果"
              width="120"
            />
            <el-table-column
              v-if="custType === '3'"
              prop="warehouseReviewerName"
              label="仓库审核人"
              width="150"
            />
            <el-table-column
              v-if="custType === '3'"
              prop="warehouseReviewTime"
              label="仓库审核时间"
              width="170"
            />
            <el-table-column
              v-if="custType === '3'"
              prop="warehouseReviewResults"
              label="仓库审核结果"
              width="150"
            />
            <el-table-column
              v-if="custType === '2'"
              prop="agencyReviewerName"
              label="代理商审核人"
              width="150"
            />
            <el-table-column
              v-if="custType === '2'"
              prop="agencyReviewTime"
              label="代理商审核时间"
              width="170"
            />
            <el-table-column
              v-if="custType === '2'"
              prop="agencyReviewResults"
              label="代理商审核结果"
              width="150"
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="200px"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['warehouseExamineView']"
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
          :is-edit="isEdit"
          :status-list="statusList"
          @back="detailShow = false"
        />
      </div>
      <!-- <drawer
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
      </drawer> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'

import searchMore from './searchMore.vue'
import drawer from '@/components/Drawer/drawer.vue'
import detail from './detail.vue'
import {
  getExamineList,
  getWHList
} from '@/api/warehose-by-config'
import dayjs from 'dayjs'
import { getCountryByCustSerice } from '@/api/public'

@Component({
  name: 'examine',
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
    validated: undefined,
    originalNo: undefined, // 原单号
    examiningNo: undefined, // 验货单号
    custName: undefined, // 客户名称
    custId: undefined, // 客户名称
    applicantId: undefined, // 申请人
    applicantName: undefined, // 申请人
    warehouseId: undefined, // 仓库id
    warehouseName: undefined, // 仓库id
    section: undefined, // 验货环节
    status: undefined, // 状态
    timeStart: undefined, // 申请起始时间
    timeEnd: undefined, // 申请截止时间
    applyTime: [] // 时间集合
  }

  private tableData: any = []
  private warehouseList: any[] = []
  private countryList: any[] = []
  private total = 0
  private page = 1
  private size = 10
  private loading = false
  private moreShow: boolean = false
  private detailShow: boolean = false
  private selectLoading: boolean = false
  private isEdit: boolean = false
  private statusList: any[] = [
    { id: '1', name: '待验货' },
    { id: '2', name: '验货中' },
    { id: '3', name: '已完成' },
    { id: '4', name: '已取消' }
    // { id: '5', name: '被拒绝' },
    // { id: '6', name: '已拒绝' },
    // { id: '7', name: '待代理商审核' },
    // { id: '8', name: '待仓库审核' },
    // { id: '9', name: '代理商拒绝' },
    // { id: '10', name: '仓库拒绝' }
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
  // 获取国家列表
  private getCountryList() {
    const params = {
      custId: this.custId || '',
      typeId: '04'
    }
    this.selectLoading = true
    getCountryByCustSerice(params)
      .then((res: any) => {
        this.countryList = res.data || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private onCountry() {
    this.searchForm.warehouseId = undefined
    this.warehouseList = []
  }

  // 获取仓库
  private getWarehouseList() {
    this.selectLoading = true
    getWHList({
      model: {
        custId: this.custId,
        countryId: this.searchForm.countryId
      },
      page: 1,
      size: 9999
    })
      .then((res: any) => {
        const data = res.data || {}
        this.warehouseList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

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
    getExamineList(params)
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
    this.isEdit = false
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

<style lang="scss" scoped>
.status-tips {
  text-decoration: line-through #E12E2E;
}
</style>
