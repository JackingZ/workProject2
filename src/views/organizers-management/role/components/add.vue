<template>
  <el-dialog
    title="新增权限"
    :visible.sync="visible"
    :close-on-click-modal="false"
    width="500px"
    @close="close"
  >
    <div v-loading="loading">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="80px"
      >
        <el-form-item
          label="权限类型"
          prop="level"
        >
          <el-radio-group
            v-model="form.level"
            @change="levelChange"
          >
            <el-radio
              label="0"
            >
              一级菜单
            </el-radio>
            <el-radio
              label="1"
            >
              二级菜单
            </el-radio>
            <el-radio
              label="2"
            >
              按钮权限
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="form.level !== '0'"
          label="一级菜单"
          prop="parentId"
        >
          <el-select
            v-model="form.parentId"
            placeholder="请选择"
            style="width: 100%"
            @change="parentChange"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.level === '2'"
          label="二级菜单"
          prop="parentId2"
        >
          <el-select
            v-model="form.parentId2"
            :disabled="!form.parentId"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in parentRoleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="权限名称"
          prop="name"
        >
          <el-input
            v-model="form.name"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="权限点"
          prop="alias"
        >
          <el-input
            v-model="form.alias"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="请求接口"
          prop="urls"
        >
          <el-input
            v-model="form.urls"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="请求方式"
          prop="mode"
        >
          <el-select
            v-model="form.mode"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in modeList"
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
        <el-button
          size="small"
          @click="close"
        >
          取 消
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="save"
        >
          保 存
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { addPermit } from '@/api/jht-role-management'

@Component({
  name: '',
  props: {
    roleList: {
      type: Array,
      default: () => []
    }
  }
})
export default class extends Vue {
  /* data */
  private visible: boolean = false
  private loading: boolean = false
  private editId: any = ''
  private form: any = {
    name: '',
    alias: '',
    parentId: '',
    parentId2: '',
    level: '',
    route: '',
    urls: '',
    mode: ''
  }
  private rules: any = {
    level: [{ required: true, message: '请选择权限类型', trigger: 'change' }],
    parentId: [{ required: true, message: '请选择一级菜单', trigger: 'change' }],
    parentId2: [{ required: true, message: '请选择二级菜单', trigger: 'change' }],
    name: [{ required: true, message: '请输入权限名称', trigger: 'change' }],
    alias: [
      { required: true, message: '请输入权限点', trigger: 'change' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4E00-\u9FA5]/g
          if (!value) {
            callback(new Error('权限点不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('权限点不能有中文及特殊字符'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }
  private modeList: any[] = [
    {
      id: 'GET',
      name: 'GET'
    },
    {
      id: 'POST',
      name: 'POST'
    },
    {
      id: 'DELETE',
      name: 'DELETE'
    },
    {
      id: 'PUT',
      name: 'PUT'
    },
    {
      id: 'OPTION',
      name: 'OPTION'
    }
  ]
  get parentRoleList() {
    const roleList: any[] = (this as any).roleList
    const role: any = roleList.find((e: any) => e.id === this.form.parentId) || []
    return role.children || []
  }
  /* methods */
  private close() {
    this.visible = false
  }
  private save() {
    const form: any = this.$refs.form
    form.validate((valid:any) => {
      if (valid) {
        const params: any = {
          name: this.form.name.trim(),
          alias: this.form.alias.trim(),
          parentId: this.form.level === '2' ? this.form.parentId2 : this.form.parentId,
          level: this.form.level,
          route: this.form.route,
          urls: this.form.urls,
          mode: this.form.mode
        }
        if (this.editId) {
          params.id = this.editId
        }
        this.loading = true
        addPermit(params).then((res: any) => {
          this.loading = false
          if (res.success) {
            this.$message.success('权限添加成功')
            this.$emit('load')
            this.visible = false
          } else {
            this.$message.error('权限添加失败')
          }
        }).catch((err: any) => {
          this.loading = false
          return err
        })
      }
    })
  }
  // itemThree编辑 itemTwo二级  itemOne一级
  private edit(itemThree: any, itemTwo?: any, itemOne?: any) {
    this.editId = itemThree.id
    this.visible = true
    this.form = {
      name: itemThree.name,
      alias: itemThree.alias,
      parentId: '',
      parentId2: '',
      level: itemThree.level + '',
      route: itemThree.route,
      urls: itemThree.urls,
      mode: itemThree.mode
    }
    if (itemTwo) {
      this.form.parentId = (itemTwo || {}).id
      this.form.parentId2 = (itemOne || {}).id
    }
    if (itemOne) {
      this.form.parentId = (itemOne || {}).id
      this.form.parentId2 = (itemTwo || {}).id
    }
    this.$nextTick(() => {
      const form: any = this.$refs.form
      form.clearValidate()
    })
  }
  private show() {
    this.editId = ''
    this.visible = true
    this.form = {
      name: '',
      alias: '',
      parentId: '',
      parentId2: '',
      level: '0',
      route: '',
      urls: '',
      mode: ''
    }
    this.$nextTick(() => {
      const form: any = this.$refs.form
      form.clearValidate()
    })
  }
  private levelChange() {
    this.form.parentId = ''
    this.form.parentId2 = ''
  }
  private parentChange() {
    this.form.parentId2 = ''
  }
}
</script>

<style scoped>
</style>
