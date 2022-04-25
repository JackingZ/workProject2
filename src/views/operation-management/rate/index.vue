<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="汇率记录"
        />
        <div class="app-panel">
          <el-button
            v-permission="['exchangerateAdd']"
            type="text"
            icon="el-icon-circle-plus-outline"
            style="margin-left: 10px"
            @click="addOpening"
          >
            新增记录
          </el-button>

          <el-table
            v-loading="loading"
            :data="list"
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              label="本币"
              prop="lcName"
            />

            <el-table-column
              label="本币编码"
              prop="lcId"
            />

            <el-table-column
              label="目标币"
              prop="fcName"
            />

            <el-table-column
              label="目标币编码"
              prop="fcId"
            />

            <el-table-column
              label="汇率记录"
              width="120"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="!$checkPermission(['exchangerateStatistics'])"
                  type="text"
                  @click="showDialogA(scope.row)"
                >
                  汇率记录
                </el-button>
              </template>
            </el-table-column>

            <el-table-column
              label="最新汇率"
              width="120"
              prop="rate"
            />

            <el-table-column
              label="最后更新"
              width="200"
              prop="updateTime"
            />

            <el-table-column
              label="操作"
              fixed="right"
              width="180"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['exchangerateUpdate']"
                  type="text"
                  size="medium"
                  @click="editTableItem(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['exchangerateDel']"
                  type="text"
                  size="medium"
                  @click="deleteTableItem(scope.row)"
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
            :title="isEdit ? '编辑记录' : '新增记录'"
            width="600px"
            :visible.sync="dialogShow"
            :close-on-click-modal="false"
            @closed="close"
          >
            <el-form
              ref="theForm"
              v-loading="dialogLoading"
              :rules="formRules"
              :model="form"
              label-width="100px"
              style="padding-right: 20px;"
              size="small"
            >
              <el-form-item
                prop="lcId"
                label="本币"
              >
                <el-select
                  v-model="form.lcId"
                  placeholder="请选择"
                  style="width: 100%"
                  filterable
                  clearable
                  @focus="getCurrencyList"
                  @change="onSelect('LC')"
                >
                  <el-option
                    v-for="item in currencyList"
                    :key="item.id"
                    :label="`${item.name}-${item.sign}`"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>

              <el-form-item
                prop="fcId"
                label="目标币种"
              >
                <el-select
                  v-model="form.fcId"
                  placeholder="请选择"
                  style="width: 100%"
                  @focus="getCurrencyList"
                  @change="onSelect('FC')"
                >
                  <el-option
                    v-for="item in currencyList"
                    :key="item.id"
                    :label="`${item.name}-${item.sign}`"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-form>
            <div
              slot="footer"
              class="dialog-footer"
            >
              <el-button @click="close">
                取 消
              </el-button>
              <el-button
                type="primary"
                @click="addTableItem"
              >
                确 定
              </el-button>
            </div>
          </el-dialog>

          <records
            ref="theRecords"
            @closing="getTableList"
          />
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
  getExchangeList as getTableList,
  saveExchange as addTableItem,
  deleteExchange as deleteTableItem
} from '@/api/operation-of-rate'
import Records from '@/views/operation-management/rate/components/records.vue'

@Component({
  name: 'Rate',
  components: {
    Records
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private dialogLoading: boolean = false
  private dialogShow: boolean = false
  private isEdit: boolean = false

  private list: any[] = []
  private currencyList: any[] = []

  private form: any = {
    lcId: '',
    fcId: '',
    id: ''
  }
  private formRules = {
    lcId: [{ required: true, message: '请选择本币', trigger: 'change' }],
    fcId: [{ required: true, message: '请选择目标币种', trigger: 'change' }]
  }

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

  /* methods */

  private formatData(arr:any) {
    arr.forEach((item:any) => {
      if (Array.isArray(item.children) && item.children.length === 0) {
        delete item.children
      } else {
        this.formatData(item.children)
      }
    })
    return arr
  }

  private clearValidate() {
    const theForm: any = this.$refs.theForm
    this.$nextTick(() => {
      theForm.clearValidate()
    })
  }

  private onSelect(action: string) {
    switch (action) {
      case 'LC': {
        break
      }
      case 'FC': {
        break
      }

      default:
        break
    }
  }

  // 新增
  private addOpening(): void {
    this.dialogShow = true
    this.isEdit = false
  }

  // 编辑
  private editTableItem(row: any): void {
    this.dialogShow = true
    this.isEdit = true
    const { lcId, fcId, id } = row
    this.form = {
      lcId,
      fcId,
      id
    }
  }

  private deleteTableItem(row: any) {
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
        deleteTableItem(params)
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

  // 关闭dialog重置表单
  private close(): void {
    this.dialogShow = false
    this.reset()
  }

  // 保存表单
  private addTableItem(): void {
    (this.$refs.theForm as any).validate((valid: any) => {
      if (valid) {
        this.dialogLoading = true
        const { form } = this
        const params = JSON.parse(JSON.stringify(form))

        addTableItem(params)
          .then(res => {
            this.close()
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.getTableList()
            this.dialogLoading = false
          })
          .catch(err => {
            this.dialogLoading = false
            return err
          })
      } else {
        return false
      }
    })
  }

  private showDialogA(row: any) {
    const theRecords = this.$refs.theRecords as any
    this.$nextTick(() => {
      theRecords.init(row.id, row.lcName, row.fcName)
    })
  }

  private getCurrencyList() {
    getCurrencyList().then((res:any) => {
      this.currencyList = res.data.result
    }).catch((err:any) => {
      return err
    })
  }

  // 查询列表
  private getTableList(): void {
    this.loading = true
    const { page, size } = this
    getTableList({
      page,
      size
    })
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        const { total, result } = data
        this.total = total
        this.list = result
      })
      .catch(err => {
        this.loading = false
        return err
      })
  }

  // 重置表单
  private reset(): void {
    this.form = {
      lcId: '',
      fcId: '',
      id: ''
    }
    this.clearValidate()
  }

  private handleSizeChange(): any {
    return 123
  }

  private handleCurrentChange(): any {
    this.getTableList()
  }

  private created(): void {
    this.getTableList()
    this.getCurrencyList()
  }
}
</script>
