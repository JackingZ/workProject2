<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="佣金配置"
        />
        <div class="app-panel">
          <el-row>
            <el-col :span="4">
              <el-button
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-left: 10px"
                @click="addRow"
              >
                新增配置
              </el-button>
            </el-col>
            <el-col
              :span="20"
              style="text-align:right;"
            >
              <el-select
                v-if="custType === '0'"
                v-model="selectValue.comId"
                :loading="selectLoading"
                size="small"
                style="width:130px;margin-right:5px;"
                placeholder="所属公司"
                filterable
                clearable
                @focus="getCompanyList"
              >
                <el-option
                  v-for="item in companyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.subtypeId"
                :loading="selectLoading"
                size="small"
                style="width: 100px;margin-right: 5px;"
                placeholder="业务类型"
                filterable
                clearable
                @focus="getSubtypeList"
                @change=";(selectValue.lscId = undefined)"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.countryId"
                :loading="selectLoading"
                placeholder="国家"
                size="small"
                clearable
                filterable
                style="width:130px;margin-right: 5px;"
                @focus="getCountryData"
                @change=";(selectValue.lscId = undefined)"
              >
                <el-option
                  v-for="itC in countryList"
                  :key="itC.id"
                  :label="`${itC.name}-${itC.alias}`"
                  :value="itC.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.lscId"
                :loading="selectLoading"
                :disabled="!selectValue.subtypeId || !selectValue.countryId"
                size="small"
                style="width: 150px;margin-right: 10px;"
                placeholder="服务"
                clearable
                filterable
                @focus="getPrivatelineList"
              >
                <el-option
                  v-for="item in privatelineList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-button
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
          >
            <el-table-column
              prop="name"
              label="配置名称"
            />
            <el-table-column
              prop=""
              label="计量方式"
              width="120"
            >
              <template slot-scope="scope">
                {{ scope.row.measureMethod === 2 ? '按重量(KG)' : '按体积(CBM)' }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="当前版本"
              min-width="150"
            >
              <template slot-scope="scope">
                {{ scope.row.startTime + '~' + scope.row.endTime }}
                <el-button
                  type="text"
                  size="medium"
                  @click="editRow(scope.row)"
                >
                  添加新版
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="关联服务"
              width="120"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="medium"
                  @click="editService(scope.row)"
                >
                  关联服务
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="操作日志"
              width="120"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="medium"
                  @click="editOperate(scope.row)"
                >
                  操作日志
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="150"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="medium"
                  @click="viewRow(scope.row)"
                >
                  查看
                </el-button>
                <el-button
                  type="text"
                  size="medium"
                  @click="deleteRow(scope.row)"
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
            @current-change="handleCurrentChange"
          />

          <el-dialog
            :title="title"
            :visible.sync="isDialogFormShow"
            :close-on-click-modal="false"
            width="1050px"
            @close="cancel"
          >
            <div
              v-loading="dialogLoading"
              style="max-height: 500px;overflow-y: auto;"
            >
              <el-form
                ref="editForm"
                :model="form"
                :rules="formRules"
                label-width="100px"
                label-position="right"
                size="small"
              >
                <div v-if="custType === '0'">
                  <el-form-item
                    prop="custId"
                    label="所属公司"
                    style="width: 30%;"
                  >
                    <el-select
                      v-model="form.custId"
                      :loading="selectLoading"
                      size="small"
                      style="width:100%;"
                      placeholder="请选择"
                      filterable
                      clearable
                      @change="onCompany"
                    >
                      <el-option
                        v-for="item in companyList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </div>
                <el-form-item
                  prop="name"
                  label="配置名称"
                  style="width: 30%;"
                >
                  <el-input
                    v-model="form.name"
                    :disabled="isEdit"
                    autocomplete="off"
                    style="width: 100%"
                    placeholder="请输入"
                    :maxlength="20"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
                <el-form-item
                  prop="measureMethod"
                  label="计量方式"
                >
                  <el-select
                    v-model="form.measureMethod"
                    :disabled="isEdit"
                    placeholder="请选择"
                    style="width: 100%"
                    filterable
                    clearable
                  >
                    <el-option
                      label="按重量(KG)"
                      :value="2"
                    />
                    <el-option
                      label="按体积(CBM)"
                      :value="3"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  prop="applyTime"
                  label="有效期"
                  style="width: 40%;"
                >
                  <el-date-picker
                    v-model="form.applyTime"
                    :picker-options="pickerOptions"
                    type="daterange"
                    size="small"
                    style="width:100%;"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                  />
                </el-form-item>
                <div style="display: flex;flex-wrap: row nowrap;padding-left: 20px;">
                  <div style="flex: 1 1 40%;">
                    <div style="padding-bottom: 10px;">
                      <i class="tips-circle" />
                      团队佣金 = 团队总货量 *&nbsp;单位提成 *&nbsp;
                      <el-input-number
                        v-model="form.team"
                        size="small"
                        class="input-number-valiate"
                        :controls="false"
                        placeholder="比例"
                        :min="0"
                        :max="9999"
                        :precision="2"
                      />%
                    </div>
                    <div style="padding-bottom: 10px;">
                      <i class="tips-circle" />
                      直客提成 =（直客成交价 - 同行卖价）* 货量 *&nbsp;
                      <el-input-number
                        v-model="form.customer"
                        size="small"
                        class="input-number-valiate"
                        :controls="false"
                        placeholder="比例"
                        :min="0"
                        :max="9999"
                        :precision="2"
                      />%
                    </div>
                    <div style="padding-bottom: 10px;">
                      <i class="tips-circle" />
                      同行提成 =&nbsp;单位提成 * 货量
                    </div>
                  </div>
                  <div style="flex: 1 1 50%;">
                    <div style="padding-bottom: 10px;">
                      <i class="tips-circle" />
                      同行超收提成 =（成交单价 - 同行报价）* 货量 *&nbsp;
                      <el-input-number
                        v-model="form.colleagues"
                        size="small"
                        class="input-number-valiate"
                        :controls="false"
                        placeholder="比例"
                        :min="0"
                        :max="9999"
                        :precision="2"
                      />% + 理论提成
                    </div>
                    <div style="padding-bottom: 10px;">
                      <i class="tips-circle" />
                      代管客户佣金 = 理论佣金 *&nbsp;
                      <el-input-number
                        v-model="form.escrowCustomer"
                        size="small"
                        class="input-number-valiate"
                        :controls="false"
                        placeholder="比例"
                        :min="0"
                        :max="9999"
                        :precision="2"
                      />%
                    </div>
                    <div style="padding-bottom: 10px;">
                      <i class="tips-circle" />
                      编外业务员提成 = 佣金 *&nbsp;
                      <el-input-number
                        v-model="form.informal"
                        size="small"
                        class="input-number-valiate"
                        :controls="false"
                        placeholder="比例"
                        :min="0"
                        :max="9999"
                        :precision="2"
                      />%
                    </div>
                  </div>
                </div>
                <div style="border-top: 1px solid #DBDFE5;padding-bottom: 10px;" />
                <el-form-item
                  label="区间&提成"
                  prop="extentVoList"
                  label-width="110px"
                  style="width: 100%;"
                  class="is-required"
                >
                  <div
                    v-for="(item, index) in form.extentVoList"
                    :key="index"
                    class="item-after-icon"
                  >
                    <el-input-number
                      v-model="form.extentVoList[index].min"
                      class="input-number-valiate"
                      :controls="false"
                      placeholder="输入下限"
                      :min="0"
                      :max="999999"
                      :step="1"
                      step-strictly
                    />
                    <el-input-number
                      v-model="form.extentVoList[index].max"
                      class="input-number-valiate"
                      :controls="false"
                      placeholder="输入上限"
                      :min="0"
                      :max="999999"
                      :step="1"
                      step-strictly
                    />
                    <el-input-number
                      v-model="form.extentVoList[index].unitPrice"
                      class="input-number-valiate"
                      :controls="false"
                      placeholder="单位提成"
                      :min="0"
                      :max="999999"
                      :precision="2"
                    />
                    <span>
                      <i
                        v-if="index===0"
                        class="el-icon-circle-plus-outline item-icon-plus"
                        @click="addRangeData"
                      />
                      <i
                        v-else
                        class="el-icon-remove-outline item-icon-reduce"
                        @click="deleteRangeData(index)"
                      />
                    </span>
                  </div>
                </el-form-item>
              </el-form>
            </div>
            <div
              slot="footer"
            >
              <el-button
                size="small"
                @click="cancel"
              >
                取 消
              </el-button>
              <el-button
                :loading="dialogLoading"
                size="small"
                type="primary"
                @click="confirm"
              >
                确 定
              </el-button>
            </div>
          </el-dialog>

          <el-dialog
            title="查看配置"
            :visible.sync="isViewVisible"
            :close-on-click-modal="false"
            width="800px"
            @close="offVersion"
          >
            <div
              v-loading="dialogLoading"
              style="max-height: 500px;overflow-y: auto;"
            >
              <div style="text-align:right;padding-bottom: 10px;">
                <el-select
                  v-model="versionId"
                  size="small"
                  style="width: 320px;"
                  placeholder="版本"
                  filterable
                  @change="onVersion"
                >
                  <el-option
                    v-for="item in versionList"
                    :key="item.id"
                    :label="`${item.start_time}~${item.end_time}`"
                    :value="item.id"
                  />
                </el-select>
              </div>
              <div style="display: flex;flex-wrap: row nowrap;">
                <div style="flex: 1 1 55%;">
                  <div style="padding-bottom: 10px;color: #909399;">
                    配置名称：{{ form.name }}
                  </div>
                  <div style="padding-bottom: 10px;color: #909399;">
                    计量方式：{{ form.measureMethod === 2 ? '按重量(KG)' : '按体积(CBM)' }}
                  </div>
                  <div style="padding-bottom: 10px;color: #909399;">
                    有效期：{{ form.startTime + '~' + form.endTime }}
                  </div>
                  <div style="padding-bottom: 10px;">
                    <i class="tips-circle" />
                    团队佣金 = 团队总货量 *&nbsp;单位提成 *&nbsp;{{ form.team }}%
                  </div>
                  <div style="padding-bottom: 10px;">
                    <i class="tips-circle" />
                    直客提成 =（直客成交价 - 同行卖价）* 货量 *&nbsp;{{ form.customer }}%
                  </div>
                  <div style="padding-bottom: 10px;">
                    <i class="tips-circle" />
                    同行提成 =&nbsp;单位提成 * 货量
                  </div>
                  <div style="padding-bottom: 10px;">
                    <i class="tips-circle" />
                    同行超收提成 =（成交单价 - 同行报价）* 货量 *&nbsp;{{ form.colleagues }}% + 理论提成
                  </div>
                  <div style="padding-bottom: 10px;">
                    <i class="tips-circle" />
                    代管客户佣金 = 理论佣金 *&nbsp;{{ form.escrowCustomer }}%
                  </div>
                  <div style="padding-bottom: 10px;">
                    <i class="tips-circle" />
                    编外业务员提成 = 佣金 *&nbsp;{{ form.informal }}%
                  </div>
                </div>
                <div style="flex: 1 1 35%;margin-left: 20px;">
                  <div style="background-color: #F2F3F5;padding: 20px;color: #909399;">
                    <el-row>
                      <el-col :span="14">
                        区间
                      </el-col>
                      <el-col :span="10">
                        单位提成
                      </el-col>
                    </el-row>
                    <el-row
                      v-for="(item, index) in form.extentVoList"
                      :key="index"
                      style="padding-top: 10px;"
                    >
                      <el-col :span="14">
                        {{ form.extentVoList[index].min + '-' + form.extentVoList[index].max }}
                        {{ form.measureMethod === 2 ? 'KG' : 'CBM' }}
                      </el-col>
                      <el-col :span="10">
                        {{ form.extentVoList[index].unitPrice }}
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </div>
              <div style="padding: 10px 10px 20px;text-align:right;">
                <el-button
                  type="primary"
                  size="small"
                  @click="offVersion"
                >
                  确 定
                </el-button>
              </div>
            </div>
          </el-dialog>

          <el-dialog
            title="操作日志"
            :visible.sync="isOperateVisible"
            :close-on-click-modal="false"
            width="800px"
            @close="closed"
          >
            <div
              v-loading="dialogLoading"
            >
              <el-table
                :data="operateList"
                height="450px"
                style="width: 100%;margin: 10px 0;"
                border
              >
                <el-table-column
                  label="日期"
                  prop="createTime"
                  width="180"
                />
                <el-table-column
                  label="操作人"
                  prop="userName"
                />
                <el-table-column
                  label="日志"
                  prop="logs"
                  min-width="300"
                  show-overflow-tooltip
                />
              </el-table>
              <el-pagination
                :current-page.sync="pageR"
                :page-size="size"
                layout="total, prev, pager, next"
                :total="totalR"
                style="text-align: right;"
                @current-change="handleOperateChange"
              />
              <div style="padding: 10px 10px 20px;text-align:right;">
                <el-button
                  type="primary"
                  size="small"
                  @click="closed"
                >
                  确 定
                </el-button>
              </div>
            </div>
          </el-dialog>

          <el-dialog
            title="关联服务"
            :visible.sync="isServiceVisible"
            :close-on-click-modal="false"
            append-to-body
            width="960px"
            @close="abolish"
          >
            <div v-loading="dialogLoading">
              <div style="margin-bottom: 10px">
                <span>业务类型：</span>
                <el-radio-group
                  v-model="serviceForm.subtypeId"
                  size="small"
                  @change="typeChange"
                >
                  <el-radio-button
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.id"
                  >
                    {{ item.name }}
                  </el-radio-button>
                </el-radio-group>
              </div>
              <el-transfer
                v-model="serviceForm.serviceIds"
                filterable
                :filter-method="filterMethod"
                :titles="['选择关联服务', '已关联服务']"
                :props="{key: 'id', label: 'name'}"
                filter-placeholder="输入搜索"
                :data="serviceList"
                style="height: 500px;"
                @change="onTransfer"
              />
              <div
                slot="footer"
                style="text-align: right;margin: 20px 40px 0;"
              >
                <el-button
                  size="small"
                  @click="abolish"
                >
                  取 消
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="submit"
                >
                  确 定
                </el-button>
              </div>
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
  getServiceSubtypeList,
  getCommissionVersion,
  getAgentList,
  getService,
  getLscSimpleList,
  getCountryList,
  getCommissionList,
  saveCommission,
  getCommissionItems,
  deleteCommission,
  getServiceItems,
  getOperateItems,
  saveService
} from '@/api/sales-of-commission-config'
import dayjs from 'dayjs'

