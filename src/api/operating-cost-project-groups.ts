import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

export interface ICostItem {
  alias: snu
  category: snu
  id: snu
  invoice: snu
  name: snu
  remark: snu
  services: snu
  type: snu
  um: snu
  [propName: string]: snu
}

// 查询成本组列表
export function getCostgroupList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/costgroup/getCostgroupList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 添加/编辑成本组,编辑时必须提供ID
export function saveCostgroup(data: ICostItem): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/costgroup/saveCostgroup',
    method: 'post',
    data
  }
  return request(params)
}

// 编辑项目组成员
export function saveCostItems(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/costgroup/saveCostmember',
    method: 'post',
    data
  }
  return request(params)
}

// 删除成本组
export function deleteCostgroup(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/costgroup/deleteCostgroup',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 查询成本组成员项目列表
export function getCostmemberList(data: {
  costgroupId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/costgroup/getCostmemberList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 查询货币列表
export function getCurrencyList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/currency/getCurrencyList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询成本项目列表
export function getCostList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/costitem/getCostitemList',
    method: 'get',
    params: data
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
