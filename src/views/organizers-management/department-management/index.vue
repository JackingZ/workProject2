<template>
  <div class="app-container">
    <head-info
      title="部门管理"
      info=""
    />
    <div class="app-panel">
      <el-row>
        <el-col :span="6">
          <el-button
            v-permission="['addDept']"
            type="text"
            icon="el-icon-circle-plus-outline"
            @click="handleAdd"
          >
            新增
          </el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="loading"
        :data="deptList"
        height="calc(100vh - 265px)"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column
          prop="name"
          label="部门名称"
          min-width="180"
        />

        <el-table-column
          prop="createTime"
          label="添加时间"
          width="230"
        />

        <!-- <el-table-column
          label="状态"
          width="120"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
              @change="changeStatus(scope.row)"
            />
          </template>
        </el-table-column> -->

        <el-table-column
          label="操作"
          width="180"
        >
          <template slot-scope="scope">
            <el-button
              v-if="deptId !== scope.row.id"
              v-permission="['editDept']"
              type="text"
              size="medium"
              @click="editDept(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="deptId !== scope.row.id"
              v-permission="['deleteDept']"
              type="text"
              size="medium"
              @click="deleteDept(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <app-drawer
      :is-show="isShow"
      :mask-closable="false"
      :cancel-text="'取消'"
      :confirm-text="'确定'"
      drawer-title="部门管理"
      drawer-style="width: 500px;"
      @drawerClose="close"
      @drawerConfirm="confirm"
    >
      <edit-department
        ref="departmentForm"
        :is-edit="isEdit"
        :dept-list="deptList"
        @close="onClose"
      />
    </app-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import EditDepartment from '@/views/organizers-management/department-management/components/edit-department.vue'
import { getDeptList, deleteDept, changeDeptStatus } from '@/api/jht-department'
import { AxiosPromise } from 'axios'

@Component({
  name: 'Department',
  components: {
    EditDepartment
  },
  props: {}
})
export default class extends Vue {
  private isShow = false
  private isEdit = 1
  private deptList: any = []
  private loading: boolean = false

  get labelPosition() {
    const lang = AppModule.language
    if (!lang) {
      return 'left'
    }
    return lang === 'en' ? 'top' : 'left'
  }

  get lang() {
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

  // 添加部门
  private handleAdd(): void {
    this.isShow = true
    this.isEdit = 1
  }

  private close() {
    this.isShow = false
    const { isEdit } = this
    const root: any = this.$refs.departmentForm
    root.reset()
  }
  private onClose() {
    this.getDeptList()
    this.close()
  }

  // 启用禁用部门
  private async changeStatus(row: any): Promise<void> {
    const { id, status } = row
    function recursiveDept(arr: any) {
      for (const item of arr) {
        if (item.id === id) {
          item.status = status === '0' ? '1' : '0'
        }
        if (
          item.children &&
          Array.isArray(item.children) &&
          item.children.length
        ) {
          recursiveDept(item.children)
        }
      }
    }
    recursiveDept(this.deptList)
    const statusName = status === '1' ? '启用' : '禁用'
    const [cancel, confirm] = await this.$confirm(
      `此操作将${statusName}用户，是否继续？`,
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
    function recursiveDeptStatus(arr: any) {
      for (const item of arr) {
        if (item.id === id) {
          item.status = status === '0' ? '0' : '1'
        }
        if (
          item.children &&
          Array.isArray(item.children) &&
          item.children.length
        ) {
          recursiveDeptStatus(item.children)
        }
      }
    }
    recursiveDeptStatus(this.deptList)
    changeDeptStatus({ id, status })
      .then((res: any) => {
        const { msg } = res
        this.$message.success(msg)
      })
      .catch(err => {
        return err
      })
  }

  // 提交储存用户
  private confirm() {
    const root: any = this.$refs.departmentForm
    root.saveDept()
    // this.close()
  }

  // 删除部门
  private async deleteDept(row: any): Promise<void> {
    const { id } = row
    const [cancel, confirm] = await this.$confirm(
      '此操作将删除部门，是否继续？',
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
    deleteDept({ id })
      .then((res: any) => {
        const { msg } = res
        this.$message.success(msg)
        this.getDeptList()
      })
      .catch(err => {
        return err
      })
  }

  // 编辑部门
  private editDept(row: any): void {
    const { id } = row
    this.isShow = true
    this.isEdit = 1
    const root: any = this.$refs.departmentForm
    root.getDept(id)
  }

  // 查询部门列表
  private getDeptList(): void {
    this.loading = true
    getDeptList({
      custId: this.custId,
      deptId: this.deptId
    })
      .then(res => {
        const data = res.data || {}
        this.deptList = data.result || []
        this.loading = false
      })
      .catch(err => {
        this.loading = false
        return err
      })
  }

  private created() {
    // 查询部门列表
    this.getDeptList()
  }
}
</script>

<style lang="scss" scoped>

</style>
