<template>
  <div v-loading="formLoading">
    <el-form
      ref="editForm"
      :model="selectForm"
      :rules="formRules"
      label-position="right"
      label-width="120px"
      size="small"
    >
      <el-form-item
        v-show="custId === '0'"
        label="所属公司"
        prop="custId"
      >
        <el-select
          v-model="selectForm.custId"
          :loading="selectLoading"
          placeholder="所属公司"
          style="width:100%;"
          size="small"
          filterable
          @focus="getSupplierList"
          @change="onCountryArea"
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
        label="州/省"
        prop="stateId"
      >
        <el-select
          v-model="selectForm.stateId"
          :loading="selectLoading"
          placeholder="请选择"
          clearable
          :disabled="!selectForm.countryId"
          filterable
          style="width: 100%"
          @focus="getStateList"
          @change="onStateChange"
        >
          <el-option
            v-for="item in stateList"
            :key="item.id"
            :label="`${item.name}-${item.alias}`"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="城市"
        prop="cityId"
      >
        <el-select
          v-model="selectForm.cityId"
          :loading="selectLoading"
          placeholder="请选择"
          clearable
          :disabled="!selectForm.stateId"
          filterable
          style="width: 100%"
          @focus="getCityList"
          @change="onCityChange"
        >
          <el-option
            v-for="item in cityList"
            :key="item.id"
            :label="`${item.name}-${item.alias}`"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="区/县"
        prop="countyId"
      >
        <el-select
          v-model="selectForm.countyId"
          :loading="selectLoading"
          placeholder="区/县"
          clearable
          :disabled="!selectForm.cityId"
          filterable
          style="width:100%;"
          @focus="getCountyList"
        >
          <el-option
            v-for="item in countyList"
            :key="item.id"
            :label="`${item.name}-${item.alias}`"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="关联用户"
        prop="userId"
      >
        <el-select
          v-model="selectForm.userId"
          :loading="selectLoading"
          clearable
          filterable
          style="width:100%;"
          placeholder="请选择"
          @focus="getUserList"
        >
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="`${item.realName}-${item.username}-${item.deptName}`"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="关联车辆"
        prop="vehicleId"
      >
        <el-select
          v-model="selectForm.vehicleId"
          :loading="selectLoading"
          clearable
          filterable
          style="width:100%;"
          placeholder="请选择"
          @focus="getVehicleList"
        >
          <el-option
            v-for="item in carList"
            :key="item.id"
            :label="item.plateNumber"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="是否接受加班"
        prop="overtime"
      >
        <el-radio-group
          v-model="selectForm.overtime"
          style="width:100%;"
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
        label="是否接受长途"
        prop="distance"
      >
        <el-radio-group
          v-model="selectForm.distance"
          style="width:100%;"
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
        label="司机姓名"
        prop="name"
      >
        <el-input
          v-model="selectForm.name"
          placeholder="请输入"
          :maxlength="10"
          style="width:100%;"
        />
      </el-form-item>

      <el-form-item
        label="证件号码"
        prop="certNo"
      >
        <el-input
          v-model="selectForm.certNo"
          placeholder="请输入"
          class="input-with-select"
          style="width:100%;"
          size="small"
        >
          <el-select
            slot="prepend"
            v-model="selectForm.certType"
            size="small"
            style="width:100px;"
            placeholder="请选择"
          >
            <el-option
              label="身份证"
              value="0"
            />
            <el-option
              label="护照"
              value="1"
            />
            <el-option
              label="港澳通行证"
              value="2"
            />
            <el-option
              label="其他"
              value="3"
            />
          </el-select>
        </el-input>
      </el-form-item>

      <el-form-item
        label="联系手机"
        prop="phone"
      >
        <el-input
          v-model="selectForm.phone"
          placeholder="请输入"
          style="width:100%;"
        />
      </el-form-item>

      <el-form-item
        label="电子邮箱"
        prop="email"
      >
        <el-input
          v-model="selectForm.email"
          placeholder="请输入"
          style="width:100%;"
        />
      </el-form-item>

      <el-form-item
        label="驾照日期"
        prop="expire"
      >
        <el-date-picker
          v-model="selectForm.expire"
          style="width: 100%;"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="年/月/日"
        />
      </el-form-item>
      <div>
        <el-form-item
          label="驾照照片"
          prop="photo"
        >
          <el-upload
            v-if="!imageUrl"
            action
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="uploadFile"
            class="avatar-uploader"
          >
            <i
              class="el-icon-plus avatar-uploader-icon"
            />
          </el-upload>
          <div
            v-else
            class="preview-img-wrap"
          >
            <div class="preview-img">
              <img :src="imageBase64">
              <div class="mask">
                <i
                  class="el-icon-view mask-view-icon"
                  @click="handlePreview"
                />
                <i
                  class="el-icon-delete"
                  @click="handleDelete"
                />
              </div>
            </div>
          </div>
        </el-form-item>
      </div>
    </el-form>
    <div
      style="text-align: right;padding-bottom: 20px;"
    >
      <el-button @click="cancel">
        取 消
      </el-button>
      <el-button
        type="primary"
        @click="handleSaveForm"
      >
        确 定
      </el-button>
    </div>
    <el-dialog
      title="驾照照片预览"
      :visible.sync="dialogVisible"
      append-to-body
    >
      <img
        width="100%"
        :src="imageBase64"
      >
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import {
  saveDriver,
  getSupplierList,
  getStateByCountry,
  getCityByState,
  getCountyByCity,
  getUserList,
  getVehicleList
} from '@/api/system-in-chauffeur-management'
import { getFilePath } from '@/api/jht-supplier-management'
import dayjs from 'dayjs'
import { Form } from 'element-ui'

