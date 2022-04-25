<template>
  <div
    v-loading="formLoading"
    class="app-panel express-edit"
  >
    <div class="header-top">
      <div
        style="float: left;"
      >
        {{ isEdit && !isCopy ? '编辑快递服务' : '新增快递服务' }}
      </div>
      <el-button
        type="primary"
        size="small"
        @click="handleBack"
      >
        返 回
      </el-button>
      <el-button
        type="primary"
        size="small"
        @click="handleSave"
      >
        保 存
      </el-button>
    </div>

    <div class="content">
      <el-form
        ref="selectForm"
        :model="selectForm"
        :rules="formRules"
        label-width="160px"
        class="detail-form"
        size="small"
      >
        <div class="form-title">
          <span>基础信息</span>
        </div>

        <el-form-item
          label="服务名称"
          prop="name"
        >
          <el-input
            v-model="selectForm.name"
            :maxlength="50"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>

        <el-form-item
          label="服务简称"
          prop="abbr"
        >
          <el-input
            v-model="selectForm.abbr"
            :maxlength="10"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>

        <el-form-item
          label="分配客户"
          prop="belong"
        >
          <el-select
            v-model="selectForm.belong"
            placeholder="请选择"
            size="small"
            clearable
            style="width:100%;"
          >
            <el-option
              label="直客"
              value="0"
            />
            <el-option
              label="同行"
              value="1"
            />
            <el-option
              label="同行&直客"
              value="2"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="服务编码"
          prop="expressCode"
        >
          <el-input
            v-model="selectForm.expressCode"
            size="small"
            placeholder="请输入"
            :maxlength="25"
            show-word-limit
          />
        </el-form-item>

        <el-form-item
          label="起运国"
          prop="countryId"
        >
          <el-select
            v-model="selectForm.countryId"
            :loading="selectLoading"
            size="small"
            filterable
            clearable
            placeholder="请选择"
            style="width:100%;"
            @change="clearOrg"
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
          label="快递公司"
          prop="expressId"
        >
          <el-select
            v-model="selectForm.expressId"
            :disabled="!selectForm.countryId"
            :loading="selectLoading"
            placeholder="请选择"
            size="small"
            clearable
            filterable
            style="width:100%;"
            @focus="getExpressCompanyList"
            @change="onExpress"
          >
            <el-option
              v-for="item in expressList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="服务类型"
          prop="subtypeId"
        >
          <el-select
            v-model="selectForm.subtypeId"
            placeholder="请选择"
            size="small"
            clearable
            filterable
            style="width:100%;"
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
          label="重量单位"
          prop="umWeight"
        >
          <el-select
            v-model="selectForm.umWeight"
            :loading="selectLoading"
            placeholder="请选择"
            size="small"
            clearable
            filterable
            style="width:100%;"
            @change="(val) => handlerChange(val, 'weight_type')"
          >
            <el-option
              v-for="item in umWeightList"
              :key="item.value"
              :label="`${item.label}-${item.value}`"
              :disabled="item.disabled"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="长度单位"
          prop="umMeasure"
        >
          <el-select
            v-model="selectForm.umMeasure"
            :loading="selectLoading"
            placeholder="请选择"
            size="small"
            clearable
            filterable
            style="width:100%;"
            @change="(val) => handlerChange(val, 'measurement_type')"
          >
            <el-option
              v-for="item in umMeasureList"
              :key="item.value"
              :label="`${item.label}-${item.value}`"
              :disabled="item.disabled"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="货币单位"
          prop="currencyId"
        >
          <el-select
            v-model="selectForm.currencyId"
            :loading="selectLoading"
            clearable
            filterable
            style="width:100%;"
            size="small"
            placeholder="请选择"
            @focus="getCurrencyList"
          >
            <el-option
              v-for="item in currencyList"
              :key="item.id"
              :label="`${item.name}-${item.sign}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="默认供应商"
          prop="defaultSupplierId"
        >
          <el-select
            v-model="selectForm.defaultSupplierId"
            size="small"
            clearable
            filterable
            style="width:100%;"
            placeholder="请选择"
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
        <!-- <el-form-item
          label="备注"
          prop="remark"
        >
          <el-input
            v-model="selectForm.remark"
            :maxlength="100"
            size="small"
            placeholder="请输入"
          />
        </el-form-item> -->

        <div class="form-title">
          <span>参数&配置</span>
        </div>

        <!-- <el-form-item
          label="同行体积重单位"
          prop="vw1"
        >
          <el-input-number
            v-model="selectForm.vw1"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="9999"
            :precision="2"
          />
        </el-form-item>

        <el-form-item
          label="直客体积重单位"
          prop="vw2"
        >
          <el-input-number
            v-model="selectForm.vw2"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="9999"
            :precision="2"
          />
        </el-form-item> -->
        <el-form-item
          label="是否控制打单量"
          prop="ifPrintNum"
        >
          <el-radio-group
            v-model="selectForm.ifPrintNum"
            @change="onPrint"
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
          v-if="selectForm.ifPrintNum === 1"
          label="控制方式"
          prop="printMethod"
        >
          <el-select
            v-model="selectForm.printMethod"
            placeholder="请选择"
            size="small"
            clearable
            style="width:100%;"
          >
            <el-option
              label="按打单金额"
              :value="1"
            />
            <el-option
              label="按重量"
              :value="2"
            />
            <el-option
              label="按方数"
              :value="3"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="selectForm.ifPrintNum === 1"
          label="阀值"
          prop="printThreshold"
        >
          <el-input-number
            v-model="selectForm.printThreshold"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="9999"
            :precision="2"
          />
        </el-form-item>
        <el-form-item
          v-if="selectForm.ifPrintNum === 1"
          label="周期"
          prop="cycling"
        >
          <el-select
            v-model="selectForm.cycling"
            placeholder="请选择"
            size="small"
            clearable
            style="width:100%;"
          >
            <el-option
              label="每天"
              :value="1"
            />
            <el-option
              label="每周"
              :value="2"
            />
            <el-option
              label="每月"
              :value="3"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="expressStr === 'ups'"
          label="是否第三方支付"
          prop="ifOtherPay"
        >
          <el-radio-group v-model="selectForm.ifOtherPay">
            <el-radio :label="0">
              否
            </el-radio>
            <el-radio :label="1">
              是
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="expressStr === 'ups' && selectForm.ifOtherPay === 1"
          label="物流支付账号"
          prop="payNo"
        >
          <el-input
            v-model="selectForm.payNo"
            :maxlength="36"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>

        <el-form-item
          label="物流接口账号"
          prop="paramId"
        >
          <el-select
            v-model="selectForm.paramId"
            :loading="selectLoading"
            :disabled="!selectForm.expressId"
            placeholder="请选择"
            size="small"
            clearable
            filterable
            style="width:100%;"
            @focus="getLogisticsPort"
            @change="onPort"
          >
            <el-option
              v-for="item in portList"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="物流支付类型"
          prop="payType"
        >
          <el-select
            v-model="selectForm.payType"
            :loading="selectLoading"
            :disabled="!selectForm.expressId"
            placeholder="请选择"
            size="small"
            clearable
            filterable
            style="width:100%;"
            @focus="getPayMethod"
          >
            <el-option
              v-for="item in payTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          :label="expressStr === 'dpd' ? '服务供应商' : '服务代码'"
          prop="serviceCode"
        >
          <el-select
            v-model="selectForm.serviceCode"
            :loading="selectLoading"
            :disabled="!selectForm.expressId"
            placeholder="请选择"
            size="small"
            clearable
            filterable
            style="width:100%;"
            @focus="getServiceCode"
            @change="onServiceCode"
          >
            <el-option
              v-for="item in serviceCodeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="包裹类别"
          prop="packageType"
        >
          <el-select
            v-model="selectForm.packageType"
            :loading="selectLoading"
            :disabled="!selectForm.expressId"
            placeholder="请选择"
            size="small"
            clearable
            filterable
            style="width:100%;"
            @focus="getPkgCode"
          >
            <el-option
              v-for="item in packageCodeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="expressStr === 'ups' && selectForm.paramId && selectForm.gfp === 1"
          label="货物分类"
          prop="classification"
        >
          <el-select
            v-model="selectForm.classification"
            :loading="selectLoading"
            placeholder="请选择"
            size="small"
            clearable
            filterable
            style="width:100%;"
            @focus="getRelateData('4')"
          >
            <el-option
              v-for="item in classificList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="expressStr === 'ups' && selectForm.paramId && selectForm.gfp === 1"
          label="handlingUnit数量"
          prop="handlingUnitQuantity"
        >
          <el-input-number
            v-model="selectForm.handlingUnitQuantity"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="999999"
            :step="1"
            step-strictly
          />
        </el-form-item>
        <el-form-item
          v-if="expressStr === 'ups' && selectForm.paramId && selectForm.gfp === 1"
          label="handlingUnit类型"
          prop="handlingUnitType"
        >
          <el-select
            v-model="selectForm.handlingUnitType"
            :loading="selectLoading"
            placeholder="请选择"
            size="small"
            clearable
            filterable
            style="width:100%;"
            @focus="getRelateData('6')"
          >
            <el-option
              v-for="item in huTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="expressStr === 'fedex'"
          label="dropoff类型"
          prop="dropoffType"
        >
          <el-select
            v-model="selectForm.dropoffType"
            :loading="selectLoading"
            placeholder="请选择"
            size="small"
            clearable
            filterable
            style="width:100%;"
            @focus="getRelateData('3')"
          >
            <el-option
              v-for="(item, index) in dropoffTypeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="expressStr === 'dpd'"
          label="服务类型"
          prop="serviceTypeName"
        >
          <el-select
            v-model="selectForm.serviceTypeName"
            :loading="selectLoading"
            :disabled="!selectForm.serviceCode"
            placeholder="请选择"
            size="small"
            clearable
            filterable
            style="width:100%;"
            @focus="getDPDserviceType"
            @change="onServiceType"
          >
            <el-option
              v-for="(item, index) in serviceTypeList"
              :key="index"
              :label="item.serviceTypeName"
              :value="item.serviceTypeName"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="expressStr === 'dpd'"
          label="EORI税号"
          prop="eoriNumber"
        >
          <el-input
            v-model="selectForm.eoriNumber"
            :disabled="!selectForm.serviceTypeName"
            autocomplete="off"
            :maxlength="50"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item
          v-if="expressStr === 'dpd'"
          label="增值税税号"
          prop="vatNumber"
        >
          <el-input
            v-model="selectForm.vatNumber"
            :disabled="!selectForm.serviceTypeName"
            autocomplete="off"
            :maxlength="50"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item
          v-if="expressStr === 'dpd'"
          label="关税支付人"
          prop="dutyPaidBy"
        >
          <el-select
            v-model="selectForm.dutyPaidBy"
            :loading="selectLoading"
            placeholder="请选择"
            size="small"
            clearable
            filterable
            style="width:100%;"
            @focus="getRelateData('5')"
          >
            <el-option
              v-for="item in dutyPaidList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="货值上限"
          prop="maxValueGoods"
        >
          <el-input-number
            v-model="selectForm.maxValueGoods"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="9999999"
          />
        </el-form-item>

        <div class="form-title">
          <span>发货人公司</span>
        </div>
        <el-form-item
          label="姓名"
          prop="consignor"
        >
          <el-input
            v-model="selectForm.consignor"
            :maxlength="50"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="公司"
        >
          <el-input
            v-model="selectForm.consignorCompany"
            :maxlength="50"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="电话"
          prop="consignorPhone"
        >
          <el-input
            v-model="selectForm.consignorPhone"
            :maxlength="20"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="传真"
          prop="consignorFax"
        >
          <el-input
            v-model="selectForm.consignorFax"
            :maxlength="30"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="consignorMail"
        >
          <el-input
            v-model="selectForm.consignorMail"
            :maxlength="30"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="税号"
          prop="consignorTaxCode"
        >
          <el-input
            v-model="selectForm.consignorTaxCode"
            :maxlength="30"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="国家/地区"
          prop="consignorCountryCode"
        >
          <el-select
            v-model="selectForm.consignorCountryCode"
            :loading="selectLoading"
            size="small"
            filterable
            clearable
            placeholder="请选择"
            style="width:100%;"
            @change="onCountry"
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
          label="州/省"
          prop="consignorProvinceCode"
        >
          <el-select
            v-model="selectForm.consignorProvinceCode"
            :loading="selectLoading"
            :disabled="!selectForm.consignorCountryCode"
            size="small"
            filterable
            clearable
            placeholder="请选择"
            style="width:100%;"
            @focus="getProvince"
            @change="onProvince"
          >
            <el-option
              v-for="item in provinceList"
              :key="item.abbr"
              :label="`${item.name}-${item.alias}`"
              :value="item.abbr"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="城市"
          prop="consignorCityCode"
        >
          <el-input
            v-model="selectForm.consignorCityCode"
            :disabled="!selectForm.consignorProvinceCode"
            :maxlength="50"
            size="small"
            placeholder="请输入"
          />
          <!-- <el-select
            v-model="selectForm.consignorCityCode"
            :loading="selectLoading"
            :disabled="!selectForm.consignorProvinceCode"
            size="small"
            filterable
            clearable
            placeholder="请选择"
            style="width:100%;"
            @focus="getCity"
          >
            <el-option
              v-for="item in cityList"
              :key="item.id"
              :label="`${item.name}-${item.alias}`"
              :value="item.id"
            />
          </el-select> -->
        </el-form-item>
        <el-form-item
          label="详细地址1"
          prop="consignorAddress1"
        >
          <el-input
            v-model="selectForm.consignorAddress1"
            :maxlength="100"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="详细地址2"
          prop="consignorAddress2"
        >
          <el-input
            v-model="selectForm.consignorAddress2"
            :maxlength="100"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="详细地址3"
          prop="consignorAddress3"
        >
          <el-input
            v-model="selectForm.consignorAddress3"
            :maxlength="100"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="邮编"
          prop="consignorZip"
        >
          <el-input
            v-model="selectForm.consignorZip"
            :maxlength="20"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <div class="form-title">
        <span>运输条款</span>
      </div>
      <div>
        <markdown-editor
          ref="markdownEditor"
          v-model="terms"
          :options="{
            hideModeSwitch: true,
            previewStyle: 'tab',
            toolbarItems: ['heading','bold','italic']
          }"
          height="300px"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import MarkdownEditor from '@/components/MarkdownEditor/index.vue'
