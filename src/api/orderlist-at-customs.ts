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
export function getFbastoreList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/fbastore/getFbastoreList',
    method: 'get',
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

// 查询报关订单列表
export function getOrderList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/declare_order/get_declare_data',
    method: 'post',
    data
  }
  return request(params)
}
// 按柜查询
export function getContainList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/declare_order/container_view',
    method: 'post',
    data
  }
  return request(params)
}
export function saveContainStatus(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/declare_order/container_update',
    method: 'post',
    data
  }
  return request(params)
}
export function getInvoiceByNo(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/declareInvoice/getInfoByNo',
    method: 'get',
    params: data
  }
  return request(params)
}
export function saveInvoiceByNo(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/declareInvoice/update',
    method: 'post',
    data
  }
  return request(params)
}
export function getBoxByNo(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/declarePackages/getInfoByNo',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getOrderByNo(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/declare_order/container_declare',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getFileByNo(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/containFile/getPathByNo',
    method: 'get',
    params: data
  }
  return request(params)
}
export function deleteNoFile(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/containFile/delete',
    method: 'get',
    params: data
  }
  return request(params)
}
export function saveNoFile(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/containFile/saveContainFile',
    method: 'post',
    data
  }
  return request(params)
}

export function exportInvoiceBill(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/declare_order/export',
    method: 'post',
    params: data,
    responseType: 'blob'
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
export function getCustList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/getcustlist',
    method: 'post',
    data
  }
  return request(params)
}

// 文件状态列表
export function getFileData(data: {
  number: string | number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/declare_order/get_file_data',
    method: 'post',
    params: data
  }
  return request(params)
}
export function getFileConfig(data: {
  model: any
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/fc/page',
    method: 'post',
    data
  }
  return request(params)
}

export function saveCustomsStatus(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/declare_order/update',
    method: 'post',
    data
  }
  return request(params)
}

export function saveFile(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/declare_order/save_file',
    method: 'post',
    data
  }
  return request(params)
}
export function auditFile(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/declare_order/audit_file',
    method: 'post',
    data
  }
  return request(params)
}
export function auditJHTFile(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/declare_order/jht_audit',
    method: 'get',
    params: data
  }
  return request(params)
}
export function saveSupperier(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/declare_order/assign',
    method: 'post',
    data
  }
  return request(params)
}
export function getSupperier(data: {
  serviceId: string | number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/declare_order/get_supply',
    method: 'get',
    params: data
  }
  return request(params)
}
