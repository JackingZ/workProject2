<template>
  <div
    v-loading="formLoading"
    class="app-panel privateline-edit"
  >
    <div class="header-top">
      <div
        style="float: left;"
      >
        {{ isEdit && !isCopy ? '编辑专线服务' : '新增专线服务' }}
      </div>
      <el-button
        type="primary"
        size="small"
        @click="handleBack"
      >
        返 回
      </el-button>
      <el-button
        type="primary"
        size="small"
        @click="handleSave"
      >
        保 存
      </el-button>
    </div>
    <div class="content">
      <el-form
        ref="selectForm"
        :model="selectForm"
        :rules="formRules"
        label-width="156px"
        class="detail-form"
        size="small"
      >
        <div class="form-title">
          <span>基础信息</span>
        </div>
        <el-form-item
          label="所属产品"
          prop="productId"
        >
          <el-select
            v-model="selectForm.productId"
            placeholder="请选择"
            size="small"
            clearable
            filterable
            style="width:100%;"
          >
            <el-option
              v-for="item in productList"
              :key="item.id"
              :label="item.productName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="服务名称"
          prop="name"
        >
          <el-input
            v-model="selectForm.name"
            :maxlength="50"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="服务简称"
          prop="abbr"
        >
          <el-input
            v-model="selectForm.abbr"
            :maxlength="10"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="服务编码"
          prop="lsId"
        >
          <el-input
            v-model="selectForm.lsId"
            style="width:100%;"
            size="small"
            placeholder="请输入"
            :maxlength="25"
            show-word-limit
          />
        </el-form-item>
        <!-- <el-form-item
          label="关联服务编码"
          prop="lsId"
        >
          <el-select
            v-model="selectForm.lsId"
            placeholder="请选择"
            size="small"
            clearable
            filterable
            style="width:100%;"
            @change="onLsid"
          >
            <el-option
              v-for="item in codeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item
          label="服务类型"
          prop="subtypeId"
        >
          <el-select
            v-model="selectForm.subtypeId"
            placeholder="请选择"
            size="small"
            clearable
            filterable
            style="width:100%;"
            @change="onSubtype"
          >
            <el-option
              v-for="item in subtypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="selectForm.subtypeId === '1' || selectForm.subtypeId === '2'"
          label="业务类型"
          prop="containerType"
        >
          <el-select
            v-model="selectForm.containerType"
            placeholder="请选择"
            size="small"
            clearable
            style="width:100%;"
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="起运国"
          prop="countryId"
        >
          <el-select
            v-model="selectForm.countryId"
            placeholder="起运国"
            filterable
            clearable
            style="width:100%;"
            size="small"
          >
            <el-option
              v-for="item in countryList"
              :key="item.id"
              :label="`${item.name}-${item.alias}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="起运港"
          prop="departureId"
          class="is-required"
        >
          <el-input
            v-model="ss"
            :placeholder="`已选择(${selectForm.departureId.length})`"
            style="width:100%"
            disabled
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handlePort('qi')"
            />
          </el-input>
          <!-- <el-select
            v-model="selectForm.departureId"
            placeholder="请选择"
            size="small"
            clearable
            multiple
            collapse-tags
            style="width:100%;"
          >
            <el-option
              v-for="item in portList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select> -->
        </el-form-item>
        <el-form-item
          label="目的国"
          prop="countryToIds"
        >
          <el-input
            v-model="cc"
            :placeholder="`已选择(${selectForm.countryToIds.length})`"
            size="small"
            style="width:100%"
            disabled
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handleStates"
            />
          </el-input>
        </el-form-item>
        <el-form-item
          v-if="selectForm.subtypeId !== '3'"
          label="目的港"
          prop="destinationId"
          class="is-required"
        >
          <el-input
            v-model="ss"
            :placeholder="`已选择(${selectForm.destinationId.length})`"
            style="width:100%"
            disabled
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handlePort('mu')"
            />
          </el-input>
          <!-- <el-select
            v-model="selectForm.destinationId"
            placeholder="请选择"
            size="small"
            clearable
            multiple
            collapse-tags
            style="width:100%;"
          >
            <el-option
              v-for="item in portList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select> -->
        </el-form-item>
        <!-- <el-form-item
          label="地区"
          prop="region"
        >
          <el-input
            v-model="selectForm.region"
            :maxlength="100"
            size="small"
            placeholder="请输入"
          />
        </el-form-item> -->
        <!-- <el-form-item
          label="交货区域"
          prop="deliveryId"
        >
          <el-select
            v-model="selectForm.deliveryId"
            placeholder="请选择"
            size="small"
            clearable
            filterable
            multiple
            collapse-tags
            style="width:100%;"
          >
            <el-option
              v-for="item in addrList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item
          v-if="selectForm.subtypeId === '1' && selectForm.countryToIds.some((it) => it === 'US')"
          prop="orgTag"
          label="服务机构"
        >
          <el-select
            v-model="selectForm.orgTag"
            placeholder="请选择"
            style="width: 100%"
            filterable
            clearable
          >
            <el-option
              v-for="item in orgList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="目的地类型"
          prop="purposeType"
        >
          <el-select
            v-model="selectForm.purposeType"
            placeholder="请选择"
            style="width: 100%"
            filterable
            clearable
            @change="purposeTypeChange"
          >
            <el-option
              label="FBA"
              :value="0"
            />
            <el-option
              label="私人"
              :value="1"
            />
            <el-option
              label="自有海外仓"
              :value="2"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="配货属性"
          prop="outsourcing"
        >
          <el-radio-group v-model="selectForm.outsourcing">
            <el-radio label="2">
              全部
            </el-radio>
            <el-radio label="0">
              自有
            </el-radio>
            <el-radio label="1">
              外协
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="服务用途"
          prop="usages"
        >
          <el-select
            v-model="selectForm.usages"
            placeholder="请选择"
            size="small"
            clearable
            multiple
            collapse-tags
            style="width:100%;"
          >
            <el-option
              label="服务渠道"
              value="0"
            />
            <el-option
              label="计费渠道"
              value="1"
            />
            <el-option
              label="发货渠道"
              value="2"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="分配客户"
          prop="belong"
        >
          <el-select
            v-model="selectForm.belong"
            placeholder="请选择"
            size="small"
            clearable
            style="width:100%;"
          >
            <el-option
              label="同行&直客"
              value="0"
            />
            <el-option
              label="仅同行"
              value="1"
            />
            <el-option
              label="仅直客"
              value="2"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="货币单位"
          prop="currencyId"
        >
          <el-select
            v-model="selectForm.currencyId"
            clearable
            filterable
            size="small"
            style="width:100%;"
            placeholder="请选择"
          >
            <el-option
              v-for="item in currencyList"
              :key="item.id"
              :label="`${item.name}-${item.sign}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="长度单位"
          prop="umLength"
        >
          <el-select
            v-model="selectForm.umLength"
            style="width:100%;"
            size="small"
            placeholder="请选择"
          >
            <el-option
              label="M-米"
              value="M"
            />
            <el-option
              label="CM-厘米"
              value="CM"
            />
            <el-option
              label="FT-英尺"
              value="FT"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="重量单位"
          prop="umWeight"
        >
          <el-select
            v-model="selectForm.umWeight"
            style="width:100%;"
            size="small"
            placeholder="请选择"
          >
            <el-option
              label="LB-磅"
              value="LBS"
            />
            <el-option
              label="KG-公斤"
              value="KGS"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="体积单位"
          prop="umVolume"
        >
          <el-select
            v-model="selectForm.umVolume"
            style="width:100%;"
            size="small"
            placeholder="请选择"
          >
            <el-option
              label="CBM-立方米"
              value="CBM"
            />
            <el-option
              label="CUFT-立方英尺"
              value="CUFT"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="申报币种"
          prop="declaredCurrency"
        >
          <el-select
            v-model="selectForm.declaredCurrency"
            style="width:100%;"
            size="small"
            placeholder="请选择"
          >
            <el-option
              v-for="item in currencyList"
              :key="item.id"
              :label="`${item.name}-${item.sign}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="单箱最大重量"
          prop="weight"
        >
          <el-input-number
            v-model="selectForm.weight"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="999999"
            :precision="2"
          />
        </el-form-item>
        <el-form-item
          label="单托最大重量"
          prop="singleMaxWeight"
        >
          <el-input-number
            v-model="selectForm.singleMaxWeight"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="999999"
            :precision="2"
          />
        </el-form-item>
        <el-form-item
          label="支持最大体积"
          prop="cubed"
        >
          <el-input-number
            v-model="selectForm.cubed"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="999999"
            :precision="2"
          />
        </el-form-item>
        <el-form-item
          label="单箱最大申报金额"
          prop="maxAmount"
        >
          <el-input-number
            v-model="selectForm.maxAmount"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="999999"
            :precision="2"
          />
        </el-form-item>
        <el-form-item
          label="单票最大货值"
          prop="maxPrice"
        >
          <el-input-number
            v-model="selectForm.maxPrice"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="999999"
            :precision="2"
          />
        </el-form-item>
        <el-form-item
          label="服务条款"
          prop="clause"
        >
          <el-select
            v-model="selectForm.clause"
            placeholder="请选择"
            size="small"
            clearable
            filterable
            style="width:100%;"
          >
            <el-option
              v-for="item in wordsList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="默认供应商"
          size="small"
          prop="custId"
        >
          <el-select
            v-model="selectForm.custId"
            :loading="selectLoading"
            size="small"
            clearable
            filterable
            style="width:100%;"
            placeholder="请选择"
            @focus="getCustTypeList"
          >
            <el-option
              v-for="item in supplierList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
        >
          <el-input
            v-model="selectForm.remark"
            :maxlength="100"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <div class="form-title">
          <span>业务流程</span>
        </div>
        <el-form-item
          label="派件方式"
          prop="dispatch"
        >
          <el-select
            v-model="selectForm.dispatch"
            placeholder="请选择"
            size="small"
            clearable
            style="width:100%;"
            @change="onDispatch"
          >
            <el-option
              v-for="(item, index) in dispatchList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="selectForm.dispatch === '1'"
          label="是否生成转单号"
          prop="isCreate"
        >
          <el-radio-group v-model="selectForm.isCreate">
            <el-radio :label="1">
              是
            </el-radio>
            <el-radio :label="0">
              否
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="是否包税"
          prop="includeTax"
        >
          <el-radio-group v-model="selectForm.includeTax">
            <el-radio :label="false">
              不包税
            </el-radio>
            <el-radio :label="true">
              包税
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="selectForm.subtypeId === '1' || selectForm.subtypeId === '2'"
          label="支持锁舱"
          prop="coverTank"
        >
          <el-radio-group v-model="selectForm.coverTank">
            <el-radio label="0">
              否
            </el-radio>
            <el-radio label="1">
              是
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="商品属性"
          prop="categories"
        >
          <el-select
            v-model="selectForm.categories"
            style="width:100%;"
            size="small"
            clearable
            multiple
            collapse-tags
            placeholder="请选择"
          >
            <el-option
              label="普货"
              value="0"
            />
            <el-option
              label="带电"
              value="1"
            />
            <el-option
              label="纯电"
              value="2"
            />
            <el-option
              label="带磁"
              value="3"
            />
            <el-option
              label="危险"
              value="4"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="计费发票费用组"
          prop="chargeGroupId"
        >
          <el-select
            v-model="selectForm.chargeGroupId"
            placeholder="请选择"
            size="small"
            clearable
            filterable
            style="width:100%;"
          >
            <el-option
              v-for="item in invoiceList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="免赔金额"
          prop="deductibles"
        >
          <el-input-number
            v-model="selectForm.deductibles"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="999999"
            :precision="2"
          />
        </el-form-item>
        <el-form-item
          label="运营成本"
          prop=""
        >
          <div class="input-capacity">
            <div style="flex: 1;">
              <el-input-number
                v-model="selectForm.operatingCosts"
                class="input-number-valiate input-border"
                :controls="false"
                placeholder="请输入"
                :min="0"
                :max="999999"
                :precision="2"
              />
            </div>
            <div class="input-unit">
              <span>元/kg</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item
          label="是否验货"
          prop="examine"
        >
          <el-radio-group
            v-model="selectForm.examine"
            @change="selectForm.examineId = undefined"
          >
            <el-radio :label="false">
              否
            </el-radio>
            <el-radio :label="true">
              是
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="selectForm.examine"
          label="验货配置"
          prop="examineId"
        >
          <el-select
            v-model="selectForm.examineId"
            :loading="selectLoading"
            style="width:100%;"
            size="small"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in examineList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="报关价比率(%)"
          prop="priceC"
        >
          <el-input-number
            v-model="selectForm.priceC"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="100"
            :precision="2"
          />
        </el-form-item>

        <el-form-item
          label="关税预付比率(%)"
          prop="tax"
        >
          <el-input-number
            v-model="selectForm.tax"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="100"
            :precision="2"
          />
        </el-form-item>
        <el-form-item
          label="保险费比率(%)"
          prop="insurance"
        >
          <el-input-number
            v-model="selectForm.insurance"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="100"
            :precision="2"
          />
        </el-form-item>

        <div class="form-title">
          <span>参数&配置</span>
        </div>
        <el-form-item
          label="计费方式"
          prop="priceType"
        >
          <el-select
            v-model="selectForm.priceType"
            placeholder="请选择"
            size="small"
            style="width:100%;"
            @change="onChargeType"
          >
            <el-option
              label="重量计费"
              value="2"
            />
            <el-option
              label="体积计费"
              value="3"
            />
            <el-option
              v-if="selectForm.subtypeId === '1' || selectForm.subtypeId === '2'"
              label="整柜计费"
              value="4"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="selectForm.priceType !== '4' && selectForm.dispatch === '1'"
          label="打单快递服务"
          prop="escs"
          class="is-required"
        >
          <el-input
            v-model="ss"
            :placeholder="`已选择(${selectForm.escs.length})`"
            style="width:100%"
            disabled
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handleExpress"
            />
          </el-input>
        </el-form-item>
        <!-- <el-form-item
          v-if="selectForm.priceType !== '4' && selectForm.dispatch === '1'"
          label="计费快递服务"
          prop="escId"
        >
          <el-select
            v-model="selectForm.escId"
            placeholder="请选择"
            size="small"
            clearable
            filterable
            style="width:100%;"
          >
            <el-option
              v-for="item in expressList"
              :key="item.id"
              :label="item.name"
              :value="Number(item.id)"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item
          label="起运港报关服务"
          prop="cscId"
        >
          <el-select
            v-model="selectForm.cscId"
            placeholder="请选择"
            size="small"
            clearable
            filterable
            style="width:100%;"
          >
            <el-option
              v-for="item in customsList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="selectForm.priceType !== '4'"
          label="起运港卡派服务"
          prop="kscId"
        >
          <el-select
            v-model="selectForm.kscId"
            placeholder="请选择"
            size="small"
            clearable
            filterable
            style="width:100%;"
          >
            <el-option
              v-for="item in cardList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="selectForm.priceType === '2'"
          label="分单重量上限"
          prop="pWeight"
        >
          <el-input-number
            v-model="selectForm.pWeight"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="999999"
            :precision="2"
          />
        </el-form-item>
        <el-form-item
          v-if="selectForm.priceType === '3'"
          label="分单体积上限"
          prop="pVolume"
        >
          <el-input-number
            v-model="selectForm.pVolume"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="999999"
            :precision="2"
          />
        </el-form-item>
        <el-form-item
          v-if="selectForm.priceType !== '4'"
          label="分单HSCODE数限制"
          prop="pHscode"
        >
          <el-input-number
            v-model="selectForm.pHscode"
            class="input-number-valiate"
            :controls="false"
            placeholder="请输入"
            :min="0"
            :max="9999"
            :step="1"
            step-strictly
          />
        </el-form-item>
        <el-form-item
          v-if="selectForm.priceType !== '4'"
          label="是否计量提醒"
          prop="remind"
        >
          <el-radio-group v-model="selectForm.remind">
            <el-radio :label="false">
              否
            </el-radio>
            <el-radio :label="true">
              是
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="form-title">
        <span>运输条款</span>
      </div>
      <div>
        <markdown-editor
          ref="markdownEditor"
          v-model="terms"
          :options="{
            hideModeSwitch: true,
            previewStyle: 'tab',
            toolbarItems: ['heading','bold','italic']
          }"
          height="300px"
        />
      </div>
    </div>

    <el-dialog
      title="关联快递服务"
      :visible.sync="dialogExpress"
      :close-on-click-modal="false"
      width="960px"
      @close="cancelExpress"
    >
      <div v-loading="dialogLoading">
        <el-transfer
          ref="transferItem"
          v-model="expressOption"
          filterable
          :filter-method="filterMethod"
          :titles="['选择快递服务', '已关联快递服务']"
          :props="{key: 'id', label: 'name'}"
          filter-placeholder="输入搜索"
          :data="expressList"
          style="height: 500px;"
        />
        <div
          slot="footer"
          style="text-align: right;margin: 20px 40px 0;"
        >
          <el-button
            size="small"
            @click="cancelExpress"
          >
            取 消
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="saveExpress"
          >
            确 定
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :title="title"
      :visible.sync="dialogPort"
      :close-on-click-modal="false"
      width="960px"
      @close="cancelPort"
    >
      <div v-loading="dialogLoading">
        <el-row
          type="flex"
          :gutter="10"
        >
          <el-col
            :span="8"
            style="margin: 10px 0;"
          >
            <div class="items">
              <div class="items-head">
                已选择
              </div>
              <el-tag
                v-for="(item, index) in portOption"
                :key="index"
                closable
                type="info"
                @close="handleRemove(index, item)"
              >
                {{ (item.code ? item.code + '-' : '') + item.name }}
              </el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <el-row class="filter">
              <el-col style="text-align:right;">
                <el-input
                  v-model="portName"
                  size="small"
                  style="width:130px;"
                  placeholder="请输入名称"
                />
                <el-button
                  type="primary"
                  size="small"
                  @click="getPortData(1)"
                >
                  查询
                </el-button>
              </el-col>
            </el-row>
            <el-table
              ref="theTable"
              :data="portList"
              border
              @select="handleSelect"
              @select-all="handleSelectAll"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                width="55"
              />
              <el-table-column
                prop="name"
                label="地址名称"
              >
                <template slot-scope="scope">
                  {{ (scope.row.code ? scope.row.code + '-' : '') + scope.row.name }}
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              small
              :current-page.sync="page"
              :page-size="size"
              layout="total, prev, pager, next"
              :total="total"
              style="text-align: right;"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-col>
        </el-row>

        <div
          slot="footer"
          style="text-align:right;padding-top: 10px;"
        >
          <el-button
            size="small"
            @click="cancelPort"
          >
            取 消
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="savePort"
          >
            确 定
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="目的国"
      :visible.sync="isItemDialogShow"
      :close-on-click-modal="false"
      append-to-body
      width="960px"
      @close="itemDialogClose"
    >
      <el-transfer
        ref="transferItem"
        v-model="selectForm.countryToIds"
        filterable
        :filter-method="filterMethod"
        :titles="['国家', '已选择']"
        :props="{key: 'id', label: 'label'}"
        filter-placeholder="输入搜索"
        :data="countryList"
        style="height: 500px;"
      />
      <div
        slot="footer"
        style="text-align: right;margin: 0 40px 0;"
      >
        <el-button
          size="small"
          @click="itemDialogClose"
        >
          取 消
        </el-button>

        <el-button
          type="primary"
          size="small"
          @click="itemDialogClose"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import MarkdownEditor from '@/components/MarkdownEditor/index.vue'
