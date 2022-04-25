import Layout from '@/layout/index.vue'
import { RouteConfig } from 'vue-router'

const organizersManagementRouter: RouteConfig = {
  path: '/organziers',
  component: Layout,
  redirect: 'noredirect',
  name: 'OrganziersNavigate',
  meta: {
    title: 'Organizers',
    icon: 'tree-table',
    alwaysShow: true,
    roles: ['orgAdmin']
  },
  children: [
    {
      path: 'role-management', // 权限设置
      component: () =>
        import(
          /* webpackChunkName: "role-management" */ '@/views/organizers-management/role/index.vue'
        ),
      name: 'RoleManagement',
      meta: {
        title: 'RoleManagement',
        noCache: true,
        isJHT: true,
        roles: ['permit']
      }
    },
    {
      path: 'personnel-management', // 人员管理
      component: () =>
        import(
          /* webpackChunkName: "personnel-management" */ '@/views/organizers-management/personnel/index.vue'
        ),
      name: 'PersonnelManagement',
      meta: {
        title: 'PersonnelManagement',
        noCache: true,
        roles: ['user']
      }
    },
    {
      path: 'department-management', // 部门管理
      component: () =>
        import(
          /* webpackChunkName: "department-management" */ '@/views/organizers-management/department-management/index.vue'
        ),
      name: 'DepartmentManagement',
      meta: {
        title: 'DepartmentManagement',
        noCache: true,
        roles: ['dept']
      }
    },
    {
      path: 'customer-management', // 客户管理
      component: () =>
        import(
          /* webpackChunkName: "customer-management" */ '@/views/organizers-management/customer-management/index.vue'
        ),
      name: 'CustomerManagement',
      meta: {
        title: 'CustomerManagement',
        noCache: true,
        roles: ['customer']
      }
    },
    {
      path: 'agent-management', // 代理商管理
      component: () =>
        import(
          /* webpackChunkName: "agent-management" */ '@/views/organizers-management/agent-management/index.vue'
        ),
      name: 'AgentManagement',
      meta: {
        title: 'AgentManagement',
        noCache: true,
        roles: ['agency']
      }
    },
    {
      path: 'supplier-management', // 供应商管理
      component: () =>
        import(
          /* webpackChunkName: "supplier-management" */ '@/views/organizers-management/supplier-management/index.vue'
        ),
      name: 'SupplierManagement',
      meta: {
        title: 'SupplierManagement',
        noCache: true,
        roles: ['suppers']
      }
    }
  ]
}

export default organizersManagementRouter
