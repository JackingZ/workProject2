<template>
  <el-dialog
    title="导入下单"
    width="600px"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close="cancel"
  >
    <p>下载模板导入箱号，或输入原单号，从1.0系统导入订单</p>
    <el-form
      ref="importForm"
      v-loading="loading"
      :model="form"
      :rules="formRules"
      label-width="80px"
      size="small"
    >
      <el-form-item
        label="原单号"
        prop="code"
      >
        <el-input
          v-model="form.code"
          placeholder="请输入"
        />
      </el-form-item>
      <!--<el-form-item
        label="供应商"
        prop="supplier"
      >
        <el-select
          v-model="form.supplier"
          placeholder="请选择"
          size="small"
          style="width:100%;"
          :loading="selectLoading"
          @focus="getSupplierList"
        >
          <el-option
            v-for="item in supplierList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>-->
      <el-form-item
        label="仓库"
        prop="warehouse"
      >
        <el-select
          v-model="form.warehouse"
          placeholder="请选择"
          size="small"
          style="width:100%;"
          :loading="selectLoading"
          @focus="getWarehouseList"
        >
          <el-option
            v-for="item in warehouseList"
            :key="item.warehouseId"
            :label="item.name"
            :value="item.warehouseId"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="订单导入"
      >
        <div style="display: flex;">
          <el-button
            size="small"
            style="margin-right: 10px"
            type="text"
            @click="downloadFile"
          >
            模板下载
          </el-button>
          <el-upload
            action
            :multiple="false"
            :limit="1"
            :show-file-list="false"
            :http-request="uploadFile"
            :file-list="fileList"
          >
            <el-button
              size="small"
              type="text"
            >
              导入excel
            </el-button>
          </el-upload>
          <el-button
            size="small"
            style="margin-left: 10px"
            type="text"
            @click="importBySys1"
          >
            从1.0系统导入
          </el-button>
        </div>
      </el-form-item>
      <el-form-item
        v-if="importBoxs.length"
        label="导入结果"
      >
        <span>
          共导入{{ importBoxs.length }}个批次，累计箱子数量为 {{ boxNum }}
        </span>
        <el-button
          size="small"
          type="text"
          @click="clearImport"
        >
          清空
        </el-button>
      </el-form-item>
      <div
        class="dialog-footer"
        style="text-align: right"
      >
        <el-button
          size="small"
          @click="cancel"
        >
          取 消
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="handleSubmit"
        >
          保 存
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getSupplierList } from '@/api/jht-supplier-management'
import { getServiceInfoByType, saveWarehouseOrder, getWarehouseList, queryBoxsBySys1 } from '@/api/orderlist-at-warehouse'
import XLSX from 'xlsx'
import dayjs from 'dayjs'

