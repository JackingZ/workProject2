<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="机场港口"
        />
        <div class="app-panel">
          <el-row type="flex">
            <el-col :span="6">
              <el-button
                v-permission="['addPort']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-left: 10px"
                @click="addPort"
              >
                新增港口
              </el-button>
            </el-col>
            <el-col
              :span="18"
              style="text-align:right;"
            >
              <el-select
                v-model="searchForm.type"
                placeholder="港口类型"
                clearable
                style="width:130px;margin-right:5px;"
                size="small"
                filterable
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>

              <el-select
                v-model="searchForm.countryId"
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

              <el-input
                v-model="searchForm.keyword"
                placeholder="请输入内容"
                class="input-with-select"
                style="width:280px;margin-right:10px;"
                size="small"
              >
                <el-select
                  slot="prepend"
                  v-model="searchForm.selectType"
                  size="small"
                  style="width:100px;"
                  placeholder="请选择"
                >
                  <el-option
                    label="港口名称"
                    value="1"
                  />
                  <el-option
                    label="三字代码"
                    value="2"
                  />
                </el-select>
              </el-input>
              <el-button
                v-permission="['queryPort']"
                type="primary"
                size="small"
                @click="getPortList(1)"
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
              label="港口类型"
              width="120"
            >
              <template slot-scope="scope">
                {{ formattType(scope.row.type) }}
              </template>
            </el-table-column>

            <el-table-column
              label="港口名称"
              min-width="180"
              prop="name"
            />

            <el-table-column
              label="英文名称"
              min-width="180"
              prop="alias"
            />

            <el-table-column
              label="三字代码"
              width="120"
              prop="code"
            />

            <el-table-column
              label="国家/地区"
              width="180"
              prop="countryName"
              show-overflow-tooltip
            />

            <el-table-column
              label="州省市区"
              width="200"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span
                  v-show="!!scope.row.stateName"
                >
                  {{ scope.row.stateName }}
                </span>
                <span
                  v-show="!!scope.row.cityName"
                >
                  > {{ scope.row.cityName }}
                </span>
                <span
                  v-show="!!scope.row.countyName"
                >
                  > {{ scope.row.countyName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="海关"
              width="120"
              prop="hsName"
              show-overflow-tooltip
            />
            <el-table-column
              label="添加时间"
              width="170"
              prop="createTime"
            />

            <el-table-column
              label="操作"
              width="130"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['editPort']"
                  type="text"
                  size="medium"
                  @click="editPort(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['deletePort']"
                  type="text"
                  size="medium"
                  @click="deleteData(scope.row)"
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
            title="机场港口"
            width="960px"
            :visible.sync="dialogShow"
            :close-on-click-modal="false"
            @closed="close"
          >
            <el-form
              ref="theForm"
              v-loading="dialogLoading"
              :rules="formRules"
              :model="form"
              label-width="100px"
              size="small"
              style="padding-right: 20px;"
            >
              <el-form-item
                prop="countryId"
                label="国家/地区"
              >
                <el-select
                  v-model="form.countryId"
                  placeholder="请选择"
                  style="width: 100%"
                  filterable
                  clearable
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
                prop="type"
                label="港口类型"
              >
                <el-select
                  v-model="form.type"
                  placeholder="请选择"
                  style="width: 100%"
                  filterable
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
                prop="name"
                label="港口名称"
              >
                <el-input
                  v-model="form.name"
                  autocomplete="off"
                  style="width: 100%"
                  :maxlength="50"
                />
              </el-form-item>
              <el-form-item
                prop="alias"
                label="英文名称"
              >
                <el-input
                  v-model="form.alias"
                  autocomplete="off"
                  style="width: 100%"
                  :maxlength="50"
                />
              </el-form-item>
              <el-form-item
                prop="code"
                label="三字代码"
              >
                <el-input
                  v-model="form.code"
                  autocomplete="off"
                  :maxlength="8"
                  show-word-limit
                  style="width: 100%"
                />
              </el-form-item>
              <el-form-item
                prop="address"
                label="详细地址"
              >
                <el-input
                  v-model="form.address"
                  autocomplete="off"
                  style="width: 100%"
                  :maxlength="100"
                />
              </el-form-item>
              <el-form-item
                prop="postal"
                label="详细邮编"
              >
                <el-input
                  v-model="form.postal"
                  autocomplete="off"
                  style="width: 100%"
                  :maxlength="10"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item
                prop="hsCode"
                label="海关"
              >
                <el-select
                  v-model="form.hsCode"
                  placeholder="请选择"
                  style="width: 100%"
                  filterable
                  :loading="selectLoading"
                  @focus="getOrgList"
                >
                  <el-option
                    v-for="item in orgList"
                    :key="item.id"
                    :label="`${item.name}-${item.alias}`"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-form>
            <div
              slot="footer"
              class="dialog-footer"
            >
              <el-button @click="close">
                取 消
              </el-button>
              <el-button
                type="primary"
                @click="savePort"
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
  getPortList,
  savePort,
  deletePort,
  IPortRequest,
  getOrgList
} from '@/api/operation-of-port-management'

@Component({
  name: 'Port',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private dialogShow: boolean = false
  private dialogLoading: boolean = false
  private selectLoading: boolean = false
  private orgList: any[] = []
  private list: any = []
  private stateList1: any = []
  private cityList1: any = []
  private countyList1: any = []
  private stateList2: any = []
  private cityList2: any = []
  private countyList2: any = []
  private countryList: any[] = []
  private typeList: any = [
    {
      label: '机场',
      value: '0'
    },
    {
      label: '港口',
      value: '1'
    },
    {
      label: '火车站',
      value: '2'
    },
    {
      label: '口岸',
      value: '4'
    }
  ]

  private form: IPortRequest = {
    hsCode: '',
    hsName: '',
    countryId: '',
    countryName: '',
    stateId: '',
    stateName: '',
    cityId: '',
    cityName: '',
    countyId: '',
    countyName: '',
    type: '',
    name: '',
    alias: '',
    code: '',
    address: '',
    postal: ''
  }
  private formRules = {
    countryId: [{ required: true, message: '请选择国家/地区', trigger: 'change' }],
    countyId: [{ required: false, message: '请选择区/县', trigger: 'change' }],
    stateId: [{ required: true, message: '请选择州/省', trigger: 'change' }],
    cityId: [{ required: true, message: '请选择城市', trigger: 'change' }],
    type: [{ required: true, message: '请选择港口类型' }],
    name: [
      { required: true, message: '港口名称不能为空', trigger: 'blur' }
    ],
    alias: [
      { required: true, message: '英文名称不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (!value) {
            callback(new Error('英文名称不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('英文名称不能为中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    address: [
      { required: true, message: '详细地址不能为空', trigger: 'blur' }
    ],
    postal: [
      { required: true, message: '详细邮编不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^[a-zA-Z0-9]*$/
          if (!value) {
            callback(new Error('详细邮编不能为空'))
          } else if (!reg.test(value)) {
            callback(new Error('详细邮编只能是数字、字母'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    code: [
      { required: true, message: '三字代码不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^[a-zA-Z0-9]*$/
          if (!value) {
            callback(new Error('三字代码不能为空'))
          } else if (!reg.test(value)) {
            callback(new Error('三字代码只能是数字、字母'))
          } else if (value.length < 3) {
            callback(new Error('三字代码不能少于三位'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }

  private searchForm: any = {
    countryId: '',
    stateId: '',
    cityId: '',
    countyId: '',
    type: '',
    selectType: '1',
    keyword: ''
  }

  private page: number = 1
  private size: number = 10
  private total: any = 0

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
  private formattType(type: any) {
    const tamp = this.typeList.find((e: any) => e.value === type) || {}
    return tamp.label || '--'
  }

  private getOrgList() {
    const params = {
      type: 0,
      countryId: this.form.countryId,
      stateId: this.form.stateId,
      cityId: this.form.cityId,
      countyId: this.form.countyId,
      page: 1,
      size: 99999
    }
    this.orgList = []
    this.selectLoading = true
    getOrgList(params).then((res: any) => {
      if (res.success) {
        const data = res.data || {}
        this.orgList = data.result || []
      }
      this.selectLoading = false
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }

  private formatData(arr:any) {
    arr.forEach((item:any) => {
      if (Array.isArray(item.children) && item.children.length === 0) {
        delete item.children
      } else {
        this.formatData(item.children)
      }
    })
    return arr
  }

  private codeValidator(rule: any, value: any, callback: any) {
    if (value === '') {
      callback(new Error('三字代码不能为空'))
    } else if (value.length < 3) {
      callback(new Error('三字代码不能少于三位'))
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
  private addPort(): void {
    this.dialogShow = true
  }

  // 编辑
  private async editPort(row: any) {
    this.dialogShow = true
    const { form } = this
    this.form = {
      ...form,
      ...{
        stateId: '',
        stateName: '',
        cityId: '',
        cityName: '',
        countyId: '',
        countyName: ''
      },
      ...row
    }
    this.dialogLoading = true
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
    this.getOrgList()
    this.dialogLoading = false
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
        deletePort(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getPortList()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }

  // 关闭dialog重置表单
  private close(): void {
    this.dialogShow = false
    this.stateList2 = []
    this.cityList2 = []
    this.countyList2 = []
    this.reset()
  }

  // 保存表单
  private savePort(): void {
    (this.$refs.theForm as any).validate((valid: any) => {
      if (valid) {
        this.dialogLoading = true
        const { form } = this
        form.countryName = ((this as any).countryList.find((item: any) => item.id === form.countryId) || {}).name
        form.hsName = (this.orgList.find((item: any) => item.id === form.hsCode) || {}).name
        form.stateName = (this.stateList2.find((item: any) => item.id === form.stateId) || {}).name
        form.cityName = (this.cityList2.find((item: any) => item.id === form.cityId) || {}).name
        form.countyName = (this.countyList2.find((item: any) => item.id === form.countyId) || {}).name
        const params = JSON.parse(JSON.stringify(form))

        savePort(params)
          .then(res => {
            this.close()
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.getPortList()
            this.dialogLoading = false
          })
          .catch(err => {
            this.dialogLoading = false
            return err
          })
      } else {
        return false
      }
    })
  }

  private getCountryList() {
    getCountryList().then((res:any) => {
      const data = res.data || {}
      this.countryList = data.result || []
    }).catch((err:any) => {
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

  // 查询列表
  private getPortList(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const { page, size } = this
    const { selectType, keyword, ...form } = this.searchForm
    const name = selectType === '1' ? keyword : ''
    const code = selectType === '2' ? keyword : ''
    const params = {
      ...form,
      page,
      size,
      name,
      code
    }
    getPortList(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        const { total, result } = data
        this.total = total
        this.list = result
      })
      .catch(err => {
        this.loading = false
        return err
      })
  }

  // 重置表单
  private reset(): void {
    this.stateList2 = []
    this.cityList2 = []
    this.countyList2 = []
    this.form = {
      countryId: '',
      countryName: '',
      stateId: '',
      stateName: '',
      cityId: '',
      cityName: '',
      countyId: '',
      countyName: '',
      type: '',
      name: '',
      alias: '',
      code: '',
      address: '',
      postal: ''
    }
    this.clearValidate()
  }

  private handleSizeChange(): any {
    return 123
  }

  private handleCurrentChange(): any {
    this.getPortList()
  }

  private created(): void {
    this.getPortList()
    this.getCountryList()
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  display: inline-block;
  width: 49.5%;
}
</style>
