<template>
  <div class="app-panel order-detail">
    <div class="detail-title">
      计量申请单详细信息
    </div>
    <el-form
      ref="detail"
      :model="form"
      label-width="160px"
      label-position="right"
      class="detail-form"
    >
      <!-- <el-form-item label="计量申请单ID：">
        {{ form.fullorderId }}
      </el-form-item> -->
      <el-form-item label="原单号：">
        {{ form.originalNo }}
      </el-form-item>
      <el-form-item label="仓库名称：">
        {{ form.warehouseName }}
      </el-form-item>
      <el-form-item
        label="客户名称："
        style="width: 49%;"
      >
        {{ (row.buyer || {}).name }}
      </el-form-item>
      <el-form-item label="入仓时间：">
        {{ row.storageTime }}
      </el-form-item>
      <el-form-item label="渠道：">
        {{ (row.lsc || {}).value }}
      </el-form-item>
      <el-form-item label="计量方式：">
        逐箱
        <!-- <span v-if="form.measureMethod === 1">
          逐箱
        </span>
        <span v-else-if="form.measureMethod === 2">
          批量
        </span>
        <span v-else-if="form.measureMethod === 3">
          打托
        </span> -->
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
        <span v-if="form.measureStatus === 1">
          待计量
        </span>
        <span v-else-if="form.measureStatus === 2">
          计量中
        </span>
        <span v-else-if="form.measureStatus === 3">
          计量已完成
        </span>
      </el-form-item>
      <!-- <el-form-item label="审核状态：">
        <span v-if="form.auditStatus === 1">
          待审核
        </span>
        <span v-else-if="form.auditStatus === 2">
          审核通过
        </span>
        <span v-else-if="form.auditStatus === 3">
          审核拒绝
        </span>
      </el-form-item> -->
      <!-- <el-form-item label="要求完成时间：">
        {{ form.expectedMeasureTime }}
      </el-form-item>
      <el-form-item label="实际完成时间：">
        {{ form.actualMeasureTime }}
      </el-form-item> -->
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
              <div>
                <!-- <el-button
                  v-if="form.auditStatus !== 2"
                  type="primary"
                  size="mini"
                  @click="handleRowAdd"
                >
                  新增
                </el-button>
                <el-button
                  v-if="form.auditStatus !== 2"
                  type="primary"
                  size="mini"
                  @click="handleBatchDelete"
                >
                  批量删除
                </el-button>
                <el-upload
                  v-if="custType === '2' && form.auditStatus !== 2"
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
                </el-upload> -->
                <el-button
                  v-if="form.measureStatus"
                  type="primary"
                  size="mini"
                  @click="handleExport"
                >
                  导出Excel
                </el-button>
              </div>
            </el-col>
            <!--<el-col
              v-if="form.measureStatus"
              :span="2"
              style="text-align: right;"
            >
              <el-button
                type="primary"
                size="mini"
                @click="handleExport"
              >
                导出Excel
              </el-button>
            </el-col>-->
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
          <el-form-item label="实际总件数：">
            {{ form.actualNumber }}
          </el-form-item>
          <el-form-item label="实际总体积（m³）：">
            {{ form.actualVolume }}
          </el-form-item>
          <el-form-item label="实际总重量（kg）：">
            {{ form.actualWeight }}
          </el-form-item>
        </div>
        <div>
          <el-form-item
            v-if="(row.lscConfig || {}).priceType === '2'"
            label="收费重量（kg）："
          >
            {{ (row.price || {}).afinalWeightVol }}
          </el-form-item>
          <el-form-item
            v-if="(row.lscConfig || {}).priceType === '3'"
            label="收费体积（m³）："
          >
            {{ (row.price || {}).afinalWeightVol }}
          </el-form-item>
          <el-form-item
            :label="`总货值(${(row.lscConfig || {}).declaredCurrency})：`"
          >
            {{ row.value || '--' }}
          </el-form-item>
          <el-form-item
            v-if="((row.price || {}).billingConfig || {}).type === '0'"
            label="总体积重："
          >
            {{ form.totalWeightVolume }}
          </el-form-item>
          <el-form-item
            v-if="((row.price || {}).billingConfig || {}).type === '1'"
            label="总重量体积："
          >
            {{ form.totalWv }}
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
      <!-- <el-table-column
        type="selection"
        width="55"
      /> -->
      <el-table-column
        prop="measureType"
        label="类型"
      >
        逐箱
        <!-- <template slot-scope="scope">
          <div v-if="scope.row.measureType === 1">
            逐箱
          </div>
          <div v-else-if="scope.row.measureType === 2">
            批量
          </div>
          <div v-else-if="scope.row.measureType === 3">
            打托
          </div>
        </template> -->
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
          <span
            v-else
            :class="formatExceed(scope.row, 'length') ? 'word-color' : ''"
          >
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
            v-model="scope.row.width"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="999999"
            :precision="2"
          />
          <span
            v-else
            :class="formatExceed(scope.row, 'width') ? 'word-color' : ''"
          >
            {{ scope.row.width }}
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
          <span
            v-else
            :class="formatExceed(scope.row, 'height') ? 'word-color' : ''"
          >
            {{ scope.row.height }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="girth"
        label="围长"
      >
        <template slot-scope="scope">
          <span
            :class="(row.country.key === 'US' && scope.row.girth >= 260) ||
              (row.country.key === 'CA' && scope.row.girth >= 320) ? 'word-color' : ''"
          >
            {{ scope.row.girth }}
          </span>
        </template>
      </el-table-column>
      <!--<el-table-column
        v-if="(((row.price || {}).billingConfig || {})).type === '0'"
        prop="volumeV"
        label="材积重"
      />-->
      <el-table-column
        v-if="(((row.price || {}).billingConfig || {})).type === '0'"
        prop="weightVolume"
        label="体积重"
      />
      <el-table-column
        v-if="(((row.price || {}).billingConfig || {})).type === '1'"
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
      <!-- <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="!scope.row.isEdit && form.auditStatus !== 2"
            type="text"
            @click="handleRowEdit(scope.row, scope.$index)"
          >
            编辑
          </el-button>
          <el-button
            v-if="scope.row.isEdit && form.auditStatus !== 2"
            type="text"
            @click="handleRowSave(scope.row)"
          >
            保存
          </el-button>
          <el-button
            v-if="form.auditStatus !== 2"
            type="text"
            @click="handleRowDelete([scope.row.id])"
          >
            删除
          </el-button>
        </template>
      </el-table-column> -->
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
          prop="width"
        >
          <el-input-number
            v-model="dialogForm.width"
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  getMeasureById,
  getMeasureList,
  updateSingleMeasure,
  deleteSingleMeasure,
  setExcelImport,
  updateStatus,
  getExcelExport
} from '@/api/orderlist-at-whole'

