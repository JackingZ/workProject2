<template>
  <div
    v-loading="loading"
  >
    <div class="detail-back">
      <el-button
        type="text"
        @click="exportExcel"
      >
        导出
      </el-button>
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
      <div class="content">
        <div class="left-content">
          <div class="left-title">
            主单号
          </div>
          <div class="left-list">
            <div
              v-for="e in trackingNos"
              :key="e"
              class="item"
              :class="{active: e === activeNo}"
              @click="getExpressNoList(e)"
            >
              {{ e }}
            </div>
          </div>
        </div>
        <div class="right-content">
          <div class="right-title">
            <div class="left">
              子单号
            </div>
            <div class="pkgNo">
              箱号
            </div>
          </div>
          <div
            v-loading="detailLoading"
            class="right-list"
          >
            <div
              v-for="e in dataSource"
              :key="e.trackingNo"
              class="item"
              :class="{active: e.trackingNo === showStatusRow.trackingNo}"
              @click="getExpressStatusList(e)"
            >
              <div class="left">
                {{ e.trackingNo }}
              </div>
              <div class="pkgNo">
                {{ e.pkgNo }}
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="showStatusRow.trackingNo"
          class="express-status"
        >
          <div class="left-title">
            快递单状态
          </div>
          <div
            v-loading="statusLoading"
            class="left-list"
          >
            <div class="order-no">
              <span>快递单号：</span>
              <span>{{ showStatusRow.trackingNo }}</span>
            </div>
            <div class="status-list">
              <template v-if="statusList.length">
                <div
                  v-for="(item, i) in statusList"
                  :key="item.time"
                  class="status-item"
                  :class="{active: i === 0}"
                >
                  <div class="status-describe">
                    <div class="time">
                      {{ item.time }}
                    </div>
                    <div class="describe">
                      {{ item.description }}
                    </div>
                  </div>
                </div>
              </template>
              <div
                v-else
                class="none"
              >
                暂无状态信息
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getExpressNoList, exportExpressExcel, getExpressStatusList } from '@/api/orderlist-at-whole'
import dayjs from 'dayjs'
@Component({
  name: 'express'
})
export default class extends Vue {
  /* data */
  private detailLoading = false
  private statusLoading = false
  private loading = false
  private activeNo: any = ''
  private row: any = {}
  private dataSource: any[] = []
  private trackingNos: any[] = []
  private showStatusRow: any = {}
  private allStatusList: any[] = []

  /** computed */
  get statusList() {
    return this.allStatusList.filter((e: any) => e.trackingNo === this.showStatusRow.trackingNo).sort((a: any, b: any) => {
      return a.time < b.time ? 1 : -1
    })
  }
  /* methods */
  private exportExcel() {
    const params = {
      orderNo: this.row.code
    }
    this.loading = true
    exportExpressExcel(params).then((res: any) => {
      this.loading = false
      res.text().then((text: any) => {
        const resData = JSON.parse(text)
        if (resData.code !== 200) {
          this.$message.error(resData.msg || '文件下载失败')
        }
      }).catch(() => {
        const a: any = document.createElement('a')
        const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        const objUrl = URL.createObjectURL(blob)
        a.href = objUrl
        a.download = this.row.code + '单号' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.xls'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(objUrl)
      })
    }).catch((err: any) => {
      this.loading = false
      err.data && err.data && err.data.text && err.data.text().then((text: any) => {
        try {
          const resData = JSON.parse(text)
          if (resData.code !== 200) {
            this.$message.error(resData.msg || '文件下载失败')
          }
        } catch (e) {
          return e
        }
      })
    })
  }
  private goBack() {
    this.dataSource = []
    this.trackingNos = []
    this.row = {}
    this.allStatusList = []
    this.showStatusRow = {}
    this.$emit('back')
  }
  private getExpressNoList(key: any) {
    if (!key) return
    this.activeNo = key
    const params = {
      expressNo: key
    }
    this.detailLoading = true
    this.dataSource = []
    getExpressNoList(params).then((res: any) => {
      this.detailLoading = false
      this.dataSource = res.data || []
    }).catch(() => {
      this.detailLoading = true
    })
  }
  private show(row: any) {
    this.row = row
    const express = row.express || {}
    const trackingNos = express.trackingNos || ''
    this.trackingNos = trackingNos.split(',')
    this.getExpressNoList(this.trackingNos[0])
  }
  private getExpressStatusList(row: any) {
    this.showStatusRow = row
    const params = {
      id: row.expressOrderId
    }
    this.statusLoading = true
    getExpressStatusList(params).then((res: any) => {
      this.statusLoading = false
      const data = res.data || {}
      let allStatus = []
      try {
        allStatus = JSON.parse(data.allStatus)
      } catch (e) {
        allStatus = []
      }
      this.allStatusList = allStatus.map((e: any) => {
        e.time = dayjs(e.time, { format: 'YYYYMMDD HHmmss' }).format('YYYY-MM-DD HH:mm:ss')
        return e
      })
    }).catch(() => {
      this.allStatusList = []
      this.statusLoading = false
    })
  }
}
</script>

<style lang="scss" scoped>
  .order-detail {
    height: calc(100vh - 170px);
    overflow-y: auto;
  }

  .detail-back {
    padding: 5px 20px;
    border-bottom: 1px solid #e8e8e8;
    text-align: right;
    background-color: #fff;
  }
  .content{
    display: flex;
    .express-status,
    .right-content,
    .left-content{
      width: 350px;
      border: 1px solid #eee;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #303133;
      margin-right: 20px;
      .right-title,
      .left-title{
        width: 100%;
        padding: 10px;
        border-bottom: 1px solid #eee;
      }
      .right-title{
        display: flex;
        .left{
          flex: 1;
        }
        .pkgNo{
          flex: 1;
        }
      }
      .right-list,
      .left-list{
        height: calc(100vh - 300px);
        overflow-y: auto;
        .item{
          cursor: pointer;
          width: 100%;
          padding: 10px;
          transition: all .3s;
          &:hover{
            background: #F7F7F7;
          }
          &.active{
            background: #F7F7F7;
          }
        }
      }
      .right-list{
        .item{
          display: flex;
          .left{
            flex: 1;
          }
          .pkgNo{
            flex: 1;
          }
        }
      }
    }
    .right-content{
      width: 500px;
    }
    .express-status{
      flex: 1;
      .left-list{
        padding: 10px;
        .order-no{
          font-size: 18px;
          font-family: PingFang SC;
          font-weight: bold;
          color: #333333;
          margin-bottom: 20px;
        }
        .status-list{
          .status-item{
            padding-left: 48px;
            .status-describe{
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
                  background-color: #909399;
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
              .status-describe{
                .time{
                  &:before{
                    content: '';
                    width: 9px;
                    height: 9px;
                    border-radius: 50%;
                    background-color: #FF7D19;
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
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #5e6d82;
          }
        }
      }
    }
  }
</style>
