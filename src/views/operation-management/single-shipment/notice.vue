<template>
  <div v-loading="noticeLoading">
    <div style="height: calc(100vh - 230px);overflow-y: auto;">
      <div style="overflow: hidden;padding-top: 15px;">
        <el-form
          ref="noticeForm"
          :model="noticeForm"
          label-width="90px"
          size="small"
          class="notice-form"
        >
          <el-row
            type="flex"
            :gutter="10"
          >
            <el-col
              :span="6"
            >
              <el-form-item
                label="装货仓库"
                prop="warehouseIds"
              >
                <el-select
                  v-model="noticeForm.warehouseIds"
                  size="small"
                  clearable
                  filterable
                  multiple
                  collapse-tags
                  placeholder="请选择"
                  style="width: 100%;"
                  @change="onWarehouse"
                >
                  <el-option
                    v-for="item in warehouseList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="isType === '1' || isType === '2'"
                label="拖车供应商"
                prop="custId"
              >
                <el-select
                  v-model="noticeForm.custId"
                  :loading="selectLoading"
                  placeholder="请选择"
                  style="width:100%;"
                  clearable
                  filterable
                  size="small"
                  @focus="getSupplierList"
                  @change="onSupplier"
                >
                  <el-option
                    v-for="item in supplierList"
                    :key="item.custId"
                    :label="item.custName"
                    :value="item.custId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="isType === '0'"
                label="送货方式"
                prop="freight"
              >
                <el-radio-group
                  v-model="noticeForm.freight"
                  @change="onFreight"
                >
                  <el-radio label="0">
                    自主送货
                  </el-radio>
                  <el-radio label="1">
                    供应商自提
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                v-if="noticeForm.freight === '0'"
                label="选择地址"
                prop="addressId"
              >
                <el-select
                  v-model="noticeForm.addressId"
                  :loading="selectLoading"
                  placeholder="请选择"
                  style="width:100%;"
                  clearable
                  filterable
                  size="small"
                  @focus="getAddressList"
                  @change="onAddress"
                >
                  <el-option
                    v-for="item in addressList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="2"
              style="text-align: right;"
            >
              <span style="font-weight: 400;color: #606266;font-size: 14px;line-height: 40px;">备注</span>
            </el-col>
            <el-col
              :span="16"
            >
              <el-input
                v-model="noticeForm.remark"
                type="textarea"
                size="small"
                placeholder="请输入"
                :autosize="{minRows: 3, maxRows: 4}"
                clearable
              />
            </el-col>
          </el-row>
        </el-form>
        <el-row
          type="flex"
          :gutter="10"
          style="margin: 10px 0;"
        >
          <el-col
            :span="8"
          >
            <div class="items">
              <div class="items-head">
                待调拨
                <span style="font-size: 12px;color: #BFC4CB;">拖拽右侧进行调拨</span>
              </div>
              <div id="tag">
                <el-tag
                  v-for="item in unAllotList"
                  :key="item.id"
                  type="info"
                >
                  {{ (item || {}).name }}
                </el-tag>
              </div>
            </div>
          </el-col>
          <el-col :span="16">
            <el-table
              id="theTable"
              ref="theTable"
              :data="allotList"
              max-height="400px"
              border
            >
              <el-table-column
                prop="name"
                label="仓库名称"
              />
              <el-table-column
                prop=""
                label="将需要调拨的仓库拖拽到此处"
              >
                <template slot-scope="scope">
                  <div
                    :id="`right-tag-${scope.$index}`"
                    class="tag-class"
                  >
                    <el-tag
                      v-for="item in scope.row.transferTo"
                      :key="item.id"
                      type="info"
                    >
                      {{ (item || {}).name }}
                    </el-tag>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <el-collapse
        v-model="activeNames"
        @change="onContain"
      >
        <el-collapse-item
          v-for="(item, index) in containData"
          :key="index"
          :name="index"
        >
          <template slot="title">
            <i class="el-icon-minus icon-rotate" />
            <span style="font-size: 16px;font-weight: bold;">货柜 {{ index + 1 }}</span>
          </template>
          <el-row>
            <el-col :span="18">
              <el-button
                type="warning"
                size="small"
                plain
              >
                通知财务
              </el-button>
              <el-button
                type="warning"
                size="small"
                plain
              >
                通知仓库
              </el-button>
              <el-button
                type="warning"
                size="small"
                plain
              >
                通知车队
              </el-button>
              <el-button
                type="warning"
                size="small"
                plain
              >
                通知订舱
              </el-button>
              <el-button
                type="warning"
                size="small"
                plain
              >
                通知报关
              </el-button>
              <el-button
                type="warning"
                size="small"
                plain
              >
                通知客户
              </el-button>
            </el-col>
            <el-col
              :span="6"
              style="text-align: right;"
            >
              <span v-if="isType === '1' || isType === '2'">
                SO号：
              </span>
              <span v-if="isType === '0'">
                航空单号：
              </span>
              <span>
                {{ (item.containerInfo || {}).SO }}
              </span>
              <!-- <el-select
                v-model="item.so"
                size="small"
                clearable
                filterable
                placeholder="so号"
                style="width: 200px;"
                @change="onSo"
              >
                <el-option
                  v-for="it in soList"
                  :key="it.id"
                  :label="it.name"
                  :value="it.id"
                />
              </el-select> -->
            </el-col>
          </el-row>
          <el-table
            :data="item.orders"
            height="300px"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              prop="code"
              label="原单号"
              width="150"
              show-overflow-tooltip
            />
            <el-table-column
              label="通知项"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.xxx }}</div>
                <div>{{ scope.row.xxx }}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import Sortablejs from 'sortablejs'
