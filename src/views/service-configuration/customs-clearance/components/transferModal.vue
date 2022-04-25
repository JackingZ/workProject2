<template>
  <el-dialog
    :title="'关联海关' + '【' + title +'】'"
    :visible="visible"
    width="960px"
    :close-on-click-modal="false"
    @close="dialogClose"
  >
    <div v-loading="loading">
      <el-transfer
        ref="transferItem"
        v-model="selectCabinet"
        filterable
        :filter-method="filterMethod"
        :titles="['全部海关', '已关联海关']"
        :props="{key: 'id', label: 'name'}"
        filter-placeholder="输入搜索"
        :data="cabinetList"
        style="height: 500px;"
      />
      <div
        slot="footer"
        style="text-align: right;margin: 20px 40px 0;"
      >
        <el-button
          size="small"
          @click="dialogClose"
        >
          取 消
        </el-button>

        <el-button
          size="small"
          type="primary"
          @click="saveCabinet"
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
  getCabinetList,
  getServiceCabinetList,
  saveCabinetList
} from '@/api/service-with-customs-clearance'

@Component({
  name: '',
  components: {},
  props: {}
})

export default class extends Vue {
  /* data */
  private visible: boolean = false
  private loading: boolean = false
  private setCabinetData: any = {}
  private title: string = ''
  private selectCabinet: any[] = []
  private selectCabinetList: any[] = []
  private cabinetList: any[] = []

  /* methods */
  private saveCabinet() {
    const params: any = {
      delList: [],
      insList: []
    }
    if (this.selectCabinetList.length === 0) {
      this.cabinetList.forEach((item: any) => {
        if (this.selectCabinet.indexOf(item.id) !== -1) {
          params.insList.push({
            customsId: item.id,
            customsName: item.name,
            cscId: this.setCabinetData.id
          })
        }
      })
    } else {
      const selectCabinetList = this.selectCabinetList.map((item: any) => item.customsId)
      // 遍历原来的，在修改之后的中查找，修改后中没有原来的就是删除
      selectCabinetList.forEach((e: any, i: any) => {
        if (this.selectCabinet.indexOf(e) === -1) {
          // 删除的
          params.delList.push(this.selectCabinetList[i])
        }
      })
      // 遍历修改后的，在原来里没有的就是添加
      this.selectCabinet.forEach((e: any, i: any) => {
        if (selectCabinetList.indexOf(e) === -1) {
          // 添加的
          const cabinet = this.cabinetList.find((item: any) => item.id === e)
          params.insList.push({
            customsId: cabinet.id,
            customsName: cabinet.name,
            cscId: this.setCabinetData.id
          })
        }
      })
    }
    this.loading = true
    saveCabinetList(params).then((res: any) => {
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

  private dialogClose() {
    this.selectCabinet = []
    this.selectCabinetList = []
    this.visible = false
    this.$emit('close')
  }

  private async show(row: any, title: string) {
    this.visible = true
    this.setCabinetData = row
    this.title = title
    this.loading = true
    await this.getCabinetList()
    await this.getServiceCabinetList()
    this.loading = false
  }

  private async getServiceCabinetList() {
    const params: any = {
      model: this.setCabinetData.id,
      page: 1,
      size: 99999
    }
    await getServiceCabinetList(params).then((res: any) => {
      if (res.success) {
        const data = res.data || {}
        this.selectCabinetList = data.result || []
        this.selectCabinet = this.selectCabinetList.map((item: any) => item.customsId)
      }
    }).catch((err: any) => {
      return err
    })
  }

  private async getCabinetList() {
    const params: any = {
      type: 0,
      countryId: this.setCabinetData.countryId,
      page: 1,
      size: 99999
    }
    await getCabinetList(params).then((res: any) => {
      if (res.success) {
        const data = res.data || {}
        this.cabinetList = data.result || []
      }
    }).catch((err: any) => {
      return err
    })
  }
}
</script>
<style lang="scss" scoped>
</style>
