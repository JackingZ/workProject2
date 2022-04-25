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

// 查询列表
export function getWHList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/warehouse/getWarehouseList',
    method: 'post',
    data
  }
  return request(params)
}
export function getWinOrderByCode(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/worder/getWinOrderByCode',
    method: 'post',
    params: data
  }
  return request(params)
}

// 查询仓库
export function getWarehouseAllList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/warehouse/selectlist',
    method: 'get'
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

// 查询仓储订单列表
export function getOrderList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/worder/getOrderList',
    method: 'post',
    data
  }
  return request(params)
}
//
export function moveOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/worder/generateOrder',
    method: 'post',
    data
  }
  return request(params)
}

export function getOrderDetails(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/worder/getWarehouseOrder',
    method: 'get',
    params: data
  }
  return request(params)
}
// 打印单
export function getWarehouseExportFile(data: {
  tag: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/report/r/tag',
    method: 'get',
    params: data
  }
  return request(params)
}

export function deleteOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/worder/deleteOrder',
    method: 'delete',
    params: data
  }
  return request(params)
}

export function deletePallet(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/worder/deletePallet',
    method: 'delete',
    params: data
  }
  return request(params)
}
export function getServiceInfoByType(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/ordertype/getSscByOrderType',
    method: 'get',
    params: data
  }
  return request(params)
}
export function saveWarehouseOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/worder/saveOrder',
    method: 'post',
    data
  }
  return request(params)
}

// 根据原单号查询1.0系统返回箱号列表
export function queryBoxsBySys1(data: { code: string }): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/query-boxs-by-code',
    method: 'post',
    data
  }
  return request(params)
}

export function getWarehouseList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/guest/warehouse/list',
    method: 'post',
    data
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

export function getPalletOrderList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/pallet/getPallet',
    method: 'post',
    data
  }
  return request(params)
}

export function getOrderExcel(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/worder/exportWinOrder',
    method: 'post',
    responseType: 'blob',
    data
  }
  return request(params)
}
