import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

// 查询列表
export function getProductList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/product/get_all_data',
    method: 'post',
    data
  }
  return request(params)
}

export function saveProduct(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/product/save',
    method: 'post',
    data
  }
  return request(params)
}
export function getCost(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/product/get_price',
    method: 'get',
    params: data
  }
  return request(params)
}
export function saveCost(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/product/save_price',
    method: 'post',
    data
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

export function deleteProduct(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '',
    method: 'delete',
    params: data
  }
  return request(params)
}