@Component({
  name: 'ImportOrder'
})
export default class ImportOrder extends Vue {
  private loading: boolean = false
  private visible: boolean = false
  private selectLoading = false
  private form: any = {
    code: '',
    supplier: '',
    warehouse: ''
  }
  private formRules: any = {
    code: [
      { required: true, message: '请输入原单号', trigger: 'change' },
      {
        validator(rule: any, value: any, callback: (val?: any) => void) {
          const reg = /^([\w | -]){8,20}$/
          if (!reg.test(value)) {
            callback(new Error('原单号必须8-20个字母、数字、下划线、中划线，不能输入特殊字符'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    supplier: [{ required: true, message: '请选择供应商', trigger: 'change' }],
    warehouse: [{ required: true, message: '请选择仓库', trigger: 'change' }]
  }
  private orderServiceData: any = {}
  private fileList: any[] = []
  private importBoxs: any[] = []
  private supplierList: any[] = []
  private warehouseList: any[] = []

  get boxNum() {
    return this.importBoxs.reduce((num: number, next: any) => {
      const boxs = next.boxs || []
      num += boxs.length
      return num
    }, 0)
  }
  private cancel() {
    this.visible = false
    this.$emit('load')
  }
  private show() {
    this.visible = true
    this.fileList = []
    this.importBoxs = []
    this.getServiceInfoByType()
    this.$nextTick(() => {
      const formDom: any = this.$refs.importForm
      formDom.resetFields()
    })
  }
  private clearImport() {
    this.fileList = []
    this.importBoxs = []
  }
  private uploadFile(data: any) {
    const fileSize = Math.round(data.file.size / 1024 / 1024 * 100) / 100
    if (fileSize > 10) {
      this.$message.warning('文件大小超出最大上传限制！')
      return
    }
    const file = data.file
    const that = this
    const reader = new FileReader()
    FileReader.prototype.readAsBinaryString = (f) => {
      let binary = ''
      let wb
      let outdata
      const reader1 = new FileReader()
      reader1.onload = (e) => {
        const readerResult: any = reader1.result
        const bytes = new Uint8Array(readerResult)
        const length = bytes.byteLength
        for (let i = 0; i < length; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        wb = XLSX.read(binary, {
          type: 'binary'
        })
        if (wb.Sheets.Sheet1.A1.h !== '批次号') {
          that.$message.error(`文件表头[${wb.Sheets.Sheet1.A1.h}]不正确，请下载模板检查`)
          return
        }
        if (wb.Sheets.Sheet1.B1.h !== '箱号') {
          that.$message.error(`文件表头[${wb.Sheets.Sheet1.B1.h}]不正确，请下载模板检查`)
          return
        }
        outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        const importBoxs: any = []
        const batchNo = '批次号'
        const boxNo = '箱号'
        outdata.map((outData: any) => {
          importBoxs.push({
            batchNo: outData[batchNo],
            boxNo: outData[boxNo]
          })
        })
        // for (const outData: any of outdata) {
        //   // const outData: any = outdata[i]
        //   importBoxs.push({
        //     batchNo: outData['批次号'],
        //     boxNo: outData['箱号']
        //   })
        // }
        let flag = true
        for (let i = 0; i < importBoxs.length; i++) {
          const importBox = importBoxs[i]
          if (!importBox.batchNo) {
            flag = false
            that.$message.error(`文件第${i + 2}行批次号为空`)
            break
          }
          if (!importBox.boxNo) {
            flag = false
            that.$message.error(`文件第${i + 2}行箱号为空`)
            break
          }
        }
        if (!flag) return
        that.importBoxs = importBoxs.reduce((batchBoxs: any[], box: any) => {
          const batchBox1: any = batchBoxs.find((item: any) => item.batchNo === box.batchNo)
          if (batchBox1) {
            batchBox1.boxs.push(box.boxNo)
          } else {
            const batchBox: any = {
              batchNo: box.batchNo,
              boxs: []
            }
            batchBox.boxs.push(box.boxNo)
            batchBoxs.push(batchBox)
          }
          return batchBoxs
        }, [])
      }
      reader1.onerror = () => {
        that.$message.error('文件错误,请检查文件重新导入')
      }
      reader1.readAsArrayBuffer(f)
    }
    reader.readAsBinaryString(file)
  }
  private handleSubmit() {
    const formDom:any = this.$refs.importForm
    if (this.importBoxs.length === 0) {
      this.$message.warning('请导入箱号信息')
      return
    }
    formDom.validate((valid: any) => {
      if (valid) {
        const selectWarehouse: any = this.warehouseList.find((w: any) => w.warehouseId === this.form.warehouse)
        const params = {
          attribute: '1',
          code: this.form.code,
          express: {
            expressId: '',
            expressName: '',
            no: ''
          },
          io: 'I',
          loading: '1',
          mode: '0',
          // packages: this.batchesInfo.packages,
          source: '0',
          supplement: {
            certNo: '',
            certType: '',
            driver: '',
            // expressId: this.baseInfo.expressId,
            // expressName: this.baseInfo.expressName,
            modeNo: '',
            phone: ''
          },
          type: '2',
          volume: selectWarehouse.maximum,
          // volumes: this.batchesInfo.sumVolume,
          warehouse: {
            custId: selectWarehouse.custId,
            custName: selectWarehouse.custName,
            address: selectWarehouse.address,
            cityId: selectWarehouse.cityId,
            contact: selectWarehouse.principal,
            countryId: selectWarehouse.countryId,
            countyId: selectWarehouse.countyId,
            id: selectWarehouse.warehouseId,
            name: selectWarehouse.name,
            stateId: selectWarehouse.stateId,
            tel: selectWarehouse.phoneNo,
            cityName: selectWarehouse.cityName,
            countryName: selectWarehouse.countryName,
            stateName: selectWarehouse.stateName
          },
          weight: selectWarehouse.weight,
          batches: this.importBoxs.map((item: any, index: number) => {
            return {
              code: this.form.code + '-' + (index + 1),
              height: 10,
              length: 10,
              // orderCode: this.baseInfo.id,
              packages: (item.boxs || []).length,
              weight: 10,
              width: 10,
              boxes: (item.boxs || []).map((e: any) => {
                return {
                  code: e
                }
              }),
              wgoods: [{}].map((good: any) => {
                return {
                  goodsAlias: 'system product',
                  goodsName: '系统商品',
                  // orderCode: this.baseInfo.id
                  picture: '',
                  price: 1,
                  quantity: 1
                }
              })
            }
          }),
          description: '',
          examine: this.orderServiceData.examine,
          examineRatio: this.orderServiceData.examineRatio ? this.orderServiceData.examineRatio / 100 : 0,
          examineType: this.orderServiceData.examineType,
          examineId: this.orderServiceData.examineId,
          examineName: this.orderServiceData.examineName,
          examingTag: false,
          inTime: dayjs().add(1, 'h').format('YYYY-MM-DD HH:mm:ss'),
          remark: '',
          service: {
            key: this.orderServiceData.id,
            value: this.orderServiceData.name
          },
          um: {
            currencyId: selectWarehouse.currencyId,
            currencyName: selectWarehouse.currencyName,
            umLength: selectWarehouse.unitOfLength,
            umPackage: '0',
            umWeight: selectWarehouse.unitOfWeight
          }
        }
        this.loading = true
        saveWarehouseOrder(params).then(() => {
          this.loading = false
          this.$message.success('导入下单成功')
          this.visible = false
          this.$emit('load')
        }).catch(() => {
          this.loading = false
        })
      }
    })
  }
  private getServiceInfoByType() {
    getServiceInfoByType({ type: '2' }).then((res: any) => {
      this.orderServiceData = res.data
    }).catch(() => {
      this.orderServiceData = {}
    })
  }

  private importBySys1() {
    const { code } = this.form
    if (!code) {
      return this.$message.error('请输入原单号')
    }
    this.loading = true
    queryBoxsBySys1({ code })
      .then(res => {
        const result = res.data || {}
        const list = result.data || []
        const arr = list.map((item:any) => item.fba_code)
        const importBoxs = [
          {
            batchNo: `${code}-1`,
            boxs: arr
          }
        ]
        this.importBoxs = importBoxs
        this.loading = false
      })
      .catch(err => {
        this.loading = false
        return err
      })
  }

  private downloadFile() {
    // window.open('http://file.jhtinfo.net/A0/box_id_templete.xlsx')
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.href = 'http://file.jhtinfo.net/A0/box_id_templete.xlsx'
    // a.download = '箱号导入模板.xlsx'
    a.click()
    document.body.removeChild(a)
  }
  private getSupplierList() {
    const params = {
      page: 1,
      size: 999,
      status: 1,
      subtypeId: '02'
    }
    this.selectLoading = true
    getSupplierList(params).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      this.supplierList = data.result || []
    }).catch(() => {
      this.selectLoading = false
      this.supplierList = []
    })
  }
  private getWarehouseList() {
    const params = {
      model: {
        key: 'www',
        keyType: '1',
        subtypeId: '2',
        typeId: '04'
      },
      page: 1,
      size: 999
    }
    this.selectLoading = true
    getWarehouseList(params).then((res: any) => {
      this.selectLoading = false
      const data = res.data || {}
      this.warehouseList = data.result || []
    }).catch(() => {
      this.selectLoading = false
      this.warehouseList = []
    })
  }
}
</script>

<style scoped>
</style>
