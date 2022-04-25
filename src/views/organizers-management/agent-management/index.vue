<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info-with-back
          info=""
          title="代理商管理"
          :show-back="isMoreInfoShow"
          @goback="goBack"
        />
        <div
          v-show="!isMoreInfoShow"
          class="app-panel"
        >
          <el-row>
            <el-col :span="4">
              <el-button
                v-permission="['proxyAdd']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-left: 10px"
                @click="addAgent"
              >
                新增代理商
              </el-button>
            </el-col>

            <el-col
              :span="20"
              style="text-align:right;"
            >
              <el-select
                v-model="searchForm.types"
                placeholder="服务大类"
                clearable
                filterable
                style="width:130px;margin-right:5px;"
                size="small"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="searchForm.subTypes"
                placeholder="业务类型"
                clearable
                filterable
                style="width:130px;margin-right:5px;"
                size="small"
              >
                <el-option
                  v-for="item in subtypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="searchForm.countryId"
                placeholder="所在国家"
                clearable
                filterable
                style="width:130px;margin-right:5px;"
                size="small"
                @change="onCountryChange(1)"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>

              <el-select
                v-model="searchForm.stateId"
                :loading="selectLoading"
                :disabled="!searchForm.countryId"
                placeholder="州/省"
                clearable
                filterable
                size="small"
                style="width:130px;margin-right:5px;"
                @focus="getStateList(1)"
                @change="onStateChange(1)"
              >
                <el-option
                  v-for="item in stateList1"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="searchForm.cityId"
                :loading="selectLoading"
                :disabled="!searchForm.stateId"
                placeholder="城市"
                clearable
                size="small"
                filterable
                style="width:130px;margin-right:5px;"
                @focus="getCityList(1)"
                @change="onCityChange(1)"
              >
                <el-option
                  v-for="item in cityList1"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
              <!-- <el-select
                v-model="searchForm.countyId"
                :loading="selectLoading"
                :disabled="!searchForm.cityId"
                placeholder="区/县"
                clearable
                size="small"
                filterable
                style="width:130px;margin-right:5px;"
                @focus="getCountyList(1)"
              >
                <el-option
                  v-for="item in countyList1"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select> -->

              <el-select
                v-model="searchForm.status"
                placeholder="启用状态"
                clearable
                style="width:130px;margin-right:5px;"
                size="small"
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>

              <el-input
                v-model="searchForm.name"
                size="small"
                placeholder="请输入企业名称"
                style="width:150px;margin-right:10px;"
              />

              <el-button
                v-permission="['queryProxyOrder']"
                type="primary"
                size="small"
                @click="queryAll(1)"
              >
                查询
              </el-button>
            </el-col>
          </el-row>

          <el-table
            v-loading="loading"
            :data="list"
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              label="公司名称"
              prop="name"
              min-width="200"
            />
            <el-table-column
              label="国家/地区"
              width="180"
              prop="countryName"
              show-overflow-tooltip
            />
            <el-table-column
              label="州省市区"
              width="250"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span v-show="!!scope.row.stateName">
                  {{ scope.row.stateName }}
                </span>
                <span v-show="!!scope.row.cityName">
                  > {{ scope.row.cityName }}
                </span>
                <span v-show="!!scope.row.countyName">
                  > {{ scope.row.countyName }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              label="所属上级"
              prop="parentName"
              width="200"
              show-overflow-tooltip
            />

            <el-table-column
              label="添加时间"
              width="180"
              prop="createTime"
            />

            <el-table-column
              label="关联人员"
              width="100"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="!$checkPermission(['associatedPersonProxy'])"
                  type="text"
                  size="medium"
                  @click="AssociatedPeson(scope.row)"
                >
                  关联人员
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              v-if="custId === '0' || custId === 0"
              label="开通服务"
              width="100"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="!$checkPermission(['subscribeProxyService'])"
                  type="text"
                  size="medium"
                  @click="handleServiceSet(scope.row)"
                >
                  开通服务
                </el-button>
              </template>
            </el-table-column>

            <el-table-column
              label="状态"
              width="100"
            >
              <template slot-scope="scope">
                <el-switch
                  :disabled="!$checkPermission(['proxyEnableDisable'])"
                  class="switchStyle"
                  active-text="启用"
                  inactive-text="禁用"
                  :value="scope.row.status"
                  active-value="1"
                  inactive-value="0"
                  @input="(value) => onStatus(scope.row, value)"
                />
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
              width="180"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['updateProxy']"
                  type="text"
                  size="medium"
                  @click="edit(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['deleteProxy']"
                  type="text"
                  size="medium"
                  @click="deleteAgent(scope.row.id)"
                >
                  删除
                </el-button>
                <el-button
                  v-permission="['moreProxyPermissionst']"
                  type="text"
                  size="medium"
                  @click="handleMore(scope.row)"
                >
                  更多
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            layout="total, prev, pager, next"
            style="text-align: right;"
            :current-page.sync="page"
            :page-size="size"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />

          <el-dialog
            :title="isEdit ? '编辑代理商' : '新增代理商'"
            width="1200px"
            class="addEditForm"
            :visible.sync="dialogShow"
            :close-on-click-modal="false"
            @close="close"
          >
            <div v-loading="dialogLoading">
              <el-form
                ref="theForm"
                :rules="formRules"
                :model="form"
                label-width="120px"
                label-position="right"
                class="agent-form"
                size="small"
              >
                <el-form-item
                  prop="abbr"
                  label="公司简称"
                >
                  <el-input
                    ref="firstInput"
                    v-model="form.abbr"
                    style="width: 100%"
                    size="small"
                    :maxlength="10"
                    show-word-limit
                  />
                </el-form-item>

                <el-form-item
                  label="上级公司"
                  class="is-required"
                >
                  <el-input
                    v-model="inputName"
                    placeholder="请输入"
                    disabled
                    style="width: 100%"
                    size="small"
                  />
                </el-form-item>

                <el-form-item
                  prop="alias"
                  label="英文名称"
                >
                  <el-input
                    v-model="form.alias"
                    style="width: 100%"
                    size="small"
                    :maxlength="50"
                  />
                </el-form-item>

                <el-form-item
                  prop="datarange"
                  label="合作期限"
                >
                  <el-date-picker
                    v-model="form.datarange"
                    unlink-panels
                    type="daterange"
                    range-separator="~"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    size="small"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item
                  v-if="custId === '0'"
                  label="是否请款"
                  prop="request"
                >
                  <el-radio-group v-model="form.request">
                    <el-radio :label="false">
                      否
                    </el-radio>
                    <el-radio :label="true">
                      是
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  label="是否提货"
                  prop="pick"
                >
                  <el-radio-group v-model="form.pick">
                    <el-radio :label="false">
                      否
                    </el-radio>
                    <el-radio :label="true">
                      是
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  label="人工审核计量"
                  prop="ifMeasureReview"
                >
                  <el-radio-group v-model="form.ifMeasureReview">
                    <el-radio :label="0">
                      否
                    </el-radio>
                    <el-radio :label="1">
                      是
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  v-if="custType === '2' && custSubtype === '1'"
                  label="分公司"
                  prop="ifCustomer"
                >
                  <el-radio-group
                    v-model="form.ifCustomer"
                    @change=";(form.ifFinance = 0)"
                  >
                    <el-radio :label="0">
                      否
                    </el-radio>
                    <el-radio :label="1">
                      是
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  v-if="form.ifCustomer === 1"
                  label="独立管理财务"
                  prop="ifFinance"
                >
                  <el-radio-group v-model="form.ifFinance">
                    <el-radio :label="0">
                      否
                    </el-radio>
                    <el-radio :label="1">
                      是
                    </el-radio>
                  </el-radio-group>
                </el-form-item>

                <div class="form-line" />

                <el-form-item
                  prop="name"
                  label="公司名称"
                >
                  <el-input
                    v-model="form.name"
                    style="width: 100%"
                    size="small"
                    :maxlength="50"
                  />
                </el-form-item>

                <el-form-item
                  prop="licenseCode"
                  label="营业执照"
                >
                  <el-input
                    v-model="form.licenseCode"
                    style="width: 100%"
                    size="small"
                    :maxlength="20"
                  />
                </el-form-item>

                <el-form-item
                  prop="setupDate"
                  label="成立日期"
                >
                  <el-date-picker
                    v-model="form.setupDate"
                    :picker-options="pickerOptions"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    style="width: 100%"
                    size="small"
                  />
                </el-form-item>

                <el-form-item
                  prop="companySize"
                  label="公司规模"
                >
                  <el-input
                    v-model="form.companySize"
                    placeholder="请输入"
                    :maxlength="100"
                    @blur="companySizeBlur"
                  >
                    <span
                      slot="append"
                    >
                      人
                    </span>
                  </el-input>
                </el-form-item>

                <el-form-item
                  prop="registeredCapital"
                  label="注册资金"
                >
                  <el-input-number
                    v-model="form.registeredCapital"
                    class="input-number-valiate"
                    :controls="false"
                    placeholder="请输入"
                    :min="0"
                    :max="999999999999"
                    :precision="2"
                  />
                </el-form-item>

                <!--<el-form-item
                  prop="cooperationAmount"
                  label="合作金额"
                >
                  <el-input-number
                    v-model="form.cooperationAmount"
                    class="input-number-valiate"
                    :controls="false"
                    placeholder="请输入"
                    :min="0"
                    :max="999999999999"
                    :precision="2"
                  />
                </el-form-item>-->

                <!-- <el-form-item
                  prop="type"
                  label="客户属性"
                >
                  <el-select
                    v-model="form.type"
                    placeholder="请选择"
                    clearable
                    filterable
                    style="width:100%;"
                    size="small"
                  >
                    <el-option
                      label="一级代理商"
                      value="1"
                    />
                    <el-option
                      label="二级代理商"
                      value="2"
                    />
                  </el-select>
                </el-form-item> -->

                <el-form-item
                  prop="saleType"
                  label="销售类型"
                >
                  <el-select
                    v-model="form.saleType"
                    placeholder="请选择"
                    clearable
                    filterable
                    style="width:100%;"
                    size="small"
                  >
                    <el-option
                      label="平台"
                      value="1"
                    />
                    <el-option
                      label="线下"
                      value="2"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item
                  prop="platform"
                  label="平台"
                >
                  <el-select
                    v-model="form.platform"
                    :loading="selectLoading"
                    placeholder="请选择"
                    clearable
                    filterable
                    style="width:100%;"
                    size="small"
                    @focus="getPlatList"
                  >
                    <el-option
                      v-for="item in platList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item
                  prop="countryId"
                  label="国家/地区"
                >
                  <el-select
                    v-model="form.countryId"
                    placeholder="所在国家"
                    clearable
                    filterable
                    style="width:100%;"
                    size="small"
                    @change="onCountryChange(2)"
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
                    v-model="form.stateId"
                    :loading="selectLoading"
                    placeholder="请选择"
                    clearable
                    :disabled="!form.countryId"
                    filterable
                    style="width: 100%"
                    @focus="getStateList(2)"
                    @change="onStateChange(2)"
                  >
                    <el-option
                      v-for="item in stateList2"
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
                    v-model="form.cityId"
                    :loading="selectLoading"
                    placeholder="请选择"
                    clearable
                    :disabled="!form.stateId"
                    filterable
                    style="width: 100%"
                    @focus="getCityList(2)"
                    @change="onCityChange(2)"
                  >
                    <el-option
                      v-for="item in cityList2"
                      :key="item.id"
                      :label="`${item.name}-${item.alias}`"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="区/县"
                  prop="countyId"
                >
                  <el-select
                    v-model="form.countyId"
                    :loading="selectLoading"
                    placeholder="区/县"
                    clearable
                    :disabled="!form.cityId"
                    filterable
                    style="width:100%;"
                    @focus="getCountyList(2)"
                  >
                    <el-option
                      v-for="item in countyList2"
                      :key="item.id"
                      :label="`${item.name}-${item.alias}`"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item
                  prop="legal"
                  label="公司法人"
                >
                  <el-input
                    v-model="form.legal"
                    style="width: 100%"
                    size="small"
                    :maxlength="50"
                  />
                </el-form-item>

                <el-form-item
                  prop="certType"
                  label="证件类型"
                >
                  <el-select
                    v-model="form.certType"
                    placeholder="请选择"
                    clearable
                    filterable
                    style="width:100%;"
                    size="small"
                  >
                    <el-option
                      v-for="item in certTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item
                  prop="certNumber"
                  label="证件号码"
                >
                  <el-input
                    v-model="form.certNumber"
                    style="width: 100%"
                    size="small"
                    :maxlength="20"
                  />
                </el-form-item>
                <el-form-item
                  prop="licenseAddress"
                  label="证照地址"
                >
                  <el-input
                    v-model="form.licenseAddress"
                    style="width: 100%"
                    size="small"
                    :maxlength="100"
                  />
                </el-form-item>
                <el-form-item
                  prop="domain"
                  label="域名前缀"
                >
                  <el-input
                    v-model="form.domain"
                    style="width: 100%"
                    size="small"
                    :maxlength="8"
                    show-word-limit
                  />
                </el-form-item>
                <el-form-item
                  prop="markPrefix"
                  label="唛头前缀"
                >
                  <el-input
                    v-model="form.markPrefix"
                    style="width: 100%"
                    size="small"
                    :maxlength="4"
                    show-word-limit
                  />
                </el-form-item>

                <el-form-item
                  prop="printServer"
                  label="打印服务器路径"
                >
                  <el-input
                    v-model="form.printServer"
                    style="width: 100%"
                    size="small"
                    :maxlength="100"
                  />
                </el-form-item>

                <el-form-item
                  prop="storeLink"
                  label="店铺链接"
                >
                  <el-input
                    v-model="form.storeLink"
                    style="width: 100%"
                    size="small"
                    :maxlength="50"
                  />
                </el-form-item>

                <el-form-item
                  prop="brand"
                  label="品牌"
                >
                  <el-input
                    v-model="form.brand"
                    style="width: 100%"
                    size="small"
                    :maxlength="50"
                  />
                </el-form-item>

                <el-form-item
                  prop="trademark"
                  label="驰名商标"
                >
                  <el-input
                    v-model="form.trademark"
                    style="width: 100%"
                    size="small"
                    :maxlength="50"
                  />
                </el-form-item>
                <el-form-item
                  prop=""
                  label="客户编码"
                >
                  <el-input
                    v-model="form.custCode"
                    :disabled="isEdit && ifCode"
                    style="width: 100%"
                    size="small"
                    :maxlength="30"
                  />
                </el-form-item>
              </el-form>
              <div style="text-align: right;margin-top: 10px;">
                <el-button @click="close">
                  取 消
                </el-button>
                <el-button
                  type="primary"
                  @click="handleSubmit"
                >
                  确 定
                </el-button>
              </div>
            </div>
          </el-dialog>
          <el-dialog
            title="关联人员"
            :visible.sync="isRelatePersonShow"
            :close-on-click-modal="false"
            width="550px"
            :closed="close"
          >
            <div
              class="add-edit-truck"
              style="height:200px;overflow:auto;"
            >
              <el-form
                ref="relateForm"
                v-loading="isRelatePersonLoading"
                :model="relateForm"
                :rules="formRules"
                label-width="100px"
                label-position="right"
                style="width:100%;"
                size="small"
              >
                <el-form-item
                  prop="containerIdArr"
                  label="关联财务人员"
                >
                  <el-input
                    v-model="s"
                    :placeholder="`已选择(${relateForm.financialPerson.length})`"
                    style="width:100%"
                    disabled
                  >
                    <el-button
                      slot="append"
                      icon="el-icon-search"
                      @click="handleStates(1)"
                    />
                  </el-input>
                </el-form-item>
                <el-form-item
                  prop="containerIdArr"
                  label="关联运营客服"
                >
                  <el-input
                    v-model="s"
                    :placeholder="`已选择(${relateForm.customerPerson.length})`"
                    style="width:100%"
                    disabled
                  >
                    <el-button
                      slot="append"
                      icon="el-icon-search"
                      @click="handleStates(2)"
                    />
                  </el-input>
                </el-form-item>
              </el-form>
            </div>
            <div
              slot="footer"
              class="dialog-footer"
            >
              <el-button
                size="small"
                @click="closeRelateForm"
              >
                取 消
              </el-button>
              <el-button
                type="primary"
                size="small"
                @click="saveRelateConfirm"
              >
                确 定
              </el-button>
            </div>
          </el-dialog>
          <el-dialog
            title="关联财务人员"
            :visible.sync="isFinanceDialogShow"
            :close-on-click-modal="false"
            width="960px"
            @close="financeDialogClose"
          >
            <el-transfer
              ref="transferItem"
              v-model="relateForm.financialPerson"
              v-loading="isFinanceLoading"
              filterable
              :filter-method="filterMethod"
              :titles="['人员列表', '已选择']"
              :props="{key: 'id', label: 'label'}"
              filter-placeholder="输入搜索"
              :data="userList"
              style="height: 500px;"
            />
            <div
              slot="footer"
              style="text-align: right;margin: 0 40px 0;"
            >
              <el-button
                size="small"
                @click="financeDialogClose"
              >
                取 消
              </el-button>

              <el-button
                type="primary"
                size="small"
                @click="financeDialogClose"
              >
                确 定
              </el-button>
            </div>
          </el-dialog>
          <el-dialog
            title="关联运营客服"
            :visible.sync="isCustomerDialogShow"
            :close-on-click-modal="false"
            width="960px"
            @close="customerDialogClose"
          >
            <el-transfer
              ref="transferItem1"
              v-model="relateForm.customerPerson"
              v-loading="isCustomerLoading"
              filterable
              :filter-method="filterMethod"
              :titles="['人员列表', '已选择']"
              :props="{key: 'id', label: 'label'}"
              filter-placeholder="输入搜索"
              :data="userList"
              style="height: 500px;"
            />
            <div
              slot="footer"
              style="text-align: right;margin: 0 40px 0;"
            >
              <el-button
                size="small"
                @click="customerDialogClose"
              >
                取 消
              </el-button>

              <el-button
                type="primary"
                size="small"
                @click="customerDialogClose"
              >
                确 定
              </el-button>
            </div>
          </el-dialog>
          <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            width="1000px"
            @close="cancel"
          >
            <div v-loading="subLoading">
              <div style="text-align: right;">
                <el-select
                  v-if="status === '0'"
                  v-model="cas"
                  style="width:150px;"
                  placeholder="公司类型"
                  @change="getTypeTemplateList(cas)"
                >
                  <el-option
                    v-for="(item, index) in csList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </div>
              <el-table
                ref="serviceSelectTable"
                :data="subTableData"
                height="500px"
                style="width: 100%;margin: 10px 0;"
                border
                @selection-change="handleServiceSelection"
              >
                <el-table-column
                  prop="typeName"
                  label="服务大类"
                />
                <el-table-column
                  prop="subtypeName"
                  label="服务类型"
                />
                <el-table-column
                  label="国家/地区"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="cxr"
                      :placeholder="`已选择(${(scope.row.countries || []).length})`"
                      style="width:100%"
                      disabled
                    >
                      <el-button
                        slot="append"
                        icon="el-icon-search"
                        @click="handleCountry(scope.row, scope.$index)"
                      />
                    </el-input>
                  </template>
                </el-table-column>
                <!-- <el-table-column
                  prop="msg"
                  label="简介描述"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.msg"
                      size="small"
                      clearable
                      style="width:100%;"
                      placeholder="请输入"
                    />
                  </template>
                </el-table-column> -->
                <el-table-column
                  v-if="status !== '0'"
                  type="selection"
                  width="55"
                />
              </el-table>
            </div>
            <div
              slot="footer"
              class="dialog-footer"
            >
              <el-button
                size="small"
                @click="cancel"
              >
                取 消
              </el-button>
              <el-button
                type="primary"
                size="small"
                :loading="subLoading"
                @click="saveConfirm"
              >
                确 定
              </el-button>
            </div>
          </el-dialog>

          <el-dialog
            title="国家/地区"
            :visible.sync="countryShow"
            :close-on-click-modal="false"
            width="960px"
            append-to-body
            @close="closeCountry"
          >
            <el-transfer
              ref="transferItem"
              v-model="countryIds"
              v-loading="countryLoading"
              filterable
              :filter-method="filterMethod1"
              :titles="['国家/地区', '已选择']"
              :props="{key: 'id', label: 'label'}"
              filter-placeholder="输入搜索"
              :data="countryList"
              style="height: 500px;"
            />
            <div
              slot="footer"
              style="text-align: right;margin: 0 40px 0;"
            >
              <el-button
                size="small"
                @click="closeCountry"
              >
                取 消
              </el-button>

              <el-button
                type="primary"
                size="small"
                @click="countryConfirm"
              >
                确 定
              </el-button>
            </div>
          </el-dialog>
        </div>
        <attach-info
          v-show="isMoreInfoShow"
          ref="attachInfo"
          :current-cust-id="currentCustId"
          :current-cust-type="currentCustType"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getTypeTemplateList,
  getCustTypeDtlList,
  getCustTypeList,
  saveTypeTemplateList,
  saveCustType
} from '@/api/operation-of-service-setup'
import {
  getCountryList,
  getStateByCountry,
  getCityByState,
  getCountyByCity,
  getAgentList,
  deleteAgent,
  saveAgent,
  getAgent,
  changeStatus,
  getAgentRelatedPersonList,
  getUserList,
  getWordsList,
  saveAgentRelatedPerson
} from '@/api/jht-agent-management'
import AttachInfo from '@/views/organizers-management/common-setting/more/attachInfo.vue'
import HeadInfoWithBack from '@/components/head-info-with-back/index.vue'

