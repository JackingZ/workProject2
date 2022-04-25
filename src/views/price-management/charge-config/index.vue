<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="计费配置"
        />
        <div class="app-panel">
          <el-tabs
            v-model="chargeType"
            tab-position="top"
            @tab-click="onType"
          >
            <el-tab-pane
              v-if="$checkPermission(['expressOfferWeightDel', 'expressOfferWeightQuery', 'expressOfferWeightAdd', 'expressOfferWeightUpdate'])"
              label="重量计费"
              name="0"
            >
              <el-row>
                <el-col :span="4">
                  <el-button
                    v-permission="['expressOfferWeightAdd']"
                    type="text"
                    icon="el-icon-circle-plus-outline"
                    size="small"
                    @click="addRow"
                  >
                    新增
                  </el-button>
                </el-col>
                <el-col
                  :span="20"
                  style="text-align:right;"
                >
                  <el-button
                    v-permission="['expressOfferWeightAdd']"
                    type="primary"
                    size="small"
                    @click="getTableData(1)"
                  >
                    查询
                  </el-button>
                </el-col>
              </el-row>
              <el-table
                v-loading="loading"
                :data="list"
                height="calc(100vh - 350px)"
                style="width: 100%;margin: 10px 0;"
                border
              >
                <el-table-column
                  label="计费方式名称"
                  prop="name"
                />
                <el-table-column
                  label="计量误差率"
                  width="100"
                  prop="deviation"
                />
                <el-table-column
                  label="体积比"
                  width="100"
                  prop="vw"
                />
                <el-table-column
                  label="结算重量算法"
                  prop="algorithm"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.algorithm === '0'">取实重</span>
                    <span v-if="scope.row.algorithm === '1'">取实重或体积重的最大值</span>
                    <span v-if="scope.row.algorithm === '2'">取实重或体积重的平均值</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="多件重量算法"
                  prop="multiWeight"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.algorithm === '1' && scope.row.multiWeight === '0'">先累加后比较</span>
                    <span v-if="scope.row.algorithm === '1' && scope.row.multiWeight === '1'">先比较后累加</span>
                    <span v-if="scope.row.algorithm !== '1'">--</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="分泡比率"
                  prop="bulky"
                  width="100"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.bubble">{{ scope.row.bulky }}</span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="分泡条件"
                  prop=""
                >
                  <template slot-scope="scope">
                    <div v-if="scope.row.bubble">
                      <div v-if="scope.row.bubbleRule1Check && Number.isFinite(scope.row.bubbleRule1)">
                        总实重 ≥ {{ scope.row.bubbleRule1 }}kg
                      </div>
                      <div v-if="scope.row.bubbleRule2Check && Number.isFinite(scope.row.bubbleRule2)">
                        单票货物 1m³ >= {{ scope.row.bubbleRule2 }}kg且1m³ ＜ 167kg
                      </div>
                    </div>
                    <div v-else>
                      --
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="单箱重量"
                  prop="sbmc"
                />
                <el-table-column
                  label="单票重量"
                  prop="simc"
                />
                <el-table-column
                  label="操作"
                  width="120"
                >
                  <template slot-scope="scope">
                    <el-button
                      v-if="((custType === '0' && (scope.row.agent || {}).key === '0') || (scope.row.agent || {}).key !== '0') && $checkPermission(['expressOfferWeightUpdate'])"
                      type="text"
                      size="medium"
                      @click="editRow(scope.row)"
                    >
                      编辑
                    </el-button>
                    <el-button
                      v-if="((custType === '0' && (scope.row.agent || {}).key === '0') || (scope.row.agent || {}).key !== '0') && $checkPermission(['expressOfferWeightDel'])"
                      type="text"
                      size="medium"
                      @click="deleteRow(scope.row.id)"
                    >
                      删除
                    </el-button>
                    <span
                      v-else
                      style="color: #aaa;"
                    >
                      系统内置
                    </span>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                :current-page.sync="page"
                :page-size="size"
                layout="total, prev, pager, next"
                :total="total"
                style="text-align: right;"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </el-tab-pane>
            <el-tab-pane
              v-if="$checkPermission(['expressOfferDel', 'expressOfferQuery', 'expressOfferAdd', 'expressOfferUpdate'])"
              label="体积计费"
              name="1"
            >
              <el-row>
                <el-col :span="4">
                  <el-button
                    v-permission="['expressOfferAdd']"
                    type="text"
                    icon="el-icon-circle-plus-outline"
                    size="small"
                    @click="addRow"
                  >
                    新增
                  </el-button>
                </el-col>
                <el-col
                  :span="20"
                  style="text-align:right;"
                >
                  <el-button
                    v-permission="['expressOfferQuery']"
                    type="primary"
                    size="small"
                    @click="getTableData(1)"
                  >
                    查询
                  </el-button>
                </el-col>
              </el-row>
              <el-table
                v-loading="loading"
                :data="list"
                height="calc(100vh - 350px)"
                style="width: 100%;margin: 10px 0;"
                border
              >
                <el-table-column
                  label="计费方式名称"
                  prop="name"
                />
                <el-table-column
                  label="计量误差率"
                  prop="deviation"
                />
                <!-- <el-table-column
                  label="体积重单位"
                  prop="vw"
                /> -->
                <el-table-column
                  label="体积密度"
                  prop="density"
                />
                <el-table-column
                  label="操作"
                  width="120"
                >
                  <template slot-scope="scope">
                    <el-button
                      v-if="((custType === '0' && (scope.row.agent || {}).key === '0') || (scope.row.agent || {}).key !== '0') && $checkPermission(['expressOfferUpdate'])"
                      type="text"
                      size="medium"
                      @click="editRow(scope.row)"
                    >
                      编辑
                    </el-button>
                    <el-button
                      v-if="((custType === '0' && (scope.row.agent || {}).key === '0') || (scope.row.agent || {}).key !== '0') && $checkPermission(['expressOfferDel'])"
                      type="text"
                      size="medium"
                      @click="deleteRow(scope.row.id)"
                    >
                      删除
                    </el-button>
                    <span
                      v-else
                      style="color: #aaa;"
                    >
                      系统内置
                    </span>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                :current-page.sync="page"
                :page-size="size"
                layout="total, prev, pager, next"
                :total="total"
                style="text-align: right;"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </el-tab-pane>
          </el-tabs>

          <el-dialog
            :title="title"
            width="600px"
            :visible.sync="formShow"
            :close-on-click-modal="false"
            @closed="cancel"
          >
            <div v-loading="formLoading">
              <div style="max-height: 450px;overflow-y: auto;">
                <el-form
                  ref="ruleForm"
                  :model="ruleForm"
                  :rules="rules"
                  label-width="120px"
                  size="small"
                  style="padding-right: 20px;"
                >
                  <el-form-item
                    label="计费方式名称"
                    prop="name"
                  >
                    <el-input
                      v-model="ruleForm.name"
                      :maxlength="25"
                      placeholder="请输入"
                      show-word-limit
                    />
                  </el-form-item>
                  <el-form-item
                    label="计量误差率(%)"
                    prop="deviation"
                  >
                    <el-input-number
                      v-model="ruleForm.deviation"
                      class="input-number-valiate"
                      :controls="false"
                      placeholder="请输入"
                      :min="0"
                      :max="100"
                      :precision="2"
                    />
                  </el-form-item>
                  <el-form-item
                    v-if="chargeType === '0'"
                    label="体积比"
                    prop="vw"
                  >
                    <el-input-number
                      v-model="ruleForm.vw"
                      class="input-number-valiate"
                      :controls="false"
                      placeholder="请输入"
                      :min="0"
                    />
                  </el-form-item>
                  <!-- <el-form-item
                    v-if="chargeType === '1'"
                    label="体积重单位"
                    prop="vw"
                  >
                    <el-input
                      v-model="ruleForm.vw"
                      :maxlength="4"
                      show-word-limit
                      size="small"
                      placeholder="请输入"
                      clearable
                    />
                  </el-form-item> -->
                  <el-form-item
                    v-if="chargeType === '1'"
                    label="体积密度"
                    prop="density"
                  >
                    <el-input-number
                      v-model="ruleForm.density"
                      class="input-number-valiate"
                      :controls="false"
                      placeholder="请输入"
                      :min="0"
                      :max="9999"
                      :precision="2"
                    />
                  </el-form-item>
                  <el-form-item
                    v-if="chargeType === '0'"
                    label="结算重量算法"
                    prop="algorithm"
                  >
                    <el-select
                      v-model="ruleForm.algorithm"
                      placeholder="请选择"
                      size="small"
                      clearable
                      style="width:100%;"
                      @change="onAlgorithm"
                    >
                      <el-option
                        label="取实重"
                        value="0"
                      />
                      <el-option
                        label="取实重或体积重的最大值"
                        value="1"
                      />
                      <el-option
                        label="取实重或体积重的平均值"
                        value="2"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    v-if="chargeType === '0' && ruleForm.algorithm === '1'"
                    label="多件重量算法"
                    prop="multiWeight"
                  >
                    <el-select
                      v-model="ruleForm.multiWeight"
                      placeholder="请选择"
                      size="small"
                      clearable
                      style="width:100%;"
                    >
                      <el-option
                        label="先累加后比较"
                        value="0"
                      />
                      <el-option
                        label="先比较后累加"
                        value="1"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    v-if="chargeType === '0' && ruleForm.algorithm === '1'"
                    label="是否分泡"
                    prop="bubble"
                  >
                    <el-radio-group
                      v-model="ruleForm.bubble"
                      @change="onBulky"
                    >
                      <el-radio-button :label="true">
                        是
                      </el-radio-button>
                      <el-radio-button :label="false">
                        否
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <div v-if="chargeType === '0' && ruleForm.algorithm === '1' && ruleForm.bubble">
                    <div class="input-content">
                      <div>
                        <el-checkbox
                          v-model="ruleForm.bubbleRule1Check"
                          style="margin-right: 5px;"
                        />
                      </div>
                      <div style="padding-right: 20px;">
                        分泡条件1
                      </div>
                      <div>总实重&nbsp;≥&nbsp;</div>
                      <div>
                        <el-input-number
                          v-model="ruleForm.bubbleRule1"
                          class="input-number-stardard input-border"
                          size="mini"
                          :controls="false"
                          placeholder="请输入"
                          :min="0"
                          :max="999999"
                        />
                      </div>
                      <div class="input-unit">
                        kg
                      </div>
                    </div>
                    <div class="input-content">
                      <div>
                        <el-checkbox
                          v-model="ruleForm.bubbleRule2Check"
                          style="margin-right: 5px;"
                        />
                      </div>
                      <div style="padding-right: 20px;">
                        分泡条件2
                      </div>
                      <div>单票货物&nbsp;1m³&nbsp;≥&nbsp;</div>
                      <div>
                        <el-input-number
                          v-model="ruleForm.bubbleRule2"
                          class="input-number-stardard input-border"
                          size="mini"
                          :controls="false"
                          placeholder="请输入"
                          :min="0"
                          :max="999999"
                        />
                      </div>
                      <div class="input-unit">
                        kg
                      </div>
                      <div>&nbsp;并且&nbsp;1m³&nbsp;＜&nbsp;167kg</div>
                    </div>
                  </div>
                  <el-form-item
                    v-if="chargeType === '0' && ruleForm.algorithm === '1' && ruleForm.bubble"
                    label="分泡比率(%)"
                    prop="bulky"
                  >
                    <el-input-number
                      v-model="ruleForm.bulky"
                      class="input-number-valiate"
                      :controls="false"
                      placeholder="请输入"
                      :min="0"
                      :max="100"
                      :precision="2"
                    />
                  </el-form-item>
                  <!-- <el-form-item
                    v-if="chargeType === '0' && ruleForm.algorithm === '1'"
                    label="分泡条件"
                    prop="fenestration"
                  >
                    <el-input-number
                      v-model="ruleForm.fenestration"
                      class="input-number-valiate"
                      :controls="false"
                      placeholder="请输入"
                      :min="0"
                      :max="100"
                      :precision="2"
                    />
                  </el-form-item> -->
                  <el-form-item
                    v-if="chargeType === '0'"
                    label="单箱最低重量"
                    prop="sbmc"
                  >
                    <el-input-number
                      v-model="ruleForm.sbmc"
                      class="input-number-valiate"
                      :controls="false"
                      placeholder="最低收费重量"
                      :min="0"
                      :max="9999"
                      :precision="2"
                    />
                  </el-form-item>
                  <el-form-item
                    v-if="chargeType === '0'"
                    label="单票最低重量"
                    prop="simc"
                  >
                    <el-input-number
                      v-model="ruleForm.simc"
                      class="input-number-valiate"
                      :controls="false"
                      placeholder="最低收费重量"
                      :min="0"
                      :max="9999"
                      :precision="2"
                    />
                  </el-form-item>
                  <el-form-item
                    v-if="chargeType === '0'"
                    label="重量进位"
                    prop="weightCarry"
                    style="display: inline-block;width: 49.5%;"
                  >
                    <el-radio-group
                      v-model="ruleForm.weightCarry"
                      @change="onScale"
                    >
                      <el-radio-button :label="true">
                        是
                      </el-radio-button>
                      <el-radio-button :label="false">
                        否
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item
                    v-if="chargeType === '0' && ruleForm.weightCarry"
                    label="进位规则"
                    prop="weightCarryRule"
                    style="display: inline-block;width: 49.5%;"
                  >
                    <el-radio-group v-model="ruleForm.weightCarryRule">
                      <el-radio-button :label="0.5">
                        按0.5
                      </el-radio-button>
                      <el-radio-button :label="1">
                        按1
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <div
                    v-if="chargeType === '0' && ruleForm.weightCarry && ruleForm.weightCarryRule === 0.5"
                    class="scale-tip"
                  >
                    例：重量10.01kg时算10.5，重量10.6kg时算11，重量10.5时算10.5
                  </div>
                  <div
                    v-if="chargeType === '0' && ruleForm.weightCarry && ruleForm.weightCarryRule === 1"
                    class="scale-tip"
                  >
                    例：重量向上取整，10.01kg时算11kg
                  </div>
                </el-form>
              </div>
              <div
                slot="footer"
                style="text-align: right;margin: 20px 20px 0;"
              >
                <el-button
                  size="small"
                  @click="cancel"
                >
                  取 消
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="save"
                >
                  确 定
                </el-button>
              </div>
            </div>
          </el-dialog>
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
  getChargeList,
  saveCharge,
  deleteCharge
} from '@/api/price-to-charge-config'
@Component({
  name: '',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false
  private selectLoading: boolean = false
  private formShow: boolean = false
  private formLoading: boolean = false
  private chargeType = '0'
  private typeList = [
    { name: '重量计费', id: '0' },
    { name: '体积计费', id: '1' }
  ]
  private list: any = []
  private subtypeList: any = []
  private ruleForm: any = {
    subtypeId: undefined,
    name: undefined,
    deviation: undefined,
    vw: undefined,
    density: undefined,
    algorithm: undefined,
    bulky: undefined,
    fenestration: undefined,
    sbmc: undefined,
    simc: undefined,
    multiWeight: undefined,
    bubbleRule1Check: false,
    bubbleRule2Check: false,
    bubbleRule1: undefined,
    bubbleRule2: undefined,
    weightCarryRule: 0.5,
    weightCarry: true,
    bubble: false
  }
  private rules = {
    name: [
      { required: true, message: '计费方式名称不能为空', trigger: 'blur' }
    ],
    deviation: [{ required: true, message: '计量误差率不能为空', trigger: 'blur' }],
    subtypeId: [{ required: true, message: '请选择服务类型', trigger: 'blur' }],
    vw: [
      { required: true, message: '体积比不能为空', trigger: 'blur' }
    ],
    density: [{ required: true, message: '体积密度不能为空', trigger: 'blur' }],
    algorithm: [{ required: true, message: '请选择结算重量算法', trigger: 'change' }],
    bulky: [{ required: true, message: '分泡比率不能为空', trigger: 'blur' }],
    fenestration: [{ required: true, message: '分泡条件不能为空', trigger: 'blur' }],
    sbmc: [{ required: true, message: '单箱重量不能为空', trigger: 'blur' }],
    simc: [{ required: true, message: '单票重量不能为空', trigger: 'blur' }],
    multiWeight: [{ required: true, message: '请选择多件重量算法', trigger: 'change' }]
  }
  private isEdit: boolean = false
  private title: string = ''
  private page: number = 1
  private size: number = 10
  private total: any = 0

  /* computed */

  get labelPosition() {
    const lang = AppModule.language
    if (!lang) {
      return 'left'
    }
    return lang === 'en' ? 'top' : 'left'
  }

  get lang() {
    const lang = AppModule.language
    if (!lang) {
      return 'en'
    }
    return lang
  }

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
  get custType(): string {
    const info = UserModule.info || {}
    const custType = (info as any).custType
    return custType
  }

  /* methods */
  private onType() {
    this.list = []
    this.getTableData(1)
  }
  private onAlgorithm() {
    if (this.ruleForm.algorithm !== '1') {
      this.ruleForm.multiWeight = undefined
      this.ruleForm.bubble = false
      this.onBulky()
    }
  }
  private onBulky() {
    this.ruleForm.bubbleRule1Check = false
    this.ruleForm.bubbleRule1 = undefined
    this.ruleForm.bubbleRule2Check = false
    this.ruleForm.bubbleRule2 = undefined
    this.ruleForm.bulky = undefined
  }
  private onScale() {
    if (this.ruleForm.weightCarry) {
      this.ruleForm.weightCarryRule = 0.5
    } else {
      this.ruleForm.weightCarryRule = undefined
    }
  }
  private getTableData(val?: number): void {
    this.loading = true
    if (val) {
      this.page = val
    }
    const params: any = {
      agentId: (this as any).custId,
      type: this.chargeType,
      page: this.page,
      size: this.size
    }
    getChargeList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.list = data.result || []
        this.total = data.total
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private handleSizeChange(val: string) {
    this.size = Number(val)
    this.getTableData()
  }

  private handleCurrentChange(val: string) {
    this.page = Number(val)
    this.getTableData()
  }

  private addRow() {
    this.formShow = true
    this.title = '新增计费方式'
    this.isEdit = false
  }
  // 编辑
  private editRow(row: any) {
    this.formShow = true
    this.title = '编辑计费方式'
    const { ...form } = row
    this.ruleForm = {
      ...form
    }
    this.isEdit = true
  }
  // 删除
  private async deleteRow(id: string) {
    const message = '请确认是否删除该条数据?'
    const title = '温馨提示'
    const [cancel, confirm] = await this.$confirm(message, title, {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(res => {
        return [null, res]
      })
      .catch(err => {
        return [err, null]
      })
    if (cancel) return
    deleteCharge(id)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getTableData()
      })
      .catch((err: any) => {
        return err
      })
  }

  // 保存新增/编辑
  private save() {
    const editForm: any = this.$refs.ruleForm
    editForm.validate((valid: any) => {
      if (!valid) return
      const { bubbleRule1, bubbleRule2, bubbleRule1Check, bubbleRule2Check, bubble, name, deviation, density, algorithm, id, ...form } = this.ruleForm
      let params: any = {}
      if (this.chargeType === '1') {
        params = {
          id,
          name,
          deviation,
          density,
          type: this.chargeType
        }
      }
      if (this.chargeType === '0' && algorithm === '1' && bubble && !bubbleRule1Check && !bubbleRule2Check) {
        this.$message.error('请至少选择一个分泡条件')
        return
      } else if (this.chargeType === '0' && algorithm === '1' && bubble && bubbleRule1Check && !Number.isFinite(bubbleRule1)) {
        this.$message.error('分泡条件1，总实重不能为空')
        return
      } else if (this.chargeType === '0' && algorithm === '1' && bubble && bubbleRule2Check && !Number.isFinite(bubbleRule2)) {
        this.$message.error('分泡条件2，单票货物重不能为空')
        return
      } else if (this.chargeType === '0' && algorithm === '1' && bubble && bubbleRule2Check && bubbleRule2 > 167) {
        this.$message.error('分泡条件2，单票货物重不能大于167kg')
        return
      }
      if (this.chargeType === '0') {
        params = {
          ...form,
          id,
          name,
          deviation,
          algorithm,
          type: this.chargeType,
          bubble,
          bubbleRule1,
          bubbleRule2,
          bubbleRule1Check,
          bubbleRule2Check
        }
      }
      this.formLoading = true
      params.agent = {
        key: (this as any).custId,
        value: (this as any).custName
      }
      saveCharge(params)
        .then((res: any) => {
          this.formLoading = false
          this.cancel()
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.getTableData()
        })
        .catch((err: any) => {
          this.formLoading = false
          return err
        })
    })
  }

  // 取消新增/编辑
  private cancel() {
    this.formShow = false
    this.ruleForm = {
      subtypeId: undefined,
      name: undefined,
      deviation: undefined,
      vw: undefined,
      density: undefined,
      weight: undefined,
      bulky: undefined,
      fenestration: undefined,
      sbmc: undefined,
      simc: undefined,
      multiWeight: undefined,
      bubbleRule1Check: false,
      bubbleRule2Check: false,
      bubbleRule1: undefined,
      bubbleRule2: undefined,
      weightCarryRule: 0.5,
      weightCarry: true,
      bubble: false
    }
    const ele: any = this.$refs.ruleForm
    ele.clearValidate()
  }

  /* created */
  private created() {
    this.getTableData()
  }
}
</script>

<style lang="scss" scoped>
.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
.el-radio-group {
  ::v-deep .el-radio-button__inner {
    padding: 9px 18px;
  }
}
.input-number-stardard {
  width: 80px;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
.input-content {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  margin: 0 0 18px 50px;
}
.input-unit {
  width: 30px;
  height: 28px;
  line-height: 28px;
  background-color: #f5f7fa;
  color: #909399;
  padding: 0 5px;
  border: 1px solid #dcdfe6;
  border-left: 0;
  border-radius: 0 4px 4px 0;
  margin-left: -1px;
}
.input-border {
  ::v-deep .el-input__inner {
    border-radius: 4px 0 0 4px;
  }
}
.scale-tip {
  margin-left: 40px;
  padding-left: 10px;
  border-radius: 4px;
  background: #F2F3F5;
  font-size: 12px;
  color: #666666;
  line-height: 26px;
}
</style>
