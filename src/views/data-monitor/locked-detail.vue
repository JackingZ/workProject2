<template>
  <el-dialog
    :visible.sync="visible"
    width="1200px"
    :show-close="false"
    @closed="close"
  >
    <div
      slot="title"
      class="dialog-header"
    >
      <div class="header-left">
        <span class="list-icon" />
        <span
          v-if="showDialogType === 'fba'"
          class="order"
        >
          订单：{{ (showDialogData.state || {}).value }} {{ showDialogData.ifFba ? showDialogData.fbaCode : '私人地址' }}
        </span>
        <span
          v-if="showDialogType === 'so'"
          class="order"
        >
          {{ showDialogData.transport === '0' ? '提单号：' : 'SO：' }} {{ showDialogData.so }}
        </span>
        <span
          v-if="showDialogType === 'transit'"
          class="order"
        >
          在途订单
        </span>
        <!-- <el-date-picker
          v-if="showDialogType === 'transit'"
          v-model="orderTime"
          unlink-panels
          :clearable="false"
          type="daterange"
          align="right"
          size="mini"
          value-format="yyyy-MM-dd"
          range-separator="~"
          style="width:240px;margin-left:38px;"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="resetData"
        /> -->
        <div
          class="reset-btn"
          @click="resetData"
        >
          <i class="reset-icon el-icon-refresh" />
          <span>刷新</span>
        </div>
      </div>
      <div
        v-if="showDialogType !== 'transit'"
        class="header-right"
      >
        <div class="right-item">
          <div class="label">
            总票数
          </div>
          <div class="value">
            {{ showDialogData.bills || 0 }}
          </div>
        </div>
        <div class="right-item">
          <div class="label">
            总件数
          </div>
          <div class="value">
            {{ showDialogData.packages || 0 }}
          </div>
        </div>
        <div class="right-item">
          <div class="label">
            总重量
          </div>
          <div class="value">
            {{ showDialogData.weights || 0 }} kg
          </div>
        </div>
        <div class="right-item">
          <div class="label">
            总体积
          </div>
          <div class="value">
            {{ showDialogData.volumes || 0 }} m³
          </div>
        </div>
      </div>
    </div>
    <div
      v-loading="loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="dialog-table"
    >
      <div
        v-if="showDialogType !== 'transit'"
        style="display: flex;margin-bottom: 20px"
      >
        <div class="tabs-wrap">
          <div
            class="tabs-item"
            :class="{active: tableType === 0}"
            @click="tableTypeChange(0)"
          >
            订单明细
          </div>
          <div
            class="tabs-item"
            :class="{active: tableType === 1}"
            @click="tableTypeChange(1)"
          >
            按仓汇总
          </div>
        </div>
      </div>
      <el-table
        v-show="tableType === 0"
        :data="tableData"
        style="width: 100%;"
        tooltip-effect="light"
      >
        <el-table-column
          label="订单信息"
          min-width="230"
          prop="order"
        >
          <div
            slot-scope="scope"
            class="order-info"
          >
            <div
              class="seriver-info"
            >
              <div
                class="type"
              >
                {{ (transportList.find(e => e.value === scope.row.transport) || {}).name }}
              </div>
              <div
                class="lscName"
                :title="scope.row.lscName"
              >
                {{ scope.row.lscName }}
              </div>
            </div>
            <div
              class="code"
            >
              <span
                v-copy="scope.row.code"
                class="copy-icon"
              />
              <span>
                原单号：{{ scope.row.code }}
              </span>
            </div>
          </div>
        </el-table-column>
        <el-table-column
          label="客户名称"
          min-width="120"
          prop="custName"
        />
        <!-- <el-table-column
          prop="createTime"
          label="下单时间"
          width="170"
        /> -->
        <el-table-column
          label="下单仓库"
          min-width="120"
        >
          <template slot-scope="scope">
            {{ scope.row.forecastName || '--' }}
          </template>
        </el-table-column>
        <el-table-column
          label="报关方式"
          width="90"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.customs === '0'">普通报关</span>
            <span v-else-if="scope.row.customs === '1'">出口退税</span>
          </template>
        </el-table-column>
        <el-table-column
          label="派送方式"
          width="90"
        >
          <template slot-scope="scope">
            {{ (deliveryWayList.find(e => e.id === scope.row.deliveryWay) || {}).name }}
          </template>
        </el-table-column>
        <el-table-column
          prop="packages"
          label="件数"
          width="100"
        />
        <el-table-column
          prop="weights"
          label="总重量(kg)"
          width="100"
        />
        <el-table-column
          prop="volumes"
          label="总体积(m³)"
          width="100"
        />
      </el-table>
      <el-table
        v-show="tableType === 1"
        :data="tableData"
        style="width: 100%;"
        tooltip-effect="light"
      >
        <el-table-column
          label="货物所在仓"
          min-width="100"
          prop="name"
          show-overflow-tooltip
        />
        <el-table-column
          label="总件数"
          prop="totalQuantity"
          min-width="100"
        />
        <el-table-column
          label="总体积(m³)"
          prop="totalVolume"
          min-width="100"
        />
        <el-table-column
          label="总重量(kg)"
          prop="totalWeight"
          min-width="100"
        />
      </el-table>
      <el-pagination
        :current-page.sync="pagination.page"
        :page-size="pagination.size"
        layout="total, prev, pager, next"
        :total="pagination.total"
        style="text-align: right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getDashboardOrderByCode,
  getDashboardOrderBySo,
  getDashboardOrderByWarehouseSummary
} from '@/api/kanban'
import {
  getDashboardTransit
} from '@/api/jht-monitor'
import { UserModule } from '@/store/modules/user'
import dayjs from 'dayjs'

