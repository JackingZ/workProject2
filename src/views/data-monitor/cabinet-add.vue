<template>
  <div class="cabinet-detail">
    <div style="display: flex;flex-flow: row nowrap;align-items: center;padding-bottom: 23px;">
      <div style="width: 200px;">
        <span class="loading-subject">请选择货柜</span>
      </div>
      <div style="flex: 1;text-align: right;">
        <el-select
          v-model="form.groupIds"
          clearable
          filterable
          multiple
          collapse-tags
          size="mini"
          style="width: 240px;margin-right: 12px;"
          placeholder="服务组"
          @change="onGroup"
        >
          <el-option
            v-for="item in groupOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-input
          v-model="searchVal"
          placeholder="请输入搜索关键字"
          size="mini"
          style="width: 240px;"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
          />
        </el-input>
      </div>
    </div>
    <div
      v-if="resultData.length"
    >
      <div class="loading-contain cabinet-scrollbar">
        <div
          v-for="item in resultData"
          :key="item.id"
          class="loading-item"
        >
          <div class="item-title">
            <div class="item-radio">
              <el-radio
                v-model="selectVal"
                :label="item.id"
              />
            </div>
            <div class="item-text">
              <span class="cabinet">
                {{ item.containerName }}
              </span>
              <span class="flight">
                {{ item.portsFromName }} — {{ item.portsToName }}
              </span>
            </div>
            <div
              class="item-bill-so"
              @click.stop="handleOpen(item)"
            >
              <span class="item-color">{{ item.transport === '0' ? '提单号：' : 'SO：' }}</span>
              <span>{{ item.so }}</span>
              <span class="item-icon">
                <i
                  class="el-icon-arrow-up"
                  :style="{
                    transform: openList.includes(item.id) ? 'rotate(0deg)' : 'rotate(180deg)',
                    transition: 'all .3s',
                    cursor: 'pointer'
                  }"
                />
              </span>
            </div>
          </div>
          <el-row class="item-warehouse">
            <el-col :span="8">
              <div class="item-value">
                <span class="item-color">装货仓库：</span>
                <span>{{ item.warehouseName }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="item-value">
                <span class="item-color">货柜属性：</span>
                <span v-if="item.loadType === '1'">整柜直送-{{ item.fbaCode }}</span>
                <span v-else-if="item.loadType === '0'">快递柜</span>
                <span v-else-if="item.loadType === '2'">混装柜</span>
                <span v-else>未装载</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="item-value">
                <span class="item-color">服务组：</span>
                <span>{{ item.groupName }}</span>
              </div>
            </el-col>
          </el-row>
          <div class="item-total">
            <div class="total-word">
              <span class="total-text">总票数</span>
              <span class="total-num">{{ item.bills || 0 }}</span>
            </div>
            <div class="total-word">
              <span class="total-text">总件数</span>
              <span class="total-num">{{ item.packages || 0 }}</span>
            </div>
            <div class="total-word">
              <span class="total-text">总重量(kg)</span>
              <span class="total-num">{{ item.weights || 0 }}</span>
            </div>
            <div class="total-word">
              <span class="total-text">总体积(m³)</span>
              <span class="total-num">{{ item.volumes || 0 }}</span>
            </div>
          </div>
          <div
            v-if="openList.includes(item.id)"
            class="item-info"
          >
            <el-row v-if="item.transport === '0'">
              <el-col
                :xs="12"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="8"
              >
                <div class="info-word">
                  <span class="item-color">服务机构：</span>
                  <span>{{ item.orgName }}</span>
                </div>
              </el-col>
              <el-col
                :xs="12"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="8"
              >
                <div class="info-word">
                  <span class="item-color">截关时间：</span>
                  <span>{{ item.deadlineCustoms }}</span>
                </div>
              </el-col>
              <el-col
                :xs="12"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="8"
              >
                <div class="info-word">
                  <span class="item-color">起运港：</span>
                  <span>{{ item.portsFromName }}</span>
                </div>
              </el-col>
              <el-col
                :xs="12"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="8"
              >
                <div class="info-word">
                  <span class="item-color">目的港：</span>
                  <span>{{ item.portsToName }}</span>
                </div>
              </el-col>
              <el-col
                :xs="12"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="8"
              >
                <div class="info-word">
                  <span class="item-color">起飞时间：</span>
                  <span>{{ item.departureTime }}</span>
                </div>
              </el-col>
            </el-row>
            <el-row v-else>
              <el-col
                :xs="12"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="8"
              >
                <div class="info-word">
                  <span class="item-color">服务机构：</span>
                  <span>{{ item.orgName }}</span>
                </div>
              </el-col>
              <el-col
                :xs="12"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="8"
              >
                <div class="info-word">
                  <span class="item-color">截关时间：</span>
                  <span>{{ item.deadlineCustoms }}</span>
                </div>
              </el-col>
              <el-col
                :xs="12"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="8"
              >
                <div class="info-word">
                  <span class="item-color">ETD：</span>
                  <span>{{ item.etd }}</span>
                </div>
              </el-col>
              <el-col
                :xs="12"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="8"
              >
                <div class="info-word">
                  <span class="item-color">船次：</span>
                  <span>{{ item.shipNo }}</span>
                </div>
              </el-col>
              <el-col
                :xs="12"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="8"
              >
                <div class="info-word">
                  <span class="item-color">截重时间：</span>
                  <span>{{ item.deadlineWeight }}</span>
                </div>
              </el-col>
              <el-col
                :xs="12"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="8"
              >
                <div class="info-word">
                  <span class="item-color">ETA：</span>
                  <span>{{ item.eta }}</span>
                </div>
              </el-col>
              <el-col
                :xs="12"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="24"
              >
                <div class="info-word">
                  <span class="item-color">船名：</span>
                  <span>{{ item.shipName }}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="loading-empty"
    >
      暂无数据
    </div>
    <div class="footer-btn">
      <el-button
        size="mini"
        class="cancel-btn"
        @click="cancel"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        size="mini"
        @click="save"
      >
        提交
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getDashboardCabinetList,
  saveDashboardLoad
} from '@/api/jht-monitor'

