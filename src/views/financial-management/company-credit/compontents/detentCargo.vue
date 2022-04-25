<template>
  <div v-loading="dialogLoading">
    <el-row
      type="flex"
      :gutter="10"
    >
      <el-col
        :span="8"
        style="margin: 10px 0;"
      >
        <div class="items">
          <div class="items-head">
            已选择
          </div>
          <el-tag
            v-for="(item, index) in selectedList"
            :key="index"
            closable
            type="info"
            @close="handleRemove(index, item)"
          >
            {{ item.name }}
          </el-tag>
        </div>
      </el-col>
      <el-col :span="16">
        <el-row class="filter">
          <el-col style="text-align:right;">
            <el-input
              v-model="goodsName"
              size="small"
              style="width:130px;"
              placeholder="请输入名称"
            />
            <el-button
              type="primary"
              size="small"
              @click="getGoodsData(1)"
            >
              查询
            </el-button>
          </el-col>
        </el-row>
        <el-table
          ref="theTable"
          :data="goodsList"
          border
          @select="handleSelect"
          @select-all="handleSelectAll"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop=""
            label="订单号"
          />
        </el-table>
        <el-pagination
          small
          :current-page.sync="page"
          :page-size="size"
          layout="total, prev, pager, next"
          :total="total"
          style="text-align: right;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>

    <div
      slot="footer"
      style="text-align:right;padding-top: 10px;"
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
        @click="save"
      >
        确 定
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getOrderList
} from '@/api/financial-at-company-credit'

@Component({
  name: '',
  components: {},
  props: {
  }
})
export default class extends Vue {
  /** data */
  private dialogLoading: boolean = false
  private goodsName = ''
  private selectedList: any[] = []
  private goodsList: any[] = []
  private page: number = 1
  private size: number = 10
  private total: number = 0

  /** method */
  private handleRemove(index: any, item: any) {
    this.selectedList.splice(index, 1)
    const itemD = this.goodsList.findIndex((element: any) => element.id === item.id)
    if (itemD !== -1) {
      this.$nextTick(() => {
        (this.$refs.theTable as any).toggleRowSelection(this.goodsList[itemD])
      })
    }
  }
  private handleSelect(_: any, row: any) {
    const index = this.selectedList.findIndex((item: any) => item.id === row.id)
    if (index === -1) {
      this.selectedList.push({
        id: row.id,
        name: row.name
      })
    } else {
      this.selectedList.splice(index, 1)
    }
  }

  private handleSelectAll(selection: any) {
    if (selection.length) {
      this.goodsList.forEach((item: any) => {
        if (this.selectedList.every((element: any) => element.id !== item.id)) {
          this.selectedList.push({
            id: item.id,
            name: item.name
          })
        }
      })
    } else {
      this.selectedList = this.selectedList.filter((item: any) => {
        const isInTableData = this.goodsList.some((element: any) => {
          return element.id === item.id
        })
        return !isInTableData
      })
    }
  }
  private handleSelectionChange(val: any) {
    // zzz
  }

  private cancel() {
    //
  }

  private save() {
    //
  }

  private async getGoodsData(val?: any) {
    this.dialogLoading = true
    if (val) {
      this.page = val
    }
    const params:any = {
      page: this.page,
      size: this.size,
      name: this.goodsName
    }
    try {
      const res = await getOrderList(params)
      const data = res.data || {}
      const result = data.result || []
      this.goodsList = result.map((it: any) => {
        return {
          id: it.id,
          name: it.name
        }
      })
      this.total = data.total
      this.goodsList.forEach((row: any) => {
        const isSelected = this.selectedList.some((item: any) => item.id === row.id)
        if (isSelected) {
          this.$nextTick(() => {
            (this.$refs.theTable as any).toggleRowSelection(row)
          })
        }
      })
      this.dialogLoading = false
    } catch (error) {
      this.dialogLoading = false
      return error
    }
  }
  private async handleSizeChange() {
    await this.getGoodsData()
  }

  private async handleCurrentChange() {
    await this.getGoodsData()
  }
}
</script>

<style lang="scss" scoped>
.items {
  height: 450px;
  overflow: auto;
  border: 1px solid #e6ebf5;
  .items-head {
    padding: 10px;
    background-color: #dfdfdf;
    margin-bottom: 15px;
  }
}

.filter{
  .el-input {
    display: inline-block;
    width: 220px;
    margin:10px;
  }
}
</style>