@Component({
  name: 'LockedDetail',
  props: {
    locked: {
      type: Boolean,
      default: false
    },
    countryId: {
      type: String,
      default: ''
    }
  },
  components: {}
})
export default class extends Vue {
  /* data */
  private pickList: any[] = [
    { name: '自主送货', id: '0' },
    { name: '上门提货', id: '1' },
    { name: '快递发货', id: '2' },
    { name: '整柜直装', id: '3' }
  ]
  private deliveryWayList: any[] = [
    { name: '快递', id: '0' },
    { name: '卡派', id: '1' },
    { name: '自提', id: '2' },
    { name: '整柜直送', id: '3' }
  ]
  private transportList: any[] = [
    {
      value: '0',
      name: '空运'
    },
    {
      value: '1',
      name: '海运'
    },
    {
      value: '2',
      name: '铁路'
    },
    {
      value: '3',
      name: '快递'
    },
    {
      value: '4',
      name: '卡航'
    }
  ]
  private visible: boolean = false
  private loading: boolean = false
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  private showDialogData: any = {}
  private showDialogType: string = ''
  private tableData: any[] = []
  private orderTime: any[] = []
  private tableType: number = 0
  /* computed */
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }
  /* methods */
  private tableTypeChange(type: number) {
    this.tableType = type
    this.tableData = []
    this.loadData()
  }
  private show(data: any, type: string) {
    this.visible = true
    this.showDialogData = data
    this.showDialogType = type
    if (type === 'transit') {
      this.orderTime = [dayjs().startOf('month').format('YYYY-MM-DD'), dayjs().endOf('month').format('YYYY-MM-DD')]
      this.tableType = 0
    } else {
      this.tableType = 1
    }
    this.loadData()
  }
  private resetData() {
    this.pagination.page = 1
    this.tableData = []
    this.pagination.total = 0
    this.loadData()
  }
  private loadData() {
    const params: any = {
      model: '',
      page: this.pagination.page,
      size: this.pagination.size
    }
    if (this.tableType === 0) {
      let fun = null
      switch (this.showDialogType) {
        case 'transit':
          params.model = {
            countryId: (this as any).countryId
          }
          fun = getDashboardTransit
          break
        case 'fba':
          params.model = this.showDialogData.codes
          fun = getDashboardOrderByCode
          break
        case 'so':
          params.model = {
            so: this.showDialogData.so,
            ifLocked: (this as any).locked
          }
          fun = getDashboardOrderBySo
          break
        default: fun = null
      }
      if (!fun) return
      this.loading = true
      fun && fun(params).then((res: any) => {
        this.loading = false
        const data = res.data || {}
        this.tableData = data.result || []
        this.pagination.total = data.total || 0
      }).catch((err: any) => {
        this.loading = false
        this.tableData = []
        this.pagination.total = 0
        return err
      })
    } else {
      if (this.showDialogType === 'fba') {
        params.model = {
          orders: this.showDialogData.codes
        }
      } else {
        params.model = {
          so: this.showDialogData.so,
          ifLocked: (this as any).locked
        }
      }
      this.loading = true
      getDashboardOrderByWarehouseSummary(params).then((res: any) => {
        this.loading = false
        const data = res.data || {}
        this.tableData = data.result || []
        this.pagination.total = data.total || 0
      }).catch((err: any) => {
        this.loading = false
        this.tableData = []
        this.pagination.total = 0
        return err
      })
    }
  }
  private handleSizeChange(val: string) {
    this.pagination.size = Number(val)
    this.loadData()
  }

  private handleCurrentChange(val: string) {
    this.pagination.page = Number(val)
    this.loadData()
  }
  private close() {
    this.visible = false
    this.tableData = []
    this.pagination = {
      page: 1,
      size: 10,
      total: 0
    }
    this.showDialogData = {}
    this.showDialogType = ''
    this.tableType = 0
    this.orderTime = []
  }
  // private created() {}
}
</script>

