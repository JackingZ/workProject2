<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        v-show="showPage === 'i'"
        class="app-container"
      >
        <head-info
          info=""
          title="快递订单"
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
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>

            <!-- <el-select
              v-model="searchForm.trailerType"
              size="small"
              style="width: 100px;margin-right: 5px;"
              placeholder="快递类型"
              filterable
              clearable
            >
              <el-option
                v-for="item in trailerTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select> -->

            <el-select
              v-model="searchForm.expressId"
              :loading="selectLoading"
              clearable
              filterable
              placeholder="快递公司"
              style="width:130px;margin-right:5px;"
              size="small"
              @focus="getExpressCompanyList"
            >
              <el-option
                v-for="item in expressList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>

            <el-date-picker
              v-model="searchForm.orderTime"
              :clearable="false"
              unlink-panels
              type="daterange"
              align="right"
              size="small"
              value-format="yyyy-MM-dd"
              range-separator="~"
              style="width:240px;margin-right:5px;"
              start-placeholder="下单起始时间"
              end-placeholder="下单截止时间"
            />
            <el-input
              v-model="keyWord"
              placeholder="请输入内容"
              class="input-with-select"
              style="width:240px;margin-right: 10px;"
              size="small"
              clearable
            >
              <el-select
                slot="prepend"
                v-model="keyType"
                size="small"
                style="width:100px;"
                placeholder="请选择"
              >
                <el-option
                  label="原单号"
                  value="1"
                />
                <el-option
                  label="快递单号"
                  value="2"
                />
              </el-select>
            </el-input>

            <el-button
              v-permission="['deliveryOrderQuery']"
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
              fixed="left"
              prop=""
              label="快递单号"
              width="100"
            >
              <template slot-scope="scope">
                <el-popover
                  placement="bottom-start"
                  width="200"
                  trigger="click"
                >
                  <div
                    style="height: 200px;overflow-y: auto;"
                  >
                    <div v-if="numberData.length > 0">
                      <el-tag
                        v-for="(item, index) in numberData"
                        :key="index"
                        type="info"
                        style="display: block;margin-bottom: 3px;"
                      >
                        {{ item }}
                      </el-tag>
                    </div>
                  </div>
                  <el-button
                    slot="reference"
                    type="text"
                    size="small"
                    @click="viewNumber(scope.row)"
                  >
                    快递单号
                  </el-button>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              fixed="left"
              prop="orderNo"
              label="原单号"
              min-width="150"
              show-overflow-tooltip
            />
            <el-table-column
              fixed="left"
              prop="status"
              label="订单状态"
              width="120"
            >
              <template slot-scope="scope">
                {{ (statusList.find(e => e.id === scope.row.status) || {}).name }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="custType === '0'"
              prop="custName"
              label="客户名称"
              width="150"
              show-overflow-tooltip
            />
            <el-table-column
              prop=""
              label="包裹类型"
              width="120"
            >
              <template>
                <span>箱</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="packageNum"
              label="包裹数量"
              width="150"
            />
            <el-table-column
              prop=""
              label="总重量"
              width="150"
            >
              <template slot-scope="scope">
                <span>
                  {{ $volumeConversion(scope.row.totalWeight, scope.row.unitWeight, 'KGS') }} kg
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="totalVolume"
              label="总体积"
              width="150"
            >
              <template slot-scope="scope">
                <span>
                  {{ $volumeConversion(scope.row.totalVolume, $getVolumeUnitByLengthUnit(scope.row.unitMeasure), 'CBM') }} m³
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="expressName"
              label="快递公司"
              min-width="180"
              show-overflow-tooltip
            />
            <el-table-column
              prop="consigneeName"
              label="收件人"
              min-width="180"
              show-overflow-tooltip
            />
            <el-table-column
              prop="consigneeZip"
              label="收件人邮编"
              min-width="180"
              show-overflow-tooltip
            />
            <el-table-column
              prop="createTime"
              label="下单时间"
              width="180"
            />
            <el-table-column
              label="操作"
              fixed="right"
              width="230"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['deliveryOrderGet']"
                  type="text"
                  @click="viewData(scope.row)"
                >
                  查看
                </el-button>
                <el-button
                  v-if="scope.row.status !== 1 && custType === '0' && searchForm.orderType === '1' && $checkPermission(['expressReSubmit'])"
                  type="text"
                  @click="showReSubmit(scope.row)"
                >
                  重新提交
                </el-button>
                <el-button
                  v-if="scope.row.status === 1 && (custType === '0' || custType === '3') && searchForm.orderType === '1' && $checkPermission(['revokeExpress'])"
                  type="text"
                  @click="revokeExpressOrder(scope.row)"
                >
                  撤单
                </el-button>
                <el-button
                  v-if="(scope.row.status === 90 || scope.row.status === 99) && (custType === '0' || custType === '3') && searchForm.orderType === '1' && $checkPermission(['changeOrderExpress'])"
                  type="text"
                  @click="changeOrder(scope.row)"
                >
                  换单
                </el-button>
                <el-dropdown
                  v-if="(custType === '0' || custType === '3') && (scope.row.status === 1 || searchForm.orderType === '0') && $checkPermission(['downExpressTags'])"
                  trigger="click"
                  @command="handleCommand"
                >
                  <span
                    class="el-dropdown-link"
                    @click="handleMore(scope.row)"
                  >
                    更多
                    <i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-if="scope.row.status === 1 && (custType === '0' || custType === '3') && $checkPermission(['downExpressTags'])"
                      command="1"
                    >
                      下载快递标签ZIP
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="scope.row.status === 1 && (custType === '0' || custType === '3') && $checkPermission(['downExpressTags'])"
                      command="2"
                    >
                      下载快递标签PDF
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="scope.row.status === 1 && (custType === '0' || custType === '3') && $checkPermission(['downExpressTags'])"
                      command="6"
                    >
                      下载快递标签PDF(马赛克)
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="scope.row.status === 1 && (custType === '0' || custType === '3') && $checkPermission(['downExpressTags'])"
                      command="3"
                    >
                      下载指定快递标签
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="scope.row.status === 1 && (custType === '0' || custType === '3')"
                      command="4"
                    >
                      导出
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="searchForm.orderType === '0' && (custType === '0' || custType === '3')"
                      command="5"
                    >
                      操作日志
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            :current-page.sync="current"
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
        v-show="showPage === 'd'"
        class="app-container"
      >
        <detail
          ref="detailForm"
          @back="showPage = 'i'"
        />
      </div>
      <div
        v-show="showPage === 'r'"
        class="app-container"
      >
        <re-submit
          ref="reSubmit"
          @back="showPage = 'i'"
          @load="getTableData"
        />
      </div>
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
    <el-dialog
      title="换单"
      width="500px"
      :close-on-click-modal="false"
      :visible.sync="visible"
      @close="visible = false"
    >
      <div v-loading="formLoading">
        <el-form
          ref="supperierForm"
          label-width="100px"
          size="small"
          style="padding-right: 20px;"
        >
          <el-form-item
            label="快递服务"
          >
            <el-select
              v-model="changeOrderEsc"
              placeholder="请选择快递服务"
              style="width:100%;"
              size="small"
              filterable
              :loading="selectLoading"
              @focus="getEscList"
            >
              <el-option
                v-for="item in escList"
                :key="item.id"
                :label="item.name + '-' + item.abbr"
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
            :disabled="formLoading"
            @click="visible = false"
          >
            取 消
          </el-button>
          <el-button
            type="primary"
            :disabled="formLoading"
            size="small"
            @click="confirmChangeOrder"
          >
            确 定
          </el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="操作日志"
      width="960px"
      :close-on-click-modal="false"
      :visible.sync="recordDialog"
      @close="recordDialog = false, recordTime = []"
    >
      <div v-loading="formLoading">
        <div style="text-align: right;">
          <el-date-picker
            v-model="recordTime"
            unlink-panels
            type="daterange"
            align="right"
            size="small"
            value-format="yyyy-MM-dd"
            range-separator="~"
            style="width:240px;margin-right:10px;"
            start-placeholder="起始时间"
            end-placeholder="截止时间"
          />
          <el-button
            type="primary"
            size="small"
            @click="getExpressRecord(1)"
          >
            查询
          </el-button>
        </div>
        <el-table
          v-loading="formLoading"
          :data="recordList"
          height="400px"
          style="width: 100%;margin: 10px 0;"
          border
        >
          <el-table-column
            prop="createTime"
            label="时间"
            width="180"
          />
          <el-table-column
            prop="realName"
            label="操作人"
            min-width="150"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.realName }}&nbsp;</span>
              <span>{{ scope.row.realName.indexOf('系统') !== -1 ? '' : '(账号：' + scope.row.userId + ')' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="msg"
            label="日志"
            min-width="180"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.method }}&nbsp;</span>
              <span>{{ scope.row.success === 1 ? '操作失败，原因：' + scope.row.msg : scope.row.msg }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page.sync="currentR"
          layout="total, prev, pager, next"
          :total="totalR"
          style="text-align: right;"
          @current-change="handleRecordChange"
        />
      </div>
    </el-dialog>
    <express-export
      ref="expressExport"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getOrderList,
  getExpressCompany,
  getSupplierList,
  getExpressRecordList,
  getCustTypeList,
  getAgentList,
  getCustomerList,
  deleteOrder,
  saveSupperier,
  getExpressOrdersZipFile,
  getExpressOrdersPdfFile,
  getExpressOrdersPdfMosaic,
  exportExpressExcel,
  revokeExpressOrder,
  changedExpressOrder
} from '@/api/orderlist-at-express'
import detail from '@/views/orderlist-management/express-order/detail.vue'
import reSubmit from '@/views/orderlist-management/express-order/re-submit.vue'
import expressExport from '@/views/orderlist-management/express-order/express-export.vue'
import dayjs from 'dayjs'
import { getEscList } from '@/api/service-with-express-service'

