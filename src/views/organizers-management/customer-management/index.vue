<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info-with-back
          info=""
          title="客户管理"
          :show-back="isMoreInfoShow"
          @goback="goBack"
        />
        <div
          v-show="!isMoreInfoShow"
          class="app-panel"
        >
          <el-row
            type="flex"
            justify="end"
          >
            <el-col :span="4">
              <el-button
                v-permission="['customerClientAdd']"
                type="text"
                style="margin-left: 10px"
                @click="handleAdd"
              >
                新增客户
              </el-button>
              <el-button
                v-permission="['customerClientExport']"
                type="text"
                style="margin-left: 10px"
                @click="showExportModal"
              >
                批量导入
              </el-button>
            </el-col>
            <el-col
              :span="20"
              style="text-align:right;"
            >
              <el-select
                v-if="custType === '0'"
                v-model="selectValue.parentId"
                :loading="selectLoading"
                size="small"
                filterable
                clearable
                placeholder="一级代理商"
                style="width:130px;margin-right:5px;"
                @focus="getAgentList('1')"
                @change="onParent"
              >
                <el-option
                  v-for="item in agentList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-if="custType === '0'"
                v-model="selectValue.agentId"
                :disabled="!selectValue.parentId"
                :loading="selectLoading"
                size="small"
                clearable
                filterable
                placeholder="二级代理商"
                style="width:130px;margin-right:5px;"
                @focus="getAgentList('2')"
                @change="onAgent"
              >
                <el-option
                  v-for="item in agent2List"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-if="custType === '2' && custSubtype === '1'"
                v-model="selectValue.custTag"
                size="small"
                style="width:100px;margin-right:5px;"
                placeholder="公司类型"
                @change="onComType"
              >
                <el-option
                  v-for="(item, index) in companyTypeList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-if="custType === '2' && custSubtype === '1' && selectValue.custTag === '2'"
                v-model="selectValue.comId"
                :loading="selectLoading"
                size="small"
                style="width:130px;margin-right:5px;"
                placeholder="所属公司"
                filterable
                clearable
                @change="onCompany"
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
                v-model="selectValue.subtype"
                placeholder="客户类型"
                style="width:100px;margin-right:5px;"
                clearable
                size="small"
              >
                <el-option
                  v-for="item in subtypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>

              <el-select
                v-model="selectValue.countryId"
                :loading="selectLoading"
                placeholder="国家/地区"
                style="width:130px;margin-right:5px;"
                clearable
                size="small"
                filterable
                @focus="getCountryList"
                @change="onCountryChange"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
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
                @focus="getStateList"
                @change="onStateChange"
              >
                <el-option
                  v-for="item in stateList"
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
                @focus="getCityList"
                @change="onCityChange"
              >
                <el-option
                  v-for="item in cityList"
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
                @focus="getCountyList"
              >
                <el-option
                  v-for="item in countyList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select> -->

              <el-select
                v-model="selectValue.status"
                placeholder="状态"
                clearable
                style="width:100px;margin-right:5px;"
                size="small"
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>

              <el-select
                v-model="selectValue.audit"
                placeholder="审核状态"
                clearable
                style="width:100px;margin-right:5px;"
                size="small"
              >
                <el-option
                  v-for="item in auditList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.signContract"
                placeholder="签署合同"
                clearable
                style="width:100px;margin-right:5px;"
                size="small"
              >
                <el-option
                  v-for="item in signList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-input
                v-model="selectValue.name"
                size="small"
                clearable
                style="width:180px;margin-right:10px;"
                placeholder="公司名称"
              />

              <el-button
                v-permission="['customerClientQuery']"
                type="primary"
                size="small"
                @click="getTableList(1)"
              >
                查询
              </el-button>
            </el-col>
          </el-row>

          <el-table
            v-loading="loading"
            height="calc(100vh - 330px)"
            style="width: 100%;margin: 10px 0;"
            border
            :data="list"
          >
            <el-table-column
              label="公司名称"
              min-width="200"
              prop="name"
            />
            <el-table-column
              label="签署合同"
              width="120"
            >
              <div
                slot-scope="scope"
                style="display: flex;align-items: center"
              >
                <span
                  style="font-size: 30px;margin-right: 5px"
                >
                  <strong>
                    <span
                      v-if="!scope.row.signContract || scope.row.signContract === '0'"
                      style="color: #ccc;"
                    >
                      ·
                    </span>
                    <span
                      v-if="scope.row.signContract === '1'"
                      style="color: #4cd964;"
                    >
                      ·
                    </span>
                    <span
                      v-if="scope.row.signContract === '2'"
                      style="color: #ff3b30;"
                    >
                      ·
                    </span>
                  </strong>
                </span>
                <el-button
                  :disabled="scope.row.audit !== '1'"
                  type="text"
                  @click="onSignContract(scope.row)"
                >
                  {{ (signList.find((it) => it.id === scope.row.signContract) || {}).name }}
                </el-button>
              </div>
            </el-table-column>

            <el-table-column
              label="公司类型"
              width="100"
            >
              <template slot-scope="scope">
                {{ (subtypeList.find((it) => it.id === scope.row.subtype) || {}).name }}
              </template>
            </el-table-column>

            <el-table-column
              label="主体类型"
              width="100"
            >
              <template slot-scope="scope">
                {{ entityList[scope.row.entity] }}
              </template>
            </el-table-column>

            <el-table-column
              label="国家/地区"
              width="180"
              prop="countryName"
              show-overflow-tooltip
            />

            <el-table-column
              label="州省市区"
              width="250"
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
              label="所属上级"
              width="250"
              prop="parentName"
              show-overflow-tooltip
            />

            <el-table-column
              label="关联人员"
              width="100"
            >
              <template slot-scope="scope">
                <span
                  v-if="$checkPermission(['associatedPersonnel'])"
                  style="color: #1890ff;cursor: pointer;"
                  @click="onPersonal(scope.row)"
                >关联人员</span>
                <span
                  v-else
                >关联人员</span>
              </template>
            </el-table-column>

            <el-table-column
              label="添加时间"
              width="160"
              prop="createTime"
            />

            <el-table-column
              label="审核状态"
              width="100"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.audit === '0'">待审核</span>
                <span v-else-if="scope.row.audit === '1'">审核通过</span>
                <span v-else-if="scope.row.audit === '2'">审核拒绝</span>
              </template>
            </el-table-column>

            <el-table-column
              label="状态"
              width="100"
            >
              <template slot-scope="scope">
                <el-switch
                  :disabled="!$checkPermission(['customerClientEnable'])"
                  class="switchStyle"
                  active-text="启用"
                  inactive-text="禁用"
                  active-value="1"
                  inactive-value="0"
                  :value="scope.row.status"
                  @input="(value) => onSwitch(scope.row, value)"
                />
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
              width="240"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="$checkPermission(['customerClientGet'])"
                  type="text"
                  size="medium"
                  @click="viewTableItem(scope.row)"
                >
                  查看
                </el-button>
                <el-button
                  v-if="$checkPermission(['customerClientUpdate'])"
                  type="text"
                  size="medium"
                  @click="editTableItem(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-if="selectValue.custTag === '2' && custId === '280b587801744450a6b5aa3155c25e61'"
                  type="text"
                  size="medium"
                  @click="editCompany(scope.row)"
                >
                  修改归属
                </el-button>
                <el-button
                  v-if="scope.row.audit !== '1' && $checkPermission(['customerClientReview'])"
                  type="text"
                  size="medium"
                  @click="checkTableItem(scope.row)"
                >
                  审核
                </el-button>
                <el-button
                  v-if="scope.row.audit !== '1' && $checkPermission(['customerClientDel'])"
                  type="text"
                  size="medium"
                  @click="deleteTableItem(scope.row)"
                >
                  删除
                </el-button>
                <el-button
                  v-permission="['customerClientMore']"
                  type="text"
                  size="medium"
                  @click="handleTableMore(scope.row)"
                >
                  更多
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            layout="total, prev, pager, next"
            style="text-align: right;"
            :current-page.sync="page"
            :page-size="size"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />

          <el-dialog
            :title="isEdit ? '编辑客户' : '新增客户'"
            width="1200px"
            :visible.sync="dialogEditShow"
            :close-on-click-modal="false"
            class="customer-dialog"
            @closed="clearForm"
          >
            <addEditForm
              ref="addEditForm"
              :is-edit="isEdit"
              :subtype-list="subtypeList"
              :company-type-list="companyTypeList"
              @close="dialogEditShow = false"
              @getTableList="getTableList"
            />
          </el-dialog>
          <el-dialog
            title="查看客户"
            width="1200px"
            :visible.sync="dialogViewShow"
            :close-on-click-modal="false"
            @closed="closeForm"
          >
            <viewForm
              ref="viewForm"
              :subtype-list="subtypeList"
              :company-type-list="companyTypeList"
              :sign-list="signList"
              @close="dialogViewShow = false"
            />
          </el-dialog>
          <el-dialog
            title="关联人员"
            width="600px"
            :visible.sync="dialogPersonalShow"
            :close-on-click-modal="false"
            @closed="dialogPersonalShow = false"
          >
            <personalForm
              ref="personalForm"
              :sc-type="scType2"
              @close="dialogPersonalShow = false"
              @getTableList="getTableList"
            />
          </el-dialog>
          <el-dialog
            title="审核"
            width="1000px"
            :visible.sync="dialogCheckShow"
            :close-on-click-modal="false"
            @closed="dialogCheckShow = false"
          >
            <checkForm
              ref="checkForm"
              @close="dialogCheckShow = false"
              @getTableList="getTableList"
            />
          </el-dialog>
          <el-dialog
            title="修改所属公司"
            width="500px"
            :visible.sync="dialogCompanyShow"
            :close-on-click-modal="false"
            @closed="clearCompany"
          >
            <div v-loading="companyLoading">
              <el-form
                ref="companyForm"
                :model="companyForm"
                :rules="companyRules"
                label-width="100px"
                style="padding: 10px 20px 0 0;"
                size="small"
              >
                <el-form-item
                  label="所属上级"
                  prop="custName"
                >
                  {{ companyForm.custName }}
                </el-form-item>
                <el-form-item
                  label="新公司"
                  prop="parentId"
                >
                  <el-select
                    v-model="companyForm.parentId"
                    :loading="selectLoading"
                    size="small"
                    style="width:100%;"
                    placeholder="请选择"
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
                </el-form-item>
              </el-form>

              <div style="text-align: right;margin-top: 10px;">
                <el-button
                  type="primary"
                  size="small"
                  @click="clearCompany"
                >
                  取 消
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="confirmCompany"
                >
                  确 定
                </el-button>
              </div>
            </div>
          </el-dialog>
        </div>
        <attach-info
          v-show="isMoreInfoShow"
          ref="attachInfo"
          :current-cust-id="currentCustId"
          :current-cust-type="currentCustType"
        />
      </div>
    </div>
    <el-dialog
      title="批量导入"
      width="500px"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @closed="cancelExport"
    >
      <div v-loading="exportLoading">
        <p>下载模板导入客户信息</p>
        <p
          v-if="exportCustomerErrorList.length"
          style="color: red"
        >
          {{ '导入失败' + exportCustomerErrorList.length + '条：' + exportCustomerErrorList.join('，') }}
        </p>
        <div style="display: flex;justify-content: flex-end">
          <el-button
            size="small"
            style="margin-right: 10px"
            @click="downloadFile"
          >
            模板下载
          </el-button>
          <el-upload
            action
            :multiple="false"
            :show-file-list="false"
            :http-request="uploadFile"
          >
            <el-button
              size="small"
              type="primary"
            >
              导入excel
            </el-button>
          </el-upload>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="修改合同状态"
      width="600px"
      :visible.sync="dialogSignShow"
      :close-on-click-modal="false"
      @closed="clearSign"
    >
      <div v-loading="companyLoading">
        <el-form
          ref="signForm"
          :model="signForm"
          :rules="signRules"
          label-width="100px"
          style="padding: 10px 20px 0 0;"
          size="small"
        >
          <el-form-item
            label="签署合同"
            prop="status"
          >
            <el-radio-group
              v-model="signForm.status"
            >
              <el-radio label="0">
                未签署
              </el-radio>
              <el-radio label="1">
                已签署
              </el-radio>
              <el-radio label="2">
                已注销
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <div style="text-align: right;margin-top: 10px;">
          <el-button
            type="primary"
            size="small"
            @click="clearSign"
          >
            取 消
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="confirmSign"
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
import addEditForm from '@/views/organizers-management/customer-management/addEditForm.vue'
import viewForm from '@/views/organizers-management/customer-management/viewForm.vue'
import personalForm from '@/views/organizers-management/customer-management/personalForm.vue'
import checkForm from '@/views/organizers-management/customer-management/checkForm.vue'
import attachInfo from '@/views/organizers-management/common-setting/more/attachInfo.vue'
import HeadInfoWithBack from '@/components/head-info-with-back/index.vue'
import {
  getAgentList,
  getCountryList,
  getStateByCountry,
  getCityByState,
  getCountyByCity,
  changeStatus,
  getCustomerList as getTableList,
  deleteCustomer as deleteTableItem,
  exportCustomer,
  getUnFinanceAgentList,
  exportBelongCompany,
  getUpdateFileStatus
} from '@/api/jht-customer-management'

