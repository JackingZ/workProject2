<template>
  <div
    v-if="render"
    v-loading="loading"
    class="app-container my-scrollbar"
  >
    <div
      class="order-info"
    >
      <div class="base-info card">
        <div class="title">
          <span>基础信息</span>
          <div class="btn">
            <el-button
              type="text"
              size="medium"
              style="padding: 0"
              @click="getOrderDetails(row)"
            >
              刷新
            </el-button>
            <el-button
              type="text"
              size="medium"
              style="padding: 0"
              @click="goBack"
            >
              返回
            </el-button>
          </div>
        </div>
        <div
          class="info"
          style="padding-bottom: 10px"
        >
          <div class="info-item">
            <span class="label">交货区域：</span>
            <span class="value">{{ (row.delivery || {}).value }}</span>
          </div>
          <div class="info-item">
            <span class="label">目的国：</span>
            <span class="value">{{ (row.country || {}).value }}</span>
          </div>
          <div class="info-item">
            <span class="label">目的地类型：</span>
            <span
              v-if="row.addressType === '0'"
              class="value"
            >
              FBA
            </span>
            <span
              v-if="row.addressType === '1'"
              class="value"
            >
              私人地址
            </span>
            <span
              v-if="row.addressType === '2'"
              class="value"
            >
              自有海外仓
            </span>
          </div>
          <div
            v-if="row.addressType !== '1'"
            class="info-item"
          >
            <span class="label">目的仓代码：</span>
            <span class="value">{{ (row.fbastore || {}).code }}</span>
          </div>
          <div class="info-item">
            <span class="label">业务类型：</span>
            <span
              v-if="row.type === '0'"
              class="value"
            >
              空运
            </span>
            <span
              v-if="row.type === '1'"
              class="value"
            >
              海运
            </span>
            <span
              v-if="row.type === '2'"
              class="value"
            >
              铁路
            </span>
            <span
              v-if="row.type === '3'"
              class="value"
            >
              快递
            </span>
            <span
              v-if="row.type === '4'"
              class="value"
            >
              卡航
            </span>
          </div>
          <div
            v-if="['1', '2'].includes(row.type)"
            class="info-item"
          >
            <span class="label">拼箱/整柜：</span>
            <span class="value">{{ (row.container || {}).type === '0' ? '拼箱' : '整柜' }}</span>
          </div>
          <div
            v-if="['1', '2'].includes(row.type)"
            class="info-item"
          >
            <span class="label">是否锁舱：</span>
            <span class="value">{{ row.ifLocked ? '是' : '否' }}</span>
          </div>
          <div class="info-item">
            <span class="label">报关方式：</span>
            <span class="value">{{ row.customs0 === '0' ? '普通报关' : '出口退税' }}</span>
            <el-button
              type="text"
              :disabled="row.ifLoadingComplete === 1"
              size="medium"
              style="margin-left: 5px;padding: 0"
              @click="editCustoms"
            >
              修改
            </el-button>
          </div>
          <div class="info-item">
            <span class="label">进口商：</span>
            <span class="value">{{ row.customs1 === '0' ? '自有进口商报关' : '无进口商' }}</span>
          </div>
          <div class="info-item">
            <span class="label">目的港派送方式：</span>
            <span
              v-if="row.deliveryWay === '0'"
              class="value"
            >
              快递
            </span>
            <span
              v-else-if="row.deliveryWay === '1'"
              class="value"
            >
              卡派
            </span>
            <span
              v-else-if="row.deliveryWay === '2'"
              class="value"
            >
              自提
            </span>
            <span
              v-else-if="row.deliveryWay === '3'"
              class="value"
            >
              整柜直装
            </span>
            <el-button
              type="text"
              :disabled="row.ifLoadingComplete === 0"
              size="medium"
              style="margin-left: 5px;padding: 0"
              @click="editDeliveryWay"
            >
              修改
            </el-button>
          </div>
          <div class="info-item">
            <span class="label">关税：</span>
            <span class="value">{{ row.includeTax ? '包税' : '不包税' }}</span>
          </div>
        </div>
      </div>
      <div class="base-info card">
        <div class="title">
          <span>收货人</span>
          <div
            v-if="row.addressType === '1'"
            class="btn"
          >
            <el-button
              type="text"
              size="medium"
              style="padding: 0"
              @click="updateAddress"
            >
              修改
            </el-button>
          </div>
        </div>
        <div
          class="info"
          style="padding-bottom: 10px"
        >
          <div class="info-item">
            <span class="label">地址类型：</span>
            <span
              v-if="row.addressType === '0'"
              class="value"
            >
              FBA
            </span>
            <span
              v-if="row.addressType === '1'"
              class="value"
            >
              私人地址
            </span>
            <span
              v-if="row.addressType === '2'"
              class="value"
            >
              自有海外仓
            </span>
          </div>
          <div class="info-item">
            <span class="label">目的仓代码：</span>
            <span class="value">{{ (row.fbastore || {}).code || '' }}</span>
          </div>
          <div class="info-item">
            <span class="label">收货人：</span>
            <span class="value">{{ (row.consignee || {}).contact }}</span>
          </div>
          <div class="info-item">
            <span class="label">联系电话：</span>
            <span class="value">{{ (row.consignee || {}).tel }}</span>
          </div>
          <div class="info-item">
            <span class="label">国家：</span>
            <span class="value">{{ (row.consignee || {}).countryCode }}</span>
          </div>
          <div class="info-item">
            <span class="label">省份：</span>
            <span class="value">{{ (row.consignee || {}).provinceCode }}</span>
          </div>
          <div class="info-item">
            <span class="label">城市：</span>
            <span class="value">{{ (row.consignee || {}).city }}</span>
          </div>
          <div class="info-item">
            <span class="label">邮编：</span>
            <span class="value">{{ (row.consignee || {}).postal }}</span>
          </div>
          <div
            class="info-item"
            style="width: 100%"
          >
            <span class="label">详细地址一：</span>
            <span class="value">{{ ((row.consignee || {}).address || '').split('；')[0] }}</span>
          </div>
          <div
            v-if="((row.consignee || {}).address || '').split('；')[1]"
            class="info-item"
            style="width: 100%"
          >
            <span class="label">详细地址二：</span>
            <span class="value">{{ ((row.consignee || {}).address || '').split('；')[1] }}</span>
          </div>
          <div
            v-if="((row.consignee || {}).address || '').split('；')[2]"
            class="info-item"
            style="width: 100%"
          >
            <span class="label">详细地址三：</span>
            <span class="value">{{ ((row.consignee || {}).address || '').split('；')[2] }}</span>
          </div>
        </div>
      </div>
      <el-row class="other-info">
        <el-col
          :span="14"
          style="padding-right: 8px"
        >
          <div class="order-list card">
            <div class="title">
              <span>关联订单</span>
              <div class="btn">
                <el-button
                  type="text"
                  size="medium"
                  :disabled="measureOrderList.length === 0 || row.ifLoadingComplete === 1"
                  style="padding: 0"
                  @click="resetMeasure"
                >
                  重新计量
                </el-button>
                <el-button
                  type="text"
                  size="medium"
                  :disabled="!row.examine || examineOrderList.length === 0 || row.ifLoadingComplete === 1"
                  style="padding: 0"
                  @click="resetExamine"
                >
                  重新验货
                </el-button>
                <el-button
                  type="text"
                  size="medium"
                  :disabled="row.ifLoadingComplete === 1"
                  style="padding: 0"
                  @click="expressOrder"
                >
                  快递下单
                </el-button>
                <el-button
                  type="text"
                  size="medium"
                  :disabled="row.ifLoadingComplete === 1"
                  style="padding: 0"
                  @click="generateDeclarationOrder"
                >
                  报关下单
                </el-button>
              </div>
            </div>
            <div v-loading="otherOrderLoading">
              <div
                v-if="otherOrderList.length"
                class="other-order-list my-scrollbar"
              >
                <div
                  v-for="item in measureOrderList"
                  :key="item.measureId"
                  class="other-order"
                >
                  <div class="order-header">
                    <div class="order-no">
                      <i class="icon measure" />
                      <span class="no">
                        计量单号：{{ item.measureId || '--' }}
                      </span>
                    </div>
                    <div
                      :class="['status', 'status' + (item.delFlag ? 0 : 3)]"
                      style="margin-right: 5px"
                    >
                      {{ item.delFlag ? '无效' : '有效' }}
                    </div>
                    <div :class="['status', 'status' + item.measureStatus]">
                      {{ (measureStatusList.find(e => e.id === item.measureStatus) || {}).name }}
                    </div>
                  </div>
                  <div class="other-order-info">
                    <div class="other-order-info-item w100">
                      <span class="label">计量仓库：</span>
                      <span class="value">{{ item.warehouseName }}</span>
                    </div>
                    <div class="other-order-info-item w33">
                      <span class="label">总件数：</span>
                      <span class="value">{{ item.boxNum }}</span>
                    </div>
                    <div class="other-order-info-item w33">
                      <span class="label">总体积：</span>
                      <span class="value">{{ item.totalV }} CBM</span>
                    </div>
                    <div class="other-order-info-item w33">
                      <span class="label">总重量：</span>
                      <span class="value">{{ item.totalW }} KGS</span>
                    </div>
                  </div>
                  <div class="option-info">
                    <div style="flex: 1">
                      <span class="option-info-item">
                        计量人：{{ item.applicant }}
                      </span>
                      <span class="option-info-item">
                        创建时间：{{ item.createTime }}
                      </span>
                      <span class="option-info-item">
                        完成时间：{{ item.actualMeasureTime }}
                      </span>
                    </div>
                    <!--<el-button
                      type="text"
                      size="medium"
                    >
                      取消
                    </el-button>-->
                  </div>
                </div>
                <div
                  v-for="item in examineOrderList"
                  :key="item.examiningNo"
                  class="other-order"
                >
                  <div class="order-header">
                    <div class="order-no">
                      <i class="icon examine" />
                      <span class="no">
                        验货单号：{{ item.examiningNo || '--' }}
                      </span>
                    </div>
                    <div
                      :class="['status', 'status' + (item.delFlag ? 0 : 3)]"
                      style="margin-right: 5px"
                    >
                      {{ item.delFlag ? '无效' : '有效' }}
                    </div>
                    <div :class="['status', 'status' + item.status]">
                      {{ (examineStatusList.find(e => e.id === item.status) || {}).name }}
                    </div>
                  </div>
                  <div class="other-order-info">
                    <div class="other-order-info-item w100">
                      <span class="label">验货仓库：</span>
                      <span class="value">{{ item.warehouseName }}</span>
                    </div>
                    <div class="other-order-info-item w33">
                      <span class="label">验货属性：</span>
                      <span class="value">{{ item.categoriesStr }}</span>
                    </div>
                    <div class="other-order-info-item w33">
                      <span class="label">验货结果：</span>
                      <span
                        v-if="item.validated === 1"
                        class="value"
                      >通过</span>
                      <span
                        v-else-if="item.validated === 0"
                        class="value"
                      >不通过</span>
                      <span
                        v-else
                        class="value"
                      >--</span>
                    </div>
                  </div>
                  <div class="option-info">
                    <div style="flex: 1">
                      <span class="option-info-item">
                        验货人：{{ item.operatorName }}
                      </span>
                      <span class="option-info-item">
                        创建时间：{{ item.createTime }}
                      </span>
                      <span class="option-info-item">
                        完成时间：{{ item.completeTime }}
                      </span>
                    </div>
                    <!--<el-button
                      type="text"
                      size="medium"
                    >
                      取消
                    </el-button>-->
                  </div>
                </div>
                <div
                  v-for="item in expressOrderList"
                  :key="item.id"
                  class="other-order"
                >
                  <div class="order-header">
                    <div class="order-no">
                      <i class="icon express" />
                      <span class="no">
                        快递单号：{{ item.identificationNo ? (item.identificationNo.split(',')[0] || '--') : '--' }}
                      </span>
                    </div>
                  </div>
                  <div class="other-order-info">
                    <div class="other-order-info-item w100">
                      <span class="label">快递公司：</span>
                      <span class="value">{{ item.expressName }}</span>
                    </div>
                    <div class="other-order-info-item w33">
                      <span class="label">目的国：</span>
                      <span class="value">{{ item.destinationCountry }}</span>
                    </div>
                    <div class="other-order-info-item w33">
                      <span class="label">收件人：</span>
                      <span class="value">{{ item.consigneeName }}</span>
                    </div>
                  </div>
                  <div class="option-info">
                    <div style="flex: 1">
                      <span class="option-info-item">
                        下单时间：{{ item.createTime }}
                      </span>
                    </div>
                    <!--<el-button
                      type="text"
                      size="medium"
                    >
                      取消
                    </el-button>-->
                  </div>
                </div>
                <div
                  v-for="item in declareOrderList"
                  :key="item.declarationNo"
                  class="other-order"
                >
                  <div class="order-header">
                    <div class="order-no">
                      <i class="icon declare" />
                      <span class="no">
                        报关单号：{{ item.declarationNo }}
                      </span>
                    </div>
                  </div>
                  <div class="other-order-info">
                    <div class="other-order-info-item w33">
                      <span class="label">报关类型：</span>
                      <span
                        v-if="item.orderDeclare === '0'"
                        class="value"
                      >普通报关</span>
                      <span
                        v-else-if="item.orderDeclare === '1'"
                        class="value"
                      >出口退税</span>
                      <span
                        v-else-if="item.orderDeclare === '2'"
                        class="value"
                      >整柜买单</span>
                      <span
                        v-else
                        class="value"
                      >--</span>
                    </div>
                    <div class="other-order-info-item w33">
                      <span class="label">报关状态：</span>
                      <span class="value">
                        {{ (declareList.find(e => `${item.declareStatus}` === e.id) || {}).name }}
                      </span>
                    </div>
                    <div class="other-order-info-item w33">
                      <span class="label">报检状态：</span>
                      <span class="value">
                        {{ (inspectList.find(e => e.id === `${item.inspectionStatus}`) || {}).name }}
                      </span>
                    </div>
                    <div class="other-order-info-item w33">
                      <span class="label">文件状态：</span>
                      <span class="value">
                        <span v-if="item.fileStatus === '0'">待审核</span>
                        <span v-else-if="item.fileStatus === '1'">部分审核(通过)</span>
                        <span v-else-if="item.fileStatus === '3'">部分审核(异常)</span>
                        <span v-else-if="item.fileStatus === '2'">审核完成</span>
                        <span v-else>--</span>
                      </span>
                    </div>
                  </div>
                  <div class="option-info">
                    <div style="flex: 1">
                      <span class="option-info-item">
                        创建时间：{{ item.createTime }}
                      </span>
                    </div>
                    <el-button
                      type="text"
                      size="medium"
                      @click="cancelDeclarationOrder"
                    >
                      取消
                    </el-button>
                  </div>
                </div>
              </div>
              <div
                v-if="otherOrderList.length === 0"
                class="none-text"
              >
                暂无记录
              </div>
            </div>
          </div>
        </el-col>
        <el-col
          :span="10"
          style="padding-left: 8px"
        >
          <div class="order-option-info">
            <div
              class="option-info card"
            >
              <div class="title">
                <span>操作日志</span>
                <!--<div class="btn">
                  <el-checkbox v-model="checked">
                    仅看与我相关
                  </el-checkbox>
                </div>-->
              </div>
              <div
                v-loading="logLoading"
                class="option-list my-scrollbar"
              >
                <div v-if="logList.length">
                  <div
                    v-for="item in logList"
                    :key="item.id"
                    class="option-item"
                  >
                    <div class="option">
                      {{ item.logs }}
                    </div>
                    <div class="option-user">
                      <span>操作人：{{ item.userName }}</span>
                      <span>{{ item.createTime }}</span>
                    </div>
                  </div>
                </div>
                <div
                  v-if="logList.length === 0"
                  class="none-text"
                >
                  暂无记录
                </div>
              </div>
              <div style="text-align: right;padding-bottom: 15px">
                <el-pagination
                  :current-page.sync="pagination.page"
                  :page-size="pagination.size"
                  small
                  layout="total, prev, pager, next"
                  :total="pagination.total"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </div>
            <div class="status-info card">
              <div class="title">
                <span>订单追踪</span>
              </div>
              <div
                v-loading="statusLoading"
                class="status-list"
              >
                <div
                  v-if="statusList.length"
                  class="status-item-warp my-scrollbar"
                >
                  <div
                    v-for="(item, i) in statusList"
                    :key="item.time"
                    class="status-item"
                    :class="{active: i === 0}"
                  >
                    <div class="status-text-warp">
                      <div class="status-text">
                        {{ item.statusName }}
                      </div>
                      <el-popover
                        v-model="item.visible"
                        title="文件下载"
                        placement="top"
                        trigger="click"
                      >
                        <el-table
                          v-loading="fileLoading"
                          :data="fileList"
                        >
                          <el-table-column
                            width="250"
                            property="fileName"
                            label="文件名称"
                          />
                          <el-table-column
                            width="150"
                            label="操作"
                          >
                            <template slot-scope="scope">
                              <el-button
                                size="small"
                                type="text"
                                @click="downloadFile(scope.row)"
                              >
                                文件下载
                              </el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                        <el-button
                          v-if="item.ifFile"
                          slot="reference"
                          size="small"
                          style="padding: 0"
                          type="text"
                          @click="showFileList(item)"
                        >
                          文件下载
                        </el-button>
                      </el-popover>
                    </div>
                    <div class="status-describe">
                      <div class="time">
                        {{ item.updateAt }}
                      </div>
                      <div class="describe">
                        {{ item.describe || '' }}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-else
                  class="none"
                >
                  <div class="none-text">
                    暂无记录
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div
      class="serve-info-wrap"
    >
      <div class="serve-info card">
        <div class="lsc-info">
          <div class="header">
            <svg-icon
              v-if="row.type === '0'"
              name="airplane"
              style="color: #2291E6;width: 20px;height: 20px;"
            />
            <svg-icon
              v-if="row.type === '1'"
              name="ship"
              style="color: #2291E6;width: 20px;height: 20px;"
            />
            <svg-icon
              v-if="row.type === '2'"
              name="railway"
              style="color: #2291E6;width: 20px;height: 20px;"
            />
            <span class="lsc-name">{{ (row.lsc || {}).value }}</span>
            <el-button
              type="text"
              size="medium"
              :disabled="row.ifLoadingComplete === 1"
              @click="editLsc"
            >
              修改
            </el-button>
          </div>
          <div
            v-if="lscConfig.departureName"
            class="port departure"
          >
            {{ lscConfig.departureName.split(',')[0] }}
          </div>
          <div
            v-if="lscConfig.destinationName"
            class="port destination"
          >
            {{ lscConfig.destinationName.split(',')[0] }}
          </div>
        </div>
        <div class="price-info">
          <div class="title">
            费用明细
          </div>
          <div class="price-list">
            <div class="price-item">
              <span>运费</span>
              <!--<span>
                {{ (row.price || {}).aprice || (row.price || {}).price || '&#45;&#45;' }} {{ (row.price || {}).currencyId }}
              </span>-->
              <span>
                {{ (row.price || {}).atotalPrice || (row.price || {}).totalPrice || '--' }} {{ (row.price || {}).currencyId }}
              </span>
            </div>
            <!--<div class="price-item">
              <span>关税</span>
              <span>&#45;&#45;</span>
              <span>￥&#45;&#45;</span>
            </div>
            <div class="price-item">
              <span>商品附加费</span>
              <span>&#45;&#45;</span>
              <span>￥&#45;&#45;</span>
            </div>-->
          </div>
          <div class="total-price">
            <span>预估费用：</span>
            <div>
              {{ (row.price || {}).atotalPrice || (row.price || {}).totalPrice || '--' }} {{ (row.price || {}).currencyId }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :visible="visible"
      width="750px"
      @close="dialogClose"
    >
      <div
        slot="title"
        style="display: flex;align-items: center;justify-content: space-between"
      >
        <span>
          选择服务
        </span>
        <div style="background: #F2F3F5;border-radius: 4px;padding: 5px;font-size: 14px;font-weight: 400;color: #4E5969;margin-right: 30px;display: flex">
          <div
            style="padding: 6px 16px;border-radius: 2px;cursor: pointer"
            :class="{activeServerType: serverType === '1'}"
            @click="serverTypeChange('1')"
          >
            服务渠道
          </div>
          <div
            style="padding: 6px 16px;border-radius: 2px;cursor: pointer"
            :class="{activeServerType: serverType === '2'}"
            @click="serverTypeChange('2')"
          >
            发货渠道
          </div>
        </div>
      </div>
      <div v-loading="dialogLoading">
        <div v-if="serverType === '1'">
          <div class="info">
            <div class="info-item p">
              <span class="label">业务类型：</span>
              <span
                v-if="row.type === '0'"
                class="value"
              >
                空运
              </span>
              <span
                v-if="row.type === '1'"
                class="value"
              >
                海运
              </span>
              <span
                v-if="row.type === '2'"
                class="value"
              >
                铁路
              </span>
              <span
                v-if="row.type === '3'"
                class="value"
              >
                快递
              </span>
              <span
                v-if="row.type === '4'"
                class="value"
              >
                卡航
              </span>
            </div>
            <div class="info-item p">
              <span class="label">交货区域：</span>
              <span class="value">{{ (row.delivery || {}).value }}</span>
            </div>
            <div class="info-item p">
              <span class="label">目的国：</span>
              <span class="value">{{ (row.country || {}).value }}</span>
            </div>
            <div class="info-item p">
              <span class="label">目的地类型：</span>
              <span
                v-if="row.addressType === '0'"
                class="value"
              >
                FBA
              </span>
              <span
                v-if="row.addressType === '1'"
                class="value"
              >
                私人地址
              </span>
              <span
                v-if="row.addressType === '2'"
                class="value"
              >
                自有海外仓
              </span>
            </div>
            <div
              v-if="row.addressType !== '1'"
              class="info-item p"
            >
              <span class="label">目的仓代码：</span>
              <span class="value">{{ (row.fbastore || {}).code || '--' }}</span>
            </div>
            <div
              v-if="row.addressType === '1'"
              class="info-item p"
            >
              <span class="label">目的城市：</span>
              <span class="value">{{ (row.consignee || {}).city || '--' }}</span>
            </div>
            <div class="info-item p">
              <span class="label">报关方式：</span>
              <span class="value">{{ row.customs0 === '0' ? '普通报关' : '出口退税' }}</span>
            </div>
          </div>
          <div class="info">
            <div
              class="info-item p"
              style="width: 50%"
            >
              <span class="label">目的港派送方式：</span>
              <span class="value">
                <el-radio-group
                  v-model="form.deliveryWay"
                  size="small"
                  @change="getLscListByPrice"
                >
                  <el-radio-button
                    v-if="row.type !== '3' && (row.container || {}).type !== '1' && row.addressType !== '2'"
                    label="0"
                  >
                    快递
                  </el-radio-button>
                  <el-radio-button
                    v-if="row.type !== '3' && (row.container || {}).type !== '1' && row.addressType !== '2'"
                    label="1"
                  >
                    卡派
                  </el-radio-button>
                  <el-radio-button
                    v-if="(row.type === '1' || row.type === '2') && (row.container || {}).type === '1' && row.addressType !== '2'"
                    label="3"
                  >
                    整柜直送
                  </el-radio-button>
                  <el-radio-button
                    v-if="row.type !== '3' && row.addressType !== '2'"
                    label="2"
                  >
                    自提
                  </el-radio-button>
                  <el-radio-button
                    v-if="row.addressType === '2'"
                    label="4"
                  >
                    到仓
                  </el-radio-button>
                </el-radio-group>
              </span>
            </div>
            <div
              class="info-item p"
              style="width: 50%"
            >
              <span class="label">目的港关税：</span>
              <span class="value">
                <el-radio-group
                  v-model="form.includeTax"
                  size="small"
                  @change="getLscListByPrice"
                >
                  <el-radio-button :label="true">
                    包税
                  </el-radio-button>
                  <el-radio-button :label="false">
                    不包税
                  </el-radio-button>
                </el-radio-group>
              </span>
            </div>
          </div>
          <div style="font-size: 14px;color: #303133">
            当前服务：{{ (row.lsc || {}).value }}
          </div>
          <el-table
            :data="lscList"
            max-height="300px"
            style="width: 100%;margin-top: 10px"
            border
          >
            <el-table-column
              width="50"
            >
              <template slot-scope="scope">
                <div style="text-align: center;">
                  <el-radio
                    v-model="selectRowId"
                    :disabled="(row.lsc || {}).key === scope.row.id"
                    :label="scope.row.id"
                  >
                    &nbsp;
                  </el-radio>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="服务名称"
            >
              <template slot-scope="scope">
                {{ `${scope.row.name}【${scope.row.lsId}】` }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="serverType === '2'">
          <div class="info">
            <div class="info-item p">
              <span class="label">交货区域：</span>
              <span class="value">{{ (row.delivery || {}).value }}</span>
            </div>
            <div class="info-item p">
              <span class="label">目的地类型：</span>
              <span
                v-if="row.addressType === '0'"
                class="value"
              >
                FBA
              </span>
              <span
                v-if="row.addressType === '1'"
                class="value"
              >
                私人地址
              </span>
              <span
                v-if="row.addressType === '2'"
                class="value"
              >
                自有海外仓
              </span>
            </div>
            <div
              v-if="row.addressType !== '1'"
              class="info-item p"
            >
              <span class="label">目的仓代码：</span>
              <span class="value">{{ (row.fbastore || {}).code || '--' }}</span>
            </div>
            <div
              v-if="row.addressType === '1'"
              class="info-item p"
            >
              <span class="label">目的城市：</span>
              <span class="value">{{ (row.consignee || {}).city || '--' }}</span>
            </div>
            <div class="info-item p">
              <span class="label">报关方式：</span>
              <span class="value">{{ row.customs0 === '0' ? '普通报关' : '出口退税' }}</span>
            </div>
          </div>
          <div class="info">
            <div
              class="info-item p"
              style="width: 50%"
            >
              <span class="label">目的国：</span>
              <span class="value">
                <el-select
                  v-model="form.countryId"
                  size="mini"
                  clearable
                  filterable
                  placeholder="请选择"
                  style="width: 200px;"
                  @focus="getCountryList"
                  @change="getLscList"
                >
                  <el-option
                    v-for="item in countryList"
                    :key="item.id"
                    :label="`${item.name}-${item.alias}`"
                    :value="item.id"
                  />
                </el-select>
              </span>
            </div>
            <div
              class="info-item p"
              style="width: 50%"
            >
              <span class="label">业务类型：</span>
              <span class="value">
                <el-radio-group
                  v-model="form.type"
                  size="small"
                  @change="getLscList"
                >
                  <el-radio-button label="0">
                    空运
                  </el-radio-button>
                  <el-radio-button label="1">
                    海运
                  </el-radio-button>
                  <el-radio-button label="2">
                    铁路
                  </el-radio-button>
                  <!--<el-radio-button label="3">
                    快递
                  </el-radio-button>-->
                  <el-radio-button label="4">
                    卡航
                  </el-radio-button>
                </el-radio-group>
              </span>
            </div>
            <div
              class="info-item p"
              style="width: 50%"
            >
              <span class="label">目的港关税：</span>
              <span class="value">
                <el-radio-group
                  v-model="form.includeTax"
                  size="small"
                  @change="getLscList"
                >
                  <el-radio-button :label="true">
                    包税
                  </el-radio-button>
                  <el-radio-button :label="false">
                    不包税
                  </el-radio-button>
                </el-radio-group>
              </span>
            </div>
            <div
              class="info-item p"
              style="width: 50%"
            >
              <span class="label">目的港派送方式：</span>
              <span class="value">
                <el-radio-group
                  v-model="form.deliveryWay"
                  size="small"
                  @change="getLscList"
                >
                  <el-radio-button
                    v-if="form.type !== '3' && (row.container || {}).type !== '1'"
                    label="0"
                  >
                    快递
                  </el-radio-button>
                  <el-radio-button
                    v-if="form.type !== '3' && (row.container || {}).type !== '1'"
                    label="1"
                  >
                    卡派
                  </el-radio-button>
                  <el-radio-button
                    v-if="(form.type === '1' || form.type === '2') && (row.container || {}).type === '1'"
                    label="3"
                  >
                    整柜直送
                  </el-radio-button>
                  <el-radio-button
                    v-if="form.type !== '3'"
                    label="2"
                  >
                    自提
                  </el-radio-button>
                  <el-radio-button
                    v-if="row.addressType === '2'"
                    label="4"
                  >
                    到仓
                  </el-radio-button>
                </el-radio-group>
              </span>
            </div>
          </div>
          <div style="font-size: 14px;color: #303133">
            当前服务：{{ (row.transChannel || {}).name }}
          </div>
          <el-table
            :data="lscList"
            max-height="300px"
            style="width: 100%;margin-top: 10px"
            border
          >
            <el-table-column
              width="50"
            >
              <template slot-scope="scope">
                <div style="text-align: center;">
                  <el-radio
                    v-model="selectRowId"
                    :disabled="(row.transChannel || {}).id === scope.row.id"
                    :label="scope.row.id"
                  >
                    &nbsp;
                  </el-radio>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="服务名称"
            >
              <template slot-scope="scope">
                {{ `${scope.row.name}【${scope.row.lsId}】` }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div
        slot="footer"
        style="text-align: right;"
      >
        <el-button
          size="small"
          :disabled="dialogLoading"
          @click="visible = false"
        >
          取 消
        </el-button>
        <el-button
          type="primary"
          size="small"
          :disabled="dialogLoading"
          @click="updateServer"
        >
          保 存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible="visibleCustoms"
      width="500px"
      title="报关方式"
      @close="dialogClose"
    >
      <div v-loading="dialogLoading">
        <!--<div style="font-size: 12px;color: #999;line-height: 20px">
          说明：如果符合修改服务的条件， 并且改了服务，此时要人为判断需不需要重新计量，是否需要重新验货，是否需要产生快递单或者取消快递单等等。
        </div>-->
        <el-radio-group
          v-model="form.customs"
          size="small"
        >
          <el-radio label="0">
            普通报关
          </el-radio>
          <el-radio label="1">
            出口退税
          </el-radio>
        </el-radio-group>
      </div>
      <div
        slot="footer"
        style="text-align: right;"
      >
        <el-button
          size="small"
          :disabled="dialogLoading"
          @click="visibleCustoms = false"
        >
          取 消
        </el-button>
        <el-button
          type="primary"
          size="small"
          :disabled="dialogLoading"
          @click="updateCustoms"
        >
          保 存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible="visibleDeliveryWay"
      width="550px"
      title="派送方式"
      @close="dialogClose"
    >
      <div v-loading="dialogLoading">
        <!--<div style="font-size: 12px;color: #999;line-height: 20px">
          说明：如果符合修改服务的条件， 并且改了服务，此时要人为判断需不需要重新计量，是否需要重新验货，是否需要产生快递单或者取消快递单等等。
        </div>-->
        <el-radio-group
          v-model="form.deliveryWay"
          size="small"
        >
          <el-radio
            v-if="row.type !== '3' && (row.container || {}).type !== '1'"
            label="0"
          >
            快递
          </el-radio>
          <el-radio
            v-if="row.type !== '3' && (row.container || {}).type !== '1'"
            label="1"
          >
            卡派
          </el-radio>
          <el-radio
            v-if="(row.type === '1' || row.type === '2') && (row.container || {}).type === '1'"
            label="3"
          >
            整柜直送
          </el-radio>
          <el-radio
            v-if="row.type !== '3'"
            label="2"
          >
            自提
          </el-radio>
          <el-radio
            v-if="row.addressType === '2'"
            label="4"
          >
            到仓
          </el-radio>
        </el-radio-group>
      </div>
      <div
        slot="footer"
        style="text-align: right;"
      >
        <el-button
          size="small"
          :disabled="dialogLoading"
          @click="visibleDeliveryWay = false"
        >
          取 消
        </el-button>
        <el-button
          type="primary"
          size="small"
          :disabled="dialogLoading"
          @click="updateDeliveryWay"
        >
          保 存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible="visibleAddress"
      width="850px"
      title="修改地址"
      @close="addressDialogClose"
    >
      <div v-loading="dialogLoading">
        <el-form
          ref="addressForm"
          :model="addressForm"
          :rules="formRules"
          label-width="110px"
          size="small"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="收货人"
                prop="contact"
              >
                <el-input
                  v-model="addressForm.contact"
                  :maxlength="100"
                  size="small"
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="联系电话"
                prop="tel"
              >
                <el-input
                  v-model="addressForm.tel"
                  size="small"
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="省份"
                prop="provinceId"
              >
                <el-select
                  v-model="addressForm.provinceId"
                  placeholder="请选择"
                  filterable
                  clearable
                  style="width: 100%"
                  @change="provinceChange"
                  @focus="getStateByCountry"
                >
                  <el-option
                    v-for="item in stateList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="城市"
                prop="cityId"
              >
                <el-select
                  v-model="addressForm.cityId"
                  placeholder="请选择"
                  filterable
                  style="width: 100%"
                  :disabled="!addressForm.provinceId"
                  clearable
                  @focus="getCityByState"
                >
                  <el-option
                    v-for="item in cityList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="邮编"
                prop="postal"
              >
                <el-input
                  v-model="addressForm.postal"
                  :maxlength="30"
                  size="small"
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="详细地址一"
                prop="address"
              >
                <el-input
                  v-model="addressForm.address"
                  :maxlength="30"
                  size="small"
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="详细地址二"
                prop="addressTwo"
              >
                <el-input
                  v-model="addressForm.addressTwo"
                  :maxlength="100"
                  size="small"
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="详细地址三"
                prop="addressThree"
              >
                <el-input
                  v-model="addressForm.addressThree"
                  :maxlength="100"
                  size="small"
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div
        slot="footer"
        style="text-align: right;"
      >
        <el-button
          size="small"
          :disabled="dialogLoading"
          @click="addressDialogClose"
        >
          取 消
        </el-button>
        <el-button
          type="primary"
          size="small"
          :disabled="dialogLoading"
          @click="submitUpdateAddress"
        >
          保 存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import dayjs from 'dayjs'
import {
  getOrderStatusList,
  getOrderStatusFile,
  getOtherOrder,
  getOrderDetails,
  getLscListByPrice,
  updateServer,
  getLogList,
  updateCustoms,
  updateDeliveryWay,
  generateDeclarationOrder,
  cancelDeclarationOrder,
  resetMeasure,
  expressOrder,
  resetExamine,
  getStateByCountry,
  getCityByState,
  updateContact,
  getCountryList,
  getLscList,
  editTrans
} from '@/api/orderlist-at-whole'

@Component({
  name: 'order-update'
})
export default class extends Vue {
  /* data */
  private render: boolean = true
  private checked: boolean = false
  private loading: boolean = false
  private visible: boolean = false
  private visibleAddress: boolean = false
  private visibleCustoms: boolean = false
  private visibleDeliveryWay: boolean = false
  private dialogLoading: boolean = false
  private fileLoading: boolean = false
  private statusLoading: boolean = false
  private logLoading: boolean = false
  private otherOrderLoading: boolean = false
  private addressForm: any = {
    address: '',
    addressThree: '',
    addressTwo: '',
    cityId: '',
    postal: '',
    provinceId: '',
    contact: '',
    tel: ''
  }
  private formRules:any = {
    address: [{ required: true, message: '详细地址一不能为空', trigger: 'blur' }],
    provinceId: [{ required: true, message: '省份不能为空', trigger: 'change' }],
    cityId: [{ required: true, message: '城市不能为空', trigger: 'change' }],
    contact: [{ required: true, message: '收货人不能为空', trigger: 'change' }],
    tel: [
      { required: true, message: '联系电话不能为空', trigger: 'change' },
      { min: 0, max: 20, message: '联系电话最多20位', trigger: 'blur' }
    ],
    postal: [{ required: true, message: '邮编不能为空', trigger: 'blur' }]
  }
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  private serverType: string = '1' // 1服务渠道 2发货渠道
  private row: any = {}
  private lscConfig: any = {}
  private form: any = {
    deliveryWay: '',
    includeTax: '',
    customs: '',
    countryId: '',
    type: ''
  }
  private statusList: any[] = []
  private fileList: any[] = []
  private otherOrderList: any[] = []
  private measureStatusList: any[] = [
    { id: 1, name: '待计量' },
    { id: 2, name: '计量中' },
    { id: 3, name: '已计量' }
  ]
  private examineStatusList: any[] = [
    { id: 1, name: '待验货' },
    { id: 2, name: '验货中' },
    { id: 3, name: '已完成' }
  ]
  private declareList: any[] = [
    { name: '草单已录入', id: '0' },
    { name: '草单已确认', id: '1' },
    { name: '申报单已提交', id: '2' },
    { name: '通关已放行', id: '3' },
    { name: '通关查验', id: '4' },
    { name: '查验放行', id: '5' },
    { name: '退货', id: '6' }
  ]
  private inspectList: any[] = [
    { name: '报检未放行', id: '0' },
    { name: '报检已放行', id: '1' },
    { name: '查验放行', id: '2' },
    { name: '退货', id: '3' }
  ]
  private categories: any[] = [
    {
      name: '普货',
      value: '0'
    },
    {
      name: '纯电',
      value: '2'
    },
    {
      name: '带磁',
      value: '3'
    },
    {
      name: '带电',
      value: '1'
    },
    {
      name: '危险',
      value: '4'
    }
  ]
  private lscList: any[] = []
  private logList: any[] = []
  private stateList: any[] = []
  private cityList: any[] = []
  private countryList: any[] = []
  private selectRowId: any = ''

  get measureOrderList(): any[] {
    return this.otherOrderList.filter(e => e.order_type === 'measure')
  }
  get examineOrderList(): any[] {
    return this.otherOrderList.filter(e => e.order_type === 'examine')
  }
  get expressOrderList(): any[] {
    return this.otherOrderList.filter(e => e.order_type === 'express')
  }
  get declareOrderList(): any[] {
    return this.otherOrderList.filter(e => e.order_type === 'declare')
  }

  /* methods */
  // 获取国家列表
  private getCountryList() {
    if (this.countryList.length) return
    getCountryList()
      .then((res: any) => {
        const data = res.data || {}
        this.countryList = data.result || []
      })
      .catch((err: any) => {
        this.countryList = []
        return err
      })
  }
  private serverTypeChange(val: string) {
    if (this.dialogLoading) return
    this.serverType = val
    this.selectRowId = ''
    if (val === '1') {
      this.form.deliveryWay = this.row.deliveryWay
      this.form.includeTax = this.row.includeTax
      this.form.type = ''
      this.form.countryId = ''
      this.getLscListByPrice()
    }
    if (val === '2') {
      this.form.deliveryWay = ''
      if ((this.row.transChannel || {}).dispatch === '1') {
        this.form.deliveryWay = '0'
      }
      if ((this.row.transChannel || {}).dispatch === '0') {
        this.form.deliveryWay = '1'
      }
      if ((this.row.transChannel || {}).dispatch === '2') {
        this.form.deliveryWay = '2'
      }
      if ((this.row.transChannel || {}).dispatch === '3') {
        this.form.deliveryWay = '3'
      }
      if ((this.row.transChannel || {}).dispatch === '4') {
        this.form.deliveryWay = '4'
      }
      this.form.includeTax = (this.row.transChannel || {}).includeTax
      this.form.type = (this.row.transChannel || {}).subtypeId
      this.form.countryId = ''
      this.getLscList()
    }
  }
  private submitUpdateAddress() {
    const form: any = this.$refs.addressForm
    form.validate((valid: any) => {
      if (valid) {
        const state = this.stateList.find((e: any) => e.id === this.addressForm.provinceId) || {}
        const city = this.cityList.find((e: any) => e.id === this.addressForm.cityId) || {}
        const consignee = this.row.consignee || {}
        const params = {
          city: city.alias,
          cityCode: city.id,
          code: this.row.code,
          contact: consignee.contact,
          email: consignee.email,
          province: state.alias,
          provinceCode: state.abbr,
          tel: consignee.tel,
          ...this.addressForm
        }
        this.dialogLoading = true
        updateContact(params).then(() => {
          this.dialogLoading = false
          this.$message.success('修改成功')
          this.addressDialogClose()
          this.getOrderDetails(this.row)
        }).catch(() => {
          this.dialogLoading = false
        })
      }
    })
  }
  private async provinceChange() {
    this.cityList = []
    this.addressForm.cityId = ''
    await this.getCityByState()
  }
  private async getStateByCountry() {
    if (this.stateList.length) return
    if ((this.row.consignee || {}).countryCode) {
      await getStateByCountry({ countryId: (this.row.consignee || {}).countryCode }).then((res: any) => {
        const data = res.data || {}
        this.stateList = (data.result || []).map((e: any) => {
          if (e.alias) {
            e.label = e.name + '-' + e.alias
          } else {
            e.label = e.name
          }
          return e
        })
      }).catch((err: any) => {
        this.stateList = []
        return err
      })
    }
  }
  private async getCityByState() {
    if (this.cityList.length) return
    if (this.addressForm.provinceId) {
      await getCityByState({ stateId: this.addressForm.provinceId }).then((res: any) => {
        const data = res.data || {}
        this.cityList = (data.result || []).map((e: any) => {
          if (e.alias) {
            e.label = e.name + '-' + e.alias
          } else {
            e.label = e.name
          }
          return e
        })
      }).catch((err: any) => {
        this.cityList = []
        return err
      })
    }
  }
  private async updateAddress() {
    this.visibleAddress = true
    this.dialogLoading = true
    const consignee = this.row.consignee || {}
    this.addressForm = {
      address: (consignee.address || '').split('；')[0],
      addressThree: (consignee.address || '').split('；')[2],
      addressTwo: (consignee.address || '').split('；')[1],
      cityId: consignee.cityCode,
      postal: consignee.postal,
      provinceId: consignee.provinceId,
      contact: consignee.contact,
      tel: consignee.tel
    }
    await this.getStateByCountry()
    await this.getCityByState()
    this.dialogLoading = false
  }
  private addressDialogClose() {
    this.visibleAddress = false
    this.stateList = []
    this.cityList = []
    const form: any = this.$refs.addressForm
    form.clearValidate()
  }
  private goBack() {
    this.row = {}
    this.lscConfig = {}
    this.pagination = {
      page: 1,
      size: 10,
      total: 0
    }
    this.form = {
      deliveryWay: '',
      includeTax: '',
      customs: '',
      countryId: '',
      type: ''
    }
    this.lscList = []
    this.logList = []
    this.fileList = []
    this.statusList = []
    this.otherOrderList = []
    this.selectRowId = ''
    this.$emit('back')
  }
  private resetExamine() {
    this.$msgbox({
      title: '提示',
      message: '请确认操作？',
      showCancelButton: true,
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    }).then(() => {
      const e: any = this.examineOrderList.sort((a: any, b: any) => dayjs(b.createTime).diff(dayjs(a.createTime), 'second'))[0] || {}
      const params = {
        id: e.id
      }
      this.loading = true
      resetExamine(params).then(() => {
        this.loading = false
        this.$message.success('操作成功')
        this.getOrderDetails(this.row)
      }).catch(() => {
        this.loading = false
        this.render = false
        this.$nextTick(() => {
          this.render = true
        })
      })
    }).catch(() => false)
  }
  private getOtherOrder() {
    const params = {
      code: this.row.code,
      id: this.row.id,
      sellerId: (this.row.seller || {}).id
    }
    this.otherOrderLoading = true
    getOtherOrder(params).then((res: any) => {
      this.otherOrderLoading = false
      const data = res.data || {}
      const measure = data.measure || []
      const examine = data.examine || []
      const express = data.express || null
      const declare = data.declare || null
      const otherOrderList = []
      measure.forEach((e: any) => {
        const measurementDetails = e.measurementDetails || []
        const measurementInfo = measurementDetails.reduce((info: any, next: any) => {
          const v = next.length * next.wigth * next.height
          info.totalW = parseFloat((info.totalW + next.weight).toFixed(2))
          info.totalV = parseFloat((info.totalV + (v / 1_000_000)).toFixed(2))
          return info
        }, {
          boxNum: measurementDetails.length, // 总件数
          totalV: 0, // 总体积
          totalW: 0 // 总重量
        })
        otherOrderList.push({
          order_type: 'measure',
          ...e,
          ...measurementInfo
        })
      })
      examine.forEach((e: any) => {
        const categories = e.categories || ''
        const categoriesList = [...new Set([...categories.split(',')])]
        const categoriesStr = this.categories.filter((o: any) => categoriesList.find((c: any) => c === o.value)).map((c: any) => c.name).join('，')
        otherOrderList.push({
          order_type: 'examine',
          ...e,
          categoriesStr
        })
      })
      if (express) {
        otherOrderList.push({
          order_type: 'express',
          ...express
        })
      }
      if (declare) {
        otherOrderList.push({
          order_type: 'declare',
          ...declare
        })
      }
      this.otherOrderList = otherOrderList
    }).catch(() => {
      this.otherOrderLoading = false
      this.otherOrderList = []
      return false
    })
  }
  // 快递下单
  private expressOrder() {
    this.$msgbox({
      title: '提示',
      message: '请确认操作？',
      showCancelButton: true,
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    }).then(() => {
      const params = {
        code: this.row.code
      }
      this.loading = true
      expressOrder(params).then(() => {
        this.loading = false
        this.$message.success('操作成功')
        this.getOrderDetails(this.row)
      }).catch(() => {
        this.loading = false
        this.render = false
        this.$nextTick(() => {
          this.render = true
        })
      })
    }).catch(() => false)
  }
  // 重新计量
  private resetMeasure() {
    this.$msgbox({
      type: 'warning',
      title: '提示',
      message: '请确认操作？',
      showCancelButton: true,
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    }).then(() => {
      const m: any = this.measureOrderList.sort((a: any, b: any) => dayjs(b.createTime).diff(dayjs(a.createTime), 'second'))[0] || {}
      const params = {
        code: this.row.code,
        lscId: (this.row.lsc || {}).key,
        lscName: (this.row.lsc || {}).value,
        mid: m.id
      }
      this.loading = true
      resetMeasure(params).then(() => {
        this.loading = false
        this.$message.success('操作成功')
        this.getOrderDetails(this.row)
      }).catch(() => {
        this.render = false
        this.$nextTick(() => {
          this.render = true
        })
        this.loading = false
      })
    }).catch(() => false)
  }
  // 报关下单
  private generateDeclarationOrder() {
    this.$msgbox({
      type: 'warning',
      title: '提示',
      message: '请确认操作？',
      showCancelButton: true,
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    }).then(() => {
      const params = {
        number: this.row.code,
        type: this.row.customs0
      }
      this.loading = true
      generateDeclarationOrder(params).then(() => {
        this.loading = false
        this.$message.success('操作成功')
        this.getOrderDetails(this.row)
      }).catch(() => {
        this.loading = false
        this.render = false
        this.$nextTick(() => {
          this.render = true
        })
      })
    }).catch(() => false)
  }
  // 报关取消
  private cancelDeclarationOrder() {
    this.$msgbox({
      type: 'warning',
      title: '提示',
      message: '请确认操作？',
      showCancelButton: true,
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    }).then(() => {
      const params = {
        number: this.row.code
      }
      this.loading = true
      cancelDeclarationOrder(params).then(() => {
        this.loading = false
        this.$message.success('操作成功')
        this.getOrderDetails(this.row)
      }).catch(() => {
        this.loading = false
        this.render = false
        this.$nextTick(() => {
          this.render = true
        })
      })
    }).catch(() => false)
  }
  private dialogClose() {
    if (this.dialogLoading) return
    this.visible = false
    this.visibleCustoms = false
    this.visibleDeliveryWay = false
    this.form = {
      deliveryWay: '',
      includeTax: '',
      customs: '',
      countryId: '',
      type: ''
    }
    this.selectRowId = ''
    this.lscList = []
  }
  private editCustoms() {
    this.visibleCustoms = true
    this.form.customs = this.row.customs0
  }
  private editLsc() {
    this.visible = true
    this.form.deliveryWay = this.row.deliveryWay
    this.form.includeTax = this.row.includeTax
    this.form.type = ''
    this.form.countryId = ''
    this.serverType = '1'
    this.getCountryList()
    this.getLscListByPrice()
  }
  private getLscList() {
    const params = {
      dispatch: '',
      ...this.form,
      purpose: '2',
      status: '1',
      subtypeId: this.form.type,
      page: 1,
      size: 9999
    }
    if (this.form.deliveryWay === '0') {
      params.dispatch = '1'
    }
    if (this.form.deliveryWay === '1') {
      params.dispatch = '0'
    }
    if (this.form.deliveryWay === '2') {
      params.dispatch = '2'
    }
    if (this.form.deliveryWay === '3') {
      params.dispatch = '3'
    }
    if (this.form.deliveryWay === '4') {
      params.dispatch = '4'
    }
    this.dialogLoading = true
    getLscList(params).then((res: any) => {
      this.dialogLoading = false
      const data = res.data || {}
      this.lscList = data.result || []
    }).catch(() => {
      this.dialogLoading = false
      this.lscList = []
    })
  }
  private editDeliveryWay() {
    this.visibleDeliveryWay = true
    this.form.deliveryWay = this.row.deliveryWay
  }
  private updateDeliveryWay() {
    if (this.form.deliveryWay === this.row.deliveryWay) {
      this.visibleDeliveryWay = false
      return
    }
    this.$msgbox({
      title: '提示',
      message: '请确认是否修改订单派送方式？',
      showCancelButton: true,
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    }).then(() => {
      const params = {
        code: this.row.code,
        customs0: this.row.customs0,
        deliveryWay: this.form.deliveryWay,
        lscId: (this.row.lsc).key
      }
      this.dialogLoading = true
      updateDeliveryWay(params).then(() => {
        this.dialogLoading = false
        this.$message.success('派送方式修改成功')
        this.visibleDeliveryWay = false
        this.getOrderDetails(this.row)
      }).catch(() => {
        this.dialogLoading = false
      })
    }).catch(() => {
      return false
    })
  }
  private updateCustoms() {
    if (this.form.customs === this.row.customs0) {
      this.visibleCustoms = false
      return
    }
    this.$msgbox({
      title: '提示',
      message: '请确认是否修改订单报关方式？',
      showCancelButton: true,
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    }).then(() => {
      const params = {
        code: this.row.code,
        customs0: this.form.customs,
        deliveryWay: this.row.deliveryWay,
        lscId: (this.row.lsc).key
      }
      this.dialogLoading = true
      updateCustoms(params).then(() => {
        this.dialogLoading = false
        this.$message.success('报关方式修改成功')
        this.visibleCustoms = false
        this.getOrderDetails(this.row)
      }).catch(() => {
        this.dialogLoading = false
      })
    }).catch(() => {
      return false
    })
  }
  private updateServer() {
    if (!this.selectRowId) {
      this.$message.warning('请选择服务')
      return
    }
    if (this.serverType === '1') {
      if (this.selectRowId === (this.row.lsc || {}).key) {
        this.$message.warning('所选服务不能与当前服务一致')
        return
      }
    } else {
      if (!this.form.countryId) {
        this.$message.warning('请选择目的国')
        return
      }
      if (this.selectRowId === (this.row.transChannel || {}).id) {
        this.$message.warning('所选服务不能与当前服务一致')
        return
      }
    }
    this.$msgbox({
      title: '提示',
      message: this.serverType === '1' ? '请确认是否将订单服务修改？' : '请确认是否将订单发货渠道修改',
      showCancelButton: true,
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    }).then(() => {
      let params = {}
      let fun = null
      if (this.serverType === '1') {
        params = {
          code: this.row.code,
          customs0: this.row.customs0,
          deliveryWay: this.row.deliveryWay,
          lscId: this.selectRowId
        }
        fun = updateServer
      }
      if (this.serverType === '2') {
        const country = this.countryList.find((e: any) => e.id === this.form.countryId) || {}
        params = {
          code: this.row.code,
          lscId: this.selectRowId,
          country: country.id,
          countryName: country.name
        }
        fun = editTrans
      }
      this.dialogLoading = true
      fun && fun(params).then(() => {
        this.dialogLoading = false
        this.$message.success('服务修改成功')
        this.visible = false
        this.getOrderDetails(this.row)
      }).catch(() => {
        this.dialogLoading = false
      })
    }).catch(() => {
      return false
    })
  }
  private getLscListByPrice() {
    const params: any = {
      model: {
        orderCustomer: this.row.orderCustomer || {},
        coverTank: '',
        orgTag: '',
        category: '',
        status: 1,
        destinationId: '',
        purpose: '0',
        includeTax: this.form.includeTax,
        subtypeId: this.row.type,
        purposeType: this.row.addressType,
        deliveryId: (this.row.delivery || {}).key,
        countryId: (this.row.country || {}).key,
        stateId: this.row.addressType === '1' ? (this.row.consignee || {}).provinceId : (this.row.fbastore || {}).stateId,
        cityId: this.row.addressType === '1' ? (this.row.consignee || {}).cityCode : (this.row.fbastore || {}).cityId,
        fbaId: this.row.addressType === '1' ? '' : (this.row.fbastore || {}).id
      },
      page: 1,
      size: 999
    }
    if (params.model.subtypeId === '1' || params.model.subtypeId === '2') {
      params.model.containerType = (this.row.container || {}).type
    }
    if (this.form.deliveryWay === '0') {
      params.model.dispatch = '1'
    }
    if (this.form.deliveryWay === '1') {
      params.model.dispatch = '0'
    }
    if (this.form.deliveryWay === '2') {
      params.model.dispatch = '2'
    }
    if (this.form.deliveryWay === '3') {
      params.model.dispatch = '3'
    }
    if (this.form.deliveryWay === '4') {
      params.model.dispatch = '4'
    }
    this.dialogLoading = true
    getLscListByPrice(params).then((res: any) => {
      this.dialogLoading = false
      const data = res.data || {}
      this.lscList = data.result || []
    }).catch(() => {
      this.dialogLoading = false
      this.lscList = []
    })
  }
  private loadStatusData() {
    const params = {
      index: '1',
      words: this.row.code
    }
    this.statusLoading = true
    getOrderStatusList(params).then((res: any) => {
      const data = res.data || {}
      this.statusList = (data.status || []).sort((a: any, b: any) => dayjs(b.updateAt).diff(dayjs(a.updateAt), 'second')).reduce((list: any[], s: any) => {
        if (!list.find((e: any) => e.statusIndex === s.statusIndex)) {
          list.push(s)
        }
        return list
      }, []).map((e: any) => {
        e.visible = false
        e.keyCode = this.row.code
        return e
      })
      this.statusLoading = false
    }).catch(() => {
      this.statusLoading = false
      this.statusList = []
    })
  }
  private showFileList(item: any) {
    const params = {
      code: item.keyCode,
      statusIndex: item.statusIndex
    }
    this.fileList = []
    this.fileLoading = true
    getOrderStatusFile(params).then((res: any) => {
      this.fileList = res.data || []
      this.fileLoading = false
    }).catch(() => {
      this.fileLoading = false
    })
  }
  private downloadFile(row: any) {
    if (row.fileSource) {
      window.open(row.fileSource)
    } else {
      this.$message.warning('暂无可下载文件')
    }
  }
  private show(row: any) {
    this.getOrderDetails(row)
  }
  private getOrderDetails(row: any) {
    this.loading = true
    getOrderDetails({ id: row.id }).then((res: any) => {
      this.loading = false
      const data = res.data || {}
      this.row = data
      this.lscConfig = data.lscConfig || {}
      this.render = false
      this.$nextTick(() => {
        this.render = true
      })
      this.getOtherOrder()
      this.getLogList()
      this.loadStatusData()
    }).catch(() => {
      this.loading = false
      this.row = {}
      this.lscConfig = {}
    })
  }
  private handleSizeChange(val: any) {
    this.pagination.size = val
    this.getLogList()
  }
  private handleCurrentChange(val: any) {
    this.pagination.page = val
    this.getLogList()
  }
  private getLogList() {
    const params = {
      model: this.row.code,
      page: this.pagination.page,
      size: this.pagination.size
    }
    this.logLoading = true
    getLogList(params).then((res: any) => {
      this.logLoading = false
      const data = res.data || {}
      this.logList = (data.result || []).sort((a: any, b: any) => dayjs(b.createTime).diff(dayjs(a.createTime), 'second'))
      this.pagination.total = data.total || 0
      this.render = false
      this.$nextTick(() => {
        this.render = true
      })
    }).catch(() => {
      this.logLoading = false
      this.logList = []
      this.pagination.total = 0
      this.render = false
      this.$nextTick(() => {
        this.render = true
      })
    })
  }
}
</script>

<style lang="scss" scoped>
  .app-container{
    width: 100%;
    height: calc(100vh - 85px);
    padding: 16px;
    overflow: auto;
    font-family: Alibaba PuHuiTi;
    .title{
      padding: 10px 15px;
      border-bottom: 1px solid #DBDFE5;
      font-size: 16px;
      font-weight: 500;
      color: #333333;
      display: flex;
      justify-content: space-between;
      height: 40px;
    }
    .order-info{
      margin-right: 416px;
      .base-info{
        width: 100%;
        background-color: #fff;
        border-radius: 4px;
        margin-bottom: 16px;
      }
      .other-info{
        .order-list{
          background-color: #fff;
          border-radius: 4px;
          .other-order-list{
            padding: 15px;
            max-height: 650px;
            overflow-y: auto;
            .other-order{
              border-bottom: 1px solid #EBEEF5;
              padding-bottom: 16px;
              margin-bottom: 10px;
              .order-header{
                display: flex;
                align-items: center;
                .order-no{
                  display: flex;
                  flex: 1;
                  align-items: center;
                  .icon{
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    &.measure{
                      background: url("./icon/measure.png") center center no-repeat;
                      background-size: 100%;
                    }
                    &.examine{
                      background: url("./icon/examine.png") center center no-repeat;
                      background-size: 100%;
                    }
                    &.express{
                      background: url("./icon/express.png") center center no-repeat;
                      background-size: 100%;
                    }
                    &.declare{
                      background: url("./icon/declare.png") center center no-repeat;
                      background-size: 100%;
                    }
                  }
                  .no{
                    margin-left: 5px;
                    font-size: 16px;
                    font-weight: 500;
                    color: #333333;
                  }
                }
                .status{
                  padding: 2px;
                  border-radius: 2px;
                  font-size: 12px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  &.status3{
                    color: #2291E6;
                    background-color: rgba(34, 145, 230, 0.1);
                    border: 1px solid #2291E6;
                  }
                  &.status2{
                    color: #FF7D19;
                    background-color: rgba(255, 125, 25, 0.1);
                    border: 1px solid #FF7D19;
                  }
                  &.status1{
                    color: #189800;
                    background-color: rgba(24, 152, 0, 0.1);
                    border: 1px solid #27BF1D;
                  }
                  &.status0{
                    color: #909399;
                    background-color: rgba(144, 147, 153, 0.1);
                    border: 1px solid #909399;
                  }
                }
              }
              .other-order-info{
                padding-left: 20px;
                overflow: hidden;
                margin-top: 4px;
                .other-order-info-item{
                  float: left;
                  font-size: 14px;
                  font-weight: 400;
                  color: #606266;
                  padding-top: 8px;
                  &.w100{
                    width: 100%;
                  }
                  &.w33{
                    width: 33.3%;
                  }
                }
              }
              .option-info{
                padding-left: 20px;
                padding-top: 8px;
                display: flex;
                align-items: center;
                font-size: 12px;
                font-weight: 400;
                color: #999999;
                .option-info-item{
                  display: inline-block;
                  width: 33.3%;
                }
              }
            }
          }
        }
        .order-option-info{
          .option-info{
            background-color: #fff;
            border-radius: 4px;
            .option-list{
              max-height: 280px;
              overflow-y: auto;
              .option-item{
                padding: 12px 15px 0 15px;
                .option{
                  font-size: 14px;
                  font-weight: 400;
                  color: #303133;
                }
                .option-user{
                  display: flex;
                  justify-content: space-between;
                  font-size: 12px;
                  font-weight: 400;
                  color: #999999;
                  border-bottom: 1px solid #EBEEF5;
                  padding: 10px 0;
                }
              }
            }
          }
          .status-info{
            margin-top: 16px;
            background-color: #fff;
            border-radius: 4px;
            .status-list{
              .status-item-warp{
                max-height: 280px;
                overflow-y: auto;
                padding: 10px 24px 10px 0;
              }
              .status-item{
                display: flex;
                .status-text-warp{
                  text-align: right;
                }
                .status-text{
                  width: 150px;
                  white-space: nowrap;
                  padding-top: 1px;
                  font-size: 14px;
                  font-family: PingFang SC;
                  font-weight: bold;
                  color: #606266;
                }
                .status-describe{
                  flex: 1;
                  margin-left: 48px;
                  .time{
                    position: relative;
                    font-size: 14px;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #909399;
                    padding: 4px 0;
                    &:before{
                      content: '';
                      width: 9px;
                      height: 9px;
                      border-radius: 50%;
                      background-color: #BFC4CB;
                      position: absolute;
                      top: 50%;
                      left: -28px;
                      transform: translateY(-50%);
                    }
                  }
                  .describe{
                    font-size: 14px;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #303133;
                    padding-bottom: 20px;
                    padding-top: 8px;
                    position: relative;
                    &:before{
                      content: '';
                      width: 1px;
                      height: 100%;
                      background-color: #DBDFE5;
                      position: absolute;
                      top: 50%;
                      left: -24px;
                      transform: translateY(-50%);
                    }
                  }
                }
                &:last-child{
                  .status-describe{
                    .describe{
                      &:before{
                        content: '';
                        width: 0;
                        height: 100%;
                        background-color: #909399;
                        position: absolute;
                        top: 50%;
                        left: -24px;
                        transform: translateY(-50%);
                      }
                    }
                  }
                }
                &.active{
                  .status-text{
                    color: #409eff;
                  }
                  .status-describe{
                    .time{
                      &:before{
                        content: '';
                        width: 9px;
                        height: 9px;
                        border-radius: 50%;
                        background-color: #409eff;
                        position: absolute;
                        top: 50%;
                        left: -28px;
                        transform: translateY(-50%);
                      }
                    }
                  }
                }
              }
              .none{}
            }
          }
        }
      }
    }
    .serve-info-wrap{
      position: fixed;
      right: 16px;
      top: 99px;
      width: 400px;
      .serve-info{
        background-color: #fff;
        border-radius: 4px;
        .lsc-info{
          padding: 15px;
          margin-bottom: 10px;
          .header{
            display: flex;
            align-items: center;
            .lsc-name{
              flex: 1;
              flex-wrap: nowrap;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              padding: 0 5px;
              font-size: 16px;
              font-weight: 500;
              color: #333333;
            }
          }
          .port{
            padding-left: 25px;
            font-size: 14px;
            font-weight: 500;
            color: #333333;
            position: relative;
            margin-top: 10px;
            &:before{
              position: absolute;
              top: 50%;
              left: 0;
              transform: translateY(-50%);
              content: '';
              width: 12px;
              height: 12px;
              border-radius: 50%;
            }
            &.departure{
              &:before{
                background: #1EAC2C;
              }
              &:after{
                position: absolute;
                top: 17px;
                left: 5px;
                width: 2px;
                height: 8px;
                content: '';
                background-color: #CBCBCB;
              }
            }
            &.destination{
              &:before{
                background: #FF9C39;
              }
            }
          }
        }
        .price-info{
          .price-list{
            padding: 15px;
            .price-item{
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              font-weight: 400;
              color: #999999;
              padding-bottom: 10px;
              /*span{
                flex: 1;
              }*/
              &:last-child{
                border-bottom: 1px solid #EBEEF5;
              }
            }
          }
          .total-price{
            padding: 0 15px 20px 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            span{
              font-size: 14px;
              font-weight: 500;
              color: #333333;
            }
            div{
              font-size: 20px;
              font-weight: 500;
              color: #FF8F39;
            }
          }
        }
      }
    }
    .none-text{
      text-align: center;
      padding: 10px 0;
      font-size: 12px;
      line-height: 25px;
      color: #989898;
    }
    .info{
      overflow: hidden;
      padding-top: 10px;
      .info-item{
        float: left;
        width: 25%;
        padding: 0 15px 10px 15px;
        font-size: 14px;
        font-weight: 400;
        &.p{
          padding: 0 0 10px 0;
          width: 33.3%;
        }
        .label{
          color: #909399;
        }
        .value{
          color: #333333;
        }
      }
    }
    .card{
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    .activeServerType{
      background: #fff;
      color: #1890FF;
    }
  }
  ::v-deep{
    .el-dialog__body{
      padding: 0 20px;
    }
  }

  /* 设置滚动条的样式 */
  .my-scrollbar{
    &::-webkit-scrollbar{
      width: 4px;
    }
    /* 滚动槽 */
    &::-webkit-scrollbar-track{
      border-radius: 2px;
    }
    /* 滚动条滑块 */
    &::-webkit-scrollbar-thumb{
      border-radius: 2px;
      background: rgba(0, 0, 0, 0.1);
    }
  }
</style>
