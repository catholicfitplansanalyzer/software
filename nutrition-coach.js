var API_URL='https://script.google.com/macros/s/AKfycbxW99Gb8tMCvktp9joQQlGtZ3ERuwJObSVIEEfShupY2V4C3hqKt9b4Ejksd-n3Qer9/exec';
var LOGO_URL='9E6DC135-0C7C-4D3C-A50D-143B7950C0E0.png';
var LOGO_DATA=null;
var entries=[];
var currentEntry=null;
var currentTab='details';
var macroState=null;
var mealPlan=null;
var uiLang='en';

// ===== TRANSLATIONS =====
var TC={
  en:{
    coachView:'Coach View',refresh:'Refresh',
    nutritionSubs:'Nutrition Submissions',subtitle:'All client nutrition forms - For coach use only',
    total:'Total Submissions',today:'Today',thisWeek:'This Week',
    searchPh:'Search by name or email...',
    noMatches:'No matches',noSubs:'No submissions yet',
    tryDiff:'Try a different search',shareLink:'Share your nutrition form link with clients',
    age:'Age',female:'Female',male:'Male',
    open:'Open',intakePdf:'Intake PDF',
    tabDetails:'Details',tabMacros:'Macros',tabMenu:'Meal Plan',
    secBasic:'Basic Information',name:'Name',dateSubmitted:'Date Submitted',ageSex:'Age / Sex',email:'Email',hw:'Height / Weight',goal:'Goal',activity:'Activity Level',
    secDiet:'Daily Diet',secSupp:'Supplements',secPath:'Pathologies / Injuries',secFood:'Food Preferences',
    proteins:'Proteins',carbs:'Carbs',vegetables:'Vegetables',fruits:'Fruits',fats:'Fats',
    secSch:'Schedule',mealsPerDay:'Meals per day',gymPerWeek:'Gym days per week',timePerSession:'Time per session',
    downloadIntake:'Download Intake PDF',
    formulaInfo:'<b>Formula:</b> Mifflin-St Jeor | <b>BMR:</b> %1 kcal | <b>TDEE:</b> %2 kcal | Adjustment for goal "%3" applied.',
    clientData:'Client Data (editable)',
    weight:'Weight (kg)',height:'Height (cm)',ageLbl:'Age',sex:'Sex',
    actSedentary:'Sedentary (1.2)',actLight:'Light (1.375)',actModerate:'Moderate (1.55)',actActive:'Active (1.725)',actVeryActive:'Very Active (1.9)',
    recalculate:'Recalculate',
    calcMacros:'Calculated Macros (tap numbers to edit)',
    calories:'Calories',protein:'Protein',fat:'Fat',
    kcalDay:'kcal/day',
    tip:'Tip: Adjust each macro manually if needed. Then go to "Meal Plan" to distribute them across meals.',
    saveBuild:'Save & Build Meal Plan',
    target:'Target',planned:'Planned',
    autoDist:'Auto-distribute macros',resuggest:'Re-suggest foods',exportMenu:'Export Meal Plan PDF',
    buildFirst:'Build the meal plan first',
    foodsPh:'Foods, portions, prep notes...',
    pdfTitleIntake:'Nutrition Intake',pdfSubIntake:'CatholicFitPlans - Coach Reference',
    pdfTitleMenu:'Nutrition Plan',pdfSubMenu:'CatholicFitPlans',
    pdfDailyTargets:'Daily Targets',pdfMealPlan:'Meal Plan',pdfAddNotes:'Additional Notes',
    pdfSupp:'Supplements:',pdfHealth:'Health Considerations:',
    pdfFooterIntake:'CatholicFitPlans - Nutrition Intake - For Coach Use Only',
    pdfFooterMenu:'CatholicFitPlans - Personalized Nutrition Plan',
    pdfDate:'Date: ',pdfGoal:'Goal: ',
    goalLabels:{weight_loss:'Weight Loss',muscle_gain:'Muscle Gain',body_building:'Body Building',toning:'Toning',endurance:'Endurance',strength:'Strength',mobility:'Mobility',general_health:'General Health'},
    activityLabels:{sedentary:'Sedentary',light:'Light',moderate:'Moderate',active:'Active',very_active:'Very Active'},
    mealLabels:{'2':'2 meals','3':'3 meals','4':'4 meals','5':'5 meals','6+':'6 or more meals'},
    gymLabels:{'1':'1 day','2':'2 days','3':'3 days','4':'4 days','5':'5 days','6':'6 days','7':'7 days'},
    timeLabels:{'30':'30 minutes','45':'45 minutes','60':'60 minutes','75':'75 minutes','90':'90 minutes','120':'120 minutes'}
  },
  es:{
    coachView:'Vista Coach',refresh:'Actualizar',
    nutritionSubs:'Cuestionarios de Nutricion',subtitle:'Todos los formularios de clientes - Solo para uso del coach',
    total:'Total enviados',today:'Hoy',thisWeek:'Esta semana',
    searchPh:'Buscar por nombre o email...',
    noMatches:'Sin resultados',noSubs:'Aun no hay envios',
    tryDiff:'Intenta otra busqueda',shareLink:'Comparte tu link del formulario con los clientes',
    age:'Edad',female:'Femenino',male:'Masculino',
    open:'Abrir',intakePdf:'PDF Intake',
    tabDetails:'Detalles',tabMacros:'Macros',tabMenu:'Plan de comidas',
    secBasic:'Informacion basica',name:'Nombre',dateSubmitted:'Fecha de envio',ageSex:'Edad / Sexo',email:'Email',hw:'Estatura / Peso',goal:'Objetivo',activity:'Nivel de actividad',
    secDiet:'Alimentacion diaria',secSupp:'Suplementos',secPath:'Patologias / Lesiones',secFood:'Preferencias alimentarias',
    proteins:'Proteinas',carbs:'Carbohidratos',vegetables:'Vegetales',fruits:'Frutas',fats:'Grasas',
    secSch:'Horario',mealsPerDay:'Comidas al dia',gymPerWeek:'Dias de gym por semana',timePerSession:'Tiempo por sesion',
    downloadIntake:'Descargar PDF del Intake',
    formulaInfo:'<b>Formula:</b> Mifflin-St Jeor | <b>BMR:</b> %1 kcal | <b>TDEE:</b> %2 kcal | Ajuste aplicado para objetivo "%3".',
    clientData:'Datos del cliente (editable)',
    weight:'Peso (kg)',height:'Estatura (cm)',ageLbl:'Edad',sex:'Sexo',
    actSedentary:'Sedentario (1.2)',actLight:'Ligero (1.375)',actModerate:'Moderado (1.55)',actActive:'Activo (1.725)',actVeryActive:'Muy activo (1.9)',
    recalculate:'Recalcular',
    calcMacros:'Macros calculados (toca para editar)',
    calories:'Calorias',protein:'Proteina',fat:'Grasa',
    kcalDay:'kcal/dia',
    tip:'Tip: Ajusta cada macro manualmente si lo necesitas. Luego ve a "Plan de comidas" para distribuirlos.',
    saveBuild:'Guardar y armar plan',
    target:'Objetivo',planned:'Planeado',
    autoDist:'Distribuir macros',resuggest:'Sugerir alimentos',exportMenu:'Exportar PDF del Plan',
    buildFirst:'Arma el plan primero',
    foodsPh:'Alimentos, porciones, notas...',
    pdfTitleIntake:'Cuestionario de Nutricion',pdfSubIntake:'CatholicFitPlans - Referencia del coach',
    pdfTitleMenu:'Plan Nutricional',pdfSubMenu:'CatholicFitPlans',
    pdfDailyTargets:'Objetivos Diarios',pdfMealPlan:'Plan de Comidas',pdfAddNotes:'Notas adicionales',
    pdfSupp:'Suplementos:',pdfHealth:'Consideraciones de salud:',
    pdfFooterIntake:'CatholicFitPlans - Cuestionario de Nutricion - Solo uso del coach',
    pdfFooterMenu:'CatholicFitPlans - Plan Nutricional Personalizado',
    pdfDate:'Fecha: ',pdfGoal:'Objetivo: ',
    goalLabels:{weight_loss:'Bajar de peso',muscle_gain:'Ganar musculo',body_building:'Body Building',toning:'Tonificacion',endurance:'Resistencia',strength:'Fuerza',mobility:'Movilidad',general_health:'Salud general'},
    activityLabels:{sedentary:'Sedentario',light:'Ligero',moderate:'Moderado',active:'Activo',very_active:'Muy activo'},
    mealLabels:{'2':'2 comidas','3':'3 comidas','4':'4 comidas','5':'5 comidas','6+':'6 o mas comidas'},
    gymLabels:{'1':'1 dia','2':'2 dias','3':'3 dias','4':'4 dias','5':'5 dias','6':'6 dias','7':'7 dias'},
    timeLabels:{'30':'30 minutos','45':'45 minutos','60':'60 minutos','75':'75 minutos','90':'90 minutos','120':'120 minutos'}
  }
};
function tc(k){return TC[uiLang][k];}
function tcReplace(k){var s=tc(k);for(var i=1;i<arguments.length;i++)s=s.replace('%'+i,arguments[i]);return s;}
function labelGoal(g){if(!g)return '-';var L=tc('goalLabels');if(L[g])return L[g];return g;}
function labelActivity(a){if(!a)return '-';var L=tc('activityLabels');if(L[a])return L[a];return a.replace(/_/g,' ');}
function labelMeal(m){if(!m)return '-';var L=tc('mealLabels');if(L[m])return L[m];return m;}
function labelGym(d){if(!d)return '-';var L=tc('gymLabels');if(L[d])return L[d];return d;}
function labelTime(t){if(!t)return '-';var L=tc('timeLabels');if(L[t])return L[t];return t;}

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
      entries=(data.entries||[]).reverse();
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
    gid('list').innerHTML='<div class="empty"><h3>'+(entries.length?tc('noMatches'):tc('noSubs'))+'</h3><p>'+(entries.length?tc('tryDiff'):tc('shareLink'))+'</p></div>';
    return;
  }
  var h='';
  for(var i=0;i<filtered.length;i++){
    var e=filtered[i];
    var langLbl=e.language==='es'?'ES':e.language==='en'?'EN':'';
    h+='<div class="client-card">'+
      '<div class="client-h">'+
        '<div class="client-info">'+
          '<div class="client-name">'+esc(e.name||'Unknown')+'</div>'+
          '<div class="client-meta">'+
            '<span>'+fmtDate(e.date)+'</span>'+
            (e.age?'<span>'+tc('age')+': '+esc(e.age)+'</span>':'')+
            (e.sex?'<span>'+esc(e.sex==='F'?tc('female'):tc('male'))+'</span>':'')+
            (e.email?'<span>'+esc(e.email)+'</span>':'')+
          '</div>'+
          (e.goal?'<div class="goal-badge">'+esc(labelGoal(e.goal))+'</div>':'')+
          (langLbl?'<div class="lang-badge">'+langLbl+'</div>':'')+
        '</div>'+
        '<div class="client-actions">'+
          '<button class="btn-view" data-id="'+esc(e.id)+'" type="button">'+tc('open')+'</button>'+
          '<button class="btn-pdf" data-pdf="'+esc(e.id)+'" type="button">'+tc('intakePdf')+'</button>'+
        '</div>'+
      '</div>'+
    '</div>';
  }
  gid('list').innerHTML=h;
}

