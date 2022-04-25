import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

// 卡派订单列表
export function getCarOrderList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/card/get_data',
    method: 'post',
    data
  }
  return request(params)
}

// 查询所有国家接口
export function getCountryList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCountryList',
    method: 'get'
  }
  return request(params)
}

// 服务类型接口
export function getKscList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ksc/getKscList',
    method: 'post',
    data
  }
  return request(params)
}

// 查询供应商列表
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

// 字典
export function getWordsList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/dict/item/type',
    method: 'get',
    params: data
  }
  return request(params)
}

// 分配车辆接口
export function getCar(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/card/get_card',
    method: 'post',
    data
  }
  return request(params)
}
export function taskComplete(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/card/complete_task',
    method: 'post',
    data
  }
  return request(params)
}

// 订单详情接口
export function getOrderDetails(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/card/get_pack',
    method: 'post',
    params: data
  }
  return request(params)
}

// 分配车辆
export function save(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/card/assign_driver',
    method: 'post',
    data
  }
  return request(params)
}

export function getServiceSubtypeList(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceSubtypeList',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getVehicles(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/card/get_vehicles',
    method: 'get',
    params: data
  }
  return request(params)
}
