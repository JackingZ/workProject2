<template>
  <div>
    <div style="display: flex; flex-direction: row;overflow-x: auto;">
      <div style="flex: 60%;border: 1px solid #ccc;margin-right: 5px;padding-top: 20px;">
        <div style="padding-left: 20px;">
          <span style="line-height: 22px;font-size: 18px;padding-right: 20px;">
            班次岗位日历
          </span>
          <el-button
            type="text"
            size="small"
            @click="handleWeek"
          >
            周期分配班次岗位
          </el-button>
          <div>
            <el-button
              size="small"
              :class="view === '0' ? 'view-active' : ''"
              @click="handleView('0')"
            >
              按人员查看
            </el-button>
            <el-button
              size="small"
              :class="view === '1' ? 'view-active' : ''"
              @click="handleView('1')"
            >
              按班次查看
            </el-button>
            <el-button
              size="small"
              :class="view === '2' ? 'view-active' : ''"
              @click="handleView('2')"
            >
              按岗位查看
            </el-button>
            <el-button
              size="small"
              :class="view === '3' ? 'view-active' : ''"
              @click="handleView('3')"
            >
              按操作中心查看
            </el-button>
          </div>
        </div>
        <div
          v-loading="calenderLoading"
          style="padding: 20px;"
        >
          <jht-calendar
            :masks="masks"
            :attributes="calendarData"
            class="jht-calendar"
            disable-page-swipe
            is-expanded
            @update:to-page="handlePaneClick"
          >
            <div
              slot="day-content"
              slot-scope="{day, attributes}"
              style="height: 100%;cursor: pointer;padding: 5px;"
              :class="dayTime === day.id ? 'is-selected' : ''"
              @click="handleDayClick(day.date)"
            >
              <span>{{ day.day }}</span>
              <div
                v-for="(attr, index) in attributes"
                :key="index"
                style="height: 40px;"
              >
                <p class="calender-content">
                  {{ attributeFilter(attr.customData) }}
                </p>
              </div>
            </div>
          </jht-calendar>
        </div>
      </div>
      <div
        v-loading="loading"
        style="flex: 40%;border: 1px solid #ccc;margin-left: 5px;padding: 20px;"
      >
        <div style="line-height: 22px;font-size: 18px;">
          班次岗位明细
        </div>
        <div style="text-align: right;">
          <span style="float: left;line-height: 32px;">{{ ymdFilter(dayTime) }}</span>
          <el-button
            v-permission="['warehouseShiftPostAdd']"
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
          :data="tableData"
          border
          height="550px"
          style="width: 100%;margin: 10px 0;"
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
                filterable
                clearable
                @focus="getEmployeeList"
              >
                <el-option
                  v-for="(item, index) in employeeList"
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
                filterable
                clearable
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
                filterable
                clearable
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
                filterable
                clearable
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
            width="110px"
          >
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.isEdit"
                type="text"
                size="small"
                @click="handleEdit(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="handleDelete(scope.$index)"
              >
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div
          v-show="isAddShow"
          style="text-align: right;"
        >
          <el-button
            size="small"
            @click="handleDayCancel"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="handleDaySave"
          >
            保存
          </el-button>
        </div>
      </div>
    </div>
    <el-dialog
      title="周期设置班次岗位"
      :visible.sync="isShowChange"
      :close-on-click-modal="false"
      class="week-dialog"
      width="1000px"
      @close="handleClose"
    >
      <shiftPostWeek
        ref="editForm"
        :ws-id="wsId"
        @cancel="close"
        @getMonthData="getMonthData"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import dayjs from 'dayjs'
