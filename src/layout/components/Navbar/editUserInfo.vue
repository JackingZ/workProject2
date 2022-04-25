<template>
  <div
    v-loading="loading"
  >
    <el-form
      ref="theForm"
      label-position="right"
      :rules="formRules"
      label-width="90px"
      size="small"
      :model="form"
      style="padding-right: 10px;"
    >
      <el-form-item
        label="原密码"
        prop="oldPassword"
      >
        <el-input
          v-model="form.oldPassword"
          clearable
          type="password"
          placeholder="请输入"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="新密码"
        prop="newPassword"
      >
        <el-input
          v-model="form.newPassword"
          clearable
          type="password"
          placeholder="请输入"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="affirmPassword"
      >
        <el-input
          v-model="form.affirmPassword"
          type="password"
          clearable
          placeholder="请输入"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <div style="text-align: right; padding-top: 10px;">
      <el-button @click="cancel">
        取 消
      </el-button>
      <el-button
        type="primary"
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
import { changePassword } from '@/api/users'

@Component({
  name: '',
  components: {},
  props: {}
})
export default class extends Vue {
  /** ------- data ------- */
  private loading: boolean = false
  private form: any = {
    newPassword: undefined,
    oldPassword: undefined,
    affirmPassword: undefined
  }

  private formRules = {
    oldPassword: [
      { required: true, message: '密码不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (!value) {
            callback(new Error('密码不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('密码不能有中文'))
          } else if (String(value).length <= 6) {
            callback(new Error('密码至少六位数'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    newPassword: [
      { required: true, message: '密码不能为空', trigger: 'blur' },
      {
        validator: (rule: any, value: any, callback: (val?: any) => void) => {
          const reg = /[\u4e00-\u9fa5]/
          const root: any = (this as any).$refs.theForm
          if (!value) {
            callback(new Error('密码不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('密码不能有中文'))
          } else if (String(value).length <= 6) {
            callback(new Error('密码至少六位数'))
          } else {
            root.validateField('affirmPassword')
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    affirmPassword: [
      { required: true, message: '密码不能为空', trigger: 'blur' },
      {
        validator: (rule: any, value: any, callback: (val?: any) => void) => {
          const reg = /[\u4e00-\u9fa5]/
          const newVal = (this as any).form.newPassword
          if (!value) {
            callback(new Error('密码不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('密码不能有中文'))
          } else if (value !== newVal) {
            callback(new Error('密码不一致'))
          } else if (String(value).length <= 6) {
            callback(new Error('密码至少六位数'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }

  /** ------- computed ------- */
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

  /** ------- methods ------- */
  private confirm() {
    const root:any = this.$refs.theForm
    root.validate((valid: any) => {
      if (!valid) return false
      this.loading = true
      const { newPassword, oldPassword } = this.form
      const params = {
        newPassword,
        oldPassword
      }
      changePassword(params)
        .then(res => {
          this.$message.success('密码修改成功')
          this.$emit('close')
          this.$emit('logout')
          this.loading = false
        })
        .catch(err => {
          this.loading = false
          return err
        })
    })
  }
  private cancel() {
    this.$emit('close')
  }
  // 重置表单
  private reset(): void {
    this.form = {
      newPassword: undefined,
      oldPassword: undefined,
      affirmPassword: undefined
    }
    const theForm: any = this.$refs.theForm
    this.$nextTick(() => {
      theForm.clearValidate()
    })
  }
}
</script>

<style lang="scss" scoped></style>
