<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="产品库"
        />
        <div class="app-panel">
          <el-row>
            <el-col
              :span="6"
            >
              <el-button
                v-permission="['addGoods']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-left: 10px"
                @click="addProduct"
              >
                新增产品
              </el-button>
            </el-col>
            <el-col
              :span="18"
              style="text-align:right;"
            >
              <el-select
                v-model="selectValue.countryId"
                :loading="selectLoading"
                style="width:130px;margin-right:5px;"
                placeholder="国家/地区"
                size="small"
                filterable
                clearable
                @focus="getCountryList"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.state"
                size="small"
                style="width:120px;margin-right:5px;"
                placeholder="商品状态"
                clearable
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
              <el-input
                v-model="selectValue.keyword"
                placeholder="请输入内容"
                class="input-with-select"
                style="width: 300px;margin-right:10px;"
                size="small"
              >
                <el-select
                  slot="prepend"
                  v-model="selectType"
                  size="small"
                  style="width: 100px;"
                  placeholder="请选择"
                >
                  <el-option
                    label="SKU编码"
                    value="1"
                  />
                  <el-option
                    label="中文名称"
                    value="2"
                  />
                  <el-option
                    label="英文名称"
                    value="3"
                  />
                </el-select>
              </el-input>
              <el-button
                v-permission="['queryGoods']"
                type="primary"
                size="small"
                @click="queryAll(1)"
              >
                查询
              </el-button>
            </el-col>
          </el-row>

          <el-table
            v-loading="loading"
            :data="tableData"
            height="calc(100vh - 300px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              width="120"
              label="审核状态"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.state === 0">待审核</span>
                <span v-else-if="scope.row.state === 1">审核通过</span>
                <span v-else-if="scope.row.state === 2">审核拒绝</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="skuCode"
              min-width="150"
              label="SKU编码"
              show-overflow-tooltip
            />
            <el-table-column
              min-width="150"
              show-overflow-tooltip
            >
              <template slot="header">
                <span>商品名称(中文)</span>
                <br>
                <span>商品名称(英文)</span>
              </template>
              <template slot-scope="scope">
                <div class="word-limit">
                  <span>{{ scope.row.cnName ? scope.row.cnName : '--' }}</span>
                  <br>
                  <span>{{ scope.row.enName ? scope.row.enName : '--' }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="brand"
              min-width="120"
              label="品牌"
              show-overflow-tooltip
            />
            <el-table-column
              prop="size"
              min-width="120"
              label="规格"
              show-overflow-tooltip
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
                <div class="word-limit">
                  <span>{{ scope.row.cnMaterial ? scope.row.cnMaterial : '--' }}</span>
                  <br>
                  <span>{{ scope.row.enMaterial ? scope.row.enMaterial : '--' }}</span>
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
                <div class="word-limit">
                  <span>{{ scope.row.cnPurpose ? scope.row.cnPurpose : '--' }}</span>
                  <br>
                  <span>{{ scope.row.enPurpose ? scope.row.enPurpose : '--' }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="unitName"
              width="120"
              label="计量单位"
            />
            <el-table-column
              prop="title"
              min-width="120"
              label="商品类别"
            />
            <el-table-column
              width="120"
              label="报关信息"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="onDeclaration(scope.row)"
                >
                  报关信息
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              width="180"
              label="添加时间"
            />
            <el-table-column
              fixed="right"
              width="120"
              label="状态"
            >
              <template slot-scope="scope">
                <el-switch
                  :value="scope.row.status"
                  :disabled="!$checkPermission(['enableGoods'])"
                  class="switchStyle"
                  active-text="启用"
                  inactive-text="禁用"
                  :active-value="0"
                  :inactive-value="1"
                  @input="(value) => onStatus(scope.row, value)"
                />
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              width="150"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['editGoods']"
                  type="text"
                  @click="editProduct(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['deleteGoods']"
                  type="text"
                  @click="deleteProduct(scope.row)"
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
            :title="isEdit ? '编辑产品' : '新增产品'"
            width="1000px"
            :visible.sync="isAddEditVisible"
            :close-on-click-modal="false"
            @closed="cancel"
          >
            <AddEditProduct
              ref="addEditProduct"
              :product-property-list="productPropertyList"
              :goods-list="goodsList"
              :unit-list="unitList"
              :is-edit="isEdit"
              :loading="isAddFormLoading"
              @confirm="saveConfirm"
              @cancel="cancel"
            />
          </el-dialog>

          <el-dialog
            title="报关信息"
            width="1200px"
            :visible.sync="isDeclareVisible"
            :close-on-click-modal="false"
            @closed="closeDeclaration"
          >
            <DeclarationInfo
              ref="declarationInfo"
            />
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getProductList,
  getUnitList,
  saveAddEditProduct,
  getAllCustList,
  getCountryList,
  getGoodsList
} from '@/api/system-in-product-library'

import AddEditProduct from '@/views/system-management/product-library/components/addEditProduct.vue'
import DeclarationInfo from '@/views/system-management/product-library/components/declarationInfo.vue'

@Component({
  name: '',
  components: {
    AddEditProduct,
    DeclarationInfo
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private isAddEditVisible: boolean= false
  private isEdit: boolean = false
  private loading: boolean = false
  private isAddFormLoading:boolean = false
  private isDeclareVisible: boolean = false
  private tableData: any = []
  private selectType = '1'
  private selectValue: any = {
    countryId: undefined,
    state: undefined, // 商品状态
    keyword: undefined, // 搜索内容
    cnName: undefined,
    skuCode: undefined,
    enName: undefined
  }
  private productPropertyList:any[] = [
    { name: '普货', id: '0' },
    { name: '纯电', id: '1' },
    { name: '带电', id: '2' },
    { name: '带磁', id: '3' },
    { name: '危险', id: '4' }
  ]
  private selectLoading: boolean = false
  private page: number = 1
  private size: number = 10
  private total: any = 0
  private countryList: any[] = []
  private companyList: any[] = [{
    id: '0', name: '聚货通'
  }]
  private typeList: any[] = []
  private goodsList: any[] = []
  private unitList: any[] = []
  private sbtp = ''

  /* computed */
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }

  get custSubtype(): string {
    const info = UserModule.info || {}
    const custSubtype = (info as any).custSubtype
    return custSubtype
  }
  get custId():string {
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

  /* methods */
  private async created() {
    const type = (this as any).custType
    if (type === '0') { // 聚货通
      this.getCompanyList()
    }
    this.queryAll()
  }

  private getCompanyList() {
    const params:any = {
      page: 1,
      size: 99999,
      type: '0,1,2'
    }
    this.selectLoading = true
    getAllCustList(params).then((res:any) => {
      const data = res.data || {}
      this.companyList = data.result || []
      this.selectLoading = false
    }).catch((err:any) => {
      this.selectLoading = false
      return err
    })
  }

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

  private queryAll(val?: any): void {
    this.loading = true
    const { keyword, ...form } = this.selectValue
    if (val) {
      this.page = val
    }
    const params:any = {
      page: this.page,
      size: this.size,
      model: {
        ...form
      }
    }
    switch (this.selectType) {
      case '1':
        params.model.skuCode = keyword
        break
      case '2':
        params.model.cnName = keyword
        break
      case '3':
        params.model.enName = keyword
        break
    }
    getProductList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.tableData = data.result || []
        this.total = data.total
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

  private cancel() {
    this.isAddEditVisible = false
    this.$nextTick(() => {
      const root: any = this.$refs.addEditProduct
      root.setData([])
      root.resetForm()
    })
  }
  // 提交保存
  private saveConfirm() {
    const rootDom:any = this.$refs.addEditProduct
    const formDom:any = rootDom.$refs.productForm
    const selectForm: any = rootDom.selectForm
    formDom.validate((valid:any) => {
      if (!valid) return false
      this.isAddFormLoading = true
      const { categorieIds, ...form } = selectForm
      const attr = categorieIds.join(',')
      const params: any = {
        ...form,
        attribute: attr
      }
      if (selectForm.issued === '1') {
        params.packing = undefined
        params.storage = undefined
        params.weight = undefined
        params[length] = undefined
        params.lengthen = undefined
        params.wide = undefined
        params.high = undefined
        params.gross = undefined
        params.net = undefined
      }
      this.unitList.map((it: any) => {
        if (selectForm.unit === it.id) {
          params.unitName = it.unit
        }
      })
      saveAddEditProduct(params)
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.isAddEditVisible = false
          this.isAddFormLoading = false
          this.cancel()
          this.queryAll()
        })
        .catch((err: any) => {
          this.isAddFormLoading = false
          return err
        })
    })
  }

  private onDeclaration(row: any) {
    this.isDeclareVisible = true
    this.$nextTick(() => {
      const root: any = this.$refs.declarationInfo
      root.setData(row)
    })
  }
  private closeDeclaration() {
    this.isDeclareVisible = false
  }
  private async onStatus(row: any, value: any) {
    const olds = row.status.toString()
    const news = value.toString()
    if (!olds || olds === news) return
    const text = news === '1' ? '禁用' : '开启'
    const [cancel, confirm] = await this.$confirm(
      `此操作将${text}该产品库，是否继续？`,
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
    this.loading = true
    const params = {
      ...row,
      status: value
    }
    saveAddEditProduct(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '更新成功'
        })
        this.queryAll()
      })
      .catch((err: any) => {
        this.loading = false
        return err
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
      this.goodsList = json
    } catch (error) {
      this.isAddFormLoading = false
      return error
    }
  }

  private async getUnitList() {
    try {
      const res = await getUnitList()
      const data = res.data || []
      this.unitList = data
    } catch (error) {
      this.isAddFormLoading = false
      return error
    }
  }

  // 添加产品
  private async addProduct() {
    this.isAddEditVisible = true
    this.isEdit = false
    this.isAddFormLoading = true
    await this.getGoodsList()
    await this.getUnitList()
    const root: any = this.$refs.addEditProduct
    this.$nextTick(() => {
      root.setData([])
    })
    this.isAddFormLoading = false
  }
  // 编辑
  private async editProduct(row: any) {
    this.isAddEditVisible = true
    this.isEdit = true
    this.isAddFormLoading = true
    await this.getGoodsList()
    await this.getUnitList()
    const { url, attribute, productId } = row
    const categorieIds = attribute ? attribute.split(',') : []
    const arr = url ? url.split('.').splice(1) : []
    const obj:any = {
      ...row,
      categorieIds,
      productId: productId || ''
    }
    const root: any = this.$refs.addEditProduct
    this.$nextTick(() => {
      if (url) {
        root.setData([{
          name: arr.join('.'),
          url
        }], obj)
      } else {
        root.setData([], obj)
      }
    })
    this.isAddFormLoading = false
  }

  private deleteProduct(row: any) {
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.loading = true
        saveAddEditProduct({
          id: row.id,
          deleted: 1
        }).then((res:any) => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.queryAll()
        }).catch((err: any) => {
          this.loading = false
          return err
        })
      })
      .catch(() => {
        return false
      })
  }

  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.queryAll()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.queryAll()
  }
}
</script>
<style lang="scss" scoped>
  .el-table .cell{
    white-space:pre-line;
  }
  .word-limit {
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