import {
  setMonthShiftPost,
  getMonthShiftPost,
  saveDayShiftPost,
  getWorkCenterData,
  getSchedulList,
  getPostList,
  getPersonList
} from '@/api/warehose-by-config'
import shiftPostWeek from '@/views/warehose-management/warehouse-config/shiftPostCompontent/shiftPostWeek.vue'
@Component({
  name: 'ShiftPostAllocation',
  components: {
    shiftPostWeek
  },
  props: {
    wsId: {
      type: String,
      default: ''
    },
    ctId: {
      type: String,
      default: ''
    }
  }
})
export default class ShiftPostAllocation extends Vue {
  private loading: boolean = false
  private calenderLoading: boolean = false
  private selectLoading: boolean = false
  private isShowChange: boolean = false
  private tableData: any[] = []
  private tableJson: any[] = []
  private view = '0'
  private monthTime = ''
  private dayTime = ''
  private currentTime = ''
  private calendarData: any[] = []
  private employeeList: any[] = []
  private wcList: any[] = []
  private shiftList: any[] = []
  private postList: any[] = []
  private isAddShow: boolean = false
  private masks = {
    weekdays: 'WWW'
  }
  // computed

  // methods
  private handleClose(): void {
    this.$nextTick(() => {
      const root: any = this.$refs.editForm
      root.cancel()
    })
  }
  private close(): void {
    this.isShowChange = false
  }
  private handleWeek(): void {
    this.isShowChange = true
    this.$nextTick(() => {
      const root: any = this.$refs.editForm
      const id = (this as any).ctId
      root.setData(id)
    })
  }

  // 日历
  private ymdFilter(time: any) {
    if (time) {
      return dayjs(time).format('YYYY年MM月DD日')
    }
  }
  private attributeFilter(item: any) {
    let name
    switch (this.view) {
      case '0':
        name = item.employees.join('、') // 人员
        break
      case '1':
        name = item.shifts.join('、') // 班次
        break
      case '2':
        name = item.posts.join('、') // 岗位
        break
      case '3':
        name = item.wcs.join('、') // 操作中心
        break
      default:
        break
    }
    return name
  }
  private handleView(val: any) {
    this.view = val
  }
  private handlePaneClick(page: any) {
    const date = page.year + '-' + page.month
    this.monthTime = dayjs(date).format('YYYY-MM')
    const time = dayjs(this.currentTime).format('YYYY-MM')
    if (time === this.monthTime) {
      this.dayTime = this.currentTime
    } else {
      this.dayTime = dayjs(this.monthTime + '-01').format('YYYY-MM-DD')
    }
    this.getMonthData()
  }
  private handleDayClick(date: any) {
    this.dayTime = dayjs(date).format('YYYY-MM-DD')
    this.handleDayDetail()
  }

  // 明细
  private handleAdd() {
    this.tableData.push({
      isAdd: true,
      isEdit: true,
      employeeId: undefined,
      employeeName: undefined,
      postId: undefined,
      postName: undefined,
      shiftId: undefined,
      shiftName: undefined,
      wcId: undefined,
      wcName: undefined
    })
    if (this.isAddShow) return
    this.isAddShow = true
  }
  private handleEdit(row: any) {
    this.$set(row, 'isAdd', true)
    if (this.isAddShow) return
    this.isAddShow = true
  }
  private handleDelete(index: any) {
    this.tableData.splice(index, 1)
    if (this.isAddShow) return
    this.isAddShow = true
  }
  private handleDayCancel() {
    this.tableData = JSON.parse(JSON.stringify(this.tableJson))
    this.isAddShow = false
  }
  private handleDaySave() {
    if (!this.dayTime) {
      this.$message.error('请选择班次岗位分配的日期')
      return
    }
    const isVal = this.tableData.every((it: any) => {
      return it.employeeId && it.postId && it.shiftId && it.wcId
    })
    if (!isVal) {
      this.$message.error('请完整填写班次岗位明细')
      return
    }
    const personArr = this.tableData.map((it: any) => it.employeeId)
    const arr = new Set(personArr)
    if (arr.size !== personArr.length) {
      this.$message.error('班次岗位明细的员工不能重复选择')
      return
    }
    this.loading = true
    this.tableData.map((it: any) => {
      it.employeeName = (this.employeeList.find((p: any) => it.employeeId === p.id) || {}).username
      it.postName = ((this as any).postList.find((p: any) => it.postId === p.id) || {}).name
      it.shiftName = ((this as any).shiftList.find((p: any) => it.shiftId === p.id) || {}).name
      it.wcName = ((this as any).wcList.find((p: any) => it.wcId === p.wcId) || {}).name
    })
    const addShiftDateDto: any = {
      dates: this.dayTime,
      warehouseId: (this as any).wsId,
      details: this.tableData
    }
    saveDayShiftPost(addShiftDateDto)
      .then((res: any) => {
        this.loading = false
        this.$message({
          type: 'success',
          message: '更新成功'
        })
        this.isAddShow = false
        this.getMonthData()
        this.handleDayDetail()
      })
      .catch((err: any) => {
        this.loading = false
        return [err, null]
      })
  }

