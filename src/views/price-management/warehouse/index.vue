<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <app-slide
      width="400"
      :is-active="isActive"
      style="margin: 15px 0 15px 15px;padding: 0;"
    >
      <div style="padding: 20px;">
        <el-row>
          <el-col
            :span="12"
            style="line-height: 32px;"
          >
            仓储报价
          </el-col>
          <el-col
            :span="12"
            style="text-align: right;"
          >
            <el-button
              v-permission="['warehousQuoteAdd']"
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
                v-model="searchForm.warehouseId"
                :loading="selectLoading"
                size="mini"
                clearable
                filterable
                placeholder="仓库"
                style="width: 100%;"
                @focus="getServiceList('sea')"
                @change="getTableData"
              >
                <el-option
                  v-for="item in serviceList1"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-select
                v-model="searchForm.auditing"
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
              <el-select
                v-model="searchForm.ifStandard"
                size="mini"
                clearable
                filterable
                placeholder="报价标准"
                style="width: 100%;"
                @change="getTableData"
              >
                <el-option
                  label="标准"
                  :value="true"
                />
                <el-option
                  label="特殊"
                  :value="false"
                />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-popover
                v-model="popoverShow"
                placement="bottom-start"
                trigger="click"
              >
                <div style="padding: 8px 15px 0 0;">
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
                    <el-button @click="handleClear">
                      清空
                    </el-button>
                    <el-button
                      v-permission="['warehousQuoteQuery']"
                      type="primary"
                      @click="handleConfirm"
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
                <el-row style="padding-bottom: 10px;">
                  <el-col :span="1">
                    <el-tooltip
                      v-if="item.auditing === 1"
                      effect="dark"
                      content="待审核"
                      placement="top"
                    >
                      <i
                        class="card-tips card-tip-zero"
                      />
                    </el-tooltip>
                    <el-tooltip
                      v-if="item.auditing === 4"
                      effect="dark"
                      content="已通过"
                      placement="top"
                    >
                      <i
                        class="card-tips card-tip-one"
                      />
                    </el-tooltip>
                    <el-tooltip
                      v-if="item.auditing === 3"
                      effect="dark"
                      content="已拒绝"
                      placement="top"
                    >
                      <i
                        class="card-tips card-tip-two"
                      />
                    </el-tooltip>
                    <el-tooltip
                      v-if="item.auditing === 2"
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
                    {{ item.warehouseName }}
                  </el-col>
                  <el-col
                    :span="4"
                    style="text-align: right;"
                  >
                    {{ item.ifStandard ? '标准报价' : '特殊报价' }}
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">
                    <span
                      v-if="item.effective === 1"
                      class="btn-tip-blue"
                    >待生效</span>
                    <span
                      v-else-if="item.effective === 2"
                      class="btn-tip-green"
                    >生效中</span>
                    <span
                      v-else-if="item.effective === 3"
                      class="btn-tip-grey"
                    >已失效</span>
                  </el-col>
                  <el-col
                    :span="16"
                    style="line-height: 16px;"
                  >
                    {{ formatTime(item) }}
                  </el-col>
                  <el-col
                    :span="4"
                    style="text-align: right;"
                  >
                    <span v-if="item.toCustType === '2'">代理商价</span>
                    <span v-else-if="item.toCustType === '1' && item.toCustSubtype === '0'">直客价</span>
                    <span v-else-if="item.toCustType === '1' && item.toCustSubtype === '1'">同行价</span>
                    <span v-else-if="item.toCustType === '0'">聚货通价</span>
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
                prop="warehouseId"
                label-width="75px"
              >
                <span slot="label">仓库</span>
                <el-tooltip
                  v-show="selectForm.warehouseId"
                  slot="label"
                  :content="selectForm.warehouseName"
                  placement="top"
                  effect="light"
                >
                  <i class="el-icon-warning-outline" />
                </el-tooltip>
                <el-select
                  v-model="selectForm.warehouseId"
                  :loading="selectLoading"
                  :disabled="isEdit || !isAdd"
                  style="width:90px;"
                  clearable
                  filterable
                  placeholder="请选择"
                  @focus="getServiceList('sel')"
                  @change="onService"
                >
                  <el-option
                    v-for="item in serviceList2"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>

              <el-form-item
                v-if="custType === '2'"
                label="参考报价"
                prop="refId"
              >
                <el-select
                  v-model="selectForm.refId"
                  :loading="selectLoading"
                  :disabled="isEdit || !isAdd || !selectForm.warehouseId"
                  size="mini"
                  clearable
                  filterable
                  placeholder="请选择"
                  style="width:170px;"
                  @focus="getEffectiveBook"
                  @change="onEffect"
                >
                  <el-option
                    v-for="(item, index) in effectList"
                    :key="index"
                    :label="`${dayjs(item.startTime).format('YYYY-MM-DD')}-${dayjs(item.endTime).format('YYYY-MM-DD')}`"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>

              <el-form-item
                label="报价对象"
                prop="toCustSubtype"
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
                  v-model="selectForm.toCustSubtype"
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
              :span="6"
              style="text-align: right;"
            >
              <template v-if="!isHistory">
                <el-button
                  v-if="(!isEdit && !isAdd && (selectForm.auditing === 1 || selectForm.auditing === 3)) && $checkPermission(['warehousQuoteEdit'])"
                  type="text"
                  size="small"
                  :style=" selectForm.auditing === 4 ? 'margin-right: 10px;' : ''"
                  @click="editRow"
                >
                  编辑
                </el-button>
                <el-popover
                  v-show="!isEdit && !isAdd && selectForm.auditing !== 4 && $checkPermission(['warehousQuoteAudit'])"
                  v-model="auditShow"
                  placement="bottom"
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
                        prop="auditing"
                        label-width="110px"
                      >
                        <el-radio-group v-model="auditForm.auditing">
                          <el-radio :label="4">
                            通过
                          </el-radio>
                          <el-radio :label="3">
                            拒绝
                          </el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item
                        v-if="auditForm.auditing === 3"
                        label="拒绝原因："
                        prop="reason"
                      >
                        <el-input
                          v-model="auditForm.reason"
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
                    style="margin: 0 10px;"
                  >
                    审核
                  </el-button>
                </el-popover>
                <el-button
                  v-if="(isAdd || isEdit) && $checkPermission(['warehousQuoteAdd', 'warehousQuoteEdit'])"
                  type="text"
                  size="small"
                  style="padding-right: 10px;"
                  @click="cancelRow"
                >
                  取消
                </el-button>
                <el-button
                  v-if="(isAdd || isEdit) && $checkPermission(['warehousQuoteAdd', 'warehousQuoteEdit'])"
                  type="text"
                  size="small"
                  @click="saveRow"
                >
                  保存
                </el-button>
                <el-button
                  v-if="!isAdd && !isEdit && (selectForm.auditing === 1 || selectForm.auditing === 3) && $checkPermission(['warehousQuoteDel'])"
                  type="text"
                  size="small"
                  @click="deleteRow(1)"
                >
                  删除
                </el-button>
              </template>
              <template v-if="!isEdit && !isAdd">
                <el-button
                  v-if="$checkPermission(['warehousQuoteCopy'])"
                  type="text"
                  size="small"
                  style="margin-left: 10px"
                  @click="copyPrice"
                >
                  复制此版本
                </el-button>
                <el-button
                  v-if="selectForm.auditing === 4 && !historyId"
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
              <span v-if="selectForm.currencyId">
                {{ selectForm.currencyId }}
              </span>
            </el-form-item>
          </div>

          <el-row>
            <el-col :span="21">
              <el-form-item
                v-if="custType === '0' || custType === '2' || (custType === '3' && ['0', '1'].includes(selectForm.toCustSubtype))"
                label="价格标准"
                prop="mode"
              >
                <el-radio-group
                  v-model="selectForm.ifStandard"
                  :disabled="!isEdit && !isAdd"
                  @change="onMode"
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
                v-if="(custType === '0' || custType === '2' || (custType === '3' && ['0', '1'].includes(selectForm.toCustSubtype))) && !selectForm.ifStandard"
                :label="isLabelValue"
                class="is-required"
                label-width="110px"
              >
                <el-button
                  type="text"
                  size="mini"
                  @click="onCompany"
                >
                  已选择({{ (selectForm.associatedAgents || []).length }})
                </el-button>
              </el-form-item>
              <el-form-item
                v-if="!selectForm.ifStandard"
                label="有效时间"
                prop="refStandard"
              >
                <el-select
                  v-model="selectForm.refStandard"
                  :loading="selectLoading"
                  :disabled="!isEdit && !isAdd"
                  style="width:180px;"
                  clearable
                  filterable
                  placeholder="请选择"
                  @focus="getTimeList"
                >
                  <el-option
                    v-for="item in timeList"
                    :key="item.id"
                    :label="`${dayjs(item.startTime).format('YYYY-MM-DD')}-${dayjs(item.endTime).format('YYYY-MM-DD')}`"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="selectForm.ifStandard"
                label="有效时间"
                label-width="90px"
                prop="times"
              >
                <el-date-picker
                  v-model="selectForm.times"
                  :disabled="!isEdit && !isAdd"
                  :clearable="false"
                  :picker-options="pickerOptions"
                  unlink-panels
                  type="daterange"
                  align="left"
                  size="mini"
                  value-format="yyyy-MM-dd"
                  range-separator="~"
                  style="width:240px;margin-right: 20px;"
                  start-placeholder="起始时间"
                  end-placeholder="截止时间"
                />
              </el-form-item>
              <!-- <el-form-item
                label="单票最低收费"
                label-width="110px"
                prop="floorPrice"
              >
                <el-input-number
                  v-model="selectForm.floorPrice"
                  :disabled="!isEdit && !isAdd"
                  class="input-number-valiate"
                  :controls="false"
                  placeholder="请输入"
                  :min="0"
                  :max="999999"
                  :precision="2"
                />
              </el-form-item> -->
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
                  :label="`${dayjs(item.startTime).format('YYYY-MM-DD')}-${dayjs(item.endTime).format('YYYY-MM-DD')}`"
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
          <div v-if="!isEdit && !isAdd && selectForm.auditing === 3">
            <el-form-item
              label="拒绝原因："
              label-width="90px"
              style="width: 100%;"
            >
              {{ selectForm.reason }}
            </el-form-item>
          </div>
        </el-form>
        <div v-show="isTableShow">
          <el-row :gutter="20">
            <el-col
              v-if="custType === '2'"
              :span="12"
            >
              <div class="table-header-title">
                参考价
              </div>
              <el-table
                ref="priceTable"
                :data="tableUpper"
                :span-method="tableUpperSpanMethod"
                height="calc(100vh - 360px)"
                style="width: 100%;"
                border
              >
                <el-table-column
                  prop="name"
                  width="150"
                  show-overflow-tooltip
                  label="收费项目"
                />
                <el-table-column
                  prop="type"
                  width="100"
                  label="计费方式"
                >
                  <template slot-scope="scope">
                    {{ formatType(scope.row.type) }}
                  </template>
                </el-table-column>
                <el-table-column
                  width="150"
                  label="计费配置"
                  show-overflow-tooltip
                >
                  <div
                    slot-scope="scope"
                    style="height: 32px;line-height: 32px"
                  >
                    <span v-if="scope.row.type === 5 || scope.row.type === 6">{{ scope.row.cellName }}</span>
                    <span v-else-if="scope.row.min && scope.row.max">{{ scope.row.min + '-' + scope.row.max }}</span>
                    <span v-else>单位单价</span>
                  </div>
                </el-table-column>
                <el-table-column
                  prop="price"
                  label="价格"
                />
                <el-table-column
                  min-width="120"
                  label="备注"
                  prop="remark"
                />
              </el-table>
            </el-col>
            <el-col :span="custType === '2' ? 12 : 24">
              <div class="table-header-title">
                标准价
              </div>
              <el-table
                ref="priceTable"
                :data="tableData"
                :span-method="tableDataSpanMethod"
                height="calc(100vh - 360px)"
                style="width: 100%;"
                border
              >
                <el-table-column
                  prop="name"
                  width="150"
                  label="收费项目"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="type"
                  width="100"
                  label="计费方式"
                >
                  <template slot-scope="scope">
                    {{ formatType(scope.row.type) }}
                  </template>
                </el-table-column>
                <el-table-column
                  width="150"
                  label="计费配置"
                  show-overflow-tooltip
                >
                  <div
                    slot-scope="scope"
                    style="height: 32px;line-height: 32px"
                  >
                    <span v-if="scope.row.type === 5 || scope.row.type === 6">{{ scope.row.cellName }}</span>
                    <span v-else-if="scope.row.min && scope.row.max">{{ scope.row.min + '-' + scope.row.max }}</span>
                    <span v-else>单位单价</span>
                  </div>
                </el-table-column>
                <el-table-column label="价格">
                  <template slot-scope="scope">
                    <div>
                      <el-input-number
                        v-if="(isEdit || isAdd) && !((scope.row.type === 5 || scope.row.type === 6) && !scope.row.cellValue) "
                        v-model="scope.row.price"
                        class="input-number-valiate"
                        size="small"
                        :controls="false"
                        placeholder="请输入"
                        :min="0"
                        :max="999999"
                        :precision="2"
                      />
                      <span v-else>{{ scope.row.price }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="最低收费">
                  <template slot-scope="scope">
                    <div>
                      <el-input-number
                        v-if="(isEdit || isAdd) && !((scope.row.type === 5 || scope.row.type === 6) && !scope.row.cellValue) "
                        v-model="scope.row.minCharge"
                        class="input-number-valiate"
                        size="small"
                        :controls="false"
                        placeholder="请输入"
                        :min="0"
                        :max="999999"
                        :precision="2"
                      />
                      <span v-else>{{ scope.row.minCharge }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  min-width="120"
                  label="备注"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-if="(isEdit || isAdd) && !((scope.row.type === 5 || scope.row.type === 6) && !scope.row.cellValue) "
                      v-model="scope.row.remark"
                      placeholder="请输入"
                      :maxlength="100"
                      size="small"
                    />
                    <span v-else>{{ scope.row.remark }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

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
          v-if="!isHistory || selectForm.auditing !== 4"
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
        v-show="showAgentPriceModel && isRightShow && custType === '0' && $checkPermission(['warehousQuoteQuotation'])"
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
        v-permission="['warehousQuoteCopy']"
        class="contextmenu-item"
        @click="onRow(showMenuRow, true)"
      >
        复制
      </li>
      <li
        v-permission="['warehousQuoteGet']"
        class="contextmenu-item"
        @click="onRow(showMenuRow)"
      >
        查看
      </li>
      <li
        v-if="showMenuRow.auditing === 1 && $checkPermission(['warehousQuoteDel'])"
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
  getWarehouseList,
  getHistoryPrice,
  getEffectiveBook,
  getPriceList,
  getWarehouseServer,
  getPriceConfig,
  getPriceById,
  addPrice,
  savePrice,
  checkPrice,
  deletePrice,
  invalidPrice,
  getStandardPeriod,
  getWarehouseId
} from '@/api/price-to-warehouse'
import dayjs from 'dayjs'
import { getCustTypeList } from '@/api/price-to-car'
import AgentPrice from '@/views/price-management/warehouse/components/agentPrice.vue'

function paramsForm() {
  return {
    id: undefined,
    warehouseId: undefined,
    warehouseName: undefined,
    refStandard: undefined,
    auditing: undefined,
    reason: undefined,
    refId: undefined,
    // floorPrice: undefined,
    countryId: undefined,
    toCustSubtype: undefined,
    toCustType: undefined,
    umWeight: undefined,
    umLength: undefined,
    currencyId: undefined,
    associatedAgents: [],
    ifStandard: true,
    times: [],
    country: {}
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
  private dayjs: any = dayjs
  private searchForm: any = {
    warehouseId: undefined,
    auditing: undefined,
    ifStandard: undefined,
    times: []
  }
  private selectForm: any = paramsForm()
  private auditForm: any = {
    auditing: undefined,
    reason: undefined
  }
  private auditRules = {
    auditing: [{ required: true, message: '请选择审核状态', trigger: 'change' }]
  }
  private formRules = {
    warehouseId: [{ required: true, message: '请选择仓库', trigger: 'change' }],
    toCustSubtype: [{ message: '请选择报价对象', trigger: 'change' }],
    refId: [{ required: true, message: '请选择参考报价', trigger: 'change' }],
    ifStandard: [{ required: true, message: '请选择价格标准', trigger: 'change' }],
    times: [{ required: true, message: '请选择有效时间', trigger: 'change' }],
    refStandard: [{ required: true, message: '请选择有效时间', trigger: 'change' }]
    // floorPrice: [{ required: true, message: '单票最低收费不能为空', trigger: 'change' }]
  }

  private isActive: boolean = true
  private showAgentPriceModel: boolean = true
  private popoverShow: boolean = false
  private selectLoading: boolean = false
  private formLoading: boolean = false
  private cardLoading: boolean = false
  private checkAll: boolean = false
  private isEdit: boolean = false
  private isAdd: boolean = false
  private dialogCompany: boolean = false
  private title = ''
  private currentId = ''
  private currentWhId = ''
  private currentRefId = ''
  private isTableShow: boolean = false
  private isRightShow: boolean = false
  private isHistory: boolean = false
  private auditShow: boolean = false
  private batchShow: boolean = false
  private batchNum: any = ''
  private options: any[] = []
  private copyTable: any[] = []
  private serviceTypeList: any[] = []
  private companyList: any[] = []
  private auditList: any[] = [
    { name: '待审核', id: 1 },
    { name: '已通过', id: 4 },
    { name: '已拒绝', id: 3 },
    { name: '审核中', id: 2 }
  ]
  private settlementList: any[] = [
    {
      id: 0,
      name: '按重量'
    },
    {
      id: 1,
      name: '按体积'
    },
    {
      id: 2,
      name: '按金额'
    },
    {
      id: 3,
      name: '按票'
    },
    {
      id: 4,
      name: '按箱'
    },
    {
      id: 5,
      name: '按车'
    },
    {
      id: 6,
      name: '按柜'
    },
    {
      id: 7,
      name: '按里程'
    },
    {
      id: 8,
      name: '按时间'
    },
    {
      id: 9,
      name: '按托'
    },
    {
      id: 'A',
      name: '按个数'
    }
  ]
  private effectList: any[] = []
  private custList: any[] = []
  private historyId: any = ''
  private historyList: any[] = []
  private serviceList1: any[] = []
  private serviceList2: any[] = []
  private timeList: any[] = []
  private tableData: any[] = []
  private spanArr1: any[] = []
  private spanArr2: any[] = []
  private divArr1: any[] = []
  private divArr2: any[] = []
  private spanNum1: number = 0
  private spanNum2: number = 0
  private divNum1: number = 0
  private divNum2: number = 0
  private cardList: any[] = []
  private tableUpper: any[] = []
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
        return time.getTime() <= Date.now()
      }
    }
  }
  get isLabelValue() {
    let name
    const type = (this as any).custType
    const form = (this as any).selectForm
    if (type === '0') {
      name = '关联代理商'
    } else if (type === '2') {
      name = form.toCustSubtype === '2' ? '关联代理商' : '关联客户'
    } else {
      name = '关联客户'
    }
    return name
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
  private async copyPrice() {
    let id = ''
    this.spanArr1 = []
    this.spanArr2 = []
    this.spanNum1 = 0
    this.spanNum2 = 0
    if (this.historyId) {
      id = this.historyId
      // 复制当前版本为历史版本
      this.historyList.map((it: any) => {
        if (this.historyId === it.id) {
          this.selectForm.refId = it.refId
        }
      })
      this.selectForm.warehouseId = this.currentWhId
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
    if (!(this as any).$checkPermission(['warehousQuoteCopy', 'warehousQuoteGet', 'warehousQuoteDel'])) return
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
    if (!this.selectForm.warehouseId) {
      this.$message.warning('请选择仓库')
      return
    }
    const agentPrice = this.$refs.AgentPrice as any
    const {
      country, fromCustSubtype, currencyId, fromCustType, toCustSubtype, toCustType, umLength, umWeight, warehouseId, ifStandard
    } = this.selectForm
    const params: any = {
      country,
      fromCustSubtype,
      currencyId,
      fromCustType,
      toCustSubtype,
      toCustType,
      umLength,
      umWeight,
      warehouseId,
      ifStandard
    }
    const service = this.serviceList2.find((e: any) => e.id === this.selectForm.warehouseId)
    if (service) {
      agentPrice.show(service, params)
      this.showAgentPriceModel = false
    } else {
      this.$message.warning('请选择仓库')
    }
  }
  private formatTime(obj: any) {
    const start = (obj || {}).startTime
    const end = (obj || {}).endTime
    if (!start || !end) {
      return ''
    } else {
      return dayjs(start).format('YYYY-MM-DD') + '-' + dayjs(end).format('YYYY-MM-DD')
    }
  }
  private formatType(val: any) {
    const item = this.settlementList.find((it: any) => it.id === val) || {}
    return item.name || ''
  }
  private toggle() {
    this.isActive = !this.isActive
  }
  private handleClear() {
    this.searchForm.times = []
  }
  private handleConfirm(val: any) {
    this.popoverShow = false
    this.getTableData()
  }
  private getTableData() {
    this.cardLoading = true
    const { times, ...form } = this.searchForm
    const params: any = {
      model: {
        ...form,
        startTime: Array.isArray(times) && times.length > 0 ? times[0] : undefined,
        endTime: Array.isArray(times) && times.length > 0 ? times[1] : undefined
      },
      page: this.page,
      size: this.size
    }
    getPriceList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.cardList = data.result || []
        this.total = data.total
        this.resetForm()
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

  // 合并data
  private getSpanArr(data: any) {
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        this.spanArr1.push(1)
        this.spanNum1 = 0

        this.spanArr2.push(1)
        this.spanNum2 = 0
      } else {
        // 判断当前元素与上一个元素是否相同
        if (data[i].name === data[i - 1].name) {
          this.spanArr1[this.spanNum1] += 1
          this.spanArr1.push(0)

          if (data[i].type === data[i - 1].type) {
            this.spanArr2[this.spanNum2] += 1
            this.spanArr2.push(0)
          }
        } else {
          this.spanArr1.push(1)
          this.spanNum1 = i

          this.spanArr2.push(1)
          this.spanNum2 = i
        }
      }
    }
  }
  // 合并upper
  private getDivArr(data: any) {
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        this.divArr1.push(1)
        this.divNum1 = 0

        this.divArr2.push(1)
        this.divNum2 = 0
      } else {
        // 判断当前元素与上一个元素是否相同
        if (data[i].name === data[i - 1].name) {
          this.divArr1[this.divNum1] += 1
          this.divArr1.push(0)

          if (data[i].type === data[i - 1].type) {
            this.divArr2[this.divNum2] += 1
            this.divArr2.push(0)
          }
        } else {
          this.divArr1.push(1)
          this.divNum1 = i

          this.divArr2.push(1)
          this.divNum2 = i
        }
      }
    }
  }

  private tableDataSpanMethod({ row, column, rowIndex, columnIndex }: any) {
    if (columnIndex === 0) {
      const _row = this.spanArr1[rowIndex]
      const _col = _row > 0 ? 1 : 0
      return {
        rowspan: _row,
        colspan: _col
      }
    }
    if (columnIndex === 1) {
      const _row = this.spanArr2[rowIndex]
      const _col = _row > 0 ? 1 : 0
      return {
        rowspan: _row,
        colspan: _col
      }
    }
  }
  private tableUpperSpanMethod({ row, column, rowIndex, columnIndex }: any) {
    if (columnIndex === 0) {
      const _row = this.divArr1[rowIndex]
      const _col = _row > 0 ? 1 : 0
      return {
        rowspan: _row,
        colspan: _col
      }
    }
    if (columnIndex === 1) {
      const _row = this.divArr2[rowIndex]
      const _col = _row > 0 ? 1 : 0
      return {
        rowspan: _row,
        colspan: _col
      }
    }
  }
  private async onRow(item: any, isCopy?: boolean) {
    if (!(this as any).$checkPermission(['warehousQuoteCopy', 'warehousQuoteGet'])) return
    // 查看
    if (this.formLoading) return
    this.resetForm()
    this.isRightShow = true
    this.currentId = item.id
    this.currentWhId = item.warehouseId
    this.currentRefId = item.refId
    this.selectForm.warehouseId = item.warehouseId
    this.selectForm.refId = item.refId
    this.formLoading = true
    await this.getEffectiveBook()
    const eff = this.effectList.find((it: any) => this.selectForm.refId === it.id)
    if (eff) {
      const arr = eff.priceList || []
      this.tableUpper = arr
      this.getDivArr(this.tableUpper)
    } else {
      if (item.refId) {
        const res = await getPriceById({ id: item.refId })
        const data = res.data || {}
        const arr = data.priceList || []
        this.tableUpper = arr
        this.getDivArr(this.tableUpper)
      }
    }
    await this.getRowDetail(this.currentId, isCopy)
  }
  private async getRowDetail(id: string, isCopy?: boolean) {
    this.formLoading = true
    try {
      const res = await getPriceById({ id })
      const data = res.data || {}
      const { priceList, refId, endTime, startTime, ...form } = data
      this.selectForm = {
        ...form,
        refId
      }
      if (startTime && endTime && !isCopy) {
        const start = dayjs(startTime).format('YYYY-MM-DD')
        const end = dayjs(endTime).format('YYYY-MM-DD')
        this.$set(this.selectForm, 'times', [start, end])
      }
      this.tableData = priceList.map((item: any) => {
        item.price = item.price || undefined
        item.minCharge = item.minCharge || undefined
        return item
      })
      this.copyTable = JSON.parse(JSON.stringify(this.tableData))
      this.getSpanArr(this.tableData)
      this.getServiceList('sel')
      this.getTimeList()
      if (isCopy) {
        this.selectForm.auditing = undefined
        this.selectForm.id = undefined
        this.selectForm.status = undefined
        this.selectForm.refId = undefined
        this.isAdd = true
        this.isEdit = false
        this.currentId = ''
        this.historyId = ''
        this.isHistory = false
        this.tableUpper = []
        this.getDivArr(this.tableUpper)
      } else {
        this.isAdd = false
        this.isEdit = false
      }
      this.isTableShow = true
      this.formLoading = false
      this.serviceTypeList = data.serviceTypeList
      if (this.custType === '0' && !this.showAgentPriceModel) {
        this.showAgentPrice()
      }
      if (!this.selectForm.ifStandard) this.getCustTypeList()
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
    const { auditing, reason } = this.selectForm
    this.auditForm = {
      auditing: 4,
      reason
    }
  }
  private onHide() {
    this.auditForm = {
      auditing: undefined,
      reason: undefined
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
  private batchConfirm(type: any) {
    this.batchShow = false
    this.tableData = this.tableData.map((it: any, index: number) => {
      const superPrice = this.tableUpper[index]
      if (type === 1 && superPrice && superPrice.price) {
        it.price = parseFloat((superPrice.price + this.batchNum).toFixed(2))
      } else {
        it.price = undefined
      }
      // it.prices.map((p: any) => {
      //   if (p.price) p.price += this.batchNum
      //   return p
      // })
      return it
    })
  }

  private auditingRow() {
    const { auditing } = this.selectForm
    if (auditing === 1) {
      const params = {
        id: this.currentId,
        tag: 2,
        reason: ''
      }
      checkPrice(params).then((res: any) => {
        this.cardList.map((it: any) => {
          if (it.id === this.currentId) {
            it.auditing = 2
            this.selectForm.auditing = 2
          }
        })
      }).catch((err: any) => err)
    }
  }
  private auditRow() {
    this.formLoading = true
    const params = {
      tag: this.auditForm.auditing,
      id: this.currentId,
      reason: this.auditForm.reason
    }
    checkPrice(params).then((res: any) => {
      this.auditShow = false
      this.getTableData()
      this.resetForm()
      this.formLoading = false
      const agentPrice = this.$refs.AgentPrice as any
      agentPrice.close()
    }).catch((err: any) => {
      this.formLoading = false
      return err
    })
  }
  private cancelRow() {
    this.isEdit = false
    if (this.isAdd) {
      this.resetForm()
      const agentPrice = this.$refs.AgentPrice as any
      agentPrice.close()
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
      if (this.tableData.length <= 0) {
        this.$message.error('暂未配置，无法报价')
        return
      }
      const isPrice = this.tableData.every((it: any) => !it.price)
      if (isPrice) {
        this.$message.error('请至少填写一条报价')
        return
      }
      const {
        times, refId, ifStandard, toCustSubtype, refStandard, associatedAgents, ...form
      } = this.selectForm
      if (!ifStandard && Array.isArray(associatedAgents) && associatedAgents.length <= 0) {
        this.$message.error('请选择关联代理商')
        return
      }

      const params: any = {
        ...form,
        ifStandard,
        refStandard,
        toCustSubtype,
        refId: refId || (this as any).custId,
        associatedAgents,
        serviceTypeList: this.serviceTypeList,
        priceList: this.tableData
      }
      if (ifStandard) {
        params.startTime = Array.isArray(times) && times.length > 0 ? dayjs(times[0]).format('YYYY-MM-DD') + ' 00:00:00' : undefined
        params.endTime = Array.isArray(times) && times.length > 0 ? dayjs(times[1]).format('YYYY-MM-DD') + ' 23:59:59' : undefined
      } else {
        this.timeList.map((it: any) => {
          if (refStandard === it.id) {
            params.startTime = it.startTime
            params.endTime = it.endTime
          }
        })
      }
      const type = (this as any).custType
      if (type === '0') {
        params.toCustType = '2'
      } else if (type === '2') {
        params.toCustType = toCustSubtype === '2' ? '2' : '1'
      } else if (type === '3') {
        if (this.selectForm.toCustSubtype === '-1') {
          params.toCustType = '0'
        } else {
          params.toCustType = '1'
        }
      }
      this.formLoading = true
      if (this.isEdit) {
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
      } else {
        addPrice(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '新增成功'
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
      }
    })
  }
  private resetForm() {
    this.selectForm = paramsForm()
    this.getCustId()
    this.currentId = ''
    this.currentWhId = ''
    this.currentRefId = ''
    this.historyId = ''
    this.isHistory = false
    this.isTableShow = false
    this.isRightShow = false
    this.isAdd = false
    this.isEdit = false
    this.spanArr1 = []
    this.spanArr2 = []
    this.divArr1 = []
    this.divArr2 = []
    this.spanNum1 = 0
    this.spanNum2 = 0
    this.divNum1 = 0
    this.divNum2 = 0
    this.tableData = []
    this.copyTable = []
    this.options = []
    this.$nextTick(() => {
      const root: any = this.$refs.editForm
      const priceTable: any = this.$refs.priceTable
      root.clearValidate()
      priceTable.doLayout()
    })
  }

  // 服务
  private getServiceList(val: any) {
    this.selectLoading = true
    getWarehouseList()
      .then((res: any) => {
        const data = res.data || []
        if (val === 'sea') {
          this.serviceList1 = data
        } else {
          const arr = data.filter((it: any) => it.status === '1')
          this.serviceList2 = arr || []
        }
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private async onService() {
    this.selectForm.warehouseName = undefined
    this.selectForm.umLength = undefined
    this.selectForm.umWeight = undefined
    this.selectForm.refId = undefined
    this.selectForm.country = {}
    this.effectList = []
    this.tableUpper = []
    this.isTableShow = false
    this.tableData = []
    this.copyTable = []
    this.spanArr1 = []
    this.spanArr2 = []
    this.divArr1 = []
    this.divArr2 = []
    this.spanNum1 = 0
    this.spanNum2 = 0
    this.divNum1 = 0
    this.divNum2 = 0
    this.serviceList2.map((it: any) => {
      if (it.id === this.selectForm.warehouseId) {
        this.selectForm.warehouseName = it.name
        this.getWarehouseData()
      }
    })
    await this.getPriceConfig()
    if (this.custType === '0' && !this.showAgentPriceModel) {
      this.showAgentPrice()
    }
  }

  private getWarehouseData() {
    getWarehouseId({
      id: this.selectForm.warehouseId
    }).then((res: any) => {
      const {
        unitOfLength,
        unitOfWeight,
        currencyId,
        cityId,
        cityName,
        countryId,
        countryName,
        stateId,
        stateName,
        countyId,
        countyName
      }: any = res.data || {}
      this.selectForm.umLength = unitOfLength
      this.selectForm.umWeight = unitOfWeight
      this.selectForm.currencyId = currencyId
      this.selectForm.country = {
        cityId,
        cityName,
        countryId,
        countryName,
        stateId,
        stateName,
        countyId,
        countyName
      }
    }).catch((err: any) => {
      return err
    })
  }

  private async onEffect() {
    this.divArr1 = []
    this.divArr2 = []
    this.divNum1 = 0
    this.divNum2 = 0
    if (this.selectForm.refId) {
      this.effectList.map((it: any) => {
        if (this.selectForm.refId === it.id) {
          const arr = it.priceList || []
          this.tableUpper = arr
          this.getDivArr(this.tableUpper)
        }
      })
    } else {
      this.tableUpper = []
    }
  }
  private async getEffectiveBook() {
    if (this.selectForm.warehouseId && (this as any).parentId) {
      this.selectLoading = true
      const {
        country, fromCustSubtype, currencyId, fromCustType, toCustSubtype, toCustType, umLength, umWeight, warehouseId, ifStandard
      } = this.selectForm
      const params: any = {
        // country,
        fromCustSubtype,
        currencyId,
        fromCustType,
        toCustSubtype,
        toCustType,
        umLength,
        umWeight,
        warehouseId,
        ifStandard
      }
      const type = (this as any).custType
      if (type === '0') {
        params.toCustType = '2'
      } else if (type === '2') {
        params.toCustType = toCustSubtype === '2' ? '2' : '1'
      } else if (type === '3') {
        // params.toCustType = '0'
        if (this.selectForm.toCustSubtype === '-1') {
          params.toCustType = '0'
        } else {
          params.toCustType = '1'
        }
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
    if (!this.selectForm.warehouseId) return
    try {
      this.formLoading = true
      const res = await getWarehouseServer({
        id: this.selectForm.warehouseId
      })
      const list = res.data || []
      this.serviceTypeList = list
      const resY = await getPriceConfig({
        serviceTypeId: '04',
        warehouseId: this.selectForm.warehouseId,
        list: list.length <= 0 ? [''] : list
      })
      const dataY = resY.data || []
      this.tableData = dataY.map((it: any) => {
        const { id, ...form } = it
        return {
          ...form,
          cid: id,
          price: undefined
        }
      })
      this.copyTable = JSON.parse(JSON.stringify(this.tableData))
      this.getSpanArr(this.tableData)
      this.isTableShow = true
      this.formLoading = false
    } catch (error) {
      this.formLoading = false
      return error
    }
  }

  private getTimeList(): void {
    this.selectLoading = true
    const {
      country, fromCustSubtype, currencyId, fromCustType, toCustSubtype, toCustType, umLength, umWeight, warehouseId
    } = this.selectForm
    const params: any = {
      country,
      fromCustSubtype,
      currencyId,
      fromCustType,
      toCustSubtype,
      toCustType,
      umLength,
      umWeight,
      warehouseId,
      ifStandard: true
    }
    const type = (this as any).custType
    if (type === '0') {
      params.toCustType = '2'
    } else if (type === '2') {
      params.toCustType = toCustSubtype === '2' ? '2' : '1'
    } else if (type === '3') {
      // params.toCustType = '0'
      if (this.selectForm.toCustSubtype === '-1') {
        params.toCustType = '0'
      } else {
        params.toCustType = '1'
      }
    }
    getStandardPeriod(params)
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

  private async onHistory() {
    this.spanArr1 = []
    this.spanArr2 = []
    this.spanNum1 = 0
    this.spanNum2 = 0
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
    this.selectForm.warehouseId = this.currentWhId
    await this.getEffectiveBook()
    this.effectList.map((it: any) => {
      if (this.selectForm.refId === it.id) {
        const arr = it.priceList || []
        this.tableUpper = arr
        this.getDivArr(this.tableUpper)
      }
    })
    await this.getRowDetail(paramsId)
  }

  private getHistoryPrice() {
    this.selectLoading = true
    const params: any = {
      id: this.currentId
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

  private onMode() {
    if (this.selectForm.mode === '0') {
      this.selectForm.associatedAgents = []
    }
    this.selectForm.refStandard = undefined
    this.selectForm.times = []
  }

  private onCompany() {
    if (['2', '3'].includes(this.custType) && !this.selectForm.toCustSubtype) {
      this.$message.warning('请选择报价对象')
      return
    }
    this.dialogCompany = true
    this.options = this.selectForm.associatedAgents
    this.getCustTypeList()
  }
  private cancelCompany() {
    this.dialogCompany = false
  }
  private saveCompany() {
    this.dialogCompany = false
    this.selectForm.associatedAgents = this.options
  }
  // 代理商
  private getCustTypeList() {
    let toCustType = ''
    let toCustSubtype = ''
    const category = this.selectForm.toCustSubtype
    if (this.custType === '3') {
      if (category === '0') {
        toCustType = '1'
        toCustSubtype = '0'
      } else if (category === '1') {
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
      if (category === '2') {
        toCustType = '2'
        toCustSubtype = '2'
      } else {
        toCustType = '1'
        toCustSubtype = category
      }
    }
    const params: any = {
      toCustSubtype,
      toCustType,
      subtypeId: this.serviceTypeList.join(','),
      typeId: '04'
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
      if (this.selectForm.auditing === 1) {
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
    this.selectForm.associatedAgents = []
    this.companyList = []
  }
  private getCustId() {
    const type = (this as any).custType
    const stype = (this as any).custSubtype
    switch (type) {
      case '0': // 聚货通
        this.selectForm.toCustSubtype = '1'
        break
      case '2': // 代理商
        if (stype === '1') { // 一级
          this.custList = [
            { name: '二级代理商', id: '2' },
            { name: '直客', id: '0' },
            { name: '同行', id: '1' }
          ]
        } else if (stype === '2') { // 二级
          this.custList = [
            { name: '直客', id: '0' },
            { name: '同行', id: '1' }
          ]
        }
        break
      case '3': // 供应商
        this.selectForm.toCustSubtype = ''
        this.custList = [
          { name: '聚货通', id: '-1' },
          { name: '直客', id: '0' },
          { name: '同行', id: '1' }
        ]
        break
      default:
        break
    }
  }
  private created() {
    const type = (this as any).custType
    const stype = (this as any).custSubtype
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
}
::v-deep .el-input__inner {
  padding-left: 8px;
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
  color: #409EFF;
  border: 1px solid #409EFF;
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
.table-header-title {
  border-width: 1px 1px 0 1px;
  border-style: solid;
  border-color: rgb(223, 230, 236);
  padding-left: 10px;
  line-height: 40px;
  height: 40px;
  background-color: #F4F4F4;
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
