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
          title="卡派服务"
        />
        <div
          v-show="!isTruckEditFormShow"
          class="app-panel"
        >
          <el-row>
            <el-col :span="6">
              <el-button
                v-permission="['cardServiceAdd']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-left: 10px"
                @click="handleAdd"
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
                filterables
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
                :loading="selectLoading"
                size="small"
                style="width:100px;margin-right:5px;"
                filterable
                clearable
                placeholder="服务类型"
                @focus="getSubtypeList"
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
                  <!-- <el-option
                    label="起运地区"
                    :value="3"
                  /> -->
                </el-select>
              </el-input>
              <el-button
                v-permission="['cardServiceQuery']"
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
              prop="ksId"
              min-width="260"
              label="服务编码"
              show-overflow-tooltip
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

            <el-table-column
              label="计费设置"
              width="120"
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
                  v-if="scope.row.priceType === '0'"
                  :disabled="!$checkPermission(['cardServiceRelevance'])"
                  type="text"
                  @click="handleRelevance(scope.row, '0')"
                >
                  设置车型
                </el-button>
                <el-button
                  v-else-if="(scope.row.priceType === '1' || scope.row.priceType === '2')"
                  :disabled="!$checkPermission(['cardServiceRelevance'])"
                  type="text"
                  @click="handleRelevance(scope.row, scope.row.priceType)"
                >
                  设置区间
                </el-button>
                <span v-else>--</span>
              </div>
            </el-table-column>
            <el-table-column
              label="目的地"
              width="120"
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
                  v-if="scope.row.addressType !== '4'"
                  :disabled="!$checkPermission(['cardServiceAddress'])"
                  type="text"
                  @click="handleAddress(scope.row)"
                >
                  目的地
                </el-button>
                <el-button
                  v-else-if="scope.row.addressType === '4'"
                  :disabled="!$checkPermission(['cardServiceAddress'])"
                  type="text"
                  @click="handleRelevance(scope.row, '3')"
                >
                  设置里程区间
                </el-button>
                <span v-else>--</span>
              </div>
            </el-table-column>
            <el-table-column
              width="130"
              label="关联代理商"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="!$checkPermission(['cardServiceAgent'])"
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
                  :disabled="!$checkPermission(['cardServiceEnable'])"
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
                  v-permission="['cardServiceCopy']"
                  type="text"
                  @click="handleCopy(scope.row)"
                >
                  复制
                </el-button>
                <el-button
                  v-permission="['cardServiceUpdate']"
                  type="text"
                  @click="handleEdit(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['cardServiceDel']"
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
          :visible.sync="isItemDialogShow"
          :close-on-click-modal="false"
          width="960px"
          @close="itemDialogClose"
        >
          <div v-loading="agentLoading">
            <el-transfer
              ref="transferItem"
              v-model="agentForm.selectAgents"
              filterable
              :filter-method="filterMethod"
              :titles="['选择关联代理商', '已关联代理商']"
              :props="{key: 'custId', label: 'custName'}"
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
          title="设置服务组合"
          :visible.sync="isGroupDialog"
          :close-on-click-modal="false"
          width="960px"
          @closed="isGroupDialog = false"
        >
          <truckSet
            ref="truckSet"
            :sub-type-data="subTypeList"
          />
        </el-dialog>
        <purposeSet
          ref="purposeSet"
          :country-list="countryList"
          @load="queryAll"
        />

        <div v-show="isTruckEditFormShow">
          <truck-service-form
            ref="editForm"
            :country-list="countryList"
            :is-edit="isEdit"
            :is-copy="isCopy"
            :sub-type-data="subTypeList"
            @saveConfirm="saveConfirm"
            @closeForm="closeForm"
          />
        </div>
        <set-car
          ref="setCar"
        />
        <set-section
          ref="setSection"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'

import {
  getTruckList,
  modifyCardPadStatus,
  saveCardpadData,
  queryAgentList,
  saveAgent,
  deleteCardPad,
  getCountryList,
  getStateByCountry,
  getCityByState,
  getCustTypeList,
  getServiceSubtypeList
} from '@/api/service-with-truck-service'

import TruckServiceForm from '@/views/service-configuration/truck/components/addEditTruckService.vue'
import truckSet from '@/views/service-configuration/truck/components/truckSet.vue'
import purposeSet from '@/views/service-configuration/truck/components/purposeSet.vue'
import setCar from '@/views/service-configuration/truck/components/setCar.vue'
import setSection from '@/views/service-configuration/truck/components/setSection.vue'

