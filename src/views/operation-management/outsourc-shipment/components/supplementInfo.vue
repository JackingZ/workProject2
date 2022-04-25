<template>
  <div class="supplement-main">
    <div class="left-menu">
      <div
        v-for="item in menuList"
        :key="item.key"
        v-permission="item.permission"
        class="left-menu-item"
        :class="{active: item.key === activeKey}"
        @click="menuClick(item)"
      >
        {{ item.title }}
      </div>
    </div>
    <div class="right-table">
      <supplement-express
        v-show="activeKey === '1'"
        ref="supplementExpress"
        @goBack="goBack"
      />
      <supplement-metering
        v-show="activeKey === '2'"
        ref="supplementMetering"
        @goBack="goBack"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import supplementExpress from '@/views/operation-management/outsourc-shipment/components/supplementExpress.vue'
import supplementMetering from '@/views/operation-management/outsourc-shipment/components/supplementMetering.vue'

@Component({
  name: 'supplementInfo',
  components: {
    supplementExpress,
    supplementMetering
  }
})
export default class extends Vue {
  /* data */
  private activeKey: any = ''
  private menuList: any[] = [
    {
      title: '快递单数据',
      key: '1',
      permission: ['outsourcExpress']
    },
    {
      title: '计量数据',
      key: '2',
      permission: ['outsourcMetering']
    }
  ]
  private showRow: any = {}
  /* methods */
  private menuClick(item: any) {
    this.activeKey = item.key
    const supplementExpressRef: any = this.$refs.supplementExpress
    const supplementMeteringRef: any = this.$refs.supplementMetering
    switch (item.key) {
      case '1':
        supplementExpressRef.show(this.showRow)
        break
      case '2':
        supplementMeteringRef.show(this.showRow)
        break
    }
  }
  private show(row: any) {
    this.activeKey = '1'
    this.showRow = row
    const supplementExpressRef: any = this.$refs.supplementExpress
    supplementExpressRef.show(row)
  }
  private goBack() {
    this.activeKey = ''
    this.showRow = {}
    this.$emit('goBack')
  }
}
</script>

<style lang="scss" scoped>
  .supplement-main{
    width: 100%;
    height: 100%;
    padding: 24px;
    position: relative;
    .left-menu{
      position: absolute;
      left: 24px;
      top: 24px;
      background-color: #fff;
      width: 190px;
      height: calc(100% - 48px);
      border-right: 2px solid #E4E7ED;
      padding: 16px 0;
      .left-menu-item{
        font-size: 16px;
        line-height: 22px;
        color: #666666;
        padding: 12px 0 12px 32px;
        transition: all .5s;
        position: relative;
        cursor: pointer;
        &:hover{
          background-color: #ecf5ff;
          color: #409EFF;
        }
        &.active{
          background-color: #ecf5ff;
          color: #409EFF;
          &:before{
            height: 100%;
            width: 2px;
            background-color: #409EFF;
            position: absolute;
            top: 50%;
            right: -2px;
            transform: translateY(-50%);
            content: '';
          }
        }
      }
    }
    .right-table{
      width: 100%;
      padding-left: 190px;
      height: 100%;
      background-color: #fff;
    }
  }
</style>
