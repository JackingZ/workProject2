<template>
  <div
    v-loading="detailLoading"
  >
    <div class="detail-back">
      <span
        v-if="!isFromPlan"
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
                label="业务类型："
                style="width: 50%;"
              >
                <span v-if="form.businessType === '0'">空运</span>
                <span v-else-if="form.businessType === '1'">海运</span>
                <span v-else-if="form.businessType === '2'">铁路</span>
                <span v-else-if="form.businessType === '4'">卡航</span>
              </el-form-item>
              <el-form-item
                v-if="form.businessType === '0'"
                label="包板/散货："
                style="width: 50%;"
              >
                <span v-if="form.ifWholeCabinet === '0'">包板</span>
                <span v-else-if="form.ifWholeCabinet === '1'">散货</span>
              </el-form-item>
              <el-form-item
                v-if="form.businessType === '1' || form.businessType === '2'"
                label="拼箱/整柜："
                style="width: 50%;"
              >
                <span v-if="form.ifWholeCabinet === '2'">整柜</span>
                <span v-else-if="form.ifWholeCabinet === '3'">拼箱</span>
              </el-form-item>
              <el-form-item
                v-if="form.businessType === '3'"
                label="整车/散货："
                style="width: 50%;"
              >
                <span v-if="form.ifWholeCabinet === '4'">整车</span>
                <span v-else-if="form.ifWholeCabinet === '5'">散货</span>
              </el-form-item>
              <el-form-item
                label="起运港："
                style="width: 50%;"
              >
                {{ form.portsFromName }}
              </el-form-item>
              <el-form-item
                label="起运时间："
                style="width: 50%;"
              >
                {{ form.shipmentDate }}
              </el-form-item>
              <el-form-item
                label="目的港："
                style="width: 50%;"
              >
                {{ form.portsToName }}
              </el-form-item>
              <el-form-item
                label="服务机构："
                style="width: 50%;"
              >
                {{ form.companyName }}
              </el-form-item>
              <el-form-item
                label="服务："
                style="width: 50%;"
              >
                {{ form.bsServiceName }}
              </el-form-item>
              <el-form-item
                label="服务代码："
                style="width: 50%;"
              >
                {{ form.bstransServiceCode }}
                <el-button
                  v-show="form.bstransServiceCode"
                  type="text"
                  size="small"
                  @click="viewCode(form.bstransServiceCode)"
                >
                  查看详情
                </el-button>
              </el-form-item>
              <el-form-item
                label="货柜数量："
                style="width: 100%;"
              >
                {{ form.nums }}
              </el-form-item>
              <el-form-item
                label="备注："
                style="width: 100%;"
              >
                {{ form.notes }}
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
                {{ form.bsServiceName }}
              </div>
              <!-- <div style="margin-top: 5px;color: #8F9399;">
                截单日期 2019-12-30
              </div> -->
              <div style="display: flex;flex-flow: row nowrap;align-items: center;">
                <div style="flex: 1 1 30%;text-align: center;">
                  <div style="font-size: 18px;font-weight: 700;">
                    {{ form.portsFromName }}
                  </div>
                  <!-- <div style="margin-top: 5px;color: #8F9399;">
                    预计开航 2019-12-01
                  </div> -->
                </div>
                <div style="flex: 1 1 40%;text-align: center;">
                  <div style="display: flex;flex-flow: column nowrap;justify-content: center;">
                    <div style="margin-top: 10px;">
                      <svg-icon
                        v-if="form.businessType === '0'"
                        name="airplane"
                        style="color: #2291E6;width: 25px;height: 25px;"
                      />
                      <svg-icon
                        v-if="form.businessType === '1'"
                        name="ship"
                        style="color: #2291E6;width: 25px;height: 25px;"
                      />
                      <svg-icon
                        v-if="form.businessType === '2'"
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
                    <span v-if="form.businessType === '3'">
                      {{ form.consigneeCountry }}&nbsp;{{ form.consigneeProvince }}&nbsp;{{ form.consigneeCity }}
                    </span>
                    <span v-else>
                      {{ form.portsToName }}
                    </span>
                  </div>
                  <!-- <div style="margin-top: 5px;color: #8F9399;">
                    预计到港 2019-12-30
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-show="custType === '0' || custType === '3'"
          class="form-title"
        >
          计划信息
        </div>
        <div style="padding: 0 20px;">
          <el-table
            v-show="custType === '0' || custType === '3'"
            :data="tableData"
            max-height="300px"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              prop="orgName"
              label="服务机构"
              min-width="150"
              show-overflow-tooltip
            />
            <el-table-column
              prop="serviceCode"
              label="服务编码"
              min-width="150"
              show-overflow-tooltip
            />
            <el-table-column
              :formatter="formatDays"
              prop="shipDay"
              label="起运时间"
              min-width="120"
            />
            <el-table-column
              :formatter="formatDays"
              prop="docDay"
              label="截文件时间"
              min-width="120"
            />
            <el-table-column
              :formatter="formatDays"
              prop="customDay"
              label="截报关时间"
              min-width="120"
            />
            <el-table-column
              label="操作"
              fixed="right"
              width="150"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="viewData(scope.row)"
                >
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="form.source !== '1'">
          <div class="form-title">
            发货人信息
          </div>
          <div style="padding: 0 20px;">
            <el-form-item
              label="联系人："
            >
              {{ form.consignor }}
            </el-form-item>
            <el-form-item
              label="联系电话："
            >
              {{ form.consignorPhone }}
            </el-form-item>
            <el-form-item
              label="联系邮箱："
            >
              {{ form.consignorMail }}
            </el-form-item>
            <el-form-item
              label="邮编："
            >
              {{ form.consignorZip }}
            </el-form-item>
            <el-form-item
              label="联系地址："
              style="width: 75%;"
            >
              {{ form.consignorAddress }}
            </el-form-item>
            <el-form-item
              label="详细地址："
              style="width: 100%;"
            >
              {{ form.consignorCountry }}&nbsp;{{ form.consignorProvince }}&nbsp;{{ form.consignorCity }}&nbsp;{{ form.consignorAddress }}
            </el-form-item>
            <el-form-item
              label="公司："
            >
              {{ form.consignorCompany }}
            </el-form-item>
          </div>
          <div class="form-title">
            收货人信息
          </div>
          <div style="padding: 0 20px;">
            <el-form-item
              label="联系人："
            >
              {{ form.consignee }}
            </el-form-item>
            <el-form-item
              label="联系电话："
            >
              {{ form.consigneePhone }}
            </el-form-item>
            <el-form-item
              label="联系邮箱："
            >
              {{ form.consigneeMail }}
            </el-form-item>
            <el-form-item
              label="邮编："
            >
              {{ form.consigneeZip }}
            </el-form-item>
            <el-form-item
              label="联系地址："
              style="width: 75%;"
            >
              {{ form.consigneeAddress }}
            </el-form-item>
            <el-form-item
              label="详细地址："
              style="width: 100%;"
            >
              {{ form.consigneeCountry }}&nbsp;{{ form.consigneeProvince }}&nbsp;{{ form.consigneeCity }}&nbsp;{{ form.consigneeAddress }}
            </el-form-item>
            <el-form-item
              label="公司："
            >
              {{ form.consigneeCompany }}
            </el-form-item>
          </div>
          <div class="form-title">
            通知人信息
          </div>
          <div style="padding: 0 20px;">
            <div v-if="form.sameConsignee">
              与收货人信息一致
            </div>
            <div v-else>
              <el-form-item
                label="联系人："
              >
                {{ form.notifyName }}
              </el-form-item>
              <el-form-item
                label="联系电话："
              >
                {{ form.notifyPhone }}
              </el-form-item>
              <el-form-item
                label="联系邮箱："
              >
                {{ form.notifyMail }}
              </el-form-item>
              <el-form-item
                label="邮编："
              >
                {{ form.notifyZip }}
              </el-form-item>
              <el-form-item
                label="联系地址："
                style="width: 75%;"
              >
                {{ form.notifyAddress }}
              </el-form-item>
              <el-form-item
                label="详细地址："
                style="width: 100%;"
              >
                {{ form.notifyCountry }}&nbsp;{{ form.notifyProvince }}&nbsp;{{ form.notifyCity }}&nbsp;{{ form.notifyAddress }}
              </el-form-item>
              <el-form-item
                label="公司："
              >
                {{ form.notifyCompany }}
              </el-form-item>
            </div>
          </div>
        </div>
        <div
          v-else
          class="person-info"
        >
          <div class="consigner contacts card">
            <div class="title">
              发货人信息
            </div>
            <div class="person-info-value">
              <el-input
                v-model="form.sender"
                type="textarea"
                readonly
                autosize
              />
            </div>
          </div>
          <div class="consignee contacts card">
            <div class="title">
              收货人信息
            </div>
            <div class="person-info-value">
              <el-input
                v-model="form.receiver"
                type="textarea"
                readonly
                autosize
              />
            </div>
          </div>
          <div class="notifier contacts card">
            <div class="title">
              通知人信息
            </div>
            <div class="person-info-value">
              <el-input
                v-model="form.notifier"
                type="textarea"
                readonly
                autosize
              />
            </div>
          </div>
        </div>
        <div class="form-title">
          货物信息
        </div>
        <div style="padding: 0 20px;">
          <el-form-item
            label="货物唛头："
          >
            {{ form.markNo }}
          </el-form-item>
          <el-form-item
            label="总货值："
          >
            {{ form.totalValue }}
          </el-form-item>
          <el-form-item
            label="总件数："
          >
            {{ form.totalPackage }}
          </el-form-item>
          <el-form-item
            label="总重量："
          >
            {{ form.totalWeight }}&nbsp;kg
          </el-form-item>
          <el-form-item
            label="总体积："
          >
            {{ form.totalVolume }}&nbsp;m³
          </el-form-item>
          <el-form-item
            label="备注："
            style="width: 100%;"
          >
            {{ form.cargoInfo }}
          </el-form-item>
          <div style="padding: 5px 0;background: #F5F7FA;">
            <el-form-item
              label="物流总运费："
            >
              {{ form.totalCharge }}
            </el-form-item>
            <el-form-item
              label="附加服务费："
            >
              {{ form.additionalCharge }}
            </el-form-item>
            <el-form-item
              label="关税费用："
            >
              {{ form.tariffCharge }}
            </el-form-item>
            <el-form-item
              label="附加关税："
            >
              {{ form.xxx }}
            </el-form-item>
          </div>
        </div>
      </el-form>

      <el-dialog
        title="详情"
        width="800px"
        :visible.sync="detailShow"
        :close-on-click-modal="false"
        append-to-body
        @close=";(detailShow = false)"
      >
        <div
          v-loading="servicerLoading"
        >
          <el-form
            :model="selectForm"
            label-width="110px"
            label-position="right"
            class="airline-service-form"
            size="small"
          >
            <el-form-item
              label="服务机构"
              prop="orgId"
            >
              {{ selectForm.orgName }}
            </el-form-item>
            <el-form-item
              label="服务编码"
              prop="serviceCode"
            >
              {{ selectForm.serviceCode }}
            </el-form-item>
            <el-form-item
              label="中转国"
              prop="entreportCountryId"
            >
              {{ selectForm.entreportCountryName }}
            </el-form-item>
            <el-form-item
              label="中转港"
              prop="entreport"
            >
              {{ selectForm.entreportName }}
            </el-form-item>
            <el-form-item
              label="卸货国"
              prop="dischargeCountryId"
            >
              {{ selectForm.dischargeCountryName }}
            </el-form-item>
            <el-form-item
              label="卸货港"
              prop="discharge"
            >
              {{ selectForm.dischargeName }}
            </el-form-item>
            <el-form-item
              label="运输信息"
              prop="days"
            >
              {{ selectForm.days }}天
            </el-form-item>
            <el-form-item
              label="起运时间"
              prop="shipDay"
            >
              {{ filterDays(selectForm.shipDay) }}
            </el-form-item>
            <el-form-item
              label="截文件时间"
              prop="docDay"
            >
              {{ filterDays(selectForm.docDay) }}
            </el-form-item>
            <el-form-item
              label="截报关时间"
              prop="customDay"
            >
              {{ filterDays(selectForm.customDay) }}
            </el-form-item>
            <el-form-item
              label="是否包机"
              prop="airplane"
            >
              {{ selectForm.airplane ? '是' : '否' }}
            </el-form-item>
            <el-form-item
              label="二程转运"
              prop="transfer"
            >
              {{ selectForm.transfer ? '有' : '无' }}
            </el-form-item>
            <div v-if="selectForm.transfer">
              <el-form-item
                label="二程服务机构类型"
                prop="orgType2"
                label-width="130"
              >
                <span v-if="selectForm.orgType2 === '1'">船东</span>
                <span v-if="selectForm.orgType2 === '2'">空运公司</span>
                <span v-if="selectForm.orgType2 === '3'">铁路公司</span>
              </el-form-item>
              <el-form-item
                label="二程卸货国"
                prop="dischargeCountryId2"
              >
                {{ selectForm.dischargeCountryName2 }}
              </el-form-item>
              <el-form-item
                label="二程服务机构"
                prop="orgId2"
              >
                {{ selectForm.orgName2 }}
              </el-form-item>
              <el-form-item
                label="二程卸货港"
                prop="discharge2"
              >
                {{ selectForm.dischargeName2 }}
              </el-form-item>
              <el-form-item
                label="二程运输信息"
                prop="days2"
              >
                {{ selectForm.days2 }}天
              </el-form-item>
              <el-form-item
                label="二程起运时间"
                prop="shipDay2"
              >
                {{ filterDays(selectForm.shipDay2) }}
              </el-form-item>
            </div>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  getOrderDetails,
  getWordsList,
  getBsTransDetail,
  getBsTransByPlanId,
  getBsTransList
} from '@/api/orderlist-at-booking'
import dayjs from 'dayjs'

