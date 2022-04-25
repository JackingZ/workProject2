<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <app-slide
      v-loading="isSideLoading"
      width="420"
      :is-active="isActive"
    >
      <div style="padding-bottom: 5px;border-bottom: 1px solid #e8e8e8;">
        <el-row>
          <el-col
            :span="5"
            style="line-height: 32px;"
          >
            商品类别
          </el-col>
          <el-col
            :span="19"
            style="text-align: right;"
          >
            <!-- <el-select
              v-model="searchForm.type"
              placeholder="类别"
              style="width:130px;margin-right: 5px;"
              size="small"
              filterable
              @change="onType"
            >
              <el-option
                label="报关类型"
                :value="1"
              />
              <el-option
                label="附加费类型"
                :value="2"
              />
            </el-select>
            <el-select
              v-if="searchForm.type === 1"
              v-model="searchForm.countryId"
              placeholder="所属国家"
              style="width:130px;"
              size="small"
              filterable
              @focus="getCountryList"
              @change="onCountry"
            >
              <el-option
                v-for="item in countryList"
                :key="item.id"
                :label="`${item.name}-${item.alias}`"
                :value="item.id"
              />
            </el-select> -->
          </el-col>
        </el-row>
      </div>
      <el-tree
        ref="treeList"
        :data="treeList"
        :props="treeProps"
        :expand-on-click-node="false"
        :load="loadNode"
        lazy
        empty-text="暂无数据"
        class="filter-tree"
        accordion
        highlight-current
        @node-click="onTreeClick"
      />
    </app-slide>
    <div
      style="display: flex;align-items: center;"
    >
      <div
        class="arrow-btn"
        @click="toggle"
      >
        <img
          :class="{arrow: !isActive}"
          src="@/assets/imgs/arrow_left.png"
          alt
        >
      </div>
    </div>

    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          title="商品类别"
          info="点击左侧的商品类别目录节点"
        />
        <div class="app-panel">
          <el-button
            v-if="currentNode && currentNode.level < 3 && $checkPermission(['jhtQuoteAdd'])"
            size="small"
            type="text"
            style="margin-right: 20px;"
            @click="addType"
          >
            新增
          </el-button>

          <el-input
            v-model="search"
            placeholder="类别名称"
            clearable
            size="small"
            style="width: 250px;"
          />

          <el-table
            v-loading="loading"
            :data="tableData"
            height="calc(100vh - 295px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              label="类别名称"
              min-width="150"
              prop="title"
              show-overflow-tooltip
            />
            <el-table-column
              label="备注"
              min-width="200"
              prop="remarks"
              show-overflow-tooltip
            />
            <el-table-column
              v-if="searchForm.type === 1"
              label="是否全检产品"
              width="150"
              prop="checked"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.checked === 1">否</span>
                <span v-else-if="scope.row.checked === 0">是</span>
              </template>
            </el-table-column>
            <el-table-column
              label="设置附加费"
              width="120"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="currentNode && currentNode.level === 2"
                  :disabled="!$checkPermission(['jhtQuoteSetCost'])"
                  type="text"
                  size="medium"
                  @click="setCost(scope.row)"
                >
                  设置附加费
                </el-button>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="120"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['jhtQuoteUpdate']"
                  type="text"
                  size="medium"
                  @click="editRow(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['jhtQuoteDel']"
                  type="text"
                  size="medium"
                  @click="deteleRow(scope.row)"
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
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <el-dialog
      :title="isEdit ? '编辑商品类别' : '新增商品类别'"
      :visible.sync="isDialogFormShow"
      :close-on-click-modal="false"
      width="600px"
      @closed="cancel"
    >
      <div v-loading="dialogLoading">
        <el-form
          ref="editForm"
          :model="form"
          :rules="formRules"
          label-width="120px"
          label-position="right"
          size="small"
          style="padding-right: 20px;"
        >
          <el-form-item
            prop="title"
            label="类别名称"
          >
            <el-input
              v-model="form.title"
              autocomplete="off"
              style="width: 100%"
              :maxlength="50"
            />
          </el-form-item>
          <el-form-item
            v-if="searchForm.type === 1"
            label="是否全检产品"
            prop="checked"
          >
            <el-radio-group
              v-model="form.checked"
            >
              <el-radio
                :label="1"
              >
                否
              </el-radio>
              <el-radio
                :label="0"
              >
                是
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="备注"
          >
            <el-input
              v-model="form.remarks"
              :maxlength="200"
              :autosize="{minRows: 2, maxRows: 4}"
              type="textarea"
              placeholder="请输入"
              style="width:100%;"
            />
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          style="text-align: right;padding-top: 10px;"
        >
          <el-button
            size="small"
            @click="cancel"
          >
            取 消
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="saveCustoms"
          >
            确 定
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="设置附加费"
      :visible.sync="isSetVisible"
      :close-on-click-modal="false"
      width="600px"
      @close="close"
    >
      <div
        v-loading="formLoading"
        style="padding-right: 30px;"
      >
        <el-form
          ref="costForm"
          :model="selectForm"
          label-width="90px"
          label-position="right"
          size="small"
        >
          <el-form-item
            label="计费单位"
            prop="billingUnit"
          >
            <el-radio-group
              v-model="selectForm.billingUnit"
              :disabled="custType !== '0'"
              @change="onBillUnit"
            >
              <el-radio
                :label="1"
              >
                按重量
              </el-radio>
              <el-radio
                :label="2"
              >
                按个数
              </el-radio>
              <el-radio
                :label="3"
              >
                按金额
              </el-radio>
              <el-radio
                :label="4"
              >
                单询
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="selectForm.billingUnit !== 4"
            label="附加费(￥)"
            prop="sections"
          >
            <div
              v-for="(item, index) in selectForm.sections"
              :key="index"
              class="item-after-icon"
            >
              <el-select
                v-model="selectForm.sections[index].countryId"
                :disabled="custType !== '0'"
                placeholder="国家"
                style="width:200px;"
                size="small"
                filterable
              >
                <el-option
                  v-for="(it, idx) in countryList"
                  :key="idx"
                  :label="`${it.name}-${it.alias}`"
                  :value="it.id"
                />
              </el-select>
              <el-input-number
                v-model="selectForm.sections[index].price"
                class="input-number-valiate"
                :controls="false"
                placeholder="单价"
                :min="0"
                :max="999999"
                :precision="2"
              />
              <span v-if="custType === '0'">
                <i
                  v-if="index===0"
                  class="el-icon-circle-plus-outline item-icon-plus"
                  @click="addRangeData"
                />
                <i
                  v-else
                  class="el-icon-remove-outline item-icon-reduce"
                  @click="deleteRangeData(index)"
                />
              </span>
            </div>
          </el-form-item>
        </el-form>
        <div
          style="padding-top: 10px;text-align: right;"
        >
          <el-button
            size="small"
            @click="close"
          >
            取 消
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click="saveCost"
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
import { AppModule } from '@/store/modules/app'
import {
  getProductList,
  saveProduct,
  getCountryList,
  getCost,
  saveCost
} from '@/api/operation-of-product-type'

