var o=Object.defineProperty;var r=Object.getOwnPropertyDescriptor;var p=Object.getOwnPropertyNames;var c=Object.prototype.hasOwnProperty;var d=(t,e)=>{for(var n in e)o(t,n,{get:e[n],enumerable:!0})},u=(t,e,n,l)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of p(e))!c.call(t,a)&&a!==n&&o(t,a,{get:()=>e[a],enumerable:!(l=r(e,a))||l.enumerable});return t};var b=t=>u(o({},"__esModule",{value:!0}),t);var h={};d(h,{default:()=>f});module.exports=b(h);var f=[{match:/^#!.*|--(\[(=*)\[((?!--\]\2\])[^])*--\]\2\]|.*)/g,sub:"todo"},{expand:"str"},{type:"kwd",match:/\b(and|break|do|else|elseif|end|for|function|if|in|local|not|or|repeat|return|then|until|while)\b/g},{type:"bool",match:/\b(true|false|nil)\b/g},{type:"oper",match:/[+*/%^#=~<>:,.-]+/g},{expand:"num"},{type:"func",match:/[a-z_]+(?=\s*[({])/g}];0&&(module.exports={});
