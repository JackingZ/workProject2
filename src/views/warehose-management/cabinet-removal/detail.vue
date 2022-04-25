<template>
  <div v-loading="detailLoading">
    <div class="detail-back">
      <span
        style="cursor: pointer;"
        @click="$emit('back')"
      >
        <i class="el-icon-back" />
        <span>返回</span>
      </span>
    </div>
    <div class="app-panel order-detail">
      <div class="detail-examine">
        拆柜任务单详细信息
      </div>
      <el-form
        ref="detail"
        :model="form"
        label-width="120px"
        label-position="right"
        class="detail-form"
      >
        <el-form-item label="拆柜任务单ID：">
          {{ form.id }}
        </el-form-item>
        <el-form-item label="柜号：">
          {{ form.cabinetNo }}
        </el-form-item>
        <el-form-item label="仓库名称：">
          {{ (form.warehouse || {}).name }}
        </el-form-item>
        <el-form-item label="下单客户：">
          {{ (form.buyer || {}).name }}
        </el-form-item>
        <el-form-item label="客户名称：">
          {{ (form.buyer || {}).name }}
        </el-form-item>
        <el-form-item label="创建时间：">
          {{ form.createTime }}
        </el-form-item>
        <el-form-item label="完成时间：">
          {{ form.actualTime }}
        </el-form-item>
      </el-form>
      <el-table
        :data="tableList"
        style="width: 100%;margin: 10px 0;"
        border
      >
        <el-table-column
          fixed="left"
          prop="code"
          label="原单号"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          fixed="left"
          prop="status"
          label="状态"
          width="100"
        >
          <template slot-scope="scope">
            <div class="audit-wrap">
              <el-tooltip
                v-if="scope.row.status === 3"
                class="item"
                effect="dark"
                :content="scope.row.reason || '审核不通过'"
                placement="top"
              >
                <span
                  class="audit"
                />
              </el-tooltip>
              {{ (statusList.find(e => scope.row.status === e.id) || {}).name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="目的地"
          min-width="180"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ ((scope.row.deliverAddress || {}).addressCode) || ((scope.row.deliverAddress || {}).address) }}
          </template>
        </el-table-column>
        <el-table-column
          label="省份"
          min-width="180"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ (scope.row.deliverAddress || {}).stateName }}
          </template>
        </el-table-column>
        <el-table-column
          label="总体积"
          min-width="180"
        >
          <template slot-scope="scope">
            {{ scope.row.singleVolume }} m³
          </template>
        </el-table-column>
        <el-table-column
          label="总重量"
          min-width="180"
        >
          <template slot-scope="scope">
            {{ scope.row.singleWeight }} {{ $fomatWeight((scope.row.um || {}).umWeight) }}
          </template>
        </el-table-column>
        <el-table-column
          label="总货值"
          width="160"
        >
          <template slot-scope="scope">
            {{ scope.row.singleValue }} {{ (scope.row.um || {}).currencyId }}
          </template>
        </el-table-column>
        <el-table-column
          label="总件数"
          width="160"
        >
          <template slot-scope="scope">
            {{ scope.row.single }}
          </template>
        </el-table-column>
        <el-table-column
          prop="realPiece"
          label="实际件数"
          width="160"
        />
        <el-table-column
          prop="estimatePallet"
          label="预计托数"
          width="160"
        />
        <el-table-column
          prop="realPallet"
          label="实际托数"
          width="160"
        />
        <el-table-column
          prop="remarks"
          label="备注"
          width="160"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="200px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="$checkPermission(['RemovalEdit'])"
              type="text"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="$checkPermission(['RemovalAudit']) && [0, 1, 3].includes(scope.row.status)"
              type="text"
              @click="handleAudit(scope.row, scope.$index)"
            >
              审核
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
    <el-dialog
      title="编辑"
      :visible.sync="visible"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-form
        ref="dialogForm"
        v-loading="dailogFormLoading"
        :model="dialogForm"
        :rules="formRules"
        label-width="100px"
        size="small"
      >
        <el-form-item
          label="实拆件数："
          prop="num"
        >
          <el-input-number
            v-model="dialogForm.num"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            size="small"
            :min="0"
            :step="1"
            step-strictly
          />
        </el-form-item>
        <el-form-item
          label="托盘数量："
          prop="realPallet"
        >
          <el-input-number
            v-model="dialogForm.realPallet"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            size="small"
            :min="0"
            :step="1"
            step-strictly
          />
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
            v-model="dialogForm.remarks"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        style="text-align: right;padding-top: 0px;"
      >
        <el-button
          size="small"
          :disabled="dailogFormLoading"
          @click="cancel"
        >
          取 消
        </el-button>
        <el-button
          type="primary"
          size="small"
          :disabled="dailogFormLoading"
          @click="save(1)"
        >
          仅保存
        </el-button>
        <el-button
          type="primary"
          size="small"
          :disabled="dailogFormLoading"
          @click="save(2)"
        >
          提交审核
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="审核"
      :visible.sync="visibleAudit"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-form
        ref="detail"
        v-loading="dailogFormLoading"
        :model="auditForm"
        label-width="100px"
        size="small"
      >
        <el-form-item
          label="审核结果："
          required
        >
          <el-radio-group v-model="auditForm.realPallet">
            <el-radio
              label="2"
            >
              通过
            </el-radio>
            <el-radio
              label="3"
            >
              拒绝
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="auditForm.realPallet === '3'"
          label="拒绝原因："
          required
        >
          <el-input
            v-model="auditForm.remarks"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        style="text-align: right;padding-top: 0px;"
      >
        <el-button
          size="small"
          :disabled="dailogFormLoading"
          @click="cancel"
        >
          取 消
        </el-button>
        <el-button
          type="primary"
          size="small"
          :disabled="dailogFormLoading"
          @click="audit(true)"
        >
          确 认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { getTaskDetails, saveTaskDetails, auditRemoval } from '@/api/warehose-by-cabinet-removal'
