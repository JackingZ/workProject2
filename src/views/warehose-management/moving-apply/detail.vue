<template>
  <div
    v-loading="detailLoading"
  >
    <div class="detail-back">
      <span
        style="cursor: pointer;"
        @click="goBack"
      >
        <i class="el-icon-back" />
        <span>返回</span>
      </span>
    </div>
    <div class="app-panel order-detail">
      <div class="detail-movement">
        <span style="float: left;">调拨申请单</span>
        <el-button
          v-show="isType !== 'view'"
          size="mini"
          type="primary"
          @click="handleSave"
        >
          保存
        </el-button>
      </div>
      <el-form
        ref="movingForm"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="right"
        class="detail-form"
      >
        <div
          v-show="form.audit === 2"
          class="freeze"
        >
          <span>拒绝原因：{{ form.reason }}</span>
        </div>
        <div style="display: flex;flex-flow: row nowrap;">
          <div
            v-if="isType !== 'view'"
            style="width: 400px;"
          >
            <el-form-item
              label="目的仓库："
              label-width="100px"
              prop="winId"
              style="width: 100%;"
            >
              <el-select
                v-model="form.winId"
                :loading="selectLoading"
                placeholder="请选择"
                size="small"
                clearable
                style="width:100%;"
                @focus="getPurposeList"
                @change="onPurpose"
              >
                <el-option
                  v-for="item in purposeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="备注："
              label-width="100px"
              prop="remarks"
              style="width: 100%;"
            >
              <el-input
                v-model="form.remarks"
                type="textarea"
                :maxlength="200"
                :autosize="{minRows: 2, maxRows: 4}"
                placeholder="请输入"
              />
            </el-form-item>
          </div>
          <div
            v-if="isType !== 'add'"
            style="flex: 1;"
            class="form-info"
          >
            <el-form-item label="调拨申请单ID：">
              <span>{{ form.id }}</span>
            </el-form-item>
            <el-form-item
              v-if="isType === 'view'"
              label="目的仓库："
            >
              <span>{{ (form.win || {}).name || '--' }}</span>
            </el-form-item>
            <el-form-item label="调出仓库：">
              <span>{{ (form.out || {}).name || '--' }}</span>
            </el-form-item>
            <el-form-item label="总票数：">
              <span>{{ selectedData.length }}</span>
            </el-form-item>
            <el-form-item label="状态：">
              <span v-if="form.audit === 0">
                待审核
              </span>
              <span v-else-if="form.audit === 1">
                审核通过
              </span>
              <span v-else-if="form.audit === 3">
                审核中
              </span>
              <span v-else-if="form.audit === 2">
                审核拒绝
              </span>
              <span v-else-if="form.audit === 4">
                已签收
              </span>
            </el-form-item>
            <el-form-item label="申请人：">
              {{ form.createUserName }}
            </el-form-item>
            <el-form-item label="申请时间：">
              {{ form.createTime }}
            </el-form-item>
            <el-form-item label="审核人：">
              {{ form.auditUserName }}
            </el-form-item>
            <el-form-item label="审核时间：">
              {{ form.auditTime }}
            </el-form-item>
            <el-form-item label="签收人：">
              {{ form.signName }}
            </el-form-item>
            <el-form-item label="签收时间：">
              {{ form.signTime }}
            </el-form-item>
          </div>
        </div>
        <div
          v-if="isType === 'view'"
          style="padding-left: 10px;"
        >
          <el-form-item
            label="备注："
            prop="remark"
            style="width: 100%;"
          >
            {{ form.remarks }}
          </el-form-item>
        </div>
      </el-form>
      <div style="border-top: 1px solid #dfe6ec;" />
      <el-row
        v-show="isType !== 'view'"
        style="padding: 10px 20px 0;"
      >
        <el-col :span="8">
          <el-radio-group
            v-model="selectVal"
            size="small"
            @change="onSelected"
          >
            <el-radio-button label="all">
              全部
            </el-radio-button>
            <el-radio-button label="selected">
              已选择
            </el-radio-button>
          </el-radio-group>
          <span class="select-tip">总订单数({{ filterNum() }})，总件数({{ filterPackages() }})，总体积{{ filterData('CBM') }}CBM，总重量{{ filterData('KGS') }}KGS</span>
        </el-col>
        <el-col
          :span="16"
          style="text-align: right;"
        >
          <el-select
            v-model="searchForm.type"
            size="small"
            style="width: 100px;margin-right: 5px;"
            placeholder="业务类型"
            filterable
            @change="typeChange"
          >
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-select
            v-if="searchForm.type === '2'"
            v-model="searchForm.from"
            size="small"
            style="width: 100px;margin-right: 5px;"
            placeholder="订单来源"
            clearable
            filterable
          >
            <el-option
              label="客户端"
              value="web"
            />
            <el-option
              label="专线"
              value="line"
            />
          </el-select>
          <el-select
            v-model="searchForm.warehouseId"
            :loading="selectLoading"
            size="small"
            style="width: 130px;margin-right: 5px;"
            placeholder="调出仓库"
            clearable
            filterable
            @focus="getWarehouseList"
            @change="onWarehouse"
          >
            <el-option
              v-for="item in warehouseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-select
            v-if="searchForm.type === '2'"
            v-model="searchForm.groupId"
            :loading="selectLoading"
            clearable
            filterable
            size="small"
            style="width: 130px;margin-right: 5px;"
            placeholder="服务组"
            @focus="getGroupData"
            @change="onGroup"
          >
            <el-option
              v-for="item in groupList"
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
          <el-button
            v-show="selectVal === 'all'"
            type="primary"
            size="small"
            @click="getTableData(1)"
          >
            查询
          </el-button>
          <span
            v-show="selectVal === 'selected'"
            class="handle-add"
          >
            手动添加订单
          </span>
          <el-input
            v-show="selectVal === 'selected'"
            v-model="orderVal"
            placeholder="请输入"
            size="small"
            style="width: 200px;"
          />
          <el-button
            v-show="selectVal === 'selected'"
            type="primary"
            size="small"
            style="margin-left: 10px;"
            :loading="selectLoading"
            @click="onAdd"
          >
            添加
          </el-button>
        </el-col>
      </el-row>
      <div
        v-show="selectVal === 'all'"
        style="padding: 10px 0 10px;"
      >
        <el-table
          ref="tables"
          :data="tableData"
          row-key="id"
          height="490px"
          border
          style="width: 100%;"
          @select="handleSelected"
          @select-all="handleSelectAll"
        >
          <el-table-column
            fixed="left"
            type="selection"
            width="55"
            :selectable="handleSelectable"
          />
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
            prop="code"
            label="原单号"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column
            label="服务"
            min-width="150"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ (scope.row.service || {}).value || '--' }}
            </template>
          </el-table-column>
          <el-table-column
            label="下单客户"
            min-width="150"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ (scope.row.buyer || {}).name || '--' }}
            </template>
          </el-table-column>
          <el-table-column
            min-width="150"
            label="客户名称"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>
                {{ (scope.row.orderCustomer || {}).name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="总件数"
            width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.packages }}
            </template>
          </el-table-column>
          <el-table-column
            label="总体积"
            min-width="100"
          >
            <template slot-scope="scope">
              {{ maxVolWeiFormat(scope.row, 'CBM') }}
            </template>
          </el-table-column>
          <el-table-column
            label="总重量"
            min-width="100"
          >
            <template slot-scope="scope">
              {{ maxVolWeiFormat(scope.row, 'KGS') }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="400"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-checkbox
                v-model="scope.row.ifMetering"
                :disabled="isType === 'view' || scope.row.ifLoading !== 0"
              >
                目的仓计量
              </el-checkbox>
              <el-checkbox
                v-model="scope.row.ifInspection"
                :disabled="isType === 'view' || scope.row.ifLoading !== 0"
              >
                目的仓验货
              </el-checkbox>
              <el-checkbox
                v-model="scope.row.ifTransfer"
                :disabled="isType === 'view' || scope.row.ifLoading !== 0"
              >
                目的仓转单
              </el-checkbox>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page.sync="page"
          :page-size="size"
          layout="total, prev, pager, next"
          :total="total"
          style="text-align: right;padding-bottom: 10px;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <div
        v-show="selectVal === 'selected'"
        style="padding: 10px 0 10px;"
      >
        <el-table
          ref="selectedData"
          :data="selectedData"
          row-key="id"
          border
          style="width: 100%;"
          height="530px"
        >
          <el-table-column
            prop="code"
            label="原单号"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column
            label="服务"
            min-width="150"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ (scope.row.service || {}).value || '--' }}
            </template>
          </el-table-column>
          <el-table-column
            label="入库签收时间"
            prop="signTime"
            width="170"
          />
          <el-table-column
            label="下单客户"
            min-width="150"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ (scope.row.buyer || {}).name || '--' }}
            </template>
          </el-table-column>
          <el-table-column
            label="客户名称"
            min-width="150"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>
                {{ (scope.row.orderCustomer || {}).name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="总件数"
            min-width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.packages }}
            </template>
          </el-table-column>
          <el-table-column
            label="总体积"
            min-width="100"
          >
            <template slot-scope="scope">
              {{ maxVolWeiFormat(scope.row, 'CBM') }}
            </template>
          </el-table-column>
          <el-table-column
            label="总重量"
            min-width="100"
          >
            <template slot-scope="scope">
              {{ maxVolWeiFormat(scope.row, 'KGS') }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="400"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-checkbox
                v-model="scope.row.ifMetering"
                :disabled="isType === 'view'"
              >
                目的仓计量
              </el-checkbox>
              <el-checkbox
                v-model="scope.row.ifInspection"
                :disabled="isType === 'view'"
              >
                目的仓验货
              </el-checkbox>
              <el-checkbox
                v-model="scope.row.ifTransfer"
                :disabled="isType === 'view'"
              >
                目的仓转单
              </el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            v-if="isType !== 'view'"
            width="80"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="medium"
                @click="deleteRow(scope.$index, scope.row.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  saveMove,
  getPalletOrderList,
  getOrderList,
  getWHList,
  getLscGroupList,
  getLscGroupItems,
  getMoveViewDetail
} from '@/api/warehose-by-config'
import dayjs from 'dayjs'
@Component({
  name: 'detail',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private form: any = {
    winId: undefined,
    remarks: undefined
  }
  private searchForm: any = {
    type: '2',
    from: undefined,
    groupId: undefined,
    warehouseId: undefined,
    orderTime: [],
    serviceIds: []
  }
  private rules: any = {
    winId: [{ required: true, message: '请选择目的仓', trigger: 'change' }]
  }
  private typeList = [
    // { name: '一件代发', id: '0' },
    { name: '仓储', id: '1' },
    { name: '散收拼货', id: '2' },
    { name: '拆柜打托', id: '3' }
  ]
  private groupList: any[] = []
  private purposeList: any[] = []
  private purposeData: any[] = []
  private warehouseList: any[] = []
  private tableData: any[] = []
  private selectedData: any[] = []
  private isType = ''
  private selectVal = ''
  private orderVal = ''
  private purCountryId: any = ''
  private selectLoading: boolean = false
  private detailLoading: boolean = false
  private page: number = 1
  private size: number = 10
  private total: any = 0

  /** computed */
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
  get countryId(): string {
    const info = UserModule.info || {}
    const countryId = (info as any).countryId
    return countryId
  }

  /* method */
  private filterNum() {
    return this.selectedData.length
  }
  private filterPackages() {
    if (this.searchForm.type === '3') {
      return this.selectedData.reduce((tax: number, item: any) => {
        tax += (item.totalBox || 0)
        return tax
      }, 0)
    } else {
      return this.selectedData.reduce((tax: number, item: any) => {
        const measure = item.measure || {}
        tax += (measure.packages || 0)
        return tax
      }, 0)
    }
  }
  private filterData(val: any) {
    let countV: number = 0
    let countW: number = 0
    this.selectedData.map((c: any, i: any) => {
      const um = c.um || {}
      const measure = c.measure || {}
      const umVolume = (this as any).$getVolumeUnitByLengthUnit(um.umLength)
      if (um && umVolume) {
        const numV = this.searchForm.type === '3'
          ? (this as any).$volumeConversion((c.totalVolume || 0), umVolume, 'CBM', 3)
          : (this as any).$volumeConversion((measure.totalVolume || 0), umVolume, 'CBM', 3)
        const lenV = String(numV).length
        const mathPV = numV * Math.pow(10, lenV)
        countV += parseFloat((mathPV / Math.pow(10, lenV)).toFixed(3))
      }
      if (um && um.umWeight) {
        const numW = this.searchForm.type === '3'
          ? (this as any).$volumeConversion(c.totalWeight, um.umWeight, 'KGS', 3)
          : (this as any).$volumeConversion(measure.totalWeight || 0, um.umWeight, 'KGS', 3)
        const lenW = String(numW).length
        const mathPW = numW * Math.pow(10, lenW)
        countW += parseFloat((mathPW / Math.pow(10, lenW)).toFixed(3))
      }
    })
    if (val === 'CBM') {
      return Math.round(countV * 1000) / 1000
    } else if (val === 'KGS') {
      return Math.round(countW * 1000) / 1000
    }
  }
  private maxVolWeiFormat(row: any, unit: string) {
    const um = row.um || {}
    const measure = row.measure || {}
    const umVolume = (this as any).$getVolumeUnitByLengthUnit(um.umLength)
    if (this.searchForm.type === '3') {
      return unit === 'CBM' ? (this as any).$volumeConversion(row.totalVolume, umVolume, 'CBM', 3) + 'CBM' : row.totalWeight + um.umWeight
    } else {
      return unit === 'CBM' ? (this as any).$volumeConversion(measure.totalVolume || 0, umVolume, 'CBM', 3) + 'CBM' : (measure.totalWeight || 0) + um.umWeight
    }
  }
  private created() {
    this.searchForm.orderTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
  }
  private async init() {
    this.isType = 'add'
    this.selectVal = 'all'
  }
  private async setData(row: any, val: string) {
    // 设置值
    this.isType = val
    this.detailLoading = true
    const { winOrders, win, out, type, groupId, ...form } = row
    this.form = {
      ...form,
      win,
      out,
      winId: (win || {}).id
    }
    this.purCountryId = (win || {}).countryId
    this.searchForm.warehouseId = (out || {}).id
    this.searchForm.groupId = groupId
    this.searchForm.type = `${type}` || '2'

    if (this.isType === 'view') {
      this.selectVal = 'selected'
      await this.getMoveViewDetail(row.id)
      this.detailLoading = false
    } else {
      this.$nextTick(() => {
        this.selectedData = (winOrders || []).map((it: any) => {
          const { ifMetering, ifInspection, ifTransfer, ...obj } = it
          return {
            ...obj,
            ifMetering: ifMetering === 1,
            ifInspection: ifInspection === 1,
            ifTransfer: ifTransfer === 1
          }
        })
      })
      this.selectVal = 'all'
      await this.getPurposeList()
      await this.getWarehouseList()
      if (this.searchForm.type === '2' && this.searchForm.groupId) {
        await this.getGroupData()
        await this.getLscServices()
      }
      this.getTableData(1)
    }
  }
  private async getMoveViewDetail(id: any) {
    await getMoveViewDetail({ id })
      .then((res: any) => {
        const data = res.data || []
        this.$nextTick(() => {
          this.selectedData = data.map((it: any) => {
            const { ifMetering, ifInspection, ifTransfer, ...obj } = it
            return {
              ...obj,
              ifMetering: ifMetering === 1,
              ifInspection: ifInspection === 1,
              ifTransfer: ifTransfer === 1
            }
          })
        })
      }).catch((err: any) => {
        return err
      })
  }

  private typeChange() {
    this.tableData = []
    this.selectedData = []
    this.searchForm.from = undefined
  }
  private onPurpose(val: any) {
    const item: any = this.purposeList.find((it: any) => it.id === val)
    if (item) {
      this.purCountryId = item.countryId
    } else {
      this.purCountryId = undefined
    }
  }
  private onWarehouse() {
    this.tableData = []
    this.selectedData = []
    this.setWareToPurpose()
  }
  private async onGroup() {
    this.tableData = []
    this.selectedData = []
    this.searchForm.serviceIds = []
    if (this.searchForm.groupId) {
      await this.getLscServices()
    }
  }
  private setWareToPurpose() {
    // 目的仓与调出仓国家一致
    if (this.searchForm.warehouseId) {
      this.purposeList = this.purposeData.filter((it: any) => {
        const item = this.warehouseList.find((w: any) => w.id === this.searchForm.warehouseId)
        if (item) {
          return it.countryId === item.countryId
        }
      })
    } else {
      this.purposeList = JSON.parse(JSON.stringify(this.purposeData))
    }
    if (!this.purposeList.some((it: any) => it.countryId === this.purCountryId)) {
      this.form.winId = undefined
    }
  }
  // 查询仓库
  private async getPurposeList() {
    this.selectLoading = true
    try {
      const params0 = {
        model: {
          custId: '0'
        },
        page: 1,
        size: 9999
      }
      const res = await getWHList(params0)
      const data0 = res.data || {}
      const arr0 = data0.result || []
      this.purposeData = arr0
      this.setWareToPurpose()
      this.selectLoading = false
    } catch (error) {
      this.selectLoading = false
      this.detailLoading = false
      return error
    }
  }
  private async getWarehouseList() {
    this.selectLoading = true
    try {
      const params = {
        model: {
          custId: (this as any).custId
        },
        page: 1,
        size: 9999
      }
      const res = await getWHList(params)
      const data = res.data || {}
      this.warehouseList = data.result || []
      this.selectLoading = false
    } catch (error) {
      this.selectLoading = false
      this.detailLoading = false
      return error
    }
  }
  private async getGroupData() {
    this.selectLoading = true
    const params = {
      model: {
        status: 1
      },
      page: 1,
      size: 9999
    }
    await getLscGroupList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.groupList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private async getLscServices() {
    await getLscGroupItems({
      id: this.searchForm.groupId
    })
      .then((res: any) => {
        const data = res.data || []
        this.searchForm.serviceIds = data.map((e: any) => e.id)
      }).catch((err: any) => {
        return err
      })
  }

  private getTableData(val?: any) {
    if (!this.searchForm.warehouseId) {
      this.$message.error('请选择调出仓库')
      return
    }
    this.detailLoading = true
    const { orderTime, serviceIds, ...form }: any = this.searchForm
    if (val) {
      this.page = val
    }
    const params: any = {
      page: this.page,
      size: this.size,
      model: {
        ...form,
        orderType: '0'
      }
    }
    if (this.searchForm.type === '3') {
      params.model.ReqWarehouseVO = '1'
      params.model.startTime = Array.isArray(orderTime) ? orderTime[0] : undefined
      params.model.endTime = Array.isArray(orderTime) ? orderTime[1] : undefined
      getPalletOrderList(params)
        .then((res: any) => {
          this.detailLoading = false
          const data = res.data || {}
          const arr: any[] = (data.result || []).map((it: any) => {
            return {
              ...it,
              ifMetering: false,
              ifInspection: false,
              ifTransfer: false
            }
          })
          this.tableData = arr
          const list = this.tableData.filter((e: any) => this.selectedData.find((s: any) => s.id === e.id))
          this.$nextTick(() => {
            this.toggleSelection(list)
          })
          this.total = data.total
        })
        .catch((err: any) => {
          this.detailLoading = false
          return err
        })
    } else {
      params.model.queryType = '1'
      params.model.serviceIds = serviceIds
      params.model.startDate = Array.isArray(orderTime) ? orderTime[0] : undefined
      params.model.endDate = Array.isArray(orderTime) ? orderTime[1] : undefined
      getOrderList(params)
        .then((res: any) => {
          this.detailLoading = false
          const data = res.data || {}
          const arr: any[] = (data.result || []).map((it: any) => {
            const item = this.selectedData.find((s: any) => s.id === it.id)
            if (item) {
              return item
            } else {
              return {
                ...it,
                ifMetering: false,
                ifInspection: false,
                ifTransfer: false
              }
            }
          })
          this.tableData = arr
          const list = this.tableData.filter((e: any) => this.selectedData.find((s: any) => s.id === e.id))
          this.$nextTick(() => {
            this.toggleSelection(list)
          })
          this.total = data.total
        })
        .catch((err: any) => {
          this.detailLoading = false
          return err
        })
    }
  }
  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.getTableData()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.getTableData()
  }

  private onSelected(val: any) {
    this.selectVal = val
    if (val === 'all') {
      this.getTableData()
    }
  }
  private async onAdd() {
    if (!this.searchForm.warehouseId) {
      this.$message.error('请选择调出仓库')
      return
    }
    if (!this.orderVal) {
      this.$message.error('请输入原单号')
      return
    }
    if (this.selectedData.some((it: any) => it.code === this.orderVal)) {
      this.$message.error('订单已存在')
      return
    }
    this.selectLoading = true
    const { orderTime, serviceIds, ...form }: any = this.searchForm
    const params: any = {
      model: {
        ...form,
        code: this.orderVal,
        orderType: '0'
      },
      page: 1,
      size: 10
    }
    let arrRes: any[] = []
    if (this.searchForm.type === '3') {
      params.model.ReqWarehouseVO = '1'
      params.model.startTime = Array.isArray(orderTime) ? orderTime[0] : undefined
      params.model.endTime = Array.isArray(orderTime) ? orderTime[1] : undefined
      await getPalletOrderList(params)
        .then((res: any) => {
          this.selectLoading = false
          const data = res.data || {}
          arrRes = data.result || []
        })
        .catch((err: any) => {
          this.selectLoading = false
          return err
        })
    } else {
      params.model.queryType = '1'
      params.model.serviceIds = serviceIds
      params.model.startDate = Array.isArray(orderTime) ? orderTime[0] : undefined
      params.model.endDate = Array.isArray(orderTime) ? orderTime[1] : undefined
      await getOrderList(params)
        .then((res: any) => {
          this.selectLoading = false
          const data = res.data || {}
          arrRes = data.result || []
        })
        .catch((err: any) => {
          this.selectLoading = false
          return err
        })
    }
    if (arrRes.length <= 0) {
      this.$message.error('暂无该订单信息')
      return
    } else if (arrRes.some((it: any) => it.ifLoading === 1)) {
      this.$message.error('该订单已发货')
      return
    }
    const arr: any[] = arrRes.map((it: any) => {
      return {
        ...it,
        ifMetering: false,
        ifInspection: false,
        ifTransfer: false
      }
    })
    this.selectedData = [...this.selectedData, ...arr]
    this.$message.success('添加订单成功')
    this.orderVal = ''
  }

  private deleteRow(index: number, id: any) {
    this.selectedData.splice(index, 1)
    this.tableData = this.tableData.map((it: any) => {
      if (it.id === id) {
        return {
          ...it,
          ifMetering: false,
          ifInspection: false,
          ifTransfer: false
        }
      }
    })
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
      this.selectedData = this.selectedData.filter((e: any) => !this.tableData.find((t: any) => t.id === e.id))
    }
  }
  private handleSelectable(row: any, index: any) {
    if (row.ifLoading === 1) {
      return false
    } else {
      return true
    }
  }
  private toggleSelection(arr: any, bool?: boolean) {
    const root: any = this.$refs.tables
    root.clearSelection()
    if (arr.length > 0) {
      arr.map((row: any) => {
        const api: any = this.$refs.tables
        api.toggleRowSelection(row, bool)
      })
    }
  }

  private handleSave(): void {
    // 提交
    const editForm: any = this.$refs.movingForm
    editForm.validate((valid: any) => {
      if (!valid) return false
      if (this.selectedData.length <= 0) {
        this.$message.error('请选择调拨订单')
        return
      }
      if (this.form.winId === this.searchForm.warehouseId) {
        this.$message.error('同仓库无需调拨')
        return
      }
      this.detailLoading = true
      const { winId, ...obj } = this.form
      const params: any = {
        ...obj,
        total: this.selectedData.length,
        type: this.searchForm.type,
        groupId: this.searchForm.groupId
      }
      params.win = this.purposeList.find((it: any) => it.id === winId) || {}
      params.out = this.warehouseList.find((it: any) => it.id === this.searchForm.warehouseId) || {}
      params.winOrders = this.selectedData.map((it: any) => {
        return {
          ...it,
          ifMetering: it.ifMetering ? 1 : 0,
          ifInspection: it.ifInspection ? 1 : 0,
          ifTransfer: it.ifTransfer ? 1 : 0
        }
      })

      saveMove(params)
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.resetForm()
          this.detailLoading = false
          this.$emit('back')
        })
        .catch((err: any) => {
          this.detailLoading = false
          return err
        })
    })
  }
  private goBack() {
    this.resetForm()
    this.$emit('back')
  }
  private resetForm() {
    this.tableData = []
    this.selectedData = []
    this.form = {
      winId: undefined,
      remarks: undefined
    }
    this.selectVal = ''
    this.purCountryId = undefined
    this.searchForm.warehouseId = undefined
    this.searchForm.groupId = undefined
    this.searchForm.serviceIds = []
    const root: any = (this as any).$refs.movingForm
    this.$nextTick(() => {
      root.clearValidate()
    })
  }
}
</script>

