// src/app/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle, BookOpen, AlertCircle, Globe, AlertTriangle } from "lucide-react";

// Which states are English-only as of 2026
const ENGLISH_ONLY_STATES: Record<string, string> = {
  florida: "As of February 6, 2026, Florida requires all DMV knowledge and skills exams to be taken in English only. Interpreters and translation devices are strictly prohibited.",
  oklahoma: "Oklahoma conducts all DMV exams in English only.",
  wyoming: "Wyoming conducts all DMV knowledge exams in English only.",
  "south-dakota": "South Dakota requires the skills (road) test to be conducted in English only.",
  utah: "Utah administers all DMV exams in English only.",
  louisiana: "Louisiana provides all DMV exams in English only.",
};

const LANGUAGES: Record<string, {
  name: string;
  nativeName: string;
  heroSubtitle: string;
  introParagraph: string;
  studyTipsHeading: string;
  studyTips: string[];
  faqHeading: string;
  ctaLabel: string;
  signLabel: string;
  sampleLabel: string;
  explanationLabel: string;
}> = {
  spanish: {
    name: "Spanish",
    nativeName: "Espanol",
    heroSubtitle: "Practica el examen del DMV en espanol",
    introParagraph: "Are you learning to drive in the United States? The DMV written test can be hard especially if English is not your first language. DMVPrep Pro gives you practice questions with simple, clear explanations. You can also read every question translated into Spanish. This helps you understand the rules better and pass on your first try.",
    studyTipsHeading: "Study Tips for Spanish Speakers",
    studyTips: [
      "Read each question slowly. Do not rush.",
      "Use the Spanish translation button to check words you do not understand.",
      "Focus on road signs — they are the same in every state.",
      "Practice the Full Exam mode at least 3 times before your real test.",
      "Study the DMV Handbook Summary for your state — it covers all the key rules.",
    ],
    faqHeading: "Preguntas Frecuentes / Frequently Asked Questions",
    ctaLabel: "Empezar Gratis / Start Free",
    signLabel: "Common Road Signs",
    sampleLabel: "Ejemplo de Pregunta / Sample Question",
    explanationLabel: "Explicacion / Explanation",
  },
  chinese: {
    name: "Chinese",
    nativeName: "中文",
    heroSubtitle: "用中文练习DMV驾照笔试",
    introParagraph: "Are you preparing for the DMV written test in the United States? If Chinese is your first language, studying in English can be difficult. DMVPrep Pro lets you practice test questions with simple English explanations and you can view each question translated into Chinese. This makes it easier to understand driving rules and pass your DMV test.",
    studyTipsHeading: "Study Tips for Chinese Speakers",
    studyTips: [
      "Start with the Road Signs test — signs are visual and easy to learn.",
      "Use the Chinese translation feature to understand difficult questions.",
      "Take the Full Exam simulator to feel ready on test day.",
      "Read the DMV Handbook Summary for your state — it is shorter than the full handbook.",
      "Practice every day for one week before your test appointment.",
    ],
    faqHeading: "常见问题 / Frequently Asked Questions",
    ctaLabel: "免费开始练习",
    signLabel: "Common Road Signs",
    sampleLabel: "题目示例 / Sample Question",
    explanationLabel: "解释 / Explanation",
  },
  vietnamese: {
    name: "Vietnamese",
    nativeName: "Tieng Viet",
    heroSubtitle: "Practice the DMV test with Vietnamese translations",
    introParagraph: "Are you getting ready for the DMV written test? If Vietnamese is your first language, studying traffic rules in English can be confusing. DMVPrep Pro helps you practice with simple questions and clear explanations. You can also view translations in Vietnamese to help you understand every rule.",
    studyTipsHeading: "Study Tips for Vietnamese Speakers",
    studyTips: [
      "Practice road signs first — they are visual and quick to learn.",
      "Use the translation feature when you see a word you do not know.",
      "Take the Quick Test mode every day to build your confidence.",
      "Read the state-specific study guide before your test day.",
      "Focus on right-of-way rules — they are often on the test.",
    ],
    faqHeading: "常见问题 / Frequently Asked Questions",
    ctaLabel: "免费开始练习",
    signLabel: "Common Road Signs",
    sampleLabel: "Sample Question / Cau hoi mau",
    explanationLabel: "Explanation / Giai thich",
  },
  "haitian-creole": {
    name: "Haitian Creole",
    nativeName: "Kreyo Ayisyen",
    heroSubtitle: "Practice the DMV test with Haitian Creole translations",
    introParagraph: "Are you preparing for the DMV written test? If Haitian Creole is your first language, the test can feel difficult in English. DMVPrep Pro helps you practice with simple questions and plain English explanations. You can also use our translation feature to read questions in your language.",
    studyTipsHeading: "Study Tips for Haitian Creole Speakers",
    studyTips: [
      "Start with the Road Signs section — signs are the same everywhere in the US.",
      "Use the translation tool when you see English words you do not understand.",
      "Do the Full Exam practice at least twice before your real test.",
      "Read the DMV Handbook Summary — it explains all the key rules in simple words.",
      "The real test is in English — practice reading English questions so you are ready.",
    ],
    faqHeading: "Kesyon Yo Poze Souvan / Frequently Asked Questions",
    ctaLabel: "Komanse Gratis / Start Free",
    signLabel: "Common Road Signs",
    sampleLabel: "Kesyon Egzanp / Sample Question",
    explanationLabel: "Eksplikasyon / Explanation",
  },
  portuguese: {
    name: "Portuguese",
    nativeName: "Portugues",
    heroSubtitle: "Pratique o exame do DMV em portugues",
    introParagraph: "Are you preparing for the DMV written test in the United States? If Portuguese is your first language, studying in English can be hard. DMVPrep Pro gives you practice questions with simple, clear explanations. You can also view each question translated into Portuguese. This helps you understand US traffic laws and pass your DMV test on the first try.",
    studyTipsHeading: "Study Tips for Portuguese Speakers",
    studyTips: [
      "Practice road signs every day — they appear on every DMV test.",
      "Use the Portuguese translation to check words you do not know.",
      "Take the Full Exam simulator before your real appointment.",
      "Study your state DMV Handbook Summary for state-specific rules.",
      "Focus on speed limit rules — they vary by road type and are often tested.",
    ],
    faqHeading: "Perguntas Frequentes / Frequently Asked Questions",
    ctaLabel: "Comecar Gratis / Start Free",
    signLabel: "Common Road Signs",
    sampleLabel: "Exemplo de Questao / Sample Question",
    explanationLabel: "Explicacao / Explanation",
  },
};


