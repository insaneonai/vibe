"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[7439],{6446:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>o,contentTitle:()=>d,default:()=>h,frontMatter:()=>c,metadata:()=>t,toc:()=>l});const t=JSON.parse('{"id":"development/architecture","title":"System Architecture","description":"ViBe is a full-stack, serverless web application built for continuous active learning, designed to scale efficiently and support modular growth. It features a split frontend for students and admins, and a microservice-style backend using serverless Express functions deployed on Google Cloud.","source":"@site/docs/development/architecture.md","sourceDirName":"development","slug":"/development/architecture","permalink":"/vibe/docs/development/architecture","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/development/architecture.md","tags":[],"version":"current","frontMatter":{"title":"System Architecture"},"sidebar":"tutorialSidebar","previous":{"title":"Development","permalink":"/vibe/docs/category/development"},"next":{"title":"API Documentation","permalink":"/vibe/docs/category/api-documentation"}}');var r=s(3420),i=s(8356);const c={title:"System Architecture"},d=void 0,o={},l=[{value:"\ud83c\udf10 Tech Stack Overview",id:"-tech-stack-overview",level:2},{value:"\u2699\ufe0f Serverless Architecture",id:"\ufe0f-serverless-architecture",level:2},{value:"\ud83d\udce6 Backend Modules",id:"-backend-modules",level:2},{value:"\ud83c\udfa8 Frontend Layout",id:"-frontend-layout",level:2}];function a(e){const n={code:"code",h2:"h2",hr:"hr",li:"li",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.p,{children:"ViBe is a full-stack, serverless web application built for continuous active learning, designed to scale efficiently and support modular growth. It features a split frontend for students and admins, and a microservice-style backend using serverless Express functions deployed on Google Cloud."}),"\n",(0,r.jsx)(n.h2,{id:"-tech-stack-overview",children:"\ud83c\udf10 Tech Stack Overview"}),"\n",(0,r.jsxs)(n.table,{children:[(0,r.jsx)(n.thead,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.th,{children:"Layer"}),(0,r.jsx)(n.th,{children:"Tech Used"})]})}),(0,r.jsxs)(n.tbody,{children:[(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Frontend"}),(0,r.jsx)(n.td,{children:"React (Vite)"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Backend"}),(0,r.jsx)(n.td,{children:"Express.js"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Database"}),(0,r.jsx)(n.td,{children:"MongoDB (Atlas)"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Auth"}),(0,r.jsx)(n.td,{children:"Google Firebase Authentication"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Hosting"}),(0,r.jsx)(n.td,{children:"Google Cloud Functions"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Storage"}),(0,r.jsx)(n.td,{children:"Firebase Storage (or GCP Buckets)"})]})]})]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h2,{id:"\ufe0f-serverless-architecture",children:"\u2699\ufe0f Serverless Architecture"}),"\n",(0,r.jsxs)(n.p,{children:["The ViBe backend is composed of several independent Express modules, each deployed as a ",(0,r.jsx)(n.strong,{children:"Google Cloud Function"}),". This allows:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Independent scaling of services"}),"\n",(0,r.jsx)(n.li,{children:"Faster cold starts per function"}),"\n",(0,r.jsx)(n.li,{children:"Logical separation of business concerns"}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h2,{id:"-backend-modules",children:"\ud83d\udce6 Backend Modules"}),"\n",(0,r.jsx)(n.p,{children:"Each backend service is a standalone Express app deployed as a serverless function:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"auth"})," \u2013 Authentication & user verification (via Firebase)"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"users"})," \u2013 Student/teacher data"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"courses"})," \u2013 Course structure, access control"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"quizzes"})," \u2013 Quiz content, question rotation"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"grader"})," \u2013 Scoring logic, bonus handling"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"activity"})," \u2013 Monitoring video/screen presence"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"ratings"})," \u2013 Feedback and engagement scoring"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"ai"})," \u2013 Question generation, hinting, proctoring checks"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"messenger"})," \u2013 Internal communication or alerting module"]}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h2,{id:"-frontend-layout",children:"\ud83c\udfa8 Frontend Layout"}),"\n",(0,r.jsxs)(n.p,{children:["ViBe has ",(0,r.jsx)(n.strong,{children:"two separate frontend apps"}),":"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Student Frontend"}),": The main learning interface"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Admin Frontend"}),": Tools for teachers to add/edit content, track progress, review contributions"]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(a,{...e})}):a(e)}},8356:(e,n,s)=>{s.d(n,{R:()=>c,x:()=>d});var t=s(6672);const r={},i=t.createContext(r);function c(e){const n=t.useContext(i);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:c(e.components),t.createElement(i.Provider,{value:n},e.children)}}}]);