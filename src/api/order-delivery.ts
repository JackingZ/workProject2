import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

// 查询所有国家接口
export function getCountryList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/getcountries',
    method: 'get',
    params: data
  }
  return request(params)
}
// 获取业务类型
export function getServiceSubtypeList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceSubtypeList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 获取目的港
export function getPortList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'setting/ports/getPortList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 获取省份
export function getStateByCountry(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getStateByCountry',
    method: 'get',
    params: data
  }
  return request(params)
}
// 获取城市
export function getCityByState(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCityByState',
    method: 'get',
    params: data
  }
  return request(params)
}
// 获取FBA仓库
export function getFbastoreList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/fbastore/getFbastoreList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 获取装货仓库列表
export function getWarehouseList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/warehouse/getWarehouseList',
    method: 'post',
    data
  }
  return request(params)
}

export function getLscComplicatedList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/condition',
    method: 'post',
    data
  }
  return request(params)
}

// 查询订单
export function getOrderList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/split_sheet/query',
    method: 'post',
    data
  }
  return request(params)
}
// 手动添加
export function searchOrderData(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/split_sheet/manual_add',
    method: 'post',
    data
  }
  return request(params)
}
export function getDeliveryOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/split_sheet/delivery_page',
    method: 'post',
    data
  }
  return request(params)
}
export function saveDelivery(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/split_sheet/save_delivery',
    method: 'post',
    data
  }
  return request(params)
}
export function getDeliveryOrderById(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/split_sheet/get',
    method: 'get',
    params: data
  }
  return request(params)
}
// 获取供应商
export function getSupplierList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/supplier/getSupplierList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 获取车型
export function getVehicleTypeList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/vehicletype/getVehicleTypeList',
    method: 'get',
    params: data
  }
  return request(params)
}
