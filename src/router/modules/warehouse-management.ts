import Layout from '@/layout/index.vue'
import { RouteConfig } from 'vue-router'

const warehouseManagementRouter: RouteConfig = {
  path: '/warehouse',
  component: Layout,
  redirect: 'noredirect',
  name: 'WarehouseNavigate',
  meta: {
    title: 'Warehouse',
    icon: 'tree-table',
    alwaysShow: true,
    roles: ['warehouse']
  },
  children: [
    {
      path: 'unloading-apply', // 卸货
      component: () =>
        import(
          /* webpackChunkName: "unloading-apply" */ '@/views/warehose-management/unloading-apply/index.vue'
        ),
      name: 'unloadingApply',
      meta: {
        title: 'unloadingApply',
        noCache: true,
        roles: ['unloadOrders']
      }
    },
    // {
    //   path: 'devanning-details', // 拆柜
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "devanning-details" */ '@/views/warehose-management/devanning-details/index.vue'
    //     ),
    //   name: 'devanningDetails',
    //   meta: {
    //     title: 'devanningDetails',
    //     noCache: true,
    //     roles: []
    //   }
    // },
    {
      path: 'measure-apply', // 计量
      component: () =>
        import(
          /* webpackChunkName: "measure-apply" */ '@/views/warehose-management/measure-apply/index.vue'
        ),
      name: 'measureApply',
      meta: {
        title: 'measureApply',
        noCache: true,
        roles: ['measure']
      }
    },
    {
      path: 'trailer-task', // 拖托
      component: () =>
        import(
          /* webpackChunkName: "trailer-task" */ '@/views/warehose-management/trailer-task/index.vue'
        ),
      name: 'trailerTask',
      meta: {
        title: 'trailerTask',
        noCache: true,
        roles: ['towage']
      }
    },
    {
      path: 'cabinet-removal', // 拆柜任务
      component: () =>
        import(
          /* webpackChunkName: "trailer-task" */ '@/views/warehose-management/cabinet-removal/index.vue'
        ),
      name: 'cabinetRemoval',
      meta: {
        title: 'cabinetRemovalTask',
        noCache: true,
        roles: ['cabinetRemoval']
      }
    },
    // {
    //   path: 'picking-task', // 拣货
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "picking-task" */ '@/views/warehose-management/picking-task/index.vue'
    //     ),
    //   name: 'pickingTask',
    //   meta: {
    //     title: 'pickingTask',
    //     noCache: true,
    //     roles: []
    //   }
    // },
    // {
    //   path: 'putaway-task', // 上架
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "putaway-task" */ '@/views/warehose-management/putaway-task/index.vue'
    //     ),
    //   name: 'putawayTask',
    //   meta: {
    //     title: 'putawayTask',
    //     noCache: true
    //     // roles: []
    //   }
    // },
    {
      path: 'moving-apply', // 调拨
      component: () =>
        import(
          /* webpackChunkName: "moving-apply" */ '@/views/warehose-management/moving-apply/index.vue'
        ),
      name: 'movingApply',
      meta: {
        title: 'movingApply',
        noCache: true,
        roles: ['movingApply']
      }
    },
    {
      path: 'output-apply', // 出库
      component: () =>
        import(
          /* webpackChunkName: "output-apply" */ '@/views/warehose-management/output-apply/index.vue'
        ),
      name: 'outputApply',
      meta: {
        title: 'outputApply',
        noCache: true,
        roles: ['outStock']
      }
    },
    {
      path: 'inventory-apply', // 盘点
      component: () =>
        import(
          /* webpackChunkName: "inventory-apply" */ '@/views/warehose-management/inventory-apply/index.vue'
        ),
      name: 'inventoryApply',
      meta: {
        title: 'inventoryApply',
        noCache: true,
        roles: ['inventoryApply']
      }
    },
    {
      path: 'examine-apply', // 验货
      component: () =>
        import(
          /* webpackChunkName: "examine-apply" */ '@/views/warehose-management/examine-apply/index.vue'
        ),
      name: 'examineApply',
      meta: {
        title: 'examineApply',
        noCache: true,
        roles: ['examine']
      }
    },
    // {
    //   path: 'services-apply', // 增值
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "services-apply" */ '@/views/warehose-management/services-apply/index.vue'
    //     ),
    //   name: 'servicesApply',
    //   meta: {
    //     title: 'servicesApply',
    //     noCache: true,
    //     roles: []
    //   }
    // },
    {
      path: 'anomaly-list', // 异常
      component: () =>
        import(
          /* webpackChunkName: "anomaly-list" */ '@/views/warehose-management/anomaly-list/index.vue'
        ),
      name: 'anomalyList',
      meta: {
        title: 'anomalyList',
        noCache: true,
        roles: []
      }
    },
    {
      path: 'transfer-task', // 换单
      component: () =>
        import(
          /* webpackChunkName: "transfer-task" */ '@/views/warehose-management/transfer-task/index.vue'
        ),
      name: 'transferTask',
      meta: {
        title: 'transferTask',
        noCache: true,
        roles: ['transferTask']
      }
    },
    {
      path: 'warehouse-config', // 仓库配置
      component: () =>
        import(
          /* webpackChunkName: "warehouse-config" */ '@/views/warehose-management/warehouse-config/index.vue'
        ),
      name: 'warehouseConfig',
      meta: {
        title: 'warehouseConfig',
        noCache: true,
        roles: ['wsConfig']
      }
    }
  ]
}

export default warehouseManagementRouter
