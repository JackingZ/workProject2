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
      <div class="detail-output">
        <span>出库申请单详细信息</span>
      </div>
      <el-form
        ref="detail"
        :model="form"
        label-width="130px"
        label-position="right"
        class="detail-form"
      >
        <el-form-item label="出库申请单/订单号">
          <span>{{ form.id }}</span>
        </el-form-item>
        <el-form-item label="总箱数">
          <span>{{ form.packages }}</span>
        </el-form-item>
        <el-form-item label="总体积">
          <span>{{ maxVolWeiFormat(form, 'CBM') + ' CBM' }}</span>
        </el-form-item>
        <el-form-item label="总重量">
          <span>{{ maxVolWeiFormat(form, 'KGS') + ' KGS' }}</span>
        </el-form-item>
        <el-form-item label="车/柜型">
          <span>{{ form.deliveryDesc }}</span>
        </el-form-item>
        <el-form-item :label="form.deliveryType === '1' ? '车牌号' : '柜号'">
          <span>{{ (form.supplement || {}).modeNo }}</span>
        </el-form-item>
        <el-form-item label="司机姓名">
          <span>{{ (form.supplement || {}).driver }}</span>
        </el-form-item>
        <el-form-item label="身份证">
          <span>{{ (form.supplement || {}).certNo }}</span>
        </el-form-item>
        <el-form-item label="司机电话">
          <span>{{ (form.supplement || {}).phone }}</span>
        </el-form-item>
        <el-form-item label="仓库">
          <span>{{ (form.warehouse || {}).name }}</span>
        </el-form-item>
        <el-form-item label="出库类型">
          <span v-if="form.type === '0'">发货出库</span>
          <span v-else-if="form.type === '1'">调拨出库</span>
          <span v-else-if="form.type === '2'">退件出库</span>
        </el-form-item>
        <el-form-item label="服务类型">
          <span v-if="form.sourceType === '0'">一件代发</span>
          <span v-else-if="form.sourceType === '1'">仓储</span>
          <span v-else-if="form.sourceType === '2'">散收拼货</span>
          <span v-else-if="form.sourceType === '3'">拆柜打托</span>
        </el-form-item>
        <el-form-item label="审核状态">
          <span v-if="form.audit === '0'">待审核</span>
          <span v-else-if="form.audit === '1'">审核通过</span>
          <span v-else-if="form.audit === '2'">审核拒绝</span>
        </el-form-item>
        <el-form-item label="装载时间">
          <span>{{ form.loadTime }}</span>
        </el-form-item>
        <div v-if="form.audit === '2'">
          <el-form-item label="拒绝原因">
            <span>{{ form.reason }}</span>
          </el-form-item>
        </div>
      </el-form>
      <el-table
        :data="list"
        style="width: 100%;margin: 10px 0;"
        header-align="center"
        align="center"
        border
      >
        <el-table-column
          prop=""
          label="排序"
          width="100px"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="code"
          label="原单号"
        />
        <el-table-column
          prop="volume"
          label="单箱最大尺寸"
        >
          <template slot-scope="scope">
            <span>{{ maxVolWeiFormat(scope.row, 'M') }}</span>&nbsp;
            <span>M</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="weight"
          label="单箱最大重量"
        >
          <template slot-scope="scope">
            <span>{{ maxVolWeiFormat(scope.row, 'KG') }}</span>&nbsp;
            <span>KGS</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="packages"
          label="总箱数"
        />
        <el-table-column
          prop="volumes"
          label="总体积"
        >
          <template slot-scope="scope">
            <span>{{ maxVolWeiFormat(scope.row, 'CBM') }}</span>&nbsp;
            <span>CBM</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="weights"
          label="总重量"
        >
          <template slot-scope="scope">
            <span>{{ maxVolWeiFormat(scope.row, 'KGS') }}</span>&nbsp;
            <span>KGS</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="服务"
        >
          <template>
            <span v-if="form.sourceType === '0'">一件代发</span>
            <span v-else-if="form.sourceType === '1'">纯仓储</span>
            <span v-else-if="form.sourceType === '2'">散收拼货</span>
            <span v-else-if="form.sourceType === '3'">拆柜打托</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getOutputDetail
} from '@/api/warehose-by-config'
@Component({
  name: 'Detail',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private form: any = {
    id: undefined,
    type: undefined,
    audit: undefined,
    warehouseName: undefined,
    weights: undefined,
    volumes: undefined,
    packages: undefined,
    reason: undefined,
    phone: undefined,
    deliveryNo: undefined,
    deliveryDesc: undefined,
    driver: undefined,
    certType: undefined,
    certNumber: undefined,
    loadTime: undefined,
    serviceName: undefined
  }
  private list: any[] = []
  private detailLoading: boolean = false
  private currentId = ''
  /* 方法 */
  private setData(val: any): void {
    // 设置值
    this.currentId = (val || {}).id
    this.getDetail()
  }
  private getDetail(): void {
    // 查询
    this.detailLoading = true
    getOutputDetail({
      id: this.currentId
    })
      .then((res: any) => {
        const data = res.data || {}
        const { dtls, ...obj } = data
        this.list = dtls || []
        this.form = obj || {}
        this.detailLoading = false
      })
      .catch((err: any) => {
        this.detailLoading = false
        return [null, err]
      })
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
  private maxVolWeiFormat(row: any, unit: string) {
    const um = this.form.um || {}
    const umVolume = um.umVolume ? um.umVolume : (this as any).$getVolumeUnitByLengthUnit(um.umLength)
    if (unit === 'CBM') {
      return (this as any).$volumeConversion((row.volumes || 0), umVolume, 'CBM', 3)
    } else if (unit === 'KGS') {
      return (this as any).$volumeConversion((row.weights || 0), um.umWeight, 'KGS', 3)
    } else if (unit === 'M') {
      return (this as any).$volumeConversion((row.volume || 0), um.umLength, 'M', 3)
    } else if (unit === 'KG') {
      return (this as any).$volumeConversion((row.weight || 0), um.umWeight, 'KGS', 3)
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
.detail-output {
  background: rgb(231, 231, 231);
  padding: 0px 20px;
  margin-bottom: 10px;
  line-height: 35px;
  font-size: 16px;
  font-weight: 700;
}
.detail-order {
  padding: 0 20px;
}
.detail-form {
  padding: 0 20px;
  .el-form-item {
    display: inline-block;
    vertical-align: top;
    width: 24.9%;
    margin-bottom: 0;
  }
}

</style>
