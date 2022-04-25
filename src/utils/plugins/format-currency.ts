type nu = number | string | undefined
type ns = number | string

export interface IFormatCurrency {
  (num: nu): nu
}
export function formatCurrency(number: nu) {
  let num: any = (number || 0.00).toString().replace(/\$|,/g, '')
  if (isNaN(num)) { num = '0' }
  let sign = (parseFloat(num) === (num = Math.abs(num)))
  num = Math.floor(num * 100 + 0.50000000001)
  let cents: ns = num % 100
  num = Math.floor(num / 100).toString()
  if (cents < 10) { cents = '0' + cents }
  for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
    num = num.substring(0, num.length - (4 * i + 3)) + ',' +
      num.substring(num.length - (4 * i + 3))
  }
  return (((sign) ? '' : '-') + num + '.' + cents)
}
