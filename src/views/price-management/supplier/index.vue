<template>
  <div class="supplier-price">
    <price-car
      v-if="priceType === '01'"
      :price-type-list="priceTypeList"
      :price-type="priceType"
      :supplier-list="supplierList"
      @priceTypeChange="priceTypeChange"
    />
    <price-trailer
      v-if="priceType === '06'"
      :price-type-list="priceTypeList"
      :price-type="priceType"
      :supplier-list="supplierList"
      @priceTypeChange="priceTypeChange"
    />
    <price-customs-clearance
      v-if="priceType === '03'"
      :price-type-list="priceTypeList"
      :price-type="priceType"
      :supplier-list="supplierList"
      @priceTypeChange="priceTypeChange"
    />
    <price-warehouse
      v-if="priceType === '04'"
      :price-type-list="priceTypeList"
      :price-type="priceType"
      :supplier-list="supplierList"
      @priceTypeChange="priceTypeChange"
    />
    <price-booking
      v-if="priceType === '02'"
      :price-type-list="priceTypeList"
      :price-type="priceType"
      :supplier-list="supplierList"
      @priceTypeChange="priceTypeChange"
    />
    <price-line
      v-if="priceType === '05'"
      :price-type-list="priceTypeList"
      :price-type="priceType"
      :supplier-list="supplierList"
      @priceTypeChange="priceTypeChange"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PriceCar from '@/views/price-management/supplier/components/price-car.vue'
import PriceTrailer from '@/views/price-management/supplier/components/price-trailer.vue'
import PriceCustomsClearance from '@/views/price-management/supplier/components/price-customs-clearance.vue'
import PriceWarehouse from '@/views/price-management/supplier/components/price-warehouse.vue'
import PriceBooking from '@/views/price-management/supplier/components/price-booking.vue'
import PriceLine from '@/views/price-management/supplier/components/price-line.vue'
import { getSupplierList } from '@/api/jht-supplier-management'

@Component({
  name: 'supplier',
  components: {
    PriceCar,
    PriceTrailer,
    PriceCustomsClearance,
    PriceWarehouse,
    PriceBooking,
    PriceLine
  }
})
export default class Supplier extends Vue {
  /* data */
  private priceType: string = '05'
  private priceTypeList: any[] = [
    {
      value: '05',
      label: '专线报价'
    },
    {
      value: '02',
      label: '订舱报价'
    },
    {
      value: '04',
      label: '仓储报价'
    },
    {
      value: '01',
      label: '卡车报价'
    },
    {
      value: '06',
      label: '拖车报价'
    },
    {
      value: '03',
      label: '报关报价'
    }
  ]
  private supplierList: any[] = []

  /* methods */
  private priceTypeChange(val: any) {
    this.priceType = val
    this.getSupplierList()
  }
  private getSupplierList() {
    const params: any = {
      page: 1,
      size: 999,
      subtypeId: this.priceType
    }
    getSupplierList(params).then((res: any) => {
      const data = res.data || {}
      this.supplierList = data.result || []
    }).catch((err: any) => {
      return err
    })
  }
  private created() {
    this.getSupplierList()
  }
}
</script>

<style scoped>
</style>
