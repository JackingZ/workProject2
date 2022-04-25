<template>
  <div>
    <el-form
      v-show="!isNext"
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
        label="开始合作"
        prop="cooperate"
      >
        {{ selectForm.cooperate }}
      </el-form-item>
      <el-form-item
        label="公司规模"
        prop="companySize"
      >
        {{ selectForm.companySize }} 人
      </el-form-item>
      <el-form-item
        label="合作金额"
        prop="cooperationAmount"
      >
        {{ selectForm.cooperationAmount }}
      </el-form-item>
      <el-form-item
        label="注册资金"
        prop="registeredCapital"
      >
        {{ selectForm.registeredCapital }}
      </el-form-item>
      <el-form-item
        label="付款情况"
        prop="payment"
      >
        {{ selectForm.payment }}
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
        label="当前欠款"
        prop="debts"
      >
        {{ selectForm.debts }}
      </el-form-item>
      <el-form-item
        label="销售类型"
        prop="saleType"
      >
        <span v-if="selectForm.saleType === '1'">平台</span>
        <span v-else-if="selectForm.saleType === '2'">线下</span>
      </el-form-item>
      <el-form-item
        label="最近付款日期"
        prop="lastPayment"
      >
        {{ selectForm.lastPayment }}
      </el-form-item>
      <el-form-item
        label="平台"
        prop="platform"
      >
        {{ selectForm.platform }}
      </el-form-item>
      <el-form-item
        label="逾期次数"
        prop="overdueTimes"
      >
        {{ selectForm.overdueTimes }}
      </el-form-item>
      <el-form-item
        label="主力国家"
        prop="mainState"
      >
        {{ selectForm.mainState }}
      </el-form-item>
      <el-form-item
        label="逾期金额"
        prop="overdueAmount"
      >
        {{ selectForm.overdueAmount }}
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
      <div v-if="isCheck">
        <el-form-item
          label="信用额度"
          prop="initialAmount"
          style="margin-bottom: 20px;"
        >
          <el-input-number
            v-model="selectForm.initialAmount"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="999999"
            :precision="2"
          />
        </el-form-item>
        <el-form-item
          label="信用等级"
          prop="creditRating"
          style="margin-bottom: 20px;"
        >
          <el-select
            v-model="selectForm.creditRating"
            placeholder="信用等级"
            style="width: 100%;"
            size="small"
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
          label="备注"
          prop="notes"
          style="margin-bottom: 20px;"
        >
          <el-input
            v-model="selectForm.notes"
            :maxlength="100"
            :autosize="{minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入"
            style="width:100%;"
          />
        </el-form-item>
        <div
          slot="footer"
          style="text-align: right;"
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
            @click="next"
          >
            下一步，付款方式
          </el-button>
        </div>
      </div>
    </el-form>
    <div
      v-show="isNext"
      v-loading="subLoading"
    >
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
          @click="back"
        >
          上一步
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="confirm"
        >
          保 存
        </el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getPaytype,
  saveAudit,
  getWordsList
} from '@/api/financial-at-company-credit'

@Component({
  name: '',
  components: {
  },
  props: {
    isCheck: {
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
  private selectForm: any = {
    subtype: undefined,
    setupDate: undefined,
    cooperate: undefined,
    payment: undefined,
    debts: undefined,
    saleType: undefined,
    platform: undefined,
    lastPayment: undefined,
    type: undefined,
    companySize: undefined,
    registeredCapital: undefined,
    overdueTimes: undefined,
    countryName: undefined,
    overdueAmount: undefined,
    storeLink: undefined,
    brand: undefined,
    trademark: undefined,
    cooperationAmount: undefined,
    initialAmount: undefined,
    creditRating: undefined,
    notes: undefined,
    id: undefined,
    mainState: ''
  }
  private formRules = {
    initialAmount: [{ required: true, message: '信用额度不能为空', trigger: 'blur' }],
    creditRating: [{ required: true, message: '请选择信用等级', trigger: 'change' }]
  }
  private isNext: boolean = false
  private subLoading: boolean = false
  private typeList: any[] = []
  private subTableData: any[] = []

  /** method */
  private setData(row: any) {
    const {
      id,
      setupDate,
      cooperate,
      payment,
      debts,
      saleType,
      platform,
      lastPayment,
      type,
      companySize,
      registeredCapital,
      overdueTimes,
      countryName,
      overdueAmount,
      storeLink,
      brand,
      trademark,
      cooperationAmount,
      initialAmount,
      creditRating,
      notes,
      subtype,
      mainState
    } = row
    this.selectForm = {
      id,
      setupDate,
      cooperate,
      payment,
      debts,
      saleType,
      platform,
      lastPayment,
      type,
      companySize,
      registeredCapital,
      overdueTimes,
      countryName,
      overdueAmount,
      storeLink,
      brand,
      trademark,
      cooperationAmount,
      initialAmount,
      creditRating,
      notes,
      subtype,
      mainState
    }
  }
  private next() {
    const editForm: any = this.$refs.selectForm
    editForm.validate((valid: any) => {
      if (!valid) return false
      const { id, initialAmount, creditRating, notes } = this.selectForm
      this.isNext = true
      this.getPaytypeList()
      this.getSubTableData()
    })
  }
  private getSubTableData() {
    this.subLoading = true
    const params: any = {
      id: this.selectForm.id
    }
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
  }
  private getPaytypeList() {
    getWordsList({
      type: 'CUST_PAY_METHOD'
    })
      .then((res: any) => {
        const data = res.data || []
        this.typeList = data
      })
      .catch((err: any) => {
        return err
      })
  }
  private back() {
    this.isNext = false
  }
  private confirm() {
    const isVal = this.subTableData.some((it: any) => it.payMethod && it.payDays)
    if (!isVal) {
      this.$message.error('请完整填写付款方式和付款天数')
      return
    }
    this.subLoading = true
    const { id, initialAmount, creditRating, notes } = this.selectForm
    const params: any = {
      id,
      initialAmount,
      creditRating,
      notes,
      list: this.subTableData
    }
    saveAudit(params)
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
  }
  private cancel() {
    this.$emit('cancel')
  }
  private reset() {
    this.selectForm = {
      initialAmount: undefined,
      creditRating: undefined,
      notes: undefined,
      id: undefined
    }
    this.isNext = false
    this.subTableData = []
    const form: any = this.$refs.selectForm
    this.$nextTick(() => {
      form.clearValidate()
    })
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  width: 49.5%;
  display: inline-block;
  vertical-align: top;
  margin-bottom: 5px;
}

.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
</style>
