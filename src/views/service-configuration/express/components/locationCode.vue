<template>
  <!-- <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          :title="title"
        /> -->

  <div class="app-panel">
    <el-row>
      <el-col :span="3">
        <el-button
          type="text"
          icon="el-icon-circle-plus-outline"
          style="margin-left: 10px"
          @click="addServerCode"
        >
          新增代码
        </el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="tableData"
      height="calc(100vh - 350px)"
      style="width: 100%;margin: 10px 0;"
      border
    >
      <el-table-column
        v-if="type === 'start'"
        min-width="100"
        prop="code"
        label="起运地代码"
      />
      <el-table-column
        v-if="type === 'end'"
        min-width="100"
        prop="code"
        label="目的地代码"
      />
      <el-table-column
        v-if="type === 'start'"
        label="起运地代码邮编"
        min-width="110"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="setPostStartRange(scope.row)"
          >
            设置邮编范围
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        v-if="type === 'start'"
        label="目的地代码邮编"
        min-width="110"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="setPostEndRange(scope.row)"
          >
            设置邮编范围
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        min-width="120"
        label="添加时间"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="160"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="editForm(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            @click="deletData(scope.row)"
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
    <!-- 编辑起运地目的地 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="isAddEditVisible"
      :close-on-click-modal="false"
      width="550px"
      @closed="cancel"
    >
      <div class="add-edit-organ">
        <el-form
          ref="editForm"
          :model="selectForm"
          :rules="formRules"
          label-width="110px"
          label-position="right"
        >
          <el-form-item
            :label="type==='start'?'起运地代码':'目的地代码'"
            prop="code"
          >
            <el-input
              v-model="selectForm.code"
              :maxlength="20"
              clearable
              size="small"
              style="width:90%;"
              placeholder="请输入"
            />
          </el-form-item>
        </el-form>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
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
    </el-dialog>

    <!-- 编辑邮编范围 -->
    <el-dialog
      :title="dialogPostTitle"
      :visible.sync="isPostVisible"
      :close-on-click-modal="false"
      width="850px"
    >
      <post
        ref="post"
        :target-id="targetId"
        :type="postType"
        :is-copy-visible="isCopyVisible"
        :esc-id="escId"
        @statChange="handleStateChange"
        @handleCopy="handleCopy"
      />
    </el-dialog>
    <!-- 新增/编辑范围 -->
    <el-dialog
      :title="dialogPostEditTitle"
      :visible.sync="isPostEditVisible"
      :close-on-click-modal="false"
      width="550px"
      @closed="cancelPostEdit"
    >
      <div class="add-edit-organ">
        {{ selectPostForm.tagetId }}
        <el-form
          ref="editPostForm"
          :model="selectPostForm"
          :rules="formPostRules"
          label-width="100px"
          label-position="right"
        >
          <el-form-item
            v-if="postType === 'end'"
            label="目的地代码"
            prop="zonedId"
          >
            <el-select
              v-model="selectPostForm.zonedId"
              :loading="isTargetLoading"
              size="small"
              filterable
              clearable
              style="width:90%;"
            >
              <el-option
                v-for="(item,i) in targetCodeList"
                :key="i+item.code"
                :label="item.code"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="起始邮编"
            prop="postalS"
          >
            <el-input
              v-model="selectPostForm.postalS"
              :maxlength="10"
              show-word-limit
              clearable
              size="small"
              style="width:90%;"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="结束邮编"
            prop="postalE"
          >
            <el-input
              v-model="selectPostForm.postalE"
              :maxlength="10"
              show-word-limit
              clearable
              size="small"
              style="width:90%;"
              placeholder="请输入"
            />
          </el-form-item>
        </el-form>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="cancelPostEdit">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="savePostConfirm"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
    <!-- 复制邮编编码 -->
    <el-dialog
      title="复制邮编编码（起运地代码）"
      :visible.sync="isCopyVisible"
      :close-on-click-modal="false"
      width="550px"
      @closed="cancelCopy"
    >
      <div class="add-edit-organ">
        <el-form
          ref="editCopyForm"
          :model="selectCopyForm"
          :rules="formCopyRules"
          label-width="120px"
          label-position="right"
        >
          <el-form-item
            label="目的地代码"
            prop="sourceZonedId"
          >
            <el-select
              v-model="selectCopyForm.sourceZonedId"
              :loading="isTargetLoading"
              size="small"
              filterable
              style="width:90%;"
            >
              <el-option
                v-for="(ele,index) in targetCodeList"
                :key="index"
                :label="ele.code"
                :value="ele.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="选择复制对象"
            prop="escId"
          >
            <el-select
              v-model="selectCopyForm.escId"
              :loading="isServiceLoading"
              size="small"
              filterable
              clearable
              style="width:90%;"
              placeholder="服务编码"
              @focus="getEscList"
              @change="handleCodeChange"
            >
              <el-option
                v-for="item in codeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label=""
            prop="zonesId"
          >
            <el-select
              v-model="selectCopyForm.zonesId"
              ::loading="isStartLoading"
              size="small"
              filterable
              clearable
              style="width:90%;"
              placeholder="起运地代码"
              @focus="getStartCodeList"
            >
              <el-option
                v-for="(ele,index) in startCodeList"
                :key="index"
                :label="ele.code"
                :value="ele.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label=""
            prop="targetZonedId"
          >
            <el-select
              v-model="selectCopyForm.targetZonedId"
              :loading="isTargetLoading"
              size="small"
              filterable
              clearable
              placeholder="目的地代码"
              style="width:90%;"
              @focus="getTargetCodeList(2)"
            >
              <el-option
                v-for="(ele,index) in targetCodeList"
                :key="index"
                :label="ele.code"
                :value="ele.code"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="cancelCopy">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="saveCopyConfirm"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
  <!-- </div>
    </div>
  </div> -->
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getExpressStartLocationList,
  addEditExpressStartCode,
  deleteExpressStartCode,
  getExpressEndLocationList,
  addEditExpressEndCode,
  deleteExpressEndCode,
  addEditStartPost,
  addEditEndPost,
  getEscList,
  CopyTargetCode
} from '@/api/service-with-express-service'
import post from '@/views/service-configuration/express/components/post.vue'
function formParam() {
  return {
    id: undefined, // 起运地编码
    code: undefined // 起运地名称
  }
}

