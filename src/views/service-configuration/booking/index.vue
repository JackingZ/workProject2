<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          v-show="!isEditFormShow"
          info=""
          title="订舱服务"
        />
        <div
          v-show="!isEditFormShow"
          class="app-panel"
        >
          <el-row>
            <el-col :span="4">
              <el-button
                v-permission="['bookingServiceAdd']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-left: 10px"
                @click="add"
              >
                新增服务
              </el-button>
            </el-col>
            <el-col
              :span="20"
              style="text-align:right;"
            >
              <el-select
                v-model="selectValue.conveyance"
                size="small"
                style="margin-right:10px;width: 130px;"
                placeholder="业务类型"
                clearable
                @change="onSVTool"
              >
                <el-option
                  v-for="item in tools"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select
                v-model="selectValue.countryFromId"
                :loading="selectLoading"
                placeholder="起运国"
                size="small"
                filterable
                clearable
                style="width:130px;margin-right:5px;"
                @focus="getCountryList"
                @change="onCountryFrom"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.portFrom"
                :disabled="!selectValue.conveyance || !selectValue.countryFromId"
                :loading="selectLoading"
                placeholder="起运港"
                size="small"
                clearable
                filterable
                style="width:130px;margin-right:5px;"
                @focus="getStartPortData"
              >
                <el-option
                  v-for="item in startPortList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.countryToId"
                :loading="selectLoading"
                placeholder="目的国"
                clearable
                filterable
                style="width:130px;margin-right:5px;"
                size="small"
                @focus="getCountryList"
                @change="onCountryTo"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.portsToId"
                :disabled="!selectValue.conveyance || !selectValue.countryToId"
                :loading="selectLoading"
                placeholder="目的港"
                size="small"
                clearable
                filterable
                style="width:130px;margin-right:5px;"
                @focus="getEndPortData"
              >
                <el-option
                  v-for="item in endPortList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>

              <el-select
                v-model="selectValue.transType"
                :disabled="!selectValue.conveyance"
                size="small"
                style="margin-right:10px;width: 130px;"
                placeholder="服务类型"
                clearable
              >
                <el-option
                  v-for="item in svTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
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
                    label="航线名称"
                    value="2"
                  />
                </el-select>
              </el-input>
              <el-button
                v-permission="['bookingServiceQuery']"
                type="primary"
                size="small"
                @click="queryAll(1)"
              >
                查询
              </el-button>
            </el-col>
          </el-row>

          <el-table
            ref="table"
            v-loading="loading"
            :data="tableData"
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              fixed="left"
              prop="name"
              label="航线名称"
              min-width="150"
              show-overflow-tooltip
            />
            <el-table-column
              fixed="left"
              prop="serviceCode"
              label="服务编码"
              min-width="120"
            />
            <el-table-column
              prop="conveyance"
              label="业务类型"
              width="100"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.conveyance === '0'">空运</span>
                <span v-else-if="scope.row.conveyance === '1'">海运</span>
                <span v-else-if="scope.row.conveyance === '2'">铁路</span>
                <span v-else-if="scope.row.conveyance === '4'">卡航</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="transType"
              label="服务类型"
              width="100"
            >
              <template slot-scope="scope">
                {{ formatTrans(scope.row.transType) }}
              </template>
            </el-table-column>

            <el-table-column
              prop="alias"
              label="航线简称"
              min-width="120"
              show-overflow-tooltip
            />

            <el-table-column
              prop="countryFromName"
              label="起运国"
              min-width="120"
            />
            <el-table-column
              prop="portsFromName"
              label="起运港"
              min-width="200"
              show-overflow-tooltip
            />
            <el-table-column
              prop="countryToName"
              label="目的国"
              min-width="120"
            />
            <el-table-column
              prop="portsToName"
              label="目的港"
              min-width="200"
              show-overflow-tooltip
            />
            <el-table-column
              min-width="150"
              label="航线服务商"
            >
              <div
                slot-scope="scope"
                style="display: flex;align-items: center"
              >
                <span style="font-size: 30px;margin-right: 5px">
                  <strong>
                    <span
                      v-if="scope.row.transConfiged"
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
                  :disabled="!$checkPermission(['bookingServiceServiceLineView'])"
                  type="text"
                  @click="showServiceLine(scope.row)"
                >
                  航线服务商
                </el-button>
              </div>
            </el-table-column>
            <el-table-column
              label="设置计费区间"
              width="120"
            >
              <div
                slot-scope="scope"
                style="display: flex;align-items: center"
              >
                <span
                  v-if="isChargeSide(scope.row.transType)"
                  style="font-size: 30px;margin-right: 5px"
                >
                  <strong>
                    <span
                      v-if="scope.row.axisRangeConfiged"
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
                  v-if="isChargeSide(scope.row.transType)"
                  :disabled="!$checkPermission(['bookingServiceChargeSide'])"
                  type="text"
                  @click="onChargeSide(scope.row)"
                >
                  设置计费区间
                </el-button>
                <span v-else>--</span>
              </div>
            </el-table-column>
            <el-table-column
              label="设置计费类型"
              width="120"
            >
              <div
                slot-scope="scope"
                style="display: flex;align-items: center"
              >
                <span
                  v-if="isChargeType(scope.row.transType)"
                  style="font-size: 30px;margin-right: 5px"
                >
                  <strong>
                    <span
                      v-if="scope.row.axisTypeConfiged"
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
                  v-if="isChargeType(scope.row.transType)"
                  :disabled="!$checkPermission(['bookingServiceChargeType'])"
                  type="text"
                  @click="onChargeType(scope.row)"
                >
                  设置计费类型
                </el-button>
                <span v-else>--</span>
              </div>
            </el-table-column>
            <el-table-column
              min-width="150"
              label="航线代理商"
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
                  :disabled="!$checkPermission(['bookingServiceAgent'])"
                  type="text"
                  @click="showServiceAgent(scope.row)"
                >
                  航线代理商
                </el-button>
              </div>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="启用状态"
              width="120"
            >
              <template slot-scope="scope">
                <el-switch
                  :value="scope.row.status"
                  :disabled="!$checkPermission(['bookingServiceEnable'])"
                  class="switchStyle"
                  active-text="启用"
                  inactive-text="禁用"
                  active-value="1"
                  inactive-value="0"
                  @input="(val) => onStatus(scope.row, val)"
                />
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="180"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['bookingServiceCopy']"
                  type="text"
                  @click="copy(scope.row)"
                >
                  复制
                </el-button>
                <el-button
                  v-permission="['bookingServiceUpdate']"
                  type="text"
                  @click="edit(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['bookingServiceDel']"
                  type="text"
                  @click="del(scope.row)"
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
            :title="lineTitle"
            width="1200px"
            :close-on-click-modal="false"
            :visible.sync="isServicerVisible"
            @closed="closeService"
          >
            <airline-service
              ref="airlineService"
              :st-id="stId"
              :country-service="countryService"
            />
          </el-dialog>
          <el-dialog
            title="关联代理商"
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
                :props="{key: 'id', label: 'name'}"
                filter-placeholder="输入搜索"
                :data="agentList"
                style="height: 400px;"
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
        </div>
        <add-edit-form
          v-show="isEditFormShow"
          ref="addEditForm"
          :is-edit="isEdit"
          :is-copy="isCopy"
          :tools="tools"
          @closeForm="closeForm"
        />
      </div>
    </div>
    <!-- 关联国家 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="960px"
      @closed="cancel"
    >
      <div slot="title">
        <p>
          {{ '选择' + title }}
        </p>
        <p
          v-if="isType !== 'three'"
          style="font-size: 14px;color: #606266;"
        >
          {{ text }}
        </p>
      </div>
      <div v-loading="dialogLoading">
        <el-form
          ref="dialogForm"
          :model="dialogForm"
          label-width="120px"
          label-position="right"
          size="small"
          class="dialog-form"
        >
          <div
            v-show="isType === 'one'"
            style="height: 400px;overflow-y: auto;"
          >
            <el-form-item
              label="区间范围"
              prop="sections"
              style="width: 80%;"
              class="is-required"
            >
              <div
                v-for="(item, index) in dialogForm.sections"
                :key="index"
                class="item-after-icon"
              >
                <el-input-number
                  v-model="dialogForm.sections[index].lower"
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
                  v-model="dialogForm.sections[index].upper"
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
          </div>
          <div
            v-show="isType === 'two'"
            style="height: 400px;overflow-y: auto;"
          >
            <el-form-item
              label="重量范围"
              prop="sections1"
              style="width: 49%;display: inline-block;"
              class="is-required"
            >
              <div
                v-for="(item, index) in dialogForm.sections1"
                :key="index"
                class="item-after-icon"
              >
                <el-input-number
                  v-model="dialogForm.sections1[index].lower"
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
                  v-model="dialogForm.sections1[index].upper"
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
                    @click="addRangeData1"
                  />
                  <i
                    v-else
                    class="el-icon-remove-outline item-icon-reduce"
                    @click="deleteRangeData1(index)"
                  />
                </span>
              </div>
            </el-form-item>
            <el-form-item
              label="方数范围"
              prop="sections2"
              style="width: 49%;display: inline-block;"
              class="is-required"
            >
              <div
                v-for="(item, index) in dialogForm.sections2"
                :key="index"
                class="item-after-icon"
              >
                <el-input-number
                  v-model="dialogForm.sections2[index].lower"
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
                  v-model="dialogForm.sections2[index].upper"
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
                    @click="addRangeData2"
                  />
                  <i
                    v-else
                    class="el-icon-remove-outline item-icon-reduce"
                    @click="deleteRangeData2(index)"
                  />
                </span>
              </div>
            </el-form-item>
          </div>
        </el-form>
        <div v-show="isType === 'three'">
          <el-transfer
            ref="transferItem"
            v-model="options"
            filterable
            :filter-method="filterMethod"
            :titles="[`选择${title}`, '已选择']"
            :props="{key: 'id', label: 'name'}"
            filter-placeholder="输入搜索"
            :data="list"
            style="height: 450px;"
          />
        </div>
        <div
          slot="footer"
          style="text-align: right;margin: 20px 40px 0;"
        >
          <el-button
            type="primary"
            size="small"
            @click="save"
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
import { AppModule } from '@/store/modules/app'

