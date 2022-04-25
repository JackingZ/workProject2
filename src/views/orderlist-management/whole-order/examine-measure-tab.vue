<template>
  <div
    v-loading="detailLoading"
  >
    <div class="detail-back">
      <el-radio-group
        v-model="pageName"
        size="small"
        @change="pageChange"
      >
        <el-radio-button label="0">
          计量详情
        </el-radio-button>
        <el-radio-button label="1">
          验货详情
        </el-radio-button>
      </el-radio-group>
      <span
        style="cursor: pointer;"
        @click="goBack"
      >
        <i class="el-icon-back" />
        <span>返回</span>
      </span>
    </div>
    <ExamineDetail
      v-show="pageName === '1'"
      ref="ExamineDetail"
      @setload="setLoading"
    />
    <MeasureDetail
      v-show="pageName === '0'"
      ref="MeasureDetail"
      @setload="setLoading"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  getOrderDetails
} from '@/api/orderlist-at-whole'
import ExamineDetail from '@/views/orderlist-management/whole-order/examine-detail.vue'
import MeasureDetail from '@/views/orderlist-management/whole-order/measure-detail.vue'

@Component({
  name: 'measure',
  components: {
    ExamineDetail,
    MeasureDetail
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private row: any = {}
  private pageName: string = '0'
  private detailLoading: boolean = false

  /* methods */
  private setLoading(bool: boolean) {
    this.detailLoading = bool
  }
  private setData(row: any, type?: string) {
    if (type === 'EXAMINE') {
      this.pageName = '1'
    }
    this.detailLoading = true
    getOrderDetails({ id: (row || {}).id || '' }).then((res: any) => {
      this.row = res.data || {}
      this.pageChange()
      this.detailLoading = false
    }).catch(() => {
      this.detailLoading = false
      this.goBack()
    })
  }
  private pageChange() {
    if (this.pageName === '1') {
      const examineDetail: any = this.$refs.ExamineDetail
      examineDetail.setData(this.row)
    } else {
      const measureDetail: any = this.$refs.MeasureDetail
      measureDetail.setData(this.row)
    }
  }
  private goBack() {
    this.pageName = '0'
    this.row = {}
    this.$emit('back')
  }
}
</script>

<style lang="scss" scoped>
.detail-back {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 20px;
  border-bottom: 1px solid #e8e8e8;
  background-color: #fff;
}
</style>
