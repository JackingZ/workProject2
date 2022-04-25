<template>
  <div v-loading="loading">
    <div
      class="form"
      style="display: flex;justify-content: space-between;margin-bottom: 10px"
    >
      <div class="form-item">
        <el-checkbox
          v-model="clearanceChecked"
          size="mini"
          :disabled="(fileList || []).some(e => e.type === 2 && (e.status !== 0 && e.status !== 1))"
          @change="checkChange('c')"
        >
          通关认证
        </el-checkbox>
        <el-select
          v-model="clearanceSelectList"
          placeholder="请选择"
          style="width: 250px;margin-right: 5px;"
          size="mini"
          :disabled="!clearanceChecked"
          clearable
          filterable
          collapse-tags
          multiple
          @change="handlerChange"
        >
          <el-option
            v-for="item in clearanceList"
            :key="item.fileId"
            :disabled="item.disabled"
            :label="item.fileName"
            :value="item.fileId"
          />
        </el-select>
      </div>
      <div class="form-item">
        <el-checkbox
          v-model="transportChecked"
          size="mini"
          :disabled="(fileList || []).some(e => e.type === 1 && (e.status !== 0 && e.status !== 1))"
          @change="checkChange('t')"
        >
          运输认证
        </el-checkbox>
        <el-select
          v-model="transportSelectList"
          placeholder="请选择"
          style="width: 250px;margin-right: 5px;"
          size="mini"
          :disabled="!transportChecked"
          clearable
          filterable
          collapse-tags
          multiple
          @change="handlerChange"
        >
          <el-option
            v-for="item in transportList"
            :key="item.fileId"
            :label="item.fileName"
            :disabled="item.disabled"
            :value="item.fileId"
          />
        </el-select>
      </div>
    </div>
    <el-table
      :data="fileList"
      height="400px"
      border
      style="width: 100%;"
    >
      <el-table-column
        width="100"
        property="status"
        label="文件状态"
      >
        <template slot-scope="inScope">
          {{ inScope.row.url ? '已上传' : '待上传' }}
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        property="status"
        label="审核状态"
      >
        <template slot-scope="inScope">
          {{ (fileStatus.find(e => e.id === inScope.row.status) || {}).name }}
        </template>
      </el-table-column>
      <el-table-column
        min-width="100"
        property="fileName"
        label="文件名"
      />
      <el-table-column
        min-width="100"
        label="拒绝原因"
        show-overflow-tooltip
      >
        <template slot-scope="inScope">
          {{ inScope.row.status === 4 ? inScope.row.reason : '' }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        width="200"
        label="操作"
      >
        <template slot-scope="inScope">
          <el-button
            v-if="inScope.row.status !== 2 && inScope.row.status !== 3"
            type="text"
            size="mini"
            @click="delFileItem(inScope.$index, inScope.row)"
          >
            删除
          </el-button>
          <el-button
            v-if="inScope.row.url"
            type="text"
            size="mini"
            @click="downloadFileItem(inScope.row.url)"
          >
            下载
          </el-button>
          <el-button
            v-if="inScope.row.url"
            type="text"
            size="mini"
            @click="viewFileItem(inScope.row.url)"
          >
            查看
          </el-button>
          <el-button
            v-if="inScope.row.url && inScope.row.status === 1"
            type="text"
            size="mini"
            @click="auditFileItem(2, inScope.row)"
          >
            审核
          </el-button>
          <el-button
            v-if="inScope.row.url && inScope.row.status === 2"
            type="text"
            size="mini"
            style="margin-right: 10px"
            @click.stop="auditFileItem(3, inScope.row)"
          >
            审核通过
          </el-button>
          <el-popover
            v-model="inScope.row.isShowPopover"
            placement="bottom"
            width="300"
            title=""
            trigger="manual"
            @click.stop="() => {}"
          >
            <div
              class="form"
              style="display: flex;"
            >
              <div style="white-space: nowrap;margin-right: 5px;">
                拒绝原因
              </div>
              <el-input
                v-model="reason"
                type="textarea"
                :autosize="{minRows: 3, maxRows: 6}"
                placeholder="请输入内容"
              />
            </div>
            <div style="text-align: right; margin-top: 10px">
              <el-button
                size="mini"
                @click="popoverHide"
              >
                取消
              </el-button>
              <el-button
                type="primary"
                size="mini"
                @click="auditFileItem(4, inScope.row)"
              >
                保存
              </el-button>
            </div>
            <el-button
              v-show="inScope.row.url && inScope.row.status === 2"
              slot="reference"
              type="text"
              size="mini"
              @click.stop="popoverShow(inScope.row)"
            >
              审核拒绝
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right; margin-top: 10px">
      <el-button
        slot="footer"
        type="primary"
        size="small"
        @click="saveFiles"
      >
        保存
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getOrderDetails } from '@/api/orderlist-at-whole'
import {
  getFile,
  getFileList,
  saveFileList,
  auditFile
} from '@/api/system-in-commodity-audit'

@Component({
  name: ''
})
export default class extends Vue {
  private loading: boolean = false
  private clearanceChecked: boolean = false
  private transportChecked: boolean = false
  private clearanceSelectList: any[] = []
  private clearanceList: any[] = []
  private transportSelectList: any[] = []
  private transportList: any[] = []
  private fileList: any[] = []
  private fileListCopy: any[] = []
  private fileStatus: any[] = [
    // {
    //   id: 0,
    //   name: '待上传'
    // },
    {
      id: 1,
      name: '待审核'
    },
    {
      id: 2,
      name: '审核中'
    },
    {
      id: 3,
      name: '审核通过'
    },
    {
      id: 4,
      name: '审核拒绝'
    }
  ]
  private orderInfo: any = {}
  private reason = ''

