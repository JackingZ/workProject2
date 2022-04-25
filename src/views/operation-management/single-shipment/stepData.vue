<template>
  <div
    v-loading="loading"
    class="step-box"
  >
    <div class="step-header">
      <el-row class="header-title">
        <el-col :span="20">
          <el-steps
            simple
            :active="activeStep"
            finish-status="wait"
            process-status="finish"
          >
            <el-step title="选择订单" />
            <el-step title="确认订单" />
          </el-steps>
        </el-col>
        <el-col
          :span="4"
          style="text-align:right;padding: 6px;"
        >
          <el-button
            type="text"
            size="small"
            style="font-size: 14px;"
            @click="goBack"
          >
            返 回
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="step-contain">
      <div class="step-item">
        <addEditForm
          v-if="activeStep === 0"
          ref="addEditForm"
          :status-list="statusList"
          :single-id="singleId"
          :is-str="isStr"
          @setload="setLoad"
          @back="goBack"
        />
        <costItem
          v-if="activeStep === 1"
          ref="costItem"
          :status-list="statusList"
          :single-id="singleId"
          :is-str="isStr"
          @setload="setLoad"
          @back="goBack"
        />
      </div>
    </div>
    <div class="step-footer">
      <el-row class="footer-title">
        <el-col :span="12">
          <div style="height: 32px;">
            <el-button
              v-if="activeStep !== 2 && !isStr"
              type="info"
              size="small"
              plain
              @click="handleClear"
            >
              清空
            </el-button>
            <el-button
              v-if="activeStep !== 0 && !isStr"
              type="primary"
              size="small"
              plain
              @click="handleLast"
            >
              上一步
            </el-button>
          </div>
        </el-col>
        <el-col
          :span="12"
          style="text-align: right;"
        >
          <div style="height: 32px;">
            <el-button
              v-if="activeStep !== 1 && !isStr"
              type="primary"
              size="small"
              @click="handleNext"
            >
              下一步
            </el-button>
            <el-button
              v-if="activeStep === 1 && !isStr"
              type="primary"
              size="small"
              @click="handleSubmit(false)"
            >
              保存
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import addEditForm from '@/views/operation-management/single-shipment/addEditForm.vue'
import costItem from '@/views/operation-management/single-shipment/cost.vue'

import {
  getShipList,
  getStatusList
} from '@/api/operation-of-single-shipment'

@Component({
  name: '',
  components: {
    addEditForm,
    costItem
  },
  props: {
    singleId: {
      type: String,
      default: ''
    },
    isStr: {
      type: String,
      default: ''
    }
  }
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private activeStep: number = 0
  private statusList: any[] = []
  /* computed */

  /* methods */
  private goBack() {
    this.$emit('back')
  }
  private setLoad(val: boolean) {
    this.loading = val
  }
  private setRow(val: any) {
    const { fillQueryParm, containers, warehouses } = val
    const arr = containers || []
    const info = warehouses[0] || {}
    const arrO: any[] = []
    arr.map((it: any) => {
      (it.orders || []).map((o: any) => arrO.push(o))
    })
    const arrOrder = this.setReduceCodeAndChecked(arrO, true)
    const str = (this as any).isStr
    if (str === 'v' || str === 'e') {
      this.activeStep = 1
      this.$nextTick(() => {
        const root: any = (this as any).$refs.costItem
        root.setData(fillQueryParm, arrO, info)
      })
    } else {
      const root: any = (this as any).$refs.addEditForm
      root.setData(fillQueryParm, arrO, info)
    }
  }
  private setReduceCodeAndChecked(data: any[], bool: boolean) {
    // 初始化，重组订单为仓库集合，及勾选状态设定
    // 私人地址
    const arrS = data.filter((it: any) => it.addressType === '1')
    const arrF = data.filter((it: any) => it.addressType !== '1')
    const func = (array: any[], property: any) => {
      return array.reduce((arr: any[], obj: any) => {
        const key = obj.fbastore[property]
        if (!arr[key]) {
          arr[key] = []
        }
        arr[key].push(obj)
        return arr
      }, {})
    }
    const objFba = func(arrF, 'code')
    if (arrS.length > 0) {
      objFba.xxxx = arrS
    }
    const result = Object.keys(objFba).map((key: any) => {
      if (key) {
        const arr = (objFba[key] || []).map((it: any) => {
          return {
            ...it,
            checked: bool
          }
        })
        return {
          fba: key,
          checkAll: bool,
          indeterminate: bool,
          list: arr
        }
      }
    })
    return result
  }

  private async getStatusData() {
    await getStatusList().then((res: any) => {
      this.statusList = (res.data || []).map((e: any) => {
        return {
          name: e.name,
          id: e.key,
          type: e.type
        }
      })
    }).catch(() => {
      this.statusList = []
    })
  }

  private handleClear() {
    //
    // const root: any = this.$refs.tables
    // root.clearSelection()
    // this.selectedData = []
  }
  private handleLast() {
    let obj: any = {}
    if (this.activeStep === 1) {
      const rootC: any = this.$refs.costItem
      obj = rootC.getData()
    }
    if (this.activeStep-- <= 0) this.activeStep = 0
    this.$nextTick(() => {
      const rootA: any = this.$refs.addEditForm
      rootA.setData(obj.model, obj.data, obj.warehouses)
    })
  }
  private handleNext() {
    let obj: any = {}
    if (this.activeStep === 0) {
      const rootA: any = this.$refs.addEditForm
      obj = rootA.getData()
      // if ((obj.data || []).length <= 0) {
      //   this.$message.error('请勾选订单')
      //   return
      // }
    }
    if (this.activeStep++ >= 1) this.activeStep = 1
    this.$nextTick(() => {
      const rootC: any = this.$refs.costItem
      rootC.setData(obj.model, obj.data, obj.warehouses)
    })
  }
  private handleSubmit(bool: any) {
    const rootC: any = this.$refs.costItem
    rootC.onAdd(bool)
  }
  private async created() {
    await this.getStatusData()
  }
}
</script>

<style lang="scss" scoped>
.step-box {
  position: relative;
  width: 100%;
  height: 100%;
}
.step-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.step-contain {
  padding: 62px 15px 72px;
}
.step-item {
  height: calc( 100vh - 235px );
  overflow: auto;
  padding: 0 20px;
  background-color: #fff;
}
.step-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}
.el-steps--simple {
  background-color: #fff;
}
.header-title {
  margin: 15px 15px 0;
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
}
.footer-title {
  margin: 0 15px 15px;
  padding: 20px;
  background-color: #fff;
  border-top: 1px solid #e8e8e8;
}
</style>
