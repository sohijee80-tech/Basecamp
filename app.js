/* ===================================================================
   BASECAMP STUDIO 2026 — interactive engine
   =================================================================== */
'use strict';
const PINK='#FF5A2E';
const PALETTE=['#FF5A2E','#ff7aa9','#EBE5D1','#8A9990','#AB725A','#6fa8dc','#d6a25a','#b388e0','#5fb6a3'];
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile=()=>window.innerWidth<=760;

/* ===================================================================
   BIG NUMBERS — parallax cards
   =================================================================== */
(function(){
  const cards=[...document.querySelectorAll('.bncard')];if(!cards.length)return;
  const reduce=reduceMotion;

  // parallax tilt + layered depth
  if(!reduce){
    cards.forEach(card=>{
      const inner=card.querySelector('.bn-inner'), glow=card.querySelector('.bn-glow');
      card.addEventListener('mousemove',e=>{
        const r=card.getBoundingClientRect();
        const px=(e.clientX-r.left)/r.width-0.5, py=(e.clientY-r.top)/r.height-0.5;
        card.style.transform=`rotateY(${px*9}deg) rotateX(${-py*9}deg) translateY(-6px)`;
        inner.style.transform=`translate(${px*18}px,${py*18}px) translateZ(40px)`;
        if(glow)glow.style.transform=`translate(${px*55+r.width*0.18}px,${py*55}px)`;
      });
      card.addEventListener('mouseleave',()=>{
        card.style.transform='';inner.style.transform='';if(glow)glow.style.transform='';
      });
    });
  }

  // count-up on view
  const seen=new Set();
  const io2=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting||seen.has(e.target))return;seen.add(e.target);
    const card=e.target,num=card.querySelector('.bn-num');
    const pre=card.dataset.pre||'',suf=card.dataset.suf||'',target=+card.dataset.target;
    let c=0,step=Math.max(1,target/45);
    const iv=setInterval(()=>{c+=step;if(c>=target){c=target;clearInterval(iv);}num.textContent=pre+Math.floor(c)+suf;},24);
  }),{threshold:.5});
  cards.forEach(c=>io2.observe(c));
})();

/* ===================================================================
   LIVING DATA EXPERIENCE — 7 interactive cards
   =================================================================== */
