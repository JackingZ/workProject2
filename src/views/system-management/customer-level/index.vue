<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="客户评级"
        />
        <div class="app-panel">
          <el-button
            v-permission="['addCustomerLevel']"
            type="text"
            icon="el-icon-circle-plus-outline"
            style="margin-left: 10px"
            @click="addCur"
          >
            新增
          </el-button>

          <el-table
            v-loading="loading"
            :data="tableData"
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              label="级别代码"
              prop="code"
              width="120"
            />

            <el-table-column
              label="级别描述"
              prop="name"
            />

            <el-table-column
              label="额度金额"
              prop="rating"
              width="130"
            >
              <template slot-scope="scope">
                ￥ {{ scope.row.rating }}
              </template>
            </el-table-column>

            <el-table-column
              label="备注"
              prop="remark"
            />

            <el-table-column
              label="操作"
              width="120"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['editCustomerLevel']"
                  type="text"
                  size="medium"
                  @click="handleEditRow(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['deleteCustomerLevel']"
                  type="text"
                  size="medium"
                  @click="handleDeleteRow(scope.row.id)"
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
            width="800px"
            :visible.sync="formShow"
            :close-on-click-modal="false"
            @closed="handleCancel"
          >
            <div v-loading="formLoading">
              <el-form
                ref="ruleForm"
                :model="ruleForm"
                :rules="rules"
                label-width="90px"
                size="small"
                style="padding-right: 20px;"
              >
                <el-form-item
                  label="级别代码"
                  prop="code"
                >
                  <el-input
                    v-model="ruleForm.code"
                    :disabled="isEdit"
                    :maxlength="5"
                    placeholder="请输入"
                    show-word-limit
                  />
                </el-form-item>
                <el-form-item
                  label="级别描述"
                  prop="name"
                >
                  <el-input
                    v-model="ruleForm.name"
                    placeholder="请输入"
                    :maxlength="30"
                  />
                </el-form-item>
                <el-form-item
                  label="额度金额(￥)"
                  label-width="110px"
                  prop="rating"
                >
                  <el-input-number
                    v-model="ruleForm.rating"
                    class="input-number-valiate"
                    :controls="false"
                    placeholder="请输入"
                    :min="0"
                    :max="99999999"
                    :precision="2"
                  />
                </el-form-item>
                <el-form-item
                  label="备注"
                  prop="remark"
                  style="width: 100%;"
                >
                  <el-input
                    v-model="ruleForm.remark"
                    :autosize="{minRows: 2, maxRows: 3}"
                    type="textarea"
                    :maxlength="30"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-form>
              <div
                slot="footer"
                style="text-align:right;padding: 10px 0;"
              >
                <el-button
                  size="small"
                  @click="handleCancel"
                >
                  取 消
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="handleSubmit"
                >
                  确 定
                </el-button>
              </div>
            </div>
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
  getCustRatingList,
  saveCustRating,
  deleteCustRating
} from '@/api/system-in-customer-level'
@Component({
  name: 'CustomerLevel',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private formShow: boolean = false
  private formLoading: boolean = false
  private ruleForm: any = {
    code: undefined,
    name: undefined,
    rating: undefined,
    remark: undefined
  }
  private rules = {
    code: [
      { required: true, message: '级别代码不能为空', trigger: 'blur' }
    ],
    name: [
      { required: true, message: '级别描述不能为空', trigger: 'blur' }
    ],
    rating: [
      { required: true, message: '额度金额不能为空', trigger: 'blur' }
    ]
  }
  private isEdit: boolean = false
  private tableData: any[] = []
  private title: string = ''
  private page: number = 1
  private size: number = 10
  private total: any = 0

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
  /* created */
  private created() {
    this.getCustRatingList(1)
  }
  /* methods */
  // 货币列表
  private getCustRatingList(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const params: any = {
      model: {},
      page: this.page,
      size: this.size
    }
    getCustRatingList(params)
      .then((res: any) => {
        this.loading = false
        if (res.success) {
          const data = res.data || {}
          this.tableData = data.result || []
          this.total = data.total
        }
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.getCustRatingList()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.getCustRatingList()
  }

  private addCur() {
    this.formShow = true
    this.title = '新增评级'
    this.isEdit = false
  }
  // 编辑弹框
  private handleEditRow(row: any) {
    this.formShow = true
    this.title = '编辑评级'
    this.ruleForm = { ...row }
    this.isEdit = true
  }
  // 删除
  private async handleDeleteRow(id: string) {
    const message = '删除评级将导致无法继续使用，确定要删除吗？'
    const title = '温馨提示'
    const [cancel, confirm] = await this.$confirm(message, title, {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(res => {
        return [null, res]
      })
      .catch(err => {
        return [err, null]
      })
    if (cancel) return
    deleteCustRating({ id })
      .then((res: any) => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getCustRatingList()
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
  }

  // 保存新增/编辑
  private handleSubmit() {
    const form: any = this.$refs.ruleForm
    form.validate((valid: any) => {
      if (!valid) return
      this.formLoading = true
      saveCustRating(this.ruleForm)
        .then((res: any) => {
          this.formLoading = false
          if (res.success) {
            this.formShow = false
            this.$message({
              type: 'success',
              message: '编辑成功!'
            })
            this.getCustRatingList()
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
        .catch((err: any) => {
          this.formLoading = false
          return err
        })
    })
  }

  // 取消新增/编辑
  private handleCancel() {
    this.formShow = false
    this.ruleForm = {
      code: undefined,
      name: undefined,
      rating: undefined,
      remark: undefined
    }
    const ele: any = this.$refs.ruleForm
    ele.clearValidate()
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  display: inline-block;
  width: 33.33%;
}
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
</style>
