<template>
  <el-dialog
    :title="modalTitle"
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
        :data="agentList"
        style="height: 500px;"
        class="transfer-agent"
      />
      <div
        v-if="((isAddForm && !isEdit && !isView) || (selectCard.id && selectCard.auditing === 4)) && edition"
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
import { getCustTypeList } from '@/api/price-to-car'

@Component({
  name: '',
  components: {},
  props: {
    selectCard: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isAddForm: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isView: {
      type: Boolean,
      default: false
    },
    edition: {
      type: Boolean,
      default: false
    },
    modalTitle: {
      type: String,
      default: '关联代理商'
    }
  }
})
export default class extends Vue {
  private loading: boolean = false
  private visible: boolean = false
  private agentList: any[] = []
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
  // 代理商
  private getCustTypeList(params?: any) {
    this.loading = true
    getCustTypeList(params).then((res: any) => {
      const data = res.data || []
      this.agentList = data.filter((e: any) => e).map((item: any) => {
        item.name = item.name || item.id
        return item
      })
      if (!(this as any).isEdit && (this as any).isView) {
        this.agentList = this.agentList.map((item: any) => {
          item.disabled = false
          if (this.relevanceList.indexOf(item.id) !== -1) {
            item.disabled = true
          }
          return item
        })
      }
      this.loading = false
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }
  // 显示弹窗
  private showModel(data: any, offerObject: any, selectCard: any) {
    this.relevanceList = []
    this.agentList = []
    if (data.associatedAgents && data.associatedAgents.length) {
      this.relevanceList = data.associatedAgents
    }
    this.visible = true
    const params = {
      toCustSubtype: offerObject.toCustSubtype,
      toCustType: offerObject.toCustType,
      subtypeId: data.subtypeId || '',
      typeId: '01'
    }
    this.getCustTypeList(params)
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
      this.$message.warning('请选择关联的代理商/客户')
      return
    }
    this.$emit('save', this.relevanceList)
    this.dialogClose()
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
