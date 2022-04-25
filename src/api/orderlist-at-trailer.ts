import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

// 查询所有国家接口
export function getCountryList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCountryList',
    method: 'get'
  }
  return request(params)
}

export function getPortList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/ports/getPortList',
    method: 'get',
    params: data
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

// 查询拖车订单列表
export function getOrderList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/trailer/page',
    method: 'post',
    data
  }
  return request(params)
}

export function getOrderDetails(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/trailer/details',
    method: 'post',
    params: data
  }
  return request(params)
}

export function deleteOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 企业服务类别列表
export function getCustTypeList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/getCustTypeList',
    method: 'get',
    params: data
  }
  return request(params)
}

export function saveSupperier(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '',
    method: 'post',
    params: data
  }
  return request(params)
}
// 获取柜子信息
export function getContainerByOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/trailer/get_container',
    method: 'post',
    params: data
  }
  return request(params)
}
// 上传柜号等信息
export function upContainer(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/trailer/up_container',
    method: 'post',
    params: data
  }
  return request(params)
}
// 分配车辆
export function assignDriver(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/trailer/assign_driver',
    method: 'post',
    data
  }
  return request(params)
}
// 获取车辆
export function getCarByOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/trailer/get_car',
    method: 'get',
    params: data
  }
  return request(params)
}
export function uploadFile(data: any) {
  const params: AxiosRequestConfig = {
    url: '/wms/aliyun/oss/upload',
    method: 'post',
    data
  }
  return request(params)
}
export function deleteFile(data: any) {
  const params: AxiosRequestConfig = {
    url: '/wms/aliyun/oss/del',
    method: 'post',
    data
  }
  return request(params)
}
export function addCost(data: any) {
  const params: AxiosRequestConfig = {
    url: '/orders/trailer/save_cost',
    method: 'post',
    data
  }
  return request(params)
}
export function editCost(data: any) {
  const params: AxiosRequestConfig = {
    url: '/orders/trailer/edit_cost',
    method: 'post',
    data
  }
  return request(params)
}
export function delCost(data: any) {
  const params: AxiosRequestConfig = {
    url: '/orders/trailer/delete_cost',
    method: 'post',
    params: data
  }
  return request(params)
}
export function auditCost(data: any) {
  const params: AxiosRequestConfig = {
    url: '/orders/trailer/audit_cost',
    method: 'post',
    params: data
  }
  return request(params)
}
export function commitCost(data: any) {
  const params: AxiosRequestConfig = {
    url: '/orders/trailer/commit_cost',
    method: 'post',
    params: data
  }
  return request(params)
}
