(function(){
const IMG = {waving:"assets/img/waving.webp",running:"assets/img/running.webp",wink:"assets/img/wink.webp",notes:"assets/img/notes.webp",logo:"assets/img/logo.webp",calm:"assets/img/calm.webp"};
const QR_SRC = "assets/img/qr-linktree.png";
const LINKTREE = "https://linktr.ee/limly.communication";
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const rand = a => a[Math.floor(Math.random()*a.length)];
const shuffle = a => {a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};

/* ---------- language ---------- */
function pickLang(){
  try{const s=localStorage.getItem('limly-lang'); if(s&&T[s]) return s;}catch(e){}
  const n=(navigator.language||'es').slice(0,2).toLowerCase();
  return n==='pt'?'pt':n==='en'?'en':'es';
}
let L=pickLang();
const t=k=>T[L][k];

/* ---------- toast & copy ---------- */
let tt;
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>el.classList.remove('on'),2400);}
async function copy(text,ok){
  try{ if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);toast(ok||t('copied'));return;} }catch(e){}
  const ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();
  let done=false;try{done=document.execCommand('copy');}catch(e){}
  ta.remove();toast(done?(ok||t('copied')):t('no_copy'));
}

/* ---------- runtime capabilities ---------- */
let dlApi=null, sampleApi=null;
const use = name => (window.claude&&window.claude.use) ? window.claude.use(name).catch(()=>null) : Promise.resolve(null);
const dlReady = use('downloads').then(a=>dlApi=a);
use('sample').then(a=>{sampleApi=a; if(a) $('#gen-ai').hidden=false;});

async function saveFile(blob,filename){
  // Fuera de Claude (Vercel, GitHub Pages, etc.): descarga normal del navegador
  if(!(window.claude&&window.claude.use)){
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),5000);
    toast(t('dl_ok'));return;
  }
  const api = dlApi || await Promise.race([dlReady,new Promise(r=>setTimeout(()=>r(null),1500))]);
  if(api){
    try{await api.save({filename,data:blob});toast(t('dl_ok'));return;}
    catch(e){ if(e&&e.code==='declined')return; if(e&&e.code==='rate_limited'){toast(t('retry'));return;} }
  }
  $('#modal-img').src=URL.createObjectURL(blob);$('#modal').classList.add('on');
}
$('#modal-close').onclick=()=>$('#modal').classList.remove('on');

/* ---------- static render ---------- */
const LINKS=[
 ['https://www.limly.io','main','<path d="M12 3v12m0 0-4-4m4 4 4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>'],
 ['https://www.instagram.com/limly.io','','<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>'],
 ['https://www.tiktok.com/@limly.io','','<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.5 2.8 2.4 4.5 5 4.6"/>'],
 ['https://cal.com/michellanyosa/reuni-o','','<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>'],
 ['https://wa.me/51995422760','','<path d="M21 12a9 9 0 0 1-13.4 7.8L3 21l1.3-4.4A9 9 0 1 1 21 12z"/>']
];
const TOOLS=['Zoom','Google Meet','Teams','Webex','Gmail','Outlook','Slack','Notion','HubSpot','Salesforce','Drive'];

