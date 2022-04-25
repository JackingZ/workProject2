<template>
  <div>
    <el-dialog
      :title="isEdit ? '编辑分拣口' : '新增分拣口'"
      :visible.sync="isShowUpdate"
      :close-on-click-modal="false"
      width="600px"
      @closed="cancel"
    >
      <div
        v-loading="formLoading"
        class="add-edit-truck"
      >
        <el-form
          ref="theForm"
          :model="selectForm"
          :rules="formRules"
          label-width="120px"
          label-position="right"
          size="small"
          style="padding-right: 20px;"
        >
          <el-form-item
            label="分拣口名称"
            prop="discharge"
          >
            <el-input
              v-model="selectForm.discharge"
              type="text"
              :maxlength="20"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="分拣口编码"
            prop="code"
          >
            <el-input-number
              v-model="selectForm.code"
              class="input-number-valiate"
              :controls="false"
              placeholder="请输入"
              step-strictly
              :step="1"
              :min="1"
              :max="8"
            />
          </el-form-item>
          <el-form-item
            label="备注"
          >
            <el-input
              v-model="selectForm.remarks"
              :maxlength="50"
              type="text"
              placeholder="请输入"
            />
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
          :loading="formLoading"
          @click="saveConfirm"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script  lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'
import dayjs from 'dayjs'
import {
  saveDischarge
} from '@/api/warehose-by-config'
function formParam() {
  return {
    discharge: undefined,
    code: undefined,
    remarks: undefined,
    warehouseId: undefined
  }
}

@Component({
  name: 'DischargeForm',
  components: {},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    wsId: {
      type: String,
      default: ''
    }
  }
})
export default class DischargeForm extends Vue {
  private isShowUpdate: boolean = false
  private formLoading: boolean = false
  private selectForm: any = formParam()
  private formRules = {
    discharge: [{ required: true, message: '请输入分拣口名称', trigger: 'blur' }],
    code: [
      { required: true, message: '请输入分拣口编码', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const myreg = /^[0-9a-zA-Z]+$/
          if (!value) {
            callback()
          }
          if (!myreg.test(value)) {
            callback(new Error('分拣口编码不正确'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }
  // computed

  // methods

  private clearValidate() {
    const theForm: any = this.$refs.theForm
    this.$nextTick(() => {
      theForm.clearValidate()
    })
  }

  // 重置表单
  private resetForm() {
    this.selectForm = formParam()
    this.clearValidate()
  }

  private cancel() {
    this.isShowUpdate = false
    this.resetForm()
  }

  private saveConfirm() {
    const editForm: any = this.$refs.theForm
    editForm.validate((valid: any) => {
      if (valid) {
        this.formLoading = true
        const params: any = {
          ...this.selectForm
        }
        saveDischarge(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.resetForm()
            this.formLoading = false
            this.isShowUpdate = false
            this.$emit('getTableList')
          })
          .catch((err: any) => {
            this.formLoading = false
            return err
          })
      } else {
        return false
      }
    })
  }

  private init(row: any) {
    this.isShowUpdate = true
    this.selectForm.warehouseId = (this as any).wsId
    const bool: boolean = (this as any).isEdit
    if (bool) {
      this.selectForm.id = row.id
      this.selectForm.discharge = row.discharge
      this.selectForm.code = row.code
      this.selectForm.remarks = row.remarks
    }
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