import {
  getCountryList,
  getCurrencyList,
  getCustTypeList,
  getWordsList,
  getProductTypeList,
  getServiceSubtypeList,
  saveLsc,
  getDeliveryList,
  getEscList,
  getCostgroupList,
  getPortList,
  getLscById,
  getCscList,
  getKscList,
  getExamineList,
  getOrgCompany
} from '@/api/service-with-privateline-clearance'

function formParam() {
  return {
    maxAmount: undefined,
    maxPrice: undefined,
    singleMaxWeight: undefined,
    declaredCurrency: undefined,
    productId: undefined,
    productName: undefined,
    name: undefined,
    abbr: undefined,
    lsId: undefined,
    subtypeId: undefined,
    subtypeName: undefined,
    orgTag: undefined,
    kscName: undefined,
    cscName: undefined,
    custName: undefined,
    countryName: undefined,
    countryId: undefined,
    countryToIds: [],
    departureId: [],
    departureName: undefined,
    deliveryName: undefined,
    destinationName: undefined,
    destinationId: [],
    region: undefined,
    containerType: undefined,
    deliveryId: [],
    outsourcing: '0',
    purposeType: 0,
    usages: [],
    currencyId: undefined,
    currencyName: undefined,
    weight: undefined,
    cubed: undefined,
    custId: undefined,
    remark: undefined,
    belong: undefined,
    umLength: undefined,
    umWeight: undefined,
    umVolume: undefined,
    dispatch: undefined,
    operatingCosts: undefined,
    isCreate: 0,
    includeTax: true,
    coverTank: undefined,
    categories: [],
    chargeGroupId: undefined,
    chargeGroupName: undefined,
    deductibles: undefined,
    examine: true,
    examineId: undefined,
    priceC: undefined,
    tax: undefined,
    insurance: undefined,
    priceType: '2',
    escs: [],
    pMark: undefined,
    pHscode: undefined,
    pVolume: undefined,
    pWeight: undefined,
    remind: true,
    terms: '',
    refStart: undefined,
    refEnd: undefined,
    clause: undefined,
    cscId: undefined,
    escId: undefined,
    kscId: undefined
  }
}