import {
  saveEsc,
  updateEsc,
  getEscById,
  getExpressCompany,
  getLogisticsPort,
  getWordsList,
  geCurrencyList,
  getCustTypeList,
  getServiceCode,
  getPayMethod,
  getPkgCode,
  getStateByCountry,
  getCityByState,
  getDPDserviceType
} from '@/api/service-with-express-service'

function formParam() {
  return {
    name: undefined,
    abbr: undefined,
    subtypeId: undefined,
    countryId: undefined,
    currencyId: undefined,
    defaultSupplierId: undefined,
    expressId: undefined,
    expressName: undefined,
    belong: undefined,
    expressCode: undefined,
    umWeight: undefined,
    umMeasure: undefined,
    payNo: undefined,
    paramId: undefined,
    paramName: undefined,
    payType: undefined,
    packageType: undefined,
    dropoffType: undefined,
    serviceCode: undefined,
    serviceTypeName: undefined,
    dutyPaidBy: undefined,
    terms: undefined,
    ifPrintNum: 0,
    maxValueGoods: 0,
    printMethod: undefined,
    printThreshold: undefined,
    cycling: 2,
    ifOtherPay: 0,
    settlement: undefined,
    consignor: undefined,
    consignorAddress1: undefined,
    consignorAddress2: undefined,
    consignorAddress3: undefined,
    consignorCityCode: undefined,
    consignorCountryCode: undefined,
    consignorFax: undefined,
    consignorCompany: undefined,
    consignorMail: undefined,
    consignorPhone: undefined,
    consignorProvinceCode: undefined,
    consignorTaxCode: undefined,
    consignorZip: undefined,
    classification: undefined,
    handlingUnitQuantity: undefined,
    handlingUnitType: undefined,
    eoriNumber: undefined,
    vatNumber: undefined
  }
}

