<template>
  <div
    v-loading="loading"
    class="add-edit-organ"
  >
    <el-form
      ref="productForm"
      :model="selectForm"
      :disabled="selectForm.state === 1"
      :rules="formRules"
      label-width="110px"
      label-position="right"
      size="small"
    >
      <el-form-item
        label="商品属性"
        prop="categorieIds"
      >
        <el-select
          v-model="selectForm.categorieIds"
          multiple
          clearable
          collapse-tags
          size="small"
          style="width:100%;"
          placeholder="请选择"
        >
          <el-option
            v-for="item in productPropertyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="商品图片"
        prop=""
      >
        <el-upload
          class="upload-library"
          action
          :multiple="false"
          :limit="1"
          :http-request="uploadFile"
          :on-remove="onFileRemove"
          :file-list="fileList"
        >
          <el-button
            size="small"
          >
            <i class="el-icon-upload" />
            上传文件
          </el-button>
        </el-upload>
      </el-form-item>
      <el-form-item
        label="中文名称"
        prop="cnName"
      >
        <el-input
          v-model="selectForm.cnName"
          :maxlength="50"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item
        label="英文名称"
        prop="enName"
      >
        <el-input
          v-model="selectForm.enName"
          :maxlength="50"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item
        label="SKU编码"
        prop="skuCode"
      >
        <el-input
          v-model="selectForm.skuCode"
          placeholder="请输入"
          :maxlength="50"
        />
      </el-form-item>
      <el-form-item
        label="品牌"
        prop="brand"
      >
        <el-input
          v-model="selectForm.brand"
          placeholder="请输入"
          :maxlength="50"
        />
      </el-form-item>
      <el-form-item
        label="规格"
        prop="size"
      >
        <el-input
          v-model="selectForm.size"
          placeholder="请输入"
          :maxlength="50"
        />
      </el-form-item>
      <el-form-item
        label="中文材质"
        prop="cnMaterial"
      >
        <el-input
          v-model="selectForm.cnMaterial"
          placeholder="请输入"
          :maxlength="150"
        />
      </el-form-item>
      <el-form-item
        label="英文材质"
        prop="enMaterial"
      >
        <el-input
          v-model="selectForm.enMaterial"
          placeholder="请输入"
          :maxlength="150"
        />
      </el-form-item>
      <el-form-item
        label="中文用途"
        prop="cnPurpose"
      >
        <el-input
          v-model="selectForm.cnPurpose"
          placeholder="请输入"
          :maxlength="150"
        />
      </el-form-item>
      <el-form-item
        label="英文用途"
        prop="enPurpose"
      >
        <el-input
          v-model="selectForm.enPurpose"
          placeholder="请输入"
          :maxlength="150"
        />
      </el-form-item>
      <el-form-item
        label="计量单位"
        prop="unit"
      >
        <el-select
          v-model="selectForm.unit"
          clearable
          filterable
          size="small"
          style="width:100%;"
          placeholder="请选择"
        >
          <el-option
            v-for="item in unitList"
            :key="item.id"
            :label="item.unit"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="功率(W-瓦特)"
        prop="power"
      >
        <el-input-number
          v-model="selectForm.power"
          class="input-number-valiate"
          :controls="false"
          placeholder="请输入"
          :min="0"
          :max="99999"
          :precision="2"
        />
      </el-form-item>
      <el-form-item
        label="采购链接"
        prop="purchaseUrl"
      >
        <el-input
          v-model="selectForm.purchaseUrl"
          placeholder="请输入"
          :maxlength="150"
        >
          <!-- <template slot="append">
            <el-button
              type="primary"
              icon="document"
              @click="handleClipboard(selectForm.purchaseUrl, $event)"
            >
              复制
            </el-button>
          </template> -->
        </el-input>
      </el-form-item>
      <el-form-item
        label="一件代发"
        prop="issued"
      >
        <el-radio-group v-model="selectForm.issued">
          <el-radio label="1">
            否
          </el-radio>
          <el-radio label="0">
            是
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="custType === '0'"
        label="公共库产品"
        prop="onPublic"
      >
        <el-radio-group v-model="selectForm.onPublic">
          <el-radio label="1">
            否
          </el-radio>
          <el-radio label="0">
            是
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="selectForm.remark"
          placeholder="请输入"
          :maxlength="150"
        />
      </el-form-item>
      <div
        v-if="selectForm.issued === '0'"
        style="border-top: 1px solid #f2f2f2;padding-top: 20px;margin-top: 5px;"
      >
        <el-form-item
          label="包装类型"
          prop="packing"
        >
          <el-select
            v-model="selectForm.packing"
            clearable
            size="small"
            style="width:100%;"
            placeholder="请选择"
          >
            <el-option
              label="自带包装"
              value="0"
            />
            <el-option
              label="特殊包装"
              value="1"
            />
            <el-option
              label="无包装"
              value="2"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="仓储条件"
          prop="storage"
        >
          <el-select
            v-model="selectForm.storage"
            clearable
            size="small"
            style="width:100%;"
            placeholder="请选择"
          >
            <el-option
              label="常温"
              value="0"
            />
            <el-option
              label="恒温"
              value="1"
            />
            <el-option
              label="冷冻"
              value="2"
            />
            <el-option
              label="冷藏"
              value="3"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="重量单位"
          prop="weight"
        >
          <el-select
            v-model="selectForm.weight"
            clearable
            size="small"
            style="width:100%;"
            placeholder="请选择"
          >
            <el-option
              label="LBS-磅"
              value="LBS"
            />
            <el-option
              label="KGS-公斤"
              value="KGS"
            />
            <el-option
              label="OZS-盎司"
              value="OZS"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="长度单位"
          prop="length"
        >
          <el-select
            v-model="selectForm.length"
            clearable
            size="small"
            style="width:100%;"
            placeholder="请选择"
          >
            <el-option
              label="IN-英寸"
              value="IN"
            />
            <el-option
              label="CM-厘米"
              value="CM"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="长度"
          prop="lengthen"
        >
          <el-input-number
            v-model="selectForm.lengthen"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="99999"
            :precision="2"
          />
        </el-form-item>
        <el-form-item
          label="宽度"
          prop="wide"
        >
          <el-input-number
            v-model="selectForm.wide"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="99999"
            :precision="2"
          />
        </el-form-item>
        <el-form-item
          label="高度"
          prop="high"
        >
          <el-input-number
            v-model="selectForm.high"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="99999"
            :precision="2"
          />
        </el-form-item>
        <el-form-item
          label="毛重"
          prop="gross"
        >
          <el-input-number
            v-model="selectForm.gross"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="99999"
            :precision="2"
          />
        </el-form-item>
        <el-form-item
          label="净重"
          prop="net"
        >
          <el-input-number
            v-model="selectForm.net"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="99999"
            :precision="2"
          />
        </el-form-item>
      </div>
    </el-form>
    <div
      slot="footer"
      style="text-align: right;padding: 10px 10px 20px;"
    >
      <el-button @click="cancel">
        取 消
      </el-button>
      <el-button
        :disabled="selectForm.state === 1"
        type="primary"
        @click="saveConfirm"
      >
        确 定
      </el-button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import { handleClipboard } from '@/utils/clipboard'
