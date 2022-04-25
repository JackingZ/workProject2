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
            </el-select> -->
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
            </el-select>
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
            v-permission="['addGoodsType']"
            size="small"
            type="text"
            @click="addType"
          >
            新增
          </el-button>

          <el-input
            v-model="search"
            placeholder="类别名称"
            clearable
            size="small"
            style="width: 250px;margin-left: 20px;"
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
              label="操作"
              width="120"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['editGoodsType']"
                  type="text"
                  size="medium"
                  @click="editRow(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['deleteGoodsType']"
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getProductList,
  saveProduct,
  getCountryList
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
    type: 1,
    countryId: undefined,
    countryName: undefined
  }
  private currentNode: any = {}
  private form: any = {
    checked: undefined,
    title: undefined,
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
  private async created() {
    await this.getCountryList()
    if (this.countryList.length > 0) {
      this.searchForm.countryId = this.countryList[0].id
      this.searchForm.countryName = this.countryList[0].name
    }
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
    if (str === '0') return
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
        this.list = data
        this.loading = false
        resolve(data)
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
      title: undefined
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
      return err
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
