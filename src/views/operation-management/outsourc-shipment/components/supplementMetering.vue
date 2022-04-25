<template>
  <div class="supplement-express">
    <el-row>
      <!--<el-col :span="12">
        <el-button
          size="small"
          @click="goBack"
        >
          返回
        </el-button>
      </el-col>-->
      <el-col
        :span="24"
        style="text-align: right"
      >
        <el-button
          size="small"
          @click="goBack"
        >
          返回
        </el-button>
        <el-button
          v-permission="['outsourcMeteringExport']"
          type="primary"
          size="small"
          :disabled="loading"
          @click="exportData"
        >
          导出
        </el-button>
        <el-upload
          action
          accept=".xlsx,.xls"
          :multiple="false"
          :limit="1"
          :file-list="fileList"
          :show-file-list="false"
          :http-request="uploadFile"
          style="display: inline-block;margin-left: 10px;"
        >
          <el-button
            v-permission="['outsourcMeteringImport']"
            type="primary"
            size="small"
            :disabled="loading"
          >
            导入
          </el-button>
        </el-upload>
      </el-col>
    </el-row>
    <div class="tabel-wrap">
      <el-table
        v-loading="loading"
        :data="tableData"
        height="calc(100vh - 275px)"
        style="width: 100%;margin: 10px 0;"
        border
        :row-class-name="rowClassName"
      >
        <el-table-column
          prop="code"
          label="原单号"
        />
        <el-table-column
          prop="box"
          label="箱号"
        />
        <el-table-column
          prop="length"
          label="长"
        >
          <template slot-scope="scope">
            <span v-if="!scope.row.edit">{{ scope.row.length }}</span>
            <span v-else>
              <el-input
                v-model="scope.row.lengthEdit"
                size="small"
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="wigth"
          label="宽"
        >
          <template slot-scope="scope">
            <span v-if="!scope.row.edit">{{ scope.row.wigth }}</span>
            <span v-else>
              <el-input
                v-model="scope.row.widthEdit"
                size="small"
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="height"
          label="高"
        >
          <template slot-scope="scope">
            <span v-if="!scope.row.edit">{{ scope.row.height }}</span>
            <span v-else>
              <el-input
                v-model="scope.row.heightEdit"
                size="small"
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="weight"
          label="重量"
        >
          <template slot-scope="scope">
            <span v-if="!scope.row.edit">{{ scope.row.weight }}</span>
            <span v-else>
              <el-input
                v-model="scope.row.weightEdit"
                size="small"
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.isEdit && !scope.row.edit && $checkPermission(['outsourcMeteringEdit'])"
              type="text"
              @click="edit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.isEdit && scope.row.edit"
              type="text"
              @click="cancel"
            >
              取消
            </el-button>
            <el-button
              v-if="scope.row.isEdit && scope.row.edit"
              type="text"
              @click="save(scope.row)"
            >
              保存
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--<el-pagination
        :current-page.sync="pagination.page"
        :page-size="pagination.size"
        layout="total, prev, pager, next"
        :total="pagination.total"
        style="text-align: right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />-->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getTakeMetering,
  takeMeteringExport,
  takeMeteringImport,
  takeMeteringSave
} from '@/api/outsourc-shipment'
import dayjs from 'dayjs'

@Component({
  name: 'supplementMetering',
  components: {
  }
})

