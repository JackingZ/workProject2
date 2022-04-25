<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="成本项目"
        />
        <div class="app-panel">
          <div>
            <el-row>
              <!-- <el-col :span="6">
                <el-button
                  v-permission="['qadd']"
                  type="text"
                  icon="el-icon-circle-plus-outline"
                  style="margin-left: 10px"
                  @click="saveCostitemData"
                >
                  新增成本项目
                </el-button>
              </el-col> -->
              <el-col
                :span="24"
                style="text-align:right;"
              >
                <el-select
                  v-model="selectValue.serviceTypeId"
                  placeholder="服务类型"
                  clearable
                  filterable
                  style="width:130px;margin-right:5px;"
                  size="small"
                  @change="onReset('SELECT_TYPE')"
                >
                  <el-option
                    v-for="item in serviceTypeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                <el-select
                  v-model="selectValue.typeId"
                  placeholder="项目类型"
                  :disabled="!selectValue.serviceTypeId"
                  clearable
                  filterable
                  style="width:130px;margin-right:5px;"
                  size="small"
                >
                  <el-option
                    v-for="item in costitemTypeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>

                <el-input
                  v-model="selectValue.name"
                  size="small"
                  clearable
                  style="width:180px;margin-right:10px;"
                  placeholder="请输入成本项目关键字"
                />
                <el-button
                  v-permission="['qquery']"
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
                label="项目中文名称"
                prop="name"
              />

              <el-table-column
                label="项目英文名称"
                prop="alias"
              />

              <el-table-column
                label="服务类型"
                width="120"
                prop="serviceTypeName"
              />

              <el-table-column
                label="项目类型"
                width="120"
              >
                <template slot-scope="scope">
                  {{ (scope.row.types || []).map(item => item.typeName).join(',') || '--' }}
                </template>
              </el-table-column>
              <el-table-column
                label="结算单位"
                width="120"
                prop="settlement"
              >
                <template slot-scope="scope">
                  {{ (settlementList.find(item => item.id === scope.row.settlement) || {}).name || "--" }}
                </template>
              </el-table-column>

              <el-table-column
                label="发票描述"
                prop="invoice"
              />

              <el-table-column
                label="备注"
                prop="remark"
              />

              <!-- <el-table-column
                label="操作"
                fixed="right"
                width="180"
              >
                <template slot-scope="scope">
                  <el-button
                    v-permission="['qedit']"
                    type="text"
                    @click="toEditForm(scope.row)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    v-permission="['qdel']"
                    type="text"
                    @click="deleteData(scope.row)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column> -->
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
              :title="isEdit ? '编辑成本项目' : '新增成本项目'"
              :visible.sync="isAddEditVisible"
              :close-on-click-modal="false"
              width="600px"
              @closed="close"
            >
              <div>
                <el-form
                  ref="editForm"
                  v-loading="dialogLoading"
                  :model="selectForm"
                  :rules="formRules"
                  size="small"
                  label-width="130px"
                  label-position="right"
                  style="padding-right: 20px;"
                >
                  <el-form-item
                    label="项目中文名称"
                    prop="name"
                  >
                    <el-input
                      ref="firstInput"
                      v-model="selectForm.name"
                      :maxlength="20"
                      placeholder="请输入"
                    />
                  </el-form-item>
                  <el-form-item
                    label="项目英文名称"
                    prop="alias"
                  >
                    <el-input
                      v-model="selectForm.alias"
                      :maxlength="50"
                      placeholder="请输入"
                    />
                  </el-form-item>
                  <el-form-item
                    label="服务类型"
                    prop="serviceTypeId"
                  >
                    <el-select
                      v-model="selectForm.serviceTypeId"
                      clearable
                      filterable
                      style="width:100%;"
                      placeholder="请选择"
                      @change="onReset('FORM_TYPE')"
                    >
                      <el-option
                        v-for="item in serviceTypeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="项目类型"
                    prop="typeList"
                  >
                    <el-select
                      v-model="selectForm.typeList"
                      clearable
                      multiple
                      :disabled="!selectForm.serviceTypeId"
                      style="width:100%;"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in costitemTypeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="结算单位"
                    prop="settlement"
                  >
                    <el-select
                      v-model="selectForm.settlement"
                      clearable
                      filterable
                      style="width:100%;"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in settlementList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="发票描述"
                    prop="invoice"
                  >
                    <el-input
                      v-model="selectForm.invoice"
                      :maxlength="100"
                      placeholder="请输入"
                    />
                  </el-form-item>
                  <el-form-item
                    label="备注"
                  >
                    <el-input
                      v-model="selectForm.remark"
                      :maxlength="100"
                      placeholder="请输入"
                    />
                  </el-form-item>
                  <el-form-item
                    v-if="selectForm.serviceTypeId === '04'"
                    label="是否按区间计费"
                    prop="ranging"
                  >
                    <el-select
                      v-model="selectForm.ranging"
                      clearable
                      style="width:100%;"
                      placeholder="请选择"
                    >
                      <el-option
                        label="是"
                        :value="true"
                      />
                      <el-option
                        label="否"
                        :value="false"
                      />
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
              <div
                slot="footer"
                class="dialog-footer"
              >
                <el-button @click="close">
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
          </div>
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
  getCostitemList,
  getCostitemTypeList,
  getUmBySettlement,
  getServiceTypeList,
  deleteCostitem,
  saveCostitem
} from '@/api/operating-cost-projects'