@Component({
  name: '',
  components: {},
  props: {}
})
export default class extends Vue {
  private isEdit: boolean = false
  private isDialogFormShow: boolean = false
  private isActive: boolean = true
  private isSideLoading: boolean = false
  private loading: boolean = false
  private dialogLoading: boolean = false
  private formLoading: boolean = false
  private isSetVisible: boolean = false
  private list: any[] = []
  private countryList: any[] = []
  private treeList: any[] = []
  private size = 10
  private page = 1
  private search = ''
  // private total = 0
  private treeProps = {
    label: 'title',
    children: 'children',
    isLeaf: 'leaf'
  }
  private searchForm: any = {
    type: 2,
    countryId: undefined,
    countryName: undefined
  }
  private selectForm: any = {
    billingUnit: 1,
    sections: []
  }
  private currentNode: any = {}
  private form: any = {
    checked: undefined,
    title: undefined,
    remarks: undefined,
    countryId: undefined,
    countryName: undefined,
    createTime: undefined,
    createUser: undefined,
    id: undefined,
    parentId: undefined,
    titleAlias: undefined,
    type: undefined
  }
  private formRules = {
    title: { required: true, message: '类别名称不能为空', trigger: 'blur' },
    checked: { required: true, message: '请选择是否全检产品', trigger: 'change' }
  }

