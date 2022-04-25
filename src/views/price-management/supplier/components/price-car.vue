<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <app-slide
      width="415"
      :is-active="isActive"
      style="margin: 15px 0 15px 15px;padding: 0;"
    >
      <div
        style="padding: 20px;"
      >
        <el-row>
          <el-col
            :span="12"
            style="line-height: 32px;cursor: pointer"
          >
            <el-popover
              v-model="myPopoverVisible"
              placement="bottom-start"
              trigger="click"
              popper-class="my-popover"
              @hide="hidePopover"
            >
              <div>
                <ul class="el-scrollbar__view el-select-dropdown__list">
                  <li
                    v-for="item in priceTypeList"
                    :key="item.value"
                    class="el-select-dropdown__item"
                    @click="priceTypeChange(item.value)"
                  >
                    <span>
                      {{ item.label }}
                    </span>
                  </li>
                </ul>
              </div>
              <div
                slot="reference"
                style="width: 100%;"
              >
                <span>
                  {{ formattPriceType(priceType, priceTypeList) }}
                </span>
                <i class="el-icon-caret-bottom" />
              </div>
            </el-popover>
          </el-col>
        </el-row>
        <div style="padding: 10px 0;">
          <el-form
            :model="searchForm"
            class="search-form"
            size="mini"
          >
            <el-form-item>
              <el-select
                v-model="searchForm.subtypeId"
                :loading="selectLoading"
                size="mini"
                clearable
                filterable
                placeholder="业务类型"
                style="width: 100%;"
                @focus="getSubtypeList"
                @change="getPriceList('')"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-popover
                v-model="visible"
                placement="bottom-start"
                trigger="click"
                @hide="hidePopover"
              >
                <div style="padding-right: 10px;">
                  <el-form-item
                    label="国家"
                    label-width="70px"
                  >
                    <el-select
                      v-model="searchForm.countryId"
                      :loading="selectLoading"
                      size="mini"
                      clearable
                      filterable
                      placeholder="请选择"
                      style="width: 200px;"
                      @change="countryChange"
                    >
                      <el-option
                        v-for="item in countryList"
                        :key="item.id"
                        :label="`${item.name}-${item.alias}`"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="服务"
                    label-width="70px"
                  >
                    <el-select
                      v-model="searchForm.kscId"
                      :disabled="!searchForm.countryId"
                      :loading="selectLoading"
                      size="mini"
                      clearable
                      filterable
                      placeholder="请选择"
                      style="width: 200px;"
                      @focus="getServiceList('search')"
                      @change="onService"
                    >
                      <el-option
                        v-for="item in serviceList"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="供应商"
                    label-width="70px"
                  >
                    <el-select
                      v-model="searchForm.custId"
                      size="mini"
                      clearable
                      filterable
                      placeholder="请选择"
                      style="width: 200px;"
                    >
                      <el-option
                        v-for="item in supplierList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                  <div
                    slot="footer"
                    style="text-align: right;"
                  >
                    <el-button @click="clearForm('1')">
                      清空
                    </el-button>
                    <el-button
                      type="primary"
                      @click="getPriceList('')"
                    >
                      筛选
                    </el-button>
                  </div>
                </div>
                <div
                  slot="reference"
                  class="el-select el-select--small"
                  style="width: 100%;"
                  @focus="showPopover('1')"
                >
                  <el-input
                    v-model="searchForm.kscName"
                    placeholder="服务"
                    readonly
                    suffix-icon="el-select__caret el-input__icon el-icon-arrow-up"
                  />
                </div>
              </el-popover>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="searchForm.auditing"
                size="mini"
                clearable
                filterable
                placeholder="审核状态"
                style="width: 100%;"
                @change="getPriceList('')"
              >
                <el-option
                  v-for="item in auditList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-popover
                v-model="visible2"
                placement="bottom-start"
                trigger="click"
                @hide="hidePopover"
              >
                <div style="padding-right: 15px;">
                  <el-form-item
                    label="计费方式"
                    label-width="90px"
                  >
                    <el-radio-group v-model="searchForm.priceType">
                      <el-radio-button label="3">
                        全部
                      </el-radio-button>
                      <el-radio-button label="0">
                        按车型
                      </el-radio-button>
                      <el-radio-button label="1">
                        按托数
                      </el-radio-button>
                      <el-radio-button label="2">
                        按重量&方数
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item
                    label="地址类型"
                    label-width="90px"
                  >
                    <el-radio-group v-model="searchForm.addressType">
                      <el-radio-button label="5">
                        全部
                      </el-radio-button>
                      <el-radio-button label="0">
                        机场
                      </el-radio-button>
                      <el-radio-button label="1">
                        港口
                      </el-radio-button>
                      <el-radio-button label="2">
                        火车站
                      </el-radio-button>
                      <el-radio-button label="3">
                        海外仓
                      </el-radio-button>
                      <el-radio-button label="4">
                        私人地址
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item
                    label="有效时间"
                    label-width="90px"
                  >
                    <el-date-picker
                      v-model="searchForm.times"
                      :clearable="false"
                      unlink-panels
                      type="daterange"
                      align="left"
                      size="mini"
                      value-format="yyyy-MM-dd"
                      range-separator="~"
                      style="width:280px;"
                      start-placeholder="起始时间"
                      end-placeholder="截止时间"
                    />
                  </el-form-item>
                  <div
                    slot="footer"
                    style="text-align: right;"
                  >
                    <el-button @click="clearForm('2')">
                      清空
                    </el-button>
                    <el-button
                      type="primary"
                      @click="getPriceList('')"
                    >
                      筛选
                    </el-button>
                  </div>
                </div>
                <div
                  slot="reference"
                  class="el-select el-select--small"
                  style="width: 100%;"
                  @focus="showPopover('2')"
                >
                  <el-input
                    placeholder="全部筛选"
                    readonly
                    suffix-icon="el-select__caret el-input__icon el-icon-arrow-up"
                  />
                </div>
              </el-popover>
            </el-form-item>
          </el-form>
          <el-scrollbar
            v-loading="loading"
            style="height: calc(100vh - 275px);"
          >
            <div
              v-if="priceList.length === 0"
              class="empty"
              style="text-align: center;line-height: 50px;font-size: 12px;color: #909399;"
            >
              暂无报价
            </div>
            <div
              v-for="(item, index) in priceList"
              :key="index"
              shadow="hover"
              style="font-size: 12px;cursor: pointer"
              class="price-card"
              :class="{'active-card': selectCard.id === item.id}"
              @click="onSelectCard(item)"
            >
              <el-row>
                <el-col :span="1">
                  <el-tooltip
                    v-if="item.auditing === 1"
                    class="item"
                    effect="dark"
                    content="待审核"
                    placement="top-start"
                  >
                    <i
                      class="card-tips card-tip-blue"
                    />
                  </el-tooltip>
                  <el-tooltip
                    v-if="item.auditing === 2"
                    class="item"
                    effect="dark"
                    content="审核中"
                    placement="top-start"
                  >
                    <i
                      class="card-tips card-tip-y"
                    />
                  </el-tooltip>
                  <el-tooltip
                    v-if="item.auditing === 3"
                    class="item"
                    effect="dark"
                    content="已拒绝"
                    placement="top-start"
                  >
                    <i
                      class="card-tips card-tip-red"
                    />
                  </el-tooltip>
                  <el-tooltip
                    v-if="item.auditing === 4"
                    class="item"
                    effect="dark"
                    content="已通过"
                    placement="top-start"
                  >
                    <i
                      class="card-tips card-tip-success"
                    />
                  </el-tooltip>
                </el-col>
                <el-col
                  :span="23"
                  class="word-limit"
                >
                  {{ item.kscName }}
                </el-col>
              </el-row>
              <el-row style="margin: 10px 0;">
                <el-col
                  :span="3"
                >
                  供应商
                </el-col>
                <el-col
                  :span="21"
                >
                  {{ item.fromCustName }}
                </el-col>
              </el-row>
              <el-row style="margin: 10px 0;">
                <el-col
                  v-if="item.addressType !== '4'"
                  :span="4"
                >
                  起运地
                </el-col>
                <el-col
                  v-if="item.addressType !== '4'"
                  :span="20"
                  class="word-limit"
                  style="color:  #409EFF;"
                >
                  {{ formatTag(item, '1') }}
                </el-col>
                <el-col
                  v-else
                  :span="24"
                  class="word-limit"
                  style="color:  #409EFF;"
                >
                  {{ `${item.country.countryName || ''} ${item.country.stateName || ''} ${item.country.cityName || ''} ${item.country.countyName || ''}` }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <span
                    v-if="item.status === '1'"
                    class="btn-tip-success"
                  >
                    生效中
                  </span>
                  <span
                    v-else-if="item.status === '2'"
                    class="btn-tip-blue"
                  >
                    待生效
                  </span>
                  <span
                    v-else-if="item.status === '3'"
                    class="btn-tip-grey"
                  >
                    已失效
                  </span>
                </el-col>
                <el-col
                  :span="12"
                  style="line-height: 16px;"
                >
                  {{ dayjs(item.startTime).format('YYYY-MM-DD') + '/' + dayjs(item.endTime).format('YYYY-MM-DD') }}
                </el-col>
                <el-col
                  :span="8"
                  style="text-align: right;"
                >
                  <span class="border-tip-blue">
                    {{ formatTag(item) }}
                  </span>
                </el-col>
              </el-row>
            </div>
          </el-scrollbar>
        </div>
        <div style="text-align: right">
          <el-pagination
            small
            layout="total,prev, pager, next"
            :total="pagination.total"
            :page-size="pagination.size"
            :current-page="pagination.page"
            @current-change="currentChange"
          />
        </div>
      </div>
    </app-slide>
    <div style="display: flex;align-items: center;">
      <div
        class="arrow-btn"
        @click="toggle"
      >
        <img
          :class="{arrow: !isActive}"
          src="@/assets/imgs/arrow_left.png"
          alt
        >
      </div>
    </div>
    <div
      v-if="showAddForm"
      v-loading="loadingForm"
      style="flex: 1;overflow: auto;margin: 15px;background-color: #fff;padding: 20px;"
    >
      <el-form
        ref="editForm"
        :model="selectForm"
        :rules="formRules"
        label-width="90px"
        label-position="right"
        size="mini"
        class="select-form"
      >
        <el-row>
          <el-col :span="21">
            <el-form-item
              label="业务类型："
              prop="subtypeId"
            >
              <el-select
                v-model="selectForm.subtypeId"
                style="width:150px;"
                :disabled="isView"
                clearable
                filterable
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
            <el-popover
              placement="bottom-start"
              trigger="click"
            >
              <div style="padding-right: 15px;">
                <el-form-item
                  label="国家："
                  prop="countryId"
                >
                  <el-select
                    v-model="selectForm.countryId"
                    :loading="selectLoading"
                    size="mini"
                    clearable
                    filterable
                    placeholder="请选择"
                    :disabled="isView"
                    style="width: 200px;"
                    @change="onCountryChange"
                  >
                    <el-option
                      v-for="item in countryList"
                      :key="item.id"
                      :label="`${item.name}-${item.alias}`"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="州/省"
                  prop="stateId"
                >
                  <el-select
                    v-model="selectForm.stateId"
                    :loading="selectLoading"
                    placeholder="请选择"
                    clearable
                    :disabled="!selectForm.countryId || isView"
                    filterable
                    style="width: 200px;"
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
                </el-form-item>
                <el-form-item
                  label="城市"
                  prop="cityId"
                >
                  <el-select
                    v-model="selectForm.cityId"
                    :loading="selectLoading"
                    placeholder="请选择"
                    clearable
                    :disabled="!selectForm.stateId || isView"
                    filterable
                    style="width: 200px;"
                    @focus="getCityList"
                    @change="onCityChange"
                  >
                    <el-option
                      v-for="item in cityList"
                      :key="item.id"
                      :label="`${item.name}-${item.alias}`"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </div>
              <el-form-item
                slot="reference"
                label="国家/省市："
                prop="countryId"
              >
                <el-button
                  type="text"
                  size="mini"
                  style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap"
                >
                  {{ selectForm.cityName ?
                    selectForm.cityName : selectForm.stateName ?
                      selectForm.stateName : selectForm.countryName ?
                        selectForm.countryName : '请选择' }}
                </el-button>
              </el-form-item>
            </el-popover>
            <el-form-item
              prop="kscId"
            >
              <span slot="label">
                <span>服务</span>
                <el-tooltip
                  v-show="selectService.label"
                  slot="label"
                  :content="selectService.label + '/' + selectService.ksId"
                  placement="top"
                  effect="light"
                >
                  <i class="el-icon-warning-outline" />
                </el-tooltip>
                <span>：</span>
              </span>
              <el-select
                v-model="selectForm.kscId"
                style="width:150px;"
                clearable
                filterable
                :disabled="isView"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in serviceList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="供应商："
            >
              {{ selectForm.fromCustName }}
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-select
              v-model="edition"
              clearable
              filterable
              placeholder="历史版本"
              size="mini"
              style="width:100%;"
              @focus="getEditionList"
              @change="viewHistoryPrice"
            >
              <el-option
                v-for="(item, index) in editionList"
                :key="index"
                :label="dayjs(item.startTime).format('YYYY-MM-DD') + '/' + dayjs(item.endTime).format('YYYY-MM-DD')"
                :value="item.id"
              />
            </el-select>
          </el-col>
        </el-row>
        <div class="service-info">
          <el-form-item
            label="计费方式："
          >
            <span v-if="selectService.priceType === '0'">
              车型
            </span>
            <span v-else-if="selectService.priceType === '1'">
              托数
            </span>
            <span v-else-if="selectService.priceType === '2'">
              重量&方数
            </span>
            <span v-else>
              --
            </span>
          </el-form-item>
          <el-form-item
            v-if="selectService.addressType !== '4'"
            label="起运地址："
          >
            {{ selectService.addressName || '--' }}
          </el-form-item>
          <el-form-item
            label="距离单位："
          >
            <span>
              {{ formattUnit(selectService.umDistance, umDistanceList) }}
            </span>
          </el-form-item>
          <el-form-item
            label="重量单位："
          >
            <span>
              {{ formattUnit(selectService.umWeight, umWeightList) }}
            </span>
          </el-form-item>

          <el-form-item
            label="体积单位："
          >
            <span>
              {{ formattUnit(selectService.umVolume, umVolumeList) }}
            </span>
          </el-form-item>

          <el-form-item
            label="货币单位："
          >
            {{ formattCurrency(selectService.currencyId) }}
          </el-form-item>
        </div>
        <el-row>
          <el-col :span="20">
            <el-form-item
              label="有效时间："
              label-width="100px"
            >
              <el-date-picker
                v-model="selectForm.times"
                :disabled="isView"
                :clearable="false"
                unlink-panels
                type="daterange"
                align="left"
                size="mini"
                value-format="yyyy-MM-dd"
                range-separator="~"
                style="width:280px;"
                start-placeholder="起始时间"
                end-placeholder="截止时间"
              />
            </el-form-item>
            <el-form-item
              label="单票最低收费："
              label-width="130px"
              prop="floorPrice"
            >
              <el-input-number
                v-model="selectForm.floorPrice"
                :disabled="isView"
                class="input-number-valiate"
                :controls="false"
                placeholder="请输入"
                :min="0"
                :max="999999"
                :precision="2"
                size="mini"
              />
            </el-form-item>
          </el-col>
          <el-col
            v-if="!edition"
            :span="4"
            style="text-align: right"
          >
            <el-popover
              v-if="selectCard.auditing === 2"
              v-model="visibleAudit"
              placement="bottom-start"
              trigger="click"
              @hide="hidePopover"
            >
              <div style="padding-right: 15px;">
                <el-form-item
                  label="通过/拒绝："
                  prop="status"
                  label-width="110px"
                >
                  <el-radio-group v-model="selectForm.status">
                    <el-radio label="4">
                      通过
                    </el-radio>
                    <el-radio label="3">
                      拒绝
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  v-if="selectForm.status === '3'"
                  label="拒绝原因："
                  prop="note"
                  label-width="110px"
                >
                  <el-input
                    v-model="selectForm.note"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入拒绝原因"
                  />
                </el-form-item>
                <div
                  slot="footer"
                  style="text-align: right;"
                >
                  <el-button @click="hidePopover">
                    取消
                  </el-button>
                  <el-button
                    type="primary"
                    @click="auditPrice"
                  >
                    确认
                  </el-button>
                </div>
              </div>
              <el-button
                slot="reference"
                type="text"
                size="mini"
                style="margin-right: 10px"
              >
                审核
              </el-button>
            </el-popover>
            <span
              v-if="selectCard.auditing === 1"
            >
              <el-button
                type="text"
                size="mini"
                style="margin-right: 10px"
                @click="auditPrice"
              >
                审核
              </el-button>
            </span>
          </el-col>
          <el-col
            v-if="selectCard.auditing === 3"
            :span="24"
          >
            <el-form-item
              label="拒绝原因："
            >
              <span>
                {{ selectCard.reason }}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div
        v-loading="loadingTable"
        style="min-height: 200px"
      >
        <vxe-table
          v-if="aAxisData.length"
          :data="tableData"
          height="520"
          style="width: 100%;"
          border
          resizable
          size="small"
          :auto-resize="true"
        >
          <vxe-table-column
            width="200"
            :show-overflow="true"
            :show-header-overflow="true"
            class-name="first-col-header"
            :resizable="true"
          >
            <template
              slot="header"
            >
              <span
                class="header-column"
              >
                {{ selectService.addressType === '4' ? '里程' : '目的地' }}
              </span>
              <span> \ </span>
              <span v-if="selectService.priceType === '0'">
                车型
              </span>
              <span v-if="selectService.priceType === '1'">
                托数
              </span>
              <span v-if="selectService.priceType === '2'">
                重量&方数
              </span>
            </template>
            <template slot-scope="scope">
              {{ scope.row.label }}
            </template>
          </vxe-table-column>
          <template v-if="selectService.priceType !== '2'">
            <vxe-table-column
              v-for="(item,index) in aAxisData"
              :key="index"
              :title="item.label"
              :prop="item.value"
              :show-overflow="true"
              :resizable="true"
            >
              <template slot-scope="scope">
                <div v-if="item.value !== 'remark'">
                  <span>
                    {{ scope.row[item.value] }}
                  </span>
                </div>
                <div v-else>
                  <span>
                    {{ scope.row.remark }}
                  </span>
                </div>
              </template>
            </vxe-table-column>
          </template>
          <template v-else>
            <vxe-table-colgroup
              v-for="(aAxis,i) in aAxisDataPlanar"
              :key="i"
              :title="i === 0 ? ' 重量' : '方数'"
              align="center"
              :show-overflow="true"
            >
              <vxe-table-column
                v-for="(item,index) in aAxis"
                :key="index"
                :title="item.label"
                :prop="item.value"
                :show-overflow="true"
                :resizable="true"
              >
                <template slot-scope="scope">
                  <div>
                    <span>
                      {{ scope.row[item.value] }}
                    </span>
                  </div>
                </template>
              </vxe-table-column>
            </vxe-table-colgroup>
            <vxe-table-column
              title="备注"
              align="center"
              :show-overflow="true"
              :resizable="true"
            >
              <template slot-scope="scope">
                <div>
                  <span>
                    {{ scope.row.remark }}
                  </span>
                </div>
              </template>
            </vxe-table-column>
          </template>
        </vxe-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import { getWordsList } from '@/api/service-with-booking-service'
import {
  getCountryList,
  getStateByCountry,
  getCityByState,
  getServiceSubtypeList,
  geCurrencyList,
  getCarServeList,
  getSupplierPriceList,
  auditPrice,
  getHistoryPriceList,
  getHistoryPrice
} from '@/api/price-to-car'

import dayjs from 'dayjs'

@Component({
  name: 'price-car',
  components: {
  },
  props: {
    priceTypeList: {
      type: Array,
      default: () => ([])
    },
    supplierList: {
      type: Array,
      default: () => ([])
    },
    priceType: {
      type: String,
      default: ''
    }
  }
})
export default class PriceCar extends Vue {
  /** data */
  private edition: string = ''

  private isActive: boolean = true
  private selectLoading: boolean = false
  private myPopoverVisible: boolean = false
  private loadingTable: boolean = false
  private loading: boolean = false
  private visible: boolean = false
  private visible2: boolean = false
  private visibleAudit: boolean = false
  private showAddForm: boolean = false
  private loadingForm: boolean = false
  private isView: boolean = true

  private formRules: any = {
    refStandardId: [{ required: true, message: '请选择参考标准报价', trigger: 'change' }],
    subtypeId: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
    kscId: [{ required: true, message: '请选择服务', trigger: 'change' }],
    ifStandard: [{ required: true, message: '请选择价格标准', trigger: 'change' }],
    associatedAgents: [{ required: true, message: '请选择关联代理商', trigger: 'change' }],
    times: [{ required: true, message: '请选择有效时间', trigger: 'change' }],
    toCustSubtype: [{ required: true, message: '请选择报价对象', trigger: 'change' }],
    status: [{ required: true, message: '请选择通过/拒绝', trigger: 'change' }],
    floorPrice: [{ required: true, message: '请输入单票最低收费', trigger: 'change' }],
    note: [{ required: true, message: '请填写拒绝原因', trigger: 'change' }]
  }
  private searchForm: any = {
    custId: undefined,
    subtypeId: undefined,
    countryId: undefined,
    service: undefined,
    kscId: undefined,
    kscName: '',
    auditing: undefined,
    ifStandard: '0',
    priceType: '3',
    addressType: '5',
    times: []
  }
  private selectForm: any = {
    fromCustName: '',
    cityId: '',
    stateId: '',
    countryId: undefined,
    countryName: '',
    cityName: '',
    stateName: '',
    redId: undefined,
    refStandardId: undefined,
    subtypeId: undefined,
    kscId: undefined,
    toCustSubtype: undefined,
    ifStandard: true,
    associatedAgents: [],
    times: [],
    status: '4',
    floorPrice: 0,
    note: ''
  }
  private selectCard: any = {}
  private selectService: any = {}
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  private dayjs: any = dayjs

  private aAxisData: any[] = []
  private aAxisDataPlanar: any[] = []
  private tableData: any[] = []
  private editionList: any[] = []
  private countryList: any[] = []
  private selectAddresList: any[] = []
  private stateList: any[] = []
  private cityList: any[] = []
  private priceList: any[] = []
  private auditList: any[] = [
    {
      label: '待审核',
      value: 1
    },
    {
      label: '审核中',
      value: 2
    },
    {
      label: '已拒绝',
      value: 3
    },
    {
      label: '已通过',
      value: 4
    }
  ]
  private typeList: any[] = []
  private serviceList: any[] = []
  private currencyList: any[] = []
  private umDistanceList: any[] = []
  private umWeightList: any[] = []
  private umVolumeList: any[] = []
  /** computed */
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
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }
  get custSubtype(): string {
    const info = UserModule.info || {}
    const custSubtype = (info as any).custSubtype
    return custSubtype
  }

  /** methods */
  private priceTypeChange(val: any) {
    this.myPopoverVisible = false
    this.$emit('priceTypeChange', val)
  }
  private formattPriceType(val: any, list: any[]) {
    const unit = list.find((e: any) => e.value === val)
    return unit ? `${unit.label}` : '--'
  }
  private auditPrice() {
    // 审核
    let params: any = {}
    if (this.selectCard.auditing === 1) {
      params = {
        id: this.selectCard.id,
        tag: 2,
        reason: this.selectForm.note
      }
    } else {
      const editForm: any = this.$refs.editForm
      const list: string[] = ['status']
      if (this.selectForm.status === '3') {
        list.push('note')
      }
      const errMsgList: any[] = []
      editForm.validateField(list, (errMsg: any) => {
        if (errMsg) {
          errMsgList.push(errMsg)
        }
      })
      if (errMsgList.length === 0) {
        params = {
          id: this.selectCard.id,
          tag: this.selectForm.status,
          reason: this.selectForm.note
        }
      } else {
        return
      }
    }
    this.visibleAudit = false
    this.loadingTable = true
    auditPrice(params).then((res: any) => {
      this.loadingTable = false
      if (res.success) {
        this.selectService = {}
        this.selectCard = {}
        this.selectForm = {
          refId: undefined,
          refStandardId: undefined,
          subtypeId: undefined,
          kscId: undefined,
          toCustSubtype: undefined,
          ifStandard: true,
          associatedAgents: [],
          times: [],
          status: '4',
          note: ''
        }
        this.showAddForm = false
        this.$message.success('操作成功')
        this.getPriceList(params.id)
      }
    }).catch((err: any) => {
      this.loadingTable = false
      return err
    })
  }
  private getPriceById(id: any) {
    return new Promise((resolve: any, reject: any) => {
      const params = {
        id
      }
      getHistoryPrice(params).then((res: any) => {
        if (res.success) {
          resolve(res.data || {})
        } else {
          reject(res)
        }
      }).catch((err: any) => {
        reject(err)
      })
    })
  }
  private async viewHistoryPrice(val: any) {
    if (val) {
      this.loadingForm = true
      this.getPriceById(val).then((res: any) => {
        this.loadingForm = false
        const result = this.getAxisBySuperiorPriceAndView(res.excelModelList)
        this.aAxisData = result.aAxisData
        this.aAxisDataPlanar = result.aAxisDataPlanar
        this.tableData = result.tableData
      }).catch(_ => {
        this.loadingForm = false
      })
    } else {
      await this.onSelectCard(this.selectCard)
    }
  }
  private getEditionList() {
    const params = {
      id: this.selectCard.id
    }
    this.editionList = []
    this.selectLoading = true
    getHistoryPriceList(params).then((res: any) => {
      this.selectLoading = false
      if (res.success) {
        this.editionList = res.data || []
      }
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }
  private async onSelectCard(card: any) {
    if (this.loadingForm) return
    this.selectCard = {
      ...card
    }
    this.edition = ''
    this.aAxisData = []
    this.aAxisDataPlanar = []
    this.tableData = []
    this.showAddForm = true
    this.setTableForm(card)
    this.loadingForm = true
    try {
      await this.getSubtypeList()
      await this.getStateList()
      await this.getCityList()
      await this.getServiceList('select')
    } catch (error) {
      this.loadingForm = false
    }
    this.selectService = this.serviceList.find((e: any) => e.id === card.kscId) || {}
    const result = this.getAxisBySuperiorPriceAndView(card.excelModelList)
    this.aAxisData = result.aAxisData
    this.aAxisDataPlanar = result.aAxisDataPlanar
    this.tableData = result.tableData
    this.loadingForm = false
  }
  private getAxisBySuperiorPriceAndView(aAxisList: any) {
    let list = JSON.parse(JSON.stringify(aAxisList))
    if (list.length === 0) {
      return {
        tableData: [],
        aAxisData: [],
        aAxisDataPlanar: []
      }
    }
    list = list.map((item: any) => {
      if (item.pricelist.length) {
        item.pricelist = item.pricelist.map((e: any) => {
          return {
            code: e.codex,
            max: e.maxx,
            min: e.minx,
            name: e.namex,
            price: e.price,
            type: e.type
          }
        })
      }
      return {
        isSuperiorPrice: item.isSuperiorPrice || false,
        code: item.codey,
        max: item.maxy,
        min: item.miny,
        name: item.namey,
        pricelist: item.pricelist,
        remark: item.remark
      }
    })
    let aAxisData = list[0].pricelist.map((item: any, i: any) => {
      const tamp: any = {
        value: 'x' + i,
        ...item
      }
      if (this.selectService.priceType === '0') {
        tamp.label = item.name
      } else {
        tamp.label = item.min + ' - ' + item.max
      }
      return tamp
    })
    let aAxisDataPlanar: any[] = []
    if (this.selectService.priceType === '2') {
      aAxisDataPlanar = [aAxisData.filter((item: any) => item.type === '0'), aAxisData.filter((item: any) => item.type === '1')]
    }
    const tableData = list.map((item: any) => {
      let tamp: any = {
        label: '',
        remark: item.remark
      }
      item.pricelist.forEach((x: any, i: any) => {
        tamp['x' + i] = x.price || undefined
      })
      if (this.selectService.addressType === '4') {
        // 里程
        tamp.label = item.min + ' - ' + item.max
        tamp = Object.assign(tamp, { ...item })
      } else {
        // 固定地址
        tamp.label = item.name
        tamp = Object.assign(tamp, { ...item })
      }
      return tamp
    })
    aAxisData = [...aAxisData, {
      label: '备注',
      value: 'remark'
    }]
    return {
      tableData,
      aAxisData,
      aAxisDataPlanar
    }
  }
  private setTableForm(result: any) {
    const editForm: any = this.$refs.addForm
    editForm && editForm.clearValidate()
    this.selectAddresList = []
    this.selectForm.floorPrice = result.floorPrice
    this.selectForm.toCustSubtype = result.toCustSubtype
    this.selectForm.toCustType = result.toCustType
    this.selectForm.subtypeId = result.subtypeId
    this.selectForm.fromCustName = result.fromCustName
    this.selectForm.countryId = result.country.countryId
    this.selectForm.countryName = result.country.countryName
    this.selectForm.cityName = result.country.cityName
    this.selectForm.stateName = result.country.stateName
    this.selectForm.stateId = result.country.stateId
    this.selectForm.cityId = result.country.cityId
    this.selectForm.associatedAgents = result.associatedAgents
    this.selectForm.kscId = result.kscId
    this.selectForm.ifStandard = result.ifStandard
    this.selectForm.refStandardId = result.refStandard
    this.selectForm.times = [dayjs(result.startTime).format('YYYY-MM-DD'), dayjs(result.endTime).format('YYYY-MM-DD')]
    const selectAddresList = []
    if (this.selectForm.countryName) {
      selectAddresList.push(this.selectForm.countryName)
    }
    if (this.selectForm.stateName) {
      selectAddresList.push(this.selectForm.stateName)
    }
    if (this.selectForm.cityName) {
      selectAddresList.push(this.selectForm.cityName)
    }
    this.selectAddresList = selectAddresList
  }
  private showPopover(type: string) {
    if (type === '1') {
      this.visible = true
    } else {
      this.visible2 = true
    }
  }
  private clearForm(type: string) {
    if (type === '1') {
      this.searchForm.custId = undefined
      this.searchForm.countryId = undefined
      this.searchForm.kscId = undefined
      this.searchForm.kscName = ''
    } else {
      this.searchForm.times = []
      this.searchForm.addressType = '5'
      this.searchForm.priceType = '3'
      this.searchForm.ifStandard = '0'
    }
    this.getPriceList()
  }
  private onService(val: any) {
    this.searchForm.kscName = (this.serviceList.find((e: any) => e.id === val) || {}).label
  }
  private countryChange(val: any) {
    this.searchForm.kscId = undefined
    this.searchForm.kscName = ''
  }
  private async getServiceList(type: string) {
    const params: any = {
      page: 1,
      size: 9999,
      model: {}
    }
    if (type === 'search') {
      params.model.subtypeId = this.searchForm.subtypeId
      params.model.countryId = this.searchForm.countryId
    } else {
      params.model.subtypeId = this.selectForm.subtypeId
      params.model.countryId = this.selectForm.countryId
      params.model.stateId = this.selectForm.stateId
      params.model.cityId = this.selectForm.cityId
    }
    this.selectLoading = true
    await getCarServeList(params).then((res: any) => {
      this.selectLoading = false
      if (res.success) {
        const data = res.data || {}
        const result = data.result || []
        this.serviceList = result.map((it: any) => {
          it.label = `${it.name}(${it.abbr})`
          return it
        })
      }
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }
  private currentChange(val: any) {
    this.pagination.page = val
    this.getPriceList()
  }
  private async getSubtypeList() {
    this.selectLoading = true
    await getServiceSubtypeList({ typeId: '01' }).then((res: any) => {
      this.selectLoading = false
      if (res.success) {
        this.typeList = res.data || []
      }
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }
  private hidePopover() {
    this.visible = false
    this.visible2 = false
    this.visibleAudit = false
    this.myPopoverVisible = false
  }

  private getCountryList() {
    this.selectLoading = true
    getCountryList().then((res: any) => {
      this.selectLoading = false
      if (res.success) {
        const data = res.data || {}
        this.countryList = data.result || []
      }
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }
  private async getStateList() {
    if (!this.selectForm.countryId) return
    this.selectLoading = true
    await getStateByCountry(this.selectForm.countryId).then((res: any) => {
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
    if (!this.selectForm.stateId) return
    this.selectLoading = true
    await getCityByState(this.selectForm.stateId).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      const result = data.result || []
      this.cityList = result
    }).catch(() => {
      this.cityList = []
      this.selectLoading = false
    })
  }
  private async onCountryChange(val: any) {
    const item = this.countryList.find((e: any) => e.id === val) || {}
    this.selectForm.countryName = item.name
    this.selectForm.stateId = ''
    this.selectForm.cityId = ''
    this.selectForm.stateName = ''
    this.selectForm.cityName = ''
  }

  private onStateChange(val: any) {
    const item = this.stateList.find((e: any) => e.id === val) || {}
    this.selectForm.stateName = item.name
    this.selectForm.cityId = ''
    this.selectForm.cityName = ''
  }
  private onCityChange(val: any) {
    const item = this.cityList.find((e: any) => e.id === val) || {}
    this.selectForm.cityName = item.name
  }

  private formatTag(item: any, type?: string) {
    let priceTypeStr = ''
    let addressTypeStr = ''
    const subTypeStr = (this.typeList.find((e: any) => e.id === item.subtypeId) || {}).name
    switch (item.priceType) {
      case '0':
        priceTypeStr = '车型'
        break
      case '1':
        priceTypeStr = '托数'
        break
      case '2':
        priceTypeStr = '重量&方数'
        break
      default:
        priceTypeStr = ''
    }
    switch (item.addressType) {
      case '0':
        addressTypeStr = '机场'
        break
      case '1':
        addressTypeStr = '港口'
        break
      case '2':
        addressTypeStr = '火车站'
        break
      case '3':
        addressTypeStr = '海外仓'
        break
      case '4':
        addressTypeStr = '里程'
        break
      default:
        addressTypeStr = ''
    }
    if (type === '1') {
      if (addressTypeStr) {
        return item.addressName + ' - ' + addressTypeStr
      }
      return item.addressName
    }
    return `${subTypeStr} - ${priceTypeStr}`
  }
  private getPriceList(id?: any) {
    this.visible = false
    this.visible2 = false
    this.showAddForm = false
    const params = {
      model: {
        subtypeId: this.searchForm.subtypeId,
        custId: this.searchForm.custId,
        kscId: this.searchForm.kscId,
        ifStandard: this.searchForm.ifStandard === '0' ? '' : this.searchForm.ifStandard,
        auditing: this.searchForm.auditing,
        addressType: this.searchForm.addressType === '5' ? '' : this.searchForm.addressType,
        priceType: this.searchForm.priceType === '3' ? '' : this.searchForm.priceType,
        startTime: this.searchForm.times[0] ? this.searchForm.times[0] + ' 00:00:00' : '',
        endTime: this.searchForm.times[1] ? this.searchForm.times[1] + ' 23:59:59' : ''
      },
      page: this.pagination.page,
      size: this.pagination.size
    }
    this.selectCard = {}
    this.loading = true
    getSupplierPriceList(params).then(async(res: any) => {
      this.loading = false
      if (res.success) {
        const data = res.data || {}
        const priceList = data.result || []
        this.priceList = priceList.map((item: any) => {
          if (item.effective === 2) {
            item.status = '1'
          }
          if (item.effective === 1) {
            item.status = '2'
          }
          if (item.effective === 9) {
            item.status = '3'
          }
          return item
        }).sort((a: any, b: any) => a.status * 1 - b.status * 1)
        this.pagination.total = data.total || 0
        if (id) {
          const price = this.priceList.find((e: any) => e.id === id)
          if (price) {
            await this.onSelectCard(price)
          }
        }
      }
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }
  private toggle() {
    this.isActive = !this.isActive
  }
  private formattCurrency(id: any) {
    const currency = this.currencyList.find((e: any) => e.id === id)
    return currency ? `${currency.name}(${currency.sign})` : '--'
  }
  private formattUnit(val: any, list: any[]) {
    const unit = list.find((e: any) => e.value === val)
    return unit ? `${unit.label} - ${unit.value}` : '--'
  }
  private geCurrencyList() {
    const params = {
      page: 1,
      size: 999
    }
    geCurrencyList(params).then((res: any) => {
      const data = res.data || {}
      this.currencyList = data.result || []
    }).catch((err: any) => {
      return err
    })
  }
  private getUmDistanceList() {
    this.selectLoading = true
    getWordsList({ type: 'DISTANCE_TYPE' }).then((res: any) => {
      this.selectLoading = false
      if (res.success) {
        this.umDistanceList = res.data || []
      }
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }
  private getUmWeightList() {
    this.selectLoading = true
    getWordsList({ type: 'weight_type' }).then((res: any) => {
      this.selectLoading = false
      if (res.success) {
        this.umWeightList = res.data || []
      }
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }
  private getUmVolumeList() {
    this.selectLoading = true
    getWordsList({ type: 'VOLUME_TYPE' }).then((res: any) => {
      this.selectLoading = false
      if (res.success) {
        this.umVolumeList = res.data || []
      }
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }
  private async created() {
    this.loading = true
    await this.getSubtypeList()
    this.geCurrencyList()
    this.getPriceList()
    this.getUmDistanceList()
    this.getUmWeightList()
    this.getUmVolumeList()
    this.getCountryList()
  }
}
</script>

<style lang="scss" scoped>
  .search-form{
    .el-form-item{
      display: inline-block;
      vertical-align: top;
      padding-right: 2px;
      width: 25%;
      margin-bottom: 10px;
    }
    .el-checkbox{
      margin-right: 15px;
    }
  }

  .select-form{
    .el-form-item{
      display: inline-block;
      vertical-align: top;
    }
    .el-radio{
      margin-right: 15px;
    }
  }
  .service-info{
    background-color: #EAEEF4;
    margin-bottom: 10px;
    padding: 5px 0;
    .el-form-item{
      display: inline-block;
      vertical-align: top;
      margin: 0;
    }
  }

  .dialog-form{
    .el-form-item{
      display: inline-block;
      vertical-align: top;
      width: 50%;
      margin-bottom: 10px;
    }
  }

  ::v-deep .el-card__body{
    padding: 10px;
  }

  ::v-deep .el-input__inner{
    padding-left: 8px;
  }

  ::v-deep .el-transfer-panel{
    width: 40%;
    height: 100%;
  }

  ::v-deep .el-transfer{
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
  }

  ::v-deep .el-transfer-panel__list.is-filterable{
    display: flex;
    flex-flow: column nowrap;
    height: 100%;
  }

  ::v-deep .el-transfer-panel__body{
    height: 78%;
  }

  ::v-deep .select-form .el-form-item__label{
    padding: 0;
  }

  .card-tips{
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  .card-tip-blue{
    background-color: #2291E6;
  }

  .card-tip-y{
    background-color: #FF7D19;
  }

  .card-tip-red{
    background-color: #E12E2E;
  }

  .card-tip-success{
    background-color: #189800;
  }

  .word-limit{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .btn-tip-success{
    color: #13ce66;
    background-color: rgb(19, 206, 102, 0.2);
    display: inline-block;
    padding: 2px;
    border-radius: 2px;
  }

  .btn-tip-blue{
    color: #2291E6;
    background-color: rgb(34, 145, 230, 0.2);
    display: inline-block;
    padding: 2px;
    border-radius: 2px;
  }

  .btn-tip-grey{
    color: #909399;
    background-color: rgb(144, 147, 153, 0.2);
    display: inline-block;
    padding: 2px;
    border-radius: 2px;
  }

  .border-tip-blue{
    color: #409EFF;
    border: 1px solid #409EFF;
    display: inline-block;
    padding: 2px;
    border-radius: 2px;
  }

  .table-header-title{
    display: inline-block;
    border: 1px solid #ccc;
    background: linear-gradient(45deg, transparent 49.5%, #ccc 49.5%, #ccc 50.5%, transparent 50.5%);
  }

  .input-number-valiate{
    width: 100%;
    ::v-deep .el-input__inner{
      text-align: left;
    }
  }

  .item-after-icon{
    position: relative;
    padding-bottom: 15px;
    .item-icon-plus{
      position: absolute;
      top: 6px;
      color: #409eff;
      font-size: 18px;
      margin-left: 10px;
      cursor: pointer;
    }
    .item-icon-reduce{
      position: absolute;
      top: 6px;
      color: #f56c6c;
      font-size: 18px;
      margin-left: 10px;
      cursor: pointer;
    }
  }

  .first-col-header{
    position: relative;
    &:before{
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      border-bottom: 10px solid red;
    }
  }

  .price-card{
    width: 100%;
    border-radius: 4px;
    border: 1px solid #E6E6E6;
    padding: 10px;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
    font-size: 12px;
    margin-bottom: 10px;
    transition: all .3s;
    &:hover{
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .2);
    }
  }

  .active-card{
    background: #FFFAF5;
    border-color: #FF7D19;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  }

  ::v-deep .el-table .success-row{
    background-color: #cee9ec !important;
  }
</style>
