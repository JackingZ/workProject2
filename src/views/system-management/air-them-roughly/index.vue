<template>
  <div class="app-container">
    <div v-show="!showDetails">
      <head-info
        title="航空号段"
        info=""
      />
      <div
        v-loading="loading"
        class="app-panel"
      >
        <el-row :gutter="20">
          <el-col :span="2">
            <el-button
              v-permission="['airlineNumberAllot']"
              type="text"
              size="small"
              @click="showAllotModal"
            >
              分配
            </el-button>
            <el-button
              v-if="custType === '0' && $checkPermission(['airlineNumberImport'])"
              type="text"
              size="small"
              @click="showImportModal"
            >
              导入
            </el-button>
          </el-col>
          <el-col :span="22">
            <div style="text-align: right;">
              <el-select
                v-model="searchForm.airlinesId"
                placeholder="航空公司"
                size="small"
                filterable
                clearable
                style="width:200px;margin-right:5px;"
                @change="loadData(1)"
              >
                <el-option
                  v-for="item in airlinesList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>

              <el-button
                v-permission="['airlineNumberQuery']"
                type="primary"
                size="small"
                @click="loadData(1)"
              >
                查询
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-table
          :data="tableData"
          border
          height="calc(100vh - 313px)"
          style="width: 100%;margin: 10px 0;"
        >
          <el-table-column
            prop="airlineCompany"
            label="航空公司"
          />
          <el-table-column
            prop="total"
            label="总数量"
          />
          <el-table-column
            prop="surplus"
            label="剩余数量"
          />
          <el-table-column
            prop="allocated"
            label="已分配"
          />
          <el-table-column
            prop="printedOrder"
            label="已打单"
          />
          <el-table-column
            prop="shipped"
            label="已发运"
          />
          <el-table-column
            fixed="right"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="showLog(scope.row)"
              >
                操作日志
              </el-button>
              &nbsp;
              <el-button
                type="text"
                size="small"
                @click="showRowDetails(scope.row)"
              >
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="pagination.page"
          :page-size="pagination.size"
          layout="total, prev, pager, next"
          :total="pagination.total"
          style="text-align: right;"
          @current-change="handleCurrentChange"
        />
      </div>
      <import-modal
        ref="importModal"
        :airlines-list="airlinesList"
        @load="loadData(1)"
      />
      <allot-modal
        ref="allotModal"
        @load="loadData(1)"
      />
      <operation-log ref="operationLog" />
    </div>
    <row-details
      v-show="showDetails"
      ref="rowDetails"
      @goBack="goBack"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { getSectionList, getAirlinesList } from '@/api/system-in-air-them-roughly'
import importModal from '@/views/system-management/air-them-roughly/components/importModal.vue'
import allotModal from '@/views/system-management/air-them-roughly/components/allotModal.vue'
import operationLog from '@/views/system-management/air-them-roughly/components/operationLog.vue'
import rowDetails from '@/views/system-management/air-them-roughly/components/rowDetails.vue'

@Component({
  name: 'AirThemRoughly',
  components: {
    importModal,
    allotModal,
    operationLog,
    rowDetails
  }
})
export default class AirThemRoughly extends Vue {
  /* data */
  private loading: boolean = false
  private showDetails: boolean = false
  private searchForm: any = {
    airlinesId: undefined
  }
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  private tableData: any[] = []
  private airlinesList: any[] = []

  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }

  /* methods */
  private goBack() {
    this.loadData()
    this.showDetails = false
  }

  private showRowDetails(row: any) {
    (this.$refs.rowDetails as any).show(row)
    this.showDetails = true
  }

  private showLog(row: any) {
    (this.$refs.operationLog as any).show(row)
  }

  private showAllotModal() {
    (this.$refs.allotModal as any).show()
  }

  private showImportModal() {
    (this.$refs.importModal as any).show()
  }

  private handleCurrentChange(page: any) {
    this.pagination.page = page
    this.loadData()
  }

  private getAirlinesList(): void {
    const params = {
      type: 2,
      page: 1,
      size: 999
    }
    getAirlinesList(params).then((res: any) => {
      if (res.success) {
        const data = res.data || {}
        this.airlinesList = data.result || []
      }
    }).catch((err: any) => {
      this.airlinesList = []
      return err
    })
  }

  private loadData(page?: number): void {
    if (page === 1) {
      this.pagination.page = 1
    }
    const params: any = {
      model: this.searchForm.airlinesId || '',
      page: this.pagination.page,
      size: this.pagination.size
    }
    this.loading = true
    getSectionList(params).then((res: any) => {
      this.loading = false
      if (res.success) {
        const data = res.data || {}
        this.tableData = data.result || []
        this.pagination.total = data.total || 0
      }
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }

  /* hooks */
  private created(): void {
    this.loadData()
    this.getAirlinesList()
  }
}
</script>

<style lang="scss" scoped>
</style>