(function(){
  const PAL=['#FF5A2E','#ff7aa9','#EBE5D1','#8A9990','#AB725A','#6fa8dc','#d6a25a','#b388e0','#5fb6a3'];
  const NAMES=['Ana','Lucas','Marina','Diego','Sofia','Rafael','Camila','Bruno','Yuki','Omar','Elena','Tomás','Nadia','Felipe','Iris','Karim','Lara','Pedro','Mei','Noah'];
  const COUNTRIES=['Brazil','USA','Canada','Portugal','UAE','Vietnam','Mexico','UK','Spain','Korea'];
  const CITIES=['Miami','Chicago','São Paulo','Curitiba','Vancouver','Lisbon','Dubai','Bangkok','Rio','New York'];
  const rnd=a=>a[Math.floor(Math.random()*a.length)];
  function cvCtx(cv){const ctx=cv.getContext('2d');let dpr=Math.min(devicePixelRatio||1,2),w=0,h=0;
    function size(){const r=cv.getBoundingClientRect();w=r.width;h=r.height;cv.width=w*dpr;cv.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
    return {ctx,size,dims:()=>({w,h})};}
  function onView(el,cb){new IntersectionObserver(es=>es.forEach(e=>{e.isIntersecting?cb(true):cb(false);}),{threshold:.05}).observe(el);}

  /* ---- 01 Sales bars ---- */
  (function(){
    const host=document.getElementById('salesBars'), tip=document.getElementById('salesTip'); if(!host)return;
    const data=[
      {l:'Residential',pct:60,v:'$3.0B',w:92,p:220,c:'Tempo · Dóra · Quinta · Mansão Seara'},
      {l:'Masterplan',pct:13,v:'$0.65B',w:21,p:47,c:'Parc Autódromo · Bayn'},
      {l:'Mixed Use',pct:10,v:'$0.5B',w:16,p:37,c:'Okan Tower'},
      {l:'Branded Residences',pct:5,v:'$0.25B',w:9,p:18,c:'Colette · The Biltmore'},
      {l:'Hospitality',pct:5,v:'$0.25B',w:9,p:18,c:'The Boca Raton · Allard'},
      {l:'Commercial',pct:5,v:'$0.25B',w:9,p:18,c:'Selected commercial'},
      {l:'Cruises',pct:2,v:'$0.1B',w:5,p:7,c:'Celebrity River'}
    ];
    host.innerHTML=data.map(d=>`<div class="sbar" data-t="${d.l} — ${d.v} · ${d.pct}% · ${d.p} projects · ${d.c}"><div class="sbar-row"><span>${d.l}</span><b>${d.v}</b></div><div class="sbar-track"><div class="sbar-fill" data-w="${d.w}%"></div></div></div>`).join('');
    host.querySelectorAll('.sbar').forEach(b=>{
      b.addEventListener('mouseenter',()=>{tip.textContent=b.dataset.t;tip.classList.add('show');});
      b.addEventListener('mouseleave',()=>tip.classList.remove('show'));
    });
    new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){host.querySelectorAll('.sbar-fill').forEach(f=>f.style.width=f.dataset.w);}}),{threshold:.3}).observe(host);
  })();

  /* ---- 02 Projects particles ---- */
  (function(){
    const cv=document.getElementById('projCanvas'); if(!cv)return;
    const legend=document.getElementById('projLegend'); const {ctx,size,dims}=cvCtx(cv);
    const N=365;
    const MODES={
      country:[['USA',153],['Brazil',150],['Canada',48],['UAE',9],['Vietnam',2],['Europe',2],['Other',1]],
      year:[["'18",8],["'19",33],["'20",34],["'21",51],["'22",59],["'23",53],["'24",54],["'25",48],["'26",25]],
      asset:[['Residential',220],['Masterplan',47],['Mixed Use',37],['Branded Residences',18],['Hospitality',18],['Commercial',18],['Cruises',7]],
      service:[['CGI',325],['Film',143],['Floor Plans',125],['Branding',80],['Digital',40],['Strategy',28],['360°',20]]
    };
    function assign(groups){const out=[];groups.forEach((g,i)=>{for(let k=0;k<g[1];k++)out.push(i);});while(out.length<N)out.push(0);return out;}
    const groupBy={}; for(const m in MODES)groupBy[m]=assign(MODES[m]);
    let mode='country', centers={}, ps=[], running=false, raf, mx=-1, my=-1;
    for(let i=0;i<N;i++)ps.push({x:Math.random()*300,y:Math.random()*300,a:Math.random()*6.28,rad:6+Math.random()*30,sz:2+Math.random()*2.2});
    function calc(){const {w,h}=dims();centers={};for(const m in MODES){const g=MODES[m].length,cols=Math.ceil(Math.sqrt(g*(w/h))),rows=Math.ceil(g/cols),ax=w*0.12,ay=h*0.16,gw=(w-ax*2)/Math.max(cols-1,1),gh=(h-ay*2)/Math.max(rows-1,1),arr=[];for(let i=0;i<g;i++){const r=Math.floor(i/cols),c=i%cols,inrow=Math.min(cols,g-r*cols),off=(w-ax*2-(inrow-1)*gw)/2;arr.push({x:ax+off+c*gw,y:rows>1?ay+r*gh:h/2});}centers[m]=arr;}}
    function paintLegend(){legend.innerHTML=MODES[mode].map((g,i)=>`<span><i style="background:${PAL[i%PAL.length]}"></i>${g[0]} ${g[1]}</span>`).join('');}
    function frame(){const {w,h}=dims();ctx.clearRect(0,0,w,h);let near=null,nd=1e9;
      ps.forEach((p,i)=>{const gi=groupBy[mode][i],c=centers[mode][gi];p.a+=0.004;const tx=c.x+Math.cos(p.a)*p.rad,ty=c.y+Math.sin(p.a)*p.rad;p.x+=(tx-p.x)*0.06;p.y+=(ty-p.y)*0.06;
        ctx.beginPath();ctx.fillStyle=PAL[gi%PAL.length];ctx.globalAlpha=.85;ctx.arc(p.x,p.y,p.sz,0,6.3);ctx.fill();
        if(mx>=0){const d=Math.hypot(p.x-mx,p.y-my);if(d<nd){nd=d;near=gi;}}});
      ctx.globalAlpha=1;
      if(mx>=0&&near!=null&&nd<60){const g=MODES[mode][near];ctx.fillStyle='#fff';ctx.font='600 12px "Aaux Pro Medium",Arial';ctx.fillText(g[0]+' · '+g[1]+' projects',mx+10,my-8);}
      if(running)raf=requestAnimationFrame(frame);}
    function start(){if(running)return;running=true;frame();}function stop(){running=false;cancelAnimationFrame(raf);}
    size();calc();paintLegend();
    addEventListener('resize',()=>{size();calc();});
    cv.addEventListener('mousemove',e=>{const r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;});
    cv.addEventListener('mouseleave',()=>{mx=-1;my=-1;});
    document.querySelectorAll('#projFiltersLd button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#projFiltersLd button').forEach(x=>x.classList.remove('active'));b.classList.add('active');mode=b.dataset.mode;paintLegend();}));
    onView(cv,v=>{if(v){size();calc();start();}else stop();});
  })();

  /* ---- network helper (specialists / countries) ---- */
  function clusterCard(cvId,tipId,groups,opts){
    const cv=document.getElementById(cvId);if(!cv)return;const tip=document.getElementById(tipId);const {ctx,size,dims}=cvCtx(cv);
    let nodes=[],running=false,raf,t=0,mx=-1,my=-1;
    function build(){const {w,h}=dims();nodes=[];const G=groups.length,cols=Math.ceil(Math.sqrt(G*(w/h))),rows=Math.ceil(G/cols);
      groups.forEach((g,i)=>{const r=Math.floor(i/cols),c=i%cols,cx=(w/(cols+1))*(c+1),cy=(h/(rows+1))*(r+1);
        const count=opts.dots?Math.max(3,Math.round(g.n/opts.scale)):1;
        for(let k=0;k<count;k++)nodes.push({gi:i,bx:cx,by:cy,x:cx+(Math.random()-.5)*40,y:cy+(Math.random()-.5)*40,ph:Math.random()*6.3,r:opts.dots?2.6:((opts.base||12)+Math.min(opts.cap||34,Math.sqrt(g.n)*(opts.size||2.4))),g});});}
    function frame(){const {w,h}=dims();t+=0.01;ctx.clearRect(0,0,w,h);
      // links
      if(opts.links){ctx.strokeStyle='rgba(255,90,46,.10)';ctx.lineWidth=1;for(let i=0;i<nodes.length;i++){const a=nodes[i];for(let j=i+1;j<i+3&&j<nodes.length;j++){const b=nodes[j];if(a.gi===b.gi){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}}}
      let near=null,nd=1e9;
      nodes.forEach(n=>{n.x=n.bx+Math.cos(t+n.ph)*8;n.y=n.by+Math.sin(t*0.8+n.ph)*8;
        const on=(mx>=0&&Math.hypot(n.x-mx,n.y-my)<Math.max(10,n.r+4));if(mx>=0){const d=Math.hypot(n.x-mx,n.y-my);if(d<nd){nd=d;near=n;}}
        ctx.beginPath();ctx.fillStyle=on?'#fff':PAL[n.gi%PAL.length];ctx.globalAlpha=.9;ctx.arc(n.x,n.y,n.r,0,6.3);ctx.fill();
        if(!opts.dots){ctx.fillStyle='rgba(243,241,234,.75)';ctx.font='600 10px "Aaux Pro Medium",Arial';ctx.textAlign='center';ctx.fillText(n.g.label.toUpperCase(),n.x,n.y+n.r+12);}});
      ctx.globalAlpha=1;ctx.textAlign='left';
      if(tip){if(near&&nd<40){tip.innerHTML=opts.tip(near.g,near);tip.classList.add('show');}else tip.classList.remove('show');}
      if(running)raf=requestAnimationFrame(frame);}
    function start(){if(running)return;running=true;frame();}function stop(){running=false;cancelAnimationFrame(raf);}
    size();build();addEventListener('resize',()=>{size();build();});
    cv.addEventListener('mousemove',e=>{const r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;});
    cv.addEventListener('mouseleave',()=>{mx=-1;my=-1;});
    onView(cv,v=>{if(v){size();build();start();}else stop();});
  }

  /* ---- 03 Specialists — the human side (130 people split by indicator) ---- */
  (function(){
    const cv=document.getElementById('specCanvas'); if(!cv)return;
    const legend=document.getElementById('specLegend'); const {ctx,size,dims}=cvCtx(cv);
    const N=130;
    const MODES={
      gender:[['Men',64],['Women',36]],
      discipline:[['CGI',49],['Branding',12],['Film',9],['Operations',9],['Unreal',7],['Leadership',6],['Strategy',4],['Sales & Marketing',4]],
      seniority:[['Inter',29],['Senior',25],['Leader',13],['Inter II',13],['Manager',12],['C-Level',4],['Junior',4]],
      tenure:[['<1 yr',13],['1–3 yrs',24],['3–5 yrs',34],['5–7 yrs',23],['7+ yrs',6]]
    };
    function assign(groups){const out=[];groups.forEach((g,i)=>{for(let k=0;k<g[1];k++)out.push(i);});return out.slice(0,N);}
    const groupBy={}; for(const m in MODES)groupBy[m]=assign(MODES[m]);
    let mode='gender', centers={}, ps=[], running=false, raf;
    for(let i=0;i<N;i++)ps.push({a:Math.random()*6.28,rad:6+Math.random()*30,sz:2.4+Math.random()*2.2,x:Math.random()*300,y:Math.random()*180});
    function calc(){const {w,h}=dims();centers={};for(const m in MODES){const g=MODES[m].length,cols=Math.min(g,Math.max(2,Math.round(Math.sqrt(g*(w/h))))),rows=Math.ceil(g/cols),ay=h*0.24,gh=(h-ay*2)/Math.max(rows-1,1),pitch=Math.min(w*0.18,(w-w*0.14)/Math.max(cols-1,1)),arr=[];for(let i=0;i<g;i++){const r=Math.floor(i/cols),c=i%cols,inrow=Math.min(cols,g-r*cols),rowW=(inrow-1)*pitch,startX=(w-rowW)/2;arr.push({x:startX+c*pitch,y:rows>1?ay+r*gh:h*0.44});}centers[m]=arr;}}
    function paintLegend(){legend.innerHTML=MODES[mode].map((g,i)=>`<span><i style="background:${PAL[i%PAL.length]}"></i>${g[0]} · ${g[1]}%</span>`).join('');}
    function frame(){const {w,h}=dims();ctx.clearRect(0,0,w,h);const groups=MODES[mode];
      ps.forEach((p,i)=>{const gi=groupBy[mode][i],c=centers[mode][gi];if(!c)return;p.a+=0.005;const tx=c.x+Math.cos(p.a)*p.rad,ty=c.y+Math.sin(p.a)*p.rad;p.x+=(tx-p.x)*0.06;p.y+=(ty-p.y)*0.06;
        ctx.beginPath();ctx.fillStyle=PAL[gi%PAL.length];ctx.globalAlpha=.9;ctx.arc(p.x,p.y,p.sz,0,6.3);ctx.fill();});
      ctx.globalAlpha=1;ctx.textAlign='center';
      groups.forEach((g,i)=>{const c=centers[mode][i];if(!c)return;
        ctx.font='700 16px "Etna","Aaux Pro Medium",Arial';ctx.fillStyle='#fff';ctx.fillText(g[1]+'%',c.x,c.y+54);
        ctx.font='600 11px "Aaux Pro Medium",Arial';ctx.fillStyle=PAL[i%PAL.length];ctx.fillText(g[0].toUpperCase(),c.x,c.y+70);});
      ctx.textAlign='left';
      if(running)raf=requestAnimationFrame(frame);}
    function start(){if(running)return;running=true;frame();}function stop(){running=false;cancelAnimationFrame(raf);}
    size();calc();paintLegend();
    addEventListener('resize',()=>{size();calc();});
    document.querySelectorAll('#specFilters button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#specFilters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');mode=b.dataset.mode;paintLegend();}));
    onView(cv,v=>{if(v){size();calc();start();}else stop();});
  })();

  /* ---- 04 Countries (real project distribution, 365 projects → %) ---- */
  clusterCard('ctryCanvas','ctryTip',
    [{label:'USA · 42%',country:'United States',n:153,pct:42},
     {label:'Brazil · 41%',country:'Brazil',n:150,pct:41},
     {label:'Canada · 13%',country:'Canada',n:48,pct:13},
     {label:'UAE · 2%',country:'United Arab Emirates',n:9,pct:2},
     {label:'Vietnam · 1%',country:'Vietnam',n:2,pct:1},
     {label:'Europe · 1%',country:'Europe',n:2,pct:1}],
    {dots:false,size:3.2,base:16,cap:46,links:false,tip:(g)=>`<b style="color:#fff">${g.country}</b> · ${g.pct}% · ${g.n} projects`});

  /* ---- 05 Cities orbital ---- */
  (function(){
    const cv=document.getElementById('cityCanvas');if(!cv)return;const tip=document.getElementById('cityTip');const {ctx,size,dims}=cvCtx(cv);
    const cities=[['Miami',9],['Chicago',7],['São Paulo',8],['Curitiba',6],['Vancouver',5],['Lisbon',6],['Dubai',7],['Bangkok',4],['Rio',5],['New York',6]];
    let running=false,raf,t=0,mx=-1,my=-1,nodes=[];
    function build(){const {w,h}=dims();nodes=cities.map((c,i)=>({label:c[0],v:c[1],ang:(i/cities.length)*6.283,rad:Math.min(w,h)*(0.22+(i%3)*0.1),sz:4+c[1]*0.9}));}
    function frame(){const {w,h}=dims();t+=0.004;ctx.clearRect(0,0,w,h);const cx=w/2,cy=h/2;
      ctx.strokeStyle='rgba(255,255,255,.05)';nodes.forEach(n=>{ctx.beginPath();ctx.arc(cx,cy,n.rad,0,6.3);ctx.stroke();});
      ctx.beginPath();ctx.fillStyle=PINK;ctx.arc(cx,cy,16,0,6.3);ctx.fill();ctx.fillStyle='#fff';ctx.font='700 9px "Etna",Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('ES',cx,cy);
      let near=null,nd=1e9;
      nodes.forEach(n=>{const a=n.ang+t*(0.6+n.v*0.04);const x=cx+Math.cos(a)*n.rad,y=cy+Math.sin(a)*n.rad;n._x=x;n._y=y;
        if(mx>=0){const d=Math.hypot(x-mx,y-my);if(d<nd){nd=d;near=n;}}
        const on=(mx>=0&&Math.hypot(x-mx,y-my)<n.sz+5);
        ctx.beginPath();ctx.fillStyle=on?'#fff':'rgba(255,90,46,.85)';ctx.arc(x,y,n.sz,0,6.3);ctx.fill();
        ctx.fillStyle='rgba(243,241,234,.6)';ctx.font='500 9px "Aaux Pro Medium",Arial';ctx.fillText(n.label,x,y-n.sz-7);});
      ctx.textAlign='left';ctx.textBaseline='alphabetic';
      if(tip){if(near&&nd<30){tip.innerHTML=`<b style="color:#fff">${near.label}</b> · ${near.v*6} projects · ${near.v*2} team · ${near.v*3} clients`;tip.classList.add('show');}else tip.classList.remove('show');}
      if(running)raf=requestAnimationFrame(frame);}
    function start(){if(running)return;running=true;frame();}function stop(){running=false;cancelAnimationFrame(raf);}
    size();build();addEventListener('resize',()=>{size();build();});
    cv.addEventListener('mousemove',e=>{const r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;});
    cv.addEventListener('mouseleave',()=>{mx=-1;my=-1;});
    onView(cv,v=>{if(v){size();build();start();}else stop();});
  })();

  /* ---- 06 Offices ---- */
  (function(){
    const host=document.getElementById('offList');if(!host)return;
    const off=[['Miami','America/New_York'],['West Palm Beach','America/New_York'],['Chicago','America/Chicago'],['New York','America/New_York'],['Vancouver','America/Vancouver'],['Lisbon','Europe/Lisbon'],['São Paulo','America/Sao_Paulo'],['Curitiba','America/Sao_Paulo'],['Dubai','Asia/Dubai'],['Ho Chi Minh','Asia/Ho_Chi_Minh']];
    host.innerHTML=off.map(o=>`<div class="off-row"><span class="oc">${o[0]}</span><span class="ot" data-tz="${o[1]}">--:--</span></div>`).join('');
    function tick(){host.querySelectorAll('.ot').forEach(e=>{try{e.textContent=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit',timeZone:e.dataset.tz}).format(new Date());}catch(x){}});}
    tick();setInterval(tick,1000);
  })();

  /* ---- 07 Timeline — growth infographic ---- */
  (function(){
    const chart=document.getElementById('tlChart'); if(!chart)return;
    const head=document.getElementById('tlHead');
    const NS='http://www.w3.org/2000/svg';
    const ms=[
      ['2017','Born in Miami','BaseCamp Studio is born in Miami at the end of 2017 — one person, one conviction: real estate deserves care and attention.',1],
      ['2018','First hire & Canada','The first hire joins the herd and the Canada operation opens.',8],
      ['2019','Brazil operations','Operations begin in Brazil — closer to the market and the developer.',41],
      ['2021','The herd grows','The team expands fast across strategy, brand, CGI and film.',126],
      ['2022','Hubs open','Dedicated creative and production hubs come online.',185],
      ['2023','Lisbon & Chicago','The Lisbon operation launches and the Chicago office opens.',238],
      ['2024','Asia operations','Expansion into Asia, following the work and the clients.',292],
      ['2025','Dubai','The Dubai operation opens — a foothold in the Middle East.',340],
      ['2026','And still counting','365 projects and growing — the herd never stops.',365]
    ];
    let active=0;
    function setHead(i){active=i;const m=ms[i];head.innerHTML=`<span class="tl-hy">${m[0]}</span><span class="tl-ht">${m[1]}</span><span class="tl-hd">${m[2]}</span>`;}
    function el(tag,attrs){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);return e;}
    function build(){
      const W=chart.clientWidth,H=chart.clientHeight; if(W<20||H<20)return;
      chart.innerHTML='';
      const ml=16,mr=16,mt=44,mb=46, x0=ml,x1=W-mr,yb=H-mb,yt=mt;
      const narrow=W<540;
      const minY=2017,maxY=2026,maxV=365;
      const px=y=>x0+((y-minY)/(maxY-minY))*(x1-x0);
      const py=v=>yb-Math.sqrt(v/maxV)*(yb-yt);
      const pts=ms.map(m=>[px(+m[0]),py(m[3])]);
      const svg=el('svg',{viewBox:`0 0 ${W} ${H}`,width:'100%',height:'100%'});
      svg.appendChild(el('defs',{})).innerHTML='<linearGradient id="tlg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="rgba(255,90,46,.32)"/><stop offset="1" stop-color="rgba(255,90,46,0)"/></linearGradient>';
      svg.appendChild(el('line',{x1:x0,y1:yb,x2:x1,y2:yb,stroke:'rgba(255,255,255,.08)'}));
      const lineD='M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L ');
      const area=el('path',{d:lineD+` L ${pts[pts.length-1][0].toFixed(1)} ${yb} L ${pts[0][0].toFixed(1)} ${yb} Z`,fill:'url(#tlg)',opacity:'0'});svg.appendChild(area);
      const line=el('path',{d:lineD,fill:'none',stroke:'#FF5A2E','stroke-width':'2','stroke-linejoin':'round'});svg.appendChild(line);
      chart.appendChild(svg);
      try{const L=line.getTotalLength();line.style.strokeDasharray=L;line.style.strokeDashoffset=L;line.style.transition='stroke-dashoffset 1.6s ease';requestAnimationFrame(()=>{line.style.strokeDashoffset='0';area.style.transition='opacity 1.1s ease .4s';area.style.opacity='1';});}catch(e){area.setAttribute('opacity','1');}
      const nodes=[];
      pts.forEach((p,i)=>{
        const g=el('g',{class:'tl-node'});g.style.cursor='pointer';g.style.opacity='0';g.style.transition='opacity .45s ease';
        g.appendChild(el('line',{x1:p[0],y1:p[1]+6,x2:p[0],y2:yb,stroke:'rgba(255,90,46,.16)'}));
        const dot=el('circle',{cx:p[0],cy:p[1],r:i===active?6:4.5,fill:i===active?'#FF5A2E':'#0c0c0c',stroke:'#FF5A2E','stroke-width':'2'});g.appendChild(dot);
        const yl=el('text',{x:p[0],y:p[1]-15,'text-anchor':'middle',fill:'#fff','font-family':'Etna,"Aaux Pro Medium",Arial','font-size':'13'});yl.textContent=ms[i][0];g.appendChild(yl);
        const last=i===pts.length-1;
        if(!narrow||i===0||last){const vlA=narrow?(i===0?'start':(last?'end':'middle')):'middle';const vlX=narrow?(i===0?x0:(last?x1:p[0])):p[0];
          const vl=el('text',{x:vlX,y:yb+20,'text-anchor':vlA,fill:last?'#FF5A2E':'#8a867d','font-family':'"Aaux Pro Medium",Arial','font-size':'10.5'});vl.textContent=ms[i][3]+' projects';g.appendChild(vl);}
        if(last){
          // live pulse ring + "still counting" indicator on 2026
          const pulse=el('circle',{cx:p[0],cy:p[1],r:5,fill:'none',stroke:'#FF5A2E','stroke-width':'1.5',opacity:'0.7'});
          pulse.appendChild(el('animate',{attributeName:'r',values:'5;18',dur:'1.7s',repeatCount:'indefinite'}));
          pulse.appendChild(el('animate',{attributeName:'opacity',values:'0.7;0',dur:'1.7s',repeatCount:'indefinite'}));
          g.appendChild(pulse);
          const blink=el('animate',{attributeName:'opacity',values:'1;0.25;1',dur:'1.2s',repeatCount:'indefinite'});dot.appendChild(blink);
          const cl=el('text',{x:narrow?x1:p[0],y:yb+34,'text-anchor':narrow?'end':'middle',fill:'#FF5A2E','font-family':'"Aaux Pro Medium",Arial','font-size':'8.5','letter-spacing':'.16em'});cl.textContent='● STILL COUNTING';
          cl.appendChild(el('animate',{attributeName:'opacity',values:'1;0.4;1',dur:'1.4s',repeatCount:'indefinite'}));g.appendChild(cl);
        }
        g.addEventListener('mouseenter',()=>set(i));g.addEventListener('click',()=>set(i));
        svg.appendChild(g);setTimeout(()=>g.style.opacity='1',400+i*150);
        nodes.push(dot);
      });
      function set(i){setHead(i);nodes.forEach((d,j)=>{d.setAttribute('r',j===i?6:4.5);d.setAttribute('fill',j===i?'#FF5A2E':'#0c0c0c');});}
    }
    setHead(0);
    onView(chart,v=>{if(v)build();});
    addEventListener('resize',()=>{if(chart.clientWidth>20)build();});
  })();
})();

