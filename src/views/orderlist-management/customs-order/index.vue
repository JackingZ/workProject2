<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        v-show="!detailShow"
        class="app-container"
      >
        <head-info
          info=""
          title="报关订单"
        >
          <template v-slot:option>
            <el-radio-group
              v-if="custType === '0' || custType === '3'"
              v-model="searchName"
              size="small"
              @change="onSearch"
            >
              <el-radio-button label="1">
                按订单
              </el-radio-button>
              <el-radio-button label="2">
                按柜
              </el-radio-button>
            </el-radio-group>
          </template>
        </head-info>
        <div class="app-panel">
          <div v-show="searchName === '1'">
            <div style="text-align:right;">
              <el-select
                v-if="custType === '0' || custType === '2'"
                v-model="searchForm.orderType"
                placeholder="订单类型"
                style="width:100px;margin-right:5px;"
                size="small"
                @change="onOrderType"
              >
                <el-option
                  v-for="item in orderTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-if="custType === '2' && custSubtype === '1' && searchForm.orderType === '0'"
                v-model="searchForm.comType"
                size="small"
                style="width:100px;margin-right:5px;"
                placeholder="公司类型"
                clearable
                @change="onComType"
              >
                <el-option
                  v-for="(item, index) in companyTypeList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-if="(custType === '0' || custType === '2') && searchForm.orderType === '0'"
                v-model="searchForm.comId"
                :loading="selectLoading"
                size="small"
                style="width:130px;margin-right:5px;"
                placeholder="所属公司"
                filterable
                clearable
                @change="onCompany"
                @focus="getCompanyList"
              >
                <el-option
                  v-for="item in companyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>

              <el-select
                v-model="searchForm.status"
                :loading="selectLoading"
                placeholder="订单状态"
                style="width: 100px;margin-right: 5px;"
                size="small"
                clearable
                filterable
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="searchForm.model"
                size="small"
                style="width: 100px;margin-right: 5px;"
                placeholder="订单类别"
                filterable
                clearable
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="searchForm.declare"
                size="small"
                style="width: 100px;margin-right: 5px;"
                placeholder="报关类型"
                filterable
                clearable
              >
                <el-option
                  v-for="item in customsList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>

              <el-select
                v-model="searchForm.countryId"
                clearable
                filterable
                placeholder="服务国家"
                style="width:130px;margin-right:5px;"
                size="small"
                @focus="getCountryList"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>

              <el-date-picker
                v-model="searchForm.orderTime"
                :clearable="false"
                unlink-panels
                type="daterange"
                align="right"
                size="small"
                value-format="yyyy-MM-dd"
                range-separator="~"
                style="width:240px;margin-right:5px;"
                start-placeholder="下单起始时间"
                end-placeholder="下单截止时间"
              />

              <el-input
                v-model="searchForm.code"
                placeholder="请输入内容"
                class="input-with-select"
                style="width:260px;margin-right: 10px;"
                size="small"
                clearable
              >
                <el-select
                  slot="prepend"
                  v-model="selectType"
                  size="small"
                  style="width:120px;"
                  placeholder="请选择"
                >
                  <el-option
                    label="订舱单(SO)"
                    value="1"
                  />
                  <el-option
                    v-if="custType === '0' || custType === '3'"
                    label="柜号"
                    value="2"
                  />
                  <el-option
                    label="原单号"
                    value="3"
                  />
                </el-select>
              </el-input>
              <el-button
                v-permission="['customQuery']"
                type="primary"
                size="small"
                @click="getAllData(1)"
              >
                查询
              </el-button>
            </div>
            <div>
              <el-table
                v-loading="loading"
                :data="tableData"
                style="width: 100%;margin: 10px 0;"
                height="calc(100vh - 313px)"
                border
              >
                <!-- <el-table-column
                type="selection"
                width="55"
              /> -->
                <el-table-column
                  fixed="left"
                  prop="declarationNo"
                  label="报关单号"
                  min-width="180"
                  show-overflow-tooltip
                />
                <el-table-column
                  fixed="left"
                  prop="number"
                  label="原单号"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-popover
                      placement="bottom-start"
                      width="200"
                      trigger="click"
                    >
                      <div
                        v-loading="numberLoading"
                        style="height: 200px;overflow-y: auto;"
                      >
                        <el-tag
                          v-for="(item, index) in numberData"
                          :key="index"
                          type="info"
                          style="display: block;margin-bottom: 3px;"
                        >
                          {{ item }}
                        </el-tag>
                      </div>
                      <el-button
                        slot="reference"
                        :disabled="!$checkPermission(['queryrOrders'])"
                        type="text"
                        size="small"
                        @click="viewNumber(scope.row)"
                      >
                        原单号
                      </el-button>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="model"
                  label="订单类型"
                  width="100"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.model === '1'">报关</span>
                    <span v-else-if="scope.row.model === '2'">报检</span>
                    <span v-else-if="scope.row.model === '3'">报关&报检</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="type"
                  label="进出口类型"
                  width="100"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.type === '0'">进口</span>
                    <span v-else-if="scope.row.type === '1'">出口</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="orderDeclare"
                  label="报关类型"
                  width="100"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.type === '1' && scope.row.orderDeclare === '0'">普通报关</span>
                    <span v-else-if="scope.row.type === '1' && scope.row.orderDeclare === '1'">出口退税</span>
                    <span v-else-if="scope.row.type === '1' && scope.row.orderDeclare === '2'">整柜买单</span>
                    <span v-if="scope.row.type === '0'">--</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="countryName"
                  label="服务国家"
                  min-width="150"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="customerName"
                  label="下单客户"
                  min-width="150"
                  show-overflow-tooltip
                />
                <el-table-column
                  v-if="custType === '0'"
                  prop="orderCustomerName"
                  label="客户名称"
                  width="150"
                  show-overflow-tooltip
                />
                <el-table-column
                  :formatter="formmatStatus"
                  prop="status"
                  label="订单状态"
                  width="120"
                />
                <el-table-column
                  prop=""
                  label="文件状态"
                  width="120"
                >
                  <template slot-scope="scope">
                    <el-button
                      v-if="scope.row.orderDeclare === '1'"
                      :disabled="(custType === '1' || custType === '2')"
                      type="text"
                      @click="viewFile(scope.row)"
                    >
                      <span v-if="scope.row.fileStatus === '0'">待审核</span>
                      <span v-else-if="scope.row.fileStatus === '1'">部分审核(通过)</span>
                      <span v-else-if="scope.row.fileStatus === '3'">部分审核(异常)</span>
                      <span v-else-if="scope.row.fileStatus === '2'">审核完成</span>
                    </el-button>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="declareStatus"
                  label="报关状态"
                  min-width="120"
                >
                  <template slot-scope="scope">
                    <el-button
                      :disabled="(!$checkPermission(['draftAuthority'])) || (custType === '1' || custType === '2') || (scope.row.fileStatus !== '2' && custType === '0')"
                      type="text"
                      @click="viewStatus(scope.row, '1')"
                    >
                      {{ (declareList.find(e => scope.row.declareStatus === e.id) || {}).name }}
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="inspectionStatus"
                  label="报检状态"
                  width="120"
                >
                  <template slot-scope="scope">
                    <el-button
                      :disabled="(!$checkPermission(['inspectionAuthority'])) || (custType === '1' || custType === '2') || (scope.row.fileStatus !== '2' && custType === '0')"
                      type="text"
                      @click="viewStatus(scope.row, '2')"
                    >
                      {{ (inspectList.find(e => e.id === scope.row.inspectionStatus) || {}).name }}
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="ordersTime"
                  label="下单日期"
                  width="160"
                />
                <el-table-column
                  label="操作"
                  fixed="right"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-button
                      v-if="custType === '0' && scope.row.orderDeclare === '1'"
                      v-permission="['supplierAuthority']"
                      type="text"
                      @click="viewSupperier(scope.row)"
                    >
                      指定供应商
                    </el-button>
                  <!-- <el-button
              type="text"
              @click="moveOrder(scope.row)"
            >
              流转报关单
            </el-button> -->
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

          <div v-show="searchName === '2'">
            <div style="text-align:right;">
              <el-select
                v-model="selectValue.supplyId"
                :loading="selectLoading"
                placeholder="供应商"
                style="width: 130px;margin-right: 5px;"
                size="small"
                filterable
                clearable
                @focus="getCustTypeList"
              >
                <el-option
                  v-for="item in supplierList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.startCountryId"
                :loading="selectLoading"
                clearable
                filterable
                placeholder="起运国"
                style="width:130px;margin-right:5px;"
                size="small"
                @focus="getCountryList"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.endCountryId"
                :loading="selectLoading"
                clearable
                filterable
                placeholder="目的国"
                style="width:130px;margin-right:5px;"
                size="small"
                @focus="getCountryList"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.type"
                :loading="selectLoading"
                placeholder="进出口类型"
                style="width: 120px;margin-right: 5px;"
                size="small"
                clearable
                filterable
              >
                <el-option
                  label="进口"
                  value="0"
                />
                <el-option
                  label="出口"
                  value="1"
                />
              </el-select>
              <el-select
                v-model="selectValue.DStatus"
                size="small"
                style="width: 120px;margin-right: 5px;"
                placeholder="报关状态"
                filterable
                clearable
              >
                <el-option
                  v-for="item in declareList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.IStatus"
                size="small"
                style="width: 120px;margin-right: 5px;"
                placeholder="报检状态"
                filterable
                clearable
              >
                <el-option
                  v-for="item in inspectList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>

              <el-input
                v-model="selectValue.code"
                placeholder="请输入内容"
                class="input-with-select"
                style="width:250px;margin-right: 10px;"
                size="small"
              >
                <template slot="prepend">
                  柜号/提单号
                </template>
              </el-input>
              <el-button
                type="primary"
                size="small"
                @click="queryAllData(1)"
              >
                查询
              </el-button>
            </div>
            <div>
              <el-table
                v-loading="loading"
                :data="tableData"
                style="width: 100%;margin: 10px 0;"
                height="calc(100vh - 313px)"
                border
              >
                <el-table-column
                  fixed="left"
                  prop="code"
                  label="柜号/提单号"
                  min-width="180"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="type"
                  label="进出口类型"
                  width="100"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.type === '0'">进口</span>
                    <span v-else-if="scope.row.type === '1'">出口</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="supplyName"
                  label="供应商"
                  min-width="150"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="startCountryName"
                  label="起运国"
                  min-width="150"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="endCountryName"
                  label="目的国"
                  min-width="150"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="declareStatus"
                  label="报关状态"
                  min-width="120"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      @click="viewStatus(scope.row, '1')"
                    >
                      {{ (declareList.find(e => `${scope.row.declareStatus}` === e.id) || {}).name }}
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="inspectionStatus"
                  label="报检状态"
                  width="120"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      @click="viewStatus(scope.row, '2')"
                    >
                      {{ (inspectList.find(e => e.id === `${scope.row.inspectionStatus}`) || {}).name }}
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="startTime"
                  label="起运时间"
                  width="160"
                />
                <el-table-column
                  prop="endTime"
                  label="到港时间"
                  width="160"
                />
                <el-table-column
                  label="操作"
                  fixed="right"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      @click="handleView(scope.row)"
                    >
                      查看
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
        </div>
      </div>
      <div
        v-show="detailShow"
        class="app-container"
      >
        <detail
          v-if="searchName === '1'"
          ref="detailForm"
          @back="detailShow = false"
        />
        <info-view
          v-if="searchName === '2'"
          ref="infoForm"
          :status-list="statusList"
          :declare-list="declareList"
          :inspect-list="inspectList"
          @back="detailShow = false"
        />
      </div>

      <el-dialog
        title="指定供应商"
        width="600px"
        :close-on-click-modal="false"
        :visible.sync="isSupperierVisible"
        @close="cancelSupperier"
      >
        <div v-loading="formLoading">
          <el-form
            ref="supperierForm"
            :model="supperierForm"
            :rules="rules"
            label-width="100px"
            size="small"
            style="padding-right: 20px;"
          >
            <el-form-item
              label="指派方式"
              prop="isDefault"
            >
              <el-select
                v-model="supperierForm.isDefault"
                :disabled="isSupperier === '1'"
                placeholder="请选择"
                style="width:100%;"
                size="small"
                @change="onSupperType"
              >
                <el-option
                  label="默认供应商"
                  :value="0"
                />
                <el-option
                  label="指定供应商"
                  :value="1"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="供应商"
              prop="supplyId"
            >
              <span v-if="supperierForm.isDefault === 0 && supperierForm.supplyId">
                {{ supperierForm.name }}
              </span>
              <span v-else-if="supperierForm.isDefault === 0 && !supperierForm.supplyId">
                未配置
              </span>
              <el-select
                v-else-if="supperierForm.isDefault === 1"
                v-model="supperierForm.supplyId"
                :disabled="isSupperier === '1'"
                :loading="selectLoading"
                placeholder="请选择"
                style="width:100%;"
                size="small"
                filterable
                clearable
                @focus="getCustList"
              >
                <el-option
                  v-for="item in supplierList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            style="text-align: right;padding-top: 20px;"
          >
            <el-button
              size="small"
              @click="cancelSupperier"
            >
              取 消
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="confirmSupperier"
            >
              确 定
            </el-button>
          </div>
        </div>
      </el-dialog>

      <el-dialog
        title="原单号"
        width="600px"
        :close-on-click-modal="false"
        :visible.sync="isNumberVisible"
        @close="isNumberVisible = false"
      >
        <div>弹框</div>
      </el-dialog>
      <el-dialog
        :title="title"
        width="600px"
        :close-on-click-modal="false"
        :visible.sync="isStatusVisible"
        @close="cancelStatus"
      >
        <div v-loading="formLoading">
          <el-form
            ref="statusForm"
            :model="statusForm"
            :rules="rules"
            label-width="100px"
            size="small"
            style="padding-right: 20px;"
          >
            <el-form-item
              v-if="title === '报关状态'"
              label="报关状态"
              prop="declareStatus"
            >
              <el-select
                v-model="statusForm.declareStatus"
                placeholder="请选择"
                style="width:100%;"
                size="small"
              >
                <el-option
                  v-for="item in declareList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="title === '报检状态'"
              label="报检状态"
              prop="inspectionStatus"
            >
              <el-select
                v-model="statusForm.inspectionStatus"
                placeholder="请选择"
                style="width:100%;"
                size="small"
              >
                <el-option
                  v-for="item in inspectList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          <!-- <el-form-item
            label="上传附件"
            prop="upload"
            class="is-required"
          >
            <el-upload
              action
              :multiple="false"
              :limit="1"
              :http-request="uploadFileOne"
              :on-remove="removeFile"
              :file-list="fileList"
            >
              <el-button
                size="small"
              >
                <i class="el-icon-upload" />
                点击上传
              </el-button>
            </el-upload>
          </el-form-item> -->
          </el-form>
          <div
            slot="footer"
            style="text-align: right;padding-top: 20px;"
          >
            <el-button
              size="small"
              @click="cancelStatus"
            >
              取 消
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="confirmStatus"
            >
              确 定
            </el-button>
          </div>
        </div>
      </el-dialog>
      <el-dialog
        title="文件审核"
        width="1000px"
        :close-on-click-modal="false"
        :visible.sync="isFileVisible"
        @close="custCancel"
      >
        <div v-loading="fileLoading">
          <!-- <el-select
            v-model="fileId"
            placeholder="请选择"
            style="width:150px;"
            size="small"
            clearable
            filterable
            multiple
            collapse-tags
            @change="onFiles"
          >
            <el-option
              v-for="item in fileOption"
              :key="item.id"
              :label="item.fileName"
              :value="item.id"
            />
          </el-select> -->
          <el-table
            :data="fileData"
            height="400px"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              prop="fileName"
              label="文件名"
            />
            <el-table-column
              prop="status"
              label="文件状态"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.status === '0'">待审核</span>
                <span v-else-if="scope.row.status === '1'">审核通过</span>
                <span v-else-if="scope.row.status === '2'">审核拒绝</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="auditName"
              label="审核人"
            />
            <el-table-column
              prop="auditTime"
              label="审核时间"
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="180"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.fileStatus === '1' && $checkPermission(['customDownFile'])"
                  type="text"
                  size="small"
                  @click="downFile(scope.row)"
                >
                  下载
                </el-button>
                <el-upload
                  v-if="scope.row.status !== '1' && $checkPermission(['customUploadFile'])"
                  action
                  :multiple="false"
                  :limit="1"
                  :show-file-list="false"
                  :http-request="uploadFileTwo"
                  :file-list="fileList2"
                  style="display: inline-block;margin: 0 10px;"
                >
                  <el-button
                    size="small"
                    type="text"
                    @click="onFile(scope.row, $event)"
                  >
                    <i class="el-icon-upload" />
                    <span v-if="scope.row.status === '0'">上传</span>
                    <span v-else>重新上传</span>
                  </el-button>
                </el-upload>
                <el-button
                  v-if="scope.row.fileStatus === '1' && scope.row.status !== '1' && custType === '3' && $checkPermission(['customAuditFile'])"
                  type="text"
                  size="small"
                  @click="auditFileRow(scope.row)"
                >
                  审核
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div
            v-if="custType === '0' && $checkPermission(['customAuditFile'])"
          >
            <el-form
              ref="custForm"
              :model="custForm"
              :rules="custRules"
              label-width="90px"
              label-position="right"
              size="small"
            >
              <el-form-item
                label="审核状态："
                prop="audit"
                label-width="110px"
              >
                <el-radio-group v-model="custForm.audit">
                  <el-radio :label="1">
                    通过
                  </el-radio>
                  <el-radio :label="2">
                    拒绝
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                v-if="custForm.audit === 2"
                label="拒绝原因："
                prop="reason"
                label-width="110px"
              >
                <el-input
                  v-model="custForm.reason"
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
                  @click="custCancel"
                >
                  取消
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="custConfirm"
                >
                  确认
                </el-button>
              </div>
            </el-form>
          </div>
        </div>
      </el-dialog>
      <el-dialog
        title="审核"
        :visible.sync="dialogAudit"
        :close-on-click-modal="false"
        append-to-body
        width="500px"
      >
        <el-form
          ref="auditForm"
          v-loading="auditLoading"
          :model="auditForm"
          :rules="auditRules"
          label-width="110px"
          label-position="right"
          size="small"
        >
          <el-form-item
            label="审核状态："
            prop="status"
          >
            <el-radio-group v-model="auditForm.status">
              <el-radio label="1">
                通过
              </el-radio>
              <el-radio label="2">
                拒绝
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <div
            style="text-align: right;padding-top: 10px;"
          >
            <el-button
              size="small"
              @click="resetAudit"
            >
              取消
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="auditConfirm"
            >
              确认
            </el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'

