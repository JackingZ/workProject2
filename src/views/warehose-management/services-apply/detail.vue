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
      <div class="detail-service">
        <span style="float: left;">增值服务申请单详细信息</span>
        <el-button
          v-if="status === '0'"
          type="primary"
          size="mini"
          @click="handleSave"
        >
          保存
        </el-button>
        <el-button
          v-if="status !== '0'"
          type="primary"
          size="mini"
          @click="handlePass(status)"
        >
          通过
        </el-button>
        <el-button
          v-if="status !== '0'"
          size="mini"
          @click="handleRefuse(status)"
        >
          拒绝
        </el-button>
        <el-button
          v-if="status === '2'"
          size="mini"
          @click="handleRefresh"
        >
          重新提交
        </el-button>
      </div>
      <el-form
        ref="detail"
        :model="form"
        label-width="150px"
        class="detail-form"
      >
        <div v-if="status === '0'">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="增值服务申请单ID">
                <el-input
                  v-model="form.zzfwsqdid"
                  size="small"
                  placeholder="请输入"
                  clearable
                />
              </el-form-item>
              <el-form-item label="客户名称">
                <el-select
                  v-model="form.khmc"
                  placeholder="请选择"
                  size="small"
                  clearable
                  style="width:100%;"
                >
                  <el-option
                    v-for="item in customerOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="原单号">
                <el-input
                  v-model="form.ydh"
                  size="small"
                  placeholder="请输入"
                  clearable
                />
              </el-form-item>
              <el-form-item label="服务类型">
                <el-select
                  v-model="form.fwlx"
                  placeholder="请选择"
                  size="small"
                  style="width: 100%;"
                  clearable
                >
                  <el-option
                    label="分箱"
                    value="0"
                  />
                  <el-option
                    label="合箱"
                    value="1"
                  />
                  <el-option
                    label="贴标"
                    value="2"
                  />
                  <el-option
                    label="贴唛"
                    value="3"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="仓库名称">
                <el-select
                  v-model="form.ckmc"
                  placeholder="请选择"
                  size="small"
                  clearable
                  style="width:100%;"
                >
                  <el-option
                    v-for="item in storeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="form.bz"
                  size="small"
                  placeholder="请输入"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-else>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="增值服务申请单ID">
                {{ form.sqr }}
              </el-form-item>
              <el-form-item label="客户名称">
                {{ form.sqr }}
              </el-form-item>
              <el-form-item label="申请人">
                {{ form.sqr }}
              </el-form-item>
              <el-form-item label="状态">
                {{ form.zt }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="原单号">
                {{ form.sqr }}
              </el-form-item>
              <el-form-item label="服务类型">
                {{ form.sqr }}
              </el-form-item>
              <el-form-item label="申请时间">
                {{ form.sqsj }}
              </el-form-item>
              <el-form-item label="完成总数">
                {{ form.wczs }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="仓库名称">
                {{ form.sqr }}
              </el-form-item>
              <el-form-item label="备注">
                {{ form.sqr }}
              </el-form-item>
              <el-form-item label="执行人">
                {{ form.zxr }}
              </el-form-item>
              <el-form-item label="照片">
                <img
                  src=""
                  alt=""
                >
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            v-if="status === '1'"
            :gutter="10"
          >
            <el-col :span="8">
              <el-form-item label="客户确认">
                {{ form.khqr }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="审核结果">
                {{ form.shjg }}
              </el-form-item>
              <el-form-item label="审核人">
                {{ form.shjg }}
              </el-form-item>
              <el-form-item label="审核时间">
                {{ form.shjg }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="代理商审核结果">
                {{ form.shjg }}
              </el-form-item>
              <el-form-item label="代理商审核人">
                {{ form.shjg }}
              </el-form-item>
              <el-form-item label="代理商审核时间">
                {{ form.shjg }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="仓库审核结果">
                {{ form.shjg }}
              </el-form-item>
              <el-form-item label="仓库审核人">
                {{ form.shjg }}
              </el-form-item>
              <el-form-item label="仓库审核时间">
                {{ form.shjg }}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div class="order-title">
        <div v-if="status === '0'">
          <span>选择货箱</span>
          <el-radio-group
            v-model="radio"
            style="margin-left: 10px;"
          >
            <el-radio :label="'0'">
              全部货箱
            </el-radio>
            <el-radio :label="'1'">
              部分货箱
            </el-radio>
          </el-radio-group>
        </div>
        <div>货箱列表</div>
      </div>
      <el-form
        ref="sum"
        :model="sumForm"
        label-width="150px"
        label-position="right"
        class="sum-form"
        onsubmit="return false;"
      >
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="当前总件数">
              {{ sumForm.dqzjs }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <div style="text-align: right;">
              <el-button
                v-if="status === '0'"
                type="primary"
                size="mini"
                @click="handleBatchDelete"
              >
                批量删除
              </el-button>
              <el-button
                v-if="status === '2'"
                type="primary"
                size="mini"
                @click="handlePass(status)"
              >
                通过
              </el-button>
              <el-button
                v-if="status === '2'"
                type="primary"
                size="mini"
                @click="handleRefuse(status)"
              >
                拒绝
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        :data="tableData"
        style="width: 100%;margin: 10px 0;"
        border
        @selection-change="handleSelection"
      >
        <el-table-column
          v-if="status === '0'"
          type="selection"
          width="55"
        />
        <el-table-column
          prop="xh"
          label="箱号"
        />
        <el-table-column
          prop="tj"
          label="体积（m³）"
        />
        <el-table-column
          prop="zl"
          label="重量（kg）"
        />
        <el-table-column
          v-if="status !== '0'"
          prop="zt"
          label="状态"
        />
        <el-table-column
          v-if="status === '0'"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              style="color: #f56c6c;"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
    zzfwsqdid: undefined,
    zt: undefined,
    ckmc: undefined,
    khmc: undefined,
    ydh: undefined,
    fwlx: undefined,
    bz: undefined,
    sqr: undefined,
    sqsj: undefined,
    zxr: undefined,
    wczs: undefined,
    khqr: undefined
  }
  private storeOptions: any = []
  private customerOptions: any = []
  private sumForm = {
    dqzjs: undefined
  }
  private radio = '0'
  private tableData = [
    {
      xh: '1',
      tj: 'X12397',
      zl: '100',
      zt: '20'
    }
  ]
  private status = '0'

  /* 方法 */
  private setData(val: any): void {
    // 设置值
    this.form = val
  }
  private setStatus(val: any): void {
    // 默认0新增，详情分人员区别1，2
    this.status = val
  }
  private handleSelection(): void {
    // 勾选
  }
  private handleDelete(): void {
    // 删除
  }
  private handleSave(): void {
    // 保存
  }
  private handlePass(val: any): void {
    // 通过
  }
  private handleRefuse(val: any): void {
    // 拒绝
  }
  private handleRefresh(val: any): void {
    // 重新提交
  }
  private handleBatchDelete(): void {
    // 批量删除
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
  .detail-service {
    background: rgb(231, 231, 231);
    padding: 5px 20px;
    margin-bottom: 20px;
    line-height: 35px;
    font-size: 18px;
    font-weight: 700;
    text-align: right;
  }
  .detail-order {
    padding: 0 20px;
  }
  .order-title {
    line-height: 50px;
    border-top: 1px solid #e8e8e8;
  }
  .detail-form {
    padding: 0 50px;
    .el-form-item__label {
      font-weight: 700 !important;
    }
  }
  .sum-form {
    .el-form-item__label {
      font-weight: 700 !important;
    }
    .el-form-item {
      margin-bottom: 0px;
    }
  }
  .el-radio__label {
    padding-left: 0px;
  }
  .el-radio {
    margin-right: 15px;
  }
</style>
