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
        v-if="aAxisData.length"
        :data="tableData"
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
            <span
              class="header-column"
            >
              {{ selectService.addressType === '4' ? '里程' : '目的地' }}
            </span>
            <span> \ </span>
            <span v-if="selectService.priceType === '0'">
              车型
            </span>
            <span v-if="selectService.priceType === '1'">
              托数
            </span>
            <span v-if="selectService.priceType === '2'">
              重量&方数
            </span>
          </template>
          <template slot-scope="scope">
            {{ scope.row.label }}
          </template>
        </vxe-table-column>
        <template v-if="selectService.priceType !== '2'">
          <vxe-table-column
            v-for="(item,index) in aAxisData"
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
        </template>
        <template v-else>
          <vxe-table-colgroup
            v-for="(aAxis,i) in aAxisDataPlanar"
            :key="i"
            :title="i === 0 ? ' 重量' : '方数'"
            align="center"
            :show-overflow="true"
          >
            <vxe-table-column
              v-for="(item,index) in aAxis"
              :key="index"
              :title="item.label"
              :prop="item.value"
              :show-overflow="true"
              :resizable="true"
            >
              <template slot-scope="scope">
                <div>
                  {{ scope.row[item.value] }}
                </div>
              </template>
            </vxe-table-column>
          </vxe-table-colgroup>
          <vxe-table-column
            title="备注"
            align="center"
            :show-overflow="true"
            :resizable="true"
          >
            <template slot-scope="scope">
              <div>
                {{ scope.row.remark }}
              </div>
            </template>
          </vxe-table-column>
        </template>
      </vxe-table>
    </div>
  </vxe-modal>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { superiorPrice } from '@/api/price-to-car'
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
  private aAxisDataPlanar: any[] = []
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
  private show(selectService: any) {
    if (!this.isMinimize) {
      this.selectService = selectService
      this.aAxisData = []
      this.aAxisDataPlanar = []
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
    const params: any = {
      addressId: this.selectService.addressId,
      addressName: this.selectService.addressName,
      addressType: this.selectService.addressType,
      currencyId: this.selectService.currencyId,
      kscId: this.selectService.id,
      kscName: this.selectService.name,
      priceType: this.selectService.priceType,
      subtypeId: this.selectService.subtypeId,
      umDistance: this.selectService.umDistance,
      umVolume: this.selectService.umVolume,
      umWeight: this.selectService.umWeight,
      country: {
        cityId: this.selectService.cityId,
        cityName: this.selectService.cityName,
        countryId: this.selectService.countryId,
        countryName: this.selectService.countryName,
        countyId: this.selectService.countyId,
        countyName: this.selectService.countyName,
        stateId: this.selectService.stateId,
        stateName: this.selectService.stateName
      }
    }
    this.loading = true
    superiorPrice(params).then((res: any) => {
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
  private getAxis(aAxisList: any) {
    let list = JSON.parse(JSON.stringify(aAxisList))
    if (list.length === 0) {
      return {
        tableData: [],
        aAxisData: [],
        aAxisDataPlanar: []
      }
    }
    list = list.map((item: any) => {
      if (item.pricelist.length) {
        item.pricelist = item.pricelist.map((e: any) => {
          return {
            code: e.codex,
            max: e.maxx,
            min: e.minx,
            name: e.namex,
            price: e.price,
            type: e.type
          }
        })
      }
      return {
        code: item.codey,
        max: item.maxy,
        min: item.miny,
        name: item.namey,
        pricelist: item.pricelist,
        remark: item.remark
      }
    })
    let aAxisData = list[0].pricelist.map((item: any, i: any) => {
      const tamp: any = {
        value: 'x' + i,
        ...item
      }
      if (this.selectService.priceType === '0') {
        tamp.label = item.name
      } else {
        tamp.label = item.min + ' - ' + item.max
      }
      return tamp
    })
    let aAxisDataPlanar: any[] = []
    if (this.selectService.priceType === '2') {
      aAxisDataPlanar = [aAxisData.filter((item: any) => item.type === '0'), aAxisData.filter((item: any) => item.type === '1')]
    }
    const tableData = list.map((item: any) => {
      let tamp: any = {
        label: '',
        remark: item.remark
      }
      item.pricelist.forEach((x: any, i: any) => {
        tamp['x' + i] = x.price
      })
      if (this.selectService.addressType === '4') {
        // 里程
        tamp.label = item.min + ' - ' + item.max
        tamp = Object.assign(tamp, { ...item })
      } else {
        // 固定地址
        tamp.label = item.name
        tamp = Object.assign(tamp, { ...item })
      }
      return tamp
    })
    aAxisData = [...aAxisData, {
      label: '备注',
      value: 'remark'
    }]
    return {
      tableData,
      aAxisData,
      aAxisDataPlanar
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
    this.aAxisData = []
    this.aAxisDataPlanar = []
    this.tableData = []
  }
  private showPrice(val: any) {
    this.aAxisData = []
    this.aAxisDataPlanar = []
    this.tableData = []
    const price = this.agentPriceList.find((item: any) => item.id === val)
    if (price) {
      const excelModelList = price.excelModelList
      const data = this.getAxis(excelModelList)
      this.aAxisData = data.aAxisData
      this.aAxisDataPlanar = data.aAxisDataPlanar
      this.tableData = data.tableData
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
