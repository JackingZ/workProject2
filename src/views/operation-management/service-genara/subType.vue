<template>
  <div class="add-type">
    <el-button
      type="text"
      icon="el-icon-circle-plus-outline"
      @click="addSubType"
    >
      新增服务类型
    </el-button>

    <el-table
      v-loading="loading"
      :data="tableData"
      height="450px"
      style="width: 100%;margin: 10px 0;"
      border
    >
      <el-table-column
        prop="name"
        label="服务类型"
      />
      <el-table-column
        prop="overdue"
        width="100"
        label="逾期计费"
      >
        <template slot-scope="scope">
          {{ overdueFormat(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="overdueCharges"
        label="计费区间"
        width="180"
      >
        <template slot-scope="scope">
          {{ overdueChargesFormat(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        width="100"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="editOrgan(scope.row)"
          >
            编辑
          </el-button>
          <!-- <el-button
            type="text"
            @click="deleteOrgan(scope.row)"
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

    <el-dialog
      :title="subEdit ? '编辑服务类型' : '新增服务类型'"
      :visible.sync="isAddEditType"
      :close-on-click-modal="false"
      append-to-body
      width="600px"
      @close="cancel"
    >
      <div class="subType-form">
        <el-form
          ref="editForm"
          v-loading="formLoading"
          :model="selectForm"
          :rules="formRules"
          label-width="90px"
          label-position="right"
          size="small"
        >
          <el-form-item
            label="服务类型"
            prop="name"
          >
            <el-input
              ref="firstInput"
              v-model="selectForm.name"
              maxlength="20"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="逾期计费"
            prop="overdue"
          >
            <el-select
              v-model="selectForm.overdue"
              style="width:100%;"
              placeholder="请选择"
            >
              <el-option
                label="按重量"
                value="0"
              />
              <el-option
                label="按体积"
                value="1"
              />
              <el-option
                label="按比例"
                value="2"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="计费区间"
            prop="overdueCharges"
          >
            <div
              v-for="(item, index) in selectForm.overdueCharges"
              :key="index"
              class="item-after-icon"
            >
              <el-input-number
                v-model="selectForm.overdueCharges[index].lower"
                class="input-number-valiate"
                :controls="false"
                placeholder="输入下限"
                :min="0"
                :max="999999"
                :step="1"
                step-strictly
              />
              <el-input-number
                v-model="selectForm.overdueCharges[index].upper"
                class="input-number-valiate"
                :controls="false"
                placeholder="输入上限"
                :min="0"
                :max="999999"
                :step="1"
                step-strictly
              />
              <el-input-number
                v-model="selectForm.overdueCharges[index].amount"
                class="input-number-valiate"
                :controls="false"
                placeholder="单位金额"
                :min="0"
                :max="999999"
                :precision="2"
              />
              <span>
                <i
                  v-if="index===0"
                  class="el-icon-circle-plus-outline item-icon-plus"
                  @click="addRangeData"
                />
                <i
                  v-else
                  class="el-icon-remove-outline item-icon-reduce"
                  @click="deleteRangeData(index)"
                />
              </span>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="cancel()">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="saveConfirm()"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getServiceSubtypeConfigList,
  saveSubtype,
  deleteSubtype
} from '@/api/operation-of-service-genara'
import { isValidURL } from '@/utils/validate'

@Component({
  name: 'Port',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private isAddEditType: boolean = false
  private dialogLoading: boolean = false
  private subEdit: boolean = false
  private tableData: any = []
  private typeId = ''
  private typeName = ''
  private selectForm: any = {
    name: undefined,
    overdue: undefined,
    overdueCharges: [
      {
        lower: undefined,
        upper: undefined,
        amount: undefined
      }
    ]
  }
  private formLoading = false
  private page: number = 1
  private size: number = 10
  private total: any = 0

  private formRules = {
    name: [{ required: true, message: '服务类型不能为空', trigger: 'blur' }],
    overdue: [{ required: true, message: '请选择逾期计费', trigger: 'change' }],
    overdueCharges: [{ required: true, message: '计费区间不能为空', trigger: 'blur' }]
  }

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

  private overdueFormat(row: any): any {
    let name
    switch (row.overdue) {
      case '0':
        name = '按重量'
        break
      case '1':
        name = '按体积'
        break
      case '2':
        name = '按比例'
        break
      default:
        break
    }
    return name
  }
  private overdueChargesFormat(row: any) {
    let it = ''
    row.overdueCharges.map((item: any) => {
      if (item.lower && item.upper) {
        it += item.lower + '-' + item.upper + ', '
      }
    })
    return it
  }

  // 新增
  private addSubType(): void {
    this.subEdit = false
    this.isAddEditType = true
    this.$nextTick(() => {
      const ele:any = this.$refs.firstInput
      ele.focus()
    })
  }
  // 编辑
  private editOrgan(row: any): void {
    this.selectForm = row
    if (!Array.isArray(row.overdueCharges) || row.overdueCharges.length <= 0) {
      this.selectForm.overdueCharges = [{
        lower: undefined,
        upper: undefined,
        amount: undefined
      }]
    }
    this.subEdit = true
    this.isAddEditType = true
  }

  private addRangeData() {
    this.selectForm.overdueCharges.push({
      lower: undefined,
      upper: undefined,
      amount: undefined
    })
  }
  private deleteRangeData(index: number) {
    this.selectForm.overdueCharges.splice(index, 1)
  }

  // 重置表单
  private resetForm() {
    this.selectForm = {
      name: undefined,
      overdue: undefined,
      overdueCharges: [{
        lower: undefined,
        upper: undefined,
        amount: undefined
      }]
    }
  }
  // 关闭dialog重置表单
  private close(): void {
    this.isAddEditType = false
    this.resetForm()
  }

  private cancel() {
    this.isAddEditType = false
    this.resetForm()
    this.clearValidate()
  }
  private clearValidate() {
    const editForm: any = this.$refs.editForm
    this.$nextTick(() => {
      editForm.clearValidate()
    })
  }
  // 提交保存
  private saveConfirm() {
    const editForm: any = this.$refs.editForm
    editForm.validate((valid: any) => {
      if (!valid) {
        return false
      }
      const arrVal = this.selectForm.overdueCharges.every((item: any) => item.lower >= 0 && item.upper && item.amount)
      if (!arrVal) {
        this.$message.error('请完整填写计费值&单位金额')
        return false
      }
      const isMinMax = this.selectForm.overdueCharges.some((item:any) => {
        return item.upper <= item.lower
      })
      if (isMinMax) {
        this.$message({
          type: 'error',
          message: '下限值不能大于等于上限值'
        })
        return
      }
      let mixVal = false
      this.selectForm.overdueCharges.map((it: any, index: any) => {
        mixVal = this.selectForm.overdueCharges.some((r: any, i: any) => {
          if (index !== i) {
            return (r.lower <= it.lower && it.lower < r.upper) || (r.lower < it.upper && it.upper <= r.upper)
          } else {
            return false
          }
        })
      })
      if (mixVal) {
        this.$message({
          type: 'error',
          message: '区间范围不能重叠'
        })
        return
      }
      this.formLoading = true
      const params: any = {
        ...this.selectForm
      }
      params.typeId = this.typeId
      params.typeName = this.typeName
      saveSubtype(params)
        .then((res: any) => {
          this.formLoading = false
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.isAddEditType = false
          this.resetForm()
          this.clearValidate()
          this.queryAll()
        })
        .catch((err: any) => {
          this.formLoading = false
          return err
        })
    })
  }

  private deletRow(row: any) {
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
        deleteSubtype(params)
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

  private queryAll(): void {
    this.loading = true
    const params: any = {
      typeId: this.typeId,
      page: this.page,
      size: this.size
    }
    getServiceSubtypeConfigList(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || []
        this.tableData = data
        this.total = res.total
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

  private init(row: any): void {
    this.typeId = row.id
    this.typeName = row.name
    this.queryAll()
  }
}
</script>

<style lang="scss" scoped>
.subType-form {
  padding-left: 30px;
  padding-right: 60px;
}
.item-after-icon {
  position: relative;
  padding-bottom: 15px;
  .item-icon-plus {
    position: absolute;
    top: 6px;
    color:#409eff;
    font-size:18px;
    margin-left:10px;
    cursor:pointer;
  }
  .item-icon-reduce {
    position: absolute;
    top: 6px;
    color:#f56c6c;
    font-size:18px;
    margin-left:10px;
    cursor:pointer;
  }
}
.input-number-valiate {
  width: 33.33%;
  ::v-deep .el-input__inner {
    text-align: left !important;
  }
}
</style>
