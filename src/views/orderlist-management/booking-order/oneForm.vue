<template>
  <div v-loading="loading">
    <div
      style="text-align: right;padding: 0 20px 10px 0;"
    >
      <el-button
        v-show="!!isEffect && !isEdit"
        :disabled="orderType !== '0' || isEffect === '209'"
        type="primary"
        size="small"
        @click="editForm"
      >
        编辑
      </el-button>
      <el-button
        v-show="!isEffect || isEdit"
        :disabled="orderType !== '0' || isEffect === '209'"
        type="primary"
        size="small"
        @click="saveForm"
      >
        保存
      </el-button>
    </div>
    <el-form
      id="dragDropForm"
      ref="selectForm"
      :model="selectForm"
      :rules="formRules"
      :disabled="!isEdit && !!isEffect"
      label-width="110px"
      size="small"
      class="one-form"
      :class="isDragFile ? 'active-form' : ''"
      @dragover.native.prevent="onDragover"
      @dragenter.native.prevent="onDragenter"
      @dragleave.native.stop.prevent="onDragleave"
      @drop.native.prevent="onDragdrop"
    >
      <div
        v-if="isDragFile"
        class="active-tip"
      >
        <span>释放鼠标，上传文件</span>
      </div>
      <el-form-item
        label="SO号码"
        prop="soCode"
      >
        <el-input
          v-model="selectForm.soCode"
          :disabled="selectForm.filled"
          show-word-limit
          :maxlength="50"
          placeholder="请输入"
        />
      </el-form-item>
      <!-- <el-form-item
        label="提单号"
        prop="billNo"
      >
        <el-input
          v-model="selectForm.billNo"
          show-word-limit
          :maxlength="50"
          placeholder="请输入"
        />
      </el-form-item> -->
      <el-form-item
        label="船名"
        prop="freighter"
      >
        <el-input
          v-model="selectForm.freighter"
          :maxlength="50"
          show-word-limit
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item
        label="航次"
        prop="ship"
      >
        <el-input
          v-model="selectForm.ship"
          :maxlength="20"
          show-word-limit
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item
        label="服务机构"
        prop="orgId"
      >
        <el-select
          v-model="selectForm.orgId"
          :loading="selectLoading"
          size="small"
          style="width: 100%;"
          placeholder="请输入"
          clearable
          filterable
          @focus="getBsTransData"
          @change="onBsTran"
        >
          <el-option
            v-for="item in bsTransList"
            :key="item.id"
            :label="`${item.serviceCode}-${item.orgName}`"
            :value="item.orgId"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="二程服务机构"
      >
        <el-input
          v-model="selectForm.orgName2"
          placeholder="请输入"
          disabled
        />
      </el-form-item>
      <el-form-item
        label="收货地址"
        prop="receiptAddress"
      >
        <el-input
          v-model="selectForm.receiptAddress"
          placeholder="请输入"
          size="small"
          :maxlength="200"
        />
      </el-form-item>
      <el-form-item
        label="交货地址"
        prop="deliveryAddress"
      >
        <el-input
          v-model="selectForm.deliveryAddress"
          placeholder="请输入"
          size="small"
          :maxlength="200"
        />
      </el-form-item>
      <el-form-item
        label="提柜地址"
        prop="pickAddress"
      >
        <el-input
          v-model="selectForm.pickAddress"
          placeholder="请输入"
          size="small"
          :maxlength="200"
        />
      </el-form-item>
      <el-form-item
        label="还柜地址"
        prop="returnAddress"
      >
        <el-input
          v-model="selectForm.returnAddress"
          placeholder="请输入"
          size="small"
          :maxlength="200"
        />
      </el-form-item>

      <el-form-item
        label="装货港"
        prop="loadingPortId"
      >
        <el-select
          v-model="selectForm.loadingPortId"
          :loading="selectLoading"
          placeholder="请选择"
          filterable
          clearable
          style="width:100%;"
          size="small"
          @focus="getFromPort"
          @change="onFromPort"
        >
          <el-option
            v-for="item in portFromList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="中转港"
        prop="transPortId"
      >
        <el-select
          v-model="selectForm.transPortId"
          :loading="selectLoading"
          :disabled="!selectForm.orgId"
          placeholder="请选择"
          filterable
          clearable
          style="width:100%;"
          size="small"
          @focus="getTranPort"
        >
          <el-option
            v-for="item in transPortList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="卸货港"
        prop="unloadPortId"
      >
        <el-select
          v-model="selectForm.unloadPortId"
          :loading="selectLoading"
          placeholder="请选择"
          filterable
          clearable
          style="width:100%;"
          size="small"
          @focus="getToPort"
          @change="onToPort"
        >
          <el-option
            v-for="item in portToList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="ETA"
        prop="eta"
      >
        <el-date-picker
          v-model="selectForm.eta"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          size="small"
          style="width:100%;"
        />
      </el-form-item>
      <el-form-item
        label="ETD"
        prop="etd"
      >
        <el-date-picker
          v-model="selectForm.etd"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          size="small"
          style="width:100%;"
        />
      </el-form-item>
      <el-form-item
        label="二程ETD"
        prop="etd2"
      >
        <el-date-picker
          v-model="selectForm.etd2"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          size="small"
          style="width:100%;"
        />
      </el-form-item>
      <el-form-item
        label="截单日期"
        prop="sheetTime"
      >
        <el-date-picker
          v-model="selectForm.sheetTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          size="small"
          style="width:100%;"
        />
      </el-form-item>
      <el-form-item
        label="截VGM日期"
        prop="vgmTime"
      >
        <el-date-picker
          v-model="selectForm.vgmTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          size="small"
          style="width:100%;"
        />
      </el-form-item>
      <el-form-item
        label="截关日期"
        prop="customsTime"
      >
        <el-date-picker
          v-model="selectForm.customsTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          size="small"
          style="width:100%;"
        />
      </el-form-item>
      <el-form-item
        label="柜型"
        prop="containerId"
      >
        <el-select
          v-model="selectForm.containerId"
          :loading="selectLoading"
          style="width:100%;"
          size="small"
          placeholder="请选择"
          clearable
          @focus="getContainerData"
        >
          <el-option
            v-for="item in containerList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="数量"
        prop="quantity"
      >
        <el-input-number
          v-model="selectForm.quantity"
          class="input-number-valiate"
          :controls="false"
          placeholder="请输入"
          :min="0"
          :max="99999"
          :step="1"
          step-strictly
        />
      </el-form-item>
      <el-form-item
        label="最大限重"
        prop="weightLimit"
      >
        <el-input-number
          v-model="selectForm.weightLimit"
          class="input-number-valiate"
          :controls="false"
          placeholder="请输入"
          :min="0"
          :max="99999"
          :precision="2"
        />
      </el-form-item>
      <el-form-item
        label="空柜重量"
        prop="emptyWeight"
      >
        <el-input-number
          v-model="selectForm.emptyWeight"
          class="input-number-valiate"
          :controls="false"
          placeholder="请输入"
          :min="0"
          :max="99999"
          :precision="2"
        />
      </el-form-item>
      <el-form-item
        prop="file"
        label="上传SO"
        class="is-required"
        style="width: 50%;"
      >
        <el-upload
          ref="uploadFile"
          class="upload-demo"
          action
          multiple
          accept=".pdf,.PDF"
          :limit="1"
          :http-request="uploadFile"
          :before-upload="beforeUpload"
          :on-remove="onFileRemove"
          :on-preview="onPreview"
          :on-exceed="beforeExceed"
          :file-list="fileList"
        >
          <div>
            <span
              style="cursor: auto;"
              @click.stop=""
            >
              将文件拖到此处，或
            </span>
            <el-button
              type="text"
              size="small"
            >
              点击上传
            </el-button>
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  getPortList,
  getContainerList,
  saveSo,
  getPlanDetail,
  getBsTransList,
  getBsTransByPlanId
} from '@/api/orderlist-at-booking'
import dayjs from 'dayjs'

