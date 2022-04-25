<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="文件配置"
        />
        <div class="app-panel">
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-button
                v-permission="['fileConfigAdd']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="float: left;"
                @click="addFile"
              >
                新增文件
              </el-button>
              <el-select
                v-model="selectValue.moduleCode"
                size="small"
                clearable
                filterable
                style="width:130px;margin-right:5px;"
                placeholder="所属模块"
                :loading="modeLoading"
                @focus="getModeList"
                @change="handleModeChange"
              >
                <el-option
                  v-for="item in modeList"
                  :key="item.id"
                  :label="item.moduleName"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.typeCode"
                size="small"
                clearable
                filterable
                style="width:130px;margin-right:5px;"
                placeholder="文件类别"
                :loading="typeLoading"
                :disabled="!selectValue.moduleCode"
                @focus="getTypeList"
              >
                <el-option
                  v-for="item in filetypeList"
                  :key="item.id"
                  :label="item.fileType"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-model="selectValue.countryCode"
                size="small"
                clearable
                filterable
                style="width:130px;margin-right:5px;"
                placeholder="国家"
                :loading="countryLoading"
                :filter-method="filterCountry"
                @focus="getCountryList"
                @change="handleCountryChange"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
                  :label="item.newName"
                  :value="item.id"
                />
              </el-select>
              <el-input
                v-model="selectValue.fileName"
                :maxlength="20"
                clearable
                size="small"
                style="width:250px;margin-right:10px;"
                placeholder="请输入"
              >
                <template slot="prepend">
                  文件名称
                </template>
              </el-input>
              <el-button
                v-permission="['fileConfigQuery']"
                type="primary"
                size="small"
                @click="loadData(1)"
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
              prop="moduleName"
              label="所属模块"
              width="140"
            />
            <el-table-column
              prop="fileType"
              label="文件类别"
              width="140"
            />
            <el-table-column
              prop="countryName"
              label="国家名称"
              min-width="120"
            />
            <el-table-column
              prop="fileName"
              label="文件名称"
              min-width="120"
            />
            <el-table-column
              prop="fileDesc"
              label="文件描述"
              width="120"
            />
            <el-table-column
              prop="fileExt"
              label="文件类型"
              width="140"
            >
              <template slot-scope="scope">
                <span>
                  {{ fileExtList.find(e => e.value === scope.row.fileExt).label || scope.row.fileExt }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="是否必要"
              width="120"
            >
              <template slot-scope="scope">
                <span>
                  {{ scope.row.ifNeed === 0 ? '否' : '是' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="是否审核"
              width="120"
            >
              <template slot-scope="scope">
                <span>
                  {{ scope.row.ifAudit === 0 ? '否' : '是' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="添加时间"
              width="180"
            />
            <el-table-column
              fixed="right"
              width="100"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['fileConfigUpdate']"
                  type="text"
                  @click="editFile(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['fileConfigDel']"
                  type="text"
                  @click="deleteFile(scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            :current-page.sync="pagination.page"
            :page-size="pagination.size"
            layout="total, prev, pager, next"
            :total="pagination.total"
            style="text-align: right;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <add-model
      ref="addModel"
      @load="loadData"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import { getCountryList } from '@/api/operation-of-service-agency'
import { loadData, getModeList, getTypeList, deleteFileConfig } from '@/api/operation-of-file-config'
import addModel from '@/views/operation-management/file-config/addModel.vue'

@Component({
  name: '',
  components: {
    addModel
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private modeLoading: boolean = false
  private typeLoading: boolean = false
  private countryLoading: boolean = false
  private tableData: any = []
  private countryList: any = []
  private allCountryList: any = []
  private modeList: any = []
  private filetypeList: any = []
  private fileExtList: any = [
    {
      label: 'excel',
      value: 1
    },
    {
      label: 'word',
      value: 2
    },
    {
      label: 'pdf',
      value: 3
    },
    {
      label: 'text',
      value: 4
    },
    {
      label: '图片',
      value: 5
    },
    {
      label: '其他',
      value: 6
    }
  ]
  private selectValue: any = {
    moduleCode: '',
    typeCode: '',
    fileName: '',
    countryCode: ''
  }
  private pagination: any = {
    page: 1,
    total: 0,
    size: 10
  }

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
  private handleCountryChange(val: any) {
    this.loadData(1)
  }
  private handleModeChange(val: any) {
    this.selectValue.typeCode = ''
    this.filetypeList = []
  }
  private filterCountry(value: any) {
    if (value.trim()) {
      const val = value.toUpperCase()
      this.countryList = this.allCountryList.filter((item: any) => {
        return (item.name + '-' + item.alias).toUpperCase().indexOf(val) !== -1
      })
    } else {
      this.countryList = this.allCountryList
    }
  }
  private getCountryList() {
    this.countryLoading = true
    getCountryList().then((res: any) => {
      this.countryLoading = false
      if (res.success) {
        const countryList = res.data.result.map((item: any) => {
          item.newName = item.name + '-' + item.alias
          return item
        })
        this.allCountryList = countryList
        this.countryList = countryList
      }
    }).catch((err: any) => {
      this.countryLoading = false
      return err
    })
  }
  private loadData(arg?: number) {
    if (arg === 1) {
      this.pagination.page = 1
    }
    const params = {
      model: {
        countryCode: this.selectValue.countryCode,
        fileName: this.selectValue.fileName,
        moduleCode: this.selectValue.moduleCode,
        typeCode: this.selectValue.typeCode
      },
      page: this.pagination.page,
      size: this.pagination.size
    }
    this.loading = true
    loadData(params)
      .then((res: any) => {
        this.loading = false
        if (res.success) {
          this.tableData = res.data.result
          this.pagination.total = res.data.total
        }
      })
      .catch((err) => {
        this.loading = false
        return err
      })
  }
  private editFile(row: any) {
    const addModelRef = this.$refs.addModel as any
    addModelRef.show(row)
  }
  private addFile() {
    const addModelRef = this.$refs.addModel as any
    addModelRef.show()
  }
  private deleteFile(row: any) {
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
        this.loading = true
        deleteFileConfig(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.loadData(1)
          })
          .catch((err: any) => {
            this.loading = false
            return err
          })
      })
      .catch(() => {
        return false
      })
  }
  private handleSizeChange(val: any) {
    this.pagination.size = val
    this.loadData()
  }
  private handleCurrentChange(val: any) {
    this.pagination.page = val
    this.loadData()
  }
  private getModeList() {
    this.modeLoading = true
    getModeList()
      .then((res: any) => {
        this.modeLoading = false
        if (res.success) {
          this.modeList = res.data
        }
      })
      .catch((err: any) => {
        this.modeLoading = false
        return err
      })
  }
  private getTypeList() {
    const params = {
      moduleId: this.selectValue.moduleCode
    }
    this.typeLoading = true
    getTypeList(params)
      .then((res: any) => {
        this.typeLoading = false
        if (res.success) {
          this.filetypeList = res.data
        }
      })
      .catch((err: any) => {
        this.typeLoading = false
        return err
      })
  }
  private created(): void {
    this.loadData()
    this.getCountryList()
  }
}
</script>
<style lang="scss" scoped>
  .search-country-input{
    ::v-deep{
      .el-input__inner{
        border: none;
        border-bottom: 1px solid #eee;
      }
    }
  }
</style>
