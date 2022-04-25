import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

export function getPortList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/ports/getPortList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询供应商列表
export function getSupplierList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/supplier/getSupplierList',
    method: 'get',
    params: data
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

// 查询客户列表
export function getCustomerList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/customer/customer',
    method: 'post',
    data
  }
  return request(params)
}

// 查询报关订单列表
export function getOrderList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/booking/page',
    method: 'post',
    data
  }
  return request(params)
}

export function getOrderDetails(id: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: `/orders/booking/${id}`,
    method: 'get'
  }
  return request(params)
}

export function deleteOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/booking/deleteBookingOrder',
    method: 'delete',
    params: data
  }
  return request(params)
}
export function cancelOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/booking/cancelBookingOrder',
    method: 'post',
    params: data
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

export function saveSupperier(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/booking/assign',
    method: 'post',
    data
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
// 海运铁路信息
export function getSo(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/booking/getBookingSo',
    method: 'get',
    params: data
  }
  return request(params)
}
export function saveSo(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/booking/saveBookingSo',
    method: 'post',
    data
  }
  return request(params)
}
export function getContain(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/booking/getContainerByBookingId',
    method: 'get',
    params: data
  }
  return request(params)
}
export function saveContain(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/booking/saveBookingContainer',
    method: 'post',
    data
  }
  return request(params)
}
export function saveGoods(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/booking/saveBookingGoods',
    method: 'post',
    data
  }
  return request(params)
}
export function getThrow(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/booking/getBookingThrow',
    method: 'get',
    params: data
  }
  return request(params)
}
export function saveThrow(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/booking/saveBookingThrow',
    method: 'post',
    data
  }
  return request(params)
}
export function saveWeight(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/booking/saveBookingWeight',
    method: 'post',
    data
  }
  return request(params)
}
// 空运信息
export function getAir(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/booking/getBookingAir',
    method: 'get',
    params: data
  }
  return request(params)
}
export function saveAir(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/booking/saveBookingAir',
    method: 'post',
    data
  }
  return request(params)
}
export function saveAudit(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/booking/bookingAudit',
    method: 'post',
    data
  }
  return request(params)
}

export function getOrgList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/org/getOrgList',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getContainerList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/container/getContainerList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 海运铁路
export function getOrderStep(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/booking/getBookingStatus',
    method: 'get'
  }
  return request(params)
}
// 空运
export function getAirStep(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/booking/getAirBookingStatus',
    method: 'get'
  }
  return request(params)
}
// 货柜
export function getContainStep(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/booking/getContainerStatus',
    method: 'get'
  }
  return request(params)
}

export function saveOrderStep(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/booking/changeBookingStatus',
    method: 'post',
    data
  }
  return request(params)
}
export function saveContainStep(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/booking/changeContainerStatus',
    method: 'post',
    data
  }
  return request(params)
}

export function getStatusList(data: any): Promise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/booking/getBookingStatus',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getPlanDetail(data: any): Promise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/plan/get',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getBsTransDetail(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/bs/getBsTrans',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getBookByIds(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/bs/getByIds',
    method: 'post',
    data
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
export function getBsTransByPlanId(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/plan/get_service_by_id',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getPut(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/booking/getPickByBookingId',
    method: 'get',
    params: data
  }
  return request(params)
}

export function savePut(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/booking/saveBookingPick',
    method: 'post',
    data
  }
  return request(params)
}

// 获取服务
export function getSubtypeByCustAndType(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/getSubtypeByCustAndType',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getSupperier(data: {
  id: string | number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/bs/getBs',
    method: 'get',
    params: data
  }
  return request(params)
}
