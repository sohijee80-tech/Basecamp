/* Legal & Trust Center — shared behaviour */
(function(){
  var saved=localStorage.getItem('es_theme')||'dark';
  function set(t){document.documentElement.setAttribute('data-theme',t);localStorage.setItem('es_theme',t);
    document.querySelectorAll('#themeTog button').forEach(function(b){b.classList.toggle('on',b.dataset.theme===t);});}
  set(saved);
  document.querySelectorAll('#themeTog button').forEach(function(b){b.addEventListener('click',function(){set(b.dataset.theme);});});
  var menu=document.getElementById('menu');
  var mb=document.getElementById('menuBtn');if(mb)mb.addEventListener('click',function(){menu.classList.add('open');});
  var mc=document.getElementById('menuClose');if(mc)mc.addEventListener('click',function(){menu.classList.remove('open');});
  addEventListener('keydown',function(e){if(e.key==='Escape'&&menu)menu.classList.remove('open');});
  addEventListener('scroll',function(){var b=document.getElementById('bar');if(b)b.classList.toggle('scrolled',scrollY>20);},{passive:true});
  var s=document.getElementById('lhSearch');
  if(s){var cards=[].slice.call(document.querySelectorAll('.lh-card')),empty=document.getElementById('lhEmpty');
    s.addEventListener('input',function(){var q=s.value.trim().toLowerCase(),n=0;
      cards.forEach(function(c){var hit=c.dataset.s.toLowerCase().indexOf(q)>=0;c.classList.toggle('hide',!hit);if(hit)n++;});
      if(empty)empty.classList.toggle('show',n===0);});}
})();
