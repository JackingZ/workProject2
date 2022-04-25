<template>
  <div class="order-detail">
    <div class="detail-title">
      验货申请单详细信息
    </div>
    <el-form
      ref="detail"
      :model="form"
      label-width="120px"
      label-position="right"
      class="detail-form"
    >
      <el-form-item label="验货申请单ID：">
        <el-input
          v-if="isEdit"
          v-model="form.examiningNo"
          size="small"
          placeholder="请输入"
        />
        <span v-else>
          {{ form.examiningNo }}
        </span>
      </el-form-item>
      <el-form-item label="原单号：">
        <el-input
          v-if="isEdit"
          v-model="form.originalNo"
          size="small"
          placeholder="请输入"
        />
        <span v-else>
          {{ form.originalNo }}
        </span>
      </el-form-item>
      <el-form-item label="仓库名称：">
        <el-select
          v-if="isEdit"
          v-model="form.warehouseId"
          placeholder="请选择"
          size="small"
          clearable
          filterable
          style="width:100%;"
        >
          <el-option
            v-for="item in storeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span v-else>
          {{ form.warehouseName }}
        </span>
      </el-form-item>
      <el-form-item label="入仓时间：">
        {{ row.storageTime }}
      </el-form-item>
      <!-- <el-form-item label="客户名称：">
        <el-select
          v-if="isEdit"
          v-model="form.custId"
          placeholder="请选择"
          size="small"
          clearable
          filterable
          style="width:100%;"
        >
          <el-option
            v-for="item in customerOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span v-else>
          {{ form.custName }}
        </span>
      </el-form-item> -->
      <el-form-item label="状态：">
        <el-select
          v-if="isEdit"
          v-model="form.status"
          placeholder="请选择"
          size="small"
          clearable
          style="width:100%;"
        >
          <el-option
            v-for="(item, index) in statusList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <span v-else>
          {{ (statusList[form.status - 1] || {}).name }}
        </span>
      </el-form-item>
      <span v-if="!isEdit">
        <el-form-item label="申请人：">
          {{ form.applicantName }}
        </el-form-item>
        <el-form-item label="申请时间：">
          {{ form.createTime }}
        </el-form-item>
        <el-form-item label="审核人：">
          <span v-if="custType === '0' || custType === '1'">{{ form.reviewerName }}</span>
          <span v-else-if="custType === '2'">{{ form.agencyReviewerName }}</span>
          <span v-else-if="custType === '3'">{{ form.warehouseReviewerName }}</span>
        </el-form-item>
        <el-form-item label="审核时间：">
          <span v-if="custType === '0' || custType === '1'">{{ form.reviewTime }}</span>
          <span v-else-if="custType === '2'">{{ form.agencyReviewTime }}</span>
          <span v-else-if="custType === '3'">{{ form.warehouseReviewTime }}</span>
        </el-form-item>
        <el-form-item label="审核结果：">
          <span v-if="custType === '0' || custType === '1'">{{ form.auditResults }}</span>
          <span v-else-if="custType === '2'">{{ form.agencyReviewResults }}</span>
          <span v-else-if="custType === '3'">{{ form.warehouseReviewResults }}</span>
          {{ form.auditResults }}
        </el-form-item>
      </span>
      <el-form-item label="验货环节：">
        <el-select
          v-if="isEdit"
          v-model="form.section"
          placeholder="请选择"
          size="small"
          clearable
          style="width:100%;"
        >
          <el-option
            label="退货入库"
            :value="2"
          />
          <el-option
            label="入库检验"
            :value="1"
          />
        </el-select>
        <span v-else>
          <span v-if="form.section === 1">
            入库检验
          </span>
          <span v-if="form.section === 2">
            退货入库
          </span>
        </span>
      </el-form-item>
      <div>
        <el-form-item
          label="验货要求："
          style="width: 100%;"
        >
          <el-input
            v-if="isEdit"
            v-model="form.noted"
            size="small"
            placeholder="请输入"
          />
          <span v-else>
            {{ form.noted }}
          </span>
        </el-form-item>
      </div>
    </el-form>

    <el-row>
      <el-col
        :xs="12"
        :sm="10"
        :md="10"
        :lg="8"
        :xl="8"
      >
        <div style="margin-right: 16px;">
          <div class="detail-title">
            验货结果
          </div>
          <div class="row-split">
            <el-form
              ref="detail"
              :model="resultForm"
              label-width="105px"
              label-position="right"
              class="result-form"
            >
              <el-form-item label="渠道确认：">
                <span v-if="resultForm.validated === 0">不通过</span>
                <span v-else-if="resultForm.validated === 1">通过</span>
              </el-form-item>
              <el-form-item label="商品属性：">
                {{ resultForm.categoriesStr }}
              </el-form-item>
              <el-form-item label="验货描述：">
                {{ resultForm.examiningDesc }}
              </el-form-item>
              <el-form-item label="验货照片：">
                <el-card
                  v-for="(item, index) in examImg"
                  :key="index"
                  :body-style="{padding: '0px'}"
                  style="display: inline-block;margin: 0 10px 10px 0;"
                >
                  <div class="img-show">
                    <img
                      :src="filePath + item"
                      class="avatar-img"
                    >
                    <span
                      class="img-action"
                      @click.stop=""
                    >
                      <i
                        class="el-icon-zoom-in img-icon"
                        @click.stop=";(imgShow = true, imgUrl = filePath + item)"
                      />
                    </span>
                  </div>
                </el-card>
              </el-form-item>
              <el-form-item label="问题件照片：">
                <el-card
                  v-for="(item, index) in issueImg"
                  :key="index"
                  :body-style="{padding: '0px'}"
                  style="display: inline-block;margin: 0 10px 10px 0;"
                >
                  <div class="img-show">
                    <img
                      :src="filePath + item"
                      class="avatar-img"
                    >
                    <span
                      class="img-action"
                      @click.stop=""
                    >
                      <i
                        class="el-icon-zoom-in img-icon"
                        @click.stop=";(imgShow = true, imgUrl = filePath + item)"
                      />
                    </span>
                  </div>
                </el-card>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
      <el-col
        :xs="12"
        :sm="14"
        :md="14"
        :lg="16"
        :xl="16"
      >
        <div class="detail-title">
          商品列表
        </div>
        <div class="row-split">
          <el-card
            v-for="(item, index) in goodsData"
            :key="index"
            :body-style="{padding: '15px'}"
            class="card-goods"
          >
            <div class="card-item">
              <div class="img-show">
                <img
                  :src="filePath + item.picture"
                  class="avatar-img"
                >
                <span
                  class="img-action"
                  @click.stop=""
                >
                  <i
                    class="el-icon-zoom-in img-icon"
                    @click.stop=";(imgShow = true, imgUrl = filePath + item.picture)"
                  />
                </span>
              </div>
              <div class="card-word">
                <div style="font-size: 16px;font-weight: 600;">
                  {{ item.nameCn }}
                </div>
                <div style="padding-top: 5px;font-size: 14px;color: #606266;">
                  商品属性：{{ item.nature }}
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      title="商品图片"
      :visible.sync="imgShow"
      :close-on-click-modal="false"
      append-to-body
      width="540px"
      @closed=";(imgShow = false)"
    >
      <img
        :src="imgUrl"
        style="display: block;height: 100%;width: 100%;object-fit: contain;"
      >
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { getExamineDetailByCode } from '@/api/warehose-by-config'
@Component({
  name: 'ExamineDetail',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private isEdit: boolean = false
  private form = {
    actualFinishTime: undefined,
    agencyReviewResults: undefined,
    agencyReviewTime: undefined,
    agencyReviewerId: undefined,
    agencyReviewerName: undefined,
    applicantId: undefined,
    applicantName: undefined,
    assignorId: undefined,
    assignorName: undefined,
    auditResults: undefined,
    autidStatus: 0,
    createTime: undefined,
    custId: undefined,
    custName: undefined,
    examiningNo: undefined,
    examiningType: 0,
    executorId: undefined,
    executorName: undefined,
    expectedFinishTime: undefined,
    noted: undefined,
    originalNo: undefined,
    reviewTime: undefined,
    reviewerId: undefined,
    reviewerName: undefined,
    scale: 0,
    section: 0,
    status: 0,
    id: undefined,
    totalNumber: 0,
    totalVolume: 0,
    totalWeight: 0,
    updateTime: undefined,
    warehouseId: undefined,
    warehouseName: undefined,
    warehouseReviewResults: undefined,
    warehouseReviewTime: undefined,
    warehouseReviewerId: undefined,
    warehouseReviewerName: undefined
  }
  private statusList: any[] = [
    { id: '1', name: '待验货' },
    { id: '2', name: '验货中' },
    { id: '3', name: '已完成' }
    // { id: '4', name: '待审核' },
    // { id: '5', name: '被拒绝' },
    // { id: '6', name: '已拒绝' },
    // { id: '7', name: '待代理商审核' },
    // { id: '8', name: '待仓库审核' },
    // { id: '9', name: '代理商拒绝' },
    // { id: '10', name: '仓库拒绝' }
  ]
  private resultForm: any = {}
  private row: any = {}
  private boxData = []
  private goodsData: any[] = []
  private issueImg: any[] = []
  private examImg: any[] = []
  private categories: any[] = [
    {
      name: '普货',
      value: '0'
    },
    {
      name: '纯电',
      value: '2'
    },
    {
      name: '带磁',
      value: '3'
    },
    {
      name: '带电',
      value: '1'
    },
    {
      name: '危险',
      value: '4'
    }
  ]
  private imgShow: boolean = false
  private imgUrl = ''
  private examineId = ''
  private tabsIndex = 'first'
  private filePath = process.env.VUE_APP_OSS_PATH

  /** computed */
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }

  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }

  /* method */
  private setData(row: any): void {
    // 设置值
    this.examineId = row.code || ''
    this.row = row
    this.getDetail()
  }
  private getDetail(): void {
    // 查询
    this.$emit('setload', true)
    getExamineDetailByCode({
      id: this.examineId
    })
      .then((res: any) => {
        const data = res.data || {}
        const { boxes, goods, result, ...form } = data
        this.form = form || {}
        this.boxData = boxes || []
        this.goodsData = goods || []
        const categories = result.categories || ''
        const categoriesList = categories.split(',')
        const categoriesStr = this.categories.filter((e: any) => {
          return categoriesList.find((c: any) => c === e.value)
        }).map((e: any) => e.name).join('，')
        this.resultForm = {
          ...result,
          categoriesStr
        }
        this.issueImg = this.resultForm.badImageUrls || []
        this.examImg = this.resultForm.examineImageUrls || []
        this.$emit('setload', false)
      })
      .catch((err: any) => {
        this.$emit('setload', false)
        return [null, err]
      })
  }
  private handleClick(tab: any, event: any): void {
    // 切换
    this.tabsIndex = tab.name
  }
  private handleSelection(): void {
    // 勾选
  }
  private handleDelete(): void {
    // 删除
  }
  private handleSave(): void {
    // 保存
  }
  private handlePass(): void {
    // 通过
  }
  private handleRefuse(): void {
    // 拒绝
  }
  private handleResubmit(): void {
    // 重新提交
  }
  private handleBatchDelete(): void {
    // 批量删除
  }
  private handleAddList(): void {
    // 添加至列表
  }
  private handleImg(): void {
    // 查看图片
  }
}
</script>

