<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        v-show="!addEditForm"
        class="app-container"
      >
        <headInfoWithBack
          info=""
          title="快递服务"
          :show-back="(startlocationFlag||endlocationFlag||distinctFlag)"
          @goback="goBack"
        />
        <div
          v-if="!(startlocationFlag || endlocationFlag || distinctFlag)"
          class="app-panel"
        >
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-button
                v-permission="['addDelivery']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="float: left;"
                @click="handleAdd"
              >
                新增服务
              </el-button>
              <el-select
                v-model="searchForm.countryId"
                :loading="selectLoading"
                placeholder="起运国"
                size="small"
                clearable
                filterable
                style="width:130px;margin-right:5px;"
                @focus="getCountryList"
                @change="onCountry"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="searchForm.expressId"
                :disabled="!searchForm.countryId"
                :loading="selectLoading"
                placeholder="快递公司"
                size="small"
                clearable
                filterable
                style="width:130px;margin-right:5px;"
                @focus="getExpressCompanyList"
                @change="clearCode"
              >
                <el-option
                  v-for="item in orgIdList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="searchForm.subtypeId"
                :loading="selectLoading"
                placeholder="服务类型"
                size="small"
                clearable
                filterable
                style="width:130px;margin-right:5px;"
                @focus="getSubtypeList"
                @change="clearCode"
              >
                <el-option
                  v-for="item in subtypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-input
                v-model="searchForm.name"
                size="small"
                clearable
                style="width:200px;margin-right:10px;"
                placeholder="请输入服务名称"
              />
              <el-button
                v-permission="['queryDelivery']"
                type="primary"
                size="small"
                @click="getTableList(1)"
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
              label="服务名称"
              min-width="180"
            />
            <el-table-column
              fixed="left"
              prop="expressCode"
              label="服务编码"
              min-width="150"
            />
            <el-table-column
              prop="abbr"
              label="服务简称"
              min-width="150"
            />

            <el-table-column
              label="服务类型"
              min-width="120"
            >
              <template slot-scope="scope">
                {{ scope.row.subtypeId === '0' ?
                  '本地快递' : scope.row.subtypeId === '1' ?
                    '国际快递(重量)' : scope.row.subtypeId === '2' ?
                      '国际快递(箱数)' : ''
                }}
              </template>
            </el-table-column>

            <el-table-column
              label="起运地代码"
              width="130"
            >
              <div
                slot-scope="scope"
                style="display: flex;align-items: center"
              >
                <span
                  v-if="scope.row.subtypeId === '0'"
                  style="font-size: 30px;margin-right: 5px"
                >
                  <strong>
                    <span
                      v-if="scope.row.zonesConfiged"
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
                  v-if="scope.row.subtypeId === '0'"
                  :disabled="!$checkPermission(['updateCodeDelivery'])"
                  type="text"
                  @click="setUpCode(scope.row)"
                >
                  设置代码
                </el-button>
                <div v-else>
                  --
                </div>
              </div>
            </el-table-column>
            <el-table-column
              label="目的地代码"
              width="130"
            >
              <div
                slot-scope="scope"
                style="display: flex;align-items: center"
              >
                <span style="font-size: 30px;margin-right: 5px">
                  <strong>
                    <span
                      v-if="scope.row.zonedConfiged"
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
                  v-if="scope.row.subtypeId === '1' || scope.row.subtypeId === '2'"
                  :disabled="!$checkPermission(['deliveryDist'])"
                  type="text"
                  @click="setDist(scope.row)"
                >
                  国际分区
                </el-button>
                <el-button
                  v-else
                  type="text"
                  :disabled="!$checkPermission(['updateCodeDelivery'])"
                  @click="setDownCode(scope.row)"
                >
                  设置代码
                </el-button>
              </div>
            </el-table-column>
            <el-table-column
              label="目的地/区域"
              width="130"
            >
              <div
                slot-scope="scope"
                style="display: flex;align-items: center"
              >
                <span
                  v-if="scope.row.subtypeId === '0'"
                  style="font-size: 30px;margin-right: 5px"
                >
                  <strong>
                    <span
                      v-if="scope.row.destinationConfiged"
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
                  v-if="scope.row.subtypeId === '0'"
                  type="text"
                  @click="setArea(scope.row)"
                >
                  目的地/区域
                </el-button>
                <div v-else>
                  --
                </div>
              </div>
            </el-table-column>
            <el-table-column
              label="设置计费"
              width="120"
            >
              <div
                slot-scope="scope"
                style="display: flex;align-items: center"
              >
                <span style="font-size: 30px;margin-right: 5px">
                  <strong>
                    <span
                      v-if="scope.row.chargingConfiged"
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
                  type="text"
                  @click="setCharge(scope.row)"
                >
                  设置计费
                </el-button>
              </div>
            </el-table-column>
            <el-table-column
              width="120"
              label="特殊配置"
            >
              <div
                slot-scope="scope"
                style="display: flex;align-items: center"
              >
                <span style="font-size: 30px;margin-right: 5px">
                  <strong>
                    <span
                      v-if="scope.row.addressConfiged"
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
                  :disabled="!$checkPermission(['specialConfig'])"
                  type="text"
                  @click="handleSpecial(scope.row)"
                >
                  特殊配置
                </el-button>
              </div>
            </el-table-column>
            <el-table-column
              width="150"
              label="关联代理商"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="!$checkPermission(['associatedAgents'])"
                  type="text"
                  @click="handleAgent(scope.row)"
                >
                  关联代理商
                </el-button>
              </template>
            </el-table-column>

            <el-table-column
              prop="createTime"
              label="添加时间"
              width="180"
            />

            <el-table-column
              label="启用状态"
              fixed="right"
              width="120"
            >
              <template slot-scope="scope">
                <el-switch
                  :disabled="!$checkPermission(['deliveryEnable'])"
                  style="margin-left: 10px;"
                  class="switchStyle"
                  active-text="启用"
                  inactive-text="禁用"
                  :active-value="1"
                  :inactive-value="0"
                  :value="scope.row.status"
                  @input="(value) => handleSwitch(scope.row, value)"
                />
              </template>
            </el-table-column>

            <el-table-column
              fixed="right"
              label="操作"
              width="180px"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['deliveryCopy']"
                  type="text"
                  @click="handleCopy(scope.row)"
                >
                  复制
                </el-button>
                <el-button
                  v-permission="['updateDelivery']"
                  type="text"
                  @click="handleEdit(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['deleteDelivery']"
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
        <div v-if="startlocationFlag">
          <location-code
            ref="startLocationCode"
            type="start"
          />
        </div>
        <div v-if="endlocationFlag">
          <location-code
            ref="endLocationCode"
            type="end"
          />
        </div>
        <div v-if="distinctFlag">
          <distinct
            ref="distinct"
          />
        </div>
      </div>
      <div
        v-show="addEditForm"
        class="app-container"
      >
        <addEditForm
          ref="addEditForm"
          :is-edit="isEdit"
          :is-copy="isCopy"
          :country-list="countryList"
          :type-list="subtypeList"
          @back="addEditForm = false"
          @go="saveForm"
        />
      </div>
    </div>

    <!-- 穿梭框 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogAgent"
      :close-on-click-modal="false"
      width="960px"
      @close="closeAgent"
    >
      <div v-loading="dialogLoading">
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
            @click="closeAgent"
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
      :title="title"
      :visible.sync="dialogSpecial"
      :close-on-click-modal="false"
      width="960px"
      @close="closeSpecial"
    >
      <div v-loading="dialogLoading">
        <el-transfer
          ref="transferItem"
          v-model="selectSpecial.list"
          filterable
          :filter-method="filterMethod"
          :titles="['选择排除仓库', '已排除仓库']"
          :props="{key: 'id', label: 'name'}"
          filter-placeholder="输入搜索"
          :data="warehouseList"
          style="height: 500px;"
        />

        <div
          slot="footer"
          style="text-align: right;margin: 20px 40px 0;"
        >
          <el-button
            size="small"
            @click="closeSpecial"
          >
            取 消
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="setSpecialConfirm"
          >
            确 定
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :title="title"
      :visible.sync="dialogArea"
      :close-on-click-modal="false"
      width="960px"
      @closed="closeArea"
    >
      <div v-loading="dialogLoading">
        <el-row style="margin-bottom: 20px;">
          <el-col
            :span="12"
            style="text-align: center;"
          >
            <span class="is-required">地址类型：</span>
            <el-select
              v-model="dialogForm.yType"
              :loading="selectLoading"
              size="mini"
              filterable
              clearable
              placeholder="请选择"
              style="width: 200px;"
              @change="onAddress"
            >
              <el-option
                v-for="item in addressList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-col>
          <el-col
            v-if="dialogForm.yType !== '0' && dialogForm.yType !== '102'"
            :span="12"
            style="text-align: center;"
          >
            <span class="is-required">国家：</span>
            <el-select
              v-model="dialogForm.countryId"
              :loading="selectLoading"
              size="mini"
              clearable
              filterable
              placeholder="请选择"
              style="width: 200px;"
              @focus="getCountryList"
              @change="onAreaCountry"
            >
              <el-option
                v-for="item in countryList"
                :key="item.id"
                :label="`${item.name}-${item.alias}`"
                :value="item.id"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-transfer
          ref="transferCountry"
          v-model="options"
          filterable
          :filter-method="filterMethod"
          :titles="[`选择${title}`, '已选择']"
          :props="{key: 'id', label: 'name'}"
          filter-placeholder="输入搜索"
          :data="areaList"
          style="height: 450px;"
        />
        <div
          slot="footer"
          style="text-align: right;margin: 20px 40px 0;"
        >
          <el-button
            type="primary"
            size="small"
            @click="saveArea"
          >
            保存
          </el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogWeight"
      :close-on-click-modal="false"
      width="960px"
      class="dialog-price"
      @closed="closeWeight"
    >
      <div slot="title">
        <p>
          {{ '选择' + title }}
        </p>
        <p style="font-size: 14px;color: #606266;">
          {{ text }}
        </p>
      </div>
      <div v-loading="dialogLoading">
        <div style="text-align: right;">
          <el-button
            type="text"
            size="small"
            @click="onCopy('copy')"
          >
            复制
          </el-button>
          <el-button
            type="text"
            size="small"
            style="margin-right: 40px;"
            @click="onCopy('paste')"
          >
            粘贴
          </el-button>
        </div>
        <el-form
          ref="dialogItem"
          :model="dialogItem"
          label-width="120px"
          label-position="right"
          size="small"
          class="dialog-form"
        >
          <el-form-item
            label="重量范围"
            prop="sections"
            style="width: 80%;display: inline-block;"
            class="is-required"
          >
            <div
              v-for="(item, index) in dialogItem.sections"
              :key="index"
              class="item-after-icon"
            >
              <el-input-number
                v-model="dialogItem.sections[index].lower"
                class="input-number-valiate"
                style="width: 45%;"
                :controls="false"
                placeholder="输入下限"
                :min="0"
                :max="999999"
                :step="1"
                step-strictly
              />
              <el-input-number
                v-model="dialogItem.sections[index].upper"
                class="input-number-valiate"
                style="width: 45%;"
                :controls="false"
                placeholder="输入上限"
                :min="0"
                :max="999999"
                :step="1"
                step-strictly
              />
              <span>
                <i
                  v-if="index===0"
                  class="el-icon-circle-plus-outline item-icon-plus"
                  @click="addRangeData"
                />
                <i
                  v-else
                  class="el-icon-remove-outline item-icon-reduce"
                  @click="deleteRangeData(index)"
                />
              </span>
            </div>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          style="text-align: right;margin: 20px 40px 0;"
        >
          <el-button
            type="primary"
            size="small"
            @click="saveWeight"
          >
            保存
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { DataModule } from '@/store/modules/data'
import addEditForm from '@/views/service-configuration/express/components/addEditForm.vue'
import locationCode from '@/views/service-configuration/express/components/locationCode.vue'
import headInfoWithBack from '@/views/service-configuration/express/components/headInfoBack.vue'
import distinct from '@/views/service-configuration/express/components/distinct.vue'
import {
  getExpressCompany,
  getEscList,
  deleteEsc,
  getAgentsById,
  saveAgent,
  changeStatus,
  getCountryList,
  getServiceSubtypeList,
  getCustTypeList,
  getFbastoreList,
  getSpecialById,
  saveSpecial,
  getAllAreaList,
  getRegionList,
  getStateByCountry,
  savePriceConfig,
  getPriceConfig
} from '@/api/service-with-express-service'
import { getAgentList } from '@/api/jht-agent-management'

