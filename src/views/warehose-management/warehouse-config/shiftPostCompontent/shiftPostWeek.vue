<template>
  <div
    v-loading="weekLoading"
    class="shift-post-week"
  >
    <div style="height: 24px;">
      1、设置一周周期
    </div>
    <div style="display: flex; flex-direction: row;">
      <div style="width: 280px;border: 1px solid #ccc;margin-right: 5px;">
        <div
          v-for="(item, index) in weekData"
          :key="index"
          class="week-data"
          :class="selected === item.id ? 'active' : ''"
          @click="handleWeek(item)"
        >
          <div class="week-day">
            <span>{{ item.label }}</span>
          </div>
          <div class="week-persons">
            <p>{{ contentFilter(item.content) }}</p>
          </div>
        </div>
      </div>
      <div style="width: 670px;border: 1px solid #ccc;margin-left: 5px;padding: 10px;">
        <div style="line-height: 22px;font-size: 18px;">
          班次岗位明细
        </div>
        <div style="text-align: right;padding-right: 10px;">
          <el-button
            type="text"
            size="small"
            icon="el-icon-circle-plus-outline"
            @click="handleAdd"
          >
            新增明细
          </el-button>
        </div>
        <el-table
          ref="table"
          :data="table"
          border
          height="436px"
          style="width: 640px;margin: 10px 0;"
        >
          <el-table-column
            prop="employeeName"
            label="员工"
          >
            <template slot-scope="scope">
              <el-select
                v-if="scope.row.isAdd"
                v-model="scope.row.employeeId"
                :loading="selectLoading"
                placeholder="请选择"
                size="small"
                filterable
                @focus="getEmployeeList"
                @change="onPersonChange"
              >
                <el-option
                  v-for="(item, index) in personList"
                  :key="index"
                  :label="item.username"
                  :value="item.id"
                />
              </el-select>
              <span v-else>{{ scope.row.employeeName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="shiftName"
            label="所属班次"
          >
            <template slot-scope="scope">
              <el-select
                v-if="scope.row.isAdd"
                v-model="scope.row.shiftId"
                :loading="selectLoading"
                placeholder="请选择"
                size="small"
                filterable
                @focus="getShiftList"
              >
                <el-option
                  v-for="(item, index) in shiftList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <span v-else>{{ scope.row.shiftName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="postName"
            label="所属岗位"
          >
            <template slot-scope="scope">
              <el-select
                v-if="scope.row.isAdd"
                v-model="scope.row.postId"
                :loading="selectLoading"
                placeholder="请选择"
                size="small"
                filterable
                @focus="getPostList"
              >
                <el-option
                  v-for="(item, index) in postList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <span v-else>{{ scope.row.postName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="wcName"
            label="所属操作中心"
          >
            <template slot-scope="scope">
              <el-select
                v-if="scope.row.isAdd"
                v-model="scope.row.wcId"
                :loading="selectLoading"
                placeholder="请选择"
                size="small"
                filterable
                @focus="getWCList"
              >
                <el-option
                  v-for="(item, index) in wcList"
                  :key="index"
                  :label="item.name"
                  :value="item.wcId"
                />
              </el-select>
              <span v-else>{{ scope.row.wcName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="70"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="handleDelete(scope.row, scope.$index)"
              >
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div style="height: 24px;margin-top: 10px;">
      2、将周期应用到
    </div>
    <div>
      <el-date-picker
        v-model="monthDate"
        value-format="yyyy-MM"
        size="small"
        type="month"
        placeholder="选择月"
      />
    </div>
    <div
      style="text-align: right;padding-top: 20px;"
    >
      <el-button
        @click="preview"
      >
        班次岗位分配预览
      </el-button>
      <el-button
        @click="cancel"
      >
        取 消
      </el-button>
      <el-button
        type="primary"
        :loading="weekLoading"
        @click="save"
      >
        保 存
      </el-button>
    </div>
    <el-dialog
      title="班次岗位分配预览"
      :visible.sync="isPreview"
      :close-on-click-modal="false"
      class="view-dialog"
      top="10vh"
      append-to-body
      width="1460px"
      @close="close"
    >
      <calendarPreview
        ref="calendarView"
      />
    </el-dialog>
  </div>
</template>

<script  lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'
import {
  setMonthShiftPost,
  getWorkCenterData,
  getSchedulList,
  getPostList,
  getPersonList
} from '@/api/warehose-by-config'
import dayjs from 'dayjs'
import calendarPreview from '@/views/warehose-management/warehouse-config/shiftPostCompontent/calendarPreview.vue'

function weekday() {
  return [
    { weekDay: 1, infoList: [] },
    { weekDay: 2, infoList: [] },
    { weekDay: 3, infoList: [] },
    { weekDay: 4, infoList: [] },
    { weekDay: 5, infoList: [] },
    { weekDay: 6, infoList: [] },
    { weekDay: 7, infoList: [] }
  ]
}
function weekData() {
  return [
    { label: '周一', content: [], id: 2 },
    { label: '周二', content: [], id: 3 },
    { label: '周三', content: [], id: 4 },
    { label: '周四', content: [], id: 5 },
    { label: '周五', content: [], id: 6 },
    { label: '周六', content: [], id: 7 },
    { label: '周日', content: [], id: 1 }
  ]
}

@Component({
  name: 'ShiftPostWeek',
  components: {
    calendarPreview
  },
  props: {
    wsId: {
      type: String,
      default: ''
    }
  }
})

export default class ShiftPostWeek extends Vue {
  // data
  private subTableData: any[] = []
  private subLoading: boolean = false
  private weekLoading: boolean = false
  private isPreview: boolean = false
  private selectLoading: boolean = false
  private wcList: any[] = []
  private shiftList: any[] = []
  private postList: any[] = []
  private monthDate = ''
  private selected = 2
  private custId = ''
  private personList: any[] = []
  private weekdayList: any[] = weekday()
  private weekData: any[] = weekData()
  // computed
  get table() {
    return this.subTableData.filter((it: any) => {
      return it.isWeek === this.selected
    })
  }
  // methods
  private setData(data: any) {
    this.custId = data
    this.$nextTick(() => {
      const root: any = this.$refs.table
      root.doLayout() // 解决表格错位
    })
  }
  private contentFilter(data: any) {
    return data.length > 0 ? data.join('、') : ''
  }
  private handleWeek(item: any) {
    this.selected = item.id
  }
  private handleAdd() {
    this.subTableData.push({
      isAdd: true,
      isWeek: this.selected,
      isStr: String(Math.random()),
      employeeId: undefined,
      employeeName: undefined,
      postId: undefined,
      postName: undefined,
      shiftId: undefined,
      shiftName: undefined,
      wcId: undefined,
      wcName: undefined
    })
  }
  private handleDelete(row: any) {
    this.subTableData = this.subTableData.filter((it: any) => it.isStr !== row.isStr)
    this.weekData.map((item: any) => {
      if (item.id === this.selected) {
        item.content = []
        this.subTableData.map((it: any) => {
          if (item.id === it.isWeek) {
            item.content.push(it.employeeName)
          }
        })
        item.content = [...new Set(item.content)]
      }
    })
  }
  private onPersonChange() {
    this.subTableData.map((it: any) => {
      it.employeeName = (this.personList.find((p: any) => it.employeeId === p.id) || {}).username
    })
    const arr: any[] = this.subTableData.map((it: any, index: any) => {
      return ({
        id: it.isWeek,
        name: it.employeeName
      })
    })
    this.weekData.map((it: any) => {
      const content: any[] = arr.filter((a: any) => it.id === a.id).map((n: any) => n.name)
      it.content = [...new Set(content)]
    })
  }
  private preview() {
    const isVal = this.subTableData.every((it: any) => {
      return it.employeeId && it.postId && it.shiftId && it.wcId
    })
    if (!isVal) {
      this.$message.error('请完整填写班次岗位明细')
      return
    }
    if (!this.monthDate) {
      this.$message.error('请选择周期应用的时间')
      return
    }
    this.subTableData.map((it: any) => {
      it.employeeName = (this.personList.find((p: any) => it.employeeId === p.id) || {}).username
      it.postName = ((this as any).postList.find((p: any) => it.postId === p.id) || {}).name
      it.shiftName = ((this as any).shiftList.find((p: any) => it.shiftId === p.id) || {}).name
      it.wcName = ((this as any).wcList.find((p: any) => it.wcId === p.wcId) || {}).name
    })
    this.isPreview = true
    this.$nextTick(() => {
      const root: any = this.$refs.calendarView
      root.setData(this.subTableData, this.monthDate)
    })
  }
  private close() {
    this.isPreview = false
    this.$nextTick(() => {
      const root: any = this.$refs.calendarView
      root.cancel()
    })
  }
  private cancel() {
    this.selected = 2
    this.monthDate = ''
    this.weekdayList = weekday()
    this.subTableData = []
    this.weekData = weekData()
    this.$emit('cancel')
  }
  private save() {
    const isVal = this.subTableData.every((it: any) => {
      return it.employeeId && it.postId && it.shiftId && it.wcId
    })
    if (!isVal) {
      this.$message.error('请完整填写班次岗位明细')
      return
    }
    if (!this.monthDate) {
      this.$message.error('请选择周期应用的时间')
      return
    }
    this.subTableData.map((it: any) => {
      it.employeeName = (this.personList.find((p: any) => it.employeeId === p.id) || {}).username
      it.postName = ((this as any).postList.find((p: any) => it.postId === p.id) || {}).name
      it.shiftName = ((this as any).shiftList.find((p: any) => it.shiftId === p.id) || {}).name
      it.wcName = ((this as any).wcList.find((p: any) => it.wcId === p.wcId) || {}).name
    })
    let isRep
    this.weekdayList.map((it: any) => {
      it.infoList = this.subTableData.filter((s: any) => {
        return it.weekDay === s.isWeek
      })
      const personArr = it.infoList.map((item: any) => item.employeeId)
      const arr = new Set(personArr)
      if (arr.size !== personArr.length) {
        isRep = true
      }
    })
    if (isRep) {
      this.$message.error('班次岗位明细的一天之中员工不能重复选择')
      return
    }
    this.weekLoading = true
    const shiftDataInfoDto = {
      endDate: this.monthDate,
      startDate: this.monthDate,
      warehouseId: (this as any).wsId,
      weekdayList: this.weekdayList
    }
    setMonthShiftPost(shiftDataInfoDto).then((res: any) => {
      this.weekLoading = false
      this.$message({
        type: 'success',
        message: '保存成功'
      })
      this.cancel()
      this.$emit('getMonthData')
    }).catch((err: any) => {
      this.weekLoading = false
      return [err, null]
    })
  }

  private getWCList() {
    if (this.wcList.length > 0) return
    this.selectLoading = true
    getWorkCenterData({
      schedule: 'true',
      warehouseId: (this as any).wsId
    })
      .then((res: any) => {
        const { data } = res
        this.wcList = data || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return [err, null]
      })
  }

  private getShiftList() {
    if (this.shiftList.length > 0) return
    this.selectLoading = true
    getSchedulList({
      warehouseId: (this as any).wsId
    })
      .then((res: any) => {
        const { data } = res
        this.shiftList = data || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return [err, null]
      })
  }

  private getPostList() {
    if (this.postList.length > 0) return
    this.selectLoading = true
    getPostList({
      page: 1,
      size: 9999
    })
      .then((res: any) => {
        const { data: { result } } = res
        this.postList = result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return [err, null]
      })
  }

  private getEmployeeList() {
    if (this.personList.length > 0) return
    this.selectLoading = true
    const params: any = {
      custId: this.custId,
      page: 1,
      size: 9999,
      deptId: '',
      key: '',
      keyType: '',
      postId: '',
      status: ''
    }
    getPersonList(params)
      .then((res: any) => {
        const { data: { result } } = res
        this.personList = result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return [err, null]
      })
  }
}
</script>

<style lang="scss" scoped>
.shift-post-week {
  .week-data {
    display: flex;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
    &:last-of-type {
      border-bottom: none;
    }
  }
  .week-day {
    width: 70px;
    height: 75px;
    line-height: 75px;
    text-align: center;
    font-weight: bold;
    border-right: 1px solid #ccc;
  }
  .week-persons {
    width: 208px;
    height: 75px;
    p {
      margin: 10px;
      line-height: 18px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
  }
  .active {
    background-color: #ecf5ff;
  }
}
.view-dialog {
  ::v-deep .el-dialog__body {
    padding: 5px 20px 20px;
  }
}
</style>