import dayjs from 'dayjs'

@Component({
  name: 'measure',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private row: any = {}
  private form: any = {
    actualMeasureTime: undefined,
    applicant: undefined,
    applicantId: undefined,
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
  private fileList: any = []
  private loading: boolean = false
  private formLoading: boolean = false
  private tableData: any[] = []
  private title = ''
  private isEdit = false
  private dialogVisible = false
  private dialogForm: any = {
    boxCode: undefined,
    height: undefined,
    length: undefined,
    width: undefined,
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
    width: [{ required: true, message: '宽度不能为空', trigger: 'blur' }],
    weight: [{ required: true, message: '重量不能为空', trigger: 'blur' }]
  }
  private orderId: any = ''
  private page: number = 1
  private size: number = 10
  private total: number = 10
  private selectArr: any[] = []

  /** computed */
  get table() {
    const data = (this as any).tableData
    return data
  }
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }
  /* methods */
  private formatExceed(row: any, str: string) {
    const arr = [row.length || 0, row.width || 0, row.height || 0].sort((a: any, b: any) => b - a)
    if (row[str] >= 120) {
      return true
    } else if (row[str] === arr[1] && row[str] >= 75) {
      return true
    }
  }
  private setData(row: any) {
    this.row = row
    this.orderId = (row || {}).id || ''
    this.getForm()
    this.getDetail()
  }

  private removeFileList(): void {
    this.fileList = []
  }

  private uploadFile(params: any): void {
    const { file } = params
    const form: FormData = new FormData()
    form.append('file', file)
    form.append('lineMeasureInfoId', this.form.id)
    setExcelImport(form)
      .then((res: any) => {
        this.getForm()
        this.getDetail()
        this.$message.success('导入成功')
      })
      .catch((err: any) => {
        return err
      })
  }

  private getForm(): void {
    // 查询
    this.$emit('setload', true)
    const billingConfig = (this.row.price || {}).billingConfig || {}
    getMeasureById({
      fullorderId: this.orderId,
      type: billingConfig.type,
      density: billingConfig.density,
      vw: billingConfig.vw
    })
      .then((res: any) => {
        const data = res.data || {}
        this.form = data
        this.$emit('setload', false)
      })
      .catch((err: any) => {
        this.$emit('setload', false)
        return [null, err]
      })
  }
  private getDetail() {
    this.loading = true
    const billingConfig = (this.row.price || {}).billingConfig || {}
    getMeasureList({
      model: {
        fullorderId: this.orderId,
        billingConfig
      },
      page: this.page,
      size: this.size
    }).then((res: any) => {
      const data = res.data || {}
      this.tableData = data.result || []
      this.total = data.total
      this.loading = false
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
    const params = list || []
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteSingleMeasure(params)
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
    updateSingleMeasure(params)
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
        lineMeasureInfoId: this.form.id,
        orderId: this.orderId,
        originalNo: this.form.originalNo,
        custId: this.form.custId,
        custName: this.form.custName,
        warehouseId: this.form.warehouseId,
        warehouseName: this.form.warehouseName
      }
      updateSingleMeasure(params)
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
      boxCode: undefined,
      height: undefined,
      length: undefined,
      width: undefined,
      weight: undefined
    }
    const root: any = this.$refs.editForm
    this.$nextTick(() => {
      root.clearValidate()
    })
  }

  private handleExport() {
    //    // 导出excel
    const billingConfig = (this.row.price || {}).billingConfig || {}
    getExcelExport({
      billingConfig,
      custId: this.form.custId,
      endTime: this.form.endTime,
      fullorderId: this.orderId,
      originalNo: this.form.originalNo,
      startTime: this.form.startTime,
      warehouseId: this.form.warehouseId
    }).then((res: any) => {
      const a = document.createElement('a')
      document.body.appendChild(a)
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      const objUrl = URL.createObjectURL(blob)
      a.href = objUrl
      a.download = '计量数据列表' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.xls'
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(objUrl)
    }).catch((err: any) => {
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
  private handleComplate() {
    this.$emit('setload', true)
    const params = {
      auditStatus: 2,
      id: this.form.id,
      originalNo: this.form.originalNo
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
        this.$emit('setload', false)
        return false
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

.detail-title {
  line-height: 30px;
  font-size: 20px;
  font-weight: 600;
}
.dialog-charge-input {
  display: inline-block;
  width: 200px;
  margin-left: 10px;
}
.word-color {
  color: #E12E2E;
}

</style>
