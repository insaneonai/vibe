"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[6833],{5259:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>a,contentTitle:()=>u,default:()=>p,frontMatter:()=>c,metadata:()=>n,toc:()=>d});const n=JSON.parse('{"id":"contributing/plan","title":"Issues Summary","description":"Summary","source":"@site/docs/contributing/plan.mdx","sourceDirName":"contributing","slug":"/contributing/plan","permalink":"/vibe/docs/contributing/plan","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/contributing/plan.mdx","tags":[],"version":"current","frontMatter":{"title":"Issues Summary"},"sidebar":"tutorialSidebar","previous":{"title":"Pull Request Convention","permalink":"/vibe/docs/contributing/conventions/pr-guide"},"next":{"title":"Development","permalink":"/vibe/docs/category/development"}}');var r=s(3420),i=s(8356),l=s(6672);const c={title:"Issues Summary"},u=void 0,a={},o=function(){const[e,t]=(0,l.useState)([]),[s,n]=(0,l.useState)(!0),i=/^(?<type>\w+)\((?<scope>[^)]+)\):\s*(?<subject>.+)$/;(0,l.useEffect)((()=>{!async function(){try{const e=await fetch("https://api.github.com/repos/continuousactivelearning/vibe/issues"),s=(await e.json()).filter((e=>!e.pull_request&&i.test(e.title))),n={};s.forEach((e=>{const t=e.title.match(i);if(!t)return;const{type:s,scope:r,subject:l}=t.groups,c=`${r}|||${l}`;n[c]||(n[c]={scope:r,subject:l,devIssue:null,testIssue:null,issues:[],labels:[]}),n[c].issues.push({number:e.number,url:e.html_url}),e.labels&&Array.isArray(e.labels)&&e.labels.forEach((e=>{n[c].labels.includes(e.name)||n[c].labels.push(e.name)})),"test"===s.toLowerCase()?n[c].testIssue=e:n[c].devIssue=e})),t(Object.values(n))}catch(e){console.error("Error fetching issues:",e)}finally{n(!1)}}()}),[]);const c=e=>"closed"===e?"\u2705":"\u274c",u=e=>{if(!e)return null;let t=[];return e.assignees&&e.assignees.length>0?t=e.assignees:e.assignee&&(t=[e.assignee]),t.map(((e,t)=>(0,r.jsx)("a",{href:e.html_url,target:"_blank",rel:"noopener noreferrer",title:e.login,style:{marginRight:"0.5rem",display:"inline-block"},children:(0,r.jsx)("img",{src:e.avatar_url,alt:e.login,style:{width:"24px",height:"24px",borderRadius:"50%",objectFit:"cover"}})},t)))};return(0,r.jsx)("div",{children:s?(0,r.jsx)("p",{children:"Loading issues..."}):(0,r.jsxs)("table",{style:{borderCollapse:"collapse",width:"100%"},border:"1",cellPadding:"6",children:[(0,r.jsx)("thead",{children:(0,r.jsxs)("tr",{children:[(0,r.jsx)("th",{children:"Module"}),(0,r.jsx)("th",{children:"Subject"}),(0,r.jsx)("th",{style:{textAlign:"center"},children:"Dev Status"}),(0,r.jsx)("th",{style:{textAlign:"center"},children:"Test Status"}),(0,r.jsx)("th",{children:"Dev By"}),(0,r.jsx)("th",{children:"Test By"}),(0,r.jsx)("th",{children:"Tags"}),(0,r.jsx)("th",{children:"Issue Links"})]})}),(0,r.jsx)("tbody",{children:e.map(((e,t)=>{const s=e.devIssue?c(e.devIssue.state):"",n=e.testIssue?c(e.testIssue.state):"",i=e.devIssue?u(e.devIssue):"",l=e.testIssue?u(e.testIssue):"",a=e.labels.join(", ");return(0,r.jsxs)("tr",{children:[(0,r.jsx)("td",{children:e.scope}),(0,r.jsx)("td",{children:e.subject}),(0,r.jsx)("td",{style:{textAlign:"center"},children:s}),(0,r.jsx)("td",{style:{textAlign:"center"},children:n}),(0,r.jsx)("td",{style:{textAlign:"center"},children:i}),(0,r.jsx)("td",{style:{textAlign:"center"},children:l}),(0,r.jsx)("td",{children:a}),(0,r.jsx)("td",{children:e.issues.map(((t,s)=>(0,r.jsxs)("span",{children:[(0,r.jsxs)("a",{href:t.url,target:"_blank",rel:"noopener noreferrer",children:["#",t.number]}),s<e.issues.length-1?", ":""]},s)))})]},t)}))})]})})},d=[{value:"Summary",id:"summary",level:2}];function h(e){const t={h2:"h2",...(0,i.R)(),...e.components};return(0,r.jsx)(t.h2,{id:"summary",children:"Summary"})}function p(e={}){return(0,r.jsx)(o,{...e,children:(0,r.jsx)(h,{...e})})}},8356:(e,t,s)=>{s.d(t,{R:()=>l,x:()=>c});var n=s(6672);const r={},i=n.createContext(r);function l(e){const t=n.useContext(i);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function c(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:l(e.components),n.createElement(i.Provider,{value:t},e.children)}}}]);