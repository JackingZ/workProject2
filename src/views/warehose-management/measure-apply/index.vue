<template>
  <div
    class="measure-form"
    style="display: flex;flex-flow: row nowrap;min-height: inherit;"
  >
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        v-show="!detailShow"
        class="app-container"
      >
        <head-info
          info=""
          title="计量申请单"
        />
        <div class="app-panel">
          <el-row>
            <el-col :span="4">
              <el-button
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-left: 10px"
                @click="handleTest"
              >
                创建复测
              </el-button>
            </el-col>
            <el-col
              :span="20"
              style="text-align:right;"
            >
              <el-input
                v-model="searchForm.originalNo"
                size="small"
                style="width:130px;margin-right:5px;"
                placeholder="原单号"
              />
              <el-input
                v-model="searchForm.measureId"
                size="small"
                style="width:130px;margin-right:5px;"
                placeholder="计量申请单ID"
              />
              <!-- <el-input
                v-model="searchForm.custName"
                size="small"
                style="width:130px;margin-right:5px;"
                placeholder="客户名称"
              /> -->
              <el-select
                v-model="searchForm.measureMethod"
                placeholder="计量方式"
                size="small"
                style="width:110px;margin-right:5px;"
                clearable
              >
                <el-option
                  label="逐箱"
                  :value="1"
                />
                <el-option
                  label="批量"
                  :value="2"
                />
                <el-option
                  label="打托"
                  :value="3"
                />
              </el-select>
              <el-select
                v-model="searchForm.measureStatus"
                placeholder="计量状态"
                size="small"
                clearable
                style="width:110px;margin-right:5px;"
              >
                <el-option
                  v-for="(item, index) in statusList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <!-- <el-select
                v-model="searchForm.auditStatus"
                placeholder="审核状态"
                size="small"
                clearable
                style="width:110px;margin-right:5px;"
              >
                <el-option
                  v-for="(item, index) in auditList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select> -->
              <el-select
                v-model="searchForm.countryId"
                :loading="selectLoading"
                style="width:130px;margin-right:5px;"
                placeholder="国家/地区"
                size="small"
                filterable
                clearable
                @focus="getCountryList"
                @change="onCountry"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="searchForm.warehouseId"
                :loading="selectLoading"
                size="small"
                clearable
                filterable
                placeholder="仓库"
                style="width:130px;margin-right:5px;"
                @focus="getWarehouseList"
              >
                <el-option
                  v-for="item in warehouseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-date-picker
                v-model="searchForm.applyTime"
                :clearable="false"
                unlink-panels
                type="daterange"
                value-format="yyyy-MM-dd"
                align="right"
                size="small"
                style="width:240px;margin-right:10px;"
                range-separator="~"
                start-placeholder="申请起始时间"
                end-placeholder="申请截止时间"
              />
              <el-button
                v-permission="['warehouseDischargeQuery']"
                type="primary"
                size="small"
                @click="handleSearch(1)"
              >
                查询
              </el-button>
              <el-button
                v-permission="['exportMeasureList']"
                type="primary"
                size="small"
                @click="exportData"
              >
                导出
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
              fixed="left"
              prop="measureId"
              label="计量申请单ID"
              min-width="140"
              show-overflow-tooltip
            />
            <el-table-column
              fixed="left"
              prop="measureStatus"
              label="计量状态"
              width="100"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.delFlag === 1">
                  已取消
                </span>
                <span v-else>
                  {{ (statusList[scope.row.measureStatus - 1] || {}).name }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="left"
              prop="originalNo"
              label="原单号"
              min-width="180"
              show-overflow-tooltip
            />
            <el-table-column
              prop="warehouseName"
              label="仓库名称"
              min-width="140"
            />
            <el-table-column
              prop="custName"
              label="客户名称"
              min-width="150"
              show-overflow-tooltip
            />
            <el-table-column
              prop="measureMethod"
              label="计量方式"
              width="100"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.measureMethod === 1">
                  逐箱
                </div>
                <div v-else-if="scope.row.measureMethod === 2">
                  批量
                </div>
                <div v-else-if="scope.row.measureMethod === 3">
                  打托
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="expectedMeasureTime"
              label="要求完成时间"
              width="180"
            />
            <el-table-column
              prop="actualMeasureTime"
              label="实际完成时间"
              width="180"
            />
            <el-table-column
              prop="executorName"
              label="操作人"
              width="150"
            />
            <el-table-column
              prop="applicant"
              label="申请人"
              width="150"
            />
            <el-table-column
              prop="createTime"
              label="申请时间"
              width="180"
            />
            <el-table-column
              prop="secondaryMesaure"
              label="是否需二次计量"
              width="150"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.secondaryMesaure === 0">
                  否
                </div>
                <div v-else-if="scope.row.secondaryMesaure === 1">
                  是
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="auditStatus"
              label="审核状态"
              width="140"
            >
              <template slot-scope="scope">
                {{ (auditList[scope.row.auditStatus - 1] || {}).name }}
              </template>
            </el-table-column> -->
            <el-table-column
              prop="measureReviewAuditor"
              label="计量复核审核人"
              width="150"
            />
            <el-table-column
              prop="measureReviewTime"
              label="计量复核审核时间"
              width="180"
            />
            <el-table-column
              prop="measureReviewResults"
              label="计量复核审核结果"
              width="150"
            />
            <el-table-column
              prop="relatedMeasuerId"
              label="关联计量申请单号"
              min-width="150"
              show-overflow-tooltip
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="200"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['warehouseMeasureView']"
                  type="text"
                  @click="handleDetail(scope.row)"
                >
                  查看详情
                </el-button>
                <el-button
                  v-permission="['warehouseMeasureExport']"
                  type="text"
                  @click="handleExport(scope.row)"
                >
                  导出Excel
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
        </div>
      </div>
      <div
        v-show="detailShow"
        class="app-container"
      >
        <detail
          ref="detailForm"
          :status-list="statusList"
          :audit-list="auditList"
          @back="detailShow = false"
        />
      </div>

      <el-dialog
        title="复测"
        :close-on-click-modal="false"
        width="500px"
        :visible.sync="dialogShow"
        @closed="cancelForm"
      >
        <el-form
          ref="editForm"
          v-loading="formLoading"
          :model="form"
          label-width="80px"
          style="padding-right: 20px;"
          size="small"
          :rules="formRules"
        >
          <el-form-item
            label="原单号"
            prop="code"
          >
            <el-input
              v-model="form.code"
              show-word-limit
              placeholder="请输入原单号"
              style="width: 100%;"
              :maxlength="20"
              @keydown.enter.prevent
            />
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="small"
            @click="cancelForm"
          >
            取 消
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="confirmForm"
          >
            确 定
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'

import detail from '@/views/warehose-management/measure-apply/detail.vue'
import dayjs from 'dayjs'
import {
  getMeasureList,
  getWHList,
  getExcelExport,
  saveMeasureRepeatTest,
  exportMeasure
} from '@/api/warehose-by-config'
import { getCountryByCustSerice } from '@/api/public'
@Component({
  name: 'measure',
  components: {
    detail
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private searchForm: any = {
    applyTime: [],
    applyTimeEnd: undefined,
    applyTimeStart: undefined,
    custName: undefined,
    measureId: undefined,
    measureMethod: undefined,
    measureStatus: undefined,
    auditStatus: undefined,
    originalNo: undefined,
    warehouseId: undefined
  }
  private form: any = {
    code: undefined
  }
  private formRules: any = {
    code: [
      { required: true, message: '原单号不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^([\w | -]){8,20}$/
          if (!reg.test(value)) {
            callback(new Error('原单号必须是8-20个字母、数字、下划线、中划线'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }
  private tableData: any = []
  private warehouseList: any[] = []
  private countryList: any[] = []
  private total = 0
  private page = 1
  private size = 10
  private loading = false
  private moreShow: boolean = false
  private detailShow: boolean = false
  private selectLoading: boolean = false
  private formLoading: boolean = false
  private dialogShow: boolean = false
  private statusList: any[] = [
    { id: 1, name: '待计量' },
    { id: 2, name: '计量中' },
    { id: 3, name: '已计量' },
    { id: 4, name: '已取消' }
  ]
  private auditList: any[] = [
    { id: 1, name: '计量复核待审核' },
    { id: 2, name: '计量复核已通过' },
    { id: 3, name: '计量复核被拒绝' }
  ]

  // computed
  // 所属公司id
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }

  /* methods */
  private exportData() {
    this.loading = true
    const { applyTime, ...model } = this.searchForm
    if (Array.isArray(applyTime) && applyTime.length > 0) {
      model.applyTimeStart = applyTime[0]
      model.applyTimeEnd = applyTime[1]
    }
    const params = {
      ...model
    }
    exportMeasure(params).then((res: any) => {
      this.loading = false
      res.text().then((text: any) => {
        const result = JSON.parse(text)
        if (result.data) {
          this.$message.error(res.data.msg || '文件下载失败')
        }
      }).catch(() => {
        const a = document.createElement('a')
        document.body.appendChild(a)
        const objUrl = URL.createObjectURL(res)
        a.href = objUrl
        a.download = '计量申请单' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.xlsx'
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(objUrl)
      })
    }).catch((err: any) => {
      this.loading = false
      err.data && err.data.text().then((text: any) => {
        try {
          const resData = JSON.parse(text)
          if (resData.code !== 200) {
            this.$message.error(resData.msg || '文件下载失败')
          }
        } catch (e) {
          return e
        }
      })
    })
  }
  private handleTest() {
    this.dialogShow = true
  }
  private cancelForm() {
    this.dialogShow = false
    this.form = {
      code: undefined
    }
    this.clearValidate()
  }
  private clearValidate() {
    this.$nextTick(() => {
      const editForm: any = this.$refs.editForm
      editForm.clearValidate()
    })
  }
  private confirmForm() {
    const editForm: any = this.$refs.editForm
    editForm.validate((valid: any) => {
      if (valid) {
        this.formLoading = true
        saveMeasureRepeatTest(this.form)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '提交成功'
            })
            this.formLoading = false
            this.handleSearch()
            this.cancelForm()
          })
          .catch((err: any) => {
            this.formLoading = false
            return err
          })
      } else {
        return false
      }
    })
  }
  // 获取国家列表
  private getCountryList() {
    const params = {
      custId: this.custId || '',
      typeId: '04'
    }
    this.selectLoading = true
    getCountryByCustSerice(params)
      .then((res: any) => {
        this.countryList = res.data || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private onCountry() {
    this.searchForm.warehouseId = undefined
    this.warehouseList = []
  }

  // 获取仓库
  private getWarehouseList() {
    this.selectLoading = true
    getWHList({
      model: {
        custId: this.custId,
        countryId: this.searchForm.countryId
      },
      page: 1,
      size: 9999
    })
      .then((res: any) => {
        const data = res.data || {}
        this.warehouseList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private handleSearch(val?: any): void {
    // 查询
    this.loading = true
    const { applyTime, ...model } = this.searchForm
    if (Array.isArray(applyTime) && applyTime.length > 0) {
      model.applyTimeStart = applyTime[0]
      model.applyTimeEnd = applyTime[1]
    }
    if (val) {
      this.page = val
    }
    const params = {
      model,
      page: this.page,
      size: this.size
    }
    getMeasureList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.tableData = data.result || []
        this.total = data.total
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return [null, err]
      })
  }

  private handleDetail(row: any): void {
    // 查看详情
    this.detailShow = true
    const root: any = this.$refs.detailForm
    root.setData(row)
  }
  private handleExport(row: any) {
    // 导出excel
    getExcelExport({
      id: row.id,
      originalNo: row.originalNo
    }).then((res: any) => {
      const a = document.createElement('a')
      document.body.appendChild(a)
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      const objUrl = URL.createObjectURL(blob)
      a.href = objUrl
      a.download = '计量数据列表' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.xls'
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(objUrl)
    }).catch((err: any) => {
      err.data.text().then((text: any) => {
        try {
          const resData = JSON.parse(text)
          if (resData.code !== 200) {
            this.$message.error(resData.msg || '文件下载失败')
          }
        } catch (e) {
          return e
        }
      })
    })
  }

  private handleSizeChange(size: any): void {
    // 页码
    this.size = size
    this.handleSearch()
  }
  private handleCurrentChange(page: any): void {
    // 页数
    this.page = page
    this.handleSearch()
  }
  private created() {
    this.searchForm.applyTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    this.handleSearch()
  }
}
</script>

<style lang="scss" scoped>
</style>