function formParam() {
  return {
    serviceCode: '',
    airplane: false,
    bsId: undefined,
    days2: undefined,
    discharge2: undefined,
    dischargeName2: undefined,
    dischargeCountryId2: undefined,
    dischargeCountryName2: undefined,
    orgId2: undefined,
    orgName2: undefined,
    orgType2: undefined,
    shipDay2: undefined,
    customDay: undefined,
    days: undefined,
    discharge: undefined,
    dischargeCountryId: undefined,
    dischargeCountryName: undefined,
    docDay: undefined,
    entreport: undefined,
    entreportName: undefined,
    entreportCountryId: undefined,
    entreportCountryName: undefined,
    id: undefined,
    orgId: undefined,
    orgName: undefined,
    orgType: undefined,
    shipDay: undefined,
    transfer: false
  }
}

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
    }
  }
})
export default class extends Vue {
  /* data */
  private detailLoading: boolean = false
  private detailShow: boolean = false
  private servicerLoading: boolean = false
  private isFromPlan: boolean = false
  private form: any = {}
  private selectForm: any = formParam()
  private tableData: any[] = []
  private wordsList: any[] = []
  private weekdays: any = [
    { label: '星期一', value: 1 },
    { label: '星期二', value: 2 },
    { label: '星期三', value: 3 },
    { label: '星期四', value: 4 },
    { label: '星期五', value: 5 },
    { label: '星期六', value: 6 },
    { label: '星期日', value: 7 }
  ]
  /** computed */
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }

  /* 方法 */
  private async setData(row: any) {
    const { id, planId, isFromPlan } = row
    this.isFromPlan = isFromPlan
    const type = (this as any).custType
    this.detailLoading = true
    await this.getWordsList()
    await this.getDetail(id)
    if (planId && (type === '0' || type === '3')) {
      await this.getBsTransByPlanId(planId)
    }
    this.detailLoading = false
  }
  private async getWordsList() {
    const params:any = {
      type: 'server_terms'
    }
    try {
      const res = await getWordsList(params)
      const data = res.data || []
      this.wordsList = data
    } catch (error) {
      this.detailLoading = false
      return error
    }
  }
  private async getDetail(id: string) {
    // 查询
    await getOrderDetails(id)
      .then((res: any) => {
        const data = res.data || {}
        const { orderEntity, personEntity, sameConsignee } = data
        this.form = {
          ...orderEntity,
          ...personEntity,
          sameConsignee
        }
        this.wordsList.map((w: any) => {
          if (w.value === this.form.serverTerms) {
            this.form.clauseName = w.label
          }
        })
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
  private formatDays(row: any, column: any, cellValue: any) {
    const { weekdays } = this
    const result = weekdays.find((item: any) => item.value === cellValue) || {}
    return result.label || ''
  }
  private filterDays(val: any) {
    const { weekdays } = this
    const result = weekdays.find((item: any) => item.value === val) || {}
    return result.label || ''
  }
  private viewData(row: any) {
    // 查看
    this.detailShow = true
    this.servicerLoading = true
    getBsTransDetail({
      id: row.id
    })
      .then((res: any) => {
        const data = res.data || {}
        this.selectForm = data
        this.servicerLoading = false
      })
      .catch((err: any) => {
        this.servicerLoading = false
        return [null, err]
      })
  }
  private viewCode(code?: any) {
    const params = {
      page: 1,
      size: 999,
      model: {
        serviceCode: code
      }
    }
    this.servicerLoading = true
    this.detailShow = true
    getBsTransList(params)
      .then((res: any) => {
        const data = res.data || {}
        const arr = data.result || []
        this.selectForm = arr[0] || {}
        this.servicerLoading = false
      })
      .catch((err: any) => {
        this.servicerLoading = false
        return err
      })
  }
  private async getBsTransByPlanId(id: any) {
    await getBsTransByPlanId({
      id
    })
      .then((res: any) => {
        const data = res.data || []
        this.tableData = data
      })
      .catch((err: any) => {
        this.detailLoading = false
        return err
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
.airline-service-form {
  padding: 0 50px 0 10px;
  .el-form-item {
    display: inline-block;
    width: 50%;
    margin-bottom: 0;
  }
}
.person-info{
  padding: 0 24px 0 24px;
  display: flex;
  background: #FFFFFF;
  /*box-shadow: 0 2px 6px 0 rgba(99, 99, 99, 0.17);*/
  /*border-radius: 8px;*/
  .contacts{
    flex: 1;
    padding-right: 10px;
  }
  .title{
    font-size: 16px;
    font-weight: 700;
  }
  .person-info-value{
    color: #303133;
    padding-top: 10px;
  }
}
::v-deep{
  .person-info-value{
    .el-textarea__inner{
      border-color: transparent;
      resize: none;
      &:focus{
        border-color: transparent;
        box-shadow: none;
      }
    }
  }
}
</style>
