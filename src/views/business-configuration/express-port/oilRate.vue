<template>
  <div>
    <el-button
      type="text"
      icon="el-icon-circle-plus-outline"
      style="float: left;"
      @click="handleAdd"
    >
      新增
    </el-button>

    <el-table
      v-loading="loading"
      :data="tableData"
      height="500px"
      style="width: 100%;margin: 10px 0;"
      border
    >
      <el-table-column
        prop=""
        label="生效日期"
        width="180"
      />

      <el-table-column
        prop=""
        label="燃油费率"
        width="150"
      />

      <el-table-column
        fixed="right"
        label="操作"
        width="160px"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
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
      :title="title"
      :visible.sync="isAddEditVisible"
      :close-on-click-modal="false"
      append-to-body
      width="600px"
      @closed="cancel"
    >
      <div v-loading="dialogLoading">
        <el-form
          ref="editForm"
          :model="selectForm"
          :rules="formRules"
          label-width="130px"
          label-position="right"
        >
          <el-form-item
            label="燃油费率(%)"
            prop="rate"
          >
            <el-input
              v-model="selectForm.rate"
              :maxlength="50"
              size="small"
              placeholder="请输入"
              style="width:100%"
            />
          </el-form-item>
        </el-form>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="cancel">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="saveConfirm"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import addEditForm from '@/views/business-configuration/express-port/addEditForm.vue'
import {
  getRateList,
  updateRate,
  deleteRate
} from '@/api/operation-of-express-port'

@Component({
  name: '',
  components: {
    addEditForm
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private selectForm: any = {
    date: undefined,
    rate: undefined
  }
  private formRules: any = {
    date: [{ required: true, message: '请选择生效日期', trigger: 'change' }],
    rate: [{ required: true, message: '燃油费率不能为空', trigger: 'blur' }]
  }
  private title = ''
  private isEdit: boolean = false
  private isAddEditVisible: boolean = false
  private dialogLoading: boolean = false
  private loading: boolean = false
  private tableData: any[] = []

  private total = 0
  private page = 1
  private size = 10

  // computed
  // 所属公司id
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }
  /* methods */
  private setData(row: any) {
    // zzz
  }
  // 查询列表
  private getTableList(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const params: any = {
      current: this.page,
      size: this.size
    }
    getRateList(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        const { total, result } = data
        this.total = total
        this.tableData = result || []
      })
      .catch(err => {
        this.loading = false
        return err
      })
  }

  private handleAdd(): void {
    // 新增
    this.isAddEditVisible = true
    this.isEdit = false
  }
  private handleEdit(row: any): void {
    // 编辑
    this.isAddEditVisible = true
    this.isEdit = true
    this.selectForm = { ...row }
  }
  private cancel() {
    this.isAddEditVisible = false
    this.reset()
  }
  private reset() {
    this.selectForm = {
      date: undefined,
      rate: undefined
    }
    this.$nextTick(() => {
      const copyDom:any = this.$refs.editForm
      copyDom.clearValidate()
    })
  }
  private saveConfirm() {
    const editCopyForm:any = this.$refs.editForm
    editCopyForm.validate((valid:any) => {
      if (valid) {
        const params = {
          ...this.selectForm
        }
        updateRate(params)
          .then((res: any) => {
            this.$message.success('保存成功')
            this.isAddEditVisible = false
            this.reset()
            this.getTableList()
          }).catch((err: any) => {
            return err
          })
      } else {
        return false
      }
    })
  }
  private handleDelete(row: any): void {
    // 删除
    const params = {
      ids: [row.id]
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteRate(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getTableList()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }

  private handleSizeChange(size: any): any {
    this.size = size
    this.getTableList()
  }

  private handleCurrentChange(page: any): any {
    this.page = page
    this.getTableList()
  }
}
</script>

<style lang="scss" scoped>

</style>
