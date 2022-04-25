<template>
  <div class="good-info">
    <div class="good-info-total">
      <div class="total-item">
        <span class="label">总件数</span>
        <span class="value">{{ (rowDetail.measure || {}).packages || '--' }}</span>
      </div>
      <div class="total-item">
        <span class="label">总体积(m³)</span>
        <span class="value">{{ $volumeConversion((rowDetail.measure || {}).totalVolume, 'CBCM', 'CBM') || '--' }}</span>
      </div>
      <div class="total-item">
        <span class="label">总重量(kg)</span>
        <span class="value">{{ (rowDetail.measure || {}).totalWeight || '--' }}</span>
      </div>
      <div class="total-item">
        <span class="label">总货值({{ (rowDetail.lscConfig || {}).declaredCurrency }})</span>
        <span class="value">{{ rowDetail.value || '--' }}</span>
      </div>
    </div>
    <div class="batch-list">
      <div
        v-for="(item, i) in batchList"
        :key="item.code"
        class="batch-item"
      >
        <div
          class="batch-item-header"
          @click="showGood(item)"
        >
          <div class="batch-no">
            批次{{ i + 1 }}
          </div>
          <div class="batch-info">
            总箱数&nbsp;&nbsp;&nbsp;&nbsp;{{ item.batchBoxNum }}
            <span class="line">|</span>
            单箱重量&nbsp;&nbsp;&nbsp;&nbsp;{{ item.weight }}{{ (rowDetail.um || {}).umWeight }}
            <span class="line">|</span>
            单箱长度&nbsp;&nbsp;&nbsp;&nbsp;{{ item.length }}{{ (rowDetail.um || {}).umLength }}
            <span class="line">|</span>
            单箱宽度&nbsp;&nbsp;&nbsp;&nbsp;{{ item.width }}{{ (rowDetail.um || {}).umLength }}
            <span class="line">|</span>
            单箱高度&nbsp;&nbsp;&nbsp;&nbsp;{{ item.height }}{{ (rowDetail.um || {}).umLength }}
          </div>
          <div
            class="icon"
          >
            <i :class="item.isOpen ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" />
          </div>
        </div>
        <el-collapse-transition>
          <div
            v-show="item.isOpen"
            class="goods-info"
          >
            <div class="good-header">
              <span class="good-header-item">商品名称</span>
              <span class="good-header-item">品牌/型号</span>
              <span class="good-header-item">材质</span>
              <span class="good-header-item">用途</span>
              <span class="good-header-item">单箱数量/单价</span>
              <span class="good-header-item">海关编码</span>
            </div>
            <div
              v-for="(good, index) in item.goods"
              :key="index"
              class="good-list"
              :class="{err: good.auditStatus === 2}"
            >
              <el-tooltip
                v-if="good.auditStatus === 2"
                effect="dark"
                :content="good.remarks"
                placement="top"
              >
                <div style="display: flex;align-items: center;flex: 1">
                  <div class="good-item">
                    <div class="good-img">
                      <div class="img-wrap">
                        <img
                          :src="ossPath + good.picture"
                        >
                      </div>
                      <div class="img-mask">
                        <i
                          class="el-icon-view"
                          @click="previewImage(good.picture)"
                        />
                      </div>
                      <div
                        class="good-err-icon"
                      />
                    </div>
                    <div class="text1">
                      {{ good.goodsName }}
                    </div>
                    <div class="text2">
                      {{ good.goodsAlias }}
                    </div>
                  </div>
                  <div class="good-item">
                    <div class="text1">
                      {{ good.brand }}
                    </div>
                    <div class="text2">
                      {{ good.model }}
                    </div>
                  </div>
                  <div class="good-item">
                    <div class="text1">
                      {{ good.materialZh }}
                    </div>
                    <div class="text2">
                      {{ good.materialEn }}
                    </div>
                  </div>
                  <div class="good-item">
                    <div class="text1">
                      {{ good.usageZh }}
                    </div>
                    <div class="text2">
                      {{ good.usageEn }}
                    </div>
                  </div>
                  <div class="good-item">
                    <div class="text1">
                      {{ good.quantity }}
                    </div>
                    <div class="text2">
                      {{ good.price }}
                    </div>
                  </div>
                  <div class="good-item">
                    <div class="text1">
                      {{ good.hsCode }}
                    </div>
                  </div>
                </div>
              </el-tooltip>
              <template v-else>
                <div class="good-item">
                  <div class="good-img">
                    <div class="img-wrap">
                      <img
                        :src="ossPath + good.picture"
                      >
                    </div>
                    <div class="img-mask">
                      <i
                        class="el-icon-view"
                        @click="previewImage(good.picture)"
                      />
                    </div>
                  </div>
                  <div class="text1">
                    {{ good.goodsName }}
                  </div>
                  <div class="text2">
                    {{ good.goodsAlias }}
                  </div>
                </div>
                <div class="good-item">
                  <div class="text1">
                    {{ good.brand }}
                  </div>
                  <div class="text2">
                    {{ good.model }}
                  </div>
                </div>
                <div class="good-item">
                  <div class="text1">
                    {{ good.materialZh }}
                  </div>
                  <div class="text2">
                    {{ good.materialEn }}
                  </div>
                </div>
                <div class="good-item">
                  <div class="text1">
                    {{ good.usageZh }}
                  </div>
                  <div class="text2">
                    {{ good.usageEn }}
                  </div>
                </div>
                <div class="good-item">
                  <div class="text1">
                    {{ good.quantity }}
                  </div>
                  <div class="text2">
                    {{ good.price }}
                  </div>
                </div>
                <div class="good-item">
                  <div class="text1">
                    {{ good.hsCode }}
                  </div>
                </div>
              </template>
            </div>
          </div>
        </el-collapse-transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'good-info',
  components: {},
  props: {
    rowDetail: {
      type: Object,
      default: () => ({})
    },
    batchList: {
      type: Array,
      default: () => ([])
    }
  }
})
export default class extends Vue {
  /* data */
  private ossPath: any = process.env.VUE_APP_OSS_PATH
  /* methods */
  private showGood(b: any) {
    this.$emit('showGood', b)
  }
  private previewImage(url: any) {
    this.$emit('preview', url)
  }
}
</script>

