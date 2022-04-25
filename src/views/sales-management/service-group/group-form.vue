<template>
  <el-dialog
    :title="isEdit ? '编辑组' : '新增组'"
    :visible="visible"
    :close-on-click-modal="false"
    width="500px"
    @close="close"
  >
    <div v-loading="loading">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="100px"
        size="small"
      >
        <el-form-item
          label="服务组名称"
          prop="name"
        >
          <el-input
            v-model="form.name"
            clearable
            size="small"
            placeholder="请输入"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item
          label="国家"
          prop="countryId"
        >
          <el-select
            v-model="form.countryId"
            placeholder="请选择"
            style="width:100%;"
            clearable
            filterable
            :filter-method="filterCountry"
            size="small"
            :loading="selectLoading"
            @focus="getCountryList"
            @change="countryChange"
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
          label="服务"
          class="is-required"
        >
          <el-input
            v-model="form.serviceNames"
            size="small"
            placeholder="请选择"
            disabled
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="showService"
            />
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        :disabled="loading"
        size="small"
        @click="close"
      >
        取 消
      </el-button>
      <el-button
        :disabled="loading"
        type="primary"
        size="small"
        @click="submit"
      >
        保 存
      </el-button>
    </div>
    <el-dialog
      title="关联服务"
      :visible.sync="serviceVisible"
      :close-on-click-modal="false"
      append-to-body
      width="960px"
      @close="closeServiceDialog"
    >
      <div v-loading="serviceLoading">
        <div style="margin-bottom: 10px">
          <span>业务类型：</span>
          <el-radio-group
            v-model="form.subtypeId"
            size="small"
            @change="typeChange"
          >
            <el-radio-button
              v-for="item in subtypeList"
              :key="item.id"
              :label="item.id"
            >
              {{ item.name }}
            </el-radio-button>
          </el-radio-group>
        </div>
        <el-transfer
          v-model="serviceOption"
          filterable
          :filter-method="filterMethod"
          :titles="['选择关联服务', '已关联服务']"
          :props="{key: 'id', label: 'name'}"
          filter-placeholder="输入搜索"
          :data="serviceList"
          style="height: 500px;"
        />
        <div
          slot="footer"
          style="text-align: right;margin: 20px 40px 0;"
        >
          <el-button
            size="small"
            @click="closeServiceDialog"
          >
            取 消
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="submitService"
          >
            确 定
          </el-button>
        </div>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getCountryList,
  getLscComplicatedList,
  getServiceSubtypeList,
  saveGroup,
  getGroupItems
} from '@/api/sales-of-groups'

