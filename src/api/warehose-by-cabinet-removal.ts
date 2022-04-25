import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

export function getTaskList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/removal/task_page',
    method: 'post',
    data
  }
  return request(params)
}
export function getTaskDetails(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/removal/task_page_details',
    method: 'post',
    data
  }
  return request(params)
}
export function saveTaskDetails(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/removal/details_save',
    method: 'post',
    data
  }
  return request(params)
}
export function addRemoval(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/removal/scan_add',
    method: 'get',
    params: data
  }
  return request(params)
}
export function auditRemoval(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/removal/details_audit',
    method: 'post',
    data
  }
  return request(params)
}
