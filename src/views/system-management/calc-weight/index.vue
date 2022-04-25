<template>
  <div class="app-container">
    <head-info
      title="收费重量计算"
      info=""
    />
    <div
      v-loading="loading"
      class="app-panel"
    >
      <el-alert
        type="success"
        style="margin-bottom: 10px;"
        :closable="false"
      >
        <template v-slot:title>
          <p>
            长度单位：CM，重量单位：KG &nbsp;&nbsp;&nbsp;&nbsp;
            从左到右依次是：批次箱数，单箱实重，单箱长度，单箱宽度，单箱高度
          </p>
        </template>
      </el-alert>

      <el-row :gutter="30">
        <el-col :span="10">
          <el-form
            ref="ruleForm"
            :model="ruleForm"
            :rules="rules"
            label-width="130px"
          >
            <el-form-item
              label="结算重量算法"
              prop="a1"
            >
              <el-select
                v-model="ruleForm.a1"
                placeholder="请选择"
                style="width: 100%;"
              >
                <el-option
                  label="取实重"
                  :value="A1.TakeActualWeight"
                />
                <el-option
                  label="取实重或体积重的最大值"
                  :value="A1.MaxInWeightOrVolume"
                />
                <el-option
                  label="取实重或体积重的平均值"
                  :value="A1.AvgInWeightOrVolume"
                />
              </el-select>
            </el-form-item>

            <el-form-item
              v-if="ruleForm.a1 === A1.MaxInWeightOrVolume"
              label="分泡比率(%)"
              prop="bubble"
            >
              <el-input
                v-model.number="ruleForm.bubble"
                type="number"
                step="0.01"
              />
            </el-form-item>

            <el-form-item
              label="单箱最低收费重"
              prop="boxLowestWeight"
            >
              <el-input
                v-model.number="ruleForm.boxLowestWeight"
                type="number"
                step="0.01"
                clearable
              />
            </el-form-item>

            <el-form-item
              label="单票最低收费重"
              prop="orderLowestWeight"
            >
              <el-input
                v-model.number="ruleForm.orderLowestWeight"
                type="number"
                step="0.01"
                clearable
              />
            </el-form-item>

            <el-form-item
              v-if="ruleForm.a1 === A1.MaxInWeightOrVolume"
              label="多件重量算法"
              prop="a2"
            >
              <el-radio-group v-model="ruleForm.a2">
                <el-radio :label="A2.AccBeforeCompare">
                  先累加后比较
                </el-radio>
                <el-radio :label="A2.CompareBeforeAcc">
                  先比较后累加
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="14">
          <el-row
            v-for="(item, index) in boxForm"
            :key="index"
            type="flex"
            style="align-items: center;margin-bottom: 22px;"
          >
            <div style="color: #606266;font-size: 14px;">
              批次{{ index + 1 }}
            </div>
            <el-input
              v-model.number="item.beachTotal"
              type="number"
              step="0.01"
              clearable
              placeholder="总箱数"
              style="width: 100px;margin-left: 10px;"
            />
            <el-input
              v-model.number="item.weight"
              type="number"
              step="0.01"
              clearable
              placeholder="单箱实重"
              style="width: 100px;margin-left: 10px;"
            />
            <el-input
              v-model.number="item.length"
              type="number"
              step="0.01"
              clearable
              placeholder="单箱长度"
              style="width: 100px;margin-left: 10px;"
            />
            <el-input
              v-model.number="item.width"
              type="number"
              step="0.01"
              placeholder="单箱宽度"
              clearable
              style="width: 100px;margin-left: 10px;"
            />
            <el-input
              v-model.number="item.height"
              type="number"
              step="0.01"
              clearable
              placeholder="单箱高度"
              style="width: 100px;margin-left: 10px;"
            />
            <i
              v-show="index === 0"
              class="el-icon-circle-plus-outline"
              style="margin-left: 10px;color: #409eff;font-size: 20px;cursor: pointer;"
              @click="addBeatch"
            />
            <i
              v-show="index !== 0"
              class="el-icon-remove-outline"
              style="margin-left: 10px;color: #f14535;font-size: 20px;cursor: pointer;"
              @click="delBeatch(index)"
            />
          </el-row>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        justify="end"
      >
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >
          计算
        </el-button>

        <el-button @click="reset('ruleForm')">
          重置
        </el-button>
      </el-row>
      <el-row>
        <p v-show="isBubble">
          是否需要分泡: {{ isBubble === true ? `是` : `否` }}，分泡前：{{ beforeBubble }} 分泡后：{{ afterbubble }}
        </p>
        <p>收费重量：{{ estimatedWeight }}</p>
        <p>最终结算重量：{{ settlementWeight }}</p>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

