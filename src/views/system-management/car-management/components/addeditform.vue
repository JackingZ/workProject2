<template>
  <div v-loading="loading">
    <el-form
      ref="userRoot"
      :model="form"
      :rules="formRules"
      label-position="right"
      label-width="100px"
      size="small"
      style="padding: 0 40px 0 20px;"
    >
      <el-form-item
        v-show="custId === '0'"
        label="所属公司"
        prop="custId"
      >
        <el-select
          v-model="form.custId"
          placeholder="所属公司"
          style="width:100%;"
          size="small"
          :loading="selectLoading"
          :disabled="isEdit"
          @focus="getSupplierList"
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
        label="车牌号"
        prop="plateNumber"
      >
        <el-input
          v-model="form.plateNumber"
          placeholder="请输入"
          style="width:100%;"
          :disabled="isEdit"
        />
      </el-form-item>

      <el-form-item
        label="上牌时间"
        prop="plateDate"
      >
        <el-date-picker
          v-model="form.plateDate"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="年/月/日"
          style="width: 100%;"
          :picker-options="{disabledDate: disabledDate}"
        />
      </el-form-item>

      <el-form-item
        label="关联车型"
        prop="vehicleTypeId"
      >
        <el-select
          v-model="form.vehicleTypeId"
          placeholder="请选择"
          style="width:100%;"
          :loading="loadVehicleTypeList"
          @focus="getVehicleTypeList"
        >
          <el-option
            v-for="(item, index) in vehicleTypeList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="车况"
        prop="grade"
      >
        <el-select
          v-model="form.grade"
          placeholder="请选择"
          style="width:100%;"
        >
          <el-option
            label="良好"
            :value="'0'"
          />
          <el-option
            label="维修"
            :value="'1'"
          />
          <el-option
            label="其他"
            :value="'2'"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="保险到期日"
        prop="expire"
      >
        <el-date-picker
          v-model="form.expire"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="年/月/日"
          style="width: 100%;"
        />
      </el-form-item>

      <el-form-item
        label="三者险保额"
        prop="insurance"
      >
        <el-input-number
          v-model="form.insurance"
          class="input-number-valiate"
          :controls="false"
          placeholder="请输入"
          size="small"
          :min="0"
          :precision="2"
        />
      </el-form-item>
      <el-form-item
        label="是否有尾板"
        prop="tailboard"
      >
        <el-radio-group v-model="form.tailboard">
          <el-radio :label="true">
            是
          </el-radio>
          <el-radio :label="false">
            否
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="是否有GPS"
        prop="gps"
      >
        <el-radio-group v-model="form.gps">
          <el-radio :label="true">
            是
          </el-radio>
          <el-radio :label="false">
            否
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import { saveVehicle, getSupplierList, getVehicleTypeList } from '@/api/system-in-vehicle-management'
import { Form } from 'element-ui'
import dayjs from 'dayjs'
@Component({
  name: 'AddEditForm',
  components: {},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  }
})
export default class AddEditForm extends Vue {
  /** ------- data ------- */
  private loading: boolean = false
  private selectLoading: boolean = false
  private loadVehicleTypeList: boolean = false
  private form: any = {
    id: undefined,
    custId: undefined,
    custName: undefined,
    expire: undefined,
    gps: true,
    grade: undefined,
    insurance: undefined,
    plateDate: undefined,
    plateNumber: undefined,
    tailboard: true,
    vehicleTypeId: undefined,
    vehicleTypeName: undefined
  }
  private vehicleTypeList: any[] = []
  private supplierList: any[] = []
  private formRules = {
    custId: [
      { required: true, message: '请选择所属公司', trigger: 'change' }
    ],
    plateNumber: [
      { required: true, message: '车牌号不能为空', trigger: 'blur' },
      { validator: this.validatorPlateNumber, trigger: 'change' }
    ],
    plateDate: [{ required: true, message: '请选择上牌时间', trigger: 'change' }],
    vehicleTypeId: [{ required: true, message: '请选择关联车型', trigger: 'change' }],
    grade: [
      { required: true, message: '请选择车况', trigger: 'change' }
    ],
    expire: [
      { required: true, message: '请选择保险到期日', trigger: 'change' }
    ],
    insurance: [
      { required: true, message: '三者险保额不能为空', trigger: 'blur' }
    ],
    tailboard: [
      { required: true, message: '请选择是否有尾板', trigger: 'change' }
    ],
    gps: [
      { required: true, message: '请选择是否有GPS', trigger: 'change' }
    ]
  }

  /** ------- computed ------- */
  get lang(): string {
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

  // 所属公司Name
  get custName(): string {
    const info = UserModule.info || {}
    const custName = (info as any).custName
    return custName
  }

  /** ------- methods ------- */
  private setCust() {
    this.reset()
    if ((this as any).custId !== '0') {
      this.form.custId = (this as any).custId
      this.form.custName = (this as any).custName
      this.getSupplierList()
    }
  }
  private validatorPlateNumber(rule: any, value: any, callback: any) {
    if (value) {
      const reg = /([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4}))$)|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$)/
      if (!reg.test(value)) {
        callback(new Error('请输入正确的车牌号'))
      } else {
        callback()
      }
    }
  }
  private disabledDate(date: any) {
    return date > dayjs()
  }
  private setData(row: any) {
    // if ((this as any).custId === '0') {
    //   this.getSupplierList()
    // }
    this.reset()
    this.getSupplierList()
    this.getVehicleTypeList()
    this.form = row
  }
  private getSupplierList() {
    this.selectLoading = true
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
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  // 获取车型
  private getVehicleTypeList() {
    const params = {
      page: 1,
      size: 99999
    }
    this.loadVehicleTypeList = true
    getVehicleTypeList(params)
      .then((res: any) => {
        this.loadVehicleTypeList = false
        if (res.success) {
          const data = res.data || {}
          const result = data.result || []
          this.vehicleTypeList = result
        }
      })
      .catch((err: any) => {
        this.loadVehicleTypeList = false
        return err
      })
  }

  // 提交表单
  private saveUser() {
    const root: any = this.$refs.userRoot
    root.validate((valid: any) => {
      if (!valid) return
      this.loading = true
      const params: any = {
        ...(this as any).form
      }
      this.supplierList.map((it: any) => {
        if (it.id === params.custId) {
          params.custName = it.name
        }
      })
      this.vehicleTypeList.map((it: any) => {
        if (it.id === params.vehicleTypeId) {
          params.vehicleTypeName = it.name
        }
      })
      saveVehicle(params)
        .then((res: any) => {
          this.loading = false
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.$emit('getTableList')
          this.reset()
          this.$emit('close')
        })
        .catch(err => {
          this.loading = false
          return err
        })
    })
  }
  // 表单重置
  private reset(): void {
    const form: any = {
      id: undefined,
      custId: undefined,
      custName: undefined,
      expire: undefined,
      gps: true,
      grade: undefined,
      insurance: undefined,
      plateDate: undefined,
      plateNumber: undefined,
      tailboard: true,
      vehicleTypeId: undefined,
      vehicleTypeName: undefined
    }
    this.form = form
    this.$nextTick(() => {
      const formRef = this.$refs.userRoot as Form
      formRef.clearValidate()
    })
  }
}
</script>

<style lang="scss" scoped>
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
</style>
