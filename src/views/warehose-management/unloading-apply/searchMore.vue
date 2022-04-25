<template>
  <div>
    <el-form
      ref="searchMore"
      :model="searchMore"
      label-width="120px"
      class="more-form"
      size="small"
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
        />
      </el-form-item>
      <el-form-item label="排队序号">
        <el-input
          v-model="searchMore.lineNo"
          size="small"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="司机姓名">
        <el-input
          v-model="searchMore.driversName"
          size="small"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="司机联系电话">
        <el-input
          v-model="searchMore.driversMobile"
          size="small"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="卸货口">
        <el-input
          v-model="searchMore.expectedWcName"
          size="small"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="实际卸货时间">
        <el-date-picker
          v-model="searchMore.actualUnloadStartTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          size="small"
          style="width:100%;"
        />
      </el-form-item>
      <el-form-item label="卸货完成时间">
        <el-date-picker
          v-model="searchMore.actualUnloadEndTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          size="small"
          style="width:100%;"
        />
      </el-form-item>
      <el-form-item label="仓库对接人">
        <el-input
          v-model="searchMore.warehouseContactPerson"
          size="small"
          placeholder="请输入"
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
  private searchMore: any = {
    lineNo: undefined,
    warehouseName: undefined,
    custName: undefined,
    key: 1,
    originalNo: undefined,
    unloadNo: undefined,
    unloadStatus: undefined,
    unloadType: undefined,
    value: undefined,
    driversName: undefined,
    driversMobile: undefined,
    expectedWcName: undefined,
    actualUnloadStartTime: undefined,
    actualUnloadEndTime: undefined,
    warehouseContactPerson: undefined
  }

  /* 方法 */
}
</script>

<style lang="scss" scoped>
.more-form {
  padding: 20px 40px 20px 20px;
}
</style>
