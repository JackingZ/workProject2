<template>
  <div
    v-loading="formLoading"
    class="app-panel express-edit"
  >
    <div class="header-top">
      <div
        style="float: left;"
      >
        {{ isEdit ? '编辑快递接口' : '新增快递接口' }}
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
        label-width="150px"
        class="detail-form"
        size="small"
      >
        <div class="form-title">
          <span>基础信息</span>
        </div>
        <el-form-item
          label="快递公司"
          prop="expressId"
        >
          <el-select
            v-model="selectForm.expressId"
            :disabled="isEdit"
            style="width:100%;"
            size="small"
            clearable
            filterable
            placeholder="请选择"
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
        <!-- <el-form-item
          label="服务编码"
          prop="codes"
        >
          <el-input
            v-model="selectForm.codes"
            :disabled="isEdit"
            :maxlength="50"
            size="small"
            placeholder="请输入"
          />
        </el-form-item> -->

        <el-form-item
          :label="selectForm.expressId === FEDEX_ID ? 'Account Number' : '登录名'"
          prop="username"
        >
          <el-input
            v-model="selectForm.username"
            :disabled="isEdit"
            :maxlength="20"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>

        <el-form-item
          :label="selectForm.expressId === FEDEX_ID ? 'Meter Number' : '登录密码'"
          prop="password"
        >
          <el-input
            v-model="selectForm.password"
            :disabled="isEdit"
            :maxlength="20"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>

        <el-form-item
          :label="selectForm.expressId === FEDEX_ID ? 'KEY' : '接口编码'"
          prop="interfaceCode"
        >
          <el-input
            v-model="selectForm.interfaceCode"
            :disabled="isEdit"
            :maxlength="50"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>

        <el-form-item
          :label="selectForm.expressId === FEDEX_ID ? 'Password' : '访问授权码'"
          prop="accessLicenseNumber"
        >
          <el-input
            v-model="selectForm.accessLicenseNumber"
            :disabled="isEdit"
            :maxlength="50"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>

        <el-form-item
          label="备注"
          prop="remarks"
        >
          <el-input
            v-model="selectForm.remarks"
            :maxlength="100"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>

        <div class="form-title">
          <span>接口路径</span>
        </div>

        <el-form-item
          v-for="(item, index) in urlList"
          :key="index"
          :label="item.label"
          class="is-required"
          style="width: 49.5%;"
        >
          <el-input
            v-model="item.value"
            disabled
            size="small"
            placeholder="请输入"
          />
        </el-form-item>

        <div class="form-title">
          <span>发运参数</span>
        </div>
        <el-form-item
          label="运单包裹数量上限"
          prop="maximumPackages"
        >
          <div class="input-content">
            <div style="flex: 1;">
              <el-input-number
                v-model="selectForm.maximumPackages"
                :disabled="isEdit"
                class="input-number-valiate input-border"
                :controls="false"
                placeholder="请输入"
                :min="0"
                :max="999999"
                :step="1"
                step-strictly
              />
            </div>
            <div class="input-unit">
              个
            </div>
          </div>
        </el-form-item>
        <el-form-item
          label="单个包裹重量上限"
          prop="maximumWeightOfPackage"
        >
          <div class="input-content">
            <div style="flex: 1;">
              <el-input-number
                v-model="selectForm.maximumWeightOfPackage"
                :disabled="isEdit"
                class="input-number-valiate input-border"
                :controls="false"
                placeholder="请输入"
                :min="0"
                :max="999999"
                :step="1"
                step-strictly
              />
            </div>
            <div class="input-unit">
              KG
            </div>
          </div>
        </el-form-item>
        <el-form-item
          label="重量折扣"
          prop="weightDiscount"
        >
          <div class="input-content">
            <div style="flex: 1;">
              <el-input-number
                v-model="selectForm.weightDiscount"
                :disabled="isEdit"
                class="input-number-valiate input-border"
                :controls="false"
                placeholder="请输入"
                :min="0"
                :max="999999"
                :step="1"
                step-strictly
              />
            </div>
            <div class="input-unit">
              %
            </div>
          </div>
        </el-form-item>
        <el-form-item
          label="标签一式打印份数"
          prop="numberOfCopies"
        >
          <el-input-number
            v-model="selectForm.numberOfCopies"
            :disabled="isEdit"
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
          label="打印标签格式(cm)"
          prop="labelStyle"
        >
          <el-select
            v-model="selectForm.labelStyle"
            :disabled="isEdit"
            style="width: 100%;"
            clearable
          >
            <el-option
              v-for="item in lengthList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item
          label="国外派件成本"
          prop="deliveryCost"
        >
          <div class="input-content">
            <div style="flex: 1;">
              <el-input-number
                v-model="selectForm.deliveryCost"
                :disabled="isEdit"
                class="input-number-valiate input-border"
                :controls="false"
                placeholder="请输入"
                :min="0"
                :max="999999"
                :precision="2"
              />
            </div>
            <div class="input-unit">
              {{ selectForm.currency }}
            </div>
          </div>
        </el-form-item>
        <el-form-item
          label="默认运费折扣"
          prop="shippingDiscount"
        >
          <div class="input-content">
            <div style="flex: 1;">
              <el-input-number
                v-model="selectForm.shippingDiscount"
                :disabled="isEdit"
                class="input-number-valiate input-border"
                :controls="false"
                placeholder="请输入"
                :min="0"
                :max="999999"
                :step="1"
                step-strictly
              />
            </div>
            <div class="input-unit">
              %
            </div>
          </div>
        </el-form-item> -->
        <el-form-item
          label="体积重单位"
          prop="volumetricWeightUnit"
        >
          <el-input-number
            v-model="selectForm.volumetricWeightUnit"
            :disabled="isEdit"
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
          label="需要打印发票"
          prop="printInvoice"
        >
          <el-radio-group
            v-model="selectForm.printInvoice"
            :disabled="isEdit"
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
          label="GFP"
          prop="ifGfp"
        >
          <el-radio-group
            v-model="selectForm.ifGfp"
            :disabled="isEdit"
          >
            <el-radio :label="0">
              否
            </el-radio>
            <el-radio :label="1">
              是
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <div class="form-title">
          <span>账号信息</span>
        </div>
        <el-form-item
          label="公司名称"
          prop="consignorCompany"
        >
          <el-input
            v-model="selectForm.consignorCompany"
            :disabled="isEdit"
            :maxlength="36"
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
            :disabled="isEdit"
            :loading="selectLoading"
            size="small"
            filterable
            placeholder="所在国家"
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
            :disabled="isEdit || !selectForm.consignorCountryCode"
            size="small"
            filterable
            clearable
            placeholder="请选择"
            style="width:100%;"
            @focus="getProvince('1')"
            @change="onProvince"
          >
            <el-option
              v-for="item in province1List"
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
            :disabled="isEdit || !selectForm.consignorProvinceCode"
            :maxlength="50"
            size="small"
            placeholder="请输入"
          />
          <!-- <el-select
            v-model="selectForm.consignorCityCode"
            :loading="selectLoading"
            :disabled="isEdit || !selectForm.consignorProvinceCode"
            size="small"
            filterable
            clearable
            placeholder="请选择"
            style="width:100%;"
            @focus="getCity('1')"
          >
            <el-option
              v-for="item in city1List"
              :key="item.id"
              :label="`${item.name}-${item.alias}`"
              :value="item.id"
            />
          </el-select> -->
        </el-form-item>
        <el-form-item
          label="联系人"
          prop="consignor"
        >
          <el-input
            v-model="selectForm.consignor"
            :disabled="isEdit"
            :maxlength="20"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="联系电话"
          prop="consignorPhone"
        >
          <el-input
            v-model="selectForm.consignorPhone"
            :disabled="isEdit"
            :maxlength="20"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="联系邮箱"
          prop="consignorMail"
        >
          <el-input
            v-model="selectForm.consignorMail"
            :disabled="isEdit"
            :maxlength="20"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="传真号码"
          prop="consignorFax"
        >
          <el-input
            v-model="selectForm.consignorFax"
            :disabled="isEdit"
            :maxlength="20"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="邮政编号"
          prop="consignorZip"
        >
          <el-input
            v-model="selectForm.consignorZip"
            :disabled="isEdit"
            :maxlength="20"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="税码"
          prop="consignorTaxCode"
        >
          <el-input
            v-model="selectForm.consignorTaxCode"
            :disabled="isEdit"
            :maxlength="20"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="联系地址1"
          prop="consignorAddress1"
        >
          <el-input
            v-model="selectForm.consignorAddress1"
            :disabled="isEdit"
            :maxlength="100"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="联系地址2"
          prop="consignorAddress2"
        >
          <el-input
            v-model="selectForm.consignorAddress2"
            :disabled="isEdit"
            :maxlength="100"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>

        <el-form-item
          label="联系地址3"
          prop="consignorAddress3"
        >
          <el-input
            v-model="selectForm.consignorAddress3"
            :disabled="isEdit"
            :maxlength="100"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>

        <div class="form-title">
          <span>退货方信息</span>
        </div>
        <el-form-item
          label="同发货方"
          prop="sameConsignor"
        >
          <el-radio-group
            v-model="selectForm.sameConsignor"
            :disabled="isEdit"
          >
            <el-radio :label="0">
              否
            </el-radio>
            <el-radio :label="1">
              是
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <span v-if="selectForm.sameConsignor === 0">
          <el-form-item
            label="公司名称"
            prop="returnCompany"
          >
            <el-input
              v-model="selectForm.returnCompany"
              :disabled="isEdit"
              :maxlength="36"
              size="small"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="国家/地区"
            prop="returnCountryCode"
          >
            <el-select
              v-model="selectForm.returnCountryCode"
              :disabled="isEdit"
              :loading="selectLoading"
              size="small"
              filterable
              placeholder="所在国家"
              style="width:100%;"
              @change="onCountryCode"
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
            prop="returnProvinceCode"
          >
            <el-select
              v-model="selectForm.returnProvinceCode"
              :loading="selectLoading"
              :disabled="isEdit || !selectForm.returnCountryCode"
              size="small"
              filterable
              clearable
              placeholder="请选择"
              style="width:100%;"
              @focus="getProvince('2')"
              @change="onProvinceCode"
            >
              <el-option
                v-for="item in province2List"
                :key="item.abbr"
                :label="`${item.name}-${item.alias}`"
                :value="item.abbr"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="城市"
            prop="returnCityCode"
          >
            <el-input
              v-model="selectForm.returnCityCode"
              :disabled="isEdit || !selectForm.returnProvinceCode"
              :maxlength="50"
              size="small"
              placeholder="请输入"
            />
            <!-- <el-select
              v-model="selectForm.returnCityCode"
              :loading="selectLoading"
              :disabled="isEdit || !selectForm.returnProvinceCode"
              size="small"
              filterable
              clearable
              placeholder="请选择"
              style="width:100%;"
              @focus="getCity('2')"
            >
              <el-option
                v-for="item in city2List"
                :key="item.id"
                :label="`${item.name}-${item.alias}`"
                :value="item.id"
              />
            </el-select> -->
          </el-form-item>
          <el-form-item
            label="联系人"
            prop="returnName"
          >
            <el-input
              v-model="selectForm.returnName"
              :disabled="isEdit"
              :maxlength="10"
              size="small"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="联系电话"
            prop="returnPhone"
          >
            <el-input
              v-model="selectForm.returnPhone"
              :disabled="isEdit"
              :maxlength="20"
              size="small"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="联系邮箱"
            prop="returnMail"
          >
            <el-input
              v-model="selectForm.returnMail"
              :disabled="isEdit"
              :maxlength="20"
              size="small"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="传真号码"
            prop="returnFax"
          >
            <el-input
              v-model="selectForm.returnFax"
              :disabled="isEdit"
              :maxlength="20"
              size="small"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="邮政编号"
            prop="returnZip"
          >
            <el-input
              v-model="selectForm.returnZip"
              :disabled="isEdit"
              :maxlength="20"
              size="small"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="税码"
            prop="returnTaxCode"
          >
            <el-input
              v-model="selectForm.returnTaxCode"
              :disabled="isEdit"
              :maxlength="20"
              size="small"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="联系地址1"
            prop="returnAddress1"
          >
            <el-input
              v-model="selectForm.returnAddress1"
              :disabled="isEdit"
              :maxlength="100"
              size="small"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="联系地址2"
            prop="returnAddress2"
          >
            <el-input
              v-model="selectForm.returnAddress2"
              :disabled="isEdit"
              :maxlength="100"
              size="small"
              placeholder="请输入"
            />
          </el-form-item>

          <el-form-item
            label="联系地址3"
            prop="returnAddress3"
          >
            <el-input
              v-model="selectForm.returnAddress3"
              :disabled="isEdit"
              :maxlength="100"
              size="small"
              placeholder="请输入"
            />
          </el-form-item>
        </span>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  addExpressPort,
  updateExpressPort,
  getExpressPortById,
  getExpressCompany,
  getWordsList,
  getStateByCountry,
  getCityByState,
  geCurrencyList
} from '@/api/operation-of-express-port'

