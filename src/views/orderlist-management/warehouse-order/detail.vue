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
              <el-dropdown
                v-if="custType === '3'"
                trigger="hover"
                @command="handlePrintDetail"
              >
                <el-button
                  type="primary"
                  size="mini"
                >
                  打印唛头
                  <i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    command="m1015"
                  >
                    打印唛头10*15
                  </el-dropdown-item>
                  <el-dropdown-item
                    command="m1010"
                  >
                    打印唛头10*10
                  </el-dropdown-item>
                  <el-dropdown-item
                    command="m1015new"
                  >
                    打印唛头10*15(新版)
                  </el-dropdown-item>
                  <el-dropdown-item
                    command="m1010new"
                  >
                    打印唛头10*10(新版)
                  </el-dropdown-item>
                  <el-dropdown-item
                    command="mA4-4"
                  >
                    打印唛头A4-4
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button
                v-if="custType === '3'"
                style="margin-left: 10px"
                type="primary"
                size="mini"
                @click="handlePrintDetail('wr')"
              >
                打印入仓单
              </el-button>
            </el-col>
          </el-row>
        </div>
        <div style="display: flex;flex-direction: row;padding: 0 20px;">
          <div style="flex: 1;">
            <el-form-item
              label="下单仓库："
              style="width: 33.33%;"
            >
              {{ form.warehouseName }}
            </el-form-item>
            <el-form-item
              v-if="form.type === 1"
              label="仓储周期："
              style="width: 33.33%;"
            >
              <span v-if="form.attribute === '0'">
                短期
              </span>
              <span v-else-if="form.attribute === '1'">
                长期
              </span>
            </el-form-item>
            <el-form-item
              v-if="form.type === 2"
              label="拼货方式："
              style="width: 33.33%;"
            >
              <span v-if="form.from === 'line'">
                全程
              </span>
              <span v-else-if="form.attribute === '1'">
                自拼货
              </span>
            </el-form-item>
            <el-form-item
              v-if="form.type === 3"
              label="打托方式："
              style="width: 33.33%;"
            >
              <span v-if="form.attribute === '0'">
                按目的仓
              </span>
              <span v-if="form.attribute === '1'">
                按分货唛头
              </span>
              <span v-else-if="form.attribute === '2'">
                按预约号
              </span>
            </el-form-item>
            <el-form-item
              label="出库/入库："
              style="width: 33.33%;"
            >
              <span v-if="form.io === 'O'">
                出库
              </span>
              <span v-else-if="form.io === 'I'">
                入库
              </span>
            </el-form-item>
            <el-form-item
              label="入库类型："
              style="width: 33.33%;"
            >
              <span v-if="form.source === '0'">
                普通入库
              </span>
              <span v-else-if="form.source === '1'">
                退件入库
              </span>
              <span v-else-if="form.source === '2'">
                调拨入库
              </span>
            </el-form-item>
            <el-form-item
              label="出入库模式："
              style="width: 33.33%;"
            >
              <span v-if="form.mode === '0'">
                整车
              </span>
              <span v-else-if="form.mode === '1'">
                整柜
              </span>
              <span v-else-if="form.mode === '2'">
                快递
              </span>
            </el-form-item>
            <el-form-item
              label="装货方式："
              style="width: 33.33%;"
            >
              <span v-if="form.loading === '0'">
                托盘
              </span>
              <span v-else-if="form.loading === '1'">
                箱子
              </span>
              <span v-else-if="form.loading === '2'">
                家具等超大件
              </span>
            </el-form-item>
            <el-form-item
              label="最大重量："
              style="width: 33.33%;"
            >
              {{ $volumeConversion(form.weight, form.umWeight, 'KGS') + 'kg' }}
            </el-form-item>
            <el-form-item
              label="最大尺寸："
              style="width: 33.33%;"
            >
              {{ $volumeConversion(form.volume, form.umLength, 'CM') + 'cm' }}
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
              style="width: 100%;"
              label="计划入库日期："
            >
              {{ timeSplice(form.inTime, '1') }}
            </el-form-item>
            <el-form-item
              label="计划入库时间："
              style="width: 100%;"
            >
              {{ timeSplice(form.inTime, '2') }}
            </el-form-item>
            <el-form-item
              label="包装及件数描述："
              style="width: 100%;"
            >
              {{ form.description }}
            </el-form-item>
          </div>
        </div>

        <div class="form-title">
          出入库信息
        </div>
        <div style="padding: 0 20px;">
          <el-form-item
            v-if="form.mode === '0'"
            label="车牌号："
          >
            {{ form.modeNo }}
          </el-form-item>
          <el-form-item
            v-else-if="form.mode === '1'"
            label="柜号："
          >
            {{ form.modeNo }}
          </el-form-item>
          <el-form-item
            v-else-if="form.mode === '2'"
            label="快递单号："
          >
            {{ form.modeNo }}
          </el-form-item>
          <el-form-item
            v-if="form.mode === '2'"
            label="快递公司："
          >
            {{ form.expressName }}
          </el-form-item>
          <el-form-item
            v-if="form.mode !== '2'"
            label="司机姓名："
          >
            {{ form.driver }}
          </el-form-item>
          <el-form-item
            v-if="form.mode !== '2'"
            label="证件号码："
          >
            <span v-if="form.certType === '0'">身份证</span>
            <span v-else-if="form.certType === '1'">护照</span>
            <span v-else-if="form.certType === '2'">港澳通行证</span>
            &nbsp;|&nbsp;
            <span>{{ form.certNo }}</span>
          </el-form-item>
          <el-form-item
            v-if="form.mode !== '2'"
            label="联系电话："
          >
            {{ form.phone }}
          </el-form-item>
        </div>

        <div class="form-title">
          货物信息
        </div>
        <div style="padding: 0 20px;">
          <el-form-item label="理论总箱数：">
            {{ form.packages }}
          </el-form-item>
          <el-form-item label="理论总重量：">
            <span>{{ $volumeConversion(form.weights, $getVolumeUnitByLengthUnit(form.umWeight), 'KGS') }} KGS</span>
          </el-form-item>
          <el-form-item label="理论总体积：">
            <span>{{ $volumeConversion(form.volumes, $getVolumeUnitByLengthUnit(form.umLength), 'CBM') }} CBM</span>
          </el-form-item>
        </div>
        <div style="padding: 0 20px;">
          <el-form-item label="实际总箱数：">
            {{ (form.measure || {}).packages }}
          </el-form-item>
          <el-form-item label="实际总重量：">
            <span>{{ (form.measure || {}).totalWeight }} KGS</span>
          </el-form-item>
          <el-form-item label="实际总体积：">
            <span>{{ $volumeConversion((form.measure || {}).totalVolume, 'CBCM', 'CBM') }} CBM</span>
          </el-form-item>
        </div>
        <div
          v-if="false"
          class="form-special"
        >
          <el-form-item label="操作费：">
            {{ form.xxx }}
          </el-form-item>
          <el-form-item label="附加服务：">
            {{ form.xxx }}
          </el-form-item>
          <el-form-item label="其他服务：">
            <el-popover
              placement="top"
              title="其他服务明细"
              width="500"
              trigger="click"
            >
              <el-table
                :data="otherData"
                height="300"
                border
                style="width: 100%;margin-top: 20px;"
              >
                <el-table-column
                  width="150"
                  property="name"
                  label="服务名称"
                />
                <el-table-column
                  width="100"
                  property="price"
                  label="单价"
                />
                <el-table-column
                  width="150"
                  property="account"
                  label="数量"
                />
                <el-table-column
                  width="150"
                  property="total"
                  label="合计"
                />
              </el-table>
              <div slot="reference">
                {{ form.xxx }}
              </div>
            </el-popover>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <print
      ref="print"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  getOrderDetails,
  getWarehouseExportFile
} from '@/api/orderlist-at-warehouse'
import dayjs from 'dayjs'
import print from '@/views/orderlist-management/whole-order/print/print.vue'

@Component({
  name: 'detail',
  components: {
    print
  },
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
        const { order: { batches, services, worder, measure } } = data
        this.form = {
          ...worder,
          measure
        }
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
  private volumesFilter(vol: any, umv: any) {
    if (umv === 'CBCM') {
      return (vol * 0.000001).toFixed(3)
    } else if (umv === 'CBM') {
      return (vol).toFixed(3)
    } else if (umv === 'CUIN') {
      return (vol * 0.0000164).toFixed(3)
    } else if (umv === 'CUFT') {
      return (vol * 0.0283168).toFixed(3)
    }
  }
  private handlePrintDetail(tag: string) {
    if (['m1015new', 'm1010new'].includes(tag)) {
      const printEl: any = this.$refs.print
      printEl.printInit(this.form.code, tag.replace('new', ''))
      return
    }
    if (tag === 'wr') {
      const { href } = this.$router.resolve({
        path: `/order-file`,
        query: { code: this.form.code }
      })
      window.open(href, '_blank')
      return
    }
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
