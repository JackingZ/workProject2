<template>
  <div
    v-loading="loading"
  >
    <el-form
      ref="selectForm"
      :model="selectForm"
      :rules="formRules"
      label-width="110px"
      size="small"
      style="padding-right: 20px;"
    >
      <el-form-item
        label="国家"
        prop="name"
      >
        <el-input
          ref="firstInput"
          v-model="selectForm.name"
          :maxlength="50"
          show-word-limit
          placeholder="请输入"
          size="small"
        />
      </el-form-item>
      <el-form-item
        label="科目编码"
        prop="code"
      >
        <el-input
          v-model="selectForm.code"
          placeholder="请输入"
          size="small"
        />
      </el-form-item>
      <el-form-item
        label="科目名称"
        prop="reportPage"
      >
        <el-input
          v-model="selectForm.reportPage"
          placeholder="请输入"
          size="small"
        />
      </el-form-item>
      <el-form-item
        label="辅助名称"
        prop="reportPage"
      >
        <el-input
          v-model="selectForm.reportPage"
          placeholder="请输入"
          size="small"
        />
      </el-form-item>
      <el-form-item
        label="科目简称"
        prop="reportPage"
      >
        <el-input
          v-model="selectForm.reportPage"
          placeholder="请输入"
          size="small"
        />
      </el-form-item>
      <el-form-item
        label="上级科目"
        prop="format"
      >
        <el-select
          v-model="selectForm.format"
          style="width:100%;"
          size="small"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in formatData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div
      style="text-align: right;"
    >
      <el-button @click="cancel">
        取 消
      </el-button>
      <el-button
        type="primary"
        @click="save"
      >
        确 定
      </el-button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'addEditForm',
  components: {
  },
  props: {
  }
})

export default class extends Vue {
  private selectForm: any = {}
  private formRules = {
    name: [{ required: true, message: '国家不能为空', trigger: 'blur' }],
    serialNo: [{ required: true, message: '科目编码不能为空', trigger: 'blur' }],
    code: [{ required: true, message: '科目名称不能为空', trigger: 'blur' }],
    reportPage: [{ required: true, message: '辅助名称不能为空', trigger: 'blur' }],
    fileName: [{ required: true, message: '科目简称不能为空', trigger: 'blur' }],
    ifNeedParam: [{ required: true, message: '请选择上级科目', trigger: 'change' }]
  }
  private formatData: any[] = []
  private loading: boolean = false

  /** methods */
  private cancel() {
    // zzz
  }
  private save() {
    // zzz
  }
}
</script>

<style lang="scss" scoped>
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
</style>
