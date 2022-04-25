import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

export interface RequestParams {
  name: snu // 机构名称
  alias: snu // 英文名称
  code: snu // 全球代码
  type: snu // 机构类型
  countryId: snu // 国家
  stateId: snu // 州/省
  url: snu // 链接网址
  [propName: string]: any
}

// 查询所有国家接口
export function getCountryList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCountryList',
    method: 'get'
  }
  return request(params)
}

// 服务大类列表
export function getServiceTypeList(data: {
  custType: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceTypeList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 服务小类列表
export function getServiceSubtypeList(data: {
  typeId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceSubtypeList',
    method: 'get',
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

// 获取企业类别配置明细
export function getCustTypeDtlList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/getCustTypeDtlList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 获取默认服务类别配置模板
export function getTypeTemplateList(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/getTypeTemplateList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 保存默认服务类别配置模板
export function saveTypeTemplateList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/saveTypeTemplateList',
    method: 'post',
    data
  }
  return request(params)
}

// 保存企业服务类型配置
export function saveCustType(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/saveCustType',
    method: 'post',
    data
  }
  return request(params)
}

// 审核企业服务类型配置
export function auditCustType(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/audit',
    method: 'post',
    data
  }
  return request(params)
}