const STATES: Record<string, {
  name: string;
  slug: string;
  questionsCount: number;
  passingScore: number;
  highlight: string;
  langAvailability: Record<string, string>;
}> = {
  florida: {
    name: "Florida",
    slug: "florida",
    questionsCount: 50,
    passingScore: 80,
    highlight: "Florida has one of the highest pass rates when drivers practice at least 5 full tests before their appointment.",
    langAvailability: {
      spanish: "As of February 6, 2026, Florida requires all DMV knowledge and skills exams to be taken in English only. Interpreters and translation devices are strictly prohibited. You must study in English and take the real test in English.",
      chinese: "As of February 6, 2026, Florida requires all DMV knowledge and skills exams to be taken in English only. You must take the real test in English. Use our translation feature to study and understand the material, then practice answering in English.",
      vietnamese: "As of February 6, 2026, Florida requires all DMV knowledge and skills exams to be taken in English only. You must take the real test in English. Use our translations to help you study, but practice reading the English versions so you are ready.",
      "haitian-creole": "As of February 6, 2026, Florida requires all DMV knowledge and skills exams to be taken in English only. Interpreters and translation devices are strictly prohibited. Use DMVPrep Pro to study with Haitian Creole translations, then practice the English versions before your test.",
      portuguese: "As of February 6, 2026, Florida requires all DMV knowledge and skills exams to be taken in English only. You must take the real test in English. Use our translations to understand the material, but make sure to practice the English questions before your appointment.",
    },
  },
  california: {
    name: "California",
    slug: "california",
    questionsCount: 46,
    passingScore: 83,
    highlight: "California requires 83% to pass. That is 38 out of 46 questions correct. Practicing road signs is especially important.",
    langAvailability: {
      spanish: "Yes. California offers the official DMV written test in Spanish. You can request a Spanish-language test at your local DMV office.",
      chinese: "Yes. California offers the official DMV written test in Chinese (Simplified and Traditional). You can request it at your local DMV office.",
      vietnamese: "Yes. California offers the official DMV written test in Vietnamese. You can request it at your local DMV office.",
      "haitian-creole": "California does not currently offer the DMV test in Haitian Creole. The test is available in English, Spanish, Chinese, Vietnamese, and several other languages. You may need to take the test in English or another available language.",
      portuguese: "California does not currently offer the DMV test in Portuguese. The test is available in English, Spanish, Chinese, Vietnamese, and several other languages. You may need to take the test in English or another available language.",
    },
  },
  "new-york": {
    name: "New York",
    slug: "new-york",
    questionsCount: 40,
    passingScore: 70,
    highlight: "New York requires 70% to pass. The test focuses heavily on right-of-way rules and city driving situations.",
    langAvailability: {
      spanish: "Yes. New York offers the official DMV written test in Spanish. You can select your preferred language when scheduling your test.",
      chinese: "Yes. New York offers the official DMV written test in Chinese. You can select your preferred language when scheduling your test.",
      vietnamese: "Yes. New York offers the official DMV written test in Vietnamese. You can select your preferred language when scheduling your test.",
      "haitian-creole": "Yes. New York offers the official DMV written test in Haitian Creole. You can select your preferred language when scheduling your test.",
      portuguese: "Yes. New York offers the official DMV written test in Portuguese. You can select your preferred language when scheduling your test.",
    },
  },
  texas: {
    name: "Texas",
    slug: "texas",
    questionsCount: 30,
    passingScore: 70,
    highlight: "Texas has 30 questions and requires 70% to pass. Speed limit rules and highway driving come up frequently.",
    langAvailability: {
      spanish: "Yes. Texas offers the official DMV written test in Spanish. You can request a Spanish-language test at your local DPS office.",
      chinese: "Texas does not currently offer the DMV written test in Chinese. The test is available in English and Spanish. Use our translations to study, then take the test in English.",
      vietnamese: "Texas does not currently offer the DMV written test in Vietnamese. The test is available in English and Spanish. Use our translations to study, then take the test in English.",
      "haitian-creole": "Texas does not currently offer the DMV written test in Haitian Creole. The test is available in English and Spanish. Use our translations to study, then take the test in English.",
      portuguese: "Texas does not currently offer the DMV written test in Portuguese. The test is available in English and Spanish. Use our translations to study, then take the test in English.",
    },
  },
  "new-jersey": {
    name: "New Jersey",
    slug: "new-jersey",
    questionsCount: 50,
    passingScore: 80,
    highlight: "New Jersey has 50 questions. Many first-time drivers study in Spanish or Portuguese before taking the test.",
    langAvailability: {
      spanish: "Yes. New Jersey offers the official DMV written test in Spanish. You can request it at your local MVC office.",
      chinese: "Yes. New Jersey offers the official DMV written test in Chinese. You can request it at your local MVC office.",
      vietnamese: "Yes. New Jersey offers the official DMV written test in Vietnamese. You can request it at your local MVC office.",
      "haitian-creole": "Yes. New Jersey offers the official DMV written test in Haitian Creole. You can request it at your local MVC office.",
      portuguese: "Yes. New Jersey offers the official DMV written test in Portuguese. You can request it at your local MVC office.",
    },
  },
  illinois: {
    name: "Illinois",
    slug: "illinois",
    questionsCount: 35,
    passingScore: 80,
    highlight: "Illinois requires 80% to pass. The Chicago area has many multilingual DMV offices.",
    langAvailability: {
      spanish: "Yes. Illinois offers the official DMV written test in Spanish. You can request it at your local Secretary of State facility.",
      chinese: "Yes. Illinois offers the official DMV written test in Chinese. You can request it at your local Secretary of State facility.",
      vietnamese: "Yes. Illinois offers the official DMV written test in Vietnamese. You can request it at your local Secretary of State facility.",
      "haitian-creole": "Illinois does not currently offer the DMV test in Haitian Creole. The test is available in English, Spanish, Chinese, Vietnamese, and several other languages. You may need to take the test in English.",
      portuguese: "Yes. Illinois offers the official DMV written test in Portuguese. You can request it at your local Secretary of State facility.",
    },
  },
  georgia: {
    name: "Georgia",
    slug: "georgia",
    questionsCount: 40,
    passingScore: 75,
    highlight: "Georgia requires 75% to pass. Road sign questions make up a large portion of the Georgia DMV written test.",
    langAvailability: {
      spanish: "Yes. Georgia offers the official DMV written test in Spanish. You can request it at your local DDS office.",
      chinese: "Georgia does not currently offer the DMV written test in Chinese. The test is available in English and Spanish. Use our translations to study, then take the test in English.",
      vietnamese: "Georgia does not currently offer the DMV written test in Vietnamese. The test is available in English and Spanish. Use our translations to study, then take the test in English.",
      "haitian-creole": "Georgia does not currently offer the DMV written test in Haitian Creole. The test is available in English and Spanish. Use our translations to study, then take the test in English.",
      portuguese: "Georgia does not currently offer the DMV written test in Portuguese. The test is available in English and Spanish. Use our translations to study, then take the test in English.",
    },
  },
  massachusetts: {
    name: "Massachusetts",
    slug: "massachusetts",
    questionsCount: 25,
    passingScore: 72,
    highlight: "Massachusetts has only 25 questions but covers complex driving rules. Right-of-way and pedestrian laws are key.",
    langAvailability: {
      spanish: "Yes. Massachusetts offers the official DMV written test in Spanish. You can request it at your local RMV office.",
      chinese: "Yes. Massachusetts offers the official DMV written test in Chinese. You can request it at your local RMV office.",
      vietnamese: "Yes. Massachusetts offers the official DMV written test in Vietnamese. You can request it at your local RMV office.",
      "haitian-creole": "Yes. Massachusetts offers the official DMV written test in Haitian Creole. You can request it at your local RMV office.",
      portuguese: "Yes. Massachusetts offers the official DMV written test in Portuguese. You can request it at your local RMV office.",
    },
  },
  alabama: {
    name: "Alabama",
    slug: "alabama",
    questionsCount: 40,
    passingScore: 80,
    highlight: "Alabama requires 80% to pass. Road signs and right-of-way rules are heavily tested.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  alaska: {
    name: "Alaska",
    slug: "alaska",
    questionsCount: 20,
    passingScore: 80,
    highlight: "Alaska has only 20 questions. Study road signs and basic traffic laws carefully.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  arizona: {
    name: "Arizona",
    slug: "arizona",
    questionsCount: 30,
    passingScore: 80,
    highlight: "Arizona requires 80% to pass. Desert driving rules and speed limits are commonly tested.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  arkansas: {
    name: "Arkansas",
    slug: "arkansas",
    questionsCount: 25,
    passingScore: 80,
    highlight: "Arkansas has 25 questions. Focus on right-of-way rules and road signs.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  colorado: {
    name: "Colorado",
    slug: "colorado",
    questionsCount: 25,
    passingScore: 80,
    highlight: "Colorado has 25 questions. Mountain driving rules and speed limits are important to know.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  connecticut: {
    name: "Connecticut",
    slug: "connecticut",
    questionsCount: 25,
    passingScore: 80,
    highlight: "Connecticut has 25 questions. Focus on right-of-way and pedestrian rules.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  delaware: {
    name: "Delaware",
    slug: "delaware",
    questionsCount: 30,
    passingScore: 80,
    highlight: "Delaware has 30 questions. Road signs and traffic laws are the main focus.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  hawaii: {
    name: "Hawaii",
    slug: "hawaii",
    questionsCount: 30,
    passingScore: 80,
    highlight: "Hawaii has 30 questions. Island driving rules and pedestrian laws are commonly tested.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  idaho: {
    name: "Idaho",
    slug: "idaho",
    questionsCount: 40,
    passingScore: 80,
    highlight: "Idaho has 40 questions. Rural driving rules and speed limits are important to know.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  indiana: {
    name: "Indiana",
    slug: "indiana",
    questionsCount: 50,
    passingScore: 84,
    highlight: "Indiana requires 84% to pass — one of the strictest passing scores in the country.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  iowa: {
    name: "Iowa",
    slug: "iowa",
    questionsCount: 35,
    passingScore: 80,
    highlight: "Iowa has 35 questions. Rural road rules and right-of-way are commonly tested.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  kansas: {
    name: "Kansas",
    slug: "kansas",
    questionsCount: 25,
    passingScore: 80,
    highlight: "Kansas has 25 questions. Speed limit rules and road signs are the main focus.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  kentucky: {
    name: "Kentucky",
    slug: "kentucky",
    questionsCount: 40,
    passingScore: 80,
    highlight: "Kentucky has 40 questions. Focus on road signs and safe following distance.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  louisiana: {
    name: "Louisiana",
    slug: "louisiana",
    questionsCount: 40,
    passingScore: 80,
    highlight: "Louisiana requires 80% to pass. Note that the test is English only as of 2026.",
    langAvailability: {
      spanish: "The DMV written test in this state must be taken in English only. Use DMVPrep Pro to study with translations, then practice the English versions before your test.",
      chinese: "The DMV written test in this state must be taken in English only. Use DMVPrep Pro to study with translations, then practice the English versions before your test.",
      vietnamese: "The DMV written test in this state must be taken in English only. Use DMVPrep Pro to study with translations, then practice the English versions before your test.",
      "haitian-creole": "The DMV written test in this state must be taken in English only. Use DMVPrep Pro to study with translations, then practice the English versions before your test.",
      portuguese: "The DMV written test in this state must be taken in English only. Use DMVPrep Pro to study with translations, then practice the English versions before your test.",
    },
  },
  maine: {
    name: "Maine",
    slug: "maine",
    questionsCount: 29,
    passingScore: 80,
    highlight: "Maine has 29 questions. Winter driving rules and road signs are commonly tested.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  maryland: {
    name: "Maryland",
    slug: "maryland",
    questionsCount: 25,
    passingScore: 84,
    highlight: "Maryland requires 84% to pass. Right-of-way and road sign rules are heavily tested.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  michigan: {
    name: "Michigan",
    slug: "michigan",
    questionsCount: 50,
    passingScore: 80,
    highlight: "Michigan has 50 questions. Road signs and winter driving rules are commonly tested.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  minnesota: {
    name: "Minnesota",
    slug: "minnesota",
    questionsCount: 40,
    passingScore: 80,
    highlight: "Minnesota has 40 questions. Winter driving and right-of-way rules are important to study.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  mississippi: {
    name: "Mississippi",
    slug: "mississippi",
    questionsCount: 30,
    passingScore: 80,
    highlight: "Mississippi has 30 questions. Focus on road signs and basic traffic laws.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  missouri: {
    name: "Missouri",
    slug: "missouri",
    questionsCount: 25,
    passingScore: 80,
    highlight: "Missouri has 25 questions. Road signs and speed limit rules are commonly tested.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  montana: {
    name: "Montana",
    slug: "montana",
    questionsCount: 33,
    passingScore: 80,
    highlight: "Montana has 33 questions. Rural road rules and speed limits are important to know.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  nebraska: {
    name: "Nebraska",
    slug: "nebraska",
    questionsCount: 25,
    passingScore: 80,
    highlight: "Nebraska has 25 questions. Focus on road signs and right-of-way rules.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  nevada: {
    name: "Nevada",
    slug: "nevada",
    questionsCount: 25,
    passingScore: 80,
    highlight: "Nevada has 25 questions with a 60-minute time limit. Nevada offers the unique KnowToDrive online test you can take from home. Desert driving, Las Vegas-area rules, and road signs are commonly tested.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  "new-hampshire": {
    name: "New Hampshire",
    slug: "new-hampshire",
    questionsCount: 40,
    passingScore: 80,
    highlight: "New Hampshire has 40 questions. Winter driving and right-of-way rules are key.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  "new-mexico": {
    name: "New Mexico",
    slug: "new-mexico",
    questionsCount: 25,
    passingScore: 80,
    highlight: "New Mexico has 25 questions. Desert driving rules and road signs are important.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  "north-carolina": {
    name: "North Carolina",
    slug: "north-carolina",
    questionsCount: 25,
    passingScore: 80,
    highlight: "North Carolina has 25 questions. Road signs and right-of-way rules are commonly tested.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  "north-dakota": {
    name: "North Dakota",
    slug: "north-dakota",
    questionsCount: 25,
    passingScore: 80,
    highlight: "North Dakota has 25 questions. Winter driving and rural road rules are important.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  ohio: {
    name: "Ohio",
    slug: "ohio",
    questionsCount: 40,
    passingScore: 75,
    highlight: "Ohio requires 75% to pass. Road signs and right-of-way rules are heavily tested.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  oklahoma: {
    name: "Oklahoma",
    slug: "oklahoma",
    questionsCount: 50,
    passingScore: 80,
    highlight: "Oklahoma has 50 questions. Note that the test is English only as of 2026.",
    langAvailability: {
      spanish: "The DMV written test in this state must be taken in English only. Use DMVPrep Pro to study with translations, then practice the English versions before your test.",
      chinese: "The DMV written test in this state must be taken in English only. Use DMVPrep Pro to study with translations, then practice the English versions before your test.",
      vietnamese: "The DMV written test in this state must be taken in English only. Use DMVPrep Pro to study with translations, then practice the English versions before your test.",
      "haitian-creole": "The DMV written test in this state must be taken in English only. Use DMVPrep Pro to study with translations, then practice the English versions before your test.",
      portuguese: "The DMV written test in this state must be taken in English only. Use DMVPrep Pro to study with translations, then practice the English versions before your test.",
    },
  },
  oregon: {
    name: "Oregon",
    slug: "oregon",
    questionsCount: 35,
    passingScore: 80,
    highlight: "Oregon has 35 questions. Road signs and safe driving rules are the main focus.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  pennsylvania: {
    name: "Pennsylvania",
    slug: "pennsylvania",
    questionsCount: 18,
    passingScore: 83,
    highlight: "Pennsylvania has only 18 questions but requires 83% to pass. Every question counts.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  "rhode-island": {
    name: "Rhode Island",
    slug: "rhode-island",
    questionsCount: 25,
    passingScore: 80,
    highlight: "Rhode Island has 25 questions. Focus on road signs and pedestrian rules.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  "south-carolina": {
    name: "South Carolina",
    slug: "south-carolina",
    questionsCount: 30,
    passingScore: 80,
    highlight: "South Carolina has 30 questions. Road signs and right-of-way rules are commonly tested.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  "south-dakota": {
    name: "South Dakota",
    slug: "south-dakota",
    questionsCount: 25,
    passingScore: 80,
    highlight: "South Dakota has 25 questions. Note that the skills test is English only as of 2026.",
    langAvailability: {
      spanish: "The DMV written test in this state must be taken in English only. Use DMVPrep Pro to study with translations, then practice the English versions before your test.",
      chinese: "The DMV written test in this state must be taken in English only. Use DMVPrep Pro to study with translations, then practice the English versions before your test.",
      vietnamese: "The DMV written test in this state must be taken in English only. Use DMVPrep Pro to study with translations, then practice the English versions before your test.",
      "haitian-creole": "The DMV written test in this state must be taken in English only. Use DMVPrep Pro to study with translations, then practice the English versions before your test.",
      portuguese: "The DMV written test in this state must be taken in English only. Use DMVPrep Pro to study with translations, then practice the English versions before your test.",
    },
  },
  tennessee: {
    name: "Tennessee",
    slug: "tennessee",
    questionsCount: 30,
    passingScore: 80,
    highlight: "Tennessee has 30 questions. Road signs and basic traffic laws are the main focus.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  utah: {
    name: "Utah",
    slug: "utah",
    questionsCount: 50,
    passingScore: 80,
    highlight: "Utah has 50 questions. Note that the test is English only as of 2026.",
    langAvailability: {
      spanish: "The DMV written test in this state must be taken in English only. Use DMVPrep Pro to study with translations, then practice the English versions before your test.",
      chinese: "The DMV written test in this state must be taken in English only. Use DMVPrep Pro to study with translations, then practice the English versions before your test.",
      vietnamese: "The DMV written test in this state must be taken in English only. Use DMVPrep Pro to study with translations, then practice the English versions before your test.",
      "haitian-creole": "The DMV written test in this state must be taken in English only. Use DMVPrep Pro to study with translations, then practice the English versions before your test.",
      portuguese: "The DMV written test in this state must be taken in English only. Use DMVPrep Pro to study with translations, then practice the English versions before your test.",
    },
  },
  vermont: {
    name: "Vermont",
    slug: "vermont",
    questionsCount: 20,
    passingScore: 80,
    highlight: "Vermont has only 20 questions. Study road signs and right-of-way rules carefully.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  virginia: {
    name: "Virginia",
    slug: "virginia",
    questionsCount: 35,
    passingScore: 80,
    highlight: "Virginia has 35 questions. Road signs and safe following distance are commonly tested.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  washington: {
    name: "Washington",
    slug: "washington",
    questionsCount: 40,
    passingScore: 80,
    highlight: "Washington has 40 questions. Road signs and right-of-way rules are the main focus.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  "west-virginia": {
    name: "West Virginia",
    slug: "west-virginia",
    questionsCount: 25,
    passingScore: 80,
    highlight: "West Virginia has 25 questions. Mountain driving rules and road signs are important.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  wisconsin: {
    name: "Wisconsin",
    slug: "wisconsin",
    questionsCount: 50,
    passingScore: 80,
    highlight: "Wisconsin has 50 questions. Winter driving and road sign rules are commonly tested.",
    langAvailability: {
      spanish: "Yes. This state offers the DMV written test in Spanish at most DMV offices.",
      chinese: "Yes. This state offers the DMV written test in Chinese at most DMV offices.",
      vietnamese: "Yes. This state offers the DMV written test in Vietnamese at most DMV offices.",
      "haitian-creole": "This state does not currently offer the DMV test in Haitian Creole. You may need to take the test in English or another available language.",
      portuguese: "This state does not currently offer the DMV test in Portuguese. You may need to take the test in English or another available language.",
    },
  },
  wyoming: {
    name: "Wyoming",
    slug: "wyoming",
    questionsCount: 25,
    passingScore: 80,
    highlight: "Wyoming has 25 questions. Note that the test is English only as of 2026.",
    langAvailability: {
      spanish: "The DMV written test in this state must be taken in English only. Use DMVPrep Pro to study with translations, then practice the English versions before your test.",
      chinese: "The DMV written test in this state must be taken in English only. Use DMVPrep Pro to study with translations, then practice the English versions before your test.",
      vietnamese: "The DMV written test in this state must be taken in English only. Use DMVPrep Pro to study with translations, then practice the English versions before your test.",
      "haitian-creole": "The DMV written test in this state must be taken in English only. Use DMVPrep Pro to study with translations, then practice the English versions before your test.",
      portuguese: "The DMV written test in this state must be taken in English only. Use DMVPrep Pro to study with translations, then practice the English versions before your test.",
    },
  },
};

