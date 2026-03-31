import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('kansas', 'chinese') }
export default function Page() { return <LanguagePracticePage stateSlug="kansas" language="chinese" /> }
