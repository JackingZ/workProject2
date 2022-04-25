<template>
  <div>
    <el-dialog
      :title="isEdit ? '编辑设置' : '新增设置'"
      :visible="isSettingFormShow"
      :close-on-click-modal="false"
      width="850px"
      @close="cancel"
    >
      <div
        v-loading="isSettingFormLoading"
        class="add-edit-organ"
      >
        <div v-loading="fileLoading">
          <el-form
            ref="editForm"
            :model="settingForm"
            :rules="formRules"
            label-width="100px"
            label-position="right"
            size="small"
            style="padding-right: 20px;"
          >
            <el-form-item
              label="设置类型"
              prop="type"
            >
              <el-select
                v-model="settingForm.type"
                placeholder="请选择"
                style="width:100%;"
                clearable
                filterable
                size="small"
                @change=";(settingForm.open = '1')"
              >
                <el-option
                  v-for="item in settingTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="联系人"
              prop="contact"
            >
              <el-input
                v-model="settingForm.contact"
                :maxlength="10"
                show-word-limit
                size="small"
                placeholder="请输入"
              />
            </el-form-item>
            <el-form-item
              label="国家/地区"
              prop="countryId"
            >
              <el-select
                v-model="settingForm.countryId"
                style="width:100%;"
                placeholder="请选择"
                filterable
                clearable
                size="small"
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
                v-model="settingForm.stateId"
                :loading="selectLoading"
                placeholder="请选择"
                clearable
                :disabled="!settingForm.countryId"
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
                v-model="settingForm.cityId"
                :loading="selectLoading"
                placeholder="请选择"
                clearable
                :disabled="!settingForm.stateId"
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
                v-model="settingForm.countyId"
                :loading="selectLoading"
                placeholder="区/县"
                clearable
                :disabled="!settingForm.cityId"
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
              label="公司名称"
              prop="company"
            >
              <el-input
                v-model="settingForm.company"
                :maxlength="100"
                size="small"
                placeholder="请输入"
              />
            </el-form-item>

            <el-form-item
              label="邮政编码"
              prop="postal"
            >
              <el-input
                v-model="settingForm.postal"
                :maxlength="10"
                show-word-limit
                size="small"
                placeholder="请输入"
              />
            </el-form-item>

            <el-form-item
              label="联系电话"
              prop="phone"
            >
              <el-input
                v-model="settingForm.phone"
                :maxlength="20"
                size="small"
                placeholder="请输入"
              />
            </el-form-item>

            <el-form-item
              label="联系邮箱"
              prop="email"
            >
              <el-input
                v-model="settingForm.email"
                :maxlength="30"
                size="small"
                placeholder="请输入"
              />
            </el-form-item>

            <el-form-item
              label="联系地址"
              prop="address"
            >
              <el-input
                v-model="settingForm.address"
                :maxlength="100"
                size="small"
                placeholder="请输入"
              />
            </el-form-item>

            <el-form-item
              label="是否有效"
              prop="status"
            >
              <el-select
                v-model="settingForm.status"
                style="width:100%;"
                placeholder="请选择"
                filterable
                clearable
                size="small"
              >
                <el-option
                  label="是"
                  value="1"
                />
                <el-option
                  label="否"
                  value="0"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="服务国家"
            >
              <el-select
                v-model="settingForm.serviceCountryId"
                style="width:100%;"
                placeholder="请选择"
                filterable
                clearable
                size="small"
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
              v-if="settingForm.type === '3'"
              label="是否公开"
              prop="open"
            >
              <el-select
                v-model="settingForm.open"
                style="width:100%;"
                placeholder="请选择"
                filterable
                clearable
                size="small"
              >
                <el-option
                  label="是"
                  value="1"
                />
                <el-option
                  label="否"
                  value="0"
                />
              </el-select>
            </el-form-item>
            <div style="border-top: 1px solid #cccccc;margin:20px 0;" />

            <el-form-item
              label="证件类型"
              prop="countryId"
            >
              <el-select
                v-model="settingForm.certType"
                style="width:100%;"
                placeholder="请选择"
                filterable
                clearable
                size="small"
              >
                <el-option
                  label="身份证"
                  value="0"
                />
                <el-option
                  label="其他证件"
                  value="1"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="证件号码"
              prop="certNumber"
            >
              <el-input
                v-model="settingForm.certNumber"
                :maxlength="20"
                size="small"
                placeholder="请输入"
              />
            </el-form-item>
            <el-form-item
              class="is-required"
              label="上传照片"
            >
              <el-upload
                ref="uploadFile"
                class="upload-demo"
                action
                multiple
                :limit="1"
                :auto-upload="false"
                :http-request="uploadFile"
                :on-remove="onFileRemove"
                :on-change="onFileChange"
                :before-upload="beforeUpload"
                :file-list="fileList"
              >
                <el-button
                  size="small"
                >
                  <i class="el-icon-upload" />
                  选择文件
                </el-button>
                <div
                  slot="tip"
                  class="el-upload__tip"
                >
                  仅支持jpg jpeg png等图片格式
                </div>
              </el-upload>
              <el-button
                size="small"
                type="text"
                style="position: absolute;top: 0;right: 0;"
                @click="onPreview"
              >
                预览
              </el-button>
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            style="text-align: right;padding: 10px 0;"
          >
            <el-button @click="cancel">
              取 消
            </el-button>
            <el-button
              type="primary"
              @click="saveSettingConfirm"
            >
              确 定
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="isPreviewShow"
      :close-on-click-modal="false"
      append-to-body
      width="500px"
      style="min-height: 400px;"
      @closed="onClose"
    >
      <div v-loading="imgLoading">
        <img
          :src="previewImgUrl"
          style="display: block;height: 100%;width: 100%;object-fit: contain;"
        >
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import dayjs from 'dayjs'
import {
  getFilePath
} from '@/api/jht-supplier-management'
import {
  getStateByCountry,
  getCityByState,
  getCountyByCity
} from '@/api/jht-customer-management'