function findEntry(id){for(var i=0;i<entries.length;i++)if(String(entries[i].id)===String(id))return entries[i];return null;}

// ===== MACRO CALCULATOR (Mifflin-St Jeor) =====
var ACTIVITY_MULT={sedentary:1.2,light:1.375,moderate:1.55,active:1.725,very_active:1.9};
var GOAL_ADJUST={
  // Canonical keys (new)
  weight_loss:-500,muscle_gain:300,body_building:300,toning:-200,
  endurance:0,strength:200,mobility:0,general_health:0,
  // Legacy display strings (backwards compatible)
  'Weight Loss':-500,'Bajar de peso':-500,
  'Muscle Gain':300,'Ganar musculo':300,'Ganar musculo':300,
  'Body Building':300,
  'Toning':-200,'Tonificacion':-200,'Tonificacion':-200,
  'Endurance':0,'Resistencia':0,
  'Strength':200,'Fuerza':200,
  'Mobility':0,'Movilidad':0,
  'General Health':0,'Salud general':0
};
// Helper for cutting goals (uses higher protein)
function isCuttingGoal(g){return g==='weight_loss'||g==='toning'||g==='Weight Loss'||g==='Bajar de peso'||g==='Toning'||g==='Tonificacion';}
function isLightGoal(g){return g==='general_health'||g==='mobility'||g==='General Health'||g==='Salud general'||g==='Mobility'||g==='Movilidad';}

