<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <app-slide
      v-loading="isSideLoading"
      width="350"
      :is-active="isActive"
    >
      <div style="padding-bottom: 5px;border-bottom: 1px solid #e8e8e8;">
        <el-row>
          <el-col
            :span="8"
            style="line-height: 32px;"
          >
            海关编码
          </el-col>
          <el-col
            :span="16"
            style="text-align: right;"
          >
            <el-select
              v-model="searchForm.countryId"
              placeholder="所属国家"
              style="width:130px;"
              size="small"
              filterable
              @change="getAll"
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
          title="海关编码"
          info="点击左侧的海关编码目录节点"
        />
        <div class="app-panel">
          <el-button
            v-permission="['customsCodeAdd']"
            size="small"
            type="text"
            @click="addCustoms"
          >
            新增
          </el-button>
          <!-- <el-button
            type="text"
            size="small"
            icon="el-icon-circle-plus-outline"
            style="margin-left: 10px"
            @click="loadFile"
          >
            模板下载
          </el-button>
          <el-button
            type="text"
            size="small"
            icon="el-icon-circle-plus-outline"
            @click="inputFile"
          >
            批量导入
          </el-button> -->

          <el-input
            v-model="search"
            placeholder="编码/税号"
            clearable
            size="small"
            style="width: 250px;margin-left: 20px;"
          />

          <el-table
            v-loading="loading"
            :data="tableData"
            height="calc(100vh - 290px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              label="海关编码"
              min-width="150"
              prop="code"
              show-overflow-tooltip
            />

            <el-table-column
              label="编码描述"
              min-width="200"
              prop="descContent"
              show-overflow-tooltip
            />

            <el-table-column
              label="英文描述"
              min-width="200"
              prop="descAlias"
              show-overflow-tooltip
            />

            <el-table-column
              label="计税单位"
              width="100"
              prop="unit"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.unit === 0">按数量</span>
                <span v-else-if="scope.row.unit === 1">按金额</span>
              </template>
            </el-table-column>

            <el-table-column
              label="税率(%)(普通国家)"
              min-width="150"
              prop="ordinary"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="medium"
                  @click="rateCountry(scope.row, '1')"
                >
                  {{ scope.row.ordinary }}
                </el-button>
              </template>
            </el-table-column>

            <el-table-column
              label="税率(%)(特殊待遇国)"
              min-width="160"
              prop="special"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="medium"
                  @click="rateCountry(scope.row, '2')"
                >
                  {{ scope.row.special }}
                </el-button>
              </template>
            </el-table-column>

            <el-table-column
              label="税率(%)(贸易处罚国)"
              min-width="160"
              prop="trade"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="medium"
                  @click="rateCountry(scope.row, '3')"
                >
                  {{ scope.row.trade }}
                </el-button>
              </template>
            </el-table-column>

            <el-table-column
              label="附加税税号"
              min-width="150"
              prop="surtax"
              show-overflow-tooltip
            />

            <el-table-column
              label="启用状态"
              width="120"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-switch
                  :value="scope.row.status"
                  :disabled="!$checkPermission(['customsCodeUpdateStatus'])"
                  class="switchStyle"
                  active-text="启用"
                  inactive-text="禁用"
                  :active-value="0"
                  :inactive-value="1"
                  @input="value => switchChange(scope.row, value)"
                />
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
              width="120"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['customsCodeUpdate']"
                  type="text"
                  size="medium"
                  @click="editRow(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['customsCodeDel']"
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
      :title="isEdit ? '编辑海关编码' : '新增海关编码'"
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
          label-width="150px"
          label-position="right"
          size="small"
          style="padding-right: 20px;"
        >
          <el-form-item
            prop="code"
            label="海关编码"
          >
            <el-input
              v-model="form.code"
              autocomplete="off"
              style="width: 100%"
              :maxlength="20"
            />
          </el-form-item>
          <el-form-item
            prop="title"
            label="标题中文"
          >
            <el-input
              v-model="form.title"
              autocomplete="off"
              style="width: 100%"
              :maxlength="10"
            />
          </el-form-item>
          <el-form-item
            prop="titleAlias"
            label="标题英文"
          >
            <el-input
              v-model="form.titleAlias"
              autocomplete="off"
              style="width: 100%"
              :maxlength="20"
            />
          </el-form-item>
          <el-form-item
            prop="descContent"
            label="编码描述"
          >
            <el-input
              v-model="form.descContent"
              autocomplete="off"
              style="width: 100%"
              :maxlength="200"
            />
          </el-form-item>
          <el-form-item
            prop="descAlias"
            label="英文描述"
          >
            <el-input
              v-model="form.descAlias"
              autocomplete="off"
              style="width: 100%"
              :maxlength="200"
            />
          </el-form-item>
          <el-form-item
            prop="unit"
            label="计税单位"
          >
            <el-select
              v-model="form.unit"
              placeholder="请选择"
              style="width: 100%"
              filterable
            >
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="ordinary"
            label="税率(%)(普通国家)"
          >
            <el-input-number
              v-model="form.ordinary"
              class="input-number-valiate"
              :controls="false"
              placeholder="请输入"
              :min="0"
              :max="9999"
              :precision="2"
            />
          </el-form-item>
          <el-form-item
            prop="special"
            label="税率(%)(特殊待遇国)"
          >
            <el-input-number
              v-model="form.special"
              class="input-number-valiate"
              :controls="false"
              placeholder="请输入"
              :min="0"
              :max="9999"
              :precision="2"
            />
          </el-form-item>
          <el-form-item
            prop="trade"
            label="税率(%)(贸易处罚国)"
          >
            <el-input-number
              v-model="form.trade"
              class="input-number-valiate"
              :controls="false"
              placeholder="请输入"
              :min="0"
              :max="9999"
              :precision="2"
            />
          </el-form-item>
          <el-form-item
            prop="surtax"
            label="附加税税号"
          >
            <el-input
              v-model="form.surtax"
              autocomplete="off"
              :maxlength="20"
              style="width: 100%"
            />
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          style="text-align: right;padding: 10px 0 20px;"
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
      title="批量导入"
      width="600px"
      :visible.sync="dialogImport"
      :close-on-click-modal="false"
      @closed="close"
    >
      <div style="line-height: 40px;background-color: #ccc;padding-left: 20px;">
        为了保证批量导入的准确性，建议填写全部商品的OCR三门注册
      </div>
      <el-form
        ref="fileForm"
        v-loading="dialogLoading"
        :rules="fileRules"
        :model="fileForm"
        label-width="120px"
        size="small"
        style="padding-right: 20px;margin-top: 20px;"
      >
        <el-form-item
          prop="countryId"
          label="服务所在国家"
        >
          <el-select
            v-model="fileForm.countryId"
            placeholder="请选择"
            style="width:100%;"
            size="small"
            filterable
            @focus="getCountryList"
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
          prop="file"
          label="文件上传"
        >
          <el-upload
            ref="uploadFile"
            class="upload-demo"
            action
            multiple
            accept=".xlsx,.xls"
            :limit="1"
            :auto-upload="false"
            :http-request="uploadFile"
            :on-remove="onFileRemove"
            :file-list="fileList"
          >
            <el-button
              size="small"
            >
              <i class="el-icon-upload" />
              选择文件
            </el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="close">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="confirm"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="国家/地区"
      :visible.sync="countryShow"
      :close-on-click-modal="false"
      width="960px"
      append-to-body
      @close="closeCountry"
    >
      <div v-loading="countryLoading">
        <el-transfer
          ref="transferItem"
          v-model="countryIds"
          filterable
          :filter-method="filterMethod"
          :titles="['国家/地区', '已选择']"
          :props="{key: 'id', label: 'label'}"
          filter-placeholder="输入搜索"
          :data="countryList"
          style="height: 500px;"
        />
        <div
          slot="footer"
          style="text-align: right;margin: 0 40px 0;"
        >
          <el-button
            size="small"
            @click="closeCountry"
          >
            取 消
          </el-button>

          <el-button
            type="primary"
            size="small"
            @click="saveCountry"
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
  getCountryList,
  getCustomsList,
  setRateCountry,
  getRateCountry,
  changeStatus,
  saveCustoms,
  setBulkImport,
  deteleCustoms
} from '@/api/operation-of-customs-code'

