import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('arizona', 'chinese') }
export default function Page() { return <LanguagePracticePage stateSlug="arizona" language="chinese" /> }
