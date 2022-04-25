<template>
  <div class="roles-container">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          :title="'权限设置'"
          info=""
        />
        <div class="app-panel">
          <el-row style="margin-bottom: 10px">
            <el-col :span="12">
              <el-button
                v-if="custId === '0'"
                type="text"
                size="mini"
                @click="addRole"
              >
                新增权限
              </el-button>
            </el-col>
          </el-row>
          <div
            v-loading="tableLoading"
            class="roles-set"
          >
            <div class="roles-name">
              <div style="width: 210px;float:left;">
                <span style="padding-left:20px;">角色组</span>
              </div>
              <div style="margin-left:210px;">
                <el-row>
                  <el-col
                    :xs="12"
                    :sm="6"
                    :lg="4"
                  >
                    <div style="color:#666;padding-left:10px;">
                      菜单页面
                    </div>
                  </el-col>
                  <el-col
                    :xs="12"
                    :sm="18"
                    :lg="20"
                  >
                    <div style="color:#666;padding-left:20px;text-align: right;">
                      <span style="float: left;">操作权限</span>
                      <el-select
                        v-model="selectValue.custType"
                        size="small"
                        style="width:120px;margin-right:20px;"
                        placeholder="公司类型"
                        @change="onCompanyType"
                      >
                        <el-option
                          label="聚货通"
                          value="0"
                        />
                        <el-option
                          label="客户"
                          value="1"
                        />
                        <el-option
                          label="代理商"
                          value="2"
                        />
                        <el-option
                          label="供应商"
                          value="3"
                        />
                      </el-select>
                      <el-select
                        v-if="selectValue.custType !== '0'"
                        v-model="selectValue.typeId"
                        :loading="selectLoading"
                        size="small"
                        filterable
                        style="width:120px;margin-right:20px;"
                        placeholder="服务大类"
                        @change="onServiceType"
                        @focus="getServiceTypeList"
                      >
                        <el-option
                          v-for="item in serviceTypeList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        />
                      </el-select>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="roles-list">
              <el-menu
                :default-active="selectRoleId"
                background-color="#f0f2f5"
                style="border-right: none;"
                @select="getRolePermission"
              >
                <el-menu-item
                  v-for="(item, index) in rolesOptions"
                  :key="item.id"
                  :index="String(item.id)"
                  class="role-menu-item"
                >
                  <div
                    slot="title"
                    style="text-overflow: ellipsis;overflow:hidden;"
                  >
                    <div
                      v-if="isEdit === index"
                      class="el-input el-input--small"
                    >
                      <input
                        ref="inputEdit"
                        v-model="roleForm.name"
                        class="el-input__inner"
                        type="text"
                        :maxlength="20"
                        placeholder="请输入名称"
                        @click="$event.stopPropagation()"
                        @blur="handleRoleName('edit')"
                      >
                    </div>
                    <div v-else>
                      <i class="el-icon-user-solid" />
                      <span>{{ item.name }}</span>
                      <!-- <span
                        v-if="item.system"
                        style="font-size:12px;color:#ccc;"
                      >{{ '(默认)' }}</span> -->
                    </div>

                    <div
                      v-show="selectRoleId === item.id"
                      slot="reference"
                      class="role-menu-icon"
                      @click.stop="isShow = true"
                      @mouseleave="isShow = false"
                    >
                      <i class="el-icon-caret-bottom" />
                      <div
                        v-show="isShow && selectRoleId === item.id"
                        class="role-popover-box"
                      >
                        <div
                          v-permission="['editPermit']"
                          class="role-popover-div"
                          @click.stop="handleRoleName('input', item, index)"
                        >
                          编辑
                        </div>
                        <div
                          v-permission="['deletePermit']"
                          class="role-popover-div"
                          @click.stop="handleRoleName('delete', item)"
                        >
                          删除
                        </div>
                      </div>
                    </div>
                  </div>
                </el-menu-item>
                <el-menu-item
                  index="addRole"
                  style="height:auto;padding:0;"
                >
                  <template slot="title">
                    <div
                      v-if="isAdd"
                      style="padding:10px 20px 0px 20px;"
                    >
                      <el-input
                        v-model="roleForm.name"
                        style="display:block;line-height:32px;height:32px;"
                        :maxlength="20"
                        placeholder="请输入名称"
                        size="small"
                        @keyup.enter.native="handleRoleName('add')"
                      />
                      <el-button
                        type="primary"
                        size="mini"
                        @click="handleRoleName('add')"
                      >
                        确定
                      </el-button>
                      <el-button
                        size="mini"
                        @click="handleRoleName('cancle')"
                      >
                        取消
                      </el-button>
                    </div>

                    <div
                      v-else
                      v-permission="['addPermit']"
                      style="padding:0 20px;"
                      @click="handleRoleAdd"
                    >
                      <el-button
                        style="font-size: 14px;color: #303133;"
                        type="text"
                        size="small"
                        class="role-menu-add"
                      >
                        <i class="el-icon-circle-plus-outline" />新增
                      </el-button>
                    </div>
                  </template>
                </el-menu-item>
              </el-menu>
            </div>

            <div class="roles-level">
              <el-form
                class="role-item-line"
                style="min-width: 1000px;overflow-x: auto;height: calc(100vh - 400px);padding-left: 10px;"
              >
                <el-form-item
                  v-for="(itemOne, indexOne) in permissData.render"
                  :key="indexOne"
                >
                  <el-row :class="itemOne.children && itemOne.children.length > 0 ? '': 'is-item-line'">
                    <el-col
                      :xs="24"
                      :sm="6"
                      :lg="4"
                      :class="
                        itemOne.children && itemOne.children.length > 0
                          ? 'is-item-line'
                          : ''
                      "
                      style="padding-left: 10px;"
                    >
                      <el-checkbox
                        v-model="itemOne.checked"
                        :indeterminate="itemOne.selected"
                        :disabled="itemOne.disabled"
                        :label="itemOne.id"
                        @change="setCheckedOne(itemOne)"
                        @contextmenu.native.prevent="editRole(itemOne)"
                      >
                        {{ itemOne.name }}
                      </el-checkbox>
                    </el-col>

                    <el-col
                      v-if="itemOne.children"
                      :xs="24"
                      :sm="18"
                      :lg="20"
                      style="border-left:1px solid #eee;"
                    >
                      <el-row
                        v-for="(itemTwo, indexTwo) in itemOne.children"
                        :key="indexTwo"
                        style="border-top:1px solid #eee;"
                      >
                        <el-col
                          :xs="24"
                          :sm="7"
                          :md="5"
                          :lg="5"
                          style="padding-left: 10px;"
                        >
                          <el-checkbox
                            v-model="itemTwo.checked"
                            :indeterminate="itemTwo.selected"
                            :disabled="itemTwo.disabled"
                            :label="itemTwo.id"
                            @change="setCheckedTwo(itemTwo, itemOne)"
                            @contextmenu.native.prevent="editRole(itemTwo, itemOne)"
                          >
                            {{ itemTwo.name }}
                          </el-checkbox>
                        </el-col>

                        <el-col
                          :xs="20"
                          :sm="17"
                          :md="19"
                          :lg="19"
                          style="border-left:1px solid #eee;"
                        >
                          <el-row
                            v-if="itemTwo && itemTwo.children"
                            style="padding-left: 10px;"
                          >
                            <el-col
                              v-for="(itemThree, indexThree) in itemTwo.children"
                              :key="indexThree"
                              :xs="12"
                              :sm="12"
                              :md="6"
                              :xl="4"
                            >
                              <el-checkbox
                                v-model="itemThree.checked"
                                :disabled="itemThree.disabled"
                                :label="itemThree.id"
                                @change="setCheckedThree(itemThree, itemTwo, itemOne)"
                                @contextmenu.native.prevent="editRole(itemThree, itemTwo, itemOne)"
                              >
                                {{ itemThree.name }}
                              </el-checkbox>
                            </el-col>
                          </el-row>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-form>
              <div style="text-align: right;padding: 15px 30px 0 0;border-top: 1px solid #ccc;">
                <el-button
                  v-permission="['updatePermit']"
                  type="primary"
                  style="padding:10px 30px;"
                  size="mini"
                  @click="handleUpdatePermit"
                >
                  更新
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <add-form
      ref="addForm"
      :role-list="roleList"
      @load="getTreeOrglist"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getRoles,
  getPermitByRole,
  saveRolePermit,
  getPermits,
  deleteRole,
  saveRole,
  getServiceTypeList
} from '@/api/jht-role-management'
import addForm from '@/views/organizers-management/role/components/add.vue'

