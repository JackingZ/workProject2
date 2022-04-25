<template>
  <div
    v-loading="loading"
    class="app-panel booking-service-edit"
  >
    <div class="header-top">
      <div style="float: left;">
        {{ isEdit && !isCopy ? '编辑订舱服务' : '新增订舱服务' }}
      </div>
      <el-button
        type="primary"
        size="small"
        @click="goBack(false)"
      >
        返 回
      </el-button>
      <el-button
        type="primary"
        size="small"
        @click="save"
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
          label="航线名称"
          prop="name"
        >
          <el-input
            v-model="selectForm.name"
            show-word-limit
            :maxlength="50"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="航线简称"
          prop="alias"
        >
          <el-input
            v-model="selectForm.alias"
            show-word-limit
            :maxlength="50"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="服务编码"
          prop="serviceCode"
        >
          <el-input
            ref="firstInput"
            v-model="selectForm.serviceCode"
            :maxlength="25"
            show-word-limit
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="业务类型"
          prop="conveyance"
        >
          <el-select
            v-model="selectForm.conveyance"
            size="small"
            style="width: 100%;"
            placeholder="请输入"
            clearable
            @change="onSFTool"
          >
            <el-option
              v-for="item in tools"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="服务类型"
          prop="transType"
        >
          <el-select
            v-model="selectForm.transType"
            :disabled="!selectForm.conveyance"
            style="width:100%;"
            size="small"
            placeholder="请选择"
            multiple
          >
            <el-option
              v-for="item in svTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="所属国际航线"
          prop="routeId"
        >
          <el-select
            v-model="selectForm.routeId"
            :loading="interFlightloading"
            :disabled="!selectForm.conveyance"
            style="width:100%;"
            clearable
            filterable
            placeholder="请选择"
            @focus="getInterFlight"
          >
            <el-option
              v-for="item in interFlightList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
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
          label="起运国"
          prop="countryFromId"
        >
          <el-select
            v-model="selectForm.countryFromId"
            :loading="countryLoading"
            placeholder="请选择"
            filterable
            clearable
            style="width:100%;"
            size="small"
            :filter-method="filterMethod"
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
        <el-form-item
          label="起运港"
          prop="portsFromId"
        >
          <el-select
            v-model="selectForm.portsFromId"
            :loading="portloading"
            :disabled="!selectForm.countryFromId || !selectForm.conveyance"
            placeholder="请选择"
            filterable
            clearable
            style="width:100%;"
            size="small"
            @focus="getPortFromList"
          >
            <el-option
              v-for="item in portFromList"
              :key="item.id"
              :label="`${item.code ? item.code + '-' : ''}${item.name}-${item.alias}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="目的国"
          prop="countryToId"
        >
          <el-select
            v-model="selectForm.countryToId"
            :loading="countryLoading"
            placeholder="请选择"
            filterable
            clearable
            style="width:100%;"
            size="small"
            :filter-method="filterMethod"
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
        <el-form-item
          label="目的港"
          prop="portsToId"
        >
          <el-select
            v-model="selectForm.portsToId"
            :loading="portloading"
            :disabled="!selectForm.countryToId || !selectForm.conveyance"
            placeholder="请选择"
            filterable
            clearable
            style="width:100%;"
            size="small"
            @focus="getPortToList"
          >
            <el-option
              v-for="item in portToList"
              :key="item.id"
              :label="`${item.code ? item.code + '-' : ''}${item.name}-${item.alias}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="selectForm.conveyance !== '1' && selectForm.conveyance !== '2'"
          label="货币单位"
          prop="currencyId"
        >
          <el-select
            v-model="selectForm.currencyId"
            :loading="currencyLoading"
            clearable
            filterable
            style="width:100%;"
            placeholder="请选择"
            @focus="getCurrencyList"
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
          v-if="(selectForm.conveyance === '1' || selectForm.conveyance === '2') && selectForm.transType.indexOf('2') !== -1"
          label="整柜货币单位"
          prop="currencyId1"
        >
          <el-select
            v-model="selectForm.currencyId1"
            :loading="currencyLoading"
            clearable
            filterable
            style="width:100%;"
            placeholder="请选择"
            @focus="getCurrencyList"
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
          v-if="(selectForm.conveyance === '1' || selectForm.conveyance === '2') && selectForm.transType.indexOf('3') !== -1"
          label="拼箱货币单位"
          prop="currencyId2"
        >
          <el-select
            v-model="selectForm.currencyId2"
            :loading="currencyLoading"
            clearable
            filterable
            style="width:100%;"
            placeholder="请选择"
            @focus="getCurrencyList"
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
          label="重量单位"
          prop="umWeight"
        >
          <el-select
            v-model="selectForm.umWeight"
            style="width:100%;"
            size="small"
            placeholder="请选择"
            clearable
            :loading="weightUnitLoad"
            @focus="getWeightUnitList"
          >
            <el-option
              v-for="item in weightUnitList"
              :key="item.id"
              :label="item.label + '-' + item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="长度单位"
          prop="umLength"
        >
          <el-select
            v-model="selectForm.umLength"
            style="width:100%;"
            size="small"
            placeholder="请选择"
            clearable
            :loading="lengthUnitLoad"
            @focus="getLengthUnitList"
          >
            <el-option
              v-for="item in lengthUnitList"
              :key="item.id"
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
            :max="99999"
            :precision="2"
          />
        </el-form-item>

        <el-form-item
          label="支持最大长度"
          prop="length"
        >
          <el-input-number
            v-model="selectForm.length"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="99999"
            :precision="2"
          />
        </el-form-item>
        <el-form-item
          label="体积密度比"
          prop="densityRatio"
        >
          <el-input-number
            v-model="selectForm.densityRatio"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="99999"
            :step="1"
            step-strictly
          />
        </el-form-item>
        <el-form-item
          label="体积重"
          prop="volumeWeight"
        >
          <el-input-number
            v-model="selectForm.volumeWeight"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="99999999"
            :step="1"
            step-strictly
          />
        </el-form-item>

        <el-form-item
          label="默认供应商"
          prop="custId"
        >
          <el-select
            v-model="selectForm.custId"
            :loading="supplierLoading"
            clearable
            filterable
            style="width:100%;"
            placeholder="请选择"
            @focus="getCustTypeList"
          >
            <el-option
              v-for="item in supplierList"
              :key="item.id"
              :label="item.name ? item.name : '--'"
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
import { getFlightList } from '@/api/operation-of-international-flight'
import { getCountryList } from '@/api/operation-of-service-agency'
import { getPortList } from '@/api/operation-of-port-management'
import { getCurrencyList } from '@/api/operation-of-rate'
import {
  getCustTypeList,
  getByIds,
  saveBs,
  getWordsList
} from '@/api/service-with-booking-service'

