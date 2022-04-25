<template>
  <div
    v-loading="detailLoading"
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
      <el-form
        ref="detail"
        :model="form"
        label-width="130px"
        label-position="right"
        class="detail-form"
      >
        <div
          v-if="form.audit === '2'"
          class="freeze"
        >
          <span>拒绝原因：{{ form.reason }}</span>
        </div>
        <div
          v-else-if="form.freeze || form.unfreeze"
          class="freeze"
        >
          <div v-if="form.ifFrozen && !(form.freeze || {}).applyTag">
            <el-button
              type="text"
              size="small"
              class="btn"
            >
              订单冻结
            </el-button>
            <span>冻结原因：{{ (form.freeze || {}).remark }}</span>
            <el-button
              type="text"
              size="small"
              style="margin-left: 10px;font-size: 14px;"
              @click="onApplyFrost"
            >
              点此申请解冻
            </el-button>
          </div>
          <div v-else-if="form.ifFrozen && (form.freeze || {}).applyTag">
            <el-button
              type="text"
              size="small"
              class="btn"
            >
              解冻申请中
            </el-button>
            <span>冻结原因：{{ (form.freeze || {}).remark }}</span>
          </div>
          <div v-else-if="!form.ifFrozen && form.unfreeze">
            <el-button
              type="text"
              size="small"
              class="btn"
            >
              已解冻
            </el-button>
            <span>备注：{{ (form.unfreeze || {}).reason }}</span>
          </div>
        </div>
        <div class="form-title">
          <el-row>
            <el-col :span="4">
              基础信息
            </el-col>
            <el-col
              :span="20"
              style="text-align: right;"
            >
              <!-- <el-button
                v-if="custType === '3'"
                type="primary"
                size="mini"
                @click="handlePrintDetail('m1015')"
              >
                打印唛头
              </el-button>
              <el-button
                v-if="custType === '3'"
                type="primary"
                size="mini"
                @click="handlePrintDetail('wr')"
              >
                打印入仓单
              </el-button> -->
            </el-col>
          </el-row>
        </div>
        <div style="padding: 0 20px;">
          <div style="display: flex;flex-flow: row nowrap;align-items: top;">
            <div style="flex: 1 1 50%;border-right: 1px solid #F1F6FC;">
              <el-form-item
                label="交货区域："
                style="width: 50%;"
              >
                {{ form.deliveryName }}
              </el-form-item>
              <el-form-item
                label="报关方式："
                style="width: 50%;"
              >
                <span v-if="form.customs0 === '0'">普通报关</span>
                <span v-else-if="form.customs0 === '1'">出口退税</span>
                <span v-else-if="form.customs1 === '0'">自有进口商报关</span>
                <span v-else-if="form.customs1 === '1'">无进口商</span>
              </el-form-item>
              <el-form-item
                v-if="form.customs0 === '1'"
                label="合并报关："
                style="width: 50%;"
              >
                <span v-if="form.mergerClearance === '0'">否</span>
                <span v-else-if="form.mergerClearance === '1'">是</span>
                <span v-else>--</span>
              </el-form-item>
              <el-form-item
                label="派送方式："
                style="width: 50%;"
              >
                <span v-if="form.deliveryWay === '0'">
                  快递
                </span>
                <span v-else-if="form.deliveryWay === '1'">
                  卡派
                </span>
                <span v-else-if="form.deliveryWay === '2'">
                  自提
                </span>
                <span v-else-if="form.deliveryWay === '3'">
                  整柜直装
                </span>
                <span v-else-if="form.deliveryWay === '4'">
                  到仓
                </span>
              </el-form-item>
              <el-form-item
                label="关税方式："
                style="width: 50%;"
              >
                <span v-if="form.includeTax">
                  包税
                </span>
                <span v-else>
                  不包税
                </span>
              </el-form-item>
              <el-form-item
                label="业务类型："
                style="width: 50%;"
              >
                {{ (typeList[form.type] || {}).name }}
              </el-form-item>
              <el-form-item
                label="提货方式及地址："
                style="width: 100%;"
              >
                {{ (pickList[form.pickType] || {}).name }}
                &nbsp;{{ form.pickAddress }}
              </el-form-item>
              <el-form-item
                label="备注："
                style="width: 100%;"
              >
                {{ form.remark }}
              </el-form-item>
            </div>
            <div style="flex: 1 1 50%;text-align: center;border-left: 1px solid #F1F6FC;">
              <el-button
                type="primary"
                size="small"
                round
              >
                {{ form.clauseName }}
              </el-button>
              <div style="font-size: 18px;font-weight: 700;margin-top: 10px;">
                {{ form.lscName }}
              </div>
              <!-- <div style="margin-top: 5px;color: #8F9399;">
                截单日期 2019-12-30
              </div> -->
              <div style="display: flex;flex-flow: row nowrap;align-items: center;">
                <div style="flex: 1 1 30%;text-align: center;">
                  <div style="font-size: 18px;font-weight: 700;">
                    <el-popover
                      placement="top"
                      width="250"
                      trigger="hover"
                    >
                      <div
                        v-for="(item, index) in departureList"
                        :key="index"
                      >
                        {{ item }}
                      </div>
                      <span slot="reference">
                        {{ form.departureName }}
                      </span>
                    </el-popover>
                  </div>
                  <!-- <div style="margin-top: 5px;color: #8F9399;">
                    预计开航 2019-12-01
                  </div> -->
                </div>
                <div style="flex: 1 1 40%;text-align: center;">
                  <div style="display: flex;flex-flow: column nowrap;justify-content: center;">
                    <div style="margin-top: 10px;">
                      <svg-icon
                        v-if="form.type === '0'"
                        name="airplane"
                        style="color: #2291E6;width: 25px;height: 25px;"
                      />
                      <svg-icon
                        v-if="form.type === '1'"
                        name="ship"
                        style="color: #2291E6;width: 25px;height: 25px;"
                      />
                      <svg-icon
                        v-if="form.type === '2'"
                        name="railway"
                        style="color: #2291E6;width: 25px;height: 25px;"
                      />
                    </div>
                    <!-- <div style="color: #2291E6;">
                      HBSW
                    </div> -->
                    <div style="margin: 10px 0;width: 100%;height: 2px; background-color: #ccc;" />
                    <!-- <div style="color: #2291E6;">
                      时间
                    </div> -->
                  </div>
                </div>
                <div style="flex: 1 1 30%;text-align: center;">
                  <div style="font-size: 18px;font-weight: 700;">
                    <span v-if="form.type === '3'">
                      {{ (form.consignee || {}).country }}&nbsp;
                      {{ (form.consignee || {}).province }}&nbsp;
                      {{ (form.consignee || {}).city }}
                    </span>
                    <div v-else>
                      <el-popover
                        placement="top"
                        width="250"
                        trigger="hover"
                      >
                        <div
                          v-for="(item, index) in destinationList"
                          :key="index"
                        >
                          {{ item }}
                        </div>
                        <span slot="reference">
                          {{ form.destinationName }}
                        </span>
                      </el-popover>
                    </div>
                  </div>
                  <!-- <div style="margin-top: 5px;color: #8F9399;">
                    预计到港 2019-12-30
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-title">
          收货人
        </div>
        <div class="contact-info">
          <el-form-item
            label="地址类型："
          >
            <span v-if="form.addressType === '0'">FBA</span>
            <span v-if="form.addressType === '1'">私人地址</span>
            <span v-if="form.addressType === '2'">自有海外仓</span>
          </el-form-item>
          <el-form-item
            label="目的仓代码："
          >
            {{ form.fbastoreCode || '--' }}
          </el-form-item>
          <el-form-item
            label="收货人："
          >
            <span :title="(form.consignee || {}).contact">{{ (form.consignee || {}).contact }}</span>
          </el-form-item>
          <el-form-item
            label="联系电话："
          >
            {{ (form.consignee || {}).tel }}
          </el-form-item>
          <el-form-item
            label="国家："
          >
            {{ (form.consignee || {}).countryCode }}
          </el-form-item>
          <el-form-item
            label="目的省份："
          >
            {{ (form.consignee || {}).provinceCode }}
          </el-form-item>
          <el-form-item
            label="目的城市："
          >
            {{ (form.consignee || {}).city }}
          </el-form-item>
          <el-form-item
            label="邮编："
          >
            {{ (form.consignee || {}).postal }}
          </el-form-item>
          <div>
            <el-form-item
              label="详细地址一："
            >
              <span :title="((form.consignee || {}).address || '').split('；')[0]">{{ ((form.consignee || {}).address || '').split('；')[0] }}</span>
            </el-form-item>
          </div>
          <div v-if="((form.consignee || {}).address || '').split('；')[1]">
            <el-form-item
              label="详细地址二："
            >
              <span :title="((form.consignee || {}).address || '').split('；')[1]">{{ ((form.consignee || {}).address || '').split('；')[1] }}</span>
            </el-form-item>
          </div>
          <div v-if="((form.consignee || {}).address || '').split('；')[2]">
            <el-form-item
              label="详细地址三："
            >
              <span :title="((form.consignee || {}).address || '').split('；')[2]">{{ ((form.consignee || {}).address || '').split('；')[2] }}</span>
            </el-form-item>
          </div>
        </div>

        <div class="form-title">
          货物信息
        </div>
        <div style="padding: 0 20px;">
          <el-form-item
            label="拼箱/整柜："
          >
            <span v-if="form.containerType === '1'">
              整柜
            </span>
            <span v-else-if="form.containerType === '0'">
              拼箱
            </span>
          </el-form-item>
          <el-form-item
            label="总件数："
          >
            {{ form.packages }}
          </el-form-item>
          <el-form-item
            label="总货值："
          >
            {{ form.value }}&nbsp;{{ form.currencyId }}
          </el-form-item>
          <el-form-item
            label="计费方式："
          >
            <span v-if="form.lscPriceType === '2'">
              按重量
            </span>
            <span v-if="form.lscPriceType === '3'">
              按体积
            </span>
            <span v-if="form.lscPriceType === '4'">
              按柜型
            </span>
          </el-form-item>
          <el-form-item
            v-if="form.lscPriceType === '2'"
            label="理论收费重量："
          >
            {{ (form.price || {}).finalWeightVol || '--' }} kg
          </el-form-item>
          <el-form-item
            v-if="form.lscPriceType === '3'"
            label="理论收费体积："
          >
            {{ (form.price || {}).finalWeightVol || '--' }} m³
          </el-form-item>
          <el-form-item
            label="理论单价："
          >
            {{ (form.price || {}).price || '--' }} {{ (form.price || {}).currencyId }}
          </el-form-item>
          <el-form-item
            label="理论运费："
          >
            {{ (form.price || {}).totalPrice || '--' }} {{ (form.price || {}).currencyId }}
          </el-form-item>
          <el-form-item
            label="理论总重量："
          >
            {{ $volumeConversion(form.weights, form.umWeight, 'KGS') }} kg
          </el-form-item>
          <el-form-item
            label="理论总体积："
          >
            {{ $volumeConversion(form.volumes, $getVolumeUnitByLengthUnit(form.umLength), 'CBM') }} m³
          </el-form-item>
          <el-form-item
            v-if="form.lscPriceType === '2'"
            label="实际收费重量："
          >
            {{ form.price.afinalWeightVol || '--' }} kg
          </el-form-item>
          <el-form-item
            v-if="form.lscPriceType === '3'"
            label="实际收费体积："
          >
            {{ (form.price || {}).afinalWeightVol || '--' }} m³
          </el-form-item>
          <el-form-item
            label="实际单价："
          >
            {{ (form.price || {}).aprice || '--' }} {{ (form.price || {}).currencyId }}
          </el-form-item>
          <el-form-item
            label="实际运费："
          >
            {{ (form.price || {}).atotalPrice || '--' }} {{ (form.price || {}).currencyId }}
          </el-form-item>
          <el-form-item
            label="实际总重量："
          >
            {{ measure.totalWeight || 0 }} kg
          </el-form-item>
          <el-form-item
            label="实际总体积："
          >
            {{ $volumeConversion(measure.totalVolume || 0, 'CBCM', 'CBM') }} m³
          </el-form-item>
          <div style="padding: 5px 0;background: #F5F7FA;">
            <el-form-item
              label="物流总运费："
            >
              {{ form.xxx }}
            </el-form-item>
            <el-form-item
              label="附加服务费："
            >
              {{ form.xxx }}
            </el-form-item>
            <el-form-item
              label="关税费用："
            >
              {{ form.xxx }}
            </el-form-item>
            <el-form-item
              label="附加关税："
            >
              {{ form.xxx }}
            </el-form-item>
          </div>
        </div>

        <div class="form-title">
          提货方式
        </div>
        <div style="padding: 0 20px;">
          <el-form-item
            label="提货方式："
          >
            {{ (pickList[form.pickType] || {}).name }}
          </el-form-item>
          <el-form-item
            label="提货仓库："
            style="width: 80%;"
          >
            {{ form.warehouseName }}
          </el-form-item>
          <el-form-item
            label="计划入库时间："
          >
            {{ form.planTime }}
          </el-form-item>
          <el-form-item
            label="入仓时间："
            style="width: 80%;"
          >
            {{ form.storageTime }}
          </el-form-item>
          <div v-if="form.pickType === '0'">
            <el-form-item
              label="车牌号："
            >
              {{ form.plateNumber || '--' }}
            </el-form-item>
            <el-form-item
              label="司机姓名："
            >
              {{ form.driverName || '--' }}
            </el-form-item>
            <el-form-item
              label="电话："
            >
              {{ form.driverPhone || '--' }}
            </el-form-item>
            <el-form-item
              label="证件号："
              style="width: 100%;"
            >
              <span v-if="form.certType === '0'">
                身份证
              </span>
              <span v-else-if="form.certType === '1'">
                护照
              </span>
              <span v-else-if="form.certType === '2'">
                港澳通行证
              </span>
              {{ ' | ' + (form.certNo || '--') }}
            </el-form-item>
          </div>
          <div v-else-if="form.pickType === '1' || form.pickType === '3'">
            <el-form-item
              label="联系人："
            >
              {{ form.pickContact }}
            </el-form-item>
            <el-form-item
              label="联系电话："
            >
              {{ form.pickTel }}
            </el-form-item>
            <el-form-item
              :label="form.pickType === '1' ? '提货地址：' : '装柜地址：'"
              style="width: 100%;"
            >
              {{ form.pickAddressName }}
            </el-form-item>
            <el-form-item
              label="详细地址："
              style="width: 100%;"
            >
              {{ form.pickAddress }}
            </el-form-item>
          </div>
          <div v-else-if="form.pickType === '2'">
            <el-form-item
              label="快递公司："
            >
              {{ (form.express || {}).expressName }}
            </el-form-item>
            <el-form-item
              label="快递单号："
            >
              {{ (form.express || {}).no }}
            </el-form-item>
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
  getWordsList,
  applyFrost
} from '@/api/orderlist-at-whole'
import dayjs from 'dayjs'
@Component({
  name: 'detail',
  components: {},
  props: {
    lineList: {
      type: Array,
      default: () => ([])
    },
    pickList: {
      type: Array,
      default: () => ([])
    },
    typeList: {
      type: Array,
      default: () => ([])
    },
    wareList: {
      type: Array,
      default: () => ([])
    }
  }
})
export default class extends Vue {
  /* data */
  private detailLoading: boolean = false
  private form: any = {
    price: {}
  }
  private measure: any = {}
  private wordsList: any[] = []
  private departureList: any[] = []
  private destinationList: any[] = []
  private currentId: any = ''
  /** computed */
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }

  /* 方法 */
  private async setData(row: any) {
    const { id } = row
    this.currentId = id
    this.destinationList = []
    this.departureList = []
    await this.getWordsList()
    this.getDetail()
  }
  private async getWordsList() {
    this.detailLoading = true
    const params:any = {
      type: 'server_terms'
    }
    try {
      const res = await getWordsList(params)
      const data = res.data || []
      this.wordsList = data
    } catch (error) {
      this.detailLoading = true
      return error
    }
  }
  private getDetail(): void {
    // 查询
    getOrderDetails({
      id: this.currentId
    })
      .then((res: any) => {
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
          price,
          measure,
          lscConfig,
          ...obj
        } = data
        let clauseName: any = ''
        let departureName: any = ''
        let destinationName: any = ''
        let lscPriceType: any = ''
        const it: any = lscConfig || {}
        const item = this.wordsList.find((w: any) => w.value === it.clause) || {}
        clauseName = item.label
        const arrP = (it.departureName || '').split(',')
        departureName = (arrP[0] || '') + (arrP.length > 1 ? '...' : '')
        this.departureList = arrP
        const arrS = (it.destinationName || '').split(',')
        destinationName = (arrS[0] || '') + (arrS.length > 1 ? '...' : '')
        this.destinationList = arrS
        lscPriceType = it.priceType

        this.form = {
          price: price || {},
          ...obj,
          ...supplement,
          ...um,
          fbastoreCode: fbastore.code || '',
          lscId: lsc.key,
          lscName: lsc.value,
          currencyId: currency.key,
          countryName: country.value,
          containerType: container.type,
          deliveryName: delivery.value,
          warehouseName: warehouse.name,
          clauseName,
          departureName,
          destinationName,
          lscPriceType
        }
        this.measure = measure || {}
        this.detailLoading = false
      })
      .catch((err: any) => {
        this.detailLoading = false
        return [null, err]
      })
  }

  private unitFilter(val: any) {
    if (val === 'CBM') {
      return 'm³'
    } else if (val === 'CUFT') {
      return 'ft³'
    } else if (val === 'KGS') {
      return 'kg'
    } else if (val === 'LBS') {
      return 'lb'
    } else if (val === 'OZS') {
      return 'oz'
    }
  }
  private onApplyFrost() {
    const params: any = {
      code: this.form.code
    }
    this.$confirm('此操作将申请解冻订单', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        applyFrost(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '提交成功'
            })
            this.getDetail()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }
}
</script>

<style lang="scss" scoped>
.order-detail {
  height: calc(100vh - 170px);
  overflow-y: auto;
}
.detail-back {
  text-align: right;
  padding: 0 20px;
  line-height: 50px;
  border-bottom: 1px solid #e8e8e8;
  background-color: #fff;
}
.detail-form {
  .el-form-item {
    vertical-align: top;
    display: inline-block;
    width: 20%;
    margin-bottom: 0px;
  }
  .contact-info{
    padding: 0 20px;
    .el-form-item {
      width: 25%;
    }
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
.freeze {
  padding: 5px;
  background-color: #FEF0F0;
  border: solid 1px #F56C6C;
  font-size: 14px;
}
.btn {
  padding-right: 10px;
  color: #E12E2E;
  font-size: 14px;
}
  ::v-deep{
    .el-form-item__content{
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
