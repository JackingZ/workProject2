<template>
  <div
    v-loading="isPanelLoading"
    class="app-panel"
    style="padding: 0 20px 20px;"
  >
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="联系信息"
        name="1"
      />
      <el-tab-pane
        label="地址信息"
        name="2"
      />
      <el-tab-pane
        label="我的设置"
        name="3"
      />
      <el-tab-pane
        v-if="currentCustType !== 'customer'"
        label="收款信息"
        name="4"
      />
      <el-tab-pane
        v-if="currentCustType !== 'customer'"
        label="开票信息"
        name="5"
      />
      <el-tab-pane
        label="文件列表"
        name="6"
      />
    </el-tabs>
    <div v-show="activeName === '1'">
      <el-row>
        <el-col :span="2">
          <el-button
            icon="el-icon-circle-plus-outline"
            type="text"
            size="small"
            @click="addPerson"
          >
            新增人员
          </el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="personLoading"
        :data="personData"
        height="calc(100vh - 313px)"
        style="width: 100%;margin: 10px 0;"
        border
      >
        <el-table-column
          label="所有国家"
          min-width="120"
          prop="countryName"
        />
        <el-table-column
          label="所属部门"
          width="120"
          prop="dept"
        />

        <el-table-column
          label="职务类型"
          width="120"
          prop="duty"
        />

        <el-table-column
          label="姓名"
          width="120"
          prop="name"
        />
        <el-table-column
          label="电话/手机"
          width="180"
          prop="phone"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.tel }}</span>
            <br>
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="电子邮箱"
          width="180"
          prop="email"
        />
        <el-table-column
          label="其他联系方式"
          width="180"
          prop="sns"
        />

        <el-table-column
          label="地址"
          min-width="180"
          prop="address"
        />

        <el-table-column
          label="最后更新"
          width="170"
          prop="updateTime"
        />
        <el-table-column
          label="操作"
          width="130"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="medium"
              @click="editPerson(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="medium"
              @click="deletePerson(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="activeName === '2'">
      <el-row>
        <el-col :span="2">
          <el-button
            icon="el-icon-circle-plus-outline"
            type="text"
            size="small"
            @click="addAdress"
          >
            新增地址
          </el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="addressLoading"
        :data="addressData"
        height="calc(100vh - 313px)"
        style="width: 100%;margin: 10px 0;"
        border
      >
        <el-table-column
          label="默认"
          width="80"
        >
          <template slot-scope="scope">
            <el-radio
              v-model="tableAddressRadio"
              :label="scope.row.id"
              @change.native="getAddressRow(scope.$index,scope.row)"
            >
              &nbsp;
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          label="地址类型"
          width="100"
          :formatter="formatAddress"
        />
        <el-table-column
          label="地址名称"
          width="150"
          prop="name"
        />

        <el-table-column
          label="所在国家"
          min-width="120"
          prop="countryName"
        />

        <el-table-column
          label="州省市区"
          min-width="200"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-show="!!scope.row.stateName">
              {{ scope.row.stateName }}
            </span>
            <span v-show="!!scope.row.cityName">
              > {{ scope.row.cityName }}
            </span>
            <span v-show="!!scope.row.countyName">
              > {{ scope.row.countyName }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          label="地址"
          min-width="180"
          prop="address"
        />

        <el-table-column
          label="关联对接人"
          width="150"
          prop="contactName"
        />
        <el-table-column
          label="最后更新"
          width="170"
          prop="updateTime"
        />
        <el-table-column
          label="操作"
          width="130"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="medium"
              @click="editAddress(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="medium"
              @click="deleteAddress(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 我的设置 -->
    <div v-show="activeName === '3'">
      <el-row>
        <el-col :span="2">
          <el-button
            icon="el-icon-circle-plus-outline"
            type="text"
            size="small"
            @click="addSetting"
          >
            新增设置
          </el-button>
        </el-col>
        <el-col
          :span="22"
          style="text-align:right;"
        >
          <el-select
            v-model="settingSearch.type"
            placeholder="类型"
            size="small"
            clearable
            style="width:100px;margin-right:5px;"
          >
            <el-option
              v-for="item in settingTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="settingSearch.serviceCountryId"
            placeholder="服务国家"
            style="width:130px;margin-right:5px;"
            size="small"
            filterable
            clearable
            @focus="getCountryList"
          >
            <el-option
              v-for="item in countryList"
              :key="item.id"
              :label="`${item.name}-${item.alias}`"
              :value="item.id"
            />
          </el-select>
          <el-button
            type="primary"
            size="small"
            @click="getSettingData"
          >
            查询
          </el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="settingLoading"
        :data="settingData"
        height="calc(100vh - 313px)"
        style="width: 100%;margin: 10px 0;"
        border
      >
        <!-- <el-table-column
          label="默认"
          width="80"
        >
          <template slot-scope="scope">
            <el-radio
              v-model="tableSettingRadio"
              :label="scope.row.id"
              @change.native="getSettingRow(scope.$index,scope.row)"
            >
              &nbsp;
            </el-radio>
          </template>
        </el-table-column> -->
        <el-table-column
          label="类型"
          width="100"
          :formatter="formatSettingType"
        />
        <el-table-column
          label="联系人"
          width="120"
          prop="contact"
        />

        <el-table-column
          label="所在国家"
          min-width="120"
          prop="countryName"
        />

        <el-table-column
          label="州省市区"
          min-width="200"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-show="!!scope.row.stateName">
              {{ scope.row.stateName }}
            </span>
            <span v-show="!!scope.row.cityName">
              > {{ scope.row.cityName }}
            </span>
            <span v-show="!!scope.row.countyName">
              > {{ scope.row.countyName }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          label="公司名称"
          min-width="120"
          prop="company"
        />
        <el-table-column
          label="联系电话"
          width="150"
          prop="phone"
        />
        <el-table-column
          label="电子邮箱"
          width="150"
          prop="email"
        />
        <el-table-column
          label="联系地址"
          min-width="180"
          prop="address"
        />
        <el-table-column
          label="是否有效"
          width="90"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row.status === '1' ? '有效': '无效' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="最后更新"
          width="170"
          prop="updateTime"
        />
        <el-table-column
          label="操作"
          width="130"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="medium"
              @click="editSetting(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="medium"
              @click="deleteSetting(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 收款信息 -->
    <div v-show="activeName === '4'">
      <el-row>
        <el-col :span="2">
          <el-button
            icon="el-icon-circle-plus-outline"
            type="text"
            size="small"
            @click="addCollection"
          >
            新增收款信息
          </el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="collectionLoading"
        :data="collectionData"
        height="calc(100vh - 313px)"
        style="width: 100%;margin: 10px 0;"
        border
      >
        <el-table-column
          label="收款方式"
          min-width="100"
          :formatter="formatType"
          prop="type"
        />
        <el-table-column
          label="国家/地区"
          min-width="120"
          prop="countryName"
        />

        <el-table-column
          label="币种"
          width="120"
          prop="currencyName"
        />

        <el-table-column
          label="收款账号"
          min-width="120"
          prop="acctNo"
        />

        <el-table-column
          label="SWIFT Code"
          width="180"
          prop="swiftCode"
        />

        <el-table-column
          label="备注信息"
          width="200"
          prop="remark"
          show-overflow-tooltip
        />
        <el-table-column
          label="最后更新"
          width="170"
          prop="updateTime"
        />
        <el-table-column
          label="附件"
          width="100"
          prop="attach"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="medium"
              @click="preview(scope.row.attach, true)"
            >
              预览
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="130"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="medium"
              @click="editCollection(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="medium"
              @click="deleteCollection(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 开票信息 -->
    <div v-show="activeName === '5'">
      <el-row>
        <el-col :span="2">
          <el-button
            icon="el-icon-circle-plus-outline"
            type="text"
            size="small"
            @click="addBill"
          >
            新增开票信息
          </el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="billLoading"
        :data="billInfoData"
        height="calc(100vh - 313px)"
        style="width: 100%;margin: 10px 0;"
        border
      >
        <el-table-column
          label="开票名称"
          min-width="120"
          prop="name"
        />
        <el-table-column
          label="纳税识别号"
          width="180"
          prop="taxId"
        />

        <el-table-column
          label="开户银行"
          width="180"
          prop="bank"
        />

        <el-table-column
          label="国家/地区"
          min-width="120"
          prop="countryName"
        />

        <el-table-column
          label="币种"
          min-width="120"
          prop="currencyName"
        />

        <el-table-column
          label="每月额度"
          min-width="120"
          prop="amount"
        />
        <el-table-column
          label="备注信息"
          width="200"
          prop="remark"
          show-overflow-tooltip
        />
        <el-table-column
          label="最后更新"
          width="170"
          prop="updateTime"
        />
        <el-table-column
          label="操作"
          width="130"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="medium"
              @click="editBill(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="medium"
              @click="deleteBill(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 文件列表 -->
    <div v-show="activeName === '6'">
      <el-row>
        <el-col :span="2">
          <el-button
            icon="el-icon-circle-plus-outline"
            type="text"
            size="small"
            @click="addFileData"
          >
            新增上传文件
          </el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="fileLoading"
        :data="fileInfoData"
        height="calc(100vh - 313px)"
        style="width: 100%;margin: 10px 0;"
        border
      >
        <el-table-column
          label="文件名称"
          min-width="100"
          prop="name"
        />
        <el-table-column
          label="文件类型"
          width="150"
          :formatter="formatFileType"
        />

        <el-table-column
          label="编码/ID"
          min-width="150"
          prop="code"
        />

        <el-table-column
          label="文件描述"
          min-width="150"
          prop="des"
        />
        <el-table-column
          label="最后更新"
          width="170"
          prop="updateTime"
        />
        <el-table-column
          label="操作"
          width="150"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="medium"
              @click="previewFile(scope.row)"
            >
              预览
            </el-button>
            <el-button
              type="text"
              size="medium"
              @click="editFile(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="medium"
              @click="deleteFile(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <add-edit-person
      ref="addEditPerson"
      :is-person-form-show="isPersonFormShow"
      :is-edit="isPersonEdit"
      :person-form="personForm"
      :is-person-form-loading="isPersonFormLoading"
      :country-list="countryList"
      @savePersonConfirm="savePersonConfirm"
      @closePersonForm="closePersonForm"
    />
    <!-- 新增编辑地址 -->
    <add-edit-address
      ref="addEditAddress"
      :is-address-form-show="isAddressFormShow"
      :is-edit="isAddressEdit"
      :country-list="countryList"
      :type-list="typeList"
      :person-data="personData"
      @saveAddressConfirm="saveAddressConfirm"
      @closeAddressForm="closeAddressForm"
    />
    <!-- 收款信息 -->
    <add-edit-collection
      ref="addEditCollection"
      :is-collection-form-show="isCollectionFormShow"
      :is-edit="isCollectionEdit"
      :collection-form="collectionForm"
      :is-collection-form-loading="isCollectionFormLoading"
      :country-list="countryList"
      :payway-list="paywayList"
      :currency-list="currencyList"
      :current-cust-type="currentCustType"
      @saveCollectionConfirm="saveCollectionConfirm"
      @closeCollectionForm="closeCollectionForm"
    />
    <!-- 开票信息 -->
    <add-edit-bill
      ref="addEditBill"
      :is-bill-form-show="isBillFormShow"
      :is-edit="isBillEdit"
      :bill-form="billForm"
      :is-bill-form-loading="isBillFormLoading"
      :country-list="countryList"
      :bill-data="billInfoData"
      :currency-list="currencyList"
      @saveBillConfirm="saveBillConfirm"
      @closeBillForm="closeBillForm"
    />

    <!-- 开票信息 -->
    <add-edit-file
      ref="addEditFile"
      :is-file-form-show.sync="isFileFormShow"
      :is-edit="isFileEdit"
      :file-form="fileForm"
      :is-file-form-loading="isFileFormLoading"
      :country-list="countryList"
      :currency-list="currencyList"
      :current-cust-type="currentCustType"
      :file-type-list="fileTypeList"
      @saveFileConfirm="saveFileConfirm"
      @closeFileForm="closeFileForm"
    />

    <!-- 我的设置 -->
    <add-edit-setting
      ref="addEditSetting"
      :is-setting-form-show.sync="isSettingFormShow"
      :is-edit="isSettingEdit"
      :country-list="countryList"
      :current-cust-type="currentCustType"
      :setting-type-list="settingTypeList"
      @saveSettingConfirm="saveSettingConfirm"
      @closeSettingForm="closeSettingForm"
    />
    <el-dialog
      :visible.sync="isPreviewShow"
      :close-on-click-modal="false"
      width="800px"
      @closed="onClose"
    >
      <div v-loading="imgLoading">
        <img
          :src="previewImgUrl"
          style="display: block;height: 100%;width: 100%;object-fit: contain;"
        >
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      append-to-body
      destroy-on-close
      width="500px"
      @close="dialogImageUrl = ''"
    >
      <div
        v-loading="imgLoading"
        style="min-width: 100px;"
      >
        <img
          v-if="!dialogImageError"
          width="100%"
          :src="dialogImageUrl"
          @error="loadDialogImageError"
        >
        <img
          v-else
          width="100%"
          :src="dialogImageUrl"
          alt=""
        >
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'

import {
  getCountryList,
  getPersonData,
  savePersonData,
  queryPersonDetail,
  deletePersonData,
  getAddressData,
  saveAddressData,
  getAddressDetail,
  deleteAddressData,
  setDefaultAddress,
  getBillData,
  saveBillData,
  getCurrencyList,
  getBillDetail,
  deleteBillData,
  getCollectionData,
  saveCollectionData,
  getCollectionDetail,
  deleteCollectionData,
  getFileData,
  saveFileData,
  getFilePath,
  getFileDetail,
  deleteFileData,
  getSettingData,
  saveSettingData,
  deleteSettingData,
  setDefaultSetting,
  getSettingDetail
} from '@/api/jht-supplier-management'

import AddEditPerson from '@/views/organizers-management/common-setting/more/addEditPerson.vue'
import AddEditAddress from '@/views/organizers-management/common-setting/more/addEditAddress.vue'
import AddEditBill from '@/views/organizers-management/common-setting/more/addEditBill.vue'
import AddEditCollection from '@/views/organizers-management/common-setting/more/addEditCollection.vue'
import AddEditFile from '@/views/organizers-management/common-setting/more/addEditFile.vue'
import AddEditSetting from '@/views/organizers-management/common-setting/more/addEditSetting.vue'

function personFormParam() {
  return {
    name: undefined, // 联系人姓名
    alias: undefined, // 英文姓名
    dept: undefined, // 所属部门名称
    duty: undefined, // 职务名称
    countryId: undefined, // 国家地区
    phone: undefined, // 手机号
    tel: undefined, // 联系号码
    email: undefined, // 邮箱
    fax: undefined, // 传真
    sns: undefined, // 其他联系方式
    address: undefined, // 联系地址
    remark: undefined
  }
}

function billFormParam() {
  return {
    name: undefined, // 开票名称
    taxId: undefined, // 纳税识别号
    bank: undefined, // 开户银行
    amount: undefined, // 每月额度
    countryId: undefined, // 国家名称
    currencyId: undefined, //  货币ID
    remark: undefined // 备注
  }
}

function collectionFormParam() {
  return {
    countryId: undefined, // 国家
    currencyId: undefined, // 货币
    type: undefined, // 收款方式
    acctName: undefined, // 账户名称
    acctNo: undefined, // 收款账户
    attach: undefined, // 上传文件地址
    remark: undefined, // 备注
    bankName: undefined, // 银行名称
    bankAlias: undefined, // 银行英文名称
    bankCode: undefined, // 银行代码
    branchCode: undefined, // 分行代码
    bankAddress: undefined, // 银行地址
    swiftCode: undefined // 银行地址
  }
}

function fileFormParam() {
  return {
    type: undefined, // 文件类型
    name: undefined, // 文件名称
    code: undefined, // 编码/ID
    path: undefined, // 文件路径
    des: undefined // 文件描述
  }
}

@Component({
  name: 'CommonSettingMore',
  components: {
    AddEditPerson,
    AddEditAddress,
    AddEditBill,
    AddEditCollection,
    AddEditFile,
    AddEditSetting
  },
  props: {
    currentCustId: {
      type: String,
      default: ''
    },
    currentCustType: {
      type: String,
      default: ''
    }
  }
})
export default class extends Vue {
  private loading = false
  private dialogVisible = false
  private dialogImageError: boolean = false
  private dialogLoading = false
  private isEditPerson:boolean = false
  private isAddressFormShow:boolean = false
  private isAddressEdit:boolean = false
  private isSettingFormShow:boolean = false
  private isFileFormShow:boolean = false
  private isFileEdit:boolean = false
  private isSettingEdit:boolean = false
  private isCollectionEdit:boolean = false
  private isCollectionFormShow:boolean = false
  private isCollectionFormLoading:boolean = false
  private isPersonFormShow:boolean = false
  private isPersonEdit:boolean = false
  private isPersonFormLoading:boolean = false
  private isFileFormLoading:boolean = false
  private personLoading:boolean = false
  private addressLoading:boolean = false
  private billLoading:boolean = false
  private fileLoading:boolean = false
  private isBillEdit:boolean = false
  private isBillFormShow:boolean = false
  private isBillFormLoading:boolean = false
  private collectionLoading:boolean = false
  private settingLoading:boolean = false
  private isPreviewShow:boolean = false
  private isPanelLoading:boolean = false
  private imgLoading:boolean = false

  private currentBillId:any = ''
  private currentFileId:any = ''
  private currentPersonId:string = ''
  private currentAddressId:string = ''
  private currentCollectionId:string = ''
  private currentSettingId:string = ''
  private previewImgUrl:string = ''
  private dialogImageUrl:string = ''
  private personForm = personFormParam()
  private billForm = billFormParam()
  private collectionForm = collectionFormParam()
  private fileForm = fileFormParam()

  private list:any[] = []
  private personData:any[] = []
  private collectionData:any[] = []
  private billInfoData:any[] = []
  private currencyList:any[] = []
  private fileInfoData:any[] = [] // 文件信息
  private addressData:any[] = []
  private settingData:any = []
  private settingSearch: any = {
    type: undefined,
    serviceCountryId: undefined
  }

  private paywayList:any = [
    {
      value: '0',
      label: '银行卡'
    },
    {
      value: '1',
      label: '微信'
    },
    {
      value: '2',
      label: '支付宝'
    },
    {
      value: '3',
      label: 'PayPal'
    },
    {
      value: '4',
      label: '其它'
    }
  ]
  private settingTypeList: any[] = [
    {
      value: '0',
      label: '发货人'
    },
    {
      value: '1',
      label: '收货人'
    },
    {
      value: '2',
      label: '通知人'
    },
    {
      value: '3',
      label: '进口商'
    },
    {
      value: '4',
      label: '海外代理'
    },
    {
      value: '5',
      label: '订舱代理'
    },
    {
      value: '6',
      label: '报关抬头'
    }
  ]
  private fileTypeList:any[] = [
    {
      label: '电子合同',
      value: '0'
    },
    {
      label: '营业执照',
      value: '1'
    },
    {
      label: '身份证正面',
      value: '2'
    },
    {
      label: '身份证反面',
      value: '3'
    },
    {
      label: 'WCA证书',
      value: '4'
    },
    {
      label: 'ITAT证书',
      value: '5'
    },
    {
      label: 'NVOCC证书',
      value: '6'
    },
    {
      label: '其它类型',
      value: 'Z'
    }
  ]
  private statusList: any = [
    {
      label: '启用',
      value: '1'
    },
    {
      label: '禁用',
      value: '0'
    }
  ]

  private certTypeList: any = [
    {
      label: '身份证',
      value: '0'
    },
    {
      label: '其他',
      value: '1'
    }
  ]

  private branchTypeList: any = [
    {
      label: '总部',
      value: '0'
    },
    {
      label: '分公司',
      value: '1'
    }
  ]
    private typeList:any = [
      {
        label: '办公室',
        value: '0'
      },
      {
        label: '客服部',
        value: '1'
      },
      {
        label: '提货仓库',
        value: '2'
      },
      {
        label: '到货仓库',
        value: '3'
      }
    ]
  private countryList: any = []
  private tableAddressRadio:any = ''
  private tableSettingRadio:any = ''

  private dialogShow = false
  private activeName = '1'

  private page: number = 1
  private size: number = 10
  private total: any = 0

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

  /* methods */
  // 新增供应商

  private getPersonData() {
    this.personLoading = true
    const params = {
      custId: (this as any).currentCustId
    }
    getPersonData(params).then(res => {
      this.personLoading = false
      this.personData = res.data.result || []
    }).catch(err => {
      this.personLoading = false
      return err
    })
  }
  // 保存人员编辑
  private savePersonConfirm() {
    const addEditPerson:any = this.$refs.addEditPerson
    const editDom = addEditPerson.$refs.editForm
    editDom.validate((valid:any) => {
      if (valid) {
        this.isPersonFormLoading = true
        const params:any = {
          ...this.personForm,
          custId: (this as any).currentCustId,
          id: this.isPersonEdit ? this.currentPersonId : undefined
        }
        this.countryList.find((item:any) => {
          if (item.id === params.countryId) {
            params.countryName = item.name
          }
        })
        savePersonData(params).then(res => {
          this.isPersonFormLoading = false
          this.$message.success('保存成功')
          this.closePersonForm()
          this.getPersonData()
        }).catch(err => {
          this.isPersonFormLoading = false
          return err
        })
      } else {
        return false
      }
    })
  }
  // 保存地址
  private saveAddressConfirm(data: any) {
    const root:any = this.$refs.addEditAddress
    root.isAddressFormLoading = true
    const params:any = {
      ...data,
      custId: (this as any).currentCustId,
      id: this.isAddressEdit ? this.currentAddressId : undefined
    }

    this.personData.find((item:any) => {
      if (item.id === params.contactId) {
        params.contactName = item.name
      }
    })
    this.typeList.find((item:any) => {
      if (item.value === params.type) {
        params.typeName = item.label
      }
    })

    saveAddressData(params).then(res => {
      root.isAddressFormLoading = false
      this.$message.success('保存成功')
      this.closeAddressForm()
      this.getAddressData()
    }).catch((err:any) => {
      root.isAddressFormLoading = false
      return err
    })
  }
  //  我的设置保存
  private saveSettingConfirm(data: any) {
    const root:any = this.$refs.addEditSetting
    root.isSettingFormLoading = true
    const params:any = {
      ...data,
      open: data.type === '3' ? data.open : undefined,
      custId: (this as any).currentCustId,
      id: this.isSettingEdit ? this.currentSettingId : undefined
    }
    saveSettingData(params).then(res => {
      root.isSettingFormLoading = false
      this.$message.success('保存成功')
      this.closeSettingForm()
      this.getSettingData()
    }).catch((err:any) => {
      root.isSettingFormLoading = false
      return err
    })
  }
  // 保存开票信息
  private saveBillConfirm() {
    const addEditBill:any = this.$refs.addEditBill
    const editDom = addEditBill.$refs.editForm
    editDom.validate((valid:any) => {
      if (valid) {
        this.isBillFormLoading = true
        const params:any = {
          ...this.billForm,
          custId: (this as any).currentCustId,
          id: this.isBillEdit ? this.currentBillId : undefined
        }
        this.countryList.find((item:any) => {
          if (item.id === params.countryId) {
            params.countryName = item.name
          }
        })
        this.currencyList.find(item => {
          if (item.id === params.currencyId) {
            params.currencyName = item.name
          }
        })
        saveBillData(params).then(res => {
          this.isBillFormLoading = false
          this.$message.success('保存成功')
          this.closeBillForm()
          this.getBillData()
        }).catch(err => {
          this.isBillFormLoading = false
          return err
        })
      } else {
        return false
      }
    })
  }
  // 保存文件
  private saveFileConfirm() {
    this.isFileFormLoading = true
    const params = {
      ...this.fileForm,
      custId: (this as any).currentCustId,
      id: this.isFileEdit ? this.currentFileId : undefined
    }
    saveFileData(params).then(res => {
      this.$message.success('保存成功')
      this.isFileFormLoading = false
      this.closeFileForm()
      this.getFileData()
    }).catch(err => {
      this.isFileFormLoading = false
      return err
    })
  }
  // 保存收款信息
  private saveCollectionConfirm() {
    this.isCollectionFormLoading = true
    const params:any = {
      ...this.collectionForm,
      custId: (this as any).currentCustId,
      id: this.isCollectionEdit ? this.currentCollectionId : undefined
    }
    this.countryList.find((item:any) => {
      if (item.id === params.countryId) {
        params.countryName = item.name
      }
    })
    this.currencyList.find(item => {
      if (item.id === params.currencyId) {
        params.currencyName = item.name
      }
    })
    saveCollectionData(params).then(res => {
      this.isCollectionFormLoading = false
      this.$message.success('保存成功')
      this.closeCollectionForm()
      this.getCollectionData()
    }).catch(err => {
      this.isCollectionFormLoading = false
      return err
    })
  }
  // 获取货币列表
  private geCurrencyList() {
    const params = {
      page: 1,
      size: 100
    }
    getCurrencyList(params).then((res:any) => {
      this.currencyList = res.data.result
    }).catch((err:any) => {
      return err
    })
  }
  // 获取地址信息
  private getAddressData() {
    this.addressLoading = true
    const params = {
      custId: (this as any).currentCustId
    }
    getAddressData(params).then(res => {
      this.addressLoading = false
      const result = res.data.result || []
      this.addressData = result
      result.forEach((item:any) => {
        if (item.def) {
          this.tableAddressRadio = item.id
        }
      })
    }).catch(err => {
      this.addressLoading = false
      return err
    })
  }
  // 获取我的设置数据
  private getSettingData() {
    this.settingLoading = true
    const params = {
      custId: (this as any).currentCustId,
      ...this.settingSearch,
      page: 1,
      size: 999
    }
    getSettingData(params).then(res => {
      this.settingLoading = false
      const result = res.data.result || []
      this.settingData = result
      // result.forEach((item:any) => {
      //   if (item.def) {
      //     this.tableSettingRadio = item.id
      //   }
      // })
    }).catch(err => {
      this.settingLoading = false
      return err
    })
  }
  // 获取地址信息
  private getBillData() {
    this.billLoading = true
    const params = {
      custId: (this as any).currentCustId
    }
    getBillData(params).then(res => {
      this.billLoading = false
      this.billInfoData = res.data.result || []
    }).catch(err => {
      this.billLoading = false
      return err
    })
  }
  private getCollectionData() {
    this.collectionLoading = true
    const params = {
      custId: (this as any).currentCustId
    }
    getCollectionData(params).then(res => {
      this.collectionLoading = false
      this.collectionData = res.data.result || []
    }).catch(err => {
      this.collectionLoading = false
      return err
    })
  }
  // 关闭人员弹窗
  private closePersonForm() {
    this.isPersonFormShow = false
    this.resetPersonData()
  }
  // 重置人员编辑表单信息
  private resetPersonData() {
    this.personForm = personFormParam()
    this.$nextTick(() => {
      const addEditPerson:any = this.$refs.addEditPerson
      const editDom = addEditPerson.$refs.editForm
      editDom.clearValidate()
    })
  }

  // 初始化
  private resetInitData() {
    this.activeName = '1'
  }
  // 关闭人员弹窗
  private closeAddressForm() {
    this.resetAddressData()
  }
  private closeSettingForm() {
    this.resetSettingData()
  }
  private closeBillForm() {
    this.isBillFormShow = false
    this.resetBillData()
  }
  private closeFileForm() {
    this.isFileFormShow = false
    this.resetFileData()
  }
  private resetSettingData() {
    const root:any = this.$refs.addEditSetting
    this.isSettingFormShow = false
    root.reset()
  }
  private resetFileData() {
    this.fileForm = fileFormParam()
    this.$nextTick(() => {
      const addEditFile:any = this.$refs.addEditFile
      const editDom = addEditFile.$refs.editForm
      addEditFile.fileList = []
      editDom.clearValidate()
    })
  }
  private resetBillData() {
    this.billForm = billFormParam()
    this.$nextTick(() => {
      const addEditBill:any = this.$refs.addEditBill
      const editDom = addEditBill.$refs.editForm
      editDom.clearValidate()
    })
  }
  private closeCollectionForm() {
    this.isCollectionFormShow = false
    this.resetCollectionData()
  }
  private resetCollectionData() {
    this.collectionForm = collectionFormParam()
    this.$nextTick(() => {
      const addEditBill:any = this.$refs.addEditCollection
      const editDom = addEditBill.$refs.editForm
      editDom.clearValidate()
    })
  }
  // 重置地址
  private resetAddressData() {
    const root:any = this.$refs.addEditAddress
    this.isAddressFormShow = false
    root.reset()
  }
  // 添加人员
  private addPerson() {
    this.isPersonFormShow = true
    this.isPersonEdit = false
  }
  private addAdress() {
    this.isAddressFormShow = true
    this.isAddressEdit = false
  }
  private addSetting() {
    this.isSettingFormShow = true
    this.isSettingEdit = false
  }
  private addFileData() {
    this.isFileFormShow = true
    this.isFileEdit = false
  }
  private addCollection() {
    this.isCollectionFormShow = true
    this.isCollectionEdit = false
  }
  // 新增开票信息
  private addBill() {
    this.isBillFormShow = true
    this.isBillEdit = false
  }
  // 编辑票据
  private editBill(row:any) {
    this.isBillEdit = true
    this.isBillFormShow = true
    this.isBillFormLoading = true
    this.currentBillId = row.id
    const params = {
      id: row.id
    }
    getBillDetail(params).then(res => {
      const result = res.data.result || {}
      this.billForm = result
      this.isBillFormLoading = false
    }).catch(err => {
      return err
    })
  }
  // 编辑文件
  private editFile(row:any) {
    this.isFileEdit = true
    this.isFileFormShow = true
    this.isFileFormLoading = true
    this.currentFileId = row.id
    const params = {
      id: row.id
    }
    getFileDetail(params).then(res => {
      const result = res.data.result || {}
      this.fileForm = result
      this.$nextTick(() => {
        const path = result.path
        const splitArr = path.split('/') || []
        const addEditFile:any = this.$refs.addEditFile
        const arr:any = [{
          name: path ? splitArr[splitArr.length - 1] : '',
          url: path
        }]
        addEditFile.fileList = arr || []
      })
      this.isFileFormLoading = false
    }).catch(err => {
      return err
    })
  }
  //  编辑收款信息
  private editCollection(row:any) {
    this.isCollectionEdit = true
    this.isCollectionFormShow = true
    this.isCollectionFormLoading = true
    this.currentCollectionId = row.id
    const params = {
      id: row.id
    }
    getCollectionDetail(params).then(res => {
      const result = res.data.result || {}
      this.collectionForm = result
      this.$nextTick(() => {
        const path = result.attach
        const splitArr = path.split('/') || []
        const addEditCollection:any = this.$refs.addEditCollection
        const arr:any = [{
          name: path ? splitArr[splitArr.length - 1] : '',
          url: path
        }]
        addEditCollection.fileList = arr || []
      })
      this.isCollectionFormLoading = false
    }).catch(err => {
      return err
    })
  }
  private editSetting(row:any) {
    this.isSettingEdit = true
    this.isSettingFormShow = true
    this.currentSettingId = row.id
    const root:any = this.$refs.addEditSetting
    root.setData(row)
  }
  // 编辑地址
  private async editAddress(row:any) {
    this.isAddressEdit = true
    this.isAddressFormShow = true
    this.currentAddressId = row.id
    const root:any = this.$refs.addEditAddress
    root.setData(row)
  }
  // 编辑人员
  private editPerson(row:any) {
    this.isPersonEdit = true
    this.isPersonFormShow = true
    this.isPersonFormLoading = true
    const { id } = row
    this.currentPersonId = id
    const params = {
      id
    }
    queryPersonDetail(params).then(res => {
      this.isPersonFormLoading = false
      this.personForm = res.data.result || []
    }).catch(err => {
      this.isPersonFormLoading = false
      return err
    })
  }

  private deleteCollection(row:any) {
    const params = {
      id: row.id
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteCollectionData(params).then(res => {
          this.$message.success('删除成功')
          this.getCollectionData()
        }).catch(err => {
          return err
        })
        this.$deleteLoad(row.attach, true)
          .then((res: any) => {
            // this.$message.success(`删除成功`)
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }
  // 删除人员信息
  private deletePerson(row:any) {
    const params = {
      id: row.id
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deletePersonData(params).then(res => {
          this.$message.success('删除成功')
          this.getPersonData()
        }).catch(err => {
          return err
        })
      })
      .catch(() => {
        return false
      })
  }
  private formatAddress(row:any) {
    const targetData = this.typeList.find((item:any) => {
      return item.value === row.type
    })
    return targetData ? targetData.label : ''
  }
  // 格式化我的设置类型
  private formatSettingType(row:any) {
    const targetData = this.settingTypeList.find((item:any) => {
      return item.value === row.type
    })
    return targetData ? targetData.label : ''
  }
  // 删除地址信息
  private deleteAddress(row:any) {
    const params = {
      id: row.id
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteAddressData(params).then(res => {
          this.$message.success('删除成功')
          this.getAddressData()
        }).catch(err => {
          return err
        })
      })
      .catch(() => {
        return false
      })
  }
  // 删除开票信息
  private deleteBill(row:any) {
    const params = {
      id: row.id
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteBillData(params).then(res => {
          this.$message.success('删除成功')
          this.getBillData()
        }).catch(err => {
          return err
        })
      })
      .catch(() => {
        return false
      })
  }
  // 删除文件信息
  private deleteFile(row:any) {
    const params = {
      id: row.id
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteFileData(params).then(res => {
          this.$message.success('删除成功')
          this.getFileData()
        }).catch(err => {
          return err
        })
        this.$deleteLoad(row.path, true)
          .then((res: any) => {
            // this.$message.success(`删除成功`)
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }
  // 删除设置
  private deleteSetting(row:any) {
    const params = {
      id: row.id
    }
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteSettingData(params).then(res => {
          this.$message.success('删除成功')
          this.getSettingData()
        }).catch(err => {
          return err
        })
        this.$deleteLoad(row.photo, true)
          .then((res: any) => {
            // this.$message.success(`删除成功`)
          })
          .catch((err: any) => {
            return err
          })
      })
      .catch(() => {
        return false
      })
  }

  private handleClick(tab:any, event:any) {
    switch (this.activeName) {
      case '1':
        this.getPersonData()
        break
      case '2':
        this.getAddressData()
        break
      case '3':
        this.getSettingData()
        break
      case '4':
        this.getCollectionData()
        break
      case '5':
        this.getBillData()
        break
      case '6':
        this.getFileData()
        break
      default:
        break
    }
  }
  private formatType(row:any) {
    const { type } = row
    const targetInfo = this.paywayList.find((item:any) => item.value === type) || {}
    return targetInfo.label
  }
  private previewFile(row: any) {
    if (!row.name) {
      this.$message.error('暂无附件可预览')
      return
    }
    getFilePath({
      path: row.path
    }).then((res: any) => {
      window.open(res.data)
    }).catch((err: any) => {
      return err
    })
  }
  private loadDialogImageError() {
    if (this.dialogImageError) return
    if (!this.dialogVisible) return
    this.dialogImageError = true
    this.imgLoading = true
    getFilePath({
      path: this.dialogImageUrl.replace(process.env.VUE_APP_OSS_PATH || '', '')
    }).then((res: any) => {
      this.dialogImageUrl = res.data
      this.imgLoading = false
    }).catch((err: any) => {
      this.imgLoading = false
      return err
    })
  }
  private preview(val:any, bool: any) {
    if (!val) {
      this.$message.error('暂无附件可预览')
      return
    }
    if (bool) {
      this.previewImgUrl = process.env.VUE_APP_OSS_PATH + val
      this.isPreviewShow = true
      return
    }
    this.imgLoading = true
    getFilePath({
      path: val
    }).then((res: any) => {
      this.isPreviewShow = true
      this.previewImgUrl = res.data
      window.setTimeout(() => {
        this.imgLoading = false
      }, 500)
    }).catch((err: any) => {
      this.imgLoading = false
      return err
    })
  }
  private onClose() {
    this.isPreviewShow = false
    this.previewImgUrl = ''
    window.clearTimeout()
  }
  private getAddressRow(index:any, row:any) { // 获取选中数据+
    // console.log('tableAddressRadio', this.tableAddressRadio)
    const { id } = row
    const params = {
      custId: (this as any).currentCustId,
      id
    }
    setDefaultAddress(params).then(res => {
      this.$message.success('操作成功')
    }).catch(err => {
      return err
    })
    // console.log('row', row)
    // this.templateSelection = row
  }
  // 设置默认的设置
  private getSettingRow(index:any, row:any) {
    const { id } = row
    const params = {
      custId: (this as any).currentCustId,
      id
    }
    setDefaultSetting(params).then(res => {
      this.$message.success('操作成功')
    }).catch(err => {
      return err
    })
  }
  private formatFileType(row:any) {
    const { type } = row
    const targetInfo = this.fileTypeList.find(item => item.value === type) || {}
    return targetInfo.label
  }
  private getFileData() {
    this.fileLoading = true
    const params = {
      custId: (this as any).currentCustId
    }
    getFileData(params).then(res => {
      this.fileLoading = false
      this.fileInfoData = res.data.result || []
    }).catch(err => {
      this.fileLoading = false
      return err
    })
  }
  // 获取国家列表
  private getCountryList() {
    getCountryList()
      .then((res: any) => {
        const data = res.data || {}
        this.countryList = data.result || []
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private init(): void {
    this.getPersonData()
    this.getCountryList()
    this.geCurrencyList()
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep{
    .el-tabs__item{
      height: 60px;
      line-height: 60px;
    }
  }
</style>
