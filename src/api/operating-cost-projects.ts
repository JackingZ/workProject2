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

// 查询成本项目列表
export function getCostitemList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/costitem/getCostitemList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 添加/编辑成本项目,编辑时必须提供ID
export function saveCostitem(data: ICostItem): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/costitem/saveCostitem',
    method: 'post',
    data
  }
  return request(params)
}
// 删除成本项目
export function deleteCostitem(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/costitem/deleteCostitem',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 服务大类列表
export function getServiceTypeList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceTypeConfigList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询成本项目类别列表
export function getCostitemTypeList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceSubtypeConfigList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询结算单位对应的计量单位
export function getUmBySettlement(data: {
  settlement: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/costitem/getUmBySettlement',
    method: 'get',
    params: data
  }
  return request(params)
}
