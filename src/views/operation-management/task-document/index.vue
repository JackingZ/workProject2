<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="任务单证"
        />
        <div class="app-panel">
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-input
                v-model="selectValue.name"
                size="small"
                style="width:300px;margin-right:10px;"
                placeholder="请输入"
              >
                <template slot="prepend">
                  任务单名称
                </template>
              </el-input>
              <el-button
                v-permission="['ttskQuery']"
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
              label="任务单名称"
            />
            <el-table-column
              prop="time"
              label="任务时长(分钟)"
            />
            <el-table-column
              prop="serviceTypeName"
              label="关联服务大类"
            />
            <el-table-column
              prop="updateTime"
              label="添加时间"
            />
            <el-table-column
              fixed="right"
              width="150"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['ttskUpdate']"
                  type="text"
                  @click="handleEdit(scope.row)"
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
            title="编辑任务单"
            :visible.sync="isAddEditVisible"
            :close-on-click-modal="false"
            width="600px"
            @closed="cancel"
          >
            <el-form
              ref="editForm"
              v-loading="formLoading"
              :model="selectForm"
              :rules="formRules"
              style="padding-right: 20px;"
              label-width="110px"
              label-position="right"
              size="small"
            >
              <el-form-item
                label="任务单名称"
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
                label="任务时间"
                prop="time"
              >
                <div class="input-capacity">
                  <div style="flex: 1;">
                    <el-input-number
                      v-model="selectForm.time"
                      class="input-number-valiate input-border"
                      :controls="false"
                      placeholder="请输入"
                      :min="0"
                      :max="9999"
                      :precision="2"
                    />
                  </div>
                  <div class="input-unit">
                    分钟
                  </div>
                </div>
              </el-form-item>
              <!-- <el-form-item
                label="时间单位"
                prop="unit"
              >
                <el-select
                  v-model="selectForm.unit"
                  placeholder="请选择"
                  style="width: 100%;"
                >
                  <el-option
                    label="分"
                    value="2"
                  />
                </el-select>
              </el-form-item> -->
              <el-form-item
                label="关联服务大类"
                prop="serviceTypeId"
              >
                <el-select
                  v-model="selectForm.serviceTypeId"
                  style="width: 100%;"
                  placeholder="请选择"
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
                label="备注"
              >
                <el-input
                  v-model="selectForm.remark"
                  maxlength="100"
                  placeholder="请输入"
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
                @click="confirm"
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
  getTaskList,
  updateTask,
  getServiceTypeList
} from '@/api/operation-of-task-document'

@Component({
  name: 'Port',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private tableData: any[] = []
  private selectValue: any = {
    name: ''
  }
  private selectForm: any = {
    name: undefined,
    time: undefined,
    unit: '2',
    serviceTypeId: undefined,
    remark: undefined
  }
  private formRules: any = {
    name: [
      { required: true, message: '任务单名称不能为空', trigger: 'blur' }
    ],
    time: [{ required: true, message: '任务时间不能为空', trigger: 'blur' }],
    serviceTypeId: [{ required: true, message: '请选择服务大类', trigger: 'change' }]
  }
  private page: number = 1
  private size: number = 10
  private total: any = 0
  private serviceTypeList: any[] = []
  private isAddEditVisible: boolean = false
  private formLoading: boolean = false
  /* computed */

  /* methods */

  private handleEdit(row: any) {
    this.isAddEditVisible = true
    this.selectForm = { ...row }
  }
  private cancel() {
    this.isAddEditVisible = false
    this.selectForm = {
      name: undefined,
      time: undefined,
      unit: '2',
      serviceTypeId: undefined,
      remark: undefined
    }
    this.$nextTick(() => {
      const form:any = this.$refs.editForm
      form.clearValidate()
    })
  }
  private confirm() {
    const editForm:any = this.$refs.editForm
    editForm.validate((valid:any) => {
      if (!valid) return false
      this.formLoading = true
      const params = {
        ...this.selectForm
      }
      this.serviceTypeList.map((it: any) => {
        if (params.serviceTypeId === it.id) {
          params.serviceTypeName = it.name
        }
      })
      updateTask(params)
        .then((res:any) => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.formLoading = false
          this.cancel()
          this.queryAll()
        }).catch((err:any) => {
          this.formLoading = false
          return err
        })
    })
  }
  private getServiceTypeList() {
    const custType: any = '1'
    const params = {
      custType
    }
    getServiceTypeList(params)
      .then((res: any) => {
        const data = res.data || []
        this.serviceTypeList = data
      })
      .catch((err: any) => {
        return err
      })
  }
  private queryAll(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const params: any = {
      name: this.selectValue.name,
      page: this.page,
      size: this.size
    }
    getTaskList(params)
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

  private created(): void {
    this.queryAll()
    this.getServiceTypeList()
  }
}
</script>

<style lang="scss" scoped>
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
.input-capacity {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.input-unit {
  width: 60px;
  height: 32px;
  background-color: #f5f7fa;
  color: #909399;
  padding: 0 10px;
  border: 1px solid #dcdfe6;
  border-left: 0;
  border-radius: 0 4px 4px 0;
  margin-left: -1px;
}
.input-border {
  ::v-deep .el-input__inner {
    border-radius: 4px 0 0 4px;
  }
}
</style>
