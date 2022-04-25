<template>
  <el-dialog
    :title="isEdit ? '编辑文件配置' : '新增文件配置'"
    :visible.sync="visible"
    :close-on-click-modal="false"
    width="600px"
  >
    <div v-loading="loading">
      <el-form
        ref="form"
        :model="form"
        :rules="formRules"
        label-position="right"
        label-width="100px"
        size="small"
        style="padding: 0 40px 0 20px;"
      >
        <el-form-item
          label="国家"
          prop="countryCode"
        >
          <el-select
            v-model="form.countryCode"
            size="small"
            clearable
            filterable
            style="width:100%;"
            placeholder="国家"
            :loading="countryLoading"
            :disabled="isEdit"
            :filter-method="filterCountry"
            @focus="getCountryList"
            @change="handleCountryChange"
          >
            <el-option
              v-for="item in countryList"
              :key="item.id"
              :label="item.newName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="所属模块"
          prop="moduleCode"
        >
          <el-select
            v-model="form.moduleCode"
            size="small"
            clearable
            filterable
            style="width:100%;"
            placeholder="所属模块"
            :loading="modeLoading"
            :disabled="isEdit"
            @focus="getModeList"
            @change="modeChange"
          >
            <el-option
              v-for="item in modeList"
              :key="item.id"
              :label="item.moduleName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="文件类别"
          prop="typeCode"
        >
          <el-select
            v-model="form.typeCode"
            size="small"
            clearable
            filterable
            style="width:100%;"
            placeholder="文件类别"
            :loading="typeLoading"
            :disabled="isEdit"
            @focus="getTypeList"
          >
            <el-option
              v-for="item in filetypeList"
              :key="item.id"
              :label="item.fileType"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="文件名称"
          prop="dictId"
        >
          <el-select
            v-model="form.dictId"
            size="small"
            clearable
            filterable
            style="width:100%;"
            placeholder="文件名称"
            :loading="loadFileList"
            :disabled="isEdit"
            @focus="getFileNameList"
            @change="handleChange"
          >
            <el-option
              v-for="item in fileNameList"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="false"
          label="文件描述"
          prop="fileDesc"
        >
          <el-input
            v-model="form.fileDesc"
            :maxlength="150"
            type="textarea"
            placeholder="请输入"
            style="width:100%;"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="文件类型"
          prop="fileExt"
        >
          <el-select
            v-model="form.fileExt"
            size="small"
            clearable
            filterable
            style="width:100%;"
            placeholder="请选择"
          >
            <el-option
              v-for="item in fileExtList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="是否必要"
          prop="ifNeed"
        >
          <el-radio-group v-model="form.ifNeed">
            <el-radio :label="0">
              否
            </el-radio>
            <el-radio :label="1">
              是
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="是否审核"
          prop="ifAudit"
        >
          <el-radio-group v-model="form.ifAudit">
            <el-radio :label="0">
              否
            </el-radio>
            <el-radio :label="1">
              是
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
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
        @click="submit"
      >
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getModeList, getTypeList, save, edit, getFileNameList } from '@/api/operation-of-file-config'
import { getCountryList } from '@/api/operation-of-service-agency'
@Component({
  name: 'addModel',
  components: {},
  props: {
    countryInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
})
export default class extends Vue {
  /* data */
  private modeLoading: boolean = false
  private typeLoading: boolean = false
  private loadFileList: boolean = false
  private countryLoading: boolean = false
  private isEdit: boolean = false
  private loading: boolean = false
  private visible: boolean = false
  private modeList: any = []
  private fileNameList: any = []
  private allCountryList: any = []
  private countryList: any = []
  private filetypeList: any = []
  private fileExtList: any = [
    {
      label: 'excel',
      value: 1
    },
    {
      label: 'word',
      value: 2
    },
    {
      label: 'pdf',
      value: 3
    },
    {
      label: 'text',
      value: 4
    },
    {
      label: '图片',
      value: 5
    },
    {
      label: '其他',
      value: 6
    }
  ]
  private form: any = {
    countryCode: '',
    countryName: '',
    fileDesc: '',
    fileExt: undefined,
    fileName: '',
    ifAudit: 0,
    ifNeed: 0,
    moduleCode: '',
    moduleName: '',
    fileType: '',
    typeCode: '',
    createTime: undefined,
    delFlag: undefined,
    id: undefined,
    dictId: undefined
  }
  private formRules = {
    countryCode: { required: true, message: '请选择国家', trigger: 'change' },
    moduleCode: { required: true, message: '请选择所属模块', trigger: 'change' },
    typeCode: { required: true, message: '请选择文件类别', trigger: 'change' },
    dictId: { required: true, message: '请输入文件名称', trigger: 'change' },
    // fileDesc: { required: true, message: '请输入文件描述', trigger: 'change' },
    fileExt: { required: true, message: '请选择文件类型', trigger: 'change' },
    ifNeed: { required: true, message: '请选择是否必要', trigger: 'change' },
    ifAudit: { required: true, message: '请选择是否审核', trigger: 'change' }
  }

  /* methods */
  private handleChange(val: any) {
    if (val) {
      const file = this.fileNameList.find((e: any) => e.value === val)
      this.form.fileDesc = file.description
      this.form.fileName = file.label
    } else {
      this.form.fileDesc = ''
      this.form.fileName = ''
    }
  }
  private getFileNameList() {
    const params = {
      type: 'file_names'
    }
    this.loadFileList = true
    getFileNameList(params).then((res: any) => {
      this.loadFileList = false
      if (res.success) {
        this.fileNameList = res.data || []
        this.fileNameList = this.fileNameList.map((e: any) => {
          e.value = e.value * 1
          return e
        })
      }
    }).catch((err: any) => {
      this.loadFileList = false
      return err
    })
  }
  private handleCountryChange(val: any) {
    if (!val) {
      this.form.countryName = ''
      return
    }
    const country = this.allCountryList.find((item: any) => {
      return item.id === val
    })
    if (country) {
      this.form.countryName = country.name
    }
  }
  private filterCountry(value: any) {
    if (value.trim()) {
      const val = value.toUpperCase()
      this.countryList = this.allCountryList.filter((item: any) => {
        return (item.name + '-' + item.alias).toUpperCase().indexOf(val) !== -1
      })
    } else {
      this.countryList = this.allCountryList
    }
  }
  private getCountryList() {
    this.countryLoading = true
    getCountryList().then((res: any) => {
      this.countryLoading = false
      if (res.success) {
        const countryList = res.data.result.map((item: any) => {
          item.newName = item.name + '-' + item.alias
          return item
        })
        this.allCountryList = countryList
        this.countryList = countryList
      }
    }).catch((err: any) => {
      this.countryLoading = false
      return err
    })
  }
  private edit(params: any) {
    edit(params).then((res: any) => {
      this.loading = false
      if (res.success) {
        this.$message.success('编辑成功')
        this.visible = false
        this.reset()
        this.$emit('load')
      } else {
        this.$message.error('编辑失败')
      }
    }).catch((err: any) => {
      this.loading = false
      this.$message.error('编辑失败')
      return err
    })
  }
  private add(params: any) {
    save(params).then((res: any) => {
      this.loading = false
      if (res.success) {
        this.$message.success('添加成功')
        this.visible = false
        this.reset()
        this.$emit('load', 1)
      } else {
        this.$message.error('添加失败')
      }
    }).catch((err: any) => {
      this.loading = false
      this.$message.error('添加失败')
      return err
    })
  }
  private show(data?: any) {
    this.visible = true
    this.reset()
    if (data) {
      this.form = { ...data }
      this.isEdit = true
      this.getModeList()
      this.getTypeList()
      this.getCountryList()
      this.getFileNameList()
    } else {
      this.isEdit = false
    }
  }
  private reset() {
    this.form = {
      countryCode: '',
      countryName: '',
      fileDesc: '',
      fileExt: undefined,
      fileName: '',
      ifAudit: 0,
      ifNeed: 0,
      moduleCode: '',
      moduleName: '',
      fileType: '',
      typeCode: '',
      createTime: undefined,
      delFlag: undefined,
      id: undefined
    }
    this.$nextTick(() => {
      const formRef: any = this.$refs.form
      formRef.clearValidate()
    })
  }
  private submit() {
    const formRef: any = this.$refs.form
    formRef.validate((valid: boolean) => {
      if (valid) {
        const params = { ...this.form }
        const module: any = (this as any).modeList.find((item: any) => {
          return item.id === params.moduleCode
        })
        params.moduleName = module.moduleName
        const type: any = (this as any).filetypeList.find((item: any) => {
          return item.id === params.typeCode
        })
        params.fileType = type.fileType
        this.loading = true
        if (this.isEdit) {
          this.edit(params)
        } else {
          this.add(params)
        }
      }
    })
  }
  private cancel() {
    this.visible = false
    this.reset()
  }
  private modeChange(val: any) {
    this.form.typeCode = undefined
  }
  private getModeList() {
    this.modeLoading = true
    getModeList()
      .then((res: any) => {
        this.modeLoading = false
        if (res.success) {
          this.modeList = res.data
        }
      })
      .catch((err: any) => {
        this.modeLoading = false
        return err
      })
  }
  private getTypeList() {
    if (!this.form.moduleCode) {
      this.$message.warning('请选择所属模块')
      return
    }
    const params = {
      moduleId: this.form.moduleCode
    }
    this.typeLoading = true
    getTypeList(params)
      .then((res: any) => {
        this.typeLoading = false
        if (res.success) {
          this.filetypeList = res.data
        }
      })
      .catch((err: any) => {
        this.typeLoading = false
        return err
      })
  }
}
</script>

<style scoped>

</style>
