<template>
  <div
    v-loading="formLoading"
  >
    <el-form
      ref="selectForm"
      :model="selectForm"
      :rules="formRules"
      label-width="120px"
      label-position="right"
      size="small"
    >
      <el-form-item
        label="业务类型"
        prop="type"
      >
        <el-select
          v-model="selectForm.type"
          :disabled="isEdit"
          placeholder="请选择"
          size="small"
          style="width:100%;"
          @change="onType"
        >
          <el-option
            v-for="item in typelist"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="订舱服务"
        prop="bscId"
      >
        <el-popover
          placement="bottom-start"
        >
          <el-row>
            <el-form-item
              label="目的国"
              label-width="60px"
            >
              <el-select
                v-model="selectForm.countryId"
                :loading="selectLoading"
                size="mini"
                clearable
                filterable
                placeholder="请选择"
                style="width: 275px;"
                @focus="getCountryList"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item
              label="服务"
              label-width="60px"
            >
              <el-select
                v-model="selectForm.bscId"
                :loading="selectLoading"
                :disabled="!selectForm.type"
                clearable
                filterable
                size="small"
                style="width: 275px;"
                placeholder="请选择"
                @focus="getBscList"
                @change="onFlight"
              >
                <el-option
                  v-for="item in flightList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-row>
          <div
            slot="reference"
            class="el-select el-select--small"
            style="width: 100%;"
          >
            <el-input
              v-model="selectForm.bscName"
              placeholder="服务"
              readonly
              suffix-icon="el-select__caret el-input__icon el-icon-arrow-up"
            />
          </div>
        </el-popover>
      </el-form-item>
      <el-form-item
        label="服务组"
        prop="groupId"
      >
        <el-select
          v-model="selectForm.groupId"
          :loading="selectLoading"
          clearable
          filterable
          size="small"
          style="width: 100%;"
          placeholder="请选择"
          @focus="getGroupData"
        >
          <el-option
            v-for="item in groupList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="服务商"
        prop="serviceName"
      >
        <el-input
          v-model="selectForm.serviceName"
          :disabled="true"
          placeholder="请选择"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="showServiceLine"
          />
        </el-input>
      </el-form-item>
      <el-form-item
        v-if="selectForm.type === '1' || selectForm.type === '2'"
        label="柜型"
        prop="containerId"
      >
        <el-select
          v-model="selectForm.containerId"
          :loading="selectLoading"
          filterable
          clearable
          size="small"
          style="width:100%;"
          placeholder="请选择"
          @focus="getCabinetList"
        >
          <el-option
            v-for="item in cabinetList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="selectForm.type === '0'"
        label="航空版"
        prop="containerId"
      >
        <el-select
          v-model="selectForm.containerId"
          :loading="selectLoading"
          filterable
          clearable
          size="small"
          style="width:100%;"
          placeholder="请选择"
          @focus="getAviationList"
          @change="aviationChange"
        >
          <el-option
            v-for="item in cabinetList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="selectForm.type === '0'"
        label="体积"
        prop="airVolume"
      >
        <div class="input-content">
          <div style="flex: 1;">
            <el-input-number
              v-model="selectForm.airVolume"
              class="input-number-valiate input-border"
              :controls="false"
              placeholder="请输入"
              :min="0"
              :max="999999"
              :precision="2"
            />
          </div>
          <div class="input-unit">
            m³
          </div>
        </div>
      </el-form-item>
      <el-form-item
        v-if="selectForm.type === '4'"
        label="车型"
        prop="containerId"
      >
        <el-select
          v-model="selectForm.containerId"
          :loading="selectLoading"
          filterable
          clearable
          size="small"
          style="width:100%;"
          placeholder="请选择"
          @focus="getVehicleTypeList"
        >
          <el-option
            v-for="item in cabinetList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="selectForm.type !== '0'"
        label="数量"
        prop="quantity"
      >
        <div class="input-content">
          <div style="flex: 1;">
            <el-input-number
              v-model="selectForm.quantity"
              class="input-number-valiate input-border"
              :controls="false"
              placeholder="请输入"
              :min="0"
              :max="100"
              :step="1"
              step-strictly
              @blur="onQuantity"
            />
          </div>
          <div class="input-unit">
            个
          </div>
        </div>
      </el-form-item>
      <el-form-item
        v-if="selectForm.type === '1' || selectForm.type === '2'"
        label="1个SO多条柜"
        prop="ifSo"
      >
        <el-radio-group
          v-model="selectForm.ifSo"
          disabled
        >
          <el-radio :label="0">
            否
          </el-radio>
          <el-radio :label="1">
            是
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="限重"
        prop="loadLimit"
      >
        <div class="input-content">
          <div style="flex: 1;">
            <el-input-number
              v-model="selectForm.loadLimit"
              class="input-number-valiate input-border"
              :controls="false"
              placeholder="请输入"
              :min="0"
              :max="999999"
              :precision="2"
            />
          </div>
          <div class="input-unit">
            kg
          </div>
        </div>
      </el-form-item>
      <el-form-item
        label="派件方式"
        prop="dispatch"
      >
        <el-select
          v-model="selectForm.dispatch"
          clearable
          filterable
          multiple
          collapse-tags
          size="small"
          style="width:100%;"
          placeholder="请选择"
        >
          <el-option
            v-for="item in dispatchOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="!!item.disabled"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="起运日期"
        prop="shipDate"
      >
        <div class="input-content">
          <div style="flex: 1;">
            <el-date-picker
              v-model="selectForm.shipDate"
              :disabled="isEdit"
              type="datetime"
              style="width: 100%;"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              placeholder="年/月/日 时:分"
            />
          </div>
          <div
            v-if="selectForm.type === '1' || selectForm.type === '2'"
            disabled
            class="input-unit"
          >
            {{ formatWeekShip }}
          </div>
        </div>
      </el-form-item>
      <el-form-item
        label="截单日期"
        prop="cutoffDate"
      >
        <div class="input-content">
          <div style="flex: 1;">
            <el-date-picker
              v-model="selectForm.cutoffDate"
              :disabled="isEdit"
              type="datetime"
              style="width: 100%;"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              placeholder="年/月/日 时:分"
            />
          </div>
          <div
            v-if="selectForm.type === '1' || selectForm.type === '2'"
            disabled
            class="input-unit"
          >
            {{ formatWeekCutoff }}
          </div>
        </div>
      </el-form-item>
      <el-form-item
        label="运输时间"
        prop="transTime"
      >
        <div class="input-content">
          <div style="flex: 1;">
            <el-input-number
              v-model="selectForm.transTime"
              class="input-number-valiate input-border"
              :controls="false"
              placeholder="请输入"
              :min="0"
              :max="999"
              :step="1"
              step-strictly
            />
          </div>
          <div class="input-unit">
            天
          </div>
        </div>
      </el-form-item>
      <el-form-item
        label="目的仓代码"
        :class="isFba ? 'is-required' : ''"
        prop="fbastoreId"
      >
        <el-select
          v-model="selectForm.fbastoreId"
          :disabled="!selectForm.bscId"
          :loading="selectLoading"
          clearable
          filterable
          size="small"
          style="width:100%;"
          placeholder="请选择"
          @focus="getFbastoreList"
        >
          <el-option
            v-for="item in codeList"
            :key="item.id"
            :label="item.fellName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="装货仓库"
        class="is-required"
      >
        <el-input
          v-model="ss"
          :placeholder="`已选择(${selectForm.warehouseId.length})`"
          style="width: 100%;"
          disabled
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="handleItem"
          />
        </el-input>
      </el-form-item>
      <el-form-item
        v-if="pageType === 'product-template-page'"
        label="创建频率"
        prop="frequency"
      >
        <div class="input-content">
          <div style="flex: 1;">
            <el-input-number
              v-model="selectForm.frequency"
              class="input-number-valiate input-border"
              :controls="false"
              placeholder="请输入"
              :min="0"
              :max="999"
              :step="1"
              step-strictly
            />
          </div>
          <div class="input-select">
            <el-select
              v-model="selectForm.unit"
              size="small"
              disabled
              class="select-unit"
            >
              <el-option
                label="天"
                :value="1"
              />
              <el-option
                label="周"
                :value="2"
              />
            </el-select>
          </div>
        </div>
      </el-form-item>
      <el-form-item
        v-if="pageType === 'product-template-page'"
        label="周期数量"
        prop="cycle"
      >
        <div class="input-content">
          <div style="flex: 1;">
            <el-input-number
              v-model="selectForm.cycle"
              class="input-number-valiate input-border"
              :controls="false"
              placeholder="请输入"
              :min="0"
              :max="999"
              :step="1"
              step-strictly
            />
          </div>
          <div class="input-select">
            <el-select
              v-model="selectForm.unit"
              disabled
              size="small"
              class="select-unit"
            >
              <el-option
                label="天"
                :value="1"
              />
              <el-option
                label="周"
                :value="2"
              />
            </el-select>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="selectForm.remark"
          placeholder="请输入"
          :maxlength="150"
        />
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      style="text-align: right;padding: 10px 10px 20px;"
    >
      <el-button
        size="small"
        @click="cancel"
      >
        取 消
      </el-button>
      <el-button
        :disabled="isBook"
        type="primary"
        size="small"
        @click="saveConfirm"
      >
        确 定
      </el-button>
    </div>
    <hint-model
      ref="hintModel"
      @cancel="saveByCancel"
      @ok="saveByNow"
    />
    <el-dialog
      width="1200px"
      title="选择服务商"
      :visible.sync="innerVisible"
      append-to-body
      @closed="onCancel"
    >
      <div style="text-align: right;">
        <el-select
          v-model="searchForm.shipDay"
          size="small"
          style="width: 130px;margin-right: 5px;"
          placeholder="起运时间"
          filterable
          clearable
        >
          <el-option
            v-for="item in weekdays1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="searchForm.customDay"
          size="small"
          style="width: 130px;margin-right: 5px;"
          placeholder="截报关时间"
          filterable
          clearable
        >
          <el-option
            v-for="item in weekdays1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="keyWord"
          size="small"
          style="width: 250px;margin-right: 10px;"
          placeholder="请输入"
          :maxlength="150"
        >
          <el-select
            slot="prepend"
            v-model="keyType"
            size="small"
            style="width:100px;"
            placeholder="请选择"
          >
            <el-option
              label="服务编码"
              value="1"
            />
            <el-option
              label="服务机构"
              value="2"
            />
          </el-select>
        </el-input>
        <el-button
          type="primary"
          size="small"
          @click="onSearch"
        >
          查询
        </el-button>
      </div>
      <el-table
        v-if="isType"
        ref="tableSelect"
        v-loading="loading"
        :data="tableData"
        height="400px"
        style="width: 100%;margin: 10px 0;"
        border
        @row-click="rowClick"
        @selection-change="rowSelectChange"
      >
        <el-table-column
          v-if="isType === '1' || isType === '2'"
          type="selection"
          width="55"
        />
        <el-table-column
          v-if="isType !== '1' && isType !== '2'"
          width="55"
          label=""
        >
          <template slot-scope="scope">
            <el-radio
              v-model="selectForm.bscTransId"
              :label="scope.row.id"
            >
              &nbsp;
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          prop="orgName"
          label="服务机构"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="serviceCode"
          label="服务编码"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="entreportName"
          label="中转港"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="dischargeName"
          label="卸货港"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="days"
          label="运输天数"
          width="100"
        />
        <el-table-column
          :formatter="formatDays"
          prop="shipDay"
          label="起运时间"
          min-width="120"
        />
        <el-table-column
          :formatter="formatDays"
          prop="docDay"
          label="截文件时间"
          min-width="120"
        />
        <el-table-column
          :formatter="formatDays"
          prop="customDay"
          label="截报关时间"
          min-width="120"
        />
        <el-table-column
          :formatter="formatType"
          prop="orgType2"
          label="二程机构类型"
          width="120"
        />
        <el-table-column
          prop="orgName2"
          label="二程服务机构"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="dischargeName2"
          label="二程卸货港"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="days2"
          label="二程运输天数"
          width="120"
        />
        <el-table-column
          :formatter="formatDays"
          prop="shipDay2"
          label="二程起运时间"
          min-width="120"
        />
      </el-table>
      <div
        v-if="isType === '1' || isType === '2'"
        style="text-align: right;padding: 10px 0;"
      >
        <el-button
          type="primary"
          size="small"
          @click="onSave"
        >
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="装货仓库"
      :visible.sync="itemShow"
      :close-on-click-modal="false"
      append-to-body
      width="960px"
      @close="itemClose"
    >
      <div v-loading="selectLoading">
        <el-transfer
          ref="transferItem"
          v-model="selectForm.warehouseId"
          filterable
          :filter-method="filterMethod"
          :titles="['装货仓库', '已选择']"
          :props="{key: 'id', label: 'name'}"
          filter-placeholder="输入搜索"
          :data="warehouseList"
          style="height: 500px;"
        />
        <div
          slot="footer"
          style="text-align: right;margin: 10px 40px 0;"
        >
          <el-button
            size="small"
            @click="itemClose"
          >
            取 消
          </el-button>

          <el-button
            type="primary"
            size="small"
            @click="itemClose"
          >
            确 定
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getBscList,
  getFbastoreList,
  getCabinetList,
  saveDelivery,
  getLscGroupList,
  getWarehouseAllList,
  getAviationList,
  getCountryList,
  getWordsList
} from '@/api/system-in-delivery-plan'
import dayjs from 'dayjs'
import hintModel from '@/views/system-management/delivery-plan/hintModel.vue'
import { getBsTransList } from '@/api/service-with-booking-service'

