<template>
  <transition name="el-zoom-in-top">
    <div
      v-show="visible"
      ref="dragModel"
      v-drag="onDrag"
      :class="['drag-model', modelClass]"
      :style="{
        width: showWidth + 'px',
        height: showHeight + 'px',
        left: left + 'px',
        top: top + 'px'
      }"
    >
      <div
        class="model-header"
        :style="{
          width: showWidth + 'px',
          height: headerH + 'px',
          top: headerM + 'px'
        }"
      >
        <slot name="title">
          <span class="title">
            {{ title }}
          </span>
        </slot>
        <div class="close-icon-wrap">
          <slot name="close">
            <el-button
              title="最小化"
              type="text"
              icon="el-icon-minus"
              @click="onMinimize"
            />
            <el-button
              :title="isFullScreen ? '退出' : '全屏'"
              type="text"
              icon="el-icon-full-screen"
              @click="onFullScreen"
            />
            <el-button
              title="关闭"
              type="text"
              icon="el-icon-close"
              @click="onClose"
            />
          </slot>
        </div>
      </div>
      <div
        v-if="scaleType === 'default'"
        class="model-body"
        :style="{
          width: showWidth - (headerM * 2) + 'px',
          height: showHeight - headerH - (headerM * 2) + 'px',
          left: headerM + 'px',
          top: headerH + headerM + 'px',
          overflowX: 'auto'
        }"
        @mousedown="modelBodyStopEvent"
      >
        <div
          class="content"
        >
          <slot />
        </div>
      </div>
      <div
        v-else
        class="model-body"
        :style="{
          width: initOption.initWidth - (headerM * 2) + 'px',
          height: initOption.initHeight - headerH - (headerM * 2) + 'px',
          left: headerM + 'px',
          top: headerH + headerM + 'px',
          transform: `scaleX(${scaleX}) scaleY(${scaleY})`,
          transformOrigin: 'left top'
        }"
        @mousedown="modelBodyStopEvent"
      >
        <div class="content">
          <slot />
        </div>
      </div>
      <div
        class="scale-box-wrap"
      >
        <div
          class="scale-box scale-lr"
          @mousedown="boxOnMousedownByLR"
          @mouseup="boxOnMouseupByLR"
        />
        <div
          class="scale-box scale-rl"
          @mousedown="boxOnMousedownByRL"
          @mouseup="boxOnMouseupByRL"
        />
        <div
          class="scale-box scale-tb"
          @mousedown="boxOnMousedownByTB"
          @mouseup="boxOnMouseupByTB"
        />
        <div
          class="scale-box scale-bt"
          @mousedown="boxOnMousedownByBT"
          @mouseup="boxOnMouseupByBT"
        />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'dragModel',
  props: {
    /*
    * 窗口缩放时内容缩放模式
    * default：默认内容宽高随缩放宽高
    * scale：等比缩放
    * */
    scaleType: {
      type: String,
      default: 'default'
    },
    title: {
      type: String,
      default: ''
    },
    modelClass: {
      type: String,
      default: ''
    },
    initOption: {
      type: Object,
      default: () => ({
        initWidth: 1100,
        initHeight: 500,
        top: 100
      })
    },
    visible: {
      type: Boolean,
      default: false
    }
  }
})
export default class DragModel extends Vue {
  /* data */
  private isFullScreen: boolean = false
  private headerH: number = 36
  private headerM: number = 2
  private showWidth: number = 1100
  private SHOWWIDTH: number = 1100
  private showHeight: number = 500
  private SHOWHEIGHT: number = 500
  private disx: number = 0
  private disy: number = 0
  private top: number = 100
  private left: number = 100
  private scaleX: number = 1
  private scaleY: number = 1

  /* watch */
  @Watch('initOption', { immediate: true })
  private onInitOptionChange(newVal: any, oldVal: any) {
    if (oldVal && newVal.initWidth === oldVal.initWidth && newVal.initHeight === oldVal.initHeight) {
      return
    }
    this.showWidth = newVal.initWidth || 1100
    this.SHOWWIDTH = newVal.initWidth || 1100
    this.showHeight = newVal.initHeight || 500
    this.SHOWHEIGHT = newVal.initHeight || 500
    this.top = newVal.top || 100
  }