@Component({
  name: 'Role',
  components: {
    addForm
  },
  props: {}
})
export default class extends Vue {
  private rolesOptions: any = []
  private isAdd = false
  private tableLoading = false
  private permissData: any = {
    render: [],
    genesis: [],
    disabled: []
  }
  private currentSelectItem = null
  private isShow = false
  private isEdit = ''
  private selectRoleId = '' // 所选角色id
  private inputName = ''
  private roleForm: any = {
    name: undefined,
    id: undefined,
    custType: undefined,
    typeId: undefined,
    typeName: undefined
  }
  private rolesData: any[] = []
  private roleList: any[] = []
  private orgProps = {
    label: 'name',
    children: 'children'
  }
  private selectValue: any = {
    custType: '0',
    typeId: undefined
  }
  private serviceTypeList: any[] = []
  private selectLoading: boolean = false
  // 所属公司id
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }

  // 所属部门id
  get deptId(): string {
    const info = UserModule.info || {}
    const deptId = (info as any).deptId
    return deptId
  }

  // 所属公司Name
  get custName(): string {
    const info = UserModule.info || {}
    const custName = (info as any).custName
    return custName
  }
  // 所属部门Name
  get deptName(): string {
    const info = UserModule.info || {}
    const deptName = (info as any).deptName
    return deptName
  }
  // get canSave() {
  //   if (!this.currentSelectItem) return false
  //   const item: any = this.currentSelectItem
  //   return item.system
  // }
  get lang() {
    const lang = AppModule.language
    if (!lang) {
      return 'en'
    }
    return lang
  }

  private created(): void {
    this.getTreeOrglist()
  }
  private editRole(itemThree: any, itemTwo?: any, itemOne?: any) {
    (this.$refs.addForm as any).edit(itemThree, itemTwo, itemOne)
  }
  private addRole() {
    (this.$refs.addForm as any).show()
  }
  private onCompanyType() {
    this.selectRoleId = ''
    if (this.selectValue.custType === '0') {
      this.selectValue.typeId = undefined
      this.getRolesList()
    } else {
      this.selectValue.typeId = undefined
      this.rolesOptions = []
      this.permissData.render = []
    }
  }
  private onServiceType() {
    this.selectRoleId = ''
    if (this.selectValue.typeId) {
      this.getRolesList()
    } else {
      this.rolesOptions = []
      this.permissData.render = []
    }
  }
  // 获取服务大类
  private getServiceTypeList() {
    this.selectLoading = true
    const custType: any = this.selectValue.custType
    const params = {
      custType
    }
    getServiceTypeList(params)
      .then((res: any) => {
        const data = res.data || []
        if (this.selectValue.custType === '1') { // 客户
          this.serviceTypeList = data.filter((it: any) => {
            return it.customer
          })
        } else if (this.selectValue.custType === '2') { // 代理商
          this.serviceTypeList = data.filter((it: any) => {
            return it.agent
          })
        } else if (this.selectValue.custType === '3') { // 供应商
          this.serviceTypeList = data.filter((it: any) => {
            return it.supplier
          })
        }
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  // 获取角色列表
  private getTreeOrglist(): void {
    this.tableLoading = true
    getPermits()
      .then((res: any) => {
        const treeData = res.data || []
        const treeDisa: any[] = JSON.parse(JSON.stringify(treeData))
        this.roleList = treeDisa
        this.permissData.genesis = this.recursionFalse(treeData, false)
        // this.permissData.disabled = this.recursionFalse(treeDisa, true)
        this.getRolesList()
      })
      .catch((err: any) => {
        this.tableLoading = false
        return [err, null]
      })
  }
  private getRolesList(): void {
    getRoles({
      custType: this.selectValue.custType,
      typeIds: this.selectValue.typeId ? [this.selectValue.typeId] : []
    })
      .then((res: any) => {
        const roleOptions = res.data || []
        this.rolesOptions = roleOptions
        // 查第一个
        if (this.rolesOptions.length > 0) {
          this.getRolePermission(this.rolesOptions[0].id).catch(err => err)
        } else {
          this.permissData.render = []
        }
      })
      .catch((err: any) => {
        this.tableLoading = false
        return err
      })
  }

  // 获取该角色的权限
  private async getRolePermission(key: any) {
    // 菜单栏操作
    this.selectRoleId = key
    // 新增没有权限
    if (key === 'addRole') {
      return
    } else {
      this.isAdd = false
    }
    this.tableLoading = true
    const selectItem = this.rolesOptions.find((item: any) => item.id === key)
    this.currentSelectItem = selectItem
    // if (selectItem.system) {
    //   this.permissData.render = JSON.parse(
    //     JSON.stringify(this.permissData.disabled)
    //   )
    // } else {
    this.permissData.render = JSON.parse(
      JSON.stringify(this.permissData.genesis)
    )
    // }
    try {
      const resQL: any = await getPermitByRole(key)
      this.rolesData = resQL.data
      this.tableLoading = false
    } catch (error) {
      this.tableLoading = false
      return error
    }
    if (!this.rolesData || (this.rolesData && this.rolesData.length <= 0)) {
      return
    }
    const roleR: any[] = this.rolesData
    const lenI = roleR.length
    for (let j: number = 0; j < lenI; j++) {
      this.recursionRender(roleR[j], this.permissData.render)
    }
    this.checkboxRender(this.permissData.render)
  }
  // 数据渲染
  private checkboxRender(arr: any[]) {
    arr.forEach((itemOne: any) => {
      if (itemOne.checked) {
        if (!itemOne.children || itemOne.children.length <= 0) {
          return
        }
        const resC = itemOne.children.filter((a: any) => {
          return a.checked === true
        })
        if (resC.length < itemOne.children.length) {
          itemOne.checked = false
          itemOne.selected = true
        }
        itemOne.children.forEach((itemTwo: any, indexTwo: any) => {
          if (itemTwo.checked) {
            if (!itemTwo.children || itemTwo.children.length <= 0) {
              return
            }
            const resS = itemTwo.children.filter((a: any) => {
              return a.checked === true
            })
            if (resS.length < itemTwo.children.length) {
              itemTwo.checked = false
              itemTwo.selected = true
              itemOne.checked = false
              itemOne.selected = true
            }
          }
        })
      }
    })
  }
  private handleRoleAdd() {
    if (this.selectValue.custType !== '0' && !this.selectValue.typeId) {
      this.$message.error('请先选择服务大类')
      return
    }
    this.isAdd = true
    this.roleForm.name = ''
  }
  // 增删改查
  private async handleRoleName(name: string, item: any, index: any) {
    switch (name) {
      case 'add':
        this.addEditRole('add')
        break
      case 'input':
        this.isEdit = index
        this.inputName = item.name
        this.roleForm.name = item.name
        this.$nextTick(() => {
          const root: any = this.$refs.inputEdit
          root[0].focus()
        })
        this.isShow = false
        break
      case 'edit':
        this.addEditRole('edit')
        break
      case 'delete':
        try {
          const message = '此操作将永久删除该角色, 是否继续?'
          const title = '提示'
          await this.$confirm(message, title, {
            confirmButtonText: '确定',
            closeOnClickModal: false,
            cancelButtonText: '取消',
            type: 'warning'
          })
          deleteRole(item.id)
            .then((res: any) => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.isAdd = false
                this.refrehRoleList('first')
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                })
              }
            })
            .catch((err: any) => {
              return err
            })
        } catch (error) {
          return error
        }
        break
      case 'cancle':
        this.isAdd = false
        this.refrehRoleList('first')
        break
      default:
        break
    }
  }
  // 新增编辑
  private addEditRole(name: string) {
    const reg = /[`~!@#$%^&*()+=<>?:"{}|,.\\/;'\\[\]·~！@#￥%……&*（）+={}|《》？：“”【】、；‘’，。、]/im
    if (!this.roleForm.name) {
      this.$message.error('请输入角色姓名')
      return
    } else if (this.roleForm.name.trim() === '') {
      this.$message.error('姓名不能全为空')
      return
    } else if (reg.test(this.roleForm.name)) {
      this.$message.error('姓名不能为(-)(_)(——)( )之外的特殊字符')
      return
    }
    this.roleForm.custType = this.selectValue.custType
    this.roleForm.typeId = this.selectValue.typeId
    this.serviceTypeList.map((it: any) => {
      if (it.id === this.roleForm.typeId) {
        this.roleForm.typeName = it.name
      }
    })
    switch (name) {
      case 'add':
        this.roleForm.id = ''
        break
      case 'edit':
        this.isEdit = ''
        if (this.inputName === this.roleForm.name) return null
        this.roleForm.id = this.selectRoleId
        break
      default:
        break
    }
    try {
      saveRole(this.roleForm)
        .then((res: any) => {
          if (res.success) {
            switch (name) {
              case 'add':
                this.isAdd = false
                this.$message({
                  type: 'success',
                  message: '新增成功!'
                })
                this.refrehRoleList('add', res.data)
                break
              case 'edit':
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                })
                this.refrehRoleList('current')
                break
              default:
                break
            }
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
        .catch((err: any) => {
          return err
        })
    } catch (error) {
      this.$message.error(error)
    }
  }
  // 刷新角色列表
  private refrehRoleList(num: string, key?: string): void {
    const custId = (this as any).custId
    getRoles({
      custType: this.selectValue.custType,
      typeIds: this.selectValue.typeId ? [this.selectValue.typeId] : []
    })
      .then((res: any) => {
        this.rolesOptions = res.data || []
        switch (num) {
          case 'add':
            this.getRolePermission(key).catch(err => err)
            break
          case 'first':
            if (this.rolesOptions.length > 0) {
              this.getRolePermission(this.rolesOptions[0].id).catch(err => err)
            } else {
              this.permissData.render = []
            }
            break
          case 'current':
            this.getRolePermission(this.selectRoleId).catch(err => err)
            break
          default:
            break
        }
      })
      .catch((err: any) => {
        return err
      })
  }

  // 保存权限
  private handleUpdatePermit() {
    if (this.selectRoleId === '' || this.selectRoleId === 'addRole') {
      return
    }
    this.tableLoading = true
    this.rolesData = this.recursionArr(this.permissData.render)
    const permitArr = this.rolesData.map(item => {
      return item.permissionId
    })
    const params = {
      permitId: permitArr,
      roleId: this.selectRoleId
    }
    saveRolePermit(params)
      .then((res: any) => {
        this.tableLoading = false
        if (res.success) {
          this.$message({
            type: 'success',
            message: '更新成功!'
          })
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
      .catch((err: any) => {
        this.tableLoading = false
        return err
      })
  }

  // 递归函数
  private recursionFalse(data: any[], disabled: boolean) {
    const getId = (arr: any[]) => {
      if (arr.length <= 0) {
        return
      }
      arr.forEach(v => {
        v.checked = false
        v.selected = false
        if (disabled) {
          v.disabled = true
        } else {
          v.disabled = false
        }
        if (v.children && v.children.length > 0) {
          getId(v.children)
        }
      })
    }
    getId(data)
    return data
  }
  // 递归函数
  private recursionRender(res: any, data: any[]) {
    const getId = (arr: any[]) => {
      arr.forEach((v: any) => {
        if (res === v.id) {
          v.checked = true
        } else {
          if (v.children && v.children.length > 0) {
            getId(v.children)
          }
        }
      })
    }
    getId(data)
  }
  // 递归函数
  private recursionArr(data: any) {
    const res: any[] = []
    const getId = (arr: any[]) => {
      arr.forEach((v: any) => {
        if (v.checked || v.selected) {
          res.push({ permissionId: v.id })
        }
        if (v.children && v.children.length > 0) {
          getId(v.children)
        }
      })
    }
    getId(data)
    return res
  }
  // 递归函数
  private recursionChildFalse(data: any[]) {
    const getId = (arr: any[]) => {
      if (arr.length <= 0) {
        return
      }
      arr.forEach(v => {
        v.checked = false
        v.selected = false
        if (v.children && v.children.length > 0) {
          getId(v.children)
        }
      })
    }
    getId(data)
  }
  // 递归函数
  private recursionChild(data: any[]) {
    const getId = (arr: any[]) => {
      if (arr.length <= 0) {
        return
      }
      arr.forEach((v: any) => {
        v.checked = true
        v.selected = false
        if (v.children && v.children.length > 0) {
          getId(v.children)
        }
      })
    }
    getId(data)
  }
  // 第一级
  private setCheckedOne(item: any) {
    if (item.selected) {
      item.selected = false
      item.checked = true
    }
    if (item.checked) {
      this.recursionChild(item.children || [])
    } else {
      this.recursionChildFalse(item.children || [])
    }
  }
  // 第二级
  private setCheckedTwo(item: any, itemOne: any) {
    if (item.selected) {
      item.selected = false
      item.checked = true
    }
    if (item.checked) {
      this.recursionChild(item.children || [])
    } else {
      this.recursionChildFalse(item.children || [])
    }
    const resC = itemOne.children.filter((a: any) => {
      return a.checked === true
    })
    const resS = itemOne.children.filter((a: any) => {
      return a.selected === true
    })
    if (resC.length <= 0 && resS.length <= 0) {
      itemOne.checked = false
      itemOne.selected = false
    }
    if (
      (resC.length > 0 && resC.length < itemOne.children.length) ||
      resS.length > 0
    ) {
      itemOne.checked = false
      itemOne.selected = true
    }
    if (resC.length >= itemOne.children.length) {
      itemOne.checked = true
      itemOne.selected = false
    }
  }
  // 第三级
  private setCheckedThree(item: any, itemTwo: any, itemOne: any) {
    if (item.checked) {
      this.recursionChild(item.children || [])
    } else {
      this.recursionChildFalse(item.children || [])
    }
    const resTwo = itemTwo.children.filter((a: any) => {
      return a.checked === true
    })
    if (resTwo.length <= 0) {
      itemTwo.checked = false
      itemTwo.selected = false
    }
    if (resTwo.length > 0 && resTwo.length < itemTwo.children.length) {
      itemTwo.checked = false
      itemTwo.selected = true
    }
    if (resTwo.length >= itemTwo.children.length) {
      itemTwo.checked = true
      itemTwo.selected = false
    }
    const resOneC = itemOne.children.filter((a: any) => {
      return a.checked === true
    })
    const resOneS = itemOne.children.filter((a: any) => {
      return a.selected === true
    })
    if (resOneC.length <= 0 && resOneS.length <= 0) {
      itemOne.checked = false
      itemOne.selected = false
    }
    if (
      (resOneC.length > 0 && resOneC.length < itemTwo.children.length) ||
      resOneS.length > 0
    ) {
      itemOne.checked = false
      itemOne.selected = true
    }
    if (resOneC.length >= itemOne.children.length) {
      itemOne.checked = true
      itemOne.selected = false
    }
  }
}
</script>

<style lang="scss" scoped>
.roles-container {
  display: flex;
  flex-flow: row nowrap;
  min-height: inherit;
}
.roles-set {
  .roles-name {
    line-height: 50px;
    background-color: #f0f2f5;
    border-bottom: 1px solid #ccc;
    font-size: 14px;
  }
  .roles-list {
    overflow-y: auto;
    background-color: #f0f2f5;
    width: 210px;
    float: left;
    height: calc(100vh - 300px);
    .el-input__inner {
      padding: 0px 8px;
    }
  }
  .roles-level {
    overflow-y: auto;
    margin-left: 210px;
    height: calc(100vh - 300px);
  }
  .el-menu {
    box-sizing: border-box;
    .role-menu-add {
      :hover {
        color: #409eff;
      }
    }
    .el-menu-item {
      border-left: 1px solid rgb(240, 242, 245);
      &:hover {
        background-color: #f0f2f5 !important;
        color: #409eff;
      }
    }
    .el-menu-item.is-active {
      color: #409eff;
      background-color: #fff !important;
    }
    .role-menu-item {
      padding-right: 25px;
      position: relative;
      .role-menu-icon {
        position: absolute;
        right: 5px;
        top: 50%;
        margin-top: -6px;
        height: 16px;
        width: 16px;
        border: 1px solid #999;
        .el-icon-caret-bottom {
          position: absolute;
          top: 0;
          right: -1px;
          width: 16px;
          height: 16px;
          margin-right: 0;
          font-size: 14px;
          color: #999;
        }
        &:hover {
          border-color: #409eff;
          .el-icon-caret-bottom {
            color: #409eff;
          }
        }
        .role-popover-box {
          position: absolute;
          top: 16px;
          right: 0;
          z-index: 2000;
          display: inline-block;
          width: 80px;
          background-color: #fff;
          color: #000;
          text-align: center;
          box-shadow: 0px 0px 2px 0px #aaa;
          .role-popover-div {
            line-height: 30px;
            height: 30px;
            cursor: pointer;
            &:hover {
              background-color: #409eff;
              color: #fff;
            }
          }
        }
      }
    }
  }
  .role-item-line {
    .el-form-item {
      margin-bottom: 0px;
      &:last-child {
        border-bottom: 1px solid #eee;
      }
    }
  }
  .is-item-line {
    border-top: 1px solid #eee;
  }
}
</style>
