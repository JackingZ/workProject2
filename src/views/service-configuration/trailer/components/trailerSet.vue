<template>
  <div>
    <div>
      <el-button
        type="text"
        icon="el-icon-circle-plus-outline"
        style="margin-left: 10px;"
        @click="handleAdd"
      >
        新增
      </el-button>
    </div>
    <el-table
      ref="table"
      v-loading="loading"
      :data="tableData"
      height="400px"
      style="width: 100%;margin: 10px 0;"
      border
    >
      <el-table-column
        label="服务组合名称"
        prop="name"
      />
      <el-table-column
        label="关联服务名称"
        :formatter="formatName"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          &nbsp;
          <el-button
            type="text"
            size="small"
            @click="handleDelete(scope.row)"
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

    <el-dialog
      title="关联服务名称"
      :visible.sync="isCodeShow"
      :close-on-click-modal="false"
      append-to-body
      width="960px"
      @close="itemNameDialogClose"
    >
      <div v-loading="isCodeLoading">
        <el-transfer
          ref="transferItem"
          v-model="selectForm.svcs"
          filterable
          :filter-method="filterMethod"
          :titles="['选择关联服务名称', '已关联服务名称']"
          :props="{key: 'id', label: 'name'}"
          filter-placeholder="输入搜索"
          :data="subTypeList"
          style="height: 500px;"
        />
        <div
          slot="footer"
          style="text-align: right;margin: 20px 40px 0;"
        >
          <el-button
            size="small"
            @click="itemNameDialogClose"
          >
            取 消
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="itemNameDialogClose"
          >
            确 定
          </el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :title="isEdit ? '编辑服务组合' : '新增服务组合'"
      :visible.sync="isEditDialog"
      :close-on-click-modal="false"
      append-to-body
      width="600px"
      @closed="cancel"
    >
      <el-form
        ref="selectForm"
        v-loading="formLoading"
        :model="selectForm"
        :rules="formRules"
        label-width="120px"
        label-position="right"
        size="small"
        style="padding-right: 20px;"
      >
        <el-form-item
          label="服务组合名称"
          prop="name"
        >
          <el-input
            v-model="selectForm.name"
            :maxlength="20"
            placeholder="请输入"
            style="width:100%"
          />
        </el-form-item>
        <el-form-item
          label="选择服务名称"
          prop="svcs"
        >
          <el-input
            v-model="sc"
            :placeholder="`已选择(${selectForm.svcs.length})`"
            size="small"
            style="width:100%"
            disabled
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="isCodeShow = true"
            />
          </el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
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
    </el-dialog>
  </div>
</template>

<script  lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  getSvcGroupList,
  deleteSvcGroup,
  saveSvcGroup
} from '@/api/service-with-truck-service'

@Component({
  name: '',
  components: {},
  props: {
    subTypeData: {
      type: Array,
      default: () => []
    }
  }
})
export default class extends Vue {
  private loading: boolean = false
  private selectLoading: boolean = false
  private isEditDialog: boolean = false
  private formLoading: boolean = false
  private isEdit: boolean = false

  private selectForm: any = {
    name: undefined,
    svcs: []
  }
  private formRules = {
    name: [{ required: true, message: '服务组合名称不能为空', trigger: 'blur' }],
    svcs: [{ required: true, message: '请选择服务名称', trigger: 'change' }]
  }
  private sc = ''
  private tableData: any[] = []
  private isCodeShow: boolean = false
  private isCodeLoading: boolean = false
  private page: number = 1
  private size: number = 10
  private total: number = 0

  // computed
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
  get subTypeList() {
    return (this as any).subTypeData || []
  }

  // methods
  private setData() {
    this.getTableData(1)
  }
  private formatName(row: any) {
    const arr = row.svcs.map((it: any) => it.name)
    return arr.join(' , ')
  }

  private filterMethod(query: any, item: any): boolean {
    return item.name.indexOf(query) > -1
  }
  private itemNameDialogClose() {
    this.isCodeShow = false
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
  }
  // 新增
  private handleAdd() {
    this.isEditDialog = true
    this.isEdit = false
  }

  private handleEdit(row: any) {
    this.isEditDialog = true
    this.isEdit = true
    this.selectForm = row
    this.selectForm.svcs = row.svcs.map((it: any) => it.id)
  }
  private handleDelete(row: any) {
    const params = {
      id: row.id
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.loading = true
        deleteSvcGroup(params)
          .then((res: any) => {
            this.loading = false
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getTableData()
          })
          .catch((err: any) => {
            this.loading = false
            return err
          })
      })
      .catch(() => {
        return false
      })
  }
  // 取消
  private cancel() {
    this.isEditDialog = false
    this.selectForm = {
      name: undefined,
      svcs: []
    }
    const theForm: any = this.$refs.selectForm
    this.$nextTick(() => {
      theForm.clearValidate()
    })
  }
  // 保存
  private save() {
    const editForm: any = this.$refs.selectForm
    editForm.validate((valid: any) => {
      if (valid) {
        this.formLoading = true
        const params: any = {
          typeName: '拖车',
          typeId: '06',
          id: undefined,
          name: this.selectForm.name,
          svcs: []
        }
        const arr = this.selectForm.svcs.map((it: any) => {
          const item = this.subTypeList.find((ag: any) => it === ag.id) || {}
          const { id, name } = item
          return {
            name,
            id
          }
        })
        params.svcs = arr.filter((it: any) => it.name && it.id)
        params.id = this.selectForm.id
        saveSvcGroup(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.formLoading = false
            this.getTableData()
            this.cancel()
          })
          .catch((err: any) => {
            this.formLoading = false
            return err
          })
      } else {
        return false
      }
    })
  }

  // created
  private setTable() {
    this.$nextTick(() => {
      const root: any = this.$refs.table
      root.doLayout() // 解决表格错位
    })
  }
  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.getTableData()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.getTableData()
  }

  private getTableData(val?: any) {
    this.loading = true
    this.tableData = []
    if (val) {
      this.page = val
    }
    getSvcGroupList({
      typeId: '06',
      page: this.page,
      size: this.size
    })
      .then((res: any) => {
        const data = res.data || {}
        this.tableData = data.result || []
        this.total = data.total
        this.setTable()
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
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
::v-deep .el-transfer-panel {
  width: 40%;
  height: 100%;
}
::v-deep .el-transfer {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}
::v-deep .el-transfer-panel__list.is-filterable {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
}
::v-deep .el-transfer-panel__body {
  height: 78%;
}
</style>
