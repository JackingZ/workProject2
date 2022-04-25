<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="服务设置"
        />
        <div class="app-panel">
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-button
                type="text"
                icon="el-icon-circle-plus-outline"
                style="float: left;"
                @click="handleBatchSet"
              >
                批量设置
              </el-button>
              <el-button
                type="text"
                icon="el-icon-circle-plus-outline"
                style="float: left;"
                @click="handleDefaultTemplate"
              >
                默认模板
              </el-button>
              <el-select
                v-model="selectValue.cas"
                style="width:120px;margin-right:5px;"
                placeholder="公司类型"
                size="small"
                @change="getCustTypeList(1)"
              >
                <el-option
                  v-for="(item, index) in csList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.typeId"
                size="small"
                clearable
                filterable
                style="width:120px;margin-right:5px;"
                placeholder="服务大类"
                @change="onReset"
              >
                <el-option
                  v-for="item in serviceTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.subtypeId"
                :loading="subTypeLoading"
                size="small"
                clearable
                filterable
                style="width:120px;margin-right:5px;"
                placeholder="服务类型"
                @focus="getSubtypeList"
              >
                <el-option
                  v-for="item in serviceSubtypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-input
                v-model="selectValue.custName"
                size="small"
                style="width:300px;margin-right:10px;"
                placeholder="请输入"
              >
                <template slot="prepend">
                  公司名称
                </template>
              </el-input>
              <el-button
                type="primary"
                size="small"
                @click="getCustTypeList(1)"
              >
                查询
              </el-button>
            </el-col>
          </el-row>

          <el-table
            ref="batchSelectTable"
            v-loading="loading"
            :data="tableData"
            height="calc(100vh - 313px)"
            style="width: 100%;margin: 10px 0;"
            border
            @selection-change="handleBatchSelection"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              prop="custName"
              label="公司名称"
              min-width="120"
            />
            <el-table-column
              prop="total"
              label="已开通数"
              width="120"
            />
            <el-table-column
              prop="types"
              label="服务大类"
              min-width="120"
            />
            <el-table-column
              prop="createTime"
              label="添加时间"
              width="180"
            />
            <el-table-column
              fixed="right"
              width="150"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleServiceSet(scope.row)"
                >
                  设置服务
                </el-button>
                <!-- <el-button
                  type="text"
                  @click="handleCheck(scope.row)"
                >
                  审核
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
            :title="title"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            width="1000px"
            @close="cancel"
          >
            <div v-loading="subLoading">
              <div style="text-align: right;">
                <el-select
                  v-if="status === '0'"
                  v-model="cas"
                  style="width:150px;"
                  placeholder="公司类型"
                  @change="getTypeTemplateList(cas)"
                >
                  <el-option
                    v-for="(item, index) in csList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </div>
              <el-table
                ref="serviceSelectTable"
                :data="subTableData"
                height="500px"
                style="width: 100%;margin: 10px 0;"
                border
                @selection-change="handleServiceSelection"
              >
                <el-table-column
                  prop="typeName"
                  label="服务大类"
                />
                <el-table-column
                  prop="subtypeName"
                  label="服务类型"
                />
                <el-table-column
                  label="国家/地区"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="cxr"
                      :placeholder="`已选择(${(scope.row.countries || []).length})`"
                      style="width:100%"
                      disabled
                    >
                      <el-button
                        slot="append"
                        icon="el-icon-search"
                        @click="handleCountry(scope.row, scope.$index)"
                      />
                    </el-input>
                  </template>
                </el-table-column>
                <!-- <el-table-column
                  prop="msg"
                  label="简介描述"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.msg"
                      size="small"
                      clearable
                      style="width:100%;"
                      placeholder="请输入"
                    />
                  </template>
                </el-table-column> -->
                <el-table-column
                  v-if="status !== '0'"
                  type="selection"
                  width="55"
                />
              </el-table>
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
                :loading="subLoading"
                @click="saveConfirm"
              >
                确 定
              </el-button>
            </div>
          </el-dialog>

          <el-dialog
            title="国家/地区"
            :visible.sync="countryShow"
            :close-on-click-modal="false"
            width="960px"
            append-to-body
            @close="closeCountry"
          >
            <el-transfer
              ref="transferItem"
              v-model="countryIds"
              v-loading="countryLoading"
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
                @click="closeCountry"
              >
                取 消
              </el-button>

              <el-button
                type="primary"
                size="small"
                @click="countryConfirm"
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
  getCustTypeList,
  getCustTypeDtlList,
  getTypeTemplateList,
  saveTypeTemplateList,
  saveCustType,
  getCountryList,
  getServiceTypeList,
  getServiceSubtypeList
} from '@/api/operation-of-service-setup'