/* ---------- hero rotating pink word ---------- */
(function(){
  const el=document.getElementById('rotWord');if(!el)return;
  const words=['BaseCamp','Crew','Vision','Path','AI Edge'];
  let i=Math.max(0,words.indexOf(el.textContent.trim()));
  setInterval(()=>{
    el.classList.add('swap');
    setTimeout(()=>{ i=(i+1)%words.length; el.textContent=words[i]; el.classList.remove('swap'); },300);
  },2400);
})();

/* ---------- contact "Say Hi" rotating language (1.5x) ---------- */
(function(){
  const el=document.getElementById('sayHi');if(!el)return;
  const words=['Hi.','Olá.','Hola.','Ciao.','Bonjour.','Hallo.','你好','안녕','السلام علیکم','مرحبا','Xin chào.'];
  let i=0;
  setInterval(()=>{
    el.classList.add('swap');
    setTimeout(()=>{ i=(i+1)%words.length; el.textContent=words[i]; el.classList.remove('swap'); },200);
  },1600);
})();

/* ---------- demo reel modal ---------- */
function openReel(){
  const m=document.getElementById('reelModal');if(!m)return;
  const f=document.getElementById('reelFrame'), url=f&&f.dataset.reel;
  if(url){ // embed inline if a reel URL was provided
    f.innerHTML='<iframe src="'+url+'?autoplay=1" allow="autoplay; fullscreen; encrypted-media" allowfullscreen></iframe>';
  }
  m.classList.add('open');m.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');
}
function closeReel(){
  const m=document.getElementById('reelModal');if(!m)return;
  m.classList.remove('open');m.setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll');
  const f=document.getElementById('reelFrame'), ifr=f&&f.querySelector('iframe'); if(ifr)ifr.remove(); // stop playback
}
window.openReel=openReel;window.closeReel=closeReel;

/* ---------- living-data card expand ---------- */
function toggleLD(card){
  const wasOpen=card.classList.contains('open');
  document.querySelectorAll('.ldc.open').forEach(c=>c.classList.remove('open'));
  if(!wasOpen){card.classList.add('open');card.scrollIntoView({behavior:'smooth',block:'nearest'});}
  setTimeout(()=>window.dispatchEvent(new Event('resize')),80);
}
window.toggleLD=toggleLD;
/* ---------- CHEF periodic-tile expand ---------- */
function toggleChef(el){
  const wasOpen=el.classList.contains('open');
  document.querySelectorAll('.chef-el.open').forEach(c=>c.classList.remove('open'));
  if(!wasOpen){el.classList.add('open');el.scrollIntoView({behavior:'smooth',block:'nearest'});}
}
window.toggleChef=toggleChef;
/* ===================================================================
   THE HERD — living global system (nodes, clocks, feed, connections)
   =================================================================== */
