<template>
  <div class="view-detail">
    <div class="select-order">
      <div style="display: flex;flex-flow: row nowrap;align-items: center;padding-bottom: 16px;">
        <div style="width: 110px;">
          <span class="order-text">已选择订单</span>
        </div>
        <div style="flex: 1;">
          <el-row>
            <el-col :span="4">
              <span style="padding-left: 8px;">
                已勾选(<span class="select-total">{{ orderObj.total }}</span>)
              </span>
            </el-col>
            <el-col :span="5">
              <span>总票数</span>
              <span class="select-number">{{ orderObj.bills || 0 }}</span>
            </el-col>
            <el-col :span="5">
              <span>总件数</span>
              <span class="select-number">{{ orderObj.packages || 0 }}</span>
            </el-col>
            <el-col :span="5">
              <span>总重量(kg)</span>
              <span class="select-number">{{ orderObj.weights || 0 }}</span>
            </el-col>
            <el-col :span="5">
              <span>总体积(m³)</span>
              <span class="select-number">{{ orderObj.volumes || 0 }}</span>
            </el-col>
          </el-row>
        </div>
        <div
          class="select-icon"
          @click="handleClosed"
        >
          <i class="el-icon-close select-close" />
        </div>
      </div>
      <div class="select-table">
        <el-table
          ref="selectTable"
          :data="tableData"
          :header-cell-style="{
            'background-color': 'rgba(216, 216, 216, 0.11)',
            'font-size': '14px',
            'color': '#fff',
            'font-weight': '600'
          }"
          :cell-style="{'font-size': '13px', 'color': '#fff'}"
          style="width: 100%"
        >
          <el-table-column
            label="订单信息"
            min-width="180"
          >
            <template slot-scope="scope">
              <div class="order-info">
                <div
                  class="seriver-info"
                  :title="scope.row.lscName"
                >
                  <div
                    v-if="scope.row.type === '0'"
                    class="type"
                  >
                    空运
                  </div>
                  <div
                    v-if="scope.row.type === '1'"
                    class="type"
                  >
                    海运
                  </div>
                  <div
                    v-if="scope.row.type === '2'"
                    class="type"
                  >
                    铁路
                  </div>
                  <div
                    v-if="scope.row.type === '3'"
                    class="type"
                  >
                    快递
                  </div>
                  <div
                    v-if="scope.row.type === '4'"
                    class="type"
                  >
                    卡航
                  </div>
                  <div
                    class="lscName"
                  >
                    {{ scope.row.lscName }}
                  </div>
                </div>
                <div
                  class="code"
                  :title="scope.row.code"
                >
                  <span
                    v-copy="scope.row.code"
                    class="copy-icon"
                  />
                  <span>
                    原单号：{{ scope.row.code }}
                  </span>
                </div>
                <div>
                  <span
                    v-if="scope.row.deliveryWay === '0'"
                    class="text-tip"
                  >
                    快递
                  </span>
                  <span
                    v-if="scope.row.deliveryWay === '1'"
                    class="text-tip"
                  >
                    卡派
                  </span>
                  <span
                    v-if="scope.row.deliveryWay === '2'"
                    class="text-tip"
                  >
                    自提
                  </span>
                  <span class="split-tip">|</span>
                  <span
                    v-if="scope.row.customs === '0'"
                    class="text-tip"
                  >
                    普通报关
                  </span>
                  <span
                    v-if="scope.row.customs === '1'"
                    class="text-tip"
                  >
                    出口退税
                  </span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="custName"
            label="客户名称"
          />
          <el-table-column
            prop="so"
            label="SO"
          />
          <el-table-column
            prop=""
            label="货物所在仓"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.warehouseName }}</div>
              <div class="text-tip">
                {{ scope.row.warehouseTime }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="装载情况"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.source === '0'">
                未装载
              </div>
              <div v-if="scope.row.source === '1' || scope.row.source === '2'">
                <div>已装载</div>
                <div class="text-tip">
                  {{ scope.row.source === '1' ? '虚拟装载' : scope.row.source === '2' ? '人工装载' : '' }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="packages"
            label="总件数"
          />
          <el-table-column
            prop="weights"
            label="总重量(kg)"
          />
          <el-table-column
            prop="volumes"
            label="总体积(m3)"
          />
          <el-table-column
            label="操作"
            width="80"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                class="delete-btn"
                @click="deleteRow(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'MonitorDetails',
  components: {}
})
export default class extends Vue {
  /* data */
  private tableData: any[] = []
  /* computed */
  get orderObj() {
    let packages: number = 0
    let weights: number = 0
    let volumes: number = 0
    this.tableData.map((it: any) => {
      packages += it.packages
      weights += it.weights
      volumes += it.volumes
    })
    const obj = {
      total: this.tableData.length,
      bills: this.tableData.length,
      packages: parseFloat(packages.toFixed(2)),
      weights: parseFloat(weights.toFixed(2)),
      volumes: parseFloat(volumes.toFixed(2))
    }
    return obj
  }
  /* method */
  private setData(data: any[]) {
    this.tableData = data
  }
  private deleteRow(row: any) {
    this.tableData = this.tableData.filter((it: any) => it.id !== row.id)
    this.$emit('updateSelected', row)
  }
  private handleClosed() {
    this.tableData = []
    this.$emit('closed')
  }
}
</script>

