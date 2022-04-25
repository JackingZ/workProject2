<template>
  <div>
    <el-dialog
      :title="isEdit ? '编辑操作中心' : '新增操作中心'"
      :visible.sync="isShowUpdate"
      :close-on-click-modal="false"
      width="600px"
      @closed="cancel"
    >
      <div
        v-loading="formLoading"
        class="add-edit-truck"
      >
        <el-form
          ref="theForm"
          :model="selectForm"
          :rules="formRules"
          label-width="120px"
          label-position="right"
          size="small"
          style="padding-right: 20px;"
        >
          <el-form-item
            label="名称"
            prop="name"
          >
            <el-input
              v-model="selectForm.name"
              type="text"
              :maxlength="50"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="排序"
            prop="sorted"
          >
            <el-input-number
              v-model="selectForm.sorted"
              class="input-number-valiate"
              :controls="false"
              placeholder="请输入"
              :min="1"
              :max="99999"
              :step="1"
              step-strictly
            />
          </el-form-item>
          <el-form-item
            label="岗位"
            prop="job"
          >
            <el-select
              v-model="selectForm.job"
              style="width:100%;"
              placeholder="请选择"
              clearable
              multiple
              filterable
              @change="onJob"
            >
              <el-option
                v-for="item in jobList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="工序"
            prop="taskType"
          >
            <el-select
              v-model="selectForm.taskType"
              style="width:100%;"
              placeholder="请选择"
              filterable
              clearable
              @change="onTask"
            >
              <el-option
                label="卸货"
                :value="1"
              />
              <el-option
                label="装载"
                :value="2"
              />
              <el-option
                label="上架"
                :value="3"
              />
              <el-option
                label="分拣"
                :value="4"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="效率数值"
            prop="efficiency"
          >
            <el-input
              v-model="selectForm.efficiency"
              :maxlength="100"
              placeholder="请输入"
            >
              <el-select
                slot="append"
                v-model="selectForm.um"
                style="width: 70px;"
              >
                <el-option
                  v-for="item in umList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item
            label="效率单位"
            prop="per"
          >
            <el-select
              v-model="selectForm.per"
              style="width:100%;"
              placeholder="请选择"
              filterable
              clearable
            >
              <el-option
                label="小时"
                value="2"
              />
              <el-option
                label="分钟"
                value="3"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="是否参与排程"
            prop="schedule"
          >
            <el-radio-group v-model="selectForm.schedule">
              <el-radio :label="true">
                是
              </el-radio>
              <el-radio :label="false">
                否
              </el-radio>
            </el-radio-group>
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
          :loading="formLoading"
          @click="saveConfirm"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script  lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'
import {
  getSingleCenterList,
  saveWorkCenter,
  getPostList
} from '@/api/warehose-by-config'
function formParam() {
  return {
    name: undefined,
    sorted: undefined,
    efficiency: undefined,
    taskType: undefined,
    job: [],
    um: '1',
    warehouseId: undefined,
    per: undefined,
    schedule: true,
    jobIds: undefined,
    jobName: undefined,
    wcPosts: []
  }
}
function validateNums(rule: any, value: any, callback: (val?: any) => void) {
  // const reg = /^\d+(\.\d{0,2})?$/
  const reg = /^[1-9]+[0-9]*$/
  if (!reg.test(value)) {
    callback(new Error('效率数值为正整数'))
  } else {
    callback()
  }
}

@Component({
  name: 'OpeartingForm',
  components: {},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    wsId: {
      type: String,
      default: ''
    }
  }
})
export default class OpeartingForm extends Vue {
  private isShowUpdate: boolean = false
  private formLoading: boolean = false
  private selectForm: any = formParam()
  private formRules = {
    name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
    job: [{ required: true, message: '请选择岗位', trigger: 'change' }],
    sorted: [
      { required: true, message: '排序不能为空', trigger: 'blur' }
    ],
    efficiency: [
      { required: true, message: '效率数值不能为空', trigger: 'blur' },
      { validator: validateNums, trigger: 'blur' }
    ],
    taskType: [{ required: true, message: '请选择工序', trigger: 'change' }],
    per: [{ required: true, message: '请选择效率单位', trigger: 'change' }],
    schedule: [
      { required: true, message: '请选择是否参与排程', trigger: 'change' }
    ]
  }
  private jobList: any[] = []
  private umList: any[] = [
    { name: 'kg', id: '1' },
    { name: 'm³', id: '2' },
    { name: '件', id: '3' },
    { name: '箱', id: '4' }
  ]
  private clearValidate() {
    const theForm: any = this.$refs.theForm
    this.$nextTick(() => {
      theForm.clearValidate()
    })
  }