@Component({
  name: 'Port',
  components: {
    TruckServiceForm,
    truckSet,
    purposeSet,
    setCar,
    setSection
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private isEdit: boolean = false
  private isCopy: boolean = false
  private isTruckEditFormShow: boolean = false
  private isGroupDialog: boolean = false
  private isAddressDialog: boolean = false
  private tableData: any = []
  private agentList:any[] = [] // 代理商
  private currentServiceId = ''
  private currentServiceName = ''
  private agentForm = {
    selectAgents: []
  }
  private selectValue: any = {
    addressCategory: '',
    stateId: undefined,
    cityId: undefined,
    addressType: undefined,
    countryId: undefined, // 国家
    subtypeId: undefined, //
    keyword: undefined // 搜索关键字
  }
  private countryList: any[] = [] // 国际列表
  private stateList: any[] = []
  private cityList: any[] = []
  private subTypeList:any[] = [] // 服务类型
  private agentLoading: boolean = false
  private isItemDialogShow: boolean = false
  private selectLoading: boolean = false
  private props: any = {
    label: 'name',
    value: 'id'
  }
  private addressTypeList: any[] = [
    {
      label: '机场',
      value: '0'
    },
    {
      label: '港口',
      value: '1'
    },
    {
      label: '火车站',
      value: '2'
    },
    {
      label: '海外仓',
      value: '3'
    },
    {
      label: '国内区域',
      value: '5'
    },
    {
      label: '城市区域',
      value: '6'
    },
    {
      label: '仓库区域',
      value: '7'
    },
    {
      label: '国家区域',
      value: '8'
    }
  ]
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
    const { keyword, ...form } = this.selectValue
    const params:any = {
      model: {
        ...form
      },
      page: this.page,
      size: this.size
    }
    switch (this.selectType) {
      case '1':
        params.model.code = keyword
        break
      case '2':
        params.model.name = keyword
        break
    }
    getTruckList(params)
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
  // 查询服务小类
  private getSubtypeList() {
    this.selectLoading = true
    const params = {
      typeId: '01'
    }
    getServiceSubtypeList(params)
      .then((res:any) => {
        this.subTypeList = res.data || []
        this.selectLoading = false
      }).catch((err:any) => {
        this.selectLoading = false
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
        this.loading = true
        deleteCardPad(params)
          .then((res: any) => {
            this.loading = false
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.queryAll()
          })
          .catch((err: any) => {
            this.loading = false
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
      const root: any = this.$refs.truckSet
      root.setData()
    })
  }
  // 新增
  private handleAdd(): void {
    this.isEdit = false
    this.isCopy = false
    this.isTruckEditFormShow = true
    const root: any = this.$refs.editForm
    this.$nextTick(() => {
      root.reset()
    })
  }

  // 返回列表页面
  private closeForm():void {
    this.isTruckEditFormShow = false
    this.resetForm()
  }

  // 提交保存
  private saveConfirm(html: any) {
    this.isTruckEditFormShow = false
    this.resetForm()
    this.queryAll()
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
      root.reset()
      editForm.clearValidate()
    })
  }
  // 设置关联代理商
  private setAgentConfirm() {
    const agents = this.agentForm.selectAgents.map((item:any) => {
      let result
      const targetInfo = this.agentList.find(info => info.custId === item)
      const name = targetInfo ? targetInfo.custName : ''
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
  // 获取供应商列表
  private getAgentList(row: any) {
    const params = {
      cas: 'A',
      page: 1,
      size: 9999,
      typeId: '01',
      subtypeId: row.subtypeId
    }
    getCustTypeList(params).then(res => {
      this.agentList = res.data.result
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
      kscId: row.id
    }
    Promise.all([this.getAgentById(params), this.getAgentList(row)]).then(r => {
      this.agentLoading = false
    }).catch(err => {
      this.agentLoading = false
      return err
    })
  }
  private getAgentById(params: any) {
    return queryAgentList(params).then(res => {
      const result:any = res.data
      this.agentForm.selectAgents = result.map((item:any) => item.id)
    }).catch(err => {
      return err
    })
  }
  // 目的地
  private handleAddress(row: any) {
    this.isAddressDialog = true
    this.$nextTick(() => {
      const root: any = this.$refs.purposeSet
      root.setData(row)
    })
  }
  // 设置车型 type为-1设置里程区间
  private handleRelevance(row: any, type: any) {
    if (type === '0') {
      const root: any = this.$refs.setCar
      root.showModel(row)
    } else {
      const root: any = this.$refs.setSection
      root.showModel(row, type)
    }
  }
  // 编辑
  private handleEdit(row: any): void {
    const { terms } = row
    this.isEdit = true
    this.isCopy = false
    this.isTruckEditFormShow = true
    this.$nextTick(() => {
      const root: any = this.$refs.editForm
      root.setTerms(terms)
      root.setData(row)
    })
  }
  private handleCopy(row: any): void {
    const { terms } = row
    this.isEdit = true
    this.isCopy = true
    this.isTruckEditFormShow = true
    this.$nextTick(() => {
      const root: any = this.$refs.editForm
      root.setTerms(terms)
      root.setData(row)
    })
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
      `此操作将${text}该卡派服务，是否继续？`,
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
    modifyCardPadStatus({
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
    const name = item.custName || ''
    return name.indexOf(query) > -1
  }

  private itemDialogClose() {
    this.isItemDialogShow = false
    this.agentList = []
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
    // this.form.area = []
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
