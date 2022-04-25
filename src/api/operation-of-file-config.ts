import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'
interface FileConfigParams {
  countryCode: string
  countryName: string
  fileDesc: string
  fileExt: number
  fileName: string
  fileType: string
  ifAudit: number
  ifNeed: number
  moduleCode: string
  moduleName: string
  typeCode: number
  createTime?: string
  delFlag?: number
  id?: number
}
// 获取列表数据
export function loadData(data: {
  model: any
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/fc/page',
    method: 'post',
    data
  }
  return request(params)
}

// 获取模块数据
export function getModeList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/fc/modules',
    method: 'get'
  }
  return request(params)
}

// 获取文件类别数据
export function getTypeList(data: {
  moduleId: number | string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/fc/types',
    method: 'get',
    params: data
  }
  return request(params)
}

// 删除接口
export function deleteFileConfig(data: {
  id: number | string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/fc/delete',
    method: 'post',
    params: data
  }
  return request(params)
}

// 新增
export function save(data: FileConfigParams): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/fc/save',
    method: 'post',
    data
  }
  return request(params)
}

// 修改
export function edit(data: FileConfigParams): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/fc/update',
    method: 'post',
    data
  }
  return request(params)
}

// 获取文件名称列表接口
export function getFileNameList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/dict/item/type',
    method: 'get',
    params: data
  }
  return request(params)
}
