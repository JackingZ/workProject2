import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

export interface IPortRequest {
  countryId: snu
  countryName: snu
  stateId: snu
  stateName: snu
  cityId: snu
  cityName: snu
  name: snu
  alias: snu
  code: snu
  [propName: string]: any
}
// 业务类型
export function getServiceSubtypeList(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceSubtypeList',
    method: 'get',
    params: data
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

// 交货区域
export function getAreaList(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/getDeliveryCity',
    method: 'get',
    params: data
  }
  return request(params)
}

// 对外服务
export function getWarehouseList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/warehouse/c',
    method: 'get'
  }
  return request(params)
}

// 查询货币列表
export function geCurrencyList(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/currency/getCurrencyList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 企业服务类别列表
export function getCustTypeList(data?: {
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
// 查询价格
export function getPriceList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/warehouse/page',
    method: 'post',
    data
  }
  return request(params)
}
// 聚货通查看供应商的报价分页
export function getSupplierPriceList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/warehouse/page1',
    method: 'post',
    data
  }
  return request(params)
}
export function getPriceById(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/warehouse/history/get',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getEffectiveBook(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/warehouse/superior',
    method: 'post',
    data
  }
  return request(params)
}
export function getHistoryPrice(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/warehouse/history',
    method: 'get',
    params: data
  }
  return request(params)
}

// 保存价格
export function addPrice(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/warehouse/add',
    method: 'post',
    data
  }
  return request(params)
}
export function savePrice(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/warehouse/update',
    method: 'post',
    data
  }
  return request(params)
}
export function deletePrice(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/warehouse/del',
    method: 'delete',
    params: data
  }
  return request(params)
}
// 审核价格
export function checkPrice(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/warehouse/review',
    method: 'post',
    data
  }
  return request(params)
}

// 查询代理商
export function getAgentList(data: {
  page: number,
  size: number,
  parentId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/agent/getAgentList',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getWarehouseServer(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/warehouse/server/cat',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getWarehouseId(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/warehouse/getWarehouse',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getPriceConfig(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/r/axis',
    method: 'post',
    data
  }
  return request(params)
}

export function savePriceConfig(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/axis/saveAxis',
    method: 'post',
    data
  }
  return request(params)
}

// 查询货柜列表
export function getContainerList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/container/getContainerList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询
export function getChargeList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/measure/getMeasureList',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getStandardPeriod(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/warehouse/refStandard',
    method: 'post',
    data
  }
  return request(params)
}

// 报价失效
export function invalidPrice(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/warehouse/doExpire',
    method: 'get',
    params: data
  }
  return request(params)
}
