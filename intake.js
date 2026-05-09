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
  {key:'u0',name:'Wrist Extension Left',area:'wristL',desc:'Place left palm on a flat surface or wall with fingers up and arm straight. Push the wrist back keeping fingers pointing up. Goal: 70-90 degrees with no pain.'},
  {key:'u1',name:'Wrist Extension Right',area:'wristR',desc:'Place right palm on a flat surface or wall with fingers up and arm straight. Push the wrist back keeping fingers pointing up. Goal: 70-90 degrees with no pain.'},
  {key:'u2',name:'Shoulder Abduction Left',area:'shoulderL',desc:'Stand with left arm at side. Raise the arm out to the side and over the head, palm facing inward. Goal: arm reaches ear without compensation.'},
  {key:'u3',name:'Shoulder Abduction Right',area:'shoulderR',desc:'Stand with right arm at side. Raise the arm out to the side and over the head, palm facing inward. Goal: arm reaches ear without compensation.'},
  {key:'u4',name:'Shoulder Flexion Left',area:'shoulderL',desc:'Stand with left arm at side. Raise the arm forward and up overhead with elbow straight. Goal: arm fully overhead, in line with ear.'},
  {key:'u5',name:'Shoulder Flexion Right',area:'shoulderR',desc:'Stand with right arm at side. Raise the arm forward and up overhead with elbow straight. Goal: arm fully overhead, in line with ear.'},
  {key:'u6',name:'Wrist Flexion Left',area:'wristL',desc:'Extend the left arm forward, palm down. Bend the wrist downward bringing fingers toward the inside of the forearm. Goal: 80-90 degrees with no pinch.'},
  {key:'u7',name:'Wrist Flexion Right',area:'wristR',desc:'Extend the right arm forward, palm down. Bend the wrist downward bringing fingers toward the inside of the forearm. Goal: 80-90 degrees with no pinch.'}
];
var LBMT_TESTS=[
  {key:'l0',name:'Standing Lumbo Pelvic Flexion',area:'lowback',desc:'Stand with feet hip-width apart and legs straight. Slowly bend forward at the waist trying to touch toes. Note distance to floor. Goal: fingertips reach floor without bending knees or rounding upper back excessively.'},
  {key:'l1',name:'Ankle Dorsiflexion Left',area:'ankleL',desc:'Place left foot near a wall, big toe 10cm away. Bend left knee forward trying to touch the wall while heel stays on the ground. Measure max distance from wall when knee touches. Goal: 10+ cm.'},
  {key:'l2',name:'Ankle Dorsiflexion Right',area:'ankleR',desc:'Place right foot near a wall, big toe 10cm away. Bend right knee forward trying to touch the wall while heel stays on the ground. Measure max distance from wall when knee touches. Goal: 10+ cm.'},
  {key:'l3',name:'Kneeling Butt to Heel',area:'quadL',desc:'Kneel on the floor with feet flat behind. Slowly sit back trying to touch glutes to heels. Spine stays straight. Goal: full contact, no pain in knees, ankles or quads.'},
  {key:'l4',name:'Prone Butt to Heel Left',area:'quadL',desc:'Lie face down on a mat. Bend left knee bringing the heel toward the glute. Use a hand to gently pull. Goal: heel touches glute with no quad pinch or hip lift.'},
  {key:'l5',name:'Prone Butt to Heel Right',area:'quadR',desc:'Lie face down on a mat. Bend right knee bringing the heel toward the glute. Use a hand to gently pull. Goal: heel touches glute with no quad pinch or hip lift.'},
  {key:'l6',name:'Supine Hip Flexion Left',area:'hamL',desc:'Lie on back with right leg straight. Raise left leg straight up keeping the knee extended. Goal: 80-90 degrees without lower back lifting off the floor.'},
  {key:'l7',name:'Supine Hip Flexion Right',area:'hamR',desc:'Lie on back with left leg straight. Raise right leg straight up keeping the knee extended. Goal: 80-90 degrees without lower back lifting off the floor.'}
];

