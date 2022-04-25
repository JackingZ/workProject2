import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

// 查询任务单列表
export function getTaskList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/task/getTaskList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 添加/编辑任务单
export function updateTask(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/task/updateTask',
    method: 'post',
    data
  }
  return request(params)
}

// 查询服务大类
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
