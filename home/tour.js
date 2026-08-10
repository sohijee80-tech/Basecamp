/* ===========================================================
   BaseCamp Studio — Guided Tour (cross-page)
   Self-contained: injects its own CSS, persists state in
   localStorage so the tour continues across page navigations.
   Public API: window.ESTour.start() / .resume() / .exit()
   Trigger: any element with [data-tour-start].
   =========================================================== */
(function(){
  var LS='es_tour';
  var DUR=9000; /* auto-advance per step (ms) */

  /* ---- the tour script ---- */
  var STEPS=[
    {page:'index.html', sel:'.hero-copy', hash:'#top', wait:400,
     title:'Welcome to BaseCamp Studio',
     body:'The go-to-market partner for real estate. One integrated system for intelligence, strategy, creativity and execution.'},
    {page:'hello.html', sel:'#postit', hash:'#postit', wait:1000, fn:'helloSkip',
     title:'It started with a note',
     body:'BaseCamp Studio began with a single post-it. A reminder that the best brands start from an idea worth keeping.'},
    {page:'hello.html', sel:'#letter', hash:'#letter', wait:1600, fn:'founderGlobe',
     title:'A letter from the founder',
     body:'Click the globe and it opens: a living system of projects, people and markets. This is BaseCamp Studio, in numbers.'},
    {page:'approach.html', sel:'#top', hash:'#top', wait:500,
     title:'The Framework',
     body:'CHEF®, our operating system. The method that turns strategy into differentiation, demand and performance.'},
    {page:'approach.html', sel:'#difference', hash:'#difference', wait:600,
     title:'The BaseCamp Studio difference',
     body:'Intelligence before execution. Strategy before creativity. Performance by design. That order is everything.'},
    {page:'approach.html', sel:'.chef-top', sel2:'#chefTiles', scroll:'start', hash:'#chef', wait:900, click:'#chefTiles .chef-tile[data-i="1"]',
     title:'The operating system, CHEF®',
     body:'Not a list of deliverables, but an operating system. Context, Human, Experience, Funnel, the four layers that turn data into project value.'},
    {page:'approach.html', sel:'.chef-flow', wait:900, fn:'cycleFunnel',
     title:'Real Estate 101',
     body:'Watch the funnel light up: strategy to differentiation to demand to performance. The tabs shift as each stage takes over.'},
    {page:'whatwedo.html', sel:'#engine', hash:'#engine', wait:600,
     title:'The Complete Growth Engine',
     body:'Five disciplines, one continuous system, from market insight to commercial activation. Open any pillar to explore.'},
    {page:'whatwedo.html', sel:'#universe', hash:'#machine-sec', wait:1200, fn:'playMachine',
     title:'The BaseCamp Studio Machine',
     body:'Watch it run: the CHEF® core powers on and the whole system plays through, inputs becoming brand, experience, assets and demand.'},
    {page:'projects.html', sel:'#viewSwitch', wait:1000, fn:'viewShowcase',
     title:'One portfolio, five lenses',
     body:'Grid, list, map, showcase and data. The same projects seen through different views, switch them anytime.'},
    {page:'projects.html', sel:'.galaxy', wait:1200, fn:'viewData',
     title:'The Data Galaxy',
     body:'Every project as a star. Connected to Peanut OS, our data platform, and powered by real BaseCamp Studio data.'},
    /* Case: Tempo */
    {page:'project.html?id=tempo', sel:'.phero-in', wait:700,
     title:'Case study: Tempo',
     body:'Foster + Partners’ first residential project in Brazil, on Praia Brava. A full go-to-market system, from brand to sales.'},
    {page:'project.html?id=tempo', sel:'.pover', wait:600,
     title:'Overview',
     body:'Eight towers and an Emiliano hotel, built around one idea: time as the ultimate luxury.'},
    {page:'project.html?id=tempo', sel:'.over-svc', wait:600,
     title:'What we did',
     body:'From commercial intelligence to launch: strategy, narrative, content systems and high-performance visuals, as one system.'},
    {page:'project.html?id=tempo', sel:'.s-feat', wait:600,
     title:'Architecture',
     body:'Born of the land. Foster + Partners shaped Tempo from the geography: curves drawn by light, wind and the Atlantic.'},
    {page:'project.html?id=tempo', sel:'#bp-logo', wait:800, click:'.s-brandsys .bst[data-p="bp-logo"]',
     title:'The logo lab',
     body:'The brand system, live. The logo lab shows the mark across surfaces, colour and context, all from one idea: time as the ultimate luxury.'},
    {page:'project.html?id=tempo', sel:'.s-broch', wait:600,
     title:'The brochure',
     body:'274 pages, one feeling. The book that carries the story into the buyer’s hands.'},
    {page:'project.html?id=tempo', sel:'.s-escfilm', wait:700,
     title:'The experience',
     body:'Selling a feeling before it exists. The experience film lets buyers step inside Tempo before a single wall is built.'},
    {page:'project.html?id=tempo', sel:'.s-news', wait:600,
     title:'In the press',
     body:'The launch earned real coverage, from O Globo to Foster + Partners’ own newsroom. Proof the story travelled.'},
    /* Case: Colette */
    {page:'project.html?id=colette', sel:'.phero-in', wait:700,
     title:'Case study: Colette',
     body:'A boutique tower in Miami’s South Brickell. A brand made human: considered, intimate and precise.'},
    {page:'project.html?id=colette', sel:'.pover', wait:600,
     title:'Overview',
     body:'From positioning to sales, Colette leads the “go boutique” movement, a rare address for the few, admired by the many.'},
    {page:'project.html?id=colette', sel:'.csarah-app', wait:1000,
     title:'Sarah Cole, the experience',
     body:'Meet Sarah, a fully AI-generated character built by BaseCamp Studio as the face and voice of Colette, live on the page.'},
    /* The herd */
    {page:'theelephants.html', sel:'#top', hash:'#top', wait:800,
     title:'The herd',
     body:'Behind every project are the Elephants, drifting here as a living constellation of people.'},
    {page:'theelephants.html', sel:'#top', hash:'#top', wait:1200, fn:'gatherHerd',
     title:'One click, one herd',
     body:'Click the globe and the herd gathers, organising into orbit around the core. Leaders inner, the whole team around them.'},
    {page:'theelephants.html', sel:'#drawer', wait:1200, fn:'openHenrique',
     title:'Meet an Elephant',
     body:'Every face opens a full profile. Here is Henrique, our founder, his story, role and Herd Pass.'},
    /* FAQ */
    {page:'faq.html', sel:'.faq-tools-in', wait:700,
     title:'Questions, answered',
     body:'Search any question, hit Expand all, or browse by category. The answers before we even meet. That’s the tour, welcome to the herd.'}
  ];

  /* per-page interactive hooks (guarded) */
  var HOOKS={
    helloSkip:function(){ var s=document.getElementById('introSkip'); if(s) s.click(); },
    founderGlobe:function(){ var s=document.getElementById('introSkip'); if(s) s.click(); setTimeout(function(){ var c=document.getElementById('sysCv'); if(c) c.click(); },900); },
    powerMachine:function(){ var c=document.getElementById('uniCore'), u=document.getElementById('universe'); if(c&&u&&!u.classList.contains('powered')) c.click(); },
    viewShowcase:function(){ if(typeof window.setView==='function') window.setView('show'); },
    viewData:function(){ if(typeof window.setView==='function') window.setView('data'); },
    gatherHerd:function(){ var t=document.getElementById('top'), c=document.getElementById('herdCore'); if(c&&t&&!t.classList.contains('on')) c.click(); },
    openHenrique:function(){ if(typeof window.openDrawer==='function') window.openDrawer(0); },
    cycleFunnel:function(){ var chips=[].slice.call(document.querySelectorAll('#cfChips .cfc')); if(!chips.length) return; var k=0; (function step(){ if(!document.body.contains(chips[0])) return; if(k<chips.length){ try{chips[k].click();}catch(e){} k++; setTimeout(step,1700); } })(); },
    playMachine:function(){ var pb=document.getElementById('uniPlay'); if(pb){ pb.click(); return; } var c=document.getElementById('uniCore'), u=document.getElementById('universe'); if(c&&u&&!u.classList.contains('powered')) c.click(); }
  };

  function state(){ try{return JSON.parse(localStorage.getItem(LS))||null;}catch(e){return null;} }
  function save(s){ try{localStorage.setItem(LS,JSON.stringify(s));}catch(e){} }
  function clearS(){ try{localStorage.removeItem(LS);}catch(e){} }
  function normPage(pg){ pg=String(pg).replace(/\.html/i,''); if(pg==='') pg='index'; return pg; }
  function curPage(){
    var b=(location.pathname.split('/').pop()||'index'); b=b.replace(/\.html$/i,''); if(!b) b='index';
    if(b==='project'){ var m=location.search.match(/id=([^&]+)/); return 'project?id='+(m?m[1]:''); }
    return b;
  }

  /* ---------- inject CSS ---------- */
  var CSS=''
  +'.tour-block{position:fixed;inset:0;z-index:99990;background:transparent}'
  +'.tour-hole{position:fixed;z-index:99991;border-radius:10px;box-shadow:0 0 0 9999px rgba(6,6,6,.74);pointer-events:none;transition:all .4s cubic-bezier(.4,0,.2,1);outline:2px solid #FF5A2E;outline-offset:2px}'
  +'.tour-hole.nohole{box-shadow:0 0 0 9999px rgba(6,6,6,.82);outline:none;width:0;height:0}'
  +'.tour-card{position:fixed;z-index:99993;width:min(360px,calc(100vw - 32px));background:#0e0e0e;color:#f3f1ea;border:1px solid rgba(255,255,255,.12);border-radius:14px;box-shadow:0 24px 60px rgba(0,0,0,.5);overflow:hidden;font-family:"Aaux Pro Light","Helvetica Neue",Arial,sans-serif;transition:top .35s ease,left .35s ease,opacity .3s}'
  +'.tour-card .tc-bar{height:3px;background:rgba(255,255,255,.12)}'
  +'.tour-card .tc-fill{height:100%;width:0;background:#FF5A2E}'
  +'.tour-card .tc-close{position:absolute;top:9px;right:10px;width:26px;height:26px;padding:0;border:none;border-radius:999px;background:none;color:#8a867d;font-size:20px;line-height:24px;cursor:pointer}'
  +'.tour-card .tc-close:hover{color:#FF5A2E}'
  +'.tour-card .tc-in{padding:20px 22px 18px}'
  +'.tour-card .tc-step{font-family:"Aaux Pro Medium","Helvetica Neue",Arial,sans-serif;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#FF5A2E}'
  +'.tour-card h4{font-family:"Etna","Helvetica Neue",Arial,sans-serif;text-transform:uppercase;font-size:20px;line-height:1.04;letter-spacing:-.01em;margin:10px 0 8px;color:#fff}'
  +'.tour-card p{font-size:14.5px;line-height:1.5;color:#cfcbc0}'
  +'.tour-card .tc-act{display:flex;align-items:center;gap:8px;margin-top:18px}'
  +'.tour-card button{font-family:"Aaux Pro Medium","Helvetica Neue",Arial,sans-serif;font-size:11px;letter-spacing:.1em;text-transform:uppercase;border-radius:999px;cursor:pointer;border:1.5px solid rgba(255,255,255,.2);background:none;color:#f3f1ea;padding:10px 16px;transition:.2s}'
  +'.tour-card button:hover{border-color:#FF5A2E;color:#FF5A2E}'
  +'.tour-card button.tc-next{background:#FF5A2E;border-color:#FF5A2E;color:#fff}'
  +'.tour-card button.tc-next:hover{background:#fff;color:#FF5A2E;border-color:#fff}'
  +'.tour-card .tc-pause{margin-left:auto;border:none;padding:10px 8px;color:#8a867d}'
  +'.tour-card .tc-pause:hover{color:#FF5A2E}'
  +'.tour-card .tc-back{padding:10px 14px}'
  +'.tour-card.tc-mobile{left:16px!important;right:16px;bottom:16px;top:auto!important;width:auto}'
  /* overlays */
  +'.tour-ov{position:fixed;inset:0;z-index:99995;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:28px;opacity:0;visibility:hidden;transition:opacity .4s,visibility .4s;font-family:"Aaux Pro Light","Helvetica Neue",Arial,sans-serif}'
  +'.tour-ov.on{opacity:1;visibility:visible}'
  +'.tour-ov.welcome{background:#FF5A2E;color:#fff}'
  +'.tour-ov.end{background:#070707;color:#f3f1ea}'
  +'.tour-ov .ov-eye{font-family:"Aaux Pro Medium",Arial,sans-serif;font-size:12px;letter-spacing:.22em;text-transform:uppercase;opacity:.9;margin-bottom:20px}'
  +'.tour-ov.end .ov-eye{color:#FF5A2E}'
  +'.tour-ov h2{font-family:"Etna","Helvetica Neue",Arial,sans-serif;text-transform:uppercase;font-size:clamp(38px,8vw,96px);line-height:.9;letter-spacing:-.02em}'
  +'.tour-ov.end h2 .pk{color:#FF5A2E}'
  +'.tour-ov p{font-size:clamp(15px,1.9vw,20px);max-width:520px;margin:22px auto 0;opacity:.94;line-height:1.5}'
  +'.tour-ov .ov-btn{display:inline-flex;align-items:center;gap:8px;margin-top:30px;padding:15px 30px;border-radius:999px;font-family:"Aaux Pro Medium",Arial,sans-serif;font-size:12px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;border:2px solid #fff;background:#fff;color:#FF5A2E;transition:transform .2s,background .2s,color .2s}'
  +'.tour-ov.welcome .ov-btn:hover{transform:translateY(-2px)}'
  +'.tour-ov .ov-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:30px}'
  +'.tour-ov.end .ov-btn.solid{background:#FF5A2E;border-color:#FF5A2E;color:#fff}'
  +'.tour-ov.end .ov-btn.ghost{background:none;border-color:rgba(255,255,255,.3);color:#f3f1ea}'
  +'.tour-ov.end .ov-btn.ghost:hover{border-color:#FF5A2E;color:#FF5A2E}'
  +'.tour-ov .ov-small{margin-top:26px;display:flex;gap:20px;justify-content:center}'
  +'.tour-ov .ov-small a{font-family:"Aaux Pro Medium",Arial,sans-serif;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:inherit;opacity:.7;cursor:pointer;border-bottom:1px solid transparent}'
  +'.tour-ov .ov-small a:hover{opacity:1;border-color:currentColor}'
  +'.tour-count{font-family:"Etna",Arial,sans-serif;font-size:clamp(80px,20vw,220px);line-height:1;color:#fff}'
  +'.tour-ov.welcome .ov-x,.tour-ov.end .ov-x{position:absolute;top:22px;right:24px;font-size:30px;line-height:1;cursor:pointer;opacity:.8;background:none;border:none;color:inherit}'
  /* resume pill */
  +'.tour-pill{position:fixed;left:20px;bottom:20px;z-index:99994;display:none;align-items:center;gap:12px;background:#0e0e0e;color:#f3f1ea;border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:10px 12px 10px 18px;box-shadow:0 14px 34px rgba(0,0,0,.4);font-family:"Aaux Pro Medium",Arial,sans-serif;font-size:12px;letter-spacing:.06em}'
  +'.tour-pill.on{display:flex}'
  +'.tour-pill button{border:none;cursor:pointer;font-family:inherit;font-size:11px;letter-spacing:.08em;text-transform:uppercase;border-radius:999px;padding:8px 14px}'
  +'.tour-pill .rp-go{background:#FF5A2E;color:#fff}'
  +'.tour-pill .rp-x{background:none;color:#8a867d;padding:8px 6px}'
  +'.tour-pill .rp-x:hover{color:#FF5A2E}'
  +'@media(prefers-reduced-motion:reduce){.tour-hole,.tour-card{transition:none}}';

  var styleEl=document.createElement('style');styleEl.textContent=CSS;

  /* ---------- build DOM ---------- */
  var block,hole,card,fill,welcome,endOv,pill,built=false;
  function build(){
    if(built)return; built=true;
    document.head.appendChild(styleEl);
    block=el('div','tour-block');
    hole=el('div','tour-hole');
    card=el('div','tour-card');
    card.innerHTML='<div class="tc-bar"><div class="tc-fill"></div></div>'
      +'<button class="tc-close" title="End tour">&times;</button>'
      +'<div class="tc-in"><div class="tc-step"></div><h4></h4><p></p>'
      +'<div class="tc-act"><button class="tc-back">Back</button><button class="tc-next">Next →</button>'
      +'<button class="tc-pause" title="Pause">Pause</button></div></div>';
    fill=card.querySelector('.tc-fill');
    pill=el('div','tour-pill');
    pill.innerHTML='<span>Guided tour paused</span><button class="rp-go">▸ Resume</button><button class="rp-x" title="End">End</button>';
    [block,hole,card,pill].forEach(function(n){document.body.appendChild(n);});
    card.querySelector('.tc-next').addEventListener('click',function(){next();});
    card.querySelector('.tc-back').addEventListener('click',function(){back();});
    card.querySelector('.tc-pause').addEventListener('click',function(){togglePause();});
    card.querySelector('.tc-close').addEventListener('click',function(){exit();});
    /* hover-to-pause only on real pointer devices — on touch it would fire
       mouseenter (pause) with no matching mouseleave and freeze the tour */
    var canHover = !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    if(canHover){
      card.addEventListener('mouseenter',function(){pauseTimer();});
      card.addEventListener('mouseleave',function(){ if(!isPaused()) resumeTimer(); });
    }
    pill.querySelector('.rp-go').addEventListener('click',resume);
    pill.querySelector('.rp-x').addEventListener('click',exit);
    addEventListener('resize',reposition,{passive:true});
    addEventListener('scroll',reposition,{passive:true});
  }
  function el(t,c){var e=document.createElement(t);if(c)e.className=c;return e;}

  /* ---------- welcome + countdown ---------- */
  function showWelcome(){
    build();
    welcome=el('div','tour-ov welcome');
    welcome.innerHTML='<button class="ov-x" title="Close">&times;</button>'
      +'<div class="ov-eye">Guided tour</div>'
      +'<h2>Welcome to<br>our world.</h2>'
      +'<p>A quick walk through how BaseCamp Studio thinks, works and delivers. Are you ready?</p>'
      +'<button class="ov-btn ov-go">I’m ready →</button>';
    document.body.appendChild(welcome);
    requestAnimationFrame(function(){welcome.classList.add('on');});
    welcome.querySelector('.ov-x').addEventListener('click',function(){welcome.remove();exit();});
    welcome.querySelector('.ov-go').addEventListener('click',function(){
      var n=3; var host=welcome.querySelector('h2');
      welcome.querySelector('p').style.display='none';
      welcome.querySelector('.ov-go').style.display='none';
      welcome.querySelector('.ov-eye').textContent='Get ready';
      function tick(){
        host.outerHTML='<div class="tour-count">'+n+'</div>';
        host=welcome.querySelector('.tour-count');
        if(n===0){ setTimeout(function(){ welcome.remove(); run(0); },500); return; }
        n--; setTimeout(tick,800);
      }
      host.outerHTML='<div class="tour-count">3</div>'; host=welcome.querySelector('.tour-count'); n=2;
      setTimeout(tick,800);
    });
  }

  /* ---------- end ---------- */
  function showEnd(){
    build();
    endOv=el('div','tour-ov end');
    endOv.innerHTML='<button class="ov-x" title="Close">&times;</button>'
      +'<div class="ov-eye">That’s the herd</div>'
      +'<h2>Don’t be shy.<br>Say <span class="pk">Hi.</span></h2>'
      +'<p>Now let’s talk about your project.</p>'
      +'<div class="ov-row"><a class="ov-btn solid" href="brief.html">Start a project brief →</a>'
      +'<a class="ov-btn ghost" href="mailto:hello@basecampstudio.pk?subject=Hello%20Elephant%20Skin">hello@basecampstudio.pk</a></div>'
      +'<div class="ov-small"><a class="ov-replay">↻ Replay the tour</a><a class="ov-close">Close</a></div>';
    document.body.appendChild(endOv);
    requestAnimationFrame(function(){endOv.classList.add('on');});
    endOv.querySelector('.ov-x').addEventListener('click',goHome);
    endOv.querySelector('.ov-close').addEventListener('click',goHome);
    endOv.querySelector('.ov-replay').addEventListener('click',function(){ if(endOv)endOv.remove(); start(); });
    function goHome(){ endOv.classList.remove('on'); setTimeout(function(){ location.href='index.html'; },350); }
  }

  /* ---------- timer ---------- */
  var raf,tStart,tRemain=DUR,running=false;
  function startTimer(){ tRemain=DUR; tStart=Date.now(); running=true; loop(); }
  function loop(){ if(!running)return; var e=Date.now()-tStart; var p=Math.min(1,e/DUR); if(fill)fill.style.width=(p*100)+'%';
    if(p>=1){ running=false; next(); return; } raf=requestAnimationFrame(loop); }
  function pauseTimer(){ if(!running)return; cancelAnimationFrame(raf); tRemain=DUR-(Date.now()-tStart); running=false; }
  function resumeTimer(){ if(running||isPaused())return; tStart=Date.now()-(DUR-tRemain); running=true; loop(); }
  function stopTimer(){ running=false; cancelAnimationFrame(raf); if(fill)fill.style.width='0%'; }

  function isPaused(){ var s=state(); return !s||s.paused; }

  /* ---------- run a step ---------- */
  function run(i){
    var s=state()||{active:true}; s.active=true; s.paused=false; s.i=i; save(s);
    var st=STEPS[i];
    if(!st){ finish(); return; }
    if(normPage(st.page)!==curPage()){ location.href=st.page; return; }
    build(); hidePill();
    if(welcome&&welcome.parentNode){/* keep until removed by countdown */}
    /* pre-action */
    try{ if(st.fn&&HOOKS[st.fn]) HOOKS[st.fn](); else if(st.click){ var c=document.querySelector(st.click); if(c) c.click(); } }catch(e){}
    /* scroll target into view */
    var target=st.sel?document.querySelector(st.sel):null;
    if(target){ try{ target.scrollIntoView({behavior:'smooth',block:(st.scroll||'center')}); }catch(e){ target.scrollIntoView(); } }
    block.style.display='block'; if(hole)hole.style.display='block'; if(card)card.style.pointerEvents='auto';
    setTimeout(function(){ placeStep(st,i); startTimer(); }, st.wait||500);
  }
  var curSel=null, curStep=null;
  function rectFor(st){
    if(!st||!st.sel) return null;
    var a=document.querySelector(st.sel); if(!a) return null;
    var r=a.getBoundingClientRect();
    var out={left:r.left,top:r.top,right:r.right,bottom:r.bottom};
    if(st.sel2){ var b=document.querySelector(st.sel2); if(b){ var r2=b.getBoundingClientRect();
      out.left=Math.min(out.left,r2.left); out.top=Math.min(out.top,r2.top);
      out.right=Math.max(out.right,r2.right); out.bottom=Math.max(out.bottom,r2.bottom); } }
    out.width=out.right-out.left; out.height=out.bottom-out.top; return out;
  }
  function placeStep(st,i){
    curSel=st.sel; curStep=st;
    card.querySelector('.tc-step').textContent='Stop '+(i+1)+' / '+STEPS.length;
    card.querySelector('h4').textContent=st.title;
    card.querySelector('p').textContent=st.body;
    card.querySelector('.tc-back').style.visibility=i===0?'hidden':'visible';
    card.querySelector('.tc-next').textContent=(i===STEPS.length-1)?'Finish →':'Next →';
    var pb=card.querySelector('.tc-pause'); if(pb)pb.textContent='Pause';
    card.style.opacity='1';
    positionFor(rectFor(st));
  }
  function positionFor(r){
    var mobile=innerWidth<=760;
    if(r){
      var pad=8;
      hole.classList.remove('nohole');
      hole.style.left=(r.left-pad)+'px'; hole.style.top=(r.top-pad)+'px';
      hole.style.width=(r.width+pad*2)+'px'; hole.style.height=(r.height+pad*2)+'px';
    }else{
      hole.classList.add('nohole');
      hole.style.left='50%'; hole.style.top='50%'; hole.style.width='0'; hole.style.height='0';
    }
    if(mobile){ card.classList.add('tc-mobile'); return; }
    card.classList.remove('tc-mobile');
    var cw=Math.min(360,innerWidth-32), ch=card.offsetHeight||220;
    /* pinned: the card stays in one spot (bottom-right) instead of jumping to each target */
    card.style.left=(innerWidth-cw-24)+'px';
    card.style.top=(innerHeight-ch-24)+'px';
  }
  function reposition(){ if(card&&block&&block.style.display==='block'){ positionFor(rectFor(curStep)); } }

  /* ---------- controls ---------- */
  function next(){ var s=state(); if(!s)return; stopTimer(); if(s.i>=STEPS.length-1){ finish(); return; } run(s.i+1); }
  function back(){ var s=state(); if(!s||s.i<=0)return; stopTimer(); run(s.i-1); }
  function togglePause(){ var s=state(); if(!s)return; var pb=card&&card.querySelector('.tc-pause');
    if(s.paused){ s.paused=false; save(s); if(pb)pb.textContent='Pause'; resumeTimer(); }
    else{ s.paused=true; save(s); pauseTimer(); if(pb)pb.textContent='▸ Resume'; } }
  function resume(){ var s=state(); if(!s)return; run(s.i); }
  function exit(){ clearS(); stopTimer(); hideStep(); hidePill(); }
  function finish(){ clearS(); stopTimer(); hideStep(); showEnd(); }
  function hideStep(){ if(block)block.style.display='none'; if(card){card.style.opacity='0';card.style.pointerEvents='none';} if(hole){hole.classList.add('nohole');hole.style.display='none';} }
  function showPill(){ build(); pill.classList.add('on'); }
  function hidePill(){ if(pill)pill.classList.remove('on'); }

  function start(){ build(); save({active:true,i:0,paused:false}); showWelcome(); }

  /* ---------- init on load ---------- */
  function init(){
    var s=state();
    if(s&&s.active){
      if(s.paused){ showPill(); }
      else{
        var st=STEPS[s.i];
        if(st&&normPage(st.page)===curPage()){ setTimeout(function(){ run(s.i); }, 400); }
        else { showPill(); } /* user wandered off, offer resume instead of hijacking */
      }
    }
  }
  document.addEventListener('click',function(e){ var b=e.target.closest('[data-tour-start]'); if(b){ e.preventDefault(); start(); } });
  window.ESTour={start:start,resume:resume,exit:exit};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