function calcMacros(weight,height,age,sex,activity,goal){
  weight=parseFloat(weight)||70;
  height=parseFloat(height)||170;
  age=parseInt(age)||30;
  // Mifflin-St Jeor BMR
  var bmr=(sex==='F'?(10*weight+6.25*height-5*age-161):(10*weight+6.25*height-5*age+5));
  var mult=ACTIVITY_MULT[activity]||1.55;
  var tdee=bmr*mult;
  var adjust=GOAL_ADJUST[goal];if(adjust==null)adjust=0;
  var calories=Math.round(tdee+adjust);
  // Protein: higher for cutting, moderate for general, 2.0 default
  var proteinPerKg=2.0;
  if(isCuttingGoal(goal))proteinPerKg=2.2;
  else if(isLightGoal(goal))proteinPerKg=1.6;
  var protein=Math.round(weight*proteinPerKg);
  // Fat: 25% of calories
  var fat=Math.round((calories*0.25)/9);
  // Carbs: remaining
  var carbs=Math.round((calories-(protein*4+fat*9))/4);
  if(carbs<0)carbs=0;
  return {bmr:Math.round(bmr),tdee:Math.round(tdee),calories:calories,protein:protein,fat:fat,carbs:carbs};
}

// ===== Open client modal =====
function openClient(id){
  currentEntry=findEntry(id);
  if(!currentEntry)return;
  macroState=null;
  mealPlan=null;
  currentTab='details';
  gid('modal-name').textContent=currentEntry.name||'Unknown';
  document.querySelectorAll('.tab').forEach(function(t){t.classList.toggle('on',t.dataset.tab===currentTab);});
  renderTab();
  gid('modal').classList.add('on');
}

function renderTab(){
  var c=gid('tab-content');
  if(currentTab==='details')renderDetailsTab(c);
  else if(currentTab==='macros')renderMacrosTab(c);
  else if(currentTab==='menu')renderMenuTab(c);
}

