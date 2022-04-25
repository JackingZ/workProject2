<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <app-slide
      width="400"
      :is-active="isActive"
      style="margin: 15px 0 15px 15px;padding: 0;"
    >
      <div
        style="padding: 20px;"
      >
        <el-row>
          <el-col
            :span="12"
            style="line-height: 32px;"
          >
            拖车报价
          </el-col>
          <el-col
            :span="12"
            style="text-align: right;"
          >
            <el-button
              v-permission="['trailerQuoteAdd']"
              type="text"
              size="small"
              @click="showAddPriceForm"
            >
              新增报价
            </el-button>
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
                    label-width="50px"
                  >
                    <el-select
                      v-model="searchForm.countryId"
                      :loading="selectLoading"
                      size="mini"
                      clearable
                      filterable
                      placeholder="请选择"
                      style="width: 200px;"
                      @focus="getCountryList"
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
                    label-width="50px"
                  >
                    <el-select
                      v-model="searchForm.serviceId"
                      :disabled="!searchForm.countryId"
                      :loading="selectLoading"
                      size="mini"
                      clearable
                      filterable
                      placeholder="请选择"
                      style="width: 200px;"
                      @focus="getTrailerServeList('search')"
                      @change="(val) => serviceChange(val, 'search')"
                    >
                      <el-option
                        v-for="item in searchServiceList"
                        :key="item.id"
                        :label="item.label"
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
                      v-permission="['trailerQuoteQuery']"
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
                    v-model="searchForm.serviceName"
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
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
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
                    label="价格标准"
                    label-width="90px"
                  >
                    <el-radio-group v-model="searchForm.ifStandard">
                      <el-radio-button label="0">
                        全部
                      </el-radio-button>
                      <el-radio-button :label="true">
                        标准
                      </el-radio-button>
                      <el-radio-button :label="false">
                        特殊
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item
                    label="地址类型"
                    label-width="90px"
                  >
                    <el-radio-group v-model="searchForm.addressType">
                      <el-radio-button
                        v-for="item in addressTypeList"
                        :key="item.id"
                        :label="item.id"
                      >
                        {{ item.name }}
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
                      v-permission="['trailerQuoteQuery']"
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
              v-if="tableList.length === 0"
              class="empty"
              style="text-align: center;line-height: 50px;font-size: 12px;color: #909399;"
            >
              暂无报价
            </div>
            <div
              v-for="(item, index) in tableList"
              :key="index"
              style="font-size: 12px;cursor: pointer"
              class="price-card"
              :class="{'active-card': selectCardId === item.id}"
              @click="viewPrice(item)"
              @contextmenu.prevent="showMenu(item, $event)"
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
                  :span="18"
                  class="word-limit"
                >
                  {{ item.service.value }}
                </el-col>
                <el-col
                  v-if="item.ifStandard"
                  :span="5"
                  style="text-align: right;"
                >
                  标准报价
                </el-col>
                <el-col
                  v-else
                  :span="5"
                  style="text-align: right;display: flex;align-items: center;justify-content: flex-end"
                >
                  特殊报价
                  <!--<i
                    class="el-icon-warning-outline"
                    style="margin-left: 5px;color: #4C89CE;font-size: 16px"
                  />-->
                </el-col>
              </el-row>
              <el-row style="margin: 10px 0;">
                <el-col
                  :span="3"
                >
                  起运地
                </el-col>
                <el-col
                  :span="17"
                  class="word-limit"
                  style="color:  #409EFF;"
                >
                  {{ `${item.city || ''} ` + item.addressName }}
                </el-col>
                <el-col
                  :span="4"
                  style="text-align: right;"
                >
                  <span v-if="item.toType === '2'">代理商价</span>
                  <span v-else-if="item.toType === '1' && item.toSubtype === '0'">直客价</span>
                  <span v-else-if="item.toType === '1' && item.toSubtype === '1'">同行价</span>
                  <span v-else-if="item.toType === '3'">聚货通价</span>
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
                  :span="15"
                  style="line-height: 16px;"
                >
                  {{ dayjs(item.startTime).format('YYYY-MM-DD') + '/' + dayjs(item.endTime).format('YYYY-MM-DD') }}
                </el-col>
                <el-col
                  :span="5"
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
        ref="addForm"
        :model="selectForm"
        :rules="formRules"
        label-width="90px"
        label-position="right"
        size="mini"
        class="select-form"
      >
        <div style="display: flex;align-items: center;justify-content: space-between">
          <div style="flex: 1">
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
                @focus="getSubtypeList"
                @change="subTypeChange"
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
              label="所在国家："
              prop="selectCountryId"
            >
              <el-select
                v-model="selectForm.selectCountryId"
                :loading="selectLoading"
                size="mini"
                clearable
                filterable
                placeholder="请选择"
                :disabled="isView"
                style="width: 100px;"
                @focus="getCountryList"
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
              prop="serviceId"
            >
              <span slot="label">
                <span>服务</span>
                <el-tooltip
                  v-show="selectService.name"
                  slot="label"
                  :content="selectService.label + '/' + selectService.tsId"
                  placement="top"
                  effect="light"
                >
                  <i class="el-icon-warning-outline" />
                </el-tooltip>
                <span>：</span>
              </span>
              <el-select
                v-model="selectForm.serviceId"
                style="width:150px;"
                clearable
                filterable
                :disabled="isView"
                placeholder="请选择"
                @focus="getTrailerServeList('select')"
                @change="(val) => serviceChange(val, 'select')"
              >
                <el-option
                  v-for="item in selectServiceList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="报价对象："
              :prop="custType === '0' ? '' : 'toCustSubtype'"
            >
              <span v-if="custType === '0'">
                一级代理商
              </span>
              <!--<span v-else-if="custType === '3'">
                聚货通
              </span>-->
              <el-select
                v-else
                v-model="selectForm.toCustSubtype"
                style="width:100px;"
                clearable
                :disabled="isView"
                filterable
                placeholder="请选择"
                @change="custSubtypeChange"
              >
                <el-option
                  v-for="item in custList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="custType === '2'"
              label="参考报价："
            >
              <el-select
                v-model="selectForm.refId"
                style="width:150px;"
                :disabled="isView"
                clearable
                filterable
                placeholder="请选择"
                @change="superiorPriceChange"
                @focus="getSuperiorPrice"
              >
                <el-option
                  v-for="item in superiorPriceList"
                  :key="item.id"
                  :label="dayjs(item.startTime).format('YYYY-MM-DD') + '/' + dayjs(item.endTime).format('YYYY-MM-DD')"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <div
            v-if="(!selectCard.id || selectCard.auditing !== 4) && !selectForm.edition"
            style="margin-bottom: 18px;"
          >
            <el-button
              v-if="!isEdit && isView && (selectCard.auditing === 1 || selectCard.auditing === 3) && $checkPermission(['trailerQuoteEdit'])"
              type="text"
              size="mini"
              @click="editRow"
            >
              编辑
            </el-button>
            <el-popover
              v-if="!isEdit && isView && selectCard.auditing !== 4 && $checkPermission(['trailerQuoteAudit'])"
              v-model="visibleAudit"
              placement="bottom-start"
              trigger="click"
              @show="showAuditModal"
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
                style="margin: 0 10px"
              >
                审核
              </el-button>
            </el-popover>
            <el-button
              v-if="(!isView || isEdit) && $checkPermission(['trailerQuoteAdd', 'trailerQuoteEdit'])"
              type="text"
              size="mini"
              @click="cancelEdit"
            >
              取消
            </el-button>
            <el-button
              v-if="(isEdit || !isView) && $checkPermission(['trailerQuoteAdd', 'trailerQuoteEdit'])"
              type="text"
              size="mini"
              @click="savePrice"
            >
              保存
            </el-button>
            <el-button
              v-if="!isEdit && isView && (selectCard.auditing === 1 || selectCard.auditing === 3) && $checkPermission(['trailerQuoteDel'])"
              type="text"
              size="mini"
              style="margin-right: 10px"
              @click="deleteRow(1)"
            >
              删除
            </el-button>
          </div>
          <div
            v-if="(selectCard.id || selectForm.edition) && !isEdit"
            style="text-align: right;margin-bottom: 18px;"
          >
            <el-button
              v-if="$checkPermission(['trailerQuoteCopy'])"
              type="text"
              size="mini"
              @click="copyPrice"
            >
              复制此版本
            </el-button>
            <el-button
              v-if="selectCard.auditing === 4 && !selectForm.edition"
              type="text"
              size="small"
              style="margin-left: 10px"
              @click="invalidPrice"
            >
              失效
            </el-button>
          </div>
        </div>
        <div class="service-info">
          <el-form-item
            label="起运地址："
          >
            {{ selectService.addressName || '--' }}
          </el-form-item>
          <el-form-item
            label="货币单位："
          >
            {{ formattCurrency(selectService.currencyId) }}
          </el-form-item>
        </div>
        <el-row>
          <el-col :span="21">
            <el-popover
              v-if="selectService.endAddressType === 0"
              placement="bottom-start"
              trigger="click"
              @hide="hidePopover"
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
                <div
                  slot="footer"
                  style="text-align: right;"
                />
              </div>
              <el-form-item
                slot="reference"
                label="城市："
                class="is-required"
              >
                <el-button
                  type="text"
                  size="mini"
                  style="padding-right: 30px"
                >
                  {{ selectForm.cityName || '请选择' }}
                </el-button>
              </el-form-item>
            </el-popover>
            <el-form-item
              v-if="custType !== '3' || (custType === '3' && selectForm.toCustSubtype && selectForm.toCustSubtype !== '-1')"
              label="价格标准："
              prop="ifStandard"
            >
              <el-radio-group
                v-model="selectForm.ifStandard"
                :disabled="isView"
                @change="ifStandardChange"
              >
                <el-radio :label="true">
                  标准
                </el-radio>
                <el-radio :label="false">
                  特殊
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="!selectForm.ifStandard"
              :label="formLabel + '：'"
              prop="associatedAgents"
              label-width="100px"
            >
              <el-button
                type="text"
                size="mini"
                style="padding-right: 35px"
                @click="showModel('a')"
              >
                已选择({{ (selectForm.associatedAgents || []).length }})
              </el-button>
            </el-form-item>
            <el-form-item
              v-if="!selectForm.ifStandard"
              label="有效时间："
              prop="refStandardId"
            >
              <el-date-picker
                v-if="isView"
                v-model="selectForm.times"
                :clearable="false"
                unlink-panels
                type="daterange"
                align="left"
                size="mini"
                value-format="yyyy-MM-dd"
                range-separator="~"
                style="width:200px;"
                start-placeholder="起始时间"
                end-placeholder="截止时间"
                :picker-options="pickerOptions"
                :disabled="isView"
              />
              <el-select
                v-else
                v-model="selectForm.refStandardId"
                style="width:150px;"
                :disabled="isView"
                clearable
                filterable
                placeholder="请选择"
                @change="refStandardChange"
                @focus="getStandardPirce"
              >
                <el-option
                  v-for="item in refStandardList"
                  :key="item.id"
                  :label="dayjs(item.startTime).format('YYYY-MM-DD') + '/' + dayjs(item.endTime).format('YYYY-MM-DD')"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-show="selectForm.ifStandard"
              label="有效时间："
              prop="times"
            >
              <el-date-picker
                v-model="selectForm.times"
                :clearable="false"
                unlink-panels
                type="daterange"
                align="left"
                size="mini"
                value-format="yyyy-MM-dd"
                range-separator="~"
                style="width:200px;"
                start-placeholder="起始时间"
                end-placeholder="截止时间"
                :picker-options="pickerOptions"
                :disabled="!selectForm.ifStandard || (!isEdit && isView)"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="3"
            style="text-align: right"
          >
            <el-select
              v-if="isView && !isEdit"
              v-model="selectForm.edition"
              clearable
              filterable
              size="mini"
              placeholder="历史版本"
              style="width:100%;"
              @focus="getEditionList"
              @change="(val) => viewHistoryPrice(val, false)"
            >
              <el-option
                v-for="(item, index) in editionList"
                :key="index"
                :label="dayjs(item.startTime).format('YYYY-MM-DD') + '/' + dayjs(item.endTime).format('YYYY-MM-DD')"
                :value="item.id"
              />
            </el-select>
            <el-popover
              v-if="(!isView || isEdit) && custType === '2'"
              v-model="isShowPopover"
              placement="bottom"
              trigger="click"
              @show="showBatchAddForm"
            >
              <div style="padding:0 20px 0 10px;width: 240px;">
                <div>请输入需要批量修改的值</div>
                <el-input-number
                  v-model="addNumber"
                  class="input-number-valiate"
                  :controls="false"
                  placeholder="请输入"
                  :precision="2"
                  size="mini"
                  style="margin: 13px 0 26px 0"
                  @focus.stop="() => {}"
                />
                <div
                  slot="footer"
                  style="display: flex;justify-content: space-between"
                >
                  <el-button
                    type="text"
                    size="mini"
                    style="color: #FF6D00"
                    @click="addNumberChange(0)"
                  >
                    重置
                  </el-button>
                  <div style="text-align: right;">
                    <el-button
                      type="text"
                      size="mini"
                      style="color: #999999"
                      @click="hidePopover"
                    >
                      取消
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      @click="addNumberChange(1)"
                    >
                      保存
                    </el-button>
                  </div>
                </div>
              </div>
              <el-button
                slot="reference"
                type="text"
                size="mini"
              >
                批量修改
              </el-button>
            </el-popover>
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
          v-if="xAxis.length"
          :data="yAxis"
          height="630"
          style="width: 100%;margin: 10px 0;"
          border
          resizable
          size="small"
          :row-class-name="tableRowClassName"
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
              目的地\柜型
            </template>
            <template slot-scope="scope">
              {{ scope.row.label }}
            </template>
          </vxe-table-column>
          <vxe-table-column
            v-for="(item,index) in xAxis"
            :key="index"
            :title="item.label"
            :prop="item.value"
            :show-overflow="true"
            :resizable="true"
          >
            <template slot-scope="scope">
              <div v-if="item.value !== 'remark'">
                <el-input-number
                  v-if="!scope.row.isSuperiorPrice && (!isView || isEditRow)"
                  v-model="scope.row[item.value]"
                  class="input-number-valiate"
                  :controls="false"
                  placeholder="请输入"
                  :min="0"
                  :max="999999"
                  :precision="2"
                  size="mini"
                />
                <span v-else>
                  {{ scope.row[item.value] }}
                </span>
              </div>
              <div v-else>
                <el-input
                  v-if="!scope.row.isSuperiorPrice && (!isView || isEditRow)"
                  v-model="scope.row.remark"
                  placeholder="请输入"
                  size="mini"
                />
                <span v-else>
                  {{ scope.row.remark }}
                </span>
              </div>
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>
    </div>
    <transfer-modal
      ref="transferModal"
      :select-card="selectCard"
      :is-add-form="showAddForm"
      :is-edit="isEdit"
      :is-view="isView"
      :edition="!selectForm.edition"
      @save="transferModalSave"
    />
    <agent-price
      ref="AgentPrice"
      @close="closeAgentPrice"
    />
    <transition name="el-fade-in-linear">
      <div
        v-show="showAgentPriceModel && showAddForm && custType === '0' && $checkPermission(['trailerQuoteQuotation'])"
        v-drag
        class="agent-price"
      >
        <el-tooltip
          effect="dark"
          content="供应商报价"
          placement="top"
        >
          <i
            class="icon-price"
            @click="showAgentPrice"
          />
        </el-tooltip>
      </div>
    </transition>
    <ul
      v-show="isShowMenu"
      :style="{left: menuLeft+'px', top: menuTop+'px'}"
      class="contextmenu"
    >
      <li
        v-permission="['trailerQuoteCopy']"
        class="contextmenu-item"
        @click="viewPrice(showMenuRow, true)"
      >
        复制
      </li>
      <li
        v-permission="['trailerQuoteGet']"
        class="contextmenu-item"
        @click="viewPrice(showMenuRow)"
      >
        查看
      </li>
      <li
        v-if="(showMenuRow.auditing === 1 || showMenuRow.auditing === 3) && $checkPermission(['trailerQuoteDel'])"
        class="contextmenu-item"
        @click="deleteRow(2)"
      >
        删除
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getCountryList,
  getStateByCountry,
  getCityByState,
  getServiceSubtypeList,
  getTrailerServeList,
  getPriceList,
  geCurrencyList,
  addPrice,
  delPrice,
  auditPrice,
  editPrice,
  invalidPrice,
  getRefStandardPrice,
  getHistoryPriceList,
  getHistoryPrice,
  getSuperiorPrice
} from '@/api/price-to-trailer'
import dayjs from 'dayjs'
import transferModal from '@/views/price-management/price-trailer/components/transferModal.vue'
import AgentPrice from '@/views/price-management/price-trailer/components/agentPrice.vue'
import {
  getServiceCabinetList,
  getAddressList
} from '@/api/service-with-trailers-service'