function formParam() {
  return {
    accessLicenseNumber: undefined,
    codes: undefined,
    consignor: undefined,
    consignorAddress1: undefined,
    consignorAddress2: undefined,
    consignorAddress3: undefined,
    consignorCity: undefined,
    consignorCityCode: undefined,
    consignorCompany: undefined,
    consignorCountry: undefined,
    consignorCountryCode: undefined,
    consignorDistrict: undefined,
    consignorDistrictCode: undefined,
    consignorFax: undefined,
    consignorMail: undefined,
    consignorPhone: undefined,
    consignorProvince: undefined,
    consignorProvinceCode: undefined,
    consignorTaxCode: undefined,
    consignorZip: undefined,
    currency: undefined,
    createTime: undefined,
    deliveryCost: 0,
    expressId: undefined,
    expressName: undefined,
    id: 0,
    ifGfp: 0,
    interfaceCode: undefined,
    labelOfUnit: 1,
    labelStyle: undefined,
    maximumPackages: 0,
    maximumWeightOfPackage: 0,
    numberOfCopies: 0,
    packagingType: undefined,
    password: undefined,
    printInvoice: 0,
    remarks: undefined,
    returnerEntity: {},
    returnId: undefined,
    returnAddress1: undefined,
    returnAddress2: undefined,
    returnAddress3: undefined,
    returnCityCode: undefined,
    returnCityName: undefined,
    returnCompany: undefined,
    returnCountryCode: undefined,
    returnCountryName: undefined,
    returnDistrictCode: undefined,
    returnDistrictName: undefined,
    returnFax: undefined,
    returnMail: undefined,
    returnName: undefined,
    returnPhone: undefined,
    returnProvinceCode: undefined,
    returnProvinceName: undefined,
    returnTaxCode: undefined,
    returnZip: undefined,
    sameConsignor: 0,
    serviceCode: undefined,
    shipperNumber: undefined,
    shippingDiscount: 0,
    username: undefined,
    ifEnable: undefined,
    volumetricWeightUnit: undefined,
    weightDiscount: 0
  }
}

