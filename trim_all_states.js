const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

// ── KEEP SETS ─────────────────────────────────────────────────────────────────
// Questions to KEEP. Everything else in the same concept group gets deleted.

// ── TEXAS ────────────────────────────────────────────────────────────────────

const TX_KEEP = new Set([
  // speed:urban (keep 6)
  'cmn3ewwgb00c797ugaqbmdk9u', // default speed urban districts → 30 mph
  'cmn3eyxj900j797ugvhlfqej1', // downtown Dallas rush hour → 30 mph
  'cmn3ewxus00dj97uggdl4myoy', // school zone vs urban difference → 10 mph slower
  'cmms02b54042jf74y55fz6q64', // which road 70 MPH outside urban → numbered highways
  'cmms04baq048df74yme2cavuw', // which road 60 MPH outside urban → unnumbered
  'cmn3eyzm100l797ugu302cts5', // Ranch Road 12 outside city → unnumbered 60 mph

  // speed:school-zone (keep 4)
  'cmn3eww7200bv97ug0bxiv6tp', // max speed school zone children present → 20 mph
  'cmn3ewybv00e197ugxz1z359q', // when is 20 mph enforced → when children present
  'cmn3exv7r00fp97ugpofmfyrs', // school zone no children → regular posted limit
  'cmn3ewx1300cp97ugl4kvv8yh', // speed school zone children → fine doubled

  // speed:alley (keep 3)
  'cmn3ewwbv00c197ug7zei35n2', // speed limit residential alleys → 15 mph
  'cmn3ewxqh00dd97ugh713r14h', // lowest speed limit TX → residential alleys
  'cmn3ewz4c00f197ug40kdpowd', // difference urban/alley → 15 mph faster

  // speed:following-distance (keep 4)
  'cmn3ezvtg00lv97ugkod1sy8x', // minimum following distance → 2 seconds
  'cmn3ezy5400od97ugy5eh2s8u', // factor requiring more following → poor weather
  'cmn3f1wlp00tv97ug8sbs0xph', // how to measure 2-second rule → fixed object count
  'cmn3f1xih00uv97ugffybsi1m', // adverse weather → increase beyond 2-second

  // row:pedestrian (keep 6)
  'cmmrzqf7x038lf74ywhelwgk6', // pedestrian at marked crosswalk → yield
  'cmn3evm39008d97ughiapp12q', // pedestrian unmarked crosswalk → yield
  'cmmrztcgq03fzf74ykrp7d13r', // turning right → yield pedestrians
  'cmmrzqdta037ff74y8pn3swc2', // left turn → yield oncoming and pedestrians
  'cmmrzyc3l03stf74yl7uetxvw', // right turn on red → stop yield
  'cmn3evo0k00ap97ug3c8delvd', // u-turn → yield all vehicles pedestrians

  // row:school-bus (keep 4)
  'cmmrzqgnl03a5f74yod2mx628', // stop arm extended → both directions unless median
  'cmmrzybiv03s1f74yxho1ulfg', // red lights flashing → stop remain stopped
  'cmn3evmj9008v97ugysks7mlf', // yellow flashing lights → slow down prepare to stop
  'cmn3evniw00a197ug8nlco2oy', // opposite side divided highway → continue normal speed

  // row:move-over (keep 4)
  'cmn3evljk007p97ugx81bit0d', // move over law stopped emergency → move or slow 20 below
  'cmn3evn42009j97ugrjhzouiv', // fire truck shoulder → 20 mph below posted
  'cmms0ajbs04s7f74yj757op1b', // when does move over apply → emergency service vehicles
  'cmms08hpm04mdf74ywgnocsz2', // what move over require → reduce speed

  // row:railroad-stop (keep 4)
  'cmmrzi29z02k3f74yla6ylqtf', // how far stop from tracks → 15 to 50 feet
  'cmmrzjprx02pxf74yq6ft4lh7', // proper stop distance → 15 to 50 feet
  'cmms0ciz304trf74y1s4bhl97', // must stop at least → 15 feet
  'cmmrzna9g033xf74ytzco5gyu', // how far park from railroad → 50 feet

  // safe:right-turn-red (keep 4)
  'cmmrzi3qz02mff74yt77pnh5a', // right turn on red → unless posted otherwise
  'cmn3ezwvy00n197ug6tfj3rog', // before right turn red → complete stop first
  'cmn3ezxtd00o197ugxaflfeov', // when illegal right turn red → sign prohibits
  'cmn3f1vi900sp97ug92q6ment', // what must do first → complete stop yield all

  // safe:park-crosswalk (keep 3)
  'cmn3ezw9p00md97ugqybalhbl', // required distance crosswalk → 20 feet
  'cmmrzv78t03l1f74yl9qepxgc', // minimum parking distance → 20 feet
  'cmmrzi3z502mtf74yciyh8b9j', // how far park crosswalk → 20 feet

  // safe:park-railroad (keep 3)
  'cmmrzna9g033xf74ytzco5gyu', // how far park railroad → 50 feet
  'cmms08gvl04l7f74y0k302d50', // how far from railroad crossing → 50 feet
  'cmmrzi4nz02nzf74ybscdkdr6', // how far park from tracks → 50 feet

  // safe:park-hydrant (keep 3)
  'cmn3ezw4g00m797ugnwl7qb3s', // how far from fire hydrant → 15 feet
  'cmmrzljuy030ff74y5s20x8og', // minimum parking distance hydrant → 15 feet
  'cmmrzi2rz02kvf74ybognxdmo', // how far park fire hydrant → 15 feet

  // safe:passing-rules (keep 4)
  'cmmrzi4ft02nlf74yoj0tq26g', // how far intersection passing prohibited → 100 feet
  'cmmrzi3iv02m1f74y5aprkot3', // how far railroad crossing passing → 100 feet
  'cmms0ckv104whf74y7z8mu7ye', // when passing NOT permitted → 100 feet intersection/railroad
  'cmmrzv65r03jhf74yflhl0ia8', // how close railroad crossing → within 100 feet

  // alcohol:dwi-penalty (keep 5)
  'cmn3f2obd00vp97ugw1z5idsu', // max fine first DWI → $2,000
  'cmn3f2p2300wj97ugnxp3209o', // max fine second DWI → $4,000
  'cmn3f2qus00y797ug4yzlmgya', // child passenger felony DWI → under 15
  'cmn3f4q5t012v97ug14bazt2x', // TX intoxication definition → 0.08 or loss of faculties
  'cmn3f5ndq015p97ugk42sr7rk', // lookback period DWI → lifetime

  // license:gdl-curfew (keep 4)
  'cmn3f6gqo018v97ugtpi5xlhm', // restricted license prohibited hours → midnight to 5AM
  'cmms08gkx04ktf74ybx6facvs', // teen drive 2AM to job → yes work exception
  'cmms0cipa04tdf74yp72v6pnk', // valid exception curfew → driving to work
  'cmn3f7dih01bv97uguzo6ordo', // when restriction begins → midnight

  // license:learner-age (keep 3)
  'cmn3f6fne017v97ugrwyzfdbq', // at what age learner permit → 15
  'cmn3f7e5u01cp97ug6ncc3347', // bypass learner phase → 18
  'cmmrzi5ca02p5f74yehswria0', // TX resident learner permit → 15 years old

  // row:emergency-vehicle (keep 5)
  'cmn3evljk007p97ugx81bit0d', // move over law → move or slow 20 below
  'cmmrzt91f03dnf74ypvb3lhqh', // must yield emergency → flashing lights sirens
  'cmmrzycvr03tzf74yx2af6c6s', // emergency vehicle behind → pull right stop
  'cmmrzqfzk039df74yh96dern1', // emergency vehicle flashing → pull right stop
  'cmmrzy9mk03pbf74yptqwn6fh', // approaching intersection emergency → move over slow

  // signs:warning-shape (keep 5)
  'cmn3eu2ec003j97ug5mtijj71', // yellow diamond typically → warning road conditions
  'cmn3et8i7002197ugwh1sdiwv', // yellow diamond two merging arrows → merging ahead
  'cmn3et913002j97ugh578dbdk', // yellow diamond SLIPPERY → slippery when wet
  'cmn3et8cs001v97ugky1g0ong', // yellow diamond deer → animal crossing
  'cmn3et6ms000197ug408lz16h', // yellow diamond arrow curve right → curve ahead

  // row:roundabout (keep 3)
  'cmmrzt9tg03eff74y7woyfy96', // entering roundabout → yield traffic already in
  'cmn3evnrr00ad97ug07aeh4yk', // exiting pedestrian crosswalk → pedestrian has ROW
  'cmn3evlox007v97ug00ioafah', // already in roundabout → you have ROW

  // safe:distracted (keep 4)
  'cmms0ewq3054nf74y38u6f34w', // texting while driving → no texting any driver
  'cmn3ezwpp00mv97ugmm6kplxm', // cell phone school zone → never when active
  'cmn3f100i00s197ug0mnuam16', // caught texting → fines and penalties
  'cmn3f1vti00t197ug95hec1o2', // when texting prohibited → all drivers all times

  // safe:seatbelt (keep 3)
  'cmn3f1wg800tp97ugrwokne7u', // who required seat belts → all occupants
  'cmms0aj1g04rtf74y91wt8uep', // seat belt statement → required all occupants
  'cmn3f0y4b00q197ugu1z6tmjk', // who exempt → only certified medical

  // alcohol:bac-adult (keep 3)
  'cmn3f2qet00xp97ugm1bvtnqx', // standard BAC limit adult → 0.08%
  'cmn3f4q5t012v97ug14bazt2x', // TX intoxication definition → 0.08 or loss
  'cmms0esuo04z7f74y1pdj1dob', // BAC limits TX → adults 0.08 minors any detectable
]);

