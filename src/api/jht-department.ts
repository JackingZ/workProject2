import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

type snu = string | number | undefined

export interface IDepartmentRequest {
  id: snu
  custId: string // 所属公司
  parentId: string // 上级部门
  name: string // 部门名称
  remark: string // 备注
  alias: string
  managers: any[],
  [propName: string]: any // 额外参数
}

// 新增/编辑部门
export function saveDept(data: IDepartmentRequest): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/dept/saveDept',
    method: 'post',
    data
  }
  return request(params)
}

// 查询部门列表
export function getDeptList(data: {
  custId: snu
  deptId: snu
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/dept/getDeptList',
    method: 'get',
    params: data
  }
  return request(params)
}

// 查询部门详情
export function getDept(data: { id: snu }): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/dept/getDept',
    method: 'get',
    params: data
  }
  return request(params)
}

// 删除部门
export function deleteDept(data: { id: snu }): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/dept/deleteDept',
    method: 'delete',
    params: data
  }
  return request(params)
}

// 修改部门状态
export function changeDeptStatus(data: {
  id: snu
  status: snu
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/dept/changeStatus',
    method: 'post',
    params: data
  }
  return request(params)
}
