<template>
  <div>
    <div v-show="!detailShow">
      <el-row style="margin-bottom: 10px;">
        <el-col :span="4">
          <span style="line-height: 32px;">部门销售任务</span>
        </el-col>
        <el-col
          :span="20"
          style="text-align:right;padding-right: 10px;"
        >
          <!-- <el-select
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
          </el-select> -->
          <el-select
            v-if="custType === '0'"
            v-model="searchForm.parentId"
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
            v-if="custType === '0' || (custType === '2' && custSubtype === '1')"
            v-model="searchForm.comId"
            :disabled="custType === '0' && !searchForm.parentId"
            :loading="selectLoading"
            size="small"
            style="width:130px;margin-right:5px;"
            placeholder="分公司"
            filterable
            clearable
            @change="onUnCompany"
            @focus="getUnFinanceCompanyList"
          >
            <el-option
              v-for="item in unCompanyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-tree-select
            v-model="searchForm.departId"
            :disabled="!searchForm.comId"
            :data="departmentList"
            :default-expand-all="false"
            style="display:inline-block;width:140px;margin-right:5px;"
            clearable
            filterable
            size="small"
            placeholder="部门"
          />
          <el-date-picker
            v-model="searchForm.year"
            type="year"
            placeholder="年度"
            style="width:130px;margin-right: 5px;"
            value-format="yyyy"
            size="small"
            clearable
            @change="onYear"
          />
          <el-select
            v-model="searchForm.period"
            :loading="selectLoading"
            :disabled="!searchForm.year"
            placeholder="期间"
            size="small"
            clearable
            filterable
            style="width: 130px;margin-right:10px;"
            @focus="getFiscalList"
          >
            <el-option
              v-for="(item, index) in fiscalList"
              :key="index"
              :label="item.fiscalPeriod"
              :value="item.id"
            />
          </el-select>
          <el-button
            v-permission="['salesMenSearch']"
            type="primary"
            size="small"
            @click="handleSearch"
          >
            查询
          </el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover">
            <el-row>
              <el-col
                :span="12"
                style="line-height: 32px;"
              >
                <svg-icon
                  name="air"
                />
                空运任务
              </el-col>
              <el-col
                :span="12"
                style="line-height: 29px;"
              >
                <span style="text-align: right;font-size: 24px;font-weight: bold;">
                  {{ taskObj.airNum || '--' }}
                </span>KG
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <el-row>
              <el-col
                :span="12"
                style="line-height: 32px;"
              >
                <svg-icon
                  name="boat"
                />
                海运任务
              </el-col>
              <el-col
                :span="12"
                style="line-height: 29px;"
              >
                <span style="text-align: right;font-size: 24px;font-weight: bold;">
                  {{ taskObj.seaNum || '--' }}
                </span>CBM
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <el-row>
              <el-col
                :span="12"
                style="line-height: 32px;"
              >
                <svg-icon
                  name="train"
                />
                铁路任务
              </el-col>
              <el-col
                :span="12"
                style="line-height: 29px;"
              >
                <span style="text-align: right;font-size: 24px;font-weight: bold;">
                  {{ taskObj.trainNum || '--' }}
                </span>CBM
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <el-row>
              <el-col
                :span="12"
                style="line-height: 32px;"
              >
                <svg-icon
                  name="car"
                />
                卡航任务
              </el-col>
              <el-col
                :span="12"
                style="line-height: 29px;"
              >
                <span style="text-align: right;font-size: 24px;font-weight: bold;">
                  {{ taskObj.carNum || '--' }}
                </span>KG
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
      <el-table
        v-loading="loading"
        :data="tableData"
        height="calc(100vh - 390px)"
        style="width: 100%;margin: 10px 0;"
        border
      >
        <el-table-column
          label="业务员"
          min-width="120"
          prop="userName"
        />
        <el-table-column
          label="业务类型-任务量"
          min-width="200"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>空运：{{ (scope.row.airNum || '--') + 'KG, ' }}</span>
            <span>海运：{{ (scope.row.seaNum || '--') + 'CBM, ' }}</span>
            <span>铁路：{{ (scope.row.trainNum || '--') + 'CBM, ' }}</span>
            <span>卡航：{{ (scope.row.carNum || '--') + 'KG ' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="180"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="medium"
              @click="editRow(scope.row)"
            >
              分配
            </el-button>
            <el-button
              type="text"
              size="medium"
              @click="viewRow(scope.row)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <distributInfo
      v-show="detailShow"
      ref="distribut"
      :is-edit="isEdit"
      @close="closed"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import distributInfo from '@/views/sales-management/plan-distribut/distribut.vue'
import {
  getSalesPlanList,
  getUnFinanceAgentList,
  getUnFinanceAgentById,
  getDepartPlanList,
  getAgentList,
  getFiscalList,
  saveDepart,
  getDepartList,
  getPersonList
} from '@/api/sales-of-plan-distribut'

@Component({
  name: 'salesman',
  components: {
    distributInfo
  },
  props: {
  }
})
export default class extends Vue {
  /** data */
  private loading: boolean = false
  private detailShow: boolean = false
  private selectLoading: boolean = false
  private isEdit: boolean = false
  private tableData: any = []
  private companyList: any = []
  private unCompanyList: any = []
  private personList: any = []
  private fiscalList: any = []
  private departmentList: any = []
  private companyTypeList: any[] = []
  private firstId: any = ''
  private searchForm: any = {
    comType: '1',
    comId: '',
    departId: '',
    parentId: '',
    year: '',
    period: ''
  }
  private form: any = {
    departId: ''
  }
  private taskObj: any = {
    airNum: 0,
    seaNum: 0,
    trainNum: 0,
    carNum: 0
  }
  private page: number = 1
  private size: number = 10
  private total: any = 0
  /** computed */
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }
  get deptId(): string {
    const info = UserModule.info || {}
    const deptId = (info as any).deptId
    return deptId
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
  get ifCustomer(): boolean {
    const info = UserModule.info || {}
    const ifCustomer = (info as any).ifCustomer === 1
    return ifCustomer
  }

  /** method */
  private async closed() {
    this.detailShow = false
    await this.handleSearch()
  }
  private onComType() {
    this.tableData = []
    this.searchForm.comId = ''
    this.companyList = []
  }
  private onCompany(val: any) {
    this.searchForm.comId = ''
    this.unCompanyList = []
    this.tableData = []
    this.searchForm.departId = ''
    this.departmentList = []
    this.onYear()
    const item = this.companyList.find((it: any) => it.id === val)
    if (item) {
      this.firstId = val
    }
  }
  private onUnCompany(val: any) {
    this.tableData = []
    this.searchForm.departId = ''
    this.departmentList = []
    this.getDepartment()
  }
  private onYear() {
    this.searchForm.period = undefined
    this.fiscalList = []
  }

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
  private getUnFinanceCompanyList() {
    const type = (this as any).custType
    this.selectLoading = true
    if (type === '0') {
      const params = {
        custId: this.searchForm.parentId
      }
      getUnFinanceAgentById(params)
        .then((res: any) => {
          const data = res.data || []
          this.unCompanyList = data
          this.selectLoading = false
        })
        .catch((err: any) => {
          this.selectLoading = false
          return err
        })
    } else {
      getUnFinanceAgentList().then((res:any) => {
        const data = res.data || []
        this.unCompanyList = data
        this.selectLoading = false
      }).catch((err:any) => {
        this.selectLoading = false
        return err
      })
    }
  }
  private getFiscalList() {
    this.selectLoading = true
    const params = {
      page: 1,
      size: 9999,
      year: this.searchForm.year,
      custTag: '1',
      custId: [this.firstId]
    }
    getFiscalList(params)
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
  private getDepartment() {
    const { comType, comId, ...form } = this.searchForm
    const params:any = {
      custId: comId,
      deptId: ''
    }
    getDepartList(params).then((res: any) => {
      const departmentList = res.data.result || []
      const json = JSON.parse(
        JSON.stringify(departmentList)
          .replace(/name/g, 'label')
          .replace(/id/g, 'value')
      )
      this.departmentList = json
    }).catch((err: any) => {
      return err
    })
  }
  private async getPersonList() {
    const params = {
      deptId: this.searchForm.departId
    }
    await getPersonList(params)
      .then((res: any) => {
        const data = res.data || []
        this.personList = data
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

  private async getDepartTask() {
    const { comType, comId, departId, parentId, ...form } = this.searchForm
    const obj = {
      model: {
        companyId: comId,
        deptId: departId,
        ...form
      },
      page: 1,
      size: 9999
    }
    await getDepartPlanList(obj).then((res: any) => {
      const arr = (res.data || {}).result || []
      const item = arr.find((it: any) => it.deptId === departId) || {}
      this.taskObj = item
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }
  private async handleSearch() {
    const type = (this as any).custType
    const stype = (this as any).custSubtype
    if ((type === '0' || (type === '2' && stype === '1')) && !this.searchForm.comId) {
      this.$message.error('请选择分公司')
      return
    } else if (!this.searchForm.departId) {
      this.$message.error('请选择部门')
      return
    } else if (!this.searchForm.period) {
      this.$message.error('请选择期间')
      return
    }
    this.loading = true
    await this.getDepartTask()
    await this.getPersonList()
    this.queryAll(1)
  }
  private queryAll(val?: any): void {
    const type = (this as any).custType
    const stype = (this as any).custSubtype
    if ((type === '0' || (type === '2' && stype === '1')) && !this.searchForm.comId) {
      this.$message.error('请选择分公司')
      return
    } else if (!this.searchForm.departId) {
      this.$message.error('请选择部门')
      return
    } else if (!this.searchForm.period) {
      this.$message.error('请选择期间')
      return
    }
    this.loading = true
    if (val) {
      this.page = val
    }
    const { comType, comId, departId, parentId, ...form } = this.searchForm
    const params = {
      page: 1,
      size: 9999,
      model: {
        ...form,
        companyId: comId,
        deptId: departId
      }
    }
    getSalesPlanList(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        const result = data.result || []
        const obj: any = {}
        const item = this.fiscalList.find((it: any) => it.id === this.searchForm.period)
        if (item) {
          obj.month = item.fiscalPeriod
          obj.monthStart = item.startTime
          obj.monthEnd = item.endTime
        }
        const arr = this.personList.map((it: any) => {
          return {
            companyId: this.searchForm.comId,
            companyName: '',
            deptId: this.searchForm.departId,
            deptName: this.searchForm.departName,
            userId: it.id,
            userName: it.name,
            period: this.searchForm.period,
            year: this.searchForm.year,
            month: obj.month,
            monthStart: obj.monthStart,
            monthEnd: obj.monthEnd,
            seaNum: 0,
            trainNum: 0,
            airNum: 0,
            carNum: 0
          }
        })
        this.tableData = arr.map((it: any) => {
          const tem = result.find((a: any) => a.userId === it.userId)
          if (tem) {
            it = {
              ...tem
            }
          }
          return it
        })
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

  // 分配
  private editRow(row: any) {
    this.isEdit = true
    this.detailShow = true
    const root: any = this.$refs.distribut
    this.$nextTick(() => {
      root.setData(row, 'sales')
    })
  }
  private viewRow(row: any) {
    this.isEdit = false
    this.detailShow = true
    const root: any = this.$refs.distribut
    this.$nextTick(() => {
      root.setData(row, 'sales')
    })
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.queryAll()
  }

  private created() {
    const type = (this as any).custType
    const stype = (this as any).custSubtype
    const cid = (this as any).custId
    const iftc = (this as any).ifCustomer
    const pid = (this as any).parentId
    if (type === '2' && stype === '2' && iftc) {
      this.firstId = pid
    } else if (type !== '0') {
      this.firstId = cid
    } else {
      this.firstId = ''
    }
    if (type !== '0' && (type === '2' && stype !== '1')) {
      this.searchForm.comId = (this as any).custId
      this.getDepartment()
    }
  }
}
</script>

<style lang="scss" scoped>
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
::v-deep .el-card__body {
  padding: 15px;
}
</style>
