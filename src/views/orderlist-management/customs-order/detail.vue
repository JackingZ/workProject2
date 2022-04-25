<template>
  <div
    v-loading="detailLoading"
  >
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
            <el-col
              :span="20"
              style="text-align: right;"
            >
              <!-- <el-button
                v-if="custType === '3'"
                type="primary"
                size="mini"
                @click="handlePrintDetail('m1015')"
              >
                打印唛头
              </el-button>
              <el-button
                v-if="custType === '3'"
                type="primary"
                size="mini"
                @click="handlePrintDetail('wr')"
              >
                打印入仓单
              </el-button> -->
            </el-col>
          </el-row>
        </div>
        <div style="padding: 0 20px;">
          <el-form-item
            label="原单号："
            style="width: 33.33%;"
          >
            {{ form.buyerName }}
          </el-form-item>
          <el-form-item
            label="下单客户："
            style="width: 33.33%;"
          >
            {{ form.buyerName }}
          </el-form-item>
          <el-form-item
            label="业务类型："
            style="width: 33.33%;"
          >
            <span v-if="form.type === '0'">
              报关
            </span>
            <span v-else-if="form.type === '1'">
              报检
            </span>
            <span v-else-if="form.type === '2'">
              报关&报检
            </span>
          </el-form-item>
          <el-form-item
            label="进出口类型："
            style="width: 33.33%;"
          >
            <span v-if="form.dispatch === '0'">
              进口
            </span>
            <span v-else-if="form.dispatch === '1'">
              出口
            </span>
          </el-form-item>
          <el-form-item
            label="服务国家："
            style="width: 33.33%;"
          >
            {{ form.countryName }}
          </el-form-item>
          <el-form-item
            label="整柜/散货："
            style="width: 33.33%;"
          >
            <span v-if="form.dispatch === '0'">
              整柜
            </span>
            <span v-else-if="form.dispatch === '1'">
              散货
            </span>
          </el-form-item>
          <el-form-item
            label="是否手册："
            style="width: 33.33%;"
          >
            <span v-if="form.dispatch === '0'">
              否
            </span>
            <span v-else-if="form.dispatch === '1'">
              是
            </span>
          </el-form-item>

          <el-form-item
            label="报关类型："
            style="width: 33.33%;"
          >
            <span v-if="form.xxx === '0'">
              出口退税
            </span>
            <span v-if="form.xxx === '1'">
              普通报关
            </span>
            <span v-if="form.xxx === '2'">
              整柜买单
            </span>
          </el-form-item>
          <el-form-item
            label="出口口岸："
            style="width: 33.33%;"
          >
            {{ form.categories }}
          </el-form-item>
          <el-form-item
            label="订舱单(SO)："
            style="width: 33.33%;"
          >
            {{ form.xxx }}
          </el-form-item>
          <el-form-item
            label="柜号："
            style="width: 33.33%;"
          >
            {{ form.xxx }}
          </el-form-item>
          <el-form-item
            label="过磅重量："
            style="display: block;width: 100%;"
          >
            {{ form.xxx }}
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  getOrderDetails,
  getWarehouseExportFile
} from '@/api/orderlist-at-customs'
import dayjs from 'dayjs'
@Component({
  name: 'detail',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private detailLoading: boolean = false
  private form: any = {}
  private otherData: any[] = []
  /** computed */
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }

  /* 方法 */
  private setData(row: any) {
    const { id } = row
    this.getDetail(id)
  }

  private getDetail(id: string): void {
    // 查询
    this.detailLoading = true
    getOrderDetails({
      id
    })
      .then((res: any) => {
        const data = res.data || {}
        const { order: { batches, services, worder } } = data
        this.form = worder || {}
        this.detailLoading = false
      })
      .catch((err: any) => {
        this.detailLoading = false
        return [null, err]
      })
  }
  private timeSplice(val: any, num: any) {
    if (num === '1') {
      return val ? dayjs(val).format('YYYY-MM-DD') : ''
    } else if (num === '2') {
      return val ? dayjs(val).format('HH:mm:ss') : ''
    }
  }
  private volumesFilter(vol: any, len: any) {
    if (len === 'CM') {
      return (vol * 0.000001).toFixed(3)
    } else if (len === 'M') {
      return (vol).toFixed(3)
    } else if (len === 'INCH') {
      return (vol * 0.0000164).toFixed(3)
    } else if (len === 'FT') {
      return (vol * 0.0283168).toFixed(3)
    }
  }
  private handlePrintDetail(tag: any) {
    getWarehouseExportFile({
      tag
    }).then((res: any) => {
      const data = res.data || {}
      const url = data.ip + this.form.code
      window.open(url)
    }).catch((err: any) => {
      return [err, null]
    })
  }
}
</script>

<style lang="scss" scoped>
.order-detail {
  height: calc(100vh - 170px);
  overflow-y: auto;
}
.detail-back {
  text-align: right;
  padding: 0 20px;
  line-height: 50px;
  border-bottom: 1px solid #e8e8e8;
  background-color: #fff;
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
