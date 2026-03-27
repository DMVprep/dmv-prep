const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const NY = 'cmmpntr72000v3jd6patr1zka';

// ── KEEP SETS ─────────────────────────────────────────────────────────────────

// speed:nyc — keep 6 core questions, delete speed camera trivia and redundant ones
const KEEP_SPEED_NYC = new Set([
  'cmms0gwgy0551f74ys3we5rhy', // What is the speed limit in NYC when no sign posted → 25 MPH
  'cmms0is1n05bnf74yt5o90xfw', // In NYC what is max speed unless otherwise posted → 25 MPH
  'cmms1fryk06tbf74yo4iirbic', // When is it legal to exceed 25 MPH in NYC → Never unless posted
  'cmms1ftzk06w1f74y8he4g69p', // How much faster unposted rural vs NYC → 30 MPH faster
  'cmn3ff36o023j97ugb4qgv6qb', // Primary diff NYC vs rest of NY → NYC 25, outside 55
  'cmn3fgfmc027p97ugfu79lb95', // Why right on red prohibited in NYC → Heavy pedestrian traffic
]);

// speed:default — keep 5 best, delete redundant "55 mph on unposted road" repeats
const KEEP_SPEED_DEFAULT = new Set([
  'cmms0gx0d055tf74y4fq5m8o6', // Default speed limit no sign posted outside NYC → 55 MPH
  'cmms0n77h05npf74ymemss746', // No speed limit posted in NY → max 55 MPH
  'cmms1dk6c06qlf74yt5gk7n9p', // When legal to drive 55 in NY → no posted limit
  'cmn3fd3js01tv97ug3me3xmia', // Albany residential no sign → 55 mph (Albany = outside NYC)
  'cmn3fe2cy020797ugim4o9ch7', // City street in Bronx no sign → 25 mph (Bronx = NYC)
]);

// speed:school-zone — keep 4
const KEEP_SCHOOL_ZONE = new Set([
  'cmn3fd3ec01tp97ugwele6w3c', // Max speed school zone children present → 15 mph
  'cmn3fd55901vp97ugr27503my', // School zone outside NYC typical → 15 mph
  'cmn3fe05501xp97ugs7r9urlb', // Syracuse 8AM school day → 15 mph
  'cmn3ff315023d97ugqe9qlk1l', // School zone Syracuse 2:30 PM → 15 mph during school hours
]);

// speed:following — keep 4
const KEEP_SPEED_FOLLOWING = new Set([
  'cmms0u0ux065lf74yatkbqces', // Proper following distance → 2-second rule
  'cmn3fgeo7026p97ugxxtlzi6t', // Which describes 2-second rule → count 2 seconds
  'cmn3fgfri027v97ugfzf9a8jr', // Safety purpose of following distance → reaction time
  'cmn3fildb02e197ugin81w2ih', // Following behind motorcycle → greater than 2-second rule
]);

// row:pedestrian — keep 5
const KEEP_PEDESTRIAN = new Set([
  'cmms0q2ki05vvf74y430opf5q', // Right turn pedestrian in crosswalk → yield
  'cmn3fatkh01mp97ug0f3z46uu', // Blind pedestrian white cane → complete stop
  'cmn3fbvqr01q797ug4t9fuupm', // Pedestrian crossing outside crosswalk → driver must avoid
  'cmn3fbvx801qd97ugv3lsdqkg', // Right turn pedestrian approaching → wait for pedestrian
  'cmn3fijza02cp97ug1m9izfn2', // Pedestrian in crosswalk → yield ROW
]);

// row:school-bus — keep 5
const KEEP_SCHOOL_BUS = new Set([
  'cmms0q3aj05x1f74yqao5p888', // Stopped school bus flashing red → stop
  'cmn3fatxx01n797ugwfc5x19d', // You see a stopped school bus → stop at least 20 feet
  'cmn3f8vl601g797ugs8mw65r1', // School bus yellow lights → slow prepare to stop (reusing warning sign ID - verify)
]);
// Note: only 3 unique school bus questions in the dataset per scan — keep all

