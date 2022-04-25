<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="状态设置"
        />
        <div class="app-panel">
          <div style="text-align: right;">
            <el-select
              v-model="selectValue.sorted"
              placeholder="排序"
              size="small"
              filterable
              clearable
              style="width:130px;margin-right:5px;"
            >
              <el-option
                label="升序"
                value="1"
              />
              <el-option
                label="降序"
                value="2"
              />
            </el-select>
            <el-select
              v-model="selectValue.statusType"
              :loading="selectLoading"
              placeholder="服务大类"
              size="small"
              filterable
              clearable
              style="width:130px;margin-right:10px;"
              @focus="getServiceList"
            >
              <el-option
                v-for="item in serviceList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-button
              type="primary"
              size="small"
              @click="queryAll(1)"
            >
              查询
            </el-button>
          </div>
          <el-table
            v-loading="loading"
            :data="tableData"
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              prop="sorted"
              label="排序值"
              width="120"
            />
            <el-table-column
              prop="statusName"
              label="状态名称"
            />
            <el-table-column
              prop=""
              label="服务大类"
              width="120"
            >
              <template slot-scope="scope">
                {{ typeFilter(scope.row, 'type') }}
              </template>
            </el-table-column>
            <el-table-column
              prop="describes"
              label="描述"
              min-width="200"
              show-overflow-tooltip
            />
            <el-table-column
              prop=""
              label="是否有文件"
              width="120"
            >
              <template slot-scope="scope">
                {{ scope.row.fileDownload === 1 ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="权限"
              min-width="150"
            >
              <template slot-scope="scope">
                <div>
                  仅查看：{{ typeFilter(scope.row, 'view') }}
                </div>
                <div v-if="scope.row.fileDownload === 1">
                  可下载：{{ typeFilter(scope.row, 'file') }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="180"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="medium"
                  @click="editRow(scope.row)"
                >
                  权限设置
                </el-button>
                <el-button
                  type="text"
                  size="medium"
                  @click="editDesc(scope.row)"
                >
                  修改描述
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
            title="权限设置"
            :visible.sync="dialogShow"
            :close-on-click-modal="false"
            width="700px"
            @closed="cancel"
          >
            <div v-loading="dialogLoading">
              <el-row style="background-color: #fafafa;border-bottom: 1px solid #dfe6ec;line-height: 35px;">
                <el-col :span="4">
                  权限
                </el-col>
                <el-col :span="20">
                  角色
                </el-col>
              </el-row>
              <el-row style="border-bottom: 1px solid #dfe6ec;line-height: 35px;">
                <el-col :span="4">
                  仅查看
                </el-col>
                <el-col :span="20">
                  <el-checkbox v-model="viewRoles.supplier">
                    供应商
                  </el-checkbox>
                  <el-checkbox v-model="viewRoles.jht">
                    聚货通
                  </el-checkbox>
                  <el-checkbox v-model="viewRoles.agent1">
                    一级代理商
                  </el-checkbox>
                  <el-checkbox v-model="viewRoles.agent2">
                    二级代理商
                  </el-checkbox>
                  <el-checkbox v-model="viewRoles.customer">
                    客户
                  </el-checkbox>
                </el-col>
              </el-row>
              <el-row
                v-if="ifFile"
                style="border-bottom: 1px solid #dfe6ec;line-height: 35px;"
              >
                <el-col :span="4">
                  可下载
                </el-col>
                <el-col :span="20">
                  <el-checkbox v-model="fileRoles.supplier">
                    供应商
                  </el-checkbox>
                  <el-checkbox v-model="fileRoles.jht">
                    聚货通
                  </el-checkbox>
                  <el-checkbox v-model="fileRoles.agent1">
                    一级代理商
                  </el-checkbox>
                  <el-checkbox v-model="fileRoles.agent2">
                    二级代理商
                  </el-checkbox>
                  <el-checkbox v-model="fileRoles.customer">
                    客户
                  </el-checkbox>
                </el-col>
              </el-row>
              <div
                slot="footer"
                style="text-align: right;padding: 20px 0 0;"
              >
                <el-button
                  @click="cancel"
                >
                  取 消
                </el-button>
                <el-button
                  type="primary"
                  @click="confirm"
                >
                  确 定
                </el-button>
              </div>
            </div>
          </el-dialog>
          <el-dialog
            title="修改"
            :visible.sync="descShow"
            :close-on-click-modal="false"
            width="600px"
            @closed="closed"
          >
            <div v-loading="dialogLoading">
              <el-form
                ref="editForm"
                :model="selectForm"
                :rules="formRules"
                label-width="120px"
                label-position="right"
                size="small"
              >
                <el-form-item
                  label="排序值"
                  prop="sorted"
                >
                  <el-input-number
                    v-model="selectForm.sorted"
                    class="input-number-valiate"
                    :controls="false"
                    placeholder="请输入"
                    :min="0"
                    :max="999999"
                    :step="1"
                    step-strictly
                  />
                </el-form-item>
                <el-form-item
                  label="描述"
                  prop="describes"
                >
                  <el-input
                    v-model="selectForm.describes"
                    type="textarea"
                    :autosize="{minRows: 2, maxRows: 6}"
                    :rows="4"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-form>
              <div
                slot="footer"
                style="text-align: right;padding: 20px 0 0;"
              >
                <el-button @click="closed">
                  取 消
                </el-button>
                <el-button
                  type="primary"
                  @click="save"
                >
                  确 定
                </el-button>
              </div>
            </div>
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
  getStatusConfig,
  saveConfig,
  saveDesc,
  getServiceTypeList
} from '@/api/system-in-status-config'

@Component({
  name: 'Port',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private dialogLoading: boolean = false
  private selectLoading: boolean = false
  private dialogShow: boolean = false
  private descShow: boolean = false
  private ifFile: boolean = false
  private tableData: any[] = []
  private serviceList: any[] = []
  private selectValue: any = {
    statusType: '',
    sorted: ''
  }
  private viewRoles: any = {
    supplier: false,
    jht: false,
    agent1: false,
    agent2: false,
    customer: false
  }
  private fileRoles: any = {
    supplier: false,
    jht: false,
    agent1: false,
    agent2: false,
    customer: false
  }
  private selectForm: any = {
    sorted: undefined,
    describes: ''
  }
  private formRules = {
    sorted: [{ required: true, message: '排序值不能为空', trigger: 'blur' }]
  }
  private currentId: any = ''
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

  /* methods */

  // 类型名称
  private typeFilter(row: any, str: string): any {
    const arr: any[] = []
    const brr: any[] = []
    const fileObj = row.filePermissionMap || {}
    const viewObj = row.statusPermissionMap || {}
    const roles = [
      { name: '供应商', id: 'supplier' },
      { name: '聚货通', id: 'jht' },
      { name: '一级代理商', id: 'agent1' },
      { name: '二级代理商', id: 'agent2' },
      { name: '客户', id: 'customer' }
    ]
    Object.keys(fileObj).map((it: any) => {
      if (fileObj[it]) {
        const item = roles.find((r: any) => r.id === it)
        if (item) {
          brr.push(item.name)
        }
      }
    })
    Object.keys(viewObj).map((it: any) => {
      if (viewObj[it]) {
        const item = roles.find((r: any) => r.id === it)
        if (item) {
          arr.push(item.name)
        }
      }
    })
    if (str === 'view') {
      return arr.join(',')
    } else if (str === 'file') {
      return brr.join(',')
    } else if (str === 'type') {
      const { statusType } = row
      const codes = [
        { value: 'WS_IN', label: '仓储' },
        { value: 'WS_OUT', label: '仓储' },
        { value: 'MEASURE', label: '仓储' },
        { value: 'EXAMINE', label: '仓储' },
        { value: 'LINE', label: '专线' },
        { value: 'TRUCK', label: '卡车' },
        { value: 'TRAILER', label: '拖车' },
        { value: 'EXPRESS', label: '快递' },
        { value: 'BOOKING', label: '订舱' },
        { value: 'BOOKING_CONTAINER', label: '订舱' },
        { value: 'CUSTOM_DECLARATION', label: '报关' }
      ]
      const item: any = codes.find((it: any) => it.value === statusType) || {}
      return item.label || ''
    }
  }
  // 获取服务大类
  private getServiceList() {
    this.selectLoading = true
    const params = {
      custType: '1'
    }
    getServiceTypeList(params)
      .then((res: any) => {
        this.serviceList = res.data || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private queryAll(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const params: any = {
      model: {
        ...this.selectValue
      },
      page: this.page,
      size: this.size
    }
    getStatusConfig(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        this.tableData = data.result || []
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

  // 编辑
  private editRow(row: any): void {
    this.dialogShow = true
    this.currentId = row.id
    this.ifFile = row.fileDownload === 1
    const statusMap = row.statusPermissionMap || {}
    const fileMap = row.filePermissionMap || {}
    Object.assign(this.viewRoles, statusMap)
    if (row.fileDownload === 1) {
      Object.assign(this.fileRoles, fileMap)
    }
  }
  private editDesc(row: any): void {
    this.descShow = true
    this.currentId = row.id
    this.selectForm = {
      ...row
    }
  }
  private confirm(): void {
    this.dialogLoading = true
    const params: any = {
      id: this.currentId,
      fileMap: this.fileRoles,
      statusMap: this.viewRoles
    }
    saveConfig(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.dialogLoading = false
        this.cancel()
        this.queryAll()
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }
  private cancel(): void {
    this.dialogShow = false
    this.ifFile = false
    this.currentId = ''
    this.fileRoles = {
      supplier: false,
      jht: false,
      agent1: false,
      agent2: false,
      customer: false
    }
    this.viewRoles = {
      supplier: false,
      jht: false,
      agent1: false,
      agent2: false,
      customer: false
    }
  }
  private save(): void {
    const editForm: any = this.$refs.editForm
    editForm.validate((valid: any) => {
      if (!valid) {
        return false
      }
      this.dialogLoading = true
      const { id, describes, sorted } = this.selectForm
      const params: any = {
        id,
        sorted,
        describes
      }
      saveDesc(params)
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.dialogLoading = false
          this.descShow = false
          this.closed()
          this.queryAll()
        })
        .catch((err: any) => {
          this.dialogLoading = false
          return err
        })
    })
  }
  private closed() {
    this.selectForm = {
      sorted: undefined,
      describes: ''
    }
    this.descShow = false
    this.$nextTick(() => {
      const editForm: any = this.$refs.editForm
      editForm.clearValidate()
    })
  }

  private created(): void {
    this.queryAll()
  }
}
</script>

<style lang="scss" scoped>
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
</style>