@Component({
  name: '',
  components: {
    transferModal,
    AgentPrice
  },
  props: {}
})
export default class extends Vue {
  /** data */
  private selectCardId: string = ''
  private addNumber: any = ''
  private showMenuRow: any = {}
  private isShowMenu: boolean = false
  private isShowPopover: boolean = false
  private menuTop: number = 0
  private menuLeft: number = 0
  private optionBtnNum: number = 1
  private formLabel: string = '关联代理商'
  private city: string = ''
  private showAgentPriceModel: boolean = true
  private isActive: boolean = true
  private selectLoading: boolean = false
  private loading: boolean = false
  private visible: boolean = false
  private visible2: boolean = false
  private visibleAudit: boolean = false
  private showAddForm: boolean = false
  private loadingForm: boolean = false
  private loadingTable: boolean = false
  private isView: boolean = false
  private isEditRow: boolean = false
  private isEdit: boolean = false
  private tableList: any[] = []
  private editionList: any[] = []
  private superiorPriceList: any[] = []
  private refStandardList: any[] = []
  private typeList: any[] = []
  private auditList: any[] = [
    {
      name: '待审核',
      id: '1'
    },
    {
      name: '审核中',
      id: '2'
    },
    {
      name: '已拒绝',
      id: '3'
    },
    {
      name: '已通过',
      id: '4'
    }
  ]
  private addressTypeList: any[] = [
    {
      name: '全部',
      id: '99'
    },
    {
      name: '港口',
      id: '1'
    },
    {
      name: '火车站',
      id: '2'
    }
  ]
  private countryList: any[] = []
  private stateList: any[] = []
  private cityList: any[] = []
  private currencyList: any[] = []
  private searchServiceList: any[] = []
  private selectServiceList: any[] = []
  private yAxis: any[] = []
  private xAxis: any[] = []
  private custList: any[] = []
  private props: any = {
    label: 'name',
    value: 'id'
  }
  private searchForm: any = {
    subtypeId: undefined,
    countryId: undefined,
    serviceId: undefined,
    serviceName: '',
    auditing: undefined,
    ifStandard: '0',
    addressType: '99',
    times: []
  }
  private selectCard: any = {}
  private selectService: any = {}
  private selectForm: any = {
    selectCountryId: undefined,
    cityName: '',
    stateName: '',
    cityId: '',
    stateId: '',
    refId: undefined,
    edition: '',
    refStandardId: undefined,
    note: '',
    status: '4',
    countryId: undefined,
    countryName: '',
    serviceId: undefined,
    serviceName: '',
    subtypeId: undefined,
    toCustSubtype: undefined,
    ifStandard: true,
    associatedAgents: [],
    times: []
  }
  private formRules: any = {
    refId: [{ required: true, message: '请选择参考报价', trigger: 'change' }],
    refStandardId: [{ required: true, message: '请选择参考标准报价', trigger: 'change' }],
    subtypeId: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
    serviceId: [{ required: true, message: '请选择服务', trigger: 'change' }],
    toCustSubtype: [{ required: true, message: '请选择报价对象', trigger: 'change' }],
    associatedAgents: [{ required: true, message: '请选择报价对象', trigger: 'change' }],
    countryId: [{ required: true, message: '请选择国家', trigger: 'change' }],
    stateId: [{ required: true, message: '请选择州/省', trigger: 'change' }],
    cityId: [{ required: true, message: '请选择城市', trigger: 'change' }],
    times: [{ required: true, message: '请选择有效日期', trigger: 'change' }],
    status: [{ required: true, message: '请选择通过/拒绝', trigger: 'change' }],
    note: [{ required: true, message: '请填写拒绝原因', trigger: 'change' }]
  }
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  private dayjs: any = dayjs
  private pickerOptions: any = {
    disabledDate(time: any) {
      return dayjs(time) < dayjs()
    }
  }

