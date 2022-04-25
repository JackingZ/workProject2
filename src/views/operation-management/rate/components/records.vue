<template>
  <el-dialog
    :title="title"
    :before-close="onClosing"
    :close-on-click-modal="false"
    :visible.sync="showDialogA"
    width="960px"
  >
    <el-form
      ref="theForm"
      v-loading="addLoading"
      :model="theForm"
      :inline="true"
      :rules="formRules"
      style="padding-right: 20px;"
      size="small"
    >
      <el-form-item
        prop="effective"
        label="生效日期"
      >
        <el-date-picker
          v-model="theForm.effective"
          type="date"
          placeholder="Pick a day"
          value-format="yyyy-MM-dd"
        >
          />
        </el-date-picker>
      </el-form-item>
      <el-form-item
        prop=""
        label="保留小数"
      >
        <el-input-number
          v-model="decimals"
          placeholder="请输入汇率"
          controls-position="right"
          :min="2"
          :max="5"
          :step="1"
          step-strictly
        />
      </el-form-item>
      <el-form-item
        prop="rate"
        label="汇率"
      >
        <el-input-number
          v-model="theForm.rate"
          placeholder="请输入汇率"
          controls-position="right"
          :min="decimals === 2 ? 0.00 : 0.00000"
          :precision="decimals"
        />
      </el-form-item>

      <el-form-item>
        <el-button @click="reset">
          清 空
        </el-button>
        <el-button
          type="primary"
          @click="addTableItem"
        >
          {{ !!theForm.id ? '保 存' : '新 增' }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="list"
      height="450px"
      style="width: 100%;margin: 10px 0;"
      border
    >
      <el-table-column
        label="生效日期"
        prop="effective"
      />

      <el-table-column
        label="汇率"
        prop="rate"
      />

      <el-table-column
        label="操作"
        fixed="right"
        width="180"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="medium"
            @click="editTableItem(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            size="medium"
            @click="deleteTableItem(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page.sync="page"
      :page-size="size"
      layout="total, prev, pager, next"
      :total="total"
      style="text-align: right;"
      @current-change="getTableList"
    />
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  saveExRate as addTableItem,
  deleteExRate as deleteTableItem,
  getExRateList as getTableList
} from '@/api/operation-of-rate'

@Component({
  name: 'Records',
  components: { },
  props: {
  }
})
export default class extends Vue {
  /* data */
  private showDialogA: boolean = false
  private addLoading: boolean = false
  private loading: boolean = false

  private title: string = ''
  private decimals: number = 2
  private list: any = []

  private theForm = {
    'effective': '',
    'exchangeId': '',
    'id': '',
    'rate': 0
  }
  private formRules = {
    effective: [{ required: true, message: '请选择生效日期' }],
    rate: [{ required: true, message: '请输入汇率' }]
  }

  private page: number = 1
  private size: number = 10
  private total: any = 0
  /* computed */

  get labelPosition() {
    const lang = AppModule.language
    if (!lang) {
      return 'left'
    }
    return lang === 'en' ? 'top' : 'left'
  }

  get lang() {
    const lang = AppModule.language
    if (!lang) {
      return 'en'
    }
    return lang
  }
  /* created */

  /* methods */

  // 查询列表
  private getTableList(): void {
    this.loading = true
    const { page, size } = this
    const params = {
      page,
      size,
      exchangeId: this.theForm.exchangeId
    }
    getTableList(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        const { total, result } = data
        this.total = total
        this.list = result
      })
      .catch(err => {
        this.loading = false
        return err
      })
  }

  // 保存表单
  private addTableItem(): void {
    (this.$refs.theForm as any).validate((valid: any) => {
      if (valid) {
        this.addLoading = true
        const { theForm } = this
        const params = JSON.parse(JSON.stringify(theForm))

        addTableItem(params)
          .then(res => {
            this.reset()
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.getTableList()
            this.addLoading = false
          })
          .catch(err => {
            this.addLoading = false
            return err
          })
      } else {
        return false
      }
    })
  }

  // 编辑
  private editTableItem(row: any): void {
    this.theForm = {
      ...row
    }
  }

  private deleteTableItem(row: any) {
    const params = {
      id: row.id
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteTableItem(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getTableList()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }

  // 重置表单
  private reset(): void {
    this.theForm = {
      ...this.theForm,
      ...{
        'effective': '',
        'id': '',
        'rate': 0
      }
    }
    this.decimals = 2
    this.clearValidate()
  }

  private clearValidate() {
    const theForm: any = this.$refs.theForm
    this.$nextTick(() => {
      theForm.clearValidate()
    })
  }

  // 取消新增/编辑
  private onClosing() {
    this.showDialogA = false
    this.$emit('closing')
  }

  private init(id: any, lcName: any, fcName: any) {
    this.theForm.exchangeId = id
    this.title = `汇率记录（${lcName}兑${fcName}）`
    this.showDialogA = true
    this.getTableList()
  }
}
</script>

<style lang="scss" scoped>
.el-date-editor {
  display: inline-block;
}
.el-input {
  display: inline-block;
  width: 220px;
}
</style>
