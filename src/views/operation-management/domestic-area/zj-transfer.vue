<template>
  <div v-loading="selectLoading">
    <div style="margin: 0 0 10px 44px;">
      <span>
        州/省：
      </span>
      <el-select
        v-model="stateId"
        :disabled="!countryId"
        placeholder="州/省"
        clearable
        filterable
        size="small"
        style="width:260px;"
        @change="onStateChange"
      >
        <el-option
          v-for="item in stateList"
          :key="item.id"
          :label="`${item.name}-${item.alias}`"
          :value="item.id"
        />
      </el-select>
    </div>
    <div
      class="el-transfer"
      style="height: 500px;"
    >
      <div class="el-transfer-panel">
        <p class="el-transfer-panel__header">
          <el-checkbox
            v-model="leftCheckAll"
            :indeterminate="leftIndeterminate"
            @change="handleLeftSelectAll"
          >
            城市<span>{{ leftSelected.length }}/{{ leftData.length }}</span>
          </el-checkbox>
        </p>
        <div class="el-transfer-panel__body">
          <el-input
            v-model="leftSearch"
            placeholder="输入搜索"
            class="el-transfer-panel__filter"
          >
            <i
              slot="prefix"
              class="el-input__icon"
              :class="leftSearch ? 'el-icon-circle-close' : 'el-icon-search' "
              @click="leftSearch = ''"
            />
          </el-input>
          <div
            v-if="leftList.length"
            class="el-transfer-panel__list is-filterable"
          >
            <el-checkbox
              v-for="(item, index) in leftList"
              :key="index"
              v-model="item.checked"
              :label="`${item.name}${item.alias ? '-' + item.alias : ''}`"
              :value="item.id"
              class="el-transfer-panel__item"
              @change="handleLeftSelected"
            />
          </div>
          <p
            v-if="leftSearch && leftList.length === 0"
            class="el-transfer-panel__empty"
          >
            无匹配数据
          </p>
          <p
            v-if="!leftSearch && leftData.length === 0"
            class="el-transfer-panel__empty"
          >
            无数据
          </p>
        </div>
      </div>
      <div class="el-transfer__buttons">
        <el-button
          type="primary"
          size="medium"
          :disabled="rightData.length === 0 || rightSelected.length === 0"
          class="el-transfer__button"
          @click="handleRightToLeft"
        >
          <i class="el-icon-arrow-left" />
        </el-button>
        <el-button
          type="primary"
          size="medium"
          :disabled="leftData.length === 0 || leftSelected.length === 0"
          class="el-transfer__button"
          @click="handleLeftToRight"
        >
          <i class="el-icon-arrow-right" />
        </el-button>
      </div>
      <div class="el-transfer-panel">
        <p class="el-transfer-panel__header">
          <el-checkbox
            v-model="rightCheckAll"
            :indeterminate="rightIndeterminate"
            @change="handleRightSelectAll"
          >
            已选择<span>{{ rightSelected.length }}/{{ rightData.length }}</span>
          </el-checkbox>
        </p>
        <div class="el-transfer-panel__body">
          <el-input
            v-model="rightSearch"
            placeholder="输入搜索"
            class="el-transfer-panel__filter"
          >
            <i
              slot="prefix"
              class="el-input__icon"
              :class="rightSearch ? 'el-icon-circle-close' : 'el-icon-search' "
              @click="rightSearch = ''"
            />
          </el-input>
          <div
            v-if="rightList.length"
            class="el-transfer-panel__list is-filterable"
          >
            <el-checkbox
              v-for="(item, index) in rightList"
              :key="index"
              v-model="item.checked"
              :label="`${item.name}${item.alias ? '-' + item.alias : ''}`"
              :value="item.id"
              class="el-transfer-panel__item"
              @change="handleRightSelected"
            />
          </div>
          <p
            v-if="rightSearch && rightList.length === 0"
            class="el-transfer-panel__empty"
          >
            无匹配数据
          </p>
          <p
            v-if="!rightSearch && rightList.length === 0"
            class="el-transfer-panel__empty"
          >
            无数据
          </p>
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
  getCityByState
} from '@/api/operation-of-domestic-area'

@Component({
  name: 'ZjTransfer',
  components: {},
  props: {}
})

