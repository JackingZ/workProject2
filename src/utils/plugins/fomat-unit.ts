/**
 * 根据长度单位获取体积单位
 * @param unit 长度单位
 * @returns {*} 长度单位对应的体积单位
 */
export function getVolumeUnitByLengthUnit(unit: string) {
  if (!unit) return ''
  unit = unit.toUpperCase()
  switch (unit) {
    case 'CM':
      return 'CBCM'
    case 'M':
      return 'CBM'
    case 'IN':
      return 'CBCH'
    case 'FT':
      return 'CUFT'
    default:
      return unit
  }
}

/**
 *各个单位转换
 * @param num 值
 * @param unitname 原单位
 * @param outunitname 目标单位
 * @param fixedLength 保留小数默认为3
 * @returns {*} 转换后目标单位值
 */
export function unitConversion(num: number, unitname: string, outunitname: string, fixedLength: number) {
  if (!unitname || !outunitname || String(num) === '' || String(num) === 'null' || String(num) === 'undefined') return num
  fixedLength = fixedLength || 3
  unitname = unitname.toUpperCase()
  outunitname = outunitname.toUpperCase()
  const fRate: any = {
    // 重量
    KGS: { KGS: 1, LBS: 2.2046226, OZS: 35.2739619 },
    LBS: { KGS: 0.4535924, LBS: 1, OZS: 16 },
    OZS: { KGS: 0.0283495, LBS: 0.0625, OZS: 1 },
    // 长度
    CM: { CM: 1, M: 0.01, INCH: 0.3937008, FT: 0.0328084 },
    M: { CM: 100, M: 1, INCH: 39.3700787, FT: 3.2808399 },
    INCH: { CM: 2.54, M: 0.0254, INCH: 1, FT: 0.0833333 },
    FT: { CM: 30.48, M: 0.3048, INCH: 12, FT: 1 },
    // 体积
    CBCM: { CBCM: 1, CBM: 1e-6, CBCH: 0.0610238, CUFT: 0.0000353 },
    CBM: { CBCM: 1000000, CBM: 1, CBCH: 61023.8445022, CUFT: 35.3147248 },
    CBCH: { CBCM: 16.387037, CBM: 0.0000164, CBCH: 1, CUFT: 0.0005787 },
    CUFT: { CBCM: 28316.8, CBM: 0.0283168, CBCH: 1728, CUFT: 1 }
  }
  let rate = 1
  try {
    rate = fRate[unitname][outunitname]
  } catch (e) {
    rate = 1
  }
  const tnum = (num * rate)
  return parseFloat(tnum.toFixed(fixedLength))
}

export function fomatLength(unit: string) {
  if (!unit) return ''
  unit = unit.toUpperCase()
  switch (unit) {
    case 'CM':
      return 'cm'
    case 'M':
      return 'm'
    case 'IN':
      return 'in'
    case 'FT':
      return 'ft'
    default:
      return unit
  }
}

export function fomatVolume(unit: string) {
  if (!unit) return ''
  unit = unit.toUpperCase()
  switch (unit) {
    case 'CBCM':
      return 'cm³'
    case 'CBM':
      return 'm³'
    case 'CBCH':
      return 'in³'
    case 'CUFT':
      return 'ft³'
    default:
      return unit
  }
}
export function fomatWeight(unit: string) {
  if (!unit) return ''
  unit = unit.toUpperCase()
  switch (unit) {
    case 'KGS':
      return 'kg'
    case 'LBS':
      return 'lb'
    case 'OZS':
      return 'oz'
    default:
      return unit
  }
}

export function fomatWeightKey(unit: string) {
  if (!unit) return ''
  unit = unit.toUpperCase()
  switch (unit) {
    case 'KG':
      return 'KGS'
    case 'LB':
      return 'LBS'
    case 'OZ':
      return 'OZS'
    default:
      return unit
  }
}