function renderDetailsTab(c){
  var e=currentEntry;
  var h='';
  h+='<div class="modal-section"><h3>'+tc('secBasic')+'</h3>';
  h+='<div class="field"><div class="label">'+tc('name')+'</div><div class="value">'+esc(e.name||'-')+'</div></div>';
  h+='<div class="field"><div class="label">'+tc('dateSubmitted')+'</div><div class="value">'+fmtDate(e.date)+'</div></div>';
  if(e.age||e.sex)h+='<div class="field"><div class="label">'+tc('ageSex')+'</div><div class="value">'+esc(e.age||'-')+' / '+esc(e.sex==='F'?tc('female'):e.sex==='M'?tc('male'):'-')+'</div></div>';
  if(e.email)h+='<div class="field"><div class="label">'+tc('email')+'</div><div class="value">'+esc(e.email)+'</div></div>';
  if(e.height||e.weight)h+='<div class="field"><div class="label">'+tc('hw')+'</div><div class="value">'+esc(e.height||'-')+' cm / '+esc(e.weight||'-')+' kg</div></div>';
  if(e.goal)h+='<div class="field"><div class="label">'+tc('goal')+'</div><div class="value">'+esc(labelGoal(e.goal))+'</div></div>';
  if(e.activityLevel)h+='<div class="field"><div class="label">'+tc('activity')+'</div><div class="value">'+esc(labelActivity(e.activityLevel))+'</div></div>';
  h+='</div>';
  if(e.dailyDiet)h+='<div class="modal-section"><h3>'+tc('secDiet')+'</h3><div class="value">'+esc(e.dailyDiet)+'</div></div>';
  if(e.supplements)h+='<div class="modal-section"><h3>'+tc('secSupp')+'</h3><div class="value">'+esc(e.supplements)+'</div></div>';
  if(e.pathologies)h+='<div class="modal-section"><h3>'+tc('secPath')+'</h3><div class="value">'+esc(e.pathologies)+'</div></div>';
  h+='<div class="modal-section"><h3>'+tc('secFood')+'</h3>';
  if(e.proteins)h+='<div class="field"><div class="label">'+tc('proteins')+'</div><div class="value">'+esc(e.proteins)+'</div></div>';
  if(e.carbs)h+='<div class="field"><div class="label">'+tc('carbs')+'</div><div class="value">'+esc(e.carbs)+'</div></div>';
  if(e.vegetables)h+='<div class="field"><div class="label">'+tc('vegetables')+'</div><div class="value">'+esc(e.vegetables)+'</div></div>';
  if(e.fruits)h+='<div class="field"><div class="label">'+tc('fruits')+'</div><div class="value">'+esc(e.fruits)+'</div></div>';
  if(e.fats)h+='<div class="field"><div class="label">'+tc('fats')+'</div><div class="value">'+esc(e.fats)+'</div></div>';
  h+='</div>';
  h+='<div class="modal-section"><h3>'+tc('secSch')+'</h3>';
  if(e.mealsPerDay)h+='<div class="field"><div class="label">'+tc('mealsPerDay')+'</div><div class="value">'+esc(labelMeal(e.mealsPerDay))+'</div></div>';
  if(e.gymDays)h+='<div class="field"><div class="label">'+tc('gymPerWeek')+'</div><div class="value">'+esc(labelGym(e.gymDays))+'</div></div>';
  if(e.sessionTime)h+='<div class="field"><div class="label">'+tc('timePerSession')+'</div><div class="value">'+esc(labelTime(e.sessionTime))+'</div></div>';
  h+='</div>';
  h+='<button class="btn-secondary" data-pdf="'+esc(e.id)+'" type="button" style="width:100%;padding:14px">'+tc('downloadIntake')+'</button>';
  c.innerHTML=h;
}

function renderMacrosTab(c){
  var e=currentEntry;
  if(!macroState){
    macroState=calcMacros(e.weight,e.height,e.age,e.sex,e.activityLevel,e.goal);
  }
  var pPct=Math.round((macroState.protein*4/macroState.calories)*100);
  var fPct=Math.round((macroState.fat*9/macroState.calories)*100);
  var cPct=Math.round((macroState.carbs*4/macroState.calories)*100);
  var h='';
  h+='<div class="formula-info">'+tcReplace('formulaInfo',macroState.bmr,macroState.tdee,labelGoal(e.goal||'-'))+'</div>';
  h+='<div class="modal-section"><h3>'+tc('clientData')+'</h3>';
  h+='<div class="calc-row">'+
    '<div class="calc-fg"><label>'+tc('weight')+'</label><input id="mc-weight" type="number" step="0.1" value="'+esc(e.weight||70)+'"/></div>'+
    '<div class="calc-fg"><label>'+tc('height')+'</label><input id="mc-height" type="number" value="'+esc(e.height||170)+'"/></div>'+
    '<div class="calc-fg"><label>'+tc('ageLbl')+'</label><input id="mc-age" type="number" value="'+esc(e.age||30)+'"/></div>'+
  '</div>';
  var goalKeys=['weight_loss','muscle_gain','body_building','toning','endurance','strength','mobility','general_health'];
  var goalOpts=goalKeys.map(function(g){return '<option value="'+g+'" '+(e.goal===g?'selected':'')+'>'+labelGoal(g)+'</option>';}).join('');
  h+='<div class="calc-row">'+
    '<div class="calc-fg"><label>'+tc('sex')+'</label><select id="mc-sex"><option value="F" '+(e.sex==='F'?'selected':'')+'>'+tc('female')+'</option><option value="M" '+(e.sex==='M'?'selected':'')+'>'+tc('male')+'</option></select></div>'+
    '<div class="calc-fg"><label>'+tc('activity')+'</label><select id="mc-act">'+
      '<option value="sedentary" '+(e.activityLevel==='sedentary'?'selected':'')+'>'+tc('actSedentary')+'</option>'+
      '<option value="light" '+(e.activityLevel==='light'?'selected':'')+'>'+tc('actLight')+'</option>'+
      '<option value="moderate" '+(e.activityLevel==='moderate'?'selected':'')+'>'+tc('actModerate')+'</option>'+
      '<option value="active" '+(e.activityLevel==='active'?'selected':'')+'>'+tc('actActive')+'</option>'+
      '<option value="very_active" '+(e.activityLevel==='very_active'?'selected':'')+'>'+tc('actVeryActive')+'</option>'+
    '</select></div>'+
    '<div class="calc-fg"><label>'+tc('goal')+'</label><select id="mc-goal">'+goalOpts+'</select></div>'+
  '</div>';
  h+='<button class="btn-secondary" id="btn-recalc" type="button">'+tc('recalculate')+'</button>';
  h+='</div>';
  h+='<div class="modal-section"><h3>'+tc('calcMacros')+'</h3>';
  h+='<div class="macro-grid">'+
    '<div class="macro-card cal"><div class="macro-num"><input id="m-cal" type="number" value="'+macroState.calories+'"/></div><div class="macro-lbl">'+tc('calories')+'</div><div class="macro-pct">'+tc('kcalDay')+'</div></div>'+
    '<div class="macro-card pro"><div class="macro-num"><input id="m-pro" type="number" value="'+macroState.protein+'"/></div><div class="macro-lbl">'+tc('protein')+'</div><div class="macro-pct">'+pPct+'% &middot; '+(macroState.protein*4)+' kcal</div></div>'+
    '<div class="macro-card fat"><div class="macro-num"><input id="m-fat" type="number" value="'+macroState.fat+'"/></div><div class="macro-lbl">'+tc('fat')+'</div><div class="macro-pct">'+fPct+'% &middot; '+(macroState.fat*9)+' kcal</div></div>'+
    '<div class="macro-card car"><div class="macro-num"><input id="m-car" type="number" value="'+macroState.carbs+'"/></div><div class="macro-lbl">'+tc('carbs')+'</div><div class="macro-pct">'+cPct+'% &middot; '+(macroState.carbs*4)+' kcal</div></div>'+
  '</div>';
  h+='<div class="warn">'+tc('tip')+'</div>';
  h+='<button class="btn-primary" id="btn-save-macros" type="button" style="width:100%">'+tc('saveBuild')+'</button>';
  h+='</div>';
  c.innerHTML=h;
  // Listeners
  gid('btn-recalc').addEventListener('click',function(){
    var w=gid('mc-weight').value,he=gid('mc-height').value,ag=gid('mc-age').value,sx=gid('mc-sex').value,act=gid('mc-act').value,go=gid('mc-goal').value;
    macroState=calcMacros(w,he,ag,sx,act,go);
    // Update entry data locally so other tabs use it
    currentEntry.weight=w;currentEntry.height=he;currentEntry.age=ag;currentEntry.sex=sx;currentEntry.activityLevel=act;currentEntry.goal=go;
    renderTab();
  });
  // Live update on macro edits
  ['m-cal','m-pro','m-fat','m-car'].forEach(function(id){
    gid(id).addEventListener('change',function(){
      macroState.calories=parseInt(gid('m-cal').value)||0;
      macroState.protein=parseInt(gid('m-pro').value)||0;
      macroState.fat=parseInt(gid('m-fat').value)||0;
      macroState.carbs=parseInt(gid('m-car').value)||0;
      renderTab();
    });
  });
  gid('btn-save-macros').addEventListener('click',function(){
    mealPlan=null; // force rebuild
    currentTab='menu';
    document.querySelectorAll('.tab').forEach(function(t){t.classList.toggle('on',t.dataset.tab===currentTab);});
    renderTab();
  });
}

