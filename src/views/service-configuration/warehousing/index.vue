<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        class="app-container"
      >
        <head-info
          v-show="!isTruckEditFormShow"
          info=""
          title="仓储服务"
        />
        <div
          v-show="!isTruckEditFormShow"
          class="app-panel"
        >
          <el-row>
            <el-col :span="4">
              <el-button
                v-permission="['warehousServiceAdd']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-left: 10px"
                @click="handleAdd"
              >
                新增服务
              </el-button>
            </el-col>
            <el-col
              :span="20"
              style="text-align:right;"
            >
              <el-input
                v-model="selectValue.keyword"
                size="small"
                placeholder="请输入内容"
                class="input-with-select"
                style="width:280px;margin-right:10px;"
              >
                <el-select
                  slot="prepend"
                  v-model="selectType"
                  style="width:110px;"
                  placeholder="请选择"
                >
                  <el-option
                    label="服务编码"
                    value="1"
                  />
                  <el-option
                    label="服务名称"
                    value="2"
                  />
                </el-select>
              </el-input>
              <el-button
                v-permission="['warehousingServiceQ']"
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
              fixed="left"
              prop="name"
              min-width="160"
              label="服务名称"
            />
            <el-table-column
              fixed="left"
              prop="serviceCode"
              min-width="200"
              label="服务编码"
            />
            <el-table-column
              prop="abbr"
              min-width="120"
              label="服务简称"
            />

            <el-table-column
              width="130"
              label="关联代理商"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="!$checkPermission(['warehousingServiceAgent'])"
                  type="text"
                  @click="associatedAgent(scope.row)"
                >
                  关联代理商
                </el-button>
              </template>
            </el-table-column>
            <!-- <el-table-column
              label="关联成本项目类型"
              width="150"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="associatedProject(scope.row)"
                >
                  成本项目类型
                </el-button>
              </template>
            </el-table-column> -->
            <el-table-column
              prop="createTime"
              label="添加时间"
              width="180"
            />
            <el-table-column
              width="130"
              label="启用状态"
            >
              <template slot-scope="scope">
                <el-switch
                  :value="scope.row.status"
                  :disabled="!$checkPermission(['warehousingServiceE'])"
                  class="switchStyle"
                  active-text="启用"
                  inactive-text="禁用"
                  active-value="1"
                  inactive-value="0"
                  @input="(value) => onStatus(scope.row, value)"
                />
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              width="180"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['warehousingServiceC']"
                  type="text"
                  @click="handleCopy(scope.row)"
                >
                  复制
                </el-button>
                <el-button
                  v-permission="['warehousingServiceU']"
                  type="text"
                  @click="handleEdit(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['warehousingServiceD']"
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
        </div>
        <!-- 穿梭框 -->
        <el-dialog
          :title="`关联代理商【${currentServiceName}】`"
          :visible.sync="isAgentShow"
          :close-on-click-modal="false"
          width="960px"
          @close="itemAgentClose"
        >
          <div v-loading="dialogLoading">
            <el-transfer
              ref="transferItem"
              v-model="agentForm.selectAgents"
              filterable
              :filter-method="filterMethod"
              :titles="['选择关联代理商', '已关联代理商']"
              :props="{key: 'id', label: 'name'}"
              filter-placeholder="输入搜索"
              :data="agentList"
              style="height: 500px;"
            />
          </div>

          <div
            slot="footer"
            style="text-align: right;margin: 20px 40px 0;"
          >
            <el-button
              size="small"
              @click="itemAgentClose"
            >
              取 消
            </el-button>

            <el-button
              type="primary"
              size="small"
              @click="saveAgentConfirm"
            >
              确 定
            </el-button>
          </div>
        </el-dialog>

        <el-dialog
          title="关联成本项目类型"
          :visible.sync="isCostitemShow"
          :close-on-click-modal="false"
          width="960px"
          @close="cancelCostItem"
        >
          <div v-loading="dialogLoading">
            <el-transfer
              ref="transferItem"
              v-model="associatedForm.costItem"
              filterable
              :filter-method="filterMethod"
              :titles="['成本项目类型', '已选择']"
              :props="{key: 'id', label: 'name'}"
              filter-placeholder="输入搜索"
              :data="costItemList"
              style="height: 500px;"
            />
            <div
              slot="footer"
              style="text-align: right;margin: 20px 40px 0;"
            >
              <el-button
                size="small"
                @click="cancelCostItem"
              >
                取 消
              </el-button>

              <el-button
                type="primary"
                size="small"
                @click="saveCostItem"
              >
                确 定
              </el-button>
            </div>
          </div>
        </el-dialog>

        <div v-show="isTruckEditFormShow">
          <add-edit-form
            ref="editForm"
            :select-form="selectForm"
            :form-loading="formLoading"
            :is-edit="isEdit"
            :is-copy="isCopy"
            @saveConfirm="saveConfirm"
            @closeForm="closeForm"
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
  getWarehouseList,
  saveWarehouseData,
  modifyWarehouseStatus,
  getAgentsById,
  deleteWarehouseData,
  getCustTypeList,
  saveAgent,
  getSsCostitemType,
  saveSsCostItem,
  getCostitemTypeList
} from '@/api/service-with-warehouse-service'

