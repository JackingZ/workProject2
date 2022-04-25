<template>
  <div
    v-loading="formLoading"
    class="app-panel truck-edit"
  >
    <div class="header-top">
      <div style="float: left;">
        {{ isEdit && !isCopy ? '编辑卡派服务' : '新增卡派服务' }}
      </div>
      <el-button
        type="primary"
        size="small"
        @click="goBack"
      >
        返 回
      </el-button>
      <el-button
        type="primary"
        size="small"
        @click="saveData"
      >
        保 存
      </el-button>
    </div>
    <div class="content">
      <el-form
        ref="selectForm"
        :model="selectForm"
        :rules="formRules"
        label-width="120px"
        size="small"
      >
        <div class="form-title">
          基础信息
        </div>
        <el-form-item
          label="服务名称"
          prop="name"
        >
          <el-input
            v-model="selectForm.name"
            placeholder="请输入"
            size="small"
            :maxlength="50"
          />
        </el-form-item>
        <el-form-item
          label="服务简称"
          prop="abbr"
        >
          <el-input
            v-model="selectForm.abbr"
            :maxlength="10"
            placeholder="请输入"
            size="small"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="服务编码"
          prop="ksId"
        >
          <el-input
            v-model="selectForm.ksId"
            placeholder="请输入"
            :maxlength="25"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="服务类型"
          prop="subtypeId"
        >
          <el-select
            v-model="selectForm.subtypeId"
            style="width:100%;"
            size="small"
            filterable
            clearable
            placeholder="请选择"
            @change="onSubtype"
          >
            <el-option
              v-for="item in subTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="计费方式"
          prop="priceType"
        >
          <el-select
            v-model="selectForm.priceType"
            :disabled="!selectForm.subtypeId"
            style="width:100%;"
            size="small"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in countList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="所在国家"
          prop="countryId"
        >
          <el-select
            v-model="selectForm.countryId"
            size="small"
            filterable
            clearable
            placeholder="所在国家"
            style="width:100%;"
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
            v-model="selectForm.stateId"
            :loading="selectLoading"
            placeholder="请选择"
            clearable
            :disabled="!selectForm.countryId"
            filterable
            style="width: 100%"
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
            v-model="selectForm.cityId"
            :loading="selectLoading"
            placeholder="请选择"
            clearable
            :disabled="!selectForm.stateId"
            filterable
            style="width: 100%"
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
            v-model="selectForm.countyId"
            :loading="selectLoading"
            placeholder="区/县"
            clearable
            :disabled="!selectForm.cityId"
            filterable
            style="width:100%;"
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
          label="地址类型"
          prop="addressType"
        >
          <el-select
            v-model="selectForm.addressType"
            placeholder="地址类型"
            filterable
            clearable
            style="width:100%;"
            :disabled="!(selectForm.stateId && selectForm.cityId && selectForm.countyId)"
            @change="onAddressType"
          >
            <el-option
              label="机场"
              value="0"
            />
            <el-option
              label="港口"
              value="1"
            />
            <el-option
              label="火车站"
              value="2"
            />
            <el-option
              label="海外仓"
              value="3"
            />
            <el-option
              label="私人地址"
              value="4"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="地址类别"
          prop="addressCategory"
        >
          <el-radio-group v-model="selectForm.addressCategory">
            <el-radio label="0">
              FBA
            </el-radio>
            <el-radio label="1">
              私人
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="selectForm.addressType !== '4'"
          label="起运地址"
          prop="addressId"
        >
          <el-select
            v-model="selectForm.addressId"
            :loading="selectLoading"
            placeholder="选择地址"
            filterable
            :disabled="!(selectForm.stateId && selectForm.cityId && selectForm.countyId) || !selectForm.addressType"
            clearable
            style="width:100%;"
            @focus="getPortAdressData"
          >
            <el-option
              v-for="item in portList"
              :key="item.key"
              :label="item.fullName"
              :value="item.key"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="密度比"
          prop="density"
        >
          <el-input-number
            v-model="selectForm.density"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="9999"
            :precision="2"
          />
        </el-form-item>
        <el-form-item
          label="分配客户"
          prop="belong"
        >
          <el-select
            v-model="selectForm.belong"
            style="width:100%;"
            size="small"
            clearable
            placeholder="请选择"
          >
            <el-option
              label="直客"
              value="0"
            />
            <el-option
              label="同行"
              value="1"
            />
            <el-option
              label="同行&直客"
              value="2"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="货币单位"
          prop="currencyId"
        >
          <el-select
            v-model="selectForm.currencyId"
            :loading="selectLoading"
            clearable
            filterable
            style="width:100%;"
            placeholder="请选择"
            @focus="geCurrencyList"
          >
            <el-option
              v-for="item in currencyList"
              :key="item.id"
              :label="`${item.name}-${item.sign}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="距离单位"
          prop="umDistance"
        >
          <el-select
            v-model="selectForm.umDistance"
            style="width:100%;"
            size="small"
            :loading="selectLoading"
            placeholder="请选择"
            clearable
            @focus="getUmDistanceList"
          >
            <el-option
              v-for="item in umDistanceList"
              :key="item.value"
              :label="item.label + '-' + item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="重量单位"
          prop="umWeight"
        >
          <el-select
            v-model="selectForm.umWeight"
            style="width:100%;"
            size="small"
            :loading="selectLoading"
            placeholder="请选择"
            clearable
            @focus="getUmWeightList"
          >
            <el-option
              v-for="item in umWeightList"
              :key="item.value"
              :label="item.label + '-' + item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="体积单位"
          prop="umVolume"
          clearable
        >
          <el-select
            v-model="selectForm.umVolume"
            style="width:100%;"
            size="small"
            :loading="selectLoading"
            placeholder="请选择"
            @focus="getUmVolumeList"
          >
            <el-option
              v-for="item in umVolumeList"
              :key="item.value"
              :label="item.label + '-' + item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="支持最大重量"
          prop="weight"
        >
          <el-input-number
            v-model="selectForm.weight"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="999999"
            :precision="2"
          />
        </el-form-item>
        <el-form-item
          label="支持最大体积"
          prop="cubed"
        >
          <el-input-number
            v-model="selectForm.cubed"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="999999"
            :precision="2"
          />
        </el-form-item>
        <el-form-item
          label="限制单位"
          prop="maxVolumeUnit"
        >
          <el-select
            v-model="selectForm.maxVolumeUnit"
            style="width:100%;"
            size="small"
            placeholder="请选择"
          >
            <el-option
              v-for="item in maxUnitList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="默认供应商"
          prop="custId"
        >
          <el-select
            v-model="selectForm.custId"
            clearable
            filterable
            style="width:100%;"
            placeholder="请选择"
            @focus="getCustTypeList"
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
          label="备注"
          prop="remark"
        >
          <el-input
            v-model="selectForm.remark"
            placeholder="请输入"
            :maxlength="100"
          />
        </el-form-item>
        <!--<div class="form-title">
          参数&配置
        </div>
        <el-form-item
          label="同行体积密度"
          prop="densityP"
        >
          <el-input-number
            v-model="selectForm.densityP"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="9999"
            :precision="2"
          />
        </el-form-item>
        <el-form-item
          label="直客体积密度"
          prop="densityC"
        >
          <el-input-number
            v-model="selectForm.densityC"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="9999"
            :precision="2"
          />
        </el-form-item>-->
        <div class="form-title">
          运输条款
        </div>
      </el-form>
      <div>
        <markdown-editor
          ref="markdownEditor"
          v-model="terms"
          :options="{
            hideModeSwitch: true,
            previewStyle: 'tab',
            toolbarItems: ['heading','bold','italic']
          }"
          height="300px"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  geCurrencyList,
  getCustTypeList,
  getStateByCountry,
  getCityByState,
  getCountyByCity,
  getFbastoreList,
  getPortList,
  saveCardpadData,
  getTruckById
} from '@/api/service-with-truck-service'
import MarkdownEditor from '@/components/MarkdownEditor/index.vue'
import { getWordsList } from '@/api/service-with-booking-service'

