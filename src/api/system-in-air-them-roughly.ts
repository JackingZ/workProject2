import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

// 航空号段列表
export function getSectionList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/avi/section_list',
    method: 'post',
    data
  }
  return request(params)
}

// 获取航空公司
export function getAirlinesList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/org/getOrgList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 获取已导入的航空公司
export function getImportAirlinesList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/avi/find_section',
    method: 'post'
  }
  return request(params)
}

// 导入单号
export function importFile(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/avi/e',
    method: 'post',
    data,
    headers: {
      'content-type': 'multipart/form-data'
    }
  }
  return request(params)
}

// 分配
export function distribution(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/avi/distribution',
    method: 'post',
    data
  }
  return request(params)
}

// 获取操作日志
export function getLogList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/avi/log',
    method: 'post',
    data
  }
  return request(params)
}

// 根据航空公司获取已分配号段的客户
export function getCustomerList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/avi/customer_list',
    method: 'post',
    params: data
  }
  return request(params)
}

// 根据客户获取已分配号段
export function getSectionListByCustomer(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/avi/customer_details',
    method: 'post',
    data
  }
  return request(params)
}

// 回收客户号段
export function recovery(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/avi/recovery',
    method: 'post',
    data
  }
  return request(params)
}
