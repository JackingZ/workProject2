import { uploadFile, deleteFile } from '@/api/public'
import { AxiosPromise } from 'axios'

export interface IUploadRequest {
  (isPublic: boolean, data: FormData, fileName?: string): AxiosPromise<any>
}
export interface DUploadRequest {
  (id: string, isPublic: boolean): AxiosPromise<any>
}

export const upload: IUploadRequest = (
  isPublic: boolean,
  data: FormData,
  fileName?: string
): AxiosPromise<any> => {
  return uploadFile(isPublic, data, fileName)
}

export const deleteLoad: DUploadRequest = (
  id: string,
  isPublic: boolean
): AxiosPromise<any> => {
  return deleteFile(id, isPublic)
}
