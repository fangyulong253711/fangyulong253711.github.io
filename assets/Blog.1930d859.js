var l=Object.defineProperty;var n=Object.getOwnPropertySymbols;var i=Object.prototype.hasOwnProperty,m=Object.prototype.propertyIsEnumerable;var r=(s,a,e)=>a in s?l(s,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[a]=e,t=(s,a)=>{for(var e in a||(a={}))i.call(a,e)&&r(s,e,a[e]);if(n)for(var e of n(a))m.call(a,e)&&r(s,e,a[e]);return s};import{h as p,n as g,p as f,k as o,B as d,z as u,D as B,I as b,A as c,E as v,r as I}from"./app.9d0d0a36.js";import{S as h}from"./SkipLink.9e2e19f4.js";var S=p({name:"Blog",setup(){const s=g(),a=f();return()=>[o(h),o(I("CommonWrapper"),{sidebar:!1},t({default:()=>s.value.home?o(d):o("main",{class:"page blog",id:"main-content"},o("div",{class:"blog-page-wrapper"},[o(u),o(B,{delay:.16},()=>o(b))])),navScreenBottom:()=>o(c)},a.value?{sidebar:()=>o(v)}:{}))]}});export{S as default};
