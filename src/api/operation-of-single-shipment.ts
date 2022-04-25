import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

// 查询
export function getShipList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fill/query',
    method: 'post',
    data
  }
  return request(params)
}
export function getShipDetail(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fill/getFillSheetLines',
    method: 'post',
    data
  }
  return request(params)
}
export function getShipById(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fill/getFillSheet',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getShipByCode(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fill/getFullOrderByCode',
    method: 'get',
    params: data
  }
  return request(params)
}
// 添加/编辑
export function updateShip(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fill/saveFillSheet',
    method: 'post',
    data
  }
  return request(params)
}
export function editShip(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fill/editFillSheet',
    method: 'post',
    data
  }
  return request(params)
}
export function deleteShip(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fill/deleteFillSheet',
    method: 'delete',
    data
  }
  return request(params)
}

export function getCodeOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fullorder/getOrders',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getCustTypeList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/getCustTypeList',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getCustList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/getcustlist',
    method: 'post',
    data
  }
  return request(params)
}

export function getServiceCountry(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCountryList',
    method: 'get'
  }
  return request(params)
}
export function getCountryList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/getcountries',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getPortList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/ports/getPortList',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getExpressCompany(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/org/getOrgList',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getFbastoreList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/fbastore/getFbastoreList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询所有仓储
export function getWarehouseAllList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/warehouse/selectlist',
    method: 'get'
  }
  return request(params)
}
// 查询仓库
export function getWHList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/warehouse/getWarehouseList',
    method: 'post',
    data
  }
  return request(params)
}

export function getAreaList(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/getDeliveryCity',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getServiceSubtypeList(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceSubtypeList',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getDeliveryList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/plan/plan_list',
    method: 'post',
    data
  }
  return request(params)
}
export function getDeliverySoList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/plan/plan_list_view',
    method: 'post',
    data
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

// 柜型
export function getCabinetList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/container/getContainerList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 车型
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

export function getBSCDetailById(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/bs/getBs',
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

export function getAddressData(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/address/getAddressList',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getStatusList(): Promise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fullorder/status',
    method: 'get'
  }
  return request(params)
}

export function getSoByPlanId(data: {
  planId: string | number
  type: string
}): Promise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/booking/getSoByPlanId',
    method: 'get',
    params: data
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

export function exportOrderInfo(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fill/exportOrderInfo',
    method: 'get',
    responseType: 'blob',
    params: data
  }
  return request(params)
}
export function exportUnLoadBox(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fill/exportUnLoadingBox',
    method: 'get',
    responseType: 'blob',
    params: data
  }
  return request(params)
}

export function exportPortFile(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/fill/fillExport',
    method: 'get',
    responseType: 'blob',
    params: data
  }
  return request(params)
}

export function exportInsuranceList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fill/exportInsuranceList',
    method: 'get',
    responseType: 'blob',
    params: data
  }
  return request(params)
}

export function getOutDeclare(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/declare_order/create_out_declare',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getInDeclare(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/declare_order/create_enter_declare',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getInTrailer(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/trailer/create_trailer',
    method: 'post',
    data
  }
  return request(params)
}
export function getOutTrailer(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/trailer/create_out_trailer',
    method: 'post',
    data
  }
  return request(params)
}
export function getInCar(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/card/create_Enter_car',
    method: 'post',
    data
  }
  return request(params)
}
export function getOutCar(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/card/create_start_car',
    method: 'post',
    data
  }
  return request(params)
}

export function savePalletLine(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/pallet/savePalletLine',
    method: 'post',
    data
  }
  return request(params)
}
export function getWarehouseList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'wms/warehouse/country',
    method: 'post',
    data
  }
  return request(params)
}
export function exportPortStartCode(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'orders/fullorder/exportPackingStartList',
    method: 'post',
    responseType: 'blob',
    data
  }
  return request(params)
}
export function exportPortEndCode(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'orders/fullorder/exportPackingEndList',
    method: 'post',
    responseType: 'blob',
    data
  }
  return request(params)
}
export function exportTrackingNumber(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fill/exportTrackingNumber',
    method: 'post',
    responseType: 'blob',
    params: data
  }
  return request(params)
}

// 导出预约单(拆柜清单)
export function exportLoadPlan(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fill/exportOpenArk',
    method: 'post',
    responseType: 'blob',
    params: data
  }
  return request(params)
}
// 导出预约单(拆柜分货清单)
export function exportArkExpress(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fill/exportArkExpress',
    method: 'get',
    responseType: 'blob',
    params: data
  }
  return request(params)
}

// 专线
export function getLscComplicatedList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/condition',
    method: 'post',
    data
  }
  return request(params)
}

// 查询服务机构列表数据
export function getSeviceOrganList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/org/getOrgList',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getOutOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/outorder/create_order',
    method: 'post',
    data
  }
  return request(params)
}

export function getCreditById(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/credit/credit_list',
    method: 'post',
    data
  }
  return request(params)
}

export function getMoveOutOrderByNo(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fill/query_by_task',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getReplenishById(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fill/search_by_inter',
    method: 'get',
    params: data
  }
  return request(params)
}

export function saveReplenishOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/outorder/supplement_order',
    method: 'post',
    data
  }
  return request(params)
}

export function updateContainerNo(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fill/updateContainerNo',
    method: 'post',
    data
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
export function getOrderByViewAndEdit(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'orders/split_sheet/get_order_by_file',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getOrderLoadingWarehouse(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/split_sheet/loading_4_warehouse',
    method: 'get',
    params: data
  }
  return request(params)
}
export function splitCancel(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'orders/split_sheet/check_order',
    method: 'get',
    params: data
  }
  return request(params)
}

export function confirmReturn(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/split_sheet/edit_confirm',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getReturnBoxList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/packing/page_return_box',
    method: 'post',
    data
  }
  return request(params)
}
