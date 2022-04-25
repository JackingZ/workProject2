<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        v-if="!isEditFormShow"
        v-loading="noticeLoading"
        class="app-container"
      >
        <head-info
          info=""
          title="整柜发货"
        />
        <div class="app-panel">
          <el-row>
            <el-col :span="4">
              <el-button
                v-permission="['fclShipmentAdd']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-left: 10px"
                @click="addRow"
              >
                新增
              </el-button>
            </el-col>
            <el-col
              :span="20"
              style="text-align:right;"
            >
              <el-select
                v-model="searchForm.type"
                size="small"
                style="width: 130px;margin-right: 5px;"
                placeholder="业务类型"
                filterable
                clearable
                @focus="getSubtypeList"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-date-picker
                v-model="searchForm.orderTime"
                :clearable="false"
                unlink-panels
                type="daterange"
                align="right"
                size="small"
                value-format="yyyy-MM-dd"
                range-separator="~"
                style="width:240px;margin-right:10px;"
                start-placeholder="下单起始时间"
                end-placeholder="下单截止时间"
              />
              <el-button
                v-permission="['fclShipmentSearch']"
                type="primary"
                size="small"
                @click="getShipTable(1)"
              >
                查询
              </el-button>
            </el-col>
          </el-row>

          <el-table
            :data="noticeData"
            border
            height="calc(100vh - 300px)"
            style="width: 100%;margin: 10px 0;"
          >
            <el-table-column
              :formatter="formatType"
              prop=""
              label="业务类型"
              width="120"
            />
            <el-table-column
              :formatter="formatTrans"
              prop=""
              label="服务类型"
              width="120"
            />
            <el-table-column
              prop=""
              label="订舱服务"
              width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.bsc || {}).name }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="数量"
              width="120"
            >
              <template slot-scope="scope">
                {{ (scope.row.containers || []).length }}
              </template>
            </el-table-column>
            <el-table-column
              label="运输类型"
              width="150"
            >
              <template slot-scope="scope">
                {{ scope.row.type === '0' ? '航空版' : '' }}
                {{ scope.row.type === '1' ? '柜型' : '' }}
                {{ scope.row.type === '2' ? '柜型' : '' }}
                {{ scope.row.type === '3' ? '车型' : '' }}
                &nbsp;
                {{ (((scope.row.containers || [])[0] || {}).containerInfo || {}).containerName }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="服务机构"
              width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.org || {}).value }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="服务编码"
              width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.bsc || {}).serviceCode }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="起运港"
              min-width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.originPort || {}).value }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="目的港"
              min-width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.targetPort || {}).value }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="起运国"
              min-width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.originCountry || {}).value }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="目的国"
              min-width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.targetCountry || {}).value }}
              </template>
            </el-table-column>
            <el-table-column
              :formatter="dispatchFormat"
              prop=""
              label="派送方式"
              width="120"
            />
            <el-table-column
              prop="shippingDate"
              label="起运日期"
              width="180"
            />
            <el-table-column
              prop="cutoffDate"
              label="截单日期"
              width="180"
            />
            <el-table-column
              prop="transitTime"
              label="运输时间"
              width="180"
            />
            <el-table-column
              prop=""
              label="目的仓代码"
              min-width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.fbastore || {}).value }}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              width="150"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="$checkPermission(['fclShipmentView'])"
                  type="text"
                  size="medium"
                  @click="viewRow(scope.row)"
                >
                  查看
                </el-button>
                <el-button
                  v-if="$checkPermission(['fclShipmentEdit'])"
                  type="text"
                  size="medium"
                  @click="editRow(scope.row)"
                >
                  编辑
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            :current-page.sync="page"
            :page-size="size"
            layout="total, prev, pager, next"
            :total="total"
            style="text-align: right;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>

      <add-edit-form
        v-if="isEditFormShow"
        ref="addEditForm"
        :single-id="singleId"
        :is-str="isEditViewAdd"
        @back="handleBack"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getShipDetail,
  getServiceSubtypeList
} from '@/api/operation-of-single-shipment'
import addEditForm from '@/views/operation-management/container-shipment/addEditForm.vue'
import dayjs from 'dayjs'