function renderStatic(){
  document.documentElement.lang=L==='pt'?'pt-BR':L;
  document.title=t('title');
  $$('[data-i]').forEach(el=>{const v=t(el.dataset.i); if(typeof v==='string') el.innerHTML=v;});
  $$('[data-ip]').forEach(el=>el.placeholder=t(el.dataset.ip));
  $$('[data-ia]').forEach(el=>el.setAttribute('aria-label',t(el.dataset.ia)));
  $$('[data-ialt]').forEach(el=>el.alt=t(el.dataset.ialt));
  $$('.lang button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.lang===L));
  const mt=$('#map-title'); if(mt) mt.textContent=t('map_title');
  $('#proof').innerHTML=t('proof').map(([v,l])=>`<div><b>${v}</b>${l}</div>`).join('');
  $('#reach-stats').innerHTML=t('reach').map(([v,l])=>`<div><b>${v}</b><span>${l}</span></div>`).join('');
  $('#stats').innerHTML=t('stats').map(([v,l])=>`<div><b>${v}</b><span>${l}</span></div>`).join('');
  $('#flow').innerHTML=t('steps').map(([w,h,p,f])=>`<article class="step"><span class="when">${w}</span><h3>${h}</h3><p>${p}</p><p class="fact">${f}</p></article>`).join('');
  $('#works').innerHTML=`<em>${t('works_l')}</em>`+TOOLS.map(x=>`<span>${x}</span>`).join('');
  $('#ideal').innerHTML=`<em>${t('ideal_l')}</em>`+t('ideal').map(x=>`<span>${x}</span>`).join('');
  $('#tips').innerHTML=t('tips').map(([a,b])=>`<li><strong>${a}</strong>${b}</li>`).join('');
  $('#len-seg').setAttribute('aria-label',t('len_label'));
  $$('#len-seg button').forEach(b=>b.textContent=t('lens')[b.dataset.len]);
  $('#lines').innerHTML=t('lines').map(([a,b])=>`<button class="line" type="button" data-copy="${esc(a)}">${a}<small>${b}</small></button>`).join('');
  $$('#lines .line').forEach(b=>b.onclick=()=>copy(b.dataset.copy));
  const q=arr=>arr.map(([a,b])=>`<li><div>${a}${b?`<span>${b}</span>`:''}</div></li>`).join('');
  $('#qn').innerHTML=q(t('qn')); $('#qu').innerHTML=q(t('qu'));
  $('#faq').innerHTML=t('faq').map(([a,b])=>`<details><summary>${a}</summary><p>${b}</p></details>`).join('');
  $('#awards').innerHTML=t('awards').map(([a,b,c])=>`<div><b>${a}</b><span>${b}</span><small>${c}</small></div>`).join('');
  $('#plans').innerHTML=t('plans').map(([a,b,c],i)=>`<div class="plan${i===1?' hl':''}"><span>${a}</span><b>${b}</b><small>${c}</small></div>`).join('');
  $('#team').innerHTML=t('team').map(([a,b,c])=>`<div class="person"><b>${a}</b><span>${b}</span><p>${c}</p></div>`).join('');
  $('#link-list').innerHTML=LINKS.map(([href,cls,svg],i)=>{const [h,s]=t('links')[i];return `<a class="lk ${cls}" href="${href}" target="_blank" rel="noopener"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${svg}</svg></span><span><b>${h}</b><small>${s}</small></span><span class="go" aria-hidden="true">↗</span></a>`;}).join('');
  const msg=t('share_msg')+LINKTREE;
  $('#share-msg').textContent=msg;
  $('#qr-wa').href='https://wa.me/?text='+encodeURIComponent(msg);
  $$('#picks button').forEach(b=>b.setAttribute('aria-label',t('mascots')[b.dataset.m]));
  $('#drop-t').textContent=st.photo?t('pp_drop_ok'):t('pp_drop');
  renderScript(); renderLog();
}
$$('.lang button').forEach(b=>b.onclick=()=>{
  if(L===b.dataset.lang) return;
  L=b.dataset.lang; try{localStorage.setItem('limly-lang',L);}catch(e){}
  renderStatic(); newCopies(); draw();
});

/* ---------- routing ---------- */
const sections={inicio:'p-inicio',links:'p-links',pasaporte:'p-pasaporte'};
function route(){
  const h=(location.hash||'#inicio').slice(1);
  const page=sections[h]?h:'inicio';
  $$('.page').forEach(p=>p.classList.toggle('on',p.id===sections[page]));
  $$('.tabs a').forEach(a=>{if(a.dataset.tab===page)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  if(sections[h]) window.scrollTo(0,0);
  else{const el=document.getElementById(h); if(el) setTimeout(()=>el.scrollIntoView({behavior:'smooth'}),10);}
  if(page==='pasaporte') draw();
}
window.addEventListener('hashchange',route);

/* ---------- script ---------- */
let curLen='30';
function renderScript(){
  const s=t('scripts')[curLen];$('#say').innerHTML=s.p.map(x=>'<p>'+x+'</p>').join('');$('#say-time').textContent=s.t;
  $$('#len-seg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.len===curLen));
}
$$('#len-seg button').forEach(b=>b.onclick=()=>{curLen=b.dataset.len;renderScript();});
$('#copy-script').onclick=()=>copy($('#say').innerText.trim());

/* ---------- conversation log ---------- */
const LKEY='limly-ptw-notes';
let log=(()=>{try{return JSON.parse(localStorage.getItem(LKEY)||'[]');}catch(e){return [];}})();
const saveLog=()=>{try{localStorage.setItem(LKEY,JSON.stringify(log));}catch(e){}};
const usesLbl=u=>(u==='yes'||u==='Ya usa Limly')?t('log_yes'):t('log_no');
function renderLog(){
  const box=$('#entries');
  if(!log.length){box.innerHTML=`<p class="empty">${t('log_empty')}</p>`;return;}
  box.innerHTML=log.map((e,idx)=>({e,idx})).reverse().map(({e,idx})=>`<div class="entry"><div><b>${esc(e.n||t('log_noname'))}</b>${e.r?' · '+esc(e.r):''}</div><span class="tag ${(e.u==='yes'||e.u==='Ya usa Limly')?'':'no'}">${usesLbl(e.u)}</span>${e.q?`<p>${esc(e.q)}</p>`:''}${e.c?`<p>${t('log_next')}: ${esc(e.c)}</p>`:''}<button type="button" data-del="${idx}">${t('log_del')}</button></div>`).join('');
  $$('[data-del]').forEach(b=>b.onclick=()=>{log.splice(+b.dataset.del,1);saveLog();renderLog();});
}
$('#log-form').addEventListener('submit',ev=>{
  ev.preventDefault();const f=new FormData(ev.target);
  const e={n:f.get('n').trim(),r:f.get('r').trim(),u:f.get('u'),q:f.get('q').trim(),c:f.get('c').trim(),t:Date.now()};
  if(!e.n&&!e.q){toast(t('log_need'));return;}
  log.push(e);saveLog();renderLog();ev.target.reset();toast(t('log_saved'));
});
$('#log-copy').onclick=()=>{
  if(!log.length){toast(t('log_none'));return;}
  const txt=t('log_title')+'\n\n'+log.map((e,i)=>`${i+1}. ${e.n||t('log_noname')}${e.r?' ('+e.r+')':''} · ${usesLbl(e.u)}\n${e.q?'   '+e.q+'\n':''}${e.c?'   '+t('log_next')+': '+e.c+'\n':''}`).join('\n');
  copy(txt,t('log_copied'));
};

/* ---------- links ---------- */
$('#share-copy').onclick=()=>copy(t('share_msg')+LINKTREE,t('msg_copied'));
$('#qr-copy').onclick=()=>copy(LINKTREE,t('link_copied'));
$('#qr-show').onclick=()=>{$('#qr-full').classList.add('on');$('#qr-close').focus();};
$('#qr-close').onclick=()=>$('#qr-full').classList.remove('on');
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#qr-full').classList.remove('on');$('#modal').classList.remove('on');}});
$('#qr-dl').onclick=async()=>{
  const img=await loadImg(QR_SRC), logo=await loadImg(IMG.logo);
  const c=document.createElement('canvas');c.width=1080;c.height=1240;const x=c.getContext('2d');
  x.fillStyle='#FFFFFF';x.fillRect(0,0,1080,1240);x.drawImage(img,90,90,900,900);
  await fontsReady();
  x.drawImage(logo,330,1050,90,89);
  x.fillStyle='#081020';x.font='500 64px Outfit, sans-serif';x.textBaseline='middle';x.fillText('Limly',440,1096);
  x.fillStyle='#0A5BE0';x.font='400 34px Outfit, sans-serif';x.textAlign='center';x.fillText('linktr.ee/limly.communication',540,1185);
  c.toBlob(b=>saveFile(b,'limly-qr-linktree.png'),'image/png');
};

/* ---------- passport canvas ---------- */
function loadImg(src){return new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=src;});}
let fontsOk=false;
async function fontsReady(){ if(fontsOk) return; try{await Promise.all(['300','400','500','600'].map(w=>document.fonts.load(w+' 40px Outfit')).concat(document.fonts.load('500 30px "JetBrains Mono"')));}catch(e){} fontsOk=true; }
const cache={};
async function getImg(k){ if(!cache[k]) cache[k]=await loadImg(IMG[k]); return cache[k]; }

const cv=$('#pp'), ctx=cv.getContext('2d');
const st={photo:null,zoom:1,ox:0,oy:0,mascot:'waving',name:'',role:''};
const PH={x:110,y:300,w:330,h:420,r:26};
function rr(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function star(cx,cy,s,color){ctx.save();ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(cx,cy-s);ctx.quadraticCurveTo(cx+s*.12,cy-s*.12,cx+s*.62,cy);ctx.quadraticCurveTo(cx+s*.12,cy+s*.12,cx,cy+s);ctx.quadraticCurveTo(cx-s*.12,cy+s*.12,cx-s*.62,cy);ctx.quadraticCurveTo(cx-s*.12,cy-s*.12,cx,cy-s);ctx.fill();ctx.restore();}
function fitText(text,maxW,start,min,weight){let s=start;do{ctx.font=`${weight} ${s}px Outfit, sans-serif`;if(ctx.measureText(text).width<=maxW)return s;s-=2;}while(s>min);return min;}
function wrap(text,maxW,lh,x,y,maxLines){const words=text.split(/\s+/);let line='',lines=[];for(const w of words){const tt=line?line+' '+w:w;if(ctx.measureText(tt).width>maxW&&line){lines.push(line);line=w;}else line=tt;}if(line)lines.push(line);lines=lines.slice(0,maxLines);lines.forEach((l,i)=>ctx.fillText(l,x,y+i*lh));return lines.length;}
function hashNum(s){let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))%9973;return String(1000+h%9000);}
function mrz(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]+/g,'<');}

