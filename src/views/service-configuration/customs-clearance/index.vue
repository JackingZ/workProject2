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
          v-show="!isCustomsEditFormShow"
          info=""
          title="报关服务"
        />
        <div
          v-show="!isCustomsEditFormShow"
          class="app-panel"
        >
          <el-row>
            <el-col :span="4">
              <el-button
                v-permission="['customsClearanceAdd']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-left: 10px"
                @click="addRow"
              >
                新增服务
              </el-button>
            </el-col>
            <el-col
              :span="20"
              style="text-align:right;"
            >
              <el-select
                v-model="selectValue.countryId"
                placeholder="所在国家"
                size="small"
                filterable
                clearable
                style="width:130px;margin-right:5px;"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.subtypeId"
                size="small"
                style="width:140px;margin-right:5px;"
                clearable
                placeholder="服务类型"
              >
                <el-option
                  v-for="item in subTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
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
                v-permission="['customsClearanceQueryPage']"
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
              min-width="180"
              label="服务名称"
            />
            <el-table-column
              fixed="left"
              prop="csId"
              min-width="180"
              label="服务编码"
            />
            <el-table-column
              prop="abbr"
              min-width="160"
              label="服务简称"
            />
            <el-table-column
              prop="subtypeName"
              width="120"
              label="服务类型"
            />

            <el-table-column
              label="关联成本项目"
              width="130"
            >
              <div
                slot-scope="scope"
                style="display: flex;align-items: center"
              >
                <span style="font-size: 30px;margin-right: 5px">
                  <strong>
                    <span
                      v-if="scope.row.costitemConfiged"
                      style="color: #4cd964;"
                    >
                      ·
                    </span>
                    <span
                      v-else
                      style="color: #ff3b30;"
                    >
                      ·
                    </span>
                  </strong>
                </span>
                <el-button
                  :disabled="!$checkPermission(['customsClearanceAssociated'])"
                  type="text"
                  @click="associatedProject(scope.row)"
                >
                  关联成本项目
                </el-button>
              </div>
            </el-table-column>
            <el-table-column
              label="关联海关"
              width="100"
            >
              <div
                slot-scope="scope"
                style="display: flex;align-items: center"
              >
                <span style="font-size: 30px;margin-right: 5px">
                  <strong>
                    <span
                      v-if="scope.row.customsConfiged"
                      style="color: #4cd964;"
                    >
                      ·
                    </span>
                    <span
                      v-else
                      style="color: #ff3b30;"
                    >
                      ·
                    </span>
                  </strong>
                </span>
                <el-button
                  :disabled="!$checkPermission(['customsClearanceTransfer'])"
                  type="text"
                  @click="showTransferModal(scope.row)"
                >
                  关联海关
                </el-button>
              </div>
            </el-table-column>
            <el-table-column
              width="130"
              label="关联代理商"
            >
              <div
                slot-scope="scope"
                style="display: flex;align-items: center"
              >
                <!--<span style="font-size: 30px;margin-right: 5px">
                  <strong>
                    <span
                      v-if="scope.row.agentConfiged"
                      style="color: #4cd964;"
                    >
                      ·
                    </span>
                    <span
                      v-else
                      style="color: #ff3b30;"
                    >
                      ·
                    </span>
                  </strong>
                </span>-->
                <el-button
                  :disabled="!$checkPermission(['customsClearanceAgent'])"
                  type="text"
                  @click="associatedAgent(scope.row)"
                >
                  关联代理商
                </el-button>
              </div>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="添加时间"
              width="180"
            />
            <el-table-column
              fixed="right"
              width="130"
              label="启用状态"
            >
              <template slot-scope="scope">
                <el-switch
                  :disabled="!$checkPermission(['customsClearanceEnable'])"
                  :value="scope.row.status"
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
                  v-permission="['customsClearanceCopy']"
                  type="text"
                  @click="copyRow(scope.row)"
                >
                  复制
                </el-button>
                <el-button
                  v-permission="['customsClearanceEdit']"
                  type="text"
                  @click="editRow(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['customsClearanceDelete']"
                  type="text"
                  @click="deleteRow(scope.row)"
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
          :visible.sync="isItemDialogShow"
          :close-on-click-modal="false"
          width="960px"
          @close="itemDialogClose"
        >
          <div v-loading="agentLoading">
            <el-transfer
              ref="transferItem"
              v-model="selectAgents"
              filterable
              :filter-method="filterMethod"
              :titles="['选择关联代理商', '已关联代理商']"
              :props="{key: 'id', label: 'name'}"
              filter-placeholder="输入搜索"
              :data="agentList"
              style="height: 500px;"
            />

            <div
              slot="footer"
              style="text-align: right;margin: 20px 40px 0;"
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
                @click="setAgentConfirm"
              >
                确 定
              </el-button>
            </div>
          </div>
        </el-dialog>

        <el-dialog
          :title="'关联成本项目' + '【' + title +'】'"
          :visible.sync="isCostItemShow"
          :close-on-click-modal="false"
          width="960px"
          @close="cancelCostItem"
        >
          <div v-loading="costLoading">
            <el-transfer
              ref="transferItem"
              v-model="costItemOption"
              filterable
              :filter-method="filterMethod"
              :titles="['成本项目', '已选择']"
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

        <div v-show="isCustomsEditFormShow">
          <add-edit-form
            ref="editForm"
            :is-edit="isEdit"
            :is-copy="isCopy"
            :sub-type-data="subTypeList"
            :country-data="countryList"
            @saveConfirm="saveConfirm"
            @closeForm="closeForm"
          />
        </div>
      </div>
    </div>
    <transfer-modal
      ref="transferModal"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'

