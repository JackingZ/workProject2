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
        :data="list"
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
import { getCustTypeList } from '@/api/price-to-trailer'
import { getAddressList } from '@/api/service-with-trailers-service'

@Component({
  name: '',
  components: {},
  props: {
    selectCard: {
      type: Object,
      default: () => ({})
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
      default: true
    }
  }
})
export default class extends Vue {
  private loading: boolean = false
  private visible: boolean = false
  private list: any[] = []
  private relevanceList: any[] = []
  private modalTitle: string = ''
  private modalType: string = ''
  private selectService: any = {}

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
  private getCustTypeList(data: any) {
    const params = {
      toCustSubtype: data.toCustSubtype,
      toCustType: data.toCustType,
      subtypeId: this.selectService.subtypeId || '',
      typeId: '06'
    }
    this.loading = true
    getCustTypeList(params).then((res: any) => {
      const result = res.data || []
      this.list = result.filter((e: any) => e)
      if (!(this as any).isEdit && (this as any).isView) {
        this.list = this.list.map((item: any) => {
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
  // 目的地
  private getAddressList() {
    const params = {
      model: {
        tscId: this.selectService.id
      },
      page: 1,
      size: 9999
    }
    this.loading = true
    getAddressList(params).then((res: any) => {
      const data = res.data || {}
      const result = data.result || []
      this.list = result.map((item: any) => {
        item.name = `${item.country} ${item.province} ${item.city} ${item.area}`
        return item
      })
      this.loading = false
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }
  // 显示弹窗
  private showModel(type: string, selectService: any, selectList: any[], title?: string, params?: any) {
    this.relevanceList = selectList
    this.visible = true
    this.selectService = selectService
    this.modalType = type
    if (type === 'a') {
      this.modalTitle = title || ''
      this.getCustTypeList(params)
    }
    if (type === 'y') {
      this.modalTitle = '关联目的地'
      this.getAddressList()
    }
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
    this.$emit('save', this.modalType, this.relevanceList, this.relevanceList.map((it: any) => this.list.find((e: any) => e.id === it)))
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
