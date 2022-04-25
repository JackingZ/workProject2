(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["commission-config"],{"04a6":function(e,t,i){},"55d0":function(e,t,i){"use strict";i.r(t);var a=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticStyle:{display:"flex","flex-flow":"row nowrap","min-height":"inherit"}},[i("div",{staticClass:"dashboard-container",staticStyle:{flex:"1",overflow:"auto"}},[i("div",{staticClass:"app-container"},[i("head-info",{attrs:{info:"",title:"佣金配置"}}),i("div",{staticClass:"app-panel"},[i("el-row",[i("el-col",{attrs:{span:4}},[i("el-button",{staticStyle:{"margin-left":"10px"},attrs:{type:"text",icon:"el-icon-circle-plus-outline"},on:{click:e.addRow}},[e._v("\n              新增配置\n            ")])],1),i("el-col",{staticStyle:{"text-align":"right"},attrs:{span:20}},["0"===e.custType?i("el-select",{staticStyle:{width:"130px","margin-right":"5px"},attrs:{loading:e.selectLoading,size:"small",placeholder:"所属公司",filterable:"",clearable:""},on:{focus:e.getCompanyList},model:{value:e.selectValue.comId,callback:function(t){e.$set(e.selectValue,"comId",t)},expression:"selectValue.comId"}},e._l(e.companyList,function(e){return i("el-option",{key:e.id,attrs:{label:e.name,value:e.id}})}),1):e._e(),i("el-select",{staticStyle:{width:"100px","margin-right":"5px"},attrs:{loading:e.selectLoading,size:"small",placeholder:"业务类型",filterable:"",clearable:""},on:{focus:e.getSubtypeList,change:function(t){e.selectValue.lscId=void 0}},model:{value:e.selectValue.subtypeId,callback:function(t){e.$set(e.selectValue,"subtypeId",t)},expression:"selectValue.subtypeId"}},e._l(e.typeList,function(e){return i("el-option",{key:e.id,attrs:{label:e.name,value:e.id}})}),1),i("el-select",{staticStyle:{width:"130px","margin-right":"5px"},attrs:{loading:e.selectLoading,placeholder:"国家",size:"small",clearable:"",filterable:""},on:{focus:e.getCountryData,change:function(t){e.selectValue.lscId=void 0}},model:{value:e.selectValue.countryId,callback:function(t){e.$set(e.selectValue,"countryId",t)},expression:"selectValue.countryId"}},e._l(e.countryList,function(e){return i("el-option",{key:e.id,attrs:{label:e.name+"-"+e.alias,value:e.id}})}),1),i("el-select",{staticStyle:{width:"150px","margin-right":"10px"},attrs:{loading:e.selectLoading,disabled:!e.selectValue.subtypeId||!e.selectValue.countryId,size:"small",placeholder:"服务",clearable:"",filterable:""},on:{focus:e.getPrivatelineList},model:{value:e.selectValue.lscId,callback:function(t){e.$set(e.selectValue,"lscId",t)},expression:"selectValue.lscId"}},e._l(e.privatelineList,function(e){return i("el-option",{key:e.id,attrs:{label:e.name,value:e.id}})}),1),i("el-button",{attrs:{type:"primary",size:"small"},on:{click:function(t){return e.queryAll(1)}}},[e._v("\n              查询\n            ")])],1)],1),i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticStyle:{width:"100%",margin:"10px 0"},attrs:{data:e.tableData,height:"calc(100vh - 313px)",border:""}},[i("el-table-column",{attrs:{prop:"name",label:"配置名称"}}),i("el-table-column",{attrs:{prop:"",label:"计量方式",width:"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n              "+e._s(2===t.row.measureMethod?"按重量(KG)":"按体积(CBM)")+"\n            ")]}}])}),i("el-table-column",{attrs:{prop:"",label:"当前版本","min-width":"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n              "+e._s(t.row.startTime+"~"+t.row.endTime)+"\n              "),i("el-button",{attrs:{type:"text",size:"medium"},on:{click:function(i){return e.editRow(t.row)}}},[e._v("\n                添加新版\n              ")])]}}])}),i("el-table-column",{attrs:{prop:"",label:"关联服务",width:"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("el-button",{attrs:{type:"text",size:"medium"},on:{click:function(i){return e.editService(t.row)}}},[e._v("\n                关联服务\n              ")])]}}])}),i("el-table-column",{attrs:{prop:"",label:"操作日志",width:"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("el-button",{attrs:{type:"text",size:"medium"},on:{click:function(i){return e.editOperate(t.row)}}},[e._v("\n                操作日志\n              ")])]}}])}),i("el-table-column",{attrs:{label:"操作",width:"150",fixed:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("el-button",{attrs:{type:"text",size:"medium"},on:{click:function(i){return e.viewRow(t.row)}}},[e._v("\n                查看\n              ")]),i("el-button",{attrs:{type:"text",size:"medium"},on:{click:function(i){return e.deleteRow(t.row)}}},[e._v("\n                删除\n              ")])]}}])})],1),i("el-pagination",{staticStyle:{"text-align":"right"},attrs:{"current-page":e.page,"page-size":e.size,layout:"total, prev, pager, next",total:e.total},on:{"update:currentPage":function(t){e.page=t},"update:current-page":function(t){e.page=t},"current-change":e.handleCurrentChange}}),i("el-dialog",{attrs:{title:e.title,visible:e.isDialogFormShow,"close-on-click-modal":!1,width:"1050px"},on:{"update:visible":function(t){e.isDialogFormShow=t},close:e.cancel}},[i("div",{directives:[{name:"loading",rawName:"v-loading",value:e.dialogLoading,expression:"dialogLoading"}],staticStyle:{"max-height":"500px","overflow-y":"auto"}},[i("el-form",{ref:"editForm",attrs:{model:e.form,rules:e.formRules,"label-width":"100px","label-position":"right",size:"small"}},["0"===e.custType?i("div",[i("el-form-item",{staticStyle:{width:"30%"},attrs:{prop:"custId",label:"所属公司"}},[i("el-select",{staticStyle:{width:"100%"},attrs:{loading:e.selectLoading,size:"small",placeholder:"请选择",filterable:"",clearable:""},on:{change:e.onCompany},model:{value:e.form.custId,callback:function(t){e.$set(e.form,"custId",t)},expression:"form.custId"}},e._l(e.companyList,function(e){return i("el-option",{key:e.id,attrs:{label:e.name,value:e.id}})}),1)],1)],1):e._e(),i("el-form-item",{staticStyle:{width:"30%"},attrs:{prop:"name",label:"配置名称"}},[i("el-input",{staticStyle:{width:"100%"},attrs:{disabled:e.isEdit,autocomplete:"off",placeholder:"请输入",maxlength:20,"show-word-limit":"",clearable:""},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1),i("el-form-item",{attrs:{prop:"measureMethod",label:"计量方式"}},[i("el-select",{staticStyle:{width:"100%"},attrs:{disabled:e.isEdit,placeholder:"请选择",filterable:"",clearable:""},model:{value:e.form.measureMethod,callback:function(t){e.$set(e.form,"measureMethod",t)},expression:"form.measureMethod"}},[i("el-option",{attrs:{label:"按重量(KG)",value:2}}),i("el-option",{attrs:{label:"按体积(CBM)",value:3}})],1)],1),i("el-form-item",{staticStyle:{width:"40%"},attrs:{prop:"applyTime",label:"有效期"}},[i("el-date-picker",{staticStyle:{width:"100%"},attrs:{"picker-options":e.pickerOptions,type:"daterange",size:"small","value-format":"yyyy-MM-dd","start-placeholder":"开始时间","end-placeholder":"结束时间"},model:{value:e.form.applyTime,callback:function(t){e.$set(e.form,"applyTime",t)},expression:"form.applyTime"}})],1),i("div",{staticStyle:{display:"flex","flex-wrap":"row nowrap","padding-left":"20px"}},[i("div",{staticStyle:{flex:"1 1 40%"}},[i("div",{staticStyle:{"padding-bottom":"10px"}},[i("i",{staticClass:"tips-circle"}),e._v("\n                    团队佣金 = 团队总货量 * 单位提成 * \n                    "),i("el-input-number",{staticClass:"input-number-valiate",attrs:{size:"small",controls:!1,placeholder:"比例",min:0,max:9999,precision:2},model:{value:e.form.team,callback:function(t){e.$set(e.form,"team",t)},expression:"form.team"}}),e._v("%\n                  ")],1),i("div",{staticStyle:{"padding-bottom":"10px"}},[i("i",{staticClass:"tips-circle"}),e._v("\n                    直客提成 =（直客成交价 - 同行卖价）* 货量 * \n                    "),i("el-input-number",{staticClass:"input-number-valiate",attrs:{size:"small",controls:!1,placeholder:"比例",min:0,max:9999,precision:2},model:{value:e.form.customer,callback:function(t){e.$set(e.form,"customer",t)},expression:"form.customer"}}),e._v("%\n                  ")],1),i("div",{staticStyle:{"padding-bottom":"10px"}},[i("i",{staticClass:"tips-circle"}),e._v("\n                    同行提成 = 单位提成 * 货量\n                  ")])]),i("div",{staticStyle:{flex:"1 1 50%"}},[i("div",{staticStyle:{"padding-bottom":"10px"}},[i("i",{staticClass:"tips-circle"}),e._v("\n                    同行超收提成 =（成交单价 - 同行报价）* 货量 * \n                    "),i("el-input-number",{staticClass:"input-number-valiate",attrs:{size:"small",controls:!1,placeholder:"比例",min:0,max:9999,precision:2},model:{value:e.form.colleagues,callback:function(t){e.$set(e.form,"colleagues",t)},expression:"form.colleagues"}}),e._v("% + 理论提成\n                  ")],1),i("div",{staticStyle:{"padding-bottom":"10px"}},[i("i",{staticClass:"tips-circle"}),e._v("\n                    代管客户佣金 = 理论佣金 * \n                    "),i("el-input-number",{staticClass:"input-number-valiate",attrs:{size:"small",controls:!1,placeholder:"比例",min:0,max:9999,precision:2},model:{value:e.form.escrowCustomer,callback:function(t){e.$set(e.form,"escrowCustomer",t)},expression:"form.escrowCustomer"}}),e._v("%\n                  ")],1),i("div",{staticStyle:{"padding-bottom":"10px"}},[i("i",{staticClass:"tips-circle"}),e._v("\n                    编外业务员提成 = 佣金 * \n                    "),i("el-input-number",{staticClass:"input-number-valiate",attrs:{size:"small",controls:!1,placeholder:"比例",min:0,max:9999,precision:2},model:{value:e.form.informal,callback:function(t){e.$set(e.form,"informal",t)},expression:"form.informal"}}),e._v("%\n                  ")],1)])]),i("div",{staticStyle:{"border-top":"1px solid #DBDFE5","padding-bottom":"10px"}}),i("el-form-item",{staticClass:"is-required",staticStyle:{width:"100%"},attrs:{label:"区间&提成",prop:"extentVoList","label-width":"110px"}},e._l(e.form.extentVoList,function(t,a){return i("div",{key:a,staticClass:"item-after-icon"},[i("el-input-number",{staticClass:"input-number-valiate",attrs:{controls:!1,placeholder:"输入下限",min:0,max:999999,step:1,"step-strictly":""},model:{value:e.form.extentVoList[a].min,callback:function(t){e.$set(e.form.extentVoList[a],"min",t)},expression:"form.extentVoList[index].min"}}),i("el-input-number",{staticClass:"input-number-valiate",attrs:{controls:!1,placeholder:"输入上限",min:0,max:999999,step:1,"step-strictly":""},model:{value:e.form.extentVoList[a].max,callback:function(t){e.$set(e.form.extentVoList[a],"max",t)},expression:"form.extentVoList[index].max"}}),i("el-input-number",{staticClass:"input-number-valiate",attrs:{controls:!1,placeholder:"单位提成",min:0,max:999999,precision:2},model:{value:e.form.extentVoList[a].unitPrice,callback:function(t){e.$set(e.form.extentVoList[a],"unitPrice",t)},expression:"form.extentVoList[index].unitPrice"}}),i("span",[i("i",0===a?{staticClass:"el-icon-circle-plus-outline item-icon-plus",on:{click:e.addRangeData}}:{staticClass:"el-icon-remove-outline item-icon-reduce",on:{click:function(t){return e.deleteRangeData(a)}}})])],1)}),0)],1)],1),i("div",{attrs:{slot:"footer"},slot:"footer"},[i("el-button",{attrs:{size:"small"},on:{click:e.cancel}},[e._v("\n              取 消\n            ")]),i("el-button",{attrs:{loading:e.dialogLoading,size:"small",type:"primary"},on:{click:e.confirm}},[e._v("\n              确 定\n            ")])],1)]),i("el-dialog",{attrs:{title:"查看配置",visible:e.isViewVisible,"close-on-click-modal":!1,width:"800px"},on:{"update:visible":function(t){e.isViewVisible=t},close:e.offVersion}},[i("div",{directives:[{name:"loading",rawName:"v-loading",value:e.dialogLoading,expression:"dialogLoading"}],staticStyle:{"max-height":"500px","overflow-y":"auto"}},[i("div",{staticStyle:{"text-align":"right","padding-bottom":"10px"}},[i("el-select",{staticStyle:{width:"320px"},attrs:{size:"small",placeholder:"版本",filterable:""},on:{change:e.onVersion},model:{value:e.versionId,callback:function(t){e.versionId=t},expression:"versionId"}},e._l(e.versionList,function(e){return i("el-option",{key:e.id,attrs:{label:e.start_time+"~"+e.end_time,value:e.id}})}),1)],1),i("div",{staticStyle:{display:"flex","flex-wrap":"row nowrap"}},[i("div",{staticStyle:{flex:"1 1 55%"}},[i("div",{staticStyle:{"padding-bottom":"10px",color:"#909399"}},[e._v("\n                  配置名称："+e._s(e.form.name)+"\n                ")]),i("div",{staticStyle:{"padding-bottom":"10px",color:"#909399"}},[e._v("\n                  计量方式："+e._s(2===e.form.measureMethod?"按重量(KG)":"按体积(CBM)")+"\n                ")]),i("div",{staticStyle:{"padding-bottom":"10px",color:"#909399"}},[e._v("\n                  有效期："+e._s(e.form.startTime+"~"+e.form.endTime)+"\n                ")]),i("div",{staticStyle:{"padding-bottom":"10px"}},[i("i",{staticClass:"tips-circle"}),e._v("\n                  团队佣金 = 团队总货量 * 单位提成 * "+e._s(e.form.team)+"%\n                ")]),i("div",{staticStyle:{"padding-bottom":"10px"}},[i("i",{staticClass:"tips-circle"}),e._v("\n                  直客提成 =（直客成交价 - 同行卖价）* 货量 * "+e._s(e.form.customer)+"%\n                ")]),i("div",{staticStyle:{"padding-bottom":"10px"}},[i("i",{staticClass:"tips-circle"}),e._v("\n                  同行提成 = 单位提成 * 货量\n                ")]),i("div",{staticStyle:{"padding-bottom":"10px"}},[i("i",{staticClass:"tips-circle"}),e._v("\n                  同行超收提成 =（成交单价 - 同行报价）* 货量 * "+e._s(e.form.colleagues)+"% + 理论提成\n                ")]),i("div",{staticStyle:{"padding-bottom":"10px"}},[i("i",{staticClass:"tips-circle"}),e._v("\n                  代管客户佣金 = 理论佣金 * "+e._s(e.form.escrowCustomer)+"%\n                ")]),i("div",{staticStyle:{"padding-bottom":"10px"}},[i("i",{staticClass:"tips-circle"}),e._v("\n                  编外业务员提成 = 佣金 * "+e._s(e.form.informal)+"%\n                ")])]),i("div",{staticStyle:{flex:"1 1 35%","margin-left":"20px"}},[i("div",{staticStyle:{"background-color":"#F2F3F5",padding:"20px",color:"#909399"}},[i("el-row",[i("el-col",{attrs:{span:14}},[e._v("\n                      区间\n                    ")]),i("el-col",{attrs:{span:10}},[e._v("\n                      单位提成\n                    ")])],1),e._l(e.form.extentVoList,function(t,a){return i("el-row",{key:a,staticStyle:{"padding-top":"10px"}},[i("el-col",{attrs:{span:14}},[e._v("\n                      "+e._s(e.form.extentVoList[a].min+"-"+e.form.extentVoList[a].max)+"\n                      "+e._s(2===e.form.measureMethod?"KG":"CBM")+"\n                    ")]),i("el-col",{attrs:{span:10}},[e._v("\n                      "+e._s(e.form.extentVoList[a].unitPrice)+"\n                    ")])],1)})],2)])]),i("div",{staticStyle:{padding:"10px 10px 20px","text-align":"right"}},[i("el-button",{attrs:{type:"primary",size:"small"},on:{click:e.offVersion}},[e._v("\n                确 定\n              ")])],1)])]),i("el-dialog",{attrs:{title:"操作日志",visible:e.isOperateVisible,"close-on-click-modal":!1,width:"800px"},on:{"update:visible":function(t){e.isOperateVisible=t},close:e.closed}},[i("div",{directives:[{name:"loading",rawName:"v-loading",value:e.dialogLoading,expression:"dialogLoading"}]},[i("el-table",{staticStyle:{width:"100%",margin:"10px 0"},attrs:{data:e.operateList,height:"450px",border:""}},[i("el-table-column",{attrs:{label:"日期",prop:"createTime",width:"180"}}),i("el-table-column",{attrs:{label:"操作人",prop:"userName"}}),i("el-table-column",{attrs:{label:"日志",prop:"logs","min-width":"300","show-overflow-tooltip":""}})],1),i("el-pagination",{staticStyle:{"text-align":"right"},attrs:{"current-page":e.pageR,"page-size":e.size,layout:"total, prev, pager, next",total:e.totalR},on:{"update:currentPage":function(t){e.pageR=t},"update:current-page":function(t){e.pageR=t},"current-change":e.handleOperateChange}}),i("div",{staticStyle:{padding:"10px 10px 20px","text-align":"right"}},[i("el-button",{attrs:{type:"primary",size:"small"},on:{click:e.closed}},[e._v("\n                确 定\n              ")])],1)],1)]),i("el-dialog",{attrs:{title:"关联服务",visible:e.isServiceVisible,"close-on-click-modal":!1,"append-to-body":"",width:"960px"},on:{"update:visible":function(t){e.isServiceVisible=t},close:e.abolish}},[i("div",{directives:[{name:"loading",rawName:"v-loading",value:e.dialogLoading,expression:"dialogLoading"}]},[i("div",{staticStyle:{"margin-bottom":"10px"}},[i("span",[e._v("业务类型：")]),i("el-radio-group",{attrs:{size:"small"},on:{change:e.typeChange},model:{value:e.serviceForm.subtypeId,callback:function(t){e.$set(e.serviceForm,"subtypeId",t)},expression:"serviceForm.subtypeId"}},e._l(e.typeList,function(t){return i("el-radio-button",{key:t.id,attrs:{label:t.id}},[e._v("\n                  "+e._s(t.name)+"\n                ")])}),1)],1),i("el-transfer",{staticStyle:{height:"500px"},attrs:{filterable:"","filter-method":e.filterMethod,titles:["选择关联服务","已关联服务"],props:{key:"id",label:"name"},"filter-placeholder":"输入搜索",data:e.serviceList},on:{change:e.onTransfer},model:{value:e.serviceForm.serviceIds,callback:function(t){e.$set(e.serviceForm,"serviceIds",t)},expression:"serviceForm.serviceIds"}}),i("div",{staticStyle:{"text-align":"right",margin:"20px 40px 0"},attrs:{slot:"footer"},slot:"footer"},[i("el-button",{attrs:{size:"small"},on:{click:e.abolish}},[e._v("\n                取 消\n              ")]),i("el-button",{attrs:{type:"primary",size:"small"},on:{click:e.submit}},[e._v("\n                确 定\n              ")])],1)],1)])],1)],1)])])},n=[],s=(i("8e6e"),i("ac6a"),i("456d"),i("a8db")),r=(i("c5f6"),i("bd86")),o=(i("96cf"),i("3b8d")),l=(i("7514"),i("7f7f"),i("d225")),c=i("b0b4"),u=i("308d"),d=i("6bb5"),m=i("4e2b"),p=i("9ab4"),f=i("60a3"),v=i("9dba"),g=i("ac1a"),h=i("b32d");function b(e){var t={url:"/orders/commission_cfg/page",method:"post",data:e};return Object(h["a"])(t)}function y(e){var t={url:"/orders/commission_cfg/add",method:"post",data:e};return Object(h["a"])(t)}function x(e){var t=e.id,i=e.list,a={url:"/orders/commission_cfg/association/".concat(t),method:"post",data:i};return Object(h["a"])(a)}function L(e){var t={url:"/orders/commission_cfg/info",method:"get",params:e};return Object(h["a"])(t)}function w(e){var t={url:"/orders/commission_cfg/service",method:"get",params:e};return Object(h["a"])(t)}function k(e){var t={url:"/orders/commission_cfg/show",method:"get",params:e};return Object(h["a"])(t)}function I(e){var t={url:"/orders/commission_cfg/log",method:"post",data:e};return Object(h["a"])(t)}function _(e){var t={url:"/orders/commission_cfg/version",method:"get",params:e};return Object(h["a"])(t)}function S(e){var t={url:"/orders/commission_cfg/del",method:"delete",params:e};return Object(h["a"])(t)}function V(){var e={url:"/setting/area/getCountryList",method:"get"};return Object(h["a"])(e)}function O(e){var t={url:"/cfg/type/getServiceSubtypeList",method:"GET",params:e};return Object(h["a"])(t)}function C(e){var t={url:"/cfg/lsc/listall",method:"post",params:e};return Object(h["a"])(t)}function T(e){var t={url:"/auth/agent/getAgentList",method:"get",params:e};return Object(h["a"])(t)}var F=i("5a0c"),j=i.n(F);function z(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),i.push.apply(i,a)}return i}function D(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?z(i,!0).forEach(function(t){Object(r["a"])(e,t,i[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):z(i).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))})}return e}function M(){return{cid:void 0,colleagues:0,createTime:void 0,custId:void 0,custName:void 0,customer:0,endTime:void 0,escrowCustomer:0,id:void 0,informal:0,measureMethod:void 0,name:void 0,startTime:void 0,team:0,applyTime:[],extentVoList:[{min:void 0,max:void 0,unitPrice:void 0}]}}var R=function(e){function t(){var e;return Object(l["a"])(this,t),e=Object(u["a"])(this,Object(d["a"])(t).apply(this,arguments)),e.loading=!1,e.dialogLoading=!1,e.isDialogFormShow=!1,e.isOperateVisible=!1,e.isServiceVisible=!1,e.isViewVisible=!1,e.selectLoading=!1,e.isEdit=!1,e.tableData=[],e.selectValue={subtypeId:void 0,countryId:void 0,lscId:void 0},e.form=M(),e.formRules={name:[{required:!0,message:"配置名称不能为空",trigger:"blur"}],custId:{required:!0,message:"请选择所属公司",trigger:"change"},measureMethod:{required:!0,message:"请选择计量方式",trigger:"change"},applyTime:{required:!0,message:"请选择有效期",trigger:"change"}},e.selectForm={},e.serviceForm={subtypeId:void 0,serviceIds:[]},e.title="",e.currentId="",e.versionId="",e.stId="",e.stOption=[],e.countryList=[],e.companyList=[],e.versionList=[],e.typeList=[],e.privatelineList=[],e.serviceList=[],e.operateList=[],e.page=1,e.size=10,e.total=0,e.pageR=1,e.totalR=0,e}return Object(m["a"])(t,e),Object(c["a"])(t,[{key:"filterMethod",value:function(e,t){var i=t.name||"";return i.indexOf(e)>-1}},{key:"getCompanyList",value:function(){var e=this;this.selectLoading=!0;var t={page:1,size:9999,parentId:this.custId};T(t).then(function(t){var i=t.data||{};e.companyList=i.result||[],e.selectLoading=!1}).catch(function(t){return e.selectLoading=!1,t})}},{key:"onCompany",value:function(e){this.form.custName="";var t=this.companyList.find(function(t){return t.id===e});t&&(this.form.custName=t.name)}},{key:"getSubtypeList",value:function(){var e=Object(o["a"])(regeneratorRuntime.mark(function e(){var t,i=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return this.selectLoading=!0,t={typeId:"05"},e.next=4,O(t).then(function(e){var t=e.data||[];i.typeList=t,i.selectLoading=!1}).catch(function(e){return i.selectLoading=!1,e});case 4:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}()},{key:"getCountryData",value:function(){var e=this;this.selectLoading=!0,V().then(function(t){var i=t.data||{};e.countryList=i.result||[],e.selectLoading=!1}).catch(function(t){return e.selectLoading=!1,t})}},{key:"getPrivatelineList",value:function(){var e=this;this.selectLoading=!0;var t={subtypeId:this.selectValue.subtypeId,countryId:this.selectValue.countryId};C(t).then(function(t){var i=t.data||[];e.privatelineList=i,e.selectLoading=!1}).catch(function(t){return e.selectLoading=!1,t})}},{key:"typeChange",value:function(){var e=Object(o["a"])(regeneratorRuntime.mark(function e(){var t;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return this.serviceForm.serviceIds=[],e.prev=1,this.dialogLoading=!0,e.next=5,w({measureMethod:this.serviceForm.measureMethod,subtypeId:this.serviceForm.subtypeId});case 5:t=e.sent,this.serviceList=t.data||[],this.stId===this.serviceForm.subtypeId&&(this.serviceForm.serviceIds=this.stOption),this.onTransfer(),this.dialogLoading=!1,e.next=16;break;case 12:return e.prev=12,e.t0=e["catch"](1),this.dialogLoading=!1,e.abrupt("return",e.t0);case 16:case"end":return e.stop()}},e,this,[[1,12]])}));function t(){return e.apply(this,arguments)}return t}()},{key:"onTransfer",value:function(){var e=this;this.serviceForm.serviceIds;this.serviceList=this.serviceList.map(function(t){return D({},t,{disabled:"1"===t.tag&&!e.stOption.some(function(e){return t.id===e})})})}},{key:"editService",value:function(){var e=Object(o["a"])(regeneratorRuntime.mark(function e(t){var i,a,n,s;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return this.isServiceVisible=!0,this.currentId=t.cid,this.serviceForm.measureMethod=t.measureMethod,e.prev=3,this.dialogLoading=!0,e.next=7,O({typeId:"05"});case 7:return i=e.sent,this.typeList=i.data||[],e.next=11,k({cid:t.cid});case 11:return a=e.sent,n=(a.data||[]).map(function(e){return e.lscId}),n.length>0?(this.stId=a.data[0].subtype,this.serviceForm.subtypeId=a.data[0].subtype):this.serviceForm.subtypeId=(this.typeList[0]||{}).id||"",this.stOption=JSON.parse(JSON.stringify(n)),this.serviceForm.serviceIds=n,e.next=18,w({measureMethod:this.serviceForm.measureMethod,subtypeId:this.serviceForm.subtypeId});case 18:s=e.sent,this.serviceList=s.data||[],this.onTransfer(),this.dialogLoading=!1,e.next=28;break;case 24:return e.prev=24,e.t0=e["catch"](3),this.dialogLoading=!1,e.abrupt("return",e.t0);case 28:case"end":return e.stop()}},e,this,[[3,24]])}));function t(t){return e.apply(this,arguments)}return t}()},{key:"abolish",value:function(){this.isServiceVisible=!1,this.stId="",this.stOption=[],this.serviceForm={subtypeId:void 0,serviceIds:[]}}},{key:"submit",value:function(){var e=this;this.dialogLoading=!0;var t=this.serviceForm.serviceIds.map(function(t){var i=e.serviceList.find(function(e){return e.id===t});if(i)return{lscId:i.id,lscName:i.name,subtype:e.serviceForm.subtypeId,cid:e.currentId}});x({id:this.currentId,list:t}).then(function(t){e.dialogLoading=!1,e.$message({type:"success",message:"保存成功"}),e.abolish(),e.queryAll()}).catch(function(t){return e.dialogLoading=!1,t})}},{key:"editOperate",value:function(e){this.isOperateVisible=!0,this.currentId=e.cid,this.getOperateData()}},{key:"getOperateData",value:function(){var e=this;this.dialogLoading=!0;var t={model:this.currentId,page:this.pageR,size:this.size};I(t).then(function(t){e.dialogLoading=!1;var i=t.data||{};e.operateList=i.result||[],e.totalR=i.total}).catch(function(t){return e.dialogLoading=!1,t})}},{key:"handleOperateChange",value:function(e){this.pageR=Number(e),this.getOperateData()}},{key:"closed",value:function(){this.isOperateVisible=!1,this.operateList=[]}},{key:"addRow",value:function(){this.title="新增配置",this.isEdit=!1;var e=this.custType;"0"===e&&this.getCompanyList(),this.isDialogFormShow=!0}},{key:"viewRow",value:function(){var e=Object(o["a"])(regeneratorRuntime.mark(function e(t){var i,a;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return this.isViewVisible=!0,this.currentId=t.cid,this.versionId=t.id,e.prev=3,this.dialogLoading=!0,e.next=7,_({id:this.versionId});case 7:i=e.sent,a=i.data||[],this.versionList=a,e.next=16;break;case 12:return e.prev=12,e.t0=e["catch"](3),this.dialogLoading=!1,e.abrupt("return",e.t0);case 16:this.getCommissionById();case 17:case"end":return e.stop()}},e,this,[[3,12]])}));function t(t){return e.apply(this,arguments)}return t}()},{key:"onVersion",value:function(){this.getCommissionById()}},{key:"offVersion",value:function(){this.isViewVisible=!1,this.versionId="",this.form=M()}},{key:"editRow",value:function(e){this.isDialogFormShow=!0,this.title="添加新版",this.isEdit=!0;var t=this.custType;"0"===t&&this.getCompanyList(),this.currentId=e.cid,this.versionId=e.id,this.getCommissionById()}},{key:"getCommissionById",value:function(){var e=this;this.dialogLoading=!0,L({id:this.versionId}).then(function(t){var i=t.data||{},a=i.extentVoList,n=i.endTime,r=i.startTime,o=Object(s["a"])(i,["extentVoList","endTime","startTime"]);if(a.length<=0)e.form=D({},o,{endTime:n,startTime:r,applyTime:r&&n?[j()(r).format("YYYY-MM-DD"),j()(n).format("YYYY-MM-DD")]:[],extentVoList:[{min:void 0,max:void 0,unitPrice:void 0}]});else{var l=a.map(function(e){var t=e.min,i=e.max,a=e.unitPrice,n=Object(s["a"])(e,["min","max","unitPrice"]);return D({},n,{unitPrice:a>=0?a:void 0,min:t>=0?t:void 0,max:i>=0?i:void 0})});e.form=D({},o,{endTime:n,startTime:r,applyTime:r&&n?[j()(r).format("YYYY-MM-DD"),j()(n).format("YYYY-MM-DD")]:[],extentVoList:l})}e.dialogLoading=!1}).catch(function(t){return e.dialogLoading=!1,t})}},{key:"deleteRow",value:function(e){var t=this,i={cid:e.cid};this.$confirm("请确认是否删除该条数据?","温馨提示",{confirmButtonText:"确定",closeOnClickModal:!1,cancelButtonText:"取消",type:"warning"}).then(function(){S(i).then(function(e){t.$message({type:"success",message:"删除成功"}),t.queryAll()}).catch(function(e){return e})}).catch(function(){return!1})}},{key:"confirm",value:function(){var e=this;this.$refs.editForm.validate(function(t){if(!t)return!1;var i=e.form,a=i.extentVoList,n=i.applyTime,r=(i.id,i.effect,i.delFlag,i.createTime,i.startTime,i.endTime,Object(s["a"])(i,["extentVoList","applyTime","id","effect","delFlag","createTime","startTime","endTime"])),o=Array.isArray(a)&&a.every(function(e){return e.min>=0&&e.max&&e.unitPrice});if(o){var l=a.some(function(e){return e.max<=e.min});if(l)e.$message({type:"error",message:"下限值不能大于等于上限值"});else{var c=!1;if(a.map(function(e,t){c=a.some(function(i,a){return t!==a&&(i.min<=e.min&&e.min<i.max||i.min<e.max&&e.max<=i.max)})}),c)e.$message({type:"error",message:"区间范围不能重叠"});else{for(var u=!1,d=0;d<a.length;d++)if(d>0){var m=a[d],p=a[d-1];if(m.min!==p.max){u=!0;break}}if(u)e.$message({type:"error",message:"区间范围必须连续"});else{e.dialogLoading=!0;var f=e.custType,v=D({},r,{custId:"0"===f?e.form.custId:e.custId,custName:"0"===f?e.form.custName:e.custName,startTime:n.length>0?n[0]+" 00:00:00":"",endTime:n.length>1?n[1]+" 23:59:59":"",extentVoList:a});y(v).then(function(t){e.dialogLoading=!1,e.cancel(),e.$message({type:"success",message:"保存成功"}),e.queryAll()}).catch(function(t){return e.dialogLoading=!1,t})}}}}else e.$message.error("请填写完整区间&提成")})}},{key:"addRangeData",value:function(){this.form.extentVoList.push({min:void 0,max:void 0,unitPrice:void 0})}},{key:"deleteRangeData",value:function(e){this.form.extentVoList.splice(e,1)}},{key:"cancel",value:function(){this.isDialogFormShow=!1,this.reset()}},{key:"reset",value:function(){this.title="",this.form=M(),this.clearValidate()}},{key:"clearValidate",value:function(){var e=this;this.$nextTick(function(){var t=e.$refs.editForm;t.clearValidate()})}},{key:"queryAll",value:function(e){var t=this;this.loading=!0,e&&(this.page=e);var i={model:D({},this.selectValue,{countryId:void 0}),page:this.page,size:this.size};b(i).then(function(e){t.loading=!1;var i=e.data||{};t.tableData=i.result||[],t.total=i.total}).catch(function(e){return t.loading=!1,e})}},{key:"handleCurrentChange",value:function(e){this.page=Number(e),this.queryAll()}},{key:"created",value:function(){this.queryAll()}},{key:"labelPosition",get:function(){var e=g["a"].language;return e&&"en"===e?"top":"left"}},{key:"lang",get:function(){var e=g["a"].language;return e||"en"}},{key:"custType",get:function(){var e=v["a"].info||{},t=e.custType;return t}},{key:"custId",get:function(){var e=v["a"].info||{},t=e.custId;return t}},{key:"custName",get:function(){var e=v["a"].info||{},t=e.custName;return t}},{key:"pickerOptions",get:function(){return{disabledDate:function(e){return e.getTime()<Date.now()}}}}]),t}(f["e"]);R=p["a"]([Object(f["a"])({name:"Port",components:{},props:{}})],R);var $=R,P=$,N=(i("f33d"),i("2877")),Y=Object(N["a"])(P,a,n,!1,null,"f3a3c8d8",null);t["default"]=Y.exports},f33d:function(e,t,i){"use strict";var a=i("04a6"),n=i.n(a);n.a}}]);