@Component({
  name: 'addEditForm',
  components: {
  },
  props: {
    countryList: {
      type: Array,
      default: () => {
        return []
      }
    },
    expressList: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
})
export default class extends Vue {
  /* data */
  private FEDEX_ID: string = 'ef57c1b33e9411eabd8600163e06e1cf' // 快递公司为FEDEX时，快递账号信息label要变化。TODO正式测试ID一样
  private selectForm: any = formParam()
  private formRules = {
    expressId: [{ required: true, message: '请选择快递公司', trigger: 'change' }],
    codes: [
      { required: true, message: '服务编码不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (value && reg.test(value)) {
            callback(new Error('服务编码不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    interfaceCode: [
      { required: true, message: '接口编码不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (value && reg.test(value)) {
            callback(new Error('接口编码不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    username: [{ required: true, message: '登录名不能为空', trigger: 'blur' }],
    password: [{ required: false, message: '登录密码不能为空', trigger: 'blur' }],
    accessLicenseNumber: [
      { required: true, message: '访问授权码不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^[a-zA-Z0-9]*$/
          if (!reg.test(value)) {
            callback(new Error('访问授权码只能包含数字、字母'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    maximumPackages: [{ required: true, message: '运单包裹数量上限不能为空', trigger: 'blur' }],
    maximumWeightOfPackage: [{ required: true, message: '单个包裹重量上限不能为空', trigger: 'blur' }],
    weightDiscount: [{ required: true, message: '重量折扣不能为空', trigger: 'blur' }],
    numberOfCopies: [{ required: true, message: '标签一式打印份数不能为空', trigger: 'blur' }],
    labelStyle: [{ required: true, message: '请选择打印标签格式', trigger: 'change' }],
    deliveryCost: [
      { required: true, message: '国外派件成本不能为空', trigger: 'blur' }
    ],
    shippingDiscount: [{ required: true, message: '默认运费折扣不能为空', trigger: 'blur' }],
    volumetricWeightUnit: [{ required: true, message: '体积重单位不能为空', trigger: 'blur' }],
    printInvoice: [{ required: true, message: '请选择需要打印发票', trigger: 'change' }],
    ifGfp: [{ required: true, message: '请选择GFP', trigger: 'change' }],
    consignorCompany: [{ required: true, message: '公司名称不能为空', trigger: 'blur' }],
    consignorCountryCode: [{ required: true, message: '请选择国家/地区', trigger: 'change' }],
    consignorProvinceCode: [{ required: true, message: '请选择州省', trigger: 'change' }],
    consignorCityCode: [{ required: true, message: '请选择市区', trigger: 'change' }],
    consignor: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
    consignorPhone: [
      { required: true, message: '联系电话不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (value && reg.test(value)) {
            callback(new Error('联系电话不能有中文'))
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
      { required: true, message: '邮政编号不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^[a-zA-Z0-9]*$/
          if (!reg.test(value)) {
            callback(new Error('邮政编号只能包含数字、字母'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    consignorAddress1: [{ required: true, message: '联系地址1不能为空', trigger: 'blur' }],
    consignorAddress2: [{ required: false, message: '联系地址2不能为空', trigger: 'blur' }],
    consignorAddress3: [{ required: false, message: '联系地址3不能为空', trigger: 'blur' }],
    sameConsignor: [{ required: true, message: '请选择同发货方', trigger: 'change' }],
    returnCompany: [{ required: true, message: '公司名称不能为空', trigger: 'blur' }],
    returnCountryCode: [{ required: true, message: '请选择国家/地区', trigger: 'change' }],
    returnProvinceCode: [{ required: true, message: '请选择州省', trigger: 'change' }],
    returnCityCode: [{ required: true, message: '请选择市区', trigger: 'change' }],
    returnName: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
    returnPhone: [
      { required: true, message: '联系电话不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (value && reg.test(value)) {
            callback(new Error('联系电话不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],

    returnMail: [
      { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
      { type: 'email', message: '邮箱地址格式不正确', trigger: ['blur', 'change'] }
    ],
    returnZip: [
      { required: true, message: '邮政编号不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^[a-zA-Z0-9]*$/
          if (!reg.test(value)) {
            callback(new Error('邮政编号只能包含数字、字母'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    returnAddress1: [{ required: true, message: '联系地址1不能为空', trigger: 'blur' }],
    returnAddress2: [{ required: false, message: '联系地址2不能为空', trigger: 'blur' }],
    returnAddress3: [{ required: false, message: '联系地址3不能为空', trigger: 'blur' }]
  }
  private props: any = {
    label: 'name',
    value: 'id'
  }
  private isEdit: boolean = false
  private province1List: any[] = []
  private province2List: any[] = []
  private city1List: any[] = []
  private city2List: any[] = []
  private lengthList: any[] = []
  private urlList: any[] = []
  private selectLoading: boolean = false
  private formLoading: boolean = false
  private currentId = ''
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
  private setAdd() {
    this.isEdit = false
    this.getWordsList('ups_interface_api')
    this.getWordsList('LABEL_STYLE')
  }
  private async setData(val: any) {
    // 设置值
    this.isEdit = true
    this.currentId = (val || {}).id
    this.getWordsList('ups_interface_api')
    this.getWordsList('LABEL_STYLE')
    await this.getExpressPortById()
  }
  private onExpress() {
    if (this.selectForm.expressId) {
      this.geCurrencyOne()
    } else {
      this.selectForm.currency = ''
    }
  }
  private geCurrencyOne() {
    const list = (this as any).expressList
    const item = list.find((it: any) => it.id === this.selectForm.expressId) || {}
    if (!item.countryId) {
      this.selectForm.currency = ''
      return
    }
    const params: any = {
      page: 1,
      size: 9999,
      countryId: item.countryId
    }
    geCurrencyList(params)
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result || []
        this.selectForm.currency = (result[0] || {}).id
      })
      .catch((err: any) => {
        return err
      })
  }
  private onCountry() {
    this.selectForm.consignorProvinceCode = undefined
    this.selectForm.consignorCityCode = undefined
    this.province1List = []
    this.city1List = []
  }
  private onCountryCode() {
    this.selectForm.returnProvinceCode = undefined
    this.selectForm.returnCityCode = undefined
    this.province2List = []
    this.city2List = []
  }
  private onProvince() {
    this.selectForm.consignorCityCode = undefined
    this.city1List = []
  }
  private onProvinceCode() {
    this.selectForm.returnCityCode = undefined
    this.city2List = []
  }
  private getProvince(val: any) {
    this.selectLoading = true
    const id = val === '1' ? this.selectForm.consignorCountryCode : this.selectForm.returnCountryCode
    getStateByCountry(id)
      .then((res:any) => {
        const data = res.data || {}
        if (val === '1') {
          this.province1List = data.result || []
        } else {
          this.province2List = data.result || []
        }
        this.selectLoading = false
      }).catch((err:any) => {
        this.selectLoading = false
        return err
      })
  }
  private getCity(val: any) {
    this.selectLoading = true
    const id = val === '1' ? this.selectForm.consignorProvinceCode : this.selectForm.returnProvinceCode
    getCityByState(this.selectForm.consignorProvinceCode)
      .then((res:any) => {
        const data = res.data || {}
        if (val === '1') {
          this.city1List = data.result || []
        } else {
          this.city2List = data.result || []
        }
        this.selectLoading = false
      }).catch((err:any) => {
        this.selectLoading = false
        return err
      })
  }
  private async getExpressPortById() {
    this.formLoading = true
    try {
      const res = await getExpressPortById(this.currentId)
      const data = res.data || {}
      const { returnerEntity, ...form }: any = data
      const {
        id,
        returnAddress1,
        returnAddress2,
        returnAddress3,
        returnCityCode,
        returnCompany,
        returnCountryCode,
        // returnDistrictCode,
        // returnDistrictName,
        returnFax,
        returnMail,
        returnName,
        returnPhone,
        returnProvinceCode,
        returnTaxCode,
        returnZip
      }: any = returnerEntity || {}
      this.selectForm = {
        ...form,
        returnId: id,
        returnAddress1,
        returnAddress2,
        returnAddress3,
        returnCityCode,
        returnCompany,
        returnCountryCode,
        // returnDistrictCode,
        // returnDistrictName,
        returnFax,
        returnMail,
        returnName,
        returnPhone,
        returnProvinceCode,
        returnTaxCode,
        returnZip
      }
      this.geCurrencyOne()
      this.getProvince('1')
      this.getProvince('2')
      // this.getCity('1')
      // this.getCity('2')
      this.formLoading = false
    } catch (error) {
      this.formLoading = false
      return error
    }
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
          case 'ups_interface_api':
            this.urlList = data
            break
          case 'LABEL_STYLE':
            this.lengthList = data
            break
          default:
            break
        }
      }).catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  // 重置表单
  private resetForm() {
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
    const editForm: any = this.$refs.selectForm
    editForm.validate((valid: any) => {
      if (!valid) return false
      this.formLoading = true
      const {
        sameConsignor,
        consignor,
        consignorCompany,
        consignorAddress1,
        consignorAddress2,
        consignorAddress3,
        consignorCountryCode,
        consignorProvinceCode,
        consignorCityCode,
        consignorFax,
        consignorMail,
        consignorPhone,
        consignorTaxCode,
        consignorZip,
        returnId,
        returnAddress1,
        returnAddress2,
        returnAddress3,
        returnCityCode,
        returnCompany,
        returnCountryCode,
        // returnDistrictCode,
        // returnDistrictName,
        returnFax,
        returnMail,
        returnName,
        returnPhone,
        returnProvinceCode,
        returnTaxCode,
        returnZip,
        returnerEntity,
        ...form
      } = this.selectForm
      const params: any = {
        returnerEntity: {
          id: returnId,
          returnAddress1: sameConsignor === 1 ? consignorAddress1 : returnAddress1,
          returnAddress2: sameConsignor === 1 ? consignorAddress2 : returnAddress2,
          returnAddress3: sameConsignor === 1 ? consignorAddress3 : returnAddress3,
          returnCityCode: sameConsignor === 1 ? consignorCityCode : returnCityCode,
          returnCompany: sameConsignor === 1 ? consignorCompany : returnCompany,
          returnCountryCode: sameConsignor === 1 ? consignorCountryCode : returnCountryCode,
          // returnDistrictCode,
          // returnDistrictName,
          returnFax: sameConsignor === 1 ? consignorFax : returnFax,
          returnMail: sameConsignor === 1 ? consignorMail : returnMail,
          returnName: sameConsignor === 1 ? consignor : returnName,
          returnPhone: sameConsignor === 1 ? consignorPhone : returnPhone,
          returnProvinceCode: sameConsignor === 1 ? consignorProvinceCode : returnProvinceCode,
          returnTaxCode: sameConsignor === 1 ? consignorTaxCode : returnTaxCode,
          returnZip: sameConsignor === 1 ? consignorZip : returnZip
        },
        sameConsignor,
        consignor,
        consignorCompany,
        consignorAddress1,
        consignorAddress2,
        consignorAddress3,
        consignorCountryCode,
        consignorProvinceCode,
        consignorCityCode,
        consignorFax,
        consignorMail,
        consignorPhone,
        consignorTaxCode,
        consignorZip,
        ...form
      }
      const countrys: any[] = (this as any).countryList
      countrys.map((item: any) => {
        if (item.id === consignorCountryCode) {
          params.consignorCountry = item.name
        }
        if (item.id === params.returnerEntity.returnCountryCode) {
          params.returnerEntity.returnCountryName = item.name
        }
      })
      this.province1List.map((it: any) => {
        if (it.abbr === consignorProvinceCode) {
          params.consignorProvince = it.name
        }
      })
      params.consignorCity = consignorCityCode
      // this.city1List.map((it: any) => {
      //   if (it.id === consignorCityCode) {
      //     params.consignorCity = it.name
      //   }
      // })
      if (sameConsignor === 1) {
        params.returnerEntity.returnProvinceName = params.consignorProvince
        params.returnerEntity.returnCityName = params.consignorCity
      } else {
        this.province2List.map((it: any) => {
          if (it.abbr === params.returnerEntity.returnProvinceCode) {
            params.returnerEntity.returnProvinceName = it.name
          }
        })
        params.returnerEntity.returnCityName = params.returnerEntity.returnCityCode
        // this.city2List.map((it: any) => {
        //   if (it.id === params.returnerEntity.returnCityCode) {
        //     params.returnerEntity.returnCityName = it.name
        //   }
        // })
      }

      const expresses: any[] = (this as any).expressList
      expresses.map((it: any) => {
        if (it.id === params.expressId) {
          params.expressName = it.name
        }
      })
      params.custId = (this as any).custId
      params.custName = (this as any).custName
      if (this.isEdit) {
        updateExpressPort(params)
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
        addExpressPort(params)
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
.input-content {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.input-unit {
  width: 50px;
  height: 32px;
  background-color: #f5f7fa;
  color: #909399;
  padding: 0 10px;
  border: 1px solid #dcdfe6;
  border-left: 0;
  border-radius: 0 4px 4px 0;
  margin-left: -1px;
}
.input-border {
  ::v-deep .el-input__inner {
    border-radius: 4px 0 0 4px;
  }
}
</style>
