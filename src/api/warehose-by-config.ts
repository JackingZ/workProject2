import request from '@/utils/request'
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios'
type snu = string | number | undefined

export interface SearchParams {
  originalNumber?: snu
  customerName?: snu
  status?: snu
  applyTime?: snu
  licencePlate?: snu
  type?: snu
  unloadID?: snu
  queueNumber?: snu
  warehousename?: snu
  driverName?: snu
  driverPhone?: snu
  unloadPort?: snu
  dockingPerson?: snu
  beginTime?: snu
  finishTime?: snu
  [propName: string]: any
}

// ---------------------------------common-------------------------------------------------------
// 查询所有国家接口
export function getCountryList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCountryList',
    method: 'get'
  }
  return request(params)
}

// 获取多个州/省的所有城市
export function getCities(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCityByStates',
    method: 'post',
    data
  }
  return request(params)
}

// 获取某个国家的州/省
export function getStateByCountry(countryId: string | number): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getStateByCountry',
    method: 'get',
    params: {
      countryId
    }
  }
  return request(params)
}
// 获取某个州/省的所有城市
export function getCityByState(stateId: string | number): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCityByState',
    method: 'get',
    params: {
      stateId
    }
  }
  return request(params)
}
// 获取某个城市的所有区县
export function getCountyByCity(cityId: string | number): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCountyByCity',
    method: 'get',
    params: {
      cityId
    }
  }
  return request(params)
}

// 查询供应商接口
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
// 查询代理商
export function getAgentList(data: {
  page: number
  size: number
  parentId: string
  [propName: string]: snu
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/agent/getAgentList',
    method: 'get',
    params: data
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
// 查询部门列表
export function getDeptList(data: {
  custId: snu
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/dept/getDeptList',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getCheckDeptId(data: {
  custId: snu,
  deptId: snu,
  warehouseId?: snu
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'wms/warehouse/contain',
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
// 服务大类列表
export function getServiceTypeList(data: {
  custType: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceTypeList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询货币列表
export function geCurrencyList(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/currency/getCurrencyList',
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

// ---------------------------------------卸货---------------------------------------------------
// 卸货申请查询
export function getUnloadList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/unload/page',
    method: 'post',
    data
  }
  return request(params)
}

export function getUnloadById(data: { id: string }): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/unload/get',
    method: 'get',
    params: data
  }
  return request(params)
}

// 拆柜申请查询
export function getDevanningList(data: SearchParams): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '',
    method: 'post',
    data
  }
  return request(params)
}

// ----------------------------------------计量------------------------------------------------
// 计量申请查询
export function getMeasureList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/measure/page',
    method: 'post',
    data
  }
  return request(params)
}
// 计量申请详情列表
export function getMeasureDetailList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/measure/pageDetail',
    method: 'post',
    data
  }
  return request(params)
}

// 批量导入
export function batchImport(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/measure/e',
    method: 'post',
    data
  }
  return request(params)
}

// 计量详情表单
export function getMeasureById(data: { id: string }): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/measure/get',
    method: 'get',
    params: data
  }
  return request(params)
}
// 新增
export function addSingleMeasureDetail(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/measure/detail/save',
    method: 'post',
    data
  }
  return request(params)
}
// 更新
export function saveSingleMeasureDetail(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/measure/detail/update',
    method: 'post',
    data
  }
  return request(params)
}
// 修改计量状态
export function updateStatus(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/measure/c',
    method: 'get',
    params: data
  }
  return request(params)
}

export function deleteMeasureDetail(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/measure/delList',
    method: 'post',
    data
  }
  return request(params)
}

export function getExcelExport(data: {
  id: string,
  originalNo: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/measure/export',
    method: 'post',
    responseType: 'blob',
    params: data
  }
  return request(params)
}
export function exportMeasure(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/measure/export1',
    method: 'post',
    responseType: 'blob',
    data
  }
  return request(params)
}

export function saveMeasureRepeatTest(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'wms/measure/recopy',
    method: 'get',
    params: data
  }
  return request(params)
}

// ---------------------------------------拖托-------------------------------------------------
// 拖托任务查询
export function getTrailerList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/towage/page',
    method: 'post',
    data
  }
  return request(params)
}
// 拖托任务详情
export function getTrailerDetail(data: {
  towageNo: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/towage/get',
    method: 'get',
    params: data
  }
  return request(params)
}