function formPrama() {
  return {
    airVolume: undefined,
    serviceName: '',
    serviceId: undefined,
    type: '0',
    bscId: undefined,
    bscName: '',
    groupId: undefined,
    bscTransId: undefined,
    countryId: '',
    targets: undefined,
    containerId: undefined,
    quantity: undefined,
    loadLimit: undefined,
    dispatch: [],
    warehouseId: [],
    cutoffDate: undefined,
    shipDate: undefined,
    transTime: undefined,
    fbastoreId: undefined,
    frequency: undefined,
    cycle: undefined,
    unit: 1,
    ifSo: 0,
    remark: undefined // 备注
  }
}
@Component({
  name: '',
  components: {
    hintModel
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    isBook: {
      type: Boolean,
      default: false
    },
    pageType: {
      type: String,
      default: 'product-page'
    }
  }
})
export default class extends Vue {
  /* data */
  private innerVisible: boolean = false
  private loading: boolean = false
  private formLoading: boolean = false
  private selectLoading: boolean = false
  private itemShow: boolean = false
  private selectForm: any = formPrama()
  private tableData: any[] = []
  private countryList: any[] = []
  private flightList: any[] = []
  private cabinetList:any[] = []
  private codeList:any[] = []
  private selectOption:any[] = []
  private warehouseList = []
  private typelist = []
  private groupList = []
  private ss: any = ''
  private dispatchlist = [
    { label: '快递', value: 0 },
    { label: '卡派', value: 1 },
    { label: '自提', value: 2 },
    { label: '整柜直送', value: 3 },
    { label: '到仓', value: 4 }
  ]
  private weekdays: any = [
    { label: '星期一', value: 1 },
    { label: '星期二', value: 2 },
    { label: '星期三', value: 3 },
    { label: '星期四', value: 4 },
    { label: '星期五', value: 5 },
    { label: '星期六', value: 6 },
    { label: '星期日', value: 0 }
  ]
  private formRules = {
    type: { required: true, message: '请选择业务类型', trigger: 'change' },
    bscId: { required: true, message: '请选择订舱服务', trigger: 'change' },
    groupId: { required: true, message: '请选择服务组', trigger: 'change' },
    containerId: { required: true, message: '请选择柜型', trigger: 'change' },
    quantity: { required: true, message: '数量不能为空', trigger: 'blur' },
    loadLimit: { required: true, message: '限重不能为空', trigger: 'blur' },
    airVolume: { required: true, message: '体积不能为空', trigger: 'blur' },
    dispatch: { required: true, message: '请选择派件方式', trigger: 'change' },
    cutoffDate: { required: true, message: '请选择截单日期', trigger: 'change' },
    shipDate: { required: true, message: '请选择起运日期', trigger: 'change' },
    transTime: { required: true, message: '运输时间不能为空', trigger: 'blur' },
    ifSo: { required: true, message: '请选择是否1个SO多条柜', trigger: 'change' },
    frequency: { required: true, message: '创建频率不能为空', trigger: 'blur' },
    cycle: { required: true, message: '周期数量不能为空', trigger: 'blur' },
    serviceName: { required: true, message: '服务商不能为空', trigger: 'blur' },
    fbastoreId: { validator: this.validateData, trigger: 'change' },
    warehouseId: { required: true, message: '请选择装货仓库', trigger: 'change' },
    remark: { required: true, message: '备注不能为空', trigger: 'blur' }
  }
  private weekdays1: any = [
    { label: '星期一', value: 1 },
    { label: '星期二', value: 2 },
    { label: '星期三', value: 3 },
    { label: '星期四', value: 4 },
    { label: '星期五', value: 5 },
    { label: '星期六', value: 6 },
    { label: '星期日', value: 7 }
  ]
  private searchForm: any = {
    shipDay: undefined,
    customDay: undefined,
    orgName: undefined,
    serviceCode: undefined
  }
  private keyType: any = '1'
  private keyWord: any = ''
  private isType: any = ''

