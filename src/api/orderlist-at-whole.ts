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

// 获取某个国家的州/省
export function getStateByCountry(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getStateByCountry',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getLscList(data: any): AxiosPromise<any> {
  const { page, size, ...obj } = data
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/getLscList',
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

// 获取下单客户详情
export function getOrderCustomer(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/cust/getCust',
    method: 'get',
    params: data
  }
  return request(params)
}

// 获取某个州/省的所有城市
export function getCityByState(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCityByState',
    method: 'get',
    params: data
  }
  return request(params)
}

// 更新订单私人地址
export function updateContact(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fullorder/updateContact',
    method: 'post',
    data
  }
  return request(params)
}

// 查询所有状态
export function getStatusList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/status/status_list',
    method: 'get'
  }
  return request(params)
}

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

// 查询列表
export function getFbastoreList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/fbastore/getFbastoreList',
    method: 'get',
    params: data
  }
  return request(params)
}

// getBookingByCode
export function getBookingByCode(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fullorder/getBookingByCode',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询仓库
export function getWarehouseAllList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/warehouse/selectlist',
    method: 'get'
  }
  return request(params)
}

export function getLscSimpleList(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/listall',
    method: 'post',
    params: data
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

export function getAllAgentList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/agent/getAgentAll',
    method: 'get'
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

// 查询全程订单列表
export function getOrderList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fullorder/getOrderList',
    method: 'post',
    data
  }
  return request(params)
}

export function getCustomerOrderList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/customerOrder/getOrderList',
    method: 'post',
    data
  }
  return request(params)
}

export function getCustomerOrderStatistics(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/customerOrder/group',
    method: 'post',
    data
  }
  return request(params)
}

export function getFreezesList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fullorder/freezes',
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

export function getOrderExcel(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fullExcel/export',
    method: 'post',
    responseType: 'blob',
    timeout: 60000,
    data
  }
  return request(params)
}

export function getCustomerOrderExcel(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/customerOrder/export',
    method: 'post',
    responseType: 'blob',
    timeout: 60000,
    data
  }
  return request(params)
}

export function getRiskOrderExcel(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fullExcel/freezes/export',
    method: 'post',
    responseType: 'blob',
    data
  }
  return request(params)
}

//
export function moveOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/worder/generateOrder',
    method: 'post',
    data
  }
  return request(params)
}

export function auditOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fullorder/audit',
    method: 'post',
    data
  }
  return request(params)
}

export function getOrderDetails(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fullorder/getOrder',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getOrderBatches(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fullorder/getOrderBatches',
    method: 'get',
    params: data
  }
  return request(params)
}

// 打印单
export function getWarehouseExportFile(data: {
  tag: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/report/r/tag',
    method: 'get',
    params: data
  }
  return request(params)
}

export function deleteOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fullorder/deleteOrder',
    method: 'delete',
    params: data
  }
  return request(params)
}

export function deletePallet(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/worder/deletePallet',
    method: 'delete',
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
export function editTrans(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fill/edit_trans',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getExcelExport(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/measure/line/export',
    method: 'post',
    responseType: 'blob',
    data
  }
  return request(params)
}

export function setExcelImport(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/measure/line/import',
    method: 'post',
    data
  }
  return request(params)
}

export function getMeasureById(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/measure/line/findone',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getMeasureList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/measure/line/page',
    method: 'post',
    data
  }
  return request(params)
}

export function updateSingleMeasure(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/measure/line/update',
    method: 'post',
    data
  }
  return request(params)
}

export function deleteSingleMeasure(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/measure/line/deleteitem',
    method: 'post',
    data
  }
  return request(params)
}

export function updateStatus(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/measure/line/updatestatus',
    method: 'post',
    data
  }
  return request(params)
}

export function cancelOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fullorder/cancelOrder',
    method: 'post',
    params: data
  }
  return request(params)
}

export function getUnitList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/library/get_unit',
    method: 'post'
  }
  return request(params)
}

export function getPrice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/line/calculation',
    method: 'post',
    data
  }
  return request(params)
}

