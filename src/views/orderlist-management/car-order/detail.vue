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
            />
          </el-row>
        </div>
        <div style="padding: 0 20px;">
          <div style="display: flex;flex-flow: row nowrap;align-items: top;">
            <div style="flex: 1 1 50%;border-right: 1px solid #F1F6FC;">
              <el-form-item
                label="下单客户："
                style="width: 50%;"
              >
                {{ form.customerName }}
              </el-form-item>
              <el-form-item
                label="装货地址："
                style="width: 50%;"
              >
                <span>{{ form.consignorAddPick }}</span>
              </el-form-item>
              <el-form-item
                label="目的地："
                style="width: 50%;"
              >
                <span> {{ form.warehouseAddress }} </span>
              </el-form-item>
              <el-form-item
                label="付款方式："
                style="width: 50%;"
              >
                <span v-if="form.pay === '1'">
                  付款方式1
                </span>
                <span v-if="form.pay === '2'">
                  付款方式2
                </span>
              </el-form-item>
              <el-form-item
                label="取货时间："
                style="width: 100%;"
              >
                &nbsp;<span>{{ form.planTime }}</span>
              </el-form-item>
              <el-form-item
                v-if="form.remark"
                label="备注："
                style="width: 100%;"
              >
                {{ form.remark }}
              </el-form-item>
            </div>
          </div>
        </div>

        <div class="form-title">
          发货人
        </div>
        <div style="padding: 0 20px;">
          <el-form-item
            label="发货人："
          >
            {{ form.consignor }}
          </el-form-item>
          <el-form-item
            label="联系电话："
          >
            {{ form.consignorPhone }}
          </el-form-item>
          <el-form-item
            label="联系地址："
          >
            {{ form.consignorAdd }}
          </el-form-item>
          <el-form-item
            label="邮编："
          >
            {{ form.consignorPostcode }}
          </el-form-item>
          <el-form-item
            label="详细地址："
          >
            <div style="white-space: nowrap">
              {{ form.consignorAddDetails || '' }}
            </div>
          </el-form-item>
        </div>

        <div class="form-title">
          收货人
        </div>
        <div style="padding: 0 20px;">
          <el-form-item
            label="收货人："
          >
            {{ form.harvestMan }}
          </el-form-item>
          <el-form-item
            label="联系电话："
          >
            {{ form.harvestPhone }}
          </el-form-item>
          <el-form-item
            label="联系地址："
          >
            {{ form.harvestCountry }}&nbsp;{{ form.harvestProvince }}&nbsp;{{ form.harvestCity }}
          </el-form-item>
          <el-form-item
            label="邮编："
          >
            {{ form.harvestPostcode }}
          </el-form-item>
          <el-form-item
            label="详细地址："
          >
            <div style="white-space: nowrap">
              {{ form.harvestAdd }}
            </div>
          </el-form-item>
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
            <span v-else>
              --
            </span>
          </el-form-item>
          <el-form-item
            label="车型/柜型："
          >
            <!--<span v-if="form.containerType === '0'">
              零担
            </span>
            <span v-else-if="form.containerType === '1'">
              整车
            </span>
            <span v-else-if="form.containerType === '2'">
              整柜
            </span>-->
            --
          </el-form-item>
          <el-form-item
            label="总件数："
          >
            {{ form.total }}
          </el-form-item>
          <el-form-item
            label="总货值："
          >
            {{ form.cardValue }} {{ form.currencyId }}
          </el-form-item>
          <el-form-item
            label="总重量："
          >
            {{ $volumeConversion(form.weight, form.umWeight, 'KGS') }} kg
          </el-form-item>
          <el-form-item
            label="总体积："
          >
            {{ $volumeConversion(form.volume, $getVolumeUnitByLengthUnit(form.umLength), 'CBM') }} m³
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
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  getOrderDetails,
  getWordsList
} from '@/api/orderlist-at-whole'

@Component({
  name: 'detail',
  components: {},
  props: {
    form: {
      type: Object,
      default: () => ({})
    },
    lineList: {
      type: Array,
      default: () => ([])
    },
    pickList: {
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
  private wordsList: any[] = []
  /** computed */
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }

  /* methods */
  private formatWarehouse(id: any) {
    const list = (this as any).wareList
    let name
    list.map((it: any) => {
      if (it.id === id) {
        name = it.name
      }
    })
    return name
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
