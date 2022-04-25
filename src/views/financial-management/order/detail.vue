<template>
  <div
    v-loading="loading"
    class="app-container"
  >
    <div class="left-container my-scrollbar">
      <div
        v-if="rowDetail.ifFrozen && ifFrozen"
        class="frozen-box card"
      >
        <div class="remarks">
          冻结原因：{{ (rowDetail.freeze || {}).remark }}
        </div>
        <div class="time">
          <span>操作人：{{ (rowDetail.freeze || {}).userName }}  {{ (rowDetail.freeze || {}).datetime }}</span>
        </div>
        <div
          class="close-wrap"
          @click="ifFrozen = false"
        >
          <i class="el-icon-close" />
        </div>
      </div>
      <div class="content-wrap card">
        <div class="tab-box">
          <el-tabs v-model="activeName">
            <el-tab-pane
              name="1"
            >
              <span
                slot="label"
                class="tab-label good"
              >
                <i
                  class="tab-icon"
                  :class="activeName === '1' ? 'g_a' : 'g'"
                />
                商品信息
              </span>
            </el-tab-pane>
            <el-tab-pane
              name="2"
            >
              <span
                slot="label"
                class="tab-label measure"
              >
                <i
                  class="tab-icon"
                  :class="activeName === '2' ? 'm_a' : 'm'"
                />
                计量信息
              </span>
            </el-tab-pane>
            <el-tab-pane
              name="3"
            >
              <span
                slot="label"
                class="tab-label examine"
              >
                <i
                  class="tab-icon"
                  :class="activeName === '3' ? 'e_a' : 'e'"
                />
                验货信息
              </span>
            </el-tab-pane>
            <el-tab-pane
              name="4"
            >
              <span
                slot="label"
                class="tab-label bill"
              >
                <i
                  class="tab-icon"
                  :class="activeName === '4' ? 'b_a' : 'b'"
                />
                账单信息
              </span>
            </el-tab-pane>
          </el-tabs>
          <div class="btn-wrap">
            <el-button
              type="text"
              @click="goBack"
            >
              返回
            </el-button>
          </div>
        </div>
        <div class="content-box">
          <good-info
            v-if="activeName === '1'"
            ref="goodInfo"
            :row-detail="rowDetail"
            :batch-list="batchList"
            @showGood="showGood"
            @preview="previewImage"
          />
          <measure-info
            v-if="activeName === '2'"
            ref="measureInfo"
            :measure-data="measureData"
            :row-detail="rowDetail"
            :measure-list="measureList"
          />
          <examine-info
            v-if="activeName === '3'"
            ref="examineInfo"
            :row-detail="rowDetail"
            :examine-data="examineData"
            @preview="previewImage"
          />
          <order-info
            v-if="activeName === '4'"
            ref="orderInfo"
            :row-detail="rowDetail"
            :order-customer="orderCustomer"
          />
        </div>
      </div>
    </div>
    <div class="right-container my-scrollbar">
      <div class="top-service-info card">
        <div class="top-customer-info">
          <span class="tag">{{ orderCustomer.subtype === '0' ? '直客' : '同行' }}</span>
          <span class="customer-name">{{ (rowDetail.orderCustomer || {}).name }}</span>
        </div>
        <div class="service-info">
          <div class="type-info">
            <svg-icon
              v-if="rowDetail.type === '0'"
              name="airplane"
              style="color: #2291E6;width: 20px;height: 20px;"
            />
            <svg-icon
              v-if="rowDetail.type === '1'"
              name="ship"
              style="color: #2291E6;width: 20px;height: 20px;"
            />
            <svg-icon
              v-if="rowDetail.type === '2'"
              name="railway"
              style="color: #2291E6;width: 20px;height: 20px;"
            />
            <span class="type">{{ (typeList.find(e => e.id === rowDetail.type) || {}).name }}</span>
            <span
              v-if="(rowDetail.container || {}).type === '1'"
              class="sub-type"
            >
              整柜
            </span>
            <span
              v-if="(rowDetail.container || {}).type === '0'"
              class="sub-type"
            >
              拼箱
            </span>
            <span
              v-if="rowDetail.ifLocked"
              class="tag"
            >
              锁舱
            </span>
          </div>
          <div class="lsc-name">
            {{ (rowDetail.lsc || {}).value }}
          </div>
          <div class="code">
            <span
              v-copy="rowDetail.code"
              class="copy-icon"
            />
            <span>
              原单号：{{ rowDetail.code }}
            </span>
          </div>
          <div class="other-info">
            <span v-if="rowDetail.customs0 === '0'">普通报关</span>
            <span v-else-if="rowDetail.customs0 === '1'">出口退税</span>
            <!--<i class="el-icon-edit-outline" />-->
            <span
              v-if="rowDetail.deliveryWay === '0'"
              class="w"
            >快递</span>
            <span
              v-if="rowDetail.deliveryWay === '1'"
              class="w"
            >卡派</span>
            <span
              v-if="rowDetail.deliveryWay === '2'"
              class="w"
            >自提</span>
            <span
              v-if="rowDetail.deliveryWay === '3'"
              class="w"
            >整柜直送</span>
            <span
              v-if="rowDetail.deliveryWay === '4'"
              class="w"
            >到仓</span>
            <!--<i class="el-icon-edit-outline" />-->
          </div>
          <div class="port-info">
            <div class="left">
              <div
                v-if="(rowDetail.lscConfig || {}).departureName"
                :title="(rowDetail.lscConfig || {}).departureName"
                class="port departure"
              >
                {{ (rowDetail.lscConfig || {}).departureName.split(',')[0] }}
              </div>
              <div
                v-if="(rowDetail.lscConfig || {}).destinationName"
                :title="(rowDetail.lscConfig || {}).destinationName"
                class="port destination"
              >
                {{ (rowDetail.lscConfig || {}).destinationName.split(',')[0] }}
              </div>
            </div>
            <div
              v-if="rowDetail.orgTag && rowDetail.orgTag !== '-1'"
              class="right"
            >
              <img
                v-if="organizationLogoList.find(e => e.id === rowDetail.orgTag)"
                :src="organizationLogoList.find(e => e.id === rowDetail.orgTag).src"
                width="38"
                height="38"
              >
            </div>
          </div>
          <div class="tag-list">
            <div
              v-if="rowDetail.beShip"
              class="tag"
            >
              特批发货
            </div>
            <div
              v-if="rowDetail.ifFrozen"
              class="tag"
            >
              冻结
            </div>
            <div
              v-if="rowDetail.payMethod !== '1' && formatPay(rowDetail)"
              class="tag"
            >
              {{ rowDetail.ifPayment ? '逾期已付款' : '逾期未付款' }}
            </div>
            <div
              v-if="rowDetail.payMethod === '1'"
              class="tag"
            >
              {{ rowDetail.ifPayment ? '已付款' : '未付款' }}
            </div>
            <div
              v-if="rowDetail.insufficient"
              class="tag"
            >
              信用不足
            </div>
            <div
              v-if="!rowDetail.enabled"
              class="tag"
            >
              订单已取消
            </div>
          </div>
        </div>
      </div>
      <div class="price-info card">
        <div class="top">
          <el-row style="margin-bottom: 10px">
            <el-col :span="5">
              <span>起运地</span>
            </el-col>
            <el-col :span="19">
              {{ (rowDetail.delivery || {}).value }}
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-col :span="5">
              <span>交货仓库</span>
            </el-col>
            <el-col :span="19">
              {{ (rowDetail.warehouse|| {}).name }}
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-col :span="5">
              <span>提货方式</span>
            </el-col>
            <el-col :span="19">
              {{ (pickList.find(e => e.id === (rowDetail.supplement || {}).pickType) || {}).name }}
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-col :span="5">
              <span>提货时间</span>
            </el-col>
            <el-col :span="19">
              {{ rowDetail.planTime }}
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-col :span="5">
              <span>仓库代码</span>
            </el-col>
            <el-col :span="19">
              {{ (rowDetail.fbastore || {}).code }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <span>收货地址</span>
            </el-col>
            <el-col :span="19">
              {{ `${(rowDetail.consignee || {}).countryCode || ''} ${(rowDetail.consignee || {}).provinceCode || ''} ${(rowDetail.consignee || {}).city || ''} ${((rowDetail.consignee || {}).address || '').split('；').join('')}` }}
            </el-col>
          </el-row>
        </div>
        <div class="b">
          <el-row style="margin-bottom: 10px">
            <el-col :span="5">
              <span>计费方式</span>
            </el-col>
            <el-col :span="19">
              <span v-if="(rowDetail.lscConfig || {}).priceType === '2'">
                按重量
              </span>
              <span v-if="(rowDetail.lscConfig || {}).priceType === '3'">
                按体积
              </span>
              <span v-if="(rowDetail.lscConfig || {}).priceType === '4'">
                按柜型
              </span>
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-col :span="5">
              <span>单价</span>
            </el-col>
            <el-col :span="19">
              <div class="divline">
                {{ (rowDetail.price || {}).currencyId }} {{ (rowDetail.price || {}).aprice || '--' }} {{ (rowDetail.price || {}).currencyName }}
              </div>
              <div class="divline">
                &nbsp;/&nbsp;
              </div>
              <div
                v-if="(rowDetail.lscConfig || {}).priceType === '2'"
                class="divline"
              >
                {{ (rowDetail.lscConfig || {}).umWeight }}
              </div>
              <div
                v-if="(rowDetail.lscConfig || {}).priceType === '3'"
                class="divline"
              >
                {{ (rowDetail.lscConfig || {}).umVolume }}
              </div>
            </el-col>
          </el-row>
          <template
            v-if="((rowDetail.price || {}).billingConfig || {}).bubble === null || ((rowDetail.price || {}).billingConfig || {}).bubble === undefined"
          >
            <el-row
              v-if="(rowDetail.lscConfig || {}).priceType === '2' && ((rowDetail.price || {}).billingConfig || {}).algorithm === '1' && ((rowDetail.price || {}).billingConfig || {}).bulky && ((rowDetail.price || {}).billingConfig || {}).fenestration"
              style="margin-bottom: 10px"
            >
              <el-col :span="5">
                <span>分泡规则</span>
              </el-col>
              <el-col :span="19">
                <div class="divline">
                  单票实重 > {{ ((rowDetail.price || {}).billingConfig || {}).fenestration || '--' }} kg & 分泡 {{ ((rowDetail.price || {}).billingConfig || {}).bulky }}%
                </div>
              </el-col>
            </el-row>
          </template>
          <template v-else>
            <el-row
              v-if="(rowDetail.lscConfig || {}).priceType === '2' && ((rowDetail.price || {}).billingConfig || {}).algorithm === '1'"
              style="margin-bottom: 10px"
            >
              <el-col :span="5">
                <span>分泡规则</span>
              </el-col>
              <el-col
                :span="19"
              >
                <div
                  v-show="!((rowDetail.price || {}).billingConfig || {}).bubble"
                  class="divline"
                >
                  不分泡
                </div>
                <div
                  v-if="((rowDetail.price || {}).billingConfig || {}).bubble && ((rowDetail.price || {}).billingConfig || {}).bubbleRule1Check && ((rowDetail.price || {}).billingConfig || {}).bubbleRule2Check"
                  class="divline"
                >
                  单票实重 > {{ ((rowDetail.price || {}).billingConfig || {}).bubbleRule1 }} kg & 1m³实重 >= {{ ((rowDetail.price || {}).billingConfig || {}).bubbleRule2 }}kg & 1m³ 实重 &lt; 167kg
                </div>
                <div
                  v-else-if="((rowDetail.price || {}).billingConfig || {}).bubble && ((rowDetail.price || {}).billingConfig || {}).bubbleRule2Check"
                  class="divline"
                >
                  1m³实重 >= {{ ((rowDetail.price || {}).billingConfig || {}).bubbleRule2 }}kg & 1m³ 实重 &lt; 167kg
                </div>
                <div
                  v-else-if="((rowDetail.price || {}).billingConfig || {}).bubble && ((rowDetail.price || {}).billingConfig || {}).bubbleRule1Check"
                  class="divline"
                >
                  单票实重 > {{ ((rowDetail.price || {}).billingConfig || {}).bubbleRule1 }} kg
                </div>
                <div
                  v-if="((rowDetail.price || {}).billingConfig || {}).bubble"
                  class="divline"
                >
                  & {{ '分泡' + ((rowDetail.price || {}).billingConfig || {}).bulky }}%
                </div>
              </el-col>
            </el-row>
          </template>
          <el-row
            v-if="(rowDetail.lscConfig || {}).priceType === '2'"
            style="margin-bottom: 10px"
          >
            <el-col :span="5">
              <span>单箱最低</span>
            </el-col>
            <el-col :span="19">
              {{ ((rowDetail.price || {}).billingConfig || {}).sbmc }}
            </el-col>
          </el-row>
          <el-row
            v-if="(rowDetail.lscConfig || {}).priceType === '2'"
            style="margin-bottom: 10px"
          >
            <el-col :span="5">
              <span>单票最低</span>
            </el-col>
            <el-col :span="19">
              {{ ((rowDetail.price || {}).billingConfig || {}).simc }}
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-col :span="5">
              <span>体积比</span>
            </el-col>
            <el-col :span="19">
              {{ ((rowDetail.price || {}).billingConfig || {}).vw }}
            </el-col>
          </el-row>
          <el-row v-if="(rowDetail.lscConfig || {}).priceType === '2'">
            <el-col :span="5">
              <span>重量算法</span>
            </el-col>
            <el-col :span="19">
              <div
                v-show="((rowDetail.price || {}).billingConfig || {}).algorithm === '0'"
                class="divline"
              >
                取实重
              </div>
              <div
                v-show="((rowDetail.price || {}).billingConfig || {}).algorithm === '2'"
                class="divline"
              >
                取实重或体积重的平均值
              </div>
              <div
                v-show="((rowDetail.price || {}).billingConfig || {}).algorithm === '1'"
                class="divline"
              >
                取实重或体积重的最大值
              </div>
              <div
                v-show="((rowDetail.price || {}).billingConfig || {}).algorithm === '1'"
                class="divline"
              >
                &nbsp;&
              </div>
              <div
                v-show="((rowDetail.price || {}).billingConfig || {}).algorithm === '1' && ((rowDetail.price || {}).billingConfig || {}).multiWeight === '0'"
                class="divline"
              >
                &nbsp;先累加后比较
              </div>
              <div
                v-show="((rowDetail.price || {}).billingConfig || {}).algorithm === '1' && ((rowDetail.price || {}).billingConfig || {}).multiWeight === '1'"
                class="divline"
              >
                &nbsp;先比较后累加
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <el-dialog
      title="图片预览"
      :visible.sync="imgShow"
      :close-on-click-modal="true"
      append-to-body
      width="540px"
      @closed=";(imgShow = false)"
    >
      <img
        :src="imgUrl"
        style="display: block;height: 100%;width: 100%;object-fit: contain;"
      >
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import GoodInfo from '@/views/financial-management/order/good-info.vue'
import OrderInfo from '@/views/financial-management/order/orderInfo.vue'
import MeasureInfo from '@/views/financial-management/order/measure-info.vue'
import ExamineInfo from '@/views/financial-management/order/exmaine-info.vue'
import { getOrderDetails, getOtherOrder, getOrderCustomer } from '@/api/orderlist-at-whole'
import dayjs from 'dayjs'

@Component({
  name: '',
  components: {
    GoodInfo,
    OrderInfo,
    MeasureInfo,
    ExamineInfo
  }
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private imgShow: boolean = false
  private activeName: any = '1'
  private imgUrl: any = ''
  private ifFrozen: boolean = true
  private row: any = {}
  private rowDetail: any = {}
  private measureData: any = {}
  private examineData: any = {}
  private orderCustomer: any = {}
  private measureList: any[] = []
  private batchList: any[] = []
  private typeList: any[] = [
    {
      id: '0',
      name: '空运'
    },
    {
      id: '1',
      name: '海运'
    },
    {
      id: '2',
      name: '铁路'
    },
    {
      id: '3',
      name: '快递'
    },
    {
      id: '4',
      name: '卡航'
    }
  ]
  private organizationLogoList: any[] = [
    {
      id: '1',
      src: '/meiseng.png'
    },
    {
      id: '2',
      src: '/yixing.png'
    },
    {
      id: '3',
      src: '/chang.png'
    }
  ]
  private pickList: any[] = [
    { name: '自主送货', id: '0' },
    { name: '上门提货', id: '1' },
    { name: '快递发货', id: '2' },
    { name: '整柜直装', id: '3' }
  ]
  private categories: any[] = [
    {
      name: '普货',
      value: '0'
    },
    {
      name: '纯电',
      value: '2'
    },
    {
      name: '带磁',
      value: '3'
    },
    {
      name: '带电',
      value: '1'
    },
    {
      name: '危险',
      value: '4'
    }
  ]
  private timer: any = ''
  /** comoputed */
  /* methods */
  private beforeDestroy() {
    clearTimeout(this.timer)
  }
  private previewImage(url: string) {
    if (url) {
      this.imgShow = true
      this.imgUrl = process.env.VUE_APP_OSS_PATH + url
    } else {
      this.$message.warning('图片地址错误')
    }
  }
  private goBack() {
    this.activeName = '1'
    this.row = {}
    this.rowDetail = {}
    this.measureData = {}
    this.examineData = {}
    this.orderCustomer = {}
    this.measureList = []
    this.batchList = []
    this.imgUrl = ''
    clearTimeout(this.timer)
    this.$emit('goBack')
  }
  private showGood(b: any) {
    b.isOpen = !b.isOpen
  }
  private async setData(row: any) {
    this.row = row
    await this.loadData()
    this.getUnloadInfo()
    this.getOrderCustomer()
  }
  private async loadData() {
    this.loading = true
    await getOrderDetails({ id: this.row.id }).then((res: any) => {
      this.loading = false
      this.rowDetail = res.data || {}
      const batchSummaries = (res.data || {}).batchSummaries || []
      this.batchList = ((res.data || {}).batches || []).map((e: any) => {
        const batchSummarie = batchSummaries.find((b: any) => b.code === e.code)
        return {
          ...e,
          isOpen: false,
          batchBoxNum: (batchSummarie || {}).packages
        }
      })
    }).catch(() => {
      this.loading = false
      this.rowDetail = {}
    })
  }
  // 获取仓库计量验货信息
  private getUnloadInfo() {
    this.measureData = {}
    this.examineData = {}
    this.measureList = []
    getOtherOrder({ id: this.row.id, code: this.row.code, sellerId: (this.row.seller || {}).id }).then((res: any) => {
      const data = res.data || {}
      if (this.rowDetail.deliveryWay === '0' && this.rowDetail.type === '0') {
        // 空运快递派
        this.measureData = data.measure2 || {}
        this.measureList = (this.measureData.measurementDetails || []).map((e: any) => {
          return {
            ...e,
            wigth: e.width
          }
        })
      } else {
        this.measureData = (data.measure || []).filter((e: any) => e.delFlag === 0 && e.measureStatus === 3)[0] || {}
        this.measureList = this.measureData.measurementDetails || []
      }
      const examineData = (data.examine || []).filter((e: any) => e.delFlag === 0 && e.status === 3)[0] || {}
      const categories = examineData.categories || ''
      const categoriesList = [...new Set([...categories.split(',')])]
      const categoriesStr = this.categories.filter((o: any) => categoriesList.find((c: any) => c === o.value)).map((c: any) => c.name).join('，')
      this.examineData = {
        ...examineData,
        categoriesStr
      }
    }).catch((err) => {
      return err
    })
  }
  private getOrderCustomer() {
    clearTimeout(this.timer)
    getOrderCustomer({ id: (this.rowDetail.orderCustomer || {}).id }).then((res: any) => {
      this.orderCustomer = res.data || {}
      if (!this.orderCustomer.id) {
        this.timer = setTimeout(() => {
          this.getOrderCustomer()
        }, 1000)
      }
    }).catch(() => {
      this.orderCustomer = {}
      this.timer = setTimeout(() => {
        this.getOrderCustomer()
      }, 1000)
    })
  }
  private formatPay(row: any) {
    const pay = row.payTime ? dayjs(row.payTime).unix() : ''
    const now = dayjs().unix()
    const time = pay || now
    const cut = row.cutoffTime ? dayjs(row.cutoffTime).unix() : ''
    return !!cut && (cut && cut < time)
  }
}
</script>

<style lang="scss" scoped>
  .app-container{
    width: 100%;
    height: 100%;
    display: flex;
    .left-container{
      height: 100%;
      overflow: auto;
      flex: 1;
      padding-right: 16px;
      .frozen-box{
        padding: 6px 16px;
        background: #FFECED;
        border: 1px solid #FF4753;
        box-shadow: none;
        position: relative;
        margin-bottom: 16px;
        .remarks{
          font-size: 12px;
          font-family: Alibaba PuHuiTi;
          font-weight: 400;
          color: #FF4753;
          margin-bottom: 4px;
        }
        .time{
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #909399;
        }
        .close-wrap{
          position: absolute;
          top: 50%;
          right: 16px;
          transform: translateY(-50%);
          cursor: pointer;
        }
      }
      .content-wrap{
        overflow: hidden;
        .tab-box{
          position: relative;
          .tab-label{
            display: flex;
            align-items: center;
            .tab-icon{
              display: inline-block;
              width: 20px;
              height: 20px;
              margin-right: 4px;
              &.g_a{
                background: url("../../../assets/imgs/g_a.png") center center no-repeat;
                background-size: 100%;
              }
              &.g{
                background: url("../../../assets/imgs/g.png") center center no-repeat;
                background-size: 100%;
              }
              &.m_a{
                background: url("../../../assets/imgs/m_a.png") center center no-repeat;
                background-size: 100%;
              }
              &.m{
                background: url("../../../assets/imgs/m.png") center center no-repeat;
                background-size: 100%;
              }
              &.e_a{
                background: url("../../../assets/imgs/e_a.png") center center no-repeat;
                background-size: 100%;
              }
              &.e{
                background: url("../../../assets/imgs/e.png") center center no-repeat;
                background-size: 100%;
              }
              &.b_a{
                background: url("../../../assets/imgs/b_a.png") center center no-repeat;
                background-size: 100%;
              }
              &.b{
                background: url("../../../assets/imgs/b.png") center center no-repeat;
                background-size: 100%;
              }
            }
            &.good:hover{
              .tab-icon{
                background: url("../../../assets/imgs/g_a.png") center center no-repeat;
                background-size: 100%;
              }
            }
            &.measure:hover{
              .tab-icon{
                background: url("../../../assets/imgs/m_a.png") center center no-repeat;
                background-size: 100%;
              }
            }
            &.examine:hover{
              .tab-icon{
                background: url("../../../assets/imgs/e_a.png") center center no-repeat;
                background-size: 100%;
              }
            }
            &.bill:hover{
              .tab-icon{
                background: url("../../../assets/imgs/b_a.png") center center no-repeat;
                background-size: 100%;
              }
            }
          }
          .btn-wrap{
            position: absolute;
            top: 50%;
            right: 16px;
            transform: translateY(-50%);
          }
        }
        .content-box{
          max-height: calc(100vh - 155px);
          overflow-y: auto;
        }
      }
    }
    .right-container{
      width: 350px;
      height: 100%;
      overflow: auto;
      .top-service-info{
        margin-bottom: 16px;
        .top-customer-info{
          border-bottom: 1px solid #EBEEF5;
          padding: 10px 10px;
          display: flex;
          align-items: center;
          span{
            font-size: 12px;
            font-family: Microsoft YaHei;
            color: #303133;
          }
          .tag{
            color: #324770;
            border: 1px solid #324770;
            border-radius: 2px;
            padding: 2px 3px;
          }
          .customer-name{
            padding-left: 5px;
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .service-info{
          padding: 13px 16px 16px 16px;
          font-family: Microsoft YaHei;
          .type-info{
            font-size: 12px;
            font-weight: 400;
            color: #333333;
            display: flex;
            align-items: center;
            .type{
              margin-left: 8px;
            }
            .sub-type{
              position: relative;
              padding-left: 16px;
              &:before{
                position: absolute;
                top: 50%;
                left: 8px;
                transform: translateY(-50%);
                content: '';
                width: 1px;
                height: 100%;
                background-color: #DCDFE6;
              }
            }
            .tag{
              margin-left: 24px;
              border-radius: 2px;
              padding: 2px 3px;
              background: rgba(230, 173, 51, 0.1);
              color: #CB992D;
            }
          }
          .lsc-name{
            margin-top: 10px;
            font-size: 14px;
            font-weight: 600;
            color: #333333;
          }
          .code{
            margin-top: 8px;
            font-size: 12px;
            font-weight: 400;
            color: #909399;
            display: flex;
            align-items: center;
          }
          .other-info{
            margin-top: 8px;
            font-size: 12px;
            font-weight: 400;
            color: #909399;
            span{
              margin-right: 5px;
            }
            .w{
              position: relative;
              padding-left: 16px;
              &:before{
                position: absolute;
                top: 50%;
                left: 8px;
                transform: translateY(-50%);
                content: '';
                width: 1px;
                height: 100%;
                background-color: #DCDFE6;
              }
            }
          }
          .port-info{
            display: flex;
            align-items: center;
            .left{
              flex: 1;
              .port{
                padding-left: 25px;
                font-size: 14px;
                font-weight: 500;
                color: #333333;
                position: relative;
                margin-top: 10px;
                width: 100%;
                cursor: default;
                &:before{
                  position: absolute;
                  top: 50%;
                  left: 0;
                  transform: translateY(-50%);
                  content: '';
                  width: 12px;
                  height: 12px;
                  border-radius: 50%;
                }
                &.departure{
                  &:before{
                    background: #1EAC2C;
                  }
                  &:after{
                    position: absolute;
                    top: 17px;
                    left: 5px;
                    width: 2px;
                    height: 8px;
                    content: '';
                    background-color: #CBCBCB;
                  }
                }
                &.destination{
                  &:before{
                    background: #FF9C39;
                  }
                }
              }
            }
            .right{
              width: 38px;
              height: 38px;
            }
          }
          .tag-list{
            font-size: 12px;
            .tag{
              margin-top: 13px;
              display: inline-block;
              border-radius: 2px;
              padding: 3px 5px;
              background: rgba(255, 71, 83, 0.1);
              color: #FF4753;
              margin-right: 8px;
              &:last-child{
                margin-right: 0;
              }
            }
          }
        }
      }
      .price-info{
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #303133;
        span{
          color: #909399;
        }
        .top{
          padding: 16px;
          border-bottom: 1px solid #EBEEF5;
        }
        .b{
          padding: 16px;
        }
      }
    }
  }
  .card{
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  .copy-icon{
    cursor: pointer;
    width: 12px;
    height: 12px;
    display: inline-block;
    margin-right: 5px;
    background: url("../../../assets/imgs/copy.png") center center no-repeat;
    background-size: 100%;
    &:hover{
      background: url("../../../assets/imgs/copy-hover.png") center center no-repeat;
      background-size: 100%;
    }
  }
  ::v-deep{
    .el-tabs__nav-scroll{
      padding: 0 20px;
    }
    .el-tabs__header{
      margin: 0;
    }
  }
  /* 设置滚动条的样式 */
  .my-scrollbar{
    &::-webkit-scrollbar{
      width: 4px;
    }
    /* 滚动槽 */
    &::-webkit-scrollbar-track{
      border-radius: 2px;
    }
    /* 滚动条滑块 */
    &::-webkit-scrollbar-thumb{
      border-radius: 2px;
      background: rgba(0, 0, 0, 0.1);
    }
  }
  .divline{
    display: inline-block;
  }
</style>
