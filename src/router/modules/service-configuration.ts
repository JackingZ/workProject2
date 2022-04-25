import Layout from '@/layout/index.vue'
import { RouteConfig } from 'vue-router'

const serviceConfigurationRouter: RouteConfig = {
  path: '/service',
  component: Layout,
  redirect: 'noredirect',
  name: 'ServiceNavigate',
  meta: {
    title: 'ServiceConfiguration',
    icon: 'tree-table',
    alwaysShow: true,
    roles: ['serviceConfig']
  },
  children: [
    {
      path: 'express-services-configuration', // 快递
      component: () =>
        import(
          /* webpackChunkName: "express-services" */ '@/views/service-configuration/express/index.vue'
        ),
      name: 'ExpressServiceConfiguration',
      meta: {
        title: 'ExpressServiceConfiguration',
        noCache: true,
        roles: ['deliveryService']
      }
    },
    {
      path: 'booking-service', // 订舱
      component: () =>
        import(
          /* webpackChunkName: "booking-service" */ '@/views/service-configuration/booking/index.vue'
        ),
      name: 'BookingService',
      meta: {
        title: 'BookingService',
        noCache: true,
        roles: ['bookingService']
      }
    },
    {
      path: 'truck-services-configuration', // 卡派
      component: () =>
        import(
          /* webpackChunkName: "truck-services" */ '@/views/service-configuration/truck/index.vue'
        ),
      name: 'TruckServiceConfiguration',
      meta: {
        title: 'TruckServiceConfiguration',
        noCache: true,
        roles: ['cardService']
      }
    },
    {
      path: 'trailer-services-configuration', // 拖车
      component: () =>
        import(
          /* webpackChunkName: "trailer-services" */ '@/views/service-configuration/trailer/index.vue'
        ),
      name: 'TrailerServiceConfiguration',
      meta: {
        title: 'TrailerServiceConfiguration',
        noCache: true,
        roles: ['towingService']
      }
    },
    {
      path: 'customs-clearance-services-configuration', // 报关
      component: () =>
        import(
          /* webpackChunkName: "customs-clearance-services" */ '@/views/service-configuration/customs-clearance/index.vue'
        ),
      name: 'CustomsClearanceServiceConfiguration',
      meta: {
        title: 'CustomsClearanceServiceConfiguration',
        noCache: true,
        roles: ['customsClearance']
      }
    },
    {
      path: 'Warehousing-services-configuration', // 仓储
      component: () =>
        import(
          /* webpackChunkName: "Warehousing-services" */ '@/views/service-configuration/warehousing/index.vue'
        ),
      name: 'WarehousingServiceConfiguration',
      meta: {
        title: 'WarehousingServiceConfiguration',
        noCache: true,
        roles: ['warehousingService']
      }
    },
    {
      path: 'privateline-line-services-configuration', // 专线
      component: () =>
        import(
          /* webpackChunkName: "dedicated-line-services" */ '@/views/service-configuration/privateline-line/index.vue'
        ),
      name: 'PrivatelineServiceConfiguration',
      meta: {
        title: 'PrivatelineServiceConfiguration',
        noCache: true,
        roles: ['dedicatedLineService']
      }
    }
  ]
}

export default serviceConfigurationRouter
