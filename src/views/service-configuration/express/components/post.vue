<template>
  <div>
    <el-row
      type="flex"
      justify="space-between"
    >
      <el-col :span="6">
        <el-button
          type="text"
          icon="el-icon-circle-plus-outline"
          style="margin-left: 10px"
          @click="addServerCode"
        >
          新增邮编范围
        </el-button>
        <el-button
          v-if="false"
          type="text"
          icon="el-icon-document-copy"
          style="margin-left: 10px"
          @click="copyCode"
        >
          一键复制
        </el-button>
      </el-col>
      <el-col :span="6">
        <el-select
          v-if="type === 'end'"
          v-model="desCode"
          size="small"
          filterable
          style="width:200px;"
          @change="queryAll(1)"
        >
          <el-option
            v-for="(ele,index) in codeOptions"
            :key="index"
            :label="ele.code"
            :value="ele.code"
          />
        </el-select>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="tableData"
      height="calc(100vh - 430px)"
      style="width: 100%;margin: 10px 0;"
      border
    >
      <el-table-column
        v-if="type==='end'"
        min-width="160"
        prop="zonedId"
        label="目的地代码"
      />
      <el-table-column
        min-width="160"
        prop="postalS"
        label="开始邮编编码"
      />
      <el-table-column
        prop="postalE"
        min-width="160"
        label="结束邮编编码"
      />
      <el-table-column
        label="操作"
        width="160"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="editForm(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            @click="deletData(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="page"
      :page-size="size"
      layout="total, prev, pager, next"
      :total="total"
      style="text-align: right;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getStartPostList,
  deleteStartPost,
  getEndPostList,
  deleteEndPost,
  getExpressEndLocationList,
  getExpressStartLocationList
} from '@/api/service-with-express-service'

@Component({
  name: 'Post',
  components: {},
  props: {
    targetId: {
      type: String,
      default: null
    },
    escId: {
      type: [String, Number],
      default: null
    },
    type: {
      type: String,
      default: null// start end
    },
    isCopyVisible: {
      type: Boolean,
      default: false
    }
  }
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private isAddEditVisible: boolean = false
  private dialogLoading: boolean = false
  private isCopyVisible: boolean = false

  private tableData: any = []
  private page: number = 1
  private size: number = 10
  private total: any = 0
  private codeOptions:any = []

  private desCode:string = ''

  /* methods */
  private queryAll(val?: any) {
    this.loading = true
    let params:any = null
    let dofunc:any = null
    if (val) {
      this.page = val
    }
    if ((this as any).type === 'start') {
      dofunc = getStartPostList
      params = {
        zonesId: (this as any).targetId,
        page: this.page,
        size: this.size
      }
    } else {
      dofunc = getEndPostList
      params = {
        zonesId: (this as any).targetId,
        page: this.page,
        size: this.size,
        zonedId: this.desCode
      }
    }
    if ((this as any).type === 'start') {
      dofunc = getStartPostList
    } else {
      dofunc = getEndPostList
    }

    dofunc(params)
      .then((res: any) => {
        this.loading = false
        if ((this as any).type === 'start') {
          this.tableData = res.data.result
          this.total = res.data.total
        } else {
          this.tableData = res.data.result
          this.total = res.data.total
        }
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private deletData(row: any) {
    const params = {
      id: row.id
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        let dofunc:any = null
        if ((this as any).type === 'start') {
          dofunc = deleteStartPost
        } else {
          dofunc = deleteEndPost
        }

        dofunc(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.queryAll()
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }
  // 新增
  private addServerCode(): void {
    let data = null
    if ((this as any).type === 'start') {
      data = {
        zonesId: (this as any).targetId,
        id: null, // 邮编id
        postalE: '', // 结束邮编
        postalS: '' // 起始邮编
      }
    } else {
      data = {
        zonesId: (this as any).targetId,
        id: null, // 邮编id
        postalE: '', // 结束邮编
        postalS: '', // 起始邮编
        zonedId: ''
      }
    }
    this.$emit('statChange', true, data, false)
    this.isAddEditVisible = true
  }
  private cancel() {
    this.isAddEditVisible = false
  }
  // 编辑
  private editForm(row: any): void {
    let data = null
    if ((this as any).type === 'start') {
      data = Object.assign({ zonesId: (this as any).targetId }, row)
    } else {
      data = Object.assign({ zonedId: (this as any).targetId }, row)
    }
    this.$emit('statChange', true, data, true)
  }

  // 关闭dialog重置表单
  private close(): void {
    this.isAddEditVisible = false
  }
  // 复制邮编范围
  private copyCode() {
    this.$emit('handleCopy', this.desCode)
  }
  //  初始化
  private init() {
    if ((this as any).type === 'start') {
      this.queryAll()
    } else {
      this.queryAllDes()
    }
  }
  private created(): void {
    // this.init()
  }

  private handleSizeChange(size: number) {
    this.size = size
    this.queryAll()
  }
  private handleCurrentChange(page:number):void {
    this.page = page
    this.queryAll()
  }

  // 查询目的地
  private queryAllDes(): void {
    this.loading = true
    const params:any = {
      // orgId,
      // countryId,
      escId: (this as any).escId,
      page: 1,
      size: 1000
    }
    let doFunc = null
    doFunc = getExpressEndLocationList
    doFunc(params)
      .then((res: any) => {
        this.codeOptions = res.data.result
        if (res.data.result.length) {
          this.desCode = res.data.result[0].code
        }
        this.queryAll()
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  // watch
  // @Watch('type')
  // private getId(newVal:string, oldVal:string) {
  //   if ((this as any).type === 'start') {
  //     this.queryAll()
  //   } else {
  //     this.queryAllDes()
  //   }
  // }
}
</script>