// Sample questions with translations
const SAMPLE_QUESTIONS: Record<string, {
  english: string;
  translated: string;
  options: { english: string; translated: string }[];
  correct: number;
  explanationEnglish: string;
  explanationTranslated: string;
}[]> = {
  spanish: [
    {
      english: "What does a red octagon sign mean?",
      translated: "Que significa una senal de octagono rojo?",
      options: [
        { english: "Slow down", translated: "Reducir la velocidad" },
        { english: "Stop completely", translated: "Parar completamente" },
        { english: "Yield to traffic", translated: "Ceder el paso" },
        { english: "No entry", translated: "No entrar" },
      ],
      correct: 1,
      explanationEnglish: "A red octagon is always a STOP sign. You must come to a complete stop, check for traffic, and only go when it is safe.",
      explanationTranslated: "Un octagono rojo siempre es una senal de STOP. Debes detenerte completamente, verificar el trafico, y avanzar solo cuando sea seguro.",
    },
    {
      english: "You are at a 4-way stop. Another car arrived at the same time. Who goes first?",
      translated: "Estas en un cruce de 4 vias. Otro auto llego al mismo tiempo. Quien pasa primero?",
      options: [
        { english: "The car on your left", translated: "El auto a tu izquierda" },
        { english: "The car on your right", translated: "El auto a tu derecha" },
        { english: "The bigger car", translated: "El auto mas grande" },
        { english: "You go first", translated: "Tu pasas primero" },
      ],
      correct: 1,
      explanationEnglish: "At a 4-way stop, if two cars arrive at the same time, the car on the RIGHT goes first. Always yield to the right.",
      explanationTranslated: "En un cruce de 4 vias, si dos autos llegan al mismo tiempo, el auto a la DERECHA pasa primero. Siempre cede el paso a la derecha.",
    },
    {
      english: "What is the speed limit in a school zone when children are present?",
      translated: "Cual es el limite de velocidad en una zona escolar cuando hay ninos?",
      options: [
        { english: "25 mph", translated: "25 mph" },
        { english: "15 mph", translated: "15 mph" },
        { english: "35 mph", translated: "35 mph" },
        { english: "20 mph", translated: "20 mph" },
      ],
      correct: 1,
      explanationEnglish: "In most states, the speed limit near a school when children are present is 15 mph. Always slow down near schools.",
      explanationTranslated: "En la mayoria de los estados, el limite de velocidad cerca de una escuela cuando hay ninos es 15 mph. Siempre reduce la velocidad cerca de las escuelas.",
    },
  ],
  chinese: [
    {
      english: "What does a yellow diamond-shaped sign mean?",
      translated: "黄色菱形标志是什么意思？",
      options: [
        { english: "Stop ahead", translated: "前方停车" },
        { english: "Warning — be careful", translated: "警告 — 小心" },
        { english: "No parking", translated: "禁止停车" },
        { english: "Speed limit change", translated: "限速变化" },
      ],
      correct: 1,
      explanationEnglish: "Yellow diamond signs are warning signs. They tell you to be careful because of a hazard or change in the road ahead.",
      explanationTranslated: "黄色菱形标志是警告标志，提醒您前方有危险或道路变化。",
    },
    {
      english: "When can you turn right at a red light?",
      translated: "什么时候可以在红灯时右转？",
      options: [
        { english: "Never", translated: "从不" },
        { english: "Only if a sign permits it", translated: "只有标志允许时" },
        { english: "After stopping and checking for traffic", translated: "停车并确认无车辆后" },
        { english: "Anytime", translated: "随时" },
      ],
      correct: 2,
      explanationEnglish: "In most states, you can turn right at a red light after making a complete stop and checking that no cars or pedestrians are coming.",
      explanationTranslated: "在大多数州，红灯右转须先完全停车，确认无车辆和行人后方可进行。",
    },
    {
      english: "How close to a fire hydrant can you park?",
      translated: "对消防栓最近可以停车到多近？",
      options: [
        { english: "5 feet", translated: "5英尺" },
        { english: "10 feet", translated: "10英尺" },
        { english: "15 feet", translated: "15英尺" },
        { english: "No restriction", translated: "无限制" },
      ],
      correct: 2,
      explanationEnglish: "You must not park within 15 feet of a fire hydrant. Fire trucks need space to connect their hoses quickly.",
      explanationTranslated: "必须在消防栀15英尺范围外停车。消防车需要空间快速连接水管。",
    },
  ],
  vietnamese: [
    {
      english: "What does a white rectangular sign with black text usually show?",
      translated: "Bien bao hinh chu nhat mau trang voi chu den thuong cho biet dieu gi?",
      options: [
        { english: "A warning", translated: "Mot canh bao" },
        { english: "A law or rule you must follow", translated: "Mot luat hoac quy tac ban phai tuan theo" },
        { english: "A suggestion", translated: "Mot goi y" },
        { english: "A construction zone", translated: "Khu vuc xay dung" },
      ],
      correct: 1,
      explanationEnglish: "White rectangular signs are regulatory signs. They show rules you must follow, like speed limits and parking rules.",
      explanationTranslated: "Bien bao hinh chu nhat mau trang la bien bao quy dinh. Chung the hien cac quy tac ban phai tuan theo, nhu gioi han toc do va quy tac dau xe.",
    },
    {
      english: "You want to change lanes on the highway. What should you do first?",
      translated: "Ban muon doi lan duong tren duong cao toc. Ban nen lam gi truoc tien?",
      options: [
        { english: "Speed up", translated: "Tang toc" },
        { english: "Check mirrors and blind spots", translated: "Kiem tra guong va diem mu" },
        { english: "Honk your horn", translated: "Bam coi xe" },
        { english: "Slow down immediately", translated: "Giam toc ngay lap tuc" },
      ],
      correct: 1,
      explanationEnglish: "Before changing lanes, always check your mirrors and look over your shoulder to check your blind spot. Signal before you move.",
      explanationTranslated: "Truoc khi doi lan, luon kiem tra guong va nhin qua vai de kiem tra diem mu. Bat den xi nhan truoc khi chuyen lan.",
    },
    {
      english: "What should you do when an emergency vehicle approaches with lights and sirens?",
      translated: "Ban nen lam gi khi xe khan cap den gan voi den va coi hieu?",
      options: [
        { english: "Speed up to clear the way", translated: "Tang toc de nhuong duong" },
        { english: "Stop in the middle of the road", translated: "Dung giua duong" },
        { english: "Pull over to the right and stop", translated: "Di vao le phai va dung lai" },
        { english: "Ignore it", translated: "Bo qua no" },
      ],
      correct: 2,
      explanationEnglish: "Pull over to the right side of the road and stop until the emergency vehicle passes. This is the law in all 50 states.",
      explanationTranslated: "Di vao le duong ben phai va dung lai cho den khi xe khan cap di qua. Day la luat o tat ca 50 tieu bang.",
    },
  ],
  "haitian-creole": [
    {
      english: "What does a flashing yellow light mean?",
      translated: "Kisa yon limye jòn k ap klignote vle di?",
      options: [
        { english: "Stop and wait", translated: "Rete epi tann" },
        { english: "Proceed with caution", translated: "Kontinye avèk prekosyon" },
        { english: "The light is about to turn red", translated: "Limye a pral tounen wouj" },
        { english: "You must turn", translated: "Ou dwe vire" },
      ],
      correct: 1,
      explanationEnglish: "A flashing yellow light means slow down and proceed with caution. You do not have to stop, but you must be careful.",
      explanationTranslated: "Yon limye jòn k ap klignote vle di ralanti epi kontinye avèk prekosyon. Ou pa oblije kanpe, men ou dwe fè atansyon.",
    },
    {
      english: "How far before a turn should you signal?",
      translated: "Konbyen pye anvan yon vire ou dwe bay siyal?",
      options: [
        { english: "10 feet", translated: "10 pye" },
        { english: "50 feet", translated: "50 pye" },
        { english: "100 feet", translated: "100 pye" },
        { english: "200 feet", translated: "200 pye" },
      ],
      correct: 2,
      explanationEnglish: "You should signal at least 100 feet before you turn. This gives other drivers time to react safely.",
      explanationTranslated: "Ou dwe bay siyal omwen 100 pye anvan ou vire. Sa bay lòt chofè tan pou yo reyaji san danje.",
    },
    {
      english: "What does a solid white line on the road mean?",
      translated: "Kisa yon liy blan solid sou wout la vle di?",
      options: [
        { english: "You may cross it freely", translated: "Ou ka travèse l lib" },
        { english: "Do not cross it", translated: "Pa travèse l" },
        { english: "It marks a bike lane only", translated: "Li make yon wout bisiklèt sèlman" },
        { english: "It is a parking zone", translated: "Se yon zòn pakin" },
      ],
      correct: 1,
      explanationEnglish: "A solid white line means you should not cross it. It separates lanes of traffic moving in the same direction.",
      explanationTranslated: "Yon liy blan solid vle di ou pa ta dwe travèse l. Li separe vwa trafik ki ap deplase nan menm direksyon an.",
    },
  ],
  portuguese: [
    {
      english: "What is the legal blood alcohol limit for drivers over 21 in most US states?",
      translated: "Qual e o limite legal de alcool no sangue para motoristas acima de 21 anos na maioria dos estados dos EUA?",
      options: [
        { english: "0.05%", translated: "0.05%" },
        { english: "0.08%", translated: "0.08%" },
        { english: "0.10%", translated: "0.10%" },
        { english: "0.12%", translated: "0.12%" },
      ],
      correct: 1,
      explanationEnglish: "The legal blood alcohol limit for drivers 21 and older is 0.08% in most states. Driving above this limit is illegal and dangerous.",
      explanationTranslated: "O limite legal de alcool no sangue para motoristas com 21 anos ou mais e 0.08% na maioria dos estados. Dirigir acima desse limite e ilegal e perigoso.",
    },
    {
      english: "When must you use your headlights?",
      translated: "Quando voce deve usar os faróis?",
      options: [
        { english: "Only at night", translated: "Somente a noite" },
        { english: "At night and in rain or fog", translated: "A noite e na chuva ou neblina" },
        { english: "Only in tunnels", translated: "Somente em tuneis" },
        { english: "Whenever you want", translated: "Quando quiser" },
      ],
      correct: 1,
      explanationEnglish: "You must use headlights at night and also when visibility is low due to rain, fog, or other conditions.",
      explanationTranslated: "Voce deve usar os farois a noite e tambem quando a visibilidade estiver baixa por causa de chuva, neblina ou outras condicoes.",
    },
    {
      english: "What does a pennant-shaped sign mean?",
      translated: "O que significa uma placa em formato de flamula?",
      options: [
        { english: "Construction ahead", translated: "Construcao a frente" },
        { english: "No passing zone", translated: "Zona de nao ultrapassagem" },
        { english: "Speed limit change", translated: "Mudanca de limite de velocidade" },
        { english: "Merge ahead", translated: "Fusao a frente" },
      ],
      correct: 1,
      explanationEnglish: "A pennant-shaped yellow sign marks a No Passing Zone. You must not try to pass other vehicles in this area.",
      explanationTranslated: "Uma placa amarela em formato de flamula marca uma Zona de Nao Ultrapassagem. Voce nao deve tentar ultrapassar outros veiculos nessa area.",
    },
  ],
};

