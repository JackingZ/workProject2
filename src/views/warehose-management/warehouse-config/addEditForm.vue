<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <el-dialog
        :title="isEdit ? '编辑仓库' : '新增仓库'"
        :visible.sync="isShowUpdate"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        width="1000px"
        @closed="cancel"
      >
        <div
          v-loading="formLoading"
          class="add-edit-truck"
        >
          <el-form
            ref="theForm"
            :model="selectForm"
            :rules="formRules"
            label-width="150px"
            label-position="right"
            size="small"
            class="warehouse-edit-form"
          >
            <el-form-item
              label="仓库名称"
              prop="name"
            >
              <el-input
                ref="firstInput"
                v-model="selectForm.name"
                type="text"
                :maxlength="50"
                placeholder="请输入"
              />
            </el-form-item>
            <el-form-item
              label="仓库地址"
              prop="address"
            >
              <el-input
                v-model="selectForm.address"
                type="text"
                :maxlength="100"
                placeholder="请输入"
              />
            </el-form-item>
            <el-form-item
              label="仓库邮编"
              prop="postal"
            >
              <el-input
                v-model="selectForm.postal"
                type="text"
                :maxlength="10"
                placeholder="请输入"
                show-word-limit
              />
            </el-form-item>
            <el-form-item
              label="部门"
              prop="deptId"
            >
              <el-tree-select
                v-model="selectForm.deptId"
                :data="depts"
                :default-expand-all="false"
                clearable
                filterable
                size="small"
                style="width:100%;"
                placeholder="请选择"
                @change="onDept"
              />
            </el-form-item>
            <el-form-item
              label="仓库对接人"
              prop="principalId"
            >
              <el-select
                v-model="selectForm.principalId"
                :loading="selectLoading"
                style="width:100%;"
                placeholder="请选择"
                filterable
                clearable
                @focus="getPrincipalList"
              >
                <el-option
                  v-for="item in principalList"
                  :key="item.id"
                  :label="item.realName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="紧急电话"
              prop="emergencyPhone"
            >
              <el-input
                v-model="selectForm.emergencyPhone"
                type="text"
                :maxlength="11"
                placeholder="请输入"
                show-word-limit
              />
            </el-form-item>
            <el-form-item
              label="国家/地区"
              prop="countryId"
            >
              <el-select
                v-model="selectForm.countryId"
                :disabled="isEdit"
                style="width:100%;"
                placeholder="请选择"
                filterable
                clearable
                @change="onCountryChange"
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
                v-model="selectForm.stateId"
                placeholder="请选择"
                clearable
                :disabled="!selectForm.countryId"
                filterable
                style="width: 100%"
                @focus="getStateList"
                @change="onStateChange"
              >
                <el-option
                  v-for="item in state1List"
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
                v-model="selectForm.cityId"
                :loading="selectLoading"
                placeholder="请选择"
                clearable
                :disabled="!selectForm.stateId"
                filterable
                style="width: 100%"
                @focus="getCity1List"
                @change="onCityChange"
              >
                <el-option
                  v-for="item in city1List"
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
                v-model="selectForm.countyId"
                :loading="selectLoading"
                placeholder="区/县"
                clearable
                :disabled="!selectForm.cityId"
                filterable
                style="width:100%;"
                @focus="getCounty1List"
              >
                <el-option
                  v-for="item in county1List"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="商品属性"
              prop="goodsAttr"
            >
              <el-checkbox-group
                v-model="selectForm.goodsAttr"
                class="check-box-update"
              >
                <el-checkbox
                  v-for="(item, index) in attributes"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item
              label="托盘最大容积"
              prop="palletCapacity"
            >
              <div class="input-capacity">
                <div style="flex: 1;">
                  <el-input-number
                    v-model="selectForm.palletCapacity"
                    class="input-number-valiate input-border"
                    :controls="false"
                    placeholder="请输入"
                    :min="0"
                    :max="999999"
                    :precision="2"
                  />
                </div>
                <div class="input-unit">
                  CBM(立方米)
                </div>
              </div>
            </el-form-item>
            <el-form-item
              label="长度单位"
              prop="unitOfLength"
            >
              <el-select
                v-model="selectForm.unitOfLength"
                style="width:100%;"
                placeholder="请选择"
                filterable
                @change=";(selectForm.maximum = undefined)"
                @focus="getWordsList('measurement_type')"
              >
                <el-option
                  v-for="item in lengthList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="箱子最大尺寸"
              prop="maximum"
            >
              <div class="input-capacity">
                <div style="flex: 1;">
                  <el-input-number
                    v-model="selectForm.maximum"
                    class="input-number-valiate input-border"
                    :controls="false"
                    placeholder="请输入"
                    :min="0"
                    :max="999999"
                    :precision="2"
                  />
                </div>
                <div class="input-unit">
                  <span>{{ filterUnit(selectForm.unitOfLength, 'len') }}</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item
              label="重量单位"
              prop="unitOfWeight"
            >
              <el-select
                v-model="selectForm.unitOfWeight"
                style="width:100%;"
                placeholder="请选择"
                filterable
                @change=";(selectForm.weight = undefined)"
                @focus="getWordsList('weight_type')"
              >
                <el-option
                  v-for="item in weightList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="入库限重"
              prop="weight"
            >
              <div class="input-capacity">
                <div style="flex: 1;">
                  <el-input-number
                    v-model="selectForm.weight"
                    class="input-number-valiate input-border"
                    :controls="false"
                    placeholder="请输入"
                    :min="0"
                    :max="999999"
                    :precision="2"
                  />
                </div>
                <div class="input-unit">
                  <span>{{ filterUnit(selectForm.unitOfWeight, 'wei') }}</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item
              label="货币单位"
              prop="currencyId"
            >
              <el-select
                v-model="selectForm.currencyId"
                :loading="selectLoading"
                clearable
                filterable
                style="width:100%;"
                placeholder="请选择"
                @focus="geCurrencyList"
              >
                <el-option
                  v-for="item in currencyList"
                  :key="item.id"
                  :label="`${item.name}-${item.sign}`"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="卸货平台"
              prop="unloading"
            >
              <el-radio-group v-model="selectForm.unloading">
                <el-radio
                  :label="true"
                >
                  有
                </el-radio>
                <el-radio
                  :label="false"
                >
                  无
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="叉车"
              prop="forklift"
            >
              <el-radio-group v-model="selectForm.forklift">
                <el-radio
                  :label="true"
                >
                  有
                </el-radio>
                <el-radio
                  :label="false"
                >
                  无
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="是否中转仓"
              prop="transfer"
            >
              <el-radio-group v-model="selectForm.transfer">
                <el-radio
                  :label="true"
                >
                  是
                </el-radio>
                <el-radio
                  :label="false"
                >
                  否
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="是否监管仓"
              prop="supervise"
            >
              <el-radio-group
                v-model="selectForm.supervise"
              >
                <el-radio
                  :label="true"
                >
                  是
                </el-radio>
                <el-radio
                  :label="false"
                >
                  否
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="是否提供司机ID"
              prop="driver"
            >
              <el-radio-group v-model="selectForm.driver">
                <el-radio
                  :label="true"
                >
                  是
                </el-radio>
                <el-radio
                  :label="false"
                >
                  否
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="是否提供车牌"
              prop="plateNumber"
            >
              <el-radio-group v-model="selectForm.plateNumber">
                <el-radio
                  :label="true"
                >
                  是
                </el-radio>
                <el-radio
                  :label="false"
                >
                  否
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="是否有卸货排队流程"
              prop="queue"
            >
              <el-radio-group v-model="selectForm.queue">
                <el-radio
                  :label="true"
                >
                  是
                </el-radio>
                <el-radio
                  :label="false"
                >
                  否
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="覆盖省份"
              prop="stateIds"
            >
              <el-select
                v-model="selectForm.stateIds"
                style="width:100%;"
                placeholder="覆盖省份"
                clearable
                multiple
                filterable
                @focus="getStateList"
                @change="onState"
              >
                <el-option
                  v-for="item in stateList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="覆盖城市"
            >
              <el-select
                v-model="selectForm.cities"
                :loading="selectLoading"
                style="width:100%;"
                placeholder="覆盖城市"
                filterable
                clearable
                multiple
                @focus="getCityList"
              >
                <el-option
                  v-for="item in cityList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="业务类型"
              prop="businessType"
            >
              <el-select
                v-model="selectForm.businessType"
                placeholder="请选择"
                style="width:100%;"
                size="small"
                clearable
                multiple
                collapse-tagsist
              >
                <el-option
                  v-for="item in businessTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <!-- <el-form-item
              label="服务类型"
              prop="serviceTypes"
            >
              <el-select
                v-model="selectForm.serviceTypes"
                placeholder="服务类型"
                style="width:100%;"
                size="small"
                clearable
                multiple
                @focus="getServiceTypeList"
              >
                <el-option
                  v-for="item in serviceTypeList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>-->
            <el-form-item
              label="派送方式"
              prop="deliveryList"
            >
              <el-select
                v-model="selectForm.deliveryList"
                placeholder="派送方式"
                style="width:100%;"
                size="small"
                clearable
                multiple
              >
                <el-option
                  v-for="item in deliveries"
                  :key="item.value"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="上下班时间"
              prop="workTime"
            >
              <el-time-picker
                v-model="selectForm.workTime"
                :clearable="false"
                value-format="HH:mm"
                format="HH:mm"
                is-range
                arrow-control
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                style="width: 100%;"
              />
            </el-form-item>
            <el-form-item
              label="收货开始时间"
              prop="receiveStartTime"
            >
              <el-select
                v-model="selectForm.receiveStartTime"
                style="width:100%;"
                size="small"
                placeholder="请选择"
                clearable
                filterable
              >
                <el-option
                  v-for="item in weekdays"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="收货截止时间"
              prop="receiveEndTime"
            >
              <el-select
                v-model="selectForm.receiveEndTime"
                style="width:100%;"
                size="small"
                placeholder="请选择"
                clearable
                filterable
              >
                <el-option
                  v-for="item in weekdays"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="cancel">
            取 消
          </el-button>
          <el-button
            type="primary"
            :loading="formLoading"
            @click="saveConfirm"
          >
            确 定
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script  lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  saveWHData,
  getWH,
  getStateByCountry,
  getCityByState,
  getCountyByCity,
  getPersonList,
  getCities,
  getDeptList,
  getCheckDeptId,
  geCurrencyList,
  getWordsList
} from '@/api/warehose-by-config'
function formParam() {
  return {
    principalId: undefined,
    principal: undefined,
    address: undefined,
    categories: [
      {
        id: undefined,
        name: undefined
      }
    ],
    name: undefined,
    cityId: undefined,
    cityName: undefined,
    countryId: undefined,
    countryName: undefined,
    countyId: undefined,
    countyName: undefined,
    createTime: undefined,
    deptId: '',
    custId: undefined,
    custName: undefined,
    forklift: true,
    id: undefined,
    postal: undefined,
    stateId: undefined,
    stateName: undefined,
    status: undefined,
    supervise: true,
    transfer: true,
    unloading: true,
    palletCapacity: undefined,
    currencyId: undefined,
    maximum: undefined,
    weight: undefined,
    unitOfWeight: undefined,
    unitOfLength: undefined,
    goodsAttr: [],
    driver: true,
    plateNumber: true,
    emergencyPhone: undefined,
    queue: true,
    countries: [],
    stateIds: [],
    cities: [],
    businessType: [],
    serviceTypes: [],
    deliveryList: [],
    workTime: ['00:00', '23:59'],
    receiveTime: undefined
  }
}

