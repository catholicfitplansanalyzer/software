var API_URL='https://script.google.com/macros/s/AKfycbxW99Gb8tMCvktp9joQQlGtZ3ERuwJObSVIEEfShupY2V4C3hqKt9b4Ejksd-n3Qer9/exec';
var LOGO_URL='9E6DC135-0C7C-4D3C-A50D-143B7950C0E0.png';
var LOGO_DATA=null;
var entries=[];

function gid(id){return document.getElementById(id);}
function fmtDate(d){if(!d)return '';var p=String(d).split('-');if(p.length!==3)return String(d);var m=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];return m[parseInt(p[1])-1]+' '+parseInt(p[2])+', '+p[0];}
function today(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function esc(s){if(s==null)return '';return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function toast(m,err){var t=gid('toast');t.textContent=m;t.className='toast on'+(err?' error':'');setTimeout(function(){t.classList.remove('on');},2500);}

function preloadLogo(){
  var img=new Image();img.crossOrigin='anonymous';
  img.onload=function(){try{var c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;c.getContext('2d').drawImage(img,0,0);LOGO_DATA=c.toDataURL('image/png');}catch(e){}};
  img.src=LOGO_URL+'?t='+Date.now();
}

function loadEntries(){
  gid('list').innerHTML='<div class="loader">Loading...</div>';
  fetch(API_URL+'?action=getNutrition')
    .then(function(r){return r.json();})
    .then(function(data){
      entries=(data.entries||[]).reverse(); // newest first
      updateStats();
      renderList();
    })
    .catch(function(){
      gid('list').innerHTML='<div class="empty"><h3>Error loading data</h3><p>Check connection and try again</p></div>';
      toast('Connection error',true);
    });
}

function updateStats(){
  var t=today();
  var weekAgo=new Date();weekAgo.setDate(weekAgo.getDate()-7);
  var todayCount=0,weekCount=0;
  for(var i=0;i<entries.length;i++){
    var d=entries[i].date;
    if(d===t)todayCount++;
    if(d&&new Date(d)>=weekAgo)weekCount++;
  }
  gid('stat-total').textContent=entries.length;
  gid('stat-today').textContent=todayCount;
  gid('stat-week').textContent=weekCount;
}

function renderList(){
  var q=(gid('search').value||'').toLowerCase();
  var filtered=entries.filter(function(e){
    if(!q)return true;
    return (e.name||'').toLowerCase().indexOf(q)>=0||(e.email||'').toLowerCase().indexOf(q)>=0;
  });
  if(!filtered.length){
    gid('list').innerHTML='<div class="empty"><h3>'+(entries.length?'No matches':'No submissions yet')+'</h3><p>'+(entries.length?'Try a different search':'Share your nutrition form link with clients')+'</p></div>';
    return;
  }
  var h='';
  for(var i=0;i<filtered.length;i++){
    var e=filtered[i];
    h+='<div class="client-card">'+
      '<div class="client-h">'+
        '<div class="client-info">'+
          '<div class="client-name">'+esc(e.name||'Unknown')+'</div>'+
          '<div class="client-meta">'+
            '<span>'+fmtDate(e.date)+'</span>'+
            (e.age?'<span>Age: '+esc(e.age)+'</span>':'')+
            (e.sex?'<span>'+esc(e.sex==='F'?'Female':'Male')+'</span>':'')+
            (e.email?'<span>'+esc(e.email)+'</span>':'')+
          '</div>'+
          (e.goal?'<div class="goal-badge">'+esc(e.goal)+'</div>':'')+
        '</div>'+
        '<div class="client-actions">'+
          '<button class="btn-view" data-id="'+esc(e.id)+'" type="button">View Details</button>'+
          '<button class="btn-pdf" data-pdf="'+esc(e.id)+'" type="button">Download PDF</button>'+
        '</div>'+
      '</div>'+
    '</div>';
  }
  gid('list').innerHTML=h;
}

function findEntry(id){for(var i=0;i<entries.length;i++)if(String(entries[i].id)===String(id))return entries[i];return null;}

function viewDetails(id){
  var e=findEntry(id);if(!e)return;
  gid('modal-name').textContent=e.name||'Unknown';
  var h='';
  h+='<div class="modal-section"><h3>Basic Information</h3>';
  h+='<div class="field"><div class="label">Name</div><div class="value">'+esc(e.name||'-')+'</div></div>';
  h+='<div class="field"><div class="label">Date Submitted</div><div class="value">'+fmtDate(e.date)+'</div></div>';
  if(e.age||e.sex)h+='<div class="field"><div class="label">Age / Sex</div><div class="value">'+esc(e.age||'-')+' / '+esc(e.sex==='F'?'Female':e.sex==='M'?'Male':'-')+'</div></div>';
  if(e.phone)h+='<div class="field"><div class="label">Phone</div><div class="value">'+esc(e.phone)+'</div></div>';
  if(e.email)h+='<div class="field"><div class="label">Email</div><div class="value">'+esc(e.email)+'</div></div>';
  if(e.height||e.weight)h+='<div class="field"><div class="label">Height / Weight</div><div class="value">'+esc(e.height||'-')+' cm / '+esc(e.weight||'-')+' kg</div></div>';
  if(e.goal)h+='<div class="field"><div class="label">Goal</div><div class="value">'+esc(e.goal)+'</div></div>';
  h+='</div>';
  if(e.dailyDiet)h+='<div class="modal-section"><h3>Daily Diet</h3><div class="value">'+esc(e.dailyDiet)+'</div></div>';
  if(e.supplements)h+='<div class="modal-section"><h3>Supplements</h3><div class="value">'+esc(e.supplements)+'</div></div>';
  if(e.pathologies)h+='<div class="modal-section"><h3>Pathologies / Injuries</h3><div class="value">'+esc(e.pathologies)+'</div></div>';
  h+='<div class="modal-section"><h3>Food Preferences</h3>';
  if(e.proteins)h+='<div class="field"><div class="label">Proteins</div><div class="value">'+esc(e.proteins)+'</div></div>';
  if(e.carbs)h+='<div class="field"><div class="label">Carbs</div><div class="value">'+esc(e.carbs)+'</div></div>';
  if(e.vegetables)h+='<div class="field"><div class="label">Vegetables</div><div class="value">'+esc(e.vegetables)+'</div></div>';
  if(e.fruits)h+='<div class="field"><div class="label">Fruits</div><div class="value">'+esc(e.fruits)+'</div></div>';
  if(e.fats)h+='<div class="field"><div class="label">Fats</div><div class="value">'+esc(e.fats)+'</div></div>';
  h+='</div>';
  h+='<div class="modal-section"><h3>Schedule</h3>';
  if(e.mealsPerDay)h+='<div class="field"><div class="label">Meals per day</div><div class="value">'+esc(e.mealsPerDay)+'</div></div>';
  if(e.gymDays)h+='<div class="field"><div class="label">Gym days per week</div><div class="value">'+esc(e.gymDays)+'</div></div>';
  if(e.sessionTime)h+='<div class="field"><div class="label">Time per session</div><div class="value">'+esc(e.sessionTime)+'</div></div>';
  h+='</div>';
  h+='<button class="btn-view" data-pdf="'+esc(e.id)+'" type="button" style="width:100%;padding:14px">Download PDF</button>';
  gid('modal-body').innerHTML=h;
  gid('modal').classList.add('on');
}

function exportPDF(id){
  var e=findEntry(id);if(!e)return;
  var jsPDF=window.jspdf.jsPDF;var doc=new jsPDF();
  var pageW=210,margin=15,y=20;
  // Header gradient
  for(var gy=0;gy<32;gy++){var gp=gy/32;var r=Math.round(11+(50-11)*gp),gC=Math.round(10+(30-10)*gp),b=Math.round(30+(90-30)*gp);doc.setFillColor(r,gC,b);doc.rect(0,gy,pageW,1.5,'F');}
  if(LOGO_DATA){try{doc.addImage(LOGO_DATA,'PNG',margin,3,26,26);}catch(er){}}
  doc.setTextColor(255,255,255);doc.setFontSize(18);doc.setFont(undefined,'bold');
  doc.text('Nutrition Intake',margin+30,15);
  doc.setTextColor(220,200,255);doc.setFontSize(10);doc.setFont(undefined,'normal');
  doc.text('CatholicFitPlans - Coach Reference',margin+30,22);
  y=42;
  doc.setTextColor(0,0,0);doc.setFontSize(15);doc.setFont(undefined,'bold');
  doc.text(e.name||'Unknown',margin,y);y+=6;
  doc.setFontSize(10);doc.setFont(undefined,'normal');
  doc.text('Date: '+fmtDate(e.date),margin,y);
  if(e.age)doc.text('Age: '+e.age,margin+60,y);
  if(e.sex)doc.text('Sex: '+(e.sex==='F'?'Female':'Male'),margin+90,y);
  if(e.email)doc.text(e.email,margin+120,y);
  y+=10;
  function section(title){
    if(y>270){doc.addPage();y=20;}
    doc.setFillColor(30,28,74);doc.rect(margin,y-4,pageW-margin*2,8,'F');
    doc.setTextColor(255,255,255);doc.setFontSize(11);doc.setFont(undefined,'bold');
    doc.text(title,margin+3,y+2);y+=10;
    doc.setTextColor(0,0,0);doc.setFontSize(10);doc.setFont(undefined,'normal');
  }
  function paragraph(label,val){
    if(!val)return;
    if(y>270){doc.addPage();y=20;}
    doc.setFont(undefined,'bold');doc.setFontSize(9);doc.setTextColor(139,92,246);
    doc.text(label.toUpperCase(),margin+3,y);y+=5;
    doc.setFont(undefined,'normal');doc.setTextColor(0,0,0);doc.setFontSize(10);
    var lines=doc.splitTextToSize(String(val),pageW-margin*2-6);
    for(var i=0;i<lines.length;i++){
      if(y>278){doc.addPage();y=20;}
      doc.text(lines[i],margin+3,y);y+=4.5;
    }
    y+=4;
  }
  section('Basic Info');
  if(e.phone)paragraph('Phone',e.phone);
  if(e.height||e.weight)paragraph('Height/Weight',(e.height?e.height+' cm':'')+(e.weight?' / '+e.weight+' kg':''));
  if(e.goal)paragraph('Goal',e.goal);
  section('Current Daily Diet');
  paragraph('Daily Diet',e.dailyDiet||'No info provided');
  section('Supplements');
  paragraph('Supplements',e.supplements||'No info provided');
  section('Health & Pathologies');
  paragraph('Pathologies / Injuries',e.pathologies||'No info provided');
  section('Food Preferences');
  paragraph('Proteins',e.proteins);
  paragraph('Carbohydrates',e.carbs);
  paragraph('Vegetables',e.vegetables);
  paragraph('Fruits',e.fruits);
  paragraph('Fats',e.fats);
  section('Schedule');
  paragraph('Meals per day',e.mealsPerDay);
  paragraph('Gym days per week',e.gymDays);
  paragraph('Session time',e.sessionTime);
  doc.setTextColor(150,150,150);doc.setFontSize(8);doc.setFont(undefined,'italic');
  doc.text('CatholicFitPlans - Nutrition Intake - For Coach Use Only',margin,290);
  doc.save('Nutrition-'+(e.name||'client').replace(/ /g,'_')+'-'+(e.date||today())+'.pdf');
}

document.addEventListener('click',function(ev){
  var t=ev.target;
  if(t.dataset.id){viewDetails(t.dataset.id);return;}
  if(t.dataset.pdf){exportPDF(t.dataset.pdf);return;}
});

document.addEventListener('DOMContentLoaded',function(){
  preloadLogo();
  loadEntries();
  gid('btn-refresh').addEventListener('click',loadEntries);
  gid('search').addEventListener('input',renderList);
  gid('modal-close').addEventListener('click',function(){gid('modal').classList.remove('on');});
  gid('modal').addEventListener('click',function(ev){if(ev.target===gid('modal'))gid('modal').classList.remove('on');});
});
