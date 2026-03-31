import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('arizona', 'vietnamese') }
export default function Page() { return <LanguagePracticePage stateSlug="arizona" language="vietnamese" /> }
