<template>
  <div class="roles-container">
    <div
      v-loading="loading"
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          title="通知配置"
          info=""
        />
        <div
          class="app-panel"
          style="height: calc(100vh - 170px);"
        >
          <el-row class="notice-title">
            <el-col
              :xs="8"
              :sm="8"
              :lg="6"
            >
              <div style="color:#666;padding-left:25px;font-size: 14px;">
                通知类型
              </div>
            </el-col>
            <el-col
              :xs="10"
              :sm="12"
              :lg="14"
            >
              <div style="color:#666;padding-left:50px;font-size: 14px;">
                通知方式
              </div>
            </el-col>
            <el-col
              :xs="6"
              :sm="4"
              :lg="4"
            >
              <div style="color:#666;padding-left:10px;font-size: 14px;">
                通知人
              </div>
            </el-col>
          </el-row>

          <el-tree
            ref="tree"
            :data="treeData"
            show-checkbox
            node-key="unqId"
            default-expand-all
            :expand-on-click-node="false"
            :props="defaultProps"
            @check="onCheck"
          >
            <span
              slot-scope="{node, data}"
              class="custom-tree-node"
              :style="node.level === 2 ? 'margin-top: 10px;' : ''"
            >
              <el-row>
                <el-col
                  :xs="8"
                  :sm="8"
                  :lg="6"
                >
                  <div
                    style="color:#666;font-size: 14px;"
                    :style="node.level === 2 ? 'margin-top: 1px;' : ''"
                  >
                    {{ data.name }}
                  </div>
                </el-col>
                <el-col
                  v-if="node.level === 2"
                  :xs="10"
                  :sm="12"
                  :lg="14"
                >
                  <div style="color:#666;">
                    <el-checkbox
                      v-model="data.mail"
                      :disabled="!$checkPermission(['updateNotificationMethodConfig'])"
                      @change="checkChange(data, $event)"
                    >
                      站内信
                    </el-checkbox>
                    <el-checkbox
                      v-model="data.phone"
                      :disabled="!$checkPermission(['updateNotificationMethodConfig'])"
                      @change="checkChange(data, $event)"
                    >
                      手机
                    </el-checkbox>
                    <el-checkbox
                      v-model="data.notification"
                      :disabled="!$checkPermission(['updateNotificationMethodConfig'])"
                      @change="checkChange(data, $event)"
                    >
                      邮箱
                    </el-checkbox>
                    <el-checkbox
                      v-model="data.wechat"
                      :disabled="!$checkPermission(['updateNotificationMethodConfig'])"
                      @change="checkChange(data, $event)"
                    >
                      微信
                    </el-checkbox>
                    <el-checkbox
                      v-model="data.app"
                      :disabled="!$checkPermission(['updateNotificationMethodConfig'])"
                      @change="checkChange(data, $event)"
                    >
                      app
                    </el-checkbox>
                  </div>
                </el-col>
                <el-col
                  v-if="node.level === 2"
                  :xs="6"
                  :sm="4"
                  :lg="4"
                >
                  <el-button
                    :disabled="!$checkPermission(['noticeUpdataPerson'])"
                    type="text"
                    size="mini"
                    @click="() => updataPerson(node, data)"
                  >
                    修改通知接收人
                  </el-button>
                </el-col>
              </el-row>
            </span>
          </el-tree>

          <noticePerson
            ref="noticePerson"
            @load="queryAll"
          />
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
  getNoticeList,
  saveNotice,
  updateNotice
} from '@/api/system-in-notice-config'
import noticePerson from '@/views/system-management/notice-config/noticePerson.vue'

@Component({
  name: '',
  components: {
    noticePerson
  },
  props: {}
})
export default class extends Vue {
  /** data */
  private treeData: any[] = []
  private checkList: any[] = []
  private checkObj: any = {}
  private loading: boolean = false
  private defaultProps = {
    children: 'result',
    label: 'name'
  }

  /** computed */

  /** methods */
  private created() {
    this.queryAll()
  }

  private queryAll() {
    this.loading = true
    getNoticeList().then((res: any) => {
      const data = res.data || []
      const list = data
      const arrC: any[] = []
      this.treeData = list.map((it: any) => {
        const isA = (it.result || []).every((r: any) => r.status === 1)
        if (it.status === 1 && isA) arrC.push(it.unqId)
        const arr = (it.result || []).map((a: any) => {
          if (a.status === 1) arrC.push(a.unqId)
          const { app, mail, notification, phone, wechat, status, ...obj } = a
          return {
            ...obj,
            app: app === 1,
            mail: mail === 1,
            notification: notification === 1,
            phone: phone === 1,
            wechat: wechat === 1
          }
        })
        return {
          ...it,
          result: arr
        }
      })
      this.setCheckedKeys(arrC)
      this.loading = false
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }

  private setCheckedKeys(arr: any[]) {
    const root: any = this.$refs.tree
    root.setCheckedKeys(arr)
  }

  private onCheck(checkedNodes: any) {
    const { parentId, unqId } = checkedNodes
    this.checkObj = {
      parentId,
      unqId
    }
    const root: any = this.$refs.tree
    const keys = root.getCheckedKeys()
    const isT = keys.some((k: any) => unqId === k)
    if (isT) {
      this.checkObj.status = 1
    } else {
      this.checkObj.status = 0
    }
    this.saveHomePage()
  }

  private checkChange(data: any, el: any) {
    const { app, mail, notification, phone, wechat, ...obj } = data
    this.checkObj = {
      ...obj,
      app: app ? 1 : 0,
      mail: mail ? 1 : 0,
      notification: notification ? 1 : 0,
      phone: phone ? 1 : 0,
      wechat: wechat ? 1 : 0
    }
    this.updateHomePage()
  }

  private updateHomePage() {
    this.loading = true
    updateNotice(this.checkObj)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.loading = false
        this.queryAll()
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

  private saveHomePage() {
    this.loading = true
    saveNotice(this.checkObj)
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.loading = false
        this.queryAll()
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }

  private updataPerson(node: any, data: any) {
    (this.$refs.noticePerson as any).show(data)
  }
}
</script>

<style lang="scss" scoped>
.notice-title {
  background-color: #fafafa;
  height: 40px;
  line-height: 40px;
}
.custom-tree-node {
  width: 100%;
}

::v-deep .el-tree-node__content {
  width: 100%;
}
</style>