// 拣货任务查询
export function getPickList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '',
    method: 'post',
    data
  }
  return request(params)
}

// ----------------------------------上架---------------------------------------------
// 上架查询
export function getPutawayList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/putaway/page',
    method: 'post',
    data
  }
  return request(params)
}

// 上架详情
export function getPutawayDetail(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/putaway/get',
    method: 'get',
    params: data
  }
  return request(params)
}

// ---------------------------------调拨----------------------------------------
// 移库申请查询
export function getMoveList(data: SearchParams): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/allocation/task_page',
    method: 'post',
    data
  }
  return request(params)
}

// 移库详情
export function getMoveDetail(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/transfer/get',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getMoveViewDetail(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/allocation/get_details',
    method: 'get',
    params: data
  }
  return request(params)
}
// 审核
export function auditMove(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/allocation/audit',
    method: 'post',
    data
  }
  return request(params)
}
export function cancelMove(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/allocation/cancel',
    method: 'get',
    params: data
  }
  return request(params)
}
export function deleteMove(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/allocation/delete',
    method: 'get',
    params: data
  }
  return request(params)
}
export function saveMove(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/allocation/save',
    method: 'post',
    data
  }
  return request(params)
}
export function getPalletOrderList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/pallet/getPallet',
    method: 'post',
    data
  }
  return request(params)
}
export function getOrderList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/worder/getOrderList',
    method: 'post',
    data
  }
  return request(params)
}

// --------------------------------------出库申请单--------------------------------------------------
// 出库申请查询
export function getOutputList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/outorder/getOrderList',
    method: 'post',
    data
  }
  return request(params)
}
// 出库详情
export function getOutputDetail(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/outorder/getOutOrder',
    method: 'get',
    params: data
  }
  return request(params)
}
// 审核
export function setOutputAudit(data: {
  status: string
  id?: string
  reason?: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/outorder/audit',
    method: 'post',
    data
  }
  return request(params)
}
export function changeOutputStatus(data: {
  status: string
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/outorder/complete',
    method: 'post',
    data
  }
  return request(params)
}
// 审核通过后递交上级
export function setOutputOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/outorder/generateOrder',
    method: 'post',
    data
  }
  return request(params)
}

// 盘点申请查询
export function getInventoryList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/inventory/getOrderList',
    method: 'post',
    data
  }
  return request(params)
}
// 保存盘点申请单
export function saveInventory(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/inventory/save',
    method: 'post',
    data
  }
  return request(params)
}
// 获取盘点申请单内容
export function getInventoryById(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/inventory/findById',
    method: 'post',
    data
  }
  return request(params)
}
// 获取盘点申请单
export function getInventoryDetailById(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/inventory/getInventoryById',
    method: 'get',
    params: data
  }
  return request(params)
}
// 生成盘点
export function generateInventory(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/inventory/query',
    method: 'post',
    data
  }
  return request(params)
}
// 盘点查询仓库订单
export function queryUnloadOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/inventory/queryUnloadOrder',
    method: 'post',
    data
  }
  return request(params)
}
// 修改盘点结果
export function updateInventory(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/inventory/update',
    method: 'post',
    data
  }
  return request(params)
}
// 分配盘点任务
export function doInventoryTask(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/inventory/doInventoryTask',
    method: 'post',
    data
  }
  return request(params)
}
// 获取仓库人员
export function getUserByWarehouseId(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/warehouse/getUserByWarehouseId',
    method: 'get',
    params: data
  }
  return request(params)
}
// 获取分配任务单列表
export function getTasks(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/inventory/getTasks',
    method: 'get',
    params: data
  }
  return request(params)
}
// 取消分配任务单
export function cancelTask(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/inventory/cancelTask',
    method: 'get',
    params: data
  }
  return request(params)
}
// 取消盘点申请单
export function cancelInventory(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/inventory/cancelInventory',
    method: 'post',
    params: data
  }
  return request(params)
}
// 完成盘点申请单
export function workInventory(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/inventory/workInventory',
    method: 'post',
    params: data
  }
  return request(params)
}
// 手动释放库存锁
export function release(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/inventory/release',
    method: 'get',
    params: data
  }
  return request(params)
}
// 取消分配任务单分配内容
export function cancelTaskInfo(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/inventory/cancelTaskInfo',
    method: 'get',
    params: data
  }
  return request(params)
}
// 取消分配任务单
export function getTaskInfoById(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/inventory/getTaskInfoById',
    method: 'get',
    params: data
  }
  return request(params)
}

