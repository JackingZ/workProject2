import request from '@/utils/request'
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios'
import { downloadBaseUrl } from '@/utils/config'
import OSS from 'ali-oss'

// 客户端上传文件
// export async function uploadFile(
//   data: FormData,
//   fileName: string = 'default'
// ): Promise<any> {
//   const params: AxiosRequestConfig = {
//     url: '/setting/util/ossSecret',
//     method: 'get'
//   }
//   // 获取临时授权
//   const stsConf = await request(params)
//   const { data: conf } = stsConf
//   const client = new OSS({
//     region: 'oss-cn-shenzhen',
//     accessKeyId: conf.AccessKeyId,
//     accessKeySecret: conf.AccessKeySecret,
//     stsToken: conf.SecurityToken,
//     bucket: 'aplushk'
//   })
//   return client.multipartUpload(fileName, data)
// }

// 上传文件，上传到公共库或者私有库
export async function uploadFile(
  isPublic: boolean,
  data: any,
  fileName: string = 'default'
): Promise<any> {
  const form: FormData = new FormData()
  // form.append('content-subtypeId', 'multipart/form-data')
  form.append('file', data)
  form.append('isPublic', isPublic as any)
  form.append('key', fileName)
  const params: AxiosRequestConfig = {
    url: '/setting/util/uploadFile',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
      'content-subtypeId': 'multipart/form-data'
    },
    data: form

  }
  return request(params)
}

// 删除公有库私有库文件
export async function deleteFile(
  id: string,
  isPublic: boolean
): Promise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/util/deleteFile',
    method: 'post',
    params: {
      id,
      isPublic
    }
  }
  return request(params)
}
// 状态字典
export function getStatusList(): Promise<any> {
  const params: AxiosRequestConfig = {
    url: '/orders/fullorder/status',
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

/**
 * 获取国家根据企业开通服务
 * @param custId 企业ID 必传
 * @param typeId 服务大类ID 必传
 */
export function getCountryByCustSerice(data: {
  custId: string
  typeId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/countries',
    method: 'get',
    params: data
  }
  return request(params)
}
