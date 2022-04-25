<template>
  <div class="add-type">
    <el-button
      type="text"
      icon="el-icon-circle-plus-outline"
      @click="addService"
    >
      新增服务项目
    </el-button>

    <el-table
      ref="table"
      v-loading="loading"
      :data="tableData"
      height="450px"
      style="width: 100%;margin: 10px 0;"
      border
    >
      <el-table-column
        prop="itemName"
        label="服务项目"
      />
      <el-table-column
        prop="attachment"
        width="140"
        label="是否上传附件"
      >
        <template slot-scope="scope">
          {{ scope.row.attachment ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="required"
        label="附件是否必传"
        width="140"
      >
        <template slot-scope="scope">
          {{ scope.row.required ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="required"
        label="服务标识"
        width="140"
      >
        <template slot-scope="scope">
          {{ scope.row.type === '0' ? '标准服务' : '增值服务' }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        width="120"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="editService(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            @click="deleteService(scope.row)"
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
      :title="subEdit ? '编辑服务项目' : '新增服务项目'"
      :visible.sync="isAddEditType"
      :close-on-click-modal="false"
      append-to-body
      width="600px"
      @close="cancel"
    >
      <div class="subType-form">
        <el-form
          ref="editForm"
          v-loading="formLoading"
          :model="selectForm"
          :rules="formRules"
          label-width="130px"
          label-position="right"
          size="small"
          style="padding-right: 20px;"
        >
          <el-form-item
            label="服务项目"
            prop="itemId"
          >
            <el-select
              v-model="selectForm.itemId"
              style="width:100%;"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in serviceData"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="是否上传附件"
            prop="attachment"
          >
            <el-radio-group v-model="selectForm.attachment">
              <el-radio :label="false">
                否
              </el-radio>
              <el-radio :label="true">
                是
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="selectForm.attachment"
            label="附件是否必传"
            prop="required"
          >
            <el-radio-group v-model="selectForm.required">
              <el-radio :label="false">
                否
              </el-radio>
              <el-radio :label="true">
                是
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="服务标识"
            prop="type"
          >
            <el-radio-group v-model="selectForm.type">
              <el-radio label="0">
                标准服务
              </el-radio>
              <el-radio label="1">
                增值服务
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="cancel()">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="saveConfirm()"
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
import { AppModule } from '@/store/modules/app'
import {
  getServiceList,
  deleteOrderType,
  saveOrderType,
  getAddedList
} from '@/api/operation-of-orderType'

@Component({
  name: 'addedServiceRelevance',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private isAddEditType: boolean = false
  private dialogLoading: boolean = false
  private subEdit: boolean = false
  private tableData: any = []
  private serviceData: any = []
  private selectForm: any = {
    itemId: undefined,
    attachment: undefined,
    required: undefined,
    type: undefined
  }
  private form: any = {}
  private formLoading = false
  private page: number = 1
  private size: number = 10
  private total: any = 0

  private formRules = {
    itemId: [{ required: true, message: '请选择服务项目', trigger: 'change' }],
    attachment: [{ required: true, message: '请选择是否上传附件', trigger: 'change' }],
    required: [{ required: true, message: '请选择附件是否必传', trigger: 'change' }],
    type: [{ required: true, message: '请选择服务标识', trigger: 'change' }]
  }

  /* computed */

  /* methods */
  // 新增
  private addService(): void {
    this.subEdit = false
    this.isAddEditType = true
  }
  // 编辑
  private editService(row: any): void {
    this.selectForm = row
    this.subEdit = true
    this.isAddEditType = true
  }

  // 重置表单
  private resetForm() {
    this.selectForm = {
      itemId: undefined,
      attachment: undefined,
      required: undefined,
      type: undefined
    }
  }
  // 关闭dialog重置表单
  private close(): void {
    this.isAddEditType = false
    this.resetForm()
  }

  private cancel() {
    this.isAddEditType = false
    this.resetForm()
    this.clearValidate()
  }
  private clearValidate() {
    const editForm: any = this.$refs.editForm
    this.$nextTick(() => {
      editForm.clearValidate()
    })
  }
  // 提交保存
  private saveConfirm() {
    const editForm: any = this.$refs.editForm
    editForm.validate((valid: any) => {
      if (!valid) {
        return false
      }
      this.formLoading = true
      const params: any = {
        orderTypeId: this.form.orderTypeId,
        ...this.selectForm
      }
      this.serviceData.map((it: any) => {
        if (it.id === params.itemId) {
          params.itemName = it.name
        }
      })
      if (!params.attachment) {
        params.required = false
      }
      saveOrderType(params)
        .then((res: any) => {
          this.formLoading = false
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.isAddEditType = false
          this.resetForm()
          this.clearValidate()
          this.queryAll()
        })
        .catch((err: any) => {
          this.formLoading = false
          return err
        })
    })
  }

  private deleteService(row: any) {
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
        deleteOrderType(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.queryAll()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }

  private getAddedList() {
    const params: any = {
      serviceTypeId: this.form.serviceTypeId,
      costTypes: this.form.orderTypeId
    }
    getAddedList(params)
      .then((res: any) => {
        this.serviceData = res.data || []
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

  private queryAll(): void {
    this.loading = true
    const params: any = {
      orderTypeId: this.form.orderTypeId,
      type: this.form.type,
      page: this.page,
      size: this.size
    }
    getServiceList(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        this.tableData = data.result || []
        this.$nextTick(() => {
          const root: any = this.$refs.table
          root.doLayout() // 解决表格错位
        })
        this.total = data.total
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.queryAll()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.queryAll()
  }

  private init(obj: any): void {
    this.form = obj
    this.queryAll()
    this.getAddedList()
  }
}
</script>

<style lang="scss" scoped>
</style>
