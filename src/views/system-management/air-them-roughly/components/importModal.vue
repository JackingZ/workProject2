<template>
  <el-dialog
    title="航空号段导入"
    width="600px"
    :visible="visible"
    :close-on-click-modal="false"
    @close="closeModal"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      label-width="90px"
      size="small"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item
            label="航空公司"
            prop="id"
          >
            <el-select
              v-model="form.id"
              placeholder="请选择航空公司"
              filterable
              clearable
              @change="airlinesChange"
            >
              <el-option
                v-for="item in airlinesList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item
            label="选择文件"
            prop="file"
          >
            <el-upload
              v-if="form.id"
              ref="uploadFile"
              action
              :http-request="parseFile"
              :before-upload="beforeUpload"
              :show-file-list="false"
            >
              <el-button
                size="small"
              >
                <i class="el-icon-upload" />
                选择文件
              </el-button>
            </el-upload>
            <el-button
              v-else
              size="small"
              @click="selectFile"
            >
              <i class="el-icon-upload" />
              选择文件
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="small"
        @click="closeModal"
      >
        取 消
      </el-button>
      <el-button
        type="primary"
        size="small"
        @click="closeModal"
      >
        确 认
      </el-button>
    </span>
    <el-dialog
      width="600px"
      title="导入完成"
      :visible="innerVisible"
      :close-on-click-modal="false"
      append-to-body
    >
      <div v-loading="loading">
        <span>总数量：{{ result.total }}&nbsp;条&nbsp;&nbsp;&nbsp;&nbsp;成功数：<span class="g">{{ result.success }}</span>&nbsp;&nbsp;&nbsp;&nbsp;失败数：<span class="r">{{ result.error }}</span></span>
        <div
          v-if="result.errMsg.length"
          class="err-title"
        >
          <p style="margin: 0 0 5px 0">
            文件格式不正确，请修改文件后再导入。
          </p>
          <p style="margin: 0">
            失败原因：
          </p>
        </div>
        <div style="max-height: 300px;overflow-y: auto">
          <p
            v-for="(item, i) in result.errMsg"
            :key="i"
          >
            {{ item }}
          </p>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :disabled="loading"
          size="small"
          @click="resetSelectFile"
        >
          重新选择
        </el-button>
        <el-button
          type="primary"
          size="small"
          :disabled="loading || result.error !== 0"
          @click="uploadFile"
        >
          确认导入
        </el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { importFile } from '@/api/system-in-air-them-roughly'
import XLSX from 'xlsx'

@Component({
  name: 'importModal',
  props: {
    airlinesList: {
      type: Array,
      default: () => ([])
    }
  }
})
export default class ImportModal extends Vue {
  private visible: boolean = false
  private innerVisible: boolean = false
  private loading: boolean = false
  private uploadFileData: any = null
  private form: any = {
    id: undefined,
    name: '',
    file: ''
  }
  private formRules: any = {
    id: [{ required: true, message: '请选择航空公司', trigger: 'change' }],
    file: [{ required: true, message: '请选择文件', trigger: 'change' }]
  }
  private result: any = {
    total: 0,
    success: 0,
    error: 0,
    errMsg: []
  }
  private max: number = 20
  private airOrderList: any[] = []

  /* methods */
  private resetSelectFile(): void {
    this.innerVisible = false
    this.reset()
  }

  private reset(): void {
    (this.$refs.form as any).resetFields()
    this.airOrderList = []
    this.result = {
      total: 0,
      success: 0,
      error: 0,
      errMsg: []
    }
    this.form = {
      id: undefined,
      name: '',
      file: ''
    }
  }

  private verifyFile(): void {
    this.result.total = this.airOrderList.length
    const reg = /[\u4E00-\u9FA5]/
    const airOrderList: any[] = []
    this.airOrderList.forEach((no: any, i: number) => {
      if ((no.toString().length > this.max) || (reg.test(no)) || (airOrderList.indexOf(no) !== -1)) {
        this.result.error = this.result.error + 1
        if (no.toString().length > this.max) {
          this.result.errMsg.push(`第${i + 1}行：号段长度超过最大长度${this.max}`)
        }
        if (reg.test(no)) {
          this.result.errMsg.push(`第${i + 1}行：号段存在中文`)
        }
        if (airOrderList.indexOf(no) !== -1) {
          this.result.errMsg.push(`第${i + 1}行：号段${no}重复`)
        } else {
          airOrderList.push(no)
        }
      } else {
        this.result.success = this.result.success + 1
      }
    })
    this.innerVisible = true
  }

  private parseFile(data: any): void {
    this.form.file = data.file.name
    this.uploadFileData = data.file
    const file = data.file
    const that = this
    const reader = new FileReader()
    FileReader.prototype.readAsBinaryString = (f) => {
      let binary = ''
      let wb
      let outdata
      const innerReader = new FileReader()
      innerReader.onload = (e) => {
        const bytes = new Uint8Array((innerReader.result as any))
        const length = bytes.byteLength
        for (let i = 0; i < length; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        wb = XLSX.read(binary, {
          type: 'binary'
        })
        if (wb.Sheets.Sheet1.B1) {
          that.$message.error('导入文件内容格式不正确')
          return
        }
        outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 })
        for (const airOrder of outdata) {
          that.airOrderList.push((airOrder as any)[0])
        }
        that.verifyFile()
      }
      innerReader.onerror = () => {
        that.$message.error('文件错误,请检查文件重新导入')
      }
      innerReader.readAsArrayBuffer(f)
    }
    reader.readAsBinaryString(file)
  }

  private selectFile(): void {
    (this.$refs.form as any).validateField('id', (errMsg: string) => {
      if (errMsg) {
        this.$message.error(errMsg)
      }
    })
  }

  private beforeUpload(file: any): boolean {
    const testmsg = /\.(xlsx|xls|csv)$/.test(file.name)
    if (!testmsg) {
      this.$message.error('仅支持excel格式文件')
      return false
    }
    return testmsg
  }

  private uploadFile(): void {
    const file = this.uploadFileData
    const formData = new FormData()
    formData.append('file', file)
    formData.append('id', this.form.id)
    formData.append('name', this.form.name)
    this.loading = true
    importFile(formData).then((res: any) => {
      this.loading = false
      if (res.success) {
        this.$message.success('导入成功！')
        this.resetSelectFile()
      }
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }

  private airlinesChange(val: any): void {
    this.form.name = ((this as any).airlinesList.find((e: any) => e.id === val) || {}).name
  }

  private closeModal() {
    this.visible = false
    this.$emit('load')
  }

  private show(): void {
    this.visible = true
    this.$nextTick(() => {
      this.resetSelectFile()
    })
  }
}
</script>

<style lang="scss" scoped>
  .err-title{
    margin-top: 10px;
  }
  .g{
    color: #179837;
  }
  .r{
    color: #E51E1E;
  }
  p{
    margin-top: 10px;
  }
</style>
