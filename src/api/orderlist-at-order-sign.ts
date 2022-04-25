import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

export function signOrder(data: any) {
  const params: AxiosRequestConfig = {
    url: '/orders/fullorder/save_file_status',
    method: 'post',
    data
  }
  return request(params)
}
export function uploadFile(data: any) {
  const params: AxiosRequestConfig = {
    url: '/wms/aliyun/oss/upload',
    method: 'post',
    data
  }
  return request(params)
}
export function deleteFile(data: any) {
  const params: AxiosRequestConfig = {
    url: '/wms/aliyun/oss/del',
    method: 'post',
    data
  }
  return request(params)
}
