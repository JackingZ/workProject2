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

// 对外服务
export function getBscList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/bs/getBsList',
    method: 'post',
    data
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
export function getPriceList(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/booking/getPriceBookList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 聚货通查看供应商的报价分页
export function getSupplierPriceList(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/booking/page',
    method: 'post',
    data
  }
  return request(params)
}
export function getPriceById(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/booking/getPriceBook',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getEffectiveBook(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/booking/getEffectiveBook',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getHistoryPrice(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/booking/getHistory',
    method: 'get',
    params: data
  }
  return request(params)
}

// 保存价格
export function savePrice(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/booking/savePriceBook',
    method: 'post',
    data
  }
  return request(params)
}
export function deletePrice(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/booking/deletePriceBook',
    method: 'delete',
    params: data
  }
  return request(params)
}
// 审核价格
export function checkPrice(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/booking/audit',
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

export function savePriceAgent(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/booking/addSpecialCust',
    method: 'post',
    data
  }
  return request(params)
}

export function getPriceConfig(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/axis/getAxisSet',
    method: 'get',
    params: data
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
export function getAviationList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/aviation/page',
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

// 查询订舱服务供应商列表
export function getBsTransList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/bs/getBsTransList',
    method: 'post',
    data
  }
  return request(params)
}

export function getStandardPeriod(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/booking/getStandardPeriod',
    method: 'get',
    params: data
  }
  return request(params)
}

// 聚货通获取供应商报价
export function getSupplier(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/booking/supplier',
    method: 'get',
    params: data
  }
  return request(params)
}

// 报价失效
export function invalidPrice(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/booking/doExpire',
    method: 'get',
    params: data
  }
  return request(params)
}
