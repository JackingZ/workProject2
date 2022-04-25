<template>
  <div
    class="movement-form"
    style="display: flex;flex-flow: row nowrap;min-height: inherit;"
  >
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        v-show="!detailShow"
        class="app-container"
      >
        <head-info
          info=""
          title="调拨申请单"
        />
        <div class="app-panel">
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-button
                type="text"
                icon="el-icon-circle-plus-outline"
                style="float: left;"
                @click="handleAdd"
              >
                新增
              </el-button>

              <el-select
                v-model="searchForm.audit"
                placeholder="状态"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
              >
                <el-option
                  label="待审核"
                  value="0"
                />
                <el-option
                  label="审核通过"
                  value="1"
                />
                <el-option
                  label="审核中"
                  value="3"
                />
                <el-option
                  label="审核拒绝"
                  value="2"
                />
                <el-option
                  label="已签收"
                  value="4"
                />
              </el-select>

              <el-date-picker
                v-model="searchForm.applyTime"
                unlink-panels
                type="daterange"
                align="right"
                size="small"
                value-format="yyyy-MM-dd"
                range-separator="~"
                style="width:240px;margin-right:5px;"
                start-placeholder="申请起始时间"
                end-placeholder="申请截止时间"
              />
              <el-input
                v-model="searchForm.keyword"
                placeholder="请输入内容"
                style="width:240px;margin-right:10px;"
                size="small"
                clearable
              >
                <el-select
                  slot="prepend"
                  v-model="searchForm.keyType"
                  size="small"
                  style="width:100px;"
                  placeholder="请选择"
                >
                  <el-option
                    label="原单号"
                    value="1"
                  />
                  <el-option
                    label="申请单号"
                    value="2"
                  />
                </el-select>
              </el-input>
              <el-button
                v-permission="['movingApplySearch']"
                type="primary"
                size="small"
                @click="handleSearch(1)"
              >
                查询
              </el-button>
            </el-col>
          </el-row>

          <el-table
            v-loading="loading"
            :data="tableData"
            :row-class-name="rowClassName"
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              prop="id"
              label="调拨申请单ID"
              min-width="150"
              show-overflow-tooltip
            />
            <el-table-column
              prop="audit"
              label="状态"
              width="100"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.audit === 0">
                  待审核
                </span>
                <span v-else-if="scope.row.audit === 1">
                  审核通过
                </span>
                <span v-else-if="scope.row.audit === 3">
                  审核中
                </span>
                <span v-else-if="scope.row.audit === 2">
                  审核拒绝
                </span>
                <span v-else-if="scope.row.audit === 4">
                  已签收
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="调出仓库"
              min-width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.out || {}).name || '--' }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="目的仓库"
              min-width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.win || {}).name || '--' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="total"
              label="总票数"
            />
            <el-table-column
              prop="createUserName"
              label="申请人"
            />
            <el-table-column
              prop="createTime"
              label="申请时间"
              width="170"
            />
            <el-table-column
              prop="auditUserName"
              label="审核人"
            />
            <el-table-column
              prop="auditTime"
              label="审核时间"
              width="170"
            />
            <el-table-column
              prop="remarks"
              label="备注"
              width="200"
              show-overflow-tooltip
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="200"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.audit === 0 || scope.row.audit === 2"
                  type="text"
                  @click="handleEdit(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-if="scope.row.ifCancel === 1"
                  type="text"
                  @click="handleDelete(scope.row)"
                >
                  删除
                </el-button>
                <el-button
                  type="text"
                  @click="handleDetail(scope.row)"
                >
                  查看
                </el-button>
                <el-button
                  v-if="scope.row.audit === 0 || scope.row.audit === 3"
                  type="text"
                  @click="handleAudit(scope.row)"
                >
                  审核
                </el-button>
                <el-button
                  v-if="scope.row.audit !== 1 && scope.row.audit !== 4 && scope.row.ifCancel === 0"
                  type="text"
                  @click="handleCancel(scope.row)"
                >
                  取消
                </el-button>
                <el-button
                  v-if="(scope.row.audit === 1 || scope.row.audit === 4) && ['0', '3'].includes(custType)"
                  type="text"
                  @click="handleExport(scope.row)"
                >
                  导出
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
        </div>
      </div>
      <div
        v-show="detailShow"
        class="app-container"
      >
        <detail
          ref="detailForm"
          @back="goBack"
        />
      </div>

      <el-dialog
        title="审核"
        :visible.sync="dialogAudit"
        :close-on-click-modal="false"
        width="600px"
        @closed="cancel"
      >
        <div v-loading="dialogLoading">
          <el-form
            ref="auditForm"
            :model="auditForm"
            :rules="rules"
            label-width="100px"
            label-position="right"
            style="padding-right: 20px;"
            size="small"
          >
            <el-form-item
              label="审核状态"
              prop="audit"
            >
              <el-radio-group v-model="auditForm.audit">
                <el-radio :label="1">
                  审核通过
                </el-radio>
                <el-radio :label="2">
                  审核拒绝
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="auditForm.audit === 2"
              label="拒绝原因"
              prop="reason"
            >
              <el-input
                v-model="auditForm.reason"
                type="textarea"
                :maxlength="200"
                :autosize="{minRows: 2, maxRows: 4}"
                placeholder="请输入"
              />
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            style="text-align: right;"
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
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import detail from './detail.vue'
import {
  getMoveList,
  auditMove,
  deleteMove,
  cancelMove,
  allocationExport
} from '@/api/warehose-by-config'
import { UserModule } from '@/store/modules/user'
import dayjs from 'dayjs'
@Component({
  name: 'movement',
  components: {
    detail
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private searchForm: any = {
    keyword: undefined,
    keyType: '1',
    audit: undefined, // 状态
    applyTime: [] // 时间集合
  }
  private tableData: any = []
  private total = 0
  private page = 1
  private size = 10
  private loading = false
  private dialogLoading = false
  private detailShow: boolean = false
  private dialogAudit: boolean = false
  private auditForm: any = {
    reason: undefined,
    audit: undefined
  }
  private rules = {
    audit: { required: true, message: '审核状态不能为空', trigger: 'change' },
    reason: { required: true, message: '拒绝原因不能为空', trigger: 'blur' }
  }
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }
  /* methods */
  private handleAdd(): void {
    // 新增
    this.detailShow = true
    const root: any = this.$refs.detailForm
    root.init()
  }
  private handleEdit(row: any): void {
    // 编辑
    this.detailShow = true
    const root: any = this.$refs.detailForm
    root.setData(row, 'edit')
  }
  private handleDetail(row: any): void {
    // 查看
    this.detailShow = true
    const root: any = this.$refs.detailForm
    root.setData(row, 'view')
  }
  private handleDelete(row: any): void {
    // 删除
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
        deleteMove(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.handleSearch()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }
  private rowClassName({ row, rowIndex }: any) {
    if (row.audit === 2) {
      return 'frost-red'
    }
  }
  private handleAudit(row: any) {
    if (row.audit !== 3) {
      this.handleAudited(row)
    } else {
      this.handleAuditing(row)
    }
  }
  private handleAudited(row: any) {
    this.auditForm = {
      audit: 3,
      id: row.id
    }
    auditMove(this.auditForm)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '提交成功'
        })
        this.handleSearch()
      }).catch((err: any) => {
        return [err, null]
      })
  }
  private handleAuditing(row: any): void {
    // 审核
    this.dialogAudit = true
    this.auditForm = {
      reason: row.reason,
      audit: row.audit,
      id: row.id
    }
  }
  private cancel() {
    this.auditForm = {
      reason: undefined,
      audit: undefined
    }
    this.dialogAudit = false
    this.$nextTick(() => {
      const formDom:any = this.$refs.auditForm
      formDom.clearValidate()
    })
  }
  private confirm() {
    const auditForm: any = this.$refs.auditForm
    auditForm.validate((valid: any) => {
      if (!valid) return false
      this.dialogLoading = true
      if (this.auditForm.audit === 1) {
        this.auditForm.reason = ''
      }
      auditMove(this.auditForm)
        .then((res: any) => {
          this.dialogLoading = false
          this.$message({
            type: 'success',
            message: '提交成功'
          })
          this.cancel()
          this.handleSearch()
        }).catch((err: any) => {
          this.dialogLoading = false
          return [err, null]
        })
    })
  }
  private downXsl(name: string, res: any) {
    const a = document.createElement('a')
    document.body.appendChild(a)
    const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    const objUrl = URL.createObjectURL(blob)
    a.href = objUrl
    a.download = name + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.xls'
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(objUrl)
  }
  private handleExport(row: any) {
    this.loading = true
    allocationExport({ id: row.id }).then((res: any) => {
      const name = row.id + '调拨申请单'
      this.loading = false
      this.downXsl(name, res)
    }).catch((err: any) => {
      this.loading = false
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
  private handleCancel(row: any): void {
    // 取消
    const param: any = {
      id: row.id,
      cancel: 1
    }
    cancelMove(param)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '取消成功'
        })
        this.handleSearch()
      }).catch((err: any) => {
        return [err, null]
      })
  }
  private goBack() {
    this.detailShow = false
    this.handleSearch(1)
  }
  private handleSearch(val?: any): void {
    // 查询
    this.loading = true
    const { applyTime, keyType, keyword, ...model } = this.searchForm
    if (Array.isArray(applyTime) && applyTime.length > 0) {
      model.startDate = applyTime[0] + ' 00:00:00'
      model.endDate = applyTime[1] + ' 23:59:59'
    }
    model.code = keyType === '1' ? keyword : undefined
    model.id = keyType === '2' ? keyword : undefined
    if (val) {
      this.page = val
    }
    const params = {
      model,
      page: this.page,
      size: this.size
    }
    getMoveList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.tableData = data.result || []
        this.total = data.total
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return [null, err]
      })
  }

  private handleSizeChange(size: any): void {
    // 页码
    this.size = size
    this.handleSearch()
  }
  private handleCurrentChange(page: any): void {
    // 页数
    this.page = page
    this.handleSearch()
  }
  private created() {
    // this.searchForm.applyTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    this.handleSearch()
  }
}
</script>

<style lang="scss" scoped>
::v-deep .frost-red {
  color: #E12E2E !important;
  .el-button--text {
    color: #E12E2E;
  }
  .el-dropdown-link {
    color: #E12E2E;
  }
}
</style>
