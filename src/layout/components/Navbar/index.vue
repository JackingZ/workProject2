<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb
      id="breadcrumb-container"
      class="breadcrumb-container"
    />
    <div class="right-menu">
      <div
        class="right-menu-search"
        @click.stop="() => {}"
      >
        <transition name="search-input-transform">
          <el-select
            v-if="show"
            ref="autocompleteInput"
            v-model="keyword"
            size="small"
            style="width: 200px"
            filterable
            remote
            reserve-keyword
            placeholder="菜单搜索"
            :remote-method="querySearch"
            @change="handleSelect"
            @blur="autocompleteBlur"
          >
            <el-option
              v-for="item in routerList"
              :key="item.name"
              :label="item.value"
              :value="item.name"
            />
          </el-select>
        </transition>
        <i
          title="菜单搜索"
          class="el-icon-search"
          @click="switchInput"
        />
      </div>
      <!-- 通知消息 -->
      <el-popover
        v-model="messageShow"
        placement="bottom-end"
        title=""
        width="400"
        trigger="click"
        @show="onIcon"
      >
        <div v-loading="loading">
          <el-row style="padding-bottom: 10px;border-bottom: 1px solid #EBEFF5;">
            <el-col :span="12">
              未读消息({{ unNum }})
            </el-col>
            <el-col
              :span="12"
              style="text-align: right;color: #999999;"
            >
              通知设置
            </el-col>
          </el-row>
          <div
            v-for="item in noticeList"
            :key="item.id"
            style="padding: 10px 0;border-bottom: 1px solid #EBEFF5;"
          >
            <el-row>
              <el-col :span="18">
                <el-button
                  size="mini"
                  class="btn-size btn-color"
                >
                  {{ item.msgType }}
                </el-button>
                <span style="margin-left: 10px;">{{ item.receiveTime }}</span>
              </el-col>
              <el-col
                :span="6"
                style="text-align: right;"
              >
                <el-button
                  v-if="item.isRead === 0"
                  type="text"
                  size="mini"
                  class="btn-size"
                  @click="onRead(item.id)"
                >
                  标记已读
                </el-button>
              </el-col>
            </el-row>
            <div style="padding-top: 5px;">
              <span
                class="notice-word"
                style="cursor: pointer;"
                @click="onInfo(item)"
              >
                {{ item.msgTitle + ' ' + item.msgContent }}
              </span>
            </div>
          </div>
          <el-row style="padding-top: 10px;">
            <el-col
              :span="24"
              style="text-align: right;"
            >
              <el-button
                type="text"
                size="mini"
                class="btn-size"
                @click="onView"
              >
                查看全部通知
                <i class="el-icon-arrow-right el-icon--right" />
              </el-button>
            </el-col>
          </el-row>
        </div>
        <el-badge
          slot="reference"
          :value="unNum"
          :hidden="!unNum"
          :max="99"
          class="icon-badge"
        >
          <i
            title="通知"
            class="el-icon-bell"
          />
        </el-badge>
      </el-popover>

      <span class="right-menu-user">当前用户：{{ userInfo.realName || userInfo.username }}</span>
      <template v-if="device!=='mobile'">
        <!-- <header-search class="right-menu-item" /> -->
        <!-- <error-log class="errLog-container right-menu-item hover-effect" /> -->
        <!-- <screenfull class="right-menu-item hover-effect" /> -->
        <!-- <el-tooltip
          :content="$t('navbar.size')"
          effect="dark"
          placement="bottom"
        >
          <size-select class="right-menu-item hover-effect" />
        </el-tooltip> -->
        <lang-select class="right-menu-item hover-effect" />
      </template>
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img
            :src="avatar"
            class="user-avatar"
          >
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/profile/">
            <el-dropdown-item>
              {{ $t('navbar.profile') }}
            </el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link>
          <a
            target="_blank"
            href="https://github.com/armour/vue-typescript-admin-template/"
          >
            <el-dropdown-item>
              {{ $t('navbar.github') }}
            </el-dropdown-item>
          </a>
          <a
            target="_blank"
            href="https://armour.github.io/vue-typescript-admin-docs/"
          >
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item>
            <div
              @click="gotoOrderTracking"
            >
              订单追踪
            </div>
          </el-dropdown-item>
          <el-dropdown-item>
            <div
              @click="updatePass"
            >
              {{ $t('navbar.updatePassword') }}
            </div>
          </el-dropdown-item>
          <el-dropdown-item>
            <div
              @click="logout"
            >
              {{ $t('navbar.logOut') }}
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="isShow"
      :close-on-click-modal="false"
      width="500px"
      append-to-body
      @close="close"
    >
      <editUserInfo
        ref="editUserInfo"
        @close="close"
        @logout="logout"
      />
    </el-dialog>
    <transition name="el-notification-fade">
      <div
        v-show="messageVisible"
        class="el-notification message-latest"
        role="alert"
      >
        <div
          class="el-notification__closeBtn el-icon-close"
          @click.stop="onClose"
        />
        <div
          v-for="item in latestList"
          :key="item.id"
          style="width: 300px;padding-top: 2px;"
        >
          <el-row>
            <el-col :span="18">
              <el-button
                size="mini"
                class="btn-size btn-color"
              >
                {{ item.msgType }}
              </el-button>
              <span style="margin-left: 10px;">{{ item.receiveTime }}</span>
            </el-col>
            <el-col
              :span="6"
              style="text-align: right;"
            >
              <el-button
                v-if="item.isRead === 0"
                type="text"
                size="mini"
                class="btn-size"
                @click="onRead(item.id, 'lastest')"
              >
                标记已读
              </el-button>
            </el-col>
          </el-row>
          <div style="padding-top: 5px;">
            <span
              class="notice-word"
              style="cursor: pointer;"
              @click="onInfo(item, 'lastest')"
            >
              {{ item.msgTitle + ' ' + item.msgContent }}
            </span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'