@Component({
  name: '',
  components: {
    detail,
    reSubmit,
    expressExport
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private showPage: string = 'i' // i 订单列表 d详情 r重新提交
  private loading: boolean = false
  private formLoading: boolean = false
  private isSupperierVisible: boolean = false
  private selectLoading: boolean = false
  private visible: boolean = false
  private recordDialog: boolean = false
  private isEdit: boolean = false
  private recordList: any[] = []
  private recordTime: any[] = []
  private companyTypeList: any[] = [
    { id: '1', name: '客户' },
    { id: '2', name: '二级代理商' }
  ]
  private orderTypeList: any[] = [
    { name: '销售订单', id: '0' },
    { name: '采购订单', id: '1' }
  ]

  private trailerTypeList = [
    { name: '进口拖车', id: '1' },
    { name: '出口拖车', id: '2' }
  ]
  private statusList = [
    {
      id: 0,
      name: '未提交'
    },
    {
      id: 1,
      name: '已提交'
    },
    {
      id: 90,
      name: '已撤单'
    },
    {
      id: 99,
      name: '提交失败'
    }
  ]

  private expressList: any[] = []
  private companyList: any[] = []
  private keyType = '1'
  private keyWord: any = ''
  private tableData: any[] = []
  private numberData: any[] = []
  private searchForm: any = {
    status: undefined,
    trailerType: undefined,
    custId: undefined,
    orderTime: [],
    expressId: undefined,
    comId: undefined,
    comType: '',
    orderType: '0'
  }
  private title = ''
  private customsId = ''
  private moreObj: any = {}
  private current: number = 1
  private currentR: number = 1
  private size: number = 10
  private total: any = 0
  private totalR: any = 0
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
  private escList: any[] = []
  private changeOrderRow: any = {}
  private changeOrderEsc: any = ''

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
  private viewNumber(row: any): void {
    this.numberData = row.identificationNo ? row.identificationNo.split(',') : []
  }
  private confirmChangeOrder() {
    if (!this.changeOrderEsc) {
      this.$message.error('请选择快递服务')
      return
    }
    const params = {
      id: this.changeOrderRow.id,
      escId: this.changeOrderEsc
    }
    this.formLoading = true
    changedExpressOrder(params).then(() => {
      this.changeOrderRow = {}
      this.formLoading = false
      this.$message.success('换单成功')
      this.visible = false
      this.getTableData()
    }).catch(() => {
      this.formLoading = false
    })
  }
  private changeOrder(row: any) {
    this.changeOrderRow = row
    this.changeOrderEsc = ''
    this.visible = true
  }
  private getEscList() {
    const params = {
      page: 1,
      size: 9999,
      model: {
        custId: (this as any).custId
      }
    }
    this.selectLoading = true
    getEscList(params).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      this.escList = data.result || []
    }).catch(() => {
      this.selectLoading = false
      this.escList = []
    })
  }
  private revokeExpressOrder(row: any) {
    this.$confirm('请确认是否对该订单撤单?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const params = {
        id: row.id,
        orderNo: row.orderNo
      }
      this.loading = true
      revokeExpressOrder(params).then(() => {
        this.loading = false
        this.$message.success('撤单成功')
        this.getTableData()
      }).catch(() => {
        this.loading = false
        this.getTableData()
      })
    }).catch(() => {
      return false
    })
  }
  private showReSubmit(row: any) {
    (this.$refs.reSubmit as any).setData(row)
    this.showPage = 'r'
  }
  private handleMore(row: any) {
    this.moreObj = row
  }
  private showDownDialog() {
    (this.$refs.expressExport as any).show(this.moreObj.identificationNo)
  }
  private handleCommand(command: any) {
    switch (command) {
      case '1':
        this.downZipData(this.moreObj)
        break
      case '2':
        this.downPdfData(this.moreObj, '2')
        break
      case '6':
        this.downPdfData(this.moreObj, '6')
        break
      case '3':
        // 下载指定快递标签
        this.showDownDialog()
        break
      case '4':
        this.getExpressExcel()
        break
      case '5':
        this.recordDialog = true
        this.recordTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
        this.getExpressRecord()
        break
      default:
        break
    }
  }
  private downZipData(row: any) {
    if (!row.orderNo) {
      this.$message.error('原单号不存在')
      return
    }
    getExpressOrdersZipFile({
      orderNo: row.orderNo
    }).then((res:any) => {
      if (res.type && res.type.indexOf('octet-stream') !== -1) {
        const url = window.URL.createObjectURL(res)
        const a = document.createElement('a')
        document.body.appendChild(a)
        a.href = url
        a.download = '快递订单' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.zip'
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        this.$message.error('暂无快递标签')
      }
    }).catch((err:any) => {
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
    })
  }
  private downPdfData(row: any, str: string) {
    if (!row.orderNo) {
      this.$message.error('原单号不存在')
      return
    }
    let func: any = null
    if (str === '2') {
      func = getExpressOrdersPdfFile
    } else if (str === '6') {
      func = getExpressOrdersPdfMosaic
    } else {
      return
    }
    func({
      orderNo: row.orderNo
    }).then((res:any) => {
      const url = window.URL.createObjectURL(res)
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.href = url
      a.download = '快递订单' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.pdf'
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }).catch((err:any) => {
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
    })
  }
  private getExpressExcel() {
    const params = {
      code: this.moreObj.orderNo
    }
    this.loading = true
    exportExpressExcel(params).then((res:any) => {
      const a = document.createElement('a')
      document.body.appendChild(a)
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      const objUrl = URL.createObjectURL(blob)
      a.href = objUrl
      a.download = this.moreObj.orderNo + ' ' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.xls'
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(objUrl)
      this.loading = false
    }).catch((err:any) => {
      this.loading = false
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
    })
  }
  private getExpressRecord(val?: any) {
    this.formLoading = true
    if (val) {
      this.currentR = val
    }
    const params = {
      current: this.currentR,
      size: 10,
      data: {
        orderId: this.moreObj.id,
        startTime: this.recordTime.length > 0 ? this.recordTime[0] + ' 00:00:00' : '',
        endTime: this.recordTime.length > 0 ? this.recordTime[1] + ' 23:59:59' : ''
      }
    }
    getExpressRecordList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.recordList = data.records || []
        this.totalR = data.total
        this.formLoading = false
      }).catch((err:any) => {
        this.formLoading = false
        return err
      })
  }
  private handleRecordChange(val: string) {
    this.currentR = Number(val)
    this.getExpressRecord()
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
      params.types = '00'
      func = getAgentList
    } else if (type === '0') {
      params.parentId = this.custId
      params.subtype = '1'
      params.types = '00'
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
    this.showPage = 'd'
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
    if (this.searchForm.orderType === '0') { // 销售
      this.searchForm.sellerId = this.searchForm.custId
      this.searchForm.customerId = type === '3' ? '0' : this.searchForm.comId
    } else if (this.searchForm.orderType === '1') { // 采购
      this.searchForm.customerId = this.searchForm.custId
    }
    const { comId, comType, orderType, custId, orderTime, ...form }: any = this.searchForm
    if (val) {
      this.current = val
    }
    const params: any = {
      current: this.current,
      size: this.size,
      data: {
        custId: (this as any).custId,
        custType: (this as any).custType,
        orderNo: this.keyType === '1' ? this.keyWord : undefined,
        identificationNo: this.keyType === '2' ? this.keyWord : undefined,
        ...form
      }
    }
    if (Array.isArray(orderTime) && orderTime.length > 0) {
      params.data.start = orderTime[0]
      params.data.end = orderTime[1]
    }
    getOrderList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.tableData = data.records || []
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
    this.current = Number(val)
    this.getTableData()
  }
  private created(): void {
    this.searchForm.custId = (this as any).custId
    this.searchForm.orderTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    this.getTableData()
  }
  private volumesFilter(vol: any, len: any) {
    if (len === 'CM') {
      return (vol * 0.000001).toFixed(3)
    } else if (len === 'M') {
      return (vol).toFixed(3)
    } else if (len === 'INCH') {
      return (vol * 0.0000164).toFixed(3)
    } else if (len === 'FT') {
      return (vol * 0.0283168).toFixed(3)
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-dropdown-link {
    margin-left: 10px;
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
