<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <app-slide
      v-if="env !== 'prod'"
      v-loading="isSideLoading"
      :is-active="isActive"
    >
      <div class="tree-title">
        机构列表
      </div>
      <el-tree
        ref="orgtree"
        :data="orgSelectList"
        :props="orgProps"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        empty-text="暂无数据"
        class="filter-tree"
        highlight-current
        @node-click="selOrg"
      />
    </app-slide>
    <div
      v-if="env !== 'prod'"
      style="display: flex;align-items: center;"
    >
      <div
        class="arrow-btn"
        @click="toggle"
      >
        <img
          :class="{arrow: !isActive}"
          src="@/assets/imgs/arrow_left.png"
          alt
        >
      </div>
    </div>
    <div
      v-if="env !== 'prod'"
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          title="开发进度"
          info="你有一只小毛驴你从来也不骑"
        />
        <div class="app-panel">
          <el-button
            type="text"
            icon="el-icon-circle-plus-outline"
            @click="handleAdd"
          >
            新增
          </el-button>
          <el-button
            type="text"
            icon="el-icon-circle-plus-outline"
            style="margin-left: 10px"
            @click="handleExport"
          >
            导出
          </el-button>

          <!-- <el-cascader
            v-model="vv"
            :options="aaa.data.result"
            :props="{label: 'name', value: 'id', multiple: true, checkStrictly: true}"
            collapse-tags
          /> -->

          <el-upload
            action
            :http-request="uploadFile"
          >
            <el-button size="small">
              <i class="el-icon-upload" />
              上传文件示例
            </el-button>
            <div
              slot="tip"
              class="el-upload__tip"
            >
              {{ $t('protocol.com.expandedName') }}：doc .docx .pdf .jpg.png...
            </div>
          </el-upload>

          <el-table
            :data="list"
            height="calc(100vh - 350px)"
            style="width: 100%;margin: 10px 0;"
            border
          >
            <el-table-column
              label="序号"
              width="50"
            >
              <template slot-scope="scope">
                {{ scope.row.index }}
              </template>
            </el-table-column>

            <el-table-column
              label="任务"
              min-width="230"
            >
              <template slot-scope="scope">
                {{ scope.row.taskName }}
              </template>
            </el-table-column>
            <el-table-column
              label="处理人"
              width="100"
            >
              <template slot-scope="scope">
                {{ scope.row.developer }}
              </template>
            </el-table-column>
            <el-table-column
              label="完成时间"
              width="120"
            >
              <template slot-scope="scope">
                {{ scope.row.time }}
              </template>
            </el-table-column>
            <el-table-column
              label="完成进度"
              min-width="180"
            >
              <template slot-scope="scope">
                <el-progress :percentage="scope.row.schedule" />
              </template>
            </el-table-column>
            <el-table-column
              label="状态"
              width="100"
            >
              <template slot-scope="{row}">
                <el-tag
                  :type="row.status"
                  effect="dark"
                >
                  {{ row.status === 'success' ? '已完成' : '进行中' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            :current-page.sync="currentPage1"
            :page-size="100"
            layout="total, prev, pager, next"
            :total="1000"
            style="text-align: right;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>

        <app-drawer
          :is-show="isShow"
          :drawer-title="isEdit ? '编辑' : '新增'"
          :mask-closable="false"
          drawer-style="width: 500px;"
          @drawerClose="close"
          @drawerConfirm="confirm"
        >
          <div class="app-container">
            <div class="app-panel">
              <el-form
                :label-position="labelPosition"
                label-width="80px"
                size="small"
                :model="formLabelAlign"
              >
                <el-form-item label="名称">
                  <el-input v-model="formLabelAlign.name" />
                </el-form-item>
                <el-form-item label="活动区域">
                  <el-input v-model="formLabelAlign.region" />
                </el-form-item>
                <el-form-item label="活动形式">
                  <el-input v-model="formLabelAlign.type" />
                </el-form-item>
              </el-form>
            </div>
          </div>
        </app-drawer>
      </div>
    </div>
    <div
      v-if="env === 'prod'"
      class="dashboard-container"
      style="flex: 1;overflow: auto;"
    >
      <div class="app-container">
        <head-info
          title="Dashboard"
          info=""
        />
        <div class="app-panel">
          Welcome back
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import { ITransactionData } from '@/api/types'
import dayjs from 'dayjs'
const month = new Date().getMonth()
const year = new Date().getFullYear()

@Component({
  name: 'Dashboard',
  components: {},
  props: {}
})
export default class extends Vue {
  private masks = {
    weekdays: 'WWW'
  }
  private attributes = [
    {
      key: 1,
      customData: {
        title: 'Lunch with mom.',
        class: 'bg-red-600 text-white'
      },
      dates: new Date(year, month, 1)
    },
    {
      key: 2,
      customData: {
        title: 'Take Noah to basketball practice',
        class: 'bg-blue-500 text-white'
      },
      dates: new Date(year, month, 2)
    },
    {
      key: 3,
      customData: {
        title: "Noah's basketball game.",
        class: 'bg-blue-500 text-white'
      },
      dates: new Date(year, month, 5)
    },
    {
      key: 4,
      customData: {
        title: 'Take car to the shop',
        class: 'bg-indigo-500 text-white'
      },
      dates: new Date(year, month, 5)
    },
    {
      key: 4,
      customData: {
        title: 'Meeting with new client.',
        class: 'bg-teal-500 text-white'
      },
      dates: new Date(year, month, 7)
    },
    {
      key: 5,
      customData: {
        title: "Mia's gymnastics practice.",
        class: 'bg-pink-500 text-white'
      },
      dates: new Date(year, month, 11)
    },
    {
      key: 6,
      customData: {
        title: 'Cookout with friends.',
        class: 'bg-orange-500 text-white'
      },
      dates: { months: 5, ordinalWeekdays: { 2: 1 } }
    },
    {
      key: 7,
      customData: {
        title: "Mia's gymnastics recital.",
        class: 'bg-pink-500 text-white'
      },
      dates: new Date(year, month, 22)
    },
    {
      key: 8,
      customData: {
        title: 'Visit great grandma.',
        class: 'bg-red-600 text-white'
      },
      dates: new Date(year, month, 25)
    }
  ]
  private vv = ''
  private aaa = {
    success: true,
    code: 200,
    msg: '请求成功',
    data: {
      total: 1,
      result: [
        {
          id: 'GL',
          name: '全球',
          alias: 'Global',
          children: [
            {
              id: 'OA',
              name: '大洋洲',
              alias: 'Oceania',
              children: [
                {
                  id: 'AU',
                  name: '澳大利亚',
                  alias: 'Australia',
                  children: [],
                  parentId: 'OA'
                }
              ],
              parentId: 'GL'
            },
            {
              id: 'NA',
              name: '北美洲',
              alias: 'North America',
              children: [
                {
                  id: 'US',
                  name: '美国',
                  alias: 'U.S.A',
                  children: [
                    {
                      id: 'AK',
                      name: '阿拉斯加州-9-朱诺',
                      alias: 'Alaska',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'AL',
                      name: '阿拉巴马州-3-蒙哥马利',
                      alias: 'Alabama',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'AR',
                      name: '阿肯色州-7-小石城',
                      alias: 'Arkansas',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'AZ',
                      name: '亚利桑那州-8-菲尼克斯',
                      alias: 'Arizona',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'CA',
                      name: '加利福尼亚州-9-洛杉矶',
                      alias: 'California',
                      children: [
                        {
                          id: 'AB',
                          name: '阿尔伯塔-卡尔加里',
                          alias: 'Alberta',
                          children: [],
                          parentId: 'CA'
                        },
                        {
                          id: 'BC',
                          name: '不列巓哥伦比亚-温哥华',
                          alias: 'British Columbia',
                          children: [],
                          parentId: 'CA'
                        },
                        {
                          id: 'MB',
                          name: '曼尼托巴-温尼伯',
                          alias: 'Manitoba',
                          children: [],
                          parentId: 'CA'
                        },
                        {
                          id: 'NB',
                          name: '新不伦瑞克-圣约翰',
                          alias: 'New Brunswick',
                          children: [],
                          parentId: 'CA'
                        },
                        {
                          id: 'NL',
                          name: '纽芬兰-圣约翰斯',
                          alias: 'Newfoundland',
                          children: [],
                          parentId: 'CA'
                        },
                        {
                          id: 'NS',
                          name: '新斯科舍省-哈利发克斯',
                          alias: 'Nova Scotia',
                          children: [],
                          parentId: 'CA'
                        },
                        {
                          id: 'NT',
                          name: '西北地区',
                          alias: 'Northwest Territories',
                          children: [],
                          parentId: 'CA'
                        },
                        {
                          id: 'NU',
                          name: '纽纳瓦特',
                          alias: 'Nunavut',
                          children: [],
                          parentId: 'CA'
                        },
                        {
                          id: 'ON',
                          name: '安大略-多伦多',
                          alias: 'Ontario',
                          children: [],
                          parentId: 'CA'
                        },
                        {
                          id: 'PE',
                          name: '爱德华王子岛-夏洛特顿',
                          alias: 'Prince Edward Island',
                          children: [],
                          parentId: 'CA'
                        },
                        {
                          id: 'QC',
                          name: '魁北克-蒙特利尔',
                          alias: 'Quebec',
                          children: [],
                          parentId: 'CA'
                        },
                        {
                          id: 'SK',
                          name: '萨斯喀彻温-萨斯卡通',
                          alias: 'Saskatchewan',
                          children: [],
                          parentId: 'CA'
                        },
                        {
                          id: 'YT',
                          name: '育空地区',
                          alias: 'Yukon Territory',
                          children: [],
                          parentId: 'CA'
                        }
                      ],
                      parentId: 'US'
                    },
                    {
                      id: 'CO',
                      name: '科罗拉多州-8-丹佛',
                      alias: 'Colorado',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'CT',
                      name: '康涅狄格州-0-哈特福德',
                      alias: 'Connecticut',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'DE',
                      name: '特拉华州-0-多佛',
                      alias: 'Delaware',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'FL',
                      name: '佛罗里达州-3-塔拉哈西',
                      alias: 'Florida',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'GA',
                      name: '佐治亚州-3-亚特兰大',
                      alias: 'Georgia',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'HI',
                      name: '夏威夷州-9-檀香山',
                      alias: 'Hawaii',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'IA',
                      name: '艾奥瓦州-5-得梅因',
                      alias: 'Iowa',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'ID',
                      name: '爱达荷州-8-博伊西',
                      alias: 'Idaho',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'IL',
                      name: '伊利诺伊州-4-斯普林菲尔德',
                      alias: 'Illinois',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'IN',
                      name: '印第安纳州-4-印第安纳波利斯',
                      alias: 'Indiana',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'KS',
                      name: '堪萨斯州-6-托皮卡',
                      alias: 'Kansas',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'KY',
                      name: '肯塔基州-4-法兰克福',
                      alias: 'Kentucky',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'LA',
                      name: '路易斯安那州-7-巴吞鲁日',
                      alias: 'Louisiana',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'MA',
                      name: '马萨诸塞州-0-波士顿',
                      alias: 'Massachusetts',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'MD',
                      name: 'Maryland-2-马里兰州',
                      alias: 'Maryland',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'ME',
                      name: '缅因州-0-奥古斯塔',
                      alias: 'Maine',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'MI',
                      name: '密歇根州-4-兰辛',
                      alias: 'Michigan',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'MN',
                      name: '明尼苏达州-5-圣保罗',
                      alias: 'Minnesota',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'MO',
                      name: '密苏里州-6-杰斐逊城',
                      alias: 'Missouri',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'MS',
                      name: '密西西比州-3-杰克逊县',
                      alias: 'Mississippi',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'MT',
                      name: '蒙大拿州-5-海伦那',
                      alias: 'Montana',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'NC',
                      name: '北卡罗来纳州-2-罗利',
                      alias: 'North Carolina',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'ND',
                      name: '北达科他州-5-俾斯麦',
                      alias: 'North Dakota',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'NE',
                      name: '内布拉斯加州-6-林肯市',
                      alias: 'Nebraska',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'NH',
                      name: '新罕布什尔州-0-康科德',
                      alias: 'New hampshire',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'NJ',
                      name: '新泽西州-0-特伦顿',
                      alias: 'New jersey',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'NM',
                      name: '新墨西哥州-8-圣菲',
                      alias: 'New mexico',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'NV',
                      name: '内华达州-8-卡森城',
                      alias: 'Nevada',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'NY',
                      name: '纽约州-1-奥尔巴尼',
                      alias: 'New York',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'OH',
                      name: '俄亥俄州-8-哥伦布',
                      alias: 'Ohio',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'OK',
                      name: '俄克拉何马州-7-俄克拉何马城',
                      alias: 'Oklahoma',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'OR',
                      name: '俄勒冈州-4-塞勒姆',
                      alias: 'Oregon',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'PA',
                      name: '宾夕法尼亚州-1-哈里斯堡',
                      alias: 'Pennsylvania',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'RI',
                      name: '罗得岛州-0-普罗维登斯',
                      alias: 'Rhode island',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'SC',
                      name: '南卡罗来纳州-2-哥伦比亚',
                      alias: 'South carolina',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'SD',
                      name: '南达科他州-5-皮尔',
                      alias: 'South dakota',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'TN',
                      name: '田纳西州-3-纳什维尔',
                      alias: 'Tennessee',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'TX',
                      name: '得克萨斯州-7-奥斯汀',
                      alias: 'Texas',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'UT',
                      name: '犹他州-8-盐湖城',
                      alias: 'Utah',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'VA',
                      name: '弗吉尼亚州-2-里士满',
                      alias: 'Virginia',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'VT',
                      name: '佛蒙特州-0-蒙彼利埃',
                      alias: 'Vermont',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'WA',
                      name: '华盛顿州-2-奥林匹亚',
                      alias: 'Washington',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'WI',
                      name: '威斯康星州-5-麦迪逊',
                      alias: 'Wisconsin',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'WV',
                      name: '西弗吉尼亚州-2-查尔斯顿',
                      alias: 'West Virginia',
                      children: [],
                      parentId: 'US'
                    },
                    {
                      id: 'WY',
                      name: '怀俄明州-8-夏延',
                      alias: 'Wyoming',
                      children: [],
                      parentId: 'US'
                    }
                  ],
                  parentId: 'NA'
                },
                {
                  id: 'CA',
                  name: '加拿大',
                  alias: 'Canda',
                  children: [],
                  parentId: 'NA'
                }
              ],
              parentId: 'GL'
            },
            {
              id: 'EU',
              name: '欧洲',
              alias: 'Europe',
              children: [
                {
                  id: 'GB',
                  name: '英国',
                  alias: 'Britain',
                  children: [],
                  parentId: 'EU'
                },
                {
                  id: 'IT',
                  name: '意大利',
                  alias: 'Italy\n\n',
                  children: [],
                  parentId: 'EU'
                },
                {
                  id: 'FR',
                  name: '法国',
                  alias: 'France',
                  children: [],
                  parentId: 'EU'
                },
                {
                  id: 'ES',
                  name: '西班牙',
                  alias: 'Spain',
                  children: [],
                  parentId: 'EU'
                },
                {
                  id: 'DE',
                  name: '德国',
                  alias: 'Germany',
                  children: [],
                  parentId: 'EU'
                }
              ],
              parentId: 'GL'
            },
            {
              id: 'AS',
              name: '亚洲',
              alias: 'Asia',
              children: [
                {
                  id: 'KR',
                  name: '韩国',
                  alias: 'Korea',
                  children: [],
                  parentId: 'AS'
                },
                {
                  id: 'JP',
                  name: '日本',
                  alias: 'Japan',
                  children: [],
                  parentId: 'AS'
                },
                {
                  id: 'HK',
                  name: '香港',
                  alias: '\r\n香港\r\nHong Kong',
                  children: [],
                  parentId: 'AS'
                },
                {
                  id: 'CN',
                  name: '中国',
                  alias: 'China',
                  children: [],
                  parentId: 'AS'
                }
              ],
              parentId: 'GL'
            }
          ],
          parentId: null
        }
      ]
    }
  }
  private isSideLoading = false
  private isActive = false
  private isShow = false
  private isEdit = false
  private currentPage1 = 5
  private orgSelectList = []
  private orgProps = {
    label: 'title',
    children: 'children'
  }
  private formLabelAlign = {
    name: '',
    region: '',
    type: ''
  }
  private list: ITransactionData[] = [
    {
      index: 1,
      taskName: '设计后台Layout',
      time: '2019-07-21',
      developer: '马靖宇',
      status: 'success',
      schedule: 100
    },
    {
      index: 2,
      taskName: '国际化功能实现',
      time: '2019-07-22',
      developer: '马靖宇',
      status: 'success',
      schedule: 100
    },
    {
      index: 3,
      taskName: '路由和权限设计',
      time: '2019-07-25',
      developer: '马靖宇',
      status: 'success',
      schedule: 100
    },
    {
      index: 4,
      taskName: '完成左侧菜单和菜单所对应的组件',
      time: '2019-07-26',
      developer: '马靖宇',
      status: 'success',
      schedule: 100
    },
    {
      index: 5,
      taskName: '对接登录接口，处理用户信息缓存，权限校验，配置反向代理',
      time: '2019-07-26',
      developer: '马靖宇',
      status: 'success',
      schedule: 100
    }
  ]

  get labelPosition() {
    const lang = AppModule.language
    if (!lang) {
      return 'left'
    }
    return lang === 'en' ? 'top' : 'left'
  }

  get lang() {
    const lang = AppModule.language
    if (!lang) {
      return 'en'
    }
    return lang
  }

  get env() {
    return process.env.VUE_APP_ENV
  }

  // 文件上传示例
  private uploadFile(params: any): void {
    const { file } = params
    this.$upload(false, file, `files/${dayjs().valueOf() + '/' + file.name}`)
      .then((res: any) => {
        this.$message.success(`上传成功，传给后台的值为：${res.name}`)
      })
      .catch((err: any) => {
        console.log(err)
      })
  }

  private toggle() {
    // 左侧机构侧滑
    this.isActive = !this.isActive
  }

  private filterNode(value: any, data: any) {
    if (!value) return true
    return data.title.indexOf(value) !== -1
  }

  private selOrg(val: any) {
    this.$message.success(val)
  }

  private close() {
    this.isShow = false
  }

  private confirm() {
    this.close()
  }

  private handleAdd() {
    this.isShow = true
  }

  private handleExport() {
    this.close()
  }

  private handleSizeChange(val: string) {
    this.$message.success(val)
  }

  private handleCurrentChange(val: string) {
    this.$message.success(val)
  }

  private created() {
    console.log('env', this.env)
  }
}
</script>

<style lang="scss" scoped>
</style>
