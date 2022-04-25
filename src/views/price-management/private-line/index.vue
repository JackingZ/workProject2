<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <app-slide
      width="415"
      :is-active="isActive"
      style="margin: 15px 0 15px 15px;padding: 0;"
    >
      <div style="padding: 20px;">
        <el-row>
          <el-col
            :span="12"
            style="line-height: 32px;"
          >
            专线报价
          </el-col>
          <el-col
            :span="12"
            style="text-align: right;"
          >
            <el-button
              v-if="custType !== '0' && $checkPermission(['lineQuoteAdd'])"
              type="text"
              size="small"
              @click="addPrice"
            >
              新增报价
            </el-button>
          </el-col>
        </el-row>
        <div style="padding-top: 10px;">
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
                @change="onBusiness"
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
              <el-select
                v-model="searchForm.destinationCountry"
                :loading="selectLoading"
                size="mini"
                clearable
                filterable
                placeholder="目的国"
                style="width: 100%;"
                @focus="getCountryList"
                @change="onCountry('sea')"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-select
                v-model="searchForm.audit"
                size="mini"
                clearable
                filterable
                placeholder="审核状态"
                style="width: 100%;"
                @change="getTableData(1)"
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
                v-model="popoverShow2"
                placement="bottom-start"
                trigger="click"
              >
                <div style="padding-right: 15px;">
                  <el-form-item
                    label="交货区域"
                    label-width="90px"
                  >
                    <el-checkbox
                      v-model="checkAll"
                      :indeterminate="isIndeterminate"
                      @change="handleCheckAll"
                    >
                      全选
                    </el-checkbox>

                    <el-checkbox-group
                      v-model="searchForm.areaId"
                      @change="handleChecked"
                    >
                      <el-checkbox
                        v-for="(item, index) in areaList"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item
                    label="目的地类型"
                    label-width="90px"
                  >
                    <el-radio-group
                      v-model="searchForm.purposeType"
                      @change=";(searchForm.lscId = undefined)"
                    >
                      <el-radio-button :label="undefined">
                        全部
                      </el-radio-button>
                      <el-radio-button :label="0">
                        FBA
                      </el-radio-button>
                      <el-radio-button :label="1">
                        私人
                      </el-radio-button>
                      <el-radio-button :label="2">
                        自有海外仓
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item
                    v-if="custType === '2' || custType === '0'"
                    label="报价对象"
                    label-width="90px"
                  >
                    <el-radio-group v-model="searchForm.category">
                      <el-radio-button :label="undefined">
                        全部
                      </el-radio-button>
                      <el-radio-button
                        v-for="item in custList"
                        :key="item.id"
                        :label="item.id"
                      >
                        {{ item.name }}
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item
                    label="价格标准"
                    label-width="90px"
                  >
                    <el-radio-group v-model="searchForm.mode">
                      <el-radio-button :label="undefined">
                        全部
                      </el-radio-button>
                      <el-radio-button label="0">
                        标准
                      </el-radio-button>
                      <el-radio-button label="1">
                        特殊
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item
                    label="目的港关税"
                    label-width="90px"
                  >
                    <el-radio-group
                      v-model="searchForm.includeTax"
                      @change=";(searchForm.lscId = undefined)"
                    >
                      <el-radio-button :label="undefined">
                        全部
                      </el-radio-button>
                      <el-radio-button :label="true">
                        包税
                      </el-radio-button>
                      <el-radio-button :label="false">
                        不包税
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item
                    label="派送方式"
                    label-width="90px"
                  >
                    <el-radio-group
                      v-model="searchForm.dispatch"
                      @change=";(searchForm.lscId = undefined)"
                    >
                      <el-radio-button :label="undefined">
                        全部
                      </el-radio-button>
                      <el-radio-button label="0">
                        卡派
                      </el-radio-button>
                      <el-radio-button label="1">
                        快递
                      </el-radio-button>
                      <el-radio-button label="2">
                        自提
                      </el-radio-button>
                      <el-radio-button
                        v-if="searchForm.subtypeId === '1' || searchForm.subtypeId === '2'"
                        label="3"
                      >
                        整柜直送
                      </el-radio-button>
                      <el-radio-button
                        v-if="searchForm.purposeType === 2"
                        label="4"
                      >
                        到仓
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item
                    v-if="custType === '0'"
                    label="一级代理商"
                    label-width="90px"
                  >
                    <el-select
                      v-model="searchForm.custId"
                      :loading="selectLoading"
                      size="mini"
                      clearable
                      filterable
                      placeholder="请选择"
                      style="width: 200px;"
                      @focus="getAgentList"
                    >
                      <el-option
                        v-for="item in agentList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="服务"
                    label-width="90px"
                  >
                    <el-select
                      v-model="searchForm.lscId"
                      :disabled="isLsc"
                      :loading="selectLoading"
                      size="mini"
                      clearable
                      filterable
                      placeholder="请选择"
                      style="width: 200px;"
                      @focus="getServiceList('sea')"
                    >
                      <el-option
                        v-for="item in serviceList1"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                      />
                    </el-select>
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
                    <el-button @click="handleClear('2')">
                      清空
                    </el-button>
                    <el-button
                      v-permission="['lineQuoteQuery']"
                      type="primary"
                      @click="handleConfirm('2')"
                    >
                      筛选
                    </el-button>
                  </div>
                </div>

                <div
                  slot="reference"
                  class="el-select el-select--small"
                  style="width: 100%;"
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
            v-loading="cardLoading"
            style="height: calc(100vh - 280px);"
          >
            <div
              v-for="(item) in cardList"
              :key="item.id"
              :class="{'active-card': currentId === item.id}"
              class="el-card is-hover-shadow"
              style="font-size: 12px;margin-bottom: 10px;cursor: pointer;"
              @click="onRow(item)"
              @contextmenu.prevent="showMenu(item, $event)"
            >
              <div class="el-card__body">
                <el-row>
                  <el-col :span="1">
                    <el-tooltip
                      v-if="item.audit === '0'"
                      effect="dark"
                      content="待审核"
                      placement="top"
                    >
                      <i
                        class="card-tips card-tip-zero"
                      />
                    </el-tooltip>
                    <el-tooltip
                      v-if="item.audit === '1'"
                      effect="dark"
                      content="已通过"
                      placement="top"
                    >
                      <i
                        class="card-tips card-tip-one"
                      />
                    </el-tooltip>
                    <el-tooltip
                      v-if="item.audit === '2'"
                      effect="dark"
                      content="已拒绝"
                      placement="top"
                    >
                      <i
                        class="card-tips card-tip-two"
                      />
                    </el-tooltip>
                    <el-tooltip
                      v-if="item.audit === '3'"
                      effect="dark"
                      content="审核中"
                      placement="top"
                    >
                      <i
                        class="card-tips card-tip-three"
                      />
                    </el-tooltip>
                  </el-col>
                  <el-col
                    :span="19"
                    class="word-limit"
                  >
                    {{ item.lsc.value }}
                  </el-col>
                  <el-col
                    :span="4"
                    style="text-align: right;"
                  >
                    {{ item.mode === '1' ? '特殊报价' : '标准报价' }}
                  </el-col>
                </el-row>
                <el-row style="margin: 10px 0;">
                  <el-col :span="4">
                    交货区域
                  </el-col>
                  <el-col
                    :span="16"
                    class="word-limit"
                    style="color:  #409EFF;"
                  >
                    {{ formatArea(item.deliveries) }}
                  </el-col>
                  <el-col
                    :span="4"
                    style="text-align: right;"
                  >
                    <span v-if="item.category === '1' || item.category === '2'">代理商价</span>
                    <span v-if="item.category === '3'">直客价</span>
                    <span v-if="item.category === '4'">同行价</span>
                    <span v-if="item.category === '0'">聚货通价</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="3">
                    <span
                      v-if="item.status === '1'"
                      class="btn-tip-green"
                    >
                      生效中
                    </span>
                    <span
                      v-if="item.status === '0'"
                      class="btn-tip-blue"
                    >
                      待生效
                    </span>
                    <span
                      v-if="item.status === '2'"
                      class="btn-tip-grey"
                    >
                      已失效
                    </span>
                  </el-col>
                  <el-col
                    :span="21"
                    style="line-height: 16px;"
                  >
                    {{ formatTime(item.period) }}
                  </el-col>
                  <el-col
                    :span="24"
                    style="text-align: right;"
                  >
                    <span class="border-tip-blue">
                      {{ (item.subtype || {}).value }}
                    </span>&nbsp;
                    <span class="border-tip-blue">
                      {{ item.includeTax ? '包税' : '不包税' }}
                    </span>&nbsp;
                    <span class="border-tip-blue">
                      <span v-if="item.dispatch === '0'">
                        卡派
                      </span>
                      <span v-if="item.dispatch === '1'">
                        快递
                      </span>
                      <span v-if="item.dispatch === '2'">
                        自提
                      </span>
                      <span v-if="item.dispatch === '3'">
                        整柜直送
                      </span>
                      <span v-if="item.dispatch === '4'">
                        到仓
                      </span>
                    </span>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-scrollbar>
          <el-pagination
            small
            :current-page.sync="page"
            :page-size="size"
            layout="total, prev, pager, next"
            :total="total"
            style="text-align: right;margin-top: 10px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
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
      v-loading="formLoading"
      style="flex: 1;overflow: auto;margin: 15px;background-color: #fff;padding: 20px;"
    >
      <div v-show="isRightShow">
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
            <el-col :span="20">
              <el-form-item
                label="业务类型"
                prop="subtypeId"
              >
                <el-select
                  v-model="selectForm.subtypeId"
                  :disabled="isEdit || !isAdd"
                  :loading="selectLoading"
                  style="width:100px;"
                  clearable
                  filterable
                  placeholder="请选择"
                  @focus="getSubtypeList"
                  @change="onSubtype"
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <!--<el-form-item
                v-if="isAdd"
                label="目的国"
                prop="countryId"
                label-width="70px"
              >
                <el-select
                  v-model="selectForm.countryId"
                  :loading="selectLoading"
                  :disabled="isEdit || !isAdd"
                  clearable
                  filterable
                  placeholder="请选择"
                  style="width: 100px;"
                  @focus="getCountryList"
                  @change="onCountry('sel')"
                >
                  <el-option
                    v-for="item in countryList"
                    :key="item.id"
                    :label="`${item.name}-${item.alias}`"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>-->
              <el-form-item
                prop="lscId"
                label-width="75px"
              >
                <span slot="label">服务</span>
                <el-tooltip
                  v-show="selectForm.lscId"
                  slot="label"
                  :content="selectForm.lscName + '/' + selectForm.lscCode"
                  placement="top"
                  effect="light"
                >
                  <i class="el-icon-warning-outline" />
                </el-tooltip>
                <el-popover
                  placement="bottom-start"
                  trigger="click"
                >
                  <div style="padding-right: 10px;">
                    <el-form-item
                      v-if="isAdd"
                      label="目的国"
                      label-width="90px"
                    >
                      <el-select
                        v-model="selectForm.countryId"
                        :loading="selectLoading"
                        :disabled="isEdit || !isAdd"
                        size="mini"
                        clearable
                        filterable
                        placeholder="请选择"
                        style="width: 200px;"
                        @focus="getCountryList"
                        @change="onCountry('sel')"
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
                      label="派送方式"
                      label-width="90px"
                    >
                      <el-select
                        v-model="selectForm.dispatch"
                        :loading="selectLoading"
                        :disabled="isEdit || !isAdd"
                        size="mini"
                        clearable
                        filterable
                        placeholder="请选择"
                        style="width: 200px;"
                        @change="onCountry('sel')"
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
                          label="自提"
                          value="2"
                        />
                        <el-option
                          v-if="selectForm.subtypeId === '1' || selectForm.subtypeId === '2'"
                          label="整柜直送"
                          value="3"
                        />
                        <el-option
                          label="到仓"
                          value="4"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="目的港关税"
                      label-width="90px"
                    >
                      <el-select
                        v-model="selectForm.includeTax"
                        :loading="selectLoading"
                        :disabled="isEdit || !isAdd"
                        size="mini"
                        clearable
                        filterable
                        placeholder="请选择"
                        style="width: 200px;"
                        @change="onCountry('sel')"
                      >
                        <el-option
                          label="包税"
                          :value="true"
                        />
                        <el-option
                          label="不包税"
                          :value="false"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="服务"
                      label-width="90px"
                    >
                      <el-select
                        v-model="selectForm.lscId"
                        :loading="selectLoading"
                        :disabled="isEdit || !isAdd || !selectForm.subtypeId"
                        style="width:200px;"
                        clearable
                        filterable
                        placeholder="请选择"
                        @focus="getServiceList('sel')"
                        @change="onServiceSel"
                      >
                        <el-option
                          v-for="item in serviceList2"
                          :key="item.id"
                          :label="item.label"
                          :value="item.id"
                        />
                      </el-select>
                    </el-form-item>
                  </div>
                  <div
                    slot="reference"
                    class="el-select el-select--small"
                    style="width: 100%;"
                  >
                    <el-input
                      v-model="selectForm.lscName"
                      placeholder="服务"
                      readonly
                      suffix-icon="el-select__caret el-input__icon el-icon-arrow-up"
                    />
                  </div>
                </el-popover>
              </el-form-item>

              <el-form-item
                v-if="custType === '2' && custSubtype === '2'"
                prop="refId"
                label="参考报价"
              >
                <el-select
                  v-model="selectForm.refId"
                  :loading="selectLoading"
                  :disabled="isEdit || !isAdd || !selectForm.lscId"
                  size="mini"
                  clearable
                  filterable
                  placeholder="请选择"
                  style="width:100px;"
                  @focus="getEffectiveBook"
                  @change="onEffect"
                >
                  <el-option
                    v-for="(item, index) in effectList"
                    :key="index"
                    :label="formatAreaTime(item.period, item.deliveries)"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>

              <el-form-item
                label="报价对象"
                prop="category"
                :required="custType === '2' || custType === '0'"
              >
                <div v-if="custType === '3'">
                  聚货通
                </div>
                <el-select
                  v-else-if="custType === '2' || custType === '0'"
                  v-model="selectForm.category"
                  :disabled="isEdit || !isAdd"
                  style="width:100px;"
                  clearable
                  filterable
                  placeholder="请选择"
                  @change="onType"
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
                v-if="(wyId === custId || custType === '0') && selectForm.mode === '0' && selectForm.category === '2'"
                label="分公司报价"
                label-width="100px"
              >
                <el-input-number
                  v-model="branch.peer"
                  class="input-number-valiate"
                  :controls="false"
                  :disabled="!isAdd && !isEdit"
                  style="width: 70px;margin-right: 10px"
                  placeholder="同行价"
                />
                <el-input-number
                  v-model="branch.direct"
                  class="input-number-valiate"
                  :controls="false"
                  :disabled="!isAdd && !isEdit"
                  style="width: 70px"
                  placeholder="直客价"
                />
              </el-form-item>
              <el-form-item
                v-if="wyId === custId && selectForm.mode === '0' && selectForm.category === '2'"
                label="计费配置"
                label-width="100px"
              >
                <el-select
                  v-model="measure.peer"
                  :loading="selectLoading"
                  :disabled="!isAdd && !isEdit"
                  style="width:140px;"
                  clearable
                  filterable
                  placeholder="同行计费配置"
                  @focus="getChargeList"
                >
                  <el-option
                    v-for="item in chargeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                <el-select
                  v-model="measure.direct"
                  :loading="selectLoading"
                  :disabled="!isAdd && !isEdit"
                  style="margin-left: 10px;width:140px;"
                  clearable
                  filterable
                  placeholder="直客计费配置"
                  @focus="getChargeList"
                >
                  <el-option
                    v-for="item in chargeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="4"
              style="text-align: right;"
            >
              <template v-if="!isHistory && selectForm.status !== '2' && custType !== '0'">
                <el-button
                  v-if="(!isEdit && !isAdd && ((custType === '2' && custSubtype === '1' && !editOther) || (selectForm.audit !== '1' && selectForm.audit !== '3'))) && $checkPermission(['lineQuoteEdit'])"
                  type="text"
                  size="small"
                  @click="editRow"
                >
                  编辑
                </el-button>
                <el-button
                  v-if="!isEdit && !isAdd && !editOther && selectForm.audit !== '1' && selectForm.status !== '2' && $checkPermission(['lineQuoteAudit'])"
                  type="text"
                  size="small"
                  @click="onShow"
                >
                  审核
                </el-button>
                <el-button
                  v-if="(isAdd || isEdit || editOther) && $checkPermission(['lineQuoteAdd', 'lineQuoteEdit'])"
                  type="text"
                  size="small"
                  style="padding-right: 10px;"
                  @click="cancelRow"
                >
                  取消
                </el-button>
                <el-button
                  v-if="(isAdd || isEdit || editOther) && $checkPermission(['lineQuoteAdd', 'lineQuoteEdit'])"
                  type="text"
                  size="small"
                  @click="saveRow"
                >
                  保存
                </el-button>
                <el-button
                  v-if="!isAdd && !isEdit && !editOther && selectForm.audit !== '1' && selectForm.audit !== '3' && $checkPermission(['lineQuoteDel'])"
                  type="text"
                  size="small"
                  @click="deleteRow(1)"
                >
                  删除
                </el-button>
              </template>
              <template v-if="!isEdit && !isAdd && !editOther && custType !== '0'">
                <el-button
                  v-if="$checkPermission(['lineQuoteCopy'])"
                  type="text"
                  size="small"
                  style="margin-left: 10px"
                  @click="copyPrice"
                >
                  复制此版本
                </el-button>
                <el-button
                  v-if="selectForm.audit === '1' && custType !== '0' && !historyId && $checkPermission(['linePriceInvalid'])"
                  type="text"
                  size="small"
                  style="margin-left: 10px"
                  @click="invalidPrice"
                >
                  失效
                </el-button>
              </template>
            </el-col>
          </el-row>

          <div class="item-read">
            <el-form-item
              label="目的港："
              label-width="95px"
              prop=""
            >
              <div>
                {{ selectForm.destinationName }}
              </div>
            </el-form-item>
            <el-form-item
              v-if="selectForm.subtypeId === '1' || selectForm.subtypeId === '2'"
              label="整柜/拼箱："
              label-width="95px"
              prop="containerType"
            >
              <div style="width: 60px;">
                <span v-if="selectForm.containerType === '1'">
                  整柜
                </span>
                <span v-if="selectForm.containerType === '0'">
                  拼箱
                </span>
              </div>
            </el-form-item>
            <el-form-item
              label="目的港关税："
              prop="includeTax"
              label-width="110px"
            >
              <div style="width: 60px;">
                <span v-if="selectForm.includeTax">
                  包税
                </span>
                <span v-if="!selectForm.includeTax">
                  不包税
                </span>
              </div>
            </el-form-item>
            <el-form-item
              label="目的港派送方式："
              label-width="130px"
              prop="dispatch"
            >
              <div style="width: 60px;">
                <span v-if="selectForm.dispatch === '0'">
                  卡派
                </span>
                <span v-if="selectForm.dispatch === '1'">
                  快递
                </span>
                <span v-if="selectForm.dispatch === '2'">
                  自提
                </span>
                <span v-if="selectForm.dispatch === '3'">
                  整柜直送
                </span>
                <span v-if="selectForm.dispatch === '4'">
                  到仓
                </span>
              </div>
            </el-form-item>
            <el-form-item
              label="重量单位："
              prop="umWeight"
            >
              <div style="width: 60px;">
                <span v-if="selectForm.umWeight === 'T'">
                  T-吨
                </span>
                <span v-if="selectForm.umWeight === 'LBS'">
                  LB-磅
                </span>
                <span v-if="selectForm.umWeight === 'KGS'">
                  KG-公斤
                </span>
                <span v-if="selectForm.umWeight === 'OZS'">
                  OZ-盎
                </span>
              </div>
            </el-form-item>

            <el-form-item
              label="长度单位："
              prop="umLength"
            >
              <div style="width: 60px;">
                <span v-if="selectForm.umLength === 'FT'">
                  FT-英尺
                </span>
                <span v-if="selectForm.umLength === 'M'">
                  M-米
                </span>
                <span v-if="selectForm.umLength === 'CM'">
                  CM-厘米
                </span>
              </div>
            </el-form-item>

            <el-form-item
              label="货币单位："
              prop="currencyId"
            >
              <span v-if="selectForm.currencyId">{{ selectForm.currencyId }}</span>
              <span v-if="selectForm.currencyName">{{ '-' + selectForm.currencyName }}</span>
            </el-form-item>
          </div>
          <div
            class="item-read"
            style="margin-bottom: 10px;"
          >
            <div v-show="chargeForm.type === '0'">
              <el-form-item
                label-width="0"
                style="padding-left: 10px;"
              >
                <span v-show="chargeForm.algorithm === '0'">取实重</span>
                <span v-show="chargeForm.algorithm === '2'">取实重或体积重的平均值</span>
                <span v-show="chargeForm.algorithm === '1'">取实重或体积重的最大值</span>
                <span v-show="chargeForm.algorithm === '1'"> | </span>
                <span v-show="chargeForm.algorithm === '1' && chargeForm.multiWeight === '0'">先累加后比较</span>
                <span v-show="chargeForm.algorithm === '1' && chargeForm.multiWeight === '1'">先比较后累加</span>
              </el-form-item>
              <el-form-item
                label="计量误差率(%)："
                prop="deviation"
                label-width="130px"
              >
                {{ chargeForm.deviation }}
              </el-form-item>
              <el-form-item
                v-show="chargeForm.algorithm === '1'"
                label="分泡比率(%)："
                label-width="110px"
                prop="bulky"
              >
                {{ chargeForm.bulky }}
              </el-form-item>
              <el-form-item
                v-show="chargeForm.algorithm === '1'"
                label="分泡条件："
                prop="fenestration"
              >
                {{ chargeForm.fenestration }}
              </el-form-item>
              <el-form-item
                label="单箱重量："
                prop="sbmc"
              >
                {{ chargeForm.sbmc }}
              </el-form-item>
              <el-form-item
                label="单票重量："
                prop="simc"
              >
                {{ chargeForm.simc }}
              </el-form-item>
            </div>
            <div v-show="chargeForm.type === '1'">
              <el-form-item
                label="计量误差率(%)："
                label-width="130px"
                prop="deviation"
              >
                {{ chargeForm.deviation }}
              </el-form-item>
              <el-form-item
                label="体积密度："
                prop="density"
              >
                {{ chargeForm.density }}
              </el-form-item>
            </div>
          </div>

          <el-row>
            <el-col :span="21">
              <el-form-item
                v-show="custType === '3' && selectForm.lscId && rangeTitle"
                :label="rangeTitle"
                class="is-required"
              >
                <el-button
                  :disabled="!isEdit && !isAdd"
                  type="primary"
                  size="mini"
                  plain
                  @click="onRangeReset"
                >
                  {{ rangeTitle }}
                </el-button>
              </el-form-item>
              <el-form-item
                v-show="custType === '3' && selectForm.lscId"
                label="目的地/区域"
                class="is-required"
                label-width="110px"
              >
                <el-button
                  :disabled="!isEdit && !isAdd"
                  type="primary"
                  size="mini"
                  plain
                  @click="onAreaReset"
                >
                  目的地/区域
                </el-button>
              </el-form-item>
              <el-form-item
                label="交货区域"
                label-width="90px"
                prop="areaId"
              >
                <el-select
                  v-model="selectForm.areaId"
                  :loading="selectLoading"
                  :disabled="(!isEdit && !isAdd) || (custType === '2' && custSubtype === '2')"
                  placeholder="请选择"
                  style="width:140px;"
                  clearable
                  filterable
                  multiple
                  collapse-tags
                >
                  <el-option
                    v-for="item in areaList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="selectForm.priceType !== '4'"
                prop="measureId"
                label-width="105px"
              >
                <span slot="label">计费配置</span>
                <el-tooltip
                  v-show="selectForm.measureId"
                  slot="label"
                  :content="selectForm.measureName"
                  placement="top"
                  effect="light"
                >
                  <i class="el-icon-warning-outline" />
                </el-tooltip>
                <el-select
                  v-model="selectForm.measureId"
                  :loading="selectLoading"
                  :disabled="(!isEdit && !isAdd) || !selectForm.lscId"
                  style="width:140px;"
                  clearable
                  filterable
                  placeholder="请选择"
                  @focus="getChargeList"
                  @change="onCharge"
                >
                  <el-option
                    v-for="item in chargeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="计费方式"
                prop=""
              >
                <span v-if="selectForm.priceType === '2'">按重量</span>
                <span v-if="selectForm.priceType === '3'">按体积</span>
                <span v-if="selectForm.priceType === '4'">按整柜</span>
              </el-form-item>
              <el-form-item
                v-if="custType === '0' || custType === '2'"
                label="价格标准"
                prop="mode"
              >
                <el-radio-group
                  v-model="selectForm.mode"
                  :disabled="!isEdit && !isAdd"
                  @change="onMode"
                >
                  <el-radio label="0">
                    标准
                  </el-radio>
                  <el-radio label="1">
                    特殊
                  </el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item
                v-if="(custType === '0' || custType === '2') && selectForm.mode === '1'"
                :label="selectForm.category === '3' || selectForm.category === '4' ? '关联客户' : '关联代理商'"
                class="is-required"
                label-width="110px"
              >
                <el-button
                  type="text"
                  size="mini"
                  @click="onCompany"
                >
                  已选择({{ (selectForm.agentId || []).length }})
                </el-button>
              </el-form-item>
              <el-form-item
                v-if="selectForm.mode === '1'"
                label="有效时间"
                prop="stdId"
              >
                <el-select
                  v-model="selectForm.stdId"
                  :loading="selectLoading"
                  :disabled="!isEdit && !isAdd"
                  style="width:240px;"
                  clearable
                  filterable
                  placeholder="请选择"
                  @focus="getTimeList"
                >
                  <el-option
                    v-for="item in timeList"
                    :key="item.id"
                    :label="`${item.effect}-${item.expire}`"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="selectForm.mode === '0'"
                label="有效时间"
                label-width="90px"
                prop="times"
              >
                <el-date-picker
                  v-model="selectForm.times"
                  :disabled="!isEdit && !isAdd"
                  :clearable="false"
                  :picker-options="pickerOptions"
                  :default-time="['00:00:00', '23:59:59']"
                  unlink-panels
                  type="datetimerange"
                  align="left"
                  size="mini"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  range-separator="~"
                  style="width:310px;margin-right: 10px;"
                  start-placeholder="起始时间"
                  end-placeholder="截止时间"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="3"
              style="text-align: right;"
            >
              <el-select
                v-if="!isEdit && !isAdd"
                v-model="historyId"
                clearable
                filterable
                placeholder="历史版本"
                style="width: 100%;"
                size="mini"
                @focus="getHistoryPrice"
                @change="onHistory"
              >
                <el-option
                  v-for="(item, index) in historyList"
                  :key="index"
                  :label="formatTime(item.period)"
                  :value="item.id"
                />
              </el-select>
              <el-popover
                v-if="['2'].includes(custType) && (isAdd || isEdit)"
                v-model="batchShow"
                placement="bottom"
                trigger="click"
                @show="onOpen"
                @hide="onClose"
              >
                <div style="padding:0 20px 0 10px;width: 240px;">
                  <div>请输入需要批量修改的值</div>
                  <el-input-number
                    v-model="batchNum"
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
                      @click="batchConfirm(0)"
                    >
                      重置
                    </el-button>
                    <div style="text-align: right;">
                      <el-button
                        type="text"
                        size="mini"
                        style="color: #999999"
                        @click="batchShow = false"
                      >
                        取消
                      </el-button>
                      <el-button
                        type="text"
                        size="mini"
                        @click="batchConfirm(1)"
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
          </el-row>
          <div v-if="!isEdit && !isAdd && selectForm.audit === '2'">
            <el-form-item
              label="拒绝原因："
              label-width="90px"
              style="width: 100%;"
            >
              {{ selectForm.remark }}
            </el-form-item>
          </div>
        </el-form>
        <div>
          <vxe-table
            v-if="aAxisData.length"
            ref="priceTable"
            border
            row-key
            :data="tableData"
            size="small"
            height="540"
            style="width: 100%;"
            :row-class-name="tableRowClassName"
            :auto-resize="true"
          >
            <vxe-table-column width="50">
              <template #default>
                <span class="drag-btn">
                  <i class="vxe-icon--menu" />
                </span>
              </template>
            </vxe-table-column>
            <vxe-table-column
              :show-overflow="true"
              :show-header-overflow="true"
              width="200"
              :resizable="true"
            >
              <template slot="header">
                <span class="header-row">{{ leftTitle }}</span>
                <span>&nbsp;&nbsp;\&nbsp;&nbsp;</span>
                <span class="header-column">{{ rightTitle }}</span>
              </template>
              <template slot-scope="scope">
                {{ (scope.row.address || {}).value }}
              </template>
            </vxe-table-column>
            <vxe-table-column
              v-if="isShowRegionalDetailCol"
              :show-overflow="true"
              :show-header-overflow="true"
              width="200"
              :resizable="true"
              title="区域详情"
              field="regionalDetails"
            />
            <vxe-table-column
              v-for="(item,index) in aAxisData"
              :key="index"
              :title="item.label"
              :show-overflow="true"
              :resizable="true"
            >
              <template slot-scope="scope">
                <div>
                  <el-input-number
                    v-if="(isEdit || isAdd) && !scope.row.isUpper"
                    v-model="scope.row.prices[index].price"
                    class="input-number-valiate"
                    size="small"
                    :controls="false"
                    placeholder="请输入"
                    :min="0"
                    :max="999999"
                    :precision="2"
                  />
                  <span v-else>{{ (scope.row.prices[index] || {}).price }}</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column
              min-width="100"
              title="参考时效(天)"
              :show-overflow="true"
              :resizable="true"
            >
              <template slot-scope="scope">
                <el-input
                  v-if="(isEdit || isAdd || editOther) && custType === '2' && custSubtype === '1'"
                  v-model="scope.row.prescription"
                  placeholder="请填写例:1-2或1至2或1到2"
                  size="small"
                />
                <span v-else>{{ scope.row.prescription }}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column
              min-width="120"
              title="备注"
              :show-overflow="true"
              :resizable="true"
            >
              <template slot-scope="scope">
                <el-input
                  v-if="(isEdit || isAdd || editOther) && !scope.row.isUpper"
                  v-model="scope.row.remark"
                  placeholder="请输入"
                  :maxlength="100"
                  size="small"
                />
                <span v-else>{{ scope.row.remark }}</span>
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
      </div>
    </div>
    <el-dialog
      width="600px"
      title="审核状态"
      :visible.sync="auditShow"
      append-to-body
      @closed="onHide"
    >
      <div
        v-loading="selectLoading"
        style="padding-right: 15px;"
      >
        <el-form
          ref="auditForm"
          :model="auditForm"
          :rules="auditRules"
          label-width="90px"
          label-position="right"
          size="small"
        >
          <el-form-item
            label="审核状态："
            prop="audit"
            label-width="110px"
          >
            <el-radio-group v-model="auditForm.audit">
              <el-radio label="1">
                通过
              </el-radio>
              <el-radio label="2">
                拒绝
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="auditForm.audit === '2'"
            label="拒绝原因："
            prop="remark"
            label-width="110px"
          >
            <el-input
              v-model="auditForm.remark"
              type="textarea"
              :rows="2"
              :maxlength="100"
              placeholder="请输入原因"
            />
          </el-form-item>
          <div
            v-show="auditForm.audit === '1' && selectForm.category === '2' && unCompanyList.length > 0"
            style="margin-left: 20px;"
          >
            <div class="audit-check">
              <el-checkbox
                v-model="checkAll2"
                :indeterminate="isIndeterminate2"
                @change="onCheckAll"
              >
                分公司同步审核通过
              </el-checkbox>
            </div>
            <div class="audit-group">
              <el-checkbox-group
                v-model="auditForm.companyIds"
                @change="onChecked"
              >
                <el-checkbox
                  v-for="(item, index) in unCompanyList"
                  :key="index"
                  :label="item.id"
                  style="display: block;margin: 8px 0;"
                >
                  {{ item.name }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div
            style="text-align: right;padding-top: 10px;"
          >
            <el-button
              size="small"
              @click="onHide"
            >
              取消
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="auditRow"
            >
              确认
            </el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogRange"
      :close-on-click-modal="false"
      :width="isType === 'one' ? '600px' : '960px'"
      @closed="cancelRange"
    >
      <div slot="title">
        <p>
          {{ '选择' + title }}
        </p>
        <p
          v-if="isType === 'one' || isType === 'two'"
          style="font-size: 14px;color: #606266;"
        >
          {{ text }}
        </p>
      </div>
      <div v-loading="selectLoading">
        <el-form
          ref="dialogForm"
          :model="dialogForm"
          label-width="100px"
          label-position="right"
          size="small"
          class="dialog-form"
        >
          <div v-show="isType === 'one'">
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
                    @click="addRangeData('0')"
                  />
                  <i
                    v-else
                    class="el-icon-remove-outline item-icon-reduce"
                    @click="deleteRangeData(index, '0')"
                  />
                </span>
              </div>
            </el-form-item>
          </div>
          <div v-show="isType === 'two'">
            <el-form-item
              label="重量范围"
              prop="sections1"
              style="width: 80%;"
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
                    @click="addRangeData('1')"
                  />
                  <i
                    v-else
                    class="el-icon-remove-outline item-icon-reduce"
                    @click="deleteRangeData(index, '1')"
                  />
                </span>
              </div>
            </el-form-item>
            <!-- <el-form-item
              label="方数范围"
              prop="sections2"
              style="width: 49%;"
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
                    @click="addRangeData('2')"
                  />
                  <i
                    v-else
                    class="el-icon-remove-outline item-icon-reduce"
                    @click="deleteRangeData(index, '2')"
                  />
                </span>
              </div>
            </el-form-item> -->
          </div>

          <div
            v-show="isType === 'four'"
            style="padding: 0 30px;"
          >
            <el-form-item
              label="地址类型"
              class="is-required"
              style="width: 50%;"
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
              style="width: 50%;"
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
                @change="onAxisYCountry"
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
        </el-form>
        <div v-show="isType === 'three' || isType === 'four'">
          <el-transfer
            ref="transferItem"
            v-model="options"
            filterable
            :filter-method="filterMethod"
            :titles="[`选择${title}`, '已选择']"
            :props="{key: 'id', label: 'name'}"
            filter-placeholder="输入搜索"
            :data="boxList"
            style="height: 500px;"
          />
        </div>

        <div
          slot="footer"
          style="text-align: right;margin: 20px 20px 0;"
        >
          <el-button
            type="primary"
            size="small"
            @click="saveRange"
          >
            保存
          </el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="dialogCompany"
      :close-on-click-modal="false"
      width="960px"
      @closed="cancelCompany"
    >
      <div v-loading="selectLoading">
        <el-transfer
          ref="transferItem"
          v-model="options"
          filterable
          :filter-method="filterMethod"
          :titles="[`选择${title}`, '已选择']"
          :props="{key: 'id', label: 'name'}"
          filter-placeholder="输入搜索"
          :data="companyList"
          style="height: 500px;"
        />
        <div
          v-if="!((!isEdit && !isAdd && isHistory) || (!isEdit && !isAdd && selectForm.audit !== '1'))"
          slot="footer"
          style="text-align: right;margin: 20px 40px 0;"
        >
          <el-button
            size="small"
            @click="dialogCompany = false"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="saveCompany"
          >
            保存
          </el-button>
        </div>
      </div>
    </el-dialog>
    <ul
      v-show="isShowMenu"
      :style="{left: menuLeft+'px', top: menuTop+'px'}"
      class="contextmenu"
    >
      <li
        v-permission="['lineQuoteCopy']"
        class="contextmenu-item"
        @click="onRow(showMenuRow, true)"
      >
        复制
      </li>
      <li
        v-permission="['lineQuoteGet']"
        class="contextmenu-item"
        @click="onRow(showMenuRow)"
      >
        查看
      </li>
      <li
        v-if="showMenuRow.audit !== '1' && showMenuRow.audit !== '3' && $checkPermission(['lineQuoteDel'])"
        class="contextmenu-item"
        @click="deleteRow(2)"
      >
        删除
      </li>
    </ul>
    <agent-price
      ref="AgentPrice"
      @close="closeAgentPrice"
    />
    <transition name="el-fade-in-linear">
      <div
        v-show="showAgentPriceModel && isRightShow && custType === '0' && $checkPermission(['lineQuoteQuotation'])"
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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getServiceSubtypeList,
  getCountryList,
  getAreaList,
  getLscList,
  getHistoryPrice,
  geCurrencyList,
  getEffectiveBook,
  getAgentList,
  savePriceAgent,
  getPriceList,
  getPriceConfig,
  getPriceById,
  getContainerList,
  savePriceConfig,
  savePrice,
  savePrescription,
  checkPrice,
  deletePrice,
  getChargeList,
  getStandardPeriod,
  groupByPid,
  invalidPrice,
  getUnFinanceAgentById
} from '@/api/price-to-private-line'
import {
  getRegionList,
  getFbastoreList,
  getStateByCountry,
  getAllAreaList
} from '@/api/service-with-privateline-clearance'
import dayjs from 'dayjs'
import { getCustTypeList } from '@/api/price-to-car'
import AgentPrice from '@/views/price-management/private-line/components/agentPrice.vue'
import Sortablejs from 'sortablejs'

