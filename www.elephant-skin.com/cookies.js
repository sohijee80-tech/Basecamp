/* BaseCamp Studio — cookie consent banner (self-contained).
   Include on any page with: <script src="cookies.js" defer></script>
   Stores the choice in localStorage('es_cookie_consent') = 'accepted' | 'rejected'.
   Exposes window.esCookies = { consent, accepted, onAccept(cb) } so embeds (YouTube, etc.)
   can be gated on consent later. */
(function () {
  var KEY = 'es_cookie_consent';
  var prior = null;
  try { prior = localStorage.getItem(KEY); } catch (e) {}

  var acceptCbs = [];
  window.esCookies = {
    consent: prior,
    accepted: prior === 'accepted',
    onAccept: function (cb) {
      if (prior === 'accepted') cb();
      else acceptCbs.push(cb);
    }
  };

  if (prior === 'accepted' || prior === 'rejected') return; // already decided

  var css = '' +
    '.es-cc{position:fixed;left:24px;bottom:24px;z-index:9999;max-width:430px;width:calc(100% - 48px);' +
      'background:rgba(12,12,13,.94);color:#f3f1ea;border:1px solid rgba(255,255,255,.12);border-radius:16px;' +
      'padding:22px 24px 20px;box-shadow:0 24px 60px rgba(0,0,0,.5);backdrop-filter:blur(12px);' +
      'font-family:var(--font-body,"Aaux Pro Light","Helvetica Neue",Arial,sans-serif);' +
      'opacity:0;transform:translateY(16px);transition:opacity .4s ease,transform .4s ease}' +
    '.es-cc.in{opacity:1;transform:none}' +
    '.es-cc h4{font-family:var(--font-display,"Etna",Arial,sans-serif);text-transform:uppercase;' +
      'font-size:15px;letter-spacing:.02em;margin:0 0 8px}' +
    '.es-cc h4 b{color:#FF5A2E}' +
    '.es-cc p{font-size:13px;line-height:1.55;color:#c7c3ba;margin:0}' +
    '.es-cc .more{display:none;margin-top:10px}' +
    '.es-cc .more.show{display:block}' +
    '.es-cc a.lnk{color:#FF5A2E;cursor:pointer;text-decoration:none;border-bottom:1px solid rgba(255,90,46,.4)}' +
    '.es-cc .acts{display:flex;gap:10px;margin-top:16px;flex-wrap:wrap}' +
    '.es-cc button{font-family:var(--font-med,"Aaux Pro Medium",Arial,sans-serif);font-size:12px;letter-spacing:.06em;' +
      'text-transform:uppercase;padding:11px 20px;border-radius:999px;cursor:pointer;border:1.5px solid transparent;transition:.2s}' +
    '.es-cc .acc{background:#FF5A2E;color:#fff;border-color:#FF5A2E}' +
    '.es-cc .acc:hover{transform:translateY(-2px)}' +
    '.es-cc .rej{background:transparent;color:#f3f1ea;border-color:rgba(255,255,255,.28)}' +
    '.es-cc .rej:hover{border-color:#FF5A2E;color:#FF5A2E}' +
    '@media(max-width:560px){.es-cc{left:12px;right:12px;bottom:12px;width:auto;padding:18px 18px 16px}}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var el = document.createElement('div');
  el.className = 'es-cc';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'Cookie notice');
  el.innerHTML =
    '<h4>We use <b>cookies</b></h4>' +
    '<p>We use cookies and local storage to remember your preferences (like the theme) and, with your consent, ' +
    'to load embedded third-party content (such as YouTube videos). ' +
    '<a class="lnk" id="esCcMore">Learn more</a>' +
    '<span class="more" id="esCcMoreTxt"><br>Necessary and functional cookies keep the site working. ' +
    'Marketing/third-party cookies are only enabled if you accept. You can change your choice by clearing the site data in your browser.</span></p>' +
    '<div class="acts"><button class="acc" id="esCcAcc">Accept</button>' +
    '<button class="rej" id="esCcRej">Decline</button></div>';
  document.body.appendChild(el);
  function reveal() { requestAnimationFrame(function () { el.classList.add('in'); }); }
  /* On the home page the banner should wait until the visitor passes the intro
     ("click anywhere"): the body loses the 'intro-active' class when they enter. */
  if (document.body.classList.contains('intro-active')) {
    var mo = new MutationObserver(function () {
      if (!document.body.classList.contains('intro-active')) { mo.disconnect(); setTimeout(reveal, 600); }
    });
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  } else {
    reveal();
  }

  function decide(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
    window.esCookies.consent = value;
    window.esCookies.accepted = value === 'accepted';
    if (value === 'accepted') { acceptCbs.forEach(function (cb) { try { cb(); } catch (e) {} }); acceptCbs = []; }
    el.classList.remove('in');
    setTimeout(function () { el.remove(); }, 400);
  }

  document.getElementById('esCcAcc').addEventListener('click', function () { decide('accepted'); });
  document.getElementById('esCcRej').addEventListener('click', function () { decide('rejected'); });
  document.getElementById('esCcMore').addEventListener('click', function () {
    document.getElementById('esCcMoreTxt').classList.toggle('show');
  });
})();
