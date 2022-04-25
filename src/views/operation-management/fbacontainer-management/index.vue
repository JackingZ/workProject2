<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="FBA仓库"
        />
        <div class="app-panel">
          <el-row>
            <el-col :span="4">
              <el-button
                v-permission="['addFbastore']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-left: 10px"
                @click="add"
              >
                新增FBA仓库
              </el-button>
            </el-col>

            <el-col
              :span="20"
              style="text-align:right;"
            >
              <el-select
                v-model="selectValue.type"
                style="width:130px;margin-right:5px;"
                placeholder="仓库类型"
                size="small"
                clearable
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>

              <el-select
                v-model="selectValue.countryId"
                placeholder="所在国家"
                clearable
                style="width:130px;margin-right:5px;"
                size="small"
                filterable
                @focus="getCountryList"
                @change="onCountryChange(1)"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>

              <el-select
                v-model="selectValue.stateId"
                :loading="selectLoading"
                :disabled="!selectValue.countryId"
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
                v-model="selectValue.cityId"
                :loading="selectLoading"
                :disabled="!selectValue.stateId"
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
                v-model="selectValue.countyId"
                :loading="selectLoading"
                :disabled="!selectValue.cityId"
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
                v-model="selectValue.status"
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
                v-model="selectValue.code"
                size="small"
                placeholder="请输入仓库编码"
                style="width:150px;margin-right:10px;"
              />

              <el-button
                v-permission="['queryFbastore']"
                type="primary"
                size="small"
                @click="getFbastoreList(1)"
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
            @sort-change="sortChange"
          >
            <el-table-column
              label="仓库类型"
              width="120"
              fixed="left"
            >
              <template slot-scope="scope">
                {{ formatType(scope.row.type) }}
              </template>
            </el-table-column>

            <el-table-column
              label="仓库编号"
              width="120"
              prop="code"
              fixed="left"
              sortable="custom"
            />

            <el-table-column
              label="国家/地区"
              width="160"
              prop="countryName"
            />

            <el-table-column
              label="州省市区"
              min-width="180"
            >
              <template slot-scope="scope">
                <span
                  v-show="!!scope.row.stateName"
                >
                  {{ scope.row.stateName + '-' + scope.row.stateNameEn }}
                </span>
                <span
                  v-show="!!scope.row.cityName"
                >
                  > {{ scope.row.cityName + '-' + scope.row.cityNameEn }}
                </span>
                <!-- <span
                  v-show="!!scope.row.countyName"
                >
                  > {{ scope.row.countyName + '-' + scope.row.countyNameEn }}
                </span> -->
              </template>
            </el-table-column>

            <el-table-column
              label="详细地址一"
              min-width="180"
              prop="address"
            />

            <el-table-column
              label="邮政编码"
              width="180"
              prop="postal"
            />

            <el-table-column
              label="收货公司"
              min-width="180"
              prop="recipient"
            />

            <el-table-column
              label="启用状态"
              width="130"
            >
              <template slot-scope="scope">
                <el-switch
                  :value="scope.row.status"
                  :disabled="!$checkPermission(['fbastoreChangeStatus'])"
                  class="switchStyle"
                  active-text="启用"
                  inactive-text="禁用"
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
                  v-permission="['editFbastore']"
                  type="text"
                  size="medium"
                  @click="handleEdit(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['deleteFbastore']"
                  type="text"
                  size="medium"
                  @click="deleteFbastore(scope.row.id)"
                >
                  删除
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

          <el-dialog
            title="FBA仓库"
            width="900px"
            :visible.sync="dialogShow"
            :close-on-click-modal="false"
            @close="cancel"
          >
            <el-form
              ref="theForm"
              v-loading="dialogLoading"
              :rules="formRules"
              :model="form"
              label-width="110px"
              style="padding-right: 20px;"
              size="small"
            >
              <el-form-item
                prop="type"
                label="仓库类型"
              >
                <el-select
                  v-model="form.type"
                  placeholder="请选择"
                  style="width: 100%"
                  @change="onTypeChange"
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item
                v-if="form.type === '1'"
                label="自有"
                prop="ifHave"
              >
                <el-radio-group v-model="form.ifHave">
                  <el-radio :label="0">
                    否
                  </el-radio>
                  <el-radio :label="1">
                    是
                  </el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item
                prop="code"
                label="FBA仓库编码"
              >
                <el-input
                  v-model="form.code"
                  autocomplete="off"
                  maxlength="10"
                  show-word-limit
                  style="width: 100%"
                />
              </el-form-item>

              <el-form-item
                prop="countryId"
                label="国家/地区"
              >
                <el-select
                  v-model="form.countryId"
                  placeholder="请选择"
                  style="width: 100%"
                  filterable
                  @focus="getCountryList"
                  @change="onCountryChange(2)"
                >
                  <el-option
                    v-for="item in countryList"
                    :key="item.id"
                    :label="$formatCountry(item)"
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
              <!-- <el-form-item
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
              </el-form-item> -->

              <el-form-item
                prop="address"
                label="详细地址一"
              >
                <el-input
                  v-model="form.address"
                  autocomplete="off"
                  style="width: 100%"
                  :maxlength="30"
                />
              </el-form-item>
              <el-form-item
                prop="address1"
                label="详细地址二"
              >
                <el-input
                  v-model="form.address1"
                  autocomplete="off"
                  style="width: 100%"
                  :maxlength="30"
                />
              </el-form-item>
              <el-form-item
                prop="address2"
                label="详细地址三"
              >
                <el-input
                  v-model="form.address2"
                  autocomplete="off"
                  style="width: 100%"
                  :maxlength="30"
                />
              </el-form-item>

              <el-form-item
                prop="postal"
                label="邮政编码"
              >
                <el-input
                  v-model="form.postal"
                  autocomplete="off"
                  :maxlength="10"
                  show-word-limit
                  style="width: 100%"
                />
              </el-form-item>

              <el-form-item
                prop="recipient"
                label="收货公司"
              >
                <el-input
                  v-model="form.recipient"
                  :disabled="isRecipientDisabled"
                  :maxlength="50"
                  autocomplete="off"
                  style="width: 100%"
                />
              </el-form-item>

              <el-form-item
                prop="contact"
                label="联系人"
              >
                <el-input
                  v-model="form.contact"
                  autocomplete="off"
                  :maxlength="50"
                  style="width: 100%"
                />
              </el-form-item>

              <el-form-item
                prop="email"
                label="联系邮箱"
              >
                <el-input
                  v-model="form.email"
                  autocomplete="off"
                  :maxlength="30"
                  style="width: 100%"
                />
              </el-form-item>

              <el-form-item
                prop="phone"
                label="联系电话"
              >
                <el-input
                  v-model="form.phone"
                  autocomplete="off"
                  :maxlength="20"
                  style="width: 100%"
                />
              </el-form-item>

              <el-form-item
                v-if="form.type === '0'"
                prop="maxSize"
                label="最大尺寸"
              >
                <el-input
                  v-model.number="form.maxSize"
                  type="number"
                  autocomplete="off"
                  style="width: 100%"
                >
                  <template slot="append">
                    cm
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item
                v-if="form.type === '0'"
                prop="maxWeight"
                label="最大重量"
              >
                <el-input
                  v-model.number="form.maxWeight"
                  type="number"
                  autocomplete="off"
                  style="width: 100%"
                >
                  <template slot="append">
                    kg
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item
                v-if="form.type === '0'"
                prop="isDirect"
                label="直送"
              >
                <el-radio-group v-model="form.isDirect">
                  <el-radio :label="0">
                    是
                  </el-radio>
                  <el-radio :label="1">
                    否
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
            <div
              slot="footer"
              class="dialog-footer"
            >
              <el-button @click="cancel">
                取 消
              </el-button>
              <el-button
                type="primary"
                @click="handleSubmit"
              >
                确 定
              </el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'

