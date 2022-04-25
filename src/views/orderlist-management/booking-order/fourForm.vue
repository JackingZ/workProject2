<template>
  <div v-loading="loading">
    <div
      style="text-align: right;padding: 0 20px 10px 0;"
    >
      <el-button
        v-show="!!isEffect && !isEdit && isEffect === isStatus"
        :disabled="orderType !== '0'"
        type="primary"
        size="small"
        @click="editForm"
      >
        编辑
      </el-button>
      <el-button
        v-show="!isEffect || isEdit || isEffect !== isStatus"
        :disabled="orderType !== '0'"
        type="primary"
        size="small"
        @click="saveForm"
      >
        保存
      </el-button>
    </div>
    <el-form
      ref="selectForm"
      :model="selectForm"
      :rules="formRules"
      :disabled="!isEdit && !!isEffect"
      label-width="120px"
      size="small"
    >
      <el-form-item
        label="提单号"
        prop="billNo"
      >
        <el-input
          v-model="selectForm.billNo"
          show-word-limit
          :maxlength="50"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item
        label="航空单号"
        prop="airNo"
      >
        <el-input
          v-model="selectForm.airNo"
          show-word-limit
          :maxlength="50"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item
        v-if="isStatus !== '211'"
        label="总件数"
        prop="packages"
      >
        <div class="input-content">
          <div style="flex: 1;">
            <el-input-number
              v-model="selectForm.packages"
              class="input-number-valiate input-border"
              :controls="false"
              placeholder="请输入"
              :min="0"
              :max="99999"
              :step="1"
              step-strictly
            />
          </div>
          <div class="input-select">
            <el-select
              v-model="selectForm.packagesUnit"
              size="small"
              style="width: 100%;"
              placeholder="请选择"
            >
              <el-option
                label="箱"
                value="BOX"
              />
              <el-option
                label="托"
                value="PLT"
              />
            </el-select>
          </div>
        </div>
      </el-form-item>
      <el-form-item
        v-if="isStatus !== '211'"
        label="总体积"
        prop="volume"
      >
        <div class="input-content">
          <div style="flex: 1;">
            <el-input-number
              v-model="selectForm.volume"
              class="input-number-valiate input-border"
              :controls="false"
              placeholder="请输入"
              :min="0"
              :max="99999"
              :precision="2"
            />
          </div>
          <div class="input-unit">
            {{ selectForm.volumeUnit }}
          </div>
        </div>
      </el-form-item>
      <el-form-item
        v-if="isStatus !== '211'"
        label="总重量"
        prop="weight"
      >
        <div class="input-content">
          <div style="flex: 1;">
            <el-input-number
              v-model="selectForm.weight"
              class="input-number-valiate input-border"
              :controls="false"
              placeholder="请输入"
              :min="0"
              :max="99999"
              :precision="2"
            />
          </div>
          <div class="input-unit">
            {{ selectForm.weightUnit }}
          </div>
        </div>
      </el-form-item>
      <el-form-item
        v-if="isStatus !== '213' && isStatus !== '212' && isStatus !== '211'"
        label="起飞时间"
        prop="departureTime"
      >
        <el-date-picker
          v-model="selectForm.departureTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          size="small"
          style="width:100%;"
        />
      </el-form-item>
      <el-form-item
        v-if="(isStatus === '217' && isEffect === '214') || ((isStatus === '215' || isStatus === '216' || isStatus === '217' || isStatus === '218' || isStatus === '219') && selectForm.arrivalTime2)"
        label="二程抵达时间"
        prop="arrivalTime2"
      >
        <el-date-picker
          v-model="selectForm.arrivalTime2"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          size="small"
          style="width:100%;"
        />
      </el-form-item>
      <el-form-item
        v-if="(isStatus === '215' && isEffect === '217') || (( isStatus === '215' || isStatus === '216' || isStatus === '218' || isStatus === '219') && selectForm.departureTime2)"
        label="二程起飞时间"
        prop="departureTime2"
      >
        <el-date-picker
          v-model="selectForm.departureTime2"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          size="small"
          style="width:100%;"
        />
      </el-form-item>
      <el-form-item
        v-if="isStatus === '216' || isStatus === '218' || isStatus === '219' "
        label="抵达时间"
        prop="arrivalTime"
      >
        <el-date-picker
          v-model="selectForm.arrivalTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          size="small"
          style="width:100%;"
        />
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  saveAir
} from '@/api/orderlist-at-booking'
import dayjs from 'dayjs'