function paramsForm() {
  return {
    code: undefined,
    id: undefined,
    parentId: undefined,
    status: undefined,
    descAlias: undefined,
    descContent: undefined,
    title: undefined,
    titleAlias: undefined,
    surtax: undefined,
    trade: undefined,
    special: undefined,
    ordinary: undefined,
    countryId: undefined,
    countryName: undefined,
    level: undefined,
    unit: undefined,
    createUser: undefined
  }
}

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
  private dialogImport: boolean = false
  private selectLoading: boolean = false
  private countryShow: boolean = false
  private countryLoading: boolean = false
  private list: any[] = []
  private countryList: any[] = []
  private countryIds: any[] = []
  private countryObj: any = {}
  private fileList: any[] = []
  private treeList: any[] = []
  private size = 10
  private page = 1
  private searchForm: any = {
    countryId: undefined,
    countryName: undefined
  }
  private search = ''
  private treeProps = {
    label: 'name',
    children: 'children',
    isLeaf: 'leaf'
  }
  private currentNode: any = {}
  private form: any = paramsForm()
  private typeList: any[] = [
    { label: '按数量', value: 0 },
    { label: '按金额', value: 1 }
  ]
  private formRules = {
    unit: [{ required: true, message: '请选择计税单位' }],
    code: [
      { required: true, message: '海关编码不能为空', trigger: 'blur' },
      {
        validator: (rule: any, value: any, callback: (val?: any) => void) => {
          const reg = /[\u4e00-\u9fa5]/
          if (!value) {
            callback(new Error('海关编码不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('海关编码不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    title: [{ required: true, message: '标题中文不能为空', trigger: 'blur' }],
    titleAlias: [
      { required: true, message: '标题英文不能为空', trigger: 'blur' },
      {
        validator: (rule: any, value: any, callback: (val?: any) => void) => {
          const reg = /[\u4e00-\u9fa5]/
          if (!value) {
            callback(new Error('标题英文不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('标题英文不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    descContent: [{ required: true, message: '编码描述不能为空', trigger: 'blur' }],
    descAlias: [
      { required: true, message: '英文描述不能为空', trigger: 'blur' },
      {
        validator: (rule: any, value: any, callback: (val?: any) => void) => {
          const reg = /[\u4e00-\u9fa5]/
          if (!value) {
            callback(new Error('标题英文不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('标题英文不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    ordinary: [{ required: false, message: '普通国家税率不能为空', trigger: 'blur' }],
    special: [{ required: false, message: '特殊待遇国税率不能为空', trigger: 'blur' }],
    trade: [{ required: false, message: '贸易处罚国税率不能为空', trigger: 'blur' }],
    surtax: [
      { required: false, message: '附加税税号不能为空', trigger: 'blur' }
      // {
      //   validator(rule: any, value: any, callback: (val?: any) => void) {
      //     const reg = /^[a-zA-Z0-9]*$/
      //     if (!value) {
      //       callback(new Error('附加税税号不能为空'))
      //     } else if (!reg.test(value)) {
      //       callback(new Error('附加税税号只能是数字、字母'))
      //     } else {
      //       callback()
      //     }
      //   },
      //   trigger: 'blur'
      // }
    ]
  }
  private fileForm: any = {
    countryId: undefined,
    file: undefined
  }
  private fileRules = {
    countryId: [{ required: true, message: '请选择服务国家' }],
    file: [{ required: true, message: '文件不能为空', trigger: 'blur' }]
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
        const { code, surtax }: any = data || {}
        const item = { code, surtax }
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
    this.getAll()
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
  private toggle() {
    // 左侧机构侧滑
    this.isActive = !this.isActive
  }

  private handleCurrentChange(val: any) {
    this.page = val
  }

  private getAll() {
    this.countryList.map((it: any) => {
      if (this.searchForm.countryId === it.id) {
        this.searchForm.countryName = it.name
      }
    })
    this.list = []
    this.treeList = [{ id: 0, name: '目录表' }]
  }
  // 懒加载
  private loadNode(node: any, resolve:any) {
    this.currentNode = node
    const row = node.data || {}
    const str = node.level.toString()
    if (str === '0') return
    const { countryId, countryName } = this.searchForm
    if (!countryId || !countryName) {
      this.$message.error('请先选择国家')
      return
    }
    this.loading = true
    const params: any = {
      parentId: row.id,
      countryId,
      countryName
    }
    getCustomsList(params)
      .then((res: any) => {
        const data = res.data || []
        const arr = data.map((it: any) => {
          const {
            title,
            descContent,
            descAlias,
            titleAlias
          }: any = it
          return {
            ...it,
            name: title + ' ' + descContent,
            alias: titleAlias + ' ' + descAlias
          }
        })
        this.list = arr
        this.loading = false
        resolve(arr)
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

  private rateCountry(row: any, val: any) {
    this.countryShow = true
    this.countryLoading = true
    const { code, countryId, countryName, id, parentId } = row
    this.countryObj = {
      ...row,
      codeList: undefined,
      type: val
    }
    const params = {
      code, countryId, countryName, id, parentId, type: val
    }
    getRateCountry(params)
      .then((res: any) => {
        const data = res.data || []
        this.countryIds = data.map((it: any) => {
          return it.target
        })
        this.countryLoading = false
      })
      .catch((err: any) => {
        this.countryLoading = false
        return err
      })
  }
  private saveCountry() {
    this.countryLoading = true
    const params = {
      ...this.countryObj,
      codeList: this.countryIds
    }
    setRateCountry(params)
      .then((res: any) => {
        this.countryLoading = false
        this.countryShow = false
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.refreshNode(this.currentNode)
      })
      .catch((err: any) => {
        this.countryLoading = false
        return err
      })
  }
  private closeCountry() {
    this.countryShow = false
    this.countryIds = []
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
  }
  private filterMethod(query: any, item: any): boolean {
    const name = item.name || ''
    return name.indexOf(query) > -1
  }

  private async switchChange(row: any, value: any): Promise<void> {
    const olds = row.status.toString()
    const news = value.toString()
    if (!olds || olds === news) return
    const text = news === '1' ? '禁用' : '开启'
    const [cancel, confirm] = await this.$confirm(
      `此操作将${text}该海关编码，是否继续？`,
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
    const params = {
      id: row.id,
      status: value
    }
    changeStatus(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '更新成功'
        })
        this.refreshNode(this.currentNode)
      })
      .catch((err: any) => {
        return err
      })
  }
  private deteleRow(row: any) {
    const params = {
      id: row.id
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deteleCustoms(params)
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

  private addCustoms() {
    const { countryId, countryName } = this.searchForm
    if (!countryId || !countryName) {
      this.$message.error('请先选择国家')
      return
    }
    const { data } = this.currentNode
    if (Array.isArray(data)) {
      this.currentNode.data = data[0]
      this.form.level = 1
    } else {
      this.form.level = this.currentNode.level
    }
    this.isDialogFormShow = true
    this.isEdit = false
  }
  // 编辑
  private editRow(row: any): void {
    this.isDialogFormShow = true
    this.isEdit = true
    const { name, alias, ...obj } = row
    this.form = {
      ...obj
    }
  }

  private cancel(): void {
    this.isDialogFormShow = false
    this.reset()
  }
  private reset(): void {
    this.form = paramsForm()
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
        const { countryId, countryName } = this.searchForm
        const { data } = this.currentNode
        const params = {
          ...this.form,
          countryId,
          countryName
        }
        if (!this.isEdit) {
          params.parentId = data.id
          params.createUser = (this as any).userId
        }
        saveCustoms(params)
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

  // 导入
  private loadFile() {
    // zzz
  }
  private inputFile() {
    this.dialogImport = true
  }
  private close() {
    this.dialogImport = false
    this.fileForm = {
      countryId: undefined,
      file: undefined
    }
    this.$nextTick(() => {
      const fileForm: any = this.$refs.fileForm
      fileForm.clearValidate()
    })
  }
  private confirm() {
    const root: any = this.$refs.fileForm
    root.validate((valid: any) => {
      if (!valid) return false
      this.dialogLoading = true
      const form: FormData = new FormData()
      form.append('file', this.fileForm.file)
      form.append('countryId', this.fileForm.countryId)
      setBulkImport(form)
        .then((res: any) => {
          this.dialogLoading = false
          this.$message.success('导入成功')
          this.close()
        })
        .catch(err => {
          this.dialogLoading = false
          return err
        })
    })
  }

  private onFileRemove(file: any, fileList: any[]) {
    this.fileForm.file = ''
  }

  private uploadFile(params: any): void {
    const { file } = params
    this.fileForm.file = file
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
::v-deep .el-transfer-panel {
  width: 40%;
  height: 100%;
}
::v-deep .el-transfer {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}
::v-deep .el-transfer-panel__list.is-filterable {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
}
::v-deep .el-transfer-panel__body {
  height: 78%;
}
::v-deep .el-dialog__body {
  padding: 10px 20px;
}
</style>
