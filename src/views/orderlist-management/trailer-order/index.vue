<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        v-show="detailShow === 'i'"
        class="app-container"
      >
        <head-info
          info=""
          title="拖车订单"
        />
        <div class="app-panel">
          <div style="text-align:right;">
            <el-select
              v-if="custType === '0' || custType === '2'"
              v-model="searchForm.orderType"
              placeholder="订单类型"
              style="width:100px;margin-right:5px;"
              size="small"
              @change="onOrderType"
            >
              <el-option
                v-for="item in orderTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-select
              v-if="custType === '2' && custSubtype === '1' && searchForm.orderType === '0'"
              v-model="searchForm.comType"
              size="small"
              style="width:100px;margin-right:5px;"
              placeholder="公司类型"
              clearable
              @change="onComType"
            >
              <el-option
                v-for="(item, index) in companyTypeList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-select
              v-if="(custType === '0' || custType === '2') && searchForm.orderType === '0'"
              v-model="searchForm.comId"
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
              v-model="searchForm.status"

              placeholder="订单状态"
              style="width: 100px;margin-right: 5px;"
              size="small"
              clearable
              filterable
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
              size="small"
              style="width: 100px;margin-right: 5px;"
              placeholder="拖车类型"
              filterable
              clearable
            >
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>

            <el-select
              v-model="searchForm.exportId"
              :loading="selectLoading"
              clearable
              filterable
              placeholder="起运港"
              style="width:130px;margin-right:5px;"
              size="small"
              @focus="getPortList"
            >
              <el-option
                v-for="item in portList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-input
              v-model="searchForm.soCodes"
              size="small"
              style="width:130px;margin-right:5px;"
              placeholder="SO号"
            />
            <el-date-picker
              v-model="searchForm.outTime"
              :clearable="false"
              unlink-panels
              type="daterange"
              align="right"
              size="small"
              value-format="yyyy-MM-dd"
              range-separator="~"
              style="width:240px;margin-right:5px;"
              start-placeholder="取货起始时间"
              end-placeholder="取货截止时间"
            />

            <el-date-picker
              v-model="searchForm.inTime"
              :clearable="false"
              unlink-panels
              type="daterange"
              align="right"
              size="small"
              value-format="yyyy-MM-dd"
              range-separator="~"
              style="width:240px;margin-right:10px;"
              start-placeholder="进仓起始时间"
              end-placeholder="进仓截止时间"
            />
            <el-date-picker
              v-model="searchForm.createTime"
              :clearable="false"
              unlink-panels
              type="daterange"
              align="right"
              size="small"
              value-format="yyyy-MM-dd"
              range-separator="~"
              style="width:240px;margin-right:10px;"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />

            <el-button
              v-permission="['trailerOrderQuery']"
              type="primary"
              size="small"
              @click="getTableData(1)"
            >
              查询
            </el-button>
          </div>

          <el-table
            v-loading="loading"
            :data="tableData"
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              prop="export"
              label="起运港"
              min-width="180"
              show-overflow-tooltip
            />
            <el-table-column
              prop="soCodes"
              label="SO号"
              min-width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.soCodes || []).join(',') }}
              </template>
            </el-table-column>
            <el-table-column
              prop="audit"
              label="审核状态"
              width="120"
            >
              <template slot-scope="scope">
                {{ (auditList.find(e => e.value === scope.row.audit) || {}).label }}
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              label="订单状态"
              width="120"
            >
              <template slot-scope="scope">
                {{ (statusList.find(e => e.value === scope.row.status) || {}).label }}
              </template>
            </el-table-column>
            <el-table-column
              prop="type"
              label="拖车类型"
              width="120"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.type === 0">进口拖车</span>
                <span v-else-if="scope.row.type === 1">出口拖车</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="customerName"
              label="下单客户"
              min-width="150"
              show-overflow-tooltip
            />
            <el-table-column
              v-if="custType === '0'"
              prop="sellerName"
              label="供应商"
              width="150"
              show-overflow-tooltip
            />
            <el-table-column
              v-if="custType === '2'"
              prop="sellerName"
              label="服务提供商"
              width="150"
              show-overflow-tooltip
            />
            <el-table-column
              prop="warehouseTime"
              label="进仓时间"
              width="180"
            />
            <el-table-column
              prop="pickTime"
              label="取货时间"
              width="180"
            />
            <el-table-column
              prop="createTime"
              label="创建时间"
              width="180"
            />
            <el-table-column
              label="操作"
              fixed="right"
              width="250"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['trailerOrderView']"
                  type="text"
                  @click="viewData(scope.row)"
                >
                  查看
                </el-button>
                <el-button
                  v-if="scope.row.isFlag === '0'"
                  v-permission="['trailerOrderSupperier']"
                  type="text"
                  @click="viewSupperier(scope.row)"
                >
                  指定供应商
                </el-button>
                <el-button
                  v-permission="['trailerOrderVehicle']"
                  type="text"
                  @click="allocationCar(scope.row)"
                >
                  分配车辆
                </el-button>
                <el-button
                  v-permission="['trailerOrderFinancial']"
                  type="text"
                  @click="showFinancial(scope.row)"
                >
                  账单信息
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
        v-show="detailShow === 'd'"
        class="app-container"
      >
        <detail
          ref="detailForm"
          @back="detailShow = 'i'"
        />
      </div>
      <div
        v-show="detailShow === 'c'"
        class="app-container"
      >
        <car
          ref="car"
          @back="detailShow = 'i'"
        />
      </div>
      <div
        v-show="detailShow === 'f'"
        class="app-container"
      >
        <order-financial
          ref="financial"
          @back="detailShow = 'i'"
        />
      </div>

      <el-dialog
        title="指定供应商"
        width="600px"
        :close-on-click-modal="false"
        :visible.sync="isSupperierVisible"
        @close="cancelSupperier"
      >
        <div v-loading="formLoading">
          <el-form
            ref="supperierForm"
            :model="supperierForm"
            :rules="rules"
            label-width="100px"
            size="small"
            style="padding-right: 20px;"
          >
            <el-form-item
              label="指派方式"
              prop="type"
            >
              <el-select
                v-model="supperierForm.type"
                placeholder="请选择"
                style="width:100%;"
                size="small"
                @change="onSupperType"
              >
                <el-option
                  label="默认供应商"
                  value="1"
                />
                <el-option
                  label="指定供应商"
                  value="2"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="报关行"
              prop="supplyId"
            >
              <el-input
                v-if="supperierForm.type === '1'"
                v-model="supperierForm.name"
                clearable
                placeholder="请输入"
                :maxlength="20"
              />
              <el-select
                v-else-if="supperierForm.type === '2'"
                v-model="supperierForm.supplyId"
                placeholder="请选择"
                style="width:100%;"
                size="small"
                :loading="selectLoading"
                @focus="getCustTypeList"
              >
                <el-option
                  v-for="item in supplierList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            style="text-align: right;padding-top: 20px;"
          >
            <el-button
              size="small"
              @click="cancelSupperier"
            >
              取 消
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="confirmSupperier"
            >
              确 定
            </el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'