@Component({
  name: 'Port',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private subLoading: boolean = false
  private dialogVisible: boolean = false
  private subTypeLoading: boolean = false
  private countryLoading: boolean = false
  private countryShow: boolean = false
  private title: string = ''
  private status: string = ''
  private cxr = ''
  private countryIds: any[] = []
  private countryIdx: number = 0
  private tableData: any[] = []
  private subTableData: any[] = []
  private custData: any[] = []
  private serviceData: any[] = []
  private countryList: any[] = []
  private serviceSubtypeList: any[] = []
  private serviceTypeList: any[] = []
  private csList: any[] = [
    { name: '供应商', id: 'S' },
    { name: '代理商', id: 'A' }
    // { name: '客户', id: 'C' }
  ]
  private selectValue: any = {
    cas: 'S',
    typeId: undefined,
    subtypeId: undefined,
    custName: undefined
  }
  private cas = 'S'
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
  // 获取国家列表
  private getCountryList() {
    getCountryList()
      .then((res: any) => {
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
      })
      .catch((err: any) => {
        return err
      })
  }
  // 获取服务大类
  private getServiceTypeList() {
    const custType: any = '1'
    const params = {
      custType
    }

    getServiceTypeList(params)
      .then((res: any) => {
        this.serviceTypeList = res.data
      })
      .catch((err: any) => {
        return err
      })
  }
  private onReset() {
    this.selectValue.subtypeId = undefined
    this.serviceSubtypeList = []
  }
  // 获取服务小类
  private getSubtypeList() {
    this.subTypeLoading = true
    const params = {
      typeId: this.selectValue.typeId
    }
    getServiceSubtypeList(params)
      .then((res: any) => {
        this.serviceSubtypeList = res.data || []
        this.subTypeLoading = false
      })
      .catch((err: any) => {
        this.subTypeLoading = false
        return err
      })
  }

  // 批量勾选
  private handleBatchSelection(val: any) {
    this.custData = val.map((item: any) => {
      const { custId, custName } = item
      const it = {
        custName,
        custId,
        cas: this.selectValue.cas
      }
      return it
    })
    this.custData.filter((it: any) => it.custId && it.custName)
  }
  private handleServiceSelection(val: any) {
    this.serviceData = val
  }

  // 批量设置
  private handleBatchSet(): void {
    if (this.custData.length <= 0) {
      this.$message.error('请先勾选需要设置的公司')
      return
    }
    this.title = '批量设置'
    this.status = '1'
    this.getTypeTemplateList(this.selectValue.cas)
    this.dialogVisible = true
  }
  // 默认模板
  private handleDefaultTemplate(): void {
    this.title = '默认模板'
    this.status = '0'
    this.getTypeTemplateList(this.cas)
    this.dialogVisible = true
  }

  // 设置服务
  private handleServiceSet(row: any): void {
    this.title = '设置服务'
    this.status = '2'
    this.custData = [
      {
        custId: row.custId,
        custName: row.custName,
        cas: this.selectValue.cas
      }
    ]
    this.getCustTypeDtlList(row.custId)
    this.dialogVisible = true
  }
  // 审核
  private handleCheck(row: any): void {
    this.title = '审核'
    this.status = '3'
    this.dialogVisible = true
  }

  // 穿梭框
  private handleCountry(row: any, index: any): void {
    this.countryShow = true
    this.countryIdx = index
    const arr = row.countries || []
    this.countryIds = []
    arr.map((it: any) => {
      this.countryIds.push(it.id)
    })
  }
  private closeCountry() {
    this.countryShow = false
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
  }
  private countryConfirm(): void {
    this.closeCountry()
    const arr = this.countryIds.map((it: any) => {
      return this.countryList.find((item: any) => it === item.id)
    })
    this.subTableData[this.countryIdx].countries = arr
  }
  private filterMethod(query: any, item: any): boolean {
    return item.name.indexOf(query) > -1
  }

  // 获取配置
  private getCustTypeDtlList(id: any): void {
    this.subLoading = true
    const params: any = {
      custId: id,
      cas: this.selectValue.cas
    }
    getCustTypeDtlList(params)
      .then((res: any) => {
        this.subLoading = false
        this.subTableData = res.data || []
        if (this.status === '2') {
          this.subTableData.map((it: any) => {
            if (it.setted) {
              this.$nextTick(() => {
                const root: any = this.$refs.serviceSelectTable
                root.toggleRowSelection(it, true)
              })
            }
          })
        }
      })
      .catch((err: any) => {
        this.subLoading = false
        return err
      })
  }
  // 获取默认模板
  private getTypeTemplateList(val: any): void {
    this.subLoading = true
    const params: any = {
      cas: val
    }
    getTypeTemplateList(params)
      .then((res: any) => {
        this.subLoading = false
        this.subTableData = res.data || []
      })
      .catch((err: any) => {
        this.subLoading = false
        return err
      })
  }

  // 关闭dialog重置表单
  private cancel() {
    this.dialogVisible = false
    this.custData = []
    this.serviceData = []
    const rootS: any = this.$refs.serviceSelectTable
    rootS.clearSelection()
    const rootB: any = this.$refs.batchSelectTable
    rootB.clearSelection()
  }

  // 提交保存
  private saveConfirm() {
    if (this.status === '0') {
      this.subLoading = true
      const sttp: any = {
        cas: this.cas,
        entities: this.subTableData
      }
      saveTypeTemplateList(sttp)
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.dialogVisible = false
          this.subLoading = false
          this.getCustTypeList()
        })
        .catch((err: any) => {
          this.subLoading = false
          return err
        })
    } else if (this.status === '1' || this.status === '2') {
      if (this.serviceData.length <= 0) {
        this.$message.error('请先勾选需要设置的服务')
        return
      }
      const isCtr = this.serviceData.some((it: any) => it.countries.length <= 0)
      if (isCtr) {
        this.$message.error('勾选的服务中必须选择国家/地区')
        return
      }
      if (this.status === '2') {
        this.serviceData.map((it: any) => {
          if (Array.isArray(it.countries) && it.countries.length > 0) {
            it.setted = true
          }
        })
      }
      this.subLoading = true
      const parm: any = {
        custs: this.custData,
        entities: this.serviceData
      }
      saveCustType(parm)
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.dialogVisible = false
          this.subLoading = false
          this.custData = []
          this.serviceData = []
          const rootB: any = this.$refs.batchSelectTable
          rootB.clearSelection()
          const rootS: any = this.$refs.serviceSelectTable
          rootS.clearSelection()
          this.getCustTypeList()
        })
        .catch((err: any) => {
          this.subLoading = false
          return err
        })
    }
  }
  // 获取服务列表
  private getCustTypeList(val?: any): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const params: any = {
      ...this.selectValue,
      page: this.page,
      size: this.size
    }
    getCustTypeList(params)
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
    this.getCustTypeList()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.getCustTypeList()
  }

  private created(): void {
    this.getCustTypeList()
    this.getCountryList()
    this.getServiceTypeList()
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
::v-deep .el-dialog__body {
  padding: 10px 20px;
}
</style>
