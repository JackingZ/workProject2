import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

export interface Form {
  [propName: string]: any
}

// 查询供应商接口
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

// 查询岗位设置
export function getPostList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/post/getPostList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 岗位
export function addPost(data: Form): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/post/add',
    method: 'post',
    data
  }
  return request(params)
}
export function editPost(data: Form): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/post/edit',
    method: 'post',
    data
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

// 查询岗位提成列表
export function getCommissionList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/commission/getCommissionList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询单一岗位提成
export function getCommission(data: {
  custId: string,
  postId: string,
  version: snu
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/commission/getCommission',
    method: 'get',
    params: data
  }
  return request(params)
}

// 获取提成版本列表any
export function getVersionList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/commission/getVersionList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 编辑岗位提成
export function saveCommission(data: Form): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/commission/saveCommission',
    method: 'post',
    data
  }
  return request(params)
}

// 删除岗位提成
export function deteleCommission(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/commission/deteleCommission',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 字典
export function getWordsList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/dict/item/type',
    method: 'get',
    params: data
  }
  return request(params)
}
