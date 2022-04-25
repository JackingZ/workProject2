import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'
// import qs from 'qs'

type snu = string | number | undefined

export interface ParamRequest {
  countryId: snu,
  countryName: snu,
  name: snu,
  remark: snu,
  states: any
  [propName: string]: any
}

export function getFiscalList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/fisCal/get',
    method: 'post',
    data
  }
  return request(params)
}

export function getAgentList(data: {
  page: number
  size: number
  parentId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/agent/getAgentList',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getBscList(data: any): AxiosPromise<any> {
  const { page, size, ...obj } = data
  const params: AxiosRequestConfig = {
    url: '/cfg/bs/getBsList',
    method: 'post',
    data: {
      page,
      size,
      model: {
        ...obj
      }
    }
  }
  return request(params)
}

export function getBsTransList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/bs/getBsTransList',
    method: 'post',
    data
  }
  return request(params)
}

export function getDeliveryList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/sales_plan/plan_list',
    method: 'post',
    data
  }
  return request(params)
}

export function saveDelivery(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/sales_plan/save',
    method: 'post',
    data
  }
  return request(params)
}

export function deleteDelivery(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/sales_plan/delete',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getCountryList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCountryList',
    method: 'get'
  }
  return request(params)
}

export function getWordsList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/dict/item/type',
    method: 'get',
    params: data
  }
  return request(params)
}
