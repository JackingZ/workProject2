<template>
  <el-dialog
    :visible="visible"
    :close-on-click-modal="false"
    :width="modelWidth"
    @close="dialogClose"
  >
    <div slot="title">
      <p>
        {{ '设置区间' + '-' + relevanceRow.name }}
      </p>
      <p
        style="font-size: 14px;color: #606266;"
      >
        {{ text }}
      </p>
    </div>
    <div v-loading="loading">
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
      >
        <div v-if="sectionType === '1'">
          <el-form-item
            v-for="(section, index) in form.sectionList"
            :key="index"
            :label="index === 0 ? '托数范围：' : ' '"
            :prop="'sectionList.' + index + '.start'"
          >
            <div class="item-after-icon">
              <el-input-number
                v-model="section.start"
                controls-position="right"
                :min="index === 0 ? 0 : (form.sectionList[index - 1].end)"
                :max="index === 0 ? 9999 : (form.sectionList[index + 1] ? form.sectionList[index + 1].start : 9999)"
                placeholder="输入下限"
                style="width: 45%"
                :controls="false"
                step-strictly
                class="input-number-valiate"
              />
              <el-input-number
                v-model="section.end"
                controls-position="right"
                :min="index === 0 ? section.start + 1 : (form.sectionList[index].start + 1)"
                :max="index === 0 ? 9999 : (form.sectionList[index + 1] ? form.sectionList[index + 1].start : 9999)"
                placeholder="输入上限"
                style="width: 45%"
                :controls="false"
                step-strictly
                class="input-number-valiate"
              />
              <i
                v-if="index === 0"
                class="el-icon-circle-plus-outline item-icon-plus"
                @click.prevent="addSection('sectionList')"
              />
              <i
                v-else
                class="el-icon-remove-outline item-icon-reduce"
                @click.prevent="removeSection(section, index, 'sectionList')"
              />
            </div>
          </el-form-item>
        </div>
        <div v-else-if="sectionType === '3'">
          <el-form-item
            v-for="(section, index) in form.mileageSectionList"
            :key="index"
            :label="index === 0 ? '里程范围：' : ' '"
            :prop="'mileageSectionList.' + index + '.start'"
          >
            <div class="item-after-icon">
              <el-input-number
                v-model="section.start"
                controls-position="right"
                :min="index === 0 ? 0 : (form.mileageSectionList[index - 1].end)"
                :max="index === 0 ? 9999 : (form.mileageSectionList[index + 1] ? form.mileageSectionList[index + 1].start : 9999)"
                placeholder="输入下限"
                style="width: 45%"
                :controls="false"
                step-strictly
                class="input-number-valiate"
              />
              <el-input-number
                v-model="section.end"
                controls-position="right"
                :min="index === 0 ? section.start + 1 : (form.mileageSectionList[index].start + 1)"
                :max="index === 0 ? 9999 : (form.mileageSectionList[index + 1] ? form.mileageSectionList[index + 1].start : 9999)"
                placeholder="输入上限"
                style="width: 45%"
                :controls="false"
                step-strictly
                class="input-number-valiate"
              />
              <i
                v-if="index === 0"
                class="el-icon-circle-plus-outline item-icon-plus"
                @click.prevent="addSection('mileageSectionList')"
              />
              <i
                v-else
                class="el-icon-remove-outline item-icon-reduce"
                @click.prevent="removeSection(section, index, 'mileageSectionList')"
              />
            </div>
          </el-form-item>
        </div>
        <div
          v-else
          class="section-wrap"
        >
          <div class="section">
            <el-form-item
              v-for="(section, index) in form.weightSectionList"
              :key="index"
              :label="index === 0 ? '重量范围：' : ' '"
              :prop="'weightSectionList.' + index + '.start'"
            >
              <div class="item-after-icon">
                <el-input-number
                  v-model="section.start"
                  controls-position="right"
                  :min="index === 0 ? 0 : (form.weightSectionList[index - 1].end)"
                  :max="index === 0 ? 9999 : (form.weightSectionList[index + 1] ? form.weightSectionList[index + 1].start : 9999)"
                  placeholder="输入下限"
                  style="width: 45%"
                  :controls="false"
                  step-strictly
                  class="input-number-valiate"
                />
                <el-input-number
                  v-model="section.end"
                  controls-position="right"
                  :min="index === 0 ? section.start + 1 : (form.weightSectionList[index].start + 1)"
                  :max="index === 0 ? 9999 : (form.weightSectionList[index + 1] ? form.weightSectionList[index + 1].start : 9999)"
                  placeholder="输入上限"
                  style="width: 45%"
                  :controls="false"
                  step-strictly
                  class="input-number-valiate"
                />
                <i
                  v-if="index === 0"
                  class="el-icon-circle-plus-outline item-icon-plus"
                  @click.prevent="addSection('weightSectionList')"
                />
                <i
                  v-else
                  class="el-icon-remove-outline item-icon-reduce"
                  @click.prevent="removeSection(section, index, 'weightSectionList')"
                />
              </div>
            </el-form-item>
          </div>
          <div class="section">
            <el-form-item
              v-for="(section, index) in form.volumeSectionList"
              :key="index"
              :label="index === 0 ? '方数范围：' : ' '"
              :prop="'volumeSectionList.' + index + '.start'"
            >
              <div class="item-after-icon">
                <el-input-number
                  v-model="section.start"
                  controls-position="right"
                  :min="index === 0 ? 0 : (form.volumeSectionList[index - 1].end)"
                  :max="index === 0 ? 9999 : (form.volumeSectionList[index + 1] ? form.volumeSectionList[index + 1].start : 9999)"
                  placeholder="输入下限"
                  style="width: 45%"
                  :controls="false"
                  step-strictly
                  class="input-number-valiate"
                />
                <el-input-number
                  v-model="section.end"
                  controls-position="right"
                  :min="index === 0 ? section.start + 1 : (form.volumeSectionList[index].start + 1)"
                  :max="index === 0 ? 9999 : (form.volumeSectionList[index + 1] ? form.volumeSectionList[index + 1].start : 9999)"
                  placeholder="输入上限"
                  style="width: 45%"
                  :controls="false"
                  step-strictly
                  class="input-number-valiate"
                />
                <i
                  v-if="index === 0"
                  class="el-icon-circle-plus-outline item-icon-plus"
                  @click.prevent="addSection('volumeSectionList')"
                />
                <i
                  v-else
                  class="el-icon-remove-outline item-icon-reduce"
                  @click.prevent="removeSection(section, index, 'volumeSectionList')"
                />
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div
        slot="footer"
        style="text-align: right;margin: 20px 40px 0;"
      >
        <el-button
          size="small"
          @click="cancel"
        >
          取 消
        </el-button>

        <el-button
          type="primary"
          size="small"
          @click="save"
        >
          保 存
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script  lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { saveRange, viewRange } from '@/api/service-with-truck-service'

