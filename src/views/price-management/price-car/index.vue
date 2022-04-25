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
            卡车报价
          </el-col>
          <el-col
            :span="12"
            style="text-align: right;"
          >
            <el-button
              v-permission="['kapaiOfferAdd']"
              type="text"
              size="small"
              @click="addPrice"
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
                    label-width="50px"
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
                      @change="(val) => onService('search', val)"
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
                      v-permission="['kapaiOfferQuery']"
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
                      v-permission="['kapaiOfferQuery']"
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
              :class="{'active-card': selectCardId === item.id}"
              @click="onSelectCard(item)"
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
                  {{ item.kscName }}
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
                  v-if="item.addressType !== '4'"
                  :span="4"
                >
                  起运地
                </el-col>
                <el-col
                  v-if="item.addressType !== '4'"
                  :span="16"
                  class="word-limit"
                  style="color:  #409EFF;"
                >
                  {{ formatTag(item, '1') }}
                </el-col>
                <el-col
                  v-else
                  :span="20"
                  class="word-limit"
                  style="color:  #409EFF;"
                >
                  {{ `${item.country.countryName || ''} ${item.country.stateName || ''} ${item.country.cityName || ''} ${item.country.countyName || ''}` }}
                </el-col>
                <el-col
                  :span="4"
                  style="text-align: right;"
                >
                  <span v-if="item.toCustType === '2'">代理商价</span>
                  <span v-else-if="item.toCustType === '1' && item.toCustSubtype === '0'">直客价</span>
                  <span v-else-if="item.toCustType === '1' && item.toCustSubtype === '1'">同行价</span>
                  <span v-else-if="item.toCustType === '3'">聚货通价</span>
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
        <div style="display: flex;align-items: center;justify-content: space-between;">
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
                  v-show="selectService.name"
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
                @focus="getServiceList('select')"
                @change="(val) => onService('select', val)"
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
            v-if="(!selectCard.id || selectCard.auditing !== 4) && !edition"
            style="text-align: right;margin-bottom: 18px;"
          >
            <el-button
              v-if="!isEdit && isView && (selectCard.auditing === 1 || selectCard.auditing === 3) && $checkPermission(['kapaiOfferEdit'])"
              type="text"
              size="mini"
              @click="editRow"
            >
              编辑
            </el-button>
            <el-popover
              v-if="selectCard.auditing !== 4 && !isEdit && isView && $checkPermission(['kapaiOfferAudit'])"
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
                  <el-button
                    size="mini"
                    @click="hidePopover"
                  >
                    取消
                  </el-button>
                  <el-button
                    size="mini"
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
              v-if="!isEdit && isView && (selectCard.auditing === 1 || selectCard.auditing === 3) && $checkPermission(['kapaiOfferDel'])"
              type="text"
              size="mini"
              style="margin-right: 10px"
              @click="deleteRow(1)"
            >
              删除
            </el-button>
            <el-button
              v-if="(!isView || isEdit) && $checkPermission(['kapaiOfferAdd', 'kapaiOfferEdit'])"
              type="text"
              size="mini"
              @click="cancelEdit"
            >
              取消
            </el-button>
            <el-button
              v-if="(isEdit || !isView) && $checkPermission(['kapaiOfferAdd', 'kapaiOfferEdit'])"
              type="text"
              size="mini"
              @click="saveRow"
            >
              保存
            </el-button>
          </div>
          <div
            v-if="(selectCard.id || edition) && !isEdit"
            style="text-align: right;margin-bottom: 18px;"
          >
            <el-button
              v-if="$checkPermission(['kapaiOfferCopy'])"
              type="text"
              size="mini"
              @click="copyPrice"
            >
              复制此版本
            </el-button>
            <el-button
              v-if="selectCard.auditing === 4 && !edition"
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
          <el-col :span="21">
            <el-form-item
              v-if="selectService.id && custType === '3' && selectService.addressType === '4'"
              label="设置里程："
            >
              <el-button
                type="text"
                size="mini"
                :disabled="!isEdit && isView"
                @click="handleRelevance('3')"
              >
                里程
              </el-button>
            </el-form-item>
            <el-form-item
              v-if="selectService.id && custType === '3' && selectService.priceType !== '0'"
              label="计费区间："
            >
              <el-button
                type="text"
                size="mini"
                :disabled="!isEdit && isView"
                @click="handleRelevance(selectService.priceType)"
              >
                区间
              </el-button>
            </el-form-item>
            <el-form-item
              v-if="custType !== '3' || (custType === '3' && selectForm.toCustSubtype && selectForm.toCustSubtype !== '-1')"
              label="价格标准："
              prop="ifStandard"
              label-width="100px"
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
              label-width="120px"
            >
              <el-button
                type="text"
                size="mini"
                style="padding-right: 30px"
                @click="showAgencyModel"
              >
                已选择({{ (selectForm.associatedAgents || []).length }})
              </el-button>
            </el-form-item>
            <el-form-item
              v-if="!selectForm.ifStandard"
              label="有效时间："
              label-width="90px"
              prop="refStandardId"
            >
              <el-date-picker
                v-if="isView"
                v-model="selectForm.times"
                :clearable="false"
                :disabled="!selectForm.ifStandard || (!isEdit && isView)"
                unlink-panels
                type="daterange"
                align="left"
                size="mini"
                value-format="yyyy-MM-dd"
                range-separator="~"
                style="width:220px;"
                start-placeholder="起始时间"
                end-placeholder="截止时间"
                :picker-options="pickerOptions"
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
                @focus="getRefStandard"
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
              label-width="90px"
              prop="times"
            >
              <el-date-picker
                v-model="selectForm.times"
                :clearable="false"
                :disabled="!selectForm.ifStandard || (!isEdit && isView)"
                unlink-panels
                type="daterange"
                align="left"
                size="mini"
                value-format="yyyy-MM-dd"
                range-separator="~"
                style="width:220px;"
                start-placeholder="起始时间"
                end-placeholder="截止时间"
                :picker-options="pickerOptions"
              />
            </el-form-item>
            <el-form-item
              label="单票最低收费："
              label-width="130px"
              prop="floorPrice"
            >
              <el-input-number
                v-model="selectForm.floorPrice"
                :disabled="!isEdit && isView"
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
            :span="3"
            style="text-align: right;"
          >
            <el-select
              v-if="isView && !isEdit"
              v-model="edition"
              clearable
              filterable
              size="mini"
              placeholder="历史版本"
              style="width: 100%;"
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
          v-if="aAxisData.length"
          :data="tableData"
          height="620"
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
            field="label"
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
              :field="item.value"
              :resizable="true"
              :show-overflow="true"
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
                :field="item.value"
                :resizable="true"
                :show-overflow="true"
              >
                <template slot-scope="scope">
                  <div>
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
          </template>
        </vxe-table>
      </div>
    </div>
    <set-section
      ref="setSection"
      @change="changeSection"
    />
    <relevance-agency
      ref="relevanceAgency"
      :select-card="selectCard"
      :is-add-form="showAddForm"
      :is-edit="isEdit"
      :is-view="isView"
      :edition="!edition"
      :modal-title="formLabel"
      @save="saveAgency"
    />
    <agent-price
      ref="AgentPrice"
      @close="closeAgentPrice"
    />
    <transition name="el-fade-in-linear">
      <div
        v-show="showAgentPriceModel && showAddForm && custType === '0' && $checkPermission(['kapaiOfferQuotation'])"
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
        v-permission="['kapaiOfferCopy']"
        class="contextmenu-item"
        @click="onSelectCard(showMenuRow, true)"
      >
        复制
      </li>
      <li
        v-permission="['kapaiOfferGet']"
        class="contextmenu-item"
        @click="onSelectCard(showMenuRow)"
      >
        查看
      </li>
      <li
        v-if="(showMenuRow.auditing === 1 || showMenuRow.auditing === 3) && $checkPermission(['kapaiOfferDel'])"
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
import { getWordsList } from '@/api/service-with-booking-service'
import {
  getCountryList,
  getStateByCountry,
  getCityByState,
  getServiceSubtypeList,
  geCurrencyList,
  getCarServeList,
  getCarServeAxis,
  getPriceList,
  addPrice,
  editPrice,
  superiorPrice,
  delPrice,
  auditPrice,
  invalidPrice,
  getHistoryPriceList,
  getHistoryPrice,
  refStandard
} from '@/api/price-to-car'
import dayjs from 'dayjs'
import setSection from '@/views/price-management/price-car/components/setSection.vue'
import relevanceAgency from '@/views/price-management/price-car/components/relevanceAgency.vue'
import AgentPrice from '@/views/price-management/price-car/components/agentPrice.vue'