import { TagsViewModule } from '@/store/modules/tags-view'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import ErrorLog from '@/components/ErrorLog/index.vue'
import Hamburger from '@/components/Hamburger/index.vue'
import HeaderSearch from '@/components/HeaderSearch/index.vue'
import LangSelect from '@/components/LangSelect/index.vue'
import Screenfull from '@/components/Screenfull/index.vue'
import SizeSelect from '@/components/SizeSelect/index.vue'

import editUserInfo from '@/layout/components/Navbar/editUserInfo.vue'
import {
  getInfoList,
  updateInfo,
  getRotationNotice,
  closeRotationNotice
} from '@/api/system-in-notice-config'
import { EventBus } from '@/utils/event-bus'

@Component({
  name: 'Navbar',
  components: {
    Breadcrumb,
    ErrorLog,
    Hamburger,
    HeaderSearch,
    LangSelect,
    Screenfull,
    SizeSelect,
    editUserInfo
  }
})
export default class extends Vue {
  /** data */
  private isShow: boolean = false
  private show: boolean = false
  private messageShow: boolean = false
  private messageVisible: boolean = false
  private loading: boolean = false
  private noticeList: any[] = []
  private latestList: any[] = []
  private routerList: any[] = []
  private unNum: number = 0
  private timer: any = ''
  private keyword: any = ''

  /** computed */
  get custId(): string {
    const info = UserModule.info || {}
    const custId = (info as any).custId
    return custId
  }

  get sidebar() {
    return AppModule.sidebar
  }

  get device() {
    return AppModule.device.toString()
  }

  get avatar() {
    return UserModule.avatar
  }

  get userName() {
    return UserModule.name
  }
  // 用户信息
  get userInfo() {
    const info: any = UserModule.info
    return info
  }

  get routes() {
    const routes = PermissionModule.routes
    const newRoutes = JSON.parse(JSON.stringify(routes))
    return newRoutes
  }

  /** methods */
  private gotoOrderTracking() {
    this.$router.push({ name: 'orderTracking' })
  }
  private switchInput() {
    this.keyword = ''
    this.show = !this.show
    this.routerList = []
    if (this.show) {
      this.$nextTick(() => {
        const autocompleteInput: any = this.$refs.autocompleteInput
        autocompleteInput.focus()
      })
      document.body.addEventListener('click', this.hideSearchByBody)
    } else {
      document.body.removeEventListener('click', this.hideSearchByBody)
    }
  }
  private querySearch(queryString: any) {
    const routerList: any[] = []
    const fn = (source: any[]) => {
      source.forEach((item: any) => {
        if (item.children && item.children.length > 0) {
          fn(item.children)
        } else {
          if (item.meta && !item.meta.hidden) {
            item.value = this.$t('route.' + item.meta.title)
            if (item.meta.isJHT) {
              if (this.custId === '0') {
                routerList.push(item)
              }
            } else {
              routerList.push(item)
            }
          }
        }
      })
    }
    if (queryString) {
      fn(this.routes)
    }
    this.routerList = routerList.filter((e: any) => e.value.indexOf(queryString) !== -1)
  }
  private handleSelect() {
    this.show = false
    this.$router.push({ name: this.keyword })
  }
  private hideSearchByBody() {
    document.body.removeEventListener('click', this.hideSearchByBody)
    this.keyword = ''
    this.show = false
  }
  private autocompleteBlur() {
    setTimeout(() => {
      if (this.show) {
        this.show = false
      }
    }, 500)
  }
  private getDing() {
    EventBus.$on('toNoticeUpdateDing', (val: any) => {
      this.getNotice()
    })
  }
  private setDing() {
    EventBus.$emit('fromNoticeUpdateDing')
  }

