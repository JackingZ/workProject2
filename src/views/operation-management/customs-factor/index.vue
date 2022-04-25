<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="报关要素"
        />
        <div class="app-panel">
          <el-row>
            <el-col :span="4">
              <el-button
                v-permission="['customsFactorAdd']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-left: 10px"
                @click="addRow"
              >
                新增
              </el-button>
            </el-col>
            <el-col
              :span="20"
              style="text-align:right;"
            >
              <el-select
                v-model="selectValue.countryId"
                :loading="selectLoading"
                placeholder="国家"
                size="small"
                clearable
                filterable
                style="width:130px;margin-right: 5px;"
                @focus="getCountryData"
              >
                <el-option
                  v-for="itC in countryList"
                  :key="itC.id"
                  :label="`${itC.name}-${itC.alias}`"
                  :value="itC.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.enabled"
                placeholder="状态"
                size="small"
                clearable
                filterable
                style="width:130px;margin-right: 5px;"
              >
                <el-option
                  label="启用"
                  value="0"
                />
                <el-option
                  label="禁用"
                  value="1"
                />
              </el-select>
              <el-input
                v-model="selectValue.keyword"
                placeholder="请输入内容"
                style="width:250px;margin-right:10px;"
                size="small"
              >
                <el-select
                  slot="prepend"
                  v-model="keyType"
                  size="small"
                  style="width:100px;"
                  placeholder="请选择"
                >
                  <el-option
                    label="中文名称"
                    value="1"
                  />
                  <el-option
                    label="英文名称"
                    value="2"
                  />
                  <el-option
                    label="海关编码"
                    value="3"
                  />
                </el-select>
              </el-input>
              <el-button
                v-permission="['customsFactorSearch']"
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
            height="calc(100vh - 300px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              min-width="180"
              show-overflow-tooltip
            >
              <template slot="header">
                <span>商品名称(中文)</span>
                <br>
                <span>商品名称(英文)</span>
              </template>
              <template slot-scope="scope">
                <div class="item-word">
                  {{ scope.row.cnName ? scope.row.cnName : '--' }}
                </div>
                <div class="item-word">
                  {{ scope.row.enName ? scope.row.enName : '--' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="海关编码"
              width="100"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="medium"
                  @click="editCode(scope.row)"
                >
                  海关编码
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="brand"
              label="品牌"
              min-width="120"
            />
            <el-table-column
              prop="model"
              label="型号"
              min-width="120"
            />
            <el-table-column
              min-width="180"
              show-overflow-tooltip
            >
              <template slot="header">
                <span>材质(中文)</span>
                <br>
                <span>材质(英文)</span>
              </template>
              <template slot-scope="scope">
                <div class="item-word">
                  {{ scope.row.cnMeterial ? scope.row.cnMeterial : '--' }}
                </div>
                <div class="item-word">
                  {{ scope.row.enMeterial ? scope.row.enMeterial : '--' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              min-width="180"
              show-overflow-tooltip
            >
              <template slot="header">
                <span>用途(中文)</span>
                <br>
                <span>用途(英文)</span>
              </template>
              <template slot-scope="scope">
                <div class="item-word">
                  {{ scope.row.cnUsage ? scope.row.cnUsage : '--' }}
                </div>
                <div class="item-word">
                  {{ scope.row.enUsage ? scope.row.enUsage : '--' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="remarks"
              label="备注"
              min-width="180"
              show-overflow-tooltip
            />
            <el-table-column
              label="启用状态"
              width="100"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-switch
                  :value="scope.row.deleted"
                  :disabled="!$checkPermission(['customsFactorStatus'])"
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
              width="130"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['customsFactorEdit']"
                  type="text"
                  size="medium"
                  @click="editRow(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['customsFactorCopy']"
                  type="text"
                  size="medium"
                  @click="copyRow(scope.row)"
                >
                  复制
                </el-button>
                <!-- <el-button
                  v-permission="['customsFactorDelete']"
                  type="text"
                  size="medium"
                  @click="deleteRow(scope.row)"
                >
                  删除
                </el-button> -->
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
            :title="isEdit === 'add' ? '新增报关要素' : isEdit === 'edit' ? '编辑报关要素' : '复制报关要素'"
            :visible.sync="isDialogFormShow"
            :close-on-click-modal="false"
            width="960px"
            @closed="cancel"
          >
            <div v-loading="dialogLoading">
              <el-form
                ref="editForm"
                :model="form"
                :rules="formRules"
                label-width="100px"
                label-position="right"
                size="small"
                class="edit-form"
                style="padding-right: 20px;"
              >
                <el-form-item
                  prop="cnName"
                  label="中文名称"
                >
                  <el-input
                    v-model="form.cnName"
                    autocomplete="off"
                    style="width: 100%"
                    :maxlength="20"
                  />
                </el-form-item>
                <el-form-item
                  prop="enName"
                  label="英文名称"
                >
                  <el-input
                    v-model="form.enName"
                    autocomplete="off"
                    style="width: 100%"
                    :maxlength="50"
                  />
                </el-form-item>
                <el-form-item
                  prop=""
                  label="品牌"
                >
                  <el-input
                    v-model="form.brand"
                    autocomplete="off"
                    style="width: 100%"
                    :maxlength="50"
                  />
                </el-form-item>
                <el-form-item
                  prop=""
                  label="型号"
                >
                  <el-input
                    v-model="form.model"
                    autocomplete="off"
                    style="width: 100%"
                    :maxlength="50"
                  />
                </el-form-item>
                <el-form-item
                  prop=""
                  label="材质中文"
                >
                  <el-input
                    v-model="form.cnMeterial"
                    autocomplete="off"
                    style="width: 100%"
                    :maxlength="50"
                  />
                </el-form-item>
                <el-form-item
                  prop=""
                  label="材质英文"
                >
                  <el-input
                    v-model="form.enMeterial"
                    autocomplete="off"
                    style="width: 100%"
                    :maxlength="100"
                  />
                </el-form-item>
                <el-form-item
                  prop=""
                  label="用途中文"
                >
                  <el-input
                    v-model="form.cnUsage"
                    autocomplete="off"
                    style="width: 100%"
                    :maxlength="50"
                  />
                </el-form-item>
                <el-form-item
                  prop=""
                  label="用途英文"
                >
                  <el-input
                    v-model="form.enUsage"
                    autocomplete="off"
                    style="width: 100%"
                    :maxlength="100"
                  />
                </el-form-item>
                <el-form-item
                  prop=""
                  label="备注"
                  style="width: 100%;"
                >
                  <el-input
                    v-model="form.remarks"
                    :autosize="{minRows: 2, maxRows: 4}"
                    type="textarea"
                    :maxlength="100"
                    placeholder="请输入"
                  />
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

          <el-dialog
            title="海关编码"
            :visible.sync="isCodeVisible"
            :close-on-click-modal="false"
            width="800px"
            @close="cancelCode"
          >
            <div
              v-loading="dialogLoading"
            >
              <el-form
                ref="selectForm"
                :model="selectForm"
                label-position="right"
                size="small"
                class="code-form"
              >
                <div style="max-height: 400px;overflow-y: auto;">
                  <div
                    v-for="(item, index) in selectForm.sections"
                    :key="index"
                    class="item-after-icon"
                  >
                    <el-form-item
                      label="国家:"
                      prop="countryId"
                      label-width="50px"
                    >
                      <el-select
                        v-model="selectForm.sections[index].countryId"
                        :loading="selectLoading"
                        placeholder="请选择"
                        size="small"
                        clearable
                        filterable
                        style="width:100%;"
                        @focus="getCountryData"
                      >
                        <el-option
                          v-for="itC in countryList"
                          :key="itC.id"
                          :label="`${itC.name}-${itC.alias}`"
                          :value="itC.id"
                        />
                      </el-select>
                    </el-form-item>
                    <span style="padding-left: 10px;">海关编码:</span>
                    <el-form-item
                      prop="code"
                      label="不包税"
                      label-width="60px"
                    >
                      <el-input
                        v-model="selectForm.sections[index].customCode"
                        autocomplete="off"
                        style="width: 100%;"
                        :maxlength="20"
                      />
                    </el-form-item>
                    <el-form-item
                      prop="code"
                      label="包税"
                      label-width="50px"
                    >
                      <el-input
                        v-model="selectForm.sections[index].customCodeN"
                        autocomplete="off"
                        style="width: 100%;"
                        :maxlength="20"
                      />
                    </el-form-item>
                    <span>
                      <i
                        v-if="index===0"
                        class="el-icon-circle-plus-outline item-icon-plus"
                        @click="addRangeData"
                      />
                      <i
                        v-else
                        class="el-icon-remove-outline item-icon-reduce"
                        @click="deleteRangeData(index)"
                      />
                    </span>
                  </div>
                </div>
              </el-form>
              <div style="padding: 10px 10px 20px;text-align:right;">
                <el-button
                  @click="cancelCode"
                >
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
  getCountryList,
  getFactorList,
  saveFactor,
  copyFactor,
  getCodesById,
  saveCodes,
  changeFactorStatus
} from '@/api/operation-of-customs-code'

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
  private isCodeVisible: boolean = false
  private selectLoading: boolean = false
  private isEdit: string = ''
  private tableData: any[] = []
  private keyType = '1'
  private selectValue: any = {
    countryId: undefined,
    keyword: undefined,
    enabled: undefined
  }
  private form: any = {
    cnName: undefined,
    enName: undefined,
    brand: undefined,
    model: undefined,
    cnMeterial: undefined,
    enMeterial: undefined,
    cnUsage: undefined,
    enUsage: undefined,
    remarks: undefined
  }
  private formRules = {
    cnName: [
      { required: true, message: '商品中文名称不能为空', trigger: 'blur' }
    ],
    enName: [
      { required: true, message: '商品英文名称不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (!value) {
            callback(new Error('商品英文名称不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('商品英文名称不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }
  private selectForm: any = {
    sections: [
      {
        countryId: undefined,
        customCode: undefined,
        customCodeN: undefined
      }
    ]
  }
  private currentId: any = ''
  private countryList: any[] = []
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
  private getCountryData() {
    this.selectLoading = true
    getCountryList()
      .then((res: any) => {
        const data = res.data || {}
        this.countryList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private queryAll(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const params: any = {
      model: {
        countryId: this.selectValue.countryId || undefined,
        enabled: this.selectValue.enabled || undefined,
        cnName: this.keyType === '1' ? this.selectValue.keyword : undefined,
        enName: this.keyType === '2' ? this.selectValue.keyword : undefined,
        customCode: this.keyType === '3' ? this.selectValue.keyword : undefined
      },
      page: this.page,
      size: this.size
    }
    getFactorList(params)
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

  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.queryAll()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.queryAll()
  }

  // 海关编码
  private editCode(row: any) {
    this.isCodeVisible = true
    this.currentId = row.id
    this.getCodes()
    this.getCountryData()
  }
  private getCodes() {
    this.dialogLoading = true
    getCodesById({
      id: this.currentId
    })
      .then((res: any) => {
        const data = res.data || []
        if (data.length <= 0) {
          this.selectForm.sections = [{
            countryId: undefined,
            customCode: undefined,
            customCodeN: undefined
          }]
        } else {
          this.selectForm.sections = data.map((it: any) => {
            const { customCode, customCodeN, ...obj } = it
            return {
              ...obj,
              customCode: customCode || undefined,
              customCodeN: customCodeN || undefined
            }
          })
        }
        this.dialogLoading = false
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }
  private addRangeData() {
    this.selectForm.sections.push({
      countryId: undefined,
      customCode: undefined,
      customCodeN: undefined
    })
  }
  private deleteRangeData(index: number) {
    this.selectForm.sections.splice(index, 1)
  }
  private cancelCode() {
    this.isCodeVisible = false
    this.selectForm = { sections: [{ countryId: undefined, customCode: undefined, customCodeN: undefined }] }
  }
  private saveConfirm() {
    const { sections } = this.selectForm
    const isValue = Array.isArray(sections) && sections.every((it: any) => it.countryId && it.customCode && it.customCodeN)
    if (!isValue) {
      this.$message.error('请填写完整国家和海关编码')
      return
    }
    const arrC = sections.map((it: any) => it.countryId)
    const setC = [...new Set(arrC)]
    if (setC.length < sections.length) {
      this.$message.error('国家不能重复')
      return
    }
    this.dialogLoading = true
    const list = sections.map((it: any) => {
      const { countryId, customCode, customCodeN, deleted, essentialId, id } = it
      const item = this.countryList.find((c: any) => c.id === countryId) || {}
      return {
        countryId: item.id,
        countryName: item.name,
        customCode,
        customCodeN,
        deleted: deleted || 0,
        essentialId: essentialId || this.currentId,
        id
      }
    })
    saveCodes({
      id: this.currentId,
      list
    })
      .then((res: any) => {
        this.dialogLoading = false
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.isCodeVisible = false
        this.selectForm = { sections: [{ countryId: undefined, customCode: undefined, customCodeN: undefined }] }
        this.queryAll()
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }
  // 新增
  private addRow(): void {
    this.isDialogFormShow = true
    this.isEdit = 'add'
  }
  // 编辑
  private editRow(row: any): void {
    this.isDialogFormShow = true
    this.isEdit = 'edit'
    this.form = {
      ...row
    }
  }
  private copyRow(row: any): void {
    this.isDialogFormShow = true
    this.isEdit = 'copy'
    const { ...obj } = row
    this.form = {
      ...obj
    }
  }
  private async switchChange(row: any, value: any): Promise<void> {
    const olds = row.deleted.toString()
    const news = value.toString()
    if (!olds || olds === news) return
    const text = news === '1' ? '禁用' : '开启'
    const [cancel, confirm] = await this.$confirm(
      `此操作将${text}该报关要素，是否继续？`,
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
      id: row.id
    }
    changeFactorStatus(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '更新成功'
        })
        this.queryAll()
      })
      .catch((err: any) => {
        return err
      })
  }
  private deleteRow(row: any) {
    const params = {
      ...row,
      deleted: 1
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        saveFactor(params)
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

  private confirm(): void {
    (this.$refs.editForm as any).validate((valid: any) => {
      if (!valid) return false
      this.dialogLoading = true
      const params: any = {
        ...this.form,
        deleted: 0
      }
      if (this.isEdit === 'copy') {
        copyFactor(params)
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
        saveFactor(params)
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
      }
    })
  }
  private cancel(): void {
    this.isDialogFormShow = false
    this.isEdit = ''
    this.reset()
  }
  private reset(): void {
    this.form = {
      cnName: undefined,
      enName: undefined,
      brand: undefined,
      model: undefined,
      cnMeterial: undefined,
      enMeterial: undefined,
      cnUsage: undefined,
      enUsage: undefined,
      remarks: undefined
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
    this.queryAll()
  }
}
</script>

<style lang="scss" scoped>
.code-form {
  .el-form-item {
    display: inline-block;
    width: 28%;
  }
}
.edit-form {
  .el-form-item {
    display: inline-block;
    width: 49.9%;
  }
}
.item-word {
  text-overflow: ellipsis;
  overflow: hidden;
}
.item-after-icon {
  position: relative;
  padding-bottom: 5px;
  .item-icon-plus {
    position: absolute;
    top: 6px;
    color:#409eff;
    font-size:18px;
    margin-left:10px;
    cursor:pointer;
  }
  .item-icon-reduce {
    position: absolute;
    top: 6px;
    color:#f56c6c;
    font-size:18px;
    margin-left:10px;
    cursor:pointer;
  }
}
</style>