@Component({
  name: '',
  components: {
    setSection,
    relevanceAgency,
    AgentPrice
  },
  props: {}
})
export default class extends Vue {
  /** data */
  private showMenuRow: any = {}
  private isShowMenu: boolean = false
  private addNumber: any = ''
  private menuTop: number = 0
  private menuLeft: number = 0
  private showAgentPriceModel: boolean = true
  private isShowPopover: boolean = false
  private optionBtnNum: number = 1
  private formLabel: any = '关联代理商'
  private edition: string = ''
  private selectCardId: string = ''
  private isActive: boolean = true
  private selectLoading: boolean = false
  private visible: boolean = false
  private visible2: boolean = false
  private visibleAudit: boolean = false
  private loading: boolean = false
  private showAddForm: boolean = false
  private isView: boolean = false
  private isEdit: boolean = false
  private isEditRow: boolean = false
  private loadingForm: boolean = false
  private loadingTable: boolean = false
  private searchForm: any = {
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
    countryId: undefined,
    countryName: '',
    cityName: '',
    cityId: '',
    stateId: '',
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
  private selectCard: any = {}
  private selectService: any = {}
  private dayjs: any = dayjs
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  private pickerOptions: any = {
    disabledDate(time: any) {
      return dayjs(time) < dayjs()
    }
  }
  private refStandardList: any[] = []
  private currencyList: any[] = []
  private aAxisDataPlanar: any[] = []
  private aAxisData: any[] = []
  private tableData: any[] = []
  private typeList: any[] = []
  private countryList: any[] = []
  private stateList: any[] = []
  private cityList: any[] = []
  private searchServiceList: any[] = []
  private selectServiceList: any[] = []
  private priceList: any[] = []
  private custList: any[] = []
  private superiorPriceList: any[] = []
  private editionList: any[] = []
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
  private umDistanceList: any[] = []
  private umWeightList: any[] = []
  private umVolumeList: any[] = []

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
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }

