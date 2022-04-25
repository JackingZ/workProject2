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
            订舱报价
          </el-col>
          <el-col
            :span="12"
            style="text-align: right;"
          >
            <el-button
              v-permission="['bookingQuoteAdd']"
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
                @change="getTableData"
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
                v-model="popoverShow1"
                placement="bottom-start"
                trigger="click"
              >
                <div style="padding-right: 10px;">
                  <el-form-item
                    label="目的国"
                    label-width="60px"
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
                  <el-form-item
                    label="服务"
                    label-width="60px"
                  >
                    <el-select
                      v-model="searchForm.bscId"
                      :disabled="!searchForm.countryId"
                      :loading="selectLoading"
                      size="mini"
                      clearable
                      filterable
                      placeholder="请选择"
                      style="width: 200px;"
                      @focus="getServiceList('sea')"
                      @change="onServiceSea"
                    >
                      <el-option
                        v-for="item in serviceList1"
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
                    <el-button @click="handleClear('1')">
                      清空
                    </el-button>
                    <el-button
                      v-permission="['bookingQuoteQuery']"
                      type="primary"
                      @click="handleConfirm('1')"
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
                    v-model="searchForm.bscName"
                    placeholder="服务"
                    readonly
                    suffix-icon="el-select__caret el-input__icon el-icon-arrow-up"
                  />
                </div>
              </el-popover>
            </el-form-item>

            <el-form-item>
              <el-select
                v-model="searchForm.audit"
                size="mini"
                clearable
                filterable
                placeholder="审核状态"
                style="width: 100%;"
                @change="getTableData"
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
                  <el-form-item
                    label="历史报价"
                    label-width="90px"
                  >
                    <el-checkbox v-model="searchForm.history" />
                  </el-form-item>
                  <div
                    slot="footer"
                    style="text-align: right;"
                  >
                    <el-button @click="handleClear('2')">
                      清空
                    </el-button>
                    <el-button
                      v-permission="['bookingQuoteQuery']"
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
              v-for="(item, index) in cardList"
              :key="index"
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
                    {{ item.bsc.value }}
                  </el-col>
                  <el-col
                    :span="4"
                    style="text-align: right;"
                  >
                    {{ item.mode === '1' ? '特殊报价' : '标准报价' }}
                  </el-col>
                </el-row>
                <el-row style="margin: 10px 0;">
                  <el-col
                    :span="20"
                    class="word-limit"
                    style="color:  #409EFF;"
                  >
                    {{ (item.portsFrom || {}).value }} --- {{ (item.portsTo || {}).value }}
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
                    :span="13"
                    style="line-height: 16px;"
                  >
                    {{ formatTime(item.period) }}
                  </el-col>
                  <el-col
                    :span="8"
                    style="text-align: right;"
                  >
                    <span class="border-tip-blue">
                      {{ (item.subtype || {}).value }}
                    </span>&nbsp;
                    <span
                      v-if="item.loadType"
                      class="border-tip-blue"
                    >
                      {{ formatType(item.loadType) }}
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
                  style="width:90px;"
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
              <el-form-item
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
                  style="width: 90px;"
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
                prop="bscId"
                label-width="75px"
              >
                <span slot="label">服务</span>
                <el-tooltip
                  v-show="selectForm.bscId"
                  slot="label"
                  :content="selectForm.bscName + '/' + selectForm.bscCode"
                  placement="top"
                  effect="light"
                >
                  <i class="el-icon-warning-outline" />
                </el-tooltip>
                <el-select
                  v-model="selectForm.bscId"
                  :loading="selectLoading"
                  :disabled="isEdit || !isAdd || !selectForm.subtypeId"
                  style="width:90px;"
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

              <el-form-item
                v-if="custType === '2'"
                label="参考报价"
              >
                <el-select
                  v-model="selectForm.refId"
                  :loading="selectLoading"
                  :disabled="isEdit || !isAdd || !selectForm.bscId"
                  size="mini"
                  clearable
                  filterable
                  placeholder="请选择"
                  style="width:310px;"
                  @focus="getEffectiveBook"
                  @change="onEffect"
                >
                  <el-option
                    v-for="(item, index) in effectList"
                    :key="index"
                    :label="formatTime(item.period)"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>

              <el-form-item
                label="报价对象"
                prop="category"
                :required="custType === '2' || custType === '3'"
              >
                <div v-if="custType === '0'">
                  一级代理商
                </div>
                <!--<div v-else-if="custType === '3'">
                  聚货通
                </div>-->
                <el-select
                  v-else-if="custType === '2' || custType === '3'"
                  v-model="selectForm.category"
                  :disabled="isEdit || !isAdd"
                  style="width:90px;"
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
            </el-col>
            <el-col
              :span="4"
              style="text-align: right;display: flex;justify-content: flex-end"
            >
              <div v-show="!isHistory && selectForm.status !== '2'">
                <el-button
                  v-if="(!isEdit && !isAdd && selectForm.audit !== '1' && selectForm.audit !== '3') && $checkPermission(['bookingQuoteEdit'])"
                  type="text"
                  size="small"
                  style="margin-right: 10px"
                  @click="editRow"
                >
                  编辑
                </el-button>

                <el-popover
                  v-show="(!isEdit && !isAdd && selectForm.audit !== '1' && selectForm.status !== '2') && $checkPermission(['bookingQuoteAudit'])"
                  v-model="auditShow"
                  placement="bottom-start"
                  trigger="click"
                  @show="onShow"
                  @hide="onHide"
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
                        style="text-align: right;padding-top: 10px;"
                      >
                        <el-button
                          size="small"
                          @click="auditShow = false"
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
                  <el-button
                    slot="reference"
                    type="text"
                    size="mini"
                    style="padding-right: 10px;"
                  >
                    审核
                  </el-button>
                </el-popover>
                <el-button
                  v-if="(isAdd || isEdit) && $checkPermission(['bookingQuoteAdd', 'bookingQuoteEdit'])"
                  type="text"
                  size="small"
                  style="padding-right: 10px;"
                  @click="cancelRow"
                >
                  取消
                </el-button>
                <el-button
                  v-if="(isAdd || isEdit) && $checkPermission(['bookingQuoteAdd', 'bookingQuoteEdit'])"
                  type="text"
                  size="small"
                  @click="saveRow"
                >
                  保存
                </el-button>
                <el-button
                  v-if="!isAdd && !isEdit && selectForm.audit !== '1' && selectForm.audit !== '3' && $checkPermission(['bookingQuoteDel'])"
                  type="text"
                  size="small"
                  @click="deleteRow(1)"
                >
                  删除
                </el-button>
              </div>
              <div v-if="(!isEdit && !isAdd)">
                <el-button
                  v-if="$checkPermission(['bookingQuoteCopy'])"
                  type="text"
                  size="small"
                  style="margin-left: 10px"
                  @click="copyPrice"
                >
                  复制此版本
                </el-button>
                <el-button
                  v-if="selectForm.audit === '1' && !historyId"
                  type="text"
                  size="small"
                  style="margin-left: 10px"
                  @click="invalidPrice"
                >
                  失效
                </el-button>
              </div>
            </el-col>
          </el-row>

          <div class="item-read">
            <el-form-item
              v-if="selectForm.portsFrom || selectForm.portsTo"
              label-width="200"
              style="margin-left: 20px;"
            >
              <span
                class="word-limit"
              >
                {{ (selectForm.portsFrom || {}).value }} --- {{ (selectForm.portsTo || {}).value }}
              </span>
            </el-form-item>
            <el-form-item
              label="重量单位："
              prop="umWeight"
            >
              <div style="width: 60px;">
                <span v-if="selectForm.umWeight === 'T' || selectForm.umWeight === 'TS'">
                  T-吨
                </span>
                <span v-if="selectForm.umWeight === 'LB' || selectForm.umWeight === 'LBS'">
                  LB-磅
                </span>
                <span v-if="selectForm.umWeight === 'KG' || selectForm.umWeight === 'KGS'">
                  KG-公斤
                </span>
                <span v-if="selectForm.umWeight === 'OZ' || selectForm.umWeight === 'OZS'">
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
              v-if="selectForm.subtypeId !== '1' && selectForm.subtypeId !== '2'"
              label="货币单位："
              prop="currencyId"
            >
              <span v-if="selectForm.currencyId">{{ selectForm.currencyId }}</span>
              <span v-if="selectForm.currencyName">{{ '-' + selectForm.currencyName }}</span>
            </el-form-item>
            <el-form-item
              v-if="(selectForm.subtypeId === '1' || selectForm.subtypeId === '2') && selectForm.loadType === '2'"
              label="整柜货币单位："
              label-width="130px"
              prop="currencyId1"
            >
              <span v-if="selectForm.currencyId1">{{ selectForm.currencyId1 }}</span>
              <span v-if="selectForm.currencyName1">{{ '-' + selectForm.currencyName1 }}</span>
            </el-form-item>
            <el-form-item
              v-if="(selectForm.subtypeId === '1' || selectForm.subtypeId === '2') && selectForm.loadType === '3'"
              label="拼箱货币单位："
              label-width="130px"
              prop="currencyId2"
            >
              <span v-if="selectForm.currencyId2">{{ selectForm.currencyId2 }}</span>
              <span v-if="selectForm.currencyName2">{{ '-' + selectForm.currencyName2 }}</span>
            </el-form-item>
          </div>

          <el-row>
            <el-col :span="21">
              <el-form-item
                v-show="selectForm.subtypeId && selectForm.bscId"
                label="请选择"
                prop="loadType"
              >
                <el-radio-group
                  v-model="selectForm.loadType"
                  :disabled="(!isEdit && !isAdd) || custType === '2'"
                  @change="changeType"
                >
                  <el-radio
                    v-for="(item, index) in typeOption"
                    :key="index"
                    :label="item.value"
                  >
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                v-if="custType === '3' && selectForm.loadType && rangeTitle"
                :label="rangeTitle"
                label-width="130px"
                class="is-required"
              >
                <el-button
                  :disabled="(!isEdit && !isAdd) || tableData.length <= 0"
                  type="primary"
                  size="mini"
                  plain
                  @click="setRange"
                >
                  已选择{{ aAxisData.length }}
                </el-button>
              </el-form-item>
              <el-form-item
                v-if="custType === '0' || custType === '2' || (custType === '3' && ['3', '4'].includes(selectForm.category))"
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
                v-if="(custType === '0' || custType === '2' || (custType === '3' && ['3', '4'].includes(selectForm.category))) && selectForm.mode === '1'"
                :label="['3', '4'].includes(selectForm.category) ? '关联客户' : '关联代理商'"
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
                  style="width:310px;"
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
                  style="width:310px;margin-right: 20px;"
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
                v-if="custType === '2' && (isAdd || isEdit)"
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
          <div
            v-if="(isEdit || isAdd) && tableData.length"
            style="display: flex;justify-content: flex-end"
          >
            <!--<span>报价数据导入请先下载模板</span>-->
            <el-button
              type="text"
              style="margin: 0 10px"
              size="mini"
              @click="exportData"
            >
              模板下载
            </el-button>
            <el-upload
              action
              :multiple="false"
              :show-file-list="false"
              :http-request="uploadFile"
            >
              <el-button
                size="small"
                type="text"
              >
                导入excel
              </el-button>
            </el-upload>
          </div>
          <vxe-table
            v-if="aAxisData.length"
            ref="priceTable"
            :data="tableData"
            :row-class-name="tableRowClassName"
            height="520"
            style="width: 100%;"
            border
            resizable
            size="small"
            :auto-resize="true"
          >
            <vxe-table-column
              width="150"
              title="服务机构"
              :show-overflow="true"
              :resizable="true"
            >
              <template slot-scope="scope">
                {{ (scope.row.trans || {}).orgName }}
              </template>
            </vxe-table-column>
            <vxe-table-column
              width="150"
              title="服务编码"
              :show-overflow="true"
              :resizable="true"
            >
              <template slot-scope="scope">
                {{ (scope.row.trans || {}).serviceCode }}
              </template>
            </vxe-table-column>
            <vxe-table-column
              width="180"
              title="截止报关 / 起运时间"
              :show-overflow="true"
              :resizable="true"
            >
              <template slot-scope="scope">
                {{ formatDays(scope.row.trans || {}) }}
              </template>
            </vxe-table-column>
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
                  <span v-else>{{ scope.row.prices[index].price }}</span>
                </div>
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
                  v-if="(isEdit || isAdd) && !scope.row.isUpper"
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
          v-if="isType !== 'three'"
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
                    @click="addRangeData('2')"
                  />
                  <i
                    v-else
                    class="el-icon-remove-outline item-icon-reduce"
                    @click="deleteRangeData(index, '2')"
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
    <agent-price
      ref="AgentPrice"
      @close="closeAgentPrice"
    />
    <transition name="el-fade-in-linear">
      <div
        v-show="showAgentPriceModel && isRightShow && custType === '0' && $checkPermission(['bookingQuoteQuotation'])"
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
        v-permission="['bookingQuoteCopy']"
        class="contextmenu-item"
        @click="onRow(showMenuRow, true)"
      >
        复制
      </li>
      <li
        v-permission="['bookingQuoteGet']"
        class="contextmenu-item"
        @click="onRow(showMenuRow)"
      >
        查看
      </li>
      <li
        v-if="showMenuRow.audit !== '1' && showMenuRow.audit !== '3' && $checkPermission(['bookingQuoteDel'])"
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
  getServiceSubtypeList,
  getCountryList,
  getBscList,
  getHistoryPrice,
  geCurrencyList,
  getEffectiveBook,
  getAgentList,
  savePriceAgent,
  getPriceList,
  getPriceConfig,
  getPriceById,
  getContainerList,
  getAviationList,
  savePriceConfig,
  savePrice,
  checkPrice,
  deletePrice,
  invalidPrice,
  getWordsList,
  getBsTransList,
  getStandardPeriod
} from '@/api/price-to-booking'
import dayjs from 'dayjs'
import { getCustTypeList } from '@/api/price-to-car'
import AgentPrice from '@/views/price-management/booking/components/agentPrice.vue'
import XLSX from 'xlsx'

