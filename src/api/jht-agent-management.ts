import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | undefined | number
// 获取国家列表
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

// 查询代理商列表
export function getAgentList(data: {
  page: number
  size: number
  parentId: string
  [propName: string]: snu
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/agent/getAgentList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 删除代理商
export function deleteAgent(id: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/agent/deleteAgent',
    method: 'delete',
    params: {
      id
    }
  }
  return request(params)
}

// 保存代理商
export function saveAgent(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/agent/saveAgent',
    method: 'post',
    data
  }
  return request(params)
}

// 查询代理商详情
export function getAgent(id: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/agent/getAgent',
    method: 'get',
    params: {
      id
    }
  }
  return request(params)
}
// 启用/禁用代理商
export function changeStatus(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/agent/changeStatus',
    method: 'post',
    params: data
  }
  return request(params)
}

export function getAgentRelatedPersonList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/agent/getStaffList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询用户列表
export function getUserList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/user/user4position',
    method: 'post',
    data
  }
  return request(params)
}

// 保存关联人员
export function saveAgentRelatedPerson(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/agent/saveStaff',
    method: 'post',
    data
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
