import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('arkansas', 'chinese') }
export default function Page() { return <LanguagePracticePage stateSlug="arkansas" language="chinese" /> }