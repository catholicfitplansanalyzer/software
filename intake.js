var API_URL='https://script.google.com/macros/s/AKfycbzJJarSgOQ2q6DFQIVm-FfrXITCn7NNStcdRnf0szf9HRZIKpIu5a9Lak-XYGn0cQz_/exec';
var LOGO_URL='9E6DC135-0C7C-4D3C-A50D-143B7950C0E0.png';
var LOGO_DATA=null;

function gid(id){return document.getElementById(id);}
function today(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function fmtDate(d){if(!d)return '';var p=String(d).split('-');if(p.length!==3)return String(d);var m=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];return m[parseInt(p[1])-1]+' '+parseInt(p[2])+', '+p[0];}
function setSync(s,m){var x=gid('sync-status');x.className='sync-status '+(s||'');x.textContent=m;}
function toast(m,err){var t=gid('toast');t.textContent=m;t.className='toast on'+(err?' error':'');setTimeout(function(){t.classList.remove('on');},3000);}

function preloadLogo(){
  var img=new Image();img.crossOrigin='anonymous';
  img.onload=function(){try{var c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;c.getContext('2d').drawImage(img,0,0);LOGO_DATA=c.toDataURL('image/png');}catch(e){}};
  img.src=LOGO_URL+'?t='+Date.now();
}

// ===== SVG Body Figure with highlighted area =====
// area = which body part to highlight: 'wristL','wristR','shoulderL','shoulderR','hip','ankleL','ankleR','quadL','quadR','hamL','hamR','lowback','full','core','calf','arm','leg'
function bodyFigure(area){
  var svg='<svg viewBox="0 0 140 170" xmlns="http://www.w3.org/2000/svg">';
  var hi='url(#grad)';
  svg+='<defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ec4899"/><stop offset="100%" stop-color="#8b5cf6"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="2.5"/></filter></defs>';
  // Base body (faint)
  var b='rgba(139,92,246,0.18)';var bs='rgba(139,92,246,0.4)';
  // head
  svg+='<circle cx="70" cy="18" r="11" fill="'+(area==='full'?hi:b)+'" stroke="'+bs+'" stroke-width="1"/>';
  // neck
  svg+='<rect x="66" y="28" width="8" height="6" fill="'+b+'" stroke="'+bs+'" stroke-width="1"/>';
  // torso
  svg+='<path d="M52 36 Q50 40 50 55 L52 90 Q54 98 60 100 L80 100 Q86 98 88 90 L90 55 Q90 40 88 36 Q70 32 52 36 Z" fill="'+(area==='full'||area==='core'?hi:b)+'" stroke="'+bs+'" stroke-width="1"/>';
  // shoulders L/R
  svg+='<ellipse cx="48" cy="40" rx="7" ry="6" fill="'+(area==='shoulderL'?hi:b)+'" stroke="'+(area==='shoulderL'?'#fff':bs)+'" stroke-width="'+(area==='shoulderL'?'1.5':'1')+'"/>';
  svg+='<ellipse cx="92" cy="40" rx="7" ry="6" fill="'+(area==='shoulderR'?hi:b)+'" stroke="'+(area==='shoulderR'?'#fff':bs)+'" stroke-width="'+(area==='shoulderR'?'1.5':'1')+'"/>';
  // upper arms
  svg+='<rect x="42" y="42" width="9" height="22" rx="4" fill="'+(area==='shoulderL'||area==='arm'?hi:b)+'" stroke="'+bs+'" stroke-width="1"/>';
  svg+='<rect x="89" y="42" width="9" height="22" rx="4" fill="'+(area==='shoulderR'||area==='arm'?hi:b)+'" stroke="'+bs+'" stroke-width="1"/>';
  // forearms
  svg+='<rect x="42" y="64" width="8" height="22" rx="4" fill="'+b+'" stroke="'+bs+'" stroke-width="1"/>';
  svg+='<rect x="90" y="64" width="8" height="22" rx="4" fill="'+b+'" stroke="'+bs+'" stroke-width="1"/>';
  // wrists L/R
  svg+='<rect x="40" y="84" width="10" height="6" rx="2" fill="'+(area==='wristL'?hi:b)+'" stroke="'+(area==='wristL'?'#fff':bs)+'" stroke-width="'+(area==='wristL'?'1.5':'1')+'"/>';
  svg+='<rect x="90" y="84" width="10" height="6" rx="2" fill="'+(area==='wristR'?hi:b)+'" stroke="'+(area==='wristR'?'#fff':bs)+'" stroke-width="'+(area==='wristR'?'1.5':'1')+'"/>';
  // hands
  svg+='<circle cx="45" cy="93" r="3" fill="'+(area==='wristL'?hi:b)+'" stroke="'+bs+'" stroke-width="1"/>';
  svg+='<circle cx="95" cy="93" r="3" fill="'+(area==='wristR'?hi:b)+'" stroke="'+bs+'" stroke-width="1"/>';
  // hips
  svg+='<path d="M56 100 L84 100 L86 110 L54 110 Z" fill="'+(area==='hip'||area==='lowback'?hi:b)+'" stroke="'+bs+'" stroke-width="1"/>';
  // thighs L/R (quad area)
  svg+='<rect x="56" y="110" width="12" height="28" rx="5" fill="'+(area==='quadL'||area==='hamL'?hi:b)+'" stroke="'+(area==='quadL'||area==='hamL'?'#fff':bs)+'" stroke-width="'+(area==='quadL'||area==='hamL'?'1.5':'1')+'"/>';
  svg+='<rect x="72" y="110" width="12" height="28" rx="5" fill="'+(area==='quadR'||area==='hamR'?hi:b)+'" stroke="'+(area==='quadR'||area==='hamR'?'#fff':bs)+'" stroke-width="'+(area==='quadR'||area==='hamR'?'1.5':'1')+'"/>';
  // knees
  svg+='<circle cx="62" cy="140" r="3" fill="'+b+'" stroke="'+bs+'" stroke-width="1"/>';
  svg+='<circle cx="78" cy="140" r="3" fill="'+b+'" stroke="'+bs+'" stroke-width="1"/>';
  // shins
  svg+='<rect x="58" y="143" width="8" height="20" rx="3" fill="'+b+'" stroke="'+bs+'" stroke-width="1"/>';
  svg+='<rect x="74" y="143" width="8" height="20" rx="3" fill="'+b+'" stroke="'+bs+'" stroke-width="1"/>';
  // ankles L/R
  svg+='<ellipse cx="62" cy="164" rx="5" ry="3" fill="'+(area==='ankleL'?hi:b)+'" stroke="'+(area==='ankleL'?'#fff':bs)+'" stroke-width="'+(area==='ankleL'?'1.5':'1')+'"/>';
  svg+='<ellipse cx="78" cy="164" rx="5" ry="3" fill="'+(area==='ankleR'?hi:b)+'" stroke="'+(area==='ankleR'?'#fff':bs)+'" stroke-width="'+(area==='ankleR'?'1.5':'1')+'"/>';
  // glow effect on highlighted area
  if(area&&area!=='full'){
    svg+='<text x="70" y="10" text-anchor="middle" fill="#ec4899" font-size="7" font-family="Outfit" font-weight="800">'+(area.indexOf('L')>0&&area.indexOf('R')<0?'LEFT':area.indexOf('R')>0?'RIGHT':'')+'</text>';
  }
  svg+='</svg>';
  return svg;
}

