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
    s6_label:'Step 6',s6_title:'Favorite proteins',s6_sub:'Which proteins do you usually eat or like the most? Includes animal AND plant-based options. Select all that apply or write your own.',
    s6_lbl:'Select all that apply (animal + plant)',s6_ph:'Example: eggs, chicken breast, tofu, lentils...',
    s6_chipKeys:['eggs','egg_whites','chicken_breast','chicken_thigh','turkey_breast','ground_turkey','beef_lean','beef_steak','pork_tenderloin','ham','bacon','salmon','tuna','white_fish','tilapia','cod','sardines','shrimp','seafood','squid','greek_yogurt','cottage_cheese','low_fat_cheese','milk','whey_protein','casein_protein','tofu','tempeh','seitan','edamame','lentils_protein','beans_protein','chickpeas_protein','black_beans','quinoa_protein','plant_protein_powder','hemp_seeds','nutritional_yeast','peanut_butter_protein','almond_butter'],s6_chipLabels:{eggs:'Eggs',egg_whites:'Egg whites',chicken_breast:'Chicken breast',chicken_thigh:'Chicken thigh',turkey_breast:'Turkey breast',ground_turkey:'Ground turkey',beef_lean:'Lean beef',beef_steak:'Beef steak',pork_tenderloin:'Pork tenderloin',ham:'Ham',bacon:'Bacon (lean)',salmon:'Salmon',tuna:'Tuna',white_fish:'White fish',tilapia:'Tilapia',cod:'Cod',sardines:'Sardines',shrimp:'Shrimp',seafood:'Seafood mix',squid:'Squid/Calamari',greek_yogurt:'Greek yogurt',cottage_cheese:'Cottage cheese',low_fat_cheese:'Low-fat cheese',milk:'Milk',whey_protein:'Whey protein',casein_protein:'Casein protein',tofu:'Tofu',tempeh:'Tempeh',seitan:'Seitan',edamame:'Edamame',lentils_protein:'Lentils',beans_protein:'Beans',chickpeas_protein:'Chickpeas',black_beans:'Black beans',quinoa_protein:'Quinoa',plant_protein_powder:'Plant protein powder',hemp_seeds:'Hemp seeds',nutritional_yeast:'Nutritional yeast',peanut_butter_protein:'Peanut butter',almond_butter:'Almond butter'},
    // Step 7: Carbs
    s7_label:'Step 7',s7_title:'Favorite carbs',s7_sub:'Which carbs do you like and have easy access to?',
    s7_lbl:'Select or write',s7_ph:'Example: rice, potato, oats, whole grain bread...',
    s7_chipKeys:['white_rice','brown_rice','jasmine_rice','basmati_rice','wild_rice','potato','sweet_potato','red_potato','yuca','plantain','green_plantain','pasta','whole_wheat_pasta','rice_pasta','whole_grain_bread','white_bread','sourdough','bagel','english_muffin','pita','corn_tortilla','flour_tortilla','wheat_tortilla','arepa','beans','black_beans','pinto_beans','kidney_beans','lentils','chickpeas','oats','rolled_oats','oat_bran','quinoa','couscous','barley','farro','buckwheat','millet','rice_cake','crackers','pretzels','popcorn','granola'],s7_chipLabels:{white_rice:'White rice',brown_rice:'Brown rice',jasmine_rice:'Jasmine rice',basmati_rice:'Basmati rice',wild_rice:'Wild rice',potato:'Potato',sweet_potato:'Sweet potato',red_potato:'Red potato',yuca:'Yuca',plantain:'Plantain (ripe)',green_plantain:'Green plantain',pasta:'Pasta',whole_wheat_pasta:'Whole wheat pasta',rice_pasta:'Rice pasta',whole_grain_bread:'Whole grain bread',white_bread:'White bread',sourdough:'Sourdough bread',bagel:'Bagel',english_muffin:'English muffin',pita:'Pita bread',corn_tortilla:'Corn tortilla',flour_tortilla:'Flour tortilla',wheat_tortilla:'Wheat tortilla',arepa:'Arepa',beans:'Beans',black_beans:'Black beans',pinto_beans:'Pinto beans',kidney_beans:'Kidney beans',lentils:'Lentils',chickpeas:'Chickpeas',oats:'Oats',rolled_oats:'Rolled oats',oat_bran:'Oat bran',quinoa:'Quinoa',couscous:'Couscous',barley:'Barley',farro:'Farro',buckwheat:'Buckwheat',millet:'Millet',rice_cake:'Rice cakes',crackers:'Crackers',pretzels:'Pretzels',popcorn:'Popcorn',granola:'Granola'},
    // Step 8: Veggies
    s8_label:'Step 8',s8_title:'Favorite vegetables',s8_sub:'Which vegetables do you usually eat or like?',
    s8_lbl:'Select or write',s8_ph:'Example: broccoli, spinach, tomato, carrot...',
    s8_chipKeys:['broccoli','spinach','lettuce','romaine','arugula','tomato','cherry_tomato','carrot','cucumber','bell_pepper','red_pepper','jalapeno','zucchini','squash','pumpkin','cauliflower','brussels_sprouts','cabbage','red_cabbage','celery','onion','red_onion','green_onion','garlic','ginger','avocado','mushrooms','portobello','asparagus','kale','swiss_chard','collard_greens','green_beans','peas','snow_peas','okra','eggplant','radish','beets','turnip','leek','artichoke','bok_choy','watercress','endive'],s8_chipLabels:{broccoli:'Broccoli',spinach:'Spinach',lettuce:'Lettuce',romaine:'Romaine lettuce',arugula:'Arugula',tomato:'Tomato',cherry_tomato:'Cherry tomato',carrot:'Carrot',cucumber:'Cucumber',bell_pepper:'Bell pepper',red_pepper:'Red pepper',jalapeno:'Jalapeño',zucchini:'Zucchini',squash:'Squash',pumpkin:'Pumpkin',cauliflower:'Cauliflower',brussels_sprouts:'Brussels sprouts',cabbage:'Cabbage',red_cabbage:'Red cabbage',celery:'Celery',onion:'Onion',red_onion:'Red onion',green_onion:'Green onion',garlic:'Garlic',ginger:'Ginger',avocado:'Avocado',mushrooms:'Mushrooms',portobello:'Portobello',asparagus:'Asparagus',kale:'Kale',swiss_chard:'Swiss chard',collard_greens:'Collard greens',green_beans:'Green beans',peas:'Peas',snow_peas:'Snow peas',okra:'Okra',eggplant:'Eggplant',radish:'Radish',beets:'Beets',turnip:'Turnip',leek:'Leek',artichoke:'Artichoke',bok_choy:'Bok choy',watercress:'Watercress',endive:'Endive'},
    // Step 9: Fruits
    s9_label:'Step 9',s9_title:'Favorite fruits',s9_sub:'Which fruits do you like the most?',
    s9_lbl:'Select or write',s9_ph:'Example: apple, strawberry, banana, pineapple...',
    s9_chipKeys:['apple','green_apple','banana','strawberry','blackberry','blueberry','raspberry','cranberry','pineapple','mango','watermelon','melon','cantaloupe','honeydew','orange','tangerine','grapefruit','lemon','lime','grapes','red_grapes','kiwi','papaya','peach','pear','plum','cherry','apricot','nectarine','pomegranate','fig','date','dried_fruit','raisins','coconut_fruit','passion_fruit','guava','dragon_fruit','starfruit','lychee'],s9_chipLabels:{apple:'Apple',green_apple:'Green apple',banana:'Banana',strawberry:'Strawberry',blackberry:'Blackberry',blueberry:'Blueberry',raspberry:'Raspberry',cranberry:'Cranberry',pineapple:'Pineapple',mango:'Mango',watermelon:'Watermelon',melon:'Melon',cantaloupe:'Cantaloupe',honeydew:'Honeydew',orange:'Orange',tangerine:'Tangerine',grapefruit:'Grapefruit',lemon:'Lemon',lime:'Lime',grapes:'Grapes',red_grapes:'Red grapes',kiwi:'Kiwi',papaya:'Papaya',peach:'Peach',pear:'Pear',plum:'Plum',cherry:'Cherry',apricot:'Apricot',nectarine:'Nectarine',pomegranate:'Pomegranate',fig:'Fig',date:'Date',dried_fruit:'Dried fruit',raisins:'Raisins',coconut_fruit:'Coconut',passion_fruit:'Passion fruit',guava:'Guava',dragon_fruit:'Dragon fruit',starfruit:'Starfruit',lychee:'Lychee'},
    // Step 10: Fats
    s10_label:'Step 10',s10_title:'Favorite fats',s10_sub:'Which healthy fats do you like the most?',
    s10_lbl:'Select or write',s10_ph:'Example: avocado, almonds, olive oil...',
    s10_chipKeys:['avocado_fat','almonds','walnuts','peanuts','cashews','pistachios','pecans','brazil_nuts','macadamia','mixed_nuts','peanut_butter_fat','almond_butter_fat','cashew_butter','tahini','olive_oil','coconut_oil','avocado_oil','sesame_oil','butter','ghee','chia_seeds','flax_seeds','pumpkin_seeds','sunflower_seeds','sesame_seeds','coconut','olives','black_olives','cheese','feta','parmesan','blue_cheese','cream_cheese','dark_chocolate','mayo','sour_cream'],s10_chipLabels:{avocado_fat:'Avocado',almonds:'Almonds',walnuts:'Walnuts',peanuts:'Peanuts',cashews:'Cashews',pistachios:'Pistachios',pecans:'Pecans',brazil_nuts:'Brazil nuts',macadamia:'Macadamia nuts',mixed_nuts:'Mixed nuts',peanut_butter_fat:'Peanut butter',almond_butter_fat:'Almond butter',cashew_butter:'Cashew butter',tahini:'Tahini',olive_oil:'Olive oil',coconut_oil:'Coconut oil',avocado_oil:'Avocado oil',sesame_oil:'Sesame oil',butter:'Butter',ghee:'Ghee',chia_seeds:'Chia seeds',flax_seeds:'Flax seeds',pumpkin_seeds:'Pumpkin seeds',sunflower_seeds:'Sunflower seeds',sesame_seeds:'Sesame seeds',coconut:'Coconut',olives:'Olives',black_olives:'Black olives',cheese:'Cheese',feta:'Feta cheese',parmesan:'Parmesan',blue_cheese:'Blue cheese',cream_cheese:'Cream cheese',dark_chocolate:'Dark chocolate',mayo:'Mayonnaise',sour_cream:'Sour cream'},
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
    s6_label:'Paso 6',s6_title:'Proteínas favoritas',s6_sub:'¿Qué proteínas más sueles consumir o te gustan? Incluye opciones animales Y vegetales. Selecciona todas las que apliquen.',
    s6_lbl:'Selecciona todas las que apliquen (animales y vegetales)',s6_ph:'Ejemplo: huevos, pechuga de pollo, tofu, lentejas...',
    s6_chipKeys:['eggs','egg_whites','chicken_breast','chicken_thigh','turkey_breast','ground_turkey','beef_lean','beef_steak','pork_tenderloin','ham','bacon','salmon','tuna','white_fish','tilapia','cod','sardines','shrimp','seafood','squid','greek_yogurt','cottage_cheese','low_fat_cheese','milk','whey_protein','casein_protein','tofu','tempeh','seitan','edamame','lentils_protein','beans_protein','chickpeas_protein','black_beans','quinoa_protein','plant_protein_powder','hemp_seeds','nutritional_yeast','peanut_butter_protein','almond_butter'],s6_chipLabels:{eggs:'Huevos',egg_whites:'Claras de huevo',chicken_breast:'Pechuga de pollo',chicken_thigh:'Muslo de pollo',turkey_breast:'Pechuga de pavo',ground_turkey:'Pavo molido',beef_lean:'Carne magra de res',beef_steak:'Bistec',pork_tenderloin:'Lomo de cerdo',ham:'Jamón',bacon:'Tocino (magro)',salmon:'Salmón',tuna:'Atún',white_fish:'Pescado blanco',tilapia:'Tilapia',cod:'Bacalao',sardines:'Sardinas',shrimp:'Camarones',seafood:'Mariscos',squid:'Calamar',greek_yogurt:'Yogurt griego',cottage_cheese:'Queso cottage',low_fat_cheese:'Queso bajo en grasa',milk:'Leche',whey_protein:'Proteína whey',casein_protein:'Proteína caseína',tofu:'Tofu',tempeh:'Tempeh',seitan:'Seitán',edamame:'Edamame',lentils_protein:'Lentejas',beans_protein:'Frijoles',chickpeas_protein:'Garbanzos',black_beans:'Frijoles negros',quinoa_protein:'Quinoa',plant_protein_powder:'Proteína vegetal en polvo',hemp_seeds:'Semillas de cáñamo',nutritional_yeast:'Levadura nutricional',peanut_butter_protein:'Mantequilla de maní',almond_butter:'Mantequilla de almendras'},
    s7_label:'Paso 7',s7_title:'Carbohidratos favoritos',s7_sub:'¿Qué carbohidratos te gusten y te queden de fácil acceso?',
    s7_lbl:'Selecciona o escribe',s7_ph:'Ejemplo: arroz, papa, avena, pan integral...',
    s7_chipKeys:['white_rice','brown_rice','jasmine_rice','basmati_rice','wild_rice','potato','sweet_potato','red_potato','yuca','plantain','green_plantain','pasta','whole_wheat_pasta','rice_pasta','whole_grain_bread','white_bread','sourdough','bagel','english_muffin','pita','corn_tortilla','flour_tortilla','wheat_tortilla','arepa','beans','black_beans','pinto_beans','kidney_beans','lentils','chickpeas','oats','rolled_oats','oat_bran','quinoa','couscous','barley','farro','buckwheat','millet','rice_cake','crackers','pretzels','popcorn','granola'],s7_chipLabels:{white_rice:'Arroz blanco',brown_rice:'Arroz integral',jasmine_rice:'Arroz jazmín',basmati_rice:'Arroz basmati',wild_rice:'Arroz salvaje',potato:'Papa',sweet_potato:'Camote',red_potato:'Papa roja',yuca:'Yuca',plantain:'Plátano maduro',green_plantain:'Plátano verde',pasta:'Pasta',whole_wheat_pasta:'Pasta integral',rice_pasta:'Pasta de arroz',whole_grain_bread:'Pan integral',white_bread:'Pan blanco',sourdough:'Pan masa madre',bagel:'Bagel',english_muffin:'Muffin inglés',pita:'Pan pita',corn_tortilla:'Tortilla de maíz',flour_tortilla:'Tortilla de harina',wheat_tortilla:'Tortilla de trigo',arepa:'Arepa',beans:'Frijol',black_beans:'Frijoles negros',pinto_beans:'Frijoles pintos',kidney_beans:'Frijoles rojos',lentils:'Lentejas',chickpeas:'Garbanzos',oats:'Avena',rolled_oats:'Avena en hojuelas',oat_bran:'Salvado de avena',quinoa:'Quinoa',couscous:'Cuscús',barley:'Cebada',farro:'Farro',buckwheat:'Trigo sarraceno',millet:'Mijo',rice_cake:'Tortitas de arroz',crackers:'Galletas saladas',pretzels:'Pretzels',popcorn:'Palomitas',granola:'Granola'},
    s8_label:'Paso 8',s8_title:'Vegetales favoritos',s8_sub:'¿Qué vegetales sueles consumir o te gustan?',
    s8_lbl:'Selecciona o escribe',s8_ph:'Ejemplo: brócoli, espinaca, tomate, zanahoria...',
    s8_chipKeys:['broccoli','spinach','lettuce','romaine','arugula','tomato','cherry_tomato','carrot','cucumber','bell_pepper','red_pepper','jalapeno','zucchini','squash','pumpkin','cauliflower','brussels_sprouts','cabbage','red_cabbage','celery','onion','red_onion','green_onion','garlic','ginger','avocado','mushrooms','portobello','asparagus','kale','swiss_chard','collard_greens','green_beans','peas','snow_peas','okra','eggplant','radish','beets','turnip','leek','artichoke','bok_choy','watercress','endive'],s8_chipLabels:{broccoli:'Brócoli',spinach:'Espinaca',lettuce:'Lechuga',romaine:'Lechuga romana',arugula:'Rúcula',tomato:'Tomate',cherry_tomato:'Tomate cherry',carrot:'Zanahoria',cucumber:'Pepino',bell_pepper:'Pimiento',red_pepper:'Pimiento rojo',jalapeno:'Jalapeño',zucchini:'Calabacín',squash:'Calabaza amarilla',pumpkin:'Calabaza',cauliflower:'Coliflor',brussels_sprouts:'Coles de Bruselas',cabbage:'Repollo',red_cabbage:'Repollo morado',celery:'Apio',onion:'Cebolla',red_onion:'Cebolla morada',green_onion:'Cebolla verde',garlic:'Ajo',ginger:'Jengibre',avocado:'Aguacate',mushrooms:'Champiñones',portobello:'Portobello',asparagus:'Espárragos',kale:'Kale',swiss_chard:'Acelga',collard_greens:'Berza',green_beans:'Judías verdes',peas:'Guisantes',snow_peas:'Guisantes nieve',okra:'Quingombó',eggplant:'Berenjena',radish:'Rábano',beets:'Remolacha',turnip:'Nabo',leek:'Puerro',artichoke:'Alcachofa',bok_choy:'Bok choy',watercress:'Berros',endive:'Endivia'},
    s9_label:'Paso 9',s9_title:'Frutas favoritas',s9_sub:'¿Qué frutas más te gustan?',
    s9_lbl:'Selecciona o escribe',s9_ph:'Ejemplo: manzana, fresa, plátano, piña...',
    s9_chipKeys:['apple','green_apple','banana','strawberry','blackberry','blueberry','raspberry','cranberry','pineapple','mango','watermelon','melon','cantaloupe','honeydew','orange','tangerine','grapefruit','lemon','lime','grapes','red_grapes','kiwi','papaya','peach','pear','plum','cherry','apricot','nectarine','pomegranate','fig','date','dried_fruit','raisins','coconut_fruit','passion_fruit','guava','dragon_fruit','starfruit','lychee'],s9_chipLabels:{apple:'Manzana',green_apple:'Manzana verde',banana:'Plátano',strawberry:'Fresa',blackberry:'Mora',blueberry:'Arándano',raspberry:'Frambuesa',cranberry:'Arándano rojo',pineapple:'Piña',mango:'Mango',watermelon:'Sandía',melon:'Melón',cantaloupe:'Melón cantalupo',honeydew:'Melón verde',orange:'Naranja',tangerine:'Mandarina',grapefruit:'Toronja',lemon:'Limón',lime:'Lima',grapes:'Uvas',red_grapes:'Uvas rojas',kiwi:'Kiwi',papaya:'Papaya',peach:'Durazno',pear:'Pera',plum:'Ciruela',cherry:'Cereza',apricot:'Albaricoque',nectarine:'Nectarina',pomegranate:'Granada',fig:'Higo',date:'Dátil',dried_fruit:'Fruta deshidratada',raisins:'Pasas',coconut_fruit:'Coco',passion_fruit:'Maracuyá',guava:'Guayaba',dragon_fruit:'Pitahaya',starfruit:'Carambola',lychee:'Lychee'},
    s10_label:'Paso 10',s10_title:'Grasas favoritas',s10_sub:'¿Qué grasas saludables más te gustan?',
    s10_lbl:'Selecciona o escribe',s10_ph:'Ejemplo: aguacate, almendras, aceite de oliva...',
    s10_chipKeys:['avocado_fat','almonds','walnuts','peanuts','cashews','pistachios','pecans','brazil_nuts','macadamia','mixed_nuts','peanut_butter_fat','almond_butter_fat','cashew_butter','tahini','olive_oil','coconut_oil','avocado_oil','sesame_oil','butter','ghee','chia_seeds','flax_seeds','pumpkin_seeds','sunflower_seeds','sesame_seeds','coconut','olives','black_olives','cheese','feta','parmesan','blue_cheese','cream_cheese','dark_chocolate','mayo','sour_cream'],s10_chipLabels:{avocado_fat:'Aguacate',almonds:'Almendras',walnuts:'Nueces',peanuts:'Maní',cashews:'Anacardos',pistachios:'Pistachos',pecans:'Pecanas',brazil_nuts:'Nueces de Brasil',macadamia:'Macadamias',mixed_nuts:'Frutos secos mixtos',peanut_butter_fat:'Mantequilla de maní',almond_butter_fat:'Mantequilla de almendras',cashew_butter:'Mantequilla de anacardos',tahini:'Tahini',olive_oil:'Aceite de oliva',coconut_oil:'Aceite de coco',avocado_oil:'Aceite de aguacate',sesame_oil:'Aceite de sésamo',butter:'Mantequilla',ghee:'Ghee',chia_seeds:'Semillas de chía',flax_seeds:'Semillas de linaza',pumpkin_seeds:'Semillas de calabaza',sunflower_seeds:'Semillas de girasol',sesame_seeds:'Semillas de sésamo',coconut:'Coco',olives:'Aceitunas',black_olives:'Aceitunas negras',cheese:'Queso',feta:'Queso feta',parmesan:'Queso parmesano',blue_cheese:'Queso azul',cream_cheese:'Queso crema',dark_chocolate:'Chocolate amargo',mayo:'Mayonesa',sour_cream:'Crema agria'},
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
