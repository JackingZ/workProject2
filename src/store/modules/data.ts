import store from '@/store'
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule
} from 'vuex-module-decorators'

export interface DatasState {
  orders: any[],
  expressId: string
}

@Module({ dynamic: true, store, name: 'datas' })
class Datas extends VuexModule implements DatasState {
  public orders: any[] = []
  public expressId: string = ''

  @Action
  public async Login(userInfo: { username: string; password: string }) {
    let { username } = userInfo
    const { password } = userInfo
    // const pwd = new MD5().update(password).digest('hex')
    username = username.trim()
  }
  @Action
  public ChangeExpressId(payload: string) {
    this.SET_EXPRESID(payload)
  }

  @Mutation
  private SET_ORDERS(data: any) {
    this.orders = data
  }
  @Mutation
  private SET_EXPRESID(data: any) {
    this.expressId = data
  }
}

export const DataModule = getModule(Datas)
