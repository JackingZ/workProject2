import { hasOwn } from '@/components/ElTreeSelectLib/utils/util'

export function isVNode(node) {
  return node !== null && typeof node === 'object' && hasOwn(node, 'componentOptions')
}

export function getFirstComponentChild(children) {
  return children && children.filter(c => c && c.tag)[0]
}
