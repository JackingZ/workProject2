<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="岗位设置"
        />
        <div class="app-panel">
          <el-row>
            <el-col :span="4">
              <el-button
                v-permission="['postsettingAdd']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-left: 10px"
                @click="addRow"
              >
                新增岗位
              </el-button>
            </el-col>
            <el-col
              :span="20"
              style="text-align:right;"
            >
              <el-select
                v-model="selectValue.type"
                size="small"
                clearable
                style="width:120px;margin-right:5px;"
                placeholder="公司类型"
              >
                <el-option
                  label="聚货通"
                  value="0"
                />
                <el-option
                  label="客户"
                  value="1"
                />
                <el-option
                  label="代理商"
                  value="2"
                />
                <el-option
                  label="供应商"
                  value="3"
                />
              </el-select>
              <el-input
                v-model="selectValue.name"
                size="small"
                clearable
                style="width:300px;margin-right:10px;"
                placeholder="请输入"
              >
                <template slot="prepend">
                  岗位名称
                </template>
              </el-input>
              <el-button
                v-permission="['postsettingQuery']"
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
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              prop="name"
              label="岗位名称"
            />
            <el-table-column
              prop=""
              label="岗位类型"
              width="150"
            >
              <template slot-scope="scope">
                {{ postFilter(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="公司类型"
              min-width="120"
            >
              <template slot-scope="scope">
                {{ typeFilter(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="subtypeName"
              label="服务大类"
              min-width="150"
              show-overflow-tooltip
            />
            <el-table-column
              prop="createTime"
              label="添加时间"
              width="180"
            />
            <el-table-column
              label="操作"
              width="120"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['postsettingUpdate']"
                  type="text"
                  size="medium"
                  @click="editRow(scope.row)"
                >
                  编辑
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
            :title="isEdit ? '编辑岗位' : '新增岗位'"
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
                  prop="name"
                  label="岗位名称"
                >
                  <el-input
                    v-model="form.name"
                    autocomplete="off"
                    style="width: 100%"
                    :maxlength="20"
                  />
                </el-form-item>
                <el-form-item
                  prop="type"
                  label="企业类型"
                >
                  <el-select
                    v-model="form.type"
                    size="small"
                    clearable
                    filterable
                    multiple
                    collapse-tags
                    style="width:100%;"
                    placeholder="请选择"
                    @change="onType"
                  >
                    <el-option
                      label="聚货通"
                      value="0"
                    />
                    <el-option
                      label="客户"
                      value="1"
                    />
                    <el-option
                      label="代理商"
                      value="2"
                    />
                    <el-option
                      label="供应商"
                      value="3"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  prop="subtypeId"
                  label="服务大类"
                >
                  <el-select
                    v-model="form.subtypeId"
                    :loading="selectLoading"
                    :disabled="!form.type"
                    size="small"
                    clearable
                    filterable
                    multiple
                    collapse-tags
                    style="width:100%;"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in subtypeList"
                      :key="index"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  prop="postType"
                  label="岗位类别"
                >
                  <el-select
                    v-model="form.postType"
                    :loading="selectLoading"
                    size="small"
                    clearable
                    filterable
                    style="width:100%;"
                    placeholder="请选择"
                    @focus="getWorkList"
                  >
                    <el-option
                      v-for="(item, index) in workList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form>
              <div
                slot="footer"
                style="text-align: right;padding: 10px 0 20px;"
              >
                <el-button
                  @click="cancel"
                >
                  取 消
                </el-button>
                <el-button
                  type="primary"
                  @click="confirm"
                >
                  确 定
                </el-button>
              </div>
            </div>
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
  getPostList,
  addPost,
  editPost,
  getServiceTypeList,
  getWordsList
} from '@/api/operation-of-job-setup'

@Component({
  name: 'Port',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private dialogLoading: boolean = false
  private isDialogFormShow: boolean = false
  private selectLoading: boolean = false
  private isEdit: boolean = false
  private tableData: any[] = []
  private selectValue: any = {
    type: '',
    name: ''
  }
  private form: any = {
    name: undefined,
    type: [],
    subtypeId: [],
    subtypeName: undefined,
    postType: undefined
  }
  private formRules = {
    name: [
      { required: true, message: '岗位名称不能为空', trigger: 'blur' }
    ],
    type: { required: true, message: '请选择企业类型', trigger: 'change' },
    subtypeId: { required: true, message: '请选择服务大类', trigger: 'change' },
    postType: { required: false, message: '请选择岗位类型', trigger: 'change' }
  }
  private subtypeList: any[] = []
  private workList: any[] = []
  private page: number = 1
  private size: number = 10
  private total: any = 0

  /* computed */

  get labelPosition() {
    const lang = AppModule.language
    if (!lang) {
      return 'left'
    }
    return lang === 'en' ? 'top' : 'left'
  }

  get lang() {
    const lang = AppModule.language
    if (!lang) {
      return 'en'
    }
    return lang
  }

  /* methods */

  // 类型名称
  private typeFilter(row: any): any {
    const brr: any[] = []
    const arr = (row.type || '').split(',')
    arr.map((it: any) => {
      if (it === '0') {
        brr.push('聚货通')
      }
      if (it === '1') {
        brr.push('客户')
      }
      if (it === '2') {
        brr.push('代理商')
      }
      if (it === '3') {
        brr.push('供应商')
      }
    })
    return brr.join(',')
  }
  private postFilter(row: any): any {
    let name
    this.workList.map((it: any) => {
      if (row.postType === it.value) {
        name = it.label
      }
    })
    return name
  }

  private queryAll(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const params: any = {
      type: this.selectValue.type,
      name: this.selectValue.name,
      page: this.page,
      size: this.size
    }
    getPostList(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        this.tableData = (data.result || []).map((it: any) => {
          it.postType = it.postType + ''
          return it
        })
        this.total = data.total
      })
      .catch((err: any) => {
        this.loading = false
        return err
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

  private onType() {
    this.form.subtypeId = []
    this.subtypeList = []
    this.getSubtypeList()
  }
  private getSubtypeList() {
    this.selectLoading = true
    const str = (this.form.type || []).join(',')
    const params = {
      custType: str
    }
    getServiceTypeList(params).then((res:any) => {
      this.subtypeList = res.data || []
      this.selectLoading = false
    }).catch((err:any) => {
      this.selectLoading = false
      return err
    })
  }
  private getWorkList() {
    this.selectLoading = true
    getWordsList({
      type: 'POST_TYPE1'
    }).then((res:any) => {
      const data = res.data || []
      this.workList = data
      this.selectLoading = false
    }).catch((err:any) => {
      this.selectLoading = false
      return err
    })
  }
  // 新增
  private addRow(): void {
    this.isDialogFormShow = true
    this.isEdit = false
  }
  // 编辑
  private editRow(row: any): void {
    this.isDialogFormShow = true
    this.isEdit = true
    const { type, subtypeId, ...obj } = row
    this.form = {
      ...obj,
      type: (type || '').split(','),
      subtypeId: (subtypeId || '').split(',')
    }
    this.getSubtypeList()
    this.getWorkList()
  }
  private confirm(): void {
    (this.$refs.editForm as any).validate((valid: any) => {
      if (!valid) return false
      this.dialogLoading = true
      const { type, subtypeId, subtypeName, createTime, ...obj } = this.form
      const params: any = {
        ...obj,
        type: (type || []).join(','),
        subtypeId: (subtypeId || []).join(',')
      }
      const arr: any[] = []
      subtypeId.map((s: any) => {
        const item = this.subtypeList.find((it: any) => s === it.id) || {}
        if (item.id && item.name) {
          arr.push(item.name)
        }
      })
      params.subtypeName = arr.join(',')
      if (this.isEdit) {
        editPost(params)
          .then((res: any) => {
            this.dialogLoading = false
            this.cancel()
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.queryAll()
          })
          .catch((err: any) => {
            this.dialogLoading = false
            return err
          })
      } else {
        addPost(params)
          .then((res: any) => {
            this.dialogLoading = false
            this.cancel()
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            this.queryAll()
          })
          .catch((err: any) => {
            this.dialogLoading = false
            return err
          })
      }
    })
  }
  private cancel(): void {
    this.isDialogFormShow = false
    this.reset()
  }
  private reset(): void {
    this.form = {
      name: undefined,
      type: [],
      subtypeId: [],
      subtypeName: undefined,
      postType: undefined
    }
    this.clearValidate()
  }
  private clearValidate() {
    this.$nextTick(() => {
      const editForm: any = this.$refs.editForm
      editForm.clearValidate()
    })
  }

  private created(): void {
    this.getWorkList()
    this.queryAll()
  }
}
</script>

<style lang="scss" scoped>
</style>
