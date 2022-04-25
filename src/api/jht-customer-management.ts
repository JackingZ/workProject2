import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

// export interface IPortRequest {
//   countryId: snu
//   countryName: snu
//   stateId: snu
//   stateName: snu
//   cityId: snu
//   cityName: snu
//   name: snu
//   alias: snu
//   code: snu
//   [propName: string]: any
// }
// 查询代理商列表
export function getAgentList(data: {
  page: number
  size: number
  parentId: string
  cityId?: string
  countryId?: string
  countyId?: string
  name?: string
  stateId?: string
  status?: string
  subtype?: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/agent/getAgentList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询客户列表
export function getCustomerList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const { page, size, ...model } = data
  const params: AxiosRequestConfig = {
    url: '/auth/customer/getCustomerList',
    method: 'post',
    data: {
      model,
      page,
      size
    }
  }
  return request(params)
}

// 新增机场港口
// export function savePort(data: IPortRequest): AxiosPromise<any> {
//   const params: AxiosRequestConfig = {
//     url: '/setting/ports/savePort',
//     method: 'post',
//     data
//   }
//   return request(params)
// }

// 启用/禁用客户
export function changeStatus(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/customer/changeStatus',
    method: 'post',
    params: data
  }
  return request(params)
}

// 删除客户
export function deleteCustomer(data: { id: snu }): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/customer/deleteCustomer',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 获取所有国家列表
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

// 客户详情
export function getCustomer(data: {
  id: snu
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/customer/getCustomer',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询用户列表
export function getUserList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/user/user4position',
    method: 'post',
    data
  }
  return request(params)
}
// 获取关联人员
export function getStaffList(data: {
  custId: snu
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/customer/getStaffList',
    method: 'get',
    params: data
  }
  return request(params)
}

export function saveStaff(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/customer/saveStaff',
    method: 'post',
    data
  }
  return request(params)
}
// 新增编辑客户
export function saveCustomer(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/customer/saveCustomer',
    method: 'post',
    data
  }
  return request(params)
}
// 客户审核
export function customerAudit(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/customer/customerAudit',
    method: 'post',
    data
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

export function getAgentById(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/agent/getAgent',
    method: 'get',
    params: data
  }
  return request(params)
}

// 客户导入
export function exportCustomer(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/excel/input',
    method: 'post',
    data
  }
  return request(params)
}
export function exportBelongCompany(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/customer/edit_parent',
    method: 'post',
    data
  }
  return request(params)
}

// 查询二级代理商非独立财务公司
export function getUnFinanceAgentList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/agent/customer_finance',
    method: 'get'
  }
  return request(params)
}

export function getUpdateFileStatus(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/customer/edit_sign',
    method: 'get',
    params: data
  }
  return request(params)
}
