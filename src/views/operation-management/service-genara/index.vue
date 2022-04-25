<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="服务大类"
        />
        <div class="app-panel">
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-button
                v-permission="['categoryAdd']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="float: left;"
                @click="addType"
              >
                新增服务大类
              </el-button>
              <el-select
                v-model="selectValue.type"
                size="small"
                clearable
                style="width:200px;margin-right:5px;"
                placeholder="公司类型"
              >
                <el-option
                  label="供应商"
                  value="3"
                />
                <el-option
                  label="代理商"
                  value="2"
                />
                <el-option
                  label="客户"
                  value="1"
                />
              </el-select>
              <el-input
                v-model="selectValue.name"
                :maxlength="20"
                size="small"
                style="width:300px;margin-right:10px;"
                placeholder="请输入"
              >
                <template slot="prepend">
                  服务大类
                </template>
              </el-input>
              <el-button
                v-permission="['categoryQuery']"
                type="primary"
                size="small"
                @click="queryAll(1)"
              >
                查询
              </el-button>
            </el-col>
          </el-row>

          <el-table
            v-loading="loading"
            :data="tableData"
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              prop="name"
              label="服务大类"
              min-width="120"
            />
            <el-table-column
              prop="supplier"
              label="供应商"
              width="120"
            >
              <template slot-scope="scope">
                {{ typeFilter(scope.row, '3') }}
              </template>
            </el-table-column>
            <el-table-column
              prop="customer"
              label="代理商"
              width="140"
            >
              <template slot-scope="scope">
                {{ typeFilter(scope.row, '2') }}
              </template>
            </el-table-column>
            <el-table-column
              prop="customer"
              label="客户"
              width="140"
            >
              <template slot-scope="scope">
                {{ typeFilter(scope.row, '1') }}
              </template>
            </el-table-column>
            <el-table-column
              prop="sort"
              width="150"
              label="排序值"
            />
            <el-table-column
              label="添加类型"
              width="120"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="!$checkPermission(['categoryStatistics'])"
                  type="text"
                  @click="setSubType(scope.row)"
                >
                  服务类型
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="添加时间"
              width="180"
            />
            <el-table-column
              fixed="right"
              width="100"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['categoryUpdate']"
                  type="text"
                  @click="editType(scope.row)"
                >
                  编辑
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
            :title="isEdit ? '编辑服务大类' : '新增服务大类'"
            :visible.sync="isAddEditVisible"
            :close-on-click-modal="false"
            width="600px"
            @close="cancel"
          >
            <div style="padding: 0 20px;">
              <el-form
                ref="editForm"
                v-loading="formLoading"
                :model="selectForm"
                :rules="formRules"
                label-width="90px"
                label-position="right"
                size="small"
              >
                <el-form-item
                  label="服务大类"
                  prop="name"
                >
                  <el-input
                    ref="firstInput"
                    v-model="selectForm.name"
                    :maxlength="20"
                    placeholder="请输入"
                  />
                </el-form-item>
                <el-form-item
                  label="公司类型"
                  prop="type"
                >
                  <el-select
                    v-model="selectForm.type"
                    style="width:100%;"
                    placeholder="请选择"
                    multiple
                    clearable
                  >
                    <el-option
                      label="供应商"
                      value="3"
                    />
                    <el-option
                      label="代理商"
                      value="2"
                    />
                    <el-option
                      label="客户"
                      value="1"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="排序值"
                  prop="sort"
                >
                  <el-input-number
                    v-model="selectForm.sort"
                    class="input-number-valiate"
                    :controls="false"
                    placeholder="请输入"
                    :min="0"
                    :max="9999"
                    :step="1"
                    step-strictly
                  />
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

          <el-dialog
            :title="'服务类型' + '【' + typeName + '】'"
            :visible.sync="isTypeVisible"
            :close-on-click-modal="false"
            width="600px"
            @close="isTypeVisible = false"
          >
            <subType ref="subType" />
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getServiceTypeConfigList,
  saveType
} from '@/api/operation-of-service-genara'
import subType from '@/views/operation-management/service-genara/subType.vue'