import {
  getSupplierList,
  updateShip,
  getAddressData
} from '@/api/operation-of-single-shipment'

@Component({
  name: '',
  components: {
  },
  props: {}
})
export default class extends Vue {
  /* data */
  private noticeLoading: boolean = false
  private selectLoading: boolean = false
  private isType: any = ''
  private containData: any[] = []
  private noticeForm: any = {
    warehouseIds: [],
    custId: undefined,
    custName: undefined,
    freight: undefined,
    address: undefined,
    addressId: undefined,
    supplyId: undefined,
    remark: undefined
  }
  private allotOption: any = {}
  private warehouseOrder: any[] = []
  private warehouseList: any[] = []
  private supplierList: any[] = []
  private addressList: any[] = []
  private soList: any[] = []
  private allotList: any[] = []
  private unAllotList: any[] = []
  private activeNames: any = ['1']
  private page: number = 1
  private size: number = 10
  private total: any = 0
  /* computed */

  /* methods */
  private setData(val: any) {
    this.allotOption = JSON.parse(JSON.stringify(val))
    this.isType = (this.allotOption || {}).type
    this.noticeForm.supplyId = (this.allotOption || {}).supplyId
    this.containData = (this.allotOption || {}).containers || []
    let arrW: any[] = []
    this.containData.map((it: any) => {
      (it.orders || []).map((o: any) => {
        if (o.warehouse) {
          arrW.push(o.warehouse)
        }
      })
    })
    arrW = arrW.filter((it: any) => it.id)
    const obj: any = {}
    this.warehouseOrder = arrW.reduce((cur: any, next: any) => {
      if (!obj[next.id]) {
        obj[next.id] = true
        cur.push(next)
      }
      return cur
    }, [])
    this.warehouseList = JSON.parse(JSON.stringify(this.warehouseOrder))
  }
  private onContain() {
    //
  }
  private onSo() {
    //
  }
  private onFreight() {
    this.noticeForm.addressId = undefined
    this.noticeForm.address = undefined
  }

  private onWarehouse(val: any) {
    this.allotList = this.warehouseList.map((it: any) => {
      const bool = val.some((w: any) => w === it.id)
      if (bool) {
        return {
          ...it,
          transferTo: []
        }
      }
    }).filter((it: any) => it && it.id)
    this.unAllotList = this.warehouseList.map((it: any) => {
      const bool = val.every((w: any) => w !== it.id)
      if (bool) {
        return it
      }
    }).filter((it: any) => it && it.id)
    this.$nextTick(() => {
      this.onDrag()
    })
  }

