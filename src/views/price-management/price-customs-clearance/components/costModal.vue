<template>
  <el-dialog
    :title="'关联成本项目' + '【' + title +'】'"
    :visible.sync="visible"
    :close-on-click-modal="false"
    width="960px"
    @close="cancelCostItem"
  >
    <div v-loading="costLoading">
      <el-transfer
        ref="transferItem"
        v-model="costItemOption"
        filterable
        :filter-method="filterMethod"
        :titles="['成本项目', '已选择']"
        :props="{key: 'id', label: 'name'}"
        filter-placeholder="输入搜索"
        :data="costItemList"
        style="height: 500px;"
      />
      <div
        slot="footer"
        style="text-align: right;margin: 20px 40px 0;"
      >
        <el-button
          size="small"
          @click="cancelCostItem"
        >
          取 消
        </el-button>

        <el-button
          type="primary"
          size="small"
          @click="saveCostItem"
        >
          确 定
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getCostitemList,
  getServicepProjectList,
  saveCostItem
} from '@/api/service-with-customs-clearance'

@Component({
  name: 'CostModal'
})
export default class CostModal extends Vue {
  private title: string = ''
  private visible: boolean = false
  private costLoading: boolean = false
  private costItemOption: any[] = []
  private costItemList: any[] = []
  private serviceData: any = {}

  private show(data: any) {
    this.serviceData = data
    this.costItemOption = []
    this.costItemList = []
    this.title = data.countryName + '-' + data.subtypeName + '-' + data.csId
    this.costLoading = true
    this.visible = true
    const params: any = {
      serviceTypeId: '03',
      typeId: data.subtypeId,
      page: 1,
      size: 99999
    }
    Promise.all([this.getServerProjectList(data.id), this.getCostitemList(params)]).then(r => {
      this.costLoading = false
    }).catch(err => {
      this.costLoading = false
      return err
    })
  }
  private getCostitemList(params: any) {
    return getCostitemList(params)
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result || []
        this.costItemList = result
      })
      .catch((err: any) => {
        return err
      })
  }
  private getServerProjectList(id: string) {
    const params = {
      id
    }
    return getServicepProjectList(params)
      .then((res: any) => {
        const data = res.data || []
        this.costItemOption = data.map((item: any) => item.id) || []
      })
      .catch((err: any) => {
        return err
      })
  }
  private cancelCostItem() {
    this.visible = false
    this.$emit('close', this.serviceData.id, 'select')
  }
  private filterMethod(query: any, item: any): boolean {
    const name = item.name || ''
    return name.indexOf(query) > -1
  }
  private saveCostItem() {
    this.costLoading = true
    const costItemArr = this.costItemOption
    const cscCostitems = this.costItemList
      .filter(item => costItemArr.includes(item.id))
      .map(c => ({ id: c.id, name: c.name }))
    const params = {
      cscId: this.serviceData.id,
      cscCostitems
    }
    saveCostItem(params)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '更新成功'
        })
        this.cancelCostItem()
        this.costLoading = false
      })
      .catch(err => {
        this.costLoading = false
        return err
      })
  }
}
</script>

<style scoped>
</style>
