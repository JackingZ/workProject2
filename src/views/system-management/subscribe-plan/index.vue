<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="计划订阅"
        />
        <div class="app-panel">
          <el-row>
            <el-col :span="8">
              <el-button
                v-permission="['addSubscribe']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-left: 10px"
                @click="addRow"
              >
                新增订阅人
              </el-button>
              <el-button
                v-permission="['batchSubscribe']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-left: 10px"
                @click="addBatchFlight"
              >
                批量订阅航线
              </el-button>
              <el-button
                v-permission="['batchSubscribe']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-left: 10px"
                @click="addBatchFba"
              >
                批量订阅仓库
              </el-button>
            </el-col>
            <el-col
              :span="16"
              style="text-align:right;"
            >
              <el-select
                v-show="custId === '0'"
                v-model="selectValue.custId"
                :loading="selectLoading"
                placeholder="所属公司"
                style="width:130px;margin-right:5px;"
                size="small"
                filterable
                clearable
                @focus="getSupplierList"
              >
                <el-option
                  v-for="item in supplierList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.bsId"
                :loading="selectLoading"
                clearable
                filterable
                placeholder="选择航线"
                style="width:130px;margin-right:5px;"
                size="small"
                @focus="getFlightList"
              >
                <el-option
                  v-for="item in flightList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.fbastoreId"
                :loading="selectLoading"
                style="width:130px;margin-right:5px;"
                clearable
                filterable
                size="small"
                placeholder="选择仓库"
                @focus="getFBAList"
              >
                <el-option
                  v-for="item in fbaList"
                  :key="item.id"
                  :label="item.code"
                  :value="item.id"
                />
              </el-select>
              <el-input
                v-model="selectValue.keyword"
                placeholder="请输入内容"
                class="input-with-select"
                style="width:280px;margin-right:10px;"
                size="small"
              >
                <el-select
                  slot="prepend"
                  v-model="selectType"
                  size="small"
                  style="width:110px;"
                  placeholder="请选择"
                >
                  <el-option
                    label="订阅人姓名"
                    value="1"
                  />
                  <el-option
                    label="手机号"
                    value="2"
                  />
                </el-select>
              </el-input>
              <el-button
                v-permission="['querySubscribe']"
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
            @selection-change="onSelection"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              prop="name"
              label="订阅人姓名"
              min-width="120"
            />
            <el-table-column
              v-if="custId === '0'"
              prop="custName"
              label="所属公司"
              min-width="120"
            />
            <el-table-column
              prop="phone"
              label="手机号"
              min-width="120"
            />
            <el-table-column
              prop="wechat"
              label="微信号"
              min-width="120"
            />
            <el-table-column
              prop="email"
              label="电子邮箱"
              min-width="120"
            />
            <el-table-column
              prop="bySms"
              label="手机通知"
              width="120"
            >
              <template slot-scope="scope">
                {{ formatValue(scope.row.bySms) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="byWechat"
              label="微信通知"
              width="120"
            >
              <template slot-scope="scope">
                {{ formatValue(scope.row.byWechat) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="byEmail"
              label="邮件通知"
              width="120"
            >
              <template slot-scope="scope">
                {{ formatValue(scope.row.byEmail) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="plan"
              label="计划信息"
              width="120"
            >
              <template slot-scope="scope">
                {{ formatValue(scope.row.plan) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="loaded"
              label="装载信息"
              width="120"
            >
              <template slot-scope="scope">
                {{ formatValue(scope.row.loaded) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="cost"
              label="实时成本"
              width="120"
            >
              <template slot-scope="scope">
                {{ formatValue(scope.row.cost) }}
              </template>
            </el-table-column>
            <el-table-column
              label="订阅航线"
              width="105"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="!$checkPermission(['batchSubscribe'])"
                  type="text"
                  @click="handleFlight(scope.row)"
                >
                  订阅航线
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="订阅仓库"
              width="105"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="!$checkPermission(['batchSubscribe'])"
                  type="text"
                  @click="handleFba(scope.row)"
                >
                  订阅仓库
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="160"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['updateSubscribe']"
                  type="text"
                  @click="editRow(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['delSubscribe']"
                  type="text"
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
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />

          <el-dialog
            :title="isEdit ? '编辑订阅人' : '新增订阅人'"
            :close-on-click-modal="false"
            width="600px"
            :visible.sync="isAddEditVisible"
            @close="cancel"
          >
            <div
              v-loading="formLoading"
            >
              <el-form
                ref="editForm"
                :model="selectForm"
                :rules="formRules"
                label-width="100px"
                label-position="right"
                size="small"
                style="padding-right: 20px;"
              >
                <el-form-item
                  v-if="custType === '0'"
                  label="所属公司"
                  prop="name"
                >
                  <el-select
                    v-model="selectForm.custId"
                    :disabled="isEdit"
                    :loading="selectLoading"
                    placeholder="请选择"
                    style="width:100%;"
                    size="small"
                    filterable
                    clearable
                    @focus="getSupplierList"
                    @change="onSupplier"
                  >
                    <el-option
                      v-for="item in supplierList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="订阅人姓名"
                  prop="name"
                >
                  <el-input
                    v-model="selectForm.name"
                    :disabled="isEdit"
                    placeholder="请输入"
                    :maxlength="10"
                    show-word-limit
                  />
                </el-form-item>
                <el-form-item
                  label="手机号"
                  prop="phone"
                >
                  <el-input
                    v-model="selectForm.phone"
                    :disabled="isEdit"
                    placeholder="请输入"
                    :maxlength="20"
                  />
                </el-form-item>
                <el-form-item
                  label="微信号"
                  prop="wechat"
                >
                  <el-input
                    v-model="selectForm.wechat"
                    :disabled="isEdit"
                    placeholder="请输入"
                    :maxlength="20"
                  />
                </el-form-item>
                <el-form-item
                  label="电子邮箱"
                  prop="email"
                >
                  <el-input
                    v-model="selectForm.email"
                    :disabled="isEdit"
                    placeholder="请输入"
                    :maxlength="30"
                  />
                </el-form-item>
                <el-form-item
                  label="订阅内容"
                  prop="bookArr"
                >
                  <el-checkbox-group
                    v-model="selectForm.bookArr"
                  >
                    <el-checkbox
                      v-for="(item, index) in bookList"
                      :key="index"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item
                  label="通知方式"
                  prop="infoArr"
                >
                  <el-checkbox-group
                    v-model="selectForm.infoArr"
                  >
                    <el-checkbox
                      v-for="(item, index) in infoList"
                      :key="index"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-checkbox-group>
                </el-form-item>
              </el-form>
              <div
                slot="footer"
                style="text-align: right;padding: 20px;"
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
                  @click="saveConfirm"
                >
                  确 定
                </el-button>
              </div>
            </div>
          </el-dialog>

          <el-dialog
            title="订阅仓库"
            :visible.sync="isFbaShow"
            :close-on-click-modal="false"
            width="960px"
            @close="closeFba"
          >
            <div v-loading="dialogLoading">
              <el-transfer
                ref="transferItem"
                v-model="fbaItem"
                filterable
                :filter-method="filterMethod"
                :titles="['选择仓库', '已订阅仓库']"
                :props="{key: 'id', label: 'name'}"
                filter-placeholder="输入搜索"
                :data="FBAList"
                style="height: 500px;"
              />

              <div
                slot="footer"
                style="text-align: right;margin: 20px 40px 0;"
              >
                <el-button
                  size="small"
                  @click="closeFba"
                >
                  取 消
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="confirmFba"
                >
                  确 定
                </el-button>
              </div>
            </div>
          </el-dialog>
          <el-dialog
            title="订阅航线"
            :visible.sync="isFlightShow"
            :close-on-click-modal="false"
            width="960px"
            @close="closeFlight"
          >
            <el-transfer
              ref="transferItem"
              v-model="flightItem"
              v-loading="dialogLoading"
              filterable
              :filter-method="filterMethod"
              :titles="['选择航线', '已订阅航线']"
              :props="{key: 'id', label: 'name'}"
              filter-placeholder="输入搜索"
              :data="flightList"
              style="height: 500px;"
            />
            <div
              slot="footer"
              style="text-align: right;margin: 0 40px 0;"
            >
              <el-button
                size="small"
                @click="closeFlight"
              >
                取 消
              </el-button>

              <el-button
                type="primary"
                size="small"
                @click="confirmFlight"
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
  getSupplierList,
  getSubscribeList,
  addSubscribe,
  getFlightList,
  deleteSubscribe,
  getFbastoreList,
  saveFBABatch,
  saveFlightBatch,
  getCountryList
} from '@/api/system-in-subscribe-plan'

function formParam() {
  return {
    byEmail: false,
    bySms: false,
    byWechat: false,
    cost: false,
    custId: undefined,
    custName: undefined,
    email: undefined,
    id: undefined,
    loaded: false,
    name: undefined,
    phone: undefined,
    plan: false,
    wechat: undefined,
    bookArr: [],
    infoArr: []
  }
}
@Component({
  name: '',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private selectLoading: boolean = false
  private isAddEditVisible: boolean = false
  private formLoading: boolean = false
  private isEdit: boolean = false
  private dialogLoading:boolean = false
  private isFbaShow: boolean = false
  private isFlightShow: boolean = false
  private tableData: any = []
  private selectValue: any = {
    custId: '',
    bsId: '',
    fbastoreId: '',
    keyword: '',
    countryId: ''
  }
  private selectForm: any = formParam()
  private supplierList: any[] = []
  private flightList: any[] = []
  private FBAList: any = []
  private fbaList: any[] = []
  private countryList: any = []
  private currentId = ''
  private fbaItem: any[] = []
  private flightItem: any[] = []

  private bookList: any[] = [
    { name: '计划信息', id: '0' },
    { name: '装载信息', id: '1' },
    { name: '实时成本', id: '2' }
  ]
  private infoList: any[] = [
    { name: '手机', id: '0' },
    { name: '微信', id: '1' },
    { name: '邮件', id: '2' }
  ]
  private selectType = '1'
  private page: number = 1
  private size: number = 10
  private total: any = 0
  private formRules = {
    name: [
      { required: true, message: '订阅人姓名不能为空', trigger: 'blur' }
    ], // 服务名称
    phone: [
      { required: true, message: '手机号不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (value && reg.test(value)) {
            callback(new Error('手机号不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    wechat: [
      { required: true, message: '微信号不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^[a-zA-Z0-9-_]*$/
          if (!value) {
            callback(new Error('微信号不能为空'))
          } else if (!reg.test(value)) {
            callback(new Error('微信号只能是数字、字母'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    email: [
      { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
      { type: 'email', message: '邮箱地址格式不正确', trigger: ['blur', 'change'] }
    ],
    bookArr: [
      { required: true, message: '请选择订阅内容', trigger: 'change' }
    ],
    infoArr: [{ required: true, message: '请选择通知方式', trigger: 'change' }],
    custId: [{ required: true, message: '请选择所属公司', trigger: 'change' }]
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

  /* methods */
  private formatValue(val: any) {
    return val ? '√' : '--'
  }
  private getSupplierList() {
    this.selectLoading = true
    const params = {
      page: 1,
      size: 99999,
      parentId: '0'
    }
    getSupplierList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.supplierList = data.result || []
        this.supplierList.unshift({
          id: '0',
          name: '聚货通'
        })
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private onSupplier() {
    const item = this.supplierList.find((it: any) => it.id === this.selectForm.custId)
    if (item) {
      this.selectForm.custName = item.name
    }
  }
  private onSelection(val: any) {
    //
  }
  private getFBAList() {
    this.dialogLoading = true
    this.selectLoading = true
    const params = {
      page: 1,
      size: 99999,
      codeSort: 'A',
      countryId: this.selectValue.countryId
    }
    getFbastoreList(params).then(res => {
      const data = res.data || {}
      const arr = data.result || []
      this.fbaList = arr
      this.FBAList = arr.map((it: any) => {
        return {
          id: it.id,
          name: it.code + '-' + it.address
        }
      })
      this.dialogLoading = false
      this.selectLoading = false
    }).catch(err => {
      this.dialogLoading = false
      this.selectLoading = false
      return err
    })
  }
  private addBatchFba() {
    //
  }

  // 获取国家列表
  private getCountryList() {
    getCountryList()
      .then((res: any) => {
        const data = res.data || {}
        this.countryList = data.result || []
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

  private getFlightList() {
    this.dialogLoading = true
    this.selectLoading = true
    const params = {
      page: 1,
      size: 9999
    }
    getFlightList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.flightList = data.result || []
        this.dialogLoading = false
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.dialogLoading = false
        this.selectLoading = false
        return err
      })
  }
  private addBatchFlight() {
    //
  }

  // 查询列表
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
    if (this.selectType === '1') {
      params.name = this.selectValue.keyword
    } else {
      params.phone = this.selectValue.keyword
    }
    getSubscribeList(params)
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

  // 关联
  private closeFba() {
    this.isFbaShow = false
    this.fbaItem = []
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
  }

  private confirmFba() {
    this.dialogLoading = true
    const params: any = {
      fbastoreIds: this.fbaItem || [],
      subscriberIds: [this.currentId]
    }
    saveFBABatch(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.dialogLoading = false
        this.closeFba()
        this.queryAll()
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }

  private handleFba(row: any): void {
    this.isFbaShow = true
    this.currentId = row.id
    this.getFBAList()
  }

  private filterMethod(query: any, item: any): boolean {
    const name = item.name || ''
    return name.indexOf(query) > -1
  }

  private closeFlight() {
    this.isFlightShow = false
    this.flightItem = []
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
  }
  private handleFlight(row: any) {
    this.isFlightShow = true
    this.currentId = row.id
    this.getFlightList()
  }

  private confirmFlight() {
    this.dialogLoading = true
    const params = {
      routeIds: this.flightItem,
      subscriberIds: [this.currentId]
    }
    saveFlightBatch(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.closeFlight()
        this.dialogLoading = false
        this.queryAll()
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }

  // 提交保存
  private saveConfirm() {
    const editForm: any = this.$refs.editForm
    editForm.validate((valid: any) => {
      if (!valid) return false
      this.formLoading = true
      const { bookArr, infoArr, ...form } = this.selectForm
      const params: any = {
        ...form
      }
      bookArr.map((it: any) => {
        if (it === '计划信息') {
          params.plan = true
        }
        if (it === '装载信息') {
          params.loaded = true
        }
        if (it === '实时成本') {
          params.cost = true
        }
      })
      infoArr.map((it: any) => {
        if (it === '手机') {
          params.bySms = true
        }
        if (it === '微信') {
          params.byWechat = true
        }
        if (it === '邮件') {
          params.byEmail = true
        }
      })
      const type = (this as any).custType
      if (type !== '0') {
        params.custId = (this as any).custId
        params.custName = (this as any).custName
      }
      addSubscribe(params)
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.isAddEditVisible = false
          this.formLoading = false
          this.resetForm()
          this.queryAll()
        })
        .catch((err: any) => {
          this.formLoading = false
          return err
        })
    })
  }
  private deleteRow(row: any) {
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
        deleteSubscribe(params)
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

  private cancel() {
    this.isAddEditVisible = false
    this.resetForm()
  }
  // 重置表单
  private resetForm() {
    this.selectForm = formParam()
    this.clearValidate()
  }

  // 新增
  private addRow(): void {
    this.isEdit = false
    this.isAddEditVisible = true
  }

  // 编辑
  private editRow(row: any): void {
    this.currentId = row.id
    this.getSupplierList()
    const { byEmail, bySms, byWechat, cost, loaded, plan, ...form } = row
    const arrI = []
    if (byEmail) {
      arrI.push('邮件')
    }
    if (bySms) {
      arrI.push('手机')
    }
    if (byWechat) {
      arrI.push('微信')
    }
    const arrB = []
    if (cost) {
      arrB.push('实时成本')
    }
    if (loaded) {
      arrB.push('装载信息')
    }
    if (plan) {
      arrB.push('计划信息')
    }
    this.selectForm = {
      ...form,
      infoArr: arrI,
      bookArr: arrB
    }
    this.isEdit = true
    this.isAddEditVisible = true
  }

  // 关闭dialog重置表单
  private close(): void {
    this.isAddEditVisible = false
    this.resetForm()
  }
  // 清除校验
  private clearValidate() {
    const editForm: any = this.$refs.editForm
    this.$nextTick(() => {
      editForm.clearValidate()
    })
  }

  // 重置表单
  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.queryAll()
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
</style>
