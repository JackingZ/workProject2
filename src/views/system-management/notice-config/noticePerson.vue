<template>
  <el-dialog
    title="添加地址"
    :visible="visible"
    width="960px"
    :close-on-click-modal="false"
    @close="dialogClose"
  >
    <div v-loading="loading">
      <el-button
        type="text"
        icon="el-icon-circle-plus-outline"
        @click="addRow"
      >
        新增
      </el-button>
      <div>
        <el-table
          :data="tableData"
          height="400px"
          border
        >
          <el-table-column
            label="服务类型"
          >
            <template slot-scope="scope">
              <div>
                <el-select
                  v-if="scope.row.isEditRow"
                  v-model="scope.row.service"
                  :loading="selectLoading"
                  placeholder="请选择"
                  size="small"
                  filterable
                  clearable
                  style="width:100%;"
                  @focus="getServiceTypeList"
                  @change="(val) => onType(val, scope.row)"
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                <span v-else>
                  {{ scope.row.serviceName }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="业务类型"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div>
                <el-select
                  v-if="scope.row.isEditRow"
                  v-model="scope.row.subtypeIds"
                  :loading="selectLoading"
                  :disabled="!scope.row.service"
                  placeholder="请选择"
                  size="small"
                  filterable
                  clearable
                  multiple
                  collapse-tags
                  style="width:100%;"
                >
                  <el-option
                    v-for="item in subtypeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                <span v-else>
                  {{ scope.row.businessName }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="接收者"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div>
                <el-select
                  v-if="scope.row.isEditRow"
                  v-model="scope.row.userIds"
                  :loading="selectLoading"
                  placeholder="请选择"
                  size="small"
                  filterable
                  multiple
                  collapse-tags
                  clearable
                  style="width:100%;"
                >
                  <el-option
                    v-for="item in userList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  />
                </el-select>
                <span v-else>
                  {{ scope.row.userName }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="150"
          >
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.isEditRow"
                type="text"
                @click="editRow(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                v-else
                type="text"
                @click="saveRow(scope.row)"
              >
                保存
              </el-button>
              <el-button
                v-if="!scope.row.isEditRow"
                type="text"
                @click="delRow(scope.row)"
              >
                删除
              </el-button>
              <el-button
                v-else
                type="text"
                @click="cancelRow(scope.row)"
              >
                取消
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import {
  getServiceTypeListById,
  getServiceTypeList,
  getServiceSubtypeList,
  getUserList,
  getPersonList,
  savePerson,
  editPerson,
  deletePerson
} from '@/api/system-in-notice-config'

@Component({
  name: '',
  components: {},
  props: {}
})

export default class extends Vue {
  /* data */
  private typeList: any[] = []
  private subtypeList: any[] = []
  private userList: any[] = []
  private visible: boolean = false
  private loading: boolean = false
  private selectLoading: boolean = false
  private tableData: any[] = []
  private currentObj: any = {}

  // 所属公司id
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }

  /* methods */

  private add() {
    this.tableData.map((item: any) => {
      item.isEditRow = false
    })
    this.tableData = [...this.tableData, {
      serviceName: undefined,
      service: undefined,
      subtypeIds: [],
      userIds: [],
      business: undefined,
      businessName: undefined,
      user: undefined,
      userName: undefined,
      isEditRow: true
    }]
  }

  private addRow() {
    const editingRow = this.tableData.find((e: any) => e.isEditRow)
    if (!editingRow) {
      this.add()
    } else {
      if (editingRow.id) {
        this.$confirm('您修改的尚未保存！', '温馨提示', {
          confirmButtonText: '保存',
          closeOnClickModal: false,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          if (this.validate(editingRow)) {
            await this.saveRow(editingRow, 'isAdd')
          }
        }).catch(() => {
          this.tableData.map((item: any) => {
            item.isEditRow = false
          })
        })
      } else {
        this.$confirm('您新增的尚未保存！', '温馨提示', {
          confirmButtonText: '保存',
          closeOnClickModal: false,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          if (this.validate(editingRow)) {
            await this.saveRow(editingRow, 'isAdd')
          }
        }).catch(() => {
          this.tableData = this.tableData.filter((e: any) => !e.isEditRow)
        })
      }
    }
  }

  private editRow(row: any) {
    this.tableData = this.tableData.map((item: any) => {
      item.isEditRow = false
      if (item.id === row.id) {
        item.isEditRow = true
      }
      return item
    })
    this.loading = true
    this.getSubtypeList(row)
  }

  private validate(row: any): boolean {
    if (!row.service) {
      this.$message.error('请选择服务类型')
      return false
    }
    if (row.subtypeIds.length <= 0) {
      this.$message.error('请选择业务类型')
      return false
    }
    if (row.userIds.length <= 0) {
      this.$message.error('请选择接收人')
      return false
    }
    return true
  }

  private delRow(row: any) {
    this.$confirm('请确认是否删除该条数据?', '温馨提示', {
      confirmButtonText: '确定',
      closeOnClickModal: false,
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      if (row.id) {
        const params = {
          id: row.id
        }
        this.loading = true
        deletePerson(params).then((res: any) => {
          this.loading = false
          if (res.success) {
            this.$message.success('删除成功')
            this.getPersonList()
          }
        }).catch((err: any) => {
          this.loading = false
          return err
        })
      }
    })
      .catch(() => {
        return false
      })
  }

  private cancelRow(row: any) {
    if (row.id) {
      row.isEditRow = false
    } else {
      this.tableData = this.tableData.filter((item: any) => item.id)
    }
  }

  private async saveRow(row: any, isAdd?: string) {
    if (this.validate(row)) {
      const arrRep = this.tableData.reduce((pre, cur) => {
        const isA = pre.some((p: any) => {
          const isT = p.service === cur.service
          const isS = (p.subtypeIds || []).some((it: any) => {
            return (cur.subtypeIds || []).some((s: any) => s === it)
          })
          const isU = (p.userIds || []).some((it: any) => {
            return (cur.userIds || []).some((u: any) => u === it)
          })
          return isT && isS && isU
        })
        if (!isA) {
          return pre.concat(cur)
        } else {
          return pre
        }
      }, [])
      if (arrRep.length < this.tableData.length) {
        this.$message.error('相同服务类型和业务类型下有重复的接收者')
        return false
      }
      const { subtypeIds, userIds, service, id, isEditRow, ...obj } = row
      const params: any = {
        ...obj,
        id,
        service,
        unqId: this.currentObj.unqId,
        parentId: this.currentObj.parentId
      }
      const item = this.typeList.find((it: any) => it.id === service) || {}
      params.serviceName = item.name
      const arrB = this.subtypeList.filter((it: any) => {
        return subtypeIds.some((s: any) => s === it.id)
      })
      const arrU = this.userList.filter((it: any) => {
        return userIds.some((s: any) => s === it.id)
      })
      params.business = arrB.map((a: any) => a.id).join(',')
      params.businessName = arrB.map((a: any) => a.name).join(',')
      params.userId = arrU.map((a: any) => a.id).join(',')
      params.userName = arrU.map((a: any) => a.label).join(',')

      this.loading = true
      if (id) {
        await editPerson(params).then((res: any) => {
          this.loading = false
          if (res.success) {
            this.$message.success('编辑成功')
            this.getPersonList()
          }
        }).catch((err: any) => {
          this.loading = false
          return err
        })
      } else {
        await savePerson(params).then((res: any) => {
          this.loading = false
          if (res.success) {
            this.$message.success('新增成功')
            this.getPersonList()
          }
        }).catch((err: any) => {
          this.loading = false
          return err
        })
      }
    }
  }

  // 服务类型
  private getServiceTypeList() {
    const params = {
      custId: (this as any).custId
    }

    getServiceTypeListById(params)
      .then((res: any) => {
        this.typeList = res.data || []
      })
      .catch((err: any) => {
        return err
      })
  }

  private getSubtypeList(row: any) {
    const params = {
      typeId: row.service
    }
    this.selectLoading = true
    getServiceSubtypeList(params)
      .then((res: any) => {
        const data = res.data || []
        this.subtypeList = data
        this.selectLoading = false
        this.loading = false
      }).catch((err: any) => {
        this.selectLoading = false
        this.loading = false
        return err
      })
  }
  private getUserList() {
    const params = {
      custId: (this as any).custId
    }
    this.selectLoading = true
    getUserList(params)
      .then((res: any) => {
        const data = res.data
        const arr = data || []
        this.userList = arr.map((it: any) => {
          const { deptName, realName, username, ...obj } = it
          return {
            ...obj,
            deptName,
            realName,
            username,
            label: `${realName}-${username}-${deptName}`
          }
        })
        this.selectLoading = false
      }).catch((err: any) => {
        this.selectLoading = false
        return err
      })
  }

  private dialogClose() {
    this.visible = false
    this.currentObj = {}
    this.$emit('load')
  }

  private show(row: any) {
    this.visible = true
    this.currentObj = row
    this.getPersonList()
    this.getUserList()
    this.getServiceTypeList()
  }

  private onType(val: any, row: any) {
    this.subtypeList = []
    row.subtypeIds = []
    this.getSubtypeList(row)
  }

  private getPersonList(isAdd?: string) {
    const params = {
      unqId: this.currentObj.unqId
    }
    this.loading = true
    getPersonList(params).then((res: any) => {
      this.loading = false
      if (res.success) {
        const data = res.data || []
        const result = data
        this.tableData = result.map((item: any) => {
          item.isEditRow = false
          const { business, userId } = item
          const arrB = (business || '').split(',') || []
          const arrU = (userId || '').split(',') || []
          return {
            ...item,
            subtypeIds: arrB,
            userIds: arrU
          }
        })
        if (isAdd === 'isAdd') {
          this.add()
        }
      }
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }
}
</script>
<style lang="scss" scoped>
</style>
