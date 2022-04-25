import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

// 本币外币转换列表
export function getExchangeList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/exchange/getExchangeList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 汇率记录列表
export function getExRateList(data: {
  page: number
  size: number
  exchangeId: snu
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/exchange/getExRateList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询货币列表
export function getCurrencyList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/currency/getCurrencyList',
    method: 'get',
    params: {
      page: 1,
      size: 9999
    }
  }
  return request(params)
}

// 添加/修改本币外币转换,编辑时必须提供ID
export function saveExchange(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/exchange/saveExchange',
    method: 'post',
    data
  }
  return request(params)
}

// 添加/修改货币汇率
export function saveExRate(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/exchange/saveExRate',
    method: 'post',
    data
  }
  return request(params)
}

// 删除本币外币转换
export function deleteExchange(data: { id: snu }): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/exchange/deleteExchange',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 删除汇率
export function deleteExRate(data: { id: snu }): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/exchange/deleteExRate',
    method: 'delete',
    params: data
  }
  return request(params)
}
