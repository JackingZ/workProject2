import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

// -------------------业务配置订舱服务-----------------------

// 保存编辑
export function saveBs(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/bs/addBs',
    method: 'post',
    data
  }
  return request(params)
}
export function getByIds(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/bs/getByIds',
    method: 'post',
    data
  }
  return request(params)
}

// 查询所有国家接口
export function getCountryList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCountryList',
    method: 'get'
  }
  return request(params)
}
// 查询机场港口地址代码列表
export function getPortList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/ports/getPortList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询订舱服务配置列表
export function getBSCList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/bs/getBsList',
    method: 'post',
    data
  }
  return request(params)
}

// 企业服务类别列表
export function getCustTypeList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/getCustTypeList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询订舱服务供应商列表
export function getBsTransList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/bs/getBsTransList',
    method: 'post',
    data
  }
  return request(params)
}

// 修改状态
export function changeBookingStatus(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/bs/changeStatus',
    method: 'post',
    params: data
  }
  return request(params)
}

// 删除
export function delBooking(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/bs/del',
    method: 'get',
    params: data
  }
  return request(params)
}

// 删除订舱服务供应商
export function deleteBsTrans(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/bs/deleteBsTrans',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 更新订舱服务供应商
export function saveBsTrans(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/bs/saveBsTrans',
    method: 'post',
    data
  }
  return request(params)
}

// 更新订舱服务供应商
export function updateBsTrans(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/bs/updateBsTrans',
    method: 'put',
    data
  }
  return request(params)
}

// 查询订舱服务供应商
export function getBsTrans(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/bs/getBsTrans',
    method: 'get',
    params: data
  }
  return request(params)
}

// 保存代理列表
export function saveAgent(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/bs/saveAgent',
    method: 'post',
    data
  }
  return request(params)
}

// 查询代理商列表
export function getAssociatedAgentList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/bs/getAgentList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 字典
export function getWordsList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/dict/item/type',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getPriceConfig(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/axis/getAxisSet',
    method: 'get',
    params: data
  }
  return request(params)
}

export function savePriceConfig(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/axis/saveAxis',
    method: 'post',
    data
  }
  return request(params)
}

// 查询货柜列表
export function getContainerList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/container/getContainerList',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getAviationList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/aviation/page',
    method: 'post',
    data
  }
  return request(params)
}
