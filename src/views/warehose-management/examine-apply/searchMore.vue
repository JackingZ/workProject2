<template>
  <div>
    <el-form
      ref="searchMore"
      :model="searchMore"
      label-width="120px"
      class="more-form"
    >
      <el-form-item label="原单号">
        <el-input
          v-model="searchMore.originalNo"
          size="small"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="仓库名称">
        <el-input
          v-model="searchMore.warehouseName"
          size="small"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="客户名称">
        <el-input
          v-model="searchMore.khmc"
          size="small"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="申请人">
        <el-input
          v-model="searchMore.applicantName"
          size="small"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="审核人">
        <el-input
          v-model="searchMore.reviewerName"
          size="small"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="审核时间">
        <el-date-picker
          v-model="searchMore.reviewTime"
          unlink-panels
          type="daterange"
          size="small"
          style="width:100%;"
          value-format="yyyy-MM-dd"
          range-separator="~"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'searchMore',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private searchMore = {
    yhsqdid: undefined,
    ydh: undefined,
    zt: undefined,
    yhhj: undefined,
    ckmc: undefined,
    khmc: undefined,
    yklx: undefined,
    sqr: undefined,
    sqsj: undefined,
    shr: undefined,
    shsj: undefined
  }

  /* 方法 */
}
</script>

<style lang="scss" scoped>
.more-form {
  padding: 20px 40px 20px 20px;
}
</style>
