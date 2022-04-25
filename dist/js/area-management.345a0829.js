(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["area-management"],{"1e9b":function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABHNCSVQICAgIfAhkiAAAAGRJREFUGJXF0LEJgFAQA9Ccdm7yCxewdBixdBMb4W/iKsmfRfGshN+c2Hld4JHAAcFJGkn2T24DlAGcKaU9KoKkLGkOwSfk7k0pZSM5RaYBADO73P0ws+51sppeJS0/Y5JD/fAbvDw8mbaIFiYAAAAASUVORK5CYII="},db9a:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{directives:[{name:"loading",rawName:"v-loading",value:t.sideLoading,expression:"sideLoading"}],staticStyle:{display:"flex","flex-flow":"row nowrap","min-height":"inherit"}},[n("app-slide",{attrs:{width:"350","is-active":t.isActive}},[n("div",{staticClass:"tree-title"},[n("el-row",[n("el-col",{attrs:{span:10}},[t._v("\n          行政区域\n        ")]),n("el-col",{attrs:{span:14}},[n("el-input",{attrs:{size:"small",placeholder:"关键字"},model:{value:t.filterText,callback:function(e){t.filterText=e},expression:"filterText"}},[n("el-button",{attrs:{slot:"append",size:"small",icon:"el-icon-search"},on:{click:t.areaFilter},slot:"append"})],1)],1)],1)],1),n("el-tree",{ref:"treeList",staticClass:"filter-tree",attrs:{"node-key":"id",data:t.treeList,props:t.treeProps,"expand-on-click-node":!1,"filter-node-method":t.filterNode,"default-expanded-keys":[0],"empty-text":"暂无数据",accordion:"","highlight-current":""},on:{"node-click":t.onTreeClick}})],1),n("div",{staticStyle:{display:"flex","align-items":"center"}},[n("div",{staticClass:"arrow-btn",on:{click:t.toggle}},[n("img",{class:{arrow:!t.isActive},attrs:{src:a("1e9b"),alt:""}})])]),n("div",{staticClass:"dashboard-container",staticStyle:{flex:"1",overflow:"auto"}},[n("div",{staticClass:"app-container"},[n("head-info",{attrs:{title:"地区管理",info:"点击左侧的行政区域节点"}}),n("div",{staticClass:"app-panel"},[n("el-row",[n("el-col",{attrs:{span:18}},[n("el-button",{directives:[{name:"permission",rawName:"v-permission",value:["countryStateAdd"],expression:"['countryStateAdd']"}],attrs:{type:"text",icon:"el-icon-circle-plus-outline",disabled:!t.isAddBtnShow},on:{click:t.add}},[t._v("\n              新增\n            ")]),n("el-input",{staticStyle:{width:"280px","margin-left":"30px"},attrs:{placeholder:"地区代码/地区名称/地区简称/英文名称",clearable:"",size:"small"},model:{value:t.search,callback:function(e){t.search=e},expression:"search"}})],1),n("el-col",{staticStyle:{"text-align":"right","padding-right":"20px"},attrs:{span:6}},[n("el-button",{attrs:{type:"text",disabled:!t.isAddBtnShow},on:{click:t.addBatch}},[t._v("\n              批量新增\n            ")])],1)],1),n("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticStyle:{width:"100%",margin:"10px 0"},attrs:{data:t.tableData,height:"calc(100vh - 295px)",border:""}},[n("el-table-column",{attrs:{label:"地区代码",width:"150"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n              "+t._s(e.row.id)+"\n            ")]}}])}),n("el-table-column",{attrs:{label:"地区名称","min-width":"230"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n              "+t._s(e.row.name)+"\n            ")]}}])}),n("el-table-column",{attrs:{label:"地区简称","min-width":"180"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n              "+t._s(e.row.abbr)+"\n            ")]}}])}),n("el-table-column",{attrs:{label:"英文名称","min-width":"230"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n              "+t._s(e.row.alias)+"\n            ")]}}])}),n("el-table-column",{attrs:{label:"操作",width:"150"},scopedSlots:t._u([{key:"default",fn:function(e){var a=e.row;return[n("el-button",{directives:[{name:"permission",rawName:"v-permission",value:["countryStateUpdate"],expression:"['countryStateUpdate']"}],attrs:{type:"text",size:"medium"},on:{click:function(e){return t.edit(a)}}},[t._v("\n                编辑\n              ")]),n("el-button",{directives:[{name:"permission",rawName:"v-permission",value:["countryStateDel"],expression:"['countryStateDel']"}],attrs:{type:"text",size:"medium"},on:{click:function(e){return t.del(a)}}},[t._v("\n                删除\n              ")])]}}])})],1),n("el-pagination",{staticStyle:{"text-align":"right"},attrs:{"current-page":t.page,"page-size":t.size,layout:"total, prev, pager, next",total:t.total},on:{"update:currentPage":function(e){t.page=e},"update:current-page":function(e){t.page=e},"current-change":t.handleCurrentChange}})],1)],1)]),n("el-dialog",{attrs:{title:"行政地区",visible:t.isDialogFormShow,"close-on-click-modal":!1,width:"600px"},on:{"update:visible":function(e){t.isDialogFormShow=e},closed:t.cancel}},[n("div",{directives:[{name:"loading",rawName:"v-loading",value:t.dialogLoading,expression:"dialogLoading"}]},[n("el-form",{directives:[{name:"loading",rawName:"v-loading",value:t.dialogLoading,expression:"dialogLoading"}],ref:"editForm",staticStyle:{"padding-right":"20px"},attrs:{model:t.form,rules:t.formRules,"label-width":"100px","label-position":"right",size:"small"}},[n("el-form-item",{attrs:{prop:"id",label:"地区代码"}},[n("el-input",{attrs:{autocomplete:"off",disabled:t.isEdit,maxlength:30,"show-word-limit":""},model:{value:t.form.id,callback:function(e){t.$set(t.form,"id",e)},expression:"form.id"}})],1),n("el-form-item",{attrs:{prop:"name",label:"地区名称"}},[n("el-input",{attrs:{autocomplete:"off",maxlength:50},model:{value:t.form.name,callback:function(e){t.$set(t.form,"name",e)},expression:"form.name"}})],1),n("el-form-item",{attrs:{prop:"abbr",label:"地区简称"}},[n("el-input",{attrs:{autocomplete:"off",maxlength:10},model:{value:t.form.abbr,callback:function(e){t.$set(t.form,"abbr",e)},expression:"form.abbr"}})],1),n("el-form-item",{attrs:{prop:"alias",label:"英文名称"}},[n("el-input",{attrs:{autocomplete:"off",maxlength:50},model:{value:t.form.alias,callback:function(e){t.$set(t.form,"alias",e)},expression:"form.alias"}})],1)],1),n("div",{staticStyle:{"text-align":"right",padding:"10px 20px 0 0"},attrs:{slot:"footer"},slot:"footer"},[n("el-button",{on:{click:t.cancel}},[t._v("\n          取 消\n        ")]),n("el-button",{attrs:{type:"primary"},on:{click:t.saveConfirm}},[t._v("\n          确 定\n        ")])],1)],1)]),n("el-dialog",{attrs:{title:"批量新增行政区域",visible:t.dialogVisible,"close-on-click-modal":!1,width:"1000px"},on:{"update:visible":function(e){t.dialogVisible=e},close:t.cancelBatch}},[n("div",{directives:[{name:"loading",rawName:"v-loading",value:t.dialogLoading,expression:"dialogLoading"}]},[n("div",{staticStyle:{"text-align":"right"}},[n("el-select",{staticStyle:{width:"130px","margin-right":"5px"},attrs:{placeholder:"国家",size:"small",clearable:""},model:{value:t.batchForm.countryId,callback:function(e){t.$set(t.batchForm,"countryId",e)},expression:"batchForm.countryId"}},[n("el-option",{attrs:{label:"美国",value:"US"}}),n("el-option",{attrs:{label:"加拿大",value:"CA"}})],1),n("el-input",{staticStyle:{width:"200px","margin-right":"5px"},attrs:{size:"small",readonly:""},model:{value:t.currentName,callback:function(e){t.currentName=e},expression:"currentName"}}),n("el-input",{staticStyle:{width:"200px","margin-right":"10px"},attrs:{size:"small",placeholder:"请输入英文名称",clearable:""},model:{value:t.batchForm.name,callback:function(e){t.$set(t.batchForm,"name",e)},expression:"batchForm.name"}}),n("el-button",{attrs:{type:"primary",size:"small"},on:{click:t.getBatchAreaName}},[t._v("\n          查询\n        ")])],1),n("el-table",{staticStyle:{width:"100%",margin:"10px 0"},attrs:{data:t.batchData,height:"500px",border:""}},[n("el-table-column",{attrs:{label:"地区名称"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-input",{staticStyle:{width:"100%"},attrs:{placeholder:"请输入",size:"small",clearable:""},model:{value:e.row.name,callback:function(a){t.$set(e.row,"name",a)},expression:"scope.row.name"}})]}}])}),n("el-table-column",{attrs:{label:"地区简称"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-input",{staticStyle:{width:"100%"},attrs:{placeholder:"请输入",size:"small",clearable:""},model:{value:e.row.abbr,callback:function(a){t.$set(e.row,"abbr",a)},expression:"scope.row.abbr"}})]}}])}),n("el-table-column",{attrs:{label:"英文名称"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-input",{staticStyle:{width:"100%"},attrs:{placeholder:"请输入",size:"small",clearable:""},model:{value:e.row.alias,callback:function(a){t.$set(e.row,"alias",a)},expression:"scope.row.alias"}})]}}])}),n("el-table-column",{attrs:{label:"操作",width:"120"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-button",{attrs:{type:"text",size:"medium"},on:{click:function(a){return t.deleteBatch(e.$index)}}},[t._v("\n              删除\n            ")])]}}])})],1),n("div",{staticStyle:{"text-align":"right","padding-top":"10px"},attrs:{slot:"footer"},slot:"footer"},[n("el-button",{on:{click:t.cancelBatch}},[t._v("\n          取 消\n        ")]),n("el-button",{attrs:{type:"primary"},on:{click:t.confirmBatch}},[t._v("\n          确 定\n        ")])],1)],1)])],1)},i=[],r=(a("8e6e"),a("ac6a"),a("456d"),a("386d"),a("768b")),l=(a("96cf"),a("3b8d")),o=(a("7f7f"),a("bd86")),s=a("d225"),c=a("b0b4"),u=a("308d"),d=a("6bb5"),h=a("4e2b"),f=a("9ab4"),g=a("60a3"),m=a("b32d");function p(t){var e={url:"/setting/area/getCountryByParent",method:"get",params:{parentId:t}};return Object(m["a"])(e)}function v(t){var e={url:"/setting/area/getStateByCountry",method:"get",params:{countryId:t}};return Object(m["a"])(e)}function b(t){var e={url:"/setting/area/getCityByState",method:"get",params:{stateId:t}};return Object(m["a"])(e)}function y(t){var e={url:"/setting/area/getCountyByCity",method:"get",params:{cityId:t}};return Object(m["a"])(e)}function k(t){var e={url:"/setting/area/updateArea",method:"post",data:t};return Object(m["a"])(e)}function w(t){var e={url:"/setting/area/addArea",method:"post",data:t};return Object(m["a"])(e)}function x(t){var e={url:"/setting/area/batch_add_city",method:"post",data:t};return Object(m["a"])(e)}function A(t,e){var a={url:"/setting/area/deleteContainer",method:"delete",params:{id:t,level:e}};return Object(m["a"])(a)}function S(t){var e={url:"/setting/area/getArea",method:"get",params:t};return Object(m["a"])(e)}function O(t){var e={url:"/setting/area/getStreet",method:"get",params:t};return Object(m["a"])(e)}function C(t){var e={url:"/setting/area/search_by_name",method:"get",params:t};return Object(m["a"])(e)}function B(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),a.push.apply(a,n)}return a}function _(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?B(a,!0).forEach(function(e){Object(o["a"])(t,e,a[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):B(a).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))})}return t}var L=function(t){function e(){var t;return Object(s["a"])(this,e),t=Object(u["a"])(this,Object(d["a"])(e).apply(this,arguments)),t.isEdit=!1,t.isDialogFormShow=!1,t.isActive=!0,t.sideLoading=!1,t.loading=!1,t.dialogLoading=!1,t.dialogVisible=!1,t.list=[],t.treeList=[],t.batchData=[],t.size=20,t.page=1,t.search="",t.filterText="",t.batchForm={name:void 0,countryId:void 0,level:void 0},t.treeProps={label:"name",children:"children",isLeaf:"leaf"},t.currentNode={},t.form={id:"",name:"",abbr:"",alias:""},t.formRules={id:[{required:!0,message:"地区代码不能为空",trigger:"blur"},{validator:function(t,e,a){var n=/[\u4e00-\u9fa5]/;e?n.test(e)?a(new Error("地区代码不能有中文")):a():a(new Error("地区代码不能为空"))},trigger:"blur"}],name:[{required:!0,message:"地区名称不能为空",trigger:"blur"}],abbr:[{required:!0,message:"地区简称不能为空",trigger:"blur"}],alias:[{required:!0,message:"英文名称不能为空",trigger:"blur"},{validator:function(t,e,a){var n=/[\u4e00-\u9fa5]/;e?n.test(e)?a(new Error("英文名称不能有中文")):a():a(new Error("英文名称不能为空"))},trigger:"blur"}]},t}return Object(h["a"])(e,t),Object(c["a"])(e,[{key:"toggle",value:function(){this.isActive=!this.isActive}},{key:"handleCurrentChange",value:function(t){this.page=t}},{key:"getCountryByParent",value:function(t){return p(t).then(function(t){var e=t.data||{},a=e.result||[];return a}).catch(function(){return[]})}},{key:"getStateByCountry",value:function(t){return v(t).then(function(t){var e=t.data||{},a=e.result||[];return a}).catch(function(){return[]})}},{key:"getCityByState",value:function(t){return b(t).then(function(t){var e=t.data||{},a=e.result||[];return a}).catch(function(){return[]})}},{key:"getCountyByCity",value:function(t){return y(t).then(function(t){var e=t.data||{},a=e.result||[];return a}).catch(function(){return[]})}},{key:"loadNode",value:function(t,e){var a=this;if(this.currentNode=t,this.search="",0===t.level)return e([{id:"0",name:"全球",level:"0"}]);if(1===t.level&&(this.loading=!0,this.getCountryByParent(t.data.id).then(function(t){a.loading=!1,a.list=t,e(t)}).catch(function(t){return a.loading=!1,t})),2===t.level&&(this.loading=!0,this.getCountryByParent(t.data.id).then(function(t){a.loading=!1,a.list=t,e(t)}).catch(function(t){return a.loading=!1,t})),3===t.level&&(this.loading=!0,this.getStateByCountry(t.data.id).then(function(t){a.loading=!1,a.list=t,e(t)}).catch(function(t){return a.loading=!1,t})),4===t.level&&(this.loading=!0,this.getCityByState(t.data.id).then(function(t){a.loading=!1,a.list=t,e(t)}).catch(function(t){return a.loading=!1,t})),5===t.level&&(this.loading=!0,this.getCountyByCity(t.data.id).then(function(t){a.loading=!1,a.list=t;var n=t;e(n)}).catch(function(t){return a.loading=!1,t})),6===t.level){var n={page:1,size:999,countryId:t.data.countryId,cityId:t.data.id,stateId:t.data.stateId};O(n).then(function(t){if(a.loading=!1,t.success){var n=t.data||{},i=n.result||[];a.list=i,e(i.map(function(t){return _({},t,{leaf:!0})}))}}).catch(function(t){a.loading=!1,e([])})}}},{key:"getArea",value:function(){var t=this;this.sideLoading=!0,S({level:0}).then(function(e){var a=e.data||{};t.treeList=a.result||[],t.currentNode={},t.list=[],t.sideLoading=!1}).catch(function(e){return t.sideLoading=!1,e})}},{key:"areaFilter",value:function(){var t=this.$refs.treeList;t.filter(this.filterText)}},{key:"filterNode",value:function(t,e){return!t||-1!==e.name.indexOf(t)}},{key:"selOrg",value:function(t){this.$message.success(t)}},{key:"onTreeClick",value:function(t,e,a){this.search="",this.list=t.children||[],this.currentNode=a.node}},{key:"add",value:function(){this.isDialogFormShow=!0,this.isEdit=!1}},{key:"addBatch",value:function(){this.dialogVisible=!0,this.batchForm.level=(this.currentNode.data||{}).level}},{key:"getBatchAreaName",value:function(){var t=this;this.batchForm.countryId?this.batchForm.name?(this.dialogLoading=!0,C(_({},this.batchForm)).then(function(e){var a=e.data||[];t.batchData=a.map(function(t){return{alias:t.name,name:t.name,abbr:t.name}}),t.dialogLoading=!1}).catch(function(e){return t.dialogLoading=!1,e})):this.$message.error("英文名称不能为空"):this.$message.error("国家不能为空")}},{key:"cancelBatch",value:function(){this.dialogVisible=!1,this.batchForm={name:void 0,countryId:void 0,level:void 0},this.batchData=[]}},{key:"deleteBatch",value:function(t){this.batchData.splice(t,1)}},{key:"confirmBatch",value:function(){var t=this,e=this.batchData.every(function(t){return t&&t.abbr&&t.alias&&t.name});if(e){this.dialogLoading=!0;var a=this.currentNode.data,n=a.id,i=a.level,r={countryId:this.batchForm.countryId,level:i,parentId:n,list:this.batchData};x(r).then(function(e){t.dialogLoading=!1,t.$message.success("批量新增成功"),t.cancelBatch(),t.getArea()}).catch(function(e){return t.dialogLoading=!1,e})}else this.$message.error("暂无数据或数据不完整")}},{key:"edit",value:function(t){this.isEdit=!0;var e=t.id,a=t.name,n=t.level,i=t.abbr,r=t.alias,l=t.countryId,o=t.parentId,s={id:e,name:a,level:n,abbr:i,alias:r,countryId:l,parentId:o};this.form=s,this.isDialogFormShow=!0}},{key:"updateArea",value:function(t){var e=this;this.dialogLoading=!0;this.currentNode;k(t).then(function(t){e.dialogLoading=!1,e.cancel(),e.getArea()}).catch(function(t){return e.dialogLoading=!1,t})}},{key:"addArea",value:function(){var t=this;this.dialogLoading=!0;var e=this.currentNode,a=this.form,n=e.data,i=n.id,r=n.level,l=2===r?e.data.id:e.data.countryId,o={parentId:i,countryId:l,level:parseInt(r,10)+1},s=_({},a,{},o);w(s).then(function(e){t.dialogLoading=!1,t.cancel(),t.getArea()}).catch(function(e){return t.dialogLoading=!1,e})}},{key:"del",value:function(){var t=Object(l["a"])(regeneratorRuntime.mark(function t(e){var a,n,i,l,o;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.$confirm("删除将无法恢复，是否继续？","温馨提示",{confirmButtonText:"确定",closeOnClickModal:!1,cancelButtonText:"取消",type:"warning"}).then(function(t){return[null,t]}).catch(function(t){return[t,null]});case 2:if(a=t.sent,n=Object(r["a"])(a,2),i=n[0],n[1],!i){t.next=8;break}return t.abrupt("return");case 8:l=e.id,o=e.level,this.deleteContainer(l,o);case 10:case"end":return t.stop()}},t,this)}));function e(e){return t.apply(this,arguments)}return e}()},{key:"deleteContainer",value:function(t,e){var a=this;this.loading=!0;this.currentNode;A(t,e).then(function(t){a.$message.success("删除成功"),a.loading=!1,a.getArea()}).catch(function(t){return a.loading=!1,a.$message.error("删除失败"),t})}},{key:"refreshNode",value:function(t){t.loaded=!1,t.expand()}},{key:"saveConfirm",value:function(){var t=this,e=this.$refs.editForm;e.validate(function(e){if(!e)return!1;var a=t.isEdit,n=t.form;a?t.updateArea(n):t.addArea()})}},{key:"resetForm",value:function(){this.form={id:"",name:"",abbr:"",alias:""}}},{key:"clearValidate",value:function(){var t=this;this.$nextTick(function(){var e=t.$refs.editForm;e.clearValidate()})}},{key:"cancel",value:function(){this.isDialogFormShow=!1,this.resetForm(),this.clearValidate()}},{key:"created",value:function(){this.getArea()}},{key:"tableData",get:function(){var t=this.resultData,e=this.page,a=this.size;return t.slice((e-1)*a,e*a)}},{key:"resultData",get:function(){var t=this.search,e=this.list;return t?e.filter(function(e){var a=e||{},n=a.abbr,i=a.alias,r=a.id,l=a.name,o={abbr:n,alias:i,id:r,name:l};return Object.keys(o).some(function(a){return String(e[a]).indexOf(t)>-1})}):e}},{key:"total",get:function(){var t=this.resultData;return t.length}},{key:"isAddBtnShow",get:function(){var t=this.currentNode;return!(!t.data||7===t.data.level)}},{key:"currentName",get:function(){var t=this.currentNode;return"添加到"+((t.data||{}).name||"")+"下级"}}]),e}(g["e"]);L=f["a"]([Object(g["a"])({name:"AreaConfig",components:{},props:{}})],L);var N=L,j=N,F=a("2877"),I=Object(F["a"])(j,n,i,!1,null,"728abd98",null);e["default"]=I.exports}}]);