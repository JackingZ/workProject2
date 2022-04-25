<template>
  <div class="login-container">
    <lang-select
      class="set-language"
      style="color: #fafafa;position: fixed;top: 30px;right: 50px;cursor: pointer;"
    />
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <!-- <div class="title-container">
        <h3 class="title">
          {{ $t('login.title') }}
        </h3>
      </div> -->

      <img
        :src="logo"
        alt=""
        style="display: block;margin: 20px auto;width: 250px;height: 80px;"
      >

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon name="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          :placeholder="$t('login.username')"
          clearable
          name="username"
          type="text"
          autocomplete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon name="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          :placeholder="$t('login.password')"
          name="password"
          autocomplete="on"
          @keyup.enter.native="handleLogin"
        />
        <span
          class="show-pwd"
          @click="showPwd"
        >
          <svg-icon :name="passwordType === 'password' ? 'eye-off' : 'eye-on'" />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%; margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >
        {{ $t('login.logIn') }}
      </el-button>

      <!-- <div style="position:relative">
        <div class="tips">
          <span>{{ $t('login.username') }} : admin </span>
          <span>{{ $t('login.password') }} : {{ $t('login.any') }} </span>
        </div>
        <div class="tips">
          <span>{{ $t('login.username') }} : editor </span>
          <span>{{ $t('login.password') }} : {{ $t('login.any') }} </span>
        </div>

        <el-button
          class="thirdparty-button"
          type="primary"
          @click="showDialog=true"
        >
          {{ $t('login.thirdparty') }}
        </el-button>
      </div> -->
    </el-form>

    <el-dialog
      :title="$t('login.thirdparty')"
      :visible.sync="showDialog"
    >
      {{ $t('login.thirdpartyTips') }}
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>

    <div class="ipc_info">
      深圳市聚货通信息科技有限公司 版权所有 © Copyright {{ currentYear }} <a href="http://beian.miit.gov.cn">粤ICP备19040263号</a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Dictionary } from 'vuex'
import { Form as ElForm, Input } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { isValidUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect/index.vue'
import SocialSign from './components/SocialSignin.vue'
import dayjs from 'dayjs'

@Component({
  name: 'Login',
  components: {
    LangSelect,
    SocialSign
  }
})
export default class extends Vue {
  private validateUsername = (rule: any, value: string, callback: Function) => {
    if (!isValidUsername(value)) {
      callback(new Error('Please enter the correct user name'))
    } else {
      callback()
    }
  }
  private validatePassword = (rule: any, value: string, callback: Function) => {
    if (value.length < 6) {
      callback(new Error('The password can not be less than 6 digits'))
    } else {
      callback()
    }
  }
  private loginForm = {
    username: this.isProd ? '' : 'admin',
    password: this.isProd ? '' : ''
  }
  private loginRules = {
    username: [{ validator: this.validateUsername, trigger: 'blur' }],
    password: [{ validator: this.validatePassword, trigger: 'blur' }]
  }
  private passwordType = 'password'
  private loading = false
  private showDialog = false
  private timer1: any = ''
  private redirect?: string
  private otherQuery: Dictionary<string> = {}

  get currentYear() {
    return dayjs().year()
  }

  get isProd() {
    return process.env.VUE_APP_ENV === 'prod'
  }

  get logo() {
    return `${process.env.BASE_URL}login-form-logo.png`
  }

  get ifUpdatePassword(): string {
    const info = UserModule.info || {}
    const ifUpdatePassword = (info as any).ifUpdatePassword
    return ifUpdatePassword
  }

  get ifOnce(): string {
    const info = UserModule.info || {}
    const ifOnce = (info as any).ifOnce
    return ifOnce
  }

  @Watch('$route', { immediate: true })
  private onRouteChange(route: Route) {
    // TODO: remove the "as Dictionary<string>" hack after v4 release for vue-router
    // See https://github.com/vuejs/vue-router/pull/2050 for details
    const query = route.query as Dictionary<string>
    if (query) {
      this.redirect = query.redirect
      this.otherQuery = this.getOtherQuery(query)
    }
  }

  mounted() {
    if (this.loginForm.username === '') {
      (this.$refs.username as Input).focus()
    } else if (this.loginForm.password === '') {
      (this.$refs.password as Input).focus()
    }
  }

  private showPwd() {
    if (this.passwordType === 'password') {
      this.passwordType = ''
    } else {
      this.passwordType = 'password'
    }
    this.$nextTick(() => {
      (this.$refs.password as Input).focus()
    })
  }

  private handleLogin() {
    (this.$refs.loginForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.loading = true
        try {
          await UserModule.Login(this.loginForm)
          await UserModule.GetUserInfo()
        } catch (e) {
          this.loading = false
        }
        // this.loading = false
        const ifUpdate = (this as any).ifUpdatePassword
        const ifOnce = (this as any).ifOnce
        if (ifUpdate === '1' && ifOnce === '1') {
          this.$router.push({
            path: '/update-password'
          })
        } else {
          this.$router.push({
            path: this.redirect || '/',
            query: this.otherQuery
          })
        }
        // Just to simulate the time of the request
        this.timer1 = setTimeout(() => {
          this.loading = false
        }, 0.5 * 1000)
      } else {
        return false
      }
    })
  }
  private beforeDestroy() {
    clearTimeout(this.timer1)
  }

  private getOtherQuery(query: Dictionary<string>) {
    return Object.keys(query).reduce(
      (acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      },
      {} as Dictionary<string>
    )
  }
}
</script>

<style lang="scss">
// References: https://www.zhangxinxu.com/wordpress/2018/01/css-caret-color-first-line/
@supports (-webkit-mask: none) and (not (cater-color: $loginCursorColor)) {
  .login-container .el-input {
    input {
      color: $loginCursorColor;
    }
    input::first-line {
      color: $lightGray;
    }
  }
}

.login-container {
  .ipc_info {
    width: 100%;
    font-size: 13px;
    text-align: center;
    color: #e1e1e1;
    position: fixed;
    bottom: 20px;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      height: 47px;
      background: transparent;
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $lightGray;
      caret-color: $loginCursorColor;
      -webkit-appearance: none;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $loginBg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: $loginBg;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $darkGray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $lightGray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $darkGray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
