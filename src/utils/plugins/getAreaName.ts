type snu = string | number | undefined

type AreaNames = {
  stateName: snu
  cityName: snu,
  countyName: snu,
  [propName: string]: any
}

type OptionsType = {
  id: string,
  name: string
}

export interface IAreaName {
  (ids: any[], areaTreeList: any[]): AreaNames
}

// 根据id集合递归获取州省市区name
export const getAreaName: IAreaName = (ids: any[], areaTreeList: any[], options?: OptionsType) => {
  const result = {
    stateName: '',
    cityName: '',
    countyName: ''
  }
  const stateId = ids[0]
  const cityId = ids[1]
  const countyId = ids[2]

  const stateItem = (areaTreeList || []).find((item: any) => item.id === stateId) || {}
  result.stateName = stateItem.name || ''

  const cityItem = (stateItem.children || []).find((item: any) => item.id === cityId) || {}
  result.cityName = cityItem.name || ''

  const countyItem = (cityItem.children || []).find((item: any) => item.id === countyId) || {}
  result.countyName = countyItem.name || ''

  return result
}
