import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

// 获取列表数据
export function getTableData(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/examine/getExamineList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 删除接口
export function deleteExamineConfig(data: {
  id: number | string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/examine/deleteExamine',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 新增编辑
export function saveExamine(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/examine/saveExamine',
    method: 'post',
    data
  }
  return request(params)
}

// 获取单一接口
export function getSingleById(data: {
  id: number | string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/examine/getExamine',
    method: 'get',
    params: data
  }
  return request(params)
}
