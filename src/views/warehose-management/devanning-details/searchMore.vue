<template>
  <div>
    <el-form
      ref="searchMore"
      :model="searchMore"
      label-width="120px"
      class="more-form"
    >
      <el-form-item label="柜号">
        <el-input
          v-model="searchMore.licencePlate"
          size="small"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="拆柜申请单ID">
        <el-input
          v-model="searchMore.devanID"
          size="small"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="原单号">
        <el-input
          v-model="searchMore.originalNumber"
          size="small"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="仓库名称">
        <el-input
          v-model="searchMore.warehousename"
          size="small"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="客户名称">
        <el-input
          v-model="searchMore.customerName"
          size="small"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="searchMore.status"
          placeholder="请选择"
          size="small"
          style="width: 100%;"
          clearable
        >
          <el-option
            label="待拆柜"
            value="0"
          />
          <el-option
            label="拆柜中"
            value="1"
          />
          <el-option
            label="已完成"
            value="2"
          />
        </el-select>
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
      <el-form-item label="提柜时间">
        <el-date-picker
          v-model="searchMore.pickTime"
          type="datetimerange"
          size="small"
          style="width:100%;"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-time="['00:00:00', '23:59:59']"
        />
      </el-form-item>
      <el-form-item label="预计提柜时间">
        <el-date-picker
          v-model="searchMore.prePickTime"
          type="datetimerange"
          size="small"
          style="width:100%;"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-time="['00:00:00', '23:59:59']"
        />
      </el-form-item>
      <el-form-item label="预计清关时间">
        <el-date-picker
          v-model="searchMore.preClearTime"
          type="datetimerange"
          size="small"
          style="width:100%;"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-time="['00:00:00', '23:59:59']"
        />
      </el-form-item>
      <el-form-item label="预计入仓时间">
        <el-date-picker
          v-model="searchMore.preStorageTime"
          type="datetimerange"
          size="small"
          style="width:100%;"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-time="['00:00:00', '23:59:59']"
        />
      </el-form-item>
      <el-form-item label="实际入仓时间">
        <el-date-picker
          v-model="searchMore.actStorageTime"
          type="datetimerange"
          size="small"
          style="width:100%;"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-time="['00:00:00', '23:59:59']"
        />
      </el-form-item>
      <el-form-item label="完成时间">
        <el-date-picker
          v-model="searchMore.finishTime"
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
    originalNumber: '', // 原单号
    customerName: '', // 客户名称
    status: '', // 状态
    licencePlate: '', // 柜台
    applyTime: '', // 申请时间
    devanID: '', // 拆柜id
    warehousename: '', // 仓库名称
    pickTime: '', // 提柜时间
    prePickTime: '', // 预计提柜时间
    preClearTime: '', // 预计清关时间
    preStorageTime: '', // 预计入仓时间
    actStorageTime: '', // 实际入仓时间
    finishTime: '' // 完成时间
  }

  /* 方法 */
}
</script>

<style lang="scss" scoped>
.more-form {
  padding: 20px 40px 20px 20px;
}
</style>
