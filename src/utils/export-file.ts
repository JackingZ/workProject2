import { ResponseType } from 'axios'

export interface IExportFile {
  (blob: ResponseType, filename: string, suffix?: string): void
}

export const exportFile: IExportFile = (
  blob: ResponseType,
  fileName: string,
  suffix?: string
) => {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.href = url
  a.download = suffix ? `${fileName}${suffix}` : `${fileName}.xls`
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