@Component({
  name: 'MonitorDetails',
  components: {}
})
export default class extends Vue {
  /* data */
  private selectLoading: boolean = false
  private cabinetList: any[] = []
  private openList: any[] = []
  private groupOption: any[] = []
  private searchVal: any = ''
  private selectVal: any = ''
  private form: any = {
    countryId: undefined,
    loadType: undefined,
    orderIds: [],
    groupIds: []
  }
  /* computed */
  get resultData() {
    const { searchVal, cabinetList } = this
    if (searchVal) {
      return cabinetList.filter((data: any) => {
        const { portsFromName, portsToName, so }: any = data || {}
        const item = { portsFromName, portsToName, so }
        return Object.keys(item).some(key => {
          return String(data[key]).indexOf(searchVal) > -1
        })
      })
    }
    return cabinetList
  }
  /* method */
  private handleOpen(item: any) {
    if (this.openList.includes(item.id)) {
      this.openList = this.openList.filter((e: any) => e !== item.id)
    } else {
      this.openList.push(item.id)
    }
  }
  private onGroup() {
    this.selectVal = ''
    this.getCabinetList()
  }
  private setData(params: any, type: string) {
    const { groupList, ...obj } = params
    this.form = obj
    this.groupOption = groupList || []
    this.getCabinetList()
  }
  private getCabinetList() {
    let loading: any = null
    loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    const params: any = {
      countryId: this.form.countryId,
      groupIds: this.form.groupIds
    }
    getDashboardCabinetList(params)
      .then((res: any) => {
        loading && loading.close()
        const data = res.data || []
        this.cabinetList = data
        loading && loading.close()
      }).catch((err: any) => {
        loading && loading.close()
        return err
      })
  }
  private cancel() {
    this.cabinetList = []
    this.openList = []
    this.searchVal = ''
    this.selectVal = ''
    this.form = {
      countryId: undefined,
      loadType: undefined,
      orderIds: [],
      groupIds: []
    }
    this.$emit('close')
  }
  private save() {
    if (!this.selectVal) {
      this.$message.error('请选择货柜')
      return
    }
    const params: any = {
      ...this.form,
      id: this.selectVal,
      so: undefined,
      groupIds: undefined
    }
    const item: any = this.cabinetList.find((it: any) => it.id === this.selectVal) || {}
    params.so = item.so
    let loading: any = null
    loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    saveDashboardLoad(params)
      .then((res: any) => {
        this.$message.success('添加成功')
        this.cancel()
        this.$emit('updateData')
        loading && loading.close()
      }).catch((err: any) => {
        loading && loading.close()
        return err
      })
  }
}
</script>

