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
          title="拖车服务"
        />
        <div
          v-show="!isTruckEditFormShow"
          class="app-panel"
        >
          <el-row>
            <el-col :span="6">
              <el-button
                v-permission="['towingServiceAdd']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-left: 10px"
                @click="addCardPad"
              >
                新增服务
              </el-button>
              <!--<el-button
                type="text"
                icon="el-icon-edit-outline"
                style="margin-left: 10px"
                @click="setServiceGroup"
              >
                设置组合
              </el-button>-->
            </el-col>
            <el-col
              :span="18"
              style="text-align:right;"
            >
              <el-select
                v-model="selectValue.addressCategory"
                placeholder="地址类别"
                style="width: 100px;margin-right:5px;"
                size="small"
                filterable
                clearable
              >
                <el-option
                  label="FBA"
                  value="0"
                />
                <el-option
                  label="私人"
                  value="1"
                />
              </el-select>
              <el-select
                v-model="selectValue.addressType"
                placeholder="目的地类型"
                style="width: 120px;margin-right:5px;"
                size="small"
                filterable
                clearable
              >
                <el-option
                  v-for="item in addressTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select
                v-model="selectValue.countryId"
                :loading="selectLoading"
                placeholder="所在国家"
                size="small"
                filterable
                clearable
                style="width:130px;margin-right:5px;"
                @focus="getCountryList"
                @change="onCountryChange"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.stateId"
                :loading="selectLoading"
                :disabled="!selectValue.countryId"
                placeholder="州/省"
                clearable
                filterable
                size="small"
                style="width:130px;margin-right:5px;"
                @focus="getStateList"
                @change="onStateChange"
              >
                <el-option
                  v-for="item in stateList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.cityId"
                :loading="selectLoading"
                :disabled="!selectValue.stateId"
                placeholder="城市"
                clearable
                size="small"
                filterable
                style="width:130px;margin-right:5px;"
                @focus="getCityList"
              >
                <el-option
                  v-for="item in cityList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.subtypeId"
                size="small"
                style="width:100px;margin-right:5px;"
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
                v-permission="['towingServiceQuery']"
                type="primary"
                size="small"
                @click="queryAll(1)"
              >
                查询
              </el-button>
            </el-col>
          </el-row>
          <!-- <inputTags ref="inputTags" /> -->
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
              min-width="190"
              label="服务名称"
            />
            <el-table-column
              fixed="left"
              prop="tsId"
              min-width="120"
              label="服务编码"
            />
            <el-table-column
              prop="abbr"
              min-width="160"
              label="服务简称"
            />
            <el-table-column
              prop="subtypeName"
              min-width="180"
              label="服务类型"
            />

            <!-- <el-table-column
              prop="stateNameTo"
              label="目的国起运地"
            /> -->
            <el-table-column
              width="110"
              label="目的地址"
            >
              <div
                slot-scope="scope"
                style="display: flex;align-items: center"
              >
                <span style="font-size: 30px;margin-right: 5px">
                  <strong>
                    <span
                      v-if="scope.row.y"
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
                  :disabled="!$checkPermission(['towingServiceAddress'])"
                  type="text"
                  @click="addAddress(scope.row)"
                >
                  目的地址
                </el-button>
              </div>
            </el-table-column>
            <el-table-column
              width="110"
              label="设置柜型"
            >
              <div
                slot-scope="scope"
                style="display: flex;align-items: center"
              >
                <span style="font-size: 30px;margin-right: 5px">
                  <strong>
                    <span
                      v-if="scope.row.x"
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
                  :disabled="!$checkPermission(['towingServiceCabinet'])"
                  type="text"
                  @click="saveCabinet(scope.row)"
                >
                  设置柜型
                </el-button>
              </div>
            </el-table-column>
            <el-table-column
              width="130"
              label="关联代理商"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="!$checkPermission(['towingServiceAgent'])"
                  type="text"
                  @click="associatedAgent(scope.row)"
                >
                  关联代理商
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="添加时间"
              min-width="160"
            />
            <el-table-column
              fixed="right"
              width="130"
              label="启用状态"
            >
              <template slot-scope="scope">
                <el-switch
                  :disabled="!$checkPermission(['towingServiceEnable'])"
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
                  v-permission="['towingServiceCopy']"
                  type="text"
                  @click="copyForm(scope.row)"
                >
                  复制
                </el-button>
                <el-button
                  v-permission="['towingServiceUpdate']"
                  type="text"
                  @click="editForm(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['towingServiceDel']"
                  type="text"
                  @click="deletData(scope.row)"
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
                size="small"
                type="primary"
                @click="setAgentConfirm"
              >
                确 定
              </el-button>
            </div>
          </div>
        </el-dialog>

        <el-dialog
          title="设置服务组合"
          :visible.sync="isGroupDialog"
          :close-on-click-modal="false"
          width="960px"
          @closed="isGroupDialog = false"
        >
          <trailerSet
            ref="trailerSet"
            :sub-type-data="subTypeList"
          />
        </el-dialog>

        <div v-show="isTruckEditFormShow">
          <add-edit-form
            ref="editForm"
            :sub-type-data="subTypeList"
            :country-data="countryList"
            :is-edit="isEdit"
            :is-copy="isCopy"
            @saveConfirm="saveConfirm"
            @closeForm="closeForm"
          />
        </div>
      </div>
    </div>
    <add-address-modal
      ref="addAddressModal"
      :country-list="countryList"
      @load="queryAll"
    />
    <set-cabinet
      ref="setCabinet"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getCountryList,
  getStateByCountry,
  getCityByState,
  getCustTypeList,
  getServiceSubtypeList,
  getTrailerList,
  saveTrialerData,
  modifyTrailerStatus,
  deleteTrailerData,
  queryAgentList,
  saveAgent
} from '@/api/service-with-trailers-service'

