<template>
  <div class="roles-container">
    <div
      v-loading="loading"
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          title="通知管理"
          info=""
        />
        <div
          class="app-panel"
        >
          <el-table
            ref="tables"
            :data="tableData"
            row-key="id"
            height="calc(100vh - 250px)"
            style="width: 100%;margin-bottom: 10px;"
            border
          >
            <el-table-column
              prop="msgType"
              label="通知类型"
              width="120"
            />
            <el-table-column
              prop="msgSubType"
              label="通知项"
              width="180"
              show-overflow-tooltip
            />
            <el-table-column
              prop=""
              label=""
            >
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.isJuCheck"
                  :disabled="(scope.row.juList || []).length <= 0"
                  @change="checkChange(scope.row, $event, '0')"
                >
                  聚货通
                </el-checkbox>
                <el-button
                  type="text"
                  @click="onSign(scope.row, '0')"
                >
                  服务({{ (scope.row.juList || []).length }})
                </el-button>
                <span style="border: 1px solid #ccc;margin: 0 30px;" />
                <el-checkbox
                  v-model="scope.row.isGoCheck"
                  :disabled="(scope.row.goList || []).length <= 0"
                  @change="checkChange(scope.row, $event, '3')"
                >
                  供应商
                </el-checkbox>
                <el-button
                  type="text"
                  @click="onSign(scope.row, '3')"
                >
                  服务({{ (scope.row.goList || []).length }})
                </el-button>
                <span style="border: 1px solid #ccc;margin: 0 30px;" />
                <el-checkbox
                  v-model="scope.row.isDaiCheck"
                  :disabled="(scope.row.daiList || []).length <= 0"
                  @change="checkChange(scope.row, $event, '2')"
                >
                  代理商
                </el-checkbox>
                <el-button
                  type="text"
                  @click="onSign(scope.row, '2')"
                >
                  服务({{ (scope.row.daiList || []).length }})
                </el-button>
                <span style="border: 1px solid #ccc;margin: 0 30px;" />
                <el-checkbox
                  v-model="scope.row.isKeCheck"
                  :disabled="(scope.row.keList || []).length <= 0"
                  @change="checkChange(scope.row, $event, '1')"
                >
                  客户
                </el-checkbox>
                <el-button
                  type="text"
                  @click="onSign(scope.row, '1')"
                >
                  服务({{ (scope.row.keList || []).length }})
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="通知模版"
              width="160"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="editRow(scope.row)"
                >
                  通知模版
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-dialog
            :title="title"
            :visible="dialogVisible"
            width="600px"
            :close-on-click-modal="false"
            @close="cancel"
          >
            <div v-loading="dialogloading">
              <el-form
                ref="selectForm"
                :model="selectForm"
                :rules="formRules"
                label-width="110px"
                label-position="right"
              >
                <el-form-item
                  label="模板标题"
                  prop="templateTitle"
                >
                  <el-input
                    v-model="selectForm.templateTitle"
                    placeholder="请输入"
                    :maxlength="20"
                  />
                </el-form-item>
                <el-form-item
                  label="模板内容"
                  prop="templateContent"
                >
                  <el-input
                    v-model="selectForm.templateContent"
                    type="textarea"
                    :autosize="{minRows: 2, maxRows: 4}"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-form>
              <div
                slot="footer"
                style="text-align: right;padding: 10px 20px 0;"
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
                  @click="saveTemplate"
                >
                  确 定
                </el-button>
              </div>
            </div>
          </el-dialog>

          <el-dialog
            :title="'关联服务' + '【' + title +'】'"
            :visible.sync="dialogService"
            :close-on-click-modal="false"
            width="960px"
            @close="close"
          >
            <el-transfer
              ref="transferItem"
              v-model="serviceOption"
              v-loading="dialogloading"
              filterable
              :filter-method="filterMethod"
              :titles="['服务', '已选择']"
              :props="{key: 'id', label: 'name'}"
              filter-placeholder="输入搜索"
              :data="serviceList"
              style="height: 500px;"
            />
            <div
              slot="footer"
              style="text-align: right;margin: 0 40px 0;"
            >
              <el-button
                size="small"
                @click="close"
              >
                取 消
              </el-button>

              <el-button
                type="primary"
                size="small"
                @click="saveService"
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
  getManageList,
  updateTemplate,
  updateManage,
  getServiceTypeList
} from '@/api/system-in-notice-config'

@Component({
  name: '',
  components: {},
  props: {}
})
export default class extends Vue {
  /** data */
  private tableData: any[] = []
  private serviceList: any[] = []
  private serviceOption: any[] = []
  private selectForm: any = {
    templateTitle: '',
    templateContent: ''
  }
  private formRules = {
    templateTitle: [
      { required: true, message: '模板标题不能为空', trigger: 'blur' }
    ],
    templateContent: [
      { required: true, message: '模板内容不能为空', trigger: 'blur' }
    ]
  }
  private checkObj: any = {}
  private isType = ''
  private loading: boolean = false
  private dialogloading: boolean = false
  private dialogVisible: boolean = false
  private dialogService: boolean = false
  private title: any = ''

