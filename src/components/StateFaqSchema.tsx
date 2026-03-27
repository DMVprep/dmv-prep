interface Props {
  stateName: string
  stateSlug: string
  totalQuestions: number
  passingScore: string
  passingCorrect: number
}
export default function StateFaqSchema({ stateName, stateSlug, totalQuestions, passingScore, passingCorrect }: Props) {
  const schema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: `How many questions are on the ${stateName} DMV test?`, acceptedAnswer: { '@type': 'Answer', text: `The ${stateName} DMV knowledge test has ${totalQuestions} questions. You must answer at least ${passingCorrect} correctly (${passingScore}) to pass.` } },
      { '@type': 'Question', name: `What score do you need to pass the ${stateName} DMV test?`, acceptedAnswer: { '@type': 'Answer', text: `You need ${passingScore} — ${passingCorrect} out of ${totalQuestions} correct — to pass the ${stateName} DMV written knowledge test.` } },
      { '@type': 'Question', name: `Is the ${stateName} DMV practice test free?`, acceptedAnswer: { '@type': 'Answer', text: `Yes. DMVPrep Pro offers a free ${stateName} DMV practice test with ${totalQuestions} questions and instant explanations. No credit card or account required.` } },
      { '@type': 'Question', name: `What topics are on the ${stateName} DMV permit test?`, acceptedAnswer: { '@type': 'Answer', text: `The ${stateName} DMV permit test covers traffic signs and signals, right-of-way rules, speed limits, safe driving practices, alcohol and drug laws, and state-specific traffic laws.` } },
      { '@type': 'Question', name: `Can I take the ${stateName} DMV test in another language?`, acceptedAnswer: { '@type': 'Answer', text: `${stateName} DMV offers the written test in multiple languages. DMVPrep Pro also offers practice in Spanish, Chinese, Vietnamese, and Portuguese.` } },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
