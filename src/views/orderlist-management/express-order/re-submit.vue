<template>
  <div
    v-loading="detailLoading"
  >
    <div class="detail-back">
      <el-button
        type="text"
        style="margin-right: 10px;"
        @click="save"
      >
        提交
      </el-button>
      <span
        style="cursor: pointer;"
        @click="$emit('back')"
      >
        <i class="el-icon-back" />
        <span>返回</span>
      </span>
    </div>
    <div class="app-panel order-detail">
      <el-form
        ref="detail"
        :model="editForm"
        :rules="formRules"
        label-width="130px"
        label-position="right"
        class="detail-form"
        size="small"
      >
        <div
          class="form-title"
        >
          寄件人信息
        </div>
        <div
          style="padding: 0 20px;"
        >
          <el-form-item
            label="联系人："
            style="margin-bottom: 0"
          >
            {{ form.consignor }}
          </el-form-item>
          <el-form-item
            label="联系电话："
            style="margin-bottom: 0"
          >
            {{ form.consignorPhone }}
          </el-form-item>
          <el-form-item
            label="联系邮箱："
            style="margin-bottom: 0"
          >
            {{ form.consignorMail }}
          </el-form-item>
          <el-form-item
            label="邮编："
            style="margin-bottom: 0"
          >
            {{ form.consignorZip }}
          </el-form-item>
          <el-form-item
            label="公司："
            style="margin-bottom: 0"
          >
            {{ form.consignorCompany }}
          </el-form-item>
          <el-form-item
            label="联系地址："
            style="margin-bottom: 0"
          >
            {{ form.consignorCountry }}&nbsp;{{ form.consignorProvince }}&nbsp;{{ form.consignorCity }}
          </el-form-item>
          <el-form-item
            v-if="form.consignorAddress1"
            label="详细地址1："
            style="width: 100%;margin-bottom: 0"
          >
            {{ form.consignorAddress1 }}
          </el-form-item>
          <el-form-item
            v-if="form.consignorAddress2"
            label="详细地址2："
            style="width: 100%;margin-bottom: 0"
          >
            {{ form.consignorAddress2 }}
          </el-form-item>
          <el-form-item
            v-if="form.consignorAddress3"
            label="详细地址3："
            style="width: 100%;margin-bottom: 0"
          >
            {{ form.consignorAddress3 }}
          </el-form-item>
          <el-form-item
            v-if="errormsgEntity.id"
            label="失败原因："
            style="width: 100%;margin-bottom: 0"
          >
            <span style="color: #FF0000">{{ errormsgEntity.errorMessage }}</span>
          </el-form-item>
        </div>

        <div
          class="form-title"
        >
          收件人信息
        </div>
        <div
          style="padding: 0 20px;"
        >
          <el-form-item
            label="联系人："
            prop="consigneeName"
          >
            <el-input
              v-model="editForm.consigneeName"
              style="width: 100%;"
              type="text"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="联系电话："
            prop="consigneePhone"
          >
            <el-input
              v-model="editForm.consigneePhone"
              style="width: 100%;"
              type="text"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="联系邮箱："
            prop="consigneeMail"
          >
            <el-input
              v-model="editForm.consigneeMail"
              style="width: 100%;"
              type="text"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="邮编："
            prop="consigneeZip"
          >
            <el-input
              v-model="editForm.consigneeZip"
              style="width: 100%;"
              type="text"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="公司："
          >
            <el-input
              v-model="editForm.consigneeCompany"
              style="width: 100%;"
              type="text"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="州/省："
            prop="destinationProvinceCode"
          >
            <el-select
              v-model="editForm.destinationProvinceCode"
              placeholder="请选择"
              style="width:100%;"
              size="small"
              @change="stateChange"
            >
              <el-option
                v-for="item in stateList"
                :key="item.abbr"
                :label="item.name + ' - ' + item.abbr"
                :value="item.abbr"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="城市："
            prop="destinationCityCode"
          >
            <el-input
              v-model="editForm.destinationCityCode"
              style="width: 100%;"
              type="text"
              placeholder="请输入"
              @input="cityChange"
            />
          </el-form-item>
          <el-form-item
            label="详细地址1："
            prop="destinationAddress1"
          >
            <el-input
              v-model="editForm.destinationAddress1"
              style="width: 100%;"
              type="text"
              :maxlength="30"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="详细地址2："
          >
            <el-input
              v-model="editForm.destinationAddress2"
              style="width: 100%;"
              type="text"
              :maxlength="30"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="详细地址3："
          >
            <el-input
              v-model="editForm.destinationAddress3"
              style="width: 100%;"
              type="text"
              :maxlength="30"
              placeholder="请输入"
            />
          </el-form-item>
        </div>

        <div class="form-title">
          包裹信息
        </div>
        <div style="padding: 0 20px;">
          <div class="package-info">
            <el-form-item
              v-if="form.samePackage"
              label="完全相同："
              style="margin-bottom: 0"
            >
              是
            </el-form-item>
            <el-form-item
              label="包裹类型："
              style="margin-bottom: 0"
            >
              '箱'
            </el-form-item>
            <el-form-item
              label="包裹数量："
              style="margin-bottom: 0"
            >
              {{ form.packageNum }}
            </el-form-item>
            <el-form-item
              label="重量单位："
              style="margin-bottom: 0"
            >
              {{ $fomatWeight(form.unitWeight) }}
            </el-form-item>
            <el-form-item
              label="尺寸单位："
              style="margin-bottom: 0"
            >
              {{ $fomatLength(form.unitMeasure) }}
            </el-form-item>
          </div>
          <el-collapse
            accordion
            class="express-package"
          >
            <el-collapse-item
              v-for="(item, index) in goodsData"
              :key="index"
            >
              <template slot="title">
                <span>
                  包裹 {{ index + 1 }} &nbsp;&nbsp;
                </span>
                <span>
                  尺寸：{{ item.length + '*' + item.width + '*' + item.height + ' ' + $fomatLength(item.unitMeasure) }} &nbsp;&nbsp;
                </span>
                <span>
                  重量：
                </span>
                <el-input
                  v-model="item.weight"
                  style="width: 150px;"
                  type="text"
                  size="small"
                  placeholder="请输入"
                />
                <span>
                  &nbsp;&nbsp;{{ $fomatWeight(item.unitWeight) }}
                </span>
              </template>
              <el-table
                :data="item.goodsEntityList"
                style="width: 100%;"
                border
              >
                <el-table-column
                  prop=""
                  label="商品名称"
                  min-width="150"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <div>
                      {{ scope.row.contentCn }}
                    </div>
                    <div>
                      {{ scope.row.contentEn }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="descCn"
                  label="商品描述"
                  min-width="150"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <div>
                      {{ scope.row.descCn }}
                    </div>
                    <div>
                      {{ scope.row.descEn }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="price"
                  label="价格"
                  width="120"
                />
                <el-table-column
                  prop="currency"
                  label="价格单位"
                  width="120"
                />
                <el-table-column
                  prop="goodsNum"
                  label="数量"
                  min-width="100"
                />
                <el-table-column
                  prop="hsCode"
                  label="海关编码"
                  min-width="120"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <div>
                      {{ scope.row.hsCode }}
                    </div>
                    <div>
                      {{ scope.row.hsCodeEn }}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </div>

        <div class="form-title">
          补充信息
        </div>
        <div style="padding: 0 20px;">
          <el-form-item label="签名类型：">
            <el-select
              v-model="editForm.signatureType"
              placeholder="请选择"
              style="width:100%;"
              size="small"
            >
              <el-option
                v-for="item in signatureTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="客户订单号：">
            {{ form.orderNo }}
          </el-form-item>
          <!--<el-form-item label="上门取件：">
            {{ form.pickupDate }}
          </el-form-item>-->
          <el-form-item label="Invoice No：">
            <el-input
              v-model="editForm.invoiceNo"
              style="width: 100%;"
              type="text"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="Department No：">
            <el-input
              v-model="editForm.departmentNo"
              style="width: 100%;"
              type="text"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="Declared Value："
            prop="declaredValue"
          >
            <el-input
              v-model="editForm.declaredValue"
              disabled
              style="width: 100%;"
              type="text"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="Ref. No.1："
            prop="refNo1"
          >
            <el-input
              v-model="editForm.refNo1"
              style="width: 100%;"
              type="text"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="Ref. No.2："
            prop="refNo2"
          >
            <el-input
              v-model="editForm.refNo2"
              style="width: 100%;"
              type="text"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="Description："
            style="width: 100%"
          >
            <el-input
              v-model="editForm.description"
              style="width: 100%;"
              type="text"
              placeholder="请输入"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  getOrderDetails,
  updateExpressOrders
} from '@/api/orderlist-at-express'
import { getStateByCountry } from '@/api/service-with-privateline-clearance'
import { getWordsList } from '@/api/public'

@Component({
  name: 'reSubmit',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private detailLoading: boolean = false
  private errormsgEntity: any = {}
  private signatureTypeList: any[] = []
  private form: any = {
    packageNum: 0,
    samePackage: false,
    consigneeCompany: undefined,
    consigneeFamilyAddress: undefined,
    consigneeName: undefined,
    consigneePhone: undefined,
    consigneeZip: undefined,
    consignor: undefined,
    consignorAddress1: undefined,
    consignorAddress2: undefined,
    consignorAddress3: undefined,
    consignorCity: undefined,
    consignorCityCode: undefined,
    consignorCompany: undefined,
    consignorCountry: undefined,
    consignorCountryCode: undefined,
    consignorFax: undefined,
    consignorMail: undefined,
    consignorPhone: undefined,
    consignorProvince: undefined,
    consignorProvinceCode: undefined,
    consignorTaxCode: undefined,
    consignorZip: undefined,
    destinationAddress1: undefined,
    destinationAddress2: undefined,
    destinationAddress3: undefined,
    destinationCity: undefined,
    destinationCityCode: undefined,
    destinationCountry: undefined,
    destinationCountryCode: undefined,
    destinationProvince: undefined,
    destinationProvinceCode: undefined,
    expressOrderId: undefined,
    id: undefined,
    unitWeight: undefined,
    unitMeasure: undefined,
    description: undefined,
    departmentNo: undefined,
    declaredValue: undefined,
    identificationNo: undefined,
    invoiceNo: undefined,
    orderNo: undefined,
    refNo1: undefined,
    refNo2: undefined,
    signatureType: undefined,
    pickupDate: undefined
  }
  private editForm: any = {
    destinationProvince: '',
    destinationProvinceCode: '',
    destinationCity: '',
    destinationCityCode: '',
    consigneeName: '',
    consigneePhone: '',
    consigneeMail: '',
    consigneeZip: '',
    consigneeCompany: '',
    destinationAddress1: '',
    destinationAddress2: '',
    destinationAddress3: '',
    signatureType: '',
    // pickupDate: '',
    invoiceNo: '',
    departmentNo: '',
    declaredValue: '',
    refNo1: '',
    refNo2: '',
    description: ''
  }
  private formRules: any = {
    destinationProvinceCode: [{ required: true, message: '请选择州/省', trigger: 'blur' }],
    destinationCityCode: [{ required: true, message: '请填写城市', trigger: 'blur' }],
    consigneeName: [{ required: true, message: '请填写联系人', trigger: 'change' }],
    consigneePhone: [{ required: true, message: '请填写联系电话', trigger: 'change' }],
    consigneeMail: [
      // { required: true, message: '请填写联系邮箱', trigger: 'change' },
      { type: 'email', message: '邮箱地址格式不正确', trigger: ['blur', 'change'] }
    ],
    consigneeZip: [{ required: true, message: '请填写邮编', trigger: 'change' }],
    destinationAddress1: [{ required: true, message: '请填写详细地址1', trigger: 'change' }]
    // declaredValue: [{ required: true, message: '请填写Declared Value', trigger: 'change' }],
    // refNo1: [{ required: true, message: '请填写Ref. No.1', trigger: 'change' }],
    // refNo2: [{ required: true, message: '请填写Ref. No.2', trigger: 'change' }]
  }
  private detailData: any = {}
  private goodsData: any[] = []
  private stateList: any[] = []
  /** computed */
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }

  /* 方法 */
  private cityChange() {
    this.editForm.destinationCity = this.editForm.destinationCityCode
  }
  private stateChange() {
    const state = this.stateList.find((e: any) => e.abbr === this.editForm.destinationProvinceCode)
    if (state) {
      this.editForm.destinationProvince = state.name
    } else {
      this.editForm.destinationProvince = ''
    }
  }
  private getStateByCountry() {
    const params = {
      countryId: this.form.destinationCountryCode
    }
    getStateByCountry(params).then((res: any) => {
      const data = res.data || {}
      this.stateList = data.result || []
    }).catch(() => {
      this.stateList = []
      return false
    })
  }
  private save() {
    (this.$refs.detail as any).validate((valid: any) => {
      const reg = /^\d+.?\d*$/
      const flag = this.goodsData.every((g: any) => reg.test(g.weight))
      if (!flag) {
        this.$message.error('包裹重量格式不正确')
      }
      if (valid && flag) {
        const params: any = {
          orderEntity: {
            ...this.detailData.orderEntity
          },
          personEntity: {
            ...this.detailData.personEntity
          },
          packagesEntityList: this.detailData.packagesEntityList,
          packageNum: this.detailData.packageNum,
          samePackage: this.detailData.samePackage,
          toorders: true
        }
        params.personEntity.consigneeName = this.editForm.consigneeName
        params.personEntity.consigneePhone = this.editForm.consigneePhone
        params.personEntity.consigneeMail = this.editForm.consigneeMail
        params.personEntity.consigneeZip = this.editForm.consigneeZip
        params.personEntity.consigneeCompany = this.editForm.consigneeCompany
        params.personEntity.destinationAddress1 = this.editForm.destinationAddress1
        params.personEntity.destinationAddress2 = this.editForm.destinationAddress2
        params.personEntity.destinationAddress3 = this.editForm.destinationAddress3
        params.personEntity.destinationProvince = this.editForm.destinationProvince
        params.personEntity.destinationProvinceCode = this.editForm.destinationProvinceCode
        params.personEntity.destinationCity = this.editForm.destinationCity
        params.personEntity.destinationCityCode = this.editForm.destinationCityCode
        params.orderEntity.signatureType = this.editForm.signatureType
        params.orderEntity.signatureTypeName = (this.signatureTypeList.find((e: any) => e.value === this.editForm.signatureType) || {}).label
        params.orderEntity.invoiceNo = this.editForm.invoiceNo
        params.orderEntity.departmentNo = this.editForm.departmentNo
        params.orderEntity.declaredValue = this.editForm.declaredValue
        params.orderEntity.refNo1 = this.editForm.refNo1
        params.orderEntity.refNo2 = this.editForm.refNo2
        params.orderEntity.description = this.editForm.description
        // params.orderEntity.signatureType = this.editForm.signatureType
        if (params.samePackage) {
          const w = (this.goodsData[0] || {}).weight
          params.packagesEntityList = params.packagesEntityList.map((e: any) => {
            e.weight = w
            return e
          })
        } else {
          params.packagesEntityList = params.packagesEntityList.map((e: any, i: number) => {
            e.weight = (this.goodsData[i] || {}).weight
            return e
          })
        }
        this.detailLoading = true
        updateExpressOrders(params).then((res: any) => {
          this.detailLoading = false
          this.$message.success('重新提交成功')
          this.$emit('load', 1)
          this.$emit('back')
        }).catch((err: any) => {
          this.detailLoading = false
          return err
        })
      }
    })
  }
  private getSignatureTypeList() {
    const params = {
      type: 'UPS_DeliveryConfirmation'
    }
    getWordsList(params).then((res: any) => {
      this.signatureTypeList = res.data || []
    }).catch((err: any) => {
      this.signatureTypeList = []
      return err
    })
  }
  private setData(row: any) {
    const { id } = row
    this.getDetail(id)
    this.getSignatureTypeList()
  }

  private getDetail(id: string): void {
    // 查询
    this.detailLoading = true
    getOrderDetails({
      id
    })
      .then((res: any) => {
        const data = res.data || {}
        this.detailData = data || {}
        const {
          errormsgEntity,
          personEntity,
          orderEntity,
          packagesEntityList,
          samePackage,
          packageNum
        }: any = data
        const {
          description,
          departmentNo,
          declaredValue,
          identificationNo,
          invoiceNo,
          orderNo,
          refNo1,
          refNo2,
          signatureType,
          pickupDate
        }: any = orderEntity || {}
        this.form = {
          ...personEntity,
          description,
          departmentNo,
          declaredValue,
          identificationNo,
          invoiceNo,
          orderNo,
          refNo1,
          refNo2,
          signatureType,
          pickupDate,
          samePackage,
          packageNum
        }
        this.errormsgEntity = errormsgEntity || {}
        if (samePackage) {
          this.goodsData = packagesEntityList[0] ? [ packagesEntityList[0] ] : []
        } else {
          this.goodsData = packagesEntityList || []
        }
        this.goodsData.map((it: any) => {
          this.form.unitMeasure = it.unitMeasure
          this.form.unitWeight = it.unitWeight
        })
        this.detailLoading = false
        this.editForm.consigneeName = this.form.consigneeName
        this.editForm.consigneePhone = this.form.consigneePhone
        this.editForm.consigneeMail = this.form.consigneeMail
        this.editForm.consigneeZip = this.form.consigneeZip
        this.editForm.consigneeCompany = this.form.consigneeCompany
        this.editForm.destinationAddress1 = this.form.destinationAddress1
        this.editForm.destinationAddress2 = this.form.destinationAddress2
        this.editForm.destinationAddress3 = this.form.destinationAddress3
        this.editForm.signatureType = this.form.signatureType
        this.editForm.pickupDate = this.form.pickupDate
        this.editForm.invoiceNo = this.form.invoiceNo
        this.editForm.departmentNo = this.form.departmentNo
        // this.editForm.declaredValue = this.form.declaredValue
        this.editForm.declaredValue = ''
        this.editForm.refNo1 = this.form.refNo1
        this.editForm.refNo2 = this.form.refNo2
        this.editForm.description = this.form.description
        this.editForm.destinationProvince = this.form.destinationProvince
        this.editForm.destinationProvinceCode = this.form.destinationProvinceCode
        this.editForm.destinationCity = this.form.destinationCity
        this.editForm.destinationCityCode = this.form.destinationCity
        this.getStateByCountry()
      })
      .catch((err: any) => {
        this.detailLoading = false
        return [null, err]
      })
  }
}
</script>

<style lang="scss" scoped>
.detail-back {
  text-align: right;
  padding: 0 20px;
  line-height: 50px;
  border-bottom: 1px solid #e8e8e8;
  background-color: #fff;
}
.order-detail {
  height: calc(100vh - 170px);
  overflow-y: auto;
}
.detail-form {
  // ::v-deep .el-form-item__label {
  //   font-weight: 700 !important;
  // }
  .el-form-item {
    vertical-align: top;
    display: inline-block;
    width: 24.9%;
    /*margin-bottom: 0px;*/
  }
}
.form-title {
  height: 35px;
  line-height: 35px;
  font-size: 16px;
  font-weight: 700;
  background: #f2f2f2;
  padding-left: 20px;
  margin: 10px 0;
}
.form-special {
  background: #f2f2f2;
  padding: 10px 20px;
}
.package-info {
  background-color: #F5F7FA;
  border-radius: 4px;
  margin: 5px 0;
}
.express-package {
  border: none;
  ::v-deep .el-collapse-item__header {
    background-color: #fafafa;
    padding: 0 12px;
    font-size: 14px;
  }
}
</style>
