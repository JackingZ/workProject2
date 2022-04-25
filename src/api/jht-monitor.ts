import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

export function getDashboardCountry(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/report/dashboard/countriesInDashboard',
    method: 'get'
  }
  return request(params)
}
export function getDashboardExpress(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/report/dashboard/expressesInDashboard',
    method: 'get'
  }
  return request(params)
}
export function getDashboardWarehouse(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/report/dashboard/warehousesInDashboard',
    method: 'get'
  }
  return request(params)
}
export function getDashboardFba(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/report/dashboard/fbaCodesInDashboard',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getDashboardGroup(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/report/dashboard/groupsInDashboard',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getDashboardOrderBySo(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/report/dashboard/getDashboardQueryBySo',
    method: 'post',
    data
  }
  return request(params)
}

export function getDashboardOrderDetail(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/report/dashboard/getDashboardQueryDetail',
    method: 'post',
    data
  }
  return request(params)
}

export function getDashboardContain(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/report/dashboard/getDashboardQueryResult',
    method: 'post',
    data
  }
  return request(params)
}

export function saveDashboardLoad(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/report/dashboard/manualLoad',
    method: 'post',
    data
  }
  return request(params)
}

export function getDashboardCabinetList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/report/dashboard/getBookingContainers',
    method: 'post',
    data
  }
  return request(params)
}

export function getDashboardOrderList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/report/dashboard/orderToAssign',
    method: 'post',
    data
  }
  return request(params)
}

export function getDashboardTransit(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/report/dashboard/getLockedOrders',
    method: 'post',
    data
  }
  return request(params)
}
