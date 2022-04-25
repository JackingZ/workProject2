import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

export interface ParamsRequest {
  name: snu
  alias: snu
  code: snu
  [propName: string]: any
}

// 查询列表
export function getCustomsList(data: {
  parentId: number
  [propName: string]: snu
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/coding/find_node',
    method: 'post',
    data
  }
  return request(params)
}

export function getRateCountry(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/coding/get_country',
    method: 'post',
    data
  }
  return request(params)
}
export function setRateCountry(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/coding/save_detail',
    method: 'post',
    data
  }
  return request(params)
}

// 编辑海关编码
export function saveCustoms(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/coding/save',
    method: 'post',
    data
  }
  return request(params)
}
// 删除海关编码
export function deteleCustoms(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/coding/del',
    method: 'post',
    params: data
  }
  return request(params)
}
// 修改状态
export function changeStatus(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/coding/enable',
    method: 'post',
    data
  }
  return request(params)
}

// 获取所有国家列表
export function getCountryList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCountryList',
    method: 'get'
  }
  return request(params)
}

// 批量导入
export function setBulkImport(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/coding/import',
    method: 'post',
    data
  }
  return request(params)
}

// --------------------------------------- 报关要素 ----------------------------------------------------

export function getFactorList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/essential/page',
    method: 'post',
    data
  }
  return request(params)
}

export function saveFactor(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/essential/save',
    method: 'post',
    data
  }
  return request(params)
}
export function copyFactor(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/essential/copy_custom',
    method: 'post',
    data
  }
  return request(params)
}

export function getCodesById(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/essential/get_custom',
    method: 'get',
    params: data
  }
  return request(params)
}

export function saveCodes(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/essential/save_custom',
    method: 'post',
    data
  }
  return request(params)
}

export function changeFactorStatus(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/essential/enable',
    method: 'post',
    params: data
  }
  return request(params)
}
