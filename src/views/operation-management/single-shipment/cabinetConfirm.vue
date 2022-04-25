<template>
  <div
    v-loading="loading"
    class="app-container"
  >
    <head-info
      info=""
      title="装柜/车确认"
    />
    <div class="app-panel">
      <el-row style="margin-bottom: 6px">
        <el-col :span="5">
          <span class="label">下单总件数：</span>
          <span class="value">{{ totalInfo.packages }}</span>
        </el-col>
        <el-col :span="5">
          <span class="label">装载总件数：</span>
          <span class="value">{{ totalInfo.loadTotal }}</span>
        </el-col>
      </el-row>
      <el-row
        v-for="(item, i) in loadingWarehouse"
        :key="i"
        style="margin-top: 10px"
      >
        <el-col :span="5">
          <span class="label">装载仓库：</span>
          <span class="value">{{ (item.warehouse || {}).name }}</span>
        </el-col>
        <el-col :span="5">
          <span class="label">装载件数：</span>
          <span class="value">{{ item.loadingTotal }}</span>
        </el-col>
        <el-col :span="5">
          <span class="label">装载操作人：</span>
          <span class="value">{{ item.realName }}</span>
        </el-col>
        <el-col :span="5">
          <span class="label">完成装柜时间：</span>
          <span class="value">{{ item.completeTime }}</span>
        </el-col>
      </el-row>
      <el-row style="margin-top: 32px">
        <el-col :span="12">
          <el-button
            type="text"
            size="medium"
            style="margin-right: 20px"
            @click="exportLoadPlan"
          >
            导出拆柜清单
          </el-button>
          <el-button
            type="text"
            size="medium"
            style="margin-right: 20px"
            @click="exportUnLoadBox"
          >
            导出扫描详情
          </el-button>
          <el-checkbox
            @change="checkboxChange"
          >
            仅查看未装完
          </el-checkbox>
        </el-col>
        <el-col
          :span="12"
          style="text-align: right"
        >
          <el-button
            size="small"
            @click="goBack"
          >
            返回
          </el-button>
          <el-button
            v-if="confirmRow.ifConfirm === 1"
            type="primary"
            size="small"
            @click="confirmReturn"
          >
            确认提交
          </el-button>
        </el-col>
      </el-row>
      <el-table
        ref="table"
        :data="tablePage"
        border
        style="width: 100%;margin: 10px 0;"
      >
        <el-table-column
          prop="code"
          label="原单号"
          fixed="left"
          width="130"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.code }}</div>
            <div>
              <span
                v-if="scope.row.beShip"
                class="btn-tip-red"
              >
                特批发货
              </span>
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
                v-if="scope.row.insufficient"
                class="btn-tip-red"
              >
                信用不足
              </span>
              <span
                v-if="!scope.row.enabled"
                class="btn-tip-gray"
              >
                订单已取消
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="客户名称"
          width="170"
        >
          <template slot-scope="scope">
            {{ (scope.row.orderCustomer || {}).name || '--' }}
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="服务"
          width="200"
        >
          <template slot-scope="scope">
            {{ (scope.row.lsc || {}).value || '--' }}
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="目的国"
          width="100"
        >
          <template slot-scope="scope">
            {{ (scope.row.country || {}).value || '--' }}
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="目的省份"
          width="150"
        >
          <template slot-scope="scope">
            {{ (scope.row.consignee || {}).province || '--' }}
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="目的城市"
          width="150"
        >
          <template slot-scope="scope">
            {{ (scope.row.consignee || {}).city || '--' }}
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="目的仓"
          width="100"
        >
          <template slot-scope="scope">
            {{ (scope.row.fbastore || {}).code || '--' }}
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="下单仓库"
          width="150"
        >
          <template slot-scope="scope">
            {{ (scope.row.warehouse || {}).name || '--' }}
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="货物所在仓"
          width="150"
        >
          <template slot-scope="scope">
            {{ (scope.row.warehouse1 || {}).name || '--' }}
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="总体积"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.total_volume || '--' }} CBM
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="总重量"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.total_weight || '--' }} KGS
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="装载体积"
          width="100"
        >
          <template slot-scope="scope">
            {{ $volumeConversion(scope.row.loadVolume, 'CBCM', 'CBM') }} CBM
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="装载重量"
          width="100"
        >
          <template slot-scope="scope">
            {{ $volumeConversion(scope.row.loadWeight, 'KGS', 'KGS') }} KGS
          </template>
        </el-table-column>
        <el-table-column
          prop="packages"
          label="总件数"
          width="100"
        />
        <el-table-column
          prop="loadTotal"
          label="装载件数"
          width="100"
        />
        <el-table-column
          prop=""
          fixed="right"
          label="操作"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.packages - scope.row.loadTotal > 0"
              type="text"
              @click="showReturnBox(scope.row)"
            >
              查看
            </el-button>
            <span v-else>--</span>
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
    <el-dialog
      :title="showReturnBoxRow.code"
      width="600px"
      :close-on-click-modal="false"
      :visible.sync="visible"
      @close="dialogClose"
    >
      <div v-loading="dialogLoading">
        <el-table
          ref="table"
          :data="dialogTableData"
          border
        >
          <el-table-column
            prop="box"
            label="箱号"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.box }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="快递单号"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.express || '--' }}</div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page.sync="modalPagination.page"
          :page-size="modalPagination.size"
          layout="total, prev, pager, next"
          :total="modalPagination.total"
          style="text-align: right;"
          @size-change="modalHandleSizeChange"
          @current-change="modalHandleCurrentChange"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import dayjs from 'dayjs'