function paramsForm() {
  return {
    belong: undefined,
    serviceCode: undefined,
    remark: undefined,
    name: undefined,
    alias: undefined,
    conveyance: undefined,
    transType: [],
    routeId: undefined,
    routeName: undefined,
    countryFromId: undefined,
    countryFromName: undefined,
    portsFromId: undefined,
    portsFromName: undefined,
    countryToId: undefined,
    countryToName: undefined,
    portsToId: undefined,
    portsToName: undefined,
    currencyId: undefined,
    currencyName: undefined,
    currencyId1: undefined,
    currencyName1: undefined,
    currencyId2: undefined,
    currencyName2: undefined,
    umWeight: undefined,
    umLength: undefined,
    weight: undefined,
    length: undefined,
    custId: undefined,
    custName: undefined,
    shippingTerms: undefined,
    densityRatio: undefined,
    volumeWeight: undefined
  }
}

@Component({
  name: 'addEditForm',
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
    tools: {
      type: Array,
      default: () => ([])
    }
  }
})

export default class extends Vue {
  /* data */
  private lengthUnitLoad: boolean = false
  private weightUnitLoad: boolean = false
  private lengthUnitList: any[] = []
  private weightUnitList: any[] = []
  private selectForm: any = paramsForm()
  private formRules: any = {
    serviceCode: [
      { required: true, message: '服务编码不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^[a-zA-Z0-9 .·_-]+$/
          if (!value) {
            callback(new Error('服务编码不能为空'))
          } else if (!reg.test(value)) {
            callback(new Error('服务编码不能有中文及特殊字符'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    name: [
      { required: true, message: '航线名称不能为空', trigger: 'blur' }
    ],
    alias: [
      { required: true, message: '航线简称不能为空', trigger: 'change' }
    ],
    conveyance: [
      { required: true, message: '请选择业务类型', trigger: 'change' }
    ],
    transType: [
      { required: true, message: '请选择服务类型', trigger: 'change' }
    ],
    routeId: [{ required: true, message: '请选择国际航线', trigger: 'change' }],
    countryFromId: [
      { required: true, message: '请选择起运国', trigger: 'change' }
    ],
    portsFromId: [
      { required: true, message: '请选择起运港', trigger: 'change' }
    ],
    countryToId: [
      { required: true, message: '请选择目的国', trigger: 'change' }
    ],
    portsToId: [{ required: true, message: '请选择目的港', trigger: 'change' }],
    belong: [{ required: true, message: '分配客户不能为空', trigger: 'change' }],
    umWeight: [
      { required: true, message: '请选择重量单位', trigger: 'change' }
    ],
    umLength: [
      { required: true, message: '请选择长度单位', trigger: 'change' }
    ],
    densityRatio: [
      { required: true, message: '体积密度比不能为空', trigger: 'change' }
    ],
    volumeWeight: [
      { required: true, message: '体积重不能为空', trigger: 'change' }
    ],
    weight: [{ required: true, message: '最大重量不能为空', trigger: 'blur' }],
    length: [{ required: true, message: '最大长度不能为空', trigger: 'blur' }],
    currencyId: [
      { required: true, message: '请选择货币单位', trigger: 'change' }
    ],
    custId: [
      { required: true, message: '默认供应商不能为空', trigger: 'change' }
    ],
    currencyId1: [
      { required: true, message: '请选择整柜货币单位', trigger: 'change' }
    ],
    currencyId2: [
      { required: true, message: '请选择拼箱货币单位', trigger: 'change' }
    ]
  }
  private terms = ''
  private loading: boolean = false
  private supplierLoading: boolean = false
  private supplierList: any[] = []
  private currencyLoading: boolean = false
  private currencyList: any[] = []
  private interFlightloading: boolean = false
  private interFlightList: any[] = []
  private countryLoading: boolean = false
  private countryList: any[] = []
  private allCountryList: any[] = []
  private portloading: boolean = false
  private portFromList: any[] = []
  private portToList: any[] = []
  private svTypes: any[] = []

  /* methods */
  private setTerms(val: any) {
    (this.$refs.markdownEditor as MarkdownEditor).setHtml(val)
  }
  // 初始化
  private init(data?: any) {
    this.selectForm = paramsForm()
    this.$nextTick(async() => {
      const root: any = this.$refs.selectForm
      root.clearValidate()
      if ((this as any).isCopy) {
        const { id, name, alias, serviceCode, transType, ...obj } = data
        this.selectForm = {
          ...obj,
          transType: transType.split(',')
        }
      } else if ((this as any).isEdit) {
        const { transType, ...obj } = data
        this.selectForm = {
          ...obj,
          transType: transType.split(',')
        }
      } else {
        return
      }
      // this.selectForm.transType = transType.split(',')
      this.loading = true
      const res = await getByIds([data.id])
      const resD = res.data[0] || {}
      this.setTerms(resD.shippingTerms)
      this.getSvTypes(this.selectForm.conveyance)
      await this.getCustTypeList()
      await this.getCurrencyList()
      await this.getPortFromList()
      await this.getPortToList()
      await this.getCountryList()
      await this.getInterFlight()
      await this.getLengthUnitList()
      await this.getWeightUnitList()
      this.loading = false
    })
  }
  private save() {
    const that = this as any
    const editForm: any = that.$refs.selectForm
    const html = (this.$refs.markdownEditor as MarkdownEditor).getHtml()
    editForm.validate((valid: any) => {
      if (valid) {
        const { transType, ...form } = that.selectForm
        const params = { ...form }
        params.shippingTerms = html
        params.transType = transType.join(',')
        that.interFlightList.map((item: any) => {
          if (item.id === params.routeId) {
            params.routeName = item.name
          }
        })
        that.allCountryList.map((item: any) => {
          if (item.id === params.countryFromId) {
            params.countryFromName = item.name
          }
        })
        that.portFromList.map((item: any) => {
          if (item.id === params.portsFromId) {
            params.portsFromName = (item.code ? item.code + '-' : '') + item.name
          }
        })
        that.allCountryList.map((item: any) => {
          if (item.id === params.countryToId) {
            params.countryToName = item.name
          }
        })
        that.portToList.map((item: any) => {
          if (item.id === params.portsToId) {
            params.portsToName = (item.code ? item.code + '-' : '') + item.name
          }
        })
        that.currencyList.map((item: any) => {
          if (item.id === params.currencyId) {
            params.currencyName = item.name
          }
        })
        that.currencyList.map((item: any) => {
          if (item.id === params.currencyId1) {
            params.currencyName1 = item.name
          }
        })
        that.currencyList.map((item: any) => {
          if (item.id === params.currencyId2) {
            params.currencyName2 = item.name
          }
        })
        that.supplierList.map((item: any) => {
          if (item.id === params.custId) {
            params.custName = item.name
          }
        })
        if (that.isEdit && !that.isCopy) {
          that.edit(params)
        } else {
          that.add(params)
        }
      }
    })
  }
  private add(params: any) {
    this.loading = true
    saveBs(params)
      .then((res: any) => {
        this.loading = false
        if (res.success) {
          this.$message.success('添加成功')
          this.goBack(true)
        }
      })
      .catch((err: any) => {
        this.loading = false
        this.$message.error('添加失败')
        return err
      })
  }
  private edit(params: any) {
    this.loading = true
    saveBs(params)
      .then((res: any) => {
        this.loading = false
        if (res.success) {
          this.goBack(true)
          this.$message.success('编辑成功')
        }
      })
      .catch((err: any) => {
        this.loading = false
        this.$message.error('编辑失败')
        return err
      })
  }
  // 获取长度单位
  private async getLengthUnitList() {
    this.lengthUnitLoad = true
    getWordsList({ type: 'measurement_type' }).then((res: any) => {
      this.lengthUnitLoad = false
      this.lengthUnitList = res.data
    }).catch((err: any) => {
      this.lengthUnitLoad = false
      return err
    })
  }
  // 获取重量单位
  private async getWeightUnitList() {
    this.weightUnitLoad = true
    getWordsList({ type: 'weight_type' }).then((res: any) => {
      this.weightUnitLoad = false
      this.weightUnitList = res.data
    }).catch((err: any) => {
      this.weightUnitLoad = false
      return err
    })
  }
  // 获取默认供应商
  private async getCustTypeList() {
    const params = {
      page: 1,
      size: 9999,
      cas: 'S',
      subtypeId: this.selectForm.conveyance,
      typeId: '02'
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
  // 获取货币单位
  private async getCurrencyList() {
    this.currencyLoading = true
    await getCurrencyList()
      .then((res: any) => {
        const data = res.data || {}
        this.currencyList = data.result || []
        this.currencyLoading = false
      })
      .catch((err: any) => {
        this.currencyLoading = false
        return err
      })
  }
  // 获取起运港
  private async getPortFromList() {
    this.portloading = true
    const params = {
      page: 1,
      size: 99999,
      type: this.selectForm.conveyance,
      countryId: this.selectForm.countryFromId ? this.selectForm.countryFromId : ''
    }
    await getPortList(params)
      .then((res: any) => {
        this.portloading = false
        const data = res.data || {}
        this.portFromList = data.result || []
      })
      .catch((err: any) => {
        return err
      })
  }
  // 获取目的港
  private async getPortToList() {
    this.portloading = true
    const params = {
      page: 1,
      size: 99999,
      type: this.selectForm.conveyance,
      countryId: this.selectForm.countryToId ? this.selectForm.countryToId : ''
    }
    await getPortList(params)
      .then((res: any) => {
        this.portloading = false
        const data = res.data || {}
        this.portToList = data.result || []
      })
      .catch((err: any) => {
        return err
      })
  }
  // 获取国家
  private async getCountryList() {
    this.countryLoading = true
    await getCountryList()
      .then((res: any) => {
        const data = res.data || {}
        this.countryList = data.result || []
        this.allCountryList = data.result || []
        this.countryLoading = false
      })
      .catch((err: any) => {
        this.countryLoading = false
        return err
      })
  }
  // 获取航线
  private async getInterFlight() {
    this.interFlightloading = true
    const params = {
      page: 1,
      size: 99999,
      type: this.selectForm.conveyance
    }
    await getFlightList(params)
      .then((res: any) => {
        this.interFlightloading = false
        const data = res.data || {}
        const result = data.result || []
        this.interFlightList = result.filter((item: any) => item.type === this.selectForm.conveyance)
      })
      .catch((err: any) => {
        return err
      })
  }
  // 获取服务类型
  private getSvTypes(val: any) {
    const params = {
      type: 'BOOKING_BUSINESS_TYPE' + val
    }
    getWordsList(params).then((res: any) => {
      if (res.success) {
        this.svTypes = res.data || []
      }
    }).catch((err: any) => {
      return err
    })
  }
  // 业务类型change
  private onSFTool(val: any) {
    this.selectForm.transType = []
    this.selectForm.routeId = undefined
    this.selectForm.custId = undefined
    this.getSvTypes(val)
  }
  private filterMethod(value: any): void {
    // return (item.name + item.alias).indexOf(query) > -1
    if (value.trim()) {
      const val = value.toUpperCase()
      this.countryList = this.allCountryList.filter((item: any) => {
        return (item.name + '-' + item.alias).toUpperCase().indexOf(val) !== -1
      })
    } else {
      this.countryList = this.allCountryList
    }
  }
  private goBack(flag: boolean) {
    this.setTerms('')
    this.$emit('closeForm', flag)
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  display: inline-block;
  width: 24.9%;
}

.booking-service-edit{
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
    padding: 20px;
    .form-title {
      height: 35px;
      line-height: 35px;
      font-size: 16px;
      font-weight: 700;
      background: rgb(231, 231, 231);
      padding-left: 20px;
      margin-bottom: 20px;
    }
  }
}
::v-deep .el-input-number .el-input__inner{
  text-align: left;
}
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
</style>