let drawing=false, queued=false;
async function draw(){
  if(drawing){queued=true;return;} drawing=true;
  try{
  await fontsReady();
  const W=1080, C=t('cv');
  const g=ctx.createLinearGradient(0,0,W*.3,W);g.addColorStop(0,'#2D8EFF');g.addColorStop(.55,'#0A5BE0');g.addColorStop(1,'#063A96');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,W);
  const rg=ctx.createRadialGradient(860,140,10,860,140,520);rg.addColorStop(0,'rgba(140,207,255,.55)');rg.addColorStop(1,'rgba(140,207,255,0)');ctx.fillStyle=rg;ctx.fillRect(0,0,W,W);
  ctx.save();ctx.strokeStyle='rgba(255,255,255,.22)';ctx.lineWidth=4;ctx.setLineDash([14,14]);ctx.beginPath();ctx.moveTo(560,40);ctx.bezierCurveTo(700,140,820,40,960,120);ctx.stroke();ctx.restore();
  star(980,60,26,'#FFE58A');star(640,96,16,'#CCE6FF');star(1030,170,14,'#8CCFFF');
  const logo=await getImg('logo');ctx.drawImage(logo,70,58,74,73);
  ctx.fillStyle='#FFFFFF';ctx.textBaseline='alphabetic';ctx.textAlign='left';
  ctx.font='500 52px Outfit, sans-serif';ctx.fillText('Limly',158,113);
  ctx.font='400 24px Outfit, sans-serif';ctx.fillStyle='#CCE6FF';ctx.fillText(C.sub,72,166);

  ctx.save();ctx.shadowColor='rgba(6,30,80,.35)';ctx.shadowBlur=40;ctx.shadowOffsetY=18;ctx.fillStyle='#FAFAF7';rr(60,200,960,640,36);ctx.fill();ctx.restore();
  ctx.save();rr(60,200,960,640,36);ctx.clip();ctx.strokeStyle='rgba(45,142,255,.07)';ctx.lineWidth=2;
  for(let i=0;i<14;i++){ctx.beginPath();for(let x=60;x<=1020;x+=10){const y=460+i*26+Math.sin((x+i*30)/48)*14;x===60?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();}
  ctx.fillStyle='#EAF5FF';ctx.fillRect(60,200,960,74);ctx.restore();
  ctx.fillStyle='#063A96';ctx.font='600 24px Outfit, sans-serif';ctx.fillText(C.head,100,247);
  const num='LIM-26-'+hashNum(st.name||'limly');
  ctx.textAlign='right';ctx.font='500 22px "JetBrains Mono", monospace';ctx.fillStyle='#0A5BE0';ctx.fillText('N.º '+num,980,247);ctx.textAlign='left';

  ctx.save();rr(PH.x,PH.y,PH.w,PH.h,PH.r);ctx.clip();
  if(st.photo){
    const im=st.photo,s=Math.max(PH.w/im.width,PH.h/im.height)*st.zoom,dw=im.width*s,dh=im.height*s;
    const maxX=(dw-PH.w)/2,maxY=(dh-PH.h)/2;st.ox=Math.max(-maxX,Math.min(maxX,st.ox));st.oy=Math.max(-maxY,Math.min(maxY,st.oy));
    ctx.drawImage(im,PH.x+(PH.w-dw)/2+st.ox,PH.y+(PH.h-dh)/2+st.oy,dw,dh);
  }else{
    const pg=ctx.createLinearGradient(0,PH.y,0,PH.y+PH.h);pg.addColorStop(0,'#EAF5FF');pg.addColorStop(1,'#CCE6FF');ctx.fillStyle=pg;ctx.fillRect(PH.x,PH.y,PH.w,PH.h);
    const calm=await getImg('calm');ctx.drawImage(calm,PH.x+75,PH.y+70,180,173);
    ctx.fillStyle='#0A5BE0';ctx.font='500 26px Outfit, sans-serif';ctx.textAlign='center';ctx.fillText(C.photo,PH.x+PH.w/2,PH.y+285);ctx.textAlign='left';
  }
  ctx.restore();
  ctx.strokeStyle='#FFFFFF';ctx.lineWidth=8;rr(PH.x,PH.y,PH.w,PH.h,PH.r);ctx.stroke();

  const fx=480,fw=500;let y=320;
  const label=tx=>{ctx.fillStyle='#6B7588';ctx.font='400 20px Outfit, sans-serif';ctx.fillText(tx,fx,y);y+=8;};
  label(C.name);
  const name=st.name||C.name_ph;
  const ns=fitText(name,fw,50,34,500);ctx.fillStyle=st.name?'#081020':'#9AA4B5';ctx.font=`500 ${ns}px Outfit, sans-serif`;
  const n=wrap(name,fw,ns+4,fx,y+ns-6,2);y+=n*(ns+4)+30;
  label(C.role);
  const role=st.role||C.role_ph;ctx.fillStyle=st.role?'#081020':'#9AA4B5';const rs=fitText(role,fw,30,22,400);ctx.font=`400 ${rs}px Outfit, sans-serif`;ctx.fillText(role,fx,y+rs);y+=rs+40;
  label(C.dest);
  ctx.fillStyle='#081020';ctx.font='500 30px Outfit, sans-serif';ctx.fillText('Peru Tech Week 2026',fx,y+30);y+=72;
  label(C.stops);
  ctx.font='400 25px Outfit, sans-serif';ctx.fillStyle='#081020';ctx.fillText('Experiencia Endeavor',fx,y+26);ctx.fillText('Peru Venture Capital Conference',fx,y+60);

  ctx.save();ctx.translate(400,650);ctx.rotate(-0.22);ctx.globalAlpha=.9;ctx.strokeStyle='#0A5BE0';ctx.fillStyle='#0A5BE0';
  ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,0,78,0,Math.PI*2);ctx.stroke();ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,66,0,Math.PI*2);ctx.stroke();
  ctx.textAlign='center';ctx.font=`600 ${fitText(C.stamp,110,22,16,600)}px Outfit, sans-serif`;ctx.fillText(C.stamp,0,-8);ctx.font='500 17px Outfit, sans-serif';ctx.fillText('LIMLY · PTW 26',0,20);
  star(0,-42,12,'#0A5BE0');star(0,46,9,'#0A5BE0');ctx.restore();

  ctx.fillStyle='#3A4558';ctx.font='500 23px "JetBrains Mono", monospace';ctx.textAlign='left';
  const L1=('P<PER'+mrz(st.name||C.mrz)+'<<LIMLY').padEnd(44,'<').slice(0,44);
  const L2=(num.replace(/-/g,'')+'<PTW2026<ENDEAVOR<PVCC').padEnd(44,'<').slice(0,44);
  ctx.fillText(L1,100,790);ctx.fillText(L2,100,822);

  ctx.fillStyle='#FFFFFF';ctx.font=`500 ${fitText(C.l1,690,40,30,500)}px Outfit, sans-serif`;
  ctx.fillText(C.l1,70,925);ctx.fillText(C.l2,70,975);
  ctx.fillStyle='#CCE6FF';ctx.font='400 26px Outfit, sans-serif';ctx.fillText(C.l3,70,1025);

  const m=await getImg(st.mascot);const mw=330,mh=mw*m.height/m.width;
  ctx.drawImage(m,1050-mw,1060-mh,mw,mh);
  }finally{ drawing=false; }
  if(queued){queued=false;draw();}
}

