<template>
  <div
    v-loading="sideLoading"
    style="display: flex;flex-flow: row nowrap;min-height: inherit;"
  >
    <app-slide
      width="350"
      :is-active="isActive"
    >
      <div class="tree-title">
        <el-row>
          <el-col :span="10">
            行政区域
          </el-col>
          <el-col :span="14">
            <el-input
              v-model="filterText"
              size="small"
              placeholder="关键字"
            >
              <el-button
                slot="append"
                size="small"
                icon="el-icon-search"
                @click="areaFilter"
              />
            </el-input>
          </el-col>
        </el-row>
      </div>
      <el-tree
        ref="treeList"
        node-key="id"
        :data="treeList"
        :props="treeProps"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :default-expanded-keys="[0]"
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
          title="地区管理"
          info="点击左侧的行政区域节点"
        />
        <div class="app-panel">
          <el-row>
            <el-col :span="18">
              <el-button
                v-permission="['countryStateAdd']"
                type="text"
                icon="el-icon-circle-plus-outline"
                :disabled="!isAddBtnShow"
                @click="add"
              >
                新增
              </el-button>

              <el-input
                v-model="search"
                placeholder="地区代码/地区名称/地区简称/英文名称"
                clearable
                size="small"
                style="width: 280px;margin-left: 30px;"
              />
            </el-col>
            <el-col
              :span="6"
              style="text-align: right;padding-right: 20px;"
            >
              <el-button
                type="text"
                :disabled="!isAddBtnShow"
                @click="addBatch"
              >
                批量新增
              </el-button>
            </el-col>
          </el-row>

          <el-table
            v-loading="loading"
            :data="tableData"
            height="calc(100vh - 295px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              label="地区代码"
              width="150"
            >
              <template slot-scope="scope">
                {{ scope.row.id }}
              </template>
            </el-table-column>

            <el-table-column
              label="地区名称"
              min-width="230"
            >
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>

            <el-table-column
              label="地区简称"
              min-width="180"
            >
              <template slot-scope="scope">
                {{ scope.row.abbr }}
              </template>
            </el-table-column>

            <el-table-column
              label="英文名称"
              min-width="230"
            >
              <template slot-scope="scope">
                {{ scope.row.alias }}
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
              width="150"
            >
              <template slot-scope="{row}">
                <el-button
                  v-permission="['countryStateUpdate']"
                  type="text"
                  size="medium"
                  @click="edit(row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['countryStateDel']"
                  type="text"
                  size="medium"
                  @click="del(row)"
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
      title="行政地区"
      :visible.sync="isDialogFormShow"
      :close-on-click-modal="false"
      width="600px"
      @closed="cancel"
    >
      <div v-loading="dialogLoading">
        <el-form
          ref="editForm"
          v-loading="dialogLoading"
          :model="form"
          :rules="formRules"
          label-width="100px"
          label-position="right"
          size="small"
          style="padding-right: 20px;"
        >
          <el-form-item
            prop="id"
            label="地区代码"
          >
            <el-input
              v-model="form.id"
              autocomplete="off"
              :disabled="isEdit"
              :maxlength="30"
              show-word-limit
            />
          </el-form-item>
          <el-form-item
            prop="name"
            label="地区名称"
          >
            <el-input
              v-model="form.name"
              autocomplete="off"
              :maxlength="50"
            />
          </el-form-item>
          <el-form-item
            prop="abbr"
            label="地区简称"
          >
            <el-input
              v-model="form.abbr"
              autocomplete="off"
              :maxlength="10"
            />
          </el-form-item>
          <el-form-item
            prop="alias"
            label="英文名称"
          >
            <el-input
              v-model="form.alias"
              autocomplete="off"
              :maxlength="50"
            />
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          style="text-align:right;padding: 10px 20px 0 0;"
        >
          <el-button @click="cancel">
            取 消
          </el-button>
          <el-button
            type="primary"
            @click="saveConfirm"
          >
            确 定
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="批量新增行政区域"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="1000px"
      @close="cancelBatch"
    >
      <div v-loading="dialogLoading">
        <div style="text-align: right;">
          <el-select
            v-model="batchForm.countryId"
            placeholder="国家"
            style="width:130px;margin-right:5px;"
            size="small"
            clearable
          >
            <el-option
              label="美国"
              value="US"
            />
            <el-option
              label="加拿大"
              value="CA"
            />
          </el-select>
          <el-input
            v-model="currentName"
            size="small"
            style="width: 200px;margin-right:5px;"
            readonly
          />
          <el-input
            v-model="batchForm.name"
            size="small"
            placeholder="请输入英文名称"
            style="width: 200px;margin-right:10px;"
            clearable
          />
          <el-button
            type="primary"
            size="small"
            @click="getBatchAreaName"
          >
            查询
          </el-button>
        </div>
        <el-table
          :data="batchData"
          height="500px"
          style="width: 100%;margin: 10px 0;"
          border
        >
          <el-table-column
            label="地区名称"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.name"
                placeholder="请输入"
                style="width:100%"
                size="small"
                clearable
              />
            </template>
          </el-table-column>
          <el-table-column
            label="地区简称"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.abbr"
                placeholder="请输入"
                style="width:100%"
                size="small"
                clearable
              />
            </template>
          </el-table-column>
          <el-table-column
            label="英文名称"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.alias"
                placeholder="请输入"
                style="width:100%"
                size="small"
                clearable
              />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="120"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="medium"
                @click="deleteBatch(scope.$index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div
          slot="footer"
          style="text-align: right;padding-top: 10px;"
        >
          <el-button @click="cancelBatch">
            取 消
          </el-button>
          <el-button
            type="primary"
            @click="confirmBatch"
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
  getCountryByParent,
  getStateByCountry,
  getCityByState,
  getCountyByCity,
  getArea,
  updateArea,
  addArea,
  deleteContainer,
  getStreet,
  getCityName,
  addBatchCity
} from '@/api/operation-of-area-management'

