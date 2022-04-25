<template>
  <div v-loading="loading">
    <div
      style="text-align: right;padding: 0 20px 10px 0;"
    >
      <el-button
        v-show="!!selectForm.id && !isEdit"
        :disabled="orderType !== '0' || isEffect === '209'"
        type="primary"
        size="small"
        @click="editForm"
      >
        编辑
      </el-button>
      <el-button
        v-show="!selectForm.id || isEdit"
        :disabled="orderType !== '0' || isEffect === '209'"
        type="primary"
        size="small"
        @click="saveForm"
      >
        保存
      </el-button>
    </div>
    <el-form
      ref="selectForm"
      :model="selectForm"
      :disabled="!isEdit && !!selectForm.id"
      :rules="formRules"
      label-width="110px"
      size="small"
    >
      <el-form-item
        label="船名"
        prop="freighter"
      >
        <el-input
          v-model="selectForm.freighter"
          :maxlength="20"
          show-word-limit
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item
        label="航次"
        prop="ship"
      >
        <el-input
          v-model="selectForm.ship"
          :maxlength="20"
          show-word-limit
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item
        label="服务机构"
        prop="orgId"
      >
        <el-select
          v-model="selectForm.orgId"
          :loading="selectLoading"
          size="small"
          style="width: 100%;"
          placeholder="请输入"
          clearable
          filterable
          @focus="getBsTransList"
          @change="onBsTran"
        >
          <el-option
            v-for="item in bsTransList"
            :key="item.id"
            :label="`${item.serviceCode}-${item.orgName}`"
            :value="item.orgId"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="二程服务机构"
        class="is-required"
      >
        <el-input
          v-model="selectForm.orgName2"
          placeholder="请输入"
          disabled
        />
      </el-form-item>

      <el-form-item
        label="中转港"
        prop="transPortId"
      >
        <el-select
          v-model="selectForm.transPortId"
          :loading="selectLoading"
          :disabled="!selectForm.orgId"
          placeholder="请选择"
          filterable
          clearable
          style="width:100%;"
          size="small"
          @focus="getTransPortList"
        >
          <el-option
            v-for="item in transPortList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="ETA"
        prop="eta"
      >
        <el-date-picker
          v-model="selectForm.eta"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          size="small"
          style="width:100%;"
        />
      </el-form-item>
      <el-form-item
        label="ETD"
        prop="etd"
      >
        <el-date-picker
          v-model="selectForm.etd"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          size="small"
          style="width:100%;"
        />
      </el-form-item>
      <el-form-item
        label="二程ETD"
        prop="etd2"
      >
        <el-date-picker
          v-model="selectForm.etd2"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          size="small"
          style="width:100%;"
        />
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  getPortList,
  getBsTransList,
  saveThrow
} from '@/api/orderlist-at-booking'

function paramsForm() {
  return {
    id: undefined,
    orgId: undefined,
    orgId2: undefined,
    orgName: undefined,
    orgName2: undefined,
    freighter: undefined,
    ship: undefined,
    transPortId: undefined,
    transPortName: undefined,
    eta: undefined,
    etd: undefined,
    etd2: undefined
  }
}

@Component({
  name: 'threeForm',
  components: {},
  props: {
    isStatus: {
      type: String,
      default: ''
    },
    isEffect: {
      type: String,
      default: ''
    },
    isOrder: {
      type: Object,
      default: () => ({})
    },
    orderType: {
      type: String,
      default: ''
    }
  }
})

export default class extends Vue {
  /* data */
  private selectForm: any = paramsForm()
  private formRules: any = {
    freighter: [
      { required: true, message: '船名不能为空', trigger: 'blur' }
    ],
    ship: [
      { required: true, message: '航次不能为空', trigger: 'blur' }
    ],
    orgId: [
      { required: true, message: '请选择服务机构', trigger: 'change' }
    ],
    eta: [
      { required: true, message: '请选择ETA', trigger: 'change' }
    ],
    etd: [
      { required: true, message: '请选择ETD', trigger: 'change' }
    ]
  }
  private loading: boolean = false
  private selectLoading: boolean = false
  private bsTransList: any[] = []
  private etd2List: any[] = []
  private etdList: any[] = []
  private transPortList: any[] = []
  private etaList: any[] = []
  private orderRow: any = {
    bsId: undefined,
    tranCountry: undefined,
    businessType: undefined
  }
  private isEdit: boolean = false

  /** computed */
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }
  /* methods */
  // 初始化
  private async init(data: any) {
    this.loading = true
    const obj = (this as any).isOrder || {}
    this.orderRow.businessType = obj.businessType
    this.orderRow.bsId = obj.bsId
    try {
      await this.getBsTransList()
      const form = data || {}
      Object.assign(this.selectForm, form)
      if (this.selectForm.id) {
        this.onBsTran()
        await this.getTransPortList()
      }
    } catch (error) {
      this.loading = false
    }
    this.loading = false
  }
  private editForm() {
    this.isEdit = true
  }
  private saveForm() {
    const that = this as any
    const editForm: any = that.$refs.selectForm
    const order = (this as any).isOrder
    editForm.validate((valid: any) => {
      if (!valid) return false
      const params: any = {
        ...this.selectForm,
        bookingId: order.id,
        status: (this as any).isStatus
      }
      this.transPortList.map((it: any) => {
        if (params.transPortId === it.id) {
          params.transPortName = it.name
        }
      })
      this.edit(params)
    })
  }
  private edit(params: any) {
    this.loading = true
    saveThrow(params)
      .then((res: any) => {
        this.loading = false
        this.$message.success('保存成功')
        this.$emit('refresh')
        this.isEdit = false
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

  private reset() {
    this.selectForm = paramsForm()
    this.isEdit = false
    this.$nextTick(() => {
      const editForm: any = this.$refs.selectForm
      editForm.clearValidate()
    })
  }

  private async getBsTransList() {
    const params = {
      page: 1,
      size: 999,
      model: {
        id: this.orderRow.bsId
      }
    }
    this.selectLoading = true
    await getBsTransList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.bsTransList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private onBsTran() {
    const item = this.bsTransList.find((it: any) => it.orgId === this.selectForm.orgId) || {}
    this.selectForm.orgName = item.orgName || undefined
    this.selectForm.orgId2 = item.orgId2 || undefined
    this.selectForm.orgName2 = item.orgName2 || undefined
    this.selectForm.transPortId = item.entreport || undefined
    this.orderRow.tranCountry = item.entreportCountryId || undefined
  }

  private async getTransPortList() {
    this.selectLoading = true
    const params = {
      page: 1,
      size: 99999,
      type: this.orderRow.businessType,
      countryId: this.orderRow.tranCountry
    }
    await getPortList(params)
      .then((res: any) => {
        this.selectLoading = false
        const data = res.data || {}
        this.transPortList = data.result || []
      })
      .catch((err: any) => {
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

.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
</style>