import {
  getCountryList,
  getSupplierList,
  getServiceSubtypeList,
  getClearanceList,
  saveClearanceData,
  queryAgentList,
  saveAgent,
  modifyClearanceStatus,
  deletClearanceData,
  getCustTypeList,
  getServicepProjectList,
  getCostitemList,
  saveCostItem
} from '@/api/service-with-customs-clearance'
import AddEditForm from '@/views/service-configuration/customs-clearance/components/addEditForm.vue'
import transferModal from '@/views/service-configuration/customs-clearance/components/transferModal.vue'

@Component({
  name: 'CustomsClearance',
  components: {
    AddEditForm,
    transferModal
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private isEdit: boolean = false
  private isCopy: boolean = false
  private isCustomsEditFormShow: boolean = false
  private tableData: any = []
  private agentList:any[] = [] // 代理商
  private currentServiceId = ''
  private currentServiceName = ''
  private selectAgents:any[] = []
  private selectValue: any = {
    countryId: undefined, // 国家
    subtypeId: undefined, //
    keyword: undefined // 搜索关键字
  }
  private countryList: any[] = [] // 国际列表
  private subTypeList:any[] = [] // 服务类型
  private agentLoading = false
  private isItemDialogShow: boolean = false
  private isCostItemShow: boolean = false
  private costLoading: boolean = false
  private props: any = {
    label: 'name',
    value: 'id'
  }
  private title = ''
  private currentId = ''
  private costItemOption: any[] = []
  private costItemList: any[] = []
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
      countryId: this.selectValue.countryId,
      subtypeId: this.selectValue.subtypeId,
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
    getClearanceList(params)
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
  // 获取国家列表
  private getCountryList() {
    getCountryList()
      .then((res: any) => {
        const data = res.data || {}
        this.countryList = data.result || []
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

  private deleteRow(row: any) {
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
        deletClearanceData(params)
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
  private addRow(): void {
    this.isEdit = false
    this.isCopy = false
    this.isCustomsEditFormShow = true
    this.$nextTick(() => {
      const root: any = this.$refs.editForm
      root.setTerms('')
    })
  }

  private getSubtypeList() {
    const params = {
      typeId: '03'
    }
    getServiceSubtypeList(params).then((res:any) => {
      this.subTypeList = res.data || []
    }).catch((err:any) => {
      return err
    })
  }
  // 返回列表页面
  private closeForm():void {
    this.isCustomsEditFormShow = false
    this.resetForm()
  }

  // 提交保存
  private saveConfirm(html: any) {
    this.isCustomsEditFormShow = false
    this.resetForm()
    this.queryAll()
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
    this.clearValidate()
  }
  // 清除校验
  private clearValidate() {
    const root: any = this.$refs.editForm
    const editForm: any = root.$refs.selectForm
    this.$nextTick(() => {
      root.setTerms('')
      editForm.clearValidate()
    })
  }
  // 设置关联代理商
  private setAgentConfirm() {
    this.agentLoading = true
    const agents = this.selectAgents.map((item:any) => {
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
      this.agentLoading = false
      this.itemDialogClose()
      this.queryAll()
    }).catch(err => {
      this.agentLoading = false
      return err
    })
  }

  // 关联代理商
  private associatedAgent(row:any) {
    this.isItemDialogShow = true
    this.currentServiceId = row.id
    this.currentServiceName = row.name
    this.agentLoading = true
    const params = {
      cscId: row.id
    }
    Promise.all([this.getAgentById(params), this.getCustTypeList((row || {}).subtypeId)]).then(r => {
      this.agentLoading = false
    }).catch(err => {
      this.agentLoading = false
      return err
    })
  }
  private getAgentById(params: any) {
    return queryAgentList(params).then(res => {
      const result:any = res.data || []
      this.selectAgents = result.map((item:any) => item.id)
    }).catch(err => {
      return err
    })
  }

  // 获取供应商列表
  private getCustTypeList(id: string) {
    const params = {
      page: 1,
      size: 9999,
      cas: 'A',
      typeId: '03',
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

  private showTransferModal(row: any) {
    (this.$refs.transferModal as any).show(row, row.countryName + '-' + row.subtypeName + '-' + row.csId)
  }

  // 关联成本项目
  private associatedProject(row: any) {
    const id = row.id
    this.currentId = id
    this.title = row.countryName + '-' + row.subtypeName + '-' + row.csId
    this.isCostItemShow = true
    this.costLoading = true
    const params: any = {
      serviceTypeId: '03',
      typeId: row.subtypeId,
      page: 1,
      size: 99999
    }
    Promise.all([this.getServerProjectList(id), this.getCostitemList(params)]).then(r => {
      this.costLoading = false
    }).catch(err => {
      this.costLoading = false
      return err
    })
  }

  private getCostitemList(params: any) {
    return getCostitemList(params)
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result || []
        this.costItemList = result
      })
      .catch((err: any) => {
        return err
      })
  }

  // 获取报关服务成本项目列表
  private getServerProjectList(id: string) {
    const params = {
      id
    }
    return getServicepProjectList(params)
      .then((res: any) => {
        const data = res.data || []
        this.costItemOption = data.map((item: any) => item.id) || []
      })
      .catch((err: any) => {
        return err
      })
  }
  private cancelCostItem() {
    this.isCostItemShow = false
    this.costItemList = []
    this.costItemOption = []
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
  }
  private saveCostItem() {
    this.costLoading = true
    const costItemArr = this.costItemOption
    const cscCostitems = this.costItemList
      .filter(item => costItemArr.includes(item.id))
      .map(c => ({ id: c.id, name: c.name }))
    const params = {
      cscId: this.currentId,
      cscCostitems
    }
    saveCostItem(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '更新成功'
        })
        this.cancelCostItem()
        this.costLoading = false
        this.queryAll()
      })
      .catch(err => {
        this.costLoading = false
        return err
      })
  }
  private copyRow(row: any) {
    this.isEdit = true
    this.isCopy = true
    this.isCustomsEditFormShow = true
    this.$nextTick(() => {
      const root: any = this.$refs.editForm
      root.setTerms(row.terms)
      root.setData(row)
    })
  }
  // 编辑
  private editRow(row: any): void {
    this.isEdit = true
    this.isCopy = false
    this.isCustomsEditFormShow = true
    this.$nextTick(() => {
      const root: any = this.$refs.editForm
      root.setTerms(row.terms)
      root.setData(row)
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

  private async onStatus(row:any, value: any) {
    if (!row.status || row.status === value) {
      return
    }
    const text = value === '0' ? '禁用' : '开启'
    const [cancel, confirm] = await this.$confirm(
      `此操作将${text}该报关服务，是否继续？`,
      '提示',
      {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(res => {
        return [null, res]
      })
      .catch(err => {
        return [err, null]
      })
    if (cancel) return
    modifyClearanceStatus({
      id: row.id,
      status: value
    })
      .then(res => {
        this.$message.success('修改成功')
        this.queryAll()
      })
      .catch(err => {
        return err
      })
  }
  private filterMethod(query: any, item: any): boolean {
    const name = item.name || ''
    return name.indexOf(query) > -1
  }

  private itemDialogClose() {
    this.isItemDialogShow = false
    this.agentList = []
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
  }
  private created(): void {
    this.queryAll()
    this.getCountryList()
    this.getSubtypeList()
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
