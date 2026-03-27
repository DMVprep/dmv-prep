import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('texas', 'spanish') }
export default function Page() { return <LanguagePracticePage stateSlug="texas" language="spanish" /> }
