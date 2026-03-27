import Link from 'next/link'
import { CheckCircle, AlertCircle, BookOpen, Globe } from 'lucide-react'

const STATE_DATA: Record<string, { name: string; abbr: string; totalQuestions: number; passingScore: string; passingCorrect: number }> = {
  florida:          { name: 'Florida',        abbr: 'FL', totalQuestions: 50, passingScore: '80%', passingCorrect: 40 },
  california:       { name: 'California',     abbr: 'CA', totalQuestions: 46, passingScore: '83%', passingCorrect: 38 },
  texas:            { name: 'Texas',          abbr: 'TX', totalQuestions: 40, passingScore: '70%', passingCorrect: 28 },
  'new-york':       { name: 'New York',       abbr: 'NY', totalQuestions: 20, passingScore: '70%', passingCorrect: 14 },
  pennsylvania:     { name: 'Pennsylvania',   abbr: 'PA', totalQuestions: 18, passingScore: '83%', passingCorrect: 15 },
  illinois:         { name: 'Illinois',       abbr: 'IL', totalQuestions: 35, passingScore: '80%', passingCorrect: 28 },
  ohio:             { name: 'Ohio',           abbr: 'OH', totalQuestions: 40, passingScore: '75%', passingCorrect: 30 },
  georgia:          { name: 'Georgia',        abbr: 'GA', totalQuestions: 40, passingScore: '75%', passingCorrect: 30 },
  'north-carolina': { name: 'North Carolina', abbr: 'NC', totalQuestions: 25, passingScore: '80%', passingCorrect: 20 },
  michigan:         { name: 'Michigan',       abbr: 'MI', totalQuestions: 50, passingScore: '80%', passingCorrect: 40 },
}

