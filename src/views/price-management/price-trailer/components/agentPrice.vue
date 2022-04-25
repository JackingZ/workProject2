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
        style="width:200px;margin-left: 10px"
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
          :label="dayjs(item.startTime).format('YYYY-MM-DD') + '/' + dayjs(item.endTime).format('YYYY-MM-DD')"
          :value="item.id"
        />
      </el-select>
    </div>
    <div>
      <vxe-table
        v-if="xAxis.length"
        :data="yAxis"
        style="width: 100%;margin: 10px 0;"
        border
        resizable
        size="small"
        :auto-resize="true"
      >
        <vxe-table-column
          width="200"
          :show-overflow="true"
          :show-header-overflow="true"
          class-name="first-col-header"
          :resizable="true"
        >
          <template
            slot="header"
          >
            目的地\柜型
          </template>
          <template slot-scope="scope">
            {{ scope.row.label }}
          </template>
        </vxe-table-column>
        <vxe-table-column
          v-for="(item,index) in xAxis"
          :key="index"
          :title="item.label"
          :prop="item.value"
          :show-overflow="true"
          :resizable="true"
        >
          <template slot-scope="scope">
            <div v-if="item.value !== 'remark'">
              {{ scope.row[item.value] }}
            </div>
            <div v-else>
              {{ scope.row.remark }}
            </div>
          </template>
        </vxe-table-column>
      </vxe-table>
    </div>
  </vxe-modal>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getSuperiorPrice } from '@/api/price-to-trailer'
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
  private xAxis: any[] = []
  private yAxis: any[] = []
  private editionList: any[] = []
  private selectService: any = {}
  private dayjs: any = dayjs
  private form: any = {
    agent: '',
    edition: ''
  }

  /* methods */
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
  private show(selectService: any, params: any) {
    if (!this.isMinimize) {
      this.selectService = selectService
      this.xAxis = []
      this.yAxis = []
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
    getSuperiorPrice(params).then((res: any) => {
      this.loading = false
      if (res.success && res.data && res.data.length) {
        this.agentPriceList = res.data || []
      }
      this.getAgentList()
    }).catch((err: any) => {
      this.loading = false
      this.agentPriceList = []
      this.agentList = []
      return err
    })
  }
  private getAxis(list: any) {
    this.xAxis = list[0].priceList.map((e: any) => {
      return {
        label: e.nameX,
        value: e.codeX
      }
    })
    this.yAxis = list.map((e: any) => {
      const tamp: any = {
        label: e.nameY,
        value: e.codeY,
        remark: e.remark
      }
      e.priceList.forEach((p: any) => {
        tamp[p.codeX] = p.price
        // tamp.xId = e.cabinetId
      })
      return tamp
    })
    if (this.xAxis.length) {
      this.xAxis = [...this.xAxis, {
        label: '备注',
        value: 'remark'
      }]
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
    // change
    this.editionList = this.agentPriceList.filter((item: any) => item.fromCustId === val)
    this.form.edition = ''
    this.xAxis = []
    this.yAxis = []
  }
  private showPrice(val: any) {
    this.xAxis = []
    this.yAxis = []
    const price = this.agentPriceList.find((item: any) => item.id === val)
    if (price) {
      const excelModelList = price.priceList
      this.getAxis(excelModelList)
    }
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
