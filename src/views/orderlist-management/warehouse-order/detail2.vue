<template>
  <div>
    <div class="detail-back">
      <span
        style="cursor: pointer;"
        @click="$emit('back')"
      >
        <i class="el-icon-back" />
        <span>返回</span>
      </span>
    </div>
    <div class="app-panel order-detail">
      <el-form
        ref="detail"
        :model="form"
        label-width="130px"
        label-position="right"
        class="detail-form"
      >
        <div class="form-title">
          <el-row>
            <el-col :span="4">
              基础信息
            </el-col>
          </el-row>
        </div>
        <div style="display: flex;flex-direction: row;padding: 0 20px;">
          <div style="flex: 1;">
            <el-form-item
              label="下单仓库："
              style="width: 33.33%;"
            >
              {{ (form.warehouse || {}).name }}
            </el-form-item>
            <el-form-item
              v-if="form.deliverType !== '2'"
              label="打托方式："
              style="width: 33.33%;"
            >
              <span v-if="form.palletType + '' === '0'">
                按目的仓
              </span>
              <span v-if="form.palletType + '' === '1'">
                按分货唛头
              </span>
              <span v-else-if="form.palletType + '' === '2'">
                按预约号
              </span>
            </el-form-item>
            <el-form-item
              label="出库/入库："
              style="width: 33.33%;"
            >
              <span>
                入库
              </span>
            </el-form-item>
            <el-form-item
              label="入库类型："
              style="width: 33.33%;"
            >
              <span v-if="form.warehouseType === 0">
                普通入库
              </span>
              <span v-else-if="form.warehouseType === 1">
                退件入库
              </span>
              <span v-else-if="form.warehouseType === 2">
                调拨入库
              </span>
            </el-form-item>
            <el-form-item
              label="出入库模式："
              style="width: 33.33%;"
            >
              <span>
                整柜
              </span>
            </el-form-item>
            <el-form-item
              label="装货方式："
              style="width: 33.33%;"
            >
              <span v-if="form.loadingType +'' === '1'">
                托盘
              </span>
              <span v-else-if="form.loadingType + '' === '0'">
                箱子
              </span>
              <span v-else-if="form.loadingType + '' === '2'">
                家具等超大件
              </span>
            </el-form-item>
            <el-form-item
              label="最大重量："
              style="width: 33.33%;"
            >
              {{ form.weightMax }} {{ form.weightMaxUnit }}
            </el-form-item>
            <el-form-item
              label="备注："
              style="display: block;width: 100%;"
            >
              {{ form.remark }}
            </el-form-item>
          </div>
          <div style="width: 2px;background-color: #ccc;margin: 0 10px;" />
          <div style="width: 400px;">
            <el-form-item
              label="计划入库时间："
              style="width: 100%;"
            >
              {{ form.warehousingTime }}
            </el-form-item>
            <el-form-item
              label="备注："
              style="width: 100%;"
            >
              {{ form.remarks }}
            </el-form-item>
          </div>
        </div>

        <div class="form-title">
          出入库信息
        </div>
        <div style="padding: 0 20px;">
          <el-form-item
            label="柜号："
          >
            {{ form.cabinetNumber }}
          </el-form-item>
          <el-form-item
            label="司机姓名："
          >
            {{ form.driverName }}
          </el-form-item>
          <el-form-item
            label="证件号码："
          >
            <span v-if="form.certificateType + '' === '0'">身份证</span>
            <span v-else-if="form.certificateType + '' === '1'">护照</span>
            <span v-else-if="form.certificateType + '' === '2'">港澳通行证</span>
            &nbsp;|&nbsp;
            <span>{{ form.driverCertificate }}</span>
          </el-form-item>
          <el-form-item
            label="联系电话："
          >
            {{ form.phone }}
          </el-form-item>
        </div>

        <div class="form-title">
          货物信息
        </div>
        <div style="padding: 0 20px;">
          <el-form-item label="总箱数：">
            {{ form.totalBox }}
          </el-form-item>
          <el-form-item label="总重量：">
            <span>{{ form.totalWeight }} {{ (form.um || {}).umWeight }}</span>
          </el-form-item>
          <el-form-item label="总体积：">
            <span>{{ form.totalVolume }} {{ (form.um || {}).umVolume }}</span>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import dayjs from 'dayjs'
@Component({
  name: 'detail',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private form: any = {}
  /** computed */
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }

  /* 方法 */
  private setData(row: any) {
    this.form = row
  }
}
</script>

<style lang="scss" scoped>
.detail-back {
  text-align: right;
  padding: 0 20px;
  line-height: 50px;
  border-bottom: 1px solid #e8e8e8;
  background-color: #fff;
}
.order-detail {
  height: calc(100vh - 170px);
  overflow-y: auto;
}
.detail-form {
  // ::v-deep .el-form-item__label {
  //   font-weight: 700 !important;
  // }
  .el-form-item {
    vertical-align: top;
    display: inline-block;
    width: 24.9%;
    margin-bottom: 0px;
  }
}
.form-title {
  height: 35px;
  line-height: 35px;
  font-size: 16px;
  font-weight: 700;
  background: #f2f2f2;
  padding-left: 20px;
  margin: 10px 0;
}
.form-special {
  background: #f2f2f2;
  padding: 10px 20px;
}
</style>