  /* computed */
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }
  get formatWeekShip() {
    const val = (this as any).selectForm.shipDate
    if (val) {
      const data = dayjs(val).day()
      const weeks = (this as any).weekdays
      const item = weeks.find((it: any) => it.value === data) || {}
      return item.label
    } else {
      return ''
    }
  }
  get formatWeekCutoff() {
    const val = (this as any).selectForm.cutoffDate
    if (val) {
      const data = dayjs(val).day()
      const weeks = (this as any).weekdays
      const item = weeks.find((it: any) => it.value === data) || {}
      return item.label
    } else {
      return ''
    }
  }
  get dispatchOption() {
    const type = (this as any).selectForm.type
    // TODO
    const arrD = (this as any).selectForm.dispatch
    if (type === '1' || type === '2') {
      return [
        { label: '快递', value: '0', disabled: arrD.some((it: any) => it && it === '3') },
        { label: '卡派', value: '1', disabled: arrD.some((it: any) => it && it === '3') },
        { label: '自提', value: '2', disabled: arrD.some((it: any) => it && it === '3') },
        { label: '到仓', value: '4', disabled: arrD.some((it: any) => it && it === '3') },
        { label: '整柜直送', value: '3', disabled: arrD.some((it: any) => it && it !== '3') }
      ]
    } else {
      return [
        { label: '快递', value: '0' },
        { label: '卡派', value: '1' },
        { label: '自提', value: '2' },
        { label: '到仓', value: '4' }
      ]
    }
  }
  get isFba() {
    const arr = (this as any).selectForm.dispatch || []
    return arr.some((it: any) => it === '3')
  }

  /* methods */
  private validateData(rule: any, value: any, callback: any) {
    const root: any = (this as any).selectForm
    const isTrue = (root.dispatch || []).some((s: any) => s === '3') // 整柜
    if (isTrue && !value) {
      callback(new Error('目的仓不能为空'))
    } else {
      callback()
    }
  }
  private onQuantity() {
    if (this.selectForm.quantity >= 10) {
      this.$confirm('是否需要超过10个', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //
      }).catch(() => {
        //
      })
    }
  }
  private formatType(row: any, column: any, cellValue: any) {
    let result: any = ''
    switch (cellValue) {
      case '1':
        result = '船东'
        break
      case '2':
        result = '空运公司'
        break
      case '3':
        result = '铁路公司'
        break
    }
    return result
  }
  private showServiceLine() {
    if (!this.selectForm.bscId) {
      this.$message.warning('请选择服务')
      return
    }
    this.isType = this.selectForm.type
    const params = {
      page: 1,
      size: 999,
      model: {
        id: this.selectForm.bscId,
        ...this.searchForm
      }
    }
    this.innerVisible = true
    if (this.selectForm.type === '1' || this.selectForm.type === '2') {
      this.$nextTick(() => {
        const root: any = this.$refs.tableSelect
        root.clearSelection()
      })
    }
    this.loading = true
    getBsTransList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.tableData = data.result || []
        const { type, bscTransId } = this.selectForm
        if ((type === '1' || type === '2') && bscTransId) {
          const arr = this.selectForm.bscTransId.split(',')
          arr.map((a: any) => {
            const item = this.tableData.find((it: any) => it.id === a || `${it.id}` === a)
            if (item) {
              this.$nextTick(() => {
                const root: any = this.$refs.tableSelect
                root.toggleRowSelection(item, true)
              })
            }
          })
        }
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private onSearch() {
    if (this.keyType === '1') {
      this.searchForm.serviceCode = this.keyWord
      this.searchForm.orgName = undefined
    } else {
      this.searchForm.serviceCode = undefined
      this.searchForm.orgName = this.keyWord
    }
    this.showServiceLine()
  }
  private rowClick(row: any) {
    if (this.selectForm.type === '1' || this.selectForm.type === '2') return
    this.selectForm.serviceId = row.serviceCode
    this.selectForm.serviceName = row.orgName + '/' + row.serviceCode
    this.selectForm.bscTransId = row.id
    this.resetRow()
  }
  private resetRow() {
    this.searchForm = {
      shipDay: undefined,
      customDay: undefined,
      orgName: undefined,
      serviceCode: undefined
    }
    this.tableData = []
    this.keyType = '1'
    this.keyWord = ''
    this.isType = ''
    this.selectOption = []
    this.innerVisible = false
  }
  private rowSelectChange(arr: any[]) {
    this.selectOption = arr
  }
  private onCancel() {
    this.resetRow()
  }
  private onSave() {
    this.selectForm.serviceId = this.selectOption.map((it: any) => it.serviceCode).join(',')
    this.selectForm.serviceName = this.selectOption.map((it: any) => it.orgName + '/' + it.serviceCode).join(',')
    this.selectForm.bscTransId = this.selectOption.map((it: any) => it.id).join(',')
    this.resetRow()
  }
  private formatDays(row: any, column: any, cellValue: any) {
    const { weekdays1 } = this
    const result = weekdays1.find((item: any) => item.value === cellValue) || {}
    return result.label || ''
  }
  // 获取业务类型
  private getBusinessType() {
    this.formLoading = true
    const params = {
      type: 'BOOKING_BUSINESS_TYPE'
    }
    getWordsList(params).then((res: any) => {
      if (res.success) {
        this.typelist = res.data || []
      }
      this.formLoading = false
    }).catch((err: any) => {
      this.formLoading = false
      return err
    })
  }
  private async getCountryList() {
    this.selectLoading = true
    await getCountryList().then((res: any) => {
      this.selectLoading = false
      if (res.success) {
        const data = res.data || {}
        this.countryList = data.result || []
      }
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }
  private onType() {
    this.flightList = []
    this.selectForm.bscId = undefined
    this.selectForm.cutoffDate = undefined
    this.selectForm.shipDate = undefined
    this.selectForm.ifSo = 0
    this.selectForm.quantity = undefined
    this.selectForm.airVolume = undefined
    this.selectForm.containerId = undefined
    this.selectForm.bscName = ''
    this.selectForm.bscTransId = undefined
    this.selectForm.serviceId = undefined
    this.selectForm.serviceName = undefined
    this.selectForm.countryId = undefined
    this.selectForm.dispatch = []
    if (this.selectForm.type === '0' || this.selectForm.type === '4') {
      this.selectForm.unit = 1
    } else if (this.selectForm.type === '1' || this.selectForm.type === '2') {
      this.selectForm.unit = 2
    }
  }
  private async onFlight() {
    await this.getCountryList()
    this.flightList.map((it: any) => {
      if (this.selectForm.bscId === it.id) {
        this.selectForm.targets = it.countryToId
        this.selectForm.countryId = it.countryToId
        this.selectForm.bscName = it.name
      } else if (!this.selectForm.bscId) {
        this.selectForm.targets = undefined
      }
    })
    this.selectForm.fbastoreId = undefined
    this.selectForm.bscTransId = undefined
    this.selectForm.serviceId = undefined
    this.selectForm.serviceName = undefined
    this.selectForm.groupId = undefined
    this.codeList = []
    this.selectOption = []
  }
  private async getBscList() {
    this.selectLoading = true
    const params:any = {
      page: 1,
      size: 99999,
      conveyance: this.selectForm.type,
      countryToId: this.selectForm.countryId
    }
    await getBscList(params)
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result
        this.flightList = result.map((item: any) => {
          item.id = item.id + ''
          return item
        })
        this.selectLoading = false
      }).catch((err: any) => {
        this.selectLoading = false
        return [err, null]
      })
  }
  private async getGroupData() {
    this.selectLoading = true
    const params = {
      model: {
        status: 1,
        countryId: this.selectForm.countryId,
        subtypeId: this.selectForm.type
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
  private async getFbastoreList() {
    this.selectLoading = true
    const params:any = {
      countryId: this.selectForm.targets,
      codeSort: 'A',
      page: 1,
      size: 99999
    }
    await getFbastoreList(params)
      .then((res: any) => {
        const data = res.data || {}
        const codeList = data.result || []
        this.codeList = codeList.map((item: any) => {
          item.fellName = item.code + (item.postal ? '-' + item.postal : '') + (item.stateName ? '-' + item.stateName : '')
          return item
        })
        this.selectLoading = false
      }).catch((err: any) => {
        this.selectLoading = false
        return [err, null]
      })
  }
  private async getVehicleTypeList() {
    this.selectLoading = true
    const params:any = {
      page: 1,
      size: 99999
    }
    await getCabinetList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.cabinetList = (data.result || []).map((it: any) => {
          return {
            id: it.id + '',
            name: it.name
          }
        })
        this.selectLoading = false
      }).catch((err: any) => {
        this.selectLoading = false
        return [err, null]
      })
  }
  private async getCabinetList() {
    this.selectLoading = true
    const params:any = {
      page: 1,
      size: 99999
    }
    await getCabinetList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.cabinetList = (data.result || []).map((it: any) => {
          return {
            id: it.id + '',
            name: it.name
          }
        })
        this.selectLoading = false
      }).catch((err: any) => {
        this.selectLoading = false
        return [err, null]
      })
  }

  private aviationChange(val: any) {
    const aviation = this.cabinetList.find((e: any) => e.id === this.selectForm.containerId)
    if (aviation) {
      this.selectForm.airVolume = aviation.volume
    } else {
      this.selectForm.airVolume = undefined
    }
  }
  private async getAviationList() {
    this.selectLoading = true
    const params:any = {
      model: {},
      page: 1,
      size: 99999
    }
    await getAviationList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.cabinetList = (data.result || []).map((it: any) => {
          return {
            id: it.id + '',
            name: it.name,
            volume: it.volume
          }
        })
        this.selectLoading = false
      }).catch((err: any) => {
        this.selectLoading = false
        return [err, null]
      })
  }
  private getWarehouseList() {
    this.selectLoading = true
    getWarehouseAllList()
      .then((res: any) => {
        const data = res.data || []
        // this.warehouseList = data
        this.warehouseList = data.filter((it: any) => it.countryId === 'CN')
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private filterMethod(query: any, item: any): boolean {
    const name = item.name || ''
    return name.indexOf(query) > -1
  }
  private handleItem() {
    this.itemShow = true
    this.warehouseList = []
    this.getWarehouseList()
  }
  private itemClose() {
    this.itemShow = false
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
  }

  private async setData(row: any) {
    const { dispatch, list, ...obj } = row
    this.selectForm = {
      ...obj,
      dispatch: (`${dispatch}` || '').split(','),
      warehouseId: (list || []).map((it: any) => it.warehouseId)
    }
    try {
      this.formLoading = true
      await this.getBscList()
      const flight: any = this.flightList.find((it: any) => this.selectForm.bscId === it.id) || {}
      this.selectForm.countryId = flight.countryToId
      this.selectForm.targets = flight.countryToId
      this.selectForm.bscName = flight.name
      await Promise.all([this.getCountryList(), this.getFbastoreList(), this.getGroupData()])
      if (this.selectForm.type === '0') {
        await this.getAviationList()
      } else if (this.selectForm.type === '1' || this.selectForm.type === '2') {
        await this.getCabinetList()
      } else if (this.selectForm.type === '3') {
        await this.getVehicleTypeList()
      }
      this.formLoading = false
    } catch (error) {
      this.formLoading = false
      return error
    }
  }
  private resetForm() {
    this.selectForm = formPrama()
  }
  private cancel() {
    this.$emit('cancel')
  }
  private save(params: any) {
    this.formLoading = true
    saveDelivery(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.formLoading = false
        this.$emit('cancel')
        this.$emit('queryAll')
      })
      .catch((err: any) => {
        this.formLoading = false
        return err
      })
  }
  private saveByCancel(params: any) {
    this.save(params)
  }
  private saveByNow(params: any, radio: any) {
    const data = { ...params, isNow: 1 }
    if (radio === '2') {
      data.isNow = 0
    }
    this.save(data)
  }
  private saveConfirm() {
    const formDom:any = this.$refs.selectForm
    formDom.validate((valid:any) => {
      if (!valid) return false
      const { dispatch, warehouseId, ...form } = this.selectForm
      if (warehouseId.length <= 0) {
        this.$message.error('请选择装货仓库')
        return
      }
      const arr: any[] = []
      warehouseId.map((w: any) => {
        const item: any = this.warehouseList.find((it: any) => it.id === w)
        if (item) {
          arr.push({
            warehouseId: w,
            warehouseName: item.name
          })
        }
      })
      const params: any = {
        ...form,
        enable: 0, // 默认启用
        dispatch: (dispatch || []).join(','),
        list: arr
      }
      this.groupList.map((it: any) => {
        if (this.selectForm.groupId === it.id) {
          params.productId = it.productId
          params.productName = it.productName
        }
      })
      this.cabinetList.map((it: any) => {
        if (this.selectForm.containerId === it.id) {
          params.containerName = it.name
        }
      })
      this.countryList.map((it: any) => {
        if (this.selectForm.countryId === it.id) {
          params.countryName = it.name
        }
      })
      this.flightList.map((it: any) => {
        if (this.selectForm.bscId === it.id) {
          params.bscName = it.name
        }
      })
      this.codeList.map((it: any) => {
        if (this.selectForm.fbastoreId === it.id) {
          params.fbastoreName = it.code
        }
      })
      if ((this as any).pageType === 'product-template-page') {
        if (!(this as any).isEdit) {
          const hint: any = this.$refs.hintModel
          params.source = 0
          params.isNow = 0
          hint.show(params)
        } else {
          this.save(params)
        }
      } else {
        if (!(this as any).isEdit) {
          params.source = 1
          params.isNow = 1
          params.status = 0
        }
        this.save(params)
      }
    })
  }
  private created() {
    this.getBusinessType()
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  display: inline-block;
  width: 49%;
}
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
.input-content {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.input-unit {
  width: 70px;
  height: 32px;
  background-color: #f5f7fa;
  color: #909399;
  padding: 0 10px;
  border: 1px solid #dcdfe6;
  border-left: 0;
  border-radius: 0 4px 4px 0;
  margin-left: -1px;
}
.input-select {
  width: 70px;
  height: 32px;
  background-color: #f5f7fa;
  color: #909399;
  border: 1px solid #dcdfe6;
  border-left: 0;
  border-radius: 0 4px 4px 0;
  margin-left: -1px;
}
.select-unit {
  width: 70px;
  ::v-deep .el-input__inner {
    border: none;
    background-color: transparent;
    padding: 0 10px;
  }
}
.input-border {
  ::v-deep .el-input__inner {
    border-radius: 4px 0 0 4px;
  }
}

.upload-library {
  display: flex;
  .el-upload {
    width: 86px;
  }
  ::v-deep .el-button {
    padding: 9px 10px;
  }
  ::v-deep .el-upload-list {
    display: inline-block;
    flex: 1;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  ::v-deep .el-upload-list__item:first-child {
    margin-top: 5px;
  }
  ::v-deep .el-upload-list__item-name {
    margin-right: 30px;
  }
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
::v-deep .el-dialog__body {
  padding: 10px 20px;
}
</style>
