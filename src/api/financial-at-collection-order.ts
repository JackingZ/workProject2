import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

// 查询所有国家接口
export function getCountryList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCountryList',
    method: 'get'
  }
  return request(params)
}
// 查询代理商
export function getAgentList(data: {
  page: number,
  size: number,
  parentId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/agent/getAgentList',
    method: 'get',
    params: data
  }
  return request(params)
}
// ------------------------------------------------------------ 收款单 -----------------------------------------------------------------

// 查询列表
export function getTableList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '',
    method: 'get',
    params: data
  }
  return request(params)
}

export function saveCollectOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '',
    method: 'post',
    data
  }
  return request(params)
}

export function deleteCollectOrder(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '',
    method: 'delete',
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

// ------------------------------------------------------------ 开票 -----------------------------------------------------------------
export function getOutInvoiceList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/bill/page',
    method: 'post',
    data
  }
  return request(params)
}

export function getOutInvoiceById(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/bill/item',
    method: 'post',
    data
  }
  return request(params)
}
export function getOutInvoiceByCustomerId(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/account/items',
    method: 'post',
    data
  }
  return request(params)
}
export function addOutInvoice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/bill/add',
    method: 'post',
    data
  }
  return request(params)
}
export function editOutInvoice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/bill/edit',
    method: 'post',
    data
  }
  return request(params)
}
export function exportOutInvoice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/account/export',
    method: 'post',
    responseType: 'blob',
    params: data
  }
  return request(params)
}
export function auditOutInvoice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/bill/audit',
    method: 'get',
    params: data
  }
  return request(params)
}
export function deleteOutInvoice(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '',
    method: 'post',
    params: data
  }
  return request(params)
}
export function getUsingServiceType(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/getServerType',
    method: 'get',
    params: data
  }
  return request(params)
}
// 查询客户
export function getCustomerList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/customer/customer',
    method: 'post',
    data
  }
  return request(params)
}
export function getCustomerTree(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'auth/cust/tree',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getCurrencyList(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/currency/getCurrencyList',
    method: 'get',
    params: {
      page: 1,
      size: 999,
      ...data
    }
  }
  return request(params)
}
export function getInvoiceList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/account/page',
    method: 'post',
    data
  }
  return request(params)
}
export function getPaymentList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/p/page',
    method: 'post',
    data
  }
  return request(params)
}
export function getReceiveList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/r/page',
    method: 'post',
    data
  }
  return request(params)
}

// ---------------------------------------------------对账单---------------------------------------------------------------------

export function getCheckList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/reconciliation/page',
    method: 'post',
    data
  }
  return request(params)
}
export function setCloseCheck(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/reconciliation/close',
    method: 'post',
    data
  }
  return request(params)
}
export function saveCheck(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/reconciliation/save',
    method: 'post',
    data
  }
  return request(params)
}
export function getOrderCheck(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/reconciliation/pageConfirm',
    method: 'post',
    data
  }
  return request(params)
}
export function getListCheck(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/reconciliation/pageImport',
    method: 'post',
    data
  }
  return request(params)
}
export function getSingleCheck(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/reconciliation/relation',
    method: 'post',
    data
  }
  return request(params)
}
export function getCheckCount(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'finance/reconciliation/states',
    method: 'post',
    data
  }
  return request(params)
}
export function getSingleStatus(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/reconciliation/manualRelation',
    method: 'post',
    data
  }
  return request(params)
}
export function setAutoCheck(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/reconciliation/automaticRelation',
    method: 'post',
    data
  }
  return request(params)
}
export function exportCheck(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/reconciliation/d',
    method: 'post',
    responseType: 'blob',
    data
  }
  return request(params)
}

// ---------------------------------------------------会计期间---------------------------------------------------------------------
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

// 新增
export function saveFiscal(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/fisCal/addOrUpdate',
    method: 'post',
    data
  }
  return request(params)
}

// 删除
export function deleteFiscal(data: { id: any }): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/fisCal/delete',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getAllServiceType(data: {
  custType: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceTypeList',
    method: 'get',
    params: data
  }
  return request(params)
}
