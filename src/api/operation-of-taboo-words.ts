import request from '@/utils/request'
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios'
interface Taboo {
  cityId?: string
  countryId?: string
  name?: string
  stateId?: string
  type?: string
  size: number
  page: number
}
export interface Form {
  id: string
  words: any
  degree: string
}

// 查询禁忌词语列表
export function getTabooList(data: Taboo): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/taboo/getTabooList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 添加/修改保存禁忌词语
export function saveTaboo(data: Form): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/taboo/saveTaboo',
    method: 'post',
    data
  }
  return request(params)
}

// 删除禁忌词语
export function deleteTaboo(id: string): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/taboo/deleteTaboo',
    method: 'delete',
    params: {
      id
    }
  }
  return request(params)
}

// 查询国家
export function getCountryList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCountryList',
    method: 'get'
  }
  return request(params)
}

// 根据id查询关联国家
export function getTabooCountryList(id: string): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/taboo/getTabooCountryList',
    method: 'get',
    params: {
      id
    }
  }
  return request(params)
}

// 提交关联国家
export function saveTabooCountry(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/taboo/saveTabooCountry',
    method: 'post',
    data
  }
  return request(params)
}