// All TX concept question IDs (over-tested ones only — to delete if not in TX_KEEP)
const TX_CONCEPT_IDS = [
  // speed:urban
  'cmn3ewwgb00c797ugaqbmdk9u','cmn3ewz4c00f197ug40kdpowd','cmn3ewxus00dj97uggdl4myoy','cmn3exvqu00g797ugnkzgu2wy',
  'cmn3exwa100gp97ugz3g4agy5','cmn3exyj900hj97ugqf39brv5','cmn3exyw300hv97ugd8xuus0s','cmn3eyxj900j797ugvhlfqej1',
  'cmn3eyyin00k197uge3frzuwe','cmn3eyz5500kp97ug087u4c69','cmn3eyzm100l797ugu302cts5','cmn3ez03200lp97ugap2tqptz',
  'cmms06evg04dff74yxmuizqk2','cmms06elw04d1f74yt1ok0uer','cmms04c2e049jf74ysw0tguz1','cmms04baq048df74yme2cavuw',
  'cmms04aiy0477f74y11p211q6','cmms02c610443f74yr0igcjhd','cmms02beh042xf74ylc6r0v82','cmms02b54042jf74y55fz6q64',
  'cmmrzi2iw02khf74yg0gf8y08','cmmrzi38c02lnf74yyouqsewu','cmmrzjphk02pjf74yhtp866pq','cmmrzlj3f02z9f74ywhqtfk9q',
  'cmmrzlgin02vdf74yypqsdjl3','cmn3ewwbv00c197ug7zei35n2','cmn3ewxqh00dd97ugh713r14h',
  // speed:highway-numbered extras not in urban
  'cmms04bjo048rf74y963wwdzq','cmms06hmq04gxf74y4r094hf7','cmn3ewxfa00d797ugflcemlpj','cmn3ewy4200dv97ug0nxndgzx',
  'cmn3ewygi00e797ug4xtjfq8w','cmn3ewypn00ej97ugh9ba6nmj','cmn3exw3s00gj97ug9sr6b8hv','cmn3exz2c00i197ugya05yblz',
  'cmn3eyyzs00kj97ugm2q9yndb','cmn3eyzgt00l197ug4pmh2p2t',
  // speed:school-zone
  'cmn3eww7200bv97ug0bxiv6tp','cmn3ewx1300cp97ugl4kvv8yh','cmn3ewyun00ep97ugdrnizu46','cmn3ewybv00e197ugxz1z359q',
  'cmn3exv7r00fp97ugpofmfyrs','cmn3exvxd00gd97uge3uw0gv2','cmn3exwfe00gv97ug95yrfcgw','cmn3exy8n00h797ug2jntkbie',
  'cmn3exypk00hp97ugp89ti4k8','cmn3eywzd00iv97ugx9wop040','cmn3eyxq800jd97ug4cyewdig','cmn3eyy2300jj97ug8tb07cvj',
  'cmn3eyyda00jv97ugm8fx46fr',
  // speed:alley
  'cmn3ewwbv00c197ug7zei35n2','cmn3ewz4c00f197ug40kdpowd','cmn3ewyl300ed97ugxzawnicf','cmn3exusp00fd97ugi3flncd4',
  'cmn3exveu00fv97ugw8zh9699','cmn3exz8n00i797ugiadca5rk','cmn3eywty00ip97ugscb2pfsb','cmn3eyz5500kp97ug087u4c69',
  'cmn3eyzxo00lj97ugqe8vt02t','cmn3ewxqh00dd97ugh713r14h',
  // speed:following-distance
  'cmn3ezvtg00lv97ugkod1sy8x','cmn3ezxyl00o797ugma6xouys','cmn3ezy5400od97ugy5eh2s8u','cmn3f0xxp00pv97ugnt5f4o2s',
  'cmn3f0zdz00rd97uga2da96ee','cmn3f1vnt00sv97ugc4omrwy3','cmn3f1wlp00tv97ug8sbs0xph','cmn3f1xih00uv97ugffybsi1m',
  // row:pedestrian
  'cmmrzqf7x038lf74ywhelwgk6','cmmrzqdta037ff74y8pn3swc2','cmmrzqh7s03ajf74ya814guy7','cmmrzqixx03chf74yl42qwtbo',
  'cmmrzt8gf03cvf74y76x43rly','cmmrztbso03f7f74y9c3kkbjs','cmmrztc6403flf74ysu3t1u53','cmmrztcgq03fzf74ykrp7d13r',
  'cmmrzy90903ojf74ykwti26cc','cmmrzya6x03q3f74yeknqs5rr','cmmrzyag903qhf74y18rwe1og','cmmrzyazs03r9f74ynq67m1yz',
  'cmmrzyb9b03rnf74y8vg983i1','cmmrzyc3l03stf74yl7uetxvw','cmmrzycmk03tlf74yxmrwj9s3','cmn3evly2008797uggen7lhys',
  'cmn3evm39008d97ughiapp12q','cmn3evm8u008j97ugkgh22235','cmn3evnrr00ad97ug07aeh4yk','cmn3evo0k00ap97ug3c8delvd',
  'cmn3ew56t00b797ugxncjw0ks','cmn3ew5jv00bp97ugy45a14k5','cmn3f1vi900sp97ug92q6ment',
  // row:school-bus
  'cmmrzqgnl03a5f74yod2mx628','cmmrztd2j03grf74y15gduu0p','cmmrzybiv03s1f74yxho1ulfg','cmn3evlce007j97ug7tjkikxy',
  'cmn3evmj9008v97ugysks7mlf','cmn3evniw00a197ug8nlco2oy','cmn3ew52800b197ugqw4j5jq6','cmn3exz8n00i797ugiadca5rk',
  // row:move-over
  'cmn3evljk007p97ugx81bit0d','cmn3evn42009j97ugrjhzouiv','cmmrzv5va03j3f74yp55uh8tq','cmmrzycvr03tzf74yx2af6c6s',
  'cmmrzy9mk03pbf74yptqwn6fh','cmms08hpm04mdf74ywgnocsz2','cmms0ajbs04s7f74yj757op1b','cmms0evo80533f74yuptouxbq',
  'cmn3ew4xy00av97ugfp8qxijs',
  // row:railroad-stop
  'cmmrzi29z02k3f74yla6ylqtf','cmmrzi3iv02m1f74y5aprkot3','cmmrzi4nz02nzf74ybscdkdr6','cmmrzjprx02pxf74yq6ft4lh7',
  'cmmrzjser02snf74yxebl2k83','cmmrzn8me031lf74yakzage7g','cmmrzna9g033xf74ytzco5gyu','cmms08emz04i3f74y3q5c5zpr',
  'cmms08gvl04l7f74y0k302d50','cmms0afzj04njf74yorj8k84d','cmms0ciz304trf74y1s4bhl97','cmms0et7c04zlf74yuo2o72k0',
  'cmms0evx0053hf74y7f8k8nbx',
  // safe:right-turn-red
  'cmmrzi3qz02mff74yt77pnh5a','cmmrzyc3l03stf74yl7uetxvw','cmms0ewgf0549f74ylbynhwqq','cmn3evly2008797uggen7lhys',
  'cmn3ezwvy00n197ug6tfj3rog','cmn3ezxtd00o197ugxaflfeov','cmn3f10bk00sd97ugqamj4pub','cmn3f1vi900sp97ug92q6ment',
  'cmn3f1xnq00v197ugqlsc868w',
  // safe:park-crosswalk
  'cmn3ezw9p00md97ugqybalhbl','cmn3f0yqh00qp97ugyu4mdiho','cmn3f1x7l00uj97ugvb9s4v3i','cmmrzv78t03l1f74yl9qepxgc',
  'cmmrzna0u033jf74ytnavo322','cmmrzlk48030tf74yjo7isybq','cmmrzjrs702rvf74ywekrd0fl','cmmrzi3z502mtf74yciyh8b9j',
  // safe:park-railroad
  'cmmrzi4nz02nzf74ybscdkdr6','cmmrzjser02snf74yxebl2k83','cmmrzli3z02xpf74y2oj7og8a','cmmrzna9g033xf74ytzco5gyu',
  'cmmrzv6pv03k9f74yqj6bu1h6','cmms08gvl04l7f74y0k302d50','cmms0evx0053hf74y7f8k8nbx',
  // safe:park-hydrant
  'cmn3ezw4g00m797ugnwl7qb3s','cmn3f0z8p00r797ugqi7qd74g','cmn3f1xvg00v797ugf0740nxc','cmmrzljuy030ff74y5s20x8og',
  'cmmrzjqr802qpf74y6slynovp','cmmrzi2rz02kvf74ybognxdmo',
  // safe:passing-rules
  'cmmrzi4ft02nlf74yoj0tq26g','cmmrzi3iv02m1f74y5aprkot3','cmmrzjr5002r3f74yutcx68tb','cmmrzlhkt02wxf74ychi56lwz',
  'cmmrzlil202yhf74y9gv5sh40','cmmrzv65r03jhf74yflhl0ia8','cmmrzv6g503jvf74yl77dc2gs','cmms0ckv104whf74y7z8mu7ye',
  'cmn3ezxyl00o797ugma6xouys','cmn3f1wlp00tv97ug8sbs0xph',
  // alcohol:dwi-penalty
  'cmn3f2obd00vp97ugw1z5idsu','cmn3f2p2300wj97ugnxp3209o','cmn3f2qus00y797ug4yzlmgya','cmn3f3opi00zd97ug4g21xhzu',
  'cmn3f3qwp011797ug75rkpzh9','cmn3f4q5t012v97ug14bazt2x','cmn3f4qxr013p97ug9kx68j4a','cmn3f4rj8014d97ugxmwnfo9f',
  'cmn3f5n8r015j97ug04ig0h4m','cmn3f5ndq015p97ugk42sr7rk','cmn3f5o4p016j97ugpirpfnwc',
  // license:gdl-curfew
  'cmn3f6gqo018v97ugtpi5xlhm','cmn3f7dn001c197ug2jr133qx','cmn3f7dih01bv97uguzo6ordo','cmmrzv98d03nrf74yzbxkk3br',
  'cmms08gkx04ktf74ybx6facvs','cmms0cipa04tdf74yp72v6pnk','cmms0etzv050rf74yvhsfamgz','cmmrznat5034pf74yud9288jv',
  // license:learner-age
  'cmn3f6fne017v97ugrwyzfdbq','cmn3f7xed01fp97ugt3xdqwl7','cmn3f7wki01ep97ugst3g05p1','cmn3f7e5u01cp97ug6ncc3347',
  'cmms0cklo04w3f74y581jfwjd','cmmrznaiw034bf74ytvkuxhdf','cmmrzi5ca02p5f74yehswria0',
  // row:emergency-vehicle
  'cmn3evljk007p97ugx81bit0d','cmmrzt91f03dnf74ypvb3lhqh','cmmrzv5va03j3f74yp55uh8tq','cmmrzte0c03hxf74y140rl0ca',
  'cmmrzycvr03tzf74yx2af6c6s','cmmrzqfzk039df74yh96dern1','cmmrzy9mk03pbf74yptqwn6fh','cmn3ew4xy00av97ugfp8qxijs',
  'cmms08hpm04mdf74ywgnocsz2','cmms0ajbs04s7f74yj757op1b','cmms0evo80533f74yuptouxbq',
  // signs:warning-shape
  'cmn3eu2ec003j97ug5mtijj71','cmn3et8i7002197ugwh1sdiwv','cmn3et913002j97ugh578dbdk','cmn3et8cs001v97ugky1g0ong',
  'cmn3et6ms000197ug408lz16h','cmn3euekn006v97ugpublc187','cmn3eu4rr006797ugmhokdrhv','cmn3eu4ne006197ugypnefmoy',
  'cmn3eu42q005d97ug17actzgw','cmn3eu3yc005797ug746jdfjd','cmn3et9ek003197ugjf25mk1w',
  // row:roundabout
  'cmmrzt9tg03eff74y7woyfy96','cmmrzyaq403qvf74yvudam43z','cmmrzqesz0387f74y0bmpnb7q','cmn3evnrr00ad97ug07aeh4yk',
  'cmn3evlox007v97ug00ioafah','cmn3ew56t00b797ugxncjw0ks',
  // safe:distracted
  'cmms0ewq3054nf74y38u6f34w','cmn3ezwpp00mv97ugmm6kplxm','cmn3ezxir00np97ugbkr6f6eo','cmn3f0xmo00pj97ug6mj58vq8',
  'cmn3f100i00s197ug0mnuam16','cmn3f1vti00t197ug95hec1o2',
  // safe:seatbelt
  'cmms0aj1g04rtf74y91wt8uep','cmms0clyr04y1f74yrxsb81r0','cmn3ezyrp00p197ugtyi3iiex','cmn3f0y4b00q197ugu1z6tmjk',
  'cmn3f1wg800tp97ugrwokne7u',
  // alcohol:bac-adult
  'cmn3f2qet00xp97ugm1bvtnqx','cmn3f4q5t012v97ug14bazt2x','cmms0esuo04z7f74y1pdj1dob','cmmrznb3l0353f74yhwpo13ur',
  'cmmrzi47i02n7f74yzitve127','cmn3f5n8r015j97ug04ig0h4m',
];

