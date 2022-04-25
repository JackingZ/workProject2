import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

// 历史版本
export function getEditionList(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '',
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

// 业务类型
export function getServiceSubtypeList(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceSubtypeList',
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

// 企业服务类别列表
export function getCustTypeList(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/queryAgents',
    method: 'post',
    data
  }
  return request(params)
}
// 企业服务类别列表
export function getCustList(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/queryAgents2',
    method: 'post',
    data
  }
  return request(params)
}

// 获取卡车服务
export function getCarServeList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ksc/getKscList',
    method: 'post',
    data
  }
  return request(params)
}

// 获取卡车服务报价坐标
export function getCarServeAxis(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/ksc/axis',
    method: 'post',
    params: data
  }
  return request(params)
}

// 获取报价列表
export function getPriceList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/truck/page',
    method: 'post',
    data
  }
  return request(params)
}
// 聚货通查看供应商的报价分页
export function getSupplierPriceList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/truck/page1',
    method: 'post',
    data
  }
  return request(params)
}

// 添加服务报价
export function addPrice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/truck/add',
    method: 'post',
    data
  }
  return request(params)
}

// 编辑服务报价
export function editPrice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/truck/update',
    method: 'post',
    data
  }
  return request(params)
}
// 删除服务报价
export function delPrice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/truck/del',
    method: 'delete',
    params: data
  }
  return request(params)
}
// 查看上级报价
export function superiorPrice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/truck/superior',
    method: 'post',
    data
  }
  return request(params)
}
// 特殊报价选择参考价
export function refStandard(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/truck/refStandard',
    method: 'post',
    data
  }
  return request(params)
}
// 审核
export function auditPrice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/truck/review',
    method: 'post',
    data
  }
  return request(params)
}
// 获取历史版本列表
export function getHistoryPriceList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/truck/history',
    method: 'get',
    params: data
  }
  return request(params)
}
// 获取历史版本信息
export function getHistoryPrice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/truck/history/get',
    method: 'get',
    params: data
  }
  return request(params)
}

// 报价失效
export function invalidPrice(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/truck/doExpire',
    method: 'get',
    params: data
  }
  return request(params)
}
