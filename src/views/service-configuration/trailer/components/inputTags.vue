<template>
  <div class="input-tags">
    <el-tag
      v-for="(tag, index) in tags"
      :key="`${tag.name}-${index}`"
      type="info"
      size="small"
      closable
      disable-transitions
      class="tags"
      @close="closeTag(index)"
    >
      {{ tag.name }}
    </el-tag>
    <el-input
      v-model="tagText"
      type="text"
      size="small"
      class="inputs"
      clearable
      :placeholder="tags.length === 0 ? '请输入内容': ''"
      @clear="clearText"
      @input="changeInput"
      @keydown.enter.native="enterText"
      @keydown.space.native="enterText"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: '',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private tagText: any = ''
  private tags: any[] = [
    { name: '黄金糕' }
  ]

  /* methods */
  private mounted() {
    const target: any = document.querySelector('.inputs')
    target.addEventListener('paste', (event: any) => {
      const text = (event.clipboardData).getData('text')
      if (text.indexOf(',') !== -1 || text.indexOf(' ') !== -1) {
        const str = text.replace(' ', ',')
        const arr = str.split(',')
        arr.map((it: any) => {
          this.tags.push({
            name: it
          })
        })
      } else {
        this.tags.push({
          name: text
        })
      }
      event.preventDefault()
    })
  }
  private closeTag(index: any) {
    this.tags.splice(index, 1)
  }
  private clearText() {
    this.tags = []
    this.tagText = ''
  }
  private changeInput(value: any) {
    //
  }
  private enterText() {
    this.tags.push({
      name: this.tagText
    })
    this.tagText = ''
  }
}
</script>

<style lang="scss" scoped>
.input-tags {
  display: flex;
  width: 100%;
  background: #fff;
  border-radius: 4px;
  font-size: 16px;
  min-height: 54px;
  justify-content: flex-start;
  padding: 10px;
  box-sizing: border-box;
  flex-wrap: wrap;
  position: relative;
  border: 1px solid #DCDFE6;
  .tags {
    background-color: #f4f4f5;
    border-color: #e9e9eb;
    color: #909399;
    max-width: 100%;
    margin: 4px 0 2px 6px;
    align-items: center;
    display: flex;
  }
  .inputs {
    flex: 1;
    min-width: 200px;
  }
}
.tags ::v-deep .el-tag__close {
  top: 0;
}
.inputs ::v-deep .el-input__inner {
  border: none;
}
</style>
