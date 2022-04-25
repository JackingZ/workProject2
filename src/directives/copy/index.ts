import { DirectiveOptions } from 'vue'
import { Message } from 'element-ui'

export const copy: DirectiveOptions = {
  inserted: (el: any, { value }) => {
    el.$value = value
    el.handler = () => {
      if (!el.$value) {
        Message.warning('无复制内容')
        return
      }
      const textarea: any = document.createElement('textarea')
      textarea.readOnly = 'readonly'
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      textarea.value = el.$value
      document.body.appendChild(textarea)
      textarea.select()
      const result = document.execCommand('Copy')
      if (result) {
        Message.success('复制成功')
      }
      document.body.removeChild(textarea)
    }
    el.addEventListener('click', el.handler)
  },
  componentUpdated: (el: any, { value }) => {
    el.$value = value
  },
  unbind: (el: any) => {
    el.removeEventListener('click', el.handler)
  }
}
