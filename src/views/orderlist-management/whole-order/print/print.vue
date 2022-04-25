<template>
  <div
    id="svgWarp"
    style="position: fixed;top: -1000000px;left: -100000px;z-index: 9999"
  >
    <svg
      v-if="pageSize === 'm1015'"
      id="svg"
      xmlns="http://www.w3.org/2000/svg"
      width="283"
      height="425"
      viewBox="0 0 283 425"
    >
      <g>
        <rect
          width="283"
          height="425"
          fill="#fff"
        />
        <g
          transform="translate(10 10)"
          fill="none"
          stroke="#000"
          stroke-width="2"
          overflow="hidden"
        >
          <rect
            width="263"
            height="405"
            stroke="none"
          />
          <rect
            x="1"
            y="1"
            width="261"
            height="403"
            fill="none"
          />
        </g>
        <g
          transform="translate(10 10)"
        >
          <rect
            x="1"
            y="1"
            width="261"
            height="30"
            fill="none"
            stroke="none"
          />
          <text
            id="lscName"
            transform="translate(0 0)"
            font-size="14"
            font-family="SourceHanSansCN-Regular, Source Han Sans CN"
            x="131"
            y="20"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            {{ printData.lscName }}
          </text>
        </g>
        <line
          x1="11"
          y1="43"
          x2="273"
          y2="43"
          stroke-width="1"
          stroke="#000"
        />
        <g transform="translate(11 45)">
          <line
            x1="1"
            y1="117"
            x2="261"
            y2="117"
            stroke-width="1"
            stroke="#000"
          />
        </g>
        <g transform="translate(11 160)">
          <line
            x1="1"
            y1="57"
            x2="261"
            y2="57"
            stroke-width="1"
            stroke="#000"
          />
          <text
            id="code"
            font-size="20"
            font-family="SourceHanSansCN-Bold, Source Han Sans CN"
            font-weight="700"
            stroke="black"
            stroke-width=".5"
            x="130"
            y="30"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            {{ printData.code }}
          </text>
        </g>
        <g transform="translate(11 217)">
          <line
            x1="1"
            y1="39"
            x2="133"
            y2="39"
            stroke-width="1"
            stroke="#000"
          />
          <text
            font-size="20"
            font-family="SourceHanSansCN, Source Han Sans CN"
            font-weight="700"
            stroke="black"
            stroke-width=".5"
          >
            <tspan
              x="66"
              fill="#000"
              y="23"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              {{ printData.expressName }}
            </tspan>
          </text>
        </g>
        <g transform="translate(143 217)">
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="39"
            stroke-width="1"
            stroke="#000"
          />
          <line
            x1="1"
            y1="39"
            x2="130"
            y2="39"
            stroke-width="1"
            stroke="#000"
          />
          <text
            font-size="20"
            font-family="SourceHanSansCN-Bold, Source Han Sans CN"
            font-weight="700"
            stroke="black"
            stroke-width=".5"
          >
            <tspan
              x="66"
              fill="#000"
              y="23"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              {{ printData.fbaCode }}
            </tspan>
          </text>
        </g>
        <g transform="translate(13 257)">
          <rect
            x="0.5"
            y="0.5"
            width="256"
            height="55"
            fill="none"
            stroke="none"
            stroke-width="1"
          />
          <text
            id="warehouse"
            font-size="16"
            font-family="SourceHanSansCN-Regular, Source Han Sans CN"
            x="7"
            fill="#000"
            y="18"
            text-anchor="start"
            dominant-baseline="middle"
          >
            {{ printData.warehouse }}
          </text>
        </g>
        <g transform="translate(13 310)">
          <rect
            x="0.5"
            y="0.5"
            width="131"
            height="20"
            fill="none"
            stroke="none"
            stroke-width="1"
          />
          <text
            font-size="13"
            font-family="SourceHanSansCN-Regular, Source Han Sans CN"
          >
            <tspan
              x="8"
              fill="#000"
              y="10"
              text-anchor="start"
              dominant-baseline="middle"
            >
              {{ printData.createTime }}
            </tspan>
          </text>
        </g>
        <g transform="translate(143 310)">
          <rect
            x="0.5"
            y="0.5"
            width="126"
            height="20"
            fill="#fff"
            stroke="none"
            stroke-width="1"
          />
          <text
            font-size="13"
            font-family="SourceHanSansCN-Regular, Source Han Sans CN"
          >
            <tspan
              x="121"
              fill="#000"
              y="10"
              text-anchor="end"
              dominant-baseline="middle"
            >
              {{ printData.custom }}
            </tspan>
          </text>
        </g>
        <line
          x1="11"
          y1="331"
          x2="273"
          y2="331"
          stroke-width="1"
          stroke="#000"
        />
        <g transform="translate(11 331)">
          <text
            font-size="26"
            font-family="SourceHanSansCN-Medium, Source Han Sans CN"
            font-weight="500"
          >
            <tspan
              id="boxIndex"
              x="44"
              y="25"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              1
            </tspan>
          </text>
        </g>
        <g transform="translate(98 331)">
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="43"
            stroke-width="1"
            stroke="#000"
          />
          <line
            x1="88"
            y1="0"
            x2="88"
            y2="43"
            stroke-width="1"
            stroke="#000"
          />
          <text
            font-size="20"
            font-family="SourceHanSansCN-Regular, Source Han Sans CN"
          >
            <tspan
              x="44"
              y="25"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              of
            </tspan>
          </text>
        </g>
        <g transform="translate(185 331)">
          <text
            font-size="26"
            font-family="SourceHanSansCN-Medium, Source Han Sans CN"
            font-weight="500"
          >
            <tspan
              id="boxTotal"
              x="44"
              y="25"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              500
            </tspan>
          </text>
        </g>
        <line
          x1="11"
          y1="374"
          x2="273"
          y2="374"
          stroke-width="1"
          stroke="#000"
        />
        <g transform="translate(15 375)">
          <rect
            x="0.5"
            y="0.5"
            width="104"
            height="37"
            fill="none"
            stroke="none"
            stroke-width="1"
          />
          <text
            font-size="28"
            font-family="SourceHanSansCN-Bold, Source Han Sans CN"
            font-weight="700"
            stroke="black"
            stroke-width="0.5"
          >
            <tspan
              x="52"
              y="21"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              MADE
            </tspan>
          </text>
        </g>
        <g transform="translate(114 375)">
          <rect
            x="0.5"
            y="0.5"
            width="52"
            height="37"
            fill="none"
            stroke="none"
            stroke-width="1"
          />
          <text
            font-size="28"
            font-family="SourceHanSansCN-Bold, Source Han Sans CN"
            font-weight="700"
            stroke="black"
            stroke-width="0.5"
          >
            <tspan
              x="26"
              y="21"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              IN
            </tspan>
          </text>
        </g>
        <g transform="translate(163 375)">
          <rect
            x="0.5"
            y="0.5"
            width="104"
            height="37"
            fill="none"
            stroke="none"
            stroke-width="1"
          />
          <text
            font-size="28"
            font-family="SourceHanSansCN-Bold, Source Han Sans CN"
            font-weight="700"
            stroke="black"
            stroke-width="0.5"
          >
            <tspan
              x="52"
              y="21"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              CHINA
            </tspan>
          </text>
        </g>
      </g>
    </svg>
    <svg
      v-if="pageSize === 'm1010'"
      id="svg"
      xmlns="http://www.w3.org/2000/svg"
      width="283"
      height="283"
      viewBox="0 0 283 283"
    >
      <g>
        <rect
          width="283"
          height="283"
          fill="#fff"
        />
        <g
          transform="translate(10 10)"
          fill="none"
          stroke="#000"
          stroke-width="2"
        >
          <rect
            x="1"
            y="1"
            width="261"
            height="261"
            fill="none"
          />
        </g>
        <g transform="translate(12 12)">
          <text
            id="lscName"
            font-size="12"
            font-family="SourceHanSansCN-Regular, Source Han Sans CN"
            x="132"
            y="16"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            {{ printData.lscName }}
          </text>
          <line
            x1="0"
            y1="33"
            x2="260"
            y2="33"
            stroke="#000"
            stroke-width="1"
          />
        </g>
        <g transform="translate(12 120)">
          <line
            x1="0"
            y1="0"
            x2="260"
            y2="0"
            stroke="#000"
            stroke-width="1"
          />
          <rect
            x="0.5"
            y="0.5"
            width="258"
            height="33"
            fill="none"
            stroke="none"
            stroke-width="1"
          />
          <text
            id="code"
            font-size="14"
            font-family="SourceHanSansCN-Bold, Source Han Sans CN"
            font-weight="700"
            x="130"
            y="18"
            text-anchor="middle"
            dominant-baseline="middle"
            stroke="black"
            stroke-width=".5"
          >
            {{ printData.code }}
          </text>
          <line
            x1="0"
            y1="32"
            x2="260"
            y2="32"
            stroke="#000"
            stroke-width="1"
          />
        </g>
        <g transform="translate(12 153)">
          <line
            x1="130"
            y1="-1"
            x2="130"
            y2="20"
            stroke="#000"
            stroke-width="1"
          />
          <g transform="translate(0 0)">
            <rect
              x="0.5"
              y="0.5"
              width="130"
              height="18"
              fill="none"
              stroke="none"
              stroke-width="1"
            />
            <text
              font-size="14"
              font-family="SourceHanSansCN-Bold, Source Han Sans CN"
              font-weight="700"
            >
              <tspan
                x="65"
                y="10"
                text-anchor="middle"
                dominant-baseline="middle"
                stroke="black"
                stroke-width=".5"
              >
                {{ printData.expressName }}
              </tspan>
            </text>
          </g>
          <g transform="translate(131 0)">
            <rect
              x="0.5"
              y="0.5"
              width="127"
              height="18"
              fill="none"
              stroke="none"
              stroke-width="1"
            />
            <text
              font-size="14"
              font-family="SourceHanSansCN-Bold, Source Han Sans CN"
              font-weight="700"
            >
              <tspan
                x="65"
                y="10"
                text-anchor="middle"
                dominant-baseline="middle"
                stroke="black"
                stroke-width=".5"
              >
                {{ printData.fbaCode }}
              </tspan>
            </text>
          </g>
        </g>
        <g transform="translate(12 173)">
          <line
            x1="0"
            y1="0"
            x2="260"
            y2="0"
            stroke="#000"
            stroke-width="1"
          />
          <g transform="translate(5 4)">
            <rect
              x="0.5"
              y="0.5"
              width="249"
              height="30"
              fill="none"
              stroke="none"
              stroke-width="1"
            />
            <text
              id="warehouse"
              font-size="12"
              font-family="SourceHanSansCN-Regular, Source Han Sans CN"
              x="0"
              y="10"
              text-anchor="start"
              dominant-baseline="middle"
            >
              {{ printData.warehouse }}
            </text>
          </g>
          <g transform="translate(5 30)">
            <rect
              x="0.5"
              y="0.5"
              width="131"
              height="20"
              fill="none"
              stroke="none"
              stroke-width="1"
            />
            <text
              font-size="10"
              font-family="SourceHanSansCN-Regular, Source Han Sans CN"
            >
              <tspan
                x="0"
                y="11"
                text-anchor="start"
                dominant-baseline="middle"
              >
                {{ printData.createTime }}
              </tspan>
            </text>
          </g>
          <g transform="translate(131 30)">
            <rect
              x="0.5"
              y="0.5"
              width="123"
              height="20"
              fill="none"
              stroke="none"
              stroke-width="1"
            />
            <text
              font-size="10"
              font-family="SourceHanSansCN-Regular, Source Han Sans CN"
            >
              <tspan
                x="123"
                y="11"
                text-anchor="end"
                dominant-baseline="middle"
              >
                {{ printData.custom }}
              </tspan>
            </text>
          </g>
          <line
            x1="0"
            y1="50"
            x2="260"
            y2="50"
            stroke="#000"
            stroke-width="1"
          />
        </g>
        <g transform="translate(11 222)">
          <text
            font-size="20"
            font-family="SourceHanSansCN-Medium, Source Han Sans CN"
            font-weight="500"
          >
            <tspan
              id="boxIndex"
              x="44"
              y="13"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              1
            </tspan>
          </text>
        </g>
        <g transform="translate(98 222)">
          <line
            x1="0"
            y1="1"
            x2="0"
            y2="22"
            stroke-width="1"
            stroke="#000"
          />
          <line
            x1="88"
            y1="1"
            x2="88"
            y2="22"
            stroke-width="1"
            stroke="#000"
          />
          <text
            font-size="13"
            font-family="SourceHanSansCN-Regular, Source Han Sans CN"
          >
            <tspan
              x="44"
              y="13"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              of
            </tspan>
          </text>
        </g>
        <g transform="translate(185 222)">
          <text
            font-size="20"
            font-family="SourceHanSansCN-Medium, Source Han Sans CN"
            font-weight="500"
          >
            <tspan
              id="boxTotal"
              x="44"
              y="13"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              500
            </tspan>
          </text>
        </g>
        <line
          x1="12"
          y1="244"
          x2="273"
          y2="244"
          stroke-width="1"
          stroke="#000"
        />
        <g transform="translate(15 244)">
          <rect
            x="0.5"
            y="0.5"
            width="104"
            height="26"
            fill="none"
            stroke="none"
            stroke-width="1"
          />
          <text
            font-size="18"
            font-family="SourceHanSansCN-Bold, Source Han Sans CN"
            font-weight="bold"
            stroke="black"
            stroke-width="0.5"
          >
            <tspan
              x="52"
              y="16"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              MADE
            </tspan>
          </text>
        </g>
        <g transform="translate(114 244)">
          <rect
            x="0.5"
            y="0.5"
            width="52"
            height="26"
            fill="none"
            stroke="none"
            stroke-width="1"
          />
          <text
            font-size="18"
            font-family="SourceHanSansCN-Bold, Source Han Sans CN"
            font-weight="bold"
            stroke="black"
            stroke-width="0.5"
          >
            <tspan
              x="26"
              y="16"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              IN
            </tspan>
          </text>
        </g>
        <g transform="translate(163 244)">
          <rect
            x="0.5"
            y="0.5"
            width="104"
            height="26"
            fill="none"
            stroke="none"
            stroke-width="1"
          />
          <text
            font-size="18"
            font-family="SourceHanSansCN-Bold, Source Han Sans CN"
            font-weight="bold"
            stroke="black"
            stroke-width="0.5"
          >
            <tspan
              x="52"
              y="16"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              CHINA
            </tspan>
          </text>
        </g>
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getByCode } from '@/api/orderlist-at-whole'
import JsBarcode from 'jsbarcode'
import dayjs from 'dayjs'

