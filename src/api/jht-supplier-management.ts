import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

// 获取国家列表
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
// 查询供应商列表
export function getSupplierList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/supplier/getSupplierList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 删除供应商
export function deleteSupplier(id: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/supplier/deleteSupplier',
    method: 'delete',
    params: {
      id
    }
  }
  return request(params)
}

// 保存供应商
export function saveSupplier(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/supplier/saveSupplier',
    method: 'post',
    data
  }
  return request(params)
}

// 查询供应商详情
export function getSupplier(id: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/supplier/getSupplier',
    method: 'get',
    params: {
      id
    }
  }
  return request(params)
}
// 启用/禁用供应商
export function changeStatus(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/supplier/changeStatus',
    method: 'post',
    params: data
  }
  return request(params)
}

// 获取服务大类列表
export function getServiceTypeList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceTypeList',
    method: 'get',
    params: {
      custType: 1 // 供应商
    }
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

export function getRelatedPersonList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/supplier/getStaffList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 保存关联人员
export function SaveRelatedPerson(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/supplier/saveStaff',
    method: 'post',
    data
  }
  return request(params)
}

// 查询企业联系人列表
export function getPersonData(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/contact/getContactList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 保存企业联系人信息
export function savePersonData(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/contact/saveContact',
    method: 'post',
    data
  }
  return request(params)
}

// 保存企业联系人信息
export function queryPersonDetail(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/contact/getContact',
    method: 'get',
    params: data
  }
  return request(params)
}

// 删除企业联系人信息
export function deletePersonData(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/contact/deleteContact',
    method: 'delete',
    params: data
  }
  return request(params)
}
// 获取企业联系地址
export function getAddressData(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/address/getAddressList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 保存企业联系地址信息
export function saveAddressData(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/address/saveAddress',
    method: 'post',
    data
  }
  return request(params)
}

// 查询联系地址
export function getAddressDetail(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/address/getAddress',
    method: 'get',
    params: data
  }
  return request(params)
}

export function deleteAddressData(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/address/deleteAddress',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 查询联系地址
export function setDefaultAddress(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/address/setAddressDefault',
    method: 'post',
    params: data
  }
  return request(params)
}
// 获取开票信息列表
export function getBillData(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/invoice/getInvoiceList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 查询货币列表
export function getCurrencyList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/currency/getCurrencyList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 保存企业开票信息信息
export function saveBillData(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/invoice/saveInvoice',
    method: 'post',
    data
  }
  return request(params)
}

// 查询开票信息 详情
export function getBillDetail(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/invoice/getInvoice',
    method: 'get',
    params: data
  }
  return request(params)
}
// 删除企业开票信息
export function deleteBillData(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/invoice/deleteInvoice',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 获取收款账户地址
export function getAccountData(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/acct/getAcctList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 获取收款列表
export function getCollectionData(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/acct/getAcctList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 保存收款列表
export function saveCollectionData(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/acct/saveAcct',
    method: 'post',
    data
  }
  return request(params)
}
// 查询开票信息 详情
export function getCollectionDetail(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/acct/getAcct',
    method: 'get',
    params: data
  }
  return request(params)
}

// 删除收款信息
export function deleteCollectionData(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/acct/deleteAcct',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 查询文件列表
export function getFileData(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/doc/getDocList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 保存文件
export function saveFileData(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/doc/saveDoc',
    method: 'post',
    data
  }
  return request(params)
}
// 获取文件路径
export function getFilePath(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/util/getFileUrl',
    method: 'get',
    params: data
  }
  return request(params)
}
// 查询文件 详情
export function getFileDetail(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/doc/getDoc',
    method: 'get',
    params: data
  }
  return request(params)
}

// 删除文件
export function deleteFileData(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/doc/deleteDoc',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 查询文件列表
export function getSettingData(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/bookc/getBookcList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 保存个人设置
export function saveSettingData(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/bookc/saveBookc',
    method: 'post',
    data
  }
  return request(params)
}

// 查询个人设置详情
export function getSettingDetail(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/bookc/getBookc',
    method: 'get',
    params: data
  }
  return request(params)
}

// 删除个人设置
export function deleteSettingData(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/bookc/deleteBookc',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 设置默认订舱联系人
export function setDefaultSetting(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/bookc/setBookcDefault',
    method: 'post',
    params: data
  }
  return request(params)
}
