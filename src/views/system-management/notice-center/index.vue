<template>
  <div class="roles-container">
    <div
      v-loading="loading"
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <el-row class="header-title">
          <el-col :span="20">
            <h3>通知中心</h3>
          </el-col>
          <el-col
            :span="4"
            style="text-align:right;padding: 6px;"
          >
            <el-button
              type="text"
              size="small"
              style="font-size: 14px;"
              @click="onRoute"
            >
              通知配置
            </el-button>
          </el-col>
        </el-row>
        <div class="app-panel">
          <el-row>
            <el-col :span="20">
              <el-radio-group
                v-model="searchForm.noticeId"
                size="small"
                @change="onNotice"
              >
                <el-radio-button
                  v-for="item in noticeList"
                  :key="item.id"
                  :label="item.id"
                >
                  {{ item.name }}
                </el-radio-button>
              </el-radio-group>
            </el-col>
            <el-col :span="4">
              <el-input
                v-model="searchForm.keyWord"
                placeholder="关键词搜索"
                size="small"
              >
                <el-button
                  slot="append"
                  size="small"
                  icon="el-icon-search"
                  @click="onSearch"
                />
              </el-input>
            </el-col>
          </el-row>
          <el-row class="notice-number">
            <el-col :span="14">
              <el-button
                v-for="item in numberList"
                :key="item.id"
                type="text"
                size="small"
                class="btn-number"
                :class="searchForm.status === item.id ? 'active-number' : ''"
                @click="onNumber(item.id)"
              >
                {{ item.name + '(' + item.account + ')' }}
              </el-button>
            </el-col>
            <el-col
              :span="10"
              style="text-align: right;"
            >
              <el-button
                type="primary"
                size="small"
                @click="onSign"
              >
                标记为已读
              </el-button>
              <el-button
                type="primary"
                size="small"
                @click="onAllSign"
              >
                全部标为已读
              </el-button>
            </el-col>
          </el-row>

          <el-table
            ref="tables"
            :data="tableData"
            row-key="id"
            height="calc(100vh - 350px)"
            style="width: 100%;margin-bottom: 10px;"
            border
            @select="handleSelected"
            @select-all="handleSelectAll"
          >
            <el-table-column
              fixed="left"
              type="selection"
              width="55"
            />
            <el-table-column
              prop="msgTitle"
              label="消息标题"
              width="150"
            >
              <template slot-scope="scope">
                <span :class="scope.row.isRead === 0 ? 'unemail-icon' : 'emailed-icon'" />
                &nbsp;
                <span>
                  {{ scope.row.msgTitle }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="msgContent"
              label="消息内容"
            >
              <template slot-scope="scope">
                <span
                  style="cursor: pointer;"
                  class="word-limit"
                  @click="onInfo(scope.row)"
                >
                  {{ scope.row.msgContent }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="receiveTime"
              label="接收时间"
              width="180"
            />
            <el-table-column
              prop="msgType"
              label="消息类型"
              width="150"
            />
            <el-table-column
              prop=""
              label=""
              width="180"
            >
              <template
                slot="header"
                slot-scope="scope"
              >
                <el-select
                  v-model="searchForm.typeId"
                  placeholder="消息子类型"
                  size="mini"
                  filterable
                  clearable
                  class="sub-notice"
                  @focus="setType"
                  @change="onType($event, scope.row)"
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </template>
              <template slot-scope="scope">
                {{ scope.row.msgSubtype }}
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            :current-page.sync="page"
            :page-size="size"
            layout="total, prev, pager, next"
            :total="total"
            style="text-align: right;padding-bottom: 10px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getInfoList,
  getNoticeList,
  updateInfo
} from '@/api/system-in-notice-config'
import { EventBus } from '@/utils/event-bus'

@Component({
  name: '',
  components: {},
  props: {}
})
export default class extends Vue {
  /** data */
  private loading: boolean = false
  private searchForm: any = {
    noticeId: 'all',
    typeId: '',
    keyWord: undefined,
    status: 'all'
  }
  private noticeOption: any[] = []
  private noticeList: any[] = []
  private numberList: any[] = [
    { name: '全部', id: 'all', account: 0 },
    { name: '未读', id: 0, account: 0 },
    { name: '已读', id: 1, account: 0 }
  ]
  private typeList: any[] = []
  private selectedData: any[] = []
  private tableData: any[] = []
  private page: number = 1
  private size: number = 10
  private total: number = 0
  /** computed */

  /** methods */
  private getDing() {
    EventBus.$on('fromNoticeUpdateDing', (val: any) => {
      this.queryAll()
    })
  }
  private setDing() {
    EventBus.$emit('toNoticeUpdateDing')
  }
  private onRoute() {
    // 跳转
    this.$router.push({ path: '/system/notice-config' })
  }
  private onSearch() {
    this.queryAll(1)
  }
  private onNotice() {
    // 消息类型
    this.selectedData = []
    this.setType()
    this.queryAll(1)
  }
  private onNumber(id: string) {
    // 全部、未读、已读
    this.searchForm.status = id
    this.selectedData = []
    this.queryAll(1)
  }
  private onSign() {
    // 标记已读
    if (this.selectedData.length <= 0) {
      this.$message.error('请勾选信息')
      return
    }
    const arr = this.selectedData.map((it: any) => it.id)
    const str = arr.join(',')
    this.updateHomePage(str)
  }
  private onAllSign() {
    // 全部已读
    this.updateHomePage()
  }
  private onInfo(row: any) {
    this.$confirm(row.msgContent, row.msgTitle, {
      confirmButtonText: '知道了',
      closeOnClickModal: false,
      showCancelButton: false,
      type: 'info'
    })
      .then(() => {
        this.updateHomePage(row.id)
      })
      .catch(() => {
        this.updateHomePage(row.id)
      })
  }
  private updateHomePage(val?: any) {
    this.loading = true
    updateInfo({
      readId: '1',
      ids: val
    })
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.loading = false
        this.selectedData = []
        this.queryAll(1)
        this.setDing()
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private setType() {
    if (this.searchForm.noticeId === 'all') {
      const arr: any[] = []
      this.noticeOption.map((it: any) => {
        (it.result || []).map((r: any) => {
          arr.push({
            name: r.name,
            id: r.unqId
          })
        })
      })
      const obj: any = {}
      this.typeList = arr.reduce((cur: any, next: any) => {
        if (!obj[next.id]) {
          obj[next.id] = true
          cur.push(next)
        }
        return cur
      }, [])
      this.typeList.unshift({ name: '全部', id: 'all' })
    } else {
      this.noticeOption.map((it: any) => {
        if (it.id === this.searchForm.noticeId) {
          this.typeList = (it.result || []).map((r: any) => {
            return {
              name: r.name,
              id: r.unqId
            }
          })
          this.typeList.unshift({ name: '全部', id: 'all' })
        }
      })
    }
  }
  private onType(el: any, row: any) {
    // 子类型表格切换
    this.selectedData = []
    this.queryAll(1)
  }

  // 勾选
  private handleSelected(selection: any, row: any) {
    const addDelete = selection.find((it: any) => it.id === row.id)
    if (addDelete) {
      this.selectedData.push(row)
    } else {
      this.selectedData = this.selectedData.filter((it: any) => it.id !== row.id)
    }
  }
  private handleSelectAll(selection: any) {
    if (selection.length) {
      // 全选中
      this.selectedData = [...this.selectedData, ...selection].reduce((list: any[], next: any) => {
        if (!list.find((e: any) => e.id === next.id)) {
          list.push(next)
        }
        return list
      }, [])
    } else {
      // 取消这页的全选
      this.selectedData = this.selectedData.filter((e: any) => !this.tableData.find((t: any) => t.id === e.id))
    }
  }
  private toggleSelection(arr: any, bool?: boolean) {
    const root: any = this.$refs.tables
    root.clearSelection()
    if (arr.length > 0) {
      arr.map((row: any) => {
        const api: any = this.$refs.tables
        api.toggleRowSelection(row, bool)
      })
    }
  }
  private queryAll(val?: any) {
    this.loading = true
    const { noticeId, keyWord, status, typeId } = this.searchForm
    if (val) {
      this.page = val
    }
    const params: any = {
      model: {
        msgTypeId: noticeId === 'all' ? undefined : noticeId,
        isRead: status === 'all' ? undefined : status,
        msgTitle: keyWord,
        msgSubtypeId: typeId === 'all' ? undefined : typeId
      },
      page: this.page,
      size: this.size
    }
    getInfoList(params)
      .then((res: any) => {
        this.loading = false
        const data = res.data || {}
        this.tableData = data.result || []
        const list = this.tableData.filter((e: any) => this.selectedData.find((s: any) => s.id === e.id))
        this.$nextTick(() => {
          this.toggleSelection(list)
        })
        this.total = data.total
        this.setNumber(data.allCount, data.noReadCount, data.isReadCount)
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private setNumber(val1: any, val2: any, val3: any) {
    this.numberList[0].account = val1 || 0
    this.numberList[1].account = val2 || 0
    this.numberList[2].account = val3 || 0
  }
  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.queryAll()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.queryAll()
  }
  private async getNoticeList() {
    this.loading = true
    try {
      const res = await getNoticeList()
      this.noticeOption = res.data || []
      this.noticeList = this.noticeOption.map((it: any) => {
        return {
          name: it.name,
          id: it.unqId
        }
      })
      this.noticeList.unshift({ name: '全部通知', id: 'all' })
    } catch (error) {
      this.loading = false
      return error
    }
  }
  private beforeDestory() {
    EventBus.$off('toNoticeUpdateDing')
  }
  private mounted() {
    this.getDing()
  }
  private async created() {
    await this.getNoticeList()
    this.setType()
    this.queryAll()
  }
}
</script>

<style lang="scss" scoped>
.header-title {
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  h3 {
    color: #909399;
    font-weight: 400;
    font-size: 16px;
  }
}
.notice-number {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #EAEEF4;
}
.btn-number {
  margin-right: 20px;
  color: #A8ACB3;
}
.active-number {
  color: #303133;
}
.sub-notice {
  width:100%;
  padding: 0px;
  ::v-deep .el-input {
    line-height: 28px;
    padding: 0px;
  }
}
.unemail-icon {
  display: inline-block;
  height: 10px;
  width: 15px;
  background: url('../../../assets/imgs/unemail.png') center center no-repeat;
  background-size: 100% 100%;
}
.emailed-icon {
  display: inline-block;
  height: 14px;
  width: 15px;
  background: url('../../../assets/imgs/emailed.png') center center no-repeat;
  background-size: 100% 100%;
}
.word-limit {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
