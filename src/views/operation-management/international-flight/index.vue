<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="国际航线"
        />
        <div class="app-panel">
          <el-button
            v-permission="['addRoute']"
            type="text"
            icon="el-icon-circle-plus-outline"
            style="margin-left: 10px"
            @click="addPort"
          >
            新增国际航线
          </el-button>

          <el-table
            v-loading="loading"
            :data="tableData"
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              label="航线类型"
              width="100"
              prop="name"
            >
              <template slot-scope="scope">
                {{ formatTypes(scope.row.type) }}
              </template>
            </el-table-column>

            <el-table-column
              label="国际航线名称"
              width="300"
              prop="name"
              show-overflow-tooltip
            />

            <el-table-column
              :formatter="formatCountry"
              label="关联国家/地区"
              min-width="300"
              show-overflow-tooltip
              prop="countries"
            />
            <el-table-column
              label="添加时间"
              width="170"
              prop="createTime"
            />

            <el-table-column
              label="操作"
              width="130"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['editRoute']"
                  type="text"
                  size="medium"
                  @click="editPort(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['deleteRoute']"
                  type="text"
                  size="medium"
                  @click="deleteData(scope.row)"
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
            :title="isEdit ? '编辑国际航线' : '新增国际航线'"
            :close-on-click-modal="false"
            width="600px"
            :visible.sync="dialogShow"
            @close="close"
          >
            <el-form
              ref="editForm"
              v-loading="dialogLoading"
              style="padding-right: 20px;"
              :model="form"
              :rules="formRules"
              label-width="120px"
              size="small"
            >
              <el-form-item
                label="航线类型"
                prop="type"
              >
                <el-select
                  v-model="form.type"
                  style="width: 100%;"
                  placeholder="请选择"
                >
                  <el-option
                    label="空运"
                    value="0"
                  />
                  <el-option
                    label="海运"
                    value="1"
                  />
                  <el-option
                    label="铁路"
                    value="2"
                  />
                  <el-option
                    label="卡航"
                    value="4"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="国际航线名称"
                prop="name"
              >
                <el-input
                  v-model="form.name"
                  style="width: 100%;"
                  :maxlength="50"
                />
              </el-form-item>
              <el-form-item
                label="关联国家/地区"
                prop="countryIds"
              >
                <el-input
                  v-model="s"
                  :placeholder="`已选择(${form.countryIds.length})`"
                  style="width:100%"
                  disabled
                >
                  <el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="handleStates"
                  />
                </el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="form.remark"
                  style="width: 100%;"
                  :maxlength="100"
                />
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
                @click="saveConfirm"
              >
                确 定
              </el-button>
            </div>
          </el-dialog>

          <el-dialog
            title="关联国家/地区"
            :visible.sync="isItemDialogShow"
            :close-on-click-modal="false"
            width="960px"
            @close="itemDialogClose"
          >
            <el-transfer
              ref="transferItem"
              v-model="form.countryIds"
              filterable
              :filter-method="filterMethod"
              :titles="['关联国家/地区', '已选择']"
              :props="{key: 'id', label: 'label'}"
              filter-placeholder="输入搜索"
              :data="countryList"
              style="height: 500px;"
            />
            <div
              slot="footer"
              style="text-align: right;margin: 0 40px 0;"
            >
              <el-button
                size="small"
                @click="itemDialogClose"
              >
                取 消
              </el-button>

              <el-button
                type="primary"
                size="small"
                @click="itemDialogClose"
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
  getFlightList,
  saveFlight,
  deleteFlight,
  getCountryList
} from '@/api/operation-of-international-flight'

@Component({
  name: 'Port',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private dialogShow: boolean = false
  private isItemDialogShow: boolean = false
  private dialogLoading: boolean = false
  private isEdit: boolean = false
  private tableData: any = []
  private area: any = []
  private areaList: any = []
  private countryList: any[] = [] // 国际列表
  // private countryInfo:any[] = []
  private typeList: any = [
    {
      label: '空运',
      value: '0'
    },
    {
      label: '海运',
      value: '1'
    },
    {
      label: '铁路',
      value: '2'
    },
    {
      label: '卡航',
      value: '4'
    }
  ]
  private form: any = {
    countryIds: [],
    type: undefined,
    name: undefined,
    remark: undefined
  }
  private s = ''
  private page: number = 1
  private size: number = 10
  private total: any = 0
  private formRules = {
    name: [
      {
        required: true,
        message: '国际航线名称不能为空',
        trigger: 'blur'
      }
    ],
    type: { required: true, message: '国际航线类型不能为空', trigger: 'change' },
    countryIds: {
      required: true,
      message: '请选择国家/地区',
      trigger: 'change'
    }
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
  private queryAll(): void {
    this.loading = true
    const params = {
      page: this.page,
      size: this.size
    }
    getFlightList(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        const { total, result } = data
        this.total = total
        this.tableData = result
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  // 新增
  private addPort(): void {
    this.dialogShow = true
    this.isEdit = false
  }

  // 编辑
  private editPort(row: any): void {
    this.dialogShow = true
    const { form } = this
    this.form = { ...form, ...row }
    this.form.countryIds = row.countries.map((item: any) => {
      return item.countryId
    })
  }

  // 关闭dialog重置表单
  private close(): void {
    this.dialogShow = false
    this.clearValidate()
  }
  // 清除校验
  private clearValidate() {
    this.reset()
    this.$nextTick(() => {
      const editForm: any = this.$refs.editForm
      editForm.clearValidate()
    })
  }

  private formatCountry(row: any) {
    const arr = row.countries.map((it: any) => it.countryName)
    return arr.join(', ')
  }
  private handleStates(): void {
    this.isItemDialogShow = true
  }
  private itemDialogClose() {
    this.isItemDialogShow = false
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
    // this.form.area = []
  }
  private filterMethod(query: any, item: any): boolean {
    const name = item.name || ''
    return name.indexOf(query) > -1
  }
  // 获取国家列表
  private getCountryList() {
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
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  // 保存表单
  private saveConfirm(): void {
    const editForm: any = this.$refs.editForm
    editForm.validate((valid: any) => {
      if (valid) {
        const countryInfo: any[] = []
        this.form.countryIds.forEach((ele: any) => {
          this.countryList.find(item => {
            if (item.id === ele) {
              countryInfo.push({
                countryId: item.id,
                countryName: item.label
              })
            }
          })
        })
        const params = {
          id: this.form.id,
          countries: countryInfo,
          type: this.form.type,
          name: this.form.name,
          remark: this.form.remark
        }
        saveFlight(params)
          .then(res => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.dialogShow = false
            this.queryAll()
          })
          .catch((err: any) => {
            return err
          })
      } else {
        return false
      }
    })
  }

  private deleteData(row: any) {
    const { id } = row
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        const params = {
          id
        }
        deleteFlight(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '操作成功'
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

  // filter
  private formatTypes(type: any): string {
    switch (type) {
      case '0':
        return '空运'
      case '1':
        return '海运'
      case '2':
        return '铁路'
      case '4':
        return '卡航'
      default:
        return '--'
    }
  }

  // 重置表单
  private reset(): void {
    this.form = {
      countryIds: [],
      type: undefined,
      name: undefined,
      remark: undefined
    }
  }

  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.queryAll()
    // this.$message.success(val)
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.queryAll()
    // this.$message.success(val)
  }

  private created(): void {
    this.queryAll()
    this.getCountryList()
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