(function(){
  const cv=document.getElementById('herdCanvas'); if(!cv)return;
  const ctx=cv.getContext('2d');
  const panel=document.getElementById('herdPanel');
  const feed=document.getElementById('herdFeed');
  const PINK='#FF5A2E';
  const offices=[
    {name:'Vancouver', tz:'America/Vancouver', x:.09,y:.30, team:12, markets:'Canada · United States', projects:['Movala','Dora']},
    {name:'Chicago',   tz:'America/Chicago',   x:.19,y:.35, team:14, markets:'United States', projects:['Allard Ipanema']},
    {name:'New York',  tz:'America/New_York',  x:.25,y:.37, team:16, markets:'United States', projects:['Colette','Tempo']},
    {name:'West Palm Beach', tz:'America/New_York', x:.255,y:.51, team:12, markets:'United States', projects:['Tempo']},
    {name:'Miami',     tz:'America/New_York',  x:.225,y:.56, team:22, markets:'United States · Latin America', projects:['Colette','Allard Ipanema','Dora']},
    {name:'Lisbon',    tz:'Europe/Lisbon',     x:.49,y:.40, team:16, markets:'Portugal · Europe', projects:['Dora','Tempo']},
    {name:'São Paulo', tz:'America/Sao_Paulo', x:.34,y:.71, team:18, markets:'Brazil', projects:['Colette','Morada']},
    {name:'Curitiba',  tz:'America/Sao_Paulo', x:.325,y:.74, team:20, markets:'Brazil', projects:['Tempo','Dora','Allard Ipanema']},
    {name:'Dubai',     tz:'Asia/Dubai',        x:.66,y:.52, team:13, markets:'UAE · Middle East', projects:['Bayn']},
    {name:'Ho Chi Minh', tz:'Asia/Ho_Chi_Minh', x:.88,y:.55, team:15, markets:'Vietnam · SE Asia', projects:['Suro']}
  ];
  const I=n=>offices.findIndex(o=>o.name===n);
  const conns=[['Vancouver','Chicago'],['Chicago','New York'],['New York','Miami'],['Miami','West Palm Beach'],
    ['Miami','São Paulo'],['São Paulo','Curitiba'],['New York','Lisbon'],['Lisbon','Dubai'],['Dubai','Ho Chi Minh'],
    ['Vancouver','Miami'],['Lisbon','São Paulo']].map(p=>[I(p[0]),I(p[1])]);
  const feedMsgs=[['Workshop','Miami'],['Site Visit','Lisbon'],['Strategy Session','Vancouver'],['Brand Workshop','Chicago'],
    ['Client Meeting','Dubai'],['Film Production','Curitiba'],['Launch Planning','New York'],['Project Review','Ho Chi Minh'],['Sales Sprint','São Paulo']];
  let W,H,dpr;
  function resize(){dpr=Math.min(window.devicePixelRatio||1,2);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
  resize(); addEventListener('resize',resize);
  const px=o=>({x:60+o.x*(W-120),y:H*0.13+((o.y-0.30)/0.44)*(H*0.78)});
  function ctrl(pa,pb){const mx=(pa.x+pb.x)/2,my=(pa.y+pb.y)/2,dx=pb.x-pa.x,dy=pb.y-pa.y,len=Math.hypot(dx,dy)||1;let nx=-dy/len,ny=dx/len;if(ny>0){nx=-nx;ny=-ny;}return{x:mx+nx*len*0.18,y:my+ny*len*0.18};}
  let pings=[];
  const bg=[]; for(let i=0;i<46;i++)bg.push({x:Math.random(),y:Math.random(),vx:(Math.random()-.5)*7e-4,vy:(Math.random()-.5)*7e-4,r:Math.random()*1.6+.4});
  const timeOf={}, hourOf={}, dowOf={};
  function refreshTimes(){const now=new Date();offices.forEach(o=>{
    timeOf[o.name]=new Intl.DateTimeFormat('en-US',{timeZone:o.tz,hour:'2-digit',minute:'2-digit',hour12:true}).format(now);
    dowOf[o.name]=new Intl.DateTimeFormat('en-US',{timeZone:o.tz,weekday:'short'}).format(now);
    hourOf[o.name]=+new Intl.DateTimeFormat('en-US',{timeZone:o.tz,hour:'2-digit',hour12:false}).format(now)%24;
  });
    if(hover>=0&&panel.classList.contains('show')){const tEl=panel.querySelector('.hp-time');if(tEl)tEl.textContent=timeOf[offices[hover].name];}}
  const awake=o=>{const d=dowOf[o.name];return d!=='Sat'&&d!=='Sun'&&hourOf[o.name]>=8&&hourOf[o.name]<19;};
  let pulses=[];
  const spawnPulse=()=>{const c=conns[Math.floor(Math.random()*conns.length)];pulses.push({c,t:0,sp:0.004+Math.random()*0.004});};
  let started=0, running=false, hover=-1, lastHover=-1, mx=-999, my=-999;
  cv.addEventListener('mousemove',e=>{const r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;});
  cv.addEventListener('mouseleave',()=>{mx=-999;my=-999;});
  function showPanel(o){const ok=awake(o);
    panel.innerHTML=`<div class="hp-status ${ok?'':'rest'}"><i></i>${ok?'Open now':'Closed'}</div>
      <h4>${o.name}</h4><div class="hp-time">${timeOf[o.name]||''}</div>
      <div class="hp-row"><div class="hp-k">Get in touch</div><div class="hp-v"><a href="mailto:hello@basecampstudio.pk">hello@basecampstudio.pk</a></div></div>`;
    panel.classList.add('show');panel.setAttribute('aria-hidden','false');}
  function hidePanel(){panel.classList.remove('show');panel.setAttribute('aria-hidden','true');}
  function frame(t){
    if(!started)started=t;
    const el=(t-started)/1000;
    const pNodes=Math.min(1,el/1.2), pLines=Math.min(1,Math.max(0,(el-0.7)/1.4));
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='rgba(0,0,0,0.10)';
    for(const p of bg){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>1)p.vx*=-1;if(p.y<0||p.y>1)p.vy*=-1;ctx.beginPath();ctx.arc(p.x*W,p.y*H,p.r,0,7);ctx.fill();}
    ctx.setLineDash([3,7]);ctx.lineWidth=1.6;
    for(const [a,b] of conns){const pa=px(offices[a]),pb=px(offices[b]),c=ctrl(pa,pb);
      ctx.strokeStyle='rgba(255,90,46,'+(0.6*pLines)+')';ctx.beginPath();ctx.moveTo(pa.x,pa.y);ctx.quadraticCurveTo(c.x,c.y,pb.x,pb.y);ctx.stroke();}
    ctx.setLineDash([]);
    pings.forEach(pg=>{pg.t+=0.013;const p=px(offices[pg.i]),rad=12+pg.t*54;ctx.strokeStyle='rgba(255,90,46,'+(0.45*(1-pg.t))+')';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(p.x,p.y,rad,0,7);ctx.stroke();});
    pings=pings.filter(pg=>pg.t<1);
    pulses.forEach(pl=>{pl.t+=pl.sp;const pa=px(offices[pl.c[0]]),pb=px(offices[pl.c[1]]),c=ctrl(pa,pb),u=1-pl.t;
      const x=u*u*pa.x+2*u*pl.t*c.x+pl.t*pl.t*pb.x, y=u*u*pa.y+2*u*pl.t*c.y+pl.t*pl.t*pb.y;
      const g=ctx.createRadialGradient(x,y,0,x,y,9);g.addColorStop(0,'rgba(255,170,205,'+pLines+')');g.addColorStop(1,'rgba(255,90,46,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,9,0,7);ctx.fill();
      ctx.globalAlpha=pLines;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y,1.7,0,7);ctx.fill();ctx.globalAlpha=1;});
    pulses=pulses.filter(pl=>pl.t<1);
    hover=-1; offices.forEach((o,i)=>{const p=px(o);if(Math.hypot(mx-p.x,my-p.y)<24)hover=i;});
    offices.forEach((o,i)=>{const p=px(o),ok=awake(o),blink=0.55+0.45*Math.sin(t/520+i*1.3),hv=hover===i;
      ctx.globalAlpha=pNodes;
      const R=hv?34:22,gr=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,R);
      gr.addColorStop(0,ok?`rgba(255,90,46,${0.5*blink})`:`rgba(150,150,150,${0.28*blink})`);gr.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=gr;ctx.beginPath();ctx.arc(p.x,p.y,R,0,7);ctx.fill();
      ctx.fillStyle=ok?PINK:'#6e6e6e';ctx.beginPath();ctx.arc(p.x,p.y,hv?6:4,0,7);ctx.fill();
      ctx.strokeStyle=ok?'rgba(255,90,46,.5)':'rgba(150,150,150,.4)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(p.x,p.y,hv?12:9,0,7);ctx.stroke();
      const right=p.x>W*0.72; ctx.textAlign=right?'right':'left'; const lx=p.x+(right?-16:16);
      ctx.font='600 12px "Aaux Pro Medium",Arial';ctx.fillStyle=hv?'#16130f':'#46423a';ctx.fillText(o.name.toUpperCase(),lx,p.y-2);
      ctx.font='600 12px "Aaux Pro Medium",Arial';ctx.fillStyle=ok?PINK:'#8a867d';ctx.fillText(timeOf[o.name]||'',lx,p.y+14);
      ctx.globalAlpha=1;});
    if(hover!==lastHover){if(hover>=0)showPanel(offices[hover]);else hidePanel();lastHover=hover;}
    cv.style.cursor=hover>=0?'pointer':'default';
    if(running)requestAnimationFrame(frame);
  }
  function pushFeed(){const m=feedMsgs[Math.floor(Math.random()*feedMsgs.length)];
    const it=document.createElement('div');it.className='herd-pop';it.innerHTML='<i></i>'+m[0]+' in <b>'+m[1]+'</b>';
    it.style.left=(8+Math.random()*52)+'%';            // spread, kept off the right-side text
    it.style.top=(32+Math.random()*26)+'%';            // middle band only — never over the headline or the 01/02/03 facts
    feed.appendChild(it);requestAnimationFrame(()=>it.classList.add('in'));
    while(feed.children.length>8)feed.removeChild(feed.firstChild);
    setTimeout(()=>{it.classList.remove('in');setTimeout(()=>it.remove(),650);},3400+Math.random()*1600);}
  function spawnPing(){const aw=offices.map((o,i)=>awake(o)?i:-1).filter(i=>i>=0);if(aw.length)pings.push({i:aw[Math.floor(Math.random()*aw.length)],t:0});}
  // mobile fallback list
  const listEl=document.getElementById('contactList'), listRows={};
  if(listEl){offices.forEach(o=>{const r=document.createElement('div');r.className='cl-row';
    r.innerHTML='<div class="cl-l"><span class="cl-name">'+o.name+'</span><span class="cl-time"></span></div><span class="cl-st"><i></i><b></b></span>';
    listEl.appendChild(r);listRows[o.name]=r;});}
  function updateList(){if(!listEl)return;offices.forEach(o=>{const ok=awake(o),row=listRows[o.name];
    row.querySelector('.cl-time').textContent=timeOf[o.name]||'';
    const s=row.querySelector('.cl-st');s.className='cl-st'+(ok?'':' closed');s.querySelector('b').textContent=ok?'Open':'Closed';});}
  refreshTimes(); updateList(); setInterval(()=>{refreshTimes();updateList();},1000);
  let feedTimer=null, pulseTimer=null, pingTimer=null;
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){
      if(!running){running=true;started=0;requestAnimationFrame(frame);}
      if(feed&&!feedTimer){feedTimer=setInterval(pushFeed,1500);setTimeout(pushFeed,400);setTimeout(pushFeed,1000);}
      if(!pulseTimer){pulseTimer=setInterval(spawnPulse,700);}
      if(!pingTimer){pingTimer=setInterval(spawnPing,1100);}
    }else{running=false;if(feedTimer){clearInterval(feedTimer);feedTimer=null;}if(pulseTimer){clearInterval(pulseTimer);pulseTimer=null;}if(pingTimer){clearInterval(pingTimer);pingTimer=null;}}
  }),{threshold:.15});
  io.observe(cv);
})();
addEventListener('keydown',e=>{if(e.key==='Escape')closeReel();});
document.addEventListener('click',e=>{const m=document.getElementById('reelModal');if(m&&m.classList.contains('open')&&e.target===m)closeReel();});

