<template>
  <div class="update-password">
    <el-form
      ref="passwordForm"
      :model="passwordForm"
      :rules="formRules"
      class="password-form"
      label-position="right"
      label-width="90px"
    >
      <img
        src="@/assets/imgs/password.png"
        alt=""
        class="pwd-img"
      >
      <div v-show="!updateShow">
        <div class="pwd-title">
          修改密码
        </div>
        <div class="pwd-text">
          您的新密码必须与以前使用的密码不同
        </div>
        <div style="padding-right: 20px;">
          <el-form-item
            label="原密码"
            prop="oldPassword"
          >
            <el-input
              :key="passwordType1"
              ref="password"
              v-model="passwordForm.oldPassword"
              :type="passwordType1"
              placeholder="请输入"
              name="password"
            />
            <span
              class="show-pwd"
              @click="showPwd1"
            >
              <svg-icon :name="passwordType1 === 'password' ? 'eye-off' : 'eye-on'" />
            </span>
          </el-form-item>

          <el-form-item
            label="新密码"
            prop="newPassword"
          >
            <el-input
              :key="passwordType2"
              ref="password"
              v-model="passwordForm.newPassword"
              :type="passwordType2"
              placeholder="请输入"
              name="password"
            />
            <span
              class="show-pwd"
              @click="showPwd2"
            >
              <svg-icon :name="passwordType2 === 'password' ? 'eye-off' : 'eye-on'" />
            </span>
          </el-form-item>

          <el-form-item
            label="确认密码"
            prop="affirmPassword"
          >
            <el-input
              :key="passwordType3"
              ref="password"
              v-model="passwordForm.affirmPassword"
              :type="passwordType3"
              placeholder="请输入"
              name="password"
            />
            <span
              class="show-pwd"
              @click="showPwd3"
            >
              <svg-icon :name="passwordType3 === 'password' ? 'eye-off' : 'eye-on'" />
            </span>
          </el-form-item>
        </div>
        <div style="padding: 10px 55px 30px;">
          <el-button
            :loading="loading"
            type="primary"
            style="width:100%;"
            @click.native.prevent="updateConfirm"
          >
            确定修改
          </el-button>
        </div>
      </div>
      <div v-show="updateShow">
        <div class="pwd-success">
          密码修改成功
        </div>
        <div style="padding: 60px 55px 30px;">
          <el-button
            :loading="loading"
            type="primary"
            style="width:100%;"
            @click.native.prevent="goBack"
          >
            返回首页({{ selfNum }}s)
          </el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Dictionary } from 'vuex'
import { Form as ElForm, Input } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { changePassword } from '@/api/users'

@Component({
  name: 'Update',
  components: {}
})
export default class extends Vue {
  private passwordForm: any = {
    oldPassword: undefined,
    newPassword: undefined,
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
          } else if (String(value).length < 6 || String(value).length > 20) {
            callback(new Error('密码长度为6-20位'))
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
          const root: any = (this as any).$refs.passwordForm
          if (!value) {
            callback(new Error('密码不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('密码不能有中文'))
          } else if (String(value).length < 6 || String(value).length > 20) {
            callback(new Error('密码长度为6-20位'))
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
          const newVal = (this as any).passwordForm.newPassword
          if (!value) {
            callback(new Error('密码不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('密码不能有中文'))
          } else if (value !== newVal) {
            callback(new Error('密码不一致'))
          } else if (String(value).length < 6 || String(value).length > 20) {
            callback(new Error('密码长度为6-20位'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }
  private passwordType1 = 'password'
  private passwordType2 = 'password'
  private passwordType3 = 'password'
  private loading = false
  private redirect?: string
  private otherQuery: Dictionary<string> = {}
  private updateShow: boolean = false
  private selfNum: number = 5
  private timer: any = ''

  get username(): string {
    const info = UserModule.info || {}
    const username = (info as any).username
    return username
  }

  private showPwd1() {
    if (this.passwordType1 === 'password') {
      this.passwordType1 = ''
    } else {
      this.passwordType1 = 'password'
    }
    this.$nextTick(() => {
      (this.$refs.password as Input).focus()
    })
  }
  private showPwd2() {
    if (this.passwordType2 === 'password') {
      this.passwordType2 = ''
    } else {
      this.passwordType2 = 'password'
    }
    this.$nextTick(() => {
      (this.$refs.password as Input).focus()
    })
  }
  private showPwd3() {
    if (this.passwordType3 === 'password') {
      this.passwordType3 = ''
    } else {
      this.passwordType3 = 'password'
    }
    this.$nextTick(() => {
      (this.$refs.password as Input).focus()
    })
  }

  private updateConfirm() {
    (this.$refs.passwordForm as ElForm).validate(async(valid: boolean) => {
      if (!valid) return false
      this.loading = true
      const { newPassword, oldPassword } = this.passwordForm
      const params: any = {
        newPassword,
        oldPassword
      }
      changePassword(params)
        .then(async(res) => {
          this.$message.success('密码修改成功')
          this.loading = false
          this.updateShow = true
          this.timer = setInterval(() => {
            if (this.selfNum > 0) {
              --this.selfNum
            } else {
              this.goBack()
            }
          }, 1000)
        })
        .catch(err => {
          this.loading = false
          return err
        })
    })
  }
  private async goBack() {
    clearInterval(this.timer)
    try {
      const params: any = {
        username: (this as any).username,
        password: this.passwordForm.newPassword
      }
      await UserModule.Login(params)
      await UserModule.ResetInfo()
      await UserModule.GetUserInfo()
      this.$router.push({
        path: '/'
      })
      this.updateShow = false
    } catch (e) {
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.update-password {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #fff;

  .password-form {
    position: relative;
    width: 383px;
    max-width: 100%;
    padding: 112px 15px 0;
    margin: 238px auto 0;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
  .el-input {
    display: inline-block;
    ::v-deep .el-input__inner {
      padding: 0 30px 0 15px;
    }
  }
  .pwd-text {
    font-size: 14px;
    color: #909399;
    padding: 4px 0 22px 0;
    text-align: center;
  }
  .pwd-title {
    font-size: 18px;
    color: #303133;
    font-weight: 600;
    text-align: center;
  }
  .pwd-success {
    padding-top: 44px;
    font-size: 24px;
    color: #303133;
    font-weight: 600;
    text-align: center;
  }
  .pwd-img {
    position: absolute;
    top: -80px;
    left: 81px;
    display: block;
    width: 221px;
    height: 169px;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 1px;
    font-size: 16px;
    color: $darkGray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
