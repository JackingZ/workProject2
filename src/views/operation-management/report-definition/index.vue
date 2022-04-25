<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="报表定义"
        />
        <div
          class="app-panel"
        >
          <el-row>
            <el-col :span="4">
              <el-button
                v-permission="['reportsAdd']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-left: 10px"
                @click="addForm"
              >
                新增报表
              </el-button>
            </el-col>
            <el-col
              :span="20"
              style="text-align:right;"
            >
              <el-input
                v-model="selectValue.name"
                size="small"
                placeholder="请输入"
                class="input-with-select"
                style="width:280px;margin-right:10px;"
              >
                <template slot="prepend">
                  报表名称
                </template>
              </el-input>
              <el-button
                v-permission="['reportsQuery']"
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
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <!-- <el-table-column
              prop="serialNo"
              label="序号"
              width="100"
            /> -->
            <el-table-column
              prop="name"
              width="230"
              label="报表名称"
            />
            <el-table-column
              prop="tag"
              width="150"
              label="报表标识"
            />
            <el-table-column
              prop="ip"
              min-width="120"
              label="报表地址"
            />
            <!-- <el-table-column
              prop="category"
              label="报表类型"
              min-width="120"
            /> -->
            <!-- <el-table-column
              :formatter="formatValue"
              label="报表格式"
              width="100"
            /> -->
            <!-- <el-table-column
              prop="fileName"
              label="报表文件名"
              min-width="120"
            /> -->
            <!-- <el-table-column
              prop="ifNeedParam"
              width="100"
              label="需要参数"
            >
              <template slot-scope="{row}">
                {{ row.ifNeedParam ? '是' : '否' }}
              </template>
            </el-table-column> -->
            <!-- <el-table-column
              width="130"
              label="关联代理商"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="associatedAgent(scope.row)"
                >
                  关联代理商
                </el-button>
              </template>
            </el-table-column> -->
            <!-- <el-table-column
              fixed="right"
              width="120"
              label="启用状态"
            >
              <template slot-scope="scope">
                <el-switch
                  :value="scope.row.status"
                  class="switchStyle"
                  active-text="启用"
                  inactive-text="禁用"
                  :active-value="true"
                  :inactive-value="false"
                  @input="(value) => onStatus(scope.row, value)"
                />
              </template>
            </el-table-column> -->
            <el-table-column
              prop="createTime"
              label="添加时间"
              width="180"
            />
            <el-table-column
              fixed="right"
              width="160"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['reportsUpdate']"
                  type="text"
                  @click="editForm(scope.row)"
                >
                  编辑
                </el-button>
                <!-- <el-button
                  v-permission="['reportsDel']"
                  type="text"
                  @click="deletData(scope.row)"
                >
                  删除
                </el-button> -->
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
        <!-- 穿梭框 -->
        <el-dialog
          :title="title"
          :visible.sync="isItemDialogShow"
          :close-on-click-modal="false"
          width="960px"
          @close="closeAgent"
        >
          <div v-loading="agentLoading">
            <el-transfer
              ref="transferItem"
              v-model="agentForm.selectAgents"
              filterable
              :filter-method="filterMethod"
              :titles="['选择关联代理商', '已关联代理商']"
              :props="{key: 'id', label: 'name'}"
              filter-placeholder="输入搜索"
              :data="agentList"
              style="height: 500px;"
            />
          </div>

          <div
            slot="footer"
            style="text-align: right;margin: 0 40px 0;"
          >
            <el-button
              size="small"
              @click="closeAgent"
            >
              取 消
            </el-button>

            <el-button
              type="primary"
              size="small"
              @click="setAgentConfirm"
            >
              确 定
            </el-button>
          </div>
        </el-dialog>

        <el-dialog
          :title="editTitle"
          :visible.sync="isEditFormShow"
          :close-on-click-modal="false"
          width="600px"
          @closed="closeForm"
        >
          <add-edit-form
            ref="editForm"
            :select-form="selectForm"
            :loading="isEditFormLoading"
            :format-list="formatList"
            :page-list="pageList"
            @saveConfirm="saveConfirm"
            @closeForm="closeForm"
          />
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="closeForm">
              取 消
            </el-button>
            <el-button
              type="primary"
              @click="saveConfirm"
            >
              确 定
            </el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'

import {
  getReportList,
  getAgentList,
  saveReport,
  deleteReport,
  changeReportStatus,
  getAgentById,
  saveReportAgent
} from '@/api/operation-of-report-definition'
import addEditForm from '@/views/operation-management/report-definition/addEditForm.vue'

function formParam() {
  return {
    name: undefined,
    serialNo: undefined,
    ip: undefined,
    category: undefined,
    report: undefined,
    format: undefined,
    fileName: undefined,
    ifNeedParam: false,
    tag: undefined,
    id: undefined
  }
}

