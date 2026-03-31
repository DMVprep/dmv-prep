import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('maryland', 'chinese') }
export default function Page() { return <LanguagePracticePage stateSlug="maryland" language="chinese" /> }