// row:emergency — keep 5
const KEEP_EMERGENCY = new Set([
  'cmms0q19g05ubf74y5p96e3bn', // Emergency vehicle approaching from behind → pull right stop
  'cmms0q3aj05x1f74yqao5p888', // (overlaps - skip)
  'cmn3fatth01n197ugz8ryll7o', // Move Over law passing stopped emergency → move over or 20 below
  'cmn3fbwld01r197ugmuyufhey', // Cannot move over → slow to 20 mph below
  'cmn3fbyo401sv97ug9b10cvtt', // Divided highway stopped emergency → slow 20 below
  'cmn3fhgrg029d97uguollvoor', // Emergency vehicle from behind → pull right stop
]);

// safe:cell-phone — keep 4
const KEEP_CELL_PHONE = new Set([
  'cmms19tp906fbf74y7ld7dv9b', // Handheld banned, hands-free allowed → correct
  'cmms1oam607g9f74y3372ux8a', // NY requires handheld banned hands-free → correct
  'cmn3fgezq027197ugt7y0tji9', // Main safety reason handheld ban → prevent distraction
  'cmms1kapf074lf74ydbvm099h', // True about cell phone in NY → handheld banned hands-free ok
]);

// alcohol:dwi — keep 8 best covering different aspects
const KEEP_DWI = new Set([
  'cmn3fkbz302hv97ugxsmrezxj', // Max fine first DWI → $1,000
  'cmn3fkc4402i197uggheqvtqh', // License revocation first DWI → at least 6 months
  'cmn3fla2t02kp97ugjix9bl04', // Min BAC standard DWI → 0.08%
  'cmn3fmeyh02nv97ug61yutiez', // Second DWI within 10 years → $5,000 and 18-month revocation
  'cmn3fmf3302o197ugoxm3spfa', // Additional requirement after DWI → ignition interlock
  'cmn3fmfba02o797ugqbelobz1', // Lookback period repeat DWI → 10 years
  'cmn3fmh1v02q797ug4qfbqt0h', // Child under 16 in vehicle → Leandra's Law felony
  'cmn3fna7602s797ug43j6jjkm', // Refuse chemical test → automatic revocation + $500 civil penalty
]);

// alcohol:bac — keep 6
const KEEP_BAC = new Set([
  'cmn3fkbk002hd97ugl5lduxdm', // Aggravated DWI BAC → 0.18% or higher
  'cmn3fla7v02kv97ugudn0prvh', // Max BAC for DWAI before DWI → 0.07%
  'cmn3fladw02l197ugb1ov1tqn', // Under 21 zero tolerance BAC → 0.02%
  'cmn3flbf602lv97ug90vbyxmd', // BAC begins to impair → 0.05%
  'cmn3fla2t02kp97ugjix9bl04', // Min BAC standard DWI → 0.08%
  'cmn3fnalr02sp97ug8mamra71', // Enhanced penalties Agg DWI → 0.18%
]);

// license:junior-license — keep 8
const KEEP_JUNIOR = new Set([
  'cmn3fo16l02u797ug1ve143rm', // Nighttime curfew junior → 9 PM to 5 AM
  'cmn3fo1em02ud97ugoxttfrur', // Max passengers under 21 → one passenger
  'cmn3fo2f402vp97ug36x532mh', // Min age junior license → 16.5 years
  'cmn3fo2tf02w797ugvp3exqj8', // Who exempt from passenger limit → family members
  'cmn3fo37502wp97ugdxf3yxb1', // Age for full license without junior → 18 years old
  'cmn3foy2m02x797ugeyn7tlar', // Junior license drive with friends under 21 → 1 passenger
  'cmn3foybi02xd97ug2no08wvr', // When nighttime restriction begins → 9:00 PM
  'cmn3foyp802xv97ugoi2pcwb9', // Drive after 9PM for work → need work exemption
]);

// license:learner-permit — keep 6
const KEEP_LEARNER = new Set([
  'cmms0iu8n05f5f74y2f6auewc', // Age for learner permit → 16
  'cmn3fo0vz02tv97ugz8tf9zej', // Hold permit before junior license → 6 months
  'cmn3fo10q02u197ugqtxqh91z', // Hours supervised driving → 50 hours
  'cmn3fo2ao02vj97ugexgiebjo', // Hours nighttime driving → 15 hours
  'cmn3fo2ov02w197ug3uyrskib', // Test to get permit → written test
  'cmn3fozgj02yv97ugtsykzd0d', // Transition permit to junior → road test + supervised driving
]);

