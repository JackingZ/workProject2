<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="禁忌词语"
        />
        <div class="app-panel">
          <el-button
            v-permission="['addTaboo']"
            type="text"
            icon="el-icon-circle-plus-outline"
            style="margin-left: 10px"
            @click="formShow = true, title = '新增禁忌词语', isEdit = false"
          >
            新增禁忌词语
          </el-button>

          <el-table
            v-loading="loading"
            :data="list"
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              label="禁忌词语"
              min-width="250"
              prop="words"
            />

            <el-table-column
              label="禁忌国家"
              min-width="150"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="!$checkPermission(['tabooCountry'])"
                  type="text"
                  @click="handleCountry(scope.row)"
                >
                  关联国家
                </el-button>
              </template>
            </el-table-column>

            <el-table-column
              label="禁忌程度"
              min-width="150"
              prop="degree"
              :formatter="formatterDegree"
            />

            <el-table-column
              label="操作"
              min-width="150"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['editTaboo']"
                  type="text"
                  size="medium"
                  @click="handleEditRow(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['deleteTaboo']"
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
            class="currency-dialog"
            :visible.sync="formShow"
            :close-on-click-modal="false"
            @close="handleCencle"
          >
            <el-form
              ref="ruleForm"
              v-loading="formLoading"
              :model="ruleForm"
              :rules="rules"
              label-width="80px"
              class="country-ruleForm"
            >
              <el-form-item
                label="禁忌词语"
                prop="words"
              >
                <el-input
                  v-model="ruleForm.words"
                  placeholder="请输入禁忌词语，用英语括号表示英文名称，多个词语请用英文逗号,间隔"
                  type="textarea"
                />
              </el-form-item>
              <el-form-item
                label="禁忌程度"
                prop="degree"
              >
                <el-radio-group v-model="ruleForm.degree">
                  <el-radio :label="'0'">
                    禁止运输
                  </el-radio>
                  <el-radio :label="'1'">
                    需提供证书
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
            <div
              slot="footer"
              class="dialog-footer"
            >
              <el-button @click="handleCencle">
                取 消
              </el-button>
              <el-button
                type="primary"
                @click="handleSubmit"
              >
                确 定
              </el-button>
            </div>
          </el-dialog>

          <el-dialog
            title="关联国家"
            width="960px"
            :visible.sync="countryShow"
            :close-on-click-modal="false"
            @close="cancelCountryDialog"
          >
            <el-transfer
              ref="transferItem"
              v-model="countryIds"
              v-loading="countryLoading"
              filterable
              filter-placeholder="输入名称查找"
              :data="countryData"
              :titles="['选择国家/地区', '已关联国家/地区']"
              :props="{key: 'id', label: 'label'}"
              style="height: 500px;"
            />
            <div
              slot="footer"
              class="dialog-footer"
            >
              <el-button @click="cancelCountryDialog">
                取 消
              </el-button>
              <el-button
                type="primary"
                @click="handleTreeSubmit"
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
  getTabooList,
  saveTaboo,
  deleteTaboo,
  getTabooCountryList,
  getCountryList,
  saveTabooCountry
} from '@/api/operation-of-taboo-words'
@Component({
  name: 'Port',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private formShow: boolean = false
  private formLoading: boolean = false
  private countryShow: boolean = false
  private countryLoading: boolean = false
  private list: any = []

  private form = {}
  private ruleForm = {
    id: '',
    words: '',
    degree: '0'
  }
  private rules = {
    words: [{ required: true, message: '禁忌词语不能为空', trigger: 'blur' }],
    degree: [{ required: true, message: '', trigger: 'change' }]
  }
  private title: string = ''
  private isEdit: boolean = false
  private countryData: any[] = []
  private countryIds: any[] = []
  private rowId: string = ''
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
    this.handleTabooList()
  }

  /* methods */
  // 关闭关联国家弹窗
  private cancelCountryDialog(): void {
    this.countryShow = false
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
    this.rowId = ''
    this.countryData = []
    this.countryIds = []
  }

  // 表格填值
  private formatterDegree(row: any) {
    const { degree } = row
    if (degree === '0') {
      return '禁止运输'
    } else {
      return '需提供证书'
    }
  }
  // 查询列表
  private handleTabooList() {
    this.loading = true
    const data = {
      page: this.page,
      size: this.size
    }
    getTabooList(data)
      .then((res: any) => {
        this.loading = false
        if (res.success) {
          this.list = res.data.result
          this.total = res.data.total
        }
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  // 编辑弹框
  private handleEditRow(row: any) {
    this.formShow = true
    this.title = '编辑禁忌词语'
    const obj = row
    this.ruleForm = obj
    this.isEdit = true
  }
  // 删除
  private async handleDeleteRow(id: string) {
    const message = '删除禁忌词语将导致无法继续使用，确定要删除吗？'
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
    deleteTaboo(id)
      .then((res: any) => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.handleTabooList()
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

  // 关联国家
  private handleCountry(row: any): void {
    this.countryShow = true
    this.countryLoading = true
    const { id } = row
    this.rowId = id
    Promise.all([
      getCountryList().then(res => res.data),
      getTabooCountryList(id).then(res => res.data)
    ])
      .then((res: any) => {
        const result = res[0].result || []
        this.countryData = result.map((it: any) => {
          const { name, id: cid, alias } = it
          return {
            id: cid,
            name,
            alias,
            label: name + '-' + alias
          }
        })
        const arr = res[1]
        arr.forEach((item: any) => {
          this.countryIds.push(item.countryId)
        })
        this.countryLoading = false
      })
      .catch((err: any) => {
        this.countryLoading = false
        return err
      })
  }
  // 提交关联国家
  private handleTreeSubmit() {
    this.countryLoading = true
    const arr: any = []
    this.countryData.forEach(item => {
      this.countryIds.forEach(itemD => {
        if (item.id === itemD) {
          arr.push({
            countryId: item.id,
            countryName: item.label
          })
        }
      })
    })
    saveTabooCountry({
      id: this.rowId,
      countries: arr
    })
      .then((res: any) => {
        this.countryLoading = false
        if (res.success) {
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
          this.cancelCountryDialog()
          this.handleTabooList()
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
      .catch((err: any) => {
        this.countryLoading = false
        return err
      })
  }

  // 保存新增/编辑
  private handleSubmit() {
    this.formLoading = true
    saveTaboo(this.ruleForm)
      .then((res: any) => {
        this.formLoading = false
        if (res.success) {
          this.formShow = false
          switch (this.isEdit) {
            case true:
              this.$message({
                type: 'success',
                message: '编辑成功!'
              })
              break
            case false:
              this.$message({
                type: 'success',
                message: '新增成功!'
              })
              break
            default:
              break
          }
          this.handleTabooList()
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
  }

  // 取消新增/编辑
  private handleCencle() {
    this.formShow = false
    this.ruleForm = {
      id: '',
      words: '',
      degree: '0'
    }
    const ele: any = this.$refs.ruleForm
    ele.clearValidate()
  }

  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.handleTabooList()
    // this.$message.success(val)
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.handleTabooList()
    // this.$message.success(val)
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
