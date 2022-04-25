<template>
  <div
    v-loading="detailLoading"
  >
    <div class="detail-back">
      <span v-if="historyList.length">查看历史</span>
      <el-select
        v-if="historyList.length"
        v-model="historyId"
        placeholder="请选择"
        style="width: 150px;margin: 0 10px"
        size="small"
        clearable
        @change="handleChange"
      >
        <el-option
          v-for="(item, index) in historyList"
          :key="`${item}-${index}`"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-button
        v-if="identificationNo"
        type="text"
        size="small"
        style="margin-right: 10px"
        @click="updateExpressStatus"
      >
        更新快递状态
      </el-button>
      <el-button
        v-if="identificationNo"
        type="text"
        size="small"
        style="margin-right: 10px"
        @click="syncExpressStatus"
      >
        同步快递单号
      </el-button>
      <span
        style="cursor: pointer;"
        @click="goback"
      >
        <i class="el-icon-back" />
        <span>返回</span>
      </span>
    </div>
    <div class="app-panel order-detail">
      <el-form
        ref="detail"
        :model="form"
        label-position="right"
        class="detail-form"
      >
        <div
          class="form-content"
        >
          <div class="info">
            <div
              class="form-title"
            >
              寄件人信息
            </div>
            <div
              style="padding: 0 20px;"
            >
              <el-row>
                <el-col
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">联系人：</span>
                  <span class="value">{{ form.consignor }}</span>
                </el-col>
                <el-col
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">联系电话：</span>
                  <span class="value">{{ form.consignorPhone }}</span>
                </el-col>
                <el-col
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">联系邮箱：</span>
                  <span class="value">{{ form.consignorMail }}</span>
                </el-col>
                <el-col
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">邮编：</span>
                  <span class="value">{{ form.consignorZip }}</span>
                </el-col>
                <el-col
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">公司：</span>
                  <span class="value">{{ form.consignorCompany }}</span>
                </el-col>
                <el-col
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">
                    联系地址：
                  </span>
                  <span class="value">
                    {{ form.consignorCountry }}&nbsp;{{ form.consignorProvince }}&nbsp;{{ form.consignorCity }}
                  </span>
                </el-col>
                <el-col
                  v-if="form.consignorAddress1"
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">详细地址1：</span>
                  <span class="value">{{ form.consignorAddress1 }}</span>
                </el-col>
                <el-col
                  v-if="form.consignorAddress2"
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">详细地址2：</span>
                  <span class="value">{{ form.consignorAddress2 }}</span>
                </el-col>
                <el-col
                  v-if="form.consignorAddress3"
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">详细地址3：</span>
                  <span class="value">{{ form.consignorAddress3 }}</span>
                </el-col>
                <el-col
                  v-if="form.status !== 1 && errormsgEntity.id"
                  :span="24"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">失败原因：</span>
                  <span
                    class="value"
                    style="color: #FF0000"
                  >{{ errormsgEntity.errorMessage }}</span>
                </el-col>
              </el-row>
            </div>
            <div
              class="form-title"
            >
              收件人信息
            </div>
            <div
              style="padding: 0 20px;"
            >
              <el-row>
                <el-col
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">联系人：</span>
                  <span class="value">{{ form.consigneeName }}</span>
                </el-col>
                <el-col
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">联系电话：</span>
                  <span class="value">{{ form.consigneePhone }}</span>
                </el-col>
                <el-col
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">联系邮箱：</span>
                  <span class="value">{{ form.consigneeMail }}</span>
                </el-col>
                <el-col
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">邮编：</span>
                  <span class="value">{{ form.consigneeZip }}</span>
                </el-col>
                <el-col
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">公司：</span>
                  <span class="value">{{ form.consigneeCompany }}</span>
                </el-col>
                <el-col
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">州/省：</span>
                  <span class="value">{{ form.destinationProvinceCode }}</span>
                </el-col>
                <el-col
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">城市：</span>
                  <span class="value">{{ form.destinationCity }}</span>
                </el-col>
                <el-col
                  v-if="form.destinationAddress1"
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">详细地址1：</span>
                  <span class="value">{{ form.destinationAddress1 }}</span>
                </el-col>
                <el-col
                  v-if="form.destinationAddress2"
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">详细地址2：</span>
                  <span class="value">{{ form.destinationAddress2 }}</span>
                </el-col>
                <el-col
                  v-if="form.destinationAddress3"
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">详细地址3：</span>
                  <span class="value">{{ form.destinationAddress3 }}</span>
                </el-col>
              </el-row>
            </div>
            <div class="form-title">
              补充信息
            </div>
            <div style="padding: 0 20px;">
              <el-row>
                <el-col
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">签名类型：</span>
                  <span class="value">{{ (signatureTypeList.find(e => e.value === form.signatureType) || {}).label }}</span>
                </el-col>
                <el-col
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">客户订单号：</span>
                  <span class="value">{{ form.orderNo }}</span>
                </el-col>
                <el-col
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">上门取件：</span>
                  <span class="value">{{ form.pickupDate }}</span>
                </el-col>
                <el-col
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">Invoice No：</span>
                  <span class="value">{{ form.invoiceNo }}</span>
                </el-col>
                <el-col
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">Department No：</span>
                  <span class="value">{{ form.departmentNo }}</span>
                </el-col>
                <el-col
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">Declared Value：</span>
                  <span class="value">{{ form.declaredValue }}</span>
                </el-col>
                <el-col
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">Ref. No.1：</span>
                  <span class="value">{{ form.refNo1 }}</span>
                </el-col>
                <el-col
                  :span="12"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">Ref. No.2：</span>
                  <span class="value">{{ form.refNo2 }}</span>
                </el-col>
                <el-col
                  :span="24"
                  style="display: flex;padding: 5px 0"
                >
                  <span class="label">Description：</span>
                  <span class="value">{{ form.description }}</span>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="pack-info">
            <div class="form-title">
              包裹信息
            </div>
            <div style="padding: 0 20px;">
              <div class="package-info">
                <el-form-item
                  v-if="form.samePackage"
                  label="完全相同："
                >
                  是
                </el-form-item>
                <el-form-item label="包裹类型：">
                  箱
                </el-form-item>
                <el-form-item label="包裹数量：">
                  {{ form.packageNum }}
                </el-form-item>
                <el-form-item label="重量单位：">
                  {{ $fomatWeight(form.unitWeight) }}
                </el-form-item>
                <el-form-item label="尺寸单位：">
                  {{ $fomatLength(form.unitMeasure) }}
                </el-form-item>
              </div>
              <el-collapse
                v-model="packageName"
                accordion
                class="express-package"
                @change="handleItem"
              >
                <el-collapse-item
                  v-for="(item, index) in tableDataPage"
                  :key="`${item.id}-${index}`"
                  :name="item.id"
                >
                  <template slot="title">
                    包裹 {{ index + 1 }}
                    &nbsp;尺寸：{{ item.length + '*' + item.width + '*' + item.height + ' ' + $fomatLength(item.unitMeasure) }}
                    &nbsp;重量：{{ item.weight + ' ' + $fomatWeight(item.unitWeight) }}
                  </template>
                  <el-table
                    :data="item.goodsEntityList"
                    style="width: 100%;"
                    border
                  >
                    <el-table-column
                      prop=""
                      label="商品名称"
                      min-width="150"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <div>
                          {{ scope.row.contentCn }}
                        </div>
                        <div>
                          {{ scope.row.contentEn }}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="descCn"
                      label="商品描述"
                      min-width="150"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <div>
                          {{ scope.row.descCn }}
                        </div>
                        <div>
                          {{ scope.row.descEn }}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="price"
                      label="价格"
                      width="120"
                    />
                    <el-table-column
                      prop="currency"
                      label="价格单位"
                      width="120"
                    />
                    <el-table-column
                      prop="goodsNum"
                      label="数量"
                      min-width="100"
                    />
                    <el-table-column
                      prop="hsCode"
                      label="海关编码"
                      min-width="120"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <div>
                          {{ scope.row.hsCode }}
                        </div>
                        <div>
                          {{ scope.row.hsCodeEn }}
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div
                    v-if="!form.samePackage && identificationNo"
                    class="express-status"
                  >
                    <el-row>
                      <el-col
                        :span="8"
                      >
                        <span style="padding-left: 10px;">主单号：</span>
                        <span>{{ item.identificationNo }}</span>
                      </el-col>
                      <el-col
                        :span="8"
                      >
                        <span style="padding-left: 10px;">子单号：</span>
                        <span>{{ item.trackingNo }}</span>
                      </el-col>
                      <el-col
                        :span="8"
                      >
                        <span style="padding-left: 10px;">箱号：</span>
                        <span>{{ item.pkgNo }}</span>
                      </el-col>
                    </el-row>
                    <div class="status-list">
                      <template v-if="item.statusList.length">
                        <div
                          v-for="(e, i) in item.statusList"
                          :key="`${e.time}-${i}`"
                          class="status-item"
                          :class="{active: i === 0}"
                        >
                          <div class="status-describe">
                            <div class="time">
                              {{ e.time }}
                            </div>
                            <div class="describe">
                              {{ e.description }}
                            </div>
                          </div>
                        </div>
                      </template>
                      <div
                        v-else
                        class="none"
                      >
                        暂无状态信息
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="form.samePackage && identificationNo"
                    class="content"
                  >
                    <div class="left-content">
                      <div class="left-title">
                        主单号
                      </div>
                      <div class="left-list">
                        <div
                          v-for="(e, j) in expressNoList"
                          :key="`${e}-${j}`"
                          class="item"
                          :class="{active: e.identificationNo === activeNo}"
                          @click="getExpressNoList(e)"
                        >
                          {{ e.identificationNo }}
                        </div>
                      </div>
                    </div>
                    <div class="right-content">
                      <div class="right-title">
                        <div class="left">
                          子单号
                        </div>
                        <div class="pkgNo">
                          箱号
                        </div>
                      </div>
                      <div
                        class="right-list"
                      >
                        <div
                          v-for="(e, t) in dataSource"
                          :key="`${e.trackingNo}-${t}`"
                          class="item"
                          :class="{active: e.trackingNo === trackingNo}"
                          @click="getExpressStatusListByNo(e)"
                        >
                          <div class="left">
                            {{ e.trackingNo }}
                          </div>
                          <div class="pkgNo">
                            {{ e.pkgNo }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="trackingNo"
                      class="express-status"
                    >
                      <div class="left-title">
                        快递单状态
                      </div>
                      <div
                        class="left-list"
                      >
                        <div class="order-no">
                          <span>快递单号：</span>
                          <span>{{ trackingNo }}</span>
                        </div>
                        <div class="status-list">
                          <template v-if="statusList.length">
                            <div
                              v-for="(s, k) in statusList"
                              :key="`${s.time}-${k}`"
                              class="status-item"
                              :class="{active: i === 0}"
                            >
                              <div class="status-describe">
                                <div class="time">
                                  {{ s.time }}
                                </div>
                                <div class="describe">
                                  {{ s.description }}
                                </div>
                              </div>
                            </div>
                          </template>
                          <div
                            v-else
                            class="none"
                          >
                            暂无状态信息
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
              <div v-if="!form.samePackage">
                <el-pagination
                  :current-page.sync="pagination.page"
                  :page-size="pagination.size"
                  layout="total, prev, pager, next"
                  :total="pagination.total"
                  style="text-align: right;"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  getOrderDetails,
  syncExpressStatus,
  getExpressStatusList as expressStatusList,
  getExpressHistory,
  getGoodsById
} from '@/api/orderlist-at-express'
import { getWordsList } from '@/api/public'
import { getExpressStatusList } from '@/api/orderlist-at-whole'
import dayjs from 'dayjs'
@Component({
  name: 'detail',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private detailLoading: boolean = false
  private errormsgEntity: any = {}
  private historyId: any = ''
  private packageName: any = ''
  private form: any = {
    status: '',
    packageNum: 0,
    samePackage: false,
    consigneeCompany: undefined,
    consigneeFamilyAddress: undefined,
    consigneeName: undefined,
    consigneePhone: undefined,
    consigneeZip: undefined,
    consignor: undefined,
    consignorAddress1: undefined,
    consignorAddress2: undefined,
    consignorAddress3: undefined,
    consignorCity: undefined,
    consignorCityCode: undefined,
    consignorCompany: undefined,
    consignorCountry: undefined,
    consignorCountryCode: undefined,
    consignorFax: undefined,
    consignorMail: undefined,
    consignorPhone: undefined,
    consignorProvince: undefined,
    consignorProvinceCode: undefined,
    consignorTaxCode: undefined,
    consignorZip: undefined,
    destinationAddress1: undefined,
    destinationAddress2: undefined,
    destinationAddress3: undefined,
    destinationCity: undefined,
    destinationCityCode: undefined,
    destinationCountry: undefined,
    destinationCountryCode: undefined,
    destinationProvince: undefined,
    destinationProvinceCode: undefined,
    expressOrderId: undefined,
    id: undefined,
    unitWeight: undefined,
    unitMeasure: undefined,
    description: undefined,
    departmentNo: undefined,
    declaredValue: undefined,
    identificationNo: undefined,
    invoiceNo: undefined,
    orderNo: undefined,
    refNo1: undefined,
    refNo2: undefined,
    signatureType: undefined,
    pickupDate: undefined
  }
  private detailId: any = ''
  private identificationNo: any = ''
  private activeNo: any = ''
  private trackingNo: any = ''
  private goodsData: any[] = []
  private dataSource: any[] = []
  private expressNoList: any[] = []
  private signatureTypeList: any[] = []
  private allStatusList: any[] = []
  private historyList: any[] = []
  private statusList: any[] = []
  private pagination: any = {
    page: 1,
    size: 12,
    total: 0
  }
  /** computed */
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }
  get tableDataPage() {
    return this.goodsData.slice((this.pagination.page - 1) * this.pagination.size, (this.pagination.page) * this.pagination.size)
  }

  /* 方法 */
  private handleChange(val: any) {
    this.getDetail(this.detailId, val)
  }
  private getExpressHistory(id: any) {
    this.historyList = []
    getExpressHistory({ id }).then((res: any) => {
      this.historyList = res.data || []
    }).catch((err: any) => {
      this.historyList = []
      return err
    })
  }
  private goback() {
    this.historyList = []
    this.identificationNo = ''
    this.activeNo = ''
    this.trackingNo = ''
    this.historyId = ''
    this.packageName = ''
    this.dataSource = []
    this.goodsData = []
    this.expressNoList = []
    this.allStatusList = []
    this.statusList = []
    this.pagination = {
      page: 1,
      size: 12,
      total: 0
    }
    this.$emit('back')
  }
  private getExpressStatusListByNo(item: any) {
    this.trackingNo = item.trackingNo
    this.statusList = this.allStatusList.filter((e: any) => e.trackingNo === this.trackingNo).sort((a: any, b: any) => {
      return a.time < b.time ? 1 : -1
    })
  }
  private getExpressNoList(e: any) {
    this.activeNo = e.identificationNo
    this.dataSource = e.list
  }
  private handleSizeChange(val: string) {
    this.pagination.size = Number(val)
  }

  private handleCurrentChange(val: string) {
    this.pagination.page = Number(val)
  }
  private async getSignatureTypeList() {
    const params = {
      type: 'UPS_DeliveryConfirmation'
    }
    await getWordsList(params).then((res: any) => {
      this.signatureTypeList = res.data || []
    }).catch((err: any) => {
      this.signatureTypeList = []
      this.detailLoading = false
      return err
    })
  }
  private updateExpressStatus() {
    this.detailLoading = true
    const params = {
      id: this.detailId
    }
    getExpressStatusList(params).then(async() => {
      this.$message.success('快递状态更新成功')
      await this.getExpressStatusList()
      this.getDetail(this.detailId)
    }).catch((err: any) => {
      this.detailLoading = false
      return err
    })
  }
  private async setData(row: any) {
    const { id } = row
    this.detailId = id
    this.identificationNo = row.identificationNo || ''
    this.detailLoading = true
    await this.getSignatureTypeList()
    await this.getExpressStatusList()
    this.getDetail(id)
    this.getExpressHistory(id)
  }
  private syncExpressStatus() {
    const params = {
      id: this.detailId
    }
    this.detailLoading = true
    syncExpressStatus(params).then(() => {
      this.detailLoading = false
      this.$message.success('快递单号同步成功')
    }).catch(() => {
      this.detailLoading = false
    })
  }
  private getDetail(id: string, time?: any): void {
    // 查询
    this.detailLoading = true
    getOrderDetails({
      id,
      time: time || ''
    })
      .then((res: any) => {
        const data = res.data || {}
        const {
          errormsgEntity,
          personEntity,
          orderEntity,
          packagesEntityList,
          samePackage,
          packageNum
        }: any = data
        const historyList = data.historyList || []
        const {
          description,
          departmentNo,
          declaredValue,
          identificationNo,
          invoiceNo,
          orderNo,
          refNo1,
          refNo2,
          signatureType,
          pickupDate,
          status
        }: any = orderEntity || {}
        this.form = {
          ...personEntity,
          description,
          departmentNo,
          declaredValue: '',
          identificationNo,
          invoiceNo,
          orderNo,
          refNo1,
          refNo2,
          signatureType,
          pickupDate,
          samePackage,
          packageNum,
          status
        }
        this.errormsgEntity = errormsgEntity || {}
        if (samePackage) {
          this.goodsData = packagesEntityList[0] ? [ packagesEntityList[0] ] : []
        } else {
          let goodsData = packagesEntityList || []
          if (historyList && historyList.length) {
            goodsData = goodsData.map((e: any) => {
              const t = historyList.find((r: any) => r.pkgNo === e.pkgNo)
              if (t) {
                e.identificationNo = t.identificationNo
                e.trackingNo = t.trackingNo
              }
              return e
            })
          }
          this.goodsData = goodsData
        }
        this.expressNoList = (packagesEntityList || []).reduce((list: any[], p: any) => {
          const t = historyList.find((r: any) => r.pkgNo === p.pkgNo)
          if (t) {
            p.identificationNo = t.identificationNo
            p.trackingNo = t.trackingNo
          }
          const tamp = list.find((e: any) => e.identificationNo === p.identificationNo)
          if (tamp) {
            tamp.list.push(p)
          } else {
            list.push({ identificationNo: p.identificationNo, list: [p] })
          }
          return list
        }, [])
        this.goodsData = this.goodsData.map((it: any, index: any) => {
          it.statusList = this.allStatusList.filter((e: any) => e.trackingNo === it.trackingNo).sort((a: any, b: any) => {
            return a.time < b.time ? 1 : -1
          })
          this.form.unitMeasure = it.unitMeasure
          this.form.unitWeight = it.unitWeight
          it._index = index
          return it
        })
        this.pagination.total = this.goodsData.length
        this.detailLoading = false
      })
      .catch((err: any) => {
        this.detailLoading = false
        return [null, err]
      })
  }
  private handleItem() {
    const params: any = {
      pkgId: this.packageName
    }
    getGoodsById(params)
      .then((res: any) => {
        const data = res.data || []
        this.goodsData = this.goodsData.map((it: any) => {
          if (it.id === this.packageName) {
            it.goodsEntityList = data
          }
          return it
        })
      }).catch((err: any) => {
        return err
      })
  }
  private async getExpressStatusList() {
    const params = {
      id: this.detailId
    }
    await expressStatusList(params).then((res: any) => {
      const data = res.data || {}
      let allStatus = []
      try {
        allStatus = JSON.parse(data.allStatus)
      } catch (e) {
        allStatus = []
      }
      this.allStatusList = allStatus.map((e: any) => {
        e.time = dayjs(e.time, { format: 'YYYYMMDD HHmmss' }).format('YYYY-MM-DD HH:mm:ss')
        return e
      })
    }).catch(() => {
      this.detailLoading = false
      this.allStatusList = []
    })
  }
}
</script>

