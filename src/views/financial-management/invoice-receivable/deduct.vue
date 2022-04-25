<template>
  <div>
    <el-form
      ref="form"
      :model="deductForm"
      label-width="100px"
      style="padding-right: 20px;"
    >
      <el-form-item label="折扣类型">
        <el-select
          v-model="deductForm.type"
          placeholder="请选择"
          size="small"
          style="width: 100%;"
          clearable
        >
          <el-option
            v-for="(item, index) in deductList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="折扣比例/金额">
        <el-input
          v-model="deductForm.account"
          size="small"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
    </el-form>
    <div style="padding: 20px 0;text-align: right;">
      <el-button @click="close">
        取 消
      </el-button>
      <el-button
        type="primary"
        @click="confirm"
      >
        确 定
      </el-button>
    </div>

    <div>
      <div>历史折扣信息</div>
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        height="300px"
        style="width: 100%;margin: 10px 0;"
      >
        <el-table-column
          prop="type"
          label="折扣类型"
        />
        <el-table-column
          prop="account"
          label="折扣比例/减免金额"
        />
        <el-table-column
          prop="status"
          label="状态"
        />
        <el-table-column
          prop="checkout"
          label="审核结果"
        />
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: '',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private deductForm: any = {
    type: undefined,
    account: undefined
  }
  private deductList: any[] = []
  private tableData: any[] = []
  private loading: boolean = false

  /* 方法 */
  private close() {
    // ccc
  }
  private confirm() {
    // xxx
  }
}
</script>

<style lang="scss" scoped>
</style>
