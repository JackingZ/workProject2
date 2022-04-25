type ns = number | string | undefined

export interface IThousandthSeparator {
  (num: ns): ns
}

// 格式化金额的千分位方法
export function toThousands(num: ns) {
  let resNum = (num || 0).toString()
  let result = ''
  while (resNum.length > 3) {
    result = ',' + resNum.slice(-3) + result
    resNum = resNum.slice(0, resNum.length - 3)
  }
  if (resNum) {
    result = resNum + result
  }
  return result
}