import {
  getOrderList,
  getContainList,
  getFbastoreList,
  moveOrder,
  getSupplierList,
  getCustTypeList,
  getCustList,
  getAgentList,
  getCustomerList,
  deleteOrder,
  deletePallet,
  getFileData,
  saveCustomsStatus,
  saveContainStatus,
  saveSupperier,
  saveFile,
  auditFile,
  getSupperier,
  auditJHTFile,
  getFileConfig
} from '@/api/orderlist-at-customs'
import detail from '@/views/orderlist-management/customs-order/detail.vue'
import infoView from '@/views/orderlist-management/customs-order/info.vue'
import dayjs from 'dayjs'
import { getCountryByCustSerice } from '@/api/public'

@Component({
  name: 'customs',
  components: {
    detail,
    infoView
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private detailShow: boolean = false
  private loading: boolean = false
  private fileLoading: boolean = false
  private formLoading: boolean = false
  private isSupperierVisible: boolean = false
  private isFileVisible: boolean = false
  private isNumberVisible: boolean = false
  private isStatusVisible: boolean = false
  private selectLoading: boolean = false
  private isEdit: boolean = false
  private companyTypeList: any[] = [
    { id: '1', name: '客户' },
    { id: '2', name: '二级代理商' }
  ]
  private orderTypeList: any[] = [
    { name: '销售订单', id: '0' },
    { name: '采购订单', id: '1' }
  ]
  private typeList = [
    { name: '报关', id: '1' },
    { name: '报检', id: '2' },
    { name: '报关&报检', id: '3' }
  ]
  private customsList = [
    { name: '普通报关', id: '0' },
    { name: '出口退税', id: '1' },
    { name: '整柜买单', id: '2' }
  ]
  private statusList = [
    { name: '新建', id: '0' },
    { name: '报关放行', id: '1' },
    { name: '报关查验', id: '2' },
    { name: '退运', id: '3' }
  ]
  private declareList = [
    { name: '草单已录入', id: '0' },
    { name: '草单已确认', id: '1' },
    { name: '申报单已提交', id: '2' },
    { name: '通关已放行', id: '3' },
    { name: '通关查验', id: '4' },
    { name: '查验放行', id: '5' },
    { name: '退货', id: '6' }
  ]
  private inspectList = [
    { name: '报检未放行', id: '0' },
    { name: '报检已放行', id: '1' },
    { name: '查验放行', id: '2' },
    { name: '退货', id: '3' }
  ]
  private privatelineList: any[] = []
  private countryList: any[] = []
  private warehouseList: any[] = []
  private companyList: any[] = []
  private searchName: any = '1'
  private viewObj: any = {}
  private selectType = '1'
  private tableData: any[] = []
  private searchForm: any = {
    status: undefined,
    model: undefined,
    declare: undefined,
    lineId: undefined,
    custId: undefined,
    code: undefined,
    countryId: undefined,
    warehouseId: undefined,
    comId: undefined,
    comType: '',
    orderType: '0',
    orderTime: []
  }
  private selectValue: any = {
    supplyId: undefined,
    type: undefined,
    IStatus: undefined,
    DStatus: undefined,
    code: undefined,
    startCountryId: undefined,
    endCountryId: undefined
  }
  private title = ''
  private customsNum: any = ''
  private customsType: any = ''
  private page: number = 1
  private size: number = 10
  private total: any = 0
  private supperierForm: any = {
    supplyId: undefined,
    supplyName: undefined,
    number: undefined,
    name: undefined,
    blNo: undefined,
    isDefault: 0
  }
  private isSupperier = ''
  private rules: any = {
    isDefault: { required: true, message: '请选择指派方式', trigger: 'change' },
    supplyId: { required: true, message: '请选择报关行', trigger: 'change' },
    declareStatus: { required: true, message: '请选择报关状态', trigger: 'change' },
    inspectionStatus: { required: true, message: '请选择报检状态', trigger: 'change' }
  }
  private defaultObj: any = {}
  private numberLoading: boolean = false
  private numberData: any[] = []
  private supplierList: any[] = []
  private fileId: any = ''
  private fileData: any[] = []
  private fileOption: any[] = []
  private fileList: any[] = []
  private fileList2: any[] = []
  private statusForm: any = {
    declareStatus: undefined,
    inspectionStatus: undefined,
    url: undefined
  }
  private auditLoading: boolean = false
  private dialogAudit: boolean = false
  private fileUrl: any = undefined
  private fileRow: any = {}
  private auditForm: any = {
    status: undefined
  }
  private auditRules: any = {
    status: { required: true, message: '请选择审核状态', trigger: 'change' }
  }
  private custForm: any = {
    audit: undefined,
    reason: undefined
  }
  private custRules: any = {
    audit: { required: true, message: '请选择审核状态', trigger: 'change' },
    reason: { required: true, message: '拒绝原因不能为空', trigger: 'blur' }
  }
  private isStatus: any = ''

  /* computed */
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
  get parentId(): string {
    const info = UserModule.info || {}
    const parentId = (info as any).parentId
    return parentId
  }
  get parentName(): string {
    const info = UserModule.info || {}
    const parentName = (info as any).parentName
    return parentName
  }

  /* methods */
  // private async getStatusList() {
  //   await getStatusList().then((res: any) => {
  //     this.statusList = (res.data || []).map((e: any) => {
  //       return {
  //         name: e.name,
  //         id: e.key,
  //         type: e.type
  //       }
  //     }).filter((e: any) => e.type === 'CUSTOM_DECLARATION')
  //   }).catch(() => {
  //     this.statusList = []
  //   })
  // }
  private volumesFilter(vol: any, len: any) {
    if (len === 'CM') {
      return (vol * 0.000001).toFixed(3)
    } else if (len === 'M') {
      return (vol).toFixed(3)
    } else if (len === 'INCH') {
      return (vol * 0.0000164).toFixed(3)
    } else if (len === 'FT') {
      return (vol * 0.0283168).toFixed(3)
    }
  }
  // 按柜
  private onSearch() {
    this.tableData = []
    this.total = 0
    this.page = 1
    if (this.searchName === '1') {
      this.getAllData(1)
    } else {
      this.queryAllData(1)
    }
  }

  private handleView(row: any) {
    this.viewObj = row
    this.detailShow = true
    const root: any = this.$refs.infoForm
    root.setData({
      ...this.viewObj,
      command: row.type
    })
  }

  private onOrderType() {
    this.tableData = []
    if (this.searchForm.orderType === '1') {
      this.searchForm.comType = ''
      this.searchForm.comId = ''
      this.companyList = []
    }
    if ((this as any).custType === '0') {
      this.getAllData(1)
    }
  }
  private onComType() {
    // 仅一级代理商可操作
    this.searchForm.comId = ''
    this.companyList = []
    this.tableData = []
  }
  private onCompany() {
    this.tableData = []
    this.getTableData(1)
  }
  private getCompanyList() {
    const params:any = {
      page: 1,
      size: 99999
    }
    const type = (this as any).custType
    const subType = (this as any).custSubtype
    let func:any = null
    if (type === '2' && (this.searchForm.comType === '1' || subType === '2')) {
      params.custIds = [(this as any).custId]
      func = getCustomerList
    } else if (type === '2' && this.searchForm.comType === '2') {
      params.parentId = this.custId
      params.subtype = '2'
      params.types = '03'
      func = getAgentList
    } else if (type === '0') {
      params.parentId = this.custId
      params.subtype = '1'
      params.types = '03'
      func = getAgentList
    } else {
      this.companyList = []
      return
    }
    this.selectLoading = true
    func(params).then((res:any) => {
      if (type === '2' && (this.searchForm.comType === '1' || subType === '2')) {
        const data = res.data || []
        this.companyList = data
      } else {
        const data = res.data || {}
        this.companyList = data.result || []
      }
      this.selectLoading = false
    }).catch((err:any) => {
      this.selectLoading = false
      return err
    })
  }

  // 获取国家列表
  private getCountryList() {
    const params = {
      custId: this.custId || '',
      typeId: '03'
    }
    this.selectLoading = true
    getCountryByCustSerice(params)
      .then((res: any) => {
        this.countryList = res.data || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private onSupperType() {
    if (this.supperierForm.isDefault === 0) {
      const { id, name } = this.defaultObj
      this.supperierForm.supplyId = id
      this.supperierForm.name = name
    } else {
      this.supperierForm.supplyId = undefined
      this.supperierForm.name = undefined
    }
  }
  private getCustTypeList() {
    this.selectLoading = true
    const params = {
      page: 1,
      size: 9999,
      cas: 'S',
      typeId: '03',
      subtypeId: ''
    }
    getCustTypeList(params).then((res: any) => {
      const data = res.data || {}
      const result = data.result || []
      this.supplierList = JSON.parse(
        JSON.stringify(result)
          .replace(/custName/g, 'name')
          .replace(/custId/g, 'id')
      )
      this.selectLoading = false
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }
  private getCustList() {
    this.selectLoading = true
    const params = {
      cas: 'S',
      types: '03',
      subtypes: this.supperierForm.subtypeId,
      countries: [this.supperierForm.countryId]
    }
    getCustList(params).then((res: any) => {
      const data = res.data || []
      const result = data
      this.supplierList = JSON.parse(
        JSON.stringify(result)
          .replace(/custName/g, 'name')
          .replace(/custId/g, 'id')
      )
      this.selectLoading = false
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }

  // 查询仓库
  private getWarehouseList() {
    this.selectLoading = true
    const params = {
      countryId: this.searchForm.countryId,
      codeSort: 'A',
      page: 1,
      size: 9999
    }
    getFbastoreList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.warehouseList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private formmatStatus(row: any) {
    const item: any = this.statusList.find((it: any) => it.id === row.status) || {}
    return item.name
  }
  private formmatType(row: any) {
    const item: any = this.typeList.find((it: any) => Number(it.id) === row.type) || {}
    return item.name
  }
  private formmatLoading(row: any) {
    const item: any = this.privatelineList.find((it: any) => it.id === row.loading) || {}
    return item.name
  }

  private async moveOrder(row: any) {
    const [cancel, confirm] = await this.$confirm(
      `此操作将流转该订单，是否继续？`,
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
    this.loading = true
    const type = (this as any).custType
    const stype = (this as any).custSubtype
    let buyerType
    if (type === '0') {
      buyerType = '3' // 聚货通
    } else if (type === '1') {
      buyerType = '0' // 客户
    } if (type === '2' && stype === '1') {
      buyerType = '1' // 一级代理
    } else if (type === '2' && stype === '2') {
      buyerType = '2' // 二级代理
    }
    let sellerId
    let sellerName
    if (type === '0') {
      this.warehouseList.map((it: any) => {
        if (row.warehouseId === it.id) {
          sellerId = it.custId
          sellerName = it.custName
        }
      })
    } else {
      sellerId = (this as any).parentId
      sellerName = (this as any).parentName
    }
    const { id } = row
    const params: any = {
      buyerType, orderId: id, sellerId, sellerName
    }
    moveOrder(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '流转订单成功'
        })
        this.getAllData()
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

  // 表格弹框
  private viewNumber(row: any): void {
    this.numberData = row.codeList || []
  }
  private viewStatus(row: any, val: string): void {
    this.isStatusVisible = true
    this.isStatus = val
    if (val === '1') {
      this.title = '报关状态'
    } else {
      this.title = '报检状态'
    }
    const { declareStatus, inspectionStatus, ...obj } = row
    this.statusForm = {
      ...obj,
      declareStatus: `${declareStatus}`,
      inspectionStatus: `${inspectionStatus}`
    }
  }
  private confirmStatus() {
    const form: any = this.$refs.statusForm
    form.validate((valid: any) => {
      if (!valid) return false
      this.formLoading = true
      const { declareStatus, inspectionStatus, id, code, ...obj } = this.statusForm
      let params: any = {}
      let func: any = null
      if (this.searchName === '1') {
        params = {
          ...obj,
          id
        }
        if (this.isStatus === '1') {
          params.declareStatus = declareStatus
        } else {
          params.inspectionStatus = inspectionStatus
        }
        func = saveCustomsStatus
      } else if (this.searchName === '2') {
        params = {
          code,
          containerId: id
        }
        if (this.isStatus === '1') {
          params.dstatus = declareStatus
        } else {
          params.istatus = inspectionStatus
        }
        func = saveContainStatus
      } else {
        return
      }
      func(params)
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.formLoading = false
          this.isStatusVisible = false
          this.cancelStatus()
          if (this.searchName === '1') {
            this.getAllData()
          } else {
            this.queryAllData()
          }
        }).catch((err: any) => {
          this.formLoading = false
          return err
        })
    })
  }
  private viewFile(row: any) {
    this.isFileVisible = true
    const { jhtAudit, jhtReason }: any = row
    this.custForm.audit = jhtAudit
    this.custForm.reason = jhtReason
    this.customsNum = row.number
    this.customsType = row.orderDeclare
    this.getFileData()
    this.loadFileData(row)
  }
  private getFileData() {
    this.fileLoading = true
    const params: any = {
      number: this.customsNum,
      type: this.customsType
    }
    getFileData(params).then((res: any) => {
      this.fileData = res.data || []
      this.fileLoading = false
    }).catch((err: any) => {
      this.fileLoading = false
      return err
    })
  }
  private loadFileData(row: any) {
    const params = {
      model: {
        countryCode: (row || {}).countryId,
        moduleCode: 3,
        typeCode: 5
      },
      page: 1,
      size: 999
    }
    this.selectLoading = true
    getFileConfig(params)
      .then((res: any) => {
        this.selectLoading = false
        this.fileOption = (res.data || {}).result || []
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private onFiles() {
    //
  }

  private viewSupperier(row: any) {
    if (row.jhtAudit !== 1) {
      this.$message.error('文件未审核通过')
      return
    }
    this.isSupperierVisible = true
    this.supperierForm.blNo = row.blNo
    this.supperierForm.subtypeId = row.type === '0' ? '1' : '0'
    this.supperierForm.number = row.number
    this.supperierForm.supplyName = row.supplyName
    this.supperierForm.supplyId = row.supplyId
    this.supperierForm.isDefault = row.isDefault
    this.supperierForm.type = row.orderDeclare
    this.supperierForm.countryId = row.countryId
    this.isSupperier = row.isFlag
    if (this.supperierForm.isDefault === 1) {
      this.getCustList()
      return
    }
    this.formLoading = true
    getSupperier({
      serviceId: row.lscId
    }).then((res: any) => {
      const data = res.data || {}
      this.defaultObj = data.defaultSupply || {}
      const { id, name } = this.defaultObj
      this.supperierForm.supplyId = id
      this.supperierForm.name = name
      this.formLoading = false
    }).catch((err: any) => {
      this.formLoading = false
      return err
    })
  }
  private confirmSupperier(row: any): void {
    if (this.isSupperier === '1') {
      this.cancelSupperier()
      return
    }
    if (this.supperierForm.isDefault === 0 && !this.supperierForm.supplyId) {
      this.cancelSupperier()
      return
    }
    const form: any = this.$refs.supperierForm
    form.validate((valid: any) => {
      if (!valid) return false
      this.formLoading = true
      const { subtypeId, ...obj } = this.supperierForm
      const params: any = {
        ...obj
      }
      this.supplierList.map((it: any) => {
        if (this.supperierForm.supplyId === it.id) {
          params.supplyName = it.name
        }
      })
      saveSupperier(params)
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.formLoading = false
          this.cancelSupperier()
          this.getAllData()
        }).catch((err: any) => {
          this.formLoading = false
          return err
        })
    })
  }

  // 报关文件列表
  private custCancel() {
    this.isFileVisible = false
    this.fileData = []
    this.custForm = {
      audit: undefined,
      reason: undefined
    }
    const root: any = this.$refs.custForm
    root.clearValidate()
  }
  private custConfirm() {
    const custForm: any = this.$refs.custForm
    custForm.validate((valid: any) => {
      if (!valid) return false
      const cType = (this as any).custType
      if (cType === '0' && custForm.audit === 1 && this.fileData.every((it: any) => it && it.fileStatus !== '1')) {
        this.$message.error('存在未上传文件')
        return
      }
      this.fileLoading = true
      const params: any = {
        ...this.custForm,
        number: this.customsNum
      }
      auditJHTFile(params)
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '审核成功'
          })
          this.fileLoading = false
          this.custCancel()
          this.getTableData()
        })
        .catch((err: any) => {
          this.isFileVisible = false
          this.fileLoading = false
          return err
        })
    })
  }

  private auditFileRow(row: any) {
    this.dialogAudit = true
    this.auditForm = {
      ...row
    }
  }
  private resetAudit() {
    this.dialogAudit = false
    this.auditForm = {
      status: undefined
    }
    const root: any = this.$refs.auditForm
    root.clearValidate()
  }
  private auditConfirm() {
    this.auditLoading = true
    const params: any = {
      ...this.auditForm
    }
    auditFile(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '审核成功'
        })
        this.auditLoading = false
        this.resetAudit()
        this.getFileData()
      })
      .catch((err: any) => {
        this.dialogAudit = false
        this.auditLoading = false
        return err
      })
  }
  private downFile(row: any) {
    // 下载
    if (row.url) {
      const url = process.env.VUE_APP_OSS_PATH + row.url
      window.open(url)
    } else {
      this.$message.error('暂无文件可下载')
    }
  }
  private onFile(row: any, el: any) {
    // 上传
    this.fileRow = row
  }

  private saveFile() {
    this.fileLoading = true
    const params: any = {
      ...this.fileRow,
      status: '0',
      url: this.fileUrl
    }
    saveFile(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '上传成功'
        })
        this.fileLoading = false
        this.getFileData()
      })
      .catch((err: any) => {
        this.fileLoading = false
        return err
      })
  }
  private uploadFileTwo(params: any): void {
    const { file } = params
    this.$upload(true, file, `jht-admin/customsOrder/${dayjs().valueOf() + '/' + file.name}`)
      .then((res: any) => {
        const { data } = res
        this.fileUrl = data
        this.saveFile()
      })
      .catch((err:any) => {
        return err
      })
  }
  private uploadFileOne(params: any): void {
    const { file } = params
    this.$upload(true, file, `jht-admin/customsOrder/${dayjs().valueOf() + '/' + file.name}`)
      .then((res: any) => {
        const { data } = res
        const obj = (this as any).statusForm
        obj.url = data
      })
      .catch((err:any) => {
        return err
      })
  }

  // 监听文件删除
  private removeFile(file: any, fileList: any[]) {
    this.$deleteLoad(file.url, true)
      .then((res: any) => {
        // this.$message.success(`删除成功`)
      })
      .catch((err: any) => {
        return err
      })
    const form = (this as any).statusForm
    form.url = ''
  }

  private cancelSupperier() {
    this.isSupperierVisible = false
    this.resetSupperierForm()
  }
  private cancelStatus() {
    this.isStatusVisible = false
    this.resetStatusForm()
  }
  // 重置表单
  private resetStatusForm() {
    this.statusForm = {
      declareStatus: undefined,
      inspectionStatus: undefined,
      url: undefined
    }
    this.isStatus = ''
    const root: any = this.$refs.statusForm
    root.clearValidate()
  }
  private resetSupperierForm() {
    this.supperierForm = {
      supplyId: undefined,
      supplyName: undefined,
      number: undefined,
      name: undefined,
      blNo: undefined,
      isDefault: 0
    }
    const root: any = this.$refs.supperierForm
    root.clearValidate()
  }

  private viewData(row: any) {
    // 查看
    this.detailShow = true
    const root: any = this.$refs.detailForm
    root.setData(row)
  }
  private deleteData(row: any) {
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
        let func = null
        if (row.type === '3') {
          func = deletePallet // 拆柜打托
        } else {
          func = deleteOrder
        }
        if (!func) return
        func(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getAllData()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }

  private getAllData(val?: any) {
    const type = (this as any).custType
    if (type === '1') { // 客户
      this.searchForm.orderType = '1'
    } else if (type === '3') { // 供应商
      this.searchForm.orderType = '0'
    }
    if (this.selectType === '1') {
      this.searchForm.so = this.searchForm.code
      this.searchForm.cabinet = undefined
      this.searchForm.number = undefined
    } else if (this.selectType === '2') {
      this.searchForm.cabinet = this.searchForm.code
      this.searchForm.so = undefined
      this.searchForm.number = undefined
    } else if (this.selectType === '3') {
      this.searchForm.number = this.searchForm.code
      this.searchForm.cabinet = undefined
      this.searchForm.so = undefined
    }
    if (Array.isArray(this.searchForm.orderTime) && this.searchForm.orderTime.length > 0) {
      this.searchForm.startDate = this.searchForm.orderTime[0] + ' 00:00:00'
      this.searchForm.endDate = this.searchForm.orderTime[1] + ' 23:59:59'
    }
    if (this.searchForm.orderType === '0') { // 销售
      this.searchForm.sellerId = this.searchForm.custId
      this.searchForm.customerId = type === '3' ? '0' : this.searchForm.comId
    } else if (this.searchForm.orderType === '1') { // 采购
      this.searchForm.customerId = this.searchForm.custId
      this.searchForm.sellerId = undefined
    }
    this.tableData = []
    this.getTableData(val)
  }
  // 列表查询
  private getTableData(val?: any): void {
    this.loading = true
    const type = (this as any).custType
    const { comId, comType, orderType, custId, orderTime, code, ...form }: any = this.searchForm
    if (val) {
      this.page = val
    }
    const params: any = {
      page: this.page,
      size: this.size,
      model: {
        ...form
      }
    }
    getOrderList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.tableData = data.result || []
        this.total = data.total
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private queryAllData(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const params: any = {
      page: this.page,
      size: this.size,
      model: {
        ...this.selectValue
      }
    }
    getContainList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.tableData = data.result || []
        this.total = data.total
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

  // 分页
  private handleSizeChange(val: string) {
    this.size = Number(val)
    if (this.searchName === '1') {
      this.getAllData()
    } else {
      this.queryAllData()
    }
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    if (this.searchName === '1') {
      this.getAllData()
    } else {
      this.queryAllData()
    }
  }
  private async created() {
    const type = (this as any).custType
    const subType = (this as any).custSubtype
    this.searchForm.custId = (this as any).custId
    this.searchForm.orderTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    this.loading = true
    this.getWarehouseList()
    this.getAllData()
  }
}
</script>

<style lang="scss" scoped>
  .el-dropdown-link {
    margin-left: 10px;
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
