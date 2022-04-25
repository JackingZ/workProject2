<template>
  <div>
    <el-table
      v-loading="loading"
      :data="tableData"
      height="calc(100vh - 313px)"
      style="width: 100%;margin: 10px 0;"
      border
    >
      <el-table-column
        label="项目中文名称"
        prop="name"
      />

      <el-table-column
        label="项目英文名称"
        prop="alias"
      />

      <el-table-column
        label="服务类型"
        width="120"
        prop="serviceTypeName"
      />

      <el-table-column
        label="项目类型"
        width="120"
      >
        <template slot-scope="scope">
          {{ (scope.row.list || []).map(item => item.typeName).join(',') || '--' }}
        </template>
      </el-table-column>
      <el-table-column
        label="结算单位"
        width="120"
        prop="settlement"
      >
        <template slot-scope="scope">
          {{ settlementList[scope.row.settlement].name }}
        </template>
      </el-table-column>

      <el-table-column
        label="发票描述"
        prop="invoice"
      />

      <el-table-column
        label="备注"
        prop="remark"
      />

      <el-table-column
        label="操作"
        fixed="right"
        width="150"
      >
        <template slot-scope="scope">
          <div style="display: flex;align-items: center">
            <span style="font-size: 30px;margin-right: 5px">
              <strong>
                <span
                  v-if="scope.row.transConfiged"
                  style="color: #4cd964;"
                >
                  ·
                </span>
                <span
                  v-else
                  style="color: #ff3b30;"
                >
                  ·
                </span>
              </strong>
            </span>
            <el-button
              v-permission="['warehouseCustItemConfigSetting']"
              type="text"
              @click="editRow(scope.row)"
            >
              设置
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :width="isWidth"
      @closed="cancel"
    >
      <div slot="title">
        <span>
          {{ title }}
        </span>
        <div
          v-if="isType === 'one' && dialogForm.type === 2"
          style="font-size: 14px;color: #606266;"
        >
          {{ text }}
        </div>
      </div>
      <div v-loading="dialogLoading">
        <el-form
          ref="dialogForm"
          :model="dialogForm"
          label-width="120px"
          label-position="right"
          size="small"
          class="dialog-form"
        >
          <el-form-item
            label="是否启用"
            prop="status"
            style="width:85%;"
            class="is-required"
          >
            <el-radio-group
              v-model="dialogForm.status"
              @change="onStatus"
            >
              <el-radio label="0">
                否
              </el-radio>
              <el-radio label="1">
                是
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-show="dialogForm.status === '1' && isType === 'one'">
            <el-form-item
              label="计费方式"
              prop="type"
              style="width:85%;"
              class="is-required"
            >
              <el-select
                v-model="dialogForm.type"
                style="width:100%;"
                placeholder="请选择"
                filterable
                @change="onType"
              >
                <el-option
                  label="单位单价"
                  :value="1"
                />
                <el-option
                  label="区间"
                  :value="2"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-show="dialogForm.type === 2"
              label="区间范围"
              prop="sections"
              style="width: 92%;"
              class="is-required"
            >
              <div
                v-for="(item, index) in dialogForm.sections"
                :key="index"
                class="item-after-icon"
              >
                <el-input-number
                  v-model="dialogForm.sections[index].lower"
                  class="input-number-valiate"
                  style="width: 44.5%;"
                  :controls="false"
                  placeholder="输入下限"
                  :min="0"
                  :max="999999"
                  :step="1"
                  step-strictly
                />
                <el-input-number
                  v-model="dialogForm.sections[index].upper"
                  class="input-number-valiate"
                  style="width: 45%;"
                  :controls="false"
                  placeholder="输入上限"
                  :min="0"
                  :max="999999"
                  :step="1"
                  step-strictly
                />
                <span>
                  <i
                    v-if="index===0"
                    class="el-icon-circle-plus-outline item-icon-plus"
                    @click="addRangeData"
                  />
                  <i
                    v-else
                    class="el-icon-remove-outline item-icon-reduce"
                    @click="deleteRangeData(index)"
                  />
                </span>
              </div>
            </el-form-item>
          </div>
        </el-form>
        <div v-show="dialogForm.status === '1' && isType === 'three'">
          <el-transfer
            ref="transferItem"
            v-model="options"
            filterable
            :filter-method="filterMethod"
            :titles="[`选择${title}`, '已选择']"
            :props="{key: 'id', label: 'name'}"
            filter-placeholder="输入搜索"
            :data="list"
            style="height: 500px;"
          />
        </div>
        <div
          slot="footer"
          style="text-align: right;margin: 20px 40px 0;"
        >
          <el-button
            size="small"
            @click="cancel"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="save"
          >
            保存
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'

