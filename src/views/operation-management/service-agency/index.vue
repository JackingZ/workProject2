<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="服务机构"
        />
        <div class="app-panel">
          <el-row>
            <el-col :span="6">
              <el-button
                v-permission="['addServiceOrg']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-left: 10px"
                @click="addOrgan"
              >
                新增机构
              </el-button>
            </el-col>
            <el-col
              :span="18"
              style="text-align:right;"
            >
              <el-select
                v-model="selectValue.type"
                size="small"
                clearable
                style="width:120px;margin-right:5px;"
                placeholder="机构类型"
              >
                <el-option
                  label="海关"
                  value="0"
                />
                <el-option
                  label="船东"
                  value="1"
                />
                <el-option
                  label="空运公司"
                  value="2"
                />
                <el-option
                  label="铁路公司"
                  value="3"
                />
                <el-option
                  label="快递公司"
                  value="4"
                />
                <el-option
                  label="卡派公司"
                  value="5"
                />
              </el-select>
              <el-select
                v-model="selectValue.serviceCountry"
                :loading="selectLoading"
                size="small"
                clearable
                style="width:120px;margin-right:5px;"
                placeholder="服务国家"
                filterable
                @focus="getCountryList"
              >
                <el-option
                  v-for="(item, index) in countryList"
                  :key="index"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.countryId"
                :loading="selectLoading"
                size="small"
                clearable
                style="width:120px;margin-right:5px;"
                placeholder="国家/地区"
                filterable
                @focus="getCountryList"
                @change="onCountryChange(1)"
              >
                <el-option
                  v-for="(item, index) in countryList"
                  :key="index"
                  :label="`${item.name}-${item.alias}`"
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

              <el-input
                v-model="selectValue.name"
                size="small"
                clearable
                style="width:180px;margin-right:10px;"
                placeholder="请输入机构名称关键字"
              />
              <el-button
                v-permission="['queryServiceOrg']"
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
            :data="tableData"
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            border
            @sort-change="sortChange"
          >
            <el-table-column
              prop="type"
              label="机构类型"
              width="100"
            >
              <template slot-scope="scope">
                {{ typeFilter(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              sortable="custom"
              label="机构名称"
              min-width="150"
            />
            <el-table-column
              prop="alias"
              label="英文名称"
              min-width="150"
            />
            <el-table-column
              prop="code"
              label="全球代码"
              width="120"
            />
            <el-table-column
              label="服务国家"
              width="100"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="!$checkPermission(['serviceOrgCountry'])"
                  type="text"
                  @click="editCountry(scope.row)"
                >
                  服务国家
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="countryName"
              label="国家/地区"
              width="180"
              show-overflow-tooltip
            />
            <el-table-column
              label="州省市区"
              width="200"
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
              label="网址链接"
              width="100"
            >
              <template slot-scope="scope">
                <a
                  :href="scope.row.url"
                  target="_blank"
                  style="color:#409EFF"
                >点击访问</a>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="130"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['editServiceOrg']"
                  type="text"
                  @click="editOrgan(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['deleteServiceOrg']"
                  type="text"
                  @click="deletRow(scope.row)"
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
            :title="isEdit ? '编辑机构' : '新增机构'"
            :visible.sync="isAddEditVisible"
            :close-on-click-modal="false"
            width="960px"
            @close="cancel"
          >
            <div
              v-loading="formLoading"
              style="padding-right: 20px;"
            >
              <el-form
                ref="editForm"
                :model="selectForm"
                :rules="formRules"
                label-width="100px"
                label-position="right"
                size="small"
              >
                <el-form-item
                  label="机构类型"
                  prop="type"
                >
                  <el-select
                    v-model="selectForm.type"
                    style="width:100%;"
                    placeholder="请选择"
                  >
                    <el-option
                      label="海关"
                      value="0"
                    />
                    <el-option
                      label="船东"
                      value="1"
                    />
                    <el-option
                      label="空运公司"
                      value="2"
                    />
                    <el-option
                      label="铁路公司"
                      value="3"
                    />
                    <el-option
                      label="快递公司"
                      value="4"
                    />
                    <el-option
                      label="卡派公司"
                      value="5"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="国家/地区"
                  prop="countryId"
                >
                  <el-select
                    v-model="selectForm.countryId"
                    :loading="selectLoading"
                    style="width:100%;"
                    placeholder="请选择"
                    filterable
                    @focus="getCountryList"
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
                    v-model="selectForm.stateId"
                    :loading="selectLoading"
                    placeholder="请选择"
                    clearable
                    :disabled="!selectForm.countryId"
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
                    v-model="selectForm.cityId"
                    :loading="selectLoading"
                    placeholder="请选择"
                    clearable
                    :disabled="!selectForm.stateId"
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
                    v-model="selectForm.countyId"
                    :loading="selectLoading"
                    placeholder="区/县"
                    clearable
                    :disabled="!selectForm.cityId"
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
                  label="服务国家"
                  prop="serviceIds"
                >
                  <el-input
                    v-model="ss"
                    :placeholder="`已选择(${selectForm.serviceIds.length})`"
                    style="width:100%"
                    disabled
                  >
                    <el-button
                      slot="append"
                      icon="el-icon-search"
                      @click="onServiceCountry"
                    />
                  </el-input>
                </el-form-item>
                <el-form-item
                  label="机构名称"
                  prop="name"
                >
                  <el-input
                    v-model="selectForm.name"
                    clearable
                    placeholder="请输入"
                    :maxlength="50"
                  />
                </el-form-item>
                <el-form-item
                  label="英文名称"
                  prop="alias"
                >
                  <el-input
                    v-model="selectForm.alias"
                    clearable
                    placeholder="请输入"
                    :maxlength="50"
                  />
                </el-form-item>
                <el-form-item
                  label="全球代码"
                  prop="code"
                >
                  <el-input
                    v-model="selectForm.code"
                    clearable
                    placeholder="请输入"
                    :maxlength="20"
                  />
                </el-form-item>
                <el-form-item
                  label="链接网址"
                  prop="url"
                >
                  <el-input
                    v-model="selectForm.url"
                    clearable
                    placeholder="请输入"
                    :maxlength="100"
                  />
                </el-form-item>
                <el-form-item
                  label="logo"
                >
                  <el-upload
                    class="avatar"
                    action
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                    :http-request="uploadFile"
                  >
                    <div
                      v-if="imgUrl"
                      class="img-show"
                    >
                      <img
                        :src="imgUrl"
                        class="avatar-img"
                      >
                      <span
                        class="img-action"
                        @click.stop=""
                      >
                        <i
                          class="el-icon-zoom-in"
                          @click.stop="magnifyFile"
                        />
                        <i
                          class="el-icon-delete"
                          @click.stop="removeFile"
                        />
                      </span>
                    </div>
                    <i
                      v-else
                      class="el-icon-plus avatar-icon"
                    />
                  </el-upload>
                </el-form-item>
              </el-form>
            </div>
            <div
              slot="footer"
              class="dialog-footer"
            >
              <el-button @click="cancel()">
                取 消
              </el-button>
              <el-button
                type="primary"
                @click="saveConfirm()"
              >
                确 定
              </el-button>
            </div>
          </el-dialog>

          <el-dialog
            title="关联服务国家"
            :visible.sync="isTransferShow"
            :close-on-click-modal="false"
            width="960px"
            @close="transferClose"
          >
            <div v-loading="selectLoading">
              <el-transfer
                ref="transferItem"
                v-model="selectForm.serviceIds"
                filterable
                :filter-method="filterMethod"
                :titles="['关联服务国家', '已选择']"
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
                  @click="transferClose"
                >
                  取 消
                </el-button>

                <el-button
                  type="primary"
                  size="small"
                  @click="transferConfirm"
                >
                  确 定
                </el-button>
              </div>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
    <el-dialog
      title="商品图片"
      :visible.sync="imgShow"
      :close-on-click-modal="false"
      append-to-body
      width="540px"
      @closed=";(imgShow = false)"
    >
      <img
        :src="imgUrl"
        style="display: block;height: 100%;width: 100%;object-fit: contain;"
      >
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getSeviceOrganList,
  getCountryList,
  getStateByCountry,
  getCityByState,
  getCountyByCity,
  deleteOrgan,
  saveOrgan
} from '@/api/operation-of-service-agency'
import { isValidURL } from '@/utils/validate'
import dayjs from 'dayjs'
@Component({
  name: 'Port',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private isAddEditVisible: boolean = false
  private dialogLoading: boolean = false
  private isEdit: boolean = false
  private tableData: any = []
  private currentId = ''
  private selectValue: any = {
    type: undefined,
    name: undefined,
    nameSort: null,
    countryId: undefined,
    serviceCountry: undefined,
    cityId: undefined,
    stateId: undefined,
    countyId: undefined
  }
  private selectForm: any = {
    name: '', // 机构名称
    alias: '', // 英文名称
    code: '', // 全球代码
    type: '', // 机构类型
    url: '', // 链接网址
    countryId: '',
    serviceIds: [],
    cityId: '',
    stateId: '',
    countyId: '',
    img: ''
  }
  private imgUrl = ''
  private ss = ''
  private imgShow: boolean = false
  private isOut: boolean = false
  private isTransferShow: boolean = false
  private countryList: any[] = [] // 国家列表
  private stateList1: any = []
  private cityList1: any = []
  private countyList1: any = []
  private stateList2: any = []
  private cityList2: any = []
  private countyList2: any = []
  private selectLoading = false
  private formLoading = false
  private props: any = {
    value: 'id',
    label: 'name'
  }
  private typeList: any = [
    {
      label: '机场',
      value: '0'
    },
    {
      label: '港口',
      value: '1'
    }
  ]

  private page: number = 1
  private size: number = 10
  private total: any = 0

  private formRules = {
    name: [
      { required: true, message: '机构名称不能为空', trigger: 'blur' }
    ],
    alias: [
      { required: true, message: '英文名称不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (!value) {
            callback(new Error('英文名称不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('英文名称不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    code: [
      { required: true, message: '全球代码不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^[a-zA-Z0-9\s]*$/
          if (!reg.test(value)) {
            callback(new Error('全球代码只能包含数字、字母'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    type: [{ required: true, message: '请选择机构类型', trigger: 'change' }],
    countryId: [
      { required: true, message: '请选择国家或地区', trigger: 'change' }
    ],
    serviceIds: [
      { required: true, message: '请选择服务国家或地区', trigger: 'blur' }
    ],
    countyId: [{ required: false, message: '请选择区/县', trigger: 'change' }],
    stateId: [{ required: true, message: '请选择州/省', trigger: 'change' }],
    cityId: [{ required: true, message: '请选择城市', trigger: 'change' }],
    url: [
      {
        message: '请输入以http(s)://开头的正确格式网址',
        trigger: 'blur',
        validator: this.validateLink
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

  /* methods */
  private sortChange(option: any) {
    if (option.order) {
      this.selectValue.nameSort = option.order === 'descending' ? 'D' : 'A'
    } else {
      this.selectValue.nameSort = null
    }
    this.queryAll(1)
  }
  private validateLink(
    rule: any,
    value: string,
    callback: (e?: Error) => void
  ): void {
    if (value && !isValidURL(value)) {
      callback(new Error('Please enter the correct url'))
    } else {
      callback()
    }
  }
  private queryAll(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const params: any = {
      ...this.selectValue,
      page: this.page,
      size: this.size
    }
    getSeviceOrganList(params)
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
  // 类型名称
  private typeFilter(row: any): any {
    let name
    switch (row.type) {
      case '0':
        name = '海关'
        break
      case '1':
        name = '船东'
        break
      case '2':
        name = '空运公司'
        break
      case '3':
        name = '铁路公司'
        break
      case '4':
        name = '快递公司'
        break
      case '5':
        name = '卡派公司'
        break
      default:
        break
    }
    return name
  }

  // 获取国家列表
  private getCountryList() {
    this.selectLoading = true
    getCountryList()
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result || []
        this.countryList = result.map((it: any) => {
          return {
            name: it.name,
            id: it.id,
            alias: it.alias,
            label: it.name + '-' + it.alias
          }
        })
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private async getStateList(num: number) {
    const params = num === 1 ? this.selectValue.countryId : this.selectForm.countryId
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
    const params = num === 1 ? this.selectValue.stateId : this.selectForm.stateId
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
    const params = num === 1 ? this.selectValue.cityId : this.selectForm.cityId
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
  private async onCountryChange(type: number) {
    if (type === 1) {
      this.selectValue.stateId = undefined
      this.selectValue.cityId = undefined
      this.selectValue.countyId = undefined
    } else if (type === 2) {
      this.selectForm.stateId = undefined
      this.selectForm.cityId = undefined
      this.selectForm.countyId = undefined
    }
  }
  private onStateChange(num: number) {
    if (num === 1) {
      this.selectValue.cityId = undefined
      this.selectValue.countyId = undefined
    } else if (num === 2) {
      this.selectForm.cityId = undefined
      this.selectForm.countyId = undefined
    }
  }
  private onCityChange(num: number) {
    if (num === 1) {
      this.selectValue.countyId = undefined
    } else if (num === 2) {
      this.selectForm.countyId = undefined
    }
  }

  private onServiceCountry() {
    this.isTransferShow = true
    this.getCountryList()
  }
  private transferClose() {
    this.isTransferShow = false
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
  }
  private transferConfirm() {
    if (this.isOut) {
      this.selectLoading = true
      const { serviceIds, name, ...form } = this.selectForm
      const params: any = {
        ...form,
        name: name.trim(),
        serviceCountry: serviceIds.join(',')
      }
      saveOrgan(params)
        .then((res: any) => {
          this.selectLoading = false
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.transferClose()
          this.queryAll()
        })
        .catch((err: any) => {
          this.selectLoading = false
          return err
        })
    } else {
      this.transferClose()
    }
  }
  private filterMethod(query: any, item: any): boolean {
    const name = item.name || ''
    return name.indexOf(query) > -1
  }

  private deletRow(row: any) {
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
        deleteOrgan(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.queryAll()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }
  // 新增
  private addOrgan(): void {
    this.isEdit = false
    this.isAddEditVisible = true
    this.isOut = false
  }
  private cancel() {
    this.isAddEditVisible = false
    this.stateList2 = []
    this.cityList2 = []
    this.countyList2 = []
    this.resetForm()
    this.clearValidate()
  }
  private clearValidate() {
    const editForm: any = this.$refs.editForm
    this.$nextTick(() => {
      editForm.clearValidate()
    })
  }
  // 提交保存
  private saveConfirm() {
    // const vals = this.getCascaderObj(this.val, this.options)
    const editForm: any = this.$refs.editForm
    editForm.validate((valid: any) => {
      if (!valid) {
        return false
      }
      this.formLoading = true
      const { countryId, stateId, cityId, countyId, serviceIds, name, ...form } = this.selectForm
      const countryName = (this.countryList.find((item: any) => item.id === countryId) || {}).name
      const stateName = (this.stateList2.find((item: any) => item.id === stateId) || {}).name
      const cityName = (this.cityList2.find((item: any) => item.id === cityId) || {}).name
      const countyName = (this.countyList2.find((item: any) => item.id === countyId) || {}).name

      const params: any = {
        ...form,
        name,
        countryName,
        countryId,
        stateName,
        stateId,
        cityName,
        cityId,
        countyName,
        countyId,
        serviceCountry: serviceIds.join(',')
      }
      if (this.isEdit) {
        params.id = this.currentId
      }
      saveOrgan(params)
        .then((res: any) => {
          this.formLoading = false
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.isAddEditVisible = false
          this.resetForm()
          this.clearValidate()
          this.queryAll()
        })
        .catch((err: any) => {
          this.formLoading = false
          return err
        })
    })
  }
  // 重置表单
  private resetForm() {
    this.selectForm = {
      name: '', // 机构名称
      alias: '', // 英文名称
      code: '', // 全球代码
      type: '', // 机构类型
      url: '', // 链接网址
      countryId: '',
      serviceIds: [],
      cityId: '',
      stateId: '',
      countyId: '',
      img: ''
    }
    this.imgUrl = ''
  }
  private editCountry(row: any) {
    const { serviceCountry, ...form } = row
    this.selectForm = {
      ...form,
      serviceIds: serviceCountry ? serviceCountry.split(',') : []
    }
    this.isTransferShow = true
    this.isOut = true
    this.getCountryList()
  }
  // 编辑
  private async editOrgan(row: any) {
    this.formLoading = true
    this.isEdit = true
    this.isOut = false
    this.isAddEditVisible = true
    this.currentId = row.id
    const { serviceCountry, img, ...form } = row
    this.selectForm = {
      ...form,
      img,
      serviceIds: serviceCountry ? serviceCountry.split(',') : []
    }
    this.imgUrl = img ? process.env.VUE_APP_OSS_PATH + img : ''
    this.getCountryList()
    try {
      if (this.selectForm.countryId) {
        await this.getStateList(2)
      }
      if (this.selectForm.stateId) {
        await this.getCityList(2)
      }
      if (this.selectForm.cityId) {
        await this.getCountyList(2)
      }
      this.formLoading = false
    } catch (error) {
      this.formLoading = false
    }
  }

  private beforeUpload(file: any) {
    const isJPG = file.type.indexOf('image') !== -1
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isJPG) {
      this.$message.error('上传照片只能是图片格式!')
    }
    if (!isLt2M) {
      this.$message.error('上传照片大小不能超过 2MB!')
    }
    return isJPG && isLt2M
  }
  private uploadFile(params: any): void {
    const { file } = params
    this.$upload(true, file, `jht-admin/service-agency/logo/${dayjs().valueOf() + '/' + file.name}`)
      .then((res: any) => {
        this.selectForm.img = res.data || ''
        this.imgUrl = URL.createObjectURL(file)
        this.$message.success('上传成功')
      })
      .catch((err: any) => {
        return err
      })
  }
  private removeFile(file: any, fileList: any[]) {
    this.$deleteLoad(file.url, true)
      .then((res: any) => {
        // this.$message.success(`删除成功`)
        this.selectForm.img = ''
        this.imgUrl = ''
      })
      .catch((err: any) => {
        return err
      })
  }
  private magnifyFile() {
    this.imgShow = true
  }
  // 关闭dialog重置表单
  private close(): void {
    this.isAddEditVisible = false
    this.resetForm()
  }

  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.queryAll()
    // this.$message.success(val)
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.queryAll()
    // this.$message.success(val)
  }

  private created(): void {
    this.queryAll()
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-upload {
  display: inline-block;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  height: 150px;
  overflow: hidden;
}
::v-deep .el-upload:hover {
  border-color: #409EFF;
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
  .el-form-item {
    display: inline-block;
    width: 49.5%;
  }
  .avatar {
    display: inline-block;
    width: 150px;
    height: 150px;
    margin-right: 20px;
  }
  .avatar-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar-img {
    width: 150px;
    height: 150px;
    display: inline-block;
    object-fit: contain;
  }
  ::v-deep .img-show:hover .img-action {
    opacity: 1;
  }
  .img-show {
    height: 150px;
  }
  .img-action {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0,0,0,.5);
    transition: opacity .3s;
  }
  .el-icon-delete {
    margin-top: 65px;
    cursor: pointer;
  }
  .el-icon-zoom-in {
    margin-top: 65px;
    margin-right: 30px;
    cursor: pointer;
  }
</style>
