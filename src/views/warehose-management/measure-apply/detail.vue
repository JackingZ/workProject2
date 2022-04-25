<template>
  <div
    v-loading="detailLoading"
  >
    <div class="detail-back">
      <span
        style="cursor: pointer;"
        @click="$emit('back')"
      >
        <i class="el-icon-back" />
        <span>返回</span>
      </span>
    </div>
    <div
      class="app-panel order-detail"
    >
      <div class="detail-measure">
        <el-row>
          <el-col :span="4">
            计量申请单详细信息
          </el-col>
          <el-col
            :span="20"
            style="text-align: right;"
          >
            <el-button
              v-if="form.measureStatus !== 3"
              type="primary"
              size="mini"
              @click="handleComplate"
            >
              完成计量
            </el-button>
          </el-col>
        </el-row>
      </div>
      <el-form
        ref="detail"
        :model="form"
        label-width="160px"
        label-position="right"
        class="detail-form"
      >
        <el-form-item label="计量申请单ID：">
          {{ form.measureId }}
        </el-form-item>
        <el-form-item label="原单号：">
          {{ form.originalNo }}
        </el-form-item>
        <el-form-item label="仓库名称：">
          {{ form.warehouseName }}
        </el-form-item>
        <el-form-item label="入仓时间：">
          {{ form.enterTime }}
        </el-form-item>
        <el-form-item label="计量方式：">
          <span v-if="form.measureMethod === 1">
            逐箱
          </span>
          <span v-else-if="form.measureMethod === 2">
            批量
          </span>
          <span v-else-if="form.measureMethod === 3">
            打托
          </span>
        </el-form-item>
        <el-form-item label="是否二次计量：">
          <span v-if="form.secondaryMesaure === 0">
            否
          </span>
          <span v-else-if="form.secondaryMesaure === 1">
            是
          </span>
        </el-form-item>
        <el-form-item label="计量状态：">
          <span v-if="form.delFlag === 1">
            已取消
          </span>
          <span v-else>
            {{ (statusList[form.measureStatus - 1] || {}).name }}
          </span>
        </el-form-item>
        <!-- <el-form-item label="审核状态：">
          {{ (auditList[form.auditStatus - 1] || {}).name }}
        </el-form-item> -->
        <el-form-item label="要求完成时间：">
          {{ form.expectedMeasureTime }}
        </el-form-item>
        <el-form-item label="实际完成时间：">
          {{ form.actualMeasureTime }}
        </el-form-item>
        <el-form-item label="操作人：">
          {{ form.executorName }}
        </el-form-item>
        <el-form-item label="申请人：">
          {{ form.applicant }}
        </el-form-item>
        <el-form-item label="申请时间：">
          {{ form.createTime }}
        </el-form-item>
        <div>
          <el-form-item label="计量复核审核结果：">
            {{ form.measureReviewResults }}
          </el-form-item>
          <el-form-item label="计量复核审核人：">
            {{ form.measureReviewAuditor }}
          </el-form-item>
          <el-form-item label="计量复核审核时间：">
            {{ form.measureReviewTime }}
          </el-form-item>
          <el-form-item label="关联计量申请单号：">
            {{ form.relatedMeasuerId }}
          </el-form-item>
        </div>
        <div>
          <div style="line-height: 40px;border-top: 1px solid #e8e8e8;margin: 10px -15px 0;">
            <el-row>
              <el-col :span="4">
                计量明细
              </el-col>
              <el-col
                :span="20"
                style="text-align: right;"
              >
                <input
                  type="text"
                  style="display:none"
                >
                <!-- <el-input
                  v-model="code"
                  size="small"
                  clearable
                  style="width: 200px;margin-right: 10px;"
                  placeholder="请扫描或输入箱号"
                  @keyup.enter.native="handleEnter"
                /> -->
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleRowBegin"
                >
                  开始计量
                </el-button>
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleRowAdd"
                >
                  新增
                </el-button>
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleBatchDelete"
                >
                  批量删除
                </el-button>
                <el-upload
                  v-if="custType === '3'"
                  ref="uploadFile"
                  class="upload-demo"
                  action
                  multiple
                  :show-file-list="false"
                  :file-list="fileList"
                  accept=".xlsx,.xls"
                  :limit="1"
                  :auto-upload="true"
                  :http-request="uploadFile"
                  :on-change="removeFileList"
                  style="display: inline-block;margin: 0 10px;"
                >
                  <el-button
                    type="primary"
                    size="mini"
                  >
                    批量导入
                  </el-button>
                </el-upload>
              </el-col>
            </el-row>
          </div>
          <div>
            <el-form-item label="理论总件数：">
              {{ form.totalNumber }}
            </el-form-item>
            <el-form-item label="理论总体积（m³）：">
              {{ $volumeConversion((form.totalVolume || 0), 'CBCM', 'CBM', 3) }}
            </el-form-item>
            <el-form-item label="理论总重量（kg）：">
              {{ form.totalWeight }}
            </el-form-item>
          </div>
          <div>
            <el-form-item label="总件数：">
              {{ form.actualNumber }}
            </el-form-item>
            <el-form-item label="总体积（m³）：">
              {{ form.actualVolume }}
            </el-form-item>
            <el-form-item label="总重量（kg）：">
              {{ form.actualWeight }}
            </el-form-item>
            <el-form-item
              v-if="volumeWeight.wv"
              label="总重量体积："
            >
              {{ volumeWeight.wv }}
            </el-form-item>
            <el-form-item
              v-if="volumeWeight.volumeWeight"
              label="总体积重："
            >
              {{ volumeWeight.volumeWeight }}
            </el-form-item>
          </div>
        </div>
      </el-form>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%;"
        border
        @selection-change="handleSelection"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="measureType"
          label="类型"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.measureType === 1">
              逐箱
            </div>
            <div v-else-if="scope.row.measureType === 2">
              批量
            </div>
            <div v-else-if="scope.row.measureType === 3">
              打托
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="boxCode"
          label="箱号/托盘ID"
          min-width="120px"
        />
        <el-table-column
          label="重量（kg）"
        >
          <template slot-scope="scope">
            <el-input-number
              v-if="scope.row.isEdit"
              v-model="scope.row.weight"
              class="input-number-valiate"
              :controls="false"
              placeholder="请输入"
              :min="0"
              :max="999999"
              :precision="2"
            />
            <span v-else>
              {{ scope.row.weight }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="长（cm）"
        >
          <template slot-scope="scope">
            <el-input-number
              v-if="scope.row.isEdit"
              v-model="scope.row.length"
              class="input-number-valiate"
              :controls="false"
              placeholder="请输入"
              :min="0"
              :max="999999"
              :precision="2"
            />
            <span v-else>
              {{ scope.row.length }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="宽（cm）"
        >
          <template slot-scope="scope">
            <el-input-number
              v-if="scope.row.isEdit"
              v-model="scope.row.wigth"
              class="input-number-valiate"
              :controls="false"
              placeholder="请输入"
              :min="0"
              :max="999999"
              :precision="2"
            />
            <span v-else>
              {{ scope.row.wigth }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="高（cm）"
        >
          <template slot-scope="scope">
            <el-input-number
              v-if="scope.row.isEdit"
              v-model="scope.row.height"
              class="input-number-valiate"
              :controls="false"
              placeholder="请输入"
              :min="0"
              :max="999999"
              :precision="2"
            />
            <span v-else>
              {{ scope.row.height }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="girth"
          label="围长"
        />
        <el-table-column
          v-if="volumeWeight.volumeWeight"
          prop="weightVolume"
          label="体积重"
        />
        <el-table-column
          v-if="volumeWeight.wv"
          prop="wv"
          label="重量体积"
        />
        <el-table-column
          prop="empName"
          label="计量人"
        />
        <el-table-column
          prop="createTime"
          label="计量时间"
          width="160px"
        />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.isEdit"
              type="text"
              @click="handleRowEdit(scope.row, scope.$index)"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.isEdit"
              type="text"
              @click="handleRowSave(scope.row)"
            >
              保存
            </el-button>
            <el-button
              type="text"
              @click="handleRowDelete([scope.row.id])"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page.sync="page"
        :page-size="size"
        layout="total, prev, pager, next"
        :total="total"
        style="text-align: right;margin: 5px 0 15px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      :width="'500px'"
      :title="title"
      :visible.sync="dialogMachine"
      :close-on-click-modal="false"
      @closed="machineCancel"
    >
      <el-form
        ref="machineForm"
        v-loading="formLoading"
        :model="machineForm"
        label-width="90px"
        label-position="right"
        size="small"
        style="padding-right: 20px;"
      >
        <el-form-item
          label="箱号"
          prop="boxCode"
          class="is-required"
        >
          <el-input
            ref="machineDown1"
            v-model="machineForm.boxCode"
            size="small"
            placeholder="请输入"
            :maxlength="25"
            @keyup.enter.native="onMachineDown('2')"
          />
        </el-form-item>
        <el-form-item
          label="重量(kg)"
          prop="weight"
          class="is-required"
        >
          <el-input-number
            ref="machineDown2"
            v-model="machineForm.weight"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="999999"
            :precision="2"
            @keyup.enter.native="onMachineDown('3')"
          />
        </el-form-item>
        <el-form-item
          label="长度(cm)"
          prop="length"
          class="is-required"
        >
          <el-input-number
            ref="machineDown3"
            v-model="machineForm.length"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="999999"
            :precision="2"
            @keyup.enter.native="onMachineDown('4')"
          />
        </el-form-item>
        <el-form-item
          label="宽度(cm)"
          prop="wigth"
          class="is-required"
        >
          <el-input-number
            ref="machineDown4"
            v-model="machineForm.wigth"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="999999"
            :precision="2"
            @keyup.enter.native="onMachineDown('5')"
          />
        </el-form-item>
        <el-form-item
          label="高度(cm)"
          prop="height"
          class="is-required"
        >
          <el-input-number
            ref="machineDown5"
            v-model="machineForm.height"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="999999"
            :precision="2"
            @keyup.enter.native="onMachineDown('6')"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="machineCancel">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="machineSave"
        >
          保存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :width="'500px'"
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @closed="handleFormCancel"
    >
      <el-form
        ref="editForm"
        v-loading="formLoading"
        :model="dialogForm"
        :rules="formRules"
        label-width="90px"
        label-position="right"
        size="small"
        style="padding-right: 20px;"
      >
        <!-- <el-form-item label="计量类型" prop="measureType">
          <el-select
            v-model="dialogForm.measureType"
            placeholder="请选择"
            size="small"
            style="width: 100%;"
          >
            <el-option
              label="逐箱"
              :value="1"
            />
            <el-option
              label="批量"
              :value="2"
            />
            <el-option
              label="打托"
              :value="3"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item
          label="箱号"
          prop="boxCode"
        >
          <el-input
            v-model="dialogForm.boxCode"
            size="small"
            placeholder="请输入"
            :maxlength="25"
          />
        </el-form-item>
        <el-form-item
          label="重量(kg)"
          prop="weight"
        >
          <el-input-number
            v-model="dialogForm.weight"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="999999"
            :precision="2"
          />
        </el-form-item>
        <el-form-item
          label="长度(cm)"
          prop="length"
        >
          <el-input-number
            v-model="dialogForm.length"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="999999"
            :precision="2"
          />
        </el-form-item>
        <el-form-item
          label="宽度(cm)"
          prop="wigth"
        >
          <el-input-number
            v-model="dialogForm.wigth"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="999999"
            :precision="2"
          />
        </el-form-item>
        <el-form-item
          label="高度(cm)"
          prop="height"
        >
          <el-input-number
            v-model="dialogForm.height"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="999999"
            :precision="2"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleFormCancel">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="handleFormSave"
        >
          保存
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogDisChargeNo"
      width="350px"
    >
      <div>
        <span>卸货申请单号</span>
        <el-input
          v-model="disChargeNo"
          class="dialog-charge-input"
          placeholder="请扫描或填入卸货申请单号"
          @change="handleDisChargeNo"
        />
      </div>
      <span slot="footer">
        <el-button @click="dialogDisChargeNo = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  getMeasureById,
  getMeasureDetailList,
  saveSingleMeasureDetail,
  deleteMeasureDetail,
  addSingleMeasureDetail,
  batchImport,
  updateStatus
} from '@/api/warehose-by-config'
@Component({
  name: 'detail',
  components: {},
  props: {
    statusList: {
      type: Array,
      default: () => ([])
    },
    auditList: {
      type: Array,
      default: () => ([])
    }
  }
})
export default class extends Vue {
  /* data */
  private volumeWeight: any = {}
  private form: any = {
    actualMeasureTime: undefined,
    applicant: undefined,
    applicantId: undefined,
    realName: undefined,
    createTime: undefined,
    custId: undefined,
    custName: undefined,
    expectedMeasureTime: undefined,
    measureId: undefined,
    measureMethod: undefined,
    measureReviewAuditor: undefined,
    measureReviewResults: undefined,
    measureReviewTime: undefined,
    measureStatus: undefined,
    originalNo: undefined,
    relatedMeasuerId: undefined,
    secondaryMesaure: undefined,
    totalNumber: undefined,
    totalVolume: undefined,
    totalWeight: undefined,
    updateTime: undefined,
    warehouseId: undefined,
    warehouseName: undefined
  }
  private row: any = {}
  private fileList: any = []
  private detailLoading: boolean = false
  private loading: boolean = false
  private formLoading: boolean = false
  private tableData: any[] = []
  private title = ''
  private code = ''
  private radio = '0'
  private isEdit = false
  private dialogVisible = false
  private dialogMachine = false
  private machineForm: any = {
    measureType: 1,
    boxCode: undefined,
    height: undefined,
    length: undefined,
    wigth: undefined,
    weight: undefined
  }
  private dialogForm: any = {
    measureType: 1,
    boxCode: undefined,
    height: undefined,
    length: undefined,
    wigth: undefined,
    weight: undefined
  }
  private formRules = {
    boxCode: [
      { required: true, message: '箱号不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^[a-zA-Z0-9 .·_-]+$/
          if (!value) {
            callback(new Error('箱号不能为空'))
          } else if (!reg.test(value)) {
            callback(new Error('箱号不能有中文及特殊字符'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    height: [{ required: true, message: '高度不能为空', trigger: 'blur' }],
    length: [{ required: true, message: '长度不能为空', trigger: 'blur' }],
    wigth: [{ required: true, message: '宽度不能为空', trigger: 'blur' }],
    weight: [{ required: true, message: '重量不能为空', trigger: 'blur' }]
  }
  private disChargeNo = ''
  private dialogDisChargeNo = false
  private measureId: string = ''
  private page: number = 1
  private size: number = 10
  private total: number = 10
  private selectArr: any[] = []

  /** computed */
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }
  /* 方法 */
  private removeFileList(): void {
    this.fileList = []
  }

  private uploadFile(params: any): void {
    const { file } = params
    const form: FormData = new FormData()
    form.append('file', file)
    form.append('measureId', this.form.measureId)
    form.append('measurementId', this.form.id)
    form.append('originalNo', this.form.originalNo)
    batchImport(form)
      .then((res: any) => {
        this.getForm()
        this.getDetail()
        this.$message.success('导入成功')
      })
      .catch((err: any) => {
        return err
      })
  }

  private handleDisChargeNo(): void {
    // 输入单号
    if (this.disChargeNo) {
      this.dialogDisChargeNo = false
      this.dialogVisible = true
    }
  }
  private setNo(): void {
    this.dialogDisChargeNo = true
  }
  private setData(val: any): void {
    // 设置值
    this.row = val
    this.measureId = val.id || ''
    this.page = 1
    this.volumeWeight = {}
    this.getForm()
    this.getDetail()
  }
  private getForm(): void {
    // 查询
    this.detailLoading = true
    getMeasureById({
      id: this.measureId
    })
      .then((res: any) => {
        const data = res.data || {}
        this.form = data
        this.detailLoading = false
      })
      .catch((err: any) => {
        this.detailLoading = false
        return [null, err]
      })
  }
  private getDetail() {
    this.loading = true
    getMeasureDetailList({
      model: {
        code: this.row.originalNo,
        boxCode: this.code,
        measurementId: this.measureId
      },
      page: this.page,
      size: this.size
    }).then((res: any) => {
      const data = res.data || {}
      this.tableData = data.result || []
      this.total = data.total
      this.loading = false
      if (this.page === 1) {
        this.volumeWeight = {
          volumeWeight: (this.tableData[0] || {}).totalWeightVolume,
          wv: (this.tableData[0] || {}).totalWv
        }
      }
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }

  private handleSizeChange(size: any): void {
    // 页码
    this.size = size
    this.getDetail()
  }
  private handleCurrentChange(page: any): void {
    // 页数
    this.page = page
    this.getDetail()
  }

  private handleEnter(): void {
    // 输入框
    if (this.code) {
      this.dialogVisible = true
      switch (this.radio) {
        case '0':
          this.title = '单箱计量'
          break
        case '1':
          this.title = '批量计量'
          break
        case '2':
          this.title = '打托计量'
          break
        default:
          break
      }
    }
  }

  private handleSelection(val: any): void {
    // 勾选
    this.selectArr = (val || []).map((it: any) => it.id)
  }
  private handleBatchDelete(): void {
    // 批量删除
    if (Array.isArray(this.selectArr) && this.selectArr.length > 0) {
      this.handleRowDelete(this.selectArr)
    } else {
      this.$message.error('请勾选需要删除的列表项')
    }
  }
  private handleRowDelete(list: any): void {
    // 删除
    const params = {
      id: this.measureId,
      list: list || []
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteMeasureDetail(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getForm()
            this.getDetail()
            this.selectArr = []
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }
  private handleRowEdit(row: any, index: any) {
    this.$set(row, 'isEdit', true)
  }
  private handleRowSave(row: any) {
    this.loading = true
    const params = row
    saveSingleMeasureDetail(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.getForm()
        this.getDetail()
      })
      .catch(() => {
        this.loading = false
        return false
      })
  }
  private handleRowAdd() {
    this.dialogVisible = true
    this.title = '新增计量(逐箱)'
  }
  private handleFormSave(): void {
    const editForm: any = this.$refs.editForm
    editForm.validate((valid: any) => {
      if (!valid) {
        return false
      }
      this.formLoading = true
      const params: any = {
        ...this.dialogForm,
        measureId: this.form.measureId,
        measurementId: this.measureId,
        originalNo: this.form.originalNo,
        empId: '',
        empName: ''
      }
      addSingleMeasureDetail(params)
        .then((res: any) => {
          this.formLoading = false
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.formLoading = false
          this.handleFormCancel()
          this.getForm()
          this.getDetail()
        })
        .catch((err: any) => {
          this.formLoading = false
          return err
        })
    })
  }
  private handleFormCancel() {
    this.dialogVisible = false
    this.dialogForm = {
      measureType: 1,
      boxCode: undefined,
      height: undefined,
      length: undefined,
      wigth: undefined,
      weight: undefined
    }
    const root: any = this.$refs.editForm
    this.$nextTick(() => {
      root.clearValidate()
    })
  }
  private handleRowBegin() {
    this.dialogMachine = true
    this.title = '新增计量(逐箱)'
    this.$nextTick(() => {
      const ele:any = this.$refs.machineDown1
      ele.focus()
    })
  }
  private onMachineDown(val: string) {
    if (val === '6') {
      this.machineSave()
      return
    }
    const ele:any = this.$refs[`machineDown${val}`]
    ele.focus()
  }

  private machineSave(): void {
    const isValue = Object.values(this.machineForm).every((it: any) => !!it)
    if (!isValue) {
      this.$message.error('数据录入为空，无法保存')
      this.machineCancel()
      this.handleRowBegin()
      return
    }
    this.formLoading = true
    const params: any = {
      ...this.machineForm,
      measureId: this.form.measureId,
      measurementId: this.measureId,
      originalNo: this.form.originalNo,
      empId: '',
      empName: ''
    }
    addSingleMeasureDetail(params)
      .then((res: any) => {
        this.formLoading = false
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.formLoading = false
        this.machineCancel()
        this.handleRowBegin()
        this.getForm()
        this.getDetail()
      })
      .catch((err: any) => {
        this.formLoading = false
        return err
      })
  }
  private machineCancel() {
    this.machineForm = {
      measureType: 1,
      boxCode: undefined,
      height: undefined,
      length: undefined,
      wigth: undefined,
      weight: undefined
    }
    const root: any = this.$refs.machineForm
    this.$nextTick(() => {
      root.clearValidate()
    })
    this.dialogMachine = false
  }
  private handleComplate() {
    if (this.form.actualNumber < this.form.totalNumber) {
      this.$message.error('计量箱数与下单箱数不匹配')
      return
    }
    this.detailLoading = true
    const params = {
      id: this.measureId
    }
    updateStatus(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.getForm()
        this.getDetail()
      })
      .catch(() => {
        this.detailLoading = false
        return false
      })
  }
  private handlePrint(): void {
    // 打印
  }
  private handleRefuse(): void {
    // 拒绝
  }
  private handlePass(): void {
    // 通过
  }

  private handleTableSave(): void {
    // 保存
  }
  private handleSubmit(): void {
    // 提交结果
  }
  private handleRecheck(): void {
    // 计量复核
    this.$confirm(
      '确定需要进行计量复核吗？（提交复核申请后，将由代理商进行审核）',
      '温馨提示',
      {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消'
      }
    )
      .then(() => {
        // sure
      })
      .catch(() => {
        // cancel
      })
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
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
.order-detail {
  height: calc(100vh - 170px);
  overflow-y: auto;
}

.detail-back {
  text-align: right;
  padding: 0 20px;
  line-height: 40px;
  border-bottom: 1px solid #e8e8e8;
  background-color: #fff;
}
.detail-measure {
  background: rgb(231, 231, 231);
  padding: 0px 20px;
  line-height: 35px;
  font-size: 16px;
  font-weight: 700;
}
.dialog-charge-input {
  display: inline-block;
  width: 200px;
  margin-left: 10px;
}

</style>
