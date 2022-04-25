<template>
  <div
    class="dashboard-container"
    style="flex: 1;overflow: auto;"
  >
    <div
      class="app-container"
    >
      <head-info
        info=""
        title="商品审核"
      >
        <div
          slot="option"
          style="display: flex;align-items: center"
        >
          <div
            class="order-info"
            style="white-space: nowrap;flex: 1;padding: 0 10px"
          >
            起运国：{{ (orderInfo.lscConfig || {}).countryName }}
          </div>
          <div
            class="order-info"
            style="white-space: nowrap;flex: 1;padding: 0 10px"
          >
            目的国：{{ (orderInfo.country || {}).value }}
          </div>
          <div
            class="order-info"
            style="white-space: nowrap;flex: 1;padding: 0 10px"
          >
            总箱数：{{ orderInfo.packages }}
          </div>
          <div
            class="order-info"
            style="white-space: nowrap;flex: 1;padding: 0 10px"
          >
            总货值：{{ orderInfo.value }} {{ (orderInfo.currency || {}).key }}
          </div>
          <div
            class="order-info"
            style="white-space: nowrap;flex: 1;padding: 0 10px"
          >
            总税金：{{ tax }}
          </div>
          <el-button
            size="small"
            icon="el-icon-refresh-right"
            @click="loadData"
          >
            <span>刷新</span>
          </el-button>
          <el-button
            size="small"
            icon="el-icon-back"
            @click="handleBack"
          >
            <span>返回</span>
          </el-button>
        </div>
      </head-info>
      <div style="background: #fff;padding: 10px 20px;margin-top: 10px;">
        <el-table
          v-loading="loading"
          :data="tableDataPage"
          height="calc(100vh - 313px)"
          style="width: 100%;"
          border
        >
          <el-table-column
            width="230"
            fixed="left"
          >
            <template
              slot="header"
            >
              <p style="margin: 0">
                商品名称(中文)
              </p>
              <p style="margin: 0">
                商品名称(英文)
              </p>
            </template>
            <template slot-scope="scope">
              <p style="margin: 0">
                {{ scope.row.goodsName }}
              </p>
              <p style="margin: 0">
                {{ scope.row.goodsAlias }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            label="审核状态"
            fixed="left"
            width="90"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="showAudit(scope.row)"
              >
                {{ (auditList.find(e => e.id === scope.row.auditStatus) || {}).name }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="认证文件"
            fixed="left"
            width="90"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="showFileList(scope.row, scope.$index)"
              >
                认证文件
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="海关编码"
            width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.hsCode }}
            </template>
          </el-table-column>
          <el-table-column
            label="商品数量"
            width="90"
          >
            <template slot-scope="scope">
              {{ scope.row.goodNum }}
            </template>
          </el-table-column>
          <el-table-column
            label="申报金额"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ parseFloat((scope.row.goodNum * scope.row.price).toFixed(3)) }} {{ (orderInfo.currency || {}).key }}
            </template>
          </el-table-column>
          <el-table-column
            label="税金"
            width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.tax }}
            </template>
          </el-table-column>
          <el-table-column
            label="品牌/型号"
            width="200"
          >
            <template slot-scope="scope">
              {{ scope.row.brand }} / {{ scope.row.model }}
            </template>
          </el-table-column>
          <!--<el-table-column
            label="规格"
            min-width="230"
          >
            <template slot-scope="scope">
              {{ scope.row.size }}
            </template>
          </el-table-column>-->
          <el-table-column
            width="200"
          >
            <template
              slot="header"
            >
              <p style="margin: 0">
                材质(中文)
              </p>
              <p style="margin: 0">
                材质(英文)
              </p>
            </template>
            <template slot-scope="scope">
              <p style="margin: 0">
                {{ scope.row.materialZh }}
              </p>
              <p style="margin: 0">
                {{ scope.row.materialEn }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            width="200"
          >
            <template
              slot="header"
            >
              <p style="margin: 0">
                用途(中文)
              </p>
              <p style="margin: 0">
                用途(英文)
              </p>
            </template>
            <template slot-scope="scope">
              <p style="margin: 0">
                {{ scope.row.usageZh }}
              </p>
              <p style="margin: 0">
                {{ scope.row.usageEn }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            label="计量单位"
            width="90"
          >
            <template slot-scope="scope">
              {{ scope.row.unitName }}
            </template>
          </el-table-column>
          <el-table-column
            label="商品类别"
            width="200"
          >
            <template slot-scope="scope">
              {{ scope.row.categoryName }}
            </template>
          </el-table-column>
          <el-table-column
            label="来源"
            width="90"
          >
            <template slot-scope="scope">
              {{ scope.row.productId ? '产品库' : '新增产品' }}
            </template>
          </el-table-column>
          <el-table-column
            label="添加时间"
            min-width="200"
          >
            <template slot-scope="scope">
              {{ scope.row.createTime }}
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
    </div>
    <el-dialog
      :visible="visible"
      width="1100px"
      title="商品审核"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <div v-loading="dialogLoading">
        <div class="dialog-order-info">
          <div class="dialog-order-info-item w100">
            <div class="label">
              商品图片：
            </div>
            <div class="value">
              <div
                class="preview-img-wrap"
              >
                <div class="preview-img">
                  <img :src="showDialogRow.fileUrl">
                  <div class="mask">
                    <i
                      class="el-icon-view mask-view-icon"
                      @click="handlePreview(showDialogRow.fileUrl)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="dialog-order-info-item w50">
            <div class="label">
              中文名称：
            </div>
            <div class="value">
              {{ showDialogRow.goodsName }}
            </div>
          </div>
          <div class="dialog-order-info-item w50">
            <div class="label">
              英文名称：
            </div>
            <div class="value">
              {{ showDialogRow.goodsAlias }}
            </div>
          </div>
          <div class="dialog-order-info-item w50">
            <div class="label">
              品牌名称：
            </div>
            <div class="value">
              {{ showDialogRow.brand }}
            </div>
          </div>
          <div class="dialog-order-info-item w50">
            <div class="label">
              商品型号：
            </div>
            <div class="value">
              {{ showDialogRow.model }}
            </div>
          </div>
          <div class="dialog-order-info-item w50">
            <div class="label">
              中文材质：
            </div>
            <div class="value">
              {{ showDialogRow.materialZh }}
            </div>
          </div>
          <div class="dialog-order-info-item w50">
            <div class="label">
              英文材质：
            </div>
            <div class="value">
              {{ showDialogRow.materialEn }}
            </div>
          </div>
          <div class="dialog-order-info-item w50">
            <div class="label">
              中文用途：
            </div>
            <div class="value">
              {{ showDialogRow.usageZh }}
            </div>
          </div>
          <div class="dialog-order-info-item w50">
            <div class="label">
              英文用途：
            </div>
            <div class="value">
              {{ showDialogRow.usageEn }}
            </div>
          </div>
          <div class="dialog-order-info-item w50">
            <div class="label">
              计量单位：
            </div>
            <div class="value">
              {{ showDialogRow.unitName }}
            </div>
          </div>
          <div class="dialog-order-info-item w50">
            <div class="label">
              商品数量：
            </div>
            <div class="value">
              {{ showDialogRow.goodNum }}
            </div>
          </div>
          <div class="dialog-order-info-item w50">
            <div class="label">
              商品单价：
            </div>
            <div class="value">
              {{ showDialogRow.price }}
            </div>
          </div>
          <!--<div class="dialog-order-info-item w33">
            <div class="label">
              商品重量：
            </div>
            <div class="value">
              {{ $volumeConversion(showDialogRow.batchWeights, (orderInfo.um || {}).umWeight, 'KGS') }} kg
            </div>
          </div>-->
        </div>
        <el-form
          ref="form"
          :model="form"
          :rules="formRules"
          label-width="90px"
          style="padding-top: 20px;"
          size="small"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="审核结果"
                prop="auditStatus"
              >
                <el-radio-group
                  v-model="form.auditStatus"
                  :disabled="auditStatus === 1"
                >
                  <el-radio :label="1">
                    通过
                  </el-radio>
                  <el-radio :label="2">
                    拒绝
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="商品类别"
                prop="categoryId"
              >
                <!--<el-tree-select
                  v-model="form.categoryId"
                  :default-expand-all="false"
                  filterable
                  clearable
                  :disabled="auditStatus === 1"
                  size="small"
                  placeholder="请选择"
                  @change="onProduct"
                />-->
                <el-input
                  v-model="form.categoryName"
                  size="small"
                  disabled
                  placeholder="请选择商品分类"
                >
                  <el-button
                    slot="append"
                    type="primary"
                    icon="el-icon-search"
                    :disabled="auditStatus === 1"
                    @click="showCategoryDialog"
                  />
                </el-input>
              </el-form-item>
            </el-col>
            <!--<el-col :span="8">
              <el-form-item
                label="建议单价"
                prop="suggestedPrice"
              >
                <el-input
                  v-model="form.suggestedPrice"
                  :disabled="auditStatus === 1"
                  size="small"
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>-->
            <el-col :span="12">
              <el-form-item
                v-if="form.auditStatus === 2"
                label="拒绝原因"
                prop="remarks"
              >
                <el-input
                  v-model="form.remarks"
                  type="textarea"
                  :disabled="auditStatus === 1"
                  :rows="3"
                  size="small"
                  placeholder="请输入"
                />
              </el-form-item>
              <el-form-item
                v-else
                label="备注"
              >
                <el-input
                  v-model="form.remarks"
                  type="textarea"
                  :disabled="auditStatus === 1"
                  :rows="3"
                  size="small"
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div
            v-if="auditStatus !== 1"
            style="text-align: right;padding-bottom: 10px"
          >
            <el-button
              slot="footer"
              type="primary"
              size="mini"
              @click="saveAuditClick"
            >
              保存
            </el-button>
          </div>
        </el-form>
        <div
          v-if="auditStatus !== 1 || productList.length"
          class="dialog-table"
        >
          <div
            v-if="auditStatus !== 1"
            class="search-form"
          >
            <div class="search-form-item">
              <div class="label">
                商品中文名称
              </div>
              <div class="form-input">
                <el-input
                  v-model="searchForm.nameZh"
                  size="small"
                  placeholder="请输入内容"
                >
                  <el-button
                    slot="append"
                    type="primary"
                    @click="getProductList(1)"
                  >
                    查询
                  </el-button>
                </el-input>
              </div>
            </div>
            <div class="search-form-item">
              <div class="label">
                商品英文名称
              </div>
              <div class="form-input">
                <el-input
                  v-model="searchForm.nameEn"
                  size="small"
                  placeholder="请输入内容"
                >
                  <el-button
                    slot="append"
                    type="primary"
                    @click="getProductList(1)"
                  >
                    查询
                  </el-button>
                </el-input>
              </div>
            </div>
          </div>
          <div
            v-if="selectRow.id"
            class="select-row-info"
          >
            <div class="info-item option">
              <i
                v-if="auditStatus !== 1"
                class="el-icon-close"
                style="cursor: pointer;"
                @click="clearSelectRow"
              />
            </div>
            <div class="info-item name">
              <p>
                {{ selectRow.cnName }}
              </p>
              <p>
                {{ selectRow.enName }}
              </p>
            </div>
            <div class="info-item code">
              <p>
                {{ selectRow.code || '--' }}
              </p>
              <p>
                {{ selectRow.skuCode || '--' }}
              </p>
            </div>
            <div class="info-item product-class">
              {{ selectRow.title }}
            </div>
            <div class="info-item unit">
              <p>
                {{ selectRow.price }}
              </p>
              <p>
                {{ selectRow.unitName }}
              </p>
            </div>
            <div class="info-item model">
              <p>
                {{ selectRow.brand }}
              </p>
              <p>
                {{ selectRow.size }}
              </p>
            </div>
            <div class="info-item caizhi">
              <p>
                {{ selectRow.cnMaterial }}
              </p>
              <p>
                {{ selectRow.enMaterial }}
              </p>
            </div>
            <div class="info-item yongtu">
              <p>
                {{ selectRow.cnPurpose }}
              </p>
              <p>
                {{ selectRow.enPurpose }}
              </p>
            </div>
          </div>
          <div
            v-if="costList.length"
            class="cost-info"
          >
            <div
              v-for="item in costList"
              :key="item.value"
              class="cost-info-item"
            >
              <div class="label">
                {{ item.name }}：
              </div>
              <div class="value">
                {{ item.value }}
              </div>
            </div>
          </div>
          <div class="product-list">
            <el-table
              v-loading="loadingProduct"
              :data="productList"
              max-height="300px"
              style="width: 100%;"
              border
            >
              <el-table-column
                width="57"
              >
                <template slot-scope="scope">
                  <div style="text-align: center;">
                    <el-radio
                      v-model="selectRowId"
                      :disabled="auditStatus === 1"
                      :label="scope.row.libraryId"
                      @change="selectRowChange"
                    >
                      &nbsp;
                    </el-radio>
                  </div>
                </template>
              </el-table-column>
              <el-table-column>
                <template
                  slot="header"
                >
                  <p style="margin: 0">
                    商品名称(中文)
                  </p>
                  <p style="margin: 0">
                    商品名称(英文)
                  </p>
                </template>
                <template slot-scope="scope">
                  <p style="margin: 0">
                    {{ scope.row.cnName }}
                  </p>
                  <p style="margin: 0">
                    {{ scope.row.enName }}
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                label="商品类别"
                width="83"
              >
                <template slot-scope="scope">
                  {{ scope.row.title }}
                </template>
              </el-table-column>
              <el-table-column
                label="价格/单位"
                width="90"
              >
                <template slot-scope="scope">
                  {{ scope.row.price + ' / ' + scope.row.unitName }}
                </template>
              </el-table-column>
              <el-table-column
                width="90"
              >
                <template
                  slot="header"
                >
                  <p style="margin: 0">
                    品牌
                  </p>
                  <p style="margin: 0">
                    型号
                  </p>
                </template>
                <template slot-scope="scope">
                  <p style="margin: 0">
                    {{ scope.row.brand }}
                  </p>
                  <p style="margin: 0">
                    {{ scope.row.size }}
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                width="240"
              >
                <template
                  slot="header"
                >
                  <p style="margin: 0">
                    材质(中文)
                  </p>
                  <p style="margin: 0">
                    材质(英文)
                  </p>
                </template>
                <template slot-scope="scope">
                  <p style="margin: 0">
                    {{ scope.row.cnMaterial }}
                  </p>
                  <p style="margin: 0">
                    {{ scope.row.enMaterial }}
                  </p>
                </template>
              </el-table-column>
              <el-table-column>
                <template
                  slot="header"
                >
                  <p style="margin: 0">
                    用途(中文)
                  </p>
                  <p style="margin: 0">
                    用途(英文)
                  </p>
                </template>
                <template slot-scope="scope">
                  <p style="margin: 0">
                    {{ scope.row.cnPurpose }}
                  </p>
                  <p style="margin: 0">
                    {{ scope.row.enPurpose }}
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                label="商品图片"
                width="90"
              >
                <template slot-scope="scope">
                  <div
                    class="preview-img-wrap"
                  >
                    <div class="preview-img">
                      <img :src="ossFileUrl + scope.row.url">
                      <div class="mask">
                        <i
                          class="el-icon-view mask-view-icon"
                          @click="handlePreview(ossFileUrl + scope.row.url)"
                        />
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :current-page.sync="dialogPagination.page"
              :page-size="dialogPagination.size"
              layout="total, prev, pager, next"
              :total="dialogPagination.total"
              style="text-align: right;"
              @size-change="dialogPaginationSizeChange"
              @current-change="dialogPaginationCurrentChange"
            />
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="商品照片"
      :visible.sync="dialogVisible"
      width="500px"
      append-to-body
    >
      <img
        width="100%"
        :src="previewUrl"
      >
    </el-dialog>
    <el-dialog
      :visible="showFileModel"
      width="850px"
      title="认证文件"
      :close-on-click-modal="false"
      @close="hideFileList"
    >
      <div>
        <el-table
          v-loading="innerTableLoading"
          :data="fileList"
        >
          <el-table-column
            width="100"
            property="status"
            label="文件状态"
          >
            <template slot-scope="inScope">
              {{ (fileStatus.find(e => e.id === inScope.row.status) || {}).name }}
            </template>
          </el-table-column>
          <el-table-column
            min-width="150"
            property="fileName"
            label="文件名"
          />
          <el-table-column
            min-width="150"
            label="拒绝原因"
          >
            <template slot-scope="inScope">
              {{ inScope.row.status === 4 ? inScope.row.reason : '' }}
            </template>
          </el-table-column>
          <el-table-column
            width="250"
            property="address"
            label="操作"
          >
            <div
              slot-scope="inScope"
              style="display: flex;align-items: center"
            >
              <el-button
                v-if="inScope.row.status !== 2 && inScope.row.status !== 3"
                type="text"
                size="mini"
                @click="delFileItem(inScope.$index, inScope.row)"
              >
                删除
              </el-button>
              <el-button
                v-if="inScope.row.url"
                type="text"
                size="mini"
                @click="downloadFileItem(inScope.row.url)"
              >
                文件下载
              </el-button>
              <el-upload
                action
                :multiple="false"
                :limit="1"
                :show-file-list="false"
                :http-request="(data) => uploadFile(data, inScope.row)"
                style="display: inline-block;margin: 0 10px;"
              >
                <el-button
                  size="small"
                  type="text"
                >
                  <span v-if="!inScope.row.url">上传</span>
                  <span v-else>重新上传</span>
                </el-button>
              </el-upload>
              <el-button
                v-if="inScope.row.url && inScope.row.status === 1"
                type="text"
                size="mini"
                @click="auditFileItem(2, inScope.$index)"
              >
                审核
              </el-button>
              <el-button
                v-if="inScope.row.url && inScope.row.status === 2"
                type="text"
                size="mini"
                style="margin-right: 10px"
                @click.stop="auditFileItem(3, inScope.$index)"
              >
                审核通过
              </el-button>
              <el-popover
                v-model="inScope.row.isShowPopover"
                placement="bottom"
                width="300"
                title=""
                trigger="manual"
                @click.stop="() => {}"
              >
                <div
                  class="form"
                  style="display: flex;"
                >
                  <div style="white-space: nowrap;margin-right: 5px;">
                    拒绝原因
                  </div>
                  <el-input
                    v-model="reason"
                    type="textarea"
                    :autosize="{minRows: 3, maxRows: 6}"
                    placeholder="请输入内容"
                  />
                </div>
                <div style="text-align: right; margin-top: 10px">
                  <el-button
                    size="mini"
                    @click="popoverHide"
                  >
                    取消
                  </el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="auditFileItem(4, inScope.$index)"
                  >
                    保存
                  </el-button>
                </div>
                <el-button
                  v-show="inScope.row.url && inScope.row.status === 2"
                  slot="reference"
                  type="text"
                  size="mini"
                  @click.stop="popoverShow(inScope.row)"
                >
                  审核拒绝
                </el-button>
              </el-popover>
            </div>
          </el-table-column>
        </el-table>
      </div>
      <!--<div style="text-align: right; margin-top: 10px">
        <el-button
          slot="footer"
          type="primary"
          size="mini"
          @click="saveFileList"
        >
          保存
        </el-button>
      </div>-->
    </el-dialog>
    <el-dialog
      title="商品类别"
      :visible.sync="categoryVisible"
      width="800px"
      append-to-body
    >
      <div
        class="search-input"
      >
        <el-input
          v-model="keyWord"
          size="small"
          style="width: 300px"
          placeholder="请输入内容"
        />
        <el-button
          type="text"
          size="mini"
          @click="clearSelect"
        >
          清除选择
        </el-button>
      </div>
      <div class="modal-content">
        <div class="left-box">
          <div class="content-title">
            <div class="title">
              已选择
            </div>
            <div class="country">
              {{ form.categoryName }}
            </div>
          </div>
          <div
            v-if="productClassList.length"
            class="left-content"
          >
            <div
              v-for="item in productClassList"
              :key="item.value"
              class="item"
              :class="{active: selectCategory.value === item.value}"
              @click="selectCategoryClick(item)"
            >
              {{ item.label }}
            </div>
          </div>
          <el-empty
            v-else
            description="暂无数据"
          />
        </div>
        <div class="right-box">
          <el-table
            :data="subProductClassList"
            height="500px"
            style="width: 100%;"
            border
          >
            <el-table-column
              width="50"
            >
              <template slot-scope="scope">
                <div style="text-align: center;">
                  <el-radio
                    v-model="form.categoryId"
                    :label="scope.row.value"
                    @change="selectCategoryChange"
                  >
                    &nbsp;
                  </el-radio>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="所属大类"
              prop="pCategory"
            />
            <el-table-column
              label="类别名称"
              prop="label"
            />
            <el-table-column
              label="备注"
              show-overflow-tooltip
              prop="remarks"
            />
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getOrderBatches as getOrderDetails, auditOrder } from '@/api/orderlist-at-whole'
import { getFile } from '@/api/system-in-commodity-audit'
import {
  fullOrderAuditProduct,
  getCustomsCode,
  getCurrencyByCountry,
  getProductClassList,
  getProductList,
  getRates,
  fullOrderAuditProductFile
} from '@/api/orderlist-at-commodity-audit'
import { uploadFile, deleteFile } from '@/api/orderlist-at-trailer'

  @Component({
    name: ''
  })
export default class extends Vue {
    private ossFileUrl: any = process.env.VUE_APP_OSS_PATH
    private reason: string = ''
    private auditStatus: any = ''
    private keyWord: any = ''
    private loading: boolean = false
    private categoryVisible: boolean = false
    private loadingProduct: boolean = false
    private dialogLoading: boolean = false
    private visible: boolean = false
    private showFileModel: boolean = false
    private dialogVisible: boolean = false
    private previewUrl: boolean = false
    private innerTableLoading: boolean = false
    private clearanceChecked: boolean = false
    private transportChecked: boolean = false
    private selectRowId: any = ''
    private clearanceSelectList: any[] = []
    private productList: any[] = []
    private clearanceList: any[] = []
    private transportSelectList: any[] = []
    private transportList: any[] = []
    private tableData: any[] = []
    private fileList: any[] = []
    private fileListCopy: any[] = []
    private allProductClassList: any[] = []
    private costList: any[] = []
    private auditList: any[] = [
      {
        id: 0,
        name: '待审核'
      },
      {
        id: 1,
        // name: '待确认'
        name: '已通过'
      },
      {
        id: 2,
        name: '已拒绝'
      }
    ]
    private fileStatus: any[] = [
      {
        id: 0,
        name: '待上传'
      },
      {
        id: 1,
        name: '待审核'
      },
      {
        id: 2,
        name: '审核中'
      },
      {
        id: 3,
        name: '审核通过'
      },
      {
        id: 4,
        name: '审核拒绝'
      }
    ]
    private whiteCountryList: any[] = [
      // {
      //   countryId: 'US',
      //   currencyId: 'USD'
      // },
      // {
      //   countryId: 'CA',
      //   currencyId: 'CAD'
      // },
      // {
      //   countryId: 'AU',
      //   currencyId: 'AUD'
      // },
      // {
      //   countryId: 'JP',
      //   currencyId: 'USD'
      // },
      {
        countryId: 'CN',
        currencyId: 'RMB'
      }
    ]
    private pagination: any = {
      page: 1,
      size: 10,
      total: 0
    }
    private dialogPagination: any = {
      page: 1,
      size: 10,
      total: 0
    }
    private orderInfo: any = {}
    private lscConfig: any = {}
    private searchForm: any = {
      range: '1',
      nameZh: '',
      nameEn: ''
    }
    private showDialogRow: any = {}
    private selectRow: any = {}
    private selectCategory: any = {}
    private form: any = {
      categoryId: '',
      categoryName: '',
      // hsCode: '',
      // tax: '',
      suggestedPrice: '',
      remarks: '',
      auditStatus: 1
      // reason: ''
    }
    private formRules: any = {
      // hsCode: [{ required: true, message: '海关编码不能为空', trigger: 'blur' }],
      auditStatus: [{ required: true, message: '请选择审核', trigger: 'blur' }],
      remarks: [{ required: true, message: '请填写拒绝原因', trigger: 'blur' }],
      categoryId: [{ required: true, message: '请选择商品类别', trigger: 'change' }]
      // tax: [{ required: true, message: '请输入税金', trigger: 'blur' }],
      // suggestedPrice: [{ required: true, message: '请输入建议单价', trigger: 'blur' }],
      // reason: [{ required: true, message: '请输入拒绝原因', trigger: 'blur' }]
    }
    private orderId: any = ''
    private showFileListRow: number = 0

    get tax() {
      return this.tableData.reduce((tax: number, item: any) => {
        tax += (item.tax || 0)
        return tax
      }, 0)
    }
    get tableDataPage() {
      return this.tableData.slice((this.pagination.page - 1) * this.pagination.size, (this.pagination.page) * this.pagination.size)
    }
    get productClassList() {
      return this.allProductClassList.filter((p: any) => {
        const c = p.children.filter((s: any) => s.label.indexOf(this.keyWord) !== -1)
        if (c.length) {
          return p
        }
        return p.label.indexOf(this.keyWord) !== -1
      })
    }
    get subProductClassList() {
      const list = this.selectCategory.children || []
      return list.map((e: any) => {
        return {
          ...e,
          pCategory: this.selectCategory.label
        }
      }).filter((p: any) => p.label.indexOf(this.keyWord) !== -1)
    }

    /* methods */
    private mounted() {
      document.body.addEventListener('click', this.popoverHide)
    }
    private beforeDestroy() {
      document.body.removeEventListener('click', this.popoverHide)
    }
    private popoverHide() {
      this.fileList = this.fileList.map((e: any) => {
        e.isShowPopover = false
        return e
      })
    }
    private showCategoryDialog() {
      this.categoryVisible = true
      this.selectCategory = this.allProductClassList.find((p: any) => {
        const a = p.children.find((c: any) => c.value === this.form.categoryId)
        return !!(a)
      }) || {}
    }
    private clearSelect() {
      this.form.categoryId = ''
      this.form.categoryName = ''
    }
    private selectCategoryClick(item: any) {
      this.selectCategory = item
    }
    private selectCategoryChange() {
      const category: any = this.subProductClassList.find((c: any) => c.value === this.form.categoryId) || {}
      this.form.categoryName = category.label
      this.categoryVisible = false
    }
    private uploadFile(data: any, row: any) {
      const formData = new FormData()
      const file = new File([data.file], data.file.name.split('.')[0] + new Date().getTime() + '.' + data.file.name.split('.')[1], { type: data.file.type })
      formData.append('file', file)
      this.innerTableLoading = true
      uploadFile(formData).then((res: any) => {
        if (res.success) {
          const result = res.data
          row.url = result.objectName
          row.status = 1
          this.saveFileList(row)
        } else {
          this.innerTableLoading = false
          this.$message.error('文件上传失败')
        }
      }).catch((err: any) => {
        this.innerTableLoading = false
        this.$message.error('文件上传失败')
        return err
      })
    }
    private saveAuditClick() {
      const editForm: any = this.$refs.form
      editForm.validate((valid: any) => {
        if (valid) {
          if (this.form.auditStatus === 2 && !this.form.remarks) {
            this.$message.error('请填写拒绝原因')
            return
          }
          const batchCode = this.showDialogRow.orderCode
          const goodIndex = this.showDialogRow.gIndex
          let batchIndex: any = null
          let currentGood: any = null
          const params: any = {
            goods: this.orderInfo.batches.reduce((good: any, b: any, i: number, list: any[]) => {
              if (b.code === batchCode) {
                const goods = b.goods || []
                batchIndex = i
                goods.forEach((g: any, index: number) => {
                  if (index === goodIndex) {
                    g.suggestedPrice = this.form.suggestedPrice
                    g.remarks = this.form.remarks
                    g.auditStatus = this.form.auditStatus
                    g.categoryId = this.form.categoryId
                    g.categoryName = this.form.categoryName
                    g.result = this.costList
                    if (this.selectRowId) {
                      // g.declareId = this.selectRowId
                      g.libraryId = this.selectRow.libraryId
                      g.hsCode = this.selectRow.code
                    }
                    currentGood = {
                      ...g
                    }
                    good = {
                      ...g
                    }
                  }
                })
              }
              return good
            }, {}),
            code: this.orderInfo.code,
            orderId: this.orderId,
            goodIndex,
            batchIndex
          }
          if (this.selectRowId) {
            // 关联不生成
            params.flag = 1
            // params.declareId = this.selectRowId
          }
          this.saveAudit(params)
        }
      })
    }
    private saveAudit(params: any) {
      this.dialogLoading = true
      fullOrderAuditProduct(params).then(() => {
        this.dialogLoading = false
        this.$message.success('操作成功')
        this.closeDialog()
      }).catch(_ => {
        this.dialogLoading = false
      })
    }
    private handleAudit(batches: any[]) {
      const auditSuccess = batches.every((b: any) => {
        const goods: any[] = b.goods || []
        return goods.every((g: any) => g.auditStatus === 1)
      })
      const auditErr = batches.some((b: any) => {
        const goods: any[] = b.goods || []
        return goods.some((g: any) => g.auditStatus === 2)
      })
      const params = {
        audit: '3',
        reason: '',
        orderId: this.orderId,
        buyerType: this.orderInfo.buyer.type,
        sellerType: this.orderInfo.seller.type
      }
      if (auditSuccess) {
        params.audit = '1'
        auditOrder(params).then((res: any) => res).catch((err: any) => err)
      }
      if (auditErr) {
        params.reason = this.form.auditStatus === 2 ? this.form.remarks : this.orderInfo.reason
        params.audit = '2'
        auditOrder(params).then((res: any) => res).catch((err: any) => err)
      }
    }
    private getRates() {
      const params = {
        // hsCode: '1201.10.0000',
        hsCode: this.selectRow.code,
        ic: (this.orderInfo.country || {}).key,
        state: (this.orderInfo.consignee || {}).provinceCode
      }
      getRates(params).then((res: any) => {
        this.costList = res.data || []
      }).catch((err: any) => {
        this.costList = []
        return err
      })
    }
    private getProductClassList() {
      const params = {
        parentId: 0,
        type: 2
      }
      getProductClassList(params).then((res: any) => {
        this.allProductClassList = (res.data || []).map((item: any) => {
          item.children = item.children.map((c: any) => {
            return {
              ...c,
              label: c.title,
              value: c.id
            }
          })
          return {
            ...item,
            label: item.title,
            value: item.id
          }
        })
      }).catch(() => {
        this.allProductClassList = []
      })
    }
    private popoverShow(row: any) {
      this.reason = row.reason || ''
      this.fileList = this.fileList.map((e: any) => {
        e.isShowPopover = false
        if (e.id === row.id) {
          e.isShowPopover = true
        }
        return e
      })
    }
    private handleBack() {
      this.$emit('goBack')
    }
    private show(id: any) {
      this.orderId = id
      this.loadData()
      this.getClearanceList()
      this.getTransportList()
    }
    private clearSelectRow() {
      this.selectRow = {}
      this.selectRowId = ''
      this.costList = []
    }
    private selectRowChange() {
      const selectRow = this.productList.find((e: any) => e.libraryId === this.selectRowId)
      this.selectRow = selectRow || {}
      this.costList = []
      if (this.selectRow.code) {
        this.getRates()
      }
    }
    private rangeChange() {
      this.getProductList(1)
    }
    private dialogPaginationSizeChange(size: any) {
      this.dialogPagination.size = size
      this.getProductList()
    }
    private dialogPaginationCurrentChange(current: any) {
      this.dialogPagination.page = current
      this.getProductList()
    }
    private getProductList(page?: number) {
      if (page === 1) {
        this.selectRow = {}
        this.selectRowId = ''
        this.costList = []
        this.dialogPagination.page = 1
      }
      const orderCustomer = this.orderInfo.orderCustomer || {}
      const params = {
        model: {
          cnName: this.searchForm.nameZh,
          countryId: (this.orderInfo.country || {}).key,
          customerId: this.searchForm.range === '1' ? orderCustomer.id : '',
          enName: this.searchForm.nameEn
          // startCountryId: (this.orderInfo.lscConfig || {}).countryId
        },
        page: this.dialogPagination.page,
        size: this.dialogPagination.size
      }
      if (this.auditStatus === 1) {
        params.size = 999
      }
      this.loadingProduct = true
      getProductList(params).then((res: any) => {
        this.loadingProduct = false
        const data = res.data || {}
        if (this.auditStatus === 1) {
          const libraryId = this.showDialogRow.libraryId
          this.productList = (data.result || []).filter((e: any) => e.libraryId === libraryId)
          if (this.productList.length) {
            this.selectRowId = libraryId
            this.selectRowChange()
          }
          this.dialogPagination.total = this.productList.length || 0
        } else {
          this.productList = data.result || []
          this.dialogPagination.total = data.total || 0
        }
      }).catch(() => {
        this.loadingProduct = false
        this.productList = []
        this.dialogPagination.total = 0
      })
    }
    private closeDialog() {
      this.selectRowId = ''
      this.showDialogRow = {}
      this.selectRow = {}
      this.costList = []
      this.form = {
        categoryId: '',
        categoryName: '',
        // hsCode: '',
        // tax: '',
        suggestedPrice: '',
        remarks: '',
        auditStatus: 1
        // reason: ''
      }
      this.visible = false
      this.loadData()
    }
    // 审核
    private showAudit(row: any) {
      // 审核
      this.visible = true
      this.dialogLoading = true
      this.auditStatus = row.auditStatus
      this.form = {
        categoryId: row.categoryId || '',
        categoryName: row.categoryId ? row.categoryName : '',
        // hsCode: row.hsCode,
        // tax: row.tax,
        suggestedPrice: row.suggestedPrice,
        remarks: row.remarks,
        auditStatus: row.auditStatus === 0 ? 1 : row.auditStatus
        // reason: row.reason
      }
      this.dialogLoading = false
      let fileUrl = ''
      if (row.picture) {
        fileUrl = process.env.VUE_APP_OSS_PATH + row.picture
      }
      const batchCode = row.orderCode
      const batchSummaries = this.orderInfo.batchSummaries || []
      batchSummaries.forEach((e: any) => {
        if (e.code === batchCode) {
          row.batchWeights = e.weights
        }
      })
      this.showDialogRow = {
        ...row,
        fileUrl
      }
      this.searchForm.nameZh = this.showDialogRow.goodsName
      this.searchForm.nameEn = this.showDialogRow.goodsAlias
      this.getProductList()
      this.getProductClassList()
    }
    private handlePreview(url: any) {
      this.dialogVisible = true
      this.previewUrl = url
    }
    private getClearanceList() {
      getFile({ type: 2 }).then((res: any) => {
        this.clearanceList = (res.data || []).map((e: any) => {
          return {
            ...e,
            type: 2
          }
        })
      }).catch(() => {
        this.clearanceList = []
      })
    }
    private getTransportList() {
      getFile({ type: 1 }).then((res: any) => {
        this.transportList = (res.data || []).map((e: any) => {
          return {
            ...e,
            type: 1
          }
        })
      }).catch(() => {
        this.transportList = []
      })
    }
    private hideFileList() {
      this.showFileModel = false
      this.loadData()
    }
    private handlerChange() {
      const selectAllList = [...this.clearanceSelectList, ...this.transportSelectList]
      const allList = [...this.clearanceList, ...this.transportList]
      const fileList: any[] = []
      selectAllList.forEach((e: any) => {
        const tamp = allList.find((item: any) => item.id === e)
        if (tamp) {
          const c = this.fileListCopy.find((item: any) => item.id === e)
          fileList.push({
            isShowPopover: false,
            id: c ? c.id : tamp.id,
            fileName: c ? c.fileName : tamp.fileName,
            status: c ? c.status : 0,
            type: c ? c.type : tamp.type,
            url: c ? c.url : ''
          })
        }
      })
      this.fileList = fileList
      this.disList()
    }
    private checkChange(type: string) {
      if (type === 'c') {
        this.clearanceSelectList = []
        this.fileList = this.fileList.filter((e: any) => e.type !== 2)
      }
      if (type === 't') {
        this.transportSelectList = []
        this.fileList = this.fileList.filter((e: any) => e.type !== 1)
      }
      this.disList()
    }
    private downloadFileItem(url: string) {
      const reg = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i
      if (url) {
        if (reg.test(url)) {
          window.open(url)
        } else {
          window.open(process.env.VUE_APP_OSS_PATH + url)
        }
      }
    }
    private delFileItem(index: number, row: any) {
      this.fileList = this.fileList.filter((e: any) => e.id !== row.id)
      this.clearanceSelectList = this.fileList.filter((e: any) => e.type === 2).map((e: any) => e.id)
      this.transportSelectList = this.fileList.filter((e: any) => e.type === 1).map((e: any) => e.id)
      if (this.clearanceSelectList.length) {
        this.clearanceChecked = true
      } else {
        this.clearanceChecked = false
      }
      if (this.transportSelectList.length) {
        this.transportChecked = true
      } else {
        this.transportChecked = false
      }
      this.disList()
      const r: any = {
        ...row
      }
      r.deleted = 1
      this.saveFileList(r)
      this.deleteFile(row)
    }
    private deleteFile(row: any) {
      if (!row.url) return
      const reg = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i
      let url = row.url
      if (reg.test(row.url)) {
        url = row.url.replace(process.env.VUE_APP_OSS_PATH, '')
      }
      const params = {
        ifPublic: true,
        fileList: [url]
      }
      deleteFile(params).then((res) => {
        return res
      }).catch((err) => {
        return err
      })
    }
    private auditFileItem(status: number, index: number) {
      if (status === 4 && !this.reason) {
        this.$message.error('请填写拒绝原因')
        return
      }
      let row: any = null
      this.fileList = this.fileList.map((e: any, i: number) => {
        if (index === i) {
          e.reason = ''
          if (status === 4) {
            e.reason = this.reason
          }
          e.status = status
          row = {
            ...e
          }
        }
        return e
      })
      this.saveFileList(row)
    }
    private saveFileList(fileRow?: any) {
      const row: any = this.showFileListRow
      const batchCode = row.orderCode
      const goodIndex = row.gIndex
      let batchIndex: any = null
      let declareId: any = null
      const params: any = {
        goods: this.orderInfo.batches.reduce((good: any, b: any, i: number, list: any[]) => {
          if (b.code === batchCode) {
            batchIndex = i
            const goods = b.goods || []
            goods.forEach((g: any, index: number) => {
              if (index === goodIndex) {
                declareId = g.declareId
                g.list = this.fileList
                good = {
                  ...g
                }
              }
            })
          }
          return good
        }, {}),
        code: this.orderInfo.code,
        batchIndex,
        goodIndex
      }
      if (fileRow) {
        params.file = {
          declareId,
          ...fileRow
        }
      }
      this.innerTableLoading = true
      const newParams = {
        code: params.code,
        declareId: params.goods.declareId,
        file: params.file,
        goodId: params.goods.pid
        // orderId: this.orderInfo.id
      }
      fullOrderAuditProductFile(newParams).then((res: any) => {
        this.popoverHide()
        this.innerTableLoading = false
        this.$message.success('操作成功')
      }).catch(_ => {
        this.innerTableLoading = false
      })
    }
    private showFileList(row: any) {
      this.showFileModel = true
      this.showFileListRow = row
      this.fileList = row.list.map((e: any) => {
        e.isShowPopover = false
        return e
      })
      this.fileListCopy = JSON.parse(JSON.stringify(row.list))
      this.clearanceSelectList = this.fileList.filter((e: any) => e.type === 2).map((e: any) => e.id)
      this.transportSelectList = this.fileList.filter((e: any) => e.type === 1).map((e: any) => e.id)
      if (this.clearanceSelectList.length) {
        this.clearanceChecked = true
      } else {
        this.clearanceChecked = false
      }
      if (this.transportSelectList.length) {
        this.transportChecked = true
      } else {
        this.transportChecked = false
      }
      this.disList()
    }
    private disList() {
      this.clearanceList = this.clearanceList.map((e: any) => {
        e.disabled = false
        const tamp = this.fileList.find((f: any) => f.id === e.id) || {}
        if (this.clearanceSelectList.indexOf(e.id) !== -1 && (tamp.status === 2 || tamp.status === 3)) {
          e.disabled = true
        }
        return e
      })
      this.transportList = this.transportList.map((e: any) => {
        e.disabled = false
        const tamp = this.fileList.find((f: any) => f.id === e.id) || {}
        if (this.transportSelectList.indexOf(e.id) !== -1 && tamp.url) {
          e.disabled = true
        }
        return e
      })
    }
    private handleSizeChange(size: any) {
      this.pagination.size = size
    }
    private handleCurrentChange(current: any) {
      this.pagination.page = current
    }
    private loadData() {
      const params = {
        id: this.orderId
      }
      this.loading = true
      getOrderDetails(params).then((res: any) => {
        this.loading = false
        const data = res.data || {}
        this.orderInfo = JSON.parse(JSON.stringify(data))
        this.lscConfig = data.lscConfig || {}
        const batches = data.batches || []
        // const batchSummaries = data.batchSummaries || []
        this.tableData = batches.reduce((list: any[], item: any) => {
          const goods = item.goods || []
          // const b = batchSummaries.find((e: any) => e.code === item.code)
          goods.forEach((g: any, index: number) => {
            list.push({
              ...g,
              goodNum: g.quantity,
              orderCode: item.code,
              gIndex: index
            })
          })
          return list
        }, [])
        this.pagination.total = this.tableData.length
      }).catch(_ => {
        this.loading = false
      })
    }
}
</script>

<style lang="scss" scoped>
  .dialog-order-info{
    width: 100%;
    padding-bottom: 10px;
    overflow: hidden;
    border-bottom: 1px solid #E6E6E6;
    .dialog-order-info-item{
      float: left;
      display: flex;
      align-items: center;
      padding: 5px 0;
      .label{
        color: #909399;
      }
      .value{
        color: #303133;
      }
      &.w100{
        width: 100%;
      }
      &.w50{
        width: 50%;
      }
    }
  }
  .dialog-table{
    padding-top: 20px;
    border-top: 1px solid #E6E6E6;
    .search-form{
      padding: 10px 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .search-form-item{
        display: flex;
        align-items: center;
        margin-left: 10px;
        .label{
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 20px;
          color: #303133;
          margin-right: 10px;
        }
      }
    }
    .select-row-info{
      margin-bottom: 20px;
      background: rgba(255, 125, 25, 0.05);
      border: 1px solid #FFDBBF;
      border-radius: 4px;
      display: flex;
      align-items: center;
      padding: 5px 0;
      .info-item{
        /*display: flex;*/
        /*align-items: center;*/
        &.option{
          width: 57px;
          text-align: center;
          /*color: #FFDBBF;*/
        }
        &.name{
          width: 184px;
        }
        &.code{
          width: 138px;
        }
        &.product-class{
          width: 83px;
        }
        &.unit{
          width: 90px;
        }
        &.model{
          width: 90px;
        }
        &.caizhi{
          width: 240px;
        }
        &.yongtu{
          flex: 1;
        }
        p{
          margin: 0;
        }
      }
    }
    .cost-info{
      margin-bottom: 20px;
      padding: 0 20px;
      background: #EAEEF4;
      border-radius: 4px;
      overflow: hidden;
      .cost-info-item{
        float: left;
        width: 33%;
        display: flex;
        padding: 8px 0;
      }
    }
  }
  .tax-info{
    width: 100%;
    overflow: hidden;
    border-bottom: 1px solid #E6E6E6;
    padding: 5px 20px;
    background: #f0f2fa;
    border-radius: 4px;
    .tax-info-item{
      float: left;
      display: flex;
      align-items: center;
      padding: 5px 0;
      .label{
        color: #909399;
      }
      .value{
        color: #303133;
      }
      &.w100{
        width: 100%;
      }
      &.w33{
        width: 33.3%;
      }
    }
  }
  .search-input{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
  }
  .modal-content{
    /*margin-top: 20px;*/
    display: flex;
    .left-box{
      width: 300px;
      /*height: 530px;*/
      border: 1px solid #DBDFE5;
      .content-title{
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #DBDFE5;
        padding: 9px 10px;
        .title{
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: bold;
          line-height: 20px;
          color: #303133;
        }
        .country{
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 17px;
          color: #323232;
        }
      }
      .left-content{
        height: 460px;
        overflow: auto;
        .item{
          cursor: pointer;
          width: 100%;
          padding: 10px;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #303133;
          transition: all .3s;
          &:hover{
            background: #F7F7F7;
          }
          &.active{
            background: #F7F7F7;
          }
        }
      }
    }
    .right-box{
      margin-left: 20px;
      flex: 1;
    }
  }
  .preview-img-wrap{
    width: 80px;
    height: 80px;
    padding: 5px;
    object-fit: cover;
    overflow: hidden;
    border: 1px solid #eee;
    .preview-img{
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
      img{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
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
        background: rgba(0, 0, 0, .4);
        opacity: 0;
        transition: all .5s;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        &:hover{
          opacity: 1;
        }
      }
    }
  }
  ::v-deep{
    .el-dialog__body{
      padding: 10px 20px;
    }
  }
</style>
