<template>
  <el-dialog
    :title="'设置车型' + '-' + relevanceRow.name"
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
        :titles="['全部车型', '已选择车型']"
        :props="{key: 'id', label: 'name'}"
        filter-placeholder="输入搜索"
        :data="carModelList"
        style="height: 500px;"
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
import { getVehicleTypeList, saveRange, viewRange } from '@/api/service-with-truck-service'

@Component({
  name: '',
  components: {},
  props: {
  }
})
export default class extends Vue {
  private loading: boolean = false
  private visible: boolean = false
  private isEdit: boolean = false
  private relevanceRow: any = {}
  private carModelList: any[] = []
  private relevanceList: any[] = []

  // computed
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

  // methods
  // 获取车型
  private async getVehicleTypeList() {
    const params = {
      page: 1,
      size: 9999
    }
    await getVehicleTypeList(params).then((res: any) => {
      if (res.success) {
        const data = res.data || {}
        this.carModelList = data.result || []
      }
    }).catch((err: any) => {
      return err
    })
  }
  private async viewRange() {
    const params = {
      id: this.relevanceRow.id,
      priceType: this.relevanceRow.priceType
    }
    await viewRange(params).then((res: any) => {
      if (res.success) {
        const data = res.data || {}
        if (data.rangeList && data.rangeList.length) {
          this.relevanceList = data.rangeList.map((item: any) => item.code)
          this.isEdit = true
        } else {
          this.isEdit = false
        }
      }
    }).catch((err: any) => {
      this.isEdit = false
      return err
    })
  }
  // 显示弹窗
  private async showModel(row: any) {
    this.relevanceRow = row
    this.loading = true
    this.visible = true
    await this.getVehicleTypeList()
    await this.viewRange()
    this.loading = false
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
    // 保存
    if (this.relevanceList.length === 0) {
      this.$message.warning('请选择车型')
      return
    }
    const params = {
      ifEdit: this.isEdit,
      kscId: this.relevanceRow.id,
      priceType: this.relevanceRow.priceType,
      rangeList: this.relevanceList.map((item: any) => {
        const data = this.carModelList.find((e: any) => e.id === item)
        return {
          code: data.id,
          name: data.name
        }
      })
    }
    this.loading = false
    saveRange(params).then((res: any) => {
      this.loading = false
      if (res.success) {
        this.$message.success('操作成功')
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