function formPostParam() {
  return {
    id: undefined, // 邮编id
    zonedId: undefined, // 目的地编码
    postalE: undefined, // 结束邮编
    postalS: undefined // 起始邮编
  }
}

function lengthValidate(rule: any, value: any, callback: (val?: any) => void) {
  if (value.length > 10) {
    callback(new Error('长度必须小于或等于10'))
  } else {
    callback()
  }
}
function length50Validate(rule: any, value: any, callback: (val?: any) => void) {
  if (value.length > 50) {
    callback(new Error('长度必须小于或等于50'))
  } else {
    callback()
  }
}

@Component({
  name: 'Location',
  components: {
    post
  },
  props: {
    type: {
      type: String,
      default: null
    }
  }
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private isAddEditVisible: boolean = false
  private isPostVisible: boolean = false
  private isPostEditVisible:boolean = false
  private targetId:string = ''// 起运地id
  private dialogLoading: boolean = false
  private isCopyVisible: boolean = false
  private isEdit: boolean = false
  private isSourceLoading: boolean = false
  private isServiceLoading: boolean = false
  private isStartLoading: boolean = false
  private isTargetLoading: boolean = false
  private tableData: any = []
  private codeList:any[] = []
  private targetCodeList:any[] = []
  private startCodeList:any[] = []
  private selectForm = formParam()
  private selectPostForm = formPostParam()
  private page: number = 1
  private size: number = 10
  private total: any = 0
  private selectCopyForm:any = {
    escId: '', // 快递服务编码
    sourceZonedId: '', // 来源目的地编码ID
    targetZonedId: '', // 目标目的地编码ID
    zonesId: '' // 起运地编码ID
  }
  private formRules = {
    // id: [{ required: true, message: '服务编码不能为空', trigger: 'blur' }], // 起运地代码di
    code: [
      { required: true, message: '代码不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (!value) {
            callback(new Error('代码不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('代码不能是中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]// 起运地名称
  }
  private formPostRules = {
    zonedId: [
      { required: true, message: '目的的代码不能为空', trigger: 'change' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (!value) {
            callback(new Error('目的的代码不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('目的的代码不能是中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ], // 邮编id
    postalE: [
      { required: true, message: '结束邮编不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (!value) {
            callback(new Error('结束邮编不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('结束邮编不能是中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ], // 结束邮编
    postalS: [
      { required: true, message: '起始邮编不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (!value) {
            callback(new Error('起始邮编不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('起始邮编不能是中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]// 起始邮编
  }
  private formCopyRules = {
    sourceZonedId: [
      { required: true, message: '目的地代码不能为空', trigger: 'change' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (!value) {
            callback(new Error('目的的代码不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('目的的代码不能是中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    escId: [{ required: true, message: '快递服务编码不能为空', trigger: 'change' }],
    zonesId: [
      { required: true, message: '起运地代码不能为空', trigger: 'change' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (!value) {
            callback(new Error('起运地代码不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('起运地代码不能是中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    targetZonedId: [
      { required: true, message: '目的地代码不能为空', trigger: 'change' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (!value) {
            callback(new Error('目的的代码不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('目的的代码不能是中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }
  private currentId:string = ''
  private isPostEdit:boolean = false
  private postType:string = 'start'
  private escId:string ='' // 快递服务编码
  private localData:object={}

  /* computed */

  get title() {
    const { countryName, expressName, expressCode } = (this as any).localData
    if ((this as any).type === 'start') {
      return `起运地代码（${countryName} - ${expressName} - ${expressCode}）`
    } else {
      return `目的地代码（${countryName} - ${expressName} - ${expressCode}）`
    }
  }
  get dialogTitle() {
    if ((this as any).type === 'start') {
      return this.isEdit ? '编辑起运地代码' : '新增起运地代码'
    } else {
      return this.isEdit ? '编辑目的地代码' : '新增目的地代码'
    }
  }

  get dialogPostTitle() {
    if ((this as any).postType === 'start') {
      return '查看邮编范围（起运地代码）'
    } else {
      return '查看邮编范围（目的地代码）'
    }
  }

  get dialogPostEditTitle() {
    if ((this as any).postType === 'start') {
      return this.isPostEdit ? '编辑邮编编码（起运地代码）' : '新增邮编编码（起运地代码）'
    } else {
      return this.isPostEdit ? '编辑邮编编码（目的地代码）' : '新增邮编编码（目的地代码）'
    }
  }

  /* methods */
  private queryAll(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const params:any = {
      escId: this.escId,
      page: this.page,
      size: this.size
    }
    let doFunc = null
    if ((this as any).type === 'start') {
      doFunc = getExpressStartLocationList
    } else {
      doFunc = getExpressEndLocationList
    }

    doFunc(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        this.tableData = data.result || []
        this.total = data.total
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private saveConfirm():void {
    const editForm: any = this.$refs.editForm
    editForm.validate((valid: any) => {
      if (valid) {
        const { id } = (this as any).localData
        const params:any = {
          escId: id,
          ...this.selectForm
        }
        let doFunc = null
        if ((this as any).type === 'start') {
          doFunc = addEditExpressStartCode
        } else {
          doFunc = addEditExpressEndCode
        }
        doFunc(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.resetForm()
            this.queryAll()
            this.isAddEditVisible = false
          })
          .catch((err: any) => {
            return err
          })
      }
    })
  }
  // 取消复制
  private cancelCopy() {
    this.isCopyVisible = false
    this.resetCopyForm()
  }
  private resetCopyForm() {
    this.selectCopyForm = {
      escId: '', // 快递服务编码
      sourceZonedId: '', // 来源目的地编码ID
      targetZonedId: '', // 目标目的地编码ID
      zonesId: '' // 起运地编码ID
    }
    this.$nextTick(() => {
      const copyDom:any = this.$refs.editCopyForm
      copyDom.clearValidate()
    })
  }
  // 复制保存
  private saveCopyConfirm() {
    const editCopyForm:any = this.$refs.editCopyForm
    editCopyForm.validate((valid:any) => {
      if (valid) {
        const params = {
          sourceZonedId: this.selectCopyForm.sourceZonedId,
          targetZonedId: this.selectCopyForm.targetZonedId,
          zonesId: this.selectCopyForm.zonesId
        }
        CopyTargetCode(params).then(res => {
          this.$message.success('复制成功')
          this.isCopyVisible = false
          this.resetCopyForm()
        }).catch(err => {
          return err
        })
      } else {
        return false
      }
    })
  }
  //  查询快递服务编码
  private getEscList() {
    this.isServiceLoading = true
    const params:any = {
      page: 1,
      size: 99999
    }
    getEscList(params).then(res => {
      this.isServiceLoading = false
      this.codeList = res.data.result || []
    }).catch(err => {
      this.isServiceLoading = false
      return err
    })
  }
  //  查询目的地编码列表
  private getTargetCodeList(type:any) {
    if (type === 2 && !this.selectCopyForm.escId) return
    this.isTargetLoading = true
    const params:any = {
      page: 1,
      size: 9999,
      escId: type === 1 ? this.escId : this.selectCopyForm.escId
    }
    getExpressEndLocationList(params).then(res => {
      this.isTargetLoading = false
      this.targetCodeList = res.data.result || []
    }).catch(err => {
      this.isTargetLoading = false
      return err
    })
  }
  private getStartCodeList() {
    if (!this.selectCopyForm.escId) return false
    this.isServiceLoading = true
    const params:any = {
      page: 1,
      size: 99999,
      escId: this.selectCopyForm.escId
    }
    getExpressStartLocationList(params).then(res => {
      this.isServiceLoading = false
      this.startCodeList = res.data.result || []
    }).catch(err => {
      this.isServiceLoading = false
      return err
    })
  }
  private handleCodeChange() {
    this.startCodeList = []
    this.selectCopyForm.zonesId = ''
    this.targetCodeList = []
    this.selectCopyForm.targetZonedId = ''
  }
  private deletData(row: any) {
    let doFunc:any = null
    let params:any = null
    if ((this as any).type === 'start') {
      params = {
        zonesId: row.id
      }
      doFunc = deleteExpressStartCode
    } else {
      params = {
        zonedId: row.id
      }
      doFunc = deleteExpressEndCode
    }

    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        doFunc(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.queryAll()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }
  // 新增
  private addServerCode(): void {
    this.isEdit = false
    this.isAddEditVisible = true
  }

  private cancel() {
    this.resetForm()
    this.isAddEditVisible = false
  }
  // 重置表单
  private resetForm() {
    this.selectForm = formParam()
    this.clearValidate()
  }
  private clearValidate() {
    this.$nextTick(() => {
      const editDom:any = this.$refs.editForm
      editDom.clearValidate()
    })
  }
  // 编辑
  private editForm(row: any): void {
    this.currentId = row.id
    this.selectForm = { ...row }
    this.isEdit = true
    this.isAddEditVisible = true
  }

  private handleCopy(val:any) {
    this.isCopyVisible = true
    this.selectCopyForm.sourceZonedId = val
  }

  // 设置邮编范围
  private setPostStartRange(row: any): void {
    this.postType = 'start'
    this.targetId = row.code
    this.isPostVisible = true
    this.$nextTick(() => {
      const postDom:any = this.$refs.post
      postDom.queryAll(1)
    })
  }
  // 设置邮编范围
  private setPostEndRange(row: any): void {
    this.postType = 'end'
    this.targetId = row.code
    this.isPostVisible = true
    this.$nextTick(() => {
      const postDom:any = this.$refs.post
      postDom.queryAllDes()
    })
  }
  // 关闭dialog重置表单
  private close(): void {
    this.isAddEditVisible = false
    this.resetForm()
  }
  private handleSizeChange(size: number) {
    this.size = size
    this.queryAll()
  }
  private handleCurrentChange(page:number):void {
    this.page = page
    this.queryAll()
  }

  //  初始化
  private init(row:object) {
    this.escId = (row as any).id
    this.localData = row
    if (this.escId) {
      this.queryAll(1)
      this.getTargetCodeList(1)
    }
  }
  private created(): void {
    this.init(this.localData)
  }

  private handleStateChange(state:boolean, form:any, type:boolean) {
    this.isPostEdit = type
    // this.isPostVisible = !state
    this.isPostEditVisible = state
    if (state) {
      this.selectPostForm = { ...form }
    }
  }
  // 取消编辑post
  private cancelPostEdit() {
    this.resetPostForm()
    this.isPostEditVisible = false
  }
  // 重置表单
  private resetPostForm() {
    this.selectPostForm = formPostParam()
    this.clearPostValidate()
  }
  private clearPostValidate():void {
    this.$nextTick(() => {
      const editDom:any = this.$refs.editPostForm
      editDom.clearValidate()
    })
  }
  private savePostConfirm() {
    const editForm: any = this.$refs.editPostForm
    editForm.validate((valid: any) => {
      if (valid) {
        const params:any = this.selectPostForm

        let doFunc = null
        if ((this as any).postType === 'start') {
          doFunc = addEditStartPost
        } else {
          doFunc = addEditEndPost
        }
        doFunc(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.resetPostForm()
            this.isPostEditVisible = false
            this.isPostVisible = true
            const postDom:any = this.$refs.post
            postDom.queryAll()
          })
          .catch((err: any) => {
            return err
          })
      }
    })
  }
}
</script>
