<template>
  <div
    class="app-panel row-details"
  >
    <div class="header-top">
      <div
        style="float: left;"
      >
        详情：{{ detailRow.airlineCompany }}
      </div>
      <el-button
        type="primary"
        size="small"
        @click="goBack"
      >
        返 回
      </el-button>
    </div>
    <div class="search-form">
      <el-row :gutter="20">
        <el-form
          ref="form"
          :model="searchForm"
          label-width="87px"
        >
          <el-col :span="8">
            <el-form-item
              label="客户名称"
            >
              <el-select
                v-model="searchForm.customerId"
                placeholder="请选择"
                size="small"
                filterable
                style="width:200px;margin-right:5px;"
                @change="customerChange"
              >
                <el-option
                  v-for="item in customerList"
                  :key="item.customerId"
                  :label="item.customerName"
                  :value="item.customerId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <div style="display: flex;align-items: center;justify-content: flex-end;padding-right: 20px;">
              <el-radio-group
                v-model="searchForm.status"
                size="small"
                @change="statusChange"
              >
                <el-radio-button
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio-button>
              </el-radio-group>
              <el-input
                v-model="searchForm.searchKey"
                placeholder="请输入单号搜索"
                style="width: 250px;margin-left: 10px"
                size="small"
                clearable
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  size="small"
                  @click="getSectionListByCustomer(1)"
                />
              </el-input>
            </div>
          </el-col>
        </el-form>
      </el-row>
      <div style="padding: 10px 20px">
        <div class="my-el-alert">
          <span class="info-item">
            <span>总数量：</span>
            <span class="y">{{ selectCustomer.total || 0 }}</span>
          </span>
          <span class="info-item">
            <span>剩余数量：</span>
            <span class="y">{{ selectCustomer.surplus || 0 }}</span>
          </span>
          <span class="info-item">
            <span>已分配：</span>
            <span class="y">{{ selectCustomer.allocated || 0 }}</span>
          </span>
          <span class="info-item">
            <span>已打单：</span>
            <span class="y">{{ selectCustomer.printedOrder || 0 }}</span>
          </span>
          <span class="info-item">
            <span>已发运：</span>
            <span class="y">{{ selectCustomer.shipped || 0 }}</span>
          </span>
          <div
            v-permission="['airlineNumberRecovery']"
            class="closebtn"
            @click="showRecoveryModal"
          >
            回收
          </div>
        </div>
      </div>
      <div
        v-loading="loading"
        class="order-list"
        style="height:calc(100vh - 400px);overflow: auto;"
      >
        <div v-if="tableData.length">
          <el-row :gutter="2">
            <el-col
              v-for="item in tableData"
              :key="item.id"
              :xs="12"
              :sm="8"
              :md="8"
              :lg="6"
              :xl="6"
            >
              <div
                class="order-item"
              >
                <div class="order-item-inner">
                  <div class="no">
                    {{ item.code }}
                  </div>
                  <div
                    class="status"
                    :class="'status' + item.status"
                  >
                    {{ formatStatus(item.status) }}
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div
          v-else
          class="empty"
        >
          暂无数据
        </div>
      </div>
      <el-pagination
        :current-page="pagination.page"
        :page-size="pagination.size"
        layout="total, prev, pager, next"
        :total="pagination.total"
        style="text-align: right;"
        @current-change="handleCurrentChange"
      />
    </div>
    <recovery-modal
      ref="recoveryModal"
      :customer="selectCustomer"
      :section-id="detailRow.airlineId"
      @recoveryOk="recoveryOk"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getCustomerList, getSectionListByCustomer } from '@/api/system-in-air-them-roughly'
import recoveryModal from '@/views/system-management/air-them-roughly/components/recoveryModal.vue'

@Component({
  name: 'rowDetails',
  components: {
    recoveryModal
  }
})
export default class RowDetails extends Vue {
  /* data */
  private loading: boolean = false
  private searchForm: any = {
    customerId: undefined,
    searchKey: '',
    status: 99
  }
  private pagination: any = {
    page: 1,
    size: 40,
    total: 0
  }
  private selectCustomer: any = {}
  private detailRow: any = {}
  private tableData: any[] = []
  private customerList: any[] = []
  private statusList: any[] = [
    {
      value: 99,
      label: '全部'
    },
    // {
    //   value: 0,
    //   label: '未分配'
    // },
    {
      value: 1,
      label: '已分配'
    },
    {
      value: 2,
      label: '已打单'
    },
    {
      value: 3,
      label: '已发运'
    }
  ]

