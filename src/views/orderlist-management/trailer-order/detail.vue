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
          <el-form-item
            label="拖车类型："
          >
            <span v-if="form.type === 0">
              进口拖车
            </span>
            <span v-else-if="form.type === 1">
              出口拖车
            </span>
          </el-form-item>
          <el-form-item
            v-if="form.type === 0"
            label="卸货方式："
          >
            <span v-if="form.mode === '1'">
              等货卸货
            </span>
            <span v-else-if="form.mode === '2'">
              到场卸货
            </span>
          </el-form-item>
          <el-form-item
            label="付款方式："
          >
            <span v-if="form.pay === '0'">
              现金
            </span>
            <span v-else-if="form.pay === '1'">
              电子支付
            </span>
            <span v-else-if="form.pay === '2'">
              支票
            </span>
          </el-form-item>
          <div v-if="form.type === 0">
            <el-form-item
              label="起运港："
            >
              {{ form.export }}
            </el-form-item>
            <el-form-item
              label="取货时间："
            >
              {{ form.pickTime }}
            </el-form-item>
          </div>
          <el-form-item
            v-if="form.type === 0"
            label="入仓号："
          >
            {{ form.warehouseNo }}
          </el-form-item>

          <el-form-item
            v-if="form.type === 0"
            label="入仓时间："
          >
            {{ form.warehouseTime }}
          </el-form-item>
          <el-form-item
            v-if="form.type === 1"
            label="还柜地址："
          >
            {{ form.export }}
          </el-form-item>

          <el-form-item
            v-if="form.type === 1"
            label="补料时间："
          >
            {{ form.xxx }}
          </el-form-item>
          <el-form-item
            label="过磅类型："
          >
            <span v-if="form.poundType === '0'">
              重磅过磅
            </span>
            <span v-else-if="form.poundType === '1'">
              轻磅过磅
            </span>
          </el-form-item>
          <el-form-item
            label="备注："
            style="width: 100%;"
          >
            {{ form.remake }}
          </el-form-item>
        </div>

        <div
          v-if="form.type === 0"
          class="form-title"
        >
          收货人信息
        </div>
        <div
          v-if="form.type === 0"
          style="padding: 0 20px;"
        >
          <el-form-item
            label="联系人："
          >
            {{ form.harvestMan }}
          </el-form-item>
          <el-form-item
            label="联系电话："
          >
            {{ form.harvestPhone }}
          </el-form-item>
          <el-form-item
            label="联系邮箱："
          >
            {{ form.harvestMail }}
          </el-form-item>
          <el-form-item
            label="联系地址："
            style="width: 100%;"
          >
            {{ form.harvestAdd }}
          </el-form-item>
          <el-form-item
            label="详细地址："
            style="width: 100%;"
          >
            {{ form.harvestCountry + ' ' + form.harvestProvince + ' ' + ' ' + form.harvestCity + ' ' + form.harvestAdd }}
          </el-form-item>
          <el-form-item
            label="邮编："
          >
            {{ form.harvestPostcode }}
          </el-form-item>
          <el-form-item
            label="公司："
          >
            {{ form.harvestCompany }}
          </el-form-item>
        </div>

        <div
          v-if="form.type === 1"
          class="form-title"
        >
          装柜地址
        </div>
        <div
          v-if="form.type === 1"
          style="padding: 0 20px;"
        >
          <el-collapse accordion>
            <el-collapse-item
              v-for="(item, index) in goodsData"
              :key="index"
            >
              <template slot="title">
                <span>地址{{ index + 1 }}</span>
                <span
                  v-if="item.sortPacking"
                  style="margin:0 10px"
                >
                  装载次序 {{ item.sortPacking }}
                </span>
                <span v-if="item.volume">
                  装载体积 {{ item.volume }} m³
                </span>
                <!--入仓号：{{ item.packOrder }}-->
              </template>
              <div>
                <el-form-item label="工厂/仓库：">
                  {{ item.warehouse }}
                </el-form-item>
                <el-form-item
                  label="联系人："
                >
                  {{ item.contact }}
                </el-form-item>
                <el-form-item
                  label="联系电话："
                >
                  {{ item.tel }}
                </el-form-item>
                <el-form-item
                  label="联系地址："
                  style="width: 100%;"
                >
                  {{ item.address }}
                </el-form-item>
                <el-form-item
                  label="详细地址："
                  style="width: 100%;"
                >
                  {{ `${item.countryName || ''} ${item.stateName || ''} ${item.cityName || ''} ${item.address || ''}` }}
                </el-form-item>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <div class="form-title">
          货物信息
        </div>
        <div style="padding: 0 20px;">
          <el-form-item label="柜型：">
            {{ form.cabinetType }}
          </el-form-item>
          <el-form-item label="SO号：">
            {{ soNum }}
          </el-form-item>
          <el-form-item label="柜数：">
            {{ form.cabinetNumber }}
          </el-form-item>
          <el-form-item label="总货值：">
            {{ form.trailerValue }}
          </el-form-item>
          <el-form-item label="总件数：">
            {{ form.total }}
          </el-form-item>
          <el-form-item label="总重量：">
            {{ form.weight }} {{ $fomatWeight(form.umWeight) }}
          </el-form-item>
          <el-form-item label="总体积：">
            {{ $volumeConversion(form.volume, 'CBCM', 'CBM') }} m³
          </el-form-item>
          <el-form-item
            label="货物描述："
            style="width: 100%;"
          >
            {{ form.trailerDescribe }}
          </el-form-item>
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
  getContainerByOrder
} from '@/api/orderlist-at-trailer'
import dayjs from 'dayjs'
@Component({
  name: 'detail',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private detailLoading: boolean = false
  private form: any = {}
  private goodsData: any[] = []
  private soNum: any = ''
  /** computed */
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }

  /* 方法 */
  private setData(row: any) {
    const { id } = row
    this.soNum = (row.soCodes || []).join(',')
    this.getDetail(id)
  }

  private getDetail(id: string): void {
    // 查询
    this.detailLoading = true
    getOrderDetails({
      id
    })
      .then((res: any) => {
        const data = res.data || {}
        const { list, trailerOrder } = data
        this.form = trailerOrder || {}
        this.goodsData = list || []
        // this.getContainerList(id)
        this.detailLoading = false
      })
      .catch((err: any) => {
        this.detailLoading = false
        this.$emit('back')
        return [null, err]
      })
  }
  private getContainerList(id: any) {
    const params = {
      trailerId: id
    }
    this.detailLoading = true
    getContainerByOrder(params).then((res: any) => {
      this.detailLoading = false
      const data = res.data || []
      this.goodsData = data.reduce((list: any[], c: any) => {
        const packList: any[] = c.packList || []
        packList.forEach((e: any) => {
          list.push(e)
        })
        return list
      }, [])
    }).catch(() => {
      this.detailLoading = false
      this.goodsData = []
      this.$emit('back')
    })
  }
  private timeSplice(val: any, num: any) {
    if (num === '1') {
      return val ? dayjs(val).format('YYYY-MM-DD') : ''
    } else if (num === '2') {
      return val ? dayjs(val).format('HH:mm:ss') : ''
    }
  }
  private volumesFilter(vol: any, len: any) {
    if (len === 'CM') {
      return (vol * 0.000001).toFixed(3)
    } else if (len === 'M') {
      return (vol).toFixed(3)
    } else if (len === 'INCH') {
      return (vol * 0.0000164).toFixed(3)
    } else if (len === 'FT') {
      return (vol * 0.0283168).toFixed(3)
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
</style>