<style lang="scss" scoped>
  @function vw($value){
    @return unquote(($value) + 'px')
    //@return unquote(($value / 19.2) + 'vw')
  }
  .dialog-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #FFFFFF;
    .header-left{
      display: flex;
      align-items: center;
      .list-icon{
        display: inline-block;
        width: vw(20);
        height: vw(20);
        background: url("../../assets/kanban/list-icon.png") center center no-repeat;
        background-size: 100%;
        margin-right: vw(13);
      }
      .order{
        font-size: vw(16);
        font-weight: 500;
      }
      .reset-btn{
        display: flex;
        align-items: center;
        padding: vw(3) vw(4);
        border: vw(1) solid #636974;
        border-radius: vw(3);
        margin-left: vw(38);
        cursor: pointer;
        user-select: none;
        span{
          margin-left: vw(5);
          font-size: vw(12);
          font-weight: 400;
        }
      }
    }
    .header-right{
      display: flex;
      .right-item{
        padding: 0 vw(25);
        text-align: center;
        font-size: vw(12);
        .value{
          line-height: vw(16);
        }
      }
    }
  }
  .dialog-table{
    max-height: 80%;
    .tabs-wrap{
      display: flex;
      align-items: center;
      padding: 4px;
      background: rgba(216, 216, 216, .11);
      border-radius: 4px;
      .tabs-item{
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        padding: 6px 16px;
        color: #fff;
        transition: all .3s;
        cursor: pointer;
        &.active{
          color: #29FFE6;
          background: rgba(255, 255, 255, .17);
          border-radius: 2px;
        }
      }
    }
    .order-info{
      width: 100%;
      .seriver-info{
        display: flex;
        align-items: center;
        .type{
          display: flex;
          align-items: center;
          justify-content: center;
          width: vw(30);
          height: vw(18);
          white-space: nowrap;
          border: vw(1) solid #fff;
          border-radius: vw(2);
          font-size: vw(12);
          color: #fff;
          margin-right: vw(5);
          opacity: .6;
        }
        .lscName{
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: vw(14);
          color: #fff;
        }
      }
      .code{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: vw(12);
        color: #999999;
        .copy-icon{
          cursor: pointer;
          width: vw(12);
          height: vw(12);
          display: inline-block;
          margin-right: vw(5);
          background: url("../../assets/imgs/copy.png") center center no-repeat;
          background-size: 100%;
          &:hover{
            background: url("../../assets/imgs/copy-hover.png") center center no-repeat;
            background-size: 100%;
          }
        }
      }
    }
  }
  ::v-deep{
    .el-table{
      background: #283042;
      .el-table__fixed{
        .el-table__fixed-header-wrapper{
          table{
            background: #283042;
            thead{
              background: #283042;
              tr{
                background: #283042;
                th{
                  background: rgba(216, 216, 216, .11);
                  border-bottom: none;
                  color: rgba(255, 255, 255, .5);
                }
              }
            }
          }
        }
      }
      .el-table__header-wrapper{
        background: #283042;
        table{
          background: transparent;
          thead{
            background: transparent;
            tr{
              background: transparent;
              th{
                background: rgba(216, 216, 216, .11);
                border-bottom: none;
                color: rgba(255, 255, 255, .5);
              }
            }
          }
        }
      }
      .el-table__fixed .el-table__fixed-body-wrapper,
      .el-table__body-wrapper{
        table > tbody > tr > td{
          background: #283042;
          border-bottom: 1px solid #545F75;
          color: #fff;
        }
      }
    }
    .el-dialog{
      box-shadow: 0 vw(2) vw(5) rgba(0, 0, 0, 0.16);
      color: #FFF;
      .el-dialog__header{
        padding: vw(16) vw(16) vw(22) vw(16);
        background: #283042;
      }
      .el-dialog__body{
        padding: vw(0) vw(16) vw(16) vw(16);
        background: #283042;
      }
    }
    .el-pagination{
      color: #fff;
      .el-pagination__total{
        color: #fff;
      }
      button:disabled{
        background: #283042;
      }
      .el-pager{
        background: #283042;
        .number{
          background: #283042;
        }
      }
      .btn-prev, .btn-next{
        background: #283042;
        color: #fff;
      }
      .el-pager li.btn-quicknext, .el-pager li.btn-quickprev{
        background: #283042;
        color: #fff;
      }
    }
  }
</style>