// Movement test definitions with body areas to highlight
var UBMT_TESTS=[
  {key:'u0',name:'Wrist Extension Left',area:'wristL',desc:'Extend the left wrist back as far as possible'},
  {key:'u1',name:'Wrist Extension Right',area:'wristR',desc:'Extend the right wrist back as far as possible'},
  {key:'u2',name:'Shoulder Abduction Left',area:'shoulderL',desc:'Raise left arm out to the side over head'},
  {key:'u3',name:'Shoulder Abduction Right',area:'shoulderR',desc:'Raise right arm out to the side over head'},
  {key:'u4',name:'Shoulder Flexion Left',area:'shoulderL',desc:'Raise left arm forward and up overhead'},
  {key:'u5',name:'Shoulder Flexion Right',area:'shoulderR',desc:'Raise right arm forward and up overhead'},
  {key:'u6',name:'Wrist Flexion',area:'wristL',desc:'Flex wrists forward'}
];
var LBMT_TESTS=[
  {key:'l0',name:'Standing Lumbo Pelvic Flexion',area:'lowback',desc:'Bend forward at the waist with straight legs'},
  {key:'l1',name:'Ankle Dorsiflexion Left',area:'ankleL',desc:'Knee to wall test, left ankle'},
  {key:'l2',name:'Ankle Dorsiflexion Right',area:'ankleR',desc:'Knee to wall test, right ankle'},
  {key:'l3',name:'Kneeling Butt to Heel',area:'quadL',desc:'Kneel and sit back to touch heels with glutes'},
  {key:'l4',name:'Prone Butt to Heel Left',area:'quadL',desc:'Lying face down, bring left heel to glute'},
  {key:'l5',name:'Prone Butt to Heel Right',area:'quadR',desc:'Lying face down, bring right heel to glute'},
  {key:'l6',name:'Supine Hip Flexion Left',area:'hamL',desc:'On back, raise left leg straight up'},
  {key:'l7',name:'Supine Hip Flexion Right',area:'hamR',desc:'On back, raise right leg straight up'}
];