  // 重置表单
  private resetForm() {
    this.selectForm = formParam()
    this.clearValidate()
  }

  private cancel() {
    this.isShowUpdate = false
    this.resetForm()
  }

  private onTask(val: any) {
    switch (val) {
      case 1:
        this.selectForm.um = '2'
        this.umList = [
          { name: 'm³', id: '2' }
        ]
        break
      case 2:
        this.selectForm.um = '2'
        this.umList = [
          { name: 'm³', id: '2' }
        ]
        break
      case 3:
        this.selectForm.um = '3' || '4'
        this.umList = [
          { name: '件', id: '3' },
          { name: '箱', id: '4' }
        ]
        break
      case 4:
        this.selectForm.um = '3' || '4'
        this.umList = [
          { name: '件', id: '3' },
          { name: '箱', id: '4' }
        ]
        break
      default:
        this.selectForm.um = this.selectForm.um ? this.selectForm.um : '1'
        this.umList = [
          { name: 'kg', id: '1' },
          { name: 'm³', id: '2' },
          { name: '件', id: '3' },
          { name: '箱', id: '4' }
        ]
        break
    }
  }

  private onJob(val: any) {
    let name = ''
    const arr = val.map((j: any) => {
      const it = this.jobList.find((itemJ: any) => itemJ.id === j) || {}
      const { id: postId, name: postName } = it
      name += (it.name || '') + ','
      return {
        postId,
        postName
      }
    })
    this.selectForm.jobIds = val.join(',')
    this.selectForm.jobName = name
    this.selectForm.wcPosts = arr.filter((it: any) => it.postId && it.postName)
  }

  private saveConfirm() {
    const editForm: any = this.$refs.theForm
    editForm.validate((valid: any) => {
      if (valid) {
        this.formLoading = true
        const params: any = {
          ...this.selectForm
        }
        if (params.wcId) {
          params.wcPosts.map((item: any) => {
            item.wcId = params.wcId
          })
        }
        saveWorkCenter(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.resetForm()
            this.formLoading = false
            this.isShowUpdate = false
            this.$emit('getTableList')
          })
          .catch((err: any) => {
            this.formLoading = false
            return err
          })
      } else {
        return false
      }
    })
  }

  private getWareHouseEdit() {
    this.formLoading = true
    getSingleCenterList({
      id: this.selectForm.wcId
    })
      .then((res: any) => {
        const data = res.data || {}
        this.selectForm = { ...data }
        const arr: any[] = []
        data.wcPosts.map((it: any) => {
          arr.push(it.postId)
        })
        this.$set(this.selectForm, 'job', arr)
        this.onTask(this.selectForm.taskType)
        this.formLoading = false
      })
      .catch((err: any) => {
        this.formLoading = false
        return [err, null]
      })
  }

  private getPostList() {
    getPostList({
      page: 1,
      size: 9999,
      type: 3
    })
      .then((res: any) => {
        const data = res.data || {}
        const result = data.result || []
        this.jobList = result
        // this.jobList = result.filter((item: any) => {
        //   // subtypeId
        // })
      })
      .catch((err: any) => {
        return [err, null]
      })
  }

  private init(row: any) {
    this.isShowUpdate = true
    this.getPostList()
    this.selectForm.warehouseId = (this as any).wsId // 仓库id
    const bool: boolean = (this as any).isEdit
    if (bool) {
      this.selectForm.wcId = row.wcId // 当前id
      this.getWareHouseEdit()
    }
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
</style>
