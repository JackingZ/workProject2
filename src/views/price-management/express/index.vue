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
            快递报价
          </el-col>
          <el-col
            :span="12"
            style="text-align: right;"
          >
            <el-button
              v-if="custType === '0' && $checkPermission(['expressPriceAdd'])"
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
                v-model="searchForm.country"
                :loading="selectLoading"
                size="mini"
                clearable
                filterable
                placeholder="起运国"
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
                v-model="searchForm.subtypeId"
                :disabled="!searchForm.country"
                :loading="selectLoading"
                size="mini"
                clearable
                filterable
                placeholder="服务"
                @focus="getServiceList('sea')"
                @change="getTableData"
              >
                <el-option
                  v-for="item in serviceList1"
                  :key="item.id"
                  :label="item.label"
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
                    {{ item.subtype.value }}
                  </el-col>
                  <el-col
                    :span="4"
                    style="text-align: right;"
                  >
                    标准报价
                  </el-col>
                </el-row>
                <el-row style="margin: 10px 0;">
                  <el-col
                    :span="20"
                    class="word-limit"
                    style="color:  #409EFF;"
                  >
                    {{ item.expressName }}
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
                    :span="16"
                    style="line-height: 16px;"
                  >
                    {{ formatTime(item.period) }}
                  </el-col>
                  <el-col
                    v-if="item.type"
                    :span="5"
                    style="text-align: right;"
                  >
                    <span class="border-tip-blue">
                      {{ item.type === '0' ? '目的地代码' : '目的地区域' }}
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
            <el-col :span="18">
              <el-form-item
                label="起运国"
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
                prop="escId"
                label-width="75px"
              >
                <span slot="label">服务</span>
                <el-tooltip
                  v-show="selectForm.escId"
                  slot="label"
                  :content="selectForm.escName + '/' + selectForm.expressCode"
                  placement="top"
                  effect="light"
                >
                  <i class="el-icon-warning-outline" />
                </el-tooltip>
                <el-select
                  v-model="selectForm.escId"
                  :loading="selectLoading"
                  :disabled="isEdit || !isAdd || !selectForm.countryId"
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

              <!-- <el-form-item
                v-if="custType === '2'"
                label="参考报价"
              >
                <el-select
                  v-model="selectForm.refId"
                  :loading="selectLoading"
                  :disabled="isEdit || !isAdd || !selectForm.escId"
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
              </el-form-item> -->

              <el-form-item
                label="报价对象"
                prop="category"
                :required="custType === '2' || custType === '3'"
              >
                <!-- <div v-if="custType === '0'">
                  一级代理商
                </div> -->
                <div v-if="custType === '0'">
                  聚货通
                </div>
                <!-- <el-select
                  v-if="custType === '2' || custType === '3'"
                  v-model="selectForm.category"
                  :disabled="isEdit || !isAdd"
                  style="width:90px;"
                  clearable
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in custList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select> -->
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
              style="text-align: right;display: flex;justify-content: flex-end"
            >
              <div v-show="!isHistory && selectForm.status !== '2'">
                <el-button
                  v-if="(!isEdit && !isAdd && selectForm.audit !== '1' && selectForm.audit !== '3') && $checkPermission(['expressPriceEdit'])"
                  type="text"
                  size="small"
                  style="margin-right: 10px"
                  @click="editRow"
                >
                  编辑
                </el-button>

                <el-popover
                  v-show="(!isEdit && !isAdd && selectForm.audit !== '1' && selectForm.status !== '2') && $checkPermission(['expressPriceAudit'])"
                  v-model="auditShow"
                  placement="bottom-start"
                  style="width: 400px;"
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
                    size="small"
                    style="padding-right: 10px;"
                  >
                    审核
                  </el-button>
                </el-popover>
                <el-button
                  v-if="(isAdd || isEdit)"
                  type="text"
                  size="small"
                  style="padding-right: 10px;"
                  @click="cancelRow"
                >
                  取消
                </el-button>
                <el-button
                  v-if="(isAdd || isEdit)"
                  type="text"
                  size="small"
                  @click="saveRow"
                >
                  保存
                </el-button>
                <el-button
                  v-if="!isAdd && !isEdit && selectForm.audit !== '1' && selectForm.audit !== '3' && $checkPermission(['expressPriceDelete'])"
                  type="text"
                  size="small"
                  @click="deleteRow(1)"
                >
                  删除
                </el-button>
              </div>
              <div v-if="(!isEdit && !isAdd) && $checkPermission(['expressPriceCopy'])">
                <el-button
                  type="text"
                  size="small"
                  style="margin-left: 10px"
                  @click="copyPrice"
                >
                  复制此版本
                </el-button>
                <el-button
                  v-if="selectForm.audit === '1' && !historyId && $checkPermission(['expressPriceInvalid'])"
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
              label="快递公司："
            >
              <span
                class="word-limit"
              >
                {{ selectForm.expressName }}
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
                <span v-if="selectForm.umLength === 'IN'">
                  IN-英寸
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
            <el-form-item
              label="邮编："
              prop="consignorZip"
            >
              <span>{{ selectForm.consignorZip }}</span>
            </el-form-item>
          </div>

          <el-row>
            <el-col :span="21">
              <el-form-item
                v-show="selectForm.subtypeId === '0' && selectForm.escId"
                label="请选择"
                prop="type"
                label-width="70px"
              >
                <el-radio-group
                  v-model="selectForm.type"
                  :disabled="!isEdit && !isAdd"
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
                v-if="custType === '0'"
                label="重量区间"
                label-width="90px"
                class="is-required"
              >
                <el-button
                  :disabled="(!isEdit && !isAdd) || tableData.length <= 0"
                  type="primary"
                  size="mini"
                  plain
                  @click="setRange"
                >
                  已选择{{ tableData.length }}
                </el-button>
              </el-form-item>
              <el-form-item
                v-if="false"
                label="计费规则"
                prop="valuation"
                label-width="90px"
              >
                <el-radio-group
                  v-model="selectForm.valuation"
                  :disabled="!isEdit && !isAdd"
                >
                  <el-radio
                    label="0"
                  >
                    按首重续重
                  </el-radio>
                  <el-radio
                    label="1"
                  >
                    按总价单价
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                v-if="false"
                label="单价最低重量"
                prop="unitPriceMinWeight"
                label-width="110px"
              >
                <el-input-number
                  v-model="selectForm.unitPriceMinWeight"
                  :disabled="!isEdit && !isAdd"
                  class="input-number-valiate"
                  style="width: 90px;"
                  :controls="false"
                  placeholder="请输入"
                  :min="0"
                  :max="999999"
                  :step="1"
                  step-strictly
                />
              </el-form-item>
              <el-form-item
                label="重量折扣"
                prop="weightDisCount"
              >
                <div class="input-content">
                  <div style="flex: 1;">
                    <el-input-number
                      v-model="selectForm.weightDisCount"
                      :disabled="!isEdit && !isAdd"
                      class="input-number-valiate input-border"
                      style="width: 90px;"
                      :controls="false"
                      placeholder="请输入"
                      :min="0"
                      :max="999999"
                      :precision="2"
                    />
                  </div>
                  <div class="input-unit">
                    %
                  </div>
                </div>
              </el-form-item>
              <el-form-item
                label="手续费率"
                prop="handlingRate"
              >
                <div class="input-content">
                  <div style="flex: 1;">
                    <el-input-number
                      v-model="selectForm.handlingRate"
                      :disabled="!isEdit && !isAdd"
                      class="input-number-valiate input-border"
                      style="width: 90px;"
                      :controls="false"
                      placeholder="请输入"
                      :min="0"
                      :max="999999"
                      :precision="2"
                    />
                  </div>
                  <div class="input-unit">
                    %
                  </div>
                </div>
              </el-form-item>
              <el-form-item
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
                  style="width:320px;"
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
                  :label="`${item.startTime}-${item.endTime}`"
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
              title="重量区间"
              :show-overflow="true"
              :resizable="true"
            >
              <template slot-scope="scope">
                {{ scope.row.y }}
              </template>
            </vxe-table-column>
            <vxe-table-column
              v-for="(item,index) in aAxisData"
              :key="index"
              :title="item.address.value"
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
          </vxe-table>
        </div>
      </div>
    </div>

    <el-dialog
      :visible.sync="dialogRange"
      :close-on-click-modal="false"
      width="960px"
      @closed="cancelRange"
    >
      <div slot="title">
        <p>
          {{ '选择' + title }}
        </p>
        <p
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
          <div>
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
        </el-form>
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

    <agent-price
      ref="AgentPrice"
      @close="closeAgentPrice"
    />
    <transition name="el-fade-in-linear">
      <div
        v-show="showAgentPriceModel && isRightShow && custType === '0' && false"
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
        v-if="$checkPermission(['expressPriceCopy'])"
        class="contextmenu-item"
        @click="onRow(showMenuRow, true)"
      >
        复制
      </li>
      <li
        v-if="$checkPermission(['expressPriceView'])"
        class="contextmenu-item"
        @click="onRow(showMenuRow)"
      >
        查看
      </li>
      <li
        v-if="showMenuRow.audit !== '1' && showMenuRow.audit !== '3' && $checkPermission(['expressPriceDelete'])"
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
  getServiceList,
  getHistoryPrice,
  geCurrencyList,
  getEffectiveBook,
  getPriceList,
  getPriceConfig,
  getPriceCode,
  getPriceById,
  savePriceConfig,
  savePrice,
  checkPrice,
  deletePrice,
  invalidPrice
} from '@/api/price-to-express'
import dayjs from 'dayjs'
import AgentPrice from '@/views/price-management/booking/components/agentPrice.vue'
import XLSX from 'xlsx'

