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
            style="line-height: 32px;cursor: pointer"
          >
            <el-popover
              v-model="myPopoverVisible"
              placement="bottom-start"
              trigger="click"
              popper-class="my-popover"
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
                      v-model="searchForm.destinationCountry"
                      :loading="selectLoading"
                      size="mini"
                      clearable
                      filterable
                      placeholder="请选择"
                      style="width: 200px;"
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
                      v-model="searchForm.lscId"
                      :disabled="!searchForm.destinationCountry"
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
                        v-for="item in serviceList"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="供应商"
                    label-width="60px"
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
                    <el-button @click="handleClear('1')">
                      清空
                    </el-button>
                    <el-button
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
                    v-model="searchForm.lscName"
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
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
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
                      @change="searchForm.dispatch = undefined"
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
                    label="目的港关税"
                    label-width="90px"
                  >
                    <el-radio-group v-model="searchForm.includeTax">
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
                    <el-radio-group v-model="searchForm.dispatch">
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
              v-if="cardList.length === 0"
              class="empty"
              style="text-align: center;line-height: 50px;font-size: 12px;color: #909399;"
            >
              暂无报价
            </div>
            <div v-else>
              <div
                v-for="(item) in cardList"
                :key="item.id"
                :class="{'active-card': selectCard.id === item.id}"
                class="el-card is-hover-shadow"
                style="font-size: 12px;margin-bottom: 10px;cursor: pointer;"
                @click="onRow(item)"
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
                      :span="23"
                      class="word-limit"
                    >
                      {{ item.lsc.value }}
                    </el-col>
                  </el-row>
                  <el-row style="margin: 10px 0;">
                    <el-col :span="3">
                      供应商
                    </el-col>
                    <el-col
                      :span="21"
                    >
                      {{ item.cust ? item.cust.value : '' }}
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
            </div>
          </el-scrollbar>
          <el-pagination
            small
            :current-page.sync="pagination.page"
            :page-size="pagination.size"
            layout="total, prev, pager, next"
            :total="pagination.total"
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
            <el-col :span="21">
              <el-form-item
                label="业务类型"
                prop="subtypeId"
              >
                <el-select
                  v-model="selectForm.subtypeId"
                  :disabled="isView"
                  :loading="selectLoading"
                  style="width:200px;"
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
                <el-select
                  v-model="selectForm.lscId"
                  :loading="selectLoading"
                  :disabled="isView"
                  style="width:200px;"
                  clearable
                  filterable
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
                label="供应商"
              >
                {{ selectForm.custName }}
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-select
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
            </el-col>
          </el-row>
          <div class="item-read">
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
                <span v-else>
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
              <div style="display: inline-block;font-size: 14px;line-height: 28px;padding-left: 10px;">
                <span v-show="chargeForm.algorithm === '0'">取实重</span>
                <span v-show="chargeForm.algorithm === '2'">取实重或体积重的平均值</span>
                <span v-show="chargeForm.algorithm === '1'">取实重或体积重的最大值</span>
                <span v-show="chargeForm.algorithm === '1'"> | </span>
                <span v-show="chargeForm.algorithm === '1' && chargeForm.multiWeight === '0'">先累加后比较</span>
                <span v-show="chargeForm.algorithm === '1' && chargeForm.multiWeight === '1'">先比较后累加</span>
              </div>
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
            <el-col :span="20">
              <el-form-item
                label="交货区域"
                label-width="90px"
                prop="areaId"
              >
                <el-select
                  v-model="selectForm.areaId"
                  :loading="selectLoading"
                  :disabled="isView"
                  placeholder="请选择"
                  style="width:200px;"
                  clearable
                  filterable
                  multiple
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
                  :disabled="isView"
                  style="width:140px;"
                  clearable
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in chargeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <!--<el-form-item
                v-if="selectForm.dispatch === '1'"
                label-width="10px"
              >
                <el-checkbox
                  v-model="selectForm.includExpressFee"
                  :disabled="isView"
                >
                  含派送
                </el-checkbox>
              </el-form-item>-->
              <el-form-item
                label="有效时间"
                label-width="90px"
                prop="times"
              >
                <el-date-picker
                  v-model="selectForm.times"
                  :disabled="isView"
                  :clearable="false"
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
              :span="4"
              style="text-align: right;"
            >
              <el-button
                v-if="selectForm.audit === '0'"
                type="text"
                size="small"
                @click="auditRow"
              >
                审核
              </el-button>
              <el-popover
                v-if="selectForm.audit === '3'"
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
            </el-col>
          </el-row>
          <div v-if="selectForm.audit === '2'">
            <el-form-item
              label="拒绝原因："
              label-width="90px"
              style="width: 100%;"
            >
              {{ selectForm.remark }}
            </el-form-item>
          </div>
        </el-form>
        <div v-show="isTableShow">
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
              :resizable="true"
            >
              <template
                slot="header"
              >
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
                  {{ scope.row.prices[index].price }}
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
                <span>
                  {{ scope.row.prescription }}
                </span>
              </template>
            </vxe-table-column>
            <vxe-table-column
              min-width="120"
              title="备注"
              :show-overflow="true"
              :resizable="true"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.remark }}</span>
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getServiceSubtypeList,
  getCountryList,
  getAreaList,
  getLscList,
  getHistoryPrice,
  getSupplierPriceList,
  getPriceById,
  checkPrice,
  getChargeList,
  groupByPid
} from '@/api/price-to-private-line'
import {
  getRegionList,
  getFbastoreList,
  getStateByCountry
} from '@/api/service-with-privateline-clearance'
import dayjs from 'dayjs'

