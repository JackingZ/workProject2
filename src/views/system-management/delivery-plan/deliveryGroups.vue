<template>
  <div>
    <el-table
      v-loading="loading"
      :data="list"
      height="400px"
      style="width: 100%;margin-top: 10px;"
      border
    >
      <el-table-column
        prop="type"
        label="业务类型"
        width="120"
      />
      <el-table-column
        prop="startCountryName"
        label="起运国"
        min-width="120"
      />
      <el-table-column
        prop="startCountryName"
        label="起运地"
        min-width="120"
      />
      <el-table-column
        prop="countryName"
        label="目的国"
        min-width="120"
      />
      <el-table-column
        prop="countryName"
        label="目的仓"
        min-width="120"
      />
      <el-table-column
        prop="title"
        label="需求频率"
        min-width="150"
      />
      <el-table-column
        prop="code"
        label="已有方数"
        min-width="120"
      />
      <el-table-column
        prop="price"
        label="发起人"
        width="120"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="medium"
            @click="handleEdit(scope.row)"
          >
            新增计划
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
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getGroupsList
} from '@/api/system-in-delivery-plan'
import dayjs from 'dayjs'

@Component({
  name: '',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */

  private loading: boolean = false
  private list: any[] = []
  private page: number = 1
  private size: number = 10
  private total: any = 0

  /* 方法 */

  private getTableData() {
    this.loading = true
    const params:any = {
      page: this.page,
      size: this.size
    }
    getGroupsList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.list = data.result || []
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.getTableData()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.getTableData()
  }

  private async handleEdit(row: any) {
    this.$emit('edit')
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
</style>
<style lang="scss">
.el-tree-select-dropdown {
  z-index: 9999 !important;
}
</style>
