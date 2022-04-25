import Layout from '@/layout/index.vue'
import { RouteConfig } from 'vue-router'

const operatingCostRouter: RouteConfig = {
  path: '/operating-cost',
  component: Layout,
  redirect: 'noredirect',
  name: 'operatingCostNavigate',
  meta: {
    title: 'OperatingCost',
    icon: 'tree-table',
    alwaysShow: true,
    roles: ['businessCost']
  },
  children: [
    {
      path: 'projects', // 成本项目
      component: () =>
        import(
          /* webpackChunkName: "operating-cost-projects" */ '@/views/operating-cost/projects/index.vue'
        ),
      name: 'ProjectsCost',
      meta: {
        title: 'ProjectsCost',
        noCache: true,
        roles: ['costItem']
      }
    },
    {
      path: 'project-groups', // 成本项目组
      component: () =>
        import(
          /* webpackChunkName: "operating-cost-project-groups" */ '@/views/operating-cost/project-groups/index.vue'
        ),
      name: 'ProjectGroupsCost',
      meta: {
        title: 'ProjectGroupsCost',
        noCache: true,
        roles: ['costItemGroup']
      }
    }
    // {
    //   path: 'service-surcharge', // 服务附加费
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "service-surcharge" */ '@/views/operating-cost/service-surcharge/index.vue'
    //     ),
    //   name: 'ServiceSurcharge',
    //   meta: {
    //     title: 'ServiceSurcharge',
    //     noCache: true,
    //     roles: ['e']
    //   }
    // }
  ]
}

export default operatingCostRouter