@Component({
  name: 'print'
})

export default class extends Vue {
  /* data */
  private printData: any = {
    lscName: '',
    expressName: '',
    code: '',
    fbaCode: '',
    warehouse: '',
    createTime: '',
    custom: ''
  }
  private box: any[] = []
  private page: any = {
    m1015: {
      w: 283,
      h: 425
    },
    m1010: {
      w: 283,
      h: 283
    }
  }
  private pageSize: string = ''
  /* methods */
  private printInit(code: any, size: string) {
    this.pageSize = size
    this.$emit('printing', true)
    getByCode({ code }).then((res: any) => {
      this.$emit('printing', false)
      const data = res.data || {}
      this.printData = Object.assign(data, {
        createTime: dayjs(data.createTime).format('YYYY-MM-DD'),
        custom: data.customs0 ? data.customs0 === '0' ? '' : '出口退税' : ''
      })
      this.box = data.boxes || []
      if (this.box.length) {
        this.$nextTick(() => {
          this.print()
        })
      } else {
        this.pageSize = ''
        this.printData = {
          lscName: '',
          expressName: '',
          code: '',
          fbaCode: '',
          warehouse: '',
          createTime: '',
          custom: ''
        }
        this.$message.error('箱单信息为空')
      }
    }).catch(() => {
      this.$emit('printing', false)
      this.$message.error('打印失败，请稍后再试')
    })
  }
  private print() {
    const pageSize = this.pageSize
    // 处理服务名称
    function fun() {
      const lscName: any = document.getElementById('lscName')
      const innerText = lscName.innerHTML.trim()
      const w = lscName.getBBox().width
      if (w > 263) {
        lscName.innerHTML = innerText.substring(0, innerText.length - 1)
        fun()
      }
    }
    fun()
    // 处理仓库名称
    function funw() {
      const warehouse: any = document.getElementById('warehouse')
      const innerText = warehouse.innerHTML.trim()
      const w = warehouse.getBBox().width
      if (w > 256) {
        if (pageSize === 'm1015') {
          warehouse.innerHTML = `
            <tspan x="7" fill="#000" y="18" text-anchor="start" dominant-baseline="middle">${innerText.substring(0, 15)}</tspan>
            <tspan x="7" fill="#000" y="36" text-anchor="start" dominant-baseline="middle">${innerText.substring(15, 30)}</tspan>
          `
        } else {
          warehouse.innerHTML = `
            <tspan x="0" y="10">${innerText.substring(0, 20)}</tspan>
            <tspan x="0" y="25">${innerText.substring(20, 40)}</tspan>
          `
        }
      }
    }
    funw()
    // 处理原单号
    function funCode() {
      const code: any = document.getElementById('code')
      const innerText = code.innerHTML.trim()
      const w = code.getBBox().width
      if (w > 256) {
        if (pageSize === 'm1015') {
          code.innerHTML = `
            <tspan x="130" y="20" text-anchor="middle" dominant-baseline="middle">${innerText.substring(0, 15)}</tspan>
            <tspan x="130" y="40" text-anchor="middle" dominant-baseline="middle">${innerText.substring(15, 30)}</tspan>
          `
        } else {
          code.innerHTML = `
            <tspan x="130" y="12">${innerText.substring(0, 25)}</tspan>
            <tspan x="130" y="25">${innerText.substring(25, 50)}</tspan>
          `
        }
      }
    }
    funCode()
    const svgTemp: any = document.getElementById('svg')
    const pdfMake: any = (window as any).pdfMake
    let page: any[] = []
    for (let i = 0; i < this.box.length; i++) {
      const svgDivWarp: Element = document.createElement('div')
      const svgWrapClone: any = svgTemp.cloneNode(true)
      const boxIndex: any = svgWrapClone.getElementById('boxIndex')
      boxIndex.innerHTML = i + 1
      const boxTotal: any = svgWrapClone.getElementById('boxTotal')
      boxTotal.innerHTML = this.box.length
      const svg: any = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      JsBarcode(svg, this.box[i].code, {
        width: 1.5,
        margin: 1,
        height: pageSize === 'm1015' ? 80 : 45,
        fontSize: 12
      })
      svg.setAttribute('x', (this.page[this.pageSize].w - (svg.width.animVal.value)) / 2)
      svg.setAttribute('y', 52)
      svgWrapClone.appendChild(svg)
      svgDivWarp.appendChild(svgWrapClone)
      const content: any[] = [{
        svg: svgDivWarp.innerHTML,
        width: this.page[this.pageSize].w,
        height: this.page[this.pageSize].h,
        x: 0,
        y: 0,
        margin: 0
      }]
      if (i !== 0 && i !== this.box.length - 1) {
        content[content.length - 1].pageBreak = 'after'
      }
      page = page.concat(content)
    }
    const PDFDocument: any = pdfMake.createPdf({
      pageSize: {
        width: this.page[this.pageSize].w,
        height: this.page[this.pageSize].h
      },
      pageMargins: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      },
      content: page,
      defaultStyle: {
        font: 'SourceHanSansCN'
      }
    })
    PDFDocument.open()
    this.pageSize = ''
    this.printData = {
      lscName: '',
      expressName: '',
      code: '',
      fbaCode: '',
      warehouse: '',
      createTime: '',
      custom: ''
    }
    this.box = []
  }
}
</script>

<style lang="scss" scoped>
</style>
