<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="下单配置"
        />
        <div class="app-panel">
          <div style="text-align:right;">
            <el-select
              v-model="selectValue.serviceTypeId"
              :loading="selectLoading"
              placeholder="服务大类"
              size="small"
              filterable
              clearable
              style="width:130px;margin-right:5px;"
              @focus="getServiceList"
            >
              <el-option
                v-for="item in serviceList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-input
              v-model="selectValue.name"
              size="small"
              placeholder="请输入"
              class="input-with-select"
              style="width:280px;margin-right:10px;"
            >
              <template slot="prepend">
                下单配置
              </template>
            </el-input>
            <el-button
              v-permission="['ploQuery']"
              type="primary"
              size="small"
              @click="queryAll(1)"
            >
              查询
            </el-button>
          </div>

          <el-table
            v-loading="loading"
            :data="tableData"
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              prop="serviceTypeName"
              label="服务大类"
            />
            <el-table-column
              prop="name"
              label="下单配置"
            />
            <el-table-column
              width="120"
              label="服务名称"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="!$checkPermission(['ploServiceName'])"
                  type="text"
                  @click="setServiceName(scope.row)"
                >
                  服务名称
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              width="120"
              label="服务项目"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="!$checkPermission(['ploServiceProject'])"
                  type="text"
                  @click="setAddedService(scope.row)"
                >
                  服务项目
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              width="120"
              label="附加服务"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="!$checkPermission(['ploAdditionalItems'])"
                  type="text"
                  @click="setAdditionalService(scope.row)"
                >
                  附加服务
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注"
            />
            <el-table-column
              prop="updateTime"
              label="最后更新时间"
              width="170"
            />
          </el-table>

          <el-pagination
            :current-page.sync="page"
            :page-size="size"
            layout="total, prev, pager, next"
            :total="total"
            style="text-align: right;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>

        <el-dialog
          :title="title"
          :visible.sync="isRelevanceShow"
          :close-on-click-modal="false"
          width="960px"
          @close=";(isRelevanceShow = false)"
        >
          <div v-show="isAdded">
            <addedServiceRelevance ref="addedServiceRelevance" />
          </div>
          <div v-show="!isAdded">
            <additionalServiceRelevance ref="additionalServiceRelevance" />
          </div>
        </el-dialog>

        <el-dialog
          title="服务名称"
          :visible.sync="isNameShow"
          :close-on-click-modal="false"
          append-to-body
          width="600px"
          @close="cancel"
        >
          <div v-loading="formLoading">
            <el-form
              ref="serviceForm"
              :model="serviceForm"
              :rules="formRule"
              label-width="120px"
              label-position="right"
              size="small"
              style="padding-right: 20px;"
            >
              <el-form-item
                label="服务名称"
                prop="serviceId"
              >
                <el-select
                  v-model="serviceForm.serviceId"
                  style="width:100%;"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in serviceData"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
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
              @click="confirm"
            >
              确 定
            </el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'

import {
  getServiceTypeList,
  getOrderTypeList,
  updateOrderType,
  getLscComplicatedList,
  getSscList,
  getKscList,
  getEscList,
  getCscList,
  getTscList,
  getBscList
} from '@/api/operation-of-orderType'
import addedServiceRelevance from '@/views/operation-management/order-type/addedServiceRelevance.vue'
import additionalServiceRelevance from '@/views/operation-management/order-type/additionalServiceRelevance.vue'

