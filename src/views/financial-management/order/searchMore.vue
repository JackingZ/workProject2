<template>
  <div>
    <el-form
      ref="searchMore"
      :model="searchMore"
      label-width="90px"
      class="more-form"
      size="small"
    >
      <el-form-item label="是否发货">
        <el-radio-group v-model="searchMore.ifLoading">
          <el-radio :label="0">
            未发货
          </el-radio>
          <el-radio :label="1">
            已发货
          </el-radio>
          <el-radio :label="2">
            部分发货
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="地址类型">
        <el-radio-group
          v-model="searchMore.addressType"
          @change="searchMore.deliveryWay = ''"
        >
          <el-radio label="0">
            FBA仓库
          </el-radio>
          <el-radio label="1">
            私人
          </el-radio>
          <el-radio label="2">
            自有海外仓
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="报关方式">
        <el-radio-group v-model="searchMore.customs0">
          <el-radio label="0">
            普通报关
          </el-radio>
          <el-radio label="1">
            出口退税
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="关税方式">
        <el-radio-group v-model="searchMore.includeTax">
          <el-radio :label="false">
            不包税
          </el-radio>
          <el-radio :label="true">
            包税
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="派送方式">
        <el-radio-group v-model="searchMore.deliveryWay">
          <el-radio
            v-for="(item, index) in dispatchList"
            :key="index"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="入库状态">
        <el-select
          v-model="searchMore.inventoryStatus"
          placeholder="请选择"
          size="small"
          style="width: 100%;"
          clearable
          filterable
        >
          <el-option
            v-for="item in inventoryStatusList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="计量状态">
        <el-select
          v-model="searchMore.measureStatus"
          placeholder="请选择"
          size="small"
          style="width: 100%;"
          clearable
          filterable
        >
          <el-option
            v-for="item in measureStatusList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="验货状态">
        <el-select
          v-model="searchMore.examineStatus"
          placeholder="请选择"
          size="small"
          style="width: 100%;"
          clearable
          filterable
        >
          <el-option
            v-for="item in examineStatusList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="报关状态">
        <el-select
          v-model="searchMore.declartionStatus"
          placeholder="请选择"
          size="small"
          style="width: 100%;"
          clearable
          filterable
        >
          <el-option
            v-for="item in declartionStatusList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="快递状态">
        <el-select
          v-model="searchMore.expressNo"
          placeholder="请选择"
          size="small"
          style="width: 100%;"
          clearable
          filterable
        >
          <el-option
            label="未出"
            value="0"
          />
          <el-option
            label="已出"
            value="1"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属业务员">
        <el-select
          v-model="searchMore.includeCust"
          placeholder="请选择"
          size="small"
          clearable
          filterable
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
      <el-form-item label="所属财务">
        <el-select
          v-model="searchMore.includeFinance"
          placeholder="请选择"
          size="small"
          clearable
          filterable
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
      <el-form-item label="所属客服">
        <el-select
          v-model="searchMore.includeService"
          placeholder="请选择"
          size="small"
          clearable
          filterable
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
        label-width="0px"
      >
        <el-checkbox-group
          v-model="searchMore.payStatus"
        >
          <el-checkbox
            v-for="item in checkList"
            :key="item.id"
            :label="item.id"
          >
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getUserList } from '@/api/jht-customer-management'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'searchMore',
  components: {},
  props: {
    statusList: {
      type: Array,
      default: () => ([])
    }
  }
})
export default class extends Vue {
  /* data */
  private searchMore: any = {
    payStatus: [],
    declartionStatus: undefined,
    expressNo: undefined,
    includeCust: undefined,
    includeFinance: undefined,
    includeService: undefined,
    examineStatus: undefined,
    measureStatus: undefined,
    inventoryStatus: undefined,
    addressType: undefined,
    ifLoading: undefined,
    deliveryWay: undefined,
    customs0: undefined,
    includeTax: undefined,
    type: undefined
  }
  private salerOptions: any[] = []
  private financeStaffOptions: any[] = []
  private customerServicerOptions: any[] = []
  private checkList: any[] = [
    { name: '已付款', id: '0' },
    { name: '未付款', id: '1' },
    { name: '逾期未付款', id: '2' },
    { name: '冻结', id: '3' },
    { name: '账单未出', id: '4' }
  ]
  /** computed */
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
  get declartionStatusList(): any[] {
    const arr: any[] = (this as any).statusList
    return arr.filter((e: any) => e.type === 'CUSTOM_DECLARATION')
  }
  get examineStatusList(): any[] {
    const arr: any[] = (this as any).statusList
    return arr.filter((e: any) => e.type === 'EXAMINE')
  }
  get measureStatusList(): any[] {
    const arr: any[] = (this as any).statusList
    return arr.filter((e: any) => e.type === 'MEASURE')
  }
  get inventoryStatusList(): any[] {
    const arr: any[] = (this as any).statusList
    return arr.filter((e: any) => e.type === 'WS_IN')
  }
  get ifCustomer(): boolean {
    const info = UserModule.info || {}
    const ifCustomer = (info as any).ifCustomer === 1
    return ifCustomer
  }
  get ifFinance(): boolean {
    const info = UserModule.info || {}
    const ifFinance = (info as any).ifFinance === 0
    return ifFinance
  }
  get dispatchList() {
    const { type, addressType } = this.searchMore
    if (addressType === '2') {
      return [
        { label: '到仓', value: '4' }
      ]
    }
    if (type === '1' || type === '2') {
      return [
        { label: '整柜直送', value: '3' },
        { label: '自提', value: '2' }
      ]
    }
    return [
      { label: '卡派', value: '0' },
      { label: '快递', value: '1' },
      { label: '自提', value: '2' }
    ]
  }

  /* 方法 */
  private setData(row: any, comType: any) {
    const type = (this as any).custType
    const stype = (this as any).custSubtype
    const cid = (this as any).custId
    const pid = (this as any).parentId
    const ifC = (this as any).ifCustomer
    const ifF = (this as any).ifFinance
    if (type === '0' && row.subType === '2' && row.ifCustomer === 1 && row.ifFinance === 0) { // 聚货通查非独立财务分公司
      this.getUserList(row.parentId, 'else')
      this.getUserList(row.id, 'self')
    } else if (type === '0') {
      this.getUserList(row.id)
    } else if (type === '2' && stype === '1' && row.ifCustomer === 1 && row.ifFinance === 0) {
      this.getUserList(row.parentId, 'else')
      this.getUserList(row.id, 'self')
    } else if (type === '2' && stype === '2' && ifC && ifF) {
      this.getUserList(pid, 'else')
      this.getUserList(cid, 'self')
    } else {
      this.getUserList(cid)
    }
  }
  private getUserList(id: string, str?: string) {
    const params: any = {
      custId: id
    }
    getUserList(params)
      .then((res: any) => {
        const data = res.data
        const arr = data || []
        if (str === 'else') {
          this.financeStaffOptions = arr.filter((it: any) => it.postType === 1)
        } else if (str === 'self') {
          this.customerServicerOptions = arr.filter((it: any) => it.postType === 2)
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
}
</script>

<style lang="scss" scoped>
.more-form {
  padding: 20px 20px 20px 10px;
  .el-form-item {
    margin-bottom: 8px;
  }
  .el-checkbox {
    margin-left: 18px;
    margin-right: 0px;
  }
  .el-radio {
    margin-right: 15px;
  }
  ::v-deep .el-radio__label {
    padding-left: 1px;
  }
}
</style>
