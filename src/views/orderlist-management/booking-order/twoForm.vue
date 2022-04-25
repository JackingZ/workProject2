<template>
  <div v-loading="loading">
    <div
      style="padding: 0 20px 10px 0;text-align: right;"
    >
      <el-button
        :disabled="orderType !== '0' || isEffect === '209'"
        type="primary"
        size="small"
        @click="addItem"
      >
        新增
      </el-button>
    </div>
    <el-form
      ref="selectForm"
      :model="selectForm"
      :rules="formRules"
      label-width="110px"
      size="small"
    >
      <div
        v-for="(item, index) in containData"
        :key="index"
        style="border: 1px solid #eee;padding-top: 20px;margin-bottom: 10px;"
      >
        <div
          class="img-item"
          :class="dragShow(index, 'img') ? 'active-item' : ''"
          @dragover.prevent="($event) => onDragover($event, index, 'img')"
          @dragenter.prevent="($event) => onDragenter($event, index, 'img')"
          @dragleave.stop.prevent="($event) => onDragleave($event, index, 'img')"
          @drop.prevent="($event) => onDragdrop($event, index, 'img')"
        >
          <div
            v-if="dragShow(index, 'img')"
            class="active-tip"
          >
            <span>释放鼠标，上传文件</span>
          </div>
          <el-row style="padding: 0 20px;">
            <el-col :span="2">
              <el-tag
                class="title-tag"
                effect="dark"
              >
                柜号
              </el-tag>
            </el-col>
            <el-col :span="16">
              <el-form-item
                label="柜号"
                class="is-required"
              >
                <el-input
                  v-model="item.containerNo"
                  :disabled="item.isEditC"
                  :maxlength="20"
                  show-word-limit
                  placeholder="请输入"
                />
              </el-form-item>
              <el-form-item
                label="关封号"
                class="is-required"
              >
                <el-input
                  v-model="item.sealNo"
                  :disabled="item.isEditC"
                  :maxlength="20"
                  show-word-limit
                  placeholder="请输入"
                />
              </el-form-item>
              <el-form-item
                label="状态"
                class="is-required"
              >
                <el-select
                  v-model="item.status"
                  :loading="selectLoading"
                  :disabled="item.isEditC"
                  placeholder="请选择"
                  filterable
                  style="width: 100%;"
                  @change="onStatus"
                >
                  <el-option
                    v-for="itemS in item.statusList"
                    :key="itemS.key"
                    :label="itemS.value"
                    :value="itemS.key"
                  />
                </el-select>
              </el-form-item>
              <div>
                <el-form-item
                  prop=""
                  label="上传照片"
                  style="width: 100%;"
                >
                  <el-upload
                    ref="uploadFile"
                    class="upload-demo"
                    type="text"
                    action
                    multiple
                    :limit="1"
                    :disabled="item.isEditC"
                    :before-upload="beforeUpload"
                    :on-exceed="beforeExceed"
                    :http-request="uploadImg"
                    :on-remove="(file, list) => onImgRemove(file, list, index)"
                    :on-preview="onImgPreview"
                    :file-list="item.imgsList"
                  >
                    <div>
                      <span
                        style="cursor: auto;"
                        @click.stop=""
                      >
                        将文件拖到此处，或
                      </span>
                      <el-button
                        :disabled="item.isEditC"
                        type="text"
                        size="small"
                        @click="onImg(index)"
                      >
                        点击上传
                      </el-button>
                    </div>
                  </el-upload>
                </el-form-item>
              </div>
            </el-col>
            <el-col
              :span="6"
              style="text-align: right;"
            >
              <div>
                <el-button
                  v-show="!!item.id && item.isEditC"
                  :disabled="orderType !== '0' || isEffect === '209'"
                  type="text"
                  size="small"
                  @click="edit('1', index)"
                >
                  编辑
                </el-button>
                <el-button
                  v-show="item.isAdd"
                  type="text"
                  size="small"
                  @click="cancel('1', index)"
                >
                  取消
                </el-button>
                <el-button
                  v-show="item.isAdd || !item.isEditC"
                  type="text"
                  size="small"
                  @click="save('1', index)"
                >
                  保存
                </el-button>

                <el-button
                  v-show="item.status && !!item.id && !item.isMat && custType === '0'"
                  :disabled="(isStatus !== '202' && isStatus !== '207') || isEffect === '209'"
                  type="text"
                  size="small"
                  @click="addMatter(index)"
                >
                  新增补料
                </el-button>
                <el-button
                  v-show="item.status !== '251' && !!item.id && !item.isWei"
                  :disabled="orderType !== '0' || isEffect === '209'"
                  type="text"
                  size="small"
                  @click="addWeight(index)"
                >
                  新增称重
                </el-button>
              </div>
            </el-col>
          </el-row>
        </div>

        <el-row
          v-if="item.isMat"
          style="border-top: 1px solid #eee;padding: 20px 20px 0;"
        >
          <el-col :span="2">
            <el-tag
              class="title-tag"
              effect="dark"
            >
              补料
            </el-tag>
          </el-col>
          <el-col :span="16">
            <el-form-item
              label="总件数"
              class="is-required"
            >
              <div class="input-content">
                <div style="flex: 1;">
                  <el-input-number
                    v-model="item.packages"
                    :disabled="item.isEditM"
                    class="input-number-valiate input-border"
                    :controls="false"
                    placeholder="请输入"
                    :min="0"
                    :max="99999"
                    :step="1"
                    step-strictly
                  />
                </div>
                <div class="input-select">
                  <el-select
                    v-model="item.umPackage"
                    :disabled="item.isEditM"
                    size="small"
                    style="width: 100%;"
                    placeholder="请选择"
                  >
                    <el-option
                      label="箱"
                      value="BOX"
                    />
                    <el-option
                      label="托"
                      value="PLT"
                    />
                  </el-select>
                </div>
              </div>
            </el-form-item>
            <el-form-item
              label="总重量"
              class="is-required"
            >
              <div class="input-content">
                <div style="flex: 1;">
                  <el-input-number
                    v-model="item.weight"
                    :disabled="item.isEditM"
                    class="input-number-valiate input-border"
                    :controls="false"
                    placeholder="请输入"
                    :min="0"
                    :max="99999"
                    :precision="2"
                  />
                </div>
                <div class="input-unit">
                  {{ item.umWeight || 'KGS' }}
                </div>
              </div>
            </el-form-item>
            <el-form-item
              label="总体积"
              class="is-required"
            >
              <div class="input-content">
                <div style="flex: 1;">
                  <el-input-number
                    v-model="item.volume"
                    :disabled="item.isEditM"
                    class="input-number-valiate input-border"
                    :controls="false"
                    placeholder="请输入"
                    :min="0"
                    :max="99999"
                    :precision="2"
                  />
                </div>
                <div class="input-unit">
                  {{ item.umVolume || 'CBM' }}
                </div>
              </div>
            </el-form-item>
            <el-form-item
              label="货物描述"
              style="width: 100%;"
            >
              <el-input
                v-model="item.description"
                :disabled="item.isEditM"
                type="textarea"
                :rows="2"
                placeholder="请输入"
                size="small"
                :maxlength="200"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="6"
            style="text-align: right;"
          >
            <el-button
              v-show="!!item.id && item.isEditM && custType === '0'"
              :disabled="(isStatus !== '202' && isStatus !== '207') || isEffect === '209'"
              type="text"
              size="small"
              @click="edit('2', index)"
            >
              编辑
            </el-button>
            <el-button
              v-show="item.isAdd"
              type="text"
              size="small"
              @click="cancel('2', index)"
            >
              取消
            </el-button>
            <el-button
              v-show="item.isAdd || !item.isEditM"
              type="text"
              size="small"
              @click="save('2', index)"
            >
              保存
            </el-button>
          </el-col>
        </el-row>

        <div
          v-if="item.isWei"
          class="pdf-item"
          :class="dragShow(index, 'pdf') ? 'active-item' : ''"
          @dragover.prevent="($event) => onDragover($event, index, 'pdf')"
          @dragenter.prevent="($event) => onDragenter($event, index, 'pdf')"
          @dragleave.stop.prevent="($event) => onDragleave($event, index, 'pdf')"
          @drop.prevent="($event) => onDragdrop($event, index, 'pdf')"
        >
          <div
            v-if="dragShow(index, 'pdf')"
            class="active-tip"
          >
            <span>释放鼠标，上传文件</span>
          </div>
          <el-row
            v-if="item.isWei"
            style="border-top: 1px solid #eee;padding: 20px 20px 0;"
          >
            <el-col :span="2">
              <el-tag
                class="title-tag"
                effect="dark"
              >
                称重
              </el-tag>
            </el-col>
            <el-col :span="16">
              <el-form-item
                label="重量"
                class="is-required"
              >
                <div class="input-content">
                  <div style="flex: 1;">
                    <el-input-number
                      v-model="item.weight2"
                      :disabled="item.isEditW"
                      class="input-number-valiate input-border"
                      :controls="false"
                      placeholder="请输入"
                      :min="0"
                      :max="99999"
                      :precision="2"
                    />
                  </div>
                  <div class="input-unit">
                    {{ item.umWeight2 || 'KGS' }}
                  </div>
                </div>
              </el-form-item>
              <el-form-item
                prop=""
                label="上传文件"
                style="width: 66%;"
              >
                <el-upload
                  ref="uploadFile"
                  class="upload-demo"
                  type="text"
                  action
                  multiple
                  accept=".pdf,.PDF"
                  :limit="1"
                  :disabled="item.isEditW"
                  :http-request="uploadFile"
                  :on-remove="(file, list) => onFileRemove(file, list, index)"
                  :before-upload="beforePDFUpload"
                  :on-exceed="beforePDFExceed"
                  :on-preview="onFilePreview"
                  :file-list="item.fileList"
                >
                  <div>
                    <span
                      style="cursor: auto;"
                      @click.stop=""
                    >
                      将文件拖到此处，或
                    </span>
                    <el-button
                      :disabled="item.isEditW"
                      type="text"
                      size="small"
                      @click="onFile(index)"
                    >
                      点击上传
                    </el-button>
                  </div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
              style="text-align: right;"
            >
              <el-button
                v-show="!!item.id && item.isEditW"
                :disabled="orderType !== '0' || isEffect === '209'"
                type="text"
                size="small"
                @click="edit('3', index)"
              >
                编辑
              </el-button>
              <el-button
                v-show="item.isAdd"
                type="text"
                size="small"
                @click="cancel('3', index)"
              >
                取消
              </el-button>
              <el-button
                v-show="item.isAdd || !item.isEditW"
                type="text"
                size="small"
                @click="save('3', index)"
              >
                保存
              </el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  saveWeight,
  saveContain,
  saveGoods,
  getContainStep
} from '@/api/orderlist-at-booking'
import dayjs from 'dayjs'
import { file } from 'node_modules/@types/jszip'