@Component({
  name: 'OrderType',
  components: {
    addedServiceRelevance,
    additionalServiceRelevance
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private tableData: any = []
  private title = ''
  private selectValue: any = {
    serviceTypeId: undefined,
    name: undefined
  }
  private serviceForm: any = {
    serviceId: undefined
  }
  private formRule = {
    serviceId: [{ required: true, message: '请选择服务名称', trigger: 'change' }]
  }
  private formLoading: boolean = false
  private serviceData: any[] = []
  private selectLoading = false
  private serviceList: any[] = []
  private formatList: any[] = [
    { name: 'rpx', id: 0 },
    { name: 'rpm', id: 1 },
    { name: 'rpr', id: 2 },
    { name: 'xls', id: 3 },
    { name: 'xlsx', id: 4 }
  ]
  private isRelevanceShow: boolean = false
  private isAdded: boolean = false
  private isNameShow: boolean = false
  private rowObj: any = {}
  private page: number = 1
  private size: number = 10
  private total: any = 0

  /* computed */

  get labelPosition() {
    const lang = AppModule.language
    if (!lang) {
      return 'left'
    }
    return lang === 'en' ? 'top' : 'left'
  }

  get lang() {
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
  /* methods */
  // 服务名称
  private getServiceData(id: string) {
    const arr = [
      { name: '00', api: getEscList },
      { name: '01', api: getKscList },
      { name: '02', api: getBscList },
      { name: '03', api: getCscList },
      { name: '04', api: getSscList },
      { name: '05', api: getLscComplicatedList },
      { name: '06', api: getTscList }
    ]
    this.serviceData = []
    arr.map((it: any) => {
      if (it.name === id && id === '05') {
        this.formLoading = true
        it.api({ status: '1' }).then((res: any) => {
          const data = res.data || []
          this.serviceData = data
          this.formLoading = false
        }).catch((err: any) => {
          this.formLoading = false
          return [err, null]
        })
      } else if (it.name === id && id !== '05') {
        this.formLoading = true
        const params: any = {
          page: 1,
          size: 9999,
          status: '1'
        }
        if (id === '02') params.model = {}
        it.api(params).then((res: any) => {
          const data = res.data || {}
          const result = data.result || []
          this.serviceData = result
          this.formLoading = false
        }).catch((err: any) => {
          this.formLoading = false
          return [err, null]
        })
      }
    })
  }
  private setServiceName(row: any) {
    this.isNameShow = true
    this.rowObj = row
    const { serviceId, serviceTypeId } = row
    this.serviceForm.serviceId = serviceId
    this.getServiceData(serviceTypeId)
  }
  private cancel() {
    this.isNameShow = false
    this.serviceForm = {
      serviceId: undefined
    }
    const editForm: any = this.$refs.serviceForm
    this.$nextTick(() => {
      editForm.clearValidate()
    })
  }
  private confirm() {
    const editForm: any = this.$refs.serviceForm
    editForm.validate((valid: any) => {
      if (!valid) {
        return false
      }
      this.formLoading = true
      const params: any = {
        ...this.rowObj
      }
      params.serviceId = this.serviceForm.serviceId
      this.serviceData.map((it: any) => {
        if (it.id === params.serviceId) {
          params.serviceName = it.name
        }
      })
      updateOrderType(params)
        .then((res: any) => {
          this.formLoading = false
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.isNameShow = false
          this.cancel()
          this.queryAll()
        })
        .catch((err: any) => {
          this.formLoading = false
          return err
        })
    })
  }
  // 关联服务项目
  private setAddedService(row: any) {
    this.isRelevanceShow = true
    this.isAdded = true
    this.title = '关联服务项目【' + row.serviceTypeName + '-' + row.name + '】'
    const { id, serviceTypeId, costTypeId } = row
    const obj = {
      orderTypeId: id,
      type: '0,1',
      serviceTypeId
    }
    this.$nextTick(() => {
      const root: any = this.$refs.addedServiceRelevance
      root.init(obj)
    })
  }
  // 关联附加服务
  private setAdditionalService(row: any) {
    this.isRelevanceShow = true
    this.isAdded = false
    this.title = '关联附加服务【' + row.serviceTypeName + '-' + row.name + '】'
    const { id } = row
    const obj = {
      orderTypeId: id,
      type: '2'
    }
    this.$nextTick(() => {
      const root: any = this.$refs.additionalServiceRelevance
      root.init(obj)
    })
  }

  // 分页
  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.queryAll()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.queryAll()
  }
  private queryAll(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const params: any = {
      ...this.selectValue,
      page: this.page,
      size: this.size
    }
    getOrderTypeList(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        this.tableData = data.result || []
        this.total = data.total
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  // 获取服务大类
  private getServiceList() {
    this.selectLoading = true
    const params = {
      custType: '1'
    }
    getServiceTypeList(params)
      .then((res: any) => {
        this.serviceList = res.data || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private created(): void {
    this.queryAll()
    this.getServiceList()
  }
}
</script>

<style lang="scss" scoped>
</style>
