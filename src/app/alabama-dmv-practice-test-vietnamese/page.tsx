import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('alabama', 'vietnamese') }
export default function Page() { return <LanguagePracticePage stateSlug="alabama" language="vietnamese" /> }
