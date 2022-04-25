import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

// 查询报表定义列表
export function getReportList(data: {
  model: object,
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/report/r/page',
    method: 'post',
    data
  }
  return request(params)
}
// 添加/编辑报表
export function saveReport(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/report/r/up',
    method: 'post',
    data
  }
  return request(params)
}
// 删除报表
export function deleteReport(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/report/r/del',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 启用禁用
export function changeReportStatus(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/report/r/on',
    method: 'get',
    params: data
  }
  return request(params)
}

// 保存代理商
export function saveReportAgent(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/report/r/un',
    method: 'post',
    data
  }
  return request(params)
}
// 查询代理商列表
export function getAgentList(data: {
  page: number
  size: number
  parentId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/agent/getAgentList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询关联代理商
export function getAgentById(data: {
  reportId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/report/r/agent',
    method: 'get',
    params: data
  }
  return request(params)
}
