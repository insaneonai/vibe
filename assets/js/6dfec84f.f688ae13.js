"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[2561],{7334:(e,n,t)=>{t.d(n,{R:()=>d,x:()=>l});var s=t(4700);const i={},r=s.createContext(i);function d(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:d(e.components),s.createElement(r.Provider,{value:n},e.children)}},9801:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>o,contentTitle:()=>l,default:()=>a,frontMatter:()=>d,metadata:()=>s,toc:()=>c});const s=JSON.parse('{"id":"getting-started/intro","title":"Installation","description":"This guide will help you set up ViBe on your local machine for development.","source":"@site/docs/getting-started/intro.md","sourceDirName":"getting-started","slug":"/getting-started/intro","permalink":"/vibe/docs/getting-started/intro","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/getting-started/intro.md","tags":[],"version":"current","frontMatter":{"title":"Installation"},"sidebar":"tutorialSidebar","previous":{"title":"Getting Started","permalink":"/vibe/docs/category/getting-started"},"next":{"title":"Project Structure","permalink":"/vibe/docs/getting-started/project-structure"}}');var i=t(7968),r=t(7334);const d={title:"Installation"},l=void 0,o={},c=[{value:"\ud83e\uddf0 Requirements",id:"-requirements",level:2},{value:"\ud83d\ude80 Clone the Repository",id:"-clone-the-repository",level:2},{value:"\u2699\ufe0f Setup Using Python",id:"\ufe0f-setup-using-python",level:2},{value:"\ud83d\udce6 Run the Setup",id:"-run-the-setup",level:3},{value:"\ud83e\uddea Run in Development Mode",id:"-run-in-development-mode",level:2},{value:"\ud83d\udda5 Frontend",id:"-frontend",level:3},{value:"\u2699\ufe0f Backend",id:"\ufe0f-backend",level:3},{value:"\ud83d\udce6 Build Docusaurus (Docs)",id:"-build-docusaurus-docs",level:2},{value:"\ud83d\udc1b Having Issues?",id:"-having-issues",level:2},{value:"\ud83d\udcda What&#39;s Next?",id:"-whats-next",level:2}];function h(e){const n={a:"a",blockquote:"blockquote",code:"code",h2:"h2",h3:"h3",hr:"hr",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.p,{children:"This guide will help you set up ViBe on your local machine for development."}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.h2,{id:"-requirements",children:"\ud83e\uddf0 Requirements"}),"\n",(0,i.jsx)(n.p,{children:"Before you begin, make sure you have the following installed:"}),"\n",(0,i.jsxs)(n.table,{children:[(0,i.jsx)(n.thead,{children:(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.th,{children:"Tool"}),(0,i.jsx)(n.th,{children:"Required Version"}),(0,i.jsx)(n.th,{children:"Notes"})]})}),(0,i.jsxs)(n.tbody,{children:[(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:(0,i.jsx)(n.strong,{children:"Git"})}),(0,i.jsx)(n.td,{children:"any"}),(0,i.jsx)(n.td,{children:"For cloning the repository"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:(0,i.jsx)(n.strong,{children:"Python"})}),(0,i.jsx)(n.td,{children:"3.8+"}),(0,i.jsx)(n.td,{children:"Used to bootstrap both frontend and backend"})]})]})]}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.h2,{id:"-clone-the-repository",children:"\ud83d\ude80 Clone the Repository"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"git clone https://github.com/continuousactivelearning/vibe.git\ncd vibe\n"})}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.h2,{id:"\ufe0f-setup-using-python",children:"\u2699\ufe0f Setup Using Python"}),"\n",(0,i.jsxs)(n.p,{children:["ViBe uses a custom ",(0,i.jsx)(n.code,{children:"setup.py"})," script to help initialize the development environment (both backend and frontend)."]}),"\n",(0,i.jsx)(n.h3,{id:"-run-the-setup",children:"\ud83d\udce6 Run the Setup"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"python setup.py\n"})}),"\n",(0,i.jsx)(n.p,{children:"This script will:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Check required dependencies"}),"\n",(0,i.jsx)(n.li,{children:"Install backend dependencies"}),"\n",(0,i.jsx)(n.li,{children:"Install frontend dependencies"}),"\n",(0,i.jsxs)(n.li,{children:["Set up ",(0,i.jsx)(n.code,{children:".env"})," files"]}),"\n",(0,i.jsx)(n.li,{children:"Start both servers (or give you options)"}),"\n"]}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsx)(n.p,{children:"\ud83d\udee0\ufe0f The script is interactive and will guide you step-by-step."}),"\n"]}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.h2,{id:"-run-in-development-mode",children:"\ud83e\uddea Run in Development Mode"}),"\n",(0,i.jsx)(n.p,{children:"If you want to run services manually:"}),"\n",(0,i.jsx)(n.h3,{id:"-frontend",children:"\ud83d\udda5 Frontend"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"cd frontend\npnpm run dev\n"})}),"\n",(0,i.jsx)(n.h3,{id:"\ufe0f-backend",children:"\u2699\ufe0f Backend"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"cd backend\npnpm run dev\n"})}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.h2,{id:"-build-docusaurus-docs",children:"\ud83d\udce6 Build Docusaurus (Docs)"}),"\n",(0,i.jsx)(n.p,{children:"If you're contributing to the documentation:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"cd docs\npnpm install\npnpm run start\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Visit: ",(0,i.jsx)(n.code,{children:"http://localhost:3000/docs"})]}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.h2,{id:"-having-issues",children:"\ud83d\udc1b Having Issues?"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Make sure all dependencies are installed correctly"}),"\n",(0,i.jsxs)(n.li,{children:["Use ",(0,i.jsx)(n.code,{children:"python --version"}),", ",(0,i.jsx)(n.code,{children:"node -v"}),", ",(0,i.jsx)(n.code,{children:"pnpm -v"})," to verify versions"]}),"\n",(0,i.jsxs)(n.li,{children:["Open an issue or ask in the ",(0,i.jsx)(n.a,{href:"https://github.com/continuousactivelearning/vibe/discussions",children:"GitHub Discussions"})]}),"\n"]}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.h2,{id:"-whats-next",children:"\ud83d\udcda What's Next?"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"/vibe/docs/getting-started/project-structure",children:"Explore the Project Structure"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"/vibe/docs/development/architecture",children:"Understand the Architecture"})}),"\n"]})]})}function a(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}}}]);