import dayjs from 'dayjs'
import {
  getAllCustList
} from '@/api/system-in-product-library'

function formPrama() {
  return {
    status: undefined, // 产品状态
    state: undefined, // 商品状态
    productId: '', // 商品类别
    attribute: undefined, // 商品属性
    categorieIds: [], // 商品属性
    skuCode: undefined, // SKU编码
    brand: undefined, // 品牌
    size: undefined, // 规格
    cnName: undefined, // 中文名称
    cnMaterial: undefined, // 中文材质
    cnPurpose: undefined, // 中文用途
    enName: undefined, // 英文名称
    enPurpose: undefined, // 英文用途
    enMaterial: undefined, // 英文材质
    issued: '1', // 是否一件代发
    onPublic: '1', // 是否公共产品库
    unit: undefined, // 计量单位
    packing: undefined, // 包装类型
    storage: undefined, // 仓储条件
    weight: undefined, // 重量单位
    length: undefined, // 长度单位
    lengthen: undefined, // 长度
    wide: undefined, // 宽度
    high: undefined, // 高度
    gross: undefined, // 毛重
    net: undefined, // 净重
    power: undefined, // 功率
    purchaseUrl: undefined, // 采购链接
    url: undefined, // 商品图片
    remark: undefined // 备注
  }
}

