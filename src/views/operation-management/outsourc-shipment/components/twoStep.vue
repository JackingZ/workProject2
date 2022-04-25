<template>
  <div class="two-step">
    <div class="title">
      选择供应商
    </div>
    <div class="form-wrap">
      <el-form
        ref="form"
        :model="form"
        size="mini"
        label-width="90px"
      >
        <el-row style="margin-bottom: 10px">
          <el-col :span="24">
            <el-form-item
              label="供应商："
            >
              {{ ((selectOrderList[0] || {}).selectSupplier || {}).supplierName }}
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              label="装货仓库："
            >
              {{ firstForm.warehouseName }}
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              label="总票数："
            >
              {{ selectOrderListInfo.num }}
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              label="总件数："
            >
              {{ selectOrderListInfo.packages }}
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              label="总重量："
            >
              {{ selectOrderListInfo.weight }} KGS
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item
              label="总体积："
            >
              {{ selectOrderListInfo.volume }} CBM
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="备注："
            >
              <el-input
                v-if="formType !== 'view'"
                v-model="form.remarks"
                type="textarea"
                :disabled="formType === 'view'"
                :rows="2"
                placeholder="请输入"
              />
              <div v-else>
                {{ form.remarks }}
              </div>
            </el-form-item>
          </el-col>
          <el-col
            v-if="formType === 'edit'"
            style="text-align: right;margin-top: 10px"
            :span="24"
          >
            <div style="display: inline-block">
              <el-form-item
                label="添加订单"
                label-width="120px"
              >
                <el-input
                  v-model="searchCode"
                  placeholder="请输入"
                  style="width: 200px;margin-right: 10px"
                />
                <el-button
                  type="primary"
                  @click="searchOrderByCode"
                >
                  添加
                </el-button>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <div
          v-if="orderList.length"
          class="order-list-warp"
        >
          <div
            v-loading="loading"
            class="order-list"
            :style="{height: formType === 'view' ? 'calc(100vh - 410px)' : 'calc(100vh - 480px)'}"
          >
            <div
              v-for="item in orderList"
              :key="item.code"
              class="order-item"
            >
              <div class="header-recommend">
                <span class="recommend-item">
                  <span>供应商：</span>
                  <span>{{ (item.selectSupplier || {}).supplierName }}</span>
                </span>
                <span class="recommend-item">
                  <span>单价：</span>
                  <span>
                    {{ (item.um || {}).currencyId }} {{ (item.selectSupplier || {}).outPrice }}
                    <span v-if="item.xtype === '0'"> / {{ (item.um || {}).umWeight }}</span>
                    <span v-if="item.xtype === '1'"> / {{ (item.um || {}).umVolume }}</span>
                    <span v-if="item.xtype === '2'"> 柜型</span>
                  </span>
                </span>
                <span class="recommend-item">
                  <span>总价：</span>
                  <span class="recommend-price">{{ (item.selectSupplier || {}).totalOutPrice }} {{ (item.um || {}).currencyId }}</span>
                </span>
              </div>
              <div style="display: flex;align-items: center;padding-right: 10px">
                <div class="order-info">
                  <div style="display: flex;flex-flow: row wrap;">
                    <div style="width: 150px;padding: 5px 5px 0 5px;">
                      <div class="text-tip">
                        原单号：
                      </div>
                      <div
                        class="text-info"
                        :title="item.code"
                      >
                        <span
                          v-copy="item.code"
                          class="copy-icon"
                        />
                        <span>{{ item.code }}</span>
                      </div>
                      <div>
                        <span
                          v-if="item.beShip"
                          class="btn-tip-red"
                        >
                          特批发货
                        </span>
                        <span
                          v-if="item.ifFrozen"
                          class="btn-tip-red"
                        >
                          冻结
                        </span>
                        <span
                          v-if="item.ifLocked"
                          class="btn-tip-blue"
                        >
                          锁舱
                        </span>
                        <span
                          v-if="item.payMethod !== '1' && formatPay(item)"
                          class="btn-tip-red"
                        >
                          {{ item.ifPayment ? '逾期已付款' : '逾期未付款' }}
                        </span>
                        <span
                          v-if="item.payMethod === '1'"
                          class="btn-tip-red"
                        >
                          {{ item.ifPayment ? '已付款' : '未付款' }}
                        </span>
                        <span
                          v-if="formatInsuf(item)"
                          class="btn-tip-red"
                        >
                          信用不足
                        </span>
                      </div>
                    </div>

                    <div
                      v-if="item.addressType === '1'"
                      style="width: 120px;padding: 5px 5px 0 5px;"
                    >
                      <div class="text-tip">
                        目的城市：
                      </div>
                      <div class="text-info">
                        {{ (item.consignee || {}).city || '--' }}
                      </div>
                    </div>
                    <div
                      v-if="item.addressType === '0'"
                      style="width: 120px;padding: 5px 5px 0 5px;"
                    >
                      <div class="text-tip">
                        目的仓：
                      </div>
                      <div class="text-info">
                        {{ (item.fbastore || {}).code }}
                      </div>
                    </div>

                    <div style="width: 150px;padding: 5px 5px 0 5px;">
                      <div class="text-tip">
                        服务：
                      </div>
                      <div class="text-info">
                        {{ (item.lsc || {}).value || '--' }}
                      </div>
                    </div>

                    <div style="width: 150px;padding: 5px 5px 0 5px;">
                      <div class="text-tip">
                        下单仓库：
                      </div>
                      <div class="text-info">
                        {{ (item.warehouse || {}).name || '--' }}
                      </div>
                    </div>

                    <div style="width: 150px;padding: 5px 5px 0 5px;">
                      <div class="text-tip">
                        货物所在仓：
                      </div>
                      <div class="text-info">
                        {{ (item.warehouse1 || {}).name || '--' }}
                      </div>
                    </div>

                    <div style="width: 100px;padding: 5px 5px 0 5px;">
                      <div class="text-tip">
                        总体积：
                      </div>
                      <div class="text-info">
                        {{ item.allVolumeNum }} CBM
                      </div>
                    </div>

                    <div style="width: 100px;padding: 5px 5px 0 5px;">
                      <div class="text-tip">
                        总重量：
                      </div>
                      <div class="text-info">
                        {{ item.allWeightNum }} KGS
                      </div>
                    </div>

                    <div style="width: 100px;padding: 5px 5px 0 5px;">
                      <div class="text-tip">
                        最大重量：
                      </div>
                      <div class="text-info">
                        {{ item.maxWei }} KGS
                      </div>
                    </div>

                    <div style="width: 100px;padding: 5px 5px 0 5px;">
                      <div class="text-tip">
                        最大体积：
                      </div>
                      <div class="text-info">
                        {{ item.maxVol }} CBM
                      </div>
                    </div>

                    <div style="width: 100px;padding: 5px 5px 0 5px;">
                      <div class="text-tip">
                        件数：
                      </div>
                      <div class="text-info">
                        {{ item.packages }}
                      </div>
                    </div>

                    <div style="width: 100px;padding: 5px 5px 0 5px;">
                      <div class="text-tip">
                        计量状态：
                      </div>
                      <div class="text-info">
                        {{ (statusList.find(e => e.id === item.status['MEASURE']) || {name: '--'}).name }}
                      </div>
                    </div>

                    <div style="width: 100px;padding: 5px 5px 0 5px;">
                      <div class="text-tip">
                        验货状态：
                      </div>
                      <div class="text-info">
                        {{ (statusList.find(e => e.id === item.status['EXAMINE']) || {name: '--'}).name }}
                      </div>
                    </div>

                    <div style="width: 100px;padding: 5px 5px 0 5px;">
                      <div class="text-tip">
                        报关状态：
                      </div>
                      <div class="text-info">
                        {{ (statusList.find(e => e.id === item.status['CUSTOM_DECLARATION']) || {name: '--'}).name }}
                      </div>
                    </div>

                    <div style="width: 100px;padding: 5px 5px 0 5px;">
                      <div class="text-tip">
                        快递单号：
                      </div>
                      <div class="text-info">
                        <div v-if="item.deliveryWay === '0'">
                          <el-popover
                            v-if="item.express && item.express.trackingNos"
                            title="快递单号"
                          >
                            <p
                              v-for="e in item.express.trackingNos.split(',')"
                              :key="e"
                            >
                              {{ e }}
                            </p>
                            <span
                              slot="reference"
                              style="color: #2291E6;cursor: pointer;"
                            >
                              已出
                            </span>
                          </el-popover>
                          <span v-else>
                            未出
                          </span>
                        </div>
                        <div v-else>
                          --
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <el-button
                  v-if="formType !== 'view'"
                  type="text"
                  size="mini"
                  style="color: #CB1D1D"
                  @click="cancelDelivery(item)"
                >
                  取消发货
                </el-button>
              </div>
            </div>
          </div>
          <div class="total-price">
            <span class="label">合计：</span>
            <span class="value">{{ totalPrice }}</span>
          </div>
        </div>
        <div
          v-else
          class="order-none"
        >
          暂无订单
        </div>
      </el-form>
    </div>
    <div
      v-if="formType !== 'view'"
      class="bottom-btn"
    >
      <div>
        <el-button
          size="mini"
          @click="reset"
        >
          清空
        </el-button>
        <el-button
          v-if="formType === 'add'"
          size="mini"
          @click="prevStep"
        >
          上一步
        </el-button>
      </div>
      <el-button
        v-permission="['outsourcEdit', 'outsourcAdd']"
        type="primary"
        size="mini"
        @click="save"
      >
        保存
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { getOrderData } from '@/api/outsourc-shipment'
import dayjs from 'dayjs'