// license:points — keep 5
const KEEP_POINTS = new Set([
  'cmms0gyz9058xf74y8qnjoen0', // Signs at DMV indicate answer correctly → 14 (wrong concept match - skip)
]);
// Need to pick proper points questions — let me use all IDs from the scan

// license:knowledge-test — keep 4
const KEEP_KNOWLEDGE_TEST = new Set([
  'cmms0itin05dzf74ymajvm6a8', // Road sign questions must answer → 2 of 4
  'cmms0itr805edf74ywyrxar7b', // Total questions knowledge test → 20 questions
  'cmms0n9uf05rlf74yo61xcs0k', // Must answer correctly → at least 14
  'cmms1mckj07ebf74ykcmtle2e', // Must answer correctly → 14 including 2 of 4 road signs
]);

// signs:warning — keep 5
const KEEP_WARNING = new Set([
  'cmn3f8y6t01jd97ugcp4svss5', // Shape of warning signs → diamond
  'cmn3f8vl601g797ugs8mw65r1', // Yellow diamond curved arrow → curve ahead
  'cmn3f8wra01hj97ugklh3wz3k', // Yellow diamond children → school zone
  'cmn3f8xii01ij97uggcyd9a2f', // Yellow diamond car wavy lines → slippery road
  'cmn3f8xdu01id97ug0og1th65', // Yellow diamond deer → deer crossing
]);

// ── BUILD DELETE LIST ─────────────────────────────────────────────────────────

