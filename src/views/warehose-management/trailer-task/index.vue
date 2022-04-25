<template>
  <div
    class="picking-form"
    style="display: flex;flex-flow: row nowrap;min-height: inherit;"
  >
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        v-show="!detailShow"
        class="app-container"
      >
        <head-info
          info=""
          title="拖托任务单"
        />
        <div class="app-panel">
          <el-row>
            <el-col :span="4">
              <el-button
                v-permission="['printSupportingLabel']"
                type="text"
                size="small"
                @click="showPrintModal"
              >
                打印托标
              </el-button>
            </el-col>
            <el-col
              :span="20"
              style="text-align:right;"
            >
              <el-input
                v-model="searchForm.towageNo"
                size="small"
                style="width:130px;margin-right:5px;"
                placeholder="任务单号"
              />
              <el-input
                v-model="searchForm.pickerId"
                size="small"
                style="width:130px;margin-right:5px;"
                placeholder="拖托人"
              />
              <el-select
                v-model="searchForm.towageMethod"
                placeholder="任务类型"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
              >
                <el-option
                  label="入库"
                  value="1"
                />
                <el-option
                  label="出库"
                  value="2"
                />
                <el-option
                  label="移库"
                  value="3"
                />
                <el-option
                  label="计量拖托"
                  value="4"
                />
              </el-select>
              <el-select
                v-model="searchForm.status"
                placeholder="状态"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
              >
                <el-option
                  label="待执行"
                  value="1"
                />
                <el-option
                  label="执行中"
                  value="2"
                />
                <el-option
                  label="已完成"
                  value="3"
                />
              </el-select>
              <el-date-picker
                v-model="searchForm.createTime"
                :clearable="false"
                unlink-panels
                type="daterange"
                value-format="yyyy-MM-dd"
                align="right"
                size="small"
                range-separator="~"
                style="width: 240px;margin-right: 10px;"
                start-placeholder="创建起始时间"
                end-placeholder="创建截止时间"
              />
              <el-button
                v-permission="['warehouseMeasureQuery']"
                type="primary"
                size="small"
                @click="handleSearch(1)"
              >
                查询
              </el-button>
            </el-col>
          </el-row>

          <el-table
            v-loading="loading"
            :data="tableData"
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              prop="towageNo"
              label="拖托任务单号"
              min-width="140px"
            />
            <el-table-column
              prop="status"
              label="状态"
              width="120px"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.status === 1">
                  待执行
                </div>
                <div v-else-if="scope.row.status === 2">
                  执行中
                </div>
                <div v-else-if="scope.row.status === 3">
                  已完成
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="towageMethod"
              label="任务类型"
              width="120px"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.towageMethod === 1">
                  入库
                </div>
                <div v-else-if="scope.row.towageMethod === 2">
                  出库
                </div>
                <div v-else-if="scope.row.towageMethod === 3">
                  移库
                </div>
                <div v-else-if="scope.row.towageMethod === 4">
                  计量拖托
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              width="180px"
              label="创建时间"
            />
            <el-table-column
              prop="expectedFinishTime"
              width="180px"
              label="要求完成时间"
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="150px"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['warehouseTowageView']"
                  type="text"
                  @click="handleDetail(scope.row)"
                >
                  查看详情
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
      <div
        v-show="detailShow"
        class="app-container"
      >
        <detail
          ref="detailForm"
          @back="detailShow = false"
        />
      </div>
    </div>
    <el-dialog
      title="打印托标"
      :visible.sync="visible"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-form
        ref="form"
        v-loading="loadingForm"
        :model="form"
        :rules="rules"
        label-width="80px"
        size="small"
        style="padding-right: 20px;"
      >
        <el-form-item
          label="仓库"
          prop="wh"
        >
          <el-select
            v-model="form.wh"
            placeholder="请选择"
            style="width:100%;"
            size="small"
            @change="whChange"
          >
            <el-option
              v-for="item in warehouseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="数量"
          prop="icount"
        >
          <el-input
            v-model="form.icount"
            clearable
            placeholder="最大限制100"
            :maxlength="20"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        style="text-align: right"
      >
        <el-button
          :disabled="loadingForm"
          size="small"
          @click="visible = false"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          :disabled="loadingForm"
          size="small"
          @click="onPrint"
        >
          打印
        </el-button>
      </div>
      <div style="position: fixed;top: -99999px;left: -10000px">
        <svg
          id="svg-wrap"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
        >
          <g>
            <line
              x1="2"
              y1="80"
              x2="423"
              y2="80"
              stroke="#000"
              stroke-width="1"
            />
            <rect
              x="2"
              y="2"
              width="421"
              height="280"
              stroke="#000"
              stroke-width="1"
              fill="rgb(0, 0, 0)"
              fill-opacity="0"
            />
            <text
              x="212"
              y="40"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              {{ form.whName }}
            </text>
          </g>
        </svg>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import detail from './detail.vue'
