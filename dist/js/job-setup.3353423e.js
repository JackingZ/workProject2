(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["job-setup"],{"46dc":function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticStyle:{display:"flex","flex-flow":"row nowrap","min-height":"inherit"}},[a("div",{staticClass:"dashboard-container",staticStyle:{flex:"1",overflow:"auto"}},[a("div",{staticClass:"app-container"},[a("head-info",{attrs:{info:"",title:"岗位设置"}}),a("div",{staticClass:"app-panel"},[a("el-row",[a("el-col",{attrs:{span:4}},[a("el-button",{directives:[{name:"permission",rawName:"v-permission",value:["postsettingAdd"],expression:"['postsettingAdd']"}],staticStyle:{"margin-left":"10px"},attrs:{type:"text",icon:"el-icon-circle-plus-outline"},on:{click:e.addRow}},[e._v("\n              新增岗位\n            ")])],1),a("el-col",{staticStyle:{"text-align":"right"},attrs:{span:20}},[a("el-select",{staticStyle:{width:"120px","margin-right":"5px"},attrs:{size:"small",clearable:"",placeholder:"公司类型"},model:{value:e.selectValue.type,callback:function(t){e.$set(e.selectValue,"type",t)},expression:"selectValue.type"}},[a("el-option",{attrs:{label:"聚货通",value:"0"}}),a("el-option",{attrs:{label:"客户",value:"1"}}),a("el-option",{attrs:{label:"代理商",value:"2"}}),a("el-option",{attrs:{label:"供应商",value:"3"}})],1),a("el-input",{staticStyle:{width:"300px","margin-right":"10px"},attrs:{size:"small",clearable:"",placeholder:"请输入"},model:{value:e.selectValue.name,callback:function(t){e.$set(e.selectValue,"name",t)},expression:"selectValue.name"}},[a("template",{slot:"prepend"},[e._v("\n                岗位名称\n              ")])],2),a("el-button",{directives:[{name:"permission",rawName:"v-permission",value:["postsettingQuery"],expression:"['postsettingQuery']"}],attrs:{type:"primary",size:"small"},on:{click:function(t){return e.queryAll(1)}}},[e._v("\n              查询\n            ")])],1)],1),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticStyle:{width:"100%",margin:"10px 0"},attrs:{data:e.tableData,height:"calc(100vh - 313px)",border:""}},[a("el-table-column",{attrs:{prop:"name",label:"岗位名称"}}),a("el-table-column",{attrs:{prop:"",label:"岗位类型",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n              "+e._s(e.postFilter(t.row))+"\n            ")]}}])}),a("el-table-column",{attrs:{prop:"name",label:"公司类型","min-width":"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n              "+e._s(e.typeFilter(t.row))+"\n            ")]}}])}),a("el-table-column",{attrs:{prop:"subtypeName",label:"服务大类","min-width":"150","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{prop:"createTime",label:"添加时间",width:"180"}}),a("el-table-column",{attrs:{label:"操作",width:"120",fixed:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{directives:[{name:"permission",rawName:"v-permission",value:["postsettingUpdate"],expression:"['postsettingUpdate']"}],attrs:{type:"text",size:"medium"},on:{click:function(a){return e.editRow(t.row)}}},[e._v("\n                编辑\n              ")])]}}])})],1),a("el-pagination",{staticStyle:{"text-align":"right"},attrs:{"current-page":e.page,"page-size":e.size,layout:"total, prev, pager, next",total:e.total},on:{"update:currentPage":function(t){e.page=t},"update:current-page":function(t){e.page=t},"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}}),a("el-dialog",{attrs:{title:e.isEdit?"编辑岗位":"新增岗位",visible:e.isDialogFormShow,"close-on-click-modal":!1,width:"600px"},on:{"update:visible":function(t){e.isDialogFormShow=t},closed:e.cancel}},[a("div",{directives:[{name:"loading",rawName:"v-loading",value:e.dialogLoading,expression:"dialogLoading"}]},[a("el-form",{ref:"editForm",staticStyle:{"padding-right":"20px"},attrs:{model:e.form,rules:e.formRules,"label-width":"120px","label-position":"right",size:"small"}},[a("el-form-item",{attrs:{prop:"name",label:"岗位名称"}},[a("el-input",{staticStyle:{width:"100%"},attrs:{autocomplete:"off",maxlength:20},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1),a("el-form-item",{attrs:{prop:"type",label:"企业类型"}},[a("el-select",{staticStyle:{width:"100%"},attrs:{size:"small",clearable:"",filterable:"",multiple:"","collapse-tags":"",placeholder:"请选择"},on:{change:e.onType},model:{value:e.form.type,callback:function(t){e.$set(e.form,"type",t)},expression:"form.type"}},[a("el-option",{attrs:{label:"聚货通",value:"0"}}),a("el-option",{attrs:{label:"客户",value:"1"}}),a("el-option",{attrs:{label:"代理商",value:"2"}}),a("el-option",{attrs:{label:"供应商",value:"3"}})],1)],1),a("el-form-item",{attrs:{prop:"subtypeId",label:"服务大类"}},[a("el-select",{staticStyle:{width:"100%"},attrs:{loading:e.selectLoading,disabled:!e.form.type,size:"small",clearable:"",filterable:"",multiple:"","collapse-tags":"",placeholder:"请选择"},model:{value:e.form.subtypeId,callback:function(t){e.$set(e.form,"subtypeId",t)},expression:"form.subtypeId"}},e._l(e.subtypeList,function(e,t){return a("el-option",{key:t,attrs:{label:e.name,value:e.id}})}),1)],1),a("el-form-item",{attrs:{prop:"postType",label:"岗位类别"}},[a("el-select",{staticStyle:{width:"100%"},attrs:{loading:e.selectLoading,size:"small",clearable:"",filterable:"",placeholder:"请选择"},on:{focus:e.getWorkList},model:{value:e.form.postType,callback:function(t){e.$set(e.form,"postType",t)},expression:"form.postType"}},e._l(e.workList,function(e,t){return a("el-option",{key:t,attrs:{label:e.label,value:e.value}})}),1)],1)],1),a("div",{staticStyle:{"text-align":"right",padding:"10px 0 20px"},attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:e.cancel}},[e._v("\n                取 消\n              ")]),a("el-button",{attrs:{type:"primary"},on:{click:e.confirm}},[e._v("\n                确 定\n              ")])],1)],1)])],1)],1)])])},n=[],r=(a("8e6e"),a("ac6a"),a("456d"),a("7514"),a("bd86")),o=a("a8db"),l=(a("c5f6"),a("7f7f"),a("28a5"),a("d225")),s=a("b0b4"),u=a("308d"),c=a("6bb5"),p=a("4e2b"),d=a("9ab4"),m=a("60a3"),f=a("ac1a"),g=a("c164");function b(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,i)}return a}function h(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?b(a,!0).forEach(function(t){Object(r["a"])(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):b(a).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}var y=function(e){function t(){var e;return Object(l["a"])(this,t),e=Object(u["a"])(this,Object(c["a"])(t).apply(this,arguments)),e.loading=!1,e.dialogLoading=!1,e.isDialogFormShow=!1,e.selectLoading=!1,e.isEdit=!1,e.tableData=[],e.selectValue={type:"",name:""},e.form={name:void 0,type:[],subtypeId:[],subtypeName:void 0,postType:void 0},e.formRules={name:[{required:!0,message:"岗位名称不能为空",trigger:"blur"}],type:{required:!0,message:"请选择企业类型",trigger:"change"},subtypeId:{required:!0,message:"请选择服务大类",trigger:"change"},postType:{required:!1,message:"请选择岗位类型",trigger:"change"}},e.subtypeList=[],e.workList=[],e.page=1,e.size=10,e.total=0,e}return Object(p["a"])(t,e),Object(s["a"])(t,[{key:"typeFilter",value:function(e){var t=[],a=(e.type||"").split(",");return a.map(function(e){"0"===e&&t.push("聚货通"),"1"===e&&t.push("客户"),"2"===e&&t.push("代理商"),"3"===e&&t.push("供应商")}),t.join(",")}},{key:"postFilter",value:function(e){var t;return this.workList.map(function(a){e.postType===a.value&&(t=a.label)}),t}},{key:"queryAll",value:function(e){var t=this;this.loading=!0,e&&(this.page=e);var a={type:this.selectValue.type,name:this.selectValue.name,page:this.page,size:this.size};Object(g["f"])(a).then(function(e){t.loading=!1;var a=e.data||{};t.tableData=(a.result||[]).map(function(e){return e.postType=e.postType+"",e}),t.total=a.total}).catch(function(e){return t.loading=!1,e})}},{key:"handleSizeChange",value:function(e){this.size=Number(e),this.queryAll()}},{key:"handleCurrentChange",value:function(e){this.page=Number(e),this.queryAll()}},{key:"onType",value:function(){this.form.subtypeId=[],this.subtypeList=[],this.getSubtypeList()}},{key:"getSubtypeList",value:function(){var e=this;this.selectLoading=!0;var t=(this.form.type||[]).join(","),a={custType:t};Object(g["g"])(a).then(function(t){e.subtypeList=t.data||[],e.selectLoading=!1}).catch(function(t){return e.selectLoading=!1,t})}},{key:"getWorkList",value:function(){var e=this;this.selectLoading=!0,Object(g["j"])({type:"POST_TYPE1"}).then(function(t){var a=t.data||[];e.workList=a,e.selectLoading=!1}).catch(function(t){return e.selectLoading=!1,t})}},{key:"addRow",value:function(){this.isDialogFormShow=!0,this.isEdit=!1}},{key:"editRow",value:function(e){this.isDialogFormShow=!0,this.isEdit=!0;var t=e.type,a=e.subtypeId,i=Object(o["a"])(e,["type","subtypeId"]);this.form=h({},i,{type:(t||"").split(","),subtypeId:(a||"").split(",")}),this.getSubtypeList(),this.getWorkList()}},{key:"confirm",value:function(){var e=this;this.$refs.editForm.validate(function(t){if(!t)return!1;e.dialogLoading=!0;var a=e.form,i=a.type,n=a.subtypeId,r=(a.subtypeName,a.createTime,Object(o["a"])(a,["type","subtypeId","subtypeName","createTime"])),l=h({},r,{type:(i||[]).join(","),subtypeId:(n||[]).join(",")}),s=[];n.map(function(t){var a=e.subtypeList.find(function(e){return t===e.id})||{};a.id&&a.name&&s.push(a.name)}),l.subtypeName=s.join(","),e.isEdit?Object(g["c"])(l).then(function(t){e.dialogLoading=!1,e.cancel(),e.$message({type:"success",message:"保存成功"}),e.queryAll()}).catch(function(t){return e.dialogLoading=!1,t}):Object(g["a"])(l).then(function(t){e.dialogLoading=!1,e.cancel(),e.$message({type:"success",message:"新增成功"}),e.queryAll()}).catch(function(t){return e.dialogLoading=!1,t})})}},{key:"cancel",value:function(){this.isDialogFormShow=!1,this.reset()}},{key:"reset",value:function(){this.form={name:void 0,type:[],subtypeId:[],subtypeName:void 0,postType:void 0},this.clearValidate()}},{key:"clearValidate",value:function(){var e=this;this.$nextTick(function(){var t=e.$refs.editForm;t.clearValidate()})}},{key:"created",value:function(){this.getWorkList(),this.queryAll()}},{key:"labelPosition",get:function(){var e=f["a"].language;return e&&"en"===e?"top":"left"}},{key:"lang",get:function(){var e=f["a"].language;return e||"en"}}]),t}(m["e"]);y=d["a"]([Object(m["a"])({name:"Port",components:{},props:{}})],y);var v=y,w=v,k=a("2877"),j=Object(k["a"])(w,i,n,!1,null,"03a02164",null);t["default"]=j.exports},c164:function(e,t,a){"use strict";a.d(t,"h",function(){return n}),a.d(t,"f",function(){return r}),a.d(t,"a",function(){return o}),a.d(t,"c",function(){return l}),a.d(t,"g",function(){return s}),a.d(t,"e",function(){return u}),a.d(t,"d",function(){return c}),a.d(t,"i",function(){return p}),a.d(t,"k",function(){return d}),a.d(t,"b",function(){return m}),a.d(t,"j",function(){return f});var i=a("b32d");function n(e){var t={url:"/auth/supplier/getSupplierList",method:"get",params:e};return Object(i["a"])(t)}function r(e){var t={url:"/auth/post/getPostList",method:"get",params:e};return Object(i["a"])(t)}function o(e){var t={url:"/auth/post/add",method:"post",data:e};return Object(i["a"])(t)}function l(e){var t={url:"/auth/post/edit",method:"post",data:e};return Object(i["a"])(t)}function s(e){var t={url:"/cfg/type/getServiceTypeList",method:"get",params:e};return Object(i["a"])(t)}function u(e){var t={url:"/auth/commission/getCommissionList",method:"get",params:e};return Object(i["a"])(t)}function c(e){var t={url:"/auth/commission/getCommission",method:"get",params:e};return Object(i["a"])(t)}function p(e){var t={url:"/auth/commission/getVersionList",method:"get",params:e};return Object(i["a"])(t)}function d(e){var t={url:"/auth/commission/saveCommission",method:"post",data:e};return Object(i["a"])(t)}function m(e){var t={url:"/auth/commission/deteleCommission",method:"delete",params:e};return Object(i["a"])(t)}function f(e){var t={url:"/setting/dict/item/type",method:"get",params:e};return Object(i["a"])(t)}}}]);