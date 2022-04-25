import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

// 获取列表
export function getGroupList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/sale/getSaleGroupList',
    method: 'post',
    data
  }
  return request(params)
}
// 保存组
export function saveGroup(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/sale/saveSaleGroup',
    method: 'post',
    data
  }
  return request(params)
}
export function getGroupItems(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/sale/getSaleGroupById',
    method: 'get',
    params: data
  }
  return request(params)
}
export function setGroupStatus(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/sale/setSaleGroupStatus',
    method: 'post',
    params: data
  }
  return request(params)
}
// 删除
export function deleteGroup(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/sale/deleteSaleGroup',
    method: 'delete',
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

export function getLscComplicatedList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/condition',
    method: 'post',
    data
  }
  return request(params)
}

export function getServiceSubtypeList(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceSubtypeList',
    method: 'GET',
    params: data
  }
  return request(params)
}