@Component({
  name: 'addEditForm',
  components: {
    MarkdownEditor
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    isCopy: {
      type: Boolean,
      default: false
    },
    typeList: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
})
export default class extends Vue {
  /* data */
  private selectForm: any = formParam()
  private formRules: any = {
    name: [{ required: true, message: '服务名称不能为空', trigger: 'blur' }],
    abbr: [{ required: true, message: '服务简称不能为空', trigger: 'blur' }],
    productId: [{ required: true, message: '请选择所属产品', trigger: 'change' }],
    containerType: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
    subtypeId: [{ required: true, message: '请选择服务类型', trigger: 'change' }],
    countryId: [{ required: true, message: '起运国不能为空', trigger: 'change' }], // 起运国
    countryToIds: [{ required: true, message: '目的国不能为空', trigger: 'change' }], // 目的国
    departureId: [{ required: false, message: '请选择起运港', trigger: 'change' }],
    destinationId: [{ required: false, message: '请选择目的港', trigger: 'change' }],
    deliveryId: [{ required: true, message: '请选择交货区域', trigger: 'change' }],
    outsourcing: [{ required: true, message: '请选择配货属性', trigger: 'change' }],
    declaredCurrency: [{ required: true, message: '请选择申报币种', trigger: 'change' }],
    purposeType: [{ required: true, message: '请选择目的地类型', trigger: 'change' }],
    usages: [{ required: true, message: '请选择服务用途', trigger: 'change' }],
    belong: [{ required: true, message: '请选择分配客户', trigger: 'change' }],
    lsId: [
      { required: true, message: '服务编码不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^[a-zA-Z0-9 .·_-]+$/
          if (!value) {
            callback(new Error('服务编码不能为空'))
          } else if (!reg.test(value)) {
            callback(new Error('服务编码不能有中文及特殊字符'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ], // 服务编码
    currencyId: [{ required: true, message: '请选择货币单位', trigger: 'change' }], // 货币单位
    umLength: [{ required: true, message: '请选择长度单位', trigger: 'change' }],
    umWeight: [{ required: true, message: '请选择重量单位', trigger: 'change' }],
    umVolume: [{ required: true, message: '请选择体积单位', trigger: 'change' }],
    weight: [{ required: true, message: '支持最大重量不能为空', trigger: 'blur' }], // 支持最大重量
    cubed: [{ required: true, message: '支持最大体积不能为空', trigger: 'blur' }], // 支持最大体积
    refStart: [
      { required: true, message: '起始时效不能为空', trigger: 'blur' },
      {
        validator: (rule: any, value: any, callback: (val?: any) => void) => {
          const root: any = (this as any).$refs.selectForm
          if (!value) {
            callback(new Error('起始时效不能为空'))
          } else {
            root.validateField('refEnd')
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    refEnd: [
      { required: true, message: '结束时效不能为空', trigger: 'blur' },
      {
        validator: this.numberValidate,
        trigger: 'blur'
      }
    ],
    clause: [{ required: true, message: '请选择服务条款', trigger: 'change' }],
    dispatch: [{ required: true, message: '请选择派送方式', trigger: 'change' }],
    isCreate: [{ required: true, message: '请选择是否生成转单号', trigger: 'change' }],
    includeTax: [{ required: true, message: '请选择是否包税', trigger: 'change' }],
    coverTank: [{ required: true, message: '请选择是否支持锁舱', trigger: 'change' }],
    categories: [{ required: true, message: '请选择商品属性', trigger: 'change' }],
    chargeGroupId: [{ required: true, message: '请选择计费发票费用组', trigger: 'change' }],
    deductibles: [{ required: true, message: '免赔金额不能为空', trigger: 'blur' }],
    priceC: [{ required: true, message: '报关价比率不能为空', trigger: 'blur' }],
    tax: [{ required: true, message: '关税预付比率不能为空', trigger: 'blur' }],
    insurance: [{ required: true, message: '保险费比率不能为空', trigger: 'blur' }],
    examine: [{ required: true, message: '请选择是否验货', trigger: 'change' }],
    examineId: [{ required: true, message: '请选择验货配置', trigger: 'change' }],
    escs: [{ required: false, message: '请选择打单快递服务', trigger: 'change' }],
    kscId: [{ required: false, message: '请选择起运港卡派服务', trigger: 'change' }],
    cscId: [{ required: false, message: '请选择起运港报关服务', trigger: 'change' }],
    orgTag: [{ required: false, message: '请选择服务机构', trigger: 'change' }],
    // escId: [{ required: true, message: '请选择计费快递服务', trigger: 'change' }],
    pWeight: [{ required: true, message: '分单重量上限不能为空', trigger: 'blur' }],
    pVolume: [{ required: true, message: '分单体积上限不能为空', trigger: 'blur' }],
    pHscode: [{ required: true, message: '分单HSCODE数限制不能为空', trigger: 'blur' }]
  }
  private countryList: any[] = []
  private currencyList: any[] = []
  private supplierList: any[] = []
  private productList: any[] = []
  private wordsList: any[] = []
  private subtypeList: any[] = []
  private portList: any[] = []
  private addrList: any[] = []
  private codeList: any[] = []
  private orgList: any[] = [
    { name: '美森', id: '1' },
    { name: '以星', id: '2' },
    { name: '快线', id: '3' },
    { name: '其他', id: '4' }
  ]
  private invoiceList: any[] = []
  private expressList: any[] = []
  private customsList: any[] = []
  private cardList: any[] = []
  private examineList: any[] = []
  private terms = ''
  private formLoading: boolean = false
  private dialogExpress: boolean = false
  private dialogLoading: boolean = false
  private selectLoading: boolean = false
  private isItemDialogShow: boolean = false
  private title = ''
  private ss = ''
  private cc = ''
  private tt = ''
  private portName = ''
  private expressOption: any[] = []
  private portOption: any[] = []
  private dialogPort: boolean = false
  private page = 1
  private size = 10
  private total = 0

  /** computed */
  // 所属公司id
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }
  get dispatchList() {
    const { subtypeId, containerType, purposeType } = this.selectForm
    if (purposeType === 2) {
      return [
        { label: '到仓', value: '4' }
      ]
    }
    if ((subtypeId === '1' || subtypeId === '2') && containerType === '1') {
      return [
        { label: '整柜直送', value: '3' },
        { label: '自提', value: '2' }
      ]
    } else {
      return [
        { label: '卡派', value: '0' },
        { label: '快递', value: '1' },
        { label: '自提', value: '2' }
      ]
    }
  }

  /* 方法 */
  private purposeTypeChange() {
    this.selectForm.dispatch = ''
  }
  private numberValidate(rule: any, value: any, callback: (val?: any) => void) {
    const start = (this as any).selectForm.refStart
    if (!value) {
      callback(new Error('结束时效不能为空'))
    } else if (value <= start) {
      callback(new Error('结束时效必须大于起始时效'))
    } else {
      callback()
    }
  }

  private async setData(val: any) {
    // 设置值
    this.formLoading = true
    this.getRegionData()
    this.getCostgroupList()
    this.getSubtypeList()
    this.getWordsList()
    this.getProductTypeList()
    this.getCscList()
    this.getKscList()
    this.getExamineList()
    this.getEscList()
    this.getCurrencyData()
    this.getCountryData()
    if ((this as any).isEdit) {
      try {
        const res = await getLscById({ id: val.id })
        const data = res.data || {}
        const {
          name,
          abbr,
          id,
          lsId,
          deliveryId,
          departureId,
          departureName,
          destinationId,
          destinationName,
          escs,
          targets,
          usages,
          categories,
          terms,
          ...form
        } = data

        const depName = departureName ? departureName.split(',') : []
        const desName = destinationName ? destinationName.split(',') : []
        const depId = departureId ? departureId.split(',') : []
        const desId = destinationId ? destinationId.split(',') : []
        const arrDep = depId.map((it: any, index: any) => {
          return {
            id: it,
            name: depName[index]
          }
        })
        const arrDes = desId.map((it: any, index: any) => {
          return {
            id: it,
            name: desName[index]
          }
        })
        const arrT = (targets || []).map((item:any) => item.countryId)
        const arrE = escs.map((it: any) => it.id)
        this.selectForm = {
          ...form,
          name: (this as any).isCopy ? undefined : name,
          abbr: (this as any).isCopy ? undefined : abbr,
          id: (this as any).isCopy ? undefined : id,
          lsId: (this as any).isCopy ? undefined : lsId,
          // deliveryId: deliveryId ? deliveryId.split(',') : [],
          usages: usages ? usages.split(',') : [],
          categories: categories ? categories.split(',') : [],
          departureId: arrDep,
          destinationId: arrDes,
          countryToIds: arrT,
          escs: arrE
        }
        this.setTerms(terms)
        // this.getOrgList()
        this.getCustTypeList()
      } catch (error) {
        this.formLoading = false
        return error
      }
    } else {
      this.formLoading = false
      return
    }

    this.formLoading = false
  }

  private onDispatch() {
    this.selectForm.escs = []
    this.selectForm.kscId = undefined
    if (this.selectForm.dispatch !== '1') {
      this.selectForm.isCreate = 0
    }
  }
  private setTerms(val: any) {
    (this.$refs.markdownEditor as MarkdownEditor).setHtml(val)
  }

  private filterMethod(query: any, item: any): boolean {
    const name = item.name || ''
    return name.indexOf(query) > -1
  }

  private async handlePort(val: any) {
    this.tt = val
    if (this.tt === 'qi' && !this.selectForm.countryId) {
      this.$message.error('请选择起运国')
      return
    }
    if (this.tt === 'mu' && (!Array.isArray(this.selectForm.countryToIds) || this.selectForm.countryToIds.length <= 0)) {
      this.$message.error('请选择目的国')
      return
    }
    this.dialogPort = true
    if (val === 'qi') {
      this.title = '起运港'
      this.portOption = [...this.selectForm.departureId]
    } else {
      this.title = '目的港'
      this.portOption = [...this.selectForm.destinationId]
    }
    await this.getPortData(1)
  }

  private cancelPort() {
    this.dialogPort = false
    this.portName = ''
    this.portOption = []
    this.portList = []
  }

  private savePort() {
    this.dialogPort = false
    if (this.tt === 'qi') {
      this.selectForm.departureId = [...this.portOption]
    } else {
      this.selectForm.destinationId = [...this.portOption]
    }
  }

  private async handleSizeChange() {
    await this.getPortData()
  }

  private async handleCurrentChange() {
    await this.getPortData()
  }

  private handleRemove(index: any, item: any) {
    this.portOption.splice(index, 1)
    const itemD = this.portList.findIndex((element: any) => element.id === item.id)
    if (itemD !== -1) {
      this.$nextTick(() => {
        (this.$refs.theTable as any).toggleRowSelection(this.portList[itemD])
      })
    }
  }

  private handleSelect(_: any, row: any) {
    const index = this.portOption.findIndex((item: any) => item.id === row.id)
    if (index === -1) {
      this.portOption.push({
        id: row.id,
        name: row.name,
        code: row.code
      })
    } else {
      this.portOption.splice(index, 1)
    }
  }

  private handleSelectAll(selection: any) {
    if (selection.length) {
      this.portList.forEach((item: any) => {
        if (this.portOption.every((element: any) => element.id !== item.id)) {
          this.portOption.push({
            id: item.id,
            name: item.name
          })
        }
      })
    } else {
      this.portOption = this.portOption.filter((item: any) => {
        const isInTableData = this.portList.some((element: any) => {
          return element.id === item.id
        })
        return !isInTableData
      })
    }
  }
  private handleSelectionChange(val: any) {
    // zzz
  }

  private handleExpress() {
    this.expressOption = this.selectForm.escs
    this.dialogExpress = true
    this.dialogLoading = true
    this.getEscList()
  }
  private cancelExpress() {
    this.dialogExpress = false
    this.expressOption = []
  }
  private saveExpress() {
    this.dialogExpress = false
    this.selectForm.escs = this.expressOption
  }
  private onChargeType() {
    this.selectForm.pVolume = undefined
    this.selectForm.pWeight = undefined
    this.selectForm.pHscode = undefined
    this.selectForm.remind = false
    this.selectForm.escs = []
    this.selectForm.kscId = undefined
  }
  private onSubtype(val: any) {
    this.selectForm.departureId = []
    this.selectForm.destinationId = []
    this.selectForm.orgTag = undefined
    if (val === '1' || val === '2') {
      this.selectForm.coverTank = '0'
    } else {
      this.selectForm.coverTank = undefined
    }
    this.portList = []
    this.selectForm.containerType = undefined
    this.selectForm.custId = undefined
    this.selectForm.dispatch = undefined
    this.selectForm.escs = []
    this.selectForm.kscId = undefined
    this.selectForm.priceType = '2'
    this.supplierList = []
  }

  private handleStates(): void {
    this.isItemDialogShow = true
  }
  private itemDialogClose() {
    this.isItemDialogShow = false
    const root: any = this.$refs.transferItem
    root.clearQuery('left')
    root.clearQuery('right')
    // this.form.area = []
  }
  // 获取国家列表
  private getCountryData() {
    this.selectLoading = true
    getCountryList()
      .then((res: any) => {
        const data = res.data || {}
        const arr = data.result || []
        this.countryList = arr.map((it: any) => {
          const { name, id, alias }: any = it
          return {
            name,
            alias,
            id,
            label: name + '-' + alias
          }
        })
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  // 获取货币列表
  private getCurrencyData() {
    const params = {
      page: 1,
      size: 9999
    }
    getCurrencyList(params).then((res:any) => {
      const data = res.data || {}
      this.currencyList = data.result || []
    }).catch((err:any) => {
      return err
    })
  }
  // 获取供应商列表
  private getCustTypeList() {
    this.selectLoading = true
    const params = {
      page: 1,
      size: 9999,
      cas: 'S',
      typeId: '05',
      subtypeId: this.selectForm.subtypeId
    }
    getCustTypeList(params).then((res: any) => {
      const data = res.data || {}
      const result = data.result || []
      this.supplierList = JSON.parse(
        JSON.stringify(result)
          .replace(/custName/g, 'name')
          .replace(/custId/g, 'id')
      )
      this.selectLoading = false
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }
  private async getPortData(val?: any) {
    if (val) {
      this.page = val
    }
    const params:any = {
      page: this.page,
      size: this.size,
      type: this.selectForm.subtypeId === '3' ? '0' : this.selectForm.subtypeId,
      countryId: this.tt === 'qi' ? this.selectForm.countryId : this.selectForm.countryToIds.join(','),
      name: this.portName
    }
    this.dialogLoading = true
    try {
      const res = await getPortList(params)
      const data = res.data || {}
      const result = data.result || []
      this.portList = result.map((it: any) => {
        return {
          id: it.id,
          name: it.name,
          code: it.code
        }
      })
      this.total = data.total
      this.portList.forEach((row: any) => {
        const isSelected = this.portOption.some((item: any) => item.id === row.id)
        if (isSelected) {
          this.$nextTick(() => {
            (this.$refs.theTable as any).toggleRowSelection(row)
          })
        }
      })
      this.dialogLoading = false
    } catch (error) {
      this.dialogLoading = false
      this.formLoading = false
      return error
    }
  }

  private getSubtypeList() {
    const params:any = {
      typeId: '05'
    }
    getServiceSubtypeList(params)
      .then(res => {
        const data = res.data || []
        this.subtypeList = data.filter((it: any) => it.id !== '3')
      }).catch(err => {
        return err
      })
  }
  private getWordsList() {
    const params:any = {
      type: 'server_terms'
    }
    getWordsList(params)
      .then((res: any) => {
        const data = res.data || []
        this.wordsList = data
      }).catch((err: any) => {
        return err
      })
  }
  private getProductTypeList() {
    getProductTypeList()
      .then((res: any) => {
        const data = res.data || []
        this.productList = data
      }).catch((err: any) => {
        return err
      })
  }
  private getCostgroupList() {
    const params:any = {
      page: 1,
      size: 99999,
      type: '1'
    }
    getCostgroupList(params)
      .then(res => {
        const data = res.data || {}
        this.invoiceList = data.result || []
      }).catch(err => {
        return err
      })
  }
  private getEscList() {
    const params:any = {
      model: {
        custId: (this as any).custId
      },
      page: 1,
      size: 99999
    }
    getEscList(params).then((res: any) => {
      const data = res.data || {}
      const result = data.result || []
      this.expressList = result.map((it: any) => {
        it.id = it.id.toString()
        return it
      })
      this.dialogLoading = false
    }).catch((err: any) => {
      this.dialogLoading = false
      this.formLoading = false
      return err
    })
  }
  private getCscList() {
    const params:any = {
      page: 1,
      size: 99999
    }
    getCscList(params).then((res: any) => {
      const data = res.data || {}
      const result = data.result || []
      this.customsList = result.filter((it:any) => it.status === '1')
      this.dialogLoading = false
    }).catch((err: any) => {
      this.dialogLoading = false
      this.formLoading = false
      return err
    })
  }
  private getKscList() {
    const params:any = {
      page: 1,
      size: 99999
    }
    getKscList(params).then((res: any) => {
      const data = res.data || {}
      const result = data.result || []
      this.cardList = result.filter((it:any) => it.status === '1')
      this.dialogLoading = false
    }).catch((err: any) => {
      this.dialogLoading = false
      this.formLoading = false
      return err
    })
  }
  private getExamineList(): void {
    const params:any = {
      page: 1,
      size: 9999
    }
    getExamineList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.examineList = data.result || []
      })
      .catch((err: any) => {
        return err
      })
  }
  private getRegionData() {
    getDeliveryList()
      .then((res: any) => {
        const data = res.data || []
        this.addrList = data
      }).catch((err: any) => {
        return err
      })
  }
  private getOrgList() {
    const arr = [this.selectForm.countryId, ...this.selectForm.countryToIds]
    const brr = Array.from(new Set(arr))
    const params = {
      type: 0,
      serviceCountry: brr.join(','),
      page: 1,
      size: 99999
    }
    this.orgList = []
    this.selectLoading = true
    getOrgCompany(params).then((res: any) => {
      if (res.success) {
        const data = res.data || {}
        this.orgList = data.result || []
      }
      this.selectLoading = false
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }

  // 重置表单
  private resetForm() {
    this.selectForm = formParam()
    this.setTerms('')
    this.clearValidate()
  }
  // 清除校验
  private clearValidate() {
    const editForm: any = this.$refs.selectForm
    this.$nextTick(() => {
      editForm.clearValidate()
    })
  }
  private handleBack() {
    this.resetForm()
    this.$emit('back')
  }
  private handleSave(): any {
    // 保存
    const html = (this.$refs.markdownEditor as MarkdownEditor).getHtml()
    const editForm: any = this.$refs.selectForm
    editForm.validate((valid: any) => {
      if (!valid) return false
      const { deliveryId, departureId, destinationId, escs, usages, categories, countryToIds, orgTag, ...form } = this.selectForm
      if (Array.isArray(departureId) && departureId.length <= 0) {
        this.$message.error('请选择起运港')
        return
      }
      if (Array.isArray(destinationId) && this.selectForm.subtypeId !== '3' && destinationId.length <= 0) {
        this.$message.error('请选择目的港')
        return
      }
      if (this.selectForm.umLength === 'FT' && (this.selectForm.umWeight !== 'LBS' || this.selectForm.umVolume !== 'CUFT')) {
        this.$message.error('长度单位，重量单位，体积单位必须一致')
        return
      }
      if (this.selectForm.umLength !== 'FT' && (this.selectForm.umWeight === 'LBS' || this.selectForm.umVolume === 'CUFT')) {
        this.$message.error('长度单位，重量单位，体积单位必须一致')
        return
      }
      if (this.selectForm.umWeight === 'LBS' && this.selectForm.umVolume !== 'CUFT') {
        this.$message.error('长度单位，重量单位，体积单位必须一致')
        return
      }
      if (this.selectForm.dispatch === '1' && Array.isArray(escs) && escs.length <= 0) {
        this.$message.error('请选择打单快递服务')
        return
      }
      this.formLoading = true
      const params: any = {
        ...form,
        orgTag: this.selectForm.subtypeId === '1' && countryToIds.some((it: any) => it === 'US') ? orgTag : undefined
      }
      params.terms = html
      this.invoiceList.map((item: any) => {
        if (item.id === params.chargeGroupId) {
          params.chargeGroupName = item.name
        }
      })
      this.productList.map((item: any) => {
        if (item.id === params.productId) {
          params.productName = item.name
        }
      })
      // if (Array.isArray(deliveryId)) {
      //   const arrN: any[] = []
      //   deliveryId.map((d: any) => {
      //     const item: any = this.addrList.find((a: any) => a.id === d) || {}
      //     arrN.push(item.name)
      //   })
      //   params.deliveryId = deliveryId.join(',')
      //   params.deliveryName = arrN.join(',')
      // }
      if (Array.isArray(departureId)) {
        const arrN: any[] = departureId.map((d: any) => (d.code ? d.code + '-' : '') + d.name)
        const arrI: any[] = departureId.map((d: any) => d.id)
        params.departureId = arrI.join(',')
        params.departureName = arrN.join(',')
      }
      if (Array.isArray(destinationId)) {
        const arrN: any[] = destinationId.map((d: any) => (d.code ? d.code + '-' : '') + d.name)
        const arrI: any[] = destinationId.map((d: any) => d.id)
        params.destinationId = arrI.join(',')
        params.destinationName = arrN.join(',')
      }
      if (Array.isArray(escs)) {
        const arrN: any[] = []
        escs.map((d: any) => {
          const item: any = this.expressList.find((a: any) => a.id === d) || {}
          arrN.push({
            id: item.id,
            name: item.name
          })
        })
        params.escs = arrN.filter((it: any) => it.id && it.name)
      }
      if (Array.isArray(usages)) {
        params.usages = usages.join(',')
      }
      if (Array.isArray(categories)) {
        params.categories = categories.join(',')
      }

      this.customsList.map((it: any) => {
        if (it.id === params.cscId) {
          params.cscName = it.name
        }
      })
      this.cardList.map((it: any) => {
        if (it.id === params.kscId) {
          params.kscName = it.name
        }
      })
      this.subtypeList.map((it: any) => {
        if (it.id === params.subtypeId) {
          params.subtypeName = it.name
        }
      })
      this.examineList.map((it: any) => {
        if (it.id === params.examineId) {
          params.examineName = it.name
        }
      })
      params.targets = []
      this.countryList.forEach(item => {
        if (item.id === params.countryId) {
          params.countryName = item.name
        }
        countryToIds.forEach((ele: any) => {
          if (ele === item.id) {
            params.targets.push({
              countryId: item.id,
              countryName: item.name
            })
          }
        })
      })
      this.supplierList.find(item => {
        if (item.id === params.custId) {
          params.custName = item.name
        }
      })
      this.currencyList.find((item) => {
        if (item.id === params.currencyId) {
          params.currencyName = item.name
        }
      })

      saveLsc(params)
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.resetForm()
          this.$emit('confirm')
          this.formLoading = false
        })
        .catch(err => {
          this.formLoading = false
          return err
        })
    })
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  display: inline-block;
  width: 24.9%;
}

.input-number-valiate {
  width: 100%;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
.input-capacity {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.input-unit {
  width: 55px;
  height: 32px;
  background-color: #f5f7fa;
  color: #909399;
  padding: 0 10px;
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
.privateline-edit{
  padding:0;
  .header-top{
    text-align: right;
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    font-size: 16px;
    color: #666666;
    border-bottom: 1px solid #cccccc;
  }
  .content{
    padding: 20px;;
    .form-title {
      height: 35px;
      line-height: 35px;
      font-size: 16px;
      font-weight: 700;
      background: #f2f2f2;
      padding-left: 20px;
      margin-bottom:20px;
    }
  }
}

.items {
  height: 450px;
  overflow: auto;
  border: 1px solid #e6ebf5;
  .items-head {
    padding: 10px;
    background-color: #dfdfdf;
    margin-bottom: 15px;
  }
}

.filter{
  .el-input {
    display: inline-block;
    width: 220px;
    margin:10px;
  }
}

::v-deep .el-transfer-panel {
  width: 40%;
  height: 100%;
}
::v-deep .el-transfer {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}
::v-deep .el-transfer-panel__list.is-filterable {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
}
::v-deep .el-transfer-panel__body {
  height: 78%;
}
</style>