// 结算重量算法
enum A1 {
  TakeActualWeight = 1, // 取实重
  MaxInWeightOrVolume, // 取实重或体积重的最大值
  AvgInWeightOrVolume // 取实重和体积重的平均值
}

// 多件重量算法
enum A2 {
  AccBeforeCompare = 1, // 先累加后比较
  CompareBeforeAcc // 先比较后累加
}

// 计费配置
interface IWeightOptions {
  a1: A1
  bubble?: number
  boxLowestWeight?: number | undefined | null
  orderLowestWeight?: number | undefined | null
  a2?: A2
}

interface IBoxInfo {
  beachTotal: number // 批次箱数
  weight: number // 单箱实重
  height: number // 单箱高度
  width: number // 单箱宽度
  length: number // 单箱长度
}

interface IBox {
  aWeight: number // 实重
  vWeight: number // 体积重
}

function initForm(): IBoxInfo[] {
  return [
    {
      beachTotal: 1,
      weight: 7.95,
      height: 41,
      length: 57,
      width: 40
    },
    {
      beachTotal: 1,
      weight: 13.8,
      height: 32,
      length: 47,
      width: 32
    },
    {
      beachTotal: 1,
      weight: 13,
      height: 38,
      length: 53,
      width: 33
    }
  ]
}

@Component({
  name: 'CalcWeight',
  components: {}
})

export default class CalcWeight extends Vue {
  private loading = false
  private A1 = A1
  private A2 = A2
  private ruleForm: IWeightOptions = {
    a1: A1.MaxInWeightOrVolume,
    bubble: 20,
    boxLowestWeight: 10,
    orderLowestWeight: 50,
    a2: A2.CompareBeforeAcc
  }
  private boxForm: IBoxInfo[] = initForm()

  private boxs: IBox[] = []

  private isBubble: boolean | null = null
  private beforeBubble: number = 0
  private afterbubble: number = 0
  private estimatedWeight: number = 0
  private settlementWeight: number = 0

  private rules = {
    a1: [{ required: true, message: '请选择结算重量算法', trigger: 'blur' }],
    bubble: [{ required: true, message: '请输入分泡比率', trigger: 'blur' }],
    a2: [{ required: true, message: '请选择多件重量算法', trigger: 'blur' }]
  }

  private reset(ref: string): void {
    const form: IWeightOptions = {
      a1: A1.MaxInWeightOrVolume,
      bubble: 20,
      boxLowestWeight: 10,
      orderLowestWeight: 50,
      a2: A2.AccBeforeCompare
    }
    this.boxForm = initForm()
    this.ruleForm = form
    this.isBubble = null
    this.beforeBubble = 0
    this.afterbubble = 0
    this.estimatedWeight = 0
    this.settlementWeight = 0
    this.boxs = []
    const formInstance = (this as any).$refs[ref]
    formInstance.clearValidate()
    this.submitForm()
  }

  private submitForm(): void {
    this.settlementWeight = this.calc()
  }

  // 添加批次
  private addBeatch(): void {
    const item = {
      beachTotal: 0,
      weight: 0,
      height: 0,
      length: 0,
      width: 0
    }
    this.boxForm.push(item)
  }

  // 删除批次
  private delBeatch(index: number): void {
    const { boxForm } = this
    this.boxForm = boxForm.filter((item, i) => i !== index)
  }

  // 生成每个箱子的计量信息（实重，体积重）
  private measuringBox(): IBox[] {
    const { boxForm } = this
    let boxList: IBox[] = []
    boxForm.forEach(item => {
      const { weight, height, length, width, beachTotal } = item
      const v = (length * width * height) / 1000 / 1000 // 单箱体积(方)
      const vWeight = Number(v) * 167 // 体积重(KG)
      const row: IBox = {
        aWeight: weight, // 实重
        vWeight: Number(vWeight) // 体积重
      }
      boxList = [...boxList, ...Array(beachTotal).fill(row)]
    })
    return boxList
  }

