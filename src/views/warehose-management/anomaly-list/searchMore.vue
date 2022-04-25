<template>
  <div>
    <el-form
      ref="searchMore"
      :model="searchMore"
      label-width="120px"
      class="more-form"
    >
      <el-form-item label="仓库名称">
        <el-input
          v-model="searchMore.ckmc"
          size="small"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="托盘ID">
        <el-input
          v-model="searchMore.tpid"
          size="small"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="库位">
        <el-input
          v-model="searchMore.kw"
          size="small"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="箱号">
        <el-input
          v-model="searchMore.xh"
          size="small"
          placeholder="请输入"
          clearable
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
    ydh: '',
    zt: '',
    ckmc: '',
    khmc: '',
    tpid: '',
    kw: '',
    xh: '',
    sshj: '',
    lx: '',
    gxsj: ''
  }

  /* 方法 */
}
</script>

<style lang="scss" scoped>
.more-form {
  padding: 20px 40px 20px 20px;
}
</style>
