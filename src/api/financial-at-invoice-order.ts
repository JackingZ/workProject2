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

// 查询供应商
export function getSupplierList(data: {
  page: number,
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/supplier/getSupplierList',
    method: 'get',
    params: data
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

// 服务大类权限列表
export function getServiceTypeList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/getCustTypeDtlList',
    method: 'get',
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
export function rollbackInvoice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/account/rollback',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询订单列表
export function getwarehouseOrderList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/worder/getOrderList',
    method: 'post',
    data
  }
  return request(params)
}

// 查询仓储订单详情
export function getwarehouseOrderInfo(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/worder/getWarehouseOrder',
    method: 'get',
    params: data
  }
  return request(params)
}

// 获取成本项目列表
export function getCostitemList(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/costitem/getCostitemList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询货币列表
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
export function getExchangeList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/exchange/getExchangeList',
    method: 'get',
    params: data
  }
  return request(params)
}

// ----------------------------------------------------应收应付款-----------------------------------------------------------------
// 查询发票列表
export function getInvoiceList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/account/page',
    method: 'post',
    data
  }
  return request(params)
}
// 查询发票列表根据原单号
export function getInvoiceListByOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'finance/account/order_invoice',
    method: 'post',
    data
  }
  return request(params)
}
// 获取单一发票
export function getInvoiceById(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/account/getInvoice',
    method: 'get',
    params: data
  }
  return request(params)
}

// 删除发票
export function deleteInvoice(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/account/deleteInvoice',
    method: 'post',
    params: data
  }
  return request(params)
}

// 新增发票
export function saveInvoice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/account/saveInvoice',
    method: 'post',
    data
  }
  return request(params)
}
// 编辑发票
export function updateInvoice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/account/updateInvoice',
    method: 'post',
    data
  }
  return request(params)
}

export function getInvoiceExcel(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/account/exportAll',
    method: 'post',
    responseType: 'blob',
    data
  }
  return request(params)
}
export function getInvoiceExport(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/account/export2',
    method: 'post',
    responseType: 'blob',
    data
  }
  return request(params)
}

// ------------------------------------------  付款单接口 ---------------------------------------------
// 查询款项列表
export function getPaymentList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/p/page',
    method: 'post',
    data
  }
  return request(params)
}
// 获取单条款项
export function getPaymentById(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/p/get',
    method: 'get',
    params: data
  }
  return request(params)
}

// 删除款项
export function deletePayment(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/p/del',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 新增/编辑付款
export function addPayment(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/p/add',
    method: 'post',
    data
  }
  return request(params)
}
export function editPayment(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/p/edit',
    method: 'post',
    data
  }
  return request(params)
}

// 查询汇率值
export function getExRateValue(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/exchange/rate',
    method: 'get',
    params: data
  }
  return request(params)
}

// ------------------------------------------  收款单接口 ---------------------------------------------

// 查询收款单列表
export function getReceiveList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/r/page',
    method: 'post',
    data
  }
  return request(params)
}
// 收款单-核销发票
export function getRecInvoice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/account/query',
    method: 'post',
    data
  }
  return request(params)
}
// 收款单-关联回款
export function getRecAccount(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/r/payback',
    method: 'get',
    params: data
  }
  return request(params)
}
// 获取单条收款单
export function getReceiveById(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/r/info',
    method: 'get',
    params: data
  }
  return request(params)
}
// 新增/编辑回款
export function addReceive(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/r/add',
    method: 'post',
    data
  }
  return request(params)
}
export function editReceive(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/r/edit',
    method: 'post',
    data
  }
  return request(params)
}
export function deleteReceive(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/r/del',
    method: 'delete',
    params: data
  }
  return request(params)
}
// 回款完成
export function receiveSuccess(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/account/receiveSuccess',
    method: 'post',
    data
  }
  return request(params)
}

// 核销发票未审核状态
export function rollbackInvoiceCheck(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/account/rollbackInvoiceCheck',
    method: 'post',
    data
  }
  return request(params)
}

// 查询银行账户
export function getBankList(data: {
  custId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/acct/getAcctList',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getReceiveExcel(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/r/export',
    method: 'post',
    responseType: 'blob',
    data
  }
  return request(params)
}

// ------------------------------------------  请款申请单接口 ---------------------------------------------
// 查询请款申请单列表
export function getRequestList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/apply/page',
    method: 'post',
    data
  }
  return request(params)
}
// 请款单-应付发票
export function getReqInvoice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/account/handel',
    method: 'post',
    data
  }
  return request(params)
}

// 获取单条申请单
export function getRequestById(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/apply/get',
    method: 'get',
    params: data
  }
  return request(params)
}

// 删除申请单
export function deleteRequest(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/apply/del',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 新增/编辑申请单
export function addRequest(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/apply/add',
    method: 'post',
    data
  }
  return request(params)
}
export function editRequest(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/apply/edit',
    method: 'post',
    data
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

// 获取当前账号所有下级
export function getCustomerTree(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'auth/cust/tree',
    method: 'get',
    params: data
  }
  return request(params)
}
export function auditInvoice(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/account/audit',
    method: 'get',
    params: data
  }
  return request(params)
}
export function auditCollection(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/r/audit',
    method: 'get',
    params: data
  }
  return request(params)
}
export function auditCash(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/apply/audit',
    method: 'post',
    params: data
  }
  return request(params)
}
export function auditPayment(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/p/audit',
    method: 'post',
    params: data
  }
  return request(params)
}
// 查询全程订单列表
export function getFullOrderList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fullorder/getOrderList',
    method: 'post',
    data
  }
  return request(params)
}
// 查询报关订单列表
export function getDeclareOrderList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/declare_order/get_declare_data',
    method: 'post',
    data
  }
  return request(params)
}
// 查询报关订单列表
export function getCarOrderList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/card/get_data',
    method: 'post',
    data
  }
  return request(params)
}
// 查询拖车订单列表
export function getTrailerOrderList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/trailer/page',
    method: 'post',
    data
  }
  return request(params)
}
// 快递
export function getExpressOrderList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/express/web/expressorder/list',
    method: 'post',
    data
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

export function getOutInvoiceOption(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/bill/billPage',
    method: 'post',
    data
  }
  return request(params)
}
export function getUnInvoiceOption(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/account/unverified',
    method: 'post',
    data
  }
  return request(params)
}
export function getCustType(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/supplier/custType',
    method: 'post',
    data
  }
  return request(params)
}
