import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

export interface IOrganRequest {
  name: snu // 机构名称
  alias: snu // 英文名称
  code: snu // 全球代码
  type: snu // 机构类型
  countryId: snu // 国家
  stateId: snu // 州/省
  url: snu // 链接网址
  [propName: string]: any
}

// 查询服务机构列表数据
export function getSeviceOrganList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/org/getOrgList',
    method: 'get',
    params: data
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

export function deleteOrgan(data: object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/org/deleteOrg',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 新增修改机构
export function saveOrgan(data: IOrganRequest): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/org/saveOrg',
    method: 'post',
    data
  }
  return request(params)
}