$('#file').addEventListener('change',e=>{
  const f=e.target.files&&e.target.files[0];if(!f)return;
  const r=new FileReader();r.onload=async()=>{try{st.photo=await loadImg(r.result);st.zoom=1;st.ox=0;st.oy=0;$('#zoom').value=1;$('#drop').classList.add('has');$('#drop-t').textContent=t('pp_drop_ok');draw();}catch(err){toast(t('readerr'));}};r.readAsDataURL(f);
});
$('#zoom').addEventListener('input',e=>{st.zoom=+e.target.value;draw();});
let nameTimer;
$('#f-name').addEventListener('input',e=>{st.name=e.target.value.trim();draw();});
$('#f-role').addEventListener('input',e=>{st.role=e.target.value.trim();draw();clearTimeout(nameTimer);nameTimer=setTimeout(()=>{seeds.li.role=st.role;seeds.ig.role=st.role;renderCopy();},400);});
$$('#picks button').forEach(b=>b.onclick=()=>{st.mascot=b.dataset.m;$$('#picks button').forEach(x=>x.setAttribute('aria-pressed',x===b));draw();});

let drag=null;
cv.addEventListener('pointerdown',e=>{if(!st.photo)return;const k=1080/cv.getBoundingClientRect().width;drag={x:e.clientX,y:e.clientY,ox:st.ox,oy:st.oy,k};cv.setPointerCapture(e.pointerId);cv.classList.add('dragging');});
cv.addEventListener('pointermove',e=>{if(!drag)return;st.ox=drag.ox+(e.clientX-drag.x)*drag.k;st.oy=drag.oy+(e.clientY-drag.y)*drag.k;draw();});
const endDrag=()=>{drag=null;cv.classList.remove('dragging');};
cv.addEventListener('pointerup',endDrag);cv.addEventListener('pointercancel',endDrag);