// ── FLORIDA ──────────────────────────────────────────────────────────────────

const FL_KEEP = new Set([
  // speed:highway (keep 6)
  'cmmrz1c1t019ff74yt7j9upm4', // standard FL highway speed → 55 MPH
  'cmmryk4fm0031f74yk44sg4g6', // 55 MPH highway minimum speed → 40 MPH
  'cmn2jb8o000eptn6saor41g19', // interstate FL max → 70 mph
  'cmn2kj5yv006v14otyo4cu02h', // FL rural highways → 65 mph
  'cmmrz1e5601c5f74y7xd1on8r', // 50 mph highway → increase to meet minimum
  'cmn3kkrsu000pqgivw23fzp1t', // passing stopped emergency on highway → 20 mph below

  // speed:school-zone (keep 4)
  'cmmryk3140011f74yvzk6r0cx', // school zone max speed → 20 MPH
  'cmmrz1d8w01azf74y9ox0yrh6', // when fines doubled → school zones and work zones
  'cmmrz1egv01cjf74yfpc7ji2k', // 25 MPH school zone flashing → speeding exceeded 20
  'cmmrz3fzu01jjf74y92fqg59p', // when 20 MPH applies → children present or lights flashing

  // row:pedestrian (keep 6)
  'cmmryuu7l00w7f74yc6kvkd2h', // pedestrian in crosswalk → yield ROW
  'cmn2ja1tg00bdtn6sgkdq78hg', // pedestrian marked crosswalk → stop allow to cross
  'cmn2ja2lo00cdtn6sqozvvrvd', // right turn pedestrian crossing → pedestrian has ROW
  'cmn3klcyo0021qgivcbkwp3qr', // blind pedestrian white cane → complete stop
  'cmn3kld360027qgivjdbc7rrd', // left turn green light → yield oncoming pedestrians
  'cmn2khdqr001114otahf5lhxe', // pedestrian signal still crossing → wait completely cross

  // row:roundabout (keep 4)
  'cmmryutaw00v1f74y18ruj92c', // which vehicles ROW in roundabout → already in
  'cmn2j91dh008vtn6sbuksnro5', // which direction travel → counterclockwise
  'cmn2ja1jd00b1tn6sblbb14wl', // approaching roundabout → yield traffic already in
  'cmn2khfbr002j14otjytr22no', // exiting roundabout pedestrian → yield

  // speed:following-distance (keep 4)
  'cmmryuszu00unf74yc2w83hgh', // minimum safe following distance → 4 seconds
  'cmn2jcndn00ljtn6sg1bb4gd1', // two-second following rule → safe following distance
  'cmn2jeesa00r7tn6st4arwac1', // behind large truck → increase following distance
  'cmn2kk5de00bj14ot1wc605ej', // following motorcycle → increase following distance

  // safe:headlights-when (keep 3)
  'cmn2jcl1900ivtn6sw9p8t4yw', // when use headlights FL → sunset to sunrise and rain fog
  'cmn2jdnby00p7tn6s4fpf22zr', // driving in fog → low beam reduce speed
  'cmn2kk2dh008d14otvk5vx3vl', // heavy rain wipers → must turn on headlights
]);