var EVAL_ROUTINES={
  young:{label:'Young Adults (18-35)',exercises:[
    {name:'Burpees',unit:'reps in 60s',area:'full',desc:'Start standing. Drop into squat, hands on floor, kick feet back to plank, return feet, jump up with arms overhead. Count complete reps in 60 seconds.'},
    {name:'Squats',unit:'reps in 60s',area:'quadL',desc:'Stand with feet shoulder-width apart. Lower hips back and down until thighs are parallel to floor, then return to standing. Count full reps in 60 seconds.'},
    {name:'Push-ups',unit:'reps in 60s',area:'shoulderL',desc:'Start in plank position. Lower chest toward floor by bending elbows, then push back up. Body stays straight. Count full reps in 60 seconds.'},
    {name:'Plank',unit:'max seconds',area:'core',desc:'Hold a forearm plank position with body in straight line from head to heels. Time how many seconds the form is maintained.'},
    {name:'Vertical Jump',unit:'cm',area:'quadL',desc:'Stand next to wall, mark highest reach. Then jump as high as possible touching the wall again. Measure distance between marks in cm.'},
    {name:'Single Leg Balance (eyes closed)',unit:'seconds',area:'ankleL',desc:'Stand on one leg with eyes closed and arms crossed. Time how long balance is maintained without touching the other foot down.'},
    {name:'Sit & Reach',unit:'cm past toes',area:'hamL',desc:'Sit on floor with legs straight in front. Reach hands forward past toes. Measure distance past (positive) or before (negative) toes in cm.'}
  ]},
  adult:{label:'Adults (36-55)',exercises:[
    {name:'Squats',unit:'reps in 60s',area:'quadL',desc:'Stand with feet shoulder-width apart. Lower hips back and down until thighs are parallel to floor, then return to standing. Count full reps in 60 seconds.'},
    {name:'Push-ups (knees ok)',unit:'reps in 60s',area:'shoulderL',desc:'Standard or knee push-ups. Lower chest toward floor by bending elbows, then push back up. Count full reps in 60 seconds.'},
    {name:'Plank',unit:'max seconds',area:'core',desc:'Hold a forearm plank position with body in straight line. Time how many seconds the form is maintained.'},
    {name:'Step-ups (40cm)',unit:'reps in 60s',area:'quadR',desc:'Use a bench or box about 40cm tall. Step up with one foot then the other, then step down. Alternate lead leg. Count full step-ups in 60 seconds.'},
    {name:'Single Leg Balance (eyes open)',unit:'seconds',area:'ankleL',desc:'Stand on one leg with eyes open and arms at sides. Time how long balance is maintained without touching down.'},
    {name:'Sit & Reach',unit:'cm past toes',area:'hamL',desc:'Sit on floor with legs straight. Reach hands forward past toes. Measure distance past (+) or before (-) toes in cm.'},
    {name:'6 Minute Walk',unit:'meters',area:'full',desc:'Walk as fast as comfortable for 6 minutes on flat surface. Measure total distance covered in meters.'}
  ]},
  senior:{label:'Seniors (56-70)',exercises:[
    {name:'Chair Sit-to-Stand',unit:'reps in 30s',area:'quadL',desc:'Sit in a sturdy chair, arms crossed on chest. Stand up fully then sit back down. Count complete reps in 30 seconds.'},
    {name:'Bicep Curl (light dumbbell)',unit:'reps in 30s',area:'arm',desc:'Hold a 2-3 lb dumbbell in dominant hand. Curl up and lower with full range. Count full reps in 30 seconds.'},
    {name:'Marching in Place',unit:'reps in 2 min',area:'hip',desc:'Stand and march in place lifting knees to mid-thigh height. Count knee lifts (one side) for 2 minutes.'},
    {name:'Back Scratch (shoulder flex)',unit:'cm gap',area:'shoulderL',desc:'Reach one hand over shoulder down the back, the other hand up the back. Measure distance between fingertips. Negative = overlap, positive = gap.'},
    {name:'Sit & Reach (seated)',unit:'reach to ankle Y/N',area:'hamL',desc:'Sit at edge of chair, one leg extended with heel on floor toes up. Reach hands toward toes. Note if fingertips reach the ankle.'},
    {name:'Single Leg Balance (support ok)',unit:'seconds',area:'ankleL',desc:'Stand on one leg, light fingertip support on wall is ok. Time max balance without full hand support.'},
    {name:'TUG (Timed Up and Go)',unit:'seconds',area:'full',desc:'Sit in chair. Stand up, walk 3 meters, turn, walk back, sit down. Time the entire sequence. Lower time = better.'}
  ]},
  elder:{label:'Older Adults (70+)',exercises:[
    {name:'Chair Sit-to-Stand',unit:'reps in 30s',area:'quadL',desc:'Sit in a sturdy chair with arms (use arms if needed). Stand up fully then sit back down. Count complete reps in 30 seconds.'},
    {name:'Bicep Curl (very light)',unit:'reps in 30s',area:'arm',desc:'Hold a 1-2 lb dumbbell in dominant hand. Curl up and lower. Count full reps in 30 seconds.'},
    {name:'Marching in Place (with support)',unit:'reps in 2 min',area:'hip',desc:'Hold a chair or wall for support. March in place lifting knees as high as comfortable. Count knee lifts (one side) for 2 minutes.'},
    {name:'Back Scratch',unit:'cm gap',area:'shoulderL',desc:'Reach one hand over shoulder down the back, the other up. Measure gap or overlap between fingertips.'},
    {name:'Balance (feet together)',unit:'seconds',area:'ankleL',desc:'Stand with feet together, arms at sides. Light fingertip support is ok. Time how long balance is maintained.'},
    {name:'TUG (Timed Up and Go)',unit:'seconds',area:'full',desc:'Sit in a chair with arms. Stand up (use arms ok), walk 3m, turn, walk back, sit down. Time the full sequence.'},
    {name:'6 Minute Walk (with support)',unit:'meters',area:'full',desc:'Walk for 6 minutes at comfortable pace. Walking aid if needed. Measure total distance in meters.'}
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
  // Diagnosis
  STEPS.push({id:'diagnosis',label:'Diagnosis',title:'Client Diagnosis & Plan',sub:'Personalized analysis based on all collected data.',render:renderDiagnosis,validate:function(){return true;}});
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
    '<div style="margin:0 auto 14px;width:130px">'+bodyFigure('core')+'</div>'+
    '<div style="font-size:13px;color:var(--mgray);line-height:1.6;margin-bottom:18px;padding:0 10px">Lie face down, then push up onto forearms (elbows under shoulders) and toes. Body forms a straight line from head to heels. Engage core, dont let hips sag or pike. Time how many minutes/seconds the form is maintained without breaking.</div>'+
    '<div class="fg"><label>Max Plank Time (min:sec)</label><input class="fi" id="f-plank" placeholder="e.g. 1:08" value="'+(formData.plank||'')+'" style="text-align:center;font-size:18px;font-weight:700;max-width:200px;margin:0 auto"/></div>'+
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
          '<div style="font-size:11px;color:var(--mgray);margin-top:6px;line-height:1.5">'+(ex.desc||'')+'</div>'+
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


// ===== DIAGNOSIS ENGINE =====
var EXERCISE_LIBRARY={
  // Fundamental movements
  squat:{name:'Bodyweight Squat',sets:'3',reps:'12-15',area:'quadL',desc:'Feet shoulder-width, lower hips back and down to parallel.',gym:false},
  goblet_squat:{name:'Goblet Squat',sets:'3',reps:'10-12',area:'quadL',desc:'Hold dumbbell at chest, perform deep squat.',gym:true},
  barbell_squat:{name:'Barbell Back Squat',sets:'4',reps:'8-10',area:'quadL',desc:'Bar on upper back, squat to parallel with control.',gym:true},
  lunge:{name:'Walking Lunges',sets:'3',reps:'10/leg',area:'quadL',desc:'Step forward, drop back knee toward floor, alternate.',gym:false},
  bulgarian:{name:'Bulgarian Split Squat',sets:'3',reps:'8/leg',area:'quadR',desc:'Rear foot elevated, lower into single-leg squat.',gym:true},
  glute_bridge:{name:'Glute Bridge',sets:'3',reps:'15',area:'hip',desc:'On back, knees bent, lift hips squeezing glutes.',gym:false},
  hip_thrust:{name:'Hip Thrust',sets:'4',reps:'10-12',area:'hip',desc:'Shoulders on bench, drive hips up with weight on lap.',gym:true},
  rdl:{name:'Romanian Deadlift',sets:'3',reps:'10',area:'hamL',desc:'Hinge hips back keeping legs nearly straight, feel hamstrings.',gym:true},
  push_up:{name:'Push-ups',sets:'3',reps:'8-15',area:'shoulderL',desc:'Plank position, lower chest to floor and push back up.',gym:false},
  bench_press:{name:'Bench Press',sets:'4',reps:'8-10',area:'shoulderL',desc:'Lying on bench, lower bar to chest then press up.',gym:true},
  row:{name:'Bent-over Row (DB or barbell)',sets:'3',reps:'10',area:'shoulderL',desc:'Hinge forward, pull weight to lower ribs squeezing back.',gym:false},
  lat_pulldown:{name:'Lat Pulldown',sets:'3',reps:'10-12',area:'shoulderL',desc:'Pull bar to upper chest, control return.',gym:true},
  shoulder_press:{name:'Shoulder Press (DB)',sets:'3',reps:'10',area:'shoulderL',desc:'Press dumbbells overhead from shoulder height.',gym:false},
  plank:{name:'Front Plank',sets:'3',reps:'30-45 sec',area:'core',desc:'Hold straight body on forearms, brace core.',gym:false},
  side_plank:{name:'Side Plank',sets:'3',reps:'20-30 sec/side',area:'core',desc:'Lie on side, prop on forearm, lift hips into straight line.',gym:false},
  dead_bug:{name:'Dead Bug',sets:'3',reps:'8/side',area:'core',desc:'On back, opposite arm/leg extend slowly without arching back.',gym:false},
  bird_dog:{name:'Bird Dog',sets:'3',reps:'8/side',area:'lowback',desc:'On hands and knees, extend opposite arm and leg, hold 2 sec.',gym:false},
  // Cardio
  walk:{name:'Brisk Walking',sets:'1',reps:'20-30 min',area:'full',desc:'Steady pace where conversation is challenging but possible.',gym:false},
  jog:{name:'Light Jogging',sets:'1',reps:'20-30 min',area:'full',desc:'Easy pace, focus on form and breathing.',gym:false},
  hiit:{name:'HIIT Cardio (intervals)',sets:'8 rounds',reps:'30s on, 30s off',area:'full',desc:'High intensity then rest. Bike, sprints, burpees, etc.',gym:false},
  treadmill:{name:'Treadmill Walking/Jogging',sets:'1',reps:'25-35 min',area:'full',desc:'Steady pace at chosen incline.',gym:true},
  elliptical:{name:'Elliptical',sets:'1',reps:'25-35 min',area:'full',desc:'Low-impact full body cardio.',gym:true},
  bike:{name:'Stationary Bike',sets:'1',reps:'25-35 min',area:'full',desc:'Steady or interval pace.',gym:true},
  // Mobility/flexibility
  hip_flex_stretch:{name:'Hip Flexor Stretch',sets:'2',reps:'45 sec/side',area:'hip',desc:'Half-kneel, tuck pelvis under, gently shift forward.',gym:false},
  ham_stretch:{name:'Hamstring Stretch',sets:'2',reps:'30 sec/side',area:'hamL',desc:'Seated or supine with strap, leg straight up.',gym:false},
  quad_stretch:{name:'Quad Stretch',sets:'2',reps:'30 sec/side',area:'quadL',desc:'Standing, pull heel toward glute, push hip forward.',gym:false},
  ankle_mobility:{name:'Ankle Dorsiflexion Drill',sets:'2',reps:'10/side',area:'ankleL',desc:'Knee to wall, drive knee over toes maintaining heel down.',gym:false},
  shoulder_dislocates:{name:'Shoulder Dislocates (band)',sets:'2',reps:'10',area:'shoulderL',desc:'Wide grip on band, pass over head front to back, slow.',gym:false},
  cat_cow:{name:'Cat-Cow',sets:'2',reps:'10',area:'lowback',desc:'On hands and knees, alternate arching and rounding spine.',gym:false},
  // Strength accessories
  bicep_curl:{name:'Dumbbell Bicep Curl',sets:'3',reps:'12',area:'arm',desc:'Curl weight up, control down.',gym:true},
  tricep_dip:{name:'Tricep Dips (chair/bench)',sets:'3',reps:'10',area:'arm',desc:'Hands on bench behind, dip down then push up.',gym:false},
  calf_raise:{name:'Calf Raises',sets:'3',reps:'15',area:'ankleL',desc:'Rise onto toes, lower with control.',gym:false},
  step_up:{name:'Step-ups',sets:'3',reps:'10/leg',area:'quadL',desc:'Step onto a sturdy bench, drive knee up at top.',gym:false}
};

function generateDiagnosis(){
  var d={redFlags:[],concerns:[],strengths:[],level:'beginner',plan:[],summary:''};
  // 1. PAR-Q red flags
  for(var i=0;i<formData.parq.length;i++){
    var p=formData.parq[i];
    if(p&&p.answer==='yes'){
      d.redFlags.push('Question '+(i+1)+': '+p.question);
    }
  }
  // 2. Movement concerns - upper body
  var ubProblems=[];
  for(var u=0;u<UBMT_TESTS.length;u++){
    var tk=UBMT_TESTS[u].key;var test=formData.upper[tk];
    if(test){
      if(test.full==='no'){ubProblems.push(UBMT_TESTS[u].name+(test.limited?' (limited '+test.limited+'in)':''));}
      var disc=[];if(test.pinch)disc.push('pinch');if(test.pull)disc.push('pull');if(test.stretch)disc.push('stretch');
      if(disc.length){ubProblems.push(UBMT_TESTS[u].name+' - discomfort: '+disc.join(', '));}
    }
  }
  // Movement concerns - lower body
  var lbProblems=[];
  for(var l=0;l<LBMT_TESTS.length;l++){
    var tk2=LBMT_TESTS[l].key;var test2=formData.lower[tk2];
    if(test2){
      if(test2.full==='no'){lbProblems.push(LBMT_TESTS[l].name+(test2.limited?' (limited '+test2.limited+'in)':''));}
      var disc2=[];if(test2.pinch)disc2.push('pinch');if(test2.pull)disc2.push('pull');if(test2.stretch)disc2.push('stretch');
      if(disc2.length){lbProblems.push(LBMT_TESTS[l].name+' - discomfort: '+disc2.join(', '));}
    }
  }
  if(ubProblems.length)d.concerns.push({title:'Upper Body Mobility Issues',items:ubProblems});
  if(lbProblems.length)d.concerns.push({title:'Lower Body Mobility Issues',items:lbProblems});
  // 3. Medical history concerns
  if(formData.injuries||formData.surgeries||formData.medications||formData.limitations){
    var med=[];
    if(formData.injuries)med.push('Injuries: '+formData.injuries);
    if(formData.surgeries)med.push('Surgeries: '+formData.surgeries);
    if(formData.medications)med.push('Medications: '+formData.medications);
    if(formData.limitations)med.push('Limitations: '+formData.limitations);
    d.concerns.push({title:'Medical History',items:med});
  }
  // 4. Determine fitness level from evaluation
  var evalScore=0,evalCount=0;
  if(formData.evaluation){
    for(var e=0;e<formData.evaluation.length;e++){
      var r=parseFloat(formData.evaluation[e].result)||0;
      if(r>0){evalCount++;evalScore+=r;}
    }
  }
  // Heuristic level based on age and basic eval completion
  var age=parseInt(formData.age)||30;
  if(evalCount===0){d.level='unknown - eval not completed';}
  else{
    // Use plank time as a quick fitness proxy if available
    var plankSec=0;
    if(formData.plank){var pp=String(formData.plank).split(':');if(pp.length===2)plankSec=parseInt(pp[0])*60+parseInt(pp[1]);else plankSec=parseInt(formData.plank)||0;}
    if(age<35){
      if(plankSec>=120)d.level='advanced';
      else if(plankSec>=60)d.level='intermediate';
      else d.level='beginner';
    }else if(age<55){
      if(plankSec>=90)d.level='advanced';
      else if(plankSec>=45)d.level='intermediate';
      else d.level='beginner';
    }else{
      if(plankSec>=60)d.level='advanced';
      else if(plankSec>=30)d.level='intermediate';
      else d.level='beginner';
    }
  }
  // 5. Build personalized plan
  d.plan=buildPlan(d);
  return d;
}

function buildPlan(d){
  var goal=formData.goal||'General Health';
  var loc=formData.location||'Home';
  var days=parseInt(formData.days)||3;
  var time=formData.time||'45 min';
  var level=d.level;
  var hasHipIssue=false,hasShoulderIssue=false,hasAnkleIssue=false,hasBackIssue=false;
  for(var i=0;i<(d.concerns||[]).length;i++){
    var items=d.concerns[i].items.join(' ').toLowerCase();
    if(items.indexOf('hip')>=0||items.indexOf('lumbo')>=0||items.indexOf('quad')>=0||items.indexOf('butt to heel')>=0||items.indexOf('femoral')>=0||items.indexOf('hamstring')>=0)hasHipIssue=true;
    if(items.indexOf('shoulder')>=0||items.indexOf('wrist')>=0)hasShoulderIssue=true;
    if(items.indexOf('ankle')>=0||items.indexOf('dorsi')>=0)hasAnkleIssue=true;
    if(items.indexOf('back')>=0||items.indexOf('lumbo')>=0)hasBackIssue=true;
  }
  // Build days
  var plan=[];
  // Goal-based templates (we will pick exercises adapting to location)
  function pickEx(key){var ex=EXERCISE_LIBRARY[key];if(!ex)return null;if(loc==='Home'&&ex.gym){
    // find home alternative
    var alt={barbell_squat:'goblet_squat',goblet_squat:'squat',hip_thrust:'glute_bridge',rdl:'rdl',bench_press:'push_up',lat_pulldown:'row',treadmill:'walk',elliptical:'jog',bike:'hiit',shoulder_press:'shoulder_press',bicep_curl:'bicep_curl',bulgarian:'lunge'};
    if(alt[key])return EXERCISE_LIBRARY[alt[key]];
  }return ex;}
  function dayObj(name,exes){return{name:name,exercises:exes.map(function(k){return pickEx(k)||EXERCISE_LIBRARY[k];}).filter(function(e){return e;})};}
  // mobility prefix if needed
  var mobility=[];
  if(hasHipIssue)mobility.push('hip_flex_stretch','ham_stretch');
  if(hasShoulderIssue)mobility.push('shoulder_dislocates');
  if(hasAnkleIssue)mobility.push('ankle_mobility');
  if(hasBackIssue)mobility.push('cat_cow','bird_dog');
  // ===== Templates by goal =====
  if(goal==='Weight Loss'){
    if(days<=2){
      plan.push(dayObj('Day 1: Full Body + Cardio',mobility.concat(['squat','push_up','row','plank','hiit'])));
      plan.push(dayObj('Day 2: Lower + Cardio',mobility.concat(['lunge','glute_bridge','dead_bug','walk'])));
    }else if(days===3){
      plan.push(dayObj('Day 1: Full Body Strength',mobility.concat(['squat','push_up','row','plank'])));
      plan.push(dayObj('Day 2: Cardio + Core',['hiit','plank','side_plank','dead_bug']));
      plan.push(dayObj('Day 3: Lower Body + Steady Cardio',mobility.concat(['lunge','glute_bridge','calf_raise','walk'])));
    }else{
      plan.push(dayObj('Day 1: Upper Strength',mobility.concat(['push_up','row','shoulder_press','plank'])));
      plan.push(dayObj('Day 2: HIIT Cardio',['hiit','side_plank']));
      plan.push(dayObj('Day 3: Lower Strength',mobility.concat(['squat','lunge','glute_bridge','calf_raise'])));
      plan.push(dayObj('Day 4: Steady Cardio',['walk','plank','dead_bug']));
      if(days>=5)plan.push(dayObj('Day 5: Full Body + Mobility',mobility.concat(['squat','push_up','row','bird_dog'])));
      if(days>=6)plan.push(dayObj('Day 6: Active Recovery',['walk','hip_flex_stretch','ham_stretch','quad_stretch','cat_cow']));
    }
  }else if(goal==='Muscle Gain'||goal==='Strength'){
    if(days<=2){
      plan.push(dayObj('Day 1: Full Body Strength A',mobility.concat(['barbell_squat','bench_press','row'])));
      plan.push(dayObj('Day 2: Full Body Strength B',mobility.concat(['rdl','shoulder_press','lat_pulldown','plank'])));
    }else if(days===3){
      plan.push(dayObj('Day 1: Push (Chest/Shoulders/Triceps)',mobility.concat(['bench_press','shoulder_press','tricep_dip'])));
      plan.push(dayObj('Day 2: Pull (Back/Biceps)',mobility.concat(['lat_pulldown','row','bicep_curl','plank'])));
      plan.push(dayObj('Day 3: Legs',mobility.concat(['barbell_squat','rdl','hip_thrust','calf_raise'])));
    }else if(days===4){
      plan.push(dayObj('Day 1: Upper Push',['bench_press','shoulder_press','tricep_dip','plank']));
      plan.push(dayObj('Day 2: Lower Quad-Focus',['barbell_squat','bulgarian','step_up','calf_raise']));
      plan.push(dayObj('Day 3: Upper Pull',['lat_pulldown','row','bicep_curl','side_plank']));
      plan.push(dayObj('Day 4: Lower Posterior',['rdl','hip_thrust','glute_bridge','dead_bug']));
    }else{
      plan.push(dayObj('Day 1: Chest',['bench_press','push_up','tricep_dip']));
      plan.push(dayObj('Day 2: Back',['lat_pulldown','row','bicep_curl']));
      plan.push(dayObj('Day 3: Legs',['barbell_squat','lunge','calf_raise']));
      plan.push(dayObj('Day 4: Shoulders & Arms',['shoulder_press','bicep_curl','tricep_dip']));
      plan.push(dayObj('Day 5: Posterior Chain',['rdl','hip_thrust','glute_bridge','plank']));
      if(days>=6)plan.push(dayObj('Day 6: Active Recovery',['walk','hip_flex_stretch','ham_stretch','cat_cow']));
    }
  }else if(goal==='Toning'){
    if(days<=3){
      plan.push(dayObj('Day 1: Full Body Tone',mobility.concat(['squat','push_up','row','plank'])));
      plan.push(dayObj('Day 2: Cardio + Core',['hiit','plank','side_plank','dead_bug']));
      if(days===3)plan.push(dayObj('Day 3: Lower + Glutes',mobility.concat(['lunge','glute_bridge','hip_thrust','calf_raise'])));
    }else{
      plan.push(dayObj('Day 1: Upper Tone',['push_up','row','shoulder_press','tricep_dip']));
      plan.push(dayObj('Day 2: Cardio',['hiit','plank']));
      plan.push(dayObj('Day 3: Lower Tone',['squat','lunge','glute_bridge','calf_raise']));
      plan.push(dayObj('Day 4: Core + Mobility',mobility.concat(['plank','side_plank','dead_bug','bird_dog'])));
      if(days>=5)plan.push(dayObj('Day 5: Full Body Circuit',['squat','push_up','row','plank','hiit']));
    }
  }else if(goal==='Endurance'){
    plan.push(dayObj('Day 1: Long Steady Cardio',['walk','jog']));
    plan.push(dayObj('Day 2: Strength + Core',mobility.concat(['squat','push_up','plank','dead_bug'])));
    if(days>=3)plan.push(dayObj('Day 3: Interval Cardio',['hiit','side_plank']));
    if(days>=4)plan.push(dayObj('Day 4: Tempo Cardio',['jog','elliptical']));
    if(days>=5)plan.push(dayObj('Day 5: Full Body Strength',mobility.concat(['lunge','row','glute_bridge','plank'])));
    if(days>=6)plan.push(dayObj('Day 6: Active Recovery',['walk','hip_flex_stretch','ham_stretch','cat_cow']));
  }else if(goal==='Mobility'){
    plan.push(dayObj('Day 1: Hip & Lower Body Mobility',['hip_flex_stretch','ham_stretch','quad_stretch','ankle_mobility','glute_bridge']));
    plan.push(dayObj('Day 2: Upper Body & Shoulder Mobility',['shoulder_dislocates','cat_cow','bird_dog','plank']));
    if(days>=3)plan.push(dayObj('Day 3: Full Body Flow',mobility.concat(['squat','lunge','push_up','plank'])));
    if(days>=4)plan.push(dayObj('Day 4: Core + Stability',['plank','side_plank','dead_bug','bird_dog']));
    if(days>=5)plan.push(dayObj('Day 5: Active Recovery',['walk','cat_cow','ham_stretch']));
  }else{ // General Health
    if(days<=2){
      plan.push(dayObj('Day 1: Full Body',mobility.concat(['squat','push_up','row','plank'])));
      plan.push(dayObj('Day 2: Cardio + Mobility',['walk','hip_flex_stretch','ham_stretch','dead_bug']));
    }else if(days===3){
      plan.push(dayObj('Day 1: Full Body Strength',mobility.concat(['squat','push_up','row','plank'])));
      plan.push(dayObj('Day 2: Cardio',['walk','hiit']));
      plan.push(dayObj('Day 3: Mobility & Core',['hip_flex_stretch','ham_stretch','plank','dead_bug','bird_dog']));
    }else{
      plan.push(dayObj('Day 1: Upper Body',['push_up','row','shoulder_press','plank']));
      plan.push(dayObj('Day 2: Steady Cardio',['walk','jog']));
      plan.push(dayObj('Day 3: Lower Body',['squat','lunge','glute_bridge','calf_raise']));
      plan.push(dayObj('Day 4: Mobility + Core',mobility.concat(['plank','side_plank','dead_bug'])));
      if(days>=5)plan.push(dayObj('Day 5: Full Body Circuit',['squat','push_up','row','plank']));
      if(days>=6)plan.push(dayObj('Day 6: Active Recovery',['walk','hip_flex_stretch','ham_stretch','cat_cow']));
    }
  }
  return plan;
}

function renderDiagnosis(c){
  var d=generateDiagnosis();
  formData._diagnosis=d;
  var h='';
  // Red flags
  if(d.redFlags.length){
    h+='<div class="box" style="border-color:rgba(239,68,68,.4);background:rgba(239,68,68,.08)"><h3 style="color:var(--red);background:none;-webkit-text-fill-color:var(--red)">&#9888; Health Red Flags ('+d.redFlags.length+')</h3><p style="font-size:12px;color:#fca5a5;margin-top:8px">Medical clearance recommended before training</p><ul style="margin:10px 0 0 18px;font-size:12px;color:var(--lgray);line-height:1.7">';
    for(var i=0;i<d.redFlags.length;i++)h+='<li>'+d.redFlags[i]+'</li>';
    h+='</ul></div>';
  }else{
    h+='<div class="box" style="border-color:rgba(52,211,153,.4);background:rgba(52,211,153,.08)"><h3 style="color:var(--green);background:none;-webkit-text-fill-color:var(--green)">&#10003; PAR-Q Cleared</h3><p style="font-size:12px;color:#a7f3d0;margin-top:6px">No health red flags detected. Client is cleared for physical activity.</p></div>';
  }
  // Concerns
  if(d.concerns.length){
    h+='<div class="box"><h3>Areas Needing Attention</h3>';
    for(var ci=0;ci<d.concerns.length;ci++){
      var con=d.concerns[ci];
      h+='<div style="margin-top:10px"><div style="font-size:12px;font-weight:700;color:var(--gold);margin-bottom:6px">'+con.title+'</div><ul style="margin-left:18px;font-size:11px;color:var(--lgray);line-height:1.7">';
      for(var ii=0;ii<con.items.length;ii++)h+='<li>'+con.items[ii]+'</li>';
      h+='</ul></div>';
    }
    h+='</div>';
  }
  // Fitness level
  var lvlColor={beginner:'var(--orange)',intermediate:'var(--gold)',advanced:'var(--green)'};
  var lvlC=lvlColor[d.level]||'var(--mgray)';
  h+='<div class="box"><h3>Fitness Level Assessment</h3><div style="font-size:18px;font-weight:800;color:'+lvlC+';text-transform:capitalize;margin-top:8px">'+d.level+'</div>';
  if(formData.plank)h+='<p style="font-size:11px;color:var(--mgray);margin-top:6px">Based on plank time: '+formData.plank+', age: '+(formData.age||'?')+'</p>';
  h+='</div>';
  // Personalized plan
  h+='<div class="box" style="border-color:rgba(139,92,246,.4)"><h3>Personalized Training Plan</h3>';
  h+='<div style="font-size:12px;color:var(--violet);margin-top:6px;margin-bottom:14px"><strong>Goal:</strong> '+(formData.goal||'-')+' &nbsp;|&nbsp; <strong>Location:</strong> '+(formData.location||'-')+' &nbsp;|&nbsp; <strong>Frequency:</strong> '+(formData.days||'?')+' days/week</div>';
  for(var di=0;di<d.plan.length;di++){
    var day=d.plan[di];
    h+='<div style="background:var(--card2);border-radius:10px;padding:14px;margin-bottom:10px;border-left:3px solid var(--pink)">';
    h+='<div style="font-size:13px;font-weight:800;color:#fff;margin-bottom:8px">'+day.name+'</div>';
    h+='<div style="display:grid;gap:6px">';
    for(var ei=0;ei<day.exercises.length;ei++){
      var ex=day.exercises[ei];
      h+='<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;font-size:11px;padding:6px 0;border-bottom:1px solid rgba(37,35,80,.5)"><div><strong style="color:var(--lgray)">'+ex.name+'</strong><div style="color:var(--mgray);margin-top:2px;font-size:10px">'+(ex.desc||'')+'</div></div><div style="text-align:right;flex-shrink:0;color:#a78bfa;font-weight:700">'+ex.sets+' x '+ex.reps+'</div></div>';
    }
    h+='</div></div>';
  }
  h+='</div>';
  // Action buttons
  h+='<button class="btn-pdf-final" id="btn-pdf-diag" type="button">Download Full Diagnosis PDF</button>';
  c.innerHTML=h;
  gid('btn-pdf-diag').addEventListener('click',exportDiagnosisPDF);
}

function exportDiagnosisPDF(){
  var data=collectPayload();
  var d=formData._diagnosis||generateDiagnosis();
  if(!data.name){alert('Please enter client name');return;}
  var jsPDF=window.jspdf.jsPDF;var doc=new jsPDF();
  var pageW=210,margin=15,y=20;
  // Header gradient
  for(var gy=0;gy<32;gy++){var gp=gy/32;var rr=Math.round(11+(50-11)*gp),gC=Math.round(10+(30-10)*gp),bb=Math.round(30+(90-30)*gp);doc.setFillColor(rr,gC,bb);doc.rect(0,gy,pageW,1.5,'F');}
  if(LOGO_DATA){try{doc.addImage(LOGO_DATA,'PNG',margin,3,26,26);}catch(e){}}
  doc.setTextColor(255,255,255);doc.setFontSize(18);doc.setFont(undefined,'bold');
  doc.text('Diagnosis & Training Plan',margin+30,15);
  doc.setTextColor(220,200,255);doc.setFontSize(10);doc.setFont(undefined,'normal');
  doc.text('CatholicFitPlans - Personalized Assessment',margin+30,22);
  y=42;
  doc.setTextColor(0,0,0);doc.setFontSize(13);doc.setFont(undefined,'bold');
  doc.text('Client: '+data.name,margin,y);y+=6;
  doc.setFontSize(10);doc.setFont(undefined,'normal');
  doc.text('Date: '+fmtDate(data.date),margin,y);
  if(data.age)doc.text('Age: '+data.age,margin+60,y);
  if(data.sex)doc.text('Sex: '+(data.sex==='F'?'Female':'Male'),margin+90,y);
  y+=10;
  function section(title,color){
    if(y>260){doc.addPage();y=20;}
    var c1=color||[30,28,74];
    doc.setFillColor(c1[0],c1[1],c1[2]);doc.rect(margin,y-4,pageW-margin*2,8,'F');
    doc.setTextColor(255,255,255);doc.setFontSize(11);doc.setFont(undefined,'bold');
    doc.text(title,margin+3,y+2);y+=10;
    doc.setTextColor(0,0,0);doc.setFontSize(9);doc.setFont(undefined,'normal');
  }
  // Red flags
  if(d.redFlags.length){
    section('Health Red Flags - Medical Clearance Recommended',[239,68,68]);
    for(var i=0;i<d.redFlags.length;i++){
      if(y>275){doc.addPage();y=20;}
      var lines=doc.splitTextToSize('- '+d.redFlags[i],pageW-margin*2-6);
      doc.text(lines,margin+3,y);y+=lines.length*4+1;
    }
    y+=4;
  }else{
    section('PAR-Q Status: CLEARED',[52,211,153]);
    doc.text('No health red flags detected. Client is cleared for physical activity.',margin+3,y);y+=8;
  }
  // Concerns
  if(d.concerns.length){
    section('Areas Needing Attention');
    for(var ci=0;ci<d.concerns.length;ci++){
      if(y>270){doc.addPage();y=20;}
      doc.setFont(undefined,'bold');doc.text(d.concerns[ci].title,margin+3,y);y+=5;
      doc.setFont(undefined,'normal');
      for(var ii=0;ii<d.concerns[ci].items.length;ii++){
        if(y>275){doc.addPage();y=20;}
        var lines2=doc.splitTextToSize('- '+d.concerns[ci].items[ii],pageW-margin*2-10);
        doc.text(lines2,margin+5,y);y+=lines2.length*4+1;
      }
      y+=3;
    }
    y+=2;
  }
  // Level
  section('Fitness Level Assessment');
  doc.setFont(undefined,'bold');doc.setFontSize(14);
  doc.text(d.level.toUpperCase(),margin+3,y);y+=6;
  doc.setFontSize(9);doc.setFont(undefined,'normal');
  if(formData.plank)doc.text('Plank time: '+formData.plank+'  |  Age: '+(formData.age||'?'),margin+3,y);y+=8;
  // Plan
  section('Personalized Training Plan',[139,92,246]);
  doc.setFont(undefined,'bold');
  doc.text('Goal: '+(formData.goal||'-')+'    Location: '+(formData.location||'-')+'    Frequency: '+(formData.days||'?')+' days/wk    '+(formData.time||''),margin+3,y);y+=8;
  for(var di=0;di<d.plan.length;di++){
    if(y>250){doc.addPage();y=20;}
    var day=d.plan[di];
    doc.setFillColor(245,243,255);doc.rect(margin,y-4,pageW-margin*2,7,'F');
    doc.setTextColor(139,92,246);doc.setFont(undefined,'bold');doc.setFontSize(10);
    doc.text(day.name,margin+3,y+1);y+=8;
    doc.setTextColor(0,0,0);doc.setFontSize(9);doc.setFont(undefined,'normal');
    for(var ei=0;ei<day.exercises.length;ei++){
      if(y>275){doc.addPage();y=20;}
      var ex=day.exercises[ei];
      doc.setFont(undefined,'bold');doc.text(ex.name,margin+3,y);
      doc.setFont(undefined,'normal');doc.setTextColor(120,90,220);
      doc.text(ex.sets+' x '+ex.reps,pageW-margin-3,y,{align:'right'});doc.setTextColor(0,0,0);y+=4;
      if(ex.desc){doc.setFontSize(8);doc.setTextColor(80,80,80);doc.setFont(undefined,'italic');var ld=doc.splitTextToSize(ex.desc,pageW-margin*2-10);doc.text(ld,margin+5,y);doc.setFont(undefined,'normal');doc.setTextColor(0,0,0);doc.setFontSize(9);y+=ld.length*3.5+2;}
    }
    y+=4;
  }
  doc.setTextColor(150,150,150);doc.setFontSize(8);doc.setFont(undefined,'italic');
  doc.text('CatholicFitPlans - Diagnosis & Training Plan',margin,290);
  doc.save('Diagnosis-'+data.name.replace(/ /g,'_')+'-'+today()+'.pdf');
}


document.addEventListener('DOMContentLoaded',function(){
  preloadLogo();
  buildSteps();
  renderStep();
  gid('btn-back').addEventListener('click',prevStep);
  gid('btn-next').addEventListener('click',nextStep);
});