  /* methods */
  private async recoveryOk() {
    this.selectCustomer = {}
    await this.getCustomerList()
    this.customerChange(this.searchForm.customerId)
    this.getSectionListByCustomer(1)
  }

  private showRecoveryModal() {
    if (!this.searchForm.customerId) {
      this.$message.info('请选择客户')
      return
    }
    (this.$refs.recoveryModal as any).show()
  }

  private customerChange(val: any) {
    this.selectCustomer = {}
    if (val) {
      this.selectCustomer = this.customerList.find((e: any) => e.customerId === val) || {}
    }
    this.getSectionListByCustomer(1)
  }

  private statusChange() {
    this.getSectionListByCustomer(1)
  }

  private getSectionListByCustomer(page?: number) {
    if (page === 1) {
      this.pagination.page = page
    }
    if (!this.searchForm.customerId) {
      this.$message.info('请选择客户')
      return
    }
    const params = {
      model: {
        customerId: this.searchForm.customerId,
        searchKey: this.searchForm.searchKey,
        status: this.searchForm.status === 99 ? '' : this.searchForm.status,
        sectionId: this.detailRow.airlineId
      },
      page: this.pagination.page,
      size: this.pagination.size
    }
    this.loading = true
    getSectionListByCustomer(params).then((res: any) => {
      this.loading = false
      if (res.success) {
        const data = res.data || {}
        this.tableData = data.result || []
        this.pagination.total = data.total || 0
      }
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }

  private formatStatus(val: any) {
    const status = this.statusList.find((e: any) => e.value === val) || {}
    return status.label
  }

  private async show(row: any) {
    this.selectCustomer = {}
    this.detailRow = row
    this.tableData = []
    this.customerList = []
    this.searchForm = {
      customerId: undefined,
      searchKey: '',
      status: 99
    }
    this.pagination = {
      page: 1,
      size: 40,
      total: 0
    }
    await this.getCustomerList()
  }

  private handleCurrentChange(page: any) {
    this.pagination.page = page
    this.getSectionListByCustomer()
  }

  private async getCustomerList() {
    const params = {
      sectionId: this.detailRow.airlineId
    }
    await getCustomerList(params).then((res: any) => {
      if (res.success) {
        this.customerList = res.data || []
      }
    }).catch((err: any) => {
      return err
    })
  }

  private goBack() {
    this.$emit('goBack')
  }
}
</script>

<style lang="scss" scoped>
  .row-details{
    padding: 0;
    .header-top{
      text-align: right;
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
      font-size: 16px;
      color: #666666;
      border-bottom: 1px solid #cccccc;
    }
    .search-form{
      padding: 10px 0;
    }
    .my-el-alert {
      background-color: #fff8e6;
      width: 100%;
      padding: 8px 16px;
      margin: 0;
      box-sizing: border-box;
      border-radius: 4px;
      position: relative;
      overflow: hidden;
      opacity: 1;
      display: flex;
      align-items: center;
      .info-item{
        margin: 0 20px;
        color: #666666;
        font-size: 14px;
        .y{
          color: #FF7D19;
        }
      }
      .closebtn{
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 14px;
        color: #198CFF;
        cursor: pointer;
      }
    }
    .order-list{
      width: 100%;
      padding: 0 20px 10px 20px;
      overflow: hidden;
      .order-item{
        width: 100%;
        padding: 2px 0;
        .order-item-inner{
          height: 48px;
          border: 1px solid #DCE0E5;
          display: flex;
          align-items: center;
          padding: 0 15px;
          .no{
            flex: 1;
          }
          .status{
            width: 60px;
            position: relative;
            text-align: right;
            font-size: 14px;
            &.status0{
              &:before{
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
                width: 10px;
                height: 10px;
                background: #C4C4C4;
                border-radius: 50%;
              }
            }
            &.status1{
              &:before{
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
                width: 10px;
                height: 10px;
                background: #2291E6;
                border-radius: 50%;
              }
            }
            &.status2{
              &:before{
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
                width: 10px;
                height: 10px;
                background: #FF7D19;
                border-radius: 50%;
              }
            }
            &.status3{
              &:before{
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
                width: 10px;
                height: 10px;
                background: #189800;
                border-radius: 50%;
              }
            }
          }
        }
      }
      .empty{
        height: 100%;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #909399;
      }
    }
    ::v-deep{
      .el-form-item{
        margin: 0;
      }
    }
  }
</style>
