<template>
  <el-dialog
    title="选择目的地"
    :visible="visible"
    width="960px"
    @close="dialogClose"
  >
    <div v-loading="loading">
      <el-form
        ref="detail"
        :model="form"
        label-width="70px"
        size="small"
      >
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="地址类型"
            >
              <el-select
                v-model="form.addressType"
                placeholder="请选择地址类型"
                style="width: 100%"
                @change="addressTypeChange"
              >
                <el-option
                  v-for="item in addressTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            v-if="form.addressType !== '8'"
            :span="11"
            :offset="2"
          >
            <el-form-item
              label="所在国家"
            >
              <el-select
                v-model="form.countryId"
                placeholder="请选择"
                style="width: 100%"
                filterable
                :multiple="!isArea"
                collapse-tags
                @change="handleChange"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
                  :label="`${item.name}-${item.alias}`"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div
        v-loading="loadingTransfer"
      >
        <el-transfer
          ref="transferItem"
          v-model="selectAddress"
          filterable
          :filter-method="filterMethod"
          :titles="['全部', '已选择']"
          :props="{key: 'id', label: 'fellName'}"
          filter-placeholder="输入搜索"
          :data="transferList"
          style="height: 500px;"
        />
      </div>
    </div>
    <div
      slot="footer"
      style="text-align: right;margin-top: 20px;"
    >
      <el-button
        size="small"
        @click="dialogClose"
      >
        取 消
      </el-button>
      <el-button
        type="primary"
        size="small"
        @click="confirm"
      >
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  getPurpostList,
  addPurpost,
  getPortList,
  getFbastoreList,
  getRegionList,
  getAllAreaList
} from '@/api/service-with-truck-service'

