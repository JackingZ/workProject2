import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

export function getCreditList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '',
    method: 'get'
  }
  return request(params)
}

// 查询列表
export function getTableData(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/credit/page',
    method: 'post',
    data
  }
  return request(params)
}

export function saveCredit(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/credit/update',
    method: 'post',
    data
  }
  return request(params)
}

export function getPaytype(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/credit/payment',
    method: 'get',
    params: data
  }
  return request(params)
}

export function savePaytype(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/credit/payment/update',
    method: 'post',
    data
  }
  return request(params)
}

export function saveIcon(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/credit/update_tag',
    method: 'post',
    data
  }
  return request(params)
}

export function saveTemplate(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/credit/template/update',
    method: 'post',
    data
  }
  return request(params)
}
export function saveApplyCard(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/credit/update_amount',
    method: 'post',
    data
  }
  return request(params)
}
export function saveAudit(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/credit/audit',
    method: 'post',
    data
  }
  return request(params)
}

export function getTemplateData(data: {
  tag: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/credit/template',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getOrderList(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '',
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
export function getCredit(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/credit/get',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询发票列表
export function getInvoiceList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/account/page',
    method: 'post',
    data
  }
  return request(params)
}
export function getInvoice1List(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'finance/account/getInvoiceList1',
    method: 'post',
    data
  }
  return request(params)
}

// 查看客户信用级别
export function getCustRatingList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/credit/getCustRatingList',
    method: 'post',
    data
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

// 查询二级代理商非独立财务公司
export function getUnFinanceAgentList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/agent/customer_finance',
    method: 'get'
  }
  return request(params)
}
