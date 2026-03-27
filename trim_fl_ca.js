
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const FL_KEEP = new Set([
  'cmmrz1c1t019ff74yt7j9upm4','cmmryk4fm0031f74yk44sg4g6','cmn2jb8o000eptn6saor41g19',
  'cmn2kj5yv006v14otyo4cu02h','cmmrz1e5601c5f74y7xd1on8r','cmn3kkrsu000pqgivw23fzp1t',
  'cmmryk3140011f74yvzk6r0cx','cmmrz1d8w01azf74y9ox0yrh6','cmmrz1egv01cjf74yfpc7ji2k','cmmrz3fzu01jjf74y92fqg59p',
  'cmmryuu7l00w7f74yc6kvkd2h','cmn2ja1tg00bdtn6sgkdq78hg','cmn2ja2lo00cdtn6sqozvvrvd',
  'cmn3klcyo0021qgivcbkwp3qr','cmn3kld360027qgivjdbc7rrd','cmn2khdqr001114otahf5lhxe',
  'cmmryutaw00v1f74y18ruj92c','cmn2j91dh008vtn6sbuksnro5','cmn2ja1jd00b1tn6sblbb14wl','cmn2khfbr002j14otjytr22no',
  'cmmryuszu00unf74yc2w83hgh','cmn2jcndn00ljtn6sg1bb4gd1','cmn2jeesa00r7tn6st4arwac1','cmn2kk5de00bj14ot1wc605ej',
  'cmn2jcl1900ivtn6sw9p8t4yw','cmn2jdnby00p7tn6s4fpf22zr','cmn2kk2dh008d14otvk5vx3vl',
]);

const FL_CONCEPT_IDS = [
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
  'cmmryk3140011f74yvzk6r0cx','cmmryk5hx004pf74ytn5vhcop','cmmrym98a006zf74yzlv9qvin','cmmrz1d8w01azf74y9ox0yrh6',
  'cmmrz1egv01cjf74yfpc7ji2k','cmmrz1fda01dpf74ysu6yafie','cmmrz3dbt01g1f74yw14vifzc','cmmrz3dxb01gtf74y5xr3ijvi',
  'cmmrz3f3b01idf74y2vtypaf1','cmmrz3fzu01jjf74y92fqg59p','cmmrz5mei01kpf74y75zatiu6','cmmrz5pj901ozf74yvn9qr7g7',
  'cmmrz7zcc01v7f74yf767vtvk','cmmrzbvrw024xf74yobnhc48j','cmmrzgd1702ftf74yfnypvjot','cmn2jb9t600g7tn6sghjryw6t',
  'cmmryuu7l00w7f74yc6kvkd2h','cmn2j92le00adtn6sxhet6y6f','cmn2j90ur0087tn6sj2qt2c24','cmn2ja1tg00bdtn6sgkdq78hg',
  'cmn2ja2lo00cdtn6sqozvvrvd','cmn3klcyo0021qgivcbkwp3qr','cmn3kld360027qgivjdbc7rrd','cmn2khcn7000714otvuxtdfsn',
  'cmn2khctt000d14ot4nmqd13c','cmn2khdqr001114otahf5lhxe','cmn2kheg0001p14oths3pv17x','cmn2khfbr002j14otjytr22no',
  'cmn2khfnz002v14otywem8j7h','cmn2kih7w003p14otk9mzpfrx','cmn2kiheu003v14otq31g3t9n','cmn2kii6j004j14otoqpbd5vx',
  'cmn2kiign004p14otttg54kai','cmn2kijev005d14ot5asp7nai',
  'cmmryutaw00v1f74y18ruj92c','cmn2j92le00adtn6sxhet6y6f','cmn2j90g7007ptn6sxqmfmu7a','cmn2j91dh008vtn6sbuksnro5',
  'cmn2ja1jd00b1tn6sblbb14wl','cmn2ja2q900cjtn6swjpfxi3x','cmn2ja3d000ddtn6sxl9bwfwh','cmn2khe3l001d14otc3pa4kmg',
  'cmn2khfbr002j14otjytr22no','cmn2khftx003114otah9i0aw2','cmn2kiign004p14otttg54kai','cmn2kijn9005j14ot8q0ygr43',
  'cmmrymb15009pf74y2dlmva64','cmmrysi8i00m3f74y4v40g5pz','cmmryuszu00unf74yc2w83hgh','cmmryytaf013lf74y9vqdfahy',
  'cmn2jcldx00j7tn6si4gxdn0c','cmn2jcndn00ljtn6sg1bb4gd1','cmn2jdl8d00mjtn6skske6usc','cmn2jeduy00q1tn6sxhr4nn9y',
  'cmn2jeesa00r7tn6st4arwac1','cmn2kk5de00bj14ot1wc605ej','cmn2kkn4u00cd14ot3k848g2n',
  'cmn2jcl1900ivtn6sw9p8t4yw','cmn2jdkyp00m7tn6slyf1yc9s','cmn2jdnby00p7tn6s4fpf22zr','cmn2jedhj00pjtn6sidx3amt2',
  'cmn2kk48o00ad14otpp9ibiu4','cmn2kk2dh008d14otvk5vx3vl','cmn2kkmhz00bp14otmokel786',
];