import {
  exportLoadPlan,
  getOrderByViewAndEdit,
  getOrderLoadingWarehouse,
  confirmReturn,
  getReturnBoxList,
  exportUnLoadBox
} from '@/api/operation-of-single-shipment'

@Component({
  name: 'CabinetConfirm'
})
export default class extends Vue {
  private dialogLoading: boolean = false
  private onlyNoLoad: boolean = false
  private loading: boolean = false
  private visible: boolean = false
  private tableData: any[] = []
  private dialogTableData: any[] = []
  private loadingWarehouse: any[] = []
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  private modalPagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  private confirmRow: any = {}
  private showReturnBoxRow: any = {}

  get totalInfo() {
    return this.tableData.reduce((info: any, next: any) => {
      info.packages += next.packages
      info.loadTotal += next.loadTotal
      info.loadVolume += next.loadVolume
      info.loadWeight += next.loadWeight
      return info
    }, {
      loadVolume: 0,
      loadWeight: 0,
      packages: 0,
      loadTotal: 0
    })
  }
  get tablePage() {
    let list = this.tableData
    if (this.onlyNoLoad) {
      list = this.tableData.filter((o: any) => o.packages - o.loadTotal > 0)
    }
    return list.slice((this.pagination.page - 1) * this.pagination.size, (this.pagination.page) * this.pagination.size)
  }

