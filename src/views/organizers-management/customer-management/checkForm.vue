<template>
  <div v-loading="checkLoading">
    <el-form
      ref="checkForm"
      :model="checkForm"
      :rules="formRules"
      label-width="110px"
      size="small"
    >
      <el-form-item label="国家/地区">
        {{ checkForm.countryName | placeholder }}
      </el-form-item>
      <el-form-item
        label="州省市区"
      >
        <el-tooltip
          class="item"
          effect="dark"
          placement="top"
        >
          <div slot="content">
            {{ checkForm.stateName | placeholder }}
            / {{ checkForm.cityName | placeholder }}
            / {{ checkForm.countyName | placeholder }}
          </div>
          <div style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
            {{ checkForm.stateName | placeholder }}
            / {{ checkForm.cityName | placeholder }}
            / {{ checkForm.countyName | placeholder }}
          </div>
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="checkForm.entity === '1' ? '公司全称：' : '个人全称：'">
        {{ checkForm.name | placeholder }}
      </el-form-item>
      <el-form-item label="主体类型">
        <span v-if="checkForm.entity === '0'">个人</span>
        <span v-else-if="checkForm.entity === '1'">企业</span>
        <span v-else>--</span>
      </el-form-item>
      <el-form-item
        label="公司类型"
        prop="subtype"
        :rules="[
          {required: checkForm.audit === '1', message: '请选择客户类型', trigger: 'change'}
        ]"
      >
        <el-select
          v-model="checkForm.subtype"
          placeholder="请选择"
          size="small"
          clearable
          style="width:100%;"
        >
          <el-option
            label="直客"
            value="0"
          />
          <el-option
            label="同行"
            value="1"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="添加来源"
        prop="source"
        :rules="[
          {required: checkForm.audit === '1', message: '请选择添加来源', trigger: 'change'}
        ]"
      >
        <el-select
          v-model="checkForm.source"
          style="width:100%;"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in sourceList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="合作期限"
        prop="cooperate"
        :rules="[
          {required: checkForm.audit === '1', validator: validateAudit, trigger: 'change'}
        ]"
      >
        <el-date-picker
          v-model="checkForm.cooperate"
          type="daterange"
          unlink-panels
          size="small"
          style="width:100%;"
          range-separator="~"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item
        label="总分标识："
        prop="branch"
      >
        <el-select
          v-model="checkForm.branch"
          style="width:100%;"
          placeholder="请选择"
          filterable
          clearable
        >
          <el-option
            label="总部"
            value="0"
          />
          <el-option
            label="分公司"
            value="1"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="审核结果"
        prop="audit"
      >
        <el-radio-group v-model="checkForm.audit">
          <el-radio :label="'0'">
            待审核
          </el-radio>
          <el-radio :label="'1'">
            审核通过
          </el-radio>
          <el-radio :label="'2'">
            审核拒绝
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="checkForm.remark"
          placeholder="请输入内容"
        />
      </el-form-item>
      <div v-if="checkForm.entity === '1'">
        <el-form-item label="营业执照">
          {{ checkForm.licenseCode | placeholder }}
        </el-form-item>
        <el-form-item label="成立日期">
          {{ checkForm.setupDate | placeholder }}
        </el-form-item>
        <el-form-item label="公司法人">
          {{ checkForm.legal | placeholder }}
        </el-form-item>
        <el-form-item label="证件信息">
          <span v-if="checkForm.certType === '0'">身份证</span>
          <span v-else-if="checkForm.certType === '1'">其它证件</span>
          <span v-else>--</span>
        </el-form-item>
        <el-form-item
          class="item-width-percent"
          label="证照地址"
        >
          {{ checkForm.licenseAddress | placeholder }}
        </el-form-item>
      </div>
      <el-form-item
        class="item-width-percent"
        label="证件照片"
      >
        <div class="file-list">
          <div
            v-if="frontImage.name"
            class="preview-img"
          >
            <img
              v-if="!frontImageError"
              :src="frontImage.url"
              @error="loadFrontImageError"
            >
            <img
              v-else
              :src="frontImage.fileUrl"
            >
            <div class="mask">
              <i
                class="el-icon-view"
                @click="previewImg(frontImageError ? frontImage.fileUrl : frontImage.url)"
              />
            </div>
          </div>
          <div
            v-if="reverseImage.name"
            class="preview-img"
          >
            <img
              v-if="!reverseImageError"
              :src="reverseImage.url"
              @error="loadReverseImageError"
            >
            <img
              v-else
              :src="reverseImage.fileUrl"
            >
            <div class="mask">
              <i
                class="el-icon-view"
                @click="previewImg(reverseImageError ? reverseImage.fileUrl : reverseImage.url)"
              />
            </div>
          </div>
          <div
            v-if="tradeLicenseImage.name"
            class="preview-img"
          >
            <img
              v-if="!tradeLicenseImageError"
              :src="tradeLicenseImage.url"
              @error="loadTradeLicenseImageError"
            >
            <img
              v-else
              :src="tradeLicenseImage.fileUrl"
            >
            <div class="mask">
              <i
                class="el-icon-view"
                @click="previewImg(tradeLicenseImageError ? tradeLicenseImage.fileUrl : tradeLicenseImage.url)"
              />
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div style="text-align: right;margin-top: 10px;">
      <el-button
        type="primary"
        size="small"
        @click="close"
      >
        取 消
      </el-button>
      <el-button
        type="primary"
        size="small"
        @click="confirm"
      >
        确 定
      </el-button>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      append-to-body
      width="500px"
      @closed="dialogVisible = false"
    >
      <img
        width="100%"
        :src="dialogImageUrl"
        alt=""
      >
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  customerAudit,
  getCustomer as getItemDetail
} from '@/api/jht-customer-management'

