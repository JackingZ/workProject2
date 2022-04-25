<template>
  <div
    class="car-management"
    style="display: flex;flex-flow: row nowrap;min-height: inherit;"
  >
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="车型管理"
        />
        <div class="app-panel">
          <el-row>
            <el-col :span="6">
              <el-button
                v-permission="['addVehicleType']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-left: 10px"
                @click="addCar"
              >
                新增车型
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
                filterable
                clearable
                size="small"
                @focus="getCountryList"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
              <el-input
                v-model="selectValue.name"
                size="small"
                clearable
                style="width:180px;margin-right:10px;"
                placeholder="车型名称关键字"
              />
              <el-button
                v-permission="['queryVehicleType']"
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
              :formatter="formatCountry"
              label="国家/地区"
              min-width="200"
              show-overflow-tooltip
            />
            <el-table-column
              prop="name"
              label="车型名称"
            />
            <el-table-column
              prop="alias"
              label="英文名称"
            />
            <el-table-column
              prop="length"
              label="车长"
              min-width="100"
              :formatter="(row, col, val, index) => formatterUnit(row, val, umLengthList, 'umLength')"
            />
            <el-table-column
              prop="width"
              label="车宽"
              min-width="100"
              :formatter="(row, col, val, index) => formatterUnit(row, val, umLengthList, 'umLength')"
            />
            <el-table-column
              prop="height"
              label="车高"
              min-width="100"
              :formatter="(row, col, val, index) => formatterUnit(row, val, umLengthList, 'umLength')"
            />
            <el-table-column
              prop="volume"
              label="装载体积"
              min-width="100"
              :formatter="(row, col, val, index) => formatterUnit(row, val, umVolumeList, 'umVolume')"
            />
            <el-table-column
              prop="loadLimit"
              label="最大限重"
              min-width="100"
              :formatter="(row, col, val, index) => formatterUnit(row, val, umWeightList, 'umWeight')"
            />
            <el-table-column
              prop="seats"
              label="座位数"
              width="110px"
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="160px"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['editVehicleType']"
                  type="text"
                  size="medium"
                  @click="editVehicle(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['deleteVehicleType']"
                  type="text"
                  size="medium"
                  @click="deleteVehicle(scope.row)"
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
            :title="isEdit ? '编辑车型' : '新增车型'"
            :visible.sync="isAddEditVisible"
            :close-on-click-modal="false"
            width="900px"
            @closed="cancel"
          >
            <el-form
              ref="editForm"
              v-loading="formLoading"
              :model="selectForm"
              :rules="formRules"
              label-width="100px"
              label-position="right"
              size="small"
              style="padding-right: 20px;"
            >
              <el-form-item
                prop="area"
                label="国家/地区"
              >
                <el-input
                  v-model="s"
                  :placeholder="`已选择(${selectForm.area.length})`"
                  style="width:100%"
                  disabled
                >
                  <el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="handleStates"
                  />
                </el-input>
                <!-- <el-select
                  v-model="selectForm.countryId"
                  placeholder="please choose"
                  style="width: 100%"
                  filterable
                  size="small"
                  @focus="getCountryList"
                >
                  <el-option
                    v-for="item in countryList"
                    :key="item.id"
                    :label="`${item.name}-${item.alias}`"
                    :value="item.id"
                  />
                </el-select> -->
              </el-form-item>

              <el-form-item
                label="车型名称"
                prop="name"
              >
                <el-input
                  v-model="selectForm.name"
                  placeholder="请输入"
                />
              </el-form-item>
              <el-form-item
                label="英文名称"
                prop="alias"
              >
                <el-input
                  v-model="selectForm.alias"
                  :maxlength="20"
                  placeholder="请输入"
                />
              </el-form-item>
              <el-form-item
                label="长度单位"
                prop="umLength"
              >
                <el-select
                  v-model="selectForm.umLength"
                  placeholder="请选择"
                  @change="onLength"
                >
                  <el-option
                    v-for="item in umLengthList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="体积单位"
                prop="umVolume"
              >
                <el-select
                  v-model="selectForm.umVolume"
                  placeholder="请选择"
                  disabled
                >
                  <el-option
                    v-for="item in umVolumeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="重量单位"
                prop="umWeight"
              >
                <el-select
                  v-model="selectForm.umWeight"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in umWeightList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="长度"
                prop="length"
              >
                <el-input-number
                  v-model="selectForm.length"
                  class="input-number-valiate"
                  :controls="false"
                  placeholder="请输入"
                  :min="1"
                  :max="9999"
                  :precision="2"
                />
              </el-form-item>
              <el-form-item
                label="宽度"
                prop="width"
              >
                <el-input-number
                  v-model="selectForm.width"
                  class="input-number-valiate"
                  :controls="false"
                  placeholder="请输入"
                  :min="1"
                  :max="9999"
                  :precision="2"
                />
              </el-form-item>
              <el-form-item
                label="高度"
                prop="height"
              >
                <el-input-number
                  v-model="selectForm.height"
                  class="input-number-valiate"
                  :controls="false"
                  placeholder="请输入"
                  :min="1"
                  :max="9999"
                  :precision="2"
                />
              </el-form-item>
              <el-form-item
                label="装载体积"
                prop="volume"
              >
                <el-input-number
                  v-model="selectForm.volume"
                  class="input-number-valiate"
                  :controls="false"
                  placeholder="请输入"
                  :min="0"
                  :max="999999"
                  :precision="2"
                />
              </el-form-item>
              <el-form-item
                label="最大限重"
                prop="loadLimit"
              >
                <el-input-number
                  v-model="selectForm.loadLimit"
                  class="input-number-valiate"
                  :controls="false"
                  placeholder="请输入"
                  :min="0"
                  :max="999999"
                  :precision="2"
                />
              </el-form-item>
              <el-form-item
                label="座位数"
                prop="seats"
              >
                <el-input-number
                  v-model="selectForm.seats"
                  class="input-number-valiate"
                  :controls="false"
                  :step="1"
                  step-strictly
                  placeholder="请输入"
                  :min="1"
                  :max="100"
                />
              </el-form-item>
            </el-form>

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

          <el-dialog
            title="国家/地区"
            :visible.sync="isItemDialogShow"
            :close-on-click-modal="false"
            width="960px"
            @close="itemDialogClose"
          >
            <el-transfer
              ref="transferItem"
              v-model="selectForm.area"
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
  getVehicleTypeList,
  saveVehicleType,
  deleteVehicle,
  getCountryList
} from '@/api/operation-of-vehicle-type'
import { getWordsList } from '@/api/public'