const ROAD_SIGNS = [
  { name: "Stop Sign", img: "/signs/stop.png", description: "Come to a complete stop. Check traffic before going." },
  { name: "Yield Sign", img: "/signs/yield.png", description: "Slow down and give way to other traffic." },
  { name: "Speed Limit", img: "/signs/speed-limit.png", description: "The maximum speed allowed on this road." },
  { name: "Warning Sign", img: "/signs/traffic-signal-ahead.png", description: "Caution — a hazard or change is ahead." },
];

function parseSlug(slug: string): { stateKey: string; langKey: string } | null {
  const langKeys = Object.keys(LANGUAGES);
  for (const lang of langKeys) {
    for (const pattern of [`-dmv-practice-test-${lang}`, `-permit-test-${lang}`]) {
      if (slug.endsWith(pattern)) {
        const stateKey = slug.slice(0, -pattern.length);
        if (STATES[stateKey]) return { stateKey, langKey: lang };
      }
    }
  }
  return null;
}

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const stateKey of Object.keys(STATES)) {
    for (const langKey of Object.keys(LANGUAGES)) {
      params.push({ slug: `${stateKey}-dmv-practice-test-${langKey}` });
      params.push({ slug: `${stateKey}-permit-test-${langKey}` });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const parsed = parseSlug(params.slug);
  if (!parsed) return {};
  const state = STATES[parsed.stateKey];
  const lang = LANGUAGES[parsed.langKey];
  return {
    title: `${state.name} DMV Practice Test in ${lang.name} (${lang.nativeName}) — Free 2026`,
    description: `Free ${state.name} DMV practice test for ${lang.name} speakers. ${state.questionsCount} questions with simple explanations. Pass your permit test on the first try.`,
    keywords: [`${state.name} DMV test ${lang.name}`, `${state.name} permit test ${lang.name.toLowerCase()}`, `DMV practice test ${lang.name.toLowerCase()}`],
    alternates: { canonical: `https://dmv-prep.com/${params.slug}` },
    openGraph: {
      title: `${state.name} DMV Practice Test in ${lang.name}`,
      description: `Free practice for ${lang.name} speakers. Pass your ${state.name} DMV permit test first try.`,
      url: `https://dmv-prep.com/${params.slug}`,
    },
  };
}

export default function LanguageStatePage({ params }: { params: { slug: string } }) {
  const parsed = parseSlug(params.slug);
  if (!parsed) notFound();

  const state = STATES[parsed.stateKey];
  const lang = LANGUAGES[parsed.langKey];
  const questions = SAMPLE_QUESTIONS[parsed.langKey];
  const langAvail = state.langAvailability[parsed.langKey];
  const isEnglishOnly = parsed.stateKey in ENGLISH_ONLY_STATES;

  const practiceUrl = `/practice?state=${state.slug === "new-york" ? "NY" : state.slug === "north-carolina" ? "NC" : state.slug.slice(0,2).toUpperCase()}&lang=${parsed.langKey === "spanish" ? "es" : parsed.langKey === "chinese" ? "zh" : parsed.langKey === "vietnamese" ? "vi" : parsed.langKey === "portuguese" ? "pt" : parsed.langKey === "haitian-creole" ? "ht" : ""}`;
  const signsUrl = `/state/${state.slug}/road-sign-practice-test`;
  const handbookUrl = `/state/${state.slug}/dmv-handbook-summary`;
  const tipsUrl = `/state/${state.slug}/dmv-test-tips`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10">

        {/* Hero */}
        <div className="bg-blue-600 text-white rounded-2xl p-8 mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Globe className="w-6 h-6 opacity-80" />
            <span className="text-blue-200 text-sm font-medium uppercase tracking-wide">{lang.nativeName}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
            {state.name} DMV Practice Test<br />
            <span className="text-blue-200">in {lang.name}</span>
          </h1>
          <p className="text-blue-100 text-lg mb-2">{lang.heroSubtitle}</p>
          <p className="text-blue-200 text-sm mb-6">{state.questionsCount} questions · {state.passingScore}% to pass · Free to start</p>
          <Link href={practiceUrl} className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors text-lg">
            {lang.ctaLabel}
          </Link>
        </div>

        {/* English-only warning banner */}
        {isEnglishOnly && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 mb-6 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-800 mb-1">Important: {state.name} Real Test is English Only</p>
              <p className="text-sm text-amber-700">{ENGLISH_ONLY_STATES[parsed.stateKey]} Use DMVPrep Pro to understand the material in your language, then practice reading and answering questions in English before your appointment.</p>
            </div>
          </div>
        )}

        {/* About */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">About the {state.name} DMV Test</h2>
          <p className="text-gray-700 leading-relaxed mb-4">{lang.introParagraph}</p>
          <p className="text-gray-700 leading-relaxed">
            The {state.name} DMV written test has <strong>{state.questionsCount} questions</strong>. You need to answer <strong>{state.passingScore}%</strong> correctly to pass. {state.highlight}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="bg-blue-50 rounded-xl p-3">
              <div className="text-2xl font-extrabold text-blue-600">{state.questionsCount}</div>
              <div className="text-xs text-gray-500">Questions</div>
            </div>
            <div className="bg-green-50 rounded-xl p-3">
              <div className="text-2xl font-extrabold text-green-600">{state.passingScore}%</div>
              <div className="text-xs text-gray-500">To Pass</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-3">
              <div className="text-2xl font-extrabold text-yellow-600">Free</div>
              <div className="text-xs text-gray-500">To Practice</div>
            </div>
          </div>
        </div>

        {/* Sample questions with translations */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">{lang.sampleLabel}</h2>
          <p className="text-sm text-gray-500 mb-4">Each question is shown in English and {lang.name}. The real test is in English — practice both.</p>
          <div className="space-y-6">
            {questions.map((q, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <p className="font-semibold text-gray-900 mb-1">{i + 1}. {q.english}</p>
                <p className="text-sm text-blue-700 italic mb-3">{q.translated}</p>
                <div className="space-y-2 mb-3">
                  {q.options.map((opt, j) => (
                    <div key={j} className={`px-3 py-2 rounded-lg text-sm border ${j === q.correct ? "bg-green-50 border-green-300 text-green-800 font-medium" : "bg-white border-gray-200 text-gray-600"}`}>
                      {j === q.correct && <CheckCircle className="w-3.5 h-3.5 inline mr-1.5 text-green-600" />}
                      {opt.english}
                      {j === q.correct && <span className="ml-2 text-green-600 italic text-xs">/ {opt.translated}</span>}
                    </div>
                  ))}
                </div>
                <div className="rounded-lg overflow-hidden border border-blue-100">
                  <div className="bg-blue-50 px-3 py-2 flex gap-2 text-sm text-blue-800">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{q.explanationEnglish}</span>
                  </div>
                  <div className="bg-blue-50 border-t border-blue-100 px-3 py-2 text-sm text-blue-700 italic">
                    {q.explanationTranslated}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link href={practiceUrl} className="btn-primary w-full text-center block mt-5">
            Practice All {state.questionsCount} Questions
          </Link>
        </div>

        {/* Study tips */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{lang.studyTipsHeading}</h2>
          <ul className="space-y-3">
            {lang.studyTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                <span className="text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Road signs */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">{lang.signLabel}</h2>
          <p className="text-sm text-gray-500 mb-4">Road signs are on every DMV test. Learn these 4 first.</p>
          <div className="grid grid-cols-2 gap-3">
            {ROAD_SIGNS.map((sign) => (
              <div key={sign.name} className="border border-gray-100 rounded-xl p-4 text-center bg-white">
                <img src={sign.img} alt={sign.name} className="w-12 h-12 object-contain mx-auto mb-2" />
                <div className="font-semibold text-gray-900 text-sm mb-1">{sign.name}</div>
                <div className="text-xs text-gray-500">{sign.description}</div>
              </div>
            ))}
          </div>
          <Link href={signsUrl} className="btn-secondary w-full text-center block mt-4">
            Practice All Road Signs
          </Link>
        </div>

        {/* FAQ with accurate per-state language info */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{lang.faqHeading}</h2>
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-semibold text-gray-900 mb-1">Can I take the {state.name} DMV test in {lang.name}?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{langAvail}</p>
            </div>
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-semibold text-gray-900 mb-1">How many questions are on the {state.name} DMV test?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">The {state.name} DMV written test has {state.questionsCount} questions. You need to answer {state.passingScore}% correctly to pass. That means getting at least {Math.ceil(state.questionsCount * state.passingScore / 100)} questions right.</p>
            </div>
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-semibold text-gray-900 mb-1">What if I fail the DMV test?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">You can retake it. Most states make you wait a few days before trying again. Use that time to practice more with DMVPrep Pro.</p>
            </div>
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-semibold text-gray-900 mb-1">Why should I practice in English even if my language is available?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Even if your state offers the test in your language, practicing in English helps you understand road signs and instructions you will see every day while driving in the US. Signs, markings, and police instructions are always in English.</p>
            </div>
            <div className="last:border-0">
              <h3 className="font-semibold text-gray-900 mb-1">Is this site free?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Yes, you can practice for free. A premium plan unlocks all 50 states and the translation feature for every question.</p>
            </div>
          </div>
        </div>

        {/* Internal links */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">More {state.name} DMV Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: practiceUrl, label: `${state.name} Practice Test`, sub: `Full ${state.questionsCount}-question test` },
              { href: signsUrl, label: "Road Sign Test", sub: "Visual sign practice" },
              { href: handbookUrl, label: "Handbook Summary", sub: "Key rules, plain English" },
              { href: tipsUrl, label: "Test Tips and Guide", sub: "How to prepare and pass" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900 text-sm">{link.label}</div>
                  <div className="text-xs text-gray-500">{link.sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-blue-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Ready to pass your {state.name} DMV test?</h2>
          <p className="text-blue-100 mb-6">Start practicing now — free, no account needed.</p>
          <Link href={practiceUrl} className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">
            {lang.ctaLabel}
          </Link>
        </div>

      </main>
      <Footer />
    </div>
  );
}
