import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

// 根据父项ID获取下级洲/地区/国家
export function getCountryByParent(parentId: string | number): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCountryByParent',
    method: 'get',
    params: {
      parentId
    }
  }
  return request(params)
}
export function getCountryByName(name: string | number): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/search_by_name',
    method: 'get',
    params: {
      name
    }
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

// 获取某个州/省的所有城市
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

// 更新行政区域
export function updateArea(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/updateArea',
    method: 'post',
    data
  }
  return request(params)
}

// 新增保存行政区域
export function addArea(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/addArea',
    method: 'post',
    data
  }
  return request(params)
}
export function addBatchCity(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/batch_add_city',
    method: 'post',
    data
  }
  return request(params)
}

// 删除行政区域
export function deleteContainer(id: any, level: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/deleteContainer',
    method: 'delete',
    params: {
      id,
      level
    }
  }
  return request(params)
}

// 查询国家省州
export function getArea(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getArea',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询街道
export function getStreet(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getStreet',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getCityName(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/search_by_name',
    method: 'get',
    params: data
  }
  return request(params)
}
