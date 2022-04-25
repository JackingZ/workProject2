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

// 查询列表数据
export function getCustRatingList(data: {
  page: number
  size: number
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/credit/getCustRatingList',
    method: 'post',
    data
  }
  return request(params)
}
// 编辑保存
export function saveCustRating(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/credit/saveCustRating',
    method: 'post',
    data
  }
  return request(params)
}

// 删除
export function deleteCustRating(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/credit/deleteCustRating',
    method: 'post',
    params: data
  }
  return request(params)
}
