<template>
  <el-dialog
    title="添加地址"
    :visible="visible"
    :width="modalWidth"
    :close-on-click-modal="false"
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
            v-if="form.addressType !== 0 && form.addressType !== 7"
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
          <el-col
            v-if="form.addressType === 0"
            :span="11"
            :offset="2"
            style="text-align: right"
          >
            <el-button
              type="text"
              @click="addAddress"
            >
              新增
            </el-button>
          </el-col>
        </el-row>
      </el-form>
      <div v-if="form.addressType === 0">
        <el-table
          :data="tableData"
          border
        >
          <el-table-column
            label="国家"
          >
            <template slot-scope="scope">
              <div>
                <el-select
                  v-if="scope.row.isEditRow"
                  v-model="scope.row.countryId"
                  placeholder="请选择国家"
                  size="small"
                  filterable
                  clearable
                  style="width:100%;"
                  @change="(val) => countryChange(val, scope.row)"
                >
                  <el-option
                    v-for="item in countryList"
                    :key="item.id"
                    :label="`${item.name}-${item.alias}`"
                    :value="item.id"
                  />
                </el-select>
                <span v-else>
                  {{ scope.row.country }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="城市"
          >
            <template slot-scope="scope">
              <div>
                <el-cascader
                  v-if="scope.row.isEditRow"
                  ref="areaForm"
                  v-model="scope.row.detailArea"
                  :loading="selectLoading"
                  :options="detailAreaList"
                  :props="props"
                  :disabled="!scope.row.countryId"
                  placeholder="请选择"
                  filterable
                  clearable
                  style="width:100%;"
                  @change="(val) => detailAreaChange(val, scope.row)"
                />
                <span v-else>
                  {{ scope.row.detailAreaName }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="街道"
          >
            <template slot-scope="scope">
              <div>
                <el-select
                  v-if="scope.row.isEditRow"
                  v-model="scope.row.streetIds"
                  placeholder="请选择街道/区"
                  size="small"
                  filterable
                  multiple
                  collapse-tags
                  clearable
                  :disabled="!scope.row.detailArea.length"
                  style="width:100%;"
                  @change="(val) => streetChange(val, scope.row)"
                >
                  <el-option
                    v-for="item in streetList"
                    :key="item.id"
                    :label="`${item.name}-${item.alias}`"
                    :value="item.id"
                  />
                </el-select>
                <span v-else>
                  {{ scope.row.street }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="150"
          >
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.isEditRow"
                type="text"
                @click="editAddress(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                v-else
                type="text"
                @click="saveAddress(scope.row)"
              >
                保存
              </el-button>
              <el-button
                v-if="!scope.row.isEditRow"
                type="text"
                @click="delAddress(scope.row)"
              >
                删除
              </el-button>
              <el-button
                v-else
                type="text"
                @click="cancelEditAddress(scope.row)"
              >
                取消
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page.sync="pagination.page"
          :page-size="pagination.size"
          layout="total, prev, pager, next"
          :total="pagination.total"
          style="text-align: right;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <div
        v-else
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
      v-if="form.addressType !== 0"
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
import {
  getAddressList,
  getAreasByCountry,
  saveAddress,
  getAllStreet,
  getPortList,
  getFbastoreList,
  saveAddressOther,
  getRegionList,
  getAllAreaList,
  getCounties
} from '@/api/service-with-trailers-service'

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
  private modalWidth: string = '960px'
  private visible: boolean = false
  private loading: boolean = false
  private loadingTransfer: boolean = false
  private selectLoading: boolean = false
  private isArea: boolean = false
  private tableData: any[] = []
  private detailAreaList: any[] = []
  private streetList: any[] = []
  private selectAddress: any[] = []
  private transferList: any[] = []
  private addressTypeList: any[] = [
    {
      label: '私人地址',
      value: 0
    },
    {
      label: '港口',
      value: 1
    },
    {
      label: '火车站',
      value: 2
    },
    {
      label: '海外仓',
      value: 3
    },
    {
      label: '国内区域',
      value: 4
    },
    {
      label: '城市区域',
      value: 5
    },
    {
      label: '仓库区域',
      value: 6
    },
    {
      label: '国家区域',
      value: 7
    }
  ]
  private props: any = {
    label: 'name',
    value: 'id'
  }
  private pagination: any = {
    page: 1,
    size: 10,
    total: 0
  }
  private setAddressData: any = {}
  private form: any = {
    addressType: 0,
    countryId: []
  }

  /* methods */
  private confirm() {
    // 确定
    const params: any = {
      delList: [],
      insList: [],
      tscId: this.setAddressData.id,
      type: this.form.addressType
    }
    const list = this.tableData.map((e: any) => e.addrId)
    const oldCountry = (this.tableData[0] || {}).countryId
    // 遍历原来的，在修改之后的中查找，修改后中没有原来的就是删除
    list.forEach((e: any, i: any) => {
      if (this.selectAddress.indexOf(e) === -1) {
        // 删除的
        params.delList.push(this.tableData[i].id)
      }
    })
    // 遍历修改后的，在原来里没有的就是添加
    this.selectAddress.forEach((e: any, i: any) => {
      if (list.indexOf(e) === -1) {
        // 添加的
        const tamp = this.transferList.find((item: any) => item.id === e)
        if (tamp) {
          params.insList.push({
            addrId: tamp.id,
            addrName: tamp.fellName,
            countryId: tamp.countryId,
            tscId: this.setAddressData.id,
            type: this.form.addressType
          })
        }
      }
    })
    if (this.isArea && oldCountry) {
      if (oldCountry !== this.form.countryId) {
        params.delList = [...params.delList, ...this.tableData].reduce((delList: any[], item: any) => {
          if (!delList.find((e: any) => e === item.id)) {
            delList.push(item.id)
          }
          return delList
        }, [])
      }
    }
    this.loading = true
    saveAddressOther(params).then((res: any) => {
      this.loading = false
      if (res.success) {
        this.$message.success('添加成功')
        this.visible = false
        this.dialogClose()
      }
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }

  private handleChange() {
    switch (this.form.addressType) {
      case 3:
        this.getFbastoreList()
        break
      case 4:
        this.getRegionList()
        break
      case 5:
        this.getAreaList(1)
        break
      case 6:
        this.getAreaList(3)
        break
      case 7:
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

  private filterMethod(query: any, item: any): boolean {
    const name = item.fellName || ''
    return name.indexOf(query) > -1
  }

  private addressTypeChange(val: any) {
    if (this.form.addressType === 1 || this.form.addressType === 2 || this.form.addressType === 3) {
      this.isArea = false
      this.form.countryId = []
    } else {
      this.isArea = true
      this.form.countryId = undefined
    }
    this.transferList = []
    this.selectAddress = []
    if (val === 0) {
      this.modalWidth = '960px'
    } else {
      this.modalWidth = '960px'
    }
    this.pagination.page = 1
    this.getAddressList()
  }

  private streetChange(val: any, row: any) {
    row.street = ''
    if (val.length) {
      row.street = this.streetList.filter((item: any) => val.indexOf(item.id) !== -1).map((item: any) => item.name).join(',')
    }
  }

  private add() {
    this.tableData.forEach((item: any) => {
      item.isEditRow = false
    })
    this.tableData = [...this.tableData, {
      key: new Date().getTime(),
      country: '', // 国家
      countryId: undefined,
      detailArea: [],
      detailAreaName: '',
      area: '', // 区域
      areaId: '',
      city: '', // 城市
      cityId: '',
      province: '', // 省份
      provinceId: '',
      streetIds: [],
      street: '', // 街道
      isEditRow: true
    }]
  }

  private addAddress() {
    const editingRow = this.tableData.find((e: any) => e.isEditRow)
    if (!editingRow) {
      this.add()
    } else {
      if (editingRow.id) {
        this.$confirm('您修改的尚未保存！', '温馨提示', {
          confirmButtonText: '保存',
          closeOnClickModal: false,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          if (this.validate(editingRow)) {
            await this.saveAddress(editingRow, 'isAdd')
          }
        }).catch(() => {
          this.add()
        })
      } else {
        this.$confirm('您新增的尚未保存！', '温馨提示', {
          confirmButtonText: '保存',
          closeOnClickModal: false,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          if (this.validate(editingRow)) {
            await this.saveAddress(editingRow, 'isAdd')
          }
        }).catch(() => {
          this.tableData = this.tableData.filter((e: any) => !e.isEditRow)
        })
      }
    }
  }

  private async editAddress(row: any) {
    this.tableData.forEach((item: any) => {
      item.isEditRow = false
    })
    row.isEditRow = true
    this.loading = true
    await this.getAreaDetailList(row)
    await this.getStreet(row)
    this.loading = false
  }

  private validate(row: any): boolean {
    if (!row.countryId) {
      this.$message.warning('请选择国家')
      return false
    }
    if (!row.detailArea.length) {
      this.$message.warning('请选择城市')
      return false
    }
    if (row.countryId === 'CN'! && row.streetIds.length === 0) {
      this.$message.warning('请选择街道')
      return false
    }
    return true
  }

  private delAddress(row: any) {
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      if (row.id) {
        const params = {
          id: row.id,
          deleted: 1
        }
        this.loading = true
        saveAddress(params).then((res: any) => {
          this.loading = false
          if (res.success) {
            this.$message.success('操作成功')
            this.pagination.page = 1
            this.getAddressList()
          }
        }).catch((err: any) => {
          this.loading = false
          return err
        })
      }
    })
      .catch(() => {
        return false
      })
  }

  private cancelEditAddress(row: any) {
    if (row.key) {
      this.tableData = this.tableData.filter((item: any) => {
        if (item.key) {
          return item.key !== row.key
        } else {
          return item
        }
      })
    } else {
      row.isEditRow = false
    }
  }

  private async saveAddress(row: any, isAdd?: string) {
    if (this.validate(row)) {
      const params: any = Object.assign({
        tscId: this.setAddressData.id
      }, row)
      if (row.result && row.result.length) {
        const streetIds = row.result.map((e: any) => e.streetId)
        // 遍历原来的，在修改之后的中查找，修改后中没有原来的就是删除
        streetIds.forEach((e: any, i: any) => {
          if (row.streetIds.indexOf(e) === -1) {
            // 删除的
            params.delList.push(row.result[i].id)
          }
        })
        // 遍历修改后的，在原来里没有的就是添加
        row.streetIds.forEach((e: any, i: any) => {
          if (streetIds.indexOf(e) === -1) {
            // 添加的
            const street = this.streetList.find((item: any) => item.id === e)
            params.insList.push({
              key: street.id,
              value: street.name
            })
          }
        })
      } else {
        params.insList = row.streetIds.map((item: any) => {
          const street = this.streetList.find((e) => e.id === item)
          return {
            key: item,
            value: street.name
          }
        })
      }
      this.loading = true
      await saveAddress(params).then((res: any) => {
        this.loading = false
        if (res.success) {
          this.$message.success('操作成功')
          this.getAddressList(isAdd)
        }
      }).catch((err: any) => {
        this.loading = false
        return err
      })
    }
  }

  private async getAreaDetailList(row: any) {
    const params = {
      countryId: row.countryId
    }
    this.selectLoading = true
    await getAreasByCountry(params).then((res: any) => {
      this.selectLoading = false
      if (res.success) {
        const result = res.data.result.length > 0 ? res.data.result[0].children : []
        this.detailAreaList = this.$formatAreas(result, 4)
      }
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }

  private async getStreet(row: any) {
    this.streetList = []

    if (row.detailArea.length !== 2) {
      this.$message.warning('请选择城市')
      return
    }
    const params: any = {
      countryId: row.countryId,
      cityId: row.detailArea[1]
    }
    this.selectLoading = true
    if (params.countryId === 'CN') {
      await getAllStreet(params).then((res: any) => {
        this.selectLoading = false
        if (res.success) {
          this.streetList = res.data || []
        }
      }).catch((err: any) => {
        this.selectLoading = false
        return err
      })
    } else {
      params.page = 1
      params.size = 9999
      await getCounties(params).then((res: any) => {
        this.selectLoading = false
        if (res.success) {
          const data = res.data
          this.streetList = data.result || []
        }
      }).catch((err: any) => {
        this.selectLoading = false
        return err
      })
    }
  }

  private dialogClose() {
    this.visible = false
    this.$emit('load')
  }

  private show(row: any) {
    this.visible = true
    this.setAddressData = row
    this.transferList = []
    this.selectAddress = []
    this.form = {
      addressType: row.endAddressType,
      countryId: undefined
    }
    this.addressTypeChange(row.endAddressType)
  }

  private async detailAreaChange(val: any, row: any) {
    const areaInfo = this.$getAreaName(val, this.detailAreaList)
    row.detailAreaName = ''
    row.province = areaInfo.stateName || ''
    row.provinceId = val.length >= 1 ? val[0] : ''
    row.city = areaInfo.cityName || ''
    row.cityId = val.length >= 2 ? val[1] : ''
    row.area = areaInfo.countyName || ''
    row.areaId = val.length === 3 ? val[2] : ''
    if (val.length) {
      row.detailAreaName = `${row.province} ${row.city} ${row.area}`
      await this.getStreet(row)
    }
  }

  private async countryChange(val: any, row: any) {
    const list = (this as any).countryList
    const country = list.find((e: any) => e.id === val)
    this.detailAreaList = []
    row.country = ''
    if (country) {
      row.country = `${country.name}-${country.alias}`
    }
    await this.getAreaDetailList(row)
  }

  private getAddressList(isAdd?: string) {
    const params = {
      model: {
        tscId: this.setAddressData.id,
        type: this.form.addressType
      },
      page: this.pagination.page,
      size: this.pagination.size
    }
    if (this.form.addressType !== 0) {
      params.size = 99999
    }
    this.loading = true
    getAddressList(params).then((res: any) => {
      this.loading = false
      if (res.success) {
        const data = res.data || {}
        const result = data.result || []
        if (this.form.addressType === 0) {
          this.tableData = result.map((item: any) => {
            const detailArea = []
            if (item.provinceId) {
              detailArea.push(item.provinceId)
            }
            if (item.cityId) {
              detailArea.push(item.cityId)
            }
            item.isEditRow = false
            item.detailArea = detailArea
            item.streetIds = []
            item.detailAreaName = `${item.province} ${item.city}`
            if (item.result && item.result.length) {
              item.streetIds = item.result.map((e: any) => e.streetId)
              item.street = item.result.map((e: any) => e.street).join(',')
            }
            return item
          })
          this.pagination.total = data.total || 0
          if (isAdd === 'isAdd') {
            this.add()
          }
        } else {
          this.tableData = result || []
          this.selectAddress = this.tableData.map((e: any) => e.addrId)
          if (!this.isArea) {
            this.form.countryId = result.reduce((list: any[], item: any) => {
              if (item.countryId && list.indexOf(item.countryId) === -1) {
                list.push(item.countryId)
              }
              return list
            }, [])
          } else {
            this.form.countryId = (result[0] || {}).countryId
          }
          this.handleChange()
        }
      }
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }

  private handleSizeChange(val: string) {
    this.pagination.size = Number(val)
    this.getAddressList()
  }

  private handleCurrentChange(val: string) {
    this.pagination.page = Number(val)
    this.getAddressList()
  }
}
</script>
<style lang="scss" scoped>
</style>