  /** computed */
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }

  get userId(): string {
    const info = UserModule.info || {}
    const userId = (info as any).username
    return userId
  }

  get tableData() {
    const { resultData, page, size } = this
    return resultData.slice((page - 1) * size, page * size)
  }

  get total() {
    const { resultData } = this
    return resultData.length
  }

  get resultData() {
    const { search, list } = this
    if (search) {
      return list.filter((data: any) => {
        const { title }: any = data || {}
        const item = { title }
        return Object.keys(item).some(key => {
          return String(data[key]).indexOf(search) > -1
        })
      })
    }
    return list
  }

  get isAddBtnShow() {
    const { currentNode } = this
    if (currentNode && Object.keys(currentNode).length > 0 && currentNode.level !== 1) {
      return true
    } else {
      return false
    }
  }
  /** methods */
  private mounted() {
    this.treeList = [{ id: 0, title: '目录表' }]
  }
  private toggle() {
    // 左侧机构侧滑
    this.isActive = !this.isActive
  }

  private handleCurrentChange(val: any) {
    this.page = val
  }

  // 懒加载
  private loadNode(node: any, resolve:any) {
    this.currentNode = node
    const row = node.data || {}
    const str = node.level.toString()
    if (str === '0') {
      // resolve([])
      return
    }
    const { countryId, countryName, type } = this.searchForm
    if (type === 1 && (!countryId || !countryName)) {
      this.$message.error('请先选择国家')
      resolve([])
      return
    }
    this.loading = true
    getProductList({
      parentId: row.id,
      countryId,
      countryName,
      type
    })
      .then((res: any) => {
        const data = res.data || []
        const arrNone = data.map((it: any) => {
          if (str === '2') {
            it.leaf = true
          }
          return it
        })
        this.list = arrNone
        this.loading = false
        resolve(arrNone)
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

  private refreshNode(node: any) {
    node.loaded = false
    node.expand(node)
  }

  private onTreeClick(item: any, node: any, ref: any) {
    if (node.isLeaf) {
      return
    }
    // if (node.loaded) {
    //   return
    // }
    this.search = ''
    this.refreshNode(ref.node)
  }

  private deteleRow(row: any) {
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        const params = {
          id: row.id,
          deleted: 1
        }
        saveProduct(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.refreshNode(this.currentNode)
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }

  private addType() {
    const { countryId, countryName, type } = this.searchForm
    if (type === 1 && (!countryId || !countryName)) {
      this.$message.error('请先选择国家')
      return
    }
    const { data } = this.currentNode
    if (Array.isArray(data)) {
      this.currentNode.data = data[0]
    }
    this.isDialogFormShow = true
    this.isEdit = false
  }
  // 编辑
  private editRow(row: any): void {
    this.isDialogFormShow = true
    this.isEdit = true
    this.form = {
      ...row
    }
  }

  private cancel(): void {
    this.isDialogFormShow = false
    this.reset()
  }
  private reset(): void {
    this.form = {
      checked: undefined,
      title: undefined,
      remarks: undefined
    }
    this.clearValidate()
  }
  private clearValidate() {
    this.$nextTick(() => {
      const editForm: any = this.$refs.editForm
      editForm.clearValidate()
    })
  }

  // 保存表单
  private saveCustoms(): void {
    (this.$refs.editForm as any).validate((valid: any) => {
      if (valid) {
        this.dialogLoading = true
        const params = {
          ...this.form,
          ...this.searchForm
        }
        const { data } = this.currentNode
        if (!this.isEdit) {
          params.parentId = data.id
          params.createUser = (this as any).userId
        }
        saveProduct(params)
          .then(res => {
            this.dialogLoading = false
            this.cancel()
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.refreshNode(this.currentNode)
          })
          .catch(err => {
            this.dialogLoading = false
            return err
          })
      } else {
        return false
      }
    })
  }

  private onType() {
    this.treeList = [{ id: 0, title: '目录表' }]
    this.list = []
    if (this.searchForm.type === 1) {
      this.searchForm.countryId = this.countryList[0].id
      this.searchForm.countryName = this.countryList[0].name
    } else {
      this.searchForm.countryId = undefined
      this.searchForm.countryName = undefined
    }
  }
  private onCountry() {
    this.searchForm.countryName = ''
    this.countryList.map((it: any) => {
      if (this.searchForm.countryId === it.id) {
        this.searchForm.countryName = it.name
      }
    })
    this.treeList = [{ id: 0, title: '目录表' }]
    this.list = []
  }

  private async getCountryList() {
    try {
      const res = await getCountryList()
      const data = res.data || {}
      const result = data.result || []
      this.countryList = result.map((it: any) => {
        const { name, alias } = it
        return {
          ...it,
          label: name + '-' + alias
        }
      })
    } catch (err) {
      this.formLoading = false
      return err
    }
  }
  private async getCostList(val: any) {
    try {
      const res = await getCost({
        categoryId: val
      })
      const data = res.data || []
      if (data.length > 0) {
        this.selectForm.sections = []
        data.map((it: any) => {
          const { categoryId, countryId, countryName, price, unitId, unitName, id } = it
          this.selectForm.sections.push({
            categoryId, countryId, countryName, price, unitId, unitName, id
          })
        })
      } else {
        this.selectForm.sections = [{
          countryId: undefined,
          price: undefined
        }]
      }
    } catch (err) {
      this.formLoading = false
      return err
    }
  }

  // 设置附加费
  private async setCost(row: any) {
    this.selectForm.billingUnit = row.billingUnit || 1
    const res = await getCost({ categoryId: row.id })
    const data = res.data || []
    const type = (this as any).custType
    if (data.length > 0) {
      this.selectForm.sections = []
      data.map((it: any) => {
        const { categoryId, countryId, countryName, price, unitId, unitName, id } = it
        this.selectForm.sections.push({
          categoryId, countryId, countryName, price, unitId, unitName, id
        })
      })
    } else if (type === '0') {
      this.selectForm.sections = [{
        countryId: undefined,
        price: undefined
      }]
    } else {
      this.$message.error('暂无上级配置，无法添加')
      return
    }
    this.isSetVisible = true
    this.formLoading = true
    this.selectForm.id = row.id
    await this.getCountryList()
    this.formLoading = false
  }
  private addRangeData() {
    this.selectForm.sections.push({
      countryId: undefined,
      price: undefined
    })
  }
  private deleteRangeData(index: number) {
    this.selectForm.sections.splice(index, 1)
  }

  // 关闭dialog重置表单
  private close() {
    this.isSetVisible = false
    this.selectForm = {
      billingUnit: 1,
      sections: [{
        countryId: undefined,
        price: undefined
      }]
    }
    this.$nextTick(() => {
      const editForm: any = this.$refs.costForm
      editForm.clearValidate()
    })
  }

  private onBillUnit() {
    if (this.selectForm.billingUnit === 4) {
      this.selectForm.sections = [{
        countryId: undefined,
        price: undefined
      }]
    }
  }
  // 提交保存
  private saveCost() {
    const editForm: any = this.$refs.costForm
    editForm.validate((valid: any) => {
      if (!valid) {
        return false
      }
      const { sections, id, billingUnit } = this.selectForm
      const isValue = Array.isArray(sections) && sections.every((it: any) => it.countryId && it.price)
      if (!isValue && billingUnit !== 4) {
        this.$message.error('请填写完整国家和单价')
        return
      }
      const arrS = sections.reduce((list: any[], next: any) => {
        if (!list.find((e: any) => e.countryId === next.countryId)) {
          list.push(next)
        }
        return list
      }, [])
      if (arrS.length < sections.length) {
        this.$message.error('国家不能重复')
        return
      }
      const arr = sections.map((it: any) => {
        const item = this.countryList.find((c: any) => c.id === it.countryId) || {}
        return {
          ...it,
          countryName: item.name,
          categoryId: id,
          unitId: 'RMB',
          unitName: '人民币'
        }
      })
      this.formLoading = true
      const params: any = {
        id,
        billingUnit,
        list: arr
      }
      const { data } = this.currentNode
      if (!this.isEdit) {
        params.parentId = data.id
        params.createUser = (this as any).userId
      }
      saveCost(params)
        .then((res: any) => {
          this.formLoading = false
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.close()
          this.refreshNode(this.currentNode)
        })
        .catch((err: any) => {
          this.formLoading = false
          return err
        })
    })
  }
}
</script>

<style lang="scss" scoped>
.item-after-icon {
  position: relative;
  padding-bottom: 15px;
  .item-icon-plus {
    position: absolute;
    top: 6px;
    color:#409eff;
    font-size:18px;
    margin-left:10px;
    cursor:pointer;
  }
  .item-icon-reduce {
    position: absolute;
    top: 6px;
    color:#f56c6c;
    font-size:18px;
    margin-left:10px;
    cursor:pointer;
  }
}
.input-number-valiate {
  width: 200px;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
</style>
