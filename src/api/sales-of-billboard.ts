import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'
// import qs from 'qs'

type snu = string | number | undefined

export interface ParamRequest {
  countryId: snu,
  countryName: snu,
  name: snu,
  remark: snu,
  states: any
  [propName: string]: any
}

export function getBillboardCard(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/year_plan/head',
    method: 'post',
    data
  }
  return request(params)
}

export function getBillboardChart(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/year_plan/body',
    method: 'post',
    data
  }
  return request(params)
}

export function getDetailChart(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/year_plan/group_details',
    method: 'post',
    data
  }
  return request(params)
}

export function getDepartList(data: {
  custId: snu
  deptId: snu
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/dept/getDeptList',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getFiscalList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/fisCal/get',
    method: 'post',
    data
  }
  return request(params)
}

export function getUnFinanceAgentList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/agent/customer_finance',
    method: 'get'
  }
  return request(params)
}

export function getUnFinanceAgentById(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/agent/customer_by_id',
    method: 'get',
    params: data
  }
  return request(params)
}

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
