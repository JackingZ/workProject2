import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

// 查询
export function getStatusConfig(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/status/page',
    method: 'post',
    data
  }
  return request(params)
}

// 保存
export function saveConfig(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/status/permit',
    method: 'post',
    data
  }
  return request(params)
}

// 保存
export function saveDesc(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/status/desc',
    method: 'post',
    data
  }
  return request(params)
}

// 服务大类列表
export function getServiceTypeList(data: {
  custType: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceTypeList',
    method: 'get',
    params: data
  }
  return request(params)
}
