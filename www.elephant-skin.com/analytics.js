/* BaseCamp Studio — Analytics + conversion tracking.
   esTrack(event, params) fires a GA4 event (safe no-op if GA not loaded). */
(function(){
  var GA_ID='G-Q1P9HY13J8'; // GA4 Measurement ID
  window.esTrack=function(name,params){ try{ if(window.gtag) gtag('event',name,params||{}); }catch(e){} };

  // Auto-track email (mailto) clicks anywhere on the site → lead/contact signal
  document.addEventListener('click',function(e){
    var t=e.target; if(!t||!t.closest) return;
    var a=t.closest('a[href^="mailto:"]');
    if(a){ var em=a.getAttribute('href').replace('mailto:','').split('?')[0];
      window.esTrack('contact_click',{email:em}); return; }
    var brief=t.closest('a[href*="brief"]');
    if(brief){ window.esTrack('cta_click',{cta:'project_brief'}); }
  },true);

  if(!GA_ID || GA_ID.indexOf('XXXX')>-1) return; // no-op until configured
  var s=document.createElement('script'); s.async=true; s.src='https://www.googletagmanager.com/gtag/js?id='+GA_ID; document.head.appendChild(s);
  window.dataLayer=window.dataLayer||[]; function gtag(){dataLayer.push(arguments);} window.gtag=gtag;
  gtag('js',new Date()); gtag('config',GA_ID,{anonymize_ip:true});
})();
