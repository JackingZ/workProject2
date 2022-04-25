<template>
  <div v-loading="personalLoading">
    <el-form
      ref="personalForm"
      :model="personalForm"
      label-width="120px"
      style="padding-right: 20px;"
      size="small"
    >
      <el-form-item label="关联业务员">
        <el-select
          v-model="personalForm.salesId"
          placeholder="请选择"
          size="small"
          clearable
          style="width:100%;"
        >
          <el-option
            v-for="(item, index) in salerOptions"
            :key="index"
            :label="item.realName + ' - ' + item.deptName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="关联财务人员">
        <el-select
          v-model="personalForm.financeStaff"
          placeholder="请选择"
          size="small"
          clearable
          multiple
          style="width:100%;"
        >
          <el-option
            v-for="(item, index) in financeStaffOptions"
            :key="index"
            :label="item.realName + ' - ' + item.deptName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="关联运营客服">
        <el-select
          v-model="personalForm.customerServicer"
          placeholder="请选择"
          size="small"
          clearable
          multiple
          style="width:100%;"
        >
          <el-option
            v-for="(item, index) in customerServicerOptions"
            :key="index"
            :label="item.realName + ' - ' + item.deptName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="是否代管"
        prop="ifManage"
      >
        <el-radio-group
          v-model="personalForm.ifManage"
        >
          <el-radio :label="0">
            否
          </el-radio>
          <el-radio :label="1">
            是
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div style="text-align: right;margin-top: 10px;">
      <el-button
        type="primary"
        size="small"
        @click="close"
      >
        取 消
      </el-button>
      <el-button
        type="primary"
        size="small"
        @click="confirm"
      >
        确 定
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getUserList,
  getStaffList,
  saveStaff,
  getAgentById
} from '@/api/jht-customer-management'
@Component({
  name: 'personal',
  components: {},
  props: {
    scType: {
      type: Boolean,
      default: false
    }
  }
})
export default class extends Vue {
  private personalForm: any = {
    salesId: undefined,
    ifManage: 0,
    financeStaff: [],
    customerServicer: []
  }
  private salerOptions: any[] = []
  private financeStaffOptions: any[] = []
  private customerServicerOptions: any[] = []
  private personalLoading: boolean = false
  private currentId = ''
  private isFinancal: boolean = false
  private isCustomer: boolean = false
  // computed
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }
  get parentId(): string {
    const info = UserModule.info || {}
    const parentId = (info as any).parentId
    return parentId
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
  private async setData(row: any) {
    const { parentId, id, ifManage } = row
    this.currentId = id
    this.personalForm.ifManage = ifManage || 0
    const scType = (this as any).scType // 二级代理商
    if (scType) {
      try {
        this.personalLoading = true
        const res = await getAgentById({ id: parentId })
        const data = res.data || {}
        const grandId = data.parentId
        this.isFinancal = data.ifFinance === 1 // duli
        this.isCustomer = data.ifCustomer === 1 // fengongsi
        // 二级分公司
        if (this.isCustomer && !this.isFinancal) {
          this.getUserList(parentId, 'saler')
          this.getUserList(grandId, 'customer-finance')
        } else if (this.isCustomer && this.isFinancal) {
          this.getUserList(grandId, 'customer')
          this.getUserList(parentId, 'finance-saler')
        } else {
          this.getUserList(parentId)
        }
        this.personalLoading = false
      } catch (error) {
        this.personalLoading = false
        return error
      }
    } else {
      this.getUserList(parentId)
    }
    this.getStaffList(id)
  }
  private getStaffList(id: string) {
    const ifManage = JSON.parse(JSON.stringify(this.personalForm.ifManage))
    this.personalForm = {
      ifManage,
      financeStaff: [],
      customerServicer: [],
      salesId: ''
    }
    this.personalLoading = true
    getStaffList({
      custId: id
    })
      .then((res: any) => {
        const data = res.data || []
        this.personalForm = {
          ifManage,
          financeStaff: data.filter((item: any) => item.type === '0').map((e: any) => e.userId),
          customerServicer: data.filter((item: any) => item.type === '1').map((e: any) => e.userId),
          salesId: (data.find((item: any) => item.type === '2') || {}).userId
        }
        // data.map((item: any) => {
        //   if (item.type === '0') {
        //     this.personalForm.financeStaff.push(item.userId)
        //   }
        //   if (item.type === '1') {
        //     this.personalForm.customerServicer.push(item.userId)
        //   }
        //   if (item.type === '2') {
        //     this.personalForm.salesId = item.userId
        //   }
        // })
        this.personalLoading = false
      })
      .catch((err: any) => {
        this.personalLoading = false
        return err
      })
  }
  private getUserList(id: string, str?: string) {
    const params: any = {
      custId: id
    }
    getUserList(params)
      .then((res: any) => {
        const data = res.data
        const arr = data || []
        if (str === 'customer') {
          this.customerServicerOptions = arr.filter((it: any) => it.postType === 2)
        } else if (str === 'saler') {
          this.salerOptions = data || []
        } else if (str === 'customer-finance') {
          this.customerServicerOptions = arr.filter((it: any) => it.postType === 2)
          this.financeStaffOptions = arr.filter((it: any) => it.postType === 1)
        } else if (str === 'finance-saler') {
          this.financeStaffOptions = arr.filter((it: any) => it.postType === 2)
          this.salerOptions = data || []
        } else {
          this.salerOptions = data || []
          this.customerServicerOptions = arr.filter((it: any) => it.postType === 2)
          this.financeStaffOptions = arr.filter((it: any) => it.postType === 1)
        }
      })
      .catch((err: any) => {
        return err
      })
  }
  private close() {
    this.personalForm = {
      ifManage: 0,
      salesId: undefined,
      financeStaff: [],
      customerServicer: []
    }
    this.isFinancal = false
    this.isCustomer = false
    this.$emit('close')
  }
  private confirm() {
    this.personalLoading = true
    const params: any = {
      custId: this.currentId,
      ifManage: this.personalForm.ifManage,
      staffs: []
    }
    const arrS: any[] = []
    this.salerOptions.map((it: any) => {
      if (it.id === this.personalForm.salesId) {
        arrS.push({
          name: it.username,
          realName: it.realName,
          userId: this.personalForm.salesId,
          type: '2'
        })
      }
    })
    const arrF: any[] = []
    this.personalForm.financeStaff.map((it: any) => {
      const item: any = this.financeStaffOptions.find((f: any) => f.id === it) || {}
      const { username, realName, id } = item
      if (username && id) {
        arrS.push({
          name: username,
          realName,
          userId: id,
          type: '0'
        })
      }
    })
    const arrC: any[] = []
    this.personalForm.customerServicer.map((it: any) => {
      const item: any = this.customerServicerOptions.find((c: any) => c.id === it) || {}
      const { username, realName, id } = item
      if (username && id) {
        arrS.push({
          name: username,
          realName,
          userId: id,
          type: '1'
        })
      }
    })
    params.staffs = [...arrS, ...arrF, ...arrC]
    saveStaff(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        this.close()
        this.$emit('getTableList')
        this.personalLoading = false
      })
      .catch((err: any) => {
        this.personalLoading = false
        return err
      })
  }
}
</script>

<style lang="scss" scoped>

</style>
