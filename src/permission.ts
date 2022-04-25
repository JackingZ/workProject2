import i18n from '@/lang' // Internationalization
import { PermissionModule } from '@/store/modules/permission'
import { UserModule } from '@/store/modules/user'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Route } from 'vue-router'
import router from './router'
import settings from './settings'
// import { hasDict } from '@/utils/localstorage.ts'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect']

const getPageTitle = (key: string) => {
  const hasKey = i18n.te(`route.${key}`)
  if (hasKey) {
    const pageName = i18n.t(`route.${key}`)
    return `${pageName} - ${settings.title}`
  }
  return `${settings.title}`
}

const updatePassword = () => {
  const info = UserModule.info || {}
  const ifUpdate = (info as any).ifUpdatePassword
  const ifOnce = (info as any).ifOnce
  return ifUpdate === '1' && ifOnce === '1'
}

router.beforeEach(async(to: Route, _: Route, next: any) => {
  // Start progress bar
  NProgress.start()
  // Determine whether the user has logged in

  if (UserModule.token) {
    if (updatePassword() && to.path !== '/update-password') {
      next({ path: '/update-password' })
      NProgress.done()
    } else if (to.path === '/login') {
      // If is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      if (UserModule.roles.length === 0) {
        await UserModule.GetUserInfo()
        // const roles = UserModule.roles
        // PermissionModule.GenerateRoutes(roles)
        // router.addRoutes(PermissionModule.dynamicRoutes)
        next({ ...to, replace: true })
      } else {
        next()
      }
    }
  } else {
    // Has no token
    if (whiteList.indexOf(to.path) !== -1) {
      // In the free login whitelist, go directly
      next()
    } else {
      // Other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach((to: Route) => {
  // Finish progress bar
  NProgress.done()

  // set page title
  document.title = getPageTitle(to.meta.title)
})
