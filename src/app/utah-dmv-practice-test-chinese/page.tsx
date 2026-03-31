import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('utah', 'chinese') }
export default function Page() { return <LanguagePracticePage stateSlug="utah" language="chinese" /> }