@Component({
  name: 'index',
  components: {},
  props: {
    formType: {
      type: String,
      default: 'add'
    },
    firstForm: {
      type: Object,
      default: () => ({})
    },
    selectOrderList: {
      type: Array,
      default: () => ([])
    },
    statusList: {
      type: Array,
      default: () => ([])
    }
  }
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private form: any = {
    remarks: ''
  }
  private searchCode: any = ''
  private orderList: any[] = []
  /* computed */
  get totalPrice() {
    let unit = ''
    const totalPrice = this.orderList.reduce((total: number, next: any) => {
      unit = (next.um || {}).currencyId
      const p = (next.selectSupplier || {}).totalOutPrice || 0
      total = total + p
      return total
    }, 0)
    return parseFloat(totalPrice.toFixed(2)) + ' ' + unit
  }
  get selectOrderListInfo() {
    return this.orderList.reduce((info: any, next: any) => {
      info.volume = parseFloat((next.allVolumeNum + info.volume).toFixed(2))
      info.weight = parseFloat((next.allWeightNum + info.weight).toFixed(2))
      info.packages = next.packages + info.packages
      return info
    }, { num: this.orderList.length, volume: 0, weight: 0, packages: 0 })
  }
  @Watch('selectOrderList', { immediate: true, deep: true })
  private selectOrderListChange(val: any) {
    this.orderList = val
  }
  /* methods */
  private searchOrderByCode() {
    if (!this.searchCode) {
      this.$message.warning('请输入原单号')
      return
    }
    const params = {
      code: this.searchCode
    }
    this.loading = true
    getOrderData(params).then((res: any) => {
      this.loading = false
      const data = res.data || {}
      if (data.ifLoading === 1) {
        this.$message.warning('订单已发货')
        return
      }
      if ((this as any).firstForm.lscId !== (data.transChannel || {}).id) {
        this.$message.warning('服务不一致')
        return
      }
      if ((data.warehouse1 || {}).id !== (this as any).firstForm.warehouseId) {
        this.$message.warning('货物所在不一致')
        return
      }
      if (!data.beShip && (data.status || {}).MEASURE !== '7') {
        this.$message.warning('订单暂无计量信息')
        return
      }
      if (!data.beShip && (data.status || {}).EXAMINE !== '10') {
        this.$message.warning('订单未验货')
        return
      }
      if (!data.beShip && (data.supplierList || []).length === 0) {
        this.$message.warning('暂无报价')
        return
      }
      if (!data.beShip && data.audit !== '1') {
        this.$message.warning('订单未审核')
        return
      }
      if (!data.beShip && data.ifFrozen) {
        this.$message.warning('订单已冻结')
        return
      }
      const risk = data.fullorderInsufficient || {}
      if (!data.beShip && !(risk.insufficientStatus === 1 || (data.payMethod === '1' && data.ifPayment) || (data.payMethod !== '1' && !data.insufficient))) {
        this.$message.warning('用户有欠款或信用不足')
        return
      }
      const order = this.orderList[0]
      if (this.boolOrder(data) && (data.warehouse1 || {}).id === (this as any).firstForm.warehouseId) {
        let w = 0
        let v = 0
        let wUnit = ''
        let vUnit = ''
        const measure = data.measure
        if (measure) {
          w = measure.totalWeight
          v = measure.totalVolume
          wUnit = 'KGS'
          vUnit = 'CBCM'
          data.maxVol = parseFloat((this as any).$volumeConversion(measure.maxVolume, vUnit, 'CBM', 2))
          data.maxWei = parseFloat((this as any).$volumeConversion(measure.maxWeight, wUnit, 'KGS', 2))
        }
        data.allVolumeNum = parseFloat((this as any).$volumeConversion(v, vUnit, 'CBM', 2))
        data.allWeightNum = parseFloat((this as any).$volumeConversion(w, wUnit, 'KGS', 2))
        const price = (data.supplierList || []).find((d: any) => d.fromCustId === (order.selectSupplier || {}).supplierId) || {}
        if (!price.priceId) {
          this.$message.warning('供应商不一致')
          return
        }
        data.selectSupplier = {
          supplierId: price.fromCustId,
          supplierName: price.fromCustName,
          outPrice: price.unitPrice,
          totalOutPrice: price.totalPrice,
          priceId: price.priceId
        }
        if (!this.orderList.find((e: any) => e.code === data.code)) {
          this.orderList.push(data)
        }
      } else {
        this.$message.warning('该订单不满足可发货条件(装货仓库、验货完成、计量完成、审核通过、无欠款、信用良好和快递订单号已出)')
      }
    }).catch(() => {
      this.loading = false
    })
  }
  private boolOrder(row: any) {
    // 可发货条件
    const risk = row.fullorderInsufficient || {}
    if (row.beShip) {
      return true
    } else if (row.audit === '1' && (row.status || {}).MEASURE === '7' && (row.status || {}).EXAMINE === '10' && !row.ifFrozen && (risk.insufficientStatus === 1 || (row.payMethod === '1' && row.ifPayment) || (row.payMethod !== '1' && !row.insufficient))) {
      return true
    } else {
      return false
    }
  }
  private save() {
    if (this.orderList.length === 0) {
      this.$message.error('订单不能为空')
      return
    }
    const order = this.orderList[0] || {}
    const params = {
      // status: 0,
      remarks: this.form.remarks,
      deliveryId: (this as any).firstForm.countryId,
      deliveryName: (this as any).firstForm.countryName,
      orderList: this.orderList.map((o: any) => {
        const selectSupplier = o.selectSupplier || {}
        return {
          code: o.code,
          fullorderId: o.id,
          price: selectSupplier.outPrice,
          quotedId: selectSupplier.priceId,
          totalPrice: selectSupplier.totalOutPrice,
          xtype: o.xtype,
          transChannel: o.transChannel
        }
      }),
      serviceId: (this as any).firstForm.lscId,
      serviceName: (this as any).firstForm.lscName,
      supplierId: (order.selectSupplier || {}).supplierId,
      supplierName: (order.selectSupplier || {}).supplierName,
      // totalPackages: this.selectOrderListInfo.packages,
      // totalVolume: this.selectOrderListInfo.volume,
      // totalWeight: this.selectOrderListInfo.weight,
      type: (this as any).firstForm.subtypeId,
      warehouseId: (this as any).firstForm.warehouseId,
      warehouseName: (this as any).firstForm.warehouseName
    }
    this.$emit('save', params)
  }
  private reset() {
    this.form = {
      remarks: ''
    }
    this.searchCode = ''
  }
  private prevStep() {
    this.$emit('prevStep', this.orderList)
  }
  private cancelDelivery(row: any) {
    this.$confirm(`确认取消原单号 ${row.code} 发货吗？`, '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.orderList = this.orderList.filter((o: any) => o.code !== row.code)
    }).catch(() => {
      return false
    })
  }
  private formatPay(row: any) {
    const pay = row.payTime ? dayjs(row.payTime).unix() : ''
    const now = dayjs().unix()
    const time = pay || now
    const cut = row.cutoffTime ? dayjs(row.cutoffTime).unix() : ''
    return !!cut && (cut && cut < time)
  }
  private formatInsuf(row: any) {
    return !!row.insufficient
  }
  // private created() {}
}
</script>

