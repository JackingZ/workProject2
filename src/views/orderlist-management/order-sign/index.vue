<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
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
          title="订单签收"
        >
          <template v-slot:option>
            <el-button
              v-permission="['orderSignQuery']"
              type="text"
              size="small"
              @click="handleMoreSearch"
            >
              更多筛选
            </el-button>
            <!--<el-button
              v-permission="['orderSignExport']"
              :loading="excelLoading"
              type="primary"
              size="small"
              @click="handleExport"
            >
              导出当前数据
            </el-button>-->
          </template>
        </head-info>
        <div class="app-panel">
          <div style="text-align:right;">
            <el-select
              v-if="custType === '0'"
              v-model="searchForm.agentId"
              :loading="selectLoading"
              size="small"
              style="width:130px;margin-right:5px;"
              placeholder="一级代理商"
              filterable
              clearable
              @change="onAgent"
              @focus="getAgentList"
            >
              <el-option
                v-for="item in agentList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <!--<el-select
              v-if="custType === '2' && custSubtype === '2'"
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
            </el-select>-->
            <el-select
              v-if="custType === '2' && custSubtype === '1'"
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
              v-if="custType === '2' && searchForm.orderType === '0'"
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

            <!-- <el-select
              v-model="searchForm.status"
              :loading="selectLoading"
              placeholder="订单状态"
              style="width: 100px;margin-right: 5px;"
              size="small"
              clearable
              filterable
            >
              <el-option
                v-for="item in lineStatusList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select> -->
            <el-select
              v-model="searchForm.audit"
              placeholder="审核状态"
              size="small"
              clearable
              style="width:100px;margin-right:5px;"
            >
              <el-option
                label="待审核"
                value="0"
              />
              <el-option
                label="审核中"
                value="3"
              />
              <el-option
                label="审核通过"
                value="1"
              />
              <el-option
                label="审核拒绝"
                value="2"
              />
            </el-select>
            <el-select
              v-model="searchForm.type"
              size="small"
              style="width: 100px;margin-right: 5px;"
              placeholder="业务类型"
              filterable
              clearable
              @change="onType"
            >
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>

            <el-select
              v-model="searchForm.countryId"
              :loading="selectLoading"
              clearable
              filterable
              placeholder="目的国家"
              style="width:130px;margin-right:5px;"
              size="small"
              @focus="getCountryList"
              @change=";(searchForm.fbastoreId = undefined, searchForm.lscId = undefined)"
            >
              <el-option
                v-for="item in countryList"
                :key="item.id"
                :label="`${item.name}-${item.alias}`"
                :value="item.id"
              />
            </el-select>

            <el-select
              v-model="searchForm.fbastoreId"
              :loading="selectLoading"
              size="small"
              style="width: 130px;margin-right: 5px;"
              placeholder="FBA仓库"
              clearable
              filterable
              @focus="getWarehouseList"
            >
              <el-option
                v-for="item in warehouseList"
                :key="item.id"
                :label="item.code"
                :value="item.id"
              />
            </el-select>

            <el-select
              v-model="searchForm.lscId"
              :disabled="!searchForm.type || !searchForm.countryId"
              :loading="selectLoading"
              size="small"
              style="width: 130px;margin-right: 5px;"
              placeholder="服务"
              clearable
              filterable
              @focus="getPrivatelineList"
            >
              <el-option
                v-for="item in privatelineList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-date-picker
              v-model="searchForm.orderTime"
              unlink-panels
              :clearable="false"
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
                v-model="selectType"
                size="small"
                style="width:100px;"
                placeholder="请选择"
              >
                <el-option
                  label="原单号"
                  value="1"
                />
                <el-option
                  label="客户名称"
                  value="2"
                />
                <el-option
                  label="柜号"
                  value="3"
                />
              </el-select>
            </el-input>
            <el-button
              v-permission="['orderSignQuery']"
              type="primary"
              size="small"
              @click="getTableData(1)"
            >
              查询
            </el-button>
          </div>

          <div
            class="freeze-box"
            @mousemove="handleMouseMove"
          >
            <el-table
              v-loading="loading"
              :data="tableData"
              :row-class-name="rowClassName"
              height="calc(100vh - 313px)"
              style="width: 100%;margin: 10px 0;"
              border
              @cell-mouse-enter="handleMouseEnter"
              @cell-mouse-leave="handleMouseLeave"
            >
              <el-table-column
                fixed="left"
                label="订单信息"
                min-width="230"
              >
                <div
                  slot-scope="scope"
                  class="order-info"
                >
                  <div
                    class="seriver-info"
                    :title="scope.row.lsc.value"
                  >
                    <div
                      v-if="scope.row.type === '0'"
                      class="type"
                    >
                      空运
                    </div>
                    <div
                      v-if="scope.row.type === '1'"
                      class="type"
                    >
                      海运
                    </div>
                    <div
                      v-if="scope.row.type === '2'"
                      class="type"
                    >
                      铁路
                    </div>
                    <div
                      v-if="scope.row.type === '3'"
                      class="type"
                    >
                      快递
                    </div>
                    <div
                      v-if="scope.row.type === '4'"
                      class="type"
                    >
                      卡航
                    </div>
                    <div
                      class="lscName"
                    >
                      {{ scope.row.lsc.value }}
                    </div>
                  </div>
                  <div
                    class="code"
                    :title="scope.row.code"
                  >
                    <span
                      v-copy="scope.row.code"
                      class="copy-icon"
                    />
                    <span>
                      原单号：{{ scope.row.code }}
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
                      v-if="scope.row.insufficient"
                      class="btn-tip-red"
                    >
                      信用不足
                    </span>
                  </div>
                </div>
              </el-table-column>
              <el-table-column
                label="客户名称"
                fixed="left"
                min-width="120"
              >
                <template slot-scope="scope">
                  <span>{{ (scope.row.orderCustomer || {}).name || scope.row.updateBy }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="下单客户"
                min-width="120"
              >
                <template slot-scope="scope">
                  <span v-if="custType !== '0'">{{ (scope.row.buyer || {}).name }}</span>
                  <span v-else>{{ (scope.row.seller || {}).name }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="下单时间"
                width="160"
              />
              <el-table-column
                prop=""
                label="下单仓库"
                width="160"
              >
                <template slot-scope="scope">
                  {{ (scope.row.warehouse || {}).name || '--' }}
                </template>
              </el-table-column>
              <el-table-column
                prop=""
                label="货物所在仓"
                width="160"
              >
                <template slot-scope="scope">
                  {{ (scope.row.warehouse1 || {}).name || '--' }}
                </template>
              </el-table-column>
              <el-table-column
                label="报关方式"
                width="100"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.customs0 === '0'">普通报关</span>
                  <span v-else-if="scope.row.customs0 === '1'">出口退税</span>
                  <!--<span v-else-if="scope.row.customs1 === '0'">自有进口商报关</span>-->
                  <!--<span v-else-if="scope.row.customs1 === '1'">无进口商</span>-->
                </template>
              </el-table-column>
              <el-table-column
                label="提货方式"
                width="100"
              >
                <template slot-scope="scope">
                  {{ (pickList[(scope.row.supplement || {}).pickType] || {}).name }}
                </template>
              </el-table-column>
              <el-table-column
                label="派送方式"
                width="100"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.deliveryWay === '0'">快递</span>
                  <span v-if="scope.row.deliveryWay === '1'">卡派</span>
                  <span v-if="scope.row.deliveryWay === '2'">自提</span>
                  <span v-if="scope.row.deliveryWay === '3'">整柜直送</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="packages"
                label="件数"
                width="120"
              />
              <el-table-column
                prop="value"
                label="金额"
                min-width="120"
              >
                <template slot-scope="scope">
                  {{ (scope.row.value ? (scope.row.value).toFixed(2) : '') + ' ' + (scope.row.currency || {}).key }}
                </template>
              </el-table-column>
              <el-table-column
                prop=""
                label="是否发货"
                width="100"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.ifLoading === 0">未发货</span>
                  <span v-if="scope.row.ifLoading === 1">已发货</span>
                  <span v-if="scope.row.ifLoading === 2">部分发货</span>
                </template>
              </el-table-column>
              <el-table-column
                label="审核状态"
                width="100"
              >
                <template slot-scope="scope">
                  <div class="audit-wrap">
                    <el-tooltip
                      v-if="scope.row.audit === '2'"
                      class="item"
                      effect="dark"
                      :content="scope.row.reason || '审核不通过'"
                      placement="top"
                    >
                      <span
                        class="audit"
                      />
                    </el-tooltip>
                    {{ formmatAudit(scope.row) }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="入库状态"
                width="100"
              >
                <template slot-scope="scope">
                  {{ (statusList.find(e => e.id === scope.row.status['WS_IN']) || {name: '--'}).name }}
                </template>
              </el-table-column>
              <el-table-column
                label="出库状态"
                width="100"
              >
                <template slot-scope="scope">
                  {{ (statusList.find(e => e.id === scope.row.status['WS_OUT']) || {name: '--'}).name }}
                </template>
              </el-table-column>
              <el-table-column
                label="计量状态"
                width="100"
              >
                <template slot-scope="scope">
                  <span>
                    {{ (statusList.find(e => e.id === scope.row.status['MEASURE']) || {name: '--'}).name }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="验货状态"
                width="100"
              >
                <template slot-scope="scope">
                  <span>
                    {{ (statusList.find(e => e.id === scope.row.status['EXAMINE']) || {name: '--'}).name }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="报关状态"
                width="100"
              >
                <template slot-scope="scope">
                  <span>
                    {{ (statusList.find(e => e.id === scope.row.status['CUSTOM_DECLARATION']) || {name: '--'}).name }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="预估运费"
                min-width="120"
              >
                <template slot-scope="scope">
                  {{ (scope.row.price || {}).totalPrice }} {{ (scope.row.price || {}).currencyId }}
                </template>
              </el-table-column>
              <el-table-column
                prop="cutoffTime"
                label="截止付款时间"
                width="160"
              />
              <el-table-column
                :formatter="formatCutoffDay"
                prop=""
                label="逾期天数"
                width="100"
              />
              <el-table-column
                fixed="right"
                label="操作"
                width="120"
              >
                <template slot-scope="scope">
                  <el-button
                    v-permission="['signOrderView']"
                    type="text"
                    @click="viewData(scope.row)"
                  >
                    查看
                  </el-button>
                  <el-button
                    v-permission="['signOrder']"
                    type="text"
                    @click="signOrder(scope.row)"
                  >
                    {{ (scope.row.statusFiles || {})[9020] ? '已签收' : '签收' }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div
              id="freezeTip"
              style="display: none;"
              class="freeze-tip"
            />
          </div>

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
        <drawer
          :is-show="moreShow"
          :mask-closable="false"
          drawer-title="更多筛选"
          drawer-style="width: 400px;"
          cancel-text="重置"
          confirm-text="查询"
          @drawerClose="handleMoreCancle"
          @drawerConfirm="handleMoreConfirm"
        >
          <searchMore
            ref="searchMore"
            :status-list="statusList"
          />
        </drawer>
      </div>
      <div
        v-show="detailShow"
        class="app-container"
      >
        <detail
          ref="detailForm"
          :line-list="privatelineList"
          :pick-list="pickList"
          :type-list="typeList"
          :ware-list="warehouseList"
          @back="getBack"
        />
      </div>
      <el-dialog
        title="订单签收"
        :visible="showSign"
        :close-on-click-modal="false"
        width="500px"
        @close="closeSignModal"
      >
        <el-form
          ref="signForm"
          v-loading="signModalLoading"
          :model="signForm"
          :rules="rules"
          label-width="100px"
          size="small"
          style="padding-right: 20px;"
        >
          <el-form-item
            label="签收时间"
            prop="createTime"
          >
            <el-date-picker
              v-model="signForm.createTime"
              type="datetime"
              placeholder="选择签收时间"
            />
          </el-form-item>
          <el-form-item
            label="签收单"
            prop="fileName"
          >
            <div style="display: flex">
              <el-upload
                action
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request="uploadFile"
                class="avatar-uploader"
              >
                <el-button
                  type="text"
                >
                  {{ signForm.fileName ? '重新上传' : '上传' }}
                </el-button>
              </el-upload>
              <el-button
                v-if="signForm.fileName"
                style="margin: 0 10px"
                type="text"
                @click="handlePreview"
              >
                查看
              </el-button>
              <el-button
                v-if="signForm.fileName"
                type="text"
                @click="handleDelete"
              >
                删除
              </el-button>
            </div>
          </el-form-item>
        </el-form>
        <div style="text-align: right">
          <el-button
            size="small"
            @click="closeSignModal"
          >
            取 消
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="saveSignOrder"
          >
            签 收
          </el-button>
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
  getFbastoreList,
  getLscComplicatedList,
  getAgentList,
  getCustomerList
  // getOrderExcel
} from '@/api/orderlist-at-whole'
import detail from '@/views/orderlist-management/whole-order/detail.vue'
import dayjs from 'dayjs'
import { getStatusList, getCountryByCustSerice } from '@/api/public'
import drawer from '@/components/Drawer/drawer.vue'
import searchMore from '@/views/orderlist-management/order-sign/searchMore.vue'
import {
  uploadFile,
  deleteFile,
  signOrder
} from '@/api/orderlist-at-order-sign'

@Component({
  name: 'whole',
  components: {
    detail,
    drawer,
    searchMore
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private signType: any = 'sign'
  private signForm: any = {
    createTime: '',
    fileName: '',
    fileSource: ''
  }
  private rules: any = {
    createTime: { required: true, message: '请选择签收时间', trigger: 'change' },
    fileName: { required: true, message: '请上传签收单', trigger: 'change' }
  }
  private signModalLoading: boolean = false
  private showSignRow: any = {}
  private showSign: boolean = false
  private detailShow: boolean = false
  private moreShow: boolean = false
  private loading: boolean = false
  private selectLoading: boolean = false
  // private excelLoading: boolean = false
  private companyTypeList: any[] = [
    { id: '1', name: '客户' },
    { id: '2', name: '二级代理商' }
  ]
  private orderTypeList: any[] = [
    { name: '销售订单', id: '0' },
    { name: '采购订单', id: '1' }
  ]
  private selectType = '1'
  private keyWord: any = ''
  private freezeRemark: any = ''
  private tableData: any = []
  private searchForm: any = {
    coverTank: undefined,
    ifFrozen: undefined,
    customs0: undefined,
    status: undefined,
    audit: undefined,
    type: undefined,
    lscId: undefined,
    custId: undefined,
    code: undefined,
    customerName: undefined,
    countryId: undefined,
    fbastoreId: undefined,
    comId: undefined,
    agentId: undefined,
    deliveryWay: undefined,
    declartionStatus: undefined,
    expressNo: undefined,
    examineStatus: undefined,
    measureStatus: undefined,
    inventoryStatus: undefined,
    includeTax: undefined,
    comType: '',
    orderType: '0',
    orderTime: []
  }
  private page: number = 1
  private size: number = 10
  private total: any = 0

  private typeList = [
    { name: '空运', id: '0' },
    { name: '海运', id: '1' },
    { name: '铁路', id: '2' },
    // { name: '快递', id: '3' },
    { name: '卡航', id: '4' }
  ]
  private statusList = []
  private pickList: any[] = [
    { name: '自主送货', id: '0' },
    { name: '上门提货', id: '1' },
    { name: '快递发货', id: '2' },
    { name: '整柜直装', id: '3' }
  ]
  private privatelineList: any[] = []
  private countryList: any[] = []
  private warehouseList: any[] = []
  private companyList: any[] = []
  private agentList: any[] = []
  private uploadFileList: any = []

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
  get lineStatusList(): any[] {
    return this.statusList.filter((e: any) => e.type === 'LINE' && e.id !== '501')
  }

  /* methods */
  private handleDelete() {
    this.$confirm('请确认是否删除?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const params = {
        ifPublic: true,
        fileList: [this.signForm.fileName]
      }
      this.signModalLoading = true
      deleteFile(params).then(() => {
        this.$message.success('删除成功')
        this.signModalLoading = false
        this.signForm.fileName = ''
        this.signForm.fileSource = ''
      }).catch(() => {
        this.signModalLoading = false
      })
    }).catch(() => {
      return false
    })
  }
  private handlePreview() {
    window.open(this.signForm.fileSource)
  }
  private beforeAvatarUpload(file: any) {
    const isLt2M = file.size / 1024 / 1024 < 10
    if (!isLt2M) {
      this.$message.error('上传文件大小不能超过 10MB!')
    }
    return isLt2M
  }
  private uploadFile(data: any) {
    const formData = new FormData()
    const file = new File([data.file], data.file.name.split('.')[0] + new Date().getTime() + '.' + data.file.name.split('.')[1], { type: data.file.type })
    formData.append('file', file)
    this.signModalLoading = true
    if (this.signForm.fileName) {
      this.uploadFileList.push(this.signForm.fileName)
    }
    uploadFile(formData).then((res: any) => {
      this.signModalLoading = false
      this.$message.success('上传成功')
      const result = res.data || {}
      this.signForm.fileName = result.objectName
      this.uploadFileList.push(result.objectName)
      this.uploadFileList = [...new Set([...this.uploadFileList])]
      this.signForm.fileSource = process.env.VUE_APP_OSS_PATH + result.objectName
    }).catch(() => {
      this.signForm.fileName = ''
      this.signForm.fileSource = ''
      this.signModalLoading = false
    })
  }
  private saveSignOrder() {
    const form: any = this.$refs.signForm
    form.validate((valid: any) => {
      if (valid) {
        const params = {
          fullStatusFile: {
            ...this.signForm,
            status: '9020'
          },
          code: this.showSignRow.code
        }
        this.uploadFileList = this.uploadFileList.filter((e: any) => e !== this.signForm.fileName)
        this.signModalLoading = true
        signOrder(params).then(() => {
          this.signModalLoading = false
          this.$message.success('签收成功')
          this.signForm = {
            createTime: '',
            fileName: '',
            fileSource: ''
          }
          this.closeSignModal('closeBySave')
          this.getTableData()
        }).catch(() => {
          this.signModalLoading = false
        })
      }
    })
  }
  private closeSignModal(type?: any) {
    if (type !== 'closeBySave' && this.signType === 'reset' && !this.signForm.fileName) {
      this.$message.warning('请重新上传文件')
      return
    }
    if (this.uploadFileList.length) {
      if (type !== 'closeBySave' && this.signType === 'reset') {
        this.uploadFileList = this.uploadFileList.filter((e: any) => e !== this.showSignRow.signFileName)
      }
      const params = {
        ifPublic: true,
        fileList: this.uploadFileList
      }
      deleteFile(params).then((res: any) => {
        return res
      }).catch((err: any) => {
        return err
      })
    }
    this.uploadFileList = []
    this.signType = ''
    this.showSign = false
    this.showSignRow = {}
    this.signForm = {
      createTime: '',
      fileName: '',
      fileSource: ''
    }
  }
  private signOrder(row: any) {
    const file = (row.statusFiles || {})[9020] || ''
    this.signType = 'sign'
    if (file && file[0]) {
      this.signType = 'reset'
      this.signForm = {
        createTime: file[0].createTime,
        fileName: file[0].fileName,
        fileSource: file[0].fileSource
      }
    }
    this.showSign = true
    this.showSignRow = {
      ...row,
      signFileName: file && file[0] && file[0].fileName
    }
    this.$nextTick(() => {
      const form: any = this.$refs.signForm
      form.clearValidate()
    })
  }
  private formatPay(row: any) {
    const pay = row.payTime ? dayjs(row.payTime).unix() : ''
    const now = dayjs().unix()
    const time = pay || now
    const cut = row.cutoffTime ? dayjs(row.cutoffTime).unix() : ''
    return !!cut && (cut && cut < time)
  }
  private formatCutoffDay(row: any) {
    const pay = row.payTime ? dayjs(row.payTime).unix() : ''
    const now = dayjs().unix()
    const time = pay || now
    const cut = row.cutoffTime ? dayjs(row.cutoffTime).unix() : ''
    const old = time ? dayjs(time).unix() : undefined
    if (cut && cut < time) {
      return Math.ceil((time - cut) / 86400) + '天'
    } else {
      return '--'
    }
  }
  private handleMouseEnter(row: any, column: any, cell: any, event: any) {
    this.freezeRemark = row.ifFrozen ? '冻结原因: ' + (row.freeze || {}).remark : ''
  }
  private handleMouseLeave() {
    this.freezeRemark = ''
  }
  private handleMouseMove(event: any) {
    const el: any = document.getElementById('freezeTip')
    el.style.left = event.clientX + 25 + 'px'
    el.style.top = event.clientY + 'px'
    if (this.freezeRemark) {
      el.style.display = 'block'
      el.innerHTML = this.freezeRemark
    } else {
      el.style.display = 'none'
      el.innerHTML = ''
    }
  }
  private getBack() {
    this.detailShow = false
    this.getTableData()
  }
  private onOrderType() {
    this.tableData = []
    if (this.searchForm.orderType === '1') {
      this.searchForm.comType = ''
      this.searchForm.comId = ''
      this.companyList = []
    } else if (this.searchForm.orderType === '0') {
      this.searchForm.comType = '1'
    }
  }
  private onComType() {
    // 仅一级代理商/juhuotong可操作
    this.searchForm.comId = ''
    this.companyList = []
    this.tableData = []
  }
  private onType() {
    this.searchForm.deliveryWay = undefined
    this.searchForm.coverTank = undefined
    this.searchForm.lscId = undefined
  }
  private onAgent() {
    this.searchForm.comId = undefined
    this.companyList = []
    this.tableData = []
    this.getTableData(1)
  }
  private onCompany() {
    this.tableData = []
    this.getTableData(1)
  }
  private getAgentList() {
    const params:any = {
      page: 1,
      size: 99999
    }
    params.parentId = this.custId
    params.subtype = '1'
    params.types = '05'
    this.selectLoading = true
    getAgentList(params).then((res:any) => {
      const data = res.data || {}
      this.agentList = data.result || []
      this.selectLoading = false
    }).catch((err:any) => {
      this.selectLoading = false
      return err
    })
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
      params.types = '05'
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
  private getCountryList() {
    const params = {
      custId: this.custId || '',
      typeId: '05'
    }
    this.selectLoading = true
    getCountryByCustSerice(params)
      .then((res: any) => {
        this.countryList = res.data || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  // 专线渠道
  private getPrivatelineList() {
    this.selectLoading = true
    const params: any = {
      countryId: this.searchForm.countryId,
      subtypeId: this.searchForm.type
    }
    getLscComplicatedList(params)
      .then((res: any) => {
        const data = res.data || []
        this.privatelineList = data
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  // 查询仓库
  private getWarehouseList() {
    this.selectLoading = true
    const params = {
      countryId: this.searchForm.countryId,
      codeSort: 'A',
      page: 1,
      size: 9999
    }
    getFbastoreList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.warehouseList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private formmatAudit(row: any) {
    if (row.audit === '0') {
      return '待审核'
    } else if (row.audit === '1') {
      return '审核通过'
    } else if (row.audit === '2') {
      return '审核拒绝'
    } else if (row.audit === '3') {
      return '审核中'
    }
  }
  private viewData(row: any) {
    // 查看
    this.detailShow = true
    const root: any = this.$refs.detailForm
    root.setData(row)
  }
  private rowClassName({ row, rowIndex }: any) {
    if (row.ifFrozen || row.audit === '2') {
      return 'frost-red'
    }
  }
  // private handleExport() {
  //   this.excelLoading = true
  //   const type = (this as any).custType
  //   if (type === '1') { // 客户
  //     this.searchForm.orderType = '1'
  //   }
  //   const { comId, agentId, comType, orderType, custId, orderTime, ...form }: any = this.searchForm
  //   const params: any = {
  //     ...form,
  //     code: this.selectType === '1' && this.keyWord ? this.keyWord : undefined,
  //     customerName: this.selectType === '2' && this.keyWord ? this.keyWord : undefined,
  //     trackingNo: this.selectType === '3' && this.keyWord ? this.keyWord : undefined,
  //     salesmanStatusTag: true
  //   }
  //   if (Array.isArray(orderTime) && orderTime.length > 0) {
  //     params.startDate = orderTime[0]
  //     params.endDate = orderTime[1]
  //   }
  //   if (orderType === '0') { // 销售
  //     params.sellerId = type === '0' ? agentId : custId
  //     params.buyerId = comId
  //   } else if (orderType === '1') { // 采购
  //     params.buyerId = custId
  //   }
  //   getOrderExcel({ ...params }).then((res:any) => {
  //     this.excelLoading = false
  //     const a = document.createElement('a')
  //     document.body.appendChild(a)
  //     const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
  //     const objUrl = URL.createObjectURL(blob)
  //     a.href = objUrl
  //     a.download = '全程订单' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.xls'
  //     a.click()
  //     document.body.removeChild(a)
  //     URL.revokeObjectURL(objUrl)
  //   }).catch((err:any) => {
  //     this.excelLoading = false
  //     err.data.text().then((text: any) => {
  //       try {
  //         const resData = JSON.parse(text)
  //         if (resData.code !== 200) {
  //           this.$message.error(resData.msg || '文件下载失败')
  //         }
  //       } catch (e) {
  //         return e
  //       }
  //     })
  //   })
  // }
  private handleMoreSearch(): void {
    // 更多查询
    this.moreShow = true
    const root: any = this.$refs.searchMore
    root.searchMore = { ...this.searchForm }
  }
  private handleMoreCancle(): void {
    // 取消
    this.moreShow = false
    const root: any = this.$refs.searchMore
    const {
      ifFrozen,
      declartionStatus,
      expressNo,
      examineStatus,
      measureStatus,
      inventoryStatus,
      coverTank,
      ifLoading,
      deliveryWay,
      customs0,
      includeTax,
      ...form
    } = root.searchMore
    this.searchForm = { ...form }
    this.getTableData(1)
  }
  private handleMoreConfirm(): void {
    // 确定
    this.moreShow = false
    const root: any = this.$refs.searchMore
    this.searchForm = root.searchMore
    this.getTableData(1)
  }
  // 列表查询
  private getTableData(val?: any): void {
    this.loading = true
    const type = (this as any).custType
    if (type === '1') { // 客户
      this.searchForm.orderType = '1'
    }
    const { comId, agentId, comType, orderType, custId, orderTime, ...form }: any = this.searchForm
    if (val) {
      this.page = val
    }
    const params: any = {
      ...form,
      code: this.selectType === '1' && this.keyWord ? this.keyWord : undefined,
      customerName: this.selectType === '2' && this.keyWord ? this.keyWord : undefined,
      containerNo: this.selectType === '3' && this.keyWord ? this.keyWord : undefined,
      salesmanStatusTag: true
    }
    if (Array.isArray(orderTime) && orderTime.length > 0) {
      params.startDate = orderTime[0]
      params.endDate = orderTime[1]
    }
    if (orderType === '0') { // 销售
      params.sellerId = type === '0' ? agentId : custId
      params.buyerId = comId
    } else if (orderType === '1') { // 采购
      params.buyerId = custId
    }
    const model = {
      page: this.page,
      size: this.size,
      model: {
        ...params,
        queryFlag: true
      }
    }
    getOrderList(model)
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
  // 分页
  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.getTableData()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.getTableData()
  }
  private async getStatusList() {
    await getStatusList().then((res: any) => {
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
  private async created() {
    this.searchForm.custId = (this as any).custId
    this.searchForm.orderTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    this.loading = true
    await this.getStatusList()
    this.getPrivatelineList()
    this.getWarehouseList()
    this.getTableData()
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
  .order-info{
    width: 100%;
    .seriver-info{
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      .type{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 18px;
        white-space: nowrap;
        border: 1px solid #658DAC;
        border-radius: 2px;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #135180;
        margin-right: 5px;
      }
      .lscName{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #333333;
      }
    }
    .code{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #999999;
      .copy-icon{
        cursor: pointer;
        width: 12px;
        height: 12px;
        display: inline-block;
        margin-right: 5px;
        background: url("../../../assets/imgs/copy.png") center center no-repeat;
        background-size: 100%;
        &:hover{
          background: url("../../../assets/imgs/copy-hover.png") center center no-repeat;
          background-size: 100%;
        }
      }
    }
  }
  .audit-wrap{
    display: flex;
    align-items: center;
    .audit{
      width: 6px;
      height: 6px;
      background: #E12E2E;
      border-radius: 50%;
      margin-right: 5px;
    }
  }
  ::v-deep .frost-red {
    color: #E12E2E !important;
    .order-info {
      .type {
        color: #E12E2E;
        border-color: #E12E2E;
      }
      .lscName {
        color: #E12E2E;
      }
    }
    .code {
      color: #E12E2E;
    }
    .el-button--text {
      color: #E12E2E;
    }
    .el-dropdown-link {
      color: #E12E2E;
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

  .freeze-tip {
    position: fixed;
    max-width: 400px;
    max-height: 100px;
    min-height: 30px;
    min-width: 50px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    background-color: #000;
    color: #fff;
    font-size: 12px;
    z-index: 3333;
  }
</style>