const LANGUAGE_DATA: Record<string, {
  nativeName: string
  h1Suffix: string
  subtitle: string
  startBtn: string
  disclaimer: string
  testAvailable: string
  studyTipsTitle: string
  studyTips: string[]
  faqTitle: string
  sampleTitle: string
  resourcesTitle: string
  otherLangsTitle: string
}> = {
  spanish: {
    nativeName: 'Español',
    h1Suffix: 'en Español',
    subtitle: 'Practica las preguntas del examen de manejo con explicaciones claras en español.',
    startBtn: 'Comenzar Examen de Práctica — Gratis',
    disclaimer: 'Las preguntas del examen real del DMV están en inglés. Usa este sitio para entender el material en español y luego practica en inglés antes de tu cita.',
    testAvailable: 'Muchos estados del DMV ofrecen el examen escrito en español. Consulta con tu oficina local del DMV para confirmar.',
    studyTipsTitle: 'Consejos de Estudio / Study Tips',
    studyTips: [
      'Lee cada pregunta despacio. No te apures. / Read each question slowly. Do not rush.',
      'Aprende las señales de tránsito — aparecen en todos los exámenes del DMV. / Learn road signs — they appear on every DMV test.',
      'Practica el examen completo al menos 3 veces antes de tu cita real. / Take the full practice test at least 3 times before your real appointment.',
      'Estudia las reglas de velocidad — varían según el tipo de carretera. / Study speed limit rules — they vary by road type.',
      'Descansa bien la noche antes del examen. / Get a good night\'s sleep before your test day.',
    ],
    faqTitle: 'Preguntas Frecuentes / Frequently Asked Questions',
    sampleTitle: 'Temas del Examen / Test Topics',
    resourcesTitle: 'Más Recursos del DMV / More DMV Resources',
    otherLangsTitle: 'También disponible en / Also available in:',
  },
  chinese: {
    nativeName: '中文',
    h1Suffix: '中文版',
    subtitle: '用简单易懂的中文练习驾驶执照考试题目，帮助您顺利通过DMV笔试。',
    startBtn: '开始免费练习考试',
    disclaimer: '实际DMV考试为英文。请使用本网站理解中文材料，然后在预约前练习英文版本。',
    testAvailable: '部分州DMV提供中文笔试。请联系当地DMV办公室确认是否提供中文考试。',
    studyTipsTitle: '学习建议 / Study Tips',
    studyTips: [
      '从交通标志开始学习——标志是视觉性的，容易记忆。 / Start with road signs — they are visual and easy to learn.',
      '仔细阅读每道题，不要急于作答。 / Read each question carefully before answering.',
      '在正式考试前至少完整练习3次。 / Complete at least 3 full practice tests before your appointment.',
      '重点学习让行规则——这是考试的常见考点。 / Focus on right-of-way rules — they appear frequently on the test.',
      '考试前一天晚上好好休息。 / Get a good night\'s sleep before your test day.',
    ],
    faqTitle: '常见问题 / Frequently Asked Questions',
    sampleTitle: '考试主题 / Test Topics',
    resourcesTitle: '更多DMV资源 / More DMV Resources',
    otherLangsTitle: '其他语言版本 / Also available in:',
  },
  vietnamese: {
    nativeName: 'Tiếng Việt',
    h1Suffix: 'Tiếng Việt',
    subtitle: 'Luyện tập câu hỏi thi bằng lái xe với giải thích rõ ràng bằng tiếng Việt.',
    startBtn: 'Bắt Đầu Luyện Thi Miễn Phí',
    disclaimer: 'Bài thi thực tế của DMV bằng tiếng Anh. Hãy dùng trang này để hiểu tài liệu bằng tiếng Việt, sau đó luyện tập bằng tiếng Anh trước buổi hẹn của bạn.',
    testAvailable: 'Một số tiểu bang DMV cung cấp bài thi bằng tiếng Việt. Hãy liên hệ văn phòng DMV địa phương để xác nhận.',
    studyTipsTitle: 'Mẹo Học Thi / Study Tips',
    studyTips: [
      'Bắt đầu với biển báo giao thông — chúng trực quan và dễ nhớ. / Start with road signs — they are visual and easy to learn.',
      'Đọc kỹ từng câu hỏi trước khi trả lời. / Read each question carefully before answering.',
      'Hoàn thành ít nhất 3 bài kiểm tra đầy đủ trước ngày thi thật. / Complete at least 3 full practice tests before your appointment.',
      'Tập trung vào quy tắc nhường đường — thường xuất hiện nhiều trong bài thi. / Focus on right-of-way rules — they appear frequently on the test.',
      'Ngủ đủ giấc vào đêm trước ngày thi. / Get a good night\'s sleep before your test day.',
    ],
    faqTitle: 'Câu Hỏi Thường Gặp / Frequently Asked Questions',
    sampleTitle: 'Chủ Đề Thi / Test Topics',
    resourcesTitle: 'Thêm Tài Nguyên DMV / More DMV Resources',
    otherLangsTitle: 'Cũng có sẵn bằng / Also available in:',
  },
  portuguese: {
    nativeName: 'Português',
    h1Suffix: 'em Português',
    subtitle: 'Pratique as questões do exame de motorista com explicações claras em português.',
    startBtn: 'Iniciar Exame de Prática Grátis',
    disclaimer: 'O exame real do DMV é em inglês. Use este site para entender o material em português e depois pratique em inglês antes da sua consulta.',
    testAvailable: 'Alguns estados do DMV oferecem o exame escrito em português. Verifique com seu DMV local para confirmar.',
    studyTipsTitle: 'Dicas de Estudo / Study Tips',
    studyTips: [
      'Comece com as placas de trânsito — elas são visuais e fáceis de aprender. / Start with road signs — they are visual and easy to learn.',
      'Leia cada pergunta com atenção antes de responder. / Read each question carefully before answering.',
      'Complete pelo menos 3 testes completos antes da sua consulta real. / Complete at least 3 full practice tests before your appointment.',
      'Foque nas regras de preferência de passagem — aparecem frequentemente no exame. / Focus on right-of-way rules — they appear frequently on the test.',
      'Durma bem na noite anterior ao exame. / Get a good night\'s sleep before your test day.',
    ],
    faqTitle: 'Perguntas Frequentes / Frequently Asked Questions',
    sampleTitle: 'Tópicos do Exame / Test Topics',
    resourcesTitle: 'Mais Recursos do DMV / More DMV Resources',
    otherLangsTitle: 'Também disponível em / Also available in:',
  },
  'haitian-creole': {
    nativeName: 'Krèyòl Ayisyen',
    h1Suffix: 'an Krèyòl Ayisyen',
    subtitle: 'Pratike kesyon egzamen lisans kondwi a ak eksplikasyon klè an kreyòl ayisyen.',
    startBtn: 'Kòmanse Pratike Gratis',
    disclaimer: 'Egzamen DMV reyèl la an anglè. Itilize sit sa a pou konprann materyèl la an kreyòl, epi pratike an anglè anvan randevou ou a.',
    testAvailable: 'Kèk eta DMV ofri egzamen konesans an kreyòl ayisyen. Kontakte biwo DMV lokal ou pou konfime.',
    studyTipsTitle: 'Konsèy Etid / Study Tips',
    studyTips: [
      'Kòmanse ak siy wout — yo vizyèl epi fasil pou aprann. / Start with road signs — they are visual and easy to learn.',
      'Li chak kesyon avèk atansyon anvan ou reponn. / Read each question carefully before answering.',
      'Fè omwen 3 tès konplè anvan randevou reyèl ou a. / Complete at least 3 full practice tests before your appointment.',
      'Konsantre sou règ pase wout — yo parèt souvan nan tès la. / Focus on right-of-way rules — they appear frequently on the test.',
      'Dòmi byen aswè anvan jou egzamen ou a. / Get a good night\'s sleep before your test day.',
    ],
    faqTitle: 'Kesyon Yo Poze Souvan / Frequently Asked Questions',
    sampleTitle: 'Sijè Tès / Test Topics',
    resourcesTitle: 'Plis Resous DMV / More DMV Resources',
    otherLangsTitle: 'Disponib tou nan / Also available in:',
  },
}

