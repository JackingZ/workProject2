<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        v-show="pageType === 'index'"
        class="app-container"
      >
        <head-info
          info=""
          title="外协发货"
        />
        <div class="app-panel">
          <el-row :gutter="20">
            <el-col
              :span="4"
            >
              <el-button
                v-if="$checkPermission(['outsourcAdd']) && (userInfo.custType === '0' || (userInfo.custType === '2' && userInfo.custSubtype) === '1')"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin: 0 10px;"
                @click="add"
              >
                新增
              </el-button>
            </el-col>
            <el-col
              :span="20"
              style="text-align: right"
            >
              <el-select
                v-model="searchForm.subtypeId"
                placeholder="业务类型"
                :loading="selectLoading"
                clearable
                size="small"
                filterable
                style="width: 150px"
                @focus="getServiceSubtypeList"
              >
                <el-option
                  v-for="item in subtypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="searchForm.supplierId"
                placeholder="供应商"
                :loading="selectLoading"
                clearable
                size="small"
                filterable
                style="width: 150px;margin: 0 10px"
                @focus="getSupplierList"
              >
                <el-option
                  v-for="item in supplierList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="searchForm.ifWareHouseOut"
                placeholder="是否安排出库"
                clearable
                size="small"
                filterable
                style="width: 150px;margin-right: 10px"
              >
                <el-option
                  label="是"
                  value="1"
                />
                <el-option
                  label="否"
                  value="0"
                />
              </el-select>
              <el-input
                v-model="searchForm.code"
                placeholder="原单号"
                class="input-with-select"
                style="width:240px;margin-right: 10px;"
                size="small"
              />
              <el-button
                v-permission="['outsourcQuery']"
                type="primary"
                size="small"
                @click="loadData(1)"
              >
                查询
              </el-button>
            </el-col>
          </el-row>
          <div class="table-wrap">
            <el-table
              v-loading="loading"
              :data="tableData"
              height="calc(100vh - 313px)"
              style="width: 100%;margin: 10px 0;"
              border
            >
              <el-table-column
                prop="type"
                label="业务类型"
                width="100"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.type === '0'">空运</span>
                  <span v-if="scope.row.type === '1'">海运</span>
                  <span v-if="scope.row.type === '2'">铁路</span>
                  <span v-if="scope.row.type === '4'">卡航</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="serviceName"
                label="服务"
                width="230"
              />
              <el-table-column
                prop="supplierName"
                label="供应商"
                width="200"
              />
              <el-table-column
                prop="warehouseName"
                label="仓库"
                width="200"
              />
              <el-table-column
                prop="subtypeName"
                label="柜号/提单号"
                width="150"
              />
              <el-table-column
                prop="totalPackages"
                label="总票数"
                width="150"
              />
              <el-table-column
                prop="totalVolume"
                label="总体积"
                width="150"
              >
                <template slot-scope="scope">
                  {{ scope.row.totalVolume }} CBM
                </template>
              </el-table-column>
              <el-table-column
                prop="totalWeight"
                label="总重量"
                width="150"
              >
                <template slot-scope="scope">
                  {{ scope.row.totalWeight }} KGS
                </template>
              </el-table-column>
              <el-table-column
                label="安排出库"
                width="150"
              >
                <template slot-scope="scope">
                  {{ scope.row.ifWareHouseOut === 0 ? '否' : '是' }}
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="165"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button
                    v-permission="['outsourcView']"
                    type="text"
                    @click="view(scope.row)"
                  >
                    查看
                  </el-button>
                  <el-button
                    v-permission="['outsourcEdit']"
                    type="text"
                    @click="edit(scope.row)"
                  >
                    编辑
                  </el-button>
                  <el-dropdown
                    v-if="$checkPermission(['outsourcExpress', 'outsourcMetering', 'arrangeDelivery', 'replenishmentDelivery'])"
                    trigger="click"
                    @command="(key) => handleCommand(key, scope.row)"
                  >
                    <el-button
                      type="text"
                      style="padding-left: 10px"
                    >
                      更多
                      <i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-permission="['outsourcExpress', 'outsourcMetering', 'outExport']"
                        command="1"
                      >
                        资料补充
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="scope.row.ifWareHouseOut === 0 && $checkPermission(['arrangeDelivery'])"
                        command="2"
                      >
                        安排出库
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="scope.row.ifWareHouseOut === 1 && $checkPermission(['replenishmentDelivery'])"
                        command="3"
                      >
                        补单出库
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="$checkPermission(['outExport'])"
                        command="export"
                      >
                        导出箱单发票
                      </el-dropdown-item>
                      <!--<el-dropdown-item
                        command="3"
                      >
                        进度跟踪
                      </el-dropdown-item>-->
                    </el-dropdown-menu>
                  </el-dropdown>
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
      </div>
      <add-form
        v-show="pageType === 'form'"
        ref="addForm"
        :status-list="statusList"
        @goBack="pageType = 'index'"
        @save="save"
      />
      <supplement-info
        v-show="pageType === 'supplement'"
        ref="supplementInfo"
        @goBack="pageType = 'index'"
      />
      <el-dialog
        title="补单出库"
        width="1200px"
        :close-on-click-modal="false"
        :visible.sync="dialogReplenish"
        @close="cancelReplenish"
      >
        <div v-loading="formLoading">
          <el-table
            ref="tables"
            :data="replenishData"
            border
            row-key="id"
            height="400px"
            style="width: 100%;"
            @select="handleSelected"
            @select-all="handleSelectAll"
          >
            <el-table-column
              fixed="left"
              type="selection"
              width="55"
            />
            <el-table-column
              label="原单号"
              width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div class="text-info">
                  <span
                    v-copy="scope.row.code"
                    class="copy-icon"
                  />
                  <span>
                    {{ scope.row.code }}
                  </span>
                </div>
                <div>
                  <span
                    v-if="scope.row.ifFrozen"
                    class="btn-tip-red"
                  >
                    冻结
                  </span>
                  <span
                    v-if="scope.row.ifLocked"
                    class="btn-tip-blue"
                  >
                    锁舱
                  </span>
                  <span
                    v-if="scope.row.payMethod !== '1' && formatPay(scope.row)"
                    class="btn-tip-red"
                  >
                    {{ scope.row.ifPayment ? '逾期已付款' : '逾期未付款' }}
                  </span>
                  <span
                    v-if="scope.row.payMethod === '1'"
                    class="btn-tip-red"
                  >
                    {{ scope.row.ifPayment ? '已付款' : '未付款' }}
                  </span>
                  <span
                    v-if="formatInsuf(scope.row)"
                    class="btn-tip-red"
                  >
                    信用不足
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="目的城市"
              width="120"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.consignee || {}).city || '--' }}
              </template>
            </el-table-column>
            <el-table-column
              label="服务"
              width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.lsc || {}).value || '--' }}
              </template>
            </el-table-column>
            <el-table-column
              label="下单仓库"
              width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.warehouse || {}).name || '--' }}
              </template>
            </el-table-column>
            <el-table-column
              label="货物所在仓"
              width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.warehouse1 || {}).name || '--' }}
              </template>
            </el-table-column>
            <el-table-column
              label="总体积"
              min-width="100"
            >
              <template slot-scope="scope">
                {{ maxVolWeiFormat(scope.row, 'vol', 'CBM') }}
              </template>
            </el-table-column>
            <el-table-column
              label="总重量"
              min-width="100"
            >
              <template slot-scope="scope">
                {{ maxVolWeiFormat(scope.row, 'wei', 'KGS') }}
              </template>
            </el-table-column>
            <el-table-column
              label="最大重量"
              min-width="100"
            >
              <template slot-scope="scope">
                {{ maxVolWeiFormat(scope.row, 'maxWei', 'KGS') }}
              </template>
            </el-table-column>
            <el-table-column
              label="最大体积"
              min-width="100"
            >
              <template slot-scope="scope">
                {{ maxVolWeiFormat(scope.row, 'maxVol', 'CBM') }}
              </template>
            </el-table-column>
            <el-table-column
              label="件数"
              width="100"
            >
              <template slot-scope="scope">
                {{ scope.row.packages }}
              </template>
            </el-table-column>
            <el-table-column
              label="计量状态"
              width="100"
            >
              <template slot-scope="scope">
                {{ (statusList.find(e => e.id === scope.row.status['MEASURE']) || {name: '--'}).name }}
              </template>
            </el-table-column>
            <el-table-column
              label="验货状态"
              width="100"
            >
              <template slot-scope="scope">
                {{ (statusList.find(e => e.id === scope.row.status['EXAMINE']) || {name: '--'}).name }}
              </template>
            </el-table-column>
            <el-table-column
              label="报关状态"
              width="100"
            >
              <template slot-scope="scope">
                {{ (statusList.find(e => e.id === scope.row.status['CUSTOM_DECLARATION']) || {name: '--'}).name }}
              </template>
            </el-table-column>
            <el-table-column
              label="快递单号"
              width="100"
            >
              <template slot-scope="scope">
                <el-popover
                  v-if="scope.row.express && scope.row.express.trackingNos"
                  title="快递单号"
                >
                  <div>
                    <p
                      v-for="e in scope.row.express.trackingNos.split(',')"
                      :key="e"
                    >
                      {{ e }}
                    </p>
                  </div>
                  <el-button
                    slot="reference"
                    type="text"
                    size="small"
                    style="padding: 0;"
                  >
                    已出
                  </el-button>
                </el-popover>
                <div v-else>
                  未出
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div
            slot="footer"
            style="text-align: right;padding: 10px 0;"
          >
            <el-button
              size="small"
              @click="dialogReplenish = false"
            >
              取消
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="saveReplenish"
            >
              确定
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
import addForm from '@/views/operation-management/outsourc-shipment/components/addForm.vue'
import supplementInfo from '@/views/operation-management/outsourc-shipment/components/supplementInfo.vue'
import {
  getServiceSubtypeList,
  getTableList,
  getSupplierList,
  arrangeDelivery,
  getReplenishmentDeliveryList,
  saveReplenishmentDeliveryList,
  outExport
} from '@/api/outsourc-shipment'
import { getStatusList } from '@/api/public'
import dayjs from 'dayjs'

