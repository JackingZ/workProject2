import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

// 查询所有国家接口
export function getCountryList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/getcountries',
    method: 'get',
    params: data
  }
  return request(params)
}
// 获取业务类型
export function getServiceSubtypeList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceSubtypeList',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getLscComplicatedList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/condition',
    method: 'post',
    data
  }
  return request(params)
}

// 列表
export function getTableList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/takeOutOrder/findByParam',
    method: 'post',
    data
  }
  return request(params)
}
// 获取供应商
export function getSupplierList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'auth/supplier/getSupplierList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 获取订单列表
export function getOrderList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/takeOutOrder/queryFullOrder',
    method: 'post',
    data
  }
  return request(params)
}
export function getOrderData(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/takeOutOrder/getOrder',
    method: 'get',
    params: data
  }
  return request(params)
}
// 获取装货仓库列表
export function getWarehouseList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/warehouse/getWarehouseList',
    method: 'post',
    data
  }
  return request(params)
}
// 外协发货保存
export function save(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/takeOutOrder/save',
    method: 'post',
    data
  }
  return request(params)
}
// 外协发货保存
export function edit(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/takeOutOrder/modifyOrder',
    method: 'post',
    data
  }
  return request(params)
}
// 获取外协发货详情
export function getOrderById(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/takeOutOrder/findById',
    method: 'get',
    params: data
  }
  return request(params)
}
// 获取外协发货快递单
export function getOutExpress(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/guest/outExpress/redaData',
    method: 'get',
    params: data
  }
  return request(params)
}
// 导出外协发货快递单信息
export function outExpressExport(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/guest/outExpress/export',
    method: 'post',
    params: data,
    responseType: 'blob'
  }
  return request(params)
}
// 导出箱单发票
export function outExport(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/takeOutOrder/export',
    method: 'post',
    params: data,
    responseType: 'blob'
  }
  return request(params)
}
// 导入外协发货快递单信息
export function outExpressImport(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/guest/outExpress/read',
    method: 'post',
    data
  }
  return request(params)
}
// 保存外协发货快递单信息
export function saveOutExpress(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/guest/outExpress/modify',
    method: 'post',
    data
  }
  return request(params)
}
// 获取计量数据
export function getTakeMetering(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/guest/take_metering/redaData',
    method: 'get',
    params: data
  }
  return request(params)
}
// 计量数据导出
export function takeMeteringExport(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/guest/take_metering/export',
    method: 'post',
    params: data,
    responseType: 'blob'
  }
  return request(params)
}
// 计量数据导入
export function takeMeteringImport(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/guest/take_metering/read',
    method: 'post',
    data
  }
  return request(params)
}
// 计量数据导入
export function takeMeteringSave(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/guest/take_metering/modify',
    method: 'post',
    data
  }
  return request(params)
}
// 安排出库
export function arrangeDelivery(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/takeOutOrder/create_order',
    method: 'post',
    data
  }
  return request(params)
}
// 获取补单出库订单
export function getReplenishmentDeliveryList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/takeOutOrder/searchOrder',
    method: 'get',
    params: data
  }
  return request(params)
}
// 补单出库
export function saveReplenishmentDeliveryList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/takeOutOrder/supplement',
    method: 'post',
    data
  }
  return request(params)
}
