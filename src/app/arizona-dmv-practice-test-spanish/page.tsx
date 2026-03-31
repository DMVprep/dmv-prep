import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('arizona', 'spanish') }
export default function Page() { return <LanguagePracticePage stateSlug="arizona" language="spanish" /> }