@Component({
  name: 'expressService',
  components: {
    addEditForm,
    locationCode,
    headInfoWithBack,
    distinct
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private text: string = '(取值范围：>=起始值， <结束值)'
  private searchForm: any = {
    countryId: undefined, // 所在国家
    code: undefined, // 服务编码
    subtypeId: undefined, // 服务类型
    name: undefined, // 服务名称
    expressId: undefined // 快递公司
  }
  private dialogForm: any = {
    yType: '0',
    countryId: ''
  }
  private dialogItem: any = {
    sections: [{
      lower: undefined,
      upper: undefined
    }]
  }
  private addressList: any[] = []
  private options: any[] = []
  private areaList: any[] = []
  private orgIdList: any[] = []
  private countryList: any[] = []
  private codeList: any[] = []
  private agentList: any[] = []
  private warehouseList: any[] = []
  private selectAgents: any[] = []
  private selectSpecial: any = {
    countryId: undefined,
    list: []
  }
  private specialList: any[] = []
  private currentServiceId = ''
  private loading: boolean = false
  private addEditForm: boolean = false
  private title = ''
  private isEdit: boolean = false
  private isCopy: boolean = false
  private dialogAgent: boolean = false
  private dialogSpecial: boolean = false
  private dialogLoading: boolean = false
  private dialogArea: boolean = false
  private dialogWeight: boolean = false
  private selectLoading: boolean = false
  private tableData: any[] = []
  private subtypeList: any[] = []
  private startlocationFlag:boolean = false
  private endlocationFlag:boolean = false
  private distinctFlag:boolean = false
  private total = 0
  private page = 1
  private size = 10

  // computed
  // 所属公司id
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }
  get expressId() {
    return DataModule.expressId
  }
  /* methods */
  // 获取国家列表
  private getCountryList() {
    this.selectLoading = true
    getCountryList()
      .then((res: any) => {
        const data = res.data || {}
        this.countryList = data.result || []
        if (this.dialogForm.yType === '0') {
          this.areaList = data.result || []
        }
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private onCountry() {
    this.searchForm.expressId = undefined
    this.orgIdList = []
    this.searchForm.code = undefined
    this.codeList = []
  }
  //  获取快递公司列表
  private getExpressCompanyList() {
    this.selectLoading = true
    const params = {
      page: 1,
      size: 99999,
      countryId: this.searchForm.countryId,
      type: '4'
    }
    getExpressCompany(params).then(res => {
      const data = res.data || {}
      this.orgIdList = data.result || []
      this.selectLoading = false
    }).catch((err:any) => {
      this.selectLoading = false
      return err
    })
  }
  private clearCode() {
    this.searchForm.code = undefined
    this.codeList = []
  }
  // 获取服务小类
  private getSubtypeList() {
    this.selectLoading = true
    const params = {
      typeId: '00'
    }

    getServiceSubtypeList(params)
      .then((res: any) => {
        this.subtypeList = res.data || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  // 查询列表
  private getTableList(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const params: any = {
      page: this.page,
      size: this.size,
      model: {
        custId: (this as any).custId,
        ...this.searchForm
      }
    }
    getEscList(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        const { total, result } = data
        this.total = total
        this.tableData = result
      })
      .catch(err => {
        this.loading = false
        return err
      })
  }

  private handleAdd(): void {
    // 新增
    this.addEditForm = true
    this.isEdit = false
    this.isCopy = false
    const root: any = this.$refs.addEditForm
    root.add()
  }
  private handleEdit(row: any): void {
    // 编辑
    this.addEditForm = true
    this.isEdit = true
    this.isCopy = false
    const root: any = this.$refs.addEditForm
    root.setData(row)
  }
  private handleCopy(row: any): void {
    this.addEditForm = true
    this.isEdit = true
    this.isCopy = true
    const root: any = this.$refs.addEditForm
    root.setData(row)
  }
  private saveForm() {
    this.addEditForm = false
    this.getTableList()
  }
  private handleDelete(row: any): void {
    // 删除
    const params = {
      id: row.id,
      tag: 'delete'
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        changeStatus(params)
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

  // 地址类型
  private setArea(row: any) {
    const { id, name, subtypeId } = row
    this.currentServiceId = id
    this.title = '地址类型'
    this.addressList = [
      { name: '国家', id: '0' },
      { name: '国内区域', id: '5' },
      { name: '城市区域', id: '100' },
      { name: '国家区域', id: '102' },
      { name: '州省', id: '1' }
    ]
    this.dialogForm.xy = 'Y'
    this.dialogForm.service = {
      key: id,
      value: name
    }
    const subtypeName = subtypeId === '0'
      ? '本地快递' : subtypeId === '1'
        ? '国际快递(重量)' : subtypeId === '2'
          ? '国际快递(箱数)' : ''
    this.dialogForm.serviceSubtype = {
      key: subtypeId,
      value: subtypeName
    }
    this.dialogArea = true
    this.getPriceConfig('area')
  }

  private onAddress() {
    this.options = []
    this.areaList = []
    this.dialogForm.countryId = undefined
    if (this.dialogForm.yType === '0') {
      this.getCountryList()
    } else if (this.dialogForm.yType === '102') {
      this.getAreaList(2)
    }
  }
  private onAreaCountry() {
    const type = this.dialogForm.yType
    switch (type) {
      case '0':
        this.getCountryList()
        break
      case '5':
        this.getRegionList()
        break
      case '1':
        this.getStateByCountry()
        break
      case '7':
        this.getFbastoreList().catch((err: any) => err)
        break
      case '100':
        this.getAreaList(1)
        break
      case '101':
        this.getAreaList(3)
        break
      case '102':
        this.getAreaList(2)
        break
      default:
        this.areaList = []
        this.options = []
        this.dialogLoading = false
        break
    }
  }
  private getAreaList(type: any) {
    const params = {
      model: {
        type,
        countryId: this.dialogForm.countryId
      },
      page: 1,
      size: 999
    }
    this.dialogLoading = true
    getAllAreaList(params).then((res: any) => {
      this.dialogLoading = false
      if (res.success) {
        const data = res.data || {}
        const result = data.result || []
        this.areaList = result.map((item: any) => {
          return {
            id: item.id + '',
            name: item.name
          }
        })
      }
    }).catch((err: any) => {
      this.dialogLoading = false
      return err
    })
  }
  private getStateByCountry() {
    this.dialogLoading = true
    getStateByCountry(this.dialogForm.countryId)
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result || []
        this.areaList = result
        this.dialogLoading = false
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }
  private getRegionList() {
    this.dialogLoading = true
    const params: any = {
      countryId: this.dialogForm.countryId,
      page: 1,
      size: 9999
    }
    getRegionList(params)
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result || []
        this.areaList = result
        this.dialogLoading = false
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }
  private closeArea() {
    this.dialogForm = {
      yType: '0',
      countryId: ''
    }
    this.areaList = []
    this.options = []
    this.dialogArea = false
    const root: any = this.$refs.transferCountry
    root.clearQuery('left')
    root.clearQuery('right')
  }
  private saveArea() {
    const { countryId, yType, ...form } = this.dialogForm
    const params: any = {
      serviceType: {
        key: '00',
        value: '快递'
      },
      ...form,
      yType
    }
    const axisY: any[] = []
    this.options.map((it: any) => {
      const item = this.areaList.find((l: any) => l.id === it) || {}
      const itemC = this.countryList.find((c: any) => c.id === countryId) || {}
      if (item.id && item.name) {
        axisY.push({
          type: yType,
          country: {
            key: countryId,
            value: itemC.name
          },
          keyValue: {
            key: item.id,
            value: item.name
          }
        })
      }
    })
    params.keyValues = axisY
    this.dialogLoading = true
    savePriceConfig(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.dialogLoading = false
        this.closeArea()
        this.getTableList()
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }
  private onCopy(val: string) {
    if (val === 'copy') { // 复制
      DataModule.ChangeExpressId(this.currentServiceId)
    } else if (val === 'paste') { // 粘贴
      this.currentServiceId = (this as any).expressId
      this.getPriceConfig('weight', 'paste')
    }
  }
  private getPriceConfig(str: string, val?: string) {
    this.dialogLoading = true
    const params: any = {
      serviceId: this.currentServiceId,
      xy: str === 'area' ? this.dialogForm.xy : this.dialogItem.xy,
      serviceType: '00'
    }
    getPriceConfig(params)
      .then((res: any) => {
        const result = res.data || []
        this.dialogLoading = false
        if (Array.isArray(result) && result.length <= 0) {
          return
        }
        const data = result[0] || {}
        const { keyValues, ranges, id, yType } = data
        if (str === 'area') { // 地址
          this.dialogForm.id = id
          this.dialogForm.yType = yType
          this.options = []
          keyValues.map((it: any) => {
            this.dialogForm.countryId = (it.country || {}).key
            this.options.push((it.keyValue || {}).key)
          })
          this.onAreaCountry()
          if (yType !== '0') {
            this.getCountryList()
          }
        } else if (str === 'weight') { // 区间
          this.dialogItem.id = val === 'paste' ? undefined : id
          const arr = [{
            lower: undefined,
            upper: undefined
          }]
          if (Array.isArray(ranges) && ranges.length > 0) {
            const brr = ranges.map((it: any) => {
              return it.upperLower
            })
            this.dialogItem.sections = brr
          } else {
            this.dialogItem.sections = arr
          }
        }
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }
  // 重量区间
  private setCharge(row: any) {
    const { id, name, subtypeId } = row
    this.currentServiceId = id
    this.title = '重量区间'
    this.dialogItem.xType = '0'
    this.dialogItem.xy = 'X'
    this.dialogItem.service = {
      key: id,
      value: name
    }
    const subtypeName = subtypeId === '0'
      ? '本地快递' : subtypeId === '1'
        ? '国际快递(重量)' : subtypeId === '2'
          ? '国际快递(箱数)' : ''
    this.dialogItem.serviceSubtype = {
      key: subtypeId,
      value: subtypeName
    }
    this.dialogWeight = true
    this.getPriceConfig('weight')
  }
  private rangeValidate(range: any[]) {
    const arrVal = range.every((item: any) => (item.lower === 0 || item.lower) && item.upper)
    if (!arrVal) {
      this.$message.error('请完整填写区间值')
      return false
    }
    const isMinMax = range.some((item:any) => {
      return item.upper <= item.lower
    })
    if (isMinMax) {
      this.$message({
        type: 'error',
        message: '下限值不能大于等于上限值'
      })
      return false
    }
    let mixVal = false
    range.map((it: any, index: any) => {
      mixVal = range.some((r: any, i: any) => {
        if (index !== i) {
          return (r.lower <= it.lower && it.lower < r.upper) || (r.lower < it.upper && it.upper <= r.upper)
        } else {
          return false
        }
      })
    })
    if (mixVal) {
      this.$message({
        type: 'error',
        message: '区间范围不能重叠'
      })
      return false
    }
    let flag = false
    for (let i = 0; i < range.length; i++) {
      if (i > 0) {
        const next = range[i]
        const item = range[i - 1]
        if (next.lower !== item.upper) {
          flag = true
          break
        }
      }
    }
    if (flag) {
      this.$message({
        type: 'error',
        message: '区间范围必须连续'
      })
      return false
    }
    return true
  }
  private addRangeData() {
    this.dialogItem.sections.push({
      lower: undefined,
      upper: undefined
    })
  }
  private deleteRangeData(index: number) {
    this.dialogItem.sections.splice(index, 1)
  }
  private closeWeight() {
    this.dialogItem = {
      sections: [{
        lower: undefined,
        upper: undefined
      }]
    }
    this.currentServiceId = ''
    this.dialogWeight = false
  }
  private saveWeight() {
    const { sections, xType, ...form } = this.dialogItem
    const params: any = {
      serviceType: {
        key: '00',
        value: '快递'
      },
      ...form
    }
    const isBool = this.rangeValidate(sections)
    if (!isBool) return
    const axisX: any[] = []
    sections.map((it: any) => {
      axisX.push({
        type: xType,
        upperLower: it
      })
    })
    params.ranges = axisX
    this.dialogLoading = true
    savePriceConfig(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.dialogLoading = false
        this.closeWeight()
        this.getTableList()
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }

  // 设置起始地代码
  private setUpCode(row:any) :void{
    this.startlocationFlag = true
    this.$nextTick(() => {
      (this.$refs.startLocationCode as any).init(row)
    })
  }
  // 设置目的地代码
  private setDownCode(row:any) :void{
    this.endlocationFlag = true
    this.$nextTick(() => {
      (this.$refs.endLocationCode as any).init(row)
    })
  }
  // 国际区分
  private setDist(row:any) :void{
    this.distinctFlag = true
    this.$nextTick(() => {
      (this.$refs.distinct as any).init(row)
    })
  }
  private goBack() {
    this.startlocationFlag = false
    this.endlocationFlag = false
    this.distinctFlag = false
    this.getTableList()
  }

  // 获取代理商列表
  private getCustTypeList(id: string) {
    const params = {
      page: 1,
      size: 9999,
      cas: 'A',
      typeId: '00',
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
  // 获取代理商列表
  private getAgentList() {
    const params = {
      page: 1,
      size: 9999,
      status: 1,
      parentId: (this as any).custId
    }
    return getAgentList(params).then(res => {
      const data = res.data || {}
      this.agentList = data.result || []
    }).catch(err => {
      return err
    })
  }
  private closeAgent() {
    this.dialogAgent = false
    this.agentList = []
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
  }
  // 设置关联代理商
  private setAgentConfirm() {
    this.dialogLoading = true
    const agents = this.selectAgents
    const params: any = {
      agents,
      id: this.currentServiceId
    }
    saveAgent(params)
      .then(res => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.dialogLoading = false
        this.closeAgent()
        this.getTableList()
      })
      .catch(err => {
        this.dialogLoading = false
        return err
      })
  }
  // 关联代理商
  private handleAgent(row: any) {
    this.title = '关联代理商' + '【' + row.name + '】'
    this.dialogAgent = true
    this.currentServiceId = row.id
    this.dialogLoading = true
    const params = {
      escId: row.id
    }
    Promise.all([this.getAgentById(params), this.getCustTypeList((row || {}).subtypeId)]).then(r => {
      this.dialogLoading = false
    })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }

  private getAgentById(params: any) {
    return getAgentsById(params)
      .then((res: any) => {
        const result: any = res.data || []
        this.selectAgents = result
      })
      .catch((err: any) => {
        return err
      })
  }

  private handleSpecial(row: any) {
    this.title = '排除仓库配置' + '【' + row.name + '】'
    this.dialogSpecial = true
    this.currentServiceId = row.id
    this.dialogLoading = true
    const params = {
      escId: row.id
    }
    const { esEntity } = row
    this.selectSpecial.countryId = (esEntity || {}).countryId
    Promise.all([this.getSpecialById(params), this.getFbastoreList()]).then(r => {
      this.dialogLoading = false
    })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }
  private getFbastoreList() {
    this.dialogLoading = true
    const params = {
      page: 1,
      size: 99999,
      codeSort: 'A',
      countryId: this.selectSpecial.countryId
    }
    return getFbastoreList(params).then(res => {
      const data = res.data || {}
      const arr = data.result || []
      this.warehouseList = arr.map((it: any) => {
        return {
          id: it.id,
          name: it.code + '-' + it.address
        }
      })
      this.dialogLoading = false
    }).catch(err => {
      this.dialogLoading = false
      return err
    })
  }
  private getSpecialById(params: any) {
    return getSpecialById(params)
      .then((res: any) => {
        const result: any = res.data || []
        this.selectSpecial.list = result
        this.specialList = JSON.parse(JSON.stringify(result))
      })
      .catch((err: any) => {
        return err
      })
  }
  private closeSpecial() {
    this.dialogSpecial = false
    this.warehouseList = []
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
  }
  // 设置特殊配置
  private setSpecialConfirm() {
    this.dialogLoading = true
    const params: any = {
      list: this.selectSpecial.list || [],
      escId: this.currentServiceId
    }
    saveSpecial(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.dialogLoading = false
        this.closeSpecial()
        this.getTableList()
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }

  private filterMethod(query: any, item: any): boolean {
    return item.name.indexOf(query) > -1
  }

  private handleSwitch(row: any, value: any): void {
    // 开关
    const olds = row.status.toString()
    const news = value.toString()
    if (!olds || olds === news) {
      return
    }
    const params = {
      id: row.id
    }
    const text = news === '0' ? '禁用' : '开启'
    this.$confirm(`此操作将${text}该快递服务，是否继续？`, '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        changeStatus(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '更改成功'
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

  private handleSizeChange(size: any): any {
    this.size = size
    this.getTableList()
  }

  private handleCurrentChange(page: any): any {
    this.page = page
    this.getTableList()
  }

  private created(): void {
    this.getCountryList()
    this.getSubtypeList()
    this.getTableList()
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
.dialog-form {
  height: 400px;
  overflow-y: auto;
  .el-form-item {
    display: inline-block;
    vertical-align: top;
    width: 50%;
    margin-bottom: 10px;
  }
}
::v-deep .dialog-price .el-dialog__body {
  padding: 0 20px 30px;
}
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
.item-after-icon {
  position: relative;
  padding-bottom: 15px;
  .item-icon-plus {
    position: absolute;
    top: 6px;
    color:#409eff;
    font-size:18px;
    margin-left:10px;
    cursor:pointer;
  }
  .item-icon-reduce {
    position: absolute;
    top: 6px;
    color:#f56c6c;
    font-size:18px;
    margin-left:10px;
    cursor:pointer;
  }
}
</style>