@Component({
  name: 'ServiceGenara',
  components: {
    subType
  },
  props: {}
})
export default class ServiceGenara extends Vue {
  /* data */
  private loading: boolean = false
  private isAddEditVisible: boolean = false
  private isTypeVisible: boolean = false
  private isEdit: boolean = false
  private tableData: any[] = []
  private currentId: string = ''
  private typeName: string = ''
  private selectValue: any = {
    type: [],
    name: undefined
  }
  private selectForm: any = {
    name: undefined,
    type: [],
    sort: undefined
  }
  private formLoading: boolean = false
  private page: number = 1
  private size: number = 10
  private total: any = 0

  private formRules = {
    name: [
      { required: true, message: '服务大类不能为空', trigger: 'blur' }
    ],
    type: [{ required: false, message: '请选择关联公司', trigger: 'change' }],
    sort: [{ required: true, message: '排序值不能为空', trigger: 'blur' }]
  }

  /* computed */

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

  /* methods */
  // 服务类型
  private setSubType(row: any): void {
    this.typeName = row.name
    this.isTypeVisible = true
    this.$nextTick(() => {
      const root: any = this.$refs.subType
      root.init(row)
    })
  }

  // 类型名称
  private typeFilter(row: any, str: string): any {
    let name
    switch (str) {
      case '3':
        name = row.supplier ? '√' : '--'
        break
      case '2':
        name = row.agent ? '√' : '--'
        break
      case '1':
        name = row.customer ? '√' : '--'
        break
      default:
        break
    }
    return name
  }

  // 新增
  private addType(): void {
    this.isEdit = false
    this.isAddEditVisible = true
    this.$nextTick(() => {
      const ele:any = this.$refs.firstInput
      ele.focus()
    })
  }
  // 重置表单
  private resetForm() {
    this.selectForm = {
      name: undefined,
      sort: undefined,
      type: []
    }
  }

  // 编辑
  private editType(row: any): void {
    this.currentId = row.id
    const { name, sort, customer, supplier, agent } = row
    this.selectForm = {
      name,
      sort
    }
    const arr: any[] = []
    if (customer) {
      arr.push('1')
    }
    if (agent) {
      arr.push('2')
    }
    if (supplier) {
      arr.push('3')
    }
    // this.selectForm.type = arr
    this.$set(this.selectForm, 'type', arr)
    this.isEdit = true
    this.isAddEditVisible = true
  }

  // 关闭dialog重置表单
  private close(): void {
    this.isAddEditVisible = false
    this.resetForm()
  }
  private cancel() {
    this.isAddEditVisible = false
    this.resetForm()
    this.clearValidate()
  }
  private clearValidate() {
    this.$nextTick(() => {
      const editForm: any = this.$refs.editForm
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
        name: this.selectForm.name,
        sort: this.selectForm.sort,
        supplier: undefined,
        customer: undefined,
        agent: undefined
      }
      params.supplier = this.selectForm.type.includes('3')
      params.agent = this.selectForm.type.includes('2')
      params.customer = this.selectForm.type.includes('1')
      if (this.isEdit) {
        params.id = this.currentId
      }
      saveType(params)
        .then((res: any) => {
          this.formLoading = false
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.isAddEditVisible = false
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

  private queryAll(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const params: any = {
      name: this.selectValue.name,
      page: this.page,
      size: this.size,
      supplier: undefined,
      customer: undefined,
      agent: undefined
    }
    if (this.selectValue.type.includes('3')) {
      params.supplier = true
    }
    if (this.selectValue.type.includes('2')) {
      params.agent = true
    }
    if (this.selectValue.type.includes('1')) {
      params.customer = true
    }
    getServiceTypeConfigList(params)
      .then((res: any) => {
        this.loading = false
        this.tableData = res.data.result
        this.total = res.data.total
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

  private created(): void {
    this.queryAll()
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
</style>
