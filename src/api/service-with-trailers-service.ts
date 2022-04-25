import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

export interface IExpressRequest {
  id: snu, // 服务编码
  name: snu, // 服务名称
  expressId: snu, // 快递公司id
  type: snu, // 服务类型
  countryIdFrom: snu, // 起运国
  countryIdTo: snu, // 目的国
  categorieIds: any, // 商品属性
  remark: snu, // 备注
  um: snu, // 计量单位
  currencyId: snu, // 货币id
  custId: snu // 默认供应商
  [propName: string]: snu
}

// ----------------------------------拖车业务配置------------------------------------------------
// 分页查询拖车服务列表
export function getTrialList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ts/getTsList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询国家的所有州省市
export function getAreasByCountry(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getAreasOfOneCountry',
    method: 'get',
    params: data
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
// 获取区县分页列表
export function getCounties(data: {
  countryId: string
  stateId: string
  cityId: string
  page: number
  size: number
  name: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCounties',
    method: 'get',
    params: data
  }
  return request(params)
}
//  添加拖车服务
export function addTrialService(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ts/addTs',
    method: 'post',
    data
  }
  return request(params)
}

//  更新拖车服务
export function updateTrialService(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ts/updateTs',
    method: 'post',
    data
  }
  return request(params)
}
// 删除拖车配置
export function deleteTrial(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ts/deleteTs',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 禁用启用拖车
export function changeTrialStatus(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ts/changeStatus',
    method: 'post',
    params: data
  }
  return request(params)
}

// ----------------------------------------拖车服务配置-----------------------------------------

export interface ITrialerRequest {
  id: snu, // 服务编码
  name: snu, // 服务名称
  abbr: snu, // 服务简称
  countryId: snu, // 所在国家
  subtypeId: snu, // 服务类型
  ksIds: any, // 关联服务编码
  belong: snu, // 分配客户
  terms: snu // 条款
  [propName: string]: snu
}

// 查询拖车服务列表数据
export function getTrailerList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/tsc/getTscList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 添加编辑拖车数据
export function saveTrialerData(data:ITrialerRequest): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/tsc/saveTsc',
    method: 'post',
    data
  }
  return request(params)
}

// 修改拖车状态
export function modifyTrailerStatus(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/tsc/changeStatus',
    method: 'post',
    params: data
  }
  return request(params)
}

// 删除拖车配置
export function deleteTrailerData(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/tsc/deleteTsc',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 查询代理列表
export function queryAgentList(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/tsc/getAgentList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 保存编辑代理
export function saveAgent(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/tsc/saveAgent',
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

// 服务类型查询
export function getServiceSubtypeList(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceSubtypeList',
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

// 查询货币列表
export function geCurrencyList(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/currency/getCurrencyList',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getPortList(data: object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/ports/getPortList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 添加拖车服务
export function addTrailerService(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ts/addTs',
    method: 'post',
    data
  }
  return request(params)
}

// 查询拖车服务列表
export function getTrailerServicelist(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ts/getTsList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询fba仓库列表
export function getFbastoreList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/fbastore/getFbastoreList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询目的地接口
export function getAddressList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/tsc/find_objective',
    method: 'post',
    data
  }
  return request(params)
}

// 查询目的地接口
export function saveAddress(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/tsc/save_objective',
    method: 'post',
    data
  }
  return request(params)
}

// 获取全部柜型
export function getCabinetList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/container/getContainerList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 保存柜型
export function saveCabinetList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/tsc/save_cabinet',
    method: 'post',
    data
  }
  return request(params)
}

// 保存港口等地址
export function saveAddressOther(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/tsc/save_address',
    method: 'post',
    data
  }
  return request(params)
}

// 获取已关联柜型
export function getServiceCabinetList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/tsc/find_cabinet',
    method: 'post',
    data
  }
  return request(params)
}

// 查询街道根据城市
export function getAllStreet(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getAllStreet',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询国内区域
export function getRegionList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/region/getRegionList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询区域
export function getAllAreaList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area_type/page',
    method: 'post',
    data
  }
  return request(params)
}
