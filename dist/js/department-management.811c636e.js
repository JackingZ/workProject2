(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["department-management"],{"2f71":function(e,t,r){"use strict";r.d(t,"l",function(){return n}),r.d(t,"n",function(){return i}),r.d(t,"m",function(){return s}),r.d(t,"k",function(){return u}),r.d(t,"b",function(){return o}),r.d(t,"a",function(){return c}),r.d(t,"f",function(){return l}),r.d(t,"i",function(){return d}),r.d(t,"c",function(){return p}),r.d(t,"d",function(){return m}),r.d(t,"e",function(){return f}),r.d(t,"h",function(){return h}),r.d(t,"g",function(){return v}),r.d(t,"j",function(){return g});var a=r("b32d");function n(e){var t={url:"/auth/user/getUserList",method:"post",data:e};return Object(a["a"])(t)}function i(e){var t={url:"/auth/user/saveUser",method:"post",data:e};return Object(a["a"])(t)}function s(e){var t={url:"/auth/user/resetPassword?id=".concat(e),method:"post"};return Object(a["a"])(t)}function u(e){var t={url:"/auth/user/getUser",method:"get",params:{id:e}};return Object(a["a"])(t)}function o(e){var t={url:"/auth/user/deleteUser",method:"delete",params:{id:e}};return Object(a["a"])(t)}function c(e){var t={url:"/auth/user/changeStatus",method:"post",params:e};return Object(a["a"])(t)}function l(e){var t={url:"/auth/dept/getDeptList",method:"get",params:e};return Object(a["a"])(t)}function d(e){var t={url:"/auth/supplier/getSupplierList",method:"get",params:e};return Object(a["a"])(t)}function p(e){var t={url:"/auth/agent/getAgentList",method:"get",params:e};return Object(a["a"])(t)}function m(e){var t={url:"/auth/customer/customer",method:"post",data:e};return Object(a["a"])(t)}function f(e){var t={url:"/auth/custtype/getServiceTypes",method:"get",params:e};return Object(a["a"])(t)}function h(e){var t={url:"/auth/post/getPostList",method:"get",params:e};return Object(a["a"])(t)}function v(e){var t={url:"/auth/user/parent",method:"get",params:e};return Object(a["a"])(t)}function g(){var e={url:"/auth/agent/customer_finance",method:"get"};return Object(a["a"])(e)}},c530:function(e,t,r){"use strict";r.d(t,"e",function(){return n}),r.d(t,"d",function(){return i}),r.d(t,"c",function(){return s}),r.d(t,"b",function(){return u}),r.d(t,"a",function(){return o});var a=r("b32d");function n(e){var t={url:"/auth/dept/saveDept",method:"post",data:e};return Object(a["a"])(t)}function i(e){var t={url:"/auth/dept/getDeptList",method:"get",params:e};return Object(a["a"])(t)}function s(e){var t={url:"/auth/dept/getDept",method:"get",params:e};return Object(a["a"])(t)}function u(e){var t={url:"/auth/dept/deleteDept",method:"delete",params:e};return Object(a["a"])(t)}function o(e){var t={url:"/auth/dept/changeStatus",method:"post",params:e};return Object(a["a"])(t)}},faae:function(e,t,r){"use strict";r.r(t);var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"app-container"},[r("head-info",{attrs:{title:"部门管理",info:""}}),r("div",{staticClass:"app-panel"},[r("el-row",[r("el-col",{attrs:{span:6}},[r("el-button",{directives:[{name:"permission",rawName:"v-permission",value:["addDept"],expression:"['addDept']"}],attrs:{type:"text",icon:"el-icon-circle-plus-outline"},on:{click:e.handleAdd}},[e._v("\n          新增\n        ")])],1)],1),r("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticStyle:{width:"100%","margin-bottom":"20px"},attrs:{data:e.deptList,height:"calc(100vh - 265px)","row-key":"id",border:"","default-expand-all":"","tree-props":{children:"children",hasChildren:"hasChildren"}}},[r("el-table-column",{attrs:{prop:"name",label:"部门名称","min-width":"180"}}),r("el-table-column",{attrs:{prop:"createTime",label:"添加时间",width:"230"}}),r("el-table-column",{attrs:{label:"操作",width:"180"},scopedSlots:e._u([{key:"default",fn:function(t){return[e.deptId!==t.row.id?r("el-button",{directives:[{name:"permission",rawName:"v-permission",value:["editDept"],expression:"['editDept']"}],attrs:{type:"text",size:"medium"},on:{click:function(r){return e.editDept(t.row)}}},[e._v("\n            编辑\n          ")]):e._e(),e.deptId!==t.row.id?r("el-button",{directives:[{name:"permission",rawName:"v-permission",value:["deleteDept"],expression:"['deleteDept']"}],attrs:{type:"text",size:"medium"},on:{click:function(r){return e.deleteDept(t.row)}}},[e._v("\n            删除\n          ")]):e._e()]}}])})],1)],1),r("app-drawer",{attrs:{"is-show":e.isShow,"mask-closable":!1,"cancel-text":"取消","confirm-text":"确定","drawer-title":"部门管理","drawer-style":"width: 500px;"},on:{drawerClose:e.close,drawerConfirm:e.confirm}},[r("edit-department",{ref:"departmentForm",attrs:{"is-edit":e.isEdit,"dept-list":e.deptList},on:{close:e.onClose}})],1)],1)},n=[],i=r("768b"),s=(r("ac4d"),r("8a81"),r("ac6a"),r("96cf"),r("3b8d")),u=r("d225"),o=r("b0b4"),c=r("308d"),l=r("6bb5"),d=r("4e2b"),p=r("9ab4"),m=r("60a3"),f=r("9dba"),h=r("ac1a"),v=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}]},[r("div",{staticClass:"app-panel"},[r("el-form",{ref:"theForm",staticStyle:{"padding-right":"20px"},attrs:{"label-position":"right",rules:e.formRules,"label-width":"100px",size:"small",model:e.form}},[r("el-form-item",{attrs:{label:"所属公司",prop:"custName"}},[r("el-input",{attrs:{placeholder:"",disabled:!0},model:{value:e.form.custName,callback:function(t){e.$set(e.form,"custName",t)},expression:"form.custName"}})],1),r("el-form-item",{attrs:{label:"上级部门",prop:"parentId"}},[r("el-tree-select",{attrs:{data:e.depts,"default-expand-all":!1,disabled:2===e.isEdit,clearable:"",filterable:"",size:"small",placeholder:"请选择"},model:{value:e.form.parentId,callback:function(t){e.$set(e.form,"parentId",t)},expression:"form.parentId"}})],1),r("el-form-item",{attrs:{label:"部门名称",prop:"name"}},[r("el-input",{attrs:{maxlength:50,placeholder:"请输入",disabled:2===e.isEdit},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1),r("el-form-item",{attrs:{label:"英文名称",prop:"alias"}},[r("el-input",{attrs:{maxlength:50,placeholder:"请输入",disabled:2===e.isEdit},model:{value:e.form.alias,callback:function(t){e.$set(e.form,"alias",t)},expression:"form.alias"}})],1),r("el-form-item",{attrs:{label:"部门主管",prop:"managers"}},[r("el-select",{staticStyle:{width:"100%"},attrs:{placeholder:"请选择",multiple:"","collapse-tags":"",clearable:"",loading:e.selectLoading},on:{focus:e.getUserList},model:{value:e.form.managers,callback:function(t){e.$set(e.form,"managers",t)},expression:"form.managers"}},e._l(e.personList,function(e){return r("el-option",{key:e.id,attrs:{label:e.realName+"-"+e.username+"-"+e.deptName,value:e.id}})}),1)],1),r("el-form-item",{attrs:{label:"备注信息",prop:"remark"}},[r("el-input",{attrs:{maxlength:100,placeholder:"请输入",disabled:2===e.isEdit},model:{value:e.form.remark,callback:function(t){e.$set(e.form,"remark",t)},expression:"form.remark"}})],1)],1)],1)])},g=[],b=(r("8e6e"),r("456d"),r("c5f6"),r("a481"),r("bd86")),y=(r("7514"),r("a8db")),O=(r("7f7f"),r("c530")),k=r("2f71");function j(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,a)}return r}function w(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?j(r,!0).forEach(function(t){Object(b["a"])(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):j(r).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}var x=function(e){function t(){var e;return Object(u["a"])(this,t),e=Object(c["a"])(this,Object(l["a"])(t).apply(this,arguments)),e.selectLoading=!1,e.loading=!1,e.form={id:void 0,custId:e.custId,custName:e.custName,parentId:"",parentName:void 0,name:void 0,alias:void 0,managers:[],remark:void 0},e.personList=[],e.formRules={custName:[{required:!0,message:"所属公司不能为空",trigger:"blur"}],parentId:[{required:!0,message:"上级部门不能为空",trigger:"change"}],name:[{required:!0,message:"部门名称不能为空",trigger:"blur"}],alias:[{validator:function(e,t,r){var a=/[\u4e00-\u9fa5]/;t&&a.test(t)?r(new Error("英文名称不能有中文")):r()},trigger:"blur"}]},e}return Object(d["a"])(t,e),Object(o["a"])(t,[{key:"setData",value:function(){this.form.custId=this.custId,this.form.custName=this.custName,this.getUserList()}},{key:"addDisabled",value:function(e){for(var t=this.form,r=this.addDisabled,a=0;a<e.length;a++)e[a].value===t.id&&e.splice(a,1),e[a]&&e[a].children&&Array.isArray(e[a].children)&&e[a].children.length&&r(e[a].children)}},{key:"recursionName",value:function(e,t){var r,a=!1,n=function t(n){a||n.map(function(n,i){if(e===n.id)return r=n.name,a=!0;n.children&&n.children.length>0&&t(n.children)})};return n(t),r}},{key:"saveDept",value:function(){var e=this,t=this.$refs.theForm;t.validate(function(t){if(t){var r=e.form,a=r.alias,n=r.managers,i=Object(y["a"])(r,["alias","managers"]),s=n.map(function(t){return{id:t,name:(e.personList.find(function(e){return e.id===t})||{}).username}}),u=e.recursionName(e.form.parentId,e.deptList),o=w({},i,{parantName:u,alias:a?a.trim():"",managers:s});e.loading=!0,Object(O["e"])(o).then(function(){e.loading=!1,e.$emit("close")}).catch(function(t){return e.loading=!1,t})}})}},{key:"getDept",value:function(e){var t=this;this.loading=!0,Object(O["c"])({id:e}).then(function(e){t.loading=!1;var r=e.data||{},a=r.managers,n=Object(y["a"])(r,["managers"]),i=a.map(function(e){return e.id});n.managers=i,n.parentId=n.parentId?n.parentId:"",n.custName=n.custName?n.custName:t.custName,t.form=n}).catch(function(e){return t.loading=!1,e})}},{key:"getUserList",value:function(){var e=this;this.selectLoading=!0,Object(k["g"])({custId:this.custId,deptId:this.form.parentId}).then(function(t){e.selectLoading=!1,e.personList=t.data||[]}).catch(function(t){return e.selectLoading=!1,t})}},{key:"reset",value:function(){var e={id:void 0,custId:this.custId,custName:this.custName,parentId:"",parentName:void 0,name:void 0,alias:void 0,managers:[],remark:void 0};this.form=e;var t=this.$refs.theForm;this.$nextTick(function(){t.clearValidate()})}},{key:"labelPosition",get:function(){var e=h["a"].language;return e&&"en"===e?"top":"left"}},{key:"lang",get:function(){var e=h["a"].language;return e||"en"}},{key:"custId",get:function(){var e=f["a"].info||{},t=e.custId;return t}},{key:"custName",get:function(){var e=f["a"].info||{},t=e.custName;return t}},{key:"deptId",get:function(){var e=f["a"].info||{},t=e.deptId;return t}},{key:"depts",get:function(){var e=this.deptList,t=(this.deptId,this.form,this.addDisabled),r=JSON.parse(JSON.stringify(e).replace(/name/g,"label").replace(/id/g,"value"));return t(r),r}}]),t}(m["e"]);x=p["a"]([Object(m["a"])({name:"EditDepartment",components:{},props:{isEdit:{type:Number,default:!1},deptList:{type:Array,default:[]}}})],x);var I=x,N=I,D=r("2877"),L=Object(D["a"])(N,v,g,!1,null,"892fa238",null),S=L.exports,$=function(e){function t(){var e;return Object(u["a"])(this,t),e=Object(c["a"])(this,Object(l["a"])(t).apply(this,arguments)),e.isShow=!1,e.isEdit=1,e.deptList=[],e.loading=!1,e}return Object(d["a"])(t,e),Object(o["a"])(t,[{key:"handleAdd",value:function(){this.isShow=!0,this.isEdit=1}},{key:"close",value:function(){this.isShow=!1;this.isEdit;var e=this.$refs.departmentForm;e.reset()}},{key:"onClose",value:function(){this.getDeptList(),this.close()}},{key:"changeStatus",value:function(){var e=Object(s["a"])(regeneratorRuntime.mark(function e(t){var r,a,n,s,u,o,c,l,d=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return l=function(e){var t=!0,n=!1,i=void 0;try{for(var s,u=e[Symbol.iterator]();!(t=(s=u.next()).done);t=!0){var o=s.value;o.id===r&&(o.status="0"===a?"0":"1"),o.children&&Array.isArray(o.children)&&o.children.length&&l(o.children)}}catch(c){n=!0,i=c}finally{try{t||null==u.return||u.return()}finally{if(n)throw i}}},n=function(e){var t=!0,i=!1,s=void 0;try{for(var u,o=e[Symbol.iterator]();!(t=(u=o.next()).done);t=!0){var c=u.value;c.id===r&&(c.status="0"===a?"1":"0"),c.children&&Array.isArray(c.children)&&c.children.length&&n(c.children)}}catch(l){i=!0,s=l}finally{try{t||null==o.return||o.return()}finally{if(i)throw s}}},r=t.id,a=t.status,n(this.deptList),s="1"===a?"启用":"禁用",e.next=7,this.$confirm("此操作将".concat(s,"用户，是否继续？"),"提示",{confirmButtonText:"确定",closeOnClickModal:!1,cancelButtonText:"取消",type:"warning"}).then(function(e){return[null,e]}).catch(function(e){return[e,null]});case 7:if(u=e.sent,o=Object(i["a"])(u,2),c=o[0],o[1],!c){e.next=13;break}return e.abrupt("return");case 13:l(this.deptList),Object(O["a"])({id:r,status:a}).then(function(e){var t=e.msg;d.$message.success(t)}).catch(function(e){return e});case 15:case"end":return e.stop()}},e,this)}));function t(t){return e.apply(this,arguments)}return t}()},{key:"confirm",value:function(){var e=this.$refs.departmentForm;e.saveDept()}},{key:"deleteDept",value:function(){var e=Object(s["a"])(regeneratorRuntime.mark(function e(t){var r,a,n,s,u=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.id,e.next=3,this.$confirm("此操作将删除部门，是否继续？","提示",{confirmButtonText:"确定",closeOnClickModal:!1,cancelButtonText:"取消",type:"warning"}).then(function(e){return[null,e]}).catch(function(e){return[e,null]});case 3:if(a=e.sent,n=Object(i["a"])(a,2),s=n[0],n[1],!s){e.next=9;break}return e.abrupt("return");case 9:Object(O["b"])({id:r}).then(function(e){var t=e.msg;u.$message.success(t),u.getDeptList()}).catch(function(e){return e});case 10:case"end":return e.stop()}},e,this)}));function t(t){return e.apply(this,arguments)}return t}()},{key:"editDept",value:function(e){var t=e.id;this.isShow=!0,this.isEdit=1;var r=this.$refs.departmentForm;r.getDept(t)}},{key:"getDeptList",value:function(){var e=this;this.loading=!0,Object(O["d"])({custId:this.custId,deptId:this.deptId}).then(function(t){var r=t.data||{};e.deptList=r.result||[],e.loading=!1}).catch(function(t){return e.loading=!1,t})}},{key:"created",value:function(){this.getDeptList()}},{key:"labelPosition",get:function(){var e=h["a"].language;return e&&"en"===e?"top":"left"}},{key:"lang",get:function(){var e=h["a"].language;return e||"en"}},{key:"custId",get:function(){var e=f["a"].info||{},t=e.custId;return t}},{key:"deptId",get:function(){var e=f["a"].info||{},t=e.deptId;return t}},{key:"custName",get:function(){var e=f["a"].info||{},t=e.custName;return t}},{key:"deptName",get:function(){var e=f["a"].info||{},t=e.deptName;return t}}]),t}(m["e"]);$=p["a"]([Object(m["a"])({name:"Department",components:{EditDepartment:S},props:{}})],$);var E=$,P=E,_=Object(D["a"])(P,a,n,!1,null,"55f3564b",null);t["default"]=_.exports}}]);