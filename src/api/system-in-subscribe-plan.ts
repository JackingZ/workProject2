import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

export interface IServiceRequest {
  id: snu, // 服务编码
  name: snu, // 服务名称
  type: snu, // 服务类型
  custom: snu, // 出口报关类别
  countryId: snu, // 服务国家
  remark: snu // 备注
  [propName: string]: any
}

// 查询
export function getSubscribeList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/subscribe/getSubscriberList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 保存
export function addSubscribe(data:IServiceRequest): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/subscribe/saveSubscriber',
    method: 'post',
    data
  }
  return request(params)
}

// 删除
export function deleteSubscribe(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/subscribe/deleteSubscriber',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 获取
export function getFlightList(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/route/getRouteList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询fba仓库列表
export function getFbastoreList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/fbastore/getFbastoreList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 保存批量仓库
export function saveFBABatch(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/subscribe/saveSubscriberFbastore',
    method: 'post',
    data
  }
  return request(params)
}
// 保存批量航线
export function saveFlightBatch(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/subscribe/saveSubscriberRoute',
    method: 'post',
    data
  }
  return request(params)
}

export function getSupplierList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/supplier/getSupplierList',
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
