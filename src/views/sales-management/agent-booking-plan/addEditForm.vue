<template>
  <div
    v-loading="formLoading"
  >
    <el-form
      ref="selectForm"
      :model="selectForm"
      :rules="formRules"
      label-width="100px"
      label-position="right"
      size="small"
    >
      <el-form-item
        v-if="custType === '0' && !isEdit"
        label="所属公司"
        prop="companyId"
      >
        <el-select
          v-model="selectForm.companyId"
          :loading="selectLoading"
          size="small"
          style="width:100%;"
          placeholder="请选择"
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
      </el-form-item>
      <el-form-item
        label="业务类型"
        prop="type"
      >
        <el-select
          v-model="selectForm.type"
          :disabled="isEdit"
          placeholder="请选择"
          size="small"
          style="width:100%;"
          @change="onType"
        >
          <el-option
            v-for="item in typelist"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="订舱服务"
        prop="bscId"
      >
        <el-popover
          placement="bottom-start"
        >
          <el-row>
            <el-form-item
              label="目的国"
              label-width="60px"
            >
              <el-select
                v-model="selectForm.countryId"
                :loading="selectLoading"
                size="mini"
                clearable
                filterable
                placeholder="请选择"
                style="width: 275px;"
                @focus="getCountryList"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item
              label="服务"
              label-width="60px"
            >
              <el-select
                v-model="selectForm.bscId"
                :loading="selectLoading"
                :disabled="!selectForm.type"
                clearable
                filterable
                size="small"
                style="width: 275px;"
                placeholder="请选择"
                @focus="getBscList"
                @change="onFlight"
              >
                <el-option
                  v-for="item in flightList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-row>
          <div
            slot="reference"
            class="el-select el-select--small"
            style="width: 100%;"
          >
            <el-input
              v-model="selectForm.bscName"
              placeholder="服务"
              readonly
              suffix-icon="el-select__caret el-input__icon el-icon-arrow-up"
            />
          </div>
        </el-popover>
      </el-form-item>
      <el-form-item
        label="服务商"
        prop="serviceName"
      >
        <el-input
          v-model="selectForm.serviceName"
          :disabled="true"
          placeholder="请选择"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="showServiceLine"
          />
        </el-input>
      </el-form-item>
      <el-form-item
        v-if="selectForm.type === '1' || selectForm.type === '2'"
        label="体积"
        prop="volume"
      >
        <div class="input-content">
          <div style="flex: 1;">
            <el-input-number
              v-model="selectForm.volume"
              class="input-number-valiate input-border"
              :controls="false"
              placeholder="请输入"
              :min="0"
              :max="999999"
              :precision="2"
            />
          </div>
          <div class="input-unit">
            CBM
          </div>
        </div>
      </el-form-item>
      <el-form-item
        v-if="selectForm.type === '0' || selectForm.type === '4'"
        label="重量"
        prop="weight"
      >
        <div class="input-content">
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
            KG
          </div>
        </div>
      </el-form-item>
      <el-form-item
        label="年度"
        prop="year"
      >
        <el-date-picker
          v-model="selectForm.year"
          type="year"
          placeholder="年度"
          style="width: 100%;"
          value-format="yyyy"
          size="small"
          clearable
          @change="onYear"
        />
      </el-form-item>
      <el-form-item
        label="期间"
        prop="period"
      >
        <el-select
          v-model="selectForm.period"
          :loading="selectLoading"
          :disabled="!selectForm.year"
          placeholder="请选择"
          size="small"
          clearable
          filterable
          style="width: 100%;"
          @focus="getFiscalList"
        >
          <el-option
            v-for="(item, index) in fiscalList"
            :key="index"
            :label="item.fiscalPeriod"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="selectForm.remark"
          placeholder="请输入"
          :maxlength="150"
        />
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      style="text-align: right;padding: 10px;"
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

    <el-dialog
      width="1200px"
      title="选择服务商"
      :visible.sync="innerVisible"
      append-to-body
      @closed="onCancel"
    >
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
            v-for="item in weekdays1"
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
            v-for="item in weekdays1"
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
      <el-table
        v-if="isType"
        ref="tableSelect"
        v-loading="loading"
        :data="tableData"
        height="400px"
        style="width: 100%;margin: 10px 0;"
        border
        @row-click="rowClick"
        @selection-change="rowSelectChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <!-- <el-table-column
          v-if="isType !== '1' && isType !== '2'"
          width="55"
          label=""
        >
          <template slot-scope="scope">
            <el-radio
              v-model="selectForm.bscTransId"
              :label="scope.row.id"
            >
              &nbsp;
            </el-radio>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="orgName"
          label="服务机构"
          min-width="150"
          show-overflow-tooltip
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
      </el-table>
      <div
        style="text-align: right;padding: 10px 0;"
      >
        <el-button
          type="primary"
          size="small"
          @click="onSave"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getBscList,
  saveDelivery,
  getCountryList,
  getWordsList,
  getBsTransList,
  getFiscalList,
  getAgentList
} from '@/api/sales-of-agent-plan'
import dayjs from 'dayjs'

