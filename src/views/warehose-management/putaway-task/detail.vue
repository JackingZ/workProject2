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
      <div class="detail-putaway">
        上架任务单详细信息
      </div>
      <el-form
        ref="detail"
        :model="form"
        label-width="120px"
        class="detail-form"
      >
        <el-form-item label="上架任务单号">
          {{ form.putawayNo }}
        </el-form-item>
        <el-form-item label="上架类型">
          {{ (typeList[form.putawayType] || {}).name }}
        </el-form-item>
        <el-form-item label="上架模式">
          {{ (modeList[form.putawayMode] || {}).name }}
        </el-form-item>
        <el-form-item label="状态">
          {{ (statusList[form.status] || {}).name }}
        </el-form-item>
        <el-form-item label="操作人：">
          {{ form.executorName }}
        </el-form-item>
        <el-form-item label="申请人：">
          {{ form.assignorName }}
        </el-form-item>
        <el-form-item label="创建时间">
          {{ form.createTime }}
        </el-form-item>
        <el-form-item label="要求完成时间">
          {{ form.expectedFinishTime }}
        </el-form-item>
      </el-form>
      <div style="line-height: 50px;border-top: 1px solid #e8e8e8;">
        上架任务明细
      </div>
      <el-table
        :data="tableData"
        style="width: 100%;margin: 10px 0;"
        border
      >
        <el-table-column
          prop="boxCode"
          label="箱号"
        />
        <el-table-column
          prop="temporaryLocation"
          label="存放位置"
        />
        <el-table-column
          prop="sku"
          label="SKU"
        />
        <el-table-column
          prop="batchNo"
          label="批次号"
        />
        <el-table-column
          prop="quantity"
          label="数量"
        />
        <el-table-column
          prop="equipment"
          label="中转设备"
        />
        <el-table-column
          prop="palletNo"
          label="中转箱/托盘编号"
        />
        <el-table-column
          prop="storageLocation"
          label="仓储位置"
        />
        <el-table-column
          prop="storageMethod"
          label="仓储方式"
        />
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getPutawayDetail } from '@/api/warehose-by-config'
@Component({
  name: 'detail',
  components: {},
  props: {
    statusList: {
      type: Array,
      default: () => {
        return []
      }
    },
    modeList: {
      type: Array,
      default: () => {
        return []
      }
    },
    typeList: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
})
export default class extends Vue {
  /* data */
  private form = {
    putawayNo: undefined, // 任务单号
    putawayType: undefined, // 任务类型
    status: undefined, // 状态
    timeStart: undefined, // 起期
    timeEnd: undefined // 止期
  }
  private tableData = []
  private putawayId = ''
  private detailLoading: boolean =false

  /* 方法 */
  private setData(row: any): void {
    // 设置值
    this.putawayId = row.id || ''
    this.getDetail()
  }
  private getDetail(): void {
    // 查询
    this.detailLoading = true
    getPutawayDetail({
      id: this.putawayId
    })
      .then((res: any) => {
        const data = res.data || {}
        const { list, ...form } = data
        this.form = form || {}
        this.tableData = list || []
        this.detailLoading = false
      })
      .catch((err: any) => {
        this.detailLoading = false
        return [null, err]
      })
  }
}
</script>

<style lang="scss" scoped>
.order-detail {
  height: calc(100vh - 170px);
  overflow-y: auto;
}
.detail-form {
  ::v-deep .el-form-item {
    vertical-align: top;
    display: inline-block;
    width: 24.9%;
    margin-bottom: 0px;
  }
}

.detail-back {
  text-align: right;
  padding: 0 20px;
  line-height: 50px;
  border-bottom: 1px solid #e8e8e8;
  background-color: #fff;
}
.detail-putaway {
  background: rgb(231, 231, 231);
  padding: 0px 20px;
  margin-bottom: 10px;
  line-height: 35px;
  font-size: 16px;
  font-weight: 700;
}
</style>
