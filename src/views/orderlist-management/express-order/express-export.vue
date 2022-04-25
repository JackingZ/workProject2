<template>
  <el-dialog
    title="下载指定快递标签"
    width="960px"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close="close"
  >
    <div v-loading="formLoading">
      <el-transfer
        ref="transferItem"
        v-model="selectExpressNos"
        filterable
        :filter-method="filterMethod"
        :titles="['全部', '已选择']"
        :props="{key: 'trackingNo', label: 'trackingNo'}"
        filter-placeholder="输入搜索"
        :data="expressNos"
        style="height: 500px;"
      />
      <div
        slot="footer"
        style="text-align: right;padding-top: 20px;"
      >
        <el-button
          size="small"
          :disabled="formLoading"
          @click="close"
        >
          取 消
        </el-button>
        <el-button
          type="primary"
          :disabled="formLoading"
          size="small"
          @click="confirmExport"
        >
          确 定
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getExpressNos,
  downLoadTrackingFile
} from '@/api/orderlist-at-express'
import dayjs from 'dayjs'

@Component({
  name: ''
})
export default class extends Vue {
  private visible: boolean = false
  private formLoading: boolean = false
  private selectExpressNos: any[] = []
  private expressNos: any[] = []

  private show(identificationNo: string) {
    this.visible = true
    const params = identificationNo.split(',')
    this.formLoading = true
    getExpressNos(params).then((res: any) => {
      this.expressNos = res.data
      this.formLoading = false
    }).catch(() => {
      this.expressNos = []
      this.formLoading = false
    })
  }
  private close() {
    this.visible = false
    this.selectExpressNos = []
    this.expressNos = []
  }
  private confirmExport() {
    if (this.selectExpressNos.length === 0) {
      this.$message.warning('请选择需要下载的快递单号')
      return
    }
    const params = this.selectExpressNos
    this.formLoading = true
    downLoadTrackingFile(params).then((res: any) => {
      this.formLoading = false
      this.close()
      const url = window.URL.createObjectURL(res)
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.href = url
      a.download = '快递标签' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.pdf'
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }).catch((err: any) => {
      this.formLoading = false
      err.data.text().then((text: any) => {
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
  private filterMethod(query: any, item: any): boolean {
    const trackingNo = (item.trackingNo || '').toUpperCase()
    return trackingNo.indexOf(query.toUpperCase()) > -1
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-transfer-panel{
    width: 40%;
    height: 100%;
  }

  ::v-deep .el-transfer{
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
  }

  ::v-deep .el-transfer-panel__list.is-filterable{
    display: flex;
    flex-flow: column nowrap;
    height: 100%;
  }

  ::v-deep .el-transfer-panel__body{
    height: 78%;
  }
</style>
