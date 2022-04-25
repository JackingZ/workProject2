<template>
  <div
    v-loading="loading"
  >
    <el-form
      ref="selectForm"
      :model="selectForm"
      :rules="rules"
      label-width="130px"
      size="small"
      style="padding-right: 20px;"
    >
      <el-form-item
        label="下单锁舱"
        prop="locked"
      >
        <el-radio-group v-model="selectForm.locked">
          <el-radio :label="0">
            禁用
          </el-radio>
          <el-radio :label="1">
            启用
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="国内运费垫付"
        prop="advance"
      >
        <el-radio-group v-model="selectForm.advance">
          <el-radio :label="0">
            不支持
          </el-radio>
          <el-radio :label="1">
            支持
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="代收货款"
        prop="collectionDelivery"
      >
        <el-radio-group v-model="selectForm.collectionDelivery">
          <el-radio :label="0">
            不支持
          </el-radio>
          <el-radio :label="1">
            支持
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="生成快递单"
        prop="generateExpress"
      >
        <el-radio-group v-model="selectForm.generateExpress">
          <el-radio :label="0">
            不支持
          </el-radio>
          <el-radio :label="1">
            支持
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="打印快递单"
        prop="printExpress"
      >
        <el-radio-group v-model="selectForm.printExpress">
          <el-radio :label="0">
            不支持
          </el-radio>
          <el-radio :label="1">
            支持
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="平台录单"
        prop="platformRecord"
      >
        <el-radio-group
          v-model="selectForm.platformRecord"
          @change="selectForm.recordingRole = '2'"
        >
          <el-radio :label="0">
            否
          </el-radio>
          <el-radio :label="1">
            是
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="selectForm.platformRecord === 1"
        label="录单角色"
        prop="recordingRole"
      >
        <el-radio-group v-model="selectForm.recordingRole">
          <el-radio label="2">
            业务员
          </el-radio>
          <el-radio label="1">
            客服
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="自动生成唛头"
        prop="maitou"
      >
        <el-radio-group v-model="selectForm.maitou">
          <el-radio :label="0">
            否
          </el-radio>
          <el-radio :label="1">
            是
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      style="text-align: right;margin-top: 20px;"
    >
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
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  saveIcon
} from '@/api/financial-at-company-credit'

@Component({
  name: '',
  components: {
  },
  props: {}
})

export default class extends Vue {
  private selectForm: any = {
    locked: 0,
    advance: 0,
    collectionDelivery: 0,
    generateExpress: 0,
    printExpress: 0,
    platformRecord: 0,
    recordingRole: '2',
    maitou: 0
  }
  private rules: any = {
    locked: [{ required: true, message: '请选择下单锁舱', trigger: 'change' }],
    advance: [{ required: true, message: '请选择国内运费垫付', trigger: 'change' }],
    collectionDelivery: [{ required: true, message: '请选择代收货款', trigger: 'change' }],
    generateExpress: [{ required: true, message: '请选择生成快递单', trigger: 'change' }],
    printExpress: [{ required: true, message: '请选择打印快递单', trigger: 'change' }],
    platformRecord: [{ required: true, message: '请选择平台录单', trigger: 'change' }],
    recordingRole: [{ required: true, message: '请选择录单角色', trigger: 'change' }],
    maitou: [{ required: true, message: '请选择唛头自动生成', trigger: 'change' }]
  }
  private loading: boolean = false

  /** method */
  private setData(row: any) {
    const { locked, advance, collectionDelivery, generateExpress, printExpress, platformRecord, recordingRole, maitou, id } = row
    this.selectForm = {
      locked, advance, collectionDelivery, generateExpress, printExpress, id, platformRecord: platformRecord || 0, recordingRole: recordingRole || '2', maitou: maitou || 0
    }
  }
  private cancel() {
    this.$emit('cancel')
  }
  private reset() {
    this.selectForm = {
      locked: 0,
      advance: 0,
      collectionDelivery: 0,
      generateExpress: 0,
      printExpress: 0,
      platformRecord: 0,
      recordingRole: '2',
      maitou: 0
    }
    this.$nextTick(() => {
      const form: any = this.$refs.selectForm
      form.clearValidate()
    })
  }
  private confirm() {
    const editForm: any = this.$refs.selectForm
    editForm.validate((valid: any) => {
      if (!valid) return
      this.loading = true
      saveIcon(this.selectForm)
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.cancel()
          this.$emit('getAll')
          this.loading = false
        })
        .catch((err: any) => {
          this.loading = false
          return err
        })
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