function numberValidate(rule: any, value: any, callback: (val?: any) => void) {
  const reg = /[\u4e00-\u9fa5]/
  if (reg.test(value)) {
    callback(new Error('字符不能为中文'))
  } else {
    callback()
  }
}

function formParam() {
  return {
    addressCategory: '0',
    maxWeightUnit: undefined,
    maxVolumeUnit: undefined,
    id: undefined, // 服务编码
    name: undefined, // 服务名称
    abbr: undefined, // 服务简称
    countryId: undefined, // 所在国家
    countyId: undefined,
    stateId: undefined,
    cityId: undefined,
    subtypeId: undefined, // 服务类型
    ksId: undefined, // 关联服务编码
    density: undefined, // 密度比
    belong: undefined, // 分配客户
    umDistance: undefined, // 距离单位
    umWeight: undefined, // 重量单位
    umVolume: undefined, // 体积单位
    densityP: undefined, // 同行体积密度
    densityC: undefined, // 直客体积密度
    terms: undefined, // 条款
    weight: undefined,
    cubed: undefined,
    currencyId: undefined,
    custId: undefined,
    remark: undefined,
    addressType: undefined,
    addressId: undefined,
    priceType: undefined
  }
}

@Component({
  name: 'TruckServiceForm',
  components: {
    MarkdownEditor
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    isCopy: {
      type: Boolean,
      default: false
    },
    subTypeData: {
      type: Array,
      default: () => []
    },
    countryList: {
      type: Array,
      default: () => []
    }
  }
})

