import Layout from '@/layout/index.vue'
import { RouteConfig } from 'vue-router'

const businessConfigurationRouter: RouteConfig = {
  path: '/sales',
  component: Layout,
  redirect: 'noredirect',
  name: 'SalesNavigate',
  meta: {
    title: 'SalesManagement',
    icon: 'tree-table',
    alwaysShow: true,
    roles: ['salesmgt']
  },
  children: [
    {
      path: 'plan-distribut', // 销售计划
      component: () =>
        import(
          /* webpackChunkName: "plan-distribut" */ '@/views/sales-management/plan-distribut/index.vue'
        ),
      name: 'PlanDistribut',
      meta: {
        title: 'PlanDistribut',
        noCache: true,
        roles: ['salespdt']
      }
    },
    {
      path: 'sales-billboard', // 销售看板
      component: () =>
        import(
          /* webpackChunkName: "sales-billboard" */ '@/views/sales-management/sales-billboard/index.vue'
        ),
      name: 'SalesBillboard',
      meta: {
        title: 'SalesBillboard',
        noCache: true,
        roles: ['salessbd']
      }
    },
    {
      path: 'service-group', // 服务组
      component: () =>
        import(
          /* webpackChunkName: "service-group" */ '@/views/sales-management/service-group/index.vue'
        ),
      name: 'ServiceGroup',
      meta: {
        title: 'ServiceGroup',
        noCache: true,
        roles: ['salessgp']
      }
    },
    {
      path: 'agent-booking-plan', // 销售计划
      component: () =>
        import(
          /* webpackChunkName: "agent-booking-plan" */ '@/views/sales-management/agent-booking-plan/index.vue'
        ),
      name: 'AgentPlan',
      meta: {
        title: 'AgentPlan',
        noCache: true,
        roles: ['salesabp']
      }
    },
    {
      path: 'commission-config', // 佣金配置
      component: () =>
        import(
          /* webpackChunkName: "commission-config" */ '@/views/sales-management/commission-config/index.vue'
        ),
      name: 'CommissionConfig',
      meta: {
        title: 'CommissionConfig',
        noCache: true,
        roles: ['salesccg']
      }
    },
    {
      path: 'orders-statistics', // 订单统计
      component: () =>
        import(
          /* webpackChunkName: "orders-statistics" */ '@/views/sales-management/orders-statistics/index.vue'
        ),
      name: 'OrdersStatistics',
      meta: {
        title: 'OrdersStatistics',
        noCache: true,
        roles: ['salesosc']
      }
    },
    {
      path: 'manager-order', // 经理人
      component: () =>
        import(
          /* webpackChunkName: "manager-order" */ '@/views/sales-management/manager-order/index.vue'
        ),
      name: 'ManagerOrder',
      meta: {
        title: 'ManagerOrder',
        noCache: true,
        roles: []
      }
    }
  ]
}

export default businessConfigurationRouter
