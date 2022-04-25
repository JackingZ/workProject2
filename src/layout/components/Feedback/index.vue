<template>
  <div
    class="feedback-main"
    @click.stop="() => {}"
  >
    <transition
      name="feedback-form-transform"
    >
      <div
        v-show="show"
      >
        <div
          v-loading="loading"
          class="feedback-form"
        >
          <p>请反馈您遇到的问题</p>
          <el-input
            id="textareaInput"
            v-model="textarea"
            type="textarea"
            :autosize="{minRows: 2, maxRows: 6}"
            :rows="4"
            placeholder="请输入反馈内容"
          />
          <div class="tooltip-text">
            <i class="el-icon-rank" />
            <span class="tooltip-text">拖拽或粘贴图片到文本框内，可添加图片</span>
          </div>
          <div
            v-if="zoomFileUrl"
            class="img"
          >
            <img
              :src="zoomFileUrl"
              alt=""
            >
            <div
              class="close-icon"
              @click="closeImg"
            >
              <i class="el-icon-close" />
            </div>
          </div>
          <div style="text-align: right">
            <el-button
              size="small"
              @click="cancel"
            >
              取 消
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="confirm"
            >
              确 定
            </el-button>
          </div>
        </div>
      </div>
    </transition>
    <transition
      name="feedback-icon-transform"
    >
      <div
        v-show="!show"
        class="feedback-icon-wrap"
        @click.stop="showFeedback"
      >
        <div class="feedback-icon" />
        <div class="feedback-text">
          反馈
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { saveFeedback } from '@/api/system-in-feedback'

@Component({
  name: 'Feedback'
})
export default class extends Vue {
  private show: boolean = false
  private loading: boolean = false
  private textarea: any = ''
  private file: any = null
  private zoomFileUrl: any = ''
  /* methods */
  private showFeedback() {
    this.show = true
    this.textarea = ''
    this.zoomFileUrl = ''
    this.file = null
    this.$nextTick(() => {
      const textareaInput: any = document.getElementById('textareaInput')
      if (textareaInput) {
        textareaInput.addEventListener('paste', this.pasteFile)
        textareaInput.addEventListener('drop', this.dropFile)
        textareaInput.addEventListener('dragend', this.dragend)
      }
      document.body.addEventListener('click', this.cancel)
    })
  }
  private closeImg() {
    this.zoomFileUrl = ''
    this.file = null
  }
  private pasteFile(event: any) {
    const items = event.clipboardData && event.clipboardData.items
    let file = null
    if (items && items.length) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          file = items[i].getAsFile()
          break
        }
      }
    }
    this.getFile(file)
  }
  private dropFile(event: any) {
    event.preventDefault()
    const items = event.dataTransfer && event.dataTransfer.files
    let file = null
    if (items && items.length) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          file = items[i]
          break
        }
      }
    }
    this.getFile(file)
  }
  private getFile(file: any) {
    if (file) {
      const fileType = file.type
      this.loading = true
      this.getBase64(file).then((res: any) => {
        this.file = res
        this.getZoomFile(res, fileType)
      }).catch(() => {
        this.$message.warning('图片加载失败，请重试')
        this.loading = false
      })
    }
  }
  private getZoomFile(res: any, fileType: any) {
    const img: any = new Image()
    img.src = res
    img.onload = () => {
      const imgW = img.width
      const imgH = img.height
      const maxW = 300
      const maxH = maxW / imgW * imgH
      img.width = maxW
      img.height = maxH
      const cvs: any = document.createElement('canvas')
      const ctx = cvs.getContext('2d')
      cvs.width = maxW
      cvs.height = maxH
      ctx.drawImage(img, 0, 0, maxW, maxH)
      this.zoomFileUrl = cvs.toDataURL(fileType)
      this.loading = false
    }
    img.onerror = () => {
      this.zoomFileUrl = ''
      this.file = null
      this.loading = false
      this.$message.warning('图片加载失败，请重试')
    }
  }
  private getBase64(file: any) {
    return new Promise((resolve: any, reject: any) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }
  private dragend(event: any) {
    event.preventDefault()
  }
  private cancel() {
    if (this.loading) return
    const textareaInput: any = document.getElementById('textareaInput')
    if (textareaInput) {
      textareaInput.removeEventListener('paste', this.pasteFile)
      textareaInput.removeEventListener('drop', this.dropFile)
      textareaInput.removeEventListener('dragend', this.dragend)
    }
    document.body.removeEventListener('click', this.cancel)
    this.closeImg()
    this.show = false
  }
  private confirm() {
    if (!this.textarea) {
      this.$message.warning('请输入反馈内容！')
      return
    }
    const params = {
      imageUrl: this.file || '',
      type: '1',
      submitContent: this.textarea
    }
    this.loading = true
    saveFeedback(params).then(() => {
      this.$message.success('反馈提交成功，请耐心等待处理！')
      this.loading = false
      this.cancel()
    }).catch(() => {
      this.loading = false
    })
  }
}
</script>

<style lang="scss" scoped>
  .feedback-main{
    position: fixed;
    top: 50%;
    right: 0;
    z-index: 9999;
    .feedback-icon-wrap{
      position: absolute;
      top: 0;
      right: 0;
      width: 36px;
      height: 54px;
      background: #F5F7FA;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .feedback-icon{
        width: 25px;
        height: 25px;
        background: url("../../../assets/imgs/feedback.png") center center no-repeat;
        background-size: 100%;
      }
      .feedback-text{
        font-size: 13px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 18px;
        color: #999999;
      }
      &:hover{
        .feedback-icon{
          background: url("../../../assets/imgs/feedback-hover.png") center center no-repeat;
          background-size: 100%;
        }
        .feedback-text{
          color: #1890ff;
        }
      }
    }
    .feedback-form{
      position: absolute;
      top: 0;
      right: 10px;
      transform: translateY(-50%);
      background: #FFFFFF;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      opacity: 1;
      border-radius: 4px;
      padding: 16px;
      p{
        width: 300px;
        font-size: 16px;
        font-family: MicrosoftYaHeiSemibold;
        line-height: 24px;
        color: #303133;
        opacity: 1;
        margin: 0 0 8px 0;
      }
      .tooltip-text{
        display: flex;
        align-items: center;
        margin: 8px 0;
        span{
          padding-left: 5px;
          font-size: 13px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 18px;
          color: #909399;
          opacity: 1;
        }
      }
      .img{
        width: 100%;
        margin-bottom: 5px;
        position: relative;
        img{
          line-height: 0;
        }
        .close-icon{
          position: absolute;
          top: -10px;
          right: -10px;
          cursor: pointer;
        }
      }
      ::v-deep{
        textarea{
          resize: none;
        }
      }
    }
  }

  .feedback-icon-transform-leave-active,
  .feedback-icon-transform-enter-active {
    transition: all .5s;
  }
  .feedback-icon-transform-enter {
    opacity: 0;
    transform: translateX(30px);
  }
  .feedback-icon-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
  .feedback-form-transform-leave-active,
  .feedback-form-transform-enter-active {
    transition: all .5s;
  }
  .feedback-form-transform-enter {
    opacity: 0;
    transform: translateX(30px) translateY(-50%) !important;
  }
  .feedback-form-transform-leave-to {
    opacity: 0;
    transform: translateX(30px) translateY(-50%) !important;
  }
</style>
