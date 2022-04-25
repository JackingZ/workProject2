<template>
  <div
    v-loading="loading"
    class="app-container"
  >
    <div>
      <el-row class="header-title">
        <el-col :span="20">
          <h3>整柜发货</h3>
        </el-col>
        <el-col
          :span="4"
          style="text-align:right;padding: 6px;"
        >
          <el-button
            type="text"
            size="small"
            style="font-size: 14px;"
            @click="goBack"
          >
            返 回
          </el-button>
        </el-col>
      </el-row>
      <div class="app-panel">
        <el-input
          v-model="keyCode"
          :disabled="!!isStr"
          placeholder="原单号"
          style="width: 200px;margin-right: 10px;"
          size="small"
        />
        <el-button
          :disabled="!!isStr"
          size="small"
          type="primary"
          @click="onSearch"
        >
          查询
        </el-button>

        <div style="font-size: 16px;padding-top: 20px;">
          订单信息
        </div>
        <div style="font-size: 12px;padding-top: 10px;">
          <span class="form-span">服务：{{ orderForm.name }}</span>
          <span class="form-span">目的港：{{ orderForm.destinationName }}</span>
          <span class="form-span">报关方式：
            <span v-show="orderForm.customs0 === '0'">普通报关</span>
            <span v-show="orderForm.customs0 === '1'">出口退税</span>
          </span>
          <span class="form-span">关税：{{ orderForm.taxes }}</span>
          <span class="form-span">派送方式：{{ filterDispatch(orderForm.deliveryWay) }}</span>
          <span class="form-span">
            <span v-if="orderForm.type === '0'">航空板：</span>
            <span v-if="orderForm.type === '1'">柜型：</span>
            <span v-if="orderForm.type === '2'">柜型：</span>
            <span v-if="orderForm.type === '4'">车型：</span>
            {{ orderForm.containerName }}
          </span>
          <span class="form-span">装柜地址：{{ orderForm.pickAddressName }}</span>
        </div>
        <div style="font-size: 12px;padding: 10px 0;">
          <span class="form-span">总件数：{{ orderForm.packages }}</span>
          <span class="form-span">总体积：{{ orderForm.volumes }}&nbsp;{{ orderForm.umVolume }}</span>
          <span class="form-span">总重量：{{ orderForm.weights }}&nbsp;{{ orderForm.umWeight }}</span>
          <span class="form-span">总货值：{{ orderForm.value }}&nbsp;{{ orderForm.currencyId }}</span>
          <span class="form-span">联系人：{{ orderForm.pickContact }}</span>
          <span class="form-span">联系电话：{{ orderForm.pickTel }}</span>
        </div>

        <el-select
          v-model="planForm.planId"
          :loading="selectLoading"
          :disabled="!orderForm.type || !!isStr"
          size="small"
          filterable
          clearable
          placeholder="发货计划"
          style="width: 200px;margin-top: 10px;"
          @focus="getPlanList"
          @change="onPlan"
        >
          <el-option
            v-for="item in planList"
            :key="item.id"
            :label="item.bscName"
            :value="`${item.id}`"
          />
        </el-select>
        <div style="font-size: 12px;padding-top: 10px;">
          <span class="form-span">业务类型：{{ filterType(planForm.type) }}</span>
          <span class="form-span">服务类型：{{ filterTrans(planForm.transType) }}</span>
          <span class="form-span">订舱服务：{{ planForm.bscName }}</span>
          <span class="form-span">
            <span v-if="planForm.type === '0'">航空板：</span>
            <span v-if="planForm.type === '1'">柜型：</span>
            <span v-if="planForm.type === '2'">柜型：</span>
            <span v-if="planForm.type === '4'">车型：</span>
            {{ planForm.containerName }}
          </span>
          <span class="form-span">服务机构：{{ planForm.serviceName }}</span>
          <span class="form-span">服务编码：{{ planForm.serviceCode }}</span>
          <span class="form-span">目的仓代码：{{ (planForm.fbastore || {}).value }}</span>
        </div>
        <div style="font-size: 12px;padding: 10px 0;">
          <span class="form-span">起运港：{{ (planForm.originPort || {}).value }}</span>
          <span class="form-span">目的港：{{ (planForm.targetPort || {}).value }}</span>
          <span class="form-span">起运国：{{ (planForm.originCountry || {}).value }}</span>
          <span class="form-span">目的国：{{ (planForm.targetCountry || {}).value }}</span>
          <span class="form-span">派件方式：{{ filterDispatch(planForm.dispatch) }}</span>
          <span class="form-span">起运日期：{{ planForm.shippingDate }}</span>
          <span class="form-span">截单日期：{{ planForm.cutoffDate }}</span>
          <span class="form-span">运输时间：{{ planForm.transitTime }}天</span>
        </div>

        <el-select
          v-model="planForm.custId"
          :loading="selectLoading"
          :disabled="isStr === 'v'"
          placeholder="拖车供应商"
          style="width:200px;margin-top: 10px;"
          clearable
          filterable
          size="small"
          @focus="getSupplierList"
        >
          <el-option
            v-for="item in supplierList"
            :key="item.custId"
            :label="item.custName"
            :value="item.custId"
          />
        </el-select>

        <div style="text-align:right;padding-top: 20px;">
          <el-button
            v-if="isStr !== 'v'"
            type="primary"
            size="small"
            @click="handleSave"
          >
            保存
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import dayjs from 'dayjs'
import {
  getDeliveryList,
  getSupplierList,
  getShipByCode,
  getSoByPlanId,
  getAviationList,
  getCabinetList,
  getVehicleTypeList,
  updateShip,
  getBSCDetailById,
  getShipById
} from '@/api/operation-of-single-shipment'

