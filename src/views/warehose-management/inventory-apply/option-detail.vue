<template>
  <div
    v-loading="pageLoading"
    class="app-container"
  >
    <div class="detail-header">
      <span>盘点详情</span>
      <div>
        <!--<el-button
          type="primary"
          size="small"
          @click="release"
        >
          释放库存锁
        </el-button>-->
        <el-button
          v-if="$checkPermission(['inventoryApplyComplete']) && ![2, 3].includes(row.status)"
          type="primary"
          size="small"
          @click="workInventory"
        >
          完成申请单
        </el-button>
        <el-button
          v-if="$checkPermission(['inventoryApplyCancel']) && [0, 1].includes(row.status)"
          type="primary"
          size="small"
          @click="cancelInventory"
        >
          取消申请单
        </el-button>
        <el-button
          size="small"
          @click="goBack"
        >
          返回
        </el-button>
      </div>
    </div>
    <div class="app-panel order-detail">
      <div style="padding-bottom: 10px;border-bottom: 1px solid #DCE0E5;overflow: hidden">
        <div style="float: left;white-space: nowrap;margin-right: 50px;padding-bottom: 6px;">
          <span style="font-size: 14px;color: #909399;">盘点申请ID：</span>
          <span style="font-size: 14px;color: #303133;">{{ row.inventoryCode }}</span>
        </div>
        <div style="float: left;white-space: nowrap;margin-right: 50px;padding-bottom: 6px;">
          <span style="font-size: 14px;color: #909399;">盘点方式：</span>
          <span style="font-size: 14px;color: #303133;">{{ (inventoryTypeList.find(e => e.value === row.type) || {}).label }}</span>
        </div>
        <div style="float: left;white-space: nowrap;margin-right: 50px;padding-bottom: 6px;">
          <span style="font-size: 14px;color: #909399;">状态：</span>
          <span style="font-size: 14px;color: #303133;">{{ (statusList.find(e => e.value === row.status) || {}).label }}</span>
        </div>
        <div style="float: left;white-space: nowrap;margin-right: 50px;padding-bottom: 6px;">
          <span style="font-size: 14px;color: #909399;">申请人：</span>
          <span style="font-size: 14px;color: #303133;">{{ row.applicantName || '--' }}</span>
        </div>
        <div style="float: left;white-space: nowrap;margin-right: 50px;padding-bottom: 6px;">
          <span style="font-size: 14px;color: #909399;">申请时间：</span>
          <span style="font-size: 14px;color: #303133;">{{ row.applicantTime || '--' }}</span>
        </div>
        <div style="float: left;white-space: nowrap;margin-right: 50px;padding-bottom: 6px;">
          <span style="font-size: 14px;color: #909399;">完成时间：</span>
          <span style="font-size: 14px;color: #303133;">{{ row.completeTime || '--' }}</span>
        </div>
      </div>
      <div
        v-loading="loading"
        style="margin-top: 12px"
      >
        <el-radio-group
          v-model="tableType"
          size="small"
          @change="tableTypeChange"
        >
          <el-radio-button
            label="0"
          >
            盘点内容
          </el-radio-button>
          <el-radio-button
            label="1"
          >
            实盘结果
          </el-radio-button>
        </el-radio-group>
        <el-row style="padding: 10px 0">
          <el-col :span="4">
            <span style="font-size: 14px;color: #909399;">总票数：</span>
            <span style="font-size: 14px;color: #303133;">{{ tableType === '0' ? row.totalNumber : row.actualTotalNumber || '--' }}</span>
          </el-col>
          <el-col :span="4">
            <span style="font-size: 14px;color: #909399;">总件数：</span>
            <span style="font-size: 14px;color: #303133;">{{ tableType === '0' ? row.totalPackages : row.actualTotalPackages || '--' }}</span>
          </el-col>
          <el-col :span="4">
            <span style="font-size: 14px;color: #909399;">总托盘数：</span>
            <span style="font-size: 14px;color: #303133;">{{ tableType === '0' ? row.totalTowage : row.actualTotalTowage || '--' }}</span>
          </el-col>
          <el-col
            v-show="tableType === '0'"
            :span="12"
            style="text-align: right"
          >
            <el-button
              v-if="$checkPermission(['inventoryApplyDistribution']) && ![2, 3].includes(row.status)"
              type="primary"
              size="small"
              @click="showModal"
            >
              分配盘点任务
            </el-button>
          </el-col>
        </el-row>
        <el-table
          v-show="tableType === '0'"
          ref="elTable"
          :data="tableList"
          row-key="id"
          max-height="280px"
          style="width: 100%;margin-bottom: 10px"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            fixed="left"
            type="selection"
            width="55"
            :selectable="selectable"
            :reserve-selection="true"
          />
          <el-table-column
            prop="orderCode"
            label="原单号"
            min-width="140px"
          />
          <el-table-column
            prop="towageId"
            label="托盘ID"
            min-width="140px"
          />
          <el-table-column
            prop="binType"
            label="库位类型"
            min-width="140px"
          >
            <template slot-scope="scope">
              {{ (binTypeList.find(e => e.value === scope.row.binType) || {}).label || '--' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="binNo"
            label="库位编码"
            min-width="140px"
          />
          <el-table-column
            prop="packages"
            label="件数"
            min-width="140px"
          />
          <el-table-column
            min-width="140px"
          >
            <div
              slot="header"
              style="line-height: 0;padding: 0"
            >
              <el-dropdown
                trigger="click"
                style="line-height: 0;padding: 0"
                @command="handleCommand"
              >
                <span>
                  分配情况
                  <span v-if="ifAssign !== '-1'">{{ ifAssign === '1' ? ' - 已分配' : ' - 未分配' }}</span>
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    command="-1"
                  >
                    全部
                  </el-dropdown-item>
                  <el-dropdown-item
                    command="1"
                  >
                    已分配
                  </el-dropdown-item>
                  <el-dropdown-item
                    command="0"
                  >
                    未分配
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <template slot-scope="scope">
              {{ scope.row.ifAssign ? `已分配：${scope.row.allotName}` : '未分配' }}
            </template>
          </el-table-column>
        </el-table>
        <el-table
          v-show="tableType === '1'"
          :data="tableData"
          max-height="280px"
          style="width: 100%;margin-bottom: 10px"
          border
        >
          <el-table-column
            prop="orderCode"
            label="原单号"
            min-width="140px"
          />
          <el-table-column
            prop="towageId"
            label="托盘ID"
            min-width="160px"
          />
          <el-table-column
            prop="binType"
            label="库位类型"
            min-width="140px"
          >
            <template slot-scope="scope">
              {{ (binTypeList.find(e => e.value === scope.row.binType) || {}).label || '--' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="binNo"
            label="库位编码"
            min-width="140px"
          />
          <el-table-column
            prop="packages"
            label="件数"
            min-width="140px"
          />
          <el-table-column
            prop="resultPackages"
            label="实盘件数"
            min-width="140px"
          />
          <el-table-column
            prop="inventoryName"
            label="盘点人"
            min-width="140px"
          />
          <el-table-column
            prop="inventoryTime"
            label="盘点时间"
            min-width="140px"
          />
          <el-table-column
            prop="result"
            label="盘点结果"
            min-width="140px"
          >
            <template slot-scope="scope">
              {{ (inventoryResultMap.find(e => e.value === scope.row.result) || {}).label }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page.sync="pagination.page"
          :page-size="pagination.size"
          layout="total, prev, pager, next"
          :total="pagination.total"
          style="text-align: right;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <div>
        <div style="font-size: 20px;font-weight: bold;color: #323232;margin-bottom: 10px">
          盘点任务
        </div>
        <el-table
          v-loading="loading2"
          :data="tableData2"
          max-height="260px"
          style="width: 100%;margin-bottom: 10px"
          border
        >
          <el-table-column
            prop="taskNo"
            label="任务单号"
            min-width="140px"
          />
          <el-table-column
            prop="createTime"
            label="创建时间"
            min-width="140px"
          />
          <el-table-column
            prop="totalNumber"
            label="总票数"
            min-width="140px"
          />
          <el-table-column
            prop="totalTowage"
            label="总托数"
            min-width="140px"
          />
          <el-table-column
            prop="totalPackages"
            label="总件数"
            min-width="140px"
          />
          <el-table-column
            prop="allotName"
            label="分配账号"
            min-width="140px"
          />
          <el-table-column
            label="状态"
            min-width="140px"
          >
            <template slot-scope="scope">
              {{ (statusList2.find(e => e.value === scope.row.status) || {}).name }}
            </template>
          </el-table-column>
          <el-table-column
            prop="completeTime"
            label="完成时间"
            min-width="140px"
          />
          <el-table-column
            label="操作"
            min-width="140px"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="viewTask(scope.row)"
              >
                查看
              </el-button>
              <el-button
                v-if="$checkPermission(['inventoryApplyCancelTask']) && [1, 2].includes(scope.row.status)"
                type="text"
                @click="cancelTask(scope.row, 1)"
              >
                取消分配
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      title="请分配一个账号"
      :visible.sync="visible"
      width="400px"
      @close="closeModal"
    >
      <div
        v-loading="dialogLoading"
        class="content-list"
      >
        <div class="header">
          请选择
        </div>
        <div class="list">
          <div
            v-for="item in personnelList"
            :key="item.id"
            :class="{
              item: true,
              active: item.id === selectRow.id
            }"
            @click="selectPersonnel(item)"
          >
            {{ item.name }}
          </div>
          <div
            v-if="personnelList.length === 0"
            style="font-size: 14px;display: flex;align-items: center;justify-content: center;color: #909399;"
          >
            暂无数据
          </div>
        </div>
      </div>
      <div
        slot="footer"
        style="text-align: right;"
      >
        <el-button
          size="small"
          :disabled="dialogLoading"
          @click="closeModal"
        >
          取 消
        </el-button>
        <el-button
          type="primary"
          size="small"
          :disabled="dialogLoading"
          @click="submit"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="任务单详情"
      :visible.sync="viewTaskVisible"
      width="1200px"
      @close="closeModal"
    >
      <el-row>
        <el-col
          :span="6"
          style="font-size: 14px;color: #909399;"
        >
          <span>任务单号：</span>
          <span>{{ viewTaskRow.taskNo }}</span>
        </el-col>
        <el-col
          :span="6"
          style="font-size: 14px;color: #909399;"
        >
          <span>创建时间：</span>
          <span>{{ viewTaskRow.createTime }}</span>
        </el-col>
        <el-col
          :span="6"
          style="font-size: 14px;color: #909399;"
        >
          <span>分配账号：</span>
          <span>{{ viewTaskRow.allotName }}</span>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 30px;margin-top: 14px">
        <el-col
          :span="6"
          style="font-size: 14px;color: #909399;"
        >
          <span>总票数：</span>
          <span>{{ viewTaskRow.actualTotalNumber }}</span>
        </el-col>
        <el-col
          :span="6"
          style="font-size: 14px;color: #909399;"
        >
          <span>总托数：</span>
          <span>{{ viewTaskRow.actualTotalTowage }}</span>
        </el-col>
        <el-col
          :span="6"
          style="font-size: 14px;color: #909399;"
        >
          <span>总件数：</span>
          <span>{{ viewTaskRow.actualTotalPackages }}</span>
        </el-col>
      </el-row>
      <el-table
        v-loading="dialogLoading"
        :data="dialogList"
        height="400px"
        style="width: 100%;margin-bottom: 10px"
        border
      >
        <el-table-column
          prop="orderCode"
          label="原单号"
          min-width="140px"
        />
        <el-table-column
          prop="towageId"
          label="托盘ID"
          min-width="140px"
        />
        <el-table-column
          prop="binType"
          label="库位类型"
          min-width="140px"
        >
          <template slot-scope="scope">
            {{ (binTypeList.find(e => e.value === scope.row.binType) || {}).label || '--' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="binNo"
          label="库位编号"
          min-width="140px"
        />
        <el-table-column
          prop="resultPackages"
          label="件数"
          min-width="140px"
        />
        <el-table-column
          label="操作"
          min-width="140px"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              v-if="$checkPermission(['inventoryApplyCancelTask']) && [1, 2].includes(viewTaskRow.status)"
              type="text"
              @click="cancelTask(scope.row, 0)"
            >
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getInventoryById,
  doInventoryTask,
  getUserByWarehouseId,
  getTasks,
  cancelTask,
  cancelTaskInfo,
  getTaskInfoById,
  cancelInventory,
  workInventory,
  release,
  getInventoryDetailById
} from '@/api/warehose-by-config'
@Component({
  name: 'option-detail',
  components: {},
  props: {
    inventoryTypeList: {
      type: Array,
      default: () => ([])
    },
    statusList: {
      type: Array,
      default: () => ([])
    }
  }
})
export default class extends Vue {
  /* data */
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  private loading: boolean = false
  private pageLoading: boolean = false
  private loading2: boolean = false
  private visible: boolean = false
  private viewTaskVisible: boolean = false
  private dialogLoading: boolean = false
  private binTypeList: any[] = [
    {
      value: 1,
      label: '库区'
    },
    {
      value: 2,
      label: '巷道'
    },
    {
      value: 3,
      label: '货架'
    },
    {
      value: 4,
      label: '层'
    },
    {
      value: 5,
      label: '格子'
    }
  ]
  private row: any = {}
  private tableType: any = '0'
  private tableData: any[] = []
  private dialogList: any[] = []
  private tableData2: any[] = []
  private viewTaskRow: any = {}
  private modalRow: any = {}
  private inventoryResultMap: any[] = [
    {
      value: 0,
      label: '正常'
    },
    {
      value: 1,
      label: '异常'
    }
  ]
  private selectRows: any[] = []
  private selectRow: any = {}
  private ifAssign: any = '-1'
  private personnelList: any[] = []
  private statusList2: any[] = [
    {
      name: '新建',
      value: 1
    },
    {
      name: '盘点中',
      value: 2
    },
    {
      name: '盘点完成',
      value: 3
    },
    {
      name: '已取消',
      value: 4
    }
  ]
  get tableList() {
    if (this.ifAssign === '-1') {
      return this.tableData
    }
    return this.tableData.filter((e: any) => e.ifAssign + '' === this.ifAssign)
  }
  /* methods */
  private tableTypeChange() {
    this.pagination.page = 1
    this.pagination.size = 10
    this.pagination.total = 0
    this.tableData = []
    this.$nextTick(() => {
      const el: any = this.$refs.elTable
      el && el.clearSelection()
      this.getInventoryById()
      this.getTasks()
    })
  }
  private handleSizeChange(val: string) {
    this.pagination.size = Number(val)
    this.getInventoryById()
  }
  private handleCurrentChange(val: string) {
    this.pagination.page = Number(val)
    this.getInventoryById()
  }
  private selectPersonnel(row: any) {
    this.selectRow = row
  }
  private selectable(row: any) {
    return !row.ifAssign
  }
  private handleSelectionChange(val: any[]) {
    this.selectRows = val
  }
  private show(row: any, type: any) {
    this.row = row
    this.getInventoryDetailById(row)
  }
  private getInventoryDetailById(row: any) {
    const params = {
      id: row.id
    }
    this.pageLoading = true
    getInventoryDetailById(params).then((res: any) => {
      this.row = res.data || {}
      this.pageLoading = false
      this.getTasks()
      this.$nextTick(() => {
        const el: any = this.$refs.elTable
        el && el.clearSelection()
      })
      this.getInventoryById()
    }).catch(() => {
      this.pageLoading = false
    })
  }
  private showModal() {
    if (this.selectRows.length === 0) {
      this.$message.error('请选择盘点内容')
      return
    }
    this.visible = true
    this.dialogLoading = true
    const params = {
      warehouseId: this.row.warehouseId
    }
    getUserByWarehouseId(params).then((res: any) => {
      this.personnelList = res.data || []
      this.dialogLoading = false
    }).catch(() => {
      this.dialogLoading = false
      this.personnelList = []
    })
  }
  private closeModal() {
    this.viewTaskRow = {}
    this.modalRow = {}
    this.visible = false
    this.viewTaskVisible = false
  }
  private submit() {
    if (!this.selectRow.id) {
      this.$message.error('请选择分配一个账号')
      return
    }
    const params = {
      idName: {
        ...this.selectRow
      },
      infoEntities: this.selectRows
    }
    this.dialogLoading = true
    doInventoryTask(params).then(() => {
      this.dialogLoading = false
      this.$message.success('分配成功')
      this.visible = false
      this.selectRow = {}
      this.getInventoryDetailById(this.row)
    }).catch(() => {
      this.dialogLoading = false
    })
  }
  private goBack() {
    this.row = {}
    this.viewTaskRow = {}
    this.modalRow = {}
    this.selectRow = {}
    this.ifAssign = '-1'
    this.tableType = '0'
    this.tableData = []
    this.dialogList = []
    this.selectRows = []
    this.tableData2 = []
    this.personnelList = []
    this.$emit('back', true)
  }
  private getInventoryById() {
    this.loading = true
    const params = {
      model: {
        id: this.row.id,
        type: this.tableType === '0' ? '1' : ''
      },
      page: this.pagination.page,
      size: this.pagination.size
    }
    getInventoryById(params).then((res: any) => {
      this.loading = false
      const data = res.data || {}
      this.tableData = data.result || []
      this.pagination.total = data.total || 0
    }).catch(() => {
      this.loading = false
      this.tableData = []
      this.pagination.total = 0
    })
  }
  private handleCommand(command: any) {
    this.ifAssign = command
  }
  private getTasks() {
    this.loading2 = true
    getTasks({ id: this.row.id }).then((res: any) => {
      this.tableData2 = res.data || []
      this.loading2 = false
    }).catch(() => {
      this.loading2 = false
      this.tableData2 = []
    })
  }
  private viewTask(row: any) {
    this.viewTaskRow = row
    this.viewTaskVisible = true
    const params = {
      id: row.id
    }
    this.dialogLoading = true
    getTaskInfoById(params).then((res: any) => {
      this.dialogLoading = false
      this.dialogList = res.data || []
    }).catch(() => {
      this.dialogLoading = false
    })
  }
  private cancelInventory() {
    this.$confirm('请确认是否取消此盘点申请单?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const params = {
        id: this.row.id
      }
      this.pageLoading = true
      cancelInventory(params).then(() => {
        this.pageLoading = false
        this.$message.success('申请单取消成功')
        this.goBack()
      }).catch(() => {
        this.pageLoading = false
      })
    }).catch(() => false)
  }
  private release() {
    this.$confirm('请确认是否释放此盘点申请单锁定的库存?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const params = {
        id: this.row.id
      }
      this.pageLoading = true
      release(params).then(() => {
        this.pageLoading = false
        this.$message.success('操作成功')
      }).catch(() => {
        this.pageLoading = false
      })
    }).catch(() => false)
  }
  private workInventory() {
    this.$confirm('请确认此盘点申请单是否完成?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const params = {
        id: this.row.id
      }
      this.pageLoading = true
      workInventory(params).then(() => {
        this.pageLoading = false
        this.$message.success('操作成功')
        this.getInventoryDetailById(this.row)
      }).catch(() => {
        this.pageLoading = false
      })
    }).catch(() => false)
  }
  private cancelTask(row: any, type: any) {
    // 1 任务单取消 0为原单号取消
    if (type === 1) {
      this.$confirm('请确认是否取消此任务单分配?', '温馨提示', {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading2 = true
        cancelTask({ taskId: row.id }).then(() => {
          this.$message.success('取消分配成功')
          this.loading2 = false
          this.getInventoryDetailById(this.row)
        }).catch(() => {
          this.loading2 = false
        })
      }).catch(() => false)
    } else {
      this.$confirm('请确认是否取消盘点内容分配?', '温馨提示', {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogLoading = true
        cancelTaskInfo({ id: row.id }).then(() => {
          this.$message.success('取消分配成功')
          this.dialogLoading = false
          this.viewTask(this.viewTaskRow)
          this.getInventoryDetailById(this.row)
        }).catch(() => {
          this.dialogLoading = false
        })
      }).catch(() => false)
    }
  }
}
</script>

<style lang="scss" scoped>
  .detail-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    padding: 20px 20px 0 20px;
    span{
      font-size: 20px;
      font-weight: bold;
      color: #323232;
    }
  }
  .order-detail {
    height: calc(100vh - 170px);
    overflow-y: auto;
  }
  .input-number-valiate {
    width: 100%;
    ::v-deep .el-input__inner {
      text-align: left;
    }
  }
  ::v-deep{
    .el-dialog__body{
      padding: 10px 20px;
    }
  }
  .content-list{
    width: 100%;
    .header{
      background: #EAEEF4;
      font-size: 12px;
      color: #909399;
      padding: 8px 15px;
    }
    .list{
      max-height: 500px;
      overflow-y: auto;
      .item{
        cursor: pointer;
        padding: 10px 15px;
        font-size: 14px;
        color: #333333;
        border-bottom: 1px solid #DCE0E5;
        &.active{
          color: #409EFF;
          background: rgba(64, 158, 255, .1);
        }
      }
    }
  }
</style>