const CA_KEEP = new Set([
  'cmms368lo0bmrf74yb3ptjw84','cmms36as50bpvf74y6h6ss0ip','cmn3czq3g00d759rpe9gomwqw',
  'cmn3d0xqu00g159rpyzba5zwa','cmn3nl6i7004v10m1qadc2hln',
  'cmms2x35n0aztf74y57y7qci0','cmn3cxv93006p59rpayjschnm','cmn3cxvt7007d59rp347dhbtq',
  'cmn3nkbg1000d10m1gr59ugad','cmn3nke06002j10m1g64esgkf',
  'cmms2onmk0aetf74yvp1m6isk','cmms2x5tk0b43f74yim8nbgyd','cmms31uu80bdtf74ylsalwhgf',
]);

const CA_CONCEPT_IDS = [
  'cmms368lo0bmrf74yb3ptjw84','cmms36as50bpvf74y6h6ss0ip','cmms36bb20bqnf74yhwbwbpg8','cmms387w00bwhf74yb2h41rlu',
  'cmms3bj0j0c3vf74ydzdbmlyi','cmms3bma60c8xf74ye931joqh','cmn3czoto00bj59rpkhat2j40','cmn3czq3g00d759rpe9gomwqw',
  'cmn3d0xqu00g159rpyzba5zwa','cmn3d1zu600j759rpi9ov9wx5','cmn3meocq002da9u5ebs5s73x','cmn3mep1j0037a9u5wpc6bne8',
  'cmn3nl5yw004710m1xxx6f1ns','cmn3nl63h004d10m1sed6kpez','cmn3nl67z004j10m1gba2bns6',
  'cmms2x35n0aztf74y57y7qci0','cmms2zgec0b59f74yl61lwegv','cmn3cxv93006p59rpayjschnm','cmn3cxvt7007d59rp347dhbtq',
  'cmn3d32kn00ov59rpjo5nhv33','cmn3meohj002ja9u5ol4y0kq4','cmn3meptl0041a9u552q7cgt0','cmn3nkbg1000d10m1gr59ugad',
  'cmn3nkcn7001d10m1desty0cw','cmn3nke06002j10m1g64esgkf','cmn3nl5sv004110m14ecjsxt2','cmn3nl6i7004v10m1qadc2hln',
  'cmms2onmk0aetf74yvp1m6isk','cmms2so440aq3f74yul3xx4h7','cmms2x5tk0b43f74yim8nbgyd','cmms2zh480b61f74ynxd1jadv',
  'cmms31uu80bdtf74ylsalwhgf','cmms348ir0bj9f74y62gc9x65','cmms2uu010avxf74yv1ovpamb',
];

async function deleteQuestions(ids, keepSet, stateName) {
  const toDelete = [...new Set(ids)].filter(id => !keepSet.has(id));
  if (!toDelete.length) { console.log(stateName + ': nothing to delete'); return 0; }
  // Must delete answers (which reference choices) BEFORE choices
  const choices = await p.choice.findMany({ where: { questionId: { in: toDelete } }, select: { id: true } });
  const choiceIds = choices.map(c => c.id);
  await p.answer.deleteMany({ where: { choiceId: { in: choiceIds } } });
  const result = await p.$transaction([
    p.answer.deleteMany({ where: { questionId: { in: toDelete } } }),
    p.userProgress.deleteMany({ where: { questionId: { in: toDelete } } }),
    p.questionTranslation.deleteMany({ where: { questionId: { in: toDelete } } }),
    p.choice.deleteMany({ where: { questionId: { in: toDelete } } }),
    p.question.deleteMany({ where: { id: { in: toDelete } } }),
  ]);
  console.log(stateName + ': deleted ' + result[4].count + ' questions');
  return result[4].count;
}

async function main() {
  const fl = await deleteQuestions(FL_CONCEPT_IDS, FL_KEEP, 'Florida');
  const ca = await deleteQuestions(CA_CONCEPT_IDS, CA_KEEP, 'California');
  console.log('Total deleted: ' + (fl + ca));

  const counts = await p.question.groupBy({
    by: ['stateId'],
    where: { stateId: { in: ['cmmpnttf800163jd6zc01uwlv','cmmpntmvv00083jd6x3g9m5js','cmmpntm4s00043jd6mtc4xwmi'] } },
    _count: { _all: true },
  });
  const names = { 'cmmpnttf800163jd6zc01uwlv':'Texas','cmmpntmvv00083jd6x3g9m5js':'Florida','cmmpntm4s00043jd6mtc4xwmi':'California' };
  console.log('\nFINAL COUNTS:');
  counts.forEach(c => console.log('  ' + names[c.stateId] + ': ' + c._count._all));
  await p.$disconnect();
}
main().catch(e => { console.error(e); p.$disconnect(); });