function getMealsCount(str){
  if(!str)return 4;
  var m=String(str).match(/\d+/);
  if(m)return parseInt(m[0]);
  return 4;
}

function buildInitialMealPlan(){
  var e=currentEntry;
  var nMeals=getMealsCount(e.mealsPerDay);
  // Distribute macros across meals
  // Typical: 25/15/30/15/15 etc. We use even distribution as default
  var distributions={
    2:[0.45,0.55],
    3:[0.30,0.40,0.30],
    4:[0.25,0.20,0.30,0.25],
    5:[0.25,0.15,0.30,0.10,0.20],
    6:[0.20,0.15,0.25,0.10,0.20,0.10]
  };
  var dist=distributions[nMeals]||distributions[4];
  var names=getMealNames(nMeals,e.language);
  var meals=[];
  for(var i=0;i<nMeals;i++){
    var pct=dist[i]||(1/nMeals);
    meals.push({
      name:names[i]||('Meal '+(i+1)),
      cal:Math.round(macroState.calories*pct),
      pro:Math.round(macroState.protein*pct),
      fat:Math.round(macroState.fat*pct),
      car:Math.round(macroState.carbs*pct),
      foods:generateSuggestion(i,nMeals,e)
    });
  }
  return {meals:meals};
}

function getMealNames(n,lang){
  // Use coach UI language for meal names
  var L=lang||uiLang;
  var es={
    2:['Almuerzo','Cena'],
    3:['Desayuno','Almuerzo','Cena'],
    4:['Desayuno','Almuerzo','Merienda','Cena'],
    5:['Desayuno','Media manana','Almuerzo','Merienda','Cena'],
    6:['Desayuno','Media manana','Almuerzo','Merienda','Cena','Pre-dormir']
  };
  var en={
    2:['Lunch','Dinner'],
    3:['Breakfast','Lunch','Dinner'],
    4:['Breakfast','Lunch','Snack','Dinner'],
    5:['Breakfast','Mid-morning','Lunch','Snack','Dinner'],
    6:['Breakfast','Mid-morning','Lunch','Snack','Dinner','Pre-bed']
  };
  var src=L==='es'?es:en;
  return src[n]||src[4];
}

function parseList(str){
  if(!str)return [];
  return String(str).split(',').map(function(s){return s.trim();}).filter(function(s){return s;});
}

