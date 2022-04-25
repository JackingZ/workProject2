<template>
  <div v-loading="subLoading">
    <el-form
      v-if="!isPay"
      ref="subForm"
      :model="subForm"
      :rules="formRules"
      label-width="90px"
      size="small"
    >
      <el-row :gutter="10">
        <el-col :span="6">
          <el-select
            v-model="subForm.tag"
            placeholder="公司类型"
            style="width: 100%;"
            size="small"
            @change="onType"
          >
            <el-option
              v-for="(item, index) in casList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-col>
        <el-col :span="9">
          <el-form-item
            label="信用等级"
            prop="creditRating"
          >
            <el-select
              v-model="subForm.creditRating"
              placeholder="信用等级"
              style="width: 100%;"
              size="small"
              @change="onCredit"
            >
              <el-option
                v-for="(item, index) in creditList"
                :key="index"
                :label="`${item.code}-${item.name}`"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item
            label="信用额度"
            prop="initialAmount"
          >
            <el-input-number
              v-model="subForm.initialAmount"
              class="input-number-valiate"
              :controls="false"
              placeholder="请输入"
              :min="0"
              :max="99999999"
              :precision="2"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      ref="serviceSelectTable"
      :data="subTableData"
      height="400px"
      style="width: 100%;margin: 10px 0;"
      border
    >
      <el-table-column
        prop="typeName"
        label="服务大类"
      />
      <el-table-column
        prop="subtypeName"
        label="服务类型"
      />
      <el-table-column
        label="结算方式"
      >
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.payMethod"
            style="width:100%;"
            placeholder="请选择"
            size="small"
            filterable
          >
            <el-option
              v-for="(item, index) in typeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="付款天数"
        width="120"
      >
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.payDays"
            class="input-number-valiate"
            size="small"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="999999"
            :step="1"
            step-strictly
          />
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
      >
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.notes"
            size="small"
            style="width:100%;"
            placeholder="请输入"
          />
        </template>
      </el-table-column>
    </el-table>

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
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  saveTemplate,
  getTemplateData,
  getPaytype,
  savePaytype,
  getWordsList
} from '@/api/financial-at-company-credit'

@Component({
  name: '',
  components: {},
  props: {
    isPay: {
      type: Boolean,
      default: false
    },
    creditList: {
      type: Array,
      default: () => ([])
    }
  }
})
export default class extends Vue {
  /** data */
  private subLoading: boolean = false
  private subForm: any = {
    tag: '1',
    initialAmount: undefined,
    creditRating: undefined
  }
  private formRules = {
    initialAmount: [{ required: true, message: '信用额度不能为空', trigger: 'blur' }],
    creditRating: [{ required: true, message: '请选择信用等级', trigger: 'change' }]
  }
  private casList: any[] = [
    { name: '一级代理商', id: '1' },
    { name: '二级代理商', id: '2' },
    { name: '同行', id: '3' },
    { name: '直客', id: '4' }
  ]
  private currentId = ''
  private signC: any = ''
  private typeList: any[] = []
  private subTableData: any[] = []
  private selectLoading: boolean = false

  /** method */
  private setData(row: any) {
    this.currentId = row.id
    this.signC = row.signContract
    this.getSubTableData()
    this.getPaytypeList()
  }
  private setInfo() {
    this.getSubTableData()
    this.getPaytypeList()
  }
  private onType() {
    this.subTableData = []
    this.getSubTableData()
  }
  private onCredit() {
    const arr = (this as any).creditList
    const item = arr.find((it: any) => it.id === this.subForm.creditRating)
    this.subForm.initialAmount = (item || {}).rating
  }

  private getPaytypeList() {
    this.selectLoading = true
    getWordsList({
      type: 'CUST_PAY_METHOD'
    })
      .then((res: any) => {
        const data = res.data || []
        this.typeList = data
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private getSubTableData() {
    this.subLoading = true
    const params: any = {}
    const isP = (this as any).isPay
    if (isP) {
      params.id = this.currentId
      getPaytype(params)
        .then((res: any) => {
          this.subLoading = false
          const data = res.data || []
          this.subTableData = data.map((e: any) => {
            e.payDays = e.payDays || undefined
            return e
          })
        })
        .catch((err: any) => {
          this.subLoading = false
          return err
        })
    } else {
      params.tag = this.subForm.tag
      getTemplateData(params)
        .then((res: any) => {
          this.subLoading = false
          const data = res.data || {}
          const { ctlList, tag, ...form } = data
          this.subForm = { ...this.subForm, ...form }
          this.subTableData = (ctlList || []).map((e: any) => {
            e.payDays = e.payDays || undefined
            return e
          })
        })
        .catch((err: any) => {
          this.subLoading = false
          return err
        })
    }
  }
  private confirm() {
    const isP = (this as any).isPay
    if (isP) {
      const isVal = this.subTableData.some((it: any) => it.payMethod && it.payDays)
      const isSign = this.subTableData.some((it: any) => it.payMethod !== '1')
      if (!isVal) {
        this.$message.error('请完整填写付款方式和付款天数')
        return
      } else if (this.signC !== '1' && isSign) {
        this.$message.error('未签署合同，结算方式仅限为每票结算')
        return
      }
      this.subLoading = true
      savePaytype(this.subTableData)
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.cancel()
          this.$emit('getAll')
          this.subLoading = false
        })
        .catch((err: any) => {
          this.subLoading = false
          return err
        })
    } else {
      const editForm: any = this.$refs.subForm
      editForm.validate((valid: any) => {
        if (!valid) return false
        const isVal = this.subTableData.some((it: any) => it.payMethod && it.payDays)
        if (!isVal) {
          this.$message.error('请完整填写付款方式和付款天数')
          return
        }
        this.subLoading = true
        const params: any = {
          ...this.subForm,
          ctlList: this.subTableData
        }
        saveTemplate(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.cancel()
            this.$emit('getAll')
            this.subLoading = false
          })
          .catch((err: any) => {
            this.subLoading = false
            return err
          })
      })
    }
  }
  private cancel() {
    this.$emit('cancel')
  }
  private reset() {
    this.subTableData = []
    this.subForm = {
      tag: '1',
      initialAmount: undefined,
      creditRating: undefined
    }
    const form: any = this.$refs.subForm
    this.$nextTick(() => {
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
.el-form-item {
  margin-bottom: 10px;
}
</style>
