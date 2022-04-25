<template>
  <div
    style="display: flex;flex-flow: row nowrap;min-height: inherit;"
  >
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        class="app-container"
      >
        <head-info
          info=""
          title="基础会计科目"
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
                @click="handleAdd"
              >
                新增会计科目
              </el-button>
              <el-input
                v-model="searchForm.originalNumber"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
                placeholder="国家"
              />
              <el-input
                v-model="searchForm.customerName"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
                placeholder="科目编号"
              />
              <el-input
                v-model="searchForm.customerName"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
                placeholder="科目名称"
              />
              <el-input
                v-model="searchForm.customerName"
                size="small"
                clearable
                style="width:130px;margin-right:5px;"
                placeholder="辅助名称"
              />
              <el-button
                type="primary"
                size="small"
                @click="getTableList"
              >
                查询
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="handleImport"
              >
                导入科目
              </el-button>
            </el-col>
          </el-row>

          <el-table
            v-loading="loading"
            :data="tableData"
            :tree-props="{children: 'children'}"
            row-key="id"
            tooltip-effect="light"
            border
            height="calc(100vh - 305px)"
            style="width: 100%;margin: 10px 0;"
          >
            <el-table-column
              prop=""
              label="国家"
            />
            <el-table-column
              prop=""
              label="科目编号"
            />
            <el-table-column
              prop=""
              label="科目名称"
              width="160px"
            />
            <el-table-column
              prop=""
              label="辅助名称"
            />
            <el-table-column
              prop=""
              label="科目简称"
              width="120"
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="200px"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="handleSub(scope.row)"
                >
                  新增子科目
                </el-button>
                <el-button
                  type="text"
                  @click="handleEdit(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  @click="handleDelete(scope.row)"
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
            :title="isEdit ? '编辑科目' : '新增科目'"
            :visible.sync="dialogShow"
            :close-on-click-modal="false"
            width="600px"
            @closed="handleClose"
          >
            <addEditForm
              ref="editForm"
              :is-edit="isEdit"
              @cancel="handleClose"
              @getTableList="getTableList"
            />
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import addEditForm from '@/views/financial-management/basic-accountancy/addEditForm.vue'
import {
  getTableList
} from '@/api/financial-at-collection-order'
@Component({
  name: '',
  components: {
    addEditForm
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private searchForm = {
  }
  private tableData: any = []
  private total = 0
  private page = 1
  private size = 10
  private loading = false
  private isEdit: boolean = false
  private dialogShow: boolean = false

  /* methods */
  private handleAdd(): void {
    // 新增
    this.dialogShow = true
    this.isEdit = false
  }
  private handleSub(): void {
    // 新增
    this.dialogShow = true
    this.isEdit = false
  }
  private handleEdit(row: any): void {
    // 编辑
    this.dialogShow = true
    this.isEdit = true
    const root: any = this.$refs.detailForm
    root.setData(row)
  }
  private handleDelete(): void {
    // 删除
  }
  private handleImport(): void {
    // 导入科目
  }
  private handleClose() {
    this.dialogShow = false
  }
  private getTableList(): void {
    // 查询
    this.loading = true
    const params: any = {
      ...this.searchForm,
      size: this.size,
      page: this.page
    }
    getTableList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.tableData = data.result || []
        this.total = data.total
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return [null, err]
      })
  }

  private handleSizeChange(size: any): void {
    // 页码
    this.size = size
    this.getTableList()
  }
  private handleCurrentChange(page: any): void {
    // 页数
    this.page = page
    this.getTableList()
  }
}
</script>

<style lang="scss" scoped>
</style>
