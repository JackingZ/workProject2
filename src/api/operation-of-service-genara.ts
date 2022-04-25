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

// 查询服务大类
export function getServiceTypeConfigList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceTypeConfigList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询服务小类
export function getServiceSubtypeConfigList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceSubtypeConfigList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 添加编辑服务大类
export function saveType(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/saveType',
    method: 'post',
    data
  }
  return request(params)
}

// 添加编辑服务小类
export function saveSubtype(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/saveSubtype',
    method: 'post',
    data
  }
  return request(params)
}

// 删除服务小类
export function deleteSubtype(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/deleteSubtype',
    method: 'delete',
    params: data
  }
  return request(params)
}