  /* methods */
  private init() {
    const screenWidth = document.body.clientWidth
    this.left = screenWidth / 2 - ((this as any).initOption.initWidth / 2)
  }
  // 最小化
  private onMinimize() {
    this.$emit('minimize')
  }
  // 全屏
  private onFullScreen() {
    const screenWidth = document.body.clientWidth
    const screenHeight = document.body.clientHeight
    if (this.isFullScreen) {
      // 退出全屏
      const option = (this as any).initOption
      this.showWidth = option.initWidth
      this.SHOWWIDTH = option.initWidth
      this.showHeight = option.initHeight
      this.SHOWHEIGHT = option.initHeight
      this.top = option.top
      this.init()
    } else {
      // 全屏
      this.showWidth = screenWidth
      this.SHOWWIDTH = screenWidth
      this.showHeight = screenHeight
      this.SHOWHEIGHT = screenHeight
      this.top = 0
      this.left = 0
    }
    this.$nextTick(this.computeScale)
    this.isFullScreen = !this.isFullScreen
    this.$emit('fullScreen', this.isFullScreen)
  }
  // 关闭
  private onClose() {
    this.isFullScreen = false
    const option = (this as any).initOption
    this.showWidth = option.initWidth
    this.SHOWWIDTH = option.initWidth
    this.showHeight = option.initHeight
    this.SHOWHEIGHT = option.initHeight
    this.top = option.top
    this.init()
    this.$emit('update:visible', false)
    this.$emit('close')
  }
  // 计算比例
  private computeScale() {
    if ((this as any).scaleType === 'default') {
      return
    }
    const dragModel = this.$refs.dragModel as any
    const width = parseInt(dragModel.style.width, 10) - (this.headerM * 2)
    const height = parseInt(dragModel.style.height, 10) - this.headerH - (this.headerM * 2)
    this.scaleX = width / ((this as any).initOption.initWidth - (this.headerM * 2))
    this.scaleY = height / ((this as any).initOption.initHeight - this.headerH - (this.headerM * 2))
  }
  // 左边
  private boxOnMousedownByLR(event: MouseEvent) {
    event.stopPropagation()
    const dragModel = this.$refs.dragModel as any
    this.SHOWWIDTH = parseInt(dragModel.style.width, 10)
    this.disx = event.pageX
    document.body.onselectstart = _ => false
    document.addEventListener('mousemove', this.mousemoveByDocumentLR)
  }
  private modelBodyStopEvent(event: MouseEvent) {
    event.stopPropagation()
  }
  private boxOnMouseupByLR(event: MouseEvent) {
    event.stopPropagation()
    document.removeEventListener('mousemove', this.mousemoveByDocumentLR)
  }
  private mousemoveByDocumentLR(event: MouseEvent) {
    this.left = event.pageX
    this.showWidth = this.disx - event.pageX + this.SHOWWIDTH
    this.computeScale()
  }
  // 上边
  private boxOnMousedownByTB(event: MouseEvent) {
    event.stopPropagation()
    const dragModel = this.$refs.dragModel as any
    this.SHOWHEIGHT = parseInt(dragModel.style.height, 10)
    this.disy = event.pageY
    document.body.onselectstart = _ => false
    document.addEventListener('mousemove', this.mousemoveByDocumentTB)
  }
  private boxOnMouseupByTB(event: MouseEvent) {
    event.stopPropagation()
    document.removeEventListener('mousemove', this.mousemoveByDocumentTB)
  }
  private mousemoveByDocumentTB(event: MouseEvent) {
    this.top = event.pageY
    this.showHeight = this.disy - event.pageY + this.SHOWHEIGHT
    this.computeScale()
  }
  // 右边
  private boxOnMousedownByRL(event: MouseEvent) {
    event.stopPropagation()
    const dragModel = this.$refs.dragModel as any
    this.SHOWWIDTH = parseInt(dragModel.style.width, 10)
    this.disx = event.pageX
    document.body.onselectstart = _ => false
    document.addEventListener('mousemove', this.mousemoveByDocumentRL)
  }
  private boxOnMouseupByRL(event: MouseEvent) {
    event.stopPropagation()
    document.removeEventListener('mousemove', this.mousemoveByDocumentRL)
  }
  private mousemoveByDocumentRL(event: MouseEvent) {
    this.showWidth = event.pageX - this.disx + this.SHOWWIDTH
    this.computeScale()
  }
  // 下边
  private boxOnMousedownByBT(event: MouseEvent) {
    event.stopPropagation()
    const dragModel = this.$refs.dragModel as any
    this.SHOWHEIGHT = parseInt(dragModel.style.height, 10)
    this.disy = event.pageY
    document.body.onselectstart = _ => false
    document.addEventListener('mousemove', this.mousemoveByDocumentBT)
  }
  private boxOnMouseupByBT(event: MouseEvent) {
    event.stopPropagation()
    document.removeEventListener('mousemove', this.mousemoveByDocumentBT)
  }
  private mousemoveByDocumentBT(event: MouseEvent) {
    this.showHeight = event.pageY - this.disy + this.SHOWHEIGHT
    this.computeScale()
  }
  // 拖拽的时候触发
  private onDrag(left: number, top: number) {
    this.left = left
    this.top = top
  }
  private mounted() {
    this.init()
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', this.mousemoveByDocumentRL)
      document.removeEventListener('mousemove', this.mousemoveByDocumentLR)
      document.removeEventListener('mousemove', this.mousemoveByDocumentBT)
      document.removeEventListener('mousemove', this.mousemoveByDocumentTB)
    })
  }
}
</script>

<style lang="scss" scoped>
  .drag-model{
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 1050;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgb(0 0 0 / 30%);
    box-sizing: border-box;
    .model-header{
      position: absolute;
      left: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      z-index: 99;
      cursor: move;
      .close-icon-wrap{
        cursor: default;
        padding: 0 5px;
      }
    }
    .model-body{
      position: absolute;
      z-index: 99;
    }
    .scale-box-wrap{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9;
      .scale-box{
        position: absolute;
        z-index: 999;
        /*background: red;*/
        &.scale-lr{
          left: 0;
          top: 0;
          height: 100%;
          width: 2px;
          cursor: w-resize;
        }
        &.scale-rl{
          right: 0;
          top: 0;
          height: 100%;
          width: 2px;
          cursor: w-resize;
        }
        &.scale-tb{
          left: 0;
          top: 0;
          width: 100%;
          height: 2px;
          cursor: s-resize;
          background: #ECECEC;
        }
        &.scale-bt{
          left: 0;
          bottom: 0;
          width: 100%;
          height: 2px;
          cursor: s-resize;
        }
      }
    }
  }
</style>
