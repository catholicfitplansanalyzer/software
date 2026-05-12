var API_URL='https://script.google.com/macros/s/AKfycbxW99Gb8tMCvktp9joQQlGtZ3ERuwJObSVIEEfShupY2V4C3hqKt9b4Ejksd-n3Qer9/exec';

function gid(id){return document.getElementById(id);}
function today(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function toast(m,err){var t=gid('toast');t.textContent=m;t.className='toast on'+(err?' error':'');setTimeout(function(){t.classList.remove('on');},3500);}

// ====== TRANSLATIONS ======
var T={
  en:{
    headerSub:'Nutrition Intake',
    back:'Back',next:'Next',submit:'Submit Answers',sending:'Sending...',
    stepOf:'Step %1 of %2',
    thanksTitle:'Thank you!',
    thanksMsg:'Your information has been submitted successfully. Your coach will review your answers and contact you soon with your personalized plan.',
    thanksClose:'You can close this page.',
    errSend:'Error sending: ',errConn:'Connection error. Try again.',
    valName:'Please enter your name',valAge:'Please enter your age',valSex:'Please select your sex',valEmail:'Please enter your email',valGoal:'Please select your goal',valActivity:'Please select your activity level',
    // Step 1: Basic
    s1_label:'Step 1',s1_title:'Your basic info',s1_sub:"Let's start with some basic information about you.",
    lblName:'Full Name *',lblDate:'Date',lblAge:'Age *',lblSex:'Sex *',lblEmail:'Email *',lblHeight:'Height (cm)',lblWeight:'Weight (kg)',lblGoal:'Main Goal *',
    optSelect:'--',optFemale:'Female',optMale:'Male',
    goalKeys:['weight_loss','muscle_gain','body_building','toning','endurance','strength','mobility','general_health'],
    goalLabels:{weight_loss:'Weight Loss',muscle_gain:'Muscle Gain',body_building:'Body Building',toning:'Toning',endurance:'Endurance',strength:'Strength',mobility:'Mobility',general_health:'General Health'},
    // Step 2: Activity Level
    s2_label:'Step 2',s2_title:'Activity Level',s2_sub:'How active are you on a typical week? (excluding gym sessions)',
    actSedentary:'Sedentary',actSedentaryD:'Desk job, little to no exercise',
    actLight:'Light',actLightD:'Light exercise 1-3 days a week',
    actModerate:'Moderate',actModerateD:'Moderate exercise 3-5 days a week',
    actActive:'Active',actActiveD:'Hard exercise 6-7 days a week',
    actVeryActive:'Very Active',actVeryActiveD:'Very hard exercise + physical job or 2x training',
    // Step 3: Daily Diet
    s3_label:'Step 3',s3_title:'Your current diet',s3_sub:'Write your ENTIRE diet for a normal day. Include times, foods, approximate quantities and drinks.',
    s3_lbl:'Describe your day of meals',
    s3_ph:'Example:\nBreakfast (7am): 2 scrambled eggs, 1 toast, coffee with milk\nMid-morning (10am): apple\nLunch (1pm): chicken with rice and salad, natural juice\nSnack (4pm): yogurt\nDinner (8pm): grilled fish with vegetables',
    s3_hint:'Be as specific as possible. Include snacks, drinks, desserts, etc.',
    // Step 4: Supplements
    s4_label:'Step 4',s4_title:'Supplementation',s4_sub:'Have you taken supplements or do you want to take any? Describe which ones, when and why.',
    s4_lbl:'Current or desired supplements',
    s4_ph:'Example:\n- Whey protein every day after gym\n- Multivitamin in the morning\n- I want to start taking creatine but I dont know how much',
    s4_hint:'If you take none, write "None". If you want to start, indicate what interests you.',
    // Step 5: Pathologies
    s5_label:'Step 5',s5_title:'Health & history',s5_sub:'Write the pathologies, diseases or injuries you have. Even if they seem small, everything counts.',
    s5_lbl:'Pathologies, diseases, injuries or intolerances',
    s5_ph:'Example:\n- Right knee injury (2 years ago)\n- Lactose intolerance\n- Hypothyroidism (taking medication)\n- Occasional lower back pain',
    s5_hint:'Any condition that could affect your training or diet. If you have none, write "None".',
    // Step 6: Proteins
    s6_label:'Step 6',s6_title:'Favorite proteins',s6_sub:'Which proteins do you usually eat or like the most? You can select from the list or write your own.',
    s6_lbl:'Select or write',s6_ph:'Example: eggs, chicken, fish, greek yogurt...',
    s6_chipKeys:['eggs','beef','pork','turkey','chicken','white_fish','salmon','tuna','shrimp','seafood','greek_yogurt','cottage_cheese','tofu','tempeh','protein_powder'],s6_chipLabels:{eggs:'Eggs',beef:'Beef',pork:'Pork',turkey:'Turkey',chicken:'Chicken',white_fish:'White fish',salmon:'Salmon',tuna:'Tuna',shrimp:'Shrimp',seafood:'Seafood',greek_yogurt:'Greek yogurt',cottage_cheese:'Cottage cheese',tofu:'Tofu',tempeh:'Tempeh',protein_powder:'Protein powder'},
    // Step 7: Carbs
    s7_label:'Step 7',s7_title:'Favorite carbs',s7_sub:'Which carbs do you like and have easy access to?',
    s7_lbl:'Select or write',s7_ph:'Example: rice, potato, oats, whole grain bread...',
    s7_chipKeys:['white_rice','brown_rice','potato','sweet_potato','yuca','plantain','pasta','whole_grain_bread','corn_tortilla','flour_tortilla','arepa','beans','lentils','chickpeas','oats','quinoa'],s7_chipLabels:{white_rice:'White rice',brown_rice:'Brown rice',potato:'Potato',sweet_potato:'Sweet potato',yuca:'Yuca',plantain:'Plantain',pasta:'Pasta',whole_grain_bread:'Whole grain bread',corn_tortilla:'Corn tortilla',flour_tortilla:'Flour tortilla',arepa:'Arepa',beans:'Beans',lentils:'Lentils',chickpeas:'Chickpeas',oats:'Oats',quinoa:'Quinoa'},
    // Step 8: Veggies
    s8_label:'Step 8',s8_title:'Favorite vegetables',s8_sub:'Which vegetables do you usually eat or like?',
    s8_lbl:'Select or write',s8_ph:'Example: broccoli, spinach, tomato, carrot...',
    s8_chipKeys:['broccoli','spinach','lettuce','tomato','carrot','cucumber','bell_pepper','zucchini','cauliflower','celery','onion','garlic','avocado','mushrooms','asparagus','kale'],s8_chipLabels:{broccoli:'Broccoli',spinach:'Spinach',lettuce:'Lettuce',tomato:'Tomato',carrot:'Carrot',cucumber:'Cucumber',bell_pepper:'Bell pepper',zucchini:'Zucchini',cauliflower:'Cauliflower',celery:'Celery',onion:'Onion',garlic:'Garlic',avocado:'Avocado',mushrooms:'Mushrooms',asparagus:'Asparagus',kale:'Kale'},
    // Step 9: Fruits
    s9_label:'Step 9',s9_title:'Favorite fruits',s9_sub:'Which fruits do you like the most?',
    s9_lbl:'Select or write',s9_ph:'Example: apple, strawberry, banana, pineapple...',
    s9_chipKeys:['apple','banana','strawberry','blackberry','blueberry','pineapple','mango','watermelon','melon','orange','tangerine','grapes','kiwi','papaya','peach','pear'],s9_chipLabels:{apple:'Apple',banana:'Banana',strawberry:'Strawberry',blackberry:'Blackberry',blueberry:'Blueberry',pineapple:'Pineapple',mango:'Mango',watermelon:'Watermelon',melon:'Melon',orange:'Orange',tangerine:'Tangerine',grapes:'Grapes',kiwi:'Kiwi',papaya:'Papaya',peach:'Peach',pear:'Pear'},
    // Step 10: Fats
    s10_label:'Step 10',s10_title:'Favorite fats',s10_sub:'Which healthy fats do you like the most?',
    s10_lbl:'Select or write',s10_ph:'Example: avocado, almonds, olive oil...',
    s10_chipKeys:['avocado_fat','almonds','walnuts','peanuts','peanut_butter','olive_oil','coconut_oil','butter','chia_seeds','flax_seeds','coconut','olives','cheese'],s10_chipLabels:{avocado_fat:'Avocado',almonds:'Almonds',walnuts:'Walnuts',peanuts:'Peanuts',peanut_butter:'Peanut butter',olive_oil:'Olive oil',coconut_oil:'Coconut oil',butter:'Butter',chia_seeds:'Chia seeds',flax_seeds:'Flax seeds',coconut:'Coconut',olives:'Olives',cheese:'Cheese'},
    // Step 11: Meals
    s11_label:'Step 11',s11_title:'Your meal schedule',s11_sub:'How many meals can you have per day?',
    s11_lbl:'Meals per day *',
    mealsKeys:['2','3','4','5','6+'],
    mealsLabels:{'2':'2 meals','3':'3 meals','4':'4 meals','5':'5 meals','6+':'6 or more meals'},
    // Step 12: Gym days
    s12_label:'Step 12',s12_title:'Your training',s12_sub:'How many days of gym can you do per week?',
    s12_lbl:'Gym days per week *',
    gymKeys:['1','2','3','4','5','6','7'],
    gymLabels:{'1':'1 day','2':'2 days','3':'3 days','4':'4 days','5':'5 days','6':'6 days','7':'7 days'},
    // Step 13: Session time
    s13_label:'Step 13',s13_title:'Training duration',s13_sub:'How much time can you dedicate per training session?',
    s13_lbl:'Available time per session *',
    timeKeys:['30','45','60','75','90','120'],
    timeLabels:{'30':'30 minutes','45':'45 minutes','60':'60 minutes','75':'75 minutes','90':'90 minutes','120':'120 minutes'}
  },
  es:{
    headerSub:'Cuestionario de Nutrición',
    back:'Atrás',next:'Siguiente',submit:'Enviar respuestas',sending:'Enviando...',
    stepOf:'Paso %1 de %2',
    thanksTitle:'¡Gracias!',
    thanksMsg:'Tu información ha sido enviada correctamente. Tu coach recibirá tus respuestas y te contactará pronto con tu plan personalizado.',
    thanksClose:'Puedes cerrar esta página.',
    errSend:'Error al enviar: ',errConn:'Error de conexión. Intenta de nuevo.',
    valName:'Por favor ingresa tu nombre',valAge:'Por favor ingresa tu edad',valSex:'Por favor selecciona tu sexo',valEmail:'Por favor ingresa tu email',valGoal:'Por favor selecciona tu objetivo',valActivity:'Por favor selecciona tu nivel de actividad',
    s1_label:'Paso 1',s1_title:'Tus datos básicos',s1_sub:'Empecemos con información básica sobre ti.',
    lblName:'Nombre completo *',lblDate:'Fecha',lblAge:'Edad *',lblSex:'Sexo *',lblEmail:'Email *',lblHeight:'Estatura (cm)',lblWeight:'Peso (kg)',lblGoal:'Objetivo principal *',
    optSelect:'--',optFemale:'Femenino',optMale:'Masculino',
    goalKeys:['weight_loss','muscle_gain','body_building','toning','endurance','strength','mobility','general_health'],
    goalLabels:{weight_loss:'Bajar de peso',muscle_gain:'Ganar músculo',body_building:'Body Building',toning:'Tonificación',endurance:'Resistencia',strength:'Fuerza',mobility:'Movilidad',general_health:'Salud general'},
    s2_label:'Paso 2',s2_title:'Nivel de actividad',s2_sub:'¿Qué tan activa es tu semana típica? (sin contar el gym)',
    actSedentary:'Sedentario',actSedentaryD:'Trabajo de oficina, poco o nada de ejercicio',
    actLight:'Ligero',actLightD:'Ejercicio ligero 1-3 días a la semana',
    actModerate:'Moderado',actModerateD:'Ejercicio moderado 3-5 días a la semana',
    actActive:'Activo',actActiveD:'Ejercicio fuerte 6-7 días a la semana',
    actVeryActive:'Muy Activo',actVeryActiveD:'Ejercicio muy fuerte + trabajo físico o 2x entrenamientos',
    s3_label:'Paso 3',s3_title:'Tu alimentación actual',s3_sub:'Escribe TODA tu alimentación de un día normal. Incluye horarios, alimentos, cantidades aproximadas y bebidas.',
    s3_lbl:'Describe tu día de comidas',
    s3_ph:'Ejemplo:\nDesayuno (7am): 2 huevos revueltos, 1 tostada, café con leche\nMedia mañana (10am): manzana\nAlmuerzo (1pm): pollo con arroz y ensalada, jugo natural\nMerienda (4pm): yogurt\nCena (8pm): pescado a la plancha con vegetales',
    s3_hint:'Sé lo más específica posible. Incluye snacks, bebidas, postres, etc.',
    s4_label:'Paso 4',s4_title:'Suplementación',s4_sub:'¿Has consumido suplementos o quieres consumirlos? Describe cuáles, cuándo y por qué.',
    s4_lbl:'Suplementos actuales o de interés',
    s4_ph:'Ejemplo:\n- Whey protein todos los días después del gym\n- Multivitamínico en la mañana\n- Quiero empezar a tomar creatina pero no sé cuánto',
    s4_hint:'Si no consumes ninguno, escribe "Ninguno". Si quieres empezar, indica qué te interesa.',
    s5_label:'Paso 5',s5_title:'Salud y antecedentes',s5_sub:'Escribe las patologías, enfermedades o lesiones que tengas. Aunque parezcan pequeñas, todo cuenta.',
    s5_lbl:'Patologías, enfermedades, lesiones o intolerancias',
    s5_ph:'Ejemplo:\n- Lesión de rodilla derecha (hace 2 años)\n- Intolerancia a la lactosa\n- Hipotiroidismo (tomo medicamento)\n- Dolor lumbar ocasional',
    s5_hint:'Cualquier condición que pueda afectar tu entrenamiento o alimentación. Si no tienes nada, escribe "Ninguna".',
    s6_label:'Paso 6',s6_title:'Proteínas favoritas',s6_sub:'¿Qué proteínas más sueles consumir o te gustan? Puedes seleccionar de la lista o escribir las tuyas.',
    s6_lbl:'Selecciona o escribe',s6_ph:'Ejemplo: huevos, pollo, pescado, yogurt griego...',
    s6_chipKeys:['eggs','beef','pork','turkey','chicken','white_fish','salmon','tuna','shrimp','seafood','greek_yogurt','cottage_cheese','tofu','tempeh','protein_powder'],s6_chipLabels:{eggs:'Huevos',beef:'Carne de res',pork:'Carne de cerdo',turkey:'Pavo',chicken:'Pollo',white_fish:'Pescado blanco',salmon:'Salmón',tuna:'Atún',shrimp:'Camarones',seafood:'Mariscos',greek_yogurt:'Yogurt griego',cottage_cheese:'Queso cottage',tofu:'Tofu',tempeh:'Tempeh',protein_powder:'Proteína en polvo'},
    s7_label:'Paso 7',s7_title:'Carbohidratos favoritos',s7_sub:'¿Qué carbohidratos te gusten y te queden de fácil acceso?',
    s7_lbl:'Selecciona o escribe',s7_ph:'Ejemplo: arroz, papa, avena, pan integral...',
    s7_chipKeys:['white_rice','brown_rice','potato','sweet_potato','yuca','plantain','pasta','whole_grain_bread','corn_tortilla','flour_tortilla','arepa','beans','lentils','chickpeas','oats','quinoa'],s7_chipLabels:{white_rice:'Arroz blanco',brown_rice:'Arroz integral',potato:'Papa',sweet_potato:'Camote',yuca:'Yuca',plantain:'Plátano',pasta:'Pasta',whole_grain_bread:'Pan integral',corn_tortilla:'Tortilla de maíz',flour_tortilla:'Tortilla de harina',arepa:'Arepa',beans:'Frijol',lentils:'Lentejas',chickpeas:'Garbanzos',oats:'Avena',quinoa:'Quinoa'},
    s8_label:'Paso 8',s8_title:'Vegetales favoritos',s8_sub:'¿Qué vegetales sueles consumir o te gustan?',
    s8_lbl:'Selecciona o escribe',s8_ph:'Ejemplo: brócoli, espinaca, tomate, zanahoria...',
    s8_chipKeys:['broccoli','spinach','lettuce','tomato','carrot','cucumber','bell_pepper','zucchini','cauliflower','celery','onion','garlic','avocado','mushrooms','asparagus','kale'],s8_chipLabels:{broccoli:'Brócoli',spinach:'Espinaca',lettuce:'Lechuga',tomato:'Tomate',carrot:'Zanahoria',cucumber:'Pepino',bell_pepper:'Pimiento',zucchini:'Calabacín',cauliflower:'Coliflor',celery:'Apio',onion:'Cebolla',garlic:'Ajo',avocado:'Aguacate',mushrooms:'Champiñones',asparagus:'Espárragos',kale:'Kale'},
    s9_label:'Paso 9',s9_title:'Frutas favoritas',s9_sub:'¿Qué frutas más te gustan?',
    s9_lbl:'Selecciona o escribe',s9_ph:'Ejemplo: manzana, fresa, plátano, piña...',
    s9_chipKeys:['apple','banana','strawberry','blackberry','blueberry','pineapple','mango','watermelon','melon','orange','tangerine','grapes','kiwi','papaya','peach','pear'],s9_chipLabels:{apple:'Manzana',banana:'Plátano',strawberry:'Fresa',blackberry:'Mora',blueberry:'Arándano',pineapple:'Piña',mango:'Mango',watermelon:'Sandía',melon:'Melón',orange:'Naranja',tangerine:'Mandarina',grapes:'Uvas',kiwi:'Kiwi',papaya:'Papaya',peach:'Durazno',pear:'Pera'},
    s10_label:'Paso 10',s10_title:'Grasas favoritas',s10_sub:'¿Qué grasas saludables más te gustan?',
    s10_lbl:'Selecciona o escribe',s10_ph:'Ejemplo: aguacate, almendras, aceite de oliva...',
    s10_chipKeys:['avocado_fat','almonds','walnuts','peanuts','peanut_butter','olive_oil','coconut_oil','butter','chia_seeds','flax_seeds','coconut','olives','cheese'],s10_chipLabels:{avocado_fat:'Aguacate',almonds:'Almendras',walnuts:'Nueces',peanuts:'Maní',peanut_butter:'Mantequilla de maní',olive_oil:'Aceite de oliva',coconut_oil:'Aceite de coco',butter:'Mantequilla',chia_seeds:'Semillas de chía',flax_seeds:'Semillas de linaza',coconut:'Coco',olives:'Aceitunas',cheese:'Queso'},
    s11_label:'Paso 11',s11_title:'Tu horario de comidas',s11_sub:'¿Cuántas comidas logras hacer al día?',
    s11_lbl:'Cantidad de comidas al día *',
    mealsKeys:['2','3','4','5','6+'],
    mealsLabels:{'2':'2 comidas','3':'3 comidas','4':'4 comidas','5':'5 comidas','6+':'6 o más comidas'},
    s12_label:'Paso 12',s12_title:'Tu entrenamiento',s12_sub:'¿Cuántos días de gym logras hacer por semana?',
    s12_lbl:'Días de gym por semana *',
    gymKeys:['1','2','3','4','5','6','7'],
    gymLabels:{'1':'1 día','2':'2 días','3':'3 días','4':'4 días','5':'5 días','6':'6 días','7':'7 días'},
    s13_label:'Paso 13',s13_title:'Duración del entrenamiento',s13_sub:'¿Cuánto tiempo dispones por sesión de entrenamiento?',
    s13_lbl:'Tiempo disponible por sesión *',
    timeKeys:['30','45','60','75','90','120'],
    timeLabels:{'30':'30 minutos','45':'45 minutos','60':'60 minutos','75':'75 minutos','90':'90 minutos','120':'120 minutos'}
  }
};

var lang='en';
var formData={
  name:'',date:today(),age:'',sex:'',email:'',height:'',weight:'',goal:'',
  activityLevel:'',
  dailyDiet:'',supplements:'',pathologies:'',
  proteins:'',carbs:'',vegetables:'',fruits:'',fats:'',
  mealsPerDay:'',gymDays:'',sessionTime:''
};
var currentStep=0;
var STEPS=[];

function L(k){return T[lang][k];}

function setLang(newLang){
  lang=newLang;
  document.querySelectorAll('.lang-btn').forEach(function(b){b.classList.toggle('on',b.dataset.lang===lang);});
  gid('header-sub').textContent=L('headerSub');
  gid('lbl-back').textContent=L('back');
  gid('lbl-next').textContent=L('next');
  gid('thanks-title').textContent=L('thanksTitle');
  gid('thanks-msg').textContent=L('thanksMsg');
  gid('thanks-close').textContent=L('thanksClose');
  document.documentElement.lang=lang;
  buildSteps();
  renderStep();
}

function buildSteps(){
  STEPS=[
    {key:'s1',render:renderBasic,validate:validateBasic},
    {key:'s2',render:renderActivity,validate:function(){return formData.activityLevel?true:(alert(L('valActivity')),false);}},
    {key:'s3',render:function(c){renderTextStep(c,'dailyDiet','s3_lbl','s3_ph','s3_hint','q-diet',240);},validate:function(){formData.dailyDiet=gid('q-diet').value;return true;}},
    {key:'s4',render:function(c){renderTextStep(c,'supplements','s4_lbl','s4_ph','s4_hint','q-supp',180);},validate:function(){formData.supplements=gid('q-supp').value;return true;}},
    {key:'s5',render:function(c){renderTextStep(c,'pathologies','s5_lbl','s5_ph','s5_hint','q-path',180);},validate:function(){formData.pathologies=gid('q-path').value;return true;}},
    {key:'s6',render:function(c){renderChips(c,'proteins','s6_chipKeys','s6_lbl','s6_ph');},validate:function(){formData.proteins=gid('q-text').value;return true;}},
    {key:'s7',render:function(c){renderChips(c,'carbs','s7_chipKeys','s7_lbl','s7_ph');},validate:function(){formData.carbs=gid('q-text').value;return true;}},
    {key:'s8',render:function(c){renderChips(c,'vegetables','s8_chipKeys','s8_lbl','s8_ph');},validate:function(){formData.vegetables=gid('q-text').value;return true;}},
    {key:'s9',render:function(c){renderChips(c,'fruits','s9_chipKeys','s9_lbl','s9_ph');},validate:function(){formData.fruits=gid('q-text').value;return true;}},
    {key:'s10',render:function(c){renderChips(c,'fats','s10_chipKeys','s10_lbl','s10_ph');},validate:function(){formData.fats=gid('q-text').value;return true;}},
    {key:'s11',render:function(c){renderSelect(c,'mealsPerDay','s11_lbl','mealsKeys','mealsLabels','q-meals');},validate:function(){formData.mealsPerDay=gid('q-meals').value;return formData.mealsPerDay!=='';}},
    {key:'s12',render:function(c){renderSelect(c,'gymDays','s12_lbl','gymKeys','gymLabels','q-gym');},validate:function(){formData.gymDays=gid('q-gym').value;return formData.gymDays!=='';}},
    {key:'s13',render:function(c){renderSelect(c,'sessionTime','s13_lbl','timeKeys','timeLabels','q-time');},validate:function(){formData.sessionTime=gid('q-time').value;return formData.sessionTime!=='';},isFinal:true}
  ];
}

function renderStep(){
  var c=gid('steps-container');
  var step=STEPS[currentStep];
  var k=step.key;
  c.innerHTML='<div class="step on"><div class="step-label">'+L(k+'_label')+'</div><div class="step-title">'+L(k+'_title')+'</div><div class="step-sub">'+L(k+'_sub')+'</div><div id="step-body"></div></div>';
  step.render(gid('step-body'));
  var pct=((currentStep+1)/STEPS.length)*100;
  gid('progress-fill').style.width=pct+'%';
  gid('step-counter').textContent=L('stepOf').replace('%1',currentStep+1).replace('%2',STEPS.length);
  gid('btn-back').disabled=currentStep===0;
  gid('lbl-next').textContent=step.isFinal?L('submit'):L('next');
  window.scrollTo({top:0,behavior:'smooth'});
}

function renderBasic(c){
  var gKeys=L('goalKeys');var gLabels=L('goalLabels');
  var goalsOpts=gKeys.map(function(k){return '<option value="'+k+'" '+(formData.goal===k?'selected':'')+'>'+gLabels[k]+'</option>';}).join('');
  c.innerHTML='<div class="box">'+
    '<div class="fg"><label>'+L('lblName')+'</label><input class="fi" id="b-name" value="'+(formData.name||'')+'"/></div>'+
    '<div class="fr2">'+
      '<div class="fg"><label>'+L('lblDate')+'</label><input class="fi" id="b-date" type="date" value="'+(formData.date||today())+'"/></div>'+
      '<div class="fg"><label>'+L('lblAge')+'</label><input class="fi" id="b-age" type="number" value="'+(formData.age||'')+'"/></div>'+
    '</div>'+
    '<div class="fr2">'+
      '<div class="fg"><label>'+L('lblSex')+'</label><select class="fi" id="b-sex"><option value="">'+L('optSelect')+'</option><option value="F" '+(formData.sex==='F'?'selected':'')+'>'+L('optFemale')+'</option><option value="M" '+(formData.sex==='M'?'selected':'')+'>'+L('optMale')+'</option></select></div>'+
      '<div class="fg"><label>'+L('lblEmail')+'</label><input class="fi" id="b-email" type="email" value="'+(formData.email||'')+'"/></div>'+
    '</div>'+
    '<div class="fr2">'+
      '<div class="fg"><label>'+L('lblHeight')+'</label><input class="fi" id="b-height" type="number" value="'+(formData.height||'')+'"/></div>'+
      '<div class="fg"><label>'+L('lblWeight')+'</label><input class="fi" id="b-weight" type="number" step="0.1" value="'+(formData.weight||'')+'"/></div>'+
    '</div>'+
    '<div class="fg"><label>'+L('lblGoal')+'</label><select class="fi" id="b-goal"><option value="">'+L('optSelect')+'</option>'+goalsOpts+'</select></div>'+
  '</div>';
  ['b-name','b-date','b-age','b-sex','b-email','b-height','b-weight','b-goal'].forEach(function(id){
    var fn=function(){
      formData.name=gid('b-name').value;formData.date=gid('b-date').value;
      formData.age=gid('b-age').value;formData.sex=gid('b-sex').value;
      formData.email=gid('b-email').value;formData.height=gid('b-height').value;
      formData.weight=gid('b-weight').value;formData.goal=gid('b-goal').value;
    };
    gid(id).addEventListener('input',fn);
    gid(id).addEventListener('change',fn);
  });
}

function validateBasic(){
  if(!formData.name||!formData.name.trim()){alert(L('valName'));return false;}
  if(!formData.age){alert(L('valAge'));return false;}
  if(!formData.sex){alert(L('valSex'));return false;}
  if(!formData.email||!formData.email.trim()){alert(L('valEmail'));return false;}
  if(!formData.goal){alert(L('valGoal'));return false;}
  return true;
}

function renderActivity(c){
  var opts=[
    {k:'sedentary',n:L('actSedentary'),d:L('actSedentaryD')},
    {k:'light',n:L('actLight'),d:L('actLightD')},
    {k:'moderate',n:L('actModerate'),d:L('actModerateD')},
    {k:'active',n:L('actActive'),d:L('actActiveD')},
    {k:'very_active',n:L('actVeryActive'),d:L('actVeryActiveD')}
  ];
  var h='<div class="activity-grid">';
  for(var i=0;i<opts.length;i++){
    var o=opts[i];
    h+='<div class="activity-opt '+(formData.activityLevel===o.k?'on':'')+'" data-act="'+o.k+'"><div class="a-name">'+o.n+'</div><div class="a-desc">'+o.d+'</div></div>';
  }
  h+='</div>';
  c.innerHTML=h;
  c.querySelectorAll('.activity-opt').forEach(function(el){
    el.addEventListener('click',function(){
      c.querySelectorAll('.activity-opt').forEach(function(x){x.classList.remove('on');});
      el.classList.add('on');
      formData.activityLevel=el.dataset.act;
    });
  });
}

function renderTextStep(c,key,lblKey,phKey,hintKey,id,minHeight){
  c.innerHTML='<div class="box"><div class="fg"><label>'+L(lblKey)+'</label><textarea class="ft" id="'+id+'" placeholder="'+L(phKey).replace(/\n/g,'&#10;').replace(/"/g,'&quot;')+'" style="min-height:'+minHeight+'px">'+(formData[key]||'')+'</textarea></div><div class="hint">'+L(hintKey)+'</div></div>';
}

function renderChips(c,key,chipKeysName,lblKey,phKey){
  var chipLabelsName=chipKeysName.replace('Keys','Labels');
  var keys=L(chipKeysName);var labels=L(chipLabelsName);
  // Use current values (already localized labels stored)
  var current=formData[key]||'';
  var selected=current.split(',').map(function(s){return s.trim();}).filter(function(s){return s;});
  var h='<div class="box">';
  h+='<div class="fg"><label>'+L(lblKey)+'</label><textarea class="ft" id="q-text" placeholder="'+L(phKey).replace(/"/g,'&quot;')+'" style="min-height:90px">'+current.replace(/</g,'&lt;')+'</textarea></div>';
  h+='<div style="font-size:11px;color:var(--violet);font-weight:700;letter-spacing:.05em;text-transform:uppercase;margin-top:14px;margin-bottom:6px">'+(lang==='es'?'Sugerencias (toca para agregar)':'Suggestions (tap to add)')+'</div>';
  h+='<div class="chips" id="chips">';
  for(var i=0;i<keys.length;i++){
    var lab=labels[keys[i]];
    var on=selected.indexOf(lab)>=0?'on':'';
    h+='<div class="chip '+on+'" data-val="'+lab.replace(/"/g,'&quot;')+'">'+lab+'</div>';
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

function renderSelect(c,key,lblKey,keysName,labelsName,id){
  var keys=L(keysName);var labels=L(labelsName);
  var h='<div class="box"><div class="fg"><label>'+L(lblKey)+'</label><select class="fi" id="'+id+'"><option value="">'+L('optSelect')+'</option>';
  for(var i=0;i<keys.length;i++)h+='<option value="'+keys[i]+'" '+(formData[key]===keys[i]?'selected':'')+'>'+labels[keys[i]]+'</option>';
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
    id:'n'+Date.now(),date:formData.date,name:formData.name,age:formData.age,sex:formData.sex,
    phone:'',email:formData.email,height:formData.height,weight:formData.weight,goal:formData.goal,
    dailyDiet:formData.dailyDiet,supplements:formData.supplements,pathologies:formData.pathologies,
    proteins:formData.proteins,carbs:formData.carbs,vegetables:formData.vegetables,
    fruits:formData.fruits,fats:formData.fats,
    mealsPerDay:formData.mealsPerDay,gymDays:formData.gymDays,sessionTime:formData.sessionTime,
    activityLevel:formData.activityLevel,language:lang
  };
  gid('btn-next').disabled=true;
  gid('lbl-next').textContent=L('sending');
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
        gid('lbl-next').textContent=L('submit');
        toast(L('errSend')+(resp.error||'unknown'),true);
      }
    })
    .catch(function(){
      gid('btn-next').disabled=false;
      gid('lbl-next').textContent=L('submit');
      toast(L('errConn'),true);
    });
}

document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('.lang-btn').forEach(function(b){
    b.addEventListener('click',function(){setLang(b.dataset.lang);});
  });
  setLang('en');
  gid('btn-back').addEventListener('click',prevStep);
  gid('btn-next').addEventListener('click',nextStep);
});
