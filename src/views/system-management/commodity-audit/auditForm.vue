<template>
  <div v-loading="formLoading">
    <el-form
      ref="auditForm"
      :model="selectForm"
      :rules="formRules"
      label-width="100px"
      label-position="right"
      size="mini"
    >
      <el-form-item
        label="商品图片："
        style="width: 100%;"
      >
        <div
          v-show="imgUrl"
          class="img-show"
        >
          <img
            :src="imgUrl"
            class="avatar-img"
          >
          <span
            class="img-action"
            @click.stop=""
          >
            <i
              class="el-icon-zoom-in img-icon"
              @click.stop="onImgShow"
            />
          </span>
        </div>
      </el-form-item>
      <el-form-item label="中文名称：">
        {{ selectForm.cnName }}
      </el-form-item>
      <el-form-item label="英文名称：">
        {{ selectForm.enName }}
      </el-form-item>
      <el-form-item label="品牌名称：">
        {{ selectForm.brand }}
      </el-form-item>
      <el-form-item label="规格：">
        {{ selectForm.size }}
      </el-form-item>
      <el-form-item label="中文材质：">
        {{ selectForm.cnMaterial }}
      </el-form-item>
      <el-form-item label="英文材质：">
        {{ selectForm.enMaterial }}
      </el-form-item>
      <el-form-item label="中文用途：">
        {{ selectForm.cnPurpose }}
      </el-form-item>
      <el-form-item label="英文用途：">
        {{ selectForm.enPurpose }}
      </el-form-item>
      <el-form-item label="商品规格：">
        {{ selectForm.size }}
      </el-form-item>
      <el-form-item label="计量单位：">
        {{ selectForm.unitName }}
      </el-form-item>

      <div style="border-top: 1px solid #f2f2f2;padding-top: 10px;">
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="目的国："
              style="width: 100%;margin-bottom: 5px;"
            >
              {{ selectForm.countryName }}
            </el-form-item>
            <el-form-item
              label="商品分类："
              prop="categoryId"
              style="width: 100%;margin-bottom: 18px;"
            >
              <!-- <el-tree-select
                v-model="selectForm.categoryId"
                :data="goodsList"
                :default-expand-all="false"
                filterable
                clearable
                size="small"
                style="width: 100%;z-index: 2100;"
                placeholder="请选择"
                @change="onGoods"
              /> -->
              <el-input
                v-model="selectForm.categoryName"
                size="small"
                disabled
                placeholder="请选择商品分类"
              >
                <el-button
                  slot="append"
                  :disabled="isType === 'view'"
                  type="primary"
                  icon="el-icon-search"
                  @click="showCategoryDialog"
                />
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="备注："
              style="width: 100%;"
            >
              <el-input
                v-model="selectForm.remarks"
                :autosize="{minRows: 2, maxRows: 3}"
                type="textarea"
                :maxlength="200"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="4"
            style="text-align: right;padding-top: 20px;"
          >
            <el-button
              v-show="isType !== 'view'"
              type="primary"
              size="small"
              @click="comfirm"
            >
              保存
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div style="height: 6px; margin: 5px 0 10px 0;background-color: #f2f2f2;" />
      <div style="text-align: right;">
        <span>海关编码&nbsp;</span>
        <el-input
          v-model="selectValue.customCode"
          placeholder="请输入"
          style="width:150px;margin-right: 10px;"
          size="small"
        />
        <span>商品中文名称&nbsp;</span>
        <el-input
          v-model="selectValue.cnName"
          placeholder="请输入"
          style="width:150px;margin-right: 10px;"
          size="small"
        />
        <span>商品英文名称&nbsp;</span>
        <el-input
          v-model="selectValue.enName"
          placeholder="请输入"
          style="width:150px;margin-right: 10px;"
          size="small"
        />
        <el-button
          type="primary"
          :disabled="isType === 'view'"
          size="small"
          @click="onSearch"
        >
          查询
        </el-button>
      </div>
      <el-table
        v-show="rowId && rowData.length > 0"
        :data="rowData"
        height="35px"
        class="row-select"
        style="width: 100%;margin-top: 10px;"
        border
      >
        <el-table-column
          width="55"
          label=""
        >
          <template slot-scope="scope">
            <i
              class="el-icon-close"
              style="color: #FF7D19;cursor: pointer;"
              @click="onRowClear(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="cnName"
          label="商品名称(中文)"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="enName"
          label="商品名称(英文)"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="customCode"
          label="海关编码"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="essentialFactor"
          label="申报要素"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="category"
          label="商品类别"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="remarks"
          label="备注"
          min-width="120"
          show-overflow-tooltip
        />
      </el-table>

      <div
        v-show="taxList"
        class="tax-list"
      >
        <div
          v-for="item in taxList"
          :key="item.value"
          style="display: inline-block;padding: 0 10px;"
        >
          {{ item.name }}：{{ item.value }}
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        height="300px"
        style="width: 100%;margin-top: 10px;"
        border
        highlight-current-row
        @row-click="onRowSelect"
      >
        <el-table-column
          width="55"
          label=""
        >
          <template slot-scope="scope">
            <el-radio
              v-model="rowId"
              :label="scope.row.id"
            >
              &nbsp;
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          prop="cnName"
          label="商品名称(中文)"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="enName"
          label="商品名称(英文)"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="customCode"
          label="海关编码"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="essentialFactor"
          label="申报要素"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="category"
          label="商品类别"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="remarks"
          label="备注"
          min-width="120"
          show-overflow-tooltip
        />
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
    </el-form>

    <el-dialog
      title="商品类别"
      :visible.sync="categoryVisible"
      :close-on-click-modal="false"
      width="1000px"
      append-to-body
    >
      <div
        class="search-input"
      >
        <el-input
          v-model="keyWord"
          size="small"
          style="width: 300px"
          placeholder="请输入内容"
        />
        <el-button
          type="text"
          size="mini"
          @click="clearSelect"
        >
          清除选择
        </el-button>
      </div>
      <div class="modal-content">
        <div class="left-box">
          <div class="content-title">
            <div class="title">
              已选择
            </div>
            <div class="country">
              {{ selectForm.categoryName }}
            </div>
          </div>
          <div
            v-if="productClassList.length"
            class="left-content"
          >
            <div
              v-for="item in productClassList"
              :key="item.value"
              class="item"
              :class="{active: selectCategory.value === item.value}"
              @click="selectCategoryClick(item)"
            >
              {{ item.label }}
            </div>
          </div>
          <el-empty
            v-else
            description="暂无数据"
          />
        </div>
        <div class="right-box">
          <el-table
            :data="subProductClassList"
            height="500px"
            style="width: 100%;"
            border
          >
            <el-table-column
              width="50"
            >
              <template slot-scope="scope">
                <div style="text-align: center;">
                  <el-radio
                    v-model="selectForm.categoryId"
                    :label="scope.row.value"
                    @change="selectCategoryChange"
                  >
                    &nbsp;
                  </el-radio>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="所属大类"
              prop="pCategory"
            />
            <el-table-column
              label="类别名称"
              prop="label"
              show-overflow-tooltip
            />
            <el-table-column
              label="备注"
              prop="remarks"
              show-overflow-tooltip
            />
          </el-table>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="商品图片"
      :visible.sync="imgShow"
      :close-on-click-modal="false"
      append-to-body
      width="500px"
      @closed=";(imgShow = false)"
    >
      <img
        :src="imgUrl"
        style="display: block;height: 100%;width: 100%;object-fit: contain;"
      >
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  saveApprovedAudit,
  getGoodsList,
  getFactorList,
  getFactorCode,
  getRates
} from '@/api/system-in-commodity-audit'

