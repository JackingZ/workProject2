<template>
  <div
    v-loading="loading"
    style="background-color: #fff;"
  >
    <div class="search-input-wrap">
      <el-input
        v-model="code"
        placeholder="请输入原单号/快递单号查询"
        @keyup.enter.native="onSearch"
      >
        <el-select
          slot="prepend"
          v-model="searchType"
          style="width: 90px"
          placeholder="请选择"
        >
          <el-option
            v-for="item in searchTypeList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
        <el-button
          slot="append"
          @click="onSearch"
        >
          查询
        </el-button>
      </el-input>
    </div>
    <div
      class="app-panel order-detail"
    >
      <div class="tracking-info">
        <div class="title">
          订单状态详情
        </div>
        <div class="status-wrap">
          <div class="service-name">
            {{ channelName }}
          </div>
          <div
            v-if="orderCode"
            class="code"
          >
            原单号：{{ orderCode }}
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
  private statusList: any[] = []
  private fileList: any[] = []
  private searchTypeList: any[] = [
    {
      name: '原单号',
      value: '1'
    },
    {
      name: '快递单号',
      value: '2'
    }
  ]
  private channelName: any = ''
  private orderCode: any = ''
  private searchType: any = '1'
  private code: any = ''

  /* methods */
  private showOrderSoInfo() {
    const orderSoInfoRef: any = this.$refs.orderSoInfo
    orderSoInfoRef.show({ code: this.orderCode })
  }
  private onSearch() {
    if (!this.code.trim()) {
      this.$message.warning('请输入原单号/快递单号查询')
      return
    }
    this.loadData()
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
  private loadData() {
    const params = {
      index: this.searchType,
      words: this.code
    }
    this.loading = true
    getOrderStatusList(params).then((res: any) => {
      const data = res.data || {}
      this.channelName = data.channelName || ''
      this.orderCode = data.orderCode || ''
      this.statusList = (data.status || []).sort((a: any, b: any) => dayjs(b.updateAt).diff(dayjs(a.updateAt), 'second')).reduce((list: any[], s: any) => {
        if (!list.find((e: any) => e.statusIndex === s.statusIndex)) {
          list.push(s)
        }
        return list
      }, []).map((e: any) => {
        e.visible = false
        e.keyCode = data.orderCode
        return e
      })
      this.loading = false
    }).catch(() => {
      this.loading = false
      this.statusList = []
      this.channelName = ''
      this.orderCode = ''
    })
  }
}
</script>

<style lang="scss" scoped>
  .order-detail {
    height: calc(100vh - 140px);
    overflow-y: auto;
  }

  .search-input-wrap {
    width: 616px;
    margin: 0 auto;
    padding-top: 20px;
  }
  .tracking-info {
    .title {
      font-size: 20px;
      font-family: MicrosoftYaHeiSemibold;
      color: #323232;
      line-height: 20px;
      position: relative;
      padding-left: 10px;
      &:before{
        content: '';
        width: 4px;
        height: 20px;
        background: #409eff;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
      }
    }
    .status-wrap{
      padding-top: 20px;
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
          max-height: calc(100vh - 350px);
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
            background: url("../../assets/imgs/none.png") center center no-repeat;
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