const FL_CONCEPT_IDS = [
  // speed:highway
  'cmmryk2sf000pf74y5yk9ud2s','cmmryocv700cjf74y2v472177','cmmryocn300c7f74ycr55dzxz','cmmryqgpa00lbf74ydenb00ch',
  'cmmrz1c1t019ff74yt7j9upm4','cmmrz1e5601c5f74y7xd1on8r','cmmrz1g0n01ehf74y0zjrpfsv','cmmrz1f1u01dbf74ylf0lc2uf',
  'cmmrz3cat01evf74yf1xj1j4c','cmmrz5mei01kpf74y75zatiu6','cmmrz5pt901pdf74yk932cabd','cmmrz5n0e01lhf74yplqc4f8j',
  'cmmrz5ozf01o7f74ymd5xlhtt','cmmrz7zwq01vzf74yw61mi0go','cmmrzgbr102e9f74yqpv95jud','cmmrz1cxz01alf74yt3uohxyu',
  'cmmrz7whe01s3f74y3q65b4wz','cmmryk4fm0031f74yk44sg4g6','cmmrz1dv101brf74yefazdord','cmmrz3ere01hzf74yf9s7saho',
  'cmmrz3fpf01j5f74yrsuvztkf','cmmrz5o5201n1f74yodc48hqs','cmmrz7xvy01tnf74yu4sfgtkr','cmmrz7ydj01u1f74yukxq2wnv',
  'cmn2j914b008jtn6sx6bwmf9s','cmn2jb8o000eptn6saor41g19','cmn2jb9k900fvtn6sogtqa1xk','cmn2jba6m00gptn6slrqsxwj7',
  'cmn2jbatg00hjtn6s4x96ul4s','cmn2jb9t600g7tn6sghjryw6t','cmn3kkrne000jqgivpc9unw58','cmn2jbn8x00i1tn6s40918sds',
  'cmn3kkrsu000pqgivw23fzp1t','cmn2jcmkh00kjtn6shxq2jrg2','cmn2jdm9700nvtn6sk09ibugl','cmn2j90ur0087tn6sj2qt2c24',
  'cmn2jef1600rjtn6slcrbm8wd','cmn3klcj7001jqgivqjbv0z3q','cmn3kldcb002jqgivmhtx1s40','cmn2kj5t1006p14otgjlmeyos',
  'cmn2kj5yv006v14otyo4cu02h','cmn2kj668007114ot6f6jywoz','cmn2kj6fj007714ot5oicfwe6','cmn2kj6oj007d14otqh6gqa1q',
  // speed:school-zone
  'cmmryk3140011f74yvzk6r0cx','cmmryk5hx004pf74ytn5vhcop','cmmrym98a006zf74yzlv9qvin','cmmrz1d8w01azf74y9ox0yrh6',
  'cmmrz1egv01cjf74yfpc7ji2k','cmmrz1fda01dpf74ysu6yafie','cmmrz3dbt01g1f74yw14vifzc','cmmrz3dxb01gtf74y5xr3ijvi',
  'cmmrz3f3b01idf74y2vtypaf1','cmmrz3fzu01jjf74y92fqg59p','cmmrz5mei01kpf74y75zatiu6','cmmrz5pj901ozf74yvn9qr7g7',
  'cmmrz7zcc01v7f74yf767vtvk','cmmrzbvrw024xf74yobnhc48j','cmmrzgd1702ftf74yfnypvjot','cmn2jb9t600g7tn6sghjryw6t',
  // row:pedestrian
  'cmmryuu7l00w7f74yc6kvkd2h','cmn2j92le00adtn6sxhet6y6f','cmn2j90ur0087tn6sj2qt2c24','cmn2ja1tg00bdtn6sgkdq78hg',
  'cmn2ja2lo00cdtn6sqozvvrvd','cmn3klcyo0021qgivcbkwp3qr','cmn3kld360027qgivjdbc7rrd','cmn2khcn7000714otvuxtdfsn',
  'cmn2khctt000d14ot4nmqd13c','cmn2khdqr001114otahf5lhxe','cmn2kheg0001p14oths3pv17x','cmn2khfbr002j14otjytr22no',
  'cmn2khfnz002v14otywem8j7h','cmn2kih7w003p14otk9mzpfrx','cmn2kiheu003v14otq31g3t9n','cmn2kii6j004j14otoqpbd5vx',
  'cmn2kiign004p14otttg54kai','cmn2kijev005d14ot5asp7nai',
  // row:roundabout
  'cmmryutaw00v1f74y18ruj92c','cmn2j92le00adtn6sxhet6y6f','cmn2j90g7007ptn6sxqmfmu7a','cmn2j91dh008vtn6sbuksnro5',
  'cmn2ja1jd00b1tn6sblbb14wl','cmn2ja2q900cjtn6swjpfxi3x','cmn2ja3d000ddtn6sxl9bwfwh','cmn2khe3l001d14otc3pa4kmg',
  'cmn2khfbr002j14otjytr22no','cmn2khftx003114otah9i0aw2','cmn2kiign004p14otttg54kai','cmn2kijn9005j14ot8q0ygr43',
  // speed:following-distance
  'cmmrymb15009pf74y2dlmva64','cmmrysi8i00m3f74y4v40g5pz','cmmryuszu00unf74yc2w83hgh','cmmryytaf013lf74y9vqdfahy',
  'cmn2jcldx00j7tn6si4gxdn0c','cmn2jcndn00ljtn6sg1bb4gd1','cmn2jdl8d00mjtn6skske6usc','cmn2jeduy00q1tn6sxhr4nn9y',
  'cmn2jeesa00r7tn6st4arwac1','cmn2kk5de00bj14ot1wc605ej','cmn2kkn4u00cd14ot3k848g2n',
  // safe:headlights-when
  'cmn2jcl1900ivtn6sw9p8t4yw','cmn2jdkyp00m7tn6slyf1yc9s','cmn2jdnby00p7tn6s4fpf22zr','cmn2jedhj00pjtn6sidx3amt2',
  'cmn2kk48o00ad14otpp9ibiu4','cmn2kk2dh008d14otvk5vx3vl','cmn2kkmhz00bp14otmokel786',
];