$('#pp-dl').onclick=async()=>{
  if(!st.photo&&!confirm(t('pp_nophoto')))return;
  await draw();
  const slug=(st.name||'limly').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'limly';
  cv.toBlob(b=>saveFile(b,'pasaporte-limly-'+slug+'.png'),'image/png');
};

/* ---------- post copy generator ---------- */
// A "seed" picks one combination of pieces; first seed = the classic copy.
function makeSeed(first){
  const G=T.es.gen; const n=a=>first?0:Math.floor(Math.random()*a.length);
  return {hook:n(G.hooks),intro:n(G.intros),se:n(G.stopEmoji),purpose:n(G.purpose),fh:n(G.featH),
    feats:first?[0,1,2,3]:shuffle([0,1,2,3,4,5,6]).slice(0,4),fe:first?false:Math.random()<.6,
    proof:n(G.proof),close:n(G.closes),tags:first?[0,2,3,4,5,6,8]:shuffle([...Array(12).keys()]).slice(0,6),
    igIntro:first?0:Math.floor(Math.random()*2),igMid:first?0:Math.floor(Math.random()*2),igFeats:first?[0,1,2]:shuffle([0,1,2,3,4]).slice(0,3)};
}
let seeds={li:makeSeed(true),ig:makeSeed(true)};
let aiText={li:null,ig:null};
function build(kind,s){
  const G=t('gen'), se=G.stopEmoji[s.se];
  const tags=G.tags.concat(s.tags.map(i=>G.tagPool[i%G.tagPool.length]).filter((v,i,a)=>a.indexOf(v)===i)).join(' ');
  const roleLine=st.role?G.roleLine.replace('{role}',st.role)+' ':'';
  if(kind==='ig'){
    return `${G.hooks[s.hook]}\n\n${G.igIntro[s.igIntro]}\n${se} Experiencia Endeavor\n${se} Peru Venture Capital Conference\n\n${G.igMid[s.igMid]}\n\n${G.igH}\n${s.igFeats.map(i=>G.igFeats[i]).join('\n')}\n\n${G.closes[s.close]}\n\n${G.cta}\n\n${tags}`;
  }
  const FE=['☁️','🧠','⚡','🔒','💬','🔌','🌎'];
  const feats=s.feats.map(f=>`${s.fe?FE[f]:'✅'} ${G.feats[f]}`).join('\n');
  return `${G.hooks[s.hook]}\n\n${roleLine}${G.intros[s.intro]}\n\n${se} Experiencia Endeavor\n${se} Peru Venture Capital Conference\n\n${G.purpose[s.purpose]}\n\n${G.featH[s.fh]}\n${feats}\n\n${G.proof[s.proof]}\n\n${G.closes[s.close]}\n\n${G.cta}\n\n${tags}`;
}
let cp='li';
const currentCopy=()=>aiText[cp]||build(cp,seeds[cp]);
function renderCopy(){$('#copy-box').textContent=currentCopy();$$('[data-cp]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.cp===cp));}
function newCopies(){aiText={li:null,ig:null};renderCopy();}
$$('[data-cp]').forEach(b=>b.onclick=()=>{cp=b.dataset.cp;renderCopy();});
$('#gen-new').onclick=()=>{
  let s; const prev=JSON.stringify(seeds[cp]);
  do{ s=makeSeed(false); }while(JSON.stringify(s)===prev);
  seeds[cp]=s; aiText[cp]=null; renderCopy(); toast(t('pp_new_ok'));
};
let aiCtl=null;
$('#gen-ai').onclick=async()=>{
  if(!sampleApi){ $('#gen-new').click(); return; }
  const btn=$('#gen-ai'); btn.disabled=true; const box=$('#copy-box'); box.classList.add('busy'); box.textContent=t('pp_ai_wait');
  const net=cp==='li'?'LinkedIn (150-220 palabras)':'Instagram (80-120 palabras, más emojis)';
  const prompt=`Escribe UN post para ${net} en ${t('ai_lang')}, en primera persona, de alguien que estará en el Peru Tech Week 2026 acompañando a Limly.
Datos de la persona: nombre "${st.name||'(sin nombre)'}", rol "${st.role||'embajador(a) de Limly'}". No pongas el nombre en el texto salvo que suene natural.
Debe decir que estará en el Peru Tech Week gracias a Limly, y en la Experiencia Endeavor y el Peru Venture Capital Conference (escribe esos dos nombres tal cual, en una lista con emojis), generando impacto y productividad para todos.
Sobre Limly (usa 3 o 4 de estos, en bullets con emojis): AI Chief of Staff que ayuda durante las reuniones, no después; sin bots en la reunión; recuerda lo acordado uniendo correo, CRM, calendario y notas; deja el follow-up, tareas y CRM listos al colgar; el audio se procesa en el dispositivo; responde en menos de 2 segundos; 50+ integraciones; 30+ idiomas.
Prueba social: más de 6 mil personas en 28 países de 3 continentes, hecho en Perú.
Tono: cercano, entusiasta, humano, nada corporativo. Usa emojis con moderación y viñetas.
Termina con este CTA exacto traducido al idioma del post: "Descarga Limly gratis en www.limly.io", y luego 6 a 9 hashtags que incluyan #PeruTechWeek y #Limly.
Hazlo distinto a un post genérico: empieza con un gancho original. Devuelve solo el texto del post, sin comillas ni explicaciones.`;
  try{
    aiCtl=new AbortController();
    const r=await sampleApi(prompt,{signal:aiCtl.signal,modelTier:'quick',cache:false,onText:({text})=>{box.textContent=text;}});
    aiText[cp]=r.text.trim(); renderCopy(); toast(t('pp_new_ok'));
  }catch(e){
    if(e&&(e.code==='not_granted'||e.code==='unavailable')) btn.hidden=true;
    toast(t('pp_ai_err')); $('#gen-new').click();
  }finally{ btn.disabled=false; box.classList.remove('busy'); }
};
$('#copy-post').onclick=()=>copy(currentCopy(),t('pp_copied'));

renderStatic();
renderCopy();
route();
draw();
})();
