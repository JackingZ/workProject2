<template>
  <div
    v-loading="loading"
  >
    <div class="app-panel">
      <el-form
        ref="theForm"
        label-position="right"
        :rules="formRules"
        label-width="100px"
        size="small"
        :model="form"
        style="padding-right: 20px;"
      >
        <el-form-item
          label="所属公司"
          prop="custName"
        >
          <el-input
            v-model="form.custName"
            placeholder=""
            :disabled="true"
          />
        </el-form-item>

        <el-form-item
          label="上级部门"
          prop="parentId"
        >
          <el-tree-select
            v-model="form.parentId"
            :data="depts"
            :default-expand-all="false"
            :disabled="isEdit === 2"
            clearable
            filterable
            size="small"
            placeholder="请选择"
          />
        </el-form-item>

        <el-form-item
          label="部门名称"
          prop="name"
        >
          <el-input
            v-model="form.name"
            :maxlength="50"
            placeholder="请输入"
            :disabled="isEdit === 2"
          />
        </el-form-item>

        <el-form-item
          label="英文名称"
          prop="alias"
        >
          <el-input
            v-model="form.alias"
            :maxlength="50"
            placeholder="请输入"
            :disabled="isEdit === 2"
          />
        </el-form-item>

        <el-form-item
          label="部门主管"
          prop="managers"
        >
          <el-select
            v-model="form.managers"
            placeholder="请选择"
            style="width: 100%;"
            multiple
            collapse-tags
            clearable
            :loading="selectLoading"
            @focus="getUserList"
          >
            <el-option
              v-for="item in personList"
              :key="item.id"
              :label="`${item.realName}-${item.username}-${item.deptName}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="备注信息"
          prop="remark"
        >
          <el-input
            v-model="form.remark"
            :maxlength="100"
            placeholder="请输入"
            :disabled="isEdit === 2"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import { IDepartmentRequest, saveDept, getDept } from '@/api/jht-department'
import { getParUserList } from '@/api/jht-user-management'

@Component({
  name: 'EditDepartment',
  components: {},
  props: {
    isEdit: {
      type: Number,
      default: false
    },
    deptList: {
      type: Array,
      default: []
    }
  }
})
export default class extends Vue {
  /** ------- data ------- */
  private selectLoading: boolean = false
  private loading: boolean = false
  private form: any = {
    id: undefined,
    custId: (this as any).custId,
    custName: (this as any).custName,
    parentId: '',
    parentName: undefined,
    name: undefined,
    alias: undefined,
    managers: [],
    remark: undefined
  }

  private personList: any = []

  private formRules = {
    custName: [{ required: true, message: '所属公司不能为空', trigger: 'blur' }],
    parentId: [{ required: true, message: '上级部门不能为空', trigger: 'change' }],
    name: [
      { required: true, message: '部门名称不能为空', trigger: 'blur' }
    ],
    alias: [
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (value && reg.test(value)) {
            callback(new Error('英文名称不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }

  /** ------- computed ------- */
  get labelPosition(): string {
    const lang = AppModule.language
    if (!lang) {
      return 'left'
    }
    return lang === 'en' ? 'top' : 'left'
  }

  get lang(): string {
    const lang = AppModule.language
    if (!lang) {
      return 'en'
    }
    return lang
  }

  // 所属公司id
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }

  // 所属公司Name
  get custName(): string {
    const info = UserModule.info || {}
    const custName = (info as any).custName
    return custName
  }

  // 所属部门id
  get deptId(): string {
    const info = UserModule.info || {}
    const deptId = (info as any).deptId
    return deptId
  }

  get depts(): any {
    const { deptList, deptId, form, addDisabled } = this as any
    const json = JSON.parse(
      JSON.stringify(deptList)
        .replace(/name/g, 'label')
        .replace(/id/g, 'value')
    )
    addDisabled(json)
    return json
  }

  /** ------- methods ------- */
  private setData() {
    this.form.custId = (this as any).custId
    this.form.custName = (this as any).custName
    this.getUserList()
  }
  // 上级部门不能选择自己
  private addDisabled(arr: any) {
    const { form, addDisabled } = this
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].value === form.id) {
        arr.splice(i, 1)
      }
      if (
        arr[i] &&
        arr[i].children &&
        Array.isArray(arr[i].children) &&
        arr[i].children.length
      ) {
        addDisabled(arr[i].children)
      }
    }
  }

  // 递归函数
  private recursionName(id: string, data: any[]) {
    let isover = false
    let name
    const getId = (arr: any[]) => {
      if (isover) return
      arr.map((item, index) => {
        if (id === item.id) {
          name = item.name
          return (isover = true)
        } else {
          if (item.children && item.children.length > 0) {
            getId(item.children)
          }
        }
      })
    }
    getId(data)
    return name
  }

  // 新增/编辑部门提交表单
  private saveDept(): void {
    const theForm = (this as any).$refs.theForm
    theForm.validate((valid: any) => {
      if (valid) {
        const { alias, managers: managerList, ...form } = this.form
        const managers = managerList.map((item: any) => {
          return {
            id: item,
            name: (this.personList.find((n: any) => n.id === item) || {}).username
          }
        })
        const parantName = this.recursionName(this.form.parentId, (this as any).deptList)
        const params = {
          ...form,
          parantName,
          alias: alias ? alias.trim() : '',
          managers
        }
        this.loading = true
        saveDept(params)
          .then(() => {
            this.loading = false
            this.$emit('close')
          })
          .catch((err: any) => {
            this.loading = false
            return err
          })
      }
    })
  }

  // 查询部门详情
  private getDept(id: any): void {
    this.loading = true
    getDept({ id })
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        const { managers: managersList, ...params } = data
        const managers = managersList.map((item: any) => item.id)
        params.managers = managers
        params.parentId = params.parentId ? params.parentId : ''
        params.custName = params.custName ? params.custName : (this as any).custName
        this.form = params
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

  private getUserList(): void {
    // custId=0&deptId=47c31b57a0c74769b161176a1da5af76
    this.selectLoading = true
    getParUserList({
      custId: (this as any).custId,
      deptId: this.form.parentId
    })
      .then((res: any) => {
        this.selectLoading = false
        this.personList = res.data || []
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  // 重置表单
  private reset(): void {
    const form = {
      id: undefined,
      custId: (this as any).custId,
      custName: (this as any).custName,
      parentId: '',
      parentName: undefined,
      name: undefined,
      alias: undefined,
      managers: [],
      remark: undefined
    }
    this.form = form
    const theForm: any = this.$refs.theForm
    this.$nextTick(() => {
      theForm.clearValidate()
    })
  }
}
</script>

<style lang="scss" scoped></style>
