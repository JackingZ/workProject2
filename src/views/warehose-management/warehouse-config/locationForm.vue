<template>
  <div>
    <div
      v-loading="formLoading"
      class="add-edit-truck"
    >
      <el-form
        ref="theForm"
        :model="selectForm"
        :rules="formRules"
        label-width="120px"
        label-position="right"
        size="small"
        style="padding-right: 20px;"
      >
        <el-form-item
          label="库位编号"
          prop="code"
        >
          <el-input
            v-model="selectForm.code"
            type="text"
            :maxlength="50"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          v-if="type === '1'"
          label="库区类型"
          prop="binType"
        >
          <el-select
            v-model="selectForm.binType"
            :disabled="isEdit"
            style="width:100%;"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="(item, index) in binTypeList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="限制货物类型"
        >
          <el-select
            v-model="selectForm.limitType"
            style="width:100%;"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              label="带电"
              :value="1"
            />
            <el-option
              label="带磁"
              :value="2"
            />
            <el-option
              label="液体"
              :value="3"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="type !== '5'"
          label="服务类型"
        >
          <el-input
            v-model="ss"
            :placeholder="`已选择(${selectForm.services.length})`"
            style="width:100%"
            disabled
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handleService"
            />
          </el-input>
        </el-form-item>
        <el-form-item
          v-if="custId === '0'"
          label="分配客户"
        >
          <el-select
            v-model="selectForm.custId"
            style="width:100%;"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="(item, index) in customerList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <!-- <el-input
            v-model="cc"
            :placeholder="`已选择(${selectForm.customers.length})`"
            style="width:100%"
            disabled
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handleCustomer"
            />
          </el-input> -->
        </el-form-item>
        <el-form-item
          v-if="type === '3'"
          label="货架位置"
          prop="position"
        >
          <el-select
            v-model="selectForm.position"
            style="width:100%;"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              label="巷道左边"
              :value="1"
            />
            <el-option
              label="巷道右边"
              :value="2"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="type === '5'"
          label="商品规则"
        >
          <el-select
            v-model="selectForm.rule"
            style="width:100%;"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              label="一位一品"
              value="1"
            />
            <el-option
              label="一位多品"
              value="2"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align: right; padding-top: 10px;">
        <el-button
          size="small"
          @click="cancel"
        >
          取 消
        </el-button>
        <el-button
          type="primary"
          size="small"
          :loading="formLoading"
          @click="saveConfirm"
        >
          确 定
        </el-button>
      </div>
    </div>

    <el-dialog
      title="服务类型"
      :visible.sync="isServiceShow"
      :close-on-click-modal="false"
      append-to-body
      width="960px"
      @close="itemClose"
    >
      <el-transfer
        ref="transferItem"
        v-model="services"
        v-loading="isServiceLoading"
        filterable
        :filter-method="filterMethod"
        :titles="['服务类型', '已选择']"
        :props="{key: 'id', label: 'name'}"
        filter-placeholder="输入搜索"
        :data="serviceList"
        style="height: 500px;"
      />
      <div
        slot="footer"
        style="text-align: right;margin: 20px 40px 0;"
      >
        <el-button
          size="small"
          @click="itemClose"
        >
          取 消
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="itemClose"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog
      title="分配客户"
      :visible.sync="isCustomerShow"
      :close-on-click-modal="false"
      append-to-body
      width="960px"
      @close="itemCloseOne"
    >
      <el-transfer
        ref="transferItem1"
        v-model="selectForm.customers"
        v-loading="isCustomerLoading"
        filterable
        :filter-method="filterMethodOne"
        :titles="['分配客户', '已选择']"
        :props="{key: 'id', label: 'name'}"
        filter-placeholder="输入搜索"
        :data="customerList"
        style="height: 500px;"
      />
      <div
        slot="footer"
        style="text-align: right;margin: 20px 40px 0;"
      >
        <el-button
          size="small"
          @click="itemCloseOne"
        >
          取 消
        </el-button>

        <el-button
          type="primary"
          size="small"
          @click="itemCloseOne"
        >
          确 定
        </el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script  lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  saveBin,
  getAgentList,
  getSscList
} from '@/api/warehose-by-config'

function formParam() {
  return {
    limitType: undefined,
    code: undefined,
    binType: undefined,
    services: [],
    custId: undefined,
    custName: undefined,
    level: undefined,
    parentId: undefined,
    type: undefined,
    warehouseId: undefined,
    rule: undefined,
    position: undefined
  }
}

