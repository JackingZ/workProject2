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
// 查询快递公司列表
export function getExpressCompany(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/org/getOrgList',
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

// 查询快递订单列表
export function getOrderList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/express/web/expressorder/list',
    method: 'post',
    data
  }
  return request(params)
}

export function getOrderDetails(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/express/web/expressorder',
    method: 'get',
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

export function getExpressOrdersZipFile(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/express/web/expressorder/downloadZipFile',
    responseType: 'blob',
    method: 'post',
    params: data
  }
  return request(params)
}
export function getExpressOrdersPdfFile(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'express/web/expressorder/downLoadPdfFile',
    method: 'post',
    params: data,
    responseType: 'blob'
  }
  return request(params)
}
export function getExpressOrdersPdfMosaic(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/express/web/expressorder/customerPdfFile',
    method: 'post',
    params: data,
    responseType: 'blob'
  }
  return request(params)
}
export function updateExpressOrders(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/express/web/expressorder/update',
    method: 'post',
    data
  }
  return request(params)
}
export function syncExpressStatus(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'express/web/expressorder/sync',
    method: 'get',
    params: data
  }
  return request(params)
}
export function revokeExpressOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'express/api/express/label-void',
    method: 'post',
    params: data
  }
  return request(params)
}
export function changedExpressOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'express/api/express/changedOrder',
    method: 'post',
    data
  }
  return request(params)
}
export function getExpressNos(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'express/web/expressorder/identificatios',
    method: 'post',
    data
  }
  return request(params)
}
export function downLoadTrackingFile(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'express/web/expressorder/downLoadTrackingFile',
    method: 'post',
    responseType: 'blob',
    data
  }
  return request(params)
}
export function exportExpressExcel(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'express/web/expressorder/export',
    method: 'get',
    responseType: 'blob',
    params: data
  }
  return request(params)
}
export function getExpressStatusList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'express/web/expressorder/getUpsInfo',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getExpressHistory(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'express/web/expressorder/g',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getExpressRecordList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/express/web/expressorder/order_log',
    method: 'post',
    data
  }
  return request(params)
}

export function getGoodsById(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'express/web/expressorder/get_goods',
    method: 'get',
    params: data
  }
  return request(params)
}
