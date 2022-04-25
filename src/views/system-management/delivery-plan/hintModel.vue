<template>
  <el-dialog
    title="是否立即创建计划？"
    width="400px"
    :visible="visible"
    :close-on-click-modal="false"
    :show-close="false"
    append-to-body
  >
    <p>
      如果是，将立刻创建一条起运日期{{ params.shipDate }} {{ formatWeekShip }}，
      截单日期为{{ params.cutoffDate }} {{ formatWeekCutoff }}的计划。
    </p>
    <p>
      如果否，将在{{ nextCreate }}，创建计划。
    </p>
    <el-radio
      v-model="radio"
      label="1"
    >
      是
    </el-radio>
    <el-radio
      v-model="radio"
      label="2"
    >
      否
    </el-radio>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        @click="cancel"
      >
        取 消
      </el-button>
      <el-button
        type="primary"
        @click="onOk"
      >
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import dayjs from 'dayjs'

@Component({
  name: 'hintModel'
})
export default class HintModel extends Vue {
  /* data */
  private visible: boolean = false
  private radio: string = '1'
  private params: any = {}
  private weekdays: any = [
    { label: '星期一', value: 1 },
    { label: '星期二', value: 2 },
    { label: '星期三', value: 3 },
    { label: '星期四', value: 4 },
    { label: '星期五', value: 5 },
    { label: '星期六', value: 6 },
    { label: '星期日', value: 0 }
  ]
  get formatWeekShip() {
    const val = this.params.shipDate
    if (val) {
      const data = dayjs(val).day()
      const weeks = (this as any).weekdays
      const item = weeks.find((it: any) => it.value === data) || {}
      return item.label
    } else {
      return ''
    }
  }
  get formatWeekCutoff() {
    const val = this.params.cutoffDate
    if (val) {
      const data = dayjs(val).day()
      const weeks = (this as any).weekdays
      const item = weeks.find((it: any) => it.value === data) || {}
      return item.label
    } else {
      return ''
    }
  }
  get nextCreate() {
    const val = this.params.shipDate
    if (val) {
      if (this.params.unit === 1) {
        const data = dayjs(val).add(this.params.frequency, 'day').day()
        const weeks = (this as any).weekdays
        const item = weeks.find((it: any) => it.value === data) || {}
        return dayjs(val).add(this.params.frequency, 'day').format('YYYY-MM-DD HH:mm') + item.label
      } else {
        const data = dayjs(val).add(this.params.frequency, 'w').day()
        const weeks = (this as any).weekdays
        const item = weeks.find((it: any) => it.value === data) || {}
        return dayjs(val).add(this.params.frequency, 'w').format('YYYY-MM-DD HH:mm') + item.label
      }
    } else {
      return ''
    }
  }
  /* methods */
  private show(params: any) {
    this.radio = '1'
    this.params = params
    this.visible = true
  }
  private cancel() {
    // cancel
    this.visible = false
    this.$emit('cancel', this.params, this.radio)
  }
  private onOk() {
    // cancel
    this.visible = false
    this.$emit('ok', this.params, this.radio)
  }
}
</script>

<style scoped>

</style>
