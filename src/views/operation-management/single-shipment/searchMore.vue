<template>
  <div>
    <el-form
      ref="searchMore"
      :model="searchMore"
      label-width="0px"
      class="more-form"
      size="small"
    >
      <el-form-item>
        <el-select
          v-model="searchMore.ifWareHouseOut"
          size="small"
          style="width: 100%;"
          placeholder="安排出库"
          clearable
          filterable
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
      <el-form-item>
        <el-select
          v-model="searchMore.ifOutDeclare"
          size="small"
          style="width: 100%;"
          placeholder="起运港报关"
          clearable
          filterable
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
      <el-form-item>
        <el-select
          v-model="searchMore.ifEnterDeclare"
          size="small"
          style="width: 100%;"
          placeholder="目的港报关"
          clearable
          filterable
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
      <el-form-item v-if="searchMore.type === '1' || searchMore.type === '2'">
        <el-select
          v-model="searchMore.ifOutTrailer"
          size="small"
          style="width: 100%;"
          placeholder="起运港拖车"
          clearable
          filterable
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
      <el-form-item v-if="searchMore.type === '1' || searchMore.type === '2'">
        <el-select
          v-model="searchMore.ifEnterTrailer"
          size="small"
          style="width: 100%;"
          placeholder="目的港拖车"
          clearable
          filterable
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
      <el-form-item v-if="searchMore.type === '0'">
        <el-select
          v-model="searchMore.ifOutCar"
          size="small"
          style="width: 100%;"
          placeholder="起运港卡车"
          clearable
          filterable
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
      <el-form-item v-if="searchMore.type === '0'">
        <el-select
          v-model="searchMore.ifEnterCar"
          size="small"
          style="width: 100%;"
          placeholder="目的港卡车"
          clearable
          filterable
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
      <el-form-item v-if="searchMore.type === '1' || searchMore.type === '2'">
        <el-select
          v-model="searchMore.openTank"
          size="small"
          style="width: 100%;"
          placeholder="拆柜打托"
          clearable
          filterable
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
    ifWareHouseOut: undefined,
    ifOutDeclare: undefined,
    ifEnterDeclare: undefined,
    ifOutTrailer: undefined,
    ifEnterTrailer: undefined,
    ifOutCar: undefined,
    ifEnterCar: undefined,
    openTank: undefined
  }
  /** computed */

  /* 方法 */
}
</script>

<style lang="scss" scoped>
.more-form {
  padding: 20px;
}
</style>
