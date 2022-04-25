import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

export interface ICardPadRequest {
  id: snu, // 服务编码
  name: snu, // 服务名称
  abbr: snu, // 服务简称
  countryId: snu, // 所在国家
  subtypeId: snu, // 服务类型
  ksIds: snu, // 关联服务编码
  density: snu, // 密度比
  belong: snu, // 分配客户
  umDistance: snu, // 距离单位
  umWeight: snu, // 重量单位
  umVolume: snu, // 体积单位
  densityP: snu, // 同行体积密度
  densityC: snu, // 直客体积密度
  terms: snu, // 条款
  [propName: string]: snu
}

// 查询卡派服务配置列表数据
export function getTruckList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ksc/getKscList',
    method: 'post',
    data
  }
  return request(params)
}
export function getTruckById(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ksc/' + data.id,
    method: 'get',
    params: data
  }
  return request(params)
}
// 添加编辑卡派数据
export function saveCardpadData(data:ICardPadRequest): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ksc/saveKsc',
    method: 'post',
    data
  }
  return request(params)
}

// 修改卡派状态
export function modifyCardPadStatus(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ksc/changeStatus',
    method: 'post',
    params: data
  }
  return request(params)
}

// 删除卡派配置
export function deleteCardPad(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ksc/deleteKsc',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 保存编辑代理
export function saveAgent(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: `/cfg/ksc/saveAgent`,
    method: 'post',
    data
  }
  return request(params)
}

// 查询代理列表
export function queryAgentList(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ksc/getAgentList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询服务组合
export function getSvcGroupList(data: {
  typeId: string,
  page: number,
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/svcgroup/getSvcGroupList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 删除服务组合
export function deleteSvcGroup(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/svcgroup/deleteSvcGroup',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 保存编辑服务组合
export function saveSvcGroup(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: `/cfg/svcgroup/saveSvcGroup`,
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

// 查询卡派服务列表数据
export function getCardpadList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ksc/getKscList',
    method: 'post',
    data
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

export function getLscComplicatedList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/condition',
    method: 'post',
    data
  }
  return request(params)
}

// 获取代理是接口
export function getCustTypeList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/getCustTypeList',
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

// 查询代码地址列表
export function getPortList(data: object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/ports/getPortList',
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

// 查询目的地
export function getPurpostList(data: {
  page: number,
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ksc/destination/page',
    method: 'post',
    data
  }
  return request(params)
}
// 删除目的地
export function deletePurpost(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ksc/destination/del',
    method: 'post',
    data
  }
  return request(params)
}

// 保存编辑目的地
export function addPurpost(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: `/cfg/ksc/destination/add`,
    method: 'post',
    data
  }
  return request(params)
}
export function updatePurpost(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: `/cfg/ksc/destination/update`,
    method: 'post',
    data
  }
  return request(params)
}

// 获取车型列表接口
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

// 新增编辑区间
export function saveRange(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ksc/range/save',
    method: 'post',
    data
  }
  return request(params)
}

// 查看区间/车型
export function viewRange(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ksc/range/get',
    method: 'post',
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
