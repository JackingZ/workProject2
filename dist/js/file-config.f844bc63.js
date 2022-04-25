(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["file-config"],{4255:function(e,t,a){"use strict";a.d(t,"e",function(){return n}),a.d(t,"c",function(){return l}),a.d(t,"f",function(){return o}),a.d(t,"b",function(){return r}),a.d(t,"d",function(){return s}),a.d(t,"a",function(){return u}),a.d(t,"g",function(){return c});var i=a("b32d");function n(e){var t={url:"/setting/org/getOrgList",method:"get",params:e};return Object(i["a"])(t)}function l(){var e={url:"/setting/area/getCountryList",method:"get"};return Object(i["a"])(e)}function o(e){var t={url:"/setting/area/getStateByCountry",method:"get",params:{countryId:e}};return Object(i["a"])(t)}function r(e){var t={url:"/setting/area/getCityByState",method:"get",params:{stateId:e}};return Object(i["a"])(t)}function s(e){var t={url:"/setting/area/getCountyByCity",method:"get",params:{cityId:e}};return Object(i["a"])(t)}function u(e){var t={url:"/setting/org/deleteOrg",method:"delete",params:e};return Object(i["a"])(t)}function c(e){var t={url:"/setting/org/saveOrg",method:"post",data:e};return Object(i["a"])(t)}},b446:function(e,t,a){"use strict";var i=a("eb26"),n=a.n(i);n.a},daa0:function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticStyle:{display:"flex","flex-flow":"row nowrap","min-height":"inherit"}},[a("div",{staticClass:"dashboard-container",staticStyle:{flex:"1",overflow:"auto"}},[a("div",{staticClass:"app-container"},[a("head-info",{attrs:{info:"",title:"文件配置"}}),a("div",{staticClass:"app-panel"},[a("el-row",[a("el-col",{staticStyle:{"text-align":"right"},attrs:{span:24}},[a("el-button",{directives:[{name:"permission",rawName:"v-permission",value:["fileConfigAdd"],expression:"['fileConfigAdd']"}],staticStyle:{float:"left"},attrs:{type:"text",icon:"el-icon-circle-plus-outline"},on:{click:e.addFile}},[e._v("\n              新增文件\n            ")]),a("el-select",{staticStyle:{width:"130px","margin-right":"5px"},attrs:{size:"small",clearable:"",filterable:"",placeholder:"所属模块",loading:e.modeLoading},on:{focus:e.getModeList,change:e.handleModeChange},model:{value:e.selectValue.moduleCode,callback:function(t){e.$set(e.selectValue,"moduleCode",t)},expression:"selectValue.moduleCode"}},e._l(e.modeList,function(e){return a("el-option",{key:e.id,attrs:{label:e.moduleName,value:e.id}})}),1),a("el-select",{staticStyle:{width:"130px","margin-right":"5px"},attrs:{size:"small",clearable:"",filterable:"",placeholder:"文件类别",loading:e.typeLoading,disabled:!e.selectValue.moduleCode},on:{focus:e.getTypeList},model:{value:e.selectValue.typeCode,callback:function(t){e.$set(e.selectValue,"typeCode",t)},expression:"selectValue.typeCode"}},e._l(e.filetypeList,function(e){return a("el-option",{key:e.id,attrs:{label:e.fileType,value:e.id}})}),1),a("el-select",{staticStyle:{width:"130px","margin-right":"5px"},attrs:{size:"small",clearable:"",filterable:"",placeholder:"国家",loading:e.countryLoading,"filter-method":e.filterCountry},on:{focus:e.getCountryList,change:e.handleCountryChange},model:{value:e.selectValue.countryCode,callback:function(t){e.$set(e.selectValue,"countryCode",t)},expression:"selectValue.countryCode"}},e._l(e.countryList,function(e){return a("el-option",{key:e.id,attrs:{label:e.newName,value:e.id}})}),1),a("el-input",{staticStyle:{width:"250px","margin-right":"10px"},attrs:{maxlength:20,clearable:"",size:"small",placeholder:"请输入"},model:{value:e.selectValue.fileName,callback:function(t){e.$set(e.selectValue,"fileName",t)},expression:"selectValue.fileName"}},[a("template",{slot:"prepend"},[e._v("\n                文件名称\n              ")])],2),a("el-button",{directives:[{name:"permission",rawName:"v-permission",value:["fileConfigQuery"],expression:"['fileConfigQuery']"}],attrs:{type:"primary",size:"small"},on:{click:function(t){return e.loadData(1)}}},[e._v("\n              查询\n            ")])],1)],1),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticStyle:{width:"100%",margin:"10px 0"},attrs:{data:e.tableData,height:"calc(100vh - 313px)",border:""}},[a("el-table-column",{attrs:{prop:"moduleName",label:"所属模块",width:"140"}}),a("el-table-column",{attrs:{prop:"fileType",label:"文件类别",width:"140"}}),a("el-table-column",{attrs:{prop:"countryName",label:"国家名称","min-width":"120"}}),a("el-table-column",{attrs:{prop:"fileName",label:"文件名称","min-width":"120"}}),a("el-table-column",{attrs:{prop:"fileDesc",label:"文件描述",width:"120"}}),a("el-table-column",{attrs:{prop:"fileExt",label:"文件类型",width:"140"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v("\n                "+e._s(e.fileExtList.find(function(e){return e.value===t.row.fileExt}).label||t.row.fileExt)+"\n              ")])]}}])}),a("el-table-column",{attrs:{label:"是否必要",width:"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v("\n                "+e._s(0===t.row.ifNeed?"否":"是")+"\n              ")])]}}])}),a("el-table-column",{attrs:{label:"是否审核",width:"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v("\n                "+e._s(0===t.row.ifAudit?"否":"是")+"\n              ")])]}}])}),a("el-table-column",{attrs:{prop:"createTime",label:"添加时间",width:"180"}}),a("el-table-column",{attrs:{fixed:"right",width:"100",label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{directives:[{name:"permission",rawName:"v-permission",value:["fileConfigUpdate"],expression:"['fileConfigUpdate']"}],attrs:{type:"text"},on:{click:function(a){return e.editFile(t.row)}}},[e._v("\n                编辑\n              ")]),a("el-button",{directives:[{name:"permission",rawName:"v-permission",value:["fileConfigDel"],expression:"['fileConfigDel']"}],attrs:{type:"text"},on:{click:function(a){return e.deleteFile(t.row)}}},[e._v("\n                删除\n              ")])]}}])})],1),a("el-pagination",{staticStyle:{"text-align":"right"},attrs:{"current-page":e.pagination.page,"page-size":e.pagination.size,layout:"total, prev, pager, next",total:e.pagination.total},on:{"update:currentPage":function(t){return e.$set(e.pagination,"page",t)},"update:current-page":function(t){return e.$set(e.pagination,"page",t)},"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)],1)]),a("add-model",{ref:"addModel",on:{load:e.loadData}})],1)},n=[],l=(a("7f7f"),a("d225")),o=a("b0b4"),r=a("308d"),s=a("6bb5"),u=a("4e2b"),c=a("9ab4"),d=a("60a3"),f=a("ac1a"),m=a("4255"),p=a("b32d");function g(e){var t={url:"/setting/fc/page",method:"post",data:e};return Object(p["a"])(t)}function h(){var e={url:"/setting/fc/modules",method:"get"};return Object(p["a"])(e)}function y(e){var t={url:"/setting/fc/types",method:"get",params:e};return Object(p["a"])(t)}function v(e){var t={url:"/setting/fc/delete",method:"post",params:e};return Object(p["a"])(t)}function b(e){var t={url:"/setting/fc/save",method:"post",data:e};return Object(p["a"])(t)}function C(e){var t={url:"/setting/fc/update",method:"post",data:e};return Object(p["a"])(t)}function L(e){var t={url:"/setting/dict/item/type",method:"get",params:e};return Object(p["a"])(t)}var x=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{title:e.isEdit?"编辑文件配置":"新增文件配置",visible:e.visible,"close-on-click-modal":!1,width:"600px"},on:{"update:visible":function(t){e.visible=t}}},[a("div",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}]},[a("el-form",{ref:"form",staticStyle:{padding:"0 40px 0 20px"},attrs:{model:e.form,rules:e.formRules,"label-position":"right","label-width":"100px",size:"small"}},[a("el-form-item",{attrs:{label:"国家",prop:"countryCode"}},[a("el-select",{staticStyle:{width:"100%"},attrs:{size:"small",clearable:"",filterable:"",placeholder:"国家",loading:e.countryLoading,disabled:e.isEdit,"filter-method":e.filterCountry},on:{focus:e.getCountryList,change:e.handleCountryChange},model:{value:e.form.countryCode,callback:function(t){e.$set(e.form,"countryCode",t)},expression:"form.countryCode"}},e._l(e.countryList,function(e){return a("el-option",{key:e.id,attrs:{label:e.newName,value:e.id}})}),1)],1),a("el-form-item",{attrs:{label:"所属模块",prop:"moduleCode"}},[a("el-select",{staticStyle:{width:"100%"},attrs:{size:"small",clearable:"",filterable:"",placeholder:"所属模块",loading:e.modeLoading,disabled:e.isEdit},on:{focus:e.getModeList,change:e.modeChange},model:{value:e.form.moduleCode,callback:function(t){e.$set(e.form,"moduleCode",t)},expression:"form.moduleCode"}},e._l(e.modeList,function(e){return a("el-option",{key:e.id,attrs:{label:e.moduleName,value:e.id}})}),1)],1),a("el-form-item",{attrs:{label:"文件类别",prop:"typeCode"}},[a("el-select",{staticStyle:{width:"100%"},attrs:{size:"small",clearable:"",filterable:"",placeholder:"文件类别",loading:e.typeLoading,disabled:e.isEdit},on:{focus:e.getTypeList},model:{value:e.form.typeCode,callback:function(t){e.$set(e.form,"typeCode",t)},expression:"form.typeCode"}},e._l(e.filetypeList,function(e){return a("el-option",{key:e.id,attrs:{label:e.fileType,value:e.id}})}),1)],1),a("el-form-item",{attrs:{label:"文件名称",prop:"dictId"}},[a("el-select",{staticStyle:{width:"100%"},attrs:{size:"small",clearable:"",filterable:"",placeholder:"文件名称",loading:e.loadFileList,disabled:e.isEdit},on:{focus:e.getFileNameList,change:e.handleChange},model:{value:e.form.dictId,callback:function(t){e.$set(e.form,"dictId",t)},expression:"form.dictId"}},e._l(e.fileNameList,function(e){return a("el-option",{key:e.id,attrs:{label:e.label,value:e.value}})}),1)],1),e._e(),a("el-form-item",{attrs:{label:"文件类型",prop:"fileExt"}},[a("el-select",{staticStyle:{width:"100%"},attrs:{size:"small",clearable:"",filterable:"",placeholder:"请选择"},model:{value:e.form.fileExt,callback:function(t){e.$set(e.form,"fileExt",t)},expression:"form.fileExt"}},e._l(e.fileExtList,function(e){return a("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}),1)],1),a("el-form-item",{attrs:{label:"是否必要",prop:"ifNeed"}},[a("el-radio-group",{model:{value:e.form.ifNeed,callback:function(t){e.$set(e.form,"ifNeed",t)},expression:"form.ifNeed"}},[a("el-radio",{attrs:{label:0}},[e._v("\n            否\n          ")]),a("el-radio",{attrs:{label:1}},[e._v("\n            是\n          ")])],1)],1),a("el-form-item",{attrs:{label:"是否审核",prop:"ifAudit"}},[a("el-radio-group",{model:{value:e.form.ifAudit,callback:function(t){e.$set(e.form,"ifAudit",t)},expression:"form.ifAudit"}},[a("el-radio",{attrs:{label:0}},[e._v("\n            否\n          ")]),a("el-radio",{attrs:{label:1}},[e._v("\n            是\n          ")])],1)],1)],1)],1),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:e.cancel}},[e._v("\n      取 消\n    ")]),a("el-button",{attrs:{type:"primary"},on:{click:e.submit}},[e._v("\n      确 定\n    ")])],1)])},k=[],w=(a("8e6e"),a("ac6a"),a("456d"),a("bd86"));a("7514");function O(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,i)}return a}function N(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?O(a,!0).forEach(function(t){Object(w["a"])(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):O(a).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}var j=function(e){function t(){var e;return Object(l["a"])(this,t),e=Object(r["a"])(this,Object(s["a"])(t).apply(this,arguments)),e.modeLoading=!1,e.typeLoading=!1,e.loadFileList=!1,e.countryLoading=!1,e.isEdit=!1,e.loading=!1,e.visible=!1,e.modeList=[],e.fileNameList=[],e.allCountryList=[],e.countryList=[],e.filetypeList=[],e.fileExtList=[{label:"excel",value:1},{label:"word",value:2},{label:"pdf",value:3},{label:"text",value:4},{label:"图片",value:5},{label:"其他",value:6}],e.form={countryCode:"",countryName:"",fileDesc:"",fileExt:void 0,fileName:"",ifAudit:0,ifNeed:0,moduleCode:"",moduleName:"",fileType:"",typeCode:"",createTime:void 0,delFlag:void 0,id:void 0,dictId:void 0},e.formRules={countryCode:{required:!0,message:"请选择国家",trigger:"change"},moduleCode:{required:!0,message:"请选择所属模块",trigger:"change"},typeCode:{required:!0,message:"请选择文件类别",trigger:"change"},dictId:{required:!0,message:"请输入文件名称",trigger:"change"},fileExt:{required:!0,message:"请选择文件类型",trigger:"change"},ifNeed:{required:!0,message:"请选择是否必要",trigger:"change"},ifAudit:{required:!0,message:"请选择是否审核",trigger:"change"}},e}return Object(u["a"])(t,e),Object(o["a"])(t,[{key:"handleChange",value:function(e){if(e){var t=this.fileNameList.find(function(t){return t.value===e});this.form.fileDesc=t.description,this.form.fileName=t.label}else this.form.fileDesc="",this.form.fileName=""}},{key:"getFileNameList",value:function(){var e=this,t={type:"file_names"};this.loadFileList=!0,L(t).then(function(t){e.loadFileList=!1,t.success&&(e.fileNameList=t.data||[],e.fileNameList=e.fileNameList.map(function(e){return e.value=1*e.value,e}))}).catch(function(t){return e.loadFileList=!1,t})}},{key:"handleCountryChange",value:function(e){if(e){var t=this.allCountryList.find(function(t){return t.id===e});t&&(this.form.countryName=t.name)}else this.form.countryName=""}},{key:"filterCountry",value:function(e){if(e.trim()){var t=e.toUpperCase();this.countryList=this.allCountryList.filter(function(e){return-1!==(e.name+"-"+e.alias).toUpperCase().indexOf(t)})}else this.countryList=this.allCountryList}},{key:"getCountryList",value:function(){var e=this;this.countryLoading=!0,Object(m["c"])().then(function(t){if(e.countryLoading=!1,t.success){var a=t.data.result.map(function(e){return e.newName=e.name+"-"+e.alias,e});e.allCountryList=a,e.countryList=a}}).catch(function(t){return e.countryLoading=!1,t})}},{key:"edit",value:function(e){var t=this;C(e).then(function(e){t.loading=!1,e.success?(t.$message.success("编辑成功"),t.visible=!1,t.reset(),t.$emit("load")):t.$message.error("编辑失败")}).catch(function(e){return t.loading=!1,t.$message.error("编辑失败"),e})}},{key:"add",value:function(e){var t=this;b(e).then(function(e){t.loading=!1,e.success?(t.$message.success("添加成功"),t.visible=!1,t.reset(),t.$emit("load",1)):t.$message.error("添加失败")}).catch(function(e){return t.loading=!1,t.$message.error("添加失败"),e})}},{key:"show",value:function(e){this.visible=!0,this.reset(),e?(this.form=N({},e),this.isEdit=!0,this.getModeList(),this.getTypeList(),this.getCountryList(),this.getFileNameList()):this.isEdit=!1}},{key:"reset",value:function(){var e=this;this.form={countryCode:"",countryName:"",fileDesc:"",fileExt:void 0,fileName:"",ifAudit:0,ifNeed:0,moduleCode:"",moduleName:"",fileType:"",typeCode:"",createTime:void 0,delFlag:void 0,id:void 0},this.$nextTick(function(){var t=e.$refs.form;t.clearValidate()})}},{key:"submit",value:function(){var e=this,t=this.$refs.form;t.validate(function(t){if(t){var a=N({},e.form),i=e.modeList.find(function(e){return e.id===a.moduleCode});a.moduleName=i.moduleName;var n=e.filetypeList.find(function(e){return e.id===a.typeCode});a.fileType=n.fileType,e.loading=!0,e.isEdit?e.edit(a):e.add(a)}})}},{key:"cancel",value:function(){this.visible=!1,this.reset()}},{key:"modeChange",value:function(e){this.form.typeCode=void 0}},{key:"getModeList",value:function(){var e=this;this.modeLoading=!0,h().then(function(t){e.modeLoading=!1,t.success&&(e.modeList=t.data)}).catch(function(t){return e.modeLoading=!1,t})}},{key:"getTypeList",value:function(){var e=this;if(this.form.moduleCode){var t={moduleId:this.form.moduleCode};this.typeLoading=!0,y(t).then(function(t){e.typeLoading=!1,t.success&&(e.filetypeList=t.data)}).catch(function(t){return e.typeLoading=!1,t})}else this.$message.warning("请选择所属模块")}}]),t}(d["e"]);j=c["a"]([Object(d["a"])({name:"addModel",components:{},props:{countryInfo:{type:Object,default:function(){return{}}}}})],j);var _=j,$=_,E=a("2877"),S=Object(E["a"])($,x,k,!1,null,"3c4e3fa9",null),D=S.exports,V=function(e){function t(){var e;return Object(l["a"])(this,t),e=Object(r["a"])(this,Object(s["a"])(t).apply(this,arguments)),e.loading=!1,e.modeLoading=!1,e.typeLoading=!1,e.countryLoading=!1,e.tableData=[],e.countryList=[],e.allCountryList=[],e.modeList=[],e.filetypeList=[],e.fileExtList=[{label:"excel",value:1},{label:"word",value:2},{label:"pdf",value:3},{label:"text",value:4},{label:"图片",value:5},{label:"其他",value:6}],e.selectValue={moduleCode:"",typeCode:"",fileName:"",countryCode:""},e.pagination={page:1,total:0,size:10},e}return Object(u["a"])(t,e),Object(o["a"])(t,[{key:"handleCountryChange",value:function(e){this.loadData(1)}},{key:"handleModeChange",value:function(e){this.selectValue.typeCode="",this.filetypeList=[]}},{key:"filterCountry",value:function(e){if(e.trim()){var t=e.toUpperCase();this.countryList=this.allCountryList.filter(function(e){return-1!==(e.name+"-"+e.alias).toUpperCase().indexOf(t)})}else this.countryList=this.allCountryList}},{key:"getCountryList",value:function(){var e=this;this.countryLoading=!0,Object(m["c"])().then(function(t){if(e.countryLoading=!1,t.success){var a=t.data.result.map(function(e){return e.newName=e.name+"-"+e.alias,e});e.allCountryList=a,e.countryList=a}}).catch(function(t){return e.countryLoading=!1,t})}},{key:"loadData",value:function(e){var t=this;1===e&&(this.pagination.page=1);var a={model:{countryCode:this.selectValue.countryCode,fileName:this.selectValue.fileName,moduleCode:this.selectValue.moduleCode,typeCode:this.selectValue.typeCode},page:this.pagination.page,size:this.pagination.size};this.loading=!0,g(a).then(function(e){t.loading=!1,e.success&&(t.tableData=e.data.result,t.pagination.total=e.data.total)}).catch(function(e){return t.loading=!1,e})}},{key:"editFile",value:function(e){var t=this.$refs.addModel;t.show(e)}},{key:"addFile",value:function(){var e=this.$refs.addModel;e.show()}},{key:"deleteFile",value:function(e){var t=this,a={id:e.id};this.$confirm("请确认是否删除该条数据?","温馨提示",{confirmButtonText:"确定",closeOnClickModal:!1,cancelButtonText:"取消",type:"warning"}).then(function(){t.loading=!0,v(a).then(function(e){t.$message({type:"success",message:"删除成功"}),t.loadData(1)}).catch(function(e){return t.loading=!1,e})}).catch(function(){return!1})}},{key:"handleSizeChange",value:function(e){this.pagination.size=e,this.loadData()}},{key:"handleCurrentChange",value:function(e){this.pagination.page=e,this.loadData()}},{key:"getModeList",value:function(){var e=this;this.modeLoading=!0,h().then(function(t){e.modeLoading=!1,t.success&&(e.modeList=t.data)}).catch(function(t){return e.modeLoading=!1,t})}},{key:"getTypeList",value:function(){var e=this,t={moduleId:this.selectValue.moduleCode};this.typeLoading=!0,y(t).then(function(t){e.typeLoading=!1,t.success&&(e.filetypeList=t.data)}).catch(function(t){return e.typeLoading=!1,t})}},{key:"created",value:function(){this.loadData(),this.getCountryList()}},{key:"labelPosition",get:function(){var e=f["a"].language;return e&&"en"===e?"top":"left"}},{key:"lang",get:function(){var e=f["a"].language;return e||"en"}}]),t}(d["e"]);V=c["a"]([Object(d["a"])({name:"",components:{addModel:D},props:{}})],V);var z=V,T=z,F=(a("b446"),Object(E["a"])(T,i,n,!1,null,"8dd3d182",null));t["default"]=F.exports},eb26:function(e,t,a){}}]);