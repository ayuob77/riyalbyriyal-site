/* anonymous counters (ios_visit / apk_click) — never blocks navigation */
(function(){try{
var h=location.hostname;if(!h||h==='localhost'||h==='127.0.0.1'||h==='0.0.0.0'||location.protocol==='file:')return;
var ua=navigator.userAgent||'',plat=/iPhone|iPad|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)?'iphone-safari':/Android/i.test(ua)?'android-web':'web';
var U='https://riyalbyriyal-bot.sites.tab.bot/api/evt',src=document.body.getAttribute('data-evt-src')||'site';
function send(e){try{var b=new Blob([JSON.stringify({e:e,plat:plat,src:src})],{type:'text/plain'});if(navigator.sendBeacon)navigator.sendBeacon(U,b);}catch(_){}}
var v=document.body.getAttribute('data-evt-visit');if(v)send(v);
document.addEventListener('click',function(ev){var a=ev.target&&ev.target.closest&&ev.target.closest('a[href]');if(a&&/\.apk(\?|#|$)/i.test(a.getAttribute('href')))send('apk_click');},true);
}catch(_){}})();