export default class extends Vue {
  /** data */
  private leftCheckAll: boolean = false
  private rightCheckAll: boolean = false
  private leftIndeterminate: boolean = false
  private rightIndeterminate: boolean = false
  private leftSearch: any = ''
  private rightSearch: any = ''
  private leftData: any[] = []
  private rightData: any[] = []
  private stateList: any[] = []
  private countryId: any = ''
  private stateId: any = ''
  private selectLoading: boolean = false
  /** computed */
  get leftSelected() {
    return this.leftData.filter((it: any) => it.checked)
  }
  get rightSelected() {
    return this.rightData.filter((it: any) => it.checked)
  }
  get leftList() {
    if (this.leftSearch) {
      return this.leftData.filter((it: any) => {
        return it.name.toUpperCase().indexOf(this.leftSearch.toUpperCase()) > -1
      })
    }
    return this.leftData
  }
  get rightList() {
    if (this.rightSearch) {
      return this.rightData.filter((it: any) => {
        return it.name.toUpperCase().indexOf(this.rightSearch.toUpperCase()) > -1
      })
    }
    return this.rightData
  }
  /** method */
  private async setData(val: any, list: any[], stateList: any[]) {
    this.countryId = val
    this.reset()
    this.selectLoading = true
    list.map((it: any) => {
      this.rightData.push({
        id: it.cityId,
        name: it.cityName,
        stateId: it.stateId,
        checked: false
      })
      return it
    })
    this.stateList = stateList
    // 默认取第一个
    this.stateId = (this.stateList[0] || {}).id
    await this.getCityList()
    this.selectLoading = false
  }
  private reset() {
    this.stateList = []
    this.leftData = []
    this.rightData = []
    this.leftSearch = ''
    this.rightSearch = ''
    this.leftCheckAll = false
    this.rightCheckAll = false
    this.leftIndeterminate = false
    this.rightIndeterminate = false
  }

  private async onStateChange() {
    this.leftData = []
    this.leftSearch = ''
    this.leftCheckAll = false
    this.leftIndeterminate = false
    await this.getCityList()
  }
  private async getCityList() {
    if (!this.stateId) {
      this.selectLoading = false
      return
    }
    this.selectLoading = true
    await getCityByState(this.stateId).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      const result = data.result || []
      const arr = result.filter((it: any) => this.rightData.every((item: any) => it.id !== item.id))
      this.leftData = arr.map((it: any) => {
        it.checked = false
        return it
      })
    }).catch(() => {
      this.leftData = []
      this.selectLoading = false
    })
  }
  private handleLeftSelectAll(selection: boolean) {
    this.leftData = this.leftData.map((o: any) => {
      o.checked = selection
      return o
    })
    this.leftIndeterminate = false
  }
  private handleLeftSelected(selection: any) {
    const lenMax = this.leftData.length
    const len = this.leftData.filter((it: any) => it.checked).length
    this.leftIndeterminate = len > 0 && len < lenMax
    this.leftCheckAll = len > 0 && len === lenMax
  }
  private handleRightSelectAll(selection: any) {
    this.rightData = this.rightData.map((o: any) => {
      o.checked = selection
      return o
    })
    this.rightIndeterminate = false
  }
  private handleRightSelected(selection: any) {
    const lenMax = this.rightData.length
    const len = this.rightData.filter((it: any) => it.checked).length
    this.rightIndeterminate = len > 0 && len < lenMax
    this.rightCheckAll = len > 0 && len === lenMax
  }
  private handleLeftToRight() {
    const arr = this.leftData.filter((it: any) => it.checked)
    const json = JSON.parse(JSON.stringify(arr))
    const selectArr = json.map((it: any) => {
      it.checked = false
      return it
    })
    this.leftData = this.leftData.filter((it: any) => !it.checked)
    const arrR = JSON.parse(JSON.stringify(this.rightData))
    const plusArr: any[] = [...arrR, ...selectArr]
    const obj: any = {}
    this.rightData = plusArr.reduce((cur: any, next: any) => {
      if (!obj[next.id]) {
        obj[next.id] = true
        cur.push(next)
      }
      return cur
    }, [])
    this.leftIndeterminate = false
    this.leftCheckAll = false
  }
  private handleRightToLeft() {
    const arr = this.rightData.filter((it: any) => it.checked)
    const json = JSON.parse(JSON.stringify(arr))
    const selectArr = json.map((it: any) => {
      it.checked = false
      return it
    })
    selectArr.map((item: any) => {
      if (this.stateId === item.stateId && this.leftData.every((l: any) => item.id !== l.id)) {
        this.leftData.push(item)
      }
    })
    this.rightData = this.rightData.filter((it: any) => !it.checked)
    this.rightIndeterminate = false
    this.rightCheckAll = false
  }
}
</script>

<style lang="scss" scoped>
.el-transfer-panel {
  width: 40%;
  height: 100%;
}
.el-transfer {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}
.el-transfer-panel__list.is-filterable {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
}
.el-transfer-panel__body {
  height: 78%;
}
</style>