export default class extends Vue {
  private selectLoading = false
  private formLoading = false
  private selectForm: any = formParam()
  private serviceCode:any[] = []
  private supplierList:any[] = []
  private currencyList:any[] = []
  private portList:any[] = []
  private stateList: any[] = []
  private cityList: any[] = []
  private countyList: any[] = []
  private countList:any[] = []
  private umDistanceList:any[] = []
  private umWeightList:any[] = []
  private umVolumeList:any[] = []
  private terms = ''
  private props: any = {
    value: 'id',
    label: 'name'
  }
  private formRules = {
    name: [
      { required: true, message: '服务名称不能为空', trigger: 'blur' }
    ],
    abbr: [
      { required: true, message: '服务简称不能为空', trigger: 'blur' }
    ],
    subtypeId: [{ required: true, message: '请选择服务类型', trigger: 'change' }],
    priceType: [{ required: true, message: '请选择计费方式', trigger: 'change' }],
    countryId: [{ required: true, message: '请选择所在国家', trigger: 'change' }],
    stateId: [{ required: true, message: '请选择州/省', trigger: 'change' }],
    cityId: [{ required: true, message: '请选择城市', trigger: 'change' }],
    countyId: [{ required: false, message: '请选择区/县', trigger: 'change' }],
    addressType: [{ required: true, message: '请选择地址类型', trigger: 'change' }],
    addressCategory: [{ required: true, message: '请选择地址类别', trigger: 'change' }],
    addressId: [{ required: true, message: '请选择起运地址', trigger: 'change' }],
    ksId: [{ required: true, message: '服务编码不能为空', trigger: 'blur' }],
    density: [
      { required: true, message: '密度比不能为空', trigger: 'blur' },
      {
        validator: numberValidate,
        trigger: 'blur'
      }
    ],
    belong: [{ required: true, message: '请选择分配客户', trigger: 'change' }],
    weight: [{ required: true, message: '支持最大重量不能为空', trigger: 'blur' }],
    cubed: [{ required: true, message: '支持最大体积不能为空', trigger: 'blur' }],
    currencyId: [{ required: true, message: '请选择货币单位', trigger: 'change' }],
    umDistance: [{ required: true, message: '请选择距离单位', trigger: 'change' }],
    umWeight: [{ required: true, message: '请选择重量单位', trigger: 'change' }],
    umVolume: [{ required: true, message: '请选择体积单位', trigger: 'change' }],
    // custId: [{ required: true, message: '默认供应商不能为空', trigger: 'change' }],
    densityP: [
      { required: true, message: '请选择同行体积密度', trigger: 'change' },
      {
        validator: numberValidate,
        trigger: 'blur'
      }
    ],
    densityC: [
      { required: true, message: '请选择直客体积密度', trigger: 'change' },
      {
        validator: numberValidate,
        trigger: 'blur'
      }
    ]
  }

  get subTypeList() {
    return (this as any).subTypeData || []
  }
  get maxUnitList() {
    if (this.selectForm.subtypeId === '0') {
      return [
        {
          id: 'pallet',
          name: '托'
        },
        {
          id: 'parcel',
          name: '单票'
        },
        {
          id: ' box',
          name: '单箱'
        }
      ]
    }
    if (this.selectForm.subtypeId === '1') {
      return [
        {
          id: 'vehicle',
          name: '车型'
        },
        {
          id: 'parcel',
          name: '单票'
        },
        {
          id: ' box',
          name: '单箱'
        }
      ]
    }
    return []
  }

