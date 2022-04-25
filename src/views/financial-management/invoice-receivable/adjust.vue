<template>
  <div>
    <el-row>
      <el-col :span="4">
        <span style="font-weight: 700;padding-left: 20px;">总计抵扣金额：</span>
        <span>{{ totalAccount }}</span>
      </el-col>
      <el-col :span="20">
        <div style="text-align: right;">
          <el-button
            type="primary"
            size="mini"
            @click="handleInvoice"
          >
            选择发票
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%;margin: 10px 0;"
      header-align="center"
      align="center"
      border
    >
      <el-table-column
        prop="xh"
        label="行号"
      />
      <el-table-column
        prop="tj"
        label="开票日期"
        width="160"
      />
      <el-table-column
        prop="zl"
        label="发票编号"
      />
      <el-table-column
        prop="cksx"
        label="原单号"
      />
      <el-table-column
        prop="ydh"
        label="渠道"
      />
      <el-table-column
        prop="xs"
        label="货币"
      />
      <el-table-column
        prop="xs"
        label="汇率"
      />
      <el-table-column
        prop="xs"
        label="金额"
      />
      <el-table-column
        prop="xs"
        label="本币金额"
      />
      <el-table-column
        fixed="right"
        width="100px"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-if="isEdit"
            type="text"
            style="color: #f56c6c;"
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 20px 0;text-align: right;">
      <el-button @click="close">
        取 消
      </el-button>
      <el-button
        type="primary"
        @click="confirm"
      >
        确 定
      </el-button>
    </div>

    <el-dialog
      title="选择发票"
      :visible.sync="isInvoice"
      :close-on-click-modal="false"
      append-to-body
      width="1000px"
      @closed="isInvoice = false; invoice = ''"
    >
      <div style="text-align: right;">
        <el-input
          v-model="invoice"
          placeholder="发票"
          style="width: 240px;margin-right:10px;"
          size="small"
        />
        <el-button
          type="primary"
          size="small"
          @click="getInvoiceList"
        >
          查询
        </el-button>
      </div>
      <el-table
        v-loading="dialogLoading"
        :data="invoiceData"
        border
        height="300px"
        style="width: 100%;margin: 10px 0;"
        @selection-change="handleInvoiceSelection"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop=""
          label="发票编号"
        />
        <el-table-column
          prop=""
          label="原单号"
        />
        <el-table-column
          prop="postal"
          label="开票日期"
        />
        <el-table-column
          prop=""
          label="逾期天数"
        />
        <el-table-column
          prop=""
          label="付款方式"
        />
        <el-table-column
          prop=""
          label="货币"
        />
        <el-table-column
          prop=""
          label="汇率"
        />
        <el-table-column
          prop=""
          label="金额"
        />
        <el-table-column
          prop=""
          label="本币金额"
        />
      </el-table>
      <el-pagination
        :current-page.sync="page"
        :page-size="size"
        layout="total, prev, pager, next"
        :total="total"
        style="text-align: right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: '',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private tableData: any = []
  private loading = false
  private totalAccount = ''
  private isInvoice: boolean = false
  private dialogLoading: boolean = false
  private invoice = ''
  private invoiceData: any[] = []
  private total = 0
  private page = 1
  private size = 10

  /* methods */
  private handleInvoice() {
    // xxx
  }
  private handleDelete() {
    // zzz
  }
  private close() {
    // zzz
  }
  private confirm() {
    // zzz
  }
  private getInvoiceList() {
    // zzz
  }
  private handleInvoiceSelection() {
    // zzz
  }
  private handleSizeChange() {
    // zzz
  }
  private handleCurrentChange() {
    // zzz
  }
}
</script>
