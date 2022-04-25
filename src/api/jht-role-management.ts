import request from '@/utils/request'
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios'

// 查询角色
export function getRoles(data: {
  custType: string,
  typeIds?: any[]
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/permit/getRoles',
    method: 'post',
    data
  }
  return request(params)
}

// 获取权限树
export function getPermits(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/permit/getPermits',
    method: 'get'
  }
  return request(params)
}

// 获取权限列表
export function getPermitList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/permit/getPermitList',
    method: 'get'
  }
  return request(params)
}

// 获取角色权限
export function getPermitByRole(id: string): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/permit/getPermitByRole',
    method: 'get',
    params: {
      id
    }
  }
  return request(params)
}

// 修改角色权限
export function saveRolePermit(data: {
  permitId: any[]
  roleId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/permit/saveRolePermit',
    method: 'post',
    data
  }
  return request(params)
}

// 删除角色
export function deleteRole(roleId: string): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/permit/deleteRole',
    method: 'post',
    params: {
      roleId
    }
  }
  return request(params)
}

// 新增修改角色
export function saveRole(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/permit/saveRole',
    method: 'post',
    data
  }
  return request(params)
}
export function addPermit(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'auth/permit/add',
    method: 'post',
    data
  }
  return request(params)
}

// 服务大类列表
export function getServiceTypeList(data: {
  custType: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceTypeList',
    method: 'get',
    params: data
  }
  return request(params)
}