function paramsForm() {
  return {
    audit: undefined,
    status: undefined,
    remark: undefined,
    type: undefined,
    subtype: undefined,
    escId: undefined,
    escName: undefined,
    expressCode: undefined,
    expressName: undefined,
    refId: undefined,
    currencyId: undefined,
    countryId: undefined,
    category: undefined,
    umWeight: undefined,
    umLength: undefined,
    valuation: undefined,
    unitPriceMinWeight: undefined,
    weightDisCount: undefined,
    handlingRate: undefined,
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
    country: undefined,
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
    countryId: [{ required: false, message: '请选择目的国', trigger: 'change' }],
    escId: [{ required: true, message: '请选择服务', trigger: 'change' }],
    category: [{ required: true, message: '请选择报价对象', trigger: 'change' }],
    refId: [{ required: true, message: '请选择参考报价', trigger: 'change' }],
    type: [{ required: true, message: '请选择目的地类型', trigger: 'change' }],
    valuation: [{ required: false, message: '请选择计费规则', trigger: 'change' }],
    unitPriceMinWeight: [{ required: false, message: '单价最低重量不能为空', trigger: 'blur' }],
    times: [{ required: true, message: '请选择有效时间', trigger: 'change' }]
  }
  private isActive: boolean = true
  private popoverShow1: boolean = false
  private popoverShow2: boolean = false
  private selectLoading: boolean = false
  private formLoading: boolean = false
  private cardLoading: boolean = false
  private isEdit: boolean = false
  private isAdd: boolean = false
  private dialogRange: boolean = false
  private title = ''
  private currentId = ''
  private currentEscId = ''
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
  private typeList: any[] = []
  private typeOption: any[] = [
    { label: '按目的地代码', value: '0' },
    { label: '按目的地区域', value: '1' }
  ]
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
  private tableData: any[] = []
  private cardList: any[] = []
  private tableUpper: any[] = []
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
          const tamp: any = tableData.find((t: any) => t.y === td.y)
          if (tamp) {
            const price: any[] = td.prices || []
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
        if (t.dataIndex === 'y') {
          tamp[t.dataIndex] = e.y
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
    XLSX.writeFile(wb, this.selectForm.escName + '报价导入模板' + '.xlsx')
  }
  private getXlsxHeader() {
    const priceTable: any = this.$refs.priceTable
    const tableHeaderEls: any = priceTable.$el.querySelector('.vxe-table--header-wrapper').querySelectorAll('.vxe-header--column > .vxe-cell > .vxe-cell--title')
    const tableHeaderList: any[] = []
    const tableHeader: any[] = [
      {
        dataIndex: 'y',
        title: '重量区间'
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
      this.selectForm.escId = this.currentEscId
      // await this.getEffectiveBook()
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
    if (!this.selectForm.escId) {
      this.$message.warning('请选择服务')
      return
    }
    const service = this.serviceList2.find((e: any) => e.id === this.selectForm.escId)
    if (service) {
      (this.$refs.AgentPrice as any).show(service)
      this.showAgentPriceModel = false
    } else {
      this.$message.warning('请选择服务')
    }
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
        this.searchForm.country = undefined
        this.searchForm.subtypeId = undefined
        break
      case '2':
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
    if (!(this as any).$checkPermission(['expressPriceView'])) return
    this.tableHeaderList = []
    // 查看
    if (this.formLoading) return
    this.resetForm()
    this.isRightShow = true
    this.formLoading = true
    this.currentId = item.id
    this.currentEscId = item.subtype.key
    this.currentRefId = item.refId
    this.selectForm.escId = item.subtype.key
    this.selectForm.refId = item.refId
    // await this.getEffectiveBook()
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
    this.getCountryList()
    try {
      const res = await getPriceById({ id })
      const data = res.data || {}
      const { currency, subtype, period, rows, refId, country, ...form } = data
      const start = dayjs(period.effect).format('YYYY-MM-DD HH:mm:ss')
      const end = dayjs(period.expire).format('YYYY-MM-DD HH:mm:ss')
      this.selectForm = {
        ...form,
        countryId: country.key,
        escId: subtype.key,
        escName: subtype.value,
        currencyName: currency.value,
        currencyId: currency.key,
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
      const sortJson = json
      this.tableData = sortJson.reduce((list: any[], item: any, index: number) => {
        if (Array.isArray(this.tableUpper) && this.tableUpper[index]) {
          const temu = this.tableUpper[index]
          const temp = {
            y: temu.y,
            prices: temu.prices || [],
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
          const { address, addressType } = a
          return {
            address,
            addressType
          }
        })
      }
      await this.getServiceList('sel')
      this.serviceList2.map((it: any) => {
        if (it.id === this.selectForm.escId) {
          this.selectForm.expressCode = it.expressCode
          this.selectForm.consignorZip = (it.consignorEntity || {}).consignorZip
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
      reason: this.auditForm.remark || ''
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
      const cType = (this as any).custType
      if (cType === '2' && !this.selectForm.refId) {
        this.$message.error('请选择参考报价')
        return
      }
      const rows = json.map((it: any) => {
        const { prices, y, prescription } = it
        prices.map((p: any) => {
          if (p.price === 0) {
            p.price = undefined
          }
        })
        return {
          prices,
          y,
          prescription
        }
      })
      const {
        currencyId,
        currencyName,
        countryId,
        times,
        refId,
        escId,
        escName,
        sections,
        audit,
        ...form
      } = this.selectForm
      const itemC = this.countryList.find((it: any) => it.id === countryId)
      const params: any = {
        ...form,
        audit: audit === '2' ? '0' : audit,
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
        country: {
          key: itemC ? itemC.id : undefined,
          value: itemC ? itemC.name : undefined
        },
        subtype: {
          key: escId,
          value: escName
        },
        rows
      }
      params.period = {
        effect: Array.isArray(times) && times.length > 0 ? dayjs(times[0]).format('YYYY-MM-DD HH:mm:ss') : undefined,
        expire: Array.isArray(times) && times.length > 0 ? dayjs(times[1]).format('YYYY-MM-DD HH:mm:ss') : undefined
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
    this.currentId = ''
    this.currentEscId = ''
    this.currentRefId = ''
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
    await this.getPriceConfig()
    if (this.custType === '0' && !this.showAgentPriceModel) {
      this.showAgentPrice()
    }
  }

  // 重新设置区间
  private setRange() {
    if (!this.selectForm.escId) {
      this.$message.error('请先选择服务')
      return
    }
    this.title = '重量区间'
    this.dialogRange = true
    this.getResetConfig()
  }
  private getResetConfig() {
    this.selectLoading = true
    const params: any = {
      serviceId: this.selectForm.escId,
      xy: 'X',
      serviceType: '00'
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
              lower: lower >= 0 ? lower : undefined,
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
      const res1 = brr.map((it: any) => {
        return it.upperLower
      })
      this.$set(this.dialogForm, 'sections', res1)
      this.selectLoading = false
    }).catch((err: any) => {
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
      default:
        break
    }
  }
  private deleteRangeData(index: number, val: any) {
    switch (val) {
      case '0':
        this.dialogForm.sections.splice(index, 1)
        break
      default:
        break
    }
  }
  private cancelRange() {
    this.dialogRange = false
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
    const axisX: any[] = []
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
      typeId: '00'
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

  private onCountry(val: any) {
    if (val === 'sel') {
      this.selectForm.escId = undefined
      this.onServiceSel()
    } else if (val === 'sea') {
      this.searchForm.subtypeId = undefined
    }
  }

  // 服务
  private async getServiceList(val: any) {
    this.selectLoading = true
    const params: any = {
      page: 1,
      size: 9999,
      model: {
        countryId: val === 'sea' ? this.searchForm.country : this.selectForm.countryId
      }
    }
    await getServiceList(params)
      .then((res: any) => {
        const data = res.data || {}
        if (val === 'sea') {
          this.serviceList1 = (data.result || []).map((it: any) => {
            it.label = `${it.name}(${it.abbr})`
            return it
          })
        } else {
          const arr = data.result || []
          this.serviceList2 = arr.filter((it: any) => it.status === 1).map((it: any) => {
            const { id, ...obj } = it
            return {
              ...obj,
              label: `${it.name}(${it.abbr})`,
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

  private onServiceSel() {
    this.aAxisData = []
    this.tableHeaderList = []
    this.selectForm.refId = undefined
    this.effectList = []
    this.selectForm.type = undefined
    this.selectForm.times = []
    this.selectForm.escName = undefined
    this.selectForm.expressCode = undefined
    this.selectForm.umLength = undefined
    this.selectForm.umWeight = undefined
    this.selectForm.currencyName = undefined
    this.selectForm.currencyId = undefined
    this.selectForm.subtypeId = undefined
    this.selectForm.expressName = undefined
    this.selectForm.consignorZip = undefined
    this.isTableShow = false
    this.tableData = []
    this.copyTable = []
    if (this.selectForm.escId) {
      this.serviceList2.map((it: any) => {
        if (it.id === this.selectForm.escId) {
          this.selectForm.subtypeId = it.subtypeId
          this.selectForm.expressName = it.expressName
          this.selectForm.escName = it.label
          this.selectForm.expressCode = it.expressCode
          this.selectForm.umLength = it.umMeasure
          this.selectForm.umWeight = it.umWeight
          this.selectForm.currencyName = it.currencyName
          this.selectForm.currencyId = it.currencyId
          this.selectForm.consignorZip = (it.consignorEntity || {}).consignorZip
        }
      })
    }
  }

  private async onEffect() {
    this.selectForm.type = undefined
    this.tableData = []
    this.copyTable = []
    this.effectList.map((it: any) => {
      if (this.selectForm.refId === it.id) {
        this.selectForm.type = it.type
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
    if (this.selectForm.escId && (this as any).parentId) {
      this.selectLoading = true
      const params: any = {
        custId: (this as any).parentId,
        escId: this.selectForm.escId,
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
      const resXY = await getPriceConfig({
        serviceId: this.selectForm.escId,
        serviceType: '00'
      })

      const dataXY = resXY.data || []
      if (dataXY.length <= 0) {
        this.tableData = []
        this.aAxisData = []
        this.formLoading = false
        return
      }
      if (this.selectForm.type === '0') { // 按目的地代码
        const resX = await getPriceCode({
          id: this.selectForm.escId
        })
        const dataX = resX.data || []
        this.aAxisData = dataX.map((it: any) => {
          return {
            address: {
              key: it.id,
              value: it.name
            },
            addressType: '8'
          }
        })
      } else if (this.selectForm.type === '1') { // 按目的地区域
        dataXY.map((item: any) => {
          if (item.xy === 'Y') {
            const keyValues = item.keyValues || []
            this.aAxisData = keyValues.map((it: any) => {
              return {
                address: it.keyValue,
                addressType: item.yType
              }
            })
          }
        })
      }
      let arrY:any[] = []
      dataXY.map((item: any) => {
        if (item.xy === 'X') {
          arrY = item.ranges || []
        }
      })
      if (arrY.length === 0) {
        this.tableData = []
        this.formLoading = false
        this.isTableShow = false
        return
      }
      const json:any[] = []
      arrY.map((it: any) => {
        const xxx = it.upperLower || {}
        const obj:any = {
          y: `${xxx.lower}-${xxx.upper}`,
          prices: []
        }
        this.aAxisData.map((a: any) => {
          obj.prices.push({
            ...a,
            price: undefined
          })
        })
        json.push(obj)
      })
      let sortJson = []
      const type = (this as any).custType
      if (type === '0' || type === '3') {
        sortJson = json
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
            prices: ps
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
    this.selectForm.escId = this.currentEscId
    // await this.getEffectiveBook()
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
        const data = res.data || []
        this.historyList = data
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private getCustId() {
    const type = (this as any).custType
    const stype = (this as any).custSubtype
    switch (type) {
      case '0': // 聚货通
        this.selectForm.category = '0'
        break
      // case '2': // 代理商
      //   if (stype === '1') { // 一级
      //     this.custList = [
      //       { name: '二级代理商', id: '2' },
      //       { name: '直客', id: '3' },
      //       { name: '同行', id: '4' }
      //     ]
      //   } else if (stype === '2') { // 二级
      //     this.custList = [
      //       { name: '直客', id: '3' },
      //       { name: '同行', id: '4' }
      //     ]
      //   }
      //   break
      // case '3': // 供应商
      //   this.custList = [
      //     { name: '聚货通', id: '0' },
      //     { name: '直客', id: '3' },
      //     { name: '同行', id: '4' }
      //   ]
      //   break
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

.input-content {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.input-unit {
  width: 50px;
  height: 28px;
  background-color: #f5f7fa;
  color: #909399;
  padding: 0 10px;
  border: 1px solid #dcdfe6;
  border-left: 0;
  border-radius: 0 4px 4px 0;
  margin-left: -1px;
}
.input-border {
  ::v-deep .el-input__inner {
    border-radius: 4px 0 0 4px;
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