@Component({
  name: 'AddEditProduct',
  components: {},
  props: {
    productPropertyList: {
      type: Array,
      default: () => {
        return []
      }
    },
    goodsList: {
      type: Array,
      default: () => {
        return []
      }
    },
    unitList: {
      type: Array,
      default: () => {
        return []
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
})
export default class extends Vue {
  /* data */
  private selectLoading: boolean = false
  private selectForm: any = formPrama()
  private companyList:any[] = []
  private fileList:any[] = []
  private handleClipboard = handleClipboard
  private formRules = {
    productId: { required: true, message: '请选择商品列表', trigger: 'change' },
    categorieIds: { required: true, message: '请选择商品属性', trigger: 'change' },
    cnName: { required: true, message: '中文名称不能为空', trigger: 'blur' },
    enName: [
      { required: true, message: '英文名称不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (!value) {
            callback(new Error('英文名称不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('英文名称不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    skuCode: { required: true, message: 'SKU编码不能为空', trigger: 'blur' },
    brand: { required: true, message: '品牌不能为空', trigger: 'blur' },
    size: { required: true, message: '规格不能为空', trigger: 'blur' },
    cnMaterial: { required: true, message: '中文材质不能为空', trigger: 'blur' },
    enMaterial: [
      { required: true, message: '英文材质不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (!value) {
            callback(new Error('英文材质不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('英文材质不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    cnPurpose: { required: true, message: '中文用途不能为空', trigger: 'blur' },
    enPurpose: [
      { required: true, message: '英文用途不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (!value) {
            callback(new Error('英文用途不能为空'))
          } else if (reg.test(value)) {
            callback(new Error('英文用途不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    url: { required: true, message: '商品照片不能为空', trigger: 'blur' },
    power: { required: false, message: '功率不能为空', trigger: 'blur' },
    issued: { required: true, message: '请选择是否一件代发', trigger: 'change' },
    onPublic: { required: true, message: '请选择是否公共产品库', trigger: 'change' },
    unit: { required: true, message: '请选择计量单位', trigger: 'change' },
    packing: { required: true, message: '请选择包装类型', trigger: 'change' },
    storage: { required: true, message: '请选择仓储条件', trigger: 'change' },
    weight: { required: true, message: '请选择重量单位', trigger: 'change' },
    length: { required: true, message: '请选择长度单位', trigger: 'change' },
    lengthen: { required: true, message: '长度不能为空', trigger: 'blur' },
    wide: { required: true, message: '宽度不能为空', trigger: 'blur' },
    high: { required: true, message: '高度不能为空', trigger: 'blur' },
    gross: { required: true, message: '毛重不能为空', trigger: 'blur' },
    net: { required: true, message: '净重不能为空', trigger: 'blur' },
    purchaseUrl: { required: false, message: '请输入采购链接', trigger: 'blur' }
  }

  private props: any = {
    label: 'name',
    value: 'id'
  }

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
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }
  get custId():string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }
  // 所属公司Name
  get custName(): string {
    const info = UserModule.info || {}
    const custName = (info as any).custName
    return custName
  }

  /* methods */
  private getCompanyList() {
    const params:any = {
      page: 1,
      size: 99999,
      type: '0,1,2'
    }
    this.selectLoading = true
    getAllCustList(params).then((res:any) => {
      const data = res.data || {}
      this.companyList = data.result || []
      this.selectLoading = false
    }).catch((err:any) => {
      this.selectLoading = false
      return err
    })
  }
  private onProduct(data: any) {
    const list = (this as any).goodsList
    const form = (this as any).selectForm
    list.map((it: any) => {
      if (data === it.value) {
        form.productId = ''
        this.$message.error('请选择下级类别')
      }
    })
  }
  // 上传图片
  private uploadFile(params: any): void {
    const { file } = params
    this.$upload(true, file, `jht-admin/productLibrary/${dayjs().valueOf() + '/' + file.name}`)
      .then((res: any) => {
        const { data } = res
        const obj = (this as any).selectForm
        obj.url = data
      })
      .catch((err:any) => {
        return err
      })
  }
  // 监听文件删除
  private onFileRemove(file: any, fileList: any[]) {
    this.$deleteLoad(file.url, true)
      .then((res: any) => {
        // this.$message.success(`删除成功`)
      })
      .catch((err: any) => {
        return err
      })
    this.selectForm.url = ''
  }
  private setData(arr: any[], row: any) {
    const type = (this as any).custType
    if (type === '0') { // 聚货通
      this.getCompanyList()
    }
    this.fileList = arr
    if (row) {
      this.selectForm = {
        ...row
      }
    }
  }
  // 重置表单
  private resetForm() {
    this.selectForm = formPrama()
    const addEditForm:any = this.$refs.productForm
    addEditForm.clearValidate()
  }
  private cancel() {
    this.$emit('cancel')
  }
  private saveConfirm() {
    this.$emit('confirm')
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  display: inline-block;
  width: 49%;
}
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
.upload-library {
  display: flex;
  .el-upload {
    width: 86px;
  }
  ::v-deep .el-button {
    padding: 9px 10px;
  }
  ::v-deep .el-upload-list {
    display: inline-block;
    flex: 1;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  ::v-deep .el-upload-list__item:first-child {
    margin-top: 5px;
  }
  ::v-deep .el-upload-list__item-name {
    margin-right: 30px;
  }
}
</style>
