import request from '@/utils/request'
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios'

// 查询机构类别
export function getOrgType(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/mock-server/auth/organization/getType',
    method: 'get'
  }
  return axios(params)
}
