import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('ohio', 'chinese') }
export default function Page() { return <LanguagePracticePage stateSlug="ohio" language="chinese" /> }
