<template>
  <div>
    <head-info
      info=""
      title="快递换单"
    >
      <span
        slot="option"
        style="cursor: pointer;"
        @click="$emit('back')"
      >
        <i class="el-icon-back" />
        <span>返回</span>
      </span>
    </head-info>
    <div class="app-panel">
      <el-table
        :data="detailData"
        height="calc(100vh - 250px)"
        style="width: 100%;margin: 10px 0;"
        border
      >
        <el-table-column
          prop="orderNo"
          label="原单号"
        />
        <el-table-column
          prop="pkgNo"
          label="箱号"
        />
        <el-table-column
          prop="trackingNo1"
          label="快递单号"
        />
        <el-table-column
          prop="trackingNo"
          label="新快递单号"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="downloadFile(scope.row)"
            >
              {{ scope.row.trackingNo }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="ifScan"
          label="是否打印"
        >
          <template slot-scope="scope">
            {{ scope.row.ifScan === 1 ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="scanTime"
          label="打印时间"
        />
        <!--<el-table-column
          prop="option"
          label="操作人"
        />-->
        <!--<el-table-column
          label="操作"
        >
          &lt;!&ndash;<template slot-scope="scope">&ndash;&gt;
          <template>
            <el-button
              type="text"
              size="small"
            >
              查看
            </el-button>
          </template>
        </el-table-column>-->
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'detail',
  components: {},
  props: {
    detailData: {
      type: Array,
      default: () => ([])
    }
  }
})
export default class extends Vue {
  private downloadFile(row: any) {
    if (!row.imagePath) {
      this.$message.error('暂无文件')
      return
    }
    window.open(process.env.VUE_APP_OSS_PATH + row.imagePath)
  }
}
</script>

<style lang="scss" scoped>

</style>
