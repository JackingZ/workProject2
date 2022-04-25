/*
 * @Author: your name
 * @Date: 2019-11-26 22:45:15
 * @LastEditTime: 2019-11-27 22:10:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \jht-admin\src\api\domestic-area.ts
 */
import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'
// import qs from 'qs'

type snu = string | number | undefined

export interface IAreaRequest {
  countryId: snu,
  countryName: snu,
  name: snu,
  remark: snu,
  states: any
  [propName: string]: any
}

// 查询国内区域
export function getRegionList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/region/getRegionList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 新增修改国内区域
export function saveRegion(data: IAreaRequest): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/region/saveRegion',
    method: 'post',
    data
  }
  return request(params)
}

// 查询一个国家所有州省
export function queryStateList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getStateByCountry',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询多个州/省的所有城市
export function queryCityList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCityByStates',
    method: 'post',
    data
  }
  return request(params)
}

// 获取城市列表
export function getCityByCountry(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCityByCountry',
    method: 'post',
    data
  }
  return request(params)
}

// fba仓库
export function getFbastoreList(data: {
  countryId: string
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/fbastore/getFbastoreList',
    method: 'get',
    params: data
  }
  return request(params)
}

export function deleteRegion(data: object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/region/deleteRegion',
    method: 'delete',
    params: data
  }
  return request(params)
}
export function deleteAreaType(data: object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area_type/delete',
    method: 'post',
    params: data
  }
  return request(params)
}

export function getAreaTypeList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area_type/page',
    method: 'post',
    data
  }
  return request(params)
}

export function saveAreaType(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area_type/save',
    method: 'post',
    data
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

// 获取某个国家的州/省
export function getStateByCountry(countryId: string | number): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getStateByCountry',
    method: 'get',
    params: {
      countryId
    }
  }
  return request(params)
}
// 获取某个州/省的所有城市
export function getCityByState(stateId: string | number): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCityByState',
    method: 'get',
    params: {
      stateId
    }
  }
  return request(params)
}
