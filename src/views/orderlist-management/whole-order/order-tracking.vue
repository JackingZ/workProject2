<template>
  <div
    v-loading="loading"
  >
    <div class="detail-back">
      <div class="title">
        订单状态详情
      </div>
      <span
        style="cursor: pointer;margin-left: 10px"
        @click="goBack"
      >
        <i class="el-icon-back" />
        <span>返回</span>
      </span>
    </div>
    <div
      class="app-panel order-detail"
    >
      <div class="tracking-info">
        <div class="status-wrap">
          <div class="service-name">
            {{ (row.lsc || {}).value }}
          </div>
          <div class="code">
            原单号：{{ row.code }}
          </div>
          <div class="status-list">
            <div
              v-if="statusList.length"
              class="status-item-warp"
            >
              <div
                v-for="(item, i) in statusList"
                :key="item.time"
                class="status-item"
                :class="{active: i === 0}"
              >
                <div class="status-text-warp">
                  <div class="status-text">
                    {{ item.statusName }}
                  </div>
                  <el-popover
                    v-model="item.visible"
                    title="文件下载"
                    placement="top"
                    trigger="click"
                  >
                    <el-table
                      v-loading="fileLoading"
                      :data="fileList"
                    >
                      <el-table-column
                        width="250"
                        property="fileName"
                        label="文件名称"
                      />
                      <el-table-column
                        width="150"
                        label="操作"
                      >
                        <template slot-scope="scope">
                          <el-button
                            size="small"
                            type="text"
                            @click="downloadFile(scope.row)"
                          >
                            文件下载
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-button
                      v-if="item.ifFile"
                      slot="reference"
                      size="small"
                      type="text"
                      @click="showFileList(item)"
                    >
                      文件下载
                    </el-button>
                  </el-popover>
                  <div v-if="item.statusIndex === '501'">
                    <el-button
                      size="small"
                      type="text"
                      @click="showOrderSoInfo"
                    >
                      查看详情
                    </el-button>
                  </div>
                </div>
                <div class="status-describe">
                  <div class="time">
                    {{ item.updateAt }}
                  </div>
                  <div class="describe">
                    {{ item.describe || '' }}
                  </div>
                </div>
              </div>
            </div>
            <div
              v-else
              class="none"
            >
              <div class="none-bg" />
              <div class="none-text">
                暂未查询到记录~
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <order-so-info
      ref="orderSoInfo"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import dayjs from 'dayjs'
import { getOrderStatusList, getOrderStatusFile } from '@/api/orderlist-at-whole'
import orderSoInfo from '@/views/orderlist-management/whole-order/order-so-info.vue'

@Component({
  name: 'order-tracking',
  components: {
    orderSoInfo
  }
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private fileLoading: boolean = false
  private row: any = {}
  private statusList: any[] = []
  private fileList: any[] = []

  /* methods */
  private showOrderSoInfo() {
    const orderSoInfoRef: any = this.$refs.orderSoInfo
    orderSoInfoRef.show(this.row)
  }
  private downloadFile(row: any) {
    if (row.fileSource) {
      window.open(row.fileSource)
    } else {
      this.$message.warning('暂无可下载文件')
    }
  }
  private showFileList(item: any) {
    const params = {
      code: item.keyCode,
      statusIndex: item.statusIndex
    }
    this.fileList = []
    this.fileLoading = true
    getOrderStatusFile(params).then((res: any) => {
      this.fileList = res.data || []
      this.fileLoading = false
    }).catch(() => {
      this.fileLoading = false
    })
  }
  private show(row: any) {
    this.row = row
    this.loadData()
  }
  private loadData() {
    const params = {
      index: '1',
      words: this.row.code
    }
    this.loading = true
    getOrderStatusList(params).then((res: any) => {
      const data = res.data || {}
      this.statusList = (data.status || []).sort((a: any, b: any) => dayjs(b.updateAt).diff(dayjs(a.updateAt), 'second')).reduce((list: any[], s: any) => {
        if (!list.find((e: any) => e.statusIndex === s.statusIndex)) {
          list.push(s)
        }
        return list
      }, []).map((e: any) => {
        e.visible = false
        e.keyCode = this.row.code
        return e
      })
      this.loading = false
    }).catch(() => {
      this.loading = false
      this.statusList = []
    })
  }
  private goBack() {
    this.row = {}
    this.statusList = []
    this.$emit('back')
  }
}
</script>

<style lang="scss" scoped>
  .order-detail {
    height: calc(100vh - 170px);
    overflow-y: auto;
  }

  .detail-back {
    padding: 10px 20px;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
  }
  .tracking-info{
    .status-wrap{
      .service-name{
        font-size: 22px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 30px;
        color: #333333;
      }
      .code{
        font-size: 14px;
        color: #909399;
        padding: 10px 0;
      }
      .status-list{
        padding-top: 20px;
        .status-item-warp{
          max-height: calc(100vh - 310px);
          overflow-y: auto;
        }
        .status-item{
          display: flex;
          .status-text-warp{
            text-align: right;
          }
          .status-text{
            width: 160px;
            white-space: nowrap;
            padding-top: 1px;
            font-size: 18px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 25px;
            color: #606266;
          }
          .status-describe{
            flex: 1;
            margin-left: 48px;
            .time{
              position: relative;
              font-size: 14px;
              font-family: PingFang SC;
              font-weight: 400;
              color: #909399;
              padding: 4px 0;
              &:before{
                content: '';
                width: 9px;
                height: 9px;
                border-radius: 50%;
                background-color: #BFC4CB;
                position: absolute;
                top: 50%;
                left: -28px;
                transform: translateY(-50%);
              }
            }
            .describe{
              font-size: 14px;
              font-family: PingFang SC;
              font-weight: 400;
              color: #303133;
              padding-bottom: 20px;
              padding-top: 8px;
              position: relative;
              &:before{
                content: '';
                width: 1px;
                height: 100%;
                background-color: #DBDFE5;
                position: absolute;
                top: 50%;
                left: -24px;
                transform: translateY(-50%);
              }
            }
          }
          &:last-child{
            .status-describe{
              .describe{
                &:before{
                  content: '';
                  width: 0;
                  height: 100%;
                  background-color: #909399;
                  position: absolute;
                  top: 50%;
                  left: -24px;
                  transform: translateY(-50%);
                }
              }
            }
          }
          &.active{
            .status-text{
              color: #409eff;
            }
            .status-describe{
              .time{
                &:before{
                  content: '';
                  width: 9px;
                  height: 9px;
                  border-radius: 50%;
                  background-color: #409eff;
                  position: absolute;
                  top: 50%;
                  left: -28px;
                  transform: translateY(-50%);
                }
              }
            }
          }
        }
        .none{
          text-align: center;
          .none-bg{
            margin: 150px auto 0 auto;
            width: 273px;
            height: 213px;
            background: url("../../../assets/imgs/none.png") center center no-repeat;
            background-size: 100%;
          }
          .none-text{
            font-size: 18px;
            font-family: PingFang SC;
            line-height: 25px;
            color: #989898;
          }
        }
      }
    }
  }
</style>
