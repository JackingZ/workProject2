import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

export interface IPortRequest {
  hsCode?: snu
  hsName?: snu
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

// 查询机场港口列表
export function getPortList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/ports/getPortList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 新增机场港口
export function savePort(data: IPortRequest): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/ports/savePort',
    method: 'post',
    data
  }
  return request(params)
}

// 删除港口
export function deletePort(data: { id: snu }): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/ports/deletePort',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 获取所有国家列表
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
// 获取某个城市的所有区县
export function getCountyByCity(cityId: string | number): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCountyByCity',
    method: 'get',
    params: {
      cityId
    }
  }
  return request(params)
}

// 查询海关列表
export function getOrgList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/org/getOrgList',
    method: 'get',
    params: data
  }
  return request(params)
}