@Component({
  name: 'Customer',
  components: {
    addEditForm,
    viewForm,
    personalForm,
    checkForm,
    attachInfo,
    HeadInfoWithBack
  },
  props: {}
})
export default class extends Vue {
  private selectValue: any = {
    parentId: undefined,
    agentId: undefined,
    signContract: undefined,
    subtype: undefined,
    countryId: undefined,
    stateId: undefined,
    cityId: undefined,
    countyId: undefined,
    status: undefined,
    audit: undefined,
    custTag: '1',
    comId: undefined,
    name: undefined
  }

  private subtypeList = [
    {
      id: '0',
      name: '直客'
    },
    {
      id: '1',
      name: '同行'
    }
  ]
  private statusList = [
    {
      id: '0',
      name: '禁用'
    },
    {
      id: '1',
      name: '启用'
    }
  ]
  private auditList = [
    {
      id: '0',
      name: '待审核'
    },
    {
      id: '1',
      name: '审核通过'
    },
    {
      id: '2',
      name: '已拒绝'
    }
  ]
  private entityList = ['个人', '企业']
  private companyTypeList: any[] = [
    { id: '1', name: '本公司' },
    { id: '2', name: '分公司' }
  ]
  private signList: any[] = [
    { id: '0', name: '未签署' },
    { id: '1', name: '已签署' },
    { id: '2', name: '已注销' }
  ]
  private scType2: boolean = false
  private companyList: any = []
  private stateList: any[] = []
  private cityList: any[] = []
  private countyList: any[] = []
  private agentList: any[] = []
  private agent2List: any[] = []
  private countryList: any[] = []
  private list: any[] = []
  private companyForm: any = {
    parentId: undefined,
    custId: undefined
  }
  private companyRules: any = {
    parentId: [{ required: true, message: '请选择所属公司', trigger: 'change' }]
  }
  private signForm:any = {
    status: ''
  }
  private signRules: any = {
    status: [{ required: true, message: '请选择合同状态', trigger: 'change' }]
  }
  private loading: boolean = false
  private exportLoading: boolean = false
  private selectLoading: boolean = false
  private companyLoading: boolean = false
  private dialogEditShow: boolean = false
  private dialogViewShow: boolean = false
  private dialogPersonalShow: boolean = false
  private dialogCheckShow: boolean = false
  private dialogCompanyShow: boolean = false
  private dialogSignShow: boolean = false
  private visible: boolean = false
  private exportCustomerErrorList: any[] = []
  private isMoreInfoShow: boolean = false
  private currentCustId: any = ''
  private currentCustType: any = 'customer'
  private page: number = 1
  private size: number = 10
  private total: any = 0
  private isEdit: boolean = false