<style lang="scss" scoped>
.cabinet-detail {
  padding:  16px 16px 25px;
  color: #fff;
  background-color: #1D2331;
  box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.16);
  .loading-subject {
    font-size: 20px;
    font-weight: 600;
  }
  .loading-contain {
    max-height: 400px;
    overflow-y: auto;
  }
  .loading-item {
    background-color: #21283B;
    padding: 20px 20px 20px 12px;
    // transition: background-color .3s;
    cursor: pointer;
    margin-bottom: 16px;
    &:hover {
      border-color: #2DC4F7;
    }
    .item-title {
      display: flex;
      align-items: center;
      .item-radio {
        width: 25px;
      }
      .item-text {
        flex: 1;
        .cabinet {
          font-size: 18px;
          font-weight: 400;
          padding-right: 16px;
        }
        .flight {
          font-size: 18px;
          font-weight: 500;
        }
      }
      .item-bill-so {
        flex: 1;
        font-size: 14px;
        text-align: right;
        .item-icon {
          padding: 0 8px 0 33px;
        }
      }
    }
    .item-warehouse {
      margin: 16px 0;
      padding-left: 23px;
      .item-value {
        line-height: 20px;
        font-size: 14px;
      }
    }
    .item-total {
      padding: 12px;
      margin-left: 20px;
      background-color: #2F3A4D;
      border-radius: 4px;
      display: flex;
      align-items: center;
      .total-word {
        flex: 1;
      }
      .total-text {
        font-size: 14px;
        color: #A0A5B3;
        margin-right: 12px;
      }
      .total-num {
        font-size: 18px;
      }
    }
    .item-info {
      margin-top: 16px;
      margin-left: 20px;
      .info-word {
        font-size: 14px;
      }
    }
    .item-color {
      color: #9DA1AC;
    }
  }
  .loading-empty {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
  }
  .footer-btn {
    text-align: right;
    padding-top: 14px;
    .cancel-btn {
      background-color: transparent;
      color: #fff;
      border-color: rgba(255, 255, 255, 0.4);
    }
  }
}

/* 设置滚动条的样式 */
// .cabinet-scrollbar {
//   &::-webkit-scrollbar{
//     width: 4px;
//   }
//   /* 滚动槽 */
//   &::-webkit-scrollbar-track{
//     border-radius: 2px;
//   }
//   /* 滚动条滑块 */
//   &::-webkit-scrollbar-thumb{
//     border-radius: 2px;
//     background: rgba(144, 147, 153, 0.3);
//   }
// }

::v-deep {
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #6AEBFF;
    background-color: transparent;
  }
  .el-radio__label {
    display: none;
  }
  .el-radio__inner {
    border: 1px solid rgba(255, 255, 255, 0.4);
    background-color: transparent;
    &:after {
      width: 9px;
      height: 9px;
      background-color: #6AEBFF;
    }
  }
  .el-input__inner {
    background-color: transparent;
    color: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.3);
  }
  input::-webkit-input-placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
  .el-tag--info {
    background-color: transparent;
    color: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.3);
  }
  .el-tag.el-tag--info .el-tag__close {
    color: rgba(255, 255, 255, 0.3);
  }
  .el-select .el-tag__close.el-icon-close {
    background-color: rgba(255, 255, 255, 0.3);
  }
  .el-select .el-input .el-select__caret {
    color: rgba(255, 255, 255, 0.3);
  }
}
</style>
