<template>
  <div
    v-loading="formLoading"
    class="app-panel trailer-edit"
  >
    <div class="header-top">
      <div style="float: left;">
        {{ isEdit && !isCopy ? '编辑拖车服务':'新增拖车服务' }}
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
        label-width="110px"
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
            :maxlength="50"
            placeholder="请输入"
            size="small"
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
          />
        </el-form-item>
        <el-form-item
          label="服务编码"
          prop="tsId"
        >
          <el-input
            v-model="selectForm.tsId"
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
          label="所在国家"
          prop="countryId"
        >
          <el-select
            v-model="selectForm.countryId"
            size="small"
            filterable
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
            <!-- <el-option
              label="机场"
              value="0"
            /> -->
            <el-option
              label="港口"
              value="1"
            />
            <el-option
              label="火车站"
              value="2"
            />
            <!-- <el-option
              label="海外仓"
              value="3"
            /> -->
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
import MarkdownEditor from '@/components/MarkdownEditor/index.vue'
import {
  geCurrencyList,
  getCustTypeList,
  saveTrialerData,
  getStateByCountry,
  getCityByState,
  getCountyByCity,
  getFbastoreList,
  getPortList
} from '@/api/service-with-trailers-service'

function formParam() {
  return {
    addressCategory: '0',
    id: undefined, // 服务编码
    name: undefined, // 服务名称
    abbr: undefined, // 服务简称
    countryId: undefined, // 所在国家
    subtypeId: undefined, // 服务类型
    tsId: undefined, // 关联服务编码
    belong: undefined, // 分配客户
    terms: undefined, // 条款
    currencyId: undefined,
    countyId: undefined,
    stateId: undefined,
    cityId: undefined,
    addressType: undefined,
    addressId: undefined,
    custId: undefined,
    remark: undefined
  }
}

@Component({
  name: 'TrailerServiceForm',
  components: {
    MarkdownEditor
  },
  props: {
    subTypeData: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isCopy: {
      type: Boolean,
      default: false
    },
    countryData: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
})

export default class extends Vue {
  private selectForm: any = formParam() // 新增编辑表单
  private formLoading: boolean = false
  private selectLoading: boolean = false
  private serviceCode:any[] = []
  private terms = ''
  private portList:any[] = []
  private stateList: any[] = []
  private cityList: any[] = []
  private countyList: any[] = []
  private supplierList:any[] = []
  private currencyList:any[] = []
  private formRules = {
    name: [{ required: true, message: '服务名称不能为空', trigger: 'blur' }], // 服务名称
    abbr: [
      { required: true, message: '服务简称不能为空', trigger: 'blur' }
    ], // 服务名称
    subtypeId: [{ required: true, message: '请选择服务类型', trigger: 'change' }], // 服务类型
    countryId: [{ required: true, message: '请选择所在国家', trigger: 'change' }], // 所在国家
    stateId: [{ required: true, message: '请选择州/省', trigger: 'change' }],
    cityId: [{ required: true, message: '请选择城市', trigger: 'change' }],
    countyId: [{ required: false, message: '请选择区/县', trigger: 'change' }],
    addressType: [{ required: true, message: '请选择地址类型', trigger: 'change' }],
    addressCategory: [{ required: true, message: '请选择地址类别', trigger: 'change' }],
    addressId: [{ required: true, message: '请选择起运地址', trigger: 'change' }],
    tsId: [{ required: true, message: '服务编码不能为空', trigger: 'blur' }], // 密度比
    density: [{ required: true, message: '密度比不能为空', trigger: 'blur' }], // 起运国
    belong: [{ required: true, message: '请选择分配客户', trigger: 'change' }], // 分配客户
    umDistance: [{ required: true, message: '请选择距离单位', trigger: 'change' }], // 距离单位
    umWeight: [{ required: true, message: '请选择重量单位', trigger: 'change' }], // 重量单位
    umVolume: [{ required: true, message: '请选择体积单位', trigger: 'change' }], // 体积单位
    currencyId: [{ required: true, message: '请选择货币单位', trigger: 'change' }],
    densityP: [{ required: true, message: '请选择同行体积密度', trigger: 'change' }], // 同行体积密度
    densityC: [{ required: true, message: '请选择直客体积密度', trigger: 'change' }] // 同行体积密度
  }

  get subTypeList() {
    return (this as any).subTypeData || []
  }
  get countryList() {
    return (this as any).countryData || []
  }

  /** method */
  private async setData(row: any) {
    this.formLoading = true
    if ((this as any).isCopy) {
      const { id, name, abbr, tsId, addressCategory, terms, ...form }: any = row
      this.selectForm = {
        ...form,
        addressCategory: addressCategory || '0'
      }
    } else {
      const { terms, addressCategory, ...form }: any = row
      this.selectForm = {
        ...form,
        addressCategory: addressCategory || '0'
      }
    }
    try {
      await this.geCurrencyList()
      await this.getCustTypeList()
      await this.getStateList()
      await this.getCityList()
      await this.getCountyList()
      if (this.selectForm.countryId && this.selectForm.stateId && this.selectForm.cityId && this.selectForm.countyId && this.selectForm.addressType) {
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
        }
      })
      this.subTypeList.find((item:any) => { // 类型
        if (item.id === params.subtypeId) {
          params.subtypeName = item.name
        }
      })
      this.currencyList.find((item:any) => {
        if (item.id === params.currencyId) {
          params.currencyName = item.name
        }
      })
      params.terms = html
      saveTrialerData(params).then((res:any) => {
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
    this.supplierList = []
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
        this.countyList = result
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

.trailer-edit{
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
</style>