export default class extends Vue {
  /* data */
  private loading: boolean = false
  private tableData: any[] = []
  private fileList: any[] = []
  private pagination: any = {
    page: 1,
    size: 20,
    total: 0
  }
  private showRow: any = {}
  get tableDataPage() {
    return this.tableData.slice((this.pagination.page - 1) * this.pagination.size, (this.pagination.page) * this.pagination.size)
  }
  /* methods */
  private rowClassName({ row, rowIndex }: any) {
    if (!row.isEdit) {
      return 'jhtclass'
    }
  }
  private cancel() {
    this.tableData = this.tableData.map((e: any) => {
      e.edit = false
      return e
    })
  }
  private edit(row: any) {
    this.tableData = this.tableData.map((e: any) => {
      if (e.box === row.box && e.isEdit) {
        e.edit = true
        e.lengthEdit = e.length
        e.widthEdit = e.wigth
        e.heightEdit = e.height
        e.weightEdit = e.weight
      } else {
        e.edit = false
      }
      return e
    })
  }
  private save(row: any) {
    if (!row.lengthEdit) {
      this.$message.error('长不能为空')
      return
    }
    if (!row.widthEdit) {
      this.$message.error('宽不能为空')
      return
    }
    if (!row.heightEdit) {
      this.$message.error('高不能为空')
      return
    }
    if (!row.weightEdit) {
      this.$message.error('重量不能为空')
      return
    }
    const params: any = {
      ...row
    }
    params.length = row.lengthEdit
    params.width = row.widthEdit
    params.height = row.heightEdit
    params.weight = row.weightEdit
    this.loading = true
    takeMeteringSave([params]).then(() => {
      this.loading = false
      this.$message.success('保存成功')
      this.loadData()
    }).catch(() => {
      this.loading = false
    })
  }
  private uploadFile(data: any) {
    const formData = new FormData()
    formData.append('file', data.file)
    formData.append('id', this.showRow.id)
    this.loading = true
    this.fileList = [data.file]
    takeMeteringImport(formData).then(() => {
      this.loading = false
      this.$message.success('导入成功')
      this.loadData()
      this.fileList = []
    }).catch(() => {
      this.loading = false
      this.fileList = []
    })
  }
  private exportData() {
    this.loading = true
    takeMeteringExport({ id: this.showRow.id }).then((res: any) => {
      this.loading = false
      res.text().then((text: any) => {
        const result = JSON.parse(text)
        if (result.data) {
          this.$message.error(res.data.msg || '文件下载失败')
        }
      }).catch(() => {
        const a = document.createElement('a')
        document.body.appendChild(a)
        const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        const objUrl = URL.createObjectURL(blob)
        a.href = objUrl
        a.download = '计量单' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.xls'
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(objUrl)
      })
    }).catch((err: any) => {
      this.loading = false
      err.data && err.data.text().then((text: any) => {
        try {
          const resData = JSON.parse(text)
          if (resData.code !== 200) {
            this.$message.error(resData.msg || '文件下载失败')
          }
        } catch (e) {
          return e
        }
      })
    })
  }
  private handleSizeChange(val: string) {
    this.pagination.size = Number(val)
  }
  private handleCurrentChange(val: string) {
    this.pagination.page = Number(val)
  }
  private loadData() {
    this.loading = true
    getTakeMetering({ id: this.showRow.id }).then((res: any) => {
      this.loading = false
      const data = res.data || {}
      const boxItems = data.boxItems || []
      const outMeterings = data.outMeterings || []
      this.tableData = outMeterings.reduce((list: any[], e: any) => {
        const box = boxItems.find((b: any) => b.boxCode === e.box)
        if (box) {
          list.push({
            box: box.boxCode,
            code: box.originalNo,
            ...box,
            isEdit: false
          })
        }
        list.push({
          lengthEdit: e.length,
          widthEdit: e.width,
          wigth: e.width,
          heightEdit: e.height,
          weightEdit: e.weight,
          ...e,
          edit: false,
          isEdit: true
        })
        return list
      }, [])
      this.pagination.total = this.tableData.length
    }).catch(() => {
      this.loading = false
      this.tableData = []
    })
  }
  private goBack() {
    this.tableData = []
    this.pagination = {
      page: 1,
      size: 20,
      total: 0
    }
    this.showRow = {}
    this.$emit('goBack')
  }
  private show(row: any) {
    this.showRow = row
    this.loadData()
  }
}
</script>

<style lang="scss" scoped>
  .supplement-express{
    width: 100%;
    height: 100%;
    padding: 24px;
  }
  ::v-deep{
    .el-table tr {
      &.jhtclass{
        background-color: #F5F5F5;
      }
    }
  }
</style>