var EVAL_ROUTINES={
  young:{label:'Young Adults (18-35)',exercises:[
    {name:'Burpees',unit:'reps in 60s',area:'full'},
    {name:'Squats',unit:'reps in 60s',area:'quadL'},
    {name:'Push-ups',unit:'reps in 60s',area:'shoulderL'},
    {name:'Plank',unit:'max seconds',area:'core'},
    {name:'Vertical Jump',unit:'cm',area:'quadL'},
    {name:'Single Leg Balance (eyes closed)',unit:'seconds',area:'ankleL'},
    {name:'Sit & Reach',unit:'cm past toes',area:'hamL'}
  ]},
  adult:{label:'Adults (36-55)',exercises:[
    {name:'Squats',unit:'reps in 60s',area:'quadL'},
    {name:'Push-ups (knees ok)',unit:'reps in 60s',area:'shoulderL'},
    {name:'Plank',unit:'max seconds',area:'core'},
    {name:'Step-ups (40cm)',unit:'reps in 60s',area:'quadR'},
    {name:'Single Leg Balance (eyes open)',unit:'seconds',area:'ankleL'},
    {name:'Sit & Reach',unit:'cm past toes',area:'hamL'},
    {name:'6 Minute Walk',unit:'meters',area:'full'}
  ]},
  senior:{label:'Seniors (56-70)',exercises:[
    {name:'Chair Sit-to-Stand',unit:'reps in 30s',area:'quadL'},
    {name:'Bicep Curl (light dumbbell)',unit:'reps in 30s',area:'arm'},
    {name:'Marching in Place',unit:'reps in 2 min',area:'hip'},
    {name:'Back Scratch (shoulder flex)',unit:'cm gap',area:'shoulderL'},
    {name:'Sit & Reach (seated)',unit:'reach to ankle Y/N',area:'hamL'},
    {name:'Single Leg Balance (support ok)',unit:'seconds',area:'ankleL'},
    {name:'TUG (Timed Up and Go)',unit:'seconds',area:'full'}
  ]},
  elder:{label:'Older Adults (70+)',exercises:[
    {name:'Chair Sit-to-Stand',unit:'reps in 30s',area:'quadL'},
    {name:'Bicep Curl (very light)',unit:'reps in 30s',area:'arm'},
    {name:'Marching in Place (with support)',unit:'reps in 2 min',area:'hip'},
    {name:'Back Scratch',unit:'cm gap',area:'shoulderL'},
    {name:'Balance (feet together)',unit:'seconds',area:'ankleL'},
    {name:'TUG (Timed Up and Go)',unit:'seconds',area:'full'},
    {name:'6 Minute Walk (with support)',unit:'meters',area:'full'}
  ]}
};

var PARQ_QUESTIONS=[
  'Has your doctor ever said that you have a heart condition and that you should only do physical activity recommended by a doctor?',
  'Do you feel pain in your chest when you do physical activity?',
  'In the past month, have you had chest pain when you were not doing physical activity?',
  'Do you lose your balance because of dizziness or do you ever lose consciousness?',
  'Do you have a bone or joint problem that could be made worse by a change in your physical activity?',
  'Is your doctor currently prescribing drugs for your blood pressure or heart condition?',
  'Do you know of any other reason why you should not do physical activity?'
];

// State
var formData={
  name:'',date:today(),age:'',sex:'',phone:'',email:'',height:'',weight:'',bmi:'',
  goal:'',location:'',days:'',time:'',
  parq:[],
  injuries:'',surgeries:'',medications:'',limitations:'',
  upper:{},lower:{},plank:'',
  evaluation:[],evalAgeGroup:'',
  observations:'',focus:'',fmScheduled:''
};
var currentStep=0;
var STEPS=[];

function getEvalRoutineKey(age){
  age=parseInt(age)||0;
  if(age<=0)return null;
  if(age<=35)return 'young';
  if(age<=55)return 'adult';
  if(age<=70)return 'senior';
  return 'elder';
}

function calcBMI(){
  var h=parseFloat(formData.height)||0;var w=parseFloat(formData.weight)||0;
  if(h>0&&w>0)formData.bmi=(w/((h/100)*(h/100))).toFixed(1);else formData.bmi='';
}

function buildSteps(){
  STEPS=[];
  // Step 0: Welcome / Basic Info
  STEPS.push({id:'basic',label:'Step 1',title:'Basic Information',sub:"Let's start with the client's basic details.",render:renderBasic,validate:validateBasic});
  // Steps 1-7: PAR-Q (7 questions, one per step)
  for(var p=0;p<PARQ_QUESTIONS.length;p++){
    (function(idx){
      STEPS.push({
        id:'parq'+idx,
        label:'PAR-Q '+(idx+1)+' of 7',
        title:'Health Questionnaire',
        sub:PARQ_QUESTIONS[idx],
        render:function(c){renderPARQ(c,idx);},
        validate:function(){return formData.parq[idx]&&formData.parq[idx].answer;}
      });
    })(p);
  }
  // Step: Medical History
  STEPS.push({id:'medical',label:'Medical History',title:'Medical Background',sub:'Any injuries, surgeries, or limitations to consider?',render:renderMedical,validate:function(){return true;}});
  // Steps for each Upper Body test
  for(var u=0;u<UBMT_TESTS.length;u++){
    (function(t){
      STEPS.push({
        id:t.key,
        label:'Upper Body Test',
        title:t.name,
        sub:t.desc,
        render:function(c){renderMovTest(c,t,'upper');},
        validate:function(){return formData.upper[t.key]&&formData.upper[t.key].full;}
      });
    })(UBMT_TESTS[u]);
  }
  // Steps for each Lower Body test
  for(var l=0;l<LBMT_TESTS.length;l++){
    (function(t){
      STEPS.push({
        id:t.key,
        label:'Lower Body Test',
        title:t.name,
        sub:t.desc,
        render:function(c){renderMovTest(c,t,'lower');},
        validate:function(){return formData.lower[t.key]&&formData.lower[t.key].full;}
      });
    })(LBMT_TESTS[l]);
  }
  // Plank
  STEPS.push({id:'plank',label:'Endurance Test',title:'Max Plank Time',sub:'How long can the client hold a plank position?',render:renderPlank,validate:function(){return true;}});
  // Evaluation routine (ALL exercises in one step with age-based routine)
  STEPS.push({id:'eval',label:'Fitness Evaluation',title:'Evaluation Routine',sub:'Routine adapts to client age',render:renderEval,validate:function(){return true;}});
  // Final notes
  STEPS.push({id:'notes',label:'Final Step',title:'Trainer Notes',sub:'Add observations and recommendations.',render:renderNotes,validate:function(){return true;}});
  // Summary & save
  STEPS.push({id:'summary',label:'Final Step',title:'Review & Save',sub:'Review all information before saving.',render:renderSummary,validate:function(){return true;},isFinal:true});
}

