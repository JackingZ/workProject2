<template>
  <div>
    <el-row>
      <el-col :span="6">
        <el-button
          v-permission="['insideDomesticAdd']"
          type="text"
          icon="el-icon-circle-plus-outline"
          style="margin-left: 10px"
          @click="addArea"
        >
          新增国内区域
        </el-button>
      </el-col>
      <el-col
        :span="18"
        style="text-align:right;padding-right: 10px;"
      >
        <el-input
          v-model="searchForm.name"
          placeholder="区域名称"
          style="width:180px;margin-right: 10px;"
          size="small"
          clearable
        />
        <el-button
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
      height="calc(100vh - 350px)"
      style="width: 100%;margin: 10px 0;"
      border
    >
      <el-table-column
        label="区域名称"
        min-width="120"
        prop="name"
      />
      <el-table-column
        label="国家"
        min-width="150"
        prop="countryName"
      />
      <el-table-column
        label="区内省份"
        min-width="250"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ filterFunc(scope.row.states) }}
        </template>
      </el-table-column>

      <el-table-column
        label="添加时间"
        width="170"
        sortable
        prop="createTime"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="130"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['insideDomesticUpdate']"
            type="text"
            size="medium"
            @click="editForm(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-permission="['insideDomesticDel']"
            type="text"
            size="medium"
            @click="deleteData(scope.row)"
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

    <el-dialog
      title="区内省份"
      :visible.sync="isItemDialogShow"
      :close-on-click-modal="false"
      width="960px"
      @close="itemDialogClose"
    >
      <el-transfer
        ref="transferItem"
        v-model="form.area"
        filterable
        :filter-method="filterMethod"
        :titles="['省份', '已选择']"
        :props="{key: 'id', label: 'label'}"
        filter-placeholder="输入搜索"
        :data="stateList"
        style="height: 500px;"
      />
      <div
        slot="footer"
        style="text-align: right;margin: 0 40px 0;"
      >
        <el-button
          size="small"
          @click="itemDialogClose"
        >
          取 消
        </el-button>

        <el-button
          type="primary"
          size="small"
          @click="itemDialogClose"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="isEdit ? '编辑国内区域' : '新增国内区域'"
      :close-on-click-modal="false"
      width="600px"
      :visible.sync="dialogShow"
      @closed="cancel"
    >
      <el-form
        ref="editForm"
        v-loading="formLoading"
        :model="form"
        label-width="100px"
        style="padding-right: 20px;"
        size="small"
        :rules="formRules"
      >
        <el-form-item
          label="区域名称"
          prop="name"
        >
          <el-input
            v-model="form.name"
            show-word-limit
            placeholder="请输入"
            style="width: 100%;"
            :maxlength="50"
          />
        </el-form-item>
        <!-- <el-form-item
                label="区域类型"
                prop="type"
              >
                <el-select
                  v-model="form.type"
                  style="width:80%"
                  placeholder="请选择"
                >
                  <el-option
                    label="空运"
                    value="0"
                  />
                  <el-option
                    label="海运"
                    value="1"
                  />
                </el-select>
              </el-form-item> -->
        <el-form-item
          label="国家"
          prop="countryId"
        >
          <el-select
            v-model="form.countryId"
            :loading="countryLoading"
            placeholder="请选择"
            style="width: 100%;"
            filterable
            @focus="getCountryList"
            @change="onCountry"
          >
            <el-option
              v-for="item in countryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="区内省份"
          prop="area"
        >
          <el-input
            v-model="s"
            :placeholder="`已选择(${form.area.length})`"
            style="width: 100%;"
            disabled
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              :disabled="!form.countryId"
              @click="handleStates"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            placeholder="请输入"
            style="width: 100%;"
            :maxlength="100"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
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
          @click="confirmSave"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  getRegionList,
  saveRegion,
  queryStateList,
  deleteRegion,
  getCountryList
} from '@/api/operation-of-domestic-area'