@Component({
  name: 'detail',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private detailLoading: boolean = false
  private visible: boolean = false
  private visibleAudit: boolean = false
  private dailogFormLoading: boolean = false
  private showDialogRow: any = {}
  private form: any = {}
  private dialogForm: any = {
    realPallet: 0,
    num: 0,
    remarks: ''
  }
  private auditForm: any = {
    realPallet: '',
    num: '',
    remarks: ''
  }
  private formRules: any = {
    num: [{ required: true, message: '实拆件数不能为空', trigger: 'blur' }],
    realPallet: [{ required: true, message: '托盘数量不能为空', trigger: 'blur' }]
  }
  private page: number = 1
  private size: number = 10
  private total: number = 0
  private tableList: any[] = []
  private statusList: any[] = [
    { id: 0, name: '待审核' },
    { id: 1, name: '审核中' },
    { id: 2, name: '审核通过' },
    { id: 3, name: '审核拒绝' }
  ]
  /** computed */
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }

  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }

  /* method */
  private audit(bool: boolean) {
    if (this.auditForm.realPallet === '3' && !this.auditForm.remarks) {
      this.$message.error('拒绝原因不能为空')
      return
    }
    const params = {
      id: this.showDialogRow.id,
      reason: this.auditForm.remarks,
      status: this.auditForm.realPallet
    }
    this.dailogFormLoading = bool
    auditRemoval(params).then(() => {
      this.dailogFormLoading = false
      if (bool) {
        this.$message.success('操作成功')
        this.cancel()
        this.getTableData()
      }
    }).catch(() => {
      this.dailogFormLoading = false
    })
  }
  private handleAudit(row: any, index: number) {
    this.showDialogRow = row
    this.auditForm = {
      realPallet: '1',
      num: '',
      remarks: ''
    }
    if (row.status === 0) {
      this.audit(false)
      this.tableList[index].status = 1
    }
    this.auditForm = {
      realPallet: row.status === 3 ? '3' : '2',
      num: '',
      remarks: row.status === 3 ? row.reason : ''
    }
    this.visibleAudit = true
  }
  private handleEdit(row: any) {
    this.showDialogRow = row
    this.dialogForm = {
      realPallet: row.realPallet,
      num: row.realPiece,
      remarks: row.remarks
    }
    this.visible = true
  }
  private cancel() {
    this.visible = false
    this.visibleAudit = false
    this.showDialogRow = {}
    this.dialogForm = {
      realPallet: 0,
      num: 0,
      remarks: ''
    }
    this.auditForm = {
      realPallet: '',
      num: '',
      remarks: ''
    }
  }
  private save(type: number) {
    const editForm: any = this.$refs.dialogForm
    editForm.validate((valid: any) => {
      if (!valid) return false
      const params = {
        flag: type === 2,
        id: this.showDialogRow.id,
        realPallet: this.dialogForm.realPallet,
        realPiece: this.dialogForm.num,
        remarks: this.dialogForm.remarks
      }
      this.dailogFormLoading = true
      saveTaskDetails(params).then(() => {
        this.dailogFormLoading = false
        this.$message.success('操作成功')
        this.cancel()
        this.getTableData()
      }).catch(() => {
        this.dailogFormLoading = false
      })
    })
  }
  private show(row: any) {
    this.form = row
    this.tableList = []
    this.total = 0
    this.page = 1
    this.size = 10
    this.getTableData()
  }
  private getTableData() {
    const params = {
      model: this.form.id,
      page: this.page,
      size: this.size
    }
    this.detailLoading = true
    getTaskDetails(params).then((res: any) => {
      this.detailLoading = false
      const data = res.data || {}
      this.tableList = data.result || []
      this.total = data.total
    }).catch(() => {
      this.detailLoading = false
    })
  }
  private handleSizeChange(size: any): void {
    // 页码
    this.size = size
    this.getTableData()
  }
  private handleCurrentChange(page: any): void {
    // 页数
    this.page = page
    this.getTableData()
  }
}
</script>

