import Vue from 'vue'
import Vuex, { Plugin } from 'vuex'
import VuexPersistence from 'vuex-persist'
import { IAppState } from './modules/app'
import { IErrorLogState } from './modules/error-log'
import { IPermissionState } from './modules/permission'
import { ISettingsState } from './modules/settings'
import { ITagsViewState } from './modules/tags-view'
import { IUserState } from './modules/user'
import { TagsView } from '@/layout/components'

Vue.use(Vuex)

export interface RootState {
  app: IAppState
  user: IUserState
  tagsView: ITagsViewState
  errorLog: IErrorLogState
  permission: IPermissionState
  settings: ISettingsState
}

const vuexLocal = new VuexPersistence<RootState>({
  storage: window.localStorage,
  reducer: state => ({
    user: state.user
  })
})

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<RootState>({
  modules: {},
  plugins: [vuexLocal.plugin]
})