@Component({
  name: 'audit',
  components: {},
  props: {},
  filters: {
    placeholder(value: any) {
      if (!value) {
        return '--'
      } else {
        return value
      }
    }
  }
})
export default class extends Vue {
  private checkForm: any = {
    branch: undefined,
    countryName: undefined,
    stateName: undefined,
    cityName: undefined,
    countyName: undefined,
    name: undefined,
    setupDate: undefined,
    licenseCode: undefined,
    licenseAddress: undefined,
    legal: undefined,
    certType: undefined,
    subtype: undefined,
    source: undefined,
    cooperate: [],
    audit: undefined,
    remark: undefined,
    custId: undefined
  }
  private checkLoading: boolean = false
  private formRules = {
    audit: [{ required: true, message: '请选择审核结果', trigger: 'change' }],
    branch: [{ required: true, message: '请选择总分标识', trigger: 'change' }]
  }
  private sourceList = [
    { name: '自助注册', id: '0' },
    { name: '邀请注册', id: '1' },
    { name: '后台添加', id: '2' }
  ]
  private frontImage: any = {}
  private frontImageError: boolean = false
  private reverseImage: any = {}
  private reverseImageError: boolean = false
  private tradeLicenseImage: any = {}
  private tradeLicenseImageError: boolean = false
  private dialogVisible: boolean = false
  private dialogImageUrl = ''

  // methods
  private loadFrontImageError() {
    this.frontImageError = true
  }
  private loadReverseImageError() {
    this.reverseImageError = true
  }
  private loadTradeLicenseImageError() {
    this.tradeLicenseImageError = true
  }
  private setData(row: any) {
    this.getItemDetail(row.id)
  }
  private validateAudit(rule: any, value: any, callback: (val?: any) => void) {
    if (!value && (this as any).checkForm.audit === '1') {
      callback(new Error('请选择合作期限'))
    } else if (Array.isArray(value) && value[0] === value[1]) {
      callback(new Error('合作期格式开始日期必须小于结束日期'))
    } else {
      callback()
    }
  }
  private getItemDetail(id: string): void {
    this.frontImageError = false
    this.reverseImageError = false
    this.tradeLicenseImageError = false
    this.frontImage = {}
    this.reverseImage = {}
    this.tradeLicenseImage = {}
    this.checkLoading = true
    getItemDetail({ id })
      .then((res: any) => {
        const data = res.data || {}
        const { cooperate, id: custId, ...form } = data
        const docs = data.docs || []
        this.checkForm = form
        this.checkForm.custId = custId
        docs.forEach((e: any) => {
          if (e.type === '2') {
            this.frontImage = {
              name: e.name,
              url: process.env.VUE_APP_OSS_PATH + e.path,
              fileUrl: e.fileUrl
            }
          }
          if (e.type === '3') {
            this.reverseImage = {
              name: e.name,
              url: process.env.VUE_APP_OSS_PATH + e.path,
              fileUrl: e.fileUrl
            }
          }
          if (e.type === '1') {
            this.tradeLicenseImage = {
              name: e.name,
              url: process.env.VUE_APP_OSS_PATH + e.path,
              fileUrl: e.fileUrl
            }
          }
        })
        const arr = cooperate.split(',') || []
        this.$set(this.checkForm, 'cooperate', arr)
        this.checkLoading = false
      })
      .catch((err: any) => {
        this.checkLoading = false
        return err
      })
  }
  private previewImg(url: any) {
    this.dialogVisible = true
    this.dialogImageUrl = url
  }
  private close() {
    this.checkForm = {
      branch: undefined,
      subtype: undefined,
      source: undefined,
      cooperate: [],
      audit: undefined,
      remark: undefined
    }
    this.$nextTick(() => {
      const editForm: any = this.$refs.checkForm
      editForm.clearValidate()
    })
    this.$emit('close')
  }
  private confirm() {
    const editForm: any = this.$refs.checkForm
    editForm.validate((valid: any) => {
      if (!valid) return
      this.checkLoading = true
      const params: any = {
        branch: this.checkForm.branch,
        subtype: this.checkForm.subtype,
        source: this.checkForm.source,
        cooperate: Array.isArray(this.checkForm.cooperate) ? this.checkForm.cooperate.join(',') : '',
        custId: this.checkForm.custId,
        audit: this.checkForm.audit,
        remark: this.checkForm.remark
      }
      customerAudit(params)
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
          this.close()
          this.$emit('getTableList')
          this.checkLoading = false
        })
        .catch((err: any) => {
          this.checkLoading = false
          return err
        })
    })
  }
}
</script>

<style lang="scss" scoped>
  .el-form-item {
    display: inline-block;
    width: 49%;
  }
  .item-width-percent {
    width: 100% !important;
    .file-list{
      display: flex;
      .preview-img{
        width: 200px;
        height: 150px;
        position: relative;
        overflow: hidden;
        margin-right: 10px;
        border: 1px solid #eee;
        padding: 2px;
        img{
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          height: 100%;
        }
        .mask{
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,.4);
          opacity: 0;
          transition: all .5s;
          display: flex;
          align-items: center;
          justify-content: space-around;
          color: #fff;
          cursor: pointer;
          &:hover{
            opacity: 1;
          }
        }
      }
    }
  }
</style>
