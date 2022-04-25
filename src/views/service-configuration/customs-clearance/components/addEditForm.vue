<template>
  <div
    v-loading="formLoading"
    class="app-panel customs-clearance-edit"
  >
    <div class="header-top">
      <div style="float: left;">
        {{ isEdit && !isCopy ? '编辑报关服务' : '新增报关服务' }}
      </div>
      <el-button
        type="primary"
        size="small"
        @click="goBack"
      >
        返 回
      </el-button>
      <el-button
        type="primary"
        size="small"
        @click="saveData"
      >
        保 存
      </el-button>
    </div>
    <div class="content">
      <el-form
        ref="selectForm"
        :model="selectForm"
        :rules="formRules"
        label-width="130px"
        size="small"
      >
        <div class="form-title">
          基础信息
        </div>
        <el-form-item
          label="服务名称"
          prop="name"
        >
          <el-input
            v-model="selectForm.name"
            :maxlength="50"
            placeholder="请输入"
            size="small"
          />
        </el-form-item>
        <el-form-item
          label="服务简称"
          prop="abbr"
        >
          <el-input
            v-model="selectForm.abbr"
            :maxlength="10"
            placeholder="请输入"
            size="small"
          />
        </el-form-item>
        <el-form-item
          label="服务编码"
          prop="csId"
        >
          <el-input
            v-model="selectForm.csId"
            placeholder="请输入"
            :maxlength="25"
            show-word-limit
          />
        </el-form-item>

        <el-form-item
          label="所在国家"
          prop="countryId"
        >
          <el-select
            v-model="selectForm.countryId"
            size="small"
            filterable
            clearable
            placeholder="所在国家"
            style="width:100%;"
          >
            <el-option
              v-for="item in countryList"
              :key="item.id"
              :label="`${item.name}-${item.alias}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="服务类型"
          prop="subtypeId"
        >
          <el-select
            v-model="selectForm.subtypeId"
            style="width:100%;"
            size="small"
            clearable
            filterable
            placeholder="请选择"
            @change="onServiceType"
          >
            <el-option
              v-for="item in subTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="selectForm.subtypeId === '0'"
          label="出口报关件"
          prop="custom"
        >
          <el-radio-group
            v-model="selectForm.custom"
          >
            <el-radio label="0">
              买单出口
            </el-radio>
            <el-radio label="1">
              出口退税
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="货币单位"
          prop="currencyId"
        >
          <el-select
            v-model="selectForm.currencyId"
            :loading="selectLoading"
            clearable
            filterable
            style="width:100%;"
            placeholder="请选择"
            @focus="geCurrencyList"
          >
            <el-option
              v-for="item in currencyList"
              :key="item.id"
              :label="`${item.name}-${item.sign}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="分配客户"
          prop="belong"
        >
          <el-select
            v-model="selectForm.belong"
            style="width:100%;"
            size="small"
            clearable
            placeholder="请选择"
          >
            <el-option
              label="直客"
              value="0"
            />
            <el-option
              label="同行"
              value="1"
            />
            <el-option
              label="同行&直客"
              value="2"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="是否快递报关"
          prop="express"
        >
          <el-radio-group
            v-model="selectForm.express"
          >
            <el-radio :label="false">
              否
            </el-radio>
            <el-radio :label="true">
              是
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="false"
          label="是否提供进口商"
          prop="isImporter"
        >
          <el-radio-group
            v-model="selectForm.isImporter"
            @change="selectForm.importerId = undefined"
          >
            <el-radio :label="false">
              否
            </el-radio>
            <el-radio :label="true">
              是
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="false"
          label="默认进口商"
          prop="importerId"
        >
          <el-select
            v-model="selectForm.importerId"
            :disabled="!selectForm.subtypeId"
            :loading="selectLoading"
            style="width:100%;"
            size="small"
            clearable
            filterable
            placeholder="请选择"
            @focus="getAgentList"
          >
            <el-option
              v-for="item in agentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="默认供应商"
          prop="custId"
        >
          <el-select
            v-model="selectForm.custId"
            :loading="selectLoading"
            clearable
            filterable
            style="width:100%;"
            placeholder="请选择"
            @focus="getSupplierList"
          >
            <el-option
              v-for="item in supplierList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="selectForm.remark"
            :maxlength="100"
            placeholder="请输入"
          />
        </el-form-item>
        <div class="form-title">
          运输条款
        </div>
      </el-form>
      <div>
        <markdown-editor
          ref="markdownEditor"
          v-model="terms"
          :options="{
            hideModeSwitch: true,
            previewStyle: 'tab',
            toolbarItems: ['heading','bold','italic']
          }"
          height="300px"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MarkdownEditor from '@/components/MarkdownEditor/index.vue'
