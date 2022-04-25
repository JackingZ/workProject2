<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;height: calc(100vh - 114px);"
    >
      <div class="app-container">
        <head-info
          info=""
          title="PDA版本管理"
        />
        <div class="app-panel">
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-button
                v-permission="['addStock']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="float: left;"
                @click="addPDA"
              >
                新增版本
              </el-button>
              <el-date-picker
                v-model="createTime"
                :clearable="false"
                unlink-panels
                type="daterange"
                align="right"
                size="small"
                value-format="yyyy-MM-dd"
                style="width: 240px;margin-right:10px;"
                start-placeholder="起期"
                end-placeholder="止期"
              />
              <el-button
                v-permission="['queryStock']"
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
            height="calc(100vh - 330px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              prop="versions"
              label="版本号"
            />
            <!-- <el-table-column
              prop="logs"
              label="更新日志"
              min-width="120"
            /> -->
            <el-table-column
              prop="createTime"
              label="发布时间"
              width="160"
            />
            <el-table-column
              label="下载apk"
              width="200"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="!$checkPermission(['PDALoadAPK'])"
                  type="text"
                  @click="loadAPK(scope.row)"
                >
                  下载apk
                </el-button>
                <el-button
                  v-copy="scope.row.apkUrl"
                  type="text"
                >
                  复制下载链接
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态"
              width="120"
            >
              <template slot-scope="scope">
                <el-switch
                  :value="scope.row.status"
                  :disabled="!$checkPermission(['stockChangeStatus'])"
                  class="switchStyle"
                  active-text="上线"
                  inactive-text="下线"
                  :active-value="1"
                  :inactive-value="0"
                  @change="(value) => onStatus(scope.row, value)"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="uploaded"
              label="是否强制更新"
              width="140"
            >
              <template slot-scope="scope">
                <span v-show="scope.row.uploaded === 1">强制更新</span>
                <span v-show="scope.row.uploaded === 0">不强制更新</span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              width="150"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['deleteStock']"
                  type="text"
                  @click="deletePDA(scope.row)"
                >
                  删除
                </el-button>
                <el-button
                  type="text"
                  @click="updateLog(scope.row)"
                >
                  更新日志
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

          <el-dialog
            :title="isEdit ? '编辑版本' : '新增版本'"
            :visible.sync="isAddEditVisible"
            :close-on-click-modal="false"
            width="600px"
            @close="cancel"
          >
            <div style="padding-right: 20px;">
              <el-form
                ref="editForm"
                v-loading="formLoading"
                :model="selectForm"
                :rules="formRules"
                label-width="120px"
                label-position="right"
                size="small"
              >
                <el-form-item
                  label="版本号"
                  prop="versions"
                >
                  <el-input
                    ref="firstInput"
                    v-model="selectForm.versions"
                    :maxlength="20"
                    placeholder="请输入"
                  />
                </el-form-item>
                <el-form-item
                  label="更新日志"
                  prop="content"
                >
                  <markdown-editor
                    ref="markdownEditor"
                    v-model="selectForm.content"
                    :options="{hideModeSwitch: true, previewStyle: 'tab', toolbarItems: ['heading','bold','italic']}"
                    height="200px"
                  />
                </el-form-item>
                <el-form-item
                  label="上传apk"
                  prop="path"
                >
                  <el-upload
                    ref="uploadFile"
                    action
                    multiple
                    :limit="1"
                    :http-request="uploadFile"
                    :on-remove="onFileRemove"
                    :before-upload="beforeUpload"
                    :file-list="fileList"
                  >
                    <el-button
                      size="small"
                    >
                      <i class="el-icon-upload" />
                      选择文件
                    </el-button>
                  </el-upload>
                </el-form-item>
                <el-form-item
                  label="是否强制更新"
                  prop="uploaded"
                >
                  <el-radio-group
                    v-model="selectForm.uploaded"
                  >
                    <el-radio
                      :label="0"
                    >
                      否
                    </el-radio>
                    <el-radio
                      :label="1"
                    >
                      是
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </div>
            <div
              slot="footer"
              class="dialog-footer"
            >
              <el-button @click="cancel">
                取 消
              </el-button>
              <el-button
                type="primary"
                @click="confirm"
              >
                确 定
              </el-button>
            </div>
          </el-dialog>
          <el-dialog
            :title="logRow.versions + '更新日志'"
            :visible.sync="visible"
            :close-on-click-modal="false"
            width="600px"
            @close="visible = false"
          >
            <!--eslint-disable-->
            <div
              v-html="logRow.logs"
            />
            <!--eslint-enable-->
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getPDAList,
  getSwitch,
  getLoad,
  savePDA,
  deletePDA,
  uploadFile,
  delFile
} from '@/api/system-in-pda-config'
import MarkdownEditor from '@/components/MarkdownEditor/index.vue'
import dayjs from 'dayjs'

