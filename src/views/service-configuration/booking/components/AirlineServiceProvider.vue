<template>
  <div>
    <el-row>
      <el-col :span="4">
        <el-button
          v-permission="['bookingServiceServiceLineAdd']"
          type="text"
          icon="el-icon-circle-plus-outline"
          style="margin-left: 10px"
          @click="addServicer"
        >
          新增服务商
        </el-button>
      </el-col>
      <el-col :span="20">
        <div style="text-align: right;">
          <el-select
            v-model="searchForm.shipDay"
            size="small"
            style="width: 130px;margin-right: 5px;"
            placeholder="起运时间"
            filterable
            clearable
          >
            <el-option
              v-for="item in weekdays"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="searchForm.customDay"
            size="small"
            style="width: 130px;margin-right: 5px;"
            placeholder="截报关时间"
            filterable
            clearable
          >
            <el-option
              v-for="item in weekdays"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model="keyWord"
            size="small"
            style="width: 250px;margin-right: 10px;"
            placeholder="请输入"
            :maxlength="150"
          >
            <el-select
              slot="prepend"
              v-model="keyType"
              size="small"
              style="width:100px;"
              placeholder="请选择"
            >
              <el-option
                label="服务编码"
                value="1"
              />
              <el-option
                label="服务机构"
                value="2"
              />
            </el-select>
          </el-input>
          <el-button
            type="primary"
            size="small"
            @click="onSearch"
          >
            查询
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="tableData"
      height="400px"
      style="width: 100%;margin: 10px 0;"
      border
    >
      <el-table-column
        prop="orgName"
        label="服务机构"
        min-width="150"
      />
      <el-table-column
        prop="serviceCode"
        label="服务编码"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="entreportName"
        label="中转港"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="dischargeName"
        label="卸货港"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="days"
        label="运输天数"
        width="100"
      />
      <el-table-column
        :formatter="formatDays"
        prop="shipDay"
        label="起运时间"
        min-width="120"
      />
      <el-table-column
        :formatter="formatDays"
        prop="docDay"
        label="截文件时间"
        min-width="120"
      />
      <el-table-column
        :formatter="formatDays"
        prop="customDay"
        label="截报关时间"
        min-width="120"
      />
      <el-table-column
        :formatter="formatType"
        prop="orgType2"
        label="二程机构类型"
        width="120"
      />
      <el-table-column
        prop="orgName2"
        label="二程服务机构"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="dischargeName2"
        label="二程卸货港"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="days2"
        label="二程运输天数"
        width="120"
      />
      <el-table-column
        :formatter="formatDays"
        prop="shipDay2"
        label="二程起运时间"
        min-width="120"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="160"
      >
        <template slot-scope="scope">
          <el-button
            :disabled="!$checkPermission(['bookingServiceServiceLineEdit'])"
            type="text"
            @click="editServicer(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            :disabled="!$checkPermission(['bookingServiceServiceLineDel'])"
            type="text"
            @click="deletServicer(scope.row)"
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
      :title="serTitle"
      width="900px"
      :visible.sync="isAddEditVisible"
      :close-on-click-modal="false"
      append-to-body
      @close="cancel"
    >
      <div
        v-loading="servicerLoading"
        class="add-edit-organ"
      >
        <el-form
          ref="editForm"
          :model="selectForm"
          :rules="formRules"
          label-width="140px"
          label-position="right"
          class="airline-service-form"
          size="small"
        >
          <el-form-item
            label="服务机构"
            prop="orgId"
          >
            <el-select
              v-model="selectForm.orgId"
              :loading="selectLoading"
              :disabled="isEdit"
              style="width:100%;"
              size="small"
              placeholder="请选择"
              clearable
              filterable
              @focus="getSeviceOrganList('1')"
            >
              <el-option
                v-for="item in organList"
                :key="item.id"
                :label="`${item.name}-${item.alias}`"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="服务编码"
            prop="serviceCode"
          >
            <el-input
              v-model="selectForm.serviceCode"
              show-word-limit
              :maxlength="30"
              :disabled="isEdit"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="中转国"
            prop="entreportCountryId"
          >
            <el-select
              v-model="selectForm.entreportCountryId"
              :loading="selectLoading"
              style="width:100%;"
              placeholder="请选择"
              filterable
              @change="onCountry('enterport')"
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
            label="中转港"
            prop="entreport"
          >
            <el-select
              v-model="selectForm.entreport"
              :disabled="!selectForm.entreportCountryId"
              :loading="selectLoading"
              style="width:100%;"
              size="small"
              placeholder="请选择"
              clearable
              filterable
              @focus="getPortList('enterport')"
            >
              <el-option
                v-for="item in entreportList"
                :key="item.id"
                :label="`${item.code}-${item.name}-${item.alias}`"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="卸货国"
            prop="dischargeCountryId"
          >
            <el-select
              v-model="selectForm.dischargeCountryId"
              :loading="selectLoading"
              style="width:100%;"
              placeholder="请选择"
              filterable
              @change="onCountry('discharge')"
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
            label="卸货港"
            prop="discharge"
          >
            <el-select
              v-model="selectForm.discharge"
              :disabled="!selectForm.dischargeCountryId"
              :loading="selectLoading"
              style="width:100%;"
              size="small"
              placeholder="请选择"
              clearable
              filterable
              @focus="getPortList('discharge')"
            >
              <el-option
                v-for="item in dischargeportList"
                :key="item.id"
                :label="`${item.code}-${item.name}-${item.alias}`"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="运输信息"
            prop="days"
          >
            <el-input
              v-model="selectForm.days"
              placeholder="运输天数"
            >
              <span slot="append">天</span>
            </el-input>
          </el-form-item>
          <el-form-item
            label="起运时间"
            prop="shipDay"
          >
            <el-select
              v-model="selectForm.shipDay"
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
            label="截文件时间"
            prop="docDay"
          >
            <el-select
              v-model="selectForm.docDay"
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
            label="截报关时间"
            prop="customDay"
          >
            <el-select
              v-model="selectForm.customDay"
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
            v-if="isAir === '0'"
            label="是否包机"
            prop="transfer"
          >
            <el-radio-group v-model="selectForm.airplane">
              <el-radio :label="false">
                否
              </el-radio>
              <el-radio :label="true">
                是
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="二程转运"
            prop="transfer"
          >
            <el-radio-group
              v-model="selectForm.transfer"
              @change="onTransfer"
            >
              <el-radio :label="false">
                无
              </el-radio>
              <el-radio :label="true">
                有
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="selectForm.transfer">
            <el-form-item
              label="二程服务机构类型"
              prop="orgType2"
            >
              <el-select
                v-model="selectForm.orgType2"
                style="width:100%;"
                size="small"
                placeholder="请选择"
                clearable
                filterable
                @change="onOrgType2"
              >
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
              </el-select>
            </el-form-item>
            <el-form-item
              label="二程卸货国"
              prop="dischargeCountryId2"
            >
              <el-select
                v-model="selectForm.dischargeCountryId2"
                :loading="selectLoading"
                style="width:100%;"
                placeholder="请选择"
                filterable
                @change="onCountry('discharge2')"
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
              label="二程服务机构"
              prop="orgId2"
            >
              <el-select
                v-model="selectForm.orgId2"
                :disabled="!selectForm.orgType2"
                :loading="selectLoading"
                style="width:100%;"
                size="small"
                placeholder="请选择"
                clearable
                filterable
                @focus="getSeviceOrganList('2')"
              >
                <el-option
                  v-for="item in organ2List"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="二程卸货港"
              prop="discharge2"
            >
              <el-select
                v-model="selectForm.discharge2"
                :disabled="!selectForm.dischargeCountryId2"
                :loading="selectLoading"
                style="width:100%;"
                size="small"
                placeholder="请选择"
                clearable
                filterable
                @focus="getPortList('discharge2')"
              >
                <el-option
                  v-for="item in discharge2portList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="二程运输信息"
              prop="days2"
            >
              <el-input
                v-model="selectForm.days2"
                placeholder="运输天数"
              >
                <span slot="append">天</span>
              </el-input>
            </el-form-item>
            <el-form-item
              label="二程起运时间"
              prop="shipDay2"
            >
              <el-select
                v-model="selectForm.shipDay2"
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
          </div>
        </el-form>
        <div
          slot="footer"
          style="text-align: right;margin: 20px 20px 0;"
        >
          <el-button @click="cancel">
            取 消
          </el-button>
          <el-button
            type="primary"
            @click="saveConfirm"
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
import { AppModule } from '@/store/modules/app'
import {
  getBsTransList,
  saveBsTrans,
  updateBsTrans,
  deleteBsTrans,
  getCountryList
} from '@/api/service-with-booking-service'
import { getPortList } from '@/api/operation-of-port-management'
import { getSeviceOrganList } from '@/api/operation-of-service-agency'
function formParam() {
  return {
    serviceCode: '',
    airplane: false,
    bsId: undefined,
    days2: undefined,
    discharge2: undefined,
    dischargeName2: undefined,
    dischargeCountryId2: undefined,
    dischargeCountryName2: undefined,
    orgId2: undefined,
    orgName2: undefined,
    orgType2: undefined,
    shipDay2: undefined,
    customDay: undefined,
    days: undefined,
    discharge: undefined,
    dischargeCountryId: undefined,
    dischargeCountryName: undefined,
    docDay: undefined,
    entreport: undefined,
    entreportName: undefined,
    entreportCountryId: undefined,
    entreportCountryName: undefined,
    id: undefined,
    orgId: undefined,
    orgName: undefined,
    orgType: undefined,
    shipDay: undefined,
    transfer: false
  }
}
function validateNums(rule: any, value: any, callback: (val?: any) => void) {
  const reg = /^[1-9]+[0-9]*$/
  if (!reg.test(value)) {
    callback(new Error('运输信息为正整数'))
  } else {
    callback()
  }
}

