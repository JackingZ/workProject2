<template>
  <div>
    <el-button
      v-permission="['warehouseLocationManagementAdd']"
      type="text"
      icon="el-icon-circle-plus-outline"
      @click="handleAddLevel"
    >
      新增库区
    </el-button>
    <el-button
      v-permission="['warehouseLocationManagementE']"
      type="text"
      icon="el-icon-download"
      style="margin-left: 10px;"
      @click="handleload"
    >
      导出库位码
    </el-button>
    <el-table
      v-loading="loading"
      :data="tableData"
      :tree-props="{children: 'children'}"
      row-key="id"
      tooltip-effect="light"
      border
      height="calc(100vh - 305px)"
      style="width: 100%;margin: 10px 0;"
    >
      <el-table-column
        prop="code"
        label="库位编号"
        min-width="100"
      />
      <el-table-column
        prop="type"
        label="类型"
        width="150"
      >
        <template slot-scope="scope">
          <span>
            {{ filterType(scope.row.type) }}
          </span>
          <span v-if="scope.row.level === 1">
            ({{ filterBin(scope.row.binType) }})
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :formatter="formatLimit"
        prop="limitType"
        label="限制货物类型"
        width="150"
      />
      <el-table-column
        :formatter="formatService"
        prop="serviceName"
        label="服务类型"
        show-overflow-tooltip
      />
      <el-table-column
        prop="custName"
        label="分配客户"
        show-overflow-tooltip
      />
      <el-table-column
        :formatter="formatRule"
        prop="rule"
        label="商品规则"
        width="120"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.type !== '5' && scope.row.binType === 20 && $checkPermission(['warehouseLocationMtSubAdd'])"
            type="text"
            size="small"
            @click="handleAdd(scope.row)"
          >
            {{ '新增' + filterAdd(scope.row.type) }}
          </el-button>
          &nbsp;
          <el-button
            v-permission="['warehouseLocationMtEdit']"
            type="text"
            size="small"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          &nbsp;
          <el-button
            v-permission="['warehouseLocationMtDel']"
            type="text"
            size="small"
            @click="handleDelete(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="title"
      :visible.sync="isShowUpdate"
      :close-on-click-modal="false"
      width="600px"
      @closed="cancel"
    >
      <locationForm
        ref="locationForm"
        :is-edit="isEdit"
        :type="floorType"
        @getTableList="getTableList"
        @cancel="cancel"
      />
    </el-dialog>
    <el-dialog
      title="导出库位码"
      :visible.sync="isCodeShow"
      :close-on-click-modal="false"
      width="500px"
      @closed=";(isCodeShow = false, codeForm.measure = 1)"
    >
      <div v-loading="codeLoading">
        <el-form
          :model="codeForm"
          label-width="120px"
          label-position="right"
          size="small"
          style="padding-right: 20px;"
        >
          <el-form-item
            label="导出方式："
            class="is-required"
          >
            <el-select
              v-model="codeForm.measure"
              placeholder="请选择"
              size="small"
              style="width: 100%;"
              filterable
            >
              <el-option
                v-for="(item, index) in measureList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div style="text-align: right; padding-top: 10px;">
          <el-button
            size="small"
            @click=";(isCodeShow = false, codeForm.measure = 1)"
          >
            取 消
          </el-button>
          <el-button
            type="primary"
            size="small"
            :disabled="codeLoading"
            @click="onCodeLoad"
          >
            确 定
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import JSZip from 'jszip'
import JsBarcode from 'jsbarcode'
import {
  getSLTree,
  getSLTreeNode,
  saveBin,
  deleteBin,
  getQrcode
} from '@/api/warehose-by-config'
import locationForm from '@/views/warehose-management/warehouse-config/locationForm.vue'
@Component({
  name: 'LocationManagement',
  components: {
    locationForm
  },
  props: {
    wsId: {
      type: String,
      default: ''
    },
    wsNm: {
      type: String,
      default: ''
    }
  }
})
export default class LocationManagement extends Vue {
  private loading: boolean = false
  private title: string = ''
  private isShowUpdate: boolean = false
  private isEdit: boolean = false
  private floorType: string = '' // 类型---层级
  private tableData: any[] = []
  private binTypeList: any[] = [
    { name: '计量区', id: 1 },
    { name: '问题件区', id: 2 },
    { name: '验货区', id: 3 },
    { name: '待出库区', id: 4 },
    { name: '补货区', id: 5 },
    { name: '存储区', id: 20 }
  ]
  private isCodeShow: boolean = false
  private codeLoading: boolean = false
  private codeForm: any = {
    measure: 1
  }
  private measureList: any[] = [
    { name: '下载库位条码压缩包', id: 1 },
    { name: '导出库位条码PDF', id: 2 }
  ]

  // -- methods --
  private handleAddLevel() {
    this.isEdit = false
    let params: any = {}
    this.title = '新增库区'
    this.floorType = '1' // 库区
    params = {
      level: 1,
      type: '1',
      parentId: 0,
      warehouseId: (this as any).wsId
    }
    this.isShowUpdate = true
    this.$nextTick(() => {
      const root: any = this.$refs.locationForm
      root.init(params)
    })
  }
  private handleAdd(row: any): void {
    this.isEdit = false
    const str = row.type ? row.type - 0 + 1 + '' : ''
    this.title = '新增' + this.filterType(str)
    this.floorType = str
    const { id, warehouseId, code, level, limitType, binServers } = row
    const params: any = {
      parentId: id,
      warehouseId,
      level: level + 1,
      type: str,
      limitType,
      binServers
    }
    this.isShowUpdate = true
    this.$nextTick(() => {
      const root: any = this.$refs.locationForm
      root.init(params)
    })
  }