  /** computed */
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

  get custType(): string {
    // 0-聚货通 1-客户 2-代理 3-供应商.长度1.
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }

  get custSubtype(): string {
    // custType=1时,custSubtype:0-直客,1-同行|custType=2时,custSubtype:1-一级代理,2-二级代理|custType=3时为空.长度2.
    const info = UserModule.info || {}
    const custSubtype = (info as any).custSubtype
    return custSubtype
  }
  @Watch('isShowMenu')
  private onIsShowMenuChange(value: boolean) {
    if (value) {
      document.body.addEventListener('click', this.closeMenu)
    } else {
      document.body.removeEventListener('click', this.closeMenu)
    }
  }

  /** methods */
  private addNumberChange(addNumber: any) {
    this.yAxis.map((item: any, index: number, list: any[]) => {
      if (index % 2 !== 0) {
        const superPrice: any = list[index - 1]
        this.xAxis.map((e: any) => {
          if (e.value !== 'remark') {
            if (addNumber === 0) {
              item[e.value] = undefined
            } else {
              item[e.value] = parseFloat((superPrice[e.value] + this.addNumber).toFixed(2))
            }
          }
        })
      }
    })
    if (addNumber === 0) {
      this.addNumber = undefined
    }
  }
  private showBatchAddForm() {
    this.addNumber = undefined
  }
  private currentChange(val: any) {
    this.pagination.page = val
    this.getPriceList()
  }
  private async copyPrice() {
    if (this.selectForm.edition) {
      await this.viewHistoryPrice(this.selectForm.edition, true)
    } else {
      await this.viewPrice(this.selectCard, true)
    }
  }
  private invalidPrice() {
    this.$confirm('该操作会使此报价及相关代理报价失效，请确认是否操作?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const params = {
        id: this.selectCard.id
      }
      const loading = this.$loading({
        lock: true,
        text: '',
        background: 'hsla(0,0%,100%,.9)'
      })
      invalidPrice(params).then(() => {
        loading.close()
        this.getPriceList()
      }).catch(() => {
        loading.close()
      })
    }).catch(() => {
      return false
    })
  }
  private showMenu(row: any, e: MouseEvent) {
    if (!(this as any).$checkPermission(['trailerQuoteGet', 'trailerQuoteCopy', 'trailerQuoteDel'])) return
    this.showMenuRow = row
    this.menuLeft = e.clientX
    this.menuTop = e.clientY
    this.isShowMenu = true
  }
  private closeMenu() {
    this.isShowMenu = false
  }
  private closeAgentPrice() {
    this.showAgentPriceModel = true
  }
  private showAgentPrice() {
    if (!this.selectForm.serviceId) {
      this.$message.warning('请选择服务')
      return
    }
    const agentPrice = this.$refs.AgentPrice as any
    const params = {
      city: this.selectForm.cityName,
      cityId: this.selectForm.cityId,
      province: this.selectForm.stateName,
      provinceId: this.selectForm.stateId,
      country: this.selectForm.countryName,
      countryId: this.selectForm.countryId,
      toSubtype: this.custSubtype,
      toType: this.custType,
      addressId: this.selectService.addressId,
      addressName: this.selectService.addressName,
      addressType: this.selectService.addressType,
      currencyId: this.selectService.currencyId,
      priceType: this.selectService.priceType,
      subtypeId: this.selectService.subtypeId,
      umDistance: this.selectService.umDistance,
      umVolume: this.selectService.umVolume,
      umWeight: this.selectService.umWeight,
      // associatedAgents: [],
      service: {
        key: this.selectService.id,
        value: this.selectService.label
      }
    }
    agentPrice.show(this.selectService, params)
    this.showAgentPriceModel = false
  }

  private getSuperiorPrice() {
    const list: string[] = ['countryId', 'stateId', 'cityId', 'serviceId', 'subtypeId']
    this.yAxis = []
    this.xAxis = []
    this.superiorPriceList = []
    if (this.validateService(list) === 0) {
      const params = {
        city: this.selectForm.cityName,
        cityId: this.selectForm.cityId,
        province: this.selectForm.stateName,
        provinceId: this.selectForm.stateId,
        country: this.selectForm.countryName,
        countryId: this.selectForm.countryId,
        toSubtype: this.custSubtype,
        toType: this.custType,
        addressId: this.selectService.addressId,
        addressName: this.selectService.addressName,
        addressType: this.selectService.addressType,
        currencyId: this.selectService.currencyId,
        priceType: this.selectService.priceType,
        subtypeId: this.selectService.subtypeId,
        umDistance: this.selectService.umDistance,
        umVolume: this.selectService.umVolume,
        umWeight: this.selectService.umWeight,
        // associatedAgents: [],
        service: {
          key: this.selectService.id,
          value: this.selectService.label
        }
      }
      this.loadingForm = true
      getSuperiorPrice(params).then((res: any) => {
        this.loadingForm = false
        if (res.success && res.data && res.data.length) {
          this.superiorPriceList = res.data || []
        } else {
          if (!this.isView) {
            this.$message.warning('暂无参考报价')
          }
        }
      }).catch((err: any) => {
        this.loadingForm = false
        return err
      })
    }
  }

  private superiorPriceChange(val: any) {
    this.yAxis = []
    this.xAxis = []
    const superiorPrice = this.superiorPriceList.find((e: any) => e.id === val)
    if (superiorPrice) {
      const list = superiorPrice.priceList.reduce((arr: any[], item: any) => {
        const data = JSON.parse(JSON.stringify(item))
        data.remark = ''
        item.isSuperiorPrice = true
        data.priceList = data.priceList.map((e: any) => {
          e.price = undefined
          return e
        })
        data.isSuperiorPrice = false
        arr.push(item)
        arr.push(data)
        return arr
      }, [])
      this.getAxisByView(list)
    }
  }

  private ifStandardChange() {
    this.refStandardList = []
    this.selectForm.times = []
    this.selectForm.refStandardId = ''
  }

  private getStandardPirce() {
    this.refStandardList = []
    if (!this.selectForm.ifStandard) {
      const list: string[] = ['countryId', 'stateId', 'cityId', 'serviceId', 'subtypeId']
      if (this.validateService(list) === 0) {
        const offerObject = this.getOfferObject()
        const params = {
          city: this.selectForm.cityName,
          cityId: this.selectForm.cityId,
          province: this.selectForm.stateName,
          provinceId: this.selectForm.stateId,
          country: this.selectForm.countryName,
          countryId: this.selectForm.countryId,
          toSubtype: offerObject.toCustSubtype,
          toType: offerObject.toCustType,
          addressId: this.selectService.addressId,
          addressName: this.selectService.addressName,
          addressType: this.selectService.addressType,
          currencyId: this.selectService.currencyId,
          priceType: this.selectService.priceType,
          subtypeId: this.selectService.subtypeId,
          umDistance: this.selectService.umDistance,
          umVolume: this.selectService.umVolume,
          umWeight: this.selectService.umWeight,
          // associatedAgents: [],
          service: {
            key: this.selectService.id,
            value: this.selectService.label
          }
        }
        this.loadingTable = true
        getRefStandardPrice(params).then((res: any) => {
          this.loadingTable = false
          if (res.success) {
            this.refStandardList = res.data || []
            if (!this.refStandardList.length) {
              this.$message.warning('暂无可参考的标准报价')
            }
          }
        }).catch((err: any) => {
          this.loadingTable = false
          return err
        })
      }
    }
  }

  private refStandardChange(val: any) {
    const refStandardItem = this.refStandardList.find((e: any) => e.id === val)
    this.selectForm.times = []
    if (refStandardItem) {
      this.selectForm.times = [dayjs(refStandardItem.startTime).format('YYYY-MM-DD'), dayjs(refStandardItem.endTime).format('YYYY-MM-DD')]
    }
  }

  private editRow() {
    this.optionBtnNum = 3
    this.isEdit = true
    this.isEditRow = true
  }

  private cancelEdit() {
    if (this.isView && this.isEdit) {
      if (this.selectCard.auditing === 1) {
        this.optionBtnNum = 3
      }
      if (this.selectCard.auditing === 3) {
        this.optionBtnNum = 2
      }
      this.showAddForm = true
      this.isView = true
      this.isEdit = false
      this.isEditRow = false
      this.selectForm.associatedAgents = this.selectCard.associatedAgents
    } else {
      this.selectCard = {}
      this.selectCardId = ''
      this.showAddForm = false
    }
  }

  // 删除
  private deleteRow(tag: number) {
    // 删除 tag 1为查看删除 2为右键
    const params = {
      id: tag === 1 ? this.selectCard.id : this.showMenuRow.id
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.loadingTable = true
        delPrice(params).then((res: any) => {
          this.loadingTable = false
          this.selectService = {}
          this.selectCard = {}
          this.selectForm = {
            cityName: '',
            cityId: '',
            stateId: '',
            stateName: '',
            edition: '',
            refId: undefined,
            refStandardId: undefined,
            note: '',
            status: '4',
            countryId: undefined,
            countryName: '',
            serviceId: undefined,
            serviceName: '',
            subtypeId: undefined,
            toCustSubtype: undefined,
            ifStandard: true,
            associatedAgents: [],
            times: []
          }
          this.showAddForm = false
          this.isView = false
          this.isEditRow = false
          this.isEdit = false
          this.$message.success('删除成功')
          this.getPriceList()
        }).catch((err: any) => {
          this.loadingTable = false
          return err
        })
      })
      .catch(() => {
        return false
      })
  }

  private showAuditModal() {
    const { auditing, reason } = this.selectCard
    if (auditing === 1) {
      const params = {
        id: this.selectCard.id,
        status: '2',
        reason: ''
      }
      auditPrice(params).then((res: any) => {
        this.tableList.map((it: any) => {
          if (it.id === this.selectCard.id) {
            it.auditing = 2
            this.selectCard.auditing = 2
          }
        })
      }).catch((err: any) => err)
    } else {
      this.selectForm.status = '4'
      this.selectForm.note = reason
    }
  }

  private auditPrice() {
    let params: any = {}
    const list: string[] = ['status']
    if (this.selectForm.status === '3') {
      list.push('note')
    }
    if (this.validateService(list) === 0) {
      params = {
        id: this.selectCard.id,
        status: this.selectForm.status,
        reason: this.selectForm.note
      }
    } else {
      return
    }
    params.fromCustId = this.selectCard.fromCustId
    params.fromCustName = this.selectCard.fromCustName
    this.visibleAudit = false
    this.loadingTable = true
    auditPrice(params).then((res: any) => {
      this.loadingTable = false
      if (res.success) {
        this.selectService = {}
        this.selectCard = {}
        this.selectForm = {
          cityName: '',
          cityId: '',
          stateId: '',
          stateName: '',
          edition: '',
          refId: undefined,
          refStandardId: undefined,
          note: '',
          status: '4',
          countryId: undefined,
          countryName: '',
          serviceId: undefined,
          serviceName: '',
          subtypeId: undefined,
          toCustSubtype: undefined,
          ifStandard: true,
          associatedAgents: [],
          times: []
        }
        this.showAddForm = false
        this.isView = false
        this.isEditRow = false
        this.isEdit = false
        this.$message.success('操作成功')
        this.getPriceList(params.id)
      }
    }).catch((err: any) => {
      this.loadingTable = false
      return err
    })
  }

  private async viewHistoryPrice(val: any, isCopy?: boolean) {
    if (!val) {
      await this.viewPrice(this.selectCard)
      return
    }
    this.getPriceById(val).then((superiorPrice: any) => {
      const priceList = superiorPrice.priceList || []
      if (superiorPrice.refId) {
        this.getPriceById(superiorPrice.refId).then((res: any) => {
          this.loadingForm = false
          const list = res.priceList.reduce((arr: any[], item: any) => {
            item.isSuperiorPrice = true
            arr.push(item)
            const data = priceList.find((e: any) => e.codeY === item.codeY)
            if (data) {
              arr.push(data)
            }
            return arr
          }, [])
          if (isCopy) {
            this.isView = false
            this.isEdit = false
            this.isEditRow = true
            this.selectCardId = ''
            this.selectCard = {}
            this.selectCard.auditing = undefined
            this.selectForm.refId = undefined
            this.selectForm.refStandardId = undefined
            this.selectForm.times = []
          } else {
            this.isView = true
            this.isEdit = false
            this.isEditRow = false
          }
          this.getAxisByView(list)
        }).catch((err: any) => {
          this.loadingForm = false
          return err
        })
      } else {
        if (isCopy) {
          this.isView = false
          this.isEdit = false
          this.isEditRow = true
          this.selectCardId = ''
          this.selectCard.auditing = undefined
          this.selectForm.refId = undefined
          this.selectForm.refStandardId = undefined
          this.selectForm.times = []
          this.selectCard = {}
        } else {
          this.isView = true
          this.isEdit = false
          this.isEditRow = false
        }
        this.loadingForm = false
        this.getAxisByView(priceList)
      }
      this.selectForm.associatedAgents = superiorPrice.associatedAgents
      this.selectForm.times = [dayjs(superiorPrice.startTime).format('YYYY-MM-DD'), dayjs(superiorPrice.endTime).format('YYYY-MM-DD')]
    }).catch((err: any) => {
      this.loadingForm = false
      return err
    })
  }

  private async viewPrice(card: any, isCopy?: boolean) {
    if (!(this as any).$checkPermission(['trailerQuoteGet', 'trailerQuoteCopy'])) return
    if (this.loadingForm) return
    this.loadingForm = false
    this.showAddForm = true
    this.xAxis = []
    this.yAxis = []
    this.selectCard = {
      ...card
    }
    this.selectCardId = card.id
    this.superiorPriceList = []
    this.refStandardList = []
    this.setTableForm(card)
    if (isCopy) {
      this.isView = false
      this.isEdit = false
      this.isEditRow = true
      this.selectCardId = ''
      this.selectCard.auditing = undefined
      this.selectForm.refId = undefined
      this.selectForm.refStandardId = undefined
      this.selectForm.times = []
      this.selectCard = {}
    } else {
      this.isView = true
      this.isEdit = false
      this.isEditRow = false
    }
    this.loadingForm = true
    try {
      await this.getSubtypeList()
      await this.getTrailerServeList('select')
      await this.getCountryList()
      await this.getStateList()
      await this.getCityList()
    } catch (error) {
      this.loadingForm = false
    }
    this.selectService = this.selectServiceList.find((e: any) => e.id === card.service.key) || {}
    const priceList = card.priceList || []
    this.selectForm.selectCountryId = this.selectService.countryId || undefined
    if (card.refId) {
      if (this.custType === '2') {
        this.getSuperiorPrice()
      }
      this.loadingForm = true
      this.getPriceById(card.refId).then((superiorPrice: any) => {
        this.loadingForm = false
        const list = superiorPrice.priceList.reduce((arr: any[], item: any) => {
          item.isSuperiorPrice = true
          arr.push(item)
          const data = priceList.find((e: any) => e.codeY === item.codeY)
          if (data) {
            arr.push(data)
          }
          return arr
        }, [])
        this.getAxisByView(list)
      }).catch((err: any) => {
        this.loadingForm = false
        return err
      })
    } else {
      this.getAxisByView(priceList)
      this.loadingForm = false
    }
    if (this.custType === '0' && !this.showAgentPriceModel) {
      this.showAgentPrice()
    }
  }

  private getAxisByView(list: any[]) {
    this.xAxis = list[0].priceList.map((e: any) => {
      return {
        label: e.nameX,
        value: e.codeX
      }
    })
    this.yAxis = list.map((e: any) => {
      const tamp: any = {
        label: e.nameY,
        value: e.codeY,
        isSuperiorPrice: e.isSuperiorPrice || false,
        remark: e.remark
      }
      e.priceList.forEach((p: any) => {
        tamp[p.codeX] = p.price || undefined
        // tamp.xId = e.cabinetId
      })
      return tamp
    })
    if (this.xAxis.length) {
      this.xAxis = [...this.xAxis, {
        label: '备注',
        value: 'remark'
      }]
    }
  }

  private setTableForm(result: any) {
    const editForm: any = this.$refs.addForm
    editForm && editForm.clearValidate()
    this.selectForm.selectCountryId = undefined
    this.selectForm.cityId = result.cityId
    this.selectForm.cityName = result.city
    this.selectForm.stateId = result.provinceId
    this.selectForm.stateName = result.province
    this.selectForm.countryId = result.countryId
    this.selectForm.countryName = result.country
    this.selectForm.refId = result.refId
    this.selectForm.refStandardId = result.refStandard
    this.selectForm.toCustSubtype = result.toSubtype
    this.selectForm.subtypeId = result.subtypeId
    this.selectForm.associatedAgents = result.associatedAgents
    this.selectForm.serviceId = result.service.key
    this.selectForm.ifStandard = result.ifStandard
    this.selectForm.times = [dayjs(result.startTime).format('YYYY-MM-DD'), dayjs(result.endTime).format('YYYY-MM-DD')]
    this.selectForm.edition = ''
  }

  private getAddressList() {
    const params = {
      model: {
        tscId: this.selectService.id,
        countryId: this.selectForm.countryId,
        provinceId: this.selectForm.stateId,
        cityId: this.selectForm.cityId,
        type: this.selectService.endAddressType
      },
      page: 1,
      size: 9999
    }
    this.loadingTable = true
    if (this.custType === '0' && !this.showAgentPriceModel) {
      this.showAgentPrice()
    }
    getAddressList(params).then((res: any) => {
      this.loadingTable = false
      if (res.success) {
        const data = res.data || {}
        const result = data.result || []
        if (this.selectService.endAddressType === 0) {
          this.city = data.result[0].city
          const tableData = result.reduce((list: any[], item: any) => {
            if (item.result && item.result.length) {
              item.result.forEach((e: any) => {
                if (!list.find((it: any) => it.streetId === e.streetId)) {
                  list.push(e)
                }
              })
            } else {
              if (params.model.countryId !== 'CN') {
                list.push({
                  street: item.city,
                  streetId: item.cityId
                })
              }
            }
            return list
          }, [])
          this.yAxis = tableData.map((item: any) => {
            const tamp: any = {
              label: item.street,
              value: item.streetId,
              ...item,
              remark: ''
            }
            if (this.xAxis.length) {
              this.xAxis.forEach((e: any, i: any) => {
                tamp[e.cabinetId] = undefined
                // tamp.xId = e.cabinetId
              })
            }
            return tamp
          })
        } else {
          this.yAxis = result.map((item: any) => {
            const tamp: any = {
              label: item.addrName,
              value: item.addrId,
              ...item,
              remark: ''
            }
            if (this.xAxis.length) {
              this.xAxis.forEach((e: any, i: any) => {
                tamp[e.cabinetId] = undefined
                // tamp.xId = e.cabinetId
              })
            }
            return tamp
          })
        }
      }
    }).catch((err: any) => {
      this.loadingTable = false
      return err
    })
  }

  private getChildren(id: any, data: any[]) {
    let hasFound = false // 表示是否有找到id值
    let result = {}
    const fn = (list: any[]) => {
      if (Array.isArray(list) && !hasFound) { // 判断是否是数组并且没有的情况下，
        list.forEach(item => {
          if (item.id === id) { // 数据循环每个子项，并且判断子项下边是否有id值
            result = item // 返回的结果等于每一项
            hasFound = true // 并且找到id值
          } else if (item.children) {
            fn(item.children) // 递归调用下边的子项
          }
        })
      }
    }
    fn(data) // 调用一下
    return result
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

  private getEditionList() {
    if (!this.selectCard.id) return
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

  // 保存报价
  private savePrice() {
    const list: string[] = ['subtypeId', 'kscId', 'ifStandard', 'times', 'refStandardId']
    let flag = false
    if (!this.isEdit && !this.selectForm.ifStandard && !this.refStandardList.length) {
      this.$message.warning('操作失败，暂无可参考的标准报价')
      return
    }
    if (!this.selectForm.ifStandard) {
      list.push('associatedAgents')
    }
    if (this.custType === '2') {
      list.push('toCustSubtype')
    }
    if (!this.selectForm.ifStandard) {
      list.push('associatedAgents')
    }
    if (this.validateService(list) !== 0) {
      return
    }
    for (const dataY of this.yAxis) {
      let innerFlag = false
      for (const dataX of this.xAxis) {
        if (dataY[dataX.value]) {
          innerFlag = true
          break
        }
      }
      if (innerFlag) {
        flag = innerFlag
        break
      }
    }
    if (!flag) {
      this.$message.warning('请填写区间报价')
      return
    }
    const params = this.getParams()
    if (!this.isEdit) {
      this.savePriceByAdd(params)
    } else {
      params.id = this.selectCard.id
      params.fromSubtype = this.selectCard.fromSubtype
      params.fromType = this.selectCard.fromType
      params.fromCustId = this.selectCard.fromCustId
      params.fromCustName = this.selectCard.fromCustName
      this.savePriceByEdit(params)
    }
  }

  private getParams() {
    const offerObject = this.getOfferObject()
    const params: any = {
      refId: this.selectForm.refId,
      city: this.selectForm.cityName,
      cityId: this.selectForm.cityId,
      province: this.selectForm.stateName,
      provinceId: this.selectForm.stateId,
      country: this.selectForm.country,
      countryId: this.selectForm.countryId,
      associatedAgents: this.selectForm.associatedAgents,
      ifStandard: this.selectForm.ifStandard,
      refStandard: this.selectForm.ifStandard ? '' : this.selectForm.refStandardId,
      subtypeId: this.selectForm.subtypeId,
      addressId: this.selectService.addressId,
      addressName: this.selectService.addressName,
      priceType: this.selectService.priceType,
      addressType: this.selectService.addressType,
      currencyId: this.selectService.currencyId,
      toSubtype: offerObject.toCustSubtype,
      toType: offerObject.toCustType,
      deleted: 0,
      priceList: [],
      endTime: this.selectForm.times[1] + ' 23:59:59',
      startTime: this.selectForm.times[0] + ' 00:00:00',
      service: {
        key: this.selectService.id,
        value: this.selectService.label
      }
    }
    params.priceList = this.yAxis.filter((e: any) => !e.isSuperiorPrice).map((y: any) => {
      const data: any = {
        nameY: y.label,
        codeY: y.value,
        remark: y.remark,
        priceList: []
      }
      this.xAxis.forEach((x: any) => {
        if (x.value !== 'remark') {
          data.priceList.push({
            nameX: x.label,
            codeX: x.value,
            price: y[x.value]
          })
        }
      })
      return data
    })
    return params
  }

  // 新增
  private savePriceByAdd(params: any) {
    this.loadingForm = true
    addPrice(params).then((res: any) => {
      this.loadingForm = false
      if (res.success) {
        const data = res.data
        this.$message.success('保存成功')
        this.refStandardList = []
        this.getPriceList(data.id || '')
      }
    }).catch((err: any) => {
      this.loadingForm = false
      return err
    })
  }

  private savePriceByEdit(params: any) {
    this.loadingForm = true
    editPrice(params).then((res: any) => {
      this.loadingForm = false
      if (res.success) {
        this.$message.success('保存成功')
        this.refStandardList = []
        this.getPriceList(this.selectCard.id)
      }
    }).catch((err: any) => {
      this.loadingForm = false
      return err
    })
  }

  // 保存Y轴
  private transferModalSave(type: string, selectKeys: any[], selectRows: any[]) {
    if (type === 'y') {
      this.yAxis = selectRows.map((item: any) => {
        const tamp: any = {
          ...item,
          remark: ''
        }
        if (this.xAxis.length) {
          this.xAxis.forEach((e: any, i: any) => {
            tamp[e.cabinetId] = undefined
            // tamp.xId = e.cabinetId
          })
        }
        return tamp
      })
    }
    if (type === 'a') {
      const editForm: any = this.$refs.addForm
      editForm && editForm.clearValidate()
      this.selectForm.associatedAgents = selectKeys
      if (this.selectCard.auditing !== '2' && this.isView) {
        const params = this.getParams()
        params.id = this.selectCard.id
        params.fromSubtype = this.selectCard.fromSubtype
        params.fromType = this.selectCard.fromType
        params.fromCustId = this.selectCard.fromCustId
        params.fromCustName = this.selectCard.fromCustName
        params.auditing = this.selectCard.auditing
        params.effective = this.selectCard.effective
        this.savePriceByEdit(params)
      }
    }
  }

  // 获取柜型（X轴）
  private getXAxis() {
    this.xAxis = []
    const list: string[] = ['subtypeId', 'serviceId']
    if (this.validateService(list) !== 0) {
      return
    }
    const params = {
      model: this.selectService.id,
      page: 1,
      size: 99999
    }
    this.loadingTable = true
    getServiceCabinetList(params).then((res: any) => {
      this.loadingTable = false
      if (res.success) {
        const data = res.data || {}
        const result = data.result || []
        this.xAxis = result.map((item: any, i: number) => {
          item.value = item.cabinetId
          item.label = item.cabinetName
          return item
        })
        if (this.xAxis.length) {
          this.xAxis = [...this.xAxis, {
            label: '备注',
            value: 'remark'
          }]
        } else {
          this.$message.info('暂无报价柜型')
        }
      }
    }).catch((err: any) => {
      this.loadingTable = false
      return err
    })
  }

  // 校验服务参数
  private validateService(list: any) {
    const errMsgList: any[] = []
    const editForm: any = this.$refs.addForm
    editForm.validateField(list, (errMsg: any) => {
      if (errMsg) {
        errMsgList.push(errMsg)
      }
    })
    return errMsgList.length
  }

  // 获取报价对象
  private getOfferObject() {
    let toCustSubtype = ''
    let toCustType = ''
    if (this.custType === '3') {
      if (this.selectForm.toCustSubtype === '-1') {
        toCustType = '0'
      } else {
        toCustType = '1'
        toCustSubtype = this.selectForm.toCustSubtype
      }
    }
    if (this.custType === '0') {
      toCustType = '2'
      toCustSubtype = '1'
    }
    if (this.custType === '2') {
      if (this.selectForm.toCustSubtype === '2') {
        toCustType = '2'
      } else {
        toCustType = '1'
      }
      toCustSubtype = this.selectForm.toCustSubtype
    }
    return {
      toCustSubtype,
      toCustType
    }
  }

  // 关联代理及设置目的地
  private showModel(type: string) {
    const list: string[] = ['subtypeId', 'serviceId']
    if (type === 'a') {
      list.push('toCustSubtype')
    }
    const offerObject = this.getOfferObject()
    if (this.validateService(list) === 0) {
      const modelRef: any = this.$refs.transferModal
      if (type === 'y') {
        modelRef.showModel(type, this.selectService, this.yAxis)
      }
      if (type === 'a') {
        modelRef.showModel(type, this.selectService, this.selectForm.associatedAgents, this.formLabel, offerObject)
      }
    }
  }

  private subTypeChange(val: any) {
    this.selectForm.serviceId = undefined
    this.selectForm.countryId = undefined
    this.selectForm.refStandardId = undefined
    this.selectForm.detailArea = []
    this.selectForm.cityName = ''
    if (this.custType !== '2') {
      this.getXAxis()
    }
  }

  private showAddPriceForm() {
    this.optionBtnNum = 1
    this.showAddForm = true
    this.isView = false
    this.isEditRow = true
    this.isEdit = false
    this.yAxis = []
    this.xAxis = []
    this.selectCardId = ''
    this.selectForm = {
      cityName: '',
      edition: '',
      refId: undefined,
      refStandardId: undefined,
      note: '',
      status: '4',
      countryId: undefined,
      country: '',
      serviceId: undefined,
      serviceName: '',
      subtypeId: undefined,
      toCustSubtype: undefined,
      ifStandard: true,
      associatedAgents: [],
      detailArea: [],
      times: []
    }
    this.selectCard = {}
    this.selectService = {}
    this.$nextTick(() => {
      const editForm: any = this.$refs.addForm
      editForm && editForm.clearValidate()
    })
  }

  private custSubtypeChange() {
    if (this.custType === '3') {
      if (this.selectForm.toCustSubtype === '1') {
        this.formLabel = '关联同行'
      } else {
        this.formLabel = '关联直客'
      }
    }
    if (this.custType === '0') {
      this.formLabel = '关联代理商'
    }
    if (this.custType === '2') {
      if (this.selectForm.toCustSubtype === '2') {
        this.formLabel = '关联代理商'
      } else if (this.selectForm.toCustSubtype === '1') {
        this.formLabel = '关联同行'
      } else {
        this.formLabel = '关联直客'
      }
      // this.getSuperiorPrice()
    }
  }

  // 获取服务
  private async getTrailerServeList(val: string) {
    const params: any = {
      page: 1,
      size: 9999
    }
    if (val === 'search') {
      params.subtypeId = this.searchForm.subtypeId
      params.countryId = this.searchForm.countryId
    } else {
      params.subtypeId = this.selectForm.subtypeId
      params.countryId = this.selectForm.selectCountryId
      this.selectServiceList = []
    }
    this.selectLoading = true
    await getTrailerServeList(params).then((res: any) => {
      this.selectLoading = false
      if (res.success) {
        const data = res.data || {}
        const result = data.result || []
        if (val === 'search') {
          this.searchServiceList = result.map((it: any) => {
            it.label = `${it.name}(${it.abbr})`
            return it
          })
        } else {
          if (this.isEdit) {
            this.selectServiceList = result.map((it: any) => {
              it.label = `${it.name}(${it.abbr})`
              return it
            })
          } else {
            this.selectServiceList = result.filter((e: any) => e.status === '1').map((it: any) => {
              it.label = `${it.name}(${it.abbr})`
              return it
            })
          }
        }
      }
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }

  private serviceChange(val: any, type: string) {
    if (type === 'search') {
      this.searchForm.serviceName = ''
      if (val) {
        const service = this.searchServiceList.find((e: any) => e.id === val)
        this.searchForm.serviceName = (service || {}).label
      }
    } else {
      this.selectForm.countryId = undefined
      this.selectForm.refStandardId = undefined
      this.selectForm.detailArea = []
      this.selectForm.cityName = ''
      this.xAxis = []
      this.yAxis = []
      this.selectService = {}
      if (val) {
        const service = this.selectServiceList.find((e: any) => e.id === val)
        this.selectService = service || {}
      }
      if (this.custType !== '2') {
        this.getXAxis()
      }
      if (this.custType !== '2' && this.selectService.endAddressType !== 0) {
        this.getAddressList()
      }
    }
  }

  // 业务类型
  private async getSubtypeList() {
    this.selectLoading = true
    await getServiceSubtypeList({ typeId: '06' }).then((res: any) => {
      this.typeList = res.data || []
      this.selectLoading = false
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }

  private tableRowClassName(data: any) {
    if (data.row.isSuperiorPrice) {
      return 'success-row'
    }
    return ''
  }

  private getCustId() {
    const type = (this as any).custSubtype
    if (this.custType === '3') {
      // 供应商
      this.custList = [
        { name: '聚货通', id: '-1' },
        { name: '直客', id: '0' },
        { name: '同行', id: '1' }
      ]
    }
    if (this.custType === '0') {
      this.custList = []
    }
    if (this.custType === '2') {
      switch (type) {
        case '1': // 代理商
          this.custList = [
            { name: '二级代理商', id: '2' },
            { name: '直客', id: '0' },
            { name: '同行', id: '1' }
          ]
          break
        case '2': // 代理商
          this.custList = [
            { name: '直客', id: '0' },
            { name: '同行', id: '1' }
          ]
          break
        default:
          this.custList = []
          break
      }
    }
  }

  // 获取国家列表
  private async getCountryList() {
    this.selectLoading = true
    await getCountryList().then((res: any) => {
      const data = res.data || {}
      this.countryList = data.result || []
      this.selectLoading = false
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
    const editForm: any = this.$refs.addForm
    editForm && editForm.clearValidate()
    const item = this.cityList.find((e: any) => e.id === val) || {}
    this.selectForm.cityName = item.name
    if (!val) {
      this.$message.warning('请选择城市')
      return
    }
    this.getAddressList()
  }

  // 货币
  private geCurrencyList() {
    const params = {
      page: 1,
      size: 999
    }
    geCurrencyList(params).then((res: any) => {
      if (res.success) {
        const data = res.data || {}
        this.currencyList = data.result || []
      }
    }).catch((err: any) => {
      return err
    })
  }

  private clearForm(type: string) {
    // clearForm
    if (type === '1') {
      this.searchForm.serviceId = undefined
      this.searchForm.serviceName = ''
      this.searchForm.countryId = undefined
    } else {
      this.searchForm.times = []
      this.searchForm.addressType = '99'
      this.searchForm.ifStandard = '0'
    }
    this.getPriceList()
  }

  private toggle() {
    this.isActive = !this.isActive
  }

  private showPopover(str: string) {
    if (str === '1') {
      this.visible = true
    } else {
      this.visible2 = true
    }
  }

  private getPriceList(id?: any) {
    const params = {
      model: {
        subtypeId: this.searchForm.subtypeId,
        serviceId: this.searchForm.serviceId,
        auditing: this.searchForm.auditing,
        ifStandard: this.searchForm.ifStandard === '0' ? '' : this.searchForm.ifStandard,
        addressType: this.searchForm.addressType === '99' ? '' : this.searchForm.addressType,
        startTime: this.searchForm.times[0] ? this.searchForm.times[0] + ' 00:00:00' : '',
        endTime: this.searchForm.times[1] ? this.searchForm.times[1] + ' 23:59:59' : ''
      },
      page: this.pagination.page,
      size: this.pagination.size
    }
    this.visible = false
    this.visible2 = false
    this.visibleAudit = false
    this.selectCard = {}
    this.selectCardId = ''
    this.loading = true
    this.refStandardList = []
    this.showAddForm = false
    getPriceList(params).then(async(res: any) => {
      this.loading = false
      if (res.success) {
        const data = res.data || {}
        const result = data.result || []
        this.tableList = result.map((item: any) => {
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
          const price = this.tableList.find((e: any) => e.id === id)
          if (price) {
            await this.viewPrice(price)
          }
        } else {
          const agentPrice = this.$refs.AgentPrice as any
          agentPrice.close()
        }
      }
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }

  private formattCurrency(id: any) {
    const currency = this.currencyList.find((e: any) => e.id === id)
    return currency ? `${currency.name}(${currency.sign})` : '--'
  }

  private formatTag(item: any, type?: string) {
    return (this.typeList.find((e: any) => e.id === item.subtypeId) || {}).name
  }

  private hidePopover() {
    this.visible = false
    this.visible2 = false
    this.visibleAudit = false
    this.isShowPopover = false
  }

  private async created() {
    this.loading = true
    await this.getSubtypeList()
    this.geCurrencyList()
    this.getCustId()
    this.getPriceList()
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
      margin-bottom: 0;
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

  ::v-deep .vxe-table--body .success-row{
    background-color: #cee9ec !important;
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: fixed;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    .contextmenu-item {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
  .agent-price{
    width: 23px;
    height: 24px;
    background: rgba(34, 145, 230, .13);
    border-radius: 4px;
    position: fixed;
    right: 100px;
    bottom: 100px;
    text-align: center;
    cursor: pointer;
    .icon-price{
      display: inline-block;
      width: 100%;
      height: 100%;
      background: url("../../../assets/imgs/agent-price.png") center center no-repeat;
      background-size: 100% 100%;
    }
  }
</style>
