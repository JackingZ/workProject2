<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          info=""
          title="服务附加费"
        />
        <!-- <div class="app-panel">
          <div v-show="togglePanel">
            <el-row>
              <el-col :span="4">
                <el-button
                  type="text"
                  icon="el-icon-circle-plus-outline"
                  style="margin-left: 10px"
                  @click="addBrokerage"
                >
                  新增附加费
                </el-button>
              </el-col>
              <el-col
                :span="20"
                style="text-align:right;"
              >
                <el-select
                  v-model="selectValue.orgId"
                  placeholder="快递/卡派公司"
                  style="width:130px;margin-right:5px;"
                  size="small"
                  @focus="getCountryList"
                >
                  <el-option
                    v-for="item in expressList"
                    :key="item.expressId"
                    :label="item.expressName"
                    :value="item.id"
                  />
                </el-select>
                <el-select
                  v-model="selectValue.serviceCode"
                  placeholder="关联服务编码"
                  style="width:130px;margin-right:5px;"
                  size="small"
                  @focus="getCountryList"
                >
                  <el-option
                    v-for="item in serviceCodeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-input
                  v-model="selectValue.name"
                  placeholder="请输入附加费名称"
                  class="input-with-select"
                  style="width:280px;margin-right:5px;"
                  size="small"
                />
                <el-button
                  type="primary"
                  size="small"
                  @click="queryAllForService"
                >
                  查询
                </el-button>
              </el-col>
            </el-row>

            <el-table
              v-loading="loading"
              :data="tableData"
              height="calc(100vh - 313px)"
              style="width: 100%;margin: 10px 0;"
              border
            >
              <el-table-column
                prop="ssTypeName"
                label="服务类型"
                min-width="120"
              >
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.type === 0 ? '本地快递' : '国际快递' }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="id"
                label="服务编码"
                min-width="120"
              />
              <el-table-column
                prop="name"
                label="服务名称"
                min-width="120"
              />
              <el-table-column
                prop="countryNameFrom"
                label="起运国"
                min-width="120"
              />
              <el-table-column
                prop="countryNameTo"
                label="目的国"
                min-width="120"
              />
              <el-table-column
                label="服务区域"
                width="150"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="setArea(scope.row)"
                  >
                    设置区域
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                label="服务区域"
                min-width="120"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="setArea(scope.row)"
                  >
                    关联FBA专线
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="添加时间"
                width="180"
              />
              <el-table-column
                fixed="right"
                label="操作"
                width="160"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="editForm(scope.row)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="text"
                    @click="deletData(scope.row)"
                  >
                    删除
                  </el-button>
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
          </div>
          <div v-show="!togglePanel">
            <el-row>
              <el-col :span="4">
                <el-button
                  type="text"
                  icon="el-icon-circle-plus-outline"
                  style="margin-left: 10px"
                  @click="addBrokerage"
                >
                  新增服务编码
                </el-button>
              </el-col>
              <el-col
                :span="20"
                style="text-align:right;"
              >
                <el-select
                  v-model="selectValue.countryId"
                  placeholder="目的国"
                  style="width:130px;margin-right:10px;"
                  size="small"
                  @focus="getCountryList"
                >
                  <el-option
                    v-for="item in countryList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                <el-input
                  v-model="selectValue.keyword"
                  placeholder="请输入内容"
                  class="input-with-select"
                  style="width:280px;margin-right:10px;"
                  size="small"
                >
                  <el-select
                    slot="prepend"
                    v-model="selectType"
                    size="small"
                    style="width:110px;"
                    placeholder="请选择"
                  >
                    <el-option
                      label="服务编码"
                      value="1"
                    />
                    <el-option
                      label="服务名称"
                      value="2"
                    />
                  </el-select>
                </el-input>
                <el-button
                  type="primary"
                  size="small"
                  @click="queryAllForService"
                >
                  查询
                </el-button>
              </el-col>
            </el-row>

            <el-table
              v-loading="loading"
              :data="tableData"
              height="calc(100vh - 313px)"
              style="width: 100%;margin: 10px 0;"
              border
            >
              <el-table-column
                prop="ssTypeName"
                label="服务类型"
                min-width="120"
              >
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.type === 0 ? '本地快递' : '国际快递' }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="id"
                label="服务编码"
                min-width="120"
              />
              <el-table-column
                prop="name"
                label="服务名称"
                min-width="120"
              />
              <el-table-column
                prop="countryNameFrom"
                label="起运国"
                min-width="120"
              />
              <el-table-column
                prop="countryNameTo"
                label="目的国"
                min-width="120"
              />
              <el-table-column
                label="服务区域"
                width="150"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="setArea(scope.row)"
                  >
                    设置区域
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                label="服务区域"
                min-width="120"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="setArea(scope.row)"
                  >
                    关联FBA专线
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="添加时间"
                width="180"
              />
              <el-table-column
                fixed="right"
                label="操作"
                width="160"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="editForm(scope.row)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="text"
                    @click="deletData(scope.row)"
                  >
                    删除
                  </el-button>
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
          </div>
        </div>

        <el-dialog
          :title="isEidt ? '编辑服务附加费' : '新增服务附加费'"
          width="550px"
          :visible.sync="isAddEditVisible"
        >
          <div class="add-edit-organ">
            <el-form
              ref="editForm"
              :model="selectForm"
              :rules="formRules"
              label-width="120px"
              label-position="right"
            >
              <el-form-item
                label="所在国家"
                prop="countryId"
              >
                <el-select
                  v-model="selectForm.countryIdFrom"
                  style="width:100%;"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in countryList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>

              <el-form-item
                label="快递/卡派公司"
                prop="id"
              >
                <el-select
                  v-model="selectValue.orgId"
                  placeholder="快递/卡派公司"
                  style="width:100%;"
                  size="small"
                  @focus="getCountryList"
                >
                  <el-option
                    v-for="item in expressList"
                    :key="item.expressId"
                    :label="item.expressName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="附加费名称"
                prop="name"
              >
                <el-input
                  v-model="selectForm.name"
                  placeholder="请输入"
                />
              </el-form-item>
              <el-form-item
                label="触发条件"
                prop="ssTypeId"
              >
                <el-select
                  v-model="selectForm.excute"
                  style="width:100%;"
                  placeholder="请选择"
                >
                  <el-option
                    label="最大重量"
                    :value="0"
                  />
                  <el-option
                    label="最大边长"
                    :value="1"
                  />
                  <el-option
                    label="偏远地区"
                    :value="2"
                  />
                  <el-option
                    label="送件上楼"
                    :value="3"
                  />
                  <el-option
                    label="签收签字"
                    :value="4"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="计量单位"
                prop="ssTypeId"
              >
                <el-select
                  v-model="selectForm.um"
                  style="width:100%;"
                  placeholder="请选择"
                >
                  <el-option
                    label="最大重量"
                    :value="0"
                  />
                  <el-option
                    label="最大边长"
                    :value="1"
                  />
                  <el-option
                    label="偏远地区"
                    :value="2"
                  />
                  <el-option
                    label="送件上楼"
                    :value="3"
                  />
                  <el-option
                    label="签收签字"
                    :value="4"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="触发的最小值">
                <el-input
                  v-model="selectForm.value"
                  placeholder="请输入"
                />
              </el-form-item>
              <el-form-item label="收费单位">
                <el-input
                  v-model="selectForm.value"
                  placeholder="请输入"
                >
                  <el-select
                    slot="append"
                    v-model="selectForm.currencyId"
                    style="width:90px;"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in currencyList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-input>
              </el-form-item>
            </el-form>
          </div>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="cancel">
              取 消
            </el-button>
            <el-button
              type="primary"
              @click="saveConfirm"
            >
              确 定
            </el-button>
          </div>
        </el-dialog>
        <el-dialog
          title="设置服务区域"
          width="550px"
          :visible.sync="serviveAreaShow"
        >
          <div class="add-edit-organ">
            <el-form
              ref="editForm"
              :model="selectForm"
              :rules="formRules"
              label-width="120px"
              label-position="right"
            >
              <el-form-item
                label="报关服务区域"
                prop="type"
              >
                <el-select
                  v-model="selectForm.type"
                  style="width:100%;"
                  placeholder="请选择"
                >
                  <el-option
                    label="进口报关"
                    :value="0"
                  />
                  <el-option
                    label="出口报关"
                    :value="1"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="cancel">
              取 消
            </el-button>
            <el-button
              type="primary"
              @click="saveConfirm"
            >
              确 定
            </el-button>
          </div>
        </el-dialog> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'

@Component({
  name: 'ServiceSurcharge',
  components: {},
  props: {}
})
export default class extends Vue {
  /* data */
  private loading: boolean = false

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

  /* methods */
}
</script>
