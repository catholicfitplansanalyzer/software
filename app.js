var API_URL='https://script.google.com/macros/s/AKfycbzbucBRUHtxAwQi6__Q45uu5Eacdkg35tdDiRaejzRby5g1Q9HZriRZR9HHfr2IrWuEdg/exec';
var clients=[],sessions={},meas={},payments={};
var activeId=null;
var diagRun=false;
var lastDiag=null;

var PKG={elite:{label:'Elite - 12/mo',cls:'pk-elite',price:480,sessions:12},intensive:{label:'Intensive - 8/mo',cls:'pk-intensive',price:360,sessions:8},basic:{label:'Basic - 4/mo',cls:'pk-basic',price:200,sessions:4},maintenance:{label:'Maintenance - 2/mo',cls:'pk-maintenance',price:120,sessions:2}};

function gid(id){return document.getElementById(id);}
function showLoader(msg){gid('loader-text').textContent=msg||'Loading...';gid('loader').classList.add('on');}
function hideLoader(){gid('loader').classList.remove('on');}
function setSync(state,msg){var s=gid('sync-status');s.className='sync-status '+(state||'');s.textContent=msg;}
function today(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function fmtDate(d){if(!d)return '';var p=String(d).split('-');if(p.length!==3)return String(d);var m=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];return m[parseInt(p[1])-1]+' '+parseInt(p[2])+', '+p[0];}
function toast(msg){var t=gid('toast');t.textContent=msg;t.classList.add('on');setTimeout(function(){t.classList.remove('on');},2400);}
function findClient(id){var s=String(id);for(var i=0;i<clients.length;i++)if(String(clients[i].id)===s)return clients[i];return null;}
function findIdx(id){var s=String(id);for(var i=0;i<clients.length;i++)if(String(clients[i].id)===s)return i;return -1;}
function initials(n){if(!n)return '?';var p=String(n).split(' '),s='';for(var i=0;i<p.length&&s.length<2;i++)if(p[i]&&p[i][0])s+=p[i][0];return s.toUpperCase();}
function esc(s){if(s==null)return '';return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}

function normalizeRecord(r){var out={};for(var k in r){var v=r[k];if(k==='id'||k==='clientId'){out[k]=v==null||v===''?'':String(v);}else{out[k]=v==null?'':v;}}return out;}

function loadFromSheets(){
  showLoader('Loading data from Google Sheets...');
  setSync('syncing','Syncing...');
  fetch(API_URL+'?action=getAll').then(function(r){return r.json();}).then(function(data){
    clients=(data.clients||[]).map(normalizeRecord);
    var sa=(data.sessions||[]).map(normalizeRecord);sessions={};
    for(var i=0;i<sa.length;i++){var s=sa[i];if(!s.clientId)continue;if(!sessions[s.clientId])sessions[s.clientId]=[];sessions[s.clientId].push(s);}
    var ma=(data.measurements||[]).map(normalizeRecord);meas={};
    for(var j=0;j<ma.length;j++){var m=ma[j];if(!m.clientId)continue;if(!meas[m.clientId])meas[m.clientId]=[];meas[m.clientId].push(m);}
    var pa=(data.payments||[]).map(normalizeRecord);payments={};
    for(var p=0;p<pa.length;p++){var pp=pa[p];if(!pp.clientId)continue;if(!payments[pp.clientId])payments[pp.clientId]=[];payments[pp.clientId].push(pp);}
    hideLoader();setSync('','Synced');
    renderList();
  }).catch(function(err){hideLoader();setSync('error','Sync error');toast('Connection error');});
}

function saveToSheets(){
  setSync('syncing','Syncing...');
  var sa=[];for(var c in sessions){var arr=sessions[c];for(var i=0;i<arr.length;i++){arr[i].clientId=String(c);sa.push(arr[i]);}}
  var ma=[];for(var c2 in meas){var arr2=meas[c2];for(var j=0;j<arr2.length;j++){arr2[j].clientId=String(c2);ma.push(arr2[j]);}}
  var pa=[];for(var c3 in payments){var arr3=payments[c3];for(var k=0;k<arr3.length;k++){arr3[k].clientId=String(c3);pa.push(arr3[k]);}}
  fetch(API_URL,{method:'POST',body:JSON.stringify({action:'saveAll',payload:{clients:clients,sessions:sa,measurements:ma,payments:pa}})}).then(function(r){return r.json();}).then(function(data){if(data.success)setSync('','Synced');else{setSync('error','Sync error');toast('Save failed');}}).catch(function(err){setSync('error','Sync error');toast('Save error');});
}

function getNextInvoice(cb){fetch(API_URL+'?action=getInvoiceNumber').then(function(r){return r.json();}).then(function(data){cb(data.invoiceNumber||'INV0020');}).catch(function(){cb('INV0020');});}

function switchTab(name){
  var tabs=document.querySelectorAll('.tab');
  for(var i=0;i<tabs.length;i++)tabs[i].classList.toggle('on',tabs[i].dataset.tab===name);
  gid('p-analyzer').classList.toggle('on',name==='analyzer');
  gid('p-agenda').classList.toggle('on',name==='agenda');
}

function getLevel(k,v){
  if(k==='hip')return v<45?'crit':v<70?'mod':v<90?'mild':'good';
  if(k==='ham')return v<40?'crit':v<65?'mod':v<90?'mild':'good';
  if(k==='quad')return v<70?'crit':v<95?'mod':v<120?'mild':'good';
  return 'good';
}
function levSev(l){return{crit:'sev-c',mod:'sev-m',mild:'sev-w',good:'sev-g'}[l];}
function levLabel(l){return{crit:'Critical',mod:'Moderate',mild:'Mild',good:'Optimal'}[l];}
function levColor(l){return{crit:'#ef4444',mod:'#f97316',mild:'#fbbf24',good:'#34d399'}[l];}
function getImbalance(L,R){if(!L||!R)return null;var d=Math.abs(L-R);if(d<5)return{lvl:'ok',diff:d};if(d<10)return{lvl:'mild',diff:d};return{lvl:'bad',diff:d};}
function imbLabel(l){return{ok:'Balanced',mild:'Mild Imbalance',bad:'Significant Imbalance'}[l];}
function imbCls(l){return{ok:'diff-ok',mild:'diff-mild',bad:'diff-bad'}[l];}

