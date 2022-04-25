<template>
  <div
    :class="[isActive ? 'slide-active' : 'slide-close']"
    :style="{width: isActive ? width + 'px' : ''}"
    style="margin: 15px 0;position: relative;background-color: #fff;transition: all .3s cubic-bezier(0.78, 0.14, 0.15, 0.86);"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Slide',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '270'
    }
  },
  methods: {
    toggle() {
      this.isActive = !this.isActive
    }
  }
}
</script>

<style lang="scss" scoped>
.slide-active {
  height: calc(100vh - 114px);
  width: 270px;
  padding: 15px;
  overflow: auto;
  ::v-deep .el-tree-node > .el-tree-node__children {
    overflow: visible;
  }
}
.slide-close {
  height: calc(100vh - 123px);
  width: 0;
  opacity: 0;
}
</style>