@Component({
  name: 'AirlineServiceProvider',
  components: {},
  props: {
    stId: {
      type: String,
      default: ''
    },
    countryService: {
      type: Array,
      default: () => ([])
    }
  }
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private servicerLoading: boolean = false
  private isAddEditVisible: boolean = false
  private selectLoading: boolean = false
  private entreportList: any[] = []
  private dischargeportList: any[] = []
  private discharge2portList: any[] = []
  private organList: any[] = []
  private organ2List: any[] = []
  private tableData: any[] = []
  private countryList: any[] = []
  private page: number = 1
  private size: number = 10
  private total: any = 0
  private searchForm: any = {
    shipDay: undefined,
    customDay: undefined,
    orgName: undefined,
    serviceCode: undefined
  }
  private keyType: any = '1'
  private keyWord: any = ''
  private serTitle: string = ''
  private bsId: string = ''
  private isAir: string = ''
  private isEdit: boolean = false
  private selectForm: any = formParam()
  private formRules = {
    orgId: [{ required: true, message: '请选择服务机构', trigger: 'change' }],
    serviceCode: [
      { required: true, message: '请输入服务编码', trigger: 'change' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^[a-zA-Z0-9 .·_-]+$/
          if (!value) {
            callback(new Error('服务编码不能为空'))
          } else if (!reg.test(value)) {
            callback(new Error('服务编码不能有中文及特殊字符'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    // entreportCountryId: [
    //   { required: true, message: '请选择中转国', trigger: 'change' }
    // ],
    dischargeCountryId: [
      { required: true, message: '请选择卸货港', trigger: 'change' }
    ],
    dischargeCountryId2: [
      { required: true, message: '请选择二程卸货港', trigger: 'change' }
    ],
    // entreport: [
    //   { required: true, message: '请选择中转港', trigger: 'change' }
    // ],
    discharge: [
      { required: true, message: '请选择卸货港', trigger: 'change' }
    ],
    days: [
      { required: true, message: '运输天数不能为空', trigger: 'blur' },
      { validator: validateNums, trigger: 'blur' }
    ],
    customDay: [
      { required: true, message: '请选择截报关时间', trigger: 'change' }
    ],
    shipDay: [
      { required: true, message: '请选择起运时间', trigger: 'change' }
    ],
    docDay: [
      { required: true, message: '请选择截文件时间', trigger: 'change' }
    ],
    transfer: [
      { required: true, message: '请选择二程转运', trigger: 'change' }
    ],
    orgType2: [
      { required: true, message: '请选择二程服务类型', trigger: 'change' }
    ],
    orgId2: [
      { required: true, message: '请选择二程服务机构', trigger: 'change' }
    ],
    discharge2: [
      { required: true, message: '请选择二程卸货港', trigger: 'change' }
    ],
    days2: [
      { required: true, message: '二程运输天数不能为空', trigger: 'blur' },
      { validator: validateNums, trigger: 'blur' }
    ],
    shipDay2: [
      { required: true, message: '请选择二程起运时间', trigger: 'change' }
    ]
  }
  private weekdays: any = [
    { label: '星期一', value: 1 },
    { label: '星期二', value: 2 },
    { label: '星期三', value: 3 },
    { label: '星期四', value: 4 },
    { label: '星期五', value: 5 },
    { label: '星期六', value: 6 },
    { label: '星期日', value: 7 }
  ]

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
  private setData(params: any) {
    this.bsId = (params || {}).id || ''
    this.isAir = (params || {}).conveyance || ''
    this.getCountryList()
    this.getFirstPage()
  }
  private clearData() {
    this.tableData = []
    this.total = 0
    this.searchForm = {
      shipDay: undefined,
      customDay: undefined,
      orgName: undefined,
      serviceCode: undefined
    }
    this.keyType = '1'
    this.keyWord = ''
  }
  private getFirstPage() {
    this.page = 1
    this.queryAll()
  }
  private onSearch() {
    if (this.keyType === '1') {
      this.searchForm.serviceCode = this.keyWord
      this.searchForm.orgName = undefined
    } else {
      this.searchForm.serviceCode = undefined
      this.searchForm.orgName = this.keyWord
    }
    this.queryAll()
  }
  private queryAll(): void {
    this.loading = true
    const params: any = {
      page: this.page,
      size: this.size,
      model: {
        id: this.bsId,
        ...this.searchForm
      }
    }
    getBsTransList(params)
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
  // 获取国家
  private getCountryList() {
    getCountryList()
      .then((res: any) => {
        const data = res.data || {}
        this.countryList = data.result || []
      })
      .catch((err: any) => {
        return err
      })
  }
  private onCountry(key: any) {
    switch (key) {
      case 'enterport':
        this.selectForm.entreport = undefined
        this.entreportList = []
        break
      case 'discharge':
        this.selectForm.discharge = undefined
        this.dischargeportList = []
        break
      case 'discharge2':
        this.selectForm.discharge2 = undefined
        this.discharge2portList = []
        this.selectForm.orgId2 = undefined
        this.organ2List = []
        break
      default:
        break
    }
  }
  private onOrgType2() {
    this.selectForm.orgId2 = undefined
    this.organ2List = []
    this.selectForm.discharge2 = undefined
    this.discharge2portList = []
  }
  //  获取起运港口列表
  private getPortList(key: any) {
    const params: any = {
      page: 1,
      size: 99999,
      countryId: undefined,
      type: undefined
    }
    const ot2 = this.selectForm.orgType2 === '1' ? '1' : this.selectForm.orgType2 === '2' ? '0' : this.selectForm.orgType2 === '3' ? '2' : ''
    switch (key) {
      case 'enterport':
        params.countryId = this.selectForm.entreportCountryId
        params.type = (this as any).stId
        break
      case 'discharge':
        params.countryId = this.selectForm.dischargeCountryId
        params.type = (this as any).stId
        break
      case 'discharge2':
        params.countryId = this.selectForm.dischargeCountryId2
        params.type = ot2
        break
      default:
        break
    }
    this.selectLoading = true
    getPortList(params)
      .then((res: any) => {
        this.selectLoading = false
        const data = res.data || {}
        switch (key) {
          case 'enterport':
            this.entreportList = data.result || []
            break
          case 'discharge':
            this.dischargeportList = data.result || []
            break
          case 'discharge2':
            this.discharge2portList = data.result || []
            break
          default:
            break
        }
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  //  获取服务机构列表
  private getSeviceOrganList(num: any) {
    this.selectLoading = true
    // 运输工具：0-空， 1-海，2-铁
    // 机构：0-海关,1-船东,2-空运公司,3-铁路公司，4-快递公司,5-卡派公司
    const orId = (this as any).stId === '0' ? '2' : (this as any).stId === '1' ? '1' : (this as any).stId === '2' ? '3' : ''
    const ctsv = [...new Set((this as any).countryService)]
    if (num === '1') {
      this.selectForm.orgType = orId
    }
    const params = {
      type: num === '1' ? orId : this.selectForm.orgType2,
      serviceCountry: num === '1' ? ctsv.join(',') : this.selectForm.dischargeCountryId2,
      page: 1,
      size: 99999
    }
    getSeviceOrganList(params)
      .then((res: any) => {
        this.selectLoading = false
        const data = res.data || {}
        if (num === '1') {
          this.organList = data.result || []
        } else {
          this.organ2List = data.result || []
        }
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private addServicer() {
    this.isAddEditVisible = true
    this.isEdit = false
    this.serTitle = '新增服务商'
    this.resetForm()
  }
  private editServicer(row: any) {
    this.isEdit = true
    this.serTitle = '编辑服务商'
    this.selectForm = { ...row }
    this.servicerLoading = true
    this.getPortList('enterport')
    this.getPortList('discharge')
    this.getPortList('discharge2')
    this.getSeviceOrganList('1')
    this.getSeviceOrganList('2')
    setTimeout(() => {
      this.servicerLoading = false
    }, 2000)
    this.isAddEditVisible = true
  }
  private deletServicer(row: any) {
    const params = {
      id: row.id,
      serviceCode: row.serviceCode
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteBsTrans(params)
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

  private onTransfer(): void {
    if (!this.selectForm.transfer) {
      this.selectForm.days2 = undefined
      this.selectForm.discharge2 = undefined
      this.selectForm.dischargeCountryId2 = undefined
      this.selectForm.orgId2 = undefined
      this.selectForm.orgType2 = undefined
      this.selectForm.shipDay2 = undefined
    }
  }

  private saveConfirm(): void {
    const editForm: any = this.$refs.editForm
    editForm.validate((valid: any) => {
      if (valid) {
        this.servicerLoading = true
        const {
          serviceCode,
          airplane,
          customDay,
          days,
          discharge,
          dischargeCountryId,
          docDay,
          entreport,
          entreportCountryId,
          orgId,
          orgType,
          shipDay,
          transfer,
          days2,
          discharge2,
          dischargeCountryId2,
          orgId2,
          orgType2,
          shipDay2
        } = this.selectForm
        const params: any = {
          serviceCode,
          airplane,
          bscId: this.bsId,
          dischargeCountryId,
          entreportCountryId,
          customDay,
          days,
          discharge,
          docDay,
          entreport,
          orgId,
          orgType,
          shipDay,
          transfer,
          days2,
          discharge2,
          dischargeCountryId2,
          orgId2,
          orgType2,
          shipDay2
        }
        this.countryList.map((it: any) => {
          if (it.id === dischargeCountryId) {
            params.dischargeCountryName = it.name
          }
          if (it.id === entreportCountryId) {
            params.entreportCountryName = it.name
          }
          if (it.id === dischargeCountryId2) {
            params.dischargeCountryName2 = it.name
          }
        })
        this.entreportList.map(item => {
          if (item.id === entreport) {
            params.entreportName = item.name
          }
        })
        this.dischargeportList.map(item => {
          if (item.id === discharge) {
            params.dischargeName = item.name
          }
        })
        this.discharge2portList.map(item => {
          if (item.id === discharge2) {
            params.dischargeName2 = item.name
          }
        })
        this.organList.map(item => {
          if (item.id === orgId) {
            params.orgName = item.name
          }
        })
        this.organ2List.map(item => {
          if (item.id === orgId2) {
            params.orgName2 = item.name
          }
        })
        if (this.isEdit) {
          params.id = this.selectForm.id
          updateBsTrans(params)
            .then((res: any) => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.servicerLoading = false
              this.isAddEditVisible = false
              this.resetForm()
              this.queryAll()
            })
            .catch((err: any) => {
              this.servicerLoading = false
              return err
            })
        } else {
          saveBsTrans(params)
            .then((res: any) => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.servicerLoading = false
              this.isAddEditVisible = false
              this.resetForm()
              this.queryAll()
            })
            .catch((err: any) => {
              this.servicerLoading = false
              return err
            })
        }
      } else {
        return false
      }
    })
  }
  private cancel(): void {
    this.isAddEditVisible = false
    this.resetForm()
  }
  // 重置表单
  private resetForm() {
    this.selectForm = formParam()
    this.$nextTick(() => {
      const root: any = this.$refs.editForm
      root.clearValidate()
    })
  }

  private formatDays(row: any, column: any, cellValue: any) {
    const { weekdays } = this
    const result = weekdays.find((item: any) => item.value === cellValue) || {}
    return result.label || ''
  }

  private formatType(row: any, column: any, cellValue: any) {
    let result: any = ''
    switch (cellValue) {
      case '1':
        result = '船东'
        break
      case '2':
        result = '空运公司'
        break
      case '3':
        result = '铁路公司'
        break
    }
    return result
  }

  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.queryAll()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.queryAll()
  }
}
</script>

<style lang="scss" scoped>
.airline-service-form {
  padding: 0 50px 0 10px;
  .el-form-item {
    display: inline-block;
    width: 400px;
  }
}
</style>
