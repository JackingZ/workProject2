<template>
  <div
    v-loading="editLoading"
    class="app-panel"
  >
    <el-form
      ref="userRoot"
      label-position="right"
      label-width="110px"
      size="small"
      :rules="formRules"
      :model="form"
      style="padding-right: 20px;"
    >
      <el-form-item
        v-if="!isEdit && custType !=='1'"
        label="公司类型"
      >
        <el-select
          v-model="form.tag"
          size="small"
          style="width:100%;"
          placeholder="公司类型"
          @change="onType"
        >
          <el-option
            v-for="(item, index) in typeList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-show="!isEdit && form.tag === '4'"
        label="分公司"
      >
        <el-select
          v-model="form.comId"
          :loading="selectLoading"
          size="small"
          style="width:100%;"
          placeholder="请选择"
          filterable
          clearable
          @change="onFiliale"
          @focus="getFilialeCompanyList"
        >
          <el-option
            v-for="item in filialeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="!isEdit && ((custType !== '3' && form.tag !== '1' && form.tag !== '5') || (custType === '3' && form.tag === '8'))"
        label="所属公司"
        prop="custName"
      >
        <el-select
          v-model="form.custId"
          :loading="selectLoading"
          :disabled="form.tag === '4' && !form.comId"
          size="small"
          style="width:100%;"
          placeholder="请选择"
          filterable
          clearable
          @change="onCompany"
          @focus="getCompanyList"
        >
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="isEdit"
        label="所属公司"
        prop="custName"
      >
        <el-input
          v-model="form.custName"
          :disabled="isEdit"
        />
      </el-form-item>
      <el-form-item
        label="所属部门"
        prop="deptId"
      >
        <el-tree-select
          ref="tree"
          v-model="form.deptId"
          :data="deptList"
          :default-expand-all="false"
          clearable
          filterable
          size="small"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item
        label="所属岗位"
      >
        <el-select
          v-model="form.postId"
          placeholder="请选择"
          style="width: 100%;"
          clearable
          filterable
          :loading="postLoading"
          @focus="getPostList"
        >
          <el-option
            v-for="item in positionList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="用户姓名"
        prop="realName"
      >
        <el-input
          v-model="form.realName"
          :maxlength="20"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item
        label="手机号码"
        prop="phone"
      >
        <el-input
          v-model="form.phone"
          placeholder="请输入"
          :maxlength="20"
        />
      </el-form-item>

      <el-form-item
        label="登录账号"
        prop="un"
      >
        <el-input
          v-model="form.un"
          autocomplete="off"
          placeholder="请输入"
          :maxlength="20"
          :disabled="isEdit"
        />
      </el-form-item>

      <el-form-item
        label="设置密码"
        prop="pw"
      >
        <el-input
          ref="newPwdRef"
          v-model="form.pw"
          autocomplete="new-password"
          :maxlength="20"
          placeholder="请输入"
          :type="(form.pw || (newPwdReadOnly && form.pw)) ? 'password' : 'text'"
          auto-complete="new-password"
          name="new_password"
          :readonly="newPwdReadOnly"
          @focus="newPwdFocus($event)"
          @blur="newPwdBlur($event)"
        />
        <!--<el-form-item label="密码" prop="password">
          <el-input
            v-model="info.password"
            :type="((newPwdReadOnly && info.password) || info.password)?'password':'text'"
            auto-complete="new-password"
            name="person.user.new_password"
            @focus="newPwdFocus($event)"
            :readonly="newPwdReadOnly"
            @blur="newPwdBlur($event)"
            ref="newPwdRef"
          ></el-input>-->
        <!--</el-form-item>-->
      </el-form-item>
      <el-form-item
        v-if="!isEdit"
        label="强制修改密码"
        prop="ifUpdatePassword"
      >
        <el-radio-group
          v-model="form.ifUpdatePassword"
        >
          <el-radio label="0">
            否
          </el-radio>
          <el-radio label="1">
            是
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="用户权限"
        prop="roles"
      >
        <el-select
          v-model="form.roles"
          placeholder="请选择"
          style="width: 100%;"
          multiple
          collapse-tags
          clearable
          value-key="id"
        >
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.name"
            :value="item"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getUser,
  saveUser,
  getPostList,
  getUnFinanceAgentList,
  getCustomerList,
  getAgentList,
  getSupplierList,
  getCustomerServiceType
} from '@/api/jht-user-management'
import { getOrgType } from '@/api/jht-organization'
import { getRoles } from '@/api/jht-role-management'
import { getDeptList } from '@/api/jht-department'

