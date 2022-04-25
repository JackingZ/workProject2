<template>
  <div
    v-loading="formLoading"
    class="app-panel warehouse-edit"
  >
    <div class="header-top">
      <div style="float: left;">
        {{ isEdit && !isCopy ? '编辑仓储服务' : '新增仓储服务' }}
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
        label-width="150px"
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
            show-word-limit
            placeholder="请输入"
            size="small"
          />
        </el-form-item>
        <el-form-item
          label="服务编码"
          prop="serviceCode"
        >
          <el-input
            ref="firstInput"
            v-model="selectForm.serviceCode"
            size="small"
            placeholder="请输入"
            :maxlength="25"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="服务类型"
          prop="subtypeId"
        >
          <el-select
            v-model="selectForm.subtypeId"
            :loading="loading"
            size="small"
            style="width:100%;"
            placeholder="请选择"
            filterable
            clearable
            @focus="getSubtypeList"
          >
            <el-option
              v-for="item in subtypeList"
              :key="item.id"
              :label="item.name"
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
          label="备注"
        >
          <el-input
            v-model="selectForm.remark"
            :maxlength="100"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <div class="form-title">
          参数&配置
        </div>

        <el-form-item
          label="重量单位"
          prop="umWeight"
        >
          <el-select
            v-model="selectForm.umWeight"
            style="width:100%;"
            placeholder="请选择"
            clearable
            filterable
            :loading="selectLoading"
            @focus="getUmWeightList"
          >
            <el-option
              v-for="item in umWeightList"
              :key="item.value"
              :label="item.label + '-' + item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="体积单位"
          prop="umVolume"
        >
          <el-select
            v-model="selectForm.umVolume"
            :loading="selectLoading"
            placeholder="请选择"
            style="width: 100%;"
            @focus="getUmVolumeList"
          >
            <el-option
              v-for="item in umVolumeList"
              :key="item.value"
              :label="item.label + '-' + item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="长度单位"
          prop="umLength"
        >
          <el-select
            v-model="selectForm.umLength"
            style="width:100%;"
            placeholder="请选择"
            clearable
            filterable
            :loading="selectLoading"
            @focus="getUmLengthList"
          >
            <el-option
              v-for="item in umLengthList"
              :key="item.value"
              :label="item.label + '-' + item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="是否验货"
          prop="examine"
        >
          <el-radio-group
            v-model="selectForm.examine"
            @change="selectForm.examineId = undefined"
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
          v-if="selectForm.examine"
          label="验货配置"
          prop="examineId"
        >
          <el-select
            v-model="selectForm.examineId"
            :loading="loading"
            style="width:100%;"
            size="small"
            clearable
            filterable
            placeholder="请选择"
            @focus="getExamineList"
          >
            <el-option
              v-for="item in examineList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
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
  getSsList,
  getExamineList,
  getServiceSubtypeList
} from '@/api/service-with-warehouse-service'
import { getWordsList } from '@/api/service-with-booking-service'

@Component({
  name: 'TruckServiceForm',
  components: {
    MarkdownEditor
  },
  props: {
    selectForm: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isCopy: {
      type: Boolean,
      default: false
    },
    formLoading: {
      type: Boolean,
      default: false
    }
  }
})

export default class extends Vue {
  private loading = false
  private selectLoading = false
  private serviceCode:any[] = []
  private examineList:any[] = []
  private subtypeList:any[] = []
  private umLengthList:any[] = []
  private umWeightList:any[] = []
  private umVolumeList:any[] = []
  private terms = ''
  private formRules = {
    name: [
      { required: true, message: '服务名称不能为空', trigger: 'blur' }
    ], // 服务名称
    abbr: [
      { required: true, message: '服务简称不能为空', trigger: 'blur' }
    ],
    serviceCode: [{ required: true, message: '服务编码不能为空', trigger: 'blur' }],
    belong: [{ required: true, message: '请选择分配客户', trigger: 'change' }],
    umLength: [{ required: true, message: '请选择长度单位', trigger: 'change' }],
    umWeight: [{ required: true, message: '请选择重量单位', trigger: 'change' }],
    umVolume: [{ required: true, message: '请选择体积单位', trigger: 'change' }],
    examine: [{ required: true, message: '请选择是否验货', trigger: 'change' }],
    examineId: [{ required: true, message: '请选择验货配置', trigger: 'change' }]
  }

  /** method */
  private async getUmLengthList() {
    this.selectLoading = true
    await getWordsList({ type: 'measurement_type' }).then((res: any) => {
      this.selectLoading = false
      if (res.success) {
        this.umLengthList = res.data || []
      }
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }

  private async getUmWeightList() {
    this.selectLoading = true
    await getWordsList({ type: 'weight_type' }).then((res: any) => {
      this.selectLoading = false
      if (res.success) {
        this.umWeightList = res.data || []
      }
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }

  private async getUmVolumeList() {
    this.selectLoading = true
    await getWordsList({ type: 'VOLUME_TYPE' }).then((res: any) => {
      this.selectLoading = false
      if (res.success) {
        this.umVolumeList = res.data || []
      }
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }

  private setTerms(val: any) {
    (this.$refs.markdownEditor as MarkdownEditor).setHtml(val)
  }
  private async setData() {
    await this.getSubtypeList()
    await this.getExamineList()
    await this.getUmLengthList()
    await this.getUmWeightList()
    await this.getUmVolumeList()
  }

  // 返回
  private goBack() {
    this.$emit('closeForm')
  }
  // 保存
  private saveData() {
    const form = (this as any).selectForm
    this.examineList.map((it: any) => {
      if (form.examineId === it.id) {
        form.examineName = it.name
      }
    })
    this.subtypeList.map((it: any) => {
      if (form.subtypeId === it.id) {
        form.subtypeName = it.name
      }
    })
    const html = (this.$refs.markdownEditor as MarkdownEditor).getHtml()
    this.$emit('saveConfirm', html)
  }
  // 获取仓储关联服务编码
  private getSsData() {
    this.loading = true
    const params:any = {
      page: 1,
      size: 9999
    }
    getSsList(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        this.serviceCode = data.result || []
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  // 获取服务小类
  private async getSubtypeList() {
    this.loading = true
    const params = {
      typeId: '04'
    }

    await getServiceSubtypeList(params)
      .then((res: any) => {
        this.subtypeList = res.data || []
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private async getExamineList() {
    this.loading = true
    const params:any = {
      page: 1,
      size: 9999
    }
    await getExamineList(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        this.examineList = data.result || []
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
}
</script>
<style lang="scss" scoped>
.el-form-item {
  vertical-align: top;
  display: inline-block;
  width: 24.9%;
}
.warehouse-edit{
  padding: 0;
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
      margin-bottom: 20px;
    }
  }
}
</style>
