<template>
  <div
    class="cargo-form"
    style="display: flex;flex-flow: row nowrap;min-height: inherit;"
  >
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="货物异常表"
        />
        <div class="app-panel">
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-input
                v-model="searchForm.originalNumber"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
                placeholder="原单号"
              />
              <el-input
                v-model="searchForm.customerName"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
                placeholder="客户名称"
              />
              <el-select
                v-model="searchForm.status"
                placeholder="状态"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
              >
                <el-option
                  label="待通知"
                  value="0"
                />
                <el-option
                  label="已通知"
                  value="1"
                />
                <el-option
                  label="客户已回复"
                  value="2"
                />
                <el-option
                  label="货物已处理"
                  value="3"
                />
              </el-select>
              <el-select
                v-model="searchForm.sshj"
                placeholder="所属环节"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
              >
                <el-option
                  label="卸货"
                  value="0"
                />
                <el-option
                  label="验货"
                  value="1"
                />
                <el-option
                  label="盘点"
                  value="2"
                />
              </el-select>
              <el-select
                v-model="searchForm.type"
                placeholder="类型"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
              >
                <el-option
                  label="破损"
                  value="0"
                />
                <el-option
                  label="无主问题件"
                  value="1"
                />
                <el-option
                  label="丢失"
                  value="2"
                />
              </el-select>
              <el-date-picker
                v-model="searchForm.applyTime"
                :clearable="false"
                unlink-panels
                value-format="yyyy-MM-dd"
                range-separator="~"
                type="daterange"
                align="right"
                size="small"
                style="width:240px;margin-right:5px;"
                start-placeholder="更新开始时间"
                end-placeholder="更新截止时间"
              />
              <el-button
                type="primary"
                size="small"
                @click="handleSearch(1)"
              >
                查询
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="handleMoreSearch"
              >
                更多查询
              </el-button>
              <el-button
                type="primary"
                size="small"
                @click="handleBatchClient"
              >
                批量通知客户
              </el-button>
              <el-button
                type="primary"
                size="small"
                @click="handleBatchAdmin"
              >
                批量通知管理员
              </el-button>
              <el-button
                type="primary"
                size="small"
                @click="handleBatchReply"
              >
                批量回复
              </el-button>
            </el-col>
          </el-row>

          <el-table
            v-loading="loading"
            :data="tableData"
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            tooltip-effect="light"
            border
            @selection-change="handleSelection"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              prop="sshj"
              label="所属环节"
            />
            <el-table-column
              prop="zt"
              label="状态"
              width="100px"
            />
            <el-table-column
              prop="ydh"
              label="原单号"
              min-width="100px"
            />
            <el-table-column
              prop="khmc"
              label="客户名称"
              min-width="150px"
              show-overflow-tooltip
            />
            <el-table-column
              prop="ckmc"
              label="仓库名称"
              min-width="100px"
            />
            <el-table-column
              v-if="userType === '1'"
              prop="kw"
              label="库位"
              min-width="100px"
            />
            <el-table-column
              v-if="userType === '1'"
              prop="tpid"
              label="托盘ID"
            />
            <el-table-column
              prop="xh"
              label="箱号"
            />
            <el-table-column
              prop="lx"
              label="类型"
              width="100px"
            />
            <el-table-column
              prop="wtms"
              label="问题描述"
              min-width="120px"
              show-overflow-tooltip
            />
            <el-table-column label="照片">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleImg(scope.row)"
                >
                  点击查看
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="bz"
              label="备注"
              min-width="120px"
              show-overflow-tooltip
            />
            <el-table-column
              prop="gxsj"
              label="更新时间"
              width="160px"
            />
            <el-table-column
              prop="cljg"
              label="处理结果"
            />
            <el-table-column
              prop="cljg"
              label="处理详情"
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="200px"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleClient(scope.row)"
                >
                  通知客户
                </el-button>
                <el-button
                  type="text"
                  @click="handleAdmin(scope.row)"
                >
                  通知管理员
                </el-button>
                <el-button
                  type="text"
                  @click="handleSuccess(scope.row)"
                >
                  完成处理
                </el-button>
                <el-button
                  type="text"
                  @click="handleReply(scope.row)"
                >
                  回复
                </el-button>
              </template>
            </el-table-column>
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
      </div>
      <drawer
        :is-show="moreShow"
        :mask-closable="false"
        drawer-title="更多查询"
        drawer-style="width: 500px;"
        cancel-text="取消"
        confirm-text="确定"
        @drawerClose="handleMoreCancle"
        @drawerConfirm="handleMoreConfirm"
      >
        <searchMore ref="searchMore" />
      </drawer>

      <el-dialog
        :visible.sync="dialogVisible"
        :show-close="false"
        :width="'1000px'"
        class="dialog-cargo"
      >
        <div style="line-height: 30px;color: #909399;">
          所选异常货物
        </div>
        <el-table
          :data="dialogData"
          style="width: 100%;margin: 10px 0;"
          tooltip-effect="light"
          border
        >
          <el-table-column
            prop="sshj"
            label="所属环节"
          />
          <el-table-column
            prop="ydh"
            label="原单号"
            min-width="100px"
          />
          <el-table-column
            v-if="userType === '1'"
            prop="khmc"
            label="客户名称"
            min-width="150px"
            show-overflow-tooltip
          />
          <el-table-column
            prop="ckmc"
            label="仓库名称"
            min-width="100px"
          />
          <el-table-column
            v-if="userType === '1'"
            prop="kw"
            label="库位"
            min-width="100px"
          />
          <el-table-column
            v-if="userType === '1'"
            prop="tpid"
            label="托盘ID"
          />
          <el-table-column
            prop="xh"
            label="箱号"
          />
          <el-table-column
            prop="lx"
            label="类型"
            width="100px"
          />
          <el-table-column
            prop="wtms"
            label="问题描述"
            min-width="120px"
            show-overflow-tooltip
          />
          <el-table-column label="照片">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleImg(scope.row)"
              >
                点击查看
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="bz"
            label="备注"
            min-width="120px"
            show-overflow-tooltip
          />
        </el-table>
        <div>
          <div style="line-height: 30px;color: #909399;">
            处理要求
          </div>
          <el-form
            :model="model"
            label-width="80px"
            class="dialog-form"
          >
            <el-form-item>
              <el-radio-group v-model="model.radio">
                <el-radio :label="'0'">
                  退件
                </el-radio>
                <el-radio :label="'1'">
                  增值服务
                </el-radio>
                <el-radio :label="'2'">
                  拒绝
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <div v-if="model.radio === '0'">
              <el-form-item label="退货数量">
                <el-input
                  v-model="model.thsl"
                  size="small"
                  clearable
                  placeholder="请输入"
                />
              </el-form-item>
              <el-form-item label="退货原因">
                <el-input
                  v-model="model.thyy"
                  size="small"
                  clearable
                  placeholder="请输入"
                />
              </el-form-item>
              <el-form-item label="退货方式">
                <el-select
                  v-model="model.thfs"
                  placeholder="请选择"
                  size="small"
                  clearable
                  style="width:100%;"
                >
                  <el-option
                    label="自提"
                    value="0"
                  />
                  <el-option
                    label="快递"
                    value="1"
                  />
                  <el-option
                    label="送货上门"
                    value="2"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="司机姓名">
                <el-input
                  v-model="model.sjxm"
                  size="small"
                  clearable
                  placeholder="请输入"
                />
              </el-form-item>
              <el-form-item label="司机ID">
                <el-input
                  v-model="model.sjid"
                  size="small"
                  clearable
                  placeholder="请输入"
                />
              </el-form-item>
              <el-form-item label="车牌">
                <el-input
                  v-model="model.cp"
                  size="small"
                  clearable
                  placeholder="请输入"
                />
              </el-form-item>
              <el-form-item label="联系电话">
                <el-input
                  v-model="model.lxdh"
                  size="small"
                  clearable
                  placeholder="请输入"
                />
              </el-form-item>
            </div>
            <div v-else-if="model.radio === '1'">
              <el-form-item label="原单号">
                <el-input
                  v-model="model.ydh"
                  size="small"
                  clearable
                  placeholder="请输入"
                />
              </el-form-item>
              <el-form-item label="服务类型">
                <el-select
                  v-model="model.fwlx"
                  placeholder="请选择"
                  size="small"
                  clearable
                  style="width:100%;"
                >
                  <el-option
                    label="分箱"
                    value="0"
                  />
                  <el-option
                    label="合箱"
                    value="1"
                  />
                  <el-option
                    label="贴标"
                    value="2"
                  />
                  <el-option
                    label="贴唛"
                    value="3"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="model.bz"
                  size="small"
                  clearable
                  placeholder="请输入"
                />
              </el-form-item>
            </div>
            <div v-else-if="model.radio === '2'">
              <el-form-item label="拒绝理由">
                <el-input
                  v-model="model.jjly"
                  type="textarea"
                  :autosize="{minRows: 2, maxRows: 4}"
                  size="small"
                  clearable
                  placeholder="请输入"
                />
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogVisible = false">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="handleSubmit"
          >
            {{ userType === '1' ?'通知客户' : '提交' }}
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import searchMore from './searchMore.vue'
import drawer from '@/components/Drawer/drawer.vue'
import { getAnomalyList } from '@/api/warehose-by-config'
import dayjs from 'dayjs'