function getDiagState(side,key){
  if(!diagRun)return null;
  var v=parseInt(gid(key+side).value)||0;
  var lvl=getLevel(key,v);
  if(lvl==='crit')return 'danger';
  if(lvl==='mod')return 'warn';
  if(lvl==='mild')return 'mild';
  return null;
}
function bilatPath(side,key,paths){
  var sel=getDiagState(side,key);
  var fill='rgba(139,92,246,0.18)',stroke='rgba(139,92,246,0.5)',sw='1.2',extra='';
  if(sel==='danger'){fill='rgba(239,68,68,0.6)';stroke='#ef4444';sw='2.5';extra='muscle-pulse';}
  else if(sel==='warn'){fill='rgba(249,115,22,0.5)';stroke='#f97316';sw='2.2';}
  else if(sel==='mild'){fill='rgba(251,191,36,0.45)';stroke='#fbbf24';sw='2';}
  return '<g class="'+extra+'">'+paths.map(function(d){return '<path d="'+d+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';}).join('')+'</g>';
}
function lbl(x,y,t,fs){return '<text x="'+x+'" y="'+y+'" text-anchor="middle" fill="rgba(255,255,255,0.55)" font-size="'+(fs||8)+'" font-family="Outfit" font-weight="600">'+t+'</text>';}

function buildBody(){
  var sw=58,hw=50,ww=36,cx=170;
  var s='<svg viewBox="0 0 340 680" xmlns="http://www.w3.org/2000/svg" id="body-svg">';
  s+='<ellipse cx="170" cy="50" rx="32" ry="36" fill="#1a1535" stroke="rgba(139,92,246,0.2)" stroke-width="1.5"/>';
  s+='<path d="M'+(cx-14)+',83 Q'+cx+',90 '+(cx+14)+',83 L'+(cx+11)+',106 Q'+cx+',110 '+(cx-11)+',106Z" fill="#1a1535" stroke="rgba(139,92,246,0.2)" stroke-width="1.2"/>';
  s+='<path d="M'+(cx-sw)+',108 Q'+(cx-sw-8)+',125 '+(cx-sw-6)+',165 Q'+(cx-sw-4)+',205 '+(cx-ww)+',218 Q'+(cx-hw)+',230 '+(cx-hw)+',320 L'+(cx+hw)+',320 Q'+(cx+hw)+',230 '+(cx+ww)+',218 Q'+(cx+sw+4)+',205 '+(cx+sw+6)+',165 Q'+(cx+sw+8)+',125 '+(cx+sw)+',108 Q'+cx+',100 '+(cx-sw)+',108Z" fill="#1a1535" stroke="rgba(139,92,246,0.2)" stroke-width="1.5"/>';
  s+='<path d="M'+(cx-sw)+',116 Q'+(cx-sw-26)+',132 '+(cx-sw-28)+',195 Q'+(cx-sw-30)+',230 '+(cx-sw-24)+',262 L'+(cx-sw-10)+',260 Q'+(cx-sw-12)+',230 '+(cx-sw-10)+',193 Q'+(cx-sw-8)+',144 '+(cx-sw+6)+',126Z" fill="#1a1535" stroke="rgba(139,92,246,0.2)" stroke-width="1.2"/>';
  s+='<path d="M'+(cx+sw)+',116 Q'+(cx+sw+26)+',132 '+(cx+sw+28)+',195 Q'+(cx+sw+30)+',230 '+(cx+sw+24)+',262 L'+(cx+sw+10)+',260 Q'+(cx+sw+12)+',230 '+(cx+sw+10)+',193 Q'+(cx+sw+8)+',144 '+(cx+sw-6)+',126Z" fill="#1a1535" stroke="rgba(139,92,246,0.2)" stroke-width="1.2"/>';
  s+='<path d="M'+(cx-hw)+',322 Q'+(cx-hw-8)+',354 '+(cx-hw-6)+',422 Q'+(cx-hw-4)+',455 '+(cx-18)+',466 L'+(cx-8)+',466 Q'+(cx-10)+',454 '+(cx-8)+',420 Q'+(cx-6)+',352 '+(cx-8)+',322Z" fill="#1a1535" stroke="rgba(139,92,246,0.2)" stroke-width="1.2"/>';
  s+='<path d="M'+(cx+hw)+',322 Q'+(cx+hw+8)+',354 '+(cx+hw+6)+',422 Q'+(cx+hw+4)+',455 '+(cx+18)+',466 L'+(cx+8)+',466 Q'+(cx+10)+',454 '+(cx+8)+',420 Q'+(cx+6)+',352 '+(cx+8)+',322Z" fill="#1a1535" stroke="rgba(139,92,246,0.2)" stroke-width="1.2"/>';
  s+='<path d="M'+(cx-18)+',468 Q'+(cx-20)+',506 '+(cx-18)+',560 Q'+(cx-16)+',585 '+(cx-20)+',602 L'+(cx-8)+',602 Q'+(cx-4)+',583 '+(cx-6)+',558 Q'+(cx-4)+',504 '+(cx-8)+',468Z" fill="#1a1535" stroke="rgba(139,92,246,0.2)" stroke-width="1.2"/>';
  s+='<path d="M'+(cx+18)+',468 Q'+(cx+20)+',506 '+(cx+18)+',560 Q'+(cx+16)+',585 '+(cx+20)+',602 L'+(cx+8)+',602 Q'+(cx+4)+',583 '+(cx+6)+',558 Q'+(cx+4)+',504 '+(cx+8)+',468Z" fill="#1a1535" stroke="rgba(139,92,246,0.2)" stroke-width="1.2"/>';
  s+=bilatPath('L','hip',['M'+(cx+hw-2)+',228 Q'+(cx+hw+4)+',255 '+(cx+hw)+',305 Q'+(cx+20)+',314 '+(cx+10)+',310 Q'+(cx+8)+',257 '+(cx+8)+',228Z']);
  s+=bilatPath('R','hip',['M'+(cx-hw+2)+',228 Q'+(cx-hw-4)+',255 '+(cx-hw)+',305 Q'+(cx-20)+',314 '+(cx-10)+',310 Q'+(cx-8)+',257 '+(cx-8)+',228Z']);
  s+=bilatPath('L','ham',['M'+(cx+10)+',310 Q'+(cx+16)+',360 '+(cx+14)+',438 L'+(cx+4)+',438 Q'+(cx+2)+',360 '+(cx+6)+',310Z']);
  s+=bilatPath('R','ham',['M'+(cx-10)+',310 Q'+(cx-16)+',360 '+(cx-14)+',438 L'+(cx-4)+',438 Q'+(cx-2)+',360 '+(cx-6)+',310Z']);
  s+=bilatPath('L','quad',['M'+(cx+hw)+',310 Q'+(cx+hw+6)+',367 '+(cx+hw+4)+',446 Q'+(cx+20)+',456 '+(cx+10)+',452 Q'+(cx+8)+',366 '+(cx+10)+',310Z']);
  s+=bilatPath('R','quad',['M'+(cx-hw)+',310 Q'+(cx-hw-6)+',367 '+(cx-hw-4)+',446 Q'+(cx-20)+',456 '+(cx-10)+',452 Q'+(cx-8)+',366 '+(cx-10)+',310Z']);
  s+='<text x="40" y="20" fill="#ec4899" font-size="11" font-family="Outfit" font-weight="800">LEFT</text>';
  s+='<text x="300" y="20" fill="#8b5cf6" font-size="11" font-family="Outfit" font-weight="800">RIGHT</text>';
  s+=lbl(cx-hw+4,272,'PSOAS R',7);
  s+=lbl(cx+hw-4,272,'PSOAS L',7);
  s+=lbl(cx-hw+2,385,'HAM R',8);
  s+=lbl(cx+hw-2,385,'HAM L',8);
  s+=lbl(cx-15,440,'QUAD R',7);
  s+=lbl(cx+15,440,'QUAD L',7);
  s+='</svg>';
  return s;
}
function renderBody(){var w=gid('svg-wrap');if(w)w.innerHTML=buildBody();}

function updateBilateralBadge(id,key){
  var el=gid(id+'-badge');if(!el)return;
  var v=parseInt(gid(id).value)||0;
  var lvl=getLevel(key,v);
  var map={crit:['db-c','Critical'],mod:['db-m','Moderate'],mild:['db-w','Mild'],good:['db-g','Good']};
  el.className='bilat-badge '+map[lvl][0];
  el.textContent=map[lvl][1];
}
function updateImbalanceSummary(){
  var rows=gid('imbal-rows');if(!rows)return;
  var pairs=[{key:'hip',name:'Hip Flexion'},{key:'ham',name:'Hamstring'},{key:'quad',name:'Quadriceps'}];
  var html='';
  for(var i=0;i<pairs.length;i++){
    var p=pairs[i];
    var L=parseInt(gid(p.key+'L').value)||0;
    var R=parseInt(gid(p.key+'R').value)||0;
    if(!L&&!R)continue;
    var imb=getImbalance(L,R);
    var diffTxt='--',diffCls='diff-ok';
    if(imb){diffTxt=imb.diff+' deg';diffCls=imbCls(imb.lvl);}
    html+='<div class="imbal-row"><div class="imbal-name">'+p.name+'</div><div class="imbal-vals"><span class="L">'+(L||'--')+' deg</span> / <span class="R">'+(R||'--')+' deg</span><span class="diff '+diffCls+'">'+diffTxt+'</span></div></div>';
  }
  if(!html)html='<div style="font-size:11px;color:var(--dgray);font-style:italic">Enter degrees to see imbalances</div>';
  rows.innerHTML=html;
}
function refreshAnalyzer(){
  var keys=['hip','ham','quad'];
  for(var i=0;i<keys.length;i++){updateBilateralBadge(keys[i]+'L',keys[i]);updateBilateralBadge(keys[i]+'R',keys[i]);}
  updateImbalanceSummary();
}

var DIAG_SHORT={
  hip:{crit:{title:'Severe Hip Restriction',text:'Iliopsoas very tight, causing chronic low back pain.',issues:['Chronic low back pain','Forward-tilted pelvis','Hip impingement','Weak glutes'],pkg:'Elite - 12 sessions/month'},mod:{title:'Moderate Hip Restriction',text:'Significant hip flexor tightness from prolonged sitting.',issues:['Lower back stiffness','Hunched posture','Short stride length'],pkg:'Intensive - 8 sessions/month'},mild:{title:'Mild Hip Restriction',text:'Below goal but close. Achievable with consistent sessions.',issues:['Minor back fatigue','Shallow squat depth'],pkg:'Basic - 4 sessions/month'},good:{title:'Excellent Hip Mobility',text:'Hip flexion meets the 90 deg goal.',issues:['Maintain mobility','Watch for asymmetry'],pkg:'Maintenance - 2 sessions/month'}},
  ham:{crit:{title:'Severe Hamstring Restriction',text:'Hamstrings pulling on sacrum, causing sciatic nerve tension.',issues:['Sciatic pain','Disc compression','Knee hyperextension'],pkg:'Elite - 12 sessions/month'},mod:{title:'Moderate Hamstring Restriction',text:'Restricted posterior chain causing lumbar strain.',issues:['Lower back tightness','Rounded back when bending','Reduced running performance'],pkg:'Intensive - 8 sessions/month'},mild:{title:'Mild Hamstring Restriction',text:'Approaching goal. Reachable in 4-8 weeks.',issues:['Slight running fatigue','Limited forward bending'],pkg:'Basic - 4 sessions/month'},good:{title:'Excellent Hamstring Mobility',text:'Hamstrings meet 90 deg goal.',issues:['Maintain to prevent regression'],pkg:'Maintenance - 2 sessions/month'}},
  quad:{crit:{title:'Severe Quad Restriction',text:'Severely limits squatting; causes patellar compression.',issues:['Patellar pain syndrome','Cannot squat properly','Knee pain on stairs'],pkg:'Elite - 12 sessions/month'},mod:{title:'Moderate Quad Restriction',text:'Limits athletic performance and creates anterior knee stress.',issues:['Limited squat depth','Front thigh tightness','Anterior knee discomfort'],pkg:'Intensive - 8 sessions/month'},mild:{title:'Mild Quad Restriction',text:'Close to functional goal.',issues:['Mild quad fatigue','Slight squat limitation'],pkg:'Basic - 4 sessions/month'},good:{title:'Excellent Quad Mobility',text:'Healthy quadriceps length.',issues:['Maintain monthly','Check side-to-side balance'],pkg:'Maintenance - 2 sessions/month'}}
};
var IMBAL_INFO={
  hip:{bad:{title:'Significant Hip Imbalance',issues:['Pelvic torsion','Functional leg length difference','SI joint stress','Asymmetric gait']},mild:{title:'Mild Hip Imbalance',issues:['Subtle pelvic asymmetry','Minor SI joint stress']}},
  ham:{bad:{title:'Significant Hamstring Imbalance',issues:['Pelvic obliquity','Sacroiliac stress','Higher strain risk on tight side','Compensatory rotation']},mild:{title:'Mild Hamstring Imbalance',issues:['Subtle posterior asymmetry','Slight pelvic tilt']}},
  quad:{bad:{title:'Significant Quadriceps Imbalance',issues:['Asymmetric knee tracking','Patellar compression risk','Squat depth difference','ITB stress']},mild:{title:'Mild Quadriceps Imbalance',issues:['Slight knee tracking issue','Minor squat asymmetry']}}
};

function runDiag(){
  var keys=['hip','ham','quad'];
  var labels={hip:'Hip Flexion',ham:'Hamstring',quad:'Quadriceps'};
  var vals={};
  for(var i=0;i<keys.length;i++){vals[keys[i]]={L:parseInt(gid(keys[i]+'L').value)||0,R:parseInt(gid(keys[i]+'R').value)||0};}
  var prio={crit:0,mod:1,mild:2,good:3};
  var allLvls=[];
  for(var k in vals){allLvls.push(getLevel(k,vals[k].L));allLvls.push(getLevel(k,vals[k].R));}
  allLvls.sort(function(a,b){return prio[a]-prio[b];});
  var worst=allLvls[0];
  var pkgMap={crit:'Elite Package - 12 sessions/month',mod:'Intensive Package - 8 sessions/month',mild:'Basic Package - 4 sessions/month',good:'Maintenance Package - 2 sessions/month'};
  gid('diag-empty').style.display='none';
  var html='<div class="dcard"><h4>Overall Assessment <span class="sev '+levSev(worst)+'">'+levLabel(worst)+'</span></h4><p style="color:var(--pink);font-weight:700">Recommended: '+pkgMap[worst]+'</p></div>';
  lastDiag={vals:vals,keys:keys,labels:labels,worst:worst,pkgMap:pkgMap,clientName:gid('diag-client-name').value||'Client'};
  for(var idx=0;idx<keys.length;idx++){
    var k=keys[idx];
    var L=vals[k].L,R=vals[k].R;
    if(!L&&!R)continue;
    var lvlL=getLevel(k,L),lvlR=getLevel(k,R);
    var ws=prio[lvlL]<=prio[lvlR]?'L':'R';
    var wl=ws==='L'?lvlL:lvlR;
    var d=DIAG_SHORT[k][wl];
    html+='<div class="dcard"><h4>'+labels[k]+' <span class="sev '+levSev(wl)+'">'+levLabel(wl)+'</span></h4>';
    html+='<div class="bil-pair"><div class="bil-pair-side L"><div class="pn">LEFT</div><div class="pv" style="color:'+levColor(lvlL)+'">'+L+' deg</div><div style="font-size:9px;color:var(--dgray);margin-top:2px">'+levLabel(lvlL)+'</div></div><div class="bil-pair-side R"><div class="pn">RIGHT</div><div class="pv" style="color:'+levColor(lvlR)+'">'+R+' deg</div><div style="font-size:9px;color:var(--dgray);margin-top:2px">'+levLabel(lvlR)+'</div></div></div>';
    html+='<p><strong style="color:var(--pink)">'+d.title+'</strong></p><p>'+d.text+'</p>';
    html+='<p style="font-size:11px;color:var(--dgray);font-weight:700;text-transform:uppercase;letter-spacing:.06em">Issues:</p><ul>';
    for(var j=0;j<d.issues.length;j++)html+='<li>'+d.issues[j]+'</li>';
    html+='</ul>';
    var imb=getImbalance(L,R);
    if(imb&&imb.lvl!=='ok'){
      var ii=IMBAL_INFO[k][imb.lvl];
      var weak=L>R?'RIGHT':'LEFT';
      html+='<p style="margin-top:10px;color:var(--gold)"><strong>'+ii.title+'</strong></p><p>Difference: <strong>'+imb.diff+' deg</strong>. The <strong>'+weak+'</strong> side is more restricted.</p><ul>';
      for(var ji=0;ji<ii.issues.length;ji++)html+='<li>'+ii.issues[ji]+'</li>';
      html+='</ul>';
    }
    html+='<p style="margin-top:10px;color:var(--violet);font-weight:700">Recommended: '+d.pkg+'</p></div>';
  }
  gid('diag-output').innerHTML=html;
  diagRun=true;
  renderBody();
  gid('btn-pdf').disabled=false;
}

function exportDiagPDF(){
  if(!lastDiag){alert('Run analysis first');return;}
  var jsPDF=window.jspdf.jsPDF;
  var doc=new jsPDF();
  var pageW=210,margin=15,y=20;
  var d=lastDiag;
  doc.setFillColor(11,10,30);doc.rect(0,0,pageW,30,'F');
  doc.setTextColor(236,72,153);doc.setFontSize(18);doc.setFont(undefined,'bold');
  doc.text('CatholicFitPlans',margin,15);
  doc.setTextColor(167,139,250);doc.setFontSize(10);doc.setFont(undefined,'normal');
  doc.text('Bilateral Mobility Diagnosis Report',margin,22);
  y=42;
  doc.setTextColor(0,0,0);doc.setFontSize(13);doc.setFont(undefined,'bold');
  doc.text('Client: '+d.clientName,margin,y);y+=6;
  doc.setFontSize(10);doc.setFont(undefined,'normal');
  doc.text('Date: '+new Date().toLocaleDateString(),margin,y);y+=12;
  doc.setFillColor(245,243,255);doc.rect(margin,y-5,pageW-margin*2,16,'F');
  doc.setFontSize(11);doc.setFont(undefined,'bold');
  doc.text('Overall Recommendation',margin+3,y);y+=6;
  doc.setTextColor(236,72,153);
  doc.text(d.pkgMap[d.worst],margin+3,y);y+=14;
  for(var i=0;i<d.keys.length;i++){
    var k=d.keys[i];
    var L=d.vals[k].L,R=d.vals[k].R;
    if(!L&&!R)continue;
    var lvlL=getLevel(k,L),lvlR=getLevel(k,R);
    var prio={crit:0,mod:1,mild:2,good:3};
    var ws=prio[lvlL]<=prio[lvlR]?'L':'R';
    var wl=ws==='L'?lvlL:lvlR;
    var diag=DIAG_SHORT[k][wl];
    if(y>250){doc.addPage();y=20;}
    doc.setFillColor(30,28,74);doc.rect(margin,y-4,pageW-margin*2,8,'F');
    doc.setTextColor(255,255,255);doc.setFontSize(11);doc.setFont(undefined,'bold');
    doc.text(d.labels[k],margin+3,y+2);y+=10;
    doc.setTextColor(236,72,153);doc.setFontSize(10);
    doc.text('LEFT: '+L+' deg ('+levLabel(lvlL)+')',margin+3,y);
    doc.setTextColor(139,92,246);
    doc.text('RIGHT: '+R+' deg ('+levLabel(lvlR)+')',margin+90,y);y+=8;
    doc.setTextColor(0,0,0);doc.setFontSize(10);doc.setFont(undefined,'bold');
    doc.text(diag.title,margin+3,y);y+=5;
    doc.setFont(undefined,'normal');doc.setFontSize(9);
    var lines=doc.splitTextToSize(diag.text,pageW-margin*2-6);
    doc.text(lines,margin+3,y);y+=lines.length*4+2;
    doc.setFont(undefined,'bold');doc.setTextColor(60,60,60);
    doc.text('Possible issues:',margin+3,y);y+=4;
    doc.setFont(undefined,'normal');doc.setTextColor(80,80,80);
    for(var ii=0;ii<diag.issues.length;ii++){doc.text('  - '+diag.issues[ii],margin+3,y);y+=4;}
    var imb=getImbalance(L,R);
    if(imb&&imb.lvl!=='ok'){
      var info=IMBAL_INFO[k][imb.lvl];
      var weak=L>R?'RIGHT':'LEFT';
      y+=2;
      doc.setFont(undefined,'bold');doc.setTextColor(249,115,22);doc.setFontSize(9);
      doc.text('* '+info.title+' (diff: '+imb.diff+' deg, '+weak+' tighter)',margin+3,y);y+=4;
      doc.setFont(undefined,'normal');doc.setTextColor(80,80,80);
      for(var ji=0;ji<info.issues.length;ji++){doc.text('  - '+info.issues[ji],margin+3,y);y+=4;}
    }
    y+=2;
    doc.setFillColor(245,243,255);doc.rect(margin,y-3,pageW-margin*2,7,'F');
    doc.setTextColor(139,92,246);doc.setFont(undefined,'bold');doc.setFontSize(9);
    doc.text('Recommended: '+diag.pkg,margin+3,y+2);y+=12;
  }
  doc.setTextColor(150,150,150);doc.setFontSize(8);doc.setFont(undefined,'italic');
  doc.text('CatholicFitPlans - Assisted Stretching - Personalized Diagnosis',margin,285);
  doc.save('Diagnosis-'+d.clientName.replace(/ /g,'_')+'-'+today()+'.pdf');
}

var INVOICE_TXT={
  en:{invoice:'INVOICE',invoiceFor:'INVOICE FOR',number:'NUMBER',date:'DATE',description:'Description',qty:'Qty',price:'Price',total:'TOTAL',thanks:'Thank you for your business!',footer:'CatholicFitPlans - Assisted Stretching'},
  es:{invoice:'FACTURA',invoiceFor:'FACTURA PARA',number:'NUMERO',date:'FECHA',description:'Descripcion',qty:'Cant.',price:'Precio',total:'TOTAL',thanks:'Gracias por su preferencia!',footer:'CatholicFitPlans - Estiramiento Asistido'}
};

function generateInvoicePDF(p,c){
  var jsPDF=window.jspdf.jsPDF;
  var doc=new jsPDF();
  var pageW=210,margin=15;
  var lang=p.language||'en';
  var t=INVOICE_TXT[lang];
  doc.setFillColor(11,10,30);doc.rect(0,0,pageW,75,'F');
  doc.setFillColor(236,72,153);doc.circle(pageW/2,30,14,'F');
  doc.setTextColor(255,255,255);doc.setFontSize(20);doc.setFont(undefined,'bold');
  doc.text('+',pageW/2,35,{align:'center'});
  doc.setFontSize(28);doc.setTextColor(236,72,153);
  doc.text(t.invoice,pageW/2,58,{align:'center'});
  doc.setFontSize(10);doc.setTextColor(167,139,250);doc.setFont(undefined,'normal');
  var dt=fmtDate(p.date);
  doc.text(dt,pageW/2,68,{align:'center'});
  var y=90;
  doc.setTextColor(0,0,0);doc.setFontSize(11);doc.setFont(undefined,'bold');
  doc.text(t.invoiceFor+': '+(c.name||'').toUpperCase(),margin,y);
  doc.text(t.number+': '+(p.invoiceNumber||'INV0020'),pageW-margin,y,{align:'right'});y+=6;
  doc.setFont(undefined,'normal');doc.setFontSize(10);
  if(c.email)doc.text(c.email,margin,y);
  doc.text(t.date+': '+dt,pageW-margin,y,{align:'right'});y+=15;
  doc.setFillColor(30,28,74);doc.rect(margin,y-5,pageW-margin*2,9,'F');
  doc.setTextColor(255,255,255);doc.setFont(undefined,'bold');doc.setFontSize(11);
  doc.text(t.description,margin+3,y);
  doc.text(t.qty,margin+115,y);
  doc.text(t.price,pageW-margin-3,y,{align:'right'});y+=12;
  doc.setTextColor(0,0,0);doc.setFont(undefined,'normal');doc.setFontSize(10);
  var desc=p.description||(p.sessions+' Sessions x 30 mins');
  doc.text(desc,margin+3,y);
  doc.text(String(p.sessions||''),margin+118,y);
  doc.text('$'+Number(p.amount||0).toFixed(2),pageW-margin-3,y,{align:'right'});y+=6;
  if(p.notes){y+=5;doc.setFontSize(9);doc.setTextColor(100,100,100);doc.setFont(undefined,'italic');var nl=doc.splitTextToSize(p.notes,pageW-margin*2-6);doc.text(nl,margin+3,y);y+=nl.length*4+5;}
  y=Math.max(y+30,200);
  doc.setFillColor(245,243,255);doc.rect(margin+90,y-5,pageW-margin-90,12,'F');
  doc.setTextColor(0,0,0);doc.setFont(undefined,'bold');doc.setFontSize(13);
  doc.text(t.total+':',margin+95,y+2);
  doc.setTextColor(236,72,153);
  doc.text('$'+Number(p.amount||0).toFixed(2),pageW-margin-3,y+2,{align:'right'});
  doc.setTextColor(139,92,246);doc.setFont(undefined,'italic');doc.setFontSize(11);
  doc.text(t.thanks,pageW/2,y+25,{align:'center'});
  doc.setTextColor(150,150,150);doc.setFont(undefined,'normal');doc.setFontSize(8);
  doc.text(t.footer,pageW/2,285,{align:'center'});
  return doc;
}
function downloadInvoice(p,c){var doc=generateInvoicePDF(p,c);doc.save('Invoice-'+(p.invoiceNumber||'INV0020')+'-'+(c.name||'').replace(/ /g,'_')+'.pdf');}

function getStatus(c){
  if(!c.package||!PKG[c.package])return null;
  var total=PKG[c.package].sessions;
  var done=(sessions[c.id]||[]).filter(function(s){return c.packageStart?new Date(s.date)>=new Date(c.packageStart):true;}).length;
  var rem=total-done;
  return{total:total,done:done,rem:rem,status:rem<=0?'expired':rem===1?'warning':'ok'};
}

function renderList(q){
  q=(q||gid('search').value||'').toLowerCase();
  var html='',count=0;
  for(var i=0;i<clients.length;i++){
    var c=clients[i];
    if(q&&String(c.name).toLowerCase().indexOf(q)<0)continue;
    count++;
    var pkg=PKG[c.package]||{};
    var st=getStatus(c);
    var badge='';
    if(st&&st.status==='expired')badge='<span class="alert-badge" style="background:#ef4444">RENEW</span>';
    else if(st&&st.status==='warning')badge='<span class="alert-badge" style="background:#f97316">1 LEFT</span>';
    html+='<div class="cli'+(String(activeId)===String(c.id)?' on':'')+'" data-cid="'+esc(c.id)+'"><div class="cav">'+esc(initials(c.name))+'</div><div class="cinfo"><div class="cn">'+esc(c.name)+badge+'</div><div class="cp">'+esc(pkg.label||'No package')+(st?' - '+st.done+'/'+st.total:'')+'</div></div></div>';
  }
  gid('cn').textContent=clients.length;
  if(!count)gid('client-list').innerHTML='<div class="empty-list">'+(clients.length?'No matches.':'No clients yet. Click Add New Client.')+'</div>';
  else gid('client-list').innerHTML=html;
  if(activeId)renderDetail(activeId);
}

function bilatBox(label,key,L,R){
  var Ln=L?parseInt(L):0,Rn=R?parseInt(R):0;
  if(!Ln&&!Rn)return '<div class="bilbox"><h3>'+label+'</h3><div style="text-align:center;padding:20px;color:var(--dgray);font-style:italic">No data</div></div>';
  var goals={hip:90,ham:90,quad:120};
  var lvlL=Ln?getLevel(key,Ln):null;
  var lvlR=Rn?getLevel(key,Rn):null;
  var imb=getImbalance(Ln,Rn);
  var diffPill='';
  if(imb){diffPill='<div style="text-align:center"><span class="diff-pill '+imbCls(imb.lvl)+'">'+imbLabel(imb.lvl)+': '+imb.diff+' deg</span></div>';}
  var html='<div class="bilbox"><h3>'+label+' - Goal: '+goals[key]+' deg</h3><div class="bilbox-grid">';
  html+='<div class="bilval L"><div class="vn">Left</div><div class="vv" style="color:'+(Ln?levColor(lvlL):'var(--dgray)')+'">'+(Ln?Ln+' deg':'--')+'</div><div class="vlbl">'+(Ln?levLabel(lvlL):'No data')+'</div></div>';
  html+='<div class="bilval R"><div class="vn">Right</div><div class="vv" style="color:'+(Rn?levColor(lvlR):'var(--dgray)')+'">'+(Rn?Rn+' deg':'--')+'</div><div class="vlbl">'+(Rn?levLabel(lvlR):'No data')+'</div></div>';
  html+='</div>'+diffPill+'</div>';
  return html;
}

function renderDetail(id){
  var c=findClient(id);
  if(!c){gid('empty').style.display='flex';gid('detail').style.display='none';return;}
  gid('empty').style.display='none';gid('detail').style.display='block';
  var pkg=PKG[c.package]||{};
  var sid=String(c.id);
  var cSess=(sessions[sid]||[]).slice().sort(function(a,b){return new Date(b.date)-new Date(a.date);});
  var cMeas=(meas[sid]||[]).slice().sort(function(a,b){return new Date(b.date)-new Date(a.date);});
  var cPay=(payments[sid]||[]).slice().sort(function(a,b){return new Date(b.date)-new Date(a.date);});
  var h='<div class="dh"><div class="dh-l"><div class="dav">'+esc(initials(c.name))+'</div><div><div class="dn">'+esc(c.name)+'</div>';
  var meta='';if(c.age)meta+='Age '+esc(c.age)+'  ';if(c.start)meta+='Started '+fmtDate(c.start);
  if(meta)h+='<div class="dp">'+meta+'</div>';
  if(c.email)h+='<div class="dp">'+esc(c.email)+'</div>';
  if(c.phone)h+='<div class="dp">'+esc(c.phone)+'</div>';
  h+='</div></div><div class="dh-r"><button class="btn-e" data-edit="'+esc(c.id)+'" type="button">Edit</button><button class="btn-d" data-del="'+esc(c.id)+'" type="button">Delete</button></div></div>';
  var st=getStatus(c);
  if(st){
    if(st.status==='expired')h+='<div class="alert-banner"><div class="alert-banner-icon">!</div><div class="alert-banner-text"><h4>Package Completed - Renewal Required</h4><p>'+st.done+'/'+st.total+' sessions completed.</p></div><button class="renew-btn" data-pay="'+esc(c.id)+'" type="button">Register Payment</button></div>';
    else if(st.status==='warning')h+='<div class="alert-banner" style="background:rgba(249,115,22,.15);border-color:#f97316"><div class="alert-banner-icon">!</div><div class="alert-banner-text"><h4 style="color:#f97316">1 Session Remaining</h4><p style="color:#fdba74">'+st.done+'/'+st.total+' completed.</p></div><button class="renew-btn" style="background:#f97316" data-pay="'+esc(c.id)+'" type="button">Renew Now</button></div>';
    else h+='<div class="box" style="margin-bottom:14px;background:rgba(52,211,153,.08);border-color:rgba(52,211,153,.3)"><h3 style="color:var(--green);margin-bottom:0">Package Progress: '+st.done+'/'+st.total+' sessions</h3></div>';
  }
  h+='<button class="add-pay-btn" data-pay="'+esc(c.id)+'" type="button">Register Payment and Generate Invoice</button>';
  if(cPay.length){
    h+='<div class="sec">Payments and Invoices ('+cPay.length+')</div>';
    for(var pi=0;pi<cPay.length;pi++){
      var p=cPay[pi];
      h+='<div class="pay"><div class="pay-info"><div class="pay-num">'+esc(p.invoiceNumber||'')+'</div><div class="pay-amt">$'+Number(p.amount||0).toFixed(2)+'</div><div class="pay-meta">'+fmtDate(p.date)+' - '+esc(p.description||'')+'</div></div><div class="pay-btns"><button class="pay-btn-sm" data-paydl="'+esc(c.id)+'|'+esc(p.id)+'" type="button">PDF</button><button class="pay-btn-sm del" data-paydel="'+esc(c.id)+'|'+esc(p.id)+'" type="button">X</button></div></div>';
    }
  }
  h+='<div class="sec">Bilateral Measurements <button data-meas="'+esc(c.id)+'" type="button">+ Update</button></div>';
  h+=bilatBox('Hip Flexion','hip',c.hipL,c.hipR);
  h+=bilatBox('Hamstring','ham',c.hamL,c.hamR);
  h+=bilatBox('Quadriceps','quad',c.quadL,c.quadR);
  if(cMeas.length){
    h+='<div class="sec">Measurement History ('+cMeas.length+')</div>';
    for(var mi=0;mi<cMeas.length;mi++){
      var e=cMeas[mi];
      h+='<div class="mh"><div class="mh-d">'+fmtDate(e.date)+'<button class="mh-rm" data-rmmeas="'+esc(c.id)+'|'+esc(e.id)+'" type="button">X</button></div>';
      if(e.note)h+='<div style="font-size:10px;color:var(--violet);margin-bottom:6px">'+esc(e.note)+'</div>';
      h+='<div class="mh-grid">';
      h+='<div class="mh-cell"><span class="mh-lbl">Hip L</span><span class="mh-val" style="color:#ec4899">'+(e.hipL?e.hipL+' deg':'--')+'</span></div>';
      h+='<div class="mh-cell"><span class="mh-lbl">Hip R</span><span class="mh-val" style="color:#8b5cf6">'+(e.hipR?e.hipR+' deg':'--')+'</span></div>';
      h+='<div class="mh-cell"><span class="mh-lbl">Diff</span><span class="mh-val">'+((e.hipL&&e.hipR)?Math.abs(parseInt(e.hipL)-parseInt(e.hipR))+' deg':'--')+'</span></div>';
      h+='<div class="mh-cell"><span class="mh-lbl">Ham L</span><span class="mh-val" style="color:#ec4899">'+(e.hamL?e.hamL+' deg':'--')+'</span></div>';
      h+='<div class="mh-cell"><span class="mh-lbl">Ham R</span><span class="mh-val" style="color:#8b5cf6">'+(e.hamR?e.hamR+' deg':'--')+'</span></div>';
      h+='<div class="mh-cell"><span class="mh-lbl">Diff</span><span class="mh-val">'+((e.hamL&&e.hamR)?Math.abs(parseInt(e.hamL)-parseInt(e.hamR))+' deg':'--')+'</span></div>';
      h+='<div class="mh-cell"><span class="mh-lbl">Quad L</span><span class="mh-val" style="color:#ec4899">'+(e.quadL?e.quadL+' deg':'--')+'</span></div>';
      h+='<div class="mh-cell"><span class="mh-lbl">Quad R</span><span class="mh-val" style="color:#8b5cf6">'+(e.quadR?e.quadR+' deg':'--')+'</span></div>';
      h+='<div class="mh-cell"><span class="mh-lbl">Diff</span><span class="mh-val">'+((e.quadL&&e.quadR)?Math.abs(parseInt(e.quadL)-parseInt(e.quadR))+' deg':'--')+'</span></div>';
      h+='</div></div>';
    }
  }
  h+='<div class="grid2" style="margin-top:18px"><div class="box"><h3>Recommended Package</h3>';
  if(c.package)h+='<div class="pkg '+pkg.cls+'">'+pkg.label+'</div>';
  else h+='<p style="font-size:12px;color:var(--dgray);font-style:italic">Not assigned</p>';
  h+='</div><div class="box"><h3>Priority Muscles</h3>';
  if(c.muscles)h+='<p style="font-size:13px;color:var(--lgray)">'+esc(c.muscles)+'</p>';
  else h+='<p style="font-size:12px;color:var(--dgray);font-style:italic">Not specified</p>';
  h+='</div></div>';
  h+='<div class="box" style="margin-top:14px"><h3>Stretching Protocol</h3>';
  if(c.stretches){var lines=String(c.stretches).split('\n');for(var li=0;li<lines.length;li++)if(lines[li].trim())h+='<span class="chip">'+esc(lines[li].trim())+'</span>';}
  else h+='<p style="font-size:12px;color:var(--dgray);font-style:italic">No protocol defined</p>';
  h+='</div>';
  if(c.notes)h+='<div class="box" style="margin-top:14px"><h3>Notes</h3><p style="font-size:13px;color:var(--lgray);white-space:pre-wrap">'+esc(c.notes)+'</p></div>';
  h+='<div class="sec">Sessions ('+cSess.length+') <button data-addses="'+esc(c.id)+'" type="button">+ Add Session</button></div>';
  if(cSess.length){
    for(var si=0;si<cSess.length;si++){
      var ss=cSess[si];
      h+='<div class="ses"><div class="ses-h" data-toggleses="'+si+'"><div><div class="ses-d">'+fmtDate(ss.date)+'</div><div class="ses-n">Session #'+esc(ss.num||'')+' - '+esc(ss.duration||'30 min')+'</div></div><span style="color:var(--dgray)">v</span></div><div class="ses-body" id="sb-'+si+'">';
      if(ss.stretches)h+='<p style="font-size:12px;color:var(--lgray);white-space:pre-wrap;margin-bottom:8px"><b>Stretches:</b> '+esc(ss.stretches)+'</p>';
      if(ss.notes)h+='<p style="font-size:12px;color:var(--lgray);margin-bottom:8px"><b>Notes:</b> '+esc(ss.notes)+'</p>';
      h+='<div style="text-align:right"><button data-rmses="'+esc(c.id)+'|'+esc(ss.id)+'" type="button" style="background:0;border:0;color:var(--red);font-size:11px;cursor:pointer">Delete</button></div></div></div>';
    }
  }else h+='<div style="text-align:center;padding:20px;color:var(--dgray);font-size:12px">No sessions yet.</div>';
  gid('detail').innerHTML=h;
}

function openModal(id){gid(id).classList.add('on');}
function closeModal(id){gid(id).classList.remove('on');}

function openAdd(){
  gid('m-cli-t').textContent='Add New Client';
  var fields=['f-id','f-name','f-email','f-age','f-phone','f-pkg','f-hipL','f-hipR','f-hamL','f-hamR','f-quadL','f-quadR','f-mus','f-str','f-notes'];
  for(var i=0;i<fields.length;i++)gid(fields[i]).value='';
  gid('f-start').value=today();
  openModal('m-cli');
}
function openEdit(id){
  var c=findClient(id);if(!c)return;
  gid('m-cli-t').textContent='Edit Client';
  gid('f-id').value=c.id;gid('f-name').value=c.name||'';gid('f-email').value=c.email||'';gid('f-age').value=c.age||'';gid('f-phone').value=c.phone||'';gid('f-start').value=c.start||'';gid('f-pkg').value=c.package||'';
  gid('f-hipL').value=c.hipL||'';gid('f-hipR').value=c.hipR||'';
  gid('f-hamL').value=c.hamL||'';gid('f-hamR').value=c.hamR||'';
  gid('f-quadL').value=c.quadL||'';gid('f-quadR').value=c.quadR||'';
  gid('f-mus').value=c.muscles||'';gid('f-str').value=c.stretches||'';gid('f-notes').value=c.notes||'';
  openModal('m-cli');
}
function saveClient(){
  var name=(gid('f-name').value||'').trim();
  if(!name){alert('Name required');return;}
  var eid=gid('f-id').value,newId=eid||('c'+Date.now());
  var hipL=gid('f-hipL').value,hipR=gid('f-hipR').value;
  var hamL=gid('f-hamL').value,hamR=gid('f-hamR').value;
  var quadL=gid('f-quadL').value,quadR=gid('f-quadR').value;
  var existing=eid?findClient(eid):null;
  var data={id:String(newId),name:name,email:gid('f-email').value,age:gid('f-age').value,phone:gid('f-phone').value,start:gid('f-start').value,package:gid('f-pkg').value,packageStart:existing&&existing.packageStart?existing.packageStart:(gid('f-start').value||today()),hipL:hipL,hipR:hipR,hamL:hamL,hamR:hamR,quadL:quadL,quadR:quadR,muscles:gid('f-mus').value,stretches:gid('f-str').value,notes:gid('f-notes').value};
  if(eid){var idx=findIdx(eid);if(idx>=0)clients[idx]=data;}
  else{clients.push(data);
    if(hipL||hipR||hamL||hamR||quadL||quadR){
      if(!meas[String(newId)])meas[String(newId)]=[];
      meas[String(newId)].push({id:'m'+Date.now(),clientId:String(newId),date:data.start||today(),hipL:hipL,hipR:hipR,hamL:hamL,hamR:hamR,quadL:quadL,quadR:quadR,note:'Initial measurement'});
    }
  }
  closeModal('m-cli');activeId=String(newId);renderList();saveToSheets();toast(eid?'Updated':'Added');
}
function delClient(id){
  if(!confirm('Delete client?'))return;
  var s=String(id);
  clients=clients.filter(function(c){return String(c.id)!==s;});
  delete sessions[s];delete meas[s];delete payments[s];
  if(String(activeId)===s)activeId=null;
  renderList();saveToSheets();toast('Deleted');
}

function openMeas(id){
  var c=findClient(id);if(!c)return;
  gid('mf-cid').value=String(id);gid('mf-date').value=today();
  gid('mf-hipL').value=c.hipL||'';gid('mf-hipR').value=c.hipR||'';
  gid('mf-hamL').value=c.hamL||'';gid('mf-hamR').value=c.hamR||'';
  gid('mf-quadL').value=c.quadL||'';gid('mf-quadR').value=c.quadR||'';
  gid('mf-note').value='';
  openModal('m-meas');
}
function saveMeas(){
  var cid=gid('mf-cid').value,date=gid('mf-date').value;
  var hipL=gid('mf-hipL').value,hipR=gid('mf-hipR').value;
  var hamL=gid('mf-hamL').value,hamR=gid('mf-hamR').value;
  var quadL=gid('mf-quadL').value,quadR=gid('mf-quadR').value;
  if(!date){alert('Date required');return;}
  if(!hipL&&!hipR&&!hamL&&!hamR&&!quadL&&!quadR){alert('Enter at least one');return;}
  var entry={id:'m'+Date.now(),clientId:String(cid),date:date,hipL:hipL,hipR:hipR,hamL:hamL,hamR:hamR,quadL:quadL,quadR:quadR,note:gid('mf-note').value};
  if(!meas[cid])meas[cid]=[];meas[cid].push(entry);
  var idx=findIdx(cid);
  if(idx>=0){
    if(hipL)clients[idx].hipL=hipL;if(hipR)clients[idx].hipR=hipR;
    if(hamL)clients[idx].hamL=hamL;if(hamR)clients[idx].hamR=hamR;
    if(quadL)clients[idx].quadL=quadL;if(quadR)clients[idx].quadR=quadR;
  }
  closeModal('m-meas');renderList();saveToSheets();toast('Saved');
}
function delMeas(cid,mid){
  if(!confirm('Delete?'))return;
  meas[cid]=(meas[cid]||[]).filter(function(m){return String(m.id)!==String(mid);});
  renderDetail(cid);saveToSheets();
}

function openSes(id){
  var c=findClient(id);if(!c)return;
  var ex=sessions[String(id)]||[];
  gid('sf-cid').value=String(id);gid('sf-date').value=today();gid('sf-dur').value='30 min';gid('sf-num').value=ex.length+1;gid('sf-str').value=c.stretches||'';gid('sf-notes').value='';
  openModal('m-ses');
}
function saveSes(){
  var cid=gid('sf-cid').value,date=gid('sf-date').value;
  if(!date){alert('Date required');return;}
  var s={id:'s'+Date.now(),clientId:String(cid),date:date,duration:gid('sf-dur').value,num:gid('sf-num').value||'1',stretches:gid('sf-str').value,notes:gid('sf-notes').value};
  if(!sessions[cid])sessions[cid]=[];sessions[cid].push(s);
  closeModal('m-ses');renderList();saveToSheets();toast('Saved');
}
function delSes(cid,sid){
  if(!confirm('Delete?'))return;
  sessions[cid]=(sessions[cid]||[]).filter(function(s){return String(s.id)!==String(sid);});
  renderDetail(cid);saveToSheets();
}

function openPay(id){
  var c=findClient(id);if(!c)return;
  gid('pf-cid').value=String(id);gid('pf-date').value=today();
  var pk=c.package||'basic';
  gid('pf-pkg').value=pk;
  gid('pf-sess').value=PKG[pk].sessions;
  gid('pf-amt').value=PKG[pk].price;
  gid('pf-desc').value=PKG[pk].sessions+' Sessions x 30 mins';
  gid('pf-lang').value='en';gid('pf-notes').value='';
  gid('pf-num').value='Loading...';
  getNextInvoice(function(num){gid('pf-num').value=num;});
  openModal('m-pay');
}
function savePay(){
  var cid=gid('pf-cid').value;
  var c=findClient(cid);if(!c)return;
  var date=gid('pf-date').value;if(!date){alert('Date required');return;}
  var amt=parseFloat(gid('pf-amt').value);if(!amt||amt<=0){alert('Amount required');return;}
  var num=gid('pf-num').value;if(!num||num==='Loading...'){alert('Wait for invoice number');return;}
  var p={id:'p'+Date.now(),clientId:String(cid),invoiceNumber:num,date:date,amount:amt,package:gid('pf-pkg').value,sessions:parseInt(gid('pf-sess').value)||0,description:gid('pf-desc').value,language:gid('pf-lang').value,notes:gid('pf-notes').value};
  if(!payments[cid])payments[cid]=[];payments[cid].push(p);
  var idx=findIdx(cid);
  if(idx>=0){clients[idx].package=gid('pf-pkg').value;clients[idx].packageStart=date;}
  closeModal('m-pay');renderList();saveToSheets();
  if(confirm('Payment saved! Generate invoice PDF?'))downloadInvoice(p,findClient(cid));
  toast('Payment saved');
}
function findPay(cid,pid){var arr=payments[cid]||[];for(var i=0;i<arr.length;i++)if(String(arr[i].id)===String(pid))return arr[i];return null;}
function downloadPay(cid,pid){var p=findPay(cid,pid);var c=findClient(cid);if(p&&c)downloadInvoice(p,c);}
function delPay(cid,pid){
  if(!confirm('Delete payment?'))return;
  payments[cid]=(payments[cid]||[]).filter(function(p){return String(p.id)!==String(pid);});
  renderDetail(cid);saveToSheets();
}

document.addEventListener('click',function(ev){
  var t=ev.target;
  while(t&&t!==document.body){
    if(t.dataset){
      if(t.dataset.tab){switchTab(t.dataset.tab);return;}
      if(t.id==='btn-analyze'){runDiag();return;}
      if(t.id==='btn-pdf'){exportDiagPDF();return;}
      if(t.dataset.close){closeModal(t.dataset.close);return;}
      if(t.id==='btn-add'){openAdd();return;}
      if(t.id==='b-save-cli'){saveClient();return;}
      if(t.id==='b-save-meas'){saveMeas();return;}
      if(t.id==='b-save-ses'){saveSes();return;}
      if(t.id==='b-save-pay'){savePay();return;}
      if(t.dataset.cid){activeId=t.dataset.cid;renderList();return;}
      if(t.dataset.edit){openEdit(t.dataset.edit);return;}
      if(t.dataset.del){delClient(t.dataset.del);return;}
      if(t.dataset.meas){openMeas(t.dataset.meas);return;}
      if(t.dataset.addses){openSes(t.dataset.addses);return;}
      if(t.dataset.pay){openPay(t.dataset.pay);return;}
      if(t.dataset.rmmeas){var p=t.dataset.rmmeas.split('|');delMeas(p[0],p[1]);return;}
      if(t.dataset.rmses){var p2=t.dataset.rmses.split('|');delSes(p2[0],p2[1]);return;}
      if(t.dataset.paydl){var p3=t.dataset.paydl.split('|');downloadPay(p3[0],p3[1]);return;}
      if(t.dataset.paydel){var p4=t.dataset.paydel.split('|');delPay(p4[0],p4[1]);return;}
      if(t.dataset.toggleses!=null){var sb=gid('sb-'+t.dataset.toggleses);if(sb)sb.classList.toggle('on');return;}
    }
    t=t.parentNode;
  }
});

document.addEventListener('DOMContentLoaded',function(){
  var bilatInputs=['hipL','hipR','hamL','hamR','quadL','quadR'];
  for(var i=0;i<bilatInputs.length;i++){
    var el=gid(bilatInputs[i]);
    if(el)el.addEventListener('input',refreshAnalyzer);
  }
  gid('search').addEventListener('input',function(){renderList();});
  gid('pf-pkg').addEventListener('change',function(){
    var k=gid('pf-pkg').value;
    if(PKG[k]){gid('pf-sess').value=PKG[k].sessions;gid('pf-amt').value=PKG[k].price;gid('pf-desc').value=PKG[k].sessions+' Sessions x 30 mins';}
  });
  renderBody();
  refreshAnalyzer();
  loadFromSheets();
});