function settingFormParam() {
  return {
    type: undefined, // 设置类型
    contact: undefined, // 联系人
    countryId: undefined, // 国家地区
    serviceCountryId: undefined,
    open: undefined,
    countyId: undefined,
    stateId: undefined,
    cityId: undefined,
    company: undefined, // 公司名称
    postal: undefined, // 公司邮编
    phone: undefined, // 联系电话
    email: undefined, // 联系邮箱
    address: undefined, // 联系地址
    status: undefined, // 是否有效
    certType: undefined, // 证件类型
    certNumber: undefined, // 证件号码
    photo: undefined // 照片存放路径
  }
}

@Component({
  name: '',
  components: {},
  props: {
    currentCustType: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isSettingFormShow: {
      type: Boolean,
      default: false
    },
    countryList: {
      type: Array,
      default: () => {
        return []
      }
    },
    personData: {
      type: Array,
      default: () => {
        return []
      }
    },
    settingTypeList: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
})
export default class extends Vue {
  private fileLoading = false
  private isSettingFormLoading:boolean = false
  private selectLoading = false
  private isPreviewShow = false
  private imgLoading = false
  private previewImgUrl: any = ''
  private fileObj: any = ''
  private settingForm: any = settingFormParam()
  private stateList: any[] = []
  private cityList: any[] = []
  private countyList: any[] = []
  private fileList:any[] = []
  private formRules = {
    type: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
    contact: [
      { required: true, message: '联系人不能为空', trigger: 'blur' }
    ],
    countryId: [{ required: true, message: '请选择国家/地区', trigger: 'change' }],
    stateId: [{ required: true, message: '请选择州/省', trigger: 'change' }],
    cityId: [{ required: true, message: '请选择城市', trigger: 'change' }],
    countyId: [{ required: false, message: '请选择区/县', trigger: 'change' }],
    company: [
      { required: true, message: '公司名称不能为空', trigger: 'blur' }
    ],
    postal: [
      { required: true, message: '邮政编码不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^[a-zA-Z0-9]*$/
          if (!reg.test(value)) {
            callback(new Error('邮政编码只能包含数字、字母'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    phone: [
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
    email: [
      { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
      { type: 'email', message: '邮箱地址格式不正确', trigger: ['blur', 'change'] }
    ],
    address: [{ required: true, message: '联系地址不能为空', trigger: 'blur' }],
    status: [{ required: true, message: '请选择是否有效', trigger: 'change' }],
    open: [{ required: true, message: '请选择是否公开', trigger: 'change' }],
    certType: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
    certNumber: [
      { required: true, message: '证件号码不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (value && reg.test(value)) {
            callback(new Error('证件号码不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }

  // 所属公司id
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }

  // 所属公司Name
  get custName(): string {
    const info = UserModule.info || {}
    const custName = (info as any).custName
    return custName
  }

  /* methods */
  // 保存人员编辑
  private saveSettingConfirm() {
    const editForm:any = this.$refs.editForm
    editForm.validate((valid:any) => {
      if (valid) {
        if (this.settingForm.photo) {
          const obj = this.setArea()
          this.$emit('saveSettingConfirm', obj)
        } else {
          const uploadDom:any = this.$refs.uploadFile
          const uploadList = uploadDom.uploadFiles
          if (uploadList.length === 0) {
            this.$message({
              type: 'warning',
              message: '请选择导上传文件'
            })
            return
          }
          uploadDom.submit()
        }
      } else {
        return false
      }
    })
  }
  private setArea() {
    const countryList = (this as any).countryList
    const { countryId, stateId, cityId, countyId, ...form } = this.settingForm
    const countryName = (countryList.find((item: any) => item.id === countryId) || {}).name
    const stateName = (this.stateList.find((item: any) => item.id === stateId) || {}).name
    const cityName = (this.cityList.find((item: any) => item.id === cityId) || {}).name
    const countyName = (this.countyList.find((item: any) => item.id === countyId) || {}).name
    const params: any = {
      ...form,
      countryId,
      countryName,
      stateName,
      stateId,
      cityName,
      cityId,
      countyId,
      countyName
    }
    return params
  }

  // 关闭
  private cancel() {
    this.reset()
    this.$emit('closeSettingForm')
  }
  private reset() {
    this.fileObj = ''
    this.fileList = []
    this.stateList = []
    this.cityList = []
    this.countyList = []
    this.settingForm = settingFormParam()
    this.$nextTick(() => {
      const editDom: any = this.$refs.editForm
      editDom.clearValidate()
    })
  }

  private async setData(row: any) {
    this.isSettingFormLoading = true
    this.settingForm = { ...row }
    try {
      const path = row.photo
      const splitArr = path ? path.split('/') : []
      const arr:any = [{
        name: path ? splitArr[splitArr.length - 1] : '',
        url: path
      }]
      this.fileList = path ? arr : []
      await this.getStateList()
      await this.getCityList()
      await this.getCountyList()
      this.isSettingFormLoading = false
    } catch (error) {
      this.isSettingFormLoading = false
    }
  }
  private async getStateList() {
    if (!this.settingForm.countryId) return
    this.selectLoading = true
    await getStateByCountry(this.settingForm.countryId).then((res: any) => {
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
    if (!this.settingForm.stateId) return
    this.selectLoading = true
    await getCityByState(this.settingForm.stateId).then((res: any) => {
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
    if (!this.settingForm.cityId) return
    this.selectLoading = true
    await getCountyByCity(this.settingForm.cityId)
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
    this.settingForm.stateId = undefined
    this.onStateChange()
  }
  private onStateChange() {
    this.settingForm.cityId = undefined
    this.onCityChange()
  }
  private onCityChange() {
    this.settingForm.countyId = undefined
  }

  private beforeUpload(file:any) {
    const testmsg = /^image\/(jpeg|png|jpg|gif)$/.test(file.type)
    if (!testmsg) {
      this.$message.error('仅支持图片格式文件')
      return false
    }
    const fileSize = Math.round(file.size / 1024 / 1024 * 100) / 100
    if (fileSize > 10) {
      this.$message.warning('文件大小超出10M！')
      return false
    }
    return testmsg && fileSize
  }
  private onFileChange(file: any, fileList: any[]) {
    this.fileObj = file
  }
  private onPreview() {
    if (!this.settingForm.photo) {
      if (!this.fileObj) return
      this.isPreviewShow = true
      this.previewImgUrl = URL.createObjectURL(this.fileObj.raw)
      return
    }
    this.imgLoading = true
    getFilePath({
      path: this.settingForm.photo
    }).then((res: any) => {
      this.isPreviewShow = true
      this.previewImgUrl = res.data
      window.setTimeout(() => {
        this.imgLoading = false
      }, 500)
    }).catch((err: any) => {
      this.imgLoading = false
      return err
    })
  }
  private onClose() {
    this.isPreviewShow = false
    this.previewImgUrl = ''
    window.clearTimeout()
  }

  // 文件上传示例
  private uploadFile(params: any): void {
    this.fileLoading = true
    const { file } = params
    const nameC = (this as any).currentCustType
    const prefixPath = `jht-admin/companys/${nameC}/bookingPerson`
    this.$upload(false, file, `${prefixPath}/${dayjs().valueOf() + '/' + file.name}`)
      .then((res: any) => {
        // this.$message.success(`上传成功，传给后台的值为：${res.name}`)
        this.settingForm.photo = res.data
        this.fileLoading = false
        const obj = this.setArea()
        this.$emit('saveSettingConfirm', obj)
      })
      .catch((err:any) => {
        this.fileLoading = false
        return err
      })
  }
  // 监听文件删除
  private onFileRemove(file: any, fileList: any[]) {
    this.fileObj = ''
    this.$deleteLoad(file.url, true)
      .then((res: any) => {
        // this.$message.success(`删除成功`)
      })
      .catch((err: any) => {
        return err
      })
    this.settingForm.photo = ''
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  display: inline-block;
  width: 49.5%;
}
</style>