export function saveSalesmanOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fullorder/updateSalesmanOrder',
    method: 'post',
    data
  }
  return request(params)
}

export function getUserDeclare(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/library/get_declare_list',
    method: 'post',
    data
  }
  return request(params)
}

export function getExpressOrdersZipFile(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/express/web/expressorder/downloadZipFile',
    responseType: 'blob',
    method: 'post',
    params: data
  }
  return request(params)
}

export function getExpressOrdersPdfFile(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'express/web/expressorder/downLoadPdfFile',
    method: 'post',
    params: data,
    responseType: 'blob'
  }
  return request(params)
}

export function getExpressOrdersPdfMosaic(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/express/web/expressorder/customerPdfFile',
    method: 'post',
    params: data,
    responseType: 'blob'
  }
  return request(params)
}

export function getOrdersGoodFile(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fullorder/export',
    responseType: 'blob',
    method: 'get',
    params: data
  }
  return request(params)
}

export function addFrost(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fullorder/frozen',
    method: 'post',
    data
  }
  return request(params)
}

export function removeFrost(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fullorder/unfreeze',
    method: 'post',
    data
  }
  return request(params)
}

export function getExpressNoList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'express/web/expressorder/items',
    method: 'post',
    params: data
  }
  return request(params)
}

export function exportExpressExcel(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/express/web/expressorder/excel',
    method: 'post',
    params: data,
    responseType: 'blob'
  }
  return request(params)
}

export function applyFrost(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fullorder/applyforUnfreezing',
    method: 'get',
    params: data
  }
  return request(params)
}

export function measure2label(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'express/api/express/measure2label',
    method: 'post',
    data
  }
  return request(params)
}

export function auditOutOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fullorder/insuffi',
    method: 'post',
    data
  }
  return request(params)
}

export function getExpressStatusList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'express/api/express/track',
    method: 'post',
    params: data
  }
  return request(params)
}

// 查看订单状态列表
export function getOrderStatusList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/guest/status',
    method: 'post',
    data
  }
  return request(params)
}

// 获取状态下载文件
export function getOrderStatusFile(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'orders/guest/status/file',
    method: 'get',
    params: data
  }
  return request(params)
}

// 根据条件获取已报价的服务
export function getLscListByPrice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/line/loadMinPrice2',
    method: 'post',
    data
  }
  return request(params)
}

// 保存修改服务
export function updateServer(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/update_order/server',
    method: 'post',
    data
  }
  return request(params)
}

// 保存修改报关方式
export function updateCustoms(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/update_order/declaration',
    method: 'post',
    data
  }
  return request(params)
}

// 保存修改派送方式
export function updateDeliveryWay(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/update_order/delivery',
    method: 'post',
    data
  }
  return request(params)
}

// 操作日志
export function getLogList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/order_log/page',
    method: 'post',
    data
  }
  return request(params)
}

// 报关下单
export function generateDeclarationOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/declare_order/update_declare_order',
    method: 'get',
    params: data
  }
  return request(params)
}

// 取消报关订单
export function cancelDeclarationOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/declare_order/cancel',
    method: 'get',
    params: data
  }
  return request(params)
}

// 关联订单
export function getOtherOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/update_order/orders',
    method: 'post',
    params: data
  }
  return request(params)
}

// 重新计量
export function resetMeasure(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'wms/measure/m2',
    method: 'post',
    data
  }
  return request(params)
}

// 重新验货
export function resetExamine(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'wms/examining/renew',
    method: 'post',
    params: data
  }
  return request(params)
}

// 快递下单
export function expressOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/express/web/expressorder/sf',
    method: 'post',
    params: data
  }
  return request(params)
}

// 特批发货
export function getSpecialOrderByCode(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'orders/fullorder/be_ship',
    method: 'get',
    params: data
  }
  return request(params)
}

// 退件出库
export function returnOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'orders/outorder/return_order',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getByCode(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fullorder/printMark',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getOrderInfoPrint(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/ticket',
    method: 'get',
    params: data
  }
  return request(params)
}