function paramsForm() {
  return {
    soCode: undefined,
    billNo: undefined,
    orgId: undefined,
    orgId2: undefined,
    orgName: undefined,
    orgName2: undefined,
    freighter: undefined,
    ship: undefined,
    deliveryAddress: undefined,
    deliveryCityId: undefined,
    deliveryCityName: undefined,
    deliveryCountryId: undefined,
    deliveryCountryName: undefined,
    deliveryStateId: undefined,
    deliveryStateName: undefined,
    pickAddress: undefined,
    pickCityId: undefined,
    pickCityName: undefined,
    pickCountryId: undefined,
    pickCountryName: undefined,
    pickStateId: undefined,
    pickStateName: undefined,
    receiptAddress: undefined,
    receiptCityId: undefined,
    receiptCityName: undefined,
    receiptCountryId: undefined,
    receiptCountryName: undefined,
    receiptStateId: undefined,
    receiptStateName: undefined,
    returnAddress: undefined,
    returnCityId: undefined,
    returnCityName: undefined,
    returnCountryId: undefined,
    returnCountryName: undefined,
    returnStateId: undefined,
    returnStateName: undefined,
    loadingPortId: undefined,
    loadingPortName: undefined,
    transPortId: undefined,
    transPortName: undefined,
    unloadPortId: undefined,
    unloadPortName: undefined,
    weightLimit: undefined,
    vgmTime: undefined,
    quantity: undefined,
    customsTime: undefined,
    containerId: undefined,
    containerName: undefined,
    bookingId: undefined,
    emptyWeight: undefined,
    eta: undefined,
    etd: undefined,
    etd2: undefined,
    files: [],
    sheetTime: undefined
  }
}

