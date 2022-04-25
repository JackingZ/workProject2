type nu = number | string | undefined
type ns = number | string

export interface IFormatAreas {
  (num: nu): nu
}

export function formatAreas(arr: any, level?: number) {
  arr.forEach((item: any) => {
    if (item.alias) {
      item.name = `${item.name}-${item.alias}`
    }
    if (item.children && item.children.length === 0) {
      delete item.children
    } else if (level && item.level === level) {
      delete item.children
    } else {
      formatAreas(item.children, level)
    }
  })
  return arr
}