function generateSuggestion(idx,total,e){
  var proteins=parseList(e.proteins);
  var carbs=parseList(e.carbs);
  var veggies=parseList(e.vegetables);
  var fruits=parseList(e.fruits);
  var fats=parseList(e.fats);
  // Round-robin pick
  function pick(arr,i){if(!arr.length)return '';return arr[i%arr.length];}
  var p=pick(proteins,idx);
  var c=pick(carbs,idx);
  var v=pick(veggies,idx);
  var f=pick(fruits,idx);
  var fa=pick(fats,idx);
  // First meal: protein + carb + fruit
  // Mid meals: protein + carb + veggie
  // Last meal: protein + veggie + fat
  // Snack-style: fruit + protein OR fats
  var isLang=(e.language==='es');
  var lblP=isLang?'Proteina: ':'Protein: ';
  var lblC=isLang?'Carbo: ':'Carb: ';
  var lblV=isLang?'Vegetal: ':'Veggie: ';
  var lblF=isLang?'Fruta: ':'Fruit: ';
  var lblFa=isLang?'Grasa: ':'Fat: ';
  var parts=[];
  if(p)parts.push(lblP+p);
  if(c)parts.push(lblC+c);
  if(idx===0&&f)parts.push(lblF+f);
  if(idx>0&&idx<total-1&&v)parts.push(lblV+v);
  if(idx===total-1&&v)parts.push(lblV+v);
  if(fa&&(idx===total-1||idx===0))parts.push(lblFa+fa);
  return parts.join('\n');
}

function renderMenuTab(c){
  var e=currentEntry;
  if(!macroState){macroState=calcMacros(e.weight,e.height,e.age,e.sex,e.activityLevel,e.goal);}
  if(!mealPlan)mealPlan=buildInitialMealPlan();
  var totalCal=0,totalPro=0,totalFat=0,totalCar=0;
  for(var i=0;i<mealPlan.meals.length;i++){var m=mealPlan.meals[i];totalCal+=m.cal;totalPro+=m.pro;totalFat+=m.fat;totalCar+=m.car;}
  var h='';
  h+='<div class="formula-info"><b>'+tc('target')+':</b> '+macroState.calories+' kcal | P: '+macroState.protein+'g | F: '+macroState.fat+'g | C: '+macroState.carbs+'g'+
    '<br/><b>'+tc('planned')+':</b> '+totalCal+' kcal | P: '+totalPro+'g | F: '+totalFat+'g | C: '+totalCar+'g</div>';
  // Quick-add suggestion pills from client favorites
  var allFavs=[].concat(parseList(e.proteins),parseList(e.carbs),parseList(e.vegetables),parseList(e.fruits),parseList(e.fats));
  for(var mi=0;mi<mealPlan.meals.length;mi++){
    var meal=mealPlan.meals[mi];
    h+='<div class="meal-card">';
    h+='<div class="meal-h">'+
      '<div class="meal-name"><input data-mi="'+mi+'" data-fld="name" value="'+esc(meal.name)+'"/></div>'+
      '<div class="meal-macros">'+
        '<span class="mc-cal"><input data-mi="'+mi+'" data-fld="cal" type="number" value="'+meal.cal+'" style="width:50px;background:transparent;border:0;color:var(--pink);font-family:Outfit;font-weight:700;font-size:11px"/> kcal</span>'+
        '<span class="mc-pro">P: <input data-mi="'+mi+'" data-fld="pro" type="number" value="'+meal.pro+'" style="width:40px;background:transparent;border:0;color:var(--teal);font-family:Outfit;font-weight:700;font-size:11px"/>g</span>'+
        '<span class="mc-fat">F: <input data-mi="'+mi+'" data-fld="fat" type="number" value="'+meal.fat+'" style="width:40px;background:transparent;border:0;color:var(--gold);font-family:Outfit;font-weight:700;font-size:11px"/>g</span>'+
        '<span class="mc-car">C: <input data-mi="'+mi+'" data-fld="car" type="number" value="'+meal.car+'" style="width:40px;background:transparent;border:0;color:#a78bfa;font-family:Outfit;font-weight:700;font-size:11px"/>g</span>'+
      '</div>'+
    '</div>';
    h+='<div class="meal-body"><textarea data-mi="'+mi+'" data-fld="foods" placeholder="'+tc('foodsPh')+'">'+esc(meal.foods)+'</textarea>';
    if(allFavs.length){
      h+='<div class="suggestion-pills">';
      for(var fi=0;fi<allFavs.length;fi++){
        h+='<span class="sug-pill" data-mi="'+mi+'" data-food="'+esc(allFavs[fi])+'">+ '+esc(allFavs[fi])+'</span>';
      }
      h+='</div>';
    }
    h+='</div></div>';
  }
  h+='<div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap">';
  h+='<button class="btn-secondary" id="btn-redistribute" type="button">'+tc('autoDist')+'</button>';
  h+='<button class="btn-secondary" id="btn-regen-foods" type="button">'+tc('resuggest')+'</button>';
  h+='<button class="btn-primary" id="btn-export-menu" type="button" style="flex:1;min-width:200px">'+tc('exportMenu')+'</button>';
  h+='</div>';
  c.innerHTML=h;
  // listeners
  c.querySelectorAll('input,textarea').forEach(function(el){
    if(!el.dataset.mi)return;
    el.addEventListener('change',function(){updateMealField(el);});
    if(el.tagName==='TEXTAREA')el.addEventListener('input',function(){updateMealField(el);});
  });
  c.querySelectorAll('.sug-pill').forEach(function(el){
    el.addEventListener('click',function(){
      var mi=parseInt(el.dataset.mi);
      var food=el.dataset.food;
      var ta=c.querySelector('textarea[data-mi="'+mi+'"]');
      ta.value=(ta.value?ta.value+'\n':'')+food;
      mealPlan.meals[mi].foods=ta.value;
    });
  });
  gid('btn-redistribute').addEventListener('click',function(){mealPlan=buildInitialMealPlan();renderTab();});
  gid('btn-regen-foods').addEventListener('click',function(){
    for(var i=0;i<mealPlan.meals.length;i++)mealPlan.meals[i].foods=generateSuggestion(i,mealPlan.meals.length,currentEntry);
    renderTab();
  });
  gid('btn-export-menu').addEventListener('click',exportMealPlanPDF);
}

