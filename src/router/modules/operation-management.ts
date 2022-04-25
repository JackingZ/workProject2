import Layout from '@/layout/index.vue'
import { RouteConfig } from 'vue-router'

const operationManagementRouter: RouteConfig = {
  path: '/operation',
  component: Layout,
  redirect: 'noredirect',
  name: 'OperationNavigate',
  meta: {
    title: 'Operation',
    icon: 'tree-table',
    alwaysShow: true,
    roles: ['ops']
  },
  children: [
    {
      path: 'area-management', // 国家省州
      component: () =>
        import(
          /* webpackChunkName: "area-management" */ '@/views/operation-management/area-management/index.vue'
        ),
      name: 'AreaManagement',
      meta: {
        title: 'AreaManagement',
        noCache: true,
        roles: ['countryState']
      }
    },
    {
      path: 'port-management', // 机场港口
      component: () =>
        import(
          /* webpackChunkName: "port-management" */ '@/views/operation-management/port-management/index.vue'
        ),
      name: 'PortManagement',
      meta: {
        title: 'PortManagement',
        noCache: true,
        roles: ['ports']
      }
    },
    {
      path: 'international-flight', // 国际航线
      component: () =>
        import(
          /* webpackChunkName: "port-management" */ '@/views/operation-management/international-flight/index.vue'
        ),
      name: 'InternationalFlight',
      meta: {
        title: 'InternationalFlight',
        noCache: true,
        roles: ['route']
      }
    },
    {
      path: 'domestic-area', // 区域配置
      component: () =>
        import(
          /* webpackChunkName: "domestic-area" */ '@/views/operation-management/domestic-area/index.vue'
        ),
      name: 'DomesticArea',
      meta: {
        title: 'DomesticArea',
        noCache: true,
        roles: ['domestic']
      }
    },
    {
      path: 'service-agency', // 服务机构
      component: () =>
        import(
          /* webpackChunkName: "port-management" */ '@/views/operation-management/service-agency/index.vue'
        ),
      name: 'ServiceAgency',
      meta: {
        title: 'ServiceAgency',
        noCache: true,
        roles: ['serviceOrg']
      }
    },
    {
      path: 'vehicle-management', // 车型选择
      component: () =>
        import(
          /* webpackChunkName: "vehicle-management" */ '@/views/operation-management/vehicle-management/index.vue'
        ),
      name: 'VehicleManagement',
      meta: {
        title: 'VehicleManagement',
        noCache: true,
        roles: ['vehicleType']
      }
    },
    {
      path: 'container-management', // 货柜管理
      component: () =>
        import(
          /* webpackChunkName: "container-management" */ '@/views/operation-management/container-management/index.vue'
        ),
      name: 'ContainerManagement',
      meta: {
        title: 'ContainerManagement',
        noCache: true,
        roles: ['container']
      }
    },
    {
      path: 'fbacontainer-management', // FBA 仓库管理
      component: () =>
        import(
          /* webpackChunkName: "fbacontainer-management" */ '@/views/operation-management/fbacontainer-management/index.vue'
        ),
      name: 'FBAContainerManagement',
      meta: {
        title: 'FBAContainerManagement',
        noCache: true,
        roles: ['fbastore']
      }
    },
    {
      path: 'rate', // 汇率记录
      component: () =>
        import(
          /* webpackChunkName: "the-rate" */ '@/views/operation-management/rate/index.vue'
        ),
      name: 'Rate',
      meta: {
        title: 'Rate',
        noCache: true,
        roles: ['exchangerate']
      }
    },
    {
      path: 'currency-management', // 货币管理
      component: () =>
        import(
          /* webpackChunkName: "currency-management" */ '@/views/operation-management/currency-management/index.vue'
        ),
      name: 'CurrencyManagement',
      meta: {
        title: 'CurrencyManagement',
        noCache: true,
        roles: ['currency']
      }
    },
    {
      path: 'taboo-management', // 禁忌词语
      component: () =>
        import(
          /* webpackChunkName: "taboo-management" */ '@/views/operation-management/taboo-words/index.vue'
        ),
      name: 'TabooWords',
      meta: {
        title: 'TabooWords',
        noCache: true,
        roles: ['taboo']
      }
    },
    {
      path: 'service-genara', // 服务大类
      component: () =>
        import(
          /* webpackChunkName: "service-genara" */ '@/views/operation-management/service-genara/index.vue'
        ),
      name: 'ServiceGenera',
      meta: {
        title: 'ServiceGenera',
        noCache: true,
        roles: ['category']
      }
    },
    // {
    //   path: 'service-setup', // 服务设置
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "service-setup" */ '@/views/operation-management/service-setup/index.vue'
    //     ),
    //   name: 'ServiceSetup',
    //   meta: {
    //     title: 'ServiceSetup',
    //     noCache: true,
    //     roles: ['servicesettings']
    //   }
    // },
    {
      path: 'job-setup', // 岗位设置
      component: () =>
        import(
          /* webpackChunkName: "job-setup" */ '@/views/operation-management/job-setup/index.vue'
        ),
      name: 'JobSetup',
      meta: {
        title: 'JobSetup',
        noCache: true,
        roles: ['postsetting']
      }
    },
    {
      path: 'report-definition', // 报表定义
      component: () =>
        import(
          /* webpackChunkName: "report-definition" */ '@/views/operation-management/report-definition/index.vue'
        ),
      name: 'ReportDefinition',
      meta: {
        title: 'ReportDefinition',
        noCache: true,
        roles: ['reports']
      }
    },
    {
      path: 'customs-factor', // 报关要素
      component: () =>
        import(
          /* webpackChunkName: "customs-factor" */ '@/views/operation-management/customs-factor/index.vue'
        ),
      name: 'CustomsFactor',
      meta: {
        title: 'CustomsFactor',
        noCache: true,
        roles: ['CustomsFactor']
      }
    },
    {
      path: 'order-type', // 下单配置
      component: () =>
        import(
          /* webpackChunkName: "order-type" */ '@/views/operation-management/order-type/index.vue'
        ),
      name: 'OrderType',
      meta: {
        title: 'OrderType',
        noCache: true,
        roles: ['plo']
      }
    },
    {
      path: 'task-document', // 任务单证
      component: () =>
        import(
          /* webpackChunkName: "task-document" */ '@/views/operation-management/task-document/index.vue'
        ),
      name: 'TaskDocument',
      meta: {
        title: 'TaskDocument',
        noCache: true,
        roles: ['ttsk']
      }
    },
    // {
    //   path: 'product-type', // 商品类别
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "product-type" */ '@/views/operation-management/product-type/index.vue'
    //     ),
    //   name: 'ProductType',
    //   meta: {
    //     title: 'ProductType',
    //     noCache: true,
    //     roles: ['goodsType']
    //   }
    // },
    // {
    //   path: 'customs-code', // 海关编码
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "customs-code" */ '@/views/operation-management/customs-code/index.vue'
    //     ),
    //   name: 'CustomsCode',
    //   meta: {
    //     title: 'CustomsCode',
    //     noCache: true,
    //     roles: ['customsCode']
    //   }
    // },
    {
      path: 'file-config', // 文件配置
      component: () =>
        import(
          /* webpackChunkName: "file-config" */ '@/views/operation-management/file-config/index.vue'
        ),
      name: 'FileConfig',
      meta: {
        title: 'FileConfig',
        noCache: true,
        roles: ['fileConfig']
      }
    },
    {
      path: 'examine-config', // 验货配置
      component: () =>
        import(
          /* webpackChunkName: "examine-config" */ '@/views/operation-management/examine-config/index.vue'
        ),
      name: 'ExamineConfig',
      meta: {
        title: 'ExamineConfig',
        noCache: true,
        roles: ['InspectionConfig']
      }
    },
    {
      path: 'aviation-plate', // 航空板
      component: () =>
        import(
          /* webpackChunkName: "aviation-plate" */ '@/views/operation-management/aviation-plate/index.vue'
        ),
      name: 'AviationPlate',
      meta: {
        title: 'AviationPlate',
        noCache: true,
        roles: ['aviationBoard']
      }
    },
    {
      path: 'single-shipment', // 分单发货
      component: () =>
        import(
          /* webpackChunkName: "single-shipment" */ '@/views/operation-management/single-shipment/index.vue'
        ),
      name: 'SingleShipment',
      meta: {
        title: 'SingleShipment',
        noCache: true,
        roles: ['separateDelivery']
      }
    },
    {
      path: 'container-shipment', // 整柜发货
      component: () =>
        import(
          /* webpackChunkName: "container-shipment" */ '@/views/operation-management/container-shipment/index.vue'
        ),
      name: 'ContainerShipment',
      meta: {
        title: 'ContainerShipment',
        noCache: true,
        roles: ['fclShipment']
      }
    },
    {
      path: 'order-delivery', // 订单派送
      component: () =>
        import(
          /* webpackChunkName: "container-shipment" */ '@/views/operation-management/order-delivery/index.vue'
        ),
      name: 'orderDelivery',
      meta: {
        title: 'orderDelivery',
        noCache: true,
        roles: ['orderDelivery']
      }
    },
    {
      path: 'outsourc-shipment', // 外协发货
      component: () =>
        import(
          /* webpackChunkName: "container-shipment" */ '@/views/operation-management/outsourc-shipment/index.vue'
        ),
      name: 'OutsourcShipment',
      meta: {
        title: 'OutsourcShipment',
        noCache: true,
        roles: ['OutsourcShipment']
      }
    }
  ]
}

export default operationManagementRouter