// -------------------------------------验货---------------------------------------
// 验货申请查询
export function getExamineList(data: SearchParams): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/examining/page',
    method: 'post',
    data
  }
  return request(params)
}

// 验货详情
export function getExamineDetail(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/examining/get',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getExamineDetailByCode(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/examining',
    method: 'get',
    params: data
  }
  return request(params)
}

// 异常件申请查询
export function getAnomalyList(data: SearchParams): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '',
    method: 'post',
    data
  }
  return request(params)
}

// 增值服务申请查询
export function getServiceList(data: SearchParams): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '',
    method: 'post',
    data
  }
  return request(params)
}

// 换单服务申请查询
export function getTransferList(data: SearchParams): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '',
    method: 'post',
    data
  }
  return request(params)
}

// --------------------------仓库配置--------------------------------------------------------------------

// 查询列表
export function getWH(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/warehouse/getWarehouse',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询列表
export function getWHList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/warehouse/getWarehouseList',
    method: 'post',
    data
  }
  return request(params)
}

// 添加编辑数据
export function saveWHData(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/warehouse/saveWarehouse',
    method: 'post',
    data
  }
  return request(params)
}

// 删除数据
export function deleteWHData(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/warehouse/deleteWarehouse',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 修改状态
export function changeWHStatus(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/warehouse/changeStatus',
    method: 'post',
    params: data
  }
  return request(params)
}

// ----------------------------仓库配置 操作中心--------------------------------------------------------
// 查询岗位common
export function getPostList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/post/getPostList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询分页列表
export function getWorkCenterList(data: {
  page: number,
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/workCenter/getWorkCenterList',
    method: 'post',
    data
  }
  return request(params)
}

// 查询操作中心列表数据
export function getWorkCenterData(data: {
  schedule: string,
  warehouseId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/workCenter/getList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 查询单条数据
export function getSingleCenterList(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/workCenter/get',
    method: 'get',
    params: data
  }
  return request(params)
}

// 添加编辑数据
export function saveWorkCenter(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/workCenter/saveWorkCenter',
    method: 'post',
    data
  }
  return request(params)
}

// 删除数据
export function deleteWorkCenter(data:{
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/workCenter/deleteWorkCenter',
    method: 'delete',
    params: data
  }
  return request(params)
}

// ----------------------------仓库配置 转仓信息--------------------------------------------------------

// 查询列表
export function getTransitPage(data: {
  page: number,
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/transit/getTransitPage',
    method: 'post',
    data
  }
  return request(params)
}

// 目的仓
export function getPurposeWH(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'wms/warehouse/list',
    method: 'get',
    params: data
  }
  return request(params)
}

// 添加编辑数据
export function saveTransit(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/transit/saveTransit',
    method: 'post',
    data
  }
  return request(params)
}

// 删除数据
export function deleteTransit(data:{
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/transit/deleteTransit',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 查询单条数据
export function getSingleTransitList(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/transit/get',
    method: 'get',
    params: data
  }
  return request(params)
}

// ----------------------------仓库配置 库位--------------------------------------------------------
// 查询业务配置中的仓储和专线服务

export function getSscList(data: {
  page: number,
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ssc/getSscList',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getQrcode(data: {
  height: number,
  width: number,
  warehouseId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/bin/qrcode',
    method: 'get',
    params: data,
    responseType: 'blob'
  }
  return request(params)
}

// 库位树
export function getSLTree(data: {
  warehouseId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/bin/getTree',
    method: 'get',
    params: data
  }
  return request(params)
}

// 库位树节点
export function getSLTreeNode(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/bin/getNode',
    method: 'get',
    params: data
  }
  return request(params)
}

// 添加编辑数据
export function saveBin(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/bin/saveBin',
    method: 'post',
    data
  }
  return request(params)
}

// 删除数据
export function deleteBin(data:{
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/bin/del',
    method: 'delete',
    params: data
  }
  return request(params)
}

