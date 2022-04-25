<template>
  <div v-loading="loading">
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      label-position="right"
      label-width="150px"
      size="small"
    >
      <el-form-item
        label="验货配置名称"
        prop="name"
      >
        <el-input
          v-model="form.name"
          :maxlength="20"
          placeholder="请输入"
          size="small"
        />
      </el-form-item>
      <el-form-item
        label="验货方式"
        prop="type"
      >
        <el-select
          v-model="form.type"
          size="small"
          clearable
          filterable
          style="width:100%;"
          placeholder="请选择"
          @change="form.ratio = undefined"
        >
          <el-option
            label="按产品"
            value="0"
          />
          <el-option
            label="按比例"
            value="2"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="form.type === '2'"
        label="验货比例"
        prop="ratio"
      >
        <el-input
          v-model="form.ratio"
          placeholder="请输入"
        >
          <span slot="append">%</span>
        </el-input>
      </el-form-item>

      <el-form-item
        label="验货程度"
        prop="degreeArr"
      >
        <el-select
          v-model="form.degreeArr"
          style="width:100%;"
          size="small"
          clearable
          multiple
          collapse-tags
          placeholder="请选择"
        >
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="验货图片保留"
        prop="retain"
      >
        <el-select
          v-model="form.retain"
          style="width:100%;"
          size="small"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in imgTime"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="需检验项"
        prop="itemsArr"
      >
        <el-select
          v-model="form.itemsArr"
          style="width:100%;"
          size="small"
          clearable
          multiple
          collapse-tags
          placeholder="请选择"
        >
          <el-option
            v-for="item in examineList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="查验MadeInChina"
        prop="micArr"
      >
        <el-checkbox-group
          v-model="form.micArr"
        >
          <el-checkbox
            v-for="(item, index) in micList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        label="外箱查验"
        prop="boxArr"
      >
        <el-checkbox-group
          v-model="form.boxArr"
        >
          <el-checkbox
            v-for="(item, index) in checkList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        label="产品查验"
        prop="goodsArr"
      >
        <el-checkbox-group
          v-model="form.goodsArr"
        >
          <el-checkbox
            v-for="(item, index) in checkList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-checkbox-group>
      </el-form-item>

      <el-form-item
        label="抽箱方式"
        prop="pick"
      >
        <el-radio-group v-model="form.pick">
          <el-radio label="0">
            随机
          </el-radio>
          <el-radio label="1">
            指定
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="是否验证订单尺寸"
        prop="size"
      >
        <el-radio-group v-model="form.size">
          <el-radio :label="false">
            否
          </el-radio>
          <el-radio :label="true">
            是
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="是否查验超重标"
        prop="overweight"
      >
        <el-radio-group v-model="form.overweight">
          <el-radio :label="false">
            否
          </el-radio>
          <el-radio :label="true">
            是
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="是否查验带电标"
        prop="electrified"
      >
        <el-radio-group v-model="form.electrified">
          <el-radio :label="false">
            否
          </el-radio>
          <el-radio :label="true">
            是
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="是否查验危险品标"
        prop="danger"
      >
        <el-radio-group v-model="form.danger">
          <el-radio :label="false">
            否
          </el-radio>
          <el-radio :label="true">
            是
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="是否允许编织袋"
        prop="bag"
      >
        <el-radio-group v-model="form.bag">
          <el-radio :label="false">
            否
          </el-radio>
          <el-radio :label="true">
            是
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="是否允许捆绑"
        prop="binding"
      >
        <el-radio-group v-model="form.binding">
          <el-radio :label="false">
            否
          </el-radio>
          <el-radio :label="true">
            是
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      style="text-align: right;padding: 10px 0px 20px;"
    >
      <el-button
        @click="cancel"
      >
        取 消
      </el-button>
      <el-button
        type="primary"
        @click="submit"
      >
        确 定
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  saveExamine
} from '@/api/operation-of-examine-config'

function formParam() {
  return {
    name: undefined,
    type: undefined,
    ratio: undefined,
    mic: undefined,
    micArr: [],
    degreeArr: [],
    degree: undefined,
    retain: undefined,
    pick: '0',
    items: undefined,
    itemsArr: [],
    size: false,
    goods: undefined,
    goodsArr: [],
    foreigns: undefined,
    boxArr: [],
    binding: false,
    custId: undefined,
    custName: undefined,
    overweight: false,
    bag: false,
    danger: false,
    electrified: false,
    id: undefined
  }
}
function lengthValidate(rule: any, value: any, callback: (val?: any) => void) {
  if (value.length > 10) {
    callback(new Error('字符长度不能超过10位'))
  } else {
    callback()
  }
}
function numberValidate(rule: any, value: any, callback: (val?: any) => void) {
  const reg = /^([1-9]\d{0,1}|100)$/
  if (value && !reg.test(value)) {
    callback(new Error('比例为1-100的正整数'))
  } else {
    callback()
  }
}

