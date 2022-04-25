import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

// 商品审核
export function fullOrderAuditProduct(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fullorder/audit_product',
    method: 'post',
    data
  }
  return request(params)
}
// 文件审核
export function fullOrderAuditProductFile(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fullorder/audit_product_file',
    method: 'post',
    data
  }
  return request(params)
}
// 计算税金
export function getCustomsCode(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/customs_price/getCustomsCode',
    method: 'post',
    data
  }
  return request(params)
}
// 生成到产品库
export function saveLibraryDeclare(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/library/save_library_declare',
    method: 'post',
    data
  }
  return request(params)
}
// 获取货币根据使用地区
export function getCurrencyByCountry(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/currency/getCurrencyList',
    method: 'get',
    params: {
      page: 1,
      size: 999,
      ...data
    }
  }
  return request(params)
}
// 获取货币汇率
export function getExchangeList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/exchange/getExchangeList',
    method: 'get',
    params: data
  }
  return request(params)
}
// 根据编码获取参数
export function getNeedCode(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/customs_price/getNeedCode',
    method: 'get',
    params: data
  }
  return request(params)
}
// 获取海关编码税目
export function getRates(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/customs_price/get_rates',
    method: 'get',
    params: data
  }
  return request(params)
}
// 搜索海关编码
export function searchCustomsCode(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/price/customs_price/customs_get',
    method: 'post',
    data
  }
  return request(params)
}

// 商品类别
export function getProductClassList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/product/get_tree',
    method: 'post',
    data
  }
  return request(params)
}
// 商品类别
export function getProductList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/library/get_product',
    method: 'post',
    data
  }
  return request(params)
}