<style lang="scss" scoped>
.detail-back {
  text-align: right;
  padding: 0 20px;
  line-height: 50px;
  font-size: 16px;
  border-bottom: 1px solid #e8e8e8;
  background-color: #fff;
}
.order-detail {
  height: calc(100vh - 170px);
  overflow-y: auto;
}
.detail-form {
  // ::v-deep .el-form-item__label {
  //   font-weight: 700 !important;
  // }
  .el-form-item {
    vertical-align: top;
    display: inline-block;
    width: 24.9%;
    margin-bottom: 0px;
  }
}
.form-title {
  height: 35px;
  line-height: 35px;
  font-size: 16px;
  font-weight: 700;
  background: #f2f2f2;
  padding-left: 20px;
  margin: 10px 0;
}
.form-special {
  background: #f2f2f2;
  padding: 10px 20px;
}
.package-info {
  background-color: #F5F7FA;
  border-radius: 4px;
  margin: 5px 0;
}
.express-package {
  border: none;
  ::v-deep .el-collapse-item__header {
    background-color: #fafafa;
    padding: 0 12px;
    font-size: 14px;
  }
  ::v-deep .el-collapse-item__content {
    padding: 0;
    border: none;
  }
  ::v-deep .el-collapse-item__wrap {
    border: none;
  }
}
.express-status{
  border: 1px solid #e8e8e8;
  border-top: none;
  .status-list{
    border-top: 1px solid #e8e8e8;
    .status-item{
      padding-left: 48px;
      .status-describe{
        .time{
          position: relative;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #909399;
          padding: 4px 0;
          &:before{
            content: '';
            width: 9px;
            height: 9px;
            border-radius: 50%;
            background-color: #BFC4CB;
            position: absolute;
            top: 50%;
            left: -28px;
            transform: translateY(-50%);
          }
        }
        .describe{
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #303133;
          padding-bottom: 20px;
          padding-top: 8px;
          position: relative;
          &:before{
            content: '';
            width: 1px;
            height: 100%;
            background-color: #909399;
            position: absolute;
            top: 50%;
            left: -24px;
            transform: translateY(-50%);
          }
        }
      }
      &:last-child{
        .status-describe{
          .describe{
            &:before{
              content: '';
              width: 0;
              height: 100%;
              background-color: #909399;
              position: absolute;
              top: 50%;
              left: -24px;
              transform: translateY(-50%);
            }
          }
        }
      }
      &.active{
        .status-describe{
          .time{
            &:before{
              content: '';
              width: 9px;
              height: 9px;
              border-radius: 50%;
              background-color: #FF7D19;
              position: absolute;
              top: 50%;
              left: -28px;
              transform: translateY(-50%);
            }
          }
        }
      }
    }
    .none{
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #5e6d82;
    }
  }
}
  .form-content{
    display: flex;
    min-width: 1600px;
    .info{
      width: 600px!important;
      font-size: 14px;
      font-family: PingFang SC;
      .label{
        white-space: nowrap;
        color: #909399;
      }
      .value{
        flex: 1;
        color: #303133;
        word-break: break-all;
      }
    }
    .pack-info{
      padding-left: 10px;
      flex: 1;
    }
  }