import { getTrailerList, getWHList } from '@/api/warehose-by-config'
import dayjs from 'dayjs'
import JsBarcode from 'jsbarcode'
@Component({
  name: 'trailer',
  components: {
    detail
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private loadingForm: boolean = false
  private searchForm: any = {
    towageId: undefined, // 任务单号
    pickerId: undefined, // 拖托人
    status: undefined, // 状态
    towageMethod: undefined, // 任务类型
    timeStart: undefined, // 起期
    timeEnd: undefined, // 止期
    createTime: [] // 时间集合
  }
  private tableData: any = []
  private total = 0
  private page = 1
  private size = 10
  private loading = false
  private detailShow: boolean = false
  private visible: boolean = false
  private warehouseList: any[] = []
  private form: any = {
    wh: '',
    icount: '',
    whName: ''
  }
  private rules: any = {
    wh: { required: true, message: '请选择仓库', trigger: 'change' },
    icount: [
      { required: true, message: '请输入数量', trigger: 'change' },
      { validator: this.validateIcount, trigger: 'blur' }
    ]
  }

  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }

  /* methods */
  private getUUID() {
    const tempUrl = URL.createObjectURL(new Blob())
    const tempUrlStr = tempUrl.toString()
    URL.revokeObjectURL(tempUrl)
    const uuid = tempUrlStr.substr(tempUrlStr.lastIndexOf('/') + 1).split('-').join('')
    return uuid.substr(0, 20)
  }
  private showPrintModal() {
    this.form = {
      wh: '',
      icount: '',
      whName: ''
    }
    this.visible = true
    this.getWarehouseList()
  }
  private getWarehouseList() {
    getWHList({
      model: {
        custId: this.custId
      },
      page: 1,
      size: 9999
    })
      .then((res: any) => {
        const data = res.data || {}
        this.warehouseList = data.result || []
      })
      .catch((err: any) => {
        this.warehouseList = []
        return err
      })
  }
  private whChange() {
    this.form.whName = ''
    const warehouse = this.warehouseList.find((e: any) => e.id === this.form.wh)
    if (warehouse) {
      this.form.whName = warehouse.name
    }
  }
  private onPrint() {
    const formRef: any = this.$refs.form
    formRef.validate(async(vaild: any) => {
      if (vaild) {
        this.$message.info('文件生成中...')
        const docW = 425
        const docH = 284
        const pdfMake: any = (window as any).pdfMake
        const svg: any = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        const svgWrap: any = document.getElementById('svg-wrap')
        let page: any[] = []
        for (let index = 0; index < this.form.icount; index++) {
          const svgDivWarp: Element = document.createElement('div')
          const svgWrapClone: any = svgWrap.cloneNode(true)
          const code = this.getUUID().toUpperCase()
          JsBarcode(svg, code, {
            width: 1.5,
            margin: 1
          })
          svg.setAttribute('x', (docW - (svg.width.animVal.value)) / 2)
          svg.setAttribute('y', (docH - (svg.height.animVal.value)) / 2 + 40)
          svgWrapClone.appendChild(svg)
          svgDivWarp.appendChild(svgWrapClone)
          const content: any[] = [{
            svg: svgDivWarp.innerHTML,
            width: docW,
            height: docH,
            x: 0,
            y: 0,
            margin: 0
          }]
          if (index !== 0 && index !== this.form.icount - 1) {
            content[content.length - 1].pageBreak = 'after'
          }
          page = page.concat(content)
        }
        const PDFDocument: any = pdfMake.createPdf({
          pageSize: {
            width: docW,
            height: docH
          },
          pageMargins: {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
          },
          content: page,
          defaultStyle: {
            font: 'SourceHanSansCN'
          }
        })
        PDFDocument.open()
      }
    })
  }
  private validateIcount(rule: any, value: any, callback: any) {
    if (!value) {
      callback(new Error('请输入数量'))
    } else {
      const reg = /^\d+$/
      if (reg.test(value)) {
        const val = Number(value)
        if (val > 100) {
          callback(new Error('数量超过最大限制'))
        } else if (val === 0) {
          callback(new Error('数量不能为0'))
        } else {
          callback()
        }
      } else {
        callback(new Error('数量格式不正确'))
      }
    }
  }
  private handleSearch(val?: any): void {
    // 查询
    this.loading = true
    const { createTime, ...model } = this.searchForm
    if (Array.isArray(createTime) && createTime.length > 0) {
      model.timeStart = createTime[0]
      model.timeEnd = createTime[1]
    }
    if (val) {
      this.page = val
    }
    const params = {
      model,
      page: this.page,
      size: this.size
    }
    getTrailerList(params)
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
  private handleDetail(row: any): void {
    // 查看详情
    this.detailShow = true
    const root: any = this.$refs.detailForm
    root.setData(row)
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
    this.searchForm.createTime = [dayjs().subtract(30, 'd').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    this.handleSearch()
  }
}
</script>

<style lang="scss" scoped>
  svg{
    width: 425px;
    height: 284px;
  }
  text{
    font-size: 18px;
  }
</style>