@Component({
  name: 'Port',
  components: {
    addEditForm
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private isEdit: boolean = false
  private editTitle = ''
  private isEditFormShow: boolean = false
  private isEditFormLoading: boolean = false
  private tableData: any = []
  private currentId = ''
  private currentServiceId = ''
  private title = '关联代理商'
  private agentForm = {
    selectAgents: []
  }
  private selectValue: any = {
    name: undefined
  }
  private selectForm = formParam()
  private pageList: any[] = [
    { name: 'aaa', id: '0' },
    { name: 'bbb', id: '1' },
    { name: 'ccc', id: '2' }
  ]
  private selectLoading = false
  private agentList :any[] = []
  private formatList: any[] = [
    { name: 'rpx', id: 0 },
    { name: 'rpm', id: 1 },
    { name: 'rpr', id: 2 },
    { name: 'xls', id: 3 },
    { name: 'xlsx', id: 4 }
  ] // 服务类型
  private agentLoading = false
  private isItemDialogShow: boolean = false
  private props: any = {
    label: 'name',
    value: 'id'
  }
  private page: number = 1
  private size: number = 10
  private total: any = 0

  /* computed */

  get labelPosition() {
    const lang = AppModule.language
    if (!lang) {
      return 'left'
    }
    return lang === 'en' ? 'top' : 'left'
  }

  get lang() {
    const lang = AppModule.language
    if (!lang) {
      return 'en'
    }
    return lang
  }

  // 所属公司id
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }
  // 所属公司Name
  get custName(): string {
    const info = UserModule.info || {}
    const custName = (info as any).custName
    return custName
  }
  /* methods */
  private formatValue(val: any) {
    let nom = ''
    this.formatList.map((it: any) => {
      if (it.id === val.format) {
        nom = it.name
      }
    })
    return nom
  }
  // 删除
  private deletData(row: any) {
    const params = {
      id: row.id
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteReport(params)
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
  // 新增
  private addForm(): void {
    this.isEdit = false
    this.editTitle = '新增报表'
    this.isEditFormShow = true
    this.$nextTick(() => {
      const form: any = this.$refs.editForm
      const ele:any = form.$refs.firstInput
      ele.focus()
    })
  }
  // 编辑
  private editForm(row: any): void {
    this.currentId = row.id
    this.selectForm = { ...row }
    this.isEdit = true
    this.editTitle = '编辑报表'
    this.isEditFormShow = true
  }

  // 重置表单
  private resetForm() {
    this.selectForm = formParam()
    const root: any = this.$refs.editForm
    const editForm: any = root.$refs.selectForm
    this.$nextTick(() => {
      editForm.clearValidate()
    })
  }
  // 取消
  private closeForm(): void {
    this.isEditFormShow = false
    this.resetForm()
  }

  // 提交保存
  private saveConfirm() {
    const root: any = this.$refs.editForm
    const editForm: any = root.$refs.selectForm
    editForm.validate((valid: any) => {
      if (valid) {
        this.isEditFormLoading = true
        const params: any = {
          id: this.selectForm.id,
          ip: this.selectForm.ip,
          tag: this.selectForm.tag,
          name: this.selectForm.name
        }
        saveReport(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.isEditFormLoading = false
            this.closeForm()
            this.queryAll()
          })
          .catch(err => {
            this.isEditFormLoading = false
            return err
          })
      } else {
        return false
      }
    })
  }

  // 获取代理商列表
  private getAgentList() {
    const params = {
      page: 1,
      size: 9999,
      parentId: (this as any).custId
    }
    getAgentList(params).then(res => {
      const data = res.data || {}
      const result = data.result || []
      this.agentList = result.filter((it: any) => it.status === '1')
    }).catch(err => {
      return err
    })
  }
  private filterMethod(query: any, item: any): boolean {
    const name = item.name || ''
    return name.indexOf(query) > -1
  }
  private closeAgent() {
    this.isItemDialogShow = false
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
  }
  // 设置关联代理商
  private setAgentConfirm() {
    this.agentLoading = true
    const agents = this.agentForm.selectAgents.map((item: any) => {
      const targetInfo = this.agentList.find(info => info.id === item) || {}
      const name = targetInfo.name
      return {
        agentId: item,
        name
      }
    })
    const params: any = {
      list: [],
      reportId: this.currentServiceId
    }
    params.list = agents.filter((it: any) => it.name && it.agentId)
    saveReportAgent(params)
      .then(res => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.closeAgent()
        this.agentLoading = false
        this.queryAll()
      })
      .catch(err => {
        this.agentLoading = false
        return err
      })
  }
  // 关联代理商
  private associatedAgent(row: any) {
    this.title = '关联代理商' + '【' + row.name + '】'
    this.isItemDialogShow = true
    this.currentServiceId = row.id
    this.agentLoading = true
    const params = {
      reportId: row.id
    }
    getAgentById(params)
      .then(res => {
        this.agentLoading = false
        const result: any = res.data || []
        this.agentForm.selectAgents = result
      })
      .catch(err => {
        this.agentLoading = false
        return err
      })
  }

  // 监听状态改变
  private async onStatus(row: any, value: any): Promise<void> {
    if (!row.status || row.status === value) {
      return
    }
    const text = value ? '开启' : '禁用'
    const [cancel, confirm] = await this.$confirm(
      `此操作将${text}该报表，是否继续？`,
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
    changeReportStatus({
      id: row.id
    })
      .then(res => {
        this.$message.success('修改成功')
        this.queryAll()
      })
      .catch(err => {
        return err
      })
  }

  // 分页
  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.queryAll()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.queryAll()
  }
  private queryAll(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const params: any = {
      ...this.selectValue,
      page: this.page,
      size: this.size
    }
    getReportList(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        this.tableData = data.result || []
        this.total = res.data.total
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

  private created(): void {
    this.queryAll()
    this.getAgentList()
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-transfer-panel {
  width: 40%;
  height: 100%;
}
::v-deep .el-transfer {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}
::v-deep .el-transfer-panel__list.is-filterable {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
}
::v-deep .el-transfer-panel__body {
  height: 78%;
}
</style>