import {
  getCountryList,
  getStateByCountry,
  getCityByState,
  getCountyByCity,
  getFbastoreList,
  addFbastore,
  updateFbastore,
  deleteFbastore,
  changeStatus
} from '@/api/operation-of-fba-warehouse'

@Component({
  name: 'FBA',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private selectLoading: boolean = false
  private dialogLoading: boolean = false
  private dialogShow: boolean = false
  private isEdit = false
  private list: any = []
  private countryList: any[] = []
  private stateList1: any = []
  private cityList1: any = []
  private countyList1: any = []
  private stateList2: any = []
  private cityList2: any = []
  private countyList2: any = []
  private typeList: any = [
    {
      label: '亚马逊',
      value: '0'
    },
    {
      label: '海外仓',
      value: '1'
    }
  ]

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
  private props: any = {
    value: 'id',
    label: 'name'
  }
  private page: number = 1
  private size: number = 10
  private total: any = 0

  private selectValue: any = {
    type: undefined,
    countryId: undefined,
    stateId: undefined,
    cityId: undefined,
    countyId: undefined,
    placeId: undefined,
    status: undefined,
    code: undefined
  }
  private form: any = {
    type: undefined,
    code: undefined,
    countryId: undefined,
    stateId: undefined,
    cityId: undefined,
    countyId: undefined,
    address: undefined,
    address1: undefined,
    address2: undefined,
    postal: undefined,
    recipient: undefined,
    contact: undefined,
    email: undefined,
    phone: undefined,
    maxWeight: undefined,
    ifHave: 0,
    maxSize: undefined,
    isDirect: undefined
  }
  private formRules = {
    type: [{ required: true, message: '请选择FBA仓库类型', trigger: 'change' }],
    countryId: [{ required: true, message: '请选择国家/地区', trigger: 'change' }],
    // countyId: [{ required: true, message: '请选择区/县', trigger: 'change' }],
    stateId: [{ required: true, message: '请选择州/省', trigger: 'change' }],
    cityId: [{ required: true, message: '请选择城市', trigger: 'change' }],
    code: [
      { required: true, message: 'FBA仓库编码不能为空', trigger: 'blur' }
    ],
    address: [{ required: true, message: '仓库地址不能为空' }],
    postal: [
      { required: true, message: '邮政编码不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (reg.test(value)) {
            callback(new Error('邮政编码不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    recipient: [
      { required: true, message: '收货公司不能为空', trigger: 'blur' }
    ],
    contact: [
      { required: true, message: '联系人不能为空', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '邮箱不能为空', trigger: 'blur' },
      { type: 'email', message: '邮箱地址格式不正确', trigger: ['blur', 'change'] }
    ],
    phone: [
      { required: true, message: '电话不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (value && reg.test(value)) {
            callback(new Error('电话号码不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    maxWeight: [
      { type: 'number', message: '请填写数字', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          if (value < 0) {
            callback(new Error('必须大于等于0'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    maxSize: [
      { type: 'number', message: '请填写数字', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          if (value < 0) {
            callback(new Error('必须大于等于0'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }

  /* computed */

  get labelPosition() {
    const lang = AppModule.language
    if (!lang) {
      return 'left'
    }
    return lang === 'en' ? 'top' : 'left'
  }

  get lang() {
    const lang = AppModule.language
    if (!lang) {
      return 'en'
    }
    return lang
  }

  // 仓库地址是否禁用
  get isRecipientDisabled(): boolean {
    return parseInt(this.form.type, 10) === 0
  }

  /* methods */

  // 获取国家列表
  private getCountryList() {
    getCountryList()
      .then(res => {
        const data = res.data || {}
        const result = data.result || []
        this.countryList = result
      })
      .catch(err => {
        return err
      })
  }

  private async getStateList(num: number) {
    const params = num === 1 ? this.selectValue.countryId : this.form.countryId
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
    const params = num === 1 ? this.selectValue.stateId : this.form.stateId
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
    const params = num === 1 ? this.selectValue.cityId : this.form.cityId
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
      this.selectValue.stateId = undefined
      this.selectValue.cityId = undefined
      this.selectValue.countyId = undefined
    } else if (type === 2) {
      this.form.stateId = undefined
      this.form.cityId = undefined
      this.form.countyId = undefined
    }
  }
  private onStateChange(num: number) {
    if (num === 1) {
      this.selectValue.cityId = undefined
      this.selectValue.countyId = undefined
    } else if (num === 2) {
      this.form.cityId = undefined
      this.form.countyId = undefined
    }
  }
  private onCityChange(num: number) {
    if (num === 1) {
      this.selectValue.countyId = undefined
    } else if (num === 2) {
      this.form.countyId = undefined
    }
  }

  // 监听仓库类型
  private onTypeChange(val: any): void {
    this.form.maxSize = undefined
    this.form.maxWeight = undefined
    this.form.isDirect = undefined
    if (parseInt(val, 10) === 0) {
      this.form.recipient = 'Amazon'
    } else {
      this.form.recipient = ''
    }
  }

  // 监听仓库状态改变
  private async onStatus(row: any, value: any): Promise<void> {
    if (!row.status || row.status === value) {
      return
    }
    const text = value === '0' ? '禁用' : '开启'
    const [cancel, confirm] = await this.$confirm(
      `此操作将${text}FBA仓库，是否继续？`,
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
        this.getFbastoreList()
      })
      .catch(err => {
        return err
      })
  }

  private sortChange(option: any) {
    if (option.order) {
      this.selectValue.codeSort = option.order === 'descending' ? 'D' : 'A'
    } else {
      this.selectValue.codeSort = null
    }
    this.getFbastoreList(1)
  }

  // 获取列表数据
  private getFbastoreList(val?: any): void {
    if (val) {
      this.page = val
    }
    const params = {
      ...this.selectValue,
      page: this.page,
      size: this.size
    }
    this.loading = true
    getFbastoreList(params)
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

  private formatType(type: any) {
    const { typeList } = this
    const list = typeList.find((item: any) => item.value === type) || {}
    return list.label || ''
  }

  private codeValidator(rule: any, value: any, callback: any) {
    if (value === '') {
      callback(new Error('仓库编号不能为空'))
    } else if (value.length < 3) {
      callback(new Error('仓库编号不能少于四位'))
    } else {
      callback()
    }
  }

  private clearValidate() {
    const theForm: any = this.$refs.theForm
    this.$nextTick(() => {
      theForm.clearValidate()
    })
  }

  // 新增
  private add(): void {
    this.isEdit = false
    this.dialogShow = true
  }

  // 提交表单
  private handleSubmit(): void {
    const theForm = (this as any).$refs.theForm
    theForm.validate((valid: any) => {
      if (valid) {
        const { countryId, stateId, cityId, countyId, ...form } = this.form
        const countryItem = this.countryList.find((item: any) => item.id === countryId) || {}
        const stateItem = this.stateList2.find((item: any) => item.id === stateId) || {}
        const cityItem = this.cityList2.find((item: any) => item.id === cityId) || {}
        const countyItem = this.countyList2.find((item: any) => item.id === countyId) || {}

        const params = {
          ...form,
          countryId,
          countryName: countryItem.name,
          countryNameEn: cityItem.name,
          stateId,
          stateName: stateItem.name,
          stateNameAbbr: stateItem.abbr,
          stateNameEn: stateItem.alias,
          cityId,
          cityName: cityItem.name,
          cityNameAbbr: cityItem.abbr,
          cityNameEn: cityItem.alias
          // countyId,
          // countyName
        }
        if (this.isEdit) {
          this.updateFbastore(params)
        } else {
          this.addFbastore(params)
        }
      }
    })
  }

  private async handleEdit(row: any) {
    this.isEdit = true
    this.dialogShow = true
    this.dialogLoading = true
    this.form = { ...row }
    this.getCountryList()
    try {
      if (this.form.countryId) {
        await this.getStateList(2)
      }
      if (this.form.stateId) {
        await this.getCityList(2)
      }
      // if (this.form.cityId) {
      //   await this.getCountyList(2)
      // }
      this.dialogLoading = false
    } catch (error) {
      this.dialogLoading = false
    }
  }

  // 新增fba仓库
  private addFbastore(params: any): void {
    this.dialogLoading = true
    addFbastore(params)
      .then(res => {
        this.dialogLoading = false
        this.cancel()
        this.getFbastoreList()
      })
      .catch(err => {
        this.dialogLoading = false
        return err
      })
  }

  // 更新fba仓库
  private updateFbastore(params: any): void {
    this.dialogLoading = true
    updateFbastore(params)
      .then(res => {
        this.dialogLoading = false
        this.cancel()
        this.getFbastoreList()
      })
      .catch(err => {
        this.dialogLoading = false
        return err
      })
  }

  // 删除
  private async deleteFbastore(id: any): Promise<void> {
    const [cancel, confirm] = await this.$confirm(
      '此操作将删除FBA仓库，是否继续？',
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
    deleteFbastore(id)
      .then(res => {
        this.$message.success('删除成功')
        this.getFbastoreList()
      })
      .catch(err => {
        return err
      })
  }

  private cancel(): void {
    this.dialogShow = false
    this.stateList2 = []
    this.cityList2 = []
    this.countyList2 = []
    this.resetForm()
    this.clearValidate()
  }

  private resetForm(): void {
    this.form = {
      type: undefined,
      code: undefined,
      countryId: undefined,
      stateId: undefined,
      cityId: undefined,
      countyId: undefined,
      address: undefined,
      address1: undefined,
      address2: undefined,
      postal: undefined,
      recipient: undefined,
      contact: undefined,
      email: undefined,
      phone: undefined,
      maxWeight: undefined,
      maxSize: undefined,
      isDirect: undefined
    }
  }

  private handleSizeChange(val: any): any {
    this.size = val
    this.getFbastoreList()
  }

  private handleCurrentChange(val: any): any {
    this.page = val
    this.getFbastoreList()
  }

  private init(): void {
    this.getFbastoreList()
  }

  private created(): void {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item {
  margin-bottom: 22px;
  display: inline-block;
  width: 50%;
}
</style>
