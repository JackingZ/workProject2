import Layout from '@/layout/index.vue'
import { RouteConfig } from 'vue-router'

const priceManagementRouter: RouteConfig = {
  path: '/price',
  component: Layout,
  redirect: 'noredirect',
  name: 'priceConfiguration',
  meta: {
    title: 'priceConfiguration',
    icon: 'tree-table',
    alwaysShow: true,
    roles: ['quote']
  },
  children: [
    {
      path: 'goods-surcharge',
      component: () =>
        import(
          /* webpackChunkName: "goods-surcharge" */ '@/views/price-management/goods-surcharge/index.vue'
        ),
      name: 'GoodsSurcharge',
      meta: {
        title: 'GoodsSurcharge',
        noCache: true,
        roles: ['commoditySurcharge']
      }
    },
    {
      path: 'charge-config',
      component: () =>
        import(
          /* webpackChunkName: "charge-config" */ '@/views/price-management/charge-config/index.vue'
        ),
      name: 'ChargeConfig',
      meta: {
        title: 'ChargeConfig',
        noCache: true,
        roles: ['billingConfig']
      }
    },
    {
      path: 'private-line-price',
      component: () =>
        import(
          /* webpackChunkName: "private-line-price" */ '@/views/price-management/private-line/index.vue'
        ),
      name: 'PrivateLinePrice',
      meta: {
        title: 'PrivateLinePrice',
        noCache: true,
        roles: ['lineQuote']
      }
    },
    {
      path: 'express-price',
      component: () =>
        import(
          /* webpackChunkName: "express-price" */ '@/views/price-management/express/index.vue'
        ),
      name: 'ExpressPrice',
      meta: {
        title: 'ExpressPrice',
        noCache: true,
        roles: ['expressPrice']
      }
    },
    {
      path: 'booking-price',
      component: () =>
        import(
          /* webpackChunkName: "booking-price" */ '@/views/price-management/booking/index.vue'
        ),
      name: 'BookingPrice',
      meta: {
        title: 'BookingPrice',
        noCache: true,
        roles: ['bookingQuote']
      }
    },
    {
      path: 'warehouse-price',
      component: () =>
        import(
          /* webpackChunkName: "warehouse-price" */ '@/views/price-management/warehouse/index.vue'
        ),
      name: 'WarehousePrice',
      meta: {
        title: 'WarehousePrice',
        noCache: true,
        roles: ['warehousQuote']
      }
    },
    {
      path: 'car-price',
      component: () =>
        import(
          /* webpackChunkName: "private-line-price" */ '@/views/price-management/price-car/index.vue'
        ),
      name: 'carPrice',
      meta: {
        title: 'carPrice',
        noCache: true,
        roles: ['kapaiOffer']
      }
    },
    {
      path: 'price-trailer',
      component: () =>
        import(
          /* webpackChunkName: "private-line-price" */ '@/views/price-management/price-trailer/index.vue'
        ),
      name: 'priceTrailer',
      meta: {
        title: 'priceTrailer',
        noCache: true,
        roles: ['trailerQuote']
      }
    },
    {
      path: 'price-customs-clearance',
      component: () =>
        import(
          /* webpackChunkName: "private-line-price" */ '@/views/price-management/price-customs-clearance/index.vue'
        ),
      name: 'priceCustomsClearance',
      meta: {
        title: 'priceCustomsClearance',
        noCache: true,
        roles: ['customsQuote']
      }
    },
    {
      path: 'price-supplier',
      component: () =>
        import(
          /* webpackChunkName: "private-line-price" */ '@/views/price-management/supplier/index.vue'
        ),
      name: 'supplierPrice',
      meta: {
        title: 'supplierPrice',
        noCache: true,
        isJHT: true,
        roles: ['supplierQuote']
      }
    },
    {
      path: 'price-outsourc',
      component: () =>
        import(
          /* webpackChunkName: "private-line-price" */ '@/views/price-management/price-outsourc/index.vue'
        ),
      name: 'priceOutsourc',
      meta: {
        title: 'priceOutsourc',
        noCache: true,
        roles: ['priceOutsourc']
      }
    }
  ]
}

export default priceManagementRouter
