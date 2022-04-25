<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <div
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div
        class="app-container"
      >
        <head-info
          info=""
          title="着陆页配置"
        />
        <div
          v-loading="loading"
          class="app-panel"
        >
          <el-form
            ref="selectForm"
            :model="selectForm"
            :rules="formRules"
            label-width="150px"
            size="small"
          >
            <div class="form-title">
              <div style="float: left;">
                首页配置
              </div>
              <el-button
                v-permission="['indexConfigSave']"
                type="primary"
                size="mini"
                @click="saveHomePage"
              >
                保 存
              </el-button>
            </div>
            <el-form-item
              label="首页导航logo"
            >
              <el-upload
                class="avatar"
                action
                :show-file-list="false"
                :disabled="!$checkPermission(['indexConfigUpload'])"
                :before-upload="beforeUpload"
                :http-request="uploadFileNav"
              >
                <div
                  v-if="imgNavUrl"
                  class="img-show"
                >
                  <img
                    :src="imgNavUrl"
                    class="avatar-img"
                  >
                  <span
                    class="img-action"
                    @click.stop=""
                  >
                    <i
                      class="el-icon-delete"
                      @click.stop="removeUpload('nav')"
                    />
                  </span>
                </div>
                <i
                  v-else
                  class="el-icon-plus avatar-icon"
                />
              </el-upload>
              <div class="tips">
                提示：仅上传1张照片，尺寸大小建议为70px * 42px
              </div>
            </el-form-item>
            <el-form-item
              label="首页banner"
            >
              <el-upload
                class="avatar"
                action
                :show-file-list="false"
                :disabled="!$checkPermission(['indexConfigUpload'])"
                :before-upload="beforeUpload"
                :http-request="uploadFileBanner1"
              >
                <div
                  v-if="imgBanner1Url"
                  class="img-show"
                >
                  <img
                    :src="imgBanner1Url"
                    class="avatar-img"
                  >
                  <span
                    class="img-action"
                    @click.stop=""
                  >
                    <i
                      class="el-icon-delete"
                      @click.stop="removeUpload('banner1')"
                    />
                  </span>
                </div>
                <i
                  v-else
                  class="el-icon-plus avatar-icon"
                />
              </el-upload>

              <el-upload
                class="avatar"
                action
                :show-file-list="false"
                :disabled="!$checkPermission(['indexConfigUpload'])"
                :before-upload="beforeUpload"
                :http-request="uploadFileBanner2"
              >
                <div
                  v-if="imgBanner2Url"
                  class="img-show"
                >
                  <img
                    :src="imgBanner2Url"
                    class="avatar-img"
                  >
                  <span
                    class="img-action"
                    @click.stop=""
                  >
                    <i
                      class="el-icon-delete"
                      @click.stop="removeUpload('banner2')"
                    />
                  </span>
                </div>
                <i
                  v-else
                  class="el-icon-plus avatar-icon"
                />
              </el-upload>

              <el-upload
                class="avatar"
                action
                :show-file-list="false"
                :disabled="!$checkPermission(['indexConfigUpload'])"
                :before-upload="beforeUpload"
                :http-request="uploadFileBanner3"
              >
                <div
                  v-if="imgBanner3Url"
                  class="img-show"
                >
                  <img
                    :src="imgBanner3Url"
                    class="avatar-img"
                  >
                  <span
                    class="img-action"
                    @click.stop=""
                  >
                    <i
                      class="el-icon-delete"
                      @click.stop="removeUpload('banner3')"
                    />
                  </span>
                </div>
                <i
                  v-else
                  class="el-icon-plus avatar-icon"
                />
              </el-upload>

              <el-upload
                class="avatar"
                action
                :show-file-list="false"
                :disabled="!$checkPermission(['indexConfigUpload'])"
                :before-upload="beforeUpload"
                :http-request="uploadFileBanner4"
              >
                <div
                  v-if="imgBanner4Url"
                  class="img-show"
                >
                  <img
                    :src="imgBanner4Url"
                    class="avatar-img"
                  >
                  <span
                    class="img-action"
                    @click.stop=""
                  >
                    <i
                      class="el-icon-delete"
                      @click.stop="removeUpload('banner4')"
                    />
                  </span>
                </div>
                <i
                  v-else
                  class="el-icon-plus avatar-icon"
                />
              </el-upload>

              <el-upload
                class="avatar"
                action
                :show-file-list="false"
                :disabled="!$checkPermission(['indexConfigUpload'])"
                :before-upload="beforeUpload"
                :http-request="uploadFileBanner5"
              >
                <div
                  v-if="imgBanner5Url"
                  class="img-show"
                >
                  <img
                    :src="imgBanner5Url"
                    class="avatar-img"
                  >
                  <span
                    class="img-action"
                    @click.stop=""
                  >
                    <i
                      class="el-icon-delete"
                      @click.stop="removeUpload('banner5')"
                    />
                  </span>
                </div>
                <i
                  v-else
                  class="el-icon-plus avatar-icon"
                />
              </el-upload>
              <div class="tips">
                提示：最多上传5张照片，尺寸建议为448px * 278px
              </div>
            </el-form-item>
            <el-form-item
              label="底部logo"
            >
              <el-upload
                class="avatar"
                action
                :show-file-list="false"
                :disabled="!$checkPermission(['indexConfigUpload'])"
                :before-upload="beforeUpload"
                :http-request="uploadFileLogo"
              >
                <div
                  v-if="imgLogoUrl"
                  class="img-show"
                >
                  <img
                    :src="imgLogoUrl"
                    class="avatar-img"
                  >
                  <span
                    class="img-action"
                    @click.stop=""
                  >
                    <i
                      class="el-icon-delete"
                      @click.stop="removeUpload('logo')"
                    />
                  </span>
                </div>
                <i
                  v-else
                  class="el-icon-plus avatar-icon"
                />
              </el-upload>
              <div class="tips">
                提示：仅上传1张照片，尺寸大小建议为148px * 90px
              </div>
            </el-form-item>
            <el-form-item
              label="底部二维码"
            >
              <div style="display: inline-block;">
                <el-input
                  v-model="selectForm.title1"
                  style="display: block;width: 152px;margin-bottom: 10px;"
                  placeholder="请输入标题"
                />
                <el-upload
                  class="avatar"
                  action
                  :show-file-list="false"
                  :disabled="!$checkPermission(['indexConfigUpload'])"
                  :before-upload="beforeUpload"
                  :http-request="uploadFileBottom1"
                >
                  <div
                    v-if="imgBottom1Url"
                    class="img-show"
                  >
                    <img
                      :src="imgBottom1Url"
                      class="avatar-img"
                    >
                    <span
                      class="img-action"
                      @click.stop=""
                    >
                      <i
                        class="el-icon-delete"
                        @click.stop="removeUpload('bottom1')"
                      />
                    </span>
                  </div>
                  <i
                    v-else
                    class="el-icon-plus avatar-icon"
                  />
                </el-upload>
              </div>

              <div style="display: inline-block;">
                <el-input
                  v-model="selectForm.title2"
                  style="display: block;width: 152px;margin-bottom: 10px;"
                  placeholder="请输入标题"
                />
                <el-upload
                  class="avatar"
                  action
                  :show-file-list="false"
                  :disabled="!$checkPermission(['indexConfigUpload'])"
                  :before-upload="beforeUpload"
                  :http-request="uploadFileBottom2"
                >
                  <div
                    v-if="imgBottom2Url"
                    class="img-show"
                  >
                    <img
                      :src="imgBottom2Url"
                      class="avatar-img"
                    >
                    <span
                      class="img-action"
                      @click.stop=""
                    >
                      <i
                        class="el-icon-delete"
                        @click.stop="removeUpload('bottom2')"
                      />
                    </span>
                  </div>
                  <i
                    v-else
                    class="el-icon-plus avatar-icon"
                  />
                </el-upload>
              </div>
              <div class="tips">
                提示：最多上传2张照片，尺寸建议为192px * 192px
              </div>
            </el-form-item>
            <el-form-item
              prop="phone"
              label="联系电话"
            >
              <el-input
                v-model="selectForm.phone"
                style="width: 240px;"
                placeholder="请输入"
              />
            </el-form-item>
            <el-form-item
              label="工作时间"
            >
              <el-input
                v-model="selectForm.time"
                style="width: 240px;"
                placeholder="请输入"
                :maxlength="50"
              />
            </el-form-item>
          </el-form>
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
  getPages,
  savePage
} from '@/api/system-in-pc-config'
import dayjs from 'dayjs'

