// import { uploadQuoteFile } from '@/api/public'
import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

// interface IQuoteUploadRequest {
//   (data: FormData, type:string): AxiosPromise<any>
// }
export const upload = (
  data: FormData,
  type:string
): AxiosPromise<any> => {
  const form = data
  // form.append('content-subtypeId', 'multipart/form-data')
  const url = importUrlList(type)
  const params: AxiosRequestConfig = {
    url,
    method: 'post',
    headers: {
      'content-subtypeId': 'multipart/form-data'
    },
    data: form
  }
  return request(params)
}

function importUrlList(type:any) {
  // const BASE_API: string | undefined = process.env.VUE_APP_BASE_API
  // const baseUrl: string | undefined = `${BASE_API}`
  // const baseUrl = 'http://47.90.126.155:9000/dev-api'
  const list:any = {
    '00': `/quote/express/importBoxQuote`,
    '01': `/quote/truck/importQuote`,
    '02': `/quote/booking/importQuote`,
    '03': `/quote/customs/importQuote`,
    '04': `/quote/storage/importQuote`,
    '05': `/quote/line/importQuote`,
    '06': `/quote/trailer/importQuote`,
    '10': `/quote/express/importPublicQuote`
  }
  return list[type]
}