<style lang="scss" scoped>
  .two-step{
    height: 100%;
    background-color: #fff;
    .title{
      padding: 20px 30px;
      font-size: 20px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #323232;
      position: relative;
      &:before{
        position: absolute;
        top: 50%;
        left: 15px;
        transform: translateY(-50%);
        width: 4px;
        height: 20px;
        background: #409EFF;
        content: '';
      }
    }
    .form-wrap{
      padding: 0 15px;
      .select-supplier{
        padding: 0 0 5px 8px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        .label{
          color: #303133;
        }
      }
      .order-list-warp{
        .order-list{
          overflow-y: auto;
          .order-item{
            border-bottom: 1px solid #dfe6ec;
            margin-bottom: 16px;
            .header-recommend{
              border-top: 1px solid #DCE0E5;
              background-color: #EDEDED;
              padding: 4px 10px;
              font-size: 14px;
              font-family: PingFang SC;
              font-weight: 400;
              color: #606266;
              .recommend-item{
                margin-right: 70px;
                &:last-child{
                  margin-right: 0;
                }
                .recommend-price{
                  color: #FF6D00;
                }
              }
            }
            .order-info{
              padding-left: 7px;
              flex: 1;
              display: flex;
              .text-tip {
                font-size: 12px;
                color: #999;
                line-height: 14px;
              }
              .text-info {
                word-break: break-all;
                font-size: 13px;
                color: #303133;
                line-height: 1.7692307692;
              }
            }
          }
        }
        .total-price{
          text-align: right;
          font-size: 24px;
          padding: 10px 0;
          .label{
            font-family: Alibaba PuHuiTi;
            font-weight: 400;
            color: #333333;
          }
          .value{
            font-family: Arial;
            font-weight: bold;
            color: #FF7D19;
          }
        }
      }
      .order-none{
        border-top: 1px solid #e8e8e8;
        height: calc(100vh - 385px);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #5e6d82;
      }
    }
    .bottom-btn{
      display: flex;
      justify-content: space-between;
      padding: 10px 15px;
      border-top: 1px solid #e8e8e8;
    }
  }
  .copy-icon{
    cursor: pointer;
    width: 12px;
    height: 12px;
    display: inline-block;
    margin-right: 5px;
    background: url("../../../../assets/imgs/copy.png") center center no-repeat;
    background-size: 100%;
    &:hover{
      background: url("../../../../assets/imgs/copy-hover.png") center center no-repeat;
      background-size: 100%;
    }
  }
  .btn-tip-red {
    color: #E12E2E;
    background-color: rgba(245, 108, 108, 0.2);
    display: inline-block;
    height: 18px;
    line-height: 18px;
    font-size: 12px;
    padding: 0 2px;
    margin: 0 1px;
    border-radius: 2px;
  }
  .btn-tip-blue {
    color: #2291E6;
    background-color: rgb(34, 145, 230, 0.2);
    display: inline-block;
    height: 18px;
    line-height: 18px;
    font-size: 12px;
    padding: 0 2px;
    margin: 0 1px;
    border-radius: 2px;
  }
  ::v-deep{
    .el-form-item--mini.el-form-item{
      margin-bottom: 0 !important;
    }
    .el-form-item__label{
      padding-left: 5px;
    }
    textarea{
      resize: none;
    }
  }
</style>