@Component({
  name: '',
  components: {},
  props: {
  }
})
export default class extends Vue {
  private loading: boolean = false
  private visible: boolean = false
  private text: string = '(取值范围：>=起始值， <结束值)'
  private sectionType: any = ''
  private modelWidth: any = '700px'
  private isEdit: boolean = false
  private relevanceRow: any = {}
  private form: any = {
    sectionList: [
      {
        start: undefined,
        end: undefined
      }
    ],
    mileageSectionList: [
      {
        start: undefined,
        end: undefined
      }
    ],
    weightSectionList: [
      {
        start: undefined,
        end: undefined
      }
    ],
    volumeSectionList: [
      {
        start: undefined,
        end: undefined
      }
    ]
  }

  // computed
  // 所属公司id
  get custId(): string {
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

  // methods
  // 显示弹窗
  private showModel(row: any, type: any) {
    this.sectionType = type // 1为托数 2为重量方数 3 为里程
    this.modelWidth = type === '2' ? '960px' : '700px'
    this.relevanceRow = row
    this.visible = true
    this.viewRange()
  }
  // 取消
  private cancel() {
    this.dialogClose('0')
  }
  private viewRange() {
    this.loading = true
    const params = {
      id: this.relevanceRow.id,
      priceType: this.relevanceRow.priceType
    }
    if (this.sectionType === '3') {
      params.priceType = '4'
    }
    viewRange(params).then((res: any) => {
      this.loading = false
      if (res.success) {
        const data = res.data || {}
        if (data.rangeList && data.rangeList.length) {
          this.isEdit = true
          if (this.sectionType === '1') {
            this.form.sectionList = data.rangeList.map((item: any) => {
              return {
                start: item.min,
                end: item.max
              }
            })
          }
          if (this.sectionType === '2') {
            this.form.weightSectionList = data.rangeList.filter((e: any) => e.type === '0').map((item: any) => {
              return {
                start: item.min,
                end: item.max
              }
            })
            this.form.volumeSectionList = data.rangeList.filter((e: any) => e.type === '1').map((item: any) => {
              return {
                start: item.min,
                end: item.max
              }
            })
          }
          if (this.sectionType === '3') {
            this.form.mileageSectionList = data.rangeList.map((item: any) => {
              return {
                start: item.min,
                end: item.max
              }
            })
          }
        } else {
          this.isEdit = false
        }
      }
    }).catch((err: any) => {
      this.isEdit = false
      this.loading = false
      return err
    })
  }
  // 删除
  private removeSection(data: any, index: number, listName: string) {
    this.form[listName] = this.form[listName].filter((item: any, i: any) => i !== index)
  }
  private addSection(listName: string) {
    this.form[listName] = [...this.form[listName], { start: undefined, end: undefined }]
  }
  // 点击弹窗关闭
  private dialogClose(type: string) {
    this.form = {
      sectionList: [
        {
          start: undefined,
          end: undefined
        }
      ],
      mileageSectionList: [
        {
          start: undefined,
          end: undefined
        }
      ],
      weightSectionList: [
        {
          start: undefined,
          end: undefined
        }
      ],
      volumeSectionList: [
        {
          start: undefined,
          end: undefined
        }
      ]
    }
    this.visible = false
    if (type === '1') {
      this.$emit('change')
    }
  }
  // 检验断层
  private checkout(list: any[]) {
    let flag = true
    for (let i = 0; i < list.length; i++) {
      if (i > 0) {
        const next = list[i]
        const item = list[i - 1]
        if (next.start !== item.end) {
          flag = false
          break
        }
      }
    }
    return flag
  }
  // 校验必填
  private chechoutRequired(list: any[]) {
    let flag = true
    for (const item of list) {
      if ((item.start !== 0 && !item.start) || !item.end) {
        flag = false
        break
      }
    }
    return flag
  }
  // 保存
  private save() {
    let flag = true
    let flag2 = true
    let list = []
    let priceType = this.relevanceRow.priceType
    if (this.sectionType === '1') {
      flag = this.checkout(this.form.sectionList)
      flag2 = this.chechoutRequired(this.form.sectionList)
      list = this.form.sectionList.map((item: any) => {
        return {
          max: item.end,
          min: item.start
        }
      })
    }
    if (this.sectionType === '2') {
      if (this.checkout(this.form.weightSectionList) && this.checkout(this.form.volumeSectionList)) {
        flag = true
      } else {
        flag = false
      }
      if (this.chechoutRequired(this.form.weightSectionList) && this.chechoutRequired(this.form.volumeSectionList)) {
        flag2 = true
      } else {
        flag2 = false
      }
      const weightSectionList = this.form.weightSectionList.map((item: any) => {
        return {
          max: item.end,
          min: item.start,
          type: '0'
        }
      })
      const volumeSectionList = this.form.volumeSectionList.map((item: any) => {
        return {
          max: item.end,
          min: item.start,
          type: '1'
        }
      })
      list = weightSectionList.concat(volumeSectionList)
    }
    if (this.sectionType === '3') {
      priceType = '4'
      flag = this.checkout(this.form.mileageSectionList)
      flag2 = this.chechoutRequired(this.form.mileageSectionList)
      list = this.form.mileageSectionList.map((item: any) => {
        return {
          max: item.end,
          min: item.start
        }
      })
    }
    if (!flag2) {
      this.$message.warning('区间范围不能为空')
      return
    }
    if (!flag) {
      this.$message.warning('区间不能出现断层')
      return
    }
    const params = {
      ifEdit: this.isEdit,
      kscId: this.relevanceRow.id,
      priceType,
      rangeList: list
    }
    this.loading = false
    saveRange(params).then((res: any) => {
      this.loading = false
      if (res.success) {
        this.$message.success('操作成功')
        this.dialogClose('1')
      }
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }
}
</script>

<style lang="scss" scoped>
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
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
  .section-wrap{
    display: flex;
    justify-content: space-between;
    position: relative;
    &:before{
      width: 4px;
      height: 100%;
      background: #eee;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      content: '';
    }
  }
  ::v-deep .el-form-item{
    margin: 0;
    padding: 7px 0;
  }
.item-after-icon {
  position: relative;
  .item-icon-plus {
    position: absolute;
    top: 6px;
    color:#409eff;
    font-size:18px;
    margin-left:10px;
    cursor:pointer;
  }
  .item-icon-reduce {
    position: absolute;
    top: 6px;
    color:#f56c6c;
    font-size:18px;
    margin-left:10px;
    cursor:pointer;
  }
}
</style>
