<template>
  <div
    v-loading="loading"
  >
    <div class="detail-back">
      <span class="title">
        分配车辆
      </span>
      <div>
        <el-button
          type="text"
          icon="el-icon-refresh-right"
          @click="getContainerList"
        >
          <span>刷新</span>
        </el-button>
        <el-button
          type="text"
          icon="el-icon-back"
          @click="goBack"
        >
          <span>返回</span>
        </el-button>
      </div>
    </div>
    <div class="app-panel order-detail">
      <div
        v-if="containerList.length"
      >
        <div
          v-for="(item, i) in containerList"
          :key="item.id"
        >
          <div class="container-info">
            <div class="c-no">
              {{ '货柜' + (i + 1) }}
            </div>
            <div class="c-status">
              <div class="item">
                <div class="label">
                  状态
                </div>
                <div class="value status">
                  {{ (containerStatusList.find(e => e.value === item.status) || {}).label }}
                </div>
              </div>
              <div
                v-if="item.status === 1"
                class="item"
              >
                <div class="label">
                  司机状态
                </div>
                <div class="value status">
                  {{ (driverStatusList.find(e => e.value === item.driverInfo.orderStatus) || {}).name }}
                </div>
              </div>
              <div
                v-if="item.driverInfo.reason"
                class="item"
              >
                <div class="label">
                  司机取消/拒绝
                </div>
                <div class="value status">
                  {{ item.driverInfo.reason }}
                </div>
              </div>
              <div class="item">
                <div class="label">
                  分配司机
                </div>
                <div class="value">
                  <el-select
                    v-model="item.driverInfo.driverId"
                    :disabled="item.status === 1"
                    placeholder="请选择"
                    style="width:160px;"
                    size="small"
                  >
                    <el-option
                      v-for="driver in driverList"
                      :key="driver.driverId"
                      :label="driver.driverName + '-' + driver.plateNumber"
                      :value="driver.driverId"
                    />
                  </el-select>
                </div>
              </div>
              <el-button
                type="text"
                :disabled="item.status === 1"
                @click="assignDriver(item)"
              >
                保存
              </el-button>
            </div>
          </div>
          <div class="my-table-header">
            <div style="display: flex;flex: 1;align-items: center">
              <div class="item">
                <div class="label">
                  SO号
                </div>
                <div class="value">
                  <el-input
                    v-model="item.soCode"
                    disabled
                    clearable
                    size="small"
                    placeholder="请输入"
                    style="width: 160px"
                  />
                </div>
              </div>
              <div class="item">
                <div class="label">
                  柜号
                </div>
                <div class="value">
                  <el-input
                    v-model="item.form.cabinetNo"
                    :disabled="!item.form.isEdit"
                    clearable
                    size="small"
                    placeholder="请输入"
                    style="width: 160px"
                  />
                </div>
              </div>
              <div class="item">
                <div class="label">
                  关封号
                </div>
                <div class="value">
                  <el-input
                    v-model="item.form.sealNo"
                    :disabled="!item.form.isEdit"
                    clearable
                    size="small"
                    placeholder="请输入"
                    style="width: 160px"
                  />
                </div>
              </div>
              <div class="img-list">
                <div
                  v-if="!item.file.name"
                  class="img-item-upload"
                >
                  <el-upload
                    action
                    :show-file-list="false"
                    :disabled="!item.form.isEdit"
                    :before-upload="beforeAvatarUpload"
                    :http-request="(data) => uploadFile(data, item)"
                    class="avatar-uploader"
                  >
                    <i
                      class="el-icon-plus avatar-uploader-icon"
                    />
                  </el-upload>
                </div>
                <div
                  v-else
                  class="preview-img-wrap"
                >
                  <div class="preview-img">
                    <img :src="item.file.url">
                    <div class="mask">
                      <i
                        class="el-icon-view mask-view-icon"
                        @click="handlePreview(item.file.url)"
                      />
                      <i
                        v-if="item.form.isEdit"
                        class="el-icon-delete mask-del-icon"
                        @click="handleDelete(item.file.name, item)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <el-button
              v-if="!item.form.isEdit"
              type="text"
              @click="editSealNo(item)"
            >
              编辑
            </el-button>
            <el-button
              v-if="item.form.isEdit"
              type="text"
              @click="cancelSealNo(item)"
            >
              取消
            </el-button>
            <el-button
              v-if="item.form.isEdit"
              type="text"
              @click="saveSealNo(item)"
            >
              保存
            </el-button>
          </div>
          <div class="status-table">
            <el-table
              :data="item.statusList"
              style="width: 100%;"
              border
            >
              <el-table-column
                label="操作"
                prop="status"
                width="200"
              />
              <el-table-column
                label="详情"
              >
                <template slot-scope="scope">
                  <div
                    style="display: flex;text-align: center;flex-wrap: wrap"
                  >
                    <div
                      v-for="file in scope.row.fileList"
                      :key="file.id"
                    >
                      <div
                        class="preview-img-wrap"
                      >
                        <div class="preview-img">
                          <img :src="file.url">
                          <div class="mask">
                            <i
                              class="el-icon-view mask-view-icon"
                              @click="handlePreview(file.url)"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="des">
                        {{ file.des }}
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="操作时间"
                width="200"
                prop="time"
              />
            </el-table>
          </div>
          <div class="cost-table-header">
            <div style="display: flex;align-items: center">
              <div
                class="status"
                style="margin-right: 20px"
              >
                <span style="margin-right: 5px">费用状态</span>
                <span style="color: #FF7D19;">
                  {{ (costAuditList.find(e => e.value === item.costAudit) || {}).name }}
                </span>
              </div>
              <div
                v-if="item.costAudit === 3"
                class="status"
              >
                <span style="margin-right: 5px">拒绝原因</span>
                <span style="color: #FF7D19;">
                  {{ item.costReason }}
                </span>
              </div>
            </div>
            <div class="option-btn">
              <el-button
                v-if="(item.costAudit === 0 || item.costAudit === 3) && item.status === 1"
                type="text"
                @click="addNewCost(item)"
              >
                新增额外费用
              </el-button>
              <el-button
                v-if="item.costAudit === 3 && item.status === 1"
                type="text"
                @click="commitCost(item)"
              >
                重新提交审核
              </el-button>
              <div v-if="item.costAudit === 1 && item.status === 1">
                <div style="display: inline-block;margin-right: 10px">
                  <span style="padding-right: 10px;">费用审核</span>
                  <el-radio-group
                    v-model="form.audit"
                  >
                    <el-radio :label="2">
                      通过
                    </el-radio>
                    <el-radio :label="3">
                      拒绝
                    </el-radio>
                  </el-radio-group>
                </div>
                <div
                  v-if="form.audit === 3"
                  style="display: inline-block;margin-right: 10px"
                >
                  <span style="padding-right: 10px;">拒绝原因</span>
                  <el-input
                    v-model="form.reason"
                    clearable
                    size="small"
                    placeholder="请输入"
                    style="width: 160px"
                  />
                </div>
                <el-button
                  type="text"
                  @click="auditCost(item)"
                >
                  保存
                </el-button>
              </div>
            </div>
          </div>
          <div class="cost-table">
            <el-table
              :data="item.costList"
              style="width: 100%;"
              border
            >
              <el-table-column
                label="费用名称"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.isEdit"
                    v-model="scope.row.costName"
                    clearable
                    size="small"
                    placeholder="请输入"
                    style="width: 160px"
                  />
                  <span v-else>{{ scope.row.costName }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="支付金额"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.isEdit"
                    v-model="scope.row.money"
                    clearable
                    size="small"
                    placeholder="请输入"
                    style="width: 160px"
                  />
                  <span v-else>{{ scope.row.money }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="支付凭证"
                width="100"
              >
                <!--<template slot-scope="scope">-->
                <template slot-scope="scope">
                  <div class="img-list">
                    <div
                      v-if="!scope.row.file.name"
                      class="img-item-upload"
                    >
                      <el-upload
                        action
                        :show-file-list="false"
                        :disabled="!scope.row.isEdit"
                        :before-upload="beforeAvatarUpload"
                        :http-request="(data) => uploadFile(data, scope.row)"
                        class="avatar-uploader"
                      >
                        <i
                          class="el-icon-plus avatar-uploader-icon"
                        />
                      </el-upload>
                    </div>
                    <div
                      v-else
                      class="preview-img-wrap"
                    >
                      <div class="preview-img">
                        <img :src="scope.row.file.url">
                        <div class="mask">
                          <i
                            class="el-icon-view mask-view-icon"
                            @click="handlePreview(scope.row.file.url)"
                          />
                          <i
                            v-if="scope.row.isEdit"
                            class="el-icon-delete mask-del-icon"
                            @click="handleDelete(scope.row.file.name, scope.row)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="费用描述"
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.isEdit"
                    v-model="scope.row.costDescribe"
                    clearable
                    size="small"
                    placeholder="请输入"
                    style="width: 160px"
                  />
                  <span v-else>{{ scope.row.costDescribe }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="150"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="(item.costAudit === 0 || item.costAudit === 3) && !scope.row.isEdit"
                    type="text"
                    @click="delCost(item, scope.$index)"
                  >
                    删除
                  </el-button>
                  <el-button
                    v-if="(item.costAudit === 0 || item.costAudit === 3) && scope.row.isEdit"
                    type="text"
                    @click="cancelCost(item)"
                  >
                    取消
                  </el-button>
                  <el-button
                    v-if="(item.costAudit === 0 || item.costAudit === 3) && scope.row.isEdit"
                    type="text"
                    @click="saveCost(item, scope.row)"
                  >
                    保存
                  </el-button>
                  <el-button
                    v-if="(item.costAudit === 0 || item.costAudit === 3) && !scope.row.isEdit && scope.row.id"
                    type="text"
                    @click="editRow(item, scope.row)"
                  >
                    编辑
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div
        v-else
        style="text-align: center;color: #909399"
      >
        暂无柜子信息
      </div>
    </div>
    <el-dialog
      title="照片预览"
      :visible.sync="dialogVisible"
      top="20px"
      append-to-body
    >
      <img
        width="100%"
        :src="imageUrl"
      >
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  getContainerByOrder,
  getCarByOrder,
  assignDriver,
  uploadFile,
  deleteFile,
  upContainer,
  addCost,
  editCost,
  delCost,
  auditCost,
  commitCost
} from '@/api/orderlist-at-trailer'
@Component({
  name: '',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private dialogVisible: boolean = false
  private imageUrl: any = ''
  private form: any = {
    reason: '',
    audit: 2
  }
  private driverStatusList: any = [
    {
      name: '待确认',
      value: 0
    },
    {
      name: '进行中',
      value: 1
    },
    {
      name: '已完成',
      value: 2
    },
    {
      name: '已取消',
      value: 3
    }
  ]
  private costAuditList: any[] = [
    {
      name: '司机未提交',
      value: 0
    },
    {
      name: '司机已提交待审核',
      value: 1
    },
    {
      name: '审核通过',
      value: 2
    },
    {
      name: '审核拒绝',
      value: 3
    }
  ]
  private containerStatusList: any[] = [
    {
      label: '待分配',
      value: 0
    },
    {
      label: '已分配',
      value: 1
    },
    {
      label: '司机拒绝接单',
      value: 2
    }
  ]
  private driverList: any[] = []
  private containerList: any[] = []
  private showRow: any = {}
  /* computed */
  get userInfo(): any {
    return UserModule.info || {}
  }
  /* methods */
  private goBack() {
    this.form = {
      reason: '',
      audit: 2
    }
    this.imageUrl = ''
    this.driverList = []
    this.containerList = []
    this.showRow = {}
    this.$emit('back')
  }
  private commitCost(row: any) {
    const params = {
      driverId: row.driverInfo.id,
      containerId: row.id
    }
    this.loading = true
    commitCost(params).then(() => {
      this.loading = false
      this.$message.success('操作成功')
      this.getContainerList()
    }).catch(() => {
      this.loading = false
    })
  }
  private auditCost(row: any) {
    if (this.form.audit === 3 && !this.form.reason) {
      this.$message.error('请填写拒绝原因')
      return
    }
    const params = {
      trailerId: row.trailerId,
      driverId: row.driverInfo.id,
      containerId: row.id,
      ...this.form
    }
    this.loading = true
    auditCost(params).then(() => {
      this.loading = false
      this.$message.success('操作成功')
      this.getContainerList()
    }).catch(() => {
      this.loading = false
    })
  }
  private checkCostData(data: any) {
    if (!data.costName) {
      this.$message.error('请输入费用名称')
      return false
    }
    if (!data.money) {
      this.$message.error('请输入支付金额')
      return false
    }
    const reg = /^\d+.?\d*$/
    if (!reg.test(data.money)) {
      this.$message.error('请填写正确的支付金额')
      return false
    }
    if (!data.file || !data.file.name) {
      this.$message.error('请上传支付凭证')
      return false
    }
    if (!data.costDescribe) {
      this.$message.error('请输入费用描述')
      return false
    }
    return true
  }
  private saveCost(row: any, data: any) {
    if (this.checkCostData(data)) {
      const params: any = {
        ...data,
        url: data.file.name,
        driverId: row.driverInfo.id
      }
      if (params.id) {
        this.editCost(params)
      } else {
        this.addCost(params)
      }
    }
  }
  private editCost(params: any) {
    this.loading = true
    editCost(params).then(() => {
      this.loading = false
      this.$message.success('费用保存成功')
      this.getContainerList()
    }).catch(() => {
      this.loading = false
    })
  }
  private addCost(params: any) {
    this.loading = true
    addCost(params).then(() => {
      this.loading = false
      this.$message.success('费用保存成功')
      this.getContainerList()
    }).catch(() => {
      this.loading = false
    })
  }
  private editRow(row: any, data: any) {
    row.costList = row.costList.map((e: any) => {
      e.isEdit = false
      if (e.id === data.id) {
        e.isEdit = true
      }
      return e
    }).filter((e: any) => e.id)
  }
  private cancelCost(row: any) {
    row.costList = row.costList.map((e: any) => {
      e.isEdit = false
      return e
    }).filter((e: any) => e.id)
  }
  private addNewCost(row: any) {
    row.costList = row.costList.map((e: any) => {
      e.isEdit = false
      return e
    }).filter((e: any) => e.id)
    row.costList.push({
      costName: '',
      money: '',
      isEdit: true,
      file: {
        url: '',
        name: ''
      },
      costDescribe: ''
    })
  }
  private delCost(row: any, index: any) {
    const cost = row.costList[index]
    if (cost.id) {
      // 调用接口
      this.$confirm('请确认是否删除该条数据?', '温馨提示', {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            id: cost.id
          }
          this.loading = true
          delCost(params).then(() => {
            this.loading = false
            this.$message.success('费用删除成功')
            this.getContainerList()
          }).catch(() => {
            this.loading = false
          })
        })
        .catch(() => {
          return false
        })
    } else {
      row.costList = row.costList.filter((e: any, i: number) => i !== index)
    }
  }
  private handleDelete(name: any, data: any) {
    const params = {
      ifPublic: true,
      fileList: [name]
    }
    this.loading = true
    deleteFile(params).then(() => {
      this.loading = false
      data.file = {
        url: '',
        name: ''
      }
    }).catch(() => {
      this.loading = false
    })
  }
  private handlePreview(url: any) {
    this.imageUrl = url
    this.dialogVisible = true
  }
  private editSealNo(data: any) {
    data.form.isEdit = true
  }
  private cancelSealNo(data: any) {
    data.form.isEdit = false
  }
  private saveSealNo(data: any) {
    if (!data.form.cabinetNo) {
      this.$message.error('请输入柜号')
      return
    }
    if (!data.form.sealNo) {
      this.$message.error('请输入关封号')
      return
    }
    if (!data.file.name) {
      this.$message.error('请上传文件')
      return
    }
    const params = {
      ...data.form,
      url: data.file.name,
      containerId: data.id
    }
    this.loading = true
    upContainer(params).then(() => {
      this.loading = true
      this.getContainerList()
    }).catch(() => {
      this.loading = false
    })
  }
  private beforeAvatarUpload(file: any) {
    const isJPG: boolean = file.type.indexOf('image') !== -1
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isJPG) {
      this.$message.error('上传照片只能是图片格式!')
    }
    if (!isLt2M) {
      this.$message.error('上传照片大小不能超过 2MB!')
    }
    return isJPG && isLt2M
  }
  private uploadFile(data: any, row: any) {
    const formData = new FormData()
    const file = new File([data.file], data.file.name.split('.')[0] + new Date().getTime() + '.' + data.file.name.split('.')[1], { type: data.file.type })
    formData.append('file', file)
    this.loading = true
    uploadFile(formData).then((res: any) => {
      this.loading = false
      const result = res.data || {}
      row.file.name = result.objectName
      row.file.url = process.env.VUE_APP_OSS_PATH + result.objectName
    }).catch(() => {
      row.file = {
        name: '',
        url: ''
      }
      this.loading = false
    })
  }
  private assignDriver(row: any) {
    if (!row.driverInfo.driverId) {
      this.$message.error('请选择司机')
      return
    }
    const driver = this.driverList.find((e: any) => e.driverId === row.driverInfo.driverId) || {}
    const params: any = {
      ...driver
    }
    params.operationUser = this.userInfo.realName
    params.operationPhone = this.userInfo.phone
    params.containerId = row.id
    params.trailerId = row.trailerId
    this.loading = true
    assignDriver(params).then(() => {
      this.loading = false
      this.$message.success('车辆分配成功')
      this.getContainerList()
    }).catch(() => {
      this.loading = false
    })
  }
  private show(row: any) {
    this.showRow = row
    this.getContainerList()
    this.getCarList()
  }
  private getCarList() {
    const params = {
      custId: this.showRow.sellerId
    }
    getCarByOrder(params).then((res: any) => {
      this.driverList = res.data || []
    }).catch(() => {
      this.driverList = []
    })
  }
  private getContainerList() {
    const params = {
      trailerId: this.showRow.id
    }
    this.loading = true
    getContainerByOrder(params).then((res: any) => {
      this.loading = false
      const data = res.data || []
      this.containerList = data.map((c: any) => {
        const container = c.trailerContainer || {}
        const driver: any = c.driverOrderTrailer || { driverId: '', orderStatus: 0 }
        const packList: any[] = c.packList || []
        const statusList: any[] = []
        for (const key of Object.keys(driver)) {
          if (key === 'orderStatus' && driver[key] !== 0 && driver[key] !== 3) {
            statusList.push({
              id: key,
              status: '司机确认接单',
              time: driver.confirmDate,
              fileList: []
            })
          }
          if (key === 'carryCabinetStatus' && driver[key] === 1) {
            statusList.push({
              id: key,
              status: '提柜确认',
              time: driver.carryCabinetTime,
              fileList: [
                {
                  url: process.env.VUE_APP_OSS_PATH + driver.carryCabiner1,
                  des: '柜后门',
                  name: driver.carryCabiner1
                },
                {
                  url: process.env.VUE_APP_OSS_PATH + driver.carryCabiner2,
                  des: '封条',
                  name: driver.carryCabiner2
                }
              ]
            })
          }
          if (key === 'returnCabinetStatus' && driver[key] === 1) {
            statusList.push({
              id: key,
              status: '还柜确认',
              time: driver.returnCabinetTime,
              fileList: [
                {
                  url: process.env.VUE_APP_OSS_PATH + driver.returnCabinet1,
                  des: '过磅单',
                  name: driver.returnCabinet1
                },
                {
                  url: process.env.VUE_APP_OSS_PATH + driver.returnCabinet2,
                  des: '还柜纸',
                  name: driver.returnCabinet2
                }
              ]
            })
          }
        }
        packList.forEach((p: any, i: any) => {
          for (const k of Object.keys(p)) {
            if (k === 'presentStatus' && p[k] === '1') {
              statusList.push({
                id: k + i,
                status: '到场确认',
                time: p.presentTime,
                address: p.address,
                fileList: [
                  {
                    url: process.env.VUE_APP_OSS_PATH + p.presentUrl,
                    des: '到场照片',
                    name: p.presentUrl
                  }
                ]
              })
            }
            if (k === 'departureStatus' && p[k] === '1') {
              statusList.push({
                id: k + i,
                status: '离场确认',
                time: p.departureTime,
                address: p.address,
                fileList: [
                  {
                    url: process.env.VUE_APP_OSS_PATH + p.departure1,
                    des: '装货前',
                    name: p.departure1
                  },
                  {
                    url: process.env.VUE_APP_OSS_PATH + p.departure2,
                    des: '装货中',
                    name: p.departure2
                  },
                  {
                    url: process.env.VUE_APP_OSS_PATH + p.departure3,
                    des: '装货完',
                    name: p.departure3
                  },
                  {
                    url: process.env.VUE_APP_OSS_PATH + p.departure4,
                    des: '关柜门',
                    name: p.departure4
                  },
                  {
                    url: process.env.VUE_APP_OSS_PATH + p.departure5,
                    des: '封锁条',
                    name: p.departure5
                  }
                ]
              })
            }
          }
        })
        const costList = (c.list || []).map((e: any) => {
          return {
            ...e,
            isEdit: false,
            file: {
              url: process.env.VUE_APP_OSS_PATH + e.url,
              name: e.url
            }
          }
        })
        return {
          form: {
            isEdit: !(container.cabinetNo),
            cabinetNo: container.cabinetNo,
            sealNo: container.sealNo
          },
          file: {
            url: process.env.VUE_APP_OSS_PATH + container.url,
            name: container.url
          },
          ...container,
          statusList: statusList.map((item: any) => {
            item.fileList = item.fileList.filter((e: any) => e.name)
            return item
          }).sort((a: any, b: any) => b.time < a.time ? 1 : -1),
          driverInfo: {
            ...driver
          }, // 分配司机信息
          costList // 额外费用
        }
      })
    }).catch(() => {
      this.loading = false
      this.containerList = []
      this.$emit('back')
    })
  }
}
</script>

<style lang="scss" scoped>
  .detail-back {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    line-height: 50px;
    border-bottom: 1px solid #e8e8e8;
    background-color: #fff;
  }
  .container-info{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .c-no{
      font-size: 20px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #303133;
    }
    .c-status{
      display: flex;
      align-items: center;
      .status{
        color: #FF7D19;
      }
    }
  }
  .option-btn{
    text-align: right;
    padding: 10px 0;
  }
  .order-detail {
    height: calc(100vh - 170px);
    overflow-y: auto;
  }
  .my-table-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px;
    margin-top: 10px;
    background: #fafafa;
    border: 1px solid #dfe6ec;
    border-bottom: none;
  }
  .cost-table-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .status{
      padding: 10px 0;
      display: flex;
      align-items: center;
    }
  }
  .item{
    display: flex;
    align-items: center;
    font-family: PingFang SC;
    margin-right: 20px;
    .label{
      font-weight: 400;
      color: #303133;
      padding-right: 10px;
    }
    .value{
      font-weight: 500;
      color: #303133;
    }
  }
  .img-list{
    display: flex;
    align-items: center;
    .img-item-upload{
      cursor: pointer;
      margin-right: 10px;
      width: 48px;
      height: 48px;
      border: 1px solid #DCDFE6;
      border-radius: 4px;
      font-size: 20px;
      text-align: center;
      line-height: 48px;
    }
  }
  .preview-img-wrap{
    width: 48px;
    height: 48px;
    padding: 1px;
    object-fit: cover;
    overflow: hidden;
    border: 1px solid #eee;
    margin: 0 5px;
    .preview-img{
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
      img{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        height: 100%;
      }
      .mask{
        font-size: 14px;
        cursor: pointer;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.4);
        opacity: 0;
        transition: all .5s;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        .mask-del-icon{
          margin-left: 5px;
        }
        &:hover{
          opacity: 1;
        }
      }
    }
  }
</style>
