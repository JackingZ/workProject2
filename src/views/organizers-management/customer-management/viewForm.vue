<template>
  <div v-loading="detailLoading">
    <el-form
      ref="detailForm"
      :model="detailForm"
      :rules="formRules"
      label-width="110px"
      label-position="right"
      style="padding-right: 30px;"
      size="small"
    >
      <el-form-item
        label="主体类型"
        prop="entity"
      >
        {{ (entityList.find((it) => it.id === detailForm.entity) || {}).name }}
      </el-form-item>
      <el-form-item
        :label="detailForm.entity === '1' ? '公司全称' : '个人全称'"
        prop="name"
      >
        {{ detailForm.name }}
      </el-form-item>
      <el-form-item
        :label="detailForm.entity === '1' ? '公司简称' : '个人简称'"
        prop="abbr"
      >
        {{ detailForm.abbr }}
      </el-form-item>
      <el-form-item
        label="客户类型"
        prop="subtype"
      >
        {{ (subtypeList.find((it) => it.id === detailForm.subtype) || {}).name }}
      </el-form-item>
      <el-form-item
        label="英文名称"
        prop="alias"
        style="width: 66%;"
      >
        {{ detailForm.alias }}
      </el-form-item>
      <el-form-item
        label="国家/地区"
        prop="countryId"
      >
        {{ (countryList.find((it) => it.id === detailForm.countryId) || {}).name }}-
        {{ (countryList.find((it) => it.id === detailForm.countryId) || {}).alias || '' }}
      </el-form-item>
      <el-form-item
        label="州省市区"
        prop="area"
        style="width: 66%;"
      >
        <span v-show="!!detailForm.stateName">
          {{ detailForm.stateName }}
        </span>
        <span v-show="!!detailForm.cityName">
          > {{ detailForm.cityName }}
        </span>
        <span v-show="!!detailForm.countyName">
          > {{ detailForm.countyName }}
        </span>
      </el-form-item>
      <el-form-item
        label="总分标识"
        prop="branch"
      >
        {{ (branchList.find((it) => it.id === detailForm.branch) || {}).name }}
      </el-form-item>
      <el-form-item
        label="合作期限"
        prop="cooperate"
      >
        {{ detailForm.cooperate }}
      </el-form-item>
      <el-form-item
        label="签署合同"
      >
        {{ (signList.find((it) => it.id === detailForm.signContract) || {}).name }}
      </el-form-item>
      <el-form-item
        label="添加来源"
        prop="source"
      >
        {{ (sourceList.find((it) => it.id === detailForm.source) || {}).name }}
      </el-form-item>
      <el-form-item
        label="客户来源"
        prop="custSource"
      >
        {{ (CustSourceList.find((it) => it.id === detailForm.custSource) || {}).name }}
      </el-form-item>

      <el-form-item
        label="证件信息"
        prop="certNumber"
      >
        {{ (certTypeList.find((it) => it.id === detailForm.certType) || {}).name }}
        {{ detailForm.certNumber }}
      </el-form-item>
      <el-form-item
        prop=""
        label="客户编码"
      >
        {{ detailForm.custCode }}
      </el-form-item>
      <div v-if="detailForm.entity === '1'">
        <div class="form-line" />
        <el-form-item
          label="营业执照"
          prop="licenseCode"
        >
          {{ detailForm.licenseCode }}
        </el-form-item>
        <el-form-item
          label="成立日期"
          prop="setupDate"
        >
          {{ detailForm.setupDate }}
        </el-form-item>
        <el-form-item
          prop="companySize"
          label="公司规模"
        >
          {{ detailForm.companySize }} 人
        </el-form-item>

        <el-form-item
          prop="registeredCapital"
          label="注册资金"
        >
          {{ detailForm.registeredCapital }}
        </el-form-item>
        <el-form-item
          prop="saleType"
          label="销售类型"
        >
          {{ detailForm.saleType === '1' ? '平台' : detailForm.saleType === '2' ? '线下' : '' }}
        </el-form-item>

        <el-form-item
          prop="platform"
          label="平台"
        >
          {{ (platList.find((it) => it.value === detailForm.platform) || {}).label }}
        </el-form-item>
        <el-form-item
          label="公司法人"
          prop="legal"
        >
          {{ detailForm.legal }}
        </el-form-item>
        <el-form-item
          label="证照地址"
          prop="licenseAddress"
          style="width: 66%;"
        >
          {{ detailForm.licenseAddress }}
        </el-form-item>
        <el-form-item
          prop="storeLink"
          label="店铺链接"
        >
          {{ detailForm.storeLink }}
        </el-form-item>

        <el-form-item
          prop="brand"
          label="品牌"
        >
          {{ detailForm.brand }}
        </el-form-item>

        <el-form-item
          prop="trademark"
          label="驰名商标"
        >
          {{ detailForm.trademark }}
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
            disabled
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
            disabled
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
            disabled
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
      <el-button
        type="primary"
        @click="cancel"
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
import {
  getCustomer as getItemDetail,
  getWordsList,
  getCountryList
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
    countryName: undefined,
    stateName: undefined,
    cityName: undefined,
    countyName: undefined,
    branch: undefined,
    cooperate: undefined,
    source: undefined,
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
    signContract: undefined
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
    signList: {
      type: Array,
      default: () => {
        return []
      }
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
    area: [{ required: true, message: '请选择州省市区', trigger: 'change' }],
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
  private areaList: any[] = []
  private companyList: any[] = []
  private activeName: any = 'first'
  private ifCode: boolean = false
  private imgShow: boolean = false
  private imgUrl: any = ''
  private img1Url: any = ''
  private img2Url: any = ''
  private img3Url: any = ''

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
  private setData(row: any) {
    this.getCountryList()
    this.getPlatList()
    this.getItemDetail(row.id)
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
  // 证照
  private showImgMagnify(key: any) {
    this.imgShow = true
    this.imgUrl = key === 'img1Url' ? this.img1Url : key === 'img2Url' ? this.img2Url : this.img3Url
  }

  private getItemDetail(id: string): void {
    this.detailLoading = true
    getItemDetail({ id })
      .then(async(res: any) => {
        const data = res.data || {}
        const { cooperate, docs, ...form } = data
        this.detailForm = {
          ...form,
          cooperate: cooperate ? cooperate.replace(',', '-') : ''
        }
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
    this.areaList = []
    this.img1Url = ''
    this.img2Url = ''
    this.img3Url = ''
    this.clearValidate()
  }
  private cancel() {
    this.resetForm()
    this.$emit('close')
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  display: inline-block;
  width: 33.3%;
  vertical-align: top;
  margin-bottom: 0;
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
.el-icon-zoom-in {
  margin-top: 65px;
  cursor: pointer;
}
</style>