@Component({
  name: '',
  components: {
    MarkdownEditor
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private isAddEditVisible: boolean = false
  private visible: boolean = false
  private isEdit: boolean = false
  private tableData: any[] = []
  private logRow: any = {}
  private selectForm: any = {
    versions: undefined,
    path: undefined,
    content: undefined,
    logs: undefined,
    uploaded: undefined
  }
  private createTime: any[] = []
  private formLoading: boolean = false
  private page: number = 1
  private size: number = 10
  private total: any = 0
  private fileList: any[] = []
  private formRules = {
    versions: [{ required: true, message: '版本号不能为空', trigger: 'blur' }],
    content: [{ required: true, message: '更新日志不能为空', trigger: 'blur' }],
    path: [{ required: true, message: '上传apk不能为空', trigger: 'blur' }],
    uploaded: [{ required: true, message: '请选择是否强制更新', trigger: 'change' }]
  }

  /* computed */

  /* methods */
  // 下载apk
  private loadAPK(row: any): void {
    if (row.path) {
      window.open(process.env.VUE_APP_OSS_PATH + row.path)
    }
  }
  private updateLog(row: any) {
    this.logRow = row
    this.visible = true
  }
  // 状态变化
  private async onStatus(row:any, value: any) {
    if (row.status === value) {
      return
    }
    if (value === 1) {
      const flag = this.tableData.some((e: any) => e.status === 1)
      if (flag) {
        this.$message.warning('只允许存在一个线上版本')
        return
      }
    }
    const text = value === 0 ? '禁用' : '开启'
    const [cancel, confirm] = await this.$confirm(
      `此操作将${text}该版本服务，是否继续？`,
      '提示',
      {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(res => {
        return [null, res]
      })
      .catch(err => {
        return [err, null]
      })
    if (cancel) return
    getSwitch({
      id: row.id
    })
      .then((res: any) => {
        this.$message.success('修改成功')
        this.queryAll()
      })
      .catch((err: any) => {
        return err
      })
  }
  private beforeUpload(file: any) {
    const name = file.name
    if (name.indexOf('.apk') === -1) {
      this.fileList = []
      this.selectForm.path = ''
      this.$message.error('仅支持apk文件')
      return false
    }
  }
  private uploadFile(data: any) {
    const formData = new FormData()
    const arr = data.file.name.split('.')
    const file = new File([data.file], '聚货通仓储' + new Date().getTime() + '.' + arr[arr.length - 1], { type: data.file.type })
    formData.append('file', file)
    this.formLoading = true
    uploadFile(formData).then((res: any) => {
      this.formLoading = false
      const result: any = res.data || {}
      this.selectForm.path = result.objectName
      this.$message.success('文件上传成功')
    }).catch(() => {
      this.formLoading = false
      this.selectForm.path = ''
    })
  }
  private onFileRemove() {
    const params = {
      ifPublic: true,
      fileList: [this.selectForm.path]
    }
    this.formLoading = true
    delFile(params).then(() => {
      this.formLoading = false
      this.selectForm.path = ''
      this.$message.success('文件删除成功')
    }).catch(() => {
      this.formLoading = false
      this.$message.success('文件删除失败')
    })
  }
  // 新增
  private addPDA(): void {
    this.isEdit = false
    this.isAddEditVisible = true
    this.$nextTick(() => {
      const ele:any = this.$refs.firstInput
      ele.focus()
    })
  }

  // 删除
  private deletePDA(row: any) {
    const params = {
      id: row.id
    }
    if (row.status === 1) {
      this.$message.warning('线上版本不允许删除')
      return
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deletePDA(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.queryAll()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }
  // 重置表单
  private cancel() {
    this.isAddEditVisible = false
    this.selectForm = {
      versions: undefined,
      ptah: undefined,
      content: undefined,
      logs: undefined,
      path: undefined,
      uploaded: undefined
    }
    this.fileList = []
    this.$nextTick(() => {
      const editForm: any = this.$refs.editForm
      editForm.clearValidate()
    })
  }

  // 提交保存
  private confirm() {
    const editForm: any = this.$refs.editForm
    editForm.validate((valid: any) => {
      if (!valid) {
        return false
      }
      this.formLoading = true
      const params: any = {
        ...this.selectForm
      }
      const html = (this.$refs.markdownEditor as MarkdownEditor).getHtml()
      params.logs = html
      savePDA(params)
        .then((res: any) => {
          this.formLoading = false
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.isAddEditVisible = false
          this.cancel()
          this.queryAll()
        })
        .catch((err: any) => {
          this.formLoading = false
          return err
        })
    })
  }

  private queryAll(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const params: any = {
      model: {
        start: this.createTime[0] + ' 00:00:00',
        end: this.createTime[1] + ' 23:59:59'
      },
      page: this.page,
      size: this.size
    }
    getPDAList(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        this.tableData = (data.result || []).map((e: any) => {
          e.apkUrl = process.env.VUE_APP_OSS_PATH + e.path
          return e
        })
        this.total = data.total
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.queryAll()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.queryAll()
  }

  private created(): void {
    this.createTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    this.queryAll()
  }
}
</script>
<style lang="scss" scoped>

</style>
