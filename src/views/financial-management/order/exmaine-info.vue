<template>
  <div class="examine-info">
    <div class="examine-info-top">
      <div>
        {{ examineData.warehouseName || '--' }}
        <span class="line">|</span>
        {{ examineData.operatorName || '--' }}
        <span class="line">|</span>
        {{ examineData.completeTime || '--' }}
      </div>
      <div
        v-if="examineData.validated === 0"
        class="status no"
      >
        不通过
      </div>
      <div
        v-if="examineData.validated === 1"
        class="status"
      >
        通过
      </div>
    </div>
    <div class="examine-result">
      <el-row style="margin-bottom: 10px">
        <el-col :span="3">
          <span>验货要求：</span>
        </el-col>
        <el-col :span="19">
          {{ examineData.examiningDesc || '--' }}
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="3">
          <span>验货属性：</span>
        </el-col>
        <el-col :span="19">
          {{ examineData.categoriesStr || '--' }}
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="3">
          <span>验货描述：</span>
        </el-col>
        <el-col :span="19">
          {{ examineData.examiningDesc || '--' }}
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="3">
          <span>验货图片：</span>
        </el-col>
        <el-col :span="19">
          <div class="good-img-list">
            <div
              v-for="item in (examineData.examineImage || '').split(',').filter(e => e)"
              :key="item"
              class="good-img"
            >
              <div class="img-wrap">
                <img
                  :src="ossPath + item"
                >
              </div>
              <div class="img-mask">
                <i
                  class="el-icon-view"
                  @click="previewImage(item)"
                />
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="3">
          <span>问题件：</span>
        </el-col>
        <el-col :span="19">
          <div class="good-img-list">
            <div
              v-for="item in (examineData.badImages || '').split(',').filter(e => e)"
              :key="item"
              class="good-img"
            >
              <div class="img-wrap">
                <img
                  :src="ossPath + item"
                >
              </div>
              <div class="img-mask">
                <i
                  class="el-icon-view"
                  @click="previewImage(item)"
                />
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'examine-info',
  components: {},
  props: {
    examineData: {
      type: Object,
      default: () => ({})
    },
    rowDetail: {
      type: Object,
      default: () => ({})
    }
  }
})
export default class extends Vue {
  /* data */
  private ossPath: any = process.env.VUE_APP_OSS_PATH
  /** comoputed */
  /* methods */
  private previewImage(url: any) {
    this.$emit('preview', url)
  }
}
</script>

<style lang="scss" scoped>
  .examine-info{
    width: 600px;
    padding: 16px 20px 20px 20px;
    font-family: Microsoft YaHei;
    .examine-info-top{
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      font-weight: 400;
      color: #333333;
      margin-bottom: 12px;
      .line{
        color: #BFDFFF;
        margin: 0 12px;
      }
      .status{
        color: #27BF1D;
        border: 1px solid #27BF1D;
        border-radius: 2px;
        padding: 3px 5px;
        background: rgba(39, 191, 29, 0.1);
        &.no{
          background: rgba(255, 71, 83, 0.1);
          color: #FF4753;
          border: 1px solid #FF4753;
        }
      }
    }
    .examine-result{
      font-size: 12px;
      font-weight: 400;
      color: #303133;
      span{
        color: #909399;
      }
      .good-img-list{
        display: flex;
        flex-wrap: wrap;
        .good-img{
          width: 56px;
          height: 56px;
          position: relative;
          margin-left: 8px;
          .img-wrap{
            width: 100%;
            height: 100%;
            overflow: hidden;
            position: relative;
            cursor: pointer;
            border-radius: 4px;
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
          &:first-child{
            margin-left: 0;
          }
        }
      }
    }
  }
</style>