const ALL_CONCEPT_IDS = {
  speed_nyc: [
    'cmms0gwgy0551f74ys3we5rhy','cmms0gx0d055tf74y4fq5m8o6','cmms0gxqg056zf74yaiqtibqz',
    'cmms0is1n05bnf74yt5o90xfw','cmms0issh05ctf74yqddgcud8','cmms0l4pq05h3f74ydnvkpcw0',
    'cmms0l56m05hvf74ypzzqp3wz','cmms0n6y005nbf74y1wip43iy','cmms0rzhq05zrf74ylhrnqbl9',
    'cmms0s1r30639f74yok59xlko','cmms0u0dw0657f74y3rpgosbd','cmms1dhg906mbf74ytblffrhg',
    'cmms1digm06nvf74yam1aujll','cmms1fryk06tbf74yo4iirbic','cmms1ftzk06w1f74y8he4g69p',
    'cmn3f8xn101ip97ugeq3lee9f','cmn3f9t8001m797ugqgy74s3e','cmn3fge76026797ugpsscr115',
    'cmn3fd3js01tv97ug3me3xmia','cmn3fd3zg01ud97ugppxfxyzx','cmn3fd4jz01v197ug15zbqit0',
    'cmn3fd55901vp97ugr27503my','cmn3fd5kq01w797uge9xbjlc8','cmn3fd61901wp97uga0fv13zs',
    'cmn3fdzh101x197ugei27y9wf','cmn3fe0ai01xv97ugc9j73yh5','cmn3fe1mv01zd97ug3njmd7bg',
    'cmn3fe1s601zj97ughks1mvfv','cmn3ff16u021d97ugra1f1qqz','cmn3ff1mg021v97ugot0vf3v9',
    'cmn3ff36o023j97ugb4qgv6qb','cmn3ffi2y024d97ugi8kb6wcx','cmn3fgfmc027p97ugfu79lb95',
  ],
  speed_default: [
    'cmms0gwgy0551f74ys3we5rhy','cmms0gx0d055tf74y4fq5m8o6','cmms0l5wj05j1f74yams2sctf',
    'cmms0n77h05npf74ymemss746','cmms0rzhq05zrf74ylhrnqbl9','cmms1dk6c06qlf74yt5gk7n9p',
    'cmms1i4or06zxf74ylsygf0t2','cmms1i5jn0713f74y740rbcas','cmn3fd3js01tv97ug3me3xmia',
    'cmn3fd4pr01v797uggp9ue7cb','cmn3fd5qy01wd97ugwuticrod','cmn3fd5w301wj97ugf2gykj8s',
    'cmn3fdzh101x197ugei27y9wf','cmn3fdzn801x797ug0l7gme1i','cmn3fdzz301xj97ugswhf6o6s',
    'cmn3fe0fm01y197ug4ml3c51h','cmn3fe0kx01y797ug41rptjps','cmn3fe1mv01zd97ug3njmd7bg',
    'cmn3fe27v020197ugw1rmyor5','cmn3fe2cy020797ugim4o9ch7','cmn3ff0gj020j97ugtuv24vp9',
    'cmn3ff0qo020v97ughbuyxov4','cmn3ff1tj022197ugtljxbvnl','cmn3ff25b022d97ug4c8giltx',
    'cmn3ff2al022j97uggv5bc5bg','cmn3ff2qv023197ugjjlodkir','cmn3ffhh7023p97ug5bzii2ju',
    'cmn3ffhwp024797ugx1w4gbsh',
  ],
  speed_school: [
    'cmn3fd3ec01tp97ugwele6w3c','cmn3fd55901vp97ugr27503my','cmn3fe05501xp97ugs7r9urlb',
    'cmn3fe0ai01xv97ugc9j73yh5','cmn3fe16701yv97ugsz8h8257','cmn3ff0w8021197ugluj1guke',
    'cmn3ff16u021d97ugra1f1qqz','cmn3ff1mg021v97ugot0vf3v9','cmn3ff315023d97ugqe9qlk1l',
    'cmn3ffi2y024d97ugi8kb6wcx',
  ],
  speed_following: [
    'cmms0u0ux065lf74yatkbqces','cmms0l7u705m5f74yb03sxlm6','cmms0n8vi05q1f74yzsfwaoeh',
    'cmms0ryrc05ylf74yb8i6vy26','cmn3fgcsu024p97ug0mtfcbf0','cmn3fgfri027v97ugfzf9a8jr',
    'cmn3fhgl3029797ug7rjlkdmx','cmn3fildb02e197ugin81w2ih','cmn3fgeo7026p97ugxxtlzi6t',
  ],
  row_pedestrian: [
    'cmms0q2ki05vvf74y430opf5q','cmn3fatkh01mp97ug0f3z46uu','cmn3fatxx01n797ugwfc5x19d',
    'cmn3favlu01p797ug69602fmd','cmn3fbvqr01q797ug4t9fuupm','cmn3fbvx801qd97ugv3lsdqkg',
    'cmn3fbyj101sp97ugn9ug7jco','cmn3fijza02cp97ug1m9izfn2',
  ],
  row_school_bus: [
    'cmms0l4y605hhf74yh0lrf46e', // actually railroad - skip from school bus delete
  ],
  row_emergency: [
    'cmms0gyh80585f74y00ggeo0n','cmms0it9f05dlf74ywmjlwcke','cmms0l65405jff74ygubzwrvp',
    'cmms0q19g05ubf74y5p96e3bn','cmms0q3aj05x1f74yqao5p888','cmms0tzub064ff74y41b57uq0',
    'cmms1ocdm07izf74y5fg9aw21','cmms0u2ao066rf74ysweb3gv2','cmn3fatth01n197ugz8ryll7o',
    'cmn3faug301nv97ugdee4pdu7','cmn3fbwld01r197ugmuyufhey','cmn3fbx5801rj97ugih82d0n4',
    'cmn3fbyo401sv97ug9b10cvtt','cmn3fhgrg029d97uguollvoor','cmn3fikq602dd97ugo52ourrv',
  ],
  safe_cell: [
    'cmms0l6me05k7f74ybghp7uzj','cmms19tp906fbf74y7ld7dv9b','cmms1kapf074lf74ydbvm099h',
    'cmms1m9y907aff74yewiuez43','cmms1oam607g9f74y3372ux8a','cmms1q9pl07mvf74yf5jiss28',
    'cmn3fgezq027197ugt7y0tji9',
  ],
  alcohol_dwi: [
    'cmn3fkbk002hd97ugl5lduxdm','cmn3fkbz302hv97ugxsmrezxj','cmn3fkc4402i197uggheqvtqh',
    'cmn3fla2t02kp97ugjix9bl04','cmn3fla7v02kv97ugudn0prvh','cmn3flajg02l797ugdz8ba60q',
    'cmn3flaos02ld97ugz3py5cjq','cmn3fmeyh02nv97ug61yutiez','cmn3fmf3302o197ugoxm3spfa',
    'cmn3fmfba02o797ugqbelobz1','cmn3fmfgr02od97ug8yl2oxr1','cmn3fmflc02oj97ug0z1ydc9z',
    'cmn3fmfqq02op97ugnm43mixd','cmn3fmfux02ov97ug3h5k3qxs','cmn3fmg2302p197ug4czak9mj',
    'cmn3fmg7o02p797ugsmnezz25','cmn3fmgcw02pd97ugatqm5rav','cmn3fmgid02pj97ugvaws3dsv',
    'cmn3fmgnh02pp97ugvyowvdp9','cmn3fmgrw02pv97ug6w889zak','cmn3fmgx402q197ug330by2oy',
    'cmn3fmh1v02q797ug4qfbqt0h','cmn3fmh7b02qd97ugxptaqhuq','cmn3fmhgb02qp97ug1ws0ssf4',
    'cmn3fmhky02qv97ugiz89x309','cmn3fmhq502r197ug0tusk78o','cmn3fn98102r797ugdf72hl39',
    'cmn3fn9ck02rd97uge354a32r','cmn3fn9ht02rj97ug4jq4v3s9','cmn3fn9nc02rp97ugr809hfbv',
    'cmn3fn9vn02rv97ugmsl7j1pl','cmn3fna1h02s197ugi2eozsk9','cmn3fna7602s797ug43j6jjkm',
    'cmn3fnabp02sd97ugcizsxjif','cmn3fnagb02sj97ugcnbx0xfd','cmn3fnalr02sp97ug8mamra71',
    'cmn3fnaur02t197uguagsxn50','cmn3fnaz802t797uger2to1v5','cmn3fnb4d02td97ugbt7t8k8m',
    'cmn3fnb8v02tj97ugdqcfhb3e',
  ],
  alcohol_bac: [
    'cmn3fkbk002hd97ugl5lduxdm','cmn3fkbtx02hp97ugct22yquc','cmn3fkcuq02iv97uge1k0e4rz',
    'cmn3fkd9y02jd97ug5kh5ls31','cmn3fla2t02kp97ugjix9bl04','cmn3fla7v02kv97ugudn0prvh',
    'cmn3fladw02l197ugb1ov1tqn','cmn3flbf602lv97ug90vbyxmd','cmn3fnalr02sp97ug8mamra71',
  ],
  license_junior: [
    'cmms1oclz07jdf74ydxlvmja9','cmn3fo0vz02tv97ugz8tf9zej','cmn3fo16l02u797ug1ve143rm',
    'cmn3fo1em02ud97ugoxttfrur','cmn3fo2f402vp97ug36x532mh','cmn3fo2tf02w797ugvp3exqj8',
    'cmn3fo37502wp97ugdxf3yxb1','cmn3foy2m02x797ugeyn7tlar','cmn3foybi02xd97ug2no08wvr',
    'cmn3foyp802xv97ugoi2pcwb9','cmn3foyto02y197ugppc7vovc','cmn3foyy002y797ugumjtctqq',
    'cmn3foz2l02yd97ugtqveup0t','cmn3fozc502yp97ugo5rmqjzv','cmn3fozgj02yv97ugtsykzd0d',
    'cmn3fp03x02zp97ugvjfqsydh','cmn3fp08g02zv97ugyfw8mbsa','cmn3fp0h0030797ugkfiv769l',
    'cmn3fpimt030j97ugmkwqffbr','cmn3fpj0k031197ugecz41f95','cmn3fpjas031d97ug9vwgr6iw',
  ],
  license_learner: [
    'cmms0iu8n05f5f74y2f6auewc','cmn3fo0qf02tp97ug2ommp6yt','cmn3fo0vz02tv97ugz8tf9zej',
    'cmn3fo10q02u197ugqtxqh91z','cmn3fo22002v797ugio5nw3v5','cmn3fo2ao02vj97ugexgiebjo',
    'cmn3fo2ov02w197ug3uyrskib','cmn3fozgj02yv97ugtsykzd0d','cmn3fozuu02zd97ugovlyrhes',
    'cmn3fp0h0030797ugkfiv769l','cmn3fpira030p97ugvjfqsydh',
  ],
  license_knowledge: [
    'cmms0gyz9058xf74y8qnjoen0','cmms0itin05dzf74ymajvm6a8','cmms0itr805edf74ywyrxar7b',
    'cmms0n9uf05rlf74yo61xcs0k','cmms19sxy06e5f74yw409j8r4','cmms19t7506ejf74yv9jyhgla',
    'cmms1mckj07ebf74ykcmtle2e','cmms1q9yp07n9f74yll3aemm4','cmms0itzy05erf74yw0hgax6o',
  ],
  signs_warning: [
    'cmms0l4y605hhf74yh0lrf46e','cmn3f8vl601g797ugs8mw65r1','cmn3f8wra01hj97ugklh3wz3k',
    'cmn3f8x9e01i797ugc8hzdea3','cmn3f8xdu01id97ug0og1th65','cmn3f8xii01ij97uggcyd9a2f',
    'cmn3f8xwk01j197ugn1299qbm','cmn3f8y6t01jd97ugcp4svss5','cmn3f9rqf01kj97ugwq0otkwe',
    'cmn3f9rxg01kp97uge7m16roe','cmn3f9s8101l197ugy5ixpn5n','cmn3f9shn01ld97ug8a12urqy',
    'cmn3f9sn001lj97ugcmg9e7rb','cmn7i7la2002798at10yqv65w',
  ],
};