@Component({
  name: 'AreaConfig',
  components: {},
  props: {}
})
export default class extends Vue {
  private isEdit: boolean = false
  private isDialogFormShow: boolean = false
  private isActive: boolean = true
  private sideLoading: boolean = false
  private loading: boolean = false
  private dialogLoading: boolean = false
  private dialogVisible: boolean = false
  private list: any[] = []
  private treeList: any[] = []
  private batchData: any[] = []
  private size = 20
  private page = 1
  private search: any = ''
  private filterText: any = ''
  private batchForm: any = {
    name: undefined,
    countryId: undefined,
    level: undefined
  }
  // private total = 0
  private treeProps = {
    label: 'name',
    children: 'children',
    isLeaf: 'leaf'
  }
  private currentNode: any = {}
  private form: any = {
    id: '',
    name: '',
    abbr: '',
    alias: ''
  }
  private formRules = {
    id: [
      { required: true, message: '地区代码不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (!value) {
            callback(new Error('地区代码不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('地区代码不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    name: [
      { required: true, message: '地区名称不能为空', trigger: 'blur' }
    ],
    abbr: [
      { required: true, message: '地区简称不能为空', trigger: 'blur' }
    ],
    alias: [
      { required: true, message: '英文名称不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (!value) {
            callback(new Error('英文名称不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('英文名称不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }

  get tableData() {
    const { resultData, page, size } = this
    return resultData.slice((page - 1) * size, page * size)
  }

  get resultData() {
    const { search, list } = this
    if (search) {
      return list.filter((data: any) => {
        const { abbr, alias, id, name }: any = data || {}
        const item = { abbr, alias, id, name }
        return Object.keys(item).some(key => {
          return String(data[key]).indexOf(search) > -1
        })
      })
    }
    return list
  }

  get total() {
    const { resultData } = this
    return resultData.length
  }

  get isAddBtnShow() {
    const { currentNode } = this
    if (currentNode.data && currentNode.data.level !== 7) {
      return true
    } else {
      return false
    }
  }
  get currentName() {
    const { currentNode } = this
    return '添加到' + ((currentNode.data || {}).name || '') + '下级'
  }

  private toggle() {
    // 左侧机构侧滑
    this.isActive = !this.isActive
  }

  private handleCurrentChange(val: any) {
    this.page = val
  }

  private getCountryByParent(id: string | number) {
    return getCountryByParent(id)
      .then(res => {
        const data = res.data || {}
        const result = data.result || []
        return result
      })
      .catch(() => {
        return []
      })
  }

  private getStateByCountry(id: string | number) {
    return getStateByCountry(id)
      .then(res => {
        const data = res.data || {}
        const result = data.result || []
        return result
      })
      .catch(() => {
        return []
      })
  }

  private getCityByState(id: string | number) {
    return getCityByState(id)
      .then(res => {
        const data = res.data || {}
        const result = data.result || []
        return result
      })
      .catch(() => {
        return []
      })
  }

  private getCountyByCity(id: string | number) {
    return getCountyByCity(id)
      .then(res => {
        const data = res.data || {}
        const result = data.result || []
        return result
      })
      .catch(() => {
        return []
      })
  }

  private loadNode(node: any, resolve:any) {
    this.currentNode = node
    this.search = ''
    if (node.level === 0) return resolve([{ id: '0', name: '全球', level: '0' }])
    if (node.level === 1) {
      this.loading = true
      this.getCountryByParent(node.data.id)
        .then(res => {
          this.loading = false
          this.list = res
          resolve(res)
        })
        .catch(err => {
          this.loading = false
          return err
        })
    }
    if (node.level === 2) {
      this.loading = true
      this.getCountryByParent(node.data.id)
        .then(res => {
          this.loading = false
          this.list = res
          resolve(res)
        })
        .catch(err => {
          this.loading = false
          return err
        })
    }
    if (node.level === 3) {
      this.loading = true
      this.getStateByCountry(node.data.id)
        .then(res => {
          this.loading = false
          this.list = res
          resolve(res)
        })
        .catch(err => {
          this.loading = false
          return err
        })
    }
    if (node.level === 4) {
      this.loading = true
      this.getCityByState(node.data.id)
        .then(res => {
          this.loading = false
          this.list = res
          resolve(res)
        })
        .catch(err => {
          this.loading = false
          return err
        })
    }
    if (node.level === 5) {
      this.loading = true
      this.getCountyByCity(node.data.id)
        .then(res => {
          this.loading = false
          this.list = res
          const data = res
          resolve(data)
        })
        .catch(err => {
          this.loading = false
          return err
        })
    }
    if (node.level === 6) {
      const params = {
        page: 1,
        size: 999,
        countryId: node.data.countryId,
        cityId: node.data.id,
        stateId: node.data.stateId
      }
      getStreet(params)
        .then((res: any) => {
          this.loading = false
          if (res.success) {
            const data = res.data || {}
            const result = data.result || []
            this.list = result
            resolve(result.map((item: any) => ({ ...item, leaf: true })))
          }
        })
        .catch(_ => {
          this.loading = false
          resolve([])
        })
    }
  }
  private getArea() {
    this.sideLoading = true
    getArea({
      level: 0
    })
      .then((res: any) => {
        const data = res.data || {}
        this.treeList = data.result || []
        this.currentNode = {}
        this.list = []
        this.sideLoading = false
      }).catch((err: any) => {
        this.sideLoading = false
        return err
      })
  }
  private areaFilter() {
    const root: any = this.$refs.treeList
    root.filter(this.filterText)
  }
  private filterNode(value: any, data: any) {
    if (!value) return true
    return data.name.indexOf(value) !== -1
  }

  private selOrg(val: any) {
    this.$message.success(val)
  }

  private onTreeClick(item: any, node: any, ref: any) {
    this.search = ''
    this.list = item.children || []
    this.currentNode = ref.node
    // this.refreshNode(ref.node)
  }

  private add() {
    this.isDialogFormShow = true
    this.isEdit = false
  }
  private addBatch() {
    this.dialogVisible = true
    this.batchForm.level = (this.currentNode.data || {}).level
  }
  private getBatchAreaName() {
    if (!this.batchForm.countryId) {
      this.$message.error('国家不能为空')
      return
    }
    if (!this.batchForm.name) {
      this.$message.error('英文名称不能为空')
      return
    }
    this.dialogLoading = true
    getCityName({
      ...this.batchForm
    })
      .then((res: any) => {
        const arr = res.data || []
        this.batchData = arr.map((it: any) => {
          return {
            alias: it.name,
            name: it.name,
            abbr: it.name
          }
        })
        this.dialogLoading = false
      }).catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }
  private cancelBatch() {
    this.dialogVisible = false
    this.batchForm = {
      name: undefined,
      countryId: undefined,
      level: undefined
    }
    this.batchData = []
  }
  private deleteBatch(index: number) {
    this.batchData.splice(index, 1)
  }
  private confirmBatch() {
    const ifValue = this.batchData.every((it: any) => it && it.abbr && it.alias && it.name)
    if (!ifValue) {
      this.$message.error('暂无数据或数据不完整')
      return
    }
    this.dialogLoading = true
    const { id, level } = this.currentNode.data
    const params: any = {
      countryId: this.batchForm.countryId,
      level,
      parentId: id,
      list: this.batchData
    }
    addBatchCity(params)
      .then((res: any) => {
        this.dialogLoading = false
        this.$message.success('批量新增成功')
        this.cancelBatch()
        this.getArea()
      }).catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }

  private edit(row: any) {
    this.isEdit = true
    const { id, name, level, abbr, alias, countryId, parentId } = row
    const params = {
      id,
      name,
      level,
      abbr,
      alias,
      countryId,
      parentId
    }
    this.form = params
    this.isDialogFormShow = true
  }

  private updateArea(data: any) {
    this.dialogLoading = true
    const { currentNode } = this
    updateArea(data)
      .then(res => {
        this.dialogLoading = false
        this.cancel()
        this.getArea()
        // this.refreshNode(currentNode)
      })
      .catch(err => {
        this.dialogLoading = false
        return err
      })
  }

  private addArea() {
    this.dialogLoading = true
    const { currentNode, form } = this
    const { id: parentId, level } = currentNode.data
    const countryId = level === 2 ? currentNode.data.id : currentNode.data.countryId
    const json = {
      parentId,
      countryId,
      level: parseInt(level, 10) + 1
    }
    const params = {
      ...form,
      ...json
    }
    addArea(params)
      .then(res => {
        this.dialogLoading = false
        this.cancel()
        this.getArea()
        // this.refreshNode(currentNode)
      })
      .catch(err => {
        this.dialogLoading = false
        return err
      })
  }

  private async del(row: any) {
    const [cancel, confirm] = await this.$confirm(
      '删除将无法恢复，是否继续？',
      '温馨提示',
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
    const { id, level } = row
    this.deleteContainer(id, level)
  }

  private deleteContainer(id: any, level: any) {
    this.loading = true
    const { currentNode } = this
    deleteContainer(id, level)
      .then(res => {
        this.$message.success('删除成功')
        this.loading = false
        this.getArea()
        // this.refreshNode(currentNode)
      })
      .catch(err => {
        this.loading = false
        this.$message.error('删除失败')
        return err
      })
  }

  private refreshNode(node: any) {
    node.loaded = false
    node.expand()
  }

  // 提交保存
  private saveConfirm() {
    const editForm: any = this.$refs.editForm
    editForm.validate((valid: any) => {
      if (valid) {
        const { isEdit, form } = this
        if (isEdit) {
          this.updateArea(form)
        } else {
          this.addArea()
        }
      } else {
        return false
      }
    })
  }

  // 重置表单
  private resetForm() {
    this.form = {
      id: '',
      name: '',
      abbr: '',
      alias: ''
    }
  }

  private clearValidate() {
    this.$nextTick(() => {
      const editForm: any = this.$refs.editForm
      editForm.clearValidate()
    })
  }

  private cancel() {
    this.isDialogFormShow = false
    this.resetForm()
    this.clearValidate()
  }

  // private mounted() {
  //   const root: any = this.$refs.treeList
  //   this.currentNode = root.getNode(0)
  // }
  private created() {
    this.getArea()
  }
}
</script>

<style lang="scss" scoped>
</style>