import {
  getBSCList,
  getCountryList,
  changeBookingStatus,
  delBooking,
  getAssociatedAgentList,
  saveAgent,
  getCustTypeList,
  getWordsList,
  getPriceConfig,
  savePriceConfig,
  getContainerList,
  getAviationList,
  getPortList
} from '@/api/service-with-booking-service'
import { getServiceSubtypeList } from '@/api/price-to-booking'
import addEditForm from '@/views/service-configuration/booking/components/addEditForm.vue'
import airlineService from '@/views/service-configuration/booking/components/AirlineServiceProvider.vue'

function paramsForm() {
  return {
    loadType: undefined,
    yType: undefined,
    xType: undefined,
    serviceSubtype: {
      key: undefined,
      value: undefined
    },
    service: {
      key: undefined,
      value: undefined
    },
    keyValues: [
      {
        country: {
          key: undefined,
          value: undefined
        },
        keyValue: {
          key: undefined,
          value: undefined
        }
      }
    ],
    ranges: [
      {
        keyValue: {
          key: undefined,
          value: undefined
        },
        type: undefined,
        upperLower: {
          upper: undefined,
          lower: undefined
        }
      }
    ],
    sections: [{
      lower: undefined,
      upper: undefined
    }],
    sections1: [{
      lower: undefined,
      upper: undefined
    }],
    sections2: [{
      lower: undefined,
      upper: undefined
    }],
    xy: ''
  }
}