function paramsForm() {
  return {
    custName: '',
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
    includExpressFee: false,
    sections: [{
      lower: undefined,
      upper: undefined
    }],
    audit: undefined,
    remark: ''
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
export default class extends Vue {
  /** data */
  private isActive: boolean = true
  private isView: boolean = true
  private selectLoading: boolean = false
  private popoverShow1: boolean = false
  private popoverShow2: boolean = false
  private checkAll: boolean = false
  private isIndeterminate: boolean = false
  private isRightShow: boolean = false
  private cardLoading: boolean = false
  private formLoading: boolean = false
  private myPopoverVisible: boolean = false
  private isTableShow: boolean = false
  private auditShow: boolean = false
  private dayjs: any = dayjs
  private searchForm: any = {
    custId: undefined,
    subtypeId: undefined,
    purposeType: undefined,
    lscId: undefined,
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
  private selectCard: any = {}
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  private selectForm: any = paramsForm()
  private chargeForm: any = paramsCharge()
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
    lscId: [{ required: true, message: '请选择服务', trigger: 'change' }],
    category: [{ required: true, message: '请选择报价对象', trigger: 'change' }],
    refId: [{ required: true, message: '请选择参考报价', trigger: 'change' }],
    areaId: [{ required: true, message: '请选择交货区域', trigger: 'change' }],
    measureId: [{ required: true, message: '请选择计费配置', trigger: 'change' }],
    mode: [{ required: true, message: '请选择价格标准', trigger: 'change' }],
    times: [{ required: true, message: '请选择有效时间', trigger: 'change' }],
    stdId: [{ required: true, message: '请选择有效时间', trigger: 'change' }]
  }
  private tableData: any[] = []
  private aAxisData: any[] = []
  private typeList: any[] = []
  private countryList: any[] = []
  private serviceList: any[] = []
  private auditList: any[] = [
    {
      label: '待审核',
      value: 0
    },
    {
      label: '审核中',
      value: 3
    },
    {
      label: '已拒绝',
      value: 2
    },
    {
      label: '已通过',
      value: 1
    }
  ]
  private areaList: any[] = []
  private cardList: any[] = []
  private chargeList: any[] = []
  private historyList: any[] = []
  private historyId: any = ''
  private leftTitle: string = ''
  private rightTitle: string = ''
  private isShowRegionalDetailCol: boolean = false

  /* methods */
  private async auditRow() {
    let params: any = {}
    if (this.selectForm.audit === '0') {
      params = {
        audit: '3',
        id: this.selectCard.id
      }
    } else {
      params = {
        audit: this.auditForm.audit,
        id: this.selectCard.id,
        reason: this.auditForm.remark
      }
    }
    this.formLoading = true
    try {
      const res = await checkPrice(params)
      this.$message({
        type: 'success',
        message: '审核成功'
      })
      this.auditShow = false
      this.getTableData()
      this.getRowDetail(this.selectCard.id)
      this.formLoading = false
    } catch (error) {
      this.formLoading = false
      return error
    }
  }
  private onShow() {
    const { audit, remark } = this.selectForm
    this.auditForm = {
      audit,
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
  private getHistoryPrice() {
    this.selectLoading = true
    const params: any = {
      id: this.selectCard.id,
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
                str = e.cityName + '-' + e.cityName
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
  private onHistory(val: any) {
    this.tableData = []
    this.aAxisData = []
    if (!val) {
      this.onRow(this.selectCard)
    } else {
      this.getRowDetail(val)
    }
  }
  private onRow(item: any) {
    if (this.formLoading) return
    this.formLoading = true
    this.resetForm()
    this.selectCard = {
      ...item
    }
    this.isRightShow = true
    this.selectForm.lscId = item.lsc.key
    this.selectForm.refId = item.refId
    this.selectForm.areaId = item.deliveries.map((it: any) => it.key)
    this.getRowDetail(this.selectCard.id)
  }
  private getRowDetail(id: string) {
    this.historyList = []
    this.formLoading = true
    getPriceById({
      id
    }).then(async(res: any) => {
      const data = res.data || {}
      const {
        cust, currency, deliveries, lsc, period, specials, subtype, mode, rows, measure, refId, loadType, ...form
      } = data
      this.selectForm = {
        ...form
      }
      this.selectForm.custName = cust.value
      this.getChargeList(cust.key)
      rows.map((it: any) => {
        this.selectForm.yType = it.addressType
      })
      if (this.selectForm.yType === '0') {
        this.leftTitle = '国家'
      } else if (this.selectForm.yType === '1') {
        this.leftTitle = '州省'
      } else if (this.selectForm.yType === '5') {
        this.leftTitle = '国内区域'
      } else if (this.selectForm.yType === '7') {
        this.leftTitle = '仓库代码'
      } else if (this.selectForm.yType === '100') {
        this.leftTitle = '城市区域'
      } else if (this.selectForm.yType === '101') {
        this.leftTitle = '仓库区域'
      } else if (this.selectForm.yType === '102') {
        this.leftTitle = '国家区域'
      }
      this.selectForm.mode = mode
      this.selectForm.loadType = loadType
      this.selectForm.refId = refId
      this.selectForm.measureId = measure.key
      this.selectForm.measureName = measure.value
      this.selectForm.lscId = lsc.key
      this.selectForm.lscName = lsc.value
      this.selectForm.subtypeId = subtype.key
      this.selectForm.subtypeName = subtype.value
      if (period.effect && period.expire) {
        const start = dayjs(period.effect).format('YYYY-MM-DD HH:mm:ss')
        const end = dayjs(period.expire).format('YYYY-MM-DD HH:mm:ss')
        this.$set(this.selectForm, 'times', [start, end])
      } else {
        this.$set(this.selectForm, 'times', [])
      }
      this.selectForm.agentId = specials.map((it: any) => it.key)
      this.selectForm.currencyName = currency.value
      this.selectForm.currencyId = currency.key
      const arrDI = deliveries.map((it: any) => it.key)
      this.$set(this.selectForm, 'areaId', arrDI)

      const json: any[] = []
      rows.map((it: any, index: any) => {
        json.push(it)
      })
      this.tableData = json
      await this.groupByPid()
      this.isTableShow = true
      if (Array.isArray(rows) && rows.length > 0) {
        const item = rows[0].prices || []
        this.aAxisData = item.map((a: any, index: any) => {
          const xxx = a.x || {}
          const obj: any = {
            label: '',
            aAxisArr: []
          }
          if (loadType === '5' && a.type === '0') { // 卡散-重量
            obj.label = `${xxx.lower}-${xxx.upper}`
            this.rightTitle = '重量区间'
          } else if (loadType === '5' && a.type === '1') { // 卡散-方数
            obj.label = `${xxx.lower}-${xxx.upper}`
            this.rightTitle = '方数区间'
          } else if (loadType === '2') { // 海铁整柜
            this.rightTitle = '柜型'
            obj.label = xxx.value
          } else {
            if (a.type === '0') {
              this.rightTitle = '重量区间'
            }
            if (a.type === '1') {
              this.rightTitle = '体积区间'
            }
            // this.rightTitle = loadType === '0' ? '重量区间' : loadType === '3' ? '体积区间' : ''
            obj.label = `${xxx.lower}-${xxx.upper}`
          }
          return obj
        })
      }

      await this.getServiceList('sel')
      this.serviceList.map((it: any) => {
        if (it.id === this.selectForm.lscId) {
          this.selectForm.lscCode = it.lsId
        }
      })
      this.formLoading = false
    }).catch(err => {
      this.formLoading = false
      return err
    })
  }
  private resetForm() {
    this.selectForm = paramsForm()
    this.chargeForm = paramsCharge()
    this.tableData = []
    this.aAxisData = []
    this.historyId = ''
    this.isTableShow = false
    this.isRightShow = false
    this.leftTitle = ''
    this.rightTitle = ''
    const root: any = this.$refs.editForm
    this.$nextTick(() => {
      root.clearValidate()
    })
  }
  private getChargeList(agentId: string) {
    this.selectLoading = true
    getChargeList({
      agentId,
      type: this.selectForm.priceType === '2' ? '0' : this.selectForm.priceType === '3' ? '1' : undefined,
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
  private priceTypeChange(val: any) {
    this.myPopoverVisible = false
    this.$emit('priceTypeChange', val)
  }
  private formattPriceType(val: any, list: any[]) {
    const unit = list.find((e: any) => e.value === val)
    return unit ? `${unit.label}` : '--'
  }
  private handleClear(val: any) {
    switch (val) {
      case '1':
        this.searchForm.destinationCountry = undefined
        this.searchForm.custId = undefined
        this.searchForm.lscId = undefined
        this.searchForm.lscName = undefined
        break
      case '2':
        this.searchForm.areaId = []
        this.searchForm.includeTax = undefined
        this.searchForm.dispatch = undefined
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
    this.getTableData()
  }
  private async getServiceList(val: any) {
    this.selectLoading = true
    const params: any = {
      page: 1,
      size: 9999,
      countryId: val === 'sea' ? this.searchForm.destinationCountry : undefined,
      subtypeId: val === 'sea' ? this.searchForm.subtypeId : this.selectForm.subtypeId,
      purposeType: val === 'sea' ? this.searchForm.purposeType : undefined
    }
    await getLscList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.serviceList = (data.result || []).map((it: any) => {
          it.label = `${it.name}(${it.abbr})`
          return it
        })
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private onServiceSea() {
    if (this.searchForm.lscId) {
      this.serviceList.map((it: any) => {
        if (it.id === this.searchForm.lscId) {
          this.searchForm.lscName = it.label
        }
      })
    } else {
      this.searchForm.lscName = undefined
    }
  }
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
    this.searchForm.lscId = undefined
    this.searchForm.lscName = undefined
  }
  private getTableData() {
    this.cardLoading = true
    const { areaId, times, ...form } = this.searchForm
    const params: any = {
      model: {
        ...form,
        effect: Array.isArray(times) && times.length > 0 ? times[0] + ' 00:00:00' : undefined,
        expire: Array.isArray(times) && times.length > 0 ? times[1] + ' 23:59:59' : undefined
      },
      page: this.pagination.page,
      size: this.pagination.size
    }
    const arr = (areaId || []).map((it:any) => {
      const item = this.areaList.find((a: any) => it === a.name) || {}
      if (item.id && item.name) {
        return item.id
      }
    })
    params.model.deliveries = arr.join(',')
    getSupplierPriceList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.cardList = data.result || []
        this.pagination.total = data.total
        // this.resetForm()
        this.cardLoading = false
      })
      .catch((err: any) => {
        this.cardLoading = false
        return err
      })
  }
  private formatArea(arr: any[]) {
    const arrN = (arr || []).map((it: any) => it.value)
    return arrN.join(',')
  }
  private getSubtypeList() {
    this.selectLoading = true
    getServiceSubtypeList({
      typeId: '05'
    })
      .then((res: any) => {
        const data = res.data || []
        this.typeList = data.filter((item: any) => item.id !== '3')
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
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
  private formatTime(obj: any) {
    const start = (obj || {}).effect
    const end = (obj || {}).expire
    return dayjs(start).format('YYYY-MM-DD HH:mm') + '-' + dayjs(end).format('YYYY-MM-DD HH:mm')
  }
  private handleChecked(val: any) {
    const numC = (val || []).length
    const numA = (this.areaList || []).length
    this.checkAll = numC === numA
    this.isIndeterminate = numC > 0 && numC < numA
  }
  private handleCheckAll(val: any) {
    const arrN = this.areaList.map((it: any) => it.name)
    this.searchForm.areaId = val ? arrN : []
    this.isIndeterminate = false
  }
  private onBusiness() {
    this.searchForm.dispatch = undefined
    this.getTableData()
  }
  private handleSizeChange(val: string) {
    this.pagination.size = Number(val)
    this.getTableData()
  }
  private handleCurrentChange(val: string) {
    this.pagination.page = Number(val)
    this.getTableData()
  }
  private toggle() {
    this.isActive = !this.isActive
  }
  private created() {
    this.getTableData()
    this.getCountryList()
    this.getSubtypeList()
    this.getAreaList()
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
  ::v-deep .el-table .success-row {
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
</style>
