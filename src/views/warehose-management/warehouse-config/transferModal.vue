<template>
  <el-dialog
    title="设置服务"
    :visible="visible"
    :close-on-click-modal="false"
    width="960px"
    @close="dialogClose"
  >
    <div v-loading="loading">
      <el-transfer
        ref="transferItem"
        v-model="relevanceList"
        filterable
        :filter-method="filterMethod"
        :titles="['全部', '已选择']"
        :props="{key: 'id', label: 'name'}"
        filter-placeholder="输入搜索"
        :data="list"
        style="height: 500px;"
        class="transfer-agent"
      />
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
import {
  getSubtypeByCustAndType,
  getWarehouseServer,
  saveWarehouseServer
} from '@/api/service-with-warehouse-service'

@Component({
  name: '',
  components: {}
})
export default class extends Vue {
  private loading: boolean = false
  private visible: boolean = false
  private list: any[] = []
  private relevanceList: any[] = []
  private row: any = {}

  // methods
  // 显示弹窗
  private async showModel(row: any) {
    this.visible = true
    this.row = row
    this.loading = true
    await this.getSubtypeByCustAndType()
    await this.getWarehouseServer()
    this.loading = false
  }
  private async getSubtypeByCustAndType() {
    const params = {
      custId: this.row.custId,
      typeId: '04'
    }
    await getSubtypeByCustAndType(params).then((res: any) => {
      if (res.success) {
        this.list = res.data || []
      }
    }).catch((err: any) => {
      return err
    })
  }
  private async getWarehouseServer() {
    const params = {
      id: this.row.id
    }
    await getWarehouseServer(params).then((res: any) => {
      if (res.success) {
        this.relevanceList = res.data || []
      }
    }).catch((err: any) => {
      return err
    })
  }
  // 取消
  private cancel() {
    this.dialogClose()
  }
  // 点击弹窗关闭
  private dialogClose() {
    this.relevanceList = []
    this.visible = false
  }

  // 保存
  private save() {
    if (this.relevanceList.length === 0) {
      this.$message.warning('请选择关联的数据')
      return
    }
    const params = {
      id: this.row.id,
      typeList: this.relevanceList
    }
    this.loading = true
    saveWarehouseServer(params).then((res: any) => {
      this.loading = false
      if (res.success) {
        this.$message.success('保存成功')
        this.dialogClose()
      }
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }
  private filterMethod(query: any, item: any): boolean {
    const name = item.name || ''
    return name.indexOf(query) > -1
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
  ::v-deep .transfer-agent .el-input__inner {
    padding-left: 30px !important;
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
</style>
