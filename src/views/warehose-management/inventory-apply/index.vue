<template>
  <div
    class="inventory-form"
    style="display: flex;flex-flow: row nowrap;min-height: inherit;"
  >
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        v-show="showPage === 'i'"
        class="app-container"
      >
        <head-info
          info=""
          title="盘点申请单"
        />
        <div class="app-panel">
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-button
                v-permission="['inventoryApplyAdd']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="float: left;"
                @click="add"
              >
                新增盘点
              </el-button>
              <el-select
                v-model="searchForm.status"
                placeholder="状态"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select
                v-model="searchForm.type"
                placeholder="盘点方式"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select
                v-model="searchForm.warehouseId"
                placeholder="仓库名称"
                size="small"
                clearable
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
                align="right"
                size="small"
                style="width:240px;margin-right:10px;"
                range-separator="~"
                start-placeholder="申请起始时间"
                end-placeholder="申请截止时间"
              />
              <el-input
                v-model="searchForm.code"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
                placeholder="原单号"
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
              prop="inventoryCode"
              label="盘点申请单"
              fixed="left"
              width="180px"
            />
            <el-table-column
              width="80px"
              label="状态"
            >
              <template slot-scope="scope">
                {{ (statusList.find(e => e.value === scope.row.status) || {}).label }}
              </template>
            </el-table-column>
            <el-table-column
              width="90px"
              label="盘点方式"
            >
              <template slot-scope="scope">
                {{ (typeList.find(e => e.value === scope.row.type) || {}).label }}
              </template>
            </el-table-column>
            <el-table-column
              prop="warehouseName"
              min-width="100px"
              show-overflow-tooltip
              label="仓库名称"
            />
            <el-table-column
              prop="totalNumber"
              width="110px"
              label="理论票数"
            />
            <el-table-column
              prop="totalPackages"
              width="110px"
              label="理论件数"
            />
            <el-table-column
              prop="totalTowage"
              width="110px"
              label="理论托数"
            />
            <el-table-column
              width="110px"
              prop="actualTotalNumber"
              label="实盘票数"
            />
            <el-table-column
              width="110px"
              prop="actualTotalPackages"
              label="实盘件数"
            />
            <el-table-column
              width="110px"
              prop="actualTotalTowage"
              label="实盘托数"
            />
            <el-table-column
              prop="applicantTime"
              label="申请时间"
              width="160px"
            />
            <el-table-column
              prop="completeTime"
              label="完成时间"
              width="160px"
            />
            <el-table-column
              prop="ifStock"
              width="80px"
              label="库存锁"
            >
              <template slot-scope="scope">
                {{ scope.row.ifStock ? '已锁' : '未锁' }}
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="150px"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['inventoryApplyView']"
                  type="text"
                  @click="editAndView(scope.row)"
                >
                  查看
                </el-button>
                <el-button
                  v-if="$checkPermission(['inventoryApplyEdit']) && ![1, 2, 3].includes(scope.row.status)"
                  type="text"
                  @click="edit(scope.row)"
                >
                  编辑
                </el-button>
                <!--<el-button
                  type="text"
                >
                  审核
                </el-button>
                <el-button
                  type="text"
                  @click="release(scope.row)"
                >
                  释放库存锁
                </el-button>-->
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            :current-page.sync="pagination.page"
            :page-size="pagination.size"
            layout="total, prev, pager, next"
            :total="pagination.total"
            style="text-align: right;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <detail
        v-show="showPage === 'd'"
        ref="detail"
        :inventory-type-list="typeList"
        :warehouse-list="warehouseList"
        @back="goBack"
      />
      <option-detail
        v-show="showPage === 'o'"
        ref="optionDetail"
        :inventory-type-list="typeList"
        :status-list="statusList"
        @back="goBack"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import dayjs from 'dayjs'
import {
  getWHList,
  getInventoryList,
  release
} from '@/api/warehose-by-config'
import detail from '@/views/warehose-management/inventory-apply/detail.vue'
import optionDetail from '@/views/warehose-management/inventory-apply/option-detail.vue'
@Component({
  name: 'inventory',
  components: {
    detail,
    optionDetail
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private tableData: any[] = []
  private loading: boolean = false
  private showPage: string = 'i'
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  private searchForm: any = {
    code: '',
    status: '',
    type: '',
    applyTime: []
  }
  private statusList: any[] = [
    {
      value: 0,
      label: '待盘点'
    },
    {
      value: 1,
      label: '盘点中'
    },
    {
      value: 2,
      label: '已完成'
    },
    {
      value: 3,
      label: '已取消'
    }
  ]
  private typeList: any[] = [
    {
      value: 0,
      label: '按订单'
    },
    {
      value: 1,
      label: '按库位'
    }
    // {
    //   value: 2,
    //   label: '按仓库'
    // }
  ]
  private warehouseList: any[] = []

  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }

  /* methods */
  private goBack(val: boolean) {
    this.showPage = 'i'
    if (val) {
      this.handleSearch()
    }
  }
  private add() {
    this.showPage = 'd'
    const el: any = this.$refs.detail
    el.show()
  }
  private edit(row: any) {
    this.showPage = 'd'
    const el: any = this.$refs.detail
    el.show(row)
  }
  private release(row: any) {
    this.$confirm('请确认是否释放此盘点申请单锁定的库存?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const params = {
        id: row.id
      }
      this.loading = true
      release(params).then(() => {
        this.loading = false
        this.$message.success('操作成功')
      }).catch(() => {
        this.loading = false
      })
    }).catch(() => false)
  }
  private editAndView(row: any) {
    this.showPage = 'o'
    const el: any = this.$refs.optionDetail
    el.show(row)
  }
  private getWarehouseList() {
    if (this.warehouseList.length) return
    getWHList({
      model: {
        custId: this.custId
      },
      page: 1,
      size: 9999
    })
      .then((res: any) => {
        const data = res.data || {}
        this.warehouseList = data.result || []
      })
      .catch((err: any) => {
        this.warehouseList = []
        return err
      })
  }
  private handleSearch(page?: number) {
    if (page === 1) {
      this.pagination.page = 1
    }
    const model: any = {
      ...this.searchForm
    }
    delete model.applyTime
    model.startTime = this.searchForm.applyTime[0] + ' 00:00:00'
    model.endTime = this.searchForm.applyTime[1] + ' 23:59:59'
    const params = {
      model,
      page: this.pagination.page,
      size: this.pagination.size
    }
    this.loading = true
    getInventoryList(params).then((res: any) => {
      this.loading = false
      const data = res.data || {}
      this.tableData = data.result || []
      this.pagination.total = data.total || 0
    }).catch(() => {
      this.loading = false
      this.tableData = []
      this.pagination.total = 0
    })
  }
  private handleSizeChange(val: string) {
    this.pagination.size = Number(val)
    this.handleSearch()
  }
  private handleCurrentChange(val: string) {
    this.pagination.page = Number(val)
    this.handleSearch()
  }
  private created() {
    this.searchForm.applyTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    this.handleSearch()
    this.getWarehouseList()
  }
}
</script>

<style lang="scss" scoped>
</style>
