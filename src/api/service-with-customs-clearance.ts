// 报关服务
import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

export interface IClearanceRequest {
  id: snu, // 服务编码
  name: snu, // 服务名称
  abbr: snu, // 服务简称
  countryId: snu, // 所在国家
  subtypeId: snu, // 服务类型
  csId: snu, // 关联服务编码
  belong: snu, // 分配客户
  terms: snu // 条款
  [propName: string]: snu
}

// 查询报关服务列表
export function getClearanceList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/csc/getCscList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 添加编辑数据
export function saveClearanceData(data:IClearanceRequest): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/csc/saveCsc',
    method: 'post',
    data
  }
  return request(params)
}

// 修改状态
export function modifyClearanceStatus(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/csc/changeStatus',
    method: 'post',
    params: data
  }
  return request(params)
}

// 删除配置
export function deletClearanceData(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/csc/deleteCsc',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 查询代理列表
export function queryAgentList(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/csc/getAgentList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 保存编辑代理
export function saveAgent(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/csc/saveAgent',
    method: 'post',
    data
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

// 查询所有国家接口
export function getCountryList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCountryList',
    method: 'get'
  }
  return request(params)
}

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

// 服务类型查询
export function getServiceSubtypeList(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceSubtypeList',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getCsList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/cs/getCsList',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getBookcList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/bookc/getBookcList',
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
export function getServicepProjectList(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/csc/getCscCostitem',
    method: 'get',
    params: data
  }
  return request(params)
}
// 保存报关成本项目
export function saveCostItem(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/csc/saveCscCostitem',
    method: 'post',
    data
  }
  return request(params)
}

// 获取全部海关
export function getCabinetList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/org/getOrgList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 保存海关
export function saveCabinetList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/csc/save_customs',
    method: 'post',
    data
  }
  return request(params)
}

// 获取已关联海关
export function getServiceCabinetList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/csc/find_customs',
    method: 'post',
    data
  }
  return request(params)
}
