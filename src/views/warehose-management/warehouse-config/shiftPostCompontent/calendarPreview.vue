<template>
  <div>
    <div style="display: flex; flex-direction: row;">
      <div style="flex: 65%;border: 1px solid #ccc;margin-right: 5px;">
        <div style="padding: 0 10px;">
          <div style="font-size: 18px;padding: 10px 0;">
            班次岗位日历
          </div>
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
        <div style="padding: 10px;">
          <jht-calendar
            ref="calendar"
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
                  {{ calendarFilter(attr.customData) }}
                </p>
              </div>
            </div>
          </jht-calendar>
        </div>
      </div>
      <div style="flex: 35%;border: 1px solid #ccc;margin-left: 5px;">
        <div style="padding: 0 10px;">
          <div style="font-size: 18px;padding: 10px 0;">
            班次岗位明细
          </div>
          <div style="line-height: 22px;height: 22px;">
            {{ ymdFilter(dayTime) }}
          </div>
          <el-table
            :data="table"
            border
            height="600px"
            style="width: 100%;margin-top: 30px;"
          >
            <el-table-column
              prop="employeeName"
              label="员工"
            />
            <el-table-column
              prop="shiftName"
              label="所属班次"
            />
            <el-table-column
              prop="postName"
              label="所属岗位"
            />
            <el-table-column
              prop="wcName"
              label="所属操作中心"
            />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import dayjs from 'dayjs'
import {
  getMonthShiftPost
} from '@/api/warehose-by-config'

type snu = number | string

@Component({
  name: 'Calendar',
  components: {},
  props: {}
})
export default class Calendar extends Vue {
  // data
  private view = '0'
  private monthTime = ''
  private monthDate = ''
  private dayTime = ''
  private weekDay: snu = ''
  private tableData: any[] = []
  private calendarData: any[] = []
  private masks = {
    weekdays: 'WWW'
  }
  // computed
  get table() {
    return this.tableData.filter((it: any) => {
      return it.isWeek === this.weekDay && this.monthDate === this.monthTime
    })
  }
  // method
  private setData(data: any, month: any) {
    this.tableData = data
    const days = dayjs(month).daysInMonth()
    this.calendarData = []
    for (let i = 1; i < Number(days); i++) {
      const dates = dayjs(month + i).format('YYYY-MM-DD')
      const isWeek = dayjs(dates).day() + 1
      this.calendarData.push({
        dates,
        isWeek,
        customData: {
          employees: [],
          posts: [],
          shifts: [],
          wcs: []
        }
      })
    }
    this.calendarData.map((c: any) => {
      this.tableData.filter((t: any) => t.isWeek === c.isWeek).map((a: any) => {
        if (a && Object.keys(a).length > 0) {
          const { employeeName, postName, shiftName, wcName } = a
          c.customData.employees.push(employeeName)
          c.customData.posts.push(postName)
          c.customData.shifts.push(shiftName)
          c.customData.wcs.push(wcName)
        }
      })
    })
    this.view = '0'
    this.monthDate = month
    this.dayTime = dayjs().format('YYYY-MM-DD')
    this.weekDay = dayjs().day() + 1
  }
  private cancel() {
    this.view = '0'
    this.monthTime = ''
    this.monthDate = ''
    this.dayTime = ''
    this.weekDay = ''
    this.tableData = []
    this.calendarData = []
  }
  private handleView(val: any) {
    this.view = val
  }
  private ymdFilter(time: any) {
    if (time) {
      return dayjs(time).format('YYYY年MM月DD日')
    }
  }
  private calendarFilter(item: any) {
    let name
    const arr0: any[] = [...new Set(item.employees)]
    const arr1: any[] = [...new Set(item.shifts)]
    const arr2: any[] = [...new Set(item.posts)]
    const arr3: any[] = [...new Set(item.wcs)]
    switch (this.view) {
      case '0':
        name = arr0.join('、') // 人员
        break
      case '1':
        name = arr1.join('、') // 班次
        break
      case '2':
        name = arr2.join('、') // 岗位
        break
      case '3':
        name = arr3.join('、') // 操作中心
        break
      default:
        break
    }
    return name
  }
  private handlePaneClick(page: any) {
    const date = page.year + '-' + page.month
    this.monthTime = dayjs(date).format('YYYY-MM')
    this.dayTime = ''
    this.weekDay = ''
  }

  private handleDayClick(date: any) {
    this.dayTime = dayjs(date).format('YYYY-MM-DD')
    this.weekDay = dayjs(date).day() + 1
  }

  private mounted() {
    // zzz
  }
  private created(): void {
    // zzz
  }
}
</script>

<style lang="scss" scoped>
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
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
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
    width: 126px;
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