export function initForm() {
  return {
    workStatus: 0,
    id: undefined,
    custId: undefined,
    custName: undefined,
    countryId: undefined,
    countyId: undefined,
    stateId: undefined,
    cityId: undefined,
    userId: undefined,
    vehicleId: undefined,
    overtime: true,
    distance: true,
    certNo: '',
    certType: '0',
    email: undefined,
    expire: undefined,
    name: undefined,
    phone: undefined,
    photo: ''
  }
}

@Component({
  name: ''
})
export default class extends Vue {
  private selectForm: any = initForm()
  private imageUrl: string = ''
  private imageBase64: string = ''
  private formLoading: boolean = false
  private selectLoading: boolean = false
  private dialogVisible: boolean = false
  private supplierList: any[] = []
  private stateList: any[] = []
  private cityList: any[] = []
  private countyList: any[] = []
  private userList: any[] = []
  private carList: any[] = []
  private props: any = {
    label: 'name',
    value: 'id'
  }
  private formRules = {
    custId: [
      { required: true, message: '请选择所属公司', trigger: 'change' }
    ],
    stateId: [{ required: true, message: '请选择州/省', trigger: 'change' }],
    cityId: [{ required: true, message: '请选择城市', trigger: 'change' }],
    countyId: [{ required: false, message: '请选择区/县', trigger: 'change' }],
    userId: [{ required: true, message: '请选择关联用户', trigger: 'change' }],
    name: [
      { required: true, message: '司机名称不能为空', trigger: 'change' }
    ],
    certNo: [
      { required: true, message: '证件号码不能为空', trigger: 'blur' },
      { validator: this.validatorCertNo, trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '联系手机不能为空', trigger: 'blur' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (value && reg.test(value)) {
            callback(new Error('联系手机不能有中文'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    email: [
      // { required: true, message: '电子邮箱不能为空', trigger: 'blur' },
      { type: 'email', message: '邮箱地址格式不正确', trigger: ['blur', 'change'] }
    ],
    expire: [
      { required: true, message: '请选择驾照有效期', trigger: 'change' }
    ],
    photo: [
      { required: true, message: '请选择驾照照片', trigger: 'change' }
    ]
  }

  // computed
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

  // methods
  private setCust() {
    this.reset()
    if ((this as any).custId !== '0') {
      this.selectForm.custId = (this as any).custId
      this.selectForm.custName = (this as any).custName
    }
  }
  private validatorCertNo(rule: any, value: any, callback: any) {
    if (this.selectForm.certType === '0') {
      const reg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/
      if (!value) {
        callback()
      }
      if (!reg.test(value)) {
        callback(new Error('身份证号码格式不正确'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }

  private async setData(row: any) {
    this.formLoading = true
    try {
      if ((this as any).custId === '0') {
        await this.getSupplierList()
      }
      this.selectForm = row
      this.imageUrl = row.photo
      await this.getStateList()
      await this.getCityList()
      await this.getCountyList()
      await this.getUserList()
      await this.getVehicleList()
      await this.getImageUrl()
      this.formLoading = false
    } catch (error) {
      this.formLoading = false
      return error
    }
  }
  private async getImageUrl() {
    const params = {
      path: this.imageUrl
    }
    await getFilePath(params).then((res: any) => {
      if (res.success) {
        this.imageBase64 = res.data
      }
    }).catch((err: any) => {
      return err
    })
  }
  // 获取供应商
  private async getSupplierList() {
    this.selectLoading = true
    const custId = this.custId
    const params = {
      page: 1,
      size: 99999,
      parentId: custId
    }
    await getSupplierList(params)
      .then((res: any) => {
        const data = res.data || {}
        this.supplierList = data.result || []
        this.supplierList.unshift({
          id: '0',
          name: '聚货通',
          countryId: 'CN'
        })
        this.selectLoading = false
      })
      .catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }
  private async getStateList() {
    if (!this.selectForm.countryId) return
    this.selectLoading = true
    await getStateByCountry(this.selectForm.countryId).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      const result = data.result || []
      this.stateList = result
    }).catch(() => {
      this.stateList = []
      this.selectLoading = false
    })
  }
  private async getCityList() {
    if (!this.selectForm.stateId) return
    this.selectLoading = true
    await getCityByState(this.selectForm.stateId).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      const result = data.result || []
      this.cityList = result
    }).catch(() => {
      this.cityList = []
      this.selectLoading = false
    })
  }
  private async getCountyList() {
    if (!this.selectForm.cityId) return
    this.selectLoading = true
    await getCountyByCity(this.selectForm.cityId)
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result || []
        this.countyList = result
        this.selectLoading = false
      })
      .catch(() => {
        this.countyList = []
        this.selectLoading = false
      })
  }
  private onCountryArea() {
    this.selectForm.stateId = ''
    this.onStateChange()
    this.supplierList.map((it: any) => {
      if (this.selectForm.custId === it.id) {
        this.selectForm.countryId = it.countryId || 'CN'
      }
    })
  }
  private onStateChange() {
    this.selectForm.cityId = ''
    this.onCityChange()
  }
  private onCityChange() {
    this.selectForm.countyId = ''
  }
  // 获取用户列表
  private async getUserList() {
    if (!this.selectForm.custId) {
      this.$message.error('请选择所属公司')
      return
    }
    this.selectLoading = true
    const params:any = {
      custId: this.selectForm.custId
    }
    await getUserList(params).then((res: any) => {
      const data = res.data
      this.userList = data || []
      this.selectLoading = false
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }
  // 获取车辆列表
  private async getVehicleList() {
    if (!this.selectForm.custId) {
      this.$message.error('请选择所属公司')
      return
    }
    this.selectLoading = true
    const params:any = {
      custId: this.selectForm.custId,
      deptId: '',
      page: 1,
      size: 99999
    }
    getVehicleList(params).then((res: any) => {
      const data = res.data || {}
      this.carList = data.result || []
      this.selectLoading = false
    }).catch((err: any) => {
      this.selectLoading = false
      return err
    })
  }
  // 驾照图片
  private uploadFile(params: any) {
    const { file } = params
    // this.imageUrl = file
    const prefixPath = 'jht-admin/driver/license-photos'
    this.$upload(false, file, `${prefixPath}/${dayjs().valueOf() + '/' + file.name}`)
      .then((res: any) => {
        this.imageUrl = res.data
        this.selectForm.photo = this.imageUrl
        this.getBase64(file)
          .then((base64: any) => {
            this.imageBase64 = base64
          })
          .catch(() => {
            this.imageBase64 = ''
          })
      })
      .catch((err: any) => {
        return err
      })
  }
  private getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }
  // 图片预览
  private handlePreview() {
    this.dialogVisible = true
  }
  // 图片删除
  private handleDelete() {
    this.$confirm('您确认要删除该照片吗?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.$deleteLoad(this.imageUrl, false)
        .then((res: any) => {
          if (res.success) {
            this.imageUrl = ''
            this.selectForm.photo = this.imageUrl
            this.imageBase64 = ''
          }
        })
        .catch((err: any) => {
          return err
        })
    }).catch(() => {
      // err
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

  // 提交表单
  private handleSaveForm() {
    const root: any = this.$refs.editForm
    root.validate((valid: any) => {
      if (!valid) return
      const params: any = {
        ...this.selectForm
      }
      this.supplierList.forEach((it: any) => {
        if (it.id === params.custId) {
          params.custName = it.name
        }
      })
      this.carList.forEach((item: any) => {
        if (item.id === params.vehicleId) {
          params.plateNumber = item.plateNumber
        }
      })
      this.userList.forEach((item: any) => {
        if (item.id === params.userId) {
          params.userName = item.username
        }
      })
      params.stateName = (this.stateList.find((item: any) => item.id === params.stateId) || {}).name
      params.cityName = (this.cityList.find((item: any) => item.id === params.cityId) || {}).name
      params.countyName = (this.countyList.find((item: any) => item.id === params.countyId) || {}).name
      this.formLoading = true
      saveDriver(params)
        .then((res: any) => {
          this.formLoading = false
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.$emit('getTableList')
          this.reset()
          this.$emit('cancel')
        })
        .catch(err => {
          this.formLoading = false
          return err
        })
    })
  }
  // 点击取消按钮
  private cancel() {
    this.reset()
    this.$emit('cancel')
  }
  // 表单重置
  private reset(): void {
    this.selectForm = initForm()
    this.stateList = []
    this.cityList = []
    this.countyList = []
    this.imageUrl = ''
    this.imageBase64 = ''
    this.$nextTick(() => {
      const formRef = this.$refs.editForm as Form
      formRef.clearValidate()
    })
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  border: 1px dashed #d9d9d9;
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.preview-img-wrap{
  width: 178px;
  height: 178px;
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
      transform: translate(-50%,-50%);
      height: 100%;
    }
    .mask{
      font-size: 20px;
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
      .mask-view-icon{
        margin-right: 20px;
      }
      &:hover{
        opacity: 1;
      }
    }
  }
}
.el-form-item {
  display: inline-block;
  width: 49%;
}
</style>
