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
                v-model="searchForm.subtypeId"
                :loading="selectLoading"
                size="mini"
                clearable
                filterable
                placeholder="业务类型"
                style="width: 100%;"
                @change="getTableData"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-popover
                v-model="popoverShow1"
                placement="bottom-start"
                trigger="click"
              >
                <div style="padding-right: 10px;">
                  <el-form-item
                    label="目的国"
                    label-width="60px"
                  >
                    <el-select
                      v-model="searchForm.countryId"
                      :loading="selectLoading"
                      size="mini"
                      clearable
                      filterable
                      placeholder="请选择"
                      style="width: 200px;"
                    >
                      <el-option
                        v-for="item in countryList"
                        :key="item.id"
                        :label="`${item.name}-${item.alias}`"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="服务"
                    label-width="60px"
                  >
                    <el-select
                      v-model="searchForm.bscId"
                      :disabled="!searchForm.countryId"
                      :loading="selectLoading"
                      size="mini"
                      clearable
                      filterable
                      placeholder="请选择"
                      style="width: 200px;"
                      @focus="getServiceList('sea')"
                      @change="onServiceSea"
                    >
                      <el-option
                        v-for="item in serviceList"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="供应商"
                    label-width="60px"
                  >
                    <el-select
                      v-model="searchForm.custId"
                      size="mini"
                      clearable
                      filterable
                      placeholder="请选择"
                      style="width: 200px;"
                    >
                      <el-option
                        v-for="item in supplierList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                  <div
                    slot="footer"
                    style="text-align: right;"
                  >
                    <el-button @click="handleClear('1')">
                      清空
                    </el-button>
                    <el-button
                      type="primary"
                      @click="handleConfirm('1')"
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
                    v-model="searchForm.bscName"
                    placeholder="服务"
                    readonly
                    suffix-icon="el-select__caret el-input__icon el-icon-arrow-up"
                  />
                </div>
              </el-popover>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="searchForm.audit"
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
                v-model="popoverShow2"
                placement="bottom-start"
                trigger="click"
              >
                <div style="padding-right: 15px;">
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
                    <el-button @click="handleClear('2')">
                      清空
                    </el-button>
                    <el-button
                      type="primary"
                      @click="handleConfirm('2')"
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
                  <el-row>
                    <el-col :span="1">
                      <el-tooltip
                        v-if="item.audit === '0'"
                        effect="dark"
                        content="待审核"
                        placement="top"
                      >
                        <i
                          class="card-tips card-tip-zero"
                        />
                      </el-tooltip>
                      <el-tooltip
                        v-if="item.audit === '1'"
                        effect="dark"
                        content="已通过"
                        placement="top"
                      >
                        <i
                          class="card-tips card-tip-one"
                        />
                      </el-tooltip>
                      <el-tooltip
                        v-if="item.audit === '2'"
                        effect="dark"
                        content="已拒绝"
                        placement="top"
                      >
                        <i
                          class="card-tips card-tip-two"
                        />
                      </el-tooltip>
                      <el-tooltip
                        v-if="item.audit === '3'"
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
                      {{ item.bsc.value }}
                    </el-col>
                  </el-row>
                  <el-row style="margin: 10px 0;">
                    <el-col
                      :span="3"
                    >
                      供应商
                    </el-col>
                    <el-col
                      :span="21"
                    >
                      {{ item.cust.value }}
                    </el-col>
                  </el-row>
                  <el-row style="margin: 10px 0;">
                    <el-col
                      :span="24"
                      class="word-limit"
                      style="color:  #409EFF;"
                    >
                      {{ (item.portsFrom || {}).value }} --- {{ (item.portsTo || {}).value }}
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="3">
                      <span
                        v-if="item.status === '1'"
                        class="btn-tip-green"
                      >
                        生效中
                      </span>
                      <span
                        v-if="item.status === '0'"
                        class="btn-tip-blue"
                      >
                        待生效
                      </span>
                      <span
                        v-if="item.status === '2'"
                        class="btn-tip-grey"
                      >
                        已失效
                      </span>
                    </el-col>
                    <el-col
                      :span="13"
                      style="line-height: 16px;"
                    >
                      {{ formatTime(item.period) }}
                    </el-col>
                    <el-col
                      :span="8"
                      style="text-align: right;"
                    >
                      <span class="border-tip-blue">
                        {{ (item.subtype || {}).value }}
                      </span>&nbsp;
                      <span
                        v-if="item.loadType"
                        class="border-tip-blue"
                      >
                        {{ formatType(item.loadType) }}
                      </span>
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
                label="业务类型"
                prop="subtypeId"
              >
                <el-select
                  v-model="selectForm.subtypeId"
                  :disabled="isView"
                  :loading="selectLoading"
                  style="width:200px;"
                  clearable
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                prop="bscId"
                label-width="75px"
              >
                <span slot="label">服务</span>
                <el-tooltip
                  v-show="selectForm.bscId"
                  slot="label"
                  :content="selectForm.bscName + '/' + selectForm.bscCode"
                  placement="top"
                  effect="light"
                >
                  <i class="el-icon-warning-outline" />
                </el-tooltip>
                <el-select
                  v-model="selectForm.bscId"
                  :loading="selectLoading"
                  :disabled="isView"
                  style="width:200px;"
                  clearable
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in serviceList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="供应商"
              >
                {{ selectForm.custName }}
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-select
                v-model="historyId"
                clearable
                filterable
                placeholder="历史版本"
                style="width: 100%;"
                size="mini"
                @focus="getHistoryPrice"
                @change="onHistory"
              >
                <el-option
                  v-for="(item, index) in historyList"
                  :key="index"
                  :label="formatTime(item.period)"
                  :value="item.id"
                />
              </el-select>
            </el-col>
          </el-row>
          <div class="item-read">
            <el-form-item
              v-if="selectForm.portsFrom || selectForm.portsTo"
              label-width="200"
              style="margin-left: 20px;"
            >
              <span
                class="word-limit"
              >
                {{ (selectForm.portsFrom || {}).value }} --- {{ (selectForm.portsTo || {}).value }}
              </span>
            </el-form-item>
            <el-form-item
              label="重量单位："
              prop="umWeight"
            >
              <div style="width: 60px;">
                <span v-if="selectForm.umWeight === 'T' || selectForm.umWeight === 'TS'">
                  T-吨
                </span>
                <span v-if="selectForm.umWeight === 'LB' || selectForm.umWeight === 'LBS'">
                  LB-磅
                </span>
                <span v-if="selectForm.umWeight === 'KG' || selectForm.umWeight === 'KGS'">
                  KG-公斤
                </span>
                <span v-if="selectForm.umWeight === 'OZ' || selectForm.umWeight === 'OZS'">
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
              v-if="selectForm.subtypeId !== '1' && selectForm.subtypeId !== '2'"
              label="货币单位："
              prop="currencyId"
            >
              <span v-if="selectForm.currencyId">{{ selectForm.currencyId }}</span>
              <span v-if="selectForm.currencyName">{{ '-' + selectForm.currencyName }}</span>
            </el-form-item>
            <el-form-item
              v-if="(selectForm.subtypeId === '1' || selectForm.subtypeId === '2') && selectForm.loadType === '2'"
              label="整柜货币单位："
              label-width="130px"
              prop="currencyId1"
            >
              <span v-if="selectForm.currencyId1">{{ selectForm.currencyId1 }}</span>
              <span v-if="selectForm.currencyName1">{{ '-' + selectForm.currencyName1 }}</span>
            </el-form-item>
            <el-form-item
              v-if="(selectForm.subtypeId === '1' || selectForm.subtypeId === '2') && selectForm.loadType === '3'"
              label="拼箱货币单位："
              label-width="130px"
              prop="currencyId2"
            >
              <span v-if="selectForm.currencyId2">{{ selectForm.currencyId2 }}</span>
              <span v-if="selectForm.currencyName2">{{ '-' + selectForm.currencyName2 }}</span>
            </el-form-item>
          </div>
          <el-row>
            <el-col :span="20">
              <el-form-item
                v-if="selectForm.subtypeId && selectForm.bscId"
                label="请选择"
                prop="loadType"
              >
                <el-radio-group
                  v-model="selectForm.loadType"
                  :disabled="isView"
                >
                  <el-radio
                    v-for="(item, index) in typeOption"
                    :key="index"
                    :label="item.value"
                  >
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="有效时间"
                label-width="90px"
                prop="times"
              >
                <el-date-picker
                  v-model="selectForm.times"
                  :disabled="isView"
                  :clearable="false"
                  :default-time="['00:00:00', '23:59:59']"
                  unlink-panels
                  type="datetimerange"
                  align="left"
                  size="mini"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  range-separator="~"
                  style="width:310px;margin-right: 20px;"
                  start-placeholder="起始时间"
                  end-placeholder="截止时间"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="4"
              style="text-align: right;"
            >
              <el-button
                v-if="selectForm.audit === '0'"
                type="text"
                size="small"
                style="margin-right: 10px"
                @click="auditRow"
              >
                审核
              </el-button>
              <el-popover
                v-show="selectForm.audit === '3'"
                v-model="auditShow"
                placement="bottom-start"
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
                      prop="audit"
                      label-width="110px"
                    >
                      <el-radio-group v-model="auditForm.audit">
                        <el-radio label="1">
                          通过
                        </el-radio>
                        <el-radio label="2">
                          拒绝
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item
                      v-if="auditForm.audit === '2'"
                      label="拒绝原因："
                      prop="remark"
                      label-width="110px"
                    >
                      <el-input
                        v-model="auditForm.remark"
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
                  style="padding-right: 10px;"
                >
                  审核
                </el-button>
              </el-popover>
            </el-col>
          </el-row>
          <div v-if="selectForm.audit === '2'">
            <el-form-item
              label="拒绝原因："
              label-width="90px"
              style="width: 100%;"
            >
              {{ selectForm.remark }}
            </el-form-item>
          </div>
        </el-form>
        <div v-show="isTableShow">
          <vxe-table
            v-if="aAxisData.length"
            :data="tableData"
            height="520"
            style="width: 100%;"
            border
            resizable
            size="small"
            :auto-resize="true"
          >
            <vxe-table-column
              width="150"
              title="服务机构"
              :show-overflow="true"
              :resizable="true"
            >
              <template slot-scope="scope">
                {{ (scope.row.trans || {}).orgName }}
              </template>
            </vxe-table-column>
            <vxe-table-column
              width="150"
              title="服务编码"
              :show-overflow="true"
              :resizable="true"
            >
              <template slot-scope="scope">
                {{ (scope.row.trans || {}).serviceCode }}
              </template>
            </vxe-table-column>
            <vxe-table-column
              width="180"
              title="截止报关 / 起运时间"
              :show-header-overflow="true"
              :show-overflow="true"
              :resizable="true"
            >
              <template slot-scope="scope">
                {{ formatDays(scope.row.trans || {}) }}
              </template>
            </vxe-table-column>
            <vxe-table-column
              v-for="(item,index) in aAxisData"
              :key="index"
              :title="item.label"
              :show-overflow="true"
              :resizable="true"
            >
              <template slot-scope="scope">
                <div>
                  <span>{{ scope.row.prices[index].price }}</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column
              min-width="120"
              title="备注"
              :show-overflow="true"
              :resizable="true"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.remark }}</span>
              </template>
            </vxe-table-column>
          </vxe-table>
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
  getServiceSubtypeList,
  getCountryList,
  getBscList,
  getHistoryPrice,
  getSupplierPriceList,
  getPriceById,
  checkPrice,
  getWordsList
} from '@/api/price-to-booking'
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
  private formLoading: boolean = false
  private isRightShow: boolean = false
  private cardLoading: boolean = false
  private popoverShow1: boolean = false
  private popoverShow2: boolean = false
  private myPopoverVisible: boolean = false
  private isTableShow: boolean = false
  private auditShow: boolean = false
  private historyId: any = ''
  private dayjs: any = dayjs
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  private selectCard: any = {}
  private searchForm: any = {
    custId: undefined,
    subtypeId: undefined,
    bscId: undefined,
    bscName: undefined,
    countryId: undefined,
    audit: undefined,
    effect: undefined,
    expire: undefined,
    times: []
  }
  private selectForm: any = {
    custName: '',
    subtypeId: undefined,
    subtypeName: undefined,
    portsFrom: {
      key: undefined,
      value: undefined
    },
    portsTo: {
      key: undefined,
      value: undefined
    },
    stdId: undefined,
    audit: undefined,
    status: undefined,
    remark: undefined,
    loadType: undefined,
    bscId: undefined,
    bscName: undefined,
    bscCode: undefined,
    refId: undefined,
    currencyId: undefined,
    currencyId1: undefined,
    currencyId2: undefined,
    countryId: undefined,
    category: undefined,
    umWeight: undefined,
    umLength: undefined,
    agentId: [],
    mode: '0',
    times: [],
    sections: [{
      lower: undefined,
      upper: undefined
    }]
  }
  private formRules = {
    subtypeId: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
    countryId: [{ required: false, message: '请选择目的国', trigger: 'change' }],
    bscId: [{ required: true, message: '请选择服务', trigger: 'change' }],
    category: [{ required: true, message: '请选择报价对象', trigger: 'change' }],
    refId: [{ required: true, message: '请选择参考报价', trigger: 'change' }],
    loadType: [{ required: true, message: '请选择服务类型', trigger: 'change' }],
    mode: [{ required: true, message: '请选择价格标准', trigger: 'change' }],
    times: [{ required: true, message: '请选择有效时间', trigger: 'change' }],
    stdId: [{ required: true, message: '请选择有效时间', trigger: 'change' }]
  }
  private auditForm: any = {
    audit: undefined,
    remark: undefined
  }
  private auditRules = {
    audit: [{ required: true, message: '请选择审核状态', trigger: 'change' }]
  }
  private cardList: any[] = []
  private typeList: any[] = []
  private countryList: any[] = []
  private serviceList: any[] = []
  private typeOption: any[] = []
  private historyList: any[] = []
  private tableData: any[] = []
  private aAxisData: any[] = []
  private weekdays: any = [
    { label: '星期一', value: 1 },
    { label: '星期二', value: 2 },
    { label: '星期三', value: 3 },
    { label: '星期四', value: 4 },
    { label: '星期五', value: 5 },
    { label: '星期六', value: 6 },
    { label: '星期日', value: 7 }
  ]
  private auditList: any[] = [
    { name: '待审核', id: '0' },
    { name: '已通过', id: '1' },
    { name: '已拒绝', id: '2' },
    { name: '审核中', id: '3' }
  ]

  /* methods */
  private async auditRow() {
    // 审核
    let params: any = {}
    const root: any = this.$refs.auditForm
    this.formLoading = true
    if (this.selectCard.audit === '0') {
      params = {
        audit: '3',
        id: this.selectCard.id
      }
    } else {
      params = {
        audit: this.auditForm.audit,
        id: this.selectCard.id,
        reason: this.auditForm.remark
      }
    }
    try {
      const res = await checkPrice(params)
      this.$message({
        type: 'success',
        message: '审核成功'
      })
      this.auditShow = false
      this.getTableData()
      await this.getRowDetail(this.selectCard.id)
      this.formLoading = false
    } catch (error) {
      this.formLoading = false
      return error
    }
  }
  private getHistoryPrice() {
    this.selectLoading = true
    const params: any = {
      id: this.selectCard.id,
      mode: this.selectForm.mode,
      page: 1,
      size: 9999
    }
    getHistoryPrice(params)
      .then((res: any) => {
        const data = res.data || {}
        this.historyList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private async onHistory(val: any) {
    this.aAxisData = []
    this.tableData = []
    if (!val) {
      await this.onRow(this.selectCard)
    } else {
      await this.getRowDetail(val)
    }
  }
  private onShow() {
    const { audit, remark } = this.selectForm
    this.auditForm = {
      audit,
      remark
    }
  }
  private onHide() {
    this.auditForm = {
      audit: undefined,
      remark: undefined
    }
    const root: any = this.$refs.auditForm
    this.$nextTick(() => {
      root.clearValidate()
    })
  }
  private async onRow(card: any) {
    if (this.formLoading) return
    this.formLoading = true
    this.resetForm()
    this.isView = true
    this.selectCard = {
      ...card
    }
    this.isRightShow = true
    await this.getServiceList('sel')
    await this.getRowDetail(card.id)
  }
  private async getRowDetail(id: string) {
    try {
      const res = await getPriceById({ id })
      const data = res.data || {}
      const { cust, currency, currency1, currency2, bsc, period, specials, subtype, rows, refId, loadType, ...form } = data
      this.selectForm = {
        ...form
      }
      this.selectForm.refId = refId
      this.selectForm.custName = cust.value
      this.selectForm.loadType = loadType
      this.selectForm.bscId = bsc.key * 1
      this.selectForm.bscName = bsc.value
      this.selectForm.subtypeId = subtype.key
      this.selectForm.subtypeName = subtype.value
      if (period.effect && period.expire) {
        const start = dayjs(period.effect).format('YYYY-MM-DD HH:mm:ss')
        const end = dayjs(period.expire).format('YYYY-MM-DD HH:mm:ss')
        this.$set(this.selectForm, 'times', [start, end])
      }
      this.selectForm.agentId = specials.map((it: any) => it.key)
      this.selectForm.currencyName = currency.value
      this.selectForm.currencyId = currency.key
      this.selectForm.currencyName1 = currency1.value
      this.selectForm.currencyId1 = currency1.key
      this.selectForm.currencyName2 = currency2.value
      this.selectForm.currencyId2 = currency2.key
      const json: any[] = []
      rows.map((it: any, index: any) => {
        json.push(it)
      })
      this.tableData = json

      if (Array.isArray(rows) && rows.length > 0) {
        const item = rows[0].prices || []
        this.aAxisData = item.map((a: any, index: any) => {
          const xxx = a.x || {}
          const obj: any = {
            label: '',
            aAxisArr: []
          }
          if (loadType === '5' && a.type === '0') { // 卡散-重量
            obj.label = '重量'
            obj.aAxisArr.push({
              index,
              label: `${xxx.lower}-${xxx.upper}`
            })
          } else if (loadType === '5' && a.type === '1') { // 卡散-方数
            obj.label = '方数'
            obj.aAxisArr.push({
              index,
              label: `${xxx.lower}-${xxx.upper}`
            })
          } else if (loadType === '1' || loadType === '2' || loadType === '4') { // 柜型
            obj.label = xxx
          } else if (loadType === '0' || loadType === '3') { // 区间
            obj.label = `${xxx.lower}-${xxx.upper}`
          }
          return obj
        })
      }
      this.getSvTypes()
      await this.getServiceList('sel')
      this.serviceList.map((it: any) => {
        if (it.id === this.selectForm.bscId) {
          this.selectForm.bscCode = it.serviceCode
        }
      })
      this.isTableShow = true
      this.formLoading = false
    } catch (error) {
      this.formLoading = false
      return error
    }
  }
  private resetForm() {
    this.selectForm = {
      subtypeId: undefined,
      subtypeName: undefined,
      portsFrom: {
        key: undefined,
        value: undefined
      },
      portsTo: {
        key: undefined,
        value: undefined
      },
      stdId: undefined,
      audit: undefined,
      status: undefined,
      remark: undefined,
      loadType: undefined,
      bscId: undefined,
      bscName: undefined,
      bscCode: undefined,
      refId: undefined,
      currencyId: undefined,
      currencyId1: undefined,
      currencyId2: undefined,
      countryId: undefined,
      category: undefined,
      umWeight: undefined,
      umLength: undefined,
      agentId: [],
      mode: '0',
      times: [],
      sections: [{
        lower: undefined,
        upper: undefined
      }]
    }
    this.tableData = []
    this.historyId = ''
    this.isTableShow = false
    this.isRightShow = false
    const root: any = this.$refs.editForm
    this.$nextTick(() => {
      root.clearValidate()
    })
  }
  private getSvTypes() {
    if (!this.selectForm.subtypeId) return
    const params = {
      type: 'BOOKING_BUSINESS_TYPE' + this.selectForm.subtypeId
    }
    getWordsList(params)
      .then((res: any) => {
        const arr = res.data || []
        if (this.selectForm.subtypeId === '0') {
          this.typeOption = [
            { value: '0', label: '散货' },
            { value: '1', label: '包板' }
          ]
        } else {
          this.typeOption = arr
        }
      }).catch((err: any) => {
        return err
      })
  }
  private formatDays(row: any) {
    const resS = this.weekdays.find((item: any) => item.value === row.shipDay) || {}
    const resC = this.weekdays.find((item: any) => item.value === row.customDay) || {}
    return (resC.label || '') + ' / ' + (resS.label || '')
  }
  private priceTypeChange(val: any) {
    this.myPopoverVisible = false
    this.$emit('priceTypeChange', val)
  }
  private formattPriceType(val: any, list: any[]) {
    const unit = list.find((e: any) => e.value === val)
    return unit ? `${unit.label}` : '--'
  }
  private getTableData() {
    this.cardLoading = true
    const { times, ...form } = this.searchForm
    const params: any = {
      model: {
        ...form,
        effect: Array.isArray(times) && times.length > 0 ? times[0] + ' 00:00:00' : undefined,
        expire: Array.isArray(times) && times.length > 0 ? times[1] + ' 23:59:59' : undefined
      },
      page: this.pagination.page,
      size: this.pagination.size
    }
    getSupplierPriceList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.cardList = data.result || []
        this.pagination.total = data.total
        // this.resetForm()
        this.cardLoading = false
      })
      .catch((err: any) => {
        this.cardLoading = false
        return err
      })
  }
  private async getServiceList(val: any) {
    this.selectLoading = true
    const params: any = {
      page: 1,
      size: 9999,
      model: {
        countryToId: val === 'sea' ? this.searchForm.countryId : this.selectForm.countryId,
        conveyance: val === 'sea' ? this.searchForm.subtypeId : this.selectForm.subtypeId
      }
    }
    await getBscList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.serviceList = (data.result || []).map((it: any) => {
          it.label = `${it.name}(${it.abbr})`
          return it
        })
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private handleClear(val: any) {
    switch (val) {
      case '1':
        this.searchForm.countryId = undefined
        this.searchForm.custId = undefined
        this.searchForm.bscId = undefined
        this.searchForm.bscName = undefined
        break
      case '2':
        this.searchForm.times = []
        break
      default:
        break
    }
  }
  private handleConfirm(val: any) {
    if (val === '1') {
      this.popoverShow1 = false
    } else if (val === '2') {
      this.popoverShow2 = false
    }
    this.getTableData()
  }
  private onCountry() {
    this.searchForm.bscId = undefined
    this.searchForm.bscName = undefined
  }
  private onServiceSea() {
    if (this.searchForm.bscId) {
      this.serviceList.map((it: any) => {
        if (it.id === this.searchForm.bscId) {
          this.searchForm.bscName = it.name
        }
      })
    } else {
      this.searchForm.bscName = undefined
    }
  }
  private getSubtypeList(): void {
    this.selectLoading = true
    getServiceSubtypeList({
      typeId: '02'
    })
      .then((res: any) => {
        const data = res.data || []
        this.typeList = data
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
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
  private formatTime(obj: any) {
    const start = (obj || {}).effect
    const end = (obj || {}).expire
    return dayjs(start).format('YYYY-MM-DD HH:mm') + '-' + dayjs(end).format('YYYY-MM-DD HH:mm')
  }
  private formatType(type: any) {
    let name
    switch (type) {
      case '0':
        name = '散货'
        break
      case '1':
        name = '包板'
        break
      case '2':
        name = '整柜'
        break
      case '3':
        name = '拼箱'
        break
      case '4':
        name = '整车'
        break
      case '5':
        name = '散货'
        break
      default:
        break
    }
    return name
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
    this.getTableData()
    this.getCountryList()
    this.getSubtypeList()
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
    ::v-deep .el-input__inner {
      padding-left: 8px;
    }
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
    ::v-deep .el-input__inner {
      padding-left: 8px;
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
    color: #2291E6;
    border: 1px solid #2291E6;
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
  .table-header-title {
    display: inline-block;
    border: 1px solid #ccc;
    background: linear-gradient(45deg, transparent 49.5%,  #ccc 49.5%,  #ccc 50.5%, transparent 50.5%);
  }
  ::v-deep .el-table .success-row {
    background-color: #cee9ec !important;
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
</style>
