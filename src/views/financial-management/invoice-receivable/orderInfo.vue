<template>
  <div v-loading="loading">
    <el-form
      ref="form"
      :model="orderForm"
      label-width="90px"
      style="padding: 20px;"
    >
      <el-form-item label="发票编号">
        {{ orderForm.code }}
      </el-form-item>
      <el-form-item label="原单号">
        {{ orderForm.orderCode }}
      </el-form-item>
      <el-form-item label="状态">
        {{ (statusList.find(e => e.id === orderForm.status) || {}).name }}
      </el-form-item>
      <el-form-item label="客户名称">
        {{ orderForm.clientName }}
      </el-form-item>
      <el-form-item label="客户属性">
        <span v-if="orderForm.clientProperty === '2-1'">一级代理</span>
        <span v-else-if="orderForm.clientProperty === '2-2'">二级代理</span>
        <span v-else-if="orderForm.clientProperty === '1-0'">直客</span>
        <span v-else-if="orderForm.clientProperty === '1-1'">同行</span>
        <span v-else>--</span>
      </el-form-item>
      <el-form-item label="申请人">
        {{ orderForm.agentName }}
      </el-form-item>
      <el-form-item label="发票时间">
        {{ orderForm.invDate }}
      </el-form-item>
      <el-form-item label="服务大类">
        {{ orderForm.serviceTypeName }}
      </el-form-item>
      <el-form-item label="业务类型">
        {{ (subtypeList.find(e => e.id === orderForm.serviceSubtypeId) || {}).name }}
      </el-form-item>
      <el-form-item label="渠道">
        {{ orderForm.channelName }}
      </el-form-item>
      <el-form-item label="仓库代码">
        {{ orderForm.wsCode }}
      </el-form-item>
      <el-form-item label="总件数">
        {{ orderForm.packages }}
      </el-form-item>
      <el-form-item label="总重量(kg)">
        {{ orderForm.weights }}
      </el-form-item>
      <el-form-item label="下单时间">
        {{ orderForm.orderDate }}
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: '',
  components: {},
  props: {
    statusList: {
      type: Array,
      default: () => ([])
    },
    subtypeList: {
      type: Array,
      default: () => ([])
    },
    orderForm: {
      type: Object,
      default: () => {
        return {}
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
})
export default class extends Vue {
  /* data */

  /* 方法 */
}
</script>

<style lang="scss" scoped>
.el-form-item {
  display: inline-block;
  width: 49%;
}
</style>