@Component({
  name: 'Port',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private selectLoading: boolean = false
  private isAddEditVisible: boolean = false
  private dialogLoading: boolean = false
  private isEdit: boolean = false
  private tableData: any = []
  private area: any = []
  private areaList: any = []
  private volumeUnit = '1'
  private weightUnit = '1'

  private currentId = ''
  private selectValue: any = {
    countryId: undefined,
    name: ''
  }
  private selectForm: any = {
    name: undefined, // 车型名称
    alias: undefined, // 英文名称
    umLength: undefined, // 长度单位
    umVolume: undefined, // 体积单位
    umWeight: undefined, // 重量单位
    length: undefined, // 车长
    width: undefined, // 宽长
    height: undefined, // 车高
    volume: undefined, // 装载体积
    loadLimit: undefined, // 载重
    seats: undefined, // 座位数
    area: []
  }
  private countryList: any[] = [] // 国际列表
  private props: any = {
    label: 'name',
    value: 'id'
  }
  private s: any = ''
  private formLoading: boolean = false
  private isItemDialogShow: boolean = false
  private formRules = {
    name: [
      { required: true, message: '车型名称不能为空', trigger: 'blur' }
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
    ],
    umLength: [
      { required: true, message: '长度单位不能为空', trigger: 'change' }
    ],
    umVolume: [
      { required: true, message: '体积单位不能为空', trigger: 'change' }
    ],
    umWeight: [
      { required: true, message: '重量单位不能为空', trigger: 'change' }
    ],
    length: [{ required: true, message: '长度不能为空', trigger: 'blur' }],
    width: [{ required: true, message: '宽度不能为空', trigger: 'blur' }],
    height: [{ required: true, message: '高度不能为空', trigger: 'blur' }],
    volume: [
      { required: true, message: '装载体积不能为空', trigger: 'change' }
    ],
    loadLimit: [{ required: true, message: '载重不能为空', trigger: 'blur' }],
    seats: [{ required: true, message: '座位数不能为空', trigger: 'blur' }],
    area: [{ required: true, message: '国家/地区不能为空', trigger: 'change' }]
  }
  private umLengthList: any[] = []
  private umVolumeList: any[] = []
  private umWeightList: any[] = []

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
  private formatterUnit(row: any, val: any, list: any[], prop: string) {
    const t = list.find((e: any) => e.value === row[prop])
    if (t) {
      return `${val} (${t.label})`
    }
    return val
  }
  private async getWordsList() {
    await Promise.all([
      getWordsList({ type: 'measurement_type' }),
      getWordsList({ type: 'VOLUME_TYPE' }),
      getWordsList({ type: 'weight_type' })
    ]).then((res: any[]) => {
      this.umLengthList = res[0].data || []
      this.umVolumeList = res[1].data || []
      this.umWeightList = res[2].data || []
    }).catch((err: any) => err)
  }

  private formatCountry(row: any) {
    const arr = row.countries.map((it: any) => it.countryName)
    return arr.join(', ')
  }

  private handleStates(): void {
    this.isItemDialogShow = true
  }

  private itemDialogClose() {
    this.isItemDialogShow = false
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
    // this.form.area = []
  }

  private filterMethod(query: any, item: any): boolean {
    const name = item.name || ''
    return name.indexOf(query) > -1
  }

  // 获取国家列表
  private getCountryList() {
    this.selectLoading = true
    getCountryList()
      .then(res => {
        const data = res.data || {}
        const result = data.result || []
        this.countryList = result.map((it: any) => {
          const { name, id, alias } = it
          return {
            id,
            name,
            alias,
            label: name + '-' + alias
          }
        })
        this.selectLoading = false
      })
      .catch(err => {
        this.selectLoading = false
        return err
      })
  }

  private queryAll(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const params = {
      page: this.page,
      size: this.size,
      ...this.selectValue
    }
    getVehicleTypeList(params)
      .then((res: any) => {
        this.loading = false
        this.tableData = res.data.result
        this.total = res.data.total
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

  // 删除数据
  private deleteVehicle(row: any) {
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
        deleteVehicle(params)
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

  private onLength(val: any) {
    if (!val) {
      this.selectForm.umVolume = undefined
      return
    }
    const unit = val.toUpperCase()
    switch (val) {
      case 'CM':
        this.selectForm.umVolume = 'CBCM'
        break
      case 'M':
        this.selectForm.umVolume = 'CBM'
        break
      case 'IN':
        this.selectForm.umVolume = 'CUIN'
        break
      case 'FT':
        this.selectForm.umVolume = 'CUFT'
        break
      default:
        this.selectForm.umVolume = undefined
        break
    }
  }

  // 新增
  private addCar(): void {
    this.isEdit = false
    this.isAddEditVisible = true
  }

  private cancel() {
    this.isAddEditVisible = false
    this.resetForm()
    this.clearValidate()
  }

  // 提交保存
  private saveConfirm() {
    const editForm: any = this.$refs.editForm
    editForm.validate((valid: any) => {
      if (valid) {
        this.formLoading = true
        const params: any = {
          ...this.selectForm
        }
        const { area } = this.selectForm
        const countries = area.map((item: any) => {
          const { id: countryId, label: countryName } = (this.countryList || []).find((c: any) => c.id === item)
          return {
            countryId,
            countryName
          }
        })
        params.countries = countries
        if (this.isEdit) {
          params.id = this.currentId
        } else {
          params.id = ''
        }
        saveVehicleType(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.isAddEditVisible = false
            this.formLoading = false
            this.resetForm()
            this.clearValidate()
            this.queryAll()
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

  // 重置表单
  private resetForm() {
    this.selectForm = {
      name: undefined, // 车型名称
      alias: undefined, // 英文名称
      umLength: undefined, // 长度单位
      umVolume: undefined, // 体积单位
      umWeight: undefined, // 重量单位
      length: undefined, // 车长
      width: undefined, // 宽长
      height: undefined, // 车高
      volume: undefined, // 装载体积
      loadLimit: undefined, // 载重
      seats: undefined, // 座位数
      area: []
    }
  }

  private clearValidate() {
    this.$nextTick(() => {
      const editForm: any = this.$refs.editForm
      editForm.clearValidate()
    })
  }

  // 编辑
  private editVehicle(row: any): void {
    this.currentId = row.id
    const {
      name,
      alias,
      umLength,
      umVolume,
      umWeight,
      length,
      width,
      height,
      volume,
      loadLimit,
      seats,
      countries
    } = row
    const area = (countries || []).map((item: any) => item.countryId)
    this.selectForm = {
      name,
      alias,
      umLength,
      umVolume,
      umWeight,
      length,
      width,
      height,
      volume,
      loadLimit,
      seats,
      area
    }
    this.isEdit = true
    this.isAddEditVisible = true
  }

  // 关闭dialog重置表单
  private close(): void {
    this.isAddEditVisible = false
    this.resetForm()
  }

  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.queryAll()
    // this.$message.success(val)
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.queryAll()
    // this.$message.success(val)
  }

  private async created() {
    this.loading = true
    await this.getWordsList()
    this.queryAll()
    this.getCountryList()
  }
}
</script>
<style lang="scss" scoped>
  .el-select{
    width: 100%;
  }

  ::v-deep .el-form-item{
    margin-bottom: 22px;
    display: inline-block;
    width: 50%;
  }

  ::v-deep .el-transfer-panel{
    width: 40%;
    height: 100%;
  }

  ::v-deep .el-transfer{
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
  }

  ::v-deep .el-transfer-panel__list.is-filterable{
    display: flex;
    flex-flow: column nowrap;
    height: 100%;
  }

  ::v-deep .el-transfer-panel__body{
    height: 78%;
  }

  .input-number-valiate{
    width: 100%;
    ::v-deep .el-input__inner{
      text-align: left;
    }
  }
</style>
