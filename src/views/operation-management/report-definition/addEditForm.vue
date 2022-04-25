<template>
  <div
    v-loading="loading"
    class="content"
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
        label="报表名称"
        prop="name"
      >
        <el-input
          ref="firstInput"
          v-model="selectForm.name"
          :maxlength="10"
          placeholder="请输入"
          size="small"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        label="报表标识"
        prop="tag"
      >
        <el-input
          v-model="selectForm.tag"
          :maxlength="10"
          placeholder="请输入"
          size="small"
          show-word-limit
        />
      </el-form-item>
      <!-- <el-form-item
        label="序号"
        prop="serialNo"
      >
        <el-input-number
          v-model="selectForm.serialNo"
          class="input-number-valiate"
          :controls="false"
          placeholder="请输入"
          :min="0"
          :max="999999"
          :step="1"
          step-strictly
        />
      </el-form-item> -->

      <!-- <el-form-item
        label="报表格式"
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
      </el-form-item> -->
      <el-form-item
        label="报表ip地址"
        prop="ip"
      >
        <el-input
          v-model="selectForm.ip"
          type="textarea"
          :rows="2"
          placeholder="请输入"
          size="small"
          :maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <!-- <el-form-item
        label="报表类型"
        prop="category"
      >
        <el-input
          v-model="selectForm.category"
          placeholder="请输入"
          :maxlength="20"
          size="small"
        />
      </el-form-item> -->
      <!-- <el-form-item
        label="报表文件名"
        prop="fileName"
      >
        <el-input
          v-model="selectForm.fileName"
          placeholder="请输入"
          :maxlength="50"
          size="small"
        />
      </el-form-item> -->
      <!-- <el-form-item
        label="需要参数"
        prop="ifNeedParam"
      >
        <el-radio-group v-model="selectForm.ifNeedParam">
          <el-radio :label="true">
            是
          </el-radio>
          <el-radio :label="false">
            否
          </el-radio>
        </el-radio-group>
      </el-form-item> -->
    </el-form>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'addEditForm',
  components: {
  },
  props: {
    formatList: {
      type: Array,
      default: () => []
    },
    selectForm: {
      type: Object,
      default: () => {
        return {}
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
})

export default class extends Vue {
  private formRules = {
    name: [
      { required: true, message: '报表名称不能为空', trigger: 'blur' }
    ],
    serialNo: [{ required: true, message: '序号不能为空', trigger: 'blur' }],
    ip: [
      { required: true, message: '报表ip地址不能为空', trigger: 'blur' }
      // {
      //   validator(rule: any, value: any, callback: (val?: any) => void) {
      //     const reg = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/
      //     if (!reg.test(value)) {
      //       callback(new Error('报表ip地址不正确'))
      //     } else {
      //       callback()
      //     }
      //   },
      //   trigger: 'blur'
      // }
    ],
    category: [
      { required: true, message: '报表类型不能为空', trigger: 'blur' }
    ],
    format: [{ required: true, message: '请选择报表格式', trigger: 'change' }],
    fileName: [
      { required: true, message: '报表文件名不能为空', trigger: 'blur' }
    ],
    ifNeedParam: [{ required: true, message: '请选择是否需要参数', trigger: 'change' }],
    tag: [{ required: true, message: '请输入报表标识', trigger: 'change' }]
  }

  get formatData() {
    return (this as any).formatList || []
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