<style lang="scss" scoped>
  .good-info{
    padding: 16px 20px 20px 20px;
    font-family: Microsoft YaHei;
    .good-info-total{
      overflow: hidden;
      .total-item{
        float: left;
        margin-right: 50px;
        .label{
          font-size: 13px;
          font-weight: 400;
          color: #324770;
        }
        .value{
          margin-left: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #303133;
        }
        &:last-child{
          margin-right: 0;
        }
      }
    }
    .batch-list{
      margin-top: 20px;
      .batch-item{
        margin-bottom: 24px;
        .batch-item-header{
          border: 1px solid #BFDFFF;
          border-radius: 4px 4px 0 0;
          padding: 9px 16px;
          background: rgba(64, 158, 255, 0.09);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          cursor: pointer;
          .batch-no{
            font-size: 14px;
            font-weight: 600;
            color: #303133;
            position: relative;
            padding-left: 10px;
            &:before{
              width: 4px;
              height: 100%;
              background: #409EFF;
              position: absolute;
              top: 0;
              left: 0;
              content: '';
            }
          }
          .batch-info{
            font-size: 12px;
            font-weight: 400;
            color: #303133;
            margin-right: 45px;
            .line{
              color: #BFDFFF;
              margin: 0 25px;
            }
          }
          .icon{
            position: absolute;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            cursor: pointer;
          }
        }
        .goods-info{
          padding: 10px 16px;
          border: 1px solid #DCDFE6;
          border-top: none;
          border-radius: 0 0 4px 4px;
          .good-header{
            display: flex;
            padding: 8px 0;
            border-bottom: 4px solid #EBEEF5;
            font-size: 12px;
            font-weight: 600;
            color: #303133;
            .good-header-item{
              padding: 0 8px;
              &:nth-child(1){
                width: 200px;
              }
              &:nth-child(2){
                width: 100px;
              }
              &:nth-child(3){
                flex: 1;
              }
              &:nth-child(4){
                flex: 1;
              }
              &:nth-child(5){
                width: 100px;
              }
              &:nth-child(6){
                width: 100px;
              }
            }
          }
          .good-list{
            display: flex;
            align-items: center;
            border-bottom: 1px solid #EBEEF5;
            .good-item{
              padding: 8px;
              font-size: 12px;
              font-weight: 400;
              color: #303133;
              .good-img{
                width: 36px;
                height: 36px;
                position: absolute;
                top: 50%;
                left: 8px;
                transform: translateY(-50%);
                z-index: 99;
                .img-wrap{
                  width: 100%;
                  height: 100%;
                  overflow: hidden;
                  position: relative;
                  cursor: pointer;
                  img{
                    user-select: none;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    height: 100%;
                  }
                }
                .img-mask{
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  opacity: 0;
                  background: rgba(0, 0, 0, .3);
                  transition: opacity .3s;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: #fff;
                  i{
                    cursor: pointer;
                  }
                  &:hover{
                    opacity: 1;
                  }
                }
                .good-err-icon{
                  position: absolute;
                  width: 16px;
                  height: 16px;
                  background: url("../../../assets/imgs/good-warning.png") center center no-repeat;
                  background-size: 100%;
                  top: -5px;
                  right: -5px;
                }
              }
              .text1{
                width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .text2{
                color: #909399;
                width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-top: 4px;
              }
              &:nth-child(1){
                width: 200px;
                position: relative;
                padding-left: 50px;
              }
              &:nth-child(2){
                width: 100px;
              }
              &:nth-child(3){
                flex: 1;
              }
              &:nth-child(4){
                flex: 1;
              }
              &:nth-child(5){
                width: 100px;
              }
              &:nth-child(6){
                width: 100px;
              }
            }
            &.err{
              background: rgba(255, 71, 83, 0.1);
            }
          }
        }
        &:last-child{
          margin-bottom: 0;
        }
      }
    }
  }
</style>
