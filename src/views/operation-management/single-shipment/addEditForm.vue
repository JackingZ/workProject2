<template>
  <div>
    <div style="padding-top: 10px;">
      <span style="padding-right: 10px;">
        <i class="tip-blue" />
        <span style="font-size: 18px;font-weight: bold;color: #303133;line-height: 32px;">按条件筛选</span>
      </span>
    </div>
    <searchForm
      ref="searchForm"
      @changeTrans="changeTrans"
    />
    <div style="text-align: right;padding: 10px 0;border-bottom: 1px solid #e8e8e8;">
      <el-button
        type="primary"
        size="small"
        @click="handleSearch"
      >
        查询
      </el-button>
      <el-button
        size="small"
        @click="handleReset"
      >
        重置
      </el-button>
      <el-button
        size="small"
        type="text"
        @click="handleCollapse"
      >
        {{ collapseShow ? '收起' : '展开' }}
        <i
          v-if="collapseShow"
          class="el-icon-arrow-up"
        />
        <i
          v-else
          class="el-icon-arrow-down"
        />
      </el-button>
    </div>

    <el-row style="padding-top: 10px;">
      <el-col :span="16">
        <span style="padding-right: 10px;">
          <i class="tip-blue" />
          <span style="font-size: 18px;font-weight: bold;color: #303133;line-height: 32px;">已筛选订单</span>
        </span>
        <el-radio-group
          v-model="selectVal"
          @change="onSelected"
        >
          <el-radio-button label="all">
            全部
          </el-radio-button>
          <el-radio-button label="selected">
            已选择
          </el-radio-button>
        </el-radio-group>
        <span class="select-tip">已选择({{ filterNum() }})票，{{ filterData('CBM') }}CBM，{{ filterData('KGS') }}KGS</span>
        <span class="handle-add">
          装货仓库
        </span>
        <el-button
          v-if="wareSort.length === 0"
          size="small"
          type="text"
          @click="handleWarehouse"
        >
          已选择({{ wareSort.length }})
        </el-button>
        <el-tooltip
          v-if="wareSort.length"
          class="item"
          effect="dark"
          placement="bottom"
        >
          <div slot="content">
            装载次序
            <div
              v-for="(item, index) in wareSort"
              :key="item.id"
            >
              {{ `${index + 1}.${item.name}` }}
            </div>
          </div>
          <el-button
            size="small"
            type="text"
            @click="handleWarehouse"
          >
            已选择({{ wareSort.length }})
          </el-button>
        </el-tooltip>
        <el-input
          v-model="orderCode"
          placeholder="输入原单号查询"
          style="width:200px;margin-left:10px;"
          size="small"
          clearable
        />
      </el-col>
      <el-col
        v-show="selectVal === 'selected'"
        :span="8"
        style="text-align: right;"
      >
        <span class="handle-add">
          手动添加订单
        </span>
        <el-input
          v-model="orderVal"
          placeholder="请输入"
          style="width:200px;margin-right:10px;"
          size="small"
          clearable
        />
        <el-button
          type="primary"
          size="small"
          :loading="selectLoading"
          @click="onAdd"
        >
          添加
        </el-button>
      </el-col>
    </el-row>
    <div
      v-show="selectVal === 'all'"
      style="padding: 20px 0;"
    >
      <div v-show="tableData.length">
        <el-checkbox
          v-model="checkedAll"
          :disabled="wareSort.length === 0"
          style="margin: 0 0 5px 30px;"
          @change="handleCheckedAll"
        >
          全选
        </el-checkbox>
      </div>
      <el-collapse accordion>
        <el-collapse-item
          v-for="(item, index) in queryList"
          :key="item.fba || index"
          class="collapse-position"
        >
          <template slot="title">
            <el-row style="background-color: #ededed;">
              <el-col
                :span="24"
                style="padding-left: 30px;"
              >
                <el-checkbox
                  v-show="boolItem(item)"
                  v-model="item.checkAll"
                  :indeterminate="item.indeterminate"
                  style="margin-right: 0;"
                  @change="($event) => handleSelectAll($event, item, index)"
                />
                <span style="padding-left: 5px;">
                  {{ item.fba === 'xxxx' ? '私人地址      ' : 'FBA仓库 ' + '[' + item.fba + ']' }}
                </span>
                <span style="padding-left: 20px;">
                  总票数：{{ item.list.length }}&nbsp;&nbsp;
                  总体积：{{ fbaVolWeiFormat(item.list, 'CBM') }}&nbsp;CBM&nbsp;
                  总重量：{{ fbaVolWeiFormat(item.list, 'KGS') }}&nbsp;KGS&nbsp;
                  总件数：{{ fbaPkgFormat(item.list) }}
                </span>
                <span
                  v-show="boolItem(item)"
                  style="padding-left: 20px;"
                >
                  (可发货&nbsp;
                  总票数：{{ shipNumFormat(item.list) }}&nbsp;&nbsp;
                  总体积：{{ shipVolWeiFormat(item.list, 'CBM') }}&nbsp;CBM&nbsp;
                  总重量：{{ shipVolWeiFormat(item.list, 'KGS') }}&nbsp;KGS&nbsp;
                  总件数：{{ shipPkgFormat(item.list) }})
                </span>
              </el-col>
            </el-row>
          </template>
          <div
            v-for="(row, num) in item.list"
            :key="row.code"
            class="flex-row-list"
          >
            <div style="width: 50px;">
              <el-checkbox
                v-show="boolWare(row)"
                v-model="row.checked"
                class="text-box"
                @change="($event) => handleSelected($event, row, num, index, item)"
              />
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
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <div
      v-show="selectVal === 'selected'"
      style="padding: 20px 0;"
    >
      <el-collapse accordion>
        <el-collapse-item
          v-for="(item, index) in querySelectList"
          :key="item.fba || index"
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
            v-for="row in item.list"
            :key="row.code"
            class="flex-row-list"
          >
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
            <div style="width: 50px;">
              <el-button
                type="text"
                size="medium"
                @click="deleteRow(item.fba, row.id)"
              >
                删除
              </el-button>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-dialog
      title="选择装货仓库"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      width="960px"
      @closed="cancel"
    >
      <div v-loading="dialogLoading">
        <div style="display: flex;flew-flow: column nowrap;">
          <div style="flex: 1;margin: 0 30px;">
            <span style="line-height: 28px;font-weight: bold;font-size: 16px;">可选仓库</span>
            <el-card shadow="never">
              <el-input
                v-model="searchName"
                size="mini"
                placeholder="请输入搜索关键字"
                clearable
              >
                <i
                  slot="prefix"
                  class="el-input__icon el-icon-search"
                />
              </el-input>
              <el-checkbox-group
                v-model="wareOption"
                style="height: 400px;overflow-y: auto;"
                @change="onWarehouse"
              >
                <el-checkbox
                  v-for="item in warehouseData"
                  :key="item.id"
                  :label="item.id"
                  style="display: block;margin: 5px 0;"
                >
                  {{ item.name }}
                </el-checkbox>
              </el-checkbox-group>
            </el-card>
          </div>
          <div style="flex: 1;margin: 0 30px;">
            <span style="line-height: 28px;font-weight: bold;font-size: 16px;">已选仓库</span>
            <el-card shadow="never">
              <span style="line-height: 28px;color: #ccc;">拖拽排序可调整装货次序</span>
              <div
                style="height: 400px;overflow-y: auto;"
                class="ware-sort"
              >
                <div
                  v-for="(item, index) in wareSelected"
                  :key="item.id"
                  style="margin: 5px 0;"
                >
                  <el-row>
                    <el-col
                      :span="22"
                      class="drag-btn"
                    >
                      <span>
                        <i class="el-icon-rank" />
                      </span>
                      <span> {{ item.name }}</span>
                    </el-col>
                    <el-col :span="2">
                      <i
                        class="el-icon-close"
                        style="cursor: pointer;"
                        @click="deleteWare(item, index)"
                      />
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-card>
          </div>
        </div>
        <div
          slot="footer"
          style="text-align: right;margin: 20px 40px 0;"
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
            @click="confirm"
          >
            确定
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import searchForm from '@/views/operation-management/single-shipment/searchForm.vue'
import {
  getShipList,
  getCodeOrder,
  getCreditById,
  getWHList
} from '@/api/operation-of-single-shipment'
import dayjs from 'dayjs'
import Sortablejs from 'sortablejs'

