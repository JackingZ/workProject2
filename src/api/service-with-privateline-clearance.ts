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

// 服务类型查询
export function getServiceSubtypeList(data:any): AxiosPromise<any> {
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
export function getCurrencyList(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/currency/getCurrencyList',
    method: 'get',
    params: data
  }
  return request(params)
}

// ----------------------------------------专线业务配置--------------------------------------
//  添加仓储服务
export function addPrivateLineService(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ls/addLs',
    method: 'post',
    data
  }
  return request(params)
}
// 修改仓储服务
export function updatePrivateLineService(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ls/updateLs',
    method: 'post',
    data
  }
  return request(params)
}

// 查询报关区域列表
export function getCustomsArea(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/cs/getCsRegion',
    method: 'get'
  }
  return request(params)
}

// 删除专线服务
export function deletePrivateLineService(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ls/deleteLs',
    method: 'delete',
    params: data
  }
  return request(params)
}
// 获取FBA仓库列表
export function queryFbaStoreData(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/fbastore/getFbastoreList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询FBA专线列表
export function queryFbaChannelList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/channel/getChannelList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 设置区域专线
export function setAreaSave(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ls/saveRegion',
    method: 'post',
    data
  }
  return request(params)
}

// 启用禁用专线服务
export function changePrivatelineStatus(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ls/changeStatus',
    method: 'post',
    params: data
  }
  return request(params)
}

// ----------------------------------------专线服务配置--------------------------------------
// 专线服务列表
export function getLscList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
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
export function getLscById(data: {
  id: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/getLsc',
    method: 'get',
    params: data
  }
  return request(params)
}

// 新增编辑专线
export function saveLsc(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/saveLsc',
    method: 'post',
    data
  }
  return request(params)
}

// 启用禁用专线
export function changeStatus(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/changeStatus',
    method: 'post',
    params: data
  }
  return request(params)
}

// 删除专线服务
export function deleteLsc(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/deleteLsc',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 查询表格专线代理商
export function getAgentsById(data: {
  lscId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/getAgentList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 保存专线代理商
export function saveAgent(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/saveAgent',
    method: 'post',
    data
  }
  return request(params)
}

// 查询机场港口地址代码列表
export function getPortList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/ports/getPortList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询成本组列表
export function getCostgroupList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/finance/costgroup/getCostgroupList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 快递服务配置
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

export function getDeliveryList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/getDeliveryCity',
    method: 'get'
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
export function getProductTypeList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/getProductAll',
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

// 查询报关服务列表
export function getCscList(data: {
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

// 查询卡派服务配置列表数据
export function getKscList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ksc/getKscList',
    method: 'post',
    data
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

export function getPriceConfig(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/axis/getAxisSet',
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

// 获取某个国家的州/省
export function getStateByCountry(data: {
  countryId: string | number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getStateByCountry',
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
// 查询区域
export function getAllAreaList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area_type/page',
    method: 'post',
    data
  }
  return request(params)
}

export function getOrgCompany(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/org/getOrgList',
    method: 'get',
    params: data
  }
  return request(params)
}