  private handleEdit(row: any): void {
    this.isEdit = true
    this.title = '编辑' + this.filterType(row.type)
    this.floorType = row.type
    const { id, parentId, warehouseId, cid, code, level, type, limitType, binType, custId, rule, binServers, position } = row
    const params: any = { id, parentId, cid, warehouseId, code, level, type, limitType, binType, custId, rule, binServers, position }
    this.isShowUpdate = true
    this.$nextTick(() => {
      const root: any = this.$refs.locationForm
      root.init(params)
    })
  }
  private cancel() {
    this.isShowUpdate = false
  }

  private handleDelete(id: string): void {
    this.$confirm('此操作将删除当前库位及所有子库位, 是否继续?', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        const params: any = { id }
        deleteBin(params)
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getTableList()
          })
          .catch(err => {
            return [err, null]
          })
      })
      .catch(err => {
        return [err, null]
      })
  }

  private handleload() {
    if (this.tableData.length <= 0) {
      this.$message.error('暂无库位数据，无法导出')
      return
    }
    this.isCodeShow = true
  }
  private onCodeLoad() {
    this.$message.info('库位文件生成中，请稍后...')
    // this.isCodeShow = false
    this.codeLoading = true
    this.$nextTick(() => {
      setTimeout(() => {
        // 扁平化后的库位编码节点
        const flatTreeNode = this.flatDeep(this.tableData)
        const pdfMake: any = (window as any).pdfMake
        const docW = 425
        const docH = 284
        const wsName = (this as any).wsNm
        let page: any[] = []
        for (let i = 0; i < flatTreeNode.length; i++) {
          const svgDivWarp: Element = document.createElement('div')
          const svgWrap:any = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
          svgWrap.innerHTML = `<g>
            <line
              x1="2"
              y1="60"
              x2="423"
              y2="60"
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
              y="25"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              ${wsName}
            </text>
            <text
              x="212"
              y="45"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              ${flatTreeNode[i].name}
            </text>
          </g>`
          // 创建svg，根据扁平化后的节点生成条形码
          const svg: any = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
          const cid = flatTreeNode[i].id
          JsBarcode(svg, cid, {
            width: 2.5,
            height: 150,
            margin: 1
          })
          svg.setAttribute('x', (docW - (svg.width.animVal.value)) / 2)
          svg.setAttribute('y', (docH - (svg.height.animVal.value)) / 2 + 40)
          svgWrap.appendChild(svg)
          svgDivWarp.appendChild(svgWrap)
          const content: any[] = [{
            svg: svgDivWarp.innerHTML,
            width: docW,
            height: docH,
            x: 0,
            y: 0,
            margin: 0
          }]
          if (i !== 0 && i !== flatTreeNode.length - 1) {
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
        if (this.codeForm.measure === 1) {
          const zip = new JSZip()
          PDFDocument.getBlob((blob: any) => {
            if (blob) {
              zip.file('库位.pdf', blob)
              zip.generateAsync({ type: 'blob' }).then((content: any) => {
                this.codeLoading = false
                const WU: any = window.URL
                const url = WU.createObjectURL(content)
                const a: any = document.createElement('a')
                document.body.appendChild(a)
                a.href = url
                a.download = '库位条形码.zip'
                a.click()
                WU.revokeObjectURL(url)
                document.body.removeChild(a)
              }).catch((err: any) => {
                this.codeLoading = false
                this.$message.error('文件导出失败，请稍后再试...')
                return err
              })
            } else {
              this.codeLoading = false
              this.$message.error('文件导出失败，请稍后再试...')
            }
          })
        } else {
          this.codeLoading = false
          PDFDocument.open()
        }
        this.isCodeShow = false
      }, 500)
    })
  }

  private flatDeep(arr: any[]) {
    const res: any[] = []
    const handle = (arr1: any) => {
      arr1.forEach((item: any) => {
        res.push({
          id: item.cid,
          name: item.code
        })
        if (item.children && Array.isArray(item.children) && item.children.length) {
          handle(item.children)
        }
      })
    }
    handle(arr)
    return res
  }

  private filterAdd(type: any) {
    const str = type ? type - 0 + 1 + '' : ''
    return this.filterType(str)
  }
  private filterType(type: any) {
    let name
    switch (type) {
      case '1':
        name = '库区'
        break
      case '2':
        name = '巷道'
        break
      case '3':
        name = '货架'
        break
      case '4':
        name = '层'
        break
      case '5':
        name = '格子'
        break
      default:
        break
    }
    return name
  }
  private filterBin(val: any) {
    return (this.binTypeList.find((it: any) => it.id === val) || {}).name
  }
  private formatLimit(val: any): any {
    const key = val.limitType
    let name
    switch (key) {
      case 1:
        name = '带电'
        break
      case 2:
        name = '带磁'
        break
      case 3:
        name = '液体'
        break
      default:
        break
    }
    return name
  }
  private formatRule(val: any): any {
    const key = val.rule
    let name
    switch (key) {
      case '1':
        name = '一位一品'
        break
      case '2':
        name = '一位多品'
        break
      default:
        break
    }
    return name
  }
  private formatService(val: any) {
    return (val.binServers || []).map((it: any) => it.serviceName).join(',')
  }
  private getTableList(): void {
    this.loading = true
    const params: any = {
      warehouseId: (this as any).wsId,
      id: '0'
    }
    getSLTree(params)
      .then((res: any) => {
        const { data } = res
        this.tableData = data || []
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return [err, null]
      })
  }
  private created(): void {
    this.getTableList()
  }
}
</script>

<style lang="scss" scoped>
</style>