  private onDrag() {
    const that = this
    const el: any = document.querySelector('#tag')
    Sortablejs.create(el, {
      animation: 300,
      group: 'el_table',
      sort: false,
      onEnd: (evt: any) => {
        that.leftSortToRight(evt)
      }
    })
    const arr: any = document.querySelectorAll('#theTable  .tag-class')
    for (const it of arr) {
      Sortablejs.create(it, {
        group: 'el_table',
        sort: false,
        animation: 300,
        onEnd: (evt: any) => {
          that.rightSortToLeftAndOther(evt)
        }
      })
    }
  }

  // private sortableOnEnd(evt: any, type?: string) {
  //   const { newIndex, oldIndex, from, to } = evt
  //   if (type === 'table') {
  //     // 表格列表
  //     const toClassNames = to.className.split(' ') || []
  //     const fromClassNames = from.className.split(' ') || []
  //     if (from === to) {
  //       // 排序
  //       const idClass = toClassNames.find((e: any) => e.indexOf('tag-class_') !== -1)
  //       if (idClass) {
  //         const id = idClass.split('_')[1]
  //         this.allotList = this.allotList.map((e: any) => {
  //           if (e.id === id) {
  //             const currRow = e.transferTo.splice(oldIndex, 1)[0]
  //             e.transferTo.splice(newIndex, 0, currRow)
  //           }
  //           return e
  //         })
  //       }
  //     } else {
  //       const fromIdClass = fromClassNames.find((e: any) => e.indexOf('tag-class_') !== -1)
  //       if (toClassNames.indexOf('tag-box') === -1) {
  //         // 表格内移动
  //         const toIdClass = toClassNames.find((e: any) => e.indexOf('tag-class_') !== -1)
  //         if (toIdClass && fromIdClass) {
  //           const toId = toIdClass.split('_')[1]
  //           const fromId = fromIdClass.split('_')[1]
  //           const toData = this.allotList.find((e: any) => e.id === toId)
  //           const fromData = this.allotList.find((e: any) => e.id === fromId)
  //           const currRow = fromData.transferTo.splice(oldIndex, 1)[0]
  //           toData.transferTo.splice(newIndex, 0, currRow)
  //         }
  //       } else {
  //         const fromId = fromIdClass.split('_')[1]
  //         const fromData = this.allotList.find((e: any) => e.id === fromId)
  //         const currRow = fromData.transferTo.splice(oldIndex, 1)[0]
  //         this.unAllotList.splice(newIndex, 0, currRow)
  //       }
  //     }
  //   } else {
  //     const currRow = this.unAllotList.splice(oldIndex, 1)[0]
  //     if (from === to) {
  //       // 排序
  //       this.unAllotList.splice(newIndex, 0, currRow)
  //     } else {
  //       // 移入到列表
  //       const toClassNames = to.className.split(' ') || []
  //       const idClass = toClassNames.find((e: any) => e.indexOf('tag-class_') !== -1)
  //       if (idClass) {
  //         const id = idClass.split('_')[1]
  //         this.allotList = this.allotList.map((e: any) => {
  //           if (e.id === id) {
  //             e.transferTo.splice(newIndex, 0, currRow)
  //           }
  //           return e
  //         })
  //       }
  //     }
  //   }
  // }

  private leftSortToRight(evt: any) {
    const { newIndex, oldIndex, from, to } = evt
    if (to.id !== 'tag') {
      const idn = (to.id || '').split('right-tag-')[1]
      const item = this.unAllotList.splice(oldIndex, 1)[0]
      this.allotList[idn].transferTo.splice(newIndex, 0, item)
    }
  }