/* ---------- menu ---------- */
function openMenu(){document.getElementById('menu').classList.add('open');document.body.classList.add('no-scroll');}
function closeMenu(){document.getElementById('menu').classList.remove('open');document.body.classList.remove('no-scroll');}
window.openMenu=openMenu;window.closeMenu=closeMenu;
addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});

/* ---------- nav scrolled ---------- */
const nav=document.getElementById('nav');
addEventListener('scroll',()=>{nav.classList.toggle('scrolled',scrollY>40);},{passive:true});

/* ---------- reveal ---------- */
const io=new IntersectionObserver((es)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=(i%4*60)+'ms';io.observe(el);});

/* ---------- stat counters ---------- */
(function(){
  const nums=document.querySelectorAll('.ldc-num');if(!nums.length)return;
  function animateCount(el){
    const target=parseFloat(el.dataset.target)||0;
    const duration=1400;
    const start=performance.now();
    function tick(now){
      const p=Math.min((now-start)/duration,1);
      const eased=1-Math.pow(1-p,3);
      el.textContent=Math.round(target*eased);
      if(p<1)requestAnimationFrame(tick);else el.textContent=target;
    }
    requestAnimationFrame(tick);
  }
  const cio=new IntersectionObserver((es)=>es.forEach(e=>{if(e.isIntersecting){animateCount(e.target);cio.unobserve(e.target);}}),{threshold:.4});
  nums.forEach(el=>cio.observe(el));
})();

/* ---------- live counter ---------- */
(function(){
  const el=document.getElementById("liveCount");if(!el)return;
  setInterval(()=>{if(Math.random()>.6){el.animate([{color:'#fff'},{color:'#f3f1ea'}],{duration:1200});}},9000);
})();

/* ---------- seeded helpers ---------- */
function seeded(i){let x=Math.sin(i*99.13+17.7)*43758.5453;return x-Math.floor(x);}
function assignGroups(count,weights){
  // returns array length count of group indices, distributed by weights (stable)
  const total=weights.reduce((a,b)=>a+b,0);const out=new Array(count);
  let idx=0;
  for(let g=0;g<weights.length;g++){
    const share=Math.round(count*weights[g]/total);
    for(let k=0;k<share&&idx<count;k++)out[idx++]=g;
  }
  while(idx<count)out[idx++]=weights.length-1;
  // shuffle deterministically
  for(let i=count-1;i>0;i--){const j=Math.floor(seeded(i)* (i+1));const t=out[i];out[i]=out[j];out[j]=t;}
  return out;
}

/* ===================================================================
   PARTICLE FIELD (hero + global reach)
   =================================================================== */
