<template>
  <div class="app-container">
    <head-info
      title="车辆管理"
      info=""
    />
    <div
      v-loading="loading"
      class="app-panel"
    >
      <el-row :gutter="20">
        <el-col :span="3">
          <el-button
            v-permission="['addVehicle']"
            type="text"
            icon="el-icon-circle-plus-outline"
            @click="addCar"
          >
            新增车辆
          </el-button>
        </el-col>
        <el-col :span="21">
          <div style="text-align: right;">
            <el-select
              v-show="custId === '0'"
              v-model="searchForm.custId"
              placeholder="所属公司"
              size="small"
              filterable
              style="width:200px;margin-right:5px;"
              @change="onSupplier"
            >
              <el-option
                v-for="(item, index) in supplierList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>

            <el-input
              v-model="searchForm.plateNumber"
              placeholder="车牌号"
              size="small"
              style="width: 200px;margin-right: 10px;"
            />

            <el-button
              v-permission="['queryVehicle']"
              type="primary"
              size="small"
              @click="getTableList(1)"
            >
              查询
            </el-button>
          </div>
        </el-col>
      </el-row>

      <el-table
        :data="tableData"
        border
        height="calc(100vh - 313px)"
        style="width: 100%;margin: 10px 0;"
      >
        <el-table-column
          prop="plateNumber"
          label="车牌号"
        />
        <el-table-column
          prop="vehicleTypeName"
          label="车型"
        />
        <el-table-column
          prop="plateDate"
          label="上牌时间"
        >
          <template slot-scope="scope">
            <span>{{ dayjs(scope.row.plateDate).format('YYYY-MM-DD') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="grade"
          label="车况"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.grade === '0'">良好</span>
            <span v-else-if="scope.row.grade === '1'">维修</span>
            <span v-else-if="scope.row.grade === '2'">其他</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="expire"
          label="保险到期日"
        >
          <template slot-scope="scope">
            <span>{{ dayjs(scope.row.expire).format('YYYY-MM-DD') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="insurance"
          label="三者险保额"
        />
        <el-table-column
          prop="tailboard"
          label="是否有尾板"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.tailboard">√</span>
            <span v-else-if="!scope.row.tailboard">×</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="gps"
          label="是否有GPS"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.gps">√</span>
            <span v-else-if="!scope.row.gps">×</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="custName"
          label="所属公司"
        />
        <el-table-column
          fixed="right"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              v-permission="['editVehicle']"
              type="text"
              size="small"
              @click="editCar(scope.row)"
            >
              编辑
            </el-button>
            &nbsp;
            <el-button
              v-permission="['deleteVehicle']"
              type="text"
              size="small"
              @click="deletRow(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageNumber"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="totalCount"
        style="text-align: right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />

      <el-dialog
        :title="isEdit? '编辑车辆': '新增车辆'"
        width="600px"
        :visible.sync="isShowUpdate"
        :close-on-click-modal="false"
        @closed="close"
      >
        <add-edit-form
          ref="editForm"
          :is-edit="isEdit"
          @close="close"
          @getTableList="getTableList(1)"
        />
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="close">
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
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import AddEditForm from './components/addeditform.vue'
import { UserModule } from '@/store/modules/user'
import {
  getVehicleList,
  changeStatus,
  deleteVehicle,
  saveVehicle,
  getSupplierList
} from '@/api/system-in-vehicle-management'
import dayjs from 'dayjs'
// import { getOrganizationtTab } from '@/api/organizationTab'

@Component({
  name: 'Vehicle',
  components: {
    AddEditForm
  }
})
export default class Vehicle extends Vue {
  private dayjs: any = dayjs
  private tableData: any[] = []
  private supplierList: any[] = []
  private searchForm: any = {
    custId: (this as any).custId,
    plateNumber: undefined
  }
  private isShowUpdate: boolean = false
  private pageSize: number = 10
  private pageNumber: number = 1
  private totalCount: number = 0
  private isEdit: boolean = false
  private loading: boolean = false

  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }

  private created(): void {
    if ((this as any).custId === '0') {
      this.getSupplierList()
    }
    this.getTableList()
  }
  // 获取供应商
  private getSupplierList() {
    const custId = this.custId
    const params = {
      page: 1,
      size: 99999,
      parentId: custId
    }
    getSupplierList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.supplierList = data.result || []
        this.supplierList.unshift({
          id: '0',
          name: '聚货通'
        })
      })
      .catch((err: any) => {
        return err
      })
  }
  private onSupplier() {
    this.tableData = []
    this.getTableList()
  }

  // 获取列表
  private getTableList(page?: number): void {
    if (page === 1) {
      this.pageNumber = 1
    }
    const params = {
      page: this.pageNumber,
      size: this.pageSize,
      ...this.searchForm
    }
    this.loading = true
    getVehicleList(params)
      .then(res => {
        this.loading = false
        const { data } = res
        this.totalCount = data.total
        this.tableData = data.result || []
      })
      .catch(() => {
        this.loading = false
      })
  }

  // 删除
  private deletRow(id: any): void {
    this.$confirm('删除车辆将导致无法继续使用，确定要删除吗?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteVehicle(id)
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getTableList()
          })
          .catch(err => {
            return err
          })
      })
      .catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
  }
  // 分页
  private handleSizeChange(val: number) {
    this.pageSize = val
    this.getTableList()
  }
  private handleCurrentChange(val: number) {
    this.pageNumber = val
    this.getTableList()
  }

  private addCar(row: any) {
    this.isShowUpdate = true
    this.isEdit = false
    this.$nextTick(() => {
      const root: any = this.$refs.editForm
      root.setCust()
    })
  }
  // 编辑窗口
  private editCar(row: any) {
    this.isShowUpdate = true
    this.isEdit = true
    this.$nextTick(() => {
      const root: any = this.$refs.editForm
      root.setData(row)
    })
  }
  private close() {
    this.isShowUpdate = false
    // this.reset()
  }
  // 表单重置
  private reset(): void {
    const theForm: any = this.$refs.editForm
    const form: any = theForm.$refs.userRoot
    this.$nextTick(() => {
      form.clearValidate()
    })
  }
  private confirm() {
    this.$nextTick(() => {
      const root: any = this.$refs.editForm
      root.saveUser()
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