import {
  getCostitemConfigList,
  getCostitemConfigById,
  saveCostitemConfig,
  getWarehouseServer,
  getContainerList,
  getVehicleTypeList
} from '@/api/service-with-warehouse-service'

function paramsForm() {
  return {
    status: '0',
    type: 1,
    sections: [{
      lower: undefined,
      upper: undefined
    }]
  }
}

@Component({
  name: '',
  components: {},
  props: {
    wsId: {
      type: String,
      default: ''
    }
  }
})
export default class extends Vue {
  /* data */
  private text: string = '(取值范围：>=起始值， <结束值)'
  private loading: boolean = false
  private dialogVisible: boolean = false
  private dialogLoading: boolean = false
  private tableData: any = []
  private title = ''
  private currentId = ''
  private settlementList: any[] = [
    {
      id: '0',
      name: '按重量'
    },
    {
      id: '1',
      name: '按体积'
    },
    {
      id: '2',
      name: '按金额'
    },
    {
      id: '3',
      name: '按票'
    },
    {
      id: '4',
      name: '按箱'
    },
    {
      id: '5',
      name: '按车'
    },
    {
      id: '6',
      name: '按柜'
    },
    {
      id: '7',
      name: '按里程'
    },
    {
      id: '8',
      name: '按时间'
    },
    {
      id: '9',
      name: '按托'
    },
    {
      id: 'A',
      name: '按个数'
    }
  ]
  private isType = ''
  private isWidth = ''
  private options: any[] = []
  private list: any[] = []
  private serviceList: any[] = []
  private dialogForm: any = paramsForm()

  /* computed */

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

  /* methods */
  private async getWarehouseServer() {
    const params = {
      id: (this as any).wsId
    }
    await getWarehouseServer(params).then((res: any) => {
      this.serviceList = res.data || []
    }).catch((err: any) => {
      return err
    })
  }
  // 获取表格数据
  private queryAll(val?: any): void {
    this.loading = true
    const params = {
      serviceTypeId: '04',
      warehouseId: (this as any).wsId,
      list: this.serviceList.length <= 0 ? [''] : this.serviceList
    }
    getCostitemConfigList(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || []
        this.tableData = data
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  // 获取车型
  private getVehicleTypeList() {
    const params = {
      page: 1,
      size: 99999
    }
    getVehicleTypeList(params)
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result || []
        this.list = result
      })
      .catch((err: any) => {
        return err
      })
  }

