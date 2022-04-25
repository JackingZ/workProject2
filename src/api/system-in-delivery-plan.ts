import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

// 查询列表数据
export function getDeliveryList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/plan/plan_list',
    method: 'post',
    data
  }
  return request(params)
}
export function getPlanById(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/plan/get',
    method: 'get',
    params: data
  }
  return request(params)
}
// 新增编辑保存
export function saveDelivery(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/plan/save',
    method: 'post',
    data
  }
  return request(params)
}
export function saveBooking(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/plan/add_booking',
    method: 'post',
    data
  }
  return request(params)
}
export function deleteDelivery(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/plan/delete',
    method: 'get',
    params: data
  }
  return request(params)
}
export function cancelDelivery(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/plan/enable',
    method: 'get',
    params: data
  }
  return request(params)
}

// 获取团购列表
export function getGroupsList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '',
    method: 'post',
    data
  }
  return request(params)
}

// 人员
export function getPersionList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getBscList(data: any): AxiosPromise<any> {
  const { page, size, ...obj } = data
  const params: AxiosRequestConfig = {
    url: '/cfg/bs/getBsList',
    method: 'post',
    data: {
      page,
      size,
      model: {
        ...obj
      }
    }
  }
  return request(params)
}
// 代码
export function getFbastoreList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/fbastore/getFbastoreList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 柜型
export function getCabinetList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/container/getContainerList',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getVehicleTypeList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/vehicletype/getVehicleTypeList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 航空板
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

export function getCountryList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCountryList',
    method: 'get'
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

export function getSupplierList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/getCustTypeList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 联系人通知人接口
export function getBookcList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/bookc/getBookcList',
    method: 'get',
    params: data
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

// 查询订单列表
export function getOrderList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/booking/get_order_by_plan',
    method: 'post',
    data
  }
  return request(params)
}

// 查询所有仓储
export function getWarehouseAllList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/warehouse/selectSupplyList',
    method: 'get'
  }
  return request(params)
}

export function getLscGroupList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/getLscGroupList',
    method: 'post',
    data
  }
  return request(params)
}
