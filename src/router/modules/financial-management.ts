import Layout from '@/layout/index.vue'
import { RouteConfig } from 'vue-router'

const financialManagementRouter: RouteConfig = {
  path: '/financial',
  component: Layout,
  redirect: 'noredirect',
  name: 'financialNavigate',
  meta: {
    title: 'FinancialManagement',
    icon: 'tree-table',
    alwaysShow: true,
    roles: ['finance']
  },
  children: [
    // {
    //   path: 'basic-accountancy',
    //   component: () =>
    //         import(
    //           /* webpackChunkName: "basic-accountancy" */ '@/views/financial-management/basic-accountancy/index.vue'
    //         ),
    //   name: 'BasicAccountancy',
    //   meta: {
    //     title: 'BasicAccountancy',
    //     noCache: true
    //   }
    // },
    // {
    //   path: 'corporate-accounting',
    //   component: () =>
    //         import(
    //           /* webpackChunkName: "corporate-accounting" */ '@/views/financial-management/corporate-accounting/index.vue'
    //         ),
    //   name: 'CorporateAccounting',
    //   meta: {
    //     title: 'CorporateAccounting',
    //     noCache: true
    //   }
    // },
    {
      path: 'invoice-receivable', // 应收发票
      component: () =>
      import(
        /* webpackChunkName: "invoice-receivable" */ '@/views/financial-management/invoice-receivable/index.vue'
      ),
      name: 'InvoiceReceivable',
      meta: {
        title: 'InvoiceReceivable',
        noCache: true,
        roles: ['financeReceive']
      }
    },
    {
      path: 'invoice-payable', // 应付发票
      component: () =>
      import(
        /* webpackChunkName: "invoice-payable" */ '@/views/financial-management/invoice-payable/index.vue'
      ),
      name: 'InvoicePayable',
      meta: {
        title: 'InvoicePayable',
        noCache: true,
        roles: ['financePayment']
      }
    },
    {
      path: 'invoice-out', // 开票
      component: () =>
      import(
        /* webpackChunkName: "invoice-out" */ '@/views/financial-management/invoice-out/index.vue'
      ),
      name: 'InvoiceOut',
      meta: {
        title: 'InvoiceOut',
        noCache: true,
        roles: ['invoiceOut']
      }
    },
    {
      path: 'collection-order', // 收款单
      component: () =>
      import(
        /* webpackChunkName: "collection-order" */ '@/views/financial-management/collection-order/index.vue'
      ),
      name: 'CollectionOrder',
      meta: {
        title: 'CollectionOrder',
        noCache: true,
        roles: ['financeReceipt']
      }
    },
    {
      path: 'cash-order', // 申请单
      component: () =>
      import(
        /* webpackChunkName: "cash-order" */ '@/views/financial-management/cash-order/index.vue'
      ),
      name: 'CashOrder',
      meta: {
        title: 'CashOrder',
        noCache: true,
        roles: ['waiterList']
      }
    },
    {
      path: 'payment-order', // 付款单
      component: () =>
      import(
        /* webpackChunkName: "payment-order" */ '@/views/financial-management/payment-order/index.vue'
      ),
      name: 'PaymentOrder',
      meta: {
        title: 'PaymentOrder',
        noCache: true,
        roles: ['financeReceipts']
      }
    },
    {
      path: 'check-order', // 对账单
      component: () =>
      import(
        /* webpackChunkName: "check-order" */ '@/views/financial-management/check-order/index.vue'
      ),
      name: 'CheckOrder',
      meta: {
        title: 'CheckOrder',
        noCache: true,
        roles: ['financeCheckOrder']
      }
    },
    {
      path: 'fiscal-period', // 会计期间
      component: () =>
      import(
        /* webpackChunkName: "fiscal-period" */ '@/views/financial-management/fiscal-period/index.vue'
      ),
      name: 'FiscalPeriod',
      meta: {
        title: 'FiscalPeriod',
        noCache: true,
        roles: ['fiscalPeriod']
      }
    },
    {
      path: 'company-credit', // 公司信用
      component: () =>
      import(
        /* webpackChunkName: "company-credit" */ '@/views/financial-management/company-credit/index.vue'
      ),
      name: 'CompanyCredit',
      meta: {
        title: 'CompanyCredit',
        noCache: true,
        roles: ['financeCompany']
      }
    },
    {
      path: 'risk-control', // 风险控制
      component: () =>
      import(
        /* webpackChunkName: "risk-control" */ '@/views/financial-management/risk-control/index.vue'
      ),
      name: 'RiskControl',
      meta: {
        title: 'RiskControl',
        noCache: true,
        roles: ['riskControl']
      }
    },
    {
      path: 'financial-order', // 专线订单
      component: () =>
        import(
          /* webpackChunkName: "risk-control" */ '@/views/financial-management/order/index.vue'
        ),
      name: 'financialOrder',
      meta: {
        title: 'financialOrder',
        noCache: true,
        roles: ['financialOrder']
      }
    }
  ]
}

export default financialManagementRouter
