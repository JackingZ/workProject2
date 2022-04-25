<template>
  <div
    class="app-container"
    style="width: 100%"
  >
    <head-info
      info=""
      title="服务组"
    />
    <div class="app-panel">
      <el-row>
        <el-col
          :span="2"
        >
          <el-button
            type="text"
            icon="el-icon-circle-plus-outline"
            style="margin-left: 10px;"
            @click="handleAdd"
          >
            新增
          </el-button>
        </el-col>
        <el-col
          :span="22"
          style="text-align: right"
        >
          <el-button
            size="small"
            @click="goBack"
          >
            返回
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="loadData"
          >
            刷新
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
          label="服务组名称"
          width="200"
          show-overflow-tooltip
        />
        <el-table-column
          prop="countryName"
          label="目的国"
          width="200"
          show-overflow-tooltip
        />
        <el-table-column
          prop="lscName"
          label="服务"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column
          label="开关"
          width="80"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-switch
              :value="scope.row.status"
              class="switchStyle"
              active-value="1"
              inactive-value="0"
              @input="(value) => onStatus(scope.row, value)"
            />
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150"
        >
          <template slot-scope="scope">
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
        :current-page.sync="pagination.page"
        :page-size="pagination.size"
        layout="total, prev, pager, next"
        :total="pagination.total"
        style="text-align: right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <group-form
      ref="groupForm"
      :is-edit="isEdit"
      @save-success="loadData"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getLineGroupList, deleteLscGroup, setLscGroupStatus } from '@/api/service-with-service-line-group'
import GroupForm from '@/views/service-configuration/privateline-line-group/group-form.vue'

@Component({
  name: 'service-line-group',
  components: {
    GroupForm
  }
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private isEdit: boolean = false
  private tableData: any[] = []
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }

  /* methods */
  private goBack() {
    this.$emit('back')
  }

  private onStatus(row: any, val: any) {
    this.$confirm(`请确认是否${val === '0' ? '关闭' : '开启'}该条数据?`, '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.loading = true
      const params = {
        id: row.id,
        status: val
      }
      setLscGroupStatus(params).then(() => {
        this.loading = false
        this.$message.success('操作成功')
        this.loadData()
      }).catch(() => {
        this.loading = false
        this.loadData()
      })
    }).catch(() => {
      this.loadData()
    })
  }

  private handleAdd() {
    this.isEdit = false
    const groupForm: any = this.$refs.groupForm
    groupForm.show()
  }

  private handleEdit(row: any) {
    this.isEdit = true
    const groupForm: any = this.$refs.groupForm
    groupForm.show(row)
  }

  private handleDelete(row: any) {
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const params = {
        id: row.id
      }
      this.loading = true
      deleteLscGroup(params).then(() => {
        this.loading = false
        this.$message.success('删除成功')
        this.loadData(1)
      }).catch(() => {
        this.loading = false
      })
    }).catch((err: any) => {
      return err
    })
  }

  private handleSizeChange(size: any) {
    this.pagination.size = size
    this.loadData()
  }

  private handleCurrentChange(page: any) {
    this.pagination.page = page
    this.loadData()
  }

  private loadData(page?: number) {
    if (page === 1) this.pagination.page = 1
    const params = {
      model: {},
      page: this.pagination.page,
      size: this.pagination.size
    }
    this.loading = true
    getLineGroupList(params).then((res: any) => {
      this.loading = false
      const data = res.data || {}
      this.tableData = data.result || []
      this.pagination.total = data.total
    }).catch(() => {
      this.loading = false
      this.tableData = []
      this.pagination.total = 0
    })
  }

  private created() {
    this.loadData()
  }
}
</script>

<style scoped>
  .app-panel{
    width: 100%;
  }
</style>
