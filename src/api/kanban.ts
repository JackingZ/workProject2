import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

// 获取看板数据
export function getDashboardData(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/dashboard/dashboardQuery',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查看FBA订单
export function getDashboardOrderByCode(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/dashboard/getDashboardOrderByCode',
    method: 'post',
    data
  }
  return request(params)
}

// 查看计划订单
export function getDashboardOrderBySo(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/dashboard/getDashboardOrderBySo',
    method: 'post',
    data
  }
  return request(params)
}
// 根据货物所在仓汇总
export function getDashboardOrderByWarehouseSummary(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/dashboard/warehouseSummary',
    method: 'post',
    data
  }
  return request(params)
}

// 查看在途订单
export function getDashboardTransit(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/dashboard/getDashboardTransit',
    method: 'post',
    data
  }
  return request(params)
}
// 获取计划汇总
export function getPlanSummary(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/dashboard/planSummary',
    method: 'get',
    params: data
  }
  return request(params)
}