<style lang="scss" scoped>
.order-detail {
  height: calc(100vh - 170px);
  overflow-y: auto;
  padding-top: 10px;
}
.detail-form {
  padding: 0 20px;
  margin-bottom: 16px;
  background-color: #fff;
  ::v-deep .el-form-item {
    vertical-align: top;
    display: inline-block;
    width: 24.9%;
    margin-bottom: 0px;
  }
}
.row-split {
  min-height: 480px;
  background-color: #fff;
}
.result-form {
  ::v-deep .el-form-item {
    vertical-align: top;
    margin-bottom: 0px;
  }
  ::v-deep .el-card__body {
    height: 100px;
  }
}
.detail-title {
  padding: 10px 20px 0px;
  line-height: 30px;
  font-size: 20px;
  font-weight: 600;
  background-color: #fff;
}
.card-goods {
  display: inline-block;
  margin: 6px 0px 16px 16px;
  background-color: #F5F6FA;
}
.card-item {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 280px;
  .card-word {
    flex: 1;
    padding-left: 10px;
  }
}
::v-deep .el-tabs__nav {
  margin-left: 20px;
}

  ::v-deep .img-show:hover .img-action {
    opacity: 1;
  }
  .img-show {
    position: relative;
    height: 100px;
    width: 100px;
    line-height: 100px;
  }
  .avatar-img {
    width: 100px;
    height: 100px;
    object-fit: contain;
  }
  .img-action {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0,0,0,.5);
    transition: opacity .3s;
  }
  .img-icon {
    cursor: pointer;
  }
</style>