function paramsForm() {
  return {
    airNo: undefined,
    billNo: undefined,
    volume: undefined,
    packages: undefined,
    weight: undefined,
    packagesUnit: 'BOX',
    volumeUnit: 'CBM',
    weightUnit: 'KGS',
    departureTime: undefined,
    arrivalTime: undefined,
    departureTime2: undefined,
    arrivalTime2: undefined
  }
}

@Component({
  name: 'oneForm',
  components: {},
  props: {
    isEffect: {
      type: String,
      default: ''
    },
    isOrder: {
      type: Object,
      default: () => ({})
    },
    orderType: {
      type: String,
      default: ''
    }
  }
})

export default class extends Vue {
  /* data */
  private selectForm: any = paramsForm()
  private formRules: any = {
    billNo: [
      { required: true, message: '提单号不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (reg.test(value)) {
            callback(new Error('提单号不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    airNo: [
      { required: true, message: '航空单号不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (reg.test(value)) {
            callback(new Error('航空单号不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    departureTime: [
      { required: true, message: '请选择起飞时间', trigger: 'change' }
    ],
    arrivalTime: [
      { required: true, message: '请选择抵达时间', trigger: 'change' }
    ],
    departureTime2: [
      { required: true, message: '请选择二程起飞时间', trigger: 'change' }
    ],
    arrivalTime2: [
      { required: true, message: '请选择二程抵达时间', trigger: 'change' }
    ],
    packages: [
      { required: true, message: '总件数不能为空', trigger: 'blur' }
    ],
    volume: [
      { required: true, message: '总体积不能为空', trigger: 'blur' }
    ],
    weight: [{ required: true, message: '总重量不能为空', trigger: 'blur' }]
  }
  private loading: boolean = false
  private selectLoading: boolean = false
  private isEdit: boolean = false
  private isStatus: any = ''

  /** computed */
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }
  /* methods */
  // 初始化
  private init(data: any) {
    const { packagesUnit, volumeUnit, weightUnit, ...form } = data
    Object.assign(this.selectForm, form)
    this.selectForm.packagesUnit = packagesUnit || 'BOX'
    this.selectForm.volumeUnit = volumeUnit || 'CBM'
    this.selectForm.weightUnit = weightUnit || 'KGS'
  }
  private set(val: any, bool: boolean) {
    this.isStatus = val
    this.isEdit = bool
  }
  private editForm() {
    this.isEdit = true
  }
  private saveForm() {
    const that = this as any
    const editForm: any = that.$refs.selectForm
    editForm.validate((valid: any) => {
      if (!valid) return false
      if (!(this as any).isStatus) {
        this.$message.error('请选择订单状态')
        return false
      }
      const obj = (this as any).isOrder || {}
      const params: any = {
        ...this.selectForm,
        bookingId: obj.id,
        status: (this as any).isStatus
      }
      this.edit(params)
    })
  }
  private edit(params: any) {
    this.loading = true
    saveAir(params)
      .then((res: any) => {
        this.loading = false
        this.$message.success('保存成功')
        this.$emit('refresh')
        this.isEdit = false
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private reset() {
    this.selectForm = paramsForm()
    this.isEdit = false
    this.$nextTick(() => {
      const editForm: any = this.$refs.selectForm
      editForm.clearValidate()
    })
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  display: inline-block;
  width: 24.9%;
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
.input-select {
  width: 70px;
  ::v-deep .el-input__inner {
    border-left: 0px;
    border-radius: 0 4px 4px 0;
  }
  ::v-deep .el-select .el-input.is-focus .el-input__inner {
    border-color: #dcdfe6;
  }
  ::v-deep .el-select .el-input__inner:focus {
    border-color: #dcdfe6;
  }
}
.input-border {
  ::v-deep .el-input__inner {
    border-radius: 4px 0 0 4px;
  }
}
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
</style>
