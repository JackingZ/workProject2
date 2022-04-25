<template>
  <div>
    <el-button
      v-permission="['goodsDeclarationInfoAdd']"
      type="text"
      icon="el-icon-circle-plus-outline"
      style="margin-right: 10px"
      @click="handleAdd"
    >
      新增报关信息
    </el-button>
    <el-table
      v-loading="loading"
      :data="list"
      height="400px"
      style="width: 100%;margin-top: 10px;"
      border
    >
      <el-table-column
        prop="status"
        label="状态"
        width="120"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">待审核</span>
          <span v-else-if="scope.row.status === 1">审核通过</span>
          <span v-else-if="scope.row.status === 2">审核拒绝</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="startCountryName"
        label="起运国"
        min-width="120"
      />
      <el-table-column
        prop="countryName"
        label="目的国"
        min-width="120"
      />
      <!--<el-table-column
        prop="title"
        label="商品类别"
        min-width="150"
      />-->
      <el-table-column
        prop="code"
        label="海关编码"
        min-width="120"
      />
      <el-table-column
        prop="price"
        label="单价"
        width="120"
      />
      <el-table-column
        prop="unitName"
        label="单位"
        width="120"
      />
      <el-table-column
        prop="isClearance"
        label="通关要求"
        width="120"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.isClearance === '0'">需要</span>
          <span v-else-if="scope.row.isClearance === '1'">不需要</span>
        </template>
      </el-table-column>
      <el-table-column
        label="认证文件"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            :disabled="!$checkPermission(['goodsDeclarationInfoUploadFile'])"
            type="text"
            size="medium"
            @click="onFiles(scope.row)"
          >
            上传文件
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="rate"
        label="税率(%)"
        width="120"
      />
      <el-table-column
        prop=""
        label="证书"
        min-width="120"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['goodsDeclarationInfoEdit']"
            type="text"
            size="medium"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-permission="['goodsDeclarationInfoDel']"
            type="text"
            size="medium"
            @click="handleDelete(scope.row)"
          >
            删除
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

    <el-dialog
      :title=" isEdit ? '编辑报关信息' : '新增报关信息'"
      width="600px"
      :visible.sync="addEditVisible"
      :close-on-click-modal="false"
      append-to-body
      @closed="cancel"
    >
      <div v-loading="formLoading">
        <el-form
          ref="infoForm"
          :model="selectForm"
          :rules="formRules"
          :disabled="selectForm.status === 1"
          label-width="100px"
          label-position="right"
          style="padding-right: 20px;"
          size="small"
        >
          <el-form-item
            label="起运国"
            prop="startCountry"
          >
            <el-select
              v-model="selectForm.startCountry"
              style="width:100%;"
              placeholder="请选择"
              filterable
              clearable
            >
              <el-option
                v-for="item in countryList"
                :key="item.id"
                :label="`${item.name}-${item.alias}`"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="目的国"
            prop="countryId"
          >
            <el-select
              v-model="selectForm.countryId"
              style="width:100%;"
              placeholder="请选择"
              filterable
              clearable
            >
              <el-option
                v-for="item in countryList"
                :key="item.id"
                :label="`${item.name}-${item.alias}`"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="false"
            label="商品状态"
            prop="status"
          >
            <el-select
              v-model="selectForm.status"
              style="width:100%;"
              placeholder="请选择"
            >
              <el-option
                label="待审核"
                :value="0"
              />
              <el-option
                label="审核通过"
                :value="1"
              />
              <el-option
                label="审核拒绝"
                :value="2"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item
            label="商品类别"
            prop="categoryId"
          >
            <el-tree-select
              v-model="selectForm.categoryId"
              :data="goodsList"
              :default-expand-all="false"
              filterable
              clearable
              size="small"
              style="width: 100%;z-index: 2100;"
              placeholder="请选择"
            />
          </el-form-item> -->
          <el-form-item
            label="销售单价"
            prop="price"
          >
            <el-input-number
              v-model="selectForm.price"
              class="input-number-valiate"
              :controls="false"
              placeholder="请输入"
              :min="0"
              :max="99999"
              :precision="2"
            />
          </el-form-item>
          <el-form-item
            label="销售单位"
            prop="unit"
          >
            <el-select
              v-model="selectForm.unit"
              clearable
              filterable
              size="small"
              style="width:100%;"
              placeholder="请选择"
            >
              <el-option
                v-for="item in unitList"
                :key="item.id"
                :label="item.unit"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="销售链接">
            <el-input
              v-model="selectForm.url"
              placeholder="请输入"
              :maxlength="150"
            />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="selectForm.remark"
              placeholder="请输入"
              :maxlength="150"
            />
          </el-form-item>
        </el-form>
        <div style="text-align: right;padding: 10px 20px 0 0;">
          <el-button
            size="small"
            @click="cancel"
          >
            取 消
          </el-button>
          <el-button
            :disabled="selectForm.status === 1"
            type="primary"
            size="small"
            @click="comfirm"
          >
            确 定
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="上传文件"
      width="800px"
      :visible.sync="fileVisible"
      :close-on-click-modal="false"
      append-to-body
      @closed="fileVisible = false"
    >
      <el-table
        v-loading="fileLoading"
        :data="fileData"
        height="380px"
        style="width: 100%;margin-top: 10px;"
        border
      >
        <el-table-column
          width="100"
          property="status"
          label="文件状态"
        >
          <template slot-scope="inScope">
            {{ inScope.row.url ? '已上传' : '待上传' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="审核状态"
          width="100"
        >
          <template slot-scope="inScope">
            {{ (fileStatus.find(e => e.id === inScope.row.status) || {}).name }}
          </template>
        </el-table-column>
        <el-table-column
          prop="fileName"
          label="文件名称"
        />
        <el-table-column
          min-width="100"
          label="拒绝原因"
          show-overflow-tooltip
        >
          <template slot-scope="inScope">
            {{ inScope.row.status === 4 ? inScope.row.reason : '' }}
          </template>
        </el-table-column>
        <el-table-column
          label="上传文件"
          width="120"
        >
          <template slot-scope="scope">
            <el-upload
              ref="uploadFile"
              action
              :multiple="false"
              :limit="1"
              :auto-upload="false"
              :show-file-list="false"
              :http-request="uploadFile"
              :on-change="onFileChange"
              :file-list="fileList"
              :disabled="selectForm.status === 1"
            >
              <el-button
                :disabled="selectForm.status === 1"
                type="text"
                size="medium"
                @click="fileBtn(scope.row)"
              >
                上传文件
              </el-button>
            </el-upload>
          </template>
        </el-table-column>
        <el-table-column
          label="下载"
          width="120"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="medium"
              @click="loadFile(scope.row)"
            >
              下载
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
  getDeclareList,
  saveAddEditDeclare,
  getCountryList,
  getGoodsList,
  getUnitList,
  getFileEmptyList,
  uploadSingleFile
} from '@/api/system-in-product-library'
import dayjs from 'dayjs'

@Component({
  name: '',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private selectForm: any = {
    startCountry: undefined,
    startCountryName: undefined,
    countryId: undefined,
    countryName: undefined,
    status: 0,
    categoryId: '',
    id: undefined,
    price: undefined,
    unit: undefined,
    url: undefined,
    remark: undefined
  }
  private formRules = {
    startCountry: { required: true, message: '请选择起运国', trigger: 'change' },
    countryId: { required: true, message: '请选择目的国', trigger: 'change' },
    status: { required: false, message: '请选择商品状态', trigger: 'change' },
    categoryId: { required: true, message: '请选择商品类别', trigger: 'change' },
    price: { required: true, message: '销售单价不能为空', trigger: 'blur' },
    unit: { required: true, message: '销售单位不能为空', trigger: 'blur' }
  }
  private form: any = {}
  private formLoading: boolean = false
  private countryList: any[] = []
  private goodsList: any[] = []
  private unitList: any[] = []
  private fileObj: any = {}
  private oldUrl = ''
  private declareId = ''
  private fileList: any[] = []
  private fileData: any[] = []
  private fileLoading: boolean = false
  private addEditVisible: boolean = false
  private fileVisible: boolean = false
  private loading: boolean = false
  private selectLoading: boolean = false
  private isEdit: boolean = false
  private list: any[] = []
  private page: number = 1
  private size: number = 10
  private total: any = 0
  private fileStatus: any[] = [
    // {
    //   id: 0,
    //   name: '待上传'
    // },
    {
      id: 1,
      name: '待审核'
    },
    {
      id: 2,
      name: '审核中'
    },
    {
      id: 3,
      name: '审核通过'
    },
    {
      id: 4,
      name: '审核拒绝'
    }
  ]
  /* 方法 */

  private getCountryList() {
    this.selectLoading = true
    getCountryList()
      .then((res: any) => {
        const data = res.data || {}
        this.countryList = data.result || []
        this.selectLoading = false
      }).catch((err: any) => {
        this.selectLoading = false
        return [err, null]
      })
  }
  private async getGoodsList() {
    try {
      const res = await getGoodsList({
        type: 2, parentId: 0
      })
      const data = res.data || []
      const json = JSON.parse(
        JSON.stringify(data)
          .replace(/title/g, 'label')
          .replace(/id/g, 'value')
      )
      this.$nextTick(() => {
        this.goodsList = json
      })
    } catch (error) {
      this.formLoading = false
      return error
    }
  }

  private async getUnitList() {
    try {
      const res = await getUnitList()
      const data = res.data || []
      this.unitList = data
    } catch (error) {
      this.formLoading = false
      return error
    }
  }
  private setData(row: any) {
    const { id } = row
    this.form = {
      libraryId: id
    }
    this.getCountryList()
    this.getTableData()
  }
  private getTableData() {
    this.loading = true
    const params:any = {
      page: this.page,
      size: this.size,
      model: {
        libraryId: this.form.libraryId
      }
    }
    getDeclareList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.list = data.result || []
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.getTableData()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.getTableData()
  }

  // 新增
  private async handleAdd() {
    this.addEditVisible = true
    this.isEdit = false
    this.formLoading = true
    await this.getUnitList()
    await this.getGoodsList()
    this.formLoading = false
  }
  private async handleEdit(row: any) {
    this.addEditVisible = true
    this.isEdit = true
    this.formLoading = true
    await this.getGoodsList()
    await this.getUnitList()
    const { countryId, status, categoryId, price, unit, url, remark, id, startCountry } = row
    this.selectForm = {
      countryId, startCountry, status, price, unit, url, remark, id, categoryId: categoryId || ''
    }
    this.formLoading = false
  }
  private handleDelete(row: any) {
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.loading = true
        saveAddEditDeclare({
          ...row,
          deleted: 1
        }).then((res:any) => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getTableData()
        }).catch((err: any) => {
          this.loading = false
          return err
        })
      })
      .catch(() => {
        return false
      })
  }
  private onFiles(row: any) {
    this.fileVisible = true
    this.declareId = row.id
    this.getFileList()
  }
  private getFileList() {
    this.fileLoading = true
    getFileEmptyList({
      declareId: this.declareId
    })
      .then((res: any) => {
        const data = res.data || []
        this.fileData = data
        this.fileLoading = false
      })
      .catch((err: any) => {
        this.fileLoading = false
        return err
      })
  }
  private fileBtn(row: any) {
    this.fileObj = {
      ...row
    }
    this.oldUrl = row.url
  }
  // 保存文件路径
  private fileSave() {
    uploadSingleFile({
      ...this.fileObj
    })
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '上传成功'
        })
        this.getFileList()
      })
      .catch((err: any) => {
        this.fileLoading = false
        return err
      })
  }

  // 上传文件流
  private uploadFile(params: any) {
    // 无法触发
  }
  private fileRemove() {
    this.$deleteLoad(this.oldUrl, true)
      .then((res: any) => {
        // this.$message.success(`删除成功`)
      })
      .catch((err: any) => {
        this.fileLoading = false
        return err
      })
  }

  private onFileChange(file: any, fileList: any[]) {
    const { raw, name } = file
    this.fileLoading = true
    this.$upload(true, raw, `jht-admin/declaration/${dayjs().valueOf() + '/' + name}`)
      .then((res: any) => {
        const { data } = res
        this.fileObj.url = data
        this.fileRemove()
        this.fileSave()
      })
      .catch((err:any) => {
        this.fileLoading = false
        return err
      })
  }
  private loadFile(row: any) {
    if (row.url) {
      const url = process.env.VUE_APP_OSS_PATH + row.url
      window.open(url)
    } else {
      this.$message.error('暂无文件可下载')
    }
  }

  private cancel() {
    this.addEditVisible = false
    this.resetForm()
    this.$nextTick(() => {
      const formDom: any = this.$refs.infoForm
      formDom.clearValidate()
    })
  }
  private comfirm() {
    const formDom: any = this.$refs.infoForm
    formDom.validate((valid: any) => {
      if (!valid) return false
      this.formLoading = true
      const params: any = { ...this.selectForm, ...this.form }
      this.countryList.map((it: any) => {
        if (it.id === this.selectForm.countryId) {
          params.countryName = it.name
        }
        if (it.id === this.selectForm.startCountry) {
          params.startCountryName = it.name
        }
      })
      this.unitList.map((it: any) => {
        if (it.id === this.selectForm.unit) {
          params.unitName = it.unit
        }
      })
      saveAddEditDeclare(params)
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.resetForm()
          this.cancel()
          this.formLoading = false
          this.addEditVisible = false
          this.getTableData()
        })
        .catch((err: any) => {
          this.formLoading = false
          return err
        })
    })
  }
  private resetForm() {
    this.selectForm = {
      startCountry: undefined,
      countryId: undefined,
      status: 0,
      categoryId: '',
      price: undefined,
      unit: undefined,
      url: undefined,
      remark: undefined
    }
  }
}
</script>

<style lang="scss" scoped>
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
</style>
<style lang="scss">
.el-tree-select-dropdown {
  z-index: 9999 !important;
}
</style>