@Component({
  name: 'index',
  components: {
    addForm,
    supplementInfo
  }
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private selectLoading: boolean = false
  private dialogReplenish: boolean = false
  private formLoading: boolean = false
  private pageType: string = 'index'
  private searchForm: any = {
    code: '',
    subtypeId: '',
    supplierId: '',
    ifWareHouseOut: ''
  }
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  private replenishRow: any = {}
  private tableData: any[] = []
  private subtypeList: any[] = []
  private supplierList: any[] = []
  private statusList: any[] = []
  private replenishData: any[] = []
  private selectedData: any[] = []
  /* computed */
  get userInfo(): any {
    return UserModule.info || {}
  }
  /* methods */
  private maxVolWeiFormat(row: any, str: string, unit: string) {
    const umVolume = (this as any).$getVolumeUnitByLengthUnit((row.um || {}).umLength)
    const umWeight = (row.um || {}).umWeight
    const maxVolume = (row.measure || {}).maxVolume
    const totalVolume = (row.measure || {}).totalVolume
    const maxWeight = (row.measure || {}).maxWeight
    const totalWeight = (row.measure || {}).totalWeight
    let numVW: number = 0
    if (str === 'vol' && umVolume && totalVolume) {
      numVW = (this as any).$volumeConversion(totalVolume, umVolume, 'CBM', 3)
    } else if (str === 'maxVol' && umVolume && maxVolume) {
      numVW = (this as any).$volumeConversion(maxVolume, umVolume, 'CBM', 3)
    } else if (str === 'wei' && umWeight && totalWeight) {
      numVW = (this as any).$volumeConversion(totalWeight, umWeight, 'KGS', 3)
    } else if (str === 'maxWei' && umWeight && maxWeight) {
      numVW = (this as any).$volumeConversion(maxWeight, umWeight, 'KGS', 3)
    }
    return (numVW || '--') + ' ' + unit
  }
  private formatPay(row: any) {
    const pay = row.payTime ? dayjs(row.payTime).unix() : ''
    const now = dayjs().unix()
    const time = pay || now
    const cut = row.cutoffTime ? dayjs(row.cutoffTime).unix() : ''
    return !!cut && (cut && cut < time)
  }
  private formatInsuf(row: any) {
    return !!row.insufficient
  }
  private handleSelected(selection: any, row: any) {
    const addDelete = selection.find((it: any) => it.id === row.id)
    if (addDelete) {
      this.selectedData.push(row)
    } else {
      this.selectedData = this.selectedData.filter((it: any) => it.id !== row.id)
    }
  }
  private handleSelectAll(selection: any) {
    if (selection.length) {
      // 全选中
      this.selectedData = [...this.selectedData, ...selection].reduce((list: any[], next: any) => {
        if (!list.find((e: any) => e.id === next.id)) {
          list.push(next)
        }
        return list
      }, [])
    } else {
      // 取消这页的全选
      this.selectedData = this.selectedData.filter((e: any) => !this.replenishData.find((t: any) => t.id === e.id))
    }
  }
  private cancelReplenish() {
    this.replenishData = []
    this.replenishRow = {}
    this.selectedData = []
  }
  private saveReplenish() {
    if (this.selectedData.length === 0) {
      this.$message.error('请选择需补单出库的订单')
      return
    }
    const params = {
      fillId: this.replenishRow.id,
      codeList: this.selectedData,
      warehouse: {
        id: this.replenishRow.warehouseId
      }
    }
    this.formLoading = true
    saveReplenishmentDeliveryList(params).then(() => {
      this.formLoading = false
      this.$message.success('补单出库成功')
      this.dialogReplenish = false
      this.loadData()
    }).catch(() => {
      this.formLoading = false
    })
  }
  private getStatusList() {
    getStatusList().then((res: any) => {
      this.statusList = (res.data || []).map((e: any) => {
        return {
          name: e.name,
          id: e.key,
          type: e.type
        }
      })
    }).catch(() => {
      this.statusList = []
    })
  }
  private handleCommand(key: any, row: any) {
    switch (key) {
      case '1':
        // 资料补充
        this.toSupplementInfo(row)
        break
      case '2':
        // 安排出库
        this.arrangeDelivery(row)
        break
      case '3':
        // 补单出库
        this.replenishmentDelivery(row)
        break
      case 'export':
        // export
        this.exportData(row)
        break
    }
  }
  private exportData(row: any) {
    this.loading = true
    outExport({ id: row.id }).then((res: any) => {
      this.loading = false
      res.text().then((text: any) => {
        const result = JSON.parse(text)
        if (result.data) {
          this.$message.error(res.data.msg || '文件下载失败')
        }
      }).catch(() => {
        const a = document.createElement('a')
        document.body.appendChild(a)
        const objUrl = URL.createObjectURL(res)
        a.href = objUrl
        a.download = '外协发货.zip'
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(objUrl)
      })
    }).catch((err: any) => {
      this.loading = false
      err.data && err.data.text().then((text: any) => {
        try {
          const resData = JSON.parse(text)
          if (resData.code !== 200) {
            this.$message.error(resData.msg || '文件下载失败')
          }
        } catch (e) {
          return e
        }
      })
    })
  }
  private replenishmentDelivery(row: any) {
    // 补单出库
    const params = {
      countryId: row.deliveryId,
      takeOutId: row.id,
      type: row.type
    }
    this.loading = true
    this.selectedData = []
    getReplenishmentDeliveryList(params).then((res: any) => {
      this.loading = false
      const data = res.data || []
      if (data.length === 0) {
        this.$message.error('暂无需要补单的订单')
        return
      }
      this.replenishRow = row
      this.dialogReplenish = true
      this.replenishData = data
    }).catch(() => {
      this.replenishRow = {}
      this.replenishData = []
      this.dialogReplenish = false
      this.loading = false
    })
  }
  private arrangeDelivery(row: any) {
    const h: any = this.$createElement
    this.$msgbox({
      title: '提示',
      message: h('div', null, [
        h('h3', { style: 'margin: 0 0 5px' }, `装货仓库：${row.warehouseName}`),
        h('div', null, '请问是否确认安排出库，此操作会给仓库下出库申请单？')
      ]),
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(() => {
      this.loading = true
      arrangeDelivery({ fillId: row.id, warehouse: { id: row.warehouseId } }).then(() => {
        this.$message.success('出库成功')
        this.loading = false
        this.loadData()
      }).catch(() => {
        this.loading = false
      })
    }).catch(() => {
      return false
    })
  }
  private toSupplementInfo(row: any) {
    const supplementInfoRef: any = this.$refs.supplementInfo
    this.pageType = 'supplement'
    supplementInfoRef.show(row)
  }
  private view(row: any) {
    const addFormRef: any = this.$refs.addForm
    this.pageType = 'form'
    addFormRef.view(row)
  }
  private edit(row: any) {
    const addFormRef: any = this.$refs.addForm
    this.pageType = 'form'
    addFormRef.edit(row)
  }
  private save() {
    this.pageType = 'index'
    this.loadData()
  }
  private add() {
    const addFormRef: any = this.$refs.addForm
    this.pageType = 'form'
    addFormRef.add()
  }
  private getSupplierList() {
    const params = {
      parentId: 0,
      types: '05',
      page: 1,
      size: 999,
      subTypes: this.searchForm.subtypeId
    }
    this.selectLoading = true
    getSupplierList(params).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      this.supplierList = data.result || []
    }).catch(() => {
      this.selectLoading = false
      this.supplierList = []
    })
  }
  private getServiceSubtypeList() {
    const params = {
      typeId: '05'
    }
    this.selectLoading = true
    getServiceSubtypeList(params).then((res: any) => {
      this.selectLoading = false
      this.subtypeList = res.data || []
    }).catch(() => {
      this.selectLoading = false
      this.subtypeList = []
    })
  }
  private handleSizeChange(val: string) {
    this.pagination.size = Number(val)
    this.loadData()
  }
  private handleCurrentChange(val: string) {
    this.pagination.page = Number(val)
    this.loadData()
  }
  private loadData(page?: number) {
    if ((this.userInfo.custType === '0' || (this.userInfo.custType === '2' && this.userInfo.custSubtype) === '1')) {
      if (page === 1) {
        this.pagination.page = 1
      }
      const params = {
        model: {
          type: this.searchForm.subtypeId,
          code: this.searchForm.code,
          supplierId: this.searchForm.supplierId,
          ifWareHouseOut: this.searchForm.ifWareHouseOut
        },
        page: this.pagination.page,
        size: this.pagination.size
      }
      this.loading = true
      getTableList(params).then((res: any) => {
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
  }
  /* hooks */
  private created() {
    this.loadData()
    this.getStatusList()
  }
}
</script>

<style lang="scss" scoped>
  .text-info {
    .copy-icon {
      color: #999;
      cursor: pointer;
      width: 12px;
      height: 12px;
      display: inline-block;
      margin-right: 5px;
      background: url("../../../assets/imgs/copy.png") center center no-repeat;
      background-size: 100%;
      &:hover {
        background: url("../../../assets/imgs/copy-hover.png") center center no-repeat;
        background-size: 100%;
      }
    }
  }
  .btn-tip-red {
    color: #E12E2E;
    background-color: rgba(245, 108, 108, 0.2);
    display: inline-block;
    height: 18px;
    line-height: 18px;
    font-size: 12px;
    padding: 0 2px;
    margin: 0 1px;
    border-radius: 2px;
  }
  .btn-tip-blue {
    color: #2291E6;
    background-color: rgb(34, 145, 230, 0.2);
    display: inline-block;
    height: 18px;
    line-height: 18px;
    font-size: 12px;
    padding: 0 2px;
    margin: 0 1px;
    border-radius: 2px;
  }
</style>
