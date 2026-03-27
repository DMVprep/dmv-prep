// src/data/translations.ts
export const TRANSLATIONS: Record<string, Record<string, {
  text: string;
  choices: string[];
  explanation: string;
}[]>> = {
  es: {
    "traffic-signs": [
      { text: "Que significa una senial octagonal roja?", explanation: "Un octagono rojo es siempre una senial de PARE. Debes detener completamente tu carro antes de la linea blanca.", choices: ["Reducir velocidad", "Detenerse completamente", "Ceder el paso", "No entrar"] },
      { text: "Que significa una senial amarilla en forma de diamante?", explanation: "Las seniales de diamante amarillo son seniales de ADVERTENCIA. Te dicen que tengas cuidado porque algo peligroso puede estar adelante.", choices: ["Parada adelante", "Zona escolar", "Advertencia - ten cuidado", "Limite de velocidad"] },
      { text: "Que muestra generalmente una senial rectangular blanca?", explanation: "Las seniales rectangulares blancas muestran REGLAS que debes seguir, como limites de velocidad o no adelantar.", choices: ["Una advertencia", "Una regla que debes seguir", "Un servicio cercano", "Una guia a destinos"] },
      { text: "Que significa un semaforo rojo intermitente?", explanation: "Una luz roja intermitente significa PARE. Tratala exactamente como una senial de pare. Detente completamente, mira en ambas direcciones.", choices: ["Reducir velocidad", "Parar luego avanzar cuando sea seguro", "Ceder al trafico cruzado", "Proceder con precaucion"] },
      { text: "Que significa una senial en forma de banderin?", explanation: "Una senial de banderin significa ZONA DE NO ADELANTAMIENTO. No puedes pasar al carro de adelante aqui porque es muy peligroso.", choices: ["Ceda el paso adelante", "Zona de no adelantamiento", "El carril termina adelante", "Incorporarse a la derecha"] },
    ],
    "right-of-way": [
      { text: "En una parada de 4 vias, quien va primero?", explanation: "El carro que llego PRIMERO va primero. Si dos carros llegan al mismo tiempo, el carro a la DERECHA va primero.", choices: ["El carro que va recto", "El carro a tu izquierda", "El carro que llego primero", "El vehiculo mas grande"] },
      { text: "Cuando debes ceder el paso a los peatones?", explanation: "Debes SIEMPRE ceder el paso a los peatones en los cruces peatonales. Los peatones tienen el derecho de paso.", choices: ["Solo cuando el trafico es ligero", "Solo en cruces marcados", "Siempre en todos los cruces", "Solo cuando una luz te lo indique"] },
      { text: "Un carro ya esta en la rotonda. Que haces?", explanation: "Los carros ya DENTRO de la rotonda tienen el derecho de paso. Debes CEDER y esperar hasta que haya un espacio seguro.", choices: ["Entrar inmediatamente", "Tocar bocina", "Ceder y esperar un espacio", "Detenerse y esperar"] },
      { text: "Estas girando a la izquierda. Viene trafico en sentido contrario. Que haces?", explanation: "Al girar a la izquierda, debes CEDER al trafico que viene en sentido contrario.", choices: ["Girar rapidamente", "Ceder a todo el trafico contrario", "Parpadear las luces", "Tienes el derecho de paso"] },
      { text: "Un vehiculo de emergencia esta detras de ti con luces y sirena. Que haces?", explanation: "Debes ORILLARTE al lado derecho de la carretera y DETENERTE hasta que el vehiculo de emergencia pase.", choices: ["Acelerar", "Detenerte donde estes", "Orillarte a la derecha y detenerte", "Reducir velocidad pero seguir"] },
    ],
    "speed-limits": [
      { text: "Cual es el limite de velocidad tipico en una zona escolar?", explanation: "Las zonas escolares tienen un limite de velocidad de 15-25 mph cuando hay ninos presentes.", choices: ["10 mph", "15-25 mph", "35 mph", "45 mph"] },
      { text: "Que significa la ley basica de velocidad?", explanation: "Debes manejar a una velocidad SEGURA para las condiciones, incluso si estas por debajo del limite.", choices: ["Siempre maneja al limite", "Maneja seguro segun condiciones", "Los limites no aplican en autopistas", "Puedes ir 10 mph sobre el limite"] },
      { text: "Cual es el limite maximo en la mayoria de autopistas interestatales?", explanation: "La mayoria de autopistas interestatales tienen un limite de 65-70 mph.", choices: ["55 mph", "60 mph", "65-70 mph", "80 mph en todas partes"] },
    ],
    "safe-driving": [
      { text: "Que es la regla de los 3 segundos de distancia?", explanation: "Cuando el carro de adelante pasa un punto fijo, cuenta 3 segundos. Si llegas antes, estas muy cerca.", choices: ["Mantente 3 largos de carro atras", "Espera 3 segundos al detenerte", "Manten 3 segundos de espacio", "Maneja 3 mph mas despacio"] },
      { text: "Cuando esta permitido usar tu telefono mientras manejas?", explanation: "En la mayoria de los estados, usar un telefono de mano mientras se maneja es ILEGAL.", choices: ["En luz roja", "Solo para mensajes cortos", "Con altavoz", "Nunca - primero estaciona"] },
      { text: "Que debes hacer si te sientes somnoliento mientras manejas?", explanation: "Si te sientes somnoliento, sal de la carretera de forma segura, toma un descanso o una siesta corta.", choices: ["Subir el volumen", "Bajar la ventana", "Orillarte y descansar", "Manejar mas rapido"] },
    ],
  },
  zh: {
    "traffic-signs": [
      { text: "红色八边形标志是什么意思？", explanation: "红色八边形始终是停车标志。您必须在白线前完全停车，等到安全后再行驶。", choices: ["减速", "完全停车", "让行", "禁止进入"] },
      { text: "黄色菱形标志是什么意思？", explanation: "黄色菱形标志是警告标志。前方可能有危险，如急转弯或动物穿越。", choices: ["前方停车", "学区", "警告小心", "限速"] },
      { text: "白色矩形标志通常显示什么？", explanation: "白色矩形标志显示您必须遵守的规则，如限速或禁止超车。", choices: ["警告", "必须遵守的规则", "附近服务", "目的地指南"] },
      { text: "闪烁的红色交通灯是什么意思？", explanation: "闪烁红灯表示停车。将其视为停车标志，完全停车后安全时再行驶。", choices: ["减速", "停车安全时再行驶", "让行", "谨慎行驶"] },
      { text: "三角旗形标志是什么意思？", explanation: "三角旗形标志表示禁止超车区。因为太危险，不能超越前方车辆。", choices: ["前方让行", "禁止超车区", "前方车道结束", "向右合并"] },
    ],
    "right-of-way": [
      { text: "在四路停车处，谁先行？", explanation: "先到的车辆先行。如果两辆车同时到达，右侧的车先行。", choices: ["直行车辆", "左侧车辆", "先到的车辆", "最大的车辆"] },
      { text: "何时必须为行人让行？", explanation: "您必须始终在人行横道上为行人让行。行人有优先通行权。", choices: ["仅在交通稀少时", "仅在标记的横道", "始终在所有横道", "仅在交通灯指示时"] },
      { text: "已有车辆在环形交叉路口，您该怎么办？", explanation: "已在环形路口内的车辆有优先权。您必须让行等待安全间隙。", choices: ["立即进入", "鸣喇叭示意", "让行等待间隙", "完全停车等待"] },
      { text: "您正在左转，对面有来车。您该怎么办？", explanation: "左转时必须为对面来车让行，等所有车辆通过后再转弯。", choices: ["快速转弯", "为对面来车让行", "闪灯示意", "您有优先权"] },
      { text: "急救车在您后方开着灯和警报器。您该怎么办？", explanation: "必须靠右侧停车，等急救车完全通过后再移动。", choices: ["加速让路", "就地停车", "靠右停车", "减速继续行驶"] },
    ],
    "speed-limits": [
      { text: "有儿童时学区的典型限速是多少？", explanation: "有儿童时，学区通常限速15-25英里/小时。", choices: ["10英里/小时", "15-25英里/小时", "35英里/小时", "45英里/小时"] },
      { text: "什么是基本速度法则？", explanation: "必须以适合路况的安全速度驾驶，即使低于限速也要保证安全。", choices: ["始终按限速行驶", "根据路况安全行驶", "限速不适用高速公路", "可超速10英里"] },
      { text: "大多数州际高速公路的最高限速是多少？", explanation: "大多数州际高速公路最高限速为65-70英里/小时。", choices: ["55英里/小时", "60英里/小时", "65-70英里/小时", "各处均为80英里"] },
    ],
    "safe-driving": [
      { text: "什么是3秒跟车距离规则？", explanation: "当前车经过固定点时数3秒。如果您在数完之前到达该点，说明跟得太近。", choices: ["保持3个车身距离", "停车后等待3秒", "与前车保持3秒距离", "比车流慢3英里"] },
      { text: "驾驶时什么时候可以使用手机？", explanation: "在大多数州，驾驶时使用手持电话是非法的。", choices: ["红灯时", "仅发短信", "使用免提时", "驾驶时永不使用"] },
      { text: "如果驾驶时感到困倦应该怎么办？", explanation: "疲劳驾驶非常危险。请安全靠边停车休息或小睡一会儿。", choices: ["调大音乐", "摇下车窗", "靠边休息", "开快点赶快到家"] },
    ],
  },
  ar: {
    "traffic-signs": [
      { text: "ماذا تعني اللافتة الحمراء ذات الثمانية اضلاع؟", explanation: "المثمن الاحمر هو دائما علامة توقف. يجب ان تقف بالكامل قبل الخط الابيض.", choices: ["تقليل السرعة", "التوقف تماما", "اعط الاولوية", "لا دخول"] },
      { text: "ماذا تعني اللافتة الصفراء ذات شكل المعين؟", explanation: "اللافتات الصفراء المعينة هي علامات تحذير. تخبرك بان تكون حذرا لان شيئا خطيرا قد يكون امامك.", choices: ["توقف قادم", "منطقة مدرسية", "تحذير كن حذرا", "حد السرعة"] },
      { text: "ماذا تظهر اللافتة المستطيلة البيضاء عادة؟", explanation: "تظهر اللافتات المستطيلة البيضاء القواعد التي يجب اتباعها مثل حدود السرعة.", choices: ["تحذير", "قاعدة يجب اتباعها", "خدمة قريبة", "دليل الوجهات"] },
      { text: "ماذا تعني اشارة المرور الحمراء الوامضة؟", explanation: "الضوء الاحمر الوامض يعني التوقف. توقف تماما وتابع فقط عندما يكون آمنا.", choices: ["تقليل السرعة", "التوقف ثم المتابعة", "اعط الاولوية", "المتابعة بحذر"] },
      { text: "ماذا تعني اللافتة على شكل علم صغير؟", explanation: "لافتة العلم الصغير تعني منطقة عدم التجاوز. لا يمكنك تجاوز السيارة امامك هنا.", choices: ["اعط الاولوية", "منطقة عدم التجاوز", "المسار ينتهي", "ادمج يمينا"] },
    ],
    "right-of-way": [
      { text: "عند تقاطع ذي 4 مسارات توقف، من يمر اولا؟", explanation: "السيارة التي وصلت اولا تمر اولا. اذا وصلت سيارتان في نفس الوقت، السيارة على اليمين تمر اولا.", choices: ["السيارة المتجهة للامام", "السيارة على يسارك", "السيارة التي وصلت اولا", "اكبر مركبة"] },
      { text: "متى يجب ان تعطي الاولوية للمشاة؟", explanation: "يجب ان تعطي الاولوية دائما للمشاة عند ممرات المشاة.", choices: ["فقط عندما يكون المرور خفيفا", "فقط عند ممرات محددة", "دائما عند جميع الممرات", "فقط عند الاشارة"] },
      { text: "سيارة موجودة بالفعل في الدوار. ماذا تفعل؟", explanation: "السيارات الموجودة في الدوار لها حق الاولوية. يجب ان تعطي الاولوية وتنتظر.", choices: ["ادخل فورا", "اعط اشارة بالبوق", "اعط الاولوية وانتظر", "توقف وانتظر"] },
      { text: "انت تنعطف يسارا. ياتي مرور من الاتجاه المعاكس. ماذا تفعل؟", explanation: "عند الانعطاف يسارا يجب ان تعطي الاولوية للمرور القادم.", choices: ["انعطف بسرعة", "اعط الاولوية للمرور القادم", "وضح الاضواء", "لديك حق الاولوية"] },
      { text: "مركبة طوارئ خلفك بانوار وصفارة. ماذا تفعل؟", explanation: "يجب ان تتوقف على الجانب الايمن من الطريق وتنتظر حتى تمر مركبة الطوارئ.", choices: ["اسرع للابتعاد", "توقف اينما كنت", "توقف على اليمين", "قلل السرعة واستمر"] },
    ],
    "speed-limits": [
      { text: "ما هو حد السرعة النموذجي في المنطقة المدرسية؟", explanation: "عادة ما يكون حد السرعة في المناطق المدرسية 15-25 ميلا في الساعة عند وجود الاطفال.", choices: ["10 ميل/ساعة", "15-25 ميل/ساعة", "35 ميل/ساعة", "45 ميل/ساعة"] },
      { text: "ماذا تعني قانون السرعة الاساسي؟", explanation: "يعني انك يجب ان تقود بسرعة آمنة للظروف حتى لو كنت اقل من حد السرعة.", choices: ["قد دائما بحد السرعة", "قد بامان للظروف", "حدود السرعة لا تنطبق", "يمكنك السير 10 ميل فوق الحد"] },
      { text: "ما هو الحد الاقصى للسرعة في معظم الطرق السريعة؟", explanation: "معظم الطرق السريعة بين الولايات لها حد اقصى 65-70 ميلا في الساعة.", choices: ["55 ميل/ساعة", "60 ميل/ساعة", "65-70 ميل/ساعة", "80 ميل في كل مكان"] },
    ],
    "safe-driving": [
      { text: "ما هي قاعدة مسافة المتابعة لـ 3 ثوان؟", explanation: "عندما تمر السيارة الامامية بنقطة ثابتة عد 3 ثوان. اذا وصلت قبل الانتهاء فانت قريب جدا.", choices: ["ابق على مسافة 3 اطوال", "انتظر 3 ثوان بعد التوقف", "احتفظ بمسافة 3 ثوان", "قد 3 ميل ابطا"] },
      { text: "متى يجوز استخدام هاتفك اثناء القيادة؟", explanation: "في معظم الولايات استخدام هاتف محمول اثناء القيادة غير قانوني.", choices: ["عند الضوء الاحمر", "فقط للرسائل القصيرة", "عند استخدام مكبر الصوت", "لا تستخدمه ابدا"] },
      { text: "ماذا يجب ان تفعل اذا بدات تشعر بالنعاس اثناء القيادة؟", explanation: "القيادة مع النعاس خطيرة جدا. توقف على الجانب بامان وخذ استراحة.", choices: ["ارفع صوت الموسيقى", "انزل النافذة", "توقف على الجانب واسترح", "قد بسرعة للوصول للبيت"] },
    ],
  },
};
