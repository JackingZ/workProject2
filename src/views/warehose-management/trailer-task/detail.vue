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
      <div class="detail-trailer">
        拖托任务单详细信息
      </div>
      <el-form
        ref="detail"
        :model="form"
        label-width="120px"
        label-position="right"
        class="detail-form"
      >
        <el-form-item label="拖托任务单号：">
          {{ form.towageNo }}
        </el-form-item>
        <el-form-item label="任务类型：">
          <span v-if="form.towageMethod === 1">
            入库
          </span>
          <span v-else-if="form.towageMethod === 2">
            出库
          </span>
          <span v-else-if="form.towageMethod === 3">
            移库
          </span>
          <span v-else-if="form.towageMethod === 4">
            计量拖托
          </span>
        </el-form-item>
        <el-form-item label="状态：">
          <span v-if="form.status === 1">
            待执行
          </span>
          <span v-else-if="form.status === 2">
            执行中
          </span>
          <span v-else-if="form.status === 3">
            已完成
          </span>
        </el-form-item>
        <el-form-item label="创建时间：">
          {{ form.createTime }}
        </el-form-item>
        <el-form-item label="要求完成时间：">
          {{ form.expectedFinishTime }}
        </el-form-item>
      </el-form>
      <div style="line-height: 50px;border-top: 1px solid #e8e8e8;">
        托盘明细
      </div>
      <el-table
        :data="tableData"
        style="width: 100%;margin: 10px 0;"
        border
      >
        <el-table-column
          prop="towageNo"
          label="拖托任务单号"
        />
        <el-table-column
          prop="equipment"
          label="托盘/中转箱"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.equipment === 1">
              托盘
            </div>
            <div v-else-if="scope.row.equipment === 2">
              中转箱
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="palletNo"
          label="托盘ID/中转箱ID"
        />
        <el-table-column
          prop="status"
          label="托盘状态"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.status === 1">
              待执行
            </div>
            <div v-else-if="scope.row.status === 2">
              执行中
            </div>
            <div v-else-if="scope.row.status === 3">
              已完成
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="startingArea"
          label="起始区域"
        />
        <el-table-column
          prop="storageLocation"
          label="目的区域"
        />
        <el-table-column
          prop="finishTime"
          label="完成时间"
          width="180px"
        />
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getTrailerDetail } from '@/api/warehose-by-config'
@Component({
  name: 'detail',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private form = {
    towageNo: undefined, // 任务单号
    towageMethod: undefined, // 任务类型
    status: undefined, // 状态
    createTime: undefined, // 起期
    expectedFinishTime: undefined // 止期
  }
  private tableData = []
  private detailLoading: boolean = false
  private trailerId = ''

  /* 方法 */
  private setData(row: any): void {
    // 设置值
    this.trailerId = row.towageNo || ''
    this.getDetail()
  }
  private getDetail(): void {
    // 查询
    this.detailLoading = true
    getTrailerDetail({
      towageNo: this.trailerId
    })
      .then((res: any) => {
        const data = res.data || {}
        const { details, ...form } = data
        this.form = form || {}
        this.tableData = details || []
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
  padding: 0 20px;
  ::v-deep .el-form-item {
    vertical-align: top;
    display: inline-block;
    width: 24.9%;
    margin-bottom: 10px;
  }
}
.detail-back {
  text-align: right;
  padding: 0 20px;
  line-height: 50px;
  border-bottom: 1px solid #e8e8e8;
  background-color: #fff;
}
.detail-trailer {
  background: rgb(231, 231, 231);
  padding: 0px 20px;
  margin-bottom: 10px;
  line-height: 35px;
  font-size: 16px;
  font-weight: 700;
}
</style>