  get custSubtype(): string {
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
  private showBatchAddForm() {
    this.addNumber = undefined
  }
  private addNumberChange(addNumber: any) {
    this.tableData.map((item: any, index: number, list: any[]) => {
      if (index % 2 !== 0) {
        const superPrice: any = list[index - 1]
        this.aAxisData.map((e: any) => {
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
    this.aAxisDataPlanar = [this.aAxisData.filter((e: any) => e.type === '0'), this.aAxisData.filter((e: any) => e.type === '1')]
    if (addNumber === 0) {
      this.addNumber = undefined
    }
  }
  private async copyPrice() {
    // 1
    if (this.edition) {
      // 历史版本
      await this.viewHistoryPrice(this.edition, true)
    } else {
      await this.onSelectCard(this.selectCard, true)
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
        this.resetSelect()
        this.getPriceList()
      }).catch(() => {
        loading.close()
      })
    }).catch(() => {
      return false
    })
  }
  private showMenu(row: any, e: MouseEvent) {
    if (!(this as any).$checkPermission(['kapaiOfferDel', 'kapaiOfferGet', 'kapaiOfferCopy'])) return
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
    if (!this.selectForm.kscId) {
      this.$message.warning('请选择服务')
      return
    }
    (this.$refs.AgentPrice as any).show(this.selectService)
    this.showAgentPriceModel = false
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

  private refStandardChange(val: any) {
    const refStandardItem = this.refStandardList.find((e: any) => e.id === val)
    this.selectForm.times = []
    if (refStandardItem) {
      this.selectForm.times = [dayjs(refStandardItem.startTime).format('YYYY-MM-DD'), dayjs(refStandardItem.endTime).format('YYYY-MM-DD')]
    }
  }

  private ifStandardChange() {
    this.refStandardList = []
    this.selectForm.times = []
    this.selectForm.refStandardId = ''
  }

  // 特殊报价获取参考标准报价
  private getRefStandard() {
    const validateList: string[] = ['subtypeId', 'kscId', 'toCustSubtype']
    if (this.validateForm(validateList) !== 0) return
    const offerObject = this.getOfferObject()
    if (!offerObject.toCustType) return
    const params: any = {
      ...offerObject,
      addressId: this.selectService.addressId,
      addressName: this.selectService.addressName,
      addressType: this.selectService.addressType,
      currencyId: this.selectService.currencyId,
      kscId: this.selectService.id,
      kscName: this.selectService.label,
      priceType: this.selectService.priceType,
      subtypeId: this.selectService.subtypeId,
      umDistance: this.selectService.umDistance,
      umVolume: this.selectService.umVolume,
      umWeight: this.selectService.umWeight,
      country: {
        cityId: this.selectService.cityId,
        cityName: this.selectService.cityName,
        countryId: this.selectService.countryId,
        countryName: this.selectService.countryName,
        countyId: this.selectService.countyId,
        countyName: this.selectService.countyName,
        stateId: this.selectService.stateId,
        stateName: this.selectService.stateName
      }
    }
    this.selectLoading = true
    refStandard(params).then((res: any) => {
      this.selectLoading = false
      if (res.success) {
        this.refStandardList = res.data || []
        if (!this.refStandardList.length) {
          this.$message.warning('暂无可参考的标准报价')
        }
        // if (this.refStandardList.length === 1) {
        //   this.selectForm.refStandardId = this.refStandardList[0].id
        //   this.refStandardChange(this.refStandardList[0].id)
        // }
      }
    }).catch(_ => {
      this.selectLoading = false
    })
  }

  private async onSelectCard(card: any, isCopy?: boolean) {
    if (!(this as any).$checkPermission(['kapaiOfferGet', 'kapaiOfferCopy'])) return
    this.edition = ''
    this.aAxisData = []
    this.aAxisDataPlanar = []
    this.tableData = []
    this.superiorPriceList = []
    this.selectCard = {
      ...card
    }
    this.selectCardId = card.id
    this.selectForm.refId = card.refId || ''
    this.setTableData(card)
    this.showAddForm = true
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
      await this.getStateList()
      await this.getCityList()
      await this.getServiceList('select')
    } catch (error) {
      this.loadingForm = false
    }
    this.selectService = this.selectServiceList.find((e: any) => e.id === card.kscId) || {}
    if (card.refId) {
      if (this.custType === '2') {
        this.getSuperiorPrice()
      }
      this.getPriceById(card.refId).then((data: any) => {
        const excelModelList: any[] = []
        data.excelModelList.forEach((item: any, i: number) => {
          item.isSuperiorPrice = true
          excelModelList.push(item)
          excelModelList.push(card.excelModelList[i])
        })
        const result = this.getAxisBySuperiorPriceAndView(excelModelList)
        this.aAxisData = result.aAxisData
        this.aAxisDataPlanar = result.aAxisDataPlanar
        this.tableData = result.tableData
        this.loadingForm = false
      }).catch(_ => {
        this.loadingForm = false
      })
    } else {
      const result = this.getAxisBySuperiorPriceAndView(card.excelModelList)
      this.aAxisData = result.aAxisData
      this.aAxisDataPlanar = result.aAxisDataPlanar
      this.tableData = result.tableData
      this.loadingForm = false
    }
    if (this.custType === '0' && !this.showAgentPriceModel) {
      this.showAgentPrice()
    }
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

  private addPrice() {
    this.showAddForm = true
    this.optionBtnNum = 1
    this.selectCardId = ''
    this.edition = ''
    this.resetSelect()
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

  private resetSelect() {
    this.edition = ''
    this.isView = false
    this.selectForm = {
      countryId: undefined,
      countryName: '',
      cityName: '',
      stateName: '',
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
    this.selectService = {}
    this.selectCard = {}
    this.aAxisData = []
    this.tableData = []
    this.$nextTick(() => {
      const editForm: any = this.$refs.editForm
      editForm && editForm.clearValidate()
    })
  }

  private validateForm(list: string[]) {
    const editForm: any = this.$refs.editForm
    const errMsgList: any[] = []
    editForm.validateField(list, (errMsg: any) => {
      if (errMsg) {
        errMsgList.push(errMsg)
      }
    })
    return errMsgList.length
  }

  private onService(type: string, val: any) {
    if (type === 'search') {
      this.searchForm.kscName = (this.searchServiceList.find((e: any) => e.id === val) || {}).label
    } else {
      this.aAxisData = []
      this.aAxisDataPlanar = []
      this.tableData = []
      if (val) {
        this.selectService = this.selectServiceList.find((e: any) => e.id === val) || {}
        if (this.custType !== '2') {
          this.getCarServeAxis()
        }
        if (this.custType === '0' && !this.showAgentPriceModel) {
          this.showAgentPrice()
        }
      }
    }
  }

  private getSuperiorPrice() {
    const validateList: string[] = ['subtypeId', 'kscId', 'toCustSubtype']
    if (this.validateForm(validateList) !== 0) return
    // const offerObject = this.getOfferObject()
    const params: any = {
      // ...offerObject,
      addressId: this.selectService.addressId,
      addressName: this.selectService.addressName,
      addressType: this.selectService.addressType,
      currencyId: this.selectService.currencyId,
      kscId: this.selectService.id,
      kscName: this.selectService.label,
      priceType: this.selectService.priceType,
      subtypeId: this.selectService.subtypeId,
      umDistance: this.selectService.umDistance,
      umVolume: this.selectService.umVolume,
      umWeight: this.selectService.umWeight,
      country: {
        cityId: this.selectService.cityId,
        cityName: this.selectService.cityName,
        countryId: this.selectService.countryId,
        countryName: this.selectService.countryName,
        countyId: this.selectService.countyId,
        countyName: this.selectService.countyName,
        stateId: this.selectService.stateId,
        stateName: this.selectService.stateName
      }
    }
    this.superiorPriceList = []
    // this.loadingTable = true
    superiorPrice(params).then((res: any) => {
      this.loadingTable = false
      if (res.success && res.data && res.data.length) {
        this.superiorPriceList = res.data || []
        // const superiorPriceId = this.superiorPriceList[0].id
        // this.superiorPriceChange(superiorPriceId)
      } else {
        this.$message.warning('暂无参考报价')
      }
    }).catch((err: any) => {
      this.loadingTable = false
      return err
    })
  }

  private subTypeChange(val: any) {
    this.selectForm.kscId = undefined
    this.selectService = {}
    this.aAxisData = []
    this.aAxisDataPlanar = []
    this.tableData = []
  }

  // private custSubtypeChange(val: any) {
  //   this.aAxisData = []
  //   this.aAxisDataPlanar = []
  //   this.tableData = []
  // }

  private superiorPriceChange(val: any) {
    const result = this.superiorPriceList.find((e: any) => e.id === val)
    const excelModelList = result.excelModelList.map((item: any, i: number) => {
      item.isSuperiorPrice = true
      return item
    })
    const data = this.getAxisBySuperiorPriceAndView(excelModelList)
    this.aAxisData = data.aAxisData
    this.aAxisDataPlanar = data.aAxisDataPlanar
    const tableData: any[] = []
    data.tableData.forEach((item: any) => {
      tableData.push(item)
      if (!this.isView) {
        const tamp: any = {
          code: item.code,
          max: item.max,
          min: item.min,
          name: item.name,
          label: item.label,
          remark: ''
        }
        item.pricelist.forEach((e: any, i: number) => {
          tamp['x' + i] = undefined
        })
        tableData.push(tamp)
      }
    })
    this.tableData = tableData
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

  private async viewHistoryPrice(val: any, isCopy?: boolean) {
    if (val) {
      this.loadingForm = true
      this.getPriceById(val).then((data: any) => {
        if (data.refId) {
          this.getPriceById(data.refId).then((superiorRes: any) => {
            this.loadingForm = false
            const excelModelList: any[] = []
            superiorRes.excelModelList.forEach((item: any, i: number) => {
              item.isSuperiorPrice = true
              excelModelList.push(item)
              excelModelList.push(data.excelModelList[i])
            })
            const result = this.getAxisBySuperiorPriceAndView(excelModelList)
            this.aAxisData = result.aAxisData
            this.aAxisDataPlanar = result.aAxisDataPlanar
            this.tableData = result.tableData
            if (isCopy) {
              this.edition = ''
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
          }).catch(_ => {
            this.loadingForm = false
          })
        } else {
          this.loadingForm = false
          const result = this.getAxisBySuperiorPriceAndView(data.excelModelList)
          this.aAxisData = result.aAxisData
          this.aAxisDataPlanar = result.aAxisDataPlanar
          this.tableData = result.tableData
          this.selectForm.times = [dayjs(data.startTime).format('YYYY-MM-DD'), dayjs(data.endTime).format('YYYY-MM-DD')]
          this.selectForm.associatedAgents = data.associatedAgents
          if (isCopy) {
            this.edition = ''
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
        }
      }).catch(_ => {
        this.loadingForm = false
      })
    } else {
      await this.onSelectCard(this.selectCard)
    }
  }

  // 审核
  private showAuditModal() {
    const { auditing, reason } = this.selectCard
    if (auditing === 1) {
      const params = {
        id: this.selectCard.id,
        tag: 2,
        reason: ''
      }
      auditPrice(params).then((res: any) => {
        this.priceList.map((it: any) => {
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

  // 获取服务坐标
  private getCarServeAxis() {
    const params = {
      kscId: this.selectService.id
    }
    this.loadingTable = true
    getCarServeAxis(params).then((res: any) => {
      this.loadingTable = false
      if (res.success) {
        const data = res.data || {}
        this.aAxisData = data.x.map((item: any, i: any) => {
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
        if (this.selectService.priceType === '2') {
          this.aAxisDataPlanar = [this.aAxisData.filter((item: any) => item.type === '0'), this.aAxisData.filter((item: any) => item.type === '1')]
        }
        this.tableData = data.y.map((item: any, i: any) => {
          let tamp: any = {
            label: '',
            remark: ''
          }
          this.aAxisData.forEach((x: any) => {
            tamp[x.value] = undefined
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
        if (this.aAxisData.length) {
          this.aAxisData = [...this.aAxisData, {
            label: '备注',
            value: 'remark'
          }]
        }
      }
    }).catch((err: any) => {
      this.loadingTable = false
      return err
    })
  }

  // 取消编辑
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
      this.selectForm.ifStandard = this.selectCard.ifStandard
      this.selectForm.times = [dayjs(this.selectCard.startTime).format('YYYY-MM-DD'), dayjs(this.selectCard.endTime).format('YYYY-MM-DD')]
    } else {
      this.showAddForm = false
      this.selectCard = {}
      this.selectCardId = ''
      this.edition = ''
    }
  }

  private saveRow() {
    const list: string[] = ['subtypeId', 'kscId', 'floorPrice', 'ifStandard', 'times', 'refStandardId']
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
    if (this.validateForm(list) !== 0 || !this.validate()) {
      return
    }
    const params = this.getParams()
    if (!this.isEdit) {
      this.savePriceByAdd(params)
    } else {
      params.id = this.selectCard.id
      params.fromCustId = this.selectCard.fromCustId
      params.fromCustName = this.selectCard.fromCustName
      params.fromCustSubtype = this.selectCard.fromCustSubtype
      params.fromCustType = this.selectCard.fromCustType
      this.savePriceByEdit(params)
    }
  }

  private getParams() {
    const offerObject = this.getOfferObject()
    const params: any = {
      ...offerObject,
      addressId: this.selectService.addressId,
      addressName: this.selectService.addressName,
      addressType: this.selectService.addressType,
      associatedAgents: this.selectForm.associatedAgents,
      currencyId: this.selectService.currencyId,
      endTime: this.selectForm.times[1] + ' 23:59:59',
      startTime: this.selectForm.times[0] + ' 00:00:00',
      ifStandard: this.selectForm.ifStandard,
      floorPrice: this.selectForm.floorPrice,
      refStandard: this.selectForm.ifStandard ? '' : this.selectForm.refStandardId,
      kscId: this.selectService.id,
      kscName: this.selectService.label,
      priceType: this.selectService.priceType,
      subtypeId: this.selectService.subtypeId,
      umDistance: this.selectService.umDistance,
      umVolume: this.selectService.umVolume,
      umWeight: this.selectService.umWeight,
      country: {
        cityId: this.selectService.cityId,
        cityName: this.selectService.cityName,
        countryId: this.selectService.countryId,
        countryName: this.selectService.countryName,
        countyId: this.selectService.countyId,
        countyName: this.selectService.countyName,
        stateId: this.selectService.stateId,
        stateName: this.selectService.stateName
      },
      refId: this.selectForm.refId,
      excelModelList: []
    }
    this.tableData.forEach((item: any) => {
      if (!item.isSuperiorPrice) {
        const data: any = {
          codey: item.code,
          maxy: item.max,
          miny: item.min,
          namey: item.name,
          remark: item.remark,
          pricelist: []
        }
        this.aAxisData.forEach((e: any) => {
          if (e.value !== 'remark') {
            const price: any = {
              type: e.type,
              codex: e.code,
              maxx: e.max,
              minx: e.min,
              namex: e.name,
              price: item[e.value]
            }
            data.pricelist.push(price)
          }
        })
        params.excelModelList.push(data)
      }
    })
    return params
  }

  private savePriceByAdd(data: any) {
    this.loadingForm = true
    addPrice(data).then((res: any) => {
      this.loadingForm = false
      this.isView = true
      this.isEdit = false
      this.isEditRow = false
      if (res.success) {
        // 新增成功
        this.$message.success('保存成功')
        this.refStandardList = []
        this.getPriceList(res.data.id)
      }
    }).catch((err: any) => {
      this.loadingForm = false
      return err
    })
  }

  private savePriceByEdit(data: any) {
    this.loadingForm = true
    editPrice(data).then((res: any) => {
      this.loadingForm = false
      this.isView = true
      this.isEdit = false
      this.isEditRow = false
      if (res.success) {
        // 新增成功
        this.$message.success('保存成功')
        this.refStandardList = []
        this.getPriceList(data.id)
      }
    }).catch((err: any) => {
      this.loadingForm = false
      return err
    })
  }

  private editRow() {
    this.optionBtnNum = 3
    this.isEdit = true
    this.isEditRow = true
    this.setTableData(this.selectCard)
  }

  private setTableData(result: any) {
    this.$nextTick(() => {
      const editForm: any = this.$refs.editForm
      editForm && editForm.clearValidate()
    })
    this.selectForm.floorPrice = result.floorPrice
    this.selectForm.toCustSubtype = result.toCustSubtype
    this.selectForm.toCustType = result.toCustType
    this.selectForm.subtypeId = result.subtypeId
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
          this.isView = false
          this.isEditRow = false
          this.isEdit = false
          this.$message.success('删除成功')
          this.getPriceList()
          const agentPrice = this.$refs.AgentPrice as any
          agentPrice.close()
        }).catch((err: any) => {
          this.loadingTable = false
          return err
        })
      })
      .catch(() => {
        return false
      })
  }

  private handleRelevance(priceType: any) {
    const root: any = this.$refs.setSection
    root.showModel(this.selectService, priceType)
  }

  private changeSection() {
    this.aAxisData = []
    this.aAxisDataPlanar = []
    this.tableData = []
    this.getCarServeAxis()
  }

  private showAgencyModel() {
    const offerObject = this.getOfferObject()
    if (!this.selectForm.subtypeId) {
      this.$message.warning('请选择业务类型')
      return
    }
    const modelRef: any = this.$refs.relevanceAgency
    if (offerObject.toCustType) {
      modelRef.showModel(this.selectForm, offerObject)
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

  // 获取报价对象
  private getOfferObject() {
    let toCustSubtype = ''
    let toCustType = ''
    if (this.custType === '2') {
      const validateList: string[] = ['toCustSubtype']
      if (this.validateForm(validateList) !== 0) {
        this.$message.warning('请选择报价对象')
        return {
          toCustSubtype,
          toCustType
        }
      }
    }
    if (this.custType === '3') {
      if (this.selectForm.toCustSubtype === '-1') {
        toCustType = '0'
      } else {
        const validateList: string[] = ['toCustSubtype']
        if (this.validateForm(validateList) !== 0) {
          this.$message.warning('请选择报价对象')
          return {
            toCustSubtype,
            toCustType
          }
        }
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

  private validate(): boolean {
    let flag = false
    if (this.tableData.length === 0 || this.aAxisData.length === 0) {
      this.$message.warning('暂无参考报价')
      flag = false
      return flag
    }
    for (const dataY of this.tableData) {
      let innerFlag = false
      for (const dataX of this.aAxisData) {
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
    }
    return flag
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
      this.selectServiceList = []
    }
    this.selectLoading = true
    await getCarServeList(params).then((res: any) => {
      this.selectLoading = false
      if (res.success) {
        const data = res.data || {}
        const result = data.result || []
        if (type === 'search') {
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

  private countryChange(val: any) {
    this.searchForm.kscId = undefined
    this.searchForm.kscName = ''
  }

  private saveAgency(list: any[]) {
    this.selectForm.associatedAgents = list
    if (this.selectCard.auditing !== '2' && this.isView) {
      const params: any = this.getParams()
      params.id = this.selectCard.id
      params.fromCustId = this.selectCard.fromCustId
      params.fromCustName = this.selectCard.fromCustName
      params.fromCustSubtype = this.selectCard.fromCustSubtype
      params.fromCustType = this.selectCard.fromCustType
      params.auditing = this.selectCard.auditing
      params.effective = this.selectCard.effective
      this.savePriceByEdit(params)
    }
  }

  private getPriceList(id?: any) {
    this.visible = false
    this.visible2 = false
    this.visibleAudit = false
    this.showAddForm = false
    const params = {
      model: {
        subtypeId: this.searchForm.subtypeId,
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
    this.selectCardId = ''
    this.loading = true
    getPriceList(params).then(async(res: any) => {
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

  private hidePopover() {
    this.visible = false
    this.visible2 = false
    this.visibleAudit = false
    this.isShowPopover = false
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

  private currentChange(val: any) {
    this.pagination.page = val
    this.getPriceList()
  }

  private toggle() {
    this.isActive = !this.isActive
  }

  private tableRowClassName(data: any) {
    if (data.row.isSuperiorPrice) {
      return 'success-row'
    }
    return ''
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

  private async created() {
    this.loading = true
    this.getCustId()
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
