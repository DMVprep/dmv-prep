import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('maryland', 'vietnamese') }
export default function Page() { return <LanguagePracticePage stateSlug="maryland" language="vietnamese" /> }
