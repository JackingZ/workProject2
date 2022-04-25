<template>
  <div
    v-loading="loading"
  >
    <div class="detail-back">
      <span
        style="cursor: pointer;"
        @click="$emit('back')"
      >
        <i class="el-icon-back" />
        <span>返回</span>
      </span>
    </div>
    <div class="app-panel order-detail">
      <div class="form-title">
        <el-row>
          <el-col :span="20">
            <span style="margin-right: 10px">
              总箱数：{{ totalPackages }}
            </span>
            <span style="margin-right: 10px">
              总体积：{{ $volumeConversion(totalVolumes, $getVolumeUnitByLengthUnit(orderDetails.umVolume), 'CBM') }} m³
            </span>
            <span style="margin-right: 10px">
              总重量：{{ totalWeights }} {{ $fomatWeight(orderDetails.umWeight) }}
            </span>
            <span style="margin-right: 10px">
              总货值：{{ totalValue }} {{ orderDetails.currencyId }}
            </span>
            <span style="margin-right: 10px">
              支持最大重量：{{ lscConfig.weight }} {{ $fomatWeight(orderDetails.umWeight) }}
            </span>
            <span style="margin-right: 10px">
              支持最大体积：{{ $volumeConversion(lscConfig.cubed, lscConfig.umVolume, 'CBM') }} m³
            </span>
          </el-col>
          <el-col
            :span="4"
            style="text-align: right;"
          >
            <el-button
              type="text"
              size="mini"
              @click="downFile"
            >
              文件下载
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="addBeatch"
            >
              添加批次
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="saveSalesmanOrder"
            >
              录单保存
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="batch-info">
        <div
          v-for="(batch, index) in batches"
          :key="batch.id"
          class="batch-item"
        >
          <el-row style="padding: 10px;border: 1px solid #e8e8e8;">
            <el-col :span="4">
              <el-tag>批次{{ index + 1 }}</el-tag>
            </el-col>
            <el-col
              :span="20"
              style="text-align: right;"
            >
              <el-button
                type="text"
                size="mini"
                @click="addBatchGood(batch)"
              >
                添加商品
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="copyBatch(batch)"
              >
                复制批次
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="deleteBath(index)"
              >
                删除批次
              </el-button>
            </el-col>
          </el-row>
          <el-row
            style="padding: 10px;border-left: 1px solid #e8e8e8;border-right: 1px solid #e8e8e8;"
          >
            <el-col :span="9">
              <el-input
                v-if="orderDetails.deliveryWay !== '0'"
                v-model="batch.reservation"
                placeholder="预约号"
                style="padding-right: 10px;width: 180px"
                size="small"
              />
              <el-input
                v-if="orderDetails.deliveryWay !== '0'"
                v-model="batch.fbaNo"
                placeholder="FBA编号"
                style="padding-right: 10px;width: 180px"
                size="small"
              />
              &nbsp;
            </el-col>
            <template v-if="container.type === '0'">
              <el-col :span="3">
                <el-input
                  v-model="batch.packages"
                  placeholder="总箱数"
                  style="padding-right: 10px"
                  size="small"
                  @blur="onlyNumber(batch.packages, batch, 'packages')"
                >
                  <template slot="append">
                    纸箱
                  </template>
                </el-input>
              </el-col>
              <el-col :span="3">
                <el-input
                  v-model="batch.weight"
                  placeholder="单箱重量"
                  style="padding-right: 10px"
                  size="small"
                  @blur="onlyNumber(batch.weight, batch, 'weight')"
                >
                  <template slot="append">
                    {{ $fomatWeight(orderDetails.umWeight) }}
                  </template>
                </el-input>
              </el-col>
              <el-col :span="3">
                <el-input
                  v-model="batch.length"
                  placeholder="单箱长度"
                  style="padding-right: 10px"
                  size="small"
                  @blur="onlyNumber(batch.length, batch, 'length')"
                >
                  <template slot="append">
                    {{ $fomatLength(orderDetails.umLength) }}
                  </template>
                </el-input>
              </el-col>
              <el-col :span="3">
                <el-input
                  v-model="batch.width"
                  placeholder="单箱宽度"
                  style="padding-right: 10px"
                  size="small"
                  @blur="onlyNumber(batch.width, batch, 'width')"
                >
                  <template slot="append">
                    {{ $fomatLength(orderDetails.umLength) }}
                  </template>
                </el-input>
              </el-col>
              <el-col :span="3">
                <el-input
                  v-model="batch.height"
                  placeholder="单箱高度"
                  size="small"
                  @blur="onlyNumber(batch.height, batch, 'height')"
                >
                  <template slot="append">
                    {{ $fomatLength(orderDetails.umLength) }}
                  </template>
                </el-input>
              </el-col>
            </template>
            <template v-else>
              <el-col :span="3">
                &nbsp;
              </el-col>
              <el-col :span="3">
                &nbsp;
              </el-col>
              <el-col :span="3">
                <el-input
                  v-model="batch.packages"
                  placeholder="总箱数"
                  style="padding-right: 10px"
                  size="small"
                  @blur="onlyNumber(batch.packages, batch, 'packages')"
                >
                  <template slot="append">
                    纸箱
                  </template>
                </el-input>
              </el-col>
              <el-col :span="3">
                <el-select
                  v-model="container.id"
                  style="width: 100%"
                  placeholder="请选择"
                  disabled
                  :loading="selectLoading"
                  @change="containerChange"
                >
                  <el-option
                    v-for="item in containerList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-col>
              <el-col :span="3">
                <el-input
                  v-model="batch.weight"
                  placeholder="单箱重量"
                  style="padding-right: 10px"
                  size="small"
                  @blur="onlyNumber(batch.weight, batch, 'weight')"
                >
                  <template slot="append">
                    {{ $fomatWeight(orderDetails.umWeight) }}
                  </template>
                </el-input>
              </el-col>
            </template>
          </el-row>
          <div class="batch-good">
            <el-table
              :data="batch.agoods"
              border
            >
              <el-table-column
                label="商品名称"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.goodsName"
                    style="margin-bottom: 5px"
                    placeholder="中文名称"
                    size="small"
                  />
                  <el-input
                    v-model="scope.row.goodsAlias"
                    placeholder="英文名称"
                    size="small"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="海关编码/SKU"
                width="150"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.hsCode"
                    placeholder="海关编码"
                    disabled
                    style="margin-bottom: 5px"
                    size="small"
                  />
                  <el-input
                    v-model="scope.row.sku"
                    placeholder="SKU"
                    size="small"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="品牌/型号"
                width="150"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.brand"
                    style="margin-bottom: 5px"
                    placeholder="品牌"
                    size="small"
                  />
                  <el-input
                    v-model="scope.row.model"
                    placeholder="型号"
                    size="small"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="材质"
                width="150"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.materialZh"
                    style="margin-bottom: 5px"
                    placeholder="中文材质"
                    size="small"
                  />
                  <el-input
                    v-model="scope.row.materialEn"
                    placeholder="英文材质"
                    size="small"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="用途"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.usageZh"
                    placeholder="中文用途"
                    style="margin-bottom: 5px"
                    size="small"
                  />
                  <el-input
                    v-model="scope.row.usageEn"
                    placeholder="英文用途"
                    size="small"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="单箱数量/单价"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.quantity"
                    placeholder="数量"
                    style="margin-bottom: 5px"
                    size="small"
                    @blur="onlyNumber(scope.row.quantity, scope.row, 'quantity')"
                  >
                    <el-select
                      slot="append"
                      v-model="scope.row.unitId"
                      style="width: 90px"
                      filterable
                      placeholder="请选择"
                      @change="rowUnitChange(scope.row)"
                    >
                      <el-option
                        v-for="item in unitList"
                        :key="item.id"
                        :label="item.unit"
                        :value="item.id"
                      />
                    </el-select>
                  </el-input>
                  <el-input
                    v-model="scope.row.price"
                    placeholder="单价"
                    size="small"
                    @blur="onlyNumber(scope.row.price, scope.row, 'price')"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="税率/税金"
                width="150"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.taxRate"
                    disabled
                    placeholder="税率"
                    style="margin-bottom: 5px"
                    size="small"
                  />
                  <el-input
                    v-model="scope.row.tax"
                    disabled
                    placeholder="税金"
                    size="small"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="商品图片"
                width="100"
              >
                <template slot-scope="scope">
                  <div class="img-list">
                    <div
                      v-if="!scope.row.picture"
                      class="img-item-upload"
                    >
                      <el-upload
                        action
                        :show-file-list="false"
                        :before-upload="beforeAvatarUpload"
                        :http-request="(data) => uploadFile(data, scope.row)"
                        class="avatar-uploader"
                      >
                        <i
                          class="el-icon-plus avatar-uploader-icon"
                        />
                      </el-upload>
                    </div>
                    <div
                      v-else
                      class="preview-img-wrap"
                    >
                      <div class="preview-img">
                        <img :src="scope.row.file">
                        <div class="mask">
                          <i
                            class="el-icon-view mask-view-icon"
                            @click="handlePreview(scope.row.file)"
                          />
                          <i
                            class="el-icon-delete mask-del-icon"
                            @click="handleDelete(scope.row.picture, scope.row)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
              >
                <template slot-scope="scope">
                  <!--<p style="margin: 0">
                    <el-button
                      type="text"
                      size="mini"
                      @click="openLink(scope.row.url)"
                    >
                      商品链接
                    </el-button>
                  </p>-->
                  <!--<p style="margin: 0">
                    <el-button
                      type="text"
                      size="mini"
                    >
                      产品库
                    </el-button>
                  </p>-->
                  <p style="margin: 0">
                    <el-button
                      type="text"
                      size="mini"
                      style="color: rgb(230, 48, 34)"
                      @click="deleteGoods(batch, scope.$index)"
                    >
                      删除
                    </el-button>
                  </p>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <el-dialog
        title="产品库"
        :visible.sync="visible"
      />
      <el-dialog
        title="商品图片预览"
        :visible.sync="dialogVisible"
        append-to-body
      >
        <img
          width="100%"
          :src="imageUrl"
        >
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  getOrderDetails,
  getUnitList,
  getPrice,
  saveSalesmanOrder,
  getUserDeclare
} from '@/api/orderlist-at-whole'
import {
  uploadFile,
  deleteFile
} from '@/api/orderlist-at-trailer'
import { getContainerList } from '@/api/operation-of-containers-management'
@Component({
  name: 'salesman',
  components: {},
  props: {
  }
})
export default class extends Vue {
  /* data */
  private imageUrl: any = ''
  private dialogVisible: boolean = false
  private visible: boolean = false
  private dialogLoading: boolean = false
  private selectLoading: boolean = false
  private loading: boolean = false
  private batches: any[] = []
  private unitList: any[] = []
  private containerList: any[] = []
  private declareList: any[] = []
  private orderDetails: any = {}
  private container: any = {}
  private lscConfig: any = {}
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  /* computed */
  get totalPackages() {
    return this.batches.reduce((num: any, batch: any) => {
      num += batch.packages
      return num
    }, 0)
  }
  get totalVolumes() {
    return this.batches.reduce((num: any, batch: any) => {
      if (batch.packages && batch.length && batch.width && batch.height) {
        num += batch.packages * batch.length * batch.width * batch.height
      }
      return num
    }, 0)
  }
  get totalWeights() {
    return this.batches.reduce((num: any, batch: any) => {
      if (batch.packages && batch.weight) {
        num += batch.packages * batch.weight
      }
      return num
    }, 0)
  }
  get totalValue() {
    return this.batches.reduce((num: any, batch: any) => {
      batch.agoods.forEach((goods: any) => {
        if (goods.quantity && goods.price && batch.packages) {
          num += (Number(goods.quantity) * Number(goods.price) * Number(batch.packages))
        }
      })
      return num
    }, 0)
  }
  /* methods */
  // 获取产品库数据
  private getUserDeclare() {
    const buyer: any = this.orderDetails.buyer || {}
    const consignee = this.orderDetails.consignee || {}
    const params: any = {
      model: {
        countryId: consignee.countryCode,
        customerId: buyer.id
      },
      page: this.pagination.page,
      size: this.pagination.size
    }
    this.dialogLoading = true
    getUserDeclare(params).then((res: any) => {
      this.dialogLoading = false
      const data = res.data || {}
      this.declareList = data.result || []
      this.pagination.total = data.total || 0
    }).catch((err: any) => {
      this.dialogLoading = false
      this.declareList = []
      this.pagination.total = 0
      return err
    })
  }
  private getContainerList() {
    const params = {
      page: 1,
      size: 999
    }
    if (this.containerList.length) return
    this.selectLoading = true
    getContainerList(params).then((res: any) => {
      this.selectLoading = false
      if (res.success) {
        const data = res.data || {}
        this.containerList = data.result || []
      }
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }
  private containerChange(val: any) {
    this.container = {
      id: '',
      name: '',
      weight: ''
    }
    if (val) {
      const container = this.containerList.find(e => e.id === val)
      if (container) {
        this.container = {
          id: val,
          name: container.name,
          weight: container.loadLimit
        }
      }
    }
  }
  private onlyNumber(value: any, obj: any, key: any) {
    if (value) {
      if (parseFloat(value).toString() === 'NaN') {
        obj[key] = ''
      } else {
        obj[key] = parseFloat(value)
      }
    }
  }
  private beforeAvatarUpload(file: any) {
    const isJPG: boolean = file.type.indexOf('image') !== -1
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isJPG) {
      this.$message.error('上传照片只能是图片格式!')
    }
    if (!isLt2M) {
      this.$message.error('上传照片大小不能超过 2MB!')
    }
    return isJPG && isLt2M
  }
  private uploadFile(data: any, row: any) {
    const formData = new FormData()
    const file = new File([data.file], data.file.name.split('.')[0] + new Date().getTime() + '.' + data.file.name.split('.')[1], { type: data.file.type })
    formData.append('file', file)
    this.loading = true
    uploadFile(formData).then((res: any) => {
      this.loading = false
      const result = res.data || {}
      row.picture = result.objectName
      row.file = process.env.VUE_APP_OSS_PATH + result.objectName
    }).catch(() => {
      row.picture = ''
      row.file = ''
      this.loading = false
    })
  }
  private handleDelete(name: any, row: any) {
    const params = {
      ifPublic: true,
      fileList: [name]
    }
    this.loading = true
    deleteFile(params).then(() => {
      this.loading = false
      row.picture = ''
      row.file = ''
    }).catch(() => {
      this.loading = false
    })
  }
  private show(row: any) {
    this.getDetail(row.id)
    this.getUnitList()
    this.getContainerList()
  }
  private init() {
    if (this.batches.length === 0) {
      this.batches = [this.getBatchInfo()]
    }
    this.batches = this.batches.map((batch: any, index: number) => {
      batch.orderCode = this.orderDetails.code
      batch.id = this.orderDetails.code + '-' + (index + 1)
      if (batch.agoods.length) {
        batch.agoods.forEach((goods: any, i: number) => {
          goods.orderCode = this.orderDetails.code
          goods.batchId = batch.id
        })
      }
      if (batch.boxes.length) {
        batch.boxes.forEach((box: any, i: number) => {
          box.orderCode = this.orderDetails.code
        })
      }
      return batch
    })
  }
  private addBatchGood(batch: any) {
    batch.agoods.push(this.getGoodsInfo())
    this.init()
  }
  private addBeatch() {
    this.batches = [...this.batches, this.getBatchInfo()]
    this.init()
  }
  private deleteGoods(batch: any, i: number) {
    if (batch.agoods.length === 1) {
      this.$message.warning('批次商品信息不能为空')
      return
    }
    batch.agoods = batch.agoods.filter((item: any, index: number) => index !== i)
    this.init()
  }
  private copyBatch(batch: any) {
    const newBatch = JSON.parse(JSON.stringify(batch))
    newBatch.boxes = []
    if (newBatch.isEdit) {
      delete newBatch.isEdit
    }
    batch.tag = '1'
    batch.boxTag = '1'
    newBatch.agoods.forEach((good: any) => {
      if (!good.ifProductLibrary) {
        good.file = ''
        good.picture = ''
        if (good.isEdit) {
          delete good.isEdit
          good.tag = '1'
        }
      }
    })
    this.batches = [...this.batches, newBatch]
    this.init()
  }
  private deleteBath(index: number) {
    if (this.batches.length === 1) {
      this.$message.warning('批次信息不能为空')
      return
    }
    this.batches = this.batches.filter((item: any, i: number) => i !== index)
    this.init()
  }
  private getBatchInfo() {
    return {
      'id': '',
      // 批次商品集合
      'agoods': [this.getGoodsInfo()],
      'boxTag': '1',
      'boxes': [],
      'fbaNo': '', // FBA箱号
      'height': '',
      'length': '',
      'orderCode': this.orderDetails.code, // 原单号
      'packages': '', // 箱数
      'reservation': '', // 预约号
      'tag': '1',
      'value': '',
      'volumes': '',
      'weight': '',
      'weights': '',
      'width': ''
    }
  }
  private getGoodsInfo() {
    return {
      'batchId': '',
      'brand': '',
      'goodsAlias': '',
      'goodsName': '',
      'productId': '',
      'createTime': '',
      'categoryName': '',
      'unitId': '',
      'unitName': '',
      'hsCode': '',
      'materialEn': '',
      'materialZh': '',
      'model': '',
      'orderCode': this.orderDetails.code,
      'picture': '',
      'file': '', // 自己添加的属性，商品图片地址
      'ifProductLibrary': false, // 是否为产品库商品
      'url': '', // 商品链接
      'price': '',
      'quantity': '',
      'sku': '',
      'tag': '1',
      'tax': '',
      'taxRate': '',
      'usageEn': '',
      'usageZh': ''
    }
  }
  private getDetail(id: string) {
    // 查询
    this.loading = true
    getOrderDetails({ id }).then((res: any) => {
      const data = res.data || {}
      const {
        boxes,
        batchSummaries,
        batches,
        lsc,
        buyer,
        currency,
        country,
        container,
        delivery,
        supplement,
        warehouse,
        um,
        fbastore,
        lscConfig,
        ...obj
      } = data
      this.container = container
      this.lscConfig = lscConfig
      this.orderDetails = {
        ...obj,
        ...supplement,
        ...um,
        currencyId: currency.key,
        countryName: currency.value,
        fbastoreCode: fbastore.code || '',
        fbastoreId: fbastore.id || '',
        lscId: lsc.key
      }
      this.loading = false
      this.init()
    }).catch((err: any) => {
      this.loading = false
      this.$emit('back')
      return err
    })
  }
  private getUnitList() {
    getUnitList().then((res: any) => {
      if (res.success) {
        this.unitList = res.data || []
      }
    }).catch((err: any) => {
      this.unitList = []
      return err
    })
  }
  private downFile() {
    // 下载
    const url = this.orderDetails.goodsFile || ''
    if (url) {
      window.open(process.env.VUE_APP_OSS_PATH + url)
    } else {
      this.$message.error('暂无文件可下载')
    }
  }
  private handlePreview(url: any) {
    this.imageUrl = url
    this.dialogVisible = true
  }
  private openLink(url: any) {
    if (url) {
      window.open(url)
    }
  }
  private rowUnitChange(row: any) {
    row.unitName = (this.unitList.find(e => e.id === row.unitId) || {}).unit
  }
  private prefixInteger(num: any, length: any) {
    return (Array(length).join('0') + num).slice(-length)
  }
  // 生成箱号
  private generateBoxNo() {
    const primaryNum = this.orderDetails.code
    let num = 1
    this.batches.forEach((item, index) => {
      item.examineNum = item.examineNum || 0
      item.boxes = []
      if (item.boxes.length === 0) {
        for (let i = num; i < Number(item.packages) + num; i++) {
          const strLenth = 25 - Number(primaryNum.length)
          const suffix = this.prefixInteger(i, strLenth)
          item.boxes.push({
            code: primaryNum + suffix,
            batchId: item.id,
            orderCode: primaryNum
          })
        }
        num += Number(item.packages)
      }
    })
    this.batches = this.handleInspection(this.batches)
  }
  private handleInspection(bacths: any[]) {
    // examine 是否验货字段，布尔值
    if (!this.orderDetails.examine) {
      return bacths
    }
    // examineType 0按产品验货 2按比例验货
    if (this.orderDetails.examineType === '0') {
      return this.examineByGoods(bacths)
    }
    if (this.orderDetails.examineType === '2') {
      return this.examineByRatio(bacths)
    }
    return bacths
  }
  private examineByRatio(bacths: any[]) {
    if (this.orderDetails.examineRatio && parseInt(this.orderDetails.examineRatio, 0) >= 0 && bacths && Array.isArray(bacths)) {
      const boxTotal = bacths.reduce((prev: any, curr: any) => [...prev, ...(curr.boxes || [])], []).length // 总箱数
      const inspectionNum = Math.ceil((boxTotal * parseInt(this.orderDetails.examineRatio, 0)) / 100) // 验货总数
      let residueExamineNum = inspectionNum // 剩余验货数
      return bacths.map((batch: any) => {
        if (residueExamineNum > 0) {
          const batchBoxNum = batch.packages // 批次箱子数
          const batchBoxNumRatio = batchBoxNum / boxTotal // 批次箱子数占比
          const batchExamineNum = Math.ceil(inspectionNum * batchBoxNumRatio) // 当前批次验货数
          if (batchExamineNum > residueExamineNum) {
            batch.examineNum = residueExamineNum
          } else {
            batch.examineNum = batchExamineNum
          }
          residueExamineNum = residueExamineNum - batchExamineNum // 更新剩余验货数
        } else {
          batch.examineNum = 0
        }
        return batch
      })
    } else {
      return bacths
    }
  }
  private examineByGoods(bacths: any[]) {
    if (bacths && Array.isArray(bacths)) {
      return bacths.map((batch: any) => {
        batch.examineNum = 1
        return batch
      })
    } else {
      return bacths
    }
  }
  private generateBoxExamine(batches: any[]) {
    // 生成验货
    return batches.map((batch: any) => {
      batch.boxes = batch.boxes.map((box: any) => {
        box.examine = false
        return box
      })
      const boxNum = batch.boxes.length
      let examineNum = batch.examineNum
      if (boxNum === examineNum) {
        batch.boxes = batch.boxes.map((box: any) => {
          box.examine = true
          return box
        })
      } else {
        while (examineNum) {
          const index = Math.floor(Math.random() * boxNum)
          if (!batch.boxes[index].examine) {
            batch.boxes[index].examine = true
            examineNum--
          }
        }
      }
      return batch
    })
  }
  private validationData() {
    let flag = true
    const reg = /[\u4E00-\u9FA5]/g
    for (let i = 0; i < this.batches.length; i++) {
      const batch = this.batches[i]
      const agoods: any[] = batch.agoods || []
      if (this.orderDetails.deliveryWay !== '0') {
        if (!batch.reservation) {
          this.$message.warning(`批次${i + 1}预约号不能为空`)
          flag = false
          break
        }
        if (reg.test(batch.reservation)) {
          this.$message.warning(`批次${i + 1}预约号格式不正确`)
          flag = false
          break
        }
        if (this.batches.filter(item => item.reservation === batch.reservation).length > 1) {
          this.$message.warning(`批次${i + 1}预约号重复`)
          flag = false
          break
        }
        if (!batch.fbaNo) {
          this.$message.warning(`批次${i + 1}FBA编号不能为空`)
          flag = false
          break
        }
        if (reg.test(batch.fbaNo)) {
          this.$message.warning(`批次${i + 1}FBA编号格式不正确`)
          flag = false
          break
        }
        if (this.batches.filter(item => item.fbaNo === batch.fbaNo).length > 1) {
          this.$message.warning(`批次${i + 1}FBA编号重复`)
          flag = false
          break
        }
      }
      if (!batch.packages) {
        this.$message.warning(`批次${i + 1}总箱数不能为空`)
        flag = false
        break
      }
      if (this.container.type === '0') {
        // 拼柜
        if (!batch.length) {
          this.$message.warning(`批次${i + 1}单箱长度不能为空`)
          flag = false
          break
        }
        if (!batch.width) {
          this.$message.warning(`批次${i + 1}单箱宽度不能为空`)
          flag = false
          break
        }
        if (!batch.height) {
          this.$message.warning(`批次${i + 1}单箱高度不能为空`)
          flag = false
          break
        }
        // const v = batch.length * batch.width * batch.height
        // const V = (this as any).$volumeConversion(v, (this as any).$getVolumeUnitByLengthUnit(this.orderDetails.umVolume), 'CBM')
        // if (V > this.lscConfig.cubed) {
        //   this.$message.warning(`批次${i + 1}单箱体积大于单箱最大体积`)
        //   flag = false
        //   break
        // }
      } else {
        // 整柜
        if (!this.container.id) {
          this.$message.warning(`批次${i + 1}柜型不能为空`)
          flag = false
          break
        }
      }
      if (!batch.weight) {
        this.$message.warning(`批次${i + 1}单箱重量不能为空`)
        flag = false
        break
      }
      // if (batch.weight > this.lscConfig.weight) {
      //   this.$message.warning(`批次${i + 1}单箱重量大于单箱最大重量`)
      //   flag = false
      //   break
      // }
      let innterFlag = true
      for (let j = 0; j < agoods.length; j++) {
        const goods = batch.agoods[j]
        if (this.orderDetails.examine && !goods.file) {
          this.$message.warning(`批次${i + 1}商品图片不能为空`)
          innterFlag = false
          break
        }
        if (goods.ifProductLibrary) {
          if (!goods.quantity) {
            this.$message.warning(`批次${i + 1}商品数量不能为空`)
            innterFlag = false
            break
          }
          innterFlag = true
          continue
        }
        if (!goods.goodsName) {
          this.$message.warning(`批次${i + 1}商品中文名称不能为空`)
          innterFlag = false
          break
        }
        if (!goods.goodsAlias) {
          this.$message.warning(`批次${i + 1}商品英文名称不能为空`)
          innterFlag = false
          break
        }
        if (reg.test(goods.goodsAlias)) {
          this.$message.warning(`批次${i + 1}商品英文名称格式不正确`)
          flag = false
          break
        }
        if (!goods.brand) {
          this.$message.warning(`批次${i + 1}商品品牌不能为空`)
          innterFlag = false
          break
        }
        if (!goods.model) {
          this.$message.warning(`批次${i + 1}商品型号不能为空`)
          innterFlag = false
          break
        }
        if (!goods.materialZh) {
          this.$message.warning(`批次${i + 1}商品中文材质不能为空`)
          innterFlag = false
          break
        }
        if (!goods.materialEn) {
          this.$message.warning(`批次${i + 1}商品英文材质不能为空`)
          innterFlag = false
          break
        }
        if (reg.test(goods.materialEn)) {
          this.$message.warning(`批次${i + 1}商品英文材质格式不正确`)
          flag = false
          break
        }
        if (!goods.usageZh) {
          this.$message.warning(`批次${i + 1}商品中文用途不能为空`)
          innterFlag = false
          break
        }
        if (!goods.usageEn) {
          this.$message.warning(`批次${i + 1}商品英文用途不能为空`)
          innterFlag = false
          break
        }
        if (reg.test(goods.usageEn)) {
          this.$message.warning(`批次${i + 1}商品英文用途格式不正确`)
          flag = false
          break
        }
        if (!goods.quantity) {
          this.$message.warning(`批次${i + 1}商品数量不能为空`)
          innterFlag = false
          break
        }
        if (!goods.unitId) {
          this.$message.warning(`批次${i + 1}商品单位不能为空`)
          innterFlag = false
          break
        }
        if (!goods.price) {
          this.$message.warning(`批次${i + 1}商品单价不能为空`)
          innterFlag = false
          break
        }
      }
      if (!innterFlag) {
        flag = false
        break
      }
    }
    return flag
  }
  private getPrice() {
    return new Promise((resolve: any, reject: any) => {
      const consignee = this.orderDetails.consignee || {}
      const params: any = {
        chargeBatch: {
          batches: this.batches.map(item => {
            return {
              length: item.length,
              width: item.width,
              height: item.height,
              packages: item.packages,
              weight: item.weight
            }
          }),
          umLength: this.orderDetails.umLength || '',
          umWeight: this.orderDetails.umWeight || ''
        },
        containerId: this.container.id,
        containerName: this.container.name,
        containerType: this.container.type,
        cityId: consignee.cityCode,
        countryId: consignee.countryCode,
        // countyId: this.baseData.countyId,
        // custId: this.userInfo.custId,
        fbaId: this.orderDetails.fbastoreId,
        lscId: this.orderDetails.lscId,
        priceId: this.orderDetails.price.priceId,
        stateId: consignee.provinceCode
      }
      getPrice(params).then((res: any) => {
        const data = res.data || {}
        resolve(data)
      }).catch((err: any) => {
        reject(err)
      })
    })
  }
  private saveSalesmanOrder() {
    if (this.validationData()) {
      this.generateBoxNo()
      this.batches = this.generateBoxExamine(this.batches)
      const batches: any[] = this.batches.map((item: any) => {
        const batch = JSON.parse(JSON.stringify(item))
        delete batch.examineNum
        batch.goods = batch.agoods.map((good: any) => {
          if (good.ifProductLibrary) {
            good.audit = '1'
          }
          delete good.file
          delete good.ifProductLibrary
          delete good.url
          return good
        })
        batch.code = batch.id
        delete batch.id
        delete batch.agoods
        delete batch.boxTag
        return batch
      }) || []
      this.loading = true
      this.getPrice().then((price: any) => {
        const params = {
          id: this.orderDetails.id,
          packages: this.totalPackages,
          volumes: this.totalVolumes,
          weights: this.totalWeights,
          value: this.totalValue,
          batchSummaries: batches.map((batch: any) => {
            const value = batch.goods.reduce((val: any, item: any) => {
              val += item.price * item.quantity
              val = parseFloat(val.toFixed(3))
              return val
            }, 0)
            const volumes = batch.height * batch.width * batch.length
            return {
              code: batch.code,
              packages: batch.packages,
              value: value * batch.packages,
              volumes: parseFloat(volumes.toFixed(3)),
              weights: batch.weight * batch.packages
            }
          }),
          batches: batches.map((item: any) => {
            const batch = JSON.parse(JSON.stringify(item))
            delete batch.boxes
            return batch
          }),
          boxes: batches.reduce((boxes: any[], batch: any) => {
            batch.boxes.forEach((box: any) => {
              if (box.tag !== '3') {
                boxes.push({
                  batchCode: box.batchId,
                  code: box.code,
                  examine: box.examine,
                  orderIds: []
                })
              }
            })
            return boxes
          }, []),
          price
        }
        saveSalesmanOrder(params).then((res: any) => {
          this.loading = false
          if (res.success) {
            this.$message.success('订单录入成功')
            this.$emit('back')
            this.$emit('load')
          } else {
            this.$message.error('订单录入失败')
          }
        }).catch((err: any) => {
          this.loading = false
          this.$message.error('订单录入失败')
          return err
        })
      }).catch((err: any) => {
        this.loading = false
        this.$message.error('订单录入失败')
        return err
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .detail-back {
    text-align: right;
    padding: 0 20px;
    line-height: 50px;
    border-bottom: 1px solid #e8e8e8;
    background-color: #fff;
  }
  .order-detail {
    height: calc(100vh - 170px);
    overflow-y: auto;
  }
  .form-title {
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    font-weight: 700;
    background: #f2f2f2;
    padding-left: 20px;
    margin: 10px 0;
  }
  .batch-item{
    /*border: 1px solid #e8e8e8;*/
    margin-bottom: 10px;
  }
  .img-list{
    display: flex;
    align-items: center;
    .img-item-upload{
      cursor: pointer;
      width: 70px;
      height: 70px;
      border: 1px solid #DCDFE6;
      border-radius: 4px;
      font-size: 20px;
      text-align: center;
      line-height: 70px;
    }
  }
  .preview-img-wrap{
    width: 70px;
    height: 70px;
    padding: 1px;
    object-fit: cover;
    overflow: hidden;
    border: 1px solid #eee;
    margin: 0 5px;
    .preview-img{
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
      img{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        height: 100%;
      }
      .mask{
        font-size: 14px;
        cursor: pointer;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.4);
        opacity: 0;
        transition: all .5s;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        .mask-del-icon{
          margin-left: 5px;
        }
        &:hover{
          opacity: 1;
        }
      }
    }
  }
</style>
