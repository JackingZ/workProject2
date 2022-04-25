<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="验货配置"
        />
        <div class="app-panel">
          <el-row>
            <el-col
              :span="24"
              style="text-align:right;"
            >
              <el-button
                v-permission="['lnspectionConfigAdd']"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="float: left;"
                @click="addExamine"
              >
                新增配置
              </el-button>

              <el-select
                v-model="selectValue.type"
                size="small"
                clearable
                filterable
                style="width:130px;margin-right:5px;"
                placeholder="验货方式"
              >
                <el-option
                  label="按产品"
                  value="0"
                />
                <el-option
                  label="按比例"
                  value="2"
                />
              </el-select>
              <el-input
                v-model="selectValue.name"
                :maxlength="20"
                size="small"
                style="width:180px;margin-right:10px;"
                placeholder="验货配置名称"
              />
              <el-button
                v-permission="['lnspectionConfigQuery']"
                type="primary"
                size="small"
                @click="getTableData(1)"
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
              label="验货配置名称"
              min-width="130"
            />
            <el-table-column
              prop="type"
              label="验货方式"
              width="120"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.type === '0'">
                  按产品
                </span>
                <span v-else-if="scope.row.type === '2'">
                  按比例
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="degree"
              :formatter="formatExamineType"
              label="验货程度"
              min-width="200"
            />
            <el-table-column
              prop="pick"
              label="抽箱方式"
              width="120"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.pick === '0'">
                  随机
                </span>
                <span v-else-if="scope.row.pick === '1'">
                  指定
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="是否验证尺寸"
              width="150"
              prop="size"
            >
              <template slot-scope="scope">
                <span>
                  {{ scope.row.size ? '是' : '否' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              width="180"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['lnspectionConfigUpdate']"
                  type="text"
                  @click="editExamine(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="['lnspectionConfigDel']"
                  type="text"
                  @click="deleteExamine(scope.row)"
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
        </div>
      </div>
    </div>
    <el-dialog
      :title="isEdit ? '编辑验货配置' : '新增验货配置'"
      :visible.sync="visible"
      :close-on-click-modal="false"
      width="1000px"
      @closed="cancel"
    >
      <addEditForm
        ref="addModel"
        :type-list="typeList"
        :is-edit="isEdit"
        @load="getTableData"
        @cancel="cancel"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getTableData,
  deleteExamineConfig
} from '@/api/operation-of-examine-config'
import addEditForm from '@/views/operation-management/examine-config/addEditForm.vue'

@Component({
  name: '',
  components: {
    addEditForm
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private tableData: any = []
  private typeList: any = [
    { name: '纯电', id: '0' },
    { name: '带电', id: '1' },
    { name: '强磁', id: '2' },
    { name: '弱磁', id: '3' },
    { name: '液体', id: '4' },
    { name: '粉末', id: '5' }
  ]
  private selectValue: any = {
    type: undefined,
    name: undefined
  }
  private page: number = 1
  private size: number = 10
  private total: number = 0
  private isEdit: boolean = false
  private visible: boolean = false

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
  private formatExamineType(row: any) {
    const arr = row.degree.split(',') || []
    const res = arr.map((it: any) => {
      const item = this.typeList.find((t: any) => t.id === it) || {}
      return item.name
    })
    return res.join(',')
  }
  private getTableData(val?: any) {
    if (val) {
      this.page = val
    }
    const params = {
      ...this.selectValue,
      page: this.page,
      size: this.size
    }
    this.loading = true
    getTableData(params)
      .then((res: any) => {
        const data = res.data || []
        this.tableData = data.result || []
        this.total = data.total
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private editExamine(row: any) {
    this.isEdit = true
    this.visible = true
    this.$nextTick(() => {
      const addModelRef: any = this.$refs.addModel
      addModelRef.show(row)
    })
  }
  private addExamine() {
    this.isEdit = false
    this.visible = true
  }
  private cancel() {
    this.visible = false
    this.$nextTick(() => {
      const addModelRef: any = this.$refs.addModel
      addModelRef.reset()
    })
  }
  private deleteExamine(row: any) {
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
        deleteExamineConfig(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getTableData()
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
    this.size = val
    this.getTableData()
  }
  private handleCurrentChange(val: any) {
    this.page = val
    this.getTableData()
  }

  private created(): void {
    this.getTableData()
  }
}
</script>
<style lang="scss" scoped>
</style>
