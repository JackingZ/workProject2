(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["job-commission"],{c164:function(e,t,i){"use strict";i.d(t,"h",function(){return s}),i.d(t,"f",function(){return n}),i.d(t,"a",function(){return r}),i.d(t,"c",function(){return o}),i.d(t,"g",function(){return l}),i.d(t,"e",function(){return c}),i.d(t,"d",function(){return u}),i.d(t,"i",function(){return m}),i.d(t,"k",function(){return p}),i.d(t,"b",function(){return d}),i.d(t,"j",function(){return h});var a=i("b32d");function s(e){var t={url:"/auth/supplier/getSupplierList",method:"get",params:e};return Object(a["a"])(t)}function n(e){var t={url:"/auth/post/getPostList",method:"get",params:e};return Object(a["a"])(t)}function r(e){var t={url:"/auth/post/add",method:"post",data:e};return Object(a["a"])(t)}function o(e){var t={url:"/auth/post/edit",method:"post",data:e};return Object(a["a"])(t)}function l(e){var t={url:"/cfg/type/getServiceTypeList",method:"get",params:e};return Object(a["a"])(t)}function c(e){var t={url:"/auth/commission/getCommissionList",method:"get",params:e};return Object(a["a"])(t)}function u(e){var t={url:"/auth/commission/getCommission",method:"get",params:e};return Object(a["a"])(t)}function m(e){var t={url:"/auth/commission/getVersionList",method:"get",params:e};return Object(a["a"])(t)}function p(e){var t={url:"/auth/commission/saveCommission",method:"post",data:e};return Object(a["a"])(t)}function d(e){var t={url:"/auth/commission/deteleCommission",method:"delete",params:e};return Object(a["a"])(t)}function h(e){var t={url:"/setting/dict/item/type",method:"get",params:e};return Object(a["a"])(t)}},c69b:function(e,t,i){},e369:function(e,t,i){"use strict";var a=i("c69b"),s=i.n(a);s.a},ec6a:function(e,t,i){"use strict";i.r(t);var a=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticStyle:{display:"flex","flex-flow":"row nowrap","min-height":"inherit"}},[i("div",{staticClass:"dashboard-container",staticStyle:{flex:"1",overflow:"auto"}},[i("div",{staticClass:"app-container"},[i("head-info",{attrs:{info:"",title:"岗位提成"}}),i("div",{staticClass:"app-panel"},[i("el-row",[i("el-col",{staticStyle:{"text-align":"right"},attrs:{span:24}},[i("el-select",{directives:[{name:"show",rawName:"v-show",value:"0"===e.custId,expression:"custId === '0'"}],staticStyle:{width:"200px","margin-right":"5px"},attrs:{loading:e.supplierLoading,placeholder:"所属公司",size:"small",filterable:""},on:{change:e.onSupplier},model:{value:e.selectValue.custId,callback:function(t){e.$set(e.selectValue,"custId",t)},expression:"selectValue.custId"}},e._l(e.supplierList,function(e,t){return i("el-option",{key:t,attrs:{label:e.name,value:e.id}})}),1),i("el-select",{staticStyle:{width:"120px","margin-right":"5px"},attrs:{size:"small",clearable:"",filterable:"",placeholder:"计量方式"},model:{value:e.selectValue.commissionType,callback:function(t){e.$set(e.selectValue,"commissionType",t)},expression:"selectValue.commissionType"}},[i("el-option",{attrs:{label:"按重量",value:"0"}}),i("el-option",{attrs:{label:"按体积",value:"1"}}),i("el-option",{attrs:{label:"按票",value:"2"}}),i("el-option",{attrs:{label:"按箱",value:"3"}})],1),i("el-input",{staticStyle:{width:"300px","margin-right":"10px"},attrs:{size:"small",clearable:"",placeholder:"请输入"},model:{value:e.selectValue.postName,callback:function(t){e.$set(e.selectValue,"postName",t)},expression:"selectValue.postName"}},[i("template",{slot:"prepend"},[e._v("\n                岗位名称\n              ")])],2),i("el-button",{directives:[{name:"permission",rawName:"v-permission",value:["commissionQuery"],expression:"['commissionQuery']"}],attrs:{type:"primary",size:"small"},on:{click:function(t){return e.queryAll(1)}}},[e._v("\n              查询\n            ")])],1)],1),i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticStyle:{width:"100%",margin:"10px 0"},attrs:{data:e.tableData,height:"calc(100vh - 313px)",border:""}},[i("el-table-column",{attrs:{prop:"name",label:"所属公司","min-width":"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n              "+e._s(e.companyFilter(t.row))+"\n            ")]}}])}),i("el-table-column",{attrs:{prop:"postName",label:"岗位名称","min-width":"120"}}),i("el-table-column",{attrs:{prop:"type",label:"计量方式",width:"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n              "+e._s(e.typeFilter(t.row))+"\n            ")]}}])}),i("el-table-column",{attrs:{prop:"um",label:"计量单位",width:"140"}}),i("el-table-column",{attrs:{prop:"version",width:"150",label:"最新版本"}}),i("el-table-column",{attrs:{label:"最新版本日期",width:"300"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n              "+e._s(e.dateFilter(t.row))+"\n            ")]}}])}),i("el-table-column",{attrs:{label:"更新提成",width:"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("el-button",{attrs:{disabled:!e.$checkPermission(["commissionUpdate"]),type:"text"},on:{click:function(i){return e.setCommission(t.row)}}},[e._v("\n                更新提成\n              ")])]}}])}),i("el-table-column",{attrs:{fixed:"right",width:"100",label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("el-button",{directives:[{name:"permission",rawName:"v-permission",value:["commissionGet"],expression:"['commissionGet']"}],attrs:{type:"text"},on:{click:function(i){return e.detail(t.row)}}},[e._v("\n                查看\n              ")])]}}])})],1),i("el-pagination",{staticStyle:{"text-align":"right"},attrs:{"current-page":e.page,"page-size":e.size,layout:"total, prev, pager, next",total:e.total},on:{"update:currentPage":function(t){e.page=t},"update:current-page":function(t){e.page=t},"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}}),i("el-dialog",{attrs:{title:e.jobName,visible:e.isSetVisible,"close-on-click-modal":!1,width:"600px"},on:{"update:visible":function(t){e.isSetVisible=t},close:e.cancel}},[i("div",{staticStyle:{padding:"0 70px 0 30px"}},[i("el-form",{directives:[{name:"loading",rawName:"v-loading",value:e.formLoading,expression:"formLoading"}],ref:"editForm",attrs:{model:e.selectForm,rules:e.formRules,"label-width":"90px","label-position":"right",size:"small"}},[i("el-form-item",{attrs:{label:"计量方式",prop:"type"}},[i("el-select",{staticStyle:{width:"100%"},attrs:{disabled:"1"===e.timeCompare,placeholder:"请选择",filterable:"",clearable:""},on:{change:e.onType},model:{value:e.selectForm.type,callback:function(t){e.$set(e.selectForm,"type",t)},expression:"selectForm.type"}},[i("el-option",{attrs:{label:"按重量",value:"0"}}),i("el-option",{attrs:{label:"按体积",value:"1"}}),i("el-option",{attrs:{label:"按票",value:"2"}}),i("el-option",{attrs:{label:"按箱",value:"3"}})],1)],1),i("el-form-item",{attrs:{label:"计量单位",prop:"um"}},[i("el-select",{staticStyle:{width:"100%"},attrs:{disabled:"1"===e.timeCompare,placeholder:"请选择"},model:{value:e.selectForm.um,callback:function(t){e.$set(e.selectForm,"um",t)},expression:"selectForm.um"}},e._l(e.umList,function(e,t){return i("el-option",{key:t,attrs:{label:e.name,value:e.id}})}),1)],1),"1"!==e.timeCompare?i("div",[i("el-form-item",{attrs:{label:"起止日期",prop:"time"}},[i("el-date-picker",{staticStyle:{width:"100%"},attrs:{"value-format":"yyyy-MM-dd",placeholder:"选择日期",type:"daterange","unlink-panels":"","range-separator":"~","start-placeholder":"开始日期","end-placeholder":"结束日期"},model:{value:e.selectForm.time,callback:function(t){e.$set(e.selectForm,"time",t)},expression:"selectForm.time"}})],1)],1):i("div",[i("el-form-item",{attrs:{label:"起始日期",prop:"startDate"}},[i("el-date-picker",{staticStyle:{width:"100%"},attrs:{disabled:"1"===e.timeCompare,"value-format":"yyyy-MM-dd",placeholder:"选择日期",type:"date"},model:{value:e.selectForm.startDate,callback:function(t){e.$set(e.selectForm,"startDate",t)},expression:"selectForm.startDate"}})],1),i("el-form-item",{attrs:{label:"截止日期",prop:"endDate"}},[i("el-date-picker",{staticStyle:{width:"100%"},attrs:{"picker-options":e.pickerOptions,"value-format":"yyyy-MM-dd",placeholder:"选择日期",type:"date"},model:{value:e.selectForm.endDate,callback:function(t){e.$set(e.selectForm,"endDate",t)},expression:"selectForm.endDate"}})],1)],1),i("el-form-item",{attrs:{label:"区间&提成",prop:"sections"}},e._l(e.selectForm.sections,function(t,a){return i("div",{key:a,staticClass:"item-after-icon"},[i("el-input-number",{staticClass:"input-number-valiate",attrs:{controls:!1,disabled:"1"===e.timeCompare,placeholder:"输入下限",min:0,max:999999,step:1,"step-strictly":""},model:{value:e.selectForm.sections[a].lower,callback:function(t){e.$set(e.selectForm.sections[a],"lower",t)},expression:"selectForm.sections[index].lower"}}),i("el-input-number",{staticClass:"input-number-valiate",attrs:{controls:!1,disabled:"1"===e.timeCompare,placeholder:"输入上限",min:0,max:999999,step:1,"step-strictly":""},model:{value:e.selectForm.sections[a].upper,callback:function(t){e.$set(e.selectForm.sections[a],"upper",t)},expression:"selectForm.sections[index].upper"}}),i("el-input-number",{staticClass:"input-number-valiate",attrs:{controls:!1,disabled:"1"===e.timeCompare,placeholder:"单位金额",min:0,max:999999,precision:2},model:{value:e.selectForm.sections[a].amount,callback:function(t){e.$set(e.selectForm.sections[a],"amount",t)},expression:"selectForm.sections[index].amount"}}),"1"!==e.timeCompare?i("span",[i("i",0===a?{staticClass:"el-icon-circle-plus-outline item-icon-plus",on:{click:e.addRangeData}}:{staticClass:"el-icon-remove-outline item-icon-reduce",on:{click:function(t){return e.deleteRangeData(a)}}})]):e._e()],1)}),0)],1)],1),i("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:e.cancel}},[e._v("\n              取 消\n            ")]),i("el-button",{attrs:{type:"primary"},on:{click:e.saveConfirm}},[e._v("\n              确 定\n            ")])],1)]),i("el-dialog",{attrs:{title:e.jobName,visible:e.isViewVisible,"close-on-click-modal":!1,width:"800px"},on:{"update:visible":function(t){e.isViewVisible=t},close:e.close}},[i("div",{staticStyle:{"text-align":"right"}},[i("el-select",{staticStyle:{width:"300px"},attrs:{placeholder:"请选择",filterable:"",size:"small"},on:{change:e.onViewVersion},model:{value:e.versionView,callback:function(t){e.versionView=t},expression:"versionView"}},e._l(e.versionList,function(e,t){return i("el-option",{key:t,attrs:{label:e.name,value:e.id}})}),1)],1),i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.subLoading,expression:"subLoading"}],staticStyle:{width:"100%",margin:"10px 0"},attrs:{data:e.subTableData,height:"450px",border:""}},[i("el-table-column",{attrs:{prop:"type",label:"计量方式",width:"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                "+e._s(e.typeFilter(t.row))+"\n              ")]}}])}),i("el-table-column",{attrs:{prop:"um",width:"120",label:"计量单位"}}),i("el-table-column",{attrs:{prop:"lower",label:"区间下限"}}),i("el-table-column",{attrs:{prop:"upper",label:"区间上限"}}),i("el-table-column",{attrs:{prop:"amount",label:"提成金额"}}),i("el-table-column",{attrs:{fixed:"right",width:"100",label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return["2"!==e.timeCompare?i("el-button",{attrs:{type:"text"},on:{click:function(i){return e.editCommission(t.row)}}},[e._v("\n                  编辑\n                ")]):e._e()]}}])})],1)],1)],1)],1)])])},s=[],n=(i("8e6e"),i("ac6a"),i("456d"),i("c5f6"),i("bd86")),r=(i("6b54"),i("7f7f"),i("7514"),i("d225")),o=i("b0b4"),l=i("308d"),c=i("6bb5"),u=i("4e2b"),m=i("9ab4"),p=i("60a3"),d=i("9dba"),h=i("ac1a"),v=i("c164"),f=i("5a0c"),b=i.n(f);function g(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),i.push.apply(i,a)}return i}function y(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?g(i,!0).forEach(function(t){Object(n["a"])(e,t,i[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):g(i).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))})}return e}var w=function(e){function t(){var e;return Object(r["a"])(this,t),e=Object(l["a"])(this,Object(c["a"])(t).apply(this,arguments)),e.loading=!1,e.subLoading=!1,e.supplierLoading=!1,e.isSetVisible=!1,e.isViewVisible=!1,e.supplierList=[{id:"0",name:"聚货通"}],e.tableData=[],e.jobName="",e.companyName="",e.versionView="",e.jsonForm={},e.selectValue={custId:e.custId,commissionType:void 0,postName:void 0},e.selectForm={custId:void 0,postId:void 0,version:void 0,um:void 0,type:void 0,startDate:void 0,endDate:void 0,time:[],sections:[{lower:void 0,upper:void 0,amount:void 0}]},e.formLoading=!1,e.umList=[],e.page=1,e.size=10,e.total=0,e.formRules={type:[{required:!0,message:"请选择计量方式",trigger:"change"}],um:[{required:!0,message:"请选择计量单位",trigger:"change"}],startDate:[{required:!0,message:"请选择起始日期",trigger:"change"}],endDate:[{required:!0,message:"请选择截止日期",trigger:"change"}],time:[{required:!0,message:"请选择起止日期",trigger:"change"}],sections:[{required:!0,message:"区间提成不能为空",trigger:"blur"}]},e.timeCompare="",e.subTableData=[],e.versionList=[],e}return Object(u["a"])(t,e),Object(o["a"])(t,[{key:"getSupplierList",value:function(){var e=this;this.supplierLoading=!0;var t=this.custId,i={page:1,size:99999,parentId:t};Object(v["h"])(i).then(function(t){var i=t.data||{};e.supplierList=i.result||[],e.supplierList.unshift({id:"0",name:"聚货通"}),e.supplierLoading=!1}).catch(function(t){return e.supplierLoading=!1,t})}},{key:"onSupplier",value:function(){this.tableData=[],this.queryAll(1)}},{key:"companyFilter",value:function(e){var t=this,i=(this.supplierList||[]).find(function(e){return e.id===t.selectValue.custId})||{};return e.name=i.name||"",e.name}},{key:"dateFilter",value:function(e){if(e.startDate&&e.endDate)return e.startDate+"至"+e.endDate}},{key:"typeFilter",value:function(e){var t;switch(e.type){case"0":t="按重量";break;case"1":t="按体积";break;case"2":t="按票";break;case"3":t="按箱";break;default:break}return t}},{key:"timeStatus",value:function(e,t){var i=b()().valueOf(),a=e?b()(e).valueOf():void 0,s=t?b()(t).valueOf():void 0;this.timeCompare="",a&&i<a?this.timeCompare="0":a&&s&&a<=i&&i<s?this.timeCompare="1":s&&i>=s&&(this.timeCompare="2")}},{key:"detail",value:function(e){var t=e.version,i=e.name,a=e.custId,s=e.startDate,n=e.endDate;t?(this.jobName="查看提成【"+(i||"")+"】",this.companyName=i||"",this.timeStatus(s,n),this.jsonForm=e,this.jsonForm.time=[s,n],this.jsonForm.custId=a||this.selectValue.custId,this.versionView=(t||"").toString(),this.getCommission(),this.getVersionList(),this.isViewVisible=!0):this.$message.error("暂无版本，请更新提成")}},{key:"close",value:function(){this.isViewVisible=!1,this.resetForm()}},{key:"editCommission",value:function(e){this.jobName="编辑提成【"+this.companyName+"】",this.selectForm=JSON.parse(JSON.stringify(this.jsonForm)),this.isSetVisible=!0}},{key:"getCommission",value:function(){var e=this;this.subLoading=!0;var t={custId:this.jsonForm.custId,postId:this.jsonForm.postId,version:this.versionView};Object(v["d"])(t).then(function(t){var i=t.data||{};!Array.isArray(i.sections)||i.sections.length<=0?e.jsonForm.sections=[{lower:void 0,upper:void 0,amount:void 0}]:e.jsonForm.sections=i.sections,e.subTableData=i.sections.map(function(e){var t=e.lower,a=e.upper,s=e.amount,n={lower:t,upper:a,amount:s};return n.type=i.type||"",n.um=i.um||"",n}),e.subLoading=!1}).catch(function(t){return e.subLoading=!1,[t]})}},{key:"getVersionList",value:function(){var e=this;Object(v["i"])({custId:this.jsonForm.custId,postId:this.jsonForm.postId}).then(function(t){e.versionList=t.data||[]}).catch(function(e){return[e]})}},{key:"onViewVersion",value:function(){var e=this;this.versionList.map(function(t){e.selectForm.version===t.id&&e.timeStatus(t.startDate,t.endDate)}),this.getCommission()}},{key:"setCommission",value:function(e){var t=e.name,i=(e.id,e.postId),a=e.postName,s=e.custId;this.jobName="更新提成【"+t+"】",this.selectForm.postId=i,this.selectForm.postName=a,this.selectForm.custId=s||this.selectValue.custId,this.isSetVisible=!0,this.timeCompare=""}},{key:"deteleCommission",value:function(e){var t=this,i={id:e.id};this.$confirm("请确认是否删除该条数据?","温馨提示",{confirmButtonText:"确定",closeOnClickModal:!1,cancelButtonText:"取消",type:"warning"}).then(function(){Object(v["b"])(i).then(function(e){t.$message({type:"success",message:"删除成功"}),t.queryAll()}).catch(function(e){return e})}).catch(function(){return!1})}},{key:"onType",value:function(e){switch(e){case"0":this.umList=[{name:"KGS-公斤",id:"KGS"},{name:"LBS-磅",id:"LBS"},{name:"OZS-盎司",id:"OZS"},{name:"OTR-其它",id:"OTR"}];break;case"1":this.umList=[{name:"CBM-立方米",id:"CBM"},{name:"CUFT-立方英尺",id:"CUFT"},{name:"OTR-其它",id:"OTR"}];break;case"2":this.umList=[{name:"IVC-票",id:"IVC"}];break;case"3":this.umList=[{name:"BOX-箱",id:"BOX"}];break;default:this.umList=[];break}}},{key:"addRangeData",value:function(){this.selectForm.sections.push({lower:void 0,upper:void 0,amount:void 0})}},{key:"deleteRangeData",value:function(e){this.selectForm.sections.splice(e,1)}},{key:"cancel",value:function(){this.isSetVisible=!1,this.resetForm(),this.clearValidate()}},{key:"clearValidate",value:function(){var e=this;this.$nextTick(function(){var t=e.$refs.editForm;t.clearValidate()})}},{key:"resetForm",value:function(){this.selectForm={custId:void 0,postId:void 0,version:void 0,um:void 0,type:void 0,startDate:void 0,endDate:void 0,time:[],sections:[{lower:void 0,upper:void 0,amount:void 0}]}}},{key:"saveConfirm",value:function(){var e=this,t=this.$refs.editForm;t.validate(function(t){if(!t)return!1;var i=e.selectForm.sections,a=Array.isArray(i)&&i.every(function(e){return e.lower>=0&&e.upper&&e.amount});if(a){var s=e.selectForm.sections.some(function(e){return e.upper<=e.lower});if(s)e.$message({type:"error",message:"下限值不能大于等于上限值"});else{var n=!1;if(e.selectForm.sections.map(function(t,i){n=e.selectForm.sections.some(function(e,a){return i!==a&&(e.lower<=t.lower&&t.lower<e.upper||e.lower<t.upper&&t.upper<=e.upper)})}),n)e.$message({type:"error",message:"区间范围不能重叠"});else{e.formLoading=!0;var r=y({},e.selectForm);"1"!==e.timeCompare&&(r.startDate=e.selectForm.time[0],r.endDate=e.selectForm.time[1]),Object(v["k"])(r).then(function(t){e.formLoading=!1,e.$message({type:"success",message:"操作成功"}),e.isSetVisible=!1,e.isViewVisible=!1,e.resetForm(),e.clearValidate(),e.queryAll()}).catch(function(t){return e.formLoading=!1,t})}}}else e.$message.error("请填写完整区间&提成")})}},{key:"queryAll",value:function(e){var t=this;this.loading=!0,e&&(this.page=e);var i=y({},this.selectValue,{page:this.page,size:this.size});Object(v["e"])(i).then(function(e){t.loading=!1,t.tableData=e.data.result,t.total=e.data.total}).catch(function(e){return t.loading=!1,e})}},{key:"handleSizeChange",value:function(e){this.size=Number(e),this.queryAll()}},{key:"handleCurrentChange",value:function(e){this.page=Number(e),this.queryAll()}},{key:"created",value:function(){this.queryAll(),"0"===this.custId&&this.getSupplierList()}},{key:"labelPosition",get:function(){var e=h["a"].language;return e&&"en"===e?"top":"left"}},{key:"lang",get:function(){var e=h["a"].language;return e||"en"}},{key:"custId",get:function(){var e=d["a"].info||{},t=e.custId;return t}},{key:"pickerOptions",get:function(){var e=this;return{disabledDate:function(t){return t.getTime()<=b()(e.selectForm.startDate).valueOf()}}}}]),t}(p["e"]);w=m["a"]([Object(p["a"])({name:"Port",components:{},props:{}})],w);var k=w,F=k,O=(i("e369"),i("2877")),x=Object(O["a"])(F,a,s,!1,null,"7b6ea844",null);t["default"]=x.exports}}]);