function paramsForm() {
  return {
    abbr: undefined,
    subtype: undefined,
    countryId: undefined,
    stateId: undefined,
    cityId: undefined,
    countyId: undefined,
    alias: undefined,
    request: false,
    pick: true,
    ifMeasureReview: 0,
    ifCustomer: 0,
    ifFinance: 0,
    datarange: [],
    name: undefined,
    licenseCode: undefined,
    licenseAddress: undefined,
    legal: undefined,
    setupDate: undefined,
    certType: undefined,
    certNumber: undefined,
    printServer: undefined,
    domain: undefined,
    markPrefix: undefined,
    id: undefined,
    storeLink: undefined,
    brand: undefined,
    trademark: undefined,
    cooperationAmount: undefined,
    saleType: undefined,
    platform: undefined,
    // type: undefined,
    companySize: undefined,
    registeredCapital: undefined,
    custCode: undefined
  }
}

@Component({
  name: 'AgentManagement',
  components: {
    AttachInfo,
    HeadInfoWithBack
  },
  props: {}
})
export default class extends Vue {
  private title: string = ''
  private cas: string = 'A'
  private status: string = ''
  private cxr = ''
  private tableData: any[] = []
  private serviceData: any[] = []
  private csList: any[] = []
  private custData: any[] = []
  private subTableData: any[] = []
  private selectValue: any = {
    cas: 'A'
  }
  private countryShow = false
  private countryLoading = false
  private countryIdx = 0
  private countryIds: any[] = []
  private subLoading = false
  private dialogVisible = false
  private loading = false
  private dialogLoading = false
  private isEdit = false
  private ifCode = false
  private isMoreInfoShow = false
  private isAssociatedPersonsShow = false
  private isRelatePersonLoading = false
  private isCustomerLoading = false // 运营客服加载动画
  private isFinanceLoading = false
  private isRelatePersonShow = false
  private isFinanceDialogShow = false
  private isCustomerDialogShow = false
  private subtype: any = ''
  private s: any = ''
  private list = []
  private fileList:any[] = []
  private userList = []
  private currentCustId:string = ''
  private currentCustType: any = 'agent'
  private parentId = ''
  private inputName = (this as any).custName
  private relateTitle = ''
  private isFinancal: boolean = false
  private isCustomer: boolean = false
  private relateForm = {
    financialPerson: [], // 关联财务人员
    customerPerson: [] // 关联运营客服
  }
  private searchForm: any = {
    countryId: undefined,
    stateId: undefined,
    cityId: undefined,
    countyId: undefined,
    status: undefined,
    name: undefined,
    types: undefined,
    subTypes: undefined
  }