// ── CALIFORNIA ───────────────────────────────────────────────────────────────

const CA_KEEP = new Set([
  // speed:highway (keep 5)
  'cmms368lo0bmrf74yb3ptjw84', // two-lane undivided highway no signs → 55 MPH
  'cmms36as50bpvf74y6h6ss0ip', // which road 55 MPH unmarked → two-lane undivided
  'cmn3czq3g00d759rpe9gomwqw', // freeway 70 mph posted → specifically posted higher
  'cmn3d0xqu00g159rpyzba5zwa', // merge freeway heavy traffic → match speed merge safely
  'cmn3nl6i7004v10m1qadc2hln', // school bus divided highway opposite → continue normal

  // row:pedestrian (keep 5)
  'cmms2x35n0aztf74y57y7qci0', // left turn → yield oncoming and pedestrians
  'cmn3cxv93006p59rpayjschnm', // yield pedestrians unmarked crosswalks → always
  'cmn3cxvt7007d59rp347dhbtq', // right turn yield → pedestrians crosswalk oncoming
  'cmn3nkbg1000d10m1gr59ugad', // blind pedestrian white cane → complete stop wait
  'cmn3nke06002j10m1g64esgkf', // pedestrians ROW unmarked → always all intersections

  // safe:right-turn-red (keep 3)
  'cmms2onmk0aetf74yvp1m6isk', // legal right turn on red → unless posted otherwise
  'cmms2x5tk0b43f74yim8nbgyd', // right turn on red → unless posted otherwise
  'cmms31uu80bdtf74ylsalwhgf', // right turn on red permitted → unless posted otherwise
]);