  private getMonthData() {
    this.calenderLoading = true
    this.loading = true
    const shiftDto: any = {
      startDate: this.monthTime,
      warehouseId: (this as any).wsId
    }
    getMonthShiftPost(shiftDto)
      .then((res: any) => {
        const { data } = res
        this.calendarData = data.map((it: any) => {
          const { dates, employees, shifts, posts, wcs, details } = it
          return {
            dates,
            customData: {
              employees,
              shifts,
              posts,
              wcs,
              details
            }
          }
        })
        this.handleDayDetail()
        this.calenderLoading = false
        this.loading = false
      })
      .catch(() => {
        this.calenderLoading = false
        this.loading = false
      })
  }
  private handleDayDetail() {
    this.tableData = []
    this.tableJson = []
    this.isAddShow = false
    this.calendarData.map((it: any) => {
      const time: any = dayjs(it.dates).format('YYYY-MM-DD')
      if (time === this.dayTime) {
        this.tableData = JSON.parse(JSON.stringify(it.customData.details))
        this.tableJson = JSON.parse(JSON.stringify(it.customData.details))
        this.setTable()
      }
    })
  }
  private setTable() {
    this.$nextTick(() => {
      const root: any = this.$refs.table
      root.doLayout() // 解决表格错位
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
    if (this.employeeList.length > 0) return
    this.selectLoading = true
    const params: any = {
      custId: (this as any).ctId,
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
        this.employeeList = result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return [err, null]
      })
  }

  private mounted() {
    // zzz
  }
  private created(): void {
    this.monthTime = dayjs().format('YYYY-MM')
    this.dayTime = dayjs().format('YYYY-MM-DD')
    this.currentTime = dayjs().format('YYYY-MM-DD')
    this.getEmployeeList()
    this.getWCList()
    this.getShiftList()
    this.getPostList()
    // this.getMonthData()
  }
}
</script>

<style lang="scss" scoped>
.week-dialog {
  ::v-deep .el-dialog__body {
    padding: 5px 20px 20px;
  }
}
.view-active {
  background-color: #ecf5ff;
}
.is-selected {
  color: #1989fa;
  background-color: #f2f8fe;
}
.calender-content {
  margin: 0;
  line-height: 20px;
  max-width: 130px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.shift-post-calendar {
  ::v-deep .el-calendar__body {
    padding: 0 20px 20px;
  }
}
::v-deep .jht-calendar.vc-container {
  border-radius: 0;
  border-color: #dfe6ec;
  & .vc-font-semibold {
    font-weight: 400;
  }
  & .vc-arrows-container {
    z-index: 5;
  }
  & .vc-header {
    background-color: #fff;
    padding: 10px 0;
  }
  & .vc-weeks {
    padding: 0;
  }
  & .vc-weekday {
    background-color: #fff;
    border-bottom: 1px solid #ebeef5;
    border-top: 1px solid #ebeef5;
    padding: 5px 0;
  }
  & .vc-day {
    padding: 0px;
    text-align: left;
    height: 85px;
    background-color: #fff;
    &:not(.on-bottom) {
      border-bottom: 1px solid #ebeef5;
    }
    &:not(.on-right) {
      border-right: 1px solid #ebeef5;
    }
  }
  & .vc-day-dots {
    margin-bottom: 5px;
  }
  & .vc-text-gray-500 {
    color: #606266;
  }
}
</style>
