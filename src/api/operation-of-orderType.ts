import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

// 查询下单类型列表
export function getOrderTypeList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/ordertype/getOrderTypeList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 添加/编辑保存关联增值附加服务
export function saveOrderType(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/ordertype/saveOrderService',
    method: 'post',
    data
  }
  return request(params)
}
// 保存服务名称
export function updateOrderType(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/ordertype/updateOrderType',
    method: 'post',
    data
  }
  return request(params)
}
// 删除关联增值附加服务
export function deleteOrderType(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/ordertype/deleteOrderService',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 查询关联增值附加服务
export function getServiceList(data: {
  orderTypeId: string,
  page: number,
  size: number,
  type: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/ordertype/getOrderServiceList',
    method: 'get',
    params: data
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

// 查询附加服务
export function getAdditionList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/ordertype/getAdditionList',
    method: 'get'
  }
  return request(params)
}

// 查询成本项目类别列表
export function getAddedList(data: {
  serviceTypeId: string
  costTypes: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/costitem/getCostitemSimpleList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 获取服务名称
// 专线
export function getLscComplicatedList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/condition',
    method: 'post',
    data
  }
  return request(params)
}
// 仓储
export function getSscList(data: {
  page: number
  size: number
  custId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ssc/getSscList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 卡派
export function getKscList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ksc/getKscList',
    method: 'get',
    data
  }
  return request(params)
}
// 快递
export function getEscList(data: {
  page: number
  size: number
  custId: string
}): AxiosPromise<any> {
  const { page, size, ...reqData } = data
  const params: AxiosRequestConfig = {
    url: '/cfg/esc/getEscList',
    method: 'post',
    data: {
      model: {
        ...reqData
      },
      page,
      size
    }
  }
  return request(params)
}
// 报关
export function getCscList(data: {
  page: number
  size: number
  custId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/csc/getCscList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 拖车
export function getTscList(data: {
  page: number
  size: number
  custId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/tsc/getTscList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 订舱
export function getBscList(data: {
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