  private toggleSideBar() {
    AppModule.ToggleSideBar(false)
  }

  private logout() {
    const loading = this.$loading({
      lock: true,
      text: '退出登录中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    UserModule.LogOut().then(() => {
      loading.close()
      TagsViewModule.removeView()
      this.$router.push(`/login`)
    }).catch(() => {
      loading.close()
      TagsViewModule.removeView()
      this.$router.push(`/login`)
    })
  }

  private updatePass() {
    this.$router.push({
      path: '/update-password'
    })
  }
  private close() {
    this.isShow = false
    const root: any = this.$refs.editUserInfo
    this.$nextTick(() => {
      root.reset()
    })
  }
  private async getNotice() {
    this.loading = true
    getInfoList({
      model: {
        isRead: 0
      },
      page: 1,
      size: 3
    }).then((res: any) => {
      const data = res.data || {}
      this.noticeList = data.result || []
      this.unNum = data.noReadCount
      this.loading = false
    }).catch((err: any) => {
      this.loading = false
      return err
    })
  }
  private onIcon() {
    // this.messageShow = !this.messageShow
    this.noticeList = []
    if (this.messageShow) {
      this.getNotice()
    }
  }
  private onRead(ids?: string, str?: string) {
    this.loading = true
    updateInfo({
      readId: '1',
      ids
    })
      .then((res: any) => {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.loading = false
        if (str) {
          this.messageVisible = false
        }
        this.getNotice()
        this.setDing()
      })
      .catch((err: any) => {
        this.loading = false
        return err
      })
  }
  private onInfo(row: any, val?: string) {
    this.$confirm(row.msgContent, row.msgTitle, {
      confirmButtonText: '知道了',
      closeOnClickModal: false,
      showCancelButton: false,
      type: 'info'
    })
      .then(() => {
        this.onRead(row.id)
        if (val) {
          this.messageVisible = false
        }
      })
      .catch(() => {
        this.onRead(row.id)
        if (val) {
          this.messageVisible = false
        }
      })
  }
  private onView() {
    this.messageShow = false
    this.$router.push({ path: '/system/notice-center' })
  }
  private onClose() {
    this.messageVisible = false
    const id = (this.latestList[0] || {}).id
    closeRotationNotice({
      id
    }).then((res: any) => {}).catch(() => {})
  }

  private getTimeout() {
    this.timer = ''
    getInfoList({
      model: {
        isRead: 0
      },
      page: 1,
      size: 9999
    }).then((res: any) => {
      const data = res.data || {}
      this.unNum = data.noReadCount
      this.loading = false
    }).catch(() => {
      this.loading = false
    }).finally(() => {
      // this.timer = setTimeout(() => {
      //   this.getTimeout()
      // }, 10000)
    })
    // 轮询
    getRotationNotice().then((res: any) => {
      this.latestList = res.data || []
      if (this.latestList.length > 0) {
        this.messageVisible = true
      }
    }).catch(() => {
      this.messageVisible = false
    })
  }
  private beforeDestroy() {
    clearTimeout(this.timer)
    EventBus.$off('fromNoticeUpdateDing')
  }
  private async mounted() {
    this.getTimeout()
    this.getDing()
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    padding: 0 15px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
    align-items: center;
    .right-menu-search{
      margin-right: 10px;
      position: relative;
      min-width: 24px;
      i{
        position: absolute;
        top: 50%;
        right: 2px;
        transform: translateY(-50%);
        font-size: 22px;
        cursor: pointer;
      }
    }

    &:focus {
      outline: none;
    }

    .right-menu-user {
      display: inline-block;
      height: 100%;
      padding: 0 20px;
      line-height: 50px;
      vertical-align: text-bottom;
      font-size: 15px;
      color: #5a5e66;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.icon-badge {
  margin-right: 6px;
  i {
    font-size: 22px;
    cursor: pointer;
  }
  ::v-deep .el-badge__content {
    height: 16px;
    line-height: 13px;
  }
  ::v-deep .el-badge__content.is-fixed {
    top: 12px;
  }
}
.btn-size {
  padding: 2px;
}
.btn-color {
  background-color: #FF7D19;
  color: #fff;
}
.notice-word {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
}
.message-latest {
  width: 360px;
  position: fixed;
  z-index: 9999;
  top: 85px;
  right: 15px;
}
.el-notification-fade-enter-active {
  right: 0;
  -webkit-transform: translateX(100%);
  transform: translateX(100%)
}

.el-notification-fade-leave-active {
  opacity: 0
}
.search-input-transform-leave-active,
.search-input-transform-enter-active {
  transition: all .5s;
}
.search-input-transform-enter {
  opacity: 0;
  /*transform: translateX(200px);*/
  width: 0 !important;
}
.search-input-transform-leave-to {
  opacity: 0;
  /*transform: translateX(200px);*/
  width: 0 !important;
}
</style>
