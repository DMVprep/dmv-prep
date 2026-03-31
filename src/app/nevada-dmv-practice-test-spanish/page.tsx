import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('nevada', 'spanish') }
export default function Page() { return <LanguagePracticePage stateSlug="nevada" language="spanish" /> }