import AddEditForm from '@/views/service-configuration/trailer/components/addEditForm.vue'
import trailerSet from '@/views/service-configuration/trailer/components/trailerSet.vue'
import addAddressModal from '@/views/service-configuration/trailer/components/addAddressModal.vue'
import setCabinet from '@/views/service-configuration/trailer/components/setCabinet.vue'
import inputTags from '@/views/service-configuration/trailer/components/inputTags.vue'

@Component({
  name: 'Port',
  components: {
    AddEditForm,
    trailerSet,
    addAddressModal,
    setCabinet,
    inputTags
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
  private isGroupDialog: boolean = false
  private tableData: any = []
  private agentList:any[] = [] // 代理商
  private currentId = ''
  private currentServiceId = ''
  private selectAgents: any[] = []
  private addressTypeList: any[] = [
    {
      label: '私人地址',
      value: 0
    },
    {
      label: '港口',
      value: 1
    },
    {
      label: '火车站',
      value: 2
    },
    {
      label: '海外仓',
      value: 3
    },
    {
      label: '国内区域',
      value: 4
    },
    {
      label: '城市区域',
      value: 5
    },
    {
      label: '仓库区域',
      value: 6
    },
    {
      label: '国家区域',
      value: 7
    }
  ]
  private selectValue: any = {
    addressType: undefined,
    addressCategory: undefined,
    stateId: undefined,
    cityId: undefined,
    countryId: undefined, // 国家
    subtypeId: undefined, //
    keyword: undefined // 搜索关键字
  }
  private countryList: any[] = []
  private stateList: any[] = []
  private cityList: any[] = []
  private selectLoading = false
  private subTypeList:any[] = [] // 服务类型
  private agentLoading = false
  private currentServiceName = ''
  private isItemDialogShow: boolean = false
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

  private addAddress(row: any) {
    (this.$refs.addAddressModal as any).show(row)
  }
  private saveCabinet(row: any) {
    (this.$refs.setCabinet as any).show(row)
  }
  private queryAll(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const { keyword, ...form } = this.selectValue
    const params:any = {
      ...form,
      page: this.page,
      size: this.size
    }
    switch (this.selectType) {
      case '1':
        params.code = keyword
        break
      case '2':
        params.name = keyword
        break
    }
    getTrailerList(params)
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
  // 获取国家列表
  private getCountryList() {
    this.selectLoading = true
    getCountryList()
      .then((res: any) => {
        const data = res.data || {}
        this.countryList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private async getStateList() {
    if (!this.selectValue.countryId) return
    this.selectLoading = true
    await getStateByCountry(this.selectValue.countryId).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      const result = data.result || []
      this.stateList = result
    }).catch(() => {
      this.stateList = []
      this.selectLoading = false
    })
  }
  private async getCityList() {
    if (!this.selectValue.stateId) return
    this.selectLoading = true
    await getCityByState(this.selectValue.stateId).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      const result = data.result || []
      this.cityList = result
    }).catch(() => {
      this.cityList = []
      this.selectLoading = false
    })
  }
  private async onCountryChange() {
    this.selectValue.stateId = ''
    this.onStateChange()
  }
  private onStateChange() {
    this.selectValue.cityId = ''
  }

  private deletData(row: any) {
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
        deleteTrailerData(params)
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
  private setServiceGroup() {
    this.isGroupDialog = true
    this.$nextTick(() => {
      const root: any = this.$refs.trailerSet
      root.setData()
    })
  }
  // 新增
  private addCardPad(): void {
    this.isEdit = false
    this.isCopy = false
    this.isTruckEditFormShow = true
  }

  // 获取拖车服务类型
  private getSubtypeList() {
    const params = {
      typeId: '06'
    }
    getServiceSubtypeList(params).then((res:any) => {
      this.subTypeList = res.data
    }).catch((err:any) => {
      return err
    })
  }
  // 获取供应商列表
  private getCustTypeList(id: string) {
    const params = {
      page: 1,
      size: 9999,
      cas: 'A',
      typeId: '06',
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
  // 返回列表页面
  private closeForm():void {
    this.isTruckEditFormShow = false
    this.resetForm()
  }

  // 提交保存
  private saveConfirm() {
    this.isTruckEditFormShow = false
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
      editForm.clearValidate()
      root.setTerms('')
    })
  }
  // 设置关联代理商
  private setAgentConfirm() {
    const agents = this.selectAgents.map((item:any) => {
      let result
      const targetInfo = this.agentList.find(info => info.id === item)
      const name = targetInfo ? targetInfo.name : ''
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
      this.itemDialogClose()
      this.queryAll()
    }).catch(err => {
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
      tscId: row.id
    }
    Promise.all([this.getAssociatedAgentList(params), this.getCustTypeList((row || {}).subtypeId)]).then(r => {
      this.agentLoading = false
    })
      .catch((err: any) => {
        this.agentLoading = false
        return err
      })
  }
  private getAssociatedAgentList(params: any) {
    return queryAgentList(params).then((res: any) => {
      const result:any = res.data
      this.selectAgents = result.map((item:any) => item.id)
    }).catch((err: any) => {
      this.agentLoading = false
      return err
    })
  }
  // 编辑
  private editForm(row: any): void {
    this.isEdit = true
    this.isCopy = false
    this.isTruckEditFormShow = true
    const root: any = this.$refs.editForm
    this.$nextTick(() => {
      root.setTerms(row.terms)
      root.setData(row)
    })
  }
  private copyForm(row: any): void {
    this.isEdit = true
    this.isCopy = true
    this.isTruckEditFormShow = true
    const root: any = this.$refs.editForm
    this.$nextTick(() => {
      root.setTerms(row.terms)
      root.setData(row)
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
      `此操作将${text}该拖车服务，是否继续？`,
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
    modifyTrailerStatus({
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
    return item.name.indexOf(query) > -1
  }

  private itemDialogClose() {
    this.isItemDialogShow = false
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
