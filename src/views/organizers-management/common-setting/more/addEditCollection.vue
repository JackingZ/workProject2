<template>
  <div>
    <el-dialog
      :title="isEdit ? '编辑收款信息' : '新增收款信息'"
      :visible.sync="isCollectionFormShow"
      :close-on-click-modal="false"
      width="850px"
      @close="cancel"
    >
      <div
        v-loading="isCollectionFormLoading"
        class="add-edit-organ"
      >
        <div v-loading="fileLoading">
          <el-form
            ref="editForm"
            :model="collectionForm"
            :rules="formRules"
            label-width="100px"
            label-position="right"
            size="small"
            style="padding-right: 20px;"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="国家/地区"
                  prop="countryId"
                >
                  <el-select
                    v-model="collectionForm.countryId"
                    placeholder="请选择"
                    filterable
                    clearable
                    style="width:100%;"
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
              </el-col>
              <el-col
                :span="12"
              >
                <el-form-item
                  label="币种"
                  prop="currencyId"
                >
                  <el-select
                    v-model="collectionForm.currencyId"
                    style="width:100%;"
                    clearable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in currencyList"
                      :key="item.id"
                      :label="`${item.name}-${item.sign}`"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                :span="12"
              >
                <el-form-item
                  label="收款方式"
                  prop="type"
                >
                  <el-select
                    v-model="collectionForm.type"
                    style="width:100%;"
                    clearable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in paywayList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col
                :span="12"
              >
                <el-form-item
                  label="账户名称"
                  prop="acctName"
                >
                  <el-input
                    v-model="collectionForm.acctName"
                    size="small"
                    :maxlength="30"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="12"
              >
                <el-form-item
                  label="收款账号"
                  prop="acctNo"
                >
                  <el-input
                    v-model="collectionForm.acctNo"
                    size="small"
                    :maxlength="30"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="12"
              >
                <el-form-item
                  label="备注"
                  prop="remark"
                >
                  <el-input
                    v-model="collectionForm.remark"
                    size="small"
                    :maxlength="100"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="12"
              >
                <el-form-item
                  label="上传附件"
                  :class="(collectionForm.type === '1' || collectionForm.type === '2') ? 'is-required' : ''"
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
              </el-col>
            </el-row>

            <div style="border-top: 1px solid #cccccc;margin:20px 0;" />
            <el-row>
              <el-col
                :span="12"
              >
                <el-form-item
                  label="银行中文名称"
                  prop="bankName"
                >
                  <el-input
                    v-model="collectionForm.bankName"
                    size="small"
                    :maxlength="50"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="12"
              >
                <el-form-item
                  label="银行英文名称"
                  prop="bankAlias"
                >
                  <el-input
                    v-model="collectionForm.bankAlias"
                    size="small"
                    :maxlength="50"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="12"
              >
                <el-form-item
                  label="银行代码"
                  prop="bankCode"
                >
                  <el-input
                    v-model="collectionForm.bankCode"
                    :maxlength="30"
                    size="small"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="12"
              >
                <el-form-item
                  label="分行代码"
                  prop="branchCode"
                >
                  <el-input
                    v-model="collectionForm.branchCode"
                    size="small"
                    :maxlength="30"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="12"
              >
                <el-form-item
                  label="银行地址"
                  prop="bankAddress"
                >
                  <el-input
                    v-model="collectionForm.bankAddress"
                    size="small"
                    :maxlength="100"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="12"
              >
                <el-form-item
                  label="Swift Code"
                  prop="swiftCode"
                >
                  <el-input
                    v-model="collectionForm.swiftCode"
                    size="small"
                    :maxlength="50"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
            </el-row>
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
              @click="saveCollectionConfirm"
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
    isCollectionFormShow: {
      type: Boolean,
      default: false
    },
    isCollectionFormLoading: {
      type: Boolean,
      default: false
    },
    collectionForm: {
      type: Object,
      default: () => {
        return {}
      }
    },
    paywayList: {
      type: Array,
      default: () => {
        return []
      }
    },
    countryList: {
      type: Array,
      default: () => {
        return []
      }
    },
    currencyList: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
})
export default class extends Vue {
  private fileLoading = false
  private imgLoading = false
  private isPreviewShow = false
  private previewImgUrl: any = ''
  private fileObj: any = ''
  private fileList:any[] =[]
  private formRules = {
    type: [{ required: true, message: '请选择收款方式', trigger: 'change' }],
    countryId: [{ required: true, message: '请选择国家/地区', trigger: 'change' }],
    currencyId: [{ required: true, message: '请选择币种', trigger: 'change' }],
    acctName: [
      { required: true, message: '账号名称不能为空', trigger: 'blur' }
    ],
    acctNo: [
      { required: true, message: '收款账号不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]+/
          if (reg.test(value)) {
            callback(new Error('收款账号格式不正确'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    bankName: [
      { required: false, message: '银行名称不能为空', trigger: 'blur' }
    ],
    bankAlias: [
      { required: false, message: '银行英文名称不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (value && reg.test(value)) {
            callback(new Error('银行英文名称不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    bankCode: [
      { required: false, message: '银行代码不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^[a-zA-Z0-9]*$/
          if (value && !reg.test(value)) {
            callback(new Error('银行代码只能包含数字、字母'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    branchCode: [
      { required: false, message: '分行代码不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^[a-zA-Z0-9]*$/
          if (value && !reg.test(value)) {
            callback(new Error('分行代码只能包含数字、字母'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    swiftCode: [
      { required: false, message: 'Swift Code不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^[a-zA-Z0-9]*$/
          if (value && !reg.test(value)) {
            callback(new Error('Swift Code只能包含数字、字母'))
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
  private onPreview() {
    const form = (this as any).collectionForm
    if (!form.attach) {
      if (!this.fileObj) return
      this.isPreviewShow = true
      this.previewImgUrl = URL.createObjectURL(this.fileObj.raw)
      return
    }
    this.previewImgUrl = process.env.VUE_APP_OSS_PATH + form.attach
    this.isPreviewShow = true
  }
  private onClose() {
    this.isPreviewShow = false
    this.previewImgUrl = ''
    window.clearTimeout()
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
    const form: any = (this as any).collectionForm
    form.attach = ''
  }
  private onFileChange(file: any, fileList: any[]) {
    this.fileObj = file
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
  // 文件上传
  private uploadFile(params: any): void {
    this.fileLoading = true
    const nameC = (this as any).currentCustType
    const { file } = params
    const prefixPath = `jht-admin/companys/${nameC}/collectionInfo`
    this.$upload(true, file, `${prefixPath}/${dayjs().valueOf() + '/' + file.name}`)
      .then((res: any) => {
        const collectionForm = (this as any).collectionForm
        collectionForm.attach = res.data
        this.fileLoading = false
        this.$emit('saveCollectionConfirm')
      })
      .catch((err:any) => {
        this.fileLoading = false
        return err
      })
  }
  // 保存人员编辑
  private saveCollectionConfirm() {
    const editForm:any = this.$refs.editForm
    editForm.validate((valid:any) => {
      if (valid) {
        if ((this as any).collectionForm.attach) {
          this.$emit('saveCollectionConfirm')
        } else {
          const uploadDom:any = this.$refs.uploadFile
          const uploadList = uploadDom.uploadFiles
          const form = (this as any).collectionForm
          if (form.type !== '1' && form.type !== '2' && uploadList.length === 0) {
            this.$message.error('请选择上传文件')
            return
          }
          uploadDom.submit()
        }
      } else {
        return false
      }
    })
  }
  // 关闭
  private cancel() {
    this.fileObj = ''
    this.fileList = []
    this.$emit('closeCollectionForm')
  }
}
</script>

<style lang="scss" scoped>

</style>
