<template>
  <div class="panel-info">
    <div class="panel-info-title">
      <h3>{{ title }}</h3>
      <p>{{ info }}</p>
    </div>
    <div class="panel-info-option">
      <slot name="option" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Headinfo',
  props: {
    title: {
      type: String,
      default: ''
    },
    info: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-info {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: baseline;
  padding: 0 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #e8e8e8;
  border-radius: 5px 5px 0 0;
  .panel-info-title{
    display: flex;
    align-items: baseline;
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
}
</style>
