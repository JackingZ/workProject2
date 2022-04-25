<template>
  <div
    class="discharge-form"
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
          title="卸货申请单"
        />
        <div class="app-panel">
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-input
                v-model="searchForm.originalNo"
                size="small"
                style="width:130px;margin-right:5px;"
                placeholder="原单号"
              />
              <el-input
                v-model="searchForm.unloadNo"
                size="small"
                style="width:130px;margin-right:5px;"
                placeholder="卸货申请单号"
              />
              <!-- <el-input
                v-model="searchForm.custName"
                size="small"
                style="width:130px;margin-right:5px;"
                placeholder="客户名称"
              /> -->
              <el-select
                v-model="searchForm.unloadType"
                placeholder="卸货类型"
                size="small"
                clearable
                style="width:110px;margin-right:5px;"
              >
                <el-option
                  label="整车"
                  :value="1"
                />
                <el-option
                  label="整柜"
                  :value="2"
                />
                <el-option
                  label="快递"
                  :value="3"
                />
              </el-select>
              <el-select
                v-model="searchForm.unloadStatus"
                placeholder="状态"
                size="small"
                clearable
                style="width:110px;margin-right:5px;"
              >
                <el-option
                  label="待卸货"
                  :value="1"
                />
                <el-option
                  label="卸货中"
                  :value="2"
                />
                <el-option
                  label="已完成"
                  :value="3"
                />
                <el-option
                  label="已取消"
                  :value="4"
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
                align="right"
                size="small"
                style="width:240px;margin-right:5px;"
                range-separator="~"
                start-placeholder="申请起期"
                end-placeholder="申请止期"
              />
              <el-input
                v-model="searchForm.value"
                size="small"
                style="width:250px;margin-right:10px;"
                placeholder="请输入"
              >
                <el-select
                  slot="prepend"
                  v-model="searchForm.key"
                  style="width: 80px;"
                >
                  <el-option
                    label="车牌"
                    :value="1"
                  />
                  <el-option
                    label="柜号"
                    :value="2"
                  />
                </el-select>
              </el-input>
              <el-button
                v-permission="['warehouseConfigQuery']"
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
              prop="unloadNo"
              label="卸货申请单ID"
              min-width="140"
              show-overflow-tooltip
            />
            <el-table-column
              fixed="left"
              prop="unloadStatus"
              label="状态"
              width="100"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div v-if="scope.row.unloadStatus === 1">
                  待卸货
                </div>
                <div v-else-if="scope.row.unloadStatus === 2">
                  卸货中
                </div>
                <div v-else-if="scope.row.unloadStatus === 3">
                  已完成
                </div>
                <div v-else-if="scope.row.unloadStatus === 4">
                  已取消
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="warehouseName"
              label="仓库名称"
              min-width="150"
              show-overflow-tooltip
            />
            <!-- <el-table-column
              prop="custName"
              label="客户名称"
              min-width="150px"
            />
            <el-table-column
              prop="lineNo"
              label="排队序号"
              width="100px"
            /> -->
            <el-table-column
              prop="executorName"
              label="操作人"
              width="150"
            />
            <el-table-column
              prop="assignorName"
              label="申请人"
              width="150"
            />
            <el-table-column
              prop="createTime"
              label="申请时间"
              width="180"
            />
            <el-table-column
              prop="unloadType"
              label="卸货类型"
              width="100"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.unloadType === 1">
                  整车
                </div>
                <div v-else-if="scope.row.unloadType === 2">
                  整柜
                </div>
                <div v-else-if="scope.row.unloadType === 3">
                  快递
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="licenseNo"
              label="车牌/柜/快递号"
              min-width="120"
            />
            <el-table-column
              prop="driversName"
              label="司机姓名"
              min-width="100"
            />
            <el-table-column
              prop="driversMobile"
              label="司机联系电话"
              width="120"
            />
            <el-table-column
              prop="expectedUnloadTime"
              label="预计卸货时间"
              width="180"
            />
            <el-table-column
              prop="expectedWcName"
              label="预计卸货口"
              min-width="100"
            />
            <el-table-column
              prop="warehouseContactPerson"
              label="仓库对接人"
              min-width="100"
            />
            <el-table-column
              prop="actualUnloadStartTime"
              label="实际卸货时间"
              width="180"
            />
            <el-table-column
              prop="actualUnloadEndTime"
              label="卸货完成时间"
              width="180"
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="100"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['warehouseUnloadView']"
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
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'

import detail from '@/views/warehose-management/unloading-apply/detail.vue'
import dayjs from 'dayjs'
import {
  getUnloadList,
  getWHList
} from '@/api/warehose-by-config'
import { getCountryByCustSerice } from '@/api/public'
@Component({
  name: 'discharge',
  components: {
    detail
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private searchForm: any = {
    applyTime: [],
    applyTimeEnd: undefined,
    applyTimeStart: undefined,
    custName: undefined,
    key: 1,
    originalNo: undefined,
    unloadNo: undefined,
    unloadStatus: undefined,
    unloadType: undefined,
    value: undefined,
    warehouseId: undefined,
    countryId: undefined,
    wcId: undefined
  }
  private tableData: any = []
  private warehouseList: any[] = []
  private countryList: any[] = []
  private total = 0
  private size = 10
  private page = 1
  private loading = false
  private moreShow: boolean = false
  private detailShow: boolean = false
  private selectLoading: boolean = false

  // computed
  // 所属公司id
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
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
      model.applyTimeStart = applyTime[0]
      model.applyTimeEnd = applyTime[1]
    }
    if (val) {
      this.page = val
    }
    const params = {
      model,
      page: this.page,
      size: this.size
    }
    getUnloadList(params)
      .then(res => {
        const data = res.data || {}
        this.tableData = data.result || []
        this.total = data.total
        this.loading = false
      })
      .catch(err => {
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
    this.searchForm.applyTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    this.handleSearch()
  }
}
</script>

<style lang="scss" scoped>
</style>