  /** method */
  private async getUmDistanceList() {
    this.selectLoading = true
    await getWordsList({ type: 'DISTANCE_TYPE' }).then((res: any) => {
      this.selectLoading = false
      if (res.success) {
        this.umDistanceList = res.data || []
      }
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }

  private async getUmWeightList() {
    this.selectLoading = true
    await getWordsList({ type: 'weight_type' }).then((res: any) => {
      this.selectLoading = false
      if (res.success) {
        this.umWeightList = res.data || []
      }
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }

  private async getUmVolumeList() {
    this.selectLoading = true
    await getWordsList({ type: 'VOLUME_TYPE' }).then((res: any) => {
      this.selectLoading = false
      if (res.success) {
        this.umVolumeList = res.data || []
      }
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }

  private async setData(row: any) {
    const { terms, name, addressCategory, abbr, id, ksId, ...form } = row
    this.selectForm = {
      addressCategory: addressCategory || '0',
      ...form,
      name: (this as any).isCopy ? undefined : name,
      abbr: (this as any).isCopy ? undefined : abbr,
      id: (this as any).isCopy ? undefined : id,
      ksId: (this as any).isCopy ? undefined : ksId
    }
    this.formLoading = true
    try {
      const res = await getTruckById({
        id: row.id
      })
      const data = res.data || {}
      this.setTerms(data.terms)
      await this.geCurrencyList()
      await this.getCustTypeList()
      this.onCountType()
      await this.getUmDistanceList()
      await this.getUmWeightList()
      await this.getUmVolumeList()
      await this.getStateList()
      await this.getCityList()
      await this.getCountyList()
      if (this.selectForm.countryId && this.selectForm.stateId && this.selectForm.cityId && this.selectForm.countyId && this.selectForm.addressType && this.selectForm.addressType !== '4') {
        await this.getPortAdressData()
      }
      this.formLoading = false
    } catch (error) {
      this.formLoading = false
      return error
    }
  }
  private reset() {
    (this.$refs.markdownEditor as MarkdownEditor).setHtml('')
    this.terms = ''
  }
  private setTerms(val: any) {
    (this.$refs.markdownEditor as MarkdownEditor).setHtml(val)
  }
  // 返回
  private goBack() {
    this.resetForm()
    this.$emit('closeForm')
  }
  // 保存
  private saveData() {
    const editForm:any = this.$refs.selectForm
    const html = (this.$refs.markdownEditor as MarkdownEditor).getHtml()
    editForm.validate((valid: any) => {
      if (!valid) return false
      this.formLoading = true
      const { countryId, stateId, cityId, countyId, ...form } = this.selectForm
      const countryList = (this as any).countryList
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

      this.portList.forEach((item) => {
        if (item.key === params.addressId) {
          params.addressName = item.fullName
        }
      })
      this.supplierList.forEach(item => {
        if (item.id === params.custId) {
          params.custName = item.name
        } else {
          params.custName = ''
        }
      })
      this.subTypeList.find((item:any) => { // 类型
        if (item.id === params.subtypeId) {
          params.subtypeName = item.name
        }
      })
      this.currencyList.map((it: any) => {
        if (it.id === params.currencyId) {
          params.currencyName = it.name
        }
      })
      params.terms = html
      saveCardpadData(params).then((res:any) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.formLoading = false
        this.resetForm()
        this.$emit('saveConfirm')
      }).catch(err => {
        this.formLoading = false
        return err
      })
    })
  }
  // 重置表单
  private resetForm() {
    this.selectForm = formParam()
    this.stateList = []
    this.cityList = []
    this.countyList = []
    this.reset()
    this.clearValidate()
  }
  // 清除校验
  private clearValidate() {
    const editForm: any = this.$refs.selectForm
    this.$nextTick(() => {
      editForm.clearValidate()
    })
  }
  private onSubtype() {
    this.selectForm.custId = undefined
    this.selectForm.priceType = undefined
    this.supplierList = []
    this.selectForm.maxWeightUnit = undefined
    this.selectForm.maxVolumeUnit = undefined
    if (this.selectForm.subtypeId === '0') {
      this.selectForm.maxWeightUnit = 'pallet'
      this.selectForm.maxVolumeUnit = 'pallet'
    }
    if (this.selectForm.subtypeId === '1') {
      this.selectForm.maxWeightUnit = 'vehicle'
      this.selectForm.maxVolumeUnit = 'vehicle'
    }
    this.onCountType()
  }
  private onCountType() {
    if (this.selectForm.subtypeId === '0') {
      this.countList = [
        { name: '托数', id: '1' },
        { name: '重量&方数', id: '2' }

      ]
    } else {
      this.countList = [
        { name: '车型', id: '0' }
      ]
    }
  }

  // 获取货币列表
  private async geCurrencyList() {
    this.selectLoading = true
    const params = {
      page: 1,
      size: 999
    }
    await geCurrencyList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.currencyList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  // 获取供应商列表
  private async getCustTypeList() {
    const params = {
      page: 1,
      size: 9999,
      cas: 'S',
      typeId: '01',
      subtypeId: (this as any).selectForm.subtypeId
    }
    await getCustTypeList(params).then((res: any) => {
      const data = res.data || {}
      const result = data.result || []
      this.supplierList = JSON.parse(
        JSON.stringify(result)
          .replace(/custName/g, 'name')
          .replace(/custId/g, 'id')
      )
    }).catch((err: any) => {
      return err
    })
  }
  private async getStateList() {
    if (!this.selectForm.countryId) return
    this.selectLoading = true
    await getStateByCountry(this.selectForm.countryId).then((res: any) => {
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
    if (!this.selectForm.stateId) return
    this.selectLoading = true
    await getCityByState(this.selectForm.stateId).then((res: any) => {
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
    if (!this.selectForm.cityId) return
    this.selectLoading = true
    await getCountyByCity(this.selectForm.cityId)
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result || []
        this.countyList = this.cityList
        this.selectLoading = false
      })
      .catch(() => {
        this.countyList = []
        this.selectLoading = false
      })
  }

  private async onCountryChange() {
    this.selectForm.stateId = undefined
    this.onStateChange()
  }
  private onStateChange() {
    this.selectForm.cityId = undefined
    this.onCityChange()
  }
  private onCityChange() {
    this.selectForm.countyId = undefined
  }

  private onAddressType() {
    this.selectForm.addressId = undefined
    this.portList = []
  }

  private async getPortAdressData() {
    if (this.selectForm.addressType === '3') {
      await this.getFbaList()
    } else {
      await this.getPortAdressList()
    }
  }

  private async getFbaList() {
    this.selectLoading = true
    const params = {
      page: 1,
      size: 9999,
      codeSort: 'A',
      countryId: this.selectForm.countryId,
      cityId: this.selectForm.cityId,
      stateId: this.selectForm.stateId
    }
    await getFbastoreList(params)
      .then((res: any) => {
        const result:any[] = res.data.result || []
        this.portList = result.map(item => {
          item.key = item.id
          item.fullName = item.code + '-' + item.address
          return item
        })
        this.selectLoading = false
      }).catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  // 获取港口列表
  private async getPortAdressList() {
    this.selectLoading = true
    const params = {
      page: 1,
      size: 9999,
      countryId: this.selectForm.countryId,
      cityId: this.selectForm.cityId,
      stateId: this.selectForm.stateId,
      type: this.selectForm.addressType
    }
    await getPortList(params)
      .then((res:any) => {
        const result:any[] = res.data.result || []
        this.portList = result.map(item => {
          item.key = item.code ? item.code : item.id
          item.fullName = `${item.key} - ${item.name ? item.name : item.address}`
          return item
        })
        this.selectLoading = false
      }).catch((err:any) => {
        this.selectLoading = false
        return err
      })
  }
}
</script>
<style lang="scss" scoped>
.el-form-item {
  display: inline-block;
  width: 24.9%;
}

.truck-edit{
  padding:0;
  .header-top{
    text-align: right;
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    font-size: 16px;
    color: #666666;
    border-bottom: 1px solid #cccccc;
  }
  .content{
    padding: 20px;;
    .form-title {
      height: 35px;
      line-height: 35px;
      font-size: 16px;
      font-weight: 700;
      background: #f2f2f2;
      padding-left: 20px;
      margin-bottom:20px;
    }
  }
}
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
</style>
