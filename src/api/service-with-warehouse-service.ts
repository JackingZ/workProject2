import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

export interface ITrialerRequest {
  id?: snu, // 服务编码
  name?: snu, // 服务名称
  abbr?: snu, // 服务简称
  countryId?: snu, // 所在国家
  subtypeId?: snu, // 服务类型
  belong?: snu, // 分配客户
  terms?: snu // 条款
  [propName: string]: snu
}

// 查询仓储配置列表数据
export function getWarehouseList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ssc/getSscList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 添加编辑仓储配置数据
export function saveWarehouseData(data:ITrialerRequest): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ssc/saveSsc',
    method: 'post',
    data
  }
  return request(params)
}

// 修改仓储配置状态
export function modifyWarehouseStatus(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ssc/changeStatus',
    method: 'post',
    params: data
  }
  return request(params)
}

// 删除仓储配置
export function deleteWarehouseData(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ssc/deleteSsc',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 查询代理
export function getAgentsById(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ssc/getAgentList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 保存编辑代理
export function saveAgent(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ssc/saveAgent',
    method: 'post',
    data
  }
  return request(params)
}

// 查询所有国家接口
export function getCountryList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCountryList',
    method: 'get'
  }
  return request(params)
}
// 企业服务类别列表
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

// 查询仓储服务列表数据
export function getSsList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ss/getSsList',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getExamineList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/examine/getExamineList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 服务小类列表
export function getServiceSubtypeList(data: {
  typeId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceSubtypeList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 获取仓储服务成本项目类别列表
export function getSsCostitemType(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ssc/getSsCostitemType',
    method: 'get',
    params: data
  }
  return request(params)
}

// 保存仓库关联
export function saveSsCostItem(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ssc/saveSsCostitemType',
    method: 'post',
    data
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

// 获取成本项目列表
export function getCostitemTypeList(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/costitem/getCostitemTypeList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 获取服务
export function getSubtypeByCustAndType(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/getSubtypeByCustAndType',
    method: 'get',
    params: data
  }
  return request(params)
}

// 获取已关联服务
export function getWarehouseServer(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/warehouse/server/cat',
    method: 'get',
    params: data
  }
  return request(params)
}
// 保存服务
export function saveWarehouseServer(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/wms/warehouse/server/save',
    method: 'post',
    data
  }
  return request(params)
}

// 仓库配置-成本项目
export function getCostitemConfigList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/costitem/ws',
    method: 'post',
    data
  }
  return request(params)
}

export function getCostitemConfigById(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/r/get',
    method: 'post',
    params: data
  }
  return request(params)
}
// 保存
export function saveCostitemConfig(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/r/save',
    method: 'post',
    data
  }
  return request(params)
}

// 查询货柜列表
export function getContainerList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/container/getContainerList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询车型列表
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
