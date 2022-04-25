<template>
  <el-dialog
    title="分配"
    width="750px"
    :visible="visible"
    :close-on-click-modal="false"
    @close="visible = false"
  >
    <el-form
      ref="form"
      v-loading="loading"
      :model="form"
      :rules="formRules"
      label-width="110px"
      size="small"
    >
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form-item
            label="分配客户"
            label-width="80px"
            prop="customerId"
          >
            <el-select
              v-model="form.customerId"
              filterable
              clearable
              placeholder="请选择分配客户"
              @change="customerChange"
            >
              <el-option
                v-for="item in agentList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="预警值">
            <el-select
              v-model="form.warning"
              filterable
              clearable
              placeholder="请选择预警值"
            >
              <el-option
                v-for="i in warningList"
                :key="i.value"
                :label="i.label"
                :value="i.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider />
      <el-row
        v-for="(item, i) in form.aviationSectionList"
        :key="i"
        :gutter="20"
      >
        <el-col :span="11">
          <el-form-item
            label="航空公司"
            label-width="80px"
            :rules="[
              {required: true, message: '请选择航空公司', trigger: 'change'}
            ]"
          >
            <el-select
              v-model="item.sectionId"
              filterable
              clearable
              placeholder="请选择航空公司"
              @change="val => sectionChange(val, i)"
              @focus="sectionFocus(i)"
            >
              <el-option
                v-for="airlines in airlinesList"
                :key="airlines.airlineId"
                :label="airlines.airlineCompany"
                :value="airlines.airlineId"
                :disabled="airlines.disabled"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item
            label="分配号段数"
            :rules="[
              {required: true, message: '输入分配号段数', trigger: 'blur'}
            ]"
          >
            <el-input-number
              v-model="item.num"
              :disabled="!item.sectionId"
              :max="item.maxNum"
              controls-position="right"
              placeholder="输入分配号段数"
            />
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button
            type="text"
            @click="deleteRow(i)"
          >
            删除
          </el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-button
          plain
          icon="el-icon-plus"
          style="width: 100%"
          @click="addRow"
        >
          新增分配
        </el-button>
      </el-row>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        :disabled="loading"
        @click="visible = false"
      >
        取 消
      </el-button>
      <el-button
        type="primary"
        :disabled="loading"
        @click="submit"
      >
        分 配
      </el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { getAgentList } from '@/api/jht-agent-management'
import { getImportAirlinesList, distribution } from '@/api/system-in-air-them-roughly'

@Component({
  name: 'allotModal'
})
export default class AllotModal extends Vue {
  /* data */
  private visible: boolean = false
  private loading: boolean = false
  private form: any = {
    customerId: undefined,
    customerName: '',
    warning: 80,
    aviationSectionList: [
      {
        maxNum: 0,
        num: 0,
        sectionId: undefined,
        sectionName: ''
      }
    ]
  }
  private formRules: any = {
    customerId: [
      {
        required: true, message: '请选择客户', trigger: 'change'
      }
    ]
  }
  private agentList: any[] = []
  private warningList: any[] = []
  private airlinesList: any[] = []

  /* computed */
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
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

  /* methods */
  private submit() {
    (this.$refs.form as any).validate((vali: boolean) => {
      if (vali) {
        const params = {
          aviationCustomer: {
            customerId: this.form.customerId,
            customerName: this.form.customerName,
            warning: this.form.warning
          },
          aviationSectionList: this.form.aviationSectionList.map((e: any) => {
            return {
              num: e.num,
              sectionId: e.sectionId,
              sectionName: e.sectionName,
              warning: this.form.warning
            }
          })
        }
        this.loading = true
        distribution(params).then((res: any) => {
          this.loading = false
          if (res.success) {
            this.$message.success('分配成功')
            this.visible = false
            this.$emit('load')
          }
        }).catch((err: any) => {
          this.loading = false
          return err
        })
      }
    })
  }

  private addRow() {
    this.form.aviationSectionList = [...this.form.aviationSectionList, {
      maxNum: 0,
      num: 0,
      sectionId: undefined,
      sectionName: ''
    }]
  }

  private deleteRow(i: number) {
    this.form.aviationSectionList = this.form.aviationSectionList.filter((e: any, index: number) => index !== i)
  }

  private customerChange(val: any) {
    this.form.customerName = ''
    const customer = this.agentList.find((e: any) => e.id === val)
    if (customer) {
      this.form.customerName = customer.name
    }
  }

  private sectionChange(val: any, i: any) {
    this.form.aviationSectionList[i].sectionName = ''
    this.form.aviationSectionList[i].maxNum = 0
    this.form.aviationSectionList[i].num = 0
    const section = this.airlinesList.find((e: any) => e.airlineId === val)
    if (section) {
      this.form.aviationSectionList[i].sectionName = section.airlineCompany
      this.form.aviationSectionList[i].maxNum = section.surplus
    }
  }

  private sectionFocus(i: number) {
    // const focusItem = this.form.aviationSectionList[i]
    const selectList = this.form.aviationSectionList.map((e: any) => e.sectionId)
    this.airlinesList = this.airlinesList.map((e: any) => {
      e.disabled = false
      if (selectList.find((s: any) => s === e.airlineId)) {
        e.disabled = true
      }
      return e
    })
  }

  private show() {
    this.warningList = []
    for (let i = 0; i < 100; i++) {
      this.warningList.push({
        label: `${i}%`,
        value: i
      })
    }
    this.visible = true
    this.agentList = []
    this.form = {
      customerId: undefined,
      customerName: '',
      warning: 80,
      aviationSectionList: [
        {
          maxNum: 0,
          num: 0,
          sectionId: undefined,
          sectionName: ''
        }
      ]
    }
    this.getAgentList()
    this.getImportAirlinesList()
    this.$nextTick(() => {
      (this.$refs.form as any).resetFields()
    })
  }

  private getImportAirlinesList() {
    getImportAirlinesList().then((res: any) => {
      if (res.success) {
        this.airlinesList = (res.data || []).map((e: any) => {
          e.disabled = false
          return e
        })
      }
    }).catch((err: any) => {
      return err
    })
  }

  private getAgentList() {
    const type = (this as any).custType
    const stype = (this as any).custSubtype
    let subtype = '1'
    if (type === '0') {
      subtype = '1'
    } else if (type === '2' && stype === '1') {
      subtype = '2'
    }
    const params = {
      parentId: (this as any).custId,
      subtype,
      page: 1,
      size: 999
    }
    getAgentList(params).then((res: any) => {
      if (res.success) {
        const data = res.data || {}
        this.agentList = data.result || []
      }
    }).catch((err: any) => {
      return err
    })
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep{
    .el-divider--horizontal{
      margin: 0 0 20px 0;
    }
  }
</style>