function ParticleField(canvas,opts){
  const ctx=canvas.getContext('2d');
  let W,H,dpr,particles=[],running=false,raf=0;
  const mouse={x:0,y:0,active:false};
  if(opts.interactive){
    addEventListener('pointermove',e=>{
      const r=canvas.getBoundingClientRect(), x=e.clientX-r.left, y=e.clientY-r.top;
      if(x>=0&&y>=0&&x<=r.width&&y<=r.height){mouse.x=x;mouse.y=y;mouse.active=true;} else {mouse.active=false;}
    },{passive:true});
    addEventListener('blur',()=>mouse.active=false);
  }
  const N=opts.count||495;          // globe particles
  const EX=opts.extra||0;           // extra particles that join after the explosion
  const TOTAL=N+EX;
  const modes=opts.modes; // {name:{groups:[labels], weights:[..]}}
  let mode=opts.start;
  let centers=[]; // current cluster centers (in css px)
  let orbitBoxes=[]; // text/UI rects the drifting clusters must avoid
  let orbitRegion=null; // clusters are confined to this rectangle (right of the title)
  const ORB_MARGIN=70;
  let phase=opts.intro?'globe':'run'; // globe -> explode -> run
  let gt=0, exT=0;
  const GA=Math.PI*(3-Math.sqrt(5));

  // per-particle stable group assignment per mode
  const groupByMode={};
  for(const m in modes){if(m==='float')continue;groupByMode[m]=assignGroups(TOTAL,modes[m].weights);}

  function resize(){
    dpr=Math.min(window.devicePixelRatio||1,2);
    W=canvas.clientWidth;H=canvas.clientHeight;
    canvas.width=W*dpr;canvas.height=H*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    computeCenters();
  }
  function computeCenters(){
    centers={};
    const cr=canvas.getBoundingClientRect();
    const rectOf=(sel)=>{const el=sel&&document.querySelector(sel);if(!el)return null;const r=el.getBoundingClientRect();return {l:r.left-cr.left,t:r.top-cr.top,r:r.right-cr.left,b:r.bottom-cr.top};};

    // ---- clusters live in a rectangle to the RIGHT of the title (never over any text) ----
    if(opts.orbit){
      const margin=ORB_MARGIN;
      const head=rectOf(opts.avoidSelector), filt=opts.avoidBottomSelector?rectOf(opts.avoidBottomSelector):null;
      // left edge of the cluster zone = right edge of the title + clearance (clamped so a zone always exists)
      const leftLimit = head ? Math.min(W*0.60, head.r + CLUSTER_R) : W*0.52;
      let regT=margin+30, regB=H-margin;
      // keep above the filters panel (bottom-right) so clusters never sit on it
      if(filt && filt.r > leftLimit-20) regB=Math.min(regB, filt.t - CLUSTER_R*0.6);
      regB=Math.max(regT+120, regB);
      const regL=Math.min(leftLimit, W-margin-60), regR=W-margin;
      orbitRegion={l:regL,r:regR,t:regT,b:regB};
      for(const m in modes){
        if(m==='float'){centers[m]=null;continue;}
        const g=modes[m].groups.length, arr=[];
        for(let i=0;i<g;i++){
          const fy=(i+0.5)/g;
          const col=(i%2)? .66 : .30;                 // two soft columns
          const x=regL + (col + (Math.random()-.5)*0.12)*(regR-regL);
          const y=regT + (fy + (Math.random()-.5)*(0.7/g))*(regB-regT);
          arr.push({x:Math.max(regL,Math.min(regR,x)), y:Math.max(regT,Math.min(regB,y)),
                    vx:(Math.random()-.5)*0.6, vy:(Math.random()-.5)*0.6});
        }
        centers[m]=arr;
      }
      return;
    }

    // cluster only inside this rectangle (fractions of canvas) so it never lands on text/UI
    const A=opts.area||{x0:0.12,x1:0.88,y0:0.20,y1:0.82};
    let ax0=A.x0*W, ay1=A.y1*H; const ax1=A.x1*W, ay0=A.y0*H;
    // start to the right of the actual headline box (measured)
    if(opts.avoidSelector){
      const el=document.querySelector(opts.avoidSelector);
      if(el){const r=el.getBoundingClientRect(); ax0=Math.min(0.72*W, Math.max(ax0, (r.right-cr.left)+90));}
    }
    // stop above the filters panel so clusters never sit under it
    if(opts.avoidBottomSelector){
      const fe=document.querySelector(opts.avoidBottomSelector);
      if(fe){const r=fe.getBoundingClientRect(); if(r.width>0) ay1=Math.min(ay1, (r.top-cr.top)-40);}
    }
    const aw=ax1-ax0, ah=ay1-ay0;
    for(const m in modes){
      if(m==='float'){centers[m]=null;continue;}
      const g=modes[m].groups.length;
      const cols=Math.max(1,Math.round(Math.sqrt(g*(aw/ah||1))));
      const rows=Math.ceil(g/cols);
      const arr=[];
      const gw=aw/Math.max(cols-1,1);
      const gh=ah/Math.max(rows-1,1);
      for(let i=0;i<g;i++){
        const r=Math.floor(i/cols), c=i%cols;
        const itemsInRow=Math.min(cols,g-r*cols);
        const rowW=(itemsInRow-1)*gw;
        const offX=(aw-rowW)/2;
        arr.push({x:ax0+offX+c*gw, y:rows>1?ay0+r*gh:(ay0+ay1)/2});
      }
      centers[m]=arr;
    }
  }
  function init(){
    particles=[];
    for(let i=0;i<TOTAL;i++){
      const extra=i>=N;
      // every particle gets a valid sphere coord (sphere & extras distributed separately)
      const si=extra?(i-N):i, sc=extra?Math.max(EX,2):N;
      const yy=1-(si/(sc-1))*2, rr=Math.sqrt(Math.max(0,1-yy*yy)), th=GA*si;
      particles.push({
        i,
        x:Math.random()*W, y:Math.random()*H,
        vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3,
        a:Math.random()*Math.PI*2, // angle within cluster
        rad:9+seeded(i*1.7)*46,    // radius within cluster (smaller, fits the right-side zone)
        sz:1.7+seeded(i*3.1)*2.6,
        gx:Math.cos(th)*rr, gy:yy, gz:Math.sin(th)*rr, dsz:1, // sphere coords
        hxf:Math.random(), hyf:Math.random(), // free-flow "home" (fractions of screen) -> stays spread
        extra, fin:(opts.intro&&extra)?0:1 // extras invisible until the burst
      });
    }
  }
  function rot(p){ // project sphere coord -> screen at current rotation
    const cosY=Math.cos(gt),sinY=Math.sin(gt),tilt=0.42,ct=Math.cos(tilt),st=Math.sin(tilt);
    let x=p.gx*cosY - p.gz*sinY;
    let z=p.gx*sinY + p.gz*cosY;
    let y=p.gy*ct - z*st; z=p.gy*st + z*ct;
    const persp=1.6/(1.6 - z), Rg=Math.min(W,H)*0.34;
    return {x:W/2 + x*Rg*persp, y:H/2 + y*Rg*persp, depth:(z+1)/2};
  }
  function targetFor(p){
    if(mode==='float'||!centers[mode]) return null;
    const gi=groupByMode[mode][p.i];
    const c=centers[mode][gi];if(!c)return null;
    return {x:c.x+Math.cos(p.a)*p.rad, y:c.y+Math.sin(p.a)*p.rad, gi};
  }
  function colorFor(p){
    if(mode==='float') return PINK;
    const gi=groupByMode[mode][p.i];
    return PALETTE[gi%PALETTE.length];
  }
  function step(){
    ctx.clearRect(0,0,W,H);
    if(phase==='globe') drawGlobe();
    else if(phase==='explode') drawExplode();
    else drawField();
    if(running)raf=requestAnimationFrame(step);
  }
  function drawGlobe(){
    gt+=0.0032;
    for(const p of particles){
      if(p.extra) continue; // globe shows the 495
      const s=rot(p);
      p.x=s.x; p.y=s.y; p.dsz=0.8+s.depth*1.8;
      ctx.beginPath(); ctx.globalAlpha=0.22+s.depth*0.78; ctx.fillStyle=PINK;
      ctx.arc(p.x,p.y,p.dsz,0,Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha=1;
  }
  function drawExplode(){
    exT++;
    for(const p of particles){
      if(p.extra&&p.fin<1) p.fin=Math.min(1,p.fin+0.12); // extras fade in fast as they leave the globe
      p.vx*=1.05; p.vy*=1.05; p.x+=p.vx; p.y+=p.vy;
      ctx.beginPath(); ctx.globalAlpha=0.9*(p.extra?p.fin:1); ctx.fillStyle=PINK;
      ctx.arc(p.x,p.y,p.dsz||p.sz,0,Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha=1;
    if(exT>46){ phase='run'; for(const p of particles){ p.vx*=0.22; p.vy*=0.22; } }
  }
  // CLUSTER_R = how far particles spread from a cluster centre → used to keep the zone clear of the title.
  const CLUSTER_R=74;
  function driftCenters(){
    const cs=centers[mode]; if(!cs)return;
    const R=orbitRegion; if(!R)return;
    for(const c of cs){
      if(c.vx===undefined){c.vx=(Math.random()-.5)*0.6;c.vy=(Math.random()-.5)*0.6;}
      c.x+=c.vx; c.y+=c.vy;
      // clusters stay inside the right-side rectangle → never touch the title or the filters
      if(c.x<R.l){c.x=R.l;c.vx=Math.abs(c.vx);}
      if(c.x>R.r){c.x=R.r;c.vx=-Math.abs(c.vx);}
      if(c.y<R.t){c.y=R.t;c.vy=Math.abs(c.vy);}
      if(c.y>R.b){c.y=R.b;c.vy=-Math.abs(c.vy);}
      c.vx*=0.985; c.vy*=0.985;
      const sp=Math.hypot(c.vx,c.vy);
      if(sp>0.7){c.vx=c.vx/sp*0.7;c.vy=c.vy/sp*0.7;}
      if(sp<0.12){const a=Math.random()*6.283;c.vx+=Math.cos(a)*0.12;c.vy+=Math.sin(a)*0.12;}
    }
  }
  function drawField(){
    if(opts.orbit&&mode!=='float'&&centers[mode]) driftCenters();
    for(const p of particles){
      if(mode==='float'){
        const hx=p.hxf*W, hy=p.hyf*H;
        // spring back to home -> keeps an even spread; quick to settle in
        p.vx+=(hx-p.x)*0.006; p.vy+=(hy-p.y)*0.006;
        // gentle constant life
        p.vx+=(Math.random()-.5)*0.06; p.vy+=(Math.random()-.5)*0.06;
        // cursor pushes nearby particles away (ripple), they spring back
        if(mouse.active){
          const dx=p.x-mouse.x, dy=p.y-mouse.y, d=Math.hypot(dx,dy)||1;
          if(d<210){ const f=(1-d/210)*2.6; p.vx+=(dx/d)*f; p.vy+=(dy/d)*f; }
        }
        p.vx*=0.90; p.vy*=0.90;
        const sp=Math.hypot(p.vx,p.vy), MX=6; if(sp>MX){p.vx=p.vx/sp*MX; p.vy=p.vy/sp*MX;}
        p.x+=p.vx; p.y+=p.vy;
      }else{
        p.a+=0.004;
        const t=targetFor(p);
        p.x+=(t.x-p.x)*0.06; p.y+=(t.y-p.y)*0.06;
      }
      ctx.beginPath();
      ctx.fillStyle=colorFor(p);
      ctx.globalAlpha=mode==='float'?0.68:0.9;
      ctx.arc(p.x,p.y,p.sz,0,Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha=1;
    if(mode!=='float'&&centers[mode]){
      ctx.font='600 11px "Aaux Pro Medium",Arial';
      ctx.textAlign='center';
      modes[mode].groups.forEach((lbl,gi)=>{
        const c=centers[mode][gi];if(!c)return;
        ctx.fillStyle='rgba(243,241,234,.55)';
        ctx.fillText(lbl.toUpperCase(), c.x, c.y+68);
      });
    }
  }
  function launch(){
    if(phase!=='globe')return; exT=0;
    const cxp=W/2, cyp=H/2;
    for(const p of particles){
      if(p.extra){ const s=rot(p); p.x=s.x; p.y=s.y; p.dsz=0.8+s.depth*1.8; } // start on the globe shell
      let dx=p.x-cxp, dy=p.y-cyp, d=Math.hypot(dx,dy)||1;
      const power=7+Math.random()*11;
      p.vx=(dx/d)*power + (Math.random()-.5)*3;
      p.vy=(dy/d)*power + (Math.random()-.5)*3;
    }
    phase='explode';
  }
  function start(){if(running)return;running=true;step();}
  function stop(){running=false;cancelAnimationFrame(raf);}
  function setMode(m){
    if(m==='float'&&mode!=='float'){ // free flow: re-scatter everything across the screen
      for(const p of particles){ p.x=Math.random()*W; p.y=Math.random()*H; p.vx=(Math.random()-.5)*.6; p.vy=(Math.random()-.5)*.6; }
    }
    mode=m;if(opts.onMode)opts.onMode(m,modes[m]);
  }

  resize();init();
  addEventListener('resize',()=>{resize();});
  return {start,stop,setMode,getMode:()=>mode,modes,launch,getPhase:()=>phase};
}

/* ---------- HERO ---------- */
(function(){
  document.body.classList.remove('intro-lock','intro-active');
})();

/* ---------- GLOBAL REACH field ---------- */
(function(){
  const c=document.getElementById('reachCanvas');if(!c)return;
  const legend=document.getElementById('reachLegend');
  function paintLegend(m,def){
    if(!def||!def.groups){legend.innerHTML='';return;}
    legend.innerHTML=def.groups.map((g,i)=>`<span><i style="background:${PALETTE[i%PALETTE.length]}"></i>${g}</span>`).join('');
  }
  const field=ParticleField(c,{
    count:495, start:'region',
    onMode:paintLegend,
    modes:{
      region:{groups:['North America','South America','Europe','Middle East','Asia'],weights:[40,30,10,12,8]},
      service:{groups:['CGI','Film','Floor Plans','Branding','Digital','Strategy','360°'],weights:[325,143,125,80,40,28,20]},
      year:{groups:["'18","'19","'20","'21","'22","'23","'24","'25","'26"],weights:[8,33,34,51,59,53,54,48,25]},
      asset:{groups:['Residential','Masterplan','Mixed Use','Branded Residences','Hospitality','Commercial','Cruises'],weights:[60,13,10,5,5,5,2]}
    }
  });
  paintLegend('region',field.modes.region);
  // start/stop with viewport
  const vio=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?field.start():field.stop()),{threshold:.05});
  vio.observe(c);
  document.querySelectorAll('#reach .reach-controls button').forEach(b=>{
    b.addEventListener('click',()=>{
      document.querySelectorAll('#reach .reach-controls button').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');field.setMode(b.dataset.mode);
    });
  });
})();

/* ===================================================================
   STATEMENT — light up on scroll
   =================================================================== */
(function(){
  const items=document.querySelectorAll('.statement [data-lit]');if(!items.length)return;
  const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('lit');}),{threshold:.6});
  items.forEach(i=>o.observe(i));
})();

/* ===================================================================
   HORIZONTAL SCROLL (How developments become brands)
   =================================================================== */
/* Robust sticky-based horizontal scroll (no GSAP pin → never breaks on scroll-up) */
(function(){
  const section=document.getElementById('horizon');
  const track=document.getElementById('htrack');
  const prog=document.getElementById('hprog');
  if(!section||!track)return;
  let dist=0, ticking=false;
  function mobile(){return matchMedia('(max-width:760px)').matches;}
  function layout(){
    if(mobile()){section.style.height='';track.style.transform='';return;}
    dist=Math.max(0, track.scrollWidth - window.innerWidth);
    section.style.height=(dist+window.innerHeight)+'px';
    render();
  }
  function render(){
    if(mobile())return;
    const top=section.offsetTop;
    let p=(window.scrollY - top)/(dist||1);
    p=Math.max(0,Math.min(1,p));
    track.style.transform='translate3d('+(-p*dist).toFixed(1)+'px,0,0)';
    if(prog)prog.style.width=(p*100).toFixed(1)+'%';
  }
  addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(()=>{render();ticking=false;});}},{passive:true});
  addEventListener('resize',layout);
  layout();
  addEventListener('load',layout);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(layout);
})();

/* ===================================================================
   CHEF interactive
   =================================================================== */
(function(){
  const data={
    C:{tag:'Pillar 01 · Strategy',title:'Context',sub:'Commercial Intelligence',
       desc:'Every decision starts with market reality. We map where the opportunity exists and where the project can create meaningful differentiation.',
       produces:['Market Research','Competitor Analysis','Opportunity Mapping','Product Definition','Pricing Strategy'],
       cases:'Applied in Tempo, Allard Ipanema, Bayn'},
    H:{tag:'Pillar 02 · Audience',title:'Human',sub:'Audience Intelligence',
       desc:'We define who the project is truly designed for and why they will choose it—translating behavior into commercial direction.',
       produces:['Personas','Customer Journey','Purchase Drivers','Behavioral Insights','Lifestyle Mapping'],
       cases:'Applied in Colette, Morada, Dora'},
    E:{tag:'Pillar 03 · ES Core · Narrative',title:'Experience',sub:'Brand & Experience Design',
       desc:'We transform product attributes into desire, meaning and emotional connection—positioning, story, identity, CGI, film and sales experiences.',
       produces:['Positioning','Storytelling','Branding','Visual Identity','CGI & Film','Sales Center Strategy','Interactive (E_SC)'],
       cases:'Applied in Tempo, Suro, Allard Ipanema'},
    F:{tag:'Pillar 04 · Execution',title:'Funnel',sub:'Commercial Activation',
       desc:'We convert awareness and interest into qualified leads and sales—launch strategy, campaigns, CRM, sales playbook and performance tracking.',
       produces:['Launch Strategy','Marketing Campaigns','Media Planning','Lead Generation','CRM Flows','Sales Playbook','Performance Tracking'],
       cases:'Applied across the full portfolio'}
  };
  const panel=document.getElementById('chefPanel');if(!panel)return; // legacy layout (no-op in new periodic layout)
  function render(k){
    const d=data[k];
    panel.innerHTML=`<div class="tag">${d.tag}</div><h3>${d.title} <span style="color:var(--pink)">— ${d.sub}</span></h3>
      <p>${d.desc}</p>
      <div class="produces">${d.produces.map(x=>`<span>${x}</span>`).join('')}</div>
      <div class="cases"><b>Case studies:</b> ${d.cases}</div>`;
  }
  render('C');
  document.querySelectorAll('.chef-letters .cl').forEach(cl=>{
    cl.addEventListener('click',()=>{
      document.querySelectorAll('.chef-letters .cl').forEach(x=>x.classList.remove('active'));
      cl.classList.add('active');render(cl.dataset.k);
    });
  });
})();

