import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

// 获取供应商列表
export function getSupplierList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/supplier/getSupplierList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 根据服务及服务国家获取供应商
export function getSupplierListByType(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/getcustlist',
    method: 'post',
    data
  }
  return request(params)
}
// 获取代理商列表
export function getAgentList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/agent/getAgentList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 获取供应商开通的专线小类
export function getSubtypeBySupplier(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/getSubtypeByCustAndType',
    method: 'get',
    params: data
  }
  return request(params)
}
// 获取专线服务小类
export function getSubtypeByType(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceSubtypeList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 获取国家根据企业开通服务
export function getCountryBySupplier(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/countries',
    method: 'get',
    params: data
  }
  return request(params)
}
// 获取国家根据企业开通服务
export function getCountryList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCountryList',
    method: 'get'
  }
  return request(params)
}
// 获取交货区域
export function getDeliveryCity(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/getDeliveryCity',
    method: 'get'
  }
  return request(params)
}
// 获取专线服务
export function getLscComplicatedList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/condition',
    method: 'post',
    data
  }
  return request(params)
}
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

// 查询计费配置
export function getChargeList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/measure/getMeasureList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 获取专线服务报价横纵轴配置
export function getPriceConfig(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/axis/getAxisSet',
    method: 'get',
    params: data
  }
  return request(params)
}
// 获取区域详情
export function groupByPid(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: 'setting/area_type/groupbypid',
    method: 'post',
    data
  }
  return request(params)
}
// 新增报价
export function savePrice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/takeout/add',
    method: 'post',
    data
  }
  return request(params)
}
// 编辑报价
export function editPrice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/takeout/update',
    method: 'post',
    data
  }
  return request(params)
}
// 审核报价
export function auditPrice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/takeout/audit',
    method: 'post',
    data
  }
  return request(params)
}
// 获取报价列表
export function getPriceList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/takeout/page',
    method: 'post',
    data
  }
  return request(params)
}
// 获取报价详情
export function getPriceById(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/takeout/info',
    method: 'get',
    params: data
  }
  return request(params)
}
// 报价失效
export function invalidPrice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/takeout/doExpire',
    method: 'get',
    params: data
  }
  return request(params)
}
// 服务报价历史
export function getHistoryList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/takeout/history',
    method: 'get',
    params: data
  }
  return request(params)
}
// 获取报价详情
export function deletePriceById(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/takeout/delete',
    method: 'delete',
    params: data
  }
  return request(params)
}
