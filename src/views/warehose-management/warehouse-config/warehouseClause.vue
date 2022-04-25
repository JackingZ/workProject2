<template>
  <div v-loading="loading">
    <div style="text-align: right;padding-bottom: 10px;">
      <el-button
        v-permission="['warehouseClauseSave']"
        type="primary"
        size="small"
        @click="saveClause"
      >
        保存
      </el-button>
    </div>
    <markdown-editor
      ref="markdownEditor"
      v-model="text"
      :options="{hideModeSwitch: true, previewStyle: 'tab', toolbarItems: ['heading','bold','italic']}"
      height="calc(100vh - 290px)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import dayjs from 'dayjs'
import {
  getWarehouseClause,
  saveWarehouseClause
} from '@/api/warehose-by-config'
import MarkdownEditor from '@/components/MarkdownEditor/index.vue'
@Component({
  name: 'DischargingHatch',
  components: {
    MarkdownEditor
  },
  props: {
    wsId: {
      type: String,
      default: ''
    }
  }
})
export default class DischargingHatch extends Vue {
  private loading: boolean = false
  private text: any = ''

  // -- methods --
  private saveClause(id: string): void {
    const html = (this.$refs.markdownEditor as MarkdownEditor).getHtml()
    const params: any = {
      id: (this as any).wsId,
      terms: html
    }
    saveWarehouseClause(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        this.getClause()
      })
      .catch((err: any) => {
        return [err, null]
      })
  }
  private getClause(): void {
    const params: any = {
      id: (this as any).wsId
    }
    this.loading = true
    getWarehouseClause(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        const terms = data.terms || ''
        this.setTerms(terms)
      })
      .catch((err: any) => {
        this.loading = false
        return [err, null]
      })
  }
  private setTerms(val: any) {
    (this.$refs.markdownEditor as MarkdownEditor).setHtml(val)
  }
  private created(): void {
    this.getClause()
  }
}
</script>

<style lang="scss" scoped>

</style>