@Component({
  name: '',
  components: {},
  props: {
    countryList: {
      type: Array,
      default: () => ([])
    }
  }
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private visible: boolean = false
  private isArea: boolean = false
  private loadingTransfer: boolean = false
  private form: any = {
    addressType: undefined,
    countryId: []
  }
  private transferList: any[] = []
  private selectAddress: any[] = []
  private oldSelectAddress: any[] = []
  private addressTypeList: any[] = [
    {
      label: '机场',
      value: '0'
    },
    {
      label: '港口',
      value: '1'
    },
    {
      label: '火车站',
      value: '2'
    },
    {
      label: '海外仓',
      value: '3'
    },
    {
      label: '国内区域',
      value: '5'
    },
    {
      label: '城市区域',
      value: '6'
    },
    {
      label: '仓库区域',
      value: '7'
    },
    {
      label: '国家区域',
      value: '8'
    }
  ]
  private kscId: string = ''
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
  private setData(row: any) {
    this.reset()
    const { endAddressType } = row
    this.visible = true
    this.kscId = row.id
    this.form.addressType = endAddressType + ''
    if (this.form.addressType === '0' || this.form.addressType === '1' || this.form.addressType === '2' || this.form.addressType === '3') {
      this.isArea = false
    } else {
      this.isArea = true
    }
    this.getAddressList()
  }
  private confirm() {
    const params: any = {
      delList: [],
      insList: [],
      kscId: this.kscId,
      type: this.form.addressType
    }
    const list = this.oldSelectAddress.map((e: any) => e.destinationId)
    const oldCountry = (this.oldSelectAddress[0] || {}).countryId
    // 遍历原来的，在修改之后的中查找，修改后中没有原来的就是删除
    list.forEach((e: any, i: any) => {
      if (this.selectAddress.indexOf(e) === -1) {
        // 删除的
        params.delList.push(this.oldSelectAddress[i])
      }
    })
    // 遍历修改后的，在原来里没有的就是添加
    this.selectAddress.forEach((e: any, i: any) => {
      if (list.indexOf(e) === -1) {
        // 添加的
        const tamp = this.transferList.find((item: any) => item.id === e)
        if (tamp) {
          params.insList.push({
            addressType: this.form.addressType,
            countryId: tamp.countryId,
            countryName: tamp.countryName,
            destinationId: tamp.id,
            destinationName: tamp.fellName,
            kscId: this.kscId
          })
        }
      }
    })
    if (this.isArea && oldCountry) {
      if (oldCountry !== this.form.countryId) {
        params.delList = [...params.delList, ...this.oldSelectAddress].reduce((delList: any[], item: any) => {
          if (!delList.find((e: any) => e.destinationId === item.destinationId)) {
            delList.push(item)
          }
          return delList
        }, [])
      }
    }
    this.loading = true
    addPurpost(params).then((res: any) => {
      this.loading = false
      if (res.success) {
        this.$message.success('添加成功')
        this.dialogClose()
      }
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }
  private dialogClose() {
    this.visible = false
    this.$emit('load')
  }
  private reset() {
    this.form = {
      addressType: undefined,
      countryId: []
    }
    this.selectAddress = []
    this.transferList = []
  }
  private getAddressList() {
    const params = {
      model: {
        addressType: this.form.addressType,
        kscId: this.kscId
      },
      page: 1,
      size: 9999
    }
    this.loading = true
    getPurpostList(params).then((res: any) => {
      this.loading = false
      if (res.success) {
        const data = res.data || {}
        const result = data.result || []
        this.oldSelectAddress = result
        this.selectAddress = result.map((item: any) => item.destinationId)
        if (!this.isArea) {
          this.form.countryId = result.reduce((list: any[], next: any) => {
            if (next.countryId && list.indexOf(next.countryId) === -1) {
              list.push(next.countryId)
            }
            return list
          }, [])
        } else {
          this.form.countryId = (result[0] || {}).countryId
        }
        this.handleChange()
      }
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }
  private addressTypeChange() {
    if (this.form.addressType === '0' || this.form.addressType === '1' || this.form.addressType === '2' || this.form.addressType === '3') {
      this.isArea = false
    } else {
      this.isArea = true
    }
    this.getAddressList()
  }
  private handleChange() {
    switch (this.form.addressType) {
      case '3':
        this.getFbastoreList()
        break
      case '5':
        this.getRegionList()
        break
      case '6':
        this.getAreaList(1)
        break
      case '7':
        this.getAreaList(3)
        break
      case '8':
        this.getAreaList(2)
        break
      default:
        this.getPortList()
    }
  }
  private getAreaList(type: number) {
    this.transferList = []
    if (!this.form.countryId && type !== 2) return
    const params = {
      model: {
        type,
        countryId: type === 2 ? '' : this.form.countryId
      },
      page: 1,
      size: 999
    }
    this.loadingTransfer = true
    getAllAreaList(params).then((res: any) => {
      this.loadingTransfer = false
      if (res.success) {
        const data = res.data || {}
        const result = data.result || []
        this.transferList = result.map((item: any) => {
          return {
            id: item.id + '',
            name: item.name,
            fellName: item.name,
            countryId: item.countryId,
            countryName: item.countryName
          }
        })
      }
    }).catch((err: any) => {
      this.loadingTransfer = false
      return err
    })
  }
  private getRegionList() {
    this.transferList = []
    if (!this.form.countryId) return
    this.loadingTransfer = true
    const params: any = {
      countryId: this.form.countryId,
      page: 1,
      size: 9999
    }
    getRegionList(params)
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result || []
        this.transferList = result.map((item: any) => {
          return {
            id: item.id,
            name: item.name,
            fellName: item.name,
            countryId: item.countryId,
            countryName: item.countryName
          }
        })
        this.loadingTransfer = false
      })
      .catch((err: any) => {
        this.loadingTransfer = false
        return err
      })
  }
  private filterMethod(query: any, item: any): boolean {
    const name = item.fellName || ''
    return name.indexOf(query) > -1
  }
  private getPortList() {
    const params = {
      countryId: this.form.countryId.join(','),
      type: this.form.addressType,
      page: 1,
      size: 999
    }
    this.loadingTransfer = true
    getPortList(params).then((res: any) => {
      this.loadingTransfer = false
      if (res.success) {
        const data = res.data || {}
        const result = data.result || []
        this.transferList = result.map((e: any) => {
          e.fellName = e.code + '-' + e.name + '-' + e.alias
          return e
        })
      }
    }).catch((err: any) => {
      this.loadingTransfer = false
      return err
    })
  }
  private getFbastoreList() {
    const params = {
      codeSort: 'A',
      countryId: this.form.countryId.join(','),
      // type: this.form.addressType,
      status: '1',
      page: 1,
      size: 999
    }
    this.loadingTransfer = true
    getFbastoreList(params).then((res: any) => {
      this.loadingTransfer = false
      if (res.success) {
        const data = res.data || {}
        const result = data.result || []
        this.transferList = result.map((e: any) => {
          e.fellName = e.code + (e.postal ? '-' + e.postal : '') + (e.stateName ? '-' + e.stateName : '')
          return e
        })
      }
    }).catch((err: any) => {
      this.loadingTransfer = false
      return err
    })
  }
}
</script>

<style lang="scss" scoped>
  .input-number-valiate{
    width: 100%;
    ::v-deep .el-input__inner{
      text-align: left;
    }
  }

  ::v-deep .el-transfer-panel{
    width: 40%;
    height: 100%;
  }

  ::v-deep .el-transfer{
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
  }

  ::v-deep .el-transfer-panel__list.is-filterable{
    display: flex;
    flex-flow: column nowrap;
    height: 100%;
  }

  ::v-deep .el-transfer-panel__body{
    height: 78%;
  }
</style>
