/**
 * auth: Jhonor 2019.07.26
 * Here you can register the global plugin
 */

import HeadInfo from '@/components/HeadInfo/index.vue'
import AppDrawer from '@/components/Drawer/drawer.vue'
import AppSlide from '@/components/Slide/Slide.vue'
import ElTreeSelect from '@/components/ElTreeSelect/index.vue'
import DragModel from '@/components/DragModel/index.vue'
import VueScrollActive from 'vue-scrollactive'

import { Vls } from '@/utils/localstorage.ts'
import { exportFile } from '@/utils/export-file.ts'
import { upload, deleteLoad } from '@/utils/uploadFile.ts'
import { VueConstructor } from 'vue'
import { toThousands } from '@/utils/plugins/thousandth-separator.ts'
import { formatCurrency } from '@/utils/plugins/format-currency.ts'
import { formatAreas } from '@/utils/plugins/format-areas.ts'
import { getAreaName } from '@/utils/plugins/getAreaName.ts'
import { formatCountry } from '@/utils/plugins/fomat-country.ts'
import {
  unitConversion,
  getVolumeUnitByLengthUnit,
  fomatLength,
  fomatVolume,
  fomatWeight,
  fomatWeightKey
} from '@/utils/plugins/fomat-unit.ts'
import { checkPermission } from '@/utils/permission.ts'

interface plugins<T> {
  install: (Vue: VueConstructor, options?: T | undefined) => void
}

const globalPlugin: plugins<any> = {
  install: function(Vue, options) {
    // 注册全局组件
    Vue.component('HeadInfo', HeadInfo)
    Vue.component('AppDrawer', AppDrawer)
    Vue.component('AppSlide', AppSlide)
    Vue.component('ElTreeSelect', ElTreeSelect)
    Vue.component('DragModel', DragModel)
    Vue.use(VueScrollActive)

    // 注册全局方法
    Vue.prototype.$Vls = Vls // 操作localStorage
    Vue.prototype.$exportFile = exportFile // 导出文件
    Vue.prototype.$upload = upload // 上传文件
    Vue.prototype.$deleteLoad = deleteLoad // 删除文件
    Vue.prototype.$toThousands = toThousands
    Vue.prototype.$formatCurrency = formatCurrency // 金额千分位转换
    Vue.prototype.$formatAreas = formatAreas // 格式化省州市区级联数据
    Vue.prototype.$getAreaName = getAreaName
    Vue.prototype.$formatCountry = formatCountry
    Vue.prototype.$volumeConversion = unitConversion
    Vue.prototype.$getVolumeUnitByLengthUnit = getVolumeUnitByLengthUnit
    Vue.prototype.$fomatLength = fomatLength
    Vue.prototype.$fomatVolume = fomatVolume
    Vue.prototype.$fomatWeight = fomatWeight
    Vue.prototype.$fomatWeightKey = fomatWeightKey
    Vue.prototype.$checkPermission = checkPermission
  }
}

export default globalPlugin
