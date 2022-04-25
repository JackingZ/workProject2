<template>
  <div>
    <el-dialog
      :title="isEdit ? '编辑文件' : '新增文件'"
      :visible="isFileFormShow"
      :close-on-click-modal="false"
      width="550px"
      @close="cancel"
    >
      <div
        v-loading="isFileFormLoading"
        class="add-edit-organ"
      >
        <div v-loading="fileLoading">
          <el-form
            ref="editForm"
            :model="fileForm"
            :rules="formRules"
            label-width="90px"
            label-position="right"
            style="padding-right: 20px;"
            size="small"
          >
            <el-form-item
              label="文件类型"
              prop="type"
            >
              <el-select
                v-model="fileForm.type"
                placeholder="请选择"
                filterable
                clearable
                style="width:100%;"
                size="small"
              >
                <el-option
                  v-for="item in fileTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="文件名称"
              prop="name"
            >
              <el-input
                v-model="fileForm.name"
                size="small"
                placeholder="请输入"
                :maxlength="50"
              />
            </el-form-item>
            <el-form-item
              label="编码/ID"
              prop="code"
            >
              <el-input
                v-model="fileForm.code"
                size="small"
                placeholder="请输入"
                :maxlength="50"
              />
            </el-form-item>
            <el-form-item
              label="上传文件"
              class="is-required"
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
                :before-upload="beforeFileUpload"
                :file-list="fileList"
              >
                <el-button
                  size="small"
                >
                  <i class="el-icon-upload" />
                  选择文件
                </el-button>
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
            <el-form-item
              label="文件描述"
              prop="des"
            >
              <el-input
                v-model="fileForm.des"
                size="small"
                placeholder="请输入"
                :maxlength="100"
              />
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
              @click="saveFileConfirm"
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
import { Component, Vue, Watch } from 'vue-property-decorator'
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
    isFileFormShow: {
      type: Boolean,
      default: false
    },
    isFileFormLoading: {
      type: Boolean,
      default: false
    },
    fileForm: {
      type: Object,
      default: () => {
        return {}
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
    },
    fileTypeList: {
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
  private fileList:any[] =[]
  private pathList: any = {}
  private fileObj: any = ''
  private formRules = {
    name: [
      { required: true, message: '文件名称不能为空', trigger: 'blur' }
    ],
    code: [
      { required: true, message: '编码不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^[a-zA-Z0-9-]+$/
          if (value && !reg.test(value)) {
            callback(new Error('编码不能有中文及特殊字符'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    type: [{ required: true, message: '请选择文件类型', trigger: 'change' }]
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
    const form = (this as any).fileForm
    form.path = ''
  }
  private onFileChange(file: any, fileList: any[]) {
    this.fileObj = file
  }
  // 文件上传示例
  private uploadFile(params: any): void {
    this.fileLoading = true
    const { file } = params
    const prefixPath = this.pathList[(this as any).fileForm.type]
    // console.log(`${prefixPath}/${file.name}`)
    this.$upload(false, file, `${prefixPath}/${dayjs().valueOf() + '/' + file.name}`)
      .then((res: any) => {
        // this.$message.success(`上传成功，传给后台的值为：${res.name}`)
        const fileForm = (this as any).fileForm
        fileForm.path = res.data
        this.fileLoading = false
        this.$emit('saveFileConfirm')
      })
      .catch((err:any) => {
        this.fileLoading = false
        return err
      })
  }
  // 保存人员编辑
  private saveFileConfirm() {
    // console.log(123)
    const editForm:any = this.$refs.editForm
    editForm.validate((valid:any) => {
      if (valid) {
        if ((this as any).fileForm.path) {
          this.$emit('saveFileConfirm')
        } else {
          const uploadDom:any = this.$refs.uploadFile
          const uploadList = uploadDom.uploadFiles
          if (uploadList.length === 0) {
            this.$message({
              type: 'warning',
              message: '请选择上传文件'
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
  private onPreview() {
    const form = (this as any).fileForm
    if (!form.path) {
      const a = document.createElement('a')
      document.body.appendChild(a)
      const blob = new Blob([this.fileObj.raw])
      const objUrl = URL.createObjectURL(blob)
      a.href = objUrl
      a.download = this.fileObj.raw.name
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(objUrl)
      return
    }
    this.imgLoading = true
    getFilePath({
      path: form.path
    }).then((res: any) => {
      this.isPreviewShow = true
      window.open(res.data)
      this.previewImgUrl = res.data
      this.imgLoading = false
      // window.setTimeout(() => {
      //   this.imgLoading = false
      // }, 500)
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

  private beforeFileUpload(file:any) {
    // const testmsg = /^image\/(jpeg|png|jpg|gif)$/.test(file.type)
    // if (!testmsg) {
    //   this.$message.error('仅支持图片格式文件')
    //   return false
    // }
    const fileSize = Math.round(file.size / 1024 / 1024 * 100) / 100
    if (fileSize > 10) {
      this.$message.warning('文件大小超出10M！')
      return false
    }
    return fileSize
  }
  // 关闭
  private cancel() {
    this.fileObj = ''
    this.fileList = []
    this.$emit('closeFileForm')
  }
  private mounted() {
    const name = (this as any).currentCustType
    this.pathList = {
      '0': `jht-admin/companys/${name}/contract`,
      '1': `jht-admin/companys/${name}/business-license`,
      '2': `jht-admin/companys/${name}/id`,
      '3': `jht-admin/companys/${name}/wac`,
      '4': `jht-admin/companys/${name}/itat`,
      '5': `jht-admin/companys/${name}/nvocc`,
      'Z': `jht-admin/companys/${name}/other`
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep{
    .el-tabs__item{
      height: 60px;
      line-height: 60px;
    }
  }
</style>
