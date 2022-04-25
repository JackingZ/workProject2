<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <app-slide
      width="415"
      :is-active="isActive"
      style="margin: 15px 0 15px 15px;padding: 0;"
    >
      <div style="padding: 20px;">
        <el-row>
          <el-col
            :span="12"
            style="line-height: 32px;cursor: pointer"
          >
            <el-popover
              v-model="myPopoverVisible"
              placement="bottom-start"
              trigger="click"
              popper-class="my-popover"
            >
              <div>
                <ul class="el-scrollbar__view el-select-dropdown__list">
                  <li
                    v-for="item in priceTypeList"
                    :key="item.value"
                    class="el-select-dropdown__item"
                    @click="priceTypeChange(item.value)"
                  >
                    <span>
                      {{ item.label }}
                    </span>
                  </li>
                </ul>
              </div>
              <div
                slot="reference"
                style="width: 100%;"
              >
                <span>
                  {{ formattPriceType(priceType, priceTypeList) }}
                </span>
                <i class="el-icon-caret-bottom" />
              </div>
            </el-popover>
          </el-col>
        </el-row>
        <div style="padding-top: 10px;">
          <el-form
            :model="searchForm"
            class="search-form"
            size="mini"
          >
            <el-form-item>
              <el-select
                v-model="searchForm.warehouseId"
                :loading="selectLoading"
                size="mini"
                clearable
                filterable
                placeholder="仓库"
                style="width: 100%;"
                @change="getTableData"
              >
                <el-option
                  v-for="item in warehouseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="searchForm.custId"
                size="mini"
                clearable
                filterable
                placeholder="供应商"
                style="width: 100%;"
                @change="getTableData('')"
              >
                <el-option
                  v-for="item in supplierList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="searchForm.auditing"
                size="mini"
                clearable
                filterable
                placeholder="审核状态"
                style="width: 100%;"
                @change="getTableData"
              >
                <el-option
                  v-for="item in auditList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-popover
                v-model="popoverShow"
                placement="bottom-start"
                trigger="click"
              >
                <div style="padding: 8px 15px 0 0;">
                  <el-form-item
                    label="有效时间"
                    label-width="90px"
                  >
                    <el-date-picker
                      v-model="searchForm.times"
                      :clearable="false"
                      unlink-panels
                      type="daterange"
                      align="left"
                      size="mini"
                      value-format="yyyy-MM-dd"
                      range-separator="~"
                      style="width:280px;"
                      start-placeholder="起始时间"
                      end-placeholder="截止时间"
                    />
                  </el-form-item>
                  <div
                    slot="footer"
                    style="text-align: right;"
                  >
                    <el-button @click="handleClear">
                      清空
                    </el-button>
                    <el-button
                      type="primary"
                      @click="handleConfirm"
                    >
                      筛选
                    </el-button>
                  </div>
                </div>

                <div
                  slot="reference"
                  class="el-select el-select--small"
                  style="width: 100%;"
                >
                  <el-input
                    placeholder="全部筛选"
                    readonly
                    suffix-icon="el-select__caret el-input__icon el-icon-arrow-up"
                  />
                </div>
              </el-popover>
            </el-form-item>
          </el-form>
          <el-scrollbar
            v-loading="cardLoading"
            style="height: calc(100vh - 280px);"
          >
            <div
              v-if="cardList.length === 0"
              class="empty"
              style="text-align: center;line-height: 50px;font-size: 12px;color: #909399;"
            >
              暂无报价
            </div>
            <div v-else>
              <div
                v-for="(item, index) in cardList"
                :key="index"
                :class="{'active-card': selectCard.id === item.id}"
                class="el-card is-hover-shadow"
                style="font-size: 12px;margin-bottom: 10px;cursor: pointer;"
                @click="onRow(item)"
              >
                <div class="el-card__body">
                  <el-row style="padding-bottom: 10px;">
                    <el-col :span="1">
                      <el-tooltip
                        v-if="item.auditing === 1"
                        effect="dark"
                        content="待审核"
                        placement="top"
                      >
                        <i
                          class="card-tips card-tip-zero"
                        />
                      </el-tooltip>
                      <el-tooltip
                        v-if="item.auditing === 4"
                        effect="dark"
                        content="已通过"
                        placement="top"
                      >
                        <i
                          class="card-tips card-tip-one"
                        />
                      </el-tooltip>
                      <el-tooltip
                        v-if="item.auditing === 3"
                        effect="dark"
                        content="已拒绝"
                        placement="top"
                      >
                        <i
                          class="card-tips card-tip-two"
                        />
                      </el-tooltip>
                      <el-tooltip
                        v-if="item.auditing === 2"
                        effect="dark"
                        content="审核中"
                        placement="top"
                      >
                        <i
                          class="card-tips card-tip-three"
                        />
                      </el-tooltip>
                    </el-col>
                    <el-col
                      :span="23"
                      class="word-limit"
                    >
                      {{ item.warehouseName }}
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col
                      :span="3"
                    >
                      供应商
                    </el-col>
                    <el-col
                      :span="21"
                    >
                      {{ item.fromCustName }}
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="4">
                      <span
                        v-if="item.effective === 1"
                        class="btn-tip-blue"
                      >待生效</span>
                      <span
                        v-else-if="item.effective === 2"
                        class="btn-tip-green"
                      >生效中</span>
                      <span
                        v-else-if="item.effective === 3"
                        class="btn-tip-grey"
                      >已失效</span>
                    </el-col>
                    <el-col
                      :span="16"
                      style="line-height: 16px;"
                    >
                      {{ formatTime(item) }}
                    </el-col>
                    <el-col
                      :span="4"
                      style="text-align: right;"
                    >
                      聚货通价
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </el-scrollbar>
          <el-pagination
            small
            :current-page.sync="pagination.page"
            :page-size="pagination.size"
            layout="total, prev, pager, next"
            :total="pagination.total"
            style="text-align: right;margin-top: 10px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </app-slide>
    <div style="display: flex;align-items: center;">
      <div
        class="arrow-btn"
        @click="toggle"
      >
        <img
          :class="{arrow: !isActive}"
          src="@/assets/imgs/arrow_left.png"
          alt
        >
      </div>
    </div>
    <div
      v-loading="formLoading"
      style="flex: 1;overflow: auto;margin: 15px;background-color: #fff;padding: 20px;"
    >
      <div v-show="isRightShow">
        <el-form
          ref="editForm"
          :model="selectForm"
          :rules="formRules"
          label-width="90px"
          label-position="right"
          size="mini"
          class="select-form"
        >
          <el-row>
            <el-col :span="21">
              <el-form-item
                prop="warehouseId"
              >
                <span slot="label">
                  <span>
                    仓库
                  </span>
                  <el-tooltip
                    v-show="selectForm.warehouseId"
                    slot="label"
                    :content="selectForm.warehouseName"
                    placement="top"
                    effect="light"
                  >
                    <i class="el-icon-warning-outline" />
                  </el-tooltip>
                  <span>：</span>
                </span>
                <el-select
                  v-model="selectForm.warehouseId"
                  :disabled="isView"
                  style="width:200px;"
                  clearable
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in warehouseList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="供应商："
                prop="toCustSubtype"
              >
                <div style="padding: 0 10px">
                  {{ selectForm.fromCustName }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-select
                v-if="isView"
                v-model="historyId"
                clearable
                filterable
                placeholder="历史版本"
                style="width: 100%"
                size="mini"
                @focus="getHistoryPrice"
                @change="onHistory"
              >
                <el-option
                  v-for="(item, index) in historyList"
                  :key="index"
                  :label="`${dayjs(item.startTime).format('YYYY-MM-DD')}-${dayjs(item.endTime).format('YYYY-MM-DD')}`"
                  :value="item.id"
                />
              </el-select>
            </el-col>
          </el-row>
          <div class="item-read">
            <el-form-item
              label="重量单位："
              prop="umWeight"
            >
              <div style="width: 60px;">
                <span v-if="selectForm.umWeight === 'T'">
                  T-吨
                </span>
                <span v-if="selectForm.umWeight === 'LBS'">
                  LB-磅
                </span>
                <span v-if="selectForm.umWeight === 'KGS'">
                  KG-公斤
                </span>
                <span v-if="selectForm.umWeight === 'OZS'">
                  OZ-盎
                </span>
              </div>
            </el-form-item>

            <el-form-item
              label="长度单位："
              prop="umLength"
            >
              <div style="width: 60px;">
                <span v-if="selectForm.umLength === 'FT'">
                  FT-英尺
                </span>
                <span v-if="selectForm.umLength === 'M'">
                  M-米
                </span>
                <span v-if="selectForm.umLength === 'CM'">
                  CM-厘米
                </span>
              </div>
            </el-form-item>

            <el-form-item
              label="货币单位："
              prop="currencyId"
            >
              <span v-if="selectForm.currencyId">
                {{ selectForm.currencyId }}
              </span>
            </el-form-item>
          </div>
          <el-row>
            <el-col :span="20">
              <el-form-item
                label="有效时间"
                label-width="90px"
                prop="times"
              >
                <el-date-picker
                  v-model="selectForm.times"
                  :disabled="isView"
                  :clearable="false"
                  unlink-panels
                  type="daterange"
                  align="left"
                  size="mini"
                  value-format="yyyy-MM-dd"
                  range-separator="~"
                  style="width:240px;margin-right: 20px;"
                  start-placeholder="起始时间"
                  end-placeholder="截止时间"
                />
              </el-form-item>
              <el-form-item
                label="单票最低收费"
                label-width="110px"
                prop="floorPrice"
              >
                <el-input-number
                  v-model="selectForm.floorPrice"
                  :disabled="isView"
                  class="input-number-valiate"
                  :controls="false"
                  placeholder="请输入"
                  :min="0"
                  :max="999999"
                  :precision="2"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="4"
              style="text-align: right;"
            >
              <div v-show="!historyId">
                <el-popover
                  v-show="selectForm.auditing === 2"
                  v-model="auditShow"
                  placement="bottom"
                  trigger="click"
                  @show="onShow"
                  @hide="onHide"
                >
                  <div
                    v-loading="selectLoading"
                    style="padding-right: 15px;"
                  >
                    <el-form
                      ref="auditForm"
                      :model="auditForm"
                      :rules="auditRules"
                      label-width="90px"
                      label-position="right"
                      size="small"
                    >
                      <el-form-item
                        label="审核状态："
                        prop="auditing"
                        label-width="110px"
                      >
                        <el-radio-group v-model="auditForm.auditing">
                          <el-radio :label="4">
                            通过
                          </el-radio>
                          <el-radio :label="3">
                            拒绝
                          </el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item
                        v-if="auditForm.auditing === 3"
                        label="拒绝原因："
                        prop="reason"
                        label-width="110px"
                      >
                        <el-input
                          v-model="auditForm.reason"
                          type="textarea"
                          :rows="2"
                          :maxlength="100"
                          placeholder="请输入原因"
                        />
                      </el-form-item>
                      <div
                        style="text-align: right;padding-top: 10px;"
                      >
                        <el-button
                          size="small"
                          @click="auditShow = false"
                        >
                          取消
                        </el-button>
                        <el-button
                          type="primary"
                          size="small"
                          @click="auditRow"
                        >
                          确认
                        </el-button>
                      </div>
                    </el-form>
                  </div>
                  <el-button
                    slot="reference"
                    type="text"
                    size="mini"
                  >
                    审核
                  </el-button>
                </el-popover>
                <el-button
                  v-show="selectForm.auditing === 1"
                  slot="reference"
                  type="text"
                  size="mini"
                >
                  审核
                </el-button>
              </div>
            </el-col>
            <el-col
              v-if="selectForm.auditing === 3"
              :span="24"
            >
              <el-form-item
                label="拒绝原因"
              >
                <span>{{ selectCard.reason }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div v-show="isTableShow">
          <div class="table-header-title">
            供应商报价
          </div>
          <el-table
            ref="priceTable"
            :data="tableData"
            :span-method="tableDataSpanMethod"
            height="calc(100vh - 380px)"
            style="width: 100%;"
            border
          >
            <el-table-column
              prop="name"
              width="150"
              label="收费项目"
              show-overflow-tooltip
            />
            <el-table-column
              prop="type"
              width="100"
              label="计费方式"
            >
              <template slot-scope="scope">
                {{ formatType(scope.row.type) }}
              </template>
            </el-table-column>
            <el-table-column
              width="150"
              label="计费配置"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span v-if="scope.row.type === 5 || scope.row.type === 6">{{ scope.row.cellName }}</span>
                <span v-else-if="scope.row.min && scope.row.max">{{ scope.row.min + '-' + scope.row.max }}</span>
                <span v-else>单位单价</span>
              </template>
            </el-table-column>
            <el-table-column label="价格">
              <template slot-scope="scope">
                <span>{{ scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column
              min-width="120"
              label="备注"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.remark }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getWarehouseList,
  getHistoryPrice,
  getSupplierPriceList,
  getPriceById,
  checkPrice
} from '@/api/price-to-warehouse'
import dayjs from 'dayjs'

@Component({
  name: '',
  components: {
  },
  props: {
    priceTypeList: {
      type: Array,
      default: () => ([])
    },
    supplierList: {
      type: Array,
      default: () => ([])
    },
    priceType: {
      type: String,
      default: ''
    }
  }
})
export default class extends Vue {
  /** data */
  private isActive: boolean = true
  private isView: boolean = true
  private selectLoading: boolean = false
  private cardLoading: boolean = false
  private formLoading: boolean = false
  private isRightShow: boolean = false
  private popoverShow: boolean = false
  private auditShow: boolean = false
  private myPopoverVisible: boolean = false
  private isTableShow: boolean = false

  private searchForm: any = {
    warehouseId: undefined,
    auditing: undefined,
    custId: undefined,
    times: []
  }
  private selectCard: any = {}
  private selectForm: any = {
    fromCustName: '',
    id: undefined,
    warehouseId: undefined,
    warehouseName: undefined,
    refStandard: undefined,
    auditing: undefined,
    reason: undefined,
    refId: undefined,
    floorPrice: undefined,
    countryId: undefined,
    toCustSubtype: undefined,
    umWeight: undefined,
    umLength: undefined,
    currencyId: undefined,
    associatedAgents: [],
    ifStandard: true,
    times: [],
    country: {}
  }
  private formRules = {
    warehouseId: [{ required: true, message: '请选择仓库', trigger: 'change' }],
    toCustSubtype: [{ message: '请选择报价对象', trigger: 'change' }],
    refId: [{ required: true, message: '请选择参考报价', trigger: 'change' }],
    ifStandard: [{ required: true, message: '请选择价格标准', trigger: 'change' }],
    times: [{ required: true, message: '请选择有效时间', trigger: 'change' }],
    refStandard: [{ required: true, message: '请选择有效时间', trigger: 'change' }],
    floorPrice: [{ required: true, message: '单票最低收费不能为空', trigger: 'change' }]
  }
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  private auditForm: any = {
    auditing: undefined,
    reason: undefined
  }
  private auditRules = {
    auditing: [{ required: true, message: '请选择审核状态', trigger: 'change' }]
  }

  private auditList: any[] = [
    { name: '待审核', id: 1 },
    { name: '已通过', id: 4 },
    { name: '已拒绝', id: 3 },
    { name: '审核中', id: 2 }
  ]
  private warehouseList: any[] = []
  private cardList: any[] = []
  private historyList: any[] = []
  private tableData: any[] = []
  private settlementList: any[] = [
    {
      id: 0,
      name: '按重量'
    },
    {
      id: 1,
      name: '按体积'
    },
    {
      id: 2,
      name: '按金额'
    },
    {
      id: 3,
      name: '按票'
    },
    {
      id: 4,
      name: '按箱'
    },
    {
      id: 5,
      name: '按车'
    },
    {
      id: 6,
      name: '按柜'
    },
    {
      id: 7,
      name: '按里程'
    },
    {
      id: 8,
      name: '按时间'
    },
    {
      id: 9,
      name: '按托'
    },
    {
      id: 'A',
      name: '按个数'
    }
  ]
  private spanArr1: any[] = []
  private spanArr2: any[] = []
  private spanNum1: number = 0
  private spanNum2: number = 0
  private historyId: any = ''

  /* methods */
  private async auditRow() {
    let params: any = {}
    if (this.selectCard.auditing === 1) {
      params = {
        tag: 2,
        id: this.selectCard.id,
        reason: ''
      }
    } else {
      const root: any = this.$refs.auditForm
      if (this.auditForm.auditing !== 3 && this.auditForm.auditing !== 4) {
        return
      }
      this.selectLoading = true
    }
    params = {
      tag: this.auditForm.auditing,
      id: this.selectCard.id,
      reason: this.auditForm.reason
    }
    try {
      const res = await checkPrice(params)
      this.$message({
        type: 'success',
        message: '审核成功'
      })
      this.auditShow = false
      this.getTableData(this.selectCard.id)
      this.resetForm()
      this.selectLoading = false
    } catch (error) {
      this.selectLoading = false
      return error
    }
  }
  private getHistoryPrice() {
    this.selectLoading = true
    const params: any = {
      id: this.selectCard.id
    }
    getHistoryPrice(params)
      .then((res: any) => {
        const data = res.data || []
        this.historyList = data
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private async onHistory(val: any) {
    if (!val) {
      await this.onRow(this.selectCard)
    } else {
      await this.getRowDetail(val)
    }
  }
  private async onRow(card: any) {
    if (this.formLoading) return
    this.resetForm()
    this.formLoading = true
    this.isRightShow = true
    this.selectCard = {
      ...card
    }
    await this.getRowDetail(card.id)
  }
  private async getRowDetail(id: string) {
    this.formLoading = true
    try {
      const res = await getPriceById({ id })
      const data = res.data || {}
      const { priceList, endTime, startTime, ...form } = data
      this.selectForm = {
        ...form
      }
      if (startTime && endTime) {
        const start = dayjs(startTime).format('YYYY-MM-DD')
        const end = dayjs(endTime).format('YYYY-MM-DD')
        this.$set(this.selectForm, 'times', [start, end])
      }
      this.tableData = priceList
      this.getSpanArr(this.tableData)
      this.isTableShow = true
      this.formLoading = false
    } catch (error) {
      this.formLoading = false
      return error
    }
  }
  private getSpanArr(data: any) {
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        this.spanArr1.push(1)
        this.spanNum1 = 0

        this.spanArr2.push(1)
        this.spanNum2 = 0
      } else {
        // 判断当前元素与上一个元素是否相同
        if (data[i].name === data[i - 1].name) {
          this.spanArr1[this.spanNum1] += 1
          this.spanArr1.push(0)

          if (data[i].type === data[i - 1].type) {
            this.spanArr2[this.spanNum2] += 1
            this.spanArr2.push(0)
          }
        } else {
          this.spanArr1.push(1)
          this.spanNum1 = i

          this.spanArr2.push(1)
          this.spanNum2 = i
        }
      }
    }
  }
  private tableDataSpanMethod({ row, column, rowIndex, columnIndex }: any) {
    if (columnIndex === 0) {
      const _row = this.spanArr1[rowIndex]
      const _col = _row > 0 ? 1 : 0
      return {
        rowspan: _row,
        colspan: _col
      }
    }
    if (columnIndex === 1) {
      const _row = this.spanArr2[rowIndex]
      const _col = _row > 0 ? 1 : 0
      return {
        rowspan: _row,
        colspan: _col
      }
    }
  }
  private onShow() {
    const { auditing, reason } = this.selectForm
    this.auditForm = {
      auditing,
      reason
    }
  }
  private onHide() {
    this.auditForm = {
      auditing: undefined,
      reason: undefined
    }
    const root: any = this.$refs.auditForm
    this.$nextTick(() => {
      root.clearValidate()
    })
  }
  private formatType(val: any) {
    const item = this.settlementList.find((it: any) => it.id === val) || {}
    return item.name || ''
  }
  private priceTypeChange(val: any) {
    this.myPopoverVisible = false
    this.$emit('priceTypeChange', val)
  }
  private formattPriceType(val: any, list: any[]) {
    const unit = list.find((e: any) => e.value === val)
    return unit ? `${unit.label}` : '--'
  }
  private getWarehouseList() {
    this.selectLoading = true
    getWarehouseList().then((res: any) => {
      this.warehouseList = res.data || []
      this.selectLoading = false
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }
  private getTableData(id?: string) {
    this.cardLoading = true
    const { times, ...form } = this.searchForm
    const params: any = {
      model: {
        ...form,
        startTime: Array.isArray(times) && times.length > 0 ? times[0] : undefined,
        endTime: Array.isArray(times) && times.length > 0 ? times[1] : undefined
      },
      page: this.pagination.page,
      size: this.pagination.size
    }
    getSupplierPriceList(params).then(async(res: any) => {
      const data = res.data || {}
      this.cardList = data.result || []
      this.pagination.total = data.total
      this.resetForm()
      this.cardLoading = false
      if (id) {
        const price = this.cardList.find((e: any) => e.id === id)
        if (price) {
          await this.onRow(price)
        }
      }
    }).catch((err: any) => {
      this.cardLoading = false
      return err
    })
  }
  private resetForm() {
    // resetForm
    this.selectForm = {
      id: undefined,
      warehouseId: undefined,
      warehouseName: undefined,
      refStandard: undefined,
      auditing: undefined,
      reason: undefined,
      refId: undefined,
      floorPrice: undefined,
      countryId: undefined,
      toCustSubtype: undefined,
      umWeight: undefined,
      umLength: undefined,
      currencyId: undefined,
      associatedAgents: [],
      ifStandard: true,
      times: [],
      country: {}
    }
    this.isTableShow = false
    this.isRightShow = false
    this.tableData = []
    this.spanArr1 = []
    this.spanArr2 = []
    this.spanNum1 = 0
    this.spanNum2 = 0
    this.$nextTick(() => {
      const root: any = this.$refs.editForm
      const priceTable: any = this.$refs.priceTable
      root.clearValidate()
      priceTable.doLayout()
    })
  }
  private handleClear() {
    this.searchForm.times = []
  }
  private handleConfirm(val: any) {
    this.popoverShow = false
    this.getTableData()
  }
  private formatTime(obj: any) {
    const start = (obj || {}).startTime
    const end = (obj || {}).endTime
    if (!start || !end) {
      return ''
    } else {
      return dayjs(start).format('YYYY-MM-DD') + '-' + dayjs(end).format('YYYY-MM-DD')
    }
  }
  private handleSizeChange(val: string) {
    this.pagination.size = Number(val)
    this.getTableData()
  }
  private handleCurrentChange(val: string) {
    this.pagination.page = Number(val)
    this.getTableData()
  }
  private toggle() {
    this.isActive = !this.isActive
  }
  private created() {
    this.getWarehouseList()
    this.getTableData()
  }
}
</script>

<style lang="scss" scoped>
  .search-form {
    .el-form-item {
      display: inline-block;
      vertical-align: top;
      padding-right: 2px;
      width: 25%;
      margin-bottom: 10px;
    }
    .el-checkbox {
      margin-right: 15px;
    }
  }
  ::v-deep .el-input__inner {
    padding-left: 8px;
  }
  .select-form {
    .item-read {
      background-color: #EAEEF4;
      padding: 5px 0;
      margin-bottom: 10px;
      .el-form-item {
        margin-bottom: 0;
      }
    }
    .el-form-item {
      display: inline-block;
      vertical-align: top;
    }
    .el-radio {
      margin-right: 15px;
    }
  }

  ::v-deep .el-card__body {
    padding: 10px;
  }

  ::v-deep .el-transfer-panel {
    width: 40%;
    height: 100%;
  }
  ::v-deep .el-transfer {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
  }
  ::v-deep .el-transfer-panel__list.is-filterable {
    display: flex;
    flex-flow: column nowrap;
    height: 100%;
  }
  ::v-deep .el-transfer-panel__body {
    height: 78%;
  }
  .active-card {
    background: #FFFAF5;
    border-color: #FF7D19;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  }
  .card-tips {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  .card-tip-zero {
    background-color: #2291E6;
  }
  .card-tip-one {
    background-color: #189800;
  }
  .card-tip-two {
    background-color: #E12E2E;
  }
  .card-tip-three {
    background-color: #FF7D19;
  }
  .word-limit {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .btn-tip-green {
    color: #189800;
    background-color: rgb(24, 152, 0, 0.2);
    display: inline-block;
    padding: 2px;
    border-radius: 2px;
  }
  .btn-tip-blue {
    color: #2291E6;
    background-color: rgb(34, 145, 230, 0.2);
    display: inline-block;
    padding: 2px;
    border-radius: 2px;
  }
  .border-tip-blue {
    color: #409EFF;
    border: 1px solid #409EFF;
    display: inline-block;
    padding: 2px;
    border-radius: 2px;
  }
  .btn-tip-grey {
    color: #909399;
    background-color: rgb(144, 147, 153, 0.2);
    display: inline-block;
    padding: 2px;
    border-radius: 2px;
  }

  .input-number-valiate {
    width: 100%;
    ::v-deep .el-input__inner {
      text-align: left;
    }
  }
  .item-after-icon {
    position: relative;
    padding-bottom: 15px;
    .item-icon-plus {
      position: absolute;
      top: 6px;
      color:#409eff;
      font-size:18px;
      margin-left:10px;
      cursor:pointer;
    }
    .item-icon-reduce {
      position: absolute;
      top: 6px;
      color:#f56c6c;
      font-size:18px;
      margin-left:10px;
      cursor:pointer;
    }
  }
  .table-header-title {
    border-width: 1px 1px 0 1px;
    border-style: solid;
    border-color: rgb(223, 230, 236);
    padding-left: 10px;
    line-height: 40px;
    height: 40px;
    background-color: #F4F4F4;
  }
</style>