  /* methods */

  private async getClearanceList() {
    await getFile({ type: 2 }).then((res: any) => {
      this.clearanceList = (res.data || []).map((e: any) => {
        return {
          fileName: e.fileName,
          fileId: e.id,
          type: 2
        }
      })
    }).catch(() => {
      this.clearanceList = []
      this.loading = false
    })
  }
  private async getTransportList() {
    await getFile({ type: 1 }).then((res: any) => {
      this.transportList = (res.data || []).map((e: any) => {
        return {
          fileName: e.fileName,
          fileId: e.id,
          type: 1
        }
      })
    }).catch(() => {
      this.transportList = []
      this.loading = false
    })
  }
  private handlerChange() {
    const selectAllList = [...this.clearanceSelectList, ...this.transportSelectList]
    const allList = [...this.clearanceList, ...this.transportList]
    const fileList: any[] = []
    selectAllList.map((e: any) => {
      const tamp = allList.find((item: any) => item.fileId === e)
      if (tamp) {
        const c = this.fileListCopy.find((item: any) => item.fileId === e)
        fileList.push({
          declareId: this.orderInfo.id,
          id: c ? c.id : tamp.id,
          fileId: c ? c.fileId : tamp.fileId,
          fileName: c ? c.fileName : tamp.fileName,
          status: c ? c.status : 0,
          type: c ? c.type : tamp.type,
          url: c ? c.url : ''
        })
      }
    })
    this.fileList = fileList
    this.disList()
  }
  private checkChange(type: string) {
    if (type === 'c') {
      this.clearanceSelectList = []
      this.fileList = this.fileList.filter((e: any) => e.type !== 2)
    }
    if (type === 't') {
      this.transportSelectList = []
      this.fileList = this.fileList.filter((e: any) => e.type !== 1)
    }
    this.disList()
  }
  private downloadFileItem(url: string) {
    if (url) {
      window.open(process.env.VUE_APP_OSS_PATH + url)
    }
  }
  private viewFileItem(url: string) {
    if (url) {
      window.open(process.env.VUE_APP_OSS_PATH + url)
      // const a = document.createElement('a')
      // document.body.appendChild(a)
      // a.href = url
      // a.click()
      // document.body.removeChild(a)
    }
  }
  private delFileItem(index: number, row: any) {
    this.fileList.splice(index, 1)
    this.clearanceSelectList = this.fileList.filter((e: any) => e.type === 2).map((e: any) => e.fileId)
    this.transportSelectList = this.fileList.filter((e: any) => e.type === 1).map((e: any) => e.fileId)
    this.clearanceChecked = this.clearanceSelectList.length > 0
    this.transportChecked = this.transportSelectList.length > 0
    this.disList()
  }

  private popoverHide() {
    this.fileList = this.fileList.map((e: any) => {
      e.isShowPopover = false
      return e
    })
  }
  private popoverShow(row: any) {
    this.reason = row.reason || ''
    this.fileList = this.fileList.map((e: any) => {
      e.isShowPopover = false
      if (e.id === row.id) {
        e.isShowPopover = true
      }
      return e
    })
  }
  private async auditFileItem(status: number, row: any) {
    if (status === 4 && !this.reason) {
      this.$message.error('请填写拒绝原因')
      return
    }
    const { isShowPopover, ...obj } = row
    try {
      this.loading = true
      const res = await auditFile({
        ...obj,
        status,
        reason: status === 4 ? this.reason : undefined
      })
      this.loading = false
      this.$message.success('保存成功')
      await this.getFileData()
    } catch (error) {
      this.loading = false
    }
  }

  private saveFiles() {
    const params: any = {
      list: this.fileList,
      id: this.orderInfo.id
    }
    this.loading = true
    saveFileList(params).then((res: any) => {
      this.loading = false
      this.$message.success('保存成功')
      this.$emit('filesCancel')
    }).catch(_ => {
      this.loading = false
    })
  }
  private cancel() {
    this.fileListCopy = []
    this.fileList = []
    this.clearanceSelectList = []
    this.transportSelectList = []
  }
  private async setData(row: any) {
    this.orderInfo = row || {}
    await this.getFileData()
  }
  private async getFileData() {
    try {
      this.loading = true
      const res = await getFileList({ declareId: this.orderInfo.id })
      const data = res.data || []
      this.fileList = data
      this.fileListCopy = JSON.parse(JSON.stringify(data))
      this.loading = false
    } catch (error) {
      this.loading = false
    }
    await this.getClearanceList()
    await this.getTransportList()
    this.clearanceSelectList = this.fileList.filter((e: any) => e.type === 2).map((e: any) => e.fileId)
    this.transportSelectList = this.fileList.filter((e: any) => e.type === 1).map((e: any) => e.fileId)
    this.clearanceChecked = this.clearanceSelectList.length > 0
    this.transportChecked = this.transportSelectList.length > 0
    this.disList()
  }
  private disList() {
    this.clearanceList = this.clearanceList.map((e: any) => {
      e.disabled = false
      const tamp = this.fileList.find((f: any) => f.fileId === e.fileId) || {}
      if (this.clearanceSelectList.indexOf(e.fileId) !== -1 && (tamp.status === 2 || tamp.status === 3)) {
        e.disabled = true
      }
      return e
    })
    this.transportList = this.transportList.map((e: any) => {
      e.disabled = false
      const tamp = this.fileList.find((f: any) => f.fileId === e.fileId) || {}
      if (this.transportSelectList.indexOf(e.fileId) !== -1 && (tamp.status === 2 || tamp.status === 3)) {
        e.disabled = true
      }
      return e
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
