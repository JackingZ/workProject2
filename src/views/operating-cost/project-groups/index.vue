<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="成本项目组"
        />
        <div class="app-panel">
          <div>
            <el-row>
              <el-col :span="6">
                <el-button
                  v-permission="['wAdd']"
                  type="text"
                  icon="el-icon-circle-plus-outline"
                  style="margin-left: 10px"
                  @click="saveCostgroupData"
                >
                  新增项目组
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
                label="成本项目组名称"
                min-width="280"
                prop="name"
              />

              <el-table-column
                label="类型"
                width="280"
              >
                <template slot-scope="scope">
                  {{ findByKeyValueReturnAnotherKeyValue(scope.row.type) }}
                </template>
              </el-table-column>

              <el-table-column
                label="成本项目"
                width="180"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="showProjects(scope.row.id)"
                  >
                    成本项目
                  </el-button>
                </template>
              </el-table-column>

              <el-table-column
                label="操作"
                fixed="right"
                width="180"
              >
                <template slot-scope="scope">
                  <el-button
                    v-permission="['wEdit']"
                    type="text"
                    @click="toEditForm(scope.row)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    v-permission="['wDel']"
                    type="text"
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
              @current-change="queryAll"
            />

            <el-dialog
              :title="isEdit ? '编辑项目组' : '新增项目组'"
              :visible.sync="isAddEditVisible"
              :close-on-click-modal="false"
              width="600px"
              @close="cancel"
            >
              <div class="add-edit-express">
                <el-form
                  ref="editForm"
                  :model="selectForm"
                  :rules="formRules"
                  size="small"
                  label-width="110px"
                  label-position="right"
                  style="padding-right: 20px;"
                >
                  <el-form-item
                    label="项目组名称"
                    prop="name"
                  >
                    <el-input
                      v-model="selectForm.name"
                      :maxlength="20"
                      placeholder="请输入"
                    />
                  </el-form-item>

                  <el-form-item
                    label="类型"
                    prop="type"
                  >
                    <el-select
                      v-model="selectForm.type"
                      clearable
                      filterable
                      style="width:100%;"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in typeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="备注"
                  >
                    <el-input
                      v-model="selectForm.remark"
                      :maxlength="100"
                      placeholder="请输入"
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

            <el-dialog
              title="关联成本项目"
              :visible.sync="isItemDialogShow"
              :close-on-click-modal="false"
              width="960px"
              @close="itemDialogClose"
            >
              <div v-loading="isItemLoading">
                <div>
                  <el-select
                    v-model="serviceType"
                    :loading="selectLoading"
                    filterable
                    style="width:130px;margin: 0px 0px 10px 43px;"
                    placeholder="请选择"
                    size="small"
                    @change="onServiceType"
                  >
                    <el-option
                      v-for="item in serviceList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </div>
                <el-transfer
                  ref="transferItem"
                  v-model="itemValue"
                  filterable
                  :filter-method="filterMethod"
                  :titles="['成本项目组', '已选择']"
                  :props="{key: 'id', label: 'name'}"
                  filter-placeholder="输入搜索"
                  :data="itemData"
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
                    :disabled="!$checkPermission(['wProjects'])"
                    type="primary"
                    size="small"
                    @click="saveItem"
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'

import {
  getCostgroupList,
  deleteCostgroup,
  saveCostgroup,
  getCostmemberList,
  getCostList,
  saveCostItems,
  getServiceTypeList
} from '@/api/operating-cost-project-groups'

