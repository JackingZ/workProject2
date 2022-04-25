<template>
  <div v-loading="formLoading">
    <el-form
      ref="priceForm"
      :model="selectForm"
      :rules="formRules"
      label-width="100px"
      label-position="right"
      size="small"
      style="padding-right: 20px;"
    >
      <el-form-item
        label="报价单价"
        prop="declarePrice"
      >
        <el-input-number
          v-model="selectForm.declarePrice"
          class="input-number-valiate"
          :controls="false"
          placeholder="请输入"
          :min="0"
          :max="99999"
          :precision="2"
        />
      </el-form-item>
      <el-form-item
        label="申报单价"
        prop="offerPrice"
      >
        <el-input-number
          v-model="selectForm.offerPrice"
          class="input-number-valiate"
          :controls="false"
          placeholder="请输入"
          :min="0"
          :max="99999"
          :precision="2"
        />
      </el-form-item>
      <el-form-item
        label="币种"
        prop="currency"
      >
        <el-select
          v-model="selectForm.currency"
          placeholder="请选择"
          size="small"
          style="width: 100%;"
          clearable
        >
          <el-option
            v-for="item in currencyList"
            :key="item.id"
            :label="`${item.name}-${item.sign}`"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div
      style="text-align: right;padding-top: 10px;"
    >
      <el-button @click="cancel">
        取 消
      </el-button>
      <el-button
        type="primary"
        @click="comfirm"
      >
        确 定
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getCurrencyList,
  saveCommodityAudit
} from '@/api/system-in-commodity-audit'
@Component({
  name: '',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private selectForm: any = {
    declarePrice: undefined,
    offerPrice: undefined,
    currency: undefined
  }
  private formRules = {
    declarePrice: { required: true, message: '报价单价不能为空', trigger: 'blur' },
    offerPrice: { required: true, message: '申报单价不能为空', trigger: 'blur' },
    currency: { required: true, message: '请选择币种', trigger: 'change' }
  }
  private currencyList: any[] = []
  private formLoading: boolean = false
  /* 方法 */
  private setData(row: any) {
    this.getCurrencyList()
    this.selectForm = {
      ...row
    }
  }
  private getCurrencyList() {
    getCurrencyList({
      page: 1,
      size: 9999
    }).then((res: any) => {
      const data = res.data || {}
      this.currencyList = data.result || []
    }).catch((err: any) => {
      return [err, null]
    })
  }

  private cancel() {
    this.$emit('priceCancel')
    this.$nextTick(() => {
      const formDom:any = this.$refs.priceForm
      formDom.clearValidate()
    })
  }
  private comfirm() {
    const formDom:any = this.$refs.priceForm
    formDom.validate((valid:any) => {
      if (valid) {
        this.formLoading = true
        const params: any = { ...this.selectForm }
        saveCommodityAudit(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.resetForm()
            this.cancel()
            this.formLoading = false
            this.$emit('queryAll')
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
  private resetForm() {
    this.selectForm = {
      declarePrice: undefined,
      offerPrice: undefined,
      currency: undefined
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