import {
  saveClearanceData,
  getCustTypeList,
  geCurrencyList
} from '@/api/service-with-customs-clearance'

function formParam() {
  return {
    id: undefined, // 服务编码
    name: undefined, // 服务名称
    abbr: undefined, // 服务简称
    countryId: undefined, // 所在国家
    subtypeId: undefined, // 服务类型
    csId: undefined, // 关联服务编码
    belong: undefined, // 分配客户
    terms: undefined, // 条款
    importerId: undefined,
    isImporter: false,
    express: false,
    custom: undefined,
    currencyId: undefined,
    custId: undefined,
    remark: undefined
  }
}

@Component({
  name: 'TruckServiceForm',
  components: {
    MarkdownEditor
  },
  props: {
    subTypeData: {
      type: Array,
      default: () => []
    },
    countryData: {
      type: Array,
      default: () => {
        return []
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isCopy: {
      type: Boolean,
      default: false
    }
  }
})

export default class extends Vue {
  private selectLoading = false
  private serviceCode:any[] = []
  private terms = ''
  private ss = ''
  private selectForm: any = formParam()
  private formLoading: boolean = false
  private isItemDialogShow: boolean = false
  private dialogLoading: boolean = false
  private formRules = {
    id: [{ required: true, message: '服务编码不能为空', trigger: 'blur' }], // 服务编码
    name: [{ required: true, message: '服务名称不能为空', trigger: 'blur' }], // 服务名称
    abbr: [
      { required: true, message: '服务简称不能为空', trigger: 'blur' }
    ], // 服务名称
    subtypeId: [{ required: true, message: '请选择服务类型', trigger: 'change' }], // 服务类型
    countryId: [{ required: true, message: '请选择所在国家', trigger: 'change' }], // 所在国家
    csId: [{ required: true, message: '请选择关联服务编码', trigger: 'change' }], // 密度比
    density: [{ required: true, message: '密度比不能为空', trigger: 'blur' }], // 起运国
    belong: [{ required: true, message: '请选择分配客户', trigger: 'change' }], // 分配客户
    umDistance: [{ required: true, message: '请选择距离单位', trigger: 'change' }], // 距离单位
    umWeight: [{ required: true, message: '请选择重量单位', trigger: 'change' }], // 重量单位
    umVolume: [{ required: true, message: '请选择体积单位', trigger: 'change' }], // 体积单位
    densityP: [{ required: true, message: '请选择同行体积密度', trigger: 'change' }], // 同行体积密度
    isImporter: [{ required: true, message: '请选择是否提供进口商', trigger: 'change' }],
    importerId: [{ required: true, message: '请选择默认进口商', trigger: 'change' }],
    express: [{ required: true, message: '请选择是否快递报关', trigger: 'change' }],
    custom: [{ required: true, message: '请选择出口报关件', trigger: 'change' }],
    currencyId: [{ required: true, message: '请选择货币单位', trigger: 'change' }]
  }
  private supplierList: any[] = []
  private agentList: any[] = []
  private currencyList: any[] = []

  get subTypeList() {
    return (this as any).subTypeData || []
  }
  get countryList() {
    return (this as any).countryData || []
  }

  private setTerms(val: any) {
    (this.$refs.markdownEditor as MarkdownEditor).setHtml(val)
  }
  private async setData(row: any) {
    if ((this as any).isCopy) {
      const { id, name, alias, csId, abbr, ...obj } = row
      this.selectForm = { ...obj }
    } else {
      this.selectForm = { ...row }
    }
    this.formLoading = true
    await this.getAgentList()
    await this.getSupplierList()
    this.formLoading = false
  }

  private onServiceType(val: any): void {
    if (val === '0') {
      this.selectForm.custom = '0'
    } else {
      this.selectForm.custom = undefined
    }
    this.selectForm.custId = undefined
    this.selectForm.importerId = undefined
    this.supplierList = []
    this.agentList = []
  }

  private closeForm():void {
    this.resetForm()
  }
  // 重置表单
  private resetForm() {
    this.selectForm = formParam()
    this.clearValidate()
  }
  // 清除校验
  private clearValidate() {
    this.setTerms('')
    const root: any = this.$refs.selectForm
    this.$nextTick(() => {
      root.clearValidate()
    })
  }
  // 返回
  private goBack() {
    this.resetForm()
    this.$emit('closeForm')
  }
  // 保存
  private saveData() {
    const editForm: any = this.$refs.selectForm
    const html = (this.$refs.markdownEditor as MarkdownEditor).getHtml()
    editForm.validate((valid: any) => {
      if (valid) {
        this.formLoading = true
        const params:any = {
          ...this.selectForm
        }
        params.terms = html
        this.countryList.map((item: any) => {
          if (item.id === params.countryId) {
            params.countryName = item.name
          }
        })
        this.subTypeList.map((item:any) => { // 类型
          if (item.id === params.subtypeId) {
            params.subtypeName = item.name
          }
        })
        this.agentList.map((it: any) => {
          if (it.id === params.importerId) {
            params.importerName = it.name
          }
        })
        this.supplierList.map((it: any) => {
          if (it.id === params.custId) {
            params.custName = it.name
          }
        })
        this.currencyList.find((item: any) => {
          if (item.id === params.currencyId) {
            params.currencyName = item.name
          }
        })

        saveClearanceData(params).then((res:any) => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.formLoading = false
          this.resetForm()
          this.$emit('saveConfirm')
        }).catch(err => {
          this.formLoading = false
          return err
        })
      } else {
        return false
      }
    })
  }

  // 获取货币列表
  private geCurrencyList() {
    this.selectLoading = true
    const params = {
      page: 1,
      size: 999
    }
    geCurrencyList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.currencyList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  // 获取供应商列表
  private async getSupplierList() {
    const params = {
      page: 1,
      size: 9999,
      cas: 'S',
      typeId: '03',
      subtypeId: this.selectForm.subtypeId
    }
    await getCustTypeList(params).then((res: any) => {
      const data = res.data || {}
      const result = data.result || []
      this.supplierList = JSON.parse(
        JSON.stringify(result)
          .replace(/custName/g, 'name')
          .replace(/custId/g, 'id')
      )
    }).catch((err: any) => {
      return err
    })
  }

  private async getAgentList() {
    this.selectLoading = true
    const params = {
      page: 1,
      size: 9999,
      cas: 'A',
      typeId: '03',
      subtypeId: this.selectForm.subtypeId
    }
    await getCustTypeList(params).then((res: any) => {
      const data = res.data || {}
      const result = data.result || []
      const json = JSON.parse(
        JSON.stringify(result)
          .replace(/custName/g, 'name')
          .replace(/custId/g, 'id')
      )
      this.agentList = json.filter((it: any) => it.agentType === '1')
      this.selectLoading = false
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }
}
</script>
<style lang="scss" scoped>
.el-form-item {
  display: inline-block;
  width: 24.9%;
}

.customs-clearance-edit{
  padding:0;
  .header-top{
    text-align: right;
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    font-size: 16px;
    color: #666666;
    border-bottom: 1px solid #cccccc;
  }
  .content{
    padding: 20px;;
    .form-title {
      height: 35px;
      line-height: 35px;
      font-size: 16px;
      font-weight: 700;
      background: #f2f2f2;
      padding-left: 20px;
      margin-bottom:20px;
    }
  }
}

::v-deep .el-transfer-panel {
  width: 40%;
  height: 100%;
}
::v-deep .el-transfer {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}
::v-deep .el-transfer-panel__list.is-filterable {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
}
::v-deep .el-transfer-panel__body {
  height: 78%;
}
</style>