function paramsForm() {
  return {
    containerNo: undefined,
    description: undefined,
    sealNo: undefined,
    packages: undefined,
    weight: undefined,
    volume: undefined,
    weight2: undefined,
    files: [],
    imgs: []
  }
}

@Component({
  name: 'twoForm',
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
  private selectForm: any = paramsForm()
  private formRules: any = {
    containerNo: [
      { required: true, message: '柜号不能为空', trigger: 'blur' }
    ],
    sealNo: [
      { required: true, message: '关封号不能为空', trigger: 'blur' }
    ],
    packages: [
      { required: true, message: '总件数不能为空', trigger: 'blur' }
    ],
    weight: [
      { required: true, message: '总重量不能为空', trigger: 'blur' }
    ],
    weight2: [
      { required: true, message: '重量不能为空', trigger: 'blur' }
    ],
    volume: [{ required: true, message: '总体积不能为空', trigger: 'blur' }]

  }
  private loading: boolean = false
  private isDragFile: boolean = false
  private selectLoading: boolean = false
  private containData: any[] = []
  private statusList: any[] = []
  private maxN: number = 0
  private soObj: any = {}
  private sIndex: any = ''
  private lastenter: any = ''
  private fType: any = ''
  private statusData: any[] = [
    { key: '251', value: '起运港已提柜', keys: ['251'] },
    { key: '252', value: '起运港已装柜', keys: ['251', '252'] },
    { key: '255', value: '起运港已还柜', keys: ['252', '255'] },
    { key: '256', value: '目的港已提柜', keys: ['255', '256'] },
    { key: '257', value: '目的港已还柜', keys: ['256', '257'] }
  ]

  /** computed */
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }
  /* methods */
  // 初始化
  private async init(data: any) {
    const obj = (this as any).isOrder || {}
    this.maxN = obj.nums
    const arr = data || []
    this.containData = arr.map((it: any) => {
      const { goods, files, weight, umWeight, status, id, ...form } = it
      const arrG = goods || []
      const arrF = files || []
      const fileList: any[] = []
      const imgsList: any[] = []
      const arr1 = arrF.filter((f: any) => f.type === '1')
      if (arr1.length > 0) {
        const str1 = arr1[0].url
        if (str1) {
          const brr1 = str1.split('.')
          brr1.shift()
          fileList.push({
            name: brr1.join('.'),
            url: str1
          })
        }
      }
      const arr0 = arrF.filter((f: any) => f.type === '0')
      if (arr0.length > 0) {
        const str0 = arr0[0].url
        if (str0) {
          const brr0 = str0.split('.')
          brr0.shift()
          imgsList.push({
            name: brr0.join('.'),
            url: str0
          })
        }
      }
      // 251,252,253,254,255
      return {
        ...form,
        id,
        description: (arrG[0] || {}).description,
        packages: (arrG[0] || {}).packages,
        weight: (arrG[0] || {}).weight,
        volume: (arrG[0] || {}).volume,
        umVolume: (arrG[0] || {}).umVolume,
        umWeight: (arrG[0] || {}).umWeight,
        umPackage: (arrG[0] || {}).umPackage,
        gId: (arrG[0] || {}).id,
        weight2: weight,
        umWeight2: umWeight,
        files: fileList,
        imgs: imgsList,
        fileList,
        imgsList,
        status,
        statusList: this.setStatus(status),
        isAdd: false,
        isMat: arrG.length > 0,
        isWei: !!weight,
        isEditC: !!id,
        isEditM: !!id,
        isEditW: !!id
      }
    })
  }

  private async getStatus() {
    this.selectLoading = true
    await getContainStep()
      .then((res: any) => {
        this.selectLoading = false
        const data = res.data || []
        this.statusList = data
      })
      .catch((err: any) => {
        return err
      })
  }
  private setStatus(val: any) {
    if (val) {
      const arr: any[] = []
      this.statusData.map((it: any) => {
        const item = it.keys.some((k: any) => k === val)
        if (item) {
          arr.push({
            key: it.key,
            value: it.value
          })
        }
      })
      return arr
    } else {
      return [{
        key: this.statusData[0].key,
        value: this.statusData[0].value
      }]
    }
  }
  private onStatus() {
    //
  }
  private setSo(data: any) {
    this.soObj = data
  }
  private addItem() {
    const len = this.containData.length
    if (len < this.maxN) {
      this.containData.push({
        containerNo: undefined,
        description: undefined,
        sealNo: undefined,
        packages: undefined,
        weight: undefined,
        volume: undefined,
        umVolume: 'CBM',
        umWeight: 'KGS',
        umPackage: 'BOX',
        weight2: undefined,
        umWeight2: 'KGS',
        isAdd: true,
        isEditC: false,
        isEditM: false,
        isEditW: false, // 是否可编辑
        isMat: false, // 是否展示补料
        isWei: false, // 是否展示称重
        files: [],
        fileList: [],
        imgs: [],
        imgsList: [],
        status: undefined,
        statusList: this.setStatus('')
      })
    } else {
      this.$message.error('货柜数量已达上限')
    }
  }
  private addMatter(idx: any) {
    this.containData[idx].isMat = true
    this.containData[idx].isEditM = false
    this.containData[idx].umPackage = 'BOX'
    this.containData[idx].umWeight = 'KGS'
    this.containData[idx].umVolume = 'CBM'
  }
  private addWeight(idx: any) {
    this.containData[idx].isWei = true
    this.containData[idx].isEditW = false
    this.containData[idx].umWeight2 = 'KGS'
  }

  // html5拖拽
  private dragShow(index: any, str: any) {
    return this.sIndex === index && this.isDragFile && this.fType === str
  }
  private onDragenter(e: any, i: any, t: any) {
    if (t === 'img') {
      const root: any = document.getElementsByClassName('img-item')
      root[i].classList.add('dragging-over')
    } else {
      const root: any = document.getElementsByClassName('pdf-item')
      root[i].classList.add('dragging-over')
    }
    this.lastenter = e.target
    // if (!this.isEdit) return
    this.sIndex = i
    this.fType = t
    this.isDragFile = true
  }
  private onDragover(e: any, i: any, t: any) {
    // if (!this.isEdit) return
    this.sIndex = i
    this.fType = t
    this.isDragFile = true
  }
  private onDragleave(e: any, i: any, t: any) {
    if (this.lastenter === e.target) {
      if (t === 'img') {
        const root: any = document.getElementsByClassName('img-item')
        root[i].classList.add('dragging-over')
      } else {
        const root: any = document.getElementsByClassName('pdf-item')
        root[i].classList.add('dragging-over')
      }
      // if (!this.isEdit) return
      this.sIndex = i
      this.fType = t
      this.isDragFile = false
    }
  }
  private onDragdrop(e: any, i: any, t: any) {
    if (t === 'img') {
      const root: any = document.getElementsByClassName('img-item')
      root[i].classList.add('dragging-over')
    } else {
      const root: any = document.getElementsByClassName('pdf-item')
      root[i].classList.add('dragging-over')
    }
    // if (!this.isEdit) return
    this.sIndex = i
    this.fType = t
    this.isDragFile = false
    this.onDrop(e, t)
  }
  private onDrop(e: any, t: any) {
    const files = (e.dataTransfer || {}).files || []
    if (files.length <= 0) return
    const obj = files[0] || {}
    if (t === 'pdf' && obj.type.indexOf('pdf') === -1) {
      this.$message.error('请上传pdf文件')
      return
    }
    if (t === 'img' && obj.type.indexOf('image') === -1) {
      this.$message.error('请上传图片')
      return
    }
    if (t === 'pdf' && (this.containData[this.sIndex].files || []).length > 0) {
      this.$message.error('文件已存在')
      return
    }
    if (t === 'img' && (this.containData[this.sIndex].imgs || []).length > 0) {
      this.$message.error('图片已存在')
      return
    }
    if (t === 'img') {
      this.uploadImg({
        file: obj
      })
    } else {
      this.uploadFile({
        file: obj
      })
    }
  }
  private onFileRemove(obj: any, list: any, index: any) {
    this.sIndex = index
    const url = obj.url
    if (url) {
      this.$deleteLoad(url, true)
        .then((res: any) => {
          this.$message.success(`删除成功`)
        })
        .catch((err: any) => {
          return err
        })
    }
    this.containData[this.sIndex].files = []
    this.containData[this.sIndex].fileList = []
  }
  private onFilePreview(obj: any) {
    const url = process.env.VUE_APP_OSS_PATH + obj.url
    window.open(url)
  }
  private onFile(idx: any) {
    this.sIndex = idx
  }
  private uploadFile(params: any): void {
    const fff = params.file
    this.$upload(true, fff, `jht-admin/orderlist/booking/file/${dayjs().valueOf() + '/' + fff.name}`)
      .then((res: any) => {
        this.containData[this.sIndex].files = [{
          name: (params.file || {}).name,
          url: res.data
        }]
        this.containData[this.sIndex].fileList = [{
          name: (params.file || {}).name,
          url: res.data
        }]
        this.$message.success('上传成功')
      })
      .catch((err: any) => {
        return err
      })
  }
  private onImgRemove(obj: any, list: any, index: any) {
    this.sIndex = index
    const url = obj.url
    if (url) {
      this.$deleteLoad(url, true)
        .then((res: any) => {
          this.$message.success(`删除成功`)
        })
        .catch((err: any) => {
          return err
        })
    }
    this.containData[this.sIndex].imgs = []
    this.containData[this.sIndex].imgsList = []
  }
  private onImgPreview(obj: any) {
    const url = process.env.VUE_APP_OSS_PATH + obj.url
    window.open(url)
  }
  private onImg(idx: any) {
    this.sIndex = idx
  }
  private beforeUpload(obj: any) {
    const isJPG = obj.type.indexOf('image') !== -1
    const isLt2M = obj.size / 1024 / 1024 < 2
    if (!isJPG) {
      this.$message.error('上传照片只能是图片格式!')
    }
    if (!isLt2M) {
      this.$message.error('上传照片大小不能超过 2MB!')
    }
    return isJPG && isLt2M
  }
  private beforeExceed(files: any) {
    this.$message.error('照片已存在')
  }
  private beforePDFUpload(obj: any) {
    if (obj.type.indexOf('pdf') === -1) {
      this.$message.error('仅支持pdf文件')
      return false
    } else if (obj.name.length > 100) {
      this.$message.error('pdf文件名过长')
      return false
    }
  }
  private beforePDFExceed(files: any) {
    this.$message.error('pdf文件已存在')
  }
  private uploadImg(params: any): void {
    const fff = params.file
    this.$upload(true, fff, `jht-admin/orderlist/booking/img/${dayjs().valueOf() + '/' + fff.name}`)
      .then((res: any) => {
        this.containData[this.sIndex].imgs = [{
          name: (params.file || {}).name,
          url: res.data
        }]
        this.containData[this.sIndex].imgsList = [{
          name: (params.file || {}).name,
          url: res.data
        }]
        this.$message.success('上传成功')
      })
      .catch((err: any) => {
        return err
      })
  }

  private cancel(str: string, idx: any) {
    if (str === '1') {
      this.containData.splice(idx, 1)
    } else if (str === '2') {
      this.containData[idx].isMat = false
      this.containData[idx].packages = undefined
      this.containData[idx].weight = undefined
      this.containData[idx].volume = undefined
    } else if (str === '3') {
      this.containData[idx].isWei = false
      this.containData[idx].weight = undefined
      this.containData[idx].imgs = []
    }
  }
  private save(str: string, idx: any) {
    // 已甩柜状态只能保存甩柜信息
    const isStatus = (this as any).isStatus
    if (isStatus === '204') return
    const form = this.containData[idx] || {}
    const order = (this as any).isOrder
    const reg = /^[a-zA-Z0-9]*$/
    if (str === '1') {
      const { imgs, containerNo, sealNo, id, weight2, umWeight2, status } = form
      if (!containerNo) {
        this.$message.error('请填写柜号')
        return
      }
      if (!reg.test(containerNo)) {
        this.$message.error('柜号不能有中文及特殊字符')
      }
      if (!sealNo) {
        this.$message.error('请填写关封号')
        return
      }
      if (!reg.test(sealNo)) {
        this.$message.error('关封号不能有中文及特殊字符')
      }
      if (!status) {
        this.$message.error('请选择货柜状态')
        return
      }
      const arrI = imgs.map((it: any) => it.url)
      // if (arrI.length <= 0) {
      //   this.$message.error('请上传照片')
      //   return
      // }
      this.loading = true
      const params: any = {
        id,
        pictures: arrI,
        containerNo,
        sealNo,
        bookingId: order.id,
        status,
        so: this.soObj.soCode,
        soId: this.soObj.id,
        weight: weight2,
        umWeight: umWeight2
      }
      saveContain(params)
        .then((res: any) => {
          this.loading = false
          this.$message.success('保存成功')
          this.$emit('refresh')
        })
        .catch((err: any) => {
          this.loading = false
          return err
        })
    } else if (str === '2') {
      const { volume, weight, packages, id, description, gId, status, umVolume, umWeight, umPackage } = form
      if (!packages) {
        this.$message.error('请填写总件数')
        return
      }
      if (!weight) {
        this.$message.error('请填写总重量')
        return
      }
      if (!volume) {
        this.$message.error('请填写总体积')
        return
      }
      this.loading = true
      const params: any = {
        id: gId,
        bookingId: order.id,
        containerId: id,
        volume,
        weight,
        umVolume,
        umWeight,
        umPackage,
        packages,
        status,
        description
      }
      saveGoods(params)
        .then((res: any) => {
          this.loading = false
          this.$message.success('保存成功')
          this.$emit('refresh')
        })
        .catch((err: any) => {
          this.loading = false
          return err
        })
    } else if (str === '3') {
      const { files, weight2, umWeight2, id, status } = form
      if (!weight2) {
        this.$message.error('请填写称重重量')
        return
      }
      const arrF = files.map((it: any) => it.url)
      // if (arrF.length <= 0) {
      //   this.$message.error('请上传文件')
      //   return
      // }
      this.loading = true
      const params: any = {
        bookingId: order.id,
        containerId: id,
        files: arrF,
        status,
        weight: weight2,
        umWeight: umWeight2
      }
      saveWeight(params)
        .then((res: any) => {
          this.loading = false
          this.$message.success('保存成功')
          this.$emit('refresh')
        })
        .catch((err: any) => {
          this.loading = false
          return err
        })
    }
  }
  private reset() {
    this.fType = ''
    this.sIndex = ''
    this.lastenter = ''
    this.containData = []
  }
  private edit(str: string, idx: any) {
    if (str === '1') {
      this.containData[idx].isEditC = false
    } else if (str === '2') {
      this.containData[idx].isEditM = false
    } else if (str === '3') {
      this.containData[idx].isEditW = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  display: inline-block;
  width: 33.33%;
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
  width: 70px;
  height: 32px;
  background-color: #f5f7fa;
  color: #909399;
  padding: 0 10px;
  border: 1px solid #dcdfe6;
  border-left: 0;
  border-radius: 0 4px 4px 0;
  margin-left: -1px;
}
.input-select {
  width: 70px;
  ::v-deep .el-input__inner {
    border-left: 0px;
    border-radius: 0 4px 4px 0;
  }
  ::v-deep .el-select .el-input.is-focus .el-input__inner {
    border-color: #dcdfe6;
  }
  ::v-deep .el-select .el-input__inner:focus {
    border-color: #dcdfe6;
  }
}
.input-border {
  ::v-deep .el-input__inner {
    border-radius: 4px 0 0 4px;
  }
}

.title-tag {
  border-color: #4B5568;
  background-color: #4B5568;
}

.img-item {
  border: dashed 1px #fff;
  padding: 5px 0 20px 0;
}
.pdf-item {
  border: dashed 1px #fff;
  padding-bottom: 20px;
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
  float: right;
}
::v-deep .el-upload-list__item {
  margin-top: 0;
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
