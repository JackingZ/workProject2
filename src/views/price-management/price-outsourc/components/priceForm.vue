<template>
  <div
    v-loading="loading"
    class="price-form"
  >
    <div
      v-if="show"
      class="price-form-content"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="mini"
        :inline="true"
        label-width="90px"
      >
        <el-row>
          <el-col :span="20">
            <el-form-item
              label="业务类型"
              prop="subtypeId"
            >
              <el-select
                v-model="form.subtypeId"
                size="mini"
                clearable
                filterable
                :disabled="formType !== 'add'"
                :loading="selectLoading"
                placeholder="业务类型"
                style="width: 140px"
                @focus="getSubtypeList"
                @change="subtypeChange"
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
              prop="lscId"
              label-width="75px"
            >
              <span slot="label">服务</span>
              <el-tooltip
                v-show="form.lscId"
                slot="label"
                :content="form.lscName + '/' + form.lscCode"
                placement="top"
                effect="light"
              >
                <i class="el-icon-warning-outline" />
              </el-tooltip>
              <el-popover
                placement="bottom-start"
                trigger="click"
              >
                <el-row style="width: 300px">
                  <el-col :span="24">
                    <el-form-item
                      label="目的国"
                      label-width="90px"
                    >
                      <el-select
                        v-model="form.countryId"
                        :loading="selectLoading"
                        size="mini"
                        clearable
                        :disabled="formType !== 'add'"
                        filterable
                        placeholder="请选择"
                        style="width: 200px;"
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
                  </el-col>
                  <el-col :span="24">
                    <el-form-item
                      label="派送方式"
                      label-width="90px"
                    >
                      <el-select
                        v-model="form.dispatch"
                        :loading="selectLoading"
                        size="mini"
                        clearable
                        :disabled="formType !== 'add'"
                        filterable
                        placeholder="请选择"
                        style="width: 200px;"
                      >
                        <el-option
                          label="卡派"
                          value="0"
                        />
                        <el-option
                          label="快递"
                          value="1"
                        />
                        <el-option
                          label="自提"
                          value="2"
                        />
                        <el-option
                          v-if="form.subtypeId === '1' || form.subtypeId === '2'"
                          label="整柜直送"
                          value="3"
                        />
                        <el-option
                          label="到仓"
                          value="4"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item
                      label="目的港关税"
                      label-width="90px"
                    >
                      <el-select
                        v-model="form.includeTax"
                        :loading="selectLoading"
                        size="mini"
                        clearable
                        :disabled="formType !== 'add'"
                        filterable
                        placeholder="请选择"
                        style="width: 200px;"
                      >
                        <el-option
                          label="包税"
                          :value="true"
                        />
                        <el-option
                          label="不包税"
                          :value="false"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item
                      label="服务"
                      label-width="90px"
                    >
                      <el-select
                        v-model="form.lscId"
                        :loading="selectLoading"
                        :disabled="!form.subtypeId || formType !== 'add'"
                        style="width:200px;"
                        clearable
                        filterable
                        placeholder="请选择"
                        @focus="getServiceList"
                        @change="serviceChange"
                      >
                        <el-option
                          v-for="item in serviceList"
                          :key="item.id"
                          :label="item.label"
                          :value="item.id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <div
                  slot="reference"
                  class="el-select el-select--small"
                  style="width: 100%;"
                >
                  <el-input
                    v-model="form.lscName"
                    placeholder="服务"
                    readonly
                    style="width: 140px"
                    suffix-icon="el-select__caret el-input__icon el-icon-arrow-up"
                  />
                </div>
              </el-popover>
            </el-form-item>
            <el-form-item
              label="供应商"
              prop="supplierId"
            >
              <el-select
                v-model="form.supplierId"
                size="mini"
                clearable
                :loading="selectLoading"
                filterable
                :disabled="!(form.subtypeId && form.lscId) || formType !== 'add'"
                placeholder="供应商"
                style="width: 140px"
                @focus="getSupplierListByType"
              >
                <el-option
                  v-for="item in supplierList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="userInfo.custType === '0'"
              label="所属公司"
              prop="agentId"
            >
              <el-select
                v-model="form.agentId"
                size="mini"
                clearable
                filterable
                :disabled="formType !== 'add'"
                :loading="selectLoading"
                placeholder="所属公司"
                style="width: 140px"
                @focus="getAgentList"
                @change="agentChange"
              >
                <el-option
                  v-for="item in agentlist"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            :span="4"
            style="text-align: right"
          >
            <div v-if="['add', 'edit'].includes(formType)">
              <el-button
                type="text"
                size="small"
                @click="cancel"
              >
                取消
              </el-button>
              <el-button
                v-permission="['priceOutsourcAdd', 'priceOutsourcEdit']"
                type="text"
                size="small"
                @click="savePrice"
              >
                保存
              </el-button>
            </div>
            <div v-if="formType === 'view'">
              <el-button
                type="text"
                size="small"
                @click="goBack"
              >
                返回
              </el-button>
              <el-button
                v-if="[1, 3].includes(priceDetail.audit) && $checkPermission(['priceOutsourcEdit'])"
                type="text"
                size="small"
                @click="edit"
              >
                编辑
              </el-button>
              <el-button
                v-if="priceDetail.audit === 1 && formType === 'view' && $checkPermission(['priceOutsourcAudit'])"
                type="text"
                size="small"
                @click="audit(2)"
              >
                审核
              </el-button>
              <el-button
                v-if="[1, 3].includes(priceDetail.audit) && $checkPermission(['priceOutsourcDel'])"
                type="text"
                size="small"
                @click="deletePrice"
              >
                删除
              </el-button>
              <el-button
                v-if="priceDetail.audit === 2 && formType === 'view' && $checkPermission(['priceOutsourcAudit'])"
                type="text"
                size="small"
                @click="audit(4)"
              >
                审核通过
              </el-button>
              <el-button
                v-if="priceDetail.audit === 2 && formType === 'view' && $checkPermission(['priceOutsourcAudit'])"
                type="text"
                size="small"
                @click="audit(3)"
              >
                审核拒绝
              </el-button>
              <el-button
                v-permission="['priceOutsourcCopy']"
                type="text"
                size="small"
                @click="copyPrice"
              >
                复制此版本
              </el-button>
              <el-button
                v-if="priceDetail.status === 2 && formType === 'view' && $checkPermission(['priceOutsourcInvalid'])"
                type="text"
                size="small"
                @click="invalidPrice"
              >
                失效
              </el-button>
            </div>
          </el-col>
        </el-row>
        <div
          v-if="form.lscId"
          class="service-info"
        >
          <div class="info-item">
            <span class="label">目的港：</span>
            <span class="value">{{ selectService.departureName }}</span>
          </div>
          <div
            v-if="selectService.subtypeId === '1' || selectService.subtypeId === '2'"
            class="info-item"
          >
            <span class="label">整柜/拼箱：</span>
            <span v-if="selectService.containerType === '1'">
              整柜
            </span>
            <span v-if="selectService.containerType === '0'">
              拼箱
            </span>
          </div>
          <div class="info-item">
            <span class="label">目的港关税：</span>
            <span v-if="selectService.includeTax">
              包税
            </span>
            <span v-if="!selectService.includeTax">
              不包税
            </span>
          </div>
          <div class="info-item">
            <span class="label">目的港派送方式：</span>
            <span v-if="selectService.dispatch === '0'">
              卡派
            </span>
            <span v-if="selectService.dispatch === '1'">
              快递
            </span>
            <span v-if="selectService.dispatch === '2'">
              自提
            </span>
            <span v-if="selectService.dispatch === '3'">
              整柜直送
            </span>
            <span v-if="selectService.dispatch === '4'">
              到仓
            </span>
          </div>
          <div class="info-item">
            <span class="label">重量单位：</span>
            <span v-if="selectService.umWeight === 'T'">
              T-吨
            </span>
            <span v-if="selectService.umWeight === 'LBS'">
              LB-磅
            </span>
            <span v-if="selectService.umWeight === 'KGS'">
              KG-公斤
            </span>
            <span v-if="selectService.umWeight === 'OZS'">
              OZ-盎
            </span>
          </div>
          <div class="info-item">
            <span class="label">长度单位：</span>
            <span v-if="selectService.umLength === 'FT'">
              FT-英尺
            </span>
            <span v-if="selectService.umLength === 'M'">
              M-米
            </span>
            <span v-if="selectService.umLength === 'CM'">
              CM-厘米
            </span>
          </div>
          <div class="info-item">
            <span class="label">体积单位：</span>
            <span v-if="selectService.umVolume === 'CBM'">
              CBM-立方米
            </span>
            <span v-if="selectService.umVolume === 'CBCM'">
              CBCM-立方厘米
            </span>
          </div>
          <div
            v-if="selectService.currencyId"
            class="info-item"
          >
            <span class="label">货币单位：</span>
            <span class="value">{{ selectService.currencyId + '-' + selectService.currencyName }}</span>
          </div>
          <div class="info-item">
            <span class="label">计费方式：</span>
            <span v-if="selectService.priceType === '2'">
              按重量
            </span>
            <span v-if="selectService.priceType === '3'">
              按体积
            </span>
            <span v-if="selectService.priceType === '4'">
              按整柜
            </span>
          </div>
          <template v-if="chargeForm.type === '0'">
            <div class="info-item">
              <span v-show="chargeForm.algorithm === '0'">取实重</span>
              <span v-show="chargeForm.algorithm === '2'">取实重或体积重的平均值</span>
              <span v-show="chargeForm.algorithm === '1'">取实重或体积重的最大值</span>
              <span v-show="chargeForm.algorithm === '1'"> | </span>
              <span v-show="chargeForm.algorithm === '1' && chargeForm.multiWeight === '0'">先累加后比较</span>
              <span v-show="chargeForm.algorithm === '1' && chargeForm.multiWeight === '1'">先比较后累加</span>
            </div>
            <div class="info-item">
              <span class="label">计量误差率(%)：</span>
              <span class="value">{{ chargeForm.deviation }}</span>
            </div>
            <div
              v-if="chargeForm.algorithm === '1'"
              class="info-item"
            >
              <span class="label">分泡比率(%)：</span>
              <span class="value">{{ chargeForm.bulky }}</span>
            </div>
            <div
              v-if="chargeForm.algorithm === '1'"
              class="info-item"
            >
              <span class="label">分泡条件：</span>
              <span class="value">{{ chargeForm.fenestration }}</span>
            </div>
            <div class="info-item">
              <span class="label">单箱重量：</span>
              <span class="value">{{ chargeForm.sbmc }}</span>
            </div>
            <div class="info-item">
              <span class="label">单票重量：</span>
              <span class="value">{{ chargeForm.simc }}</span>
            </div>
          </template>
          <template v-if="chargeForm.type === '1'">
            <div class="info-item">
              <span class="label">计量误差率(%)：</span>
              <span class="value">{{ chargeForm.deviation }}</span>
            </div>
            <div class="info-item">
              <span class="label">体积密度：</span>
              <span class="value">{{ chargeForm.density }}</span>
            </div>
          </template>
        </div>
        <el-row>
          <el-col :span="20">
            <el-form-item
              label="交货区域"
              prop="areaId"
            >
              <el-select
                v-model="form.areaId"
                size="mini"
                clearable
                filterable
                :disabled="formType === 'view'"
                multiple
                collapse-tags
                placeholder="交货区域"
                style="width: 140px"
              >
                <el-option
                  v-for="item in deliveryAreaList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="selectService.priceType !== '4'"
              prop="measureId"
              label-width="100px"
            >
              <span slot="label">计费配置</span>
              <el-tooltip
                v-show="form.measureId"
                slot="label"
                :content="form.measureName"
                placement="top"
                effect="light"
              >
                <i class="el-icon-warning-outline" />
              </el-tooltip>
              <el-select
                v-model="form.measureId"
                size="mini"
                :loading="selectLoading"
                clearable
                filterable
                :disabled="!form.agentId || !form.lscId || formType === 'view'"
                placeholder="计费配置"
                style="width: 140px"
                @focus="getChargeList"
                @change="chargeChange"
              >
                <el-option
                  v-for="item in chargeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="有效时间"
              prop="times"
            >
              <el-date-picker
                v-model="form.times"
                :clearable="false"
                :picker-options="pickerOptions"
                :default-time="['00:00:00', '23:59:59']"
                unlink-panels
                :disabled="formType === 'view'"
                type="datetimerange"
                align="left"
                size="mini"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="~"
                style="width: 280px"
                start-placeholder="起始时间"
                end-placeholder="截止时间"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="4"
            style="text-align: right"
          >
            <el-select
              v-if="formType === 'view'"
              v-model="historyPriceId"
              clearable
              filterable
              placeholder="历史版本"
              style="width: 150px;"
              size="mini"
              @focus="getHistoryList"
              @change="historyChange"
            >
              <el-option
                v-for="(item, index) in historyList"
                :key="index"
                :label="item.startTime + '-' + item.endTime"
                :value="item.id"
              />
            </el-select>
            <el-popover
              v-if="formType !== 'view' && aAxisData.length"
              v-model="batchShow"
              placement="bottom"
              trigger="click"
              @show="onOpen"
              @hide="onClose"
            >
              <div style="padding:0 20px 0 10px;width: 240px;">
                <div>请输入需要批量修改的值</div>
                <el-input-number
                  v-model="batchNum"
                  class="input-number-valiate"
                  :controls="false"
                  placeholder="请输入"
                  :precision="2"
                  size="mini"
                  style="margin: 13px 0 26px 0"
                  @focus.stop="() => {}"
                />
                <div
                  slot="footer"
                  style="display: flex;justify-content: space-between"
                >
                  <el-button
                    type="text"
                    size="mini"
                    style="color: #FF6D00"
                    @click="batchConfirm(0)"
                  >
                    重置
                  </el-button>
                  <div style="text-align: right;">
                    <el-button
                      type="text"
                      size="mini"
                      style="color: #999999"
                      @click="batchShow = false"
                    >
                      取消
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      @click="batchConfirm(1)"
                    >
                      保存
                    </el-button>
                  </div>
                </div>
              </div>
              <el-button
                slot="reference"
                type="text"
                size="mini"
              >
                批量修改
              </el-button>
            </el-popover>
          </el-col>
        </el-row>
      </el-form>
      <div style="height: calc(100vh - 355px)">
        <vxe-table
          v-if="aAxisData.length"
          ref="priceTable"
          border
          row-key
          height="auto"
          :data="tableData"
          size="small"
          style="width: 100%;"
          :auto-resize="true"
        >
          <vxe-table-column width="50">
            <template #default>
              <span class="drag-btn">
                <i class="vxe-icon--menu" />
              </span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            :show-overflow="true"
            :show-header-overflow="true"
            width="200"
            :resizable="true"
          >
            <template slot="header">
              <span class="header-row">{{ tableYTitle }}</span>
              <span>&nbsp;&nbsp;\&nbsp;&nbsp;</span>
              <span class="header-column">{{ tableXTitle }}</span>
            </template>
            <template slot-scope="scope">
              {{ scope.row.value }}
            </template>
          </vxe-table-column>
          <vxe-table-column
            v-if="isShowRegionalDetailCol"
            :show-overflow="true"
            :show-header-overflow="true"
            width="200"
            :resizable="true"
            title="区域详情"
            field="regionalDetails"
          />
          <vxe-table-column
            v-for="(item,index) in aAxisData"
            :key="index"
            :title="item.label"
            :show-overflow="true"
            :resizable="true"
          >
            <template slot-scope="scope">
              <div>
                <el-input-number
                  v-if="isEditRow"
                  v-model="scope.row[item.value]"
                  class="input-number-valiate"
                  size="small"
                  :controls="false"
                  placeholder="请输入"
                  :min="0"
                  :max="999999"
                  :precision="2"
                />
                <span v-else>{{ scope.row[item.value] }}</span>
              </div>
            </template>
          </vxe-table-column>
          <vxe-table-column
            min-width="100"
            title="参考时效(天)"
            :show-overflow="true"
            :resizable="true"
          >
            <template slot-scope="scope">
              <el-input
                v-if="isEditRow"
                v-model="scope.row.prescription"
                placeholder="请填写例:1-2或1至2或1到2"
                size="small"
              />
              <span v-else>{{ scope.row.prescription }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            min-width="120"
            title="备注"
            :show-overflow="true"
            :resizable="true"
          >
            <template slot-scope="scope">
              <el-input
                v-if="isEditRow"
                v-model="scope.row.remark"
                placeholder="请输入"
                :maxlength="100"
                size="small"
              />
              <span v-else>{{ scope.row.remark }}</span>
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import dayjs from 'dayjs'
import {
  getSubtypeByType,
  getCountryList,
  getLscList,
  getSupplierListByType,
  getAgentList,
  getChargeList,
  getPriceConfig,
  groupByPid,
  savePrice,
  getPriceById,
  editPrice,
  auditPrice,
  deletePriceById,
  invalidPrice,
  getHistoryList
} from '@/api/price-to-outsourc'
import Sortablejs from 'sortablejs'

@Component({
  name: '',
  components: {},
  props: {
    deliveryAreaList: {
      type: Array,
      default: () => ([])
    }
  }
})
export default class extends Vue {
  /* data */
  private show: boolean = false
  private batchShow: boolean = false
  private formType: string = 'add'
  private isEditRow: boolean = true
  private loading: boolean = false
  private selectLoading: boolean = false
  private isShowRegionalDetailCol: boolean = false
  private form: any = {
    supplierId: '',
    subtypeId: '',
    lscId: '',
    lscName: '',
    lscCode: '',
    countryId: '',
    dispatch: '',
    includeTax: '',
    agentId: '',
    agentName: '',
    areaId: [],
    measureId: '',
    measureName: '',
    times: []
  }
  private rules: any = {
    supplierId: [{ required: true, message: '请选择供应商', trigger: 'change' }],
    agentId: [{ required: true, message: '请选择所属公司', trigger: 'change' }],
    subtypeId: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
    areaId: [{ required: true, message: '请选择交货区域', trigger: 'change' }],
    times: [{ required: true, message: '请选择有效时间', trigger: 'change' }],
    measureId: [{ required: true, message: '请选择计费配置', trigger: 'change' }],
    lscId: [{ required: true, message: '请选择服务', trigger: 'change' }]
  }
  private selectService: any = {}
  private chargeForm: any = {}
  private priceDetail: any = {}
  private showPriceId: any = ''
  private historyPriceId: any = ''
  private typeList: any[] = []
  private countryList: any[] = []
  private serviceList: any[] = []
  private supplierList: any[] = []
  private agentlist: any[] = []
  private chargeList: any[] = []
  private aAxisData: any[] = []
  private tableData: any[] = []
  private historyList: any[] = []
  private tableYTitle: string = ''
  private tableXTitle: string = ''
  private batchNum: any = ''
  /* computed */
  get userInfo(): any {
    return UserModule.info || {}
  }
  get pickerOptions() {
    return {
      disabledDate(time: any) {
        return dayjs(time) < dayjs().subtract(1, 'd')
      },
      selectableRange: '00:00:00 - 20:30:00'
    }
  }
  /* methods */
  private onOpen() {
    this.batchNum = ''
  }
  private onClose() {
    this.batchNum = ''
  }
  private batchConfirm(type: any) {
    // 0为重置
    if (this.batchNum && this.batchNum !== 0) {
      const batchNum = type === 0 ? -this.batchNum : this.batchNum
      this.tableData = this.tableData.map((r: any) => {
        this.aAxisData.forEach((p: any) => {
          r[p.value] = parseFloat(((r[p.value] || 0) + batchNum).toFixed(2))
        })
        return r
      })
    } else {
      if (this.formType === 'add') {
        this.getPriceConfig()
      }
      if (this.formType === 'edit') {
        this.getPriceById(this.showPriceId, false)
      }
    }
  }
  private historyChange() {
    this.formType = 'view'
    this.getPriceById(this.historyPriceId || this.showPriceId, false)
  }
  private getHistoryList() {
    const params = {
      id: this.showPriceId
    }
    this.historyList = []
    this.selectLoading = true
    getHistoryList(params).then((res: any) => {
      this.selectLoading = false
      this.historyList = res.data || []
    }).catch(() => {
      this.selectLoading = false
    })
  }
  private invalidPrice() {
    this.$confirm('请确认是否失效该报价?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        const params = {
          id: this.priceDetail.id
        }
        invalidPrice(params).then((res: any) => {
          this.$message.success('操作成功')
          this.resetForm()
          this.show = false
          this.$emit('delete')
        }).catch((err: any) => {
          return err
        })
      })
      .catch(() => {
        return false
      })
  }
  private deletePrice() {
    this.$confirm('请确认是否删除该报价?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        const params = {
          id: this.priceDetail.id
        }
        deletePriceById(params).then((res: any) => {
          this.$message.success('删除成功')
          this.resetForm()
          this.show = false
          this.$emit('delete')
        }).catch((err: any) => {
          return err
        })
      })
      .catch(() => {
        return false
      })
  }
  private audit(audit: any) {
    const params = {
      audit,
      id: this.priceDetail.id
    }
    this.loading = true
    auditPrice(params).then(() => {
      this.loading = false
      this.$message.success('操作成功')
      this.$emit('save', this.priceDetail.id)
    }).catch(() => {
      this.loading = false
    })
  }
  private showForm(id: any, isCopy: boolean) {
    this.historyPriceId = ''
    this.resetForm()
    if (isCopy) {
      this.formType = 'add'
      this.isEditRow = true
      this.showPriceId = ''
    } else {
      this.showPriceId = id
      this.formType = 'view'
      this.isEditRow = false
    }
    this.show = true
    this.getPriceById(id, isCopy)
  }
  private getPriceById(id: any, isCopy: boolean) {
    this.loading = true
    const params = {
      id
    }
    getPriceById(params).then(async(res: any) => {
      const data = res.data || {}
      this.getPriceRow(data)
      this.form = {
        supplierId: data.fromCustId,
        subtypeId: (data.subtype || {}).key,
        lscId: (data.lsc || {}).key,
        lscName: (data.lsc || {}).value,
        lscCode: '',
        countryId: '',
        dispatch: '',
        includeTax: '',
        agentId: data.toCustId,
        agentName: data.toCustName,
        areaId: (data.deliveries || []).map((e: any) => e.key),
        measureId: (data.billing || {}).key,
        measureName: (data.billing || {}).value,
        times: []
      }
      if (!isCopy) {
        this.priceDetail = data
        this.form.times = [data.startTime, data.endTime]
      }
      if (this.userInfo.custType === '0') {
        this.getAgentList()
      }
      this.getSubtypeList()
      await this.getServiceList()
      const service = this.serviceList.find((e: any) => e.id === this.form.lscId) || {}
      this.form.lscName = service.label || ''
      this.form.lscCode = service.lsId || ''
      this.form.includeTax = service.includeTax
      this.form.dispatch = service.dispatch || ''
      this.selectService = service
      await this.getChargeList()
      this.chargeForm = this.chargeList.find((e: any) => e.id === this.form.measureId) || {}
      this.getSupplierListByType()
      this.loading = false
    }).catch(() => {
      this.loading = false
    })
  }
  private getPriceRow(config: any) {
    const ytype = config.ytype
    const xtype = config.xtype
    const objLeft: any = {
      '0': '国家',
      '1': '州省',
      '5': '国内区域',
      '7': '仓库代码',
      '100': '城市区域',
      '101': '仓库区域',
      '102': '国家区域'
    }
    const objRight: any = {
      '0': '重量区间',
      '1': '体积区间',
      '2': '柜型'
    }
    this.tableYTitle = objLeft[ytype]
    this.tableXTitle = objRight[xtype]
    const rows = config.rows || []
    const row = rows[0] || {}
    const priceXList = row.prices || []
    this.aAxisData = priceXList.map((p: any, i: number) => {
      const obj: any = {
        label: '',
        value: '',
        xId: config.axisIdX,
        xtype
      }
      if (xtype === '2') {
        obj.label = p.cellName
        obj.value = p.cellValue
      } else {
        obj.label = `${p.min}-${p.max}`
        obj.value = 'price_' + i
      }
      return obj
    })
    let groupParams: any = {
      ids: []
    }
    if (ytype === '5') {
      groupParams.type = 1
    }
    this.tableData = rows.map((r: any) => {
      if (groupParams.ids.indexOf(r.address.key) === -1) {
        groupParams.ids.push(r.address.key)
      }
      const data = {
        ...r.address,
        remark: r.remark,
        prescription: r.prescription,
        yType: ytype,
        yId: config.axisIdY
      }
      const prices = r.prices || []
      prices.forEach((p: any, i: number) => {
        if (xtype === '2') {
          data[p.cellValue] = p.price
        } else {
          data['price_' + i] = p.price
        }
      })
      return data
    })
    const typeList = ['5', '100', '101', '102']
    if (typeList.indexOf(ytype) === -1) {
      this.isShowRegionalDetailCol = false
      groupParams = null
    } else {
      this.isShowRegionalDetailCol = true
      this.groupByPid(groupParams, ytype)
    }
  }
  private edit() {
    this.formType = 'edit'
    this.isEditRow = true
    this.setSort()
  }
  private copyPrice() {
    this.formType = 'add'
    this.isEditRow = true
    this.getPriceById(this.historyPriceId || this.showPriceId, true)
    this.showPriceId = ''
    this.historyPriceId = ''
  }
  private goBack() {
    this.resetForm()
    this.showPriceId = ''
    this.historyPriceId = ''
    this.show = false
    this.$emit('cancel')
  }
  private cancel() {
    this.resetForm()
    if (this.formType === 'add') {
      this.showPriceId = ''
      this.historyPriceId = ''
      this.show = false
      this.$emit('cancel')
    } else {
      this.isEditRow = false
      this.formType = 'view'
      this.getPriceById(this.showPriceId, false)
    }
  }
  private resetForm() {
    this.form = {
      supplierId: '',
      subtypeId: '',
      lscId: '',
      lscName: '',
      lscCode: '',
      countryId: '',
      dispatch: '',
      includeTax: '',
      agentId: '',
      agentName: '',
      areaId: [],
      measureId: '',
      measureName: '',
      times: []
    }
    this.selectService = {}
    this.priceDetail = {}
    this.chargeForm = {}
    this.tableYTitle = ''
    this.tableXTitle = ''
    this.aAxisData = []
    this.tableData = []
    this.$nextTick(() => {
      const formRef: any = this.$refs.form
      formRef && formRef.clearValidate()
    })
  }
  private add() {
    this.formType = 'add'
    this.resetForm()
    this.show = true
    this.isEditRow = true
    if (this.userInfo.custType === '2') {
      this.form.agentId = this.userInfo.custId
      this.form.agentName = this.userInfo.custName
    }
  }
  private validatePriceRow() {
    let flag = this.tableData.some((e: any) => this.aAxisData.some((x: any) => e[x.value]))
    if (!flag) {
      this.$message.warning('请至少填写一条报价')
      return false
    }
    const reg = /^\d+[-|至|到]\d+$/
    for (let i = 0; i < this.tableData.length; i++) {
      const price = this.tableData[i]
      if (this.aAxisData.some((x: any) => price[x.value])) {
        if (!price.prescription) {
          this.$message.error('第' + (i + 1) + '行参考时效不能为空，请填写如(1-2或1至2或1到2)')
          flag = false
          break
        }
        if (!reg.test(price.prescription)) {
          this.$message.error('第' + (i + 1) + '行参考时效格式不正确，请填写如(1-2或1至2或1到2)')
          flag = false
          break
        }
      }
    }
    return flag
  }
  private savePrice() {
    const formRef: any = this.$refs.form
    formRef.validate((valid: any) => {
      if (valid && this.validatePriceRow()) {
        const supplier = this.supplierList.find((e: any) => e.id === this.form.supplierId) || {}
        const fromCust = {
          fromCustType: '3',
          fromCustSubtype: '',
          fromCustId: this.form.supplierId,
          fromCustName: supplier.name
        }
        const toCust = {
          toCustType: '2',
          toCustSubtype: '1',
          toCustId: this.form.agentId,
          toCustName: this.form.agentName
        }
        const params: any = {
          ...fromCust,
          ...toCust,
          subtype: {
            key: this.selectService.subtypeId,
            value: this.selectService.subtypeName
          },
          containerType: this.selectService.containerType,
          lsc: {
            key: this.selectService.id,
            value: this.selectService.name // label
          },
          umWeight: this.selectService.umWeight,
          umLength: this.selectService.umLength,
          umVolume: this.selectService.umVolume,
          currency: {
            key: this.selectService.currencyId,
            value: this.selectService.currencyName
          },
          purposeType: this.selectService.purposeType,
          dispatch: this.selectService.dispatch,
          includeTax: this.selectService.includeTax,
          priceType: this.selectService.priceType,
          deliveries: this.form.areaId.map((e: any) => {
            const tamp = (this as any).deliveryAreaList.find((d: any) => d.id === e) || {}
            return {
              key: e,
              value: tamp.name
            }
          }),
          ytype: (this.tableData[0] || {}).yType,
          xtype: (this.aAxisData[0] || {}).xtype,
          axisIdY: (this.tableData[0] || {}).yId,
          axisIdX: (this.aAxisData[0] || {}).xId,
          rows: this.tableData.map((t: any) => {
            return {
              address: {
                key: t.key,
                value: t.value
              },
              prescription: t.prescription,
              remark: t.remark,
              prices: this.aAxisData.map((e: any) => {
                const price = {
                  cellName: '',
                  cellValue: '',
                  max: '',
                  min: '',
                  price: t[e.value] || ''
                }
                if (e.xtype === '2') {
                  price.cellName = e.label
                  price.cellValue = e.value
                } else {
                  price.max = e.label.split('-')[1]
                  price.min = e.label.split('-')[0]
                }
                return price
              })
            }
          }),
          billing: {
            key: this.form.measureId,
            value: this.form.measureName
          },
          startTime: dayjs(this.form.times[0]).format('YYYY-MM-DD HH:mm:ss'),
          endTime: dayjs(this.form.times[1]).format('YYYY-MM-DD HH:mm:ss')
        }
        // console.log(params)
        this.loading = true
        if (this.formType === 'edit') {
          params.id = this.priceDetail.id
          params.remark = this.priceDetail.remark
          editPrice(params).then((res: any) => {
            this.loading = false
            this.$message.success('操作成功')
            this.$emit('save', this.priceDetail.id)
          }).catch(() => {
            this.loading = false
          })
        } else {
          savePrice(params).then((res: any) => {
            this.loading = false
            this.$message.success('操作成功')
            this.$emit('save', res.data)
          }).catch(() => {
            this.loading = false
          })
        }
      }
    })
  }
  private setSort() {
    if (this.aAxisData.length > 0) {
      this.$nextTick(() => {
        const el: any = this.$refs.priceTable
        const dom: any = el.$el
        const node: any = dom.querySelector('.body--wrapper>.vxe-table--body tbody')
        const that = this
        Sortablejs.create(node, {
          handle: '.drag-btn',
          animation: 300,
          onEnd: ({ newIndex, oldIndex }: any) => {
            const currRow = that.tableData.splice(oldIndex, 1)[0]
            that.tableData.splice(newIndex, 0, currRow)
          }
        })
      })
    }
  }
  private groupByPid(params: any, yType: any) {
    this.loading = true
    groupByPid(params).then((groupRes: any) => {
      this.loading = false
      const result = groupRes.data || {}
      const list: any[] = Object.keys(result).map((key: any) => {
        const tamp = {
          key: key + '',
          value: result[key].map((e: any) => {
            let str = ''
            if (yType === '101') {
              str = e.warehouseName
            }
            if (yType === '102') {
              str = e.countryId + '-' + e.countryName
            }
            if (yType === '100') {
              str = e.cityName
            }
            if (yType === '5') {
              str = e.stateName
            }
            return str
          }).join('，')
        }
        return tamp
      })
      this.tableData = this.tableData.map((item: any) => {
        list.forEach((e: any) => {
          if (e.key === item.key) {
            item.regionalDetails = e.value
          }
        })
        return item
      })
    }).catch(() => {
      this.loading = false
    })
  }
  private getPriceConfig() {
    const params = {
      serviceId: this.form.lscId,
      serviceType: '05'
    }
    this.loading = true
    getPriceConfig(params).then((res: any) => {
      this.loading = false
      const data = res.data || []
      if (data.length === 0) {
        this.$message.error('服务暂无报价配置')
        return
      }
      const xAxisData = data.find((e: any) => e.xy === 'X')
      if (!xAxisData) {
        this.$message.error('服务暂无报价配置')
        return
      }
      const yAxisData = data.find((e: any) => e.xy === 'Y')
      if (!yAxisData) {
        this.$message.error('服务暂无报价配置')
        return
      }
      const aAxisData = xAxisData.ranges || []
      const yAxisDataRow = yAxisData.keyValues || []
      if (aAxisData.length === 0 || yAxisDataRow === 0) {
        this.$message.error('服务暂无报价配置')
        return
      }
      const yType = yAxisData.yType || ''
      const objLeft: any = {
        '0': '国家',
        '1': '州省',
        '5': '国内区域',
        '7': '仓库代码',
        '100': '城市区域',
        '101': '仓库区域',
        '102': '国家区域'
      }
      this.tableYTitle = objLeft[yType]
      const loadType = xAxisData.loadType
      this.aAxisData = aAxisData.map((e: any, i: number) => {
        const keyValue = loadType === '2' ? e.keyValue : e.upperLower
        const obj: any = {
          label: '',
          value: '',
          xId: xAxisData.id,
          xtype: ''
        }
        if (loadType === '2') {
          this.tableXTitle = '柜型'
          obj.label = (keyValue || {}).value
          obj.value = (keyValue || {}).key
          obj.xtype = '2'
        } else {
          this.tableXTitle = e.type === '0' ? '重量区间' : loadType === '5' && e.type === '1' ? '方数区间' : '体积区间'
          obj.label = `${(keyValue || {}).lower}-${(keyValue || {}).upper}`
          obj.value = 'price_' + i
          obj.xtype = e.type === '0' ? '0' : '1'
        }
        return obj
      })
      this.tableData = yAxisDataRow.map((e: any) => {
        const keyValue = e.keyValue || {}
        const ydata: any = {
          ...keyValue,
          remark: '',
          prescription: '',
          yId: yAxisData.id,
          yType
        }
        this.aAxisData.forEach((x: any) => {
          ydata[x.value] = undefined
        })
        return ydata
      }).sort((a: any, b: any) => a.value.localeCompare(b.value))
      const typeList = ['5', '100', '101', '102']
      if (typeList.indexOf(yType) === -1) {
        this.isShowRegionalDetailCol = false
      } else {
        this.isShowRegionalDetailCol = true
        const ids = yAxisDataRow.reduce((idList: any[], next: any) => {
          const key = next.keyValue ? next.keyValue.key : ''
          if (key && idList.indexOf(key) === -1) {
            idList.push(key)
          }
          return idList
        }, [])
        const groupParams: any = {
          ids
        }
        if (yType === '5') {
          groupParams.type = 1
        }
        this.groupByPid(groupParams, yType)
      }
      this.setSort()
    }).catch(() => {
      this.loading = false
    })
  }
  private serviceChange() {
    const service = this.serviceList.find((e: any) => e.id === this.form.lscId) || {}
    this.form.lscName = service.label || ''
    this.form.lscCode = service.lsId || ''
    this.form.includeTax = service.includeTax
    this.form.dispatch = service.dispatch || ''
    this.selectService = service
    this.form.supplierId = ''
    this.form.measureId = ''
    this.form.measureName = ''
    this.chargeForm = {}
    this.aAxisData = []
    this.tableData = []
    this.getPriceConfig()
  }
  private agentChange() {
    const agent = this.agentlist.find((e: any) => e.id === this.form.agentId) || {}
    this.form.measureId = ''
    this.form.measureName = ''
    this.form.agentName = agent.name
    this.chargeForm = {}
  }
  private subtypeChange() {
    this.form.lscId = ''
    this.form.lscName = ''
    this.form.lscCode = ''
    this.form.supplierId = ''
    this.form.measureId = ''
    this.form.measureName = ''
    this.form.dispatch = ''
    this.selectService = {}
    this.chargeForm = {}
  }
  private chargeChange() {
    const charge = this.chargeList.find((e: any) => e.id === this.form.measureId) || {}
    this.chargeForm = charge
    this.form.measureName = charge.name
  }
  private async getChargeList() {
    if (!this.form.agentId) return
    const params = {
      agentId: this.form.agentId,
      type: this.selectService.priceType === '2' ? '0' : this.selectService.priceType === '3' ? '1' : undefined,
      subtypeId: this.selectService.subtypeId,
      page: 1,
      size: 9999
    }
    this.selectLoading = true
    await getChargeList(params).then((res: any) => {
      const data = res.data || {}
      this.chargeList = data.result || []
      this.selectLoading = false
    }).catch(() => {
      this.selectLoading = false
      this.chargeList = []
    })
  }
  private getAgentList() {
    const params = {
      parentId: '0',
      subtype: '1',
      page: 1,
      size: 999
    }
    this.selectLoading = true
    getAgentList(params).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      this.agentlist = data.result || []
    }).catch(() => {
      this.selectLoading = false
      this.agentlist = []
    })
  }
  private getSupplierListByType() {
    const targets = this.selectService.targets || []
    const params = {
      cas: 'S',
      countries: targets.map((e: any) => e.countryId),
      subtypes: this.form.subtypeId,
      types: '05'
    }
    this.selectLoading = true
    getSupplierListByType(params).then((res: any) => {
      this.selectLoading = false
      this.supplierList = (res.data || []).map((e: any) => {
        return {
          ...e,
          id: e.custId,
          name: e.custName
        }
      })
    }).catch(() => {
      this.selectLoading = false
      this.supplierList = []
    })
  }
  private async getServiceList() {
    const params: any = {
      page: 1,
      size: 9999,
      countryId: this.form.countryId,
      subtypeId: this.form.subtypeId,
      includeTax: this.form.includeTax,
      dispatch: this.form.dispatch,
      outsourcing: '1,2'
    }
    if (['1', '2'].includes(this.form.subtypeId)) {
      params.containerType = 0
    }
    this.selectLoading = true
    await getLscList(params).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      this.serviceList = (data.result || []).map((it: any) => {
        it.label = `${it.name}(${it.abbr})`
        return it
      })
    }).catch(() => {
      this.selectLoading = false
      this.serviceList = []
    })
  }
  private getCountryList() {
    this.countryList = []
    this.selectLoading = true
    getCountryList().then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      this.countryList = data.result || []
    }).catch(() => {
      this.selectLoading = false
      this.countryList = []
    })
  }
  private getSubtypeList() {
    this.typeList = []
    const params: any = {
      typeId: '05'
    }
    getSubtypeByType(params).then((res: any) => {
      this.selectLoading = false
      this.typeList = res.data || []
    }).catch(() => {
      this.selectLoading = false
      this.typeList = []
    })
  }
}
</script>

<style lang="scss" scoped>
  .price-form{
    flex: 1;
    overflow: auto;
    margin: 15px;
    background-color: #fff;
    padding: 20px;
  }
  .service-info{
    overflow: hidden;
    background-color: #EAEEF4;
    margin-bottom: 10px;
    .info-item{
      float: left;
      font-size: 14px;
      padding: 5px 0 5px 20px;
      .label{
        color: #606266;
      }
      .value{}
    }
  }
  .input-number-valiate {
    width: 100%;
    ::v-deep .el-input__inner {
      text-align: left;
    }
  }
  .drag-btn{
    cursor:move;
    font-size:12px;
  }
</style>
