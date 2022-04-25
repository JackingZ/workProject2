import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

// 查询着陆页
export function getPages(data: {
  custId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/page/getPages',
    method: 'get',
    params: data
  }
  return request(params)
}

// 保存着陆页
export function savePage(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/page/savePage',
    method: 'post',
    data
  }
  return request(params)
}