function paramsForm() {
  return {
    destinationName: '',
    subtypeId: undefined,
    subtypeName: undefined,
    containerType: undefined,
    lscId: undefined,
    lscName: undefined,
    lscCode: undefined,
    status: undefined,
    areaId: [],
    refId: undefined,
    measureId: undefined,
    measureName: undefined,
    deliveryId: undefined,
    deliveryName: undefined,
    priceType: undefined,
    purposeType: undefined,
    currencyId: undefined,
    countryId: undefined,
    category: undefined,
    umWeight: undefined,
    umLength: undefined,
    includeTax: undefined,
    agentId: [],
    mode: '0',
    times: [],
    stdId: undefined,
    dispatch: undefined,
    // includExpressFee: false,
    sections: [{
      lower: undefined,
      upper: undefined
    }],
    audit: undefined,
    remark: ''
  }
}
function paramsXY() {
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
function paramsCharge() {
  return {
    type: undefined,
    deviation: undefined,
    density: undefined,
    algorithm: undefined,
    bulky: undefined,
    fenestration: undefined,
    sbmc: undefined,
    simc: undefined,
    multiWeight: undefined
  }
}
@Component({
  name: '',
  components: {
    AgentPrice
  },
  props: {}
})
export default class extends Vue {
  /** data */
  private wyId: string = '280b587801744450a6b5aa3155c25e61'
  private branch: any = {
    peer: undefined, // 同行
    direct: undefined // 直客
  }
  private measure: any = {
    peer: undefined, // 同行
    direct: undefined // 直客
  }
  private showAgentPriceModel: boolean = true
  private text: string = '(取值范围：>=起始值， <结束值)'
  private showMenuRow: any = {}
  private isShowMenu: boolean = false
  private menuTop: number = 0
  private menuLeft: number = 0
  private searchForm: any = {
    subtypeId: undefined,
    lscId: undefined,
    custId: undefined,
    category: undefined,
    purposeType: undefined,
    lscName: undefined,
    destinationCountry: undefined,
    mode: undefined,
    areaId: [],
    dispatch: undefined,
    includeTax: undefined,
    audit: undefined,
    effect: undefined,
    expire: undefined,
    times: []
  }
  private selectForm: any = paramsForm()
  private dialogForm: any = paramsXY()
  private auditForm: any = {
    audit: undefined,
    remark: undefined,
    companyIds: []
  }
  private chargeForm: any = paramsCharge()
  private auditRules = {
    audit: [{ required: true, message: '请选择审核状态', trigger: 'change' }]
  }
  private formRules = {
    subtypeId: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
    countryId: [{ required: false, message: '请选择目的国', trigger: 'change' }],
    lscId: [{ required: true, message: '请选择服务', trigger: 'change' }],
    category: [{ required: true, message: '请选择报价对象', trigger: 'change' }],
    refId: [{ required: true, message: '请选择参考报价', trigger: 'change' }],
    areaId: [{ required: true, message: '请选择交货区域', trigger: 'change' }],
    measureId: [{ required: true, message: '请选择计费配置', trigger: 'change' }],
    mode: [{ required: true, message: '请选择价格标准', trigger: 'change' }],
    times: [{ required: true, message: '请选择有效时间', trigger: 'change' }],
    stdId: [{ required: true, message: '请选择有效时间', trigger: 'change' }]
  }
  private addressList: any[] = [
    { name: '国家', id: '0' },
    { name: '国内区域', id: '5' },
    { name: '城市区域', id: '100' },
    { name: '仓库区域', id: '101' },
    { name: '国家区域', id: '102' },
    { name: '州省', id: '1' },
    { name: '仓库代码', id: '7' }
  ]
  private editOther: boolean = false
  private isActive: boolean = true
  private popoverShow1: boolean = false
  private popoverShow2: boolean = false
  private selectLoading: boolean = false
  private formLoading: boolean = false
  private cardLoading: boolean = false
  private checkAll: boolean = false
  private isIndeterminate: boolean = false
  private checkAll2: boolean = false
  private isIndeterminate2: boolean = false
  private isEdit: boolean = false
  private isAdd: boolean = false
  private dialogRange: boolean = false
  private dialogCompany: boolean = false
  private isType = ''
  private title = ''
  private leftTitle = ''
  private rightTitle = ''
  private rangeTitle = ''
  private currentId = ''
  private currentLscId = ''
  private currentRefId = ''
  private currentAreaId: any[] = []
  private isTableShow: boolean = false
  private isRightShow: boolean = false
  private isHistory: boolean = false
  private options: any[] = []
  private boxList: any[] = []
  private companyList: any[] = []
  private typeList: any[] = []
  private countryList: any[] = []
  private agentList: any[] = []
  private unCompanyList: any[] = []
  private auditList: any[] = [
    { name: '待审核', id: '0' },
    { name: '已通过', id: '1' },
    { name: '已拒绝', id: '2' },
    { name: '审核中', id: '3' }
  ]
  private auditShow: boolean = false
  private batchShow: boolean = false
  private isShowRegionalDetailCol: boolean = false
  private batchNum: any = ''
  private effectList: any[] = []
  private copyTable: any[] = []
  private custList: any[] = []
  private historyId: any = ''
  private historyList: any[] = []
  private areaList: any[] = []
  private serviceList1: any[] = []
  private serviceList2: any[] = []
  private currencyList: any[] = []
  private warehouseList: any[] = []
  private chargeList: any[] = []
  private tableData: any[] = []
  private cardList: any[] = []
  private tableUpper: any[] = []
  private timeList: any[] = []
  private tableXY: any[] = []
  private aAxisData: any[] = []
  private page: number = 1
  private size: number = 10
  private total: number = 0

  /** computed */
  // 所属公司id
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }
  get parentId(): string {
    const info = UserModule.info || {}
    const parentId = (info as any).parentId
    return parentId
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

  get pickerOptions() {
    return {
      disabledDate(time: any) {
        return dayjs(time) < dayjs().subtract(1, 'd')
      },
      selectableRange: '00:00:00 - 20:30:00'
    }
  }

  get isLsc() {
    const form = (this as any).searchForm
    return !form.destinationCountry
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
  private getAgentList() {
    this.selectLoading = true
    const params = {
      page: 1,
      size: 9999,
      parentId: (this as any).custId
    }
    getAgentList(params).then(res => {
      const data = res.data || {}
      const result = data.result || []
      this.agentList = result.filter((it: any) => it.status === '1')
      this.selectLoading = false
    }).catch(err => {
      this.selectLoading = false
      return err
    })
  }

  private invalidPrice() {
    this.$confirm('该操作会使此报价及相关代理报价失效，请确认是否操作?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const params = {
        id: this.currentId
      }
      const loading = this.$loading({
        lock: true,
        text: '',
        background: 'hsla(0,0%,100%,.9)'
      })
      invalidPrice(params).then(() => {
        loading.close()
        this.resetForm()
        this.getTableData()
      }).catch(() => {
        loading.close()
      })
    }).catch(() => {
      return false
    })
  }
  private async groupByPid() {
    const typeList = ['5', '100', '101', '102']
    const type = this.tableData[0].addressType
    if (typeList.indexOf(type) === -1) {
      this.isShowRegionalDetailCol = false
    } else {
      this.isShowRegionalDetailCol = true
      const ids = this.tableData.reduce((idList: any[], next: any) => {
        const key = next.address ? next.address.key : ''
        if (key && idList.indexOf(key) === -1) {
          idList.push(key)
        }
        return idList
      }, [])
      const params: any = {
        ids
      }
      if (type === '5') {
        params.type = 1
      }
      await groupByPid(params).then((res: any) => {
        this.formLoading = false
        const data = res.data || {}
        const list: any[] = Object.keys(data).map((key: any) => {
          const tamp = {
            key,
            value: data[key].map((e: any) => {
              let str = ''
              if (type === '101') {
                str = e.warehouseName
              }
              if (type === '102') {
                str = e.countryId + '-' + e.countryName
              }
              if (type === '100') {
                str = e.cityName
              }
              if (type === '5') {
                str = e.stateName
              }
              return str
            }).join('，')
          }
          return tamp
        })
        this.tableData = this.tableData.map((item: any) => {
          const key = item.address ? item.address.key : ''
          list.map((e: any) => {
            if (e.key === key) {
              item.regionalDetails = e.value
            }
          })
          return item
        })
      }).catch((err: any) => {
        this.formLoading = false
        return err
      })
    }
  }

  private setSort() {
    if (this.aAxisData.length > 0) {
      this.$nextTick(() => {
        const el: any = this.$refs.priceTable
        const dom: any = el.$el
        const node: any = dom.querySelector('.body--wrapper>.vxe-table--body tbody')
        const that = this
        Sortablejs.create(node, {
          handle: '.drag-btn',
          animation: 300,
          onEnd: ({ newIndex, oldIndex }: any) => {
            const currRow = that.tableData.splice(oldIndex, 1)[0]
            that.tableData.splice(newIndex, 0, currRow)
          }
        })
      })
    }
  }

  private async copyPrice() {
    let id = ''
    if (this.historyId) {
      id = this.historyId
      // 复制当前版本为历史版本
      this.historyList.map((it: any) => {
        if (this.historyId === it.id) {
          this.selectForm.refId = it.refId
          this.selectForm.areaId = it.deliveries.map((d: any) => d.key)
        }
      })
      this.selectForm.lscId = this.currentLscId
      await this.getEffectiveBook()
      this.effectList.map((it: any) => {
        if (this.selectForm.refId === it.id) {
          const arr = it.rows || []
          this.tableUpper = arr.map((a: any) => {
            if (a) {
              return {
                ...a,
                isUpper: true
              }
            }
          })
        }
      })
    } else {
      id = this.currentId
    }
    this.tableUpper = this.tableUpper.sort((a: any, b: any) => a.address.value.localeCompare(b.address.value))
    await this.getRowDetail(id, true)
  }
  private showMenu(row: any, e: MouseEvent) {
    if (!(this as any).$checkPermission(['lineQuoteGet', 'lineQuoteCopy', 'lineQuoteDel'])) return
    this.showMenuRow = row
    this.menuLeft = e.clientX
    this.menuTop = e.clientY
    this.isShowMenu = true
  }
  private closeMenu() {
    this.isShowMenu = false
  }
  private formatArea(arr: any[]) {
    const arrN = (arr || []).map((it: any) => it.value)
    return arrN.join(',')
  }
  private formatAreaTime(obj: any, arr: any[]) {
    const arrN = (arr || []).map((it: any) => it.value)
    const start = (obj || {}).effect
    const end = (obj || {}).expire
    return dayjs(start).format('YYYY-MM-DD HH:mm') + '-' + dayjs(end).format('YYYY-MM-DD HH:mm') + ' ' + arrN.join(',')
  }
  private formatTime(obj: any) {
    const start = (obj || {}).effect
    const end = (obj || {}).expire
    return dayjs(start).format('YYYY-MM-DD HH:mm') + '-' + dayjs(end).format('YYYY-MM-DD HH:mm')
  }
  private toggle() {
    this.isActive = !this.isActive
  }
  private tableRowClassName(data: any) {
    if (data.row.isUpper) {
      return 'success-row'
    }
    return ''
  }
  private handleClear(val: any) {
    switch (val) {
      case '1':
        this.searchForm.destinationCountry = undefined
        this.searchForm.lscId = undefined
        this.searchForm.lscName = undefined
        break
      case '2':
        this.searchForm.areaId = []
        this.searchForm.mode = undefined
        this.searchForm.includeTax = undefined
        this.searchForm.category = undefined
        this.searchForm.dispatch = undefined
        this.searchForm.custId = undefined
        this.searchForm.times = []
        break
      default:
        break
    }
  }
  private handleConfirm(val: any) {
    if (val === '1') {
      this.popoverShow1 = false
    } else if (val === '2') {
      this.popoverShow2 = false
    }
    this.getTableData(1)
  }
  private getTableData(page?: any) {
    this.cardLoading = true
    const { areaId, times, custId, ...form } = this.searchForm
    if (page === 1) {
      this.page = page
    }
    const params: any = {
      ...form,
      custId: this.custType === '0' ? custId : (this as any).custId,
      effect: Array.isArray(times) && times.length > 0 ? times[0] + ' 00:00:00' : undefined,
      expire: Array.isArray(times) && times.length > 0 ? times[1] + ' 23:59:59' : undefined,
      page: this.page,
      size: this.size
    }
    const arr = (areaId || []).map((it:any) => {
      const item = this.areaList.find((a: any) => it === a.name) || {}
      if (item.id && item.name) {
        return item.id
      }
    })
    params.deliveries = arr.join(',')
    getPriceList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.cardList = data.result || []
        this.total = data.total
        // this.resetForm()
        this.cardLoading = false
      })
      .catch((err: any) => {
        this.cardLoading = false
        return err
      })
  }

  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.getTableData()
  }
  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.getTableData()
  }

  private async onRow(item: any, isCopy?: boolean) {
    if (!(this as any).$checkPermission(['lineQuoteGet', 'lineQuoteCopy'])) return
    // 查看 /复制
    if (this.formLoading) return
    this.resetForm()
    this.showMenuRow = item
    this.isRightShow = true
    this.formLoading = true
    this.currentId = item.id
    this.currentLscId = item.lsc.key
    this.currentRefId = item.refId
    this.currentAreaId = item.deliveries.map((it: any) => it.key)
    this.selectForm.lscId = item.lsc.key
    this.selectForm.refId = item.refId
    this.selectForm.areaId = item.deliveries.map((it: any) => it.key)
    await this.getEffectiveBook()
    this.effectList.map((it: any) => {
      if (this.selectForm.refId === it.id) {
        const arr = it.rows || []
        this.tableUpper = arr.map((a: any) => {
          if (a) {
            return {
              ...a,
              isUpper: true
            }
          }
        })
      }
    })
    this.tableUpper = this.tableUpper.sort((a: any, b: any) => a.address.value.localeCompare(b.address.value))
    await this.getRowDetail(this.currentId, isCopy)
  }
  private async getRowDetail(id: string, isCopy?: boolean) {
    this.historyList = []
    this.formLoading = true
    try {
      const resD = await getPriceById({ id })
      const dataD = resD.data || {}
      const {
        measureDirect = {},
        measurePeer = {},
        peer,
        direct,
        currency,
        deliveries,
        lsc,
        period,
        specials,
        subtype,
        rows,
        measure,
        loadType,
        ...form
      } = dataD
      // set table-title
      this.branch = {
        peer,
        direct
      }
      this.measure = {
        peer: (measurePeer || {}).key, // 同行
        direct: (measureDirect || {}).key // 直客
      }
      const yType = ((rows || [])[0] || {}).addressType
      const objLeft: any = {
        '0': '国家',
        '1': '州省',
        '5': '国内区域',
        '7': '仓库代码',
        '100': '城市区域',
        '101': '仓库区域',
        '102': '国家区域'
      }
      Object.keys(objLeft).map((key: any) => {
        if (key === yType) {
          this.leftTitle = objLeft[key]
        }
      })
      const arrP = ((rows || [])[0] || {}).prices || []
      this.aAxisData = arrP.map((it: any) => {
        const itemX = it.x || {}
        const obj: any = {
          label: '',
          aAxisArr: []
        }
        if (loadType === '2') {
          obj.label = itemX.value
          this.rightTitle = '柜型'
        } else {
          this.rightTitle = loadType === '5' && it.type === '1' ? '方数区间' : it.type === '0' ? '重量区间' : '体积区间'
          obj.label = `${itemX.lower}-${itemX.upper}`
        }
        return obj
      })
      // set form
      let timeS: any = ''
      let timeE: any = ''
      if (period.effect && period.expire && !isCopy) {
        timeS = dayjs(period.effect).format('YYYY-MM-DD HH:mm:ss')
        timeE = dayjs(period.expire).format('YYYY-MM-DD HH:mm:ss')
      }
      this.selectForm = {
        ...form,
        yType,
        loadType,
        measureId: (measure || {}).key,
        measureName: (measure || {}).value,
        lscId: (lsc || {}).key,
        lscName: (lsc || {}).value,
        subtypeId: (subtype || {}).key,
        subtypeName: (subtype || {}).value,
        currencyId: (currency || {}).key,
        currencyName: (currency || {}).value,
        times: timeS && timeE ? [timeS, timeE] : [],
        agentId: specials.map((it: any) => it.key),
        areaId: deliveries.map((it: any) => it.key)
      }
      await this.getServiceList('sel')
      const itemSel = this.serviceList2.find((it: any) => it.id === this.selectForm.lscId) || {}
      this.selectForm.lscCode = itemSel.lsId
      this.selectForm.destinationName = itemSel.destinationName
      // set table
      const json: any[] = []
      rows.map((it: any, index: any) => {
        it.prices = it.prices.map((price: any) => {
          const tamp: any = {
            ...price
          }
          tamp.price = String(tamp.price) ? tamp.price : undefined
          return tamp
        })
        json.push(it)
      })
      const sortJson = json.sort((a: any, b: any) => a.address.value.localeCompare(b.address.value))

      this.tableData = sortJson.reduce((list: any[], item: any, index: number) => {
        if (Array.isArray(this.tableUpper) && this.tableUpper[index]) {
          const tamp = this.tableUpper[index] || {
            address: item.address,
            addressType: item.addressType,
            prices: [],
            remark: undefined,
            prescription: '',
            isUpper: true
          }
          list.push(tamp)
          item.prescription = tamp.prescription
          item.remark = tamp.remark
        } // 上级报价
        list.push(item)
        return list
      }, [])
      this.setSort()
      await this.groupByPid()
      this.copyTable = JSON.parse(JSON.stringify(json))
      this.isTableShow = true
      // set copy
      if (isCopy) {
        this.selectForm.audit = undefined
        this.selectForm.id = undefined
        this.isAdd = true
        this.isEdit = false
        this.editOther = false
        this.currentId = ''
        this.historyId = ''
        this.isHistory = false
        this.selectForm.status = undefined
      } else {
        this.isAdd = false
      }
      if (this.custType === '0' && !this.showAgentPriceModel) {
        this.showAgentPrice()
      }
      await this.getChargeCopyList()
      this.onRangeTitle()
      this.getSubtypeList()
      this.getTimeList()
      this.getCustTypeList()
      this.formLoading = false
    } catch (error) {
      this.formLoading = false
    }
  }

  private addPrice() {
    this.resetForm()
    this.isRightShow = true
    this.isAdd = true
  }
  private editRow() {
    if (this.selectForm.audit !== '1' && this.selectForm.audit !== '3') {
      this.isEdit = true
    } else {
      this.editOther = true
    }
  }

  // 审核
  private async onShow() {
    this.auditingRow()
    const { audit, remark } = this.selectForm
    this.auditForm = {
      audit: '1',
      companyIds: [],
      remark
    }
    this.auditShow = true
    if ((this as any).custId === this.wyId) {
      await this.getUnFinanceCompanyList()
      this.checkAll2 = true
      this.onCheckAll(this.checkAll2)
    }
  }
  private onHide() {
    this.auditShow = false
    this.checkAll2 = false
    this.isIndeterminate2 = false
    this.auditForm = {
      audit: undefined,
      remark: undefined,
      companyIds: []
    }
    const root: any = this.$refs.auditForm
    this.$nextTick(() => {
      root.clearValidate()
    })
  }
  private onCheckAll(val: any) {
    const arrN = this.unCompanyList.map((it: any) => it.id)
    this.auditForm.companyIds = val ? arrN : []
    this.isIndeterminate2 = false
  }

  private onChecked(val: any) {
    const numC = (val || []).length
    const numA = (this.unCompanyList || []).length
    this.checkAll2 = numC === numA
    this.isIndeterminate2 = numC > 0 && numC < numA
  }
  private async getUnFinanceCompanyList() {
    this.selectLoading = true
    const params = {
      custId: (this as any).custId
    }
    await getUnFinanceAgentById(params)
      .then((res: any) => {
        const data = res.data || []
        this.unCompanyList = data
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private onOpen() {
    this.batchNum = undefined
  }
  private onClose() {
    this.batchNum = undefined
  }
  private batchConfirm(type: any) { // 0为重置
    this.tableData = this.tableData.map((it: any, index: number, list: any[]) => {
      if (this.custType === '0' || this.custType === '2') {
        it.prices = it.prices.map((p: any, i: number) => {
          if (type === 1) {
            if (it.prices[i]) {
              p.price = parseFloat(((it.prices[i].price || 0) + this.batchNum).toFixed(2))
            }
          } else {
            if (this.batchNum) {
              if (it.prices[i] && it.prices[i].price) {
                p.price = parseFloat((it.prices[i].price - this.batchNum).toFixed(2))
              }
            } else {
              p.price = undefined
            }
          }
          return p
        })
      } else {
        if (index % 2 !== 0) {
          const superPrice: any = list[index - 1]
          it.prices = it.prices.map((p: any, i: number) => {
            if (type === 1) {
              if (superPrice.prices[i] && superPrice.prices[i].price) {
                p.price = parseFloat((superPrice.prices[i].price + this.batchNum).toFixed(2))
              }
            } else {
              p.price = undefined
            }
            return p
          })
        }
      }
      return it
    })
  }

  private auditingRow() {
    // 审核中
    const { audit } = this.selectForm
    if (audit === '0') {
      const params: any = {
        audit: '3',
        id: this.currentId,
        reason: ''
      }
      checkPrice(params).then((res: any) => {
        this.cardList.map((it: any) => {
          if (it.id === this.currentId) {
            it.audit = '3'
            this.selectForm.audit = '3'
          }
        })
      }).catch((err: any) => err)
    }
  }
  private async auditRow() {
    const root: any = this.$refs.auditForm
    if (this.auditForm.audit !== '1' && this.auditForm.audit !== '2') {
      return
    }
    this.selectLoading = true
    const { companyIds } = this.auditForm
    const list = this.unCompanyList.map((it: any) => {
      return {
        custType: '2',
        customerId: it.id,
        customerName: it.name,
        flag: companyIds.includes(it.id)
      }
    })
    const params: any = {
      audit: this.auditForm.audit,
      id: this.currentId,
      list: list.filter((it: any) => it.customerId && it.customerName),
      reason: this.auditForm.remark
    }
    try {
      const res = await checkPrice(params)
      this.$message({
        type: 'success',
        message: '审核成功'
      })
      this.onHide()
      this.getTableData()
      this.resetForm()
      this.selectLoading = false
      const agentPrice = this.$refs.AgentPrice as any
      agentPrice.close()
    } catch (error) {
      this.selectLoading = false
      return error
    }
  }
  private async cancelRow() {
    if (this.editOther) {
      this.editOther = false
      await this.getRowDetail(this.currentId)
    }
    if (this.isEdit) {
      this.isEdit = false
      await this.getRowDetail(this.currentId)
    }
    if (this.isAdd) {
      (this.$refs.AgentPrice as any).close()
      this.resetForm()
    }
  }
  private deleteRow(tag: any) {
    // 删除 tag 1为查看删除 2为右键
    const params = {
      id: tag === 1 ? this.currentId : this.showMenuRow.id
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deletePrice(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.resetForm()
            this.getTableData()
            const agentPrice = this.$refs.AgentPrice as any
            agentPrice.close()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }
  // 生成分公司报价条件发生变化将值置空
  private modeChange() {
    this.branch = {
      peer: undefined, // 同行
      direct: undefined // 直客
    }
    this.measure = {
      peer: undefined, // 同行
      direct: undefined // 直客
    }
  }
  private saveRow() {
    const editForm: any = this.$refs.editForm
    editForm.validate((valid: any) => {
      if (!valid) return false
      const json = this.tableData.filter((it: any) => {
        return !it.isUpper
      })
      if (json.length <= 0) {
        this.$message.error('暂未配置，无法报价')
        return
      }
      const isPrice = json.every((it: any) => it.prices.every((p: any) => !p.price && p.price !== 0))
      if (isPrice) {
        this.$message.error('请至少填写一条报价')
        return
      }
      let flag = true
      const reg = /^\d+[-|至|到]\d+$/
      for (let i = 0; i < json.length; i++) {
        const price = json[i]
        const prices = price.prices || []
        if (prices.some((p: any) => p.price)) {
          if (!price.prescription) {
            this.$message.error('第' + (i + 1) + '行参考时效不能为空，请填写如(1-2或1至2或1到2)')
            flag = false
            break
          }
          if (!reg.test(price.prescription)) {
            this.$message.error('第' + (i + 1) + '行参考时效格式不正确，请填写如(1-2或1至2或1到2)')
            flag = false
            break
          }
        }
      }
      if (!flag) return
      json.map((it: any) => {
        (it.prices || []).map((p: any) => {
          if (!String(p.price)) {
            p.price = undefined
          }
        })
      })
      this.typeList.map((it: any) => {
        if (it.id === this.selectForm.subtypeId) {
          this.selectForm.subtypeName = it.name
        }
      })
      const {
        currencyId,
        currencyName,
        areaId,
        measureId,
        measureName,
        times,
        refId,
        lscId,
        lscName,
        agentId,
        mode,
        stdId,
        subtypeId,
        subtypeName,
        sections,
        audit,
        includeTax,
        ...form
      } = this.selectForm
      const arrS: any[] = []
      if (mode === '1' && Array.isArray(agentId) && agentId.length <= 0) {
        this.$message.error('请选择关联代理商')
        return
      } else if (mode === '1') {
        agentId.map((it: any) => {
          const item = this.companyList.find((c: any) => c.id === it) || {}
          arrS.push({
            key: it,
            value: item.name
          })
        })
      }

      const arrD = areaId.map((it: any, index: any) => {
        const item = this.areaList.find((a: any) => it === a.id)
        return {
          key: it,
          value: item.name
        }
      }).filter((it: any) => it.key && it.value)
      let measureDirect = {}
      let measurePeer = {}
      if (this.wyId === this.custId && this.selectForm.mode === '0' && this.selectForm.category === '2') {
        // 物有分公司报价判断
        if (!this.branch.peer && this.branch.peer !== 0) {
          this.$message.warning('请填写分公司同行价')
          return
        }
        if (!this.branch.direct && this.branch.direct !== 0) {
          this.$message.warning('请填写分公司直客价')
          return
        }
        if (!this.measure.peer) {
          this.$message.warning('请选择分公司同行计费配置')
          return
        }
        if (!this.measure.direct) {
          this.$message.warning('请选择分公司直客计费配置')
          return
        }
        this.chargeList.forEach((c: any) => {
          if (c.id === this.measure.peer) {
            measurePeer = {
              key: c.id,
              value: c.name
            }
          }
          if (c.id === this.measure.direct) {
            measureDirect = {
              key: c.id,
              value: c.name
            }
          }
        })
      }
      const type = (this as any).custType
      const params: any = {
        peer: this.branch.peer || 0,
        direct: this.branch.direct || 0,
        flag: this.wyId === this.custId,
        measureDirect,
        measurePeer,
        ...form,
        includeTax,
        audit: audit === '2' ? '0' : audit,
        mode,
        stdId,
        cust: {
          key: (this as any).custId,
          value: (this as any).custName,
          fromCustType: (this as any).custType,
          fromCustSubtype: (this as any).custSubtype
        },
        refId: type === '0' || (type === '2') ? refId : (this as any).custId,
        custType: (this as any).custType,
        currency: {
          key: currencyId,
          value: currencyName
        },
        lsc: {
          key: lscId,
          value: lscName
        },
        subtype: {
          key: subtypeId,
          value: subtypeName
        },
        measure: {
          key: measureId,
          value: measureName
        },
        period: {},
        deliveries: arrD,
        specials: arrS,
        rows: json
      }
      if (mode === '1') {
        this.timeList.map((it: any) => {
          if (stdId === it.id) {
            params.period.effect = it.effect
            params.period.expire = it.expire
          }
        })
      } else {
        params.period = {
          effect: Array.isArray(times) && times.length > 0 ? dayjs(times[0]).format('YYYY-MM-DD HH:mm:ss') : undefined,
          expire: Array.isArray(times) && times.length > 0 ? dayjs(times[1]).format('YYYY-MM-DD HH:mm:ss') : undefined
        }
      }
      this.formLoading = true
      if (this.editOther) {
        const editParams = {
          id: params.id,
          rows: params.rows.map((row: any) => {
            return {
              addressId: row.address.key,
              prescription: row.prescription,
              remark: row.remark
            }
          })
        }
        savePrescription(editParams)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.resetForm()
            this.formLoading = false
            this.getTableData()
            const agentPrice = this.$refs.AgentPrice as any
            agentPrice.close()
          })
          .catch(err => {
            this.formLoading = false
            return err
          })
      } else {
        savePrice(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.resetForm()
            this.formLoading = false
            this.getTableData()
            const agentPrice = this.$refs.AgentPrice as any
            agentPrice.close()
          })
          .catch(err => {
            this.formLoading = false
            return err
          })
      }
    })
  }
  private resetForm() {
    this.selectForm = paramsForm()
    this.chargeForm = paramsCharge()
    this.branch = {
      peer: undefined, // 同行
      direct: undefined // 直客
    }
    this.measure = {
      peer: undefined, // 同行
      direct: undefined // 直客
    }
    this.getCustId()
    this.tableUpper = []
    this.tableData = []
    this.copyTable = []
    this.aAxisData = []
    this.options = []
    this.currentId = ''
    this.currentLscId = ''
    this.currentRefId = ''
    this.currentAreaId = []
    this.historyId = ''
    this.isHistory = false
    this.isTableShow = false
    this.isRightShow = false
    this.isAdd = false
    this.isEdit = false
    this.editOther = false
    this.leftTitle = ''
    this.rightTitle = ''
    const root: any = this.$refs.editForm
    this.$nextTick(() => {
      root.clearValidate()
    })
  }
  private onRangeTitle() {
    const { subtypeId, containerType, lscId } = this.selectForm
    switch (subtypeId) {
      case '0': // 空
        this.rangeTitle = '重量区间'
        break
      case '1': // 海
        if (containerType === '0') { // 拼箱
          this.rangeTitle = '体积区间'
        } else if (containerType === '1') {
          this.rangeTitle = '柜型'
        }
        break
      case '2': // 铁
        if (containerType === '0') { // 拼箱
          this.rangeTitle = '体积区间'
        } else if (containerType === '1') {
          this.rangeTitle = '柜型'
        }
        break
      case '3': // 快
        this.rangeTitle = ''
        break
      case '4': // 卡
        this.rangeTitle = '重量&方数区间'
        break
      default:
        break
    }
  }
  private onRangeReset() {
    if (!this.selectForm.lscId) {
      this.$message.error('请先选择服务')
      return
    }
    const { subtypeId, containerType, lscId } = this.selectForm
    switch (subtypeId) {
      case '0': // 空
        this.title = '重量区间'
        this.isType = 'one'
        this.dialogForm.loadType = '0'
        break
      case '1': // 海
        if (containerType === '0') { // 拼箱
          this.title = '体积区间'
          this.dialogForm.loadType = '3'
          this.isType = 'one'
        } else if (containerType === '1') {
          this.title = '柜型'
          this.dialogForm.loadType = '2'
          this.isType = 'three'
          this.getContainerList()
        }
        break
      case '2': // 铁
        if (containerType === '0') { // 拼箱
          this.title = '体积区间'
          this.dialogForm.loadType = '3'
          this.isType = 'one'
        } else if (containerType === '1') {
          this.title = '柜型'
          this.dialogForm.loadType = '2'
          this.isType = 'three'
          this.getContainerList()
        }
        break
      case '3': // 快
        this.title = ''
        break
      case '4': // 卡
        this.title = '重量区间'
        this.isType = 'two'
        this.dialogForm.loadType = '5'
        break
      default:
        break
    }
    this.dialogRange = true
    this.selectLoading = true
    const params: any = {
      serviceId: lscId,
      xy: 'X',
      serviceType: '05'
    }
    getPriceConfig(params).then((res: any) => {
      const result = res.data || []
      if (Array.isArray(result) && result.length <= 0) {
        this.selectLoading = false
        const { subtypeName, lscName } = this.selectForm
        const obj = {
          serviceType: {
            key: '05',
            value: '专线'
          },
          serviceSubtype: {
            key: subtypeId,
            value: subtypeName
          },
          service: {
            key: lscId,
            value: lscName
          },
          xy: 'X'
        }
        Object.assign(this.dialogForm, obj)
        return
      }
      const data = result[0] || {}
      const { keyValues, ranges, ...form } = data
      this.dialogForm = { ...form }
      if (this.isType === 'one') { // 区间
        const arr = [{
          lower: undefined,
          upper: undefined
        }]
        if (Array.isArray(ranges) && ranges.length > 0) {
          const brr = ranges.map((it: any) => {
            return it.upperLower
          })
          this.$set(this.dialogForm, 'sections', brr)
        } else {
          this.dialogForm.sections = arr
        }
      } else if (this.isType === 'three') { // 柜型
        this.options = ranges.map((it: any) => (it.keyValue || {}).key)
      } else if (this.isType === 'two') { // 重量方数
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
          this.$set(this.dialogForm, 'sections1', brr1)
          // this.$set(this.dialogForm, 'sections2', brr2)
        } else {
          this.dialogForm.sections1 = arr
          // this.dialogForm.sections2 = arr
        }
      }
      this.selectLoading = false
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }
  private onAreaReset() {
    if (!this.selectForm.lscId) {
      this.$message.error('请先选择服务')
      return
    }
    const { lscId } = this.selectForm
    this.title = '地址类型'
    this.isType = 'four'
    this.dialogRange = true
    this.selectLoading = true
    const params: any = {
      serviceId: lscId,
      xy: 'Y',
      serviceType: '05'
    }
    getPriceConfig(params).then((res: any) => {
      const result = res.data || []
      if (Array.isArray(result) && result.length <= 0) {
        this.selectLoading = false
        const { subtypeId, subtypeName, lscName } = this.selectForm
        const obj = {
          serviceType: {
            key: '05',
            value: '专线'
          },
          serviceSubtype: {
            key: subtypeId,
            value: subtypeName
          },
          service: {
            key: lscId,
            value: lscName
          },
          xy: 'Y'
        }
        Object.assign(this.dialogForm, obj)
        return
      }
      const data = result[0] || {}
      const { keyValues, ranges, yType, ...form } = data
      this.dialogForm = { ...form }
      this.dialogForm.yType = yType
      this.options = []
      keyValues.map((it: any) => {
        this.dialogForm.countryId = (it.country || {}).key
        this.options.push((it.keyValue || {}).key)
      })
      this.onAxisYCountry()
      if (yType !== '0') {
        this.getCountryList()
      }
      this.selectLoading = false
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }

  private onAxisYCountry() {
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
        this.getAllAreaList(1)
        break
      case '101':
        this.getAllAreaList(3)
        break
      case '102':
        this.getAllAreaList(2)
        break
      default:
        this.boxList = []
        this.options = []
        this.selectLoading = false
        break
    }
  }
  private getAllAreaList(type: any) {
    const params = {
      model: {
        type,
        countryId: this.dialogForm.countryId
      },
      page: 1,
      size: 999
    }
    this.selectLoading = true
    getAllAreaList(params).then((res: any) => {
      this.selectLoading = false
      if (res.success) {
        const data = res.data || {}
        const result = data.result || []
        this.boxList = result.map((item: any) => {
          return {
            id: item.id,
            name: item.name
          }
        })
      }
    }).catch((err: any) => {
      this.selectLoading = false
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
      this.getAllAreaList(2)
    } else {
      this.dialogForm.countryId = undefined
      this.boxList = []
    }
  }
  private getCountryData() {
    this.selectLoading = true
    getCountryList()
      .then((res: any) => {
        const data = res.data || {}
        this.boxList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private getStateByCountry() {
    this.selectLoading = true
    getStateByCountry({
      countryId: this.dialogForm.countryId
    })
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result || []
        this.boxList = result
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private getRegionList() {
    this.selectLoading = true
    const params: any = {
      countryId: this.dialogForm.countryId,
      page: 1,
      size: 9999
    }
    getRegionList(params)
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result || []
        this.boxList = result
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private getFbastoreList() {
    this.selectLoading = true
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
            name: item.code + '-' + item.address
          }
        })
        this.boxList = arr
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private getContainerList() {
    this.selectLoading = true
    const params: any = {
      page: 1,
      size: 9999
    }
    getContainerList(params)
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result || []
        this.boxList = result
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private addRangeData(val: any) {
    switch (val) {
      case '0':
        this.dialogForm.sections.push({
          lower: undefined,
          upper: undefined
        })
        break
      case '1':
        this.dialogForm.sections1.push({
          lower: undefined,
          upper: undefined
        })
        break
      case '2':
        this.dialogForm.sections2.push({
          lower: undefined,
          upper: undefined
        })
        break
      default:
        break
    }
  }
  private deleteRangeData(index: number, val: any) {
    switch (val) {
      case '0':
        this.dialogForm.sections.splice(index, 1)
        break
      case '1':
        this.dialogForm.sections1.splice(index, 1)
        break
      case '2':
        this.dialogForm.sections2.splice(index, 1)
        break
      default:
        break
    }
  }
  private cancelRange() {
    this.dialogRange = false
    this.isType = ''
    this.options = []
    this.boxList = []
    this.dialogForm = paramsXY()
    const root: any = this.$refs.transferItem
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
  private saveRange() {
    const { sections, sections1, sections2, keyValues, ranges, ...form } = this.dialogForm
    const params: any = {
      ...form
    }
    const axisY: any[] = []
    const axisX: any[] = []
    const axisX1: any[] = []
    const axisX2: any[] = []
    if (this.isType === 'four') {
      this.options.map((it: any) => {
        const item = this.boxList.find((l: any) => l.id === it) || {}
        const itemC = this.countryList.find((c: any) => c.id === params.countryId) || {}
        if (item.id && item.name) {
          axisY.push({
            type: params.yType,
            country: {
              key: params.countryId,
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
    } else if (this.isType === 'one') {
      sections.map((it: any) => {
        axisX.push({
          upperLower: it
        })
      })
      const isBool = this.rangeValidate(sections)
      if (!isBool) return
      params.ranges = axisX
    } else if (this.isType === 'three') {
      this.options.map((it: any) => {
        const item = this.boxList.find((l: any) => l.id === it) || {}
        if (item.id && item.name) {
          axisX.push({
            keyValue: {
              key: item.id,
              value: item.name
            }
          })
        }
      })
      params.ranges = axisX
    } else if (this.isType === 'two') {
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
    this.selectLoading = true
    savePriceConfig(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.cancelRange()
        this.getPriceConfig()
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  // 业务类型
  private getSubtypeList(): void {
    this.selectLoading = true
    getServiceSubtypeList({
      typeId: '05'
    })
      .then((res: any) => {
        const data = res.data || []
        this.typeList = data.filter((it: any) => it.id !== '3')
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private getChargeList(): void {
    this.selectLoading = true
    getChargeList({
      agentId: (this as any).custId,
      type: this.selectForm.priceType === '2' ? '0' : this.selectForm.priceType === '3' ? '1' : undefined,
      subtypeId: this.selectForm.subtypeId,
      page: 1,
      size: 9999
    })
      .then((res: any) => {
        const data = res.data || {}
        this.chargeList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private async getChargeCopyList() {
    await getChargeList({
      agentId: (this as any).custId,
      type: this.selectForm.priceType === '2' ? '0' : this.selectForm.priceType === '3' ? '1' : undefined,
      subtypeId: this.selectForm.subtypeId,
      page: 1,
      size: 9999
    })
      .then((res: any) => {
        const data = res.data || {}
        this.chargeList = data.result || []
        this.chargeList.map((it: any) => {
          if (this.selectForm.measureId === it.id) {
            const { name, id, ...obj }: any = it
            this.chargeForm = { ...obj }
          }
        })
      })
      .catch((err: any) => {
        return err
      })
  }
  private onCharge() {
    this.chargeForm = paramsCharge()
    this.selectForm.measureName = undefined
    this.chargeList.map((it: any) => {
      if (this.selectForm.measureId === it.id) {
        this.selectForm.measureName = it.name
        const { name, id, ...obj }: any = it
        this.chargeForm = { ...obj }
      }
    })
  }
  private getTimeList(): void {
    this.selectLoading = true
    getStandardPeriod({
      custId: (this as any).custId,
      lscId: this.selectForm.lscId,
      deliveryIds: this.selectForm.areaId,
      category: this.selectForm.category
    })
      .then((res: any) => {
        const data = res.data || []
        this.timeList = data
        this.selectLoading = false
      })
      .catch((err: any) => {
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
  private onSubtype() {
    this.selectForm.lscId = undefined
    this.onServiceSel()
  }
  private onBusiness() {
    this.searchForm.dispatch = undefined
    this.getTableData(1)
  }
  private onCountry(val: any) {
    if (val === 'sel') {
      this.selectForm.lscId = undefined
      this.onServiceSel()
    } else if (val === 'sea') {
      this.searchForm.lscId = undefined
      this.getTableData(1)
    }
  }

  // 交货区域
  private getAreaList() {
    this.selectLoading = true
    getAreaList()
      .then((res: any) => {
        this.areaList = res.data || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  // 勾选框
  private handleCheckAll(val: any) {
    const arrN = this.areaList.map((it: any) => it.name)
    this.searchForm.areaId = val ? arrN : []
    this.isIndeterminate = false
  }

  private handleChecked(val: any) {
    const numC = (val || []).length
    const numA = (this.areaList || []).length
    this.checkAll = numC === numA
    this.isIndeterminate = numC > 0 && numC < numA
  }
  // 服务
  private async getServiceList(val: any) {
    this.selectLoading = true
    const params: any = {
      page: 1,
      size: 9999,
      countryId: val === 'sea' ? this.searchForm.destinationCountry : this.selectForm.countryId,
      subtypeId: val === 'sea' ? this.searchForm.subtypeId : this.selectForm.subtypeId,
      includeTax: val === 'sea' ? this.searchForm.includeTax : this.selectForm.includeTax,
      dispatch: val === 'sea' ? this.searchForm.dispatch : this.selectForm.dispatch,
      purposeType: val === 'sea' ? this.searchForm.purposeType : undefined
    }

    await getLscList(params)
      .then((res: any) => {
        const data = res.data || {}
        if (val === 'sea') {
          // abbr
          this.serviceList1 = (data.result || []).map((it: any) => {
            it.label = `${it.name}(${it.abbr})`
            return it
          })
        } else {
          const arr = data.result || []
          this.serviceList2 = arr.filter((it: any) => it.status === '1').map((it: any) => {
            it.label = `${it.name}(${it.abbr})`
            return it
          })
        }
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private onServiceSea() {
    if (this.searchForm.lscId) {
      this.serviceList1.map((it: any) => {
        if (it.id === this.searchForm.lscId) {
          this.searchForm.lscName = it.name
        }
      })
    } else {
      this.searchForm.lscName = undefined
    }
  }
  private onServiceSel() {
    this.selectForm.refId = undefined
    this.effectList = []
    this.selectForm.mode = '0'
    this.selectForm.times = []
    this.selectForm.agentId = []
    this.selectForm.stdId = undefined
    this.selectForm.lscName = undefined
    this.selectForm.lscCode = undefined
    this.selectForm.subtypeName = undefined
    this.selectForm.containerType = undefined
    this.selectForm.destinationName = ''
    this.selectForm.umLength = undefined
    this.selectForm.umWeight = undefined
    this.selectForm.currencyName = undefined
    this.selectForm.currencyId = undefined
    // this.selectForm.dispatch = undefined
    // this.selectForm.includeTax = undefined
    this.selectForm.priceType = undefined
    this.selectForm.purposeType = undefined
    this.selectForm.measureId = undefined
    this.selectForm.measureName = undefined
    this.chargeForm = paramsCharge()
    this.isTableShow = false
    this.tableData = []
    this.copyTable = []
    this.aAxisData = []
    const itemL = this.serviceList2.find((it: any) => it.id === this.selectForm.lscId)
    if (itemL) {
      this.selectForm.lscName = itemL.label
      this.selectForm.lscCode = itemL.lsId
      this.selectForm.subtypeName = itemL.subtypeName
      this.selectForm.containerType = itemL.containerType
      this.selectForm.destinationName = itemL.destinationName
      this.selectForm.umLength = itemL.umLength
      this.selectForm.umWeight = itemL.umWeight
      this.selectForm.currencyName = itemL.currencyName
      this.selectForm.currencyId = itemL.currencyId
      this.selectForm.dispatch = itemL.dispatch
      this.selectForm.includeTax = itemL.includeTax
      this.selectForm.priceType = itemL.priceType
      this.selectForm.purposeType = itemL.purposeType
    }
    const ctype = (this as any).custType
    const stype = (this as any).custSubtype
    if (ctype === '0' || ctype === '3' || (ctype === '2' && stype === '1')) {
      this.getPriceConfig()
    }
    if (this.custType === '0' && !this.showAgentPriceModel) {
      this.showAgentPrice()
    }
  }
  private onEffect(val: any) {
    this.tableData = []
    this.copyTable = []
    this.effectList.map((it: any) => {
      if (this.selectForm.refId === it.id) {
        // this.selectForm.includExpressFee = it.includExpressFee
        const arrDI = it.deliveries.map((d: any) => d.key)
        this.$set(this.selectForm, 'areaId', arrDI)
        this.selectForm.measureId = (it.measure || {}).key
        this.selectForm.measureName = (it.measure || {}).value
        const arr = it.rows || []
        this.tableUpper = arr.map((a: any) => {
          if (a) {
            return {
              ...a,
              isUpper: true
            }
          }
        })
      }
    })
    this.tableUpper = this.tableUpper.sort((a: any, b: any) => a.address.value.localeCompare(b.address.value))
    if (this.selectForm.priceType !== '4') {
      this.getChargeList()
    }
    this.getPriceConfig()
  }
  private async getEffectiveBook() {
    if (this.selectForm.lscId && (this as any).parentId) {
      this.selectLoading = true
      const params: any = {
        custId: (this as any).parentId,
        lscId: this.selectForm.lscId,
        deliveryIds: this.selectForm.areaId,
        category: undefined,
        targetId: (this as any).custId
      }
      const type = (this as any).custType
      const stype = (this as any).custSubtype
      if (type === '1' && stype === '0') {
        params.category = '3'
      } else if (type === '1' && stype === '1') {
        params.category = '4'
      } else if (type === '2' && stype === '1') {
        params.category = '1'
      } else if (type === '2' && stype === '2') {
        params.category = '2'
      } else {
        params.category = type
      }
      try {
        const res = await getEffectiveBook(params)
        const data = res.data || []
        this.effectList = data
        this.selectLoading = false
      } catch (error) {
        this.selectLoading = false
        return error
      }
    } else {
      this.effectList = []
    }
  }
  private getPriceConfig() {
    this.formLoading = true
    const params: any = {
      serviceId: this.selectForm.lscId,
      serviceType: '05'
    }
    getPriceConfig(params)
      .then(async(res: any) => {
        const result = res.data || []
        if (result.length <= 0) {
          this.tableData = []
          this.aAxisData = []
          this.formLoading = false
          return
        }
        let objX: any = {}
        let objY: any = {}
        let arrY:any[] = []
        let arrX:any[] = []
        result.map((item: any) => {
          if (item.xy === 'Y') {
            objY = item
            this.selectForm.yType = item.yType
          } else if (item.xy === 'X') {
            objX = item
            this.selectForm.loadType = item.loadType
          }
        })
        arrY = objY.keyValues || []
        arrX = objX.ranges || []
        if (arrY.length <= 0 || arrX.length <= 0) {
          this.tableData = []
          this.aAxisData = []
          this.formLoading = false
          return
        }
        this.isTableShow = true
        const { yType, loadType } = this.selectForm
        this.onRangeTitle()
        const objLeft: any = {
          '0': '国家',
          '1': '州省',
          '5': '国内区域',
          '7': '仓库代码',
          '100': '城市区域',
          '101': '仓库区域',
          '102': '国家区域'
        }
        Object.keys(objLeft).map((key: any) => {
          if (key === yType) {
            this.leftTitle = objLeft[key]
          }
        })
        const json: any[] = []
        this.aAxisData = arrX.map((a:any) => {
          const itemX = loadType === '2' ? a.keyValue : a.upperLower
          const obj: any = {
            label: ''
          }
          if (loadType === '2') {
            this.rightTitle = '柜型'
            obj.label = (itemX || {}).value
          } else {
            this.rightTitle = a.type === '0' ? '重量区间' : loadType === '5' && a.type === '1' ? '方数区间' : '体积区间'
            obj.label = `${(itemX || {}).lower}-${(itemX || {}).upper}`
            obj.aAxisArr = []
          }
          return obj
        })
        arrY.map((it: any, index: any) => {
          const yyy: any = {
            address: it.keyValue || {},
            addressType: yType,
            prices: [],
            remark: undefined,
            prescription: ''
          }
          arrX.map((a: any) => {
            yyy.prices.push({
              price: undefined,
              type: loadType === '2' ? '2' : a.type,
              x: loadType === '2' ? a.keyValue : a.upperLower
            })
          })
          json.push(yyy)
        })
        let sortJson = []
        const type = (this as any).custType
        const stype = (this as any).custSubtype
        if (type === '0' || type === '3' || (type === '2' && stype === '1')) {
          sortJson = json.sort((a: any, b: any) => a.address.value.localeCompare(b.address.value))
        } else if (this.tableUpper.length > 0) {
          sortJson = this.tableUpper.map((it: any) => {
            const { isUpper, prices, ...a } = it
            const ps = prices.map((p: any) => {
              const { price, ...b } = p
              return {
                ...b,
                price: undefined
              }
            })
            return {
              ...a,
              prices: ps,
              prescription: '',
              remark: undefined
            }
          })
        }
        this.tableData = sortJson.reduce((list: any[], item: any, index: number) => {
          if (this.tableUpper[index]) {
            const tamp = this.tableUpper[index]
            list.push(tamp)
            item.prescription = tamp.prescription
            item.remark = tamp.remark
          } // 上级报价
          list.push(item)
          return list
        }, [])
        this.copyTable = JSON.parse(JSON.stringify(this.tableData))
        this.setSort()
        await this.groupByPid()
        this.formLoading = false
      })
      .catch((err: any) => {
        this.formLoading = false
        return err
      })
  }

  // 货币
  private geCurrencyList() {
    this.selectLoading = true
    const params = {
      page: 1,
      size: 999
    }
    geCurrencyList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.currencyList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private async onHistory() {
    let paramsId = ''
    if (!this.historyId) {
      this.selectForm.refId = this.currentRefId
      this.selectForm.areaId = this.currentAreaId
      paramsId = this.currentId
      this.isHistory = false
    } else {
      paramsId = this.historyId
      this.isHistory = true
      this.historyList.map((it: any) => {
        if (this.historyId === it.id) {
          this.selectForm.refId = it.refId
          this.selectForm.areaId = it.deliveries.map((d: any) => d.key)
        }
      })
    }
    this.selectForm.lscId = this.currentLscId
    await this.getEffectiveBook()
    this.effectList.map((it: any) => {
      if (this.selectForm.refId === it.id) {
        const arr = it.rows || []
        this.tableUpper = arr.map((a: any) => {
          if (a) {
            return {
              ...a,
              isUpper: true
            }
          }
        })
      }
    })
    this.tableUpper = this.tableUpper.sort((a: any, b: any) => a.address.value.localeCompare(b.address.value))
    await this.getRowDetail(paramsId)
  }

  private getHistoryPrice() {
    this.selectLoading = true
    const params: any = {
      id: this.currentId,
      mode: this.selectForm.mode,
      page: 1,
      size: 9999
    }
    getHistoryPrice(params)
      .then((res: any) => {
        const data = res.data || {}
        this.historyList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private onMode() {
    if (this.selectForm.mode === '0') {
      this.selectForm.agentId = []
    }
    this.selectForm.stdId = undefined
    // this.selectForm.includExpressFee = false
    this.selectForm.times = []
    this.modeChange()
  }
  // private onTime() {
  //   this.selectForm.includExpressFee = false
  //   this.timeList.map((it: any) => {
  //     if (this.selectForm.stdId === it.id) {
  //       this.selectForm.includExpressFee = it.includExpressFee
  //     }
  //   })
  // }

  private onCompany() {
    if (this.custType === '2' && !this.selectForm.category) {
      this.$message.warning('请选择报价对象')
      return
    }
    this.dialogCompany = true
    this.options = JSON.parse(JSON.stringify(this.selectForm.agentId))
    this.getCustTypeList()
  }
  private cancelCompany() {
    this.dialogCompany = false
    this.options = []
  }
  private async saveCompany() {
    if (this.selectForm.audit !== '1') {
      this.dialogCompany = false
      this.selectForm.agentId = this.options
      return
    }
    this.selectLoading = true
    const params: any = {
      id: this.currentId
    }
    const { agentId } = this.selectForm
    const arr: any[] = []
    this.options.map((o: any) => {
      if (agentId.every((a: any) => o !== a)) {
        const item = this.companyList.find((c: any) => c.id === o) || {}
        const { id, name } = item
        arr.push({
          key: id,
          value: name
        })
      }
    })
    if (arr.length === 0) {
      this.dialogCompany = false
      return
    }
    params.specials = arr.filter((it:any) => it.key && it.value)
    try {
      const res = await savePriceAgent(params)
      this.selectLoading = false
      this.dialogCompany = false
      this.options = []
      await this.getRowDetail(this.currentId)
    } catch (error) {
      this.selectLoading = false
    }
  }
  // 代理商
  private getCustTypeList() {
    let toCustType = ''
    let toCustSubtype = ''
    const { subtypeId, category } = this.selectForm
    const type = (this as any).custType
    if (type === '3') {
      toCustType = '0'
    }
    // if (type === '0') {
    //   toCustType = '2'
    //   toCustSubtype = '1'
    // }
    if (type === '2' || type === '0') {
      if (category === '2') {
        toCustType = '2'
        toCustSubtype = '2'
      } else if (category === '3') {
        toCustType = '1'
        toCustSubtype = '0'
      } else if (category === '4') {
        toCustType = '1'
        toCustSubtype = '1'
      }
    }
    const params: any = {
      toCustSubtype,
      toCustType,
      subtypeId: subtypeId || '',
      typeId: '05'
    }
    if (type === '0') { // 聚货通
      this.title = '关联代理商'
    } else if (type === '2' && category === '2') { // 二级代理商
      this.title = '关联代理商'
    } else if (type === '2' && category !== '2') { // 客户
      this.title = '关联客户'
    } else {
      return
    }
    this.selectLoading = true
    getCustTypeList(params).then((res: any) => {
      const data = res.data || []
      const arr = data.filter((e: any) => e).map((item: any) => {
        item.name = item.name || item.id
        return item
      })
      if (this.selectForm.audit === '1') {
        arr.map((it: any, index: any) => {
          this.options.map((o: any) => {
            if (o === it.id) {
              arr[index].disabled = true
            }
          })
        })
      }
      this.companyList = arr
      this.selectLoading = false
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }
  private filterMethod(query: any, item: any): boolean {
    const name = item.name || ''
    return name.indexOf(query) > -1
  }
  private onType() {
    this.selectForm.agentId = []
    this.companyList = []
    this.modeChange()
  }
  private getCustId() {
    const type = (this as any).custType
    const stype = (this as any).custSubtype
    switch (type) {
      case '0': // 聚货通
        this.custList = [
          { name: '二级代理商', id: '2' },
          { name: '直客', id: '3' },
          { name: '同行', id: '4' }
        ]
        break
      case '2': // 代理商
        if (stype === '1') { // 一级
          this.custList = [
            { name: '二级代理商', id: '2' },
            { name: '直客', id: '3' },
            { name: '同行', id: '4' }
          ]
        } else if (stype === '2') { // 二级
          this.custList = [
            { name: '直客', id: '3' },
            { name: '同行', id: '4' }
          ]
        }
        break
      case '3': // 供应商
        this.selectForm.category = '0'
        break
      default:
        break
    }
  }
  private closeAgentPrice() {
    this.showAgentPriceModel = true
  }
  private showAgentPrice() {
    if (!this.selectForm.lscId) {
      this.$message.warning('请选择服务')
      return
    }
    const service = this.serviceList2.find((e: any) => e.id === this.selectForm.lscId)
    if (service) {
      if (service.outsourcing === '0') {
        this.$message.warning('非外协不能查看供应商报价')
        return
      }
      (this.$refs.AgentPrice as any).show(service)
      this.showAgentPriceModel = false
    } else {
      this.$message.warning('请选择服务')
    }
  }
  private created() {
    this.getAreaList()
    this.getCustId()
    this.getTableData()
  }
}
</script>

<style lang="scss" scoped>
.search-form {
  .el-form-item {
    display: inline-block;
    vertical-align: top;
    padding-right: 2px;
    width: 25%;
    margin-bottom: 10px;
  }
  .el-checkbox {
    margin-right: 15px;
  }
  ::v-deep .el-input__inner {
    padding-left: 8px;
  }
}

.select-form {
  .item-read {
    background-color: #EAEEF4;
    padding: 5px 0;
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .el-form-item {
    display: inline-block;
    vertical-align: top;
  }
  .el-radio {
    margin-right: 15px;
  }
  ::v-deep .el-input__inner {
    padding-left: 8px;
  }
}
.dialog-form {
  .el-form-item {
    display: inline-block;
    vertical-align: top;
  }
}
.audit-check {
  background-color: #e8eaec;
  height: 50px;
  line-height: 50px;
  border: 1px solid #C0C4CC;
  border-radius: 3px 3px 0 0;
  padding-left: 20px;
}
.audit-group {
  height: 350px;
  overflow-y: auto;
  border: 1px solid #C0C4CC;
  border-top: none;
  padding-left: 20px;
}
::v-deep .audit-check .el-checkbox__label {
  font-size: 18px;
}

::v-deep .el-card__body {
  padding: 10px;
}

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
.active-card {
  background: #FFFAF5;
  border-color: #FF7D19;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
}
.card-tips {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.card-tip-zero {
  background-color: #2291E6;
}
.card-tip-one {
  background-color: #189800;
}
.card-tip-two {
  background-color: #E12E2E;
}
.card-tip-three {
  background-color: #FF7D19;
}
.word-limit {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-tip-green {
  color: #189800;
  background-color: rgb(24, 152, 0, 0.2);
  display: inline-block;
  padding: 2px;
  border-radius: 2px;
}
.btn-tip-blue {
  color: #2291E6;
  background-color: rgb(34, 145, 230, 0.2);
  display: inline-block;
  padding: 2px;
  border-radius: 2px;
}
.border-tip-blue {
  color: #2291E6;
  border: 1px solid #2291E6;
  display: inline-block;
  padding: 2px;
  border-radius: 2px;
}
.btn-tip-grey {
  color: #909399;
  background-color: rgb(144, 147, 153, 0.2);
  display: inline-block;
  padding: 2px;
  border-radius: 2px;
}
.table-header-title {
  display: inline-block;
  border: 1px solid #ccc;
  background: linear-gradient(45deg, transparent 49.5%,  #ccc 49.5%,  #ccc 50.5%, transparent 50.5%);
}
::v-deep .vxe-table--body .success-row {
  background-color: #cee9ec !important;
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
.drag-btn{
  cursor:move;
  font-size:12px;
}
</style>
