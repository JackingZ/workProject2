<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <div class="panel-info">
          <h3>仓库配置</h3>
          <el-button
            v-show="!isMoreShow"
            type="text"
            icon="el-icon-back"
            @click="handleBack"
          >
            返回
          </el-button>
        </div>
        <div
          v-if="isMoreShow"
          class="app-panel"
        >
          <el-row>
            <el-col :span="4">
              <el-button
                v-permission="['warehouseOutStockAdd']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-left: 10px"
                @click="handleAdd"
              >
                新增仓库
              </el-button>
            </el-col>
            <el-col
              :span="20"
              style="text-align:right;"
            >
              <el-select
                v-if="custId === '0'"
                v-model="selectValue.custId"
                filterable
                style="width:130px;margin-right: 10px;"
                size="small"
                placeholder="供应商"
                @change="onSupplier"
              >
                <el-option
                  v-for="item in supplierList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.countryId"
                :loading="selectLoading"
                size="small"
                clearable
                style="width:130px;margin-right:10px;"
                placeholder="国家/地区"
                filterable
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
                v-model="selectValue.status"
                placeholder="启用状态"
                style="width:130px;margin-right:10px;"
                size="small"
                clearable
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
              <!-- <el-select
                v-model="selectValue.categoryList"
                placeholder="商品属性"
                style="width:130px;margin-right:10px;"
                size="small"
                clearable
                multiple
                collapse-tags
              >
                <el-option
                  v-for="item in attributes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select> -->
              <el-select
                v-model="selectValue.wareConfig"
                placeholder="仓库配置"
                style="width:130px;margin-right:10px;"
                size="small"
                clearable
                @change="selectwareConfig"
              >
                <el-option
                  v-for="item in configuration"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
              <el-select
                v-model="selectValue.wareAttr"
                placeholder="仓库属性"
                style="width:130px;margin-right:10px;"
                size="small"
                clearable
                @change="selectwareAttr"
              >
                <el-option
                  v-for="item in properties"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>

              <el-input
                v-model="selectValue.name"
                placeholder="请输入内容"
                class="input-with-select"
                style="width:280px;margin-right:10px;"
                size="small"
              >
                <template slot="prepend">
                  仓库名称
                </template>
              </el-input>
              <el-button
                v-permission="['warehouseOutStockQuery']"
                type="primary"
                size="small"
                @click="getTableList(1)"
              >
                查询
              </el-button>
            </el-col>
          </el-row>
          <div>
            <el-table
              v-loading="loading"
              :data="tableData"
              border
              height="calc(100vh - 313px)"
              style="width: 100%;margin: 10px 0;"
            >
              <el-table-column
                prop="name"
                label="仓库名称"
                min-width="180"
              />
              <el-table-column
                prop="countryName"
                label="国家/地区"
                min-width="150"
              />
              <el-table-column
                label="州省市区"
                min-width="180"
              >
                <template slot-scope="scope">
                  <span v-show="!!scope.row.stateName">
                    {{ scope.row.stateName }}
                  </span>
                  <span v-show="!!scope.row.cityName">
                    > {{ scope.row.cityName }}
                  </span>
                  <span v-show="!!scope.row.countyName">
                    > {{ scope.row.countyName }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="postal"
                label="仓库邮编"
                width="120"
              />
              <el-table-column
                prop="address"
                label="仓库地址"
                min-width="180"
              />
              <el-table-column
                prop="weight"
                label="入库限重"
                width="150"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.weight }}</span>
                  <span>{{ filterUnit(scope.row.unitOfWeight) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="unloading"
                label="卸货平台"
                width="100"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.unloading">√</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="forklift"
                label="叉车"
                width="100"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.forklift">√</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="supervise"
                label="监管仓"
                width="100"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.supervise">√</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="transfer"
                label="中转仓"
                width="100"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.transfer">√</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="添加时间"
                width="170"
              >
                <template slot-scope="scope">
                  {{ formatTime(scope.row.createTime) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="状态"
                width="120"
              >
                <template slot-scope="scope">
                  <el-switch
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
                label="操作"
                width="230"
              >
                <template slot-scope="scope">
                  <el-button
                    v-permission="['warehouseSetService']"
                    type="text"
                    size="medium"
                    @click="settingService(scope.row)"
                  >
                    设置服务
                  </el-button>
                  <el-button
                    v-permission="['warehouseOutStockUpdate']"
                    type="text"
                    size="medium"
                    @click="handleEdit(scope.row)"
                  >
                    编辑
                  </el-button>
                  &nbsp;
                  <el-button
                    v-permission="['warehouseOutStockDel']"
                    type="text"
                    size="medium"
                    @click="handleDelete(scope.row.id)"
                  >
                    删除
                  </el-button>
                  &nbsp;
                  <el-button
                    v-permission="[
                      'warehouseScheduling',
                      'warehouseShiftPost',
                      'warehouseDischargingHatch',
                      'warehouseOperatingCenter',
                      'warehouseLocationManagement',
                      'warehouseTransferInfmt',
                      'warehouseClause',
                      'warehouseCustItemConfig'
                    ]"
                    type="text"
                    size="medium"
                    @click="handleMore(scope.row)"
                  >
                    更多
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :current-page="pageNumber"
              :page-size="pageSize"
              layout="total, prev, pager, next"
              :total="totalCount"
              style="text-align: right;"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
          <editForm
            ref="editForm"
            :is-edit="isEdit"
            :country-list="countryList"
            :attributes="attributes"
            :service-type-list="serviceTypes"
            :deliveries="deliveries"
            :cust-id="selectValue.custId"
            :cust-name="selectValue.custName"
            @getTableList="getTableList"
            @getCountryList="getCountryList"
            @getServiceTypeList="getServiceTypeList"
          />
        </div>
        <div v-else>
          <tabsData
            :ws-id="wsID"
            :ws-nm="wsNm"
            :ct-id="ctID"
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
import { Component, Vue, Watch } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import dayjs from 'dayjs'
import {
  getWHList,
  saveWHData,
  deleteWHData,
  changeWHStatus,
  getCountryList,
  getStateByCountry,
  getCityByState,
  getSupplierList,
  getServiceTypeList,
  getWordsList
} from '@/api/warehose-by-config'
import editForm from '@/views/warehose-management/warehouse-config/addEditForm.vue'
import tabsData from '@/views/warehose-management/warehouse-config/tabsData.vue'
import transferModal from '@/views/warehose-management/warehouse-config/transferModal.vue'

@Component({
  name: 'WarehouseConfig',
  components: {
    editForm,
    tabsData,
    transferModal
  }
})
export default class InstitutionalFramework extends Vue {
  private statusList: any[] = [
    {
      value: '0',
      name: '禁用'
    },
    {
      value: '1',
      name: '启用'
    }
  ]
  private attributes: any[] = [
    {
      name: '普货',
      id: '0'
    },
    {
      name: '纯电',
      id: '1'
    },
    {
      name: '带电',
      id: '2'
    },
    {
      name: '带磁',
      id: '3'
    },
    {
      name: '危险',
      id: '4'
    }
  ]
  private configuration: any[] = [
    {
      value: '0',
      name: '有卸货平台'
    },
    {
      value: '1',
      name: '无卸货平台'
    },
    {
      value: '2',
      name: '有叉车'
    },
    {
      value: '3',
      name: '无叉车'
    }
  ]
  private properties: any[] = [
    {
      value: '0',
      name: '是监管仓'
    },
    {
      value: '1',
      name: '非监管仓'
    },
    {
      value: '2',
      name: '是中转仓'
    },
    {
      value: '3',
      name: '非中转仓'
    }
  ]
  private serviceTypes: any[] = []
  private deliveries: any[] = [
    {
      name: '快递',
      id: '0'
    },
    {
      name: '卡车',
      id: '1'
    },
    {
      name: '自提',
      id: '2'
    }
  ]
  private props: any = {
    label: 'name',
    value: 'id'
  }
  private weightList: any[] = []
  private countryList: any[] = []
  private supplierList: any[] = []
  private tableData: any[] = []
  private selectValue: any = {
    name: undefined,
    countryId: undefined,
    categories: '',
    categoryList: [],
    id: undefined,
    status: undefined,
    stateId: undefined,
    cityId: undefined,
    wareAttr: undefined,
    wareConfig: undefined,
    unloading: undefined,
    forklift: undefined,
    transfer: undefined,
    supervise: undefined,
    custId: undefined,
    custName: undefined
  }
  private pageSize: number = 10
  private pageNumber: number = 1
  private totalCount: number = 0
  private isEdit: boolean = false
  private loading: boolean = false
  private selectLoading = false
  private stateList: any[] = []
  private cityList: any[] = []
  private isMoreShow: boolean = true
  private wsID: string = ''
  private wsNm: string = ''
  private ctID: string = ''
  // ---computed---
  // 所属公司id
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }
  // 所属公司Name
  get custName(): string {
    const info = UserModule.info || {}
    const custName = (info as any).custName
    return custName
  }

  /** methods */
  private getWordsList() {
    const params:any = {
      type: 'weight_type'
    }
    getWordsList(params)
      .then((res: any) => {
        const data = res.data || []
        this.weightList = data
      }).catch((err: any) => {
        return err
      })
  }
  private filterUnit(val: any) {
    let name
    if (val) {
      this.weightList.map((it: any) => {
        if (it.value === val) {
          name = `${it.value}(${it.label})`
        }
      })
    }
    return name || ''
  }
  // 商品属性
  // private selectCategories(val: any) {
  //   this.selectValue.categories = []
  //   val.map((itemV: any) => {
  //     const res = this.attributes.find(item => item.id === itemV)
  //     this.selectValue.categories.push(res)
  //   })
  // }
  private settingService(row: any) {
    (this.$refs.transferModal as any).showModel(row)
  }

  private selectwareConfig(val: any) {
    switch (val) {
      case '0':
        this.selectValue.unloading = true
        this.selectValue.forklift = undefined
        break
      case '1':
        this.selectValue.unloading = false
        this.selectValue.forklift = undefined
        break
      case '2':
        this.selectValue.forklift = true
        this.selectValue.unloading = undefined
        break
      case '3':
        this.selectValue.forklift = false
        this.selectValue.unloading = undefined
        break
      default:
        this.selectValue.forklift = undefined
        this.selectValue.unloading = undefined
        break
    }
  }
  private selectwareAttr(val: any) {
    switch (val) {
      case '0':
        this.selectValue.supervise = true
        this.selectValue.transfer = undefined
        break
      case '1':
        this.selectValue.supervise = false
        this.selectValue.transfer = undefined
        break
      case '2':
        this.selectValue.transfer = true
        this.selectValue.supervise = undefined
        break
      case '3':
        this.selectValue.transfer = false
        this.selectValue.supervise = undefined
        break
      default:
        this.selectValue.transfer = undefined
        this.selectValue.supervise = undefined
        break
    }
  }
  private async getServiceTypeList() {
    const custType: any = '1'
    const params = {
      custType
    }

    await getServiceTypeList(params)
      .then((res: any) => {
        this.serviceTypes = res.data || []
      })
      .catch((err: any) => {
        return err
      })
  }
  // 获取国家列表
  private async getCountryList() {
    this.selectLoading = true
    await getCountryList()
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
  private onSupplier(val: any) {
    this.selectValue.custName = undefined
    this.supplierList.map((it: any) => {
      if (it.id === this.selectValue.custId) {
        this.selectValue.custName = it.name
      }
    })
    this.getTableList(1)
  }
  // 获取供应商列表
  private getSupplierList() {
    const params = {
      page: 1,
      size: 9999,
      parentId: (this as any).custId,
      types: '04'
    }
    getSupplierList(params).then((res:any) => {
      const data = res.data || {}
      const result = data.result || []
      this.supplierList = result
      this.selectValue.custId = result[0].id
      this.selectValue.custName = result[0].name
      this.getTableList()
    }).catch((err:any) => {
      return err
    })
  }

  private formatData(arr: any) {
    arr.forEach((item: any) => {
      if (
        item.children &&
        Array.isArray(item.children) &&
        item.children.length === 0
      ) {
        delete item.children
      } else {
        this.formatData(item.children)
      }
    })
    return arr
  }

  private handleAdd() {
    this.isEdit = false
    const formDialog = this.$refs.editForm as any
    this.$nextTick(() => {
      formDialog.init()
    })
  }
  private handleEdit(row: any) {
    this.isEdit = true
    const formDialog = this.$refs.editForm as any
    this.$nextTick(() => {
      formDialog.init(row)
    })
  }

  private handleMore(row: any) {
    this.isMoreShow = false
    this.wsID = row.id
    this.wsNm = row.name
    this.ctID = this.selectValue.custId
  }
  private handleBack(row: any) {
    this.isMoreShow = true
  }

  // 监听仓库状态改变
  private async onStatus(row: any, value: any): Promise<void> {
    if (!row.status || row.status === value) {
      return
    }
    const text = value === '0' ? '禁用' : '开启'
    const [cancel, confirm] = await this.$confirm(
      `此操作将${text}该仓库，是否继续？`,
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
    changeWHStatus({
      id: row.id,
      status: value
    })
      .then(res => {
        this.$message.success('修改成功')
        this.getTableList()
      })
      .catch(err => {
        return err
      })
  }

  private handleDelete(id: any): void {
    this.$confirm('此操作将永久删除该数据, 是否继续?', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        const params = { id }
        deleteWHData(params)
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getTableList()
          })
          .catch(err => {
            return [err, null]
          })
      })
      .catch(err => {
        return [err, null]
      })
  }

  private formatTime(time: any) {
    return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
  }

  // 获取列表
  private getTableList(val?: any): void {
    this.loading = true
    if (val) {
      this.pageNumber = val
    }
    getWHList({
      model: {
        ...this.selectValue
      },
      page: this.pageNumber,
      size: this.pageSize
    })
      .then((res: any) => {
        this.loading = false
        const { data } = res
        this.totalCount = data.total
        this.tableData = data.result || []
      })
      .catch(() => {
        this.loading = false
      })
  }

  private handleSizeChange(val: number) {
    this.pageSize = val
    this.getTableList()
  }
  private handleCurrentChange(val: number) {
    this.pageNumber = val
    this.getTableList()
  }
  private async created() {
    if (this.custId !== '0') {
      this.selectValue.custId = this.custId
      this.selectValue.custName = this.custName
      this.getTableList()
    } else {
      this.getSupplierList()
    }
    this.getWordsList()
    await this.getServiceTypeList()
    await this.getCountryList()
  }
}
</script>

<style lang="scss" scoped>
.panel-info {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #e8e8e8;
  border-radius: 5px 5px 0 0;
  h3 {
    color: #909399;
    font-weight: 400;
    font-size: 16px;
    flex: 1;
  }
}
</style>
