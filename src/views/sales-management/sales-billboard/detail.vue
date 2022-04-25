<template>
  <div class="app-container">
    <div
      v-loading="loading"
      class="app-panel"
    >
      <el-row>
        <el-col :span="6">
          <span style="line-height: 32px;">详情</span>
        </el-col>
        <el-col
          :span="18"
          style="text-align:right;padding-right: 10px;"
        >
          <el-button
            type="primary"
            size="small"
            @click="goBack"
          >
            返 回
          </el-button>
        </el-col>
      </el-row>
      <ve-histogram
        :data="chartData"
        :extend="chartExtend"
        :settings="chartSettings"
      />
      <el-table
        :data="tableData"
        height="350"
        style="width: 100%;margin: 10px 0;"
        border
      >
        <el-table-column
          label="订单名称"
          width="120"
          prop="name"
        />
        <el-table-column
          label="业务类型"
          min-width="120"
          prop="time"
        />
        <el-table-column
          label="业务类型-任务量"
          min-width="200"
          show-overflow-tooltip
        />
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'

@Component({
  name: '',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private tableData: any[] = []
  private chartData: any = {}
  private chartSettings: any = {}
  private chartExtend: any = {}
  private selectForm: any = {}
  /* computed */

  get labelPosition() {
    const lang = AppModule.language
    if (!lang) {
      return 'left'
    }
    return lang === 'en' ? 'top' : 'left'
  }

  get lang() {
    const lang = AppModule.language
    if (!lang) {
      return 'en'
    }
    return lang
  }

  /* methods */
  private setData(row: any) {
    this.$nextTick(() => {
      this.getOriginData()
    })
  }
  private queryAll(val?: any): void {
    //
  }
  private getOriginData() {
    this.chartData = {
      columns: ['名称', '目标量', '完成量', '完成率'],
      rows: [
        { '名称': 'xxxxxxx服务组', '目标量': 1393, '完成量': 1093, '完成率': 0.32 },
        { '名称': 'xxxxxxxxxxxx服务组', '目标量': 3530, '完成量': 3230, '完成率': 0.26 },
        { '名称': 'xxxxxxxxxxxxxxx服务组', '目标量': 2923, '完成量': 2623, '完成率': 0.76 },
        { '名称': 'xxxxxxxxxxxxxxxx服务组', '目标量': 1723, '完成量': 1423, '完成率': 0.49 },
        { '名称': 'xxxxxxxxxxxxxxxxx服务组', '目标量': 3792, '完成量': 3492, '完成率': 0.323 },
        { '名称': 'xxxxxxxxxxxxxx服务组', '目标量': 4593, '完成量': 4293, '完成率': 0.78 }
      ]
    }
    this.chartSettings = {
      stack: { '量': ['目标量', '完成量'] }
    }
    this.chartExtend = {
      title: {
        text: '任务量',
        textStyle: {
          fontSize: 14,
          color: '#666',
          fontWeight: 'normal'
        },
        left: '3%',
        top: '5%'
      },
      legend: {
        top: '5%',
        right: '5%',
        orient: 'horizontal',
        padding: 10,
        itemGap: 10,
        itemWidth: 20,
        itemHeight: 10,
        icon: 'circle'
      }
    }
  }
  private goBack() {
    this.$emit('close')
  }
}
</script>

<style lang="scss" scoped>

</style>
