import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('mississippi', 'chinese') }
export default function Page() { return <LanguagePracticePage stateSlug="mississippi" language="chinese" /> }