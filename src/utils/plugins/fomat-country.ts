// 格式化国家

export function formatCountry(item: any) {
  const countryInfo = item || {}
  let result = item ? `${countryInfo.name}-${countryInfo.alias}` : ''
  return result
}
