import Layout from '@/layout/index.vue'
import { RouteConfig } from 'vue-router'

const businessConfigurationRouter: RouteConfig = {
  path: '/business',
  component: Layout,
  redirect: 'noredirect',
  name: 'BusinessNavigate',
  meta: {
    title: 'BusinessConfiguration',
    icon: 'tree-table',
    alwaysShow: true,
    roles: ['businessConfig']
  },
  children: [
    {
      path: 'express-port', // 快递接口
      component: () =>
        import(
          /* webpackChunkName: "express-port" */ '@/views/business-configuration/express-port/index.vue'
        ),
      name: 'ExpressPort',
      meta: {
        title: 'ExpressPort',
        noCache: true,
        roles: ['kdService']
      }
    }
  ]
}

export default businessConfigurationRouter