<style lang="scss" scoped>
  .detail-form {
    padding: 0 20px;
    ::v-deep .el-form-item {
      vertical-align: top;
      display: inline-block;
      width: 24.9%;
      margin-bottom: 0px;
    }
  }
  .result-form {
    padding: 0 40px;
    ::v-deep .el-form-item {
      vertical-align: top;
      margin-bottom: 0px;
    }
    ::v-deep .el-card__body {
      height: 100px;
    }
  }
  ::v-deep .el-dialog__body {
    padding: 0 20px;
  }
  .order-detail {
    height: calc(100vh - 170px);
    overflow-y: auto;
  }

  .detail-back {
    text-align: right;
    padding: 0 20px;
    line-height: 50px;
    border-bottom: 1px solid #e8e8e8;
    background-color: #fff;
  }
  .detail-examine {
    background: rgb(231, 231, 231);
    padding: 0px 20px;
    margin-bottom: 10px;
    line-height: 35px;
    font-size: 16px;
    font-weight: 700;
  }
  .card-item {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 280px;
    img {
      width: 100px;
      height: 100px;
    }
    .card-word {
      flex: 1;
      padding-left: 10px;
    }
  }

  ::v-deep .el-tabs__nav {
    margin-left: 20px;
  }
  ::v-deep .img-show:hover .img-action {
    opacity: 1;
  }
  .img-show {
    position: relative;
    height: 100px;
    width: 100px;
    line-height: 100px;
  }
  .avatar-img {
    width: 100px;
    height: 100px;
    object-fit: contain;
  }
  .img-action {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0,0,0,.5);
    transition: opacity .3s;
  }
  .img-icon {
    cursor: pointer;
  }
  .audit-wrap{
    display: flex;
    align-items: center;
    .audit{
      width: 6px;
      height: 6px;
      background: #E12E2E;
      border-radius: 50%;
      margin-right: 5px;
    }
  }

.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
</style>