// ----------------------------仓库配置 转班配置--------------------------------------------------------
// 查询班次common
export function getClassesList(data: {
  warehouseId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/shift/list',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询列表
export function getWorkShiftList(data: {
  page: number,
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/wss/page',
    method: 'post',
    data
  }
  return request(params)
}

// 查询单一数据
export function getSingleWorkShift(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/wss/get',
    method: 'get',
    params: data
  }
  return request(params)
}

// 添加编辑数据
export function saveWorkShift(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/wss/addWorkShifts',
    method: 'post',
    data
  }
  return request(params)
}

// 删除数据
export function deleteWorkShift(data:{
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/wss/del',
    method: 'delete',
    params: data
  }
  return request(params)
}

// ----------------------------仓库配置 转岗配置--------------------------------------------------------
// 查询列表
export function getPostShiftList(data: {
  page: number,
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/rot/findByPage',
    method: 'post',
    data
  }
  return request(params)
}

// 查询单一数据
export function getSinglePostShift(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/rot/get',
    method: 'get',
    params: data
  }
  return request(params)
}

// 添加编辑数据
export function savePostShift(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/rot/addRotation',
    method: 'post',
    data
  }
  return request(params)
}

// 删除数据
export function deletePostShift(data:{
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/rot/del',
    method: 'delete',
    params: data
  }
  return request(params)
}

// ---------------------------------------班次岗位分配------------------------------------------------------
// 查询员工
export function getPersonList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/user/user4position',
    method: 'post',
    data
  }
  return request(params)
}

// 批量设置某月班次岗位
export function setMonthShiftPost(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/shift/create',
    method: 'post',
    data
  }
  return request(params)
}

// 查看某月班次岗位
export function getMonthShiftPost(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/shift/view',
    method: 'post',
    data
  }
  return request(params)
}

// 更新单日班次岗位
export function saveDayShiftPost(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/shift/update',
    method: 'post',
    data
  }
  return request(params)
}

// --------------------------------------班次信息----------------------------------------------------------
// 查询班次
export function getSchedulTable(data: {
  page: number,
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/shift/page',
    method: 'post',
    data
  }
  return request(params)
}
export function getSchedulList(data: {
  warehouseId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/shift/list',
    method: 'get',
    params: data
  }
  return request(params)
}
// 编辑数据
export function saveSchedul(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/shift/addShift',
    method: 'post',
    data
  }
  return request(params)
}

// 删除数据
export function deleteSchedul(data:{
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/shift/del',
    method: 'delete',
    params: data
  }
  return request(params)
}

// --------------------------------------卸货口----------------------------------------------------------
export function getDischargeTable(data: {
  warehouseId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/discharge/list',
    method: 'get',
    params: data
  }
  return request(params)
}
// 编辑数据
export function saveDischarge(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'wms/discharge/save',
    method: 'post',
    data
  }
  return request(params)
}

// 删除数据
export function deleteDischarge(data:{
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/discharge/del',
    method: 'delete',
    params: data
  }
  return request(params)
}

// -------------------------------入仓条款------------------------------------------
export function getWarehouseClause(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/warehouse/terms',
    method: 'get',
    params: data
  }
  return request(params)
}
// 编辑数据
export function saveWarehouseClause(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/warehouse/terms/save',
    method: 'post',
    data
  }
  return request(params)
}
// 调拨单导出
export function allocationExport(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'orders/allocation/exportAllocation2',
    responseType: 'blob',
    method: 'get',
    params: data
  }
  return request(params)
}
// 发货出库单
export function allocationOutport(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/outorder/exportWsOut',
    responseType: 'blob',
    method: 'get',
    params: data
  }
  return request(params)
}
// 换单查询
export function getChangeOrder(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/express/web/expressorder/s',
    responseType: 'blob',
    method: 'get',
    params: data
  }
  return request(params)
}
// 换单列表记录
export function getChangeOrderList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/express/b/page',
    method: 'post',
    data
  }
  return request(params)
}
// 换单列表记录
export function getChangeOrderDetails(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/express/b/get',
    method: 'get',
    params: data
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

export function getLscGroupItems(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/getLscGroupItems',
    method: 'get',
    params: data
  }
  return request(params)
}