import AddEditForm from '@/views/service-configuration/warehousing/components/addEditForm.vue'

function formParam() {
  return {
    abbr: undefined,
    belong: undefined,
    createTime: undefined,
    custId: undefined,
    custName: undefined,
    examine: true,
    examineId: undefined,
    examineName: undefined,
    id: undefined,
    name: undefined,
    serviceCode: undefined,
    status: undefined,
    subtypeId: undefined,
    subtypeName: undefined,
    terms: undefined,
    umLength: undefined,
    umVolume: undefined,
    umWeight: undefined,
    remark: undefined
  }
}

@Component({
  name: 'Port',
  components: {
    AddEditForm
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private isAddEditVisible: boolean = false
  private isEdit: boolean = false
  private isCopy: boolean = false
  private isTruckEditFormShow: boolean = false
  private tableData: any = []
  private agentList:any[] = [] // 代理商
  private currentId = ''
  private agentForm = {
    selectAgents: []
  }
  private associatedForm:any = {
    costItem: []
  }
  private selectValue: any = {
    keyword: undefined // 搜索关键字
  }
  private selectForm: any = formParam()
  private formLoading = false
  private subTypeList:any[] = [] // 服务类型
  private dialogLoading = false
  private isAgentShow: boolean = false
  private isCostitemShow: boolean = false
  private costItemList: any[] = []
  private currentServiceId = ''
  private currentServiceName = ''
  private props: any = {
    label: 'name',
    value: 'id'
  }
  private selectType = '1'
  private page: number = 1
  private size: number = 10
  private total: any = 0

  /* computed */
  // 所属公司id
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }
  get custName(): string {
    const info = UserModule.info || {}
    const custName = (info as any).custName
    return custName
  }
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
  private queryAll(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const params:any = {
      custId: (this as any).custId,
      countryId: this.selectValue.countryId,
      page: this.page,
      size: this.size
    }
    switch (this.selectType) {
      case '1':
        params.code = this.selectValue.keyword
        break
      case '2':
        params.name = this.selectValue.keyword
        break
    }
    getWarehouseList(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        this.tableData = data.result || []
        this.total = res.data.total
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
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
        deleteWarehouseData(params)
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
  // 新增
  private handleAdd(): void {
    this.isEdit = false
    this.isCopy = false
    this.isTruckEditFormShow = true
    this.$nextTick(() => {
      const root: any = this.$refs.editForm
      root.setTerms('')
    })
  }
  private cancel() {
    this.isAddEditVisible = false
    this.resetForm()
  }

  // 返回列表页面
  private closeForm():void {
    this.isTruckEditFormShow = false
    this.resetForm()
  }

  // 提交保存
  private saveConfirm(html: any) {
    const root: any = this.$refs.editForm
    const editForm:any = root.$refs.selectForm
    editForm.validate((valid: any) => {
      if (valid) {
        this.formLoading = true
        const { terms, ...form } = this.selectForm
        const params: any = {
          ...form
        }
        params.terms = html
        params.custId = (this as any).custId
        params.custName = (this as any).custName
        saveWarehouseData(params).then((res:any) => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.formLoading = false
          this.isTruckEditFormShow = false
          this.resetForm()
          this.queryAll()
        }).catch((err: any) => {
          this.formLoading = false
          return err
        })
      } else {
        return false
      }
    })
  }
  private formatData(arr:any) {
    arr.forEach((item:any) => {
      if (item.children.length === 0) {
        delete item.children
      } else {
        this.formatData(item.children)
      }
    })
    return arr
  }

  // 重置表单
  private resetForm() {
    this.selectForm = formParam()
    this.clearValidate()
  }
  // 清除校验
  private clearValidate() {
    const root: any = this.$refs.editForm
    const editForm: any = root.$refs.selectForm
    this.$nextTick(() => {
      editForm.clearValidate()
    })
  }
  // 设置关联代理商
  private saveAgentConfirm() {
    this.dialogLoading = true
    const agents = this.agentForm.selectAgents.map((item:any) => {
      let result
      const targetInfo = this.agentList.find(info => info.id === item) || {}
      const name = targetInfo.name
      result = {
        id: item,
        name
      }
      return result
    })
    const params = {
      agents,
      id: this.currentServiceId
    }
    saveAgent(params).then(res => {
      this.$message({
        type: 'success',
        message: '保存成功'
      })
      this.itemAgentClose()
      this.queryAll()
      this.dialogLoading = false
    }).catch(err => {
      this.dialogLoading = false
      return err
    })
  }
  // 关联代理商
  private associatedAgent(row:any) {
    this.isAgentShow = true
    this.currentServiceId = row.id
    this.currentServiceName = row.name
    this.dialogLoading = true
    const params = {
      sscId: row.id
    }
    Promise.all([this.getAgentById(params), this.getCustTypeList((row || {}).subtypeId)]).then(r => {
      this.dialogLoading = false
    }).catch((err: any) => {
      this.dialogLoading = false
      return err
    })
  }
  private getAgentById(params: any) {
    return getAgentsById(params).then(res => {
      const result:any = res.data
      this.agentForm.selectAgents = result.map((item:any) => item.id)
    }).catch(err => {
      return err
    })
  }

  // 获取仓储-服务配置的代理商列表
  private getCustTypeList(id: string) {
    const params = {
      page: 1,
      size: 9999,
      cas: 'A',
      typeId: '04',
      subtypeId: id
    }
    return getCustTypeList(params).then((res: any) => {
      const data = res.data || {}
      const result = data.result || []
      this.agentList = JSON.parse(
        JSON.stringify(result)
          .replace(/custName/g, 'name')
          .replace(/custId/g, 'id')
      )
    }).catch((err: any) => {
      return err
    })
  }
  // 关联成本项目
  private associatedProject(row:any) {
    const id = row.id
    this.currentServiceId = id
    this.isCostitemShow = true
    this.dialogLoading = true
    Promise.all([this.getServerProjectList(id), this.getCostitemTypeList()]).then(r => {
      this.dialogLoading = false
    }).catch(err => {
      this.dialogLoading = false
      return err
    })
  }
  private getCostitemTypeList() {
    return getCostitemTypeList({ serviceTypeId: '04' })
      .then((res: any) => {
        const data = res.data || []
        this.costItemList = data
      })
      .catch((err: any) => {
        return err
      })
  }
  // 获取报关服务成本项目列表
  private getServerProjectList(id:string) {
    const params = {
      id
    }
    return getSsCostitemType(params).then((res: any) => {
      const data = res.data || []
      this.associatedForm.costItem = data.map((item: any) => item.id) || []
    }).catch((err: any) => {
      return err
    })
  }
  private cancelCostItem() {
    this.isCostitemShow = false
    this.costItemList = []
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
  }
  // 保存关联成本项目
  private saveCostItem() {
    this.dialogLoading = true
    const costItemArr = this.associatedForm.costItem
    const costitemTypes = this.costItemList
      .filter(item => costItemArr.includes(item.id))
      .map(c => ({ id: c.id, name: c.name }))
    const params = {
      ssId: this.currentServiceId,
      costitemTypes
    }
    saveSsCostItem(params).then((res:any) => {
      this.$message({
        type: 'success',
        message: '更新成功'
      })
      this.cancelCostItem()
      this.associatedForm.costItem = []
      this.dialogLoading = false
      this.queryAll()
    }).catch((err: any) => {
      this.dialogLoading = false
      return err
    })
  }

  // 编辑
  private handleEdit(row: any): void {
    this.currentId = row.id
    const { terms, ...form } = row
    this.selectForm = { ...form }
    this.isEdit = true
    this.isCopy = false
    this.isTruckEditFormShow = true
    this.$nextTick(async() => {
      this.formLoading = true
      const root: any = this.$refs.editForm
      root.setTerms(terms)
      await root.setData()
      this.formLoading = false
    })
  }
  private handleCopy(row: any): void {
    this.currentId = row.id
    const { terms, id, name, abbr, serviceCode, ...form } = row
    this.selectForm = { ...form }
    this.isEdit = true
    this.isCopy = true
    this.isTruckEditFormShow = true
    this.$nextTick(async() => {
      this.formLoading = true
      const root: any = this.$refs.editForm
      root.setTerms(terms)
      await root.setData()
      this.formLoading = false
    })
  }

  // 关闭dialog重置表单
  private close(): void {
    this.isAddEditVisible = false
    this.resetForm()
  }

  // 重置表单
  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.queryAll()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.queryAll()
  }
  private async onStatus(row:any, value: any) {
    if (!row.status || row.status === value) {
      return
    }
    const text = value === '0' ? '禁用' : '开启'
    const [cancel, confirm] = await this.$confirm(
      `此操作将${text}该仓储服务，是否继续？`,
      '提示',
      {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then((res: any) => {
        return [null, res]
      })
      .catch((err: any) => {
        return [err, null]
      })
    if (cancel) return
    modifyWarehouseStatus({
      id: row.id,
      status: value
    })
      .then((res: any) => {
        this.$message.success('修改成功')
        this.queryAll()
      })
      .catch((err: any) => {
        return err
      })
  }
  private filterMethod(query: any, item: any): boolean {
    const name = item.name || ''
    return name.indexOf(query) > -1
  }

  private itemAgentClose() {
    this.isAgentShow = false
    this.agentList = []
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
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