@Component({
  name: 'ProjectsCost',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private dialogShow: boolean = false
  private dialogLoading: boolean = false
  private isEdit: boolean = false
  private isAddEditVisible: boolean = false

  private tableData: any = []
  private serviceTypeList: any[] = []
  private costitemTypeList: any[] = []
  private umBySettlement: any[] = []
  private settlementList: any[] = [
    {
      id: '0',
      name: '按重量'
    },
    {
      id: '1',
      name: '按体积'
    },
    {
      id: '2',
      name: '按金额'
    },
    {
      id: '3',
      name: '按票'
    },
    {
      id: '4',
      name: '按箱'
    },
    {
      id: '5',
      name: '按车'
    },
    {
      id: '6',
      name: '按柜'
    },
    {
      id: '7',
      name: '按里程'
    },
    {
      id: '8',
      name: '按时间'
    },
    {
      id: '9',
      name: '按托'
    },
    {
      id: 'A',
      name: '按个数'
    }
  ]

  private selectValue: any = {
    serviceTypeId: undefined, // 服务类型
    typeId: undefined, // 项目类型
    name: undefined // 关键字
  }
  private selectForm: any = {
    name: undefined, // 项目中文名称
    alias: undefined, // 项目英文名称
    serviceTypeId: undefined, // 服务类型
    serviceTypeName: undefined,
    typeList: [], // 项目类型
    settlement: undefined, // 结算单位
    umId: undefined, // 计量单位
    umName: undefined,
    invoice: undefined, // 发票描述
    remark: undefined, // 备注
    ranging: undefined // 是否按区间计费 仓储独有
  }
  private formRules = {
    name: [
      { required: true, message: '项目中文名称不能为空', trigger: 'blur' },
      { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
    ],
    alias: [
      { required: true, message: '项目英文名称不能为空', trigger: 'blur' },
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
    serviceTypeId: [
      { required: true, message: '请选择服务类型', trigger: 'change' }
    ],
    typeList: [{ required: true, message: '请选择项目类型', trigger: 'change' }],
    settlement: [
      { required: true, message: '请选择结算单位', trigger: 'change' }
    ],
    umId: [{ required: true, message: '请选择计量单位', trigger: 'change' }],
    invoice: [{ required: true, message: '发票描述不能为空', trigger: 'blur' }],
    ranging: [{ required: true, message: '请选择是否按区间计费', trigger: 'change' }]
  }

  private currentId = ''
  private page: number = 1
  private size: number = 10
  private total: any = 0

  /* computed */

  // 所属公司id
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }

  // 所属公司Name
  get custName(): string {
    const info = UserModule.info || {}
    const custName = (info as any).custName
    return custName
  }

  /* methods */
  // 获取表格数据
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
    getCostitemList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.tableData = data.result || []
        this.total = data.total
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

  private getServiceTypeList() {
    // const custId: any = this.custId
    const params = {
      page: 1,
      size: 9999
    }

    getServiceTypeList(params).then((res:any) => {
      const data = res.data || {}
      this.serviceTypeList = data.result || []
    }).catch((err:any) => {
      return err
    })
  }

  private async getCostitemTypeList(serviceTypeId: any) {
    const params = {
      typeId: serviceTypeId,
      page: 1,
      size: 9999
    }

    await getCostitemTypeList(params).then((res:any) => {
      this.costitemTypeList = res.data || []
    }).catch((err:any) => {
      return err
    })
  }

  private async getUmBySettlement(settlement: any) {
    const params = {
      settlement
    }

    await getUmBySettlement(params).then((res:any) => {
      this.umBySettlement = res.data || []
    }).catch((err:any) => {
      return err
    })
  }

  private onReset(action: string): void {
    switch (action) {
      case 'FORM_TYPE': {
        this.selectForm.typeList = []
        this.costitemTypeList = []
        this.selectForm.ranging = ''
        const { serviceTypeId } = this.selectForm
        if (serviceTypeId) {
          this.selectForm.serviceTypeName = this.findByKeyValueReturnAnotherKeyValue(this.serviceTypeList, 'id', serviceTypeId, 'name')
          this.getCostitemTypeList(serviceTypeId).catch(error => error)
        }
        break
      }
      case 'SELECT_TYPE': {
        this.selectValue.typeId = ''
        this.costitemTypeList = []
        const { serviceTypeId } = this.selectValue
        if (serviceTypeId) {
          this.getCostitemTypeList(serviceTypeId).catch(error => error)
        }
        break
      }
      case 'FORM_UM': {
        this.selectForm.umId = ''
        this.umBySettlement = []
        const { settlement } = this.selectForm
        if (settlement) {
          this.getUmBySettlement(settlement).catch(error => error)
        }
        break
      }
      default:
        break
    }
  }

  private findByKeyValueReturnAnotherKeyValue(
    theList: any,
    findKey: string,
    findKeyValue: any,
    returnKey: string
  ) {
    return (theList.find((item: any) => item[findKey] === findKeyValue) || {})[returnKey]
  }

  // 新增
  private saveCostitemData(): void {
    this.isEdit = false
    this.isAddEditVisible = true
    this.$nextTick(() => {
      const ele:any = this.$refs.firstInput
      ele.focus()
    })
  }

  // 编辑
  private toEditForm(row: any): void {
    this.currentId = row.id
    const {
      name,
      alias,
      serviceTypeId,
      serviceTypeName,
      types,
      umId,
      umName,
      invoice,
      remark,
      settlement,
      ranging
    } = row
    const typeList = types.map((item: any) => item.typeId).filter((item: any) => !!item) || []
    this.selectForm = {
      name,
      alias,
      serviceTypeId,
      serviceTypeName,
      typeList,
      umId,
      umName,
      invoice,
      remark,
      settlement,
      ranging
    }

    this.dialogLoading = true
    Promise.all([
      this.getCostitemTypeList(this.selectForm.serviceTypeId)
      // this.getUmBySettlement(this.selectForm.settlement)
    ]).then(() => {
      this.dialogLoading = false
    }).catch(() => {
      this.dialogLoading = false
    })

    this.isEdit = true
    this.isAddEditVisible = true
  }

  private deleteData(row: any) {
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
        deleteCostitem(params)
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

  // 提交保存
  private saveConfirm() {
    (this.$refs.editForm as any).validate((valid: any) => {
      if (valid) {
        this.dialogLoading = true
        const { typeList } = this.selectForm
        const types = typeList.map((item: any) => {
          const { costitemTypeList = [] } = this
          return {
            typeId: item,
            typeName: costitemTypeList.find((c: any) => c.id === item).name || ''
          }
        })
        const params: any = {
          ...this.selectForm,
          ...{ types }
        }
        delete params.typeList
        if (this.isEdit) {
          params.id = this.currentId
        }

        saveCostitem(params)
          .then(res => {
            this.close()
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.queryAll()
            this.dialogLoading = false
          })
          .catch(err => {
            this.dialogLoading = false
            return err
          })
      } else {
        return false
      }
    }
    )
  }

  // 关闭dialog重置表单
  private close(): void {
    this.isAddEditVisible = false
    this.isEdit = false
    this.currentId = ''
    this.reset()
  }

  // 重置表单
  private reset(): void {
    this.selectForm = {
      name: undefined, // 项目中文名称
      alias: undefined, // 项目英文名称
      serviceTypeId: undefined, // 服务类型
      serviceTypeName: undefined,
      typeList: [],
      settlement: undefined, // 结算单位
      umId: undefined, // 计量单位
      umName: undefined,
      invoice: undefined, // 发票描述
      remark: undefined, // 备注
      ranging: undefined // 是否按区间计费 仓储独有

    }
    this.clearValidate()
  }

  private clearValidate() {
    const editForm: any = this.$refs.editForm
    this.$nextTick(() => {
      editForm.clearValidate()
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

  private created(): void {
    this.getServiceTypeList()
    this.queryAll()
  }
}
</script>

<style lang="scss" scoped>
</style>
