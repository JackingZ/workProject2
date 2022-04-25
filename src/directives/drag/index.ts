import { DirectiveOptions } from 'vue'

export const drag: DirectiveOptions = {
  bind(el, binding) {
    el.onmousedown = (event) => {
      event.stopPropagation()
      const disx = event.pageX - el.offsetLeft
      const disy = event.pageY - el.offsetTop
      document.body.onselectstart = _ => false
      document.body.onmousemove = e => {
        const left = e.pageX - disx
        const top = e.pageY - disy
        if (binding.value) {
          binding.value(left, top)
        } else {
          el.style.left = left + 'px'
          el.style.top = top + 'px'
        }
      }
      document.body.onmouseup = _ => {
        document.body.onselectstart = document.onmousemove = null
        document.body.onmousemove = null
        return false
      }
    }
    el.onmouseleave = _ => {
      document.body.onselectstart = document.onmousemove = null
      return false
    }
    el.onmousemove = _ => {
      document.body.onselectstart = document.onmousemove = null
      return false
    }
    el.onmouseup = _ => {
      document.body.onselectstart = document.onmousemove = null
      return false
    }
  }
}
