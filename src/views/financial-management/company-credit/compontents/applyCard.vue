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
        label="成立时间"
        prop="setupDate"
      >
        {{ selectForm.setupDate }}
      </el-form-item>
      <el-form-item
        label="公司规模"
        prop="companySize"
      >
        {{ selectForm.companySize }} 人
      </el-form-item>
      <el-form-item
        label="注册资金"
        prop="registeredCapital"
      >
        {{ selectForm.registeredCapital }}
      </el-form-item>
      <el-form-item
        label="客户属性"
        prop="type"
      >
        <span v-if="selectForm.type === '0'">聚货通</span>
        <span v-else-if="selectForm.type === '1'">
          <span v-if="selectForm.subtype === '0'">
            直客
          </span>
          <span v-if="selectForm.subtype === '1'">
            同行
          </span>
        </span>
        <span v-else-if="selectForm.type === '2'">
          <span v-if="selectForm.subtype === '1'">
            一级代理
          </span>
          <span v-if="selectForm.subtype === '2'">
            二级代理
          </span>
        </span>
        <span v-else-if="selectForm.type === '3'">供应商</span>
      </el-form-item>
      <el-form-item
        label="销售类型"
        prop="saleType"
      >
        <span v-if="selectForm.saleType === '1'">平台</span>
        <span v-else-if="selectForm.saleType === '2'">线下</span>
      </el-form-item>

      <el-form-item
        label="平台"
        prop="platform"
      >
        {{ selectForm.platform }}
      </el-form-item>
      <el-form-item
        label="主力国家"
        prop="mainState"
      >
        {{ selectForm.mainState }}
      </el-form-item>

      <el-form-item
        label="店铺链接"
        prop="storeLink"
      >
        {{ selectForm.storeLink }}
      </el-form-item>
      <el-form-item
        label="品牌"
        prop="brand"
      >
        {{ selectForm.brand }}
      </el-form-item>
      <el-form-item
        label="驰名商标"
        prop="trademark"
      >
        {{ selectForm.trademark }}
      </el-form-item>
      <el-form-item
        label="申请理由"
        prop="notes"
      >
        <el-input
          v-model="selectForm.notes"
          :maxlength="100"
          :autosize="{minRows: 2, maxRows: 4}"
          type="textarea"
          placeholder="请输入"
          style="width:100%;margin-bottom: 20px;"
        />
      </el-form-item>
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
  saveApplyCard,
  getCredit
} from '@/api/financial-at-company-credit'

@Component({
  name: '',
  components: {
  },
  props: {
  }
})

export default class extends Vue {
  private row: any = {}
  private selectForm: any = {
    subtype: undefined,
    setupDate: undefined,
    type: undefined,
    companySize: undefined,
    registeredCapital: undefined,
    saleType: undefined,
    platform: undefined,
    custId: undefined,
    countryName: undefined,
    storeLink: undefined,
    brand: undefined,
    trademark: undefined,
    notes: undefined,
    mainState: ''
  }
  private formRules = {
    notes: [{ required: true, message: '申请理由不能为空', trigger: 'blur' }]
    // format: [{ required: true, message: '请选择报表格式', trigger: 'change' }],
    // ifNeedParam: [{ required: true, message: '请选择是否需要参数', trigger: 'change' }],
    // tag: [{ required: true, message: '请输入报表标识', trigger: 'change' }]
  }
  private loading: boolean = false
  private platList: any[] = []
  private countryList: any[] = []

  /** method */
  private getCredit() {
    const params = {
      custId: this.selectForm.custId
    }
    this.loading = true
    getCredit(params).then((res: any) => {
      this.loading = false
      this.selectForm.notes = (res.data || {}).notes
    }).catch(_ => {
      this.loading = false
      this.selectForm.notes = ''
    })
  }
  private setData(row: any) {
    this.row = row
    const {
      id,
      setupDate,
      saleType,
      platform,
      countryName,
      storeLink,
      type,
      companySize,
      registeredCapital,
      brand,
      subtype,
      trademark,
      mainState
    } = row
    this.selectForm = {
      custId: id,
      setupDate,
      saleType,
      platform,
      countryName,
      storeLink,
      type,
      companySize,
      registeredCapital,
      brand,
      notes: '',
      subtype,
      trademark,
      mainState
    }
    this.getCredit()
  }
  private confirm() {
    const editForm: any = this.$refs.selectForm
    editForm.validate((valid: any) => {
      if (!valid) return
      this.loading = true
      const params: any = {
        custId: this.selectForm.custId,
        // id: this.row.id,
        notes: this.selectForm.notes,
        auditing: this.row.audit
      }
      saveApplyCard(params)
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
      setupDate: undefined,
      type: undefined,
      companySize: undefined,
      registeredCapital: undefined,
      saleType: undefined,
      platform: undefined,
      custId: undefined,
      countryName: undefined,
      storeLink: undefined,
      brand: undefined,
      trademark: undefined,
      notes: undefined,
      mainState: ''
    }
    this.$nextTick(() => {
      const form: any = this.$refs.selectForm
      form.clearValidate()
    })
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0;
}
</style>