function paramsOrder() {
  return {
    name: undefined,
    destinationId: undefined,
    destinationName: undefined,
    customs0: undefined,
    customs1: undefined,
    taxes: undefined,
    deliveryWay: undefined,
    containerName: undefined,
    pickAddressName: undefined,
    pickContact: undefined,
    pickTel: undefined,
    weights: undefined,
    packages: undefined,
    volumes: undefined,
    value: undefined,
    currencyId: undefined,
    currencyName: undefined,
    umVolume: undefined,
    umWeight: undefined,
    countryToIds: undefined
  }
}
function paramsPlan() {
  return {
    planId: undefined,
    type: undefined,
    bscId: undefined,
    bscName: undefined,
    containerId: undefined,
    containerName: undefined,
    dispatch: undefined,
    shippingDate: undefined,
    cutoffDate: undefined,
    transitTime: undefined,
    serviceName: undefined,
    serviceId: undefined,
    supplyId: undefined,
    fbastore: undefined,
    serviceCode: undefined,
    transType: undefined,
    originPort: undefined,
    targetPort: undefined,
    originCountry: undefined,
    targetCountry: undefined,
    custId: undefined,
    custName: undefined
  }
}

@Component({
  name: '',
  components: {
  },
  props: {
    singleId: {
      type: String,
      default: ''
    },
    isStr: {
      type: String,
      default: ''
    }
  }
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private selectLoading: boolean = false
  private planList: any[] = []
  private supplierList: any[] = []
  private planForm: any = paramsPlan()
  private orderForm: any = paramsOrder()
  private boxForm: any = {
    volume: undefined,
    loadLimit: undefined,
    umWeight: undefined,
    name: undefined,
    quantity: undefined,
    umLength: undefined
  }
  private shipData: any = {}
  private soList: any[] = []
  private containerList: any[] = []
  private bscObj: any = {}
  private keyCode: any = ''
  private jsonRow: any = {}
  private jsonPId: boolean = false

  /** method */
  private filterType(type: any) {
    if (type === '0') {
      return '空运'
    } else if (type === '1') {
      return '海运'
    } else if (type === '2') {
      return '铁路'
    } else if (type === '4') {
      return '卡航'
    }
  }
  private filterDispatch(type: any) {
    const obj: any = { '0': '快递', '1': '卡派', '2': '自提', '3': '整柜直送', '4': '到仓' }
    const arrD = (`${type}` || '').split(',')
    const arrN: any[] = []
    arrD.map((it: any) => {
      arrN.push(obj[it])
    })
    return arrN.join(',')
  }

  private filterTrans(type: any) {
    if (!type) return
    let name: any = ''
    const list = [
      { id: '0', name: '包板' },
      { id: '1', name: '散货' },
      { id: '2', name: '整柜' },
      { id: '3', name: '拼箱' },
      { id: '4', name: '整车' },
      { id: '5', name: '拼箱' }
    ]
    const arr = (type || '').split(',')
    arr.map((it: any) => {
      const item: any = list.find((l: any) => l.id === it) || {}
      if (item.name) {
        name += item.name + ' '
      }
    })
    return name
  }
  private async onSearch() {
    this.planList = []
    this.planForm = paramsPlan()
    this.containerList = []
    this.shipData = {}
    if (!this.keyCode) {
      this.orderForm = paramsOrder()
      return
    }
    await this.getOrderForm()
  }
  private async getOrderForm() {
    this.loading = true
    await getShipByCode({ code: this.keyCode }).then((res: any) => {
      const data = res.data || {}
      this.shipData = data
      this.setOrderForm()
      this.loading = false
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }
  private setOrderForm() {
    const data = JSON.parse(JSON.stringify(this.shipData))
    const { type, customs0, customs1, taxes, deliveryWay, weights, packages, volumes, value } = data
    const countryToIds = (((data.transChannel || {}).targets || [])[0] || {}).countryId
    this.orderForm = {
      type,
      name: (data.lscConfig || {}).name,
      destinationName: (data.lscConfig || {}).destinationName,
      destinationId: (data.lscConfig || {}).destinationId,
      customs0,
      customs1,
      taxes,
      deliveryWay,
      containerName: (data.container || {}).name,
      pickAddressName: (data.supplement || {}).pickAddressName,
      pickContact: (data.supplement || {}).pickContact,
      pickTel: (data.supplement || {}).pickTel,
      weights,
      packages,
      volumes,
      value,
      currencyId: (data.um || {}).currencyId,
      currencyName: (data.um || {}).currencyName,
      umVolume: (data.um || {}).umVolume,
      umWeight: (data.um || {}).umWeight,
      countryToIds
    }
  }
  private getPlanList() {
    this.selectLoading = true
    const params:any = {
      page: 1,
      size: 9999,
      model: {
        params: {
          conveyance: this.orderForm.type,
          countryToId: this.orderForm.countryToIds,
          portsToId: this.orderForm.destinationId
        }
      }
    }
    getDeliveryList(params)
      .then((res: any) => {
        const data = res.data || {}
        const arr = data.result || []
        this.planList = arr.filter((it: any) => it.ifSo === 0 && it.status === 0)
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private getSupplierList() {
    this.selectLoading = true
    const params: any = {
      typeId: '06',
      cas: 'S',
      page: 1,
      size: 9999
    }
    getSupplierList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.supplierList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private async onPlan() {
    const itemP = this.planList.find((it: any) => this.planForm.planId === `${it.id}`) || {}
    if (Object.keys(itemP).length <= 0) {
      this.boxForm = {}
      this.planForm = paramsPlan()
      this.containerList = []
      return
    }
    this.containerList = []
    this.planForm.type = itemP.type // 业务类型
    this.planForm.bscId = itemP.bscId
    this.planForm.bscName = itemP.bscName
    this.planForm.containerId = itemP.containerId
    this.planForm.containerName = itemP.containerName
    this.planForm.dispatch = itemP.dispatch
    this.planForm.shippingDate = dayjs(itemP.shipDate).format('YYYY-MM-DD HH:mm:ss')
    this.planForm.cutoffDate = dayjs(itemP.cutoffDate).format('YYYY-MM-DD HH:mm:ss')
    this.planForm.transitTime = itemP.transTime
    this.planForm.serviceName = itemP.serviceName
    this.planForm.serviceId = itemP.serviceId
    this.planForm.supplyId = itemP.supplyId
    this.planForm.fbastore = {
      key: itemP.fbastoreId,
      value: itemP.fbastoreName
    }
    this.boxForm.quantity = itemP.quantity || 1
    // 获取订舱信息
    try {
      this.loading = true
      // 获取so、航空单号
      if (this.planForm.planId && this.planForm.type !== '4') {
        const resI = await getSoByPlanId({
          planId: parseInt(this.planForm.planId, 0),
          type: this.planForm.type === '0' ? '1' : '0'
        })
        this.soList = resI.data || []
      }
      // 获取订舱信息
      let itemB: any = {}
      if (String(this.planForm.bscId)) {
        const resB = await getBSCDetailById({ id: this.planForm.bscId })
        itemB = resB.data || {}
      }
      this.bscObj = itemB
      if (Object.keys(itemB).length > 0) {
        this.planForm.serviceCode = itemB.serviceCode
        this.planForm.transType = itemB.transType
        this.planForm.originPort = {
          key: itemB.portsFromId,
          value: itemB.portsFromName
        }
        this.planForm.targetPort = {
          key: itemB.portsToId,
          value: itemB.portsToName
        }
        this.planForm.originCountry = {
          key: itemB.countryFromId,
          value: itemB.countryFromName
        }
        this.planForm.targetCountry = {
          key: itemB.countryToId,
          value: itemB.countryToName
        }
      }
      // 获取柜型车型航空板信息
      let func: any = null
      const params: any = {
        page: 1,
        size: 9999
      }
      if (this.planForm.type === '0') {
        params.model = {}
        func = getAviationList
      } else if (this.planForm.type === '1' || this.planForm.type === '2') {
        func = getCabinetList
      } else if (this.planForm.type === '4') {
        func = getVehicleTypeList
      } else {
        this.loading = false
        return false
      }
      const resF = await func(params)
      const arrF = (resF.data || {}).result || []
      const itemF = arrF.find((it: any) => this.planForm.containerId === `${it.id}`) || {}
      if (this.planForm.type !== '0' && Object.keys(itemF).length > 0) {
        this.boxForm.volume = itemF.volume
        this.boxForm.umLength = itemF.umLength
        this.boxForm.umVolume = itemF.umVolume
        this.boxForm.containerId = itemF.id
        this.boxForm.containerName = itemF.name
        this.boxForm.loadLimit = itemF.loadLimit
        this.boxForm.umWeight = itemF.umWeight
      }
      this.setTable()
      this.loading = false
    } catch (error) {
      this.loading = false
      return error
    }
  }

  private setTable() {
    if (this.boxForm.quantity > 0 && this.soList.length > 0) {
      let num = 0
      while (num < this.boxForm.quantity && num < this.soList.length && num < 1) {
        this.containerList.push({
          id: `${num}`,
          SO: this.soList[num],
          containerId: this.boxForm.containerId,
          containerName: this.boxForm.containerName,
          volume: 0,
          weight: 0,
          maxVolume: this.boxForm.volume,
          maxWeight: this.boxForm.loadLimit,
          umLength: this.boxForm.umLength,
          umWeight: this.boxForm.umWeight,
          children: []
        })
        num++
      }
    } else {
      this.containerList = []
      return
    }
    // 货柜装载订单组合
    this.containerList[0].children = [this.shipData]
    this.volumeWeightChange()
  }
  private volumeWeightChange() {
    // 重组数组总体积总重量计算
    this.containerList.map((c: any, i: any) => {
      c.weight = 0
      c.volume = 0
      let countV: number = 0
      let countW: number = 0
      c.children.map((o: any, j: any) => {
        const um = o.um || {}
        // 体积
        const volO = (this as any).$getVolumeUnitByLengthUnit(um.umLength)
        const volC = (this as any).$getVolumeUnitByLengthUnit(c.umLength)
        const numV = (this as any).$volumeConversion(o.volumes, volO, volC, 3)
        const lenV = String(numV).length
        const lenCV = String(c.volume).length
        const lenMaxC = lenV > lenCV ? lenV : lenCV
        const mathPV = numV * Math.pow(10, lenMaxC)
        countV += parseFloat((mathPV / Math.pow(10, lenMaxC)).toFixed(3))
        // 重量（以体积为主，重量不做超载判断）
        const weiO = (this as any).$fomatWeightKey(um.umWeight)
        const weiC = (this as any).$fomatWeightKey(c.umWeight)
        const numW = (this as any).$volumeConversion(o.weights, weiO, weiC, 3)
        const lenW = String(numW).length
        const lenCW = String(c.weight).length
        const lenMaxW = lenW > lenCW ? lenV : lenCW
        const mathPW = numW * Math.pow(10, lenMaxW)
        countW += parseFloat((mathPW / Math.pow(10, lenMaxW)).toFixed(3))
      })
      c.volume = Math.round(countV * 1000) / 1000
      c.weight = Math.round(countW * 1000) / 1000
    })
  }

  private async setRow(row: any) {
    try {
      this.loading = true
      const res = await getShipById({ id: row.id })
      const data = res.data || {}
      const { deliveryWay, mode, org, draft, planId, bsc, containers, fillQueryParm, address, warehouses, truckSupplier, ...obj } = data
      const orderList = ((containers || [])[0] || {}).orders || []
      const containerInfo = ((containers || [])[0] || {}).containerInfo || {}
      const jsonObj = JSON.parse(JSON.stringify(containerInfo))
      jsonObj.children = orderList
      this.containerList = [jsonObj]
      this.shipData = orderList[0] || {}
      this.keyCode = this.shipData.code
      this.setOrderForm()
      this.jsonRow = JSON.parse(JSON.stringify(data))
      this.jsonPId = JSON.parse(JSON.stringify(planId))
      this.bscObj = JSON.parse(JSON.stringify(bsc))
      this.planForm = {
        ...obj,
        planId,
        dispatch: deliveryWay,
        transType: (bsc || {}).transType,
        bscName: (bsc || {}).name,
        serviceCode: (bsc || {}).serviceCode,
        containerName: (((data.containers || [])[0] || {}).containerInfo || {}).containerName,
        serviceId: (data.org || {}).key,
        serviceName: (data.org || {}).value,
        custId: (data.truckSupplier || {}).key,
        custName: (data.truckSupplier || {}).value
      }

      this.getPlanList()
      this.getSupplierList()
      this.loading = false
    } catch (error) {
      this.loading = false
    }
  }
  private handleSave(row: any) {
    if (!this.orderForm.type) {
      this.$message.error('请选择原单号')
      return
    }
    if (!this.planForm.planId) {
      this.$message.error('请选择发货计划')
      return
    }
    if (!this.planForm.custId) {
      this.$message.error('请选择拖车供应商')
      return
    }
    if (this.containerList.length <= 0) {
      this.$message.error('暂无so号或航空单号')
      return
    }
    const isStr = (this as any).isStr
    let params: any = {}
    if (isStr === 'v' && this.jsonPId === this.planForm.planId) { // 编辑不修改状态
      params = this.jsonRow
    } else {
      const { dispatch, custId, custName, serviceId, serviceName, ...obj } = this.planForm
      const arrC = this.containerList.map((it: any) => {
        const { children, ...info } = it
        return {
          containerInfo: {
            ...info
          },
          orders: it.children
        }
      })
      params = {
        deliveryWay: dispatch,
        mode: '2',
        bsc: this.bscObj,
        org: {
          key: serviceId,
          value: serviceName
        },
        draft: false,
        containers: arrC,
        fillQueryParm: {},
        address: {},
        warehouses: [],
        truckSupplier: {
          key: custId,
          value: custName
        },
        ...obj
      }
    }
    this.loading = true
    updateShip(params)
      .then((res: any) => {
        this.loading = false
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.goBack()
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private goBack() {
    this.keyCode = ''
    this.planForm = paramsPlan()
    this.orderForm = paramsOrder()
    this.$emit('back')
  }
}
</script>

<style lang="scss" scoped>
.header-title {
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  h3 {
    color: #909399;
    font-weight: 400;
    font-size: 16px;
  }
}
.form-span {
  display: inline-block;
  width: 12.5%;
}

</style>