function paramsForm() {
  return {
    cid: undefined,
    colleagues: 0,
    createTime: undefined,
    custId: undefined,
    custName: undefined,
    customer: 0,
    endTime: undefined,
    escrowCustomer: 0,
    id: undefined,
    informal: 0,
    measureMethod: undefined,
    name: undefined,
    startTime: undefined,
    team: 0,
    applyTime: [],
    extentVoList: [{
      min: undefined,
      max: undefined,
      unitPrice: undefined
    }]
  }
}

@Component({
  name: 'Port',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private dialogLoading: boolean = false
  private isDialogFormShow: boolean = false
  private isOperateVisible: boolean = false
  private isServiceVisible: boolean = false
  private isViewVisible: boolean = false
  private selectLoading: boolean = false
  private isEdit: boolean = false
  private tableData: any[] = []
  private selectValue: any = {
    subtypeId: undefined,
    countryId: undefined,
    lscId: undefined
  }
  private form: any = paramsForm()
  private formRules = {
    name: [
      { required: true, message: '配置名称不能为空', trigger: 'blur' }
    ],
    custId: { required: true, message: '请选择所属公司', trigger: 'change' },
    measureMethod: { required: true, message: '请选择计量方式', trigger: 'change' },
    applyTime: { required: true, message: '请选择有效期', trigger: 'change' }
  }
  private selectForm: any = {}
  private serviceForm: any = {
    subtypeId: undefined,
    serviceIds: []
  }
  private title: any = ''
  private currentId: any = ''
  private versionId: any = ''
  private stId: any = ''
  private stOption: any[] = []
  private countryList: any[] = []
  private companyList: any[] = []
  private versionList: any[] = []
  private typeList: any[] = []
  private privatelineList: any[] = []
  private serviceList: any[] = []
  private operateList: any[] = []
  private page: number = 1
  private size: number = 10
  private total: any = 0
  private pageR: number = 1
  private totalR: number = 0

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
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }
  get custName(): string {
    const info = UserModule.info || {}
    const custName = (info as any).custName
    return custName
  }
  get pickerOptions() {
    return {
      disabledDate(time: any) {
        return time.getTime() < Date.now()
      }
    }
  }

  /* methods */
  private filterMethod(query: any, item: any): boolean {
    const name = item.name || ''
    return name.indexOf(query) > -1
  }
  private getCompanyList() {
    this.selectLoading = true
    const params = {
      page: 1,
      size: 9999,
      parentId: (this as any).custId
    }
    getAgentList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.companyList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private onCompany(val: any) {
    this.form.custName = ''
    const item = this.companyList.find((it: any) => it.id === val)
    if (item) {
      this.form.custName = item.name
    }
  }
  private async getSubtypeList() {
    this.selectLoading = true
    const params:any = {
      typeId: '05'
    }
    await getServiceSubtypeList(params)
      .then((res: any) => {
        const data = res.data || []
        this.typeList = data
        this.selectLoading = false
      }).catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private getCountryData() {
    this.selectLoading = true
    getCountryList()
      .then((res: any) => {
        const data = res.data || {}
        this.countryList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private getPrivatelineList() {
    this.selectLoading = true
    const params: any = {
      subtypeId: this.selectValue.subtypeId,
      countryId: this.selectValue.countryId
    }
    getLscSimpleList(params)
      .then((res: any) => {
        const data = res.data || []
        this.privatelineList = data
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private async typeChange() {
    this.serviceForm.serviceIds = []
    try {
      this.dialogLoading = true
      const resS = await getService({
        measureMethod: this.serviceForm.measureMethod,
        subtypeId: this.serviceForm.subtypeId
      })
      this.serviceList = resS.data || []
      if (this.stId === this.serviceForm.subtypeId) {
        this.serviceForm.serviceIds = this.stOption
      }
      this.onTransfer()
      this.dialogLoading = false
    } catch (error) {
      this.dialogLoading = false
      return error
    }
  }
  private onTransfer() {
    const { serviceIds } = this.serviceForm
    this.serviceList = this.serviceList.map((it: any) => {
      return {
        ...it,
        disabled: it.tag === '1' && !this.stOption.some((s: any) => it.id === s)
      }
    })
  }
  private async editService(row: any) {
    this.isServiceVisible = true
    this.currentId = row.cid
    this.serviceForm.measureMethod = row.measureMethod
    try {
      this.dialogLoading = true
      const resT = await getServiceSubtypeList({ typeId: '05' })
      this.typeList = resT.data || []

      const resC = await getServiceItems({ cid: row.cid })
      const arr = (resC.data || []).map((it: any) => it.lscId)
      if (arr.length > 0) {
        this.stId = resC.data[0].subtype
        this.serviceForm.subtypeId = resC.data[0].subtype
      } else {
        this.serviceForm.subtypeId = (this.typeList[0] || {}).id || ''
      }
      this.stOption = JSON.parse(JSON.stringify(arr))
      this.serviceForm.serviceIds = arr

      const resS = await getService({
        measureMethod: this.serviceForm.measureMethod,
        subtypeId: this.serviceForm.subtypeId
      })
      this.serviceList = resS.data || []
      this.onTransfer()
      this.dialogLoading = false
    } catch (error) {
      this.dialogLoading = false
      return error
    }
  }
  private abolish() {
    this.isServiceVisible = false
    this.stId = ''
    this.stOption = []
    this.serviceForm = {
      subtypeId: undefined,
      serviceIds: []
    }
  }
  private submit() {
    this.dialogLoading = true
    const arr = this.serviceForm.serviceIds.map((it: any) => {
      const item = this.serviceList.find((s: any) => s.id === it)
      if (item) {
        return {
          lscId: item.id,
          lscName: item.name,
          subtype: this.serviceForm.subtypeId,
          cid: this.currentId
        }
      }
    })
    saveService({
      id: this.currentId,
      list: arr
    })
      .then((res: any) => {
        this.dialogLoading = false
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.abolish()
        this.queryAll()
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }

  private editOperate(row: any) {
    this.isOperateVisible = true
    this.currentId = row.cid
    this.getOperateData()
  }
  private getOperateData() {
    this.dialogLoading = true
    const params: any = {
      model: this.currentId,
      page: this.pageR,
      size: this.size
    }
    getOperateItems(params)
      .then((res: any) => {
        this.dialogLoading = false
        const data = res.data || {}
        this.operateList = data.result || []
        this.totalR = data.total
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }
  private handleOperateChange(val: string) {
    this.pageR = Number(val)
    this.getOperateData()
  }

  private closed() {
    this.isOperateVisible = false
    this.operateList = []
  }

  private addRow(): void {
    this.title = '新增配置'
    this.isEdit = false
    const type = (this as any).custType
    if (type === '0') {
      this.getCompanyList()
    }
    this.isDialogFormShow = true
  }
  private async viewRow(row: any) {
    this.isViewVisible = true
    this.currentId = row.cid
    this.versionId = row.id
    try {
      this.dialogLoading = true
      const res = await getCommissionVersion({ id: this.versionId })
      const data = res.data || []
      this.versionList = data
    } catch (error) {
      this.dialogLoading = false
      return error
    }
    this.getCommissionById()
  }
  private onVersion() {
    this.getCommissionById()
  }
  private offVersion() {
    this.isViewVisible = false
    this.versionId = ''
    this.form = paramsForm()
  }
  private editRow(row: any): void {
    this.isDialogFormShow = true
    this.title = '添加新版'
    this.isEdit = true
    const type = (this as any).custType
    if (type === '0') {
      this.getCompanyList()
    }
    this.currentId = row.cid
    this.versionId = row.id
    this.getCommissionById()
  }

  private getCommissionById() {
    this.dialogLoading = true
    getCommissionItems({
      id: this.versionId
    })
      .then((res: any) => {
        const data = res.data || {}
        const { extentVoList, endTime, startTime, ...form } = data

        if (extentVoList.length <= 0) {
          this.form = {
            ...form,
            endTime,
            startTime,
            applyTime: startTime && endTime ? [dayjs(startTime).format('YYYY-MM-DD'), dayjs(endTime).format('YYYY-MM-DD')] : [],
            extentVoList: [{
              min: undefined,
              max: undefined,
              unitPrice: undefined
            }]
          }
        } else {
          const arr = extentVoList.map((it: any) => {
            const { min, max, unitPrice, ...obj } = it
            return {
              ...obj,
              unitPrice: unitPrice >= 0 ? unitPrice : undefined,
              min: min >= 0 ? min : undefined,
              max: max >= 0 ? max : undefined
            }
          })
          this.form = {
            ...form,
            endTime,
            startTime,
            applyTime: startTime && endTime ? [dayjs(startTime).format('YYYY-MM-DD'), dayjs(endTime).format('YYYY-MM-DD')] : [],
            extentVoList: arr
          }
        }
        this.dialogLoading = false
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }
  private deleteRow(row: any) {
    const params = {
      cid: row.cid
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteCommission(params)
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

  private confirm(): void {
    (this.$refs.editForm as any).validate((valid: any) => {
      if (!valid) return false
      const { extentVoList, applyTime, id, effect, delFlag, createTime, startTime, endTime, ...form } = this.form
      const isValue = Array.isArray(extentVoList) && extentVoList.every((it: any) => it.min >= 0 && it.max && it.unitPrice)
      if (!isValue) {
        this.$message.error('请填写完整区间&提成')
        return
      }
      const isMinMax = extentVoList.some((item:any) => {
        return item.max <= item.min
      })
      if (isMinMax) {
        this.$message({
          type: 'error',
          message: '下限值不能大于等于上限值'
        })
        return
      }
      let mixVal = false
      extentVoList.map((it: any, index: any) => {
        mixVal = extentVoList.some((r: any, i: any) => {
          if (index !== i) {
            return (r.min <= it.min && it.min < r.max) || (r.min < it.max && it.max <= r.max)
          } else {
            return false
          }
        })
      })
      if (mixVal) {
        this.$message({
          type: 'error',
          message: '区间范围不能重叠'
        })
        return
      }
      let flag = false
      for (let i = 0; i < extentVoList.length; i++) {
        if (i > 0) {
          const next = extentVoList[i]
          const item = extentVoList[i - 1]
          if (next.min !== item.max) {
            flag = true
            break
          }
        }
      }
      if (flag) {
        this.$message({
          type: 'error',
          message: '区间范围必须连续'
        })
        return
      }
      this.dialogLoading = true
      const type = (this as any).custType
      const params: any = {
        ...form,
        custId: type === '0' ? this.form.custId : (this as any).custId,
        custName: type === '0' ? this.form.custName : (this as any).custName,
        startTime: applyTime.length > 0 ? applyTime[0] + ' 00:00:00' : '',
        endTime: applyTime.length > 1 ? applyTime[1] + ' 23:59:59' : '',
        extentVoList
      }
      saveCommission(params)
        .then((res: any) => {
          this.dialogLoading = false
          this.cancel()
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.queryAll()
        })
        .catch((err: any) => {
          this.dialogLoading = false
          return err
        })
    })
  }
  private addRangeData() {
    this.form.extentVoList.push({
      min: undefined,
      max: undefined,
      unitPrice: undefined
    })
  }
  private deleteRangeData(index: number) {
    this.form.extentVoList.splice(index, 1)
  }
  private cancel(): void {
    this.isDialogFormShow = false
    this.reset()
  }
  private reset(): void {
    this.title = ''
    this.form = paramsForm()
    this.clearValidate()
  }
  private clearValidate() {
    this.$nextTick(() => {
      const editForm: any = this.$refs.editForm
      editForm.clearValidate()
    })
  }

  private queryAll(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const params: any = {
      model: {
        ...this.selectValue,
        countryId: undefined
      },
      page: this.page,
      size: this.size
    }
    getCommissionList(params)
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

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.queryAll()
  }
  private created(): void {
    this.queryAll()
  }
}
</script>

<style lang="scss" scoped>
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
    padding: 0 20px 20px;
  }

.item-after-icon {
  position: relative;
  padding-bottom: 15px;
  .item-icon-plus {
    position: absolute;
    top: 6px;
    color:#409eff;
    font-size:18px;
    margin-left:10px;
    cursor:pointer;
  }
  .item-icon-reduce {
    position: absolute;
    top: 6px;
    color:#f56c6c;
    font-size:18px;
    margin-left:10px;
    cursor:pointer;
  }
}
.input-number-valiate {
  width: 100px;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
.el-form-item {
  width: 27%;
  display: inline-block;
}
.tips-circle {
  display: inline-block;
  border-radius: 50%;
  background-color: #409EFF;
  line-height: 32px;
  margin-right: 5px;
  width: 6px;
  height: 6px;
  opacity: 0.6;
}
</style>