function updateMealField(el){
  var mi=parseInt(el.dataset.mi);
  var fld=el.dataset.fld;
  var v=el.value;
  if(fld==='cal'||fld==='pro'||fld==='fat'||fld==='car')v=parseInt(v)||0;
  mealPlan.meals[mi][fld]=v;
}

// ===== PDF EXPORTS =====
function pdfHeader(doc,title,subtitle){
  var pageW=210,margin=15;
  for(var gy=0;gy<32;gy++){var gp=gy/32;var r=Math.round(11+(50-11)*gp),gC=Math.round(10+(30-10)*gp),b=Math.round(30+(90-30)*gp);doc.setFillColor(r,gC,b);doc.rect(0,gy,pageW,1.5,'F');}
  if(LOGO_DATA){try{doc.addImage(LOGO_DATA,'PNG',margin,3,26,26);}catch(er){}}
  doc.setTextColor(255,255,255);doc.setFontSize(18);doc.setFont(undefined,'bold');
  doc.text(title,margin+30,15);
  doc.setTextColor(220,200,255);doc.setFontSize(10);doc.setFont(undefined,'normal');
  doc.text(subtitle,margin+30,22);
}

function exportIntakePDF(id){
  var e=findEntry(id);if(!e)return;
  var jsPDF=window.jspdf.jsPDF;var doc=new jsPDF();
  var pageW=210,margin=15,y=20;
  pdfHeader(doc,tc('pdfTitleIntake'),tc('pdfSubIntake'));
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
  section(tc('secBasic'));
  if(e.height||e.weight)paragraph(tc('hw'),(e.height?e.height+' cm':'')+(e.weight?' / '+e.weight+' kg':''));
  if(e.goal)paragraph(tc('goal'),labelGoal(e.goal));
  if(e.activityLevel)paragraph(tc('activity'),labelActivity(e.activityLevel));
  section(tc('secDiet'));
  paragraph(tc('secDiet'),e.dailyDiet||'-');
  section(tc('secSupp'));
  paragraph(tc('secSupp'),e.supplements||'-');
  section(tc('secPath'));
  paragraph(tc('secPath'),e.pathologies||'-');
  section(tc('secFood'));
  paragraph(tc('proteins'),e.proteins);
  paragraph(tc('carbs'),e.carbs);
  paragraph(tc('vegetables'),e.vegetables);
  paragraph(tc('fruits'),e.fruits);
  paragraph(tc('fats'),e.fats);
  section(tc('secSch'));
  paragraph(tc('mealsPerDay'),labelMeal(e.mealsPerDay));
  paragraph(tc('gymPerWeek'),labelGym(e.gymDays));
  paragraph(tc('timePerSession'),labelTime(e.sessionTime));
  doc.setTextColor(150,150,150);doc.setFontSize(8);doc.setFont(undefined,'italic');
  doc.text(tc('pdfFooterIntake'),margin,290);
  doc.save('Nutrition-'+(e.name||'client').replace(/ /g,'_')+'-'+(e.date||today())+'.pdf');
}

