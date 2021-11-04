!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("vue"),require("clipboard")):"function"==typeof define&&define.amd?define(["vue","clipboard"],t):"object"==typeof exports?exports.JsonView=t(require("vue"),require("clipboard")):e.JsonView=t(e.vue,e.clipboard)}(this,function(n,o){return u={},i.m=r=[function(e,t,n){"use strict";function o(e,t,n,o,i,r,u,s){var a,l,d="function"==typeof e?e.options:e;return t&&(d.render=t,d.staticRenderFns=n,d._compiled=!0),o&&(d.functional=!0),r&&(d._scopeId="data-v-"+r),u?d._ssrRegister=a=function(e){(e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),i&&i.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(u)}:i&&(a=s?function(){i.call(this,(d.functional?this.parent:this).$root.$options.shadowRoot)}:i),a&&(d.functional?(d._injectStyles=a,l=d.render,d.render=function(e,t){return a.call(t),l(e,t)}):(s=d.beforeCreate,d.beforeCreate=s?[].concat(s,a):[a])),{exports:e,options:d}}n.d(t,"a",function(){return o})},function(e,t,n){"use strict";n.r(t);var o,i=n(2),r=n.n(i);for(o in i)"default"!==o&&function(e){n.d(t,e,function(){return i[e]})}(o);t.default=r.a},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});u(n(27));var o=u(n(21)),i=u(n(37)),r=n(38);function u(e){return e&&e.__esModule?e:{default:e}}t.default={name:"JsonViewer",components:{JsonBox:o.default},props:{value:{type:[Object,Array,String,Number,Boolean,Function],required:!0},expanded:{type:Boolean,default:!1},expandDepth:{type:Number,default:1},copyable:{type:[Boolean,Object],default:!1},sort:{type:Boolean,default:!1},boxed:{type:Boolean,default:!1},theme:{type:String,default:"jv-light"},timeformat:{type:Function,default:function(e){return e.toLocaleString()}},previewMode:{type:Boolean,default:!1}},provide:function(){return{expandDepth:this.expandDepth,timeformat:this.timeformat}},data:function(){return{copied:!1,expandableCode:!1,expandCode:this.expanded}},computed:{jvClass:function(){return"jv-container "+this.theme+(this.boxed?" boxed":"")},copyText:function(){var e=this.copyable;return{copyText:e.copyText||"copy",copiedText:e.copiedText||"copied!",timeout:e.timeout||2e3,align:e.align}}},watch:{value:function(){this.onResized()}},mounted:function(){var t=this;this.debounceResized=(0,r.debounce)(this.debResized.bind(this),200),this.boxed&&this.$refs.jsonBox&&(this.onResized(),this.$refs.jsonBox.$el.addEventListener("resized",this.onResized,!0)),this.copyable&&new i.default(this.$refs.clip,{container:this.$refs.viewer,text:function(){return JSON.stringify(t.value,null,2)}}).on("success",function(e){t.onCopied(e)})},methods:{onResized:function(){this.debounceResized()},debResized:function(){var e=this;this.$nextTick(function(){e.$refs.jsonBox&&(250<=e.$refs.jsonBox.$el.clientHeight?e.expandableCode=!0:e.expandableCode=!1)})},onCopied:function(e){var t=this;this.copied||(this.copied=!0,setTimeout(function(){t.copied=!1},this.copyText.timeout),this.$emit("copied",e))},toggleExpandCode:function(){this.expandCode=!this.expandCode}}}},function(e,t,n){"use strict";n.r(t);var o,i=n(4),r=n.n(i);for(o in i)"default"!==o&&function(e){n.d(t,e,function(){return i[e]})}(o);t.default=r.a},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},u=o(n(28)),s=o(n(29)),a=o(n(30)),l=o(n(31)),d=o(n(32)),c=o(n(33)),f=o(n(34)),p=o(n(35));function o(e){return e&&e.__esModule?e:{default:e}}t.default={name:"JsonBox",inject:["expandDepth"],props:{value:{type:[Object,Array,String,Number,Boolean,Function,Date],default:null},keyName:{type:String,default:""},sort:Boolean,depth:{type:Number,default:0},previewMode:Boolean},data:function(){return{expand:!0}},mounted:function(){this.expand=this.previewMode||!(this.depth>=this.expandDepth)},methods:{toggle:function(){this.expand=!this.expand;try{this.$el.dispatchEvent(new Event("resized"))}catch(e){var t=document.createEvent("Event");t.initEvent("resized",!0,!1),this.$el.dispatchEvent(t)}}},render:function(e){var t=this,n=[],o=void 0;null===this.value||void 0===this.value?o=s.default:Array.isArray(this.value)?o=c.default:"[object Date]"===Object.prototype.toString.call(this.value)?o=p.default:"object"===r(this.value)?o=d.default:"number"==typeof this.value?o=a.default:"string"==typeof this.value?o=u.default:"boolean"==typeof this.value?o=l.default:"function"==typeof this.value&&(o=f.default);var i=this.keyName&&this.value&&(Array.isArray(this.value)||"object"===r(this.value)&&"[object Date]"!==Object.prototype.toString.call(this.value));return!this.previewMode&&i&&n.push(e("span",{class:{"jv-toggle":!0,open:!!this.expand},on:{click:this.toggle}})),this.keyName&&n.push(e("span",{class:{"jv-key":!0},domProps:{innerText:this.keyName+":"}})),n.push(e(o,{class:{"jv-push":!0},props:{jsonValue:this.value,keyName:this.keyName,sort:this.sort,depth:this.depth,expand:this.expand,previewMode:this.previewMode},on:{"update:expand":function(e){t.expand=e}}})),e("div",{class:{"jv-node":!0,"jv-key-node":Boolean(this.keyName)&&!i,toggle:!this.previewMode&&i}},n)}}},function(e,t,n){"use strict";n.r(t);var o,i=n(6),r=n.n(i);for(o in i)"default"!==o&&function(e){n.d(t,e,function(){return i[e]})}(o);t.default=r.a},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=/^\w+:\/\//;t.default={name:"JsonString",props:{jsonValue:{type:String,required:!0}},data:function(){return{expand:!0,canExtend:!1}},mounted:function(){this.$refs.itemRef.offsetHeight>this.$refs.holderRef.offsetHeight&&(this.canExtend=!0)},methods:{toggle:function(){this.expand=!this.expand}},render:function(e){var t=this.jsonValue,n=i.test(t),o=void 0;return this.expand?(o={class:{"jv-item":!0,"jv-string":!0},ref:"itemRef"}).domProps=n?{innerHTML:'"'+(t='<a href="'+t+'" target="_blank" class="jv-link">'+t+"</a>").toString()+'"'}:{innerText:'"'+t.toString()+'"'}:o={class:{"jv-ellipsis":!0},on:{click:this.toggle},domProps:{innerText:"..."}},e("span",{},[this.canExtend&&e("span",{class:{"jv-toggle":!0,open:this.expand},on:{click:this.toggle}}),e("span",{class:{"jv-holder-node":!0},ref:"holderRef"}),e("span",o)])}}},function(e,t,n){"use strict";n.r(t);var o,i=n(8),r=n.n(i);for(o in i)"default"!==o&&function(e){n.d(t,e,function(){return i[e]})}(o);t.default=r.a},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"JsonUndefined",functional:!0,props:{jsonValue:{type:Object,default:null}},render:function(e,t){return e("span",{class:{"jv-item":!0,"jv-undefined":!0},domProps:{innerText:null===t.props.jsonValue?"null":"undefined"}})}}},function(e,t,n){"use strict";n.r(t);var o,i=n(10),r=n.n(i);for(o in i)"default"!==o&&function(e){n.d(t,e,function(){return i[e]})}(o);t.default=r.a},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"JsonNumber",functional:!0,props:{jsonValue:{type:Number,required:!0}},render:function(e,t){var n=t.props,t=Number.isInteger(n.jsonValue);return e("span",{class:{"jv-item":!0,"jv-number":!0,"jv-number-integer":t,"jv-number-float":!t},domProps:{innerText:n.jsonValue.toString()}})}}},function(e,t,n){"use strict";n.r(t);var o,i=n(12),r=n.n(i);for(o in i)"default"!==o&&function(e){n.d(t,e,function(){return i[e]})}(o);t.default=r.a},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"JsonBoolean",functional:!0,props:{jsonValue:Boolean},render:function(e,t){return e("span",{class:{"jv-item":!0,"jv-boolean":!0},domProps:{innerText:t.props.jsonValue.toString()}})}}},function(e,t,n){"use strict";n.r(t);var o,i=n(14),r=n.n(i);for(o in i)"default"!==o&&function(e){n.d(t,e,function(){return i[e]})}(o);t.default=r.a},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,i=n(21),r=(o=i)&&o.__esModule?o:{default:o};t.default={name:"JsonObject",props:{jsonValue:{type:Object,required:!0},keyName:{type:String,default:""},depth:{type:Number,default:0},expand:Boolean,sort:Boolean,previewMode:Boolean},data:function(){return{value:{}}},computed:{ordered:function(){var t=this;if(!this.sort)return this.value;var n={};return Object.keys(this.value).sort().forEach(function(e){n[e]=t.value[e]}),n}},watch:{jsonValue:function(e){this.setValue(e)}},mounted:function(){this.setValue(this.jsonValue)},methods:{setValue:function(e){var t=this;setTimeout(function(){t.value=e},0)},toggle:function(){this.$emit("update:expand",!this.expand),this.dispatchEvent()},dispatchEvent:function(){try{this.$el.dispatchEvent(new Event("resized"))}catch(e){var t=document.createEvent("Event");t.initEvent("resized",!0,!1),this.$el.dispatchEvent(t)}}},render:function(e){var t,n=[];if(this.previewMode||this.keyName||n.push(e("span",{class:{"jv-toggle":!0,open:!!this.expand},on:{click:this.toggle}})),n.push(e("span",{class:{"jv-item":!0,"jv-object":!0},domProps:{innerText:"{"}})),this.expand)for(var o in this.ordered)this.ordered.hasOwnProperty(o)&&(t=this.ordered[o],n.push(e(r.default,{key:o,style:{display:this.expand?void 0:"none"},props:{sort:this.sort,keyName:o,depth:this.depth+1,value:t,previewMode:this.previewMode}})));return!this.expand&&Object.keys(this.value).length&&n.push(e("span",{style:{display:this.expand?"none":void 0},class:{"jv-ellipsis":!0},on:{click:this.toggle},attrs:{title:"click to reveal object content (keys: "+Object.keys(this.ordered).join(", ")+")"},domProps:{innerText:"..."}})),n.push(e("span",{class:{"jv-item":!0,"jv-object":!0},domProps:{innerText:"}"}})),e("span",n)}}},function(e,t,n){"use strict";n.r(t);var o,i=n(16),r=n.n(i);for(o in i)"default"!==o&&function(e){n.d(t,e,function(){return i[e]})}(o);t.default=r.a},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,i=n(21),r=(o=i)&&o.__esModule?o:{default:o};t.default={name:"JsonArray",props:{jsonValue:{type:Array,required:!0},keyName:{type:String,default:""},depth:{type:Number,default:0},sort:Boolean,expand:Boolean,previewMode:Boolean},data:function(){return{value:[]}},watch:{jsonValue:function(e){this.setValue(e)}},mounted:function(){this.setValue(this.jsonValue)},methods:{setValue:function(e){var t=this,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;0===n&&(this.value=[]),setTimeout(function(){e.length>n&&(t.value.push(e[n]),t.setValue(e,n+1))},0)},toggle:function(){this.$emit("update:expand",!this.expand);try{this.$el.dispatchEvent(new Event("resized"))}catch(e){var t=document.createEvent("Event");t.initEvent("resized",!0,!1),this.$el.dispatchEvent(t)}}},render:function(n){var o=this,i=[];return this.previewMode||this.keyName||i.push(n("span",{class:{"jv-toggle":!0,open:!!this.expand},on:{click:this.toggle}})),i.push(n("span",{class:{"jv-item":!0,"jv-array":!0},domProps:{innerText:"["}})),this.expand&&this.value.forEach(function(e,t){i.push(n(r.default,{key:t,style:{display:o.expand?void 0:"none"},props:{sort:o.sort,depth:o.depth+1,value:e,previewMode:o.previewMode}}))}),!this.expand&&this.value.length&&i.push(n("span",{style:{display:void 0},class:{"jv-ellipsis":!0},on:{click:this.toggle},attrs:{title:"click to reveal "+this.value.length+" hidden items"},domProps:{innerText:"..."}})),i.push(n("span",{class:{"jv-item":!0,"jv-array":!0},domProps:{innerText:"]"}})),n("span",i)}}},function(e,t,n){"use strict";n.r(t);var o,i=n(18),r=n.n(i);for(o in i)"default"!==o&&function(e){n.d(t,e,function(){return i[e]})}(o);t.default=r.a},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"JsonFunction",functional:!0,props:{jsonValue:{type:Function,required:!0}},render:function(e,t){return e("span",{class:{"jv-item":!0,"jv-function":!0},attrs:{title:t.props.jsonValue.toString()},domProps:{innerHTML:"&lt;function&gt;"}})}}},function(e,t,n){"use strict";n.r(t);var o,i=n(20),r=n.n(i);for(o in i)"default"!==o&&function(e){n.d(t,e,function(){return i[e]})}(o);t.default=r.a},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"JsonDate",inject:["timeformat"],functional:!0,props:{jsonValue:{type:Date,required:!0}},render:function(e,t){var n=t.props,t=t.injections,n=n.jsonValue;return e("span",{class:{"jv-item":!0,"jv-string":!0},domProps:{innerText:'"'+(0,t.timeformat)(n)+'"'}})}}},function(e,t,n){"use strict";n.r(t);var o,i=n(3);for(o in i)"default"!==o&&function(e){n.d(t,e,function(){return i[e]})}(o);n(36);var r=n(0),r=Object(r.a)(i.default,void 0,void 0,!1,null,null,null);r.options.__file="lib/json-box.vue",t.default=r.exports},function(e,t,n){"use strict";function o(){var e=this,t=e.$createElement;return(t=e._self._c||t)("div",{ref:"viewer",class:e.jvClass},[e.copyable?t("div",{class:"jv-tooltip "+(e.copyText.align||"right")},[t("span",{ref:"clip",staticClass:"jv-button",class:{copied:e.copied}},[e._t("copy",[e._v("\n        "+e._s(e.copied?e.copyText.copiedText:e.copyText.copyText)+"\n      ")],{copied:e.copied})],2)]):e._e(),e._v(" "),t("div",{staticClass:"jv-code",class:{open:e.expandCode,boxed:e.boxed}},[t("json-box",{ref:"jsonBox",attrs:{value:e.value,sort:e.sort,"preview-mode":e.previewMode}})],1),e._v(" "),e.expandableCode&&e.boxed?t("div",{staticClass:"jv-more",on:{click:e.toggleExpandCode}},[t("span",{staticClass:"jv-toggle",class:{open:!!e.expandCode}})]):e._e()])}var i=[];o._withStripped=!0,n.d(t,"a",function(){return o}),n.d(t,"b",function(){return i})},function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,i=n(26),r=(o=i)&&o.__esModule?o:{default:o};t.default=Object.assign(r.default,{install:function(e){e.component("JsonViewer",r.default)}})},function(e,t,n){"use strict";n.r(t);var o,i=n(22),r=n(1);for(o in r)"default"!==o&&function(e){n.d(t,e,function(){return r[e]})}(o);n(39);var u=n(0),i=Object(u.a)(r.default,i.a,i.b,!1,null,null,null);i.options.__file="lib/json-viewer.vue",t.default=i.exports},function(e,t){e.exports=n},function(e,t,n){"use strict";n.r(t);var o,i=n(5);for(o in i)"default"!==o&&function(e){n.d(t,e,function(){return i[e]})}(o);var r=n(0),r=Object(r.a)(i.default,void 0,void 0,!1,null,null,null);r.options.__file="lib/types/json-string.vue",t.default=r.exports},function(e,t,n){"use strict";n.r(t);var o,i=n(7);for(o in i)"default"!==o&&function(e){n.d(t,e,function(){return i[e]})}(o);var r=n(0),r=Object(r.a)(i.default,void 0,void 0,!1,null,null,null);r.options.__file="lib/types/json-undefined.vue",t.default=r.exports},function(e,t,n){"use strict";n.r(t);var o,i=n(9);for(o in i)"default"!==o&&function(e){n.d(t,e,function(){return i[e]})}(o);var r=n(0),r=Object(r.a)(i.default,void 0,void 0,!1,null,null,null);r.options.__file="lib/types/json-number.vue",t.default=r.exports},function(e,t,n){"use strict";n.r(t);var o,i=n(11);for(o in i)"default"!==o&&function(e){n.d(t,e,function(){return i[e]})}(o);var r=n(0),r=Object(r.a)(i.default,void 0,void 0,!1,null,null,null);r.options.__file="lib/types/json-boolean.vue",t.default=r.exports},function(e,t,n){"use strict";n.r(t);var o,i=n(13);for(o in i)"default"!==o&&function(e){n.d(t,e,function(){return i[e]})}(o);var r=n(0),r=Object(r.a)(i.default,void 0,void 0,!1,null,null,null);r.options.__file="lib/types/json-object.vue",t.default=r.exports},function(e,t,n){"use strict";n.r(t);var o,i=n(15);for(o in i)"default"!==o&&function(e){n.d(t,e,function(){return i[e]})}(o);var r=n(0),r=Object(r.a)(i.default,void 0,void 0,!1,null,null,null);r.options.__file="lib/types/json-array.vue",t.default=r.exports},function(e,t,n){"use strict";n.r(t);var o,i=n(17);for(o in i)"default"!==o&&function(e){n.d(t,e,function(){return i[e]})}(o);var r=n(0),r=Object(r.a)(i.default,void 0,void 0,!1,null,null,null);r.options.__file="lib/types/json-function.vue",t.default=r.exports},function(e,t,n){"use strict";n.r(t);var o,i=n(19);for(o in i)"default"!==o&&function(e){n.d(t,e,function(){return i[e]})}(o);var r=n(0),r=Object(r.a)(i.default,void 0,void 0,!1,null,null,null);r.options.__file="lib/types/json-date.vue",t.default=r.exports},function(e,t,n){"use strict";n(23)},function(e,t){e.exports=o},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.debounce=function(o,i){var r=Date.now(),u=void 0;return function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];Date.now()-r<i&&u&&clearTimeout(u),u=setTimeout(function(){o.apply(void 0,t)},i),r=Date.now()}}},function(e,t,n){"use strict";n(24)}],i.c=u,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)i.d(n,o,function(e){return t[e]}.bind(null,o));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=25);function i(e){if(u[e])return u[e].exports;var t=u[e]={i:e,l:!1,exports:{}};return r[e].call(t.exports,t,t.exports,i),t.l=!0,t.exports}var r,u});