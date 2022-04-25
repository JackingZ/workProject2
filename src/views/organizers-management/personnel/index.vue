<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="width: 100%;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          title="人员管理"
          info=""
        />
        <div class="app-panel">
          <el-row>
            <el-col :span="2">
              <el-button
                v-permission="['addUser']"
                type="text"
                icon="el-icon-circle-plus-outline"
                @click="handleAdd"
              >
                新增
              </el-button>
            </el-col>
            <el-col
              :span="22"
              style="text-align:right;"
            >
              <el-select
                v-if="custType !=='1'"
                v-model="selectValue.tag"
                size="small"
                style="width:120px;margin-right:5px;"
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
              <el-select
                v-if="selectValue.tag === '4'"
                v-model="selectValue.comId"
                :loading="selectLoading"
                size="small"
                style="width:130px;margin-right:5px;"
                placeholder="分公司"
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
              <el-select
                v-if="(custType !== '3' && selectValue.tag !== '1' && selectValue.tag !== '5') || (custType === '3' && selectValue.tag === '8')"
                v-model="selectValue.custId"
                :loading="selectLoading"
                :disabled="selectValue.tag === '4' && !selectValue.comId"
                size="small"
                style="width:200px;margin-right:5px;"
                placeholder="所属公司"
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
              <el-tree-select
                v-model="selectValue.deptId"
                :data="departmentList"
                :default-expand-all="false"
                filterable
                clearable
                size="small"
                style="display:inline-block;width:140px;margin-right:5px;"
                placeholder="请选择所属部门"
                @change="onDept"
              />
              <el-select
                v-model="selectValue.status"
                size="small"
                clearable
                style="width:120px;margin-right:5px;"
                placeholder="启用状态"
              >
                <el-option
                  label="启用中"
                  value="1"
                />
                <el-option
                  label="已禁用"
                  value="0"
                />
              </el-select>

              <el-input
                v-model="selectValue.key"
                placeholder="请输入内容"
                class="input-with-select"
                style="width:300px;margin-right: 10px;"
                size="small"
              >
                <el-select
                  slot="prepend"
                  v-model="selectValue.keyType"
                  size="small"
                  style="width: 100px;"
                  placeholder="请选择"
                >
                  <el-option
                    label="用户姓名"
                    value="1"
                  />
                  <el-option
                    label="手机号码"
                    value="2"
                  />
                  <el-option
                    label="登录账号"
                    value="3"
                  />
                </el-select>
              </el-input>
              <el-button
                v-permission="['queryUser']"
                type="primary"
                size="small"
                @click="getUserList(1)"
              >
                查询
              </el-button>
            </el-col>
          </el-row>
          <el-table
            v-loading="isTableLoading"
            :data="list"
            height="calc(100vh - 300px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              label="姓名"
              min-width="100"
              prop="realName"
            />
            <el-table-column
              label="登录名"
              min-width="100"
              prop="username"
            />
            <el-table-column
              label="手机号"
              width="150"
              prop="phone"
            />
            <el-table-column
              label="所属公司"
              min-width="100"
              prop="custName"
            />
            <el-table-column
              label="所属部门"
              min-width="100"
              prop="deptName"
            />
            <el-table-column
              label="用户权限"
              min-width="120"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ rolesFormatter(scope.row.roles) }}
              </template>
            </el-table-column>
            <el-table-column
              label="添加时间"
              width="180"
              prop="createTime"
            />
            <el-table-column
              label="状态"
              width="100"
            >
              <template slot-scope="scope">
                <el-switch
                  v-if="scope.row.id !== 'admin' && scope.row.username !== username"
                  :value="scope.row.status"
                  :disabled="!$checkPermission(['userChangeStatus'])"
                  class="switchStyle"
                  active-text="启用"
                  inactive-text="禁用"
                  active-value="1"
                  inactive-value="0"
                  @input="(value) => onStatus(scope.row, value)"
                />
                <div v-else>
                  {{ scope.row.status === '1' ? '启用' : '禁用' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="180"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.id !== 'admin' && scope.row.username !== username && $checkPermission(['userPassword'])"
                  type="text"
                  size="medium"
                  @click="resetPassword(scope.row)"
                >
                  重置密码
                </el-button>
                <el-button
                  v-if="scope.row.id !== 'admin' && scope.row.username !== username"
                  v-permission="['editUser']"
                  type="text"
                  size="medium"
                  @click="editUser(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-if="scope.row.id !== 'admin' && scope.row.username !== username && $checkPermission(['deleteUser'])"
                  type="text"
                  size="medium"
                  @click="deleteUser(scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            :current-page.sync="page"
            :page-size="size"
            layout="total, prev, pager, next"
            :total="total"
            style="text-align: right;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
        <app-drawer
          :is-show="isShow"
          :cancel-text="'取消'"
          :confirm-text="'确定'"
          :mask-closable="false"
          drawer-title="用户管理"
          drawer-style="width: 500px;"
          @drawerClose="close"
          @drawerConfirm="confirm"
        >
          <edit-user
            ref="userForm"
            :is-edit="isEdit"
            :type-list="typeList"
            @onOk="close"
            @getUserList="getUserList"
          />
        </app-drawer>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getUserList,
  resetPassword,
  deleteUser,
  changeStatus,
  getDeptList,
  getSupplierList,
  getAgentList,
  getUnFinanceAgentList,
  getCustomerList,
  getCustomerServiceType,
  getUser
} from '@/api/jht-user-management'
import EditUser from '@/views/organizers-management/personnel/components/edit-user.vue'

@Component({
  name: 'Organization',
  components: {
    EditUser
  },
  props: {}
})
export default class extends Vue {
  private page = 1
  private size = 10
  private total = 0
  private isActive = false // 左侧机构树折叠
  private isShow = false
  private isTableLoading = false
  private isEdit: boolean = false
  private list: any = []
  private departmentList:any[] = []
  private companyList:any[] = []
  private filialeList:any[] = []
  private selectLoading:boolean = false

  private selectValue: any = {
    custId: undefined, // 所属公司
    comId: undefined,
    deptId: '', // 所属部门
    tag: undefined, // 类型
    status: undefined, // 所属状态
    keyType: '1', // 关键字类型
    key: undefined
  }
  private typeList: any[] = []

  /** ------- computed ------- */

  // 所属公司id
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
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
  get username():string {
    const info = UserModule.info || {}
    const username = (info as any).username
    return username
  }
  // 所属公司Name
  get custName(): string {
    const info = UserModule.info || {}
    const custName = (info as any).custName
    return custName
  }

  /** methods */

  private async created() {
    const type = (this as any).custType
    const subType = (this as any).custSubtype
    if (type === '0') { // 聚货通
      this.typeList = [
        { id: '5', name: '聚货通' },
        { id: '6', name: '一级代理商' },
        { id: '7', name: '供应商' }
      ]
      this.selectValue.tag = '5' // 默认项
    } else if (type === '2' && subType === '1') { // 一级代理商
      this.typeList = [
        { id: '1', name: '本公司' },
        { id: '2', name: '客户(本公司)' },
        { id: '3', name: '分公司' },
        { id: '4', name: '客户(分公司)' }
      ]
      this.selectValue.tag = '1'
    } else if (type === '2' && subType === '2') { // 二级代理商
      this.typeList = [
        { id: '1', name: '本公司' },
        { id: '2', name: '客户' }
      ]
      this.selectValue.tag = '1'
    } else if (type === '3') {
      this.selectValue.tag = '7'
      this.typeList = [
        { id: '7', name: '本公司' },
        { id: '8', name: '客户' }
      ]
    }

    this.selectValue.custId = (this as any).custId
    this.getDepartment()
    this.getUserList()
  }
  // 所属公司变化---聚货通和代理商可见
  private onType() {
    this.selectValue.deptId = ''
    this.selectValue.custId = ''
    this.list = []
    const { tag } = this.selectValue
    if (tag === '1' || tag === '5' || ((this as any).custType === '3' && tag === '7')) {
      this.selectValue.custId = (this as any).custId
    }
    this.getDepartment()
    this.getUserList()
  }

  private filterNode(value: any, data: any) {
    if (!value) return true
    return data.title.indexOf(value) !== -1
  }
  private close() {
    this.isShow = false
    this.$nextTick(() => {
      const root: any = this.$refs.userForm
      root.closeUser()
    })
  }

  // 提交储存用户
  private confirm() {
    const root: any = this.$refs.userForm
    root.saveUser()
  }

  // 启用禁用用户
  private async onStatus(row: any, value: any): Promise<void> {
    if (!row.status || row.status === value) {
      return
    }
    const text = value === '0' ? '禁用' : '开启'
    const [cancel, confirm] = await this.$confirm(
      `此操作将${text}用户，是否继续？`,
      '提示',
      {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(res => {
        return [null, res]
      })
      .catch(err => {
        return [err, null]
      })
    if (cancel) return
    changeStatus({
      id: row.id,
      status: value
    })
      .then(res => {
        this.$message.success('修改成功')
        this.getUserList()
      })
      .catch(err => {
        return err
      })
  }

  private getCompanyList() {
    const params:any = {
      page: 1,
      size: 99999
    }
    let func:any = null
    const { tag } = this.selectValue
    if (tag === '2' || tag === '4' || tag === '8') { // 客户
      params.custIds = tag === '4' ? [this.selectValue.comId] : [(this as any).custId]
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

  private onCompany() {
    this.selectValue.deptId = ''
    this.departmentList = []
    this.getDepartment()
    this.getUserList(1)
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
  private onFiliale() {
    this.selectValue.custId = undefined
    this.list = []
    this.companyList = []
    this.getUserList(1)
  }

  private onDept() {
    this.getUserList(1)
  }
  // 获取部门数据
  private getDepartment() {
    let deptId: any = ''
    if (this.selectValue.tag === '1' || this.selectValue.tag === '5' || (this.custType === '3' && this.selectValue.tag === '7')) {
      deptId = (this as any).deptId
    }
    if (!this.selectValue.custId) return
    const params:any = {
      custId: this.selectValue.custId,
      deptId
    }
    getDeptList(params).then(res => {
      const departmentList = res.data.result || []
      const json = JSON.parse(
        JSON.stringify(departmentList)
          .replace(/name/g, 'label')
          .replace(/id/g, 'value')
      )
      this.departmentList = json
    }).catch(err => {
      return err
    })
  }
  // 删除用户
  private async deleteUser(row: any): Promise<void> {
    const { id } = row
    const [cancel, confirm] = await this.$confirm(
      '此操作将删除用户，是否继续？',
      '提示',
      {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(res => {
        return [null, res]
      })
      .catch(err => {
        return [err, null]
      })
    if (cancel) return
    deleteUser(id)
      .then((res: any) => {
        const { msg } = res
        this.$message.success(msg)
        this.getUserList()
      })
      .catch(err => {
        return err
      })
  }

  // 重置密码
  private async resetPassword(row: any): Promise<void> {
    const { id } = row
    const [cancel, confirm] = await this.$confirm(
      '此操作将重置用户密码，是否继续？',
      '提示',
      {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(res => {
        return [null, res]
      })
      .catch(err => {
        return [err, null]
      })
    if (cancel) return
    resetPassword(id)
      .then(res => {
        const { data } = res
        this.$message.success(`密码重置成功，新密码为：${data}`)
      })
      .catch(err => {
        return err
      })
  }
  // 新增用户
  private async handleAdd() {
    this.isShow = true
    this.isEdit = false
    const { tag } = this.selectValue
    this.$nextTick(() => {
      const root: any = this.$refs.userForm
      root.setTag(tag)
    })
  }

  // 编辑用户
  private async editUser(row: any) {
    this.isShow = true
    this.isEdit = true
    const { tag } = this.selectValue
    this.$nextTick(() => {
      const root: any = this.$refs.userForm
      root.setTag(tag, row)
    })
  }

  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.getUserList()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.getUserList()
  }

  private rolesFormatter(roles: any[]) {
    if (Array.from(roles) && roles) {
      const roleName = roles.map(item => item.name)
      return roleName.join(',')
    } else {
      return '--'
    }
  }

  // 查询列表
  private getUserList(val?: any) {
    this.isTableLoading = true
    const { custId, tag, comId, ...form } = this.selectValue
    if (val) {
      this.page = val
    }
    const params = {
      model: {
        ...form,
        tag,
        custIdList: tag === '4' && comId ? [comId] : custId ? [custId] : [],
        customerList: tag === '4' && custId ? [custId] : []
      },
      page: this.page,
      size: this.size
    }
    getUserList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.list = data.result || []
        this.total = data.total
        this.isTableLoading = false
      })
      .catch((err: any) => {
        this.isTableLoading = false
        return err
      })
  }
}
</script>
