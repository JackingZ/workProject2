<template>
  <div>
    <div style="display: flex;flex-flow: row nowrap;align-content: center;margin: 20px 0;">
      <div style="flex: 3;overflow: hidden;margin-right: 10px;">
        <div class="plan-form">
          <el-button
            :disabled="!!isStr"
            type="text"
            style="padding: 10px 0;"
            @click="handlePlan"
          >
            发货计划
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <div style="font-size: 12px;">
            <span class="form-span">
              <span class="word-span">业务类型：</span>
              {{ filterType(planForm.type) }}
            </span>
            <span class="form-span">
              <span class="word-span">服务类型：</span>
              {{ filterTrans(planForm.type, planForm.transType) }}
            </span>
            <span class="form-span">
              <span class="word-span">订舱服务：</span>
              {{ planForm.bscName }}
            </span>
            <span class="form-span">
              <span
                v-if="planForm.type === '0'"
                class="word-span"
              >航空板：</span>
              <span
                v-if="planForm.type === '1'"
                class="word-span"
              >柜型：</span>
              <span
                v-if="planForm.type === '2'"
                class="word-span"
              >柜型：</span>
              <span
                v-if="planForm.type === '4'"
                class="word-span"
              >车型：</span>
              {{ planForm.containerName }}
            </span>
            <span class="form-span">
              <span class="word-span">服务机构：</span>
              {{ planForm.serviceName }}
            </span>
            <span class="form-span">
              <span class="word-span">服务编码：</span>
              {{ planForm.serviceCode }}
            </span>
            <span class="form-span">
              <span class="word-span">目的仓代码：</span>
              {{ (planForm.fbastore || {}).value }}
            </span>
            <span class="form-span">
              <span class="word-span">起运港：</span>
              {{ (planForm.originPort || {}).value }}
            </span>
            <span class="form-span">
              <span class="word-span">目的港：</span>
              {{ (planForm.targetPort || {}).value }}
            </span>
            <span class="form-span">
              <span class="word-span">起运国：</span>
              {{ (planForm.originCountry || {}).value }}
            </span>
            <span class="form-span">
              <span class="word-span">目的国：</span>
              {{ (planForm.targetCountry || {}).value }}
            </span>
            <span class="form-span">
              <span class="word-span">派件方式：</span>
              {{ filterDispatch(planForm.dispatch) }}
            </span>
            <span v-if="isType === '1' || isType === '2'">
              <span class="form-span">
                <span class="word-span">SO号：</span>
                {{ planForm.soCode }}
              </span>
              <span
                class="form-span"
              >
                <span class="word-span">柜号：</span>
                <span>{{ planForm.containerNo }}</span>
                <span v-if="isStr === 'v' && !planForm.containerNo">未填写</span>
                <span
                  v-if="isStr === 'e' && !containNoShow"
                  style="color: #2291E6;cursor: pointer;padding-left: 20px;"
                  @click="editNo"
                >
                  {{ planForm.containerNo ? '编辑' : '填写' }}
                </span>
                <div v-if="isStr === 'e' && containNoShow">
                  <el-input
                    v-model="containerNo"
                    size="mini"
                    placeholder="请输入"
                    clearable
                  />
                  <div style="text-align:right;padding: 10px 0 0;">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="saveNo"
                    >
                      保存
                    </el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="cancelNo"
                    >
                      取消
                    </el-button>
                  </div>
                </div>
              </span>
              <span class="form-span">
                <span class="word-span">截关日期：</span>
                {{ planForm.customsTime }}
              </span>
              <span class="form-span">
                <span class="word-span">截VGM日期：</span>
                {{ planForm.vgmTime }}
              </span>
              <span class="form-span">
                <span class="word-span">ETA：</span>
                {{ planForm.eta }}
              </span>
              <span class="form-span">
                <span class="word-span">ETD：</span>
                {{ planForm.etd }}
              </span>
            </span>
            <span
              v-if="isType === '0'"
              class="form-span"
            >
              <span class="word-span">提单号：</span>
              {{ planForm.billNo }}
            </span>
            <span
              v-if="isType === '0'"
              class="form-span"
            >
              <span class="word-span">航空单号：</span>
              {{ planForm.airNo }}
            </span>
            <span class="form-span">
              <span class="word-span">运输时间：</span>
              {{ planForm.transitTime }}天
            </span>
            <span class="form-span">
              <span class="word-span">起运日期：</span>
              {{ planForm.shippingDate }}
            </span>
            <span class="form-span">
              <span class="word-span">截单日期：</span>
              {{ planForm.cutoffDate }}
            </span>
          </div>
        </div>
      </div>
      <div style="flex: 1;border: 1px solid #dfe6ec;border-radius: 5px;padding: 25px 20px;">
        <div
          v-for="(item, index) in accountData"
          :key="index"
          class="box-account"
        >
          <div class="box-word">
            {{ item.name }}
          </div>
          <div class="box-num">
            {{ item.value }}
          </div>
        </div>
      </div>
      <div style="border: 1px solid #dfe6ec;border-radius: 5px;width:410px;margin-left: 10px;">
        <div style="padding: 10px;font-weight: bold;border-bottom: 1px solid #dfe6ec;">
          成本占比
        </div>
        <ve-ring
          :data="ringData"
          :extend="ringExtend"
          :settings="ringSet"
          height="220px"
        />
      </div>
    </div>

    <el-row>
      <el-col :span="12">
        <span
          class="word-span"
          style="padding-left: 10px;"
        >总票数：</span>
        {{ dynamicNums }}
        <span
          class="word-span"
          style="padding: 0 20px;"
        >|</span>
        <span class="word-span">总体积：</span>
        {{ dynamicVolume }}&nbsp;CBM&nbsp;
        <span
          class="word-span"
          style="padding: 0 20px;"
        >  |  </span>
        <span class="word-span">总重量：</span>
        {{ dynamicWeight }}&nbsp;KGS&nbsp;
        <span
          class="word-span"
          style="padding: 0 20px;"
        >  |  </span>
        <span class="word-span">总件数：</span>
        {{ dynamicPackages }}
      </el-col>
      <el-col :span="12">
        <div
          v-show="false"
          style="text-align: right;"
        >
          <el-radio-group
            v-model="sortVal"
            :disabled="!planForm.planId"
            @change="onSort"
          >
            <el-radio
              label="1"
            >
              相同海关编码优先
            </el-radio>
            <el-radio
              label="2"
            >
              单一目的仓优先
            </el-radio>
            <el-radio
              label="3"
            >
              严格先进先出
            </el-radio>
          </el-radio-group>
        </div>
      </el-col>
    </el-row>

    <div style="width: 400px;padding: 10px 0 0 10px;">
      <span style="font-size: 12px;color: #999;">装货仓库：</span>
      <span>{{ warehouseInfo.map((it) => it.name).join(',') }}</span>
    </div>
    <div style="padding: 10px 0 0 10px;display: flex;flex-flow: row nowrap;">
      <div style="width: 40px;">
        <span style="font-size: 12px;color: #999;">备注：</span>
      </div>
      <div style="flex: 1;">
        <el-input
          v-if="isStr !== 'v'"
          v-model="planForm.remark"
          type="textarea"
          size="small"
          placeholder="请输入"
          :autosize="{minRows: 2, maxRows: 4}"
          clearable
        />
        <span v-else>{{ planForm.remark }}</span>
      </div>
    </div>

    <el-row style="padding: 10px;">
      <el-col :span="10">
        <span style="padding-right: 10px;">
          <span style="font-size: 18px;font-weight: bold;line-height: 32px;">订单筛选</span>
        </span>
        <el-radio-group
          v-model="selectWord"
          @change="onSelected"
        >
          <el-radio-button label="all">
            全部
          </el-radio-button>
          <el-radio-button label="fba">
            已选择
          </el-radio-button>
        </el-radio-group>
      </el-col>
      <el-col
        :span="14"
        style="text-align: right;"
      >
        <span v-show="isStr === 'e' && selectWord === 'fba'">
          <span class="handle-add">
            手动添加订单
          </span>
          <el-input
            v-model="orderSubVal"
            placeholder="请输入"
            class="input-with-select"
            style="width:280px;margin-right:10px;"
            size="small"
            clearable
          >
            <el-select
              slot="prepend"
              v-model="orderNo"
              size="small"
              style="width:100px;"
              placeholder="请选择"
            >
              <el-option
                label="原单号"
                value="1"
              />
              <el-option
                label="调拨单号"
                value="2"
              />
              <el-option
                label="出库单号"
                value="3"
              />
            </el-select>
          </el-input>
          <el-button
            type="primary"
            size="small"
            :loading="selectLoading"
            @click="onSubAdd"
          >
            添加
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="onSave"
          >
            保存订单
          </el-button>
        </span>
        <el-dropdown
          v-if="!isStr && selectWord === 'fba'"
          trigger="click"
          @command="handleCommandInvoice"
        >
          <span
            class="el-dropdown-link"
          >
            导出
            <i class="el-icon-arrow-down" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              command="2"
            >
              目的港箱单发票
            </el-dropdown-item>
            <el-dropdown-item
              command="3"
            >
              起运港箱单发票
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span v-show="selectWord === 'all'">
          <el-input
            v-model="searchCode"
            placeholder="原单号"
            clearable
            size="small"
            style="width: 200px;"
          />
        </span>
      </el-col>
    </el-row>

    <div
      v-show="selectWord === 'fba'"
      style="padding: 20px 0;"
    >
      <el-collapse accordion>
        <el-collapse-item
          v-for="(item, index) in orderData"
          :key="index"
          class="collapse-position"
        >
          <template slot="title">
            <el-row style="background-color: #ededed;">
              <el-col
                :span="24"
              >
                <span style="padding-left: 30px;">
                  {{ item.fba === 'xxxx' ? '私人地址      ' : 'FBA仓库 ' + '[' + item.fba + ']' }}
                </span>
                <span style="padding-left: 20px;">
                  总票数：{{ item.list.length }}&nbsp;&nbsp;
                  总体积：{{ fbaVolWeiFormat(item.list, 'CBM') }}&nbsp;CBM&nbsp;
                  总重量：{{ fbaVolWeiFormat(item.list, 'KGS') }}&nbsp;KGS&nbsp;
                  总件数：{{ fbaPkgFormat(item.list) }}
                </span>
              </el-col>
            </el-row>
          </template>
          <div
            v-for="(row, num) in item.list"
            :key="num"
            class="flex-row-list"
          >
            <div
              v-if="isStr === 'e'"
              style="width: 75px;padding: 15px 5px 0 0;"
            >
              <span
                v-if="row.ifNew"
                class="btn-tip-red"
              >
                新增
              </span>
              <span
                v-else-if="row.ifCancel"
                class="btn-tip-red"
              >
                已取消发货
              </span>
            </div>
            <div style="flex: 1;">
              <div style="display: flex;flex-flow: row wrap;">
                <div style="width: 150px;padding: 5px 5px 0 5px;">
                  <div class="text-tip">
                    原单号：
                  </div>
                  <div
                    class="text-info"
                    :title="row.code"
                  >
                    <span
                      v-copy="row.code"
                      class="copy-icon"
                    />
                    <span>{{ row.code }}</span>
                  </div>
                  <div>
                    <span
                      v-if="row.beShip"
                      class="btn-tip-red"
                    >
                      特批发货
                    </span>
                    <span
                      v-if="row.ifFrozen"
                      class="btn-tip-red"
                    >
                      冻结
                    </span>
                    <span
                      v-if="row.ifLocked"
                      class="btn-tip-blue"
                    >
                      锁舱
                    </span>
                    <span
                      v-if="row.payMethod !== '1' && formatPay(row)"
                      class="btn-tip-red"
                    >
                      {{ row.ifPayment ? '逾期已付款' : '逾期未付款' }}
                    </span>
                    <span
                      v-if="row.payMethod === '1'"
                      class="btn-tip-red"
                    >
                      {{ row.ifPayment ? '已付款' : '未付款' }}
                    </span>
                    <span
                      v-if="row.insufficient"
                      class="btn-tip-red"
                    >
                      信用不足
                    </span>
                  </div>
                </div>

                <div style="width: 170px;padding: 5px 5px 0 5px;">
                  <div class="text-tip">
                    到仓时间：
                  </div>
                  <div class="text-info">
                    {{ row.unloadingTime || '--' }}
                  </div>
                </div>

                <div style="width: 120px;padding: 5px 5px 0 5px;">
                  <div class="text-tip">
                    目的城市：
                  </div>
                  <div class="text-info">
                    {{ (row.consignee || {}).city || '--' }}
                  </div>
                </div>

                <div style="width: 150px;padding: 5px 5px 0 5px;">
                  <div class="text-tip">
                    服务：
                  </div>
                  <div class="text-info">
                    {{ (row.lsc || {}).value || '--' }}
                  </div>
                </div>

                <div style="width: 150px;padding: 5px 5px 0 5px;">
                  <div class="text-tip">
                    下单仓库：
                  </div>
                  <div class="text-info">
                    {{ (row.warehouse || {}).name || '--' }}
                  </div>
                </div>

                <div style="width: 150px;padding: 5px 5px 0 5px;">
                  <div class="text-tip">
                    货物所在仓：
                  </div>
                  <div class="text-info">
                    {{ (row.warehouse1 || {}).name || '--' }}
                  </div>
                </div>

                <div style="width: 100px;padding: 5px 5px 0 5px;">
                  <div class="text-tip">
                    总体积：
                  </div>
                  <div class="text-info">
                    {{ maxVolWeiFormat(row, 'vol', 'CBM') }}
                  </div>
                </div>

                <div style="width: 100px;padding: 5px 5px 0 5px;">
                  <div class="text-tip">
                    总重量：
                  </div>
                  <div class="text-info">
                    {{ maxVolWeiFormat(row, 'wei', 'KGS') }}
                  </div>
                </div>
                <div style="width: 100px;padding: 5px 5px 0 5px;">
                  <div class="text-tip">
                    装载体积：
                  </div>
                  <div class="text-info">
                    {{ $volumeConversion(row.loadVolume, 'CBCM', 'CBM', 3) }} CBM
                  </div>
                </div>

                <div style="width: 100px;padding: 5px 5px 0 5px;">
                  <div class="text-tip">
                    装载重量：
                  </div>
                  <div class="text-info">
                    {{ $volumeConversion(row.loadWeight, 'KGS', 'KGS', 3) }} KGS
                  </div>
                </div>

                <div style="width: 100px;padding: 5px 5px 0 5px;">
                  <div class="text-tip">
                    最大尺寸：
                  </div>
                  <div class="text-info">
                    {{ maxSizeFormat(row) }}
                  </div>
                </div>

                <div style="width: 100px;padding: 5px 5px 0 5px;">
                  <div class="text-tip">
                    最大重量：
                  </div>
                  <div class="text-info">
                    {{ maxVolWeiFormat(row, 'maxWei', 'KGS') }}
                  </div>
                </div>

                <div style="width: 100px;padding: 5px 5px 0 5px;">
                  <div class="text-tip">
                    最大体积：
                  </div>
                  <div class="text-info">
                    {{ maxVolWeiFormat(row, 'maxVol', 'CBM') }}
                  </div>
                </div>

                <div style="width: 100px;padding: 5px 5px 0 5px;">
                  <div class="text-tip">
                    总件数：
                  </div>
                  <div class="text-info">
                    {{ row.packages }}
                  </div>
                </div>
                <div style="width: 100px;padding: 5px 5px 0 5px;">
                  <div class="text-tip">
                    装载件数：
                  </div>
                  <div class="text-info">
                    {{ row.loadTotal }}
                  </div>
                </div>

                <div
                  v-if="row.ifLoading === 2"
                  style="width: 100px;padding: 5px 5px 0 5px;color: red"
                >
                  <div class="text-tip">
                    剩余件数：
                  </div>
                  <div class="text-info">
                    {{ row.loadingCount }}
                  </div>
                </div>

                <div style="width: 100px;padding: 5px 5px 0 5px;">
                  <div class="text-tip">
                    计量状态：
                  </div>
                  <div class="text-info">
                    {{ (statusList.find(e => e.id === row.status['MEASURE']) || {name: '--'}).name }}
                  </div>
                </div>

                <div style="width: 100px;padding: 5px 5px 0 5px;">
                  <div class="text-tip">
                    验货状态：
                  </div>
                  <div class="text-info">
                    {{ (statusList.find(e => e.id === row.status['EXAMINE']) || {name: '--'}).name }}
                  </div>
                </div>

                <div style="width: 100px;padding: 5px 5px 0 5px;">
                  <div class="text-tip">
                    报关状态：
                  </div>
                  <div class="text-info">
                    {{ (statusList.find(e => e.id === row.status['CUSTOM_DECLARATION']) || {name: '--'}).name }}
                  </div>
                </div>

                <div style="width: 100px;padding: 5px 5px 0 5px;">
                  <div class="text-tip">
                    快递单号：
                  </div>
                  <div class="text-info">
                    <div v-if="row.deliveryWay === '0'">
                      <el-popover
                        v-if="row.express && row.express.trackingNos"
                        title="快递单号"
                      >
                        <p
                          v-for="e in row.express.trackingNos.split(',')"
                          :key="e"
                        >
                          {{ e }}
                        </p>
                        <span
                          slot="reference"
                          style="color: #2291E6;cursor: pointer;"
                        >
                          已出
                        </span>
                      </el-popover>
                      <span v-else>
                        未出
                      </span>
                    </div>
                    <div v-else>
                      --
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="isStr !== 'v'"
              style="width: 90px;"
            >
              <el-button
                v-show="!isStr || row.ifNew"
                type="text"
                size="medium"
                @click="deleteRightRow(row, num, index)"
              >
                删除
              </el-button>
              <el-button
                v-show="isStr === 'e' && !row.ifNew && !row.ifCancel"
                type="text"
                size="medium"
                @click="cancelRightRow(row.id, item.fba)"
              >
                取消发货
              </el-button>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <div
      v-show="selectWord === 'all'"
      style="padding: 20px 0;"
    >
      <div
        v-for="(row, num) in resultData"
        :key="num"
        class="flex-row-list"
      >
        <div
          v-if="isStr === 'e'"
          style="width: 75px;padding: 15px 5px 0 0;"
        >
          <span
            v-if="row.ifNew"
            class="btn-tip-red"
          >
            新增
          </span>
          <span
            v-else-if="row.ifCancel"
            class="btn-tip-red"
          >
            已取消发货
          </span>
        </div>
        <div style="flex: 1;">
          <div style="display: flex;flex-flow: row wrap;">
            <div style="width: 150px;padding: 5px 5px 0 5px;">
              <div class="text-tip">
                原单号：
              </div>
              <div
                class="text-info"
                :title="row.code"
              >
                <span
                  v-copy="row.code"
                  class="copy-icon"
                />
                <span>{{ row.code }}</span>
              </div>
              <div>
                <span
                  v-if="row.beShip"
                  class="btn-tip-red"
                >
                  特批发货
                </span>
                <span
                  v-if="row.ifFrozen"
                  class="btn-tip-red"
                >
                  冻结
                </span>
                <span
                  v-if="row.ifLocked"
                  class="btn-tip-blue"
                >
                  锁舱
                </span>
                <span
                  v-if="row.payMethod !== '1' && formatPay(row)"
                  class="btn-tip-red"
                >
                  {{ row.ifPayment ? '逾期已付款' : '逾期未付款' }}
                </span>
                <span
                  v-if="row.payMethod === '1'"
                  class="btn-tip-red"
                >
                  {{ row.ifPayment ? '已付款' : '未付款' }}
                </span>
                <span
                  v-if="row.insufficient"
                  class="btn-tip-red"
                >
                  信用不足
                </span>
              </div>
            </div>

            <div style="width: 170px;padding: 5px 5px 0 5px;">
              <div class="text-tip">
                到仓时间：
              </div>
              <div class="text-info">
                {{ row.unloadingTime || '--' }}
              </div>
            </div>

            <div style="width: 120px;padding: 5px 5px 0 5px;">
              <div class="text-tip">
                目的城市：
              </div>
              <div class="text-info">
                {{ (row.consignee || {}).city || '--' }}
              </div>
            </div>

            <div style="width: 150px;padding: 5px 5px 0 5px;">
              <div class="text-tip">
                服务：
              </div>
              <div class="text-info">
                {{ (row.lsc || {}).value || '--' }}
              </div>
            </div>

            <div style="width: 150px;padding: 5px 5px 0 5px;">
              <div class="text-tip">
                下单仓库：
              </div>
              <div class="text-info">
                {{ (row.warehouse || {}).name || '--' }}
              </div>
            </div>

            <div style="width: 150px;padding: 5px 5px 0 5px;">
              <div class="text-tip">
                货物所在仓：
              </div>
              <div class="text-info">
                {{ (row.warehouse1 || {}).name || '--' }}
              </div>
            </div>

            <div style="width: 100px;padding: 5px 5px 0 5px;">
              <div class="text-tip">
                总体积：
              </div>
              <div class="text-info">
                {{ maxVolWeiFormat(row, 'vol', 'CBM') }}
              </div>
            </div>

            <div style="width: 100px;padding: 5px 5px 0 5px;">
              <div class="text-tip">
                总重量：
              </div>
              <div class="text-info">
                {{ maxVolWeiFormat(row, 'wei', 'KGS') }}
              </div>
            </div>
            <div style="width: 100px;padding: 5px 5px 0 5px;">
              <div class="text-tip">
                装载体积：
              </div>
              <div class="text-info">
                {{ $volumeConversion(row.loadVolume, 'CBCM', 'CBM', 3) }} CBM
              </div>
            </div>

            <div style="width: 100px;padding: 5px 5px 0 5px;">
              <div class="text-tip">
                装载重量：
              </div>
              <div class="text-info">
                {{ $volumeConversion(row.loadWeight, 'KGS', 'KGS', 3) }} KGS
              </div>
            </div>

            <div style="width: 100px;padding: 5px 5px 0 5px;">
              <div class="text-tip">
                最大尺寸：
              </div>
              <div class="text-info">
                {{ maxSizeFormat(row) }}
              </div>
            </div>

            <div style="width: 100px;padding: 5px 5px 0 5px;">
              <div class="text-tip">
                最大重量：
              </div>
              <div class="text-info">
                {{ maxVolWeiFormat(row, 'maxWei', 'KGS') }}
              </div>
            </div>

            <div style="width: 100px;padding: 5px 5px 0 5px;">
              <div class="text-tip">
                最大体积：
              </div>
              <div class="text-info">
                {{ maxVolWeiFormat(row, 'maxVol', 'CBM') }}
              </div>
            </div>

            <div style="width: 100px;padding: 5px 5px 0 5px;">
              <div class="text-tip">
                总件数：
              </div>
              <div class="text-info">
                {{ row.packages }}
              </div>
            </div>
            <div style="width: 100px;padding: 5px 5px 0 5px;">
              <div class="text-tip">
                装载件数：
              </div>
              <div class="text-info">
                {{ row.loadTotal }}
              </div>
            </div>
            <div
              v-if="row.ifLoading === 2"
              style="width: 100px;padding: 5px 5px 0 5px;color: red"
            >
              <div class="text-tip">
                剩余件数：
              </div>
              <div class="text-info">
                {{ row.loadingCount }}
              </div>
            </div>

            <div style="width: 100px;padding: 5px 5px 0 5px;">
              <div class="text-tip">
                计量状态：
              </div>
              <div class="text-info">
                {{ (statusList.find(e => e.id === row.status['MEASURE']) || {name: '--'}).name }}
              </div>
            </div>

            <div style="width: 100px;padding: 5px 5px 0 5px;">
              <div class="text-tip">
                验货状态：
              </div>
              <div class="text-info">
                {{ (statusList.find(e => e.id === row.status['EXAMINE']) || {name: '--'}).name }}
              </div>
            </div>

            <div style="width: 100px;padding: 5px 5px 0 5px;">
              <div class="text-tip">
                报关状态：
              </div>
              <div class="text-info">
                {{ (statusList.find(e => e.id === row.status['CUSTOM_DECLARATION']) || {name: '--'}).name }}
              </div>
            </div>

            <div style="width: 100px;padding: 5px 5px 0 5px;">
              <div class="text-tip">
                快递单号：
              </div>
              <div class="text-info">
                <div v-if="row.deliveryWay === '0'">
                  <el-popover
                    v-if="row.express && row.express.trackingNos"
                    title="快递单号"
                  >
                    <p
                      v-for="e in row.express.trackingNos.split(',')"
                      :key="e"
                    >
                      {{ e }}
                    </p>
                    <span
                      slot="reference"
                      style="color: #2291E6;cursor: pointer;"
                    >
                      已出
                    </span>
                  </el-popover>
                  <span v-else>
                    未出
                  </span>
                </div>
                <div v-else>
                  --
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="isStr !== 'v'"
          style="width: 90px;"
        >
          <el-button
            v-show="!isStr || row.ifNew"
            type="text"
            size="medium"
            @click="deleteLeftRow(row, num)"
          >
            删除
          </el-button>
          <el-button
            v-show="isStr === 'e' && !row.ifNew && !row.ifCancel"
            type="text"
            size="medium"
            @click="cancelLeftRow(row.id)"
          >
            取消发货
          </el-button>
        </div>
      </div>
    </div>

    <el-dialog
      :title="planTitle"
      width="1200px"
      :visible.sync="detailShow"
      :close-on-click-modal="false"
      @close=";(detailShow = false)"
    >
      <div style="text-align: right;">
        <el-select
          v-model="startCountry"
          size="small"
          style="width: 130px;"
          @change="onCountry"
        >
          <el-option
            label="中国"
            value="CN"
          />
          <el-option
            label="香港"
            value="HK"
          />
          <el-option
            label="韩国"
            value="KP"
          />
        </el-select>
      </div>
      <el-table
        v-loading="selectLoading"
        :data="tableData"
        height="400px"
        style="width: 100%;margin: 10px 0;"
        :row-style="{'cursor': 'pointer'}"
        border
        @row-click="handleRowClick"
      >
        <el-table-column
          min-width="150"
          label="服务"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ (scope.row.planEntity || {}).bscName }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="isType === '0'"
          width="150"
          label="提单号"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ (scope.row.bookingAir || {}).billNo }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="isType === '0'"
          width="150"
          label="航空单号"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ (scope.row.bookingAir || {}).airNo }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="isType === '1' || isType === '2'"
          width="150"
          label="SO号"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ (scope.row.bookingSo || {}).soCode }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="isType === '1' || isType === '2'"
          min-width="120"
          label="船名"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ (scope.row.bookingSo || {}).freighter }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="isType === '1' || isType === '2'"
          width="100"
          label="航次"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ (scope.row.bookingSo || {}).ship }}
          </template>
        </el-table-column>
        <el-table-column
          min-width="150"
          label="服务机构"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="isType === '0'">
              {{ (scope.row.planEntity || {}).serviceName }}
            </span>
            <span v-if="isType === '1' || isType === '2'">
              {{ (scope.row.bookingSo || {}).orgName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          label="服务代码"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="isType === '0'">
              {{ (scope.row.planEntity || {}).serviceId }}
            </span>
            <span v-if="isType === '1' || isType === '2'">
              {{ (scope.row.orderEntity || {}).bsServiceCode }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="isType === '1' || isType === '2'"
          width="160"
          label="ETA"
        >
          <template slot-scope="scope">
            {{ (scope.row.bookingSo || {}).eta }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="isType === '1' || isType === '2'"
          width="160"
          label="ETD"
        >
          <template slot-scope="scope">
            {{ (scope.row.bookingSo || {}).etd }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="isType === '1' || isType === '2'"
          width="160"
          label="截单日期"
        >
          <template slot-scope="scope">
            {{ (scope.row.bookingSo || {}).sheetTime }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="isType === '1' || isType === '2'"
          width="160"
          label="截关日期"
        >
          <template slot-scope="scope">
            {{ (scope.row.bookingSo || {}).customsTime }}
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page.sync="planPage"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="planTotal"
        style="text-align: right;"
        @current-change="planCurrentChange"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import Sortablejs from 'sortablejs'
import dayjs from 'dayjs'
import {
  getDeliverySoList,
  getDeliveryList,
  getSoByPlanId,
  getAviationList,
  getCabinetList,
  getVehicleTypeList,
  updateShip,
  editShip,
  getShipById,
  getCodeOrder,
  getBSCDetailById,
  exportPortStartCode,
  exportPortEndCode,
  getCreditById,
  updateContainerNo,
  getMoveOutOrderByNo,
  getOrderByViewAndEdit,
  splitCancel
} from '@/api/operation-of-single-shipment'

@Component({
  name: '',
  components: {
  },
  props: {
    statusList: {
      type: Array,
      default: () => ([])
    },
    singleId: {
      type: String,
      default: ''
    },
    isStr: {
      type: String,
      default: ''
    }
  }
})
export default class extends Vue {
  /* data */
  private selectLoading: boolean = false
  private detailShow: boolean = false
  private containNoShow: boolean = false
  private tableData: any[] = []
  private orderData: any[] = [] // 订单重组
  private orderList: any[] = []
  private containerInfo: any = {} // 货柜信息
  private warehouseInfo: any[] = [] // 仓库信息
  private soList: any[] = []
  private accountData: any[] = [
    { name: '总申报金额', value: 0 },
    { name: '总关税', value: 0 },
    { name: '海关编码数', value: 0 },
    { name: '派送地址', value: 0 }
  ]
  private ringData: any = {}
  private ringSet: any = {}
  private ringExtend: any = {}
  private page: number = 1
  private planPage: number = 1
  private size: number = 10
  private total: any = 0
  private planTotal: any = 0
  private planTitle: any = ''
  private orderNo: any = '1'
  private containerNo: any = ''
  private searchCode: any = ''
  private startCountry: any = 'CN'
  private selectWord: any = 'fba'
  private planList: any[] = []
  private planForm: any = {
    planId: undefined,
    remark: undefined,
    warehouseId: undefined,
    warehouseName: undefined
  }
  private boxForm: any = {
    volume: undefined,
    loadLimit: undefined,
    umWeight: undefined,
    name: undefined,
    quantity: undefined,
    umLength: undefined
  }
  private searchObj: any = {}
  private searchModel: any = {}
  private orderSubVal: any = ''
  private sortVal: any = ''
  private bscObj: any = {}
  private isType: any = ''
  /* computed */
  get dynamicNums() {
    const arr: any[] = []
    this.orderData.map((it: any) => {
      if (it && it.list) {
        const arrC = it.list.filter((c: any) => c && !c.ifCancel)
        arr.push(...arrC)
      }
    })
    return arr.length
  }
  get dynamicPackages() {
    const arr: any[] = []
    const s = (this as any).isStr
    this.orderData.map((it: any) => {
      if (it && it.list) {
        it.list.filter((c: any) => c && !c.ifCancel).map((l: any) => {
          let num = 0
          if (s) {
            if (l.byInit) {
              num = l.loadTotal
            } else {
              num = l.ifLoading === 2 ? l.loadingCount : l.packages
            }
          } else {
            num = l.ifLoading === 2 ? l.loadingCount : l.packages
          }
          arr.push(num)
        })
      }
    })
    return arr.reduce((prev: any, curr: any) => {
      return prev + curr
    }, 0)
  }
  get dynamicVolume() {
    let countV: number = 0
    const arr: any[] = []
    const s = (this as any).isStr
    this.orderData.map((it: any) => {
      if (it && it.list) {
        const arrC = it.list.filter((c: any) => c && !c.ifCancel)
        arr.push(...arrC)
      }
    })
    arr.map((c: any, i: any) => {
      const um = c.um || {}
      const umVolume = (this as any).$getVolumeUnitByLengthUnit(um.umLength)
      const vw = c.measure || {}
      if (s) {
        if (c.byInit) {
          const numV = (this as any).$volumeConversion(c.loadVolume, 'CBCM', 'CBM', 3)
          const lenV = String(numV).length
          const mathPV = numV * Math.pow(10, lenV)
          countV += parseFloat((mathPV / Math.pow(10, lenV)).toFixed(3))
        } else {
          if (c.ifLoading === 2) {
            const numV = (this as any).$volumeConversion(c.surplusVolume, 'CBCM', 'CBM', 3)
            const lenV = String(numV).length
            const mathPV = numV * Math.pow(10, lenV)
            countV += parseFloat((mathPV / Math.pow(10, lenV)).toFixed(3))
          } else {
            // 体积
            if (vw && vw.totalVolume >= 0 && um && umVolume) {
              const numV = (this as any).$volumeConversion(vw.totalVolume, umVolume, 'CBM', 3)
              const lenV = String(numV).length
              const mathPV = numV * Math.pow(10, lenV)
              countV += parseFloat((mathPV / Math.pow(10, lenV)).toFixed(3))
            }
          }
        }
      } else {
        if (c.ifLoading === 2) {
          const numV = (this as any).$volumeConversion(c.surplusVolume, 'CBCM', 'CBM', 3)
          const lenV = String(numV).length
          const mathPV = numV * Math.pow(10, lenV)
          countV += parseFloat((mathPV / Math.pow(10, lenV)).toFixed(3))
        } else {
          // 体积
          if (vw && vw.totalVolume >= 0 && um && umVolume) {
            const numV = (this as any).$volumeConversion(vw.totalVolume, umVolume, 'CBM', 3)
            const lenV = String(numV).length
            const mathPV = numV * Math.pow(10, lenV)
            countV += parseFloat((mathPV / Math.pow(10, lenV)).toFixed(3))
          }
        }
      }
    })
    return Math.round(countV * 1000) / 1000
  }
  get dynamicWeight() {
    let countW: number = 0
    const arr: any[] = []
    const s = (this as any).isStr
    this.orderData.map((it: any) => {
      if (it && it.list) {
        const arrC = it.list.filter((c: any) => c && !c.ifCancel)
        arr.push(...arrC)
      }
    })
    arr.map((c: any, i: any) => {
      const um = c.um || {}
      const vw = c.measure || {}
      if (s) {
        if (c.byInit) {
          const numW = (this as any).$volumeConversion(c.loadWeight, 'KGS', 'KGS', 3)
          const lenW = String(numW).length
          const mathPW = numW * Math.pow(10, lenW)
          countW += parseFloat((mathPW / Math.pow(10, lenW)).toFixed(3))
        } else {
          if (c.ifLoading === 2) {
            const numW = (this as any).$volumeConversion(c.surplusWeight, 'KGS', 'KGS', 3)
            const lenW = String(numW).length
            const mathPW = numW * Math.pow(10, lenW)
            countW += parseFloat((mathPW / Math.pow(10, lenW)).toFixed(3))
          } else {
            // 重量
            if (vw && vw.totalWeight >= 0 && um && um.umWeight) {
              const numW = (this as any).$volumeConversion(vw.totalWeight, um.umWeight, 'KGS', 3)
              const lenW = String(numW).length
              const mathPW = numW * Math.pow(10, lenW)
              countW += parseFloat((mathPW / Math.pow(10, lenW)).toFixed(3))
            }
          }
        }
      } else {
        if (c.ifLoading === 2) {
          const numW = (this as any).$volumeConversion(c.surplusWeight, 'KGS', 'KGS', 3)
          const lenW = String(numW).length
          const mathPW = numW * Math.pow(10, lenW)
          countW += parseFloat((mathPW / Math.pow(10, lenW)).toFixed(3))
        } else {
          // 重量
          if (vw && vw.totalWeight >= 0 && um && um.umWeight) {
            const numW = (this as any).$volumeConversion(vw.totalWeight, um.umWeight, 'KGS', 3)
            const lenW = String(numW).length
            const mathPW = numW * Math.pow(10, lenW)
            countW += parseFloat((mathPW / Math.pow(10, lenW)).toFixed(3))
          }
        }
      }
    })
    return Math.round(countW * 1000) / 1000
  }
  get resultData() {
    const { searchCode, orderList } = this
    if (searchCode) {
      return orderList.filter((data: any) => {
        const { code }: any = data || {}
        const item = { code }
        return Object.keys(item).some(key => {
          return String(data[key]).indexOf(searchCode) > -1
        })
      })
    }
    return orderList
  }

  /* methods */
  private formatPay(row: any) {
    const pay = row.payTime ? dayjs(row.payTime).unix() : ''
    const now = dayjs().unix()
    const time = pay || now
    const cut = row.cutoffTime ? dayjs(row.cutoffTime).unix() : ''
    return !!cut && (cut && cut < time)
  }

  private formatCutoffDay(row: any) {
    const pay = row.payTime ? dayjs(row.payTime).unix() : ''
    const now = dayjs().unix()
    const time = pay || now
    const cut = row.cutoffTime ? dayjs(row.cutoffTime).unix() : ''
    const old = time ? dayjs(time).unix() : undefined
    if (cut && cut < time) {
      return Math.ceil((time - cut) / 86400) + '天'
    } else {
      return '--'
    }
  }

  private filterType(type: any) {
    if (type === '0') {
      return '空运'
    } else if (type === '1') {
      return '海运'
    } else if (type === '2') {
      return '铁路'
    } else if (type === '4') {
      return '卡航'
    }
  }
  private filterDispatch(type: any) {
    const obj: any = { '0': '快递', '1': '卡派', '2': '自提', '3': '整柜直送', '4': '到仓' }
    const arrD = (`${type}` || '').split(',')
    const arrN: any[] = []
    arrD.map((it: any) => {
      arrN.push(obj[it])
    })
    return arrN.join(',')
  }

  private filterTrans(type: any, cType: any) {
    let name: any = ''
    if (type === '0') {
      name = cType === '0' ? '包板' : cType === '1' ? '散货' : ''
    } else if (type === '1' || type === '2') {
      name = cType === '0' ? '拼箱' : cType === '1' ? '整柜' : ''
    } else if (type === '4') {
      name = cType === '0' ? '整车' : cType === '1' ? '散货' : ''
    }
    return name
  }
  private maxSizeFormat(row: any) {
    const measure = row.measure || {}
    return Math.max(measure.maxHeight || 0, measure.maxLength || 0, measure.maxWidth || 0)
  }

  // 体积重量动态计算
  private maxVolWeiFormat(row: any, str: string, unit: string) {
    const umVolume = (this as any).$getVolumeUnitByLengthUnit((row.um || {}).umLength)
    const umWeight = (row.um || {}).umWeight
    const maxVolume = (row.measure || {}).maxVolume
    const totalVolume = (row.measure || {}).totalVolume
    const maxWeight = (row.measure || {}).maxWeight
    const totalWeight = (row.measure || {}).totalWeight
    let numVW: number = 0
    const s = (this as any).isStr
    if (s) {
      if (row.byInit) {
        if (row.byInit && str === 'vol') {
          numVW = (this as any).$volumeConversion(totalVolume, umVolume, 'CBM', 3)
        }
        if (row.byInit && str === 'wei') {
          numVW = (this as any).$volumeConversion(totalWeight, umWeight, 'KGS', 3)
        }
      } else {
        if (row.ifLoading !== 2 && str === 'vol' && umVolume && totalVolume) {
          numVW = (this as any).$volumeConversion(totalVolume, umVolume, 'CBM', 3)
        }
        if (row.ifLoading === 2 && str === 'vol') {
          numVW = (this as any).$volumeConversion(row.surplusVolume, 'CBCM', 'CBM', 3)
        }
        if (row.ifLoading !== 2 && str === 'wei' && umWeight && totalWeight) {
          numVW = (this as any).$volumeConversion(totalWeight, umWeight, 'KGS', 3)
        }
        if (row.ifLoading === 2 && str === 'wei') {
          numVW = (this as any).$volumeConversion(row.surplusWeight, 'KGS', 'KGS', 3)
        }
      }
    } else {
      if (row.ifLoading !== 2 && str === 'vol' && umVolume && totalVolume) {
        numVW = (this as any).$volumeConversion(totalVolume, umVolume, 'CBM', 3)
      }
      if (row.ifLoading === 2 && str === 'vol') {
        numVW = (this as any).$volumeConversion(row.surplusVolume, 'CBCM', 'CBM', 3)
      }
      if (row.ifLoading !== 2 && str === 'wei' && umWeight && totalWeight) {
        numVW = (this as any).$volumeConversion(totalWeight, umWeight, 'KGS', 3)
      }
      if (row.ifLoading === 2 && str === 'wei') {
        numVW = (this as any).$volumeConversion(row.surplusWeight, 'KGS', 'KGS', 3)
      }
    }
    if (str === 'maxVol' && umVolume && maxVolume) {
      numVW = (this as any).$volumeConversion(maxVolume, umVolume, 'CBM', 3)
    }
    if (str === 'maxWei' && umWeight && maxWeight) {
      numVW = (this as any).$volumeConversion(maxWeight, umWeight, 'KGS', 3)
    }
    return (numVW || '--') + ' ' + unit
  }

  private fbaVolWeiFormat(arr: any[], val: string) {
    let countV: number = 0
    let countW: number = 0
    const s = (this as any).isStr
    arr.map((c: any, i: any) => {
      const um = c.um || {}
      const umVolume = (this as any).$getVolumeUnitByLengthUnit(um.umLength)
      const vw = c.measure || {}
      if (!s && c.ifLoading === 2) {
        const numV = (this as any).$volumeConversion(c.surplusVolume, 'CBCM', 'CBM', 3)
        const lenV = String(numV).length
        const mathPV = numV * Math.pow(10, lenV)
        countV += parseFloat((mathPV / Math.pow(10, lenV)).toFixed(3))
        const numW = (this as any).$volumeConversion(c.surplusWeight, 'KGS', 'KGS', 3)
        const lenW = String(numW).length
        const mathPW = numW * Math.pow(10, lenW)
        countW += parseFloat((mathPW / Math.pow(10, lenW)).toFixed(3))
      } else {
        // 体积
        if (vw && vw.totalVolume >= 0 && um && umVolume) {
          const numV = (this as any).$volumeConversion(vw.totalVolume, umVolume, 'CBM', 3)
          const lenV = String(numV).length
          const mathPV = numV * Math.pow(10, lenV)
          countV += parseFloat((mathPV / Math.pow(10, lenV)).toFixed(3))
        }
        // 重量
        if (vw && vw.totalWeight >= 0 && um && um.umWeight) {
          const numW = (this as any).$volumeConversion(vw.totalWeight, um.umWeight, 'KGS', 3)
          const lenW = String(numW).length
          const mathPW = numW * Math.pow(10, lenW)
          countW += parseFloat((mathPW / Math.pow(10, lenW)).toFixed(3))
        }
      }
    })
    if (val === 'CBM') {
      return Math.round(countV * 1000) / 1000
    } else if (val === 'KGS') {
      return Math.round(countW * 1000) / 1000
    }
  }

  private fbaPkgFormat(arr: any[]) {
    const pkg = arr.map((it: any) => it.packages)
    return pkg.reduce((prev: any, curr: any) => {
      return prev + curr
    }, 0)
  }

  // 新增客户来源
  private getOriginData() {
    this.ringData = {
      columns: ['a', 'b', 'c'],
      rows: [
        { a: '国内陆运运费', b: 0, c: 0 },
        { a: '国内报关费', b: 0, c: 0 },
        { a: '空运费', b: 0, c: 0 },
        { a: '国外报关费', b: 0, c: 0 },
        { a: '国外目的港杂费', b: 0, c: 0 },
        { a: '派送费', b: 0, c: 0 }
      ]
    }
    this.ringSet = {
      radius: ['60', '90'],
      label: {
        show: false
      }
    }
    this.ringExtend = {
      title: {
        text: '总成本',
        textStyle: {
          fontSize: 14,
          color: '#666',
          fontWeight: 'normal'
        },
        subtext: '￥0元',
        subtextStyle: {
          fontSize: 18,
          color: '#333',
          fontWeight: 'bolder'
        },
        left: '20%',
        top: '42%'
      },
      legend: {
        top: '10%',
        right: '20%',
        orient: 'vertical',
        padding: 10,
        itemGap: 20,
        itemWidth: 10,
        itemHeight: 10,
        icon: 'circle',
        formatter(name: any) {
          return name
        }
      },
      series: {
        center: ['25%', '50%']
      },
      color: ['#3AA1FF', '#F263B4', '#4ECB73', '#F2637B', '#FF903B', '#4FC8D1']
    }
  }
  private async setData(model: any, data: any[], warehouses: any[]) {
    const str = (this as any).isStr
    const sId = (this as any).singleId
    if (!str) { // 新增
      const form = model || {}
      this.searchModel = model || {}
      this.warehouseInfo = warehouses || []
      this.isType = form.transport
      this.searchObj = {
        transport: form.transport,
        countryToId: form.targetCountry,
        portsToId: form.fbastoreId || [],
        deliveryWay: form.deliveryWay || []
      }
      const arrS = data || []
      this.orderData = JSON.parse(JSON.stringify(arrS))
      this.orderList = []
      arrS.map((it: any) => {
        it.list && it.list.map((l: any) => {
          this.orderList.push(l)
        })
      })
    } else { // 查看编辑
      await this.viewPlan(sId)
    }
    this.getOriginData()
  }
  private getData() {
    return {
      model: this.searchModel,
      data: this.orderData,
      warehouses: this.warehouseInfo
    }
  }

  private async viewPlan(id: any) {
    try {
      this.$emit('setload', true)
      const res = await getShipById({ id })
      const result = await getOrderByViewAndEdit({ fillId: id })
      const orderList = (result.data || []).map((e: any) => {
        return {
          ...e,
          byInit: true
        }
      })
      const data = res.data || {}
      const { containers, address, bsc, fillQueryParm, warehouses, deliveryWay, ...form } = data
      this.searchModel = fillQueryParm || {}
      this.warehouseInfo = warehouses || []
      this.isType = (data.fillQueryParm || {}).transport
      this.planForm = {
        ...form,
        dispatch: deliveryWay,
        bscName: (data.bsc || {}).name,
        serviceName: (data.org || {}).value,
        serviceCode: (data.bsc || {}).serviceCode
      }
      const arr = data.containers || []
      if (arr.length > 0) {
        this.planForm.containerId = (arr[0].containerInfo || {}).containerId
        this.planForm.containerName = (arr[0].containerInfo || {}).containerName
        this.planForm.containerNo = (arr[0].containerInfo || {}).containerNo
        this.planForm.customsTime = (arr[0].containerInfo || {}).customsTime
        this.planForm.eta = (arr[0].containerInfo || {}).eta
        this.planForm.etd = (arr[0].containerInfo || {}).etd
        this.planForm.vgmTime = (arr[0].containerInfo || {}).vgmTime
        this.planForm.soCode = (arr[0].containerInfo || {}).SO
      }
      this.containerInfo = arr[0].containerInfo
      this.orderList = orderList
      this.orderData = this.setReduceCodeAndChecked(orderList, true)
      this.$emit('setload', false)
    } catch (error) {
      this.$emit('setload', false)
      return error
    }
  }
  private setReduceCodeAndChecked(data: any[], bool: boolean) {
    // 初始化，重组订单为仓库集合，及勾选状态设定
    const arrS = data.filter((it: any) => it.addressType === '1')
    const arrF = data.filter((it: any) => it.addressType !== '1')
    const func = (array: any[], property: any) => {
      return array.reduce((arr: any[], obj: any) => {
        const key = obj.fbastore[property]
        if (!arr[key]) {
          arr[key] = []
        }
        arr[key].push(obj)
        return arr
      }, {})
    }
    const objFba = func(arrF, 'code')
    if (arrS.length > 0) {
      objFba.xxxx = arrS
    } // 私人地址
    const result = Object.keys(objFba).map((key: any) => {
      if (key) {
        const arr = (objFba[key] || []).map((it: any) => {
          return {
            ...it,
            checked: bool
          }
        })
        return {
          fba: key,
          checkAll: bool,
          indeterminate: bool,
          list: arr
        }
      }
    })
    return result
  }
  private clearPlan() {
    this.containerInfo = {}
    this.boxForm = {}
    this.bscObj = {}
    this.soList = []
    this.sortVal = ''
    this.planTitle = ''
  }

  private handlePlan() {
    this.detailShow = true
    if (this.isType === '0') {
      this.planTitle = '选择提单号'
    } else if (this.isType === '1' || this.isType === '2') {
      this.planTitle = '选择so'
    }
    this.planPage = 1
    this.getSoPlanList()
  }
  private async handleRowClick(row: any) { // 海铁
    this.clearPlan()
    this.detailShow = false
    this.$emit('setload', true)
    const soObj = row.bookingSo || {}
    const airObj = row.bookingAir || {}
    const planObj = row.planEntity || {}
    const orderObj = row.orderEntity || {}
    this.planForm.planId = planObj.id
    this.planForm.type = planObj.type // 业务类型
    this.planForm.bscId = planObj.bscId
    this.planForm.bscName = planObj.bscName
    this.planForm.dispatch = planObj.dispatch
    this.planForm.shippingDate = planObj.shipDate
    this.planForm.transitTime = planObj.transTime
    this.planForm.serviceCode = orderObj.bsServiceCode
    this.planForm.transType = orderObj.ifWholeCabinet
    this.planForm.supplyId = planObj.supplyId
    this.planForm.fbastore = {
      key: planObj.fbastoreId,
      value: planObj.fbastoreName
    }
    if (this.planForm.type === '1' || this.planForm.type === '2') {
      this.planForm.containerId = soObj.containerId
      this.planForm.containerName = soObj.containerName
      this.planForm.soCode = soObj.soCode
      this.planForm.cutoffDate = soObj.sheetTime
      this.planForm.customsTime = soObj.customsTime
      this.planForm.vgmTime = soObj.vgmTime
      this.planForm.eta = soObj.eta
      this.planForm.etd = soObj.etd
      this.planForm.serviceName = soObj.orgName
      this.planForm.serviceId = soObj.orgId
      this.planForm.originPort = {
        key: soObj.loadingPortId,
        value: soObj.loadingPortName
      }
      this.planForm.targetPort = {
        key: soObj.unloadPortId,
        value: soObj.unloadPortName
      }
      this.planForm.originCountry = {
        key: soObj.receiptCountryId,
        value: soObj.receiptCountryName
      }
      this.planForm.targetCountry = {
        key: soObj.deliveryCountryId,
        value: soObj.deliveryCountryName
      }
    } else if (this.planForm.type === '0') {
      this.planForm.airNo = airObj.airNo
      this.planForm.billNo = airObj.billNo
      this.planForm.containerId = planObj.containerId
      this.planForm.containerName = planObj.containerName
      this.planForm.cutoffDate = planObj.cutoffDate
      this.planForm.serviceName = planObj.serviceName
      this.planForm.serviceId = planObj.serviceId
      this.planForm.originPort = {
        key: orderObj.portsFromId,
        value: orderObj.portsFromName
      }
      this.planForm.targetPort = {
        key: orderObj.portsToId,
        value: orderObj.portsToName
      }
      this.planForm.originCountry = {
        key: orderObj.fromCountry,
        value: orderObj.fromCountryName
      }
      this.planForm.targetCountry = {
        key: orderObj.toCountry,
        value: orderObj.toCountryName
      }
    }

    // 获取订舱信息
    if (String(this.planForm.bscId)) {
      try {
        const resB = await getBSCDetailById({ id: this.planForm.bscId })
        const itemB = resB.data || {}
        const { shippingTerms, ...objB } = itemB
        this.bscObj = { ...objB }
        await this.getRelateInfo(planObj)
        this.$emit('setload', false)
      } catch (error) {
        this.$emit('setload', false)
      }
    }
  }

  private async getRelateInfo(row?: any) {
    if (this.planForm.type === '0') { // 空
      if (!this.planForm.planId || !row) return
      this.boxForm.volume = row.airVolume
      this.boxForm.umLength = 'M'
      this.boxForm.umVolume = 'CBM'
      this.boxForm.containerId = row.containerId
      this.boxForm.containerName = row.containerName
      this.boxForm.loadLimit = row.loadLimit
      this.boxForm.umWeight = 'KGS'
      this.boxForm.quantity = 1

      const resI = await getSoByPlanId({
        planId: parseInt(this.planForm.planId, 0),
        type: '1'
      })
      this.soList = resI.data || []
    } else if (this.planForm.type === '1' || this.planForm.type === '2') { // 海铁
      const params: any = { page: 1, size: 9999 }
      const resF = await getCabinetList(params)
      const arrF = (resF.data || {}).result || []
      const itemF = arrF.find((it: any) => (this.planForm.containerId === `${it.id}` || this.planForm.containerId === it.id))
      this.boxForm.volume = itemF.volume
      this.boxForm.umLength = itemF.umLength
      this.boxForm.umVolume = itemF.umVolume
      this.boxForm.containerId = itemF.id
      this.boxForm.containerName = itemF.name
      this.boxForm.loadLimit = itemF.loadLimit
      this.boxForm.umWeight = itemF.umWeight
      this.boxForm.quantity = 1

      this.soList = [this.planForm.soCode]
    } else if (this.planForm.type === '4') {
      // const params: any = { page: 1, size: 9999 }
      // const resF = await getVehicleTypeList(params)
    }
    this.setTable()
  }
  private setTable() {
    if (this.boxForm.quantity > 0 && this.soList.length > 0) {
      this.containerInfo = {
        SO: this.soList[0],
        containerId: this.boxForm.containerId,
        containerName: this.boxForm.containerName,
        customsTime: this.planForm.customsTime,
        eta: this.planForm.eta,
        etd: this.planForm.etd,
        vgmTime: this.planForm.vgmTime,
        volume: 0,
        weight: 0,
        maxVolume: this.boxForm.volume,
        maxWeight: this.boxForm.loadLimit,
        umLength: this.boxForm.umLength,
        umWeight: this.boxForm.umWeight,
        umVolume: this.boxForm.umVolume
      }
    } else {
      this.containerInfo = {}
    }
  }

  private getSoPlanList() {
    this.selectLoading = true
    const params:any = {
      page: this.planPage,
      size: 10,
      model: {
        type: this.searchObj.transport,
        endCountry: this.searchObj.countryToId,
        startCountry: this.startCountry,
        fbaId: this.searchObj.portsToId,
        dispatch: this.searchObj.deliveryWay
      }
    }
    getDeliverySoList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.tableData = data.result || []
        this.planTotal = data.total
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private planCurrentChange(val: string) {
    this.planPage = Number(val)
    this.getSoPlanList()
  }
  private onCountry() {
    this.tableData = []
    this.getSoPlanList()
  }

  private onSort() {
    // 订单重排
  }
  private onSelected(val: any) {
    this.selectWord = val
    this.searchCode = ''
  }
  private editNo() {
    this.containNoShow = true
    this.containerNo = this.planForm.containerNo || ''
  }
  private saveNo() {
    const sId = (this as any).singleId
    const params: any = {
      containerNo: this.containerNo,
      id: sId,
      so: this.planForm.soCode
    }
    updateContainerNo(params)
      .then(async(res: any) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.cancelNo()
        await this.viewPlan(sId)
      })
      .catch((err: any) => {
        return err
      })
  }
  private cancelNo() {
    this.containNoShow = false
    this.containerNo = ''
  }
  private boolOrder(row: any) {
    // 可发货条件
    const item = {
      ...row,
      fullorderInsufficient: row.fullorderInsufficient || {},
      express: row.express || {}
    }
    const {
      audit,
      status: { MEASURE, EXAMINE },
      deliveryWay,
      express: { trackingNos },
      fullorderInsufficient: { insufficientStatus },
      payMethod,
      ifPayment,
      insufficient,
      ifFrozen,
      beShip
    } = item
    const now = dayjs().unix()
    const cut = row.cutoffTime ? dayjs(row.cutoffTime).unix() : ''
    if (((row.ifLoading === 2 && row.ifConfirm === 2) || row.ifLoading === 0) && audit === '1' && MEASURE === '7' && EXAMINE === '10' && ((deliveryWay === '0' && trackingNos) || deliveryWay !== '0') && !ifFrozen) {
      return beShip || (insufficient && insufficientStatus === 1) || (!insufficient && ifPayment) || (!insufficient && !ifPayment && payMethod !== '1')
    } else {
      return false
    }
  }

  private async onSubAdd() {
    if (!this.orderSubVal) return
    try {
      this.selectLoading = true
      let data: any[] = []
      if (this.orderNo === '1') {
        const params1: any = {
          code: this.orderSubVal,
          type: 'add',
          containerNo: this.planForm.containerNo || undefined
        }
        const res1 = await getCodeOrder(params1)
        data = res1.data || []
      } else {
        const params2: any = {
          taskId: this.orderSubVal,
          countryId: this.searchModel.targetCountry,
          fillId: (this as any).singleId,
          type: this.searchModel.transport
        }
        const res2 = await getMoveOutOrderByNo(params2)
        data = res2.data || []
      }
      const arrF = data.filter((it: any) => it && (it.seller || {}).type === '1')
      const ifExist = this.orderData.some((it :any) => it.list && it.list.some((l: any) => l.code === this.orderSubVal))
      if (arrF.length <= 0) {
        this.$message.error('暂无该订单信息')
        this.selectLoading = false
        return
      } else if (arrF.some((it: any) => it.ifLoading === 1)) {
        this.$message.error('订单存在已分单，请重新添加')
        this.selectLoading = false
        return
      } else if (arrF.some((it: any) => !it.enabled)) {
        this.$message.error('订单已取消，无法添加')
        this.selectLoading = false
        return
      } else if (arrF.some((it: any) => (it.transChannel).subtypeId !== this.searchModel.transport)) {
        this.$message.error('该订单信息与业务类型不一致')
        this.selectLoading = false
        return
      } else if (!arrF.some((it: any) => ((it.transChannel || {}).targets || []).map((e: any) => e.countryId).includes(this.searchModel.targetCountry))) {
        this.$message.error('该订单信息与目的国不一致')
        this.selectLoading = false
        return
      } else if (!arrF.some((it: any) => this.warehouseInfo.some((w: any) => w.id === (it.warehouse1 || {}).id))) {
        this.$message.error('该订单信息与装货仓库不一致')
        this.selectLoading = false
        return
      } else if (ifExist) {
        this.$message.error('订单已存在')
        this.selectLoading = false
        return
      } else if (arrF.some((it: any) => (it.ifConfirm !== 2 && it.ifLoading === 2))) {
        this.$message.error('返仓出库待确认')
        this.selectLoading = false
        return
      } else if (arrF.some((it: any) => it.audit !== '1' && it.status.MEASURE !== '7' && it.status.EXAMINE !== '10')) {
        this.$message.error('该订单必须验货完成、计量完成、审核通过')
        this.selectLoading = false
        return
      } else if (arrF.some((it: any) => it.ifFrozen)) {
        this.$message.error('该订单已冻结')
        this.selectLoading = false
        return
      } else if (arrF.some((it: any) => it.deliveryWay === '0' && !it.express.trackingNos)) {
        this.$message.error('该订单的快递单号未出')
        this.selectLoading = false
        return
      }
      // 可发货条件
      const arrD = arrF.filter((l: any) => this.boolOrder(l))
      if (arrD.length <= 0) {
        this.$message.error('该订单未付款、信用不足，需要申请出库或特批发货')
        this.selectLoading = false
        return
      }
      const fbaId = ((arrF[0] || {}).fbastore || {}).code
      const addType = (arrF[0] || {}).addressType
      const arrN = arrD.map((f: any) => {
        return {
          ...f,
          ifNew: true
        }
      })
      this.orderList = [...this.orderList, ...arrN]
      if (addType === '1' && this.orderData.some((it: any) => it.fba === 'xxxx')) {
        this.orderData.map((it: any) => {
          if (it.fba === 'xxxx') {
            it.list.push(...arrN)
          }
        })
      } else if (addType !== '1' && this.orderData.some((it: any) => it.fba === fbaId)) {
        this.orderData.map((it: any) => {
          if (it.fba === fbaId) {
            it.list.push(...arrN)
          }
        })
      } else if (addType === '1') {
        this.orderData.push({
          fba: 'xxxx',
          list: arrN
        })
      } else if (addType !== '1') {
        this.orderData.push({
          fba: fbaId,
          list: arrN
        })
      }
      this.$message.success('添加订单成功')
      this.orderSubVal = ''
      this.selectLoading = false
    } catch (error) {
      this.selectLoading = false
      return error
    }
  }
  private deleteLeftRow(row: any, index: number) {
    this.orderList = this.orderList.filter((l: any) => l.id !== row.id)
    this.orderData = this.orderData.map((it: any) => {
      it.list = it.list.filter((l: any) => l.id !== row.id)
      return it
    })
    this.orderData = this.orderData.filter((it: any) => it && it.list.length > 0)
  }
  private cancelLeftRow(id: any) {
    this.$emit('setload', true)
    splitCancel({ fillId: (this as any).singleId, orderId: id }).then((res: any) => {
      this.$emit('setload', false)
      if (res.data) {
        this.orderList = this.orderList.map((l: any) => {
          if (l.id === id) {
            l.ifCancel = true
          }
          return l
        })
        this.orderData = this.orderData.map((it: any) => {
          it.list = it.list.map((l: any) => {
            if (l.id === id) {
              l.ifCancel = true
            }
            return l
          })
          return it
        })
      } else {
        this.$confirm('该订单已被仓库扫描装载，仓库取消装载后才能取消发货。', '提示', {
          confirmButtonText: '确认',
          closeOnClickModal: false,
          showCancelButton: false
        }).then(() => false)
          .catch(() => false)
      }
    }).catch(() => {
      this.$emit('setload', false)
    })
  }

  private deleteRightRow(row: any, index: number, itemIndex: number) {
    this.orderData[itemIndex].list.splice(index, 1)
    this.orderData = this.orderData.filter((it: any) => it && it.list.length > 0)
    this.orderList = this.orderList.filter((l: any) => l.id !== row.id)
  }

  private cancelRightRow(id: any, fba: any) {
    this.$emit('setload', true)
    splitCancel({ fillId: (this as any).singleId, orderId: id }).then((res: any) => {
      this.$emit('setload', false)
      if (res.data) {
        this.orderData = this.orderData.map((it: any) => {
          if (it.fba === fba) {
            it.list = it.list.map((l: any) => {
              if (l.id === id) {
                l.ifCancel = true
              }
              return l
            })
          }
          return it
        })
        this.orderList = this.orderList.map((l: any) => {
          if (l.id === id) {
            l.ifCancel = true
          }
          return l
        })
      } else {
        this.$confirm('该订单已被仓库扫描装载，仓库取消装载后才能取消发货。', '提示', {
          confirmButtonText: '确认',
          closeOnClickModal: false,
          showCancelButton: false
        }).then(() => false)
          .catch(() => false)
      }
    }).catch(() => {
      this.$emit('setload', false)
    })
  }

  private onAdd(bool: boolean) {
    if (!this.planForm.planId) {
      this.$message.error('请选择发货计划')
      return
    }
    const { dispatch, serviceId, serviceName, warehouseId, warehouseName, ...obj } = this.planForm
    const arrC: any[] = []
    this.orderData.map((it: any) => {
      arrC.push(...it.list)
    })
    const ifWareOrder = this.warehouseInfo.every((it: any) => arrC.some((a: any) => (a.warehouse1 || {}).id === it.id))
    if (!ifWareOrder) {
      this.$message.error('装货仓库必须都有至少一个订单')
      return
    }
    const params: any = {
      deliveryWay: dispatch,
      bsc: this.bscObj,
      org: {
        key: serviceId,
        value: serviceName
      },
      containers: [{
        containerInfo: {
          ...this.containerInfo,
          volume: (this as any).dynamicVolume,
          weight: (this as any).dynamicWeight
        },
        orders: arrC
      }],
      fillQueryParm: this.searchModel,
      ...obj,
      id: undefined,
      mode: '1',
      draft: bool,
      warehouses: this.warehouseInfo.map((it: any) => {
        return {
          ...it,
          truck: true
        }
      })
    }
    this.$emit('setload', true)
    updateShip(params)
      .then((res: any) => {
        this.$emit('setload', false)
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.$emit('back')
      })
      .catch((err: any) => {
        this.$emit('setload', false)
        return err
      })
  }
  private onSave() {
    const ifC = this.orderData.some((it: any) => it && (it.list || []).some((c: any) => c && c.ifCancel))
    const ifN = this.orderData.some((it: any) => it && (it.list || []).some((c: any) => c && c.ifNew))
    const arrO: any[] = []
    this.orderData.map((it: any) => {
      it.list.map((c: any) => {
        if (!c.ifCancel) {
          arrO.push(c)
        }
      })
    })
    const ifW = this.warehouseInfo.every((it: any) => arrO.some((a: any) => (a.warehouse1 || {}).id === it.id))
    const ifV = arrO.length <= 0
    if (!ifC && !ifN) {
      this.$message.error('请选择添加订单或取消发货后再保存')
      return
    } else if (!this.planForm.soCode) {
      this.$message.error('暂无SO，无法保存')
      return
    } else if (!this.planForm.containerId) {
      this.$message.error('暂无柜型，无法保存')
      return
    }
    //  else if (ifV) {
    //   this.$message.error('空柜或空订单，无法保存')
    //   return
    // } else if (!ifW) {
    //   this.$message.error('装货仓库必须都有至少一个订单')
    //   return
    // }
    const dels: any[] = []
    this.orderData.map((it: any) => {
      (it.list || []).map((c: any) => {
        if (c && c.ifCancel) {
          dels.push(c.id)
        }
      })
    })
    const adds: any[] = []
    this.orderData.map((it: any) => {
      const arrC = it.list || []
      arrC.map((c: any) => {
        if (c && c.ifNew) {
          adds.push(c)
        }
      })
    })
    const params: any = {
      id: (this as any).singleId,
      containers: [{
        dels,
        adds,
        containerId: this.planForm.containerId,
        SO: this.planForm.soCode,
        volume: (this as any).dynamicVolume,
        weight: (this as any).dynamicWeight,
        umLength: 'M',
        umWeight: 'KGS'
      }]
    }
    this.$emit('setload', true)
    editShip(params)
      .then((res: any) => {
        this.$emit('setload', false)
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.$emit('back')
      })
      .catch((err: any) => {
        this.$emit('setload', false)
        return err
      })
  }
  // 导出
  private handleCommandInvoice(command: any) {
    const arrO: any[] = []
    this.orderData.map((it: any) => {
      it.list.map((c: any) => {
        if (c.code) {
          arrO.push(c.code)
        }
      })
    })
    if (arrO.length <= 0) return
    this.downloadExcel(command, arrO)
  }
  private downloadExcel(val: any, arr: any) {
    this.$emit('setload', true)
    let name:any = ''
    let func: any = null
    if (val === '2') {
      name = '目的港箱单发票'
      func = exportPortEndCode
    } else if (val === '3') {
      name = '起运港箱单发票'
      func = exportPortStartCode
    } else {
      return
    }
    func(arr).then((res:any) => {
      this.$emit('setload', false)
      const a = document.createElement('a')
      document.body.appendChild(a)
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      const objUrl = URL.createObjectURL(blob)
      a.href = objUrl
      a.download = name + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.xls'
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(objUrl)
    }).catch((err:any) => {
      this.$emit('setload', false)
      err.data.text().then((text: any) => {
        try {
          const resData = JSON.parse(text)
          if (resData.code !== 200) {
            this.$message.error(resData.msg || '文件下载失败')
          }
        } catch (e) {
          return e
        }
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.box-account {
  display: inline-block;
  width: 50%;
  padding: 17px 0px;
  &:nth-child(1) {
    border-right: 1px solid #E8E8E8;
    border-bottom: 1px solid #E8E8E8;
  }
  &:nth-child(2) {
    border-bottom: 1px solid #E8E8E8;
  }
  &:nth-child(3) {
    border-right: 1px solid #E8E8E8;
  }
  .box-word {
    text-align: center;
    padding-bottom: 10px;
    color: #8F9399;
  }
  .box-num {
    text-align: center;
    font-size: 32px;
    color: #303133;
  }
}
.handle-add {
  font-size: 14px;
  line-height: 32px;
  padding-right: 10px;
  &::before {
    clear: both;
    content: "*";
    color: #ff4949;
    margin-right: 4px;
  }
}
  .el-dropdown-link {
    margin-left: 10px;
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
.plan-form {
  border: 1px solid #dfe6ec;
  border-radius: 5px;
  padding: 5px 10px;
  height: 100%;
  overflow-y: auto;
}
.form-span {
  display: inline-block;
  line-height: 20px;
  width: 33%;
}
.word-span {
  font-size: 12px;
  color: #999;
}
.btn-tip-red {
  color: #E12E2E;
  background-color: rgba(245, 108, 108, 0.2);
  display: inline-block;
  height: 18px;
  line-height: 18px;
  font-size: 12px;
  padding: 0 2px;
  margin: 0 1px;
  border-radius: 2px;
}

.btn-tip-blue {
  color: #2291E6;
  background-color: rgb(34, 145, 230, 0.2);
  display: inline-block;
  height: 18px;
  line-height: 18px;
  font-size: 12px;
  padding: 0 2px;
  margin: 0 1px;
  border-radius: 2px;
}

::v-deep .el-radio-button__inner {
  padding: 7px 20px;
}
::v-deep .el-table__body .success-row {
  background-color: #cee9ec !important;
}
::v-deep .el-table__body .row_id-others {
  background-color: #cee9ec !important;
}

::v-deep .el-table .pulse{
  animation-name: pulse;
  animation-fill-mode: both;
  animation-duration: .5s;
}
@keyframes pulse{
  0%{
    transform: scale3d(1, 1, 1);
  }
  50%{
    transform: scale3d(1.1, 1.1, 1.1);
  }
  100%{
    transform: scale3d(1, 1, 1);
  }
}

.flex-row-list {
  display: flex;
  flex-flow: row nowrap;
  border-bottom: 1px solid #dfe6ec;
  margin-bottom: 5px;
}
.text-box {
  float: right;
  margin: 10px 6px 0 0;
}
.text-tip {
  font-size: 12px;
  color: #999;
  line-height: 14px;
}
.text-info {
  // white-space: nowrap;
  // overflow: hidden;
  // text-overflow: ellipsis;
  font-size: 13px;
  word-break: break-all;
  .copy-icon {
    color: #999;
    cursor: pointer;
    width: 12px;
    height: 12px;
    display: inline-block;
    margin-right: 5px;
    background: url("../../../assets/imgs/copy.png") center center no-repeat;
    background-size: 100%;
    &:hover {
      background: url("../../../assets/imgs/copy-hover.png") center center no-repeat;
      background-size: 100%;
    }
  }
}

.el-collapse {
  border-top: none;
  border-bottom: none;
  ::v-deep .el-collapse-item__content {
    padding-bottom: 0px;
    max-height: 250px;
    overflow: auto;
  }
}
// ::v-deep .el-collapse-item__header {
//   border-bottom: none;
// }
.collapse-position {
  display: flex;
  flex-flow: column;
  ::v-deep .el-collapse-item__header {
    position: relative;
    border-bottom: none;
    display: block;
    height: 32px;
    line-height: 32px;
  }
  ::v-deep .el-collapse-item__arrow {
    position: absolute;
    top: 11px;
    left: 5px;
  }
}
</style>
