<template>
  <div
    v-loading="loading"
  >
    <el-row>
      <el-col :span="6">
        <span style="line-height: 32px;">任务分配</span>
      </el-col>
      <el-col
        :span="18"
        style="text-align:right;padding-right: 10px;"
      >
        <el-button
          type="primary"
          size="small"
          @click="goBack"
        >
          返 回
        </el-button>
        <el-button
          v-if="isEdit && isType === 'company'"
          type="primary"
          size="small"
          @click="save"
        >
          保 存
        </el-button>
        <el-button
          v-if="isEdit && isType !== 'company'"
          type="primary"
          size="small"
          @click="addItem"
        >
          新 增
        </el-button>
      </el-col>
    </el-row>

    <el-form
      ref="form"
      :model="form"
      label-position="left"
      size="small"
    >
      <el-form-item
        v-if="isType === 'depart'"
        label="部门名称"
        style="width: 40%;"
        label-width="70px"
      >
        {{ form.deptName }}
      </el-form-item>
      <el-form-item
        v-if="isType === 'sales'"
        label="业务员名称"
        style="width: 30%;"
        label-width="90px"
      >
        {{ form.userName }}
      </el-form-item>
      <el-form-item
        label="年度"
        style="width: 20%;"
        label-width="50px"
      >
        {{ form.year }}
      </el-form-item>
      <el-form-item
        label="期间"
        style="width: 40%;"
        label-width="50px"
      >
        <span>{{ form.month + '(' }}</span>
        <span>{{ form.monthStart + '~' }}</span>
        <span>{{ form.monthEnd + ')' }}</span>
      </el-form-item>
    </el-form>
    <div v-show="isType === 'company'">
      <el-table
        v-if="tableData.length"
        :data="tableData"
        style="width: 100%;margin: 10px 0;"
        height="calc(100vh - 365px)"
        border
      >
        <el-table-column
          min-width="150"
          prop="companyName"
          label="公司"
        />
        <el-table-column
          min-width="120"
        >
          <template
            slot="header"
            slot-scope="scope"
          >
            <span style="display: block;">空运</span>
            <span>{{ airNumTotal(scope) }}</span>
            <span>/</span>
            <span>{{ form.airNum }} KG</span>
          </template>
          <template slot-scope="scope">
            <div>
              <el-input-number
                v-if="isEdit"
                v-model="scope.row.airNum"
                class="input-number-valiate"
                size="small"
                :controls="false"
                placeholder="请输入"
                :min="0"
                :max="999999"
              />
              <span v-else>{{ scope.row.airNum }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
        >
          <template
            slot="header"
            slot-scope="scope"
          >
            <span style="display: block;">海运</span>
            <span>{{ seaNumTotal(scope) }}</span>
            <span>/</span>
            <span>{{ form.seaNum }} CBM</span>
          </template>
          <template slot-scope="scope">
            <div>
              <el-input-number
                v-if="isEdit"
                v-model="scope.row.seaNum"
                class="input-number-valiate"
                size="small"
                :controls="false"
                placeholder="请输入"
                :min="0"
                :max="999999"
              />
              <span v-else>{{ scope.row.seaNum }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
        >
          <template
            slot="header"
            slot-scope="scope"
          >
            <span style="display: block;">铁路</span>
            <span>{{ trainNumTotal(scope) }}</span>
            <span>/</span>
            <span>{{ form.trainNum }} CBM</span>
          </template>
          <template slot-scope="scope">
            <div>
              <el-input-number
                v-if="isEdit"
                v-model="scope.row.trainNum"
                class="input-number-valiate"
                size="small"
                :controls="false"
                placeholder="请输入"
                :min="0"
                :max="999999"
              />
              <span v-else>{{ scope.row.trainNum }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
        >
          <template
            slot="header"
            slot-scope="scope"
          >
            <span style="display: block;">卡航</span>
            <span>{{ carNumTotal(scope) }}</span>
            <span>/</span>
            <span>{{ form.carNum }} KG</span>
          </template>
          <template slot-scope="scope">
            <div>
              <el-input-number
                v-if="isEdit"
                v-model="scope.row.carNum"
                class="input-number-valiate"
                size="small"
                :controls="false"
                placeholder="请输入"
                :min="0"
                :max="999999"
              />
              <span v-else>{{ scope.row.carNum }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div
      v-show="isType !== 'company'"
      class="order-detail"
    >
      <div class="masonry">
        <div
          v-for="(item, i) in taskData"
          :key="i"
          class="task-card"
        >
          <div class="task-card-header">
            <div v-if="!item.taskEdit">
              <el-row>
                <el-col :span="14">
                  <span style="font-weight: bold;font-size: 16px;line-height: 32px;">
                    第{{ item.week || '' }}周
                  </span>
                </el-col>
                <el-col
                  :span="10"
                  style="text-align: right;"
                >
                  <el-button
                    v-show="isEdit && item.details.some((d) => d.id)"
                    type="text"
                    size="small"
                    style="color: #f56c6c;"
                    @click="deleteItem(item)"
                  >
                    删除
                  </el-button>
                  <el-button
                    v-show="isEdit && !taskData.some((d) => d.taskEdit)"
                    type="text"
                    size="small"
                    @click="editItem(item, i)"
                  >
                    编辑
                  </el-button>
                </el-col>
              </el-row>
              <el-row style="font-size: 13px;color: #999;">
                <el-col :span="16">
                  {{ filterWeek(item) }}
                </el-col>
                <el-col
                  :span="8"
                  style="text-align: right;"
                >
                  共{{ item.days }}天
                </el-col>
              </el-row>
            </div>
            <div v-if="item.taskEdit">
              <el-select
                v-model="item.week"
                size="small"
                style="width: 45%;"
                placeholder="任务周期"
                clearable
                filterable
                @change="($event) => onWeek($event, i)"
              >
                <el-option
                  v-for="itemW in weekList"
                  :key="itemW.id"
                  :label="`第${itemW.id}周(${itemW.start}~${itemW.end})`"
                  :value="itemW.id"
                />
              </el-select>
            </div>
          </div>
          <div class="task-card-contain">
            <div v-show="item.taskEdit">
              <el-row style="padding-bottom: 10px;">
                <el-col
                  :span="11"
                  style="text-align: center;"
                >
                  服务组
                </el-col>
                <el-col
                  :span="11"
                  style="text-align: center;"
                >
                  目标
                </el-col>
              </el-row>
              <div
                v-for="(jtem, j) in item.details"
                :key="j"
                class="item-after-icon"
              >
                <el-select
                  v-model="jtem.groupId"
                  size="small"
                  style="width: 45%;"
                  placeholder="服务组"
                  clearable
                  filterable
                  @change="($event) => onGroup($event, i, j)"
                >
                  <el-option
                    v-for="itemL in serviceList"
                    :key="itemL.id"
                    :label="itemL.name"
                    :value="itemL.id"
                  />
                </el-select>
                <el-input-number
                  v-model="jtem.num"
                  class="input-number-valiate"
                  style="width: 45%;"
                  size="small"
                  :controls="false"
                  placeholder="请输入"
                  :min="0"
                  :max="999999"
                  :step="1"
                  step-strictly
                />
                <span>
                  <i
                    v-if="j === 0"
                    class="el-icon-circle-plus-outline item-icon-plus"
                    @click="addRangeData(i, j)"
                  />
                  <i
                    v-else
                    class="el-icon-remove-outline item-icon-reduce"
                    @click="deleteRangeData(i, j)"
                  />
                </span>
              </div>
            </div>
            <div v-if="!item.taskEdit">
              <el-table
                :data="item.details"
                style="width: 100%;margin: 10px 0;"
                border
              >
                <el-table-column
                  label="服务组"
                  prop="groupName"
                />
                <el-table-column
                  label="目标"
                  prop="num"
                >
                  <template slot-scope="scope">
                    {{ scope.row.num + (scope.row.business === '1' || scope.row.business === '2' ? 'CBM' : 'KG') }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-row>
              <el-col
                :span="24"
                style="text-align: right;"
              >
                <el-button
                  v-show="item.taskEdit"
                  size="mini"
                  @click="cancelItem(item, i)"
                >
                  取消
                </el-button>
                <el-button
                  v-show="item.taskEdit"
                  type="primary"
                  size="mini"
                  style="float: right;"
                  @click="saveItem(item)"
                >
                  保存
                </el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  getUnFinanceAgentList,
  getUnFinanceAgentById,
  getAgentList,
  saveCompanyDistribut,
  getCompanyDistribut,
  saveDepartDistribut,
  getDepartDistribut,
  saveSalesDistribut,
  getSalesDistribut,
  getGroupList,
  deleteSalesDistribut,
  deleteDepartDistribut
} from '@/api/sales-of-plan-distribut'
import dayjs from 'dayjs'

@Component({
  name: 'addEditForm',
  components: {},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  }
})

export default class extends Vue {
  /* data */
  private loading: boolean = false
  private tableData: any[] = []
  private taskData: any[] = []
  private copyData: any[] = []
  private serviceList: any[] = []
  private companyList: any = []
  private weekList: any = []
  private form: any = {}
  private isType: any = ''
  /* computed */
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }
  get custName(): string {
    const info = UserModule.info || {}
    const custName = (info as any).custName
    return custName
  }
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }

  /* methods */
  private filterWeek(item: any) {
    return dayjs(item.weekStart).format('YYYY-MM-DD') + '~' + dayjs(item.weekEnd).format('YYYY-MM-DD')
  }
  private airNumTotal(scope: any) {
    return this.tableData.reduce((tax: number, item: any) => {
      tax += (item.airNum || 0)
      return tax
    }, 0)
  }
  private seaNumTotal(scope: any) {
    return this.tableData.reduce((tax: number, item: any) => {
      tax += (item.seaNum || 0)
      return tax
    }, 0)
  }
  private trainNumTotal(scope: any) {
    return this.tableData.reduce((tax: number, item: any) => {
      tax += (item.trainNum || 0)
      return tax
    }, 0)
  }
  private carNumTotal(scope: any) {
    return this.tableData.reduce((tax: number, item: any) => {
      tax += (item.carNum || 0)
      return tax
    }, 0)
  }
  private async setData(row: any, val: string) {
    this.isType = val
    const { monthStart, monthEnd, ...form } = row
    this.form = {
      ...form,
      monthStart: dayjs(monthStart).format('YYYY-MM-DD'),
      monthEnd: dayjs(monthEnd).format('YYYY-MM-DD')
    }
    this.setWeek()
    this.getGroupList()
    await this.getDetail()
  }
  private setWeek() {
    const { monthStart, monthEnd } = this.form
    const startDay = dayjs(monthStart).format('YYYY-MM-DD')
    const endDay = dayjs(monthEnd).format('YYYY-MM-DD')
    const week = dayjs(startDay).day()
    let weekDay = ''
    if (week > 0) {
      weekDay = dayjs(startDay).endOf('week').add(1, 'day').format('YYYY-MM-DD')
    } else {
      weekDay = startDay
    } // 第一天的周日
    const tw = dayjs(weekDay).unix()
    const te = dayjs(endDay).unix()
    let arr: any[] = []
    if (tw >= te) {
      arr = [{
        start: startDay,
        end: endDay,
        days: dayjs(endDay).diff(dayjs(startDay), 'day') + 1,
        id: '1'
      }]
    } else {
      const num = (te - tw) / (7 * 86400)
      const index = Math.ceil(num)
      for (let i = 0; i <= index; i++) {
        const wds = dayjs(weekDay).add((i - 1) * 7 + 1, 'day').format('YYYY-MM-DD')
        const wde = dayjs(weekDay).add(i * 7, 'day').format('YYYY-MM-DD')
        if (i === 0) {
          arr.push({
            start: startDay,
            end: weekDay,
            days: dayjs(weekDay).diff(dayjs(startDay), 'day') + 1,
            id: `${i + 1}`
          })
        } else if (i === index) {
          arr.push({
            start: wds,
            end: endDay,
            days: dayjs(endDay).diff(dayjs(wds), 'day') + 1,
            id: `${index + 1}`
          })
        } else {
          arr.push({
            start: wds,
            end: wde,
            days: 7,
            id: `${i + 1}`
          })
        }
      }
    }
    this.weekList = arr
  }
  private async getDetail() {
    if (this.isType === 'company') {
      this.loading = true
      try {
        let arr: any[] = []
        const type = (this as any).custType
        if (type === '0') {
          const res = await getUnFinanceAgentById({ custId: this.form.companyId })
          arr = res.data || []
        } else {
          const res = await getUnFinanceAgentList()
          arr = res.data || []
        }
        this.companyList = arr.map((it: any) => {
          return {
            companyId: it.id,
            companyName: it.name,
            parentId: this.form.companyId,
            period: this.form.period,
            monthStart: this.form.monthStart + ' 00:00:00',
            monthEnd: this.form.monthEnd + ' 23:59:59',
            seaNum: 0,
            trainNum: 0,
            airNum: 0,
            carNum: 0,
            year: this.form.year,
            yearId: this.form.id
          }
        })
        const obj = {
          model: {
            yearId: this.form.id
          },
          page: 1,
          size: 9999
        }
        const resD = await getCompanyDistribut(obj)
        const brr = (resD.data || {}).result || []
        const list = this.companyList.map((it: any) => {
          const item = brr.find((a: any) => a.companyId === it.companyId)
          if (item) {
            it = {
              ...item,
              parentId: item.parentId || this.form.companyId
            }
          }
          return it
        })
        this.tableData = list
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    } else {
      this.loading = true
      try {
        let func: any = null
        if (this.isType === 'depart') {
          const params = {
            id: this.form.id
          }
          func = getDepartDistribut(params)
        } else if (this.isType === 'sales') {
          const params = {
            period: this.form.period,
            userId: this.form.userId,
            year: this.form.year,
            start: this.form.monthStart + ' 00:00:00',
            end: this.form.monthEnd + ' 23:59:59',
            month: this.form.month
          }
          func = getSalesDistribut(params)
        }
        const resD = await func
        const data = resD.data || {}
        this.taskData = []
        const arr: any[] = data.results || []
        this.form.id = (data.yearDeptPlan || {}).id
        if (arr.length) {
          this.taskData = arr.map((it: any) => {
            return {
              ...it,
              taskEdit: false
            }
          })
          this.copyData = JSON.parse(JSON.stringify(this.taskData))
        } else if ((this as any).isEdit) {
          this.taskData.push({
            taskEdit: true,
            week: undefined,
            weekStart: '',
            weekEnd: '',
            days: '',
            details: [{
              groupId: undefined,
              business: '',
              groupName: '',
              num: 0
            }]
          })
        }
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    }
  }

  private getGroupList() {
    const params = {
      model: {},
      page: 1,
      size: 9999
    }
    this.loading = true
    getGroupList(params).then((res: any) => {
      const data = res.data || {}
      const arr = data.result || []
      this.serviceList = arr.filter((it: any) => it.status === '1')
      this.loading = false
    }).catch(() => {
      this.loading = false
    })
  }

  private save() {
    this.loading = true
    if (this.isType === 'company') {
      const params: any = {
        yearPlan: {
          ...this.form,
          monthStart: dayjs(this.form.monthStart).format('YYYY-MM-DD') + ' 00:00:00',
          monthEnd: dayjs(this.form.monthEnd).format('YYYY-MM-DD') + ' 23:59:59'
        },
        companyPlan: this.tableData
      }
      saveCompanyDistribut(params)
        .then((res: any) => {
          this.loading = false
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.goBack()
        })
        .catch((err: any) => {
          this.loading = false
          return err
        })
    }
  }

  // 服务组
  private onWeek(val: any, i: number) {
    this.taskData[i].weekStart = ''
    this.taskData[i].weekEnd = ''
    this.taskData[i].days = ''
    const item = this.weekList.find((it: any) => it.id === val)
    if (item) {
      this.taskData[i].weekStart = item.start + ' 00:00:00'
      this.taskData[i].weekEnd = item.end + ' 23:59:59'
      this.taskData[i].days = item.days
    }
  }
  private onGroup(val: any, i: number, j: number) {
    this.taskData[i].details[j].groupName = ''
    this.taskData[i].details[j].business = ''
    const item = this.serviceList.find((it: any) => it.id === val)
    if (item) {
      this.taskData[i].details[j].groupName = item.name
      this.taskData[i].details[j].business = item.subtypeId
    }
  }
  private addItem() {
    const ifID = this.taskData.every((it: any) => it.details.some((d: any) => d.id))
    if (ifID) {
      this.taskData = JSON.parse(JSON.stringify(this.copyData))
      this.taskData.push({
        taskEdit: true,
        week: undefined,
        weekStart: '',
        weekEnd: '',
        days: '',
        details: [{
          groupId: undefined,
          business: '',
          groupName: '',
          num: 0
        }]
      })
    } else {
      this.$message.error('请先保存再新增')
    }
  }
  private editItem(item: any, i: number) {
    this.taskData[i].taskEdit = true
  }
  private cancelItem(item: any, i: number) {
    if (item.details.some((d: any) => d.id)) { // 编辑取消
      this.taskData[i].taskEdit = false
      this.taskData[i].details = JSON.parse(JSON.stringify(this.copyData[i].details))
    } else {
      this.taskData.splice(i, 1)
    }
  }
  private saveItem(item: any) {
    const weekLength = this.taskData.filter((it: any) => it.week === item.week).length
    const itemGroup: any[] = item.details
    const groupID = itemGroup.map((it: any) => it.groupId)
    const groupSet = [...new Set(groupID)]
    if (!item.week) {
      this.$message.error('任务周期不能为空')
      return
    } else if (weekLength > 1) {
      this.$message.error('任务周期不能重复')
      return
    } else if (!item.details.every((it: any) => it.groupId)) {
      this.$message.error('服务组不能为空')
      return
    } else if (groupSet.length < groupID.length) {
      this.$message.error('服务组不能重复')
      return
    }
    this.loading = true
    const groupAll: any[] = []
    this.taskData.map((it: any) => {
      it.details && it.details.map((d: any) => {
        groupAll.push({
          ...d,
          did: this.form.id,
          week: it.week,
          weekStart: it.weekStart,
          weekEnd: it.weekEnd,
          days: it.days
        })
      })
    })

    let func: any = null
    if (this.isType === 'depart') {
      const params: any = {
        yearDeptPlan: {
          ...this.form,
          monthStart: dayjs(this.form.monthStart).format('YYYY-MM-DD') + ' 00:00:00',
          monthEnd: dayjs(this.form.monthEnd).format('YYYY-MM-DD') + ' 23:59:59'
        },
        details: groupAll
      }
      func = saveDepartDistribut(params)
    } else if (this.isType === 'sales') {
      const params: any = {
        yearUserPlan: {
          ...this.form,
          monthStart: dayjs(this.form.monthStart).format('YYYY-MM-DD') + ' 00:00:00',
          monthEnd: dayjs(this.form.monthEnd).format('YYYY-MM-DD') + ' 23:59:59'
        },
        details: groupAll
      }
      func = saveSalesDistribut(params)
    }
    func
      .then(async(res: any) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        await this.getDetail()
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private deleteItem(item: any) {
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        const params = {
          did: this.form.id,
          week: item.week
        }
        let func: any = null
        if (this.isType === 'depart') {
          func = deleteDepartDistribut
        } else if (this.isType === 'sales') {
          func = deleteSalesDistribut
        }
        func(params)
          .then(async(res: any) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            await this.getDetail()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }
  private addRangeData(i: number, j: number) {
    this.taskData[i].details.push({
      groupId: undefined,
      business: '',
      groupName: '',
      num: 0
    })
  }
  private deleteRangeData(i: number, j: number) {
    this.taskData[i].details.splice(j, 1)
  }
  private goBack() {
    this.isType = ''
    this.tableData = []
    this.companyList = []
    this.taskData = []
    this.copyData = []
    this.$emit('close')
  }
}
</script>

<style lang="scss" scoped>
.order-detail {
  height: calc(100vh - 345px);
  overflow-y: auto;
}
.el-form-item {
  display: inline-block;
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

::v-deep .el-input-number .el-input__inner{
  text-align: left;
}

.masonry {
  width: 100%; // 默认宽度
  columns: 4; // 默认列数
  column-gap: 10px; // 列间距
}
.task-card-header {
  padding: 10px 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #e6ebf5;
}
.task-card-contain {
  padding: 10px 20px;
}
.task-card {
  border-radius: 4px;
  border: 1px solid #e6ebf5;
  background-color: #FFFFFF;
  width: 100%;
  break-inside: avoid;
  margin-bottom: 10px;
}

@media screen and (min-width: 992px) and (max-width: 1200px) {
  .masonry {
    width: 100%;
    columns: 3;
    column-gap: 10px;
  }
}
@media screen and (min-width: 768px) and (max-width: 992px) {
  .masonry {
    width: 100%;
    columns: 2;
    column-gap: 10px;
  }
}

.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}

</style>
