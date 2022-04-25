<template>
  <div
    v-loading="loading"
  >
    <el-form
      ref="selectForm"
      :model="selectForm"
      :rules="formRules"
      label-width="110px"
      size="small"
      style="padding-right: 20px;"
    >
      <el-form-item
        label="信用等级"
        prop="creditRating"
      >
        <el-select
          v-model="selectForm.creditRating"
          style="width:100%;"
          size="small"
          clearable
          placeholder="请选择"
          @change="onCredit"
        >
          <el-option
            v-for="(item, index) in creditList"
            :key="index"
            :label="`${item.code}-${item.name}`"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="信用额度"
        prop="credits"
      >
        <el-input-number
          v-model="selectForm.credits"
          :disabled="!selectForm.creditRating"
          class="input-number-valiate"
          :controls="false"
          placeholder="请输入"
          :min="0"
          :max="maxNum"
          :precision="2"
        />
      </el-form-item>
      <!-- <el-form-item
        label="序号"
        prop="serialNo"
      >
        <el-input-number
          v-model="selectForm.serialNo"
          class="input-number-valiate"
          :controls="false"
          placeholder="请输入"
          :min="0"
          :max="999999"
          :step="1"
          step-strictly
        />
      </el-form-item> -->

      <el-form-item
        label="提货方式"
        prop="takeMethod"
      >
        <el-select
          v-model="selectForm.takeMethod"
          style="width:100%;"
          size="small"
          clearable
          placeholder="请选择"
        >
          <el-option
            label="自主送货"
            value="1"
          />
          <el-option
            label="上门取货"
            value="2"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="备注"
        prop="notes"
      >
        <el-input
          v-model="selectForm.notes"
          placeholder="请输入"
          size="small"
          :maxlength="100"
        />
      </el-form-item>

      <!-- <el-form-item
        label="需要参数"
        prop="ifNeedParam"
      >
        <el-radio-group v-model="selectForm.ifNeedParam">
          <el-radio :label="true">
            是
          </el-radio>
          <el-radio :label="false">
            否
          </el-radio>
        </el-radio-group>
      </el-form-item> -->
    </el-form>
    <div
      slot="footer"
      style="text-align: right;margin-top: 20px;"
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
        @click="confirm"
      >
        确 定
      </el-button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  saveCredit
} from '@/api/financial-at-company-credit'

@Component({
  name: '',
  components: {
  },
  props: {
    creditList: {
      type: Array,
      default: () => []
    }
  }
})

export default class extends Vue {
  private selectForm: any = {
    creditRating: undefined,
    id: undefined,
    credits: undefined,
    notes: undefined,
    takeMethod: undefined
  }
  private formRules = {
    credits: [{ required: true, message: '信用额度不能为空', trigger: 'blur' }],
    creditRating: [{ required: true, message: '请选择信用等级', trigger: 'change' }],
    takeMethod: [{ required: true, message: '请选择提货方式', trigger: 'change' }]
  }
  private loading: boolean = false

  /** computed */
  get maxNum() {
    let num: number = 0
    const list: any = (this as any).creditList
    list.map((it: any) => {
      if (it.code === this.selectForm.creditRating) {
        num = it.rating
      }
    })
    return num
  }
  /** method */
  private setData(row: any) {
    const { id, creditRating, credits, notes, takeMethod } = row
    this.selectForm = {
      id, creditRating, credits, notes, takeMethod
    }
  }
  private onCredit() {
    this.selectForm.credits = undefined
  }
  private confirm() {
    const editForm: any = this.$refs.selectForm
    editForm.validate((valid: any) => {
      if (!valid) return false
      this.loading = true
      saveCredit(this.selectForm)
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.cancel()
          this.$emit('getAll')
          this.loading = false
        })
        .catch((err: any) => {
          this.loading = false
          return err
        })
    })
  }
  private cancel() {
    this.$emit('cancel')
  }
  private reset() {
    this.selectForm = {
      creditRating: undefined,
      id: undefined,
      credits: undefined,
      notes: undefined,
      takeMethod: undefined
    }
    this.$nextTick(() => {
      const form: any = this.$refs.selectForm
      form.clearValidate()
    })
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
