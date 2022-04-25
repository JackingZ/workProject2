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

export interface LoactionCodeRequest {
  countryId: snu
  countryName: snu
  esId: snu
  id: snu
  name: snu
  orgId: snu
  orgName: snu
}

export interface DistinctRequest {
  countryId: snu
  countryName: snu
  destinations: any
  esId: snu
  id: ''
  name: snu
  orgId: snu
  orgName: snu
}

export interface StartPostRequest {
  id: snu,
  postalE: snu,
  postalS: snu,
  zonesId: snu
}
export interface EndPostRequest {
  id: snu,
  postalE: snu,
  postalS: snu,
  zonedId: snu
}
export interface RelateCountryRequest {
  zoneId: snu,
  countries:any
}
// -----------------------------------快递业务配置-------------------------------------------------
//  添加快递服务
export function addExpressServiceData(data: IExpressRequest): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/es/addEs',
    method: 'post',
    data
  }
  return request(params)
}
// 更新快递服务
export function updateExpressServiceData(data: IExpressRequest): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/es/updateEs',
    method: 'post',
    data
  }
  return request(params)
}

// 查询报关服务列表数据
export function getExpressList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/eapi/getExpressList',
    method: 'get'
  }
  return request(params)
}
// 删除快递服务
export function deleteExpressList(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/es/deleteEs',
    method: 'delete',
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

// 查询快递公司列表
export function getExpressCompany(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/org/getOrgList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 改变快递状态
export function changeExpressStatus(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/es/changeStatus',
    method: 'post',
    params: data
  }
  return request(params)
}
// 查询起运地列表
export function getExpressStartLocationList(data: {
  page: number
  size: number
  countryId:string
  esId:string
  id:string
  orgId:string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/zones/getZonesList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 新增保存起运地代码
export function addEditExpressStartCode(data: LoactionCodeRequest): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/zones/saveZones',
    method: 'post',
    data
  }
  return request(params)
}
// 删除起运地代码
export function deleteExpressStartCode(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/zones/deleteZones',
    method: 'delete',
    params: data
  }
  return request(params)
}
// 查询目的地列表
export function getExpressEndLocationList(data: {
  page: number
  size: number
  countryId:string
  esId:string
  id:string
  orgId:string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/zoned/getZonedList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 新增保存目的地代码
export function addEditExpressEndCode(data: LoactionCodeRequest): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/zoned/saveZoned',
    method: 'post',
    data
  }
  return request(params)
}
// 删除目的地代码
export function deleteExpressEndCode(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/zoned/deleteZoned',
    method: 'delete',
    params: data
  }
  return request(params)
}
// 查询国际分区
export function getExpressDistinctList(data: {
  page: number
  size: number
  countryId:string
  esId:string
  id:string
  orgId:string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/zone/getZoneList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 新增保存国际分区
export function addEditExpressDistinctCode(data: DistinctRequest): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/zone/saveZone',
    method: 'post',
    data
  }
  return request(params)
}
// 删除国际分区
export function deleteExpressDistinctCode(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/zone/deleteZone',
    method: 'delete',
    params: data
  }
  return request(params)
}
// 查询国际分区关联国家
export function getExpressDistinctRelateList(data: {
  zoneId:string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/zone/getZoneCountryList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 新增保存国际分区关联国家
export function addEditExpressDistinctRelateCode(data: RelateCountryRequest): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/zone/saveZoneCountry',
    method: 'post',
    data
  }
  return request(params)
}

// 查询起运地邮编
export function getStartPostList(data: {
  page: number
  size: number
  esId:string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/zones/getZonesPostalList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 新增保存起运地邮编
export function addEditStartPost(data: StartPostRequest): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/zones/saveZonesPostal',
    method: 'post',
    data
  }
  return request(params)
}
// 删除起运地邮编
export function deleteStartPost(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/zones/deleteZonesPostal',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 查询目的地邮编
export function getEndPostList(data: {
  page: number
  size: number
  zonesId:string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/zoned/getZonedPostalList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 新增保存目的地邮编
export function addEditEndPost(data: StartPostRequest): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/zoned/saveZonedPostal',
    method: 'post',
    data
  }
  return request(params)
}
// 删除目的地邮编
export function deleteEndPost(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/zoned/deleteZonedPostal',
    method: 'delete',
    params: data
  }
  return request(params)
}

export function CopyTargetCode(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/zoned/copyPostals',
    method: 'post',
    data
  }
  return request(params)
}

// -----------------------------------快递服务配置-----------------------------------------------
export function getEscList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/esc/getEscList',
    method: 'post',
    data
  }
  return request(params)
}
export function getEscById(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/esc/get',
    method: 'get',
    params: data
  }
  return request(params)
}

export function saveEsc(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/esc/saveEsc',
    method: 'post',
    data
  }
  return request(params)
}
export function updateEsc(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/esc/updateEsc',
    method: 'post',
    data
  }
  return request(params)
}
export function getAgentsById(data: {
  escId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/esc/getAgentList',
    method: 'get',
    params: data
  }
  return request(params)
}

export function saveAgent(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/esc/saveAgent',
    method: 'post',
    data
  }
  return request(params)
}

export function deleteEsc(data: { id: snu }): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/esc/deleteEsc',
    method: 'delete',
    params: data
  }
  return request(params)
}

export function changeStatus(data: { id: snu }): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/esc/changeStatus',
    method: 'post',
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

// 服务类型查询
export function getServiceSubtypeList(data:object): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceSubtypeList',
    method: 'get',
    params: data
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

// 物流接口账号
export function getLogisticsPort(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/express/web/expressparam/names',
    method: 'post',
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

export function getPayMethod(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/dict/payMethod',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getPkgCode(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/dict/pkgCode',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getDPDserviceType(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: `express/dpdtest/listColoaderServiceType?shortCode=${data}`,
    method: 'get'
  }
  return request(params)
}
export function getServiceCode(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/dict/serviceCode',
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

export function getSpecialById(data: {
  escId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/esc/getAddress',
    method: 'get',
    params: data
  }
  return request(params)
}

export function saveSpecial(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/esc/addAddress',
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

// 查询区域
export function getAllAreaList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area_type/page',
    method: 'post',
    data
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

export function savePriceConfig(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/axis/saveAxis',
    method: 'post',
    data
  }
  return request(params)
}

export function getPriceConfig(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/axis/getAxisSet',
    method: 'get',
    params: data
  }
  return request(params)
}