@Component({
  name: '',
  components: {
    searchForm
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
  private orderVal: any = ''
  private orderCode: any = ''
  private selectLoading: boolean = false
  private dialogLoading: boolean = false
  private dialogShow: boolean = false
  private collapseShow: boolean = false
  private tableData: any[] = []
  private selectedData: any[] = []
  private warehouseList: any[] = []
  private page: number = 1
  private size: number = 10
  private total: any = 0
  private searchModel: any = {}
  private wareOption: any[] = []
  private wareSelected: any[] = []
  private wareSort: any[] = []
  private searchName: any = ''
  private selectVal: any = 'all'
  private checkedAll: boolean = false
  private checkedIndeterminate: boolean = false
  /* computed */
  get warehouseData() {
    const { searchName, warehouseList } = this
    if (searchName) {
      return warehouseList.filter((data: any) => {
        const { name }: any = data || {}
        const item = { name }
        return Object.keys(item).some(key => {
          return String(data[key]).indexOf(searchName) > -1
        })
      })
    }
    return warehouseList
  }

  get queryList() {
    return this.tableData.reduce((list: any, e: any) => {
      const orderList = (e.list || []).filter((o: any) => o.code.toUpperCase().indexOf(this.orderCode.trim().toUpperCase()) !== -1)
      if (orderList.length) {
        const tamp: any = {
          ...e
        }
        tamp.list = orderList
        list.push(tamp)
      }
      return list
    }, [])
  }
  get querySelectList() {
    return this.selectedData.reduce((list: any, e: any) => {
      const orderList = (e.list || []).filter((o: any) => o.code.toUpperCase().indexOf(this.orderCode.trim().toUpperCase()) !== -1)
      if (orderList.length) {
        const tamp: any = {
          ...e
        }
        tamp.list = orderList
        list.push(tamp)
      }
      return list
    }, [])
  }

  /* methods */
  private setData(model: any, data: any[], warehouses: any) {
    this.selectedData = data || []
    this.wareSort = warehouses || {}
    this.getwarehouseList()
    const root: any = (this as any).$refs.searchForm
    root.setForm(model)
    this.$nextTick(() => {
      this.queryAll(1)
    })
  }
  private getData() {
    const root: any = (this as any).$refs.searchForm
    const obj = root.searchForm || {}
    const { time, ...form } = obj
    this.searchModel = JSON.parse(JSON.stringify(form))
    return {
      model: this.searchModel,
      data: this.selectedData,
      warehouses: this.wareSort
    }
  }
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
    if (row.ifLoading !== 2 && str === 'vol' && umVolume && totalVolume) {
      numVW = (this as any).$volumeConversion(totalVolume, umVolume, 'CBM', 3)
    }
    if (row.ifLoading === 2 && str === 'vol') {
      numVW = (this as any).$volumeConversion(row.surplusVolume, 'CBCM', 'CBM', 3)
    }
    if (str === 'maxVol' && umVolume && maxVolume) {
      numVW = (this as any).$volumeConversion(maxVolume, umVolume, 'CBM', 3)
    }
    if (row.ifLoading !== 2 && str === 'wei' && umWeight && totalWeight) {
      numVW = (this as any).$volumeConversion(totalWeight, umWeight, 'KGS', 3)
    }
    if (row.ifLoading === 2 && str === 'wei') {
      numVW = (this as any).$volumeConversion(row.surplusWeight, 'KGS', 'KGS', 3)
    }
    if (str === 'maxWei' && umWeight && maxWeight) {
      numVW = (this as any).$volumeConversion(maxWeight, umWeight, 'KGS', 3)
    }
    return (numVW || '--') + ' ' + unit
  }

  private fbaVolWeiFormat(arr: any[], val: string) {
    let countV: number = 0
    let countW: number = 0
    arr.map((c: any, i: any) => {
      const um = c.um || {}
      const umVolume = (this as any).$getVolumeUnitByLengthUnit(um.umLength)
      const vw = c.measure || {}
      if (c.ifLoading === 2) {
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
    const pkg = arr.map((it: any) => it.ifLoading === 2 ? it.loadingCount : it.packages)
    return pkg.reduce((prev: any, curr: any) => {
      return prev + curr
    }, 0)
  }
  private filterNum() {
    let num: number = 0
    this.selectedData.map((it: any) => {
      if (it && it.list) {
        num += it.list.length
      }
    })
    return num
  }
  private filterData(val: any) {
    let countV: number = 0
    let countW: number = 0
    const arr: any[] = []
    this.selectedData.map((it: any) => {
      if (it && it.list) {
        arr.push(...it.list)
      }
    })
    arr.map((c: any, i: any) => {
      const um = c.um || {}
      const umVolume = (this as any).$getVolumeUnitByLengthUnit(um.umLength)
      const vw = c.measure || {}
      if (c.ifLoading === 2) {
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
  private shipNumFormat(list: any[]) {
    const arr = list.filter((it: any) => {
      return this.boolWare(it)
    })
    return arr.length
  }
  private shipVolWeiFormat(list: any[], unit: string) {
    const arr = list.filter((it: any) => {
      return this.boolWare(it)
    })
    return this.fbaVolWeiFormat(arr, unit)
  }
  private shipPkgFormat(list: any[]) {
    const arr = list.filter((it: any) => {
      return this.boolWare(it)
    })
    return this.fbaPkgFormat(arr)
  }
  private boolWare(row: any) {
    const wid = (row.warehouse1 || {}).id
    const ifWare = this.wareSort.some((it: any) => it.id === wid)
    return ifWare && this.wareSort.length > 0
  }
  private boolOrder(row: any) {
    // 可发货条件
    const item = {
      ...row,
      fullorderInsufficient: row.fullorderInsufficient || {},
      express: row.express || {},
      warehouse1: row.warehouse1 || {}
    }
    const {
      audit,
      warehouse1: { id: wid },
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
    // const ifWare = this.wareSort.some((it: any) => it.id === wid)
    // this.wareSort.length > 0
    if (((row.ifLoading === 2 && row.ifConfirm === 2) || row.ifLoading === 0) && audit === '1' && wid && MEASURE === '7' && EXAMINE === '10' && ((deliveryWay === '0' && trackingNos) || deliveryWay !== '0') && !ifFrozen) {
      return beShip || (insufficient && insufficientStatus === 1) || (!insufficient && ifPayment) || (!insufficient && !ifPayment && payMethod !== '1')
    } else {
      return false
    }
  }
  private boolItem(item: any) {
    return item.list.some((it: any) => this.boolWare(it))
  }

  private handleCheckedAll(selection: any) {
    this.tableData = this.tableData.map((o: any) => {
      o.list = o.list.map((e: any) => {
        e.checked = selection
        return e
      })
      o.checkAll = selection
      o.indeterminate = false
      return o
    })
    this.setTabelToSelected()
  }

  private handleSelected(selection: any, row: any, index: any, itemIndex: any, item: any) {
    this.tableData = this.tableData.map((o: any) => {
      if (o.fba === item.fba) {
        o.list = o.list.map((e: any) => {
          if (e.code === row.code) {
            e.checked = selection
          }
          return e
        })
        const lenMax = o.list.length
        const len = o.list.filter((it: any) => it.checked).length
        o.indeterminate = len > 0 && len < lenMax
        o.checkAll = len > 0 && len === lenMax
      }
      return o
    })
    this.checkedAll = this.tableData.every((it: any) => it.checkAll)
    this.setTabelToSelected()
  }
  private handleSelectAll(selection: any, row: any, index: any) {
    this.tableData = this.tableData.map((o: any) => {
      if (o.fba === row.fba) {
        o.list = o.list.map((e: any) => {
          if (row.list.find((i: any) => i.code === e.code)) {
            e.checked = selection
          }
          return e
        })
        const lenMax = o.list.length
        const len = o.list.filter((it: any) => it.checked).length
        o.indeterminate = len > 0 && len < lenMax
        o.checkAll = len > 0 && len === lenMax
      }
      return o
    })
    this.checkedAll = this.tableData.every((it: any) => it.checkAll)
    this.setTabelToSelected()
  }
  private setTableSection() {
    this.checkedAll = false
    this.tableData = this.tableData.map((it: any) => {
      const item = this.selectedData.find((s: any) => s.fba === it.fba)
      if (item) {
        it.list.map((l: any) => {
          const itemL = item.list.find((i: any) => i.id === l.id)
          if (itemL) {
            l.checked = true
          } else {
            l.checked = false
          }
          return l
        })
        const lenMax = it.list.length
        const len = it.list.filter((l: any) => l.checked).length
        it.indeterminate = len > 0 && len < lenMax
        it.checkAll = len > 0 && len === lenMax
      }
      return it
    })
  }
  private setTabelToSelected() {
    this.selectedData = this.tableData.filter((it: any) => {
      return (it.checkAll || it.indeterminate) && it.list.some((l: any) => this.boolWare(l))
    }).map((it: any) => {
      const { list, ...form } = it
      return {
        ...form,
        list: list.filter((l: any) => l.checked && this.boolWare(l))
      }
    })
  }
  private toggleSelection(arr: any, bool?: boolean) {
    const root: any = this.$refs.tables
    root.clearSelection()
    if (arr.length > 0) {
      arr.map((row: any) => {
        const api: any = this.$refs.tables
        api.toggleRowSelection(row, bool)
      })
    }
  }

  private onAdd() {
    const editForm: any = (this as any).$refs.searchForm.$refs.searchForm
    const root: any = (this as any).$refs.searchForm
    const obj = root.searchForm || {}
    editForm.validate((valid: any) => {
      if (!valid) return false
      if (this.wareSort.length <= 0) {
        this.$message.error('请选择装货仓库')
        return
      }
      if (!this.orderVal) {
        this.$message.error('请输入原单号')
        return
      }
      this.selectLoading = true
      const params: any = {
        code: this.orderVal,
        type: 'add'
      }
      getCodeOrder(params).then(async(res: any) => {
        const data = res.data || []
        // 一级代理商作为卖方订单
        const arrF = data.filter((it: any) => (it.seller || {}).type === '1')
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
        } else if (arrF.some((it: any) => (it.transChannel).subtypeId !== obj.transport)) {
          this.$message.error('该订单信息与运输类型不一致')
          this.selectLoading = false
          return
        } else if (!arrF.some((it: any) => ((it.transChannel || {}).targets || []).map((e: any) => e.countryId).includes(obj.targetCountry))) {
          this.$message.error('该订单信息与目的国不一致')
          this.selectLoading = false
          return
        } else if (!arrF.some((it: any) => this.wareSort.some((w: any) => w.id === (it.warehouse1 || {}).id))) {
          this.$message.error('该订单信息与装货仓库不一致')
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
        const ifExist = this.tableData.some((it :any) => it.list && it.list.some((l: any) => l.code === this.orderVal))
        if (arrD.length <= 0) {
          this.$message.error('该订单未付款、信用不足，需要申请出库或特批发货')
          this.selectLoading = false
          return
        }
        const fbaId = ((arrF[0] || {}).fbastore || {}).code
        const addType = (arrF[0] || {}).addressType // 私人或者fba
        const arrC = arrD.map((it :any) => {
          return {
            ...it,
            checked: true
          }
        })
        if (ifExist) {
          this.tableData = this.tableData.map((it: any) => {
            it.list.map((l: any) => {
              if (l.code === this.orderVal) {
                l.checked = true
              }
              return l
            })
            const lenMax = it.list.length
            const len = it.list.filter((l: any) => l.checked).length
            it.indeterminate = len > 0 && len < lenMax
            it.checkAll = len > 0 && len === lenMax
            return it
          })
        } else if (addType === '1' && this.tableData.some((it: any) => it.fba === 'xxxx')) {
          this.tableData.map((it: any) => {
            if (it.fba === 'xxxx') {
              it.list.push(...arrC)
              const lenMax = it.list.length
              const len = it.list.filter((l: any) => l.checked).length
              it.indeterminate = len > 0 && len < lenMax
              it.checkAll = len > 0 && len === lenMax
            }
          })
        } else if (addType !== '1' && this.tableData.some((it: any) => it.fba === fbaId)) {
          this.tableData.map((it: any) => {
            if (it.fba === fbaId) {
              it.list.push(...arrC)
              const lenMax = it.list.length
              const len = it.list.filter((l: any) => l.checked).length
              it.indeterminate = len > 0 && len < lenMax
              it.checkAll = len > 0 && len === lenMax
            }
          })
        } else if (addType === '1') {
          this.tableData.push({
            fba: 'xxxx',
            checkAll: true,
            indeterminate: false,
            list: arrC
          })
        } else if (addType !== '1') {
          this.tableData.push({
            fba: fbaId,
            checkAll: true,
            indeterminate: false,
            list: arrC
          })
        }
        this.setTabelToSelected()
        this.$message.success('添加订单成功')
        this.orderVal = ''
        this.selectLoading = false
      }).catch((err: any) => {
        this.selectLoading = false
        return err
      })
    })
  }
  private onSelected(val: any) {
    this.selectVal = val
  }
  private deleteRow(fba: any, id: any) {
    this.tableData.map((it: any) => {
      if (it.fba === fba) {
        it.list.map((l: any) => {
          if (l.id === id) {
            l.checked = false
          }
        })
        const lenMax = it.list.length
        const len = it.list.filter((l: any) => l.checked).length
        it.indeterminate = len > 0 && len < lenMax
        it.checkAll = len > 0 && len === lenMax
      }
    })
    this.checkedAll = false
    this.setTabelToSelected()
  }
  private handleSubmit(bool: any) {
    const root: any = this.$refs.noticeItem
    const id = (this as any).singleId
    root.handleSave(bool, id)
  }

  private queryAll(val?: any) {
    const editForm: any = (this as any).$refs.searchForm.$refs.searchForm
    const root: any = (this as any).$refs.searchForm
    editForm.validate((valid: any) => {
      if (!valid) return false
      const obj = root.searchForm || {}
      const { time, ...form } = obj
      this.searchModel = JSON.parse(JSON.stringify(form))
      this.getTableData(val)
    })
  }
  private getTableData(val?: any) {
    this.$emit('setload', true)
    if (val) {
      this.page = val
    }
    const { lscGroupIds, ...form } = this.searchModel
    const params: any = {
      ...form
    }
    getShipList(params)
      .then((res: any) => {
        this.$emit('setload', false)
        const data = res.data || []
        this.tableData = this.setReduceCodeAndChecked(data, false)
        this.setTableSection()
      })
      .catch((err: any) => {
        this.$emit('setload', false)
        return err
      })
  }
  private setReduceCodeAndChecked(data: any[], bool: boolean) {
    // 初始化，重组订单为仓库集合，及勾选状态设定
    // 私人地址
    const json = data.filter((it: any) => this.boolOrder(it))
    const arrS = json.filter((it: any) => it.addressType === '1')
    const arrF = json.filter((it: any) => it.addressType !== '1')
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
    }
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

  // 仓库列表
  private handleWarehouse() {
    this.dialogShow = true
    this.wareSelected = JSON.parse(JSON.stringify(this.wareSort))
    this.wareOption = this.wareSelected.map((it: any) => it.id)
    this.getwarehouseList()
  }
  private getwarehouseList() {
    this.dialogLoading = true
    const model: any = {
      custId: '0',
      countryId: 'CN'
    }
    getWHList({
      model,
      page: 1,
      size: 9999
    })
      .then(res => {
        const data = res.data || {}
        this.warehouseList = data.result || []
        this.dialogLoading = false
      })
      .catch(err => {
        this.dialogLoading = false
        return err
      })
  }
  private onWarehouse() {
    this.wareSelected = []
    this.wareOption.map((it: any) => {
      const item = this.warehouseList.find((w: any) => w.id === it)
      if (item) {
        this.wareSelected.push(item)
      }
    })
    this.setSort()
  }
  private setSort() {
    if (this.wareSelected.length > 0) {
      this.$nextTick(() => {
        const node: any = document.querySelector('.ware-sort')
        const that = this
        Sortablejs.create(node, {
          handle: '.drag-btn',
          animation: 300,
          onEnd: ({ newIndex, oldIndex }: any) => {
            const currRow = that.wareSelected.splice(oldIndex, 1)[0]
            that.wareSelected.splice(newIndex, 0, currRow)
          }
        })
      })
    }
  }
  private deleteWare(item: any, index: number) {
    this.wareSelected.splice(index, 1)
    this.wareOption = this.wareOption.filter((it: any) => it !== item.id)
  }
  private cancel() {
    this.wareSelected = []
    this.wareOption = []
    this.dialogShow = false
  }
  private confirm() {
    this.dialogShow = false
    this.wareSort = JSON.parse(JSON.stringify(this.wareSelected))
    this.selectedData = []
    this.tableData.map((it: any) => {
      it.list.map((l: any) => {
        l.checked = false
      })
      it.indeterminate = false
      it.checkAll = false
    })
    this.checkedAll = false
    this.cancel()
  }

  private changeTrans() {
    this.selectedData = []
    this.tableData = []
  }
  private handleSearch() {
    this.selectedData = []
    this.queryAll(1)
  }
  private handleReset() {
    const root: any = (this as any).$refs.searchForm
    root.reset()
  }
  private handleCollapse() {
    this.collapseShow = !this.collapseShow
    const root: any = (this as any).$refs.searchForm
    root.setCollapse(this.collapseShow)
  }
}
</script>

<style lang="scss" scoped>
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

.drag-btn {
  cursor: move;
}

.tip-blue {
  float: left;
  width: 3px;
  height: 18px;
  background-color: #409EFF;
  margin: 8px 5px;
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

::v-deep .el-dialog__body {
  padding: 10px 20px 20px;
}
::v-deep .el-radio-button__inner {
  padding: 8px 20px;
}
::v-deep .el-checkbox__input {
  z-index: 0;
}
.select-tip {
  padding: 0 20px;
  line-height: 32px;
  height: 32px;
  display: inline-block;
}

.el-collapse {
  border-top: none;
  border-bottom: none;
  ::v-deep .el-collapse-item__content {
    padding-bottom: 0px;
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
  ::v-deep .el-collapse-item__content {
    padding-bottom: 0px;
    max-height: 250px;
    overflow: auto;
  }
}
</style>