@Component({
  name: 'oneForm',
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
    soCode: [
      { required: true, message: 'SO号码不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (!value) {
            callback(new Error('SO号码不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('SO号码不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    freighter: [
      { required: true, message: '船名不能为空', trigger: 'blur' }
    ],
    ship: [
      { required: true, message: '航次不能为空', trigger: 'blur' }
    ],
    receiptAddress: [
      { required: true, message: '收货地址不能为空', trigger: 'blur' }
    ],
    deliveryAddress: [
      { required: true, message: '交货地址不能为空', trigger: 'blur' }
    ],
    pickAddress: [
      { required: true, message: '提柜地址不能为空', trigger: 'blur' }
    ],
    returnAddress: [
      { required: true, message: '还柜地址不能为空', trigger: 'blur' }
    ],
    orgId: [
      { required: true, message: '请选择服务机构', trigger: 'change' }
    ],
    loadingPortId: [
      { required: true, message: '请选择装货港', trigger: 'change' }
    ],
    unloadPortId: [
      { required: true, message: '请选择卸货港', trigger: 'change' }
    ],
    eta: [
      { required: true, message: '请选择ETA', trigger: 'change' }
    ],
    etd: [
      { required: true, message: '请选择ETD', trigger: 'change' }
    ],
    customsTime: [
      { required: true, message: '请选择截关日期', trigger: 'change' }
    ],
    sheetTime: [
      { required: true, message: '请选择截单日期', trigger: 'change' }
    ],
    vgmTime: [
      { required: true, message: '请选择截VGM日期', trigger: 'change' }
    ],
    containerId: [
      { required: true, message: '请选择柜型', trigger: 'change' }
    ],
    weightLimit: [
      { required: true, message: '最大限重不能为空', trigger: 'blur' }
    ],
    emptyWeight: [
      { required: true, message: '空柜重量不能为空', trigger: 'blur' }
    ],
    quantity: [{ required: true, message: '数量不能为空', trigger: 'blur' }]
  }
  private loading: boolean = false
  private selectLoading: boolean = false
  private bsTransList: any[] = []
  private portFromList: any[] = []
  private transPortList: any[] = []
  private portToList: any[] = []
  private containerList: any[] = []
  private fileList: any[] = []
  private orderRow: any = {
    id: undefined,
    bsId: undefined,
    fromCountry: undefined,
    tranCountry: undefined,
    toCountry: undefined,
    businessType: undefined
  }
  private planId: any = ''
  private lastenter: any = ''
  private isEdit: boolean = false
  private isDragFile: boolean = false

  /** computed */
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }
  /* methods */
  // 初始化
  private async init(data: any) {
    this.loading = true
    const obj = (this as any).isOrder || {}
    this.planId = obj.planId
    this.orderRow.id = obj.id
    this.orderRow.bsId = obj.bsId
    this.orderRow.fromCountry = obj.fromCountry
    this.orderRow.toCountry = obj.toCountry
    this.orderRow.businessType = obj.businessType
    this.getContainerData()
    try {
      if (this.planId) {
        await this.getBsTransByPlanId()
      } else {
        await this.getBsTransList()
      }
      await this.getFromPort()
      await this.getToPort()
    } catch (error) {
      this.loading = false
    }

    // 文件
    const arr = (data || {}).files || []
    if (arr.length > 0) {
      const str = arr.join(',')
      const brr = str.split('.')
      brr.shift()
      this.fileList = []
      this.fileList.push({
        name: brr.join('.'),
        url: str
      })
    }
    const { ...form } = data
    Object.assign(this.selectForm, form)
    if (this.selectForm.id) {
      const item = this.bsTransList.find((it: any) => it.orgId === this.selectForm.orgId) || {}
      this.orderRow.tranCountry = item.entreportCountryId || undefined
      try {
        await this.getTranPort()
      } catch (error) {
        this.loading = false
      }
    } else { // new
      this.selectForm.loadingPortId = obj.portsFromId
      this.selectForm.unloadPortId = obj.portsToId
      this.selectForm.containerId = obj.cabinetType
      if (obj.planId) {
        try {
          const resP = await getPlanDetail({ id: obj.planId })
          const dataP = resP.data || {}
          this.selectForm.weightLimit = dataP.loadLimit
          this.selectForm.quantity = dataP.quantity
        } catch (error) {
          this.loading = false
        }
      }
      this.onFromPort()
      this.onToPort()
    }
    this.loading = false
  }

  // html5拖拽
  private onDragenter(e: any) {
    const root: any = document.getElementById('dragDropForm')
    root.classList.add('dragging-over')
    this.lastenter = e.target
    if (!this.isEdit && (this as any).isEffect) return
    this.isDragFile = true
  }
  private onDragover(e: any) {
    if (!this.isEdit && (this as any).isEffect) return
    this.isDragFile = true
  }
  private onDragleave(e: any) {
    if (this.lastenter === e.target) {
      const root: any = document.getElementById('dragDropForm')
      root.classList.remove('dragging-over')
      if (!this.isEdit && (this as any).isEffect) return
      this.isDragFile = false
    }
  }
  private onDragdrop(e: any) {
    const root: any = document.getElementById('dragDropForm')
    root.classList.remove('dragging-over')
    if (!this.isEdit && (this as any).isEffect) return
    this.isDragFile = false
    this.onDrop(e)
  }
  private onDrop(e: any) {
    const files = (e.dataTransfer || {}).files || []
    if (files.length <= 0) return
    const obj = files[0] || {}
    if (obj.type.indexOf('pdf') === -1) {
      this.$message.error('请上传pdf文件')
    }
    if ((this.selectForm.files || []).length > 0) {
      this.$message.error('pdf文件已存在')
      return
    }
    this.uploadFile({
      file: obj
    })
  }

  private onFileRemove(file: any, fileList: any[]) {
    this.$deleteLoad(file.url, true)
      .then((res: any) => {
        this.$message.success(`删除成功`)
      })
      .catch((err: any) => {
        return err
      })
    this.selectForm.files = []
  }
  private onPreview(file: any) {
    const url = process.env.VUE_APP_OSS_PATH + file.url
    window.open(url)
  }
  private beforeUpload(file: any) {
    if (file.type.indexOf('pdf') === -1) {
      this.$message.error('仅支持pdf文件')
      return false
    } else if (file.name.length > 100) {
      this.$message.error('pdf文件名过长')
      return false
    }
  }
  private beforeExceed(files: any) {
    this.$message.error('pdf文件已存在')
  }
  private uploadFile(params: any): void {
    const { file } = params
    this.$upload(true, file, `jht-admin/orderlist/booking/so/${dayjs().valueOf() + '/' + file.name}`)
      .then((res: any) => {
        this.selectForm.files = [res.data || '']
        this.fileList = []
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
  private editForm() {
    this.isEdit = true
  }
  private saveForm() {
    // 已甩柜状态只能保存甩柜信息
    const isStatus = (this as any).isStatus
    if (isStatus === '204') return
    const that = this as any
    const editForm: any = that.$refs.selectForm
    editForm.validate((valid: any) => {
      if (!valid) return false
      if (this.selectForm.files.length <= 0) {
        this.$message.error('请上传so文件')
        return false
      }
      if (!(this as any).isStatus) {
        this.$message.error('请选择订单状态')
        return false
      }
      const params: any = {
        ...this.selectForm,
        bookingId: this.orderRow.id,
        status: (this as any).isStatus
      }
      this.portFromList.map((it: any) => {
        if (params.loadingPortId === it.id) {
          params.loadingPortName = it.name
        }
      })
      this.transPortList.map((it: any) => {
        if (params.transPortId === it.id) {
          params.transPortName = it.name
        }
      })
      this.portToList.map((it: any) => {
        if (params.unloadPortId === it.id) {
          params.unloadPortName = it.name
        }
      })
      this.containerList.map((it: any) => {
        if (params.containerId === it.id) {
          params.containerName = it.name
        }
      })
      this.edit(params)
    })
  }
  private edit(params: any) {
    this.loading = true
    this.$emit('btnLoad', true)
    saveSo(params)
      .then((res: any) => {
        this.loading = false
        this.$emit('btnLoad', false)
        this.$message.success('保存成功')
        this.$emit('refresh')
        this.fileList = []
        this.isEdit = false
      })
      .catch((err: any) => {
        this.$emit('btnLoad', false)
        this.loading = false
        return err
      })
  }
  private reset() {
    this.selectForm = paramsForm()
    this.fileList = []
    this.isEdit = false
    this.planId = ''
    this.$nextTick(() => {
      const editForm: any = this.$refs.selectForm
      editForm.clearValidate()
    })
  }
  private async getBsTransData() {
    if (this.planId) {
      await this.getBsTransByPlanId()
    } else {
      await this.getBsTransList()
    }
  }
  private async getBsTransList() {
    const params = {
      page: 1,
      size: 999,
      model: {
        id: this.orderRow.bsId
      }
    }
    this.selectLoading = true
    await getBsTransList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.bsTransList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private async getBsTransByPlanId() {
    this.selectLoading = true
    await getBsTransByPlanId({
      id: this.planId
    })
      .then((res: any) => {
        const data = res.data || []
        this.bsTransList = data
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private onBsTran() {
    const item = this.bsTransList.find((it: any) => it.orgId === this.selectForm.orgId) || {}
    this.selectForm.orgName = item.orgName || undefined
    this.selectForm.orgId2 = item.orgId2 || undefined
    this.selectForm.orgName2 = item.orgName2 || undefined
    this.selectForm.bsTransCode = item.serviceCode || undefined
    this.selectForm.transPortId = item.entreport || undefined
    this.orderRow.tranCountry = item.entreportCountryId || undefined
  }
  private async getFromPort() {
    this.selectLoading = true
    const params: any = {
      page: 1,
      size: 9999,
      type: this.orderRow.businessType,
      countryId: this.orderRow.fromCountry
    }
    await getPortList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.portFromList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private onFromPort() {
    this.portFromList.map((it: any) => {
      if (it.id === this.selectForm.loadingPortId) {
        const { countryId, countryName, stateId, stateName, cityId, cityName } = it
        this.selectForm.pickCityId = cityId
        this.selectForm.pickCityName = cityName
        this.selectForm.pickCountryId = countryId
        this.selectForm.pickCountryName = countryName
        this.selectForm.pickStateId = stateId
        this.selectForm.pickStateName = stateName
        this.selectForm.receiptCityId = cityId
        this.selectForm.receiptCityName = cityName
        this.selectForm.receiptCountryId = countryId
        this.selectForm.receiptCountryName = countryName
        this.selectForm.receiptStateId = stateId
        this.selectForm.receiptStateName = stateName
        this.selectForm.returnCityId = cityId
        this.selectForm.returnCityName = cityName
        this.selectForm.returnCountryId = countryId
        this.selectForm.returnCountryName = countryName
        this.selectForm.returnStateId = stateId
        this.selectForm.returnStateName = stateName
      }
    })
  }
  private async getTranPort() {
    this.selectLoading = true
    const params: any = {
      page: 1,
      size: 9999,
      type: this.orderRow.businessType,
      countryId: this.orderRow.tranCountry
    }
    await getPortList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.transPortList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private async getToPort() {
    this.selectLoading = true
    const params: any = {
      page: 1,
      size: 9999,
      type: this.orderRow.businessType,
      countryId: this.orderRow.toCountry
    }
    await getPortList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.portToList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private onToPort() {
    this.portToList.map((it: any) => {
      if (it.id === this.selectForm.unloadPortId) {
        const { countryId, countryName, stateId, stateName, cityId, cityName } = it
        this.selectForm.deliveryCityId = cityId
        this.selectForm.deliveryCityName = cityName
        this.selectForm.deliveryCountryId = countryId
        this.selectForm.deliveryCountryName = countryName
        this.selectForm.deliveryStateId = stateId
        this.selectForm.deliveryStateName = stateName
      }
    })
  }

  // 获取柜型
  private getContainerData() {
    const params = {
      page: 1,
      size: 9999
    }
    getContainerList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.containerList = data.result || []
      }).catch((err: any) => {
        return err
      })
  }
}
</script>

<style lang="scss" scoped>
.one-form {
  border: dashed 1px #fff;
  padding: 5px 0 20px 0;
}
.active-form {
  position: relative;
  border-color: #1890ff !important;
}
.active-tip {
  position: absolute;
  right: 0;
  bottom: 0;
  color: #1890ff;
  font-size: 16px;
}
.dragging-over *{
  pointer-events: none;
}
.el-form-item {
  display: inline-block;
  width: 24.9%;
}
::v-deep .el-icon-close-tip {
  display: none !important;
}

.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
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
</style>