@Component({
  name: '',
  components: {},
  props: {
    typeList: {
      type: Array,
      default: () => {
        return []
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  }
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private form: any = formParam()
  private formRules = {
    name: [
      { required: true, message: '验货配置名称不能为空', trigger: 'blur' }
    ],
    type: [{ required: false, message: '请选择验货方式', trigger: 'change' }],
    micArr: [{ required: false, message: '请选择查验MadeInChina', trigger: 'change' }],
    ratio: [{ required: false, message: '验货比例不能为空', trigger: 'blur' },
      {
        validator: numberValidate,
        trigger: 'blur'
      }
    ],
    degreeArr: [{ required: false, message: '请选择验货程度', trigger: 'change' }],
    pick: [{ required: false, message: '请选择抽箱方式', trigger: 'change' }],
    retain: [{ required: false, message: '请选择验货图片保留', trigger: 'change' }],
    itemsArr: [{ required: false, message: '请选择需检验项', trigger: 'change' }],
    size: [{ required: false, message: '请选择是否验证订单尺寸', trigger: 'change' }],
    boxArr: [{ required: false, message: '请选择外箱查验', trigger: 'change' }],
    goodsArr: [{ required: false, message: '请选择产品查验', trigger: 'change' }],
    overweight: [{ required: false, message: '请选择是否查验超重标', trigger: 'change' }],
    electrified: [{ required: false, message: '请选择是否查验带电标', trigger: 'change' }],
    danger: [{ required: false, message: '请选择是否查验危险品标', trigger: 'change' }],
    bag: [{ required: false, message: '请选择是否允许编织袋', trigger: 'change' }],
    binding: [{ required: false, message: '请选择是否允许捆绑', trigger: 'change' }]
  }
  private imgTime: any[] = [
    { id: 1, name: '1个月' },
    { id: 2, name: '2个月' },
    { id: 3, name: '3个月' },
    { id: 4, name: '4个月' },
    { id: 5, name: '5个月' },
    { id: 6, name: '6个月' },
    { id: 7, name: '7个月' },
    { id: 8, name: '8个月' },
    { id: 9, name: '9个月' },
    { id: 10, name: '10个月' },
    { id: 11, name: '11个月' },
    { id: 12, name: '12个月' }
  ]
  private examineList: any[] = [
    { id: '0', name: '售后地址' },
    { id: '1', name: '厂商信息' },
    { id: '2', name: '生产批号' },
    { id: '3', name: '五国说明书' },
    { id: '4', name: '包装五国文字' }
  ]
  private checkList: any[] = [
    { id: '0', name: '原产地' },
    { id: '1', name: '工厂信息' }
  ]
  private micList: any[] = [
    { id: '0', name: '外箱' },
    { id: '1', name: '内件' }
  ]

  /* methods */

  private show(data: any) {
    const { goods, foreigns, degree, items, mic, ...obj } = data
    this.form = { ...obj }
    let arrG: any[] = []
    let arrB: any[] = []
    let arrM: any[] = []
    const goodsArr = goods.split(',') || []
    const boxArr = foreigns.split(',') || []
    const micArr = mic.split(',') || []
    goodsArr.map((g: any) => {
      const res = this.checkList.find((c: any) => c.id === g)
      arrG.push((res || {}).name || '')
    })
    boxArr.map((g: any) => {
      const res = this.checkList.find((c: any) => c.id === g)
      arrB.push((res || {}).name || '')
    })
    micArr.map((g: any) => {
      const res = this.micList.find((c: any) => c.id === g)
      arrM.push((res || {}).name || '')
    })
    arrG = arrG.filter((g: any) => g)
    arrB = arrB.filter((g: any) => g)
    arrM = arrM.filter((g: any) => g)
    const arrD = degree ? degree.split(',') : []
    const arrI = items ? items.split(',') : []
    this.$set(this.form, 'degreeArr', arrD)
    this.$set(this.form, 'itemsArr', arrI)
    this.$set(this.form, 'goodsArr', arrG)
    this.$set(this.form, 'boxArr', arrB)
    this.$set(this.form, 'micArr', arrM)
  }
  private reset() {
    this.form = formParam()
    this.$nextTick(() => {
      const formRef: any = this.$refs.form
      formRef.clearValidate()
    })
  }
  private submit() {
    const formRef: any = this.$refs.form
    formRef.validate((valid: boolean) => {
      if (!valid) return false
      const { goodsArr, boxArr, degreeArr, itemsArr, micArr, ...form } = this.form
      const params = {
        ...form
      }
      const gArr: any[] = []
      const bArr: any[] = []
      const cArr: any[] = []
      goodsArr.map((g: any) => {
        const res = this.checkList.findIndex((c: any) => c.name === g)
        if (res > -1) {
          gArr.push(res)
        }
      })
      boxArr.map((g: any) => {
        const res = this.checkList.findIndex((c: any) => c.name === g)
        if (res > -1) {
          bArr.push(res)
        }
      })
      micArr.map((g: any) => {
        const res = this.micList.findIndex((c: any) => c.name === g)
        if (res > -1) {
          cArr.push(res)
        }
      })
      params.goods = gArr.join(',')
      params.foreigns = bArr.join(',')
      params.mic = cArr.join(',')
      params.degree = degreeArr.join(',')
      params.items = itemsArr.join(',')
      this.loading = true
      saveExamine(params).then((res: any) => {
        this.loading = false
        this.$message.success('保存成功')
        this.$emit('cancel')
        this.$emit('load')
      }).catch((err: any) => {
        this.loading = false
        return err
      })
    })
  }
  private cancel() {
    this.$emit('cancel')
  }
}
</script>

<style scoped>
.el-form-item {
  display: inline-block;
  width: 49.5%;
}
</style>
