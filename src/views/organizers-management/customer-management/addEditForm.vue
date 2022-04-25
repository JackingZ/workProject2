<template>
  <div v-loading="detailLoading">
    <el-form
      ref="detailForm"
      :model="detailForm"
      :rules="formRules"
      label-width="100px"
      label-position="right"
      class="customer-form"
      size="small"
    >
      <el-form-item
        v-if="!isEdit && custType === '0'"
        label="一级代理商"
        prop="parentId"
      >
        <el-select
          v-model="detailForm.parentId"
          :loading="selectLoading"
          size="small"
          filterable
          clearable
          placeholder="请选择"
          style="width:100%;"
          @focus="getAgentList('1')"
          @change="onParent"
        >
          <el-option
            v-for="item in agentList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="!isEdit && custType === '0'"
        label="二级代理商"
        prop=""
      >
        <el-select
          v-model="detailForm.agentId"
          :disabled="!detailForm.parentId"
          :loading="selectLoading"
          size="small"
          clearable
          filterable
          placeholder="请选择"
          style="width:100%;"
          @focus="getAgentList('2')"
          @change="onAgent"
        >
          <el-option
            v-for="item in agent2List"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="!isEdit && custType === '2' && custSubtype === '1'"
        label="公司类型"
        prop="custTag"
      >
        <el-select
          v-model="detailForm.custTag"
          size="small"
          style="width:100%;"
          placeholder="请选择"
          @change="onComType"
        >
          <el-option
            v-for="(item, index) in companyTypeList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="!isEdit && custType === '2' && custSubtype === '1' && detailForm.custTag === '2'"
        label="所属公司"
        prop="comId"
      >
        <el-select
          v-model="detailForm.comId"
          :loading="selectLoading"
          size="small"
          style="width:100%;"
          placeholder="请选择"
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
      </el-form-item>
      <el-form-item
        label="主体类型"
        prop="entity"
      >
        <el-select
          v-model="detailForm.entity"
          style="width:100%;"
          placeholder="请选择"
          filterable
          clearable
          @change="onEntity"
        >
          <el-option
            v-for="item in entityList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="detailForm.entity === '1' ? '公司全称' : '个人全称'"
        prop="name"
      >
        <el-input
          v-model="detailForm.name"
          type="text"
          clearable
          :maxlength="50"
          placeholder="请输入"
          style="width: 100%;"
        />
      </el-form-item>
      <el-form-item
        :label="detailForm.entity === '1' ? '公司简称' : '个人简称'"
        prop="abbr"
      >
        <el-input
          v-model="detailForm.abbr"
          type="text"
          clearable
          :maxlength="10"
          placeholder="请输入"
          style="width: 100%;"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="客户类型"
        prop="subtype"
      >
        <el-select
          v-model="detailForm.subtype"
          style="width:100%;"
          placeholder="请选择"
          filterable
          clearable
        >
          <el-option
            v-for="item in subtypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="英文名称"
        prop="alias"
      >
        <el-input
          v-model="detailForm.alias"
          type="text"
          clearable
          :maxlength="50"
          placeholder="请输入"
          style="width: 100%;"
        />
      </el-form-item>
      <el-form-item
        label="国家/地区"
        prop="countryId"
      >
        <el-select
          v-model="detailForm.countryId"
          :loading="selectLoading"
          placeholder="国家/地区"
          style="width: 100%;"
          clearable
          size="small"
          filterable
          @focus="getCountryList"
          @change="onCountryChange"
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
        prop="stateId"
      >
        <el-select
          v-model="detailForm.stateId"
          :loading="selectLoading"
          placeholder="请选择"
          clearable
          :disabled="!detailForm.countryId"
          filterable
          style="width: 100%"
          @focus="getStateList"
          @change="onStateChange"
        >
          <el-option
            v-for="item in stateList"
            :key="item.id"
            :label="`${item.name}-${item.alias}`"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="城市"
        prop="cityId"
      >
        <el-select
          v-model="detailForm.cityId"
          :loading="selectLoading"
          placeholder="请选择"
          clearable
          :disabled="!detailForm.stateId"
          filterable
          style="width: 100%"
          @focus="getCityList"
          @change="onCityChange"
        >
          <el-option
            v-for="item in cityList"
            :key="item.id"
            :label="`${item.name}-${item.alias}`"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="区/县"
        prop="countyId"
      >
        <el-select
          v-model="detailForm.countyId"
          :loading="selectLoading"
          placeholder="区/县"
          clearable
          :disabled="!detailForm.cityId"
          filterable
          style="width:100%;"
          @focus="getCountyList"
        >
          <el-option
            v-for="item in countyList"
            :key="item.id"
            :label="`${item.name}-${item.alias}`"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="总分标识"
        prop="branch"
      >
        <el-select
          v-model="detailForm.branch"
          style="width:100%;"
          placeholder="请选择"
          filterable
          clearable
        >
          <el-option
            v-for="item in branchList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="合作期限"
        prop="cooperate"
      >
        <el-date-picker
          v-model="detailForm.cooperate"
          type="daterange"
          unlink-panels
          size="small"
          style="width:100%;"
          range-separator="~"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item
        label="添加来源"
        prop="source"
      >
        <el-select
          v-model="detailForm.source"
          style="width:100%;"
          placeholder="请选择"
          filterable
          clearable
        >
          <el-option
            v-for="item in sourceList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="客户来源"
        prop="custSource"
      >
        <el-select
          v-model="detailForm.custSource"
          style="width:100%;"
          placeholder="请选择"
          filterable
          clearable
        >
          <el-option
            v-for="item in CustSourceList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="证件信息"
        prop="certNumber"
      >
        <el-input
          v-model="detailForm.certNumber"
          placeholder="请输入内容"
          clearable
          style="width: 100%;"
          size="small"
          :maxlength="20"
        >
          <el-select
            slot="prepend"
            v-model="detailForm.certType"
            size="small"
            style="width:100px;"
            placeholder="请选择"
          >
            <el-option
              v-for="item in certTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item
        prop=""
        label="客户编码"
      >
        <el-input
          v-model="detailForm.custCode"
          :disabled="(isEdit && ifCode)"
          clearable
          style="width: 100%"
          size="small"
          :maxlength="25"
        />
      </el-form-item>
      <div v-if="detailForm.entity === '1'">
        <div class="form-line" />
        <el-form-item
          label="营业执照"
          prop="licenseCode"
        >
          <el-input
            v-model="detailForm.licenseCode"
            type="text"
            clearable
            :maxlength="20"
            placeholder="请输入"
            style="width: 100%;"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="成立日期"
          prop="setupDate"
        >
          <el-date-picker
            v-model="detailForm.setupDate"
            :picker-options="pickerOptions"
            type="date"
            style="width: 100%;"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="年/月/日"
          />
        </el-form-item>
        <el-form-item
          prop="companySize"
          label="公司规模"
        >
          <el-input
            v-model="detailForm.companySize"
            placeholder="请输入"
            clearable
            :maxlength="100"
            @blur="companySizeBlur"
          >
            <span
              slot="append"
            >
              人
            </span>
          </el-input>
        </el-form-item>

        <el-form-item
          prop="registeredCapital"
          label="注册资金"
        >
          <el-input-number
            v-model="detailForm.registeredCapital"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="999999999999"
            :precision="2"
          />
        </el-form-item>

        <el-form-item
          prop="saleType"
          label="销售类型"
        >
          <el-select
            v-model="detailForm.saleType"
            placeholder="请选择"
            clearable
            filterable
            style="width:100%;"
            size="small"
          >
            <el-option
              label="平台"
              value="1"
            />
            <el-option
              label="线下"
              value="2"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          prop="platform"
          label="平台"
        >
          <el-select
            v-model="detailForm.platform"
            :loading="selectLoading"
            placeholder="请选择"
            clearable
            filterable
            style="width:100%;"
            size="small"
            @focus="getPlatList"
          >
            <el-option
              v-for="item in platList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="公司法人"
          prop="legal"
        >
          <el-input
            v-model="detailForm.legal"
            type="text"
            clearable
            :maxlength="20"
            placeholder="请输入"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item
          label="证照地址"
          prop="licenseAddress"
        >
          <el-input
            v-model="detailForm.licenseAddress"
            type="text"
            clearable
            :maxlength="100"
            placeholder="请输入"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item
          prop="storeLink"
          label="店铺链接"
        >
          <el-input
            v-model="detailForm.storeLink"
            clearable
            style="width: 100%"
            size="small"
            :maxlength="50"
          />
        </el-form-item>

        <el-form-item
          prop="brand"
          label="品牌"
        >
          <el-input
            v-model="detailForm.brand"
            clearable
            style="width: 100%"
            size="small"
            :maxlength="50"
          />
        </el-form-item>

        <el-form-item
          prop="trademark"
          label="驰名商标"
        >
          <el-input
            v-model="detailForm.trademark"
            clearable
            style="width: 100%"
            size="small"
            :maxlength="50"
          />
        </el-form-item>
      </div>
      <el-form-item
        label="证照上传"
        class="is-required"
        style="width: 100%;margin-bottom: 0;"
      >
        <div
          v-if="detailForm.entity === '1'"
          style="display: inline-block;margin-right: 50px;"
        >
          <el-upload
            class="avatar"
            action
            :show-file-list="false"
            :before-upload="beforeUpload1"
            :on-change="changeFile1"
          >
            <div
              v-if="img1Url"
              class="img-show"
            >
              <img
                :src="img1Url"
                class="avatar-img"
              >
              <span
                class="img-action"
                @click.stop=""
              >
                <i
                  class="el-icon-zoom-in"
                  @click.stop="showImgMagnify('img1Url')"
                />
                <i
                  class="el-icon-delete"
                  @click.stop="removeFile('img1Url')"
                />
              </span>
            </div>
            <i
              v-else
              class="el-icon-plus avatar-icon"
            />
          </el-upload>
          <div style="line-height: 20px;text-align: center;">
            营业执照
          </div>
        </div>

        <div style="display: inline-block;margin-right: 50px;">
          <el-upload
            class="avatar"
            action
            :show-file-list="false"
            :before-upload="beforeUpload2"
            :on-change="changeFile2"
          >
            <div
              v-if="img2Url"
              class="img-show"
            >
              <img
                :src="img2Url"
                class="avatar-img"
              >
              <span
                class="img-action"
                @click.stop=""
              >
                <i
                  class="el-icon-zoom-in"
                  @click.stop="showImgMagnify('img2Url')"
                />
                <i
                  class="el-icon-delete"
                  @click.stop="removeFile('img2Url')"
                />
              </span>
            </div>
            <i
              v-else
              class="el-icon-plus avatar-icon"
            />
          </el-upload>
          <div style="line-height: 20px;text-align: center;">
            身份证正面照
          </div>
        </div>

        <div
          style="display: inline-block;margin-right: 50px;"
        >
          <el-upload
            class="avatar"
            action
            :show-file-list="false"
            :before-upload="beforeUpload3"
            :on-change="changeFile3"
          >
            <div
              v-if="img3Url"
              class="img-show"
            >
              <img
                :src="img3Url"
                class="avatar-img"
              >
              <span
                class="img-action"
                @click.stop=""
              >
                <i
                  class="el-icon-zoom-in"
                  @click.stop="showImgMagnify('img3Url')"
                />
                <i
                  class="el-icon-delete"
                  @click.stop="removeFile('img3Url')"
                />
              </span>
            </div>
            <i
              v-else
              class="el-icon-plus avatar-icon"
            />
          </el-upload>
          <div style="line-height: 20px;text-align: center;">
            身份证反面照
          </div>
        </div>
      </el-form-item>
    </el-form>

    <div style="text-align: right;margin-top: 10px;">
      <el-button @click="cancel">
        取 消
      </el-button>
      <el-button
        type="primary"
        @click="confirm"
      >
        确 定
      </el-button>
    </div>

    <el-dialog
      title="证照图片"
      :visible.sync="imgShow"
      :close-on-click-modal="false"
      append-to-body
      width="500px"
      @closed=";(imgShow = false)"
    >
      <img
        :src="imgUrl"
        style="display: block;height: 100%;width: 100%;object-fit: contain;"
      >
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import dayjs from 'dayjs'
import {
  getCustomer as getItemDetail,
  getAgentList,
  getWordsList,
  getCountryList,
  getStateByCountry,
  getCityByState,
  getCountyByCity,
  saveCustomer,
  getUnFinanceAgentList
} from '@/api/jht-customer-management'
function formParam() {
  return {
    abbr: undefined,
    subtype: undefined,
    parentId: undefined,
    parentName: undefined,
    agentId: undefined,
    agentName: undefined,
    comId: undefined,
    comName: undefined,
    custTag: '1',
    alias: undefined,
    countyId: undefined,
    stateId: undefined,
    cityId: undefined,
    countryName: undefined,
    stateName: undefined,
    cityName: undefined,
    countyName: undefined,
    branch: undefined,
    cooperate: undefined,
    source: undefined,
    custSource: undefined,
    entity: '0',
    name: undefined,
    licenseCode: undefined,
    setupDate: undefined,
    legal: undefined,
    certType: '0',
    licenseAddress: undefined,
    certNumber: undefined,
    storeLink: undefined,
    brand: undefined,
    trademark: undefined,
    cooperationAmount: undefined,
    saleType: undefined,
    platform: undefined,
    companySize: undefined,
    custCode: undefined,
    registeredCapital: undefined,
    signContract: undefined,
    img1Data: undefined,
    img2Data: undefined,
    img3Data: undefined
  }
}
@Component({
  name: 'detail',
  components: {},
  props: {
    subtypeList: {
      type: Array,
      default: () => {
        return []
      }
    },
    companyTypeList: {
      type: Array,
      default: () => {
        return []
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  }
})
export default class extends Vue {
  private detailForm: any = formParam()
  private formRules = {
    abbr: [
      { required: true, message: '简称不能为空', trigger: 'blur' }
    ],
    subtype: [{ required: true, message: '请选择客户类型', trigger: 'change' }],
    parentId: [{ required: true, message: '请选择一级代理商', trigger: 'change' }],
    custTag: [{ required: true, message: '请选择公司类型', trigger: 'change' }],
    comId: [{ required: true, message: '请选择分公司', trigger: 'change' }],
    alias: [
      { required: true, message: '英文名称不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (!value) {
            callback(new Error('英文名称不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('英文名称不能有中'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    countryId: [
      { required: true, message: '请选择国家/地区', trigger: 'change' }
    ],
    stateId: [{ required: true, message: '请选择州/省', trigger: 'change' }],
    cityId: [{ required: true, message: '请选择城市', trigger: 'change' }],
    countyId: [{ required: false, message: '请选择区/县', trigger: 'change' }],
    branch: [
      { required: true, message: '请选择总分标识', trigger: 'change' }
    ],
    cooperate: [
      { required: true, message: '请选择合作期限', trigger: 'change' },
      { validator(rule: any, value: any, callback: (val?: any) => void) {
        if (!value) {
          callback(new Error('请选择合作期限'))
        } else if (Array.isArray(value) && value[0] === value[1]) {
          callback(new Error('合作期格式开始日期必须小于结束日期'))
        } else {
          callback()
        }
      },
      trigger: 'change'
      }
    ],
    source: [
      { required: true, message: '请选择添加来源', trigger: 'change' }
    ],
    entity: [
      { required: true, message: '请选择主体类型', trigger: 'change' }
    ],
    certNumber: [
      { required: true, message: '证件信息不能为空', trigger: 'blur' }
      // { validator(rule: any, value: any, callback: (val?: any) => void) {
      //   const reg = /^[A-Z0-9]+$/
      //   if (!reg.test(value)) {
      //     callback(new Error('证件信息为数字或大写英文字母'))
      //   } else {
      //     callback()
      //   }
      // },
      // trigger: 'blur'
      // }
    ],
    name: [
      { required: true, message: '全称不能为空', trigger: 'blur' }
    ],
    licenseCode: [
      { required: true, message: '营业执照不能为空', trigger: 'blur' }
      // { validator(rule: any, value: any, callback: (val?: any) => void) {
      //   const reg = /^[A-Z0-9]+$/
      //   if (!reg.test(value)) {
      //     callback(new Error('营业执照为数字和大写字母'))
      //   } else {
      //     callback()
      //   }
      // },
      // trigger: 'blur'
      // }
    ],
    setupDate: [{ required: true, message: '请选择成立日期', trigger: 'change' }],
    legal: [{ required: true, message: '公司法人不能为空', trigger: 'blur' }],
    licenseAddress: [{ required: true, message: '证照地址不能为空', trigger: 'blur' }],
    saleType: [
      { required: true, message: '请选择销售类型', trigger: 'change' }
    ],
    platform: [
      { required: true, message: '请选择平台', trigger: 'change' }
    ],
    companySize: [
      { required: true, message: '公司规模不能为空', trigger: 'blur' }
    ],
    registeredCapital: [
      { required: true, message: '注册资金不能为空', trigger: 'blur' }
    ],
    cooperationAmount: [
      { required: true, message: '合作金额不能为空', trigger: 'blur' }
    ]
  }
  private branchList = [
    { name: '总部', id: '0' },
    { name: '分公司', id: '1' }
  ]
  private entityList = [
    { name: '个人', id: '0' },
    { name: '企业', id: '1' }
  ]
  private sourceList = [
    { name: '自助注册', id: '0' },
    { name: '邀请注册', id: '1' },
    { name: '后台添加', id: '2' }
  ]
  private CustSourceList = [
    { name: '业务自主开发', id: '1' },
    { name: '市场部', id: '2' },
    { name: '总经办', id: '3' },
    { name: '客户转介绍', id: '4' },
    { name: '其他', id: '5' }
  ]
  private certTypeList = [
    { name: '身份证', id: '0' },
    { name: '其它证件', id: '1' }
  ]
  private props: any = {
    value: 'id',
    label: 'name'
  }
  private detailLoading: boolean = false
  private selectLoading: boolean = false
  private agentList: any[] = []
  private agent2List: any[] = []
  private countryList: any[] = []
  private platList: any[] = []
  private stateList: any[] = []
  private cityList: any[] = []
  private countyList: any[] = []
  private companyList: any[] = []
  private fileList: any[] = []
  private activeName: any = 'first'
  private ifCode: boolean = false
  private imgShow: boolean = false
  private imgUrl: any = ''
  private img1Url: any = ''
  private img2Url: any = ''
  private img3Url: any = ''
  private file1: any = ''
  private file2: any = ''
  private file3: any = ''

  // computed
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
  get custName(): string {
    const info = UserModule.info || {}
    const custName = (info as any).custName
    return custName
  }
  get pickerOptions() {
    return {
      disabledDate(time: any) {
        return time.getTime() > Date.now()
      }
    }
  }

  // methods
  private companySizeBlur() {
    const reg = /^[0-9]*$/
    if (!reg.test(this.detailForm.companySize)) {
      this.detailForm.companySize = ''
    }
  }
  private setData(row: any) {
    this.ifCode = !!row.custCode
    this.getCountryList()
    this.getPlatList()
    this.getItemDetail(row.id)
  }
  private handleClick() {
    //
  }
  private onParent() {
    this.agent2List = []
    this.detailForm.agentId = undefined
    this.detailForm.agentName = undefined
  }
  private onAgent(id: any) {
    this.detailForm.agentName = undefined
    const item = this.agent2List.find((it: any) => it.id === id)
    if (item) {
      this.detailForm.agentName = item.name
    }
  }
  private async getAgentList(val: any) {
    this.selectLoading = true
    await getAgentList({
      page: 1,
      size: 999999,
      parentId: val === '1' ? (this as any).custId : this.detailForm.parentId
    })
      .then(res => {
        const data = res.data || {}
        const result = data.result || []
        if (val === '1') {
          this.agentList = result
        } else {
          this.agent2List = result
        }
        this.selectLoading = false
      })
      .catch(err => {
        this.selectLoading = false
        return err
      })
  }
  private onComType() {
    // 仅一级代理商可操作
    this.detailForm.comId = ''
    this.detailForm.comName = ''
    this.detailForm.custId = ''
    this.detailForm.custName = ''
    if (this.detailForm.custTag === '1') {
      this.detailForm.custId = (this as any).custId
      this.detailForm.custName = (this as any).custName
    }
  }
  private onCompany() {
    this.detailForm.comName = ''
    const item = this.companyList.find((it: any) => it.id === this.detailForm.comId)
    if (item) {
      this.detailForm.comName = item.name
    }
  }
  private getCompanyList() {
    this.selectLoading = true
    getUnFinanceAgentList()
      .then((res:any) => {
        const data = res.data || []
        this.companyList = data
        this.selectLoading = false
      }).catch((err:any) => {
        this.selectLoading = false
        return err
      })
  }

  private getPlatList() {
    this.selectLoading = true
    getWordsList({
      type: 'CUST_PLATFORM'
    })
      .then((res: any) => {
        const data = res.data || []
        this.platList = data
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
  private async getStateList() {
    if (!this.detailForm.countryId) return
    this.selectLoading = true
    await getStateByCountry(this.detailForm.countryId).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      const result = data.result || []
      this.stateList = result
    }).catch(() => {
      this.stateList = []
      this.selectLoading = false
    })
  }
  private async getCityList() {
    if (!this.detailForm.stateId) return
    this.selectLoading = true
    await getCityByState(this.detailForm.stateId).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      const result = data.result || []
      this.cityList = result
    }).catch(() => {
      this.cityList = []
      this.selectLoading = false
    })
  }
  private async getCountyList() {
    if (!this.detailForm.cityId) return
    this.selectLoading = true
    await getCountyByCity(this.detailForm.cityId)
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result || []
        this.countyList = result
        this.selectLoading = false
      })
      .catch(() => {
        this.countyList = []
        this.selectLoading = false
      })
  }

  private async onCountryChange() {
    this.detailForm.stateId = ''
    this.onStateChange()
  }
  private onStateChange() {
    this.detailForm.cityId = ''
    this.onCityChange()
  }
  private onCityChange() {
    this.detailForm.countyId = ''
  }

  private onEntity() {
    if (this.detailForm.entity !== '1') {
      this.detailForm.name = undefined
      this.detailForm.licenseCode = undefined
      this.detailForm.setupDate = undefined
      this.detailForm.legal = undefined
      this.detailForm.licenseAddress = undefined
      this.detailForm.storeLink = undefined
      this.detailForm.brand = undefined
      this.detailForm.trademark = undefined
      this.detailForm.cooperationAmount = undefined
      this.detailForm.saleType = undefined
      this.detailForm.platform = undefined
      this.detailForm.companySize = undefined
      this.detailForm.registeredCapital = undefined
    }
  }
  // 证照
  private showImgMagnify(key: any) {
    this.imgShow = true
    this.imgUrl = key === 'img1Url' ? this.img1Url : key === 'img2Url' ? this.img2Url : this.img3Url
  }
  private async uploadFile() {
    if (this.detailForm.entity === '1' && this.file1) {
      await this.$upload(false, this.file1.raw, `jht-admin/companys/customer/business-license/${dayjs().valueOf() + '/' + this.file1.name}`)
        .then((res: any) => {
          this.detailForm.img1Data = {
            path: res.data || '',
            name: this.file1.name,
            type: '1'
          }
        })
        .catch((err: any) => {
          this.$message.error('文件上传失败')
          this.detailLoading = false
          return err
        })
    }
    if (this.file2) {
      // 公开库true
      await this.$upload(false, this.file2.raw, `jht-admin/companys/customer/business-license/${dayjs().valueOf() + '/' + this.file2.name}`)
        .then((res: any) => {
          this.detailForm.img2Data = {
            path: res.data || '',
            name: this.file2.name,
            type: '2'
          }
        })
        .catch((err: any) => {
          this.$message.error('文件上传失败')
          this.detailLoading = false
          return err
        })
    }
    if (this.file3) {
      await this.$upload(false, this.file3.raw, `jht-admin/companys/customer/business-license/${dayjs().valueOf() + '/' + this.file3.name}`)
        .then((res: any) => {
          this.detailForm.img3Data = {
            path: res.data || '',
            name: this.file3.name,
            type: '3'
          }
        })
        .catch((err: any) => {
          this.$message.error('文件上传失败')
          this.detailLoading = false
          return err
        })
    }
  }
  private changeFile1(file: any, fileList: any[]) {
    this.file1 = file
    this.img1Url = URL.createObjectURL(file.raw)
  }
  private changeFile2(file: any, fileList: any[]) {
    this.file2 = file
    this.img2Url = URL.createObjectURL(file.raw)
  }
  private changeFile3(file: any, fileList: any[]) {
    this.file3 = file
    this.img3Url = URL.createObjectURL(file.raw)
  }
  private removeFile(key: string) {
    switch (key) {
      case 'img1Url':
        this.img1Url = ''
        this.detailForm.img1Data = ''
        break
      case 'img2Url':
        this.img2Url = ''
        this.detailForm.img2Data = ''
        break
      case 'img3Url':
        this.img3Url = ''
        this.detailForm.img3Data = ''
        break
      default:
        break
    }
  }
  private beforeUpload1(file: any) {
    const isJPG = file.type.indexOf('image') !== -1
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isJPG) {
      this.$message.error('上传照片只能是图片格式!')
    }
    if (!isLt2M) {
      this.$message.error('上传照片大小不能超过 2MB!')
    }
    if (!isJPG || !isLt2M) {
      this.removeFile('img1Url')
    }
    return isJPG && isLt2M
  }
  private beforeUpload2(file: any) {
    const isJPG = file.type.indexOf('image') !== -1
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isJPG) {
      this.$message.error('上传照片只能是图片格式!')
    }
    if (!isLt2M) {
      this.$message.error('上传照片大小不能超过 2MB!')
    }
    if (!isJPG || !isLt2M) {
      this.removeFile('img2Url')
    }
    return isJPG && isLt2M
  }
  private beforeUpload3(file: any) {
    const isJPG = file.type.indexOf('image') !== -1
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isJPG) {
      this.$message.error('上传照片只能是图片格式!')
    }
    if (!isLt2M) {
      this.$message.error('上传照片大小不能超过 2MB!')
    }
    if (!isJPG || !isLt2M) {
      this.removeFile('img3Url')
    }
    return isJPG && isLt2M
  }

  private removeUpload() {
    this.fileList.map((it: any) => {
      if (it.type === '1' && it.path && it.path !== this.detailForm.img1Data.path) {
        this.$deleteLoad(it.path, false)
          .catch((err: any) => {
            return err
          })
      }
      if (it.type === '2' && it.path && it.path !== this.detailForm.img2Data.path) {
        this.$deleteLoad(it.path, false)
          .catch((err: any) => {
            return err
          })
      }
      if (it.type === '3' && it.path && it.path !== this.detailForm.img3Data.path) {
        this.$deleteLoad(it.path, false)
          .catch((err: any) => {
            return err
          })
      }
    })
  }

  private getItemDetail(id: string): void {
    this.detailLoading = true
    getItemDetail({ id })
      .then(async(res: any) => {
        const data = res.data || {}
        const { cooperate, docs, ...form } = data
        this.detailForm = {
          ...form,
          cooperate: (cooperate || '').split(',')
        }
        this.fileList = JSON.parse(JSON.stringify(docs))
        docs.map((it: any) => {
          if (it.type === '1') {
            this.img1Url = it.fileUrl
            this.detailForm.img1Data = it
          }
          if (it.type === '2') {
            this.img2Url = it.fileUrl
            this.detailForm.img2Data = it
          }
          if (it.type === '3') {
            this.img3Url = it.fileUrl
            this.detailForm.img3Data = it
          }
        })
        try {
          await this.getStateList()
          await this.getCityList()
          await this.getCountyList()
        } catch (error) {
          this.detailLoading = false
        }
        this.detailLoading = false
      })
      .catch((err: any) => {
        this.detailLoading = false
        return err
      })
  }

  private clearValidate() {
    const detailForm: any = this.$refs.detailForm
    this.$nextTick(() => {
      detailForm.clearValidate()
    })
  }

  // 重置表单
  private resetForm() {
    this.detailForm = formParam()
    this.activeName = 'first'
    this.ifCode = false
    this.stateList = []
    this.cityList = []
    this.countyList = []
    this.fileList = []
    this.img1Url = ''
    this.img2Url = ''
    this.img3Url = ''
    this.file1 = ''
    this.file2 = ''
    this.file3 = ''
    this.clearValidate()
  }
  private cancel() {
    this.resetForm()
    this.$emit('close')
  }
  private confirm() {
    // 聚货通没有客户
    const editForm: any = this.$refs.detailForm
    editForm.validate(async(valid: any) => {
      if (!valid) return false
      if (this.detailForm.entity === '1' && !this.img1Url) {
        this.$message.error('请上传营业执照')
        return
      }
      if (!this.img2Url || !this.img3Url) {
        this.$message.error('请上传法人或个人身份证正反照')
        return
      }
      this.detailLoading = true
      await this.uploadFile()
      const { parentId, parentName, agentId, agentName, comId, comName, custTag, img1Data, img2Data, img3Data, ...form } = this.detailForm
      if (this.detailForm.entity === '1' && !img1Data) {
        this.detailLoading = false
        return
      }
      if (!img2Data || !img3Data) {
        this.detailLoading = false
        return
      }
      const params: any = {
        ...form
      }
      if (!(this as any).isEdit) {
        const ctype = (this as any).custType
        const stype = (this as any).custSubtype
        if (ctype === '0' && parentId && !agentId) {
          params.parentName = parentName
          params.parentId = parentId
        } else if (ctype === '0' && parentId && agentId) {
          params.parentName = agentName
          params.parentId = agentId
        } else if (ctype === '2' && stype === '1' && custTag === '2') {
          params.parentName = comName
          params.parentId = comId
        } else {
          params.parentName = (this as any).custName
          params.parentId = (this as any).custId
        }
      } else {
        params.parentName = parentName
        params.parentId = parentId
      }
      params.cooperate = params.cooperate.join(',')
      const countryName = (this.countryList.find((item: any) => item.id === params.countryId) || {}).name
      const stateName = (this.stateList.find((item: any) => item.id === params.stateId) || {}).name
      const cityName = (this.cityList.find((item: any) => item.id === params.cityId) || {}).name
      const countyName = (this.countyList.find((item: any) => item.id === params.countyId) || {}).name
      Object.assign(params, { countryName, stateName, cityName, countyName })
      const docs: any[] = [ img1Data, img2Data, img3Data ]
      params.docs = docs.filter((it: any) => it && it.path)
      saveCustomer(params)
        .then((res: any) => {
          this.detailLoading = false
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.removeUpload()
          this.cancel()
          this.$emit('getTableList')
        })
        .catch((err: any) => {
          this.detailLoading = false
          return err
        })
    })
  }
}
</script>

<style lang="scss" scoped>
.customer-form {
  padding-right: 30px;
  height: 488px;
  overflow-y: auto;
}
.el-form-item {
  display: inline-block;
  width: 33.3%;
}
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
.form-line {
  width: 100%;
  border: 1px solid #efeff4;
  margin-left: 15px;
  margin-bottom: 18px;
}

::v-deep .el-upload {
  display: inline-block;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  height: 150px;
  overflow: hidden;
}
::v-deep .el-upload:hover {
  border-color: #409EFF;
}

.avatar {
  display: inline-block;
  width: 225px;
  height: 150px;
}
.avatar-icon {
  font-size: 28px;
  color: #8c939d;
  width: 225px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar-img {
  width: 225px;
  height: 150px;
  display: inline-block;
}
::v-deep .img-show:hover .img-action {
  opacity: 1;
}
.img-show {
  height: 150px;
}
.img-action {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  cursor: default;
  text-align: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: rgba(0,0,0,.5);
  transition: opacity .3s;
}
.el-icon-delete, .el-icon-zoom-in {
  margin: 65px 20px 0;
  cursor: pointer;
}
</style>
