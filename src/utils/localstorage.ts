export interface Ilocalstorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
  clear: () => void
}

class VLocalStorage implements Ilocalstorage {
  getItem(key: string) {
    return window.localStorage.getItem(key)
  }
  setItem(key: string, value: string) {
    window.localStorage.setItem(key, value)
  }
  removeItem(key: string) {
    window.localStorage.removeItem(key)
  }
  clear() {
    window.localStorage.clear()
  }
}

export const Vls = new VLocalStorage()

// 判断字典值是否储存
export function hasDict(): boolean {
  const json = Vls.getItem('vuex') || '{}'
  const res = JSON.parse(json)
  const { user = {} } = res
  const { dict } = user
  return !!dict
}