/* ===================================================================
   PROJECT EXPLORER
   =================================================================== */
(function(){
  const grid=document.getElementById('projGrid');if(!grid)return;
  const projects=[
    {n:'Tempo',ty:'Branded Residences & Hospitality — Itajaí, Brazil',st:'83 Res · 43 Hotel · Launched Q1 2026',tags:['Hospitality','Brazil']},
    {n:'Allard Ipanema',ty:'Beachfront Hotel & Residences — Rio de Janeiro',st:'8 Apts · 48 Hotel · Pre-launch',tags:['Hospitality','Residential','Brazil']},
    {n:'Suro',ty:'Brand & Launch — GS E&C, Vietnam',st:'Masterplan & Residential · Launch 2027',tags:['Masterplan','Residential','International']},
    {n:'Colette',ty:'Boutique Residential — design-led',st:'Brand · Narrative · Visualization',tags:['Residential']},
    {n:'Morada',ty:'Hospitality & Lifestyle',st:'Experience · Storytelling · Content',tags:['Hospitality']},
    {n:'Dora',ty:'Urban Residential',st:'Intelligence · Positioning · Campaigns',tags:['Residential']},
    {n:'Bayn',ty:'Waterfront Masterplan — Middle East',st:'Interactive Platform · Phased Activation',tags:['Masterplan','International']}
  ];
  grid.innerHTML=projects.map((p,i)=>`<a class="proj" data-tags="${p.tags.join(',')}" href="mailto:hello@basecampstudio.pk?subject=Project enquiry — ${p.n}">
     <div class="pn">${String(i+1).padStart(2,'0')}</div>
     <h3>${p.n}</h3><div class="ty">${p.ty}</div><div class="st">${p.st}</div></a>`).join('');
  document.querySelectorAll('#projFilters button').forEach(b=>{
    b.addEventListener('click',()=>{
      document.querySelectorAll('#projFilters button').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');const f=b.dataset.f;
      document.querySelectorAll('.proj').forEach(p=>{
        const tags=p.dataset.tags.split(',');
        p.classList.toggle('hide',!(f==='all'||tags.includes(f)));
      });
    });
  });
})();

/* ===================================================================
   KPI counters
   =================================================================== */
(function(){
  const seen=new Set();
  const o=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting||seen.has(e.target))return;seen.add(e.target);
    const el=e.target,t=+el.dataset.target;let c=0;const step=Math.max(1,t/45);
    const iv=setInterval(()=>{c+=step;if(c>=t){c=t;clearInterval(iv);}el.textContent=Math.floor(c);},24);
  }),{threshold:.6});
  document.querySelectorAll('.kpi [data-target]').forEach(el=>o.observe(el));
})();

/* ===================================================================
   PEOPLE NETWORK
   =================================================================== */
(function(){
  const c=document.getElementById('netCanvas');if(!c)return;
  const ctx=c.getContext('2d');const panel=document.getElementById('netPanel');
  let W,H,dpr,raf=0,running=false,t=0;
  const people=[
    {id:'HD',name:'Henrique Driessen',role:'Founder / CEO',loc:'Miami',exp:'Strategy · Vision · Growth',proj:'Tempo, Allard Ipanema, Colette',core:true},
    {id:'GD',name:'Giovana Driessen',role:'Co-Founder / COO',loc:'Miami',exp:'Operations · Delivery · Culture',proj:'Allard Ipanema, Colette, Morada',core:true},
    {id:'FB',name:'Fabio Brunelli',role:'Partner & Chief Growth Officer',loc:'São Paulo',exp:'Growth · Commercial · Sales',proj:'Colette, Morada, Dora'},
    {id:'AS',name:'Alix Silgueiro',role:'Partner & Global Creative Director',loc:'Lisbon',exp:'Brand · Creative · Narrative',proj:'Morada, Dora, Bayn'},
    {id:'IA',name:'Irshaad Ahmad',role:'Global Head of Planning & Strategy',loc:'Dubai',exp:'Planning · Strategy · Research',proj:'Dora, Bayn, Tempo'},
    {id:'MM',name:'Marianna Magalhães',role:'Managing Director',loc:'Curitiba',exp:'Management · Delivery · Client',proj:'Bayn, Tempo, Allard Ipanema'}
  ];
  let nodes=[],sel=-1,hover=-1;
  function layout(){
    nodes=[];const cx=W/2,cy=H/2;const R=Math.min(W,H)*0.32;
    // core hub
    nodes.push({hub:true,x:cx,y:cy,r:Math.min(W,H)*0.06});
    people.forEach((p,i)=>{
      const ang=(i/people.length)*Math.PI*2 - Math.PI/2;
      nodes.push({p,baseAng:ang,baseR:R,x:cx+Math.cos(ang)*R,y:cy+Math.sin(ang)*R,r:p.core?26:21,jit:seeded(i)*6.28});
    });
  }
  function resize(){dpr=Math.min(window.devicePixelRatio||1,2);W=c.clientWidth;H=c.clientHeight;c.width=W*dpr;c.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);layout();}
  function draw(){
    t+=0.01;ctx.clearRect(0,0,W,H);
    const cx=W/2,cy=H/2;
    // animate node positions (gentle orbit)
    for(let i=1;i<nodes.length;i++){
      const n=nodes[i];const a=n.baseAng+Math.sin(t+n.jit)*0.05;const r=n.baseR+Math.sin(t*0.8+n.jit)*8;
      n.x=cx+Math.cos(a)*r;n.y=cy+Math.sin(a)*r;
    }
    // links hub<->nodes
    for(let i=1;i<nodes.length;i++){
      const n=nodes[i];const on=(sel===i||hover===i);
      ctx.strokeStyle=on?'rgba(255,90,46,.7)':'rgba(255,255,255,.10)';
      ctx.lineWidth=on?1.6:1;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(n.x,n.y);ctx.stroke();
    }
    // cross links between adjacent people (org feel)
    ctx.strokeStyle='rgba(255,255,255,.05)';ctx.lineWidth=1;
    for(let i=1;i<nodes.length;i++){const a=nodes[i],b=nodes[i%(nodes.length-1)+1];ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
    // hub
    const hub=nodes[0];
    ctx.beginPath();ctx.fillStyle='rgba(255,90,46,.12)';ctx.arc(cx,cy,hub.r+10+Math.sin(t)*3,0,7);ctx.fill();
    ctx.beginPath();ctx.fillStyle=PINK;ctx.arc(cx,cy,hub.r,0,7);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='700 13px "Etna",Arial';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('ES',cx,cy);
    // people nodes
    for(let i=1;i<nodes.length;i++){
      const n=nodes[i];const on=(sel===i||hover===i);
      ctx.beginPath();
      ctx.fillStyle=on?PINK:'#15151a';
      ctx.strokeStyle=on?PINK:'rgba(255,90,46,.5)';ctx.lineWidth=1.5;
      ctx.arc(n.x,n.y,n.r,0,7);ctx.fill();ctx.stroke();
      ctx.fillStyle=on?'#fff':'#cfcbc0';ctx.font='700 13px "Etna",Arial';ctx.textBaseline='middle';
      ctx.fillText(n.p.id,n.x,n.y);
    }
    if(running)raf=requestAnimationFrame(draw);
  }
  function hit(mx,my){for(let i=1;i<nodes.length;i++){const n=nodes[i];if(Math.hypot(mx-n.x,my-n.y)<n.r+4)return i;}return -1;}
  function showPanel(i){
    const p=nodes[i].p;
    panel.innerHTML=`<div class="av">${p.id}</div><h3>${p.name}</h3><div class="role">${p.role}</div>
      <div class="meta"><b>Location:</b> ${p.loc}<br><b>Expertise:</b> ${p.exp}<br><b>Projects:</b> ${p.proj}</div>`;
    panel.classList.add('show');
  }
  c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();hover=hit(e.clientX-r.left,e.clientY-r.top);c.style.cursor=hover>0?'pointer':'default';});
  c.addEventListener('click',e=>{const r=c.getBoundingClientRect();const i=hit(e.clientX-r.left,e.clientY-r.top);if(i>0){sel=i;showPanel(i);}});
  resize();addEventListener('resize',resize);
  const vio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){if(!running){running=true;draw();}}else{running=false;cancelAnimationFrame(raf);}}),{threshold:.05});
  vio.observe(c);
  // default panel on load (desktop)
  if(!isMobile())setTimeout(()=>{sel=1;showPanel(1);},400);
})();

/* ===================================================================
   OFFICES — live local time
   =================================================================== */
(function(){
  const host=document.getElementById('offices');if(!host)return;
  const offices=[
    {city:'Miami',tz:'America/New_York',addr:'78 SW 7th St, Miami, FL · HQ',lead:'Henrique Driessen'},
    {city:'West Palm Beach',tz:'America/New_York',addr:'West Palm Beach, FL'},
    {city:'Chicago',tz:'America/Chicago',addr:'153 W Ohio St, Chicago, IL'},
    {city:'New York',tz:'America/New_York',addr:'154 W 14th St, New York, NY'},
    {city:'Vancouver',tz:'America/Vancouver',addr:'22 East 5th Ave #400, BC, Canada'},
    {city:'Lisbon',tz:'Europe/Lisbon',addr:'Av. Miguel Bombarda 36, Lisbon',lead:'Alix Silgueiro'},
    {city:'São Paulo',tz:'America/Sao_Paulo',addr:'São Paulo, Brazil',lead:'Fabio Brunelli'},
    {city:'Curitiba',tz:'America/Sao_Paulo',addr:'Curitiba, Brazil',lead:'Marianna Magalhães'},
    {city:'Ho Chi Minh',tz:'Asia/Ho_Chi_Minh',addr:'Ho Chi Minh City, Vietnam'},
    {city:'Dubai',tz:'Asia/Dubai',addr:'One Central, The Offices 4, Dubai',lead:'Irshaad Ahmad'}
  ];
  host.innerHTML=offices.map((o,i)=>`<div class="office reveal">
    <div class="city">${o.city}<span class="time" data-tz="${o.tz}">--:--</span></div>
    <div class="addr">${o.addr}${o.lead?'<br>Lead: '+o.lead:''}</div></div>`).join('');
  host.querySelectorAll('.office').forEach((el,i)=>{el.style.transitionDelay=(i%4*60)+'ms';io.observe(el);});
  function tick(){
    document.querySelectorAll('.office .time').forEach(t=>{
      try{t.textContent=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:t.dataset.tz}).format(new Date());}catch(e){}
    });
  }
  tick();setInterval(tick,1000*30);
})();