@Component({
  name: '',
  components: {},
  props: {}
})

export default class extends Vue {
  /** data */
  private selectForm: any = {
    phone: undefined,
    time: undefined,
    title1: undefined,
    title2: undefined,
    navData: undefined,
    logoData: undefined,
    banner1Data: undefined,
    banner2Data: undefined,
    banner3Data: undefined,
    banner4Data: undefined,
    banner5Data: undefined,
    bottom1Data: undefined,
    bottom2Data: undefined
  }
  private currentId = ''
  private imgNavUrl = ''
  private imgLogoUrl = ''
  private imgBanner1Url = ''
  private imgBanner2Url = ''
  private imgBanner3Url = ''
  private imgBanner4Url = ''
  private imgBanner5Url = ''
  private imgBottom1Url = ''
  private imgBottom2Url = ''

  private loading: boolean = false
  private formRules = {
    phone: [
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /[\u4e00-\u9fa5]/
          if (value && reg.test(value)) {
            callback(new Error('联系电话格式不正确'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }

  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }

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

  /** methods */
  // 文件上传示例
  private uploadFileNav(params: any): void {
    const { file } = params
    // 公开库true
    this.$upload(true, file, `jht-admin/landpage/nav/${dayjs().valueOf() + '/' + file.name}`)
      .then((res: any) => {
        this.selectForm.navData = res.data || ''
        this.imgNavUrl = URL.createObjectURL(file)
        this.$message.success('上传成功')
      })
      .catch((err: any) => {
        return err
      })
  }
  private uploadFileLogo(params: any): void {
    const { file } = params
    // const filename = file.name
    // const renameFile = new File([file], dayjs().valueOf() + '/' + filename, { type: file.type })
    // 公开库true
    this.$upload(true, file, `jht-admin/landpage/logo/${dayjs().valueOf() + '/' + file.name}`)
      .then((res: any) => {
        this.selectForm.logoData = res.data || ''
        this.imgLogoUrl = URL.createObjectURL(file)
        this.$message.success('上传成功')
      })
      .catch((err: any) => {
        return err
      })
  }

  private uploadFileBanner1(params: any): void {
    const { file } = params
    // 公开库true
    this.$upload(true, file, `jht-admin/landpage/banner/${dayjs().valueOf() + '/' + file.name}`)
      .then((res: any) => {
        this.selectForm.banner1Data = res.data || ''
        this.imgBanner1Url = URL.createObjectURL(file)
        this.$message.success('上传成功')
      })
      .catch((err: any) => {
        return err
      })
  }
  private uploadFileBanner2(params: any): void {
    const { file } = params
    // 公开库true
    this.$upload(true, file, `jht-admin/landpage/banner/${dayjs().valueOf() + '/' + file.name}`)
      .then((res: any) => {
        this.selectForm.banner2Data = res.data || ''
        this.imgBanner2Url = URL.createObjectURL(file)
        this.$message.success('上传成功')
      })
      .catch((err: any) => {
        return err
      })
  }
  private uploadFileBanner3(params: any): void {
    const { file } = params
    // 公开库true
    this.$upload(true, file, `jht-admin/landpage/banner/${dayjs().valueOf() + '/' + file.name}`)
      .then((res: any) => {
        this.selectForm.banner3Data = res.data || ''
        this.imgBanner3Url = URL.createObjectURL(file)
        this.$message.success('上传成功')
      })
      .catch((err: any) => {
        return err
      })
  }
  private uploadFileBanner4(params: any): void {
    const { file } = params
    // 公开库true
    this.$upload(true, file, `jht-admin/landpage/banner/${dayjs().valueOf() + '/' + file.name}`)
      .then((res: any) => {
        this.selectForm.banner4Data = res.data || ''
        this.imgBanner4Url = URL.createObjectURL(file)
        this.$message.success('上传成功')
      })
      .catch((err: any) => {
        return err
      })
  }
  private uploadFileBanner5(params: any): void {
    const { file } = params
    // 公开库true
    this.$upload(true, file, `jht-admin/landpage/banner/${dayjs().valueOf() + '/' + file.name}`)
      .then((res: any) => {
        this.selectForm.banner5Data = res.data || ''
        this.imgBanner5Url = URL.createObjectURL(file)
        this.$message.success('上传成功')
      })
      .catch((err: any) => {
        return err
      })
  }

  private uploadFileBottom1(params: any): void {
    const { file } = params
    // 公开库true
    this.$upload(true, file, `jht-admin/landpage/bottom/${dayjs().valueOf() + '/' + file.name}`)
      .then((res: any) => {
        this.selectForm.bottom1Data = res.data || ''
        this.imgBottom1Url = URL.createObjectURL(file)
        this.$message.success('上传成功')
      })
      .catch((err: any) => {
        return err
      })
  }
  private uploadFileBottom2(params: any): void {
    const { file } = params
    // 公开库true
    this.$upload(true, file, `jht-admin/landpage/bottom/${dayjs().valueOf() + '/' + file.name}`)
      .then((res: any) => {
        this.selectForm.bottom2Data = res.data || ''
        this.imgBottom2Url = URL.createObjectURL(file)
        this.$message.success('上传成功')
      })
      .catch((err: any) => {
        return err
      })
  }

  private beforeUpload(file: any) {
    const isJPG = file.type.indexOf('image') !== -1
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isJPG) {
      this.$message.error('上传照片只能是图片格式!')
    }
    if (!isLt2M) {
      this.$message.error('上传照片大小不能超过 2MB!')
    }
    return isJPG && isLt2M
  }

  private removeUpload(key: string) {
    const arr = [
      { name: 'nav', id: this.selectForm.navData },
      { name: 'logo', id: this.selectForm.logoData },
      { name: 'banner1', id: this.selectForm.banner1Data },
      { name: 'banner2', id: this.selectForm.banner2Data },
      { name: 'banner3', id: this.selectForm.banner3Data },
      { name: 'banner4', id: this.selectForm.banner4Data },
      { name: 'banner5', id: this.selectForm.banner5Data },
      { name: 'bottom1', id: this.selectForm.bottom1Data },
      { name: 'bottom2', id: this.selectForm.bottom2Data }
    ]
    arr.map((it: any) => {
      if (it.name === key) {
        this.deleteHomePage(it.id, key)
      }
    })
  }
  private deleteHomePage(name: string, key: string) {
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.$deleteLoad(name, true)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            switch (key) {
              case 'nav':
                this.imgNavUrl = ''
                this.selectForm.navData = ''
                break
              case 'logo':
                this.imgLogoUrl = ''
                this.selectForm.logoData = ''
                break
              case 'banner1':
                this.imgBanner1Url = ''
                this.selectForm.banner1Data = ''
                break
              case 'banner2':
                this.imgBanner2Url = ''
                this.selectForm.banner2Data = ''
                break
              case 'banner3':
                this.imgBanner3Url = ''
                this.selectForm.banner3Data = ''
                break
              case 'banner4':
                this.imgBanner4Url = ''
                this.selectForm.banner4Data = ''
                break
              case 'banner5':
                this.imgBanner5Url = ''
                this.selectForm.banner5Data = ''
                break
              case 'bottom1':
                this.imgBottom1Url = ''
                this.selectForm.bottom1Data = ''
                break
              case 'bottom2':
                this.imgBottom2Url = ''
                this.selectForm.bottom2Data = ''
                break

              default:
                break
            }
            this.saveHomePage()
          })
          .catch((err: any) => {
            this.loading = false
            return err
          })
      })
      .catch(() => {
        return false
      })
  }

  private saveHomePage() {
    const editForm: any = this.$refs.selectForm
    editForm.validate((valid: any) => {
      if (!valid) return false
      if ((this.selectForm.bottom1Data && !this.selectForm.title1) || (this.selectForm.bottom2Data && !this.selectForm.title2)) {
        this.$message.error('请填写标题')
        return
      }
      this.loading = true
      const content = JSON.stringify(this.selectForm)
      const id = this.selectForm.id
      const params: any = {
        content,
        id: this.currentId,
        custId: (this as any).custId,
        custName: (this as any).custName,
        custType: (this as any).custType
      }

      savePage(params)
        .then((res: any) => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.loading = false
          this.getHomePage()
        })
        .catch((err: any) => {
          this.loading = false
          return err
        })
    })
  }
  private getHomePage() {
    this.loading = true
    getPages({
      custId: (this as any).custId
    }).then((res: any) => {
      const data = res.data || {}
      const config = data.config || []
      if (Array.isArray(config) && config.length > 0) {
        const obj = config[0]
        this.selectForm = JSON.parse(obj.content) || {}
        this.imgNavUrl = this.selectForm.navData ? process.env.VUE_APP_OSS_PATH + this.selectForm.navData : ''
        this.imgLogoUrl = this.selectForm.logoData ? process.env.VUE_APP_OSS_PATH + this.selectForm.logoData : ''
        this.imgBanner1Url = this.selectForm.banner1Data ? process.env.VUE_APP_OSS_PATH + this.selectForm.banner1Data : ''
        this.imgBanner2Url = this.selectForm.banner2Data ? process.env.VUE_APP_OSS_PATH + this.selectForm.banner2Data : ''
        this.imgBanner3Url = this.selectForm.banner3Data ? process.env.VUE_APP_OSS_PATH + this.selectForm.banner3Data : ''
        this.imgBanner4Url = this.selectForm.banner4Data ? process.env.VUE_APP_OSS_PATH + this.selectForm.banner4Data : ''
        this.imgBanner5Url = this.selectForm.banner5Data ? process.env.VUE_APP_OSS_PATH + this.selectForm.banner5Data : ''
        this.imgBottom1Url = this.selectForm.bottom1Data ? process.env.VUE_APP_OSS_PATH + this.selectForm.bottom1Data : ''
        this.imgBottom2Url = this.selectForm.bottom2Data ? process.env.VUE_APP_OSS_PATH + this.selectForm.bottom2Data : ''
        this.currentId = obj.id
      }
      this.loading = false
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }
  private created() {
    this.getHomePage()
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-upload {
    display: inline-block;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    height: 150px;
    overflow: hidden;
  }
  ::v-deep .el-upload:hover {
    border-color: #409EFF;
  }
  .form-title {
    text-align: right;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    background: #f2f2f2;
    padding: 0 20px;
    margin-bottom: 20px;
  }
  .tips {
    font-size: 12px;
    color: #ff4949;
  }
  .avatar {
    display: inline-block;
    width: 150px;
    height: 150px;
    margin-right: 20px;
  }
  .avatar-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar-img {
    width: 150px;
    height: 150px;
    display: inline-block;
  }
  ::v-deep .img-show:hover .img-action {
    opacity: 1;
  }
  .img-show {
    height: 150px;
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
  .el-icon-delete {
    margin-top: 65px;
    cursor: pointer;
  }

</style>