function formPrama() {
  return {
    companyId: undefined,
    companyName: undefined,
    volume: undefined,
    serviceName: '',
    serviceId: undefined,
    type: '0',
    bscId: '',
    bscName: '',
    bscTransId: '',
    countryId: '',
    year: undefined,
    period: undefined,
    weight: undefined,
    remark: undefined // 备注
  }
}
@Component({
  name: '',
  components: {},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  }
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private formLoading: boolean = false
  private selectLoading: boolean = false
  private innerVisible: boolean = false
  private selectForm: any = formPrama()
  private tableData: any[] = []
  private countryList: any[] = []
  private flightList: any[] = []
  private fiscalList:any[] = []
  private selectOption:any[] = []
  private companyList = []
  private typelist = []
  private formRules = {
    companyId: { required: true, message: '请选择所属公司', trigger: 'change' },
    type: { required: true, message: '请选择业务类型', trigger: 'change' },
    bscId: { required: true, message: '请选择订舱服务', trigger: 'change' },
    weight: { required: true, message: '重量不能为空', trigger: 'blur' },
    volume: { required: true, message: '体积不能为空', trigger: 'blur' },
    year: { required: true, message: '请选择年度', trigger: 'change' },
    period: { required: true, message: '请选择期间', trigger: 'change' }
  }
  private weekdays1: any = [
    { label: '星期一', value: 1 },
    { label: '星期二', value: 2 },
    { label: '星期三', value: 3 },
    { label: '星期四', value: 4 },
    { label: '星期五', value: 5 },
    { label: '星期六', value: 6 },
    { label: '星期日', value: 7 }
  ]
  private searchForm: any = {
    shipDay: undefined,
    customDay: undefined,
    orgName: undefined,
    serviceCode: undefined
  }
  private keyType: any = '1'
  private keyWord: any = ''
  private isType: any = ''

  /* computed */
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }
  get custId():string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }
  get custName():string {
    const info = UserModule.info || {}
    const custName = (info as any).custName
    return custName
  }

  /* methods */
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
  private showServiceLine() {
    if (!this.selectForm.bscId) {
      this.$message.warning('请选择服务')
      return
    }
    this.isType = this.selectForm.type
    const params = {
      page: 1,
      size: 999,
      model: {
        id: this.selectForm.bscId,
        ...this.searchForm
      }
    }
    this.innerVisible = true
    // if (this.selectForm.type === '1' || this.selectForm.type === '2') {
    this.$nextTick(() => {
      const root: any = this.$refs.tableSelect
      root.clearSelection()
    })
    // }
    this.loading = true
    getBsTransList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.tableData = data.result || []
        const { type, bscTransId } = this.selectForm
        if (bscTransId) {
          const arr = this.selectForm.bscTransId.split(',')
          arr.map((a: any) => {
            const item = this.tableData.find((it: any) => it.id === a || `${it.id}` === a)
            if (item) {
              this.$nextTick(() => {
                const root: any = this.$refs.tableSelect
                root.toggleRowSelection(item, true)
              })
            }
          })
        }
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private onSearch() {
    if (this.keyType === '1') {
      this.searchForm.serviceCode = this.keyWord
      this.searchForm.orgName = undefined
    } else {
      this.searchForm.serviceCode = undefined
      this.searchForm.orgName = this.keyWord
    }
    this.showServiceLine()
  }
  private rowClick(row: any) {
    // if (this.selectForm.type === '1' || this.selectForm.type === '2') return
    // this.selectForm.serviceId = row.serviceCode
    // this.selectForm.serviceName = row.orgName + '/' + row.serviceCode
    // this.selectForm.bscTransId = row.id
    // this.resetRow()
  }
  private resetRow() {
    this.searchForm = {
      shipDay: undefined,
      customDay: undefined,
      orgName: undefined,
      serviceCode: undefined
    }
    this.tableData = []
    this.keyType = '1'
    this.keyWord = ''
    this.isType = ''
    this.selectOption = []
    this.innerVisible = false
  }
  private rowSelectChange(arr: any[]) {
    this.selectOption = arr
  }
  private onCancel() {
    this.resetRow()
  }
  private onSave() {
    const arr = this.selectOption.sort((a: any, b: any) => a.id - b.id)
    this.selectForm.serviceId = arr.map((it: any) => it.serviceCode).join(',')
    this.selectForm.serviceName = arr.map((it: any) => it.orgName + '/' + it.serviceCode).join(',')
    this.selectForm.bscTransId = arr.map((it: any) => it.id).join(',')
    this.resetRow()
  }
  private formatDays(row: any, column: any, cellValue: any) {
    const { weekdays1 } = this
    const result = weekdays1.find((item: any) => item.value === cellValue) || {}
    return result.label || ''
  }
  private onYear() {
    this.selectForm.period = undefined
    this.fiscalList = []
  }
  // 获取业务类型
  private getBusinessType() {
    this.formLoading = true
    const params = {
      type: 'BOOKING_BUSINESS_TYPE'
    }
    getWordsList(params).then((res: any) => {
      if (res.success) {
        this.typelist = res.data || []
      }
      this.formLoading = false
    }).catch((err: any) => {
      this.formLoading = false
      return err
    })
  }
  private getFiscalList() {
    this.selectLoading = true
    const type = (this as any).custType
    const params = {
      page: 1,
      size: 9999,
      year: this.selectForm.year,
      custTag: '1',
      custId: [type === '0' ? this.selectForm.companyId : (this as any).custId]
    }
    getFiscalList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.fiscalList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private async getCountryList() {
    this.selectLoading = true
    await getCountryList().then((res: any) => {
      this.selectLoading = false
      if (res.success) {
        const data = res.data || {}
        this.countryList = data.result || []
      }
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
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
    this.selectForm.companyName = ''
    const item: any = this.companyList.find((it: any) => it.id === val)
    if (item) {
      this.selectForm.companyName = item.name
    }
  }
  private onType() {
    this.flightList = []
    this.selectForm.bscId = ''
    this.selectForm.bscName = ''
    this.selectForm.bscTransId = ''
    this.selectForm.serviceId = ''
    this.selectForm.serviceName = ''
    this.selectForm.countryId = ''
  }
  private async onFlight() {
    await this.getCountryList()
    this.flightList.map((it: any) => {
      if (this.selectForm.bscId === it.id) {
        this.selectForm.countryId = it.countryToId
        this.selectForm.bscName = it.name
      }
    })
    this.selectForm.bscTransId = ''
    this.selectForm.serviceId = ''
    this.selectForm.serviceName = ''
    this.selectOption = []
  }
  private async getBscList() {
    this.selectLoading = true
    const params:any = {
      page: 1,
      size: 99999,
      conveyance: this.selectForm.type,
      countryToId: this.selectForm.countryId
    }
    await getBscList(params)
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result
        this.flightList = result.map((item: any) => {
          item.id = item.id + ''
          return item
        })
        this.selectLoading = false
      }).catch((err: any) => {
        this.selectLoading = false
        return [err, null]
      })
  }

  private filterMethod(query: any, item: any): boolean {
    const name = item.name || ''
    return name.indexOf(query) > -1
  }

  private async setData(row: any) {
    const { list, ...obj } = row
    this.selectForm = {
      ...obj
    }
    try {
      this.formLoading = true
      this.getFiscalList()
      await this.getBscList()
      const item: any = this.flightList.find((it: any) => this.selectForm.bscId === it.id) || {}
      this.selectForm.countryId = item.countryToId
      this.selectForm.bscName = item.name
      await this.getCountryList()
      this.formLoading = false
    } catch (error) {
      this.formLoading = false
      return error
    }
  }
  private resetForm() {
    this.selectForm = formPrama()
  }
  private cancel() {
    this.$emit('cancel')
  }
  private save(params: any) {
    this.formLoading = true
    saveDelivery(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.formLoading = false
        this.$emit('cancel')
        this.$emit('queryAll')
      })
      .catch((err: any) => {
        this.formLoading = false
        return err
      })
  }
  private saveConfirm() {
    const type = (this as any).custType
    const formDom:any = this.$refs.selectForm
    formDom.validate((valid:any) => {
      if (!valid) return false
      const { companyId, companyName, ...form } = this.selectForm
      const params: any = {
        ...form,
        companyId: type === '0' ? companyId : (this as any).custId,
        companyName: type === '0' ? companyName : (this as any).custName
      }
      this.countryList.map((it: any) => {
        if (this.selectForm.countryId === it.id) {
          params.countryName = it.name
        }
      })
      this.flightList.map((it: any) => {
        if (this.selectForm.bscId === it.id) {
          params.bscName = it.name
        }
      })
      const item = this.fiscalList.find((it: any) => it.id === this.selectForm.period)
      if (item) {
        params.periodName = item.fiscalPeriod
      }
      this.save(params)
    })
  }
  private created() {
    this.getBusinessType()
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  display: inline-block;
  width: 49%;
}
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
.input-content {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.input-unit {
  width: 55px;
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

::v-deep .el-dialog__body {
  padding: 10px 20px;
}
</style>
