/*
 * @Author: your name
 * @Date: 2019-11-26 22:45:15
 * @LastEditTime: 2019-11-27 22:10:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \jht-admin\src\api\domestic-area.ts
 */
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

// 查询
export function getCompanyPlanList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/year_plan/plan_page',
    method: 'post',
    data
  }
  return request(params)
}
// 新增
export function savePlan(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/year_plan/save_plan',
    method: 'post',
    data
  }
  return request(params)
}

export function saveCompanyDistribut(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/year_plan/save_company_plan',
    method: 'post',
    data
  }
  return request(params)
}

export function getCompanyDistribut(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/year_plan/company_page',
    method: 'post',
    data
  }
  return request(params)
}

export function getDepartPlanList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/year_plan/dept_page',
    method: 'post',
    data
  }
  return request(params)
}
export function saveDepartDistribut(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/year_plan/save_dept_plan',
    method: 'post',
    data
  }
  return request(params)
}

export function getDepartDistribut(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/year_plan/dept_view',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getSalesPlanList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/year_plan/user_page',
    method: 'post',
    data
  }
  return request(params)
}
export function saveSalesDistribut(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/year_plan/save_user_plan',
    method: 'post',
    data
  }
  return request(params)
}

export function getSalesDistribut(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/year_plan/user_view',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询部门列表
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

export function saveDepart(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/year_plan/only_dept',
    method: 'post',
    data
  }
  return request(params)
}

export function deleteDepartDistribut(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/year_plan/dept_del',
    method: 'get',
    params: data
  }
  return request(params)
}

export function deleteSalesDistribut(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/year_plan/user_del',
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

export function getGroupList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/sale/getSaleGroupList',
    method: 'post',
    data
  }
  return request(params)
}

export function getPersonList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/user/getUsersInDept',
    method: 'get',
    params: data
  }
  return request(params)
}
