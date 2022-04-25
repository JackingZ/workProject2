<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        v-show="!addEditForm"
        class="app-container"
      >
        <head-info
          info=""
          title="快递接口"
        />
        <div class="app-panel">
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-button
                v-permission="['kdServiceAdd']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="float: left;"
                @click="handleAdd"
              >
                新增
              </el-button>
              <el-select
                v-model="searchForm.consignorCountryCode"
                placeholder="发货方国家"
                filterable
                clearable
                style="width:130px;margin-right:5px;"
                size="small"
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
                v-model="searchForm.expressId"
                :loading="selectLoading"
                placeholder="快递公司"
                size="small"
                clearable
                filterable
                style="width:130px;margin-right:10px;"
                @focus="getExpressCompanyList"
              >
                <el-option
                  v-for="item in expressList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-button
                v-permission="['kdServiceQuery']"
                type="primary"
                size="small"
                @click="getTableList(1)"
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
              prop="expressName"
              label="快递公司"
              min-width="180"
            />
            <!--
            <el-table-column
              prop="codes"
              label="服务编码"
              min-width="150"
            /> -->

            <el-table-column
              prop="interfaceCode"
              label="接口编码"
              min-width="120"
            />

            <el-table-column
              prop="remarks"
              label="备注"
              min-width="100"
            />

            <el-table-column
              prop="consignorCountry"
              min-width="150"
              label="发货方国家"
            />
            <el-table-column
              prop="consignorCompany"
              min-width="150"
              label="发货方公司"
            />
            <el-table-column
              prop="consignor"
              min-width="120"
              label="发货联系人"
            />
            <el-table-column
              width="120"
              label="燃油费率"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['kdServiceAuthority']"
                  type="text"
                  @click="handleOil(scope.row)"
                >
                  燃油费率
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="启用状态"
              width="120"
            >
              <template slot-scope="scope">
                <el-switch
                  v-permission="['kdServiceEnable']"
                  :value="scope.row.ifEnable"
                  class="switchStyle"
                  active-text="启用"
                  inactive-text="禁用"
                  :active-value="1"
                  :inactive-value="0"
                  @input="(value) => onStatus(scope.row, value)"
                />
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="160px"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['kdServiceU']"
                  type="text"
                  @click="handleEdit(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['kdServiceDel']"
                  type="text"
                  @click="handleDelete(scope.row)"
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
        </div>
      </div>
      <div
        v-show="addEditForm"
        class="app-container"
      >
        <addEditForm
          ref="addEditForm"
          :country-list="countryList"
          :express-list="expressList"
          @back="addEditForm = false"
          @go="saveForm"
        />
      </div>
      <el-dialog
        :title="'燃油费率-(' + title + ')'"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="600px"
        @closed="dialogVisible = false"
      >
        <oilRate ref="oil" />
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import addEditForm from '@/views/business-configuration/express-port/addEditForm.vue'
import oilRate from '@/views/business-configuration/express-port/oilRate.vue'
import {
  getExpressCompany,
  deleteExpressPort,
  getExpressPortById,
  updateExpressPort,
  addExpressPort,
  getExpressPortList,
  getCountryList,
  changeExpressStatus
} from '@/api/operation-of-express-port'

@Component({
  name: '',
  components: {
    addEditForm,
    oilRate
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private searchForm: any = {
    consignorCountryCode: undefined,
    expressId: undefined // 快递公司
  }

  private expressList: any[] = []
  private countryList: any[] = []
  private addEditForm: boolean = false
  private loading: boolean = false
  private dialogLoading: boolean = false
  private selectLoading: boolean = false
  private tableData: any[] = []
  private dialogVisible: boolean = false
  private title = ''
  private total = 0
  private page = 1
  private size = 10

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
    this.selectLoading = true
    getCountryList()
      .then((res: any) => {
        const data = res.data || {}
        this.countryList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  //  获取快递公司列表
  private getExpressCompanyList() {
    this.selectLoading = true
    const params = {
      page: 1,
      size: 99999,
      type: '4'
    }
    getExpressCompany(params).then(res => {
      const data = res.data || {}
      this.expressList = data.result || []
      this.selectLoading = false
    }).catch((err:any) => {
      this.selectLoading = false
      return err
    })
  }

  // 查询列表
  private getTableList(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const params: any = {
      current: this.page,
      size: this.size,
      data: {
        consignorCountryCode: this.searchForm.consignorCountryCode || undefined,
        expressId: this.searchForm.expressId || undefined
      }
    }
    getExpressPortList(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        const { total, records } = data
        this.total = total
        this.tableData = records || []
      })
      .catch(err => {
        this.loading = false
        return err
      })
  }
  private handleOil(row: any) {
    this.dialogVisible = true
    this.title = row.codes + '/' + row.interfaceCode
    this.$nextTick(() => {
      const root: any = this.$refs.oil
      root.setData(row)
    })
  }
  private handleAdd(): void {
    // 新增
    this.addEditForm = true
    const root: any = this.$refs.addEditForm
    root.setAdd()
  }
  private handleEdit(row: any): void {
    // 编辑
    this.addEditForm = true
    const root: any = this.$refs.addEditForm
    root.setData(row)
  }
  private saveForm() {
    this.addEditForm = false
    this.getTableList()
  }
  private handleDelete(row: any): void {
    // 删除
    const ids = [row.id]
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteExpressPort(ids)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getTableList()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }

  private async onStatus(row:any, value: any) {
    const olds = row.ifEnable.toString()
    const news = value.toString()
    if (!olds || olds === news) {
      return
    }
    const text = news === '0' ? '禁用' : '开启'
    const [cancel, confirm] = await this.$confirm(
      `此操作将${text}该快递接口，是否继续？`,
      '提示',
      {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(res => {
        return [null, res]
      })
      .catch(err => {
        return [err, null]
      })
    if (cancel) return
    changeExpressStatus({
      id: row.id
    })
      .then((res: any) => {
        this.$message.success('修改成功')
        this.getTableList()
      })
      .catch((err: any) => {
        return err
      })
  }

  private handleSizeChange(size: any): any {
    this.size = size
    this.getTableList()
  }

  private handleCurrentChange(page: any): any {
    this.page = page
    this.getTableList()
  }

  private created(): void {
    this.getCountryList()
    this.getExpressCompanyList()
    this.getTableList()
  }
}
</script>

<style lang="scss" scoped>

</style>