function paramsForm() {
  return {
    subtypeId: undefined,
    subtypeName: undefined,
    portsFrom: {
      key: undefined,
      value: undefined
    },
    portsTo: {
      key: undefined,
      value: undefined
    },
    stdId: undefined,
    audit: undefined,
    status: undefined,
    remark: undefined,
    loadType: undefined,
    bscId: undefined,
    bscName: undefined,
    bscCode: undefined,
    refId: undefined,
    currencyId: undefined,
    currencyId1: undefined,
    currencyId2: undefined,
    countryId: undefined,
    category: undefined,
    umWeight: undefined,
    umLength: undefined,
    agentId: [],
    mode: '0',
    times: [],
    sections: [{
      lower: undefined,
      upper: undefined
    }]
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
  private showMenuRow: any = {}
  private isShowMenu: boolean = false
  private menuTop: number = 0
  private menuLeft: number = 0
  private text: string = '(取值范围：>=起始值， <结束值)'
  private searchForm: any = {
    subtypeId: undefined,
    bscId: undefined,
    bscName: undefined,
    countryId: undefined,
    mode: undefined,
    audit: undefined,
    effect: undefined,
    expire: undefined,
    history: false,
    times: []
  }
  private selectForm: any = paramsForm()
  private dialogForm: any = {
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
    }]
  }
  private auditForm: any = {
    audit: undefined,
    remark: undefined
  }
  private auditRules = {
    audit: [{ required: true, message: '请选择审核状态', trigger: 'change' }]
  }
  private formRules = {
    subtypeId: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
    countryId: [{ required: false, message: '请选择目的国', trigger: 'change' }],
    bscId: [{ required: true, message: '请选择服务', trigger: 'change' }],
    category: [{ required: true, message: '请选择报价对象', trigger: 'change' }],
    refId: [{ required: true, message: '请选择参考报价', trigger: 'change' }],
    loadType: [{ required: true, message: '请选择服务类型', trigger: 'change' }],
    mode: [{ required: true, message: '请选择价格标准', trigger: 'change' }],
    times: [{ required: true, message: '请选择有效时间', trigger: 'change' }],
    stdId: [{ required: true, message: '请选择有效时间', trigger: 'change' }]
  }
  private isActive: boolean = true
  private popoverShow1: boolean = false
  private popoverShow2: boolean = false
  private selectLoading: boolean = false
  private formLoading: boolean = false
  private cardLoading: boolean = false
  private checkAll: boolean = false
  private isIndeterminate: boolean = false
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
  private currentbscId = ''
  private currentRefId = ''
  private isTableShow: boolean = false
  private isRightShow: boolean = false
  private isHistory: boolean = false
  private auditShow: boolean = false
  private batchShow: boolean = false
  private batchNum: any = ''
  private showAgentPriceModel: boolean = true
  private copyRange: any[] = []
  private copyKey: any[] = []
  private copyTable: any[] = []
  private options: any[] = []
  private boxList: any[] = []
  private transList: any[] = []
  private companyList: any[] = []
  private typeList: any[] = []
  private typeOption: any[] = []
  private countryList: any[] = []
  private auditList: any[] = [
    { name: '待审核', id: '0' },
    { name: '已通过', id: '1' },
    { name: '已拒绝', id: '2' },
    { name: '审核中', id: '3' }
  ]
  private weekdays: any = [
    { label: '星期一', value: 1 },
    { label: '星期二', value: 2 },
    { label: '星期三', value: 3 },
    { label: '星期四', value: 4 },
    { label: '星期五', value: 5 },
    { label: '星期六', value: 6 },
    { label: '星期日', value: 7 }
  ]
  private effectList: any[] = []
  private custList: any[] = []
  private historyId: any = ''
  private historyList: any[] = []
  private serviceList1: any[] = []
  private serviceList2: any[] = []
  private currencyList: any[] = []
  private warehouseList: any[] = []
  private chargeList: any[] = []
  private timeList: any[] = []
  private tableData: any[] = []
  private cardList: any[] = []
  private tableUpper: any[] = []
  private tableXY: any[] = []
  private aAxisData: any[] = []
  private tableHeaderList: any[] = []
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
      }
    }
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
  private uploadFile(data: any) {
    if (this.tableHeaderList.length === 0) {
      this.getXlsxHeader()
    }
    const fileSize = Math.round(data.file.size / 1024 / 1024 * 100) / 100
    if (fileSize > 10) {
      this.$message.warning('文件大小超出最大上传限制！')
      return
    }
    if (data.file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.$message.warning('文件格式不正确！')
      return
    }
    const file = data.file
    const that = this
    const reader = new FileReader()
    FileReader.prototype.readAsBinaryString = (f) => {
      let binary = ''
      let wb
      const reader1 = new FileReader()
      reader1.onload = () => {
        const readerResult: any = reader1.result
        const bytes = new Uint8Array(readerResult)
        const length = bytes.byteLength
        for (let i = 0; i < length; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        wb = XLSX.read(binary, {
          type: 'binary'
        })
        const outdata: any[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        const headerList = Object.keys(outdata[0])
        const xlsxheader = this.tableHeaderList.map((t: any) => t.title)
        if (new Set(headerList.concat(xlsxheader)).size !== xlsxheader.length) {
          this.$message.warning('文件错误，请检查文件或重新下载模板导入')
          return
        }
        const tableData = outdata.map((od: any) => {
          const tamp: any = {}
          od && Object.keys(od).map((key: any) => {
            const dataHeader = this.tableHeaderList.find((h: any) => h.title === key)
            if (dataHeader) {
              tamp[dataHeader.dataIndex] = od[key]
            }
          })
          return tamp
        })

        this.tableData = this.tableData.map((td: any) => {
          if (td.isUpper) {
            return td
          }
          const tamp: any = tableData.find((t: any) => t.orgName === (td.trans || {}).orgName && t.serviceCode === (td.trans || {}).serviceCode && t.time === this.formatDays(td.trans || {}))
          if (tamp) {
            const price: any[] = td.prices || []
            td.remark = tamp.remark
            td.prices = price.map((p: any, index: number) => {
              Object.keys(tamp).map((key: any) => {
                if (key.indexOf('price') !== -1) {
                  const i = key.split('_')[1] * 1
                  if (i === index) {
                    p.price = tamp[key]
                  }
                }
              })
              return p
            })
          }
          return td
        })
      }
      reader1.onerror = () => {
        that.$message.error('文件错误,请检查文件重新导入')
      }
      reader1.readAsArrayBuffer(f)
    }
    reader.readAsBinaryString(file)
  }
  private exportData() {
    if (this.tableData.length === 0) {
      this.$message.warning('暂无数据可下载')
      return
    }
    this.getXlsxHeader()
    const rows = this.tableData.filter((e: any) => !e.isUpper).map((e: any) => {
      const tamp: any = {}
      const price: any[] = e.prices || []
      this.tableHeaderList.forEach((t: any) => {
        if (t.dataIndex === 'orgName') {
          tamp[t.dataIndex] = (e.trans || {}).orgName
        }
        if (t.dataIndex === 'serviceCode') {
          tamp[t.dataIndex] = (e.trans || {}).serviceCode
        }
        if (t.dataIndex === 'time') {
          tamp[t.dataIndex] = this.formatDays(e.trans || {})
        }
        if (t.dataIndex === 'remark') {
          tamp[t.dataIndex] = e.remark || ''
        }
        if (t.dataIndex.indexOf('price') !== -1) {
          const i = t.dataIndex.split('_')[1] * 1
          tamp[t.dataIndex] = (price[i] || {}).price || ''
        }
      })
      return tamp
    })
    const headerItem: any = {}
    this.tableHeaderList.forEach((e: any) => {
      headerItem[e.dataIndex] = e.title
    })
    // 创建book
    const wb: any = XLSX.utils.book_new()
    // json转sheet
    const ws: any = XLSX.utils.json_to_sheet([headerItem, ...rows], { header: this.tableHeaderList.map(e => e.dataIndex), skipHeader: true })
    // sheet写入book
    XLSX.utils.book_append_sheet(wb, ws, '报价导入模板')
    // 输出
    XLSX.writeFile(wb, this.selectForm.bscName + '报价导入模板' + '.xlsx')
  }
  private getXlsxHeader() {
    const priceTable: any = this.$refs.priceTable
    const tableHeaderEls: any = priceTable.$el.querySelector('.vxe-table--header-wrapper').querySelectorAll('.vxe-header--column > .vxe-cell > .vxe-cell--title')
    const tableHeaderList: any[] = []
    const tableHeader: any[] = [
      {
        dataIndex: 'orgName',
        title: '服务机构'
      },
      {
        dataIndex: 'serviceCode',
        title: '服务编码'
      },
      {
        dataIndex: 'time',
        title: '截止报关 / 起运时间'
      },
      {
        dataIndex: 'remark',
        title: '备注'
      }
    ]
    let j: number = 0
    for (const tableHeaderEl of tableHeaderEls) {
      const title: string = tableHeaderEl.innerText
      const tamp: any = tableHeader.find(e => e.title === title)
      if (tamp) {
        tableHeaderList.push(tamp)
      } else {
        tableHeaderList.push({
          dataIndex: 'price' + '_' + j,
          title
        })
        j = j + 1
      }
    }
    this.tableHeaderList = tableHeaderList
  }
  private async copyPrice() {
    let id = ''
    if (this.historyId) {
      id = this.historyId
      // 复制当前版本为历史版本
      this.historyList.map((it: any) => {
        if (this.historyId === it.id) {
          this.selectForm.refId = it.refId
        }
      })
      this.selectForm.bscId = this.currentbscId
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
    this.tableUpper = this.tableUpper.sort((a: any, b: any) => a.trans.orgName.localeCompare(b.trans.orgName))
    await this.getRowDetail(id, true)
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
  private showMenu(row: any, e: MouseEvent) {
    if (!(this as any).$checkPermission(['bookingQuoteCopy', 'bookingQuoteGet', 'bookingQuoteDel'])) return
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
    if (!this.selectForm.bscId) {
      this.$message.warning('请选择服务')
      return
    }
    if (this.selectForm.subtypeId && this.selectForm.bscId && !this.selectForm.loadType) {
      this.$message.warning('请选择服务类型')
      return
    }
    const service = this.serviceList2.find((e: any) => e.id === this.selectForm.bscId)
    if (service) {
      (this.$refs.AgentPrice as any).show(service)
      this.showAgentPriceModel = false
    } else {
      this.$message.warning('请选择服务')
    }
  }
  private formatDays(row: any) {
    const resS = this.weekdays.find((item: any) => item.value === row.shipDay) || {}
    const resC = this.weekdays.find((item: any) => item.value === row.customDay) || {}
    return (resC.label || '') + ' / ' + (resS.label || '')
  }
  private formatType(type: any) {
    let name
    switch (type) {
      case '0':
        name = '散货'
        break
      case '1':
        name = '包板'
        break
      case '2':
        name = '整柜'
        break
      case '3':
        name = '拼箱'
        break
      case '4':
        name = '整车'
        break
      case '5':
        name = '散货'
        break
      default:
        break
    }
    return name
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
        this.searchForm.countryId = undefined
        this.searchForm.bscId = undefined
        this.searchForm.bscName = undefined
        break
      case '2':
        this.searchForm.mode = undefined
        this.searchForm.times = []
        this.searchForm.history = false
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
    this.getTableData()
  }
  private getTableData() {
    this.cardLoading = true
    const { times, ...form } = this.searchForm
    const params: any = {
      ...form,
      custId: (this as any).custId,
      effect: Array.isArray(times) && times.length > 0 ? times[0] + ' 00:00:00' : undefined,
      expire: Array.isArray(times) && times.length > 0 ? times[1] + ' 23:59:59' : undefined,
      page: this.page,
      size: this.size
    }
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
    this.tableHeaderList = []
    if (!(this as any).$checkPermission(['bookingQuoteCopy', 'bookingQuoteGet'])) return
    // 查看
    if (this.formLoading) return
    this.resetForm()
    this.isRightShow = true
    this.formLoading = true
    this.currentId = item.id
    this.currentbscId = item.bsc.key
    this.currentRefId = item.refId
    this.selectForm.bscId = item.bsc.key
    this.selectForm.refId = item.refId
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
    this.tableUpper = this.tableUpper.sort((a: any, b: any) => a.trans.orgName.localeCompare(b.trans.orgName))
    await this.getRowDetail(this.currentId, isCopy)
  }
  private async getRowDetail(id: string, isCopy?: boolean) {
    this.formLoading = true
    try {
      const res = await getPriceById({ id })
      const data = res.data || {}
      const { currency, currency1, currency2, bsc, period, specials, subtype, rows, refId, loadType, ...form } = data
      const start = dayjs(period.effect).format('YYYY-MM-DD HH:mm:ss')
      const end = dayjs(period.expire).format('YYYY-MM-DD HH:mm:ss')
      this.selectForm = {
        ...form,
        loadType,
        refId,
        bscId: bsc.key,
        bscName: bsc.value,
        subtypeId: subtype.key,
        subtypeName: subtype.value,
        agentId: specials.map((it: any) => it.key),
        currencyName: currency.value,
        currencyId: currency.key,
        currencyName1: currency1.value,
        currencyId1: currency1.key,
        currencyName2: currency2.value,
        currencyId2: currency2.key,
        times: !isCopy ? [start, end] : []
      }
      const json: any[] = []
      rows.map((it: any, index: any) => {
        it.prices = it.prices.map((price: any) => {
          const tamp: any = {
            ...price
          }
          tamp.price = tamp.price || undefined
          return tamp
        })
        json.push(it)
      })
      const sortJson = json.sort((a: any, b: any) => a.trans.orgName.localeCompare(b.trans.orgName))
      this.tableData = sortJson.reduce((list: any[], item: any, index: number) => {
        if (Array.isArray(this.tableUpper) && this.tableUpper[index]) {
          const temu = this.tableUpper[index]
          const temp = {
            trans: {
              bscId: (temu.trans || {}).bscId || item.bscId,
              customDay: (temu.trans || {}).customDay || item.customDay,
              orgId: (temu.trans || {}).orgId || item.orgId,
              orgName: (temu.trans || {}).orgName || item.orgName,
              orgType: (temu.trans || {}).orgType || item.orgType,
              serviceCode: (temu.trans || {}).serviceCode || item.serviceCode,
              shipDay: (temu.trans || {}).shipDay || item.shipDay2
            },
            prices: temu.prices || [],
            remark: temu.remark || '',
            isUpper: true
          }
          list.push(temp)
        } // 上级报价
        list.push(item)
        return list
      }, [])
      this.copyTable = JSON.parse(JSON.stringify(this.tableData))

      if (Array.isArray(rows) && rows.length > 0) {
        const item = rows[0].prices || []
        this.aAxisData = item.map((a: any, index: any) => {
          const xxx = a.x || {}
          const obj: any = {
            label: '',
            aAxisArr: []
          }
          if (loadType === '5' && a.type === '0') { // 卡散-重量
            obj.label = '重量'
            obj.aAxisArr.push({
              index,
              label: `${xxx.lower}-${xxx.upper}`
            })
          } else if (loadType === '5' && a.type === '1') { // 卡散-方数
            obj.label = '方数'
            obj.aAxisArr.push({
              index,
              label: `${xxx.lower}-${xxx.upper}`
            })
          } else if (loadType === '1' || loadType === '2' || loadType === '4') { // 柜型
            obj.label = xxx
          } else if (loadType === '0' || loadType === '3') { // 区间
            obj.label = `${xxx.lower}-${xxx.upper}`
          }
          return obj
        })
      }
      this.getSvTypes()
      this.getSubtypeList()
      await this.getServiceList('sel')
      this.getCustTypeList()
      this.getTimeList()
      this.setType()
      this.serviceList2.map((it: any) => {
        if (it.id === this.selectForm.bscId) {
          this.selectForm.bscCode = it.serviceCode
        }
      })
      if (isCopy) {
        this.selectForm.audit = undefined
        this.selectForm.id = undefined
        this.selectForm.status = ''
        this.historyId = ''
        this.isHistory = false
        this.isAdd = true
        this.isEdit = false
        this.currentId = ''
      } else {
        this.isAdd = false
      }
      this.isTableShow = true
      this.formLoading = false
      if (this.custType === '0' && !this.showAgentPriceModel) {
        this.showAgentPrice()
      }
    } catch (error) {
      this.formLoading = false
      return error
    }
  }

  private addPrice() {
    this.resetForm()
    this.isRightShow = true
    this.isAdd = true
  }
  private editRow() {
    this.isEdit = true
  }
  private onShow() {
    this.auditingRow()
    const { audit, remark } = this.selectForm
    this.auditForm = {
      audit: '1',
      remark
    }
  }
  private onHide() {
    this.auditForm = {
      audit: undefined,
      remark: undefined
    }
    const root: any = this.$refs.auditForm
    this.$nextTick(() => {
      root.clearValidate()
    })
  }
  private onOpen() {
    this.batchNum = undefined
  }
  private onClose() {
    this.batchNum = undefined
  }
  private batchCancel() {
    this.tableData = JSON.parse(JSON.stringify(this.copyTable))
    this.batchShow = false
  }
  private batchConfirm(type: any) {
    this.tableData = this.tableData.map((it: any, index: number, list: any[]) => {
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
      // if (!it.isUpper) {
      //   it.prices.map((p: any) => {
      //     if (p.price) p.price += this.batchNum
      //     return p
      //   })
      // }
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
    const params: any = {
      audit: this.auditForm.audit,
      id: this.currentId,
      reason: this.auditForm.remark
    }
    try {
      const res = await checkPrice(params)
      this.$message({
        type: 'success',
        message: '审核成功'
      })
      this.auditShow = false
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
    if (this.isEdit) {
      this.isEdit = false
      await this.getRowDetail(this.currentId)
    }
    if (this.isAdd) {
      (this.$refs.AgentPrice as any).close()
      this.resetForm()
    }
  }
  private deleteRow(tag: number) {
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
      const isPrice = json.every((it: any) => it.prices.every((p: any) => !p.price))
      if (isPrice) {
        this.$message.error('请至少填写一条报价')
        return
      }
      const isType = (this as any).custType
      if (isType === '2' && !this.selectForm.refId) {
        this.$message.error('请选择参考报价')
        return
      }
      json.map((it: any) => {
        (it.prices || []).map((p: any) => {
          if (p.price === 0) {
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
        currencyId1,
        currencyName1,
        currencyId2,
        currencyName2,
        times,
        refId,
        stdId,
        bscId,
        bscName,
        agentId,
        mode,
        subtypeId,
        subtypeName,
        sections,
        audit,
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

      const params: any = {
        ...form,
        audit: audit === '2' ? '0' : audit,
        mode,
        stdId,
        cust: {
          key: (this as any).custId,
          value: (this as any).custName
        },
        refId: refId || (this as any).custId,
        custType: (this as any).custType,
        currency: {
          key: currencyId,
          value: currencyName
        },
        currency1: {
          key: currencyId1,
          value: currencyName1
        },
        currency2: {
          key: currencyId2,
          value: currencyName2
        },
        bsc: {
          key: bscId,
          value: bscName
        },
        subtype: {
          key: subtypeId,
          value: subtypeName
        },
        period: {},
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
        .catch((err: any) => {
          this.formLoading = false
          return err
        })
    })
  }
  private resetForm() {
    this.selectForm = paramsForm()
    this.getCustId()
    this.tableData = []
    this.aAxisData = []
    this.copyTable = []
    this.options = []
    this.currentId = ''
    this.currentbscId = ''
    this.currentRefId = ''
    this.leftTitle = ''
    this.rightTitle = ''
    this.historyId = ''
    this.isHistory = false
    this.isTableShow = false
    this.isRightShow = false
    this.isAdd = false
    this.isEdit = false
    const root: any = this.$refs.editForm
    this.$nextTick(() => {
      root.clearValidate()
    })
  }

  private async changeType() {
    this.aAxisData = []
    this.tableData = []
    this.copyTable = []
    this.tableHeaderList = []
    this.setType()
    await this.getPriceConfig()
    if (this.custType === '0' && !this.showAgentPriceModel) {
      this.showAgentPrice()
    }
  }
  private setType() {
    const { loadType } = this.selectForm
    switch (loadType) {
      case '0': // 空散
        this.rangeTitle = '重量区间'
        this.isType = 'one'
        break
      case '1': // 空板
        this.rangeTitle = '定义航空板'
        this.isType = 'three'
        break
      case '2': // 海铁整
        this.rangeTitle = '定义柜型'
        this.isType = 'three'
        break
      case '3': // 海铁拼
        this.rangeTitle = '体积区间'
        this.isType = 'one'
        break
      case '4': // 卡整
        this.rangeTitle = '设置车型'
        this.isType = 'three'
        break
      case '5': // 卡散
        this.rangeTitle = '重量&方数区间'
        this.isType = 'two'
        break
      default:
        break
    }
  }

  // 重新设置区间-仅供应商
  private setRange() {
    if (!this.selectForm.bscId) {
      this.$message.error('请先选择服务')
      return
    }
    const { loadType, bscId } = this.selectForm
    switch (loadType) {
      case '0': // 空散
        this.title = '重量区间'
        this.isType = 'one'
        break
      case '1': // 空板
        this.title = '定义航空板'
        this.isType = 'three'
        this.getAviationList()
        break
      case '2': // 海铁整
        this.title = '定义柜型'
        this.isType = 'three'
        this.getContainerList()
        break
      case '3': // 海铁拼
        this.title = '体积区间'
        this.isType = 'one'
        break
      case '4': // 卡整
        this.title = '设置车型'
        this.isType = 'three'
        break
      case '5': // 卡散
        this.title = '重量&方数区间'
        this.isType = 'two'
        break
      default:
        break
    }
    this.dialogRange = true
    this.getResetConfig()
  }
  private getResetConfig() {
    this.selectLoading = true
    const params: any = {
      serviceId: this.selectForm.bscId,
      xy: 'X',
      serviceType: '02'
    }
    getPriceConfig(params).then((res: any) => {
      const result = res.data || []
      if (Array.isArray(result) && result.length <= 0) {
        this.selectLoading = false
        return
      }
      const data = result[0] || {}
      const { ranges, keyValues, ...form } = data
      this.dialogForm = { ...form }
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
        brr = [{
          lower: undefined,
          upper: undefined
        }]
      }
      this.copyRange = brr
      this.copyKey = keyValues
      if (this.isType === 'one') { // 区间
        const res1 = brr.map((it: any) => {
          return it.upperLower
        })
        this.$set(this.dialogForm, 'sections', res1)
      } else if (this.isType === 'three') { // 柜型
        this.options = keyValues.map((it: any) => (it.keyValue || {}).key)
      } else if (this.isType === 'two') { // 重量方数
        const res1 = brr.map((it: any) => {
          if (it.type === '0') {
            return it.upperLower
          }
        })
        const res2 = brr.map((it: any) => {
          if (it.type === '1') {
            return it.upperLower
          }
        })
        this.$set(this.dialogForm, 'sections1', res1)
        this.$set(this.dialogForm, 'sections2', res2)
      }
      this.selectLoading = false
    }).catch((err: any) => {
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
  private getAviationList() {
    this.selectLoading = true
    const params: any = {
      model: {},
      page: 1,
      size: 9999
    }
    getAviationList(params)
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result || []
        this.boxList = result.map((it: any) => {
          const { id, name } = it
          return {
            id: id.toString(),
            name
          }
        })
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
  private async saveRange() {
    const { sections, sections1, sections2, ...form } = this.dialogForm
    const params: any = {
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
        const item = this.boxList.find((l: any) => l.id === it) || {}
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
    this.selectLoading = true
    try {
      const res = await savePriceConfig(params)
      this.$message({
        type: 'success',
        message: '保存成功'
      })
      this.cancelRange()
      this.selectLoading = false
    } catch (error) {
      this.selectLoading = false
      return error
    }
    await this.getPriceConfig()
  }

  // 业务类型
  private getSubtypeList(): void {
    this.selectLoading = true
    getServiceSubtypeList({
      typeId: '02'
    })
      .then((res: any) => {
        const data = res.data || []
        this.typeList = data
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
    this.selectForm.bscId = undefined
    this.typeOption = []
    this.aAxisData = []
    this.onServiceSel()
    this.getSvTypes()
  }
  // 获取服务类型
  private getSvTypes() {
    if (!this.selectForm.subtypeId) return
    const params = {
      type: 'BOOKING_BUSINESS_TYPE' + this.selectForm.subtypeId
    }
    getWordsList(params)
      .then((res: any) => {
        const arr = res.data || []
        if (this.selectForm.subtypeId === '0') {
          this.typeOption = [
            { value: '0', label: '散货' },
            { value: '1', label: '包板' }
          ]
        } else {
          this.typeOption = arr
        }
      }).catch((err: any) => {
        return err
      })
  }

  private onCountry(val: any) {
    if (val === 'sel') {
      this.selectForm.bscId = undefined
      this.onServiceSel()
    } else if (val === 'sea') {
      this.searchForm.bscId = undefined
      this.searchForm.bscName = undefined
    }
  }

  // 服务
  private async getServiceList(val: any) {
    this.selectLoading = true
    const params: any = {
      page: 1,
      size: 9999,
      model: {
        countryToId: val === 'sea' ? this.searchForm.countryId : this.selectForm.countryId,
        conveyance: val === 'sea' ? this.searchForm.subtypeId : this.selectForm.subtypeId
      }
    }
    await getBscList(params)
      .then((res: any) => {
        const data = res.data || {}
        if (val === 'sea') {
          this.serviceList1 = (data.result || []).map((it: any) => {
            it.label = `${it.name}(${it.alias})`
            return it
          })
        } else {
          const arr = data.result || []
          this.serviceList2 = arr.filter((it: any) => it.status === '1').map((it: any) => {
            const { id, ...obj } = it
            return {
              ...obj,
              label: `${it.name}(${it.alias})`,
              id: id.toString()
            }
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
    if (this.searchForm.bscId) {
      this.serviceList1.map((it: any) => {
        if (it.id === this.searchForm.bscId) {
          this.searchForm.bscName = it.name
        }
      })
    } else {
      this.searchForm.bscName = undefined
    }
  }
  private onServiceSel() {
    this.aAxisData = []
    this.tableHeaderList = []
    this.selectForm.refId = undefined
    this.effectList = []
    this.selectForm.loadType = undefined
    this.selectForm.mode = '0'
    this.selectForm.times = []
    this.selectForm.agentId = []
    this.selectForm.stdId = undefined
    this.selectForm.bscName = undefined
    this.selectForm.bscCode = undefined
    this.selectForm.subtypeName = undefined
    this.selectForm.umLength = undefined
    this.selectForm.umWeight = undefined
    this.selectForm.currencyName = undefined
    this.selectForm.currencyId = undefined
    this.selectForm.currencyName1 = undefined
    this.selectForm.currencyId1 = undefined
    this.selectForm.currencyName2 = undefined
    this.selectForm.currencyId2 = undefined
    this.selectForm.portsFrom = {
      key: undefined,
      value: undefined
    }
    this.selectForm.portsTo = {
      key: undefined,
      value: undefined
    }
    this.isTableShow = false
    this.tableData = []
    this.copyTable = []
    if (this.selectForm.bscId) {
      this.serviceList2.map((it: any) => {
        if (it.id === this.selectForm.bscId) {
          this.selectForm.bscName = it.label
          this.selectForm.bscCode = it.serviceCode
          this.selectForm.subtypeName = it.subtypeName
          this.selectForm.umLength = it.umLength
          this.selectForm.umWeight = it.umWeight
          this.selectForm.currencyName = it.currencyName
          this.selectForm.currencyId = it.currencyId
          this.selectForm.currencyName1 = it.currencyName1
          this.selectForm.currencyId1 = it.currencyId1
          this.selectForm.currencyName2 = it.currencyName2
          this.selectForm.currencyId2 = it.currencyId2
          this.selectForm.portsFrom.key = it.portsFromId
          this.selectForm.portsFrom.value = it.portsFromName
          this.selectForm.portsTo.key = it.portsToId
          this.selectForm.portsTo.value = it.portsToName
        }
      })
    }
  }

  private async onEffect() {
    this.selectForm.loadType = undefined
    this.tableData = []
    this.copyTable = []
    this.effectList.map((it: any) => {
      if (this.selectForm.refId === it.id) {
        this.selectForm.loadType = it.loadType
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
    this.tableUpper = this.tableUpper.sort((a: any, b: any) => a.trans.orgName.localeCompare(b.trans.orgName))
    await this.getPriceConfig()
  }
  private async getEffectiveBook() {
    if (this.selectForm.bscId && (this as any).parentId) {
      this.selectLoading = true
      const params: any = {
        custId: (this as any).parentId,
        bscId: this.selectForm.bscId,
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
  private async getPriceConfig() {
    try {
      this.formLoading = true
      const resX = await getPriceConfig({
        serviceId: this.selectForm.bscId,
        serviceType: '02'
      })
      const resY = await getBsTransList({
        model: {
          id: this.selectForm.bscId
        },
        page: 1,
        size: 9999
      })
      const dataX = resX.data || []
      const dataY = resY.data.result || []
      if (dataX.length <= 0 || dataY.length <= 0) {
        this.tableData = []
        this.aAxisData = []
        this.formLoading = false
        return
      }
      let objX: any = {}
      dataX.map((item: any) => {
        if (item.xy === 'X') {
          objX = item
        }
      })
      const { loadType } = this.selectForm
      let arrY:any[] = []
      arrY = dataY.map((it: any) => {
        const { orgName, orgId, orgType, serviceCode, shipDay, customDay, bscId } = it
        return {
          orgName, orgId, serviceCode, shipDay, customDay, orgType, bscId
        }
      })
      let arrX:any[] = []
      const json: any[] = []
      if (loadType === '1' || loadType === '2' || loadType === '4') { // 柜型
        arrX = objX.keyValues || []
        if (arrX.length === 0) {
          this.tableData = []
          this.formLoading = false
          this.isTableShow = false
          return
        }
        this.aAxisData = arrX.map((a:any) => {
          return {
            label: (a.keyValue || {}).value
          }
        })
        arrY.map((it: any, index: any) => {
          const yyy: any = {
            trans: {
              ...it
            },
            prices: [],
            remark: undefined
          }
          arrX.map((a: any) => {
            yyy.prices.push({
              price: undefined,
              x: (a.keyValue || {}).value
            })
          })
          json.push(yyy)
        })
      } else {
        arrX = objX.ranges || []
        if (arrX.length === 0) {
          this.tableData = []
          this.formLoading = false
          this.isTableShow = false
          return
        }
        this.aAxisData = arrX.map((it: any, index: any) => {
          const xxx = it.upperLower || {}
          const obj: any = {
            label: '',
            aAxisArr: []
          }
          if (loadType === '5' && it.type === '0') { // 卡航-重量
            obj.label = '重量'
            obj.aAxisArr.push({
              index,
              label: `${xxx.lower}-${xxx.upper}`
            })
          } else if (loadType === '5' && it.type === '1') { // 卡航-方数
            obj.label = '方数'
            obj.aAxisArr.push({
              index,
              label: `${xxx.lower}-${xxx.upper}`
            })
          } else {
            obj.label = `${xxx.lower}-${xxx.upper}`
          }
          return obj
        })
        arrY.map((it: any, index: any) => {
          const yyy: any = {
            trans: {
              ...it
            },
            prices: [],
            remark: undefined
          }
          arrX.map((a: any) => {
            yyy.prices.push({
              price: undefined,
              type: a.type,
              x: a.upperLower
            })
          })
          json.push(yyy)
        })
      }
      let sortJson = []
      const type = (this as any).custType
      if (type === '0' || type === '3') {
        sortJson = json.sort((a: any, b: any) => a.trans.orgName.localeCompare(b.trans.orgName))
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
            remark: undefined
          }
        })
      }

      this.tableData = sortJson.reduce((list: any[], item: any, index: number) => {
        if (this.tableUpper[index]) {
          const temu = this.tableUpper[index]
          list.push(temu)
        } // 上级报价
        list.push(item)
        return list
      }, [])
      this.copyTable = JSON.parse(JSON.stringify(this.tableData))
      this.isTableShow = true
      this.formLoading = false
    } catch (error) {
      this.formLoading = false
      return error
    }
  }

  private getTimeList(): void {
    this.selectLoading = true
    getStandardPeriod({
      custId: (this as any).custId,
      bscId: this.selectForm.bscId,
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
      paramsId = this.currentId
      this.isHistory = false
    } else {
      paramsId = this.historyId
      this.isHistory = true
      this.historyList.map((it: any) => {
        if (this.historyId === it.id) {
          this.selectForm.refId = it.refId
        }
      })
    }
    this.selectForm.bscId = this.currentbscId
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
    this.tableUpper = this.tableUpper.sort((a: any, b: any) => a.trans.orgName.localeCompare(b.trans.orgName))
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
    this.selectForm.times = []
  }

  private onCompany() {
    if (['2', '3'].includes(this.custType) && !this.selectForm.category) {
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
    if (this.selectForm.audit === '1') {
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
      params.specials = arr.filter((it:any) => it.key && it.value)
      if (arr.length === 0) {
        this.dialogCompany = false
        return
      }
      try {
        const res = await savePriceAgent(params)
        this.selectLoading = false
        this.dialogCompany = false
        this.options = []
        await this.getRowDetail(this.currentId)
      } catch (error) {
        this.selectLoading = false
        return error
      }
    } else {
      this.dialogCompany = false
      this.selectForm.agentId = this.options
    }
  }
  // 代理商
  private getCustTypeList() {
    let toCustType = ''
    let toCustSubtype = ''
    const { subtypeId, category } = this.selectForm
    if (this.custType === '3') {
      if (this.selectForm.category === '3') {
        toCustType = '1'
        toCustSubtype = '0'
      } else if (this.selectForm.category === '4') {
        toCustType = '1'
        toCustSubtype = '1'
      } else {
        toCustType = '0'
        return
      }
    }
    if (this.custType === '0') {
      toCustType = '2'
      toCustSubtype = '1'
    }
    if (this.custType === '2') {
      if (this.selectForm.category === '2') {
        toCustType = '2'
        toCustSubtype = '2'
      } else {
        toCustType = '1'
        if (this.selectForm.category === '3') {
          toCustSubtype = '0'
        } else {
          toCustSubtype = '1'
        }
      }
    }
    const params: any = {
      toCustSubtype,
      toCustType,
      subtypeId: subtypeId || '',
      typeId: '02'
    }
    const type = (this as any).custType
    if (type === '0') { // 聚货通
      this.title = '关联代理商'
    } else if (type === '2' && category === '2') { // 二级代理商
      this.title = '关联代理商'
    } else if (type === '2' && category !== '2') { // 客户
      this.title = '关联客户'
    } else {
      this.title = '关联客户'
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
  }
  private getCustId() {
    const type = (this as any).custType
    const stype = (this as any).custSubtype
    switch (type) {
      case '0': // 聚货通
        this.selectForm.category = '1'
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
        // this.selectForm.category = '0'
        this.custList = [
          { name: '聚货通', id: '0' },
          { name: '直客', id: '3' },
          { name: '同行', id: '4' }
        ]
        break
      default:
        break
    }
  }
  private created() {
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
    margin-bottom: 10px;
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
</style>
