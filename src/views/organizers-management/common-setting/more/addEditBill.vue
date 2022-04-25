<template>
  <div>
    <el-dialog
      :title="isEdit ? '编辑开票信息' : '新增开票信息'"
      :visible.sync="isBillFormShow"
      :close-on-click-modal="false"
      width="850px"
      @close="cancel"
    >
      <div
        v-loading="isBillFormLoading"
        class="add-edit-organ"
      >
        <el-form
          ref="editForm"
          :model="billForm"
          :rules="formRules"
          label-width="120px"
          label-position="right"
          size="small"
        >
          <el-row>
            <el-col
              :span="12"
            >
              <el-form-item
                label="开票名称"
                prop="name"
              >
                <el-input
                  v-model="billForm.name"
                  size="small"
                  placeholder="请输入"
                  :maxlength="100"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
            >
              <el-form-item
                label="纳税识别号"
                prop="taxId"
              >
                <el-input
                  v-model="billForm.taxId"
                  size="small"
                  placeholder="请输入"
                  :maxlength="50"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
            >
              <el-form-item
                label="开户银行"
                prop="bank"
              >
                <el-input
                  v-model="billForm.bank"
                  size="small"
                  placeholder="请输入"
                  :maxlength="50"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
            >
              <el-form-item
                label="每月额度"
                prop="amount"
              >
                <el-input-number
                  v-model="billForm.amount"
                  class="input-number-valiate"
                  :controls="false"
                  placeholder="请输入"
                  size="small"
                  :min="0"
                  :max="9999999"
                  :precision="2"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="国家/地区"
                prop="countryId"
              >
                <el-select
                  v-model="billForm.countryId"
                  placeholder="请选择"
                  filterable
                  clearable
                  style="width:100%;"
                  size="small"
                >
                  <el-option
                    v-for="item in countryList"
                    :key="item.id"
                    :label="`${item.name}-${item.alias}`"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
            >
              <el-form-item
                label="币种"
                prop="currencyId"
              >
                <el-select
                  v-model="billForm.currencyId"
                  style="width:100%;"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in currencyList"
                    :key="item.id"
                    :label="`${item.name}-${item.sign}`"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="备注"
                prop="remark"
              >
                <el-input
                  v-model="billForm.remark"
                  size="small"
                  placeholder="请输入"
                  :maxlength="100"
                />
              </el-form-item>
            </el-col>
          </el-row>
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
          @click="saveBillConfirm"
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

@Component({
  name: '',
  components: {},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    isBillFormShow: {
      type: Boolean,
      default: false
    },
    isBillFormLoading: {
      type: Boolean,
      default: false
    },
    billForm: {
      type: Object,
      default: () => {
        return {}
      }
    },
    countryList: {
      type: Array,
      default: () => {
        return []
      }
    },
    currencyList: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
})
export default class extends Vue {
  private formRules = {
    name: [
      { required: true, message: '开票名称不能为空', trigger: 'blur' }
    ],
    taxId: [
      { required: true, message: '纳税识别号不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^[A-Z0-9]+$/
          if (value && !reg.test(value)) {
            callback(new Error('纳税识别号只能有大写英文字母及数字'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    bank: [
      { required: true, message: '开户银行不能为空', trigger: 'blur' }
    ],
    amount: [
      { required: true, message: '每月额度不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
          if (!value) {
            callback()
          }
          if (Number(value) < 0 || isNaN(Number(value))) {
            callback(new Error('额度值必须大于0'))
          } else if (!reg.test(value)) {
            callback(new Error('额度值不能超过两位小数点'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    countryId: [{ required: true, message: '请选择国家/地区', trigger: 'change' }],
    currencyId: [{ required: true, message: '请选择币种', trigger: 'change' }]
  }

  // 所属公司id
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }

  // 所属公司Name
  get custName(): string {
    const info = UserModule.info || {}
    const custName = (info as any).custName
    return custName
  }

  /* methods */

  // 保存人员编辑
  private saveBillConfirm() {
    const editForm:any = this.$refs.editForm
    editForm.validate((valid:any) => {
      if (valid) {
        this.$emit('saveBillConfirm')
      } else {
        return false
      }
    })
  }
  // 关闭
  private cancel() {
    this.$emit('closeBillForm')
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