@Component({
  name: 'AddData',
  components: {

  },
  props: {
    countryList: {
      type: Array,
      default: () => {
        return []
      }
    },
    custId: {
      type: [String, Number]
    },
    custName: {
      type: [String, Number]
    },
    attributes: {
      type: Array,
      default: () => {
        return []
      }
    },
    serviceTypeList: {
      type: Array,
      default: () => {
        return []
      }
    },
    deliveries: {
      type: Array,
      default: () => {
        return []
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  }

})
export default class AddEditForm extends Vue {
  private isShowUpdate: boolean = false
  private formLoading: boolean = false
  private selectForm: any = formParam()
  private props: any = {
    value: 'id',
    label: 'name'
  }
  private formRules = {
    name: [
      { required: true, message: '仓库名称不能为空', trigger: 'blur' }
    ],
    deptId: [
      { required: true, message: '请选择部门', trigger: 'change' },
      {
        validator: this.validateDept,
        trigger: 'change'
      }
    ],
    principalId: [{ required: true, message: '请选择仓库对接人', trigger: 'change' }],
    emergencyPhone: [
      { required: true, message: '紧急电话不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (value && reg.test(value)) {
            callback(new Error('紧急电话不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    postal: [
      { required: true, message: '仓库邮编不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^[a-zA-Z0-9 .·-]+$/
          if (!value) {
            callback(new Error('仓库邮编不能为空'))
          } else if (!reg.test(value)) {
            callback(new Error('仓库邮编不能有中文及特殊字符'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    address: [{ required: true, message: '仓库地址不能为空', trigger: 'blur' }],
    unloading: [
      { required: true, message: '请选择卸货平台', trigger: 'change' }
    ],
    forklift: [{ required: true, message: '请选择叉车', trigger: 'change' }],
    supervise: [
      { required: true, message: '请选择是否监管仓', trigger: 'change' }
    ],
    palletCapacity: [{ required: true, message: '托盘最大容积不能为空', trigger: 'blur' }],
    maximum: [{ required: true, message: '最大尺寸不能为空', trigger: 'blur' }],
    weight: [{ required: true, message: '入库限重不能为空', trigger: 'blur' }],
    currencyId: [
      { required: true, message: '请选择货币单位', trigger: 'change' }
    ],
    unitOfWeight: [
      { required: true, message: '请选择重量单位', trigger: 'change' }
    ],
    unitOfLength: [
      { required: true, message: '请选择长度单位', trigger: 'change' }
    ],
    transfer: [
      { required: true, message: '请选择是否中转仓', trigger: 'change' }
    ],
    goodsAttr: [
      { required: true, message: '请选择商品属性', trigger: 'change' }
    ],
    countryId: [
      { required: true, message: '请选择国家/地区', trigger: 'change' }
    ],
    stateId: [{ required: true, message: '请选择州/省', trigger: 'change' }],
    cityId: [{ required: true, message: '请选择城市', trigger: 'change' }],
    countyId: [{ required: false, message: '请选择区/县', trigger: 'change' }],
    driver: [{ required: true, message: '请选择是否提供司机ID', trigger: 'change' }],
    plateNumber: [{ required: true, message: '请选择是否提供车牌', trigger: 'change' }],
    queue: [{ required: true, message: '请选择是否有卸货排队流程', trigger: 'change' }],
    stateIds: [{ required: true, message: '请选择覆盖省份', trigger: 'change' }],
    businessType: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
    serviceTypes: [{ required: true, message: '请选择服务类型', trigger: 'change' }],
    deliveryList: [{ required: true, message: '请选择派送方式', trigger: 'change' }],
    workTime: [{ required: true, message: '请选择上下班时间', trigger: 'change' }],
    receiveStartTime: [{ required: true, message: '请选择收货时间', trigger: 'change' }],
    receiveEndTime: [{ required: true, message: '请选择收货时间', trigger: 'change' }]
  }
  private weekdays: any = [
    { label: '星期一', value: 2 },
    { label: '星期二', value: 3 },
    { label: '星期三', value: 4 },
    { label: '星期四', value: 5 },
    { label: '星期五', value: 6 },
    { label: '星期六', value: 7 },
    { label: '星期日', value: 1 }
  ]
  private businessTypeList: any[] = [
    { label: '空运', value: '1' },
    { label: '海运', value: '2' },
    { label: '铁路', value: '3' },
    { label: '卡航', value: '4' },
    { label: '快递', value: '5' },
    { label: '小包', value: '6' },
    { label: '集货', value: '7' },
    { label: '行李及搬家', value: '8' }
  ]
  private weightList: any[] = []
  private lengthList: any[] = []
  private principalList: any[] = [] // 仓库对接人
  private state1List: any[] = []
  private city1List: any[] = []
  private county1List: any[] = []
  private stateList: any[] = [] // 覆盖区域-省份
  private cityList: any[] = [] // 覆盖区域-城市
  private deptList: any[] = [] // 部门
  private currencyList: any[] = []
  private selectLoading: boolean = false
  private wsId: string = ''
  private dtId: string = ''

  /** computed */
  get depts(): any {
    const { deptList } = this as any
    const json = JSON.parse(
      JSON.stringify(deptList)
        .replace(/name/g, 'label')
        .replace(/id/g, 'value')
    )
    return json
  }
  /** methods */
  private filterUnit(val: any, str: any) {
    let name
    if (val && str === 'len') {
      this.lengthList.map((it: any) => {
        if (it.value === val) {
          name = `${it.value}(${it.label})`
        }
      })
    }
    if (val && str === 'wei') {
      this.weightList.map((it: any) => {
        if (it.value === val) {
          name = `${it.value}(${it.label})`
        }
      })
    }
    return name || ''
  }
  // 查询部门列表
  private async validateDept(rule: any, value: any, callback: (val?: any) => void) {
    if (this.dtId === value) return callback()
    const res = await getCheckDeptId({
      custId: (this as any).custId,
      deptId: value,
      warehouseId: this.wsId
    })
    if (res.data) {
      return callback(new Error('该部门及其下属已存在'))
    } else {
      return callback()
    }
  }
  private getDeptList(): void {
    getDeptList({
      custId: (this as any).custId
    })
      .then((res: any) => {
        const data = res.data || {}
        this.deptList = data.result || []
      })
      .catch((err: any) => {
        return err
      })
  }
  private onDept() {
    this.selectForm.principalId = undefined
    this.principalList = []
  }
  // 仓库对接人
  private getPrincipalList() {
    this.selectLoading = true
    const params = {
      custId: (this as any).custId,
      deptId: this.selectForm.deptId,
      page: 1,
      size: 9999
    }
    getPersonList(params)
      .then((res: any) => {
        this.principalList = res.data || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private getCountryList() {
    this.$emit('getCountryList')
  }
  private getServiceTypeList() {
    this.$emit('getServiceTypeList')
  }
  private getStateList() {
    if (!this.selectForm.countryId) return
    this.selectLoading = true
    getStateByCountry(this.selectForm.countryId).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      const result = data.result || []
      this.state1List = result
      this.stateList = result
    }).catch(() => {
      this.state1List = []
      this.selectLoading = false
    })
  }
  private async getCity1List() {
    if (!this.selectForm.stateId) return
    this.selectLoading = true
    await getCityByState(this.selectForm.stateId).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      const result = data.result || []
      this.city1List = result
    }).catch(() => {
      this.city1List = []
      this.selectLoading = false
    })
  }
  private async getCounty1List() {
    if (!this.selectForm.cityId) return
    this.selectLoading = true
    await getCountyByCity(this.selectForm.cityId)
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result || []
        this.county1List = result
        this.selectLoading = false
      })
      .catch(() => {
        this.county1List = []
        this.selectLoading = false
      })
  }

  private async onCountryChange() {
    this.selectForm.stateId = undefined
    this.selectForm.stateIds = []
    this.stateList = []
    this.selectForm.cities = []
    this.cityList = []
    this.onStateChange()
    this.getStateList()
  }
  private onStateChange() {
    this.selectForm.cityId = undefined
    this.onCityChange()
  }
  private onCityChange() {
    this.selectForm.countyId = undefined
  }
  // 获取货币列表
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

  private getWordsList(type: any) {
    this.selectLoading = true
    const params:any = {
      type
    }
    getWordsList(params)
      .then((res: any) => {
        this.selectLoading = false
        const data = res.data || []
        switch (type) {
          case 'weight_type':
            this.weightList = data
            break
          case 'measurement_type':
            this.lengthList = data
            break
          default:
            break
        }
      }).catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private onState() {
    this.selectForm.cities = []
    this.cityList = []
  }
  private getCityList(): void {
    if (this.selectForm.stateIds.length <= 0) return
    this.selectLoading = true
    getCities(this.selectForm.stateIds)
      .then((res: any) => {
        const data = res.data || {}
        this.cityList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private clearValidate() {
    const theForm: any = this.$refs.theForm
    this.$nextTick(() => {
      theForm.clearValidate()
    })
  }

  // 重置表单
  private resetForm() {
    this.state1List = []
    this.city1List = []
    this.county1List = []
    this.stateList = []
    this.cityList = []
    this.selectForm = formParam()
    this.clearValidate()
  }

  private cancel() {
    this.isShowUpdate = false
    this.resetForm()
  }

  private saveConfirm() {
    const theForm: any = this.$refs.theForm
    theForm.validate((valid: any) => {
      if (!valid) return false
      this.formLoading = true
      const { workTime, goodsAttr, businessType, countryId, stateId, cityId, countyId, ...form } = this.selectForm
      const countryList = (this as any).countryList
      const countryName = (countryList.find((item: any) => item.id === countryId) || {}).name
      const stateName = (this.state1List.find((item: any) => item.id === stateId) || {}).name
      const cityName = (this.city1List.find((item: any) => item.id === cityId) || {}).name
      const countyName = (this.county1List.find((item: any) => item.id === countyId) || {}).name
      const params: any = {
        ...form,
        countryId,
        countryName,
        stateName,
        stateId,
        cityName,
        cityId,
        countyId,
        countyName
      }
      params.workTime = workTime.join(',')
      params.businessType = businessType.join(',')
      const goods: any[] = []
      goodsAttr.map((g: any) => {
        const res = (this as any).attributes.find((item: any) => item.name === g)
        goods.push(res)
      })
      params.categories = goods
      params.countries = [
        {
          countryName: params.countryName,
          countryId: params.countryId,
          states: []
        }
      ]
      let states = params.stateIds.map((item: any) => {
        const { id: sid, name: sname } = (this.stateList || []).find((c: any) => c.id === item)
        return {
          stateId: sid,
          stateName: sname
        }
      })
      states = states.filter((item: any) => item.stateId && item.stateName)
      let cities = params.cities.map((item: any) => {
        const itemC = (this.cityList || []).find((c: any) => c.id === item)
        return itemC
      })
      cities = cities.filter((item: any) => item)
      const arr = states.map((its: any) => {
        const { stateId: sid, stateName: sname } = its
        const ita: any = {
          stateId: sid,
          stateName: sname,
          cities: []
        }
        const item = (cities || []).find((itc: any) => itc.stateId === its.stateId) || {}
        if (item.id && item.name) {
          ita.cities.push({
            cityId: (item || {}).id,
            cityName: (item || {}).name
          })
        }
        return ita
      })
      params.countries[0].states = arr
      params.custId = (this as any).custId
      params.custName = (this as any).custName
      this.principalList.map((it: any) => {
        if (it.id === params.principalId) {
          params.principal = it.realName
          params.phoneNo = it.phone
        }
      })
      this.currencyList.map((it: any) => {
        if (it.id === params.currencyId) {
          params.currencyName = it.name
        }
      })
      saveWHData(params)
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.resetForm()
          this.formLoading = false
          this.isShowUpdate = false
          this.$emit('getTableList')
        })
        .catch(err => {
          this.formLoading = false
          return err
        })
    })
  }

  private getWareHouseEdit() {
    this.formLoading = true
    getWH({
      id: this.wsId
    }).then(async(res: any) => {
      const data = res.data || {}
      const { workTime, categories, businessType, ...form } = data
      this.selectForm = {
        ...form,
        businessType: businessType.split(',') || []
      }
      if (!workTime) {
        const times = ['00:00', '23:59']
        this.$set(this.selectForm, 'workTime', times)
      } else {
        const times = workTime.split(',')
        this.$set(this.selectForm, 'workTime', times)
      }
      let goods: any[] = []
      if (Array.isArray(categories)) {
        goods = categories.map((item: any) => {
          return item.name
        })
      }
      this.$set(this.selectForm, 'goodsAttr', goods)
      try {
        await this.getCity1List()
        await this.getCounty1List()
      } catch (error) {
        this.formLoading = false
      }
      const countries = this.selectForm.countries || []
      const arrS = (countries[0] || {}).states || []
      this.selectForm.stateIds = []
      arrS.map((item: any) => {
        this.selectForm.stateIds.push(item.stateId)
      })
      let arrC = arrS.map((item: any) => {
        return (item.cities || []).find((itemC: any) => itemC)
      })
      arrC = arrC.filter((item: any) => item && item.cityId)
      this.selectForm.cities = []
      arrC.map((item: any) => {
        this.selectForm.cities.push(item.cityId)
      })
      this.getCityList()
      this.formLoading = false
    }).catch((err: any) => {
      this.formLoading = false
      return [err, null]
    })
  }

  private init(row: any) {
    this.isShowUpdate = true
    this.getCountryList()
    this.getWordsList('weight_type')
    this.getWordsList('measurement_type')
    this.getServiceTypeList()
    this.getDeptList()
    const root: any = (this as any).isEdit
    if (root) {
      this.dtId = JSON.parse(JSON.stringify(row.deptId))
      this.wsId = row.id
      this.selectForm.countryId = row.countryId
      this.getPrincipalList()
      this.getStateList()
      this.geCurrencyList()
      this.getWareHouseEdit()
    } else {
      this.wsId = ''
      this.$nextTick(() => {
        const ele: any = this.$refs.firstInput
        ele.focus()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.warehouse-edit-form {
  height: 474px;
  overflow-y: auto;
  .el-form-item {
    display: inline-block;
    width: 49%;
  }
}
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
.input-capacity {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.input-unit {
  width: 105px;
  height: 32px;
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
.check-box-update {
  .el-checkbox {
    margin-right: 10px;
  }
}
::v-deep .el-dialog__wrapper {
  z-index: 1001 !important;
}
::v-deep .el-dialog__body {
  padding: 10px 20px;
}
::v-deep .v-modal {
  z-index: 1000 !important;
}
</style>
