const fs = require('fs');
const BASE = '/Users/jjakc/Desktop/dmv-prep/src/app';

const fixes = [
  {
    file: `${BASE}/first-time-drivers-guide/page.tsx`,
    old: "Complete guide for first-time drivers. Learn how to get your learner's permit, pass the DMV written test, and get your driver's license in 2026. All 50 states covered.",
    new: "First-time driver? Here's exactly how to get your permit and license — step by step. Free guide for all 50 states. Start your journey today!",
  },
  {
    file: `${BASE}/how-many-questions-on-dmv-test/page.tsx`,
    old: "Find out exactly how many questions are on the DMV written test in every state. Includes passing scores, number of questions allowed wrong, and tips to pass first try.",
    new: "How many questions on YOUR state's DMV test? Complete list for all 50 states with passing scores and tips. Find out now — free!",
  },
  {
    file: `${BASE}/dmv-test-passing-score/page.tsx`,
    old: "Find out what score you need to pass the DMV written test in every state. Most states require 80%, but some are higher or lower. Full list for all 50 states updated 2026.",
    new: "What score do you need to pass the DMV test in your state? Full list for all 50 states. Most require 80% — find yours now!",
  },
  {
    file: `${BASE}/dmv-test-age-requirements/page.tsx`,
    old: "Find out the minimum age to get a learner's permit and driver's license in every US state. Complete 2026 guide to DMV age requirements for all 50 states.",
    new: "How old do you need to be to get a driver's permit? Age requirements for all 50 states — some start at 14! Full 2026 guide.",
  },
  {
    file: `${BASE}/florida-dmv-test-english-only/page.tsx`,
    old: "Florida now requires all driver license exams in English only as of February 6, 2026. Learn what changed, who is affected, and how to prepare for the Florida DMV written test in English.",
    new: "Florida DMV test is NOW English only (Feb 2026). Learn what changed, who's affected, and how to prepare and pass. Free practice tests included.",
  },
  {
    file: `${BASE}/dmv-test-in-spanish/page.tsx`,
    old: "Find out which states allow you to take the DMV written test in Spanish in 2026. Includes Florida's new English-only policy and how non-native speakers can prepare.",
    new: "Can you take the DMV test in Spanish? YES in most states — NO in Florida (2026). Full list + tips to pass even in English. Free practice included.",
  },
  {
    file: `${BASE}/examen-dmv-en-espanol/page.tsx`,
    old: "Descubre en qué estados de EEUU puedes tomar el examen de manejo en español en 2026. Incluye la nueva política de solo inglés de Florida y consejos para prepararte.",
    new: "¿Examen DMV en español? SÍ en la mayoría de estados — NO en Florida (2026). Lista completa + consejos para pasar. ¡Practica gratis ahora!",
  },
  {
    file: `${BASE}/examen-dmv-ingles-obligatorio-florida/page.tsx`,
    old: "Florida ya no permite tomar el examen de manejo en español desde el 6 de febrero de 2026. Aprende qué cambió, quién es afectado y cómo prepararte para el examen en inglés.",
    new: "Florida ya NO permite el examen en español (desde feb 2026). Aprende qué cambió y cómo prepararte para pasar el examen en inglés. ¡Practica gratis!",
  },
];

let fixed = 0;
fixes.forEach(({file, old: o, new: n}) => {
  try {
    let f = fs.readFileSync(file, 'utf8');
    if (f.includes(o)) {
      f = f.replace(o, n);
      fs.writeFileSync(file, f);
      console.log('✅', file.split('/').slice(-2).join('/'));
      fixed++;
    } else {
      console.log('❌ Not found:', file.split('/').slice(-2).join('/'));
    }
  } catch(e) {
    console.log('❌ Error:', file.split('/').slice(-2).join('/'), e.message);
  }
});
console.log('\nFixed:', fixed, '/', fixes.length);
