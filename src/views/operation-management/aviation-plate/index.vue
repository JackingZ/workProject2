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
          title="航空板"
        />
        <div class="app-panel">
          <el-row>
            <el-col :span="6">
              <el-button
                v-permission="['aviationBoardAdd']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-left: 10px"
                @click="addCar"
              >
                新增
              </el-button>
            </el-col>
            <el-col
              :span="18"
              style="text-align:right;"
            >
              <el-input
                v-model="selectValue.name"
                size="small"
                style="width:180px;margin-right:10px;"
                placeholder="规格名称"
              />
              <el-button
                v-permission="['aviationBoardQuery']"
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
              label="规格名称"
            />
            <el-table-column
              prop="alias"
              label="英文名称"
            />
            <el-table-column
              prop="length"
              label="长"
              min-width="100"
            />
            <el-table-column
              prop="width"
              label="宽"
              min-width="100"
            />
            <el-table-column
              prop="height"
              label="高"
              min-width="100"
            />
            <el-table-column
              prop="volume"
              label="支持最大体积"
              min-width="100"
            />
            <el-table-column
              prop="loadLimit"
              label="支持最大重量"
              min-width="100"
            />
            <el-table-column
              prop="umLength"
              label="长度单位"
              min-width="100"
            >
              <template slot-scope="scope">
                <span>{{ $fomatLength(scope.row.umLength) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="umWeight"
              label="重量单位"
              min-width="100"
            >
              <template slot-scope="scope">
                <span>{{ $fomatWeight(scope.row.umWeight) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="160px"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['aviationBoardUpdate']"
                  type="text"
                  size="medium"
                  @click="editVehicle(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['aviationBoardDel']"
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
            :title="isEdit ? '编辑航空板' : '新增航空板'"
            :visible.sync="isAddEditVisible"
            :close-on-click-modal="false"
            width="900px"
            @closed="cancel"
          >
            <div v-loading="dialogLoading">
              <el-form
                ref="editForm"
                :model="selectForm"
                :rules="formRules"
                label-width="120px"
                label-position="right"
                size="small"
                style="padding-right: 20px;"
              >
                <el-form-item
                  label="规格名称"
                  prop="name"
                >
                  <el-input
                    ref="firstInput"
                    v-model="selectForm.name"
                    :maxlength="50"
                    placeholder="请输入"
                  />
                </el-form-item>
                <el-form-item
                  label="英文名称"
                  prop="alias"
                >
                  <el-input
                    v-model="selectForm.alias"
                    :maxlength="50"
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
                    style="width: 100%;"
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
                  label="重量单位"
                  prop="umWeight"
                >
                  <el-select
                    v-model="selectForm.umWeight"
                    placeholder="请选择"
                    style="width: 100%;"
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
                    :min="0"
                    :max="999999"
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
                    :min="0"
                    :max="999999"
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
                    :min="0"
                    :max="999999"
                    :precision="2"
                  />
                </el-form-item>
                <el-form-item
                  label="支持最大体积"
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
                  label="支持最大重量"
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
              </el-form>

              <div
                slot="footer"
                style="text-align:right;padding: 10px 0px 20px;"
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
  getAviationList,
  saveAviation,
  deleteAviation
} from '@/api/operation-of-aviation-plate'
import { getWordsList } from '@/api/public'

@Component({
  name: 'plate',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private isAddEditVisible: boolean = false
  private dialogLoading: boolean = false
  private isEdit: boolean = false
  private tableData: any = []
  private volumeUnit = '1'
  private weightUnit = '1'

  private currentId = ''
  private selectValue = {
    name: undefined
  }
  private selectForm: any = {
    name: undefined, // 货柜名称
    alias: undefined, // 英文名称
    umLength: undefined, // 长度单位
    umVolume: undefined, // 体积单位
    umWeight: undefined, // 重量单位
    length: undefined, // 长度
    width: undefined, // 宽度
    height: undefined, // 高度
    volume: undefined, // 装载体积
    loadLimit: undefined // 载重
  }
  private formRules = {
    name: [
      { required: true, message: '规格名称不能为空', trigger: 'blur' }
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
      { required: true, message: '体积不能为空', trigger: 'change' }
    ],
    loadLimit: [{ required: true, message: '重量不能为空', trigger: 'blur' }]
  }
  private umLengthList: any[] = []
  // private umVolumeList: any[] = []
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
      // getWordsList({ type: 'VOLUME_TYPE' }),
      getWordsList({ type: 'weight_type' })
    ]).then((res: any[]) => {
      this.umLengthList = res[0].data || []
      // this.umVolumeList = res[1].data || []
      this.umWeightList = res[1].data || []
    }).catch((err: any) => err)
  }
  private queryAll(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const params = {
      page: this.page,
      size: this.size,
      model: {
        searchKey: this.selectValue.name || undefined
      }
    }
    getAviationList(params)
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
        deleteAviation(params)
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
    this.$nextTick(() => {
      const ele:any = this.$refs.firstInput
      ele.focus()
    })
  }

  private clearValidate() {
    this.$nextTick(() => {
      const editForm: any = this.$refs.editForm
      editForm.clearValidate()
    })
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
        this.dialogLoading = true
        const params: any = {
          ...this.selectForm
        }
        if (this.isEdit) {
          params.id = this.currentId
        } else {
          params.id = ''
        }
        saveAviation(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.isAddEditVisible = false
            this.dialogLoading = false
            this.resetForm()
            this.queryAll()
          })
          .catch((err: any) => {
            this.dialogLoading = false
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
      loadLimit: undefined // 载重
    }
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
      seats
    } = row
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
      loadLimit
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
  }
  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.queryAll()
  }

  private async created() {
    this.loading = true
    await this.getWordsList()
    this.queryAll()
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-form-item {
  margin-bottom: 22px;
  display: inline-block;
  width: 50%;
}
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
</style>
