<template>
  <el-dialog
    title="号段回收"
    width="500px"
    :visible="visible"
    :close-on-click-modal="false"
    @close="closeModal"
  >
    <el-form
      ref="form"
      v-loading="loading"
      :model="form"
      :rules="formRules"
      label-width="80px"
      size="small"
    >
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item
            label="回收数量"
            prop="num"
          >
            <el-input-number
              v-model="form.num"
              placeholder="请输入回收数量"
              style="width: 100%;"
              size="small"
              clearable
              :max="customer.surplus"
              controls-position="right"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button
            size="small"
            @click="closeModal"
          >
            取 消
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="recovery"
          >
            确 认
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { recovery } from '@/api/system-in-air-them-roughly'

@Component({
  name: 'recoveryModal',
  props: {
    customer: {
      type: Object,
      default: () => ({})
    },
    sectionId: {
      type: [Number, String],
      default: ''
    }
  }
})
export default class RecoveryModal extends Vue {
  /* data */
  private visible: boolean = false
  private loading: boolean = false
  private form: any = {
    num: ''
  }
  private formRules: any = {
    num: [{ required: true, message: '请输入回收数量', trigger: 'change' }]
  }

  /* methods */
  private recovery() {
    if (!this.form.num) {
      this.$message.info('请输入回收数量')
      return
    }
    const params = {
      ...this.form,
      sectionId: (this as any).sectionId,
      customerId: (this as any).customer.customerId,
      did: (this as any).customerId
    }
    this.loading = true
    recovery(params).then((res: any) => {
      this.loading = false
      if (res.success) {
        this.$message.success('回收成功')
        this.$emit('recoveryOk')
        this.visible = false
      }
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }

  private show() {
    this.visible = true
    this.form = {
      num: ''
    }
    this.$nextTick(() => {
      (this.$refs.form as any).resetFields()
    })
  }

  private closeModal() {
    this.visible = false
  }
}
</script>

<style lang="scss" scoped>
  .err-title{
    margin-top: 10px;
  }

  .g{
    color: #179837;
  }

  .r{
    color: #E51E1E;
  }

  p{
    margin-top: 10px;
  }
</style>
