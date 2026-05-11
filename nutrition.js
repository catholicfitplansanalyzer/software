var API_URL='https://script.google.com/macros/s/AKfycbxW99Gb8tMCvktp9joQQlGtZ3ERuwJObSVIEEfShupY2V4C3hqKt9b4Ejksd-n3Qer9/exec';

function gid(id){return document.getElementById(id);}
function today(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function toast(m,err){var t=gid('toast');t.textContent=m;t.className='toast on'+(err?' error':'');setTimeout(function(){t.classList.remove('on');},3500);}

var PROTEIN_SUGGESTIONS=['Huevos','Carne de res','Carne de cerdo','Pavo','Pollo','Pescado blanco','Salmón','Atún','Camarones','Mariscos','Yogurt griego','Queso cottage','Tofu','Tempeh','Proteína en polvo'];
var CARB_SUGGESTIONS=['Arroz blanco','Arroz integral','Papa','Camote','Yuca','Plátano','Pasta','Pan integral','Tortilla de maíz','Tortilla de harina','Arepa','Frijol','Lentejas','Garbanzos','Avena','Quinoa'];
var VEGGIE_SUGGESTIONS=['Brócoli','Espinaca','Lechuga','Tomate','Zanahoria','Pepino','Pimiento','Calabacín','Coliflor','Apio','Cebolla','Ajo','Aguacate','Champiñones','Espárragos','Kale'];
var FRUIT_SUGGESTIONS=['Manzana','Plátano','Fresa','Mora','Arándano','Piña','Mango','Sandía','Melón','Naranja','Mandarina','Uvas','Kiwi','Papaya','Durazno','Pera'];
var FAT_SUGGESTIONS=['Aguacate','Almendras','Nueces','Maní','Mantequilla de maní','Aceite de oliva','Aceite de coco','Mantequilla','Semillas de chía','Semillas de linaza','Coco','Aceitunas','Queso'];

var formData={
  name:'',date:today(),age:'',sex:'',phone:'',email:'',height:'',weight:'',goal:'',
  dailyDiet:'',supplements:'',pathologies:'',
  proteins:'',carbs:'',vegetables:'',fruits:'',fats:'',
  mealsPerDay:'',gymDays:'',sessionTime:''
};
var currentStep=0;
var STEPS=[];

function buildSteps(){
  STEPS=[
    {label:'Paso 1',title:'Tus datos básicos',sub:'Empecemos con información básica sobre ti.',render:renderBasic,validate:validateBasic},
    {label:'Paso 2',title:'Tu alimentación actual',sub:'Escribe TODA tu alimentación de un día normal. Incluye horarios, alimentos, cantidades aproximadas y bebidas.',render:renderDailyDiet,validate:function(){formData.dailyDiet=gid('q-diet').value;return true;}},
    {label:'Paso 3',title:'Suplementación',sub:'¿Has consumido suplementos o quieres consumirlos? Describe cuáles, cuándo y por qué.',render:renderSupplements,validate:function(){formData.supplements=gid('q-supp').value;return true;}},
    {label:'Paso 4',title:'Salud y antecedentes',sub:'Escribe las patologías, enfermedades o lesiones que tengas. Aunque parezcan pequeñas, todo cuenta.',render:renderPathologies,validate:function(){formData.pathologies=gid('q-path').value;return true;}},
    {label:'Paso 5',title:'Proteínas favoritas',sub:'¿Qué proteínas más sueles consumir o te gustan? Puedes seleccionar de la lista o escribir las tuyas.',render:function(c){renderChips(c,'proteins',PROTEIN_SUGGESTIONS,'Ejemplo: huevos, pollo, pescado, yogurt griego...');},validate:function(){formData.proteins=gid('q-text').value;return true;}},
    {label:'Paso 6',title:'Carbohidratos favoritos',sub:'¿Qué carbohidratos te gusten y te queden de fácil acceso?',render:function(c){renderChips(c,'carbs',CARB_SUGGESTIONS,'Ejemplo: arroz, papa, avena, pan integral...');},validate:function(){formData.carbs=gid('q-text').value;return true;}},
    {label:'Paso 7',title:'Vegetales favoritos',sub:'¿Qué vegetales sueles consumir o te gustan?',render:function(c){renderChips(c,'vegetables',VEGGIE_SUGGESTIONS,'Ejemplo: brócoli, espinaca, tomate, zanahoria...');},validate:function(){formData.vegetables=gid('q-text').value;return true;}},
    {label:'Paso 8',title:'Frutas favoritas',sub:'¿Qué frutas más te gustan?',render:function(c){renderChips(c,'fruits',FRUIT_SUGGESTIONS,'Ejemplo: manzana, fresa, plátano, piña...');},validate:function(){formData.fruits=gid('q-text').value;return true;}},
    {label:'Paso 9',title:'Grasas favoritas',sub:'¿Qué grasas saludables más te gustan?',render:function(c){renderChips(c,'fats',FAT_SUGGESTIONS,'Ejemplo: aguacate, almendras, aceite de oliva...');},validate:function(){formData.fats=gid('q-text').value;return true;}},
    {label:'Paso 10',title:'Tu horario de comidas',sub:'¿Cuántas comidas logras hacer al día?',render:renderMeals,validate:function(){formData.mealsPerDay=gid('q-meals').value;return formData.mealsPerDay!=='';}},
    {label:'Paso 11',title:'Tu entrenamiento',sub:'¿Cuántos días de gym logras hacer por semana?',render:renderGymDays,validate:function(){formData.gymDays=gid('q-gym').value;return formData.gymDays!=='';}},
    {label:'Paso 12',title:'Duración del entrenamiento',sub:'¿Cuánto tiempo dispones por sesión de entrenamiento?',render:renderSessionTime,validate:function(){formData.sessionTime=gid('q-time').value;return formData.sessionTime!=='';},isFinal:true}
  ];
}

function renderStep(){
  var c=gid('steps-container');
  var step=STEPS[currentStep];
  c.innerHTML='<div class="step on"><div class="step-label">'+step.label+'</div><div class="step-title">'+step.title+'</div><div class="step-sub">'+step.sub+'</div><div id="step-body"></div></div>';
  step.render(gid('step-body'));
  var pct=((currentStep+1)/STEPS.length)*100;
  gid('progress-fill').style.width=pct+'%';
  gid('step-counter').textContent='Paso '+(currentStep+1)+' de '+STEPS.length;
  gid('btn-back').disabled=currentStep===0;
  gid('btn-next').textContent=step.isFinal?'Enviar respuestas':'Siguiente \u2192';
  window.scrollTo({top:0,behavior:'smooth'});
}

function renderBasic(c){
  c.innerHTML='<div class="box">'+
    '<div class="fg"><label>Nombre completo *</label><input class="fi" id="b-name" placeholder="Maria Garcia" value="'+(formData.name||'')+'"/></div>'+
    '<div class="fr">'+
      '<div class="fg"><label>Edad *</label><input class="fi" id="b-age" type="number" value="'+(formData.age||'')+'"/></div>'+
      '<div class="fg"><label>Sexo *</label><select class="fi" id="b-sex"><option value="">--</option><option value="F" '+(formData.sex==='F'?'selected':'')+'>Femenino</option><option value="M" '+(formData.sex==='M'?'selected':'')+'>Masculino</option></select></div>'+
      '<div class="fg"><label>Teléfono</label><input class="fi" id="b-phone" value="'+(formData.phone||'')+'"/></div>'+
    '</div>'+
    '<div class="fg"><label>Email *</label><input class="fi" id="b-email" type="email" value="'+(formData.email||'')+'"/></div>'+
    '<div class="fr2">'+
      '<div class="fg"><label>Estatura (cm)</label><input class="fi" id="b-height" type="number" value="'+(formData.height||'')+'"/></div>'+
      '<div class="fg"><label>Peso (kg)</label><input class="fi" id="b-weight" type="number" step="0.1" value="'+(formData.weight||'')+'"/></div>'+
    '</div>'+
    '<div class="fg"><label>Objetivo principal *</label><select class="fi" id="b-goal"><option value="">--</option>'+
      ['Bajar de peso','Ganar músculo','Body Building','Tonificación','Resistencia','Fuerza','Movilidad','Salud general'].map(function(o){return '<option '+(formData.goal===o?'selected':'')+'>'+o+'</option>';}).join('')+
    '</select></div>'+
  '</div>';
  ['b-name','b-age','b-sex','b-phone','b-email','b-height','b-weight','b-goal'].forEach(function(id){
    var fn=function(){
      formData.name=gid('b-name').value;formData.age=gid('b-age').value;
      formData.sex=gid('b-sex').value;formData.phone=gid('b-phone').value;
      formData.email=gid('b-email').value;formData.height=gid('b-height').value;
      formData.weight=gid('b-weight').value;formData.goal=gid('b-goal').value;
    };
    gid(id).addEventListener('input',fn);
    gid(id).addEventListener('change',fn);
  });
}

function validateBasic(){
  if(!formData.name||!formData.name.trim()){alert('Por favor ingresa tu nombre');return false;}
  if(!formData.age){alert('Por favor ingresa tu edad');return false;}
  if(!formData.sex){alert('Por favor selecciona tu sexo');return false;}
  if(!formData.email||!formData.email.trim()){alert('Por favor ingresa tu email');return false;}
  if(!formData.goal){alert('Por favor selecciona tu objetivo');return false;}
  return true;
}

function renderDailyDiet(c){
  c.innerHTML='<div class="box"><div class="fg"><label>Describe tu día de comidas</label><textarea class="ft" id="q-diet" placeholder="Ejemplo:&#10;Desayuno (7am): 2 huevos revueltos, 1 tostada, café con leche&#10;Media mañana (10am): manzana&#10;Almuerzo (1pm): pollo con arroz y ensalada, jugo natural&#10;Merienda (4pm): yogurt&#10;Cena (8pm): pescado a la plancha con vegetales" style="min-height:240px">'+(formData.dailyDiet||'')+'</textarea></div><div class="hint">Sé lo más específica posible. Incluye snacks, bebidas, postres, etc.</div></div>';
}

function renderSupplements(c){
  c.innerHTML='<div class="box"><div class="fg"><label>Suplementos actuales o de interés</label><textarea class="ft" id="q-supp" placeholder="Ejemplo:&#10;- Whey protein todos los días después del gym&#10;- Multivitamínico en la mañana&#10;- Quiero empezar a tomar creatina pero no sé cuánto" style="min-height:180px">'+(formData.supplements||'')+'</textarea></div><div class="hint">Si no consumes ninguno, escribe "Ninguno". Si quieres empezar, indica qué te interesa.</div></div>';
}

function renderPathologies(c){
  c.innerHTML='<div class="box"><div class="fg"><label>Patologías, enfermedades, lesiones o intolerancias</label><textarea class="ft" id="q-path" placeholder="Ejemplo:&#10;- Lesión de rodilla derecha (hace 2 años)&#10;- Intolerancia a la lactosa&#10;- Hipotiroidismo (tomo medicamento)&#10;- Dolor lumbar ocasional" style="min-height:180px">'+(formData.pathologies||'')+'</textarea></div><div class="hint">Cualquier condición que pueda afectar tu entrenamiento o alimentación. Si no tienes nada, escribe "Ninguna".</div></div>';
}

function renderChips(c,key,suggestions,placeholder){
  var current=formData[key]||'';
  var selected=current.split(',').map(function(s){return s.trim();}).filter(function(s){return s;});
  var h='<div class="box">';
  h+='<div class="fg"><label>Selecciona o escribe</label><textarea class="ft" id="q-text" placeholder="'+placeholder+'" style="min-height:90px">'+current+'</textarea></div>';
  h+='<div style="font-size:11px;color:var(--violet);font-weight:700;letter-spacing:.05em;text-transform:uppercase;margin-top:14px;margin-bottom:6px">Sugerencias (toca para agregar)</div>';
  h+='<div class="chips" id="chips">';
  for(var i=0;i<suggestions.length;i++){
    var s=suggestions[i];
    var on=selected.indexOf(s)>=0?'on':'';
    h+='<div class="chip '+on+'" data-val="'+s+'">'+s+'</div>';
  }
  h+='</div></div>';
  c.innerHTML=h;
  c.querySelectorAll('.chip').forEach(function(chip){
    chip.addEventListener('click',function(){
      var v=chip.dataset.val;
      var ta=gid('q-text');
      var arr=ta.value.split(',').map(function(s){return s.trim();}).filter(function(s){return s;});
      var idx=arr.indexOf(v);
      if(idx>=0){arr.splice(idx,1);chip.classList.remove('on');}
      else{arr.push(v);chip.classList.add('on');}
      ta.value=arr.join(', ');
    });
  });
}

function renderMeals(c){
  var opts=['2 comidas','3 comidas','4 comidas','5 comidas','6 o más comidas'];
  var h='<div class="box"><div class="fg"><label>Cantidad de comidas al día *</label><select class="fi" id="q-meals"><option value="">--</option>';
  for(var i=0;i<opts.length;i++)h+='<option '+(formData.mealsPerDay===opts[i]?'selected':'')+'>'+opts[i]+'</option>';
  h+='</select></div></div>';
  c.innerHTML=h;
}

function renderGymDays(c){
  var opts=['1 día','2 días','3 días','4 días','5 días','6 días','7 días'];
  var h='<div class="box"><div class="fg"><label>Días de gym por semana *</label><select class="fi" id="q-gym"><option value="">--</option>';
  for(var i=0;i<opts.length;i++)h+='<option '+(formData.gymDays===opts[i]?'selected':'')+'>'+opts[i]+'</option>';
  h+='</select></div></div>';
  c.innerHTML=h;
}

function renderSessionTime(c){
  var opts=['30 minutos','45 minutos','60 minutos','75 minutos','90 minutos','120 minutos'];
  var h='<div class="box"><div class="fg"><label>Tiempo disponible por sesión *</label><select class="fi" id="q-time"><option value="">--</option>';
  for(var i=0;i<opts.length;i++)h+='<option '+(formData.sessionTime===opts[i]?'selected':'')+'>'+opts[i]+'</option>';
  h+='</select></div></div>';
  c.innerHTML=h;
}

function nextStep(){
  var step=STEPS[currentStep];
  if(step.validate&&!step.validate())return;
  if(step.isFinal){submitForm();return;}
  if(currentStep<STEPS.length-1){currentStep++;renderStep();}
}

function prevStep(){
  if(currentStep>0){currentStep--;renderStep();}
}

function submitForm(){
  var payload={
    id:'n'+Date.now(),
    date:formData.date,
    name:formData.name,
    age:formData.age,
    sex:formData.sex,
    phone:formData.phone,
    email:formData.email,
    height:formData.height,
    weight:formData.weight,
    goal:formData.goal,
    dailyDiet:formData.dailyDiet,
    supplements:formData.supplements,
    pathologies:formData.pathologies,
    proteins:formData.proteins,
    carbs:formData.carbs,
    vegetables:formData.vegetables,
    fruits:formData.fruits,
    fats:formData.fats,
    mealsPerDay:formData.mealsPerDay,
    gymDays:formData.gymDays,
    sessionTime:formData.sessionTime
  };
  gid('btn-next').disabled=true;
  gid('btn-next').textContent='Enviando...';
  fetch(API_URL,{method:'POST',body:JSON.stringify({action:'saveNutrition',payload:payload})})
    .then(function(r){return r.json();})
    .then(function(resp){
      if(resp.success){
        gid('steps-container').style.display='none';
        gid('bottom-nav').style.display='none';
        gid('thanks').style.display='block';
        window.scrollTo({top:0,behavior:'smooth'});
      }else{
        gid('btn-next').disabled=false;
        gid('btn-next').textContent='Enviar respuestas';
        toast('Error al enviar: '+(resp.error||'desconocido'),true);
      }
    })
    .catch(function(){
      gid('btn-next').disabled=false;
      gid('btn-next').textContent='Enviar respuestas';
      toast('Error de conexión. Intenta de nuevo.',true);
    });
}

document.addEventListener('DOMContentLoaded',function(){
  buildSteps();
  renderStep();
  gid('btn-back').addEventListener('click',prevStep);
  gid('btn-next').addEventListener('click',nextStep);
});