function renderStep(){
  var c=gid('steps-container');
  var step=STEPS[currentStep];
  c.innerHTML='<div class="step on"><div class="step-label">'+step.label+'</div><div class="step-title">'+step.title+'</div><div class="step-sub">'+step.sub+'</div><div id="step-body"></div></div>';
  step.render(gid('step-body'));
  // Progress
  var pct=((currentStep+1)/STEPS.length)*100;
  gid('progress-fill').style.width=pct+'%';
  gid('step-counter').textContent='Step '+(currentStep+1)+' of '+STEPS.length;
  // Buttons
  gid('btn-back').disabled=currentStep===0;
  gid('btn-next').textContent=step.isFinal?'Save Intake':(currentStep===STEPS.length-1?'Finish':'Next \u2192');
  // Scroll to top
  window.scrollTo({top:0,behavior:'smooth'});
}

// ===== Renderers =====

function renderBasic(c){
  c.innerHTML='<div class="box">'+
    '<div class="fr2">'+
      '<div class="fg"><label>Full Name *</label><input class="fi" id="f-name" placeholder="Maria Garcia" value="'+(formData.name||'')+'"/></div>'+
      '<div class="fg"><label>Date</label><input class="fi" id="f-date" type="date" value="'+(formData.date||today())+'"/></div>'+
    '</div>'+
    '<div class="fr">'+
      '<div class="fg"><label>Age</label><input class="fi" id="f-age" type="number" value="'+(formData.age||'')+'"/></div>'+
      '<div class="fg"><label>Sex</label><select class="fi" id="f-sex"><option value="">--</option><option value="F" '+(formData.sex==='F'?'selected':'')+'>Female</option><option value="M" '+(formData.sex==='M'?'selected':'')+'>Male</option></select></div>'+
      '<div class="fg"><label>Phone</label><input class="fi" id="f-phone" value="'+(formData.phone||'')+'"/></div>'+
    '</div>'+
    '<div class="fg"><label>Email</label><input class="fi" id="f-email" type="email" value="'+(formData.email||'')+'"/></div>'+
    '<div class="fr">'+
      '<div class="fg"><label>Height (cm)</label><input class="fi" id="f-height" type="number" value="'+(formData.height||'')+'"/></div>'+
      '<div class="fg"><label>Weight (kg)</label><input class="fi" id="f-weight" type="number" step="0.1" value="'+(formData.weight||'')+'"/></div>'+
      '<div class="fg"><label>BMI</label><input class="fi" id="f-bmi" readonly style="background:rgba(139,92,246,.1)" value="'+(formData.bmi||'')+'"/></div>'+
    '</div>'+
    '<div class="fr2">'+
      '<div class="fg"><label>Main Goal</label><select class="fi" id="f-goal"><option value="">--</option>'+
        ['Weight Loss','Muscle Gain','Toning','Endurance','Strength','Mobility','General Health'].map(function(o){return '<option '+(formData.goal===o?'selected':'')+'>'+o+'</option>';}).join('')+
      '</select></div>'+
      '<div class="fg"><label>Training Location</label><select class="fi" id="f-loc"><option value="">--</option>'+
        ['Home','Gym','Outdoor'].map(function(o){return '<option '+(formData.location===o?'selected':'')+'>'+o+'</option>';}).join('')+
      '</select></div>'+
    '</div>'+
    '<div class="fr2">'+
      '<div class="fg"><label>Days Per Week</label><select class="fi" id="f-days"><option value="">--</option>'+
        [1,2,3,4,5,6,7].map(function(o){return '<option '+(formData.days==o?'selected':'')+'>'+o+'</option>';}).join('')+
      '</select></div>'+
      '<div class="fg"><label>Time Per Session</label><select class="fi" id="f-time"><option value="">--</option>'+
        ['30 min','45 min','60 min','90 min'].map(function(o){return '<option '+(formData.time===o?'selected':'')+'>'+o+'</option>';}).join('')+
      '</select></div>'+
    '</div>'+
  '</div>';
  // Auto-save on input
  ['f-name','f-date','f-age','f-sex','f-phone','f-email','f-height','f-weight','f-goal','f-loc','f-days','f-time'].forEach(function(id){
    gid(id).addEventListener('input',function(){saveBasicFromForm();});
    gid(id).addEventListener('change',function(){saveBasicFromForm();});
  });
}