<style lang="scss" scoped>
.detail-form {
  ::v-deep .el-form-item {
    vertical-align: top;
    display: inline-block;
    width: 33.33%;
    margin-bottom: 18px;
  }
}
.order-detail {
  height: calc(100vh - 170px);
  overflow-y: auto;
}
.detail-back {
  text-align: right;
  padding: 0 20px;
  line-height: 50px;
  border-bottom: 1px solid #e8e8e8;
  background-color: #ffffff;
}
.detail-movement {
  background: rgb(231, 231, 231);
  padding: 0px 20px;
  margin-bottom: 10px;
  line-height: 35px;
  height: 35px;
  font-size: 16px;
  font-weight: 700;
  text-align: right;
}

.handle-add {
  font-size: 14px;
  line-height: 32px;
  padding-right: 10px;
  &::before {
    clear: both;
    content: "*";
    color: #ff4949;
    margin-right: 4px;
  }
}
.freeze {
  padding: 5px;
  background-color: #FEF0F0;
  border: solid 1px #F56C6C;
  font-size: 14px;
}
.form-info{
  padding-left: 10px;
  .el-form-item {
    margin-bottom: 5px;
  }
}
.select-tip {
  padding: 0 20px;
  line-height: 32px;
  height: 32px;
  display: inline-block;
}
</style>
