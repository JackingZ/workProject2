import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

// 查询接口列表数据
export function getExpressPortList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/express/web/expressparam/list',
    method: 'post',
    data
  }
  return request(params)
}
//  添加快递服务
export function addExpressPort(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/express/web/expressparam/save',
    method: 'post',
    data
  }
  return request(params)
}
// 更新快递服务
export function updateExpressPort(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/express/web/expressparam/update',
    method: 'post',
    data
  }
  return request(params)
}

// 查询详情
export function getExpressPortById(id: string): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: `/express/web/expressparam/info/${id}`,
    method: 'get'
  }
  return request(params)
}
// 删除快递服务
export function deleteExpressPort(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/express/web/expressparam/delete',
    method: 'post',
    data
  }
  return request(params)
}
// 切换状态
export function changeExpressStatus(data: {
  id: string | number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/express/web/expressparam/ifenable',
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

// 查询快递公司列表
export function getExpressCompany(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/org/getOrgList',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getRateList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '',
    method: 'get',
    data
  }
  return request(params)
}

// 更新快递服务
export function updateRate(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '',
    method: 'post',
    data
  }
  return request(params)
}
// 删除快递服务
export function deleteRate(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '',
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

// 查询货币列表
export function geCurrencyList(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/currency/getCurrencyList',
    method: 'get',
    params: data
  }
  return request(params)
}
