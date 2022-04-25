<template>
  <div v-loading="formLoading">
    <el-form
      ref="searchForm"
      :model="searchForm"
      :rules="formRules"
      label-width="110px"
      size="small"
      class="search-form"
    >
      <div class="item-rules-box">
        <el-form-item
          label="运输方式："
          prop="transport"
        >
          <el-radio-group
            v-model="searchForm.transport"
            @change="onTrans"
          >
            <el-radio-button
              v-for="(item, index) in transportList"
              :key="index"
              :label="item.id"
            >
              {{ item.name }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="searchForm.transport === '1' || searchForm.transport === '2'"
          label="直送/拆柜："
          prop="cabinetType"
        >
          <el-row>
            <el-col :span="12">
              <el-radio-group
                v-model="searchForm.cabinetType"
                @change="onCabinet"
              >
                <el-radio-button
                  v-for="(item, index) in sendStripList"
                  :key="index"
                  :label="`${index}`"
                >
                  {{ item }}
                </el-radio-button>
              </el-radio-group>
            </el-col>
            <el-col
              v-if="searchForm.cabinetType === '1'"
              :span="12"
            >
              <el-checkbox v-model="searchForm.fitFba">
                严格按直送仓标准
              </el-checkbox>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item
          label="时间范围："
          prop="time"
        >
          <el-date-picker
            v-model="searchForm.time"
            unlink-panels
            type="daterange"
            align="right"
            size="small"
            value-format="yyyy-MM-dd"
            range-separator="~"
            style="width:100%;"
            start-placeholder="起始时间"
            end-placeholder="截止时间"
            @change="changeTime"
          />
        </el-form-item>
        <el-form-item
          label="目的国："
          prop="targetCountry"
        >
          <el-select
            v-model="searchForm.targetCountry"
            :disabled="!searchForm.transport"
            :loading="selectLoading"
            placeholder="请选择"
            size="small"
            clearable
            filterable
            style="width:100%;"
            @focus="getCountryData"
            @change="onCountry"
          >
            <el-option
              v-for="item in countryList"
              :key="item.id"
              :label="`${item.name}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <div v-show="isShow">
          <el-form-item
            v-if="searchForm.transport !== '4'"
            label="目的港："
          >
            <el-input
              v-model="ss"
              :placeholder="`已选择(${searchForm.targetPort.length})`"
              style="width: 100%;"
              disabled
            >
              <el-button
                slot="append"
                :disabled="!searchForm.targetCountry"
                icon="el-icon-search"
                @click="handleItem('targetPort')"
              />
            </el-input>
          </el-form-item>
          <el-form-item
            label="目的仓："
            :class="isFba ? 'is-required' : ''"
            prop="fbastoreId"
          >
            <el-input
              v-model="ss"
              :placeholder="`已选择(${searchForm.fbastoreId.length})`"
              style="width: 100%;"
              disabled
            >
              <el-button
                slot="append"
                :disabled="!searchForm.targetCountry"
                icon="el-icon-search"
                @click="handleItem('fbastoreId')"
              />
            </el-input>
          </el-form-item>
          <el-form-item
            label="货物所在仓："
          >
            <el-input
              v-model="ss"
              :placeholder="`已选择(${searchForm.warehouseId.length})`"
              style="width: 100%;"
              disabled
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="handleItem('warehouseId')"
              />
            </el-input>
          </el-form-item>
        </div>
      </div>
      <div v-show="isShow">
        <el-form-item
          label="税单方式："
          style="width: 25%;"
        >
          <el-radio-group
            v-model="searchForm.includeTax"
            size="mini"
            @change=";(searchForm.lscId = [], searchForm.lscGroupIds = [])"
          >
            <el-radio-button
              :label="undefined"
            >
              全部
            </el-radio-button>
            <el-radio-button
              :label="true"
            >
              包税
            </el-radio-button>
            <el-radio-button
              :label="false"
            >
              不包税
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="searchForm.cabinetType === '0'"
          label="派送方式："
          style="width: 35%;"
        >
          <el-checkbox-group
            v-model="searchForm.deliveryWay"
            @change=";(searchForm.lscId = [], searchForm.lscGroupIds = [])"
          >
            <el-checkbox
              label="1"
            >
              快递
            </el-checkbox>
            <el-checkbox
              label="0"
            >
              卡派
            </el-checkbox>
            <el-checkbox
              label="2"
            >
              自提
            </el-checkbox>
            <el-checkbox
              v-if="searchForm.transport === '1' || searchForm.transport === '2'"
              label="3"
            >
              整柜直送
            </el-checkbox>
            <el-checkbox
              label="4"
            >
              到仓
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="报关方式："
          style="width: 40%;"
        >
          <el-checkbox-group v-model="searchForm.customs">
            <el-checkbox
              v-for="(item, index) in customsClearanceList"
              :key="index"
              :label="`${index}`"
            >
              {{ item }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="货物类型："
          style="width: 50%;"
        >
          <el-checkbox-group
            v-model="searchForm.category"
          >
            <el-checkbox
              v-for="(item, index) in goodsList"
              :key="index"
              :label="`${index}`"
            >
              {{ item }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="货物状态："
          style="width: 50%;"
        >
          <el-checkbox-group
            v-model="checkedGoodsStatus"
            @change="onGoodsStatus"
          >
            <el-checkbox
              v-for="(item, index) in goodsStatusList"
              :key="index"
              :label="item"
            >
              {{ item }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="客户级别："
          style="width: 50%;"
        >
          <el-checkbox-group
            v-model="checkedCustomerLevel"
            @change="onLevel"
          >
            <el-checkbox
              v-for="(item, index) in customerLevelList"
              :key="index"
              :label="item.id"
            >
              {{ item.code }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          v-if="searchForm.transport === '1' && searchForm.targetCountry === 'US'"
          label="服务机构："
          style="width: 50%;"
        >
          <el-checkbox-group
            v-model="searchForm.orgTag"
            @change=";(searchForm.lscId = [], searchForm.lscGroupIds = [])"
          >
            <el-checkbox
              v-for="(item, index) in orgList"
              :key="index"
              :label="item.id"
            >
              {{ item.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </div>
      <div
        v-show="isShow"
        class="item-box"
      >
        <el-form-item
          label="服务："
        >
          <el-input
            v-model="ss"
            :placeholder="`已选择(${searchForm.lscId.length})`"
            style="width: 100%;"
            disabled
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handleItem('lscId')"
            />
          </el-input>
        </el-form-item>
        <el-form-item
          label="清关证书："
        >
          <el-radio-group v-model="searchForm.certificate">
            <el-radio-button
              v-for="(item, index) in certificateData"
              :key="index"
              :label="`${index}`"
            >
              {{ item }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="选择证书："
        >
          <el-input
            v-model="ss"
            :placeholder="`已选择(${searchForm.certificateList.length})`"
            style="width: 100%;"
            disabled
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handleItem('certificateList')"
            />
          </el-input>
        </el-form-item>
        <el-form-item
          label="快递公司："
        >
          <el-input
            v-model="ss"
            :placeholder="`已选择(${searchForm.expressId.length})`"
            style="width: 100%;"
            disabled
          >
            <el-button
              slot="append"
              :disabled="!searchForm.targetCountry"
              icon="el-icon-search"
              @click="handleItem('expressId')"
            />
          </el-input>
        </el-form-item>
      </div>
    </el-form>

    <el-dialog
      :title="itemTitle"
      :visible.sync="itemShow"
      :close-on-click-modal="false"
      width="960px"
      @close="itemClose"
    >
      <div v-loading="itemLoading">
        <div style="text-align: right;padding: 0 45px 10px 0;">
          <el-select
            v-if="itemVal === 'lscId'"
            v-model="searchForm.lscGroupIds"
            multiple
            collapse-tags
            clearable
            size="small"
            style="width:200px;"
            placeholder="服务组"
            @change="onGroup"
          >
            <el-option
              v-for="item in groupList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
        <el-transfer
          ref="transferItem"
          v-model="itemArr"
          filterable
          :filter-method="filterMethod"
          :titles="[itemTitle, '已选择']"
          :props="{key: 'id', label: 'name'}"
          filter-placeholder="输入搜索"
          :data="itemList"
          style="height: 500px;"
        />
        <div
          slot="footer"
          style="text-align: right;margin: 10px 40px 0;"
        >
          <el-button
            size="small"
            @click="itemClose"
          >
            取 消
          </el-button>

          <el-button
            type="primary"
            size="small"
            @click="itemClose"
          >
            确 定
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
import {
  getCustTypeList,
  getCountryList,
  getServiceCountry,
  getPortList,
  getExpressCompany,
  getFbastoreList,
  getAreaList,
  getWarehouseAllList,
  getServiceSubtypeList,
  getCustRatingList,
  getLscComplicatedList,
  getLscGroupList
} from '@/api/operation-of-single-shipment'

function paramsForm() {
  return {
    category: [],
    creditRating: [],
    certificateList: [],
    customs: [],
    expressId: [],
    frozen: false,
    audit: false,
    cabinetType: '0',
    deliveryWay: [],
    win: false,
    lock: false,
    measure: false,
    examine: false,
    tracking: false,
    fitFba: false,
    transport: undefined,
    startDate: undefined,
    endDate: undefined,
    time: [],
    warehouseId: [],
    orgTag: [],
    lscId: [],
    lscGroupIds: [],
    fbastoreId: [],
    targetPort: [],
    fbastoreName: undefined,
    lscName: undefined,
    targetCountry: undefined,
    certificate: undefined,
    includeTax: undefined
  }
}

@Component({
  name: '',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private searchForm: any = paramsForm()
  private formRules: any = {
    transport: [
      { required: true, message: '请选择运输方式', trigger: 'change' }
    ],
    cabinetType: [
      { required: true, message: '请选择直送/拆柜', trigger: 'change' }
    ],
    time: [
      { required: true, message: '请选择时间范围', trigger: 'change' }
    ],
    targetCountry: [
      { required: true, message: '请选择目的国', trigger: 'change' }
    ],
    fbastoreId: { validator: this.validateData, trigger: 'change' }
  }
  private isIndeterminate: boolean = false
  private checkedGoodsStatus: any[] = []
  private checkedCustomerLevel: any[] = []
  private goodsList: any[] = ['普货', '带电', '纯电', '带磁', '液体粉末', '木制品', '其他']
  private goodsStatusList: any[] = ['已审核', '已锁舱', '已入库', '已计量', '已验货', '已出转单', '冻结件']
  private customsClearanceList: any[] = ['买单', '一般贸易已委托', '一般贸易未委托']
  private customerLevelList: any[] = []
  private orgList: any[] = [
    { name: '美森', id: '1' },
    { name: '以星', id: '2' },
    { name: '快线', id: '3' },
    { name: '其他', id: '4' }
  ]
  private transportList: any[] = []
  private sendStripList: any[] = ['拆柜', '直送']
  private certificateData: any[] = ['非证书柜', '纯证书柜', '混合柜']
  private expressList: any[] = []
  private fbaStoreList: any[] = []
  private serviceList: any[] = []
  private portToList: any[] = []
  private warehouseList: any[] = []
  private countryList: any[] = []
  private credentialList: any[] = []
  private addressList: any[] = []
  private supplierList: any[] = []
  private destinationList: any[] = []
  private selectLoading: boolean = false
  private formLoading: boolean = false
  private itemLoading: boolean = false
  private itemShow: boolean = false
  private isShow: boolean = false
  private itemArr: any[] = []
  private itemList: any[] = []
  private groupList: any[] = []
  private ss: any = ''
  private itemTitle: any = ''
  private itemVal: any = ''
  /* computed */
  get isFba() {
    const form = (this as any).searchForm
    return form.cabinetType === '1'
  }
  /* methods */
  private validateData(rule: any, value: any, callback: any) {
    const root: any = (this as any).searchForm
    const isTrue = root.cabinetType === '1' // 直送
    if (isTrue && !value) {
      callback(new Error('目的仓不能为空'))
    } else {
      callback()
    }
  }
  private reset() {
    this.searchForm = paramsForm()
    this.isIndeterminate = false
    this.clearValidate()
  }
  private setCollapse(bool: boolean) {
    this.isShow = bool
  }
  private setForm(val: any) {
    const {
      fitFba, creditRating, startDate, endDate
    } = val
    const obj: any = {
      'audit': '已审核',
      'win': '已入库',
      'lock': '已锁舱',
      'measure': '已计量',
      'examine': '已验货',
      'tracking': '已出转单',
      'frozen': '冻结件'
    }
    const arr: any[] = []
    Object.keys(obj).map((key: any) => {
      if (val[key]) {
        arr.push(obj[key])
      }
    })
    this.checkedGoodsStatus = arr.filter((it: any) => it)

    this.checkedCustomerLevel = creditRating || []

    this.searchForm = {
      ...val
    }
    this.searchForm.cabinetType = fitFba ? '1' : '0'
    if (startDate && endDate) {
      this.searchForm.time = [startDate, endDate]
    } else {
      this.searchForm.time = []
    }
    if (this.searchForm.targetCountry) this.getCountryData()
  }
  private clearValidate() {
    const searchForm: any = this.$refs.searchForm
    this.$nextTick(() => {
      searchForm.clearValidate()
    })
  }
  private filterMethod(query: any, item: any): boolean {
    const name = item.name || ''
    return name.indexOf(query) > -1
  }
  private itemClose() {
    this.itemShow = false
    this.itemTitle = ''
    this.itemList = []
    this.searchForm[this.itemVal] = JSON.parse(JSON.stringify(this.itemArr))
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
  }
  private handleItem(val: any) {
    this.itemShow = true
    this.itemVal = val
    this.itemArr = []
    this.itemArr = JSON.parse(JSON.stringify(this.searchForm[val]))
    if (val === 'lscId') {
      this.itemTitle = '选择服务'
      this.getGroupData()
      if (this.searchForm.lscGroupIds.length <= 0) return
      this.getPrivatelineList()
    } else if (val === 'targetPort') {
      this.itemTitle = '选择目的港'
      this.getPortToList()
    } else if (val === 'fbastoreId') {
      this.itemTitle = '选择目的仓'
      this.getPurposeWarehouse()
    } else if (val === 'certificateList') {
      this.itemTitle = '选择证书'
      this.getCredentialList()
    } else if (val === 'expressId') {
      this.itemTitle = '选择快递公司'
      this.getExpressCompanyList()
    } else if (val === 'warehouseId') {
      this.itemTitle = '选择货物所在仓'
      this.getStayWarehouse()
    }
  }
  private onGoodsStatus(arr: any[]) {
    this.searchForm.frozen = arr.some((it: any) => it === '冻结件')
    this.searchForm.audit = arr.some((it: any) => it === '已审核')
    this.searchForm.win = arr.some((it: any) => it === '已入库')
    this.searchForm.lock = arr.some((it: any) => it === '已锁舱')
    this.searchForm.measure = arr.some((it: any) => it === '已计量')
    this.searchForm.examine = arr.some((it: any) => it === '已验货')
    this.searchForm.tracking = arr.some((it: any) => it === '已出转单')
  }

  private onLevel(arr: any[]) {
    this.searchForm.creditRating = arr
  }

  private onCabinet(val: any) {
    if (this.searchForm.cabinetType === '0') this.searchForm.fitFba = false
    this.searchForm.deliveryWay = []
    this.searchForm.lscId = []
    this.searchForm.lscGroupIds = []
  }
  private onTrans() {
    this.searchForm.deliveryWay = []
    this.countryList = []
    this.searchForm.targetCountry = undefined
    this.onCountry()
    this.$emit('changeTrans')
  }
  private onCountry() {
    this.searchForm.targetPort = []
    this.searchForm.fbastoreId = []
    this.searchForm.expressId = []
    this.searchForm.lscId = []
    this.searchForm.lscGroupIds = []
    this.searchForm.orgTag = []
    this.itemList = []
  }
  private changeTime(val: any) {
    if (Array.isArray(val) && val.length > 0) {
      this.searchForm.startDate = val[0]
      this.searchForm.endDate = val[1]
    } else {
      this.searchForm.startDate = undefined
      this.searchForm.endDate = undefined
    }
  }
  private getSubtypeList() {
    this.formLoading = true
    const params:any = {
      typeId: '05'
    }
    getServiceSubtypeList(params)
      .then((res: any) => {
        const data = res.data || []
        this.transportList = data
        this.formLoading = false
      }).catch((err: any) => {
        this.formLoading = false
        return err
      })
  }
  private getCustRatingList() {
    this.selectLoading = true
    getCustRatingList({
      page: 1,
      size: 999
    })
      .then((res: any) => {
        const data = res.data || {}
        this.customerLevelList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private getPurposeWarehouse() {
    this.itemLoading = true
    const params = {
      countryId: this.searchForm.targetCountry,
      codeSort: 'A',
      page: 1,
      size: 9999
    }
    getFbastoreList(params)
      .then((res: any) => {
        const data = res.data || {}
        // this.fbaStoreList = data.result || []
        const arr = data.result || []
        this.itemList = arr.map((it: any) => {
          const { code, postal, stateName, ...obj } = it
          return {
            name: `${(code || '')}-${(postal || '')}-${(stateName || '')}`,
            code,
            postal,
            stateName,
            ...obj
          }
        })
        this.itemLoading = false
      })
      .catch((err: any) => {
        this.itemLoading = false
        return err
      })
  }
  private getGroupData() {
    this.itemLoading = true
    const params = {
      model: {
        status: 1,
        countryId: this.searchForm.targetCountry
      },
      page: 1,
      size: 9999
    }
    getLscGroupList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.groupList = data.result || []
        this.itemLoading = false
      })
      .catch((err: any) => {
        this.itemLoading = false
        return err
      })
  }
  private onGroup() {
    this.itemList = []
    this.itemArr = []
    if (this.searchForm.lscGroupIds.length <= 0) return
    this.getPrivatelineList()
  }
  private getPrivatelineList() {
    this.itemLoading = true
    const params = {
      countryId: this.searchForm.targetCountry,
      subtypeId: this.searchForm.transport,
      dispatch: this.searchForm.deliveryWay.join(','),
      includeTax: this.searchForm.includeTax,
      orgTag: this.searchForm.transport === '1' && this.searchForm.targetCountry === 'US' ? this.searchForm.orgTag.join(',') : undefined,
      lscGroupIds: this.searchForm.lscGroupIds
    }
    getLscComplicatedList(params)
      .then((res: any) => {
        const data = res.data || []
        this.itemList = data
        this.itemLoading = false
      })
      .catch((err: any) => {
        this.itemLoading = false
        return err
      })
  }
  // private onPurpose(val: any) {
  //   this.searchForm.fbastoreName = undefined
  //   const arr: any[] = []
  //   this.searchForm.fbastoreId.map((it: any) => {
  //     const item = this.fbaStoreList.find((f: any) => f.id === it)
  //     if (item) {
  //       arr.push(item.code)
  //     }
  //   })
  //   this.searchForm.fbastoreName = arr.join(',')
  // }
  // private onService(val: any) {
  //   this.searchForm.lscName = undefined
  //   const arr: any[] = []
  //   this.searchForm.lscId.map((it: any) => {
  //     const item = this.serviceList.find((f: any) => f.id === it)
  //     if (item) {
  //       arr.push(item.name)
  //     }
  //   })
  //   this.searchForm.lscName = arr.join(',')
  // }
  private getPortToList() {
    this.itemLoading = true
    const params = {
      page: 1,
      size: 9999,
      type: this.searchForm.transport,
      countryId: this.searchForm.targetCountry
    }
    getPortList(params)
      .then((res: any) => {
        this.itemLoading = false
        const data = res.data || {}
        // this.portToList = data.result || []
        const arr = data.result || []
        this.itemList = arr.map((it: any) => {
          const { code, name, alias, ...obj } = it
          return {
            name: `${(code || '')}-${(name || '')}-${(alias || '')}`,
            code,
            alias,
            ...obj
          }
        })
      })
      .catch((err: any) => {
        this.itemLoading = false
        return err
      })
  }

  private getStayWarehouse() {
    this.itemLoading = true
    getWarehouseAllList()
      .then((res: any) => {
        const data = res.data || []
        // this.warehouseList = data
        this.itemList = data
        this.itemLoading = false
      })
      .catch((err: any) => {
        this.itemLoading = false
        return err
      })
  }

  private getCredentialList() {
    this.itemList = []
  }

  private getCountryData() {
    this.selectLoading = true
    const params: any = {
      typeId: '05',
      subtypeId: this.searchForm.transport
    }
    getCountryList(params)
      .then((res: any) => {
        this.countryList = res.data || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private getExpressCompanyList() {
    this.itemLoading = true
    const params = {
      page: 1,
      size: 99999,
      type: '4',
      serviceCountry: this.searchForm.targetCountry
    }
    getExpressCompany(params).then((res: any) => {
      const data = res.data || {}
      // this.expressList = data.result || []
      this.itemList = data.result || []
      this.itemLoading = false
    }).catch((err:any) => {
      this.itemLoading = false
      return err
    })
  }

  private created() {
    this.getSubtypeList()
    this.getCustRatingList()
  }
}
</script>

<style lang="scss" scoped>
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
.search-form {
  .el-form-item {
    margin-bottom: 0;
    display: inline-block;
    vertical-align: top;
    width: 25%;
  }
  .el-checkbox {
    margin-right: 10px;
  }
  .item-rules-box {
    .el-form-item {
      margin-bottom: 18px;
    }
  }
  .item-box {
    .el-form-item {
      margin-bottom: 8px;
    }
  }
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
::v-deep .el-dialog__body {
  padding: 10px 20px;
}
</style>
