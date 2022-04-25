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
          :label="formatTime(item.period)"
          :value="item.id"
        />
      </el-select>
    </div>
    <div>
      <vxe-table
        v-if="aAxisData.length"
        :data="tableData"
        style="width: 100%;margin-top: 10px"
        border
        resizable
        :auto-resize="true"
        size="small"
      >
        <vxe-table-column
          width="150"
          title="服务机构"
          :show-overflow="true"
          :resizable="true"
        >
          <template slot-scope="scope">
            {{ (scope.row.trans || {}).orgName }}
          </template>
        </vxe-table-column>
        <vxe-table-column
          width="150"
          title="服务编码"
          :show-overflow="true"
          :resizable="true"
        >
          <template slot-scope="scope">
            {{ (scope.row.trans || {}).serviceCode }}
          </template>
        </vxe-table-column>
        <vxe-table-column
          width="180"
          title="截止报关 / 起运时间"
          :show-overflow="true"
          :resizable="true"
        >
          <template slot-scope="scope">
            {{ formatDays(scope.row.trans || {}) }}
          </template>
        </vxe-table-column>
        <vxe-table-column
          v-for="(item,index) in aAxisData"
          :key="index"
          :title="item.label"
          :show-overflow="true"
          :resizable="true"
        >
          <template slot-scope="scope">
            {{ scope.row.prices[index].price }}
          </template>
        </vxe-table-column>
        <vxe-table-column
          min-width="120"
          title="备注"
          :resizable="true"
          :show-overflow="true"
        >
          <template slot-scope="scope">
            {{ scope.row.remark }}
          </template>
        </vxe-table-column>
      </vxe-table>
    </div>
  </vxe-modal>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getSupplier } from '@/api/price-to-express'
import dayjs from 'dayjs'

@Component({
  name: 'agentPrice'
})
export default class AgentPrice extends Vue {
  /* data */
  private visible: boolean = false
  private isMinimize: boolean = false
  private loading: boolean = false
  private agentList: any[] = []
  private agentPriceList: any[] = []
  private aAxisData: any[] = []
  private tableData: any[] = []
  private editionList: any[] = []
  private weekdays: any = [
    { label: '星期一', value: 1 },
    { label: '星期二', value: 2 },
    { label: '星期三', value: 3 },
    { label: '星期四', value: 4 },
    { label: '星期五', value: 5 },
    { label: '星期六', value: 6 },
    { label: '星期日', value: 7 }
  ]
  private selectService: any = {}
  private dayjs: any = dayjs
  private form: any = {
    agent: '',
    edition: ''
  }

  /* methods */
  private formatDays(row: any) {
    const resS = this.weekdays.find((item: any) => item.value === row.shipDay) || {}
    const resC = this.weekdays.find((item: any) => item.value === row.customDay) || {}
    return (resC.label || '') + ' / ' + (resS.label || '')
  }
  private show(selectService: any) {
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
      this.getAgentPriceList()
    }
    this.visible = true
  }
  private getAgentPriceList() {
    const params = {
      escId: this.selectService.id
    }
    this.loading = true
    getSupplier(params).then((res: any) => {
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
    const rows = price.rows || []
    const loadType = price.loadType
    this.tableData = rows
    if (Array.isArray(rows) && rows.length > 0) {
      const item = rows[0].prices || []
      this.aAxisData = item.map((a: any, index: any) => {
        const xxx = a.x || {}
        const obj: any = {
          label: '',
          aAxisArr: []
        }
        if (loadType === '5' && a.type === '0') { // 卡散-重量
          obj.label = '重量'
          obj.aAxisArr.push({
            index,
            label: `${xxx.lower}-${xxx.upper}`
          })
        } else if (loadType === '5' && a.type === '1') { // 卡散-方数
          obj.label = '方数'
          obj.aAxisArr.push({
            index,
            label: `${xxx.lower}-${xxx.upper}`
          })
        } else if (loadType === '1' || loadType === '2' || loadType === '4') { // 柜型
          obj.label = xxx
        } else if (loadType === '0' || loadType === '3') { // 区间
          obj.label = `${xxx.lower}-${xxx.upper}`
        }
        return obj
      })
    }
  }
  private getAgentList() {
    const agentList = this.agentPriceList.map((e: any) => {
      return {
        name: e.cust.value,
        id: e.cust.key
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
    this.editionList = this.agentPriceList.filter((item: any) => item.cust.key === val)
    this.form.edition = ''
    this.aAxisData = []
    this.tableData = []
  }
  private showPrice(val: any) {
    this.aAxisData = []
    this.tableData = []
    const price = this.agentPriceList.find((item: any) => item.id === val)
    if (price) {
      this.getAxis(price)
    }
  }
  private formatTime(obj: any) {
    const start = (obj || {}).effect
    const end = (obj || {}).expire
    return dayjs(start).format('YYYY-MM-DD HH:mm') + '-' + dayjs(end).format('YYYY-MM-DD HH:mm')
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
