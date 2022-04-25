import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

export interface IContainerRequest {
  name: snu, // 货柜名称
  alias: snu, // 英文名称
  length: snu, // 车长
  width: snu, // 宽长
  height: snu, // 车高
  volume: snu, // 装载体积
  loadLimit: snu, // 载重
  seats: snu, // 座位数
  [propName: string]: any
}

// 查询列表
export function getAviationList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/aviation/page',
    method: 'post',
    data
  }
  return request(params)
}
// 新增修改
export function saveAviation(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/aviation/save',
    method: 'post',
    data
  }
  return request(params)
}

export function deleteAviation(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/aviation/delete',
    method: 'post',
    params: data
  }
  return request(params)
}