<style lang="scss" scoped>
.view-detail {
  background-color: #1D2331;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.16);
  transition: background-color .3s;
  padding: 16px;
  .select-order {
    color: #fff;
    font-size: 14px;
    .order-text {
      font-size: 18px;
      font-weight: 600;
      color: #fff;
    }
    .select-total {
      color: #29FFE6;
    }
    .select-number {
      padding-left: 8px;
      font-size: 16px;
      font-weight: 600;
    }
    .select-icon {
      width: 50px;
      height: 20px;
      line-height: 20px;
      text-align: right;
      cursor: pointer;
    }
    .select-close {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.6);
    }
    .select-table {
      max-height: 400px;
      min-height: 200px;
      overflow-y: auto;
      .el-table {
        background-color: transparent;
        &::before {
          height: 0;
        }
      }
      .delete-btn {
        color: #FF4753;
      }
    }
    .order-info {
      width: 100%;
      .seriver-info {
        display: flex;
        align-items: center;
        .type {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 18px;
          white-space: nowrap;
          border: 1px solid rgba(220, 223, 230, 0.3);
          border-radius: 2px;
          font-size: 12px;
          font-family: PingFang SC;
          color: #fff;
          margin-right: 5px;
        }
        .lscName {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 13px;
          font-family: PingFang SC;
          color: #fff;
        }
      }
      .code {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 12px;
        font-family: PingFang SC;
        color: rgba(255, 255, 255, 0.6);
        .copy-icon {
          cursor: pointer;
          width: 12px;
          height: 12px;
          display: inline-block;
          margin-right: 5px;
          background: url("../../assets/imgs/copy.png") center center no-repeat;
          background-size: 100%;
          &:hover{
            background: url("../../assets/imgs/copy-hover.png") center center no-repeat;
            background-size: 100%;
          }
        }
      }
      .split-tip {
        color: #A9ACB3;
        margin: 0 5px;
      }
      .text-tip {
        font-size: 12px;
        font-family: PingFang SC;
        color: rgba(255, 255, 255, 0.6);
      }
    }
    .order-page {
      text-align: right;
      color: rgba(255, 255, 255, 0.7);
      padding-top: 24px;
    }
  }
}
::v-deep {
  .el-table__header tr,
  .el-table__body tr {
    background-color: transparent;
  }
  .el-table__header th.is-leaf,
  .el-table__header td {
    border-bottom: none;
  }
  .el-table__body th.is-leaf,
  .el-table__body td {
    border-bottom: 1px solid #545F75;
  }
  .el-table__body tr:hover > td {
    background-color: rgba(216, 216, 216, 0.11);
  }
  .el-table-column--selection {
    vertical-align: top;
  }
  .el-table-column--selection .cell {
    padding-right: 0;
  }
  .el-table__empty-text {
    color: #fff;
  }
}
</style>