/* ===================================================================
   WORD WALL — hover thumbnails on the bold words
   =================================================================== */
(function(){
  const wall=document.querySelector('.wordwall'); const thumb=document.getElementById('wwThumb');
  if(!wall||!thumb)return;
  const img=thumb.querySelector('img');
  const imgs=['basecamp-icon.png'];
  // preload on hover-capable devices so every thumbnail appears instantly on first hover
  if(window.matchMedia&&window.matchMedia('(hover:hover)').matches){imgs.forEach(function(src){var im=new Image();im.src=src;});}
  // every word (bold + italic) gets a thumbnail
  const spans=Array.prototype.slice.call(wall.querySelectorAll('.ww-inner span'));
  spans.forEach((s,i)=>{
    s.dataset.img=imgs[i%imgs.length];
    s.addEventListener('mouseenter',()=>{
      img.src=s.dataset.img;
      const wr=wall.getBoundingClientRect(), r=s.getBoundingClientRect();
      let left=(r.left-wr.left)+r.width/2-112;
      let top=(r.top-wr.top)-160;
      if(top<8) top=(r.bottom-wr.top)+14;
      left=Math.max(8,Math.min(left,wall.clientWidth-232));
      thumb.style.left=left+'px'; thumb.style.top=top+'px';
      thumb.classList.add('show');
    });
    s.addEventListener('mouseleave',()=>thumb.classList.remove('show'));
  });
})();

/* ===================================================================
   HUBES — one small spinning globe per office (name always visible;
   click a globe to reveal its local time, status & address)
   =================================================================== */
(function(){
  const grid=document.getElementById('hubs'); if(!grid)return;
  const D=Math.PI/180, PINK='#FF5A2E';
  const offices=[
    {name:'New York',tz:'America/New_York',lat:40.71,lon:-74.01,addr:'154 W 14th St, New York, NY'},
    {name:'Miami',tz:'America/New_York',lat:25.76,lon:-80.19,addr:'78 SW 7th St, Miami, FL · HQ'},
    {name:'West Palm Beach',tz:'America/New_York',lat:26.71,lon:-80.05,addr:'West Palm Beach, FL'},
    {name:'Chicago',tz:'America/Chicago',lat:41.88,lon:-87.63,addr:'153 W Ohio St, Chicago, IL'},
    {name:'Lisbon',tz:'Europe/Lisbon',lat:38.72,lon:-9.14,addr:'Av. Miguel Bombarda 36, Lisbon'},
    {name:'Vancouver',tz:'America/Vancouver',lat:49.28,lon:-123.12,addr:'22 East 5th Ave #400, BC, Canada'},
    {name:'São Paulo',tz:'America/Sao_Paulo',lat:-23.55,lon:-46.63,addr:'São Paulo, Brazil'},
    {name:'Curitiba',tz:'America/Sao_Paulo',lat:-25.43,lon:-49.27,addr:'Curitiba, Brazil'},
    {name:'Dubai',tz:'Asia/Dubai',lat:25.20,lon:55.27,addr:'One Central, The Offices 4, Dubai'},
    {name:'Ho Chi Minh',tz:'Asia/Ho_Chi_Minh',lat:10.82,lon:106.63,addr:'Ho Chi Minh City, Vietnam'}
  ];
  const ll=(lat,lon)=>{const a=lat*D,b=lon*D;return {x:Math.cos(a)*Math.cos(b),y:Math.sin(a),z:Math.cos(a)*Math.sin(b)};};
  const sphere=[]; for(let lat=-72;lat<=72;lat+=14){const r=Math.cos(lat*D);const n=Math.max(5,Math.round(22*r));for(let k=0;k<n;k++)sphere.push(ll(lat,(k/n)*360-180));}
  offices.forEach(o=>o.v=ll(o.lat,o.lon));
  grid.innerHTML=offices.map((o,i)=>`<button class="hub" data-i="${i}">
    <canvas class="hub-canvas"></canvas>
    <div class="hub-name">${o.name}</div>
    <div class="hub-status" data-st></div>
    <div class="hub-info" data-info></div></button>`).join('');
  const tilt=18*D;
  const hubs=Array.prototype.slice.call(grid.querySelectorAll('.hub')).map((el,i)=>{
    const cv=el.querySelector('canvas');
    return {el,cv,ctx:cv.getContext('2d'),o:offices[i],rot:Math.random()*6.28,
      st:el.querySelector('[data-st]'),info:el.querySelector('[data-info]'),W:0,H:0};
  });
  function size(h){const dpr=Math.min(devicePixelRatio||1,2);const r=h.cv.getBoundingClientRect();h.W=r.width;h.H=r.height;if(!h.W)return;h.cv.width=h.W*dpr;h.cv.height=h.H*dpr;h.ctx.setTransform(dpr,0,0,dpr,0,0);}
  const timeOf={},hourOf={},dowOf={};
  // all offices run a Mon–Fri week (incl. Dubai, on the UAE's Mon–Fri week since 2022; weekend = Sat & Sun)
  const open=o=>{const d=dowOf[o.name];return d!=='Sat'&&d!=='Sun'&&hourOf[o.name]>=8&&hourOf[o.name]<19;};
  function refresh(){const now=new Date();offices.forEach(o=>{
    timeOf[o.name]=new Intl.DateTimeFormat('en-US',{timeZone:o.tz,hour:'numeric',minute:'2-digit',hour12:true}).format(now);
    dowOf[o.name]=new Intl.DateTimeFormat('en-US',{timeZone:o.tz,weekday:'short'}).format(now);
    hourOf[o.name]=+new Intl.DateTimeFormat('en-US',{timeZone:o.tz,hour:'2-digit',hour12:false}).format(now)%24;});
    hubs.forEach(h=>{const ok=open(h.o);
      h.st.innerHTML=`<i style="background:${ok?PINK:'#b9b4a8'}"></i><span style="color:${ok?PINK:'#8a867d'}">${ok?'Open':'Closed'}</span>`;
      h.info.innerHTML=`${timeOf[h.o.name]||''} local · ${h.o.addr}<br><a href="mailto:hello@basecampstudio.pk?subject=Hello%20from%20${encodeURIComponent(h.o.name)}">hello@basecampstudio.pk →</a>`;});
  }
  function proj(h,v){const cR=Math.cos(h.rot),sR=Math.sin(h.rot);let x=v.x*cR+v.z*sR,z=-v.x*sR+v.z*cR,y=v.y;
    const ct=Math.cos(tilt),st=Math.sin(tilt);const y2=y*ct-z*st,z2=y*st+z*ct;const pe=1.7/(1.7-z2);const R=Math.min(h.W,h.H)*0.40;
    return {x:h.W/2+x*R*pe,y:h.H/2-y2*R*pe,z:z2,pe};}
  let running=false,raf;
  function frame(){if(!running)return;
    for(const h of hubs){if(!h.W){size(h);continue;}const ctx=h.ctx;ctx.clearRect(0,0,h.W,h.H);
      for(const d of sphere){const p=proj(h,d);if(p.z<-0.05)continue;ctx.globalAlpha=0.10+0.16*((p.z+1)/2);ctx.fillStyle='#1a1a1a';ctx.beginPath();ctx.arc(p.x,p.y,1.05*p.pe,0,6.3);ctx.fill();}
      ctx.globalAlpha=1;const m=proj(h,h.o.v),ok=open(h.o);
      if(m.z>-0.12){const col=ok?PINK:'#9a958a';const g=ctx.createRadialGradient(m.x,m.y,0,m.x,m.y,13);g.addColorStop(0,ok?'rgba(255,90,46,.6)':'rgba(150,150,150,.5)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(m.x,m.y,13,0,6.3);ctx.fill();
        ctx.fillStyle=col;ctx.beginPath();ctx.arc(m.x,m.y,m.z>0?5:3.4,0,6.3);ctx.fill();}
      h.rot+=0.0016;}
    raf=requestAnimationFrame(frame);}
  hubs.forEach(h=>h.el.addEventListener('click',()=>h.el.classList.toggle('open')));
  refresh(); setInterval(refresh,1000);
  addEventListener('resize',()=>hubs.forEach(size));
  new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){if(!running){running=true;hubs.forEach(size);raf=requestAnimationFrame(frame);}}
    else{running=false;cancelAnimationFrame(raf);}
  }),{threshold:.05}).observe(grid);
})();

/* ===================================================================
   PARTNERS marquee — duplicate the track for a seamless loop
   =================================================================== */
(function(){
  const t=document.getElementById('mtrack'); if(!t)return;
  t.innerHTML += t.innerHTML; // two identical halves → -50% translate loops seamlessly
})();

/* ===================================================================
   PARTNERS — random order each load, one row, expand for the rest
   =================================================================== */
(function(){
  const grid=document.getElementById('clientsGrid'); const btn=document.getElementById('clientsToggle');
  const fbar=document.getElementById('clientsFilters'); if(!grid)return;
  // shuffle each load — priority (folder) logos first and always visible, the rest behind Expand all
  const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=a[i];a[i]=a[j];a[j]=t;}return a;};
  const allCards=Array.prototype.slice.call(grid.children);
  const pri=shuffle(allCards.filter(c=>c.dataset.pri)), rest=shuffle(allCards.filter(c=>!c.dataset.pri));
  pri.concat(rest).forEach(c=>grid.appendChild(c));
  const cols=()=>{const w=window.innerWidth;return w<=560?3:(w<=900?3:5);};
  let open=false, fk='all', fv='all';
  const all=()=>Array.prototype.slice.call(grid.children);
  function passFilter(c){return fk==='all'||c.dataset[fk]===fv;}
  function apply(){
    const filtering=(fk!=='all');
    all().forEach(c=>c.classList.toggle('hidden',!passFilter(c)));
    if(!filtering && !open){ // collapsed: keep priority logos, hide the rest
      all().forEach(c=>{if(!c.dataset.pri)c.classList.add('hidden');});
    }
    if(btn) btn.style.display=filtering?'none':'';  // expand only relevant with no filter
    if(btn) btn.textContent=open?'Show less ←':'Expand all →';
  }
  apply();
  if(btn) btn.addEventListener('click',()=>{open=!open;apply();});
  if(fbar) fbar.querySelectorAll('.cf').forEach(b=>b.addEventListener('click',()=>{
    fbar.querySelectorAll('.cf').forEach(x=>x.classList.remove('on'));b.classList.add('on');
    fk=b.dataset.k;fv=b.dataset.v;open=false;apply();
  }));
  addEventListener('resize',apply);
})();