  private getContainerList() {
    const params: any = {
      page: 1,
      size: 99999
    }
    getContainerList(params)
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result || []
        this.list = result
      })
      .catch((err: any) => {
        return err
      })
  }

  // 编辑
  private editRow(row: any): void {
    const { settlement, id } = row
    if (settlement === '5') {
      this.isType = 'three'
      this.title = '车型'
      this.isWidth = '960px'
      this.getVehicleTypeList()
    } else if (settlement === '6') {
      this.isType = 'three'
      this.isWidth = '960px'
      this.title = '柜型'
      this.getContainerList()
    } else {
      this.isType = 'one'
      this.isWidth = '600px'
      switch (settlement) {
        case '0':
          this.title = '按重量'
          break
        case '1':
          this.title = '按体积'
          break
        case '3':
          this.title = '按票'
          break
        case '4':
          this.title = '按箱'
          break
        case '7':
          this.title = '按里程'
          break
        case '8':
          this.title = '按时间'
          break
        case '9':
          this.title = '按托'
          break
        case 'A':
          this.title = '按个数'
          break
        default:
          break
      }
    }
    this.dialogVisible = true
    this.currentId = id
    this.getPriceConfig()
  }
  private onStatus() {
    this.dialogForm.type = 1
  }
  private onType() {
    this.dialogForm.sections = [
      {
        lower: undefined,
        upper: undefined
      }
    ]
  }
  private getPriceConfig() {
    this.dialogLoading = true
    const params: any = {
      costitemId: this.currentId,
      warehouseId: (this as any).wsId
    }
    getCostitemConfigById(params)
      .then((res: any) => {
        const result = res.data || {}
        const { rangeList, id, status } = result
        this.dialogForm.id = id
        this.dialogForm.status = status || '0'
        if (this.isType === 'one') { // 区间
          const arr = [{
            lower: undefined,
            upper: undefined
          }]
          if (Array.isArray(rangeList) && rangeList.length > 0) {
            const brr = rangeList.map((it: any) => {
              this.dialogForm.type = it.type
              return {
                lower: it.min,
                upper: it.max
              }
            })
            this.dialogForm.sections = brr
          } else {
            this.dialogForm.sections = arr
          }
        } else if (this.isType === 'three') { // 柜型
          this.options = rangeList.map((it: any) => (it.code))
        }
        this.dialogLoading = false
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }
  private addRangeData() {
    this.dialogForm.sections.push({
      lower: undefined,
      upper: undefined
    })
  }
  private deleteRangeData(index: number) {
    this.dialogForm.sections.splice(index, 1)
  }
  private filterMethod(query: any, item: any): boolean {
    const name = item.name || ''
    return name.indexOf(query) > -1
  }
  private cancel() {
    this.dialogVisible = false
    this.isType = ''
    this.options = []
    this.list = []
    this.dialogForm = paramsForm()
  }

  private rangeValidate(range: any[]) {
    const arrVal = range.every((item: any) => (item.lower === 0 || item.lower) && item.upper)
    if (!arrVal) {
      this.$message.error('请完整填写区间值')
      return false
    }
    const isMinMax = range.some((item:any) => {
      return item.upper <= item.lower
    })
    if (isMinMax) {
      this.$message({
        type: 'error',
        message: '下限值不能大于等于上限值'
      })
      return false
    }
    let mixVal = false
    range.map((it: any, index: any) => {
      mixVal = range.some((r: any, i: any) => {
        if (index !== i) {
          return (r.lower <= it.lower && it.lower < r.upper) || (r.lower < it.upper && it.upper <= r.upper)
        } else {
          return false
        }
      })
    })
    if (mixVal) {
      this.$message({
        type: 'error',
        message: '区间范围不能重叠'
      })
      return false
    }
    let flag = false
    for (let i = 0; i < range.length; i++) {
      if (i > 0) {
        const next = range[i]
        const item = range[i - 1]
        if (next.lower !== item.upper) {
          flag = true
          break
        }
      }
    }
    if (flag) {
      this.$message({
        type: 'error',
        message: '区间范围必须连续'
      })
      return false
    }
    return true
  }
  private save() {
    const { rangeList, sections, id, type, status } = this.dialogForm
    const params: any = {
      id,
      costitemId: this.currentId,
      warehouseId: (this as any).wsId,
      rangeList: [],
      status
    }
    const axisX: any[] = []
    if (status === '1' && this.isType === 'one') {
      if (!type) {
        this.$message.error('请选择计费方式')
        return
      }
      sections.map((it: any) => {
        axisX.push({
          max: it.upper || '',
          min: it.lower || '',
          code: '',
          name: '',
          type
        })
      })
      if (type === 2) {
        const isBool = this.rangeValidate(sections)
        if (!isBool) return
      }
      params.rangeList = axisX
    } else if (status === '1' && this.isType === 'three') {
      this.options.map((it: any) => {
        const item = this.list.find((l: any) => l.id === it) || {}
        if (item.id && item.name) {
          axisX.push({
            code: item.id || '',
            name: item.name || '',
            max: '',
            min: '',
            type: ''
          })
        }
      })
      params.rangeList = axisX
    }
    this.dialogLoading = true
    saveCostitemConfig(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.dialogLoading = false
        this.cancel()
        this.queryAll()
      })
      .catch((err: any) => {
        this.dialogLoading = false
        return err
      })
  }

  private async created() {
    await this.getWarehouseServer()
    this.queryAll()
  }
}
</script>

<style lang="scss" scoped>
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
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
.dialog-form {
  .el-form-item {
    display: inline-block;
    vertical-align: top;
    width: 50%;
    margin-bottom: 10px;
  }
}
.item-after-icon {
  position: relative;
  padding-bottom: 15px;
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