const CA_CONCEPT_IDS = [
  // speed:highway
  'cmms368lo0bmrf74yb3ptjw84','cmms36as50bpvf74y6h6ss0ip','cmms36bb20bqnf74yhwbwbpg8','cmms387w00bwhf74yb2h41rlu',
  'cmms3bj0j0c3vf74ydzdbmlyi','cmms3bma60c8xf74ye931joqh','cmn3czoto00bj59rpkhat2j40','cmn3czq3g00d759rpe9gomwqw',
  'cmn3d0xqu00g159rpyzba5zwa','cmn3d1zu600j759rpi9ov9wx5','cmn3meocq002da9u5ebs5s73x','cmn3mep1j0037a9u5wpc6bne8',
  'cmn3nl5yw004710m1xxx6f1ns','cmn3nl63h004d10m1sed6kpez','cmn3nl67z004j10m1gba2bns6',
  // row:pedestrian
  'cmms2x35n0aztf74y57y7qci0','cmms2zgec0b59f74yl61lwegv','cmn3cxv93006p59rpayjschnm','cmn3cxvt7007d59rp347dhbtq',
  'cmn3d32kn00ov59rpjo5nhv33','cmn3meohj002ja9u5ol4y0kq4','cmn3meptl0041a9u552q7cgt0','cmn3nkbg1000d10m1gr59ugad',
  'cmn3nkcn7001d10m1desty0cw','cmn3nke06002j10m1g64esgkf','cmn3nl5sv004110m14ecjsxt2','cmn3nl6i7004v10m1qadc2hln',
  // safe:right-turn-red
  'cmms2onmk0aetf74yvp1m6isk','cmms2so440aq3f74yul3xx4h7','cmms2x5tk0b43f74yim8nbgyd','cmms2zh480b61f74ynxd1jadv',
  'cmms31uu80bdtf74ylsalwhgf','cmms348ir0bj9f74y62gc9x65','cmms2uu010avxf74yv1ovpamb',
];

