<template>
  <div
    v-loading="loading"
    style="padding-top: 60px"
  >
    <div
      style="
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        height: 60px;
        background: #F5F5F5;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 23px;
      "
    >
      <div
        style="
          font-size: 20px;
          font-family: Microsoft YaHei;
          font-weight: 600;
          color: #333333;
        "
      >
        打印入仓单
      </div>
      <div style="display: flex">
        <div
          class="btn"
          @click="onPrint"
        >
          <span class="icon" />
          <span>打印</span>
        </div>
        <div
          class="btn"
          @click="onPdf"
        >
          <span class="pdf" />
          <span>下载PDF</span>
        </div>
        <!--<el-button
          type="primary"
          size="small"
          @click="onPrint"
        >
          打印
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="onPdf"
        >
          导出PDF
        </el-button>-->
      </div>
    </div>
    <div
      id="printDiv"
      style="text-align:center;width: 794px;height: 1123px;padding:20px 20px 20px 15px;margin: 0 auto"
    >
      <table
        id="report"
        cellspacing="0"
        cellpadding="0"
        style="table-layout:fixed;margin:auto;border-collapse:collapse;width: 100%;height: 100%;"
      >
        <colgroup>
          <col style="width:68px;">
          <col style="width:153px;">
          <col style="width:76px;">
          <col style="width:53px;">
          <col style="width:50px;">
          <col style="width:50px;">
          <col style="width:55px;">
        </colgroup>
        <tbody>
          <tr
            rn="1"
            style="height:27px;"
          >
            <td
              colspan="7"
              style="border: 1px solid #000000;border-bottom-style: none;font-size: 24px;vertical-align:middle;text-align:center;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              &ensp;&ensp;新系统--聚货通公共仓
            </td>
          </tr>
          <tr
            rn="2"
            style="height:22px;"
          >
            <td
              colspan="7"
              style="border: 1px solid #000000;border-top-style: none;font-size: 18px;vertical-align:middle;text-align:center;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              入仓单
            </td>
          </tr>
          <tr
            rn="3"
            style="height:21px;"
          >
            <td
              class="report1_3"
              style="border: 1px solid #000000;font-size: 12px;text-align:left;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              服务渠道
            </td>
            <td
              colspan="3"
              style="border: 1px solid #000000;font-size: 12px;text-align:left;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              {{ form.channel || '' }}
            </td>
            <td
              style="border: 1px solid #000000;font-size: 12px;text-align:left;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              下单日期
            </td>
            <td
              colspan="2"
              style="border: 1px solid #000000;font-size: 12px;text-align:left;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              {{ form.createTime ? dayjs(form.createTime).format('YYYY-MM-DD') : '' }}
            </td>
          </tr>
          <tr
            rn="4"
            style="height:22px;"
          >
            <td
              style="border: 1px solid #000000;font-size: 12px;text-align:center;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              预约日期
            </td>
            <td
              style="border: 1px solid #000000;font-size: 12px;text-align:center;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            />
            <td
              style="border: 1px solid #000000;font-size: 12px;text-align:center;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              预约时间
            </td>
            <td
              style="border: 1px solid #000000;font-size: 12px;text-align:center;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            />
            <td
              style="border: 1px solid #000000;font-size: 12px;text-align:center;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            />
            <td
              style="border: 1px solid #000000;font-size: 12px;text-align:center;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              分配卸货口
            </td>
            <td
              style="border: 1px solid #000000;font-size: 12px;text-align:center;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            />
          </tr>
          <tr
            rn="5"
            style="height:23px;"
          >
            <td
              colspan="7"
              style="border: 1px solid #000000;font-size: 15px;text-align:center;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              入仓编码
            </td>
          </tr>
          <tr
            rn="6"
            style="height:105px;"
          >
            <td
              id="svg-box"
              colspan="7"
              style="border: 1px solid #000000;font-size: 14px;text-align:center;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            />
          </tr>
          <tr
            rn="7"
            style="height:21px;"
          >
            <td
              colspan="3"
              style="border: 1px solid #000000;font-size: 12px;font-weight:bold;text-align:center;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              增值服务
            </td>
            <td
              style="border: 1px solid #000000;font-size: 12px;text-align:center;font-family:宋体;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              装货方式
            </td>
            <td
              style="border: 1px solid #000000;font-size: 12px;text-align:center;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              件数
            </td>
            <td
              style="border: 1px solid #000000;font-size: 12px;text-align:center;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              重量
            </td>
            <td
              style="border: 1px solid #000000;font-size: 12px;text-align:center;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              体积
            </td>
          </tr>
          <tr
            rn="8"
            style="height:34px;"
          >
            <td
              colspan="3"
              style="border: 1px solid #000000;font-size: 12px;font-weight:bold;text-align:center;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            />
            <td
              style="border: 1px solid #000000;font-size: 12px;text-align:center;font-family:宋体;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              {{ form.packing || '' }}
            </td>
            <td
              style="border: 1px solid #000000;font-size: 12px;text-align:center;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              {{ form.numbers || '' }}
            </td>
            <td
              style="border: 1px solid #000000;font-size: 12px;text-align:center;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              {{ $volumeConversion(form.weight || 0, 'KGS', 'KGS', 2) }}
            </td>
            <td
              style="border: 1px solid #000000;font-size: 12px;text-align:center;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              {{ $volumeConversion(form.volume || 0, 'CBCM', 'CBM', 2) }}
            </td>
          </tr>
          <tr
            rn="9"
            style="height:37px;"
          >
            <td
              colspan="7"
              style="border: 1px solid #000000;font-size: 26px;text-align:center;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              {{ form.fbaCode || '' }}
            </td>
          </tr>
          <tr
            rn="10"
            style="height:20px;"
          >
            <td
              colspan="7"
              style="border: 1px solid #000000;font-size: 16px;text-align:center;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              送货须知
            </td>
          </tr>
          <tr
            rn="11"
            style="height:182px;vertical-align: top;overflow: hidden;overflow: hidden;text-overflow: ellipsis;"
          >
            <td
              colspan="7"
              style="border: 1px solid #000000;font-size: 12px;text-align:left;"
            >
              <div
                id="text-box"
              />
            </td>
          </tr>
          <tr
            rn="12"
            style="height:23px;"
          >
            <td
              colspan="7"
              style="border: 1px solid #000000;font-size: 16px;text-align:center;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              入仓流程
            </td>
          </tr>
          <tr
            rn="13"
            style="height:111px;"
          >
            <td
              colspan="7"
              style="border: 1px solid #000000;font-size: 12px;text-align:left;vertical-align: middle;line-height:16px;overflow:hidden;white-space:nowrap;text-overflow: ellipsis;"
            >
              【车辆入闸】在园区入口取车卡入场（自动识别车牌）<br>
              【车辆停泊】入场后开至聚货通仓库，请在收货口泊车，并携带入仓单办理入仓登记手续<br>
              【取号排队】登记完成，索取司机排队单<br>
              【卸货】按指定卸货口停靠，递交入仓单，工作人员卸货<br>
              【签收、放行】卸货完成，工作人员现场签收，车辆放行<br>
              【车辆离场出闸】关车门，开车驶离卸货车位，出闸<br>
              ★如有任何问题，欢迎随时致电我司各仓库操作部&ensp;
            </td>
          </tr>
          <tr
            rn="14"
            style="height:33px;"
          >
            <td
              style="border: 1px solid #000000;font-size: 12px;text-align:left;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              仓库:
            </td>
            <td
              colspan="6"
              style="border: 1px solid #000000;font-size: 12px;text-align:left;font-family:宋体;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              {{ form.address || '' }}
            </td>
          </tr>
          <tr
            rn="15"
            style="height:21px;"
          >
            <td
              style="border: 1px solid #000000;font-size: 12px;text-align:left;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              收货时间：
            </td>
            <td
              style="border: 1px solid #000000;font-size: 12px;text-align:center;font-family:宋体;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              {{ form.reciveTime1 || '' }}
            </td>
            <td
              style="border: 1px solid #000000;font-size: 12px;text-align:center;font-family:宋体;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              {{ form.reciveTime2 || '' }}
            </td>
            <td
              style="border: 1px solid #000000;font-size: 12px;text-align:center;font-family:宋体;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              时间
            </td>
            <td
              style="border: 1px solid #000000;font-size: 12px;text-align:center;font-family:宋体;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              {{ (form.workTime || '').split(',')[0] || '' }}
            </td>
            <td
              colspan="2"
              style="border: 1px solid #000000;font-size: 12px;text-align:center;font-family:宋体;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              {{ (form.workTime || '').split(',')[1] || '' }}
            </td>
          </tr>
          <tr
            rn="16"
            style="height:21px;"
          >
            <td
              style="border: 1px solid #000000;font-size: 12px;text-align:center;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              &ensp;联系人：&ensp;
            </td>
            <td
              style="border: 1px solid #000000;font-size: 12px;text-align:left;font-family:宋体;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              {{ form.principal || '' }}
            </td>
            <td
              colspan="2"
              style="border: 1px solid #000000;font-size: 12px;text-align:center;font-family:宋体;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              联系电话：
            </td>
            <td
              colspan="3"
              style="border: 1px solid #000000;font-size: 12px;text-align:left;font-family:宋体;vertical-align:middle;white-space:nowrap;overflow:hidden;word-break:keep-all;"
            >
              {{ form.phoneNo || '' }} / {{ form.emergencyPhone }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import printJS from 'print-js'
import dayjs from 'dayjs'
import JsBarcode from 'jsbarcode'
import html2canvas from 'html2canvas'

import {
  getOrderInfoPrint
} from '@/api/orderlist-at-whole'

@Component({
  name: 'layoutFile'
})

export default class extends Vue {
  /* data */
  private form: any = {}
  private dayjs = dayjs
  private loading: boolean = false

  /* method */
  private onPdf() {
    const el: any = document.getElementById('printDiv')
    if (!el) return
    if (!this.form.code) {
      this.$message.error('暂无文件导出')
      return
    }
    this.loading = true
    html2canvas(el, { scale: 2 }).then((canvas: any) => {
      this.loading = false
      const pdfMake: any = (window as any).pdfMake
      const data = canvas.toDataURL()
      const docDefinition = {
        pageMargins: {
          top: 0,
          left: 0,
          bottom: 0,
          right: 0
        },
        content: [{
          image: data,
          width: 598
        }],
        defaultStyle: {
          font: 'SourceHanSansCN'
        }
      }
      pdfMake.createPdf(docDefinition).download(this.form.code + '入仓单.pdf')
    }).catch(() => {
      this.loading = false
      this.$message.error('文件导出失败')
    })
  }
  private onPrint() {
    printJS({ printable: 'printDiv', type: 'html', scanStyles: false })
  }
  private mounted() {
    const code = this.$route.query.code || ''
    if (code) {
      this.loading = true
      const params: any = {
        code
      }
      getOrderInfoPrint(params)
        .then((res: any) => {
          const data = res.data || {}
          const id = data.code || ''
          const terms = data.terms || ''
          const startNum = terms ? terms.indexOf('送货须知') + 4 : 0
          const endNum = terms ? terms.indexOf('入仓流程') : terms.length
          const str = terms.slice(startNum, endNum) || ''
          const el: any = document.getElementById('text-box')
          const json = str.replace(/<h5>/g, '<h5 style="margin: 0;font-weight: normal;">')
          el.innerHTML = json
          this.form = data
          if (id) {
            const svg: any = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
            const divWrap: any = document.getElementById('svg-box')
            JsBarcode(svg, id, {
              width: 3.5,
              height: 100,
              marginTop: 1,
              marginLeft: 0,
              marginRight: 0,
              marginBottom: 3,
              fontSize: 14
            })
            divWrap.appendChild(svg)
          }
          this.loading = false
        })
        .catch((err: any) => {
          this.loading = false
          return err
        })
    }
  }
}
</script>
<style lang="scss" scoped>
  .btn{
    margin-left: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 105px;
    height: 34px;
    border: 1px solid #A9A9A9;
    border-radius: 4px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #333333;
    transition: all .3s;
  }
  .icon{
    margin-right: 5px;
    width: 16px;
    height: 16px;
    background: url("./print.png") center center no-repeat;
    background-size: 100%;
  }
  .pdf{
    margin-right: 5px;
    width: 16px;
    height: 19px;
    background: url("./pdf.png") center center no-repeat;
    background-size: 100%;
  }
  .btn:hover{
    border-color: #1890FF;
    color: #1890FF;
    .icon{
      background: url("./print_h.png") center center no-repeat;
      background-size: 100%;
    }
    .pdf{
      background: url("./pdf_h.png") center center no-repeat;
      background-size: 100%;
    }
  }
</style>