const TOPICS = [
  'Road Signs & Signals', 'Right of Way', 'Speed Limits',
  'Alcohol & DUI Laws', 'Parking Rules', 'Safe Driving',
  'Distracted Driving', 'Emergency Vehicles', 'Teen & GDL Rules', 'Highway Driving',
]

export function buildLanguagePageMetadata(stateSlug: string, language: string) {
  const state = STATE_DATA[stateSlug]
  const lang = LANGUAGE_DATA[language]
  if (!state || !lang) return { title: '', description: '' }
  return {
    title: `${state.name} DMV Practice Test ${lang.h1Suffix} 2026 — Free | DMV Prep`,
    description: `Free ${state.name} DMV practice test for ${lang.nativeName} speakers. ${state.totalQuestions} questions, ${state.passingScore} to pass. Study in ${lang.nativeName}, pass in English. No signup required.`,
    alternates: {
      canonical: `https://dmv-prep.com/${stateSlug}-dmv-practice-test-${language}`,
      languages: {
        'en': `https://dmv-prep.com/state/${stateSlug}/dmv-practice-test`,
        'x-default': `https://dmv-prep.com/state/${stateSlug}/dmv-practice-test`,
      }
    },
  }
}

export default function LanguagePracticePage({ stateSlug, language }: { stateSlug: string; language: string }) {
  const state = STATE_DATA[stateSlug]
  const lang = LANGUAGE_DATA[language]
  if (!state || !lang) return null

  const stateTestUrl = `/state/${stateSlug}/dmv-practice-test`
  const LANG_CODES: Record<string,string> = { spanish:"es", chinese:"zh", vietnamese:"vi", portuguese:"pt", "haitian-creole":"ht" }
  const practiceUrl = "/register"
  const signsUrl     = `/state/${stateSlug}/road-sign-practice-test`
  const handbookUrl  = `/state/${stateSlug}/dmv-handbook-summary`

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Can I take the ${state.name} DMV test in ${lang.nativeName}?`,
        acceptedAnswer: { '@type': 'Answer', text: lang.testAvailable },
      },
      {
        '@type': 'Question',
        name: `How many questions are on the ${state.name} DMV test?`,
        acceptedAnswer: { '@type': 'Answer', text: `The ${state.name} DMV written test has ${state.totalQuestions} questions. You need ${state.passingScore} (${state.passingCorrect} correct) to pass.` },
      },
      {
        '@type': 'Question',
        name: `What if I fail the ${state.name} DMV test?`,
        acceptedAnswer: { '@type': 'Answer', text: `You can retake the test after a short waiting period. Use that time to practice more with DMV Prep, focusing on the topics you missed.` },
      },
    ],
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex flex-wrap gap-1.5">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>›</span>
        <Link href={stateTestUrl} className="hover:text-blue-600">{state.name} DMV Practice Test</Link>
        <span>›</span>
        <span>{lang.nativeName}</span>
      </nav>

      {/* Hero */}
      <div className="bg-blue-600 text-white rounded-2xl p-8 mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Globe className="w-5 h-5 opacity-80" />
          <span className="text-blue-200 text-sm font-medium">{lang.nativeName}</span>
        </div>
        <h1 className="text-3xl font-extrabold mb-2 leading-tight">
          {state.name} DMV Practice Test<br />
          <span className="text-blue-200">{lang.h1Suffix}</span>
        </h1>
        <p className="text-blue-100 mb-2">{lang.subtitle}</p>
        <p className="text-blue-200 text-sm mb-6">{state.totalQuestions} questions · {state.passingScore} to pass · Free</p>
        <Link href={practiceUrl}
          className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors text-lg">
          {lang.startBtn}
        </Link>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">{lang.disclaimer}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8 text-center">
        <div className="bg-blue-50 rounded-xl p-3">
          <div className="text-2xl font-extrabold text-blue-600">{state.totalQuestions}</div>
          <div className="text-xs text-gray-500">Questions</div>
        </div>
        <div className="bg-green-50 rounded-xl p-3">
          <div className="text-2xl font-extrabold text-green-600">{state.passingScore}</div>
          <div className="text-xs text-gray-500">To Pass</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-3">
          <div className="text-2xl font-extrabold text-yellow-600">Free</div>
          <div className="text-xs text-gray-500">No Signup</div>
        </div>
      </div>

      {/* Test topics */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">{lang.sampleTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TOPICS.map(t => (
            <div key={t} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* Study tips */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">{lang.studyTipsTitle}</h2>
        <ul className="space-y-3">
          {lang.studyTips.map((tip, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
              <span className="text-sm text-gray-700">{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{lang.faqTitle}</h2>
        <div className="space-y-4">
          <div className="border border-gray-100 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-1">Can I take the {state.name} DMV test in {lang.nativeName}?</h3>
            <p className="text-sm text-gray-600">{lang.testAvailable}</p>
          </div>
          <div className="border border-gray-100 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-1">How many questions are on the {state.name} DMV test?</h3>
            <p className="text-sm text-gray-600">The {state.name} DMV written test has {state.totalQuestions} questions. You need {state.passingScore} ({state.passingCorrect} correct) to pass.</p>
          </div>
          <div className="border border-gray-100 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-1">Why should I practice in English even if my language is available?</h3>
            <p className="text-sm text-gray-600">Road signs, pavement markings, and police instructions in the US are always in English. Even if you test in your language, practicing in English helps you drive safely every day.</p>
          </div>
          <div className="border border-gray-100 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-1">What if I fail the {state.name} DMV test?</h3>
            <p className="text-sm text-gray-600">You can retake it after a short waiting period. Use that time to practice the topics you missed — road signs and right-of-way rules are the most common areas where people lose points.</p>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">{lang.resourcesTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { href: stateTestUrl, label: `${state.name} DMV Practice Test (English)`, sub: `Full ${state.totalQuestions}-question test` },
            { href: signsUrl,     label: 'Road Sign Practice Test',                   sub: 'Visual sign identification' },
            { href: handbookUrl,  label: `${state.name} Handbook Summary`,            sub: 'Key rules in plain English' },
            { href: '/dmv-faq',  label: 'DMV FAQ',                                   sub: 'Common questions answered' },
          ].map(link => (
            <Link key={link.href} href={link.href}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900 text-sm">{link.label}</div>
                <div className="text-xs text-gray-500">{link.sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Other languages */}
      <section className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-3">{lang.otherLangsTitle}</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(LANGUAGE_DATA).filter(([key]) => key !== language).map(([key, l]) => (
            <Link key={key} href={`/${stateSlug}-dmv-practice-test-${key}`}
              className="px-3 py-1.5 border rounded-lg text-sm hover:bg-blue-50 hover:border-blue-300 transition-colors">
              {l.nativeName}
            </Link>
          ))}
          <Link href={stateTestUrl}
            className="px-3 py-1.5 border rounded-lg text-sm hover:bg-blue-50 hover:border-blue-300 transition-colors">
            English
          </Link>
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="bg-blue-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Ready to pass your {state.name} DMV test?</h2>
        <p className="text-blue-100 mb-5">Free practice — no account needed.</p>
        <Link href={practiceUrl}
          className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">
          {lang.startBtn}
        </Link>
      </div>
    </main>
  )
}
