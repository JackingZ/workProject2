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
      <div class="detail-charge">
        卸货申请单详细信息
      </div>
      <el-form
        ref="detail"
        :model="form"
        label-width="140px"
        label-position="right"
        style="padding: 0 20px;"
      >
        <el-form-item label="卸货申请单ID：">
          {{ form.unloadNo }}
        </el-form-item>
        <el-form-item label="仓库名称：">
          {{ form.warehouseName }}
        </el-form-item>
        <!-- <el-form-item label="客户名称：">
          {{ form.custName }}
        </el-form-item>
        <el-form-item label="排队序号：">
          {{ form.lineNo }}
        </el-form-item> -->
        <el-form-item label="操作人：">
          {{ form.executorName }}
        </el-form-item>
        <el-form-item label="申请人：">
          {{ form.assignorName }}
        </el-form-item>
        <el-form-item label="申请时间：">
          {{ form.createTime }}
        </el-form-item>
        <el-form-item label="卸货类型：">
          <span v-if="form.unloadType === 1">
            整车
          </span>
          <span v-else-if="form.unloadType === 2">
            整柜
          </span>
          <span v-else-if="form.unloadType === 3">
            快递
          </span>
        </el-form-item>
        <el-form-item
          label="车牌/柜/快递单号："
        >
          {{ form.licenseNo }}
        </el-form-item>
        <el-form-item
          v-if="form.unloadType === 3"
          label="快递公司："
        >
          {{ form.expressName }}
        </el-form-item>
        <el-form-item
          v-if="form.unloadType !== 3"
          label="司机姓名："
        >
          {{ form.driversName }}
        </el-form-item>
        <el-form-item
          v-if="form.unloadType !== 3"
          label="司机联系电话："
        >
          {{ form.driversMobile }}
        </el-form-item>
        <el-form-item label="预计卸货时间：">
          {{ form.expectedUnloadTime }}
        </el-form-item>
        <el-form-item label="预计卸货口：">
          {{ form.expectedWcName }}
        </el-form-item>
        <el-form-item label="仓库对接人：">
          {{ form.warehouseContactPerson }}
        </el-form-item>
        <el-form-item label="实际卸货时间：">
          {{ form.actualUnloadStartTime }}
        </el-form-item>
        <el-form-item label="卸货完成时间：">
          {{ form.actualUnloadEndTime }}
        </el-form-item>
        <el-form-item label="状态：">
          <span v-if="form.unloadStatus === 1">
            待卸货
          </span>
          <span v-else-if="form.unloadStatus === 2">
            卸货中
          </span>
          <span v-else-if="form.unloadStatus === 3">
            已完成
          </span>
          <span v-else-if="form.unloadStatus === 4">
            已取消
          </span>
        </el-form-item>
        <!-- <div>
          <el-form-item label="仓库签字：">
            <img
              src=""
              class="detail-img"
            >
          </el-form-item>
          <el-form-item label="送货人签字：">
            <img
              src=""
              class="detail-img"
            >
          </el-form-item>
          <el-form-item label="车牌图片：">
            <img
              src=""
              class="detail-img"
            >
          </el-form-item>
        </div> -->
      </el-form>
      <div style="line-height: 50px;border-top: 1px solid #e8e8e8;">
        订单签收单
      </div>
      <el-table
        :data="tableData"
        style="width: 100%;margin: 10px 0;"
        border
      >
        <el-table-column
          prop="originalNo"
          label="原单号"
        />
        <el-table-column
          prop="totalNumber"
          label="收货件数"
        />
        <el-table-column
          prop="problemNumber"
          label="问题件箱数"
        />
        <el-table-column label="问题件照片">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.problemNumber"
              type="text"
              @click="handleImg(scope.row)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="问题件照片"
      :visible.sync="dialogImg"
      :close-on-click-modal="false"
      width="800px"
    >
      <div
        v-if="imgList.length"
        style="height: 500px; overflow-y: auto;"
      >
        <img
          v-for="(item, index) in imgList"
          :key="index"
          :src="httpUrl + item"
          width="100%"
          height="100%"
          style="height: 500px;"
        >
      </div>
      <div v-else>
        暂无问题件照片
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getUnloadById
} from '@/api/warehose-by-config'
@Component({
  name: 'detail',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private detailLoading: boolean = false
  private form: any = {
    actualUnloadEndTime: undefined,
    actualUnloadStartTime: undefined,
    cabinetNo: undefined,
    createTime: undefined,
    custName: undefined,
    driversMobile: undefined,
    driversName: undefined,
    expectedUnloadTime: undefined,
    expectedWcName: undefined,
    id: undefined,
    licenseNo: undefined,
    lineNo: undefined,
    unloadNo: undefined,
    unloadStatus: undefined,
    unloadType: undefined,
    warehouseContactPerson: undefined,
    warehouseName: undefined,
    wcName: undefined
  }
  private tableData = []
  private dialogImg: boolean = false
  private imgList: any[] = []
  private httpUrl = process.env.VUE_APP_OSS_PATH

  /* 方法 */
  private setData(val: any): void {
    // 设置值
    this.handleSearch(val.id || '')
  }
  private handleSearch(id: string): void {
    // 查询
    this.detailLoading = true
    getUnloadById({
      id
    })
      .then(res => {
        const data = res.data || {}
        const { list, ...form } = data
        this.form = {
          ...form
        }
        this.tableData = list || []
        this.detailLoading = false
      })
      .catch(err => {
        this.detailLoading = false
        return [null, err]
      })
  }
  private handleImg(row: any): void {
    // 查看
    const qcImg = row.qcImage || ''
    if (qcImg) {
      this.imgList = qcImg.split(',')
    } else {
      this.imgList = []
    }
    this.dialogImg = true
  }
}
</script>

<style lang="scss" scoped>
// ::v-deep .el-form-item__label {
//   font-weight: 700 !important;
// }
::v-deep .el-form-item {
  vertical-align: top;
  display: inline-block;
  width: 24.9%;
  margin-bottom: 0px;
}
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
.detail-charge {
  background: rgb(231, 231, 231);
  padding: 0px 20px;
  margin-bottom: 10px;
  line-height: 35px;
  font-size: 16px;
  font-weight: 700;
}
.dialog-img {
  display: block;
  width: 400px;
  height: 300px;
  margin: 0 auto;
}
.detail-img {
  display: block;
  width: 150px;
  height: 100px;
}

</style>
