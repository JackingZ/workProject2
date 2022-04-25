<template>
  <div>
    <el-form
      ref="searchMore"
      :model="searchMore"
      label-width="120px"
      class="more-form"
    >
      <el-form-item label="计量申请单ID">
        <el-input
          v-model="searchMore.measureId"
          size="small"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="原单号">
        <el-input
          v-model="searchMore.originalNo"
          size="small"
          placeholder="请输入"
          clearable
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
          v-model="searchMore.custName"
          size="small"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="计量方案">
        <el-select
          v-model="searchMore.measureMethod"
          placeholder="请选择"
          size="small"
          style="width: 100%;"
          clearable
        >
          <el-option
            label="逐箱"
            :value="1"
          />
          <el-option
            label="批量"
            :value="2"
          />
          <el-option
            label="打托"
            :value="3"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否二次计量">
        <el-select
          v-model="searchMore.secondaryMesaure"
          placeholder="请选择"
          size="small"
          style="width: 100%;"
          clearable
        >
          <el-option
            label="否"
            :value="0"
          />
          <el-option
            label="是"
            :value="1"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="searchMore.mesaureStatus"
          placeholder="请选择"
          size="small"
          style="width: 100%;"
          clearable
        >
          <el-option
            label="待计量"
            :value="1"
          />
          <el-option
            label="计量中"
            :value="2"
          />
          <el-option
            label="已计量"
            :value="3"
          />
          <el-option
            label="计量复核待审核"
            :value="4"
          />
          <el-option
            label="计量复核已通过"
            :value="5"
          />
          <el-option
            label="计量复核被拒绝"
            :value="6"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="要求完成时间">
        <el-date-picker
          v-model="searchMore.requireTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          size="small"
          style="width:100%;"
        />
      </el-form-item>
      <el-form-item label="实际完成时间">
        <el-date-picker
          v-model="searchMore.actualMeasureTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          size="small"
          style="width:100%;"
        />
      </el-form-item>
      <el-form-item label="申请人">
        <el-input
          v-model="searchMore.applicant"
          size="small"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="申请时间">
        <el-date-picker
          v-model="searchMore.applyTime"
          type="datetimerange"
          size="small"
          style="width:100%;"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-time="['00:00:00', '23:59:59']"
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
    applicant: undefined,
    applyTime: undefined,
    applyTimeEnd: undefined,
    applyTimeStart: undefined,
    requireTime: undefined,
    actualMeasureTime: undefined,
    custName: undefined,
    id: undefined,
    measureId: undefined,
    measureMethod: undefined,
    mesaureStatus: undefined,
    originalNo: undefined,
    secondaryMesaure: undefined,
    warehouseName: undefined
  }

  /* 方法 */
}
</script>

<style lang="scss" scoped>
.more-form {
  padding: 20px 40px 20px 20px;
}
</style>
