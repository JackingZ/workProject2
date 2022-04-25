import Layout from '@/layout/index.vue'
import { RouteConfig } from 'vue-router'

const systemManagementRouter: RouteConfig = {
  path: '/system',
  component: Layout,
  redirect: 'noredirect',
  name: 'SystemNavigate',
  meta: {
    title: 'SystemManagement',
    icon: 'tree-table',
    alwaysShow: true,
    roles: ['systemAdmin']
  },
  children: [
    {
      path: 'calc-weight', // 收费重量计算
      component: () =>
        import(
          /* webpackChunkName: "calc-weight" */ '@/views/system-management/calc-weight/index.vue'
        ),
      name: 'CalcWeight',
      meta: {
        title: 'CalcWeight',
        noCache: true,
        roles: ['weightCharge']
      }
    },
    {
      path: 'air-them-roughly', // 航空号段
      component: () =>
        import(
          /* webpackChunkName: "chauffeur-management" */ '@/views/system-management/air-them-roughly/index.vue'
        ),
      name: 'AirThemRoughly',
      meta: {
        title: 'AirThemRoughly',
        noCache: true,
        roles: ['airlineNumber']
      }
    },
    {
      path: 'chauffeur-management', // 司机管理 0
      component: () =>
        import(
          /* webpackChunkName: "chauffeur-management" */ '@/views/system-management/chauffeur-management/index.vue'
        ),
      name: 'ChauffeurManagement',
      meta: {
        title: 'ChauffeurManagement',
        noCache: true,
        roles: ['driver']
      }
    },
    {
      path: 'car-management', // 车辆
      component: () =>
        import(
          /* webpackChunkName: "car-management" */ '@/views/system-management/car-management/index.vue'
        ),
      name: 'CarManagement',
      meta: {
        title: 'CarManagement',
        noCache: true,
        roles: ['vehicle']
      }
    },
    {
      path: 'commodity-audit', // 商品审核
      component: () =>
        import(
          /* webpackChunkName: "commodity-audit" */ '@/views/system-management/commodity-audit/index.vue'
        ),
      name: 'CommodityAudit',
      meta: {
        title: 'CommodityAudit',
        noCache: true,
        roles: ['goodsCheck']
      }
    },

    {
      path: 'product-library', // 产品库
      component: () =>
        import(
          /* webpackChunkName: "product-library" */ '@/views/system-management/product-library/index.vue'
        ),
      name: 'ProductLibrary',
      meta: {
        title: 'ProductLibrary',
        noCache: true,
        roles: ['goods']
      }
    },
    {
      path: 'job-commission', // 岗位提成
      component: () =>
        import(
          /* webpackChunkName: "job-commission" */ '@/views/system-management/job-commission/index.vue'
        ),
      name: 'JobCommission',
      meta: {
        title: 'JobCommission',
        noCache: true,
        roles: ['commission']
      }
    },
    {
      path: 'pc-config', // 着陆页配置 0
      component: () =>
        import(
          /* webpackChunkName: "pc-config" */ '@/views/system-management/pc-config/index.vue'
        ),
      name: 'PcConfig',
      meta: {
        title: 'PcConfig',
        noCache: true,
        roles: ['indexConfig']
      }
    },
    {
      path: 'pda-config', // pda配置
      component: () =>
        import(
          /* webpackChunkName: "pda-config" */ '@/views/system-management/pda-config/index.vue'
        ),
      name: 'pdaConfig',
      meta: {
        title: 'pdaConfig',
        noCache: true,
        roles: ['versionManagement']
      }
    },
    {
      path: 'delivery-plan', // 发货计划 0
      component: () =>
        import(
          /* webpackChunkName: "delivery-plan" */ '@/views/system-management/delivery-plan/index.vue'
        ),
      name: 'deliveryPlan',
      meta: {
        title: 'deliveryPlan',
        noCache: true,
        isJHT: true,
        roles: ['deliveryPlan']
      }
    },
    {
      path: 'subscribe-plan', // 计划订阅
      component: () =>
        import(
          /* webpackChunkName: "subscribe-plan" */ '@/views/system-management/subscribe-plan/index.vue'
        ),
      name: 'subscribePlan',
      meta: {
        title: 'subscribePlan',
        noCache: true,
        roles: ['subscribe']
      }
    },
    {
      path: 'notice-config', // 通知配置
      component: () =>
        import(
          /* webpackChunkName: "notice-config" */ '@/views/system-management/notice-config/index.vue'
        ),
      name: 'NoticeConfig',
      meta: {
        title: 'NoticeConfig',
        noCache: true,
        roles: ['NotificationConfig']
      }
    },
    {
      path: 'notice-center', // 通知中心
      component: () =>
        import(
          /* webpackChunkName: "notice-center" */ '@/views/system-management/notice-center/index.vue'
        ),
      name: 'NoticeCenter',
      meta: {
        title: 'NoticeCenter',
        noCache: true,
        roles: ['noticeCenter']
      }
    },
    {
      path: 'notice-manage', // 通知管理
      component: () =>
        import(
          /* webpackChunkName: "notice-manage" */ '@/views/system-management/notice-manage/index.vue'
        ),
      name: 'NoticeManage',
      meta: {
        title: 'NoticeManage',
        noCache: true,
        roles: ['noticeManage']
      }
    },
    {
      path: 'customer-level', // 客户评级
      component: () =>
        import(
          /* webpackChunkName: "customer-level" */ '@/views/system-management/customer-level/index.vue'
        ),
      name: 'CustomerLevel',
      meta: {
        title: 'CustomerLevel',
        noCache: true,
        roles: ['customerLevel']
      }
    },
    {
      path: 'jht-setion', // 设置
      component: () =>
        import(
          /* webpackChunkName: "jht-setion" */ '@/views/system-management/jht-set/index.vue'
        ),
      name: 'JhtSetion',
      meta: {
        title: 'JhtSetion',
        noCache: true,
        isJHT: true,
        roles: ['jhtSetion']
      }
    },
    {
      path: 'feedback', // 反馈
      component: () =>
        import(
          /* webpackChunkName: "feedback" */ '@/views/system-management/feedback/index.vue'
        ),
      name: 'Feedback',
      meta: {
        title: 'feedback',
        noCache: true,
        isJHT: true
      }
    },
    {
      path: 'statusConfig', // 状态设置
      component: () =>
        import(
          /* webpackChunkName: "status-config" */ '@/views/system-management/status-config/index.vue'
        ),
      name: 'StatusConfig',
      meta: {
        title: 'StatusConfig',
        noCache: true,
        isJHT: true
      }
    }
  ]
}

export default systemManagementRouter
