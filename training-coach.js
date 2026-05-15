var API_URL='https://script.google.com/macros/s/AKfycbzJJarSgOQ2q6DFQIVm-FfrXITCn7NNStcdRnf0szf9HRZIKpIu5a9Lak-XYGn0cQz_/exec';
var LOGO_URL='9E6DC135-0C7C-4D3C-A50D-143B7950C0E0.png';
var LOGO_DATA=null;
var entries=[];
var currentEntry=null;
var currentTab='details';
var uiLang='en';
var planConfig=null;
var planData=null;
var API_KEY_STORAGE='cfp_anthropic_key';

function getApiKey(){try{return localStorage.getItem(API_KEY_STORAGE)||'';}catch(e){return '';}}
function setApiKey(k){try{if(k)localStorage.setItem(API_KEY_STORAGE,k);else localStorage.removeItem(API_KEY_STORAGE);}catch(e){}}
function hasApiKey(){return !!getApiKey();}

function gid(id){return document.getElementById(id);}
function fmtDate(d){if(!d)return '';var p=String(d).split('-');if(p.length!==3)return String(d);var m=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];return m[parseInt(p[1])-1]+' '+parseInt(p[2])+', '+p[0];}
function today(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function esc(s){if(s==null)return '';return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function toast(m,err){var t=gid('toast');t.textContent=m;t.className='toast on'+(err?' error':'');setTimeout(function(){t.classList.remove('on');},2800);}

// ===== TRANSLATIONS =====
var TT={
  en:{
    coachView:'Coach View',refresh:'Refresh',
    title:'Training Plans',subtitle:'Build personalized training programs from intake data',
    total:'Total Intakes',today:'Today',thisWeek:'This Week',
    searchPh:'Search by name...',
    noMatches:'No matches',noIntakes:'No intakes yet',tryDiff:'Try a different search',shareLink:'Share the intake form link with clients',
    age:'Age',years:'years',female:'Female',male:'Male',
    open:'Open',
    tabDetails:'Details',tabSetup:'Plan Setup',tabBuilder:'Plan Builder',
    secBasic:'Basic Information',secObj:'Goals & Schedule',secMedical:'Medical History',secMobility:'Movement Tests',
    name:'Name',dateSubmitted:'Date',ageSex:'Age / Sex',email:'Email',phone:'Phone',hw:'Height / Weight',bmi:'BMI',
    goal:'Goal',location:'Location',days:'Days/week',time:'Time/session',
    plank:'Max Plank',
    injuries:'Injuries',surgeries:'Surgeries',medications:'Medications',limitations:'Limitations',
    observations:'Trainer Notes',focusInfo:'Focus areas (from intake)',
    upperLimited:'Upper body limitations',lowerLimited:'Lower body limitations',
    // Plan setup
    setupTitle:'Plan Configuration',
    setupGoal:'Training Goal',setupEmphasis:'Muscular Emphasis (1-2 max)',setupLoc:'Location',setupDays:'Days per week',setupWeeks:'Plan duration',setupTime:'Session time',setupLevel:'Fitness Level',
    locHome:'Home',locGym:'Gym',locBoth:'Home + Gym',
    weeks4:'4 weeks',weeks6:'6 weeks',weeks8:'8 weeks',
    levelBeg:'Beginner',levelInt:'Intermediate',levelAdv:'Advanced',
    saveCfg:'Save Config & Build Plan',
    goals:['Weight Loss','Muscle Gain','Body Building','Toning','Endurance','Strength','Mobility','General Health'],
    muscles:['Chest','Back','Shoulders','Arms','Legs','Glutes','Core'],
    // Plan builder
    builderTitle:'Training Plan',
    btnAI:'Generate with AI',btnTemplate:'Use Template',btnExport:'Export PDF',btnClear:'Clear Plan',
    aiGenerating:'AI is building your plan...',aiNeedKey:'Set API key first (gear icon)',
    weekLabel:'Week',dayLabel:'Day',
    exName:'Exercise',exSets:'Sets',exReps:'Reps',exRest:'Rest',exNotes:'Notes / RPE / Tempo',
    addEx:'+ Add exercise',deleteEx:'Delete',
    rest:'Rest Day',
    progNote:'Weekly progression notes:',
    pdfTitle:'Training Plan',pdfFooter:'CatholicFitPlans - Personalized Training Program',
    aiConfig:'AI Configuration',aiHelp:'Paste your Anthropic API key here to enable AI-powered training plan generation. Your key is stored only in this browser.',
    aiKeyLabel:'Anthropic API Key',aiSave:'Save',aiClear:'Clear',
    aiStatusOk:'API key saved. AI features enabled.',aiStatusNone:'No API key set.',
    aiStatusSaved:'Saved!',aiStatusCleared:'Cleared.',
    saved:'Saved!',aiError:'AI error: ',aiSuccess:'Plan generated!',
    needSetup:'Save plan setup first (Plan Setup tab)',
    confirmClear:'Clear the entire plan?'
  },
  es:{
    coachView:'Vista Coach',refresh:'Actualizar',
    title:'Planes de Entrenamiento',subtitle:'Crea programas personalizados desde el intake',
    total:'Total Intakes',today:'Hoy',thisWeek:'Esta semana',
    searchPh:'Buscar por nombre...',
    noMatches:'Sin resultados',noIntakes:'Aun no hay intakes',tryDiff:'Intenta otra busqueda',shareLink:'Comparte el link del intake con tus clientes',
    age:'Edad',years:'anos',female:'Femenino',male:'Masculino',
    open:'Abrir',
    tabDetails:'Detalles',tabSetup:'Config Plan',tabBuilder:'Constructor',
    secBasic:'Informacion Basica',secObj:'Objetivos y Horario',secMedical:'Historial Medico',secMobility:'Tests de Movimiento',
    name:'Nombre',dateSubmitted:'Fecha',ageSex:'Edad / Sexo',email:'Email',phone:'Telefono',hw:'Estatura / Peso',bmi:'IMC',
    goal:'Objetivo',location:'Lugar',days:'Dias/semana',time:'Tiempo/sesion',
    plank:'Plank Max',
    injuries:'Lesiones',surgeries:'Cirugias',medications:'Medicamentos',limitations:'Limitaciones',
    observations:'Notas del entrenador',focusInfo:'Areas a trabajar (del intake)',
    upperLimited:'Limitaciones tren superior',lowerLimited:'Limitaciones tren inferior',
    setupTitle:'Configuracion del Plan',
    setupGoal:'Objetivo de Entrenamiento',setupEmphasis:'Enfasis Muscular (max 2)',setupLoc:'Lugar',setupDays:'Dias por semana',setupWeeks:'Duracion del plan',setupTime:'Tiempo por sesion',setupLevel:'Nivel',
    locHome:'Casa',locGym:'Gym',locBoth:'Casa + Gym',
    weeks4:'4 semanas',weeks6:'6 semanas',weeks8:'8 semanas',
    levelBeg:'Principiante',levelInt:'Intermedio',levelAdv:'Avanzado',
    saveCfg:'Guardar y Construir Plan',
    goals:['Bajar de peso','Ganar musculo','Body Building','Tonificacion','Resistencia','Fuerza','Movilidad','Salud general'],
    muscles:['Pecho','Espalda','Hombros','Brazos','Piernas','Gluteos','Core'],
    builderTitle:'Plan de Entrenamiento',
    btnAI:'Generar con IA',btnTemplate:'Usar Plantilla',btnExport:'Exportar PDF',btnClear:'Limpiar Plan',
    aiGenerating:'La IA esta armando tu plan...',aiNeedKey:'Configura tu API key primero (engranaje)',
    weekLabel:'Semana',dayLabel:'Dia',
    exName:'Ejercicio',exSets:'Sets',exReps:'Reps',exRest:'Descanso',exNotes:'Notas / RPE / Tempo',
    addEx:'+ Agregar ejercicio',deleteEx:'Eliminar',
    rest:'Descanso',
    progNote:'Progresion semanal:',
    pdfTitle:'Plan de Entrenamiento',pdfFooter:'CatholicFitPlans - Programa de Entrenamiento Personalizado',
    aiConfig:'Configuracion de IA',aiHelp:'Pega tu API key de Anthropic aqui. Se guarda solo en este navegador.',
    aiKeyLabel:'API Key de Anthropic',aiSave:'Guardar',aiClear:'Borrar',
    aiStatusOk:'API key guardada. IA activada.',aiStatusNone:'Sin API key.',
    aiStatusSaved:'Guardada!',aiStatusCleared:'Borrada.',
    saved:'Guardado!',aiError:'Error de IA: ',aiSuccess:'Plan generado!',
    needSetup:'Configura el plan primero (tab Config Plan)',
    confirmClear:'Limpiar todo el plan?'
  }
};
function tt(k){return TT[uiLang][k];}

function preloadLogo(){
  var img=new Image();img.crossOrigin='anonymous';
  img.onload=function(){try{var c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;c.getContext('2d').drawImage(img,0,0);LOGO_DATA=c.toDataURL('image/png');}catch(e){}};
  img.src=LOGO_URL+'?t='+Date.now();
}

function loadEntries(){
  gid('list').innerHTML='<div class="loader">Loading...</div>';
  fetch(API_URL+'?action=getIntakes')
    .then(function(r){return r.json();})
    .then(function(data){
      entries=(data.intakes||[]).reverse();
      updateStats();
      renderList();
    })
    .catch(function(){
      gid('list').innerHTML='<div class="empty"><h3>Error loading</h3></div>';
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
    return (e.name||'').toLowerCase().indexOf(q)>=0;
  });
  if(!filtered.length){
    gid('list').innerHTML='<div class="empty"><h3>'+(entries.length?tt('noMatches'):tt('noIntakes'))+'</h3><p>'+(entries.length?tt('tryDiff'):tt('shareLink'))+'</p></div>';
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
            (e.age?'<span>'+tt('age')+': '+esc(e.age)+'</span>':'')+
            (e.sex?'<span>'+esc(e.sex==='F'?tt('female'):tt('male'))+'</span>':'')+
          '</div>'+
          (e.goal?'<div class="goal-badge">'+esc(e.goal)+'</div>':'')+
          (e.location?'<div class="loc-badge">'+esc(e.location)+'</div>':'')+
        '</div>'+
        '<div class="client-actions">'+
          '<button class="btn-view" data-id="'+esc(e.id)+'" type="button">'+tt('open')+'</button>'+
        '</div>'+
      '</div>'+
    '</div>';
  }
  gid('list').innerHTML=h;
}

function findEntry(id){for(var i=0;i<entries.length;i++)if(String(entries[i].id)===String(id))return entries[i];return null;}

// ===== Open client =====
function openClient(id){
  currentEntry=findEntry(id);
  if(!currentEntry)return;
  planConfig=loadPlanConfig(currentEntry.id);
  planData=loadPlanData(currentEntry.id);
  currentTab='details';
  gid('modal-name').textContent=currentEntry.name||'Unknown';
  document.querySelectorAll('.tab').forEach(function(t){t.classList.toggle('on',t.dataset.tab===currentTab);});
  renderTab();
  gid('modal').classList.add('on');
}

function renderTab(){
  var c=gid('tab-content');
  if(currentTab==='details')renderDetailsTab(c);
  else if(currentTab==='setup')renderSetupTab(c);
  else if(currentTab==='builder')renderBuilderTab(c);
}

function renderDetailsTab(c){
  var e=currentEntry;
  var h='';
  h+='<div class="modal-section"><h3>'+tt('secBasic')+'</h3>';
  h+='<div class="field"><div class="label">'+tt('name')+'</div><div class="value">'+esc(e.name||'-')+'</div></div>';
  h+='<div class="field"><div class="label">'+tt('dateSubmitted')+'</div><div class="value">'+fmtDate(e.date)+'</div></div>';
  if(e.age||e.sex)h+='<div class="field"><div class="label">'+tt('ageSex')+'</div><div class="value">'+esc(e.age||'-')+' / '+esc(e.sex==='F'?tt('female'):e.sex==='M'?tt('male'):'-')+'</div></div>';
  if(e.email)h+='<div class="field"><div class="label">'+tt('email')+'</div><div class="value">'+esc(e.email)+'</div></div>';
  if(e.phone)h+='<div class="field"><div class="label">'+tt('phone')+'</div><div class="value">'+esc(e.phone)+'</div></div>';
  if(e.height||e.weight)h+='<div class="field"><div class="label">'+tt('hw')+'</div><div class="value">'+esc(e.height||'-')+' cm / '+esc(e.weight||'-')+' kg</div></div>';
  if(e.bmi)h+='<div class="field"><div class="label">'+tt('bmi')+'</div><div class="value">'+esc(e.bmi)+'</div></div>';
  h+='</div>';
  h+='<div class="modal-section"><h3>'+tt('secObj')+'</h3>';
  if(e.goal)h+='<div class="field"><div class="label">'+tt('goal')+'</div><div class="value">'+esc(e.goal)+'</div></div>';
  if(e.location)h+='<div class="field"><div class="label">'+tt('location')+'</div><div class="value">'+esc(e.location)+'</div></div>';
  if(e.days)h+='<div class="field"><div class="label">'+tt('days')+'</div><div class="value">'+esc(e.days)+'</div></div>';
  if(e.time)h+='<div class="field"><div class="label">'+tt('time')+'</div><div class="value">'+esc(e.time)+'</div></div>';
  if(e.plank)h+='<div class="field"><div class="label">'+tt('plank')+'</div><div class="value">'+esc(e.plank)+'</div></div>';
  h+='</div>';
  if(e.injuries||e.surgeries||e.medications||e.limitations){
    h+='<div class="modal-section"><h3>'+tt('secMedical')+'</h3>';
    if(e.injuries)h+='<div class="field"><div class="label">'+tt('injuries')+'</div><div class="value">'+esc(e.injuries)+'</div></div>';
    if(e.surgeries)h+='<div class="field"><div class="label">'+tt('surgeries')+'</div><div class="value">'+esc(e.surgeries)+'</div></div>';
    if(e.medications)h+='<div class="field"><div class="label">'+tt('medications')+'</div><div class="value">'+esc(e.medications)+'</div></div>';
    if(e.limitations)h+='<div class="field"><div class="label">'+tt('limitations')+'</div><div class="value">'+esc(e.limitations)+'</div></div>';
    h+='</div>';
  }
  // Movement test concerns
  var ubConcerns=getMovementConcerns(e.upperBody);
  var lbConcerns=getMovementConcerns(e.lowerBody);
  if(ubConcerns.length||lbConcerns.length){
    h+='<div class="modal-section"><h3>'+tt('secMobility')+'</h3>';
    if(ubConcerns.length)h+='<div class="field"><div class="label">'+tt('upperLimited')+'</div><div class="value">'+esc(ubConcerns.join('\n'))+'</div></div>';
    if(lbConcerns.length)h+='<div class="field"><div class="label">'+tt('lowerLimited')+'</div><div class="value">'+esc(lbConcerns.join('\n'))+'</div></div>';
    h+='</div>';
  }
  if(e.observations)h+='<div class="modal-section"><h3>'+tt('observations')+'</h3><div class="value">'+esc(e.observations)+'</div></div>';
  if(e.focus)h+='<div class="modal-section"><h3>'+tt('focusInfo')+'</h3><div class="value">'+esc(e.focus)+'</div></div>';
  c.innerHTML=h;
}

function getMovementConcerns(testData){
  if(!testData||!Array.isArray(testData))return [];
  var concerns=[];
  for(var i=0;i<testData.length;i++){
    var t=testData[i];
    if(!t)continue;
    var name=t.name||('Test '+(i+1));
    if(t.full==='no'||t.pinch||t.pull||t.stretch){
      var issues=[];
      if(t.full==='no')issues.push('limited ROM');
      if(t.pinch)issues.push('pinch');
      if(t.pull)issues.push('pull');
      if(t.stretch)issues.push('stretch');
      concerns.push(name+': '+issues.join(', '));
    }
  }
  return concerns;
}

// ===== PLAN SETUP TAB =====
function renderSetupTab(c){
  var e=currentEntry;
  if(!planConfig)planConfig={
    goal:e.goal||'',
    emphasis:[],
    location:e.location||'Home',
    days:parseInt(e.days)||3,
    weeks:6,
    time:e.time||'60 min',
    level:'intermediate'
  };
  var goalOpts=tt('goals').map(function(g){return '<option '+(planConfig.goal===g?'selected':'')+'>'+g+'</option>';}).join('');
  var h='';
  h+='<div class="formula-info">'+
    '<b>'+tt('setupTitle')+':</b> '+(currentEntry.name||'Client')+' - '+
    tt('age')+': '+(currentEntry.age||'?')+' '+tt('years')+
    '</div>';
  h+='<div class="modal-section">';
  h+='<div class="calc-row">'+
    '<div class="calc-fg"><label>'+tt('setupGoal')+'</label><select id="cfg-goal"><option value="">--</option>'+goalOpts+'</select></div>'+
    '<div class="calc-fg"><label>'+tt('setupLoc')+'</label><select id="cfg-loc">'+
      '<option value="Home" '+(planConfig.location==='Home'?'selected':'')+'>'+tt('locHome')+'</option>'+
      '<option value="Gym" '+(planConfig.location==='Gym'?'selected':'')+'>'+tt('locGym')+'</option>'+
      '<option value="Both" '+(planConfig.location==='Both'?'selected':'')+'>'+tt('locBoth')+'</option>'+
    '</select></div>'+
    '<div class="calc-fg"><label>'+tt('setupLevel')+'</label><select id="cfg-level">'+
      '<option value="beginner" '+(planConfig.level==='beginner'?'selected':'')+'>'+tt('levelBeg')+'</option>'+
      '<option value="intermediate" '+(planConfig.level==='intermediate'?'selected':'')+'>'+tt('levelInt')+'</option>'+
      '<option value="advanced" '+(planConfig.level==='advanced'?'selected':'')+'>'+tt('levelAdv')+'</option>'+
    '</select></div>'+
  '</div>';
  h+='<div class="calc-row">'+
    '<div class="calc-fg"><label>'+tt('setupDays')+'</label><select id="cfg-days">'+
      [2,3,4,5,6,7].map(function(d){return '<option '+(planConfig.days===d?'selected':'')+'>'+d+'</option>';}).join('')+
    '</select></div>'+
    '<div class="calc-fg"><label>'+tt('setupWeeks')+'</label><select id="cfg-weeks">'+
      '<option value="4" '+(planConfig.weeks===4?'selected':'')+'>'+tt('weeks4')+'</option>'+
      '<option value="6" '+(planConfig.weeks===6?'selected':'')+'>'+tt('weeks6')+'</option>'+
      '<option value="8" '+(planConfig.weeks===8?'selected':'')+'>'+tt('weeks8')+'</option>'+
    '</select></div>'+
    '<div class="calc-fg"><label>'+tt('setupTime')+'</label><input id="cfg-time" value="'+esc(planConfig.time)+'"/></div>'+
  '</div>';
  h+='<div style="margin-top:20px"><div class="calc-fg"><label>'+tt('setupEmphasis')+'</label><div class="muscle-chips" id="emphasis-chips">';
  var muscles=tt('muscles');
  for(var i=0;i<muscles.length;i++){
    var m=muscles[i];
    var on=planConfig.emphasis.indexOf(m)>=0?'on':'';
    h+='<div class="muscle-chip '+on+'" data-muscle="'+esc(m)+'">'+m+'</div>';
  }
  h+='</div></div></div>';
  h+='<button class="btn-primary" id="btn-save-cfg" type="button" style="width:100%;margin-top:18px">'+tt('saveCfg')+'</button>';
  h+='</div>';
  c.innerHTML=h;
  // listeners
  c.querySelectorAll('.muscle-chip').forEach(function(chip){
    chip.addEventListener('click',function(){
      var m=chip.dataset.muscle;
      var idx=planConfig.emphasis.indexOf(m);
      if(idx>=0){planConfig.emphasis.splice(idx,1);chip.classList.remove('on');}
      else if(planConfig.emphasis.length<2){planConfig.emphasis.push(m);chip.classList.add('on');}
      else{toast('Max 2 muscle groups',true);}
    });
  });
  gid('btn-save-cfg').addEventListener('click',function(){
    planConfig.goal=gid('cfg-goal').value;
    planConfig.location=gid('cfg-loc').value;
    planConfig.level=gid('cfg-level').value;
    planConfig.days=parseInt(gid('cfg-days').value);
    planConfig.weeks=parseInt(gid('cfg-weeks').value);
    planConfig.time=gid('cfg-time').value;
    savePlanConfig(currentEntry.id,planConfig);
    toast(tt('saved'));
    currentTab='builder';
    document.querySelectorAll('.tab').forEach(function(t){t.classList.toggle('on',t.dataset.tab===currentTab);});
    renderTab();
  });
}

// ===== Plan Builder Tab =====
function renderBuilderTab(c){
  if(!planConfig||!planConfig.goal){
    c.innerHTML='<div class="warn">'+tt('needSetup')+'</div>';
    return;
  }
  if(!planData)planData={weeks:[]};
  var h='';
  h+='<div class="formula-info">'+
    '<b>'+(currentEntry.name||'Client')+'</b> | '+
    planConfig.goal+' | '+planConfig.location+' | '+
    planConfig.days+' '+tt('days')+' | '+planConfig.weeks+' '+(uiLang==='es'?'semanas':'weeks')+
    (planConfig.emphasis.length?' | Emphasis: '+planConfig.emphasis.join(', '):'')+
    '</div>';
  h+='<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px">';
  h+='<button class="btn-ai" id="btn-ai" type="button">&#10024; '+tt('btnAI')+'</button>';
  h+='<button class="btn-secondary" id="btn-template" type="button">'+tt('btnTemplate')+'</button>';
  h+='<button class="btn-secondary" id="btn-clear-plan" type="button">'+tt('btnClear')+'</button>';
  h+='<button class="btn-primary" id="btn-export" type="button" style="margin-left:auto">'+tt('btnExport')+'</button>';
  h+='</div>';
  if(!planData.weeks.length){
    h+='<div class="empty"><p style="font-size:13px">No plan yet. Click "Generate with AI" or "Use Template" to create one.</p></div>';
  }else{
    for(var w=0;w<planData.weeks.length;w++){
      var week=planData.weeks[w];
      h+='<div class="week-card">';
      h+='<div class="week-h">';
      h+='<div class="week-title">'+tt('weekLabel')+' '+(w+1)+'</div>';
      if(week.progression)h+='<div class="week-progression">'+esc(week.progression)+'</div>';
      h+='</div>';
      for(var d=0;d<week.days.length;d++){
        var day=week.days[d];
        h+='<div class="day-card">';
        h+='<div class="day-h">';
        h+='<div class="day-name"><input data-w="'+w+'" data-d="'+d+'" data-fld="name" value="'+esc(day.name||(tt('dayLabel')+' '+(d+1)))+'"/></div>';
        if(day.focus)h+='<div class="day-focus">'+esc(day.focus)+'</div>';
        h+='</div>';
        if(day.rest){
          h+='<div class="day-rest">'+tt('rest')+'</div>';
        }else{
          h+='<div class="ex-header"><div>'+tt('exName')+'</div><div>'+tt('exSets')+'</div><div>'+tt('exReps')+'</div><div>'+tt('exRest')+'</div><div></div></div>';
          var exes=day.exercises||[];
          for(var ei=0;ei<exes.length;ei++){
            var ex=exes[ei];
            h+='<div class="exercise-row">';
            h+='<div class="ex-name"><input data-w="'+w+'" data-d="'+d+'" data-ei="'+ei+'" data-fld="name" value="'+esc(ex.name||'')+'"/></div>';
            h+='<div class="ex-num"><input data-w="'+w+'" data-d="'+d+'" data-ei="'+ei+'" data-fld="sets" value="'+esc(ex.sets||'')+'"/></div>';
            h+='<div class="ex-num"><input data-w="'+w+'" data-d="'+d+'" data-ei="'+ei+'" data-fld="reps" value="'+esc(ex.reps||'')+'"/></div>';
            h+='<div class="ex-num"><input data-w="'+w+'" data-d="'+d+'" data-ei="'+ei+'" data-fld="rest" value="'+esc(ex.rest||'')+'"/></div>';
            h+='<button class="ex-delete" data-w="'+w+'" data-d="'+d+'" data-ei="'+ei+'" data-action="del-ex" type="button">&times;</button>';
            h+='</div>';
            if(ex.notes){
              h+='<div style="font-size:10px;color:var(--mgray);font-style:italic;padding:4px 0 8px 4px"><input data-w="'+w+'" data-d="'+d+'" data-ei="'+ei+'" data-fld="notes" value="'+esc(ex.notes)+'" style="width:100%;background:transparent;border:0;color:var(--mgray);font-style:italic;font-size:10px;outline:none"/></div>';
            }
          }
          h+='<button class="btn-add-ex" data-w="'+w+'" data-d="'+d+'" data-action="add-ex" type="button">'+tt('addEx')+'</button>';
        }
        if(day.notes){
          h+='<div class="day-notes"><textarea data-w="'+w+'" data-d="'+d+'" data-fld="notes" placeholder="'+tt('exNotes')+'">'+esc(day.notes)+'</textarea></div>';
        }
        h+='</div>';
      }
      h+='</div>';
    }
  }
  c.innerHTML=h;
  // event listeners
  gid('btn-ai').addEventListener('click',generateWithAI);
  gid('btn-template').addEventListener('click',generateFromTemplate);
  gid('btn-clear-plan').addEventListener('click',function(){
    if(confirm(tt('confirmClear'))){
      planData={weeks:[]};
      savePlanData(currentEntry.id,planData);
      renderTab();
    }
  });
  gid('btn-export').addEventListener('click',exportPlanPDF);
  // editable fields
  c.querySelectorAll('input[data-fld],textarea[data-fld]').forEach(function(el){
    el.addEventListener('change',updatePlanField);
    if(el.tagName==='TEXTAREA')el.addEventListener('input',updatePlanField);
  });
  c.querySelectorAll('[data-action]').forEach(function(el){
    el.addEventListener('click',function(){handlePlanAction(el);});
  });
}

function updatePlanField(){
  var el=this;
  var w=parseInt(el.dataset.w);
  var d=parseInt(el.dataset.d);
  var ei=el.dataset.ei!==undefined?parseInt(el.dataset.ei):null;
  var fld=el.dataset.fld;
  var v=el.value;
  if(ei===null||isNaN(ei)){
    planData.weeks[w].days[d][fld]=v;
  }else{
    planData.weeks[w].days[d].exercises[ei][fld]=v;
  }
  savePlanData(currentEntry.id,planData);
}

function handlePlanAction(el){
  var w=parseInt(el.dataset.w);
  var d=parseInt(el.dataset.d);
  if(el.dataset.action==='add-ex'){
    if(!planData.weeks[w].days[d].exercises)planData.weeks[w].days[d].exercises=[];
    planData.weeks[w].days[d].exercises.push({name:'',sets:'3',reps:'10',rest:'60s',notes:''});
    savePlanData(currentEntry.id,planData);
    renderTab();
  }else if(el.dataset.action==='del-ex'){
    var ei=parseInt(el.dataset.ei);
    planData.weeks[w].days[d].exercises.splice(ei,1);
    savePlanData(currentEntry.id,planData);
    renderTab();
  }
}

// ===== LOCAL STORAGE =====
function savePlanConfig(id,cfg){try{localStorage.setItem('cfp_train_cfg_'+id,JSON.stringify(cfg));}catch(e){}}
function loadPlanConfig(id){try{var s=localStorage.getItem('cfp_train_cfg_'+id);return s?JSON.parse(s):null;}catch(e){return null;}}
function savePlanData(id,d){try{localStorage.setItem('cfp_train_data_'+id,JSON.stringify(d));}catch(e){}}
function loadPlanData(id){try{var s=localStorage.getItem('cfp_train_data_'+id);return s?JSON.parse(s):null;}catch(e){return null;}}

// ===== TEMPLATE GENERATION =====
function generateFromTemplate(){
  var cfg=planConfig;
  var weeks=[];
  for(var w=0;w<cfg.weeks;w++){
    weeks.push(buildWeekFromTemplate(cfg,w));
  }
  planData={weeks:weeks};
  savePlanData(currentEntry.id,planData);
  renderTab();
  toast(tt('aiSuccess'));
}

function buildWeekFromTemplate(cfg,weekIdx){
  var split=getSplitForGoal(cfg.goal,cfg.days,cfg.emphasis);
  var days=[];
  // Progression: increase intensity / volume per week
  var progressions=[
    'Foundation - learn form, RPE 6-7',
    'Volume building - RPE 7-8',
    'Intensity - RPE 8',
    'Peak week - RPE 8-9',
    'Deload then push - RPE 7-8',
    'Heavy week - RPE 8-9',
    'Pre-peak - RPE 9',
    'Peak - test PRs'
  ];
  for(var d=0;d<7;d++){
    if(d<split.length){
      var dayPlan=split[d];
      days.push({
        name:dayPlan.name,
        focus:dayPlan.focus,
        exercises:dayPlan.exercises.map(function(ex){
          // Apply progression: increase reps/sets per week
          var sets=ex.sets;var reps=ex.reps;
          if(weekIdx===1)reps=incRange(reps,1);
          else if(weekIdx===2)reps=incRange(reps,2);
          else if(weekIdx>=3){sets=String(parseInt(sets)+1);}
          return {name:ex.name,sets:String(sets),reps:reps,rest:ex.rest||'60s',notes:ex.notes||''};
        }),
        notes:''
      });
    }else{
      days.push({name:tt('rest'),rest:true});
    }
  }
  return {progression:progressions[weekIdx]||'',days:days};
}

function incRange(r,n){
  // e.g. "10-12" -> "11-13"
  var m=String(r).match(/(\d+)[-\s]+(\d+)/);
  if(m)return (parseInt(m[1])+n)+'-'+(parseInt(m[2])+n);
  var n1=parseInt(r);if(!isNaN(n1))return String(n1+n);
  return r;
}

// Get training split based on goal, days/week and emphasis
function getSplitForGoal(goal,days,emphasis){
  var isHome=planConfig.location==='Home';
  function ex(name,sets,reps,rest,notes){return {name:name,sets:String(sets),reps:reps,rest:rest||'60s',notes:notes||''};}
  
  // BODY BUILDING / MUSCLE GAIN
  if(goal==='Body Building'||goal==='Muscle Gain'||goal==='Ganar musculo'){
    if(days<=3){
      return [
        {name:'Push (Chest/Shoulders/Triceps)',focus:'Push',exercises:[
          ex('Bench Press','4','8-10','90s'),
          ex('Incline DB Press','3','10-12','75s'),
          ex('Shoulder Press','3','10-12','75s'),
          ex('Lateral Raises','3','12-15','60s'),
          ex('Tricep Pushdown','3','12-15','60s')
        ]},
        {name:'Pull (Back/Biceps)',focus:'Pull',exercises:[
          ex('Pull-ups or Lat Pulldown','4','8-10','90s'),
          ex('Bent-over Row','3','10-12','75s'),
          ex('Seated Cable Row','3','10-12','75s'),
          ex('Face Pulls','3','15','60s'),
          ex('Bicep Curls','3','12','60s')
        ]},
        {name:'Legs',focus:'Legs',exercises:[
          ex('Squat','4','8-10','120s'),
          ex(emphasis.indexOf('Glutes')>=0?'Hip Thrust':'Romanian Deadlift','4','8-10','90s'),
          ex('Leg Press','3','10-12','75s'),
          ex('Leg Curl','3','12','60s'),
          ex('Calf Raises','4','15','45s')
        ]}
      ].slice(0,days);
    }
    // 4-5 days: Push/Pull/Legs/Upper/Lower
    if(days===4){
      return [
        {name:'Upper Push',focus:'Chest/Shoulders/Tri',exercises:[
          ex('Bench Press','4','6-8','120s'),
          ex('Incline DB Press','4','8-10','90s'),
          ex('Shoulder Press','3','10','75s'),
          ex('Lateral Raises','4','12-15','60s'),
          ex('Skull Crushers','3','10-12','60s')
        ]},
        {name:emphasis.indexOf('Legs')>=0||emphasis.indexOf('Glutes')>=0?'Lower (Quad/Glute Focus)':'Lower Body',focus:'Quads/Glutes',exercises:[
          ex('Squat','4','6-8','150s'),
          ex(emphasis.indexOf('Glutes')>=0?'Hip Thrust':'Leg Press','4','8-10','120s'),
          ex('Bulgarian Split Squat','3','10','75s'),
          ex('Leg Extension','3','12-15','60s'),
          ex('Calf Raises','4','15','45s')
        ]},
        {name:'Upper Pull',focus:'Back/Biceps',exercises:[
          ex('Pull-ups','4','6-8','120s'),
          ex('Bent-over Row','4','8-10','90s'),
          ex('Lat Pulldown','3','10-12','75s'),
          ex('Face Pulls','3','15','60s'),
          ex('Preacher Curl','3','10-12','60s')
        ]},
        {name:'Lower Posterior',focus:'Hams/Glutes',exercises:[
          ex('Romanian Deadlift','4','8-10','120s'),
          ex(emphasis.indexOf('Glutes')>=0?'Glute Bridge Loaded':'Leg Curl','4','10-12','75s'),
          ex('Walking Lunges','3','12/leg','75s'),
          ex('Single Leg Hip Thrust','3','12/leg','60s'),
          ex('Hanging Leg Raises','3','12','60s')
        ]}
      ];
    }
    // 5+ days: bro split
    var split=[
      {name:'Chest',focus:'Chest',exercises:[
        ex('Bench Press','4','6-8','120s'),
        ex('Incline DB Press','4','8-10','90s'),
        ex('Cable Fly','3','12','60s'),
        ex('Dips','3','10','75s'),
        ex('Push-ups (to failure)','2','AMRAP','60s')
      ]},
      {name:'Back',focus:'Back',exercises:[
        ex('Pull-ups','4','6-8','120s'),
        ex('T-Bar Row','4','8-10','90s'),
        ex('Lat Pulldown','3','10-12','75s'),
        ex('Seated Cable Row','3','12','75s'),
        ex('Face Pulls','3','15','60s')
      ]},
      {name:'Legs',focus:'Legs',exercises:[
        ex('Squat','4','6-8','150s'),
        ex(emphasis.indexOf('Glutes')>=0?'Hip Thrust':'Romanian Deadlift','4','8-10','120s'),
        ex('Leg Press','3','10-12','90s'),
        ex('Leg Curl','3','12-15','60s'),
        ex('Calf Raises','4','15','45s')
      ]},
      {name:'Shoulders',focus:'Shoulders',exercises:[
        ex('Shoulder Press','4','8-10','90s'),
        ex('Arnold Press','3','10-12','75s'),
        ex('Lateral Raises','4','12-15','60s'),
        ex('Rear Delt Fly','3','15','60s'),
        ex('Upright Row','3','12','60s')
      ]},
      {name:'Arms',focus:'Biceps/Triceps',exercises:[
        ex('Barbell Curl','4','8-10','75s'),
        ex('Skull Crushers','4','8-10','75s'),
        ex('Hammer Curls','3','12','60s'),
        ex('Tricep Pushdown','3','12','60s'),
        ex('Preacher Curl','3','12','60s')
      ]},
      {name:'Glutes & Core',focus:'Glutes/Core',exercises:[
        ex('Hip Thrust','4','10-12','90s'),
        ex('Bulgarian Split Squat','3','12/leg','75s'),
        ex('Glute Bridge','3','15','60s'),
        ex('Cable Crunch','3','15','45s'),
        ex('Plank','3','45s','45s')
      ]}
    ];
    return split.slice(0,days);
  }
  
  // WEIGHT LOSS / TONING
  if(goal==='Weight Loss'||goal==='Bajar de peso'||goal==='Toning'||goal==='Tonificacion'){
    if(days<=3){
      return [
        {name:'Full Body + Cardio',focus:'Full body',exercises:[
          ex('Squat','3','12-15','45s'),
          ex('Push-ups','3','10-15','45s'),
          ex('Bent-over Row','3','12','45s'),
          ex('Plank','3','45s','30s'),
          ex('HIIT Bike/Treadmill','8 rounds','30s on/30s off','30s')
        ]},
        {name:'Lower + Core',focus:'Lower/Core',exercises:[
          ex('Goblet Squat','3','15','45s'),
          ex('Walking Lunges','3','12/leg','45s'),
          ex('Glute Bridge','3','15','45s'),
          ex('Side Plank','3','30s/side','30s'),
          ex('Mountain Climbers','3','45s','30s')
        ]},
        {name:'Upper + Cardio',focus:'Upper/Cardio',exercises:[
          ex('Push-ups','3','12','45s'),
          ex('DB Row','3','12','45s'),
          ex('Shoulder Press','3','12','45s'),
          ex('Tricep Dips','3','12','45s'),
          ex('Steady Cardio','30 min','moderate','-')
        ]}
      ].slice(0,days);
    }
    return [
      {name:'Upper Strength',focus:'Upper',exercises:[
        ex('Bench Press','3','10','60s'),
        ex('Bent-over Row','3','10','60s'),
        ex('Shoulder Press','3','12','60s'),
        ex('Lat Pulldown','3','12','60s'),
        ex('Plank','3','45s','30s')
      ]},
      {name:'HIIT Cardio',focus:'Cardio',exercises:[
        ex('Warm-up','5 min','easy pace','-'),
        ex('HIIT Intervals','10 rounds','30s sprint/30s rest','-'),
        ex('Burpees','3','10','45s'),
        ex('Mountain Climbers','3','45s','30s'),
        ex('Cool down stretch','5 min','-','-')
      ]},
      {name:'Lower Strength',focus:'Lower',exercises:[
        ex('Squat','3','10-12','75s'),
        ex('Romanian Deadlift','3','10','75s'),
        ex('Walking Lunges','3','12/leg','60s'),
        ex('Glute Bridge','3','15','45s'),
        ex('Calf Raises','3','15','45s')
      ]},
      {name:'Steady Cardio + Core',focus:'Cardio/Core',exercises:[
        ex('Brisk Walk/Jog','30-40 min','moderate','-'),
        ex('Plank','3','45s','30s'),
        ex('Dead Bug','3','10/side','30s'),
        ex('Bird Dog','3','10/side','30s'),
        ex('Side Plank','3','30s/side','30s')
      ]},
      {name:'Full Body Circuit',focus:'Full body',exercises:[
        ex('Squat','3','12','30s'),
        ex('Push-up','3','10','30s'),
        ex('Row','3','12','30s'),
        ex('Lunges','3','10/leg','30s'),
        ex('Plank','3','45s','30s')
      ]}
    ].slice(0,days);
  }
  
  // STRENGTH
  if(goal==='Strength'||goal==='Fuerza'){
    return [
      {name:'Heavy Squat',focus:'Squat focus',exercises:[
        ex('Squat','5','5','3 min'),
        ex('Front Squat','3','5','2 min'),
        ex('Bulgarian Split Squat','3','8/leg','90s'),
        ex('Leg Press','3','8','90s'),
        ex('Calf Raises','4','10','60s')
      ]},
      {name:'Heavy Bench',focus:'Bench focus',exercises:[
        ex('Bench Press','5','5','3 min'),
        ex('Incline Bench','3','6','2 min'),
        ex('OHP','3','6','2 min'),
        ex('Pull-ups','3','6-8','90s'),
        ex('Skull Crushers','3','8','75s')
      ]},
      {name:'Heavy Deadlift',focus:'Deadlift focus',exercises:[
        ex('Deadlift','5','3','3 min'),
        ex('Romanian Deadlift','3','6','2 min'),
        ex('Bent-over Row','3','6','2 min'),
        ex('Pull-ups','3','6-8','90s'),
        ex('Plank','3','60s','60s')
      ]},
      {name:'Accessory Upper',focus:'Upper accessory',exercises:[
        ex('DB Bench','3','8-10','90s'),
        ex('DB Row','3','8-10','90s'),
        ex('Lateral Raises','3','12','60s'),
        ex('Bicep Curls','3','10','60s'),
        ex('Face Pulls','3','15','45s')
      ]}
    ].slice(0,days);
  }
  
  // MOBILITY
  if(goal==='Mobility'||goal==='Movilidad'){
    return [
      {name:'Hip Mobility',focus:'Hips',exercises:[
        ex('90/90 Hip Stretch','3','45s/side','30s'),
        ex('Couch Stretch','3','60s/side','30s'),
        ex('Cossack Squat','3','8/side','45s'),
        ex('Single Leg RDL','3','10/leg','45s'),
        ex('Glute Bridge','3','12','45s')
      ]},
      {name:'Shoulder Mobility',focus:'Shoulders',exercises:[
        ex('Band Pull-aparts','3','15','30s'),
        ex('Shoulder Dislocates','3','10','30s'),
        ex('Wall Slides','3','12','30s'),
        ex('Y-T-W Raises','3','8 each','45s'),
        ex('Face Pulls','3','15','45s')
      ]},
      {name:'Full Body Flow',focus:'Full body',exercises:[
        ex('Sun Salutation','5 rounds','-','30s'),
        ex('Worlds Greatest Stretch','3','6/side','30s'),
        ex('Cat-Cow','3','10','30s'),
        ex('Childs Pose','3','60s','30s'),
        ex('Pigeon Pose','3','45s/side','30s')
      ]},
      {name:'Core Stability',focus:'Core',exercises:[
        ex('Dead Bug','3','10/side','45s'),
        ex('Bird Dog','3','10/side','45s'),
        ex('Plank','3','45s','45s'),
        ex('Side Plank','3','30s/side','45s'),
        ex('Pallof Press','3','10/side','45s')
      ]}
    ].slice(0,days);
  }
  
  // GENERAL HEALTH / DEFAULT
  return [
    {name:'Full Body A',focus:'Full body',exercises:[
      ex('Squat','3','10','60s'),
      ex('Push-up','3','10','60s'),
      ex('Bent-over Row','3','10','60s'),
      ex('Plank','3','45s','45s'),
      ex('Bicep Curls','3','12','45s')
    ]},
    {name:'Cardio + Mobility',focus:'Cardio',exercises:[
      ex('Brisk Walk','30 min','moderate','-'),
      ex('Hip Flexor Stretch','2','45s/side','30s'),
      ex('Hamstring Stretch','2','45s/side','30s'),
      ex('Cat-Cow','2','10','30s'),
      ex('Childs Pose','2','60s','30s')
    ]},
    {name:'Full Body B',focus:'Full body',exercises:[
      ex('Lunges','3','12/leg','60s'),
      ex('Shoulder Press','3','10','60s'),
      ex('Lat Pulldown','3','12','60s'),
      ex('Glute Bridge','3','15','45s'),
      ex('Plank','3','45s','45s')
    ]},
    {name:'Active Recovery',focus:'Recovery',exercises:[
      ex('Light Walk','30 min','easy','-'),
      ex('Yoga Flow','15 min','-','-'),
      ex('Foam Rolling','10 min','-','-')
    ]}
  ].slice(0,days);
}

// ===== AI GENERATION =====
function generateWithAI(){
  if(!hasApiKey()){
    toast(tt('aiNeedKey'),true);
    gid('config-modal').classList.add('on');
    return;
  }
  var btn=gid('btn-ai');
  var orig=btn.innerHTML;
  btn.disabled=true;
  btn.innerHTML='&#9203; '+tt('aiGenerating');
  
  var prompt=buildAITrainingPrompt();
  
  fetch('https://api.anthropic.com/v1/messages',{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'x-api-key':getApiKey(),
      'anthropic-version':'2023-06-01',
      'anthropic-dangerous-direct-browser-access':'true'
    },
    body:JSON.stringify({
      model:'claude-haiku-4-5-20251001',
      max_tokens:8000,
      messages:[{role:'user',content:prompt}]
    })
  })
  .then(function(r){return r.json();})
  .then(function(data){
    btn.disabled=false;btn.innerHTML=orig;
    if(data.error){toast(tt('aiError')+(data.error.message||data.error),true);return;}
    if(!data.content||!data.content[0]){toast(tt('aiError')+'no response',true);return;}
    var text=data.content[0].text;
    var jsonMatch=text.match(/\{[\s\S]*\}/);
    if(!jsonMatch){toast(tt('aiError')+'invalid format',true);console.log('AI:',text);return;}
    try{
      var parsed=JSON.parse(jsonMatch[0]);
      if(parsed.weeks&&parsed.weeks.length){
        planData=parsed;
        savePlanData(currentEntry.id,planData);
        renderTab();
        toast(tt('aiSuccess'));
      }
    }catch(err){toast(tt('aiError')+err.message,true);}
  })
  .catch(function(err){btn.disabled=false;btn.innerHTML=orig;toast(tt('aiError')+err.message,true);});
}

function buildAITrainingPrompt(){
  var e=currentEntry;
  var cfg=planConfig;
  var clientLang=uiLang;
  var isEs=(clientLang==='es');
  
  // Movement concerns
  var ubProblems=getMovementConcerns(e.upperBody);
  var lbProblems=getMovementConcerns(e.lowerBody);
  
  var langInstr=isEs?'Respond ENTIRELY in SPANISH.':'Respond ENTIRELY in ENGLISH.';
  
  var prompt=langInstr+'\n\n'+
    'You are an expert strength and conditioning coach (CSCS-level) building a personalized training plan.\n\n'+
    'CLIENT PROFILE:\n'+
    '- Name: '+(e.name||'Client')+'\n'+
    '- Age: '+(e.age||'?')+' | Sex: '+(e.sex==='F'?'Female':'Male')+'\n'+
    '- Height: '+(e.height||'?')+' cm | Weight: '+(e.weight||'?')+' kg | BMI: '+(e.bmi||'?')+'\n'+
    '- Max Plank: '+(e.plank||'?')+'\n'+
    '- Injuries: '+(e.injuries||'None')+'\n'+
    '- Surgeries: '+(e.surgeries||'None')+'\n'+
    '- Medications: '+(e.medications||'None')+'\n'+
    '- Limitations: '+(e.limitations||'None')+'\n'+
    (ubProblems.length?'- Upper Body Movement Issues: '+ubProblems.join('; ')+'\n':'')+
    (lbProblems.length?'- Lower Body Movement Issues: '+lbProblems.join('; ')+'\n':'')+
    '\nPLAN CONFIGURATION:\n'+
    '- Goal: '+cfg.goal+'\n'+
    '- Location: '+cfg.location+'\n'+
    '- Frequency: '+cfg.days+' days/week\n'+
    '- Duration: '+cfg.weeks+' weeks total\n'+
    '- Time per session: '+cfg.time+'\n'+
    '- Fitness Level: '+cfg.level+'\n'+
    (cfg.emphasis.length?'- Muscular Emphasis: '+cfg.emphasis.join(', ')+' (give EXTRA volume to these muscle groups)\n':'')+
    '\nINSTRUCTIONS:\n'+
    '1. Build a complete '+cfg.weeks+'-week program with progressive overload week to week.\n'+
    '2. Each training day should have 4-6 exercises that match the time budget.\n'+
    '3. Rest days are FULL rest (no exercises listed, just "Rest Day" label).\n'+
    '4. For each exercise specify: name, sets, reps (or time), rest interval, and optional notes (RPE/tempo/cues).\n'+
    (cfg.location==='Home'?'5. ONLY use bodyweight or minimal equipment (DBs, band, bench) - this client trains at HOME.\n':cfg.location==='Gym'?'5. Use full gym equipment (barbells, machines, cables).\n':'5. Mix home and gym exercises.\n')+
    '6. Adapt for client AGE ('+(e.age||'30')+'): younger=higher intensity, older=more mobility/conservative.\n'+
    '7. Respect injuries/limitations: avoid exercises that aggravate them.\n'+
    (cfg.emphasis.length?'8. EMPHASIS: add 1-2 extra exercises per relevant day for '+cfg.emphasis.join(' and ')+'. For example if Glutes: add hip thrusts, glute bridges, single-leg variants. If Chest: add incline press, fly variations.\n':'')+
    '9. Weekly progression: Week 1 = foundation/learn form. Week 2-3 = add volume. Mid weeks = peak intensity. Final week = test/peak.\n'+
    '10. Include progression note for each week describing the focus.\n'+
    '11. Account for fitness level: beginner = simpler movements, more rest, lower volume.\n\n'+
    'OUTPUT FORMAT - Return ONLY valid JSON, no other text, no markdown:\n'+
    '{\n'+
    '  "weeks": [\n'+
    '    {\n'+
    '      "progression": "Week 1: Foundation - learn form, RPE 6-7",\n'+
    '      "days": [\n'+
    '        {\n'+
    '          "name": "Day 1: Push",\n'+
    '          "focus": "Chest/Shoulders/Triceps",\n'+
    '          "exercises": [\n'+
    '            {"name": "Bench Press", "sets": "4", "reps": "8-10", "rest": "90s", "notes": "RPE 7, control eccentric 2s"},\n'+
    '            {"name": "Incline DB Press", "sets": "3", "reps": "10-12", "rest": "75s", "notes": ""}\n'+
    '          ],\n'+
    '          "notes": "Warm up: 5 min cardio + dynamic stretches"\n'+
    '        },\n'+
    '        {"name": "Day 2: Rest", "rest": true}\n'+
    '      ]\n'+
    '    }\n'+
    '  ]\n'+
    '}\n\n'+
    'Each week must have exactly 7 days (training days + rest days). Total weeks: '+cfg.weeks+'. Training days per week: '+cfg.days+'.';
  return prompt;
}

// ===== PDF EXPORT =====
function exportPlanPDF(){
  if(!planData||!planData.weeks.length){toast('No plan to export',true);return;}
  var jsPDF=window.jspdf.jsPDF;var doc=new jsPDF();
  var pageW=210,margin=15,y=20;
  // Gradient header
  for(var gy=0;gy<32;gy++){var gp=gy/32;var r=Math.round(11+(50-11)*gp),gC=Math.round(10+(30-10)*gp),b=Math.round(30+(90-30)*gp);doc.setFillColor(r,gC,b);doc.rect(0,gy,pageW,1.5,'F');}
  if(LOGO_DATA){try{doc.addImage(LOGO_DATA,'PNG',margin,3,26,26);}catch(er){}}
  doc.setTextColor(255,255,255);doc.setFontSize(18);doc.setFont(undefined,'bold');
  doc.text(tt('pdfTitle'),margin+30,15);
  doc.setTextColor(220,200,255);doc.setFontSize(10);doc.setFont(undefined,'normal');
  doc.text('CatholicFitPlans',margin+30,22);
  y=42;
  doc.setTextColor(0,0,0);doc.setFontSize(15);doc.setFont(undefined,'bold');
  doc.text(currentEntry.name||'Client',margin,y);y+=6;
  doc.setFontSize(10);doc.setFont(undefined,'normal');
  doc.text(tt('goal')+': '+planConfig.goal+'  |  '+tt('location')+': '+planConfig.location+'  |  '+planConfig.days+' '+tt('days')+'  |  '+planConfig.time,margin,y);
  y+=6;
  if(planConfig.emphasis.length){doc.text('Emphasis: '+planConfig.emphasis.join(', '),margin,y);y+=6;}
  y+=4;
  for(var wi=0;wi<planData.weeks.length;wi++){
    var week=planData.weeks[wi];
    if(y>250){doc.addPage();y=20;}
    // Week header
    doc.setFillColor(236,72,153);doc.rect(margin,y-4,pageW-margin*2,10,'F');
    doc.setTextColor(255,255,255);doc.setFontSize(13);doc.setFont(undefined,'bold');
    doc.text(tt('weekLabel')+' '+(wi+1),margin+3,y+3);
    if(week.progression){
      doc.setFontSize(9);doc.setFont(undefined,'italic');
      doc.text(week.progression,pageW-margin-3,y+3,{align:'right'});
    }
    y+=14;
    doc.setTextColor(0,0,0);doc.setFontSize(10);doc.setFont(undefined,'normal');
    for(var di=0;di<week.days.length;di++){
      var day=week.days[di];
      if(y>260){doc.addPage();y=20;}
      if(day.rest){
        doc.setFillColor(245,243,255);doc.rect(margin,y-3,pageW-margin*2,7,'F');
        doc.setTextColor(120,90,220);doc.setFont(undefined,'italic');doc.setFontSize(10);
        doc.text(day.name||tt('rest'),margin+3,y+2);
        y+=10;
        continue;
      }
      // Day header
      doc.setFillColor(245,243,255);doc.rect(margin,y-3,pageW-margin*2,8,'F');
      doc.setTextColor(139,92,246);doc.setFont(undefined,'bold');doc.setFontSize(11);
      doc.text(day.name||(tt('dayLabel')+' '+(di+1)),margin+3,y+2);
      if(day.focus){
        doc.setFont(undefined,'italic');doc.setFontSize(9);doc.setTextColor(100,100,100);
        doc.text(day.focus,pageW-margin-3,y+2,{align:'right'});
      }
      y+=10;
      // Exercises
      doc.setTextColor(0,0,0);doc.setFontSize(9);doc.setFont(undefined,'normal');
      var exes=day.exercises||[];
      for(var ei=0;ei<exes.length;ei++){
        var ex=exes[ei];
        if(y>275){doc.addPage();y=20;}
        doc.setFont(undefined,'bold');
        doc.text((ei+1)+'. '+ex.name,margin+3,y);
        doc.setFont(undefined,'normal');
        var detail=ex.sets+' x '+ex.reps;
        if(ex.rest)detail+='  rest '+ex.rest;
        doc.text(detail,pageW-margin-3,y,{align:'right'});
        y+=4.5;
        if(ex.notes){
          doc.setTextColor(100,100,100);doc.setFont(undefined,'italic');doc.setFontSize(8);
          var ln=doc.splitTextToSize(ex.notes,pageW-margin*2-10);
          for(var li=0;li<ln.length;li++){if(y>278){doc.addPage();y=20;}doc.text(ln[li],margin+8,y);y+=3.5;}
          doc.setTextColor(0,0,0);doc.setFont(undefined,'normal');doc.setFontSize(9);
        }
      }
      if(day.notes){
        if(y>278){doc.addPage();y=20;}
        doc.setFontSize(8);doc.setTextColor(80,80,80);doc.setFont(undefined,'italic');
        var nl=doc.splitTextToSize(day.notes,pageW-margin*2-6);
        for(var ni=0;ni<nl.length;ni++){if(y>280){doc.addPage();y=20;}doc.text(nl[ni],margin+5,y);y+=3.5;}
        doc.setTextColor(0,0,0);doc.setFont(undefined,'normal');doc.setFontSize(9);
      }
      y+=4;
    }
    y+=4;
  }
  doc.setTextColor(150,150,150);doc.setFontSize(8);doc.setFont(undefined,'italic');
  doc.text(tt('pdfFooter'),margin,290);
  doc.save('Training-'+(currentEntry.name||'client').replace(/ /g,'_')+'-'+today()+'.pdf');
}

// ===== UI Language =====
function setUILang(newLang){
  uiLang=newLang;
  document.querySelectorAll('.lang-btn').forEach(function(b){b.classList.toggle('on',b.dataset.lang===uiLang);});
  gid('ui-title').textContent=tt('title');
  gid('ui-subtitle').textContent=tt('subtitle');
  gid('coach-badge').textContent=tt('coachView');
  gid('btn-refresh').textContent=tt('refresh');
  gid('search').placeholder=tt('searchPh');
  gid('lbl-total').textContent=tt('total');
  gid('lbl-today').textContent=tt('today');
  gid('lbl-week').textContent=tt('thisWeek');
  gid('config-title').textContent=tt('aiConfig');
  gid('config-help').textContent=tt('aiHelp');
  gid('config-label').textContent=tt('aiKeyLabel');
  gid('config-save').textContent=tt('aiSave');
  gid('config-clear').textContent=tt('aiClear');
  document.querySelectorAll('.tab').forEach(function(t){
    if(t.dataset.tab==='details')t.textContent=tt('tabDetails');
    else if(t.dataset.tab==='setup')t.textContent=tt('tabSetup');
    else if(t.dataset.tab==='builder')t.textContent=tt('tabBuilder');
  });
  updateConfigStatus();
  renderList();
  if(currentEntry&&gid('modal').classList.contains('on'))renderTab();
}

function updateConfigStatus(){
  var s=gid('config-status');if(!s)return;
  s.textContent=hasApiKey()?tt('aiStatusOk'):tt('aiStatusNone');
  s.style.color=hasApiKey()?'var(--green)':'var(--mgray)';
}

// ===== EVENT HANDLERS =====
document.addEventListener('click',function(ev){
  var t=ev.target;
  if(t.dataset.id){openClient(t.dataset.id);return;}
  if(t.classList.contains('tab')){
    currentTab=t.dataset.tab;
    document.querySelectorAll('.tab').forEach(function(x){x.classList.toggle('on',x.dataset.tab===currentTab);});
    renderTab();
  }
});

document.addEventListener('DOMContentLoaded',function(){
  preloadLogo();
  loadEntries();
  gid('btn-refresh').addEventListener('click',loadEntries);
  gid('search').addEventListener('input',renderList);
  gid('modal-close').addEventListener('click',function(){gid('modal').classList.remove('on');});
  gid('modal').addEventListener('click',function(ev){if(ev.target===gid('modal'))gid('modal').classList.remove('on');});
  document.querySelectorAll('.lang-btn').forEach(function(b){
    b.addEventListener('click',function(){setUILang(b.dataset.lang);});
  });
  gid('btn-config').addEventListener('click',function(){
    gid('config-key').value=getApiKey();updateConfigStatus();
    gid('config-modal').classList.add('on');
  });
  gid('config-close').addEventListener('click',function(){gid('config-modal').classList.remove('on');});
  gid('config-modal').addEventListener('click',function(ev){if(ev.target===gid('config-modal'))gid('config-modal').classList.remove('on');});
  gid('config-save').addEventListener('click',function(){
    var v=gid('config-key').value.trim();setApiKey(v);updateConfigStatus();toast(tt('aiStatusSaved'));
  });
  gid('config-clear').addEventListener('click',function(){
    setApiKey('');gid('config-key').value='';updateConfigStatus();toast(tt('aiStatusCleared'));
  });
  setUILang('en');
});
