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
          v-permission="['outsourcExpressExport']"
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
          :show-file-list="false"
          :file-list="fileList"
          :http-request="uploadFile"
          style="display: inline-block;margin-left: 10px;"
        >
          <el-button
            v-permission="['outsourcExpressImport']"
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
        :data="tableDataPage"
        height="calc(100vh - 275px)"
        style="width: 100%;margin: 10px 0;"
        border
      >
        <el-table-column
          prop="code"
          label="原单号"
        />
        <el-table-column
          prop="pkgNo"
          label="箱号"
        />
        <el-table-column
          prop="identificationNo"
          label="主单号"
        >
          <template slot-scope="scope">
            <span v-if="!scope.row.edit">{{ scope.row.identificationNo }}</span>
            <span v-else>
              <el-input
                v-model="scope.row.identificationNoEdit"
                size="small"
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="trackingNo"
          label="子单号"
        >
          <template slot-scope="scope">
            <span v-if="!scope.row.edit">{{ scope.row.trackingNo }}</span>
            <span v-else>
              <el-input
                v-model="scope.row.trackingNoEdit"
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
              v-if="!scope.row.edit && $checkPermission(['outsourcExpressEdit'])"
              type="text"
              @click="edit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.edit"
              type="text"
              @click="cancel"
            >
              取消
            </el-button>
            <el-button
              v-if="scope.row.edit"
              type="text"
              @click="save(scope.row)"
            >
              保存
            </el-button>
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getOutExpress,
  outExpressExport,
  outExpressImport,
  saveOutExpress
} from '@/api/outsourc-shipment'
import dayjs from 'dayjs'

@Component({
  name: 'supplementExpress',
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
  private cancel() {
    this.tableData = this.tableData.map((e: any) => {
      e.edit = false
      return e
    })
  }
  private edit(row: any) {
    this.tableData = this.tableData.map((e: any) => {
      if (e.id === row.id) {
        e.edit = true
        e.identificationNoEdit = e.identificationNo
        e.trackingNoEdit = e.trackingNo
      } else {
        e.edit = false
      }
      return e
    })
  }
  private save(row: any) {
    if (!row.identificationNoEdit) {
      this.$message.error('主单号不能为空')
      return
    }
    const params: any = {
      ...row
    }
    params.identificationNo = row.identificationNoEdit
    params.trackingNo = row.trackingNoEdit
    this.loading = true
    saveOutExpress([params]).then(() => {
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
    outExpressImport(formData).then(() => {
      this.loading = false
      this.$message.success('导入成功')
      this.fileList = []
      this.loadData()
    }).catch(() => {
      this.loading = false
      this.fileList = []
    })
  }
  private exportData() {
    this.loading = true
    outExpressExport({ id: this.showRow.id }).then((res: any) => {
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
        a.download = '快递单' + dayjs().format('YYYY-MM-DD_HH-mm-ss') + '.xls'
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
    getOutExpress({ id: this.showRow.id }).then((res: any) => {
      this.loading = false
      this.tableData = (res.data || []).map((e: any) => {
        return {
          identificationNoEdit: e.identificationNo,
          trackingNoEdit: e.trackingNo,
          ...e,
          edit: false
        }
      })
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
</style>
