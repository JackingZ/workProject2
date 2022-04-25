<template>
  <div v-loading="loading">
    <div
      style="padding: 0 20px 10px 0;text-align: right;"
    >
      <el-button
        :disabled="orderType !== '0' || !isEdit || isStatus === '205' || isStatus === '206' || isEffect === '209'"
        type="text"
        size="small"
        @click="addItem"
      >
        新增子提单号
      </el-button>
      <el-button
        v-show="!isEdit"
        :disabled="orderType !== '0' || isStatus === '205' || isStatus === '206' || isEffect === '209'"
        type="primary"
        size="small"
        @click="editOrder"
      >
        编辑
      </el-button>
      <el-button
        v-show="isEdit"
        :disabled="orderType !== '0' || isStatus === '205' || isStatus === '206' || isEffect === '209'"
        type="primary"
        size="small"
        @click="cancelOrder"
      >
        取消
      </el-button>
      <el-button
        v-show="isEdit"
        :disabled="orderType !== '0' || isStatus === '205' || isStatus === '206' || isEffect === '209'"
        type="primary"
        size="small"
        @click="saveOrder"
      >
        保存
      </el-button>
    </div>
    <el-form
      ref="selectForm"
      :model="selectForm"
      label-width="110px"
      size="small"
    >
      <div
        class="main-item"
        :class="dragShow('000') ? 'active-item' : ''"
        @dragover.prevent="($event) => onDragover($event, '000')"
        @dragenter.prevent="($event) => onDragenter($event, '000')"
        @dragleave.stop.prevent="($event) => onDragleave($event, '000')"
        @drop.prevent="($event) => onDragdrop($event, '000')"
      >
        <div
          v-if="dragShow('000')"
          class="active-tip"
        >
          <span>释放鼠标，上传文件</span>
        </div>
        <el-form-item
          label="主提单号"
          class="is-required"
        >
          <el-input
            v-model="selectForm.billNo"
            :disabled="!isEdit || orderType !== '0' || isEffect === '209'"
            :maxlength="20"
            show-word-limit
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-upload
          ref="uploadFile"
          type="text"
          action
          multiple
          accept=".pdf,.PDF"
          :limit="10"
          :http-request="uploadFile"
          :on-remove="onFileRemove"
          :before-upload="beforeUpload"
          :on-preview="onFilePreview"
          :on-exceed="beforeExceed"
          :file-list="fileList"
          :disabled="!isEdit"
          style="margin-left: 110px;"
        >
          <div>
            <span
              style="cursor: auto;"
              @click.stop=""
            >
              将文件拖到此处，或
            </span>
            <el-button
              :disabled="!isEdit || orderType !== '0' || isEffect === '209'"
              type="text"
              size="small"
              @click="onFile('000')"
            >
              点击上传
            </el-button>
          </div>
        </el-upload>
      </div>
      <div
        v-for="(item, index) in containData"
        :key="index"
        style="padding: 10px 0;border-top: solid 1px #e6ebf5;"
      >
        <div
          class="sub-item"
          :class="dragShow(index) ? 'active-item' : ''"
          @dragover.prevent="($event) => onDragover($event, index)"
          @dragenter.prevent="($event) => onDragenter($event, index)"
          @dragleave.stop.prevent="($event) => onDragleave($event, index)"
          @drop.prevent="($event) => onDragdrop($event, index)"
        >
          <div
            v-if="dragShow(index)"
            class="active-tip"
          >
            <span>释放鼠标，上传文件</span>
          </div>
          <el-form-item
            label="子提单号"
          >
            <el-input
              v-model="item.billNo"
              :disabled="!isEdit || orderType !== '0' || isEffect === '209'"
              :maxlength="20"
              show-word-limit
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <el-button
            :disabled="!isEdit || orderType !== '0' || isEffect === '209'"
            type="text"
            size="small"
            style="margin-left: 10px;"
            @click="cancelItem(index)"
          >
            删除
          </el-button>
          <el-upload
            ref="uploadFile"
            type="text"
            action
            multiple
            accept=".pdf,.PDF"
            :limit="10"
            :http-request="uploadSubFile"
            :on-remove="(file, list) => onSubFileRemove(file, list, index)"
            :before-upload="beforeUpload"
            :on-exceed="beforeExceed"
            :on-preview="onFilePreview"
            :file-list="item.fileList"
            :disabled="!isEdit"
            style="margin-left: 110px;"
          >
            <div>
              <span
                style="cursor: auto;"
                @click.stop=""
              >
                将文件拖到此处，或
              </span>
              <el-button
                :disabled="!isEdit || orderType !== '0' || isEffect === '209'"
                type="text"
                size="small"
                @click="onFile(index)"
              >
                点击上传
              </el-button>
            </div>
          </el-upload>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  savePut
} from '@/api/orderlist-at-booking'
import dayjs from 'dayjs'

