<template>
  <div
    class="delivery-form"
    style="display: flex;flex-flow: row nowrap;min-height: inherit;"
  >
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        v-show="!detailShow"
        class="app-container"
      >
        <head-info
          info=""
          title="快递换单"
        />
        <div class="app-panel">
          <!--<el-tabs
            v-model="activeName"
            @change="activeNameChange"
          >
            <el-tab-pane
              label="换单"
              name="1"
            >
              <el-input
                ref="searchInput"
                v-model="code"
                placeholder="请输入快递单号查询"
                style="width: 280px;margin-right: 10px"
                size="small"
                @keyup.enter.native="searchData"
              />
              <el-button
                type="primary"
                :loading="searching"
                size="small"
                @click="searchData"
              >
                查询
              </el-button>
            </el-tab-pane>
            <el-tab-pane
              label="换单记录"
              name="2"
            >
              <el-row>
                <el-col
                  :span="24"
                  style="text-align: right"
                >
                  <el-select
                    v-model="searchForm.isPrint"
                    placeholder="是否打印"
                    size="small"
                    clearable
                    style="width: 100px;"
                  >
                    <el-option
                      label="是"
                      value="1"
                    />
                    <el-option
                      label="否"
                      value="0"
                    />
                  </el-select>
                  <el-input
                    v-model="searchForm.code"
                    placeholder="请输入内容"
                    class="input-with-select"
                    style="width:240px;margin:0 10px;"
                    size="small"
                    clearable
                  >
                    <el-select
                      slot="prepend"
                      v-model="searchForm.selectType"
                      size="small"
                      style="width:100px;"
                      placeholder="请选择"
                    >
                      <el-option
                        label="原单号"
                        value="0"
                      />
                      <el-option
                        label="箱号"
                        value="1"
                      />
                      <el-option
                        label="快递单号"
                        value="2"
                      />
                    </el-select>
                  </el-input>
                  <el-button
                    type="primary"
                    size="small"
                    @click="getTableList"
                  >
                    查询
                  </el-button>
                </el-col>
              </el-row>
              <el-table
                v-loading="loading"
                :data="tableData"
                height="calc(100vh - 360px)"
                style="width: 100%;margin: 10px 0;"
                border
              >
                <el-table-column
                  prop="orderNo"
                  label="原单号"
                />
                <el-table-column
                  prop="total"
                  label="总件数"
                />
                <el-table-column
                  prop="print"
                  label="已打印"
                />
                <el-table-column
                  prop="unprint"
                  label="未打印"
                />
                <el-table-column
                  label="操作"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="small"
                      @click="showDetails(scope.row)"
                    >
                      查看
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                :current-page.sync="pagination.page"
                :page-size="pagination.size"
                layout="total, prev, pager, next"
                :total="pagination.total"
                style="text-align: right;"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </el-tab-pane>
          </el-tabs>-->
          <el-input
            ref="searchInput"
            v-model="code"
            placeholder="请输入快递单号查询"
            style="width: 280px;margin-right: 10px"
            size="small"
            @keyup.enter.native="searchData"
          />
          <el-button
            type="primary"
            :loading="searching"
            size="small"
            @click="searchData"
          >
            查询
          </el-button>
        </div>
      </div>
      <div
        v-show="detailShow"
        class="app-container"
      >
        <detail
          ref="detailForm"
          :detail-data="detailData"
          @back="detailShow = false"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import detail from './detail.vue'
import { getChangeOrder, getChangeOrderList, getChangeOrderDetails } from '@/api/warehose-by-config'
@Component({
  name: 'delivery',
  components: {
    detail
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private code: any = ''
  private activeName: string = '1'
  private loading: boolean = false
  private searching: boolean = false
  private detailShow: boolean = false
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  private searchForm: any = {
    isPrint: '',
    code: '',
    selectType: '1'
  }
  private tableData: any[] = []
  private detailData: any[] = []
  @Watch('activeName')
  private activeNameChange(val: any) {
    if (val === '2') {
      this.getTableList()
    }
  }
  /* methods */
  private showDetails(row: any) {
    // show   expressOrderId
    const params = {
      id: row.expressOrderId
    }
    this.loading = true
    getChangeOrderDetails(params).then((res: any) => {
      this.loading = false
      this.detailData = (res.data || []).map((e: any) => {
        return {
          ...e,
          orderNo: row.orderNo
        }
      })
      this.detailShow = true
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }
  // 分页
  private handleSizeChange(val: string) {
    this.pagination.size = Number(val)
    this.getTableList()
  }

  private handleCurrentChange(val: string) {
    this.pagination.page = Number(val)
    this.getTableList()
  }
  private getTableList() {
    const params = {
      data: {
        ifPrint: this.searchForm.isPrint,
        index: this.searchForm.selectType,
        words: this.searchForm.code
      },
      current: this.pagination.page,
      size: this.pagination.size
    }
    this.loading = true
    getChangeOrderList(params).then((res: any) => {
      this.loading = false
      const data = res.data || {}
      this.tableData = data.records || []
      this.pagination.total = data.total
    }).catch((err: any) => {
      this.tableData = []
      this.pagination.total = 0
      this.loading = false
      return err
    })
  }
  private searchData() {
    // 点击查询
    if (!this.code) {
      this.$message.warning('请输入快递单号查询')
      return
    }
    this.searching = true
    getChangeOrder({ trackingNo: this.code }).then((res:any) => {
      this.searching = false
      this.code = ''
      res.text().then((text: any) => {
        const resData = JSON.parse(text)
        if (resData.code !== 200 && resData.msg === '2') {
          // 旧系统存在
          this.play('right')
          this.$message.success('right')
        } else if (resData.code !== 200 && resData.msg === '4') {
          // 不需要换单
          this.play('no change')
          this.$message.success('no change')
        } else {
          this.play('not found')
          this.$message.warning('not found')
        }
      }).catch(() => {
        const url = window.URL.createObjectURL(res)
        window.open(url, '_blank')
        window.URL.revokeObjectURL(url)
      })
    }).catch((err: any) => {
      this.code = ''
      this.searching = false
      this.$message.error('系统错误')
      return err
    })
  }
  private play(text: any) {
    const msg = new SpeechSynthesisUtterance(text)
    msg.volume = 1
    window.speechSynthesis.speak(msg)
  }
  private searchInputFocus() {
    this.$nextTick(() => {
      const searchInput: any = this.$refs.searchInput
      searchInput && searchInput.focus()
    })
  }
  private mounted() {
    this.searchInputFocus()
    document.addEventListener('click', this.searchInputFocus)
    this.$once('hook:beforeDestroy', () => {
      document.removeEventListener('click', this.searchInputFocus)
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
