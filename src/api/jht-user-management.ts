import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

export interface IUserRequest {
  id: snu
  custId: snu // 所属公司id
  custName: snu // 所属公司名称
  deptId: snu // 所属部门id
  deptName: snu // 所属部门名称
  realName: snu // 用户姓名
  username: snu // 用户登录名
  phone: snu // 用户手机
  password: snu // 用户密码
  roles: any[] // 用户权限
  [propName: string]: any
}

// 查询用户列表
export function getUserList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/user/getUserList',
    method: 'post',
    data
  }
  return request(params)
}

// 新增用户
export function saveUser(data: IUserRequest): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/user/saveUser',
    method: 'post',
    data
  }
  return request(params)
}

// 重置密码
export function resetPassword(id: string): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: `/auth/user/resetPassword?id=${id}`,
    method: 'post'
  }
  return request(params)
}

// 获取用户详情
export function getUser(id: snu): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/user/getUser',
    method: 'get',
    params: {
      id
    }
  }
  return request(params)
}

// 删除用户
export function deleteUser(id: snu): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/user/deleteUser',
    method: 'delete',
    params: {
      id
    }
  }
  return request(params)
}

// 启用禁用用户
export function changeStatus(data: {
  id: string
  status: string | number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/user/changeStatus',
    method: 'post',
    params: data
  }
  return request(params)
}

// 查询部门列表
export function getDeptList(data: {
  custId: snu
  deptId: snu
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/dept/getDeptList',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getSupplierList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/supplier/getSupplierList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询代理商列表
export function getAgentList(data: {
  page: number
  size: number
  parentId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/agent/getAgentList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询客户列表
export function getCustomerList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/customer/customer',
    method: 'post',
    data
  }
  return request(params)
}

// 查询服务列表
export function getCustomerServiceType(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/getServiceTypes',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询岗位common
export function getPostList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/post/getPostList',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getParUserList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/user/parent',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询二级代理商非独立财务公司
export function getUnFinanceAgentList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/agent/customer_finance',
    method: 'get'
  }
  return request(params)
}
