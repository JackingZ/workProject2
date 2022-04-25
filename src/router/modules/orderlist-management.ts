import Layout from '@/layout/index.vue'
import { RouteConfig } from 'vue-router'

const orderlistManagementRouter: RouteConfig = {
  path: '/orderlist',
  component: Layout,
  redirect: 'noredirect',
  name: 'orderlistNavigate',
  meta: {
    title: 'Orderlist',
    icon: 'tree-table',
    alwaysShow: true,
    roles: ['orderList']
  },
  children: [
    {
      path: 'warehouse-order', // 仓库订单
      component: () =>
        import(
          /* webpackChunkName: "warehouse-order" */ '@/views/orderlist-management/warehouse-order/index.vue'
        ),
      name: 'WarehouseOrder',
      meta: {
        title: 'WarehouseOrder',
        noCache: true,
        roles: ['warehouseOrder']
      }
    },
    {
      path: 'whole-order', // 全程订单
      component: () =>
        import(
          /* webpackChunkName: "whole-order" */ '@/views/orderlist-management/whole-order/index.vue'
        ),
      name: 'WholeOrder',
      meta: {
        title: 'WholeOrder',
        noCache: true,
        roles: ['allOrder']
      }
    },
    {
      path: 'order-sign', // 订单签收
      component: () =>
        import(
          /* webpackChunkName: "whole-order" */ '@/views/orderlist-management/order-sign/index.vue'
        ),
      name: 'OrderSign',
      meta: {
        title: 'OrderSign',
        noCache: true,
        roles: ['orderSign']
      }
    },
    {
      path: 'order-tracking', // 订单状态追踪
      component: () =>
        import(
          /* webpackChunkName: "dashboard" */ '@/views/order-tracking/index.vue'
        ),
      name: 'orderTracking',
      meta: {
        title: 'orderTracking',
        icon: 'orderTracking',
        hidden: true
      }
    },
    {
      path: 'salesman-order', // 代客下单
      component: () =>
        import(
          /* webpackChunkName: "whole-order" */ '@/views/orderlist-management/salesman-order/index.vue'
        ),
      name: 'salesmanOrder',
      meta: {
        title: 'salesmanOrder',
        noCache: true,
        roles: ['salesmanOrder']
      }
    },
    {
      path: 'customs-order', // 报关订单
      component: () =>
        import(
          /* webpackChunkName: "customs-order" */ '@/views/orderlist-management/customs-order/index.vue'
        ),
      name: 'CustomsOrder',
      meta: {
        title: 'CustomsOrder',
        noCache: true,
        roles: ['customsOrder']
      }
    },
    {
      path: 'car-order', // 卡派订单
      component: () =>
        import(
          /* webpackChunkName: "car-order" */ '@/views/orderlist-management/car-order/index.vue'
        ),
      name: 'CarOrder',
      meta: {
        title: 'CarOrder',
        noCache: true,
        roles: ['kapieOrder']
      }
    },
    {
      path: 'allocationCat', // 调度任务单
      component: () =>
        import(
          /* webpackChunkName: "car-order" */ '@/views/orderlist-management/car-order/allocationCat.vue'
        ),
      name: 'allocationCat',
      meta: {
        title: 'allocationCat',
        // hidden: true,
        noCache: true,
        roles: ['taskOrder']
      }
    },
    {
      path: 'express-order', // 快递订单
      component: () =>
        import(
          /* webpackChunkName: "express-order" */ '@/views/orderlist-management/express-order/index.vue'
        ),
      name: 'ExpressOrder',
      meta: {
        title: 'ExpressOrder',
        noCache: true,
        roles: ['deliveryOrder']
      }
    },
    {
      path: 'booking-order', // 订舱订单
      component: () =>
        import(
          /* webpackChunkName: "booking-order" */ '@/views/orderlist-management/booking-order/index.vue'
        ),
      name: 'BookingOrder',
      meta: {
        title: 'BookingOrder',
        noCache: true,
        roles: ['bookingOrder']
      }
    },
    {
      path: 'trailer-order', // 拖车订单
      component: () =>
        import(
          /* webpackChunkName: "trailer-order" */ '@/views/orderlist-management/trailer-order/index.vue'
        ),
      name: 'TrailerOrder',
      meta: {
        title: 'TrailerOrder',
        noCache: true,
        roles: ['trailerOrder']
      }
    }
    // {
    //   path: 'commodity-audit', // 全程商品审核
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "trailer-order" */ '@/views/orderlist-management/commodity-audit/index.vue'
    //     ),
    //   name: 'commodityAudit',
    //   meta: {
    //     title: 'commodityAudit',
    //     noCache: true,
    //     hidden: true
    //   }
    // }
  ]
}

export default orderlistManagementRouter