function saveBasicFromForm(){
  formData.name=gid('f-name').value;formData.date=gid('f-date').value;
  formData.age=gid('f-age').value;formData.sex=gid('f-sex').value;
  formData.phone=gid('f-phone').value;formData.email=gid('f-email').value;
  formData.height=gid('f-height').value;formData.weight=gid('f-weight').value;
  formData.goal=gid('f-goal').value;formData.location=gid('f-loc').value;
  formData.days=gid('f-days').value;formData.time=gid('f-time').value;
  calcBMI();gid('f-bmi').value=formData.bmi;
}

function validateBasic(){
  saveBasicFromForm();
  if(!formData.name||!formData.name.trim()){alert('Please enter client name');return false;}
  return true;
}

function renderPARQ(c,idx){
  var existing=formData.parq[idx];
  var ans=existing?existing.answer:'';
  c.innerHTML='<div class="parq-card '+(ans?'answered':'')+'">'+
    '<div class="parq-num">Question '+(idx+1)+' of 7</div>'+
    '<div class="parq-q">'+PARQ_QUESTIONS[idx]+'</div>'+
    '<div class="parq-yn">'+
      '<button class="parq-btn '+(ans==='yes'?'sel-yes':'')+'" data-ans="yes" type="button">Yes</button>'+
      '<button class="parq-btn '+(ans==='no'?'sel-no':'')+'" data-ans="no" type="button">No</button>'+
    '</div></div>';
  c.querySelectorAll('.parq-btn').forEach(function(b){
    b.addEventListener('click',function(){
      formData.parq[idx]={question:PARQ_QUESTIONS[idx],answer:b.dataset.ans};
      renderPARQ(c,idx);
    });
  });
}

function renderMedical(c){
  c.innerHTML='<div class="box">'+
    '<div class="fg"><label>Previous Injuries</label><textarea class="ft" id="m-inj">'+(formData.injuries||'')+'</textarea></div>'+
    '<div class="fg"><label>Surgeries</label><textarea class="ft" id="m-sur">'+(formData.surgeries||'')+'</textarea></div>'+
    '<div class="fg"><label>Current Medications</label><textarea class="ft" id="m-med">'+(formData.medications||'')+'</textarea></div>'+
    '<div class="fg"><label>Physical Limitations</label><textarea class="ft" id="m-lim">'+(formData.limitations||'')+'</textarea></div>'+
  '</div>';
  ['m-inj','m-sur','m-med','m-lim'].forEach(function(id){
    gid(id).addEventListener('input',function(){
      formData.injuries=gid('m-inj').value;formData.surgeries=gid('m-sur').value;
      formData.medications=gid('m-med').value;formData.limitations=gid('m-lim').value;
    });
  });
}

