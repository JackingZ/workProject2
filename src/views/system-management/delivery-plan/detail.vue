<template>
  <div
    v-loading="detailLoading"
    style="background-color: #ffffff;"
  >
    <div>
      <el-form
        ref="editForm"
        :model="form"
        label-width="120px"
        size="small"
        class="detail-form"
      >
        <el-form-item
          label="业务类型："
        >
          {{ filterType(form.type) }}
        </el-form-item>
        <el-form-item
          label="订舱服务："
        >
          {{ form.bscName }}
        </el-form-item>
        <el-form-item
          label="服务组："
        >
          {{ (groupList.find((it) => it.id === form.groupId) || {}).name }}
        </el-form-item>
        <el-form-item
          label="服务商："
        >
          <el-popover
            placement="top"
            width="400"
            trigger="hover"
          >
            <span>{{ form.serviceName }}</span>
            <div
              slot="reference"
              class="word-limit"
            >
              {{ form.serviceName }}
            </div>
          </el-popover>
        </el-form-item>
        <el-form-item
          v-if="form.type === '0'"
          label="航空板："
        >
          {{ form.containerName }}
        </el-form-item>
        <el-form-item
          v-if="form.type === '1' || form.type === '2'"
          label="柜型："
        >
          {{ form.containerName }}
        </el-form-item>
        <el-form-item
          v-if="form.type === '4'"
          label="车型："
        >
          {{ form.containerName }}
        </el-form-item>
        <el-form-item
          label="数量："
        >
          {{ form.quantity }}
        </el-form-item>
        <el-form-item
          label="1个SO多条柜："
        >
          {{ form.ifSo === 1 ? '是' : '否' }}
        </el-form-item>
        <el-form-item
          label="限重："
        >
          {{ form.loadLimit }}
        </el-form-item>
        <el-form-item
          label="派件方式："
        >
          {{ filterDispatch(form.dispatch) }}
        </el-form-item>
        <el-form-item
          label="起运日期："
        >
          {{ form.shipDate }}
        </el-form-item>
        <el-form-item
          label="截单日期："
        >
          {{ form.cutoffDate }}
        </el-form-item>
        <el-form-item
          label="运输时间："
        >
          {{ form.transTime }}
        </el-form-item>
        <el-form-item
          label="目的仓代码："
        >
          {{ form.fbastoreName }}
        </el-form-item>
        <el-form-item
          style="width: 100%;"
          label="备注："
        >
          {{ form.remark }}
        </el-form-item>
      </el-form>
      <el-table
        v-show="tableData.length > 0"
        :data="tableData"
        :loading="loading"
        height="calc(100vh - 380px)"
        style="width: 100%;margin: 10px 0;"
        border
      >
        <el-table-column
          fixed="left"
          prop="markNo"
          label="原单号"
          min-width="180"
          show-overflow-tooltip
        />
        <el-table-column
          v-if="form.businessType === '1'"
          fixed="left"
          prop="soCode"
          label="SO号"
          min-width="150"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.soCode || '-' }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="form.businessType === '0'"
          fixed="left"
          prop="billNo"
          label="提单号"
          min-width="150"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.billNo || '-' }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="form.businessType === '0'"
          fixed="left"
          prop="airNo"
          label="航空单号"
          min-width="150"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.airNo || '-' }}
          </template>
        </el-table-column>
        <el-table-column
          fixed="left"
          prop=""
          :formatter="formatStatus"
          label="订单状态"
          width="120"
        />
        <el-table-column
          prop="audit"
          label="审核状态"
          width="120"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.audit === '0'">待审核</span>
            <span v-else-if="scope.row.audit === '1'">审核通过</span>
            <span v-else-if="scope.row.audit === '2'">审核拒绝</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="businessType"
          label="业务类型"
          width="120"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.businessType === '0'">空运</span>
            <span v-else-if="scope.row.businessType === '1'">海运</span>
            <span v-else-if="scope.row.businessType === '2'">铁路</span>
            <span v-else-if="scope.row.businessType === '4'">卡航</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="bsServiceName"
          label="服务"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="portsFromName"
          label="起运港"
          width="180"
        />
        <el-table-column
          prop="portsToName"
          label="目的港"
          width="180"
        />
        <el-table-column
          prop="supplierName"
          label="供应商名称"
          width="180"
          show-overflow-tooltip
        />
        <el-table-column
          prop="custName"
          label="下单客户"
          width="180"
          show-overflow-tooltip
        />
        <el-table-column
          v-if="form.businessType === '1'"
          label="起运港提柜"
          width="120"
        >
          <template slot-scope="scope">
            {{ formatContain(scope.row, '251') }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="form.businessType === '1'"
          label="起运港已装柜"
          width="120"
        >
          <template slot-scope="scope">
            {{ formatContain(scope.row, '252') }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="form.businessType === '1'"
          label="起运港已还柜"
          width="120"
        >
          <template slot-scope="scope">
            {{ formatContain(scope.row, '255') }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="form.businessType === '1'"
          label="目的港已提柜"
          width="120"
        >
          <template slot-scope="scope">
            {{ formatContain(scope.row, '256') }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="form.businessType === '1'"
          label="目的港已还柜"
          width="120"
        >
          <template slot-scope="scope">
            {{ formatContain(scope.row, '257') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="下单时间"
          width="180"
        />
        <el-table-column
          label="操作"
          fixed="right"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="viewRow(scope.row)"
            >
              查看
            </el-button>
            <!-- <el-button
              type="text"
              @click="editRow(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="medium"
              @click="deleteRow(scope.row)"
            >
              删除
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        title="订单详情"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="1200px"
        @closed="dialogVisible = false"
      >
        <detail ref="detailForm" />
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getStatusList,
  getPlanById,
  getOrderList,
  getLscGroupList
} from '@/api/system-in-delivery-plan'
import dayjs from 'dayjs'
import detail from '@/views/orderlist-management/booking-order/detail.vue'

function formParams() {
  return {
    clientId: undefined,
    clientName: undefined,
    clientType: undefined,
    serviceTypeId: undefined,
    serviceTypeName: undefined,
    remark: undefined
  }
}

@Component({
  name: '',
  components: {
    detail
  },
  props: {
    isAdd: {
      type: Boolean,
      default: false
    },
    isView: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isOnce: {
      type: Boolean,
      default: false
    },
    scId: {
      type: String,
      default: ''
    },
    scName: {
      type: String,
      default: ''
    }
  }
})

export default class extends Vue {
  /* data */
  private form: any = {}
  private selectForm: any = formParams()
  private title: any = ''
  private currentId: any = ''
  private detailLoading: boolean = false
  private dialogLoading: boolean = false
  private selectLoading: boolean = false
  private loading: boolean = false
  private dialogVisible: boolean = false
  private statusList: any[] = []
  private tableData: any[] = []
  private selectedData: any[] = []
  private groupList: any[] = []
  private customerData: any[] = []

  /** computed */
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }

  /* 方法 */
  private filterServiceName(val: string) {
    const arr = (val || '').split(',')
    return arr.join('\n')
  }
  private filterType(type: any) {
    if (type === '0') {
      return '空运'
    } else if (type === '1') {
      return '海运'
    } else if (type === '2') {
      return '铁路'
    } else if (type === '4') {
      return '卡航'
    }
  }
  private filterDispatch(type: any) {
    const obj: any = { '0': '快递', '1': '卡派', '2': '自提', '3': '整柜直送', '4': '到仓' }
    const arrD = (`${type}` || '').split(',')
    const arrN: any[] = []
    arrD.map((it: any) => {
      arrN.push(obj[it])
    })
    return arrN.join(',')
  }
  private formatStatus(row: any) {
    let name = ''
    this.statusList.map((it: any) => {
      if (it.key === row.orderStatus) {
        name = it.value
      }
    })
    return name
  }
  private formatContain(row: any, val: string) {
    const arr = (row || {}).containerStatus || []
    const brr = arr.filter((it: any) => it === val)
    return brr.length + '/' + arr.length
  }

  private async getServiceStatus() {
    this.selectLoading = true
    const params: any = {
      businessType: this.form.type
    }
    await getStatusList(params).then((res: any) => {
      this.statusList = res.data || []
      this.selectLoading = false
    }).catch(() => {
      this.statusList = []
      this.selectLoading = false
    })
  }
  private async getGroupData() {
    this.selectLoading = true
    const params = {
      model: {
        status: 1,
        countryId: this.form.countryId
      },
      page: 1,
      size: 9999
    }
    await getLscGroupList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.groupList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private resetDialog() {
    this.dialogVisible = false
    this.selectForm = formParams()
    // this.$nextTick(() => {
    //   const root:any = this.$refs.suppselectFormlyForm
    //   root.clearValidate()
    // })
  }

  private async getTableData() {
    this.loading = true
    await getOrderList([this.currentId])
      .then((res: any) => {
        this.tableData = res.data || []
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private viewRow(row: any) {
    this.dialogVisible = true
    this.$nextTick(() => {
      const root: any = this.$refs.detailForm
      root.setData({
        ...row,
        isFromPlan: true
      })
    })
    // this.$router.push({ path: '/orderlist/booking-order', query: { ...row, isFromPlan: true } })
  }
  private editRow(row: any) {
    this.title = '编辑订单'
  }
  private deleteRow(row: any) {
    //
  }

  private async show(id: string) {
    this.detailLoading = true
    this.currentId = id
    try {
      const params = { id }
      const res = await getPlanById(params)
      this.form = res.data || {}
      await this.getGroupData()
      if (this.form.type) {
        await this.getServiceStatus()
      }
      await this.getTableData()
    } catch (error) {
      this.detailLoading = false
      return error
    }
    this.detailLoading = false
  }
}
</script>

<style lang="scss" scoped>
.detail-form {
  overflow: hidden;
}
.el-form-item {
  float: left;
  width: 24.9%;
  margin-bottom: 0;
}
.word-limit {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 50px;
}
::v-deep .el-dialog__body {
  padding: 0 20px;
}
</style>