@Component({
  name: 'Port',
  components: {
    addEditForm,
    airlineService
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private text: string = '(取值范围：>=起始值， <结束值)'
  private title = ''
  private dialogVisible: boolean = false
  private dialogLoading: boolean = false
  private dialogForm: any = paramsForm()
  private isType = ''
  private options: any[] = []
  private list: any[] = []
  private currentServiceId = ''
  private currentSubtypeId = ''
  private isItemDialogShow: boolean = false
  private agentLoading = false
  private agentForm = {
    selectAgents: []
  }
  private agentList :any[] = []
  private lineTitle: string = ''
  private stId: string = ''
  private countryService: any[] = []
  private isServicerVisible: boolean = false
  private loading: boolean = false
  private isEdit: boolean = false
  private isCopy: boolean = false
  private isEditFormShow: boolean = false
  private tableData: any = []
  private selectValue: any = {
    countryFromId: undefined, // 国家
    countryToId: undefined, // 国家
    portFrom: undefined, // 国家
    portsToId: undefined, // 国家
    transType: undefined,
    conveyance: undefined,
    keyword: undefined // 搜索关键字
  }
  private copyRange: any[] = []
  private copyKey: any[] = []
  private tools: any[] = []
  private svTypes: any = []
  private startPortList: any = []
  private endPortList: any = []
  private countryList: any[] = [] // 国际列表
  private selectLoading = false
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
  private formatTrans(type: any) {
    let name: any = ''
    const list = [
      { id: '0', name: '包板' },
      { id: '1', name: '散货' },
      { id: '2', name: '整柜' },
      { id: '3', name: '拼箱' },
      { id: '4', name: '整车' },
      { id: '5', name: '拼箱' }
    ]
    const arr = type.split(',')
    arr.map((it: any) => {
      const item: any = list.find((l: any) => l.id === it) || {}
      if (item.name) {
        name += item.name + ' '
      }
    })
    return name
  }
  private showServiceAgent(row: any) {
    this.title = '关联代理商' + '【' + row.name + '】'
    this.isItemDialogShow = true
    this.currentServiceId = row.id
    this.agentLoading = true
    const params = {
      bsId: row.id
    }
    Promise.all([this.getAssociatedAgentList(params), this.getCustTypeList((row || {}).conveyance)]).then(r => {
      this.agentLoading = false
    })
      .catch((err: any) => {
        this.agentLoading = false
        return err
      })
  }
  // 获取代理商列表
  private getCustTypeList(id: string) {
    const params = {
      page: 1,
      size: 9999,
      cas: 'A',
      typeId: '02',
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
  private getAssociatedAgentList(params: any) {
    return getAssociatedAgentList(params)
      .then(res => {
        const result: any = res.data || []
        this.agentForm.selectAgents = result.map((item: any) => item.id)
      })
      .catch(err => {
        this.agentLoading = false
        return err
      })
  }
  // 设置关联代理商
  private setAgentConfirm() {
    const agents = this.agentForm.selectAgents.map((item: any) => {
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
    saveAgent(params)
      .then(res => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.itemDialogClose()
        this.queryAll()
      })
      .catch(err => {
        return err
      })
  }
  private closeService() {
    this.$nextTick(() => {
      const root: any = this.$refs.airlineService
      root.clearData()
    })
  }
  // 航线服务商
  private showServiceLine(row: any) {
    this.isServicerVisible = true
    this.stId = row.conveyance
    this.countryService = [row.countryFromId, row.countryToId]
    this.lineTitle = '航线服务商 - ' + row.name
    this.$nextTick(() => {
      const root: any = this.$refs.airlineService
      root.setData(row)
    })
  }

  private getContainerList() {
    this.dialogLoading = true
    const params: any = {
      page: 1,
      size: 9999
    }
    getContainerList(params)
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result || []
        this.list = result
        this.dialogLoading = false
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }
  private getAviationList() {
    this.dialogLoading = true
    const params: any = {
      model: {},
      page: 1,
      size: 9999
    }
    getAviationList(params)
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result || []
        this.list = result.map((it: any) => {
          const { id, name } = it
          return {
            id: id.toString(),
            name
          }
        })
        this.dialogLoading = false
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }
  private isChargeSide(type: any) {
    const arr = (type || '').split(',')
    if (!arr.some((it: any) => it === '1' || it === '3' || it === '5')) {
      return false
    } else {
      return true
    }
  }
  private onChargeSide(row: any) {
    // 区间
    const { conveyance, transType, id, name } = row
    const arr = transType.split(',')
    arr.map((it: any) => {
      if (it === '1') { // 空散
        this.isType = 'one'
        this.title = '重量区间'
        this.dialogVisible = true
      } else if (it === '3') { // 海铁拼
        this.isType = 'one'
        this.title = '体积区间'
        this.dialogVisible = true
      } else if (it === '5') { // 卡散
        this.title = '重量&方数区间'
        this.isType = 'two'
        this.dialogVisible = true
      }
    })
    this.currentServiceId = id
    this.dialogForm.xy = 'X'
    this.dialogForm.loadType = transType
    this.dialogForm.service = {
      key: id,
      value: name
    }
    this.dialogForm.serviceSubtype = {
      key: conveyance,
      value: conveyance === '0' ? '空运' : conveyance === '1' ? '海运' : conveyance === '2' ? '铁路' : conveyance === '4' ? '卡航' : ''
    }
    this.getPriceConfig()
  }
  private isChargeType(type: any) {
    const arr = (type || '').split(',')
    if (!arr.some((it: any) => it === '0' || it === '2' || it === '4')) {
      return false
    } else {
      return true
    }
  }
  private onChargeType(row: any) {
    const { conveyance, transType, id, name } = row
    const arr = transType.split(',')
    arr.map((it: any) => {
      if (it === '0') { // 空板
        this.title = '定义航空板'
        this.isType = 'three'
        this.getAviationList()
        this.dialogVisible = true
      } else if (it === '2') { // 海铁整
        this.title = '定义柜型'
        this.isType = 'three'
        this.getContainerList()
        this.dialogVisible = true
      } else if (it === '4') { // 卡整
        this.title = '设置车型'
        this.isType = 'three'
        this.dialogVisible = true
      }
    })

    this.currentServiceId = id
    this.dialogForm.xy = 'X'
    this.dialogForm.loadType = transType
    this.dialogForm.service = {
      key: id,
      value: name
    }
    this.dialogForm.serviceSubtype = {
      key: conveyance,
      value: conveyance === '0' ? '空运' : conveyance === '1' ? '海运' : conveyance === '2' ? '铁路' : conveyance === '4' ? '卡航' : ''
    }
    this.getPriceConfig()
  }
  private getPriceConfig() {
    this.dialogLoading = true
    const params: any = {
      serviceId: this.currentServiceId,
      xy: this.dialogForm.xy,
      serviceType: '02'
    }
    getPriceConfig(params)
      .then((res: any) => {
        const result = res.data || []
        if (Array.isArray(result) && result.length <= 0) {
          this.dialogLoading = false
          return
        }
        const data = result[0] || {}
        const { ranges, keyValues, id } = data
        let brr: any[] = []
        if (Array.isArray(ranges) && ranges.length > 0) {
          brr = (ranges || []).map((it: any) => {
            if (it.upperLower) {
              const { upper, lower } = it.upperLower
              const obj = {
                lower: lower || undefined,
                upper: upper || undefined
              }
              return {
                type: it.type,
                upperLower: obj,
                keyValue: it.keyValue || undefined
              }
            } else {
              const obj = {
                lower: undefined,
                upper: undefined
              }
              return {
                type: it.type,
                upperLower: obj,
                keyValue: it.keyValue || undefined
              }
            }
          })
        } else {
          brr = [
            {
              upperLower: {
                lower: undefined,
                upper: undefined
              }
            }
          ]
        }
        this.copyRange = brr
        this.copyKey = keyValues
        this.dialogForm.id = id
        if (this.isType === 'one') { // 区间
          this.dialogForm.sections = brr.map((it: any) => {
            return it.upperLower
          })
          this.dialogLoading = false
        } else if (this.isType === 'three') { // 柜型
          this.options = keyValues.map((it: any) => (it.keyValue || {}).key)
          this.dialogLoading = false
        } else if (this.isType === 'two') { // 重量方数
          this.dialogForm.sections1 = brr.map((it: any) => {
            if (it.type === '0') {
              return it.upperLower
            }
          })
          this.dialogForm.sections2 = brr.map((it: any) => {
            if (it.type === '1') {
              return it.upperLower
            }
          })
          this.dialogLoading = false
        }
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }
  private addRangeData() {
    this.dialogForm.sections.push({
      lower: undefined,
      upper: undefined
    })
  }
  private deleteRangeData(index: number) {
    this.dialogForm.sections.splice(index, 1)
  }
  private addRangeData1() {
    this.dialogForm.sections1.push({
      lower: undefined,
      upper: undefined
    })
  }
  private deleteRangeData1(index: number) {
    this.dialogForm.sections1.splice(index, 1)
  }
  private addRangeData2() {
    this.dialogForm.sections2.push({
      lower: undefined,
      upper: undefined
    })
  }
  private deleteRangeData2(index: number) {
    this.dialogForm.sections2.splice(index, 1)
  }
  private cancel() {
    this.dialogVisible = false
    this.isType = ''
    this.options = []
    this.list = []
    this.copyRange = []
    this.copyKey = []
    this.dialogForm = paramsForm()
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
  private save() {
    const { loadType, keyValues, ranges, sections, sections1, sections2, ...form } = this.dialogForm
    const params: any = {
      serviceType: {
        key: '02',
        value: '订舱'
      },
      loadType,
      ...form
    }
    const axisY: any[] = []
    const axisX: any[] = []
    const axisX1: any[] = []
    const axisX2: any[] = []
    if (this.isType === 'one') {
      sections.map((it: any) => {
        axisX.push({
          type: '',
          upperLower: it
        })
      })
      const isBool = this.rangeValidate(sections)
      if (!isBool) return
      params.ranges = axisX
      params.keyValues = this.copyKey
    } else if (this.isType === 'three') {
      this.options.map((it: any) => {
        const item = this.list.find((l: any) => l.id === it) || {}
        if (item.id && item.name) {
          axisX.push({
            country: {
              key: '',
              value: ''
            },
            keyValue: {
              key: item.id,
              value: item.name
            }
          })
        }
      })
      params.keyValues = axisX
      params.ranges = this.copyRange.map((it: any) => {
        const { type, upperLower } = it
        return {
          type,
          upperLower
        }
      })
    } else if (this.isType === 'two') {
      sections1.map((it: any) => {
        axisX1.push({
          type: '0',
          upperLower: it
        })
      })
      sections2.map((it: any) => {
        axisX2.push({
          type: '1',
          upperLower: it
        })
      })
      const isBool1 = this.rangeValidate(sections1)
      if (!isBool1) return
      const isBool2 = this.rangeValidate(sections2)
      if (!isBool2) return
      params.ranges = [...axisX1, ...axisX2]
      params.keyValues = this.copyKey
    }
    this.dialogLoading = true
    savePriceConfig(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.dialogLoading = false
        this.cancel()
        this.queryAll()
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }

  // 新增
  private add() {
    (this.$refs.addEditForm as any).init()
    this.isEdit = false
    this.isCopy = false
    this.isEditFormShow = true
  }
  private setTable() {
    this.$nextTick(() => {
      const root: any = this.$refs.table
      root.doLayout() // 解决表格错位
    })
  }
  private closeForm(flag: any) {
    if (flag) {
      this.queryAll(1)
    }
    this.isEditFormShow = false
    this.setTable()
  }
  private copy(row: any) {
    (this.$refs.addEditForm as any).init(row)
    this.isEdit = true
    this.isCopy = true
    this.isEditFormShow = true
  }
  // 编辑
  private edit(row: any) {
    (this.$refs.addEditForm as any).init(row)
    this.isEdit = true
    this.isCopy = false
    this.isEditFormShow = true
  }
  // 删除
  private del(row: any) {
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
        delBooking(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.queryAll(1)
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }
  // 启用禁用
  private async onStatus(row: any, value: any): Promise<void> {
    if (!row.status || row.status === value) {
      return
    }
    const text = value === '0' ? '禁用' : '开启'
    const [cancel, confirm] = await this.$confirm(
      `此操作将${text}该航线，是否继续？`,
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
    this.loading = true
    changeBookingStatus({
      id: row.id
    })
      .then(() => {
        this.$message.success('修改成功')
        this.queryAll()
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private queryAll(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const params: any = {
      model: {
        ...this.selectValue
      },
      page: this.page,
      size: this.size
    }
    switch (this.selectType) {
      case '1':
        params.model.serviceCode = this.selectValue.keyword
        break
      case '2':
        params.model.name = this.selectValue.keyword
        break
    }
    getBSCList(params)
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
  private onSVTool(val: any) {
    this.selectValue.transType = undefined
    this.selectValue.portFrom = undefined
    this.selectValue.portsToId = undefined
    this.selectValue.countryFromId = undefined
    this.selectValue.countryToId = undefined
    this.getSvTypes(val)
  }
  // 获取业务类型
  private getSubtypeList() {
    const params = {
      typeId: '02'
    }
    getServiceSubtypeList(params).then((res: any) => {
      if (res.success) {
        this.tools = (res.data || []).map((e: any) => {
          return {
            ...e,
            value: e.id,
            label: e.name
          }
        })
      }
    }).catch((err: any) => {
      return err
    })
  }
  // 获取服务类型
  private getSvTypes(val: any) {
    const params = {
      type: 'BOOKING_BUSINESS_TYPE' + val
    }
    getWordsList(params).then((res: any) => {
      if (res.success) {
        this.svTypes = res.data || []
      }
    }).catch((err: any) => {
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
  private onCountryFrom() {
    this.selectValue.portFrom = undefined
    this.startPortList = []
  }
  private onCountryTo() {
    this.selectValue.portsToId = undefined
    this.endPortList = []
  }
  private getStartPortData() {
    this.selectLoading = true
    const params:any = {
      page: 1,
      size: 99999,
      countryId: this.selectValue.countryFromId,
      type: this.selectValue.conveyance
    }
    getPortList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.startPortList = data.result || []
        this.selectLoading = false
      }).catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private getEndPortData() {
    this.selectLoading = true
    const params:any = {
      page: 1,
      size: 99999,
      countryId: this.selectValue.countryToId,
      type: this.selectValue.conveyance
    }
    getPortList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.endPortList = data.result || []
        this.selectLoading = false
      }).catch((err: any) => {
        this.selectLoading = false
        return err
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
  private created(): void {
    this.queryAll()
    this.getCountryList()
    this.getSubtypeList()
    this.getSvTypes('0')
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
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
.dialog-form {
  .el-form-item {
    display: inline-block;
    vertical-align: top;
    width: 50%;
    margin-bottom: 10px;
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
