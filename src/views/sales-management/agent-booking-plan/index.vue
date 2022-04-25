<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="发货计划"
        />
        <div
          class="app-panel"
        >
          <el-row>
            <el-col
              :span="2"
            >
              <el-button
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-left: 10px"
                @click="addProduct"
              >
                新增
              </el-button>
            </el-col>
            <el-col
              :span="22"
              style="text-align:right;"
            >
              <el-select
                v-if="custType === '0'"
                v-model="selectValue.comId"
                :loading="selectLoading"
                size="small"
                style="width:130px;margin-right:5px;"
                placeholder="所属公司"
                filterable
                clearable
                @change="onCompany"
                @focus="getCompanyList"
              >
                <el-option
                  v-for="item in companyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.type"
                :loading="selectLoading"
                placeholder="业务类型"
                size="small"
                style="width:100px;margin-right:5px;"
                clearable
                filterable
                @focus="getBusinessType"
                @change="onType"
              >
                <el-option
                  v-for="item in typelist"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select
                v-model="selectValue.countryId"
                :loading="selectLoading"
                size="small"
                clearable
                filterable
                placeholder="目的国"
                style="width:130px;margin-right:5px;"
                @focus="getCountryList"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.bscId"
                :loading="selectLoading"
                :disabled="!selectValue.type"
                clearable
                filterable
                size="small"
                style="width:130px;margin-right:5px;"
                placeholder="服务"
                @focus="getBscList"
                @change="onFlight"
              >
                <el-option
                  v-for="item in flightList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.bscTransId"
                :loading="selectLoading"
                :disabled="!selectValue.bscId"
                clearable
                filterable
                size="small"
                style="width:130px;margin-right:5px;"
                placeholder="服务商"
                @focus="getBsTransList"
              >
                <el-option
                  v-for="item in bsTransList"
                  :key="item.id"
                  :label="`${item.orgName + '/' + item.serviceCode}`"
                  :value="item.id"
                />
              </el-select>
              <el-date-picker
                v-model="selectValue.shipTime"
                unlink-panels
                clearable
                type="daterange"
                align="right"
                size="small"
                value-format="yyyy-MM-dd"
                range-separator="~"
                style="width:240px;margin-right:5px;"
                start-placeholder="起始时间"
                end-placeholder="截止时间"
              />
              <el-input
                v-model="selectValue.bscName"
                placeholder="服务名称"
                class="input-with-select"
                style="width: 180px;margin-right:10px;"
                size="small"
                clearable
              />
              <el-button
                type="primary"
                size="small"
                @click="queryAll(1)"
              >
                查询
              </el-button>
            </el-col>
          </el-row>

          <el-table
            ref="planTable"
            v-loading="loading"
            :data="tableData"
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              width="120"
              label="业务类型"
            >
              <template
                slot-scope="scope"
              >
                {{ (typelist.find(it => it.value === scope.row.type) || {}).label }}
              </template>
            </el-table-column>
            <el-table-column
              prop="countryName"
              min-width="120"
              label="目的国"
            />
            <el-table-column
              prop="bscName"
              min-width="180"
              label="订舱服务"
              show-overflow-tooltip
            />

            <el-table-column
              prop=""
              width="120"
            >
              <template
                slot="header"
              >
                体积/重量
              </template>
              <template
                slot-scope="scope"
              >
                {{ (scope.row.type === '1' || scope.row.type === '2') ? scope.row.volume + 'CBM' : scope.row.weight + 'KG' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="year"
              width="100"
              label="年度"
            />
            <el-table-column
              prop="periodName"
              min-width="120"
              label="期间"
            />
            <el-table-column
              prop="createTime"
              width="180"
              label="创建时间"
            />
            <el-table-column
              fixed="right"
              width="200"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="editProduct(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  @click="deleteProduct(scope.row)"
                >
                  删除
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

          <el-dialog
            :title="dialogTitle"
            width="960px"
            :visible.sync="isAddEditVisible"
            :close-on-click-modal="false"
            @closed="cancel"
          >
            <addEditForm
              ref="addEditForm"
              :is-edit="isEdit"
              @cancel="cancel"
              @queryAll="queryAll"
            />
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getDeliveryList,
  deleteDelivery,
  getCountryList,
  getWordsList,
  getBsTransList,
  getBscList,
  getAgentList
} from '@/api/sales-of-agent-plan'

import addEditForm from '@/views/sales-management/agent-booking-plan/addEditForm.vue'
import dayjs from 'dayjs'

@Component({
  name: '',
  components: {
    addEditForm
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private dialogTitle: string = ''
  private isAddEditVisible: boolean= false
  private isEdit: boolean = false
  private loading: boolean = false
  private tableData: any = []
  private selectValue: any = {
    countryId: undefined,
    bscId: undefined,
    comId: undefined,
    bscTransId: undefined,
    type: undefined,
    bscName: undefined,
    shipTime: []
  }
  private selectLoading: boolean = false
  private page: number = 1
  private size: number = 10
  private total: any = 0
  private countryList: any[] = []
  private companyList: any[] = []
  private typelist: any[] = []
  private bsTransList: any[] = []
  private flightList: any[] = []

  /* computed */
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }

  get custSubtype(): string {
    const info = UserModule.info || {}
    const custSubtype = (info as any).custSubtype
    return custSubtype
  }
  get custId():string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }
  // 所属公司Name
  get custName(): string {
    const info = UserModule.info || {}
    const custName = (info as any).custName
    return custName
  }

  /* methods */
  private getCompanyList() {
    this.selectLoading = true
    const params = {
      page: 1,
      size: 9999,
      parentId: (this as any).custId
    }
    getAgentList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.companyList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private async getBusinessType() {
    this.selectLoading = true
    const params = {
      type: 'BOOKING_BUSINESS_TYPE'
    }
    await getWordsList(params).then((res: any) => {
      if (res.success) {
        this.typelist = res.data || []
        this.selectLoading = false
      }
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }
  private onType() {
    this.flightList = []
    this.bsTransList = []
    this.selectValue.bscId = undefined
    this.selectValue.bscTransId = undefined
  }
  private onFlight() {
    this.selectValue.bscTransId = undefined
    this.bsTransList = []
    this.getCountryList()
    this.flightList.map((it: any) => {
      if (this.selectValue.bscId === it.id) {
        this.selectValue.countryId = it.countryToId
      }
    })
  }
  private onCompany(val: any) {
    this.tableData = []
    this.queryAll(1)
  }
  private getCountryList() {
    this.selectLoading = true
    getCountryList().then((res: any) => {
      this.selectLoading = false
      if (res.success) {
        const data = res.data || {}
        this.countryList = data.result || []
      }
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }
  private getBscList() {
    this.selectLoading = true
    const params:any = {
      page: 1,
      size: 99999,
      conveyance: this.selectValue.type,
      countryToId: this.selectValue.countryId
    }
    getBscList(params)
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result
        this.flightList = result.map((item: any) => {
          item.id = item.id + ''
          return item
        })
        this.selectLoading = false
      }).catch((err: any) => {
        this.selectLoading = false
        return [err, null]
      })
  }
  private getBsTransList() {
    const params = {
      page: 1,
      size: 999,
      model: {
        id: this.selectValue.bscId
      }
    }
    this.selectLoading = true
    getBsTransList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.bsTransList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private queryAll(val?: any): void {
    this.loading = true
    const { shipTime, comId, ...form } = this.selectValue
    if (val) {
      this.page = val
    }
    const params:any = {
      page: this.page,
      size: this.size,
      model: {
        ...form,
        companyId: comId
      }
    }
    if (Array.isArray(shipTime) && shipTime.length > 0) {
      params.model.startTime = shipTime[0] + ' 00:00:00'
      params.model.endTime = shipTime[1] + ' 23:59:59'
    }
    getDeliveryList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.tableData = data.result || []
        this.total = data.total
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

  // 添加
  private async addProduct() {
    this.isAddEditVisible = true
    this.dialogTitle = '新增发货计划'
    this.isEdit = false
  }
  // 编辑
  private async editProduct(row: any) {
    this.isAddEditVisible = true
    this.dialogTitle = '编辑发货计划'
    this.isEdit = true
    this.$nextTick(() => {
      const root: any = this.$refs.addEditForm
      root.setData(row)
    })
  }
  private cancel() {
    this.isAddEditVisible = false
    this.clearValidate()
  }
  private clearValidate() {
    this.$nextTick(() => {
      const addEditDom:any = this.$refs.addEditForm
      const root:any = addEditDom.$refs.selectForm
      addEditDom.resetForm()
      root.clearValidate()
    })
  }

  private deleteProduct(row: any) {
    this.$confirm('请确认是否删除该计划?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.loading = true
        deleteDelivery({
          id: row.id
        }).then((res:any) => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.queryAll()
        }).catch((err: any) => {
          this.loading = false
          return err
        })
      })
      .catch(() => {
        return false
      })
  }

  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.queryAll()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.queryAll()
  }
  private async created() {
    this.selectValue.shipTime = [dayjs().startOf('month').format('YYYY-MM-DD'), dayjs().endOf('month').format('YYYY-MM-DD')]
    await this.getBusinessType()
    this.queryAll()
  }
}
</script>
<style lang="scss" scoped>
  .el-table .cell{
      white-space:pre-line;
  }
</style>