@Component({
  name: 'fiveForm',
  components: {},
  props: {
    isStatus: {
      type: String,
      default: ''
    },
    isEffect: {
      type: String,
      default: ''
    },
    isOrder: {
      type: Object,
      default: () => ({})
    },
    orderType: {
      type: String,
      default: ''
    }
  }
})

export default class extends Vue {
  /* data */
  private selectForm: any = {
    billNo: undefined
  }
  private loading: boolean = false
  private isEdit: boolean = false
  private isDragFile: boolean = false
  private containData: any[] = []
  private fileList: any[] = []
  private files: any[] = []
  private copyFiles: any[] = []
  private copyFileList: any[] = []
  private copyContainData: any[] = []
  private copyBillNo: any = []
  private orderRow: any = {}
  private sIndex: any = ''
  private currentId: any = ''
  private lastenter: any = ''

  /** computed */
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }

  /* methods */
  // 初始化
  private async init(data: any) {
    this.orderRow = (this as any).isOrder || {}
    const form = data || {}
    this.isEdit = !form.id
    this.selectForm.billNo = form.billNo
    this.copyBillNo = JSON.parse(JSON.stringify(form.billNo || ''))
    this.currentId = form.id || undefined
    const arrM = (form.files || '').split(',')
    this.fileList = []
    arrM.map((it: any) => {
      if (it) {
        const brr = it.split('.')
        brr.shift()
        this.fileList.push({
          name: brr.join('.'),
          url: it
        })
      }
    })
    this.files = JSON.parse(JSON.stringify(this.fileList))
    this.copyFileList = JSON.parse(JSON.stringify(this.fileList))
    this.copyFiles = JSON.parse(JSON.stringify(this.fileList))
    const arr = form.children
    this.containData = (arr || []).map((it: any) => {
      const { files, ...obj } = it
      const arrS = (files || '').split(',')
      const fileList: any[] = []
      arrS.map((s: any) => {
        if (s) {
          const brr = s.split('.')
          brr.shift()
          fileList.push({
            name: brr.join('.'),
            url: s
          })
        }
      })
      return {
        ...obj,
        fileList,
        files: fileList
      }
    })
    this.copyContainData = JSON.parse(JSON.stringify(this.containData))
  }

  private addItem() {
    this.containData.push({
      billNo: undefined,
      fileList: [],
      files: []
    })
  }
  private cancelItem(idx: any) {
    this.containData.splice(idx, 1)
  }

  // html5拖拽
  private dragShow(index: any) {
    return this.sIndex === index && this.isDragFile
  }
  private onDragenter(e: any, i: any) {
    if (i === '000') {
      const root: any = document.getElementsByClassName('main-item')
      root[0].classList.add('dragging-over')
    } else {
      const root: any = document.getElementsByClassName('sub-item')
      root[i].classList.add('dragging-over')
    }
    this.lastenter = e.target
    if (!this.isEdit) return
    this.sIndex = i
    this.isDragFile = true
  }
  private onDragover(e: any, i: any) {
    if (!this.isEdit) return
    this.sIndex = i
    this.isDragFile = true
  }
  private onDragleave(e: any, i: any) {
    if (this.lastenter === e.target) {
      if (i === '000') {
        const root: any = document.getElementsByClassName('main-item')
        root[0].classList.add('dragging-over')
      } else {
        const root: any = document.getElementsByClassName('sub-item')
        root[i].classList.add('dragging-over')
      }
      if (!this.isEdit) return
      this.sIndex = i
      this.isDragFile = false
    }
  }
  private onDragdrop(e: any, i: any) {
    if (i === '000') {
      const root: any = document.getElementsByClassName('main-item')
      root[0].classList.add('dragging-over')
    } else {
      const root: any = document.getElementsByClassName('sub-item')
      root[i].classList.add('dragging-over')
    }
    if (!this.isEdit) return
    this.sIndex = i
    this.isDragFile = false
    this.onDrop(e)
  }
  private onDrop(e: any) {
    const files = (e.dataTransfer || {}).files || []
    if (files.length <= 0) return
    const obj = files[0] || {}
    if (obj.type.indexOf('pdf') === -1) {
      this.$message.error('请上传pdf文件')
      return
    }
    if (this.sIndex === '000' && (this.files || []).length > 10) {
      this.$message.error('文件上传限制为10个')
      return
    }
    if (this.sIndex !== '000' && (this.containData[this.sIndex].files || []).length > 10) {
      this.$message.error('文件上传限制为10个')
      return
    }
    if (this.sIndex === '000') {
      this.uploadFile({
        file: obj
      })
    } else {
      this.uploadSubFile({
        file: obj
      })
    }
  }
  private beforeUpload(obj: any) {
    if (obj.type.indexOf('pdf') === -1) {
      this.$message.error('仅支持pdf文件')
      return false
    } else if (obj.name.length > 100) {
      this.$message.error('pdf文件名过长')
      return false
    }
  }
  private beforeExceed(files: any) {
    this.$message.error('pdf文件上传限制为10个')
  }
  private onSubFileRemove(obj: any, list: any, index: any) {
    this.sIndex = index
    let url: any = ''
    if (obj.url) {
      url = obj.url
    } else {
      this.containData.map((it: any) => {
        const item = it.files.find((f: any) => f.uid === obj.uid)
        if (item) {
          url = item.url
        }
      })
    }
    if (url) {
      this.$deleteLoad(url, true)
        .then((res: any) => {
          this.$message.success(`删除成功`)
        })
        .catch((err: any) => {
          return err
        })
    }
    this.containData[this.sIndex].files = this.containData[this.sIndex].files.filter((it: any) => it.url !== url)
    this.containData[this.sIndex].fileList = this.containData[this.sIndex].fileList.filter((it: any) => it.url !== url)
  }

  private onFilePreview(obj: any) {
    const url = process.env.VUE_APP_OSS_PATH + obj.url
    window.open(url)
  }
  private onFile(idx: any) {
    this.sIndex = idx
  }
  private uploadSubFile(params: any): void {
    const fff = params.file
    this.$upload(true, fff, `jht-admin/orderlist/booking/putFile/${dayjs().valueOf() + '/' + fff.name}`)
      .then((res: any) => {
        const str = res.data
        this.containData[this.sIndex].files.push({
          name: (params.file || {}).name,
          uid: (params.file || {}).uid,
          url: str
        })
        this.containData[this.sIndex].fileList.push({
          name: (params.file || {}).name,
          url: res.data
        })
        this.$message.success('上传成功')
      })
      .catch((err: any) => {
        return err
      })
  }
  private uploadFile(params: any): void {
    const fff = params.file
    this.$upload(true, fff, `jht-admin/orderlist/booking/putFile/${dayjs().valueOf() + '/' + fff.name}`)
      .then((res: any) => {
        const str = res.data
        this.files.push({
          name: (params.file || {}).name,
          uid: (params.file || {}).uid,
          url: str
        })
        this.fileList.push({
          name: (params.file || {}).name,
          url: res.data
        })
        this.$message.success('上传成功')
      })
      .catch((err: any) => {
        return err
      })
  }
  private onFileRemove(obj: any, list: any) {
    let url: any = ''
    if (obj.url) {
      url = obj.url
    } else {
      const item = this.files.find((f: any) => f.uid === obj.uid)
      if (item) {
        url = item.url
      }
    }
    if (url) {
      this.$deleteLoad(url, true)
        .then((res: any) => {
          this.$message.success(`删除成功`)
        })
        .catch((err: any) => {
          return err
        })
    }
    this.files = this.files.filter((it: any) => it.url !== url)
    this.fileList = this.fileList.filter((it: any) => it.url !== url)
  }
  private editOrder() {
    this.isEdit = true
  }
  private cancelOrder() {
    this.isEdit = false
    this.sIndex = ''
    this.containData = []
    this.selectForm.billNo = JSON.parse(JSON.stringify(this.copyBillNo))
    this.fileList = JSON.parse(JSON.stringify(this.copyFileList))
    this.files = JSON.parse(JSON.stringify(this.copyFiles))
    this.containData = JSON.parse(JSON.stringify(this.copyContainData))
  }

  private saveOrder() {
    // 已甩柜状态只能保存甩柜信息
    const isStatus = (this as any).isStatus
    if (isStatus === '204') return
    const order = (this as any).isOrder
    if (!this.selectForm.billNo) {
      this.$message.error('请填写主提单号')
      return
    }
    const isTrue = this.containData.every((it: any) => it.billNo)
    if (!isTrue) {
      this.$message.error('请填写子提单号')
      return
    }
    const arr = this.containData.map((it: any) => {
      const { fileList, files, isDragFile, ...obj } = it
      return {
        ...obj,
        files: files.map((f: any) => f.url).join(',')
      }
    })
    this.loading = true
    const params: any = {
      ...this.selectForm,
      bookingId: this.orderRow.id,
      files: this.files.map((it: any) => it.url).join(','),
      children: arr,
      id: this.currentId
    }
    savePut(params)
      .then((res: any) => {
        this.loading = false
        this.$message.success('保存成功')
        this.reset()
        this.$emit('refresh')
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private reset() {
    this.containData = []
    this.copyContainData = []
    this.copyFileList = []
    this.copyFiles = []
    this.copyBillNo = []
    this.fileList = []
    this.selectForm = {
      billNo: undefined
    }
    this.isEdit = false
    this.sIndex = ''
    this.isDragFile = false
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  display: inline-block;
  margin-bottom: 0px;
  width: 25%;
}
.main-item {
  border: dashed 1px #fff;
  padding: 5px 0 20px 0;
  margin-bottom: 10px;
}
.sub-item {
  border: dashed 1px #fff;
  padding: 5px 0 20px 0;
}
.active-item {
  position: relative;
  border-color: #1890ff !important;
}
.active-tip {
  position: absolute;
  right: 2px;
  bottom: 0;
  color: #1890ff;
  font-size: 16px;
}
.dragging-over *{
  pointer-events: none;
}
::v-deep .el-icon-close-tip {
  display: none !important;
}

::v-deep .el-upload-list {
  overflow: hidden;
}
::v-deep .el-upload-list__item {
  margin-top: 0;
  float: left;
  max-width: 25%;
}
::v-deep .el-upload-list__item:first-child {
  margin-top: 0;
}
::v-deep .el-upload {
  .el-button--small {
    padding: 9px 5px;
  }
}
::v-deep .el-upload-list__item .el-icon-close-tip {
  display: none !important;
}
</style>