@Component({
  name: 'cargo',
  components: {
    searchMore,
    drawer
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private searchForm: any = {
    originalNumber: undefined, // 原单号
    customerName: undefined, // 客户名称
    status: undefined, // 状态
    sshj: undefined, // 所属环节
    type: undefined, // 类型
    applyTime: [], // 时间集合
    timeStart: undefined,
    timeEnd: undefined
  }
  private tableData: any = [
    {
      sshj: '卸货',
      zt: '客户已回复',
      ydh: 'J0982dfsdf',
      ckmc: '深圳A仓',
      khmc: '深圳XX电商公司',
      kw: 'A01-01-001',
      tpid: 'T43298',
      xh: 'X324324',
      lx: '无主问题件',
      wtms: '无法看清箱标',
      bz: '这是备注',
      gxsj: '2018-10-22 16:35:24',
      cljg: '丢弃'
    }
  ]
  private dialogData: any = [
    {
      sshj: '卸货',
      ydh: 'J0982dfsdf',
      ckmc: '深圳A仓',
      khmc: '深圳XX电商公司',
      kw: 'A01-01-001',
      tpid: 'T43298',
      xh: 'X324324',
      lx: '无主问题件',
      wtms: '无法看清箱标',
      bz: '这是备注'
    }
  ]
  private model = {
    radio: '0'
  }
  private total = 0
  private page = 1
  private size = 10
  private loading = false
  private moreShow: boolean = false
  private userType = '1' // 1仓库，2客户
  private dialogVisible = false

  /* methods */
  private handleSearch(val?: any): void {
    // 查询
    this.loading = true
    const { applyTime, ...model } = this.searchForm
    if (Array.isArray(applyTime) && applyTime.length > 0) {
      model.timeStart = applyTime[0]
      model.timeEnd = applyTime[1]
    }
    if (val) {
      this.page = val
    }
    const params = {
      model,
      page: this.page,
      size: this.size
    }
    getAnomalyList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.tableData = data.result || []
        this.total = data.total
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return [null, err]
      })
  }
  private handleMoreSearch(): void {
    // 更多查询
    this.moreShow = true
  }
  private handleImg(): void {
    // 点击查看
  }
  private handleSelection(): void {
    // 勾选
  }
  private handleBatchClient(): void {
    // 批量通知客户
    this.dialogVisible = true
  }
  private handleBatchAdmin(): void {
    // 批量通知管理员
    this.dialogVisible = true
  }
  private handleBatchReply(): void {
    // 批量回复
    this.dialogVisible = true
  }
  private handleMoreCancle(): void {
    // 取消
    this.moreShow = false
  }
  private handleMoreConfirm(): void {
    // 确定
    this.moreShow = false
    const root: any = this.$refs.searchMore
    this.searchForm = { ...root.searchMore }
    this.handleSearch(1)
  }
  private handleClient(): void {
    // 通知客户
    this.dialogVisible = true
  }
  private handleAdmin(): void {
    // 通知管理员
    this.dialogVisible = true
  }
  private handleSuccess(): void {
    // 完成处理
  }
  private handleReply(): void {
    // 回复
    this.dialogVisible = true
  }
  private handleSubmit(): void {
    // 通知客户/提交
  }
  private handleSizeChange(size: any): void {
    // 页码
    this.size = size
    this.handleSearch()
  }
  private handleCurrentChange(page: any): void {
    // 页数
    this.page = page
    this.handleSearch()
  }
  private created() {
    this.searchForm.applyTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    this.handleSearch()
  }
}
</script>

<style lang="scss" scoped>
.dialog-cargo {
  .el-dialog__header {
    padding: 0;
  }
  .dialog-form {
    .el-form-item__label {
      font-weight: 700 !important;
    }
    .el-form-item {
      margin-bottom: 10px;
    }
    .el-radio__label {
      padding-left: 0px;
    }
    .el-form-item {
      display: inline-block;
      width: 49%;
    }
  }
}
</style>
