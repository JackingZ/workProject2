import request from '@/utils/request'
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios'
// 查询
export function getChargeList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/measure/getMeasureList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 修改
export function saveCharge(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/measure/saveMeasure',
    method: 'post',
    data
  }
  return request(params)
}

// 删除货币
export function deleteCharge(id: string): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/measure/deleteMeasure',
    method: 'delete',
    params: {
      id
    }
  }
  return request(params)
}

export function getServiceSubtypeList(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceSubtypeList',
    method: 'get',
    params: data
  }
  return request(params)
}
