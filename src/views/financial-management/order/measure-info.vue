<template>
  <div
    v-loading="loading"
    class="measure-info"
  >
    <div class="info-total">
      <div class="total-item">
        <span class="label">总件数</span>
        <span class="value">{{ (rowDetail.measure || {}).packages || '--' }}</span>
      </div>
      <div class="total-item">
        <span class="label">总体积(m³)</span>
        <span class="value">{{ $volumeConversion((rowDetail.measure || {}).totalVolume, 'CBCM', 'CBM') || '--' }}</span>
      </div>
      <div class="total-item">
        <span class="label">总实重(kg)</span>
        <span class="value">{{ (rowDetail.measure || {}).totalWeight || '--' }}</span>
      </div>
      <div class="total-item">
        <span class="label">总货值({{ (rowDetail.lscConfig || {}).declaredCurrency }})</span>
        <span class="value">{{ rowDetail.value || '--' }}</span>
      </div>
      <div
        v-if="(((rowDetail.price || {}).billingConfig || {})).type === '0'"
        class="total-item"
      >
        <span class="label">总体积重</span>
        <span class="value">{{ totalVolumeWeight }}</span>
      </div>
      <div
        v-if="(((rowDetail.price || {}).billingConfig || {})).type === '1'"
        class="total-item"
      >
        <span class="label">总重量体积</span>
        <span class="value">{{ totalVolumeWeight }}</span>
      </div>
      <div class="total-item">
        <span class="label">收费重(kg)</span>
        <span class="value">{{ (rowDetail.price || {}).afinalWeightVol || '--' }}</span>
      </div>
    </div>
    <div class="table-top">
      <div>
        {{ measureData.warehouseName || '--' }}
        <span class="line">|</span>
        {{ measureData.applicant || '--' }}
        <span class="line">|</span>
        {{ measureData.actualMeasureTime || '--' }}
      </div>
      <el-link
        :underline="false"
        type="primary"
        @click="handleExport"
      >
        导出Excel
      </el-link>
    </div>
    <el-table
      :data="tableData"
      height="calc(100vh - 400px)"
      style="width: 100%"
    >
      <el-table-column
        prop="boxCode"
        label="箱号"
        width="230"
      />
      <el-table-column
        prop="weight"
        label="重量(kg)"
      />
      <el-table-column
        prop="length"
        label="长(cm)"
      >
        <template slot-scope="scope">
          <span
            :class="formatExceed(scope.row, 'length') ? 'word-color' : ''"
          >
            {{ scope.row.length }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="wigth"
        label="宽(cm)"
      >
        <template slot-scope="scope">
          <span
            :class="formatExceed(scope.row, 'wigth') ? 'word-color' : ''"
          >
            {{ scope.row.wigth }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="height"
        label="高(cm)"
      >
        <template slot-scope="scope">
          <span
            :class="formatExceed(scope.row, 'height') ? 'word-color' : ''"
          >
            {{ scope.row.height }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="girth"
        label="围长(cm)"
      >
        <template slot-scope="scope">
          <span
            :class="(rowDetail.country.key === 'US' && scope.row.girth >= 260) ||
              (rowDetail.country.key === 'CA' && scope.row.girth >= 320) ? 'word-color' : ''"
          >
            {{ scope.row.girth }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="(((rowDetail.price || {}).billingConfig || {})).type === '0'"
        prop="volumeWeight"
        label="体积重"
      />
      <el-table-column
        v-if="(((rowDetail.price || {}).billingConfig || {})).type === '1'"
        prop="wv"
        label="重量体积"
      />
    </el-table>
    <el-pagination
      :current-page.sync="pagination.page"
      :page-size="pagination.size"
      layout="total, prev, pager, next"
      :total="measureList.length"
      style="text-align: right;"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getMeasureById, getExcelExport } from '@/api/orderlist-at-whole'
import dayjs from 'dayjs'
import XLSX from 'xlsx'

@Component({
  name: 'measure-info',
  components: {},
  props: {
    measureData: {
      type: Object,
      default: () => ({})
    },
    rowDetail: {
      type: Object,
      default: () => ({})
    },
    measureList: {
      type: Array,
      default: () => ([])
    }
  }
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private pagination: any = {
    page: 1,
    size: 20,
    total: 0
  }
  /** comoputed */
  get totalVolumeWeight() {
    const billingConfig = ((this as any).rowDetail.price || {}).billingConfig || {}
    return (this as any).measureList.reduce((total: number, it: any) => {
      if (billingConfig.type === '0') {
        // 重量计费
        total += it.volumeWeight
      }
      if (billingConfig.type === '1') {
        // 体积计费
        total += it.wv
      }
      return parseFloat(total.toFixed(2))
    }, 0)
  }
  get tableData() {
    return (this as any).measureList.slice((this.pagination.page - 1) * this.pagination.size, (this.pagination.page) * this.pagination.size)
  }
  /* methods */
  private formatExceed(row: any, str: string) {
    const arr = [row.length || 0, row.wigth || 0, row.height || 0].sort((a: any, b: any) => b - a)
    if (row[str] >= 120) {
      return true
    } else if (row[str] === arr[1] && row[str] >= 75) {
      return true
    }
  }
  private handleExport() {
    if ((this as any).measureList.length === 0) {
      this.$message.error('暂无计量数据导出')
      return
    }
    this.loading = true
    const headerItem: any = {
      code: '原单号',
      boxCode: '箱号',
      weight: '重量(kg)',
      length: '长(cm)',
      wigth: '宽(cm)',
      height: '高(cm)',
      girth: '围长(cm)'
    }
    const billingConfig = ((this as any).rowDetail.price || {}).billingConfig || {}
    if (billingConfig.type === '0') {
      headerItem.volumeWeight = '体积重'
    }
    if (billingConfig.type === '1') {
      headerItem.wv = '重量体积'
    }
    const rows: any[] = (this as any).measureList.map((it: any) => {
      const obj: any = {
        code: (this as any).rowDetail.code,
        boxCode: it.boxCode,
        weight: it.weight,
        length: it.length,
        wigth: it.wigth,
        height: it.height,
        girth: it.girth
      }
      if (billingConfig.type === '0') {
        // 重量计费
        obj.volumeWeight = it.volumeWeight
      }
      if (billingConfig.type === '1') {
        // 体积计费
        obj.wv = it.wv
      }
      return obj
    })
    // 创建book
    const wb: any = XLSX.utils.book_new()
    // json转sheet
    const ws: any = XLSX.utils.json_to_sheet([headerItem, ...rows], { header: Object.keys(headerItem), skipHeader: true })
    // sheet写入book
    XLSX.utils.book_append_sheet(wb, ws, '计量数据列表')
    // 输出
    XLSX.writeFile(wb, '计量数据列表' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.xlsx')
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
  .measure-info{
    padding: 16px 20px 20px 20px;
    font-family: Microsoft YaHei;
    .info-total{
      overflow: hidden;
      .total-item{
        float: left;
        margin-right: 50px;
        .label{
          font-size: 14px;
          font-weight: 400;
          color: #324770;
          margin-right: 5px;
        }
        .value{
          font-size: 14px;
          font-weight: 600;
          color: #303133;
        }
        &:last-child{
          margin-right: 0;
        }
      }
    }
    .table-top{
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      font-weight: 400;
      color: #333333;
      margin: 14px 0 12px 0;
      .line{
        color: #BFDFFF;
        margin: 0 12px;
      }
    }
  }
  .word-color {
    color: #E12E2E;
  }
</style>
