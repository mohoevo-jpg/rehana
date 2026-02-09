import{r as P,g as j,c as h,o as m,b as t,e as N,j as b,v as B,C as Z,k as d,F as D,m as z,n as T,t as y,p as K,D as Q,E as F,z as X,G as I,d as M,A as U,H as J,I as R,B as Y,J as tt,u as et,h as st,T as ot}from"./index-DUS2SrFg.js";import{f as $}from"./currency-DPHm-HqN.js";import{c as k}from"./createLucideIcon-Dlap17QE.js";import{P as at}from"./package-BC8sDszs.js";import{u as it}from"./customers-D2qX1kpu.js";import{S as A}from"./shopping-cart-DaBx0C0j.js";import{P as rt}from"./plus-T6ifTBuq.js";import{T as nt}from"./trash-2-DjMAfoaB.js";import{U as lt}from"./user-GOvdep_U.js";import{P as dt}from"./printer-CBd1wSWY.js";import{F as ct}from"./file-text-C5kbrT4y.js";import{f as ut}from"./date-CbKvo9xS.js";import"./format-MhD4UfPn.js";import"./en-US-dIBtKp69.js";import"./ar-YW_Uz9wj.js";/**
 * @license lucide-vue-next v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mt=k("BanknoteIcon",[["rect",{width:"20",height:"12",x:"2",y:"6",rx:"2",key:"9lu3g6"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}],["path",{d:"M6 12h.01M18 12h.01",key:"113zkx"}]]);/**
 * @license lucide-vue-next v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=k("CreditCardIcon",[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]]);/**
 * @license lucide-vue-next v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pt=k("MinusIcon",[["path",{d:"M5 12h14",key:"1ays0h"}]]);/**
 * @license lucide-vue-next v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ht=k("PackageOpenIcon",[["path",{d:"M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z",key:"1vy178"}],["path",{d:"m3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z",key:"s3bv25"}],["line",{x1:"12",x2:"12",y1:"22",y2:"13",key:"1o4xyi"}],["path",{d:"M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13.5",key:"1na2nq"}]]);/**
 * @license lucide-vue-next v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yt=k("SearchIcon",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-vue-next v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bt=k("TagIcon",[["path",{d:"M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z",key:"14b2ls"}],["path",{d:"M7 7h.01",key:"7u93v4"}]]);/**
 * @license lucide-vue-next v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vt=k("XIcon",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),ft={class:"flex flex-col h-full bg-white rounded-lg shadow overflow-hidden"},gt={class:"p-4 border-b space-y-3"},xt={class:"relative"},$t=["placeholder"],wt={class:"flex gap-2 overflow-x-auto pb-2 scrollbar-hide"},_t=["onClick"],kt={class:"flex-1 overflow-y-auto p-4"},Ct={key:0,class:"h-full flex flex-col items-center justify-center text-gray-500"},St={key:1,class:"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"},It=["onClick"],jt={class:"w-full h-24 bg-gray-100 rounded-md mb-2 flex items-center justify-center overflow-hidden"},Pt=["src","alt"],qt={class:"font-medium text-sm text-gray-800 line-clamp-2 w-full"},Mt={class:"mt-1 text-primary-600 font-bold text-sm w-full"},Dt={__name:"ProductGrid",props:{products:{type:Array,required:!0}},emits:["add-to-cart"],setup(n,{emit:i}){const o=n,x=i,u=P(""),v=P("الكل"),w=j(()=>["الكل",...new Set(o.products.map(f=>f.category))]),g=j(()=>{let l=o.products;if(v.value!=="الكل"&&(l=l.filter(f=>f.category===v.value)),u.value){const f=u.value.toLowerCase();l=l.filter(s=>s.name.toLowerCase().includes(f)||s.barcode.includes(f))}return l}),r=()=>{const l=o.products.find(f=>f.barcode===u.value);l&&(x("add-to-cart",l),u.value="")};return(l,f)=>(m(),h("div",ft,[t("div",gt,[t("div",xt,[N(t("input",{"onUpdate:modelValue":f[0]||(f[0]=s=>u.value=s),type:"text",placeholder:l.$t("cashier.search_product"),class:"w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none",onKeyup:Z(r,["enter"])},null,40,$t),[[B,u.value]]),b(d(yt),{class:"w-5 h-5 text-gray-400 absolute left-3 top-2.5"})]),t("div",wt,[(m(!0),h(D,null,z(w.value,s=>(m(),h("button",{key:s,onClick:p=>v.value=s,class:T(["px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",v.value===s?"bg-primary-600 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"])},y(s),11,_t))),128))])]),t("div",kt,[g.value.length===0?(m(),h("div",Ct,[b(d(ht),{class:"w-12 h-12 mb-2 opacity-50"}),f[1]||(f[1]=t("p",null,"لا توجد منتجات",-1))])):(m(),h("div",St,[(m(!0),h(D,null,z(g.value,s=>(m(),h("button",{key:s.id,onClick:p=>l.$emit("add-to-cart",s),class:"flex flex-col items-center p-3 border rounded-lg hover:border-primary-500 hover:shadow-md transition-all bg-white text-right"},[t("div",jt,[s.image?(m(),h("img",{key:0,src:s.image,alt:s.name,class:"w-full h-full object-cover"},null,8,Pt)):(m(),K(d(at),{key:1,class:"w-10 h-10 text-gray-300"}))]),t("h3",qt,y(s.name),1),t("span",Mt,y(d($)(s.price)),1)],8,It))),128))]))])]))}},H=Q("cart",{state:()=>({items:[],discount:0,customer:null}),getters:{subtotal:n=>n.items.reduce((i,o)=>i+o.price*o.quantity,0),total:n=>{const i=n.items.reduce((o,x)=>o+x.price*x.quantity,0);return Math.max(0,i-n.discount)},itemCount:n=>n.items.reduce((i,o)=>i+o.quantity,0)},actions:{addToCart(n){const i=this.items.find(o=>o.id===n.id);i?i.quantity++:this.items.push({...n,quantity:1})},removeFromCart(n){const i=this.items.findIndex(o=>o.id===n);i>-1&&this.items.splice(i,1)},updateQuantity(n,i){const o=this.items.find(x=>x.id===n);o&&(o.quantity=i,o.quantity<=0&&this.removeFromCart(n))},clearCart(){this.items=[],this.discount=0,this.customer=null},setDiscount(n){this.discount=n},setCustomer(n){this.customer=n}}}),zt={class:"flex flex-col h-full bg-white shadow-lg border-r border-gray-200"},Lt={class:"p-4 border-b bg-gray-50"},Tt={class:"font-bold text-lg text-gray-800 flex items-center"},Nt={class:"flex-1 overflow-y-auto p-2 space-y-2"},Ft={key:0,class:"h-full flex flex-col items-center justify-center text-gray-400"},At={class:"flex-1"},Bt={class:"font-medium text-gray-900"},Ut={class:"text-sm text-gray-500"},Vt={class:"flex items-center gap-3"},Ht={class:"flex items-center border rounded-md"},Ot=["onClick"],Et={class:"px-2 font-medium"},Gt=["onClick"],Wt={class:"font-bold text-gray-800 w-20 text-left"},Zt=["onClick"],Kt={class:"p-4 bg-gray-50 border-t space-y-2"},Qt={class:"mb-4 pb-4 border-b"},Xt={class:"flex items-center justify-between mb-2"},Jt={class:"text-gray-600 font-medium flex items-center gap-2"},Rt=["value"],Yt=["value"],te={class:"flex justify-between text-gray-600"},ee={class:"flex justify-between items-center text-gray-600"},se={class:"flex items-center gap-1"},oe={class:"relative w-32"},ae=["value","disabled"],ie={class:"flex items-center justify-end gap-2 mt-2"},re={class:"border-t pt-2 flex justify-between items-center"},ne={class:"font-bold text-lg"},le={class:"font-bold text-2xl text-primary-600"},de={class:"flex gap-2 mt-4"},ce=["disabled"],ue=["disabled"],me={__name:"CartList",emits:["checkout"],setup(n){const i=H(),o=it(),x=j(()=>i.items),u=j(()=>i.subtotal),v=j(()=>i.total),w=j(()=>i.discount),g=P(!1),r=()=>{const e=u.value*.4166;i.setDiscount(Math.floor(e))};F(g,e=>{e?r():i.setDiscount(0)}),F(u,()=>{g.value&&r()});const l=(e,a)=>{i.updateQuantity(e,a)},f=e=>{i.removeFromCart(e)},s=e=>{e<0&&(e=0),i.setDiscount(e)},p=e=>{if(!e){i.setCustomer(null);return}const a=o.getCustomerById(Number(e));i.setCustomer(a)};return(e,a)=>{var _;const C=X("router-link");return m(),h("div",zt,[t("div",Lt,[t("h2",Tt,[b(d(A),{class:"w-5 h-5 ml-2"}),a[5]||(a[5]=I(" السلة الحالية ",-1))])]),t("div",Nt,[x.value.length===0?(m(),h("div",Ft,[b(d(A),{class:"w-12 h-12 mb-2 opacity-50"}),t("p",null,y(e.$t("cashier.cart_empty")),1)])):M("",!0),(m(!0),h(D,null,z(x.value,c=>(m(),h("div",{key:c.id,class:"bg-white border rounded-lg p-3 flex justify-between items-center shadow-sm"},[t("div",At,[t("h4",Bt,y(c.name),1),t("div",Ut,y(d($)(c.price))+" × "+y(c.quantity),1)]),t("div",Vt,[t("div",Ht,[t("button",{onClick:L=>l(c.id,c.quantity+1),class:"px-2 py-1 hover:bg-gray-100 text-green-600"},[b(d(rt),{class:"w-4 h-4"})],8,Ot),t("span",Et,y(c.quantity),1),t("button",{onClick:L=>l(c.id,c.quantity-1),class:"px-2 py-1 hover:bg-gray-100 text-red-600"},[b(d(pt),{class:"w-4 h-4"})],8,Gt)]),t("div",Wt,y(d($)(c.price*c.quantity)),1),t("button",{onClick:L=>f(c.id),class:"text-red-400 hover:text-red-600 p-1"},[b(d(nt),{class:"w-4 h-4"})],8,Zt)])]))),128))]),t("div",Kt,[t("div",Qt,[t("div",Xt,[t("span",Jt,[b(d(lt),{class:"w-4 h-4"}),a[6]||(a[6]=I(" العميل ",-1))]),b(C,{to:"/customers",class:"text-xs text-primary-600 hover:text-primary-800"},{default:U(()=>[...a[7]||(a[7]=[I(" + إضافة جديد ",-1)])]),_:1})]),t("select",{value:((_=d(i).customer)==null?void 0:_.id)||"",onChange:a[0]||(a[0]=c=>p(c.target.value)),class:"w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"},[a[8]||(a[8]=t("option",{value:""},"عميل نقدي (غير مسجل)",-1)),(m(!0),h(D,null,z(d(o).customers,c=>(m(),h("option",{key:c.id,value:c.id},y(c.name),9,Yt))),128))],40,Rt)]),t("div",te,[a[9]||(a[9]=t("span",null,"المجموع الفرعي",-1)),t("span",null,y(d($)(u.value)),1)]),t("div",ee,[t("span",se,[I(y(e.$t("cashier.discount"))+" ",1),b(d(bt),{class:"w-4 h-4"})]),t("div",oe,[t("input",{type:"number",value:w.value,onInput:a[1]||(a[1]=c=>s(Number(c.target.value))),min:"0",disabled:g.value,class:"w-full text-left border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-400",placeholder:"0"},null,40,ae)])]),t("div",ie,[a[10]||(a[10]=t("label",{for:"specialDiscount",class:"text-sm text-gray-700 cursor-pointer select-none"},"خصم خاص (41.66%)",-1)),N(t("input",{type:"checkbox",id:"specialDiscount","onUpdate:modelValue":a[2]||(a[2]=c=>g.value=c),class:"rounded text-primary-600 focus:ring-primary-500 w-4 h-4 cursor-pointer"},null,512),[[J,g.value]])]),t("div",re,[t("span",ne,y(e.$t("cashier.total")),1),t("span",le,y(d($)(v.value)),1)]),t("div",de,[t("button",{onClick:a[3]||(a[3]=c=>e.$emit("print")),disabled:x.value.length===0,class:"flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-lg shadow transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"},[b(d(dt),{class:"w-5 h-5 ml-2"}),a[11]||(a[11]=I(" طباعة ",-1))],8,ce),t("button",{onClick:a[4]||(a[4]=c=>e.$emit("checkout")),disabled:x.value.length===0,class:"flex-[2] bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg shadow transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"},[b(d(V),{class:"w-5 h-5 ml-2"}),I(" "+y(e.$t("cashier.pay")),1)],8,ue)])])])}}},pe={class:"bg-white rounded-lg shadow-xl overflow-hidden max-w-2xl w-full mx-4"},he={class:"p-4 border-b bg-primary-50 flex justify-between items-center"},ye={class:"text-xl font-bold text-gray-800"},be={class:"p-6"},ve={class:"text-center mb-8"},fe={class:"text-gray-500 mb-1"},ge={class:"text-4xl font-bold text-primary-600"},xe={class:"grid grid-cols-3 gap-4 mb-6"},$e={key:0,class:"space-y-4"},we={class:"relative"},_e={class:"grid grid-cols-4 gap-2"},ke=["onClick"],Ce={key:0,class:"bg-green-50 p-4 rounded-lg flex justify-between items-center"},Se={class:"text-xl font-bold text-green-700"},Ie={class:"p-4 bg-gray-50 border-t flex gap-3"},je=["disabled"],Pe=["disabled"],qe={__name:"PaymentBox",props:{total:{type:Number,required:!0},hasCustomer:{type:Boolean,default:!1}},emits:["close","confirm"],setup(n,{emit:i}){const o=n,x=i,u=P("cash"),v=P(0),w=(g=!0)=>{x("confirm",{method:u.value,received:u.value==="cash"?v.value:o.total,shouldPrint:g,change:u.value==="cash"?Math.max(0,v.value-o.total):0})};return(g,r)=>(m(),h("div",pe,[t("div",he,[t("h3",ye,y(g.$t("cashier.payment_method")),1),t("button",{onClick:r[0]||(r[0]=l=>g.$emit("close")),class:"text-gray-500 hover:text-gray-700"},[b(d(vt),{class:"w-6 h-6"})])]),t("div",be,[t("div",ve,[t("p",fe,y(g.$t("cashier.total")),1),t("p",ge,y(d($)(n.total)),1)]),t("div",xe,[t("button",{onClick:r[1]||(r[1]=l=>u.value="cash"),class:T(["p-4 border rounded-xl flex flex-col items-center justify-center transition-all",u.value==="cash"?"border-primary-500 bg-primary-50 text-primary-700":"border-gray-200 hover:bg-gray-50"])},[b(d(mt),{class:"w-8 h-8 mb-2"}),r[7]||(r[7]=t("span",{class:"font-medium"},"نقدي",-1))],2),t("button",{onClick:r[2]||(r[2]=l=>u.value="card"),class:T(["p-4 border rounded-xl flex flex-col items-center justify-center transition-all",u.value==="card"?"border-primary-500 bg-primary-50 text-primary-700":"border-gray-200 hover:bg-gray-50"])},[b(d(V),{class:"w-8 h-8 mb-2"}),r[8]||(r[8]=t("span",{class:"font-medium"},"ماستر كارد",-1))],2),n.hasCustomer?(m(),h("button",{key:0,onClick:r[3]||(r[3]=l=>u.value="credit"),class:T(["p-4 border rounded-xl flex flex-col items-center justify-center transition-all",u.value==="credit"?"border-primary-500 bg-primary-50 text-primary-700":"border-gray-200 hover:bg-gray-50"])},[b(d(ct),{class:"w-8 h-8 mb-2"}),r[9]||(r[9]=t("span",{class:"font-medium"},"آجل (دين)",-1))],2)):M("",!0)]),u.value==="cash"?(m(),h("div",$e,[t("div",null,[r[10]||(r[10]=t("label",{class:"block text-sm font-medium text-gray-700 mb-1"},"المبلغ المدفوع",-1)),t("div",we,[N(t("input",{"onUpdate:modelValue":r[4]||(r[4]=l=>v.value=l),type:"number",class:"w-full text-2xl p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 text-center",placeholder:"0"},null,512),[[B,v.value,void 0,{number:!0}]])])]),t("div",_e,[(m(),h(D,null,z([1e3,5e3,1e4,25e3],l=>t("button",{key:l,onClick:f=>v.value=l,class:"py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm font-medium"},y(d($)(l)),9,ke)),64))]),v.value>=n.total?(m(),h("div",Ce,[r[11]||(r[11]=t("span",{class:"text-green-800 font-medium"},"المتبقي",-1)),t("span",Se,y(d($)(v.value-n.total)),1)])):M("",!0)])):M("",!0)]),t("div",Ie,[t("button",{onClick:r[5]||(r[5]=l=>w(!1)),disabled:u.value==="cash"&&v.value<n.total,class:"flex-1 bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"}," حفظ فقط ",8,je),t("button",{onClick:r[6]||(r[6]=l=>w(!0)),disabled:u.value==="cash"&&v.value<n.total,class:"flex-1 bg-primary-600 text-white font-bold py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"}," حفظ وطباعة ",8,Pe)])]))}},Me={class:"h-full flex flex-col lg:flex-row gap-4 overflow-hidden"},De={class:"flex-1 h-1/2 lg:h-full overflow-hidden"},ze={class:"w-full lg:w-96 h-1/2 lg:h-full overflow-hidden"},Le={key:0,class:"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"},Xe={__name:"Cashier",setup(n){const i=R(),o=H(),x=Y(),u=tt(),v=et(),w=P(!1);st(()=>{i.fetchProducts()});const g=s=>{o.addToCart(s)},r=()=>{var e,a;const s=v.currentUser,p={id:"TEMP-"+Date.now(),items:[...o.items],subtotal:o.subtotal,discount:o.discount,total:o.total,payment:{method:"N/A"},date:new Date,userId:s==null?void 0:s.id,branchId:s==null?void 0:s.branchId,customerId:(e=o.customer)==null?void 0:e.id,customerName:(a=o.customer)==null?void 0:a.name};f(p,!0)},l=s=>{var a,C;const p=v.currentUser,e={id:Date.now(),items:[...o.items],subtotal:o.subtotal,discount:o.discount,total:o.total,payment:s,date:new Date,userId:p==null?void 0:p.id,branchId:p==null?void 0:p.branchId,customerId:(a=o.customer)==null?void 0:a.id,customerName:(C=o.customer)==null?void 0:C.name};x.addSale(e),s.shouldPrint&&f(e),o.clearCart(),w.value=!1},f=(s,p=!1)=>{const e=u,a=p?"عرض سعر":`فاتورة #${s.id}`,C=e.invoicePaperSize||"80mm",_=(e.invoiceFontSize||12)+"px",c=e.invoiceFontSize||12,L=s.items.map(q=>`
    <tr>
      <td style="padding: 5px; border-bottom: 1px solid #eee;">${q.name}</td>
      <td style="padding: 5px; border-bottom: 1px solid #eee;">${q.quantity}</td>
      <td style="padding: 5px; border-bottom: 1px solid #eee;">${$(q.price)}</td>
      <td style="padding: 5px; border-bottom: 1px solid #eee;">${$(q.price*q.quantity)}</td>
    </tr>
  `).join(""),O={cash:"نقدي",card:"ماستر كارد",credit:"آجل (دين)"}[s.payment.method]||s.payment.method,E=e.showSocialMediaOnInvoice?`
    <div style="margin-bottom: 15px; border-bottom: 1px dashed #000; padding-bottom: 10px;">
       ${e.facebookUrl?`<div>${e.facebookUrl} :Fb</div>`:""}
       ${e.instagramUrl?`<div>${e.instagramUrl} :Insta</div>`:""}
       ${e.telegramUrl?`<div>${e.telegramUrl} :Tele</div>`:""}
       ${e.websiteUrl?`<div>${e.websiteUrl} :Web</div>`:""}
       ${e.email?`<div>${e.email}</div>`:""}
    </div>
  `:"",G=e.showLogoOnInvoice?e.invoiceLogoUrl?`<img src="${e.invoiceLogoUrl}" style="max-width: 80%; max-height: 100px; display: block; margin: 0 auto 10px auto;">`:'<div style="margin-bottom:10px; font-weight:bold; border:2px solid black; padding:5px; display:inline-block;">LOGO</div>':"",W=`
    <html>
      <head>
        <title>${a}</title>
        <style>
          body { font-family: 'Arial', sans-serif; direction: rtl; padding: 10px; width: ${C}; margin: 0 auto; font-size: ${_}; }
          .header { text-align: center; margin-bottom: 20px; }
          .header h2 { margin: 0; font-size: ${c+4}px; }
          .meta { margin-bottom: 15px; font-size: ${_}; }
          table { width: 100%; border-collapse: collapse; font-size: ${_}; }
          th { text-align: right; border-bottom: 2px solid #000; padding: 5px; }
          .totals { margin-top: 20px; border-top: 2px solid #000; padding-top: 10px; }
          .totals div { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .footer { margin-top: 30px; text-align: center; font-size: ${_}; }
        </style>
      </head>
      <body>
        <div class="header">
          ${G}
          <h2>${e.shopName}</h2>
          <p style="margin: 5px 0; color: #666;">${e.address}</p>
          <p style="margin: 5px 0; color: #666;">${e.phone}</p>
          ${e.invoiceHeader?`<p style="margin-top:5px; font-weight:bold;">${e.invoiceHeader}</p>`:""}
          <h3 style="margin-top: 10px; border-top: 1px dashed #000; padding-top: 5px; font-size: ${c+2}px;">${a}</h3>
        </div>
        
        <div class="meta">
          <div>${p?"رقم العرض":"رقم الفاتورة"}: #${s.id}</div>
          ${e.showDate!==!1?`<div>التاريخ: ${ut(s.date)}</div>`:""}
          ${!p&&s.payment?`<div>طريقة الدفع: ${O}</div>`:""}
          ${e.showCustomerInfo&&s.customerName?`<div>العميل: ${s.customerName}</div>`:""}
          ${e.showCashierName?"<div>الكاشير: محمد</div>":""}
          ${s.payment.method==="credit"?'<div style="font-weight: bold; color: red;">* فاتورة آجلة (دين)</div>':""}
        </div>

        <table>
          <thead>
            <tr>
              <th>المنتج</th>
              <th>الكمية</th>
              <th>السعر</th>
              <th>المجموع</th>
            </tr>
          </thead>
          <tbody>
            ${L}
          </tbody>
        </table>

        <div class="totals">
          ${s.discount>0?`
            <div>
              <span>المجموع الفرعي:</span>
              <span>${$(s.subtotal||s.total+s.discount)}</span>
            </div>
            <div>
              <span>الخصم:</span>
              <span>${$(s.discount)}</span>
            </div>
          `:""}
          <div style="font-weight: bold; font-size: ${c+2}px;">
            <span>المجموع الكلي:</span>
            <span>${$(s.total)}</span>
          </div>
        </div>

        <div class="footer">
          ${E}
          <p>${e.invoiceFooter||""}</p>
        </div>
      </body>
    </html>
  `,S=window.open("","","height=600,width=400");S.document.write(W),S.document.close(),S.onload=()=>{S.focus(),S.print(),S.close()}};return(s,p)=>(m(),h("div",Me,[t("div",De,[b(Dt,{products:d(i).getAllProducts,onAddToCart:g},null,8,["products"])]),t("div",ze,[b(me,{onCheckout:p[0]||(p[0]=e=>w.value=!0),onPrint:r})]),b(ot,{name:"modal"},{default:U(()=>[w.value?(m(),h("div",Le,[b(qe,{total:d(o).total,"has-customer":!!d(o).customer,onClose:p[1]||(p[1]=e=>w.value=!1),onConfirm:l},null,8,["total","has-customer"])])):M("",!0)]),_:1})]))}};export{Xe as default};
