(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["service-group"],{6676:function(e,t,i){"use strict";var n=i("a181"),r=i.n(n);r.a},"727c":function(e,t,i){},a181:function(e,t,i){},c21a:function(e,t,i){"use strict";i.r(t);var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"app-container",staticStyle:{width:"100%"}},[i("head-info",{attrs:{info:"",title:"服务组"}}),i("div",{staticClass:"app-panel"},[i("el-row",[i("el-col",{attrs:{span:2}},[i("el-button",{staticStyle:{"margin-left":"10px"},attrs:{type:"text",icon:"el-icon-circle-plus-outline"},on:{click:e.handleAdd}},[e._v("\n          新增\n        ")])],1),i("el-col",{staticStyle:{"text-align":"right"},attrs:{span:22}},[i("el-button",{attrs:{type:"primary",size:"small"},on:{click:function(t){return e.queryAll(1)}}},[e._v("\n          查询\n        ")])],1)],1),i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticStyle:{width:"100%",margin:"10px 0"},attrs:{data:e.tableData,height:"calc(100vh - 313px)",border:""}},[i("el-table-column",{attrs:{prop:"name",label:"服务组名称",width:"200","show-overflow-tooltip":""}}),i("el-table-column",{attrs:{prop:"countryName",label:"目的国",width:"200","show-overflow-tooltip":""}}),i("el-table-column",{attrs:{prop:"lscName",label:"服务","min-width":"200","show-overflow-tooltip":""}}),i("el-table-column",{attrs:{label:"开关",width:"80","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[i("el-switch",{staticClass:"switchStyle",attrs:{value:t.row.status,"active-value":"1","inactive-value":"0"},on:{input:function(i){return e.onStatus(t.row,i)}}})]}}])}),i("el-table-column",{attrs:{fixed:"right",label:"操作",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("el-button",{attrs:{type:"text"},on:{click:function(i){return e.handleEdit(t.row)}}},[e._v("\n            编辑\n          ")]),i("el-button",{attrs:{type:"text"},on:{click:function(i){return e.handleDelete(t.row)}}},[e._v("\n            删除\n          ")])]}}])})],1),i("el-pagination",{staticStyle:{"text-align":"right"},attrs:{"current-page":e.pagination.page,"page-size":e.pagination.size,layout:"total, prev, pager, next",total:e.pagination.total},on:{"update:currentPage":function(t){return e.$set(e.pagination,"page",t)},"update:current-page":function(t){return e.$set(e.pagination,"page",t)},"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1),i("group-form",{ref:"groupForm",attrs:{"is-edit":e.isEdit},on:{"save-success":e.queryAll}})],1)},r=[],a=i("d225"),s=i("b0b4"),o=i("308d"),c=i("6bb5"),l=i("4e2b"),u=i("9ab4"),d=i("60a3"),p=i("b32d");function f(e){var t={url:"/cfg/sale/getSaleGroupList",method:"post",data:e};return Object(p["a"])(t)}function v(e){var t={url:"/cfg/sale/saveSaleGroup",method:"post",data:e};return Object(p["a"])(t)}function h(e){var t={url:"/cfg/sale/getSaleGroupById",method:"get",params:e};return Object(p["a"])(t)}function m(e){var t={url:"/cfg/sale/setSaleGroupStatus",method:"post",params:e};return Object(p["a"])(t)}function g(e){var t={url:"/cfg/sale/deleteSaleGroup",method:"delete",params:e};return Object(p["a"])(t)}function y(){var e={url:"/setting/area/getCountryList",method:"get"};return Object(p["a"])(e)}function b(e){var t={url:"/cfg/lsc/condition",method:"post",data:e};return Object(p["a"])(t)}function w(e){var t={url:"/cfg/type/getServiceSubtypeList",method:"GET",params:e};return Object(p["a"])(t)}var O=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("el-dialog",{attrs:{title:e.isEdit?"编辑组":"新增组",visible:e.visible,"close-on-click-modal":!1,width:"500px"},on:{close:e.close}},[i("div",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}]},[i("el-form",{ref:"form",attrs:{model:e.form,rules:e.rules,"label-width":"100px",size:"small"}},[i("el-form-item",{attrs:{label:"服务组名称",prop:"name"}},[i("el-input",{staticStyle:{width:"100%"},attrs:{clearable:"",size:"small",placeholder:"请输入"},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1),i("el-form-item",{attrs:{label:"国家",prop:"countryId"}},[i("el-select",{staticStyle:{width:"100%"},attrs:{placeholder:"请选择",clearable:"",filterable:"","filter-method":e.filterCountry,size:"small",loading:e.selectLoading},on:{focus:e.getCountryList,change:e.countryChange},model:{value:e.form.countryId,callback:function(t){e.$set(e.form,"countryId",t)},expression:"form.countryId"}},e._l(e.countryList,function(e){return i("el-option",{key:e.id,attrs:{label:e.name+"-"+e.alias,value:e.id}})}),1)],1),i("el-form-item",{staticClass:"is-required",attrs:{label:"服务"}},[i("el-input",{attrs:{size:"small",placeholder:"请选择",disabled:""},model:{value:e.form.serviceNames,callback:function(t){e.$set(e.form,"serviceNames",t)},expression:"form.serviceNames"}},[i("el-button",{attrs:{slot:"append",icon:"el-icon-search"},on:{click:e.showService},slot:"append"})],1)],1)],1)],1),i("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{attrs:{disabled:e.loading,size:"small"},on:{click:e.close}},[e._v("\n      取 消\n    ")]),i("el-button",{attrs:{disabled:e.loading,type:"primary",size:"small"},on:{click:e.submit}},[e._v("\n      保 存\n    ")])],1),i("el-dialog",{attrs:{title:"关联服务",visible:e.serviceVisible,"close-on-click-modal":!1,"append-to-body":"",width:"960px"},on:{"update:visible":function(t){e.serviceVisible=t},close:e.closeServiceDialog}},[i("div",{directives:[{name:"loading",rawName:"v-loading",value:e.serviceLoading,expression:"serviceLoading"}]},[i("div",{staticStyle:{"margin-bottom":"10px"}},[i("span",[e._v("业务类型：")]),i("el-radio-group",{attrs:{size:"small"},on:{change:e.typeChange},model:{value:e.form.subtypeId,callback:function(t){e.$set(e.form,"subtypeId",t)},expression:"form.subtypeId"}},e._l(e.subtypeList,function(t){return i("el-radio-button",{key:t.id,attrs:{label:t.id}},[e._v("\n            "+e._s(t.name)+"\n          ")])}),1)],1),i("el-transfer",{staticStyle:{height:"500px"},attrs:{filterable:"","filter-method":e.filterMethod,titles:["选择关联服务","已关联服务"],props:{key:"id",label:"name"},"filter-placeholder":"输入搜索",data:e.serviceList},model:{value:e.serviceOption,callback:function(t){e.serviceOption=t},expression:"serviceOption"}}),i("div",{staticStyle:{"text-align":"right",margin:"20px 40px 0"},attrs:{slot:"footer"},slot:"footer"},[i("el-button",{attrs:{size:"small"},on:{click:e.closeServiceDialog}},[e._v("\n          取 消\n        ")]),i("el-button",{attrs:{type:"primary",size:"small"},on:{click:e.submitService}},[e._v("\n          确 定\n        ")])],1)],1)])],1)},k=[],x=(i("8e6e"),i("ac6a"),i("456d"),i("6762"),i("2fdb"),i("96cf"),i("3b8d")),L=i("bd86"),I=i("a8db");i("7514"),i("7f7f");function j(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),i.push.apply(i,n)}return i}function S(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?j(i,!0).forEach(function(t){Object(L["a"])(e,t,i[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):j(i).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))})}return e}var C=function(e){function t(){var e;return Object(a["a"])(this,t),e=Object(o["a"])(this,Object(c["a"])(t).apply(this,arguments)),e.visible=!1,e.serviceVisible=!1,e.loading=!1,e.selectLoading=!1,e.serviceLoading=!1,e.countryList=[],e.allCountryList=[],e.serviceList=[],e.subtypeList=[],e.serviceItem=[],e.serviceOption=[],e.serviceType="",e.serviceCountry="",e.form={name:"",status:"1",countryId:"",countryName:"",serviceIds:[],serviceNames:"",subtypeId:"",subtypeName:""},e.editRow={},e.rules={name:{required:!0,message:"请输入服务组名称",trigger:"blur"},countryId:{required:!0,message:"请选择目的国",trigger:"change"},serviceIds:{required:!0,message:"请选择关联服务",trigger:"blur"}},e}return Object(l["a"])(t,e),Object(s["a"])(t,[{key:"filterCountry",value:function(e){this.countryList=e?this.allCountryList.filter(function(t){var i="".concat(t.name,"-").concat(t.alias);return-1!==i.toUpperCase().indexOf(e.toUpperCase())}):this.allCountryList}},{key:"submit",value:function(){var e=this,t=this.$refs.form;t.validate(function(t){if(t){if(e.form.serviceIds.length<=0)return void e.$message.error("请选择关联服务");var i=e.countryList.find(function(t){return t.id===e.form.countryId})||{},n=e.subtypeList.find(function(t){return t.id===e.form.subtypeId})||{},r=e.form,a=r.serviceIds,s=(r.serviceNames,r.status),o=Object(I["a"])(r,["serviceIds","serviceNames","status"]),c=S({},o,{status:s||"1",countryName:i.name||"",subtypeName:n.name||"",lscIds:a});e.loading=!0,v(c).then(function(){e.loading=!1,e.$message.success("保存成功"),e.close(),e.$emit("save-success")}).catch(function(){e.loading=!1})}})}},{key:"countryChange",value:function(){var e=Object(x["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(this.form.serviceIds=[],this.form.serviceNames="",this.serviceOption=[],!this.form.subtypeId){e.next=6;break}return e.next=6,this.getPrivatelineList();case 6:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}()},{key:"typeChange",value:function(){var e=Object(x["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return this.serviceOption=[],this.form.id&&this.serviceType===this.form.subtypeId&&this.serviceCountry===this.form.countryId&&(this.serviceOption=this.serviceItem.map(function(e){return e.id})),e.next=4,this.getPrivatelineList();case 4:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}()},{key:"showService",value:function(){this.serviceVisible=!0,this.serviceOption=this.form.serviceIds,this.getSubtypeList()}},{key:"getPrivatelineList",value:function(){var e=Object(x["a"])(regeneratorRuntime.mark(function e(){var t,i=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t={subtypeId:this.form.subtypeId,countryId:this.form.countryId},this.serviceLoading=!0,e.next=4,b(t).then(function(e){i.serviceLoading=!1;var t=e.data||[];i.serviceList=t.filter(function(e){return"1"===e.status}).map(function(e){return S({},e,{disabled:"1"===e.saleCreate&&!i.serviceOption.includes(e.id)})})}).catch(function(){i.serviceLoading=!1,i.serviceList=[]});case 4:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}()},{key:"getSubtypeList",value:function(){var e=this;this.serviceLoading=!0;var t={typeId:"05"};w(t).then(function(){var t=Object(x["a"])(regeneratorRuntime.mark(function t(i){var n;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(e.serviceLoading=!1,n=i.data||[],e.subtypeList=n.filter(function(e){return"3"!==e.id}),!e.subtypeList.length||e.form.subtypeId){t.next=7;break}return e.form.subtypeId=e.subtypeList[0].id,t.next=7,e.getPrivatelineList();case 7:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}()).catch(function(t){return e.serviceLoading=!1,t})}},{key:"getCountryList",value:function(){var e=Object(x["a"])(regeneratorRuntime.mark(function e(){var t=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return this.selectLoading=!0,e.next=3,y().then(function(e){t.selectLoading=!1;var i=e.data||{};t.countryList=i.result||[],t.allCountryList=i.result||[]}).catch(function(e){return t.selectLoading=!1,t.countryList=[],e});case 3:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}()},{key:"resetForm",value:function(){this.form={name:"",status:"1",countryId:"",countryName:"",serviceIds:[],serviceNames:"",subtypeId:"",subtypeName:""};var e=this.$refs.form;e.resetFields()}},{key:"filterMethod",value:function(e,t){var i=t.name||"";return i.indexOf(e)>-1}},{key:"close",value:function(){this.serviceType="",this.serviceCountry="",this.serviceOption=[],this.serviceItem=[],this.resetForm(),this.visible=!1}},{key:"closeServiceDialog",value:function(){this.serviceVisible=!1,this.serviceOption=[]}},{key:"submitService",value:function(){var e=this;this.form.serviceIds=this.serviceOption,this.form.serviceNames=this.form.serviceIds.map(function(t){var i=e.serviceList.find(function(e){return t===e.id})||{};return i.name||""}).join(","),this.serviceVisible=!1}},{key:"getLscGroupItems",value:function(){var e=Object(x["a"])(regeneratorRuntime.mark(function e(){var t=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,h({id:this.form.id}).then(function(e){var i=e.data||[];t.serviceItem=JSON.parse(JSON.stringify(i)),t.serviceOption=t.serviceItem.map(function(e){return e.id}),t.form.serviceIds=i.map(function(e){return e.id}),t.form.serviceNames=i.map(function(e){return e.name}).join(",")}).catch(function(){t.form.serviceIds=[],t.form.serviceNames=""});case 2:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}()},{key:"show",value:function(){var e=Object(x["a"])(regeneratorRuntime.mark(function e(t){var i;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(this.visible=!0,!t){e.next=15;break}return t.lscId,t.lscName,i=Object(I["a"])(t,["lscId","lscName"]),this.form=S({},i),this.serviceType=t.subtypeId,this.serviceCountry=t.countryId,this.loading=!0,e.next=9,this.getLscGroupItems();case 9:return e.next=11,this.getPrivatelineList();case 11:return e.next=13,this.getCountryList();case 13:this.getSubtypeList(),this.loading=!1;case 15:case"end":return e.stop()}},e,this)}));function t(t){return e.apply(this,arguments)}return t}()}]),t}(d["e"]);C=u["a"]([Object(d["a"])({name:"",props:{isEdit:{type:Boolean,default:!1}}})],C);var N=C,$=N,z=(i("d395"),i("2877")),_=Object(z["a"])($,O,k,!1,null,"ff642562",null),R=_.exports,q=function(e){function t(){var e;return Object(a["a"])(this,t),e=Object(o["a"])(this,Object(c["a"])(t).apply(this,arguments)),e.loading=!1,e.isEdit=!1,e.tableData=[],e.pagination={page:1,size:10,total:0},e}return Object(l["a"])(t,e),Object(s["a"])(t,[{key:"goBack",value:function(){this.$emit("back")}},{key:"onStatus",value:function(e,t){var i=this;this.$confirm("请确认是否".concat("0"===t?"关闭":"开启","该条数据?"),"温馨提示",{confirmButtonText:"确定",closeOnClickModal:!1,cancelButtonText:"取消",type:"warning"}).then(function(){i.loading=!0;var n={id:e.id,status:t};m(n).then(function(){i.loading=!1,i.$message.success("操作成功"),i.queryAll()}).catch(function(){i.loading=!1,i.queryAll()})}).catch(function(){i.queryAll()})}},{key:"handleAdd",value:function(){this.isEdit=!1;var e=this.$refs.groupForm;e.show()}},{key:"handleEdit",value:function(e){this.isEdit=!0;var t=this.$refs.groupForm;t.show(e)}},{key:"handleDelete",value:function(e){var t=this;this.$confirm("请确认是否删除该条数据?","温馨提示",{confirmButtonText:"确定",closeOnClickModal:!1,cancelButtonText:"取消",type:"warning"}).then(function(){var i={id:e.id};t.loading=!0,g(i).then(function(){t.loading=!1,t.$message.success("删除成功"),t.queryAll(1)}).catch(function(){t.loading=!1})}).catch(function(e){return e})}},{key:"handleSizeChange",value:function(e){this.pagination.size=e,this.queryAll()}},{key:"handleCurrentChange",value:function(e){this.pagination.page=e,this.queryAll()}},{key:"queryAll",value:function(e){var t=this;1===e&&(this.pagination.page=1);var i={model:{},page:this.pagination.page,size:this.pagination.size};this.loading=!0,f(i).then(function(e){t.loading=!1;var i=e.data||{};t.tableData=i.result||[],t.pagination.total=i.total}).catch(function(){t.loading=!1,t.tableData=[],t.pagination.total=0})}},{key:"created",value:function(){this.queryAll()}}]),t}(d["e"]);q=u["a"]([Object(d["a"])({name:"",components:{GroupForm:R}})],q);var P=q,D=P,E=(i("6676"),Object(z["a"])(D,n,r,!1,null,"08247ce4",null));t["default"]=E.exports},d395:function(e,t,i){"use strict";var n=i("727c"),r=i.n(n);r.a}}]);