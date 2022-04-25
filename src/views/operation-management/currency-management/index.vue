<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="货币管理"
        />
        <div class="app-panel">
          <el-button
            v-permission="['addCurrency']"
            type="text"
            icon="el-icon-circle-plus-outline"
            style="margin-left: 10px"
            @click="addCur"
          >
            新增货币
          </el-button>

          <el-table
            v-loading="loading"
            :data="list"
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              label="中文名称"
              prop="name"
            />

            <el-table-column
              label="英文名称"
              prop="alias"
            />

            <el-table-column
              label="货币编码"
              prop="id"
            />

            <el-table-column
              label="货币符号"
              prop="sign"
            />

            <el-table-column
              label="通用国家"
              min-width="200"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{ countryNameFilter(scope.row) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
              width="120"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['editCurrency']"
                  type="text"
                  size="medium"
                  @click="handleEditRow(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['deleteCurrency']"
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
            width="600px"
            :visible.sync="formShow"
            :close-on-click-modal="false"
            @closed="handleCancel"
          >
            <el-form
              ref="ruleForm"
              v-loading="formLoading"
              :model="ruleForm"
              :rules="rules"
              label-width="100px"
              size="small"
              style="padding-right: 20px;"
            >
              <el-form-item
                label="中文名称"
                prop="name"
              >
                <el-input
                  ref="firstInput"
                  v-model="ruleForm.name"
                  placeholder="请输入"
                  show-word-limit
                  :maxlength="20"
                />
              </el-form-item>
              <el-form-item
                label="英文名称"
                prop="alias"
              >
                <el-input
                  v-model="ruleForm.alias"
                  placeholder="请输入"
                  :maxlength="20"
                />
              </el-form-item>
              <el-form-item
                label="货币编码"
                prop="id"
              >
                <el-input
                  v-model="ruleForm.id"
                  :disabled="isEdit"
                  placeholder="请输入"
                  :maxlength="3"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item
                label="货币符号"
                prop="sign"
              >
                <el-input
                  v-model="ruleForm.sign"
                  placeholder="请输入"
                  :maxlength="3"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item
                label="通用国家"
                prop="countryIds"
              >
                <el-input
                  v-model="cty"
                  :placeholder="`已选择(${ruleForm.countryIds.length})`"
                  size="small"
                  style="width:100%"
                  disabled
                >
                  <el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="handleCountry"
                  />
                </el-input>
              </el-form-item>
            </el-form>
            <div
              slot="footer"
              class="dialog-footer"
            >
              <el-button @click="handleCancel">
                取 消
              </el-button>
              <el-button
                type="primary"
                :loading="formLoading"
                @click="handleSubmit"
              >
                确 定
              </el-button>
            </div>
          </el-dialog>
          <el-dialog
            :title="rateTitle"
            width="600px"
            :visible.sync="rateDialogShow"
          >
            <currency-record
              v-if="rateDialogShow"
              :id="rateId"
            />
          </el-dialog>
          <!-- 关联国家 -->
          <el-dialog
            title="关联货币通用国家"
            :visible.sync="isRelateVisible"
            :close-on-click-modal="false"
            width="960px"
            @close="cancelRelate"
          >
            <div v-loading="countryLoading">
              <el-transfer
                ref="transferItem"
                v-model="ruleForm.countryIds"
                filterable
                :filter-method="filterMethod"
                :titles="['关联货币通用国家/地区', '已选择']"
                :props="{key: 'id', label: 'label'}"
                filter-placeholder="输入搜索"
                :data="countryList"
                style="height: 500px;"
              />
            </div>
            <div
              slot="footer"
              class="dialog-footer"
            >
              <el-button @click="cancelRelate">
                取 消
              </el-button>
              <el-button
                type="primary"
                @click="saveRelate"
              >
                确 定
              </el-button>
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
  getCurrencyList,
  addCurrency,
  saveCurrency,
  deleteCurrency,
  getExRateList,
  saveExRate,
  deleteExRate,
  getCountryList
} from '@/api/operation-of-currency-record'
@Component({
  name: 'Currency',
  components: {},
  props: {}
})
export default class extends Vue {
  // private validateId = (
  //   rule: any,
  //   value: string,
  //   callback: (msg?: any) => void
  // ) => {
  //   if (!value) {
  //     callback(new Error('货币编码不能为空'))
  //   } else if (value.length !== 3) {
  //     callback(new Error('货币编码长度为3'))
  //   } else {
  //     callback()
  //   }
  // }
  /* data */
  private loading: boolean = false
  private formShow: boolean = false
  private formLoading: boolean = false
  private rateDialogShow: boolean = false
  private countryLoading: boolean = false
  private isRelateVisible: boolean = false
  private list: any = []
  private countryList: any[] = []
  private form = {}
  private cty = ''
  private ruleForm: any = {
    name: '',
    alias: '',
    id: '',
    sign: '',
    countries: [],
    countryIds: []
  }
  private rules = {
    name: [
      { required: true, message: '中文名称不能为空', trigger: 'blur' }
    ],
    alias: [
      { required: true, message: '英文名称不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (!value) {
            callback(new Error('英文名称不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('英文名称不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    id: [
      { required: true, message: '货币编码不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^[a-zA-Z]*$/
          if (!value) {
            callback(new Error('货币编码不能为空'))
          } else if (value.length !== 3) {
            callback(new Error('货币编码长度为3'))
          } else if (!reg.test(value)) {
            callback(new Error('货币编码只能包含字母'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    sign: [
      { required: true, message: '货币符号不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (!value) {
            callback(new Error('货币符号不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('货币符号不能是中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    countryIds: [{ required: true, message: '通用国家不能为空', trigger: 'blur' }]
  }
  private isEdit: boolean = false
  private title: string = ''
  private rateTitle: string = ''
  private rateId: string = ''
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
    this.handleCurrencyList()
  }
  /* methods */
  // 获取国家列表
  private getCountryList() {
    this.countryLoading = true
    getCountryList()
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result || []
        this.countryList = result.map((it: any) => {
          const { name, id, alias } = it
          return {
            id,
            name,
            alias,
            label: name + '-' + alias
          }
        })
        this.countryLoading = false
      })
      .catch((err: any) => {
        this.countryLoading = false
        return err
      })
  }
  private handleCountry() {
    this.isRelateVisible = true
    this.getCountryList()
  }
  private filterMethod(query: any, item: any): boolean {
    const name = item.name || ''
    return name.indexOf(query) > -1
  }
  private cancelRelate() {
    this.isRelateVisible = false
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
  }
  private saveRelate() {
    this.cancelRelate()
    const arr = this.ruleForm.countryIds.map((c: any) => {
      const name = (this.countryList.find((it: any) => it.id === c) || {}).label || ''
      return {
        id: c,
        name
      }
    })
    arr.filter((it: any) => it.id && it.name)
    this.ruleForm.countries = arr
  }
  private countryNameFilter(row: any) {
    const arr = row.countries || []
    return arr.map((it: any) => it.name).join(', ')
  }
  // 货币列表
  private handleCurrencyList(): void {
    this.loading = true
    getCurrencyList({
      page: this.page,
      size: this.size
    })
      .then((res: any) => {
        this.loading = false
        if (res.success) {
          const data = res.data || {}
          this.list = data.result || []
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
    this.handleCurrencyList()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.handleCurrencyList()
  }

  private addCur() {
    this.formShow = true
    this.title = '新增货币'
    this.isEdit = false
    this.$nextTick(() => {
      const ele:any = this.$refs.firstInput
      ele.focus()
    })
  }
  // 编辑弹框
  private handleEditRow(row: any) {
    this.formShow = true
    this.title = '编辑货币'
    this.ruleForm = { ...row }
    this.ruleForm.countryIds = (row.countries || []).map((it: any) => it.id)
    this.isEdit = true
  }
  // 删除
  private async handleDeleteRow(id: string) {
    const message = '删除货币将导致无法继续使用，确定要删除吗？'
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
    deleteCurrency(id)
      .then((res: any) => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.handleCurrencyList()
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
      switch (this.isEdit) {
        case true:
          saveCurrency(this.ruleForm)
            .then((res: any) => {
              this.formLoading = false
              if (res.success) {
                this.formShow = false
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                })
                this.handleCurrencyList()
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
          break
        case false:
          addCurrency(this.ruleForm)
            .then((res: any) => {
              this.formLoading = false
              if (res.success) {
                this.formShow = false
                this.$message({
                  type: 'success',
                  message: '新增成功!'
                })
                this.handleCurrencyList()
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
          break
        default:
          break
      }
    })
  }

  // 取消新增/编辑
  private handleCancel() {
    this.formShow = false
    this.ruleForm = {
      name: '',
      alias: '',
      id: '',
      sign: '',
      countries: [],
      countryIds: []
    }
    const ele: any = this.$refs.ruleForm
    ele.clearValidate()
  }

  // 汇率记录
  private handleRecord(row: any): void {
    this.rateDialogShow = true
    const { exRate, name } = row
    this.rateId = exRate
    this.rateTitle = '汇率记录-' + name
  }
}
</script>

<style lang="scss" scoped>
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
