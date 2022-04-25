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
      <div class="detail-picking">
        拣货任务单详细信息
      </div>
      <el-form
        ref="detail"
        :model="form"
        label-width="120px"
        class="detail-form"
      >
        <el-form-item label="拣货任务单号">
          {{ form.jhrwdh }}
        </el-form-item>
        <el-form-item label="任务类型">
          {{ form.rwlx }}
        </el-form-item>
        <el-form-item label="任务子类型">
          {{ form.rwlx }}
        </el-form-item>
        <el-form-item label="状态">
          {{ form.zt }}
        </el-form-item>
        <el-form-item label="创建时间">
          {{ form.cjsj }}
        </el-form-item>
        <el-form-item label="要求完成时间">
          {{ form.yqwcsj }}
        </el-form-item>
      </el-form>
      <div class="order-title">
        拣货明细
      </div>
      <el-table
        :data="tableData"
        style="width: 100%;margin: 10px 0;"
        border
      >
        <el-table-column
          prop="jhrwdh"
          label="箱号"
        />
        <el-table-column
          prop="tpid"
          label="原托盘号"
        />
        <el-table-column
          prop="tpzt"
          label="仓储位置"
        />
        <el-table-column
          prop="qsqy"
          label="中转设备"
        />
        <el-table-column
          prop="wcsj"
          label="新托盘号"
        />
        <el-table-column
          prop="mdqy"
          label="目的区域"
        />
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'detail',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private form = {
    jhrwdh: undefined, // 任务单号
    rwlx: undefined, // 任务类型
    zt: undefined, // 状态
    cjsj: undefined, // 起期
    yqwcsj: undefined // 止期
  }
  private tableData = [
    {
      jhrwdh: 'D0982dfsdf',
      tpid: 'T43298',
      tpzt: '已取托盘，待入库位',
      qsqy: 'A01-01-001',
      mdqy: 'A02-02-002',
      wcsj: '2018-10-22 16:35:24'
    }
  ]

  /* 方法 */
  private setData(val: any): void {
    // 设置值
    this.form = val
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item {
  display: inline-block;
  width: 33.33%;
}
.order-detail {
  height: calc(100vh - 170px);
  overflow-y: auto;
}

.detail-back {
  padding: 0 20px;
  line-height: 50px;
  border-bottom: 1px solid #e8e8e8;
  background-color: #fff;
}
.detail-picking {
  background: rgb(231, 231, 231);
  padding: 5px 20px;
  margin-bottom: 20px;
  line-height: 35px;
  font-size: 18px;
  font-weight: 700;
}
.detail-order {
  padding: 0 20px;
}
.order-title {
  line-height: 50px;
  border-top: 1px solid #e8e8e8;
}
.detail-form {
  padding: 0 50px;
  label {
    font-weight: 700 !important;
  }
}

</style>