@Component({
  name: 'LocationForm',
  components: {},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    }
  }
})
export default class LocationForm extends Vue {
  private formLoading: boolean = false
  private isServiceShow: boolean = false
  private isCustomerShow: boolean = false
  private isServiceLoading: boolean = false
  private isCustomerLoading: boolean = false
  private selectForm: any = formParam()
  private customerList: any[] = []
  private serviceList: any[] = []
  private services: any[] = []
  private ss: any = ''
  private cc: any = ''
  private binTypeList: any[] = [
    { name: '计量区', id: 1 },
    { name: '问题件区', id: 2 },
    { name: '验货区', id: 3 },
    { name: '待出库区', id: 4 },
    { name: '补货区', id: 5 },
    { name: '存储区', id: 20 }
  ]
  private formRules = {
    code: [{ required: true, message: '库位编号不能为空', trigger: 'change' }],
    binType: [{ required: true, message: '请选择库区类型', trigger: 'change' }],
    position: [{ required: true, message: '请选择货架位置', trigger: 'change' }]
  }

  // computed
  // 所属公司id
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }

  // methods
  private handleService() {
    this.isServiceShow = true
    this.services = JSON.parse(JSON.stringify(this.selectForm.services))
    this.getServiceList()
  }
  private handleCustomer() {
    this.isCustomerShow = true
    this.getAgentList()
  }
  private filterMethod(query: any, item: any): boolean {
    const name = item.name || ''
    return name.indexOf(query) > -1
  }
  private filterMethodOne(query: any, item: any): boolean {
    const name = item.name || ''
    return name.indexOf(query) > -1
  }
  private itemClose() {
    this.isServiceShow = false
    this.selectForm.services = this.services
    this.$nextTick(() => {
      const root: any = this.$refs.transferItem
      root.clearQuery('left')
      root.clearQuery('right')
    })
  }
  private itemCloseOne() {
    this.isCustomerShow = false
    this.$nextTick(() => {
      const root1: any = this.$refs.transferItem1
      root1.clearQuery('left')
      root1.clearQuery('right')
    })
  }
  private getServiceList() {
    this.isServiceLoading = true
    const params: any = {
      page: 1,
      size: 99999,
      status: '1'
    }
    Promise.all([
      getSscList(params).then((res: any) => ((res.data || {}).result || []))
    ]).then((res: any) => {
      const arr = res.reduce((pre: any, cur: any) => pre.concat(cur), [])
      this.serviceList = arr.map((it: any) => {
        return {
          name: it.name,
          id: it.id
        }
      })
      this.isServiceLoading = false
    }).catch((err: any) => {
      this.isServiceLoading = false
      return [err, null]
    })
  }

  private clearValidate() {
    const theForm: any = this.$refs.theForm
    this.$nextTick(() => {
      theForm.clearValidate()
    })
  }

  // 重置表单
  private resetForm() {
    this.selectForm = formParam()
    this.services = []
    this.clearValidate()
  }

  private cancel() {
    this.$emit('cancel')
    this.resetForm()
  }

  private saveConfirm() {
    const editForm: any = this.$refs.theForm
    editForm.validate((valid: any) => {
      if (valid) {
        this.formLoading = true
        const params: any = {
          ...this.selectForm
        }
        params.binServers = this.selectForm.services.map((it: any) => {
          const res = this.serviceList.find((item: any) => item.id === it) || {}
          return {
            serviceCode: res.id,
            serviceName: res.name
          }
        })
        params.binServers = params.binServers.filter((it: any) => it.serviceCode && it.serviceName)
        this.customerList.map((it: any) => {
          if (it.id === this.selectForm.custId) {
            params.custName = it.name
          }
        })
        saveBin(params)
          .then((res: any) => {
            if (res.code !== 200) {
              this.$message.error(res.msg)
              this.formLoading = false
              return
            }
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.resetForm()
            this.$emit('cancel')
            this.formLoading = false
            this.$emit('getTableList')
          })
          .catch((err: any) => {
            this.formLoading = false
            return err
          })
      } else {
        return false
      }
    })
  }

  private getAgentList() {
    this.isCustomerLoading = true
    getAgentList({
      page: 1,
      size: 9999,
      subtype: '1',
      parentId: (this as any).custId
    }).then((res: any) => {
      const data = res.data || {}
      this.customerList = data.result || []
      this.isCustomerLoading = false
    }).catch((err: any) => {
      this.isCustomerLoading = false
      return [err, null]
    })
  }

  // private getWareHouseEdit() {
  //   this.formLoading = true
  //   getSLTreeNode({
  //     id: this.selectForm.id
  //   })
  //     .then((res: any) => {
  //       const data = res.data || {}
  //       this.formLoading = false
  //     })
  //     .catch((err: any) => {
  //       this.formLoading = false
  //       return [err, null]
  //     })
  // }

  private init(row: any) {
    this.selectForm = { ...row }
    this.selectForm.services = (row.binServers || []).map((it: any) => it.serviceCode)
    this.getAgentList()
    this.getServiceList()
    // const bool = (this as any).isEdit
    // if (bool) {
    //   this.getWareHouseEdit()
    // }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-transfer-panel {
  width: 40%;
  height: 100%;
}
::v-deep .el-transfer {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}
::v-deep .el-transfer-panel__list.is-filterable {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
}
::v-deep .el-transfer-panel__body {
  height: 78%;
}
</style>
