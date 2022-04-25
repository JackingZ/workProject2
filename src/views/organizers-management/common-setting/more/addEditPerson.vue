<template>
  <div>
    <el-dialog
      :title="isEdit ? '编辑人员' : '新增人员'"
      :visible.sync="isPersonFormShow"
      :close-on-click-modal="false"
      width="850px"
      @close="cancel"
    >
      <div
        v-loading="isPersonFormLoading"
        class="add-edit-organ"
      >
        <el-form
          ref="editForm"
          :model="personForm"
          :rules="formRules"
          label-width="110px"
          label-position="right"
        >
          <el-row>
            <el-col
              :span="12"
            >
              <el-form-item
                label="联系人姓名"
                prop="name"
              >
                <el-input
                  v-model="personForm.name"
                  size="small"
                  placeholder="请输入"
                  :maxlength="20"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="英文名称"
                prop="alias"
              >
                <el-input
                  v-model="personForm.alias"
                  size="small"
                  placeholder="请输入"
                  :maxlength="20"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="所属部门"
                prop="dept"
              >
                <el-input
                  v-model="personForm.dept"
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
                label="职位名称"
                prop="duty"
              >
                <el-input
                  v-model="personForm.duty"
                  size="small"
                  placeholder="请输入"
                  :maxlength="50"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="国家/地区"
                prop="countryId"
              >
                <el-select
                  v-model="personForm.countryId"
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
            <el-col :span="12">
              <el-form-item
                label="联系电话"
                prop="tel"
              >
                <el-input
                  v-model="personForm.tel"
                  size="small"
                  placeholder="请输入"
                  :maxlength="20"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="手机号码"
                prop="phone"
              >
                <el-input
                  v-model="personForm.phone"
                  size="small"
                  placeholder="请输入"
                  :maxlength="20"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="电子邮箱"
                prop="email"
              >
                <el-input
                  v-model="personForm.email"
                  size="small"
                  placeholder="请输入"
                  :maxlength="30"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="传真号码"
                prop="fax"
              >
                <el-input
                  v-model="personForm.fax"
                  size="small"
                  placeholder="请输入"
                  :maxlength="20"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="其他联系方式"
                prop="sns"
              >
                <el-input
                  v-model="personForm.sns"
                  size="small"
                  placeholder="请输入"
                  :maxlength="50"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="联系地址"
                prop="address"
              >
                <el-input
                  v-model="personForm.address"
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
                label="备注"
              >
                <el-input
                  v-model="personForm.remark"
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
          @click="savePersonConfirm"
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
    currentCustId: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isPersonFormShow: {
      type: Boolean,
      default: false
    },
    isPersonFormLoading: {
      type: Boolean,
      default: false
    },
    personForm: {
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
    }
  }
})
export default class extends Vue {
  private formRules = {
    name: [
      { required: true, message: '联系人姓名不能为空', trigger: 'blur' }
    ],
    dept: [
      { required: true, message: '所属部门不能为空', trigger: 'blur' }
    ],
    duty: [
      { required: true, message: '职位名称不能为空', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
      { type: 'email', message: '邮箱地址格式不正确', trigger: ['blur', 'change'] }
    ],
    countryId: [{ required: true, message: '请选择国家/地区', trigger: 'change' }],
    alias: [
      { required: false, message: '英文名称不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (value && reg.test(value)) {
            callback(new Error('英文名称不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    certNumber: [
      { required: true, message: '请输入证件号码', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (value && reg.test(value)) {
            callback(new Error('证件号码不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    tel: [
      { required: true, message: '联系电话不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (value && reg.test(value)) {
            callback(new Error('联系电话不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    phone: [
      { required: false, message: '手机号码不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (value && reg.test(value)) {
            callback(new Error('手机号码不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    fax: [
      { required: false, message: '传真号码不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (value && reg.test(value)) {
            callback(new Error('传真号码不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    sns: [
      { required: false, message: '其他联系方式不能为空', trigger: 'blur' }
    ],
    address: [{ required: false, message: '联系地址不能为空', trigger: 'blur' }]
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
  private savePersonConfirm() {
    const editForm:any = this.$refs.editForm
    editForm.validate((valid:any) => {
      if (valid) {
        this.$emit('savePersonConfirm')
      } else {
        return false
      }
    })
  }

  // 关闭
  private cancel() {
    this.$emit('closePersonForm')
  }
}
</script>

<style lang="scss" scoped>

</style>
