<template>
  <div
    v-loading="detailLoading"
  >
    <div class="detail-back">
      <el-row>
        <el-col :span="4">
          报关订单详情
        </el-col>
        <el-col
          :span="20"
          style="text-align: right;"
        >
          <el-button
            v-if="rowObj.command === '-1' && tabsIndex === 'first'"
            type="primary"
            size="small"
            @click="saveInvoice"
          >
            保存
          </el-button>
          <el-dropdown
            v-if="tabsIndex !== 'third'"
            trigger="click"
            style="margin: 0 10px"
            @command="exportInvoiceBill"
          >
            <el-button
              type="primary"
              size="small"
            >
              箱单发票导出
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">
                按原单号(批次)
              </el-dropdown-item>
              <el-dropdown-item command="2">
                按柜号(批次)
              </el-dropdown-item>
              <el-dropdown-item command="3">
                按原单号(箱号)
              </el-dropdown-item>
              <el-dropdown-item command="4">
                按柜号(箱号)
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            v-if="tabsIndex === 'third'"
            type="primary"
            size="small"
            @click="viewFiles"
          >
            查看附件
          </el-button>
          <el-button
            icon="el-icon-back"
            type="text"
            @click="goBack"
          >
            返回
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="app-panel order-detail">
      <el-tabs
        v-model="tabsIndex"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="发票"
          name="first"
        >
          <el-table
            ref="tables"
            :data="invoiceData"
            border
            style="width: 100%;"
            height="calc(100vh - 265px)"
            @select="handleSelected"
            @select-all="handleSelectAll"
          >
            <el-table-column
              prop=""
              label="中英文品名"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.goodsName }}</div>
                <div>{{ scope.row.goodsAlias }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="hsCode"
              label="海关编码"
            />
            <el-table-column
              min-width="150"
              show-overflow-tooltip
            >
              <template slot="header">
                <span>材质(中文)</span>
                <br>
                <span>材质(英文)</span>
              </template>
              <template slot-scope="scope">
                <div>
                  <span>{{ scope.row.materialZh ? scope.row.materialZh : '--' }}</span>
                  <br>
                  <span>{{ scope.row.materialEn ? scope.row.materialEn : '--' }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              min-width="150"
              show-overflow-tooltip
            >
              <template slot="header">
                <span>用途(中文)</span>
                <br>
                <span>用途(英文)</span>
              </template>
              <template slot-scope="scope">
                <div>
                  <span>{{ scope.row.usageZh ? scope.row.usageZh : '--' }}</span>
                  <br>
                  <span>{{ scope.row.usageEn ? scope.row.usageEn : '--' }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="quantity"
              label="数量"
              width="120"
            />
            <el-table-column
              prop="unitName"
              label="单位"
              width="100"
            />
            <el-table-column
              prop="price"
              label="单价"
              width="100"
            />
            <el-table-column
              prop="amount"
              label="总价"
              width="120"
            />
            <el-table-column
              v-if="rowObj.command === '-1'"
              type="selection"
              width="55"
            />
            <el-table-column
              v-if="rowObj.command === '-1'"
              prop=""
              label="建议hscode"
              min-width="100"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.suggestHsCode"
                  style="width:100%;"
                  placeholder="请输入"
                  size="small"
                  :maxlength="100"
                />
              </template>
            </el-table-column>
            <el-table-column
              v-if="rowObj.command === '-1'"
              prop=""
              label="备注"
              min-width="120"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.remarks"
                  style="width:100%;"
                  placeholder="请输入"
                  size="small"
                  :maxlength="100"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          label="箱单"
          name="second"
        >
          <el-table
            :data="boxData"
            border
            style="width: 100%;"
            height="calc(100vh - 265px)"
            :span-method="columnSpanMethod"
          >
            <el-table-column
              prop="packageNo"
              label="箱号"
            />
            <el-table-column
              prop=""
              label="描述"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.customerName }}</div>
                <div>{{ scope.row.customerNameN }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="quantity"
              label="商品数量"
            />
            <el-table-column
              prop="weight"
              label="毛重"
            />
            <el-table-column
              prop="suttle"
              label="净重"
            />
            <el-table-column
              prop="suttle"
              label="尺寸"
            />
            <el-table-column
              prop="cubicNumber"
              label="方数"
            />
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          label="报关订单"
          name="third"
        >
          <el-table
            :data="orderData"
            style="width: 100%;"
            height="calc(100vh - 265px)"
            border
          >
            <el-table-column
              fixed="left"
              prop="declarationNo"
              label="报关单号"
              min-width="180"
              show-overflow-tooltip
            />
            <el-table-column
              fixed="left"
              prop="number"
              label="原单号"
              width="100"
            >
              <template slot-scope="scope">
                <el-popover
                  placement="bottom"
                  width="200"
                  trigger="click"
                >
                  <div
                    v-loading="numberLoading"
                    style="height: 200px;overflow-y: auto;"
                  >
                    <el-tag
                      v-for="(item, index) in numberData"
                      :key="index"
                      type="info"
                      style="display: block;"
                    >
                      {{ item }}
                    </el-tag>
                  </div>
                  <el-button
                    slot="reference"
                    type="text"
                    size="small"
                    @click="viewNumber(scope.row)"
                  >
                    原单号
                  </el-button>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              prop="model"
              label="订单类型"
              width="100"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.model === '1'">报关</span>
                <span v-else-if="scope.row.model === '2'">报检</span>
                <span v-else-if="scope.row.model === '3'">报关&报检</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="type"
              label="进出口类型"
              width="100"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.type === '0'">进口</span>
                <span v-else-if="scope.row.type === '1'">出口</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="orderDeclare"
              label="报关类型"
              width="100"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.type === '1' && scope.row.orderDeclare === '0'">普通报关</span>
                <span v-else-if="scope.row.type === '1' && scope.row.orderDeclare === '1'">出口退税</span>
                <span v-else-if="scope.row.type === '1' && scope.row.orderDeclare === '2'">整柜买单</span>
                <span v-if="scope.row.type === '0'">--</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="countryName"
              label="服务国家"
              min-width="150"
              show-overflow-tooltip
            />
            <el-table-column
              prop="customerName"
              label="下单客户"
              min-width="150"
              show-overflow-tooltip
            />
            <el-table-column
              v-if="custType === '0'"
              prop="orderCustomerName"
              label="客户名称"
              width="150"
              show-overflow-tooltip
            />
            <el-table-column
              prop="status"
              label="订单状态"
              min-width="120"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                >
                  {{ (statusList.find(e => scope.row.status === e.id) || {}).name }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="文件状态"
              min-width="120"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.orderDeclare === '1'"
                  type="text"
                >
                  <span v-if="scope.row.fileStatus === '0'">待审核</span>
                  <span v-else-if="scope.row.fileStatus === '1'">部分审核(通过)</span>
                  <span v-else-if="scope.row.fileStatus === '3'">部分审核(异常)</span>
                  <span v-else-if="scope.row.fileStatus === '2'">审核完成</span>
                </el-button>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="declareStatus"
              label="报关状态"
              min-width="120"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                >
                  {{ (declareList.find(e => scope.row.declareStatus === e.id) || {}).name }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="inspectionStatus"
              label="报检状态"
              min-width="120"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                >
                  {{ (inspectList.find(e => e.id === scope.row.inspectionStatus) || {}).name }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="ordersTime"
              label="下单日期"
              width="160"
            />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog
      title="查看附件"
      width="600px"
      :close-on-click-modal="false"
      :visible.sync="fileVisible"
      @close=";(fileVisible = false, fileList = [])"
    >
      <div v-loading="fileLoading">
        <div style="text-align: right;">
          <el-upload
            action
            :multiple="false"
            :limit="1"
            :show-file-list="false"
            :http-request="uploadFile"
            :file-list="fileList"
            style="display: inline-block;margin: 0 10px;"
          >
            <el-button
              size="small"
              type="text"
            >
              <i class="el-icon-upload" />
              <span>上传</span>
            </el-button>
          </el-upload>
        </div>
        <el-table
          :data="fileData"
          height="400px"
          style="width: 100%;margin: 10px 0;"
          border
        >
          <el-table-column
            :formatter="formatFileName"
            prop="fileName"
            label="文件名"
          />
          <el-table-column
            fixed="right"
            label="操作"
            width="150"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="downloadRow(scope.row)"
              >
                下载
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteRow(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  getInvoiceByNo,
  saveInvoiceByNo,
  getBoxByNo,
  getOrderByNo,
  getFileByNo,
  deleteNoFile,
  saveNoFile,
  exportInvoiceBill
} from '@/api/orderlist-at-customs'
import dayjs from 'dayjs'
@Component({
  name: 'detail',
  components: {},
  props: {
    statusList: {
      type: Array,
      default: () => ([])
    },
    declareList: {
      type: Array,
      default: () => ([])
    },
    inspectList: {
      type: Array,
      default: () => ([])
    }
  }
})
export default class extends Vue {
  /* data */
  private detailLoading: boolean = false
  private numberLoading: boolean = false
  private fileVisible: boolean = false
  private fileLoading: boolean = false
  private tabsIndex: any = 'first'
  private numberData: any[] = []
  private invoiceData: any[] = []
  private boxData: any[] = []
  private orderData: any[] = []
  private fileData: any[] = []
  private fileList: any[] = []
  private rowObj: any = {}
  private spanArr1: any = []
  private spanNum1: number = 0

  /** computed */
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }

  /* 方法 */
  private setData(row: any) {
    this.rowObj = row || {}
    this.getInvoiceDetail()
  }
  private viewNumber(row: any): void {
    this.numberData = row.codeList || []
  }
  private getInvoiceDetail(): void {
    this.detailLoading = true
    const params: any = {
      containNo: this.rowObj.code,
      type: this.rowObj.command === '1' ? '0' : '1'
    }
    getInvoiceByNo(params)
      .then((res: any) => {
        const data = res.data || []
        this.invoiceData = data
        const list = this.invoiceData.filter((it: any) => it.hsCodeStatus === 1)
        this.$nextTick(() => {
          this.toggleSelection(list)
        })
        this.detailLoading = false
      })
      .catch((err: any) => {
        this.detailLoading = false
        return [null, err]
      })
  }
  private saveInvoice() {
    this.detailLoading = true
    saveInvoiceByNo(this.invoiceData)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.detailLoading = false
        this.getInvoiceDetail()
      })
      .catch((err: any) => {
        this.detailLoading = false
        return [null, err]
      })
  }
  private getBoxDetail(): void {
    this.detailLoading = true
    const params: any = {
      containNo: this.rowObj.code,
      type: this.rowObj.command === '1' ? '0' : '1',
      method: '1'
    }
    getBoxByNo(params)
      .then((res: any) => {
        const data = (res.data || []).sort((a: any, b: any) => a.packageNo - b.packageNo)
        this.boxData = data
        this.getSpanArr(data)
        this.detailLoading = false
      })
      .catch((err: any) => {
        this.detailLoading = false
        return [null, err]
      })
  }
  private getOrderDetail(): void {
    this.detailLoading = true
    const params: any = {
      code: this.rowObj.code,
      type: this.rowObj.command === '1' ? '1' : '2'
    }
    getOrderByNo(params)
      .then((res: any) => {
        const data = res.data || []
        this.orderData = data
        this.detailLoading = false
      })
      .catch((err: any) => {
        this.detailLoading = false
        return [null, err]
      })
  }
  private getFileDetail(): void {
    this.fileLoading = true
    const params: any = {
      code: this.rowObj.code
    }
    getFileByNo(params)
      .then((res: any) => {
        const data = res.data || []
        this.fileData = data
        this.fileLoading = false
      })
      .catch((err: any) => {
        this.fileLoading = false
        return [null, err]
      })
  }

  private handleClick(tab: any, event: any) {
    this.tabsIndex = tab.name
    if (this.tabsIndex === 'first') {
      this.getInvoiceDetail()
    } else if (this.tabsIndex === 'second') {
      this.spanArr1 = []
      this.spanNum1 = 0
      this.getBoxDetail()
    } else if (this.tabsIndex === 'third') {
      this.getOrderDetail()
    }
  }

  private getSpanArr(data: any) {
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        this.spanArr1.push(1)
        this.spanNum1 = 0
      } else {
        // 判断当前元素与上一个元素是否相同
        if (data[i].packageNo === data[i - 1].packageNo) {
          this.spanArr1[this.spanNum1] += 1
          this.spanArr1.push(0)
        } else {
          this.spanArr1.push(1)
          this.spanNum1 = i
        }
      }
    }
  }
  private columnSpanMethod({ row, column, rowIndex, columnIndex }: any) {
    if ([0, 3, 4, 5, 6].includes(columnIndex)) {
      const _row = this.spanArr1[rowIndex]
      const _col = _row > 0 ? 1 : 0
      return {
        rowspan: _row,
        colspan: _col
      }
    }
  }
  private handleSelected(selection: any, row: any) {
    const addDelete = selection.find((it: any) => it.id === row.id)
    if (addDelete) {
      this.invoiceData.map((it: any) => {
        if (it.id === row.id) {
          it.hsCodeStatus = 1
        }
      })
    } else {
      this.invoiceData.map((it: any) => {
        if (it.id === row.id) {
          it.hsCodeStatus = 0
        }
      })
    }
  }

  private handleSelectAll(selection: any) {
    if (selection.length) {
      // 全选中
      this.invoiceData.map((it: any) => { it.hsCodeStatus = 1 })
    } else {
      // 取消这页的全选
      this.invoiceData.map((it: any) => { it.hsCodeStatus = 0 })
    }
  }
  private toggleSelection(arr: any) {
    const root: any = this.$refs.tables
    root.clearSelection()
    if (arr.length > 0) {
      arr.map((row: any) => {
        const api: any = this.$refs.tables
        api.toggleRowSelection(row)
      })
    }
  }

  private exportInvoiceBill(command: any) {
    this.detailLoading = true
    const params: any = {
      containerNo: this.rowObj.code,
      type: this.rowObj.command === '1' ? '0' : '1',
      exportType: command === '1' || command === '3' ? '1' : '2',
      method: command === '1' || command === '2' ? '0' : '1'
    }
    exportInvoiceBill(params).then((res:any) => {
      this.detailLoading = false
      const url = window.URL.createObjectURL(res)
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.href = url
      a.download = (this.rowObj.command === '1' ? '起运港出口' : '目的港进口') + '报关订单箱单发票' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.xls'
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }).catch((err:any) => {
      this.detailLoading = false
      err.data.text().then((text: any) => {
        try {
          const resData = JSON.parse(text)
          if (resData.code !== 200) {
            this.$message.error(resData.msg || '文件导出失败')
          }
        } catch (e) {
          return e
        }
      })
    })
  }
  private viewFiles() {
    this.fileVisible = true
    this.getFileDetail()
  }
  private goBack() {
    this.tabsIndex = 'first'
    this.invoiceData = []
    this.boxData = []
    this.orderData = []
    this.$emit('back')
  }
  private formatFileName(row: any) {
    const arr = row.filePath ? row.filePath.split('.').splice(1) : []
    return arr.join('.')
  }
  private deleteRow(row: any) {
    const params = {
      id: row.id
    }
    this.$confirm('请确认是否删除该文件?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteNoFile(params).then((res: any) => {
          this.$message.success('删除成功')
          this.handleDelete(row)
          this.getFileDetail()
        }).catch((err: any) => {
          return err
        })
      })
      .catch(() => {
        return false
      })
  }
  private handleDelete(row: any) {
    this.$deleteLoad(row.filePath, true)
      .then((res: any) => {
        // this.$message.success(`删除成功`)
      })
      .catch((err: any) => {
        return err
      })
  }
  private handleSave(path: any) {
    const params = {
      containNo: this.rowObj.code,
      filePath: [path]
    }
    saveNoFile(params).then((res: any) => {
      this.$message.success('上传成功')
      this.getFileDetail()
    }).catch((err: any) => {
      return err
    })
  }
  private uploadFile(params: any) {
    const { file } = params
    const path = `jht-admin/orderlist/customs/containerNo/${dayjs().valueOf() + '/' + file.name}`
    this.$upload(true, file, path)
      .then((res: any) => {
        this.handleSave(path)
        this.getFileDetail()
      })
      .catch((err: any) => {
        return err
      })
  }
  private downloadRow(row: any) {
    if (row.filePath) {
      const url = process.env.VUE_APP_OSS_PATH + row.filePath
      window.open(url)
    } else {
      this.$message.error('暂无文件可下载')
    }
  }
}
</script>

<style lang="scss" scoped>
.order-detail {
  height: calc(100vh - 170px);
  overflow-y: auto;
}
.detail-back {
  padding: 0 20px;
  line-height: 50px;
  border-bottom: 1px solid #e8e8e8;
  background-color: #fff;
}
</style>