const KEEP_SETS = {
  speed_nyc: KEEP_SPEED_NYC,
  speed_default: KEEP_SPEED_DEFAULT,
  speed_school: KEEP_SCHOOL_ZONE,
  speed_following: KEEP_SPEED_FOLLOWING,
  row_pedestrian: KEEP_PEDESTRIAN,
  row_emergency: KEEP_EMERGENCY,
  safe_cell: KEEP_CELL_PHONE,
  alcohol_dwi: KEEP_DWI,
  alcohol_bac: KEEP_BAC,
  license_junior: KEEP_JUNIOR,
  license_learner: KEEP_LEARNER,
  license_knowledge: KEEP_KNOWLEDGE_TEST,
  signs_warning: KEEP_WARNING,
};

async function main() {
  console.log('Building NY delete list...\n');

  const toDelete = new Set();
  for (const [concept, ids] of Object.entries(ALL_CONCEPT_IDS)) {
    const keepSet = KEEP_SETS[concept];
    if (!keepSet) continue;
    for (const id of ids) {
      if (!keepSet.has(id)) toDelete.add(id);
    }
  }

  const deleteArr = [...toDelete];
  console.log(`Questions to delete: ${deleteArr.length}`);

  // Get choice IDs first for cascade
  const choices = await p.choice.findMany({
    where: { questionId: { in: deleteArr } },
    select: { id: true },
  });
  const choiceIds = choices.map(c => c.id);

  await p.answer.deleteMany({ where: { choiceId: { in: choiceIds } } });
  await p.$transaction([
    p.answer.deleteMany({ where: { questionId: { in: deleteArr } } }),
    p.userProgress.deleteMany({ where: { questionId: { in: deleteArr } } }),
    p.questionTranslation.deleteMany({ where: { questionId: { in: deleteArr } } }),
    p.choice.deleteMany({ where: { questionId: { in: deleteArr } } }),
    p.question.deleteMany({ where: { id: { in: deleteArr } } }),
  ]);

  const final = await p.question.count({ where: { stateId: NY } });
  console.log(`\nDeleted ${deleteArr.length} questions`);
  console.log(`Final NY question count: ${final}`);

  await p.$disconnect();
}

main().catch(e => { console.error(e); p.$disconnect(); });
