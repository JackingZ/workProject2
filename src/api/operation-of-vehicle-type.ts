import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

export interface ICarRequest {
  name: snu, // 车型名称
  alias: snu, // 英文名称
  length: snu, // 车长
  width: snu, // 宽长
  height: snu, // 车高
  volume: snu, // 装载体积
  loadLimit: snu, // 载重
  seats: snu, // 座位数
  [propName: string]: any
}

// 查询车型列表数据
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
// 新增修改车型
export function saveVehicleType(data: ICarRequest): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/vehicletype/saveVehicleType',
    method: 'post',
    data
  }
  return request(params)
}

export function deleteVehicle(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/vehicletype/deleteVehicleType',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 获取国家列表
export function getCountryList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCountryList',
    method: 'get'
  }
  return request(params)
}
