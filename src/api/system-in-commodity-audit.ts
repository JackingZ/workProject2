import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

export interface IAuditRequest {
  name: snu, // 机构名称
  alias: snu, // 英文名称
  um: snu, // 计量单位
  brand: snu, // 品牌
  model: snu, // 规格
  materialZh: snu, // 中文材质
  materialEn: snu, // 英文名材质
  usageZh: snu, // 中文用途
  usageEn: snu, // 英文用途
  picture: snu, // 商品图片
  hsCode: snu, // 海关编码
  addtaxCode: snu, // 追加税号
  taxRate: snu, // 税率
  addtaxRate: snu, // 追加税率
  customUm: snu, // 关税计量单位
  confirm: snu // 通关认证
  [propName: string]: any
}

// 查询海关编码
export function getCustomsCode(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '',
    method: 'get',
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

// 获取币种
export function getCurrencyList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/currency/getCurrencyList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询商品审核列表数据
export function getProductAuditList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/library/get_declare_examine',
    method: 'post',
    data
  }
  return request(params)
}
// 商品审核
export function saveApprovedAudit(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/library/approved',
    method: 'post',
    data
  }
  return request(params)
}
// 定义价格
export function saveCommodityAudit(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/library/save_declare',
    method: 'post',
    data
  }
  return request(params)
}

// 海关编码
export function getCode(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/customs_price/customs_get',
    method: 'post',
    data
  }
  return request(params)
}

// 认证文件
export function getFile(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/library/get_file',
    method: 'post',
    params: data
  }
  return request(params)
}

// 选择产品库
export function getProductListById(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/library/get_product',
    method: 'post',
    data
  }
  return request(params)
}

// 计量单位
export function getUnitList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/library/get_unit',
    method: 'post'
  }
  return request(params)
}

// 商品类别
export function getGoodsList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/product/get_tree',
    method: 'post',
    data
  }
  return request(params)
}

export function getProductList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/library/get_product',
    method: 'post',
    data
  }
  return request(params)
}

export function getFactorList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/essential/page_library',
    method: 'post',
    data
  }
  return request(params)
}
export function getFactorCode(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/essential/get_custom_by_country',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getFileList(data: {
  declareId: snu
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/library/get_file_list',
    method: 'post',
    params: data
  }
  return request(params)
}

export function getRates(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/customs_price/get_rates',
    method: 'get',
    params: data
  }
  return request(params)
}

export function auditFile(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/library/audit_file',
    method: 'post',
    data
  }
  return request(params)
}

export function saveFileList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/library/save_file',
    method: 'post',
    data
  }
  return request(params)
}

export function getProductToCustomerList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fullorder/commodityDeclarationPage',
    method: 'post',
    data
  }
  return request(params)
}
