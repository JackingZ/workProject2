<template>
  <el-table
    :data="list"
    height="calc(100vh - 205px)"
    style="width: 100%;"
  >
    <el-table-column
      label="序号"
      width="50"
    >
      <template slot-scope="scope">
        {{ scope.row.index }}
      </template>
    </el-table-column>

    <el-table-column
      label="任务"
      min-width="230"
    >
      <template slot-scope="scope">
        {{ scope.row.taskName }}
      </template>
    </el-table-column>
    <el-table-column
      label="处理人"
      width="100"
    >
      <template slot-scope="scope">
        {{ scope.row.developer }}
      </template>
    </el-table-column>
    <el-table-column
      label="完成时间"
      width="120"
    >
      <template slot-scope="scope">
        {{ scope.row.time }}
      </template>
    </el-table-column>
    <el-table-column
      label="完成进度"
      min-width="180"
    >
      <template slot-scope="scope">
        <el-progress :percentage="scope.row.schedule" />
      </template>
    </el-table-column>
    <el-table-column
      label="状态"
      width="100"
    >
      <template slot-scope="{row}">
        <el-tag
          :type="row.status"
          effect="dark"
        >
          {{ row.status === 'success' ? '已完成' : '进行中' }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// import { getTransactions } from '@/api/transactions'
import { ITransactionData } from '@/api/types'

@Component({
  name: 'TransactionTable',
  filters: {
    transactionStatusFilter: (status: string) => {
      const statusMap: { [key: string]: string } = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter: (str: string) => str.substring(0, 30),
    // Input 10000 => Output "10,000"
    toThousandFilter: (num: number) => {
      return (+num || 0)
        .toString()
        .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
    }
  }
})
export default class extends Vue {
  private list: ITransactionData[] = [
    {
      index: 1,
      taskName: '设计后台Layout',
      time: '2019-07-21',
      developer: '马靖宇',
      status: 'success',
      schedule: 100
    },
    {
      index: 2,
      taskName: '国际化功能实现',
      time: '2019-07-22',
      developer: '马靖宇',
      status: 'success',
      schedule: 100
    },
    {
      index: 3,
      taskName: '路由和权限设计',
      time: '2019-07-25',
      developer: '马靖宇',
      status: 'success',
      schedule: 100
    },
    {
      index: 4,
      taskName: '完成左侧菜单和菜单所对应的组件',
      time: '2019-07-26',
      developer: '马靖宇',
      status: 'success',
      schedule: 100
    },
    {
      index: 5,
      taskName: '对接登录接口，处理用户信息缓存，权限校验，配置反向代理',
      time: '2019-07-26',
      developer: '马靖宇',
      status: 'success',
      schedule: 100
    }
  ]

  created() {
    // this.fetchData()
  }

  // private async fetchData() {
  //   const { data } = await getTransactions({
  //     /* Your params here */
  //   })
  //   this.list = data.items.slice(0, 8)
  // }
}
</script>
