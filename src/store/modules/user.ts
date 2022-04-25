import { login, getUserInfo, logout } from '@/api/users'
import router, { resetRouter } from '@/router'
import store from '@/store'
import { getToken, removeToken, setToken, setJTI } from '@/utils/cookies'
import { Vls } from '@/utils/localstorage.ts'
import MD5 from 'md5.js'
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule
} from 'vuex-module-decorators'
import { PermissionModule } from './permission'
import { TagsViewModule } from './tags-view'

export interface IUserState {
  token: string
  name: string
  avatar: string
  introduction: string
  roles: string[]
  email: string
  dict: any
  info: any
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public name = ''
  public avatar = ''
  public introduction = ''
  public roles: string[] = []
  public email = ''
  public dict = null
  public info = {}

  // @Action
  // public async GetDict() {
  //   try {
  //     const json = await getDict()
  //     this.SET_DICT(json)
  //   } catch (error) {
  //     return Promise.reject(error)
  //   }
  // }

  @Action
  public async Login(userInfo: { username: string; password: string }) {
    let { username } = userInfo
    const { password } = userInfo
    // const pwd = new MD5().update(password).digest('hex')
    username = username.trim()
    try {
      const {
        data: { accessToken, jti }
      } = await login({
        username,
        password,
        client_id: 'jht',
        client_secret: 'jht',
        grant_type: 'password',
        scope: 'resource'
      })
      setToken(accessToken)
      setJTI(jti)
      this.SET_TOKEN(accessToken)
      // const roles: any[] =
      //   user.roles && Array.isArray(user.roles) && user.roles.length
      //     ? user.roles
      //     : [{}]
      // const premitsList: any[] = roles
      //   .map((item: any) => item.permits)
      //   .reduce((pre: any, cur: any) => {
      //     const p = pre && Array.isArray(pre) ? pre : []
      //     const c = cur && Array.isArray(cur) ? cur : []
      //     return p.concat(c)
      //   })
      // const rolesList = [...new Set(premitsList)].length
      //   ? [...new Set(premitsList)]
      //   : [{}]
      // // const rolesList = roles.map((item: any) => item.id)
      // this.SET_ROLES(rolesList)
      // this.SET_INFO(user)
      // PermissionModule.GenerateRoutes(rolesList)
      // // console.log('PermissionModule.dynamicRoutes', PermissionModule.dynamicRoutes)
      // router.addRoutes(PermissionModule.dynamicRoutes)

      // this.SET_NAME(user.name)
      // this.SET_AVATAR(
      //   'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80'
      // )
    } catch (error) {
      return Promise.reject(error)
    }
  }

  @Action
  public ResetToken() {
    removeToken()
    resetRouter()
    this.SET_TOKEN('')
    this.SET_ROLES([])
    this.SET_DICT(null)
    Vls.removeItem('vuex')
  }

  @Action
  public ResetInfo() {
    this.SET_INFO({})
  }

  @Action
  public async GetUserInfo() {
    const ls: string = localStorage.getItem('vuex') || '{}'
    const json = JSON.parse(ls)
    const userInfo = json.user || {}
    const { roles: rls, info } = userInfo
    // 优先读取缓存，如果没有调用接口获取
    if (rls.length && info.custId) {
      this.SET_ROLES(rls)
      this.SET_INFO(info)
      // this.SET_NAME(info.name)
      this.SET_AVATAR(
        'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80'
      )
      PermissionModule.GenerateRoutes(rls)
      router.addRoutes(PermissionModule.dynamicRoutes)
    } else {
      try {
        const { data: user } = await getUserInfo()
        const roles: any[] =
          user.roles && Array.isArray(user.roles) && user.roles.length
            ? user.roles
            : [{}]
        const premitsList: any[] = roles
          .map((item: any) => item.permits)
          .reduce((pre: any, cur: any) => {
            const p = pre && Array.isArray(pre) ? pre : []
            const c = cur && Array.isArray(cur) ? cur : []
            return p.concat(c)
          })
        const rolesList = [...new Set(premitsList)].length
          ? [...new Set(premitsList)]
          : [{}]
        this.SET_ROLES(rolesList)
        this.SET_INFO(user)
        PermissionModule.GenerateRoutes(rolesList)
        router.addRoutes(PermissionModule.dynamicRoutes)

        // this.SET_NAME(user.name)
        this.SET_AVATAR(
          'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80'
        )
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }

  @Action
  public async ChangeRoles(role: string) {
    // Dynamically modify permissions
    const token = role + '-token'
    this.SET_TOKEN(token)
    setToken(token)
    await this.GetUserInfo()
    resetRouter()
    // Generate dynamic accessible routes based on roles
    PermissionModule.GenerateRoutes(this.roles)
    // Add generated routes
    router.addRoutes(PermissionModule.dynamicRoutes)
    // Reset visited views and cached views
    TagsViewModule.delAllViews()
  }

  @Action
  public LogOut() {
    return new Promise((resolve: any, reject: any) => {
      if (!this.token) {
        removeToken()
        resetRouter()
        this.SET_TOKEN('')
        this.SET_ROLES([])
        this.SET_DICT(null)
        this.SET_INFO({})
        Vls.removeItem('vuex')
        reject(new Error('error'))
      }
      logout().then(() => {
        removeToken()
        resetRouter()
        this.SET_TOKEN('')
        this.SET_ROLES([])
        this.SET_DICT(null)
        this.SET_INFO({})
        Vls.removeItem('vuex')
        resolve()
      }).catch(() => {
        removeToken()
        resetRouter()
        this.SET_TOKEN('')
        this.SET_ROLES([])
        this.SET_DICT(null)
        this.SET_INFO({})
        Vls.removeItem('vuex')
        reject(new Error('error'))
      })
    })
  }

  @Mutation
  private SET_DICT(dict: any) {
    this.dict = dict
  }

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @Mutation
  private SET_INFO(info: any) {
    this.info = info
  }

  @Mutation
  private SET_INTRODUCTION(introduction: string) {
    this.introduction = introduction
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Mutation
  private SET_EMAIL(email: string) {
    this.email = email
  }
}

export const UserModule = getModule(User)
