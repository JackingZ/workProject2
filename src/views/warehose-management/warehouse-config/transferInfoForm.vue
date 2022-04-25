<template>
  <div>
    <el-dialog
      :title="isEdit ? '编辑转仓信息' : '新增转仓信息'"
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
            label="目的仓"
            prop="targetId"
          >
            <el-select
              v-model="selectForm.targetId"
              style="width:100%;"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option
                v-for="item in purposeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="转仓时间"
            prop="transitTime"
          >
            <div class="input-content">
              <div style="flex: 1;">
                <el-input-number
                  v-model="selectForm.transitTime"
                  class="input-number-valiate input-border"
                  :controls="false"
                  placeholder="请输入"
                  :min="0"
                  :max="999"
                  :step="1"
                  step-strictly
                />
              </div>
              <div class="input-unit">
                小时
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="重量单价"
            prop="priceWeight"
          >
            <el-input
              v-model="selectForm.priceWeight"
              type="text"
              :maxlength="20"
              placeholder="请输入"
            >
              <el-select
                slot="append"
                v-model="selectForm.umWeight"
                style="width: 120px;"
              >
                <el-option
                  label="RMB/KGS"
                  value="KGS"
                />
                <el-option
                  label="RMB/LBS"
                  value="LBS"
                />
                <el-option
                  label="RMB/OZS"
                  value="OZS"
                />
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item
            label="体积单价"
            prop="priceVolume"
          >
            <el-input
              v-model="selectForm.priceVolume"
              type="text"
              :maxlength="20"
              placeholder="请输入"
            >
              <el-select
                slot="append"
                v-model="selectForm.umVolume"
                style="width: 120px;"
              >
                <el-option
                  label="RMB/CBM"
                  value="CBM"
                />
                <el-option
                  label="RMB/CUFT"
                  value="CUFT"
                />
              </el-select>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="small"
          @click="cancel"
        >
          取 消
        </el-button>
        <el-button
          type="primary"
          size="small"
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
import {
  getSingleTransitList,
  saveTransit,
  getPurposeWH
} from '@/api/warehose-by-config'
function formParam() {
  return {
    targetId: undefined,
    targetName: undefined,
    transitTime: undefined,
    priceVolume: undefined,
    priceWeight: undefined,
    umVolume: 'CBM',
    umWeight: 'KGS',
    warehouseId: undefined
  }
}
function validateNums(rule: any, value: any, callback: (val?: any) => void) {
  const reg = /^\d+(\.\d{0,2})?$/
  if (!reg.test(value)) {
    callback(new Error('单价为正数且最多为两位小数'))
  } else {
    callback()
  }
}

@Component({
  name: 'TransferInfoForm',
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
export default class TransferInfoForm extends Vue {
  private isShowUpdate: boolean = false
  private formLoading: boolean = false
  private selectForm: any = formParam()
  private purposeList: any[] = []
  private formRules = {
    transitTime: [{ required: true, message: '请选择转仓时间', trigger: 'change' }],
    targetId: [{ required: true, message: '请选择目的仓', trigger: 'change' }],
    priceVolume: [
      { required: true, message: '体积单价不能为空', trigger: 'blur' },
      { validator: validateNums, trigger: 'blur' }
    ],
    priceWeight: [
      { required: true, message: '重量单价不能为空', trigger: 'blur' },
      { validator: validateNums, trigger: 'blur' }
    ]
  }
  // computed

  // methods
  private getPurposeWH() {
    getPurposeWH({
      id: this.selectForm.warehouseId
    })
      .then((res: any) => {
        const data = res.data || []
        this.purposeList = data
      })
      .catch((err: any) => {
        return [err, null]
      })
  }

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
        this.purposeList.map((item: any) => {
          if (item.id === params.targetId) {
            params.targetName = item.name
          }
        })
        saveTransit(params)
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

  private getWareHouseEdit() {
    this.formLoading = true
    getSingleTransitList({
      id: this.selectForm.id
    })
      .then((res: any) => {
        const data = res.data || {}
        this.selectForm = { ...data }
        this.formLoading = false
      })
      .catch((err: any) => {
        this.formLoading = false
        return [err, null]
      })
  }

  private init(row: any) {
    this.isShowUpdate = true
    this.selectForm.warehouseId = (this as any).wsId
    this.getPurposeWH()
    const bool: boolean = (this as any).isEdit
    if (bool) {
      this.selectForm.id = row.id
      this.getWareHouseEdit()
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
.input-content {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.input-unit {
  width: 70px;
  height: 32px;
  background-color: #f5f7fa;
  color: #909399;
  padding: 0 10px;
  border: 1px solid #dcdfe6;
  border-left: 0;
  border-radius: 0 4px 4px 0;
  margin-left: -1px;
}
.input-border {
  ::v-deep .el-input__inner {
    border-radius: 4px 0 0 4px;
  }
}
</style>