  private form: any = paramsForm()
  private props: any = {
    value: 'id',
    label: 'name'
  }
  private statusList: any = [
    {
      label: '启用',
      value: '1'
    },
    {
      label: '禁用',
      value: '0'
    }
  ]

  private certTypeList: any = [
    {
      label: '身份证',
      value: '0'
    },
    {
      label: '其他',
      value: '1'
    }
  ]

  private formRules = {
    abbr: [
      { required: true, message: '公司简称不能为空', trigger: 'blur' }
    ],
    parentName: [
      { required: true, message: '上级公司不能为空', trigger: 'blur' }
    ],
    alias: [
      { required: true, message: '英文名称不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (reg.test(value)) {
            callback(new Error('英文名称不能有中文'))
          } else {
            callback()
          }
        }
      }
    ],
    datarange: [
      { required: true, message: '请选择合作期限', trigger: 'change' }
    ],
    request: [{ required: true, message: '请选择是否请款', trigger: 'change' }],
    pick: [{ required: true, message: '请选择是否提货', trigger: 'change' }],
    ifMeasureReview: [{ required: true, message: '请选择是否人工审核计量', trigger: 'change' }],
    ifCustomer: [{ required: true, message: '请选择是否分公司', trigger: 'change' }],
    ifFinance: [{ required: true, message: '请选择是否独立管理财务', trigger: 'change' }],
    name: [
      { required: true, message: '公司名称不能为空', trigger: 'blur' }
    ],
    licenseCode: [
      { required: true, message: '营业执照不能为空', trigger: 'blur' }
      // {
      //   validator(rule: any, value: any, callback: (val?: any) => void) {
      //     const reg = /^[a-zA-Z0-9]*$/
      //     if (!reg.test(value)) {
      //       callback(new Error('营业执照格式只能包含数字和字母'))
      //     } else {
      //       callback()
      //     }
      //   },
      //   trigger: 'blur'
      // }
    ],
    setupDate: [
      { required: true, message: '请选择成立日期', trigger: 'change' }
    ],
    countryId: [{ required: true, message: '请选择国家', trigger: 'change' }],
    countyId: [{ required: false, message: '请选择区/县', trigger: 'change' }],
    stateId: [{ required: true, message: '请选择州/省', trigger: 'change' }],
    cityId: [{ required: true, message: '请选择城市', trigger: 'change' }],
    licenseAddress: [
      { required: true, message: '请输入证照地址', trigger: 'blur' }
    ],
    legal: [
      { required: true, message: '公司法人不能为空', trigger: 'blur' }
    ],
    certType: [
      { required: true, message: '请选择证件类型', trigger: 'change' }
    ],
    certNumber: [
      { required: true, message: '证件号码不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (value && reg.test(value)) {
            callback(new Error('证件号码不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    domain: [
      { required: true, message: '请输入域名前缀', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^[a-z0-9]*$/
          if (!reg.test(value)) {
            callback(new Error('域名前缀只能包含数字、小写字母'))
          } else if (value.length < 2 || value.length > 8) {
            callback(new Error('域名前缀长度必须是大于2位小于8位'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    markPrefix: [
      { required: true, message: '请输入唛头前缀', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^[A-Z]*$/
          if (!reg.test(value)) {
            callback(new Error('域名前缀只是大写字母'))
          } else if (value.length < 2 || value.length > 4) {
            callback(new Error('域名前缀长度必须是大于2位小于4位'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    saleType: [
      { required: true, message: '请选择销售类型', trigger: 'change' }
    ],
    platform: [
      { required: true, message: '请选择平台', trigger: 'change' }
    ],
    // type: [
    //   { required: true, message: '请选择客户属性', trigger: 'change' }
    // ],
    companySize: [
      { required: true, message: '公司规模不能为空', trigger: 'blur' }
    ],
    registeredCapital: [
      { required: true, message: '注册资金不能为空', trigger: 'blur' }
    ],
    cooperationAmount: [
      { required: true, message: '合作金额不能为空', trigger: 'blur' }
    ]
  }

  private countryList: any = []
  private stateList1: any = []
  private cityList1: any = []
  private countyList1: any = []
  private stateList2: any = []
  private cityList2: any = []
  private countyList2: any = []
  private typeList: any = []
  private platList: any = []
  private dialogShow = false
  private selectLoading: boolean = false
  private page: number = 1
  private size: number = 10
  private total: any = 0

  // 所属公司id
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
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

  // 所属公司Name
  get custName(): string {
    const info = UserModule.info || {}
    const custName = (info as any).custName
    return custName
  }

  get pickerOptions() {
    return {
      disabledDate(time: any) {
        return time.getTime() > Date.now()
      }
    }
  }
  get subtypeList() {
    const type = this.typeList.find((e: any) => e.id === this.searchForm.types)
    if (type) {
      return type.subtypeList
    }
    return []
  }

  /* methods */
  private getTypeList() {
    if (this.custId === '0') {
      getTypeTemplateList().then((res: any) => {
        const data = res.data || []
        this.typeList = data.reduce((list: any[], type: any) => {
          const temp: any = list.find((e: any) => e.id === type.typeId)
          if (temp) {
            temp.subtypeList.push({
              id: type.subtypeId,
              name: type.subtypeName
            })
          } else {
            list.push({
              id: type.typeId,
              name: type.typeName,
              subtypeList: [ { id: type.subtypeId, name: type.subtypeName } ]
            })
          }
          return list
        }, [])
      }).catch(() => {
        this.typeList = []
      })
    } else {
      const params: any = {
        custId: this.custId,
        cas: 'A'
      }
      getCustTypeDtlList(params).then((res: any) => {
        const data = (res.data || []).filter((e: any) => e.setted)
        this.typeList = data.reduce((list: any[], type: any) => {
          const temp: any = list.find((e: any) => e.id === type.typeId)
          if (temp) {
            temp.subtypeList.push({
              id: type.subtypeId,
              name: type.subtypeName
            })
          } else {
            list.push({
              id: type.typeId,
              name: type.typeName,
              subtypeList: [ { id: type.subtypeId, name: type.subtypeName } ]
            })
          }
          return list
        }, [])
      }).catch(() => {
        this.typeList = []
      })
    }
  }
  private companySizeBlur() {
    const reg = /^[0-9]*$/
    if (!reg.test(this.form.companySize)) {
      this.form.companySize = ''
    }
  }
  private countryConfirm(): void {
    this.closeCountry()
    const arr = this.countryIds.map((it: any) => {
      return this.countryList.find((item: any) => it === item.id)
    })
    this.subTableData[this.countryIdx].countries = arr
  }
  private closeCountry() {
    this.countryShow = false
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
  }
  // 获取默认模板
  private getTypeTemplateList(val: any): void {
    this.subLoading = true
    const params: any = {
      cas: val
    }
    getTypeTemplateList(params)
      .then((res: any) => {
        this.subLoading = false
        this.subTableData = res.data || []
      })
      .catch((err: any) => {
        this.subLoading = false
        return err
      })
  }
  private handleServiceSelection(val: any) {
    this.serviceData = val
  }
  // 穿梭框
  private handleCountry(row: any, index: any): void {
    this.countryShow = true
    this.countryIdx = index
    const arr = row.countries || []
    this.countryIds = []
    arr.forEach((it: any) => {
      this.countryIds.push(it.id)
    })
  }
  // 获取服务列表
  private getCustTypeList(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const params: any = {
      ...this.selectValue,
      page: this.page,
      size: this.size
    }
    getCustTypeList(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        this.tableData = data.result || []
        this.total = data.total
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  // 提交保存
  private saveConfirm() {
    if (this.status === '0') {
      this.subLoading = true
      const sttp: any = {
        cas: this.cas,
        entities: this.subTableData
      }
      saveTypeTemplateList(sttp)
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.dialogVisible = false
          this.subLoading = false
          this.getCustTypeList()
        })
        .catch((err: any) => {
          this.subLoading = false
          return err
        })
    } else if (this.status === '1' || this.status === '2') {
      if (this.serviceData.length <= 0) {
        this.$message.error('请先勾选需要设置的服务')
        return
      }
      const isCtr = this.serviceData.some((it: any) => it.countries.length <= 0)
      if (isCtr) {
        this.$message.error('勾选的服务中必须选择国家/地区')
        return
      }
      if (this.status === '2') {
        this.serviceData.map((it: any) => {
          if (Array.isArray(it.countries) && it.countries.length > 0) {
            it.setted = true
          }
        })
      }
      this.subLoading = true
      const parm: any = {
        custs: this.custData,
        entities: this.serviceData
      }
      saveCustType(parm)
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.dialogVisible = false
          this.subLoading = false
          this.custData = []
          this.serviceData = []
          this.getCustTypeList()
        })
        .catch((err: any) => {
          this.subLoading = false
          return err
        })
    }
  }
  // 关闭dialog重置表单
  private cancel() {
    this.dialogVisible = false
    this.custData = []
    this.serviceData = []
  }
  // 获取配置
  private getCustTypeDtlList(id: any): void {
    this.subLoading = true
    const params: any = {
      custId: id,
      cas: this.selectValue.cas
    }
    getCustTypeDtlList(params)
      .then((res: any) => {
        this.subLoading = false
        this.subTableData = res.data || []
        if (this.status === '2') {
          this.subTableData.map((it: any) => {
            if (it.setted) {
              this.$nextTick(() => {
                const root: any = this.$refs.serviceSelectTable
                root.toggleRowSelection(it, true)
              })
            }
          })
        }
      })
      .catch((err: any) => {
        this.subLoading = false
        return err
      })
  }
  // 设置服务
  private handleServiceSet(row: any): void {
    this.title = '设置服务'
    this.status = '2'
    this.custData = [
      {
        custId: row.id,
        custName: row.name,
        cas: this.selectValue.cas
      }
    ]
    this.getCustTypeDtlList(row.id)
    this.dialogVisible = true
  }
  // 新增代理商
  private addAgent(): void {
    this.isEdit = false
    this.dialogShow = true
    this.getCountryList().catch(err => err)
    this.$nextTick(() => {
      const ele:any = this.$refs.firstInput
      ele.focus()
    })
  }
  private closeRelateForm(): void {
    this.isRelatePersonShow = false
    this.resetRelatForm()
  }
  private resetRelatForm() {
    this.relateForm.financialPerson = []
    this.relateForm.customerPerson = []
    this.clearRelateValidate()
  }
  private clearRelateValidate() {
    this.$nextTick(() => {
      const theForm: any = this.$refs.relateForm
      theForm.clearValidate()
    })
  }
  // 取消
  private close(): void {
    this.dialogShow = false
    this.isEdit = false
    this.ifCode = false
    this.stateList2 = []
    this.cityList2 = []
    this.countyList2 = []
    this.form = paramsForm()
    this.clearValidate()
  }

  private clearValidate() {
    const theForm: any = this.$refs.theForm
    this.$nextTick(() => {
      theForm.clearValidate()
    })
  }
  /* methods */
  // 上传图片
  private uploadFile(params: any): void {
    const { file } = params
    const selectForm = (this as any).selectForm
    if (!selectForm.typeId) {
      this.$message.warning('请先选择服务大类')
    }
    const effective = selectForm.date.length > 0 ? selectForm.date[0] : ''
    const expiring = selectForm.date.length > 0 ? selectForm.date[1] : ''
    const id = (this as any).isReQuote ? (this as any).currentId : ''
    const form: FormData = new FormData()
    form.append('file', file)
    form.append('custId', (this as any).selectCustId)
    form.append('effective', effective)
    form.append('expiring', expiring)
    form.append('id', id)
    if (selectForm.typeId === '01') {
      form.append('density', selectForm.density)
    }
    const type = selectForm.typeId
  }

  // 监听代理商状态改变
  private async onStatus(row: any, value: any): Promise<void> {
    if (!row.status || row.status === value || row.status === 'X') {
      return
    }
    const text = value === '0' ? '禁用' : '开启'
    const [cancel, confirm] = await this.$confirm(
      `此操作将${text}代理商，是否继续？`,
      '提示',
      {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(res => {
        return [null, res]
      })
      .catch(err => {
        return [err, null]
      })
    if (cancel) return
    changeStatus({
      id: row.id,
      status: value
    })
      .then(res => {
        this.$message.success('修改成功')
        this.queryAll()
      })
      .catch(err => {
        return err
      })
  }

  // 编辑
  private edit(row: any): void {
    this.isEdit = true
    this.dialogShow = true
    this.dialogLoading = true
    this.getPlatList()
    this.getCountryList().catch(err => err)
    getAgent(row.id)
      .then(async(res: any) => {
        const data = res.data || {}
        this.ifCode = !!data.custCode
        const {
          cooperate,
          subtype,
          ...obj
        } = data
        this.subtype = subtype
        const datarange = cooperate.split(',')
        const params = {
          ...obj,
          datarange
        }
        this.form = params
        try {
          if (this.form.countryId) {
            await this.getStateList(2)
          }
          if (this.form.stateId) {
            await this.getCityList(2)
          }
          if (this.form.cityId) {
            await this.getCountyList(2)
          }
        } catch (error) {
          this.dialogLoading = false
        }
        this.dialogLoading = false
      })
      .catch(err => {
        this.dialogLoading = false
        return err
      })
  }

  private getPlatList() {
    this.selectLoading = true
    getWordsList({
      type: 'CUST_PLATFORM'
    })
      .then((res: any) => {
        const data = res.data || []
        this.platList = data
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  // 获取国家列表
  private getCountryList(): Promise<any> {
    return getCountryList()
      .then(res => {
        const data = res.data || {}
        const result = data.result || []
        this.countryList = result.map((item: any) => {
          item.label = item.name + '-' + item.alias
          return item
        })
      })
      .catch(err => {
        return err
      })
  }

  private async getStateList(num: number) {
    const params = num === 1 ? this.searchForm.countryId : this.form.countryId
    this.selectLoading = true
    await getStateByCountry(params).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      const result = data.result || []
      if (num === 1) {
        this.stateList1 = result
      } else {
        this.stateList2 = result
      }
    }).catch(() => {
      this.dialogLoading = false
      this.selectLoading = false
    })
  }
  private async getCityList(num: number) {
    const params = num === 1 ? this.searchForm.stateId : this.form.stateId
    this.selectLoading = true
    await getCityByState(params).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      const result = data.result || []
      if (num === 1) {
        this.cityList1 = result
      } else {
        this.cityList2 = result
      }
    }).catch(() => {
      this.dialogLoading = false
      this.selectLoading = false
    })
  }
  private async getCountyList(num: number) {
    this.selectLoading = true
    const params = num === 1 ? this.searchForm.cityId : this.form.cityId
    await getCountyByCity(params)
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result || []
        if (num === 1) {
          this.countyList1 = result
        } else {
          this.countyList2 = result
        }
        this.selectLoading = false
      })
      .catch(() => {
        this.dialogLoading = false
        this.selectLoading = false
      })
  }

  // 监听国家变化
  private async onCountryChange(type: number) {
    if (type === 1) {
      this.searchForm.stateId = undefined
      this.searchForm.cityId = undefined
      this.searchForm.countyId = undefined
    } else if (type === 2) {
      this.form.stateId = undefined
      this.form.cityId = undefined
      this.form.countyId = undefined
    }
  }
  private onStateChange(num: number) {
    if (num === 1) {
      this.searchForm.cityId = undefined
      this.searchForm.countyId = undefined
    } else if (num === 2) {
      this.form.cityId = undefined
      this.form.countyId = undefined
    }
  }
  private onCityChange(num: number) {
    if (num === 1) {
      this.searchForm.countyId = undefined
    } else if (num === 2) {
      this.form.countyId = undefined
    }
  }

  // 关联人员
  private AssociatedPeson(row:any) {
    this.parentId = row.id
    this.isFinancal = row.ifFinance === 1
    this.isCustomer = row.ifCustomer === 1
    this.isRelatePersonShow = true
    this.isRelatePersonLoading = true
    Promise.all([this.getRelatedPersonList()]).then(res => {
      this.isRelatePersonLoading = false
    }).catch(err => {
      this.isRelatePersonLoading = false
      return err
    })
  }
  private getRelatedPersonList() {
    const params = {
      custId: this.parentId
    }
    this.relateForm.financialPerson = []
    this.relateForm.customerPerson = []
    return getAgentRelatedPersonList(params).then(res => {
      const result = res.data || []
      const financialPerson = result.filter((item:any) => item.type === '0')

      this.relateForm.financialPerson = financialPerson.map((ele:any) => ele.userId)

      const customerPerson = result.filter((item:any) => item.type === '1')

      this.relateForm.customerPerson = customerPerson.map((ele:any) => ele.userId)
    }).catch(err => {
      return err
    })
  }

  //   查看关联人员
  private handleStates(val:any) {
    this.isRelatePersonShow = true
    this.relateTitle = val === 1 ? '关联财务人员' : '关联运营客服'
    if (val === 1) {
      this.isFinanceDialogShow = true
      this.isFinanceLoading = true
    } else if (val === 2) {
      this.isCustomerDialogShow = true
      this.isCustomerLoading = true
    }
    const pType = val === 1 ? 1 : 2 // 财务、客服
    Promise.all([this.getUserData(pType)]).then(res => {
      this.isFinanceLoading = false
      this.isCustomerLoading = false
    }).catch(err => {
      return err
    })
  }
  // 获取人员列表
  private getUserData(val?: any) {
    const params:any = {
      custId: (this as any).custId,
      postType: val
    }
    return getUserList(params).then(res => {
      const data = res.data
      const result = data || []
      this.userList = result.map((item: any) => {
        item.label = item.realName + ' - ' + item.deptName
        return item
      })
    }).catch(err => {
      return err
    })
  }
  // 保存关联人员
  private saveRelateConfirm() {
    const customerData = this.relateForm.customerPerson.map(item => {
      const target:any = this.userList.find((ele:any) => ele.id === item) || {}
      return {
        name: target.username,
        realName: target.realName,
        userId: item,
        type: '1'
      }
    })
    const financeData = this.relateForm.financialPerson.map(item => {
      const target:any = this.userList.find((ele:any) => ele.id === item) || {}
      return {
        name: target.username,
        realName: target.realName,
        userId: item,
        type: '0'
      }
    })
    const params = {
      custId: this.parentId,
      staffs: [...customerData, ...financeData]
    }
    saveAgentRelatedPerson(params).then(res => {
      this.$message.success('保存成功')
      this.resetRelatForm()
      this.isRelatePersonShow = false
    }).catch(err => {
      this.isRelatePersonShow = false
      return err
    })
  }

  private filterMethod(query: any, item: any): boolean {
    const name = item.username || ''
    return name.indexOf(query) > -1
  }
  private filterMethod1(query: any, item: any): boolean {
    const name = item.name || ''
    return name.indexOf(query) > -1
  }

  private customerDialogClose() {
    this.isCustomerDialogShow = false
    const root: any = this.$refs.transferItem1
    root.clearQuery('left')
    root.clearQuery('right')
  }

  private financeDialogClose() {
    this.isFinanceDialogShow = false
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
  }

  // 删除
  private async deleteAgent(id: any): Promise<void> {
    const [cancel, confirm] = await this.$confirm(
      '此操作将删除代理商，是否继续？',
      '提示',
      {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(res => {
        return [null, res]
      })
      .catch(err => {
        return [err, null]
      })
    if (cancel) return
    deleteAgent(id)
      .then(res => {
        this.$message.success('删除成功')
        this.queryAll()
      })
      .catch(err => {
        return err
      })
  }

  // 提交表单
  private handleSubmit(): void {
    const theForm: any = (this as any).$refs.theForm
    theForm.validate((valid: any) => {
      if (valid) {
        this.dialogLoading = true
        const { datarange, countryId, stateId, cityId, countyId, ...obj } = this.form
        obj.cooperate = datarange.join(',')
        const countryName = (this.countryList.find((item: any) => item.id === countryId) || {}).name
        const stateName = (this.stateList2.find((item: any) => item.id === stateId) || {}).name
        const cityName = (this.cityList2.find((item: any) => item.id === cityId) || {}).name
        const countyName = (this.countyList2.find((item: any) => item.id === countyId) || {}).name
        const params: any = {
          ...obj,
          countryId,
          countyId,
          stateId,
          cityId,
          countryName,
          stateName,
          cityName,
          countyName,
          subtype: this.subtype,
          parentId: (this as any).custId,
          parentName: (this as any).custName
        }
        saveAgent(params)
          .then(res => {
            this.dialogLoading = false
            this.close()
            this.queryAll()
          })
          .catch(err => {
            this.dialogLoading = false
            return err
          })
      }
    })
  }
  //  更多
  private handleMore(row:any) {
    this.isMoreInfoShow = true
    this.currentCustId = row.id
    this.$nextTick(() => {
      const attchDom:any = this.$refs.attachInfo
      attchDom.init()
    })
  }
  private queryAll(val?: any): void {
    if (val) {
      this.page = val
    }
    const { page, size } = this
    const params = {
      ...this.searchForm,
      parentId: (this as any).custId,
      subtype: this.subtype,
      page,
      size
    }
    this.loading = true
    getAgentList(params)
      .then(res => {
        const data = res.data || {}
        const result = data.result || []
        this.list = result
        this.total = data.total
        this.loading = false
      })
      .catch(err => {
        this.loading = false
        return err
      })
  }
  private goBack() {
    this.isMoreInfoShow = false
    this.$nextTick(() => {
      const attchDom:any = this.$refs.attachInfo
      attchDom.resetInitData()
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
    // 聚货通-一级代理商
    // 一级代理商-二级代理商
    const type = (this as any).custType
    const stype = (this as any).custSubtype
    if (type === '0') {
      this.subtype = '1'
    } else if (type === '2' && stype === '1') {
      this.subtype = '2'
    }
    this.queryAll()
    this.getTypeList()
    this.getCountryList().then((res: any) => {
      return res
    }).catch((err: any) => err)
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
.agent-form {
  padding-right: 30px;
  height: 450px;
  overflow-y: auto;
  .el-form-item {
    display: inline-block;
    width: 33.33%;
  }
}
.form-line {
  width: 100%;
  border: 1px solid #efeff4;
  margin-left: 20px;
  margin-bottom: 18px;
}
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
::v-deep .el-dialog__body {
  padding: 20px 20px 30px;
}
</style>
