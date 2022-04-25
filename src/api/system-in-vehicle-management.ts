import request from '@/utils/request'
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios'
interface Vehicle {
  custId: string
  page: number
  size: number
  plateNumber?: string
}
// 查询车辆列表
export function getVehicleList(data: Vehicle): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/vehicle/getVehicleList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 启用禁用车辆
export function changeStatus(data: {
  id: string
  status: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/vehicle/changeStatus',
    method: 'post',
    data
  }
  return request(params)
}

// 删除车辆
export function deleteVehicle(id: string): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/vehicle/deleteVehicle',
    method: 'delete',
    params: {
      id
    }
  }
  return request(params)
}

// 新增修改车辆
export function saveVehicle(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/vehicle/saveVehicle',
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

// 获取车型列表接口
export function getVehicleTypeList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/vehicletype/getVehicleTypeList',
    method: 'get',
    params: data
  }
  return request(params)
}
