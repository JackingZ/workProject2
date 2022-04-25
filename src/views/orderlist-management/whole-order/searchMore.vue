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
          v-model="searchMore.inventoryStatus"
          placeholder="入库状态"
          size="small"
          style="width: 100%;"
          clearable
          filterable
        >
          <el-option
            v-for="item in inventoryStatusList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="searchMore.measureStatus"
          placeholder="计量状态"
          size="small"
          style="width: 100%;"
          clearable
          filterable
        >
          <el-option
            v-for="item in measureStatusList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="searchMore.examineStatus"
          placeholder="验货状态"
          size="small"
          style="width: 100%;"
          clearable
          filterable
        >
          <el-option
            v-for="item in examineStatusList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="searchMore.declartionStatus"
          placeholder="报关状态"
          size="small"
          style="width: 100%;"
          clearable
          filterable
        >
          <el-option
            v-for="item in declartionStatusList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="searchMore.expressNo"
          placeholder="快递"
          size="small"
          style="width: 100%;"
          clearable
          filterable
        >
          <el-option
            label="未出"
            value="0"
          />
          <el-option
            label="已出"
            value="1"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="searchMore.type === '1' || searchMore.type === '2'">
        <el-select
          v-model="searchMore.ifLocked"
          placeholder="支持锁舱"
          size="small"
          clearable
          style="width:100%;"
        >
          <el-option
            label="否"
            :value="false"
          />
          <el-option
            label="是"
            :value="true"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="searchMore.ifLoading"
          placeholder="是否发货"
          size="small"
          clearable
          style="width:100%;"
        >
          <el-option
            label="未发货"
            :value="0"
          />
          <el-option
            label="部分发货"
            :value="2"
          />
          <el-option
            label="已发货"
            :value="1"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="searchMore.deliveryWay"
          size="small"
          style="width: 100%;"
          placeholder="派送方式"
          clearable
          filterable
        >
          <el-option
            label="快递"
            value="0"
          />
          <el-option
            label="卡派"
            value="1"
          />
          <el-option
            label="自提"
            value="2"
          />
          <el-option
            v-if="searchMore.type === '1' || searchMore.type === '2'"
            label="整柜直送"
            value="3"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="searchMore.customs0"
          size="small"
          style="width: 100%;"
          placeholder="报关方式"
          clearable
          filterable
        >
          <el-option
            label="普通报关"
            value="0"
          />
          <el-option
            label="出口退税"
            value="1"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="searchMore.includeTax"
          size="small"
          style="width: 100%;"
          placeholder="关税方式"
          clearable
          filterable
        >
          <el-option
            label="包税"
            :value="true"
          />
          <el-option
            label="不包税"
            :value="false"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="isType !== 'risk'">
        <el-select
          v-model="searchMore.ifFrozen"
          size="small"
          style="width: 100%;"
          placeholder="是否冻结"
          clearable
          filterable
        >
          <el-option
            label="否"
            :value="false"
          />
          <el-option
            label="是"
            :value="true"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="searchMore.enabled"
          size="small"
          style="width: 100%;"
          placeholder="是否取消"
          clearable
          filterable
        >
          <el-option
            label="是"
            :value="false"
          />
          <el-option
            label="否"
            :value="true"
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
  props: {
    statusList: {
      type: Array,
      default: () => ([])
    },
    isType: {
      type: String,
      default: ''
    }
  }
})
export default class extends Vue {
  /* data */
  private searchMore = {
    ifFrozen: undefined,
    declartionStatus: undefined,
    expressNo: undefined,
    examineStatus: undefined,
    measureStatus: undefined,
    inventoryStatus: undefined,
    ifLocked: undefined,
    ifLoading: undefined,
    deliveryWay: undefined,
    customs0: undefined,
    includeTax: undefined,
    enabled: undefined
  }
  /** computed */
  get declartionStatusList(): any[] {
    const arr: any[] = (this as any).statusList
    return arr.filter((e: any) => e.type === 'CUSTOM_DECLARATION')
  }
  get examineStatusList(): any[] {
    const arr: any[] = (this as any).statusList
    return arr.filter((e: any) => e.type === 'EXAMINE')
  }
  get measureStatusList(): any[] {
    const arr: any[] = (this as any).statusList
    return arr.filter((e: any) => e.type === 'MEASURE')
  }
  get inventoryStatusList(): any[] {
    const arr: any[] = (this as any).statusList
    return arr.filter((e: any) => e.type === 'WS_IN').filter((e: any) => e.id !== '99')
  }

  /* 方法 */
}
</script>

<style lang="scss" scoped>
.more-form {
  padding: 20px;
}
</style>
