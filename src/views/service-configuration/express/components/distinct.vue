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
          新增国际分区
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
        min-width="100"
        prop="name"
        label="国际分区"
      />
      <el-table-column
        label="关联国家/地区"
        min-width="160"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="relateCountry(scope.row)"
          >
            关联国家
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        min-width="160"
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
    <!-- 新建保存地区 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="isAddEditVisible"
      :close-on-click-modal="false"
      width="550px"
    >
      <div class="add-edit-organ">
        <el-form
          ref="editForm"
          :model="selectForm"
          :rules="formRules"
          label-width="100px"
          label-position="right"
        >
          <!-- <el-row> -->
          <!-- <el-col
                    :span="12"
                    :offset="6"
                  > -->
          <el-form-item
            label="国际分区"
            prop="name"
          >
            <el-input
              v-model="selectForm.name"
              :maxlength="50"
              size="small"
              placeholder="请输入"
              style="width:90%"
            />
          </el-form-item>
          <!-- </el-col>
                </el-row> -->
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

    <!-- 关联国家 -->
    <el-dialog
      :title="relativeDialogTitle"
      :visible.sync="isRelateVisible"
      :close-on-click-modal="false"
      width="960px"
      @closed="cancelRelate"
    >
      <div v-loading="countryLoading">
        <el-transfer
          ref="transferItem"
          v-model="destinations"
          filterable
          :filter-method="filterMethod"
          :titles="['选择国家/地区', '已选择关联']"
          :props="{key: 'id', label: 'label'}"
          filter-placeholder="输入搜索"
          :data="allCountry"
          style="height: 500px;"
        />
        <div
          slot="footer"
          style="text-align: right;margin: 20px 40px 0;"
        >
          <el-button
            size="small"
            @click="cancelRelate"
          >
            取 消
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="saveRelateConfirm"
          >
            确 定
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
  <!-- </div>
    </div>
  </div> -->
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getExpressDistinctList,
  addEditExpressDistinctCode,
  deleteExpressDistinctCode,
  getExpressDistinctRelateList,
  addEditExpressDistinctRelateCode,
  getCountryList
} from '@/api/service-with-express-service'

function formParam() {
  return {
    id: undefined, // 起运地编码
    name: undefined // 起运地名称
  }
}
function lengthValidate(rule: any, value: any, callback: (val?: any) => void) {
  if (value.length > 50) {
    callback(new Error('长度必须小于或等于50'))
  } else {
    callback()
  }
}
@Component({
  name: 'Distinct',
  components: {},
  props: {
    type: {
      type: String,
      default: null
    }
  }
})
export default class extends Vue {
  // 属性
  // @Prop() private type!: string;
  /* data */
  private loading: boolean = false
  private isAddEditVisible: boolean = false
  private dialogLoading: boolean = false
  private countryLoading:boolean = false
  private isEdit: boolean = false
  private tableData: any = []
  private selectForm = formParam()
  private page: number = 1
  private size: number = 10
  private total: any = 0
  private formRules = {
    // id: [{ required: true, message: '服务编码不能为空', trigger: 'blur' }], // 起运地代码di
    name: [
      { required: true, message: '服务名称不能为空', trigger: 'blur' }
    ]// 起运地名称
  }
  private currentId:string = ''
  private isRelateVisible:boolean = false
  private selectRelateForm:any = {
    name: '',
    destinations: []
  }
  private allCountry:any = []
  private destinations:any = []
  private escId:string = ''
  private localData:object = {}

  /* computed */

  get title() {
    const { countryName, expressName, expressCode } = (this as any).localData

    return `国际分区（${countryName} - ${expressName} - ${expressCode}）`
  }
  get dialogTitle() {
    return this.isEdit ? '编辑国际分区' : '新增国际分区'
  }
  get relativeDialogTitle() {
    return `关联国家/地区【${this.selectRelateForm.name}】`
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
    getExpressDistinctList(params)
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

        addEditExpressDistinctCode(params)
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
  private deletData(row: any) {
    const params = {
      zoneId: row.id
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteExpressDistinctCode(params)
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
  // 关闭dialog重置表单
  private close(): void {
    this.isAddEditVisible = false
    this.resetForm()
  }
  private filterMethod(query: any, item: any): boolean {
    const name = item.name || ''
    return name.indexOf(query) > -1
  }
  //  初始化
  private init(row:object) {
    this.escId = (row as any).id
    this.localData = row
    if (this.escId) {
      this.queryAll(1)
      this.getAllCountry()
    }
  }
  private created(): void {
    this.init(this.localData)
  }
  private handleSizeChange(size: number) {
    this.size = size
    this.queryAll()
  }
  private handleCurrentChange(page:number):void {
    this.page = page
    this.queryAll()
  }
  private relateCountry(row:any) {
    this.selectRelateForm.name = row.name
    this.isRelateVisible = true
    this.currentId = row.id
    this.queryDestinations()
  }
  private cancelRelate() {
    this.isRelateVisible = false
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
  }
  private saveRelateConfirm():void {
    const destinations = this.allCountry.filter((ele:any) => {
      const flag = this.destinations.some((eleDes:any) => ele.id === eleDes)
      return flag
    }).map((ele:any) => {
      const temp = {
        countryId: ele.id,
        countryName: ele.name
      }
      return temp
    })
    const params:any = {
      zoneId: this.currentId,
      countries: destinations
    }
    addEditExpressDistinctRelateCode(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.queryAll()
        this.cancelRelate()
        // this.queryDestinations()
      })
      .catch((err: any) => {
        return err
      })
  }
  private getAllCountry() {
    getCountryList().then((res: any) => {
      this.allCountry = res.data.result.map((ele:any) => {
        ele.label = ele.name + '-' + (ele.alias)
        ele.key = ele.id
        ele.disabled = false
        return ele
      })
      this.countryLoading = false
    })
      .catch((err: any) => {
        this.countryLoading = false
        return err
      })
  }
  private queryDestinations(): void {
    this.countryLoading = true
    const params:any = {
      zoneId: this.currentId
    }
    getExpressDistinctRelateList(params)
      .then((res: any) => {
        this.countryLoading = false
        this.destinations = res.data.map((ele:any) => {
          return ele.countryId
        })
      })
      .catch((err: any) => {
        this.countryLoading = false
        return err
      })
  }
  // watch
  // @Watch('currentId')
  // private getCurrentId(newVal:string, oldVal:string) {
  //   this.queryDestinations()
  // }
}
</script>
<style lang="scss" scoped>
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
</style>