  private rightSortToLeftAndOther(evt: any) {
    const { newIndex, oldIndex, from, to } = evt
    if (to.id === 'tag') {
      const idn = (from.id || '').split('right-tag-')[1]
      const item = (this.allotList[idn].transferTo || []).splice(oldIndex, 1)[0]
      this.unAllotList.splice(newIndex, 0, item)
    } else if (from.id !== to.id) {
      const idn1 = (from.id || '').split('right-tag-')[1]
      const idn2 = (to.id || '').split('right-tag-')[1]
      const item = (this.allotList[idn1].transferTo || []).splice(oldIndex, 1)[0]
      this.allotList[idn2].transferTo.splice(newIndex, 0, item)
    }
  }

  private getSupplierList() {
    this.selectLoading = true
    const params: any = {
      typeId: '06',
      cas: 'S',
      page: 1,
      size: 9999
    }
    getSupplierList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.supplierList = data.result || []
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private onSupplier(val: any) {
    this.noticeForm.custName = undefined
    this.supplierList.map((it: any) => {
      if (val === it.custId) {
        this.noticeForm.custName = it.custName
      }
    })
  }
  private getAddressList() {
    this.selectLoading = true
    const params = {
      custId: this.noticeForm.supplyId,
      type: '3'
    }
    getAddressData(params).then(res => {
      this.selectLoading = false
      const data = res.data || {}
      this.addressList = data.result || []
    }).catch(err => {
      this.selectLoading = false
      return err
    })
  }
  private onAddress(val: any) {
    this.noticeForm.address = undefined
    this.addressList.map((it: any) => {
      if (val === it.id) {
        this.noticeForm.address = it
      }
    })
  }

  private handleSave(bool: boolean, id: string) {
    if (!this.noticeForm.warehouseIds) {
      this.$message.error('请选择装货仓库')
      return false
    }
    if ((this.isType === '1' || this.isType === '2') && !this.noticeForm.custId) {
      this.$message.error('请选择拖车供应商')
      return false
    }
    if ((this.isType === '0') && !this.noticeForm.freight) {
      this.$message.error('请选择送货方式')
      return false
    }
    if ((this.isType === '0') && this.noticeForm.freight === '0' && !this.noticeForm.addressId) {
      this.$message.error('请选择地址')
      return false
    }
    if (this.unAllotList.length > 0) {
      this.$message.error('存在尚未调拨仓库，请完成调拨')
      return false
    }
    const arr: any[] = []
    this.allotList.map((a: any) => {
      if (Array.isArray(a.transferTo) && a.transferTo.length > 0) {
        a.transferTo.map((t: any) => {
          const { transferTo, ...obj } = a
          arr.push({
            ...t,
            truck: false,
            transferTo: obj
          })
        })
      } else {
        const { transferTo, ...obj } = a
        arr.push({
          ...obj,
          truck: true
        })
      }
    })
    const { ...form } = (this as any).allotOption
    const { freight, address, remark } = this.noticeForm
    const params: any = {
      ...form,
      mode: '1',
      draft: bool,
      truckSupplier: {
        key: this.noticeForm.custId,
        value: this.noticeForm.custName
      },
      warehouses: arr,
      id,
      freight,
      address,
      remark
    }
    this.$emit('setload', true)
    updateShip(params)
      .then((res: any) => {
        this.$emit('setload', false)
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.$emit('back')
      })
      .catch((err: any) => {
        this.$emit('setload', false)
        return err
      })
  }
  private mounted() {
    this.$nextTick(() => {
      this.onDrag()
    })
  }
}
</script>

<style lang="scss" scoped>
.el-collapse {
  border-top: none;
  border-bottom: none;
}
.icon-rotate {
  transform: rotate(90deg);
  font-weight: bold;
  font-size: 16px;
}
.items {
  height: 100%;
  overflow: auto;
  border: 1px solid #e6ebf5;
  .items-head {
    padding: 10px;
    margin-bottom: 15px;
  }
}
.el-tag {
  cursor: pointer;
}
.notice-form {
  .el-form-item {
    vertical-align: top;
    margin-bottom: 10px;
  }
}
</style>