  // computed
  // 所属公司id
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
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }
  get custSubtype(): string {
    const info = UserModule.info || {}
    const custSubtype = (info as any).custSubtype
    return custSubtype
  }

  // methods
  private onComType() {
    // 仅一级代理商可操作
    this.list = []
    this.selectValue.comId = ''
    this.companyList = []
    this.getTableList()
  }
  private onCompany() {
    this.list = []
    this.getTableList()
  }
  private getCompanyList() {
    this.selectLoading = true
    getUnFinanceAgentList().then((res:any) => {
      const data = res.data || []
      this.companyList = data
      this.selectLoading = false
    }).catch((err:any) => {
      this.selectLoading = false
      return err
    })
  }
  // 获取代理商列表
  private showExportModal() {
    this.visible = true
    this.exportCustomerErrorList = []
  }
  private downloadFile() {
    const a = document.createElement('a')
    document.body.appendChild(a)
    // TODO 修改模板地址
    a.href = '/files/用户批量导入模板.xlsx'
    a.click()
    document.body.removeChild(a)
  }
  private uploadFile(data: any) {
    const file = data.file
    const paramsForm = new FormData()
    paramsForm.append('file', file)
    this.exportLoading = true
    exportCustomer(paramsForm).then((res: any) => {
      this.$message.success('操作成功')
      this.exportCustomerErrorList = res.data || []
      this.exportLoading = false
      if (this.exportCustomerErrorList.length === 0) {
        this.cancelExport()
      }
    }).catch((err: any) => {
      this.exportLoading = false
      return err
    })
  }
  private cancelExport() {
    this.visible = false
    this.getTableList(1)
  }
  private onParent() {
    this.list = []
    this.agent2List = []
    this.selectValue.agentId = undefined
    this.getTableList()
  }
  private onAgent() {
    this.list = []
    this.getTableList()
  }
  private async getAgentList(val: any) {
    this.selectLoading = true
    await getAgentList({
      page: 1,
      size: 999999,
      parentId: val === '1' ? (this as any).custId : this.selectValue.parentId
    })
      .then(res => {
        const data = res.data || {}
        const result = data.result || []
        if (val === '1') {
          this.agentList = result
        } else {
          this.agent2List = result
        }
        this.selectLoading = false
      })
      .catch(err => {
        this.selectLoading = false
        return err
      })
  }

  private getCountryList() {
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
  private async getStateList() {
    if (!this.selectValue.countryId) return
    this.selectLoading = true
    await getStateByCountry(this.selectValue.countryId).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      const result = data.result || []
      this.stateList = result
    }).catch(() => {
      this.stateList = []
      this.selectLoading = false
    })
  }
  private async getCityList() {
    if (!this.selectValue.stateId) return
    this.selectLoading = true
    await getCityByState(this.selectValue.stateId).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      const result = data.result || []
      this.cityList = result
    }).catch(() => {
      this.cityList = []
      this.selectLoading = false
    })
  }
  private async getCountyList() {
    if (!this.selectValue.cityId) return
    this.selectLoading = true
    await getCountyByCity(this.selectValue.cityId)
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result || []
        this.countyList = result
        this.selectLoading = false
      })
      .catch(() => {
        this.countyList = []
        this.selectLoading = false
      })
  }

  private async onCountryChange() {
    this.selectValue.stateId = ''
    this.onStateChange()
  }
  private onStateChange() {
    this.selectValue.cityId = ''
    this.onCityChange()
  }
  private onCityChange() {
    this.selectValue.countyId = ''
  }

  // 状态
  private onSwitch(row: any, value: any) {
    if (!row.status || row.status === value) {
      return
    }
    const params = {
      id: row.id,
      status: value
    }

    this.$confirm('请确认是否更改状态?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        changeStatus(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '更改成功'
            })
            this.getTableList()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }

  // 关联人员
  private onPersonal(row: any) {
    const type = (this as any).custType
    const stype = (this as any).custSubtype
    const ptype = row.parentSubtype
    if (type === '2' && (stype === '2' || (stype === '1' && this.selectValue.custTag === '2'))) {
      this.scType2 = true
    } else if (type === '0' && ptype === '2') {
      this.scType2 = true
    } else {
      this.scType2 = false
    }

    this.dialogPersonalShow = true
    this.$nextTick(() => {
      const root: any = this.$refs.personalForm
      root.setData(row)
    })
  }

  private clearForm() {
    this.dialogEditShow = false
    this.$nextTick(() => {
      const root: any = this.$refs.addEditForm
      root.resetForm()
    })
  }
  private closeForm() {
    this.dialogEditShow = false
    this.$nextTick(() => {
      const root: any = this.$refs.viewForm
      root.resetForm()
    })
  }
  private onSignContract(row: any) {
    this.dialogSignShow = true
    this.signForm.id = row.id
    this.signForm = {
      id: row.id,
      status: row.signContract || '0'
    }
  }
  private clearSign() {
    this.signForm = {
      status: ''
    }
    this.dialogSignShow = false
    this.$nextTick(() => {
      const root: any = this.$refs.signForm
      root.clearValidate()
    })
  }
  private confirmSign() {
    const editForm: any = this.$refs.signForm
    editForm.validate((valid: any) => {
      if (!valid) return false
      this.companyLoading = true
      const params: any = {
        ...this.signForm
      }
      getUpdateFileStatus(params)
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.clearSign()
          this.companyLoading = false
          this.getTableList()
        }).catch((err: any) => {
          this.companyLoading = false
          return err
        })
    })
  }

  // 新增
  private handleAdd() {
    this.dialogEditShow = true
    this.isEdit = false
  }
  // 编辑
  private async editTableItem(row: any) {
    this.dialogEditShow = true
    this.isEdit = true
    this.$nextTick(() => {
      const root: any = this.$refs.addEditForm
      root.setData(row)
    })
  }
  private editCompany(row: any) {
    this.companyForm.custId = row.id
    this.companyForm.custName = row.parentName
    this.dialogCompanyShow = true
  }
  private clearCompany() {
    this.dialogCompanyShow = false
    this.companyForm = {
      parentId: undefined,
      custId: undefined
    }
    const root: any = this.$refs.companyForm
    this.$nextTick(() => {
      root.clearValidate()
    })
  }
  private confirmCompany() {
    const editForm: any = this.$refs.companyForm
    editForm.validate((valid: any) => {
      if (!valid) return false
      this.companyLoading = true
      const { custName, ...form } = this.companyForm
      const params: any = {
        ...form
      }
      this.companyList.map((it: any) => {
        if (it.id === params.parentId) {
          params.parentName = it.name
        }
      })
      exportBelongCompany(params)
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.clearCompany()
          this.companyLoading = false
          this.getTableList()
        }).catch((err: any) => {
          this.companyLoading = false
          return err
        })
    })
  }
  private async viewTableItem(row: any) {
    this.dialogViewShow = true
    this.$nextTick(() => {
      const root: any = this.$refs.viewForm
      root.setData(row)
    })
  }
  // 审核
  private checkTableItem(row: any) {
    this.dialogCheckShow = true
    this.$nextTick(() => {
      const root: any = this.$refs.checkForm
      root.setData(row)
    })
  }

  private deleteTableItem(row: any) {
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
        deleteTableItem(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getTableList()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }
  private handleTableMore(row: any) {
    this.isMoreInfoShow = true
    this.currentCustId = row.id
    this.$nextTick(() => {
      const attchDom:any = this.$refs.attachInfo
      attchDom.init()
    })
  }
  private goBack() {
    this.isMoreInfoShow = false
    this.$nextTick(() => {
      const attchDom:any = this.$refs.attachInfo
      attchDom.resetInitData()
    })
  }

  // 查询列表
  private getTableList(val?: any): void {
    this.loading = true
    const { custTag, comId, parentId, agentId, ...form } = this.selectValue
    if (val) {
      this.page = val
    }
    const { page, size } = this
    const cType = (this as any).custType
    const params = {
      ...form,
      custTag: cType === '0' ? undefined : custTag,
      custId1: cType === '2' ? ((this as any).custId || undefined) : (parentId || undefined),
      custId2: cType === '2' && custTag === '2' ? (comId || undefined) : (agentId || undefined),
      page,
      size
    }
    getTableList(params)
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

  private handleCurrentChange(page: any) {
    this.page = page
    this.getTableList()
  }

  private handleSizeChange(size: any) {
    this.size = size
    this.getTableList()
  }

  private async created() {
    this.getTableList()
  }
}
</script>

<style lang="scss" scoped>
.customer-dialog {
  ::v-deep .el-dialog__body {
    padding: 10px 20px 20px;
  }
}
</style>
