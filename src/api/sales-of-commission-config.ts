import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

// 获取列表
export function getCommissionList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/commission_cfg/page',
    method: 'post',
    data
  }
  return request(params)
}
// 保存
export function saveCommission(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/commission_cfg/add',
    method: 'post',
    data
  }
  return request(params)
}
export function saveService(data: any): AxiosPromise<any> {
  const { id, list } = data
  const params: AxiosRequestConfig = {
    url: `/orders/commission_cfg/association/${id}`,
    method: 'post',
    data: list
  }
  return request(params)
}
export function getCommissionItems(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/commission_cfg/info',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getService(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/commission_cfg/service',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getServiceItems(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/commission_cfg/show',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getOperateItems(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/commission_cfg/log',
    method: 'post',
    data
  }
  return request(params)
}
export function getCommissionVersion(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/commission_cfg/version',
    method: 'get',
    params: data
  }
  return request(params)
}
// 删除
export function deleteCommission(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/commission_cfg/del',
    method: 'delete',
    params: data
  }
  return request(params)
}

export function getCountryList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCountryList',
    method: 'get'
  }
  return request(params)
}

export function getServiceSubtypeList(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceSubtypeList',
    method: 'GET',
    params: data
  }
  return request(params)
}

export function getLscSimpleList(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/listall',
    method: 'post',
    params: data
  }
  return request(params)
}

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
