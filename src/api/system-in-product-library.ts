import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

export interface IProductRequest {
  custId: snu, // 所属公司
  status: snu, // 产品状态
  goodsTypeId: snu, // 产品类别
  property: any[], // 产品属性
  name: snu, // 机构名称
  alias: snu, // 英文名称
  sku: snu, // SKU编码
  brand: snu, // 品牌
  model: snu, // 规格
  materialZh: snu, // 中文材质
  materialEn: snu, // 英文材质
  usageZh: snu, // 中文用途
  usageEn: snu, // 英文用途
  length: snu, // 长度
  width: snu, // 宽度
  height: snu, // 高度
  weight: snu, // 毛重
  netWeight: snu, // 净重
  pack: snu, // 包装类型
  temp: snu, // 仓储条件
  um: snu, // 计量单位
  purchase: snu, // 采购链接
  picture: snu, // 商品图片
  remark: snu // 备注
  [propName: string]: any
}

// 查询商品列表数据
export function getProductList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/library/get_all_data',
    method: 'post',
    data
  }
  return request(params)
}
// 商品新增编辑保存
export function saveAddEditProduct(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/library/save',
    method: 'post',
    data
  }
  return request(params)
}

// 获取报关信息列表
export function getDeclareList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/library/get_declare',
    method: 'post',
    data
  }
  return request(params)
}

// 保存修改删除报关信息
export function saveAddEditDeclare(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/library/save_declare',
    method: 'post',
    data
  }
  return request(params)
}

export function getAllCustList(data: {
  page: number
  size: number
  type: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/cust/searchCustList',
    method: 'get',
    params: data
  }
  return request(params)
}
export function getSupplierList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/supplier/getSupplierList',
    method: 'get',
    params: data
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

// 查询客户列表
export function getCustomerList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/customer/customer',
    method: 'post',
    data
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

// 商品类别
export function getGoodsList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/product/get_tree',
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

// 获取文件
export function getFileEmptyList(data: {
  declareId: snu
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/library/get_file_list',
    method: 'post',
    params: data
  }
  return request(params)
}

export function uploadSingleFile(data: {
  declareId: snu
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/library/upload',
    method: 'post',
    data
  }
  return request(params)
}