@Component({
  name: '',
  components: {
    addEditForm
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private noticeLoading: boolean = false
  private selectLoading: boolean = false
  private isEditFormShow: boolean = false
  private isEditViewAdd: string = ''
  private noticeData: any[] = []
  private typeList: any[] = []
  private searchForm: any = {
    type: undefined,
    orderTime: []
  }
  private singleId: any = ''
  private page: number = 1
  private size: number = 10
  private total: any = 0
  /* computed */

  /* methods */
  private dispatchFormat(row: any) {
    const obj: any = { '0': '快递', '1': '卡派', '2': '自提', '3': '整柜直送' }
    const arrD = (`${row.deliveryWay}` || '').split(',')
    const arrN: any[] = []
    arrD.map((it: any) => {
      arrN.push(obj[it])
    })
    return arrN.join(',')
  }
  private formatType(row: any) {
    if (row.type === '0') {
      return '空运'
    } else if (row.type === '1') {
      return '海运'
    } else if (row.type === '2') {
      return '铁路'
    } else if (row.type === '4') {
      return '卡航'
    }
  }
  private formatTrans(row: any) {
    const type = (row.bsc || {}).transType
    if (!type) return
    let name: any = ''
    const list = [
      { id: '0', name: '包板' },
      { id: '1', name: '散货' },
      { id: '2', name: '整柜' },
      { id: '3', name: '拼箱' },
      { id: '4', name: '整车' },
      { id: '5', name: '拼箱' }
    ]
    const arr = (type || '').split(',')
    arr.map((it: any) => {
      const item: any = list.find((l: any) => l.id === it) || {}
      if (item.name) {
        name += item.name + ' '
      }
    })
    return name
  }
  private handleBack() {
    this.isEditFormShow = false
    this.isEditViewAdd = ''
    this.singleId = ''
    this.getShipTable()
  }
  private viewRow(row: any) {
    this.isEditFormShow = true
    this.isEditViewAdd = 'v'
    const { id } = row
    this.singleId = id
    this.$nextTick(() => {
      const root: any = this.$refs.addEditForm
      root.setRow(row)
    })
  }
  private editRow(row: any) {
    this.isEditFormShow = true
    this.isEditViewAdd = 'e'
    const { id } = row
    this.singleId = id
    this.$nextTick(() => {
      const root: any = this.$refs.addEditForm
      root.setRow(row)
    })
  }
  private addRow() {
    this.isEditFormShow = true
    this.isEditViewAdd = ''
  }
  private getSubtypeList() {
    this.selectLoading = true
    const params:any = {
      typeId: '05'
    }
    getServiceSubtypeList(params)
      .then((res: any) => {
        const data = res.data || []
        this.typeList = data
        this.selectLoading = false
      }).catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.getShipTable()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.getShipTable()
  }

  private getShipTable(val?: any) {
    const { orderTime } = this.searchForm
    this.noticeLoading = true
    if (val) {
      this.page = val
    }
    const params: any = {
      model: {
        type: this.searchForm.type,
        mode: '2',
        startTime: '',
        endTime: ''
      },
      page: this.page,
      size: this.size
    }
    if (Array.isArray(orderTime) && orderTime.length > 0) {
      params.model.startTime = orderTime[0] + ' 00:00:00'
      params.model.endTime = orderTime[1] + ' 23:59:59'
    }
    getShipDetail(params)
      .then((res: any) => {
        this.noticeLoading = false
        const data = res.data || {}
        this.noticeData = data.result || []
        this.total = data.total
      })
      .catch((err: any) => {
        this.noticeLoading = false
        return err
      })
  }
  private created() {
    this.searchForm.orderTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    this.getShipTable()
  }
}
</script>

<style lang="scss" scoped>
.header-title {
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  h3 {
    color: #909399;
    font-weight: 400;
    font-size: 16px;
  }
}
</style>