@Component({
  name: 'addEditForm',
  components: {
    MarkdownEditor
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    isCopy: {
      type: Boolean,
      default: false
    },
    countryList: {
      type: Array,
      default: () => {
        return []
      }
    },
    typeList: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
})
export default class extends Vue {
  /* data */
  private selectForm: any = formParam()
  private formRules = {
    name: [{ required: true, message: '服务名称不能为空', trigger: 'blur' }],
    abbr: [{ required: true, message: '服务简称不能为空', trigger: 'blur' }],
    subtypeId: [{ required: true, message: '请选择服务类型', trigger: 'change' }],
    countryId: [{ required: true, message: '请选择起运国', trigger: 'change' }],
    expressId: [{ required: true, message: '请选择快递公司', trigger: 'blur' }],
    belong: [{ required: true, message: '请选择分配客户', trigger: 'change' }],
    expressCode: [
      { required: true, message: '服务编码不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^[a-zA-Z0-9 .·_-]+$/
          if (!value) {
            callback(new Error('服务编码不能为空'))
          } else if (!reg.test(value)) {
            callback(new Error('服务编码不能有中文及特殊字符'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    umWeight: [{ required: true, message: '请选择重量单位', trigger: 'change' }],
    umMeasure: [{ required: true, message: '请选择长度单位', trigger: 'change' }],
    currencyId: [{ required: true, message: '请选择货币单位', trigger: 'change' }],
    payNo: [
      { required: true, message: '物流支付账号不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (!value) {
            callback(new Error('物流支付账号不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('物流支付账号不能是中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    paramId: [{ required: true, message: '请选择物流接口账号', trigger: 'change' }],
    ifOtherPay: [{ required: true, message: '请选择是否第三方支付', trigger: 'change' }],
    ifPrintNum: [{ required: true, message: '请选择是否控制打单量', trigger: 'change' }],
    printMethod: [{ required: true, message: '请选择控制方式', trigger: 'change' }],
    printThreshold: [{ required: true, message: '阀值不能为空', trigger: 'blur' }],
    cycling: [{ required: true, message: '请选择周期', trigger: 'change' }],
    payType: [{ required: true, message: '请选择物流支付类型', trigger: 'change' }],
    packageType: [{ required: true, message: '请选择UPS包裹类别码', trigger: 'change' }],
    dropoffType: [{ required: true, message: '请选择dropoff类型', trigger: 'change' }],
    classification: [{ required: true, message: '请选择货物分类', trigger: 'change' }],
    serviceCode: [{ required: true, message: '请选择服务代码', trigger: 'change' }],
    serviceTypeName: [{ required: true, message: '请选择服务类型', trigger: 'change' }],
    dutyPaidBy: [{ required: true, message: '请选择关税支付人', trigger: 'change' }],
    consignor: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
    consignorPhone: [
      { required: true, message: '电话不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (value && reg.test(value)) {
            callback(new Error('电话不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    consignorMail: [
      { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
      { type: 'email', message: '邮箱地址格式不正确', trigger: ['blur', 'change'] }
    ],
    consignorZip: [
      { required: true, message: '邮编不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^[a-zA-Z0-9]*$/
          if (!reg.test(value)) {
            callback(new Error('邮编只能包含数字、字母'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    consignorCountryCode: [{ required: true, message: '请选择国家/地区', trigger: 'change' }],
    consignorProvinceCode: [{ required: true, message: '请选择州/省', trigger: 'change' }],
    consignorCityCode: [{ required: true, message: '请选择城市', trigger: 'change' }],
    consignorAddress1: [{ required: true, message: '详细地址1不能为空', trigger: 'blur' }],
    consignorAddress2: [{ required: false, message: '详细地址2不能为空', trigger: 'blur' }],
    consignorAddress3: [{ required: false, message: '详细地址3不能为空', trigger: 'blur' }]
  }
  private codeList: any[] = []
  private currencyList: any[] = []
  private supplierList: any[] = []
  private expressList: any[] = []
  private umMeasureList: any[] = []
  private umWeightList: any[] = []
  private terms = ''
  private expressStr: any = ''
  private portList: any[] = []
  private payTypeList: any[] = []
  private packageCodeList: any[] = []
  private classificList: any[] = []
  private huTypeList: any[] = []
  private serviceTypeList: any[] = []
  private dropoffTypeList: any[] = []
  private dutyPaidList: any[] = []
  private serviceCodeList: any[] = []
  private selectLoading: boolean = false
  private formLoading: boolean = false
  private provinceList: any[] = []
  private cityList: any[] = []

  /* computed */
  // 所属公司id
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
  /* method */
  private async setData(val: any) {
    // 设置值
    const { consignorEntity, ...form }: any = val
    this.selectForm = { ...form, ...consignorEntity }
    this.formLoading = true
    await this.getLogisticsPort()
    await this.getExpressCompanyList()
    this.expressList.map((it: any) => {
      if (this.selectForm.expressId === it.id) {
        this.expressStr = it.code.toLowerCase()
      }
    })
    this.portList.map((it: any) => {
      if (this.selectForm.paramId === it.id) {
        this.selectForm.gfp = it.gfp
      }
    })
    this.getServiceCode()
    this.getPayMethod()
    this.getPkgCode()
    this.getRelateData('4')
    this.getRelateData('6')
    if (this.expressStr === 'dpd') {
      this.getRelateData('5')
      this.getDPDserviceType()
    } else if (this.expressStr === 'fedex') {
      this.getRelateData('3')
    }
    this.getWordsList('weight_type')
    this.getWordsList('measurement_type')
    this.getEscById()
    this.getCurrencyList()
    this.getCustTypeList()
  }
  private add() {
    this.getWordsList('weight_type')
    this.getWordsList('measurement_type')
  }
  private handlerChange(val: any, type: string) {
    if (type === 'weight_type') {
      let disList: any[] = []
      if (val) {
        if (val === 'KGS') {
          disList = ['IN', 'FT']
        }
        if (val === 'LBS') {
          disList = ['CM']
        }
      } else {
        disList = []
      }
      this.umMeasureList = this.umMeasureList.map(e => {
        e.disabled = false
        if (disList.indexOf(e.value) !== -1) {
          e.disabled = true
        }
        return e
      })
    } else {
      let disList: any[] = []
      if (val) {
        if (val === 'IN' || val === 'FT') {
          disList = ['KGS']
        }
        if (val === 'CM') {
          disList = ['LBS']
        }
      } else {
        disList = []
      }
      this.umWeightList = this.umWeightList.map(e => {
        e.disabled = false
        if (disList.indexOf(e.value) !== -1) {
          e.disabled = true
        }
        return e
      })
    }
  }
  private setTerms(val: any) {
    (this.$refs.markdownEditor as MarkdownEditor).setHtml(val)
  }
  private clearOrg() {
    this.selectForm.expressId = undefined
    this.expressList = []
    this.onExpress()
  }
  private onCountry() {
    this.selectForm.consignorProvinceCode = undefined
    this.selectForm.consignorCityCode = undefined
    this.provinceList = []
    this.cityList = []
  }
  private onProvince() {
    this.selectForm.consignorCityCode = undefined
    this.cityList = []
  }
  private getProvince() {
    this.selectLoading = true
    getStateByCountry(this.selectForm.consignorCountryCode)
      .then((res:any) => {
        const data = res.data || {}
        this.provinceList = data.result || []
        this.selectLoading = false
      }).catch((err:any) => {
        this.selectLoading = false
        return err
      })
  }
  private getCity() {
    this.selectLoading = true
    getCityByState(this.selectForm.consignorProvinceCode)
      .then((res:any) => {
        const data = res.data || {}
        this.cityList = data.result || []
        this.selectLoading = false
      }).catch((err:any) => {
        this.selectLoading = false
        return err
      })
  }
  private getEscById() {
    this.formLoading = true
    getEscById({
      id: this.selectForm.id
    }).then((res: any) => {
      const data = res.data || {}
      const { consignorEntity } = data
      const { id, ...consignForm }: any = consignorEntity || {}
      if ((this as any).isCopy) {
        const { name, abbr, expressCode, ...form } = this.selectForm
        this.selectForm = {
          ...form,
          ...consignForm
        }
        this.selectForm.id = undefined
      } else {
        const { ...form } = this.selectForm
        this.selectForm = {
          ...form,
          ...consignForm
        }
      }

      this.setTerms(data.terms)
      this.getProvince()
      // this.getCity()
      this.formLoading = false
    }).catch((err:any) => {
      this.formLoading = false
      return err
    })
  }
  private async getExpressCompanyList() {
    this.selectLoading = true
    const params = {
      page: 1,
      size: 99999,
      type: '4',
      serviceCountry: this.selectForm.countryId
    }
    try {
      const res = await getExpressCompany(params)
      const data = res.data || {}
      this.expressList = data.result || []
      this.selectLoading = false
    } catch (error) {
      this.selectLoading = false
    }
  }

  // 获取货币列表
  private getCurrencyList() {
    this.selectLoading = true
    const params = {
      page: 1,
      size: 999
    }
    geCurrencyList(params).then((res:any) => {
      const data = res.data || {}
      this.currencyList = data.result || []
      this.selectLoading = false
    }).catch((err:any) => {
      this.selectLoading = false
      return err
    })
  }

  private subtypeChange() {
    this.selectForm.defaultSupplierId = undefined
  }

  private getCustTypeList() {
    const params = {
      page: 1,
      size: 9999,
      cas: 'S',
      typeId: '00',
      subtypeId: this.selectForm.subtypeId
    }
    this.supplierList = []
    getCustTypeList(params).then((res: any) => {
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
  private onExpress() {
    this.expressStr = undefined
    this.selectForm.expressName = undefined
    this.expressList.map((it: any) => {
      if (it.id === this.selectForm.expressId) {
        this.selectForm.expressName = it.name
        this.expressStr = it.code.toLowerCase()
      }
    })
    this.portList = []
    this.payTypeList = []
    this.packageCodeList = []
    this.serviceCodeList = []
    this.serviceTypeList = []
    this.dutyPaidList = []
    this.dropoffTypeList = []
    this.selectForm.dropoffType = undefined
    this.selectForm.paramId = undefined
    this.selectForm.payType = undefined
    this.selectForm.packageType = undefined
    this.selectForm.eoriNumber = undefined
    this.selectForm.vatNumber = undefined
    this.selectForm.serviceCode = undefined
    this.selectForm.serviceTypeName = undefined
    this.selectForm.dutyPaidBy = undefined
    this.onPort()
  }
  // 处理接口账号关联项
  private getRelateData(str: string) {
    switch (str) {
      case '3':
        if (this.expressStr === 'fedex') {
          this.getWordsList('DropoffType')
        }
        break
      case '4':
        if (this.expressStr === 'ups' && this.selectForm.gfp === 1) {
          this.getWordsList('UPS_GROUND_FREIGHT_CLASSES')
        }
        break
      case '5':
        this.getWordsList('DPD_DUTY_PAID')
        break
      case '6':
        if (this.expressStr === 'ups' && this.selectForm.gfp === 1) {
          this.getWordsList('UPS_HANDLING_UNIT_CODES')
        }
        break
      default:
        break
    }
  }
  private async getLogisticsPort() {
    this.selectLoading = true
    const params:any = {
      expressId: this.selectForm.expressId
    }
    try {
      const res = await getLogisticsPort(params)
      const data = res.data || []
      this.portList = data
      this.selectLoading = false
    } catch (error) {
      this.selectLoading = false
      return error
    }
  }
  private onPort() {
    this.selectForm.paramName = undefined
    this.selectForm.gfp = undefined
    this.portList.map((it: any) => {
      if (this.selectForm.paramId === it.id) {
        this.selectForm.paramName = it.username
        this.selectForm.gfp = it.gfp
      }
    })
    this.classificList = []
    this.huTypeList = []
    this.selectForm.classification = undefined
    this.selectForm.handlingUnitType = undefined
    this.selectForm.handlingUnitQuantity = undefined
  }

  private getWordsList(type: any) {
    this.selectLoading = true
    const params:any = {
      type
    }
    getWordsList(params)
      .then((res: any) => {
        this.selectLoading = false
        const data = res.data || []
        switch (type) {
          case 'UPS_GROUND_FREIGHT_CLASSES':
            this.classificList = data
            break
          case 'UPS_HANDLING_UNIT_CODES':
            this.huTypeList = data
            break
          case 'weight_type':
            this.umWeightList = data.map((e: any) => {
              e.disabled = false
              return e
            }).filter((e: any) => e.value === 'KGS' || e.value === 'LBS')
            break
          case 'measurement_type':
            this.umMeasureList = data.map((e: any) => {
              e.disabled = false
              return e
            }).filter((e: any) => e.value === 'IN' || e.value === 'FT' || e.value === 'CM')
            break
          case 'DPD_DUTY_PAID':
            this.dutyPaidList = data
            break
          case 'DropoffType':
            this.dropoffTypeList = data
            break
          default:
            break
        }
      }).catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private getServiceCode() {
    this.selectLoading = true
    const params: any = {
      express: this.expressStr
    }
    getServiceCode(params)
      .then((res: any) => {
        this.selectLoading = false
        this.serviceCodeList = res.data || []
      }).catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private getPayMethod() {
    this.selectLoading = true
    const params: any = {
      express: this.expressStr
    }
    getPayMethod(params)
      .then((res: any) => {
        this.selectLoading = false
        this.payTypeList = res.data || []
      }).catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private getPkgCode() {
    this.selectLoading = true
    const params: any = {
      express: this.expressStr
    }
    getPkgCode(params)
      .then((res: any) => {
        this.selectLoading = false
        this.packageCodeList = res.data || []
      }).catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private onPrint() {
    if (this.selectForm.ifPrintNum === 0) {
      this.selectForm.printMethod = undefined
      this.selectForm.printThreshold = undefined
      this.selectForm.cycling = undefined
    } else {
      this.selectForm.cycling = 2
    }
  }
  private onServiceCode() {
    this.selectForm.serviceTypeName = undefined
    this.serviceTypeList = []
    this.selectForm.dutyPaidBy = undefined
    this.dutyPaidList = []
  }
  private onServiceType() {
    this.selectForm.vatNumber = undefined
    this.selectForm.eoriNumber = undefined
  }
  private getDPDserviceType() {
    this.selectLoading = true
    getDPDserviceType(this.selectForm.serviceCode)
      .then((res: any) => {
        this.selectLoading = false
        this.serviceTypeList = res.data || []
      }).catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  // 重置表单
  private resetForm() {
    this.setTerms('')
    this.expressStr = ''
    this.selectForm = formParam()
    this.clearValidate()
  }
  // 清除校验
  private clearValidate() {
    const editForm: any = this.$refs.selectForm
    this.$nextTick(() => {
      editForm.clearValidate()
    })
  }
  private handleBack() {
    this.resetForm()
    this.$emit('back')
  }
  private handleSave(): any {
    // 保存
    const html = (this.$refs.markdownEditor as MarkdownEditor).getHtml()
    const editForm: any = this.$refs.selectForm
    editForm.validate((valid: any) => {
      if (!valid) return false
      this.formLoading = true
      const {
        consignor,
        consignorCompany,
        consignorAddress1,
        consignorAddress2,
        consignorAddress3,
        consignorCityCode,
        consignorCity,
        consignorCountryCode,
        consignorCountry,
        consignorFax,
        consignorMail,
        consignorPhone,
        consignorProvinceCode,
        consignorProvince,
        consignorTaxCode,
        consignorZip,
        ...form
      } = this.selectForm
      const consignorEntity: any = {
        consignor,
        consignorCompany,
        consignorAddress1,
        consignorAddress2,
        consignorAddress3,
        consignorCityCode,
        consignorCountryCode,
        consignorFax,
        consignorMail,
        consignorPhone,
        consignorProvinceCode,
        consignorTaxCode,
        consignorZip
      }
      const params: any = {
        ...form
      }
      params.terms = html
      const countrys: any[] = (this as any).countryList
      countrys.map((item: any) => {
        if (item.id === consignorCountryCode) {
          consignorEntity.consignorCountry = item.alias
        }
        if (item.id === params.countryId) {
          params.countryName = item.name
        }
      })
      this.provinceList.map((item: any) => {
        if (item.abbr === consignorProvinceCode) {
          consignorEntity.consignorProvince = item.alias
        }
      })
      consignorEntity.consignorCity = consignorCityCode
      this.currencyList.map((it: any) => {
        if (it.id === params.currencyId) {
          params.currencyName = it.name
        }
      })
      this.supplierList.map((it: any) => {
        if (it.id === params.defaultSupplierId) {
          params.defaultSupplierName = it.name
        }
      })
      params.custId = (this as any).custId
      params.custName = (this as any).custName
      params.consignorEntity = consignorEntity
      if ((this as any).isEdit && !(this as any).isCopy) {
        updateEsc(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.formLoading = false
            this.$emit('go')
            this.resetForm()
          })
          .catch((err: any) => {
            this.formLoading = false
            return err
          })
      } else {
        saveEsc(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.formLoading = false
            this.$emit('go')
            this.resetForm()
          })
          .catch((err: any) => {
            this.formLoading = false
            return err
          })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  display: inline-block;
  width: 24.9%;
}

.express-edit{
  padding:0;
  .header-top{
    text-align: right;
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    font-size: 16px;
    color: #666666;
    border-bottom: 1px solid #cccccc;
  }
  .content{
    padding: 20px;;
    .form-title {
      height: 35px;
      line-height: 35px;
      font-size: 16px;
      font-weight: 700;
      background: #f2f2f2;
      padding-left: 20px;
      margin-bottom:20px;
    }
  }
}

.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
</style>
