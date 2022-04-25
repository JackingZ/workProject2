/*
 * @Author: your name
 * @Date: 2019-11-26 22:45:15
 * @LastEditTime: 2019-11-27 23:00:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \jht-admin\src\api\domestic-area.ts
 */
import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

export interface IFlightRequest {
  countries: any[], // 国家集合
  name: snu, // 区域名称
  remark: snu, // 备注
  type: snu, // 区域类别
  [propName: string]: any
}

// 查询列表数据
export function getFlightList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/route/getRouteList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 新增修改国际航线
export function saveFlight(data: IFlightRequest): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/route/saveRoute',
    method: 'post',
    data
  }
  return request(params)
}
// 删除数据
export function deleteFlight(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/route/deleteRoute',
    method: 'delete',
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
