<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="商品审核"
        />
        <div class="app-panel">
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-select
                v-model="selectValue.countryId"
                :loading="selectLoading"
                style="width:130px;margin-right:5px;"
                placeholder="目的国"
                size="small"
                filterable
                clearable
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
                v-model="selectValue.status"
                size="small"
                style="width:120px;margin-right:5px;"
                placeholder="审核状态"
                clearable
              >
                <el-option
                  label="待审核"
                  :value="0"
                />
                <el-option
                  label="审核通过"
                  :value="1"
                />
                <el-option
                  label="审核拒绝"
                  :value="2"
                />
              </el-select>
              <el-select
                v-model="selectValue.ifPrice"
                size="small"
                style="width:120px;margin-right:5px;"
                placeholder="价格定义"
                clearable
              >
                <el-option
                  label="未配置"
                  :value="0"
                />
                <el-option
                  label="已配置"
                  :value="1"
                />
              </el-select>
              <el-input
                v-model="selectValue.keyword"
                placeholder="请输入内容"
                class="input-with-select"
                style="width:300px;margin-right: 5px;"
                size="small"
                clearable
              >
                <el-select
                  slot="prepend"
                  v-model="selectType"
                  size="small"
                  style="width: 100px;"
                  placeholder="请选择"
                >
                  <el-option
                    label="海关编码"
                    value="1"
                  />
                  <el-option
                    label="中文名称"
                    value="2"
                  />
                  <el-option
                    label="英文名称"
                    value="3"
                  />
                </el-select>
              </el-input>
              <el-button
                v-permission="['queryCheck']"
                type="primary"
                size="small"
                @click="queryAll(1)"
              >
                查询
              </el-button>
            </el-col>
          </el-row>

          <el-table
            v-loading="loading"
            :data="tableData"
            height="calc(100vh - 300px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              prop="startCountryName"
              label="起运国"
              min-width="120"
            />
            <el-table-column
              prop="countryName"
              label="目的国"
              min-width="120"
            />
            <el-table-column
              width="120"
              label="审核状态"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.status === 0">待审核</span>
                <span v-else-if="scope.row.status === 1">审核通过</span>
                <span v-else-if="scope.row.status === 2">审核拒绝</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="code"
              min-width="150"
              label="海关编码"
              show-overflow-tooltip
            />
            <el-table-column
              min-width="150"
              show-overflow-tooltip
            >
              <template slot="header">
                <span>商品名称(中文)</span>
                <br>
                <span>商品名称(英文)</span>
              </template>
              <template slot-scope="scope">
                <div class="word-limit">
                  <span>{{ scope.row.cnName ? scope.row.cnName : '--' }}</span>
                  <br>
                  <span>{{ scope.row.enName ? scope.row.enName : '--' }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="brand"
              min-width="120"
              label="品牌"
              show-overflow-tooltip
            />
            <el-table-column
              prop="size"
              min-width="120"
              label="规格"
              show-overflow-tooltip
            />
            <el-table-column
              min-width="150"
              show-overflow-tooltip
            >
              <template slot="header">
                <span>材质(中文)</span>
                <br>
                <span>材质(英文)</span>
              </template>
              <template slot-scope="scope">
                <div class="word-limit">
                  <span>{{ scope.row.cnMaterial ? scope.row.cnMaterial : '--' }}</span>
                  <br>
                  <span>{{ scope.row.enMaterial ? scope.row.enMaterial : '--' }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              min-width="150"
              show-overflow-tooltip
            >
              <template slot="header">
                <span>用途(中文)</span>
                <br>
                <span>用途(英文)</span>
              </template>
              <template slot-scope="scope">
                <div class="word-limit">
                  <span>{{ scope.row.cnPurpose ? scope.row.cnPurpose : '--' }}</span>
                  <br>
                  <span>{{ scope.row.enPurpose ? scope.row.enPurpose : '--' }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="unitName"
              width="120"
              label="计量单位"
            />
            <el-table-column
              prop="title"
              min-width="150"
              label="商品类别"
              show-overflow-tooltip
            />
            <el-table-column
              prop="createTime"
              label="添加时间"
              width="170"
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="280"
            >
              <div
                slot-scope="scope"
                style="display: flex;align-items: center"
              >
                <span style="font-size: 30px;">
                  <strong>
                    <span
                      v-if="scope.row.ifPrice"
                      style="color: #4cd964;"
                    >
                      ·
                    </span>
                    <span
                      v-else
                      style="color: #ff3b30;"
                    >
                      ·
                    </span>
                  </strong>
                </span>
                <el-button
                  v-permission="['priceCheck']"
                  type="text"
                  @click="goPrice(scope.row)"
                >
                  定义价格
                </el-button>
                <el-button
                  v-if="scope.row.status !== 1 && $checkPermission(['execCheck'])"
                  type="text"
                  @click="goAudit(scope.row)"
                >
                  审核
                </el-button>
                <el-button
                  v-if="scope.row.status === 1"
                  type="text"
                  @click="goView(scope.row)"
                >
                  查看
                </el-button>
                <el-button
                  type="text"
                  @click="goFiles(scope.row)"
                >
                  认证文件
                </el-button>
                <el-button
                  type="text"
                  @click="goCustomers(scope.row)"
                >
                  查看客户
                </el-button>
              </div>
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
            title="定义报价"
            width="600px"
            :visible.sync="isPriceVisible"
            :close-on-click-modal="false"
            @closed="priceCancel"
          >
            <priceForm
              ref="priceForm"
              @priceCancel="priceCancel"
              @queryAll="queryAll"
            />
          </el-dialog>
          <el-dialog
            title="认证文件"
            width="800px"
            :visible.sync="isFilesVisible"
            :close-on-click-modal="false"
            @closed="filesCancel"
          >
            <filesForm
              ref="filesForm"
              @filesCancel="filesCancel"
              @queryAll="queryAll"
            />
          </el-dialog>

          <el-dialog
            title="商品审核"
            width="1000px"
            top="10vh"
            :visible.sync="isAuditVisible"
            :close-on-click-modal="false"
            @closed="auditCancel"
          >
            <auditForm
              ref="auditForm"
              @auditCancel="auditCancel"
              @queryAll="queryAll"
            />
          </el-dialog>

          <el-dialog
            title="查看客户"
            width="1200px"
            top="10vh"
            :visible.sync="isCustomerVisible"
            :close-on-click-modal="false"
            @closed="customersCancel"
          >
            <customers
              ref="customers"
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
import auditForm from '@/views/system-management/commodity-audit/auditForm.vue'
import priceForm from '@/views/system-management/commodity-audit/priceForm.vue'
import filesForm from '@/views/system-management/commodity-audit/filesForm.vue'
import customers from '@/views/system-management/commodity-audit/customers.vue'
import {
  getProductAuditList,
  saveCommodityAudit,
  getCountryList
} from '@/api/system-in-commodity-audit'

@Component({
  name: 'Commodty',
  components: {
    auditForm,
    priceForm,
    filesForm,
    customers
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private selectLoading: boolean = false
  private isAuditVisible: boolean = false
  private isCustomerVisible: boolean = false
  private isFilesVisible: boolean = false
  private isPriceVisible: boolean = false
  private tableData: any = []
  private selectType = '1'
  private selectValue: any = {
    ifPrice: undefined,
    customerId: undefined, // 所属公司id
    countryId: undefined, // 国家
    countryName: undefined, // 国家
    status: undefined,
    keyword: undefined
  }
  private countryList: any[] = [] // 国家地区
  private customerList: any[] = [] // 所属公司
  private props: any = {
    label: 'name',
    value: 'id'
  }
  private page: number = 1
  private size: number = 10
  private total: any = 0
  /* computed */

  get labelPosition() {
    const lang = AppModule.language
    if (!lang) {
      return 'left'
    }
    return lang === 'en' ? 'top' : 'left'
  }

  get lang() {
    const lang = AppModule.language
    if (!lang) {
      return 'en'
    }
    return lang
  }
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

  /* methods */
  private getCountryList() {
    this.selectLoading = true
    getCountryList().then((res: any) => {
      const data = res.data || {}
      this.countryList = data.result || []
      this.selectLoading = false
    }).catch((err: any) => {
      this.selectLoading = false
      return [err, null]
    })
  }

  private queryAll(val?: any): void {
    this.loading = true
    const { keyword, ...form } = this.selectValue
    if (val) {
      this.page = val
    }
    const params:any = {
      page: this.page,
      size: this.size,
      model: {
        ...form
      }
    }
    switch (this.selectType) {
      case '1':
        params.model.code = keyword
        break
      case '2':
        params.model.cnName = keyword
        break
      case '3':
        params.model.enName = keyword
        break
    }
    getProductAuditList(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        this.tableData = data.result || []
        this.total = data.total
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

  private priceCancel() {
    this.isPriceVisible = false
  }
  private customersCancel() {
    this.isCustomerVisible = false
    this.$nextTick(() => {
      const root: any = this.$refs.customers
      root.cancel()
    })
  }
  private filesCancel() {
    this.isFilesVisible = false
    this.$nextTick(() => {
      const root: any = this.$refs.filesForm
      root.cancel()
    })
  }
  private auditCancel() {
    this.isAuditVisible = false
    this.$nextTick(() => {
      const root: any = this.$refs.auditForm
      root.cancel()
    })
  }

  // 定义价格
  private goPrice(row: any) {
    this.isPriceVisible = true
    this.$nextTick(() => {
      const root:any = this.$refs.priceForm
      root.setData(row)
    })
  }
  // 审核
  private goAudit(row: any): void {
    this.isAuditVisible = true
    this.$nextTick(() => {
      const root:any = this.$refs.auditForm
      root.setData(row, 'audit')
    })
  }
  private goView(row: any): void {
    this.isAuditVisible = true
    this.$nextTick(() => {
      const root:any = this.$refs.auditForm
      root.setData(row, 'view')
    })
  }
  private goCustomers(row: any): void {
    this.isCustomerVisible = true
    this.$nextTick(() => {
      const root:any = this.$refs.customers
      root.setData(row)
    })
  }
  private goFiles(row: any, index: number): void {
    this.isFilesVisible = true
    this.$nextTick(() => {
      const root:any = this.$refs.filesForm
      root.setData(row, index)
    })
  }

  private handleSizeChange(size: any): any {
    this.size = size
    this.queryAll()
  }

  private handleCurrentChange(page: any): any {
    this.page = page
    this.queryAll()
  }

  private created(): void {
    this.queryAll()
  }
}
</script>
<style lang="scss" scoped>
  .el-table .cell{
      white-space:pre-line;
  }
  ::v-deep .el-dialog__body {
    padding: 10px 20px;
  }
  .word-limit {
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
