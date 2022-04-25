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
            外协报价
          </el-col>
          <el-col
            :span="12"
            style="text-align: right;"
          >
            <el-button
              v-permission="['priceOutsourcAdd']"
              type="text"
              size="small"
              @click="addPrice"
            >
              新增报价
            </el-button>
          </el-col>
        </el-row>
        <el-row
          :gutter="2"
          style="padding-top: 10px;"
        >
          <el-form
            :model="queryParams"
            class="search-form"
            size="mini"
          >
            <el-col :span="6">
              <el-form-item>
                <el-select
                  v-model="queryParams.supplierId"
                  size="mini"
                  clearable
                  filterable
                  placeholder="供应商"
                  style="width: 100%;"
                  @change="supplierChange"
                >
                  <el-option
                    v-for="item in supplierList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-select
                  v-model="queryParams.subtypeId"
                  size="mini"
                  clearable
                  filterable
                  :loading="selectLoading"
                  placeholder="业务类型"
                  style="width: 100%;"
                  @focus="getSubtypeList"
                  @change="subtypeChange"
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-select
                  v-model="queryParams.countryId"
                  size="mini"
                  clearable
                  :loading="selectLoading"
                  filterable
                  placeholder="目的国"
                  style="width: 100%;"
                  @focus="getCountryList"
                  @change="countryChange"
                >
                  <el-option
                    v-for="item in countryList"
                    :key="item.id"
                    :label="`${item.name}-${item.alias}`"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-popover
                  v-model="popoverShow"
                  placement="bottom-start"
                  trigger="click"
                >
                  <div style="padding-right: 15px;">
                    <el-form-item
                      label="交货区域"
                      label-width="90px"
                    >
                      <div>
                        <el-checkbox
                          v-model="checkAll"
                          :indeterminate="isIndeterminate"
                          @change="handleCheckAll"
                        >
                          全选
                        </el-checkbox>
                        <el-checkbox-group
                          v-model="queryParams.deliveryArea"
                          @change="handleChecked"
                        >
                          <el-checkbox
                            v-for="(item, index) in deliveryAreaList"
                            :key="index"
                            :label="item.id"
                          >
                            {{ item.name }}
                          </el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </el-form-item>
                    <el-form-item
                      label="目的地类型"
                      label-width="90px"
                    >
                      <el-radio-group
                        v-model="queryParams.purposeType"
                        @change="handlePurpose"
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
                      <el-radio-group
                        v-model="queryParams.includeTax"
                        @change="handlerChange"
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
                        v-model="queryParams.dispatch"
                        @change="handlerChange"
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
                          v-if="queryParams.subtypeId === '1' || queryParams.subtypeId === '2'"
                          label="3"
                        >
                          整柜直送
                        </el-radio-button>
                        <el-radio-button
                          v-if="queryParams.purposeType === 2"
                          label="4"
                        >
                          到仓
                        </el-radio-button>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item
                      label="审核状态"
                      label-width="90px"
                    >
                      <el-select
                        v-model="queryParams.audit"
                        size="mini"
                        clearable
                        filterable
                        placeholder="请选择"
                        style="width: 280px;"
                      >
                        <el-option
                          v-for="item in auditList"
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
                        v-model="queryParams.lscId"
                        :loading="selectLoading"
                        size="mini"
                        clearable
                        filterable
                        placeholder="请选择"
                        style="width: 280px;"
                        @focus="getPrivatelineList"
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
                      label="有效时间"
                      label-width="90px"
                    >
                      <el-date-picker
                        v-model="queryParams.times"
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
                  >
                    <el-input
                      placeholder="全部筛选"
                      readonly
                      suffix-icon="el-select__caret el-input__icon el-icon-arrow-up"
                    />
                  </div>
                </el-popover>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <el-scrollbar
          v-loading="loading"
          style="height: calc(100vh - 280px);"
        >
          <div
            v-if="priceList.length === 0"
            class="empty"
            style="text-align: center;line-height: 50px;font-size: 12px;color: #909399;"
          >
            暂无报价
          </div>
          <div
            v-for="item in priceList"
            :key="item.id"
            class="price-card"
            :class="{'active-card': showPriceId === item.id}"
            @click="showPrice(item.id, false)"
            @contextmenu.prevent="showMenu(item, $event)"
          >
            <el-row>
              <el-col :span="1">
                <el-tooltip
                  v-if="item.audit === 1"
                  effect="dark"
                  content="待审核"
                  placement="top"
                >
                  <i
                    class="card-tips card-tip-zero"
                  />
                </el-tooltip>
                <el-tooltip
                  v-if="item.audit === 4"
                  effect="dark"
                  content="已通过"
                  placement="top"
                >
                  <i
                    class="card-tips card-tip-one"
                  />
                </el-tooltip>
                <el-tooltip
                  v-if="item.audit === 3"
                  effect="dark"
                  content="已拒绝"
                  placement="top"
                >
                  <i
                    class="card-tips card-tip-two"
                  />
                </el-tooltip>
                <el-tooltip
                  v-if="item.audit === 2"
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
                {{ (item.lsc || {}).value }}
              </el-col>
            </el-row>
            <el-row style="margin-top: 10px;">
              <el-col :span="4">
                交货区域
              </el-col>
              <el-col
                :span="20"
                class="word-limit"
                style="color:  #409EFF;"
              >
                {{ (item.deliveries || []).map(e => e.value).join('，') }}
              </el-col>
            </el-row>
            <el-row style="margin-top: 10px;">
              <el-col :span="4">
                供应商
              </el-col>
              <el-col
                :span="20"
                class="word-limit"
                style="color:  #409EFF;"
              >
                {{ item.fromCustName }}
              </el-col>
            </el-row>
            <el-row
              v-if="userInfo.custType === '0'"
              style="margin-top: 10px;"
            >
              <el-col :span="4">
                所属公司
              </el-col>
              <el-col
                :span="20"
                class="word-limit"
                style="color:  #409EFF;"
              >
                {{ item.toCustName }}
              </el-col>
            </el-row>
            <el-row style="margin-top: 10px;">
              <el-col :span="3">
                <span
                  v-if="item.status === 2"
                  class="btn-tip-green"
                >
                  生效中
                </span>
                <span
                  v-if="item.status === 1"
                  class="btn-tip-blue"
                >
                  待生效
                </span>
                <span
                  v-if="item.status === 9"
                  class="btn-tip-grey"
                >
                  已失效
                </span>
              </el-col>
              <el-col
                :span="21"
                style="line-height: 16px;"
              >
                {{ item.startTime + '-' + item.endTime }}
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
                </span>
              </el-col>
            </el-row>
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
    <price-form
      ref="priceForm"
      :delivery-area-list="deliveryAreaList"
      @cancel="cancelPriceForm"
      @save="saveSuccess"
      @delete="deletePriceSuccess"
    />
    <ul
      v-show="isShowMenu"
      :style="{left: menuLeft+'px', top: menuTop+'px'}"
      class="contextmenu"
    >
      <li
        v-permission="['priceOutsourcCopy']"
        class="contextmenu-item"
        @click="showPrice(showMenuRow.id, true)"
      >
        复制
      </li>
      <li
        v-permission="['priceOutsourcView']"
        class="contextmenu-item"
        @click="showPrice(showMenuRow.id, false)"
      >
        查看
      </li>
      <li
        v-if="[1, 3].includes(showMenuRow.audit) && $checkPermission(['priceOutsourcDel'])"
        class="contextmenu-item"
        @click="deletePrice"
      >
        删除
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import priceForm from '@/views/price-management/price-outsourc/components/priceForm.vue'
import {
  getSupplierList,
  getSubtypeBySupplier,
  getSubtypeByType,
  getCountryBySupplier,
  getCountryList,
  getDeliveryCity,
  getLscComplicatedList,
  getPriceList,
  deletePriceById
} from '@/api/price-to-outsourc'
import dayjs from 'dayjs'