import {
  getOrderList,
  getPortList,
  getSupplierList,
  getCustTypeList,
  getAgentList,
  getCustomerList,
  deleteOrder,
  saveSupperier
} from '@/api/orderlist-at-trailer'
import detail from '@/views/orderlist-management/trailer-order/detail.vue'
import car from '@/views/orderlist-management/trailer-order/car.vue'
import orderFinancial from '@/views/orderlist-management/trailer-order/orderFinancial.vue'
import dayjs from 'dayjs'

@Component({
  name: '',
  components: {
    detail,
    car,
    orderFinancial
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private detailShow: string = 'i' // i为列表 d为详情 c为分配车辆
  private loading: boolean = false
  private formLoading: boolean = false
  private isSupperierVisible: boolean = false
  private selectLoading: boolean = false
  private isEdit: boolean = false
  private companyTypeList: any[] = [
    { id: '1', name: '客户' },
    { id: '2', name: '二级代理商' }
  ]
  private orderTypeList: any[] = [
    { name: '销售订单', id: '0' },
    { name: '采购订单', id: '1' }
  ]

  private typeList = [
    { name: '进口拖车', id: 0 },
    { name: '出口拖车', id: 1 }
  ]
  private portList: any[] = []
  private companyList: any[] = []
  private selectType = '1'
  private tableData: any[] = []
  private statusList: any[] = [
    {
      value: 0,
      label: '待分配'
    },
    {
      value: 1,
      label: '部分已分配'
    },
    {
      value: 2,
      label: '分配完成'
    }
  ]
  private auditList: any[] = [
    {
      value: 0,
      label: '待审核'
    },
    {
      value: 1,
      label: '审核通过'
    },
    {
      value: 2,
      label: '审核拒绝'
    },
    {
      value: 3,
      label: '审核中'
    }
  ]
  private searchForm: any = {
    status: undefined,
    soCodes: undefined,
    type: undefined,
    custId: undefined,
    outTime: [],
    exportId: undefined,
    comId: undefined,
    comType: '',
    orderType: '1',
    inTime: [],
    createTime: []
  }
  private title = ''
  private customsId = ''
  private page: number = 1
  private size: number = 10
  private total: any = 0
  private supperierForm: any = {
    supplyId: undefined,
    name: undefined,
    type: '1'
  }
  private rules: any = {
    type: { required: true, message: '请选择指派方式', trigger: 'change' },
    supplyId: { required: true, message: '请选择报关行', trigger: 'change' }
  }
  private supplierList: any[] = []

  /* computed */
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
  get custSubtype(): string {
    const info = UserModule.info || {}
    const custSubtype = (info as any).custSubtype
    return custSubtype
  }
  get parentId(): string {
    const info = UserModule.info || {}
    const parentId = (info as any).parentId
    return parentId
  }
  get parentName(): string {
    const info = UserModule.info || {}
    const parentName = (info as any).parentName
    return parentName
  }

  /* methods */
  private showFinancial(row: any) {
    if (!row.sellerId) {
      this.$message.warning('请指定供应商')
      return
    }
    if (!row.soCodes || row.soCodes.length === 0) {
      this.$message.warning('暂无SO')
      return
    }
    this.detailShow = 'f'
    const root: any = this.$refs.financial
    root.show(row)
  }
  private allocationCar(row: any) {
    this.detailShow = 'c'
    const carDom: any = this.$refs.car
    carDom.show(row)
  }
  private onOrderType() {
    this.tableData = []
    if (this.searchForm.orderType === '1') {
      this.searchForm.comType = ''
      this.searchForm.comId = ''
      this.companyList = []
    }
    this.getTableData(1)
  }
  private onComType() {
    // 仅一级代理商可操作
    this.searchForm.comId = ''
    this.companyList = []
    this.tableData = []
  }
  private onCompany() {
    this.tableData = []
    this.getTableData(1)
  }
  private getCompanyList() {
    const params:any = {
      page: 1,
      size: 9999
    }
    const type = (this as any).custType
    const subType = (this as any).custSubtype
    let func:any = null
    if (type === '2' && (this.searchForm.comType === '1' || subType === '2')) {
      params.custIds = [(this as any).custId]
      func = getCustomerList
    } else if (type === '2' && this.searchForm.comType === '2') {
      params.parentId = this.custId
      params.subtype = '2'
      params.types = '06'
      func = getAgentList
    } else if (type === '0') {
      params.parentId = this.custId
      params.subtype = '1'
      params.types = '06'
      func = getAgentList
    } else {
      this.companyList = []
      return
    }
    this.selectLoading = true
    func(params).then((res:any) => {
      if (type === '2' && (this.searchForm.comType === '1' || subType === '2')) {
        const data = res.data || []
        this.companyList = data
      } else {
        const data = res.data || {}
        this.companyList = data.result || []
      }
      this.selectLoading = false
    }).catch((err:any) => {
      this.selectLoading = false
      return err
    })
  }

  // 获取国家列表
  private getPortList() {
    this.selectLoading = true
    getPortList({
      page: 1,
      size: 9999
    })
      .then((res: any) => {
        const data = res.data || {}
        this.portList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private onSupperType() {
    this.supperierForm.supplyId = undefined
  }
  private getCustTypeList() {
    const params = {
      page: 1,
      size: 9999,
      cas: 'S',
      typeId: '06',
      subtypeId: this.supperierForm.subtypeId
    }
    return getCustTypeList(params).then((res: any) => {
      const data = res.data || {}
      const result = data.result || []
      this.supplierList = JSON.parse(
        JSON.stringify(result)
          .replace(/custName/g, 'name')
          .replace(/custId/g, 'id')
      )
    }).catch((err: any) => {
      return err
    })
  }

  private viewSupperier(row: any) {
    this.isSupperierVisible = true
    this.supperierForm.declareId = row.id
    this.supperierForm.subtypeId = row.type
  }

  private confirmSupperier(row: any): void {
    const form: any = this.$refs.supperierForm
    form.validate((valid: any) => {
      if (!valid) return false
      this.formLoading = false
      saveSupperier(this.supperierForm)
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.formLoading = false
          this.isSupperierVisible = false
          this.getTableData()
        }).catch((err: any) => {
          this.formLoading = false
          return err
        })
    })
  }

  private cancelSupperier() {
    this.isSupperierVisible = false
    this.resetSupperierForm()
  }

  // 重置表单
  private resetSupperierForm() {
    this.supperierForm = {
      supplyId: undefined,
      type: '1'
    }
    const root: any = this.$refs.supperierForm
    root.clearValidate()
  }

  private viewData(row: any) {
    // 查看
    this.detailShow = 'd'
    const root: any = this.$refs.detailForm
    root.setData(row)
  }
  private deleteData(row: any) {
    const params = {
      id: row.id
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        let func = null
        func = deleteOrder
        if (!func) return
        func(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getTableData()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }

  // 列表查询
  private getTableData(val?: any): void {
    this.loading = true
    const type = (this as any).custType
    if (type === '1') { // 客户
      this.searchForm.orderType = '1'
    } else if (type === '3') { // 供应商
      this.searchForm.orderType = '0'
    }
    const { comId, comType, orderType, createTime, custId, inTime, outTime, code, ...form }: any = this.searchForm
    if (val) {
      this.page = val
    }
    const params: any = {
      page: this.page,
      size: this.size,
      model: {
        ...form
      }
    }
    if (orderType === '0') { // 销售
      params.model.sellerId = custId
      params.model.customerId = type === '3' ? '0' : comId
    } else if (orderType === '1') { // 采购
      params.model.customerId = custId
    }
    if (Array.isArray(outTime) && outTime.length > 0) {
      params.model.pikeStartTime = outTime[0] + ' 00:00:00'
      params.model.pikeEndTime = outTime[1] + ' 23:59:59'
    }
    if (Array.isArray(inTime) && inTime.length > 0) {
      params.model.warehouseStartTime = inTime[0] + ' 00:00:00'
      params.model.warehouseEndTime = inTime[1] + ' 23:59:59'
    }
    if (Array.isArray(createTime) && createTime.length > 0) {
      params.model.startTime = createTime[0] + ' 00:00:00'
      params.model.endTime = createTime[1] + ' 23:59:59'
    }
    getOrderList(params)
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

  // 分页
  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.getTableData()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.getTableData()
  }
  private created(): void {
    this.searchForm.custId = (this as any).custId
    this.searchForm.createTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    this.getTableData()
  }
}
</script>

<style lang="scss" scoped>
</style>
