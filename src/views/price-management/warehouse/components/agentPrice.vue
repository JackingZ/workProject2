<template>
  <vxe-modal
    v-model="visible"
    v-loading="loading"
    show-zoom
    resize
    :z-index="1314"
    :lock-view="false"
    :mask="false"
    :lock-scroll="false"
    width="1100"
    min-width="700"
    height="500"
    min-height="400"
    @close="close"
  >
    <div
      slot="title"
      class="my-title"
      @click.stop="(e) => e"
    >
      <span>供应商</span>
      <el-select
        v-model="form.agent"
        style="width:200px;margin-left: 10px;margin-right: 20px"
        clearable
        filterable
        size="mini"
        placeholder="请选择"
        @change="selectAgentChange"
      >
        <el-option
          v-for="item in agentList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <span>版本</span>
      <el-select
        v-model="form.edition"
        style="width:240px;margin-left: 10px"
        clearable
        filterable
        :disabled="!form.agent"
        size="mini"
        placeholder="请选择"
        @change="showPrice"
      >
        <el-option
          v-for="item in editionList"
          :key="item.id"
          :label="formatTime(item)"
          :value="item.id"
        />
      </el-select>
    </div>
    <div>
      <el-table
        v-if="tableData.length"
        ref="priceTable"
        :data="tableData"
        :span-method="tableDataSpanMethod"
        style="width: 100%;margin-top: 10px"
        border
      >
        <el-table-column
          prop="name"
          width="150"
          show-overflow-tooltip
          label="收费项目"
        />
        <el-table-column
          prop="type"
          width="100"
          label="计费方式"
        >
          <template slot-scope="scope">
            {{ formatType(scope.row.type) }}
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          label="计费配置"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="scope.row.type === 5 || scope.row.type === 6">{{ scope.row.cellName }}</span>
            <span v-else-if="scope.row.min && scope.row.max">{{ scope.row.min + '-' + scope.row.max }}</span>
            <span v-else>单位单价</span>
          </template>
        </el-table-column>
        <el-table-column label="价格">
          <template slot-scope="scope">
            <div>
              {{ scope.row.price }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="最低收费">
          <template slot-scope="scope">
            <div>
              {{ scope.row.minCharge }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
          label="备注"
        >
          <template slot-scope="scope">
            {{ scope.row.remark }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </vxe-modal>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getEffectiveBook } from '@/api/price-to-warehouse'
import dayjs from 'dayjs'

@Component({
  name: 'agentPrice'
})
export default class AgentPrice extends Vue {
  /* data */
  private spanNum1: number = 0
  private spanNum2: number = 0
  private divNum1: number = 0
  private divNum2: number = 0
  private visible: boolean = false
  private isMinimize: boolean = false
  private loading: boolean = false
  private agentList: any[] = []
  private agentPriceList: any[] = []
  private aAxisData: any[] = []
  private tableData: any[] = []
  private editionList: any[] = []
  private spanArr1: any[] = []
  private spanArr2: any[] = []
  private divArr1: any[] = []
  private divArr2: any[] = []
  private settlementList: any[] = [
    {
      id: 0,
      name: '按重量'
    },
    {
      id: 1,
      name: '按体积'
    },
    {
      id: 2,
      name: '按金额'
    },
    {
      id: 3,
      name: '按票'
    },
    {
      id: 4,
      name: '按箱'
    },
    {
      id: 5,
      name: '按车'
    },
    {
      id: 6,
      name: '按柜'
    },
    {
      id: 7,
      name: '按里程'
    },
    {
      id: 8,
      name: '按时间'
    },
    {
      id: 9,
      name: '按托'
    },
    {
      id: 'A',
      name: '按个数'
    }
  ]
  private selectService: any = {}
  private dayjs: any = dayjs
  private form: any = {
    agent: '',
    edition: ''
  }

  /* methods */
  private formatType(val: any) {
    const item = this.settlementList.find((it: any) => it.id === val) || {}
    return item.name || ''
  }
  private tableDataSpanMethod({ row, column, rowIndex, columnIndex }: any) {
    if (columnIndex === 0) {
      const _row = this.spanArr1[rowIndex]
      const _col = _row > 0 ? 1 : 0
      return {
        rowspan: _row,
        colspan: _col
      }
    }
    if (columnIndex === 1) {
      const _row = this.spanArr2[rowIndex]
      const _col = _row > 0 ? 1 : 0
      return {
        rowspan: _row,
        colspan: _col
      }
    }
  }
  private show(selectService: any, params: any) {
    if (!this.isMinimize) {
      this.selectService = selectService
      this.aAxisData = []
      this.tableData = []
      this.agentList = []
      this.agentPriceList = []
      this.editionList = []
      this.form = {
        agent: '',
        edition: ''
      }
      this.getAgentPriceList(params)
    }
    this.visible = true
  }
  private getAgentPriceList(params: any) {
    this.loading = true
    getEffectiveBook(params).then((res: any) => {
      this.loading = false
      if (res.success) {
        this.agentPriceList = res.data || []
        this.getAgentList()
      }
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }
  private getAxis(price: any) {
    this.tableData = price.priceList || []
    this.getSpanArr(this.tableData)
  }
  // 合并data
  private getSpanArr(data: any) {
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        this.spanArr1.push(1)
        this.spanNum1 = 0

        this.spanArr2.push(1)
        this.spanNum2 = 0
      } else {
        // 判断当前元素与上一个元素是否相同
        if (data[i].name === data[i - 1].name) {
          this.spanArr1[this.spanNum1] += 1
          this.spanArr1.push(0)

          if (data[i].type === data[i - 1].type) {
            this.spanArr2[this.spanNum2] += 1
            this.spanArr2.push(0)
          }
        } else {
          this.spanArr1.push(1)
          this.spanNum1 = i

          this.spanArr2.push(1)
          this.spanNum2 = i
        }
      }
    }
  }
  private getAgentList() {
    const agentList = this.agentPriceList.map((e: any) => {
      return {
        name: e.fromCustName,
        id: e.fromCustId
      }
    })
    this.agentList = agentList.reduce((list: any[], next: any) => {
      if (!list.find((e: any) => e.id === next.id)) {
        list.push(next)
      }
      return list
    }, [])
  }
  private selectAgentChange(val: any) {
    this.editionList = this.agentPriceList.filter((item: any) => item.fromCustId === val)
    this.form.edition = ''
    this.aAxisData = []
    this.tableData = []
  }
  private showPrice(val: any) {
    this.spanArr1 = []
    this.spanNum1 = 0
    this.spanArr2 = []
    this.spanNum2 = 0
    this.aAxisData = []
    this.tableData = []
    const price = this.agentPriceList.find((item: any) => item.id === val)
    if (price) {
      this.getAxis(price)
    }
  }
  private formatTime(obj: any) {
    const start = (obj || {}).startTime
    const end = (obj || {}).endTime
    return dayjs(start).format('YYYY-MM-DD') + '-' + dayjs(end).format('YYYY-MM-DD')
  }
  private minimize() {
    this.isMinimize = true
    this.visible = false
    this.$emit('close')
  }
  private close() {
    this.isMinimize = false
    this.visible = false
    this.$emit('close')
  }
}
</script>

<style lang="scss" scoped>
  .my-drag-model{
    .my-title{
      display: flex;
      align-items: center;
    }
    ::v-deep{
      .model-header{
        background: #ECECEC;
      }
    }
  }
</style>
