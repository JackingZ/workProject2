<template>
  <div>
    <el-form
      ref="searchMore"
      :model="searchMore"
      label-width="120px"
      class="more-form"
    >
      <el-form-item label="增值服务申请单ID">
        <el-input
          v-model="searchMore.zzfwsqdid"
          size="small"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="原单号">
        <el-input
          v-model="searchMore.ydh"
          size="small"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="仓库名称">
        <el-input
          v-model="searchMore.ckmc"
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
      <el-form-item label="服务类型">
        <el-select
          v-model="searchMore.fwlx"
          placeholder="请选择"
          size="small"
          style="width: 100%;"
          clearable
        >
          <el-option
            label="分箱"
            value="0"
          />
          <el-option
            label="合箱"
            value="1"
          />
          <el-option
            label="贴标"
            value="2"
          />
          <el-option
            label="贴唛"
            value="3"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="searchMore.zt"
          placeholder="请选择"
          size="small"
          style="width: 100%;"
          clearable
        >
          <el-option
            label="待服务"
            value="0"
          />
          <el-option
            label="服务中"
            value="1"
          />
          <el-option
            label="已完成"
            value="2"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请人">
        <el-input
          v-model="searchMore.sqr"
          size="small"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="申请时间">
        <el-date-picker
          v-model="searchMore.sqsj"
          type="datetimerange"
          size="small"
          style="width:100%;"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-time="['00:00:00', '23:59:59']"
        />
      </el-form-item>
      <el-form-item label="审核人">
        <el-input
          v-model="searchMore.shr"
          size="small"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="审核时间">
        <el-date-picker
          v-model="searchMore.shsj"
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
    zzfwsqdid: '',
    ydh: '',
    zt: '',
    ckmc: '',
    khmc: '',
    fwlx: '',
    sqr: '',
    sqsj: '',
    shr: '',
    shsj: ''
  }

  /* 方法 */
}
</script>

<style lang="scss" scoped>
.more-form {
  padding: 20px 40px 20px 20px;
}
</style>
