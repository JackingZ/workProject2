import request from '@/utils/request'
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios'
export interface Form {
  alias: string
  createTime?: string
  exRate?: number
  id?: string
  name: string
  sign: string
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

// 新增货币
export function addCurrency(data: Form): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/currency/addCurrency',
    method: 'post',
    data
  }
  return request(params)
}

// 修改货币
export function saveCurrency(data: Form): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/currency/updateCurrency',
    method: 'post',
    data
  }
  return request(params)
}

// 删除货币
export function deleteCurrency(id: string): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/currency/deleteCurrency',
    method: 'delete',
    params: {
      id
    }
  }
  return request(params)
}
// 查询货币汇率记录列表
export function getExRateList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/currency/getExRateList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 添加/修改货币汇率
export function saveExRate(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/currency/saveExRate',
    method: 'post',
    data
  }
  return request(params)
}

// 删除汇率
export function deleteExRate(id: string): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/currency/deleteExRate',
    method: 'delete',
    params: {
      id
    }
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
