<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        v-show="addEditForm === 'index'"
        class="app-container"
      >
        <head-info
          info=""
          title="专线服务"
        />
        <div class="app-panel">
          <el-row>
            <el-col
              :span="3"
            >
              <el-button
                v-permission="['lineServiceAdd']"
                type="text"
                icon="el-icon-circle-plus-outline"
                @click="handleAdd"
              >
                新增服务
              </el-button>
              <el-button
                type="text"
                icon="el-icon-edit-outline"
                style="margin-left: 10px"
                @click="setServiceGroup"
              >
                服务组
              </el-button>
            </el-col>
            <el-col
              :span="21"
              style="text-align:right;"
            >
              <el-select
                v-model="searchForm.productId"
                placeholder="所属产品"
                size="small"
                clearable
                filterable
                style="width:100px;margin-right:5px;"
                @focus="getProductTypeList"
              >
                <el-option
                  v-for="item in productList"
                  :key="item.id"
                  :label="item.productName"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="searchForm.purpose"
                placeholder="服务用途"
                size="small"
                clearable
                filterable
                style="width:100px;margin-right:5px;"
              >
                <el-option
                  label="服务渠道"
                  value="0"
                />
                <el-option
                  label="计费渠道"
                  value="1"
                />
                <el-option
                  label="发货渠道"
                  value="2"
                />
              </el-select>
              <el-select
                v-model="searchForm.subtypeId"
                :loading="selectLoading"
                placeholder="服务类型"
                size="small"
                clearable
                style="width:100px;margin-right:5px;"
                @focus="getSubtypeList"
                @change="onSubtype"
              >
                <el-option
                  v-for="item in subtypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-if="searchForm.subtypeId === '1' || searchForm.subtypeId === '2'"
                v-model="searchForm.containerType"
                placeholder="业务类型"
                size="small"
                clearable
                style="width:100px;margin-right:5px;"
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select
                v-if="searchForm.subtypeId === '1' || searchForm.subtypeId === '2'"
                v-model="searchForm.coverTank"
                placeholder="支持锁舱"
                size="small"
                clearable
                style="width:100px;margin-right:5px;"
              >
                <el-option
                  label="否"
                  value="0"
                />
                <el-option
                  label="是"
                  value="1"
                />
              </el-select>
              <el-select
                v-model="searchForm.countryFromId"
                placeholder="起运国"
                style="width:130px;margin-right:5px;"
                size="small"
                filterable
                clearable
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
              <!-- <el-select
                v-model="searchForm.departureId"
                :disabled="!searchForm.subtypeId || !searchForm.countryFromId"
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
              </el-select> -->
              <el-select
                v-model="searchForm.countryId"
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
                v-model="searchForm.orgTag"
                placeholder="服务机构"
                style="width:100px;margin-right:5px;"
                filterable
                clearable
                size="small"
              >
                <el-option
                  v-for="item in orgList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <!-- <el-select
                v-model="searchForm.destinationId"
                :disabled="!searchForm.subtypeId || !searchForm.countryId || searchForm.subtypeId === '3'"
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
              </el-select> -->

              <el-select
                v-model="searchForm.agentId"
                placeholder="关联代理商"
                size="small"
                clearable
                filterable
                style="width:130px;margin-right:5px;"
              >
                <el-option
                  v-for="item in agentsList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <!-- <el-select
                v-model="searchForm.category"
                placeholder="商品属性"
                size="small"
                clearable
                style="width:110px;margin-right:5px;"
              >
                <el-option
                  v-for="item in propertyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select> -->
              <el-select
                v-model="searchForm.purposeType"
                placeholder="目的地类型"
                size="small"
                clearable
                style="width:110px;margin-right:5px;"
              >
                <el-option
                  label="FBA"
                  :value="0"
                />
                <el-option
                  label="私人"
                  :value="1"
                />
                <el-option
                  label="自有海外仓"
                  :value="2"
                />
              </el-select>
              <el-select
                v-model="searchForm.dispatch"
                placeholder="派件方式"
                size="small"
                clearable
                style="width:100px;margin-right:5px;"
              >
                <el-option
                  label="卡派"
                  value="0"
                />
                <el-option
                  label="快递"
                  value="1"
                />
                <el-option
                  v-if="searchForm.subtypeId === '1' || searchForm.subtypeId === '2'"
                  label="整柜直送"
                  value="3"
                />
                <el-option
                  label="自提"
                  value="2"
                />
                <el-option
                  v-if="searchForm.purposeType === 2"
                  label="到仓"
                  value="4"
                />
              </el-select>
              <el-select
                v-model="searchForm.status"
                placeholder="启用状态"
                size="small"
                clearable
                style="width:100px;margin-right:5px;"
              >
                <el-option
                  label="禁用"
                  value="0"
                />
                <el-option
                  label="启用"
                  value="1"
                />
              </el-select>
              <el-input
                v-model="searchForm.name"
                size="small"
                clearable
                style="width:200px;margin-right:5px;"
                placeholder="请输入服务名称"
              />
              <el-button
                v-permission="['lineServiceQuery']"
                type="primary"
                size="small"
                @click="getTableData(1)"
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
              min-width="200"
              show-overflow-tooltip
            />
            <el-table-column
              fixed="left"
              prop="lsId"
              label="服务编码"
              min-width="150"
              show-overflow-tooltip
            />
            <el-table-column
              prop="productName"
              label="所属产品"
              width="100"
            />
            <el-table-column
              prop="subtypeName"
              label="服务类型"
              width="100"
            />
            <el-table-column
              prop="containerType"
              label="业务类型"
              width="100"
            >
              <template slot-scope="scope">
                {{ (typeOptions[scope.row.containerType] || {}).label || '--' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="coverTank"
              label="支持锁舱"
              width="100"
            >
              <template slot-scope="scope">
                {{ scope.row.coverTank === '1' ? '是' : scope.row.coverTank === '0' ? '否' : '-' }}
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="deliveryName"
              label="交货区域"
              min-width="150"
              show-overflow-tooltip
            /> -->
            <el-table-column
              prop="countryName"
              label="起运国"
              min-width="120"
            />
            <el-table-column
              label="目的国"
              min-width="200"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div>
                  {{ formatTargetCountrys(scope.row.targets) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="departureName"
              label="起运港"
              min-width="200"
              show-overflow-tooltip
            />
            <el-table-column
              prop="destinationName"
              label="目的港"
              min-width="200"
              show-overflow-tooltip
            />
            <el-table-column
              prop="purposeType"
              label="目的地类型"
              width="120"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.purposeType === 0">FBA</span>
                <span v-else-if="scope.row.purposeType === 1">私人</span>
                <span v-else-if="scope.row.purposeType === 2">自有海外仓</span>
                <span v-else>--</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="dispatch"
              label="派件方式"
              width="100"
            >
              <template slot-scope="scope">
                {{ dispatchList[scope.row.dispatch] }}
              </template>
            </el-table-column>
            <el-table-column
              prop="examine"
              label="是否验货"
              width="100"
            >
              <template slot-scope="scope">
                {{ scope.row.examine ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column
              label="目的地/区域"
              width="130"
            >
              <div
                slot-scope="scope"
                style="display: flex;align-items: center"
              >
                <span style="font-size: 30px;margin-right: 5px">
                  <strong>
                    <span
                      v-if="scope.row.ytag"
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
                  :disabled="!$checkPermission(['lineServiceArea'])"
                  type="text"
                  @click="onArea(scope.row)"
                >
                  目的地/区域
                </el-button>
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
                      v-if="scope.row.xtag"
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
                  :disabled="!$checkPermission(['lineServiceCharge'])"
                  type="text"
                  @click="onCharge(scope.row)"
                >
                  设置计费
                </el-button>
              </div>
            </el-table-column>
            <el-table-column
              label="关联代理商"
              width="130"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="!$checkPermission(['lineServiceAgent'])"
                  type="text"
                  @click="handleAgent(scope.row)"
                >
                  关联代理商
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="启用状态"
              width="100"
            >
              <template slot-scope="scope">
                <el-switch
                  :disabled="!$checkPermission(['lineServiceEnable'])"
                  style="margin-left: 10px;"
                  class="switchStyle"
                  active-text="启用"
                  inactive-text="禁用"
                  active-value="1"
                  inactive-value="0"
                  :value="scope.row.status"
                  @input="(value) => handleSwitch(scope.row, value)"
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
                  v-permission="['lineServiceCopy']"
                  type="text"
                  @click="handleCopy(scope.row)"
                >
                  复制
                </el-button>
                <el-button
                  v-permission="['lineServiceEdit']"
                  type="text"
                  @click="handleEdit(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['lineServiceDel']"
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
      </div>
      <div
        v-if="addEditForm === 'addEditForm'"
        class="app-container"
      >
        <addEditForm
          ref="addEditForm"
          :is-edit="isEdit"
          :is-copy="isCopy"
          :type-list="typeOptions"
          @back="addEditForm = 'index'"
          @confirm="saveConfirm"
        />
      </div>
      <service-line-group
        v-if="addEditForm === 'group'"
        @back="addEditForm = 'index'"
      />
    </div>

    <el-dialog
      :title="'关联代理商 【'+ title + '】'"
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
            @click="confirmAgent"
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
      <paivatelineSet
        ref="paivatelineSet"
      />
    </el-dialog>

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
          v-if="isType !== '1' && isType !== '3'"
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
          <div v-show="isType === '1'">
            <el-form-item
              label="地址类型"
              class="is-required"
            >
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
            </el-form-item>
            <el-form-item
              v-if="dialogForm.yType !== '0' && dialogForm.yType !== '102'"
              label="国家"
              class="is-required"
            >
              <el-select
                v-model="dialogForm.countryId"
                :loading="selectLoading"
                size="mini"
                clearable
                filterable
                placeholder="请选择"
                style="width: 200px;"
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
            </el-form-item>
          </div>
          <div
            v-show="isType === '2'"
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
            v-show="isType === '4'"
            style="height: 400px;overflow-y: auto;"
          >
            <el-form-item
              label="重量范围"
              prop="sections1"
              style="width: 80%;display: inline-block;"
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
            <!-- <el-form-item
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
            </el-form-item> -->
          </div>
        </el-form>
        <div v-show="isType === '1' || isType === '3'">
          <el-transfer
            ref="transferCountry"
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
  getLscList,
  changeStatus,
  deleteLsc,
  getAgentsById,
  saveAgent,
  getPortList,
  getCustTypeList,
  getProductTypeList,
  getServiceSubtypeList,
  getCountryList,
  getPriceConfig,
  savePriceConfig,
  getRegionList,
  getFbastoreList,
  getContainerList,
  getStateByCountry,
  getAllAreaList
} from '@/api/service-with-privateline-clearance'
import { getAgentList } from '@/api/jht-agent-management'
import addEditForm from '@/views/service-configuration/privateline-line/addEditForm.vue'
import paivatelineSet from '@/views/service-configuration/privateline-line/paivatelineSet.vue'
import serviceLineGroup from '@/views/service-configuration/privateline-line-group/index.vue'

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
        type: undefined,
        upperLower: {
          key: undefined,
          value: undefined
        },
        keyValue: {
          key: undefined,
          value: undefined
        }
      }
    ],
    countryId: undefined,
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
  name: 'paivateline',
  components: {
    addEditForm,
    paivatelineSet,
    serviceLineGroup
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private text: string = '(取值范围：>=起始值， <结束值)'
  private searchForm: any = {
    purpose: '',
    productId: undefined,
    agentId: undefined, // 代理商
    countryId: undefined,
    orgTag: undefined,
    dispatch: undefined,
    containerType: undefined,
    coverTank: undefined,
    countryFromId: undefined,
    departureId: undefined, // 起运港
    destinationId: undefined, // 目的港
    category: undefined, // 属性
    subtypeId: undefined, // 类型
    status: undefined
  }
  private tableData: any[] = []
  private productList: any[] = []
  private subtypeList: any[] = []
  private typeOptions = [
    { label: '拼箱', value: '0' },
    { label: '整柜', value: '1' }
  ]
  private propertyOptions = [
    { label: '普货', value: '0' },
    { label: '纯电', value: '1' },
    { label: '带电', value: '2' },
    { label: '带磁', value: '3' },
    { label: '危险', value: '4' }
  ]
  private orgList: any[] = [
    { name: '美森', id: '1' },
    { name: '以星', id: '2' },
    { name: '快线', id: '3' },
    { name: '其他', id: '4' }
  ]
  private total = 0
  private page = 1
  private size = 10
  private loading = false
  private addEditForm: string = 'index'
  private title = ''
  private currentServiceId = ''
  private currentSubtypeId = ''
  private isEdit: boolean = false
  private isCopy: boolean = false
  private dialogAgent: boolean = false
  private dialogVisible: boolean = false
  private dialogLoading: boolean = false
  private dialogForm: any = paramsForm()
  private copyForm: any = {}
  private isType = ''
  private addressList: any[] = []
  private options: any[] = []
  private list: any[] = []
  private countryList: any[] = []
  private selectAgents: any[] = []
  private agentList: any[] = []
  private agentsList: any[] = []
  private startPortList: any[] = []
  private endPortList: any[] = []
  private isGroupDialog: boolean = false
  private selectLoading: boolean = false
  private dispatchList: any[] = ['卡派', '快递', '自提', '整柜直送', '到仓']

  /* computed */
  // 所属公司id
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }

  /* methods */
  private getTableData(val?: any): void {
    // 查询
    this.loading = true
    if (val) {
      this.page = val
    }
    const params: any = {
      page: this.page,
      size: this.size,
      ...this.searchForm
    }
    getLscList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.tableData = data.result || []
        this.total = data.total
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return [null, err]
      })
  }
  private setServiceGroup() {
    this.addEditForm = 'group'
  }
  private formatTargetCountrys(row:any) {
    const result = (row || []).map((item: any) => item.countryName).join(',')
    return result
  }
  private getProductTypeList() {
    getProductTypeList()
      .then((res: any) => {
        const data = res.data || []
        this.productList = data
      }).catch((err: any) => {
        return err
      })
  }
  private getSubtypeList() {
    this.selectLoading = true
    const params:any = {
      typeId: '05'
    }
    getServiceSubtypeList(params)
      .then(res => {
        const data = res.data || []
        this.subtypeList = data.filter((it: any) => it.id !== '3')
        this.selectLoading = false
      }).catch(err => {
        this.selectLoading = false
        return err
      })
  }
  private onSubtype() {
    this.searchForm.departureId = undefined
    this.searchForm.destinationId = undefined
    this.searchForm.dispatch = undefined
    this.searchForm.containerType = undefined
    this.searchForm.coverTank = undefined
    this.startPortList = []
    this.endPortList = []
  }
  private getStartPortData() {
    this.selectLoading = true
    const params:any = {
      page: 1,
      size: 99999,
      countryId: this.searchForm.countryFromId,
      type: this.searchForm.subtypeId === '3' ? '' : this.searchForm.subtypeId
    }
    getPortList(params)
      .then(res => {
        const data = res.data || {}
        this.startPortList = data.result || []
        this.selectLoading = false
      }).catch(err => {
        this.selectLoading = false
        return err
      })
  }
  private getEndPortData() {
    this.selectLoading = true
    const params:any = {
      page: 1,
      size: 99999,
      countryId: this.searchForm.countryId,
      type: this.searchForm.subtypeId === '3' ? '' : this.searchForm.subtypeId
    }
    getPortList(params)
      .then(res => {
        const data = res.data || {}
        this.endPortList = data.result || []
        this.selectLoading = false
      }).catch(err => {
        this.selectLoading = false
        return err
      })
  }
  // 获取代理商列表
  private getCustTypeList(id: string) {
    const params = {
      page: 1,
      size: 9999,
      cas: 'A',
      typeId: '05',
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
  private getAgentList() {
    const params = {
      page: 1,
      size: 9999,
      parentId: (this as any).custId
    }
    getAgentList(params).then(res => {
      const data = res.data || {}
      this.agentsList = data.result || []
    }).catch(err => {
      return err
    })
  }
  // 关联代理商
  private handleAgent(row: any) {
    this.title = row.name
    this.dialogAgent = true
    this.currentServiceId = row.id
    this.agentList = []
    this.dialogLoading = true
    const params = {
      lscId: row.id
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
        this.selectAgents = result.map((item: any) => item.id)
      })
      .catch((err: any) => {
        return err
      })
  }
  private filterMethod(query: any, item: any): boolean {
    const name = item.name || ''
    return name.indexOf(query) > -1
  }
  private closeAgent() {
    this.dialogAgent = false
    this.currentServiceId = ''
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
  }
  private confirmAgent(row: any): void {
    this.dialogLoading = true
    const agents = this.selectAgents.map((item: any) => {
      const targetInfo = this.agentList.find(info => info.id === item) || {}
      const name = targetInfo.name
      return {
        id: item,
        name
      }
    })
    const params: any = {
      agents: [],
      id: this.currentServiceId
    }
    params.agents = agents.filter((it: any) => it.name && it.id)
    saveAgent(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.dialogLoading = false
        this.closeAgent()
        this.getTableData()
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }

  // 目的地/计费
  private onArea(row: any) {
    const { subtypeId, subtypeName, id, name, purposeType } = row
    if (purposeType === 1) {
      this.addressList = [
        { name: '国家', id: '0' },
        { name: '国内区域', id: '5' },
        { name: '城市区域', id: '100' },
        // { name: '仓库区域', id: '101' },
        { name: '国家区域', id: '102' },
        { name: '州省', id: '1' }
      ]
    } else {
      this.addressList = [
        { name: '国家', id: '0' },
        { name: '国内区域', id: '5' },
        { name: '城市区域', id: '100' },
        { name: '仓库区域', id: '101' },
        { name: '国家区域', id: '102' },
        { name: '州省', id: '1' },
        { name: '仓库代码', id: '7' }
      ]
    }
    this.currentServiceId = id
    this.currentSubtypeId = subtypeId
    this.title = '地址类型'
    this.dialogForm.xy = 'Y'
    this.dialogForm.service = {
      key: id,
      value: name
    }
    this.dialogForm.serviceSubtype = {
      key: subtypeId,
      value: subtypeName
    }
    this.isType = '1'
    this.dialogVisible = true
    this.getPriceConfig()
  }
  private onCharge(row: any) {
    const { subtypeId, subtypeName, containerType, id, name, priceType } = row
    this.isType = '2'
    switch (subtypeId) {
      case '0': // 空
        this.title = '重量区间'
        this.dialogForm.loadType = '0' // 空散
        this.dialogForm.xType = '0'
        break
      case '1': // 海
        if (containerType === '0') { // 拼箱
          if (priceType === '2') {
            this.title = '重量区间'
            this.dialogForm.loadType = '3'
            this.dialogForm.xType = '0'
          } else {
            this.title = '体积区间'
            this.dialogForm.loadType = '3'
            this.dialogForm.xType = '1'
          }
        } else if (containerType === '1') { // 整柜
          this.title = '柜型'
          this.isType = '3'
          this.dialogForm.loadType = '2'
          this.dialogForm.xType = '3'
          this.getContainerList()
        }
        break
      case '2': // 铁
        if (containerType === '0') { // 拼箱
          if (priceType === '2') {
            this.title = '重量区间'
            this.dialogForm.loadType = '3'
            this.dialogForm.xType = '0'
          } else {
            this.title = '体积区间'
            this.dialogForm.loadType = '3'
            this.dialogForm.xType = '1'
          }
        } else if (containerType === '1') { // 整柜
          this.title = '柜型'
          this.isType = '3'
          this.dialogForm.loadType = '2'
          this.dialogForm.xType = '3'
          this.getContainerList()
        }
        break
      case '3': // 快
        this.title = ''
        break
      case '4': // 卡散
        this.title = '重量区间'
        this.isType = '4'
        this.dialogForm.loadType = '5'
        break
      default:
        break
    }
    this.currentServiceId = id
    this.currentSubtypeId = subtypeId
    this.dialogForm.xy = 'X'
    this.dialogForm.service = {
      key: id,
      value: name
    }
    this.dialogForm.serviceSubtype = {
      key: subtypeId,
      value: subtypeName
    }
    this.dialogVisible = true
    this.getPriceConfig()
  }
  private getPriceConfig() {
    this.dialogLoading = true
    const params: any = {
      serviceId: this.currentServiceId,
      xy: this.dialogForm.xy,
      serviceType: '05'
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
        this.dialogForm.id = id
        this.dialogForm.yType = yType
        if (this.isType === '1') { // 地址
          this.options = []
          keyValues.map((it: any) => {
            this.dialogForm.countryId = (it.country || {}).key
            this.options.push((it.keyValue || {}).key)
          })
          this.onCountry()
          if (yType !== '0') {
            this.getCountryList()
          }
        } else if (this.isType === '2') { // 区间
          const arr = [{
            lower: undefined,
            upper: undefined
          }]
          if (Array.isArray(ranges) && ranges.length > 0) {
            const brr = ranges.map((it: any) => {
              return it.upperLower
            })
            this.dialogForm.sections = brr
          } else {
            this.dialogForm.sections = arr
          }
        } else if (this.isType === '3') { // 柜型
          this.options = ranges.map((it: any) => (it.keyValue || {}).key)
        } else if (this.isType === '4') { // 重量方数
          const arr = [{
            lower: undefined,
            upper: undefined
          }]
          if (Array.isArray(ranges) && ranges.length > 0) {
            const brr1 = ranges.filter((it: any) => {
              return it.type === '0'
            }).map((it: any) => {
              if (it.type === '0') {
                return it.upperLower
              }
            })
            // const brr2 = ranges.map((it: any) => {
            //   if (it.type === '1') {
            //     return it.upperLower
            //   }
            // })
            this.dialogForm.sections1 = brr1
            // this.dialogForm.sections2 = brr2
          } else {
            this.dialogForm.sections1 = arr
            // this.dialogForm.sections2 = arr
          }
        }
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }
  private onAddress() {
    this.options = []
    if (this.dialogForm.yType === '0') {
      this.dialogForm.countryId = undefined
      this.getCountryData()
    } else if (this.dialogForm.yType === '102') {
      this.dialogForm.countryId = undefined
      this.getAreaList(2)
    } else {
      this.dialogForm.countryId = undefined
      this.list = []
    }
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
  private onCountry() {
    const type = this.dialogForm.yType
    switch (type) {
      case '0':
        this.getCountryData()
        break
      case '5':
        this.getRegionList()
        break
      case '1':
        this.getStateByCountry()
        break
      case '7':
        this.getFbastoreList()
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
        this.list = []
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
        this.list = result.map((item: any) => {
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
  private onCountryFrom() {
    this.searchForm.departureId = undefined
    this.startPortList = []
  }
  private onCountryTo() {
    this.searchForm.destinationId = undefined
    this.endPortList = []
  }
  private getCountryData() {
    this.dialogLoading = true
    getCountryList()
      .then((res: any) => {
        const data = res.data || {}
        this.list = data.result || []
        this.dialogLoading = false
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }
  private getStateByCountry() {
    this.dialogLoading = true
    getStateByCountry({
      countryId: this.dialogForm.countryId
    })
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
        this.list = result
        this.dialogLoading = false
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }
  private getFbastoreList() {
    this.dialogLoading = true
    const params: any = {
      countryId: this.dialogForm.countryId,
      codeSort: 'A',
      page: 1,
      size: 9999
    }
    getFbastoreList(params)
      .then((res: any) => {
        const arr = res.data.result.map((item:any) => {
          return {
            id: item.id,
            name: item.code + (item.postal ? '-' + item.postal : '') + (item.stateName ? '-' + item.stateName : '')
          }
        })
        this.list = arr
        this.dialogLoading = false
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
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
    this.dialogForm = paramsForm()
    this.copyForm = {}
    const root: any = this.$refs.transferCountry
    root.clearQuery('left')
    root.clearQuery('right')
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
    const { countryId, yType, xType, keyValues, ranges, sections, sections1, sections2, ...form } = this.dialogForm
    const params: any = {
      serviceType: {
        key: '05',
        value: '专线'
      },
      ...form,
      yType
    }
    const axisY: any[] = []
    const axisX: any[] = []
    const axisX1: any[] = []
    const axisX2: any[] = []
    if (this.isType === '1') {
      this.options.map((it: any) => {
        const item = this.list.find((l: any) => l.id === it) || {}
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
    } else if (this.isType === '2') {
      sections.map((it: any) => {
        axisX.push({
          type: xType,
          upperLower: it
        })
      })
      const isBool = this.rangeValidate(sections)
      if (!isBool) return
      params.ranges = axisX
    } else if (this.isType === '3') {
      this.options.map((it: any) => {
        const item = this.list.find((l: any) => l.id === it) || {}
        if (item.id && item.name) {
          axisX.push({
            type: xType,
            keyValue: {
              key: item.id,
              value: item.name
            }
          })
        }
      })
      params.ranges = axisX
    } else if (this.isType === '4') {
      sections1.map((it: any) => {
        axisX1.push({
          type: '0',
          upperLower: it
        })
      })
      // sections2.map((it: any) => {
      //   axisX2.push({
      //     type: '1',
      //     upperLower: it
      //   })
      // })
      const isBool1 = this.rangeValidate(sections1)
      if (!isBool1) return
      // const isBool2 = this.rangeValidate(sections2)
      // if (!isBool2) return
      params.ranges = [...axisX1, ...axisX2]
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
        this.getTableData()
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }

  private handleAdd(): void {
    // 新增
    this.addEditForm = 'addEditForm'
    this.isEdit = false
    this.isCopy = false
    this.$nextTick(() => {
      const root: any = this.$refs.addEditForm
      root.setData()
    })
  }
  private handleCopy(row: any): void {
    // 复制
    this.addEditForm = 'addEditForm'
    this.isCopy = true
    this.isEdit = true
    this.$nextTick(() => {
      const root: any = this.$refs.addEditForm
      root.setData(row)
    })
  }
  private handleEdit(row: any): void {
    // 编辑
    this.addEditForm = 'addEditForm'
    this.isEdit = true
    this.isCopy = false
    this.$nextTick(() => {
      const root: any = this.$refs.addEditForm
      root.setData(row)
    })
  }
  private saveConfirm() {
    this.addEditForm = 'index'
    this.getTableData()
  }
  private handleDelete(row: any): void {
    // 删除
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
        deleteLsc(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getTableData()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }
  private handleCost(row: any): void {
    // 成本
  }

  private handleSwitch(row: any, value: any): void {
    // 开关
    if (!row.status || row.status === value) {
      return
    }
    const params = {
      id: row.id,
      status: value
    }
    const text = value === '0' ? '禁用' : '开启'
    this.$confirm(`此操作将${text}该专线服务，是否继续？`, '温馨提示', {
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
            this.getTableData()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }
  private handleSizeChange(size: any): void {
    // 页码
    this.size = size
    this.getTableData()
  }
  private handleCurrentChange(page: any): void {
    // 页数
    this.page = page
    this.getTableData()
  }
  private created() {
    this.getAgentList()
    this.getTableData()
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
  .el-form-item {
    display: inline-block;
    vertical-align: top;
    width: 50%;
    margin-bottom: 10px;
  }
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
