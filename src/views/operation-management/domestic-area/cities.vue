<template>
  <div>
    <el-row>
      <el-col :span="6">
        <el-button
          v-permission="['cityDomesticAdd']"
          type="text"
          icon="el-icon-circle-plus-outline"
          style="margin-left: 10px"
          @click="addArea"
        >
          新增城市分区
        </el-button>
      </el-col>
      <el-col
        :span="18"
        style="text-align:right;padding-right: 10px;"
      >
        <el-select
          v-model="searchForm.countryId"
          :loading="selectLoading"
          placeholder="国家"
          clearable
          style="width:150px;margin-right:10px;"
          size="small"
          filterable
          @focus="getCountryList"
          @change="onCountryChange"
        >
          <el-option
            v-for="item in countryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="searchForm.stateId"
          :loading="selectLoading"
          :disabled="!searchForm.countryId"
          placeholder="州/省"
          clearable
          filterable
          size="small"
          style="width:130px;margin-right:5px;"
          @focus="getStateList"
          @change="onStateChange"
        >
          <el-option
            v-for="item in stateList"
            :key="item.id"
            :label="`${item.name}-${item.alias}`"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="searchForm.cityId"
          :loading="selectLoading"
          :disabled="!searchForm.stateId"
          placeholder="城市"
          clearable
          size="small"
          filterable
          style="width:130px;margin-right:5px;"
          @focus="getCityList"
        >
          <el-option
            v-for="item in cityList"
            :key="item.id"
            :label="`${item.name}-${item.alias}`"
            :value="item.id"
          />
        </el-select>

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
        label="城市"
        min-width="250"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ filterFunc(scope.row.result) }}
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
            v-permission="['cityDomesticUpdate']"
            type="text"
            size="medium"
            @click="editForm(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-permission="['cityDomesticDel']"
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
      title="城市"
      :visible.sync="isItemDialogShow"
      :close-on-click-modal="false"
      width="960px"
      append-to-body
      class="cities-dialog"
      @close="itemDialogClose"
    >
      <ZjTransfer ref="zjTransfer" />
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
      :title="isEdit ? '编辑城市分区' : '新增城市分区'"
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
        <el-form-item
          label="国家"
          prop="countryId"
        >
          <el-select
            v-model="form.countryId"
            :loading="selectLoading"
            placeholder="请选择"
            style="width: 100%;"
            filterable
            @focus="getCountryList"
            @change="onCountryForm"
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
          label="城市"
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
              @click="handleCities"
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
import ZjTransfer from '@/views/operation-management/domestic-area/zj-transfer.vue'
import {
  getAreaTypeList,
  saveAreaType,
  deleteAreaType,
  getCountryList,
  getStateByCountry,
  getCityByState
} from '@/api/operation-of-domestic-area'

