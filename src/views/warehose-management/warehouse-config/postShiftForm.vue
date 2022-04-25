<template>
  <div>
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
          label="轮岗模板"
        >
          <el-tag
            v-for="(item, index) in tagList"
            :key="index"
            closable
            @click="handleTag"
            @close="deleteTag"
          >
            {{ item.name }}
          </el-tag>
          <el-button
            type="text"
            icon="el-icon-circle-plus-outline"
            @click="handleAddTemplate"
          >
            新增轮岗配置模板
          </el-button>
        </el-form-item>
        <el-form-item
          label="轮换周期"
          prop="nums"
        >
          <el-input
            v-model="selectForm.nums"
            :maxlength="10"
            placeholder="请输入"
          >
            <el-select
              slot="append"
              v-model="selectForm.unit"
              style="width: 100px;"
            >
              <el-option
                label="周(7天)"
                :value="1"
              />
              <el-option
                label="月(30天)"
                :value="2"
              />
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item
          label="原操作中心"
          prop="oldWcId"
        >
          <el-select
            v-model="selectForm.oldWcId"
            style="width:100%;"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in dischargeList"
              :key="item.wcId"
              :label="item.name"
              :value="item.wcId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="原岗位"
          prop="oldJobId"
        >
          <el-select
            v-model="selectForm.oldJobId"
            style="width:100%;"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in postList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="新操作中心"
          prop="newWcId"
        >
          <el-select
            v-model="selectForm.newWcId"
            style="width:100%;"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in dischargeList"
              :key="item.wcId"
              :label="item.name"
              :value="item.wcId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="新岗位"
          prop="newJobId"
        >
          <el-select
            v-model="selectForm.newJobId"
            style="width:100%;"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in postList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="执行日期"
          prop="startTime"
        >
          <el-date-picker
            v-model="selectForm.startTime"
            type="date"
            style="width: 100%;"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="年/月/日"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item
          label="截止日期"
          prop="endTime"
        >
          <el-date-picker
            v-model="selectForm.endTime"
            type="date"
            style="width: 100%;"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="年/月/日"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item
          label="备注"
          prop="notes"
        >
          <el-input
            v-model="selectForm.notes"
            style="width: 100%;"
            type="text"
            :maxlength="20"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
    </div>
    <div
      slot="footer"
      style="text-align: center;padding-top: 20px;"
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
  </div>
</template>

<script  lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'
import {
  getSinglePostShift,
  savePostShift,
  getPostList,
  getWorkCenterList
} from '@/api/warehose-by-config'
function formParam() {
  return {
    nums: undefined,
    unit: 1,
    newJobId: undefined,
    newJobName: undefined,
    oldJobId: undefined,
    oldJobName: undefined,
    oldWcId: undefined,
    oldWcName: undefined,
    newWcId: undefined,
    newWcName: undefined,
    startTime: undefined,
    endTime: undefined,
    notes: undefined,
    warehouseId: undefined
  }
}
function validateNums(rule: any, value: any, callback: (val?: any) => void) {
  const reg = /^[1-9]+[0-9]*$/
  if (!reg.test(value)) {
    callback(new Error('轮换周期为正整数'))
  } else {
    callback()
  }
}

@Component({
  name: 'PostShiftForm',
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
export default class PostShiftForm extends Vue {
  private formLoading: boolean = false
  private selectForm: any = formParam()
  private formRules = {
    nums: [
      { required: true, message: '轮换周期不能为空', trigger: 'change' },
      { validator: validateNums, trigger: 'blur' }
    ],
    newWcId: [{ required: true, message: '请选择新操作中心', trigger: 'change' }],
    newJobId: [{ required: true, message: '请选择新岗位', trigger: 'change' }],
    oldWcId: [
      { required: true, message: '请选择原操作中心', trigger: 'change' }
    ],
    oldJobId: [
      { required: true, message: '请选择原岗位', trigger: 'change' }
    ],
    startTime: [{ required: true, message: '请选择执行日期', trigger: 'change' }],
    endTime: [
      { required: true, message: '请选择截止日期', trigger: 'change' }
    ]
  }
  private postList: any[] = []
  private dischargeList: any[] = []
  private tagList: any[] = []
  // computed
  get pickerOptions() {
    return {
      disabledDate(time: any) {
        return time.getTime() <= Date.now() - 86400000
      }
    }
  }

  // methods
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
    this.resetForm()
    this.$emit('cancel')
  }

  private handleAddTemplate() {
    return []
  }

  private handleTag() {
    return []
  }

  private deleteTag() {
    return []
  }

  private saveConfirm() {
    const editForm: any = this.$refs.theForm
    editForm.validate((valid: any) => {
      if (valid) {
        this.formLoading = true
        const params: any = {
          ...this.selectForm
        }
        this.postList.map((item: any) => {
          if (item.id === params.newJobId) {
            params.newJobName = item.name
          }
          if (item.id === params.oldJobId) {
            params.oldJobName = item.name
          }
        })
        this.dischargeList.map((item: any) => {
          if (item.wcId === params.oldWcId) {
            params.oldWcName = item.name
          }
          if (item.wcId === params.newWcId) {
            params.newWcName = item.name
          }
        })
        savePostShift(params)
          .then((res: any) => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.resetForm()
            this.formLoading = false
            this.$emit('cancel')
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
    getSinglePostShift({
      id: this.selectForm.id
    })
      .then((res: any) => {
        const data = res.data || {}
        this.selectForm = { ...data }
        this.formLoading = false
      })
      .catch((err: any) => {
        this.formLoading = false
        return [err, null]
      })
  }

  private getWorkCenterList() {
    getWorkCenterList({
      page: 1,
      size: 9999
    })
      .then((res: any) => {
        const data = res.data || {}
        this.dischargeList = data.result || []
      })
      .catch((err: any) => {
        return [err, null]
      })
  }

  private getPostList() {
    getPostList({
      page: 1,
      size: 9999
    })
      .then((res: any) => {
        const data = res.data || {}
        this.postList = data.result || []
      })
      .catch((err: any) => {
        return [err, null]
      })
  }

  private init(row: any) {
    this.getPostList()
    this.getWorkCenterList()
    this.selectForm.warehouseId = (this as any).wsId
    const bool: boolean = (this as any).isEdit
    if (bool) {
      this.selectForm.id = row.id
      this.formLoading = true
      this.getWareHouseEdit()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
