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
        style="width: 100%;"
        border
        resizable
        size="small"
        :auto-resize="true"
      >
        <vxe-table-column
          width="200"
          :show-overflow="true"
          :show-header-overflow="true"
          :resizable="true"
        >
          <template
            slot="header"
          >
            <span class="header-row">{{ leftTitle }}</span>
            <span>&nbsp;&nbsp;\&nbsp;&nbsp;</span>
            <span class="header-column">{{ rightTitle }}</span>
          </template>
          <template slot-scope="scope">
            {{ (scope.row.address || {}).value }}
          </template>
        </vxe-table-column>
        <vxe-table-column
          v-if="isShowRegionalDetailCol"
          :show-overflow="true"
          :show-header-overflow="true"
          width="200"
          :resizable="true"
          title="区域详情"
          field="regionalDetails"
        />
        <vxe-table-column
          v-for="(item,index) in aAxisData"
          :key="index"
          :title="item.label"
          :resizable="true"
          :show-overflow="true"
        >
          <template slot-scope="scope">
            <span>
              {{ scope.row.prices[index].price }}
            </span>
          </template>
        </vxe-table-column>
        <vxe-table-column
          min-width="100"
          title="参考时效(天)"
          :show-overflow="true"
          :resizable="true"
        >
          <template slot-scope="scope">
            <span>
              {{ scope.row.prescription }}
            </span>
          </template>
        </vxe-table-column>
        <vxe-table-column
          min-width="120"
          title="备注"
          :show-overflow="true"
          :resizable="true"
        >
          <template slot-scope="scope">
            <span>
              {{ scope.row.remark }}
            </span>
          </template>
        </vxe-table-column>
      </vxe-table>
    </div>
  </vxe-modal>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getSupplier, groupByPid } from '@/api/price-to-private-line'
import dayjs from 'dayjs'

@Component({
  name: 'agentPrice'
})
export default class AgentPrice extends Vue {
  /* data */
  private leftTitle: string = ''
  private rightTitle: string = ''
  private visible: boolean = false
  private isMinimize: boolean = false
  private loading: boolean = false
  private isShowRegionalDetailCol: boolean = false
  private agentList: any[] = []
  private agentPriceList: any[] = []
  private aAxisData: any[] = []
  private tableData: any[] = []
  private editionList: any[] = []
  private selectService: any = {}
  private dayjs: any = dayjs
  private form: any = {
    agent: '',
    edition: ''
  }

  /* methods */
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
      lscId: this.selectService.id
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
  private async groupByPid() {
    const typeList = ['5', '100', '101', '102']
    const type = this.tableData[0].addressType
    if (typeList.indexOf(type) === -1) {
      this.isShowRegionalDetailCol = false
    } else {
      this.isShowRegionalDetailCol = true
      const ids = this.tableData.reduce((idList: any[], next: any) => {
        const key = next.address ? next.address.key : ''
        if (key && idList.indexOf(key) === -1) {
          idList.push(key)
        }
        return idList
      }, [])
      const params: any = {
        ids
      }
      if (type === '5') {
        params.type = 1
      }
      await groupByPid(params).then((res: any) => {
        const data = res.data || {}
        const list: any[] = Object.keys(data).map((key: any) => {
          const tamp = {
            key,
            value: data[key].map((e: any) => {
              let str = ''
              if (type === '101') {
                str = e.warehouseName
              }
              if (type === '102') {
                str = e.countryId + '-' + e.countryName
              }
              if (type === '100') {
                str = e.cityName + '-' + e.cityName
              }
              if (type === '5') {
                str = e.stateName
              }
              return str
            }).join('，')
          }
          return tamp
        })
        this.tableData = this.tableData.map((item: any) => {
          const key = item.address ? item.address.key : ''
          list.map((e: any) => {
            if (e.key === key) {
              item.regionalDetails = e.value
            }
          })
          return item
        })
      }).catch((err: any) => {
        return err
      })
    }
  }
  private async getAxis(price: any) {
    const rows = price.rows || []
    const loadType = price.loadType
    if (rows[0] && rows[0].addressType === '0') {
      this.leftTitle = '国家'
    } else if (rows[0] && rows[0].addressType === '1') {
      this.leftTitle = '州省'
    } else if (rows[0] && rows[0].addressType === '5') {
      this.leftTitle = '国内区域'
    } else if (rows[0] && rows[0].addressType === '7') {
      this.leftTitle = '仓库代码'
    } else if (rows[0] && rows[0].addressType === '100') {
      this.leftTitle = '城市区域'
    } else if (rows[0] && rows[0].addressType === '101') {
      this.leftTitle = '仓库区域'
    } else if (rows[0] && rows[0].addressType === '102') {
      this.leftTitle = '国家区域'
    }
    this.tableData = rows
    await this.groupByPid()
    if (Array.isArray(rows) && rows.length > 0) {
      const item = rows[0].prices || []
      this.aAxisData = item.map((a: any, index: any) => {
        const xxx = a.x || {}
        const obj: any = {
          label: '',
          aAxisArr: []
        }
        if (loadType === '5' && a.type === '0') { // 卡散-重量
          obj.label = `${xxx.lower}-${xxx.upper}`
          this.rightTitle = '重量区间'
        } else if (loadType === '5' && a.type === '1') { // 卡散-方数
          obj.label = `${xxx.lower}-${xxx.upper}`
          this.rightTitle = '方数区间'
        } else if (loadType === '2') { // 海铁整柜
          this.rightTitle = '柜型'
          obj.label = xxx.value
        } else {
          if (a.type === '0') {
            this.rightTitle = '重量区间'
          }
          if (a.type === '1') {
            this.rightTitle = '体积区间'
          }
          // this.rightTitle = loadType === '0' ? '重量区间' : loadType === '3' ? '体积区间' : ''
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
  private async showPrice(val: any) {
    this.aAxisData = []
    this.tableData = []
    const price = this.agentPriceList.find((item: any) => item.id === val)
    if (price) {
      await this.getAxis(price)
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