@Component({
  name: 'ProjectGroupsCost',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private isItemLoading: boolean = false
  private tableData: any = []
  private isEdit: boolean = false
  private isAddEditVisible: boolean = false
  private isItemDialogShow: boolean = false
  private itemData = [] // 关联的成本项目列表
  private itemValue = []
  private itemJson: any[] = []
  private selectLoading: boolean = false
  private serviceType: any = ''
  private serviceList: any[] = []
  private typeList: any[] = [
    {
      id: '0',
      name: '普通组'
    },
    {
      id: '1',
      name: '计费生成的发票费用组'
    },
    {
      id: '2',
      name: '订舱成本费用组'
    },
    {
      id: '3',
      name: '国内出口杂费组'
    },
    {
      id: '4',
      name: '国外目的港清关费'
    }
  ] // 类型列表

  private currentId = ''

  private ruleForm = {}

  private selectForm: any = {
    name: undefined, // 成本项目组名称
    type: undefined, // 类型
    remark: undefined // 备注
  }

  private formRules = {
    name: [
      { required: true, message: '项目中文名称不能为空', trigger: 'blur' }
    ],
    type: [{ required: true, message: '类型不能为空', trigger: 'change' }]
  }
  private page: number = 1
  private size: number = 10
  private total: any = 0

  private currentCostId = ''

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

  private filterMethod(query: any, item: any): boolean {
    const name = item.name || ''
    return name.indexOf(query) > -1
  }

  // 获取表格数据
  private queryAll(): void {
    this.loading = true
    const params = {
      page: this.page,
      size: this.size
    }

    getCostgroupList(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        this.tableData = data.result || []
        this.total = data.total
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

  private getCostmemberList(costgroupId: any): void {
    this.isItemLoading = true
    getCostmemberList({ costgroupId })
      .then((res: any) => {
        this.isItemLoading = false
        const list = res.data || []
        this.itemValue = list.map((item: any) => item.costitemId)
        this.itemJson = JSON.parse(JSON.stringify(this.itemValue))
      })
      .catch((err: any) => {
        this.isItemLoading = false
        return err
      })
  }

  private async getServiceTypeList() {
    this.isItemLoading = true
    const custType: any = '1'
    const params = {
      custType
    }
    try {
      const res = await getServiceTypeList(params)
      this.serviceList = res.data || []
      this.serviceType = (this.serviceList[0] || {}).id
      await this.getCostList()
    } catch (error) {
      this.isItemLoading = false
      return error
    }
  }
  private async onServiceType() {
    this.itemValue = JSON.parse(JSON.stringify(this.itemJson))
    await this.getCostList()
  }

  // 查询成本项目列表
  private async getCostList() {
    this.isItemLoading = true
    const params: any = {
      serviceTypeId: this.serviceType,
      page: 1,
      size: 9999
    }
    await getCostList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.itemData = data.result || []
        this.isItemLoading = false
      })
      .catch((err: any) => {
        this.isItemLoading = false
        return err
      })
  }

  private findByKeyValueReturnAnotherKeyValue(type: any) {
    const { typeList } = this
    const list =
      typeList.find(item => parseInt(item.id, 10) === parseInt(type, 10)) || {}
    return list.name
  }

  // 新增
  private saveCostgroupData(): void {
    this.isEdit = false
    this.isAddEditVisible = true
  }

  // 编辑
  private toEditForm(row: any): void {
    this.currentId = row.id
    const { name, type, remark } = row
    this.selectForm = {
      name,
      type,
      remark
    }
    this.isEdit = true
    this.isAddEditVisible = true
  }

  private deleteData(row: any) {
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
        deleteCostgroup(params)
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

  private cancel() {
    this.isAddEditVisible = false
    this.resetForm()
    this.clearValidate()
  }

  private itemDialogClose() {
    this.isItemDialogShow = false
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
    this.itemData = []
    this.itemValue = []
  }

  // 提交保存
  private saveConfirm() {
    const editForm: any = this.$refs.editForm
    editForm.validate((valid: any) => {
      if (valid) {
        const params: any = {
          ...this.selectForm
        }
        if (this.isEdit) {
          params.id = this.currentId
        }
        saveCostgroup(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.isAddEditVisible = false
            this.resetForm()
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

  private saveItem(): void {
    this.isItemLoading = true
    saveCostItems({
      costgroupId: this.currentCostId,
      costmembers: this.itemValue.map(item => {
        return {
          costitemId: item
        }
      })
    })
      .then(res => {
        this.currentCostId = ''
        this.itemDialogClose()
        this.isItemLoading = false
      })
      .catch(err => {
        this.isItemLoading = false
        return err
      })
  }

  // 重置表单
  private resetForm(): void {
    this.selectForm = {
      name: undefined, // 成本项目组名称
      type: undefined, // 类型
      remark: undefined // 备注
    }
  }

  private clearValidate(): void {
    const editForm: any = this.$refs.editForm
    this.$nextTick(() => {
      editForm.clearValidate()
    })
  }

  private async showProjects(id: any) {
    this.isItemDialogShow = true
    this.currentCostId = id
    await this.getServiceTypeList()
    this.getCostmemberList(id)
  }

  private created(): void {
    this.queryAll()
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