  private showReturnBox(row: any) {
    this.showReturnBoxRow = row
    this.visible = true
    this.getReturnBoxList()
  }
  private getReturnBoxList() {
    const params = {
      model: {
        code: this.showReturnBoxRow.code,
        fill: this.confirmRow.id
      },
      page: this.modalPagination.page,
      size: this.modalPagination.size
    }
    this.dialogLoading = true
    getReturnBoxList(params).then((res: any) => {
      this.dialogLoading = false
      const data = res.data || {}
      this.dialogTableData = data.result || []
      this.modalPagination.total = data.total || 0
    }).catch(() => {
      this.dialogTableData = []
      this.dialogLoading = false
      this.modalPagination.total = 0
    })
  }
  private confirmReturn() {
    this.$confirm('确认返仓入库完成？', '提示', {
      confirmButtonText: '确认',
      closeOnClickModal: false,
      cancelButtonText: '取消'
    }).then(() => {
      const params = {
        fillId: this.confirmRow.id
      }
      this.loading = true
      confirmReturn(params).then(() => {
        this.loading = false
        this.$message.success('操作成功')
        this.confirmRow.ifConfirm = 2
        this.init(this.confirmRow)
      }).catch(() => {
        this.loading = false
      })
    }).catch(() => false)
  }
  private goBack() {
    this.pagination = {
      page: 1,
      size: 10,
      total: 0
    }
    this.tableData = []
    this.confirmRow = {}
    this.$emit('back')
  }
  private checkboxChange(val: boolean) {
    this.pagination.page = 1
    if (val) {
      this.pagination.total = this.tableData.filter((o: any) => o.packages - o.loadTotal > 0).length
    } else {
      this.pagination.total = this.tableData.length
    }
    this.onlyNoLoad = val
  }
  private init(row: any) {
    this.confirmRow = row
    this.loading = true
    this.getOrderLoadingWarehouse()
    getOrderByViewAndEdit({ fillId: row.id }).then((res: any) => {
      this.loading = false
      this.tableData = (res.data || []).map((o: any) => {
        const um = o.um || {}
        const umVolume = (this as any).$getVolumeUnitByLengthUnit(um.umLength)
        const measure = o.measure || {}
        return {
          ...o,
          total_volume: (this as any).$volumeConversion(measure.totalVolume, umVolume, 'CBM'),
          total_weight: (this as any).$volumeConversion(measure.totalWeight, um.umWeight, 'KGS')
        }
      })
      this.pagination.total = this.tableData.length
    }).catch(() => {
      this.tableData = []
      this.pagination.total = 0
      this.loading = false
    })
  }
  private getOrderLoadingWarehouse() {
    getOrderLoadingWarehouse({ fillId: this.confirmRow.id }).then((res: any) => {
      this.loadingWarehouse = res.data || []
    }).catch(() => {
      this.loadingWarehouse = []
    })
  }
  private exportLoadPlan() {
    this.loading = true
    exportLoadPlan({ id: this.confirmRow.id }).then((res:any) => {
      this.loading = false
      const a = document.createElement('a')
      document.body.appendChild(a)
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      const objUrl = URL.createObjectURL(blob)
      a.href = objUrl
      a.download = '拆柜清单' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.xls'
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(objUrl)
    }).catch((err:any) => {
      this.loading = false
      if (err && err.data) {
        err.data.text().then((text: any) => {
          try {
            const resData = JSON.parse(text)
            if (resData.code !== 200) {
              this.$message.error(resData.msg || '文件下载失败')
            }
          } catch (e) {
            return e
          }
        })
      } else {
        this.$message.error('文件下载失败')
      }
    })
  }
  private exportUnLoadBox() {
    this.loading = true
    exportUnLoadBox({ id: this.confirmRow.id }).then((res:any) => {
      this.loading = false
      const a = document.createElement('a')
      document.body.appendChild(a)
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      const objUrl = URL.createObjectURL(blob)
      a.href = objUrl
      a.download = '已扫描详情' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.xls'
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(objUrl)
    }).catch((err:any) => {
      this.loading = false
      if (err && err.data) {
        err.data.text().then((text: any) => {
          try {
            const resData = JSON.parse(text)
            if (resData.code !== 200) {
              this.$message.error(resData.msg || '文件下载失败')
            }
          } catch (e) {
            return e
          }
        })
      } else {
        this.$message.error('文件下载失败')
      }
    })
  }
  private dialogClose() {
    this.visible = false
    this.showReturnBoxRow = {}
    this.modalPagination = {
      page: 1,
      size: 10,
      total: 0
    }
    this.dialogTableData = []
  }
  private formatPay(row: any) {
    const pay = row.payTime ? dayjs(row.payTime).unix() : ''
    const now = dayjs().unix()
    const time = pay || now
    const cut = row.cutoffTime ? dayjs(row.cutoffTime).unix() : ''
    return !!cut && (cut && cut < time)
  }
  private handleSizeChange(val: string) {
    this.pagination.size = Number(val)
  }

  private handleCurrentChange(val: string) {
    this.pagination.page = Number(val)
  }
  private modalHandleSizeChange(val: string) {
    this.modalPagination.size = Number(val)
    this.getReturnBoxList()
  }

  private modalHandleCurrentChange(val: string) {
    this.modalPagination.page = Number(val)
    this.getReturnBoxList()
  }
}
</script>

<style scoped>
  .label{
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #909399;
  }
  .value{
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #303133;
  }
  .btn-tip-red {
    color: #E12E2E;
    background-color: rgba(245, 108, 108, 0.2);
    display: inline-block;
    height: 18px;
    line-height: 18px;
    font-size: 12px;
    padding: 0 2px;
    border-radius: 2px;
    margin: 0 1px;
  }
  .btn-tip-blue {
    color: #2291E6;
    background-color: rgb(34, 145, 230, 0.2);
    display: inline-block;
    height: 18px;
    line-height: 18px;
    font-size: 12px;
    padding: 0 2px;
    border-radius: 2px;
    margin: 0 1px;
  }
  .btn-tip-gray {
    color: rgb(170, 170, 170);
    background-color: rgb(170,170,170, 0.2);
    display: inline-block;
    height: 18px;
    line-height: 18px;
    font-size: 12px;
    padding: 0 2px;
    border-radius: 2px;
    margin: 0 1px;
  }
  ::v-deep .el-dialog__body{
    padding: 6px 20px 30px 20px;
  }
</style>
