<template>
  <div>
    <el-dialog
      :title="isEdit ? '编辑班次信息' : '新增班次信息'"
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
            label="班次名称"
            prop="name"
          >
            <el-input
              v-model="selectForm.name"
              type="text"
              :maxlength="20"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="班次开始时间"
            prop="startTime"
          >
            <el-time-picker
              v-model="selectForm.startTime"
              placeholder="选择时间"
              style="width: 100%;"
              format="HH:mm"
              value-format="HH:mm"
              arrow-control
            />
          </el-form-item>
          <el-form-item
            label="班次结束时间"
            prop="endTime"
          >
            <el-time-picker
              v-model="selectForm.endTime"
              placeholder="选择时间"
              style="width: 100%;"
              format="HH:mm"
              value-format="HH:mm"
              arrow-control
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
  saveSchedul
} from '@/api/warehose-by-config'
function formParam() {
  return {
    name: undefined,
    startTime: undefined,
    endTime: undefined,
    warehouseId: undefined
  }
}

@Component({
  name: 'ScheldulingForm',
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
export default class ScheldulingForm extends Vue {
  private isShowUpdate: boolean = false
  private formLoading: boolean = false
  private selectForm: any = formParam()
  private formRules = {
    name: [
      { required: true, message: '班次名称不能为空', trigger: 'change' }
    ],
    startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
    endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
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
        params.startTime = params.startTime + ':00'
        params.endTime = params.endTime + ':00'
        saveSchedul(params)
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
      this.selectForm.name = row.name
      this.selectForm.startTime = dayjs(row.startTime).format('HH:mm')
      this.selectForm.endTime = dayjs(row.endTime).format('HH:mm')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