function exportMealPlanPDF(){
  var e=currentEntry;
  if(!mealPlan||!macroState){alert(tc('buildFirst'));return;}
  var jsPDF=window.jspdf.jsPDF;var doc=new jsPDF();
  var pageW=210,margin=15,y=20;
  // Use UI language for client-facing PDF (so coach can choose)
  var isEs=(uiLang==='es');
  pdfHeader(doc,tc('pdfTitleMenu'),tc('pdfSubMenu'));
  y=42;
  doc.setTextColor(0,0,0);doc.setFontSize(15);doc.setFont(undefined,'bold');
  doc.text(e.name||'Client',margin,y);y+=6;
  doc.setFontSize(10);doc.setFont(undefined,'normal');
  doc.text(tc('pdfDate')+fmtDate(today()),margin,y);
  if(e.goal)doc.text(tc('pdfGoal')+labelGoal(e.goal),margin+80,y);
  y+=10;
  doc.setFillColor(30,28,74);doc.rect(margin,y-4,pageW-margin*2,8,'F');
  doc.setTextColor(255,255,255);doc.setFontSize(11);doc.setFont(undefined,'bold');
  doc.text(tc('pdfDailyTargets'),margin+3,y+2);y+=12;
  doc.setTextColor(0,0,0);
  // Macro boxes
  var bw=(pageW-margin*2-9)/4;
  var labels=[tc('calories'),tc('protein'),tc('fat'),tc('carbs')];
  var vals=[macroState.calories+' kcal',macroState.protein+' g',macroState.fat+' g',macroState.carbs+' g'];
  for(var bi=0;bi<4;bi++){
    var bx=margin+bi*(bw+3);
    doc.setFillColor(245,243,255);doc.rect(bx,y,bw,16,'F');
    doc.setDrawColor(139,92,246);doc.setLineWidth(0.3);doc.rect(bx,y,bw,16);
    doc.setTextColor(139,92,246);doc.setFontSize(8);doc.setFont(undefined,'bold');
    doc.text(labels[bi].toUpperCase(),bx+bw/2,y+5,{align:'center'});
    doc.setTextColor(0,0,0);doc.setFontSize(12);doc.setFont(undefined,'bold');
    doc.text(vals[bi],bx+bw/2,y+12,{align:'center'});
  }
  y+=22;
  doc.setFont(undefined,'normal');doc.setFontSize(10);
  // Meals
  doc.setFillColor(236,72,153);doc.rect(margin,y-4,pageW-margin*2,8,'F');
  doc.setTextColor(255,255,255);doc.setFontSize(11);doc.setFont(undefined,'bold');
  doc.text(tc('pdfMealPlan'),margin+3,y+2);y+=10;
  doc.setTextColor(0,0,0);
  for(var i=0;i<mealPlan.meals.length;i++){
    var m=mealPlan.meals[i];
    if(y>250){doc.addPage();y=20;}
    // Meal header
    doc.setFillColor(245,243,255);doc.rect(margin,y-3,pageW-margin*2,7,'F');
    doc.setTextColor(139,92,246);doc.setFont(undefined,'bold');doc.setFontSize(11);
    doc.text((i+1)+'. '+m.name,margin+3,y+2);
    doc.setFontSize(9);doc.setTextColor(100,100,100);
    var macroLine=m.cal+' kcal  |  P: '+m.pro+'g  F: '+m.fat+'g  C: '+m.car+'g';
    doc.text(macroLine,pageW-margin-3,y+2,{align:'right'});
    y+=9;
    doc.setTextColor(0,0,0);doc.setFont(undefined,'normal');doc.setFontSize(10);
    if(m.foods){
      var lines=doc.splitTextToSize(m.foods,pageW-margin*2-6);
      for(var li=0;li<lines.length;li++){
        if(y>278){doc.addPage();y=20;}
        doc.text(lines[li],margin+5,y);y+=4.5;
      }
    }
    y+=5;
  }
  // Supplements & pathologies info
  if(e.supplements||e.pathologies){
    if(y>250){doc.addPage();y=20;}
    doc.setFillColor(30,28,74);doc.rect(margin,y-4,pageW-margin*2,8,'F');
    doc.setTextColor(255,255,255);doc.setFontSize(11);doc.setFont(undefined,'bold');
    doc.text(tc('pdfAddNotes'),margin+3,y+2);y+=10;
    doc.setTextColor(0,0,0);doc.setFontSize(10);doc.setFont(undefined,'normal');
    if(e.supplements){
      doc.setFont(undefined,'bold');doc.text(tc('pdfSupp'),margin+3,y);y+=5;
      doc.setFont(undefined,'normal');
      var ls=doc.splitTextToSize(e.supplements,pageW-margin*2-6);
      for(var s=0;s<ls.length;s++){if(y>278){doc.addPage();y=20;}doc.text(ls[s],margin+5,y);y+=4.5;}
      y+=3;
    }
    if(e.pathologies&&e.pathologies.toLowerCase().indexOf('ninguna')<0&&e.pathologies.toLowerCase().indexOf('none')<0){
      doc.setFont(undefined,'bold');doc.text(tc('pdfHealth'),margin+3,y);y+=5;
      doc.setFont(undefined,'normal');
      var lp=doc.splitTextToSize(e.pathologies,pageW-margin*2-6);
      for(var p=0;p<lp.length;p++){if(y>278){doc.addPage();y=20;}doc.text(lp[p],margin+5,y);y+=4.5;}
    }
  }
  doc.setTextColor(150,150,150);doc.setFontSize(8);doc.setFont(undefined,'italic');
  doc.text(tc('pdfFooterMenu'),margin,290);
  doc.save('MealPlan-'+(e.name||'client').replace(/ /g,'_')+'-'+today()+'.pdf');
}

// ===== Event handlers =====
document.addEventListener('click',function(ev){
  var t=ev.target;
  if(t.dataset.id){openClient(t.dataset.id);return;}
  if(t.dataset.pdf){exportIntakePDF(t.dataset.pdf);return;}
  if(t.classList.contains('tab')){
    currentTab=t.dataset.tab;
    document.querySelectorAll('.tab').forEach(function(x){x.classList.toggle('on',x.dataset.tab===currentTab);});
    renderTab();
  }
});

function setUILang(newLang){
  uiLang=newLang;
  document.querySelectorAll('.lang-btn').forEach(function(b){b.classList.toggle('on',b.dataset.lang===uiLang);});
  // Update static UI texts
  gid('ui-title').textContent=tc('nutritionSubs');
  gid('ui-subtitle').textContent=tc('subtitle');
  gid('coach-badge').textContent=tc('coachView');
  gid('btn-refresh').textContent=tc('refresh');
  gid('search').placeholder=tc('searchPh');
  document.querySelectorAll('.stat-label').forEach(function(el,i){
    if(i===0)el.textContent=tc('total');
    else if(i===1)el.textContent=tc('today');
    else if(i===2)el.textContent=tc('thisWeek');
  });
  document.querySelectorAll('.tab').forEach(function(t){
    if(t.dataset.tab==='details')t.textContent=tc('tabDetails');
    else if(t.dataset.tab==='macros')t.textContent=tc('tabMacros');
    else if(t.dataset.tab==='menu')t.textContent=tc('tabMenu');
  });
  document.documentElement.lang=uiLang;
  renderList();
  if(currentEntry&&gid('modal').classList.contains('on'))renderTab();
}

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
  setUILang('en');
});
