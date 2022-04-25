import request from '@/utils/request'
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios'

interface Driver {
  custId: string
  page: number
  size: number
  name?: string
  status?: string
}

type snu = string | number | undefined

// 查询司机列表
export function getDriverList(data: Driver): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/driver/getDriverList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 启用禁用司机
export function changeStatus(data: {
  id: string
  status: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/driver/changeStatus',
    method: 'post',
    params: data
  }
  return request(params)
}

// 删除司机
export function deleteDriver(id: string): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/driver/deleteDriver',
    method: 'delete',
    params: {
      id
    }
  }
  return request(params)
}

// 新增修改司机
export function saveDriver(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/driver/saveDriver',
    method: 'post',
    data
  }
  return request(params)
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

// 查询用户列表
export function getUserList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/user/user4position',
    method: 'post',
    data
  }
  return request(params)
}

// 查询用户列表
export function getVehicleList(data: {
  custId: string
  page: number
  size: number
  [propName: string]: any
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/vehicle/getVehicleList',
    method: 'get',
    params: data
  }
  return request(params)
}