@Component({
  name: '',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private selectForm: any = {
    remarks: undefined,
    categoryId: '',
    categoryName: undefined
  }
  private formRules = {
    categoryId: { required: true, message: '请选择商品分类', trigger: 'change' }
  }
  private selectValue: any = {
    customCode: undefined,
    enName: undefined,
    cnName: undefined
  }
  private selectCategory: any = {}
  private formLoading: boolean = false
  private selectLoading: boolean = false
  private loading: boolean = false
  private categoryVisible: boolean = false
  private tableData: any[] = []
  private goodsList: any[] = []
  private subGoodsList: any[] = []
  private taxList: any[] = []
  private keyWord = ''
  private imgUrl = ''
  private imgShow: boolean = false
  private rowId: any = ''
  private isType = ''
  private rowObj: any = {}
  private rowData: any[] = []
  private page: number = 1
  private size: number = 10
  private total: number = 0

  /** computed */
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }
  get productClassList() {
    return this.goodsList.filter((p: any) => {
      const c = p.children.filter((s: any) => s.label.indexOf(this.keyWord) !== -1)
      if (c.length) {
        return p
      }
      return p.label.indexOf(this.keyWord) !== -1
    })
  }
  get subProductClassList() {
    const list = this.selectCategory.children || []
    return list.map((e: any) => {
      return {
        ...e,
        pCategory: this.selectCategory.label
      }
    }).filter((p: any) => p.label.indexOf(this.keyWord) !== -1)
  }
  /* methods */
  private onSearch() {
    this.getFactorData(1)
  }
  private onGoods(data: any) {
    this.goodsList.map((item: any) => {
      if (data === item.value) {
        this.selectForm.categoryId = ''
        this.$message.error('请选择下级类别')
      }
    })
  }
  private showCategoryDialog() {
    this.categoryVisible = true
    this.selectCategory = this.goodsList.find((p: any) => {
      const a = p.children.find((c: any) => c.value === this.selectForm.categoryId)
      return !!(a)
    }) || {}
  }
  private clearSelect() {
    this.selectForm.categoryId = ''
    this.selectForm.categoryName = ''
  }
  private selectCategoryClick(item: any) {
    this.selectCategory = item
  }
  private selectCategoryChange() {
    const category: any = this.subProductClassList.find((c: any) => c.value === this.selectForm.categoryId) || {}
    this.selectForm.categoryName = category.label
    this.categoryVisible = false
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
  private getFactorData(val?: any) {
    if (!this.selectForm.countryId) return
    this.loading = true
    if (val) {
      this.page = val
    }
    const params:any = {
      page: this.page,
      size: this.size,
      model: {
        ...this.selectValue,
        countryId: this.selectForm.countryId,
        id: this.isType === 'view' ? this.rowObj.id : undefined
      }
    }
    getFactorList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.tableData = data.result || []
        if (this.isType === 'view') {
          this.rowData = this.tableData.filter((it: any) => `${it.id}` === this.rowObj.id).map((it: any) => {
            it.id = it.id + ''
            return it
          })
        }
        this.total = data.total
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private handleSizeChange(size: any): any {
    this.size = size
    this.getFactorData()
  }

  private handleCurrentChange(page: any): any {
    this.page = page
    this.getFactorData()
  }
  private async onRowSelect(row: any) {
    this.rowId = row.id
    this.rowObj = row
    this.rowData = [row]
    await this.getCodeTax()
  }
  private async getCodeTax() {
    try {
      if (!this.rowObj.customCode) return
      const resR = await getRates({
        hsCode: this.rowObj.customCode,
        ic: this.selectForm.countryId,
        type: '1',
        state: ''
      })
      this.taxList = Array.isArray(resR.data) ? resR.data : []
    } catch (error) {
      return error
    }
  }
  private onRowClear(val?: any) {
    this.rowId = ''
    this.rowObj = {}
    this.taxList = []
    this.rowData = []
  }

  private async setData(row: any, str: any) {
    this.formLoading = true
    this.isType = str
    await this.getGoodsList()
    const { categoryId, declareEssentialId, code } = row
    let categoryName = ''
    this.goodsList.map((it: any) => {
      let isTrue = false
      !isTrue && (it.children || []).map((c: any) => {
        if (c.value === categoryId) {
          categoryName = c.label
          isTrue = true
        }
      })
    })
    this.selectForm = {
      ...row,
      categoryId: categoryId || '',
      categoryName
    }
    this.selectValue = {
      customCode: row.code,
      enName: row.enName,
      cnName: row.cnName
    }
    if (str === 'view') {
      this.rowId = declareEssentialId
      this.rowObj.id = declareEssentialId
      this.rowObj.customCode = code
      await this.getCodeTax()
    }
    this.imgUrl = process.env.VUE_APP_OSS_PATH + row.url
    this.getFactorData()
    this.formLoading = false
  }

  private cancel() {
    this.resetForm()
    this.$nextTick(() => {
      const formDom:any = this.$refs.auditForm
      formDom.clearValidate()
    })
  }
  private comfirm() {
    const formDom:any = this.$refs.auditForm
    formDom.validate((valid:any) => {
      if (!valid) return false
      if (!this.rowObj.id) {
        this.$message.error('请选择列表中的报关要素')
        return
      }
      this.formLoading = true
      const params: any = {
        code: this.rowObj.customCode,
        declareEssentialId: this.rowObj.id,
        id: this.selectForm.id,
        libraryId: this.selectForm.libraryId,
        categoryId: this.selectForm.categoryId,
        number: this.selectForm.number || undefined,
        remarks: this.selectForm.remarks,
        status: this.rowObj.customCode ? 1 : 0
      }

      saveApprovedAudit(params)
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '提交成功'
          })
          this.formLoading = false
          this.cancel()
          this.$emit('auditCancel')
          this.$emit('queryAll')
        })
        .catch((err: any) => {
          this.formLoading = false
          return err
        })
    })
  }
  private resetForm() {
    this.selectForm = {
      remark: undefined,
      categoryId: ''
    }
    this.selectValue = {
      customCode: undefined,
      enName: undefined,
      cnName: undefined
    }
    this.rowId = ''
    this.rowObj = {}
    this.taxList = []
  }
  private onImgShow() {
    this.imgShow = true
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  display: inline-block;
  width: 49.5%;
  vertical-align: top;
  margin-bottom: 0;
}
::v-deep .el-form-item__label {
  line-height: 22px;
}
::v-deep .el-form-item__content {
  line-height: 22px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.row-select {
  ::v-deep .el-table__header-wrapper {
    display: none;
  }
  ::v-deep .el-table__row {
    background: rgba(255, 125, 25, 0.05);
    border: 1px solid #FF7D19;
  }
}

.tax-list {
  background-color: #fafafa;
  margin-top: 5px;
  padding: 5px 0;
}
.search-input{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
}
.modal-content{
  /*margin-top: 20px;*/
  display: flex;
  .left-box{
    width: 300px;
    /*height: 530px;*/
    border: 1px solid #DBDFE5;
    .content-title{
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #DBDFE5;
      padding: 9px 10px;
      .title{
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 20px;
        color: #303133;
        width: 60px;
      }
      .country{
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 17px;
        color: #323232;
        flex: 1;
      }
    }
    .left-content{
      height: 460px;
      overflow: auto;
      .item{
        cursor: pointer;
        width: 100%;
        padding: 10px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #303133;
        transition: all .3s;
        &:hover{
          background: #F7F7F7;
        }
        &.active{
          background: #F7F7F7;
        }
      }
    }
  }
  .right-box{
    margin-left: 20px;
    flex: 1;
  }
}

  .avatar-img {
    display: inline-block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  ::v-deep .img-show:hover .img-action {
    opacity: 0.8;
  }
  .img-show {
    position: relative;
    height: 80px;
    width: 80px;
    line-height: 80px;
  }
  .img-action {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0,0,0,.5);
    transition: opacity .3s;
  }
  .img-icon {
    cursor: pointer;
  }
</style>
