<template>
  <div class="app-container">
    <head-info
      title="司机管理"
      info=""
    />
    <div
      v-loading="loading"
      class="app-panel"
    >
      <el-row :gutter="20">
        <el-col :span="3">
          <el-button
            v-permission="['addDriver']"
            type="text"
            icon="el-icon-circle-plus-outline"
            @click="addDriver"
          >
            新增司机
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
            <el-select
              v-model="searchForm.status"
              placeholder="启用状态"
              size="small"
              style="width: 120px;margin-right: 5px;"
              clearable
            >
              <el-option
                label="禁用"
                :value="'0'"
              />
              <el-option
                label="启用"
                :value="'1'"
              />
            </el-select>

            <el-input
              v-model="searchForm.name"
              placeholder="司机姓名"
              size="small"
              style="width: 200px;margin-right: 10px;"
            />

            <el-button
              v-permission="['queryDriver']"
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
          prop="name"
          label="司机姓名"
        />
        <el-table-column
          prop="certNo"
          label="证件号码"
        >
          <template slot-scope="scope">
            <span>
              {{ formatCertType(scope.row.certType, scope.row.certNo) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系手机"
        />
        <el-table-column
          prop="email"
          label="电子邮箱"
        />
        <el-table-column
          prop=""
          label="所在地区"
        >
          <template slot-scope="scope">
            <span>
              {{ formatArea(scope.row.stateName, scope.row.cityName, scope.row.countyName) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="expire"
          label="驾照日期"
        >
          <template slot-scope="scope">
            <span>{{ dayjs(scope.row.expire).format('YYYY-MM-DD') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="custName"
          label="所属公司"
        />
        <el-table-column
          prop="createTime"
          label="启用状态"
        >
          <template slot-scope="scope">
            <el-switch
              :value="scope.row.status"
              :disabled="!$checkPermission(['driverChangeStatus'])"
              class="switchStyle"
              active-text="启用"
              inactive-text="禁用"
              active-value="1"
              inactive-value="0"
              @input="(value) => onStatus(scope.row, value)"
            />
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              v-permission="['editDriver']"
              type="text"
              size="small"
              @click="editDriver(scope.row)"
            >
              编辑
            </el-button>
            &nbsp;
            <el-button
              v-permission="['deleteDriver']"
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
        width="960px"
        :title="isEdit? '编辑司机': '新增司机'"
        :visible.sync="isShowUpdate"
        :close-on-click-modal="false"
        @closed="close"
      >
        <addEditForm
          ref="editForm"
          @cancel="close"
          @getTableList="getTableList"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import addEditForm from '@/views/system-management/chauffeur-management/components/addEditForm.vue'
import { UserModule } from '@/store/modules/user'
import {
  getDriverList,
  changeStatus,
  deleteDriver,
  saveDriver,
  getSupplierList
} from '@/api/system-in-chauffeur-management'
import dayjs from 'dayjs'
// import { getOrganizationtTab } from '@/api/organizationTab'

interface InputName {
  status: number | string
  name: string
}

@Component({
  name: 'Chauffeur',
  components: {
    addEditForm
  }
})
export default class Chauffeur extends Vue {
  private dayjs: any = dayjs
  private tableData: any[] = []
  private supplierList: any[] = []
  private searchForm: any = {
    custId: (this as any).custId,
    status: undefined,
    name: undefined
  }
  private isShowUpdate: boolean = false
  private pageSize: number = 20
  private pageNumber: number = 1
  private totalCount: number = 0
  private isEdit: boolean = false
  private loading: boolean = false

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
    getDriverList(params)
      .then((res: any) => {
        this.loading = false
        const { data } = res
        this.totalCount = data.total
        this.tableData = data.result || []
        this.tableData = this.tableData.map((item: any) => {
          const area = []
          if (item.stateId) {
            area.push(item.stateId)
          }
          if (item.cityId) {
            area.push(item.cityId)
          }
          if (item.countyId) {
            area.push(item.countyId)
          }
          item.area = area
          return item
        })
      })
      .catch(() => {
        this.loading = false
      })
  }
  private formatArea(stateName: string, cityName: string, countyName: string): string {
    if (!stateName) return ''
    if (!cityName) {
      return stateName
    }
    if (!countyName) {
      return stateName + '/' + cityName
    }
    return stateName + '/' + cityName + '/' + countyName
  }
  // 格式化证件类型
  private formatCertType(certType: string, certNo: string): string {
    if (!certNo) return ''
    if (certType === '0') {
      return '身份证 | ' + certNo
    }
    if (certType === '1') {
      return '护照 | ' + certNo
    }
    if (certType === '2') {
      return '港澳通行证 | ' + certNo
    }
    if (certType === '3') {
      return '其他 | ' + certNo
    }
    return ''
  }

  // 删除
  private deletRow(id: any): void {
    this.$confirm('删除司机将导致无法继续使用，确定要删除吗?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteDriver(id)
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

  private addDriver() {
    this.isShowUpdate = true
    this.isEdit = false
    this.$nextTick(() => {
      const root: any = this.$refs.editForm
      root.setCust()
    })
  }
  // 编辑窗口
  private editDriver(row: any) {
    this.isShowUpdate = true
    this.isEdit = true
    this.$nextTick(() => {
      const root: any = this.$refs.editForm
      root.setData(row)
    })
  }
  private close() {
    this.isShowUpdate = false
    this.reset()
  }
  // 表单重置
  private reset(): void {
    const theForm: any = this.$refs.editForm
    const form: any = theForm.$refs.editForm
    this.$nextTick(() => {
      form.clearValidate()
    })
  }

  // 启用/禁用
  private async onStatus(row: any, value: any): Promise<void> {
    if (!row.status || row.status === value) {
      return
    }
    const text = value === '0' ? '禁用' : '开启'
    const [cancel, confirm] = await this.$confirm(
      `此操作将${text}该航线，是否继续？`,
      '提示',
      {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(res => {
        return [null, res]
      })
      .catch(err => {
        return [err, null]
      })
    if (cancel) return
    changeStatus({
      id: row.id,
      status: value
    })
      .then(res => {
        this.$message.success('修改成功')
        this.getTableList()
      })
      .catch(err => {
        return err
      })
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
::v-deep .el-dialog__body {
  padding: 10px 20px 20px;
}
</style>