  /** computed */

  /** methods */
  private created() {
    this.queryAll()
  }

  private queryAll() {
    this.loading = true
    getManageList({
      page: 1,
      size: 999
    }).then((res: any) => {
      const data = res.data || {}
      const list = data.result || []
      this.tableData = list.map((it: any) => {
        const { isJuCheck, isGoCheck, isDaiCheck, isKeCheck, ...obj } = it
        return {
          ...obj,
          isJuCheck: isJuCheck === 1,
          isGoCheck: isGoCheck === 1,
          isDaiCheck: isDaiCheck === 1,
          isKeCheck: isKeCheck === 1
        }
      })
      this.loading = false
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }

  private editRow(row: any) {
    const { templateTitle, templateContent, subTypeId, msgType, msgSubType } = row
    this.title = msgType + '-' + msgSubType
    this.selectForm = {
      templateTitle,
      templateContent,
      unqId: subTypeId
    }
    this.dialogVisible = true
  }
  private filterMethod(query: any, item: any): boolean {
    const name = item.name || ''
    return name.indexOf(query) > -1
  }
  private onSign(row: any, str: string) {
    const { juList, goList, daiList, keList } = row
    if (str === '0') {
      this.title = '聚货通'
      this.serviceOption = juList.map((it: any) => it.serviceId)
    } else if (str === '1') {
      this.title = '客户'
      this.serviceOption = keList.map((it: any) => it.serviceId)
    } else if (str === '2') {
      this.title = '代理商'
      this.serviceOption = daiList.map((it: any) => it.serviceId)
    } else if (str === '3') {
      this.title = '供应商'
      this.serviceOption = goList.map((it: any) => it.serviceId)
    }
    this.checkObj = row
    this.isType = str
    this.dialogService = true
    this.getServiceTypeData()
  }
  private getServiceTypeData() {
    this.dialogloading = true
    getServiceTypeList({
      custType: this.isType
    })
      .then((res: any) => {
        this.serviceList = res.data || []
        this.dialogloading = false
      })
      .catch((err: any) => {
        this.dialogloading = false
        return err
      })
  }

  private close() {
    this.serviceOption = []
    this.dialogService = false
    this.title = ''
    this.checkObj = {}
    this.isType = ''
  }
  private saveService() {
    const arr = this.serviceOption.map((s: any) => {
      const item = this.serviceList.find((it: any) => s === it.id) || {}
      return {
        serviceId: item.id,
        serviceName: item.name
      }
    }).filter((it: any) => it.serviceId && it.serviceName)
    this.dialogloading = true
    this.updateService(this.checkObj, this.isType, arr)
  }

  private checkChange(row: any, el: any, str: string) {
    this.loading = true
    this.updateService(row, str)
  }

  private updateService(row: any, str: string, data?: any) {
    const { isJuCheck, isGoCheck, isDaiCheck, isKeCheck, juList, goList, daiList, keList, subTypeId, id } = row
    let params: any = {}
    if (str === '0') {
      params = {
        customerType: str,
        isCheck: isJuCheck ? 1 : 0,
        serviceList: data || juList,
        unqId: subTypeId,
        id
      }
    } else if (str === '1') {
      params = {
        customerType: str,
        isCheck: isKeCheck ? 1 : 0,
        serviceList: data || keList,
        unqId: subTypeId,
        id
      }
    } else if (str === '2') {
      params = {
        customerType: str,
        isCheck: isDaiCheck ? 1 : 0,
        serviceList: data || daiList,
        unqId: subTypeId,
        id
      }
    } else if (str === '3') {
      params = {
        customerType: str,
        isCheck: isGoCheck ? 1 : 0,
        serviceList: data || goList,
        unqId: subTypeId,
        id
      }
    }
    updateManage(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.dialogloading = false
        this.loading = false
        this.close()
        this.queryAll()
      })
      .catch((err: any) => {
        this.dialogloading = false
        this.loading = false
        return err
      })
  }
  private cancel() {
    this.selectForm = {
      templateTitle: '',
      templateContent: ''
    }
    this.title = ''
    this.dialogVisible = false
    const editForm: any = this.$refs.selectForm
    this.$nextTick(() => {
      editForm.clearValidate()
    })
  }
  private saveTemplate() {
    const editForm: any = this.$refs.selectForm
    editForm.validate((valid: any) => {
      if (!valid) return false
      this.dialogloading = true
      updateTemplate(this.selectForm)
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.dialogloading = false
          this.cancel()
          this.queryAll()
        })
        .catch((err: any) => {
          this.dialogloading = false
          return err
        })
    })
  }
}
</script>

<style lang="scss" scoped>
.notice-title {
  background-color: #fafafa;
  height: 40px;
  line-height: 40px;
}
.custom-tree-node {
  width: 100%;
}

::v-deep .el-tree-node__content {
  width: 100%;
}

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
