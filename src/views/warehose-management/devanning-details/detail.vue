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
      <div class="detail-devan">
        卸货申请单详细信息
      </div>
      <el-form
        ref="detail"
        :model="form"
        label-width="120px"
        class="detail-form"
      >
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="卸货申请单ID">
              {{ form.xhsqdid }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="柜号">
              {{ form.gh }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库名称">
              {{ form.ckmc }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="客户名称">
              {{ form.khmc }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              {{ form.zt }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="提柜时间">
              {{ form.tgsj }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="预计提柜时间">
              {{ form.yjtgsj }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预计清关时间">
              {{ form.yjqgsj }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预计入仓时间">
              {{ form.yjrcsj }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="实际入仓时间">
              {{ form.sjrcsj }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="完成时间">
              {{ form.wcsj }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请时间">
              {{ form.sqsj }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="order-title">
        <span style="float: left;">拆柜明细</span>
        <el-button
          type="primary"
          size="mini"
          @click="handleAddress"
        >
          相同地址合并打托
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="handleOriginal"
        >
          按原单号分别打托
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="handleFBAID"
        >
          按FBA ID分别打托
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="handleAdd"
        >
          添加问题件
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="handleDevanUnitSubmit"
        >
          统一提交
        </el-button>
      </div>
      <el-table
        :data="devanData"
        style="width: 100%;margin: 10px 0;"
        border
      >
        <el-table-column
          prop="ydh"
          label="收货仓库代码"
          min-width="150px"
        />
        <el-table-column
          prop="ydh"
          label="原单号/唛头"
          min-width="150px"
        />
        <el-table-column
          prop="si"
          label="SHIPMENT ID"
          min-width="150px"
        />
        <el-table-column
          prop="mri"
          label="MAZON REFERENCE ID"
          min-width="180px"
        />
        <el-table-column
          prop="xs"
          label="箱数(CTNS)"
          width="150px"
        />
        <el-table-column
          prop="mz"
          label="毛重(LBS)"
          width="150px"
        />
        <el-table-column
          prop="tj"
          label="体积(CBM)"
          width="150px"
        />
        <el-table-column
          prop="hz"
          label="货值"
        />
        <el-table-column
          prop="psfs"
          label="状态"
        />
        <el-table-column
          prop="psfs"
          label="类型"
          width="150px"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.psfs"
              placeholder="请选择"
              size="small"
              clearable
              style="width:130px;"
            >
              <el-option
                label="正常件"
                value="0"
              />
              <el-option
                label="问题件"
                value="1"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="scjs"
          label="实拆件数"
          width="150px"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.scjs"
              size="small"
              clearable
              style="width:130px;"
              placeholder="请输入"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="scjs"
          label="备注"
          width="150px"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.scjs"
              size="small"
              clearable
              style="width:130px;"
              placeholder="请输入"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="scjs"
          label="审核结果"
        />
        <el-table-column
          label="操作"
          width="200px"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleDevanSystem(scope.row)"
            >
              拆柜数据与系统一致
            </el-button>
            <el-button
              type="text"
              @click="handleDevanSubmit(scope.row)"
            >
              提交
            </el-button>
            <el-button
              type="text"
              @click="handleDevanImg(scope.row)"
            >
              查看图片
            </el-button>
            <el-button
              type="text"
              @click="handleDevanRepeatSubmit(scope.row)"
            >
              重新提交
            </el-button>
            <el-button
              type="text"
              @click="handleDevanPass(scope.row)"
            >
              通过
            </el-button>
            <el-button
              type="text"
              @click="handleDevanRefuse(scope.row)"
            >
              拒绝
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="stock-title">
        <span style="float: left;">托盘明细</span>
        <el-button
          type="primary"
          size="mini"
          @click="handleStockUnitSubmit"
        >
          统一提交
        </el-button>
      </div>
      <el-table
        :data="stockData"
        style="width: 100%;margin: 10px 0;"
        border
      >
        <el-table-column
          prop="ydh"
          label="收货仓库代码"
          min-width="150px"
        />
        <el-table-column
          prop="ydh"
          label="收货地址"
          min-width="150px"
        />
        <el-table-column
          prop="si"
          label="托盘批次号"
          min-width="150px"
        />
        <el-table-column
          prop="mri"
          label="状态"
          width="150px"
        />
        <el-table-column
          prop="xs"
          label="合计箱数(CTNS)"
          width="150px"
        />
        <el-table-column
          prop="mz"
          label="合计毛重(LBS)"
          width="150px"
        />
        <el-table-column
          prop="tj"
          label="合计体积(CBM)"
          width="150px"
        />
        <el-table-column
          prop="hz"
          label="货值"
        />
        <el-table-column
          prop="psfs"
          label="理论打托数量"
          width="150px"
        />
        <el-table-column
          prop="psfs"
          label="打托个数"
          width="150px"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.psfs"
              size="small"
              clearable
              style="width:130px;"
              placeholder="请输入"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="scjs"
          label="派送方式"
          width="150px"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.scjs"
              placeholder="请选择"
              size="small"
              clearable
              style="width:130px;"
            >
              <el-option
                label="卡派"
                value="0"
              />
              <el-option
                label="快递"
                value="1"
              />
              <el-option
                label="自提"
                value="2"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="scjs"
          label="送货费"
          width="150px"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.scjs"
              size="small"
              clearable
              style="width:130px;"
              placeholder="请输入"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="time"
          label="预计送货时间"
          width="200px"
        >
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="small"
              style="width: 180px;"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="scjs"
          label="送货追踪号"
          width="150px"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.scjs"
              size="small"
              clearable
              style="width:130px;"
              placeholder="请输入"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="scjs"
          label="送货公司"
          width="150px"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.scjs"
              size="small"
              clearable
              style="width:130px;"
              placeholder="请输入"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="scjs"
          label="照片"
          width="150px"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleSubmitCheck(scope.row)"
            >
              {{ scope.row.statu === 0 ? '点击上传' : '点击查看' }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="scjs"
          label="备注"
          width="150px"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.scjs"
              size="small"
              clearable
              style="width:130px;"
              placeholder="请输入"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="scjs"
          label="审核结果"
        />
        <el-table-column
          label="操作"
          width="200px"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleStockSubmit(scope.row)"
            >
              提交
            </el-button>
            <el-button
              type="text"
              @click="handleStockRepeatSubmit(scope.row)"
            >
              重新提交
            </el-button>
            <el-button
              type="text"
              @click="handleStockPass(scope.row)"
            >
              通过
            </el-button>
            <el-button
              type="text"
              @click="handleStockRefuse(scope.row)"
            >
              拒绝
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      width="600px"
      :visible.sync="dialogVisible"
      title="问题件"
    >
      <el-form
        :model="dialogForm"
        label-width="160px"
        class="dialog-form"
      >
        <el-form-item label="原单号/唛头">
          <el-input
            v-model="dialogForm.ydh"
            size="small"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="SHIPMENT ID">
          <el-input
            v-model="dialogForm.si"
            size="small"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="MAZON REFERENCE ID">
          <el-input
            v-model="dialogForm.mri"
            size="small"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="实拆个数">
          <el-input
            v-model="dialogForm.scgs"
            size="small"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="打托个数">
          <el-input
            v-model="dialogForm.dtgs"
            size="small"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="照片">
          <el-upload
            class="upload-demo"
            action="uploadUrl"
            :before-upload="handleBeforeUpload"
            :on-progress="handleProgress"
            :on-error="handleError"
            :on-success="handleSuccess"
          >
            <el-button
              size="small"
              type="text"
            >
              点击上传
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="dialogForm.bz"
            type="textarea"
            size="small"
            placeholder="请输入"
            :autosize="{minRows: 2, maxRows: 5}"
            clearable
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="handleSave"
        >
          保存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="问题件照片"
      :visible.sync="dialogImg"
      width="30%"
    >
      <div>
        照片
        <el-upload
          class="upload-demo"
          action="uploadUrl"
          :before-upload="handleBeforeUpload"
          :on-progress="handleProgress"
          :on-error="handleError"
          :on-success="handleSuccess"
        >
          <el-button
            size="small"
            type="text"
          >
            点击替换
          </el-button>
        </el-upload>
      </div>
      <img
        src=""
        class="dialog-img"
      >
      <span slot="footer">
        <el-button @click="handleImgCancel">取 消</el-button>
        <el-button
          type="primary"
          @click="handleImgSubmit"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'detail',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private form = {
    xhsqdid: undefined,
    gh: undefined,
    zt: undefined,
    ckmc: undefined,
    khmc: undefined,
    tgsj: undefined,
    yjtgsj: undefined,
    yjqgsj: undefined,
    yjrcsj: undefined,
    sjrcsj: undefined,
    wcsj: undefined,
    sqsj: undefined
  }
  private devanData = [
    {
      ydh: 'R129379234',
      si: 'S23492309',
      mri: 'MZ8129127',
      xs: '100',
      mz: '200',
      tj: '5',
      hz: '5000',
      psfs: '快递',
      scjs: '100'
    }
  ]
  private stockData = [
    {
      ydh: 'R129379234',
      si: 'S23492309',
      mri: 'MZ8129127',
      xs: '100',
      mz: '200',
      tj: '5',
      hz: '5000',
      psfs: '快递',
      scjs: '100'
    }
  ]

  private dialogVisible = false
  private dialogImg = false
  private uploadUrl = ''
  private dialogForm = {
    ydh: undefined,
    si: undefined,
    mri: undefined,
    scgs: undefined,
    dtgs: undefined,
    bz: undefined,
    yjshsj: undefined,
    pslx: undefined,
    shf: undefined,
    shgs: undefined,
    shzzh: undefined
  }
  /* 方法 */
  private setData(val: any): void {
    // 设置值
    this.form = val
  }

  private handleAddress(): void {
    // 相同合同地址打托
  }
  private handleOriginal(): void {
    // 原单号打托
  }
  private handleFBAID(): void {
    // FBAID打托
  }
  private handleAdd(): void {
    // 新增问题件
    this.dialogVisible = true
  }
  private handleDevanUnitSubmit(): void {
    // 统一提交
  }
  private handleDevanSystem(): void {
    // 拆柜数据与系统一致
  }
  private handleDevanSubmit(): void {
    // 提交
  }
  private handleDevanImg(): void {
    // 查看图片
    this.dialogImg = true
  }
  private handleDevanRepeatSubmit(): void {
    // 重新提交
  }
  private handleDevanPass(): void {
    // 通过
  }
  private handleDevanRefuse(): void {
    // 拒绝
  }
  private handleBeforeUpload(): void {
    // 上传前
  }
  private handleProgress(): void {
    // 上传时
  }
  private handleError(): void {
    // 上传报错
  }
  private handleSuccess(): void {
    // 上传成功
  }
  private handleSave(): void {
    // 保存
    this.dialogVisible = false
  }
  private handleImgCancel(): void {
    // 取消图片
  }
  private handleImgSubmit(): void {
    // 保存图片
  }
  private handleStockUnitSubmit(): void {
    // 统一提交
  }
  private handleStockSubmit(): void {
    // 提交
  }
  private handleStockRepeatSubmit(): void {
    // 重新提交
  }
  private handleStockPass(): void {
    // 通过
  }
  private handleStockRefuse(): void {
    // 拒绝
  }
  private handleSubmitCheck(): void {
    // 点击查看/提交
  }
}
</script>

<style lang="scss" scoped>
.order-detail {
  height: calc(100vh - 170px);
  overflow-y: auto;
}

.detail-back {
  padding: 0 20px;
  line-height: 50px;
  border-bottom: 1px solid #e8e8e8;
  background-color: #fff;
}
.detail-devan {
  background: rgb(231, 231, 231);
  padding: 5px 20px;
  margin-bottom: 20px;
  line-height: 35px;
  font-size: 18px;
  font-weight: 700;
}
.detail-order {
  padding: 0 20px;
}
.order-title {
  line-height: 50px;
  border-top: 1px solid #e8e8e8;
  text-align: right;
}
.stock-title {
  line-height: 50px;
  text-align: right;
}
.detail-form {
  padding: 0 50px;
  label {
    font-weight: 700 !important;
  }
}
.dialog-form {
  padding: 0 30px 0 10px;
}
.dialog-img {
  display: block;
  width: 400px;
  height: 300px;
}

</style>