async function deleteQuestions(ids, keepSet, stateName) {
  const toDelete = [...new Set(ids)].filter(id => !keepSet.has(id));
  if (toDelete.length === 0) {
    console.log(stateName + ': nothing to delete');
    return 0;
  }
  const result = await p.$transaction([
    p.choice.deleteMany({ where: { questionId: { in: toDelete } } }),
    p.answer.deleteMany({ where: { questionId: { in: toDelete } } }),
    p.userProgress.deleteMany({ where: { questionId: { in: toDelete } } }),
    p.questionTranslation.deleteMany({ where: { questionId: { in: toDelete } } }),
    p.question.deleteMany({ where: { id: { in: toDelete } } }),
  ]);
  console.log(stateName + ': deleted ' + result[4].count + ' questions (' + result[0].count + ' choices removed)');
  return result[4].count;
}

async function main() {
  console.log('Starting trim across all 3 states...\n');

  const txDeleted = await deleteQuestions(TX_CONCEPT_IDS, TX_KEEP, 'Texas');
  const flDeleted = await deleteQuestions(FL_CONCEPT_IDS, FL_KEEP, 'Florida');
  const caDeleted = await deleteQuestions(CA_CONCEPT_IDS, CA_KEEP, 'California');

  console.log('\nTotal deleted: ' + (txDeleted + flDeleted + caDeleted));

  // Final counts
  const counts = await p.question.groupBy({
    by: ['stateId'],
    where: { stateId: { in: ['cmmpnttf800163jd6zc01uwlv','cmmpntmvv00083jd6x3g9m5js','cmmpntm4s00043jd6mtc4xwmi'] } },
    _count: { _all: true },
  });
  const names = {
    'cmmpnttf800163jd6zc01uwlv': 'Texas',
    'cmmpntmvv00083jd6x3g9m5js': 'Florida',
    'cmmpntm4s00043jd6mtc4xwmi': 'California',
  };
  console.log('\nFINAL COUNTS:');
  counts.forEach(c => console.log('  ' + names[c.stateId] + ': ' + c._count._all + ' questions'));

  await p.$disconnect();
}

main().catch(e => { console.error(e); p.$disconnect(); });