function formParams() {
  return {
    tag: '1',
    comId: '',
    comName: '',
    custId: '', // 所属公司id
    custName: '', // 所属公司名称
    deptId: '', // 所属部门id
    deptName: '',
    postId: '',
    realName: '', // 用户姓名
    un: '', // 用户登录名
    phone: '', // 用户手机
    pw: '', // 用户密码
    roles: [], // 用户权限
    ifUpdatePassword: '0'
  }
}

@Component({
  name: '',
  components: {},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    typeList: {
      type: Array,
      default: () => []
    }
  }
})
export default class extends Vue {
  /** ------- data ------- */
  private form: any = formParams()
  private selectLoading: boolean = false
  private editLoading: boolean = false
  private isCompanyLoading:boolean = false
  private rolesLoading:boolean = false
  private postLoading:boolean = false
  private newPwdReadOnly:boolean = false
  private rolesList: any[] = []
  private orgTypeList: any[] = []
  private companyList:any[] = []
  private positionList:any[] = []
  private filialeList:any[] = []
  private typeIds: any[] = []

  private formRules = {
    ifUpdatePassword: [{ required: true, message: '请选择是否强制修改密码', trigger: 'change' }],
    custName: [{ required: true, message: '所属公司不能为空', trigger: 'change' }], // 所属公司
    deptId: [{ required: true, message: '所属部门不能为空', trigger: 'blur' }], // 所属部门
    realName: [
      { required: true, message: '用户姓名不能为空', trigger: 'blur' }
    ],
    phone:
   [
     { required: true, message: '手机号码不能为空', trigger: 'blur' },
     {
       validator(rule: any, value: any, callback: (val?: any) => void) {
         const reg = /[\u4e00-\u9fa5]/
         if (value && reg.test(value)) {
           callback(new Error('手机号码不能有中文'))
         } else {
           callback()
         }
       },
       trigger: 'blur'
     }
   ], // 所属公司
    un: [
      { required: true, message: '登录账号不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
          if (!value) {
            callback()
          }
          if (value.length < 4) {
            callback(new Error('登录账号长度不能小于4位'))
          }
          if (!reg.test(value)) {
            callback(new Error('格式不正确，必须以字母开头且只包含数字字母下划线'))
          } else {
            callback()
          }
        }
      }
    ], // 登录账号
    pw: [
      { required: true, message: '账号密码不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^(?:\d+|[a-zA-Z\\W]+|[!@#$%^&*]+){6,20}$/
          if (!value) {
            callback()
          }
          if (value.length < 6 || value.length > 20) {
            callback(new Error('密码长度必须是大于6位小于20位'))
          }
          if (!reg.test(value)) {
            callback(new Error('密码格式不正确'))
          } else {
            callback()
          }
        }
      }
    ], // 账号密码
    roles: [{ required: true, message: '请选择用户权限', trigger: 'change' }] //  用户权限
  }
  private deptList: any = []

  /** computed */
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
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }
  get custSubtype(): string {
    const info = UserModule.info || {}
    const custSubtype = (info as any).custSubtype
    return custSubtype
  }

  get parentId(): string {
    const info = UserModule.info || {}
    const parentId = (info as any).parentId
    return parentId
  }
  get parentName(): string {
    const info = UserModule.info || {}
    const parentName = (info as any).parentName
    return parentName
  }

  @Watch('form.pw')
  private pwChange(val: any) {
    if (val === '') {
      this.newPwdReadOnly = true
      setTimeout(() => {
        this.newPwdReadOnly = false
      }, 10)
    }
  }
  /** ------- methods ------- */
  private newPwdFocus(evt: any) {
    if (evt) {
      evt.stopPropagation()
      evt.preventDefault()
    }
    setTimeout(() => {
      this.newPwdReadOnly = false
    }, 10)
  }

  private newPwdBlur(evt: any) {
    if (evt) {
      evt.stopPropagation()
    }
    this.newPwdReadOnly = true
  }
  private async setTag(val: any, row?: any) {
    this.form.tag = val
    if (row) {
      await this.getUserById(val, row)
    } else {
      await this.onType()
    }
  }
  // 查询用户详情
  private async getUserById(val: any, row: any) {
    this.editLoading = true
    getUser(row.id)
      .then(async(res: any) => {
        const { data = {} } = res
        const json = JSON.parse(JSON.stringify(data))
        const { roles = [], deptId = '', username, password, ...obj } = data
        this.form = {
          ...obj,
          tag: val,
          custType: row.custType,
          un: username,
          pw: password
        }
        await this.getServerTypes()
        await this.getRoles()
        await this.getDeptList()
        this.getPostList()
        const filterRoles = roles.map((it: any) => {
          if (this.rolesList.some((a: any) => a.id === it.id)) {
            return it
          }
        }).filter((it: any) => it && it.id)
        this.$set(this.form, 'roles', filterRoles)
        this.$set(this.form, 'deptId', deptId)
        this.editLoading = false
      })
      .catch(err => {
        this.editLoading = false
        return err
      })
  }
  private async onType() {
    this.form.deptId = ''
    this.form.comId = ''
    this.form.comName = ''
    this.form.custName = ''
    this.form.custId = ''
    this.form.postId = ''
    this.typeIds = []
    this.rolesList = []
    this.filialeList = []
    this.companyList = []
    if (this.form.tag === '1' || this.form.tag === '5' || (this.custType === '3' && this.form.tag === '7')) {
      this.form.custName = (this as any).custName
      this.form.custId = (this as any).custId
      await this.getServerTypes()
      await this.getRoles()
      await this.getDeptList()
    }
  }
  private getFilialeCompanyList() {
    this.selectLoading = true
    getUnFinanceAgentList().then((res:any) => {
      const data = res.data || []
      this.filialeList = data
      this.selectLoading = false
    }).catch((err:any) => {
      this.selectLoading = false
      return err
    })
  }
  private onFiliale(val: any) {
    this.form.custId = ''
    this.form.custName = ''
    this.form.comName = ''
    const item = this.filialeList.find((it: any) => it.id === val)
    if (item) {
      this.form.comName = item.name
    }
  }
  private getCompanyList() {
    const params:any = {
      page: 1,
      size: 99999
    }
    const { tag, comId } = this.form
    let func:any = null
    if (tag === '2' || tag === '8' || tag === '4') { // 客户
      params.custIds = tag === '4' ? [comId] : [(this as any).custId]
      func = getCustomerList(params)
    } else if (tag === '3') { // 分公司
      func = getUnFinanceAgentList()
    } else if (tag === '6') { // 一级代理商
      params.parentId = (this as any).custId
      func = getAgentList(params)
    } else if (tag === '7') { // 供应商
      func = getSupplierList(params)
    } else {
      this.companyList = []
      return
    }
    this.selectLoading = true
    func.then((res:any) => {
      if (tag === '3' || tag === '2' || tag === '4' || tag === '8') {
        const data = res.data || []
        this.companyList = data
      } else {
        const data = res.data || {}
        this.companyList = data.result || []
      }
      this.selectLoading = false
    }).catch((err:any) => {
      this.selectLoading = false
      return err
    })
  }
  private async onCompany() {
    this.form.deptId = ''
    this.form.deptName = ''
    this.form.custName = ''
    this.typeIds = []
    this.deptList = []
    this.rolesList = []
    const item = this.companyList.find((it: any) => it.id === this.form.custId)
    if (item) {
      this.form.custName = item.name
      await this.getServerTypes()
      await this.getRoles()
      await this.getDeptList()
    }
  }
  private async getServerTypes() {
    // 公司服务大类
    try {
      const res = await getCustomerServiceType({
        custId: this.form.custId
      })
      const data = res.data || []
      this.typeIds = data.map((item:any) => item.id)
    } catch (error) {
      this.editLoading = false
      return error
    }
  }

  // 查询部门列表
  private async getDeptList() {
    const { tag, custId } = this.form
    const ctype = (this as any).custType
    let deptId: any = ''
    if (tag === '1' || tag === '5' || (ctype === '3' && tag === '7')) {
      // 本公司账号所在部门
      deptId = (this as any).deptId
    }
    if (!custId) return
    const params: any = {
      custId,
      deptId
    }
    await getDeptList(params)
      .then(res => {
        const data = res.data || {}
        const result = data.result || []
        const json = JSON.parse(
          JSON.stringify(result)
            .replace(/name/g, 'label')
            .replace(/id/g, 'value')
        )
        this.deptList = json
      })
      .catch(err => {
        return err
      })
  }
  //  获取岗位列表
  private getPostList() {
    this.postLoading = true
    const { tag } = this.form
    let type: any = '' // 0-聚货通，1-客户，2-代理商，3-供应商
    if (tag === '1' || tag === '3' || tag === '6') {
      type = '2'
    } else if (tag === '2' || tag === '4' || tag === '8') {
      type = '1'
    } else if (tag === '5') {
      type = '0'
    } else if (tag === '7') {
      type = '3'
    }
    const params = {
      page: 1,
      size: 99999,
      type
    }
    getPostList(params).then(res => {
      this.postLoading = false
      this.positionList = res.data.result || []
    }).catch(err => {
      this.postLoading = false
      return err
    })
  }
  // 获取角色
  private async getRoles() {
    this.rolesLoading = true
    const { tag } = this.form
    let type: any = '' // 0-聚货通，1-客户，2-代理商，3-供应商
    if (tag === '1' || tag === '3' || tag === '6') {
      type = '2'
    } else if (tag === '2' || tag === '4' || tag === '8') {
      type = '1'
    } else if (tag === '5') {
      type = '0'
    } else if (tag === '7') {
      type = '3'
    }
    if (this.typeIds.length <= 0) {
      this.rolesList = []
      return
    }
    await getRoles({
      typeIds: this.typeIds,
      custType: type
    })
      .then((res: any) => {
        this.rolesLoading = false
        this.rolesList = res.data || []
      })
      .catch((err: any) => {
        this.rolesLoading = false
        this.editLoading = false
        return err
      })
  }
  private closeUser() {
    this.$nextTick(() => {
      const root: any = this.$refs.userRoot
      this.form = formParams()
      this.rolesList = []
      this.typeIds = []
      root.clearValidate()
    })
  }
  // 提交表单
  private saveUser() {
    const tree: any = this.$refs.tree
    const { tag, comId, comName, ...form } = this.form
    const userRoot:any = this.$refs.userRoot
    userRoot.validate((valid: any) => {
      if (valid) {
        this.$emit('setLoad', true)
        // 添加角色名称
        const params: any = {
          ...form,
          ifOnce: (this as any).isEdit ? form.ifOnce : '1' // 是否初始密码
        }
        // if (!(this as any).isEdit) {
        const custType = (this as any).custType
        const custSubtype = (this as any).custSubtype
        if (tag === '1') { // 代理商
          params.custType = '2'
          params.custSubtype = custSubtype
          params.parentName = (this as any).parentName
          params.parentId = (this as any).parentId
        } else if (tag === '3' || tag === '6') { // 新增：一级代理商，分公司
          params.custType = '2'
          params.custSubtype = tag === '3' ? '2' : '1'
          params.parentName = (this as any).custName
          params.parentId = (this as any).custId
        } else if (tag === '2' || tag === '4' || tag === '8') { // 新增：代理商客户，分公司客户，供应商客户
          params.custType = '1'
          const item = this.companyList.find((it: any) => it.id === params.custId)
          params.custSubtype = (item || {}).subtype
          params.parentName = tag === '4' ? comName : (this as any).custName
          params.parentId = tag === '4' ? comId : (this as any).custId
        } else if (tag === '5') { // 聚货通
          params.custType = '0'
        } else if (tag === '7') { // 供应商
          params.custType = '3'
          params.parentName = custType === '0' ? (this as any).custName : (this as any).parentName
          params.parentId = custType === '0' ? (this as any).custId : (this as any).parentId
        }
        // }
        this.positionList.find(item => {
          if (item.id === params.postId) {
            params.postName = item.name
          }
        })
        params.deptName = tree.query
        params.username = params.un.trim()
        params.password = params.pw.trim()
        saveUser(params)
          .then(res => {
            this.editLoading = false
            this.$emit('onOk')
            this.$emit('getUserList')
          })
          .catch(err => {
            this.editLoading = false
            return err
          })
      }
    })
  }
}
</script>

<style lang="scss" scoped></style>
