import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

export interface IPortRequest {
  countryId: snu
  countryName: snu
  stateId: snu
  stateName: snu
  cityId: snu
  cityName: snu
  name: snu
  alias: snu
  code: snu
  [propName: string]: any
}

// 查询pda列表
export function getPDAList(data: {
  page: number,
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/apk/page',
    method: 'post',
    data
  }
  return request(params)
}

export function getSwitch(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/apk/switch',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getLoad(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/apk/download',
    method: 'get',
    params: data,
    responseType: 'blob'
  }
  return request(params)
}

// 新增编辑pda
export function savePDA(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/apk/save',
    method: 'post',
    data
  }
  return request(params)
}

// 删除
export function deletePDA(data: { id: snu }): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/apk/del',
    method: 'get',
    params: data
  }
  return request(params)
}

// 文件上传
export function uploadFile(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/aliyun/oss/upload',
    method: 'post',
    data
  }
  return request(params)
}
export function delFile(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/aliyun/oss/del',
    method: 'post',
    data
  }
  return request(params)
}
