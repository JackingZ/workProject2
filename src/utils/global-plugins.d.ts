import Vue, { VNode } from 'vue'
import { Ilocalstorage } from '@/utils/localstorage.ts'
import { IExportFile } from '@/utils/export-file.ts'
import { IUploadRequest, DUploadRequest } from '@/utils/uploadFile.ts'
import { IThousandthSeparator } from '@/utils/plugins/thousandth-separator.ts'
import { IFormatCurrency } from '@/utils/plugins/format-currency.ts'

declare module 'vue/types/vue' {
  interface Vue {
    $Vls: Ilocalstorage
    $exportFile: IExportFile
    $upload: IUploadRequest
    $deleteLoad: DUploadRequest
    $toThousands: IThousandthSeparator
    $formatCurrency: IFormatCurrency
    $formatAreas: any,
    $getAreaName: any
  }
}
