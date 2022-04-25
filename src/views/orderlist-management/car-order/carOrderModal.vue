<template>
  <div>
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
      <div v-loading="loading">
        <div class="modal-top">
          <div class="top-info-item">
            <div class="label">
              联系人：
            </div>
            <div class="value">
              {{ form.consignor }}
            </div>
          </div>
          <div class="top-info-item">
            <div class="label">
              联系电话：
            </div>
            <div class="value">
              {{ form.consignorPhone }}
            </div>
          </div>
          <div class="top-info-item">
            <div class="label">
              总重量：
            </div>
            <div class="value">
              {{ $volumeConversion(cardOrder.weight, cardOrder.umWeight, 'KGS') }} kg
            </div>
          </div>
          <div class="top-info-item">
            <div class="label">
              总体积：
            </div>
            <div class="value">
              {{ $volumeConversion(cardOrder.volume, $getVolumeUnitByLengthUnit(cardOrder.umLength), 'CBM') }} m³
            </div>
          </div>
          <!--<div class="top-info-item">-->
          <!--<div class="label">-->
          <!--其他：-->
          <!--</div>-->
          <!--<div class="value">-->
          <!--{{ form.remark }}-->
          <!--</div>-->
          <!--</div>-->
          <div class="top-info-item w50">
            <div
              class="label"
              style="white-space: nowrap"
            >
              装货地址：
            </div>
            <div class="value">
              {{ form.consignorAdd }}
            </div>
          </div>
          <div class="top-info-item w50">
            <div class="label">
              其他备注：
            </div>
            <div class="value">
              {{ cardOrder.remark }}
            </div>
          </div>
        </div>
        <div class="card-list">
          <el-form
            ref="form"
            :model="cardListForm"
            size="mini"
            label-width="70px"
            label-position="left"
            class="card-form"
          >
            <el-form-item
              label="数量"
              prop="cardNum"
            >
              <el-input-number
                v-model="cardListForm.cardNum"
                class="input-number-valiate"
                :controls="false"
                placeholder="请输入"
                :min="1"
                :max="999999"
                @change="cardNumChange"
              />
            </el-form-item>
            <el-row
              v-for="(e, index) in cardListForm.list"
              :key="index"
              :gutter="10"
            >
              <el-col :span="2">
                <div style="font-size: 14px;color: #606266;font-weight: 400;height: 28px;line-height: 28px">
                  {{ '车辆' + (index + 1) }}
                </div>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="服务"
                  :prop="'list.' + index + '.goodsId'"
                  label-width="50px"
                  :rules="{required: true, message: '请选择服务', trigger: 'change'}"
                >
                  <el-radio-group v-model="cardListForm.list[index].goodsId">
                    <el-radio
                      v-for="item in typeList"
                      :key="item.id"
                      :label="item.id"
                    >
                      {{ item.name }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="车辆"
                  :prop="'list.' + index + '.plateNumber'"
                  label-width="50px"
                  :rules="{required: true, message: '请选择车辆', trigger: 'change'}"
                >
                  <el-select
                    v-model="cardListForm.list[index].plateNumber"
                    placeholder="请选择车辆"
                    size="mini"
                    clearable
                    filterable
                    @change="selectChange"
                  >
                    <el-option
                      v-for="item in carList"
                      :key="item.plateNumber"
                      :label="item.driverName + '-' + item.plateNumber"
                      :value="item.plateNumber"
                      :disabled="item.disabled"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                :span="6"
                style="text-align: right"
              >
                <el-button
                  v-if="index === 0"
                  type="primary"
                  size="mini"
                  @click="confirm"
                >
                  确认分配
                </el-button>
                <el-button
                  v-else
                  type="text"
                  size="mini"
                  @click="handlerDel(index)"
                >
                  删除
                </el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="container">
          <div class="car-container">
            <div class="car-list">
              <el-scrollbar
                wrap-class="car-el-scrollbar-wrap"
                view-class="car-el-scrollbar-view"
                style="height: 100%"
              >
                <div
                  v-for="(item, i) in carList"
                  :key="item.plateNumber"
                  class="car-item"
                  :class="{active: item.plateNumber === selectDriver.plateNumber, recommend: i === 0}"
                  @click="getCarList(item)"
                >
                  <div class="number">
                    {{ item.plateNumber }}
                  </div>
                  <div class="name">
                    {{ item.driverName }}
                  </div>
                  <div
                    class="status"
                    :class="'status' + item.workStatus"
                  />
                </div>
              </el-scrollbar>
            </div>
            <div class="car-bottom">
              <span>点击查看司机详细信息。已选择：</span>
              <span>{{ selectDriver.plateNumber }}</span>
            </div>
          </div>
          <div
            id="map-container"
            class="map-container"
          />
        </div>
        <div class="driver">
          <div class="title">
            {{ selectDriver.plateNumber }}
          </div>
          <div class="driver-info">
            <div class="driver-info-item">
              <span class="label">司机：</span>
              <span class="value">{{ selectDriver.driverName }}</span>
            </div>
            <div class="driver-info-item">
              <span class="label">联系电话：</span>
              <span class="value">{{ selectDriver.phone }}</span>
            </div>
            <div class="driver-info-item">
              <span class="label">证件类型：</span>
              <span
                v-if="selectDriver.certType === 0"
                class="value"
              >身份证</span>
              <span
                v-if="selectDriver.certType === 1"
                class="value"
              >护照</span>
              <span
                v-if="selectDriver.certType === 2"
                class="value"
              >港澳通行证</span>
              <span
                v-if="selectDriver.certType === 3"
                class="value"
              >其他</span>
            </div>
            <div class="driver-info-item">
              <span class="label">证件号码：</span>
              <span class="value">{{ selectDriver.certNo }}</span>
            </div>
            <!--<div class="driver-info-item">-->
            <!--<span class="label">状态：</span>-->
            <!--<span class="value">士大夫</span>-->
            <!--</div>-->
            <!--<div class="driver-info-item">-->
            <!--<span class="label">是否有跟车：</span>-->
            <!--<span class="value">士大夫</span>-->
            <!--</div>-->
            <div class="driver-info-item">
              <span class="label">是否带尾板：</span>
              <span class="value">{{ selectDriver.tailboard ? '是' : '否' }}</span>
            </div>
            <div class="driver-info-item company">
              <div class="label">
                所属公司：
              </div>
              <div class="value">
                {{ selectDriver.custName }}
              </div>
            </div>
          </div>
        </div>
        <div class="driver-order">
          <div class="title">
            订单实况
          </div>
          <div class="order-table">
            <el-table
              v-loading="tableLoading"
              :data="tableData"
              style="width: 100%;margin: 10px 0;"
              max-height="400px"
              border
            >
              <el-table-column
                prop="number"
                label="原单号"
                min-width="180"
              />
              <el-table-column
                prop="volume"
                label="提货方数"
                min-width="180"
              >
                <template slot-scope="scope">
                  {{ $volumeConversion(scope.row.volume, $getVolumeUnitByLengthUnit(scope.row.vunit), 'CBM') }} m³
                </template>
              </el-table-column>
              <el-table-column
                prop="deliveryTime"
                label="提货时间"
                min-width="180"
              />
              <el-table-column
                prop="estimateTime"
                label="预计到达"
                min-width="180"
              />
              <el-table-column
                prop="orderStatus"
                label="订单状态"
                min-width="180"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.orderStatus === '0'">待处理</span>
                  <span v-if="scope.row.orderStatus === '1'">已完成</span>
                  <span v-if="scope.row.orderStatus === '2'">已取消</span>
                  <span v-if="scope.row.orderStatus === '3'">
                    <span v-if="scope.row.presentStatus === '0' && scope.row.completeStatus === '0' && scope.row.deliveryStatus === '0'">进行中(司机未到场)</span>
                    <span v-if="scope.row.presentStatus === '1' && scope.row.completeStatus === '0' && scope.row.deliveryStatus === '0'">进行中(司机已到场)</span>
                    <span v-if="scope.row.presentStatus === '1' && scope.row.completeStatus === '1' && scope.row.deliveryStatus === '0'">进行中(已装车)</span>
                    <span v-if="scope.row.presentStatus === '1' && scope.row.completeStatus === '1' && scope.row.deliveryStatus === '1'">进行中(运输中)</span>
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getCar, save, getServiceSubtypeList } from '@/api/orderlist-at-car'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'CarOrderModal'
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private tableData: any[] = []
  private carList: any[] = []
  private tableLoading: boolean = false
  private form: any = {}
  private cardListForm: any = {
    cardNum: 1,
    list: [
      {
        goodsId: '',
        plateNumber: ''
      }
    ]
  }
  private cardOrder: any = {}
  private myMap: any = {}
  private pathSimplifierIns: any = null
  private selectDriver: any = {}
  private pathList: any[] = []
  private typeList: any[] = []

  /* computed */
  get userInfo(): any {
    return UserModule.info || {}
  }

  /* methods */
  private selectChange() {
    this.carList = this.carList.map((item: any) => {
      item.disabled = false
      if (this.cardListForm.list.find((e: any) => e.plateNumber === item.plateNumber)) {
        item.disabled = true
      }
      return item
    })
  }

  private handlerDel(index: number) {
    this.cardListForm.list.splice(index, 1)
  }

  private cardNumChange(currentValue: number) {
    const length = this.cardListForm.list.length
    if (currentValue > length) {
      for (let i = 0; i < (currentValue - length); i++) {
        this.cardListForm.list.push({
          goodsId: '',
          plateNumber: ''
        })
      }
    }
    if (currentValue < length) {
      for (let i = 0; i < (length - currentValue); i++) {
        this.cardListForm.list.pop()
      }
    }
  }

  private initMap() {
    const that = this
    const AMap = (window as any).AMap
    that.myMap = new AMap.Map('map-container', {
      zoom: 15
    })
  }

  private async getSubtypeList() {
    this.loading = true
    await getServiceSubtypeList({ typeId: '01' }).then((res: any) => {
      this.loading = false
      if (res.success) {
        this.typeList = res.data || []
      }
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }

  private confirm() {
    const form: any = this.$refs.form
    form.validate((valid: any) => {
      if (valid) {
        const params = {
          id: this.cardOrder.id,
          source: this.cardOrder.source,
          list: this.cardListForm.list.map((item: any) => {
            const selectDriver = this.carList.find((e: any) => e.plateNumber === item.plateNumber) || {}
            const type = this.typeList.find((e: any) => e.id === item.goodsId) || {}
            return {
              goodsId: item.goodsId,
              goodsName: type.name,
              operationUser: this.userInfo.id,
              operationPhone: this.userInfo.phone,
              custId: selectDriver.custId,
              custName: selectDriver.custName,
              driverId: selectDriver.driverId,
              driverName: selectDriver.driverName,
              phone: selectDriver.phone,
              plateNumber: selectDriver.plateNumber,
              cardType: selectDriver.cardType,
              userId: selectDriver.userId,
              estimateTime: this.cardOrder.planTime,
              orderCode: this.cardOrder.orderCode
            }
          })
        }
        this.loading = true
        save(params).then((res: any) => {
          this.loading = false
          if (res.success) {
            this.$message.success('分配车辆成功，请从卡派订单中查询对应的采购单！')
            this.modalClose()
          }
        }).catch(err => {
          this.loading = false
          return err
        })
      }
    })
  }

  private showOrderPath() {
    const that = this
    if (that.pathSimplifierIns) {
      // 设置数据
      that.pathSimplifierIns.setData(that.pathList)
      // 对第一条线路（即索引 0）创建一个巡航器
      const navgList = that.pathList.map((path: any, index: number) => {
        return that.pathSimplifierIns.createPathNavigator(index, {
          loop: true, // 循环播放
          speed: 10000 // 巡航速度，单位千米/小时
          // pathNavigatorStyle: {
          //   content: 'none'
          // }
        })
      })
      navgList.forEach((item: any) => {
        item.start()
      })
      return
    }
    const AMapUI = (window as any).AMapUI
    AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], (PathSimplifier: any, $: any) => {
      if (!PathSimplifier.supportCanvas) {
        alert('当前环境不支持 Canvas！')
        return
      }
      that.pathSimplifierIns = new PathSimplifier({
        zIndex: 100,
        // autoSetFitView:false,
        map: that.myMap, // 所属的地图实例
        getPath: (pathData: any, pathIndex: any) => {
          return pathData.path
        },
        getHoverTitle: (pathData: any, pathIndex: any, pointIndex: any) => {
          if (pointIndex === 0) {
            // point
            return '装货位置'
          }
          if (pointIndex === 1) {
            // point
            return '目的地'
          }
          return '原单号：' + pathData.name
        },
        renderOptions: {
          renderAllPointsIfNumberBelow: 100 // 绘制路线节点，如不需要可设置为-1
        }
      })
      // 设置数据
      that.pathSimplifierIns.setData(that.pathList)
      // 对第一条线路（即索引 0）创建一个巡航器
      const navgList = that.pathList.map((path: any, index: number) => {
        return that.pathSimplifierIns.createPathNavigator(index, {
          loop: true, // 循环播放
          speed: 10000 // 巡航速度，单位千米/小时
          // pathNavigatorStyle: {
          //   content: 'none'
          // }
        })
      })
      navgList.forEach((item: any) => {
        item.start()
      })
    })
    that.myMap.zoomOut()
  }

  private async show(row: any) {
    const form = row.cardOrder || {}
    this.cardOrder = row.cardOrder || {}
    this.tableData = []
    this.cardListForm = {
      cardNum: 1,
      list: [
        {
          goodsId: '',
          plateNumber: ''
        }
      ]
    }
    await this.getSubtypeList()
    this.form = {
      consignor: row.cardPackingList[0] ? (row.cardPackingList[0].consignor || form.warehouseContact) : '',
      consignorPhone: row.cardPackingList[0] ? (row.cardPackingList[0].consignorPhone || form.warehouseTel) : '',
      consignorAdd: row.cardPackingList[0] ? (row.cardPackingList[0].consignorAdd || form.warehouseAddress) : ''
    }
    this.getCarList()
    this.$nextTick(() => {
      const formDom: any = this.$refs.form
      formDom.clearValidate()
      this.initMap()
    })
  }

  private selectDriverClick(driver: any) {
    this.pathList = []
    this.selectDriver = driver
    this.tableData = driver.orderList
    const cardOrderPath = []
    if (this.cardOrder.packLongitudeLatitude) {
      const packLongitudeLatitude = this.cardOrder.packLongitudeLatitude.split(',').map((e: any) => {
        return Number(e)
      })
      cardOrderPath.push(packLongitudeLatitude)
    }
    if (this.cardOrder.warehouseLongitudeLatitude) {
      const harvestLongitudeLatitude = this.cardOrder.warehouseLongitudeLatitude.split(',').map((e: any) => {
        return Number(e)
      })
      cardOrderPath.push(harvestLongitudeLatitude)
    }
    this.pathList.push({
      name: this.cardOrder.number,
      path: cardOrderPath
    })
    if (driver.orderList && driver.orderList.length) {
      driver.orderList.forEach((item: any) => {
        const path = []
        if (item.startLongitudeLatitude) {
          const packLongitudeLatitude = item.startLongitudeLatitude.split(',').map((e: any) => {
            return Number(e)
          })
          path.push(packLongitudeLatitude)
        }
        if (item.objectiveLongitudeLatitude) {
          const harvestLongitudeLatitude = item.objectiveLongitudeLatitude.split(',').map((e: any) => {
            return Number(e)
          })
          path.push(harvestLongitudeLatitude)
        }
        if (item.startLongitudeLatitude && item.objectiveLongitudeLatitude) {
          this.pathList.push({
            name: item.number,
            path
          })
        }
      })
    }
    this.$nextTick(() => {
      this.showOrderPath()
    })
  }

  private modalClose() {
    this.$emit('load')
    this.pathList = []
    this.pathSimplifierIns = null
    this.$emit('back')
  }

  private getCarList(driver?: any) {
    const params = {
      longitudeLatitude: this.cardOrder.packLongitudeLatitude,
      packDate: this.cardOrder.planTime
    }
    this.loading = true
    getCar(params).then((res: any) => {
      this.loading = false
      if (res.success) {
        // distance
        const list = res.data.filter((a: any) => a.distance === -1)
        const carList = res.data.filter((a: any) => a.distance !== -1).sort((a: any, b: any) => a.distance - b.distance).sort((a: any, b: any) => b.workStatus - a.workStatus)
        this.carList = [...carList, ...list]
        let data = this.carList[0] || {}
        if (driver) {
          data = this.carList.find((item: any) => item.plateNumber === driver.plateNumber) || {}
        }
        this.selectDriverClick(data)
      }
    }).catch((err: any) => {
      this.loading = false
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
    background-color: #ffffff;
  }
  .modal-top{
    width: 100%;
    background: #f5f5f5;
    border-radius: 8px;
    padding: 20px;
    overflow: hidden;
    .top-info-item{
      float: left;
      width: 20%;
      padding-right: 5px;
      display: flex;
      .label{
        color: #909399;
      }
      .value{
        color: #303133;
      }
      &.w50{
        margin-top: 20px;
        width: 50%;
      }
    }
  }
  .card-list{
    padding: 10px 20px;
  }
  .container{
    display: flex;
    margin-top: 20px;
    .car-container{
      flex: 1;
      margin-right: 20px;
      .car-list{
        width: 100%;
        height: 400px;
        border: 1px solid #DBDFE5;
        overflow: hidden;
        /*display: flex;*/
        /*flex-wrap: wrap;*/
        .car-el-scrollbar-wrap{
          width: 100%;
          height: 100%;
          overflow-y: auto;
          padding: 16px 0 0 15px;
        }
        .car-item{
          font-size: 14px;
          cursor: pointer;
          float: left;
          width: 90px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          border: 1px solid #DCDFE6;
          border-radius: 4px;
          margin-right: 20px;
          margin-bottom: 17px;
          position: relative;
          &:nth-child(7n){
            margin-right: 0;
          }
          &.active{
            border-color: #1890ff;
          }
          &.recommend{
            position: relative;
            &:before{
              position: absolute;
              content: '荐';
              width: 28px;
              height: 20px;
              background: #1890ff;
              border-radius: 10px;
              top: -10px;
              right: -14px;
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #FFFFFF;
              text-align: center;
              line-height: 20px;
            }
          }
          .status{
            width: 10px;
            height: 10px;
            border-radius: 50%;
            position: absolute;
            bottom: 5px;
            right: 5px;
            &.status0{
              background: #c0ccda;
            }
            &.status1{
              background: #00ff80;
            }
          }
        }
      }
      .car-bottom{
        width: 100%;
        height: 48px;
        background: #EEEFF4;
        border: 1px solid #DBDFE5;
        border-top: none;
        text-align: right;
        padding: 0 10px;
        line-height: 48px;
        span{
          color: #303133;
        }
      }
    }
    .map-container{
      flex: 1;
      /*height: 450px;*/
      box-shadow: 1px 1px 3px 0 rgba(0, 0, 0, 0.12);
    }
  }

  .driver{
    width: 100%;
    margin-top: 20px;
    .title{
      font-size: 20px;
      font-family: Microsoft YaHei;
      font-weight: 600;
      color: #323232;
    }
    .driver-info{
      padding: 0 20px 20px 20px;
      overflow: hidden;
      .driver-info-item{
        width: 25%;
        float: left;
        margin-top: 20px;
        .label{
          color: #909399;
        }
        .value{
          color: #303133;
        }
        &.company{
          display: flex;
          width: 50%;
          .value{
            flex: 1;
          }
        }
      }
    }
  }

  .driver-order{
    width: 100%;
    .title{
      font-size: 20px;
      font-family: Microsoft YaHei;
      font-weight: 600;
      color: #323232;
    }
  }

  ::v-deep{
    .el-dialog__body{
      padding: 10px 20px;
    }
  }

  ::v-deep{
    .el-scrollbar__wrap{
      overflow-x: hidden !important;
      padding: 16px 0 0 15px;
    }
  }
</style>
