<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="反馈"
        />
        <div class="app-panel">
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-select
                v-model="searchForm.type"
                size="small"
                clearable
                style="width: 120px"
                placeholder="反馈来源"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select
                v-model="searchForm.status"
                size="small"
                clearable
                style="width: 120px;margin: 0 5px"
                placeholder="状态"
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-date-picker
                v-model="createTime"
                unlink-panels
                clearable
                type="daterange"
                align="right"
                size="small"
                value-format="yyyy-MM-dd"
                style="width: 240px;margin-right:10px;"
                start-placeholder="起期"
                end-placeholder="止期"
              />
              <el-button
                type="primary"
                size="small"
                @click="queryAll(1)"
              >
                查询
              </el-button>
            </el-col>
          </el-row>
          <el-table
            v-loading="loading"
            :data="tableData"
            height="calc(100vh - 300px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              prop="name"
              label="反馈账号"
              width="150"
            />
            <el-table-column
              prop="companyName"
              label="所属公司"
              width="150"
            />
            <el-table-column
              prop="type"
              label="反馈来源"
              width="120"
            >
              <template slot-scope="scope">
                {{ (typeList.find(e => e.value === scope.row.type) || {}).label || '--' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="submitContent"
              label="反馈内容"
            />
            <el-table-column
              prop="status"
              label="状态"
              width="120"
            >
              <template slot-scope="scope">
                {{ (statusList.find(e => e.value === scope.row.status) || {}).label || '--' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="submitTime"
              label="提交时间"
              width="160"
            />
            <el-table-column
              fixed="right"
              width="150"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="showFeedback(scope.row)"
                >
                  详情
                </el-button>
                <el-button
                  type="text"
                  @click="deleteFeedback(scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
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
      </div>
    </div>
    <el-dialog
      title="反馈详情"
      :visible.sync="visible"
      :close-on-click-modal="false"
      width="500px"
      @close="closeDialog"
    >
      <el-form
        v-loading="dialogLoading"
        label-width="80px"
        size="small"
        style="padding-right: 20px;"
      >
        <el-form-item
          label="反馈账号:"
        >
          {{ feedbackInfo.name }}
        </el-form-item>
        <el-form-item
          label="反馈内容:"
        >
          {{ feedbackInfo.submitContent }}
        </el-form-item>
        <el-form-item
          label="状态:"
        >
          {{ (statusList.find(e => e.value === feedbackInfo.status) || {}).label || '--' }}
        </el-form-item>
        <el-form-item
          v-if="fileUrl"
          label="页面截图:"
        >
          <div class="imgUrl">
            <img :src="fileUrl">
            <div class="mask">
              <i
                class="el-icon-view mask-view-icon"
                @click="handlePreview"
              />
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div
        v-if="feedbackInfo.status === '0'"
        slot="footer"
        style="text-align: right"
      >
        <el-button
          size="small"
          @click="handleFeedback('2')"
        >
          忽略
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="handleFeedback('1')"
        >
          已处理
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="页面截图"
      :visible.sync="dialogVisible"
      top="20px"
      append-to-body
    >
      <img
        width="100%"
        :src="fileUrl"
      >
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import { getFeedbackList, delFeedback, getFeedBackById, handleFeedback } from '@/api/system-in-feedback'
import dayjs from 'dayjs'

@Component({
  name: 'Feedback',
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private dialogLoading: boolean = false
  private dialogVisible: boolean = false
  private visible: boolean = false
  private tableData: any[] = []
  private createTime: any[] = []
  private typeList: any[] = [
    {
      value: '0',
      label: '着陆页'
    },
    {
      value: '1',
      label: '后台管理系统'
    }
  ]
  private statusList: any[] = [
    {
      value: '0',
      label: '未处理'
    },
    {
      value: '1',
      label: '已处理'
    },
    {
      value: '2',
      label: '忽略'
    }
  ]
  private searchForm: any = {
    status: '',
    type: ''
  }
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  private feedbackInfo: any = {}
  private fileUrl: any = ''
  /* methods */
  private handleFeedback(status: string) {
    if (this.dialogLoading) return
    const params = {
      status,
      id: this.feedbackInfo.id
    }
    this.dialogLoading = true
    handleFeedback(params).then(() => {
      this.dialogLoading = false
      this.$message.success('操作成功')
      this.closeDialog()
      this.queryAll()
    }).catch(() => {
      this.dialogLoading = false
    })
  }
  private closeDialog() {
    this.visible = false
    this.feedbackInfo = {}
    this.fileUrl = ''
  }
  private handlePreview() {
    this.dialogVisible = true
  }
  private deleteFeedback(row: any) {
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const params = {
        id: row.id
      }
      this.loading = true
      delFeedback(params).then(() => {
        this.loading = false
        this.$message.success('删除成功')
        this.queryAll(1)
      }).catch(() => {
        this.loading = false
      })
    }).catch((err: any) => {
      return err
    })
  }
  private showFeedback(row: any) {
    const params = {
      id: row.id
    }
    this.loading = true
    this.fileUrl = ''
    getFeedBackById(params).then((res: any) => {
      this.loading = false
      this.visible = true
      this.feedbackInfo = res.data || {}
      if (this.feedbackInfo.imgUrl) {
        this.fileUrl = process.env.VUE_APP_OSS_PATH + this.feedbackInfo.imgUrl
      }
    }).catch(() => {
      this.loading = false
    })
  }
  private queryAll(val?: any): void {
    if (val === 1) {
      this.pagination.page = 1
    }
    const params: any = {
      model: {
        ...this.searchForm
      },
      page: this.pagination.page,
      size: this.pagination.size
    }
    if (this.createTime && this.createTime.length) {
      params.model.startTime = dayjs(this.createTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
      params.model.endTime = dayjs(this.createTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
    }
    this.loading = true
    getFeedbackList(params).then((res: any) => {
      this.loading = false
      const data = res.data
      this.tableData = data.result || []
      this.pagination.total = data.total || 0
    }).catch(() => {
      this.loading = false
      this.tableData = []
      this.pagination.total = 0
    })
  }
  private handleSizeChange(val: string) {
    this.pagination.size = Number(val)
    this.queryAll()
  }
  private handleCurrentChange(val: string) {
    this.pagination.page = Number(val)
    this.queryAll()
  }
  private created(): void {
    this.queryAll()
  }
}
</script>
<style lang="scss" scoped>
  .imgUrl{
    width: 100%;
    position: relative;
    img{
      width: 100%;
    }
    .mask{
      width: 100%;
      height: 100%;
      font-size: 14px;
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, .4);
      opacity: 0;
      transition: all .5s;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      &:hover{
        opacity: 1;
      }
    }
  }
  ::v-deep{
    .el-form-item--small.el-form-item{
      margin: 0;
    }
  }
</style>
