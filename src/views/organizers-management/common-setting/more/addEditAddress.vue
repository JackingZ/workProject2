<template>
  <div>
    <el-dialog
      :title="isEdit ? '编辑地址' : '新增地址'"
      :visible.sync="isAddressFormShow"
      :close-on-click-modal="false"
      width="850px"
      @close="cancel"
    >
      <div
        v-loading="isAddressFormLoading"
        class="add-edit-organ"
      >
        <el-form
          ref="editForm"
          :model="addressForm"
          :rules="formRules"
          label-width="120px"
          label-position="right"
          size="small"
        >
          <el-form-item
            label="地址名称"
            prop="name"
          >
            <el-input
              v-model="addressForm.name"
              size="small"
              placeholder="请输入"
              style="width:90%;"
              :maxlength="20"
            />
          </el-form-item>

          <el-form-item
            label="地址类型"
            prop="type"
          >
            <el-select
              v-model="addressForm.type"
              placeholder="请选择"
              style="width:90%;"
              clearable
              filterable
              size="small"
            >
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            label="国家/地区"
            prop="countryId"
          >
            <el-select
              v-model="addressForm.countryId"
              placeholder="请选择"
              filterable
              clearable
              style="width:90%;"
              size="small"
              @change="onCountryChange"
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
            label="州/省"
            prop="stateId"
          >
            <el-select
              v-model="addressForm.stateId"
              :loading="selectLoading"
              placeholder="请选择"
              clearable
              :disabled="!addressForm.countryId"
              filterable
              style="width: 90%;"
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
          </el-form-item>
          <el-form-item
            label="城市"
            prop="cityId"
          >
            <el-select
              v-model="addressForm.cityId"
              :loading="selectLoading"
              placeholder="请选择"
              clearable
              :disabled="!addressForm.stateId"
              filterable
              style="width: 90%;"
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
          </el-form-item>
          <el-form-item
            label="区/县"
            prop="countyId"
          >
            <el-select
              v-model="addressForm.countyId"
              :loading="selectLoading"
              placeholder="区/县"
              clearable
              :disabled="!addressForm.cityId"
              filterable
              style="width:90%;"
              @focus="getCountyList"
            >
              <el-option
                v-for="item in countyList"
                :key="item.id"
                :label="`${item.name}-${item.alias}`"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            label="联系地址"
            prop="address"
          >
            <el-input
              v-model="addressForm.address"
              size="small"
              style="width:90%;"
              placeholder="请输入"
              :maxlength="100"
            />
          </el-form-item>

          <el-form-item
            label="邮政编码"
            prop="postal"
          >
            <el-input
              v-model="addressForm.postal"
              size="small"
              style="width:90%;"
              placeholder="请输入"
              :maxlength="10"
              show-word-limit
            />
          </el-form-item>

          <el-form-item
            label="关联对接人"
            prop="contactId"
          >
            <el-select
              v-model="addressForm.contactId"
              placeholder="请选择"
              filterable
              clearable
              style="width:90%;"
              size="small"
            >
              <el-option
                v-for="item in personData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            label="是否集货地址"
            prop="store"
          >
            <el-radio-group v-model="addressForm.store">
              <el-radio :label="false">
                否
              </el-radio>
              <el-radio :label="true">
                是
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            label="备注"
            prop="remark"
          >
            <el-input
              v-model="addressForm.remark"
              size="small"
              style="width:90%;"
              placeholder="请输入"
              :maxlength="100"
            />
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
          @click="saveAddressConfirm"
        >
          确 定
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
  getStateByCountry,
  getCityByState,
  getCountyByCity
} from '@/api/jht-customer-management'

function addressFormParam() {
  return {
    name: undefined, // 地址名称
    type: undefined, // 地址类型
    countryId: undefined, // 国家地区
    countyId: undefined,
    stateId: undefined,
    cityId: undefined,
    address: undefined, // 地址
    postal: undefined, // 邮编
    contactId: undefined, // 关联对接人
    store: false, // 是否集货地址
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
    },
    isAddressFormShow: {
      type: Boolean,
      default: false
    },
    countryList: {
      type: Array,
      default: () => {
        return []
      }
    },
    typeList: {
      type: Array,
      default: () => ([])
    },
    personData: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
})
export default class extends Vue {
  private isAddressFormLoading = false
  private selectLoading = false
  private addressForm: any = addressFormParam()
  private stateList: any[] = []
  private cityList: any[] = []
  private countyList: any[] = []

  private formRules = {
    name: [
      { required: true, message: '地址名称不能为空', trigger: 'blur' }
    ],
    type: [{ required: true, message: '请选择地址类型', trigger: 'change' }],
    countryId: [{ required: true, message: '请选择国家/地区', trigger: 'change' }],
    stateId: [{ required: true, message: '请选择州/省', trigger: 'change' }],
    cityId: [{ required: true, message: '请选择城市', trigger: 'change' }],
    countyId: [{ required: false, message: '请选择区/县', trigger: 'change' }],
    address: [{ required: true, message: '联系地址不能为空', trigger: 'blur' }],
    contactId: [{ required: true, message: '请选择关联对接人', trigger: 'change' }],
    postal: [
      { required: false, message: '邮政编码不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^[a-zA-Z0-9]*$/
          if (!reg.test(value)) {
            callback(new Error('邮政编码只能包含数字、字母'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
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

  /* methods */
  // 保存人员编辑
  private saveAddressConfirm() {
    const editForm:any = this.$refs.editForm
    editForm.validate((valid:any) => {
      if (!valid) return false
      const countryList = (this as any).countryList
      const { countryId, stateId, cityId, countyId, ...form } = this.addressForm
      const countryName = (countryList.find((item: any) => item.id === countryId) || {}).name
      const stateName = (this.stateList.find((item: any) => item.id === stateId) || {}).name
      const cityName = (this.cityList.find((item: any) => item.id === cityId) || {}).name
      const countyName = (this.countyList.find((item: any) => item.id === countyId) || {}).name
      const params: any = {
        ...form,
        countryId,
        countryName,
        stateName,
        stateId,
        cityName,
        cityId,
        countyId,
        countyName
      }
      this.$emit('saveAddressConfirm', params)
    })
  }

  // 关闭
  private cancel() {
    this.reset()
    this.$emit('closeAddressForm')
  }
  private reset() {
    this.stateList = []
    this.cityList = []
    this.countyList = []
    this.addressForm = addressFormParam()
    this.$nextTick(() => {
      const editDom: any = this.$refs.editForm
      editDom.clearValidate()
    })
  }
  private async setData(row: any) {
    this.isAddressFormLoading = true
    this.addressForm = { ...row }
    try {
      await this.getStateList()
      await this.getCityList()
      await this.getCountyList()
      this.isAddressFormLoading = false
    } catch (error) {
      this.isAddressFormLoading = false
    }
  }
  private async getStateList() {
    if (!this.addressForm.countryId) return
    this.selectLoading = true
    await getStateByCountry(this.addressForm.countryId).then((res: any) => {
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
    if (!this.addressForm.stateId) return
    this.selectLoading = true
    await getCityByState(this.addressForm.stateId).then((res: any) => {
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
    if (!this.addressForm.cityId) return
    this.selectLoading = true
    await getCountyByCity(this.addressForm.cityId)
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
    this.addressForm.stateId = undefined
    this.onStateChange()
  }
  private onStateChange() {
    this.addressForm.cityId = undefined
    this.onCityChange()
  }
  private onCityChange() {
    this.addressForm.countyId = undefined
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  display: inline-block;
  width: 49.5%;
}
</style>
