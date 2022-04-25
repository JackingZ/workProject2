<template>
  <div
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
          title="对账单"
        />
        <div class="app-panel">
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-button
                v-permission="['checkOrderAdd']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="float: left;"
                @click="handleAdd"
              >
                新增
              </el-button>
              <el-select
                v-if="(custType === '2' && custSubtype === '1')"
                v-model="searchForm.comType"
                size="small"
                style="width:100px;margin-right:5px;"
                placeholder="公司类型"
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
                v-if="searchForm.comType === '2'"
                v-model="searchForm.comId"
                :loading="selectLoading"
                size="small"
                style="width:170px;margin-right:5px;"
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
              <el-date-picker
                v-model="searchForm.year"
                type="year"
                value-format="yyyy"
                placeholder="年度"
                size="small"
                style="width: 130px;margin-right:5px;"
                @change="searchForm.fisCalId = ''"
              />
              <el-select
                v-model="searchForm.fisCalId"
                :loading="selectLoading"
                :disabled="!searchForm.year || (searchForm.comType === '2' && !searchForm.comId)"
                placeholder="会计期间"
                size="small"
                clearable
                style="width: 130px;margin-right:5px;"
                @focus="getFiscalList"
              >
                <el-option
                  v-for="(item, index) in fiscalList"
                  :key="index"
                  :label="item.fiscalPeriod"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="searchForm.type"
                placeholder="类型"
                size="small"
                clearable
                style="width:100px;margin-right:5px;"
              >
                <el-option
                  v-for="(item, index) in typeList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>

              <el-select
                v-model="searchForm.ifClose"
                placeholder="是否关账"
                size="small"
                clearable
                style="width:130px;margin-right:10px;"
              >
                <el-option
                  label="否"
                  :value="0"
                />
                <el-option
                  label="是"
                  :value="1"
                />
              </el-select>
              <el-button
                v-permission="['checkOrderSearch']"
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
              prop="year"
              label="年度"
              width="100"
            />
            <el-table-column
              prop="fisCalName"
              label="会计期间"
            />
            <el-table-column
              prop=""
              label="类型"
              width="100"
            >
              <template slot-scope="scope">
                {{ (typeList.find((it) => it.id === scope.row.type) || {}).name }}
              </template>
            </el-table-column>
            <el-table-column
              label="是否关账"
              width="120"
            >
              <template slot-scope="scope">
                {{ scope.row.ifClose === 1 ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="creator"
              label="操作人"
            />
            <el-table-column
              prop="createTime"
              label="创建时间"
              width="180"
            />
            <el-table-column
              prop="updateTime"
              label="最后更新时间"
              width="180"
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="150"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.ifClose !== 1 && $checkPermission(['checkOrderEdit'])"
                  type="text"
                  @click="handleEdit(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-if="scope.row.ifClose !== 1 && $checkPermission(['checkOrderClose'])"
                  type="text"
                  @click="handleClose(scope.row)"
                >
                  关账
                </el-button>
                <el-button
                  v-if="scope.row.ifClose === 1 && $checkPermission(['checkOrderView'])"
                  type="text"
                  @click="handleDetail(scope.row)"
                >
                  查看
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
          :is-add="isAdd"
          :is-view="isView"
          :is-edit="isEdit"
          :is-once="isOnce"
          :first-id="firstId"
          :type-list="typeList"
          @back="detailShow = false"
          @getTableData="handleSearch"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import detail from '@/views/financial-management/check-order/detail.vue'
import {
  getCheckList,
  getFiscalList,
  setCloseCheck,
  getUnFinanceAgentList,
  getCustomerList
} from '@/api/financial-at-collection-order'
import dayjs from 'dayjs'

@Component({
  name: '',
  components: {
    detail
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private searchForm: any = {
    comType: undefined,
    comId: undefined,
    fisCalId: undefined,
    year: undefined,
    type: undefined,
    ifClose: undefined
  }
  private tableData: any = []
  private companyList: any = []
  private fiscalList: any = []
  private total = 0
  private page = 1
  private size = 10
  private loading: boolean = false
  private dialogLoading: boolean = false
  private selectLoading: boolean = false
  private visible: boolean = false
  private isEdit: boolean = false
  private isAdd: boolean = false
  private isView: boolean = false
  private isOnce: boolean = false
  private moreShow: boolean = false
  private detailShow: boolean = false
  private dialogAdjust: boolean = false
  private dialogDeduct: boolean = false
  private companyTypeList: any[] = [
    { id: '1', name: '本公司' },
    { id: '2', name: '分公司' }
  ]
  private typeList: any[] = [
    { id: 'P', name: '应付' },
    { id: 'R', name: '应收' }
  ]
  private orderForm: any = {}
  private firstId: any = ''

  /** comoputed */
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }
  get custName(): string {
    const info = UserModule.info || {}
    const custName = (info as any).custName
    return custName
  }
  get parentId(): string {
    const info = UserModule.info || {}
    const parentId = (info as any).parentId
    return parentId
  }
  get ifCustomer(): boolean {
    const info = UserModule.info || {}
    const ifCustomer = (info as any).ifCustomer === 1
    return ifCustomer
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

  /* methods */
  private onComType() {
    // 仅一级代理商可操作
    this.tableData = []
    this.searchForm.comId = ''
    this.searchForm.fisCalId = ''
    this.companyList = []
    this.handleSearch(1)
  }
  private onCompany() {
    this.tableData = []
    this.handleSearch(1)
  }
  private getCompanyList() {
    this.selectLoading = true
    if (this.searchForm.comType === '2') {
      getUnFinanceAgentList().then((res:any) => {
        const data = res.data || []
        this.companyList = data
        this.selectLoading = false
      }).catch((err:any) => {
        this.selectLoading = false
        return err
      })
    }
  }
  private async getFiscalList() {
    this.selectLoading = true
    const params = {
      page: 1,
      size: 9999,
      year: this.searchForm.year,
      custId: [this.firstId]
    }
    await getFiscalList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.fiscalList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private handleAdd(): void {
    // 新增
    this.detailShow = true
    this.isEdit = false
    this.isAdd = true
    this.isView = false
    this.isOnce = true
    const root: any = this.$refs.detailForm
    this.$nextTick(() => {
      root.show()
    })
  }
  private handleEdit(row: any): void {
    // 编辑
    this.detailShow = true
    this.isEdit = true
    this.isAdd = false
    this.isView = false
    this.isOnce = false
    const root: any = this.$refs.detailForm
    this.$nextTick(() => {
      root.show(row)
    })
  }
  private handleDetail(row: any): void {
    // 查看详情
    this.detailShow = true
    this.isEdit = false
    this.isAdd = false
    this.isView = true
    this.isOnce = false
    const root: any = this.$refs.detailForm
    this.$nextTick(() => {
      root.show(row)
    })
  }

  private handleClose(row: any): void {
    // 删除
    const params = {
      id: row.id
    }
    this.$confirm('请确认是否关账?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        setCloseCheck(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '提交成功'
            })
            this.handleSearch()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }

  private handleSearch(val?: number): void {
    // 查询
    if (val) {
      this.page = val
    }
    const { comType, comId, ...form } = this.searchForm
    const cid = (this as any).custId
    const params: any = {
      model: {
        ...form,
        custTag: comType,
        customerId: comType === '1' ? [cid] : comId ? [comId] : []
      },
      size: this.size,
      page: this.page
    }
    this.loading = true
    getCheckList(params)
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
    const cid = (this as any).custId
    const type = (this as any).custType
    const stype = (this as any).custSubtype
    const iftc = (this as any).ifCustomer
    const pid = (this as any).parentId
    this.firstId = type === '2' && stype === '2' && iftc ? pid : cid
    this.searchForm.comType = '1'
    if (type === '2' && stype === '1') {
      this.searchForm.comType = '2'
    }
    this.handleSearch()
  }
}
</script>

<style lang="scss" scoped>
</style>