@Component({
  name: '',
  components: {
    priceForm
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private isActive: boolean = true
  private loading: boolean = false
  private isShowMenu: boolean = false
  private popoverShow: boolean = false
  private checkAll: boolean = false
  private isIndeterminate: boolean = false
  private selectLoading: boolean = false
  private queryParams: any = {
    audit: '',
    supplierId: '',
    subtypeId: '',
    countryId: '',
    deliveryArea: [],
    includeTax: undefined,
    purposeType: undefined,
    dispatch: undefined,
    lscId: undefined,
    times: []
  }
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  private showMenuRow: any = {}
  private priceList: any[] = []
  private supplierList: any[] = []
  private typeList: any[] = []
  private countryList: any[] = []
  private deliveryAreaList: any[] = []
  private serviceList: any[] = []
  private auditList: any[] = [
    {
      id: 1,
      name: '待审核'
    },
    {
      id: 2,
      name: '审核中'
    },
    {
      id: 4,
      name: '已通过'
    },
    {
      id: 3,
      name: '已拒绝'
    }
  ]
  private showPriceId: any = ''
  private menuLeft: number = 0
  private menuTop: number = 0
  /* computed */
  get userInfo(): any {
    return UserModule.info || {}
  }
  @Watch('isShowMenu')
  private onIsShowMenuChange(value: boolean) {
    if (value) {
      document.body.addEventListener('click', this.closeMenu)
    } else {
      document.body.removeEventListener('click', this.closeMenu)
    }
  }
  /* methods */
  private closeMenu() {
    this.isShowMenu = false
    this.showMenuRow = {}
  }
  private deletePrice() {
    this.$confirm('请确认是否删除该报价?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        const params = {
          id: this.showMenuRow.id
        }
        this.loading = true
        this.isShowMenu = false
        this.showMenuRow = {}
        deletePriceById(params).then((res: any) => {
          this.$message.success('删除成功')
          this.loading = false
          this.getPriceList(1)
        }).catch((err: any) => {
          this.loading = false
          return err
        })
      })
      .catch(() => {
        this.isShowMenu = false
        return false
      })
  }
  private showMenu(row: any, event: MouseEvent) {
    this.showMenuRow = row
    this.menuLeft = event.clientX
    this.menuTop = event.clientY
    this.isShowMenu = true
  }
  private deletePriceSuccess() {
    this.cancelPriceForm()
    this.getPriceList(1)
  }
  private saveSuccess(id: any) {
    this.getPriceList()
    this.showPrice(id, false)
  }
  private cancelPriceForm() {
    this.showPriceId = ''
  }
  private showPrice(id: any, isCopy: boolean) {
    if (!(this as any).$checkPermission(['priceOutsourcView', 'priceOutsourcCopy'])) return
    this.showPriceId = id
    this.isShowMenu = false
    this.showMenuRow = {}
    const priceFormRef: any = this.$refs.priceForm
    priceFormRef.showForm(id, isCopy)
  }
  private addPrice() {
    this.showPriceId = ''
    const priceFormRef: any = this.$refs.priceForm
    priceFormRef.add()
  }
  private handlePurpose() {
    this.queryParams.dispatch = undefined
  }
  private handlerChange() {
    this.queryParams.lscId = ''
  }
  private countryChange() {
    this.queryParams.lscId = ''
    this.getPriceList(1)
  }
  private subtypeChange() {
    this.queryParams.lscId = ''
    this.queryParams.dispatch = undefined
    this.getPriceList(1)
  }
  private supplierChange() {
    this.queryParams.subtypeId = ''
    this.queryParams.countryId = ''
    this.getPriceList(1)
  }
  private handleSizeChange(val: string) {
    this.pagination.size = Number(val)
    this.getPriceList()
  }
  private handleCurrentChange(val: string) {
    this.pagination.page = Number(val)
    this.getPriceList()
  }
  private getPriceList(page?: number) {
    // 获取报价列表
    if (page === 1) {
      this.pagination.page = 1
    }
    const params = {
      model: {
        supplierId: this.queryParams.supplierId,
        audit: this.queryParams.audit,
        deliveries: this.queryParams.deliveryArea,
        destinationCountry: this.queryParams.countryId,
        // destinationPort: '',
        dispatch: this.queryParams.dispatch,
        endTime: '',
        includeTax: this.queryParams.includeTax,
        lscId: this.queryParams.lscId,
        purposeType: this.queryParams.purposeType,
        startTime: '',
        // status: 0,
        subtypeId: this.queryParams.subtypeId
      },
      page: this.pagination.page,
      size: this.pagination.size
    }
    if (this.queryParams.times.length) {
      params.model.startTime = dayjs(this.queryParams.times[0]).format('YYYY:MM:DD HH:mm:ss')
      params.model.endTime = dayjs(this.queryParams.times[1]).format('YYYY:MM:DD HH:mm:ss')
    }
    this.loading = true
    getPriceList(params).then((res: any) => {
      this.loading = false
      const data = res.data || {}
      this.priceList = data.result || []
      this.pagination.total = data.total || 0
    }).catch(() => {
      this.priceList = []
      this.pagination.total = 0
      this.loading = false
    })
  }
  private handleClear() {
    this.checkAll = false
    this.isIndeterminate = false
    this.queryParams.deliveryArea = []
    this.queryParams.purposeType = undefined
    this.queryParams.includeTax = undefined
    this.queryParams.dispatch = undefined
    this.queryParams.lscId = undefined
    this.queryParams.audit = ''
    this.queryParams.times = []
    this.getPriceList(1)
  }
  private handleConfirm() {
    this.popoverShow = false
    this.getPriceList(1)
  }
  private getPrivatelineList() {
    const params = {
      countryId: this.queryParams.countryId,
      subtypeId: this.queryParams.subtypeId,
      includeTax: this.queryParams.includeTax,
      dispatch: this.queryParams.dispatch,
      purposeType: this.queryParams.purposeType,
      outsourcing: '1,2'
    }
    this.selectLoading = true
    getLscComplicatedList(params).then((res: any) => {
      this.selectLoading = false
      const data = res.data || []
      this.serviceList = data.map((it: any) => {
        it.label = `${it.name}(${it.abbr})`
        return it
      })
    }).catch(() => {
      this.selectLoading = false
      this.serviceList = []
    })
  }
  private handleCheckAll(val: boolean) {
    this.isIndeterminate = false
    this.queryParams.deliveryArea = val ? this.deliveryAreaList.map((e: any) => e.id) : []
  }
  private handleChecked(val: any[]) {
    const numC = (val || []).length
    const numA = (this.deliveryAreaList || []).length
    this.checkAll = numC === numA
    this.isIndeterminate = numC > 0 && numC < numA
  }
  private toggle() {
    this.isActive = !this.isActive
  }
  private getDeliveryCity() {
    getDeliveryCity().then((res: any) => {
      this.deliveryAreaList = res.data || []
    }).catch(() => {
      this.deliveryAreaList = []
    })
  }
  private getCountryList() {
    this.countryList = []
    const params: any = {
      typeId: '05'
    }
    let getCountryListFn = null
    if (this.queryParams.supplierId) {
      params.custId = this.queryParams.supplierId
      getCountryListFn = getCountryBySupplier
      this.selectLoading = true
    } else {
      getCountryListFn = getCountryList
      this.selectLoading = true
    }
    getCountryListFn && getCountryListFn(params).then((res: any) => {
      this.selectLoading = false
      if (params.custId) {
        this.countryList = res.data || []
      } else {
        const data = res.data || {}
        this.countryList = data.result || []
      }
    }).catch(() => {
      this.selectLoading = false
      this.countryList = []
    })
  }
  private getSubtypeList() {
    this.typeList = []
    const params: any = {
      typeId: '05'
    }
    let getSubtypeListFn = null
    if (this.queryParams.supplierId) {
      params.custId = this.queryParams.supplierId
      getSubtypeListFn = getSubtypeBySupplier
      this.selectLoading = true
    } else {
      getSubtypeListFn = getSubtypeByType
      this.selectLoading = true
    }
    getSubtypeListFn && getSubtypeListFn(params).then((res: any) => {
      this.selectLoading = false
      this.typeList = res.data || []
    }).catch(() => {
      this.selectLoading = false
      this.typeList = []
    })
  }
  private getSupplierList() {
    const params = {
      page: 1,
      size: 999,
      parentId: 0,
      types: '05'
    }
    getSupplierList(params).then((res: any) => {
      const data = res.data || {}
      this.supplierList = data.result || []
    }).catch(() => {
      this.supplierList = []
    })
  }
  private created() {
    this.getPriceList()
    this.getSupplierList()
    this.getDeliveryCity()
  }
}
</script>

<style lang="scss" scoped>
  .price-card{
    cursor: pointer;
    width: 100%;
    border-radius: 4px;
    border: 1px solid #E6E6E6;
    padding: 10px;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
    font-size: 12px;
    margin-bottom: 10px;
    transition: all .3s;
    &:hover{
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .2);
    }
    &.active-card{
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
  ::v-deep{
    .search-form{
      .el-form-item--mini.el-form-item{
        margin-bottom: 10px;
      }
      .el-input__inner {
        padding-left: 8px;
      }
    }
  }
</style>
