<template>
  <el-row class="panel-info">
    <el-col :span="23">
      <h3>{{ title }}</h3>
      <p>{{ info }}</p>
    </el-col>
    <el-col
      v-show="showBack"
      :span="1"
    >
      <el-button
        type="text"
        icon="el-icon-back"
        style="text-align: right;"
        @click="$emit('goback')"
      >
        返回
      </el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'HeadInfoWithBack',
  props: {
    title: {
      type: String,
      default: ''
    },
    info: {
      type: String,
      default: ''
    },
    showBack: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-info {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: baseline;
  padding: 0 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #e8e8e8;
  border-radius: 5px 5px 0 0;
  h3 {
    color: #909399;
    font-weight: 400;
    font-size: 16px;
  }
  p {
    margin-left: 20px;
    font-size: 12px;
    color: #97a8be;
  }
}
</style>