.content{
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
  .express-status,
  .right-content,
  .left-content{
    flex: 1;
    border: 1px solid #eee;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #303133;
    .right-title,
    .left-title{
      width: 100%;
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    .right-title{
      display: flex;
      .left{
        flex: 1;
      }
      .pkgNo{
        flex: 1;
      }
    }
    .right-list,
    .left-list{
      height: calc(100vh - 300px);
      overflow-y: auto;
      .item{
        cursor: pointer;
        width: 100%;
        padding: 10px;
        transition: all .3s;
        &:hover{
          background: #F7F7F7;
        }
        &.active{
          background: #F7F7F7;
        }
      }
    }
    .right-list{
      .item{
        display: flex;
        .left{
          flex: 1;
        }
        .pkgNo{
          flex: 1;
        }
      }
    }
  }
  .left-content{
    /*width: 200px !important;*/
    margin-right: 10px;
  }
  .express-status{
    margin-left: 10px;
    .left-list{
      padding: 10px;
      .order-no{
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #333333;
        margin-bottom: 20px;
      }
      .status-list{
        .status-item{
          padding-left: 48px;
          .status-describe{
            .time{
              position: relative;
              font-size: 14px;
              font-family: PingFang SC;
              font-weight: 400;
              color: #909399;
              padding: 4px 0;
              &:before{
                content: '';
                width: 9px;
                height: 9px;
                border-radius: 50%;
                background-color: #BFC4CB;
                position: absolute;
                top: 50%;
                left: -28px;
                transform: translateY(-50%);
              }
            }
            .describe{
              font-size: 14px;
              font-family: PingFang SC;
              font-weight: 400;
              color: #303133;
              padding-bottom: 20px;
              padding-top: 8px;
              position: relative;
              &:before{
                content: '';
                width: 1px;
                height: 100%;
                background-color: #909399;
                position: absolute;
                top: 50%;
                left: -24px;
                transform: translateY(-50%);
              }
            }
          }
          &:last-child{
            .status-describe{
              .describe{
                &:before{
                  content: '';
                  width: 0;
                  height: 100%;
                  background-color: #909399;
                  position: absolute;
                  top: 50%;
                  left: -24px;
                  transform: translateY(-50%);
                }
              }
            }
          }
          &.active{
            .status-describe{
              .time{
                &:before{
                  content: '';
                  width: 9px;
                  height: 9px;
                  border-radius: 50%;
                  background-color: #FF7D19;
                  position: absolute;
                  top: 50%;
                  left: -28px;
                  transform: translateY(-50%);
                }
              }
            }
          }
        }
        .none{
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #5e6d82;
        }
      }
    }
  }
}
</style>