@Component({
  name: '',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  }
})
export default class extends Vue {
    /* data */
    private visible: boolean = false
    private serviceVisible: boolean = false
    private loading: boolean = false
    private selectLoading: boolean = false
    private serviceLoading: boolean = false
    private countryList: any[] = []
    private allCountryList: any[] = []
    private serviceList: any[] = []
    private subtypeList: any[] = []
    private serviceItem: any[] = []
    private serviceOption: any[] = []
    private serviceType: string = ''
    private serviceCountry: string = ''
    private form: any = {
      name: '',
      status: '1',
      countryId: '',
      countryName: '',
      serviceIds: [],
      serviceNames: '',
      subtypeId: '',
      subtypeName: ''
    }
    private editRow: any = {}
    private rules: any = {
      name: { required: true, message: '请输入服务组名称', trigger: 'blur' },
      countryId: { required: true, message: '请选择目的国', trigger: 'change' },
      serviceIds: { required: true, message: '请选择关联服务', trigger: 'blur' }
    }
    /* methods */
    private filterCountry(value: any) {
      if (!value) {
        this.countryList = this.allCountryList
        return
      }
      this.countryList = this.allCountryList.filter((item: any) => {
        const str = `${item.name}-${item.alias}`
        return str.toUpperCase().indexOf(value.toUpperCase()) !== -1
      })
    }
    private submit() {
      const form: any = this.$refs.form
      form.validate((valid: any) => {
        if (valid) {
          if (this.form.serviceIds.length <= 0) {
            this.$message.error('请选择关联服务')
            return
          }
          const country = this.countryList.find((c: any) => c.id === this.form.countryId) || {}
          const subtype = this.subtypeList.find((s: any) => s.id === this.form.subtypeId) || {}
          const { serviceIds, serviceNames, status, ...obj } = this.form
          const params: any = {
            ...obj,
            status: status || '1',
            countryName: country.name || '',
            subtypeName: subtype.name || '',
            lscIds: serviceIds
          }
          this.loading = true
          saveGroup(params).then(() => {
            this.loading = false
            this.$message.success('保存成功')
            this.close()
            this.$emit('save-success')
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
    private async countryChange() {
      this.form.serviceIds = []
      this.form.serviceNames = ''
      this.serviceOption = []
      if (this.form.subtypeId) await this.getPrivatelineList()
    }
    private async typeChange() {
      this.serviceOption = []
      if (this.form.id && this.serviceType === this.form.subtypeId && this.serviceCountry === this.form.countryId) {
        this.serviceOption = this.serviceItem.map((e: any) => e.id)
      }
      await this.getPrivatelineList()
    }
    private showService() {
      this.serviceVisible = true
      this.serviceOption = this.form.serviceIds
      this.getSubtypeList()
    }
    private async getPrivatelineList() {
      const params = {
        subtypeId: this.form.subtypeId,
        countryId: this.form.countryId
      }
      this.serviceLoading = true
      await getLscComplicatedList(params).then((res: any) => {
        this.serviceLoading = false
        const data = res.data || []
        this.serviceList = data.filter((it: any) => it.status === '1').map((it: any) => {
          return {
            ...it,
            disabled: it.saleCreate === '1' && !(this.serviceOption.includes(it.id))
          }
        })
      }).catch(() => {
        this.serviceLoading = false
        this.serviceList = []
      })
    }
    private getSubtypeList() {
      this.serviceLoading = true
      const params:any = {
        typeId: '05'
      }
      getServiceSubtypeList(params)
        .then(async(res: any) => {
          this.serviceLoading = false
          const data = res.data || []
          this.subtypeList = data.filter((it: any) => it.id !== '3')
          if (this.subtypeList.length && !this.form.subtypeId) {
            this.form.subtypeId = this.subtypeList[0].id
            await this.getPrivatelineList()
          }
        }).catch((err: any) => {
          this.serviceLoading = false
          return err
        })
    }
    // 获取国家列表
    private async getCountryList() {
      this.selectLoading = true
      await getCountryList().then((res: any) => {
        this.selectLoading = false
        const data = res.data || {}
        this.countryList = data.result || []
        this.allCountryList = data.result || []
      }).catch((err: any) => {
        this.selectLoading = false
        this.countryList = []
        return err
      })
    }
    private resetForm() {
      this.form = {
        name: '',
        status: '1',
        countryId: '',
        countryName: '',
        serviceIds: [],
        serviceNames: '',
        subtypeId: '',
        subtypeName: ''
      }
      const form: any = this.$refs.form
      form.resetFields()
    }
    private filterMethod(query: any, item: any): boolean {
      const name = item.name || ''
      return name.indexOf(query) > -1
    }
    private close() {
      this.serviceType = ''
      this.serviceCountry = ''
      this.serviceOption = []
      this.serviceItem = []
      this.resetForm()
      this.visible = false
    }
    private closeServiceDialog() {
      this.serviceVisible = false
      this.serviceOption = []
    }
    private submitService() {
      this.form.serviceIds = this.serviceOption
      this.form.serviceNames = this.form.serviceIds.map((e: any) => {
        const service = this.serviceList.find((s: any) => e === s.id) || {}
        return service.name || ''
      }).join(',')
      this.serviceVisible = false
    }
    private async getLscGroupItems() {
      await getGroupItems({
        id: this.form.id
      })
        .then((res: any) => {
          const data = res.data || []
          this.serviceItem = JSON.parse(JSON.stringify(data))
          this.serviceOption = this.serviceItem.map((e: any) => e.id)
          this.form.serviceIds = data.map((e: any) => e.id)
          this.form.serviceNames = data.map((e: any) => e.name).join(',')
        }).catch(() => {
          this.form.serviceIds = []
          this.form.serviceNames = ''
        })
    }
    private async show(data?: any) {
      this.visible = true
      if (data) {
        // 编辑
        const { lscId, lscName, ...obj } = data
        this.form = { ...obj }
        this.serviceType = data.subtypeId
        this.serviceCountry = data.countryId
        this.loading = true
        await this.getLscGroupItems()
        await this.getPrivatelineList()
        await this.getCountryList()
        this.getSubtypeList()
        this.loading = false
      }
    }
}
</script>

<style scoped lang="scss">
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
  ::v-deep .el-dialog__body {
    padding: 0 20px 20px;
  }
</style>
