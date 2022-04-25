<template>
  <el-dialog
    title="船期"
    width="600px"
    :close-on-click-modal="false"
    :visible.sync="showSoInfo"
  >
    <div v-loading="showSoInfoLoading">
      <el-row style="margin-bottom: 10px">
        <el-col span="12">
          <span>船名：</span>
          <span>{{ orderSoInfo.freighter }}</span>
        </el-col>
        <el-col span="12">
          <span>船次：</span>
          <span>{{ orderSoInfo.ship }}</span>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col span="12">
          <span>服务机构：</span>
          <span>{{ orderSoInfo.orgName }}</span>
        </el-col>
        <el-col span="12">
          <span>etd：</span>
          <span>{{ orderSoInfo.etd }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col span="12">
          <span>eta：</span>
          <span>{{ orderSoInfo.eta }}</span>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getBookingByCode } from '@/api/orderlist-at-whole'

@Component({
  name: 'order-so-info'
})
export default class extends Vue {
  /* data */
  private showSoInfo: boolean = false
  private showSoInfoLoading: boolean = false
  private orderSoInfo: any = {}

  /* methods */
  private show(row: any) {
    this.showSoInfo = true
    this.showSoInfoLoading = true
    this.orderSoInfo = {}
    getBookingByCode({ code: row.code }).then((res: any) => {
      this.showSoInfoLoading = false
      const data = res.data || []
      this.orderSoInfo = data[0] || {}
    }).catch(() => {
      this.showSoInfoLoading = false
    })
  }
}
</script>

<style lang="scss" scoped></style>
