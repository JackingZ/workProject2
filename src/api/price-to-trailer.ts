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

// 获取某个国家的州/省
export function getStateByCountry(countryId: string | number): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getStateByCountry',
    method: 'get',
    params: {
      countryId
    }
  }
  return request(params)
}
// 获取某个州/省的所有城市
export function getCityByState(stateId: string | number): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCityByState',
    method: 'get',
    params: {
      stateId
    }
  }
  return request(params)
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
export function getCustTypeList(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/queryAgents',
    method: 'post',
    data
  }
  return request(params)
}

// 获取服务
export function getTrailerServeList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/tsc/getTscList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 获取报价列表
export function getPriceList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/trailer/page',
    method: 'post',
    data
  }
  return request(params)
}

// 聚货通查看供应商的报价分页
export function getSupplierPriceList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/trailer/page1',
    method: 'post',
    data
  }
  return request(params)
}

// 添加服务报价
export function addPrice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/trailer/add',
    method: 'post',
    data
  }
  return request(params)
}

// 编辑服务报价
export function editPrice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/trailer/update',
    method: 'post',
    data
  }
  return request(params)
}
// 删除服务报价
export function delPrice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/trailer/del',
    method: 'delete',
    params: data
  }
  return request(params)
}
// 获取标准报价
export function getRefStandardPrice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/trailer/refStandard',
    method: 'post',
    data
  }
  return request(params)
}
// 查看上级报价
export function getSuperiorPrice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/trailer/superior',
    method: 'post',
    data
  }
  return request(params)
}
// 审核
export function auditPrice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/trailer/review',
    method: 'post',
    data
  }
  return request(params)
}
// 获取历史版本列表
export function getHistoryPriceList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/trailer/history',
    method: 'get',
    params: data
  }
  return request(params)
}
// 获取历史版本信息
export function getHistoryPrice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/trailer/history/get',
    method: 'get',
    params: data
  }
  return request(params)
}

// 报价失效
export function invalidPrice(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/trailer/doExpire',
    method: 'get',
    params: data
  }
  return request(params)
}
