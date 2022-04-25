<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="岗位提成"
        />
        <div class="app-panel">
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-select
                v-show="custId === '0'"
                v-model="selectValue.custId"
                :loading="supplierLoading"
                placeholder="所属公司"
                size="small"
                filterable
                style="width:200px;margin-right:5px;"
                @change="onSupplier"
              >
                <el-option
                  v-for="(item, index) in supplierList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.commissionType"
                size="small"
                clearable
                filterable
                style="width:120px;margin-right:5px;"
                placeholder="计量方式"
              >
                <el-option
                  label="按重量"
                  value="0"
                />
                <el-option
                  label="按体积"
                  value="1"
                />
                <el-option
                  label="按票"
                  value="2"
                />
                <el-option
                  label="按箱"
                  value="3"
                />
              </el-select>
              <el-input
                v-model="selectValue.postName"
                size="small"
                clearable
                style="width:300px;margin-right:10px;"
                placeholder="请输入"
              >
                <template slot="prepend">
                  岗位名称
                </template>
              </el-input>
              <el-button
                v-permission="['commissionQuery']"
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
              label="所属公司"
              min-width="120"
            >
              <template slot-scope="scope">
                {{ companyFilter(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="postName"
              label="岗位名称"
              min-width="120"
            />
            <el-table-column
              prop="type"
              label="计量方式"
              width="120"
            >
              <template slot-scope="scope">
                {{ typeFilter(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="um"
              label="计量单位"
              width="140"
            />
            <el-table-column
              prop="version"
              width="150"
              label="最新版本"
            />
            <el-table-column
              label="最新版本日期"
              width="300"
            >
              <template slot-scope="scope">
                {{ dateFilter(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column
              label="更新提成"
              width="120"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="!$checkPermission(['commissionUpdate'])"
                  type="text"
                  @click="setCommission(scope.row)"
                >
                  更新提成
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              width="100"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['commissionGet']"
                  type="text"
                  @click="detail(scope.row)"
                >
                  查看
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
            :title="jobName"
            :visible.sync="isSetVisible"
            :close-on-click-modal="false"
            width="600px"
            @close="cancel"
          >
            <div style="padding: 0 70px 0 30px;">
              <el-form
                ref="editForm"
                v-loading="formLoading"
                :model="selectForm"
                :rules="formRules"
                label-width="90px"
                label-position="right"
                size="small"
              >
                <el-form-item
                  label="计量方式"
                  prop="type"
                >
                  <el-select
                    v-model="selectForm.type"
                    :disabled="timeCompare === '1'"
                    style="width:100%;"
                    placeholder="请选择"
                    filterable
                    clearable
                    @change="onType"
                  >
                    <el-option
                      label="按重量"
                      value="0"
                    />
                    <el-option
                      label="按体积"
                      value="1"
                    />
                    <el-option
                      label="按票"
                      value="2"
                    />
                    <el-option
                      label="按箱"
                      value="3"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="计量单位"
                  prop="um"
                >
                  <el-select
                    v-model="selectForm.um"
                    :disabled="timeCompare === '1'"
                    style="width:100%;"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in umList"
                      :key="index"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <div v-if="timeCompare !== '1'">
                  <el-form-item
                    label="起止日期"
                    prop="time"
                  >
                    <el-date-picker
                      v-model="selectForm.time"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                      type="daterange"
                      unlink-panels
                      range-separator="~"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      style="width: 100%;"
                    />
                  </el-form-item>
                </div>
                <div v-else>
                  <el-form-item
                    label="起始日期"
                    prop="startDate"
                  >
                    <el-date-picker
                      v-model="selectForm.startDate"
                      :disabled="timeCompare === '1'"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                      type="date"
                      style="width: 100%;"
                    />
                  </el-form-item>
                  <el-form-item
                    label="截止日期"
                    prop="endDate"
                  >
                    <el-date-picker
                      v-model="selectForm.endDate"
                      :picker-options="pickerOptions"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                      type="date"
                      style="width: 100%;"
                    />
                  </el-form-item>
                </div>
                <el-form-item
                  label="区间&提成"
                  prop="sections"
                >
                  <div
                    v-for="(item, index) in selectForm.sections"
                    :key="index"
                    class="item-after-icon"
                  >
                    <el-input-number
                      v-model="selectForm.sections[index].lower"
                      class="input-number-valiate"
                      :controls="false"
                      :disabled="timeCompare === '1'"
                      placeholder="输入下限"
                      :min="0"
                      :max="999999"
                      :step="1"
                      step-strictly
                    />
                    <el-input-number
                      v-model="selectForm.sections[index].upper"
                      class="input-number-valiate"
                      :controls="false"
                      :disabled="timeCompare === '1'"
                      placeholder="输入上限"
                      :min="0"
                      :max="999999"
                      :step="1"
                      step-strictly
                    />
                    <el-input-number
                      v-model="selectForm.sections[index].amount"
                      class="input-number-valiate"
                      :controls="false"
                      :disabled="timeCompare === '1'"
                      placeholder="单位金额"
                      :min="0"
                      :max="999999"
                      :precision="2"
                    />
                    <span v-if="timeCompare !== '1'">
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
              class="dialog-footer"
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
          </el-dialog>

          <el-dialog
            :title="jobName"
            :visible.sync="isViewVisible"
            :close-on-click-modal="false"
            width="800px"
            @close="close"
          >
            <div style="text-align: right;">
              <el-select
                v-model="versionView"
                style="width:300px;"
                placeholder="请选择"
                filterable
                size="small"
                @change="onViewVersion"
              >
                <el-option
                  v-for="(item, index) in versionList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </div>
            <el-table
              v-loading="subLoading"
              :data="subTableData"
              height="450px"
              style="width: 100%;margin: 10px 0;"
              border
            >
              <el-table-column
                prop="type"
                label="计量方式"
                width="120"
              >
                <template slot-scope="scope">
                  {{ typeFilter(scope.row) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="um"
                width="120"
                label="计量单位"
              />
              <el-table-column
                prop="lower"
                label="区间下限"
              />
              <el-table-column
                prop="upper"
                label="区间上限"
              />
              <el-table-column
                prop="amount"
                label="提成金额"
              />
              <el-table-column
                fixed="right"
                width="100"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="timeCompare !== '2'"
                    type="text"
                    @click="editCommission(scope.row)"
                  >
                    编辑
                  </el-button>
                  <!-- <el-button
                    type="text"
                    @click="deteleCommission(scope.row)"
                  >
                    删除
                  </el-button> -->
                </template>
              </el-table-column>
            </el-table>
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
  getCommissionList,
  getCommission,
  getVersionList,
  saveCommission,
  deteleCommission
} from '@/api/operation-of-job-setup'
import dayjs from 'dayjs'
@Component({
  name: 'Port',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private subLoading: boolean = false
  private supplierLoading: boolean = false
  private isSetVisible: boolean = false
  private isViewVisible: boolean = false
  private supplierList: any[] = [
    {
      id: '0',
      name: '聚货通'
    }
  ]
  private tableData: any[] = []
  private jobName: string = ''
  private companyName: string = ''
  private versionView: string = ''
  private jsonForm: any = {}
  private selectValue: any = {
    custId: this.custId,
    commissionType: undefined,
    postName: undefined
  }
  private selectForm: any = {
    custId: undefined,
    postId: undefined,
    version: undefined,
    um: undefined,
    type: undefined,
    startDate: undefined,
    endDate: undefined,
    time: [],
    sections: [{
      lower: undefined,
      upper: undefined,
      amount: undefined
    }]
  }
  private formLoading: boolean = false
  private umList: any[] = []
  private page: number = 1
  private size: number = 10
  private total: any = 0

  private formRules = {
    type: [{ required: true, message: '请选择计量方式', trigger: 'change' }],
    um: [{ required: true, message: '请选择计量单位', trigger: 'change' }],
    startDate: [{ required: true, message: '请选择起始日期', trigger: 'change' }],
    endDate: [{ required: true, message: '请选择截止日期', trigger: 'change' }],
    time: [{ required: true, message: '请选择起止日期', trigger: 'change' }],
    sections: [{ required: true, message: '区间提成不能为空', trigger: 'blur' }]
  }
  private timeCompare: string = ''
  private subTableData: any[] = []
  private versionList: any[] = []

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

  get pickerOptions() {
    const that = this
    return {
      disabledDate(time: any) {
        return time.getTime() <= dayjs(that.selectForm.startDate).valueOf()
      }
    }
  }

  /* methods */
  // 获取供应商
  private getSupplierList() {
    this.supplierLoading = true
    const custId = this.custId
    const params = {
      page: 1,
      size: 99999,
      parentId: custId
    }
    getSupplierList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.supplierList = data.result || []
        this.supplierList.unshift({
          id: '0',
          name: '聚货通'
        })
        this.supplierLoading = false
      })
      .catch((err: any) => {
        this.supplierLoading = false
        return err
      })
  }
  private onSupplier() {
    this.tableData = []
    this.queryAll(1)
  }

  private companyFilter(row: any): any {
    const it = (this.supplierList || []).find((item: any) => item.id === this.selectValue.custId) || {}
    row.name = it.name || ''
    return row.name
  }

  private dateFilter(row: any) {
    if (row.startDate && row.endDate) {
      return row.startDate + '至' + row.endDate
    }
  }

  // 类型名称
  private typeFilter(row: any): any {
    let name
    switch (row.type) {
      case '0':
        name = '按重量'
        break
      case '1':
        name = '按体积'
        break
      case '2':
        name = '按票'
        break
      case '3':
        name = '按箱'
        break
      default:
        break
    }
    return name
  }

  private timeStatus(startDate: any, endDate: any): void {
    const now = dayjs().valueOf()
    const start = startDate ? dayjs(startDate).valueOf() : undefined
    const end = endDate ? dayjs(endDate).valueOf() : undefined
    this.timeCompare = ''
    if (start && now < start) {
      this.timeCompare = '0'
    } else if (start && end && start <= now && now < end) {
      this.timeCompare = '1'
    } else if (end && now >= end) {
      this.timeCompare = '2'
    }
  }

  // 查看
  private detail(row: any): void {
    const { version, name, custId, startDate, endDate }: any = row
    if (!version) {
      this.$message.error('暂无版本，请更新提成')
      return
    }
    this.jobName = '查看提成' + '【' + (name || '') + '】'
    this.companyName = name || ''
    this.timeStatus(startDate, endDate)
    this.jsonForm = row
    this.jsonForm.time = [startDate, endDate]
    this.jsonForm.custId = custId || this.selectValue.custId
    this.versionView = (version || '').toString()
    this.getCommission()
    this.getVersionList()
    this.isViewVisible = true
  }
  private close() {
    this.isViewVisible = false
    this.resetForm()
  }
  // 编辑
  private editCommission(row: any) {
    this.jobName = '编辑提成' + '【' + this.companyName + '】'
    this.selectForm = JSON.parse(JSON.stringify(this.jsonForm))
    this.isSetVisible = true
  }

  // 获取最新版本岗位提成
  private getCommission() {
    this.subLoading = true
    const params = {
      custId: this.jsonForm.custId,
      postId: this.jsonForm.postId,
      version: this.versionView
    }
    getCommission(params).then((res: any) => {
      const data = res.data || {}
      if (!Array.isArray(data.sections) || data.sections.length <= 0) {
        this.jsonForm.sections = [{
          lower: undefined,
          upper: undefined,
          amount: undefined
        }]
      } else {
        this.jsonForm.sections = data.sections
      }
      this.subTableData = data.sections.map((item: any) => {
        const { lower, upper, amount } = item
        const it: any = {
          lower,
          upper,
          amount
        }
        it.type = data.type || ''
        it.um = data.um || ''
        return it
      })
      this.subLoading = false
    }).catch((err: any) => {
      this.subLoading = false
      return [err]
    })
  }
  // 获取版本
  private getVersionList() {
    getVersionList({
      custId: this.jsonForm.custId,
      postId: this.jsonForm.postId
    }).then((res: any) => {
      this.versionList = res.data || []
    }).catch((err: any) => {
      return [err]
    })
  }
  private onViewVersion() {
    this.versionList.map((item: any) => {
      if (this.selectForm.version === item.id) {
        this.timeStatus(item.startDate, item.endDate)
      }
    })
    this.getCommission()
  }

  // 更新提成
  private setCommission(row: any): void {
    const { name, id, postId, postName, custId }: any = row
    this.jobName = '更新提成' + '【' + name + '】'
    this.selectForm.postId = postId
    this.selectForm.postName = postName
    this.selectForm.custId = custId || this.selectValue.custId
    this.isSetVisible = true
    this.timeCompare = ''
  }

  private deteleCommission(row: any) {
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
        deteleCommission(params)
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

  private onType(val: any) {
    switch (val) {
      case '0':
        this.umList = [
          { name: 'KGS-公斤', id: 'KGS' },
          { name: 'LBS-磅', id: 'LBS' },
          { name: 'OZS-盎司', id: 'OZS' },
          { name: 'OTR-其它', id: 'OTR' }
        ]
        break
      case '1':
        this.umList = [
          { name: 'CBM-立方米', id: 'CBM' },
          { name: 'CUFT-立方英尺', id: 'CUFT' },
          { name: 'OTR-其它', id: 'OTR' }
        ]
        break
      case '2':
        this.umList = [
          { name: 'IVC-票', id: 'IVC' }
        ]
        break
      case '3':
        this.umList = [
          { name: 'BOX-箱', id: 'BOX' }
        ]
        break
      default:
        this.umList = []
        break
    }
  }

  private addRangeData() {
    this.selectForm.sections.push({
      lower: undefined,
      upper: undefined,
      amount: undefined
    })
  }
  private deleteRangeData(index: number) {
    this.selectForm.sections.splice(index, 1)
  }

  // 关闭dialog重置表单
  private cancel() {
    this.isSetVisible = false
    this.resetForm()
    this.clearValidate()
  }
  private clearValidate() {
    this.$nextTick(() => {
      const editForm: any = this.$refs.editForm
      editForm.clearValidate()
    })
  }
  // 重置表单
  private resetForm() {
    this.selectForm = {
      custId: undefined,
      postId: undefined,
      version: undefined,
      um: undefined,
      type: undefined,
      startDate: undefined,
      endDate: undefined,
      time: [],
      sections: [{
        lower: undefined,
        upper: undefined,
        amount: undefined
      }]
    }
  }
  // 提交保存
  private saveConfirm() {
    const editForm: any = this.$refs.editForm
    editForm.validate((valid: any) => {
      if (!valid) {
        return false
      }
      const { sections } = this.selectForm
      const isValue = Array.isArray(sections) && sections.every((it: any) => it.lower >= 0 && it.upper && it.amount)
      if (!isValue) {
        this.$message.error('请填写完整区间&提成')
        return
      }
      const isMinMax = this.selectForm.sections.some((item:any) => {
        return item.upper <= item.lower
      })
      if (isMinMax) {
        this.$message({
          type: 'error',
          message: '下限值不能大于等于上限值'
        })
        return
      }
      let mixVal = false
      this.selectForm.sections.map((it: any, index: any) => {
        mixVal = this.selectForm.sections.some((r: any, i: any) => {
          if (index !== i) {
            return (r.lower <= it.lower && it.lower < r.upper) || (r.lower < it.upper && it.upper <= r.upper)
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
      this.formLoading = true
      const params: any = {
        ...this.selectForm
      }
      if (this.timeCompare !== '1') {
        params.startDate = this.selectForm.time[0]
        params.endDate = this.selectForm.time[1]
      }

      saveCommission(params)
        .then((res: any) => {
          this.formLoading = false
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.isSetVisible = false
          this.isViewVisible = false
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
    getCommissionList(params)
      .then((res: any) => {
        this.loading = false
        this.tableData = res.data.result
        this.total = res.data.total
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

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
    if ((this as any).custId === '0') {
      this.getSupplierList()
    }
  }
}
</script>

<style lang="scss" scoped>
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
  width: 33.33%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
</style>