@Component({
  name: 'cities',
  components: {
    ZjTransfer
  },
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
  private copyList: any[] = []
  private form: any = {
    countryId: '', // 国家
    countryName: '',
    area: [],
    name: '', // 区域名称
    remark: '' // 备注
  }
  private searchForm: any = {
    countryId: '',
    stateId: '',
    cityId: '',
    name: ''
  }
  private countryList: any[] = [] // 国际列表
  private stateList: any[] = []
  private cityList: any[] = []
  private state2List: any[] = [] // 省份列表
  private formLoading: boolean = false
  private selectLoading: boolean = false
  private page: number = 1
  private size: number = 10
  private total: any = 0
  private s: any = '' // 省
  private isItemDialogShow: boolean = false
  private formRules = {
    name: [
      { required: true, message: '区域名称不能为空', trigger: 'blur' }
    ],
    countryId: { required: true, message: '请选择国家', trigger: 'change' },
    area: { required: true, message: '请选择区内城市', trigger: 'change' }
  }
  /** method */
  private queryAll(val?: number): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const params = {
      model: {
        ...this.searchForm,
        type: '1'
      },
      page: this.page,
      size: this.size
    }
    getAreaTypeList(params)
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
    const root: any = this.$refs.zjTransfer
    const arr = JSON.parse(JSON.stringify(root.rightData))
    this.form.area = arr.map((item: any) => {
      const { id: cityId, name: cityName, stateId } = item
      return {
        cityId,
        cityName,
        stateId
      }
    }).filter((item: any) => item && item.cityId && item.cityName)
    this.isItemDialogShow = false
    this.$nextTick(() => {
      root.reset()
    })
  }
  private filterMethod(query: any, item: any): boolean {
    return item.label.toUpperCase().indexOf(query.toUpperCase()) > -1
  }
  private handleCities(): void {
    this.isItemDialogShow = true
    this.$nextTick(() => {
      const root: any = this.$refs.zjTransfer
      root.setData(this.form.countryId, this.form.area, this.state2List)
    })
  }
  // 表格渲染国家省份城市
  private filterFunc(data: any): any {
    const list = data || []
    const arr = list.map((item: any) => item.cityName)
    return arr.join(', ')
  }
  // 新增区域
  private addArea() {
    this.dialogShow = true
    this.isEdit = false
  }
  // 编辑区域
  private editForm(row: any) {
    this.isEdit = true
    const { name, remark, countryId, result, id } = row
    this.copyList = JSON.parse(JSON.stringify(result))
    this.form = {
      name,
      countryId,
      remark,
      area: result,
      id
    }
    this.getCountryList()
    this.getState2List()
    this.dialogShow = true
  }

  private onCountryForm(): void {
    this.form.area = []
    this.state2List = []
    this.getState2List()
  }

  // 新增编辑确认保存
  private confirmSave(): void {
    const editForm: any = this.$refs.editForm
    editForm.validate((valid: any) => {
      if (valid) {
        this.formLoading = true
        const { area, countryId, name, remark, id } = this.form
        const countryName = (this.countryList.find(item => item.id === countryId) || {}).name
        const list = area.map((item: any) => {
          const { cityId, cityName, stateId } = item
          const stateName = (this.state2List.find((s: any) => s.id === stateId) || {}).name
          return {
            cityId,
            cityName,
            stateId,
            stateName
          }
        }).filter((item: any) => item && item.cityId && item.cityName)
        const arr = list.map((it: any) => {
          const bool = this.copyList.every((c: any) => it.cityId !== c.cityId)
          if (bool) {
            return {
              ...it,
              type: '1',
              countryId,
              countryName,
              name,
              remark
            }
          }
        }).filter((it: any) => it && it.cityId && it.cityName)
        const brr = this.copyList.map((it: any) => {
          if (area.every((a: any) => it.cityId !== a.cityId)) return it.id
        }).filter((it: any) => it)

        saveAreaType({
          areaType: {
            id,
            name,
            remark,
            countryId,
            countryName,
            parentId: '0',
            type: '1'
          },
          delList: brr,
          insList: arr
        })
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.formLoading = false
            this.queryAll()
            this.cancel()
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
        deleteAreaType(params)
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
    this.state2List = []
    this.copyList = []
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
    this.selectLoading = true
    getCountryList()
      .then((res: any) => {
        this.countryList = res.data.result.map((e: any) => {
          if (e.alias) {
            e.name = e.name + '-' + e.alias
          }
          return e
        })
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private async getStateList() {
    if (!this.searchForm.countryId) return
    this.selectLoading = true
    await getStateByCountry(this.searchForm.countryId).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      const result = data.result || []
      this.stateList = result
    }).catch(() => {
      this.stateList = []
      this.selectLoading = false
    })
  }
  private async getCityList() {
    if (!this.searchForm.stateId) return
    this.selectLoading = true
    await getCityByState(this.searchForm.stateId).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      const result = data.result || []
      this.cityList = result
    }).catch(() => {
      this.cityList = []
      this.selectLoading = false
    })
  }
  // 获取城市列表
  private getState2List() {
    if (!this.form.countryId) {
      this.$message.error('请先选择国家')
      return
    }
    this.formLoading = true
    getStateByCountry(this.form.countryId)
      .then((res: any) => {
        const data = res.data || {}
        const list = data.result || []
        this.state2List = list
        this.formLoading = false
      })
      .catch((err: any) => {
        this.formLoading = false
        return err
      })
  }
  private async onCountryChange() {
    this.searchForm.stateId = ''
    this.onStateChange()
  }
  private onStateChange() {
    this.searchForm.cityId = ''
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
.cities-dialog ::v-deep .el-dialog__body {
  padding: 10px 20px;
}
</style>