  // 计算总体积重
  private calcVweight(boxs: IBox[]): number {
    const { boxLowestWeight } = this.ruleForm
    let vw = 0 // 总体积重
    boxs.forEach(item => {
      const w = Math.max(item.vWeight, boxLowestWeight || 0)
      vw += w
    })
    return vw
  }

  // 计算总实重
  private calcAweight(boxs: IBox[]): number {
    const { boxLowestWeight } = this.ruleForm
    let aw = 0 // 总实重
    boxs.forEach(item => {
      const w = Math.max(item.aWeight, boxLowestWeight || 0)
      aw += w
    })
    return aw
  }

  // 处理分泡，如果需要
  private handleBubble(): number {
    const { calcAweight, estimatedWeight, boxs } = this
    const { bubble } = this.ruleForm
    const { a1 } = this.ruleForm
    const aw = calcAweight(boxs)
    if (a1 === A1.MaxInWeightOrVolume) {
      if (estimatedWeight > aw) {
        this.isBubble = true
        this.beforeBubble = estimatedWeight
        this.afterbubble = (estimatedWeight - aw) * (1 - (bubble || 0) / 100) + aw
        return (estimatedWeight - aw) * (1 - (bubble || 0) / 100) + aw
      } else {
        this.isBubble = false
        return estimatedWeight
      }
    } else {
      this.isBubble = false
      return estimatedWeight
    }
  }

  // 先累加，后比较
  private calcAccBeforeCompare(boxs: IBox[]): number {
    const { calcVweight, calcAweight } = this
    const vw = calcVweight(boxs)
    const gw = calcAweight(boxs)
    return Math.max(vw, gw)
  }

  // 先比较后累加
  private calcCompareBeforeAcc(boxs: IBox[]): number {
    const { boxLowestWeight } = this.ruleForm
    let r = 0
    boxs.forEach(item => {
      const aw = Math.max(item.aWeight, boxLowestWeight || 0)
      const vw = Math.max(item.vWeight, boxLowestWeight || 0)
      const sw = Math.max(aw, vw)
      r += sw
    })
    return r
  }

  // 计算实重和体积重的平均值
  private calcAverageOfAwAndVw(boxs: IBox[]): number {
    const { calcAweight, calcVweight } = this
    return (calcAweight(boxs) + calcVweight(boxs)) / 2
  }

  // 计算最终收费重量
  private calcSettlementWeight(): number {
    const { estimatedWeight } = this
    const { orderLowestWeight } = this.ruleForm
    return Math.max(Math.ceil(estimatedWeight), orderLowestWeight || 0)
  }

  // 初步计算收费重量
  private calcEstimatedWeight(boxs: IBox[]): number {
    const { a1, a2 } = this.ruleForm
    const {
      calcAccBeforeCompare,
      calcCompareBeforeAcc,
      calcAverageOfAwAndVw,
      calcAweight
    } = this
    switch (a1) {
      case A1.MaxInWeightOrVolume:
        return a2 === A2.AccBeforeCompare
          ? calcAccBeforeCompare(boxs)
          : calcCompareBeforeAcc(boxs)
      case A1.AvgInWeightOrVolume:
        return calcAverageOfAwAndVw(boxs)
      case A1.TakeActualWeight:
        return calcAweight(boxs)
      default:
        return 0
    }
  }

  private calc(): number {
    // 第一步，计算每个箱子的体积重
    const boxs: IBox[] = this.measuringBox()
    this.boxs = boxs
    // 第二步，初步计算收费重量
    this.estimatedWeight = this.calcEstimatedWeight(boxs)
    // 第三步，处理分泡，如果需要
    this.estimatedWeight = this.handleBubble()
    return this.calcSettlementWeight()
  }

  private created(): void {
    this.submitForm()
  }
}
</script>

<style lang="scss" scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

::v-deep input[type='number'] {
  -moz-appearance: textfield;
}
</style>