@Component({
  name: 'OperatingCenter',
  components: {},
  props: {
    wsId: {
      type: String,
      default: ''
    }
  }
})
export default class OperatingCenter extends Vue {
  /** data */
  private loading: boolean = false
  private dialogShow: boolean = false
  private dialogLoading: boolean = false
  private isEdit: boolean = false
  private tableData: any = []
  private searchForm: any = {
    name: ''
  }
  private form: any = {
    countryId: '', // 国家
    countryName: '',
    area: [],
    name: '', // 区域名称
    remark: '' // 备注
  }
  private countryList: any[] = [] // 国际列表
  private stateList: any[] = [] // 省份列表
  private countryLoading: boolean = false
  private stateLoading: boolean = false
  private formLoading: boolean = false
  private currentId = undefined
  private page: number = 1
  private size: number = 10
  private total: any = 0
  private s: any = '' // 省
  private isItemDialogShow: boolean = false
  private formRules = {
    name: [
      { required: true, message: '区域名称不能为空', trigger: 'blur' }
    ],
    // type: { required: true, message: '区域类型不能为空', trigger: 'blur' },
    countryId: {
      required: true,
      message: '请选择国家',
      trigger: 'change'
    },
    cities: { required: true, message: '请选择区内城市', trigger: 'change' },
    area: { required: true, message: '请选择区内省份', trigger: 'change' }
  }
  /** method */
  private queryAll(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const params = {
      page: this.page,
      size: this.size,
      name: this.searchForm.name || undefined
    }
    getRegionList(params)
      .then((res: any) => {
        this.loading = false
        this.tableData = res.data.result || []
        this.total = res.data.total
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private itemDialogClose() {
    this.isItemDialogShow = false
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
    // this.form.area = []
  }
  private filterMethod(query: any, item: any): boolean {
    return item.label.toUpperCase().indexOf(query.toUpperCase()) > -1
  }
  private handleStates(): void {
    this.isItemDialogShow = true
    this.getStateList()
  }
  // 表格渲染国家省份城市
  private filterFunc(data: any): any {
    const list = data || []
    const states = list.map((item: any) => item.stateName)
    return states.join(', ')
  }
  // 新增区域
  private addArea() {
    this.dialogShow = true
    this.isEdit = false
  }
  // 编辑区域
  private editForm(row: any) {
    this.isEdit = true
    const { name, remark, countryId, states, id } = row
    const area = states.map((item: any) => item.stateId)

    this.form = {
      name,
      countryId,
      states,
      remark,
      area,
      id
    }
    this.getCountryList()
    this.getStateList()
    this.dialogShow = true
  }

  private onCountry(): void {
    this.form.area = []
    this.stateList = []
  }

  // 新增编辑确认保存
  private confirmSave(): void {
    const editForm: any = this.$refs.editForm
    editForm.validate((valid: any) => {
      if (valid) {
        this.formLoading = true
        const { area, countryId, name, remark, id } = this.form
        const countryName = (this.countryList.find(item => item.id === countryId) || {}).name
        const statesList = area.map((item: any) => {
          const { id: stateId, label: stateName } = (this.stateList || []).find((c: any) => c.id === item)
          return {
            stateId,
            stateName
          }
        })
        const states = statesList.filter((item: any) => item.stateId && item.stateName)
        const params = {
          countryId,
          countryName,
          name,
          remark,
          states,
          id
        }
        saveRegion(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.dialogShow = false
            this.formLoading = false
            this.queryAll()
            this.resetForm()
            this.clearValidate()
          })
          .catch((err: any) => {
            this.formLoading = false
            return err
          })
      } else {
        return false
      }
    })
  }
  private deleteData(row: any) {
    const { id } = row
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        const params = {
          id
        }
        deleteRegion(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '操作成功'
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
  // 取消
  private cancel() {
    this.dialogShow = false
    this.stateList = []
    this.resetForm()
    this.clearValidate()
  }
  private clearValidate() {
    this.$nextTick(() => {
      const editForm: any = this.$refs.editForm
      editForm.clearValidate()
    })
  }
  private resetForm(): void {
    this.form = {
      countryId: '', // 国家
      countryName: '',
      area: [],
      name: '', // 区域名称
      remark: '' // 备注
    }
  }
  // 获取国家列表
  private getCountryList() {
    this.countryLoading = true
    getCountryList()
      .then((res: any) => {
        this.countryList = res.data.result.map((e: any) => {
          if (e.alias) {
            e.name = e.name + '-' + e.alias
          }
          return e
        })
        this.countryLoading = false
      })
      .catch((err: any) => {
        this.countryLoading = false
        return err
      })
  }
  // 获取省州列表
  private getStateList() {
    if (!this.form.countryId) {
      this.$message.error('请先选择国家/地区')
      return
    }
    this.stateLoading = true
    const params = {
      countryId: this.form.countryId
    }
    queryStateList(params)
      .then((res: any) => {
        this.stateLoading = false
        const data = res.data || {}
        const list = data.result || []
        this.stateList = list.map((e: any) => {
          e.label = e.name
          if (e.alias) {
            e.label = e.name + '-' + e.alias
          }
          return e
        })
      })
      .catch((err: any) => {
        this.stateLoading = false
        return err
      })
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.queryAll()
  }

  private created() {
    this.queryAll()
  }
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
