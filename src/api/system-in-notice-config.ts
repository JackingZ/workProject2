import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

// 查询
export function getNoticeList(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/msg_role/get_role',
    method: 'post'
  }
  return request(params)
}

// 保存
export function updateNotice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/msg_role/update_role',
    method: 'post',
    data
  }
  return request(params)
}
export function saveNotice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/msg_role/open_close',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getServiceTypeListById(data: {
  custId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/custtype/getServiceTypes',
    method: 'get',
    params: data
  }
  return request(params)
}

// 服务大类列表
export function getServiceTypeList(data: {
  custType: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceTypeList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 服务小类列表
export function getServiceSubtypeList(data: {
  typeId: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceSubtypeList',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getUserList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/user/user4position',
    method: 'post',
    data
  }
  return request(params)
}

export function getPersonList(data?: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/msg_role/get_customer',
    method: 'get',
    params: data
  }
  return request(params)
}

export function savePerson(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/msg_role/save_customer',
    method: 'post',
    data
  }
  return request(params)
}
export function editPerson(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/msg_role/edit_customer',
    method: 'post',
    data
  }
  return request(params)
}
export function deletePerson(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/msg_role/delete_customer',
    method: 'get',
    params: data
  }
  return request(params)
}

export function getInfoList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/msg_notice/queryAll',
    method: 'post',
    data
  }
  return request(params)
}

export function updateInfo(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/msg_notice/updateRead',
    method: 'post',
    params: data
  }
  return request(params)
}

// 查询
export function getManageList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/msg_management/queryList',
    method: 'post',
    params: data
  }
  return request(params)
}
// 轮询
export function getRotationNotice(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/msg_notice/getRotationNotice',
    method: 'get'
  }
  return request(params)
}

export function closeRotationNotice(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/msg_notice/updateNotice',
    method: 'post',
    params: data
  }
  return request(params)
}
// 保存
export function updateManage(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/msg_management/associatedServices',
    method: 'post',
    data
  }
  return request(params)
}

export function updateTemplate(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/msg_management/updateTemplate',
    method: 'post',
    data
  }
  return request(params)
}