function renderMovTest(c,t,group){
  var bucket=group==='upper'?formData.upper:formData.lower;
  var ex=bucket[t.key]||{full:'',limited:'',pinch:false,pull:false,stretch:false,notes:''};
  c.innerHTML='<div class="mov-card">'+
    '<div class="mov-card-h">'+
      '<div class="mov-svg">'+bodyFigure(t.area)+'</div>'+
      '<div class="mov-info">'+
        '<div class="mov-num">'+(group==='upper'?'Upper Body':'Lower Body')+' Test</div>'+
        '<div class="mov-name">'+t.name+'</div>'+
        '<div class="mov-desc">'+t.desc+'</div>'+
      '</div>'+
    '</div>'+
    '<div class="mov-fields">'+
      '<div>'+
        '<div class="mov-section-title">Range of Motion</div>'+
        '<div class="full">'+
          '<label class="'+(ex.full==='yes'?'sel-y':'')+'" data-full="yes"><input type="radio" name="mfull" value="yes" '+(ex.full==='yes'?'checked':'')+'/> Full</label>'+
          '<label class="'+(ex.full==='no'?'sel-n':'')+'" data-full="no"><input type="radio" name="mfull" value="no" '+(ex.full==='no'?'checked':'')+'/> Limited</label>'+
        '</div>'+
        '<div class="fg" style="margin-top:14px"><label>Limited Distance (inches)</label><input class="fi" type="number" step="0.5" id="mv-lim" value="'+(ex.limited||'')+'"/></div>'+
      '</div>'+
      '<div>'+
        '<div class="mov-section-title">Discomfort</div>'+
        '<div class="mov-disc">'+
          '<label><input type="checkbox" id="mv-pinch" '+(ex.pinch?'checked':'')+'/> Pinch</label>'+
          '<label><input type="checkbox" id="mv-pull" '+(ex.pull?'checked':'')+'/> Pull</label>'+
          '<label><input type="checkbox" id="mv-stretch" '+(ex.stretch?'checked':'')+'/> Stretch</label>'+
        '</div>'+
      '</div>'+
    '</div>'+
    '<div class="mov-notes fg"><label>Notes</label><input class="fi" type="text" id="mv-notes" value="'+(ex.notes||'').replace(/"/g,'&quot;')+'" placeholder="Hammies, lower back, etc..."/></div>'+
  '</div>';
  function save(){
    bucket[t.key]={
      test:t.name,
      full:c.querySelector('input[name=mfull]:checked')?c.querySelector('input[name=mfull]:checked').value:'',
      limited:gid('mv-lim').value,
      pinch:gid('mv-pinch').checked,pull:gid('mv-pull').checked,stretch:gid('mv-stretch').checked,
      notes:gid('mv-notes').value
    };
  }
  c.querySelectorAll('.full label').forEach(function(lbl){
    lbl.addEventListener('click',function(){
      c.querySelectorAll('.full label').forEach(function(l){l.classList.remove('sel-y','sel-n');});
      lbl.classList.add(lbl.dataset.full==='yes'?'sel-y':'sel-n');
      save();
    });
  });
  ['mv-lim','mv-pinch','mv-pull','mv-stretch','mv-notes'].forEach(function(id){
    gid(id).addEventListener('change',save);gid(id).addEventListener('input',save);
  });
}

function renderPlank(c){
  c.innerHTML='<div class="box" style="text-align:center">'+
    '<div style="margin-bottom:18px">'+bodyFigure('core')+'</div>'+
    '<div class="fg"><label>Max Plank Time (min:sec)</label><input class="fi" id="f-plank" placeholder="e.g. 1:08" value="'+(formData.plank||'')+'" style="text-align:center;font-size:18px;font-weight:700"/></div>'+
  '</div>';
  gid('f-plank').addEventListener('input',function(){formData.plank=gid('f-plank').value;});
}

function renderEval(c){
  var key=getEvalRoutineKey(formData.age);
  if(!key){c.innerHTML='<div class="box" style="text-align:center;padding:30px;color:var(--mgray)">Enter age in Step 1 to see evaluation routine</div>';return;}
  var routine=EVAL_ROUTINES[key];
  formData.evalAgeGroup=routine.label;
  if(!formData.evaluation||!formData.evaluation.length){
    formData.evaluation=routine.exercises.map(function(ex){return{exercise:ex.name,unit:ex.unit,result:'',notes:''};});
  }
  var h='<div class="step-label" style="color:var(--violet);margin-bottom:14px">Routine for: '+routine.label+'</div>';
  for(var i=0;i<routine.exercises.length;i++){
    var ex=routine.exercises[i];var saved=formData.evaluation[i]||{};
    h+='<div class="eval-card">'+
      '<div class="eval-card-h">'+
        '<div class="eval-svg">'+bodyFigure(ex.area)+'</div>'+
        '<div class="eval-info">'+
          '<div class="eval-name">'+(i+1)+'. '+ex.name+'</div>'+
          '<div class="eval-unit">Unit: '+ex.unit+'</div>'+
        '</div>'+
      '</div>'+
      '<div class="fr2">'+
        '<div class="fg"><label>Result</label><input class="fi" id="ev-r-'+i+'" value="'+(saved.result||'').replace(/"/g,'&quot;')+'" placeholder="e.g. 25"/></div>'+
        '<div class="fg"><label>Notes</label><input class="fi" id="ev-n-'+i+'" value="'+(saved.notes||'').replace(/"/g,'&quot;')+'"/></div>'+
      '</div>'+
    '</div>';
  }
  c.innerHTML=h;
  for(var j=0;j<routine.exercises.length;j++){
    (function(idx){
      gid('ev-r-'+idx).addEventListener('input',function(){formData.evaluation[idx].result=gid('ev-r-'+idx).value;});
      gid('ev-n-'+idx).addEventListener('input',function(){formData.evaluation[idx].notes=gid('ev-n-'+idx).value;});
    })(j);
  }
}

function renderNotes(c){
  c.innerHTML='<div class="box">'+
    '<div class="fg"><label>Trainer\'s Observations</label><textarea class="ft" id="n-obs" style="min-height:100px">'+(formData.observations||'')+'</textarea></div>'+
    '<div class="fg"><label>Recommended Focus Areas</label><textarea class="ft" id="n-focus">'+(formData.focus||'')+'</textarea></div>'+
    '<div class="fg"><label>F&amp;M Session Scheduled</label><input class="fi" id="n-fm" type="date" value="'+(formData.fmScheduled||'')+'"/></div>'+
  '</div>';
  ['n-obs','n-focus','n-fm'].forEach(function(id){
    gid(id).addEventListener('input',function(){
      formData.observations=gid('n-obs').value;
      formData.focus=gid('n-focus').value;
      formData.fmScheduled=gid('n-fm').value;
    });
  });
}

function renderSummary(c){
  var parqYes=formData.parq.filter(function(p){return p&&p.answer==='yes';}).length;
  var upperDone=Object.keys(formData.upper||{}).length;
  var lowerDone=Object.keys(formData.lower||{}).length;
  c.innerHTML='<div class="box">'+
    '<div class="summary-row"><span class="summary-label">Client</span><span class="summary-val">'+(formData.name||'-')+'</span></div>'+
    '<div class="summary-row"><span class="summary-label">Age / Sex</span><span class="summary-val">'+(formData.age||'-')+' / '+(formData.sex||'-')+'</span></div>'+
    '<div class="summary-row"><span class="summary-label">BMI</span><span class="summary-val">'+(formData.bmi||'-')+'</span></div>'+
    '<div class="summary-row"><span class="summary-label">Goal</span><span class="summary-val">'+(formData.goal||'-')+'</span></div>'+
    '<div class="summary-row"><span class="summary-label">Schedule</span><span class="summary-val">'+(formData.days||'?')+' days/wk, '+(formData.time||'-')+'</span></div>'+
    '<div class="summary-row"><span class="summary-label">PAR-Q "Yes" answers</span><span class="summary-val" style="color:'+(parqYes>0?'var(--orange)':'var(--green)')+'">'+parqYes+' / 7</span></div>'+
    '<div class="summary-row"><span class="summary-label">Upper Body Tests</span><span class="summary-val">'+upperDone+' / '+UBMT_TESTS.length+' completed</span></div>'+
    '<div class="summary-row"><span class="summary-label">Lower Body Tests</span><span class="summary-val">'+lowerDone+' / '+LBMT_TESTS.length+' completed</span></div>'+
    '<div class="summary-row"><span class="summary-label">Max Plank</span><span class="summary-val">'+(formData.plank||'-')+'</span></div>'+
    '<div class="summary-row"><span class="summary-label">Eval Group</span><span class="summary-val">'+(formData.evalAgeGroup||'-')+'</span></div>'+
  '</div>'+
  '<button class="btn-pdf-final" id="btn-pdf-summary" type="button">Export PDF Preview</button>';
  gid('btn-pdf-summary').addEventListener('click',exportPDF);
}

function nextStep(){
  var step=STEPS[currentStep];
  if(step.validate&&!step.validate())return;
  if(step.isFinal){saveIntake();return;}
  if(currentStep<STEPS.length-1){currentStep++;renderStep();}
}

function prevStep(){
  if(currentStep>0){currentStep--;renderStep();}
}

function collectPayload(){
  // Convert upper/lower objects to arrays
  var upperArr=[];for(var i=0;i<UBMT_TESTS.length;i++){var t=UBMT_TESTS[i];var d=formData.upper[t.key];if(d)upperArr.push(d);else upperArr.push({test:t.name,full:'',limited:'',pinch:false,pull:false,stretch:false,notes:''});}
  var lowerArr=[];for(var j=0;j<LBMT_TESTS.length;j++){var t2=LBMT_TESTS[j];var d2=formData.lower[t2.key];if(d2)lowerArr.push(d2);else lowerArr.push({test:t2.name,full:'',limited:'',pinch:false,pull:false,stretch:false,notes:''});}
  return{
    id:'i'+Date.now(),clientId:'',
    name:formData.name,date:formData.date||today(),age:formData.age,sex:formData.sex,
    phone:formData.phone,email:formData.email,height:formData.height,weight:formData.weight,bmi:formData.bmi,
    goal:formData.goal,location:formData.location,days:formData.days,time:formData.time,
    injuries:formData.injuries,surgeries:formData.surgeries,medications:formData.medications,limitations:formData.limitations,
    plank:formData.plank,observations:formData.observations,focus:formData.focus,fmScheduled:formData.fmScheduled,
    parq:formData.parq.filter(function(p){return p;}),
    upperBody:upperArr,lowerBody:lowerArr,
    evaluation:formData.evaluation||[],evalAgeGroup:formData.evalAgeGroup||''
  };
}

function saveIntake(){
  var payload=collectPayload();
  if(!payload.name){alert('Please enter client name (Step 1)');currentStep=0;renderStep();return;}
  setSync('syncing','Saving...');
  fetch(API_URL,{method:'POST',body:JSON.stringify({action:'saveIntake',payload:payload})})
    .then(function(r){return r.json();})
    .then(function(resp){
      if(resp.success){setSync('','Saved');toast('Intake saved successfully!');}
      else{setSync('error','Error');toast('Save failed: '+(resp.error||'unknown'),true);}
    })
    .catch(function(err){setSync('error','Error');toast('Connection error',true);});
}

function exportPDF(){
  var data=collectPayload();
  if(!data.name){alert('Please enter client name first');return;}
  var jsPDF=window.jspdf.jsPDF;var doc=new jsPDF();
  var pageW=210,margin=15,y=20;
  // Header gradient
  for(var gy=0;gy<32;gy++){var gp=gy/32;var r=Math.round(11+(50-11)*gp),gC=Math.round(10+(30-10)*gp),b=Math.round(30+(90-30)*gp);doc.setFillColor(r,gC,b);doc.rect(0,gy,pageW,1.5,'F');}
  if(LOGO_DATA){try{doc.addImage(LOGO_DATA,'PNG',margin,3,26,26);}catch(e){}}
  doc.setTextColor(255,255,255);doc.setFontSize(18);doc.setFont(undefined,'bold');
  doc.text('Training Intake Form',margin+30,15);
  doc.setTextColor(220,200,255);doc.setFontSize(10);doc.setFont(undefined,'normal');
  doc.text('CatholicFitPlans - Initial Assessment',margin+30,22);
  y=42;
  doc.setTextColor(0,0,0);doc.setFontSize(13);doc.setFont(undefined,'bold');
  doc.text('Client: '+data.name,margin,y);y+=6;
  doc.setFontSize(10);doc.setFont(undefined,'normal');
  doc.text('Date: '+fmtDate(data.date),margin,y);
  if(data.age)doc.text('Age: '+data.age,margin+60,y);
  if(data.sex)doc.text('Sex: '+(data.sex==='F'?'Female':'Male'),margin+90,y);
  y+=10;
  function section(title){if(y>260){doc.addPage();y=20;}doc.setFillColor(30,28,74);doc.rect(margin,y-4,pageW-margin*2,8,'F');doc.setTextColor(255,255,255);doc.setFontSize(11);doc.setFont(undefined,'bold');doc.text(title,margin+3,y+2);y+=10;doc.setTextColor(0,0,0);doc.setFontSize(9);doc.setFont(undefined,'normal');}
  function row(l,v){if(!v)return;if(y>275){doc.addPage();y=20;}doc.setFont(undefined,'bold');doc.text(l+':',margin+3,y);doc.setFont(undefined,'normal');var lines=doc.splitTextToSize(String(v),pageW-margin*2-50);doc.text(lines,margin+45,y);y+=Math.max(5,lines.length*4);}
  section('1. Basic Information');
  row('Phone',data.phone);row('Email',data.email);
  if(data.height||data.weight)row('Height/Weight',(data.height?data.height+' cm':'')+(data.weight?' / '+data.weight+' kg':'')+(data.bmi?' (BMI '+data.bmi+')':''));
  row('Goal',data.goal);row('Location',data.location);
  row('Schedule',data.days?data.days+' days/week, '+(data.time||''):'');
  y+=4;
  section('2. PAR-Q');
  for(var i=0;i<data.parq.length;i++){
    if(y>270){doc.addPage();y=20;}var p=data.parq[i];
    doc.setFont(undefined,'bold');doc.text((i+1)+'.',margin+3,y);doc.setFont(undefined,'normal');
    var lines=doc.splitTextToSize(p.question,pageW-margin*2-30);doc.text(lines,margin+9,y);
    var ans=p.answer?p.answer.toUpperCase():'-';
    doc.setFont(undefined,'bold');
    doc.setTextColor(p.answer==='yes'?239:p.answer==='no'?52:0,p.answer==='yes'?68:p.answer==='no'?211:0,p.answer==='yes'?68:p.answer==='no'?153:0);
    doc.text(ans,pageW-margin-3,y,{align:'right'});doc.setTextColor(0,0,0);doc.setFont(undefined,'normal');
    y+=Math.max(5,lines.length*4)+2;
  }
  y+=2;
  if(data.injuries||data.surgeries||data.medications||data.limitations){section('3. Medical History');row('Injuries',data.injuries);row('Surgeries',data.surgeries);row('Medications',data.medications);row('Limitations',data.limitations);y+=4;}
  function movTable(title,arr){section(title);for(var i=0;i<arr.length;i++){if(y>270){doc.addPage();y=20;}var t=arr[i];doc.setFont(undefined,'bold');doc.setFontSize(9);doc.text(t.test,margin+3,y);doc.setFont(undefined,'normal');var info='';if(t.full)info+='Full: '+t.full.toUpperCase()+'  ';if(t.limited)info+='Limited: '+t.limited+'in  ';var disc=[];if(t.pinch)disc.push('Pinch');if(t.pull)disc.push('Pull');if(t.stretch)disc.push('Stretch');if(disc.length)info+='Discomfort: '+disc.join(', ');doc.setFontSize(8);doc.text(info,margin+3,y+4);if(t.notes){doc.setFont(undefined,'italic');doc.setFontSize(8);doc.text('Notes: '+t.notes,margin+3,y+8);y+=12;}else y+=8;}y+=2;}
  movTable('4. Upper Body Movement Test',data.upperBody);
  movTable('5. Lower Body Movement Test',data.lowerBody);
  if(data.plank)row('Max Plank Time',data.plank);
  if(data.evaluation&&data.evaluation.length){section('6. Fitness Evaluation - '+(data.evalAgeGroup||''));for(var i=0;i<data.evaluation.length;i++){if(y>270){doc.addPage();y=20;}var e=data.evaluation[i];doc.setFont(undefined,'bold');doc.setFontSize(9);doc.text((i+1)+'. '+e.exercise,margin+3,y);doc.setFont(undefined,'normal');doc.text((e.result||'-')+' '+e.unit,pageW-margin-3,y,{align:'right'});if(e.notes){doc.setFont(undefined,'italic');doc.setFontSize(8);doc.text('  '+e.notes,margin+5,y+4);y+=8;}else y+=5;}y+=4;}
  if(data.observations||data.focus){section('7. Trainer Notes');row('Observations',data.observations);row('Focus Areas',data.focus);if(data.fmScheduled)row('F&M Session',fmtDate(data.fmScheduled));}
  doc.setTextColor(150,150,150);doc.setFontSize(8);doc.setFont(undefined,'italic');
  doc.text('CatholicFitPlans - Training Intake Form',margin,290);
  doc.save('Intake-'+data.name.replace(/ /g,'_')+'-'+today()+'.pdf');
}

document.addEventListener('DOMContentLoaded',function(){
  preloadLogo();
  buildSteps();
  renderStep();
  gid('btn-back').addEventListener('click',prevStep);
  gid('btn-next').addEventListener('click',nextStep);
});
